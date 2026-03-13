<?php

declare(strict_types=1);

namespace Domain\Dashboard\Actions;

use App\Repositories\DashboardRepository;
use Carbon\CarbonInterface;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Cache;

class GetDashboardStatsAction
{
    /**
     * Cache duration in seconds.
     */
    private const CACHE_DURATION_STATS = 60;

    private const CACHE_DURATION_URGENT = 30;

    private const CACHE_DURATION_TOP = 300;

    public function __construct(
        protected DashboardRepository $dashboardRepository,
    ) {}

    /**
     * @param  array<string, mixed>  $filters
     * @return array{
     *     statistics: array<string, mixed>,
     *     urgentOrders: array<int, array<string, mixed>>,
     *     recentOrders: array<int, array<string, mixed>>,
     *     topCustomers: array<int, array<string, mixed>>,
     *     topArticles: array<int, array<string, mixed>>,
     *     performanceMetrics: array<string, mixed>,
     *     alerts: array<int, array<string, mixed>>,
     *     comparisonStats: array<string, mixed>|null,
     *     ordersTrend: array<int, array{period: string, count: int}>,
     *     previousTrend: array<int, array{period: string, count: int}>|null,
     *     productionProgressData: array<int, array<string, mixed>>,
     *     dateFilter: string,
     *     customerFilter: string|null,
     *     statusFilter: array<int, string>|null,
     *     customersForFilter: array<int, array<string, mixed>>,
     *     orderStatusesForFilter: array<int, array<string, string>>,
     *     advancementsCountToday: int
     * }
     */
    public function execute(array $filters): array
    {
        $dateFilter = is_string($filters['date_filter'] ?? null) ? $filters['date_filter'] : 'all';
        $customerUuid = is_string($filters['customer_uuid'] ?? null) ? $filters['customer_uuid'] : null;
        $statuses = $this->normalizeStatuses($filters['statuses'] ?? null);
        $userId = $this->normalizeUserId($filters['user_id'] ?? null);

        $dateRange = $this->getDateRange($dateFilter, $filters);

        $statusesKeyPart = $statuses !== null && $statuses !== []
            ? implode(',', $statuses)
            : 'all';

        $customerKeyPart = $customerUuid ?? 'all';

        // Statistics (cached)
        $statsCacheKey = "dashboard_stats_{$dateFilter}_{$customerKeyPart}_{$statusesKeyPart}";
        $statistics = Cache::remember(
            $statsCacheKey,
            self::CACHE_DURATION_STATS,
            function () use ($dateRange, $customerUuid, $statuses): array {
                return $this->dashboardRepository->getStatistics($dateRange, $customerUuid, $statuses);
            }
        );

        // Urgent orders (cached)
        $urgentCacheKey = "dashboard_urgent_orders_{$dateFilter}_{$customerKeyPart}_{$statusesKeyPart}";
        $urgentOrders = Cache::remember(
            $urgentCacheKey,
            self::CACHE_DURATION_URGENT,
            function () use ($dateRange, $customerUuid, $statuses): array {
                return $this->dashboardRepository->getUrgentOrders($dateRange, $customerUuid, $statuses);
            }
        );

        // Recent orders (cached)
        $recentCacheKey = "dashboard_recent_orders_{$dateFilter}_{$customerKeyPart}_{$statusesKeyPart}";
        $recentOrders = Cache::remember(
            $recentCacheKey,
            self::CACHE_DURATION_URGENT,
            function () use ($dateRange, $customerUuid, $statuses): array {
                return $this->dashboardRepository->getRecentOrders($dateRange, $customerUuid, $statuses);
            }
        );

        // Top customers (cached)
        $topCustomersCacheKey = "dashboard_top_customers_{$dateFilter}_{$customerKeyPart}_{$statusesKeyPart}";
        $topCustomers = Cache::remember(
            $topCustomersCacheKey,
            self::CACHE_DURATION_TOP,
            function () use ($dateRange, $customerUuid, $statuses): array {
                return $this->dashboardRepository->getTopCustomers($dateRange, 5, $customerUuid, $statuses);
            }
        );

        // Top articles (cached)
        $topArticlesCacheKey = "dashboard_top_articles_{$dateFilter}_{$customerKeyPart}_{$statusesKeyPart}";
        $topArticles = Cache::remember(
            $topArticlesCacheKey,
            self::CACHE_DURATION_TOP,
            function () use ($dateRange, $customerUuid, $statuses): array {
                return $this->dashboardRepository->getTopArticles($dateRange, 5, $customerUuid, $statuses);
            }
        );

        // Performance metrics (cached)
        $performanceCacheKey = "dashboard_performance_{$dateFilter}_{$customerKeyPart}_{$statusesKeyPart}";
        $performanceMetrics = Cache::remember(
            $performanceCacheKey,
            self::CACHE_DURATION_STATS,
            function () use ($dateRange, $customerUuid, $statuses): array {
                return $this->dashboardRepository->getPerformanceMetrics($dateRange, $customerUuid, $statuses);
            }
        );

        // Alerts (not cached: must respect user acknowledgements)
        $alerts = $this->dashboardRepository->getAlerts($dateRange, $customerUuid, $statuses, $userId);

        // Comparison statistics
        $comparisonStats = $this->dashboardRepository->getComparisonStats($dateFilter, $dateRange, $customerUuid, $statuses);

        // Orders trend (always grouped by day for now)
        $groupBy = 'day';
        $ordersTrend = $this->dashboardRepository->getOrdersTrend($dateRange, $groupBy, $customerUuid, $statuses);

        // Previous period trend
        $previousTrend = null;
        if ($dateFilter !== 'all' && $comparisonStats !== null) {
            $previousRange = $this->getPreviousPeriodRange($dateRange);
            if ($previousRange !== null) {
                $previousTrend = $this->dashboardRepository->getOrdersTrend($previousRange, $groupBy, $customerUuid, $statuses);
            }
        }

        // Production progress data
        $productionProgressData = $this->dashboardRepository->getProductionProgressData($dateRange, 10, $customerUuid, $statuses);

        // Filter options
        $customersForFilter = $this->dashboardRepository->getCustomersForFilter();
        $orderStatusesForFilter = $this->dashboardRepository->getOrderStatusesForFilter();

        // Production advancements today
        $advancementsCountToday = $this->dashboardRepository->getProductionAdvancementsCountToday($customerUuid, $statuses);

        return [
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
            'advancementsCountToday' => $advancementsCountToday,
        ];
    }

