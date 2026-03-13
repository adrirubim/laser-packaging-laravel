<?php

declare(strict_types=1);

namespace Domain\Articles\Actions;

use App\Actions\Concerns\LogsActionErrors;
use App\Actions\Concerns\SyncsArticleRelationships;
use App\Models\Article;
use App\Models\ArticleCheckMaterial;
use App\Repositories\ArticleRepository;
use App\Repositories\OrderRepository;
use App\Services\ArticleCodeService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CreateArticleAction
{
    use LogsActionErrors;
    use SyncsArticleRelationships;

    public function __construct(
        protected ArticleCodeService $articleCodeService,
        protected ArticleRepository $articleRepository,
        protected OrderRepository $orderRepository,
    ) {}

    /**
     * @return Article|array
     */
    public function execute(array $validated, Request $request)
    {
        return DB::transaction(function () use ($validated, $request) {
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

            $materials = $validated['materials'] ?? [];
            $machinery = $validated['machinery'] ?? [];
            $criticalIssues = $validated['critical_issues'] ?? [];
            $packagingInstructions = $validated['packaging_instructions'] ?? [];
            $operatingInstructions = $validated['operating_instructions'] ?? [];
            $palletizingInstructions = $validated['palletizing_instructions'] ?? [];

            $sourceArticleUuid = $validated['source_article_uuid'] ?? null;
            $sourceArticle = $this->articleRepository->getSourceArticleForDuplication($sourceArticleUuid);

            if ($sourceArticle) {
                if ($materials === []) {
                    $materials = $sourceArticle->materials->pluck('uuid')->toArray();
                }
                if ($machinery === []) {
                    $machinery = $sourceArticle->machinery->map(static function ($m): array {
                        return [
                            'machinery_uuid' => $m->uuid,
                            'value' => $m->pivot->value ?? '',
                        ];
                    })->toArray();
                }
                if ($criticalIssues === []) {
                    $criticalIssues = $sourceArticle->criticalIssues->pluck('uuid')->toArray();
                }
                if ($packagingInstructions === []) {
                    $packagingInstructions = $sourceArticle->packagingInstructions->pluck('uuid')->toArray();
                }
                if ($operatingInstructions === []) {
                    $operatingInstructions = $sourceArticle->operatingInstructions->pluck('uuid')->toArray();
                }
                if ($palletizingInstructions === []) {
                    $palletizingInstructions = $sourceArticle->palletizingInstructions->pluck('uuid')->toArray();
                }

                if (empty($validated['line_layout']) && $sourceArticle->line_layout) {
                    $validated['line_layout'] = $sourceArticle->line_layout;
                }
            }

            unset(
                $validated['materials'],
                $validated['machinery'],
                $validated['critical_issues'],
                $validated['packaging_instructions'],
                $validated['operating_instructions'],
                $validated['palletizing_instructions'],
                $validated['source_article_uuid']
            );

            foreach (['article_category', 'pallet_uuid'] as $field) {
                if (isset($validated[$field]) && $validated[$field] === '') {
                    $validated[$field] = null;
                }
            }

            if (isset($validated['client_approval_checkbox'])) {
                $validated['check_approval'] = $validated['client_approval_checkbox'] ? 1 : 0;
            }

            $lineLayoutFile = $request->file('line_layout_file');
            if ($lineLayoutFile) {
                $validated['line_layout'] = $lineLayoutFile->getClientOriginalName();
            }

            $article = Article::create($validated);

            if ($lineLayoutFile) {
                $this->saveLineLayoutFile($article, $lineLayoutFile);
            } elseif ($sourceArticle && $sourceArticle->line_layout) {
                $this->copyLineLayoutFile($sourceArticle, $article);
            }

            $this->syncRelationships($article, [
                'materials' => $materials,
                'machinery' => $machinery,
                'criticalIssues' => $criticalIssues,
                'packagingInstructions' => $packagingInstructions,
                'operatingInstructions' => $operatingInstructions,
                'palletizingInstructions' => $palletizingInstructions,
            ]);

            $checkMaterials = $validated['check_materials'] ?? [];
            if ($checkMaterials !== []) {
                foreach ($checkMaterials as $checkMaterialData) {
                    if (isset(
                        $checkMaterialData['material_uuid'],
                        $checkMaterialData['um'],
                        $checkMaterialData['quantity_expected'],
                        $checkMaterialData['quantity_effective']
                    )) {
                        ArticleCheckMaterial::create([
                            'uuid' => (string) Str::uuid(),
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

            $article->refresh();
            $article->load('packagingInstructions', 'operatingInstructions', 'palletizingInstructions');

            $this->orderRepository->clearFormOptionsCache();

            return $article;
        });
    }
}
