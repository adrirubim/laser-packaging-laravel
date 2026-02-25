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

        // Invalidate form options cache
        $this->offerRepository->clearFormOptionsCache();

        return redirect()->route('offer-types.index')
            ->with('success', __('flash.offer_type.created'));
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

        // Invalidate form options cache
        $this->offerRepository->clearFormOptionsCache();

        return redirect()->route('offer-types.index')
            ->with('success', __('flash.offer_type.updated'));
    }

    public function destroy(OfferType $offerType)
    {
        // Verify if has active offers
        if ($offerType->offers()->where('removed', false)->exists()) {
            return back()->withErrors([
                'error' => __('flash.cannot_delete_offer_type'),
            ]);
        }

        $offerType->update(['removed' => true]);

        // Invalidate form options cache
        $this->offerRepository->clearFormOptionsCache();

        return redirect()->route('offer-types.index')
            ->with('success', __('flash.offer_type.deleted'));
    }
}
