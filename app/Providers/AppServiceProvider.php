<?php

namespace App\Providers;

use App\Models\Article;
use App\Models\ArticleCategory;
use App\Models\ArticleIC;
use App\Models\ArticleIO;
use App\Models\ArticleIP;
use App\Models\CriticalIssue;
use App\Models\Offer;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Route model binding for article instructions
        Route::bind('packagingInstruction', function ($value) {
            return ArticleIC::where('uuid', $value)->where('removed', false)->firstOrFail();
        });

        Route::bind('operationalInstruction', function ($value) {
            return ArticleIO::where('uuid', $value)->where('removed', false)->firstOrFail();
        });

        Route::bind('palletizationInstruction', function ($value) {
            return ArticleIP::where('uuid', $value)->where('removed', false)->firstOrFail();
        });

        Route::bind('cqModel', function ($value) {
            // Verify value is valid UUID before querying database
            if (! \Illuminate\Support\Str::isUuid($value)) {
                abort(404);
            }

            return \App\Models\ModelSCQ::where('uuid', $value)->where('removed', false)->firstOrFail();
        });

        Route::bind('palletSheet', function ($value) {
            return \App\Models\PalletSheet::where('uuid', $value)->where('removed', false)->firstOrFail();
        });

        Route::bind('offer', function ($value) {
            return Offer::where('uuid', $value)->whereNull('deleted_at')->firstOrFail();
        });

        Route::bind('articleCategory', function ($value) {
            return ArticleCategory::where('uuid', $value)->where('removed', false)->firstOrFail();
        });

        Route::bind('article', function ($value) {
            return Article::where('uuid', $value)->whereNull('deleted_at')->firstOrFail();
        });

        Route::bind('criticalIssue', function ($value) {
            return CriticalIssue::where('uuid', $value)->where('removed', false)->whereNull('deleted_at')->firstOrFail();
        });
    }
}
