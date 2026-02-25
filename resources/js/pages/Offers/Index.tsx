import { ActionsDropdown } from '@/components/ActionsDropdown';
import ConfirmDeleteDialog from '@/components/confirm-delete-dialog';
import {
    FlashNotifications,
    useFlashNotifications,
} from '@/components/flash-notifications';
import { IndexHeader } from '@/components/IndexHeader';
import { Pagination } from '@/components/Pagination';
import { SearchInput } from '@/components/SearchInput';
import { SortableTableHeader } from '@/components/SortableTableHeader';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useTranslations } from '@/hooks/use-translations';
import AppLayout from '@/layouts/app-layout';
import articles from '@/routes/articles/index';
import offers from '@/routes/offers/index';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import {
    CheckCircle2,
    Clock,
    Copy,
    FileText,
    Loader2,
    Package,
    XCircle,
} from 'lucide-react';
import { useEffect, useState } from 'react';

type Customer = {
    uuid: string;
    company_name: string;
};

type Offer = {
    id: number;
    uuid: string;
    offer_number: string;
    offer_date?: string;
    validity_date?: string | null;
    approval_status?: number | null;
    approval_status_label?: string;
    description?: string | null;
    piece?: number | null;
    unit_of_measure?: string | null;
    customer?: Customer | null;
};

