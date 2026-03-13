<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SupplierResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'uuid' => $this->uuid,
            'code' => $this->code,
            'company_name' => $this->company_name,
            'vat_number' => $this->vat_number,
            'city' => $this->city,
            'province' => $this->province,
            'country' => $this->country,
            'removed' => (bool) $this->removed,
        ];
    }
}
