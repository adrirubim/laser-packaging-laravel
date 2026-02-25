<?php

namespace App\Http\Controllers;

use App\Models\OfferOperationCategory;
use App\Repositories\OfferRepository;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OfferOperationCategoryController extends Controller
{
    protected OfferRepository $offerRepository;

    public function __construct(OfferRepository $offerRepository)
    {
        $this->offerRepository = $offerRepository;
    }

    public function index(Request $request): Response
    {
        $query = OfferOperationCategory::active();

        if ($request->has('search')) {
            $search = $request->get('search');
            $query->where(function ($q) use ($search) {
                $q->where('code', 'like', "%{$search}%")
                    ->orWhere('name', 'like', "%{$search}%");
            });
        }

        $categories = $query->orderBy('name')
            ->paginate($request->get('per_page', 15));

        return Inertia::render('OfferOperationCategories/Index', [
            'categories' => $categories,
            'filters' => $request->only(['search']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('OfferOperationCategories/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'uuid' => 'required|uuid|unique:offeroperationcategory,uuid',
            'code' => 'required|string|max:255|unique:offeroperationcategory,code',
            'name' => 'required|string|max:255',
        ], [
            'uuid.required' => __('validation.uuid_required'),
            'uuid.uuid' => __('validation.uuid_format'),
            'uuid.unique' => __('validation.uuid_unique'),
            'code.required' => __('validation.code_required'),
            'code.unique' => __('validation.code_unique'),
            'name.required' => __('validation.name_required'),
        ]);

        OfferOperationCategory::create($validated);

        // Invalidate form options cache
        $this->offerRepository->clearFormOptionsCache();

        return redirect()->route('offer-operation-categories.index')
            ->with('success', __('flash.offer_operation_category.created'));
    }

    public function show(OfferOperationCategory $offerOperationCategory): Response
    {
        $offerOperationCategory->load('operations');

        return Inertia::render('OfferOperationCategories/Show', [
            'category' => $offerOperationCategory,
        ]);
    }

    public function edit(OfferOperationCategory $offerOperationCategory): Response
    {
        return Inertia::render('OfferOperationCategories/Edit', [
            'category' => $offerOperationCategory,
        ]);
    }

    public function update(Request $request, OfferOperationCategory $offerOperationCategory)
    {
        $validated = $request->validate([
            'uuid' => 'sometimes|uuid|unique:offeroperationcategory,uuid,'.$offerOperationCategory->id,
            'code' => 'required|string|max:255|unique:offeroperationcategory,code,'.$offerOperationCategory->id,
            'name' => 'required|string|max:255',
        ], [
            'uuid.uuid' => __('validation.uuid_format'),
            'uuid.unique' => __('validation.uuid_unique'),
            'code.required' => __('validation.code_required'),
            'code.unique' => __('validation.code_unique'),
            'name.required' => __('validation.name_required'),
        ]);

        $offerOperationCategory->update($validated);

        // Invalidate form options cache
        $this->offerRepository->clearFormOptionsCache();

        return redirect()->route('offer-operation-categories.index')
            ->with('success', __('flash.offer_operation_category.updated'));
    }

    public function destroy(OfferOperationCategory $offerOperationCategory)
    {
        $offerOperationCategory->update(['removed' => true]);

        // Invalidate form options cache
        $this->offerRepository->clearFormOptionsCache();

        return redirect()->route('offer-operation-categories.index')
            ->with('success', __('flash.offer_operation_category.deleted'));
    }

    /**
     * Load categories for offer form (AJAX endpoint).
     * Returns active categories ordered by code.
     */
    public function loadCategories()
    {
        $categories = OfferOperationCategory::active()
            ->orderBy('code')
            ->get(['uuid', 'code', 'name']);

        return response()->json([
            'categories' => $categories,
        ]);
    }
}
