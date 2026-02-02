<?php

namespace App\Http\Controllers;

use App\Repositories\DashboardRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    protected DashboardRepository $dashboardRepository;

    public function __construct(DashboardRepository $dashboardRepository)
    {
        $this->dashboardRepository = $dashboardRepository;
    }

    public function index(Request $request): Response
    {
        // Get filters from request
        $dateFilter = $request->get('date_filter', 'all');
        $customerUuid = $request->get('customer_uuid');
        $statuses = $request->get('statuses') ? explode(',', $request->get('statuses')) : null;

        $dateRange = $this->getDateRange($dateFilter);

        // Cache key based on filters
        $cacheKey = "dashboard_stats_{$dateFilter}_".($customerUuid ?? 'all').'_'.($statuses ? implode(',', $statuses) : 'all');
        $cacheDuration = 60; // 1 minute cache

        // Get statistics with cache
        $statistics = Cache::remember($cacheKey, $cacheDuration, function () use ($dateRange, $customerUuid, $statuses) {
            return $this->dashboardRepository->getStatistics($dateRange, $customerUuid, $statuses);
        });

        // Get urgent orders (cached for 30 seconds)
        $urgentCacheKey = 'dashboard_urgent_orders';
        $urgentOrders = Cache::remember($urgentCacheKey, 30, function () {
            return $this->dashboardRepository->getUrgentOrders();
        });

        // Get recent orders (cached for 30 seconds)
        $recentCacheKey = 'dashboard_recent_orders';
        $recentOrders = Cache::remember($recentCacheKey, 30, function () {
            return $this->dashboardRepository->getRecentOrders();
        });

        // Get top customers and articles (cached for 5 minutes)
        $topCustomersCacheKey = "dashboard_top_customers_{$dateFilter}_".($customerUuid ?? 'all').'_'.($statuses ? implode(',', $statuses) : 'all');
        $topCustomers = Cache::remember($topCustomersCacheKey, 300, function () use ($dateRange, $customerUuid, $statuses) {
            return $this->dashboardRepository->getTopCustomers($dateRange, 5, $customerUuid, $statuses);
        });

        $topArticlesCacheKey = "dashboard_top_articles_{$dateFilter}_".($customerUuid ?? 'all').'_'.($statuses ? implode(',', $statuses) : 'all');
        $topArticles = Cache::remember($topArticlesCacheKey, 300, function () use ($dateRange, $customerUuid, $statuses) {
            return $this->dashboardRepository->getTopArticles($dateRange, 5, $customerUuid, $statuses);
        });

        // Get performance metrics
        $performanceCacheKey = "dashboard_performance_{$dateFilter}_".($customerUuid ?? 'all').'_'.($statuses ? implode(',', $statuses) : 'all');
        $performanceMetrics = Cache::remember($performanceCacheKey, $cacheDuration, function () use ($dateRange, $customerUuid, $statuses) {
            return $this->dashboardRepository->getPerformanceMetrics($dateRange, $customerUuid, $statuses);
        });

        // Get alerts (not cached, always fresh)
        $alerts = $this->dashboardRepository->getAlerts($customerUuid, $statuses);

        // Get comparison statistics (previous period)
        $comparisonStats = $this->dashboardRepository->getComparisonStats($dateFilter, $dateRange, $customerUuid, $statuses);

        // Get orders trend data
        $groupBy = 'day';
        if ($dateFilter === 'month') {
            $groupBy = 'day';
        } elseif ($dateFilter === 'week') {
            $groupBy = 'day';
        } else {
            $groupBy = 'day';
        }

        $ordersTrend = $this->dashboardRepository->getOrdersTrend($dateRange, $groupBy, $customerUuid, $statuses);

        // Get previous period trend for comparison
        $previousTrend = null;
        if ($dateFilter !== 'all' && $comparisonStats) {
            $previousRange = $this->getPreviousPeriodRange($dateFilter, $dateRange);
            if ($previousRange) {
                $previousTrend = $this->dashboardRepository->getOrdersTrend($previousRange, $groupBy, $customerUuid, $statuses);
            }
        }

        // Get production progress data
        $productionProgressData = $this->dashboardRepository->getProductionProgressData(10, $customerUuid, $statuses);

        // Get filter options
        $customersForFilter = $this->dashboardRepository->getCustomersForFilter();
        $orderStatusesForFilter = $this->dashboardRepository->getOrderStatusesForFilter();

        return Inertia::render('Dashboard', [
            'statistics' => $statistics,
            'urgentOrders' => $urgentOrders,
            'recentOrders' => $recentOrders,
            'topCustomers' => $topCustomers,
            'topArticles' => $topArticles,
            'performanceMetrics' => $performanceMetrics,
            'alerts' => $alerts,
            'comparisonStats' => $comparisonStats,
            'ordersTrend' => $ordersTrend,
            'previousTrend' => $previousTrend,
            'productionProgressData' => $productionProgressData,
            'dateFilter' => $dateFilter,
            'customerFilter' => $customerUuid,
            'statusFilter' => $statuses,
            'customersForFilter' => $customersForFilter,
            'orderStatusesForFilter' => $orderStatusesForFilter,
        ]);
    }

    /**
     * Get previous period date range
     */
    private function getPreviousPeriodRange(string $filter, array $currentRange): ?array
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
     * Get date range based on filter
     */
    private function getDateRange(string $filter): array
    {
        $now = now();

        return match ($filter) {
            'today' => [
                'start' => $now->copy()->startOfDay(),
                'end' => $now->copy()->endOfDay(),
            ],
            'week' => [
                'start' => $now->copy()->startOfWeek(),
                'end' => $now->copy()->endOfWeek(),
            ],
            'month' => [
                'start' => $now->copy()->startOfMonth(),
                'end' => $now->copy()->endOfMonth(),
            ],
            'custom' => [
                'start' => request()->get('start_date') ? now()->parse(request()->get('start_date'))->startOfDay() : null,
                'end' => request()->get('end_date') ? now()->parse(request()->get('end_date'))->endOfDay() : null,
            ],
            default => [
                'start' => null,
                'end' => null,
            ],
        };
    }
}
