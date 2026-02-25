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
import { useTranslations } from '@/hooks/use-translations';
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
    const { t } = useTranslations();

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
            title: t('nav.suppliers'),
            href: suppliers.index().url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('suppliers.index.title')} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <IndexHeader
                    title={t('suppliers.index.title')}
                    subtitle={t('suppliers.index.subtitle')}
                    createHref={suppliers.create().url}
                    createLabel={t('suppliers.index.create')}
                />

                <FlashNotifications flash={flash} />

                <div className="flex flex-col gap-3 rounded-xl border border-sidebar-border/70 bg-card p-4 dark:border-sidebar-border">
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">
                            {t('common.search')}
                        </label>
                        <SearchInput
                            value={searchValue}
                            onChange={handleSearchChange}
                            placeholder={t(
                                'suppliers.index.search_placeholder',
                            )}
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
                                    {t('suppliers.index.empty')}
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
                                                    {t(
                                                        'suppliers.index.mobile_code_label',
                                                    )}{' '}
                                                    {supplier.code}
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
                                                        {t(
                                                            'suppliers.index.mobile_vat_label',
                                                        )}{' '}
                                                    </span>
                                                    <span>
                                                        {supplier.vat_number}
                                                    </span>
                                                </div>
                                            )}
                                            {supplier.city && (
                                                <div>
                                                    <span className="text-muted-foreground">
                                                        {t(
                                                            'suppliers.index.mobile_city_label',
                                                        )}{' '}
                                                    </span>
                                                    <span>{supplier.city}</span>
                                                </div>
                                            )}
                                            {supplier.province && (
                                                <div>
                                                    <span className="text-muted-foreground">
                                                        {t(
                                                            'suppliers.index.mobile_province_label',
                                                        )}{' '}
                                                    </span>
                                                    <span>
                                                        {supplier.province}
                                                    </span>
                                                </div>
                                            )}
                                            {supplier.postal_code && (
                                                <div>
                                                    <span className="text-muted-foreground">
                                                        {t(
                                                            'suppliers.index.mobile_cap_label',
                                                        )}{' '}
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
                                        {t('suppliers.table.code')}
                                    </SortableTableHeader>
                                    <SortableTableHeader
                                        column="company_name"
                                        currentSort={filters.sort_by}
                                        currentDirection={filters.sort_order}
                                        onSort={handleSort}
                                    >
                                        {t('suppliers.table.company_name')}
                                    </SortableTableHeader>
                                    <SortableTableHeader
                                        column="vat_number"
                                        currentSort={filters.sort_by}
                                        currentDirection={filters.sort_order}
                                        onSort={handleSort}
                                    >
                                        {t('suppliers.table.vat')}
                                    </SortableTableHeader>
                                    <th className="border-b px-3 py-2 font-medium">
                                        {t('suppliers.table.co')}
                                    </th>
                                    <th className="border-b px-3 py-2 font-medium">
                                        {t('suppliers.table.street')}
                                    </th>
                                    <th className="border-b px-3 py-2 font-medium">
                                        {t('suppliers.table.contacts')}
                                    </th>
                                    <th className="border-b px-3 py-2 font-medium">
                                        {t('suppliers.table.cap')}
                                    </th>
                                    <SortableTableHeader
                                        column="city"
                                        currentSort={filters.sort_by}
                                        currentDirection={filters.sort_order}
                                        onSort={handleSort}
                                    >
                                        {t('suppliers.table.city')}
                                    </SortableTableHeader>
                                    <SortableTableHeader
                                        column="province"
                                        currentSort={filters.sort_by}
                                        currentDirection={filters.sort_order}
                                        onSort={handleSort}
                                    >
                                        {t('suppliers.table.province')}
                                    </SortableTableHeader>
                                    <SortableTableHeader
                                        column="country"
                                        currentSort={filters.sort_by}
                                        currentDirection={filters.sort_order}
                                        onSort={handleSort}
                                    >
                                        {t('suppliers.table.country')}
                                    </SortableTableHeader>
                                    <th className="border-b px-3 py-2 text-right font-medium">
                                        {t('suppliers.table.actions')}
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
                                            {t('suppliers.index.empty')}
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
                    title={t('suppliers.delete_title')}
                    description={t('suppliers.delete_description')}
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
