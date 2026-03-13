<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductionOrderResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'uuid' => $this->uuid,
            'order_production_number' => $this->order_production_number,
            'number_customer_reference_order' => $this->number_customer_reference_order,
            'quantity' => $this->quantity,
            'worked_quantity' => $this->worked_quantity,
            'remain_quantity' => $this->remain_quantity ?? null,
            'status' => $this->status,
            'status_label' => $this->status_label,
            'autocontrollo' => $this->autocontrollo ? 1 : 0,
            'article' => $this->when(
                $this->article !== null,
                static fn () => OrderArticleResource::make($this->article),
            ),
            'customer' => $this->when(
                $this->article !== null && $this->article->offer !== null && $this->article->offer->customer !== null,
                static fn () => OrderCustomerResource::make($this->article->offer->customer),
            ),
            'division' => $this->when(
                $this->article !== null && $this->article->offer !== null && $this->article->offer->customerDivision !== null,
                static fn () => OrderCustomerDivisionResource::make($this->article->offer->customerDivision),
            ),
        ];
    }
}
