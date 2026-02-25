<?php

namespace App\Actions;

use App\Actions\Concerns\LogsActionErrors;
use App\Models\Offer;
use App\Models\OfferOperationList;
use App\Repositories\ArticleRepository;
use App\Repositories\OrderRepository;
use App\Services\OfferNumberService;
use Illuminate\Support\Facades\DB;

class UpdateOfferAction
{
    use LogsActionErrors;

    protected OfferNumberService $offerNumberService;

    protected ArticleRepository $articleRepository;

    protected OrderRepository $orderRepository;

    public function __construct(
        OfferNumberService $offerNumberService,
        ArticleRepository $articleRepository,
        OrderRepository $orderRepository
    ) {
        $this->offerNumberService = $offerNumberService;
        $this->articleRepository = $articleRepository;
        $this->orderRepository = $orderRepository;
    }

    /**
     * Execute the action to update an offer with validation and cache invalidation.
     *
     * @param  Offer  $offer  Offer to update
     * @param  array  $validated  Validated data from the request
     * @return Offer|array Updated offer or error response
     */
    public function execute(Offer $offer, array $validated)
    {
        // Verify offer number uniqueness (excluding current record) before transaction
        if ($validated['offer_number'] !== $offer->offer_number) {
            if ($this->offerNumberService->exists($validated['offer_number'], $offer->id)) {
                $this->logWarning('UpdateOfferAction::execute', 'Offer number already exists', [
                    'offer_number' => $validated['offer_number'],
                    'offer_id' => $offer->id,
                ]);

                return [
                    'error' => true,
                    'field' => 'offer_number',
                    'message' => __('messages.offer_number_exists'),
                ];
            }
        }

        return DB::transaction(function () use ($validated, $offer) {
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
            ];

            foreach ($nullableFields as $field) {
                if (isset($validated[$field]) && $validated[$field] === '') {
                    $validated[$field] = null;
                }
            }

            $offer->update($validated);

            // Process operations if present in validated data
            if (isset($validated['operations']) && is_array($validated['operations'])) {
                // Get all existing operations for this offer
                $existingOperations = OfferOperationList::where('offer_uuid', $offer->uuid)
                    ->where('removed', false)
                    ->get()
                    ->keyBy('offeroperation_uuid');

                // Get UUIDs of sent operations
                $sentOperationUuids = collect($validated['operations'])
                    ->pluck('offeroperation_uuid')
                    ->filter()
                    ->toArray();

                // Remove operations not in the sent list
                foreach ($existingOperations as $existingOp) {
                    if (! in_array($existingOp->offeroperation_uuid, $sentOperationUuids)) {
                        $existingOp->update(['removed' => true]);
                    }
                }

                // Create or update sent operations
                foreach ($validated['operations'] as $operationData) {
                    if (empty($operationData['offeroperation_uuid']) || empty($operationData['num_op'])) {
                        continue;
                    }

                    // Search if operation with this offeroperation_uuid already exists
                    $operationList = $existingOperations->get($operationData['offeroperation_uuid']);

                    if ($operationList) {
                        // Update existing operation
                        $operationList->update([
                            'num_op' => $operationData['num_op'],
                        ]);
                    } else {
                        // Create new operation
                        OfferOperationList::create([
                            'offer_uuid' => $offer->uuid,
                            'offeroperation_uuid' => $operationData['offeroperation_uuid'],
                            'num_op' => $operationData['num_op'],
                            'removed' => false,
                        ]);
                    }
                }
            } else {
                // If no operations were sent, remove all existing ones
                OfferOperationList::where('offer_uuid', $offer->uuid)
                    ->where('removed', false)
                    ->update(['removed' => true]);
            }

            // Invalidate form options cache (offers are cached)
            $this->articleRepository->clearFormOptionsCache();
            // Invalidate orders cache (articles are in orders cache)
            $this->orderRepository->clearFormOptionsCache();
            // Invalidate shipping address cache for all articles of this offer
            $offer->articles()->each(function ($article) {
                $this->orderRepository->clearShippingAddressesCache($article->uuid);
            });

            return $offer;
        });
    }
}
