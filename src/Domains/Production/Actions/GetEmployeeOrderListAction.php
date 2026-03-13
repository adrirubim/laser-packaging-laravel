<?php

declare(strict_types=1);

namespace Domain\Production\Actions;

use App\Enums\OrderStatus;
use App\Models\Order;

class GetEmployeeOrderListAction
{
    /**
     * Devuelve la lista de pedidos en estados LANCIATO / IN_AVANZAMENTO,
     * con los mismos campos que usaba el portal legacy.
     *
     * @return array<int, array<string, mixed>>
     */
    public function execute(): array
    {
        $orders = Order::whereIn('status', [OrderStatus::LANCIATO->value, OrderStatus::IN_AVANZAMENTO->value])
            ->where('removed', false)
            ->with([
                'article.offer.customer',
                'article.offer.customerDivision',
                'shippingAddress',
            ])
            ->get();

        return $orders->map(function (Order $order): array {
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
                ] : null,
            ];
        })->all();
    }
}
