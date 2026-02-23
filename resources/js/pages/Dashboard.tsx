import { acknowledgeAlert } from '@/actions/App/Http/Controllers/DashboardController';
import { OrderStatusChart } from '@/components/dashboard/OrderStatusChart';
import { OrdersTrendChart } from '@/components/dashboard/OrdersTrendChart';
import { ProductionProgressChart } from '@/components/dashboard/ProductionProgressChart';
import { TopArticlesChart } from '@/components/dashboard/TopArticlesChart';
import { TopCustomersChart } from '@/components/dashboard/TopCustomersChart';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { getOrderStatusColor } from '@/constants/orderStatus';
import { useTranslations } from '@/hooks/use-translations';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import articles from '@/routes/articles/index';
import customers from '@/routes/customers/index';
import offers from '@/routes/offers/index';
import orders from '@/routes/orders/index';
import planning from '@/routes/planning/index';
import productionPortal from '@/routes/production-portal/index';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import {
    AlertTriangle,
    ArrowRight,
    Award,
    BarChart3,
    Calendar,
    CheckCircle,
    ChevronDown,
    Clock,
    Download,
    Eye,
    FileText,
    Filter,
    Package,
    Plus,
    RefreshCw,
    ShoppingCart,
    TrendingDown,
    TrendingUp,
    Users,
    X,
    Zap,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';

type Order = {
    id: number;
    uuid: string;
    order_production_number: string;
    status: number;
    status_label: string;
    quantity: number;
    worked_quantity: number;
    delivery_requested_date?: string | null;
    days_until_delivery?: number;
    is_overdue?: boolean;
    article?: {
        cod_article_las: string;
        article_descr?: string | null;
    } | null;
    customer?: string | null;
    created_at?: string | null;
};

type TopCustomer = {
    id: number;
    uuid: string;
    company_name: string;
    order_count: number;
};

type TopArticle = {
    id: number;
    uuid: string;
    cod_article_las: string;
    article_descr?: string | null;
    total_quantity: number;
};

type Alert = {
    type: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    title: string;
    message: string;
    count: number;
    first_order_uuid?: string; // UUID prima ordine in ritardo (alert tipo 'overdue')
    /** Firma della situazione (es. count|first_uuid); usata per ack persistente in backend. */
    signature?: string;
    /** Hash dello scope (filtri); usato per ack persistente in backend. */
    scope_hash?: string;
};

type PerformanceMetrics = {
    completion_rate: number;
    avg_production_time_days: number;
    orders_per_day: number;
    total_orders: number;
    completed_orders: number;
};

type ComparisonStats = {
    orders: {
        current: number;
        previous: number;
        change: number;
        change_percentage: number;
    };
    production: {
        current: number;
        previous: number;
        change: number;
    };
} | null;

type CustomerForFilter = {
    uuid: string;
    label: string;
    code?: string;
};

type OrderStatusForFilter = {
    value: string;
    label: string;
};

type DashboardProps = {
    statistics: {
        orders: {
            total: number;
            pianificato: number;
            in_allestimento: number;
            lanciato: number;
            in_avanzamento: number;
            sospeso: number;
            completato: number;
        };
        offers: {
            total: number;
            active: number;
        };
        articles: {
            total: number;
        };
        customers: {
            total: number;
        };
        production: {
            total_quantity: number;
            worked_quantity: number;
            progress_percentage: number;
        };
    };
    urgentOrders: Order[];
    recentOrders: Order[];
    topCustomers: TopCustomer[];
    topArticles: TopArticle[];
    performanceMetrics: PerformanceMetrics;
    alerts: Alert[];
    comparisonStats: ComparisonStats;
    ordersTrend: Array<{ period: string; count: number }>;
    previousTrend?: Array<{ period: string; count: number }> | null;
    productionProgressData: Array<{
        orderNumber: string;
        worked: number;
        total: number;
        progress: number;
        isUrgent: boolean;
        daysUntilDelivery?: number;
    }>;
    dateFilter: string;
    customerFilter?: string | null;
    statusFilter?: string[] | null;
    customersForFilter: CustomerForFilter[];
    orderStatusesForFilter: OrderStatusForFilter[];
    advancementsCountToday: number;
};

const ALERT_SEVERITY_COLORS = {
    low: 'border-blue-500/40 bg-blue-500/5 text-blue-700 dark:text-blue-300',
    medium: 'border-yellow-500/40 bg-yellow-500/5 text-yellow-700 dark:text-yellow-300',
    high: 'border-orange-500/40 bg-orange-500/5 text-orange-700 dark:text-orange-300',
    critical: 'border-red-500/40 bg-red-500/5 text-red-700 dark:text-red-300',
};

/** Maps order status code (0–6) to dashboard order_status_* translation key. */
function getOrderStatusLabelKey(status: number): string {
    if (status >= 0 && status <= 6) {
        return `dashboard.order_status_${status}`;
    }
    return 'dashboard.export_nd';
}

/** Ordine di gravità per mostrare gli avvisi (prima i più gravi). */
const ALERT_SEVERITY_ORDER: Record<string, number> = {
    critical: 0,
    high: 1,
    medium: 2,
    low: 3,
};

/** Animazioni avvisi stile iOS: ingresso scalettato (uno dopo l'altro). */
const ALERT_ENTER_DURATION_MS = 320;
const ALERT_EXIT_DURATION_MS = 260;
/** Ritardo tra un avviso e il successo (effetto scalettato tipo iOS). */
const ALERT_STAGGER_DELAY_MS = 120;

/** Intervalo de auto-refresh (ms). */
const DASHBOARD_AUTO_REFRESH_INTERVAL_MS = 60_000;

/**
 * Construye los query params del dashboard a partir de los filtros.
 * Fuente única de verdad para todas las peticiones (filtros, refresh manual y auto).
 */
function buildDashboardParams(
    dateFilter: string,
    customerFilter: string | null,
    statusFilter: string[],
    extra?: Record<string, string>,
): Record<string, string> {
    const params: Record<string, string> = { date_filter: dateFilter };
    if (customerFilter) params.customer_uuid = customerFilter;
    if (statusFilter.length > 0) params.statuses = statusFilter.join(',');
    if (extra) Object.assign(params, extra);
    return params;
}

export default function Dashboard({
    statistics,
    urgentOrders,
    recentOrders,
    topCustomers,
    topArticles,
    performanceMetrics,
    alerts,
    comparisonStats,
    ordersTrend,
    previousTrend,
    productionProgressData,
    dateFilter: initialDateFilter,
    customerFilter: initialCustomerFilter,
    statusFilter: initialStatusFilter,
    customersForFilter,
    orderStatusesForFilter,
    advancementsCountToday = 0,
}: DashboardProps) {
    const { t } = useTranslations();
    const [dateFilter, setDateFilter] = useState(initialDateFilter);
    const [customerFilter, setCustomerFilter] = useState<string | null>(
        initialCustomerFilter || null,
    );
    const [statusFilter, setStatusFilter] = useState<string[]>(
        initialStatusFilter || [],
    );
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);
    const [customStartDate, setCustomStartDate] = useState<string>('');
    const [customEndDate, setCustomEndDate] = useState<string>('');
    const [lastUpdatedAt, setLastUpdatedAt] = useState<Date | null>(null);
    /** Avisos chiusi dall'utente in questa sessione (non persisten dopo ricarica). */
    const [dismissedAlertIds, setDismissedAlertIds] = useState<Set<string>>(
        () => new Set(),
    );
    /** Per animazione di ingresso della sezione avvisi. */
    const [alertsSectionVisible, setAlertsSectionVisible] = useState(false);
    /** Avisi in uscita (animazione di chiusura prima di rimuoverli dal DOM). */
    const [exitingAlertIds, setExitingAlertIds] = useState<Set<string>>(
        () => new Set(),
    );
    /** Avviso espanso (stile iOS: tap per aprire, poi Accetta / Chiudi). */
    const [expandedAlertId, setExpandedAlertId] = useState<string | null>(null);

    // Sincronizar estado local con los props cuando cambian (p. ej. URL con filtros).
    // Diferido para evitar setState síncrono en el effect (react-hooks/set-state-in-effect).
    useEffect(() => {
        const id = setTimeout(() => {
            setDateFilter(initialDateFilter);
            setCustomerFilter(initialCustomerFilter || null);
            setStatusFilter(initialStatusFilter ?? []);
        }, 0);
        return () => clearTimeout(id);
    }, [initialDateFilter, initialCustomerFilter, initialStatusFilter]);

    // Animazione di ingresso avvisi (un solo run al mount).
    useEffect(() => {
        const t = setTimeout(() => setAlertsSectionVisible(true), 80);
        return () => clearTimeout(t);
    }, []);

    /**
     * Petición al backend con los params dados. Usado por filtros, refresh manual y auto-refresh.
     * Opciones: only (partial reload), onStart/onFinish para loading/refreshing.
     */
    const fetchDashboard = useCallback(
        (
            params: Record<string, string>,
            options?: {
                only?: string[];
                onStart?: () => void;
                onFinish?: () => void;
            },
        ) => {
            options?.onStart?.();
            router.get(dashboard().url, params, {
                preserveState: true,
                preserveScroll: true,
                ...(options?.only && { only: options.only }),
                onFinish: () => {
                    setLastUpdatedAt(new Date());
                    options?.onFinish?.();
                },
            });
        },
        [],
    );

    // Auto-refresh: solo cuando está activado y la pestaña está visible; usa siempre los filtros actuales
    useEffect(() => {
        if (!autoRefreshEnabled) return;
        if (typeof document === 'undefined') return;

        let interval: number | null = null;

        const runRefresh = () => {
            if (document.hidden) return;
            fetchDashboard(
                buildDashboardParams(dateFilter, customerFilter, statusFilter),
                {
                    only: [
                        'statistics',
                        'urgentOrders',
                        'recentOrders',
                        'topCustomers',
                        'topArticles',
                        'performanceMetrics',
                        'alerts',
                        'comparisonStats',
                        'advancementsCountToday',
                    ],
                },
            );
        };

        const startInterval = () => {
            if (interval !== null || document.hidden) return;
            interval = window.setInterval(
                runRefresh,
                DASHBOARD_AUTO_REFRESH_INTERVAL_MS,
            );
        };

        const stopInterval = () => {
            if (interval !== null) {
                window.clearInterval(interval);
                interval = null;
            }
        };

        const handleVisibilityChange = () => {
            if (document.hidden) {
                stopInterval();
            } else if (autoRefreshEnabled) {
                startInterval();
            }
        };

        startInterval();
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            stopInterval();
            document.removeEventListener(
                'visibilitychange',
                handleVisibilityChange,
            );
        };
    }, [
        autoRefreshEnabled,
        dateFilter,
        customerFilter,
        statusFilter,
        fetchDashboard,
    ]);

    const handleDateFilterChange = (value: string) => {
        setDateFilter(value);
        if (value === 'custom') {
            setShowCustomDatePicker(true);
            return;
        }
        setShowCustomDatePicker(false);
        fetchDashboard(
            buildDashboardParams(value, customerFilter, statusFilter),
            {
                onStart: () => setIsLoading(true),
                onFinish: () => setIsLoading(false),
            },
        );
    };

    const handleCustomDateApply = () => {
        if (customStartDate && customEndDate) {
            fetchDashboard(
                buildDashboardParams(dateFilter, customerFilter, statusFilter, {
                    date_filter: 'custom',
                    start_date: customStartDate,
                    end_date: customEndDate,
                }),
                {
                    onStart: () => setIsLoading(true),
                    onFinish: () => {
                        setIsLoading(false);
                        setShowCustomDatePicker(false);
                    },
                },
            );
        }
    };

    const handleCustomerFilterChange = (value: string) => {
        const newCustomer = value === 'all' ? null : value;
        setCustomerFilter(newCustomer);
        fetchDashboard(
            buildDashboardParams(dateFilter, newCustomer, statusFilter),
            {
                onStart: () => setIsLoading(true),
                onFinish: () => setIsLoading(false),
            },
        );
    };

    const handleStatusFilterChange = (value: string, checked: boolean) => {
        const newStatusFilter = checked
            ? [...statusFilter, value]
            : statusFilter.filter((s) => s !== value);
        setStatusFilter(newStatusFilter);
        fetchDashboard(
            buildDashboardParams(dateFilter, customerFilter, newStatusFilter),
            {
                onStart: () => setIsLoading(true),
                onFinish: () => setIsLoading(false),
            },
        );
    };

    const handleRefresh = () => {
        fetchDashboard(
            buildDashboardParams(dateFilter, customerFilter, statusFilter),
            {
                onStart: () => {
                    setIsRefreshing(true);
                    setIsLoading(true);
                },
                onFinish: () => {
                    setIsRefreshing(false);
                    setIsLoading(false);
                },
            },
        );
    };

    const breadcrumbsMemo = useMemo<BreadcrumbItem[]>(
        () => [{ title: t('dashboard.title'), href: dashboard().url }],
        [t],
    );

    // Memoize export function to avoid recreation on every render
    const handleExport = useCallback(() => {
        const timestamp = new Date().toISOString().split('T')[0];
        const csv = [
            [t('dashboard.export_csv_title'), ''],
            [t('dashboard.export_generated'), new Date().toLocaleString()],
            [t('dashboard.export_date_filter'), dateFilter],
            customerFilter
                ? [
                      t('dashboard.export_customer_filter'),
                      customersForFilter.find((c) => c.uuid === customerFilter)
                          ?.label || t('dashboard.export_nd'),
                  ]
                : null,
            statusFilter.length > 0
                ? [
                      t('dashboard.export_status_filter'),
                      statusFilter
                          .map(
                              (s) =>
                                  orderStatusesForFilter.find(
                                      (st) => st.value === s,
                                  )?.label || s,
                          )
                          .join(', '),
                  ]
                : null,
            [''],
            [t('dashboard.export_orders_section'), ''],
            [t('dashboard.total'), statistics.orders.total],
            [t('dashboard.launched'), statistics.orders.lanciato],
            [t('dashboard.in_progress'), statistics.orders.in_avanzamento],
            [t('dashboard.order_status_4'), statistics.orders.sospeso],
            [
                t('dashboard.order_status_completed'),
                statistics.orders.completato,
            ],
            [''],
            [t('dashboard.export_production_section'), ''],
            [
                t('dashboard.export_quantity_total'),
                statistics.production.total_quantity,
            ],
            [
                t('dashboard.export_quantity_worked'),
                statistics.production.worked_quantity,
            ],
            [
                t('dashboard.export_quantity_remaining'),
                statistics.production.total_quantity -
                    statistics.production.worked_quantity,
            ],
            [
                t('dashboard.export_progress_pct'),
                statistics.production.progress_percentage,
            ],
            [''],
            [t('dashboard.export_metrics_section'), ''],
            [
                t('dashboard.export_completion_rate'),
                performanceMetrics.completion_rate,
            ],
            [
                t('dashboard.export_avg_days'),
                performanceMetrics.avg_production_time_days,
            ],
            [
                t('dashboard.export_orders_per_day'),
                performanceMetrics.orders_per_day,
            ],
            [
                t('dashboard.export_total_orders'),
                performanceMetrics.total_orders,
            ],
            [
                t('dashboard.export_completed_orders'),
                performanceMetrics.completed_orders,
            ],
            [''],
            [t('dashboard.export_other_section'), ''],
            [t('dashboard.export_offers_total'), statistics.offers.total],
            [t('dashboard.export_offers_active'), statistics.offers.active],
            [t('dashboard.export_articles_total'), statistics.articles.total],
            [t('dashboard.export_customers_total'), statistics.customers.total],
            [''],
            [t('dashboard.export_alerts_section'), ''],
            ...alerts.map((alert) => [
                t(`dashboard.alert_title_${alert.type}`),
                alert.count,
            ]),
            [''],
            [t('dashboard.export_top_customers'), ''],
            ...topCustomers.map((customer, index) => [
                `${index + 1}. ${customer.company_name}`,
                customer.order_count,
            ]),
            [''],
            [t('dashboard.export_top_articles'), ''],
            ...topArticles.map((article, index) => [
                `${index + 1}. ${article.cod_article_las}`,
                article.total_quantity,
            ]),
            [''],
            [t('dashboard.export_trend_section'), ''],
            ...ordersTrend.map((trend) => [`${trend.period}`, trend.count]),
            previousTrend && previousTrend.length > 0
                ? ['', t('dashboard.export_trend_previous'), '']
                : null,
            ...(previousTrend && previousTrend.length > 0
                ? previousTrend.map((trend) => [`${trend.period}`, trend.count])
                : []),
        ]
            .filter((row) => row !== null)
            .map((row) => row.map((cell) => `"${cell}"`).join(','))
            .join('\n');

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `dashboard-${dateFilter}-${timestamp}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    }, [
        t,
        dateFilter,
        customerFilter,
        statusFilter,
        statistics,
        performanceMetrics,
        alerts,
        topCustomers,
        topArticles,
        customersForFilter,
        orderStatusesForFilter,
        ordersTrend,
        previousTrend,
    ]);

    const visibleAlertOrders = alerts.reduce(
        (total, alert) =>
            dismissedAlertIds.has(alert.type) ? total : total + alert.count,
        0,
    );
    const pageTitle =
        visibleAlertOrders > 0
            ? `(${visibleAlertOrders}) ${t('dashboard.title')}`
            : t('dashboard.title');

    return (
        <AppLayout breadcrumbs={breadcrumbsMemo}>
            {/* Head: titolo dinamico con conteggio avvisi visibili (tab del browser + accessibilità) */}
            <Head title={pageTitle} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {/* Header + Filters en dos filas para mayor claridad */}
                <div className="flex flex-col gap-3">
                    {/* Fila 1: título + acciones principales */}
                    <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                        <div className="flex-1">
                            <h1 className="text-2xl font-bold tracking-tight">
                                {t('dashboard.title')}
                            </h1>
                            <p className="mt-0.5 text-sm text-foreground/80">
                                {t('dashboard.subtitle')}
                            </p>
                        </div>

                        {/* Quick Actions */}
                        <div className="flex flex-wrap items-center gap-2">
                            <Link href={orders.create().url}>
                                <Button
                                    variant="default"
                                    size="sm"
                                    className="h-9"
                                >
                                    <Plus className="mr-1.5 h-3.5 w-3.5" />
                                    {t('dashboard.new_order')}
                                </Button>
                            </Link>
                            <Link href={offers.create().url}>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-9"
                                >
                                    <Plus className="mr-1.5 h-3.5 w-3.5" />
                                    {t('dashboard.new_offer')}
                                </Button>
                            </Link>
                            <Link href={planning.index().url}>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-9"
                                >
                                    <Calendar className="mr-1.5 h-3.5 w-3.5" />
                                    {t('dashboard.planning')}
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Fila 2: filtros + azioni secundarias (auto/refresh/export) */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        {/* Grupo de filtros */}
                        <div className="flex flex-wrap items-center gap-2">
                            <div className="flex items-center gap-2">
                                <Select
                                    value={dateFilter}
                                    onValueChange={handleDateFilterChange}
                                >
                                    <SelectTrigger
                                        className="h-9 w-[180px]"
                                        aria-label={t(
                                            'dashboard.date_filter_label',
                                        )}
                                    >
                                        <Calendar className="mr-2 h-3.5 w-3.5 shrink-0" />
                                        {dateFilter === 'all' ? (
                                            <span className="truncate">
                                                {t('dashboard.date_all')}
                                            </span>
                                        ) : (
                                            <SelectValue />
                                        )}
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            {t('dashboard.date_all_full')}
                                        </SelectItem>
                                        <SelectItem value="today">
                                            {t('dashboard.date_today')}
                                        </SelectItem>
                                        <SelectItem value="week">
                                            {t('dashboard.date_week')}
                                        </SelectItem>
                                        <SelectItem value="month">
                                            {t('dashboard.date_month')}
                                        </SelectItem>
                                        <SelectItem value="custom">
                                            {t('dashboard.date_custom')}
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                {dateFilter === 'all' && (
                                    <span className="rounded bg-muted px-2 py-1 text-xs text-muted-foreground">
                                        {t('dashboard.date_aggregate')}
                                    </span>
                                )}

                                {/* Custom Date Picker Dialog */}
                                <Dialog
                                    open={showCustomDatePicker}
                                    onOpenChange={setShowCustomDatePicker}
                                >
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>
                                                {t(
                                                    'dashboard.date_range_title',
                                                )}
                                            </DialogTitle>
                                            <DialogDescription>
                                                {t(
                                                    'dashboard.date_range_description',
                                                )}
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="grid gap-4 py-4">
                                            <div className="grid gap-2">
                                                <Label htmlFor="start_date">
                                                    {t('dashboard.date_start')}
                                                </Label>
                                                <Input
                                                    id="start_date"
                                                    type="date"
                                                    value={customStartDate}
                                                    onChange={(e) =>
                                                        setCustomStartDate(
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="end_date">
                                                    {t('dashboard.date_end')}
                                                </Label>
                                                <Input
                                                    id="end_date"
                                                    type="date"
                                                    value={customEndDate}
                                                    onChange={(e) =>
                                                        setCustomEndDate(
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                            </div>
                                            <div className="flex gap-2 pt-2">
                                                <Button
                                                    variant="outline"
                                                    onClick={() => {
                                                        const today =
                                                            new Date();
                                                        const last7Days =
                                                            new Date(today);
                                                        last7Days.setDate(
                                                            today.getDate() - 7,
                                                        );
                                                        setCustomStartDate(
                                                            last7Days
                                                                .toISOString()
                                                                .split('T')[0],
                                                        );
                                                        setCustomEndDate(
                                                            today
                                                                .toISOString()
                                                                .split('T')[0],
                                                        );
                                                    }}
                                                    className="flex-1"
                                                >
                                                    {t('dashboard.last_7_days')}
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    onClick={() => {
                                                        const today =
                                                            new Date();
                                                        const lastMonth =
                                                            new Date(today);
                                                        lastMonth.setMonth(
                                                            today.getMonth() -
                                                                1,
                                                        );
                                                        setCustomStartDate(
                                                            lastMonth
                                                                .toISOString()
                                                                .split('T')[0],
                                                        );
                                                        setCustomEndDate(
                                                            today
                                                                .toISOString()
                                                                .split('T')[0],
                                                        );
                                                    }}
                                                    className="flex-1"
                                                >
                                                    {t('dashboard.last_month')}
                                                </Button>
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button
                                                variant="outline"
                                                onClick={() =>
                                                    setShowCustomDatePicker(
                                                        false,
                                                    )
                                                }
                                            >
                                                {t('common.cancel')}
                                            </Button>
                                            <Button
                                                onClick={handleCustomDateApply}
                                                disabled={
                                                    !customStartDate ||
                                                    !customEndDate
                                                }
                                            >
                                                {t('common.apply')}
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </div>

                            {/* Filtro cliente */}
                            <Select
                                value={customerFilter || 'all'}
                                onValueChange={handleCustomerFilterChange}
                            >
                                <SelectTrigger
                                    className="h-9 w-[180px]"
                                    aria-label={t('dashboard.customer_filter')}
                                >
                                    <Users className="mr-2 h-3.5 w-3.5" />
                                    <SelectValue
                                        placeholder={t(
                                            'dashboard.all_customers',
                                        )}
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        {t('dashboard.all_customers')}
                                    </SelectItem>
                                    {customersForFilter.map((customer) => (
                                        <SelectItem
                                            key={customer.uuid}
                                            value={customer.uuid}
                                        >
                                            {customer.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {/* Filtro stato */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-9"
                                    >
                                        <Filter className="mr-1.5 h-3.5 w-3.5" />
                                        {t('dashboard.status')}
                                        {statusFilter.length > 0 && (
                                            <Badge
                                                variant="secondary"
                                                className="ml-1.5 h-5 px-1.5 text-xs"
                                            >
                                                {statusFilter.length}
                                            </Badge>
                                        )}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    align="end"
                                    className="w-56"
                                >
                                    <DropdownMenuLabel>
                                        {t('dashboard.filter_by_status')}
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    {orderStatusesForFilter.map((status) => (
                                        <DropdownMenuCheckboxItem
                                            key={status.value}
                                            checked={statusFilter.includes(
                                                status.value,
                                            )}
                                            onCheckedChange={(checked) =>
                                                handleStatusFilterChange(
                                                    status.value,
                                                    checked as boolean,
                                                )
                                            }
                                        >
                                            {status.label}
                                        </DropdownMenuCheckboxItem>
                                    ))}
                                    {statusFilter.length > 0 && (
                                        <>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuCheckboxItem
                                                onSelect={(e) => {
                                                    e.preventDefault();
                                                    setStatusFilter([]);
                                                    fetchDashboard(
                                                        buildDashboardParams(
                                                            dateFilter,
                                                            customerFilter,
                                                            [],
                                                        ),
                                                        {
                                                            onStart: () =>
                                                                setIsLoading(
                                                                    true,
                                                                ),
                                                            onFinish: () =>
                                                                setIsLoading(
                                                                    false,
                                                                ),
                                                        },
                                                    );
                                                }}
                                                className="text-red-600 dark:text-red-400"
                                            >
                                                <X className="mr-2 h-3.5 w-3.5" />
                                                {t('dashboard.remove_filters')}
                                            </DropdownMenuCheckboxItem>
                                        </>
                                    )}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        {/* Grupo de acciones secundarias */}
                        <div className="flex flex-wrap items-center gap-3">
                            {/* Switch estilo iOS para auto-refresh */}
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-medium text-foreground/75">
                                    {t('dashboard.auto')}
                                </span>
                                <button
                                    type="button"
                                    role="switch"
                                    aria-checked={autoRefreshEnabled}
                                    onClick={() =>
                                        setAutoRefreshEnabled((prev) => !prev)
                                    }
                                    className={`relative inline-flex h-5 w-9 items-center rounded-full border transition-colors ${
                                        autoRefreshEnabled
                                            ? 'border-primary bg-primary/80'
                                            : 'border-border bg-muted'
                                    }`}
                                    aria-label={t(
                                        'dashboard.auto_refresh_aria',
                                    )}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-background shadow-sm transition-transform ${
                                            autoRefreshEnabled
                                                ? 'translate-x-4'
                                                : 'translate-x-1'
                                        }`}
                                    />
                                </button>
                            </div>

                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={handleRefresh}
                                            disabled={isRefreshing}
                                            className="h-9 w-9"
                                            aria-label={t(
                                                'dashboard.refresh_aria',
                                            )}
                                        >
                                            <RefreshCw
                                                className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`}
                                            />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <span>{t('dashboard.refresh')}</span>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            {lastUpdatedAt && (
                                <span
                                    className="text-xs text-muted-foreground tabular-nums"
                                    title={lastUpdatedAt.toLocaleString(
                                        'it-IT',
                                        {
                                            dateStyle: 'medium',
                                            timeStyle: 'short',
                                        },
                                    )}
                                >
                                    {t('dashboard.updated_at')}{' '}
                                    {lastUpdatedAt.toLocaleTimeString(
                                        undefined,
                                        {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        },
                                    )}
                                </span>
                            )}
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-9"
                                aria-label={t('dashboard.export_aria')}
                                onClick={handleExport}
                            >
                                <Download className="mr-1.5 h-3.5 w-3.5" />
                                {t('dashboard.export')}
                            </Button>
                            <Link
                                href={productionPortal.login.url()}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={t(
                                    'dashboard.production_portal_aria',
                                )}
                            >
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-9"
                                >
                                    <Eye className="mr-1.5 h-3.5 w-3.5" />
                                    {t('dashboard.production_portal')}
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Avvisi stile iOS: riga compatta (icona + numero + titolo) → tap espande → Accetta (Vai) o Chiudi */}
                {(() => {
                    const displayedAlerts = alerts
                        .filter(
                            (a) =>
                                !dismissedAlertIds.has(a.type) ||
                                exitingAlertIds.has(a.type),
                        )
                        .sort(
                            (a, b) =>
                                (ALERT_SEVERITY_ORDER[a.severity] ?? 4) -
                                (ALERT_SEVERITY_ORDER[b.severity] ?? 4),
                        );
                    if (displayedAlerts.length === 0) return null;

                    const handleDismiss = (alert: (typeof alerts)[0]) => {
                        const alertType = alert.type;
                        setExpandedAlertId(null);
                        setExitingAlertIds((prev) =>
                            new Set(prev).add(alertType),
                        );
                        if (
                            alert.signature != null &&
                            alert.scope_hash != null
                        ) {
                            router.post(acknowledgeAlert.url(), {
                                alert_key: alert.type,
                                signature: alert.signature,
                                scope_hash: alert.scope_hash,
                            });
                            window.setTimeout(() => {
                                setExitingAlertIds((prev) => {
                                    const next = new Set(prev);
                                    next.delete(alertType);
                                    return next;
                                });
                            }, ALERT_EXIT_DURATION_MS);
                        } else {
                            window.setTimeout(() => {
                                setDismissedAlertIds((prev) =>
                                    new Set(prev).add(alertType),
                                );
                                setExitingAlertIds((prev) => {
                                    const next = new Set(prev);
                                    next.delete(alertType);
                                    return next;
                                });
                            }, ALERT_EXIT_DURATION_MS);
                        }
                    };

                    const getAlertUrl = (alert: (typeof alerts)[0]) => {
                        if (alert.type === 'overdue') {
                            return `${orders.index().url}?date_to=${new Date().toISOString().slice(0, 10)}&status=0,1,2,3,4`;
                        }
                        if (alert.type === 'suspended') {
                            return `${orders.index().url}?status=4`;
                        }
                        if (alert.type === 'autocontrollo') {
                            return `${orders.index().url}?autocontrollo=false&status=2,3`;
                        }
                        return orders.index().url;
                    };

                    const getCtaLabel = (alert: (typeof alerts)[0]) => {
                        if (alert.type === 'overdue')
                            return t('dashboard.cta_overdue');
                        if (alert.type === 'suspended')
                            return t('dashboard.cta_suspended');
                        if (alert.type === 'autocontrollo')
                            return t('dashboard.cta_autocontrollo');
                        return null;
                    };

                    const isActionable = (a: (typeof alerts)[0]) =>
                        a.type === 'overdue' ||
                        a.type === 'suspended' ||
                        a.type === 'autocontrollo';

                    return (
                        <div className="space-y-2">
                            {displayedAlerts.map((alert, index) => {
                                const alertUrl = getAlertUrl(alert);
                                const ctaLabel = getCtaLabel(alert);
                                const actionable = isActionable(alert);
                                const isExiting = exitingAlertIds.has(
                                    alert.type,
                                );
                                const isExpanded =
                                    expandedAlertId === alert.type;
                                const delayMs = index * ALERT_STAGGER_DELAY_MS;
                                const springCurve =
                                    'cubic-bezier(0.34, 1.2, 0.64, 1)';

                                const cardStyle = isExiting
                                    ? {
                                          opacity: 0,
                                          transform:
                                              'translateY(-12px) scale(0.98)',
                                          transition: `opacity ${ALERT_EXIT_DURATION_MS}ms ease-out, transform ${ALERT_EXIT_DURATION_MS}ms ease-out`,
                                      }
                                    : alertsSectionVisible
                                      ? {
                                            opacity: 1,
                                            transform: 'translateY(0) scale(1)',
                                            transition: `opacity ${ALERT_ENTER_DURATION_MS}ms ${springCurve} ${delayMs}ms, transform ${ALERT_ENTER_DURATION_MS}ms ${springCurve} ${delayMs}ms`,
                                        }
                                      : {
                                            opacity: 0,
                                            transform:
                                                'translateY(-20px) scale(0.96)',
                                            transition: `opacity ${ALERT_ENTER_DURATION_MS}ms ${springCurve} ${delayMs}ms, transform ${ALERT_ENTER_DURATION_MS}ms ${springCurve} ${delayMs}ms`,
                                        };

                                return (
                                    <div
                                        key={alert.type}
                                        className={`relative overflow-hidden rounded-xl border transition-shadow ${
                                            isExiting
                                                ? 'pointer-events-none'
                                                : ''
                                        } ${ALERT_SEVERITY_COLORS[alert.severity]} ${
                                            isExpanded ? 'shadow-md' : ''
                                        }`}
                                        style={cardStyle}
                                    >
                                        {/* Riga compatta: icona + titolo + numero + chevron */}
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setExpandedAlertId((prev) =>
                                                    prev === alert.type
                                                        ? null
                                                        : alert.type,
                                                )
                                            }
                                            className="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left focus:ring-2 focus:ring-ring focus:outline-none focus:ring-inset"
                                            aria-expanded={isExpanded}
                                            aria-label={
                                                isExpanded
                                                    ? t(
                                                          'dashboard.alert_close_detail',
                                                      )
                                                    : `${t(`dashboard.alert_title_${alert.type}`)}, ${alert.count} ${t('dashboard.alert_tap_hint')}`
                                            }
                                        >
                                            <AlertTriangle className="h-5 w-5 shrink-0" />
                                            <span className="min-w-0 flex-1 truncate font-semibold">
                                                {t(
                                                    `dashboard.alert_title_${alert.type}`,
                                                )}
                                            </span>
                                            <Badge
                                                variant="outline"
                                                className="shrink-0 font-medium"
                                            >
                                                {alert.count}
                                            </Badge>
                                            <span
                                                className={`shrink-0 transition-transform duration-200 ${
                                                    isExpanded
                                                        ? 'rotate-180'
                                                        : ''
                                                }`}
                                            >
                                                <ChevronDown className="h-4 w-4" />
                                            </span>
                                        </button>

                                        {/* Corpo espanso: messaggio + Azioni Accetta / Chiudi */}
                                        <div
                                            className="grid transition-[grid-template-rows] duration-300 ease-out"
                                            style={{
                                                gridTemplateRows: isExpanded
                                                    ? '1fr'
                                                    : '0fr',
                                            }}
                                        >
                                            <div className="min-h-0 overflow-hidden">
                                                <div className="border-t border-current/20 px-4 py-3">
                                                    <p className="mb-3 text-sm">
                                                        {t(
                                                            `dashboard.alert_message_${alert.type}`,
                                                            {
                                                                count: alert.count,
                                                            },
                                                        )}
                                                    </p>
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        {actionable &&
                                                            ctaLabel && (
                                                                <Link
                                                                    href={
                                                                        alertUrl
                                                                    }
                                                                    className="inline-flex items-center gap-1.5 rounded-lg bg-white/80 px-3 py-2 text-sm font-semibold shadow-sm transition hover:bg-white dark:bg-black/30 dark:hover:bg-black/40"
                                                                >
                                                                    <ArrowRight className="h-3.5 w-3.5" />
                                                                    {ctaLabel}
                                                                </Link>
                                                            )}
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDismiss(
                                                                    alert,
                                                                );
                                                            }}
                                                            className="inline-flex items-center gap-1.5 rounded-lg border border-current/30 bg-transparent px-3 py-2 text-sm font-medium transition hover:bg-black/5 dark:hover:bg-white/10"
                                                        >
                                                            <X className="h-3.5 w-3.5" />
                                                            {t(
                                                                'dashboard.close',
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    );
                })()}

                {/* Riga di riepilogo: a rischio · ordini attivi · in pianificazione (ordine per importanza) */}
                {(statistics.orders.total > 0 ||
                    alerts.some((a) => a.type === 'overdue')) && (
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                        <Link
                            href={`${orders.index().url}?date_to=${new Date().toISOString().slice(0, 10)}&status=0,1,2,3,4`}
                            className="font-semibold text-red-600 hover:underline dark:text-red-400"
                        >
                            {alerts.find((a) => a.type === 'overdue')?.count ??
                                0}{' '}
                            {t('dashboard.at_risk')}
                        </Link>
                        <span className="text-foreground/50">·</span>
                        <Link
                            href={`${orders.index().url}?status=2,3`}
                            className="font-semibold text-foreground hover:underline"
                        >
                            {statistics.orders.lanciato +
                                statistics.orders.in_avanzamento}{' '}
                            {t('dashboard.active_orders')}
                        </Link>
                        <span className="text-foreground/50">·</span>
                        <Link
                            href={planning.index().url}
                            className="font-semibold text-foreground hover:underline"
                        >
                            {statistics.orders.pianificato +
                                statistics.orders.in_allestimento}{' '}
                            {t('dashboard.in_planning')}
                        </Link>
                    </div>
                )}

                {/* Statistics Cards with Comparison - Most Important First */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Orders Total */}
                    <Link
                        href={orders.index().url}
                        className="group block h-full"
                        aria-label={t('dashboard.view_all_orders')}
                    >
                        <Card className="flex h-full cursor-pointer flex-col border-l-4 border-l-blue-500 transition-all focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 hover:scale-[1.02] hover:border-primary/50 hover:shadow-lg">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <CardTitle className="cursor-help text-sm font-semibold text-foreground/80">
                                                {t('dashboard.orders_total')}
                                            </CardTitle>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>
                                                {t(
                                                    'dashboard.orders_total_tooltip',
                                                )}
                                            </p>
                                            {dateFilter === 'all' && (
                                                <p className="mt-1 text-muted-foreground">
                                                    {t(
                                                        'dashboard.orders_total_tooltip_all',
                                                    )}
                                                </p>
                                            )}
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 transition-colors group-hover:bg-blue-500/20">
                                    <Package className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                </div>
                            </CardHeader>
                            <CardContent className="flex flex-1 flex-col">
                                {isLoading ? (
                                    <Skeleton className="mb-2 h-9 w-24" />
                                ) : (
                                    <div className="mb-2 text-3xl font-bold">
                                        {statistics.orders.total.toLocaleString()}
                                    </div>
                                )}
                                {comparisonStats && (
                                    <div className="mb-3 flex items-center gap-1.5 text-xs">
                                        {comparisonStats.orders.change >= 0 ? (
                                            <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                                        ) : (
                                            <TrendingDown className="h-3.5 w-3.5 text-red-500" />
                                        )}
                                        <span
                                            className={`font-semibold ${comparisonStats.orders.change >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}
                                        >
                                            {comparisonStats.orders.change >= 0
                                                ? '+'
                                                : ''}
                                            {comparisonStats.orders.change_percentage.toFixed(
                                                1,
                                            )}
                                            %
                                        </span>
                                        <span className="text-foreground/75">
                                            {t('dashboard.vs_previous_period')}
                                        </span>
                                    </div>
                                )}
                                <div className="mt-auto flex items-center gap-2 border-t pt-3">
                                    <Badge
                                        variant="outline"
                                        className="border-blue-500/30 text-xs text-blue-700 dark:text-blue-300"
                                    >
                                        {statistics.orders.lanciato}{' '}
                                        {t('dashboard.launched')}
                                    </Badge>
                                    <Badge
                                        variant="outline"
                                        className="border-yellow-500/30 text-xs text-yellow-700 dark:text-yellow-300"
                                    >
                                        {statistics.orders.in_avanzamento}{' '}
                                        {t('dashboard.in_progress')}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>

                    {/* Offers */}
                    <Link
                        href={offers.index().url}
                        className="group block h-full"
                        aria-label={t('dashboard.view_all_offers')}
                    >
                        <Card className="flex h-full cursor-pointer flex-col border-l-4 border-l-purple-500 transition-all focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 hover:scale-[1.02] hover:border-primary/50 hover:shadow-lg">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <CardTitle className="cursor-help text-sm font-semibold text-foreground/80">
                                                {t('dashboard.offers')}
                                            </CardTitle>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>
                                                {t('dashboard.offers_tooltip')}
                                            </p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10 transition-colors group-hover:bg-purple-500/20">
                                    <FileText className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                </div>
                            </CardHeader>
                            <CardContent className="flex flex-1 flex-col">
                                {isLoading ? (
                                    <Skeleton className="mb-2 h-9 w-24" />
                                ) : (
                                    <div className="mb-2 text-3xl font-bold">
                                        {statistics.offers.total.toLocaleString()}
                                    </div>
                                )}
                                {!comparisonStats && <div className="mb-3" />}
                                <div className="mt-auto flex items-center gap-2 border-t pt-3">
                                    <Badge
                                        variant="outline"
                                        className="border-emerald-500/30 text-xs text-emerald-700 dark:text-emerald-300"
                                    >
                                        {statistics.offers.active}{' '}
                                        {t('dashboard.active')}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>

                    {/* Articles */}
                    <Link
                        href={articles.index().url}
                        className="group block h-full"
                        aria-label={t('dashboard.view_all_articles')}
                    >
                        <Card className="flex h-full cursor-pointer flex-col border-l-4 border-l-orange-500 transition-all focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 hover:scale-[1.02] hover:border-primary/50 hover:shadow-lg">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <CardTitle className="cursor-help text-sm font-semibold text-foreground/80">
                                                {t('dashboard.articles')}
                                            </CardTitle>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>
                                                {t(
                                                    'dashboard.articles_tooltip',
                                                )}
                                            </p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10 transition-colors group-hover:bg-orange-500/20">
                                    <ShoppingCart className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                                </div>
                            </CardHeader>
                            <CardContent className="flex flex-1 flex-col">
                                {isLoading ? (
                                    <Skeleton className="mb-2 h-9 w-24" />
                                ) : (
                                    <div className="mb-2 text-3xl font-bold">
                                        {statistics.articles.total.toLocaleString()}
                                    </div>
                                )}
                                {!comparisonStats && <div className="mb-3" />}
                                <p className="mt-auto border-t pt-3 text-xs text-foreground/75">
                                    {t('dashboard.articles_registered')}
                                </p>
                            </CardContent>
                        </Card>
                    </Link>

                    {/* Customers */}
                    <Link
                        href={customers.index().url}
                        className="group block h-full"
                    >
                        <Card className="flex h-full cursor-pointer flex-col border-l-4 border-l-emerald-500 transition-all hover:scale-[1.02] hover:border-primary/50 hover:shadow-lg">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <CardTitle className="cursor-help text-sm font-semibold text-foreground/80">
                                                {t('dashboard.customers')}
                                            </CardTitle>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>
                                                {t(
                                                    'dashboard.customers_tooltip',
                                                )}
                                            </p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 transition-colors group-hover:bg-emerald-500/20">
                                    <Users className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                </div>
                            </CardHeader>
                            <CardContent className="flex flex-1 flex-col">
                                {isLoading ? (
                                    <Skeleton className="mb-2 h-9 w-24" />
                                ) : (
                                    <div className="mb-2 text-3xl font-bold">
                                        {statistics.customers.total.toLocaleString()}
                                    </div>
                                )}
                                {!comparisonStats && <div className="mb-3" />}
                                <p className="mt-auto border-t pt-3 text-xs text-foreground/75">
                                    {t('dashboard.customers_active')}
                                </p>
                            </CardContent>
                        </Card>
                    </Link>
                </div>

                {/* Pipeline 7 stati: clic su stato → lista ordini filtrata */}
                <div className="flex flex-wrap items-center gap-2 rounded-lg border bg-muted/30 px-3 py-2">
                    {[
                        {
                            key: 'pianificato',
                            label: t('dashboard.order_status_0'),
                            count: statistics.orders.pianificato,
                            statusParam: '0',
                        },
                        {
                            key: 'in_allestimento',
                            label: t('dashboard.order_status_1'),
                            count: statistics.orders.in_allestimento,
                            statusParam: '1',
                        },
                        {
                            key: 'lanciato',
                            label: t('dashboard.order_status_2'),
                            count: statistics.orders.lanciato,
                            statusParam: '2',
                        },
                        {
                            key: 'in_avanzamento',
                            label: t('dashboard.order_status_3'),
                            count: statistics.orders.in_avanzamento,
                            statusParam: '3',
                        },
                        {
                            key: 'sospeso',
                            label: t('dashboard.order_status_4'),
                            count: statistics.orders.sospeso,
                            statusParam: '4',
                        },
                        {
                            key: 'completato',
                            label: t('dashboard.order_status_completed'),
                            count: statistics.orders.completato,
                            statusParam: 'completed',
                        },
                    ].map(({ key, label, count, statusParam }) => (
                        <Link
                            key={key}
                            href={`${orders.index().url}?status=${statusParam}`}
                            className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors hover:bg-muted"
                        >
                            <span className="text-foreground/80">{label}</span>
                            <Badge
                                variant="secondary"
                                className="h-5 min-w-5 px-1 text-[10px]"
                            >
                                {count}
                            </Badge>
                        </Link>
                    ))}
                </div>

                {/* Pianificazione produzione: ordini in pianificazione / in allestimento → link a Planning */}
                <Link
                    href={planning.index().url}
                    className="group block"
                    aria-label={t('dashboard.planning_aria')}
                >
                    <Card className="flex cursor-pointer flex-row flex-wrap items-center justify-between gap-4 border-l-4 border-l-sky-500 transition-all focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 hover:scale-[1.01] hover:border-primary/50 hover:shadow-lg">
                        <div className="flex flex-1 items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-500/10 transition-colors group-hover:bg-sky-500/20">
                                <Calendar className="h-6 w-6 text-sky-600 dark:text-sky-400" />
                            </div>
                            <div>
                                <CardTitle className="text-base">
                                    {t('dashboard.planning_production')}
                                </CardTitle>
                                <CardDescription className="text-sm">
                                    {t('dashboard.planning_production_desc')}
                                </CardDescription>
                            </div>
                        </div>
                        {isLoading ? (
                            <Skeleton className="h-10 w-24" />
                        ) : (
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                    <Badge
                                        variant="secondary"
                                        className="border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-300"
                                    >
                                        {statistics.orders.pianificato}{' '}
                                        {t('dashboard.planned')}
                                    </Badge>
                                    <Badge
                                        variant="outline"
                                        className="border-sky-500/30 text-sky-700 dark:text-sky-300"
                                    >
                                        {statistics.orders.in_allestimento}{' '}
                                        {t('dashboard.in_allestimento')}
                                    </Badge>
                                </div>
                                <ArrowRight className="h-5 w-5 text-sky-600 opacity-0 transition-opacity group-hover:opacity-100 dark:text-sky-400" />
                            </div>
                        )}
                    </Card>
                </Link>

                {/* Performance Metrics - Most Important, Moved Up */}
                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                    <Link
                        href={`${orders.index().url}?status=completed`}
                        className="group block h-full"
                        aria-label={t('dashboard.view_completed_orders')}
                    >
                        <Card className="flex h-full cursor-pointer flex-col border-emerald-200 bg-gradient-to-br from-emerald-50/50 to-transparent transition-all focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 hover:scale-[1.01] hover:border-primary/50 hover:shadow-lg dark:border-emerald-900 dark:from-emerald-950/20">
                            <CardHeader className="pb-2">
                                <div className="mb-1.5 flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-2">
                                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 transition-colors group-hover:bg-emerald-500/20">
                                            <Award className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                                        </div>
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <CardDescription className="cursor-help text-xs font-medium">
                                                        {t(
                                                            'dashboard.completion_rate',
                                                        )}
                                                    </CardDescription>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>
                                                        {t(
                                                            'dashboard.completion_rate_tooltip',
                                                        )}
                                                    </p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                    {!isLoading && (
                                        <span
                                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                                                performanceMetrics.completion_rate >=
                                                80
                                                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                                                    : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
                                            }`}
                                        >
                                            {performanceMetrics.completion_rate >=
                                            80
                                                ? t('dashboard.on_track')
                                                : t('dashboard.at_risk_badge')}
                                        </span>
                                    )}
                                </div>
                                {isLoading ? (
                                    <Skeleton className="h-8 w-20" />
                                ) : (
                                    <CardTitle className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
                                        {performanceMetrics.completion_rate.toFixed(
                                            1,
                                        )}
                                        %
                                    </CardTitle>
                                )}
                            </CardHeader>
                            <CardContent className="pt-0">
                                <div className="flex items-center gap-2 border-t pt-2">
                                    <CheckCircle className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                                    <p className="text-xs text-foreground/75">
                                        {performanceMetrics.completed_orders}{' '}
                                        {t('dashboard.orders_completed_of')}{' '}
                                        {performanceMetrics.total_orders}{' '}
                                        {t('dashboard.orders_completed')}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                    <Card className="border-blue-200 bg-gradient-to-br from-blue-50/50 to-transparent dark:border-blue-900 dark:from-blue-950/20">
                        <CardHeader className="pb-2">
                            <div className="mb-1.5 flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10">
                                        <Clock className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <CardDescription className="cursor-help text-xs font-medium">
                                                    {t(
                                                        'dashboard.avg_production_time',
                                                    )}
                                                </CardDescription>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>
                                                    {t(
                                                        'dashboard.avg_production_time_tooltip',
                                                    )}
                                                </p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                                {!isLoading && (
                                    <span
                                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                                            performanceMetrics.avg_production_time_days <=
                                            14
                                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                                                : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
                                        }`}
                                    >
                                        {performanceMetrics.avg_production_time_days <=
                                        14
                                            ? t('dashboard.good')
                                            : t('dashboard.slow')}
                                    </span>
                                )}
                            </div>
                            {isLoading ? (
                                <Skeleton className="h-8 w-24" />
                            ) : (
                                <CardTitle className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                                    {performanceMetrics.avg_production_time_days.toFixed(
                                        1,
                                    )}
                                    <span className="ml-1 text-base text-foreground/75">
                                        {t('dashboard.days')}
                                    </span>
                                </CardTitle>
                            )}
                        </CardHeader>
                        <CardContent className="flex flex-1 flex-col pt-0">
                            <div className="mt-auto flex items-center gap-2 border-t pt-2">
                                <BarChart3 className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                                <p className="text-xs text-foreground/75">
                                    {t('dashboard.avg_time_tooltip')}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                    <Link
                        href={orders.index().url}
                        className="group block h-full"
                        aria-label={t('dashboard.view_all_orders')}
                    >
                        <Card className="flex h-full cursor-pointer flex-col border-purple-200 bg-gradient-to-br from-purple-50/50 to-transparent transition-all focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 hover:scale-[1.01] hover:border-primary/50 hover:shadow-lg dark:border-purple-900 dark:from-purple-950/20">
                            <CardHeader className="pb-2">
                                <div className="mb-1.5 flex items-center gap-2">
                                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-500/10 transition-colors group-hover:bg-purple-500/20">
                                        <TrendingUp className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <CardDescription className="cursor-help text-xs font-medium">
                                                    {t(
                                                        'dashboard.orders_per_day',
                                                    )}
                                                </CardDescription>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>
                                                    {t(
                                                        'dashboard.orders_per_day_tooltip',
                                                    )}
                                                </p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                                {isLoading ? (
                                    <Skeleton className="h-8 w-20" />
                                ) : (
                                    <CardTitle className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                                        {performanceMetrics.orders_per_day.toFixed(
                                            1,
                                        )}
                                    </CardTitle>
                                )}
                            </CardHeader>
                            <CardContent className="pt-0">
                                <div className="flex items-center gap-2 border-t pt-2">
                                    <Calendar className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                                    <p className="text-xs text-foreground/75">
                                        {t('dashboard.orders_per_day_short')}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                </div>

                {/* Production Progress - Compact */}
                <Link
                    href={orders.productionAdvancements().url}
                    className="group block"
                >
                    <Card className="cursor-pointer border-primary/20 bg-gradient-to-br from-primary/5 to-transparent transition-all hover:scale-[1.01] hover:border-primary/50 hover:shadow-lg">
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2.5">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20">
                                        <TrendingUp className="h-4 w-4 text-primary" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-base">
                                            {t('dashboard.production_progress')}
                                        </CardTitle>
                                        <CardDescription className="text-xs">
                                            {t(
                                                'dashboard.production_progress_desc',
                                            )}
                                            {comparisonStats && (
                                                <span className="ml-2 inline-flex items-center gap-1">
                                                    <span
                                                        className={`text-xs font-semibold ${comparisonStats.production.change >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}
                                                    >
                                                        {comparisonStats
                                                            .production
                                                            .change >= 0
                                                            ? '+'
                                                            : ''}
                                                        {comparisonStats.production.change.toFixed(
                                                            1,
                                                        )}
                                                        %
                                                    </span>
                                                    <span className="text-xs text-foreground/75">
                                                        {t(
                                                            'dashboard.vs_previous_period',
                                                        )}
                                                    </span>
                                                </span>
                                            )}
                                        </CardDescription>
                                    </div>
                                </div>
                                <div className="space-y-1 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        {!isLoading && (
                                            <span
                                                className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                                                    statistics.production
                                                        .progress_percentage >=
                                                    80
                                                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                                                        : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
                                                }`}
                                            >
                                                {statistics.production
                                                    .progress_percentage >= 80
                                                    ? t(
                                                          'dashboard.progress_good',
                                                      )
                                                    : t(
                                                          'dashboard.progress_monitor',
                                                      )}
                                            </span>
                                        )}
                                    </div>
                                    <div>
                                        <div className="text-xl font-bold text-primary">
                                            {statistics.production.progress_percentage.toFixed(
                                                1,
                                            )}
                                            %
                                        </div>
                                        <p className="text-xs text-foreground/75">
                                            {t('dashboard.completion')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div>
                                            <p className="mb-0.5 text-xs font-medium text-foreground/80">
                                                {t('dashboard.processed')}
                                            </p>
                                            <p className="text-lg font-bold">
                                                {statistics.production.worked_quantity.toLocaleString()}
                                            </p>
                                        </div>
                                        <div className="h-10 w-px bg-border" />
                                        <div>
                                            <p className="mb-0.5 text-xs font-medium text-foreground/80">
                                                {t('dashboard.total')}
                                            </p>
                                            <p className="text-lg font-bold">
                                                {statistics.production.total_quantity.toLocaleString()}
                                            </p>
                                        </div>
                                        <div className="h-10 w-px bg-border" />
                                        <div>
                                            <p className="mb-0.5 text-xs font-medium text-foreground/80">
                                                {t('dashboard.remaining')}
                                            </p>
                                            <p className="text-lg font-bold text-orange-600 dark:text-orange-400">
                                                {(
                                                    statistics.production
                                                        .total_quantity -
                                                    statistics.production
                                                        .worked_quantity
                                                ).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="relative h-7 w-full overflow-hidden rounded-full bg-muted shadow-inner">
                                    <div
                                        className="flex h-7 items-center justify-end rounded-full bg-gradient-to-r from-primary via-primary/90 to-primary/80 pr-2.5 text-xs font-bold text-white shadow-sm transition-all duration-500"
                                        style={{
                                            width: `${Math.min(statistics.production.progress_percentage, 100)}%`,
                                        }}
                                    >
                                        {statistics.production
                                            .progress_percentage > 15 && (
                                            <span>
                                                {statistics.production.progress_percentage.toFixed(
                                                    1,
                                                )}
                                                %
                                            </span>
                                        )}
                                    </div>
                                    {statistics.production
                                        .progress_percentage <= 15 && (
                                        <div className="absolute top-1/2 left-2.5 -translate-y-1/2 text-xs font-semibold text-foreground/90">
                                            {statistics.production.progress_percentage.toFixed(
                                                1,
                                            )}
                                            %
                                        </div>
                                    )}
                                </div>
                                {advancementsCountToday >= 0 && (
                                    <div className="border-t pt-2">
                                        <span className="text-xs font-medium text-foreground/80">
                                            {t('dashboard.advancements_today')}{' '}
                                            {advancementsCountToday}{' '}
                                            {t(
                                                'dashboard.advancements_registrations',
                                            )}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </Link>

                {/* Orders Trend Chart - Grafico tendenze ordini */}
                {isLoading ? (
                    <Card>
                        <CardHeader>
                            <Skeleton className="mb-2 h-6 w-48" />
                            <Skeleton className="h-4 w-64" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-64 w-full" />
                        </CardContent>
                    </Card>
                ) : (
                    <OrdersTrendChart
                        data={ordersTrend}
                        previousPeriodData={previousTrend || undefined}
                        groupBy="day"
                        onPointClick={(period) => {
                            // Filtrare ordini per periodo selezionato (giorno)
                            router.get(
                                orders.index().url,
                                { date_filter: 'day', day: period },
                                {
                                    preserveScroll: true,
                                },
                            );
                        }}
                    />
                )}

                {/* Order Status Chart - Grafico distribuzione stati */}
                {isLoading ? (
                    <Card>
                        <CardHeader>
                            <Skeleton className="mb-2 h-6 w-48" />
                            <Skeleton className="h-4 w-64" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-64 w-full" />
                        </CardContent>
                    </Card>
                ) : (
                    <OrderStatusChart
                        data={statistics.orders}
                        onStatusClick={(status) => {
                            // Mappatura chiave stato grafico -> parametro filtro in Orders Index
                            let statusParam: string;
                            switch (status) {
                                case 'lanciato':
                                    statusParam = '2';
                                    break;
                                case 'in_avanzamento':
                                    statusParam = '3';
                                    break;
                                case 'sospeso':
                                    statusParam = '4';
                                    break;
                                case 'completato':
                                default:
                                    statusParam = 'completed'; // stesso filtro della card performance
                                    break;
                            }

                            router.get(
                                orders.index().url,
                                { status: statusParam },
                                {
                                    preserveScroll: true,
                                },
                            );
                        }}
                    />
                )}

                {/* Production Progress Chart */}
                {productionProgressData.length > 0 && (
                    <ProductionProgressChart
                        data={productionProgressData}
                        maxItems={10}
                        onBarClick={(orderNumber) => {
                            const order = recentOrders.find(
                                (o) =>
                                    o.order_production_number === orderNumber,
                            );
                            if (order) {
                                router.visit(
                                    orders.show({ order: order.uuid }).url,
                                );
                            }
                        }}
                    />
                )}

                {/* Urgent Orders & Recent Orders */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {/* Urgent Orders */}
                    <Card className="flex h-full flex-col border-orange-200 bg-gradient-to-br from-orange-50/30 to-transparent dark:border-orange-900 dark:from-orange-950/10">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10">
                                        <Zap className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                                    </div>
                                    <div>
                                        <CardTitle>
                                            {t('dashboard.urgent_orders')}
                                        </CardTitle>
                                        <CardDescription>
                                            {t('dashboard.urgent_orders_desc')}
                                        </CardDescription>
                                    </div>
                                </div>
                                <Link href={orders.index().url}>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="border-orange-200 hover:bg-orange-50 dark:border-orange-800 dark:hover:bg-orange-950/30"
                                    >
                                        {t('dashboard.view_all')}
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </Link>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-1">
                            {isLoading && urgentOrders.length === 0 ? (
                                <div className="space-y-3">
                                    {[1, 2, 3].map((i) => (
                                        <Skeleton
                                            key={i}
                                            className="h-20 w-full"
                                        />
                                    ))}
                                </div>
                            ) : urgentOrders.length === 0 ? (
                                <div className="py-8 text-center text-foreground/70">
                                    <CheckCircle className="mx-auto mb-4 h-12 w-12 opacity-50" />
                                    <p>{t('dashboard.no_urgent_orders')}</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {urgentOrders.map((order) => (
                                        <button
                                            key={order.uuid}
                                            type="button"
                                            onClick={() =>
                                                router.visit(
                                                    orders.show({
                                                        order: order.uuid,
                                                    }).url,
                                                )
                                            }
                                            className={`group flex w-full cursor-pointer items-center justify-between rounded-lg border bg-white p-3 text-left transition-all hover:shadow-sm focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none dark:bg-slate-900/50 ${
                                                order.is_overdue
                                                    ? 'border-red-500/50 hover:bg-red-50/70 dark:hover:bg-red-950/15'
                                                    : order.days_until_delivery &&
                                                        order.days_until_delivery <=
                                                            3
                                                      ? 'border-orange-500/50 hover:bg-orange-50/70 dark:hover:bg-orange-950/15'
                                                      : 'border-orange-200/60 hover:bg-orange-50/40 dark:border-orange-900/60 dark:hover:bg-orange-950/10'
                                            }`}
                                        >
                                            <div className="min-w-0 flex-1">
                                                <div className="mb-1 flex items-center gap-2">
                                                    <span className="truncate font-semibold group-hover:underline">
                                                        {
                                                            order.order_production_number
                                                        }
                                                    </span>
                                                    <Badge
                                                        className={`${getOrderStatusColor(
                                                            order.status,
                                                        )} cursor-pointer`}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            router.get(
                                                                orders.index()
                                                                    .url,
                                                                {
                                                                    status: order.status.toString(),
                                                                },
                                                                {
                                                                    preserveScroll: true,
                                                                },
                                                            );
                                                        }}
                                                        aria-label={`${t('dashboard.filter_orders_by_status')} ${t(getOrderStatusLabelKey(order.status))}`}
                                                    >
                                                        {t(
                                                            getOrderStatusLabelKey(
                                                                order.status,
                                                            ),
                                                        )}
                                                    </Badge>
                                                    {order.is_overdue && (
                                                        <Badge
                                                            variant="destructive"
                                                            className="text-xs"
                                                        >
                                                            {t(
                                                                'dashboard.overdue',
                                                            )}
                                                        </Badge>
                                                    )}
                                                </div>
                                                {order.article && (
                                                    <p className="truncate text-xs text-foreground/75">
                                                        {
                                                            order.article
                                                                .cod_article_las
                                                        }{' '}
                                                        -{' '}
                                                        {order.article
                                                            .article_descr ||
                                                            t(
                                                                'dashboard.no_description',
                                                            )}
                                                    </p>
                                                )}
                                                {order.delivery_requested_date && (
                                                    <p
                                                        className={`mt-1 text-xs ${
                                                            order.is_overdue
                                                                ? 'font-semibold text-red-600'
                                                                : 'text-foreground/75'
                                                        }`}
                                                    >
                                                        {t(
                                                            'dashboard.delivery',
                                                        )}{' '}
                                                        {
                                                            order.delivery_requested_date
                                                        }
                                                        {order.days_until_delivery !==
                                                            undefined && (
                                                            <span className="ml-2">
                                                                (
                                                                {(() => {
                                                                    const days =
                                                                        Math.round(
                                                                            Number(
                                                                                order.days_until_delivery,
                                                                            ),
                                                                        );
                                                                    return days <
                                                                        0
                                                                        ? `${Math.abs(days)} ${t('dashboard.days_overdue')}`
                                                                        : `${days} ${t('dashboard.days_remaining')}`;
                                                                })()}
                                                                )
                                                            </span>
                                                        )}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="ml-2 flex items-center text-muted-foreground group-hover:text-foreground">
                                                <Eye
                                                    className="h-4 w-4"
                                                    aria-hidden="true"
                                                />
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Recent Orders */}
                    <Card className="flex h-full flex-col border-blue-200 bg-gradient-to-br from-blue-50/30 to-transparent dark:border-blue-900 dark:from-blue-950/10">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                                        <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <CardTitle>
                                            {t('dashboard.recent_orders')}
                                        </CardTitle>
                                        <CardDescription>
                                            {t('dashboard.recent_orders_desc')}
                                        </CardDescription>
                                    </div>
                                </div>
                                <Link href={orders.index().url}>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="border-blue-200 hover:bg-blue-50 dark:border-blue-800 dark:hover:bg-blue-950/30"
                                    >
                                        {t('dashboard.view_all')}
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </Link>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-1">
                            {recentOrders.length === 0 ? (
                                <div className="py-8 text-center text-foreground/75">
                                    <Package className="mx-auto mb-4 h-12 w-12 opacity-50" />
                                    <p>{t('dashboard.no_recent_orders')}</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {recentOrders.map((order) => (
                                        <button
                                            key={order.uuid}
                                            type="button"
                                            onClick={() =>
                                                router.visit(
                                                    orders.show({
                                                        order: order.uuid,
                                                    }).url,
                                                )
                                            }
                                            className="group flex w-full cursor-pointer items-center justify-between rounded-lg border border-blue-200/50 bg-white p-4 text-left transition-all hover:bg-blue-50/50 hover:shadow-sm focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none dark:border-blue-900/50 dark:bg-slate-900/50 dark:hover:bg-blue-950/10"
                                        >
                                            <div className="min-w-0 flex-1">
                                                <div className="mb-1 flex items-center gap-2">
                                                    <span className="truncate font-semibold group-hover:underline">
                                                        {
                                                            order.order_production_number
                                                        }
                                                    </span>
                                                    <Badge
                                                        className={`${getOrderStatusColor(
                                                            order.status,
                                                        )} cursor-pointer`}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            router.get(
                                                                orders.index()
                                                                    .url,
                                                                {
                                                                    status: order.status.toString(),
                                                                },
                                                                {
                                                                    preserveScroll: true,
                                                                },
                                                            );
                                                        }}
                                                        aria-label={`${t('dashboard.filter_orders_by_status')} ${t(getOrderStatusLabelKey(order.status))}`}
                                                    >
                                                        {t(
                                                            getOrderStatusLabelKey(
                                                                order.status,
                                                            ),
                                                        )}
                                                    </Badge>
                                                </div>
                                                {order.article && (
                                                    <p className="truncate text-xs text-foreground/75">
                                                        {
                                                            order.article
                                                                .cod_article_las
                                                        }{' '}
                                                        -{' '}
                                                        {order.article
                                                            .article_descr ||
                                                            t(
                                                                'dashboard.no_description',
                                                            )}
                                                    </p>
                                                )}
                                                {order.customer && (
                                                    <p className="text-xs text-foreground/75">
                                                        {t(
                                                            'dashboard.customer_label',
                                                        )}{' '}
                                                        {order.customer}
                                                    </p>
                                                )}
                                                {order.created_at && (
                                                    <p className="mt-1 text-xs text-foreground/75">
                                                        {order.created_at}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="ml-2 flex items-center text-muted-foreground group-hover:text-foreground">
                                                <Eye
                                                    className="h-4 w-4"
                                                    aria-hidden="true"
                                                />
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Top Clienti e Top Articoli - Grafici */}
                <div className="grid gap-4 md:grid-cols-2">
                    <TopCustomersChart
                        data={topCustomers}
                        onBarClick={(customer) => {
                            router.visit(
                                customers.show({ customer: customer.uuid }).url,
                            );
                        }}
                    />
                    <TopArticlesChart
                        data={topArticles}
                        onBarClick={(article) => {
                            router.visit(
                                articles.show({ article: article.uuid }).url,
                            );
                        }}
                    />
                </div>
            </div>
        </AppLayout>
    );
}
