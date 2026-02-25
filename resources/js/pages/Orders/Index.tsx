import { ActionsDropdown } from '@/components/ActionsDropdown';
import ConfirmDeleteDialog from '@/components/confirm-delete-dialog';
import {
    FlashNotifications,
    useFlashNotifications,
} from '@/components/flash-notifications';
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
import {
    getOrderStatusColor,
    getOrderStatusLabelKey,
} from '@/constants/orderStatus';
import { useTranslations } from '@/hooks/use-translations';
import AppLayout from '@/layouts/app-layout';
import { getDateLocale } from '@/lib/locales';
import {
    calculateProgress,
    formatDecimal,
    parseDecimal,
} from '@/lib/utils/number';
import api from '@/routes/api';
import articlesRoutes from '@/routes/articles/index';
import offers from '@/routes/offers/index';
import orders from '@/routes/orders/index';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    AlertTriangle,
    Bookmark,
    Calendar,
    CalendarCheck,
    CheckCircle2,
    CheckSquare,
    Download,
    FileText,
    Filter,
    FilterX,
    Info,
    LayoutGrid,
    Loader2,
    Package,
    Plus,
    Save,
    Search,
    Settings,
    Square,
    Star,
    Table,
    Trash2,
    X,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

type Article = {
    uuid: string;
    cod_article_las: string;
    article_descr?: string | null;
    offer_uuid?: string | null;
};

type Customer = {
    uuid: string;
    code: string;
    name: string;
};

type Order = {
    id: number;
    uuid: string;
    order_production_number: string;
    number_customer_reference_order?: string | null;
    line?: number | null;
    quantity?: number | string | null;
    worked_quantity?: number | string | null;
    delivery_requested_date?: string | null;
    status: number;
    article?: Article | null;
    status_semaforo?: {
        etichette: number;
        packaging: number;
        prodotto: number;
    } | null;
};

