<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateOrderStateRequest;
use App\Models\OfferOrderState;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OrderStateController extends Controller
{
    /**
     * Display a listing of order states.
     */
    public function index(Request $request): Response
    {
        $query = OfferOrderState::active();

        $orderStates = $query->orderBy('sorting')
            ->paginate($request->get('per_page', 15));

        return Inertia::render('OrderStates/Index', [
            'orderStates' => $orderStates,
            'filters' => $request->only([]),
        ]);
    }

    /**
     * Show the form for creating a new order state.
     */
    public function create(): Response
    {
        return Inertia::render('OrderStates/Create');
    }

    /**
     * Store a newly created order state.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:offerorderstate,name,NULL,id,removed,0',
            'sorting' => 'nullable|integer|min:0',
        ]);

        $validated['removed'] = false;
        if (! isset($validated['sorting'])) {
            $maxSorting = OfferOrderState::where('removed', false)->max('sorting') ?? 0;
            $validated['sorting'] = $maxSorting + 1;
        }

        // Convert checkboxes to boolean
        $validated['initial'] = $request->boolean('initial', false);
        $validated['production'] = $request->boolean('production', false);

        OfferOrderState::create($validated);

        return redirect()->route('order-states.index')
            ->with('success', __('flash.order_state.created'));
    }

    /**
     * Display the specified order state.
     */
    public function show(OfferOrderState $orderState): Response
    {
        $orderState->load('orders');

        return Inertia::render('OrderStates/Show', [
            'orderState' => $orderState,
        ]);
    }

    /**
     * Show the form for editing the specified order state.
     */
    public function edit(OfferOrderState $orderState): Response
    {
        return Inertia::render('OrderStates/Edit', [
            'orderState' => $orderState,
        ]);
    }

    /**
     * Update the specified order state.
     */
    public function update(UpdateOrderStateRequest $request, OfferOrderState $orderState)
    {
        $validated = $request->validated();

        // Convert checkboxes to boolean
        $validated['initial'] = $request->boolean('initial', false);
        $validated['production'] = $request->boolean('production', false);

        $orderState->update($validated);

        return redirect()->route('order-states.index')
            ->with('success', __('flash.order_state.updated'));
    }

    /**
     * Remove the specified order state (soft delete).
     */
    public function destroy(OfferOrderState $orderState)
    {
        $orderState->update(['removed' => true]);

        return redirect()->route('order-states.index')
            ->with('success', __('flash.order_state.deleted'));
    }
}
