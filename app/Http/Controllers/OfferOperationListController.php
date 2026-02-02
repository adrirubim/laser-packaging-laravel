<?php

namespace App\Http\Controllers;

use App\Models\Offer;
use App\Models\OfferOperation;
use App\Models\OfferOperationList;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OfferOperationListController extends Controller
{
    /**
     * Display a listing of offer operation lists.
     */
    public function index(Request $request): Response
    {
        $query = OfferOperationList::active()->with(['offer', 'operation']);

        if ($request->has('offer_uuid')) {
            $query->where('offer_uuid', $request->get('offer_uuid'));
        }

        if ($request->has('search')) {
            $search = $request->get('search');
            $query->whereHas('offer', function ($q) use ($search) {
                $q->where('offer_number', 'like', "%{$search}%");
            })->orWhereHas('operation', function ($q) use ($search) {
                $q->where('codice', 'like', "%{$search}%")
                    ->orWhere('descrizione', 'like', "%{$search}%");
            });
        }

        $operationLists = $query->orderBy('num_op')
            ->paginate($request->get('per_page', 15));

        return Inertia::render('OfferOperationLists/Index', [
            'operationLists' => $operationLists,
            'filters' => $request->only(['search', 'offer_uuid']),
        ]);
    }

    /**
     * Show the form for creating a new offer operation list.
     */
    public function create(Request $request): Response
    {
        $offers = Offer::active()
            ->orderBy('offer_number')
            ->get(['uuid', 'offer_number', 'provisional_description']);

        $operations = OfferOperation::active()
            ->orderBy('codice')
            ->get(['uuid', 'codice', 'descrizione']);

        $offerUuid = $request->get('offer_uuid');

        return Inertia::render('OfferOperationLists/Create', [
            'offers' => $offers,
            'operations' => $operations,
            'offerUuid' => $offerUuid,
        ]);
    }

    /**
     * Store a newly created offer operation list.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'offer_uuid' => 'required|uuid|exists:offer,uuid',
            'offeroperation_uuid' => 'required|uuid|exists:offeroperation,uuid',
            'num_op' => 'required|numeric|min:0',
        ]);

        // Check for duplicate operation in the same offer
        $exists = OfferOperationList::where('offer_uuid', $validated['offer_uuid'])
            ->where('offeroperation_uuid', $validated['offeroperation_uuid'])
            ->where('removed', false)
            ->exists();

        if ($exists) {
            return redirect()->back()
                ->withErrors(['offeroperation_uuid' => 'Questa operazione è già assegnata a questa offerta.'])
                ->withInput();
        }

        $validated['removed'] = false;
        OfferOperationList::create($validated);

        return redirect()->route('offer-operation-lists.index', ['offer_uuid' => $validated['offer_uuid']])
            ->with('success', 'Operazione aggiunta all\'offerta con successo.');
    }

    /**
     * Display the specified offer operation list.
     */
    public function show(OfferOperationList $offerOperationList): Response
    {
        $offerOperationList->load(['offer', 'operation']);

        return Inertia::render('OfferOperationLists/Show', [
            'operationList' => $offerOperationList,
        ]);
    }

    /**
     * Show the form for editing the specified offer operation list.
     */
    public function edit(OfferOperationList $offerOperationList): Response
    {
        $offers = Offer::active()
            ->orderBy('offer_number')
            ->get(['uuid', 'offer_number', 'provisional_description']);

        $operations = OfferOperation::active()
            ->orderBy('codice')
            ->get(['uuid', 'codice', 'descrizione']);

        return Inertia::render('OfferOperationLists/Edit', [
            'operationList' => $offerOperationList,
            'offers' => $offers,
            'operations' => $operations,
        ]);
    }

    /**
     * Update the specified offer operation list.
     */
    public function update(Request $request, OfferOperationList $offerOperationList)
    {
        $validated = $request->validate([
            'offer_uuid' => 'required|uuid|exists:offer,uuid',
            'offeroperation_uuid' => 'required|uuid|exists:offeroperation,uuid',
            'num_op' => 'required|numeric|min:0',
        ]);

        // Check for duplicate operation in the same offer (excluding current)
        $exists = OfferOperationList::where('offer_uuid', $validated['offer_uuid'])
            ->where('offeroperation_uuid', $validated['offeroperation_uuid'])
            ->where('removed', false)
            ->where('uuid', '!=', $offerOperationList->uuid)
            ->exists();

        if ($exists) {
            return redirect()->back()
                ->withErrors(['offeroperation_uuid' => 'Questa operazione è già assegnata a questa offerta.'])
                ->withInput();
        }

        $offerOperationList->update($validated);

        return redirect()->route('offer-operation-lists.index', ['offer_uuid' => $validated['offer_uuid']])
            ->with('success', 'Lista operazioni aggiornata con successo.');
    }

    /**
     * Remove the specified offer operation list (soft delete).
     */
    public function destroy(OfferOperationList $offerOperationList)
    {
        $offerUuid = $offerOperationList->offer_uuid;
        $offerOperationList->update(['removed' => true]);

        return redirect()->route('offer-operation-lists.index', ['offer_uuid' => $offerUuid])
            ->with('success', 'Operazione rimossa dall\'offerta con successo.');
    }
}
