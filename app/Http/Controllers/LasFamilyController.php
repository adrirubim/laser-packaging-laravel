<?php

namespace App\Http\Controllers;

use App\Models\LasFamily;
use App\Repositories\OfferRepository;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LasFamilyController extends Controller
{
    protected OfferRepository $offerRepository;

    public function __construct(OfferRepository $offerRepository)
    {
        $this->offerRepository = $offerRepository;
    }

    public function index(Request $request): Response
    {
        $query = LasFamily::active();

        if ($request->has('search')) {
            $search = $request->get('search');
            $query->where(function ($q) use ($search) {
                $q->where('code', 'like', "%{$search}%")
                    ->orWhere('name', 'like', "%{$search}%");
            });
        }

        $families = $query->orderBy('name')
            ->paginate($request->get('per_page', 15));

        return Inertia::render('LasFamilies/Index', [
            'families' => $families,
            'filters' => $request->only(['search']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('LasFamilies/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'uuid' => 'required|uuid|unique:offerlasfamily,uuid',
            'code' => 'required|string|max:255|unique:offerlasfamily,code',
            'name' => 'required|string|max:255',
        ], [
            'uuid.required' => 'L\'UUID è obbligatorio.',
            'uuid.uuid' => 'L\'UUID deve essere un formato UUID valido.',
            'uuid.unique' => 'Questo UUID è già utilizzato.',
            'code.required' => 'Il Codice è obbligatorio.',
            'code.unique' => 'Questo Codice è già utilizzato.',
            'name.required' => 'Il Nome è obbligatorio.',
        ]);

        LasFamily::create($validated);

        // Invalidare cache opzioni formulari
        $this->offerRepository->clearFormOptionsCache();

        return redirect()->route('las-families.index')
            ->with('success', 'Famiglia LAS creata con successo.');
    }

    public function show(LasFamily $lasFamily): Response
    {
        return Inertia::render('LasFamilies/Show', [
            'family' => $lasFamily,
        ]);
    }

    public function edit(LasFamily $lasFamily): Response
    {
        return Inertia::render('LasFamilies/Edit', [
            'family' => $lasFamily,
        ]);
    }

    public function update(Request $request, LasFamily $lasFamily)
    {
        $validated = $request->validate([
            'uuid' => 'sometimes|uuid|unique:offerlasfamily,uuid,'.$lasFamily->id,
            'code' => 'required|string|max:255|unique:offerlasfamily,code,'.$lasFamily->id,
            'name' => 'required|string|max:255',
        ], [
            'uuid.uuid' => 'L\'UUID deve essere un formato UUID valido.',
            'uuid.unique' => 'Questo UUID è già utilizzato.',
            'code.required' => 'Il Codice è obbligatorio.',
            'code.unique' => 'Questo Codice è già utilizzato.',
            'name.required' => 'Il Nome è obbligatorio.',
        ]);

        $lasFamily->update($validated);

        return redirect()->route('las-families.index')
            ->with('success', 'Famiglia LAS aggiornata con successo.');
    }

    public function destroy(LasFamily $lasFamily)
    {
        $lasFamily->update(['removed' => true]);

        // Invalidare cache opzioni formulari
        $this->offerRepository->clearFormOptionsCache();

        return redirect()->route('las-families.index')
            ->with('success', 'Famiglia LAS eliminata con successo.');
    }
}
