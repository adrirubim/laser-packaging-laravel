<?php

namespace App\Actions;

use App\Actions\Concerns\LogsActionErrors;
use App\Actions\Concerns\SyncsArticleRelationships;
use App\Models\Article;
use App\Repositories\ArticleRepository;
use App\Repositories\OrderRepository;
use App\Services\ArticleCodeService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CreateArticleAction
{
    use LogsActionErrors, SyncsArticleRelationships;

    protected ArticleCodeService $articleCodeService;

    protected ArticleRepository $articleRepository;

    protected OrderRepository $orderRepository;

    public function __construct(
        ArticleCodeService $articleCodeService,
        ArticleRepository $articleRepository,
        OrderRepository $orderRepository
    ) {
        $this->articleCodeService = $articleCodeService;
        $this->articleRepository = $articleRepository;
        $this->orderRepository = $orderRepository;
    }

    /**
     * Execute the action to create an article with all its relationships.
     *
     * @param  array  $validated  Validated data from the request
     * @param  Request  $request  Original request for file handling
     * @return Article|array Created article or error response
     */
    public function execute(array $validated, Request $request)
    {
        return DB::transaction(function () use ($validated, $request) {
            // Generare codice LAS se non fornito
            if (empty($validated['cod_article_las'])) {
                try {
                    $validated['cod_article_las'] = $this->articleCodeService->generateNextLAS($validated['offer_uuid']);
                } catch (\Exception $e) {
                    $this->logError('CreateArticleAction::execute', $e, [
                        'offer_uuid' => $validated['offer_uuid'] ?? null,
                        'action' => 'generate_las_code',
                    ]);

                    return [
                        'error' => true,
                        'field' => 'offer_uuid',
                        'message' => $e->getMessage(),
                    ];
                }
            } else {
                // Verificare unicità del codice fornito
                if ($this->articleCodeService->lasCodeExists($validated['cod_article_las'])) {
                    $this->logWarning('CreateArticleAction::execute', 'LAS code already exists', [
                        'cod_article_las' => $validated['cod_article_las'],
                    ]);

                    return [
                        'error' => true,
                        'field' => 'cod_article_las',
                        'message' => __('messages.las_code_exists'),
                    ];
                }
            }

            // Extraer relaciones many-to-many
            $materials = $validated['materials'] ?? [];
            $machinery = $validated['machinery'] ?? [];
            $criticalIssues = $validated['critical_issues'] ?? [];
            $packagingInstructions = $validated['packaging_instructions'] ?? [];
            $operatingInstructions = $validated['operating_instructions'] ?? [];
            $palletizingInstructions = $validated['palletizing_instructions'] ?? [];

            // Gestire duplicazione: copiare relazioni dell'articolo sorgente se esiste
            $sourceArticleUuid = $validated['source_article_uuid'] ?? null;
            $sourceArticle = $this->articleRepository->getSourceArticleForDuplication($sourceArticleUuid);

            // Se è duplicazione e non sono state fornite relazioni, usare quelle dell'articolo sorgente
            if ($sourceArticle) {
                if (empty($materials)) {
                    $materials = $sourceArticle->materials->pluck('uuid')->toArray();
                }
                if (empty($machinery)) {
                    // Para machinery, necesitamos copiar con valores
                    $machinery = $sourceArticle->machinery->map(function ($m) {
                        return [
                            'machinery_uuid' => $m->uuid,
                            'value' => $m->pivot->value ?? '',
                        ];
                    })->toArray();
                }
                if (empty($criticalIssues)) {
                    $criticalIssues = $sourceArticle->criticalIssues->pluck('uuid')->toArray();
                }
                if (empty($packagingInstructions)) {
                    $packagingInstructions = $sourceArticle->packagingInstructions->pluck('uuid')->toArray();
                }
                if (empty($operatingInstructions)) {
                    $operatingInstructions = $sourceArticle->operatingInstructions->pluck('uuid')->toArray();
                }
                if (empty($palletizingInstructions)) {
                    $palletizingInstructions = $sourceArticle->palletizingInstructions->pluck('uuid')->toArray();
                }

                // Copiar line_layout si existe en el artículo fuente y no se proporcionó uno nuevo
                if (empty($validated['line_layout']) && $sourceArticle->line_layout) {
                    $validated['line_layout'] = $sourceArticle->line_layout;
                }
            }

            // Remover relaciones y source_article_uuid del array de validación
            unset($validated['materials'], $validated['machinery'], $validated['critical_issues'],
                $validated['packaging_instructions'], $validated['operating_instructions'],
                $validated['palletizing_instructions'], $validated['source_article_uuid']);

            // Convertir strings vacíos a null para campos nullable
            foreach (['article_category', 'pallet_uuid'] as $field) {
                if (isset($validated[$field]) && $validated[$field] === '') {
                    $validated[$field] = null;
                }
            }

            // Sincronizar check_approval con client_approval_checkbox (como en el legacy)
            if (isset($validated['client_approval_checkbox'])) {
                $validated['check_approval'] = $validated['client_approval_checkbox'] ? 1 : 0;
            }

            // Gestire file line_layout se caricato
            $lineLayoutFile = $request->file('line_layout_file');
            if ($lineLayoutFile) {
                $validated['line_layout'] = $lineLayoutFile->getClientOriginalName();
            }

            // Creare articolo
            $article = Article::create($validated);

            // Salvare file line_layout se caricato
            if ($lineLayoutFile) {
                $this->saveLineLayoutFile($article, $lineLayoutFile);
            } elseif ($sourceArticle && $sourceArticle->line_layout) {
                // Se è duplicazione, copiare il file line_layout
                $this->copyLineLayoutFile($sourceArticle, $article);
            }

            // Sincronizar relaciones many-to-many
            $this->syncRelationships($article, [
                'materials' => $materials,
                'machinery' => $machinery,
                'criticalIssues' => $criticalIssues,
                'packagingInstructions' => $packagingInstructions,
                'operatingInstructions' => $operatingInstructions,
                'palletizingInstructions' => $palletizingInstructions,
            ]);

            // Salvare checkMaterials (hasMany, non many-to-many)
            $checkMaterials = $validated['check_materials'] ?? [];
            if (! empty($checkMaterials)) {
                foreach ($checkMaterials as $checkMaterialData) {
                    if (isset($checkMaterialData['material_uuid'], $checkMaterialData['um'],
                        $checkMaterialData['quantity_expected'], $checkMaterialData['quantity_effective'])) {
                        \App\Models\ArticleCheckMaterial::create([
                            'uuid' => (string) \Illuminate\Support\Str::uuid(),
                            'article_uuid' => $article->uuid,
                            'material_uuid' => $checkMaterialData['material_uuid'],
                            'um' => $checkMaterialData['um'],
                            'quantity_expected' => $checkMaterialData['quantity_expected'],
                            'quantity_effective' => $checkMaterialData['quantity_effective'],
                            'removed' => false,
                        ]);
                    }
                }
            }

            // Refrescar el modelo para cargar las relaciones sincronizadas
            $article->refresh();
            $article->load('packagingInstructions', 'operatingInstructions', 'palletizingInstructions');

            // Invalidare cache opzioni formulari ordini
            $this->orderRepository->clearFormOptionsCache();

            return $article;
        });
    }
}
