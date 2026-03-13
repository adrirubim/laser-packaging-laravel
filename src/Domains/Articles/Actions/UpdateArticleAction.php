<?php

declare(strict_types=1);

namespace Domain\Articles\Actions;

use App\Actions\Concerns\LogsActionErrors;
use App\Actions\Concerns\SyncsArticleRelationships;
use App\Models\Article;
use App\Models\ArticleCheckMaterial;
use App\Repositories\OrderRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class UpdateArticleAction
{
    use LogsActionErrors;
    use SyncsArticleRelationships;

    public function __construct(
        protected OrderRepository $orderRepository,
    ) {}

    public function execute(Article $article, array $validated, Request $request): Article
    {
        return DB::transaction(function () use ($article, $validated, $request) {
            $materials = $validated['materials'] ?? [];
            $machinery = $validated['machinery'] ?? [];
            $criticalIssues = $validated['critical_issues'] ?? [];
            $packagingInstructions = $validated['packaging_instructions'] ?? [];
            $operatingInstructions = $validated['operating_instructions'] ?? [];
            $palletizingInstructions = $validated['palletizing_instructions'] ?? [];
            $checkMaterials = $validated['check_materials'] ?? [];

            unset(
                $validated['materials'],
                $validated['machinery'],
                $validated['critical_issues'],
                $validated['packaging_instructions'],
                $validated['operating_instructions'],
                $validated['palletizing_instructions'],
                $validated['check_materials']
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
                if ($article->line_layout) {
                    $oldPath = "{$article->uuid}/{$article->line_layout}";
                    if (Storage::disk('line_layout')->exists($oldPath)) {
                        Storage::disk('line_layout')->delete($oldPath);
                    }

                    $legacyOldPath = storage_path('app/line_layout/'.$article->uuid.'/');
                    $legacyOldFile = $legacyOldPath.$article->line_layout;
                    if (file_exists($legacyOldFile)) {
                        unlink($legacyOldFile);
                    }
                }

                $validated['line_layout'] = $lineLayoutFile->getClientOriginalName();
            }

            $article->update($validated);

            if ($lineLayoutFile) {
                $this->saveLineLayoutFile($article, $lineLayoutFile);
            }

            $this->syncRelationships($article, [
                'materials' => $materials,
                'machinery' => $machinery,
                'criticalIssues' => $criticalIssues,
                'packagingInstructions' => $packagingInstructions,
                'operatingInstructions' => $operatingInstructions,
                'palletizingInstructions' => $palletizingInstructions,
            ]);

            $article->checkMaterials()->delete();
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
            $this->orderRepository->clearShippingAddressesCache($article->uuid);

            return $article;
        });
    }
}
