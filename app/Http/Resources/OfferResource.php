<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Domain\Offers\DTOs\OfferDetailsDto;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @property OfferDetailsDto $resource
 */
class OfferResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return $this->resource->offer;
    }
}
