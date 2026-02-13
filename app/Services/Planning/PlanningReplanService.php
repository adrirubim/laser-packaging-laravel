<?php

namespace App\Services\Planning;

use App\Models\Order;

class PlanningReplanService
{
    /**
     * Planificación automática muy básica para una orden.
     *
     * Por ahora solo devuelve un resultado estructurado sin modificar datos;
     * la lógica fina se puede ir acercando al legacy más adelante.
     */
    public function autoScheduleOrder(string $orderUuid, bool $force = false): array
    {
        $order = Order::query()->where('uuid', $orderUuid)->first();

        if (! $order) {
            return [
                'error' => true,
                'message' => 'Ordine non trovato',
            ];
        }

        return [
            'error' => false,
            'message' => 'Auto-scheduling non ancora implementato',
            'quarters_added' => 0,
            'quarters_removed' => 0,
        ];
    }

    /**
     * Replanificación futura después de un cambio manual.
     * Por ahora solo devuelve una estructura neutra.
     */
    public function replanFutureAfterManualEdit(string $orderUuid, ?string $dateFrom = null): array
    {
        $orderExists = Order::query()->where('uuid', $orderUuid)->exists();

        if (! $orderExists) {
            return [
                'error' => true,
                'message' => 'Ordine non trovato',
            ];
        }

        return [
            'error' => false,
            'message' => 'Replan futuro non ancora implementato',
            'quarters_added' => 0,
            'quarters_removed' => 0,
        ];
    }

    /**
     * Ajusta el planning futuro en función de la cantidad trabajada.
     * Stub compatible con legacy.
     */
    public function adjustForWorkedQuantity(string $orderUuid): array
    {
        $orderExists = Order::query()->where('uuid', $orderUuid)->exists();

        if (! $orderExists) {
            return [
                'error' => true,
                'message' => 'Ordine non trovato',
            ];
        }

        return [
            'error' => false,
            'message' => 'Adeguamento planning non ancora implementato',
            'quarters_removed' => 0,
        ];
    }
}

