<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreOfferOrderTypeRequest;
use App\Http\Requests\UpdateOfferOrderTypeRequest;
use App\Models\OfferOrderType;
use App\Repositories\OfferRepository;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OfferOrderTypeController extends Controller
{
    protected OfferRepository $offerRepository;

    public function __construct(OfferRepository $offerRepository)
    {
        $this->offerRepository = $offerRepository;
    }

    public function index(Request $request): Response
    {
        $query = OfferOrderType::active();

        if ($request->has('search')) {
            $search = $request->get('search');
            $query->where(function ($q) use ($search) {
                $q->where('code', 'like', "%{$search}%")
                    ->orWhere('name', 'like', "%{$search}%");
            });
        }

        // Ordinamento
        $sortBy = $request->get('sort_by', 'name');
        $sortOrder = $request->get('sort_order', 'asc');

        $allowedSortColumns = ['name', 'code', 'created_at'];
        if (in_array($sortBy, $allowedSortColumns)) {
            $query->orderBy($sortBy, $sortOrder);
        } else {
            $query->orderBy('name', 'asc');
        }

        $orderTypes = $query->paginate($request->get('per_page', 15));

        return Inertia::render('OfferOrderTypes/Index', [
            'orderTypes' => $orderTypes,
            'filters' => $request->only(['search', 'sort_by', 'sort_order']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('OfferOrderTypes/Create');
    }

    public function store(StoreOfferOrderTypeRequest $request)
    {
        OfferOrderType::create($request->validated());

        // Invalidare cache opzioni formulari
        $this->offerRepository->clearFormOptionsCache();

        return redirect()->route('offer-order-types.index')
            ->with('success', 'Tipo ordine creato con successo.');
    }

    public function show(OfferOrderType $offerOrderType): Response
    {
        return Inertia::render('OfferOrderTypes/Show', [
            'orderType' => $offerOrderType,
        ]);
    }

    public function edit(OfferOrderType $offerOrderType): Response
    {
        return Inertia::render('OfferOrderTypes/Edit', [
            'orderType' => $offerOrderType,
        ]);
    }

    public function update(UpdateOfferOrderTypeRequest $request, OfferOrderType $offerOrderType)
    {
        $offerOrderType->update($request->validated());

        // Invalidare cache opzioni formulari
        $this->offerRepository->clearFormOptionsCache();

        return redirect()->route('offer-order-types.index')
            ->with('success', 'Tipo ordine aggiornato con successo.');
    }

    public function destroy(OfferOrderType $offerOrderType)
    {
        // Verificar si tiene ofertas activas
        if ($offerOrderType->offers()->where('removed', false)->exists()) {
            return back()->withErrors([
                'error' => 'Non è possibile eliminare il tipo ordine. Ha offerte associate.',
            ]);
        }

        $offerOrderType->update(['removed' => true]);

        // Invalidare cache opzioni formulari
        $this->offerRepository->clearFormOptionsCache();

        return redirect()->route('offer-order-types.index')
            ->with('success', 'Tipo ordine eliminato con successo.');
    }
}
