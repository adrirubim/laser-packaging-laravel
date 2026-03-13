<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @extends JsonResource<array<string, mixed>>
 */
class DashboardResource extends JsonResource
{
    /**
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
    public function toArray(Request $request): array
    {
        /** @var array<string, mixed> $data */
        $data = parent::toArray($request);

        return $data;
    }
}
