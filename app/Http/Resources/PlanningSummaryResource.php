<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PlanningSummaryResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'error_code' => $this->resource['error_code'] ?? 0,
            'message' => $this->resource['message'] ?? null,
            'errors' => $this->resource['errors'] ?? null,
            'planning_id' => $this->resource['planning_id'] ?? null,
            'summary_id' => $this->resource['summary_id'] ?? null,
            'order_uuid' => $this->resource['order_uuid'] ?? null,
            'hours_needed' => $this->resource['hours_needed'] ?? null,
            'quarters_needed' => $this->resource['quarters_needed'] ?? null,
            'result' => $this->resource['result'] ?? null,
            'date' => $this->resource['date'] ?? null,
            'orders_checked' => $this->resource['orders_checked'] ?? null,
            'orders_modified' => $this->resource['orders_modified'] ?? null,
            'details' => $this->resource['details'] ?? null,
        ];
    }
}
