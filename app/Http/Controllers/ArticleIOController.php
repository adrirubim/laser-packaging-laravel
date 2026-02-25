<?php

namespace App\Http\Controllers;

use App\Models\ArticleIO;
use App\Repositories\ArticleRepository;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ArticleIOController extends Controller
{
    protected ArticleRepository $articleRepository;

    public function __construct(ArticleRepository $articleRepository)
    {
        $this->articleRepository = $articleRepository;
    }

    /**
     * Display a listing of operational instructions.
     */
    public function index(Request $request): Response
    {
        $query = ArticleIO::active();

        // Search
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

        return Inertia::render('Articles/OperationalInstructions/Index', [
            'instructions' => $instructions,
            'filters' => $request->only(['search', 'sort_by', 'sort_order']),
        ]);
    }

    /**
     * Show the form for creating a new operational instruction.
     */
    public function create(): Response
    {
        return Inertia::render('Articles/OperationalInstructions/Create');
    }

    /**
     * Store a newly created operational instruction.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|max:255|unique:articlesio,code',
            'number' => 'nullable|string|max:255',
            // Allow simple filename (tests)
            'filename' => 'nullable|string|max:255',
        ]);

        // Verify and process file if included
        if ($request->hasFile('filename')) {
            $request->validate([
                'filename' => 'file|mimes:pdf|max:10240',
            ], [
                'filename.file' => __('validation.file_invalid'),
                'filename.mimes' => 'Il file deve essere un PDF.',
                'filename.max' => __('validation.file_max_10mb'),
            ]);

            $file = $request->file('filename');
            $originalName = $file->getClientOriginalName();
            $file->storeAs('operational-instructions', $originalName);
            $validated['filename'] = $originalName;
        }

        ArticleIO::create($validated);

        return redirect()->route('articles.operational-instructions.index')
            ->with('success', __('flash.article_io.created'));
    }

    /**
     * Display the specified operational instruction.
     */
    public function show(ArticleIO $operationalInstruction): Response
    {
        $operationalInstruction->load('articles');

        return Inertia::render('Articles/OperationalInstructions/Show', [
            'instruction' => $operationalInstruction,
        ]);
    }

    /**
     * Show the form for editing the specified operational instruction.
     */
    public function edit(ArticleIO $operationalInstruction): Response
    {
        return Inertia::render('Articles/OperationalInstructions/Edit', [
            'instruction' => $operationalInstruction,
        ]);
    }

    /**
     * Update the specified operational instruction.
     */
    public function update(Request $request, ArticleIO $operationalInstruction)
    {
        $validated = $request->validate([
            'code' => [
                'required',
                'string',
                'max:255',
                function ($attribute, $value, $fail) use ($operationalInstruction) {
                    $exists = ArticleIO::where('code', $value)
                        ->where('id', '!=', $operationalInstruction->id)
                        ->where('removed', false)
                        ->exists();
                    if ($exists) {
                        $fail(__('validation.code_exists'));
                    }
                },
            ],
            'number' => 'nullable|string|max:255',
            'filename' => 'nullable|string|max:255',
        ]);

        // Verify and process file if included
        if ($request->hasFile('filename')) {
            $request->validate([
                'filename' => 'file|mimes:pdf|max:10240',
            ], [
                'filename.file' => __('validation.file_invalid'),
                'filename.mimes' => 'Il file deve essere un PDF.',
                'filename.max' => __('validation.file_max_10mb'),
            ]);

            // Remove previous file if exists
            if ($operationalInstruction->filename) {
                $oldPath = storage_path('app/operational-instructions/'.$operationalInstruction->filename);
                if (file_exists($oldPath)) {
                    @unlink($oldPath);
                }
            }

            $file = $request->file('filename');
            $originalName = $file->getClientOriginalName();
            $file->storeAs('operational-instructions', $originalName);
            $validated['filename'] = $originalName;
        }

        $operationalInstruction->update($validated);

        return redirect()->route('articles.operational-instructions.index')
            ->with('success', __('flash.article_io.updated'));
    }

    /**
     * Remove the specified operational instruction (soft delete).
     */
    public function destroy(ArticleIO $operationalInstruction)
    {
        $operationalInstruction->update(['removed' => true]);

        // Invalidate form options cache
        $this->articleRepository->clearFormOptionsCache();

        return redirect()->route('articles.operational-instructions.index')
            ->with('success', __('flash.article_io.deleted'));
    }

    /**
     * Download the file associated with an operational instruction if available.
     */
    public function download(ArticleIO $operationalInstruction)
    {
        if (! $operationalInstruction->filename) {
            return redirect()->back()->with('error', __('flash.article_io.no_file'));
        }

        $path = storage_path('app/operational-instructions/'.$operationalInstruction->filename);

        if (! file_exists($path)) {
            return redirect()->back()->with('error', __('flash.article_io.file_not_found'));
        }

        return response()->download($path, $operationalInstruction->filename);
    }

    /**
     * Generate next IO number (AJAX endpoint).
     * Formato: IO001 = IO + numero progressivo
     */
    public function generateIONumber()
    {
        try {
            $articlesIO = ArticleIO::where('code', 'IO')
                ->where('removed', false)
                ->get();

            $maxNumber = 0;
            foreach ($articlesIO as $article) {
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
