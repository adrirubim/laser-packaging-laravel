<?php

namespace App\Services;

use App\Models\Offer;
use App\Models\OfferOperationList;

class ProductionCalculationService
{
    /**
     * Calcula el tiempo de producción y las medias basado en las operaciones de la oferta
     *
     * Fórmula:
     * 1. Para cada operación: op_total_sec = secondi_operazione * num_op
     * 2. Suma total: totalSec += op_total_sec
     * 3. Imprevistos: unexpected = totalSec * 0.05 (5%)
     * 4. Tiempo teórico total: total_theoretical_time = totalSec + unexpected
     * 5. Tiempo producción CFZ: production_time_cfz = (total_theoretical_time * 8) / 7
     * 6. Media CFZ/hora: production_average_cfz = 3600 / production_time_cfz
     * 7. Media PZ/hora: production_average_pz = production_average_cfz * piece
     *
     * @param  string  $offerUuid  UUID de la oferta
     * @return array [
     *               'total_seconds' => float,
     *               'unexpected_seconds' => float,
     *               'theoretical_time' => float,
     *               'production_time_cfz' => float,
     *               'production_average_cfz' => float,
     *               'production_average_pz' => float
     *               ]
     *
     * @throws \Exception Si la oferta no existe o no tiene operaciones
     */
    public function calculateProductionTime(string $offerUuid): array
    {
        $offer = Offer::where('uuid', $offerUuid)
            ->where('removed', false)
            ->firstOrFail();

        // Get offer operations
        $operations = OfferOperationList::where('offer_uuid', $offerUuid)
            ->where('removed', false)
            ->with('operation')
            ->get();

        if ($operations->isEmpty()) {
            throw new \Exception(__('services.production_calculation.offer_no_operations'));
        }

        $totalSec = 0;

        // Calculate total seconds per operation
        foreach ($operations as $operationList) {
            $operation = $operationList->operation;
            if (! $operation) {
                continue;
            }

            $secondiOperazione = $operation->secondi_operazione ?? 0;
            $numOp = $operationList->num_op ?? 0;

            $opTotalSec = $secondiOperazione * $numOp;
            $totalSec += $opTotalSec;
        }

        // Calcular imprevistos (5%)
        $unexpected = $totalSec * 0.05;

        // Total theoretical time
        $totalTheoreticalTime = $totalSec + $unexpected;

        // CFZ production time (8/7 adjustment)
        $productionTimeCfz = ($totalTheoreticalTime * 8) / 7;

        // CFZ average per hour
        $productionAverageCfz = 0;
        if ($productionTimeCfz > 0) {
            $productionAverageCfz = 3600 / $productionTimeCfz; // CFZ/hora
        }

        // PZ average per hour
        $piece = $offer->piece ?? 0;
        $productionAveragePz = $productionAverageCfz * $piece; // PZ/hora

        return [
            'total_seconds' => $totalSec,
            'unexpected_seconds' => $unexpected,
            'theoretical_time' => $totalTheoreticalTime,
            'production_time_cfz' => $productionTimeCfz,
            'production_average_cfz' => $productionAverageCfz,
            'production_average_pz' => $productionAveragePz,
        ];
    }
}
