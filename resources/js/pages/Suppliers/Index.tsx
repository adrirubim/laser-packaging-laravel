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
import AppLayout from '@/layouts/app-layout';
import suppliers from '@/routes/suppliers';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

type Supplier = {
    id: number;
    uuid: string;
    code: string;
    company_name: string;
    vat_number?: string | null;
    co?: string | null;
    street?: string | null;
    contacts?: string | null;
    postal_code?: string | null;
    city?: string | null;
    province?: string | null;
    country?: string | null;
};

type SuppliersIndexProps = {
    suppliers: {
        data: Supplier[];
        current_page: number;
        last_page: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
    filters: {
        search?: string;
        sort_by?: string;
        sort_order?: 'asc' | 'desc';
    };
    flash?: {
        success?: string;
        error?: string;
    };
};

export default function SuppliersIndex() {
    const { props } = usePage<SuppliersIndexProps>();
    const { suppliers: suppliersPaginated, filters } = props;
    const { flash } = useFlashNotifications();

    const [searchValue, setSearchValue] = useState(filters.search ?? '');
    const [isSearching, setIsSearching] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState<{
        open: boolean;
        supplier: Supplier | null;
    }>({
        open: false,
        supplier: null,
    });
    const [isDeleting, setIsDeleting] = useState(false);

    const handleSort = (column: string) => {
        const currentSort = filters.sort_by;
        const currentDirection = filters.sort_order || 'asc';

        let newDirection: 'asc' | 'desc' = 'asc';
        if (currentSort === column && currentDirection === 'asc') {
            newDirection = 'desc';
        }

        router.get(
            suppliers.index().url,
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

    const handleSearchChange = (value: string) => {
        setSearchValue(value);
        setIsSearching(true);
        router.get(
            suppliers.index().url,
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
            suppliers.index().url,
            {
                ...filters,
                search: undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const handleDeleteClick = (supplier: Supplier) => {
        setDeleteDialog({ open: true, supplier });
    };

    const handleDeleteConfirm = () => {
        if (!deleteDialog.supplier) return;

        setIsDeleting(true);
        router.delete(
            suppliers.destroy({ supplier: deleteDialog.supplier.uuid }).url,
            {
                preserveScroll: true,
                onSuccess: () => {
                    setDeleteDialog({ open: false, supplier: null });
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
            title: 'Fornitori',
            href: suppliers.index().url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Fornitori" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <IndexHeader
                    title="Fornitori"
                    subtitle="Elenco dei fornitori attivi con Cerca e filtri di base."
                    createHref={suppliers.create().url}
                    createLabel="Nuovo Fornitore"
                />

                <FlashNotifications flash={flash} />

                <div className="flex flex-col gap-3 rounded-xl border border-sidebar-border/70 bg-card p-4 dark:border-sidebar-border">
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">
                            Cerca
                        </label>
                        <SearchInput
                            value={searchValue}
                            onChange={handleSearchChange}
                            placeholder="Codice, ragione sociale o partita IVA..."
                            isLoading={isSearching}
                            onClear={clearSearch}
                        />
                    </div>
                </div>

                <div className="relative min-h-[300px] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 bg-card dark:border-sidebar-border">
                    <div className="relative h-full w-full overflow-auto">
                        <div className="block space-y-3 p-4 md:hidden">
                            {suppliersPaginated.data.length === 0 ? (
                                <div className="py-8 text-center text-sm text-muted-foreground">
                                    Nessun fornitore trovato per i filtri
                                    attuali.
                                </div>
                            ) : (
                                suppliersPaginated.data.map((supplier) => (
                                    <div
                                        key={supplier.uuid}
                                        className="space-y-2 rounded-lg border p-4 transition-colors hover:bg-muted/40"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <h3 className="font-medium">
                                                    {supplier.company_name}
                                                </h3>
                                                <p className="mt-1 font-mono text-xs text-muted-foreground">
                                                    Codice: {supplier.code}
                                                </p>
                                            </div>
                                            <ActionsDropdown
                                                viewHref={
                                                    suppliers.show({
                                                        supplier: supplier.uuid,
                                                    }).url
                                                }
                                                editHref={
                                                    suppliers.edit({
                                                        supplier: supplier.uuid,
                                                    }).url
                                                }
                                                onDelete={() =>
                                                    handleDeleteClick(supplier)
                                                }
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 text-xs">
                                            {supplier.vat_number && (
                                                <div>
                                                    <span className="text-muted-foreground">
                                                        P.IVA:{' '}
                                                    </span>
                                                    <span>
                                                        {supplier.vat_number}
                                                    </span>
                                                </div>
                                            )}
                                            {supplier.city && (
                                                <div>
                                                    <span className="text-muted-foreground">
                                                        Città:{' '}
                                                    </span>
                                                    <span>{supplier.city}</span>
                                                </div>
                                            )}
                                            {supplier.province && (
                                                <div>
                                                    <span className="text-muted-foreground">
                                                        Provincia:{' '}
                                                    </span>
                                                    <span>
                                                        {supplier.province}
                                                    </span>
                                                </div>
                                            )}
                                            {supplier.postal_code && (
                                                <div>
                                                    <span className="text-muted-foreground">
                                                        CAP:{' '}
                                                    </span>
                                                    <span>
                                                        {supplier.postal_code}
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
                                    <SortableTableHeader
                                        column="code"
                                        currentSort={filters.sort_by}
                                        currentDirection={filters.sort_order}
                                        onSort={handleSort}
                                    >
                                        Codice Fornitore
                                    </SortableTableHeader>
                                    <SortableTableHeader
                                        column="company_name"
                                        currentSort={filters.sort_by}
                                        currentDirection={filters.sort_order}
                                        onSort={handleSort}
                                    >
                                        Ragione Sociale
                                    </SortableTableHeader>
                                    <SortableTableHeader
                                        column="vat_number"
                                        currentSort={filters.sort_by}
                                        currentDirection={filters.sort_order}
                                        onSort={handleSort}
                                    >
                                        Partita IVA
                                    </SortableTableHeader>
                                    <th className="border-b px-3 py-2 font-medium">
                                        C/O
                                    </th>
                                    <th className="border-b px-3 py-2 font-medium">
                                        Via
                                    </th>
                                    <th className="border-b px-3 py-2 font-medium">
                                        Contatti
                                    </th>
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
                                    <SortableTableHeader
                                        column="country"
                                        currentSort={filters.sort_by}
                                        currentDirection={filters.sort_order}
                                        onSort={handleSort}
                                    >
                                        Nazione
                                    </SortableTableHeader>
                                    <th className="border-b px-3 py-2 text-right font-medium">
                                        Azioni
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {suppliersPaginated.data.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={13}
                                            className="px-3 py-6 text-center text-sm text-muted-foreground"
                                        >
                                            Nessun fornitore trovato per i
                                            filtri attuali.
                                        </td>
                                    </tr>
                                )}
                                {suppliersPaginated.data.map((supplier) => (
                                    <tr
                                        key={supplier.uuid}
                                        className="border-b last:border-b-0 hover:bg-muted/40"
                                    >
                                        <td className="px-3 py-2 align-middle text-xs">
                                            {supplier.id}
                                        </td>
                                        <td className="px-3 py-2 align-middle font-mono text-xs">
                                            {supplier.uuid}
                                        </td>
                                        <td className="px-3 py-2 align-middle font-mono text-xs">
                                            {supplier.code}
                                        </td>
                                        <td className="px-3 py-2 align-middle font-medium">
                                            {supplier.company_name}
                                        </td>
                                        <td className="px-3 py-2 align-middle text-xs">
                                            {supplier.vat_number ?? '—'}
                                        </td>
                                        <td className="px-3 py-2 align-middle text-xs">
                                            {supplier.co ?? '—'}
                                        </td>
                                        <td className="px-3 py-2 align-middle text-xs">
                                            {supplier.street ?? '—'}
                                        </td>
                                        <td className="px-3 py-2 align-middle text-xs">
                                            {supplier.contacts
                                                ? supplier.contacts.length > 30
                                                    ? supplier.contacts.substring(
                                                          0,
                                                          30,
                                                      ) + '...'
                                                    : supplier.contacts
                                                : '—'}
                                        </td>
                                        <td className="px-3 py-2 align-middle text-xs">
                                            {supplier.postal_code ?? '—'}
                                        </td>
                                        <td className="px-3 py-2 align-middle text-xs">
                                            {supplier.city ?? '—'}
                                        </td>
                                        <td className="px-3 py-2 align-middle text-xs">
                                            {supplier.province ?? '—'}
                                        </td>
                                        <td className="px-3 py-2 align-middle text-xs">
                                            {supplier.country ?? '—'}
                                        </td>
                                        <td className="px-3 py-2 text-right align-middle text-xs">
                                            <ActionsDropdown
                                                viewHref={
                                                    suppliers.show({
                                                        supplier: supplier.uuid,
                                                    }).url
                                                }
                                                editHref={
                                                    suppliers.edit({
                                                        supplier: supplier.uuid,
                                                    }).url
                                                }
                                                onDelete={() =>
                                                    handleDeleteClick(supplier)
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
                    links={suppliersPaginated.links}
                    currentPage={suppliersPaginated.current_page}
                    lastPage={suppliersPaginated.last_page}
                    totalItems={suppliersPaginated.data.length}
                />

                <ConfirmDeleteDialog
                    open={deleteDialog.open}
                    onOpenChange={(open) =>
                        setDeleteDialog({
                            open,
                            supplier: deleteDialog.supplier,
                        })
                    }
                    onConfirm={handleDeleteConfirm}
                    title="Elimina Fornitore"
                    description="Sei sicuro di voler eliminare questo fornitore? Questa azione non può essere annullata."
                    itemName={
                        deleteDialog.supplier?.company_name ||
                        deleteDialog.supplier?.code
                    }
                    isLoading={isDeleting}
                />
            </div>
        </AppLayout>
    );
}
