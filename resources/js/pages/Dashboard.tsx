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
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import articles from '@/routes/articles/index';
import customers from '@/routes/customers/index';
import offers from '@/routes/offers/index';
import orders from '@/routes/orders/index';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import {
    AlertTriangle,
    ArrowRight,
    Award,
    BarChart3,
    Calendar,
    CheckCircle,
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
};

const ALERT_SEVERITY_COLORS = {
    low: 'border-blue-500/40 bg-blue-500/5 text-blue-700 dark:text-blue-300',
    medium: 'border-yellow-500/40 bg-yellow-500/5 text-yellow-700 dark:text-yellow-300',
    high: 'border-orange-500/40 bg-orange-500/5 text-orange-700 dark:text-orange-300',
    critical: 'border-red-500/40 bg-red-500/5 text-red-700 dark:text-red-300',
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

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
}: DashboardProps) {
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

    // Auto-refresh functionality
    useEffect(() => {
        if (!autoRefreshEnabled) return;

        const interval = setInterval(() => {
            router.reload({
                only: [
                    'statistics',
                    'urgentOrders',
                    'recentOrders',
                    'topCustomers',
                    'topArticles',
                    'performanceMetrics',
                    'alerts',
                    'comparisonStats',
                ],
            });
        }, 60000); // Refresh every minute

        return () => clearInterval(interval);
    }, [autoRefreshEnabled]);

    const handleDateFilterChange = (value: string) => {
        setDateFilter(value);
        if (value === 'custom') {
            setShowCustomDatePicker(true);
            return;
        }
        setShowCustomDatePicker(false);
        setIsLoading(true);
        const params: Record<string, string> = { date_filter: value };
        if (customerFilter) params.customer_uuid = customerFilter;
        if (statusFilter.length > 0) params.statuses = statusFilter.join(',');

        router.get(dashboard().url, params, {
            preserveState: true,
            preserveScroll: true,
            onFinish: () => setIsLoading(false),
        });
    };

    const handleCustomDateApply = () => {
        if (customStartDate && customEndDate) {
            setIsLoading(true);
            const params: Record<string, string> = {
                date_filter: 'custom',
                start_date: customStartDate,
                end_date: customEndDate,
            };
            if (customerFilter) params.customer_uuid = customerFilter;
            if (statusFilter.length > 0)
                params.statuses = statusFilter.join(',');

            router.get(dashboard().url, params, {
                preserveState: true,
                preserveScroll: true,
                onFinish: () => {
                    setIsLoading(false);
                    setShowCustomDatePicker(false);
                },
            });
        }
    };

    const handleCustomerFilterChange = (value: string) => {
        setCustomerFilter(value === 'all' ? null : value);
        setIsLoading(true);
        const params: Record<string, string> = { date_filter: dateFilter };
        if (value !== 'all') params.customer_uuid = value;
        if (statusFilter.length > 0) params.statuses = statusFilter.join(',');

        router.get(dashboard().url, params, {
            preserveState: true,
            preserveScroll: true,
            onFinish: () => setIsLoading(false),
        });
    };

    const handleStatusFilterChange = (value: string, checked: boolean) => {
        const newStatusFilter = checked
            ? [...statusFilter, value]
            : statusFilter.filter((s) => s !== value);
        setStatusFilter(newStatusFilter);
        setIsLoading(true);
        const params: Record<string, string> = { date_filter: dateFilter };
        if (customerFilter) params.customer_uuid = customerFilter;
        if (newStatusFilter.length > 0)
            params.statuses = newStatusFilter.join(',');

        router.get(dashboard().url, params, {
            preserveState: true,
            preserveScroll: true,
            onFinish: () => setIsLoading(false),
        });
    };

    const handleRefresh = () => {
        setIsRefreshing(true);
        setIsLoading(true);
        router.reload({
            onFinish: () => {
                setIsRefreshing(false);
                setIsLoading(false);
            },
        });
    };

    // Memoize breadcrumbs to avoid recalculation
    const breadcrumbsMemo = useMemo<BreadcrumbItem[]>(() => breadcrumbs, []);

    // Memoize export function to avoid recreation on every render
    const handleExport = useCallback(() => {
        // Enhanced CSV export with all metrics
        const timestamp = new Date().toISOString().split('T')[0];
        const csv = [
            ['Statistiche Dashboard - Laser Packaging', ''],
            ['Generato', new Date().toLocaleString('it-IT')],
            ['Filtro data', dateFilter],
            customerFilter
                ? [
                      'Filtro cliente',
                      customersForFilter.find((c) => c.uuid === customerFilter)
                          ?.label || 'N/D',
                  ]
                : null,
            statusFilter.length > 0
                ? [
                      'Filtro stato',
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
            ['=== ORDINI ===', ''],
            ['Totale', statistics.orders.total],
            ['Lanciate', statistics.orders.lanciato],
            ['In Avanzamento', statistics.orders.in_avanzamento],
            ['Sospese', statistics.orders.sospeso],
            ['Completati', statistics.orders.completato],
            [''],
            ['=== PRODUZIONE ===', ''],
            ['Quantità totale', statistics.production.total_quantity],
            ['Quantità lavorata', statistics.production.worked_quantity],
            [
                'Quantità rimanente',
                statistics.production.total_quantity -
                    statistics.production.worked_quantity,
            ],
            ['Avanzamento %', statistics.production.progress_percentage],
            [''],
            ['=== METRICHE PRESTAZIONI ===', ''],
            ['Tasso completamento %', performanceMetrics.completion_rate],
            [
                'Tempo medio produzione (giorni)',
                performanceMetrics.avg_production_time_days,
            ],
            ['Ordini per giorno', performanceMetrics.orders_per_day],
            ['Ordini totali', performanceMetrics.total_orders],
            ['Ordini completati', performanceMetrics.completed_orders],
            [''],
            ['=== ALTRE STATISTICHE ===', ''],
            ['Offerte totali', statistics.offers.total],
            ['Offerte attive', statistics.offers.active],
            ['Articoli totali', statistics.articles.total],
            ['Clienti totali', statistics.customers.total],
            [''],
            ['=== AVVISI ===', ''],
            ...alerts.map((alert) => [alert.title, alert.count]),
            [''],
            ['=== TOP CLIENTI ===', ''],
            ...topCustomers.map((customer, index) => [
                `${index + 1}. ${customer.company_name}`,
                customer.order_count,
            ]),
            [''],
            ['=== TOP ARTICOLI ===', ''],
            ...topArticles.map((article, index) => [
                `${index + 1}. ${article.cod_article_las}`,
                article.total_quantity,
            ]),
            [''],
            ['=== ANDAMENTO ORDINI ===', ''],
            ...ordersTrend.map((trend) => [`${trend.period}`, trend.count]),
            previousTrend && previousTrend.length > 0
                ? ['', '=== ANDAMENTO PERIODO PRECEDENTE ===', '']
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

    return (
        <AppLayout breadcrumbs={breadcrumbsMemo}>
            <Head title="Dashboard" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {/* Header with Filters - Compact */}
                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold tracking-tight">
                            Dashboard
                        </h1>
                        <p className="mt-0.5 text-sm text-foreground/80">
                            Panoramica del sistema e statistiche di produzione
                        </p>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex flex-wrap items-center gap-2">
                        <Link href={orders.create().url}>
                            <Button variant="default" size="sm" className="h-9">
                                <Plus className="mr-1.5 h-3.5 w-3.5" />
                                Nuovo Ordine
                            </Button>
                        </Link>
                        <Link href={offers.create().url}>
                            <Button variant="outline" size="sm" className="h-9">
                                <Plus className="mr-1.5 h-3.5 w-3.5" />
                                Nuova Offerta
                            </Button>
                        </Link>
                    </div>

                    <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
                        <div className="flex items-center gap-2">
                            <Select
                                value={dateFilter}
                                onValueChange={handleDateFilterChange}
                            >
                                <SelectTrigger
                                    className="h-9 w-[160px]"
                                    aria-label="Seleziona filtro data"
                                >
                                    <Calendar className="mr-2 h-3.5 w-3.5" />
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        Tutto il tempo
                                    </SelectItem>
                                    <SelectItem value="today">Oggi</SelectItem>
                                    <SelectItem value="week">
                                        Questa settimana
                                    </SelectItem>
                                    <SelectItem value="month">
                                        Questo mese
                                    </SelectItem>
                                    <SelectItem value="custom">
                                        Personalizzato
                                    </SelectItem>
                                </SelectContent>
                            </Select>

                            {/* Custom Date Picker Dialog */}
                            <Dialog
                                open={showCustomDatePicker}
                                onOpenChange={setShowCustomDatePicker}
                            >
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>
                                            Seleziona Range di Date
                                        </DialogTitle>
                                        <DialogDescription>
                                            Scegli un periodo personalizzato per
                                            visualizzare le statistiche
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="start_date">
                                                Data Inizio
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
                                                Data Fine
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
                                                    const today = new Date();
                                                    const last7Days = new Date(
                                                        today,
                                                    );
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
                                                Ultimi 7 giorni
                                            </Button>
                                            <Button
                                                variant="outline"
                                                onClick={() => {
                                                    const today = new Date();
                                                    const lastMonth = new Date(
                                                        today,
                                                    );
                                                    lastMonth.setMonth(
                                                        today.getMonth() - 1,
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
                                                Ultimo mese
                                            </Button>
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button
                                            variant="outline"
                                            onClick={() =>
                                                setShowCustomDatePicker(false)
                                            }
                                        >
                                            Annulla
                                        </Button>
                                        <Button
                                            onClick={handleCustomDateApply}
                                            disabled={
                                                !customStartDate ||
                                                !customEndDate
                                            }
                                        >
                                            Applica
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
                                aria-label="Filtro cliente"
                            >
                                <Users className="mr-2 h-3.5 w-3.5" />
                                <SelectValue placeholder="Tutti i clienti" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">
                                    Tutti i clienti
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
                                    Stato
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
                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuLabel>
                                    Filtra per Stato
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
                                                setIsLoading(true);
                                                const params: Record<
                                                    string,
                                                    string
                                                > = { date_filter: dateFilter };
                                                if (customerFilter)
                                                    params.customer_uuid =
                                                        customerFilter;
                                                router.get(
                                                    dashboard().url,
                                                    params,
                                                    {
                                                        preserveState: true,
                                                        preserveScroll: true,
                                                        onFinish: () =>
                                                            setIsLoading(false),
                                                    },
                                                );
                                            }}
                                            className="text-red-600 dark:text-red-400"
                                        >
                                            <X className="mr-2 h-3.5 w-3.5" />
                                            Rimuovi filtri
                                        </DropdownMenuCheckboxItem>
                                    </>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                                setAutoRefreshEnabled(!autoRefreshEnabled)
                            }
                            className={`h-9 ${autoRefreshEnabled ? 'bg-primary/10' : ''}`}
                            aria-label={
                                autoRefreshEnabled
                                    ? 'Disattiva aggiornamento automatico'
                                    : 'Attiva aggiornamento automatico'
                            }
                            aria-pressed={autoRefreshEnabled}
                        >
                            <RefreshCw
                                className={`mr-1.5 h-3.5 w-3.5 ${autoRefreshEnabled ? 'animate-spin' : ''}`}
                            />
                            Auto
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleRefresh}
                            disabled={isRefreshing}
                            className="h-9"
                            aria-label="Aggiorna dati dashboard"
                        >
                            <RefreshCw
                                className={`mr-1.5 h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`}
                            />
                            Aggiorna
                        </Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-9"
                                    aria-label="Esporta dati dashboard"
                                >
                                    <Download className="mr-1.5 h-3.5 w-3.5" />
                                    Esporta
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>
                                    Formato di Esportazione
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuCheckboxItem
                                    checked={false}
                                    onSelect={(e) => {
                                        e.preventDefault();
                                        handleExport();
                                    }}
                                >
                                    <Download className="mr-2 h-4 w-4" />
                                    Esporta CSV
                                </DropdownMenuCheckboxItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                {/* Alerts - Compact */}
                {alerts.length > 0 && (
                    <div className="space-y-1.5">
                        {alerts.map((alert, index) => {
                            // Determinare l'URL di destinazione in base al tipo di avviso
                            const getAlertUrl = () => {
                                if (
                                    alert.type === 'overdue' &&
                                    alert.first_order_uuid
                                ) {
                                    // Se c'è un ordine in ritardo, vai direttamente usando UUID
                                    return `/orders/${alert.first_order_uuid}`;
                                }
                                if (alert.type === 'suspended') {
                                    // Per ordini sospesi, vai alla lista filtrata
                                    return `${orders.index().url}?status=4`;
                                }
                                if (alert.type === 'autocontrollo') {
                                    // Per ordini con autocontrollo pendente, vai alla lista filtrata
                                    return `${orders.index().url}?autocontrollo=false`;
                                }
                                // Di default, vai alla lista ordini
                                return orders.index().url;
                            };

                            const alertUrl = getAlertUrl();
                            const isClickable =
                                alert.type === 'overdue' ||
                                alert.type === 'suspended' ||
                                alert.type === 'autocontrollo';

                            if (isClickable) {
                                return (
                                    <Link
                                        key={index}
                                        href={alertUrl}
                                        className={`group block flex cursor-pointer items-center justify-between rounded-md border px-4 py-3 transition-all hover:scale-[1.01] hover:shadow-md ${ALERT_SEVERITY_COLORS[alert.severity]}`}
                                        aria-label={`${alert.title}: clicca per vedere i dettagli`}
                                    >
                                        <div className="flex flex-1 items-center gap-3">
                                            <AlertTriangle className="h-5 w-5" />
                                            <div className="flex-1">
                                                <p className="font-semibold">
                                                    {alert.title}
                                                </p>
                                                <p className="text-sm">
                                                    {alert.message}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge
                                                variant="outline"
                                                className="ml-4"
                                            >
                                                {alert.count}
                                            </Badge>
                                            <ArrowRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
                                        </div>
                                    </Link>
                                );
                            }

                            return (
                                <div
                                    key={index}
                                    className={`flex items-center justify-between rounded-md border px-4 py-3 ${ALERT_SEVERITY_COLORS[alert.severity]}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <AlertTriangle className="h-5 w-5" />
                                        <div>
                                            <p className="font-semibold">
                                                {alert.title}
                                            </p>
                                            <p className="text-sm">
                                                {alert.message}
                                            </p>
                                        </div>
                                    </div>
                                    <Badge variant="outline" className="ml-4">
                                        {alert.count}
                                    </Badge>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Statistics Cards with Comparison - Most Important First */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Orders Total */}
                    <Link
                        href={orders.index().url}
                        className="group block h-full"
                        aria-label="Vedi tutti gli ordini"
                    >
                        <Card className="flex h-full cursor-pointer flex-col border-l-4 border-l-blue-500 transition-all focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 hover:scale-[1.02] hover:border-primary/50 hover:shadow-lg">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <CardTitle className="cursor-help text-sm font-semibold text-foreground/80">
                                                Ordini Totali
                                            </CardTitle>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>
                                                Numero totale di ordini nel
                                                sistema
                                            </p>
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
                                            vs periodo precedente
                                        </span>
                                    </div>
                                )}
                                <div className="mt-auto flex items-center gap-2 border-t pt-3">
                                    <Badge
                                        variant="outline"
                                        className="border-blue-500/30 text-xs text-blue-700 dark:text-blue-300"
                                    >
                                        {statistics.orders.lanciato} lanciate
                                    </Badge>
                                    <Badge
                                        variant="outline"
                                        className="border-yellow-500/30 text-xs text-yellow-700 dark:text-yellow-300"
                                    >
                                        {statistics.orders.in_avanzamento} in
                                        avanzamento
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>

                    {/* Offers */}
                    <Link
                        href={offers.index().url}
                        className="group block h-full"
                        aria-label="Vedi tutte le offerte"
                    >
                        <Card className="flex h-full cursor-pointer flex-col border-l-4 border-l-purple-500 transition-all focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 hover:scale-[1.02] hover:border-primary/50 hover:shadow-lg">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <CardTitle className="cursor-help text-sm font-semibold text-foreground/80">
                                                Offerte
                                            </CardTitle>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>
                                                Numero totale di offerte nel
                                                sistema
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
                                        {statistics.offers.active} attive
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>

                    {/* Articles */}
                    <Link
                        href={articles.index().url}
                        className="group block h-full"
                        aria-label="Vedi tutti gli articoli"
                    >
                        <Card className="flex h-full cursor-pointer flex-col border-l-4 border-l-orange-500 transition-all focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 hover:scale-[1.02] hover:border-primary/50 hover:shadow-lg">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <CardTitle className="cursor-help text-sm font-semibold text-foreground/80">
                                                Articoli
                                            </CardTitle>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>
                                                Numero totale di articoli
                                                registrati nel sistema
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
                                    Articoli registrati nel sistema
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
                                                Clienti
                                            </CardTitle>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>
                                                Numero totale di clienti attivi
                                                nel sistema
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
                                    Clienti attivi nel sistema
                                </p>
                            </CardContent>
                        </Card>
                    </Link>
                </div>

                {/* Performance Metrics - Most Important, Moved Up */}
                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                    <Link
                        href={`${orders.index().url}?status=completed`}
                        className="group block h-full"
                        aria-label="Vedi ordini completati"
                    >
                        <Card className="flex h-full cursor-pointer flex-col border-emerald-200 bg-gradient-to-br from-emerald-50/50 to-transparent transition-all focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 hover:scale-[1.01] hover:border-primary/50 hover:shadow-lg dark:border-emerald-900 dark:from-emerald-950/20">
                            <CardHeader className="pb-2">
                                <div className="mb-1.5 flex items-center gap-2">
                                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 transition-colors group-hover:bg-emerald-500/20">
                                        <Award className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <CardDescription className="cursor-help text-xs font-medium">
                                                    Tasso di Completamento
                                                </CardDescription>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>
                                                    Percentuale di ordini
                                                    completati rispetto al
                                                    totale
                                                </p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
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
                                        {performanceMetrics.completed_orders} di{' '}
                                        {performanceMetrics.total_orders} ordini
                                        completati
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                    <Card className="border-blue-200 bg-gradient-to-br from-blue-50/50 to-transparent dark:border-blue-900 dark:from-blue-950/20">
                        <CardHeader className="pb-2">
                            <div className="mb-1.5 flex items-center gap-2">
                                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10">
                                    <Clock className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <CardDescription className="cursor-help text-xs font-medium">
                                                Tempo Medio di Produzione
                                            </CardDescription>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>
                                                Tempo medio in giorni dalla
                                                creazione al completamento di un
                                                ordine
                                            </p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                            {isLoading ? (
                                <Skeleton className="h-8 w-24" />
                            ) : (
                                <CardTitle className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                                    {performanceMetrics.avg_production_time_days.toFixed(
                                        1,
                                    )}
                                    <span className="ml-1 text-base text-foreground/75">
                                        giorni
                                    </span>
                                </CardTitle>
                            )}
                        </CardHeader>
                        <CardContent className="flex flex-1 flex-col pt-0">
                            <div className="mt-auto flex items-center gap-2 border-t pt-2">
                                <BarChart3 className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                                <p className="text-xs text-foreground/75">
                                    Tempo medio dalla creazione al completamento
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                    <Link
                        href={orders.index().url}
                        className="group block h-full"
                        aria-label="Vedi tutti gli ordini"
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
                                                    Ordini per Giorno
                                                </CardDescription>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>
                                                    Media di ordini processati
                                                    per giorno nel periodo
                                                    selezionato
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
                                        Media di ordini processati per giorno
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
                                            Progresso di Produzione
                                        </CardTitle>
                                        <CardDescription className="text-xs">
                                            Quantità totale processata vs.
                                            quantità totale
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
                                                        vs periodo precedente
                                                    </span>
                                                </span>
                                            )}
                                        </CardDescription>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xl font-bold text-primary">
                                        {statistics.production.progress_percentage.toFixed(
                                            1,
                                        )}
                                        %
                                    </div>
                                    <p className="text-xs text-foreground/75">
                                        Completamento
                                    </p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div>
                                            <p className="mb-0.5 text-xs font-medium text-foreground/80">
                                                Processato
                                            </p>
                                            <p className="text-lg font-bold">
                                                {statistics.production.worked_quantity.toLocaleString()}
                                            </p>
                                        </div>
                                        <div className="h-10 w-px bg-border" />
                                        <div>
                                            <p className="mb-0.5 text-xs font-medium text-foreground/80">
                                                Totale
                                            </p>
                                            <p className="text-lg font-bold">
                                                {statistics.production.total_quantity.toLocaleString()}
                                            </p>
                                        </div>
                                        <div className="h-10 w-px bg-border" />
                                        <div>
                                            <p className="mb-0.5 text-xs font-medium text-foreground/80">
                                                Rimanente
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
                                        <CardTitle>Ordini Urgenti</CardTitle>
                                        <CardDescription>
                                            Ordini con consegna nei prossimi 7
                                            giorni
                                        </CardDescription>
                                    </div>
                                </div>
                                <Link href={orders.index().url}>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="border-orange-200 hover:bg-orange-50 dark:border-orange-800 dark:hover:bg-orange-950/30"
                                    >
                                        Vedi tutte
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
                                    <p>Non ci sono ordini urgenti</p>
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
                                                        className={getOrderStatusColor(
                                                            order.status,
                                                        )}
                                                    >
                                                        {order.status_label}
                                                    </Badge>
                                                    {order.is_overdue && (
                                                        <Badge
                                                            variant="destructive"
                                                            className="text-xs"
                                                        >
                                                            In Ritardo
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
                                                            'Senza descrizione'}
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
                                                        Consegna:{' '}
                                                        {
                                                            order.delivery_requested_date
                                                        }
                                                        {order.days_until_delivery !==
                                                            undefined && (
                                                            <span className="ml-2">
                                                                (
                                                                {order.days_until_delivery <
                                                                0
                                                                    ? `${Math.abs(order.days_until_delivery)} giorni in ritardo`
                                                                    : `${order.days_until_delivery} giorni rimanenti`}
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
                                        <CardTitle>Ordini Recenti</CardTitle>
                                        <CardDescription>
                                            Ultimi 10 ordini creati
                                        </CardDescription>
                                    </div>
                                </div>
                                <Link href={orders.index().url}>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="border-blue-200 hover:bg-blue-50 dark:border-blue-800 dark:hover:bg-blue-950/30"
                                    >
                                        Vedi tutte
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </Link>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-1">
                            {recentOrders.length === 0 ? (
                                <div className="py-8 text-center text-foreground/75">
                                    <Package className="mx-auto mb-4 h-12 w-12 opacity-50" />
                                    <p>Non ci sono ordini recenti</p>
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
                                                        className={getOrderStatusColor(
                                                            order.status,
                                                        )}
                                                    >
                                                        {order.status_label}
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
                                                            'Senza descrizione'}
                                                    </p>
                                                )}
                                                {order.customer && (
                                                    <p className="text-xs text-foreground/75">
                                                        Cliente:{' '}
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
