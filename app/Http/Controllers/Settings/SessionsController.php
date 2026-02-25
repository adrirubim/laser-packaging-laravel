<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class SessionsController extends Controller
{
    public function index(Request $request): Response
    {
        $sessions = collect(
            DB::connection(config('session.connection'))
                ->table(config('session.table'))
                ->where('user_id', $request->user()->id)
                ->orderByDesc('last_activity')
                ->get()
        )->map(function ($session) use ($request) {
            return (object) [
                'id' => $session->id,
                'ip_address' => $session->ip_address,
                'user_agent' => $session->user_agent,
                'last_activity' => $session->last_activity,
                'is_current' => $session->id === $request->session()->getId(),
            ];
        });

        return Inertia::render('settings/sessions', [
            'sessions' => $sessions,
            'lastLoginAt' => $request->user()->last_login_at?->toIso8601String(),
        ]);
    }

    public function destroy(Request $request, string $sessionId): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        if ($sessionId === $request->session()->getId()) {
            return back()->withErrors(['session' => trans('settings.sessions.cannot_revoke_current')]);
        }

        DB::connection(config('session.connection'))
            ->table(config('session.table'))
            ->where('user_id', $request->user()->id)
            ->where('id', $sessionId)
            ->delete();

        return to_route('sessions.index');
    }
}
