<?php

declare(strict_types=1);

namespace Domain\Production\Actions;

use App\Models\Order;

class GetProductionOrderInfoAction
{
    /**
     * Devuelve la información completa de un pedido de producción
     * en el formato esperado por el portal legacy.
     *
     * @return array<string, mixed>
     */
    public function execute(string $orderUuid): array
    {
        $order = Order::where('uuid', $orderUuid)
            ->where('removed', false)
            ->with([
                'article.offer.lasWorkLine',
                'article.palletType',
                'article.offer.customer',
                'article.offer.customerDivision',
                'shippingAddress',
            ])
            ->firstOrFail();

        $remainQuantity = $order->quantity - $order->worked_quantity;

        return [
            'uuid' => $order->uuid,
            'order_production_number' => $order->order_production_number,
            'number_customer_reference_order' => $order->number_customer_reference_order,
            'quantity' => $order->quantity,
            'worked_quantity' => $order->worked_quantity,
            'remain_quantity' => $remainQuantity,
            'status' => $order->status,
            'status_label' => $order->status_label,
            'autocontrollo' => $order->autocontrollo ? 1 : 0,
            'article' => $order->article ? [
                'uuid' => $order->article->uuid,
                'cod_article_las' => $order->article->cod_article_las,
                'article_descr' => $order->article->article_descr,
                'plan_packaging' => $order->article->plan_packaging,
                'pallet_plans' => $order->article->pallet_plans,
            ] : null,
            'offer' => $order->article && $order->article->offer ? [
                'uuid' => $order->article->offer->uuid,
                'offer_number' => $order->article->offer->offer_number,
            ] : null,
            'las_work_line' => $order->article && $order->article->offer && $order->article->offer->lasWorkLine ? [
                'uuid' => $order->article->offer->lasWorkLine->uuid,
                'code' => $order->article->offer->lasWorkLine->code,
                'name' => $order->article->offer->lasWorkLine->name,
            ] : null,
            'pallet_type' => $order->article && $order->article->palletType ? [
                'uuid' => $order->article->palletType->uuid,
                'cod' => $order->article->palletType->cod,
                'description' => $order->article->palletType->description,
            ] : null,
            'customer' => $order->article && $order->article->offer && $order->article->offer->customer ? [
                'uuid' => $order->article->offer->customer->uuid,
                'company_name' => $order->article->offer->customer->company_name,
            ] : null,
            'division' => $order->article && $order->article->offer && $order->article->offer->customerDivision ? [
                'uuid' => $order->article->offer->customerDivision->uuid,
                'name' => $order->article->offer->customerDivision->name,
            ] : null,
            'shipping_address' => $order->shippingAddress ? [
                'uuid' => $order->shippingAddress->uuid,
                'street' => $order->shippingAddress->street,
                'city' => $order->shippingAddress->city,
                'postal_code' => $order->shippingAddress->postal_code,
            ] : null,
        ];
    }
}
