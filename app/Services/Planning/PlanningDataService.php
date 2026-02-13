<?php

namespace App\Services\Planning;

use App\Models\EmployeeContract;
use App\Models\OfferLasWorkLine;
use App\Models\Order;
use App\Models\ProductionPlanning;
use App\Models\ProductionPlanningSummary;
use Carbon\Carbon;

class PlanningDataService
{
    /**
     * Carga líneas LAS, órdenes, planning, contratos y summary
     * en el rango indicado y devuelve un array listo para serializar a JSON.
     */
    public function getData(string $startDate, string $endDate): array
    {
        $start = Carbon::parse($startDate)->startOfDay();
        $end = Carbon::parse($endDate)->endOfDay();

        $lines = OfferLasWorkLine::query()
            ->active()
            ->orderBy('code')
            ->get();

        // Eager load órdenes y artículos para minimizar N+1
        $ordersByLine = Order::query()
            ->active()
            ->with(['article.offer.lasWorkLine'])
            ->whereHas('article.offer.lasWorkLine', function ($q) use ($lines) {
                $q->whereIn('offerlasworkline.uuid', $lines->pluck('uuid'));
            })
            ->get()
            ->groupBy(fn (Order $order) => optional($order->article?->offer?->lasWorkLine)->uuid);

        $linesPayload = $lines->map(function (OfferLasWorkLine $line) use ($ordersByLine) {
            $orders = $ordersByLine->get($line->uuid, collect());

            return [
                'uuid' => $line->uuid,
                'code' => $line->code,
                'name' => $line->name,
                'orders' => $orders->map(function (Order $order) {
                    $article = $order->article;

                    return [
                        'uuid' => $order->uuid,
                        'code' => $order->order_production_number,
                        'article_code' => $article?->cod_article_las,
                        'description' => $article?->article_descr,
                        'delivery_requested_date' => optional($order->delivery_requested_date)?->getTimestamp(),
                        'quantity' => (float) $order->quantity,
                        'worked_quantity' => (float) $order->worked_quantity,
                        'status' => $order->status,
                        'shift_mode' => $order->shift_mode,
                        'shift_morning' => (bool) $order->shift_morning,
                        'shift_afternoon' => (bool) $order->shift_afternoon,
                        'work_saturday' => (bool) $order->work_saturday,
                    ];
                })->values()->all(),
            ];
        })->values()->all();

        $planning = ProductionPlanning::query()
            ->whereBetween('date', [$start->toDateString(), $end->toDateString()])
            ->whereIn('lasworkline_uuid', $lines->pluck('uuid'))
            ->get()
            ->map(function (ProductionPlanning $row) {
                return [
                    'id' => $row->id,
                    'order_uuid' => $row->order_uuid,
                    'lasworkline_uuid' => $row->lasworkline_uuid,
                    'date' => $row->date?->format('Y-m-d H:i:s'),
                    // El legacy serializa como JSON string; mantenemos compatibilidad
                    'hours' => json_encode($row->hours ?? [], JSON_THROW_ON_ERROR),
                ];
            })
            ->values()
            ->all();

        $contracts = EmployeeContract::query()
            ->active()
            ->with('employee')
            ->where('start_date', '<=', $end->toDateString())
            ->where(function ($q) use ($start) {
                $q->whereNull('end_date')
                    ->orWhere('end_date', '>=', $start->toDateString());
            })
            ->get()
            ->map(function (EmployeeContract $contract) {
                return [
                    'id' => $contract->id,
                    'employee_uuid' => $contract->employee_uuid,
                    'qualifica' => $contract->qualifica,
                    'start_date' => $contract->start_date?->getTimestamp(),
                    'end_date' => $contract->end_date?->getTimestamp(),
                    'employee_name' => $contract->employee?->name,
                    'employee_surname' => $contract->employee?->surname,
                ];
            })
            ->values()
            ->all();

        $summary = ProductionPlanningSummary::query()
            ->whereBetween('date', [$start->toDateString(), $end->toDateString()])
            ->get()
            ->map(function (ProductionPlanningSummary $row) {
                return [
                    'id' => $row->id,
                    'date' => $row->date?->format('Y-m-d'),
                    'summary_type' => $row->summary_type,
                    'hours' => json_encode($row->hours ?? [], JSON_THROW_ON_ERROR),
                ];
            })
            ->values()
            ->all();

        return [
            'lines' => $linesPayload,
            'planning' => $planning,
            'contracts' => $contracts,
            'summary' => $summary,
        ];
    }
}

