<?php

namespace App\Services\Planning;

use App\Models\Order;
use App\Models\ProductionOrderProcessing;

class PlanningCalculationService
{
    /**
     * Calcula horas y quarti necesarios para completar una orden.
     *
     * Devuelve un array listo para JSON, incluyendo códigos de error legacy.
     */
    public function calculateForOrder(Order $order): array
    {
        $article = $order->article;
        $offer = $article?->offer;

        $mediaRealeBase = $article?->media_reale_cfz_h_pz;
        $pezziPerConfezione = $offer?->piece ?: 1;
        $mediaReale = $mediaRealeBase !== null ? (float) $mediaRealeBase * (float) $pezziPerConfezione : null;

        $expectedWorkers = $article?->real_workers ?? $offer?->expected_workers ?? null;

        $workedQuantity = (float) (ProductionOrderProcessing::loadProcessedQuantity($order->uuid) ?: $order->worked_quantity);
        $quantity = (float) $order->quantity;
        $remainingQuantity = max(0.0, $quantity - $workedQuantity);

        if ($mediaReale === null || $mediaReale <= 0 || $expectedWorkers === null || $expectedWorkers <= 0) {
            return [
                'error_code' => -1,
                'message' => 'Dati insufficienti per il calcolo',
            ];
        }

        $hoursPerPerson = $remainingQuantity / ($mediaReale * (float) $expectedWorkers);
        $hoursNeeded = max(0.0, $hoursPerPerson);
        $quartersNeeded = (int) ceil($hoursNeeded * 4);

        return [
            'error_code' => 0,
            'order_uuid' => $order->uuid,
            'lasworkline_uuid' => $offer?->lasworkline_uuid,
            'quantity' => $quantity,
            'worked_quantity' => $workedQuantity,
            'remaining_quantity' => $remainingQuantity,
            'media_reale_pz_h_ps' => $mediaReale,
            'expected_workers' => (int) $expectedWorkers,
            'hours_needed' => $hoursNeeded,
            'quarters_needed' => $quartersNeeded,
        ];
    }
}
