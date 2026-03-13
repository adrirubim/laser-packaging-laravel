<?php

declare(strict_types=1);

namespace Domain\Planning\Actions;

use App\Models\Order;
use App\Services\Planning\PlanningReplanService;
use App\Services\Planning\PlanningWriteService;

class SavePlanningCellAction
{
    public function __construct(
        protected PlanningWriteService $writeService,
        protected PlanningReplanService $replanService,
    ) {}

    /**
     * @param  array{
     *     order_uuid: string,
     *     lasworkline_uuid: string,
     *     date: string,
     *     hour: int,
     *     minute: int,
     *     workers: int,
     *     zoom_level: string
     * }  $data
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

        $orderLineUuid = $order->article?->offer?->lasworkline_uuid;
        if ($orderLineUuid !== $data['lasworkline_uuid']) {
            return [
                'status' => 422,
                'payload' => [
                    'error_code' => -1,
                    'message' => __('planning.replan.order_not_on_line'),
                    'errors' => [
                        'lasworkline_uuid' => [__('planning.replan.order_line_mismatch')],
                    ],
                ],
            ];
        }

        $result = $this->writeService->savePlanningCell(
            $data['order_uuid'],
            $data['lasworkline_uuid'],
            $data['date'],
            $data['hour'],
            $data['minute'],
            $data['workers'],
            $data['zoom_level'],
        );

        $replanResult = $this->replanService->replanFutureAfterManualEdit($data['order_uuid']);

        return [
            'status' => 200,
            'payload' => [
                'error_code' => 0,
                'message' => __('planning.saved'),
                'planning_id' => $result['planning_id'] ?? null,
                'replan_result' => $replanResult,
            ],
        ];
    }
}
