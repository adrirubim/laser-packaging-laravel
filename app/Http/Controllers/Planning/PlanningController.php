<?php

namespace App\Http\Controllers\Planning;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\ProductionPlanning;
use App\Services\Planning\PlanningCalculationService;
use App\Services\Planning\PlanningDataService;
use App\Services\Planning\PlanningReplanService;
use App\Services\Planning\PlanningWriteService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use Throwable;

/**
 * Controlador de planificación de producción.
 *
 * De momento solo define la firma de los endpoints; la lógica se implementará
 * siguiendo los documentos de `docs/planning/`.
 */
class PlanningController extends Controller
{
    public function __construct(
        protected PlanningDataService $dataService,
        protected PlanningWriteService $writeService,
        protected PlanningCalculationService $calculationService,
        protected PlanningReplanService $replanService
    ) {}

    /**
     * GET /planning (Inertia)
     *
     * Página principal de planificación (vista moderna con grilla por slot).
     */
    public function index()
    {
        return Inertia::render('Planning/Index', [
            'today' => now()->toDateString(),
        ]);
    }

    /**
     * GET /api/planning/data
     *
     * Carga lineas LAS, órdenes, planning, contratos y summary para el rango solicitado.
     */
    public function data(Request $request)
    {
        try {
            $startDate = $request->input('start_date', now()->startOfWeek()->format('Y-m-d 00:00:00'));
            $endDate = $request->input('end_date', now()->endOfWeek()->format('Y-m-d 23:59:59'));

            $payload = $this->dataService->getData($startDate, $endDate);

            return response()->json([
                'error_code' => 0,
                'lines' => $payload['lines'],
                'planning' => $payload['planning'],
                'contracts' => $payload['contracts'],
                'summary' => $payload['summary'],
            ]);
        } catch (Throwable $e) {
            Log::error('Planning data error: '.$e->getMessage(), [
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'error_code' => -1,
                'message' => config('app.debug')
                    ? $e->getMessage().' ('.$e->getFile().':'.$e->getLine().')'
                    : __('planning.load_error'),
            ], 500);
        }
    }

