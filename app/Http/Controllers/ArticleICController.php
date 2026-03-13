<?php

namespace App\Http\Controllers;

use App\Http\Resources\ApiResponseResource;
use App\Models\ArticleIC;
use Domain\Articles\Actions\DeleteArticleICAction;
use Domain\Articles\Actions\GenerateArticleICNumberAction;
use Domain\Articles\Actions\ListArticleICAction;
use Domain\Articles\Actions\StoreArticleICAction;
use Domain\Articles\Actions\UpdateArticleICAction;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ArticleICController extends Controller
{
    public function __construct(
        protected ListArticleICAction $listArticleICAction,
        protected StoreArticleICAction $storeArticleICAction,
        protected UpdateArticleICAction $updateArticleICAction,
        protected DeleteArticleICAction $deleteArticleICAction,
        protected GenerateArticleICNumberAction $generateArticleICNumberAction,
    ) {}

    /**
     * Display a listing of packaging instructions.
     */
    public function index(Request $request): Response
    {
        $instructions = $this->listArticleICAction->execute($request->all());

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

        $this->storeArticleICAction->execute($validated);

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

        $this->updateArticleICAction->execute($packagingInstruction, $validated);

        return redirect()->route('articles.packaging-instructions.index')
            ->with('success', __('flash.article_ic.updated'));
    }

    /**
     * Remove the specified packaging instruction (soft delete).
     */
    public function destroy(ArticleIC $packagingInstruction)
    {
        $this->deleteArticleICAction->execute($packagingInstruction);

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
            $payload = $this->generateArticleICNumberAction->execute();

            return ApiResponseResource::success($payload);
        } catch (\Exception $e) {
            return ApiResponseResource::error($e->getMessage(), null, 400);
        }
    }
}