    /**
     * @param  string|array<int, string>|null  $rawStatuses
     * @return array<int, string>|null
     */
    private function normalizeStatuses(string|array|null $rawStatuses): ?array
    {
        if ($rawStatuses === null || $rawStatuses === '') {
            return null;
        }

        if (is_string($rawStatuses)) {
            $parts = array_filter(
                explode(',', $rawStatuses),
                static fn (string $value): bool => $value !== ''
            );

            return $parts === [] ? null : array_values($parts);
        }

        $filtered = array_filter(
            $rawStatuses,
            static fn ($value): bool => is_string($value) && $value !== ''
        );

        return $filtered === [] ? null : array_values($filtered);
    }

    private function normalizeUserId(mixed $value): ?int
    {
        if ($value === null) {
            return null;
        }

        if (is_int($value)) {
            return $value;
        }

        if (is_string($value) && $value !== '' && ctype_digit($value)) {
            return (int) $value;
        }

        return null;
    }

    /**
     * @param  array<string, mixed>  $filters
     * @return array{start: CarbonInterface|null, end: CarbonInterface|null}
     */
    private function getDateRange(string $filter, array $filters): array
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
                'start' => $this->parseDateFilter(Arr::get($filters, 'start_date')),
                'end' => $this->parseDateFilter(Arr::get($filters, 'end_date'), endOfDay: true),
            ],
            default => [
                'start' => null,
                'end' => null,
            ],
        };
    }

    /**
     * @param  array{start: CarbonInterface|null, end: CarbonInterface|null}  $currentRange
     * @return array{start: CarbonInterface, end: CarbonInterface}|null
     */
    private function getPreviousPeriodRange(array $currentRange): ?array
    {
        if ($currentRange['start'] === null || $currentRange['end'] === null) {
            return null;
        }

        $duration = $currentRange['start']->diffInDays($currentRange['end']);

        return [
            'start' => $currentRange['start']->copy()->subDays($duration + 1),
            'end' => $currentRange['start']->copy()->subDay(),
        ];
    }

    private function parseDateFilter(mixed $value, bool $endOfDay = false)
    {
        if (! is_string($value) || $value === '') {
            return null;
        }

        $date = now()->parse($value);

        return $endOfDay ? $date->endOfDay() : $date->startOfDay();
    }
}
