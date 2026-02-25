<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreOfferActivityRequest;
use App\Http\Requests\UpdateOfferActivityRequest;
use App\Models\OfferActivity;
use App\Repositories\OfferRepository;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OfferActivityController extends Controller
{
    protected OfferRepository $offerRepository;

    public function __construct(OfferRepository $offerRepository)
    {
        $this->offerRepository = $offerRepository;
    }

    public function index(Request $request): Response
    {
        $query = OfferActivity::active();

        if ($request->has('search')) {
            $search = $request->get('search');
            $query->where('name', 'like', "%{$search}%");
        }

        // Ordinamento
        $sortBy = $request->get('sort_by', 'name');
        $sortOrder = $request->get('sort_order', 'asc');

        $allowedSortColumns = ['name', 'created_at'];
        if (in_array($sortBy, $allowedSortColumns)) {
            $query->orderBy($sortBy, $sortOrder);
        } else {
            $query->orderBy('name', 'asc');
        }

        $activities = $query->paginate($request->get('per_page', 15));

        return Inertia::render('OfferActivities/Index', [
            'activities' => $activities,
            'filters' => $request->only(['search', 'sort_by', 'sort_order']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('OfferActivities/Create');
    }

    public function store(StoreOfferActivityRequest $request)
    {
        OfferActivity::create($request->validated());

        // Invalidate form options cache
        $this->offerRepository->clearFormOptionsCache();

        return redirect()->route('offer-activities.index')
            ->with('success', __('flash.offer_activity.created'));
    }

    public function show(OfferActivity $offerActivity): Response
    {
        return Inertia::render('OfferActivities/Show', [
            'activity' => $offerActivity,
        ]);
    }

    public function edit(OfferActivity $offerActivity): Response
    {
        return Inertia::render('OfferActivities/Edit', [
            'activity' => $offerActivity,
        ]);
    }

    public function update(UpdateOfferActivityRequest $request, OfferActivity $offerActivity)
    {
        $offerActivity->update($request->validated());

        return redirect()->route('offer-activities.index')
            ->with('success', __('flash.offer_activity.updated'));
    }

    public function destroy(OfferActivity $offerActivity)
    {
        // Verify if has active offers
        if ($offerActivity->offers()->where('removed', false)->exists()) {
            return back()->withErrors([
                'error' => __('flash.cannot_delete_activity'),
            ]);
        }

        $offerActivity->update(['removed' => true]);

        // Invalidate form options cache
        $this->offerRepository->clearFormOptionsCache();

        return redirect()->route('offer-activities.index')
            ->with('success', __('flash.offer_activity.deleted'));
    }
}
