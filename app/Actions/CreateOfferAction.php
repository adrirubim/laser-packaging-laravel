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
        // Verify offer number uniqueness if provided manually (before transaction)
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
            // Convert empty strings to null for nullable fields
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

            // If offer_number not provided, generate automatically
            if (empty($validated['offer_number'])) {
                $validated['offer_number'] = $this->offerNumberService->generateNext();
            }

            // If offer_date is not provided, use current date
            if (empty($validated['offer_date'])) {
                $validated['offer_date'] = now();
            }

            // Extract operations from validated array
            $operations = $validated['operations'] ?? [];
            unset($validated['operations']);

            // Create the offer
            $offer = Offer::create($validated);

            // Save associated operations
            if (! empty($operations) && is_array($operations)) {
                foreach ($operations as $operation) {
                    if (! empty($operation['offeroperation_uuid']) && ! empty($operation['num_op'])) {
                        OfferOperationList::create([
                            'uuid' => \Illuminate\Support\Str::uuid()->toString(),
                            'offer_uuid' => $offer->uuid,
                            'offeroperation_uuid' => $operation['offeroperation_uuid'],
                            'num_op' => (float) $operation['num_op'], // Model expects decimal:5
                            'removed' => false,
                        ]);
                    }
                }
            }

            return $offer;
        });
    }
}
