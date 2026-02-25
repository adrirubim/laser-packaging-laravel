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
            // Generate LAS code if not provided
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
                // Verify uniqueness of the provided code
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

            // Extract many-to-many relationships
            $materials = $validated['materials'] ?? [];
            $machinery = $validated['machinery'] ?? [];
            $criticalIssues = $validated['critical_issues'] ?? [];
            $packagingInstructions = $validated['packaging_instructions'] ?? [];
            $operatingInstructions = $validated['operating_instructions'] ?? [];
            $palletizingInstructions = $validated['palletizing_instructions'] ?? [];

            // Handle duplication: copy source article relationships if exists
            $sourceArticleUuid = $validated['source_article_uuid'] ?? null;
            $sourceArticle = $this->articleRepository->getSourceArticleForDuplication($sourceArticleUuid);

            // If duplication and no relationships provided, use those from source article
            if ($sourceArticle) {
                if (empty($materials)) {
                    $materials = $sourceArticle->materials->pluck('uuid')->toArray();
                }
                if (empty($machinery)) {
                    // For machinery, we need to copy with values
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

                // Copy line_layout if it exists in source article and none was provided
                if (empty($validated['line_layout']) && $sourceArticle->line_layout) {
                    $validated['line_layout'] = $sourceArticle->line_layout;
                }
            }

            // Remove relationships and source_article_uuid from validation array
            unset($validated['materials'], $validated['machinery'], $validated['critical_issues'],
                $validated['packaging_instructions'], $validated['operating_instructions'],
                $validated['palletizing_instructions'], $validated['source_article_uuid']);

            // Convert empty strings to null for nullable fields
            foreach (['article_category', 'pallet_uuid'] as $field) {
                if (isset($validated[$field]) && $validated[$field] === '') {
                    $validated[$field] = null;
                }
            }

            // Sync check_approval with client_approval_checkbox (as in legacy)
            if (isset($validated['client_approval_checkbox'])) {
                $validated['check_approval'] = $validated['client_approval_checkbox'] ? 1 : 0;
            }

            // Gestire file line_layout se caricato
            $lineLayoutFile = $request->file('line_layout_file');
            if ($lineLayoutFile) {
                $validated['line_layout'] = $lineLayoutFile->getClientOriginalName();
            }

            // Create article
            $article = Article::create($validated);

            // Save line_layout file if uploaded
            if ($lineLayoutFile) {
                $this->saveLineLayoutFile($article, $lineLayoutFile);
            } elseif ($sourceArticle && $sourceArticle->line_layout) {
                // If duplication, copy the line_layout file
                $this->copyLineLayoutFile($sourceArticle, $article);
            }

            // Sync many-to-many relationships
            $this->syncRelationships($article, [
                'materials' => $materials,
                'machinery' => $machinery,
                'criticalIssues' => $criticalIssues,
                'packagingInstructions' => $packagingInstructions,
                'operatingInstructions' => $operatingInstructions,
                'palletizingInstructions' => $palletizingInstructions,
            ]);

            // Save checkMaterials (hasMany, not many-to-many)
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

            // Refresh the model to load synced relationships
            $article->refresh();
            $article->load('packagingInstructions', 'operatingInstructions', 'palletizingInstructions');

            // Invalidate order form options cache
            $this->orderRepository->clearFormOptionsCache();

            return $article;
        });
    }
}
