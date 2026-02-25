<?php

namespace App\Services;

use App\Models\Article;
use App\Models\Offer;
use App\Models\OfferLasFamily;
use Illuminate\Support\Facades\DB;

class ArticleCodeService
{
    /**
     * Genera il prossimo codice LAS nel formato LAS + CF + NNNN
     *
     * Formato: LAS + CF + NNNN
     * - LAS: Prefisso fisso
     * - CF: Codice famiglia (da lasFamily.code)
     * - NNNN: Numero progressivo a 4 cifre (0001, 0002, ...)
     *
     * Esempio: LAS310001
     *
     * @param  string  $offerUuid  UUID dell'offerta (per ottenere la famiglia LAS)
     * @return string Codice LAS generato
     *
     * @throws \Exception Se l'offerta o la famiglia LAS non esiste
     */
    public function generateNextLAS(string $offerUuid): string
    {
        return DB::transaction(function () use ($offerUuid) {
            // Get offer and LAS family
            $offer = Offer::where('uuid', $offerUuid)
                ->where('removed', false)
                ->lockForUpdate()
                ->firstOrFail();

            if (empty($offer->lasfamily_uuid)) {
                throw new \Exception(__('services.article_code.offer_no_las_family'));
            }

            $lasFamily = OfferLasFamily::where('uuid', $offer->lasfamily_uuid)
                ->where('removed', false)
                ->firstOrFail();

            $codFamiglia = $lasFamily->code;

            if (empty($codFamiglia)) {
                throw new \Exception(__('services.article_code.las_family_no_code'));
            }

            // Search all articles with code starting with LAS + CF
            // Use get() and sort in PHP for SQLite compatibility
            $articles = Article::where('cod_article_las', 'like', "LAS{$codFamiglia}%")
                ->where('removed', false)
                ->lockForUpdate()
                ->get();

            // Calculate next progressive number
            $progressive = 1;
            if ($articles->isNotEmpty()) {
                $progressives = [];
                foreach ($articles as $article) {
                    if (! empty($article->cod_article_las)) {
                        $lastLASCode = $article->cod_article_las;
                        // Extract last 4 digits (progressive)
                        $prog = (int) substr($lastLASCode, -4);
                        if ($prog > 0) {
                            $progressives[] = $prog;
                        }
                    }
                }
                if (! empty($progressives)) {
                    $progressive = max($progressives) + 1;
                }
            }

            return sprintf('LAS%s%04d', $codFamiglia, $progressive);
        });
    }

    /**
     * Verifica se un codice LAS esiste già
     *
     * @param  string  $lasCode  Codice da verificare
     * @param  int|null  $excludeArticleId  ID dell'articolo da escludere (per update)
     */
    public function lasCodeExists(string $lasCode, ?int $excludeArticleId = null): bool
    {
        $query = Article::where('cod_article_las', $lasCode)
            ->where('removed', false);

        if ($excludeArticleId !== null) {
            $query->where('id', '!=', $excludeArticleId);
        }

        return $query->exists();
    }
}
