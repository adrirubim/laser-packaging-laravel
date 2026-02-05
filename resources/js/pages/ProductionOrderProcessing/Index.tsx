import ConfirmDeleteDialog from '@/components/confirm-delete-dialog';
import {
    FlashNotifications,
    useFlashNotifications,
} from '@/components/flash-notifications';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { formatDecimal, parseDecimal } from '@/lib/utils/number';
import ordersRoutes from '@/routes/orders/index';
import productionOrderProcessing from '@/routes/production-order-processing/index';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    ArrowDown,
    ArrowUp,
    ArrowUpDown,
    Calendar,
    Download,
    FilterX,
    Loader2,
    Plus,
    Search,
    Trash2,
    X,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

type Employee = {
    uuid: string;
    name: string;
    surname: string;
    matriculation_number: string;
};

type Order = {
    uuid: string;
    order_production_number: string;
};

type ProductionOrderProcessing = {
    id: number;
    uuid: string;
    quantity: number | string | null;
    processed_datetime: string;
    employee?: Employee | null;
    order?: Order | null;
};

type ProductionOrderProcessingIndexProps = {
    processings: {
        data: ProductionOrderProcessing[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number | null;
        to: number | null;
        links: { url: string | null; label: string; active: boolean }[];
    };
    employees: Employee[];
    orders: Order[];
    filters: {
        search?: string;
        employee_uuid?: string;
        order_uuid?: string;
        date_from?: string;
        date_to?: string;
        min_quantity?: string;
        max_quantity?: string;
        sort_by?: string;
        sort_order?: string;
        per_page?: string;
    };
    flash?: {
        success?: string;
        error?: string;
    };
};

export default function ProductionOrderProcessingIndex() {
    const { props } = usePage<ProductionOrderProcessingIndexProps>();
    const {
        processings: processingsPaginated,
        employees = [],
        orders = [],
        filters,
    } = props;
    const { flash } = useFlashNotifications();

    const [searchValue, setSearchValue] = useState(filters.search ?? '');
    const [selectedEmployee, setSelectedEmployee] = useState(
        filters.employee_uuid ?? '',
    );
    const [selectedOrder, setSelectedOrder] = useState(
        filters.order_uuid ?? '',
    );
    const [dateFrom, setDateFrom] = useState(filters.date_from ?? '');
    const [dateTo, setDateTo] = useState(filters.date_to ?? '');
    const [minQuantity, setMinQuantity] = useState<number | ''>('');
    const [maxQuantity, setMaxQuantity] = useState<number | ''>('');
    const [isSearching, setIsSearching] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState<{
        open: boolean;
        processing: ProductionOrderProcessing | null;
    }>({
        open: false,
        processing: null,
    });
    const [isDeleting, setIsDeleting] = useState(false);

    // Inizializzare valori quantità dai filtri
    useEffect(() => {
        queueMicrotask(() => {
            if (filters.min_quantity) {
                const val = parseDecimal(filters.min_quantity);
                if (val > 0) setMinQuantity(val);
            }
            if (filters.max_quantity) {
                const val = parseDecimal(filters.max_quantity);
                if (val > 0) setMaxQuantity(val);
            }
        });
    }, [filters.min_quantity, filters.max_quantity]);

    // Calcolare numero di filtri attivi
    const activeFiltersCount = useMemo(() => {
        let count = 0;
        if (filters.search) count++;
        if (filters.employee_uuid) count++;
        if (filters.order_uuid) count++;
        if (filters.date_from) count++;
        if (filters.date_to) count++;
        if (
            minQuantity !== '' &&
            minQuantity !== null &&
            minQuantity !== undefined
        )
            count++;
        if (
            maxQuantity !== '' &&
            maxQuantity !== null &&
            maxQuantity !== undefined
        )
            count++;
        return count;
    }, [filters, minQuantity, maxQuantity]);

    // Applicare i filtri
    const applyFilters = (newFilters: Partial<typeof filters>) => {
        setIsLoading(true);
        const params: Record<string, string | undefined> = {
            search: newFilters.search ?? filters.search ?? undefined,
            employee_uuid:
                newFilters.employee_uuid ?? filters.employee_uuid ?? undefined,
            order_uuid:
                newFilters.order_uuid ?? filters.order_uuid ?? undefined,
            date_from: newFilters.date_from ?? filters.date_from ?? undefined,
            date_to: newFilters.date_to ?? filters.date_to ?? undefined,
            sort_by: newFilters.sort_by ?? filters.sort_by ?? undefined,
            sort_order:
                newFilters.sort_order ?? filters.sort_order ?? undefined,
            per_page: newFilters.per_page ?? filters.per_page ?? undefined,
        };

        if (
            minQuantity !== '' &&
            minQuantity !== null &&
            minQuantity !== undefined
        ) {
            params.min_quantity = String(minQuantity);
        }
        if (
            maxQuantity !== '' &&
            maxQuantity !== null &&
            maxQuantity !== undefined
        ) {
            params.max_quantity = String(maxQuantity);
        }

        router.get(productionOrderProcessing.index().url, params, {
            preserveState: true,
            preserveScroll: true,
            onFinish: () => setIsLoading(false),
        });
    };

    // Resettare tutti i filtri
    const clearAllFilters = () => {
        setSearchValue('');
        setSelectedEmployee('');
        setSelectedOrder('');
        setDateFrom('');
        setDateTo('');
        setMinQuantity('');
        setMaxQuantity('');
        setIsLoading(true);
        router.get(
            productionOrderProcessing.index().url,
            {},
            {
                preserveState: true,
                preserveScroll: true,
                onFinish: () => setIsLoading(false),
            },
        );
    };

    // Preset date
    const applyDatePreset = (preset: string) => {
        const today = new Date();
        let from = '';
        let to = '';

        switch (preset) {
            case 'today':
                from = today.toISOString().split('T')[0];
                to = today.toISOString().split('T')[0];
                break;
            case 'this_week': {
                const startOfWeek = new Date(today);
                startOfWeek.setDate(today.getDate() - today.getDay());
                from = startOfWeek.toISOString().split('T')[0];
                to = today.toISOString().split('T')[0];
                break;
            }
            case 'this_month':
                from = new Date(today.getFullYear(), today.getMonth(), 1)
                    .toISOString()
                    .split('T')[0];
                to = today.toISOString().split('T')[0];
                break;
            case 'last_7_days': {
                const lastWeek = new Date(today);
                lastWeek.setDate(today.getDate() - 7);
                from = lastWeek.toISOString().split('T')[0];
                to = today.toISOString().split('T')[0];
                break;
            }
            case 'last_30_days': {
                const lastMonth = new Date(today);
                lastMonth.setDate(today.getDate() - 30);
                from = lastMonth.toISOString().split('T')[0];
                to = today.toISOString().split('T')[0];
                break;
            }
        }

        setDateFrom(from);
        setDateTo(to);
        applyFilters({
            date_from: from || undefined,
            date_to: to || undefined,
        });
    };

    // Ordinamento
    const handleSort = (column: string) => {
        const currentSort = filters.sort_by;
        const currentOrder = filters.sort_order;

        let newOrder: string;
        if (currentSort === column) {
            newOrder = currentOrder === 'asc' ? 'desc' : 'asc';
        } else {
            newOrder = 'desc';
        }

        applyFilters({ sort_by: column, sort_order: newOrder });
    };

    // Icona ordinamento
    const getSortIcon = (column: string) => {
        if (filters.sort_by !== column) {
            return <ArrowUpDown className="ml-1 h-3 w-3 opacity-50" />;
        }
        return filters.sort_order === 'asc' ? (
            <ArrowUp className="ml-1 h-3 w-3" />
        ) : (
            <ArrowDown className="ml-1 h-3 w-3" />
        );
    };

    // Ricerca con debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchValue !== (filters.search ?? '')) {
                setIsSearching(true);
                setIsLoading(true);
                applyFilters({ search: searchValue || undefined });
                setIsSearching(false);
            }
        }, 500);
        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps -- debounce: run on searchValue only to avoid loops
    }, [searchValue]);

    const handleDeleteClick = (processing: ProductionOrderProcessing) => {
        setDeleteDialog({ open: true, processing });
    };

    const handleDeleteConfirm = () => {
        if (!deleteDialog.processing) return;

        setIsDeleting(true);
        router.delete(
            productionOrderProcessing.destroy({
                productionOrderProcessing: deleteDialog.processing.uuid,
            }).url,
            {
                preserveScroll: true,
                onSuccess: () => {
                    setDeleteDialog({ open: false, processing: null });
                    setIsDeleting(false);
                },
                onError: () => {
                    setIsDeleting(false);
                },
            },
        );
    };

    // Esportare CSV
    const handleExportCSV = () => {
        const headers = [
            'ID',
            'Personale',
            'Matricola',
            'Ordine',
            'Quantità',
            'Data e Ora Lavorazione',
        ];
        const rows = processingsPaginated.data.map((processing) => [
            processing.id,
            processing.employee
                ? `${processing.employee.name} ${processing.employee.surname}`
                : '',
            processing.employee?.matriculation_number || '',
            processing.order?.order_production_number || '',
            formatDecimal(processing.quantity, 2, ''),
            processing.processed_datetime
                ? new Date(processing.processed_datetime).toLocaleString(
                      'it-IT',
                  )
                : '',
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map((row) =>
                row
                    .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
                    .join(','),
            ),
        ].join('\n');

        const blob = new Blob(['\ufeff' + csvContent], {
            type: 'text/csv;charset=utf-8;',
        });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute(
            'download',
            `lavorazioni_ordini_${new Date().toISOString().split('T')[0]}.csv`,
        );
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Ordini',
            href: '/orders',
        },
        {
            title: 'Gestione Lavorazione Ordini',
            href: productionOrderProcessing.index().url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gestione Lavorazione Ordini" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Gestione Lavorazione Ordini
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Elenco delle lavorazioni ordini di produzione.
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <Link
                            href={productionOrderProcessing.create().url}
                            className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90"
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Aggiungi nuovo
                        </Link>
                        {processingsPaginated.total > 0 && (
                            <button
                                onClick={handleExportCSV}
                                className="inline-flex items-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-muted"
                                title="Esporta tutti i risultati in CSV"
                            >
                                <Download className="mr-2 h-4 w-4" />
                                Esporta CSV
                            </button>
                        )}
                    </div>
                </div>

                <FlashNotifications flash={flash} />

                {/* Filtri attivi */}
                {activeFiltersCount > 0 && (
                    <div className="flex items-center justify-between gap-2 rounded-xl border border-sidebar-border/70 bg-card p-3 dark:border-sidebar-border">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs font-medium text-muted-foreground">
                                Filtri attivi:
                            </span>
                            <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                                {activeFiltersCount}
                            </span>
                            {filters.search && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-1 text-xs">
                                    Cerca: "{filters.search}"
                                    <button
                                        onClick={() => {
                                            setSearchValue('');
                                            applyFilters({ search: undefined });
                                        }}
                                        className="hover:opacity-70"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </span>
                            )}
                            {filters.employee_uuid && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-1 text-xs">
                                    Personale selezionato
                                    <button
                                        onClick={() => {
                                            setSelectedEmployee('');
                                            applyFilters({
                                                employee_uuid: undefined,
                                            });
                                        }}
                                        className="hover:opacity-70"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </span>
                            )}
                            {filters.order_uuid && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-1 text-xs">
                                    Ordine selezionato
                                    <button
                                        onClick={() => {
                                            setSelectedOrder('');
                                            applyFilters({
                                                order_uuid: undefined,
                                            });
                                        }}
                                        className="hover:opacity-70"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </span>
                            )}
                            {(filters.date_from || filters.date_to) && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-1 text-xs">
                                    Date: {filters.date_from || '...'} -{' '}
                                    {filters.date_to || '...'}
                                    <button
                                        onClick={() => {
                                            setDateFrom('');
                                            setDateTo('');
                                            applyFilters({
                                                date_from: undefined,
                                                date_to: undefined,
                                            });
                                        }}
                                        className="hover:opacity-70"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </span>
                            )}
                            {minQuantity !== '' &&
                                minQuantity !== null &&
                                minQuantity !== undefined && (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-1 text-xs">
                                        Q.tà min: {minQuantity}
                                        <button
                                            onClick={() => {
                                                setMinQuantity('');
                                                applyFilters({});
                                            }}
                                            className="hover:opacity-70"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </span>
                                )}
                            {maxQuantity !== '' &&
                                maxQuantity !== null &&
                                maxQuantity !== undefined && (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-1 text-xs">
                                        Q.tà max: {maxQuantity}
                                        <button
                                            onClick={() => {
                                                setMaxQuantity('');
                                                applyFilters({});
                                            }}
                                            className="hover:opacity-70"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </span>
                                )}
                        </div>
                        <button
                            onClick={clearAllFilters}
                            className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-3 py-1.5 text-xs font-medium shadow-sm transition-colors hover:bg-muted"
                        >
                            <FilterX className="h-3 w-3" />
                            Resetta filtri
                        </button>
                    </div>
                )}

                {/* Pannello filtri */}
                <div className="flex flex-col gap-3 rounded-xl border border-sidebar-border/70 bg-card p-4 dark:border-sidebar-border">
                    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-5">
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-muted-foreground">
                                Cerca
                            </label>
                            <div className="relative">
                                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <input
                                    type="text"
                                    value={searchValue}
                                    onChange={(e) =>
                                        setSearchValue(e.target.value)
                                    }
                                    placeholder="Personale, ordine..."
                                    className="w-full rounded-md border border-input bg-background px-3 py-2 pr-9 pl-9 text-sm shadow-sm focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
                                />
                                {isSearching && (
                                    <Loader2 className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
                                )}
                                {searchValue && !isSearching && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSearchValue('');
                                            applyFilters({ search: undefined });
                                        }}
                                        className="absolute top-1/2 right-3 -translate-y-1/2 transition-opacity hover:opacity-70"
                                    >
                                        <X className="h-4 w-4 text-muted-foreground" />
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-medium text-muted-foreground">
                                Personale
                            </label>
                            <Select
                                value={selectedEmployee || 'all'}
                                onValueChange={(value) => {
                                    const next = value === 'all' ? '' : value;
                                    setSelectedEmployee(next);
                                    applyFilters({
                                        employee_uuid: next || undefined,
                                    });
                                }}
                            >
                                <SelectTrigger
                                    className="w-full"
                                    aria-label="Personale"
                                >
                                    <SelectValue placeholder="Tutti i dipendenti" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        Tutti i dipendenti
                                    </SelectItem>
                                    {employees.map((employee) => (
                                        <SelectItem
                                            key={employee.uuid}
                                            value={employee.uuid}
                                        >
                                            {employee.surname} {employee.name} (
                                            {employee.matriculation_number})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-medium text-muted-foreground">
                                Ordine
                            </label>
                            <Select
                                value={selectedOrder || 'all'}
                                onValueChange={(value) => {
                                    const next = value === 'all' ? '' : value;
                                    setSelectedOrder(next);
                                    applyFilters({
                                        order_uuid: next || undefined,
                                    });
                                }}
                            >
                                <SelectTrigger
                                    className="w-full"
                                    aria-label="Ordine"
                                >
                                    <SelectValue placeholder="Tutti gli ordini" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        Tutti gli ordini
                                    </SelectItem>
                                    {orders.map((order) => (
                                        <SelectItem
                                            key={order.uuid}
                                            value={order.uuid}
                                        >
                                            {order.order_production_number}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-medium text-muted-foreground">
                                Quantità min
                            </label>
                            <input
                                type="number"
                                value={minQuantity === '' ? '' : minQuantity}
                                onChange={(e) => {
                                    const inputValue = e.target.value;
                                    if (inputValue === '') {
                                        setMinQuantity('');
                                        setTimeout(() => {
                                            applyFilters({});
                                        }, 500);
                                    } else {
                                        const numValue = parseFloat(inputValue);
                                        if (!isNaN(numValue) && numValue >= 0) {
                                            setMinQuantity(numValue);
                                            setTimeout(() => {
                                                applyFilters({});
                                            }, 500);
                                        }
                                    }
                                }}
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
                                placeholder="Minimo"
                                min="0"
                                step="0.01"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-medium text-muted-foreground">
                                Elementi per pagina
                            </label>
                            <Select
                                value={String(filters.per_page || '10')}
                                onValueChange={(value) =>
                                    applyFilters({ per_page: value })
                                }
                            >
                                <SelectTrigger
                                    className="w-full"
                                    aria-label="Elementi per pagina"
                                >
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="10">10</SelectItem>
                                    <SelectItem value="25">25</SelectItem>
                                    <SelectItem value="50">50</SelectItem>
                                    <SelectItem value="100">100</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Filtri data */}
                    <div className="mt-2 grid gap-3 border-t pt-3 md:grid-cols-2 lg:grid-cols-6">
                        <div className="space-y-1 md:col-span-2">
                            <label className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
                                <Calendar className="h-3 w-3" />
                                Data lavorazione
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="date"
                                    value={dateFrom}
                                    onChange={(e) => {
                                        setDateFrom(e.target.value);
                                        applyFilters({
                                            date_from:
                                                e.target.value || undefined,
                                        });
                                    }}
                                    className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
                                />
                                <span className="self-center text-xs text-muted-foreground">
                                    -
                                </span>
                                <input
                                    type="date"
                                    value={dateTo}
                                    onChange={(e) => {
                                        setDateTo(e.target.value);
                                        applyFilters({
                                            date_to:
                                                e.target.value || undefined,
                                        });
                                    }}
                                    className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
                                />
                            </div>
                        </div>
                        <div className="space-y-1 md:col-span-4">
                            <label className="text-xs font-medium text-muted-foreground">
                                Presets rapidi
                            </label>
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={() => applyDatePreset('today')}
                                    className="rounded-md border border-input bg-background px-2 py-1 text-xs transition-colors hover:bg-muted"
                                >
                                    Oggi
                                </button>
                                <button
                                    onClick={() => applyDatePreset('this_week')}
                                    className="rounded-md border border-input bg-background px-2 py-1 text-xs transition-colors hover:bg-muted"
                                >
                                    Questa settimana
                                </button>
                                <button
                                    onClick={() =>
                                        applyDatePreset('this_month')
                                    }
                                    className="rounded-md border border-input bg-background px-2 py-1 text-xs transition-colors hover:bg-muted"
                                >
                                    Questo mese
                                </button>
                                <button
                                    onClick={() =>
                                        applyDatePreset('last_7_days')
                                    }
                                    className="rounded-md border border-input bg-background px-2 py-1 text-xs transition-colors hover:bg-muted"
                                >
                                    Ultimi 7 giorni
                                </button>
                                <button
                                    onClick={() =>
                                        applyDatePreset('last_30_days')
                                    }
                                    className="rounded-md border border-input bg-background px-2 py-1 text-xs transition-colors hover:bg-muted"
                                >
                                    Ultimi 30 giorni
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contatore risultati */}
                <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-3">
                        <div>
                            Da {processingsPaginated.from || 0} a{' '}
                            {processingsPaginated.to || 0} di{' '}
                            {processingsPaginated.total || 0} lavorazioni
                        </div>
                    </div>
                    {processingsPaginated.total > 0 && (
                        <div className="text-xs">
                            Totale quantità:{' '}
                            {formatDecimal(
                                processingsPaginated.data.reduce(
                                    (sum, processing) => {
                                        return (
                                            sum +
                                            parseDecimal(processing.quantity, 0)
                                        );
                                    },
                                    0,
                                ),
                                2,
                            )}
                        </div>
                    )}
                </div>

                {/* Tabella */}
                <div className="relative min-h-[300px] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 bg-card dark:border-sidebar-border">
                    <div className="relative h-full w-full overflow-auto">
                        <div className="overflow-x-auto">
                            <table className="min-w-full border-separate border-spacing-0 text-left text-sm">
                                <thead className="sticky top-0 z-10 bg-muted/80 backdrop-blur">
                                    <tr className="text-xs tracking-wide text-muted-foreground uppercase">
                                        <th
                                            className="cursor-pointer border-b px-3 py-2 font-medium transition-colors hover:bg-muted/50"
                                            onClick={() => handleSort('id')}
                                            title="Clicca per ordinare per ID"
                                        >
                                            <div className="flex items-center">
                                                ID
                                                {getSortIcon('id')}
                                            </div>
                                        </th>
                                        <th className="border-b px-3 py-2 font-medium">
                                            Personale
                                        </th>
                                        <th className="border-b px-3 py-2 font-medium">
                                            Ordine
                                        </th>
                                        <th
                                            className="cursor-pointer border-b px-3 py-2 font-medium transition-colors hover:bg-muted/50"
                                            onClick={() =>
                                                handleSort('quantity')
                                            }
                                            title="Clicca per ordinare per quantità"
                                        >
                                            <div className="flex items-center">
                                                Quantità
                                                {getSortIcon('quantity')}
                                            </div>
                                        </th>
                                        <th
                                            className="cursor-pointer border-b px-3 py-2 font-medium transition-colors hover:bg-muted/50"
                                            onClick={() =>
                                                handleSort('processed_datetime')
                                            }
                                            title="Clicca per ordinare per data"
                                        >
                                            <div className="flex items-center">
                                                Data e Ora Lavorazione
                                                {getSortIcon(
                                                    'processed_datetime',
                                                )}
                                            </div>
                                        </th>
                                        <th className="border-b px-3 py-2 text-right font-medium">
                                            Azioni
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {isLoading &&
                                    processingsPaginated.data.length === 0 ? (
                                        Array.from({ length: 5 }).map(
                                            (_, index) => (
                                                <tr
                                                    key={`skeleton-${index}`}
                                                    className="border-b border-sidebar-border/70"
                                                >
                                                    <td className="px-3 py-3">
                                                        <div className="h-4 animate-pulse rounded bg-muted" />
                                                    </td>
                                                    <td className="px-3 py-3">
                                                        <div className="h-4 w-32 animate-pulse rounded bg-muted" />
                                                    </td>
                                                    <td className="px-3 py-3">
                                                        <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                                                    </td>
                                                    <td className="px-3 py-3">
                                                        <div className="h-4 w-16 animate-pulse rounded bg-muted" />
                                                    </td>
                                                    <td className="px-3 py-3">
                                                        <div className="h-4 w-32 animate-pulse rounded bg-muted" />
                                                    </td>
                                                    <td className="px-3 py-3 text-right">
                                                        <div className="ml-auto h-8 w-16 animate-pulse rounded bg-muted" />
                                                    </td>
                                                </tr>
                                            ),
                                        )
                                    ) : processingsPaginated.data.length ===
                                      0 ? (
                                        <tr>
                                            <td
                                                colSpan={6}
                                                className="px-3 py-8 text-center text-sm text-muted-foreground"
                                            >
                                                Nessuna lavorazione disponibile.
                                            </td>
                                        </tr>
                                    ) : (
                                        processingsPaginated.data.map(
                                            (processing) => (
                                                <tr
                                                    key={processing.uuid}
                                                    className="border-b border-sidebar-border/70 hover:bg-muted/50 dark:border-sidebar-border"
                                                >
                                                    <td className="px-3 py-2 align-middle text-xs">
                                                        {processing.id}
                                                    </td>
                                                    <td className="px-3 py-2">
                                                        {processing.employee ? (
                                                            <div>
                                                                <div className="font-medium">
                                                                    {
                                                                        processing
                                                                            .employee
                                                                            .name
                                                                    }{' '}
                                                                    {
                                                                        processing
                                                                            .employee
                                                                            .surname
                                                                    }
                                                                </div>
                                                                <div className="text-xs text-muted-foreground">
                                                                    Matr:{' '}
                                                                    {
                                                                        processing
                                                                            .employee
                                                                            .matriculation_number
                                                                    }
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <span className="text-muted-foreground">
                                                                -
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-3 py-2 font-medium">
                                                        {processing.order ? (
                                                            <Link
                                                                href={
                                                                    ordersRoutes.show(
                                                                        {
                                                                            order: processing
                                                                                .order
                                                                                .uuid,
                                                                        },
                                                                    ).url
                                                                }
                                                                className="text-primary hover:underline"
                                                            >
                                                                {
                                                                    processing
                                                                        .order
                                                                        .order_production_number
                                                                }
                                                            </Link>
                                                        ) : (
                                                            <span className="text-muted-foreground">
                                                                -
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-3 py-2 text-xs">
                                                        {(() => {
                                                            const qty =
                                                                parseDecimal(
                                                                    processing.quantity,
                                                                );
                                                            if (qty === 0) {
                                                                return (
                                                                    <span className="text-muted-foreground">
                                                                        -
                                                                    </span>
                                                                );
                                                            }
                                                            const numQty =
                                                                typeof qty ===
                                                                'string'
                                                                    ? parseFloat(
                                                                          qty,
                                                                      )
                                                                    : qty;
                                                            if (isNaN(numQty)) {
                                                                return (
                                                                    <span className="text-muted-foreground">
                                                                        -
                                                                    </span>
                                                                );
                                                            }
                                                            return numQty.toFixed(
                                                                2,
                                                            );
                                                        })()}
                                                    </td>
                                                    <td className="px-3 py-2 text-xs">
                                                        {processing.processed_datetime ? (
                                                            new Date(
                                                                processing.processed_datetime,
                                                            ).toLocaleString(
                                                                'it-IT',
                                                                {
                                                                    year: 'numeric',
                                                                    month: '2-digit',
                                                                    day: '2-digit',
                                                                    hour: '2-digit',
                                                                    minute: '2-digit',
                                                                },
                                                            )
                                                        ) : (
                                                            <span className="text-muted-foreground">
                                                                -
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-3 py-2 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button
                                                                onClick={() =>
                                                                    handleDeleteClick(
                                                                        processing,
                                                                    )
                                                                }
                                                                className="inline-flex items-center justify-center rounded-md p-2 text-xs text-destructive transition-colors hover:bg-destructive/10"
                                                                title="Elimina"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ),
                                        )
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Paginazione migliorata */}
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
                    <div>
                        Pagina {processingsPaginated.current_page} di{' '}
                        {processingsPaginated.last_page}
                    </div>
                    <div className="flex items-center gap-2">
                        {processingsPaginated.current_page > 1 && (
                            <button
                                onClick={() => {
                                    const firstLink =
                                        processingsPaginated.links[0];
                                    if (firstLink?.url) {
                                        router.get(
                                            firstLink.url,
                                            {},
                                            {
                                                preserveState: true,
                                                preserveScroll: true,
                                            },
                                        );
                                    }
                                }}
                                className="rounded-md border border-input bg-background px-3 py-1 text-sm transition-colors hover:bg-muted"
                            >
                                Prima
                            </button>
                        )}
                        <button
                            onClick={() => {
                                const prevLink =
                                    processingsPaginated.links.find((l) =>
                                        l.label.includes('&laquo;'),
                                    );
                                if (
                                    prevLink?.url &&
                                    processingsPaginated.current_page > 1
                                ) {
                                    router.get(
                                        prevLink.url,
                                        {},
                                        {
                                            preserveState: true,
                                            preserveScroll: true,
                                        },
                                    );
                                }
                            }}
                            disabled={processingsPaginated.current_page === 1}
                            className={`rounded-md border border-input bg-background px-3 py-1 text-sm ${
                                processingsPaginated.current_page === 1
                                    ? 'cursor-not-allowed opacity-50'
                                    : 'transition-colors hover:bg-muted'
                            }`}
                        >
                            Precedente
                        </button>
                        <button
                            onClick={() => {
                                const nextLink =
                                    processingsPaginated.links.find((l) =>
                                        l.label.includes('&raquo;'),
                                    );
                                if (
                                    nextLink?.url &&
                                    processingsPaginated.current_page <
                                        processingsPaginated.last_page
                                ) {
                                    router.get(
                                        nextLink.url,
                                        {},
                                        {
                                            preserveState: true,
                                            preserveScroll: true,
                                        },
                                    );
                                }
                            }}
                            disabled={
                                processingsPaginated.current_page ===
                                processingsPaginated.last_page
                            }
                            className={`rounded-md border border-input bg-background px-3 py-1 text-sm ${
                                processingsPaginated.current_page ===
                                processingsPaginated.last_page
                                    ? 'cursor-not-allowed opacity-50'
                                    : 'transition-colors hover:bg-muted'
                            }`}
                        >
                            Successiva
                        </button>
                        {processingsPaginated.current_page <
                            processingsPaginated.last_page && (
                            <button
                                onClick={() => {
                                    const lastLink =
                                        processingsPaginated.links[
                                            processingsPaginated.links.length -
                                                1
                                        ];
                                    if (lastLink?.url) {
                                        router.get(
                                            lastLink.url,
                                            {},
                                            {
                                                preserveState: true,
                                                preserveScroll: true,
                                            },
                                        );
                                    }
                                }}
                                className="rounded-md border border-input bg-background px-3 py-1 text-sm transition-colors hover:bg-muted"
                            >
                                Ultima
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <ConfirmDeleteDialog
                open={deleteDialog.open}
                onOpenChange={(open) =>
                    setDeleteDialog({ open, processing: null })
                }
                onConfirm={handleDeleteConfirm}
                isLoading={isDeleting}
                title="Conferma eliminazione"
                description="Sei sicuro di voler eliminare questa lavorazione ordine? Questa azione non può essere annullata. La lavorazione verrà eliminata definitivamente."
            />
        </AppLayout>
    );
}
