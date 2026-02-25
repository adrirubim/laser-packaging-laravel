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
            // Allow assigning filename directly (tests)
            'filename' => 'nullable|string|max:255',
        ]);

        // If a file is uploaded, validate it and overwrite the name
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
            $file->storeAs('packaging-instructions', $originalName);
            $validated['filename'] = $originalName;
        }

        $instruction = ArticleIC::create($validated);

        // Invalidate form options cache
        $this->articleRepository->clearFormOptionsCache();

        return redirect()->route('articles.packaging-instructions.index')
            ->with('success', __('flash.article_ic.created'));
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
                        $fail(__('validation.code_exists'));
                    }
                },
            ],
            'number' => 'nullable|string|max:255',
            // Allow changing filename without uploading a new file (tests)
            'filename' => 'nullable|string|max:255',
        ]);

        // If a file is sent, validate it and replace the name
        if ($request->hasFile('filename')) {
            $request->validate([
                'filename' => 'file|mimes:pdf|max:10240',
            ], [
                'filename.file' => __('validation.file_invalid'),
                'filename.mimes' => 'Il file deve essere un PDF.',
                'filename.max' => __('validation.file_max_10mb'),
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

        // Invalidate form options cache
        $this->articleRepository->clearFormOptionsCache();

        return redirect()->route('articles.packaging-instructions.index')
            ->with('success', __('flash.article_ic.updated'));
    }

    /**
     * Remove the specified packaging instruction (soft delete).
     */
    public function destroy(ArticleIC $packagingInstruction)
    {
        $packagingInstruction->update(['removed' => true]);

        // Invalidate form options cache
        $this->articleRepository->clearFormOptionsCache();

        return redirect()->route('articles.packaging-instructions.index')
            ->with('success', __('flash.article_ic.deleted'));
    }

    /**
     * Download the file associated with a packaging instruction if available.
     */
    public function download(ArticleIC $packagingInstruction)
    {
        if (! $packagingInstruction->filename) {
            return redirect()->back()->with('error', __('flash.article_ic.no_file'));
        }

        $path = storage_path('app/packaging-instructions/'.$packagingInstruction->filename);

        if (! file_exists($path)) {
            return redirect()->back()->with('error', __('flash.article_ic.file_not_found'));
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
