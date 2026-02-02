<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreOfferSectorRequest;
use App\Http\Requests\UpdateOfferSectorRequest;
use App\Models\OfferSector;
use App\Repositories\OfferRepository;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OfferSectorController extends Controller
{
    protected OfferRepository $offerRepository;

    public function __construct(OfferRepository $offerRepository)
    {
        $this->offerRepository = $offerRepository;
    }

    public function index(Request $request): Response
    {
        $query = OfferSector::active();

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

        $sectors = $query->paginate($request->get('per_page', 15));

        return Inertia::render('OfferSectors/Index', [
            'sectors' => $sectors,
            'filters' => $request->only(['search', 'sort_by', 'sort_order']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('OfferSectors/Create');
    }

    public function store(StoreOfferSectorRequest $request)
    {
        OfferSector::create($request->validated());

        // Invalidare cache opzioni formulari
        $this->offerRepository->clearFormOptionsCache();

        return redirect()->route('offer-sectors.index')
            ->with('success', 'Settore creato con successo.');
    }

    public function show(OfferSector $offerSector): Response
    {
        return Inertia::render('OfferSectors/Show', [
            'sector' => $offerSector,
        ]);
    }

    public function edit(OfferSector $offerSector): Response
    {
        return Inertia::render('OfferSectors/Edit', [
            'sector' => $offerSector,
        ]);
    }

    public function update(UpdateOfferSectorRequest $request, OfferSector $offerSector)
    {
        $offerSector->update($request->validated());

        return redirect()->route('offer-sectors.index')
            ->with('success', 'Settore aggiornato con successo.');
    }

    public function destroy(OfferSector $offerSector)
    {
        // Verificar si tiene ofertas activas
        if ($offerSector->offers()->where('removed', false)->exists()) {
            return back()->withErrors([
                'error' => 'Non è possibile eliminare il settore. Ha offerte associate.',
            ]);
        }

        $offerSector->update(['removed' => true]);

        // Invalidare cache opzioni formulari
        $this->offerRepository->clearFormOptionsCache();

        return redirect()->route('offer-sectors.index')
            ->with('success', 'Settore eliminato con successo.');
    }
}
