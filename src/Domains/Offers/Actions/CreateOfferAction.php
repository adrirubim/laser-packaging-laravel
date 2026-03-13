<?php

declare(strict_types=1);

namespace Domain\Offers\Actions;

use App\Actions\Concerns\LogsActionErrors;
use App\Models\Offer;
use App\Models\OfferOperationList;
use App\Services\OfferNumberService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CreateOfferAction
{
    use LogsActionErrors;

    public function __construct(
        protected OfferNumberService $offerNumberService,
    ) {}

    /**
     * @return Offer|array
     */
    public function execute(array $validated)
    {
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

            if (empty($validated['offer_number'])) {
                $validated['offer_number'] = $this->offerNumberService->generateNext();
            }

            if (empty($validated['offer_date'])) {
                $validated['offer_date'] = now();
            }

            $operations = $validated['operations'] ?? [];
            unset($validated['operations']);

            $offer = Offer::create($validated);

            if (! empty($operations) && is_array($operations)) {
                foreach ($operations as $operation) {
                    if (! empty($operation['offeroperation_uuid']) && ! empty($operation['num_op'])) {
                        OfferOperationList::create([
                            'uuid' => Str::uuid()->toString(),
                            'offer_uuid' => $offer->uuid,
                            'offeroperation_uuid' => $operation['offeroperation_uuid'],
                            'num_op' => (float) $operation['num_op'],
                            'removed' => false,
                        ]);
                    }
                }
            }

            return $offer;
        });
    }
}
