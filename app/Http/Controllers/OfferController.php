<?php

namespace App\Http\Controllers;

use App\Actions\CreateOfferAction;
use App\Actions\UpdateOfferAction;
use App\Http\Requests\StoreOfferRequest;
use App\Http\Requests\UpdateOfferRequest;
use App\Models\Customer;
use App\Models\CustomerDivision;
use App\Models\Offer;
use App\Repositories\ArticleRepository;
use App\Repositories\OfferRepository;
use App\Repositories\OrderRepository;
use App\Services\OfferNumberService;
use Illuminate\Http\Request;
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

    public function __construct(
        OfferNumberService $offerNumberService,
        ArticleRepository $articleRepository,
        OfferRepository $offerRepository,
        OrderRepository $orderRepository,
        CreateOfferAction $createOfferAction,
        UpdateOfferAction $updateOfferAction
    ) {
        $this->offerNumberService = $offerNumberService;
        $this->articleRepository = $articleRepository;
        $this->offerRepository = $offerRepository;
        $this->orderRepository = $orderRepository;
        $this->createOfferAction = $createOfferAction;
        $this->updateOfferAction = $updateOfferAction;
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

        // Assicurare che sia incluso l'accessor approval_status_label
        $offers->getCollection()->transform(function ($offer) {
            $offer->append('approval_status_label');

            return $offer;
        });

        $customers = Customer::active()->orderBy('company_name')->get(['uuid', 'code', 'company_name']);

        return Inertia::render('Offers/Index', [
            'offers' => $offers,
            'customers' => $customers,
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

        // Ottenere opzioni formulario dal repository (con cache)
        $formOptions = $this->offerRepository->getFormOptions();

        // Se c'è duplicate_from, caricare dati dell'offerta originale
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

                // Caricare divisioni del cliente dell'offerta originale
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
            // Se non è duplicazione, caricare divisioni in base a customer_uuid se presente
            if ($request->has('customer_uuid')) {
                $divisions = CustomerDivision::where('customer_uuid', $request->get('customer_uuid'))
                    ->where('removed', false)
                    ->orderBy('name')
                    ->get(['uuid', 'name']);
            }
        }

        // Genera il numero di offerta automaticamente (solo se non è duplicazione)
        $offerNumber = $sourceOffer ? $sourceOffer->offer_number : $this->offerNumberService->generateNext();

        // Nuova offerta da cliente: precompilare cliente quando customer_uuid è nell'URL
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

        // Se l'action restituisce un errore, reindirizzare con errori
        if (is_array($result) && isset($result['error']) && $result['error']) {
            return back()->withErrors([
                $result['field'] => $result['message'],
            ])->withInput();
        }

        // Invalidare cache opzioni formulari (le offerte sono in cache)
        $this->articleRepository->clearFormOptionsCache();

        return redirect()->route('offers.index')
            ->with('success', 'Offerta creata con successo.');
    }

    /**
     * Mostra l'offerta specificata.
     */
    public function show(Offer $offer): Response
    {
        // Caricare tutte le relazioni necessarie
        $offer->load([
            'customer',
            'customerDivision',
            'activity',
            'sector',
            'seasonality',
            'articles',
            'articlesDirect',
        ]);

        // Caricare relazioni manualmente senza applicare scope che filtrino per removed
        // Così si caricano anche se marcate come removed
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

        // Combinare articoli di entrambe le relazioni (evitando duplicati)
        $allArticles = $offer->articles->merge($offer->articlesDirect)->unique('uuid');

        // Preparare operazioni con informazioni complete (come nel legacy)
        $operationsList = [];
        $totalSec = 0;

        // Caricare operationList senza applicare scope che filtrino per removed
        $operationLists = \App\Models\OfferOperationList::withoutGlobalScopes()
            ->where('offer_uuid', $offer->uuid)
            ->where('removed', false)
            ->with('operation', 'operation.category')
            ->get();

        foreach ($operationLists as $operationList) {
            $operation = $operationList->operation;
            if (! $operation) {
                continue;
            }

            $category = $operation->category;
            $categoryName = $category ? ($category->code.' - '.$category->name) : '';

            $opTotalSec = ($operation->secondi_operazione ?? 0) * $operationList->num_op;
            $totalSec += $opTotalSec;

            $operationsList[] = [
                'uuid' => $operation->uuid,
                'category' => [
                    'uuid' => $category?->uuid,
                    'name' => $categoryName,
                ],
                'codice_univoco' => $operation->codice_univoco ?? 'N/A',
                'descrizione' => $operation->descrizione ?? 'N/A',
                'secondi_operazione' => $operation->secondi_operazione ?? 0,
                'num_op' => $operationList->num_op,
                'total_sec' => $opTotalSec,
                'filename' => $operation->filename ?? null,
            ];
        }

        // Calcolare campi come nel legacy
        $unexpected = $totalSec * 0.05;
        $totalTheoreticalTime = $totalSec + $unexpected;

        $theoreticalTime = 0;
        if ($offer->piece > 0) {
            $theoreticalTime = $totalTheoreticalTime / $offer->piece;
        }

        $productionTimeCfz = ($totalTheoreticalTime * 8) / 7;

        $productionTime = 0;
        if ($offer->piece > 0) {
            $productionTime = $productionTimeCfz / $offer->piece;
        }

        $productionAverageCfz = 0;
        if ($productionTimeCfz > 0) {
            $productionAverageCfz = 3600 / $productionTimeCfz;
        }

        $productionAveragePz = $productionAverageCfz * $offer->piece;

        // Calcolare rate_cfz e rate_pz (come in Create.tsx)
        $rateCfz = 0;
        if ($productionAverageCfz > 0 && $offer->expected_revenue) {
            $rateCfz = $offer->expected_revenue / $productionAverageCfz;
        }

        $ratePz = 0;
        if ($offer->piece > 0) {
            $ratePz = $rateCfz / $offer->piece;
        }

        $rateRoundingCfzPerc = 0;
        if ($offer->rate_rounding_cfz > 0) {
            $rateRoundingCfzPerc = ($offer->rate_increase_cfz / $offer->rate_rounding_cfz) * 100;
        }

        $finalRateCfz = ($offer->rate_increase_cfz ?? 0) + ($offer->rate_rounding_cfz ?? 0);

        $finalRatePz = 0;
        if ($offer->piece > 0) {
            $finalRatePz = $finalRateCfz / $offer->piece;
        }

        $totalRateCfz = $finalRateCfz + ($offer->materials_euro ?? 0) + ($offer->logistics_euro ?? 0) + ($offer->other_euro ?? 0);

        $totalRatePz = 0;
        if ($offer->piece > 0) {
            $totalRatePz = $totalRateCfz / $offer->piece;
        }

        // Aggiungere campi calcolati al modello
        $offer->setAttribute('operations', $operationsList);
        $offer->setAttribute('theoretical_time_cfz', $totalSec);
        $offer->setAttribute('unexpected', $unexpected);
        $offer->setAttribute('total_theoretical_time', $totalTheoreticalTime);
        $offer->setAttribute('theoretical_time', $theoreticalTime);
        $offer->setAttribute('production_time_cfz', $productionTimeCfz);
        $offer->setAttribute('production_time', $productionTime);
        $offer->setAttribute('production_average_cfz', $productionAverageCfz);
        $offer->setAttribute('production_average_pz', $productionAveragePz);
        $offer->setAttribute('rate_cfz', $rateCfz);
        $offer->setAttribute('rate_pz', $ratePz);
        $offer->setAttribute('rate_rounding_cfz_perc', $rateRoundingCfzPerc);
        $offer->setAttribute('final_rate_cfz', $finalRateCfz);
        $offer->setAttribute('final_rate_pz', $finalRatePz);
        $offer->setAttribute('total_rate_cfz', $totalRateCfz);
        $offer->setAttribute('total_rate_pz', $totalRatePz);
        $offer->setAttribute('approval_status', $offer->approval_status_label);

        // Assicurare che le relazioni siano incluse nella serializzazione
        $offer->setRelation('articles', $allArticles);

        // Assicurare che le relazioni si carichino correttamente (non usare loadMissing perché può sovrascrivere)
        // Verificare e caricare relazioni che potrebbero non essere state caricate
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

        // Assicurare che gli UUID siano inclusi esplicitamente nella serializzazione
        $offerArray = $offer->toArray();
        // Assicurare che i campi UUID e le relazioni siano presenti
        $offerArray['activity_uuid'] = $offer->activity_uuid;
        $offerArray['sector_uuid'] = $offer->sector_uuid;
        $offerArray['seasonality_uuid'] = $offer->seasonality_uuid;
        $offerArray['order_type_uuid'] = $offer->order_type_uuid;
        $offerArray['lasfamily_uuid'] = $offer->lasfamily_uuid;
        $offerArray['lasworkline_uuid'] = $offer->lasworkline_uuid;
        $offerArray['lsresource_uuid'] = $offer->lsresource_uuid;
        $offerArray['customerdivision_uuid'] = $offer->customerdivision_uuid;

        // Assicurare che le relazioni siano incluse nell'array
        if ($offer->typeOrder) {
            $offerArray['typeOrder'] = [
                'uuid' => $offer->typeOrder->uuid,
                'name' => $offer->typeOrder->name,
            ];
        }

        if ($offer->lasFamily) {
            $offerArray['lasFamily'] = [
                'uuid' => $offer->lasFamily->uuid,
                'code' => $offer->lasFamily->code,
                'name' => $offer->lasFamily->name,
            ];
        }

        if ($offer->lasWorkLine) {
            $offerArray['lasWorkLine'] = [
                'uuid' => $offer->lasWorkLine->uuid,
                'code' => $offer->lasWorkLine->code,
                'name' => $offer->lasWorkLine->name,
            ];
        }

        if ($offer->lsResource) {
            $offerArray['lsResource'] = [
                'uuid' => $offer->lsResource->uuid,
                'code' => $offer->lsResource->code,
                'name' => $offer->lsResource->name,
            ];
        }

        if ($offer->customerDivision) {
            $offerArray['customerDivision'] = [
                'uuid' => $offer->customerDivision->uuid,
                'name' => $offer->customerDivision->name,
            ];
        }

        return Inertia::render('Offers/Show', [
            'offer' => $offerArray,
        ]);
    }

    /**
     * Genera e scarica il PDF di un'offerta (equivalente a downloadPDF del legacy).
     * Usa wkhtmltopdf per generare il PDF da HTML.
     */
    public function downloadPdf(Offer $offer)
    {
        // Creare directory temporanea se non esiste (come nel legacy)
        $tmpDir = storage_path('app/tmp/offers');
        if (! is_dir($tmpDir)) {
            mkdir($tmpDir, 0755, true);
        }

        // Caricare la risorsa L&S se non è caricata
        if ($offer->lsresource_uuid && ! $offer->lsResource) {
            $lsResource = \App\Models\OfferLsResource::withoutGlobalScopes()
                ->where('uuid', $offer->lsresource_uuid)
                ->first();
            $offer->setRelation('lsResource', $lsResource);
        }

        // Caricare operationList senza applicare scope che filtrino per removed
        $operationLists = \App\Models\OfferOperationList::withoutGlobalScopes()
            ->where('offer_uuid', $offer->uuid)
            ->where('removed', false)
            ->with('operation')
            ->get();

        // Calcolare totale secondi operazioni (come nel legacy)
        $totalSec = 0;
        foreach ($operationLists as $operationList) {
            $operation = $operationList->operation;
            if (! $operation) {
                continue;
            }

            $secOp = (float) ($operation->secondi_operazione ?? 0);
            $numOp = (float) ($operationList->num_op ?? 0);
            $totalSec += $secOp * $numOp;
        }

        // Replicare calcoli del legacy downloadPDF
        $unexpected = $totalSec * 0.05;
        $totalTheoreticalTime = $totalSec + $unexpected;
        $productionTimeCfz = ($totalTheoreticalTime * 8) / 7;

        $productionAverageCfz = 0.0;
        if ($productionTimeCfz > 0) {
            $productionAverageCfz = 3600 / $productionTimeCfz;
        }

        $expectedWorkers = (float) ($offer->expected_workers ?? 0);
        $hourlyProductivity = $expectedWorkers * $productionAverageCfz;

        $rateIncreaseCfz = (float) ($offer->rate_increase_cfz ?? 0);
        $rateRoundingCfz = (float) ($offer->rate_rounding_cfz ?? 0);
        $lsSetupCost = (float) ($offer->ls_setup_cost ?? 0);
        $quantity = (float) ($offer->quantity ?? 0);

        $finalRateCfz = $rateIncreaseCfz + $rateRoundingCfz;
        $runningCostCfz = $finalRateCfz - ($finalRateCfz * ($lsSetupCost / 100));
        $setupCost = $finalRateCfz * ($lsSetupCost / 100) * $quantity;
        $setupCostCfz = $finalRateCfz * ($lsSetupCost / 100);

        $lsResource = $offer->lsResource;

        $data = [
            'offer_date' => optional($offer->offer_date)->format('d.m.Y'),
            'offer_number' => $offer->offer_number,
            'customer_ref' => $offer->customer_ref ?? '',
            'provisional_description' => $offer->provisional_description ?? '',
            'hourly_productivity' => round($hourlyProductivity, 2),
            'ls_resource_code' => $lsResource?->code ?? '',
            'ls_resource_description' => $lsResource?->name ?? '',
            'final_rate_cfz' => $finalRateCfz,
            'running_cost_cfz' => $runningCostCfz,
            'setup_cost' => $setupCost,
            'quantity' => $quantity,
            'setup_cost_cfz' => $setupCostCfz,
            'ls_other_costs' => (float) ($offer->ls_other_costs ?? 0),
        ];

        // Renderizzare la vista Blade in HTML (equivalente a render2string del legacy)
        $html = view('offers.pdf', $data)->render();

        // Salvare HTML in file temporaneo
        $tmpFile = $tmpDir.'/'.$offer->uuid.'.html';
        file_put_contents($tmpFile, $html);

        // Ottenere percorso wkhtmltopdf da config o usare comando di default
        $wkhtmltopdfPath = config('app.wkhtmltopdf_path', 'wkhtmltopdf');

        // Titolo del PDF
        $pdfTitle = sprintf(
            'Offerta n. %s del %s',
            $offer->offer_number,
            optional($offer->offer_date)->format('d.m.Y') ?? date('d.m.Y')
        );

        // Eseguire wkhtmltopdf (come nel legacy)
        // Il comando genera il PDF su stdout (-)
        $command = sprintf(
            'ulimit -n 4096; %s --title "%s" %s -',
            escapeshellarg($wkhtmltopdfPath),
            escapeshellarg($pdfTitle),
            escapeshellarg($tmpFile)
        );

        Log::debug('[OFFER] PDF - Executing command: '.$command);

        $pdf = shell_exec($command);

        // Rimuovere file temporaneo
        if (file_exists($tmpFile)) {
            @unlink($tmpFile);
        }

        if ($pdf === null || empty($pdf)) {
            abort(500, 'Errore nella generazione del PDF. Verifica che wkhtmltopdf sia installato e configurato correttamente.');
        }

        $fileName = sprintf('offerta_%s.pdf', $offer->offer_number);

        // Usare Content-Disposition: attachment per forzare sempre il dialogo di download
        // e evitare che il browser apra il PDF automaticamente
        return response($pdf, 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => sprintf('attachment; filename="%s"; filename*=UTF-8\'\'%s',
                $fileName,
                rawurlencode($fileName)
            ),
            'Content-Length' => strlen($pdf),
            'X-Content-Type-Options' => 'nosniff', // Evitare che il browser tenti di aprire il file
        ]);
    }

    /**
     * Mostra il modulo per modificare l'offerta specificata.
     */
    public function edit(Offer $offer): Response
    {
        // Caricare tutte le relazioni necessarie per il modulo di modifica
        $offer->load([
            'customer',
            'customerDivision',
            'activity',
            'sector',
            'seasonality',
        ]);

        // Caricare relazioni manualmente senza applicare scope che filtrino per removed
        // Così si caricano anche se marcate come removed
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

        // Ottenere opzioni formulario dal repository (con cache)
        $formOptions = $this->offerRepository->getFormOptions();

        // Se l'offerta ha UUID non presenti nelle opzioni (perché rimossi),
        // aggiungerli alle opzioni per mostrarli nel dropdown
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
        // Caricare operationList senza applicare scope che filtrino per removed
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

        // Assicurare che gli UUID siano inclusi esplicitamente nella serializzazione
        $offerArray = $offer->toArray();
        // Assicurare che i campi UUID siano presenti (nel caso non siano serializzati)
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

            // Se l'action restituisce un errore, reindirizzare con errori
            if (is_array($result) && isset($result['error']) && $result['error']) {
                return back()->withErrors([
                    $result['field'] => $result['message'],
                ])->withInput();
            }

            // Ricaricare l'offerta per assicurare che i dati siano aggiornati
            $offer->refresh();

            return redirect()->route('offers.show', $offer->uuid)
                ->with('success', 'Offerta aggiornata con successo.');
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
        // Validare che non abbia articoli associati (cercare sia in pivot che in relazione diretta)
        $hasArticlesInPivot = $offer->articles()->exists();
        $hasArticlesDirect = $offer->articlesDirect()->exists();

        if ($hasArticlesInPivot || $hasArticlesDirect) {
            return redirect()->route('offers.index')
                ->with('error', 'Non è possibile eliminare l\'offerta. Ha articoli associati.');
        }

        $offer->update(['removed' => true]);

        // Invalidare cache opzioni formulari (le offerte sono in cache)
        $this->articleRepository->clearFormOptionsCache();
        // Invalidare cache ordini (gli articoli sono in cache ordini)
        $this->orderRepository->clearFormOptionsCache();
        // Invalidare cache indirizzi di spedizione per tutti gli articoli di questa offerta
        $offer->articles()->each(function ($article) {
            $this->orderRepository->clearShippingAddressesCache($article->uuid);
        });

        return redirect()->route('offers.index')
            ->with('success', 'Offerta eliminata con successo.');
    }

    /**
     * Ottiene le divisioni per un cliente (endpoint AJAX).
     */
    public function getDivisions(Request $request)
    {
        $request->validate([
            'customer_uuid' => 'required|exists:customer,uuid',
        ]);

        $divisions = CustomerDivision::where('customer_uuid', $request->get('customer_uuid'))
            ->where('removed', false)
            ->orderBy('name')
            ->get(['uuid', 'name']);

        return response()->json($divisions);
    }
}
