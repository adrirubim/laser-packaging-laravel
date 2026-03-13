<?php

declare(strict_types=1);

namespace Domain\Planning\Actions;

use App\Services\Planning\PlanningCalculationService;
use App\Services\Planning\PlanningDataService;
use App\Services\Planning\PlanningReplanService;
use App\Services\Planning\PlanningWriteService;
use Illuminate\Support\Facades\Validator;

class GetPlanningBoardAction
{
    public function __construct(
        protected PlanningDataService $dataService,
        protected PlanningWriteService $writeService,
        protected PlanningCalculationService $calculationService,
        protected PlanningReplanService $replanService,
    ) {}

    /**
     * Encapsula la logica principale del controller per gli endpoint JSON di planning.
     *
     * @return array<string, mixed>
     */
    public function getData(string $startDate, string $endDate): array
    {
        $payload = $this->dataService->getData($startDate, $endDate);

        return [
            'error_code' => 0,
            'lines' => $payload['lines'],
            'planning' => $payload['planning'],
            'contracts' => $payload['contracts'],
            'summary' => $payload['summary'],
        ];
    }

    /**
     * @param  array<string, mixed>  $input
     * @return array{validated: array<string, mixed>, errors: array<string, mixed>|null}
     */
    public function validateSave(array $input): array
    {
        $validator = Validator::make($input, [
            'order_uuid' => ['required', 'string'],
            'lasworkline_uuid' => ['required', 'string'],
            'date' => ['required', 'date'],
            'hour' => ['required', 'integer', 'between:0,23'],
            'minute' => ['required', 'integer', 'in:0,15,30,45'],
            'workers' => ['required', 'integer', 'min:0'],
            'zoom_level' => ['nullable', 'in:hour,quarter'],
        ]);

        if ($validator->fails()) {
            return [
                'validated' => [],
                'errors' => $validator->errors()->toArray(),
            ];
        }

        return [
            'validated' => $validator->validated(),
            'errors' => null,
        ];
    }
}
