<?php

namespace App\Services;

use App\Models\Order;
use Illuminate\Support\Facades\DB;

class OrderProductionNumberService
{
    /**
     * Genera el próximo número de producción en formato YYYY.NNNN
     *
     * Formato: YYYY.NNNN
     * - YYYY: Año actual
     * - NNNN: Número progresivo a 4 dígitos (0001, 0002, ...)
     *
     * @return string Número de producción generado (ej: "2025.0001")
     */
    public function generateNext(): string
    {
        return DB::transaction(function () {
            $year = date('Y');

            // Cercare tutti gli ordini dell'anno corrente e ordinarli in PHP
            // (compatible con SQLite y MySQL)
            $orders = Order::where('order_production_number', 'like', "$year.%")
                ->where('removed', false)
                ->lockForUpdate()
                ->get();

            // Calcolare prossimo numero progressivo
            $progressive = 1; // Primo ordine dell'anno
            if ($orders->isNotEmpty()) {
                $progressives = [];
                foreach ($orders as $order) {
                    if (! empty($order->order_production_number)) {
                        $last4 = substr($order->order_production_number, -4);
                        if (is_numeric($last4)) {
                            $progressives[] = (int) $last4;
                        }
                    }
                }
                if (! empty($progressives)) {
                    $progressive = max($progressives) + 1;
                }
            }

            return sprintf('%s.%04d', $year, $progressive);
        });
    }

    /**
     * Verifica si un número de producción ya existe
     *
     * @param  string  $productionNumber  Número a verificar
     * @param  int|null  $excludeOrderId  ID del orden a excluir (para updates)
     */
    public function exists(string $productionNumber, ?int $excludeOrderId = null): bool
    {
        $query = Order::where('order_production_number', $productionNumber)
            ->where('removed', false);

        if ($excludeOrderId !== null) {
            $query->where('id', '!=', $excludeOrderId);
        }

        return $query->exists();
    }
}
