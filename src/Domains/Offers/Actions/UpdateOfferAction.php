<?php

declare(strict_types=1);

namespace Domain\Offers\Actions;

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

    public function __construct(
        protected OfferNumberService $offerNumberService,
        protected ArticleRepository $articleRepository,
        protected OrderRepository $orderRepository,
    ) {}

    /**
     * @return Offer|array
     */
    public function execute(Offer $offer, array $validated)
    {
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

            if (isset($validated['operations']) && is_array($validated['operations'])) {
                $existingOperations = OfferOperationList::where('offer_uuid', $offer->uuid)
                    ->where('removed', false)
                    ->get()
                    ->keyBy('offeroperation_uuid');

                $sentOperationUuids = collect($validated['operations'])
                    ->pluck('offeroperation_uuid')
                    ->filter()
                    ->toArray();

                foreach ($existingOperations as $existingOp) {
                    if (! in_array($existingOp->offeroperation_uuid, $sentOperationUuids, true)) {
                        $existingOp->update(['removed' => true]);
                    }
                }

                foreach ($validated['operations'] as $operationData) {
                    if (empty($operationData['offeroperation_uuid']) || empty($operationData['num_op'])) {
                        continue;
                    }

                    $operationList = $existingOperations->get($operationData['offeroperation_uuid']);

                    if ($operationList) {
                        $operationList->update([
                            'num_op' => $operationData['num_op'],
                        ]);
                    } else {
                        OfferOperationList::create([
                            'offer_uuid' => $offer->uuid,
                            'offeroperation_uuid' => $operationData['offeroperation_uuid'],
                            'num_op' => $operationData['num_op'],
                            'removed' => false,
                        ]);
                    }
                }
            } else {
                OfferOperationList::where('offer_uuid', $offer->uuid)
                    ->where('removed', false)
                    ->update(['removed' => true]);
            }

            $this->articleRepository->clearFormOptionsCache();
            $this->orderRepository->clearFormOptionsCache();
            $offer->articles()->each(function ($article): void {
                $this->orderRepository->clearShippingAddressesCache($article->uuid);
            });

            return $offer;
        });
    }
}
