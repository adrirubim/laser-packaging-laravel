<?php

namespace App\Http\Controllers;

use App\Actions\CreateArticleAction;
use App\Actions\UpdateArticleAction;
use App\Enums\OrderLabelStatus;
use App\Http\Controllers\Concerns\HandlesActionErrors;
use App\Models\Article;
use App\Models\Offer;
use App\Repositories\ArticleRepository;
use App\Repositories\OrderRepository;
use App\Services\ArticleCodeService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ArticleController extends Controller
{
    use HandlesActionErrors;

    protected ArticleCodeService $articleCodeService;

    protected ArticleRepository $articleRepository;

    protected OrderRepository $orderRepository;

    protected CreateArticleAction $createArticleAction;

    protected UpdateArticleAction $updateArticleAction;

    public function __construct(
        ArticleCodeService $articleCodeService,
        ArticleRepository $articleRepository,
        OrderRepository $orderRepository,
        CreateArticleAction $createArticleAction,
        UpdateArticleAction $updateArticleAction
    ) {
        $this->articleCodeService = $articleCodeService;
        $this->articleRepository = $articleRepository;
        $this->orderRepository = $orderRepository;
        $this->createArticleAction = $createArticleAction;
        $this->updateArticleAction = $updateArticleAction;
    }

    /**
     * Display a listing of articles.
     */
    public function index(Request $request): Response
    {
        try {
            $articles = $this->articleRepository->getForIndex($request);

            \Log::debug('ArticleController@index - Articles query result', [
                'total' => $articles->total(),
                'current_page' => $articles->currentPage(),
                'per_page' => $articles->perPage(),
                'count' => $articles->count(),
                'items_count' => count($articles->items()),
            ]);

            try {
                $formOptions = $this->articleRepository->getFormOptions();
            } catch (\Exception $e) {
                \Log::error('Errore caricamento opzioni formulario in ArticleController@index: '.$e->getMessage(), [
                    'trace' => $e->getTraceAsString(),
                ]);
                // Continuare con opzioni vuote se getFormOptions fallisce
                $formOptions = [
                    'offers' => [],
                    'categories' => [],
                ];
            }

            return Inertia::render('Articles/Index', [
                'articles' => $articles,
                'offers' => $formOptions['offers'] ?? [],
                'categories' => $formOptions['categories'] ?? [],
                'filters' => $request->only(['search', 'offer_uuid', 'article_category', 'sort_by', 'sort_order']),
            ]);
        } catch (\Exception $e) {
            \Log::error('Errore in ArticleController@index: '.$e->getMessage(), [
                'trace' => $e->getTraceAsString(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);

            return Inertia::render('Articles/Index', [
                'articles' => new \Illuminate\Pagination\LengthAwarePaginator([], 0, 15),
                'offers' => [],
                'categories' => [],
                'filters' => $request->only(['search', 'offer_uuid', 'article_category']),
                'error' => 'Si è verificato un errore nel caricamento degli articoli. Controlla i log per maggiori dettagli.',
            ]);
        }
    }

    /**
     * Show the form for creating a new article.
     */
    public function create(Request $request): Response
    {
        $formOptions = $this->articleRepository->getFormOptions();

        // Se c'è source_article_uuid, caricare dati per duplicazione
        $sourceArticle = $this->articleRepository->getSourceArticleForDuplication(
            $request->get('source_article_uuid')
        );

        // Generare codice LAS automaticamente se c'è offerta selezionata
        $lasCode = null;
        $selectedOfferUuid = $request->get('offer_uuid');

        // Se è duplicazione, usare l'offerta dell'articolo sorgente
        if ($sourceArticle && ! $selectedOfferUuid) {
            $selectedOfferUuid = $sourceArticle->offer_uuid;
        }

        if ($selectedOfferUuid) {
            try {
                $lasCode = $this->articleCodeService->generateNextLAS($selectedOfferUuid);
            } catch (\Exception $e) {
                // Se non si può generare, lasciare vuoto
            }
        }

        // Ottenere dati dell'offerta se selezionata (per um, pieces_per_package, media e precompilare Converti in Articolo)
        $selectedOffer = null;
        $um = null;
        $piecesPerPackage = null;
        $mediaValues = null;
        $articleDescrFromOffer = null;
        $codArticleClientFromOffer = null;
        $additionalDescrFromOffer = null;

        if ($selectedOfferUuid) {
            $selectedOffer = Offer::where('uuid', $selectedOfferUuid)->first();
            if ($selectedOffer) {
                $um = $selectedOffer->unit_of_measure;
                $piecesPerPackage = $selectedOffer->piece;
                // Calcolare media dall'offerta (simile al legacy)
                $mediaValues = $this->calculateMediaFromOffer($selectedOffer);
                // Converti in Articolo: precompilare con dati dell'offerta quando non c'è articolo sorgente
                if (! $sourceArticle) {
                    $articleDescrFromOffer = $selectedOffer->provisional_description;
                    $codArticleClientFromOffer = $selectedOffer->article_code_ref;
                    $additionalDescrFromOffer = $selectedOffer->notes ?: $selectedOffer->offer_notes;
                }
            }
        }

        return Inertia::render('Articles/Create', [
            'offers' => $formOptions['offers'],
            'categories' => $formOptions['categories'],
            'palletTypes' => $formOptions['palletTypes'],
            'materials' => $formOptions['materials'],
            'machinery' => $formOptions['machinery'],
            'criticalIssues' => $formOptions['criticalIssues'],
            'packagingInstructions' => $formOptions['packagingInstructions'],
            'operatingInstructions' => $formOptions['operatingInstructions'],
            'palletizingInstructions' => $formOptions['palletizingInstructions'],
            'cqModels' => $formOptions['cqModels'],
            'palletSheets' => $formOptions['palletSheets'],
            'lotAttributionList' => $formOptions['lotAttributionList'],
            'expirationAttributionList' => $formOptions['expirationAttributionList'],
            'dbList' => $formOptions['dbList'],
            'labelsExternalList' => $formOptions['labelsExternalList'],
            'labelsPvpList' => $formOptions['labelsPvpList'],
            'labelsIngredientList' => $formOptions['labelsIngredientList'],
            'labelsDataVariableList' => $formOptions['labelsDataVariableList'],
            'labelOfJumpersList' => $formOptions['labelOfJumpersList'],
            'nominalWeightControlList' => $formOptions['nominalWeightControlList'],
            'objectControlWeightList' => $formOptions['objectControlWeightList'],
            'customerSamplesList' => $formOptions['customerSamplesList'],
            'um' => $um,
            'piecesPerPackage' => $piecesPerPackage,
            'mediaValues' => $mediaValues,
            'lasCode' => $lasCode,
            'selectedOfferUuid' => $selectedOfferUuid,
            'sourceArticle' => $sourceArticle,
            'articleDescrFromOffer' => $articleDescrFromOffer,
            'codArticleClientFromOffer' => $codArticleClientFromOffer,
            'additionalDescrFromOffer' => $additionalDescrFromOffer,
        ]);
    }

    /**
     * Store a newly created article.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'offer_uuid' => 'required|exists:offer,uuid',
            'cod_article_las' => 'nullable|string|max:255|unique:articles,cod_article_las',
            'source_article_uuid' => 'nullable|exists:articles,uuid',
            'line_layout_file' => 'nullable|file|max:10240', // 10MB max
            'visibility_cod' => 'nullable|boolean',
            'stock_managed' => 'nullable|boolean',
            'cod_article_client' => 'nullable|string|max:255',
            'article_descr' => 'required|string|max:255',
            'additional_descr' => 'nullable|string',
            'article_category' => 'nullable|string|exists:articlecategory,uuid',
            'um' => 'nullable|string|max:50',
            'lot_attribution' => 'required|integer|in:0,1',
            'expiration_attribution' => 'nullable|integer|in:0,1',
            'ean' => 'nullable|string|max:50',
            'db' => 'nullable|integer|in:0,1,2',
            'labels_external' => 'nullable|integer|in:0,1,2',
            'labels_pvp' => 'nullable|integer|in:0,1,2',
            'value_pvp' => 'nullable|numeric|min:0',
            'labels_ingredient' => 'nullable|integer|in:0,1,2',
            'labels_data_variable' => 'nullable|integer|in:0,1,2',
            'label_of_jumpers' => 'nullable|integer|in:0,1,2',
            'weight_kg' => 'nullable|numeric|min:0',
            'nominal_weight_control' => 'nullable|integer|in:0,1',
            'weight_unit_of_measur' => 'nullable|string|max:50',
            'weight_value' => 'nullable|numeric|min:0',
            'object_control_weight' => 'nullable|integer|in:0,1',
            'allergens' => 'nullable|boolean',
            'pallet_sheet' => 'nullable|string|exists:articlefogliopallet,uuid',
            'model_uuid' => 'required|string|exists:modelscq,uuid',
            'customer_samples_list' => 'nullable|integer|in:0,1',
            'media_reale_cfz_h_pz' => 'nullable|numeric|min:0',
            'production_approval_checkbox' => 'nullable|boolean',
            'production_approval_employee' => 'nullable|string|max:255',
            'production_approval_date' => 'nullable|date',
            'production_approval_notes' => 'nullable|string',
            'approv_quality_checkbox' => 'nullable|boolean',
            'approv_quality_employee' => 'nullable|string|max:255',
            'approv_quality_date' => 'nullable|date',
            'approv_quality_notes' => 'nullable|string',
            'commercial_approval_checkbox' => 'nullable|boolean',
            'commercial_approval_employee' => 'nullable|string|max:255',
            'commercial_approval_date' => 'nullable|date',
            'commercial_approval_notes' => 'nullable|string',
            'client_approval_checkbox' => 'nullable|boolean',
            'client_approval_employee' => 'nullable|string|max:255',
            'client_approval_date' => 'nullable|date',
            'client_approval_notes' => 'nullable|string',
            'db' => 'nullable|string|max:50',
            'line_layout' => 'nullable|string|max:50',
            'weight_kg' => 'nullable|numeric|min:0',
            'length_cm' => 'nullable|numeric|min:0',
            'depth_cm' => 'nullable|numeric|min:0',
            'height_cm' => 'nullable|numeric|min:0',
            'machinery_uuid' => 'nullable|exists:machinery,uuid',
            'packaging_instruct_uuid' => 'nullable|exists:articlesic,uuid',
            'palletizing_instruct_uuid' => 'nullable|exists:articlesip,uuid',
            'operating_instruct_uuid' => 'nullable|exists:articlesio,uuid',
            'labels_external' => ['nullable', 'integer', Rule::enum(OrderLabelStatus::class)],
            'labels_pvp' => ['nullable', 'integer', Rule::enum(OrderLabelStatus::class)],
            'value_pvp' => 'nullable|numeric|min:0',
            'labels_ingredient' => ['nullable', 'integer', Rule::enum(OrderLabelStatus::class)],
            'labels_data_variable' => ['nullable', 'integer', Rule::enum(OrderLabelStatus::class)],
            'label_of_jumpers' => ['nullable', 'integer', Rule::enum(OrderLabelStatus::class)],
            'plan_packaging' => 'nullable|integer|min:0',
            'pallet_plans' => 'nullable|integer|min:0',
            'units_per_neck' => 'nullable|integer|min:0',
            'interlayer_every_floors' => 'nullable|integer|min:0',
            'allergens' => 'nullable|string',
            'article_critical_uuid' => 'nullable|exists:criticalissues,uuid',
            'critical_issues_uuid' => 'nullable|exists:criticalissues,uuid',
            'nominal_weight_control' => 'nullable|boolean',
            'weight_unit_of_measur' => 'nullable|string|max:50',
            'weight_value' => 'nullable|numeric|min:0',
            'object_control_weight' => 'nullable|string|max:255',
            'materials_uuid' => 'nullable|exists:materials,uuid',
            'pallet_uuid' => 'nullable|string|exists:pallettype,uuid',
            'pallet_sheet' => 'nullable|string|max:255',
            'model_uuid' => 'nullable|exists:modelscq,uuid',
            'customer_samples_list' => 'nullable|string',
            'check_material' => 'nullable|boolean',
            // Relaciones many-to-many
            'materials' => 'nullable|array',
            'materials.*' => 'exists:materials,uuid',
            'critical_issues' => 'nullable|array',
            'critical_issues.*' => 'exists:criticalissues,uuid',
            'packaging_instructions' => 'nullable|array',
            'packaging_instructions.*' => 'exists:articlesic,uuid',
            'operating_instructions' => 'nullable|array',
            'operating_instructions.*' => 'exists:articlesio,uuid',
            'palletizing_instructions' => 'nullable|array',
            'palletizing_instructions.*' => 'exists:articlesip,uuid',
            // Machinery con valor (formato legacy)
            'machinery' => 'nullable|array',
            'machinery.*.machinery_uuid' => 'required_with:machinery|exists:machinery,uuid',
            'machinery.*.value' => 'required_with:machinery.*.machinery_uuid|string',
            // CheckMaterials
            'check_materials' => 'nullable|array',
            'check_materials.*.material_uuid' => 'required_with:check_materials|exists:materials,uuid',
            'check_materials.*.um' => 'required_with:check_materials.*.material_uuid|string|max:50',
            'check_materials.*.quantity_expected' => 'required_with:check_materials.*.material_uuid|numeric|min:0',
            'check_materials.*.quantity_effective' => 'required_with:check_materials.*.material_uuid|numeric|min:0',
        ]);

        $result = $this->createArticleAction->execute($validated, $request);

        if ($errorResponse = $this->handleActionError($result)) {
            return $errorResponse;
        }

        return redirect()->route('articles.index')
            ->with('success', 'Articolo creato con successo.');
    }

    /**
     * Display the specified article.
     */
    public function show(Article $article): Response
    {
        $article->load([
            'offer',
            'category',
            'palletType',
            'palletSheet',
            'model',
            'materials',
            'machinery',
            'criticalIssues',
            'packagingInstructions',
            'operatingInstructions',
            'palletizingInstructions',
            'checkMaterials.material',
            'orders',
        ]);

        return Inertia::render('Articles/Show', [
            'article' => $article,
        ]);
    }

    /**
     * Show the form for editing the specified article.
     */
    public function edit(Article $article): Response
    {
        $formOptions = $this->articleRepository->getFormOptions();
        $article = $this->articleRepository->getForEdit($article);

        // Ottenere dati dell'offerta dell'articolo (per um, pieces_per_package, media)
        $selectedOffer = $article->offer;
        $um = $selectedOffer?->unit_of_measure;
        $piecesPerPackage = $selectedOffer?->piece;
        $mediaValues = null;
        $mediaRealePzHPs = 0;

        if ($selectedOffer) {
            $mediaValues = $this->calculateMediaFromOffer($selectedOffer);
            // Calcolare media_reale_pz_h_ps se esiste media_reale_cfz_h_pz
            if ($article->media_reale_cfz_h_pz) {
                $mediaRealePzHPs = $article->media_reale_cfz_h_pz * ($piecesPerPackage ?? 1);
            }
        }

        return Inertia::render('Articles/Edit', [
            'article' => $article,
            'offers' => $formOptions['offers'],
            'categories' => $formOptions['categories'],
            'palletTypes' => $formOptions['palletTypes'],
            'materials' => $formOptions['materials'],
            'machinery' => $formOptions['machinery'],
            'criticalIssues' => $formOptions['criticalIssues'],
            'packagingInstructions' => $formOptions['packagingInstructions'],
            'operatingInstructions' => $formOptions['operatingInstructions'],
            'palletizingInstructions' => $formOptions['palletizingInstructions'],
            'cqModels' => $formOptions['cqModels'],
            'palletSheets' => $formOptions['palletSheets'],
            'lotAttributionList' => $formOptions['lotAttributionList'],
            'expirationAttributionList' => $formOptions['expirationAttributionList'],
            'dbList' => $formOptions['dbList'],
            'labelsExternalList' => $formOptions['labelsExternalList'],
            'labelsPvpList' => $formOptions['labelsPvpList'],
            'labelsIngredientList' => $formOptions['labelsIngredientList'],
            'labelsDataVariableList' => $formOptions['labelsDataVariableList'],
            'labelOfJumpersList' => $formOptions['labelOfJumpersList'],
            'nominalWeightControlList' => $formOptions['nominalWeightControlList'],
            'objectControlWeightList' => $formOptions['objectControlWeightList'],
            'customerSamplesList' => $formOptions['customerSamplesList'],
            'um' => $um,
            'piecesPerPackage' => $piecesPerPackage,
            'mediaValues' => $mediaValues,
            'mediaRealePzHPs' => $mediaRealePzHPs,
        ]);
    }

    /**
     * Update the specified article.
     */
    public function update(Request $request, Article $article)
    {
        $validated = $request->validate([
            'offer_uuid' => 'required|exists:offer,uuid',
            'cod_article_las' => [
                'nullable',
                'string',
                'max:255',
                function ($attribute, $value, $fail) use ($article) {
                    if (! empty($value) && $this->articleCodeService->lasCodeExists($value, $article->id)) {
                        $fail('Il codice LAS esiste già.');
                    }
                },
            ],
            'visibility_cod' => 'nullable|boolean',
            'stock_managed' => 'nullable|boolean',
            'cod_article_client' => 'nullable|string|max:255',
            'article_descr' => 'required|string|max:255',
            'additional_descr' => 'nullable|string',
            'article_category' => 'nullable|exists:articlecategory,uuid',
            'um' => 'nullable|string|max:50',
            'lot_attribution' => 'required|integer|in:0,1',
            'expiration_attribution' => 'nullable|integer|in:0,1',
            'ean' => 'nullable|string|max:50',
            'db' => 'nullable|integer|in:0,1,2',
            'labels_external' => 'nullable|integer|in:0,1,2',
            'labels_pvp' => 'nullable|integer|in:0,1,2',
            'value_pvp' => 'nullable|numeric|min:0',
            'labels_ingredient' => 'nullable|integer|in:0,1,2',
            'labels_data_variable' => 'nullable|integer|in:0,1,2',
            'label_of_jumpers' => 'nullable|integer|in:0,1,2',
            'nominal_weight_control' => 'nullable|integer|in:0,1',
            'weight_unit_of_measur' => 'nullable|string|max:50',
            'weight_value' => 'nullable|numeric|min:0',
            'object_control_weight' => 'nullable|integer|in:0,1',
            'allergens' => 'nullable|boolean',
            'pallet_sheet' => 'nullable|string|exists:articlefogliopallet,uuid',
            'model_uuid' => 'required|string|exists:modelscq,uuid',
            'customer_samples_list' => 'nullable|integer|in:0,1',
            'media_reale_cfz_h_pz' => 'nullable|numeric|min:0',
            'production_approval_checkbox' => 'nullable|boolean',
            'production_approval_employee' => 'nullable|string|max:255',
            'production_approval_date' => 'nullable|date',
            'production_approval_notes' => 'nullable|string',
            'approv_quality_checkbox' => 'nullable|boolean',
            'approv_quality_employee' => 'nullable|string|max:255',
            'approv_quality_date' => 'nullable|date',
            'approv_quality_notes' => 'nullable|string',
            'commercial_approval_checkbox' => 'nullable|boolean',
            'commercial_approval_employee' => 'nullable|string|max:255',
            'commercial_approval_date' => 'nullable|date',
            'commercial_approval_notes' => 'nullable|string',
            'client_approval_checkbox' => 'nullable|boolean',
            'client_approval_employee' => 'nullable|string|max:255',
            'client_approval_date' => 'nullable|date',
            'client_approval_notes' => 'nullable|string',
            'line_layout' => 'nullable|string|max:50',
            'line_layout_file' => 'nullable|file|max:10240', // 10MB max
            'weight_kg' => 'nullable|numeric|min:0',
            'length_cm' => 'nullable|numeric|min:0',
            'depth_cm' => 'nullable|numeric|min:0',
            'height_cm' => 'nullable|numeric|min:0',
            'machinery_uuid' => 'nullable|exists:machinery,uuid',
            'packaging_instruct_uuid' => 'nullable|exists:articlesic,uuid',
            'palletizing_instruct_uuid' => 'nullable|exists:articlesip,uuid',
            'operating_instruct_uuid' => 'nullable|exists:articlesio,uuid',
            'labels_external' => ['nullable', 'integer', Rule::enum(OrderLabelStatus::class)],
            'labels_pvp' => ['nullable', 'integer', Rule::enum(OrderLabelStatus::class)],
            'value_pvp' => 'nullable|numeric|min:0',
            'labels_ingredient' => ['nullable', 'integer', Rule::enum(OrderLabelStatus::class)],
            'labels_data_variable' => ['nullable', 'integer', Rule::enum(OrderLabelStatus::class)],
            'label_of_jumpers' => ['nullable', 'integer', Rule::enum(OrderLabelStatus::class)],
            'plan_packaging' => 'nullable|integer|min:0',
            'pallet_plans' => 'nullable|integer|min:0',
            'units_per_neck' => 'nullable|integer|min:0',
            'interlayer_every_floors' => 'nullable|integer|min:0',
            'allergens' => 'nullable|string',
            'article_critical_uuid' => 'nullable|exists:criticalissues,uuid',
            'critical_issues_uuid' => 'nullable|exists:criticalissues,uuid',
            'nominal_weight_control' => 'nullable|boolean',
            'weight_unit_of_measur' => 'nullable|string|max:50',
            'weight_value' => 'nullable|numeric|min:0',
            'object_control_weight' => 'nullable|string|max:255',
            'materials_uuid' => 'nullable|exists:materials,uuid',
            'pallet_uuid' => 'nullable|string|exists:pallettype,uuid',
            'pallet_sheet' => 'nullable|string|max:255',
            'model_uuid' => 'nullable|exists:modelscq,uuid',
            'customer_samples_list' => 'nullable|string',
            'check_material' => 'nullable|boolean',
            // Aprobaciones
            'production_approval_checkbox' => 'nullable|boolean',
            'production_approval_employee' => 'nullable|string|max:255',
            'production_approval_date' => 'nullable|date',
            'production_approval_notes' => 'nullable|string',
            'approv_quality_checkbox' => 'nullable|boolean',
            'approv_quality_employee' => 'nullable|string|max:255',
            'approv_quality_date' => 'nullable|date',
            'approv_quality_notes' => 'nullable|string',
            'commercial_approval_checkbox' => 'nullable|boolean',
            'commercial_approval_employee' => 'nullable|string|max:255',
            'commercial_approval_date' => 'nullable|date',
            'commercial_approval_notes' => 'nullable|string',
            'client_approval_checkbox' => 'nullable|boolean',
            'client_approval_employee' => 'nullable|string|max:255',
            'client_approval_date' => 'nullable|date',
            'client_approval_notes' => 'nullable|string',
            // Relaciones many-to-many
            'materials' => 'nullable|array',
            'materials.*' => 'exists:materials,uuid',
            'machinery' => 'nullable|array',
            'machinery.*' => 'exists:machinery,uuid',
            'critical_issues' => 'nullable|array',
            'critical_issues.*' => 'exists:criticalissues,uuid',
            'packaging_instructions' => 'nullable|array',
            'packaging_instructions.*' => 'exists:articlesic,uuid',
            'operating_instructions' => 'nullable|array',
            'operating_instructions.*' => 'exists:articlesio,uuid',
            'palletizing_instructions' => 'nullable|array',
            'palletizing_instructions.*' => 'exists:articlesip,uuid',
        ]);

        $article = $this->updateArticleAction->execute($article, $validated, $request);

        return redirect()->route('articles.show', $article)
            ->with('success', 'Articolo aggiornato con successo.');
    }

    /**
     * Remove the specified article (soft delete).
     */
    public function destroy(Article $article)
    {
        // Verificare che non abbia ordini associati
        if ($article->orders()->where('removed', false)->exists()) {
            return back()->withErrors([
                'error' => 'Impossibile eliminare l\'articolo. Ha ordini associati.',
            ]);
        }

        // Soft delete - usare save() per assicurare che si aggiorni correttamente
        $articleUuid = $article->uuid;
        $article->removed = true;
        $article->save();

        // Invalidare cache opzioni formulari ordini e indirizzi di spedizione
        $this->orderRepository->clearFormOptionsCache();
        $this->orderRepository->clearShippingAddressesCache($articleUuid);

        return redirect()->route('articles.index')
            ->with('success', 'Articolo eliminato con successo.');
    }

    /**
     * AJAX endpoint: Get LAS code for an offer.
     */
    public function getLasCode(Request $request)
    {
        return $this->handleJsonErrors(function () use ($request) {
            $validated = $request->validate([
                'offer_uuid' => 'required|exists:offer,uuid',
            ]);

            $lasCode = $this->articleCodeService->generateNextLAS($validated['offer_uuid']);

            return response()->json(['las_code' => $lasCode]);
        });
    }

    /**
     * Calculate media values from offer operations (like legacy).
     */
    private function calculateMediaFromOffer(Offer $offer): array
    {
        $operationLists = \App\Models\OfferOperationList::withoutGlobalScopes()
            ->where('offer_uuid', $offer->uuid)
            ->where('removed', false)
            ->with('operation')
            ->get();

        $totalSec = 0;

        foreach ($operationLists as $operationList) {
            $operation = $operationList->operation;
            if ($operation && $operation->secondi_operazione) {
                $op_total_sec = $operation->secondi_operazione * $operationList->num_op;
                $totalSec += $op_total_sec;
            }
        }

        $unexpected = $totalSec * 0.05;
        $total_theoretical_time = $totalSec + $unexpected;
        $production_time_cfz = ($total_theoretical_time * 8) / 7;

        $production_average_cfz = 0;
        if ($production_time_cfz > 0) {
            $production_average_cfz = 3600 / $production_time_cfz;
        }

        $production_average_pz = $production_average_cfz * ($offer->piece ?? 1);

        return [
            'media_prevista_cfz_h_pz' => round($production_average_cfz, 5),
            'media_prevista_pz_h_ps' => round($production_average_pz, 5),
        ];
    }

    /**
     * Download line layout file for an article.
     */
    public function downloadLineLayoutFile(Article $article)
    {
        if (! $article->line_layout) {
            return back()->withErrors(['error' => 'Nessun file Layout linea trovato per questo articolo.']);
        }

        $path = $this->lineLayoutStoragePath($article);

        // Provare prima con Storage facade
        if (Storage::disk('line_layout')->exists($path)) {
            return Storage::disk('line_layout')->download($path, $article->line_layout);
        }

        // Fallback a filesystem diretto (compatibilità con file esistenti)
        $legacyPath = storage_path('app/line_layout/'.$article->uuid.'/');
        $filePath = $legacyPath.$article->line_layout;

        if (file_exists($filePath)) {
            return response()->download($filePath, $article->line_layout);
        }

        return back()->withErrors(['error' => 'File non trovato.']);
    }

    /**
     * Get the storage path for line layout files.
     */
    private function lineLayoutStoragePath(Article $article): string
    {
        return "{$article->uuid}/{$article->line_layout}";
    }
}
