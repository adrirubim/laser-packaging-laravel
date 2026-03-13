<?php

namespace App\Http\Controllers;

use App\Http\Resources\ApiResponseResource;
use App\Models\ArticleIP;
use Domain\Articles\Actions\DeleteArticleIPAction;
use Domain\Articles\Actions\GenerateArticleIPNumberAction;
use Domain\Articles\Actions\ListArticleIPAction;
use Domain\Articles\Actions\StoreArticleIPAction;
use Domain\Articles\Actions\UpdateArticleIPAction;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ArticleIPController extends Controller
{
    public function __construct(
        protected ListArticleIPAction $listArticleIPAction,
        protected StoreArticleIPAction $storeArticleIPAction,
        protected UpdateArticleIPAction $updateArticleIPAction,
        protected DeleteArticleIPAction $deleteArticleIPAction,
        protected GenerateArticleIPNumberAction $generateArticleIPNumberAction,
    ) {}

    /**
     * Display a listing of palletization instructions.
     */
    public function index(Request $request): Response
    {
        $instructions = $this->listArticleIPAction->execute($request->all());

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
                'filename.file' => __('validation.file_invalid'),
                'filename.mimes' => 'Il file deve essere un PDF.',
                'filename.max' => __('validation.file_max_10mb'),
            ]);
        }

        $data = $validated;

        if ($request->hasFile('filename')) {
            $file = $request->file('filename');
            $originalName = $file->getClientOriginalName();
            $file->storeAs('palletization-instructions', $originalName);
            $data['filename'] = $originalName;
        }

        $this->storeArticleIPAction->execute($data);

        return redirect()->route('articles.palletization-instructions.index')
            ->with('success', __('flash.article_ip.created'));
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
                        $fail(__('validation.code_exists'));
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
                'filename.file' => __('validation.file_invalid'),
                'filename.mimes' => 'Il file deve essere un PDF.',
                'filename.max' => __('validation.file_max_10mb'),
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

        $this->updateArticleIPAction->execute($palletizationInstruction, $data);

        return redirect()->route('articles.palletization-instructions.index')
            ->with('success', __('flash.article_ip.updated'));
    }

    /**
     * Remove the specified palletization instruction (soft delete).
     */
    public function destroy(ArticleIP $palletizationInstruction)
    {
        $this->deleteArticleIPAction->execute($palletizationInstruction);

        return redirect()->route('articles.palletization-instructions.index')
            ->with('success', __('flash.article_ip.deleted'));
    }

    /**
     * Download the file associated with a palletization instruction if available.
     */
    public function download(ArticleIP $palletizationInstruction)
    {
        if (! $palletizationInstruction->filename) {
            return redirect()->back()->with('error', __('flash.article_ip.no_file'));
        }

        $path = storage_path('app/palletization-instructions/'.$palletizationInstruction->filename);

        if (! file_exists($path)) {
            return redirect()->back()->with('error', __('flash.article_ip.file_not_found'));
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
            $payload = $this->generateArticleIPNumberAction->execute();

            return ApiResponseResource::success($payload);
        } catch (\Exception $e) {
            return ApiResponseResource::error($e->getMessage(), null, 400);
        }
    }
}
