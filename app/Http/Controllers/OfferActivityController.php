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

        // Invalidare cache opzioni formulari
        $this->offerRepository->clearFormOptionsCache();

        return redirect()->route('offer-activities.index')
            ->with('success', 'Attività creata con successo.');
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
            ->with('success', 'Attività aggiornata con successo.');
    }

    public function destroy(OfferActivity $offerActivity)
    {
        // Verificar si tiene ofertas activas
        if ($offerActivity->offers()->where('removed', false)->exists()) {
            return back()->withErrors([
                'error' => 'Non è possibile eliminare l\'attività. Ha offerte associate.',
            ]);
        }

        $offerActivity->update(['removed' => true]);

        // Invalidare cache opzioni formulari
        $this->offerRepository->clearFormOptionsCache();

        return redirect()->route('offer-activities.index')
            ->with('success', 'Attività eliminata con successo.');
    }
}
