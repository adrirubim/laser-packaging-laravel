<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreOfferRequest;
use App\Http\Requests\UpdateOfferRequest;
use App\Http\Resources\Api\ApiResponseResource;
use App\Http\Resources\OfferResource;
use App\Http\Resources\Offers\OfferIndexResource;
use App\Models\Customer;
use App\Models\CustomerDivision;
use App\Models\Offer;
use App\Repositories\ArticleRepository;
use App\Repositories\OfferRepository;
use App\Repositories\OrderRepository;
use App\Services\OfferNumberService;
use Domain\Offers\Actions\CreateOfferAction;
use Domain\Offers\Actions\GenerateOfferPdfAction;
use Domain\Offers\Actions\GetDivisionsForCustomerAction;
use Domain\Offers\Actions\GetOfferDetailsAction;
use Domain\Offers\Actions\UpdateOfferAction;
use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class OfferController extends Controller
{
    protected OfferNumberService $offerNumberService;

    protected ArticleRepository $articleRepository;

    protected OfferRepository $offerRepository;

    protected OrderRepository $orderRepository;

    protected CreateOfferAction $createOfferAction;

    protected UpdateOfferAction $updateOfferAction;

    protected GetOfferDetailsAction $getOfferDetailsAction;

    protected GenerateOfferPdfAction $generateOfferPdfAction;

    protected GetDivisionsForCustomerAction $getDivisionsForCustomerAction;

    public function __construct(
        OfferNumberService $offerNumberService,
        ArticleRepository $articleRepository,
        OfferRepository $offerRepository,
        OrderRepository $orderRepository,
        CreateOfferAction $createOfferAction,
        UpdateOfferAction $updateOfferAction,
        GetOfferDetailsAction $getOfferDetailsAction,
        GenerateOfferPdfAction $generateOfferPdfAction,
        GetDivisionsForCustomerAction $getDivisionsForCustomerAction,
    ) {
        $this->offerNumberService = $offerNumberService;
        $this->articleRepository = $articleRepository;
        $this->offerRepository = $offerRepository;
        $this->orderRepository = $orderRepository;
        $this->createOfferAction = $createOfferAction;
        $this->updateOfferAction = $updateOfferAction;
        $this->getOfferDetailsAction = $getOfferDetailsAction;
        $this->generateOfferPdfAction = $generateOfferPdfAction;
        $this->getDivisionsForCustomerAction = $getDivisionsForCustomerAction;
    }

    /**
     * Mostra l'elenco delle offerte.
     */
    public function index(Request $request): Response
    {
        $query = Offer::active()->with(['customer', 'customerDivision']);

        // Filtri
        if ($request->has('customer_uuid')) {
            $query->where('customer_uuid', $request->get('customer_uuid'));
        }

        if ($request->has('customerdivision_uuid')) {
            $query->where('customerdivision_uuid', $request->get('customerdivision_uuid'));
        }

        // Cerca
        if ($request->has('search')) {
            $search = $request->get('search');
            $query->where(function ($q) use ($search) {
                $q->where('offer_number', 'like', "%{$search}%")
                    ->orWhere('provisional_description', 'like', "%{$search}%")
                    ->orWhere('notes', 'like', "%{$search}%");
            });
        }

        // Ordinamento
        $sortBy = $request->get('sort_by', 'offer_number');
        $sortOrder = $request->get('sort_order', 'desc');

        $allowedSortColumns = ['offer_number', 'offer_date', 'validity_date', 'approval_status'];
        if (in_array($sortBy, $allowedSortColumns)) {
            $query->orderBy($sortBy, $sortOrder);
        } else {
            $query->orderBy('offer_number', 'desc');
        }

        $offers = $query->paginate($request->get('per_page', 15));

        // Ensure approval_status_label accessor is included
        $offers->getCollection()->transform(function ($offer) {
            $offer->append('approval_status_label');

            return $offer;
        });

        $offersArray = $offers->toArray();
        $offersArray['data'] = OfferIndexResource::collection($offers)->resolve();

        $customers = Customer::active()->orderBy('company_name')->get(['uuid', 'code', 'company_name']);

        return Inertia::render('Offers/Index', [
            'offers' => $offersArray,
            'customers' => $customers->map(
                static fn ($customer) => [
                    'uuid' => $customer->uuid,
                    'code' => $customer->code,
                    'company_name' => $customer->company_name,
                ],
            ),
            'filters' => $request->only(['search', 'customer_uuid', 'customerdivision_uuid', 'sort_by', 'sort_order']),
        ]);
    }

    /**
     * Mostra il modulo per creare una nuova offerta.
     */
    public function create(Request $request): Response
    {
        $customers = Customer::active()->orderBy('company_name')->get(['uuid', 'code', 'company_name']);
        $divisions = [];

        // Get form options from repository (cached)
        $formOptions = $this->offerRepository->getFormOptions();

        // If duplicate_from exists, load data from original offer
        $sourceOffer = null;
        if ($request->has('duplicate_from')) {
            try {
                $sourceOffer = Offer::where('uuid', $request->get('duplicate_from'))
                    ->where('removed', false)
                    ->with([
                        'customer',
                        'customerDivision',
                        'activity',
                        'sector',
                        'seasonality',
                        'orderType',
                        'lasFamily',
                        'lasWorkLine',
                        'lsResource',
                        'operationLists.operation.category',
                    ])
                    ->firstOrFail();

                // Load divisions of the original offer's customer
                if ($sourceOffer->customer_uuid) {
                    $divisions = CustomerDivision::where('customer_uuid', $sourceOffer->customer_uuid)
                        ->where('removed', false)
                        ->orderBy('name')
                        ->get(['uuid', 'name']);
                }
            } catch (\Exception $e) {
                Log::warning('Errore nel caricamento offerta per duplicazione: '.$e->getMessage());
                // Continuare senza dati di duplicazione in caso di errore
            }
        } else {
            // If not duplication, load divisions based on customer_uuid if present
            if ($request->has('customer_uuid')) {
                $divisions = CustomerDivision::where('customer_uuid', $request->get('customer_uuid'))
                    ->where('removed', false)
                    ->orderBy('name')
                    ->get(['uuid', 'name']);
            }
        }

        // Generate offer number automatically (only if not duplication)
        $offerNumber = $sourceOffer ? $sourceOffer->offer_number : $this->offerNumberService->generateNext();

        // New offer from customer: prefill customer when customer_uuid is in URL
        $initialCustomerUuid = ! $sourceOffer && $request->has('customer_uuid') ? $request->get('customer_uuid') : null;

        return Inertia::render('Offers/Create', [
            'customers' => $customers,
            'divisions' => $divisions,
            'initialCustomerUuid' => $initialCustomerUuid,
            'activities' => $formOptions['activities'],
            'sectors' => $formOptions['sectors'],
            'seasonalities' => $formOptions['seasonalities'],
            'orderTypes' => $formOptions['orderTypes'],
            'lasFamilies' => $formOptions['lasFamilies'],
            'lasWorkLines' => $formOptions['lasWorkLines'],
            'lsResources' => $formOptions['lsResources'],
            'operationCategories' => $formOptions['operationCategories'],
            'offerNumber' => $offerNumber,
            'sourceOffer' => $sourceOffer ? [
                'uuid' => $sourceOffer->uuid,
                'offer_number' => $sourceOffer->offer_number,
                'offer_date' => $sourceOffer->offer_date?->format('Y-m-d'),
                'validity_date' => $sourceOffer->validity_date?->format('Y-m-d'),
                'customer_uuid' => $sourceOffer->customer_uuid,
                'customerdivision_uuid' => $sourceOffer->customerdivision_uuid,
                'activity_uuid' => $sourceOffer->activity_uuid,
                'sector_uuid' => $sourceOffer->sector_uuid,
                'seasonality_uuid' => $sourceOffer->seasonality_uuid,
                'type_uuid' => $sourceOffer->type_uuid,
                'order_type_uuid' => $sourceOffer->order_type_uuid,
                'lasfamily_uuid' => $sourceOffer->lasfamily_uuid,
                'lasworkline_uuid' => $sourceOffer->lasworkline_uuid,
                'lsresource_uuid' => $sourceOffer->lsresource_uuid,
                'customer_ref' => $sourceOffer->customer_ref,
                'article_code_ref' => $sourceOffer->article_code_ref,
                'provisional_description' => $sourceOffer->provisional_description,
                'unit_of_measure' => $sourceOffer->unit_of_measure,
                'quantity' => $sourceOffer->quantity,
                'piece' => $sourceOffer->piece,
                'declared_weight_cfz' => $sourceOffer->declared_weight_cfz,
                'declared_weight_pz' => $sourceOffer->declared_weight_pz,
                'notes' => $sourceOffer->notes,
                'expected_workers' => $sourceOffer->expected_workers,
                'expected_revenue' => $sourceOffer->expected_revenue,
                'rate_cfz' => $sourceOffer->rate_cfz,
                'rate_pz' => $sourceOffer->rate_pz,
                'rate_rounding_cfz' => $sourceOffer->rate_rounding_cfz,
                'rate_increase_cfz' => $sourceOffer->rate_increase_cfz,
                'materials_euro' => $sourceOffer->materials_euro,
                'logistics_euro' => $sourceOffer->logistics_euro,
                'other_euro' => $sourceOffer->other_euro,
                'offer_notes' => $sourceOffer->offer_notes,
                'ls_setup_cost' => $sourceOffer->ls_setup_cost,
                'ls_other_costs' => $sourceOffer->ls_other_costs,
                'approval_status' => $sourceOffer->approval_status,
                'operations' => $sourceOffer->operationLists->map(function ($opList) {
                    $operation = $opList->operation;

                    return [
                        'uuid' => $opList->uuid,
                        'offeroperation_uuid' => $opList->offeroperation_uuid,
                        'num_op' => $opList->num_op,
                        'operation' => $operation ? [
                            'uuid' => $operation->uuid,
                            'name' => $operation->name,
                            'codice_univoco' => $operation->codice_univoco ?? '',
                            'descrizione' => $operation->descrizione ?? '',
                            'secondi_operazione' => $operation->secondi_operazione ?? 0,
                            'category_uuid' => $operation->category_uuid,
                            'category' => $operation->category ? [
                                'uuid' => $operation->category->uuid,
                                'name' => $operation->category->name,
                            ] : null,
                        ] : null,
                    ];
                })->toArray(),
            ] : null,
        ]);
    }

    /**
     * Salva una nuova offerta creata.
     */
    public function store(StoreOfferRequest $request)
    {
        $result = $this->createOfferAction->execute($request->validated());

        // If the action returns an error, redirect with errors
        if (is_array($result) && isset($result['error']) && $result['error']) {
            return back()->withErrors([
                $result['field'] => $result['message'],
            ])->withInput();
        }

        // Invalidate form options cache (offers are cached)
        $this->articleRepository->clearFormOptionsCache();

        return redirect()->route('offers.index')
            ->with('success', __('flash.offer.created'));
    }

    /**
     * Mostra l'offerta specificata.
     */
    public function show(Offer $offer): Response
    {
        // Load all necessary relations
        $offer->load([
            'customer',
            'customerDivision',
            'activity',
            'sector',
            'seasonality',
            'articles',
            'articlesDirect',
        ]);

        // Load relations manually without applying scope that filters by removed
        // So they load even when marked as removed
        if ($offer->order_type_uuid) {
            $typeOrder = \App\Models\OfferTypeOrder::withoutGlobalScopes()
                ->where('uuid', $offer->order_type_uuid)
                ->first();
            $offer->setRelation('typeOrder', $typeOrder);
        }

        if ($offer->lasfamily_uuid) {
            $lasFamily = \App\Models\OfferLasFamily::withoutGlobalScopes()
                ->where('uuid', $offer->lasfamily_uuid)
                ->first();
            $offer->setRelation('lasFamily', $lasFamily);
        }

        if ($offer->lasworkline_uuid) {
            $lasWorkLine = \App\Models\OfferLasWorkLine::withoutGlobalScopes()
                ->where('uuid', $offer->lasworkline_uuid)
                ->first();
            $offer->setRelation('lasWorkLine', $lasWorkLine);
        }

        if ($offer->lsresource_uuid) {
            $lsResource = \App\Models\OfferLsResource::withoutGlobalScopes()
                ->where('uuid', $offer->lsresource_uuid)
                ->first();
            $offer->setRelation('lsResource', $lsResource);
        }

        if ($offer->customerdivision_uuid && ! $offer->customerDivision) {
            $customerDivision = \App\Models\CustomerDivision::withoutGlobalScopes()
                ->where('uuid', $offer->customerdivision_uuid)
                ->first();
            $offer->setRelation('customerDivision', $customerDivision);
        }
        $offerDetailsDto = $this->getOfferDetailsAction->execute($offer);

        return Inertia::render('Offers/Show', [
            'offer' => OfferResource::make($offerDetailsDto)->resolve(),
        ]);
    }

    /**
     * Genera e scarica il PDF di un'offerta (equivalente a downloadPDF del legacy).
     * Usa wkhtmltopdf per generare il PDF da HTML.
     */
    public function downloadPdf(Offer $offer): HttpResponse
    {
        $result = $this->generateOfferPdfAction->execute($offer);

        return response($result['pdf'], 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => sprintf(
                'attachment; filename="%s"; filename*=UTF-8\'\'%s',
                $result['filename'],
                rawurlencode($result['filename'])
            ),
            'Content-Length' => strlen($result['pdf']),
            'X-Content-Type-Options' => 'nosniff',
        ]);
    }

    /**
     * Mostra il modulo per modificare l'offerta specificata.
     */
    public function edit(Offer $offer): Response
    {
        // Load all relationships required for the edit form
        $offer->load([
            'customer',
            'customerDivision',
            'activity',
            'sector',
            'seasonality',
        ]);

        // Load relations manually without applying scope that filters by removed
        // So they load even when marked as removed
        if ($offer->order_type_uuid) {
            $typeOrder = \App\Models\OfferTypeOrder::withoutGlobalScopes()
                ->where('uuid', $offer->order_type_uuid)
                ->first();
            $offer->setRelation('typeOrder', $typeOrder);
        }

        if ($offer->lasfamily_uuid) {
            $lasFamily = \App\Models\OfferLasFamily::withoutGlobalScopes()
                ->where('uuid', $offer->lasfamily_uuid)
                ->first();
            $offer->setRelation('lasFamily', $lasFamily);
        }

        if ($offer->lasworkline_uuid) {
            $lasWorkLine = \App\Models\OfferLasWorkLine::withoutGlobalScopes()
                ->where('uuid', $offer->lasworkline_uuid)
                ->first();
            $offer->setRelation('lasWorkLine', $lasWorkLine);
        }

        if ($offer->lsresource_uuid) {
            $lsResource = \App\Models\OfferLsResource::withoutGlobalScopes()
                ->where('uuid', $offer->lsresource_uuid)
                ->first();
            $offer->setRelation('lsResource', $lsResource);
        }

        if ($offer->customerdivision_uuid && ! $offer->customerDivision) {
            $customerDivision = \App\Models\CustomerDivision::withoutGlobalScopes()
                ->where('uuid', $offer->customerdivision_uuid)
                ->first();
            $offer->setRelation('customerDivision', $customerDivision);
        }

        if ($offer->activity_uuid && ! $offer->activity) {
            $activity = \App\Models\OfferActivity::withoutGlobalScopes()
                ->where('uuid', $offer->activity_uuid)
                ->first();
            $offer->setRelation('activity', $activity);
        }

        if ($offer->sector_uuid && ! $offer->sector) {
            $sector = \App\Models\OfferSector::withoutGlobalScopes()
                ->where('uuid', $offer->sector_uuid)
                ->first();
            $offer->setRelation('sector', $sector);
        }

        if ($offer->seasonality_uuid && ! $offer->seasonality) {
            $seasonality = \App\Models\OfferSeasonality::withoutGlobalScopes()
                ->where('uuid', $offer->seasonality_uuid)
                ->first();
            $offer->setRelation('seasonality', $seasonality);
        }

        $customers = Customer::active()->orderBy('company_name')->get(['uuid', 'code', 'company_name']);
        $divisions = CustomerDivision::where('customer_uuid', $offer->customer_uuid)
            ->where('removed', false)
            ->orderBy('name')
            ->get(['uuid', 'name']);

        // Get form options from repository (cached)
        $formOptions = $this->offerRepository->getFormOptions();

        // If offer has UUIDs not in options (because removed),
        // add them to options to display in dropdown
        if ($offer->activity_uuid) {
            $activityInOptions = collect($formOptions['activities'])->pluck('uuid')->contains($offer->activity_uuid);
            if (! $activityInOptions) {
                $activity = \App\Models\OfferActivity::withoutGlobalScopes()
                    ->where('uuid', $offer->activity_uuid)
                    ->first(['uuid', 'name']);
                if ($activity) {
                    $formOptions['activities']->push($activity);
                }
            }
        }

        if ($offer->sector_uuid) {
            $sectorInOptions = collect($formOptions['sectors'])->pluck('uuid')->contains($offer->sector_uuid);
            if (! $sectorInOptions) {
                $sector = \App\Models\OfferSector::withoutGlobalScopes()
                    ->where('uuid', $offer->sector_uuid)
                    ->first(['uuid', 'name']);
                if ($sector) {
                    $formOptions['sectors']->push($sector);
                }
            }
        }

        if ($offer->seasonality_uuid) {
            $seasonalityInOptions = collect($formOptions['seasonalities'])->pluck('uuid')->contains($offer->seasonality_uuid);
            if (! $seasonalityInOptions) {
                $seasonality = \App\Models\OfferSeasonality::withoutGlobalScopes()
                    ->where('uuid', $offer->seasonality_uuid)
                    ->first(['uuid', 'name']);
                if ($seasonality) {
                    $formOptions['seasonalities']->push($seasonality);
                }
            }
        }

        if ($offer->order_type_uuid) {
            $orderTypeInOptions = collect($formOptions['orderTypes'])->pluck('uuid')->contains($offer->order_type_uuid);
            if (! $orderTypeInOptions) {
                $orderType = \App\Models\OfferTypeOrder::withoutGlobalScopes()
                    ->where('uuid', $offer->order_type_uuid)
                    ->first(['uuid', 'name']);
                if ($orderType) {
                    $formOptions['orderTypes']->push($orderType);
                }
            }
        }

        if ($offer->lasfamily_uuid) {
            $lasFamilyInOptions = collect($formOptions['lasFamilies'])->pluck('uuid')->contains($offer->lasfamily_uuid);
            if (! $lasFamilyInOptions) {
                $lasFamily = \App\Models\OfferLasFamily::withoutGlobalScopes()
                    ->where('uuid', $offer->lasfamily_uuid)
                    ->first(['uuid', 'code', 'name']);
                if ($lasFamily) {
                    $formOptions['lasFamilies']->push($lasFamily);
                }
            }
        }

        if ($offer->lasworkline_uuid) {
            $lasWorkLineInOptions = collect($formOptions['lasWorkLines'])->pluck('uuid')->contains($offer->lasworkline_uuid);
            if (! $lasWorkLineInOptions) {
                $lasWorkLine = \App\Models\OfferLasWorkLine::withoutGlobalScopes()
                    ->where('uuid', $offer->lasworkline_uuid)
                    ->first(['uuid', 'code', 'name']);
                if ($lasWorkLine) {
                    $formOptions['lasWorkLines']->push($lasWorkLine);
                }
            }
        }

        if ($offer->lsresource_uuid) {
            $lsResourceInOptions = collect($formOptions['lsResources'])->pluck('uuid')->contains($offer->lsresource_uuid);
            if (! $lsResourceInOptions) {
                $lsResource = \App\Models\OfferLsResource::withoutGlobalScopes()
                    ->where('uuid', $offer->lsresource_uuid)
                    ->first(['uuid', 'code', 'name']);
                if ($lsResource) {
                    $formOptions['lsResources']->push($lsResource);
                }
            }
        }

        // Preparare operazioni esistenti per il modulo
        // Load operationList without applying scope that filters by removed
        $operationLists = \App\Models\OfferOperationList::withoutGlobalScopes()
            ->where('offer_uuid', $offer->uuid)
            ->where('removed', false)
            ->with(['operation.category'])
            ->get();

        $operations = [];
        foreach ($operationLists as $operationList) {
            $operation = $operationList->operation;
            if (! $operation) {
                continue;
            }

            $category = $operation->category;
            $operations[] = [
                'uuid' => $operationList->uuid,
                'category_uuid' => $category?->uuid ?? '',
                'operation_uuid' => $operation->uuid,
                'secondi_operazione' => $operation->secondi_operazione ?? 0,
                'num_op' => $operationList->num_op,
                'total_sec' => ($operation->secondi_operazione ?? 0) * $operationList->num_op,
            ];
        }

        // Ensure UUIDs are explicitly included in serialization
        $offerArray = $offer->toArray();
        // Ensure UUID fields are present (in case they're not serialized)
        $offerArray['activity_uuid'] = $offer->activity_uuid;
        $offerArray['sector_uuid'] = $offer->sector_uuid;
        $offerArray['seasonality_uuid'] = $offer->seasonality_uuid;
        $offerArray['order_type_uuid'] = $offer->order_type_uuid;
        $offerArray['lasfamily_uuid'] = $offer->lasfamily_uuid;
        $offerArray['lasworkline_uuid'] = $offer->lasworkline_uuid;
        $offerArray['lsresource_uuid'] = $offer->lsresource_uuid;

        return Inertia::render('Offers/Edit', [
            'offer' => $offerArray,
            'customers' => $customers,
            'divisions' => $divisions,
            'activities' => $formOptions['activities'],
            'sectors' => $formOptions['sectors'],
            'seasonalities' => $formOptions['seasonalities'],
            'orderTypes' => $formOptions['orderTypes'],
            'lasFamilies' => $formOptions['lasFamilies'],
            'lasWorkLines' => $formOptions['lasWorkLines'],
            'lsResources' => $formOptions['lsResources'],
            'operationCategories' => $formOptions['operationCategories'],
            'operations' => $operations,
        ]);
    }

    /**
     * Aggiorna l'offerta specificata.
     */
    public function update(UpdateOfferRequest $request, Offer $offer)
    {
        try {
            $result = $this->updateOfferAction->execute($offer, $request->validated());

            // If the action returns an error, redirect with errors
            if (is_array($result) && isset($result['error']) && $result['error']) {
                return back()->withErrors([
                    $result['field'] => $result['message'],
                ])->withInput();
            }

            // Reload offer to ensure data is up to date
            $offer->refresh();

            return redirect()->route('offers.show', $offer->uuid)
                ->with('success', __('flash.offer.updated'));
        } catch (\Illuminate\Validation\ValidationException $e) {
            return back()->withErrors($e->errors())->withInput();
        }
    }

    /**
     * Rimuove l'offerta specificata (soft delete).
     *
     * Validazione: Non è possibile eliminare se ha articoli associati.
     */
    public function destroy(Offer $offer)
    {
        // Validate it has no associated articles (search both pivot and direct relation)
        $hasArticlesInPivot = $offer->articles()->exists();
        $hasArticlesDirect = $offer->articlesDirect()->exists();

        if ($hasArticlesInPivot || $hasArticlesDirect) {
            return redirect()->route('offers.index')
                ->with('error', __('flash.offer.cannot_delete'));
        }

        $offer->update(['removed' => true]);

        // Invalidate form options cache (offers are cached)
        $this->articleRepository->clearFormOptionsCache();
        // Invalidate orders cache (articles are in orders cache)
        $this->orderRepository->clearFormOptionsCache();
        // Invalidate shipping addresses cache for all articles in this offer
        $offer->articles()->each(function ($article) {
            $this->orderRepository->clearShippingAddressesCache($article->uuid);
        });

        return redirect()->route('offers.index')
            ->with('success', __('flash.offer.deleted'));
    }

    /**
     * Ottiene le divisioni per un cliente (endpoint AJAX).
     */
    public function getDivisions(Request $request)
    {
        $request->validate([
            'customer_uuid' => 'required|exists:customer,uuid',
        ]);

        $divisions = $this->getDivisionsForCustomerAction->execute(
            $request->get('customer_uuid'),
        );

        return ApiResponseResource::success(
            true,
            null,
            ['divisions' => $divisions],
        )->response();
    }
}