type OrdersIndexProps = {
    orders: {
        data: Order[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number | null;
        to: number | null;
        links: { url: string | null; label: string; active: boolean }[];
    };
    articles: Article[];
    customers: Customer[];
    filters: {
        search?: string;
        article_uuid?: string;
        status?: string;
        customer_uuid?: string;
        date_from?: string;
        date_to?: string;
        autocontrollo?: string;
        sort_by?: string;
        sort_order?: string;
        per_page?: string;
    };
    flash?: {
        success?: string;
        error?: string;
    };
};

const STATUS_OPTIONS_VALUES = [
    { value: '', key: 'orders.filter.status_all' },
    { value: '0,1,2,3,4', key: 'orders.filter.status_active' },
    { value: '2,3', key: 'orders.filter.status_launched_advancement' },
    { value: '0', key: 'orders.filter.status_planned' },
    { value: '1', key: 'orders.filter.status_preparation' },
    { value: '2', key: 'orders.filter.status_launched' },
    { value: '3', key: 'orders.filter.status_advancement' },
    { value: '4', key: 'orders.filter.status_suspended' },
    { value: 'completed', key: 'orders.filter.status_completed' },
] as const;

export default function OrdersIndex() {
    const { props } = usePage<OrdersIndexProps & { locale?: string }>();
    const {
        orders: ordersPaginated,
        articles,
        customers = [],
        filters,
    } = props;
    const { flash } = useFlashNotifications();
    const { t } = useTranslations();
    const statusOptions = useMemo(
        () =>
            STATUS_OPTIONS_VALUES.map((o) => ({
                value: o.value,
                label: t(o.key),
            })),
        [t],
    );

    const [searchValue, setSearchValue] = useState(filters.search ?? '');
    const [selectedArticle, setSelectedArticle] = useState(
        filters.article_uuid ?? '',
    );
    const [selectedStatus, setSelectedStatus] = useState(filters.status ?? '');
    const [selectedCustomer, setSelectedCustomer] = useState(
        filters.customer_uuid ?? '',
    );
    const [dateFrom, setDateFrom] = useState(filters.date_from ?? '');
    const [dateTo, setDateTo] = useState(filters.date_to ?? '');
    const [selectedAutocontrollo, setSelectedAutocontrollo] = useState(
        filters.autocontrollo ?? '',
    );
    const [isSearching, setIsSearching] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState<{
        open: boolean;
        order: Order | null;
    }>({
        open: false,
        order: null,
    });
    const [isDeleting, setIsDeleting] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [downloadingBarcode, setDownloadingBarcode] = useState<string | null>(
        null,
    );
    const [downloadingAutocontrollo, setDownloadingAutocontrollo] = useState<
        string | null
    >(null);
    const [reschedulingOrder, setReschedulingOrder] = useState<string | null>(
        null,
    );
    const [viewMode, setViewMode] = useState<'table' | 'cards'>(() => {
        const saved = localStorage.getItem('orders_view_mode');
        return saved === 'cards' || saved === 'table' ? saved : 'table';
    });
    const [selectedOrders, setSelectedOrders] = useState<Set<string>>(
        new Set(),
    );

    // Legacy: Orders table does NOT show Semaphores nor Qty Worked/Progress
    // (order.php: status_semaforo e worked_quantity hanno visible => false).
    // Progress and Semaphore columns are hidden by default; user can enable them from column menu.
    function getDefaultVisibleColumns(): Record<string, boolean> {
        return {
            id: true,
            order_production_number: true,
            number_customer_reference_order: true,
            line: true,
            cod_article_las: true,
            quantity: true,
            progress: false,
            semaforo: false,
            delivery_requested_date: true,
            status: true,
            actions: true,
        };
    }
    const [visibleColumns, setVisibleColumns] = useState<
        Record<string, boolean>
    >(() => {
        const saved = localStorage.getItem('orders_visible_columns');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch {
                return getDefaultVisibleColumns();
            }
        }
        return getDefaultVisibleColumns();
    });
    const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
    const [showColumnSettings, setShowColumnSettings] = useState(false);
    const [minQuantity, setMinQuantity] = useState<number | ''>('');
    const [maxQuantity, setMaxQuantity] = useState<number | ''>('');
    const [savedFilters, setSavedFilters] = useState<
        Array<{ name: string; filters: typeof filters }>
    >(() => {
        try {
            return JSON.parse(
                localStorage.getItem('orders_saved_filters') || '[]',
            );
        } catch {
            return [];
        }
    });

    // Calculate number of active filters
    const activeFiltersCount = useMemo(() => {
        let count = 0;
        if (filters.search) count++;
        if (filters.article_uuid) count++;
        if (filters.status) count++;
        if (filters.customer_uuid) count++;
        if (filters.date_from) count++;
        if (filters.date_to) count++;
        if (filters.autocontrollo) count++;
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

    // Apply filters
    const applyFilters = (newFilters: Partial<typeof filters>) => {
        setIsLoading(true);
        const params: Record<string, string | undefined> = {
            search: newFilters.search ?? filters.search ?? undefined,
            article_uuid:
                newFilters.article_uuid ?? filters.article_uuid ?? undefined,
            status: newFilters.status ?? filters.status ?? undefined,
            customer_uuid:
                newFilters.customer_uuid ?? filters.customer_uuid ?? undefined,
            date_from: newFilters.date_from ?? filters.date_from ?? undefined,
            date_to: newFilters.date_to ?? filters.date_to ?? undefined,
            autocontrollo:
                newFilters.autocontrollo ?? filters.autocontrollo ?? undefined,
            sort_by: newFilters.sort_by ?? filters.sort_by ?? undefined,
            sort_order:
                newFilters.sort_order ?? filters.sort_order ?? undefined,
            per_page: newFilters.per_page ?? filters.per_page ?? undefined,
        };

        // Add quantity filters if defined
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

        router.get(orders.index().url, params, {
            preserveState: true,
            preserveScroll: true,
            onFinish: () => setIsLoading(false),
        });
    };

    // Reset all filters
    const clearAllFilters = () => {
        setSearchValue('');
        setSelectedArticle('');
        setSelectedStatus('');
        setSelectedCustomer('');
        setDateFrom('');
        setDateTo('');
        setSelectedAutocontrollo('');
        setMinQuantity('');
        setMaxQuantity('');
        setIsLoading(true);
        router.get(
            orders.index().url,
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
            case 'next_7_days': {
                from = today.toISOString().split('T')[0];
                const nextWeek = new Date(today);
                nextWeek.setDate(today.getDate() + 7);
                to = nextWeek.toISOString().split('T')[0];
                break;
            }
            case 'next_30_days': {
                from = today.toISOString().split('T')[0];
                const nextMonth = new Date(today);
                nextMonth.setDate(today.getDate() + 30);
                to = nextMonth.toISOString().split('T')[0];
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

    // Helper to validate and convert sort_order to literal type
    const getSortDirection = (order?: string): 'asc' | 'desc' | undefined => {
        if (order === 'asc' || order === 'desc') {
            return order;
        }
        return undefined;
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

    // Calculate progress
    const getProgress = (order: Order): number => {
        return calculateProgress(order.worked_quantity, order.quantity);
    };

    // Colore del progresso
    const getProgressColor = (progress: number): string => {
        if (progress < 30) return 'bg-red-500';
        if (progress < 80) return 'bg-yellow-500';
        return 'bg-emerald-500';
    };

    // Check if order is urgent or delayed
    const getUrgencyStatus = (
        order: Order,
    ): { type: 'overdue' | 'urgent' | 'normal'; icon: React.ReactElement } => {
        // For completed orders (Evaso/Saldato) it doesn't make sense to signal delays:
        // mostriamo sempre lo stato \"ok\".
        if (order.status === 5 || order.status === 6) {
            return {
                type: 'normal',
                icon: <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
            };
        }

        if (!order.delivery_requested_date) {
            return {
                type: 'normal',
                icon: <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
            };
        }

        const deliveryDate = new Date(order.delivery_requested_date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        deliveryDate.setHours(0, 0, 0, 0);

        const diffDays = Math.ceil(
            (deliveryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
        );

        if (diffDays < 0) {
            return {
                type: 'overdue',
                icon: <AlertTriangle className="h-4 w-4 text-red-500" />,
            };
        }
        if (diffDays <= 3) {
            return {
                type: 'urgent',
                icon: <AlertTriangle className="h-4 w-4 text-yellow-500" />,
            };
        }
        return {
            type: 'normal',
            icon: <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
        };
    };

    const handleSearchChange = (value: string) => {
        setSearchValue(value);
        setIsSearching(true);
        setIsLoading(true);
        applyFilters({ search: value || undefined });
        setIsSearching(false);
    };

    const clearSearch = () => {
        setSearchValue('');
        applyFilters({ search: undefined });
    };

    // Sync state with filters from URL
    useEffect(() => {
        queueMicrotask(() => {
            setSelectedArticle(filters.article_uuid ?? '');
            setSelectedStatus(filters.status ?? '');
            setDateFrom(filters.date_from ?? '');
            setDateTo(filters.date_to ?? '');
            setSelectedAutocontrollo(filters.autocontrollo ?? '');
        });
    }, [
        filters.article_uuid,
        filters.status,
        filters.date_from,
        filters.date_to,
        filters.autocontrollo,
    ]);

    const handleDeleteClick = (order: Order) => {
        setDeleteDialog({ open: true, order });
    };

    const handleDeleteConfirm = () => {
        if (!deleteDialog.order) return;

        setIsDeleting(true);
        router.delete(orders.destroy({ order: deleteDialog.order.uuid }).url, {
            preserveScroll: true,
            onSuccess: () => {
                setDeleteDialog({ open: false, order: null });
                setIsDeleting(false);
            },
            onError: () => {
                setIsDeleting(false);
            },
        });
    };

    /**
     * Download del PDF barcode di un ordine.
     * Usa iframe temporaneo per forzare il dialogo di salvataggio
     * ed evitare che il PDF si apra automaticamente.
     */
    const handleDownloadBarcode = (order: Order) => {
        // Evitare download multipli simultanei dello stesso file
        if (downloadingBarcode === order.uuid) {
            return;
        }

        setDownloadingBarcode(order.uuid);

        try {
            // Create temporary invisible iframe to force download
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.style.width = '0';
            iframe.style.height = '0';
            iframe.setAttribute('aria-hidden', 'true');

            // Impostare src per scaricare il PDF
            // Le intestazioni Content-Disposition: attachment forzano il dialogo
            iframe.src = `/orders/${order.uuid}/download-barcode`;

            // Add to DOM
            document.body.appendChild(iframe);

            // Pulire iframe dopo un delay
            setTimeout(() => {
                if (document.body.contains(iframe)) {
                    document.body.removeChild(iframe);
                }
                setDownloadingBarcode(null);
            }, 1000);
        } catch (error) {
            console.error('Errore nello scaricare il barcode:', error);
            setDownloadingBarcode(null);
            alert(
                error instanceof Error
                    ? `${t('orders.index.barcode_error')}: ${error.message}`
                    : t('orders.index.barcode_error'),
            );
        }
    };

    /**
     * Download del PDF autocontrollo di un ordine.
     * Usa iframe temporaneo per forzare il dialogo di salvataggio
     * ed evitare che il PDF si apra automaticamente.
     */
    const handleDownloadAutocontrollo = (order: Order) => {
        // Evitare download multipli simultanei dello stesso file
        if (downloadingAutocontrollo === order.uuid) {
            return;
        }

        setDownloadingAutocontrollo(order.uuid);

        try {
            // Create temporary invisible iframe to force download
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.style.width = '0';
            iframe.style.height = '0';
            iframe.setAttribute('aria-hidden', 'true');

            // Impostare src per scaricare il PDF
            // Le intestazioni Content-Disposition: attachment forzano il dialogo
            iframe.src = `/orders/${order.uuid}/download-autocontrollo`;

            // Add to DOM
            document.body.appendChild(iframe);

            // Pulire iframe dopo un delay
            setTimeout(() => {
                if (document.body.contains(iframe)) {
                    document.body.removeChild(iframe);
                }
                setDownloadingAutocontrollo(null);
            }, 1000);
        } catch (error) {
            console.error('Errore nello scaricare autocontrollo:', error);
            setDownloadingAutocontrollo(null);
            alert(
                error instanceof Error
                    ? `${t('orders.index.autocontrollo_error')}: ${error.message}`
                    : t('orders.index.autocontrollo_error'),
            );
        }
    };

    /**
     * Forza ripianificazione (mirror legacy "Forza Ripianificazione" in Altre Azioni).
     * Chiama POST /api/planning/force-reschedule e ricarica la pagina in caso di successo.
     */
    const handleForceReschedule = async (order: Order) => {
        if (reschedulingOrder === order.uuid) return;
        setReschedulingOrder(order.uuid);
        try {
            const url = api.planning.forceReschedule.url();
            const csrfToken =
                document
                    .querySelector('meta[name="csrf-token"]')
                    ?.getAttribute('content') ?? '';
            const res = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    ...(csrfToken ? { 'X-CSRF-TOKEN': csrfToken } : {}),
                },
                body: JSON.stringify({ order_uuid: order.uuid }),
                credentials: 'same-origin',
            });
            const data = (await res.json()) as {
                error_code?: number;
                message?: string;
            };
            if (res.ok && data.error_code === 0) {
                router.reload();
            } else {
                alert(data.message || t('orders.index.reschedule_error'));
            }
        } catch (e) {
            console.error('Force reschedule error:', e);
            alert(t('orders.index.reschedule_error'));
        } finally {
            setReschedulingOrder(null);
        }
    };

    // Esportare in CSV
    const handleExportCSV = () => {
        const headers = [
            t('common.id'),
            t('orders.index.csv_production_number'),
            t('orders.index.csv_client_ref'),
            t('orders.index.csv_line'),
            t('orders.index.csv_article_code'),
            t('orders.index.csv_article_desc'),
            t('orders.index.csv_quantity_order'),
            t('orders.index.csv_quantity_worked'),
            t('orders.index.csv_progress'),
            t('orders.index.csv_delivery_date'),
            t('common.status'),
        ];

        const rows = ordersPaginated.data.map((order) => {
            const progress = getProgress(order);
            return [
                order.id,
                order.order_production_number,
                order.number_customer_reference_order || '',
                order.line !== null && order.line !== undefined
                    ? order.line
                    : '',
                order.article?.cod_article_las || '',
                order.article?.article_descr || '',
                formatDecimal(order.quantity, 2, ''),
                formatDecimal(order.worked_quantity, 2, ''),
                progress + '%',
                order.delivery_requested_date
                    ? new Date(
                          order.delivery_requested_date,
                      ).toLocaleDateString(getDateLocale(props.locale ?? 'it'))
                    : '',
                t(getOrderStatusLabelKey(order.status), {
                    status: String(order.status),
                }),
            ];
        });

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
            t('orders.index.csv_filename', {
                date: new Date().toISOString().split('T')[0],
            }),
        );
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Save view preferences
    useEffect(() => {
        localStorage.setItem('orders_view_mode', viewMode);
    }, [viewMode]);

    // Save visible columns
    useEffect(() => {
        const columnsObj: Record<string, boolean> = {};
        [
            'id',
            'order_production_number',
            'number_customer_reference_order',
            'line',
            'article',
            'quantity',
            'progress',
            'semaforo',
            'delivery_date',
            'status',
            'actions',
        ].forEach((key) => {
            columnsObj[key] = visibleColumns[key] ?? true;
        });
        localStorage.setItem(
            'orders_visible_columns',
            JSON.stringify(columnsObj),
        );
    }, [visibleColumns]);

    // Toggle order selection
    const toggleOrderSelection = (orderUuid: string) => {
        const newSelected = new Set(selectedOrders);
        if (newSelected.has(orderUuid)) {
            newSelected.delete(orderUuid);
        } else {
            newSelected.add(orderUuid);
        }
        setSelectedOrders(newSelected);
    };

    // Batch actions
    const handleBatchDelete = () => {
        if (selectedOrders.size === 0) return;
        if (
            confirm(
                t('orders.index.batch_delete_confirm', {
                    count: selectedOrders.size,
                }),
            )
        ) {
            alert(
                t('orders.index.batch_delete_not_implemented', {
                    count: selectedOrders.size,
                }),
            );
            setSelectedOrders(new Set());
        }
    };

    // Save filters as favorite
    const saveFilterAsFavorite = () => {
        const filterName = prompt(t('orders.index.filter_name_prompt'));
        if (filterName) {
            const favorites = JSON.parse(
                localStorage.getItem('orders_filter_favorites') || '[]',
            );
            favorites.push({
                name: filterName,
                filters: { ...filters },
                createdAt: new Date().toISOString(),
            });
            localStorage.setItem(
                'orders_filter_favorites',
                JSON.stringify(favorites),
            );
            alert(t('orders.index.filters_saved'));
        }
    };

    // Load favourite filters
    const loadFilterFavorite = (favoriteFilters: typeof filters) => {
        setSearchValue(favoriteFilters.search ?? '');
        setSelectedArticle(favoriteFilters.article_uuid ?? '');
        setSelectedStatus(favoriteFilters.status ?? '');
        setSelectedCustomer(favoriteFilters.customer_uuid ?? '');
        setDateFrom(favoriteFilters.date_from ?? '');
        setDateTo(favoriteFilters.date_to ?? '');
        applyFilters(favoriteFilters);
    };

    const savedFavorites = useMemo(() => {
        try {
            return JSON.parse(
                localStorage.getItem('orders_filter_favorites') || '[]',
            );
        } catch {
            return [];
        }
    }, []);

    // Load saved filter
    const loadSavedFilter = (saved: {
        name: string;
        filters: typeof filters;
    }) => {
        loadFilterFavorite(saved.filters);
    };

    // Delete saved filter
    const deleteSavedFilter = (index: number) => {
        const newFilters = savedFilters.filter((_, i) => i !== index);
        setSavedFilters(newFilters);
        localStorage.setItem(
            'orders_saved_filters',
            JSON.stringify(newFilters),
        );
    };

    // Save current filters
    const saveCurrentFilters = () => {
        const filterName = prompt(t('orders.index.filter_name_prompt'));
        if (filterName) {
            const newFilters = [
                ...savedFilters,
                {
                    name: filterName,
                    filters: { ...filters },
                },
            ];
            setSavedFilters(newFilters);
            localStorage.setItem(
                'orders_saved_filters',
                JSON.stringify(newFilters),
            );
        }
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('nav.orders'),
            href: orders.index().url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('nav.orders')} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            {t('nav.orders')}
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {t('orders.index.subtitle')}
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <Link
                            href={orders.create().url}
                            className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90"
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            {t('orders.index.new_order')}
                        </Link>
                        {ordersPaginated.total > 0 && (
                            <>
                                <button
                                    onClick={handleExportCSV}
                                    className="inline-flex items-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-muted"
                                    title={t('common.export_csv')}
                                >
                                    <Download className="mr-2 h-4 w-4" />
                                    {t('common.export_csv_short')}
                                </button>
                                <button
                                    onClick={() =>
                                        setViewMode(
                                            viewMode === 'table'
                                                ? 'cards'
                                                : 'table',
                                        )
                                    }
                                    className="inline-flex items-center rounded-md border border-input bg-background px-3 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-muted"
                                    title={
                                        viewMode === 'table'
                                            ? t('orders.index.view_cards')
                                            : t('orders.index.view_table')
                                    }
                                >
                                    {viewMode === 'table' ? (
                                        <LayoutGrid className="h-4 w-4" />
                                    ) : (
                                        <Table className="h-4 w-4" />
                                    )}
                                </button>
                                <button
                                    onClick={() =>
                                        setShowColumnSettings(
                                            !showColumnSettings,
                                        )
                                    }
                                    className="inline-flex items-center rounded-md border border-input bg-background px-3 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-muted"
                                    title={t('common.configure_columns')}
                                >
                                    <Settings className="h-4 w-4" />
                                </button>
                            </>
                        )}
                    </div>
                </div>

                <FlashNotifications flash={flash} />

                {/* Barra azioni in batch */}
                {selectedOrders.size > 0 && (
                    <div className="flex items-center justify-between gap-2 rounded-xl border border-primary/50 bg-primary/5 p-3">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">
                                {selectedOrders.size}{' '}
                                {t('orders.index.orders_selected')}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleBatchDelete}
                                className="inline-flex items-center rounded-md border border-destructive bg-destructive px-3 py-1.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-destructive/90"
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                {t('orders.index.delete_selected')}
                            </button>
                            <button
                                onClick={() => setSelectedOrders(new Set())}
                                className="inline-flex items-center rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium shadow-sm transition-colors hover:bg-muted"
                            >
                                {t('common.cancel')}
                            </button>
                        </div>
                    </div>
                )}

                {/* Filtri attivi e pulsante resetta */}
                {activeFiltersCount > 0 && (
                    <div className="flex items-center justify-between gap-2 rounded-xl border border-sidebar-border/70 bg-card p-3 dark:border-sidebar-border">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs font-medium text-muted-foreground">
                                {t('orders.index.active_filters')}
                            </span>
                            <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                                {activeFiltersCount}
                            </span>
                            {savedFavorites.length > 0 && (
                                <div className="group relative">
                                    <button
                                        onClick={() => {
                                            const menu =
                                                document.getElementById(
                                                    'favorites-menu',
                                                );
                                            if (menu) {
                                                menu.classList.toggle('hidden');
                                            }
                                        }}
                                        className="inline-flex items-center rounded-md border border-input bg-background px-2 py-1 text-xs font-medium shadow-sm transition-colors hover:bg-muted"
                                    >
                                        <Bookmark className="mr-1 h-3 w-3" />
                                        {t('orders.index.favorites')}
                                    </button>
                                    <div
                                        id="favorites-menu"
                                        className="absolute top-full left-0 z-50 mt-1 hidden min-w-[200px] rounded-md border bg-popover shadow-lg"
                                    >
                                        {savedFavorites.map(
                                            (
                                                fav: {
                                                    name?: string;
                                                    filters?: Record<
                                                        string,
                                                        string
                                                    >;
                                                },
                                                idx: number,
                                            ) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => {
                                                        loadFilterFavorite(
                                                            fav.filters ?? {},
                                                        );
                                                        const menu =
                                                            document.getElementById(
                                                                'favorites-menu',
                                                            );
                                                        if (menu)
                                                            menu.classList.add(
                                                                'hidden',
                                                            );
                                                    }}
                                                    className="w-full px-3 py-2 text-left text-sm transition-colors hover:bg-muted"
                                                >
                                                    {fav.name}
                                                </button>
                                            ),
                                        )}
                                    </div>
                                </div>
                            )}
                            <button
                                onClick={saveFilterAsFavorite}
                                className="inline-flex items-center rounded-md border border-input bg-background px-2 py-1 text-xs font-medium shadow-sm transition-colors hover:bg-muted"
                                title={t('common.save_filters_as_favorite')}
                            >
                                <Bookmark className="mr-1 h-3 w-3" />
                                {t('orders.index.save_short')}
                            </button>
                            {filters.search && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-1 text-xs">
                                    {t('orders.index.search_filter')} "
                                    {filters.search}"
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
                            {filters.status && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-1 text-xs">
                                    {t('common.status')}:{' '}
                                    {
                                        statusOptions.find(
                                            (o: {
                                                value: string;
                                                label: string;
                                            }) => o.value === filters.status,
                                        )?.label
                                    }
                                    <button
                                        onClick={() => {
                                            setSelectedStatus('');
                                            applyFilters({ status: undefined });
                                        }}
                                        className="hover:opacity-70"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </span>
                            )}
                            {filters.article_uuid && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-1 text-xs">
                                    {t('orders.filter.article_selected')}
                                    <button
                                        onClick={() => {
                                            setSelectedArticle('');
                                            applyFilters({
                                                article_uuid: undefined,
                                            });
                                        }}
                                        className="hover:opacity-70"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </span>
                            )}
                            {filters.customer_uuid && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-1 text-xs">
                                    {t('common.customer')}:{' '}
                                    {customers.find(
                                        (c) => c.uuid === filters.customer_uuid,
                                    )?.code || t('orders.index.selected')}
                                    <button
                                        onClick={() => {
                                            setSelectedCustomer('');
                                            applyFilters({
                                                customer_uuid: undefined,
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
                                    {t('orders.index.dates_filter')}:{' '}
                                    {filters.date_from || t('common.ellipsis')}{' '}
                                    - {filters.date_to || t('common.ellipsis')}
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
                                        {t('orders.index.qty_min')}:{' '}
                                        {minQuantity}
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
                                        {t('orders.index.qty_max')}:{' '}
                                        {maxQuantity}
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
                            {filters.autocontrollo && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-1 text-xs">
                                    {t('common.autocontrollo')}:{' '}
                                    {filters.autocontrollo === 'false'
                                        ? t('orders.index.pending')
                                        : t('orders.index.completed')}
                                    <button
                                        onClick={() => {
                                            setSelectedAutocontrollo('');
                                            applyFilters({
                                                autocontrollo: undefined,
                                            });
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
                            {t('orders.index.reset_filters')}
                        </button>
                    </div>
                )}

                {/* Pannello filtri */}
                <div className="flex flex-col gap-3 rounded-xl border border-sidebar-border/70 bg-card p-4 dark:border-sidebar-border">
                    {/* Barra azioni filtri */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() =>
                                    setShowAdvancedSearch(!showAdvancedSearch)
                                }
                                className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-3 py-1.5 text-xs font-medium shadow-sm transition-colors hover:bg-muted"
                            >
                                <Filter className="h-3 w-3" />
                                {t('orders.index.advanced_search')}
                            </button>
                            {savedFilters.length > 0 && (
                                <div className="group relative">
                                    <button className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-3 py-1.5 text-xs font-medium shadow-sm transition-colors hover:bg-muted">
                                        <Star className="h-3 w-3" />
                                        {t('orders.index.saved_filters')}
                                    </button>
                                    <div className="absolute top-full left-0 z-20 mt-1 hidden min-w-[200px] rounded-md border bg-popover p-2 text-popover-foreground shadow-md group-hover:block">
                                        {savedFilters.map((saved, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between gap-2 rounded px-2 py-1 hover:bg-muted"
                                            >
                                                <button
                                                    onClick={() =>
                                                        loadSavedFilter(saved)
                                                    }
                                                    className="flex-1 text-left text-xs"
                                                >
                                                    {saved.name}
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        deleteSavedFilter(index)
                                                    }
                                                    className="text-destructive hover:opacity-70"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {activeFiltersCount > 0 && (
                                <button
                                    onClick={saveCurrentFilters}
                                    className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-3 py-1.5 text-xs font-medium shadow-sm transition-colors hover:bg-muted"
                                >
                                    <Save className="h-3 w-3" />
                                    {t('common.save_filters')}
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Ricerca avanzata */}
                    {showAdvancedSearch && (
                        <div className="mt-2 border-t pt-3">
                            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-muted-foreground">
                                        {t('orders.index.min_quantity')}
                                    </label>
                                    <input
                                        type="number"
                                        value={
                                            minQuantity === ''
                                                ? ''
                                                : minQuantity
                                        }
                                        onChange={(e) => {
                                            const inputValue = e.target.value;
                                            if (inputValue === '') {
                                                setMinQuantity('');
                                                setTimeout(() => {
                                                    applyFilters({});
                                                }, 500);
                                            } else {
                                                const numValue =
                                                    parseFloat(inputValue);
                                                if (
                                                    !isNaN(numValue) &&
                                                    numValue >= 0
                                                ) {
                                                    setMinQuantity(numValue);
                                                    setTimeout(() => {
                                                        applyFilters({});
                                                    }, 500);
                                                }
                                            }
                                        }}
                                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
                                        placeholder={t('filter.minimum')}
                                        min="0"
                                        step="0.01"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-muted-foreground">
                                        {t('orders.index.max_quantity')}
                                    </label>
                                    <input
                                        type="number"
                                        value={
                                            maxQuantity === ''
                                                ? ''
                                                : maxQuantity
                                        }
                                        onChange={(e) => {
                                            const inputValue = e.target.value;
                                            if (inputValue === '') {
                                                setMaxQuantity('');
                                                setTimeout(() => {
                                                    applyFilters({});
                                                }, 500);
                                            } else {
                                                const numValue =
                                                    parseFloat(inputValue);
                                                if (
                                                    !isNaN(numValue) &&
                                                    numValue >= 0
                                                ) {
                                                    setMaxQuantity(numValue);
                                                    setTimeout(() => {
                                                        applyFilters({});
                                                    }, 500);
                                                }
                                            }
                                        }}
                                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
                                        placeholder={t('filter.maximum')}
                                        min="0"
                                        step="0.01"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-muted-foreground">
                                        {t('orders.index.urgent_only')}
                                    </label>
                                    <button
                                        onClick={() => {
                                            const today = new Date();
                                            const urgentDate = new Date(today);
                                            urgentDate.setDate(
                                                today.getDate() + 3,
                                            );
                                            setDateFrom(
                                                today
                                                    .toISOString()
                                                    .split('T')[0],
                                            );
                                            setDateTo(
                                                urgentDate
                                                    .toISOString()
                                                    .split('T')[0],
                                            );
                                            applyFilters({
                                                date_from: today
                                                    .toISOString()
                                                    .split('T')[0],
                                                date_to: urgentDate
                                                    .toISOString()
                                                    .split('T')[0],
                                            });
                                        }}
                                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-left text-sm shadow-sm transition-colors hover:bg-muted"
                                    >
                                        {t('orders.index.urgent_orders')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-6">
                        <div className="space-y-1">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-medium text-muted-foreground">
                                    {t('orders.index.search_label')}
                                </label>
                                <button
                                    onClick={() => setShowAdvancedSearch(true)}
                                    className="flex items-center gap-1 text-xs text-primary hover:underline"
                                >
                                    <Search className="h-3 w-3" />
                                    {t('orders.index.advanced_short')}
                                </button>
                            </div>
                            <SearchInput
                                value={searchValue}
                                onChange={handleSearchChange}
                                placeholder={t('orders.search_placeholder')}
                                isLoading={isSearching}
                                onClear={clearSearch}
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-medium text-muted-foreground">
                                {t('common.status')}
                            </label>
                            <Select
                                value={selectedStatus || 'all'}
                                onValueChange={(value) => {
                                    const next = value === 'all' ? '' : value;
                                    setSelectedStatus(next);
                                    applyFilters({ status: next || undefined });
                                }}
                            >
                                <SelectTrigger
                                    className="w-full"
                                    aria-label={t('common.status')}
                                >
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {statusOptions.map((option) => (
                                        <SelectItem
                                            key={option.value || 'all'}
                                            value={option.value || 'all'}
                                        >
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-medium text-muted-foreground">
                                {t('common.customer')}
                            </label>
                            <Select
                                value={selectedCustomer || 'all'}
                                onValueChange={(value) => {
                                    const next = value === 'all' ? '' : value;
                                    setSelectedCustomer(next);
                                    applyFilters({
                                        customer_uuid: next || undefined,
                                    });
                                }}
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
                                            {customer.code} -{' '}
                                            {customer.name ||
                                                t('orders.index.no_name')}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-medium text-muted-foreground">
                                {t('common.article')}
                            </label>
                            <Select
                                value={selectedArticle || 'all'}
                                onValueChange={(value) => {
                                    const next = value === 'all' ? '' : value;
                                    setSelectedArticle(next);
                                    applyFilters({
                                        article_uuid: next || undefined,
                                    });
                                }}
                            >
                                <SelectTrigger
                                    className="w-full"
                                    aria-label={t('common.article')}
                                >
                                    <SelectValue
                                        placeholder={t('filter.all_articles')}
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        {t('filter.all_articles')}
                                    </SelectItem>
                                    {articles.map((article) => (
                                        <SelectItem
                                            key={article.uuid}
                                            value={article.uuid}
                                        >
                                            {article.cod_article_las} -{' '}
                                            {article.article_descr ||
                                                t('common.no_description')}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-medium text-muted-foreground">
                                {t('common.autocontrollo')}
                            </label>
                            <Select
                                value={selectedAutocontrollo || 'all'}
                                onValueChange={(value) => {
                                    const next = value === 'all' ? '' : value;
                                    setSelectedAutocontrollo(next);
                                    applyFilters({
                                        autocontrollo: next || undefined,
                                    });
                                }}
                            >
                                <SelectTrigger
                                    className="w-full"
                                    aria-label={t('common.autocontrollo')}
                                >
                                    <SelectValue
                                        placeholder={t('filter.all')}
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        {t('filter.all')}
                                    </SelectItem>
                                    <SelectItem value="false">
                                        {t('orders.index.pending')}
                                    </SelectItem>
                                    <SelectItem value="true">
                                        {t('orders.index.completed')}
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-medium text-muted-foreground">
                                {t('common.items_per_page')}
                            </label>
                            <Select
                                value={String(filters.per_page || '15')}
                                onValueChange={(value) =>
                                    applyFilters({ per_page: value })
                                }
                            >
                                <SelectTrigger
                                    className="w-full"
                                    aria-label={t('common.items_per_page')}
                                >
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="10">10</SelectItem>
                                    <SelectItem value="15">15</SelectItem>
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
                                {t('orders.index.delivery_date_filter')}
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
                                {t('orders.index.date_presets')}
                            </label>
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={() => applyDatePreset('today')}
                                    className="rounded-md border border-input bg-background px-2 py-1 text-xs transition-colors hover:bg-muted"
                                >
                                    {t('orders.index.date_today')}
                                </button>
                                <button
                                    onClick={() => applyDatePreset('this_week')}
                                    className="rounded-md border border-input bg-background px-2 py-1 text-xs transition-colors hover:bg-muted"
                                >
                                    {t('orders.index.date_this_week')}
                                </button>
                                <button
                                    onClick={() =>
                                        applyDatePreset('this_month')
                                    }
                                    className="rounded-md border border-input bg-background px-2 py-1 text-xs transition-colors hover:bg-muted"
                                >
                                    {t('orders.index.date_this_month')}
                                </button>
                                <button
                                    onClick={() =>
                                        applyDatePreset('next_7_days')
                                    }
                                    className="rounded-md border border-input bg-background px-2 py-1 text-xs transition-colors hover:bg-muted"
                                >
                                    {t('orders.index.date_next_7_days')}
                                </button>
                                <button
                                    onClick={() =>
                                        applyDatePreset('next_30_days')
                                    }
                                    className="rounded-md border border-input bg-background px-2 py-1 text-xs transition-colors hover:bg-muted"
                                >
                                    {t('orders.index.date_next_30_days')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contatore risultati e azioni in batch */}
                <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-3">
                        <div>
                            {t('orders.index.from_to_orders', {
                                from: ordersPaginated.from || 0,
                                to: ordersPaginated.to || 0,
                                total: ordersPaginated.total || 0,
                            })}
                        </div>
                        {selectedOrders.size > 0 && (
                            <div className="flex items-center gap-2">
                                <span className="font-medium text-primary">
                                    {selectedOrders.size}{' '}
                                    {t('orders.index.selezionati')}
                                </span>
                                <button
                                    onClick={handleBatchDelete}
                                    className="inline-flex items-center gap-1 rounded-md border border-destructive bg-destructive/10 px-2 py-1 text-xs font-medium text-destructive transition-colors hover:bg-destructive/20"
                                >
                                    <Trash2 className="h-3 w-3" />
                                    {t('orders.index.delete_selected')}
                                </button>
                                <button
                                    onClick={() => setSelectedOrders(new Set())}
                                    className="text-xs text-muted-foreground hover:text-foreground"
                                >
                                    {t('common.cancel')}
                                </button>
                            </div>
                        )}
                    </div>
                    {ordersPaginated.total > 0 && (
                        <div className="text-xs">
                            {t('orders.index.total_quantity')}:{' '}
                            {formatDecimal(
                                ordersPaginated.data.reduce((sum, order) => {
                                    return (
                                        sum + parseDecimal(order.quantity, 0)
                                    );
                                }, 0),
                                2,
                            )}
                        </div>
                    )}
                </div>

                {/* Configurazione colonne */}
                {showColumnSettings && (
                    <div className="rounded-xl border border-sidebar-border/70 bg-card p-4 dark:border-sidebar-border">
                        <div className="mb-3 flex items-center justify-between">
                            <h3 className="text-sm font-medium">
                                {t('orders.index.visible_columns')}
                            </h3>
                            <button
                                onClick={() => setShowColumnSettings(false)}
                                className="text-muted-foreground hover:text-foreground"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                        <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-5">
                            {[
                                {
                                    key: 'id',
                                    label: t('orders.index.column_id'),
                                },
                                {
                                    key: 'order_production_number',
                                    label: t('orders.column_order_number'),
                                },
                                {
                                    key: 'number_customer_reference_order',
                                    label: t('orders.column_customer_ref'),
                                },
                                { key: 'line', label: t('orders.column_line') },
                                { key: 'article', label: t('common.article') },
                                {
                                    key: 'quantity',
                                    label: t('orders.column_quantity'),
                                },
                                {
                                    key: 'progress',
                                    label: t('orders.column_progress'),
                                },
                                {
                                    key: 'semaforo',
                                    label: t('orders.column_semaforo'),
                                },
                                {
                                    key: 'delivery_date',
                                    label: t('orders.column_delivery_date'),
                                },
                                { key: 'status', label: t('common.status') },
                            ].map((col) => (
                                <label
                                    key={col.key}
                                    className="flex cursor-pointer items-center gap-2 rounded p-2 text-xs transition-colors hover:bg-muted/50"
                                >
                                    <input
                                        type="checkbox"
                                        checked={
                                            visibleColumns[col.key] !== false
                                        }
                                        onChange={(e) => {
                                            const newVisible = {
                                                ...visibleColumns,
                                            };
                                            if (e.target.checked) {
                                                newVisible[col.key] = true;
                                            } else {
                                                // Non consentire di nascondere tutte le colonne
                                                const visibleCount =
                                                    Object.values(
                                                        newVisible,
                                                    ).filter(
                                                        (v) => v !== false,
                                                    ).length;
                                                if (visibleCount > 1) {
                                                    newVisible[col.key] = false;
                                                }
                                            }
                                            setVisibleColumns(newVisible);
                                        }}
                                        className="rounded border-input"
                                    />
                                    {col.label}
                                </label>
                            ))}
                        </div>
                    </div>
                )}

                {/* Vista Tabella o Schede */}
                {viewMode === 'table' ? (
                    <div className="relative min-h-[300px] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 bg-card dark:border-sidebar-border">
                        <div className="relative h-full w-full overflow-auto">
                            <div className="overflow-x-auto">
                                <table className="min-w-full border-separate border-spacing-0 text-left text-sm">
                                    <thead className="sticky top-0 z-10 bg-muted/80 backdrop-blur">
                                        <tr className="text-xs tracking-wide text-muted-foreground uppercase">
                                            <th className="w-12 border-b px-3 py-2 font-medium">
                                                <button
                                                    onClick={() => {
                                                        if (
                                                            selectedOrders.size >
                                                            0
                                                        ) {
                                                            setSelectedOrders(
                                                                new Set(),
                                                            );
                                                        } else {
                                                            setSelectedOrders(
                                                                new Set(
                                                                    ordersPaginated.data.map(
                                                                        (o) =>
                                                                            o.uuid,
                                                                    ),
                                                                ),
                                                            );
                                                        }
                                                    }}
                                                    className="rounded p-1 transition-colors hover:bg-muted/50"
                                                    title={
                                                        selectedOrders.size > 0
                                                            ? t(
                                                                  'orders.index.deselect_all',
                                                              )
                                                            : t(
                                                                  'orders.index.select_all',
                                                              )
                                                    }
                                                >
                                                    {selectedOrders.size ===
                                                        ordersPaginated.data
                                                            .length &&
                                                    ordersPaginated.data
                                                        .length > 0 ? (
                                                        <CheckSquare className="h-4 w-4" />
                                                    ) : (
                                                        <Square className="h-4 w-4" />
                                                    )}
                                                </button>
                                            </th>
                                            {visibleColumns['id'] !== false && (
                                                <SortableTableHeader
                                                    column="id"
                                                    currentSort={
                                                        filters.sort_by
                                                    }
                                                    currentDirection={getSortDirection(
                                                        filters.sort_order,
                                                    )}
                                                    onSort={handleSort}
                                                >
                                                    {t('common.id')}
                                                </SortableTableHeader>
                                            )}
                                            {visibleColumns[
                                                'order_production_number'
                                            ] !== false && (
                                                <SortableTableHeader
                                                    column="order_production_number"
                                                    currentSort={
                                                        filters.sort_by
                                                    }
                                                    currentDirection={getSortDirection(
                                                        filters.sort_order,
                                                    )}
                                                    onSort={handleSort}
                                                >
                                                    {t(
                                                        'orders.index.column_production_number',
                                                    )}
                                                </SortableTableHeader>
                                            )}
                                            {visibleColumns[
                                                'number_customer_reference_order'
                                            ] !== false && (
                                                <th className="hidden border-b px-3 py-2 font-medium md:table-cell">
                                                    {t(
                                                        'orders.column_customer_ref',
                                                    )}
                                                </th>
                                            )}
                                            {visibleColumns['line'] !==
                                                false && (
                                                <th className="hidden border-b px-3 py-2 font-medium lg:table-cell">
                                                    {t(
                                                        'orders.index.column_line',
                                                    )}
                                                </th>
                                            )}
                                            {visibleColumns['article'] !==
                                                false && (
                                                <th className="border-b px-3 py-2 font-medium">
                                                    {t(
                                                        'orders.index.csv_article_code',
                                                    )}
                                                </th>
                                            )}
                                            {visibleColumns['quantity'] !==
                                                false && (
                                                <SortableTableHeader
                                                    column="quantity"
                                                    currentSort={
                                                        filters.sort_by
                                                    }
                                                    currentDirection={getSortDirection(
                                                        filters.sort_order,
                                                    )}
                                                    onSort={handleSort}
                                                >
                                                    {t(
                                                        'orders.column_quantity',
                                                    )}
                                                </SortableTableHeader>
                                            )}
                                            {visibleColumns['progress'] !==
                                                false && (
                                                <th
                                                    className="border-b px-3 py-2 font-medium"
                                                    title={t(
                                                        'common.production_progress_tooltip',
                                                    )}
                                                >
                                                    {t(
                                                        'orders.column_progress',
                                                    )}
                                                </th>
                                            )}
                                            {visibleColumns['semaforo'] !==
                                                false && (
                                                <th className="border-b px-3 py-2 font-medium">
                                                    {t(
                                                        'orders.index.column_semaforo',
                                                    )}
                                                </th>
                                            )}
                                            {visibleColumns['delivery_date'] !==
                                                false && (
                                                <SortableTableHeader
                                                    column="delivery_requested_date"
                                                    currentSort={
                                                        filters.sort_by
                                                    }
                                                    currentDirection={getSortDirection(
                                                        filters.sort_order,
                                                    )}
                                                    onSort={handleSort}
                                                >
                                                    {t(
                                                        'orders.column_delivery_date',
                                                    )}
                                                </SortableTableHeader>
                                            )}
                                            {visibleColumns['status'] !==
                                                false && (
                                                <SortableTableHeader
                                                    column="status"
                                                    currentSort={
                                                        filters.sort_by
                                                    }
                                                    currentDirection={getSortDirection(
                                                        filters.sort_order,
                                                    )}
                                                    onSort={handleSort}
                                                >
                                                    {t('common.status')}
                                                </SortableTableHeader>
                                            )}
                                            <th className="border-b px-3 py-2 text-right font-medium">
                                                {t('common.actions')}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {isLoading &&
                                        ordersPaginated.data.length === 0 ? (
                                            // Skeleton loaders
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
                                                            <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                                                        </td>
                                                        <td className="hidden px-3 py-3 md:table-cell">
                                                            <div className="h-4 w-20 animate-pulse rounded bg-muted" />
                                                        </td>
                                                        <td className="hidden px-3 py-3 lg:table-cell">
                                                            <div className="h-4 w-12 animate-pulse rounded bg-muted" />
                                                        </td>
                                                        <td className="px-3 py-3">
                                                            <div className="h-4 w-32 animate-pulse rounded bg-muted" />
                                                        </td>
                                                        <td className="px-3 py-3">
                                                            <div className="h-4 w-16 animate-pulse rounded bg-muted" />
                                                        </td>
                                                        <td className="px-3 py-3">
                                                            <div className="h-4 w-20 animate-pulse rounded bg-muted" />
                                                        </td>
                                                        <td className="px-3 py-3">
                                                            <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                                                        </td>
                                                        <td className="px-3 py-3">
                                                            <div className="h-6 w-20 animate-pulse rounded-full bg-muted" />
                                                        </td>
                                                        <td className="px-3 py-3 text-right">
                                                            <div className="ml-auto h-8 w-24 animate-pulse rounded bg-muted" />
                                                        </td>
                                                    </tr>
                                                ),
                                            )
                                        ) : ordersPaginated.data.length ===
                                          0 ? (
                                            <tr>
                                                <td
                                                    colSpan={
                                                        Object.values(
                                                            visibleColumns,
                                                        ).filter(
                                                            (v) => v !== false,
                                                        ).length + 1
                                                    }
                                                    className="px-3 py-8 text-center text-sm text-muted-foreground"
                                                >
                                                    {t(
                                                        'orders.index.no_orders',
                                                    )}
                                                </td>
                                            </tr>
                                        ) : (
                                            ordersPaginated.data.map(
                                                (order) => {
                                                    const progress =
                                                        getProgress(order);
                                                    const urgency =
                                                        getUrgencyStatus(order);
                                                    const isSelected =
                                                        selectedOrders.has(
                                                            order.uuid,
                                                        );
                                                    return (
                                                        <tr
                                                            key={order.uuid}
                                                            className={`border-b border-sidebar-border/70 hover:bg-muted/50 dark:border-sidebar-border ${isSelected ? 'bg-primary/5' : ''}`}
                                                        >
                                                            <td className="px-3 py-2 align-middle">
                                                                <button
                                                                    onClick={() =>
                                                                        toggleOrderSelection(
                                                                            order.uuid,
                                                                        )
                                                                    }
                                                                    className="rounded p-1 transition-colors hover:bg-muted/50"
                                                                >
                                                                    {isSelected ? (
                                                                        <CheckSquare className="h-4 w-4 text-primary" />
                                                                    ) : (
                                                                        <Square className="h-4 w-4 text-muted-foreground" />
                                                                    )}
                                                                </button>
                                                            </td>
                                                            {visibleColumns[
                                                                'id'
                                                            ] !== false && (
                                                                <td className="px-3 py-2 align-middle text-xs">
                                                                    {order.id}
                                                                </td>
                                                            )}
                                                            {visibleColumns[
                                                                'order_production_number'
                                                            ] !== false && (
                                                                <td className="px-3 py-2 font-medium">
                                                                    {
                                                                        order.order_production_number
                                                                    }
                                                                </td>
                                                            )}
                                                            {visibleColumns[
                                                                'number_customer_reference_order'
                                                            ] !== false && (
                                                                <td className="hidden px-3 py-2 text-xs md:table-cell">
                                                                    {order.number_customer_reference_order || (
                                                                        <span className="text-muted-foreground">
                                                                            -
                                                                        </span>
                                                                    )}
                                                                </td>
                                                            )}
                                                            {visibleColumns[
                                                                'line'
                                                            ] !== false && (
                                                                <td className="hidden px-3 py-2 text-xs lg:table-cell">
                                                                    {order.line !==
                                                                        null &&
                                                                    order.line !==
                                                                        undefined ? (
                                                                        order.line
                                                                    ) : (
                                                                        <span className="text-muted-foreground">
                                                                            -
                                                                        </span>
                                                                    )}
                                                                </td>
                                                            )}
                                                            {visibleColumns[
                                                                'article'
                                                            ] !== false && (
                                                                <td className="px-3 py-2">
                                                                    {order.article ? (
                                                                        <div className="group relative">
                                                                            <span className="font-medium">
                                                                                {
                                                                                    order
                                                                                        .article
                                                                                        .cod_article_las
                                                                                }
                                                                            </span>
                                                                            {order
                                                                                .article
                                                                                .article_descr && (
                                                                                <>
                                                                                    <Info className="ml-1 inline h-3 w-3 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                                                                                    <div className="absolute top-full left-0 z-20 mt-1 hidden group-hover:block">
                                                                                        <div className="max-w-xs rounded-md border bg-popover p-2 text-xs whitespace-normal text-popover-foreground shadow-md">
                                                                                            {
                                                                                                order
                                                                                                    .article
                                                                                                    .article_descr
                                                                                            }
                                                                                        </div>
                                                                                    </div>
                                                                                </>
                                                                            )}
                                                                        </div>
                                                                    ) : (
                                                                        <span className="text-muted-foreground">
                                                                            -
                                                                        </span>
                                                                    )}
                                                                </td>
                                                            )}
                                                            {visibleColumns[
                                                                'quantity'
                                                            ] !== false && (
                                                                <td className="px-3 py-2 text-xs">
                                                                    {formatDecimal(
                                                                        order.quantity,
                                                                    )}
                                                                </td>
                                                            )}
                                                            {visibleColumns[
                                                                'progress'
                                                            ] !== false && (
                                                                <td className="px-3 py-2">
                                                                    {(() => {
                                                                        const qty =
                                                                            parseDecimal(
                                                                                order.quantity,
                                                                            );
                                                                        const workedQty =
                                                                            parseDecimal(
                                                                                order.worked_quantity,
                                                                            );
                                                                        if (
                                                                            !qty ||
                                                                            qty ===
                                                                                0
                                                                        ) {
                                                                            return (
                                                                                <span className="text-xs text-muted-foreground">
                                                                                    -
                                                                                </span>
                                                                            );
                                                                        }
                                                                        return (
                                                                            <div
                                                                                className="flex items-center gap-2"
                                                                                title={t(
                                                                                    'orders.index.progress_tooltip',
                                                                                    {
                                                                                        progress,
                                                                                        worked: formatDecimal(
                                                                                            workedQty,
                                                                                        ),
                                                                                        total: formatDecimal(
                                                                                            qty,
                                                                                        ),
                                                                                    },
                                                                                )}
                                                                            >
                                                                                <div className="min-w-[60px] flex-1">
                                                                                    <div className="h-2 w-full rounded-full bg-muted">
                                                                                        <div
                                                                                            className={`h-2 rounded-full transition-all ${getProgressColor(progress)}`}
                                                                                            style={{
                                                                                                width: `${progress}%`,
                                                                                            }}
                                                                                        />
                                                                                    </div>
                                                                                </div>
                                                                                <span className="min-w-[35px] text-right text-xs font-medium">
                                                                                    {
                                                                                        progress
                                                                                    }

                                                                                    %
                                                                                </span>
                                                                            </div>
                                                                        );
                                                                    })()}
                                                                </td>
                                                            )}
                                                            {visibleColumns[
                                                                'semaforo'
                                                            ] !== false && (
                                                                <td className="px-3 py-2 text-xs">
                                                                    {order.status ===
                                                                    1 ? (
                                                                        <div className="flex items-center gap-2">
                                                                            {(() => {
                                                                                const semaforo =
                                                                                    order.status_semaforo ?? {
                                                                                        etichette: 0,
                                                                                        packaging: 0,
                                                                                        prodotto: 0,
                                                                                    };

                                                                                return (
                                                                                    <>
                                                                                        <span className="inline-flex items-center gap-1">
                                                                                            <span className="text-[10px] font-semibold">
                                                                                                {t(
                                                                                                    'orders.index.semaforo_short_e',
                                                                                                )}
                                                                                            </span>
                                                                                            <span
                                                                                                className={`h-3 w-3 rounded-full ${
                                                                                                    semaforo.etichette ===
                                                                                                    0
                                                                                                        ? 'bg-red-500'
                                                                                                        : semaforo.etichette ===
                                                                                                            1
                                                                                                          ? 'bg-yellow-400'
                                                                                                          : 'bg-green-500'
                                                                                                }`}
                                                                                                title={t(
                                                                                                    'common.labels',
                                                                                                )}
                                                                                            />
                                                                                        </span>
                                                                                        <span className="inline-flex items-center gap-1">
                                                                                            <span className="text-[10px] font-semibold">
                                                                                                P:
                                                                                            </span>
                                                                                            <span
                                                                                                className={`h-3 w-3 rounded-full ${
                                                                                                    semaforo.packaging ===
                                                                                                    0
                                                                                                        ? 'bg-red-500'
                                                                                                        : semaforo.packaging ===
                                                                                                            1
                                                                                                          ? 'bg-yellow-400'
                                                                                                          : 'bg-green-500'
                                                                                                }`}
                                                                                                title={t(
                                                                                                    'common.packaging',
                                                                                                )}
                                                                                            />
                                                                                        </span>
                                                                                        <span className="inline-flex items-center gap-1">
                                                                                            <span className="text-[10px] font-semibold">
                                                                                                P:
                                                                                            </span>
                                                                                            <span
                                                                                                className={`h-3 w-3 rounded-full ${
                                                                                                    semaforo.prodotto ===
                                                                                                    0
                                                                                                        ? 'bg-red-500'
                                                                                                        : semaforo.prodotto ===
                                                                                                            1
                                                                                                          ? 'bg-yellow-400'
                                                                                                          : 'bg-green-500'
                                                                                                }`}
                                                                                                title={t(
                                                                                                    'common.product',
                                                                                                )}
                                                                                            />
                                                                                        </span>
                                                                                    </>
                                                                                );
                                                                            })()}
                                                                        </div>
                                                                    ) : (
                                                                        <span className="text-muted-foreground">
                                                                            -
                                                                        </span>
                                                                    )}
                                                                </td>
                                                            )}
                                                            {visibleColumns[
                                                                'delivery_date'
                                                            ] !== false && (
                                                                <td className="px-3 py-2 text-xs">
                                                                    <div className="flex items-center gap-2">
                                                                        {order.delivery_requested_date ? (
                                                                            <>
                                                                                <span
                                                                                    title={
                                                                                        urgency.type ===
                                                                                        'overdue'
                                                                                            ? t(
                                                                                                  'orders.index.order_overdue',
                                                                                              )
                                                                                            : urgency.type ===
                                                                                                'urgent'
                                                                                              ? t(
                                                                                                    'orders.index.order_urgent',
                                                                                                )
                                                                                              : t(
                                                                                                    'orders.index.order_on_time',
                                                                                                )
                                                                                    }
                                                                                >
                                                                                    {
                                                                                        urgency.icon
                                                                                    }
                                                                                </span>
                                                                                <span>
                                                                                    {new Date(
                                                                                        order.delivery_requested_date,
                                                                                    ).toLocaleDateString(
                                                                                        getDateLocale(
                                                                                            props.locale ??
                                                                                                'it',
                                                                                        ),
                                                                                    )}
                                                                                </span>
                                                                            </>
                                                                        ) : (
                                                                            <span className="text-muted-foreground">
                                                                                -
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </td>
                                                            )}
                                                            {visibleColumns[
                                                                'status'
                                                            ] !== false && (
                                                                <td className="px-3 py-2">
                                                                    <span
                                                                        className={`inline-flex items-center rounded-full border px-2 py-1 text-xs font-medium ${getOrderStatusColor(order.status)}`}
                                                                        title={`${t('common.status')}: ${t(getOrderStatusLabelKey(order.status), { status: String(order.status) })}`}
                                                                    >
                                                                        {t(
                                                                            getOrderStatusLabelKey(
                                                                                order.status,
                                                                            ),
                                                                            {
                                                                                status: String(
                                                                                    order.status,
                                                                                ),
                                                                            },
                                                                        )}
                                                                    </span>
                                                                </td>
                                                            )}
                                                            {visibleColumns[
                                                                'actions'
                                                            ] !== false && (
                                                                <td className="px-3 py-2 text-right">
                                                                    <ActionsDropdown
                                                                        viewHref={
                                                                            orders.show(
                                                                                {
                                                                                    order: order.uuid,
                                                                                },
                                                                            )
                                                                                .url
                                                                        }
                                                                        editHref={
                                                                            orders.edit(
                                                                                {
                                                                                    order: order.uuid,
                                                                                },
                                                                            )
                                                                                .url
                                                                        }
                                                                        onDelete={() =>
                                                                            handleDeleteClick(
                                                                                order,
                                                                            )
                                                                        }
                                                                        extraItems={
                                                                            <>
                                                                                {order.article && (
                                                                                    <Link
                                                                                        href={
                                                                                            articlesRoutes.show(
                                                                                                {
                                                                                                    article:
                                                                                                        order
                                                                                                            .article
                                                                                                            .uuid,
                                                                                                },
                                                                                            )
                                                                                                .url
                                                                                        }
                                                                                        className="flex items-center px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                                                                                    >
                                                                                        <Package className="mr-2 h-4 w-4 text-foreground" />
                                                                                        {t(
                                                                                            'orders.index.view_article',
                                                                                        )}
                                                                                    </Link>
                                                                                )}
                                                                                {order
                                                                                    .article
                                                                                    ?.offer_uuid && (
                                                                                    <Link
                                                                                        href={
                                                                                            offers.show(
                                                                                                {
                                                                                                    offer: order
                                                                                                        .article!
                                                                                                        .offer_uuid!,
                                                                                                },
                                                                                            )
                                                                                                .url
                                                                                        }
                                                                                        className="flex items-center px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                                                                                    >
                                                                                        <FileText className="mr-2 h-4 w-4 text-foreground" />
                                                                                        {t(
                                                                                            'orders.view_offer',
                                                                                        )}
                                                                                    </Link>
                                                                                )}
                                                                                <div
                                                                                    onClick={(
                                                                                        e,
                                                                                    ) => {
                                                                                        e.preventDefault();
                                                                                        router.visit(
                                                                                            orders.manageStatus(
                                                                                                {
                                                                                                    order: order.uuid,
                                                                                                },
                                                                                            )
                                                                                                .url,
                                                                                        );
                                                                                    }}
                                                                                    className="flex cursor-pointer items-center px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                                                                                >
                                                                                    <Settings className="mr-2 h-4 w-4 text-foreground" />
                                                                                    {t(
                                                                                        'orders.manage_status',
                                                                                    )}
                                                                                </div>
                                                                                <div
                                                                                    onClick={(
                                                                                        e,
                                                                                    ) => {
                                                                                        e.preventDefault();
                                                                                        handleDownloadBarcode(
                                                                                            order,
                                                                                        );
                                                                                    }}
                                                                                    className="flex cursor-pointer items-center px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground disabled:cursor-not-allowed disabled:opacity-50"
                                                                                >
                                                                                    {downloadingBarcode ===
                                                                                    order.uuid ? (
                                                                                        <>
                                                                                            <Loader2 className="mr-2 h-4 w-4 animate-spin text-foreground" />
                                                                                            {t(
                                                                                                'orders.barcode_generating',
                                                                                            )}
                                                                                        </>
                                                                                    ) : (
                                                                                        <>
                                                                                            <Download className="mr-2 h-4 w-4 text-foreground" />
                                                                                            {t(
                                                                                                'orders.barcode_print',
                                                                                            )}
                                                                                        </>
                                                                                    )}
                                                                                </div>
                                                                                <div
                                                                                    onClick={(
                                                                                        e,
                                                                                    ) => {
                                                                                        e.preventDefault();
                                                                                        handleDownloadAutocontrollo(
                                                                                            order,
                                                                                        );
                                                                                    }}
                                                                                    className="flex cursor-pointer items-center px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground disabled:cursor-not-allowed disabled:opacity-50"
                                                                                >
                                                                                    {downloadingAutocontrollo ===
                                                                                    order.uuid ? (
                                                                                        <>
                                                                                            <Loader2 className="mr-2 h-4 w-4 animate-spin text-foreground" />
                                                                                            {t(
                                                                                                'orders.autocontrollo_generating',
                                                                                            )}
                                                                                        </>
                                                                                    ) : (
                                                                                        <>
                                                                                            <Download className="mr-2 h-4 w-4 text-foreground" />
                                                                                            {t(
                                                                                                'orders.autocontrollo_print',
                                                                                            )}
                                                                                        </>
                                                                                    )}
                                                                                </div>
                                                                                <div
                                                                                    onClick={(
                                                                                        e,
                                                                                    ) => {
                                                                                        e.preventDefault();
                                                                                        handleForceReschedule(
                                                                                            order,
                                                                                        );
                                                                                    }}
                                                                                    className="flex cursor-pointer items-center px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground disabled:cursor-not-allowed disabled:opacity-50"
                                                                                >
                                                                                    {reschedulingOrder ===
                                                                                    order.uuid ? (
                                                                                        <>
                                                                                            <Loader2 className="mr-2 h-4 w-4 animate-spin text-foreground" />
                                                                                            {t(
                                                                                                'orders.index.rescheduling',
                                                                                            )}
                                                                                        </>
                                                                                    ) : (
                                                                                        <>
                                                                                            <CalendarCheck className="mr-2 h-4 w-4 text-foreground" />
                                                                                            {t(
                                                                                                'orders.index.force_reschedule',
                                                                                            )}
                                                                                        </>
                                                                                    )}
                                                                                </div>
                                                                            </>
                                                                        }
                                                                    />
                                                                </td>
                                                            )}
                                                        </tr>
                                                    );
                                                },
                                            )
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                ) : (
                    // Vista a schede
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {isLoading && ordersPaginated.data.length === 0 ? (
                            // Skeleton loaders per le card
                            Array.from({ length: 6 }).map((_, index) => (
                                <div
                                    key={`skeleton-card-${index}`}
                                    className="animate-pulse rounded-xl border border-sidebar-border/70 bg-card p-4"
                                >
                                    <div className="mb-2 h-4 w-3/4 rounded bg-muted" />
                                    <div className="mb-4 h-3 w-1/2 rounded bg-muted" />
                                    <div className="mb-1 h-2 w-full rounded bg-muted" />
                                    <div className="h-2 w-2/3 rounded bg-muted" />
                                </div>
                            ))
                        ) : ordersPaginated.data.length === 0 ? (
                            <div className="col-span-full py-12 text-center text-muted-foreground">
                                {t('orders.index.no_orders')}
                            </div>
                        ) : (
                            ordersPaginated.data.map((order) => {
                                const progress = getProgress(order);
                                const urgency = getUrgencyStatus(order);
                                const isSelected = selectedOrders.has(
                                    order.uuid,
                                );
                                return (
                                    <div
                                        key={order.uuid}
                                        className={`rounded-xl border border-sidebar-border/70 bg-card p-4 transition-all hover:shadow-md ${isSelected ? 'ring-2 ring-primary' : ''}`}
                                    >
                                        <div className="mb-3 flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="mb-1 flex items-center gap-2">
                                                    <button
                                                        onClick={() =>
                                                            toggleOrderSelection(
                                                                order.uuid,
                                                            )
                                                        }
                                                        className="rounded p-1 transition-colors hover:bg-muted/50"
                                                    >
                                                        {isSelected ? (
                                                            <CheckSquare className="h-4 w-4 text-primary" />
                                                        ) : (
                                                            <Square className="h-4 w-4 text-muted-foreground" />
                                                        )}
                                                    </button>
                                                    <Link
                                                        href={
                                                            orders.show({
                                                                order: order.uuid,
                                                            }).url
                                                        }
                                                        className="text-lg font-semibold transition-colors hover:text-primary"
                                                    >
                                                        {
                                                            order.order_production_number
                                                        }
                                                    </Link>
                                                </div>
                                                {visibleColumns['article'] !==
                                                    false &&
                                                    order.article && (
                                                        <div className="text-sm text-muted-foreground">
                                                            {
                                                                order.article
                                                                    .cod_article_las
                                                            }
                                                            {order.article
                                                                .article_descr && (
                                                                <span
                                                                    className="ml-2 text-xs"
                                                                    title={
                                                                        order
                                                                            .article
                                                                            .article_descr
                                                                    }
                                                                >
                                                                    {order
                                                                        .article
                                                                        .article_descr
                                                                        .length >
                                                                    30
                                                                        ? order.article.article_descr.substring(
                                                                              0,
                                                                              30,
                                                                          ) +
                                                                          t(
                                                                              'common.ellipsis',
                                                                          )
                                                                        : order
                                                                              .article
                                                                              .article_descr}
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}
                                                {(visibleColumns[
                                                    'number_customer_reference_order'
                                                ] !== false &&
                                                    order.number_customer_reference_order) ||
                                                (visibleColumns['line'] !==
                                                    false &&
                                                    order.line != null) ? (
                                                    <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0 text-xs text-muted-foreground">
                                                        {visibleColumns[
                                                            'number_customer_reference_order'
                                                        ] !== false &&
                                                            order.number_customer_reference_order && (
                                                                <span>
                                                                    {t(
                                                                        'common.customer',
                                                                    )}
                                                                    :{' '}
                                                                    {
                                                                        order.number_customer_reference_order
                                                                    }
                                                                </span>
                                                            )}
                                                        {visibleColumns[
                                                            'line'
                                                        ] !== false &&
                                                            order.line !=
                                                                null && (
                                                                <span>
                                                                    {t(
                                                                        'orders.labels.line',
                                                                    )}
                                                                    :{' '}
                                                                    {order.line}
                                                                </span>
                                                            )}
                                                    </div>
                                                ) : null}
                                            </div>
                                            {visibleColumns['status'] !==
                                                false && (
                                                <span
                                                    className={`inline-flex items-center rounded-full border px-2 py-1 text-xs font-medium ${getOrderStatusColor(order.status)}`}
                                                >
                                                    {t(
                                                        getOrderStatusLabelKey(
                                                            order.status,
                                                        ),
                                                        {
                                                            status: String(
                                                                order.status,
                                                            ),
                                                        },
                                                    )}
                                                </span>
                                            )}
                                        </div>

                                        {visibleColumns['progress'] !== false &&
                                            parseDecimal(order.quantity) >
                                                0 && (
                                                <div className="mb-3">
                                                    <div className="mb-1 flex items-center justify-between text-xs">
                                                        <span className="text-muted-foreground">
                                                            {t(
                                                                'orders.column_progress',
                                                            )}
                                                        </span>
                                                        <span className="font-medium">
                                                            {progress}%
                                                        </span>
                                                    </div>
                                                    <div className="h-2 w-full rounded-full bg-muted">
                                                        <div
                                                            className={`h-2 rounded-full transition-all ${getProgressColor(progress)}`}
                                                            style={{
                                                                width: `${progress}%`,
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            )}

                                        {visibleColumns['semaforo'] !== false &&
                                            order.status === 1 && (
                                                <div className="mb-3 flex items-center gap-2 text-xs">
                                                    <span className="text-muted-foreground">
                                                        {t(
                                                            'orders.column_semaforo',
                                                        )}
                                                        :
                                                    </span>
                                                    {(() => {
                                                        const semaforo =
                                                            order.status_semaforo ?? {
                                                                etichette: 0,
                                                                packaging: 0,
                                                                prodotto: 0,
                                                            };
                                                        return (
                                                            <span className="flex items-center gap-1">
                                                                <span
                                                                    className={`h-2.5 w-2.5 rounded-full ${
                                                                        semaforo.etichette ===
                                                                        0
                                                                            ? 'bg-red-500'
                                                                            : semaforo.etichette ===
                                                                                1
                                                                              ? 'bg-yellow-400'
                                                                              : 'bg-green-500'
                                                                    }`}
                                                                    title={t(
                                                                        'common.labels',
                                                                    )}
                                                                />
                                                                <span
                                                                    className={`h-2.5 w-2.5 rounded-full ${
                                                                        semaforo.packaging ===
                                                                        0
                                                                            ? 'bg-red-500'
                                                                            : semaforo.packaging ===
                                                                                1
                                                                              ? 'bg-yellow-400'
                                                                              : 'bg-green-500'
                                                                    }`}
                                                                    title={t(
                                                                        'common.packaging',
                                                                    )}
                                                                />
                                                                <span
                                                                    className={`h-2.5 w-2.5 rounded-full ${
                                                                        semaforo.prodotto ===
                                                                        0
                                                                            ? 'bg-red-500'
                                                                            : semaforo.prodotto ===
                                                                                1
                                                                              ? 'bg-yellow-400'
                                                                              : 'bg-green-500'
                                                                    }`}
                                                                    title={t(
                                                                        'common.product',
                                                                    )}
                                                                />
                                                            </span>
                                                        );
                                                    })()}
                                                </div>
                                            )}

                                        <div className="mb-3 grid grid-cols-2 gap-2 text-xs">
                                            {visibleColumns['quantity'] !==
                                                false &&
                                                order.quantity !== null && (
                                                    <div>
                                                        <span className="text-muted-foreground">
                                                            {t(
                                                                'orders.show.quantity',
                                                            )}
                                                            :{' '}
                                                        </span>
                                                        <span className="font-medium">
                                                            {(() => {
                                                                const qty =
                                                                    order.quantity;
                                                                if (
                                                                    qty ===
                                                                        null ||
                                                                    qty ===
                                                                        undefined
                                                                )
                                                                    return '-';
                                                                const numQty =
                                                                    typeof qty ===
                                                                    'string'
                                                                        ? parseFloat(
                                                                              qty,
                                                                          )
                                                                        : qty;
                                                                return isNaN(
                                                                    numQty,
                                                                )
                                                                    ? '-'
                                                                    : numQty.toFixed(
                                                                          2,
                                                                      );
                                                            })()}
                                                        </span>
                                                    </div>
                                                )}
                                            {visibleColumns['delivery_date'] !==
                                                false &&
                                                order.delivery_requested_date && (
                                                    <div className="flex items-center gap-1">
                                                        <span
                                                            title={
                                                                urgency.type ===
                                                                'overdue'
                                                                    ? t(
                                                                          'orders.index.order_overdue',
                                                                      )
                                                                    : urgency.type ===
                                                                        'urgent'
                                                                      ? t(
                                                                            'orders.index.order_urgent_short',
                                                                        )
                                                                      : t(
                                                                            'orders.index.on_time',
                                                                        )
                                                            }
                                                        >
                                                            {urgency.icon}
                                                        </span>
                                                        <span className="text-muted-foreground">
                                                            Consegna:{' '}
                                                        </span>
                                                        <span className="font-medium">
                                                            {new Date(
                                                                order.delivery_requested_date,
                                                            ).toLocaleDateString(
                                                                getDateLocale(
                                                                    props.locale ??
                                                                        'it',
                                                                ),
                                                            )}
                                                        </span>
                                                    </div>
                                                )}
                                        </div>

                                        <div className="flex items-center justify-end gap-2 border-t pt-2">
                                            <ActionsDropdown
                                                viewHref={
                                                    orders.show({
                                                        order: order.uuid,
                                                    }).url
                                                }
                                                editHref={
                                                    orders.edit({
                                                        order: order.uuid,
                                                    }).url
                                                }
                                                onDelete={() =>
                                                    handleDeleteClick(order)
                                                }
                                                extraItems={
                                                    <>
                                                        {order.article && (
                                                            <Link
                                                                href={
                                                                    articlesRoutes.show(
                                                                        {
                                                                            article:
                                                                                order
                                                                                    .article
                                                                                    .uuid,
                                                                        },
                                                                    ).url
                                                                }
                                                                className="flex items-center px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                                                            >
                                                                <Package className="mr-2 h-4 w-4 text-foreground" />
                                                                {t(
                                                                    'orders.index.view_article',
                                                                )}
                                                            </Link>
                                                        )}
                                                        {order.article
                                                            ?.offer_uuid && (
                                                            <Link
                                                                href={
                                                                    offers.show(
                                                                        {
                                                                            offer: order
                                                                                .article!
                                                                                .offer_uuid!,
                                                                        },
                                                                    ).url
                                                                }
                                                                className="flex items-center px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                                                            >
                                                                <FileText className="mr-2 h-4 w-4 text-foreground" />
                                                                {t(
                                                                    'orders.view_offer',
                                                                )}
                                                            </Link>
                                                        )}
                                                        <div
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                router.visit(
                                                                    orders.manageStatus(
                                                                        {
                                                                            order: order.uuid,
                                                                        },
                                                                    ).url,
                                                                );
                                                            }}
                                                            className="flex cursor-pointer items-center px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                                                        >
                                                            <Settings className="mr-2 h-4 w-4 text-foreground" />
                                                            {t(
                                                                'orders.manage_status',
                                                            )}
                                                        </div>
                                                        <div
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                handleDownloadBarcode(
                                                                    order,
                                                                );
                                                            }}
                                                            className="flex cursor-pointer items-center px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground disabled:cursor-not-allowed disabled:opacity-50"
                                                        >
                                                            {downloadingBarcode ===
                                                            order.uuid ? (
                                                                <>
                                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin text-foreground" />
                                                                    {t(
                                                                        'orders.barcode_generating',
                                                                    )}
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Download className="mr-2 h-4 w-4 text-foreground" />
                                                                    {t(
                                                                        'orders.barcode_print',
                                                                    )}
                                                                </>
                                                            )}
                                                        </div>
                                                        <div
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                handleDownloadAutocontrollo(
                                                                    order,
                                                                );
                                                            }}
                                                            className="flex cursor-pointer items-center px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground disabled:cursor-not-allowed disabled:opacity-50"
                                                        >
                                                            {downloadingAutocontrollo ===
                                                            order.uuid ? (
                                                                <>
                                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin text-foreground" />
                                                                    {t(
                                                                        'orders.autocontrollo_generating',
                                                                    )}
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Download className="mr-2 h-4 w-4 text-foreground" />
                                                                    {t(
                                                                        'orders.autocontrollo_print',
                                                                    )}
                                                                </>
                                                            )}
                                                        </div>
                                                        <div
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                handleForceReschedule(
                                                                    order,
                                                                );
                                                            }}
                                                            className="flex cursor-pointer items-center px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground disabled:cursor-not-allowed disabled:opacity-50"
                                                        >
                                                            {reschedulingOrder ===
                                                            order.uuid ? (
                                                                <>
                                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin text-foreground" />
                                                                    {t(
                                                                        'orders.index.rescheduling',
                                                                    )}
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <CalendarCheck className="mr-2 h-4 w-4 text-foreground" />
                                                                    {t(
                                                                        'orders.index.force_reschedule',
                                                                    )}
                                                                </>
                                                            )}
                                                        </div>
                                                    </>
                                                }
                                            />
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                )}

                <Pagination
                    links={ordersPaginated.links}
                    currentPage={ordersPaginated.current_page}
                    lastPage={ordersPaginated.last_page}
                    totalItems={ordersPaginated.total}
                />
            </div>

            <ConfirmDeleteDialog
                open={deleteDialog.open}
                onOpenChange={(open) => setDeleteDialog({ open, order: null })}
                onConfirm={handleDeleteConfirm}
                isLoading={isDeleting}
                title={t('common.confirm_delete')}
                description={t('orders.delete_confirm_description', {
                    order_number:
                        deleteDialog.order?.order_production_number ?? '',
                })}
                itemName={deleteDialog.order?.order_production_number}
            />
        </AppLayout>
    );
}
