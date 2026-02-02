<?php

namespace App\Repositories;

use App\Models\OfferActivity;
use App\Models\OfferLasFamily;
use App\Models\OfferLasWorkLine;
use App\Models\OfferLsResource;
use App\Models\OfferOperationCategory;
use App\Models\OfferSeasonality;
use App\Models\OfferSector;
use App\Models\OfferTypeOrder;
use Illuminate\Support\Facades\Cache;

class OfferRepository
{
    /**
     * Get all form options for offer forms (cached).
     *
     * These options change rarely, so we use a longer TTL (1 hour).
     */
    public function getFormOptions(): array
    {
        return Cache::remember('offer_form_options', 3600, function () {
            return [
                'activities' => OfferActivity::withoutGlobalScopes()
                    ->where('removed', false)
                    ->orderBy('name')
                    ->get(['uuid', 'name']),

                'sectors' => OfferSector::withoutGlobalScopes()
                    ->where('removed', false)
                    ->orderBy('name')
                    ->get(['uuid', 'name']),

                'seasonalities' => OfferSeasonality::withoutGlobalScopes()
                    ->where('removed', false)
                    ->orderBy('name')
                    ->get(['uuid', 'name']),

                'orderTypes' => OfferTypeOrder::withoutGlobalScopes()
                    ->where('removed', false)
                    ->orderBy('name')
                    ->get(['uuid', 'name']),

                'lasFamilies' => OfferLasFamily::withoutGlobalScopes()
                    ->where('removed', false)
                    ->orderBy('code')
                    ->get(['uuid', 'code', 'name']),

                'lasWorkLines' => OfferLasWorkLine::withoutGlobalScopes()
                    ->where('removed', false)
                    ->orderBy('code')
                    ->get(['uuid', 'code', 'name']),

                'lsResources' => OfferLsResource::withoutGlobalScopes()
                    ->where('removed', false)
                    ->orderBy('code')
                    ->get(['uuid', 'code', 'name']),

                'operationCategories' => OfferOperationCategory::active()
                    ->orderBy('name')
                    ->get(['uuid', 'code', 'name']),
            ];
        });
    }

    /**
     * Clear the form options cache.
     *
     * This should be called when any of the form options are created, updated, or deleted.
     */
    public function clearFormOptionsCache(): void
    {
        Cache::forget('offer_form_options');
    }
}
