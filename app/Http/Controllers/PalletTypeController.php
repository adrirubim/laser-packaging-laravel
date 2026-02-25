<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdatePalletTypeRequest;
use App\Models\PalletType;
use App\Repositories\ArticleRepository;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PalletTypeController extends Controller
{
    protected ArticleRepository $articleRepository;

    public function __construct(ArticleRepository $articleRepository)
    {
        $this->articleRepository = $articleRepository;
    }

    /**
     * Display a listing of pallet types.
     */
    public function index(Request $request): Response
    {
        $query = PalletType::active();

        // Search
        if ($request->has('search')) {
            $search = $request->get('search');
            $query->where(function ($q) use ($search) {
                $q->where('cod', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $palletTypes = $query->orderBy('cod')
            ->paginate($request->get('per_page', 15));

        return Inertia::render('PalletTypes/Index', [
            'palletTypes' => $palletTypes,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Show the form for creating a new pallet type.
     */
    public function create(): Response
    {
        return Inertia::render('PalletTypes/Create');
    }

    /**
     * Store a newly created pallet type.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'cod' => 'required|string|max:255|unique:pallettype,cod',
            'description' => 'required|string|max:255',
        ]);

        $palletType = PalletType::create($validated);

        // Invalidate form options cache
        $this->articleRepository->clearFormOptionsCache();

        return redirect()->route('pallet-types.index')
            ->with('success', __('flash.pallet_type.created'));
    }

    /**
     * Display the specified pallet type.
     */
    public function show(PalletType $palletType): Response
    {
        $palletType->load('articles');

        return Inertia::render('PalletTypes/Show', [
            'palletType' => $palletType,
        ]);
    }

    /**
     * Show the form for editing the specified pallet type.
     */
    public function edit(PalletType $palletType): Response
    {
        return Inertia::render('PalletTypes/Edit', [
            'palletType' => $palletType,
        ]);
    }

    /**
     * Update the specified pallet type.
     */
    public function update(UpdatePalletTypeRequest $request, PalletType $palletType)
    {
        $palletType->update($request->validated());

        // Invalidate form options cache
        $this->articleRepository->clearFormOptionsCache();

        return redirect()->route('pallet-types.index')
            ->with('success', __('flash.pallet_type.updated'));
    }

    /**
     * Remove the specified pallet type (soft delete).
     */
    public function destroy(PalletType $palletType)
    {
        $palletType->update(['removed' => true]);

        // Invalidate form options cache
        $this->articleRepository->clearFormOptionsCache();

        return redirect()->route('pallet-types.index')
            ->with('success', __('flash.pallet_type.deleted'));
    }
}
