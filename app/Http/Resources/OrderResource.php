<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'order_production_number' => $this->order_production_number,
            'number_customer_reference_order' => $this->number_customer_reference_order,
            'line' => $this->line,
            'quantity' => $this->quantity,
            'worked_quantity' => $this->worked_quantity,
            'remain_quantity' => $this->remain_quantity ?? null,
            'delivery_requested_date' => $this->delivery_requested_date,
            'status' => $this->status,
            'status_label' => $this->status_label,
            'status_semaforo' => $this->status_semaforo,
            'autocontrollo' => $this->autocontrollo,
            'article' => $this->when(
                $this->article !== null,
                fn () => OrderArticleResource::make($this->article),
            ),
            'customer' => $this->when(
                $this->article !== null && $this->article->offer !== null && $this->article->offer->customer !== null,
                fn () => OrderCustomerResource::make($this->article->offer->customer),
            ),
            'division' => $this->when(
                $this->article !== null && $this->article->offer !== null && $this->article->offer->customerDivision !== null,
                fn () => OrderCustomerDivisionResource::make($this->article->offer->customerDivision),
            ),
            'shipping_address' => $this->when(
                $this->shippingAddress !== null,
                fn () => OrderShippingAddressResource::make($this->shippingAddress),
            ),
        ];
    }
}
