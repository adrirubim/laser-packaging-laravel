<?php

namespace App\Actions;

use App\Actions\Concerns\LogsActionErrors;
use App\Enums\OrderStatus;
use App\Models\Order;
use App\Services\OrderProductionNumberService;
use App\Services\Planning\PlanningReplanService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CreateOrderAction
{
    use LogsActionErrors;

    protected OrderProductionNumberService $orderProductionNumberService;

    protected PlanningReplanService $planningReplanService;

    public function __construct(
        OrderProductionNumberService $orderProductionNumberService,
        PlanningReplanService $planningReplanService
    ) {
        $this->orderProductionNumberService = $orderProductionNumberService;
        $this->planningReplanService = $planningReplanService;
    }

    /**
     * Execute the action to create an order with initial status and semaphores.
     *
     * @param  array  $validated  Validated data from the request
     * @return Order|array Created order or error response
     */
    public function execute(array $validated)
    {
        return DB::transaction(function () use ($validated) {
            // Convert empty strings to null for nullable fields
            $nullableFields = [
                'customershippingaddress_uuid',
                'number_customer_reference_order',
                'lot',
                'indications_for_shop',
                'indications_for_production',
                'indications_for_delivery',
                'delivery_requested_date',
                'expected_production_start_date',
                'expiration_date',
            ];

            foreach ($nullableFields as $field) {
                if (isset($validated[$field]) && $validated[$field] === '') {
                    $validated[$field] = null;
                }
            }

            // Verify production number uniqueness before transaction
            if (! empty($validated['order_production_number'])) {
                if ($this->orderProductionNumberService->exists($validated['order_production_number'])) {
                    $this->logWarning('CreateOrderAction::execute', 'Production number already exists', [
                        'order_production_number' => $validated['order_production_number'],
                    ]);

                    return [
                        'error' => true,
                        'field' => 'order_production_number',
                        'message' => __('messages.production_number_exists'),
                    ];
                }
            }

            // If order_production_number not provided, generate automatically
            if (empty($validated['order_production_number'])) {
                $validated['order_production_number'] = $this->orderProductionNumberService->generateNext();
            }

            // Estado inicial: Pianificato
            $validated['status'] = OrderStatus::PIANIFICATO->value;

            // Initialize semaphores
            $validated['status_semaforo'] = json_encode([
                'etichette' => 0,
                'packaging' => 0,
                'prodotto' => 0,
            ]);

            // Dates are handled as datetime in Laravel (model has casts)
            // No need to convert to timestamp, Laravel does it automatically

            $order = Order::create($validated);

            // Mirror legacy: auto-schedule planning for new orders with LAS line
            $order->load(['article.offer']);
            if ($order->article?->offer?->lasworkline_uuid) {
                try {
                    $this->planningReplanService->autoScheduleOrder($order->uuid, true);
                } catch (\Throwable $e) {
                    Log::warning('CreateOrderAction: autoScheduleOrder failed', [
                        'order_uuid' => $order->uuid,
                        'message' => $e->getMessage(),
                    ]);
                }
            }

            return $order;
        });
    }
}
