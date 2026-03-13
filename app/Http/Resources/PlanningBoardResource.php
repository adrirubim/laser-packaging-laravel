<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PlanningBoardResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'error_code' => $this->resource['error_code'] ?? 0,
            'lines' => $this->resource['lines'] ?? [],
            'planning' => $this->resource['planning'] ?? [],
            'contracts' => $this->resource['contracts'] ?? [],
            'summary' => $this->resource['summary'] ?? [],
        ];
    }
}
