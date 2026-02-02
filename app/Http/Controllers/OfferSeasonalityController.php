<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreOfferSeasonalityRequest;
use App\Http\Requests\UpdateOfferSeasonalityRequest;
use App\Models\OfferSeasonality;
use App\Repositories\OfferRepository;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OfferSeasonalityController extends Controller
{
    protected OfferRepository $offerRepository;

    public function __construct(OfferRepository $offerRepository)
    {
        $this->offerRepository = $offerRepository;
    }

    public function index(Request $request): Response
    {
        $query = OfferSeasonality::active();

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

        $seasonalities = $query->paginate($request->get('per_page', 15));

        return Inertia::render('OfferSeasonalities/Index', [
            'seasonalities' => $seasonalities,
            'filters' => $request->only(['search', 'sort_by', 'sort_order']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('OfferSeasonalities/Create');
    }

    public function store(StoreOfferSeasonalityRequest $request)
    {
        OfferSeasonality::create($request->validated());

        // Invalidare cache opzioni formulari
        $this->offerRepository->clearFormOptionsCache();

        return redirect()->route('offer-seasonalities.index')
            ->with('success', 'Stagionalità creata con successo.');
    }

    public function show(OfferSeasonality $offerSeasonality): Response
    {
        return Inertia::render('OfferSeasonalities/Show', [
            'seasonality' => $offerSeasonality,
        ]);
    }

    public function edit(OfferSeasonality $offerSeasonality): Response
    {
        return Inertia::render('OfferSeasonalities/Edit', [
            'seasonality' => $offerSeasonality,
        ]);
    }

    public function update(UpdateOfferSeasonalityRequest $request, OfferSeasonality $offerSeasonality)
    {
        $offerSeasonality->update($request->validated());

        return redirect()->route('offer-seasonalities.index')
            ->with('success', 'Stagionalità aggiornata con successo.');
    }

    public function destroy(OfferSeasonality $offerSeasonality)
    {
        // Verificar si tiene ofertas activas
        if ($offerSeasonality->offers()->where('removed', false)->exists()) {
            return back()->withErrors([
                'error' => 'Non è possibile eliminare la stagionalità. Ha offerte associate.',
            ]);
        }

        $offerSeasonality->update(['removed' => true]);

        // Invalidare cache opzioni formulari
        $this->offerRepository->clearFormOptionsCache();

        return redirect()->route('offer-seasonalities.index')
            ->with('success', 'Stagionalità eliminata con successo.');
    }
}
