<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SetLocale
{
    public function handle(Request $request, Closure $next): Response
    {
        $locales = config('app.available_locales', ['it', 'es', 'en']);
        $locale = $request->session()->get('locale', config('app.locale'));

        if (in_array($locale, $locales, true)) {
            app()->setLocale($locale);
        }

        return $next($request);
    }
}
