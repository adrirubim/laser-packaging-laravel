<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreOfferTypeRequest;
use App\Http\Requests\UpdateOfferTypeRequest;
use App\Models\OfferType;
use App\Repositories\OfferRepository;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OfferTypeController extends Controller
{
    protected OfferRepository $offerRepository;

    public function __construct(OfferRepository $offerRepository)
    {
        $this->offerRepository = $offerRepository;
    }

    public function index(Request $request): Response
    {
        $query = OfferType::active();

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

        $offerTypes = $query->paginate($request->get('per_page', 15));

        return Inertia::render('OfferTypes/Index', [
            'offerTypes' => $offerTypes,
            'filters' => $request->only(['search', 'sort_by', 'sort_order']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('OfferTypes/Create');
    }

    public function store(StoreOfferTypeRequest $request)
    {
        OfferType::create($request->validated());

        // Invalidare cache opzioni formulari
        $this->offerRepository->clearFormOptionsCache();

        return redirect()->route('offer-types.index')
            ->with('success', 'Tipo di offerta creato con successo.');
    }

    public function show(OfferType $offerType): Response
    {
        return Inertia::render('OfferTypes/Show', [
            'offerType' => $offerType,
        ]);
    }

    public function edit(OfferType $offerType): Response
    {
        return Inertia::render('OfferTypes/Edit', [
            'offerType' => $offerType,
        ]);
    }

    public function update(UpdateOfferTypeRequest $request, OfferType $offerType)
    {
        $offerType->update($request->validated());

        // Invalidare cache opzioni formulari
        $this->offerRepository->clearFormOptionsCache();

        return redirect()->route('offer-types.index')
            ->with('success', 'Tipo di offerta aggiornato con successo.');
    }

    public function destroy(OfferType $offerType)
    {
        // Verificar si tiene ofertas activas
        if ($offerType->offers()->where('removed', false)->exists()) {
            return back()->withErrors([
                'error' => 'Non è possibile eliminare il tipo di offerta. Ha offerte associate.',
            ]);
        }

        $offerType->update(['removed' => true]);

        // Invalidare cache opzioni formulari
        $this->offerRepository->clearFormOptionsCache();

        return redirect()->route('offer-types.index')
            ->with('success', 'Tipo di offerta eliminato con successo.');
    }
}
