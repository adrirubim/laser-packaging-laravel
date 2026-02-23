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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useTranslations } from '@/hooks/use-translations';
import AppLayout from '@/layouts/app-layout';
import customerShippingAddresses from '@/routes/customer-shipping-addresses/index';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

type Customer = {
    uuid: string;
    company_name: string;
};

type CustomerDivision = {
    uuid: string;
    name: string;
    customer?: Customer | null;
};

type CustomerShippingAddress = {
    id: number;
    uuid: string;
    street: string;
    city: string;
    postal_code?: string | null;
    province?: string | null;
    country?: string | null;
    co?: string | null;
    contacts?: string | null;
    customerDivision?: CustomerDivision | null;
    customer_division?: CustomerDivision | null; // Laravel puede serializar en snake_case
};

type CustomerShippingAddressesIndexProps = {
    addresses: {
        data: CustomerShippingAddress[];
        current_page: number;
        last_page: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
    divisions: CustomerDivision[];
    filters: {
        search?: string;
        customerdivision_uuid?: string;
        sort_by?: string;
        sort_order?: 'asc' | 'desc';
    };
    flash?: {
        success?: string;
        error?: string;
    };
};

export default function CustomerShippingAddressesIndex() {
    const { props } = usePage<CustomerShippingAddressesIndexProps>();
    const { addresses: addressesPaginated, divisions, filters } = props;
    const { flash } = useFlashNotifications();
    const { t } = useTranslations();

    const [searchValue, setSearchValue] = useState(filters.search ?? '');
    const [divisionFilter, setDivisionFilter] = useState(
        filters.customerdivision_uuid ?? '',
    );
    const [isSearching, setIsSearching] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState<{
        open: boolean;
        address: CustomerShippingAddress | null;
    }>({
        open: false,
        address: null,
    });
    const [isDeleting, setIsDeleting] = useState(false);

    // Sincronizzare stato iniziale con i filtri del server
    useEffect(() => {
        queueMicrotask(() => {
            setSearchValue(filters.search ?? '');
            setDivisionFilter(filters.customerdivision_uuid ?? '');
        });
    }, [filters.search, filters.customerdivision_uuid]);

    const handleSearchChange = (value: string) => {
        setIsSearching(true);
        router.get(
            customerShippingAddresses.index().url,
            {
                search: value || undefined,
                customerdivision_uuid: divisionFilter || undefined,
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

    const handleDivisionChange = (value: string) => {
        setDivisionFilter(value);
        router.get(
            customerShippingAddresses.index().url,
            {
                search: searchValue || undefined,
                customerdivision_uuid: value || undefined,
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
            customerShippingAddresses.index().url,
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
            customerShippingAddresses.index().url,
            {
                customerdivision_uuid: divisionFilter || undefined,
                sort_by: filters.sort_by,
                sort_order: filters.sort_order,
            },
            { preserveState: true, preserveScroll: true },
        );
    };

    const handleDeleteClick = (address: CustomerShippingAddress) => {
        setDeleteDialog({ open: true, address });
    };

    const handleDeleteConfirm = () => {
        if (!deleteDialog.address) return;

        setIsDeleting(true);
        router.delete(
            customerShippingAddresses.destroy({
                customerShippingAddress: deleteDialog.address.uuid,
            }).url,
            {
                preserveScroll: true,
                onSuccess: () => {
                    setDeleteDialog({ open: false, address: null });
                    setIsDeleting(false);
                },
                onError: () => {
                    setIsDeleting(false);
                },
            },
        );
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Indirizzi di Consegna Clienti',
            href: customerShippingAddresses.index().url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Indirizzi di Consegna Clienti" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <IndexHeader
                    title="Indirizzi di Consegna Clienti"
                    subtitle="Elenco degli indirizzi di consegna clienti attivi con Cerca e filtri."
                    createHref={customerShippingAddresses.create().url}
                    createLabel="Nuovo Indirizzo"
                />

                <FlashNotifications flash={flash} />

                <div className="flex flex-col gap-3 rounded-xl border border-sidebar-border/70 bg-card p-4 dark:border-sidebar-border">
                    <div className="grid gap-3 md:grid-cols-2">
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-muted-foreground">
                                Cerca
                            </label>
                            <SearchInput
                                value={searchValue}
                                onChange={handleSearchChange}
                                placeholder="Via, città, CAP, C/O o contatti..."
                                isLoading={isSearching}
                                onClear={clearSearch}
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-medium text-muted-foreground">
                                Divisione
                            </label>
                            <Select
                                value={divisionFilter || 'all'}
                                onValueChange={(value) =>
                                    handleDivisionChange(
                                        value === 'all' ? '' : value,
                                    )
                                }
                            >
                                <SelectTrigger
                                    className="w-full"
                                    aria-label="Divisione"
                                >
                                    <SelectValue
                                        placeholder={t('filter.all_divisions')}
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        {t('filter.all_divisions')}
                                    </SelectItem>
                                    {divisions.map((division) => (
                                        <SelectItem
                                            key={division.uuid}
                                            value={division.uuid}
                                        >
                                            {division.customer?.company_name ??
                                                ''}{' '}
                                            - {division.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                <div className="relative min-h-[300px] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 bg-card dark:border-sidebar-border">
                    <div className="relative h-full w-full overflow-auto">
                        <div className="block space-y-3 p-4 md:hidden">
                            {addressesPaginated.data.length === 0 ? (
                                <div className="py-8 text-center text-sm text-muted-foreground">
                                    Nessun indirizzo trovato per i filtri
                                    attuali.
                                </div>
                            ) : (
                                addressesPaginated.data.map((address) => {
                                    const division =
                                        address.customerDivision ||
                                        address.customer_division;
                                    return (
                                        <div
                                            key={address.uuid}
                                            className="space-y-2 rounded-lg border p-4 transition-colors hover:bg-muted/40"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <h3 className="font-medium">
                                                        {address.street}
                                                    </h3>
                                                    <p className="mt-1 text-xs text-muted-foreground">
                                                        {division?.customer
                                                            ?.company_name ??
                                                            ''}{' '}
                                                        -{' '}
                                                        {division?.name ?? '—'}
                                                    </p>
                                                </div>
                                                <ActionsDropdown
                                                    viewHref={
                                                        customerShippingAddresses.show(
                                                            {
                                                                customerShippingAddress:
                                                                    address.uuid,
                                                            },
                                                        ).url
                                                    }
                                                    editHref={
                                                        customerShippingAddresses.edit(
                                                            {
                                                                customerShippingAddress:
                                                                    address.uuid,
                                                            },
                                                        ).url
                                                    }
                                                    onDelete={() =>
                                                        handleDeleteClick(
                                                            address,
                                                        )
                                                    }
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-2 text-xs">
                                                {address.city && (
                                                    <div>
                                                        <span className="text-muted-foreground">
                                                            Città:{' '}
                                                        </span>
                                                        <span>
                                                            {address.city}
                                                        </span>
                                                    </div>
                                                )}
                                                {address.postal_code && (
                                                    <div>
                                                        <span className="text-muted-foreground">
                                                            CAP:{' '}
                                                        </span>
                                                        <span>
                                                            {
                                                                address.postal_code
                                                            }
                                                        </span>
                                                    </div>
                                                )}
                                                {address.province && (
                                                    <div>
                                                        <span className="text-muted-foreground">
                                                            Provincia:{' '}
                                                        </span>
                                                        <span>
                                                            {address.province}
                                                        </span>
                                                    </div>
                                                )}
                                                {address.country && (
                                                    <div>
                                                        <span className="text-muted-foreground">
                                                            Nazione:{' '}
                                                        </span>
                                                        <span>
                                                            {address.country}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                        <table className="hidden min-w-full border-separate border-spacing-0 text-left text-sm md:table">
                            <thead className="sticky top-0 z-10 bg-muted/80 backdrop-blur">
                                <tr className="text-xs tracking-wide text-muted-foreground uppercase">
                                    <th className="border-b px-3 py-2 font-medium">
                                        ID
                                    </th>
                                    <th className="border-b px-3 py-2 font-medium">
                                        UUID
                                    </th>
                                    <th className="border-b px-3 py-2 font-medium">
                                        Divisione Cliente
                                    </th>
                                    <th className="border-b px-3 py-2 font-medium">
                                        C/O
                                    </th>
                                    <SortableTableHeader
                                        column="street"
                                        currentSort={filters.sort_by}
                                        currentDirection={filters.sort_order}
                                        onSort={handleSort}
                                    >
                                        Via
                                    </SortableTableHeader>
                                    <th className="border-b px-3 py-2 font-medium">
                                        CAP
                                    </th>
                                    <SortableTableHeader
                                        column="city"
                                        currentSort={filters.sort_by}
                                        currentDirection={filters.sort_order}
                                        onSort={handleSort}
                                    >
                                        Città
                                    </SortableTableHeader>
                                    <SortableTableHeader
                                        column="province"
                                        currentSort={filters.sort_by}
                                        currentDirection={filters.sort_order}
                                        onSort={handleSort}
                                    >
                                        Provincia
                                    </SortableTableHeader>
                                    <th className="border-b px-3 py-2 font-medium">
                                        Nazione
                                    </th>
                                    <th className="border-b px-3 py-2 font-medium">
                                        Contatti
                                    </th>
                                    <th className="border-b px-3 py-2 text-right font-medium">
                                        Azioni
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {addressesPaginated.data.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={11}
                                            className="px-3 py-6 text-center text-sm text-muted-foreground"
                                        >
                                            Nessun indirizzo trovato per i
                                            filtri attuali.
                                        </td>
                                    </tr>
                                )}
                                {addressesPaginated.data.map((address) => (
                                    <tr
                                        key={address.uuid}
                                        className="border-b last:border-b-0 hover:bg-muted/40"
                                    >
                                        <td className="px-3 py-2 align-middle text-xs">
                                            {address.id}
                                        </td>
                                        <td className="px-3 py-2 align-middle font-mono text-xs">
                                            {address.uuid}
                                        </td>
                                        <td className="px-3 py-2 align-middle">
                                            {address.customerDivision ||
                                            address.customer_division ? (
                                                <div>
                                                    {(() => {
                                                        const division =
                                                            address.customerDivision ||
                                                            address.customer_division;
                                                        return (
                                                            <>
                                                                <p className="text-xs">
                                                                    {division
                                                                        ?.customer
                                                                        ?.company_name ??
                                                                        ''}
                                                                </p>
                                                                <p className="text-xs text-muted-foreground">
                                                                    {division?.name ??
                                                                        ''}
                                                                </p>
                                                            </>
                                                        );
                                                    })()}
                                                </div>
                                            ) : (
                                                '—'
                                            )}
                                        </td>
                                        <td className="px-3 py-2 align-middle text-xs">
                                            {address.co ?? '—'}
                                        </td>
                                        <td className="px-3 py-2 align-middle text-xs">
                                            {address.street ?? '—'}
                                        </td>
                                        <td className="px-3 py-2 align-middle text-xs">
                                            {address.postal_code ?? '—'}
                                        </td>
                                        <td className="px-3 py-2 align-middle text-xs">
                                            {address.city ?? '—'}
                                        </td>
                                        <td className="px-3 py-2 align-middle text-xs">
                                            {address.province ?? '—'}
                                        </td>
                                        <td className="px-3 py-2 align-middle text-xs">
                                            {address.country ?? '—'}
                                        </td>
                                        <td className="px-3 py-2 align-middle text-xs">
                                            {address.contacts ?? '—'}
                                        </td>
                                        <td className="px-3 py-2 text-right align-middle text-xs">
                                            <ActionsDropdown
                                                viewHref={
                                                    customerShippingAddresses.show(
                                                        {
                                                            customerShippingAddress:
                                                                address.uuid,
                                                        },
                                                    ).url
                                                }
                                                editHref={
                                                    customerShippingAddresses.edit(
                                                        {
                                                            customerShippingAddress:
                                                                address.uuid,
                                                        },
                                                    ).url
                                                }
                                                onDelete={() =>
                                                    handleDeleteClick(address)
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
                    links={addressesPaginated.links}
                    currentPage={addressesPaginated.current_page}
                    lastPage={addressesPaginated.last_page}
                    totalItems={addressesPaginated.data.length}
                />

                <ConfirmDeleteDialog
                    open={deleteDialog.open}
                    onOpenChange={(open) =>
                        setDeleteDialog({ open, address: deleteDialog.address })
                    }
                    onConfirm={handleDeleteConfirm}
                    title="Elimina Indirizzo di Consegna"
                    description="Sei sicuro di voler eliminare questo indirizzo di consegna? Questa azione non può essere annullata."
                    itemName={deleteDialog.address?.street}
                    isLoading={isDeleting}
                />
            </div>
        </AppLayout>
    );
}