type OffersIndexProps = {
    offers: {
        data: Offer[];
        current_page: number;
        last_page: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
    customers: Customer[];
    filters: {
        search?: string;
        customer_uuid?: string;
        customerdivision_uuid?: string;
        sort_by?: string;
        sort_order?: 'asc' | 'desc';
    };
    flash?: {
        success?: string;
        error?: string;
    };
};

export default function OffersIndex() {
    const { t } = useTranslations();
    const { props } = usePage<OffersIndexProps>();
    const { offers: offersPaginated, customers, filters } = props;
    const { flash } = useFlashNotifications();

    const [searchValue, setSearchValue] = useState(filters.search ?? '');
    const [customerFilter, setCustomerFilter] = useState(
        filters.customer_uuid ?? '',
    );
    const [isSearching, setIsSearching] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState<{
        open: boolean;
        offer: Offer | null;
    }>({
        open: false,
        offer: null,
    });
    const [isDeleting, setIsDeleting] = useState(false);
    const [downloadingPdf, setDownloadingPdf] = useState<string | null>(null);

    // Sync initial state with server filters
    useEffect(() => {
        queueMicrotask(() => {
            setSearchValue(filters.search ?? '');
            setCustomerFilter(filters.customer_uuid ?? '');
        });
    }, [filters.search, filters.customer_uuid]);

    const handleSearchChange = (value: string) => {
        setIsSearching(true);
        router.get(
            offers.index().url,
            {
                search: value || undefined,
                customer_uuid: customerFilter || undefined,
                sort_by: filters.sort_by,
                sort_order: filters.sort_order,
            },
            {
                preserveState: true,
                preserveScroll: true,
                onFinish: () => setIsSearching(false),
            },
        );
    };

    const handleCustomerChange = (value: string) => {
        setCustomerFilter(value);
        router.get(
            offers.index().url,
            {
                search: searchValue || undefined,
                customer_uuid: value || undefined,
                sort_by: filters.sort_by,
                sort_order: filters.sort_order,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const handleSort = (column: string) => {
        const currentSort = filters.sort_by;
        const currentDirection = filters.sort_order || 'asc';

        let newDirection: 'asc' | 'desc' = 'asc';
        if (currentSort === column && currentDirection === 'asc') {
            newDirection = 'desc';
        }

        router.get(
            offers.index().url,
            {
                ...filters,
                sort_by: column,
                sort_order: newDirection,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const clearSearch = () => {
        setSearchValue('');
        router.get(
            offers.index().url,
            {
                customer_uuid: customerFilter || undefined,
                sort_by: filters.sort_by,
                sort_order: filters.sort_order,
            },
            { preserveState: true, preserveScroll: true },
        );
    };

    const handleDeleteClick = (offer: Offer) => {
        setDeleteDialog({ open: true, offer });
    };

    const handleDeleteConfirm = () => {
        if (!deleteDialog.offer) return;

        setIsDeleting(true);
        router.delete(offers.destroy({ offer: deleteDialog.offer.uuid }).url, {
            preserveScroll: true,
            onSuccess: () => {
                setDeleteDialog({ open: false, offer: null });
                setIsDeleting(false);
            },
            onError: () => {
                setIsDeleting(false);
            },
        });
    };

    /**
     * Download del PDF di un'offerta.
     * Usa iframe temporaneo per forzare il dialogo di salvataggio
     * ed evitare che il PDF si apra automaticamente in entrambe le modalità (normale e incognito).
     */
    const handleDownloadPdf = (offer: Offer) => {
        // Evitare download multipli simultanei dello stesso file
        if (downloadingPdf === offer.uuid) {
            return;
        }

        setDownloadingPdf(offer.uuid);

        try {
            // Create temporary invisible iframe to force download
            // This method works consistently in normal and incognito mode
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.style.visibility = 'hidden';
            iframe.style.width = '0';
            iframe.style.height = '0';
            iframe.setAttribute('aria-hidden', 'true');

            // Impostare src per scaricare il PDF
            // Le intestazioni Content-Disposition: attachment forzano il dialogo
            iframe.src = `/offers/${offer.uuid}/download-pdf`;

            // Add to DOM
            document.body.appendChild(iframe);

            // Pulire iframe dopo un delay
            // Il browser avvia il download e mostra il dialogo
            setTimeout(() => {
                if (document.body.contains(iframe)) {
                    document.body.removeChild(iframe);
                }
                setDownloadingPdf(null);
            }, 1000);
        } catch (error) {
            console.error('Errore nello scaricare il PDF:', error);
            setDownloadingPdf(null);

            // Show error message to user
            alert(
                error instanceof Error
                    ? t('offers.pdf_download_error', {
                          message: error.message,
                      })
                    : t('offers.pdf_download_error_fallback'),
            );
        }
    };

    /**
     * Mostra lo stato di approvazione con la relativa icona.
     */
    const renderApprovalStatus = (offer: Offer) => {
        const status = offer.approval_status;
        const label =
            offer.approval_status_label ??
            (status === 0
                ? t('offers.index.mobile_status_pending')
                : status === 1
                  ? t('offers.index.mobile_status_approved')
                  : status === 2
                    ? t('offers.index.mobile_status_rejected')
                    : t('common.empty_value'));

        if (status === null || status === undefined) {
            return <span className="text-muted-foreground">—</span>;
        }

        if (status === 1) {
            // Approvata - Verde con check
            return (
                <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-emerald-700 dark:text-emerald-300">
                        {label}
                    </span>
                </div>
            );
        }

        if (status === 2) {
            // Respinta - Rosso con X
            return (
                <div className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                    <span className="text-rose-700 dark:text-rose-300">
                        {label}
                    </span>
                </div>
            );
        }

        // In attesa di approvazione (status === 0) - Giallo/Arancione con orologio
        return (
            <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <span className="text-amber-700 dark:text-amber-300">
                    {label}
                </span>
            </div>
        );
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('nav.offers'),
            href: offers.index().url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('nav.offers')} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <IndexHeader
                    title={t('nav.offers')}
                    subtitle={t('offers.index.subtitle')}
                    createHref={offers.create().url}
                    createLabel={t('offers.index.create')}
                />

                <FlashNotifications flash={flash} />

                <div className="flex flex-col gap-3 rounded-xl border border-sidebar-border/70 bg-card p-4 dark:border-sidebar-border">
                    <div className="grid gap-3 md:grid-cols-2">
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-muted-foreground">
                                {t('common.search')}
                            </label>
                            <SearchInput
                                value={searchValue}
                                onChange={handleSearchChange}
                                placeholder={t('offers.search_placeholder')}
                                isLoading={isSearching}
                                onClear={clearSearch}
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-medium text-muted-foreground">
                                {t('common.customer')}
                            </label>
                            <Select
                                value={customerFilter || 'all'}
                                onValueChange={(value) =>
                                    handleCustomerChange(
                                        value === 'all' ? '' : value,
                                    )
                                }
                            >
                                <SelectTrigger
                                    className="w-full"
                                    aria-label={t('common.customer')}
                                >
                                    <SelectValue
                                        placeholder={t('filter.all_customers')}
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        {t('filter.all_customers')}
                                    </SelectItem>
                                    {customers.map((customer) => (
                                        <SelectItem
                                            key={customer.uuid}
                                            value={customer.uuid}
                                        >
                                            {customer.company_name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                {/* Vista mobile */}
                <div className="block space-y-3 p-4 md:hidden">
                    {offersPaginated.data.length === 0 ? (
                        <div className="py-8 text-center text-sm text-muted-foreground">
                            {t('offers.index.empty')}
                        </div>
                    ) : (
                        offersPaginated.data.map((offer) => (
                            <div
                                key={offer.uuid}
                                className="space-y-2 rounded-lg border p-4 transition-colors hover:bg-muted/40"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <h3 className="font-medium">
                                            {offer.offer_number}
                                        </h3>
                                        <p className="mt-1 text-sm text-muted-foreground">
                                            {offer.customer?.company_name ??
                                                '—'}
                                        </p>
                                        <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
                                            {offer.offer_date && (
                                                <span>
                                                    {t(
                                                        'offers.index.mobile_date_label',
                                                    )}{' '}
                                                    {new Date(
                                                        offer.offer_date,
                                                    ).toLocaleDateString(
                                                        'it-IT',
                                                    )}
                                                </span>
                                            )}
                                            {offer.validity_date && (
                                                <span>
                                                    {t(
                                                        'offers.index.mobile_validity_label',
                                                    )}{' '}
                                                    {new Date(
                                                        offer.validity_date,
                                                    ).toLocaleDateString(
                                                        'it-IT',
                                                    )}
                                                </span>
                                            )}
                                        </div>
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            {offer.approval_status_label ??
                                                (offer.approval_status === 0
                                                    ? t(
                                                          'offers.index.mobile_status_pending',
                                                      )
                                                    : offer.approval_status ===
                                                        1
                                                      ? t(
                                                            'offers.index.mobile_status_approved',
                                                        )
                                                      : offer.approval_status ===
                                                          2
                                                        ? t(
                                                              'offers.index.mobile_status_rejected',
                                                          )
                                                        : '—')}
                                        </p>
                                    </div>
                                    <ActionsDropdown
                                        viewHref={
                                            offers.show({
                                                offer: offer.uuid,
                                            }).url
                                        }
                                        editHref={
                                            offers.edit({
                                                offer: offer.uuid,
                                            }).url
                                        }
                                        onDelete={() =>
                                            handleDeleteClick(offer)
                                        }
                                        extraItems={
                                            <>
                                                <DropdownMenuItem
                                                    onSelect={(e) => {
                                                        e.preventDefault();
                                                        router.visit(
                                                            offers.create({
                                                                query: {
                                                                    duplicate_from:
                                                                        offer.uuid,
                                                                },
                                                            }).url,
                                                        );
                                                    }}
                                                >
                                                    <Copy className="mr-2 h-4 w-4" />
                                                    {t(
                                                        'offers.actions.duplicate',
                                                    )}
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onSelect={(e) => {
                                                        e.preventDefault();
                                                        router.visit(
                                                            articles.create({
                                                                query: {
                                                                    offer_uuid:
                                                                        offer.uuid,
                                                                },
                                                            }).url,
                                                        );
                                                    }}
                                                >
                                                    <Package className="mr-2 h-4 w-4" />
                                                    {t(
                                                        'offers.actions.convert_to_article',
                                                    )}
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onSelect={(e) => {
                                                        e.preventDefault();
                                                        handleDownloadPdf(
                                                            offer,
                                                        );
                                                    }}
                                                    disabled={
                                                        downloadingPdf ===
                                                        offer.uuid
                                                    }
                                                >
                                                    {downloadingPdf ===
                                                    offer.uuid ? (
                                                        <>
                                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                            {t(
                                                                'offers.actions.generating_pdf',
                                                            )}
                                                        </>
                                                    ) : (
                                                        <>
                                                            <FileText className="mr-2 h-4 w-4" />
                                                            {t(
                                                                'offers.actions.generate_pdf',
                                                            )}
                                                        </>
                                                    )}
                                                </DropdownMenuItem>
                                            </>
                                        }
                                    />
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Vista desktop (schermo grande) */}
                <div className="relative hidden min-h-[300px] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 bg-card md:block dark:border-sidebar-border">
                    <div className="relative h-full w-full overflow-auto">
                        <table className="min-w-full border-separate border-spacing-0 text-left text-sm">
                            <thead className="sticky top-0 z-10 bg-muted/80 backdrop-blur">
                                <tr className="text-xs tracking-wide text-muted-foreground uppercase">
                                    <th className="border-b px-3 py-2 font-medium">
                                        ID
                                    </th>
                                    <th className="border-b px-3 py-2 font-medium">
                                        UUID
                                    </th>
                                    <th className="border-b px-3 py-2 font-medium">
                                        {t('offers.table.customer')}
                                    </th>
                                    <SortableTableHeader
                                        column="offer_number"
                                        currentSort={filters.sort_by}
                                        currentDirection={filters.sort_order}
                                        onSort={handleSort}
                                    >
                                        {t('offers.table.number')}
                                    </SortableTableHeader>
                                    <SortableTableHeader
                                        column="offer_date"
                                        currentSort={filters.sort_by}
                                        currentDirection={filters.sort_order}
                                        onSort={handleSort}
                                    >
                                        {t('offers.table.date')}
                                    </SortableTableHeader>
                                    <SortableTableHeader
                                        column="validity_date"
                                        currentSort={filters.sort_by}
                                        currentDirection={filters.sort_order}
                                        onSort={handleSort}
                                    >
                                        {t('offers.table.validity')}
                                    </SortableTableHeader>
                                    <SortableTableHeader
                                        column="approval_status"
                                        currentSort={filters.sort_by}
                                        currentDirection={filters.sort_order}
                                        onSort={handleSort}
                                    >
                                        {t('offers.table.approval')}
                                    </SortableTableHeader>
                                    <th className="border-b px-3 py-2 text-right font-medium">
                                        {t('offers.table.actions')}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {offersPaginated.data.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={8}
                                            className="px-3 py-6 text-center text-sm text-muted-foreground"
                                        >
                                            {t('offers.index.empty')}
                                        </td>
                                    </tr>
                                )}
                                {offersPaginated.data.map((offer) => (
                                    <tr
                                        key={offer.uuid}
                                        className="border-b last:border-b-0 hover:bg-muted/40"
                                    >
                                        <td className="px-3 py-2 align-middle text-xs">
                                            {offer.id}
                                        </td>
                                        <td className="px-3 py-2 align-middle font-mono text-xs">
                                            {offer.uuid}
                                        </td>
                                        <td className="px-3 py-2 align-middle">
                                            {offer.customer?.company_name ??
                                                '—'}
                                        </td>
                                        <td className="px-3 py-2 align-middle">
                                            {offer.offer_number}
                                        </td>
                                        <td className="px-3 py-2 align-middle text-xs">
                                            {offer.offer_date
                                                ? new Date(
                                                      offer.offer_date,
                                                  ).toLocaleDateString('it-IT')
                                                : '—'}
                                        </td>
                                        <td className="px-3 py-2 align-middle text-xs">
                                            {offer.validity_date
                                                ? new Date(
                                                      offer.validity_date,
                                                  ).toLocaleDateString('it-IT')
                                                : '—'}
                                        </td>
                                        <td className="px-3 py-2 align-middle text-xs">
                                            {renderApprovalStatus(offer)}
                                        </td>
                                        <td className="px-3 py-2 text-right align-middle text-xs">
                                            <ActionsDropdown
                                                viewHref={
                                                    offers.show({
                                                        offer: offer.uuid,
                                                    }).url
                                                }
                                                editHref={
                                                    offers.edit({
                                                        offer: offer.uuid,
                                                    }).url
                                                }
                                                onDelete={() =>
                                                    handleDeleteClick(offer)
                                                }
                                                extraItems={
                                                    <>
                                                        <DropdownMenuItem
                                                            onSelect={(e) => {
                                                                e.preventDefault();
                                                                router.visit(
                                                                    offers.create(
                                                                        {
                                                                            query: {
                                                                                duplicate_from:
                                                                                    offer.uuid,
                                                                            },
                                                                        },
                                                                    ).url,
                                                                );
                                                            }}
                                                        >
                                                            <Copy className="mr-2 h-4 w-4" />
                                                            {t(
                                                                'offers.actions.duplicate',
                                                            )}
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onSelect={(e) => {
                                                                e.preventDefault();
                                                                router.visit(
                                                                    articles.create(
                                                                        {
                                                                            query: {
                                                                                offer_uuid:
                                                                                    offer.uuid,
                                                                            },
                                                                        },
                                                                    ).url,
                                                                );
                                                            }}
                                                        >
                                                            <Package className="mr-2 h-4 w-4" />
                                                            {t(
                                                                'offers.actions.convert_to_article',
                                                            )}
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onSelect={(e) => {
                                                                e.preventDefault();
                                                                handleDownloadPdf(
                                                                    offer,
                                                                );
                                                            }}
                                                            disabled={
                                                                downloadingPdf ===
                                                                offer.uuid
                                                            }
                                                        >
                                                            {downloadingPdf ===
                                                            offer.uuid ? (
                                                                <>
                                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                                    {t(
                                                                        'offers.actions.generating_pdf',
                                                                    )}
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <FileText className="mr-2 h-4 w-4" />
                                                                    {t(
                                                                        'offers.actions.generate_pdf',
                                                                    )}
                                                                </>
                                                            )}
                                                        </DropdownMenuItem>
                                                    </>
                                                }
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <Pagination
                    links={offersPaginated.links}
                    currentPage={offersPaginated.current_page}
                    lastPage={offersPaginated.last_page}
                />

                <ConfirmDeleteDialog
                    open={deleteDialog.open}
                    onOpenChange={(open) =>
                        setDeleteDialog({ open, offer: deleteDialog.offer })
                    }
                    onConfirm={handleDeleteConfirm}
                    title={t('offers.delete_title')}
                    description={t('offers.delete_description')}
                    itemName={deleteDialog.offer?.offer_number}
                    isLoading={isDeleting}
                />
            </div>
        </AppLayout>
    );
}
