<?php

namespace App\Actions;

use App\Actions\Concerns\LogsActionErrors;
use App\Enums\OrderStatus;
use App\Models\Order;
use App\Services\OrderProductionNumberService;
use Illuminate\Support\Facades\DB;

class CreateOrderAction
{
    use LogsActionErrors;

    protected OrderProductionNumberService $orderProductionNumberService;

    public function __construct(OrderProductionNumberService $orderProductionNumberService)
    {
        $this->orderProductionNumberService = $orderProductionNumberService;
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
            // Convertir strings vacíos a null para campos nullable
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

            // Verificare unicità del numero di produzione prima della transazione
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

            // Si no se proporciona order_production_number, generarlo automáticamente
            if (empty($validated['order_production_number'])) {
                $validated['order_production_number'] = $this->orderProductionNumberService->generateNext();
            }

            // Estado inicial: Pianificato
            $validated['status'] = OrderStatus::PIANIFICATO->value;

            // Inicializar semáforos
            $validated['status_semaforo'] = json_encode([
                'etichette' => 0,
                'packaging' => 0,
                'prodotto' => 0,
            ]);

            // Las fechas se manejan como datetime en Laravel (el modelo tiene casts)
            // No necesitamos convertir a timestamp, Laravel lo hace automáticamente

            return Order::create($validated);
        });
    }
}
