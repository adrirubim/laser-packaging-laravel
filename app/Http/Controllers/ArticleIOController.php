<?php

namespace App\Http\Controllers;

use App\Http\Resources\ApiResponseResource;
use App\Models\ArticleIO;
use Domain\Articles\Actions\DeleteArticleIOAction;
use Domain\Articles\Actions\GenerateArticleIONumberAction;
use Domain\Articles\Actions\ListArticleIOAction;
use Domain\Articles\Actions\StoreArticleIOAction;
use Domain\Articles\Actions\UpdateArticleIOAction;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ArticleIOController extends Controller
{
    public function __construct(
        protected ListArticleIOAction $listArticleIOAction,
        protected StoreArticleIOAction $storeArticleIOAction,
        protected UpdateArticleIOAction $updateArticleIOAction,
        protected DeleteArticleIOAction $deleteArticleIOAction,
        protected GenerateArticleIONumberAction $generateArticleIONumberAction,
    ) {}

    /**
     * Display a listing of operational instructions.
     */
    public function index(Request $request): Response
    {
        $instructions = $this->listArticleIOAction->execute($request->all());

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

        $this->storeArticleIOAction->execute($validated);

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

        $this->updateArticleIOAction->execute($operationalInstruction, $validated);

        return redirect()->route('articles.operational-instructions.index')
            ->with('success', __('flash.article_io.updated'));
    }

    /**
     * Remove the specified operational instruction (soft delete).
     */
    public function destroy(ArticleIO $operationalInstruction)
    {
        $this->deleteArticleIOAction->execute($operationalInstruction);

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
            $payload = $this->generateArticleIONumberAction->execute();

            return ApiResponseResource::success($payload);
        } catch (\Exception $e) {
            return ApiResponseResource::error($e->getMessage(), null, 400);
        }
    }
}
