<?php

declare(strict_types=1);

namespace Domain\Production\Actions;

use App\Models\Order;
use App\Models\ProductionOrderProcessing;
use App\Services\PalletCalculationService;
use Illuminate\Support\Facades\DB;

class RegisterManualQuantityAction
{
    public function __construct(
        protected PalletCalculationService $palletCalculationService,
        protected UpdateOrderWorkedQuantityAction $updateOrderWorkedQuantityAction,
        protected GenerateFoglioPalletPrintUrlAction $generateFoglioPalletPrintUrlAction,
    ) {}

    /**
     * Registra una cantidad manual procesada para un pedido y devuelve información adicional.
     *
     * @return array{
     *     success: bool,
     *     status: int,
     *     message: string|null,
     *     data: array<string, mixed>|null
     * }
     */
    public function execute(string $orderUuid, string $employeeUuid, float $quantity): array
    {
        return DB::transaction(function () use ($orderUuid, $employeeUuid, $quantity): array {
            $order = Order::where('uuid', $orderUuid)
                ->where('removed', false)
                ->with('article')
                ->firstOrFail();

            // Calculate quantity to complete pallet
            $quantityToFinishPallet = $this->palletCalculationService->getQuantityToFinishPallet($order->uuid);

            ProductionOrderProcessing::create([
                'employee_uuid' => $employeeUuid,
                'order_uuid' => $order->uuid,
                'quantity' => $quantity,
                'processed_datetime' => now(),
            ]);

            $this->updateOrderWorkedQuantityAction->execute($order->uuid);

            $printUrl = null;
            if (
                $quantity >= $quantityToFinishPallet
                && $order->article !== null
                && $order->article->pallet_sheet !== null
                && $order->article->pallet_sheet !== ''
            ) {
                $printUrl = $this->generateFoglioPalletPrintUrlAction->execute($order->article->pallet_sheet);
            }

            return [
                'success' => true,
                'status' => 200,
                'message' => null,
                'data' => [
                    'print_url' => $printUrl,
                ],
            ];
        });
    }
}
