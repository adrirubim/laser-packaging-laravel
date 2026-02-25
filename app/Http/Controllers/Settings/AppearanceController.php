<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\PreferencesUpdateRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Inertia\Inertia;
use Inertia\Response;

class AppearanceController extends Controller
{
    public function edit(Request $request): Response
    {
        $user = $request->user();
        $preferences = $user->preferences ?? [];

        return Inertia::render('settings/appearance', [
            'preferences' => [
                'theme' => Arr::get($preferences, 'theme', 'system'),
                'locale' => Arr::get($preferences, 'locale', config('app.locale')),
                'timezone' => Arr::get($preferences, 'timezone', config('app.timezone')),
                'date_format' => Arr::get($preferences, 'date_format', 'd/m/Y'),
            ],
        ]);
    }

    public function update(PreferencesUpdateRequest $request): RedirectResponse
    {
        $user = $request->user();
        $validated = $request->validated();

        $preferences = $user->preferences ?? [];
        foreach (['theme', 'locale', 'timezone', 'date_format'] as $key) {
            if (array_key_exists($key, $validated)) {
                $preferences[$key] = $validated[$key];
            }
        }
        $user->preferences = $preferences;
        $user->save();

        if (isset($validated['locale'])) {
            $request->session()->put('locale', $validated['locale']);
        }

        return to_route('appearance.edit');
    }
}
