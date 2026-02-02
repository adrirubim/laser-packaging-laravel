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
        // Verificare unicità numero offerta (escludendo il record attuale) prima della transazione
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
            ];

            foreach ($nullableFields as $field) {
                if (isset($validated[$field]) && $validated[$field] === '') {
                    $validated[$field] = null;
                }
            }

            $offer->update($validated);

            // Elaborare operazioni se presenti nei dati validati
            if (isset($validated['operations']) && is_array($validated['operations'])) {
                // Ottenere tutte le operazioni esistenti per questa offerta
                $existingOperations = OfferOperationList::where('offer_uuid', $offer->uuid)
                    ->where('removed', false)
                    ->get()
                    ->keyBy('offeroperation_uuid');

                // Ottenere UUID delle operazioni inviate
                $sentOperationUuids = collect($validated['operations'])
                    ->pluck('offeroperation_uuid')
                    ->filter()
                    ->toArray();

                // Rimuovere operazioni che non sono nella lista inviata
                foreach ($existingOperations as $existingOp) {
                    if (! in_array($existingOp->offeroperation_uuid, $sentOperationUuids)) {
                        $existingOp->update(['removed' => true]);
                    }
                }

                // Creare o aggiornare operazioni inviate
                foreach ($validated['operations'] as $operationData) {
                    if (empty($operationData['offeroperation_uuid']) || empty($operationData['num_op'])) {
                        continue;
                    }

                    // Cercare se esiste già un'operazione con questo offeroperation_uuid
                    $operationList = $existingOperations->get($operationData['offeroperation_uuid']);

                    if ($operationList) {
                        // Aggiornare operazione esistente
                        $operationList->update([
                            'num_op' => $operationData['num_op'],
                        ]);
                    } else {
                        // Creare nuova operazione
                        OfferOperationList::create([
                            'offer_uuid' => $offer->uuid,
                            'offeroperation_uuid' => $operationData['offeroperation_uuid'],
                            'num_op' => $operationData['num_op'],
                            'removed' => false,
                        ]);
                    }
                }
            } else {
                // Se non sono state inviate operazioni, rimuovere tutte le esistenti
                OfferOperationList::where('offer_uuid', $offer->uuid)
                    ->where('removed', false)
                    ->update(['removed' => true]);
            }

            // Invalidare cache opzioni formulari (le offerte sono in cache)
            $this->articleRepository->clearFormOptionsCache();
            // Invalidare cache ordini (gli articoli sono in cache ordini)
            $this->orderRepository->clearFormOptionsCache();
            // Invalidare cache indirizzi di spedizione per tutti gli articoli di questa offerta
            $offer->articles()->each(function ($article) {
                $this->orderRepository->clearShippingAddressesCache($article->uuid);
            });

            return $offer;
        });
    }
}
