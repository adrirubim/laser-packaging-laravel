<?php

namespace App\Http\Controllers;

use App\Models\LsResource;
use App\Repositories\OfferRepository;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LsResourceController extends Controller
{
    protected OfferRepository $offerRepository;

    public function __construct(OfferRepository $offerRepository)
    {
        $this->offerRepository = $offerRepository;
    }

    public function index(Request $request): Response
    {
        $query = LsResource::active();

        if ($request->has('search')) {
            $search = $request->get('search');
            $query->where(function ($q) use ($search) {
                $q->where('code', 'like', "%{$search}%")
                    ->orWhere('name', 'like', "%{$search}%");
            });
        }

        $resources = $query->orderBy('name')
            ->paginate($request->get('per_page', 15));

        return Inertia::render('LsResources/Index', [
            'resources' => $resources,
            'filters' => $request->only(['search']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('LsResources/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'uuid' => 'required|uuid|unique:offerlsresource,uuid',
            'code' => 'required|string|max:255|unique:offerlsresource,code',
            'name' => 'nullable|string|max:255',
        ], [
            'uuid.required' => 'L\'UUID è obbligatorio.',
            'uuid.uuid' => 'L\'UUID deve essere un formato UUID valido.',
            'uuid.unique' => 'Questo UUID è già utilizzato.',
            'code.required' => 'Il Codice è obbligatorio.',
            'code.unique' => 'Questo Codice è già utilizzato.',
        ]);

        LsResource::create($validated);

        return redirect()->route('ls-resources.index')
            ->with('success', 'Risorsa L&S creata con successo.');
    }

    public function show(LsResource $lsResource): Response
    {
        return Inertia::render('LsResources/Show', [
            'resource' => $lsResource,
        ]);
    }

    public function edit(LsResource $lsResource): Response
    {
        return Inertia::render('LsResources/Edit', [
            'resource' => $lsResource,
        ]);
    }

    public function update(Request $request, LsResource $lsResource)
    {
        $validated = $request->validate([
            'uuid' => 'sometimes|uuid|unique:offerlsresource,uuid,'.$lsResource->id,
            'code' => 'required|string|max:255|unique:offerlsresource,code,'.$lsResource->id,
            'name' => 'nullable|string|max:255',
        ], [
            'uuid.uuid' => 'L\'UUID deve essere un formato UUID valido.',
            'uuid.unique' => 'Questo UUID è già utilizzato.',
            'code.required' => 'Il Codice è obbligatorio.',
            'code.unique' => 'Questo Codice è già utilizzato.',
        ]);

        $lsResource->update($validated);

        // Invalidare cache opzioni formulari
        $this->offerRepository->clearFormOptionsCache();

        return redirect()->route('ls-resources.index')
            ->with('success', 'Risorsa L&S aggiornata con successo.');
    }

    public function destroy(LsResource $lsResource)
    {
        $lsResource->update(['removed' => true]);

        return redirect()->route('ls-resources.index')
            ->with('success', 'Risorsa L&S eliminata con successo.');
    }
}
