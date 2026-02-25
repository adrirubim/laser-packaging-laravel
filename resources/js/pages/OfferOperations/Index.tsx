import { ActionsDropdown } from '@/components/ActionsDropdown';
import ConfirmDeleteDialog from '@/components/confirm-delete-dialog';
import {
    FlashNotifications,
    useFlashNotifications,
} from '@/components/flash-notifications';
import { IndexHeader } from '@/components/IndexHeader';
import { Pagination } from '@/components/Pagination';
import { SearchInput } from '@/components/SearchInput';
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
import offerOperations from '@/routes/offer-operations';
import offers from '@/routes/offers/index';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { Download } from 'lucide-react';
import { useEffect, useState } from 'react';

// Format integers (no decimals)
const formatInteger = (value: number | null | undefined): string => {
    if (value === null || value === undefined || isNaN(value)) {
        return '—';
    }
    return Math.round(value)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

type OfferOperation = {
    id: number;
    uuid: string;
    category_uuid?: string;
    codice?: string;
    codice_univoco?: string;
    descrizione?: string;
    secondi_operazione?: number;
    filename?: string;
    category?: {
        name: string;
    };
};

const getFileDisplayName = (path?: string | null): string => {
    if (!path) return '—';
    const base = path.split('/').pop() ?? path;
    const parts = base.split('_');
    return parts.length > 1 ? parts.slice(1).join('_') : base;
};

type OfferOperationCategory = {
    uuid: string;
    name: string;
};

type OfferOperationsIndexProps = {
    operations: {
        data: OfferOperation[];
        current_page: number;
        last_page: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
    categories: OfferOperationCategory[];
    filters: {
        search?: string;
        category_uuid?: string;
    };
    flash?: {
        success?: string;
        error?: string;
    };
};

export default function OfferOperationsIndex() {
    const { props } = usePage<OfferOperationsIndexProps>();
    const { operations: operationsPaginated, categories, filters } = props;
    const { flash } = useFlashNotifications();
    const { t } = useTranslations();

    const [searchValue, setSearchValue] = useState(filters.search ?? '');
    const [isSearching, setIsSearching] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState<{
        open: boolean;
        operation: OfferOperation | null;
    }>({
        open: false,
        operation: null,
    });
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        queueMicrotask(() => setSearchValue(filters.search ?? ''));
    }, [filters.search]);

    const handleSearchChange = (value: string) => {
        setIsSearching(true);
        router.get(
            offerOperations.index().url,
            {
                ...filters,
                search: value || undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
                onFinish: () => setIsSearching(false),
            },
        );
    };

    const clearSearch = () => {
        setSearchValue('');
        router.get(
            offerOperations.index().url,
            {
                category_uuid: filters.category_uuid,
            },
            { preserveState: true, preserveScroll: true },
        );
    };

    const handleDeleteClick = (operation: OfferOperation) => {
        setDeleteDialog({ open: true, operation });
    };

    const handleDeleteConfirm = () => {
        if (!deleteDialog.operation) return;

        setIsDeleting(true);
        router.delete(
            offerOperations.destroy({
                offerOperation: deleteDialog.operation.uuid,
            }).url,
            {
                preserveScroll: true,
                onSuccess: () => {
                    setDeleteDialog({ open: false, operation: null });
                    setIsDeleting(false);
                },
                onError: () => {
                    setIsDeleting(false);
                },
            },
        );
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('nav.offers'), href: offers.index().url },
        {
            title: t('offer_operations.page_title'),
            href: offerOperations.index().url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('offer_operations.page_title')} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <IndexHeader
                    title={t('offer_operations.page_title')}
                    subtitle={t('offer_operations.index.subtitle')}
                    createHref={offerOperations.create().url}
                    createLabel={t('offer_operations.create')}
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
                                placeholder={t(
                                    'offer_operations.search_placeholder',
                                )}
                                isLoading={isSearching}
                                onClear={clearSearch}
                            />
                        </div>

                        {categories.length > 0 && (
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-muted-foreground">
                                    {t('common.category')}
                                </label>
                                <Select
                                    value={
                                        (filters.category_uuid ?? '') || 'all'
                                    }
                                    onValueChange={(value) => {
                                        const next =
                                            value === 'all' ? '' : value;
                                        router.get(
                                            offerOperations.index().url,
                                            {
                                                ...filters,
                                                category_uuid:
                                                    next || undefined,
                                            },
                                            {
                                                preserveState: true,
                                                preserveScroll: true,
                                            },
                                        );
                                    }}
                                >
                                    <SelectTrigger
                                        className="w-full"
                                        aria-label={t(
                                            'offer_operations.table.category',
                                        )}
                                    >
                                        <SelectValue
                                            placeholder={t(
                                                'filter.all_categories',
                                            )}
                                        />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            {t('filter.all_categories')}
                                        </SelectItem>
                                        {categories.map((category) => (
                                            <SelectItem
                                                key={category.uuid}
                                                value={category.uuid}
                                            >
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                    </div>
                </div>

                <div className="relative min-h-[300px] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 bg-card dark:border-sidebar-border">
                    <div className="relative h-full w-full overflow-auto">
                        <table className="min-w-full border-separate border-spacing-0 text-left text-sm">
                            <thead className="sticky top-0 z-10 bg-muted/80 backdrop-blur">
                                <tr className="text-xs tracking-wide text-muted-foreground uppercase">
                                    <th className="border-b px-3 py-2 font-medium">
                                        {t('offer_operations.table.id')}
                                    </th>
                                    <th className="border-b px-3 py-2 font-medium">
                                        {t('offer_operations.table.uuid')}
                                    </th>
                                    <th className="border-b px-3 py-2 font-medium">
                                        {t('offer_operations.table.category')}
                                    </th>
                                    <th className="border-b px-3 py-2 font-medium">
                                        {t(
                                            'offer_operations.table.unique_code',
                                        )}
                                    </th>
                                    <th className="border-b px-3 py-2 font-medium">
                                        {t(
                                            'offer_operations.table.operation_code',
                                        )}
                                    </th>
                                    <th className="border-b px-3 py-2 font-medium">
                                        {t(
                                            'offer_operations.table.operation_description',
                                        )}
                                    </th>
                                    <th className="border-b px-3 py-2 font-medium">
                                        {t('offer_operations.table.sec_op')}
                                    </th>
                                    <th className="border-b px-3 py-2 font-medium">
                                        {t('offer_operations.table.attachment')}
                                    </th>
                                    <th className="border-b px-3 py-2 text-right font-medium">
                                        {t('offer_operations.table.actions')}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {operationsPaginated.data.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={9}
                                            className="px-3 py-6 text-center text-sm text-muted-foreground"
                                        >
                                            {t('offer_operations.index.empty')}
                                        </td>
                                    </tr>
                                )}
                                {operationsPaginated.data.map((operation) => (
                                    <tr
                                        key={operation.uuid}
                                        className="border-b last:border-b-0 hover:bg-muted/40"
                                    >
                                        <td className="px-3 py-2 align-middle text-xs">
                                            {operation.id}
                                        </td>
                                        <td className="px-3 py-2 align-middle font-mono text-xs">
                                            {operation.uuid}
                                        </td>
                                        <td className="px-3 py-2 align-middle text-xs">
                                            {operation.category?.name ?? '—'}
                                        </td>
                                        <td className="px-3 py-2 align-middle font-mono text-xs">
                                            {operation.codice_univoco ?? '—'}
                                        </td>
                                        <td className="px-3 py-2 align-middle font-mono text-xs">
                                            {operation.codice ?? '—'}
                                        </td>
                                        <td className="px-3 py-2 align-middle font-medium">
                                            {operation.descrizione ?? '—'}
                                        </td>
                                        <td className="px-3 py-2 text-right align-middle font-mono text-xs tabular-nums">
                                            {formatInteger(
                                                operation.secondi_operazione,
                                            )}
                                        </td>
                                        <td className="px-3 py-2 align-middle text-xs">
                                            {getFileDisplayName(
                                                operation.filename,
                                            )}
                                        </td>
                                        <td className="px-3 py-2 text-right align-middle text-xs">
                                            <ActionsDropdown
                                                viewHref={
                                                    offerOperations.show({
                                                        offerOperation:
                                                            operation.uuid,
                                                    }).url
                                                }
                                                editHref={
                                                    offerOperations.edit({
                                                        offerOperation:
                                                            operation.uuid,
                                                    }).url
                                                }
                                                onDelete={() =>
                                                    handleDeleteClick(operation)
                                                }
                                                extraItems={
                                                    <DropdownMenuItem
                                                        disabled={
                                                            !operation.filename
                                                        }
                                                        onSelect={(e) => {
                                                            e.preventDefault();
                                                            if (
                                                                !operation.filename
                                                            )
                                                                return;
                                                            window.location.href =
                                                                offerOperations.downloadFile(
                                                                    {
                                                                        offerOperation:
                                                                            operation.uuid,
                                                                    },
                                                                ).url;
                                                        }}
                                                    >
                                                        <Download className="mr-2 h-4 w-4" />
                                                        Scarica allegato
                                                    </DropdownMenuItem>
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
                    links={operationsPaginated.links}
                    currentPage={operationsPaginated.current_page}
                    lastPage={operationsPaginated.last_page}
                />

                <ConfirmDeleteDialog
                    open={deleteDialog.open}
                    onOpenChange={(open) =>
                        setDeleteDialog({
                            open,
                            operation: deleteDialog.operation,
                        })
                    }
                    onConfirm={handleDeleteConfirm}
                    title={t('offer_operations.delete_title')}
                    description={t('offer_operations.delete_description')}
                    itemName={
                        deleteDialog.operation?.codice ||
                        deleteDialog.operation?.descrizione
                    }
                    isLoading={isDeleting}
                />
            </div>
        </AppLayout>
    );
}
