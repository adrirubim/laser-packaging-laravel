<?php

declare(strict_types=1);

namespace Domain\Production\Actions;

use App\Models\Order;
use App\Models\ProductionOrderProcessing;
use App\Services\PalletCalculationService;
use Domain\Production\DTOs\PalletMovementDto;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class ProcessPalletQuantityAction
{
    public function __construct(
        protected PalletCalculationService $palletCalculationService,
    ) {}

    public function execute(PalletMovementDto $dto): JsonResponse
    {
        return DB::transaction(function () use ($dto): JsonResponse {
            $order = Order::where('uuid', $dto->orderUuid)
                ->where('removed', false)
                ->with('article')
                ->firstOrFail();

            $article = $order->article;
            if ($article === null) {
                return response()->json(['error' => __('services.pallet.order_has_no_article')], 400);
            }

            $palletQuantity = $this->palletCalculationService->getPalletQuantity($article->uuid);
            $processedQuantity = $this->palletCalculationService->getProcessedQuantity($order->uuid);

            $quantityToAdd = $palletQuantity - ((int) $processedQuantity % $palletQuantity);

            ProductionOrderProcessing::create([
                'employee_uuid' => $dto->employeeUuid,
                'order_uuid' => $order->uuid,
                'quantity' => $quantityToAdd,
                'processed_datetime' => now(),
            ]);

            $newProcessedQuantity = $processedQuantity + $quantityToAdd;
            $printUrl = null;

            if ($newProcessedQuantity % $palletQuantity === 0 && $article->pallet_sheet !== null && $article->pallet_sheet !== '') {
                $printUrl = route('api.production.foglio-pallet.print', ['uuid' => $article->pallet_sheet]);
            }

            return response()->json([
                'ok' => 1,
                'print_url' => $printUrl,
            ]);
        });
    }
}
