<?php

declare(strict_types=1);

namespace Domain\Planning\Actions;

use App\Models\Order;
use App\Services\Planning\PlanningReplanService;

class ForceRescheduleAction
{
    public function __construct(
        protected PlanningReplanService $replanService,
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
        $orderUuid = $data['order_uuid'];

        $order = Order::query()->where('uuid', $orderUuid)->first();

        if ($order === null) {
            return [
                'status' => 404,
                'payload' => [
                    'error_code' => -1,
                    'message' => __('planning.replan.order_not_found'),
                ],
            ];
        }

        $result = $this->replanService->autoScheduleOrder($orderUuid, true);

        if (! empty($result['error'])) {
            return [
                'status' => 422,
                'payload' => [
                    'error_code' => -1,
                    'message' => $result['message'] ?? __('planning.replan.reschedule_error'),
                    'order_uuid' => $orderUuid,
                ],
            ];
        }

        return [
            'status' => 200,
            'payload' => [
                'error_code' => 0,
                'message' => __('planning.replan_completed'),
                'order_uuid' => $orderUuid,
                'result' => $result,
            ],
        ];
    }
}
