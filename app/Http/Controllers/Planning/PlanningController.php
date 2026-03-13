<?php

declare(strict_types=1);

namespace App\Http\Controllers\Planning;

use App\Http\Controllers\Controller;
use App\Http\Resources\PlanningBoardResource;
use App\Http\Resources\PlanningSummaryResource;
use App\Services\Planning\PlanningDataService;
use Domain\Planning\Actions\CalculateHoursAction;
use Domain\Planning\Actions\CheckTodayPlanningAction;
use Domain\Planning\Actions\ForceRescheduleAction;
use Domain\Planning\Actions\GetPlanningBoardAction;
use Domain\Planning\Actions\SavePlanningCellAction;
use Domain\Planning\Actions\SaveSummaryValueAction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use Throwable;

/**
 * Controlador de planificación de producción.
 *
 * Handles the Planning view and API endpoints.
 */
class PlanningController extends Controller
{
    public function __construct(
        protected PlanningDataService $dataService,
        protected GetPlanningBoardAction $planningBoardAction,
        protected SavePlanningCellAction $savePlanningCellAction,
        protected SaveSummaryValueAction $saveSummaryValueAction,
        protected CalculateHoursAction $calculateHoursAction,
        protected CheckTodayPlanningAction $checkTodayPlanningAction,
        protected ForceRescheduleAction $forceRescheduleAction,
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

            $payload = $this->planningBoardAction->getData($startDate, $endDate);

            return response()->json(
                PlanningBoardResource::make($payload)->resolve()
            );
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
            return response()->json(
                PlanningSummaryResource::make([
                    'error_code' => -1,
                    'message' => __('planning.params_invalid'),
                    'errors' => $validator->errors()->toArray(),
                ])->resolve(),
                422
            );
        }

        $data = $validator->validated();

        $result = $this->savePlanningCellAction->execute([
            'order_uuid' => $data['order_uuid'],
            'lasworkline_uuid' => $data['lasworkline_uuid'],
            'date' => $data['date'],
            'hour' => $data['hour'],
            'minute' => $data['minute'],
            'workers' => $data['workers'],
            'zoom_level' => $data['zoom_level'] ?? 'hour',
        ]);

        return response()->json(
            PlanningSummaryResource::make($result['payload'])->resolve(),
            $result['status']
        );
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
            return response()->json(
                PlanningSummaryResource::make([
                    'error_code' => -1,
                    'message' => __('planning.params_invalid'),
                    'errors' => $validator->errors()->toArray(),
                ])->resolve(),
                422
            );
        }

        $data = $validator->validated();

        $result = $this->saveSummaryValueAction->execute([
            'summary_type' => $data['summary_type'],
            'date' => $data['date'],
            'hour' => $data['hour'],
            'minute' => $data['minute'],
            'value' => $data['value'],
            'reset' => $data['reset'],
            'zoom_level' => $data['zoom_level'] ?? 'hour',
        ]);

        return response()->json(
            PlanningSummaryResource::make($result['payload'])->resolve(),
            $result['status']
        );
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
            return response()->json(
                PlanningSummaryResource::make([
                    'error_code' => -1,
                    'message' => __('planning.params_invalid'),
                    'errors' => $validator->errors()->toArray(),
                ])->resolve(),
                422
            );
        }

        $result = $this->calculateHoursAction->execute([
            'order_uuid' => $request->input('order_uuid'),
        ]);

        return response()->json(
            PlanningSummaryResource::make($result['payload'])->resolve(),
            $result['status']
        );
    }

    /**
     * POST /api/planning/check-today
     *
     * Endpoint tipo cron: verifica ordini con planning oggi e riaggiusta.
     */
    public function checkToday(Request $request)
    {
        $today = now()->toDateString();

        $result = $this->checkTodayPlanningAction->execute($today);

        return response()->json($result['payload'], $result['status']);
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
            return response()->json(
                PlanningSummaryResource::make([
                    'error_code' => -1,
                    'message' => __('planning.params_invalid'),
                    'errors' => $validator->errors()->toArray(),
                ])->resolve(),
                422
            );
        }

        $result = $this->forceRescheduleAction->execute([
            'order_uuid' => $request->input('order_uuid'),
        ]);

        return response()->json(
            PlanningSummaryResource::make($result['payload'])->resolve(),
            $result['status']
        );
    }
}
