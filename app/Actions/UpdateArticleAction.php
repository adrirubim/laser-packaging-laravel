<?php

namespace App\Actions;

use App\Actions\Concerns\LogsActionErrors;
use App\Actions\Concerns\SyncsArticleRelationships;
use App\Models\Article;
use App\Repositories\OrderRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class UpdateArticleAction
{
    use LogsActionErrors, SyncsArticleRelationships;

    protected OrderRepository $orderRepository;

    public function __construct(OrderRepository $orderRepository)
    {
        $this->orderRepository = $orderRepository;
    }

    /**
     * Execute the action to update an article with all its relationships.
     *
     * @param  Article  $article  Article to update
     * @param  array  $validated  Validated data from the request
     * @param  Request  $request  Original request for file handling
     * @return Article Updated article
     */
    public function execute(Article $article, array $validated, Request $request): Article
    {
        return DB::transaction(function () use ($article, $validated, $request) {
            // Extract many-to-many relationships
            $materials = $validated['materials'] ?? [];
            $machinery = $validated['machinery'] ?? [];
            $criticalIssues = $validated['critical_issues'] ?? [];
            $packagingInstructions = $validated['packaging_instructions'] ?? [];
            $operatingInstructions = $validated['operating_instructions'] ?? [];
            $palletizingInstructions = $validated['palletizing_instructions'] ?? [];
            $checkMaterials = $validated['check_materials'] ?? [];

            // Remove relationships from validation array
            unset($validated['materials'], $validated['machinery'], $validated['critical_issues'],
                $validated['packaging_instructions'], $validated['operating_instructions'],
                $validated['palletizing_instructions'], $validated['check_materials']);

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

            // Handle line_layout file if uploaded
            $lineLayoutFile = $request->file('line_layout_file');
            if ($lineLayoutFile) {
                // Remove previous file if exists (Storage facade - disk line_layout)
                if ($article->line_layout) {
                    $oldPath = "{$article->uuid}/{$article->line_layout}";
                    if (Storage::disk('line_layout')->exists($oldPath)) {
                        Storage::disk('line_layout')->delete($oldPath);
                    }

                    // Also remove legacy file if exists (backward compatibility)
                    $legacyOldPath = storage_path('app/line_layout/'.$article->uuid.'/');
                    $legacyOldFile = $legacyOldPath.$article->line_layout;
                    if (file_exists($legacyOldFile)) {
                        unlink($legacyOldFile);
                    }
                }

                $validated['line_layout'] = $lineLayoutFile->getClientOriginalName();
            }

            // Update article
            $article->update($validated);

            // Save line_layout file if uploaded
            if ($lineLayoutFile) {
                $this->saveLineLayoutFile($article, $lineLayoutFile);
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

            // Save checkMaterials (hasMany, legacy format)
            $article->checkMaterials()->delete();
            if (! empty($checkMaterials)) {
                foreach ($checkMaterials as $checkMaterialData) {
                    if (
                        isset(
                            $checkMaterialData['material_uuid'],
                            $checkMaterialData['um'],
                            $checkMaterialData['quantity_expected'],
                            $checkMaterialData['quantity_effective']
                        )
                    ) {
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

            // Invalidate order form options and shipping address cache
            $this->orderRepository->clearFormOptionsCache();
            $this->orderRepository->clearShippingAddressesCache($article->uuid);

            return $article;
        });
    }
}
