<?php

namespace App\Actions\Concerns;

use App\Models\Article;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

trait SyncsArticleRelationships
{
    /**
     * Sync multiple relationships with UUID pivot data.
     */
    protected function syncRelationships(Article $article, array $relationships): void
    {
        // Sincronizzare machinery con valore (formato speciale del legacy)
        if (isset($relationships['machinery'])) {
            if (empty($relationships['machinery'])) {
                $article->machinery()->sync([]);
            } else {
                // Machinery arriva come array di oggetti con machinery_uuid e value
                $pivotData = [];
                foreach ($relationships['machinery'] as $machineryData) {
                    if (is_array($machineryData) && isset($machineryData['machinery_uuid']) && isset($machineryData['value'])) {
                        $pivotData[$machineryData['machinery_uuid']] = [
                            'uuid' => (string) Str::uuid(),
                            'value' => $machineryData['value'],
                            'removed' => false,
                        ];
                    } elseif (is_string($machineryData)) {
                        // Fallback: if it comes as plain UUID (without value)
                        $pivotData[$machineryData] = [
                            'uuid' => (string) Str::uuid(),
                            'value' => '',
                            'removed' => false,
                        ];
                    }
                }
                $article->machinery()->sync($pivotData);
            }
        }

        // Sync relationships that use sync() method (materials, criticalIssues)
        foreach (['materials', 'criticalIssues'] as $relation) {
            if (isset($relationships[$relation])) {
                if (empty($relationships[$relation])) {
                    // If empty, unsync all
                    $article->$relation()->sync([]);
                } else {
                    $pivotData = [];
                    foreach ($relationships[$relation] as $uuid) {
                        $pivotData[$uuid] = [
                            'uuid' => (string) Str::uuid(),
                            'removed' => false,
                        ];
                    }
                    $article->$relation()->sync($pivotData);
                }
            }
        }

        // Sync instruction relationships that use attach() method
        foreach (['packagingInstructions', 'operatingInstructions', 'palletizingInstructions'] as $relation) {
            if (isset($relationships[$relation])) {
                // First detach all existing relationships
                $article->$relation()->detach();

                if (! empty($relationships[$relation])) {
                    foreach ($relationships[$relation] as $instructionUuid) {
                        $article->$relation()->attach($instructionUuid, [
                            'uuid' => (string) Str::uuid(),
                            'removed' => false,
                        ]);
                    }
                }
            }
        }
    }

    /**
     * Save line layout file to storage.
     * Maintains compatibility with legacy file system.
     */
    protected function saveLineLayoutFile(Article $article, $file): void
    {
        // Maintain direct filesystem compatibility (for tests and existing files)
        $legacyPath = storage_path('app/line_layout/'.$article->uuid.'/');
        if (! file_exists($legacyPath)) {
            mkdir($legacyPath, 0755, true);
        }

        // Move file to legacy path
        $file->move($legacyPath, $article->line_layout);

        // Save also with Storage facade (disk line_layout)
        try {
            $path = "{$article->uuid}/{$article->line_layout}";
            Storage::disk('line_layout')->put($path, file_get_contents($legacyPath.$article->line_layout));
        } catch (\Exception $e) {
            // If Storage fails, continue with direct filesystem
        }

        // Save also in Storage::disk('local') for consistency
        try {
            $directory = "line_layout/{$article->uuid}";
            if (! Storage::disk('local')->exists($directory)) {
                Storage::disk('local')->makeDirectory($directory);
            }
            $localPath = "{$directory}/{$article->line_layout}";
            Storage::disk('local')->put($localPath, file_get_contents($legacyPath.$article->line_layout));
        } catch (\Exception $e) {
            // If it fails, continue with direct filesystem
        }
    }

    /**
     * Copy line layout file from source article to new article.
     */
    protected function copyLineLayoutFile(Article $sourceArticle, Article $newArticle): void
    {
        // Provare prima con Storage facade (nuovo metodo)
        $sourcePath = "line_layout/{$sourceArticle->uuid}/{$sourceArticle->line_layout}";
        $destinationPath = "line_layout/{$newArticle->uuid}/{$newArticle->line_layout}";

        if (Storage::disk('local')->exists($sourcePath)) {
            Storage::disk('local')->copy($sourcePath, $destinationPath);

            return;
        }

        // Fallback: try with legacy path (compatibility with existing files)
        $legacySourcePath = storage_path("app/line_layout/{$sourceArticle->uuid}/{$sourceArticle->line_layout}");
        $legacyDestinationPath = storage_path("app/line_layout/{$newArticle->uuid}/{$newArticle->line_layout}");

        if (file_exists($legacySourcePath)) {
            // Create destination directory if it doesn't exist
            $legacyDestinationDir = dirname($legacyDestinationPath);
            if (! file_exists($legacyDestinationDir)) {
                mkdir($legacyDestinationDir, 0755, true);
            }

            // Copy file
            copy($legacySourcePath, $legacyDestinationPath);

            // Save also in Storage for future consistency
            if (Storage::disk('local')->exists($sourcePath) === false) {
                Storage::disk('local')->put($destinationPath, file_get_contents($legacySourcePath));
            }
        }
    }
}
