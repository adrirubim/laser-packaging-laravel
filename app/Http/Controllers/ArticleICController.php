<?php

namespace App\Http\Controllers;

use App\Models\ArticleIC;
use App\Repositories\ArticleRepository;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ArticleICController extends Controller
{
    protected ArticleRepository $articleRepository;

    public function __construct(ArticleRepository $articleRepository)
    {
        $this->articleRepository = $articleRepository;
    }

    /**
     * Display a listing of packaging instructions.
     */
    public function index(Request $request): Response
    {
        $query = ArticleIC::active();

        // Ricerca
        if ($request->has('search')) {
            $search = $request->get('search');
            $query->where(function ($q) use ($search) {
                $q->where('code', 'like', "%{$search}%")
                    ->orWhere('number', 'like', "%{$search}%")
                    ->orWhere('filename', 'like', "%{$search}%");
            });
        }

        // Ordinamento
        $sortBy = $request->get('sort_by', 'code');
        $sortOrder = $request->get('sort_order', 'asc');

        $allowedSorts = ['code', 'number', 'filename'];
        if (in_array($sortBy, $allowedSorts)) {
            $query->orderBy($sortBy, $sortOrder);
        } else {
            $query->orderBy('code', 'asc');
        }

        $instructions = $query->paginate($request->get('per_page', 15));

        return Inertia::render('Articles/PackagingInstructions/Index', [
            'instructions' => $instructions,
            'filters' => $request->only(['search', 'sort_by', 'sort_order']),
        ]);
    }

    /**
     * Show the form for creating a new packaging instruction.
     */
    public function create(): Response
    {
        return Inertia::render('Articles/PackagingInstructions/Create');
    }

    /**
     * Store a newly created packaging instruction.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|max:255|unique:articlesic,code',
            'number' => 'nullable|string|max:255',
            // Consentire anche di assegnare direttamente un nome file (tests)
            'filename' => 'nullable|string|max:255',
        ]);

        // Si se sube un archivo, validarlo y sobreescribir el nombre
        if ($request->hasFile('filename')) {
            $request->validate([
                'filename' => 'file|mimes:pdf|max:10240',
            ], [
                'filename.file' => 'Il file caricato non è valido.',
                'filename.mimes' => 'Il file deve essere un PDF.',
                'filename.max' => 'Il file non può superare 10MB.',
            ]);

            $file = $request->file('filename');
            $originalName = $file->getClientOriginalName();
            $file->storeAs('packaging-instructions', $originalName);
            $validated['filename'] = $originalName;
        }

        $instruction = ArticleIC::create($validated);

        // Invalidare cache opzioni formulari
        $this->articleRepository->clearFormOptionsCache();

        return redirect()->route('articles.packaging-instructions.index')
            ->with('success', 'Istruzione di confezionamento creata con successo.');
    }

    /**
     * Display the specified packaging instruction.
     */
    public function show(ArticleIC $packagingInstruction): Response
    {
        $packagingInstruction->load('articles');

        return Inertia::render('Articles/PackagingInstructions/Show', [
            'instruction' => $packagingInstruction,
        ]);
    }

    /**
     * Show the form for editing the specified packaging instruction.
     */
    public function edit(ArticleIC $packagingInstruction): Response
    {
        return Inertia::render('Articles/PackagingInstructions/Edit', [
            'instruction' => $packagingInstruction,
        ]);
    }

    /**
     * Update the specified packaging instruction.
     */
    public function update(Request $request, ArticleIC $packagingInstruction)
    {
        $validated = $request->validate([
            'code' => [
                'required',
                'string',
                'max:255',
                function ($attribute, $value, $fail) use ($packagingInstruction) {
                    $exists = ArticleIC::where('code', $value)
                        ->where('id', '!=', $packagingInstruction->id)
                        ->where('removed', false)
                        ->exists();
                    if ($exists) {
                        $fail('Il codice esiste già.');
                    }
                },
            ],
            'number' => 'nullable|string|max:255',
            // Consentire di cambiare il nome del file senza caricarne uno nuovo (tests)
            'filename' => 'nullable|string|max:255',
        ]);

        // Si viene un archivo, lo validamos y sustituimos el nombre
        if ($request->hasFile('filename')) {
            $request->validate([
                'filename' => 'file|mimes:pdf|max:10240',
            ], [
                'filename.file' => 'Il file caricato non è valido.',
                'filename.mimes' => 'Il file deve essere un PDF.',
                'filename.max' => 'Il file non può superare 10MB.',
            ]);

            if ($packagingInstruction->filename) {
                $oldPath = storage_path('app/packaging-instructions/'.$packagingInstruction->filename);
                if (file_exists($oldPath)) {
                    @unlink($oldPath);
                }
            }

            $file = $request->file('filename');
            $originalName = $file->getClientOriginalName();
            $file->storeAs('packaging-instructions', $originalName);
            $validated['filename'] = $originalName;
        }

        $packagingInstruction->update($validated);

        // Invalidare cache opzioni formulari
        $this->articleRepository->clearFormOptionsCache();

        return redirect()->route('articles.packaging-instructions.index')
            ->with('success', 'Istruzione di confezionamento aggiornata con successo.');
    }

    /**
     * Remove the specified packaging instruction (soft delete).
     */
    public function destroy(ArticleIC $packagingInstruction)
    {
        $packagingInstruction->update(['removed' => true]);

        // Invalidare cache opzioni formulari
        $this->articleRepository->clearFormOptionsCache();

        return redirect()->route('articles.packaging-instructions.index')
            ->with('success', 'Istruzione di confezionamento eliminata con successo.');
    }

    /**
     * Download the file associated with a packaging instruction if available.
     */
    public function download(ArticleIC $packagingInstruction)
    {
        if (! $packagingInstruction->filename) {
            return redirect()->back()->with('error', 'Nessun file disponibile per questa istruzione di confezionamento.');
        }

        $path = storage_path('app/packaging-instructions/'.$packagingInstruction->filename);

        if (! file_exists($path)) {
            return redirect()->back()->with('error', 'File non trovato sul server.');
        }

        return response()->download($path, $packagingInstruction->filename);
    }

    /**
     * Generate next IC number (AJAX endpoint).
     * Formato: IC001 = IC + numero progressivo
     */
    public function generateICNumber()
    {
        try {
            $articlesIC = ArticleIC::where('code', 'IC')
                ->where('removed', false)
                ->get();

            $maxNumber = 0;
            foreach ($articlesIC as $article) {
                $currentNumber = intval($article->number);
                if ($currentNumber > $maxNumber) {
                    $maxNumber = $currentNumber;
                }
            }

            $newNumber = $maxNumber + 1;
            $number = str_pad($newNumber, 4, '0', STR_PAD_LEFT);

            return response()->json(['number' => $number]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }
}
