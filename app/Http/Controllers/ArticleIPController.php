<?php

namespace App\Http\Controllers;

use App\Models\ArticleIP;
use App\Repositories\ArticleRepository;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ArticleIPController extends Controller
{
    protected ArticleRepository $articleRepository;

    public function __construct(ArticleRepository $articleRepository)
    {
        $this->articleRepository = $articleRepository;
    }

    /**
     * Display a listing of palletization instructions.
     */
    public function index(Request $request): Response
    {
        $query = ArticleIP::active();

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

        return Inertia::render('Articles/PalletizationInstructions/Index', [
            'instructions' => $instructions,
            'filters' => $request->only(['search', 'sort_by', 'sort_order']),
        ]);
    }

    /**
     * Show the form for creating a new palletization instruction.
     */
    public function create(): Response
    {
        return Inertia::render('Articles/PalletizationInstructions/Create');
    }

    /**
     * Store a newly created palletization instruction.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|max:255|unique:articlesip,code',
            'number' => 'nullable|string|max:255',
            'length_cm' => 'nullable|numeric|min:0',
            'depth_cm' => 'nullable|numeric|min:0',
            'height_cm' => 'nullable|numeric|min:0',
            'volume_dmc' => 'nullable|numeric|min:0',
            'plan_packaging' => 'nullable|integer|min:0',
            'pallet_plans' => 'nullable|integer|min:0',
            'qty_pallet' => 'nullable|integer|min:0',
            'units_per_neck' => 'nullable|integer|min:0',
            'units_pallet' => 'nullable|integer|min:0',
            'interlayer_every_floors' => 'nullable|integer|min:0',
        ]);

        if ($request->hasFile('filename')) {
            $request->validate([
                'filename' => 'file|mimes:pdf|max:10240',
            ], [
                'filename.file' => 'Il file caricato non è valido.',
                'filename.mimes' => 'Il file deve essere un PDF.',
                'filename.max' => 'Il file non può superare 10MB.',
            ]);
        }

        $data = $validated;

        if ($request->hasFile('filename')) {
            $file = $request->file('filename');
            $originalName = $file->getClientOriginalName();
            $file->storeAs('palletization-instructions', $originalName);
            $data['filename'] = $originalName;
        }

        $instruction = ArticleIP::create($data);

        // Invalidare cache opzioni formulari
        $this->articleRepository->clearFormOptionsCache();

        return redirect()->route('articles.palletization-instructions.index')
            ->with('success', 'Istruzione di pallettizzazione creata con successo.');
    }

    /**
     * Display the specified palletization instruction.
     */
    public function show(ArticleIP $palletizationInstruction): Response
    {
        $palletizationInstruction->load('articles');

        return Inertia::render('Articles/PalletizationInstructions/Show', [
            'instruction' => $palletizationInstruction,
        ]);
    }

    /**
     * Show the form for editing the specified palletization instruction.
     */
    public function edit(ArticleIP $palletizationInstruction): Response
    {
        return Inertia::render('Articles/PalletizationInstructions/Edit', [
            'instruction' => $palletizationInstruction,
        ]);
    }

    /**
     * Update the specified palletization instruction.
     */
    public function update(Request $request, ArticleIP $palletizationInstruction)
    {
        $validated = $request->validate([
            'code' => [
                'required',
                'string',
                'max:255',
                function ($attribute, $value, $fail) use ($palletizationInstruction) {
                    $exists = ArticleIP::where('code', $value)
                        ->where('id', '!=', $palletizationInstruction->id)
                        ->where('removed', false)
                        ->exists();
                    if ($exists) {
                        $fail('Il codice esiste già.');
                    }
                },
            ],
            'number' => 'nullable|string|max:255',
            'length_cm' => 'nullable|numeric|min:0',
            'depth_cm' => 'nullable|numeric|min:0',
            'height_cm' => 'nullable|numeric|min:0',
            'volume_dmc' => 'nullable|numeric|min:0',
            'plan_packaging' => 'nullable|integer|min:0',
            'pallet_plans' => 'nullable|integer|min:0',
            'qty_pallet' => 'nullable|integer|min:0',
            'units_per_neck' => 'nullable|integer|min:0',
            'units_pallet' => 'nullable|integer|min:0',
            'interlayer_every_floors' => 'nullable|integer|min:0',
        ]);

        if ($request->hasFile('filename')) {
            $request->validate([
                'filename' => 'file|mimes:pdf|max:10240',
            ], [
                'filename.file' => 'Il file caricato non è valido.',
                'filename.mimes' => 'Il file deve essere un PDF.',
                'filename.max' => 'Il file non può superare 10MB.',
            ]);
        }

        $data = $validated;

        if ($request->hasFile('filename')) {
            if ($palletizationInstruction->filename) {
                $oldPath = storage_path('app/palletization-instructions/'.$palletizationInstruction->filename);
                if (file_exists($oldPath)) {
                    @unlink($oldPath);
                }
            }

            $file = $request->file('filename');
            $originalName = $file->getClientOriginalName();
            $file->storeAs('palletization-instructions', $originalName);
            $data['filename'] = $originalName;
        }

        $palletizationInstruction->update($data);

        // Invalidare cache opzioni formulari
        $this->articleRepository->clearFormOptionsCache();

        return redirect()->route('articles.palletization-instructions.index')
            ->with('success', 'Istruzione di pallettizzazione aggiornata con successo.');
    }

    /**
     * Remove the specified palletization instruction (soft delete).
     */
    public function destroy(ArticleIP $palletizationInstruction)
    {
        $palletizationInstruction->update(['removed' => true]);

        // Invalidare cache opzioni formulari
        $this->articleRepository->clearFormOptionsCache();

        return redirect()->route('articles.palletization-instructions.index')
            ->with('success', 'Istruzione di pallettizzazione eliminata con successo.');
    }

    /**
     * Download the file associated with a palletization instruction if available.
     */
    public function download(ArticleIP $palletizationInstruction)
    {
        if (! $palletizationInstruction->filename) {
            return redirect()->back()->with('error', 'Nessun file disponibile per questa istruzione di pallettizzazione.');
        }

        $path = storage_path('app/palletization-instructions/'.$palletizationInstruction->filename);

        if (! file_exists($path)) {
            return redirect()->back()->with('error', 'File non trovato sul server.');
        }

        return response()->download($path, $palletizationInstruction->filename);
    }

    /**
     * Generate next IP number (AJAX endpoint).
     * Formato: IP001 = IP + numero progressivo
     */
    public function generateIPNumber()
    {
        try {
            $articlesIP = ArticleIP::where('code', 'IP')
                ->where('removed', false)
                ->get();

            $maxNumber = 0;
            foreach ($articlesIP as $article) {
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
