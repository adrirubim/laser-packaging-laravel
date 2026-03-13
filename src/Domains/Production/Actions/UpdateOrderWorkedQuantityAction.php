<?php

declare(strict_types=1);

namespace Domain\Production\Actions;

use App\Models\Order;
use App\Models\ProductionOrderProcessing;
use App\Services\Planning\PlanningReplanService;

class UpdateOrderWorkedQuantityAction
{
    public function __construct(
        protected PlanningReplanService $planningReplanService,
    ) {}

    public function execute(string $orderUuid): void
    {
        $processedQuantity = ProductionOrderProcessing::loadProcessedQuantity($orderUuid);

        $order = Order::where('uuid', $orderUuid)
            ->where('removed', false)
            ->first();

        if ($order === null) {
            return;
        }

        $order->worked_quantity = $processedQuantity;

        // Automatic status change: if status <= 2 and worked_quantity > 0, set to 3
        if ($order->status <= Order::STATUS_LANCIATO && $processedQuantity > 0) {
            $order->status = Order::STATUS_IN_AVANZAMENTO;
        }

        $order->save();

        // Mirror Pianificazione Produzione: reajustar planning al cambiar worked_quantity desde el portal
        $this->planningReplanService->adjustForWorkedQuantity($order->uuid);
    }
}
