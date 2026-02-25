<?php

namespace App\Repositories;

use App\Models\Article;
use App\Models\ArticleCategory;
use App\Models\ArticleIC;
use App\Models\ArticleIO;
use App\Models\ArticleIP;
use App\Models\CriticalIssue;
use App\Models\Machinery;
use App\Models\Material;
use App\Models\ModelSCQ;
use App\Models\Offer;
use App\Models\PalletSheet;
use App\Models\PalletType;
use App\Repositories\Concerns\HasCommonQueries;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;

class ArticleRepository
{
    use HasCommonQueries;

    /**
     * Get paginated articles for index page with filters and search.
     */
    public function getForIndex(Request $request): LengthAwarePaginator
    {
        $query = Article::active()->with([
            'offer' => function ($q) {
                $q->whereNull('deleted_at');
            },
            'category',
            'palletType',
        ]);

        // Filtros
        $this->applyFilter($query, $request, 'offer_uuid');
        $this->applyFilter($query, $request, 'article_category');

        // Ricerca
        $this->applySearch($query, $request, [
            'cod_article_las',
            'article_descr',
            'cod_article_client',
        ]);

        // Ordinamento
        $sortBy = $request->get('sort_by', 'cod_article_las');
        $sortOrder = $request->get('sort_order', 'desc');

        $allowedSorts = ['cod_article_las', 'article_descr', 'cod_article_client'];

        if (in_array($sortBy, $allowedSorts)) {
            $query->orderBy($sortBy, $sortOrder);
        } else {
            $query->orderBy('cod_article_las', 'desc');
        }

        return $this->applyPagination($query, $request);
    }

    /**
     * Get articles for select dropdowns.
     */
    public function getForSelect(): Collection
    {
        return Article::active()
            ->with('offer')
            ->orderBy('cod_article_las')
            ->get(['uuid', 'cod_article_las', 'article_descr', 'offer_uuid']);
    }

    /**
     * Get form options for article forms (create/edit).
     * This method centralizes all the options needed for article forms.
     * Results are cached for 15 minutes to improve performance.
     */
    public function getFormOptions(): array
    {
        return Cache::remember('article_form_options', 900, function () {
            return [
                'offers' => Offer::active()
                    ->whereNull('deleted_at')
                    ->orderBy('offer_number')
                    ->get(['uuid', 'offer_number', 'provisional_description']),
                'categories' => ArticleCategory::active()
                    ->orderBy('name')
                    ->get(['uuid', 'name']),
                'palletTypes' => PalletType::active()
                    ->orderBy('cod')
                    ->get(['uuid', 'cod', 'description']),
                'materials' => Material::active()
                    ->orderBy('cod')
                    ->get(['uuid', 'cod', 'description']),
                'machinery' => Machinery::active()
                    ->with('valueType')
                    ->orderBy('cod')
                    ->get()
                    ->map(function ($machinery) {
                        return [
                            'uuid' => $machinery->uuid,
                            'cod' => $machinery->cod,
                            'description' => $machinery->description,
                            'parameter' => $machinery->parameter,
                            'valuetype' => $machinery->valuetype, // Usa el accessor
                        ];
                    }),
                'criticalIssues' => CriticalIssue::active()
                    ->orderBy('name')
                    ->get(['uuid', 'name']),
                'packagingInstructions' => ArticleIC::active()
                    ->orderBy('code')
                    ->get(['uuid', 'code', 'number']),
                'operatingInstructions' => ArticleIO::active()
                    ->orderBy('code')
                    ->get(['uuid', 'code', 'number']),
                'palletizingInstructions' => ArticleIP::active()
                    ->orderBy('code')
                    ->get(['uuid', 'code', 'number']),
                // Hardcoded list options (as in legacy)
                'lotAttributionList' => [
                    ['key' => 0, 'value' => 'A carico del cliente'],
                    ['key' => 1, 'value' => 'A carico ns.'],
                ],
                'expirationAttributionList' => [
                    ['key' => 0, 'value' => 'A carico del cliente'],
                    ['key' => 1, 'value' => 'A carico ns.'],
                ],
                'dbList' => [
                    ['key' => 0, 'value' => 'A carico del cliente'],
                    ['key' => 1, 'value' => 'A carico ns.'],
                    ['key' => 2, 'value' => 'Entrambi'],
                ],
                'labelsExternalList' => [
                    ['key' => 0, 'value' => 'Non presenti'],
                    ['key' => 1, 'value' => 'Da stampare'],
                    ['key' => 2, 'value' => 'Da ricevere'],
                ],
                'labelsPvpList' => [
                    ['key' => 0, 'value' => 'Non presenti'],
                    ['key' => 1, 'value' => 'Da stampare'],
                    ['key' => 2, 'value' => 'Da ricevere'],
                ],
                'labelsIngredientList' => [
                    ['key' => 0, 'value' => 'Non presenti'],
                    ['key' => 1, 'value' => 'Da stampare'],
                    ['key' => 2, 'value' => 'Da ricevere'],
                ],
                'labelsDataVariableList' => [
                    ['key' => 0, 'value' => 'Non presenti'],
                    ['key' => 1, 'value' => 'Da stampare'],
                    ['key' => 2, 'value' => 'Da ricevere'],
                ],
                'labelOfJumpersList' => [
                    ['key' => 0, 'value' => 'Non presenti'],
                    ['key' => 1, 'value' => 'Da stampare'],
                    ['key' => 2, 'value' => 'Da ricevere'],
                ],
                'nominalWeightControlList' => [
                    ['key' => 0, 'value' => 'CONTROLLO PESO ALMENO'],
                    ['key' => 1, 'value' => 'CONTROLLO CONTENENZA'],
                ],
                'objectControlWeightList' => [
                    ['key' => 0, 'value' => 'PRODOTTO NUDO'],
                    ['key' => 1, 'value' => 'PRODOTTO CON INCARTO PRIMARIO'],
                ],
                'customerSamplesList' => [
                    ['key' => 0, 'value' => 'Pre produzione'],
                    ['key' => 1, 'value' => 'Successive produzioni'],
                ],
                // Modelos CQ y Fogli Pallet
                'cqModels' => ModelSCQ::active()
                    ->orderBy('cod_model')
                    ->get(['uuid', 'cod_model', 'description_model']),
                'palletSheets' => PalletSheet::active()
                    ->orderBy('code')
                    ->get(['uuid', 'code', 'description']),
            ];
        });
    }

    /**
     * Clear the cache for article form options.
     * This should be called when any of the form options are updated.
     */
    public function clearFormOptionsCache(): void
    {
        Cache::forget('article_form_options');
    }

    /**
     * Get article with all relationships for edit form.
     */
    public function getForEdit(Article $article): Article
    {
        return $article->load([
            'offer',
            'category',
            'palletType',
            'materials',
            'machinery' => function ($query) {
                $query->withPivot('value');
            },
            'criticalIssues',
            'packagingInstructions',
            'operatingInstructions',
            'palletizingInstructions',
            'checkMaterials',
        ]);
    }

    /**
     * Get source article for duplication with all relationships.
     */
    public function getSourceArticleForDuplication(?string $sourceArticleUuid): ?Article
    {
        if (! $sourceArticleUuid) {
            return null;
        }

        return Article::where('uuid', $sourceArticleUuid)
            ->with([
                'materials',
                'machinery',
                'criticalIssues',
                'packagingInstructions',
                'operatingInstructions',
                'palletizingInstructions',
                'checkMaterials',
            ])
            ->first();
    }
}
