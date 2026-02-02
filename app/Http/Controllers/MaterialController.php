<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateMaterialRequest;
use App\Models\Material;
use App\Repositories\ArticleRepository;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MaterialController extends Controller
{
    protected ArticleRepository $articleRepository;

    public function __construct(ArticleRepository $articleRepository)
    {
        $this->articleRepository = $articleRepository;
    }

    /**
     * Display a listing of materials.
     */
    public function index(Request $request): Response
    {
        $query = Material::active();

        // Ricerca
        if ($request->has('search')) {
            $search = $request->get('search');
            $query->where(function ($q) use ($search) {
                $q->where('cod', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $materials = $query->orderBy('cod')
            ->paginate($request->get('per_page', 15));

        return Inertia::render('Materials/Index', [
            'materials' => $materials,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Show the form for creating a new material.
     */
    public function create(): Response
    {
        return Inertia::render('Materials/Create');
    }

    /**
     * Store a newly created material.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'cod' => 'required|string|max:255|unique:materials,cod',
            'description' => 'required|string|max:255',
        ]);

        $material = Material::create($validated);

        // Invalidare cache opzioni formulari
        $this->articleRepository->clearFormOptionsCache();

        return redirect()->route('materials.index')
            ->with('success', 'Materiale creato con successo.');
    }

    /**
     * Display the specified material.
     */
    public function show(Material $material): Response
    {
        $material->load('articles');

        return Inertia::render('Materials/Show', [
            'material' => $material,
        ]);
    }

    /**
     * Show the form for editing the specified material.
     */
    public function edit(Material $material): Response
    {
        return Inertia::render('Materials/Edit', [
            'material' => $material,
        ]);
    }

    /**
     * Update the specified material.
     */
    public function update(UpdateMaterialRequest $request, Material $material)
    {
        $material->update($request->validated());

        // Invalidare cache opzioni formulari
        $this->articleRepository->clearFormOptionsCache();

        return redirect()->route('materials.index')
            ->with('success', 'Materiale aggiornato con successo.');
    }

    /**
     * Remove the specified material (soft delete).
     */
    public function destroy(Material $material)
    {
        $material->update(['removed' => true]);

        // Invalidare cache opzioni formulari
        $this->articleRepository->clearFormOptionsCache();

        return redirect()->route('materials.index')
            ->with('success', 'Materiale eliminato con successo.');
    }
}
