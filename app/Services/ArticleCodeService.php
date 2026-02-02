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
            // Ottenere offerta e famiglia LAS
            $offer = Offer::where('uuid', $offerUuid)
                ->where('removed', false)
                ->lockForUpdate()
                ->firstOrFail();

            if (empty($offer->lasfamily_uuid)) {
                throw new \Exception('La oferta no tiene una familia LAS asignada');
            }

            $lasFamily = OfferLasFamily::where('uuid', $offer->lasfamily_uuid)
                ->where('removed', false)
                ->firstOrFail();

            $codFamiglia = $lasFamily->code;

            if (empty($codFamiglia)) {
                throw new \Exception('La famiglia LAS non ha codice assegnato');
            }

            // Cercare tutti gli articoli con codice che inizia con LAS + CF
            // Usare get() e ordinare in PHP per compatibilità con SQLite
            $articles = Article::where('cod_article_las', 'like', "LAS{$codFamiglia}%")
                ->where('removed', false)
                ->lockForUpdate()
                ->get();

            // Calcolare prossimo numero progressivo
            $progressive = 1;
            if ($articles->isNotEmpty()) {
                $progressives = [];
                foreach ($articles as $article) {
                    if (! empty($article->cod_article_las)) {
                        $lastLASCode = $article->cod_article_las;
                        // Extraer últimos 4 dígitos (progresivo)
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
