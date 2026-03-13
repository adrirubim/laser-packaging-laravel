<?php

declare(strict_types=1);

namespace Domain\Offers\Actions;

use App\Models\Offer;
use Domain\Offers\DTOs\OfferDetailsDto;

class GetOfferDetailsAction
{
    public function execute(Offer $offer): OfferDetailsDto
    {
        // Combinare articoli di entrambe le relazioni (evitando duplicati)
        $allArticles = $offer->articles->merge($offer->articlesDirect)->unique('uuid');

        // Preparare operazioni con informazioni complete (come nel legacy)
        $operationsList = [];
        $totalSec = 0;

        // Load operationList without applying scope that filters by removed
        $operationLists = \App\Models\OfferOperationList::withoutGlobalScopes()
            ->where('offer_uuid', $offer->uuid)
            ->where('removed', false)
            ->with('operation', 'operation.category')
            ->get();

        foreach ($operationLists as $operationList) {
            $operation = $operationList->operation;
            if ($operation === null) {
                continue;
            }

            $category = $operation->category;
            $categoryName = $category !== null ? ($category->code.' - '.$category->name) : '';

            $opTotalSec = (float) ($operation->secondi_operazione ?? 0) * (float) $operationList->num_op;
            $totalSec += $opTotalSec;

            $operationsList[] = [
                'uuid' => $operation->uuid,
                'category' => [
                    'uuid' => $category?->uuid,
                    'name' => $categoryName,
                ],
                'codice_univoco' => $operation->codice_univoco ?? __('common.not_available'),
                'descrizione' => $operation->descrizione ?? __('common.not_available'),
                'secondi_operazione' => $operation->secondi_operazione ?? 0,
                'num_op' => $operationList->num_op,
                'total_sec' => $opTotalSec,
                'filename' => $operation->filename ?? null,
            ];
        }

        // Calculate fields as in legacy
        $unexpected = $totalSec * 0.05;
        $totalTheoreticalTime = $totalSec + $unexpected;

        $theoreticalTime = 0.0;
        if ($offer->piece > 0) {
            $theoreticalTime = $totalTheoreticalTime / (float) $offer->piece;
        }

        $productionTimeCfz = ($totalTheoreticalTime * 8) / 7;

        $productionTime = 0.0;
        if ($offer->piece > 0) {
            $productionTime = $productionTimeCfz / (float) $offer->piece;
        }

        $productionAverageCfz = 0.0;
        if ($productionTimeCfz > 0) {
            $productionAverageCfz = 3600 / $productionTimeCfz;
        }

        $productionAveragePz = $productionAverageCfz * (float) $offer->piece;

        // Calculate rate_cfz and rate_pz (as in Create.tsx)
        $rateCfz = 0.0;
        if ($productionAverageCfz > 0 && $offer->expected_revenue) {
            $rateCfz = (float) $offer->expected_revenue / $productionAverageCfz;
        }

        $ratePz = 0.0;
        if ($offer->piece > 0) {
            $ratePz = $rateCfz / (float) $offer->piece;
        }

        $rateRoundingCfzPerc = 0.0;
        if ($offer->rate_rounding_cfz > 0) {
            $rateRoundingCfzPerc = ((float) $offer->rate_increase_cfz / (float) $offer->rate_rounding_cfz) * 100;
        }

        $finalRateCfz = (float) ($offer->rate_increase_cfz ?? 0) + (float) ($offer->rate_rounding_cfz ?? 0);

        $finalRatePz = 0.0;
        if ($offer->piece > 0) {
            $finalRatePz = $finalRateCfz / (float) $offer->piece;
        }

        $totalRateCfz = $finalRateCfz
            + (float) ($offer->materials_euro ?? 0)
            + (float) ($offer->logistics_euro ?? 0)
            + (float) ($offer->other_euro ?? 0);

        $totalRatePz = 0.0;
        if ($offer->piece > 0) {
            $totalRatePz = $totalRateCfz / (float) $offer->piece;
        }

        // Add calculated fields to model
        $offer->setAttribute('operations', $operationsList);
        $offer->setAttribute('theoretical_time_cfz', $totalSec);
        $offer->setAttribute('unexpected', $unexpected);
        $offer->setAttribute('total_theoretical_time', $totalTheoreticalTime);
        $offer->setAttribute('theoretical_time', $theoreticalTime);
        $offer->setAttribute('production_time_cfz', $productionTimeCfz);
        $offer->setAttribute('production_time', $productionTime);
        $offer->setAttribute('production_average_cfz', $productionAverageCfz);
        $offer->setAttribute('production_average_pz', $productionAveragePz);
        $offer->setAttribute('rate_cfz', $rateCfz);
        $offer->setAttribute('rate_pz', $ratePz);
        $offer->setAttribute('rate_rounding_cfz_perc', $rateRoundingCfzPerc);
        $offer->setAttribute('final_rate_cfz', $finalRateCfz);
        $offer->setAttribute('final_rate_pz', $finalRatePz);
        $offer->setAttribute('total_rate_cfz', $totalRateCfz);
        $offer->setAttribute('total_rate_pz', $totalRatePz);
        $offer->setAttribute('approval_status', $offer->approval_status_label);

        // Ensure relations are included in serialization
        $offer->setRelation('articles', $allArticles);

        // Ensure relations load correctly (do not use loadMissing as it can overwrite)
        // Verify and load relations that might not have been loaded
        if ($offer->activity_uuid && $offer->activity === null) {
            $activity = \App\Models\OfferActivity::withoutGlobalScopes()
                ->where('uuid', $offer->activity_uuid)
                ->first();
            $offer->setRelation('activity', $activity);
        }

        if ($offer->sector_uuid && $offer->sector === null) {
            $sector = \App\Models\OfferSector::withoutGlobalScopes()
                ->where('uuid', $offer->sector_uuid)
                ->first();
            $offer->setRelation('sector', $sector);
        }

        if ($offer->seasonality_uuid && $offer->seasonality === null) {
            $seasonality = \App\Models\OfferSeasonality::withoutGlobalScopes()
                ->where('uuid', $offer->seasonality_uuid)
                ->first();
            $offer->setRelation('seasonality', $seasonality);
        }

        // Ensure UUIDs are explicitly included in serialization
        $offerArray = $offer->toArray();
        $offerArray['activity_uuid'] = $offer->activity_uuid;
        $offerArray['sector_uuid'] = $offer->sector_uuid;
        $offerArray['seasonality_uuid'] = $offer->seasonality_uuid;
        $offerArray['order_type_uuid'] = $offer->order_type_uuid;
        $offerArray['lasfamily_uuid'] = $offer->lasfamily_uuid;
        $offerArray['lasworkline_uuid'] = $offer->lasworkline_uuid;
        $offerArray['lsresource_uuid'] = $offer->lsresource_uuid;
        $offerArray['customerdivision_uuid'] = $offer->customerdivision_uuid;

        // Ensure relations are included in the array
        if ($offer->typeOrder !== null) {
            $offerArray['typeOrder'] = [
                'uuid' => $offer->typeOrder->uuid,
                'name' => $offer->typeOrder->name,
            ];
        }

        if ($offer->lasFamily !== null) {
            $offerArray['lasFamily'] = [
                'uuid' => $offer->lasFamily->uuid,
                'code' => $offer->lasFamily->code,
                'name' => $offer->lasFamily->name,
            ];
        }

        if ($offer->lasWorkLine !== null) {
            $offerArray['lasWorkLine'] = [
                'uuid' => $offer->lasWorkLine->uuid,
                'code' => $offer->lasWorkLine->code,
                'name' => $offer->lasWorkLine->name,
            ];
        }

        if ($offer->lsResource !== null) {
            $offerArray['lsResource'] = [
                'uuid' => $offer->lsResource->uuid,
                'code' => $offer->lsResource->code,
                'name' => $offer->lsResource->name,
            ];
        }

        if ($offer->customerDivision !== null) {
            $offerArray['customerDivision'] = [
                'uuid' => $offer->customerDivision->uuid,
                'name' => $offer->customerDivision->name,
            ];
        }

        return new OfferDetailsDto(
            offer: $offerArray,
        );
    }
}
