<?php

namespace App\Http\Controllers;

use App\Models\LasWorkLine;
use App\Repositories\OfferRepository;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LasWorkLineController extends Controller
{
    protected OfferRepository $offerRepository;

    public function __construct(OfferRepository $offerRepository)
    {
        $this->offerRepository = $offerRepository;
    }

    public function index(Request $request): Response
    {
        $query = LasWorkLine::active();

        if ($request->has('search')) {
            $search = $request->get('search');
            $query->where(function ($q) use ($search) {
                $q->where('code', 'like', "%{$search}%")
                    ->orWhere('name', 'like', "%{$search}%");
            });
        }

        $workLines = $query->orderBy('name')
            ->paginate($request->get('per_page', 15));

        return Inertia::render('LasWorkLines/Index', [
            'workLines' => $workLines,
            'filters' => $request->only(['search']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('LasWorkLines/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'uuid' => 'required|uuid|unique:offerlasworkline,uuid',
            'code' => 'required|string|max:255|unique:offerlasworkline,code',
            'name' => 'required|string|max:255',
        ], [
            'uuid.required' => 'L\'UUID è obbligatorio.',
            'uuid.uuid' => 'L\'UUID deve essere un formato UUID valido.',
            'uuid.unique' => 'Questo UUID è già utilizzato.',
            'code.required' => 'Il Codice è obbligatorio.',
            'code.unique' => 'Questo Codice è già utilizzato.',
            'name.required' => 'Il Nome è obbligatorio.',
        ]);

        LasWorkLine::create($validated);

        // Invalidare cache opzioni formulari
        $this->offerRepository->clearFormOptionsCache();

        return redirect()->route('las-work-lines.index')
            ->with('success', 'Linea di Lavoro LAS creata con successo.');
    }

    public function show(LasWorkLine $lasWorkLine): Response
    {
        return Inertia::render('LasWorkLines/Show', [
            'workLine' => $lasWorkLine,
        ]);
    }

    public function edit(LasWorkLine $lasWorkLine): Response
    {
        return Inertia::render('LasWorkLines/Edit', [
            'workLine' => $lasWorkLine,
        ]);
    }

    public function update(Request $request, LasWorkLine $lasWorkLine)
    {
        $validated = $request->validate([
            'uuid' => 'sometimes|uuid|unique:offerlasworkline,uuid,'.$lasWorkLine->id,
            'code' => 'required|string|max:255|unique:offerlasworkline,code,'.$lasWorkLine->id,
            'name' => 'required|string|max:255',
        ], [
            'uuid.uuid' => 'L\'UUID deve essere un formato UUID valido.',
            'uuid.unique' => 'Questo UUID è già utilizzato.',
            'code.required' => 'Il Codice è obbligatorio.',
            'code.unique' => 'Questo Codice è già utilizzato.',
            'name.required' => 'Il Nome è obbligatorio.',
        ]);

        $lasWorkLine->update($validated);

        return redirect()->route('las-work-lines.index')
            ->with('success', 'Linea di Lavoro LAS aggiornata con successo.');
    }

    public function destroy(LasWorkLine $lasWorkLine)
    {
        $lasWorkLine->update(['removed' => true]);

        // Invalidare cache opzioni formulari
        $this->offerRepository->clearFormOptionsCache();

        return redirect()->route('las-work-lines.index')
            ->with('success', 'Linea di Lavoro LAS eliminata con successo.');
    }
}
