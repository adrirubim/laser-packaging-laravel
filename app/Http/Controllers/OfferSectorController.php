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

        // Invalidate form options cache
        $this->offerRepository->clearFormOptionsCache();

        return redirect()->route('offer-sectors.index')
            ->with('success', __('flash.offer_sector.created'));
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
            ->with('success', __('flash.offer_sector.updated'));
    }

    public function destroy(OfferSector $offerSector)
    {
        // Verify if has active offers
        if ($offerSector->offers()->where('removed', false)->exists()) {
            return back()->withErrors([
                'error' => __('flash.cannot_delete_sector'),
            ]);
        }

        $offerSector->update(['removed' => true]);

        // Invalidate form options cache
        $this->offerRepository->clearFormOptionsCache();

        return redirect()->route('offer-sectors.index')
            ->with('success', __('flash.offer_sector.deleted'));
    }
}
