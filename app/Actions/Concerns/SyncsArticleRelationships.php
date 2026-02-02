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
                        // Fallback: se arriva come UUID semplice (senza valore)
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
                    // Se è vuoto, desincronizzare tutte
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
        // Mantenere compatibilità con filesystem diretto (per test e file esistenti)
        $legacyPath = storage_path('app/line_layout/'.$article->uuid.'/');
        if (! file_exists($legacyPath)) {
            mkdir($legacyPath, 0755, true);
        }

        // Spostare file in percorso legacy
        $file->move($legacyPath, $article->line_layout);

        // Salvare anche con Storage facade (disk line_layout)
        try {
            $path = "{$article->uuid}/{$article->line_layout}";
            Storage::disk('line_layout')->put($path, file_get_contents($legacyPath.$article->line_layout));
        } catch (\Exception $e) {
            // Se Storage fallisce, continuare con filesystem diretto
        }

        // Salvare anche in Storage::disk('local') per consistenza
        try {
            $directory = "line_layout/{$article->uuid}";
            if (! Storage::disk('local')->exists($directory)) {
                Storage::disk('local')->makeDirectory($directory);
            }
            $localPath = "{$directory}/{$article->line_layout}";
            Storage::disk('local')->put($localPath, file_get_contents($legacyPath.$article->line_layout));
        } catch (\Exception $e) {
            // Se fallisce, continuare con filesystem diretto
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

        // Fallback: provare con percorso legacy (compatibilità con file esistenti)
        $legacySourcePath = storage_path("app/line_layout/{$sourceArticle->uuid}/{$sourceArticle->line_layout}");
        $legacyDestinationPath = storage_path("app/line_layout/{$newArticle->uuid}/{$newArticle->line_layout}");

        if (file_exists($legacySourcePath)) {
            // Creare directory di destinazione se non esiste
            $legacyDestinationDir = dirname($legacyDestinationPath);
            if (! file_exists($legacyDestinationDir)) {
                mkdir($legacyDestinationDir, 0755, true);
            }

            // Copiare file
            copy($legacySourcePath, $legacyDestinationPath);

            // Salvare anche in Storage per consistenza futura
            if (Storage::disk('local')->exists($sourcePath) === false) {
                Storage::disk('local')->put($destinationPath, file_get_contents($legacySourcePath));
            }
        }
    }
}
