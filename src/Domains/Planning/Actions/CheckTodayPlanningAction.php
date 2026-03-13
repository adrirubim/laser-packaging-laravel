<?php

declare(strict_types=1);

namespace Domain\Planning\Actions;

use App\Models\Order;
use App\Models\ProductionPlanning;
use App\Services\Planning\PlanningReplanService;

class CheckTodayPlanningAction
{
    public function __construct(
        protected PlanningReplanService $replanService,
    ) {}

    /**
     * @return array{
     *     status: int,
     *     payload: array<string, mixed>
     * }
     */
    public function execute(string $date): array
    {
        $orderUuids = ProductionPlanning::query()
            ->whereDate('date', '=', $date)
            ->distinct()
            ->pluck('order_uuid');

        $orders = Order::query()
            ->active()
            ->whereIn('uuid', $orderUuids)
            ->get();

        $details = [];
        $modified = 0;

        foreach ($orders as $order) {
            $result = $this->replanService->replanFutureAfterManualEdit($order->uuid);

            $hasReplanChanges = ($result['quarters_added'] ?? 0) > 0
                || ($result['quarters_removed'] ?? 0) > 0;

            if ($hasReplanChanges) {
                $modified++;
            }

            $details[] = [
                'order_uuid' => $order->uuid,
                'result' => $result,
            ];
        }

        return [
            'status' => 200,
            'payload' => [
                'error_code' => 0,
                'message' => __('planning.check_completed', [
                    'checked' => $orders->count(),
                    'modified' => $modified,
                ]),
                'date' => $date,
                'orders_checked' => $orders->count(),
                'orders_modified' => $modified,
                'details' => $details,
            ],
        ];
    }
}
