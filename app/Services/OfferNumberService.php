<?php

namespace App\Services;

use App\Models\Offer;
use Illuminate\Support\Facades\DB;

class OfferNumberService
{
    /**
     * Genera el próximo número de oferta en formato YYYY_PPP_NN_L
     *
     * Formato: YYYY_PPP_NN_L
     * - YYYY: Año actual
     * - PPP: Número progresivo a 3 dígitos (001, 002, ...)
     * - NN: Subversión a 2 dígitos (default: "01")
     * - L: Sufijo opcional (default: "A")
     *
     * @param  string|null  $subVersion  Subversión (default: "01")
     * @param  string|null  $suffix  Sufijo (default: "A")
     * @return string Número de oferta generado (ej: "2025_001_01_A")
     */
    public function generateNext(?string $subVersion = null, ?string $suffix = null): string
    {
        return DB::transaction(function () use ($subVersion, $suffix) {
            $year = date('Y');

            // Cercare tutte le offerte dell'anno corrente e ordinarle in PHP
            // (compatible con SQLite y MySQL)
            // Usare whereRaw con escape corretto per il trattino basso in SQLite
            $pattern = str_replace('_', '\\_', "{$year}_%");
            $offers = Offer::whereRaw("offer_number LIKE ? ESCAPE '\\'", [$pattern])
                ->where('removed', false)
                ->lockForUpdate()
                ->get();

            // Calcolare prossimo numero progressivo
            $progressive = 1; // Prima offerta dell'anno
            if ($offers->isNotEmpty()) {
                $progressives = [];
                foreach ($offers as $offer) {
                    if (! empty($offer->offer_number)) {
                        $parts = explode('_', $offer->offer_number);
                        if (isset($parts[1]) && is_numeric($parts[1])) {
                            $progressives[] = (int) $parts[1];
                        }
                    }
                }
                if (! empty($progressives)) {
                    $progressive = max($progressives) + 1;
                }
            }

            // Definire sottoversione e suffisso (valori predefiniti)
            $subVersion = $subVersion ?? '01';
            $suffix = $suffix ?? 'A';

            return sprintf('%s_%03d_%s_%s', $year, $progressive, $subVersion, $suffix);
        });
    }

    /**
     * Verifica si un número de oferta ya existe
     *
     * @param  string  $offerNumber  Número a verificar
     * @param  int|null  $excludeOfferId  ID de la oferta a excluir (para updates)
     */
    public function exists(string $offerNumber, ?int $excludeOfferId = null): bool
    {
        $query = Offer::where('offer_number', $offerNumber)
            ->where('removed', false);

        if ($excludeOfferId !== null) {
            $query->where('id', '!=', $excludeOfferId);
        }

        return $query->exists();
    }
}
