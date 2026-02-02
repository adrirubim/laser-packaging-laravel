<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateMachineryRequest;
use App\Models\Machinery;
use App\Repositories\ArticleRepository;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MachineryController extends Controller
{
    protected ArticleRepository $articleRepository;

    public function __construct(ArticleRepository $articleRepository)
    {
        $this->articleRepository = $articleRepository;
    }

    /**
     * Display a listing of machinery.
     */
    public function index(Request $request): Response
    {
        $query = Machinery::active()->with('valueType');

        // Ricerca
        if ($request->has('search')) {
            $search = $request->get('search');
            $query->where(function ($q) use ($search) {
                $q->where('cod', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('parameter', 'like', "%{$search}%");
            });
        }

        $machinery = $query->orderBy('cod')
            ->paginate($request->get('per_page', 15));

        return Inertia::render('Machinery/Index', [
            'machinery' => $machinery,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Show the form for creating a new machinery.
     */
    public function create(): Response
    {
        $valueTypes = \App\Models\ValueTypes::active()->orderBy('id')->get(['id']);

        return Inertia::render('Machinery/Create', [
            'valueTypes' => $valueTypes,
        ]);
    }

    /**
     * Store a newly created machinery.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'cod' => 'required|string|max:255|unique:machinery,cod',
            'description' => 'required|string|max:255',
        ]);

        $machinery = Machinery::create($validated);

        // Invalidare cache opzioni formulari
        $this->articleRepository->clearFormOptionsCache();

        return redirect()->route('machinery.index')
            ->with('success', 'Macchinario creato con successo.');
    }

    /**
     * Display the specified machinery.
     */
    public function show(Machinery $machinery): Response
    {
        $machinery->load('articles');

        return Inertia::render('Machinery/Show', [
            'machinery' => $machinery,
        ]);
    }

    /**
     * Show the form for editing the specified machinery.
     */
    public function edit(Machinery $machinery): Response
    {
        $machinery->load('valueType');
        $valueTypes = \App\Models\ValueTypes::active()->orderBy('id')->get(['id']);

        return Inertia::render('Machinery/Edit', [
            'machinery' => $machinery,
            'valueTypes' => $valueTypes,
        ]);
    }

    /**
     * Update the specified machinery.
     */
    public function update(UpdateMachineryRequest $request, Machinery $machinery)
    {
        $machinery->update($request->validated());

        // Invalidare cache opzioni formulari
        $this->articleRepository->clearFormOptionsCache();

        return redirect()->route('machinery.index')
            ->with('success', 'Macchinario aggiornato con successo.');
    }

    /**
     * Remove the specified machinery (soft delete).
     */
    public function destroy(Machinery $machinery)
    {
        $machinery->update(['removed' => true]);

        // Invalidare cache opzioni formulari
        $this->articleRepository->clearFormOptionsCache();

        return redirect()->route('machinery.index')
            ->with('success', 'Macchinario eliminato con successo.');
    }
}
