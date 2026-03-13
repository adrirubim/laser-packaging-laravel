<?php

namespace App\Http\Controllers;

use App\Http\Resources\ApiResponseResource;
use App\Http\Resources\DashboardResource;
use App\Models\AlertAcknowledgement;
use Domain\Dashboard\Actions\GetDashboardStatsAction;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __construct(
        protected GetDashboardStatsAction $getDashboardStatsAction,
    ) {}

    public function index(Request $request): Response
    {
        $dateFilter = $request->get('date_filter', 'all');

        $stats = $this->getDashboardStatsAction->execute([
            'date_filter' => $dateFilter,
            'customer_uuid' => $request->get('customer_uuid'),
            'statuses' => $request->get('statuses'),
            'start_date' => $request->get('start_date'),
            'end_date' => $request->get('end_date'),
            'user_id' => $request->user()?->id,
        ]);

        $resource = DashboardResource::make($stats);

        return Inertia::render('Dashboard', $resource->toArray($request));
    }

    /**
     * Return dashboard statistics as JSON for AJAX/refresh endpoints.
     */
    public function stats(Request $request)
    {
        $dateFilter = $request->get('date_filter', 'all');

        $stats = $this->getDashboardStatsAction->execute([
            'date_filter' => $dateFilter,
            'customer_uuid' => $request->get('customer_uuid'),
            'statuses' => $request->get('statuses'),
            'start_date' => $request->get('start_date'),
            'end_date' => $request->get('end_date'),
            'user_id' => $request->user()?->id,
        ]);

        $resource = DashboardResource::make($stats);

        return ApiResponseResource::success($resource->toArray($request));
    }

    /**
     * Register that the current user has acknowledged a dashboard alert.
     * The alert will be hidden until its signature changes (e.g. new orders, different count).
     */
    public function acknowledgeAlert(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'alert_key' => ['required', 'string', Rule::in(['overdue', 'suspended', 'autocontrollo'])],
            'signature' => ['required', 'string', 'max:255'],
            'scope_hash' => ['required', 'string', 'max:64'],
        ]);

        $user = $request->user();
        if (! $user) {
            return back();
        }

        AlertAcknowledgement::updateOrCreate(
            [
                'user_id' => $user->id,
                'alert_key' => $validated['alert_key'],
                'scope_hash' => $validated['scope_hash'],
            ],
            [
                'signature' => $validated['signature'],
                'acknowledged_at' => now(),
            ]
        );

        return back();
    }
}
