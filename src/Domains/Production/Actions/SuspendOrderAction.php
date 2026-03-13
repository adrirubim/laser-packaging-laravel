<?php

declare(strict_types=1);

namespace Domain\Production\Actions;

use App\Enums\OrderStatus;
use App\Models\Order;

class SuspendOrderAction
{
    /**
     * Suspende un pedido marcándolo con el estado SOSPESO y una motivación.
     */
    public function execute(string $orderUuid, ?string $motivazione = null): void
    {
        $order = Order::where('uuid', $orderUuid)
            ->where('removed', false)
            ->firstOrFail();

        $order->status = OrderStatus::SOSPESO->value;
        $order->motivazione = $motivazione ?? 'Autocontrollo Non Superato';
        $order->save();
    }
}
