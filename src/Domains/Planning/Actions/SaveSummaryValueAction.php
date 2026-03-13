<?php

declare(strict_types=1);

namespace Domain\Planning\Actions;

use App\Services\Planning\PlanningWriteService;

class SaveSummaryValueAction
{
    public function __construct(
        protected PlanningWriteService $writeService,
    ) {}

    /**
     * @param  array{
     *     summary_type: string,
     *     date: string,
     *     hour: int,
     *     minute: int,
     *     value: int,
     *     reset: int,
     *     zoom_level: string
     * }  $data
     * @return array{
     *     status: int,
     *     payload: array<string, mixed>
     * }
     */
    public function execute(array $data): array
    {
        $result = $this->writeService->saveSummaryValue(
            $data['summary_type'],
            $data['date'],
            $data['hour'],
            $data['minute'],
            $data['value'],
            $data['reset'],
            $data['zoom_level'],
        );

        return [
            'status' => 200,
            'payload' => [
                'error_code' => 0,
                'message' => __('planning.summary_saved'),
                'summary_id' => $result['summary_id'] ?? null,
            ],
        ];
    }
}
