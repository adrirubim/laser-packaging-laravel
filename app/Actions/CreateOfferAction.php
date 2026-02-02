<?php

namespace App\Actions;

use App\Actions\Concerns\LogsActionErrors;
use App\Models\Offer;
use App\Models\OfferOperationList;
use App\Services\OfferNumberService;
use Illuminate\Support\Facades\DB;

class CreateOfferAction
{
    use LogsActionErrors;

    protected OfferNumberService $offerNumberService;

    public function __construct(OfferNumberService $offerNumberService)
    {
        $this->offerNumberService = $offerNumberService;
    }

    /**
     * Execute the action to create an offer with automatic number generation.
     *
     * @param  array  $validated  Validated data from the request
     * @return Offer|array Created offer or error response
     */
    public function execute(array $validated)
    {
        // Verificare unicità numero offerta se fornito manualmente (prima della transazione)
        if (! empty($validated['offer_number'])) {
            if ($this->offerNumberService->exists($validated['offer_number'])) {
                $this->logWarning('CreateOfferAction::execute', 'Offer number already exists', [
                    'offer_number' => $validated['offer_number'],
                ]);

                return [
                    'error' => true,
                    'field' => 'offer_number',
                    'message' => __('messages.offer_number_exists'),
                ];
            }
        }

        return DB::transaction(function () use ($validated) {
            // Convertire stringhe vuote in null per campi nullable
            $nullableFields = [
                'customerdivision_uuid',
                'validity_date',
                'activity_uuid',
                'sector_uuid',
                'seasonality_uuid',
                'type_uuid',
                'order_type_uuid',
                'lasfamily_uuid',
                'lasworkline_uuid',
                'lsresource_uuid',
                'customer_ref',
                'article_code_ref',
                'provisional_description',
                'unit_of_measure',
                'notes',
                'offer_notes',
                'ls_setup_cost',
                'ls_other_costs',
                'approval_status',
            ];

            foreach ($nullableFields as $field) {
                if (isset($validated[$field]) && $validated[$field] === '') {
                    $validated[$field] = null;
                }
            }

            // Se non si fornisce offer_number, generarlo automaticamente
            if (empty($validated['offer_number'])) {
                $validated['offer_number'] = $this->offerNumberService->generateNext();
            }

            // Si no se proporciona la fecha de la oferta, usar la fecha actual
            if (empty($validated['offer_date'])) {
                $validated['offer_date'] = now();
            }

            // Extraer operaciones del array validado
            $operations = $validated['operations'] ?? [];
            unset($validated['operations']);

            // Creare l'offerta
            $offer = Offer::create($validated);

            // Salvare le operazioni associate
            if (! empty($operations) && is_array($operations)) {
                foreach ($operations as $operation) {
                    if (! empty($operation['offeroperation_uuid']) && ! empty($operation['num_op'])) {
                        OfferOperationList::create([
                            'uuid' => \Illuminate\Support\Str::uuid()->toString(),
                            'offer_uuid' => $offer->uuid,
                            'offeroperation_uuid' => $operation['offeroperation_uuid'],
                            'num_op' => (float) $operation['num_op'], // El modelo espera decimal:5
                            'removed' => false,
                        ]);
                    }
                }
            }

            return $offer;
        });
    }
}