    /**
     * POST /api/planning/save
     *
     * Guarda o actualiza planning para una celda concreta (hora/quarto).
     * Verifica que el orden pertenezca a la línea; ejecuta replan tras el guardado.
     */
    public function save(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'order_uuid' => ['required', 'string'],
            'lasworkline_uuid' => ['required', 'string'],
            'date' => ['required', 'date'],
            'hour' => ['required', 'integer', 'between:0,23'],
            'minute' => ['required', 'integer', 'in:0,15,30,45'],
            'workers' => ['required', 'integer', 'min:0'],
            'zoom_level' => ['nullable', 'in:hour,quarter'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error_code' => -1,
                'message' => __('planning.params_invalid'),
                'errors' => $validator->errors()->toArray(),
            ], 422);
        }

        $data = $validator->validated();

        // Verify order exists and belongs to the indicated line
        $order = Order::query()
            ->with(['article.offer'])
            ->where('uuid', $data['order_uuid'])
            ->first();

        if (! $order) {
            return response()->json([
                'error_code' => -1,
                'message' => __('planning.replan.order_not_found'),
            ], 404);
        }

        $orderLineUuid = $order->article?->offer?->lasworkline_uuid ?? null;
        if ($orderLineUuid !== $data['lasworkline_uuid']) {
            return response()->json([
                'error_code' => -1,
                'message' => __('planning.replan.order_not_on_line'),
                'errors' => ['lasworkline_uuid' => [__('planning.replan.order_line_mismatch')]],
            ], 422);
        }

        $result = $this->writeService->savePlanningCell(
            $data['order_uuid'],
            $data['lasworkline_uuid'],
            $data['date'],
            $data['hour'],
            $data['minute'],
            $data['workers'],
            $data['zoom_level'] ?? 'hour'
        );

        // Dopo savePlanning, ripianifica il futuro in base a remainingQty/ore necessarie.
        // This can add or remove slots beyond the just-saved cell.
        $replanResult = $this->replanService->replanFutureAfterManualEdit($data['order_uuid']);

        return response()->json([
            'error_code' => 0,
            'message' => __('planning.saved'),
            'planning_id' => $result['planning_id'],
            'replan_result' => $replanResult,
        ]);
    }

    /**
     * POST /api/planning/summary
     *
     * Guarda o resetea un valor de summary (ASSENZE / CAPOREPARTO / MAGAZZINIERI).
     */
    public function saveSummary(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'summary_type' => ['required', 'string'],
            'date' => ['required', 'date'],
            'hour' => ['required', 'integer', 'between:0,23'],
            'minute' => ['required', 'integer', 'in:0,15,30,45'],
            'value' => ['required', 'integer'],
            'reset' => ['required', 'integer', 'in:0,1'],
            'zoom_level' => ['nullable', 'in:hour,quarter'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error_code' => -1,
                'message' => __('planning.params_invalid'),
                'errors' => $validator->errors()->toArray(),
            ], 422);
        }

        $data = $validator->validated();

        $result = $this->writeService->saveSummaryValue(
            $data['summary_type'],
            $data['date'],
            $data['hour'],
            $data['minute'],
            $data['value'],
            $data['reset'],
            $data['zoom_level'] ?? 'hour'
        );

        return response()->json([
            'error_code' => 0,
            'message' => __('planning.summary_saved'),
            'summary_id' => $result['summary_id'],
        ]);
    }

    /**
     * POST /api/planning/calculate-hours
     *
     * Calcula las horas necesarias para completar un orden.
     */
    public function calculateHours(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'order_uuid' => ['required', 'string'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error_code' => -1,
                'message' => __('planning.params_invalid'),
                'errors' => $validator->errors()->toArray(),
            ], 422);
        }

        $order = Order::query()
            ->with(['article.offer'])
            ->where('uuid', $request->input('order_uuid'))
            ->first();

        if (! $order) {
            return response()->json([
                'error_code' => -1,
                'message' => __('planning.replan.order_not_found'),
            ], 404);
        }

        $result = $this->calculationService->calculateForOrder($order);

        return response()->json($result);
    }

    /**
     * POST /api/planning/check-today
     *
     * Endpoint tipo cron: verifica ordini con planning oggi e riaggiusta.
     */
    public function checkToday(Request $request)
    {
        $today = now()->toDateString();

        $orderUuids = ProductionPlanning::query()
            ->whereDate('date', '=', $today)
            ->distinct()
            ->pluck('order_uuid');

        $orders = Order::query()
            ->active()
            ->whereIn('uuid', $orderUuids)
            ->get();

        $details = [];
        $modified = 0;

        foreach ($orders as $order) {
            $result = $this->replanService->replanFutureAfterManualEdit($order->uuid);

            $hasReplanChanges = ($result['quarters_added'] ?? 0) > 0 || ($result['quarters_removed'] ?? 0) > 0;
            if ($hasReplanChanges) {
                $modified++;
            }

            $details[] = [
                'order_uuid' => $order->uuid,
                'result' => $result,
            ];
        }

        return response()->json([
            'error_code' => 0,
            'message' => __('planning.check_completed', ['checked' => $orders->count(), 'modified' => $modified]),
            'date' => $today,
            'orders_checked' => $orders->count(),
            'orders_modified' => $modified,
            'details' => $details,
        ]);
    }

    /**
     * POST /api/planning/force-reschedule
     *
     * Force re-schedule of an order.
     */
    public function forceReschedule(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'order_uuid' => ['required', 'string', 'uuid'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error_code' => -1,
                'message' => __('planning.params_invalid'),
                'errors' => $validator->errors()->toArray(),
            ], 422);
        }

        $orderUuid = $request->input('order_uuid');
        $order = Order::query()->where('uuid', $orderUuid)->first();

        if (! $order) {
            return response()->json([
                'error_code' => -1,
                'message' => __('planning.replan.order_not_found'),
            ], 404);
        }

        $result = $this->replanService->autoScheduleOrder($orderUuid, true);

        if (! empty($result['error'])) {
            return response()->json([
                'error_code' => -1,
                'message' => $result['message'] ?? __('planning.replan.reschedule_error'),
                'order_uuid' => $orderUuid,
            ], 422);
        }

        return response()->json([
            'error_code' => 0,
            'message' => __('planning.replan_completed'),
            'order_uuid' => $orderUuid,
            'result' => $result,
        ]);
    }
}
