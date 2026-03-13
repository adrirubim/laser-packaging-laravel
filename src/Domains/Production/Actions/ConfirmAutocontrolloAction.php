<?php

declare(strict_types=1);

namespace Domain\Production\Actions;

use App\Models\Order;

class ConfirmAutocontrolloAction
{
    /**
     * Marca el autocontrollo de un pedido como confirmado.
     */
    public function execute(string $orderUuid): void
    {
        $order = Order::where('uuid', $orderUuid)
            ->where('removed', false)
            ->firstOrFail();

        $order->autocontrollo = true;
        $order->save();
    }
}
