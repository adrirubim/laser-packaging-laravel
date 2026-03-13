<?php

declare(strict_types=1);

namespace App\Http\Resources\Offers;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OfferIndexResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'offer_number' => $this->offer_number,
            'offer_date' => $this->offer_date?->toDateString(),
            'validity_date' => $this->validity_date?->toDateString(),
            'approval_status' => $this->approval_status,
            'approval_status_label' => $this->approval_status_label,
            'description' => $this->provisional_description,
            'piece' => $this->piece,
            'unit_of_measure' => $this->unit_of_measure,
            'customer' => $this->whenLoaded('customer', function () {
                $customer = $this->customer;

                if ($customer === null) {
                    return null;
                }

                return [
                    'uuid' => $customer->uuid,
                    'company_name' => $customer->company_name,
                ];
            }),
        ];
    }
}
