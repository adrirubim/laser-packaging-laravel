<?php

namespace App\Repositories;

use App\Models\Article;
use App\Models\Customer;
use App\Models\Offer;
use App\Models\Order;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class DashboardRepository
{
    /**
     * Cache duration in seconds
     */
    private const CACHE_DURATION_STATS = 60; // 1 minute for statistics

    private const CACHE_DURATION_URGENT = 30; // 30 seconds for urgent orders

    private const CACHE_DURATION_TOP = 300; // 5 minutes for top customers/articles

    protected CustomerRepository $customerRepository;

    public function __construct(CustomerRepository $customerRepository)
    {
        $this->customerRepository = $customerRepository;
    }

    /**
     * Get all statistics
     */
    public function getStatistics(array $dateRange, ?string $customerUuid = null, ?array $statuses = null): array
    {
        $ordersQuery = Order::where('removed', false);

        // Filter by customer if provided
        if ($customerUuid) {
            $ordersQuery->whereHas('article.offer', function ($query) use ($customerUuid) {
                $query->where('customer_uuid', $customerUuid);
            });
        }

        // Filter by statuses if provided
        if ($statuses && count($statuses) > 0) {
            $ordersQuery->whereIn('status', $statuses);
        }

        if ($dateRange['start']) {
            $ordersQuery->whereBetween('created_at', [$dateRange['start'], $dateRange['end']]);
        }

        // Optimized: Single query with conditional aggregation
        $ordersStats = $ordersQuery
            ->selectRaw('
                COUNT(*) as total,
                SUM(CASE WHEN status = ? THEN 1 ELSE 0 END) as lanciato,
                SUM(CASE WHEN status = ? THEN 1 ELSE 0 END) as in_avanzamento,
                SUM(CASE WHEN status = ? THEN 1 ELSE 0 END) as sospeso,
                SUM(CASE WHEN status IN (?, ?) THEN 1 ELSE 0 END) as completato,
                SUM(quantity) as total_quantity,
                SUM(worked_quantity) as worked_quantity
            ', [
                Order::STATUS_LANCIATO,
                Order::STATUS_IN_AVANZAMENTO,
                Order::STATUS_SOSPESO,
                Order::STATUS_EVASO,
                Order::STATUS_SALDATO,
            ])
            ->first();

        $totalQuantity = (float) ($ordersStats->total_quantity ?? 0);
        $workedQuantity = (float) ($ordersStats->worked_quantity ?? 0);
        $productionProgress = $totalQuantity > 0
            ? round(($workedQuantity / $totalQuantity) * 100, 2)
            : 0;

        $offersQuery = Offer::where('removed', false);
        if ($dateRange['start']) {
            $offersQuery->whereBetween('created_at', [$dateRange['start'], $dateRange['end']]);
        }

        $articlesQuery = Article::where('removed', false);
        if ($dateRange['start']) {
            $articlesQuery->whereBetween('created_at', [$dateRange['start'], $dateRange['end']]);
        }

        $customersQuery = Customer::where('removed', false);
        if ($dateRange['start']) {
            $customersQuery->whereBetween('created_at', [$dateRange['start'], $dateRange['end']]);
        }

        return [
            'orders' => [
                'total' => (int) ($ordersStats->total ?? 0),
                'lanciato' => (int) ($ordersStats->lanciato ?? 0),
                'in_avanzamento' => (int) ($ordersStats->in_avanzamento ?? 0),
                'sospeso' => (int) ($ordersStats->sospeso ?? 0),
                'completato' => (int) ($ordersStats->completato ?? 0),
            ],
            'offers' => [
                'total' => $offersQuery->count(),
                'active' => $offersQuery->count(),
            ],
            'articles' => [
                'total' => $articlesQuery->count(),
            ],
            'customers' => [
                'total' => $customersQuery->count(),
            ],
            'production' => [
                'total_quantity' => $totalQuantity,
                'worked_quantity' => $workedQuantity,
                'progress_percentage' => $productionProgress,
            ],
        ];
    }

    /**
     * Get production progress data for chart
     */
    public function getProductionProgressData(int $limit = 10, ?string $customerUuid = null, ?array $statuses = null): array
    {
        $urgentDate = now()->addDays(7);

        $query = Order::where('removed', false)
            ->whereNotNull('delivery_requested_date')
            ->where('delivery_requested_date', '<=', $urgentDate)
            ->whereNotIn('status', [Order::STATUS_EVASO, Order::STATUS_SALDATO]);

        // Filter by customer if provided
        if ($customerUuid) {
            $query->whereHas('article.offer', function ($q) use ($customerUuid) {
                $q->where('customer_uuid', $customerUuid);
            });
        }

        // Filter by statuses if provided
        if ($statuses && count($statuses) > 0) {
            $query->whereIn('status', $statuses);
        }

        return $query->with(['article'])
            ->orderBy('delivery_requested_date', 'asc')
            ->limit($limit)
            ->get()
            ->map(function ($order) {
                $daysUntilDelivery = now()->diffInDays($order->delivery_requested_date, false);
                $totalQuantity = (float) ($order->quantity ?? 0);
                $workedQuantity = (float) ($order->worked_quantity ?? 0);
                $progress = $totalQuantity > 0 ? round(($workedQuantity / $totalQuantity) * 100, 2) : 0;

                return [
                    'orderNumber' => $order->order_production_number,
                    'worked' => $workedQuantity,
                    'total' => $totalQuantity,
                    'progress' => $progress,
                    'isUrgent' => $daysUntilDelivery <= 7 && $daysUntilDelivery >= 0,
                    'daysUntilDelivery' => $daysUntilDelivery,
                ];
            })
            ->toArray();
    }

    /**
     * Get urgent orders (delivery date within 7 days)
     */
    public function getUrgentOrders(int $limit = 10): array
    {
        $urgentDate = now()->addDays(7);

        return Order::where('removed', false)
            ->whereNotNull('delivery_requested_date')
            ->where('delivery_requested_date', '<=', $urgentDate)
            ->where('delivery_requested_date', '>=', now())
            ->whereNotIn('status', [Order::STATUS_EVASO, Order::STATUS_SALDATO])
            ->with(['article', 'article.offer.customer'])
            ->orderBy('delivery_requested_date', 'asc')
            ->limit($limit)
            ->get()
            ->map(function ($order) {
                $daysUntilDelivery = now()->diffInDays($order->delivery_requested_date, false);

                return [
                    'id' => $order->id,
                    'uuid' => $order->uuid,
                    'order_production_number' => $order->order_production_number,
                    'status' => $order->status,
                    'status_label' => $order->status_label,
                    'quantity' => $order->quantity,
                    'worked_quantity' => $order->worked_quantity,
                    'delivery_requested_date' => $order->delivery_requested_date?->format('Y-m-d'),
                    'days_until_delivery' => $daysUntilDelivery,
                    'is_overdue' => $daysUntilDelivery < 0,
                    'article' => $order->article ? [
                        'cod_article_las' => $order->article->cod_article_las,
                        'article_descr' => $order->article->article_descr,
                    ] : null,
                    'customer' => $order->article && $order->article->offer && $order->article->offer->customer
                        ? $order->article->offer->customer->company_name
                        : null,
                ];
            })
            ->toArray();
    }

    /**
     * Get recent orders
     */
    public function getRecentOrders(int $limit = 10): array
    {
        return Order::where('removed', false)
            ->with(['article', 'article.offer.customer'])
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->id,
                    'uuid' => $order->uuid,
                    'order_production_number' => $order->order_production_number,
                    'status' => $order->status,
                    'status_label' => $order->status_label,
                    'quantity' => $order->quantity,
                    'worked_quantity' => $order->worked_quantity,
                    'article' => $order->article ? [
                        'cod_article_las' => $order->article->cod_article_las,
                        'article_descr' => $order->article->article_descr,
                    ] : null,
                    'customer' => $order->article && $order->article->offer && $order->article->offer->customer
                        ? $order->article->offer->customer->company_name
                        : null,
                    'created_at' => $order->created_at?->format('Y-m-d H:i'),
                ];
            })
            ->toArray();
    }

    /**
     * Get top customers by order count
     */
    public function getTopCustomers(array $dateRange, int $limit = 5, ?string $customerUuid = null, ?array $statuses = null): array
    {
        $query = DB::table('orderorder as o')
            ->join('articles as a', 'o.article_uuid', '=', 'a.uuid')
            ->join('offer as of', 'a.offer_uuid', '=', 'of.uuid')
            ->join('customer as c', 'of.customer_uuid', '=', 'c.uuid')
            ->where('o.removed', false)
            ->where('c.removed', false);

        // Filter by customer if provided
        if ($customerUuid) {
            $query->where('c.uuid', $customerUuid);
        }

        // Filter by statuses if provided
        if ($statuses && count($statuses) > 0) {
            $query->whereIn('o.status', $statuses);
        }

        $query->select('c.id', 'c.uuid', 'c.company_name', DB::raw('COUNT(o.id) as order_count'))
            ->groupBy('c.id', 'c.uuid', 'c.company_name')
            ->orderBy('order_count', 'desc')
            ->limit($limit);

        if ($dateRange['start']) {
            $query->whereBetween('o.created_at', [$dateRange['start'], $dateRange['end']]);
        }

        return $query->get()->map(function ($item) {
            return [
                'id' => (int) $item->id,
                'uuid' => $item->uuid,
                'company_name' => $item->company_name,
                'order_count' => (int) $item->order_count,
            ];
        })->toArray();
    }

    /**
     * Get top articles by production quantity
     */
    public function getTopArticles(array $dateRange, int $limit = 5, ?string $customerUuid = null, ?array $statuses = null): array
    {
        $query = DB::table('orderorder as o')
            ->join('articles as a', 'o.article_uuid', '=', 'a.uuid')
            ->where('o.removed', false)
            ->where('a.removed', false);

        // Filter by customer if provided
        if ($customerUuid) {
            $query->join('offer as of', 'a.offer_uuid', '=', 'of.uuid')
                ->where('of.customer_uuid', $customerUuid);
        }

        // Filter by statuses if provided
        if ($statuses && count($statuses) > 0) {
            $query->whereIn('o.status', $statuses);
        }

        $query->select('a.id', 'a.uuid', 'a.cod_article_las', 'a.article_descr', DB::raw('SUM(o.quantity) as total_quantity'))
            ->groupBy('a.id', 'a.uuid', 'a.cod_article_las', 'a.article_descr')
            ->orderBy('total_quantity', 'desc')
            ->limit($limit);

        if ($dateRange['start']) {
            $query->whereBetween('o.created_at', [$dateRange['start'], $dateRange['end']]);
        }

        return $query->get()->map(function ($item) {
            return [
                'id' => (int) $item->id,
                'uuid' => $item->uuid,
                'cod_article_las' => $item->cod_article_las,
                'article_descr' => $item->article_descr,
                'total_quantity' => (float) $item->total_quantity,
            ];
        })->toArray();
    }

    /**
     * Get performance metrics
     */
    public function getPerformanceMetrics(array $dateRange, ?string $customerUuid = null, ?array $statuses = null): array
    {
        $ordersQuery = Order::where('removed', false);

        // Filter by customer if provided
        if ($customerUuid) {
            $ordersQuery->whereHas('article.offer', function ($query) use ($customerUuid) {
                $query->where('customer_uuid', $customerUuid);
            });
        }

        // Filter by statuses if provided
        if ($statuses && count($statuses) > 0) {
            $ordersQuery->whereIn('status', $statuses);
        }

        if ($dateRange['start']) {
            $ordersQuery->whereBetween('created_at', [$dateRange['start'], $dateRange['end']]);
        }

        $totalOrders = $ordersQuery->count();
        $completedOrders = $ordersQuery->whereIn('status', [Order::STATUS_EVASO, Order::STATUS_SALDATO])->count();
        $completionRate = $totalOrders > 0 ? round(($completedOrders / $totalOrders) * 100, 2) : 0;

        // Average production time (days between created_at and completion)
        $completedOrdersQuery = Order::where('removed', false)
            ->whereIn('status', [Order::STATUS_EVASO, Order::STATUS_SALDATO])
            ->whereNotNull('created_at')
            ->whereNotNull('updated_at');

        // Filter by customer if provided
        if ($customerUuid) {
            $completedOrdersQuery->whereHas('article.offer', function ($query) use ($customerUuid) {
                $query->where('customer_uuid', $customerUuid);
            });
        }

        // Filter by statuses if provided (already filtered by EVASO/SALDATO, but keep for consistency)
        if ($statuses && count($statuses) > 0) {
            $completedOrdersQuery->whereIn('status', $statuses);
        }

        if ($dateRange['start']) {
            $completedOrdersQuery->whereBetween('updated_at', [$dateRange['start'], $dateRange['end']]);
        }

        $driver = DB::connection()->getDriverName();
        $avgProductionTime = null;

        $completedCount = $completedOrdersQuery->count();

        if ($completedCount > 0) {
            if ($driver === 'sqlite') {
                $avgProductionTime = $completedOrdersQuery
                    ->whereRaw('julianday(updated_at) > julianday(created_at)')
                    ->selectRaw('AVG((julianday(updated_at) - julianday(created_at))) as avg_days')
                    ->value('avg_days');
            } else {
                $avgProductionTime = $completedOrdersQuery
                    ->whereRaw('updated_at > created_at')
                    ->selectRaw('AVG(EXTRACT(EPOCH FROM (updated_at - created_at)) / 86400) as avg_days')
                    ->value('avg_days');
            }

            if ($avgProductionTime === null || $avgProductionTime <= 0) {
                if ($driver === 'sqlite') {
                    $avgProductionTime = $completedOrdersQuery
                        ->selectRaw('AVG((julianday(updated_at) - julianday(created_at))) as avg_days')
                        ->value('avg_days');
                } else {
                    $avgProductionTime = $completedOrdersQuery
                        ->selectRaw('AVG(EXTRACT(EPOCH FROM (updated_at - created_at)) / 86400) as avg_days')
                        ->value('avg_days');
                }
            }
        }

        // Orders per day
        $daysInPeriod = $dateRange['start']
            ? $dateRange['start']->diffInDays($dateRange['end']) + 1
            : 1;
        $ordersPerDay = $daysInPeriod > 0 ? round($totalOrders / $daysInPeriod, 2) : 0;

        // Ensure avg_production_time_days is a valid number
        $finalAvgProductionTime = 0;
        if ($avgProductionTime !== null && $avgProductionTime !== false && is_numeric($avgProductionTime)) {
            $finalAvgProductionTime = round((float) $avgProductionTime, 1);
            if ($finalAvgProductionTime < 0) {
                $finalAvgProductionTime = 0;
            }
        }

        return [
            'completion_rate' => $completionRate,
            'avg_production_time_days' => $finalAvgProductionTime,
            'orders_per_day' => $ordersPerDay,
            'total_orders' => $totalOrders,
            'completed_orders' => $completedOrders,
        ];
    }

    /**
     * Get alerts (suspended orders, overdue orders)
     */
    public function getAlerts(?string $customerUuid = null, ?array $statuses = null): array
    {
        $alerts = [];

        // Suspended orders
        $suspendedQuery = Order::where('removed', false)
            ->where('status', Order::STATUS_SOSPESO);

        if ($customerUuid) {
            $suspendedQuery->whereHas('article.offer', function ($query) use ($customerUuid) {
                $query->where('customer_uuid', $customerUuid);
            });
        }

        if ($statuses && count($statuses) > 0) {
            $suspendedQuery->whereIn('status', $statuses);
        }

        $suspendedCount = $suspendedQuery->count();

        if ($suspendedCount > 0) {
            $alerts[] = [
                'type' => 'suspended',
                'severity' => 'high',
                'title' => 'Ordini Sospesi',
                'message' => "Ci sono {$suspendedCount} ordine/i sospeso/i che richiedono attenzione.",
                'count' => $suspendedCount,
            ];
        }

        // Overdue orders
        $overdueQuery = Order::where('removed', false)
            ->whereNotNull('delivery_requested_date')
            ->where('delivery_requested_date', '<', now())
            ->whereNotIn('status', [Order::STATUS_EVASO, Order::STATUS_SALDATO]);

        if ($customerUuid) {
            $overdueQuery->whereHas('article.offer', function ($query) use ($customerUuid) {
                $query->where('customer_uuid', $customerUuid);
            });
        }

        if ($statuses && count($statuses) > 0) {
            $overdueQuery->whereIn('status', $statuses);
        }

        $overdueOrders = $overdueQuery->orderBy('delivery_requested_date', 'asc')
            ->get(['uuid', 'order_production_number']);

        $overdueCount = $overdueOrders->count();

        if ($overdueCount > 0) {
            $alerts[] = [
                'type' => 'overdue',
                'severity' => 'critical',
                'title' => 'Ordini in Ritardo',
                'message' => "Ci sono {$overdueCount} ordine/i con data di consegna scaduta.",
                'count' => $overdueCount,
                'first_order_uuid' => $overdueOrders->first()?->uuid,
            ];
        }

        // Orders without autocontrollo
        $noAutocontrolloQuery = Order::where('removed', false)
            ->where('autocontrollo', false)
            ->whereIn('status', [Order::STATUS_LANCIATO, Order::STATUS_IN_AVANZAMENTO]);

        if ($customerUuid) {
            $noAutocontrolloQuery->whereHas('article.offer', function ($query) use ($customerUuid) {
                $query->where('customer_uuid', $customerUuid);
            });
        }

        if ($statuses && count($statuses) > 0) {
            $noAutocontrolloQuery->whereIn('status', $statuses);
        }

        $noAutocontrolloCount = $noAutocontrolloQuery->count();

        if ($noAutocontrolloCount > 0) {
            $alerts[] = [
                'type' => 'autocontrollo',
                'severity' => 'medium',
                'title' => 'Autocontrollo Pendente',
                'message' => "Ci sono {$noAutocontrolloCount} ordine/i con autocontrollo pendente.",
                'count' => $noAutocontrolloCount,
            ];
        }

        return $alerts;
    }

    /**
     * Get comparison statistics with previous period
     */
    public function getComparisonStats(string $filter, array $currentRange, ?string $customerUuid = null, ?array $statuses = null): ?array
    {
        if ($filter === 'all') {
            return null;
        }

        $previousRange = $this->getPreviousPeriodRange($currentRange);
        if (! $previousRange) {
            return null;
        }

        $currentStats = $this->getStatistics($currentRange, $customerUuid, $statuses);
        $previousStats = $this->getStatistics($previousRange, $customerUuid, $statuses);

        return [
            'orders' => [
                'current' => $currentStats['orders']['total'],
                'previous' => $previousStats['orders']['total'],
                'change' => $currentStats['orders']['total'] - $previousStats['orders']['total'],
                'change_percentage' => $previousStats['orders']['total'] > 0
                    ? round((($currentStats['orders']['total'] - $previousStats['orders']['total']) / $previousStats['orders']['total']) * 100, 1)
                    : 0,
            ],
            'production' => [
                'current' => $currentStats['production']['progress_percentage'],
                'previous' => $previousStats['production']['progress_percentage'],
                'change' => $currentStats['production']['progress_percentage'] - $previousStats['production']['progress_percentage'],
            ],
        ];
    }

    /**
     * Get previous period date range
     */
    private function getPreviousPeriodRange(array $currentRange): ?array
    {
        if (! $currentRange['start']) {
            return null;
        }

        $duration = $currentRange['start']->diffInDays($currentRange['end']);

        return [
            'start' => $currentRange['start']->copy()->subDays($duration + 1),
            'end' => $currentRange['start']->copy()->subDay(),
        ];
    }

    /**
     * Clear all dashboard cache
     */
    public function clearCache(): void
    {
        // Clear all dashboard-related cache
        Cache::tags(['dashboard'])->flush();
    }

    /**
     * Clear cache for specific date filter
     */
    public function clearCacheForFilter(string $dateFilter): void
    {
        Cache::forget("dashboard_stats_{$dateFilter}");
        Cache::forget("dashboard_top_customers_{$dateFilter}");
        Cache::forget("dashboard_top_articles_{$dateFilter}");
        Cache::forget("dashboard_performance_{$dateFilter}");
    }

    /**
     * Get customers for filter dropdown
     */
    public function getCustomersForFilter(): array
    {
        return $this->customerRepository->getForSelect()
            ->map(function ($customer) {
                return [
                    'uuid' => $customer->uuid,
                    'label' => $customer->company_name,
                    'code' => $customer->code,
                ];
            })
            ->toArray();
    }

    /**
     * Get order statuses for filter
     */
    public function getOrderStatusesForFilter(): array
    {
        return [
            ['value' => (string) Order::STATUS_LANCIATO, 'label' => 'Lanciate'],
            ['value' => (string) Order::STATUS_IN_AVANZAMENTO, 'label' => 'In Avanzamento'],
            ['value' => (string) Order::STATUS_SOSPESO, 'label' => 'Sospese'],
            ['value' => (string) Order::STATUS_EVASO, 'label' => 'Evaso'],
            ['value' => (string) Order::STATUS_SALDATO, 'label' => 'Saldato'],
        ];
    }

    /**
     * Get orders trend data (for future chart implementation)
     */
    public function getOrdersTrend(array $dateRange, string $groupBy = 'day', ?string $customerUuid = null, ?array $statuses = null): array
    {
        $ordersQuery = Order::where('removed', false);

        // Apply customer and status filters to trend data
        if ($customerUuid) {
            $ordersQuery->whereHas('article.offer', function ($query) use ($customerUuid) {
                $query->where('customer_uuid', $customerUuid);
            });
        }

        if ($statuses && count($statuses) > 0) {
            $ordersQuery->whereIn('status', $statuses);
        }

        if ($dateRange['start']) {
            $ordersQuery->whereBetween('created_at', [$dateRange['start'], $dateRange['end']]);
        }

        $driver = DB::connection()->getDriverName();

        if ($groupBy === 'day') {
            if ($driver === 'sqlite') {
                $format = "strftime('%Y-%m-%d', created_at)";
            } else {
                $format = 'DATE(created_at)';
            }
        } elseif ($groupBy === 'week') {
            if ($driver === 'sqlite') {
                $format = "strftime('%Y-W%W', created_at)";
            } else {
                $format = "DATE_TRUNC('week', created_at)";
            }
        } else { // month
            if ($driver === 'sqlite') {
                $format = "strftime('%Y-%m', created_at)";
            } else {
                $format = "DATE_TRUNC('month', created_at)";
            }
        }

        return $ordersQuery
            ->selectRaw("{$format} as period, COUNT(*) as count")
            ->groupBy('period')
            ->orderBy('period', 'asc')
            ->get()
            ->map(function ($item) {
                return [
                    'period' => $item->period,
                    'count' => (int) $item->count,
                ];
            })
            ->toArray();
    }
}
