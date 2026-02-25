<?php

namespace App\Actions;

use App\Actions\Concerns\LogsActionErrors;
use App\Enums\OrderStatus;
use App\Models\Order;
use App\Services\OrderProductionNumberService;
use Illuminate\Support\Facades\DB;

class UpdateOrderAction
{
    use LogsActionErrors;

    protected OrderProductionNumberService $orderProductionNumberService;

    public function __construct(OrderProductionNumberService $orderProductionNumberService)
    {
        $this->orderProductionNumberService = $orderProductionNumberService;
    }

    /**
     * Execute the action to update an order with automatic status management.
     *
     * @param  Order  $order  Order to update
     * @param  array  $validated  Validated data from the request
     * @return Order|array Updated order or error response
     */
    public function execute(Order $order, array $validated)
    {
        // Verify production number uniqueness (excluding current record) before transaction
        if ($validated['order_production_number'] !== $order->order_production_number) {
            if ($this->orderProductionNumberService->exists($validated['order_production_number'], $order->id)) {
                $this->logWarning('UpdateOrderAction::execute', 'Production number already exists', [
                    'order_production_number' => $validated['order_production_number'],
                    'order_id' => $order->id,
                ]);

                return [
                    'error' => true,
                    'field' => 'order_production_number',
                    'message' => __('messages.production_number_exists'),
                ];
            }
        }

        return DB::transaction(function () use ($validated, $order) {
            // Las fechas se manejan como datetime en Laravel (el modelo tiene casts)
            // Laravel converte automaticamente stringhe in Carbon/datetime

            // Convert empty strings to null for nullable fields
            foreach (['customershippingaddress_uuid', 'number_customer_reference_order', 'lot', 'indications_for_shop', 'indications_for_production', 'indications_for_delivery'] as $field) {
                if (isset($validated[$field]) && $validated[$field] === '') {
                    $validated[$field] = null;
                }
            }

            // Gestione automatica dello stato in base alla worked_quantity
            // If worked quantity increases vs current value and
            // status is still up to LANCIATO (0,1,2), switch to IN_AVANZAMENTO (3)
            if (array_key_exists('worked_quantity', $validated)) {
                $previousWorkedQuantity = (float) ($order->worked_quantity ?? 0);
                $newWorkedQuantity = (float) $validated['worked_quantity'];

                if (
                    $newWorkedQuantity > $previousWorkedQuantity &&
                    $order->status <= OrderStatus::LANCIATO->value &&
                    ! array_key_exists('status', $validated)
                ) {
                    $validated['status'] = OrderStatus::IN_AVANZAMENTO->value;
                }
            }

            $order->update($validated);

            return $order;
        });
    }
}
