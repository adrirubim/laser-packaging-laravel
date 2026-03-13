<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ArticleIPResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'code' => $this->code,
            'number' => $this->number,
            'length_cm' => $this->length_cm,
            'depth_cm' => $this->depth_cm,
            'height_cm' => $this->height_cm,
            'volume_dmc' => $this->volume_dmc,
            'plan_packaging' => $this->plan_packaging,
            'pallet_plans' => $this->pallet_plans,
            'qty_pallet' => $this->qty_pallet,
            'units_per_neck' => $this->units_per_neck,
            'units_pallet' => $this->units_pallet,
            'interlayer_every_floors' => $this->interlayer_every_floors,
            'filename' => $this->filename,
        ];
    }
}
