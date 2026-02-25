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
import customers from '@/routes/customers';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

type Customer = {
    id: number;
    uuid: string;
    code: string;
    company_name: string;
    vat_number?: string | null;
    co?: string | null;
    street?: string | null;
    postal_code?: string | null;
    city?: string | null;
    province?: string | null;
    country?: string | null;
};

type CustomersIndexProps = {
    customers: {
        data: Customer[];
        current_page: number;
        last_page: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
    filters: {
        search?: string;
        province?: string;
        sort?: string;
        direction?: 'asc' | 'desc';
    };
    provinces?: string[];
    flash?: {
        success?: string;
        error?: string;
    };
};

export default function CustomersIndex() {
    const { t } = useTranslations();
    const { props } = usePage<CustomersIndexProps>();
    const { customers: customersPaginated, filters, provinces = [] } = props;
    const { flash } = useFlashNotifications();

    const [searchValue, setSearchValue] = useState(filters.search ?? '');
    const [provinceFilter, setProvinceFilter] = useState(
        filters.province ?? '',
    );
    const [isSearching, setIsSearching] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState<{
        open: boolean;
        customer: Customer | null;
    }>({
        open: false,
        customer: null,
    });
    const [isDeleting, setIsDeleting] = useState(false);

    // Debounce per la ricerca
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchValue !== (filters.search ?? '')) {
                setIsSearching(true);
                router.get(
                    customers.index().url,
                    {
                        ...filters,
                        search: searchValue || undefined,
                    },
                    {
                        preserveState: true,
                        preserveScroll: true,
                        onFinish: () => setIsSearching(false),
                    },
                );
            }
        }, 500);

        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps -- debounce: run on searchValue only to avoid loops
    }, [searchValue]);

    // Sync initial state with server filters
    useEffect(() => {
        queueMicrotask(() => setProvinceFilter(filters.province ?? ''));
    }, [filters.province]);

    const handleSort = (column: string) => {
        const currentSort = filters.sort;
        const currentDirection = filters.direction || 'asc';

        let newDirection: 'asc' | 'desc' = 'asc';
        if (currentSort === column && currentDirection === 'asc') {
            newDirection = 'desc';
        }

        router.get(
            customers.index().url,
            {
                ...filters,
                sort: column,
                direction: newDirection,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const handleProvinceChange = (value: string) => {
        const nextProvince = value === 'all' ? '' : value;
        setProvinceFilter(nextProvince);
        setIsSearching(true);
        router.get(
            customers.index().url,
            {
                ...filters,
                province: nextProvince || undefined,
                search: searchValue || undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
                onFinish: () => setIsSearching(false),
            },
        );
    };

    const handleSearchChange = (value: string) => {
        setSearchValue(value);
        setIsSearching(true);
        router.get(
            customers.index().url,
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
            customers.index().url,
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

    const handleDeleteClick = (customer: Customer) => {
        setDeleteDialog({ open: true, customer });
    };

    const handleDeleteConfirm = () => {
        if (!deleteDialog.customer) return;

        setIsDeleting(true);
        router.delete(
            customers.destroy({ customer: deleteDialog.customer.uuid }).url,
            {
                preserveScroll: true,
                onSuccess: () => {
                    setDeleteDialog({ open: false, customer: null });
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
            title: t('nav.customers'),
            href: customers.index().url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('nav.customers')} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <IndexHeader
                    title={t('customers.index.title')}
                    subtitle={t('customers.index.subtitle')}
                    createHref={customers.create().url}
                    createLabel={t('customers.index.create')}
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
                                    'customers.index.search_placeholder',
                                )}
                                isLoading={isSearching}
                                onClear={clearSearch}
                            />
                        </div>

                        {provinces.length > 0 && (
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-muted-foreground">
                                    {t('customers.index.province_label')}
                                </label>
                                <Select
                                    value={provinceFilter || 'all'}
                                    onValueChange={handleProvinceChange}
                                >
                                    <SelectTrigger
                                        className="w-full"
                                        aria-label={t(
                                            'customers.index.province_label',
                                        )}
                                    >
                                        <SelectValue
                                            placeholder={t(
                                                'filter.all_provinces',
                                            )}
                                        />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            {t('filter.all_provinces')}
                                        </SelectItem>
                                        {provinces.map((province) => (
                                            <SelectItem
                                                key={province}
                                                value={province}
                                            >
                                                {province}
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
                        <div className="block space-y-3 p-4 md:hidden">
                            {customersPaginated.data.length === 0 ? (
                                <div className="py-8 text-center text-sm text-muted-foreground">
                                    {t('customers.index.empty')}
                                </div>
                            ) : (
                                customersPaginated.data.map((customer) => (
                                    <div
                                        key={customer.id}
                                        className="space-y-2 rounded-lg border p-4 transition-colors hover:bg-muted/40"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <h3 className="font-medium">
                                                    {customer.company_name}
                                                </h3>
                                                <p className="mt-1 font-mono text-xs text-muted-foreground">
                                                    {t(
                                                        'customers.index.mobile_code_label',
                                                    )}{' '}
                                                    {customer.code}
                                                </p>
                                            </div>
                                            <ActionsDropdown
                                                viewHref={
                                                    customers.show({
                                                        customer: customer.uuid,
                                                    }).url
                                                }
                                                editHref={
                                                    customers.edit({
                                                        customer: customer.uuid,
                                                    }).url
                                                }
                                                onDelete={() =>
                                                    handleDeleteClick(customer)
                                                }
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 text-xs">
                                            {customer.vat_number && (
                                                <div>
                                                    <span className="text-muted-foreground">
                                                        {t(
                                                            'customers.index.mobile_vat_label',
                                                        )}{' '}
                                                    </span>
                                                    <span>
                                                        {customer.vat_number}
                                                    </span>
                                                </div>
                                            )}
                                            {customer.city && (
                                                <div>
                                                    <span className="text-muted-foreground">
                                                        {t(
                                                            'customers.index.mobile_city_label',
                                                        )}{' '}
                                                    </span>
                                                    <span>{customer.city}</span>
                                                </div>
                                            )}
                                            {customer.province && (
                                                <div>
                                                    <span className="text-muted-foreground">
                                                        {t(
                                                            'customers.index.mobile_province_label',
                                                        )}{' '}
                                                    </span>
                                                    <span>
                                                        {customer.province}
                                                    </span>
                                                </div>
                                            )}
                                            {customer.postal_code && (
                                                <div>
                                                    <span className="text-muted-foreground">
                                                        {t(
                                                            'customers.index.mobile_cap_label',
                                                        )}{' '}
                                                    </span>
                                                    <span>
                                                        {customer.postal_code}
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
                                        currentSort={filters.sort}
                                        currentDirection={filters.direction}
                                        onSort={handleSort}
                                    >
                                        {t('customers.table.code')}
                                    </SortableTableHeader>
                                    <SortableTableHeader
                                        column="company_name"
                                        currentSort={filters.sort}
                                        currentDirection={filters.direction}
                                        onSort={handleSort}
                                    >
                                        {t('customers.table.company_name')}
                                    </SortableTableHeader>
                                    <th className="border-b px-3 py-2 font-medium">
                                        {t('customers.table.vat')}
                                    </th>
                                    <th className="border-b px-3 py-2 font-medium">
                                        {t('customers.table.co')}
                                    </th>
                                    <th className="border-b px-3 py-2 font-medium">
                                        {t('customers.table.street')}
                                    </th>
                                    <th className="border-b px-3 py-2 font-medium">
                                        {t('customers.table.cap')}
                                    </th>
                                    <SortableTableHeader
                                        column="city"
                                        currentSort={filters.sort}
                                        currentDirection={filters.direction}
                                        onSort={handleSort}
                                    >
                                        {t('customers.table.city')}
                                    </SortableTableHeader>
                                    <SortableTableHeader
                                        column="province"
                                        currentSort={filters.sort}
                                        currentDirection={filters.direction}
                                        onSort={handleSort}
                                    >
                                        {t('customers.table.province')}
                                    </SortableTableHeader>
                                    <th className="border-b px-3 py-2 font-medium">
                                        {t('customers.table.country')}
                                    </th>
                                    <th className="border-b px-3 py-2 text-right font-medium">
                                        {t('customers.table.actions')}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {customersPaginated.data.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={12}
                                            className="px-3 py-6 text-center text-sm text-muted-foreground"
                                        >
                                            {t('customers.index.empty')}
                                        </td>
                                    </tr>
                                )}
                                {customersPaginated.data.map((customer) => (
                                    <tr
                                        key={customer.id}
                                        className="border-b last:border-b-0 hover:bg-muted/40"
                                    >
                                        <td className="px-3 py-2 align-middle text-xs">
                                            {customer.id}
                                        </td>
                                        <td className="px-3 py-2 align-middle font-mono text-xs">
                                            {customer.uuid}
                                        </td>
                                        <td className="px-3 py-2 align-middle font-mono text-xs">
                                            {customer.code}
                                        </td>
                                        <td className="px-3 py-2 align-middle font-medium">
                                            {customer.company_name}
                                        </td>
                                        <td className="px-3 py-2 align-middle text-xs">
                                            {customer.vat_number ?? '—'}
                                        </td>
                                        <td className="px-3 py-2 align-middle text-xs">
                                            {customer.co ?? '—'}
                                        </td>
                                        <td className="px-3 py-2 align-middle text-xs">
                                            {customer.street ?? '—'}
                                        </td>
                                        <td className="px-3 py-2 align-middle text-xs">
                                            {customer.postal_code ?? '—'}
                                        </td>
                                        <td className="px-3 py-2 align-middle text-xs">
                                            {customer.city ?? '—'}
                                        </td>
                                        <td className="px-3 py-2 align-middle text-xs">
                                            {customer.province ?? '—'}
                                        </td>
                                        <td className="px-3 py-2 align-middle text-xs">
                                            {customer.country ?? '—'}
                                        </td>
                                        <td className="px-3 py-2 text-right align-middle text-xs">
                                            <ActionsDropdown
                                                viewHref={
                                                    customers.show({
                                                        customer: customer.uuid,
                                                    }).url
                                                }
                                                editHref={
                                                    customers.edit({
                                                        customer: customer.uuid,
                                                    }).url
                                                }
                                                onDelete={() =>
                                                    handleDeleteClick(customer)
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
                    links={customersPaginated.links}
                    currentPage={customersPaginated.current_page}
                    lastPage={customersPaginated.last_page}
                    totalItems={customersPaginated.data.length}
                />

                <ConfirmDeleteDialog
                    open={deleteDialog.open}
                    onOpenChange={(open) =>
                        setDeleteDialog({
                            open,
                            customer: deleteDialog.customer,
                        })
                    }
                    onConfirm={handleDeleteConfirm}
                    title={t('customers.delete_title')}
                    description={t('customers.delete_description')}
                    itemName={
                        deleteDialog.customer?.company_name ||
                        deleteDialog.customer?.code
                    }
                    isLoading={isDeleting}
                />
            </div>
        </AppLayout>
    );
}
