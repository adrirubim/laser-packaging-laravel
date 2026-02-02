import ConfirmDeleteDialog from '@/components/confirm-delete-dialog';
import { Pagination } from '@/components/Pagination';
import { SearchInput } from '@/components/SearchInput';
import { SortableTableHeader } from '@/components/SortableTableHeader';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import customers from '@/routes/customers';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Edit, Eye, MoreHorizontal, Plus, Trash2, X } from 'lucide-react';
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
    const { props } = usePage<CustomersIndexProps>();
    const {
        customers: customersPaginated,
        filters,
        provinces = [],
        flash,
    } = props;

    const [searchValue, setSearchValue] = useState(filters.search ?? '');
    const [provinceFilter, setProvinceFilter] = useState(
        filters.province ?? '',
    );
    const [isSearching, setIsSearching] = useState(false);
    const [showFlash, setShowFlash] = useState(true);
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

    // Sincronizzare stato iniziale con i filtri del server
    useEffect(() => {
        queueMicrotask(() => setProvinceFilter(filters.province ?? ''));
    }, [filters.province]);

    // Auto-dismiss per messaggi flash
    useEffect(() => {
        if (flash?.success || flash?.error) {
            queueMicrotask(() => setShowFlash(true));
            const timer = setTimeout(() => {
                setShowFlash(false);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

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
            title: 'Clienti',
            href: customers.index().url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Clienti" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Clienti
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Elenco dei clienti attivi con Cerca e filtri di
                            base.
                        </p>
                    </div>
                    <Link
                        href={customers.create().url}
                        className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Nuovo Cliente
                    </Link>
                </div>

                {showFlash && flash?.success && (
                    <div className="flex animate-in items-center justify-between rounded-md border border-emerald-500/40 bg-emerald-500/5 px-3 py-2 text-sm text-emerald-700 duration-300 fade-in slide-in-from-top-2 dark:text-emerald-300">
                        <span>{flash.success}</span>
                        <button
                            onClick={() => setShowFlash(false)}
                            className="ml-2 transition-opacity hover:opacity-70"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                )}
                {showFlash && flash?.error && (
                    <div className="flex animate-in items-center justify-between rounded-md border border-rose-500/40 bg-rose-500/5 px-3 py-2 text-sm text-rose-700 duration-300 fade-in slide-in-from-top-2 dark:text-rose-300">
                        <span>{flash.error}</span>
                        <button
                            onClick={() => setShowFlash(false)}
                            className="ml-2 transition-opacity hover:opacity-70"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                )}

                <div className="flex flex-col gap-3 rounded-xl border border-sidebar-border/70 bg-card p-4 dark:border-sidebar-border">
                    <div className="grid gap-3 md:grid-cols-2">
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

                        {provinces.length > 0 && (
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-muted-foreground">
                                    Provincia
                                </label>
                                <Select
                                    value={provinceFilter || 'all'}
                                    onValueChange={handleProvinceChange}
                                >
                                    <SelectTrigger
                                        className="w-full"
                                        aria-label="Provincia"
                                    >
                                        <SelectValue placeholder="Tutte le province" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            Tutte le province
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
                                    Nessun cliente trovato per i filtri attuali.
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
                                                    Codice: {customer.code}
                                                </p>
                                            </div>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                        aria-label="Apri menu azioni"
                                                    >
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem
                                                        onSelect={(e) => {
                                                            e.preventDefault();
                                                            router.visit(
                                                                customers.show({
                                                                    customer:
                                                                        customer.uuid,
                                                                }).url,
                                                            );
                                                        }}
                                                    >
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        Visualizza
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onSelect={(e) => {
                                                            e.preventDefault();
                                                            router.visit(
                                                                customers.edit({
                                                                    customer:
                                                                        customer.uuid,
                                                                }).url,
                                                            );
                                                        }}
                                                    >
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        Modifica
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        variant="destructive"
                                                        onSelect={(e) => {
                                                            e.preventDefault();
                                                            handleDeleteClick(
                                                                customer,
                                                            );
                                                        }}
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Elimina
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 text-xs">
                                            {customer.vat_number && (
                                                <div>
                                                    <span className="text-muted-foreground">
                                                        P.IVA:{' '}
                                                    </span>
                                                    <span>
                                                        {customer.vat_number}
                                                    </span>
                                                </div>
                                            )}
                                            {customer.city && (
                                                <div>
                                                    <span className="text-muted-foreground">
                                                        Città:{' '}
                                                    </span>
                                                    <span>{customer.city}</span>
                                                </div>
                                            )}
                                            {customer.province && (
                                                <div>
                                                    <span className="text-muted-foreground">
                                                        Provincia:{' '}
                                                    </span>
                                                    <span>
                                                        {customer.province}
                                                    </span>
                                                </div>
                                            )}
                                            {customer.postal_code && (
                                                <div>
                                                    <span className="text-muted-foreground">
                                                        CAP:{' '}
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
                                        Codice Cliente
                                    </SortableTableHeader>
                                    <SortableTableHeader
                                        column="company_name"
                                        currentSort={filters.sort}
                                        currentDirection={filters.direction}
                                        onSort={handleSort}
                                    >
                                        Ragione Sociale
                                    </SortableTableHeader>
                                    <th className="border-b px-3 py-2 font-medium">
                                        Partita IVA
                                    </th>
                                    <th className="border-b px-3 py-2 font-medium">
                                        C/O
                                    </th>
                                    <th className="border-b px-3 py-2 font-medium">
                                        Via
                                    </th>
                                    <th className="border-b px-3 py-2 font-medium">
                                        CAP
                                    </th>
                                    <SortableTableHeader
                                        column="city"
                                        currentSort={filters.sort}
                                        currentDirection={filters.direction}
                                        onSort={handleSort}
                                    >
                                        Città
                                    </SortableTableHeader>
                                    <SortableTableHeader
                                        column="province"
                                        currentSort={filters.sort}
                                        currentDirection={filters.direction}
                                        onSort={handleSort}
                                    >
                                        Provincia
                                    </SortableTableHeader>
                                    <th className="border-b px-3 py-2 font-medium">
                                        Nazione
                                    </th>
                                    <th className="border-b px-3 py-2 text-right font-medium">
                                        Azioni
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
                                            Nessun cliente trovato per i filtri
                                            attuali.
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
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                        aria-label="Apri menu azioni"
                                                    >
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem
                                                        onSelect={(e) => {
                                                            e.preventDefault();
                                                            router.visit(
                                                                customers.show({
                                                                    customer:
                                                                        customer.uuid,
                                                                }).url,
                                                            );
                                                        }}
                                                    >
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        Visualizza
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onSelect={(e) => {
                                                            e.preventDefault();
                                                            router.visit(
                                                                customers.edit({
                                                                    customer:
                                                                        customer.uuid,
                                                                }).url,
                                                            );
                                                        }}
                                                    >
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        Modifica
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        variant="destructive"
                                                        onSelect={(e) => {
                                                            e.preventDefault();
                                                            handleDeleteClick(
                                                                customer,
                                                            );
                                                        }}
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Elimina
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
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
                    title="Elimina Cliente"
                    description="Sei sicuro di voler eliminare questo cliente? Questa azione non può essere annullata."
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
