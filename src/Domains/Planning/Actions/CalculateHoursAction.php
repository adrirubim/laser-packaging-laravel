<?php

declare(strict_types=1);

namespace Domain\Planning\Actions;

use App\Models\Order;
use App\Services\Planning\PlanningCalculationService;

class CalculateHoursAction
{
    public function __construct(
        protected PlanningCalculationService $calculationService,
    ) {}

    /**
     * @param  array{order_uuid: string}  $data
     * @return array{
     *     status: int,
     *     payload: array<string, mixed>
     * }
     */
    public function execute(array $data): array
    {
        $order = Order::query()
            ->with(['article.offer'])
            ->where('uuid', $data['order_uuid'])
            ->first();

        if ($order === null) {
            return [
                'status' => 404,
                'payload' => [
                    'error_code' => -1,
                    'message' => __('planning.replan.order_not_found'),
                ],
            ];
        }

        $result = $this->calculationService->calculateForOrder($order);

        return [
            'status' => 200,
            'payload' => array_merge(
                [
                    'error_code' => 0,
                    'order_uuid' => $order->uuid,
                ],
                $result,
            ),
        ];
    }
}
