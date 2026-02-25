<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\ProductionOrderProcessing;
use App\Services\Planning\PlanningReplanService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductionOrderProcessingController extends Controller
{
    /**
     * Display a listing of production order processings.
     */
    public function index(Request $request): Response
    {
        $query = ProductionOrderProcessing::active()
            ->with(['employee', 'order']);

        // Filter by employee
        if ($request->has('employee_uuid') && $request->filled('employee_uuid')) {
            $query->where('employee_uuid', $request->get('employee_uuid'));
        }

        // Filter by order
        if ($request->has('order_uuid') && $request->filled('order_uuid')) {
            $query->where('order_uuid', $request->get('order_uuid'));
        }

        // Filter by date range
        if ($request->has('date_from')) {
            $dateFrom = $request->get('date_from');
            if ($dateFrom) {
                $query->whereDate('processed_datetime', '>=', $dateFrom);
            }
        }
        if ($request->has('date_to')) {
            $dateTo = $request->get('date_to');
            if ($dateTo) {
                $query->whereDate('processed_datetime', '<=', $dateTo);
            }
        }

        // Filter by minimum quantity
        if ($request->has('min_quantity') && $request->filled('min_quantity')) {
            $minQuantity = $request->get('min_quantity');
            if (is_numeric($minQuantity)) {
                $query->where('quantity', '>=', (float) $minQuantity);
            }
        }

        // Filter by maximum quantity
        if ($request->has('max_quantity') && $request->filled('max_quantity')) {
            $maxQuantity = $request->get('max_quantity');
            if (is_numeric($maxQuantity)) {
                $query->where('quantity', '<=', (float) $maxQuantity);
            }
        }

        // Search
        if ($request->has('search')) {
            $search = $request->get('search');
            $query->where(function ($q) use ($search) {
                $q->whereHas('order', function ($orderQuery) use ($search) {
                    $orderQuery->where('order_production_number', 'like', "%{$search}%")
                        ->orWhere('number_customer_reference_order', 'like', "%{$search}%");
                })
                    ->orWhereHas('employee', function ($employeeQuery) use ($search) {
                        $employeeQuery->where('name', 'like', "%{$search}%")
                            ->orWhere('surname', 'like', "%{$search}%")
                            ->orWhere('matriculation_number', 'like', "%{$search}%");
                    });
            });
        }

        // Ordinamento
        $sortBy = $request->get('sort_by', 'processed_datetime');
        $sortOrder = $request->get('sort_order', 'desc');

        $allowedSortColumns = [
            'id',
            'processed_datetime',
            'quantity',
        ];

        if (in_array($sortBy, $allowedSortColumns)) {
            $query->orderBy($sortBy, $sortOrder === 'asc' ? 'asc' : 'desc');
        } else {
            $query->orderBy('processed_datetime', 'desc');
        }

        $perPage = $request->get('per_page', 10);
        $processings = $query->paginate($perPage);

        // Ensure quantity is serialized as number
        $processings->getCollection()->transform(function ($processing) {
            if (isset($processing->quantity)) {
                $processing->quantity = is_numeric($processing->quantity)
                    ? (float) $processing->quantity
                    : null;
            }

            return $processing;
        });

        // Get filter options
        $employees = \App\Models\Employee::active()
            ->whereHas('orderProcessings', function ($query) {
                $query->where('removed', false);
            })
            ->orderBy('surname')
            ->orderBy('name')
            ->get(['uuid', 'name', 'surname', 'matriculation_number']);

        $orders = \App\Models\Order::active()
            ->whereHas('processings', function ($query) {
                $query->where('removed', false);
            })
            ->orderBy('order_production_number', 'desc')
            ->get(['uuid', 'order_production_number']);

        return Inertia::render('ProductionOrderProcessing/Index', [
            'processings' => $processings,
            'employees' => $employees,
            'orders' => $orders,
            'filters' => $request->only([
                'search',
                'per_page',
                'employee_uuid',
                'order_uuid',
                'date_from',
                'date_to',
                'min_quantity',
                'max_quantity',
                'sort_by',
                'sort_order',
            ]),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        // Get active employees
        $employees = \App\Models\Employee::active()
            ->orderBy('surname')
            ->orderBy('name')
            ->get(['uuid', 'name', 'surname', 'matriculation_number']);

        // Get active orders with article relation
        $orders = \App\Models\Order::active()
            ->with('article:id,uuid,article_descr')
            ->orderBy('order_production_number', 'desc')
            ->get(['uuid', 'order_production_number', 'article_uuid'])
            ->map(function ($order) {
                return [
                    'uuid' => $order->uuid,
                    'order_production_number' => $order->order_production_number,
                    'article_descr' => $order->article?->article_descr,
                ];
            });

        return Inertia::render('ProductionOrderProcessing/Create', [
            'employees' => $employees,
            'orders' => $orders,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'employee_uuid' => ['required', 'string', 'exists:employee,uuid'],
            'order_uuid' => ['required', 'string', 'exists:orderorder,uuid'],
            'quantity' => ['required', 'numeric', 'min:0.01'],
            'processed_datetime' => ['required', 'date'],
        ], [
            'employee_uuid.required' => __('validation.employee_required'),
            'employee_uuid.exists' => __('validation.employee_exists'),
            'order_uuid.required' => __('validation.order_required'),
            'order_uuid.exists' => __('validation.order_exists'),
            'quantity.required' => __('validation.quantity_required'),
            'quantity.numeric' => __('validation.quantity_numeric'),
            'quantity.min' => __('validation.quantity_min'),
            'processed_datetime.required' => 'La data e ora di lavorazione sono obbligatorie.',
            'processed_datetime.date' => 'La data e ora di lavorazione non sono valide.',
        ]);

        $processing = ProductionOrderProcessing::create([
            'uuid' => \Illuminate\Support\Str::uuid()->toString(),
            'employee_uuid' => $validated['employee_uuid'],
            'order_uuid' => $validated['order_uuid'],
            'quantity' => $validated['quantity'],
            'processed_datetime' => $validated['processed_datetime'],
            'removed' => false,
        ]);

        // Update order worked_quantity
        $order = \App\Models\Order::where('uuid', $validated['order_uuid'])->first();
        if ($order) {
            $totalProcessed = ProductionOrderProcessing::loadProcessedQuantity($validated['order_uuid']);
            $order->update(['worked_quantity' => $totalProcessed]);

            // Automatically adjust future planning based on worked quantity
            /** @var PlanningReplanService $replanService */
            $replanService = app(PlanningReplanService::class);
            $replanService->adjustForWorkedQuantity($order->uuid);
        }

        return redirect()->route('production-order-processing.index')
            ->with('success', __('flash.production_order_processing.created'));
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     * Mirror legacy doDelete: dopo la rimozione ricalcola worked_quantity sull'ordine e reajusta il planning.
     */
    public function destroy(ProductionOrderProcessing $productionOrderProcessing)
    {
        $orderUuid = $productionOrderProcessing->order_uuid;

        $productionOrderProcessing->update(['removed' => true]);

        $order = Order::where('uuid', $orderUuid)->where('removed', false)->first();
        if ($order) {
            $totalProcessed = ProductionOrderProcessing::loadProcessedQuantity($orderUuid);
            $order->update(['worked_quantity' => $totalProcessed]);
            app(PlanningReplanService::class)->adjustForWorkedQuantity($order->uuid);
        }

        return redirect()->route('production-order-processing.index')
            ->with('success', __('flash.production_order_processing.deleted'));
    }
}
