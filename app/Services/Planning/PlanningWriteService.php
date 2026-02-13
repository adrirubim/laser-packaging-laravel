<?php

namespace App\Services\Planning;

use App\Models\ProductionPlanning;
use App\Models\ProductionPlanningSummary;
use Carbon\Carbon;

class PlanningWriteService
{
    /**
     * Guarda una celda de planificación (hora o quarto) y devuelve información básica.
     */
    public function savePlanningCell(
        string $orderUuid,
        string $lasWorkLineUuid,
        string $date,
        int $hour,
        int $minute,
        int $workers,
        string $zoomLevel = 'hour'
    ): array {
        $dateValue = Carbon::parse($date)->startOfDay();

        $planning = ProductionPlanning::query()->firstOrNew([
            'order_uuid' => $orderUuid,
            'lasworkline_uuid' => $lasWorkLineUuid,
            'date' => $dateValue->toDateString(),
        ]);

        $hours = $planning->hours ?? [];

        if ($zoomLevel === 'hour') {
            $keys = $this->hourKeys($hour);
            if ($workers <= 0) {
                foreach ($keys as $key) {
                    unset($hours[$key]);
                }
            } else {
                foreach ($keys as $key) {
                    $hours[$key] = $workers;
                }
            }
        } else {
            $key = $this->timeKey($hour, $minute);
            if ($workers <= 0) {
                unset($hours[$key]);
            } else {
                $hours[$key] = $workers;
            }
        }

        // Si no queda ninguna hora para ese día, eliminamos el registro
        if (empty($hours)) {
            if ($planning->exists) {
                $planning->delete();
            }

            return [
                'planning_id' => null,
                'hours' => [],
            ];
        }

        $planning->hours = $hours;
        $planning->save();

        return [
            'planning_id' => $planning->id,
            'hours' => $planning->hours,
        ];
    }

    /**
     * Guarda o resetea un valor de summary.
     */
    public function saveSummaryValue(
        string $summaryType,
        string $date,
        int $hour,
        int $minute,
        int $value,
        int $reset,
        string $zoomLevel = 'hour'
    ): array {
        $dateValue = Carbon::parse($date)->toDateString();

        $summary = ProductionPlanningSummary::query()->firstOrNew([
            'date' => $dateValue,
            'summary_type' => $summaryType,
        ]);

        $hours = $summary->hours ?? [];

        if ($reset === 1) {
            // Eliminamos el valor manual para esa hora/quarto
            if ($zoomLevel === 'hour') {
                foreach ($this->hourKeys($hour) as $key) {
                    unset($hours[$key]);
                }
            } else {
                $key = $this->timeKey($hour, $minute);
                unset($hours[$key]);
            }
        } else {
            if ($zoomLevel === 'hour') {
                foreach ($this->hourKeys($hour) as $key) {
                    $hours[$key] = $value;
                }
            } else {
                $key = $this->timeKey($hour, $minute);
                $hours[$key] = $value;
            }
        }

        if (empty($hours)) {
            if ($summary->exists) {
                $summary->delete();
            }

            return [
                'summary_id' => null,
                'hours' => [],
            ];
        }

        $summary->hours = $hours;
        $summary->save();

        return [
            'summary_id' => $summary->id,
            'hours' => $summary->hours,
        ];
    }

    private function timeKey(int $hour, int $minute): string
    {
        return sprintf('%d%02d', $hour, $minute);
    }

    /**
     * Devuelve las cuatro claves HHmm que representan una hora completa.
     */
    private function hourKeys(int $hour): array
    {
        return [
            $this->timeKey($hour, 0),
            $this->timeKey($hour, 15),
            $this->timeKey($hour, 30),
            $this->timeKey($hour, 45),
        ];
    }
}

