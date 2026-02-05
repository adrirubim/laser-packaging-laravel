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
import AppLayout from '@/layouts/app-layout';
import customerDivisions from '@/routes/customer-divisions/index';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

type Customer = {
    uuid: string;
    company_name: string;
};

type CustomerDivision = {
    id: number;
    uuid: string;
    name: string;
    email?: string | null;
    contacts?: string | null;
    customer?: Customer | null;
};

type CustomerDivisionsIndexProps = {
    divisions: {
        data: CustomerDivision[];
        current_page: number;
        last_page: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
    customers: Customer[];
    filters: {
        search?: string;
        customer_uuid?: string;
        sort_by?: string;
        sort_order?: 'asc' | 'desc';
    };
    flash?: {
        success?: string;
        error?: string;
    };
};

export default function CustomerDivisionsIndex() {
    const { props } = usePage<CustomerDivisionsIndexProps>();
    const { divisions: divisionsPaginated, customers, filters } = props;
    const { flash } = useFlashNotifications();

    const [searchValue, setSearchValue] = useState(filters.search ?? '');
    const [customerFilter, setCustomerFilter] = useState(
        filters.customer_uuid ?? '',
    );
    const [isSearching, setIsSearching] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState<{
        open: boolean;
        division: CustomerDivision | null;
    }>({
        open: false,
        division: null,
    });
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDeleteClick = (division: CustomerDivision) => {
        setDeleteDialog({ open: true, division });
    };

    // Sincronizzare stato iniziale con i filtri del server
    useEffect(() => {
        queueMicrotask(() => {
            setSearchValue(filters.search ?? '');
            setCustomerFilter(filters.customer_uuid ?? '');
        });
    }, [filters.search, filters.customer_uuid]);

    const handleSearchChange = (value: string) => {
        setIsSearching(true);
        router.get(
            customerDivisions.index().url,
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
            customerDivisions.index().url,
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
            customerDivisions.index().url,
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
            customerDivisions.index().url,
            {
                customer_uuid: customerFilter || undefined,
                sort_by: filters.sort_by,
                sort_order: filters.sort_order,
            },
            { preserveState: true, preserveScroll: true },
        );
    };

    const handleDeleteConfirm = () => {
        if (!deleteDialog.division) return;

        setIsDeleting(true);
        router.delete(
            customerDivisions.destroy({
                customerDivision: deleteDialog.division.uuid,
            }).url,
            {
                preserveScroll: true,
                onSuccess: () => {
                    setDeleteDialog({ open: false, division: null });
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
            title: 'Divisioni Clienti',
            href: customerDivisions.index().url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Divisioni Clienti" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <IndexHeader
                    title="Divisioni Clienti"
                    subtitle="Elenco delle divisioni clienti attive con Cerca e filtri."
                    createHref={customerDivisions.create().url}
                    createLabel="Nuova Divisione"
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
                                placeholder="Nome o codice..."
                                isLoading={isSearching}
                                onClear={clearSearch}
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-medium text-muted-foreground">
                                Cliente
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
                                    aria-label="Cliente"
                                >
                                    <SelectValue placeholder="Tutti i clienti" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        Tutti i clienti
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

                <div className="relative min-h-[300px] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 bg-card dark:border-sidebar-border">
                    <div className="relative h-full w-full overflow-auto">
                        <div className="block space-y-3 p-4 md:hidden">
                            {divisionsPaginated.data.length === 0 ? (
                                <div className="py-8 text-center text-sm text-muted-foreground">
                                    Nessuna divisione trovata per i filtri
                                    attuali.
                                </div>
                            ) : (
                                divisionsPaginated.data.map((division) => (
                                    <div
                                        key={division.uuid}
                                        className="space-y-2 rounded-lg border p-4 transition-colors hover:bg-muted/40"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <h3 className="font-medium">
                                                    {division.name}
                                                </h3>
                                                <p className="mt-1 text-xs text-muted-foreground">
                                                    {division.customer
                                                        ?.company_name ?? '—'}
                                                </p>
                                            </div>
                                            <ActionsDropdown
                                                viewHref={
                                                    customerDivisions.show({
                                                        customerDivision:
                                                            division.uuid,
                                                    }).url
                                                }
                                                editHref={
                                                    customerDivisions.edit({
                                                        customerDivision:
                                                            division.uuid,
                                                    }).url
                                                }
                                                onDelete={() =>
                                                    handleDeleteClick(division)
                                                }
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 text-xs">
                                            {division.email && (
                                                <div>
                                                    <span className="text-muted-foreground">
                                                        Email:{' '}
                                                    </span>
                                                    <span>
                                                        {division.email}
                                                    </span>
                                                </div>
                                            )}
                                            {division.contacts && (
                                                <div>
                                                    <span className="text-muted-foreground">
                                                        Contatti:{' '}
                                                    </span>
                                                    <span>
                                                        {division.contacts}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))
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
                                        Cliente
                                    </th>
                                    <SortableTableHeader
                                        column="name"
                                        currentSort={filters.sort_by}
                                        currentDirection={filters.sort_order}
                                        onSort={handleSort}
                                    >
                                        Nome
                                    </SortableTableHeader>
                                    <SortableTableHeader
                                        column="email"
                                        currentSort={filters.sort_by}
                                        currentDirection={filters.sort_order}
                                        onSort={handleSort}
                                    >
                                        Email
                                    </SortableTableHeader>
                                    <th className="border-b px-3 py-2 font-medium">
                                        Contatti
                                    </th>
                                    <th className="border-b px-3 py-2 text-right font-medium">
                                        Azioni
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {divisionsPaginated.data.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            className="px-3 py-6 text-center text-sm text-muted-foreground"
                                        >
                                            Nessuna divisione trovata per i
                                            filtri attuali.
                                        </td>
                                    </tr>
                                )}
                                {divisionsPaginated.data.map((division) => (
                                    <tr
                                        key={division.uuid}
                                        className="border-b last:border-b-0 hover:bg-muted/40"
                                    >
                                        <td className="px-3 py-2 align-middle text-xs">
                                            {division.id}
                                        </td>
                                        <td className="px-3 py-2 align-middle font-mono text-xs">
                                            {division.uuid}
                                        </td>
                                        <td className="px-3 py-2 align-middle">
                                            {division.customer?.company_name ??
                                                '—'}
                                        </td>
                                        <td className="px-3 py-2 align-middle font-medium">
                                            {division.name}
                                        </td>
                                        <td className="px-3 py-2 align-middle text-xs">
                                            {division.email ?? '—'}
                                        </td>
                                        <td className="px-3 py-2 align-middle text-xs">
                                            {division.contacts ?? '—'}
                                        </td>
                                        <td className="px-3 py-2 text-right align-middle text-xs">
                                            <ActionsDropdown
                                                viewHref={
                                                    customerDivisions.show({
                                                        customerDivision:
                                                            division.uuid,
                                                    }).url
                                                }
                                                editHref={
                                                    customerDivisions.edit({
                                                        customerDivision:
                                                            division.uuid,
                                                    }).url
                                                }
                                                onDelete={() =>
                                                    handleDeleteClick(division)
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
                    links={divisionsPaginated.links}
                    currentPage={divisionsPaginated.current_page}
                    lastPage={divisionsPaginated.last_page}
                    totalItems={divisionsPaginated.data.length}
                />

                <ConfirmDeleteDialog
                    open={deleteDialog.open}
                    onOpenChange={(open) =>
                        setDeleteDialog({
                            open,
                            division: deleteDialog.division,
                        })
                    }
                    onConfirm={handleDeleteConfirm}
                    title="Elimina Divisione Cliente"
                    description="Sei sicuro di voler eliminare questa divisione cliente? Questa azione non può essere annullata."
                    itemName={deleteDialog.division?.name}
                    isLoading={isDeleting}
                />
            </div>
        </AppLayout>
    );
}
