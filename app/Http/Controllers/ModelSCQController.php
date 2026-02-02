<?php

namespace App\Http\Controllers;

use App\Models\ModelSCQ;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ModelSCQController extends Controller
{
    /**
     * Display a listing of CQ models.
     */
    public function index(Request $request): Response
    {
        $query = ModelSCQ::active();

        // Validare e applicare filtri
        $validated = $request->validate([
            'search' => 'nullable|string|max:255',
            'per_page' => 'nullable|integer|min:1|max:100',
            'sort_by' => 'nullable|string|in:cod_model,description_model,filename',
            'sort_order' => 'nullable|string|in:asc,desc',
        ]);

        // Ricerca
        if (! empty($validated['search'])) {
            $search = $validated['search'];
            $query->where(function ($q) use ($search) {
                $q->where('cod_model', 'like', "%{$search}%")
                    ->orWhere('description_model', 'like', "%{$search}%")
                    ->orWhere('filename', 'like', "%{$search}%");
            });
        }

        // Ordinamento
        $sortBy = $validated['sort_by'] ?? 'cod_model';
        $sortOrder = $validated['sort_order'] ?? 'asc';
        $query->orderBy($sortBy, $sortOrder);

        $perPage = $validated['per_page'] ?? 15;
        $models = $query->paginate($perPage);

        return Inertia::render('Articles/CQModels/Index', [
            'models' => $models,
            'filters' => [
                'search' => $validated['search'] ?? null,
                'per_page' => $perPage,
                'sort_by' => $sortBy,
                'sort_order' => $sortOrder,
            ],
        ]);
    }

    /**
     * Show the form for creating a new CQ model.
     */
    public function create(): Response
    {
        $cquNumber = ModelSCQ::generateNextCQUCode();

        return Inertia::render('Articles/CQModels/Create', [
            'cquNumber' => $cquNumber,
        ]);
    }

    /**
     * Store a newly created CQ model.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'cod_model' => [
                'nullable',
                'string',
                'max:255',
                function ($attribute, $value, $fail) {
                    if (! empty($value) && ModelSCQ::where('cod_model', $value)->where('removed', false)->exists()) {
                        $fail('Il codice esiste già.');
                    }
                },
            ],
            'description_model' => 'required|string|max:255',
            // Consentire nome file diretto
            'filename' => 'nullable|string|max:255',
        ]);

        // Generar código si no se proporcionó
        if (empty($validated['cod_model'])) {
            $validated['cod_model'] = ModelSCQ::generateNextCQUCode();
        }

        // Verificare file se incluso e sovrascrivere nome
        if ($request->hasFile('filename')) {
            $request->validate([
                'filename' => 'file|mimes:pdf|max:10240',
            ], [
                'filename.file' => 'Il file caricato non è valido.',
                'filename.mimes' => 'Il file deve essere un PDF.',
                'filename.max' => 'Il file non può superare 10MB.',
            ]);
        }

        // Creamos primero el modelo (puede incluir filename de texto)
        $model = ModelSCQ::create($validated);

        if ($request->hasFile('filename')) {
            $file = $request->file('filename');
            $originalName = $file->getClientOriginalName();

            $directory = storage_path('app/modelsCQ/'.$model->uuid);
            if (! file_exists($directory)) {
                mkdir($directory, 0755, true);
            }

            $file->move($directory, $originalName);
            $model->filename = $originalName;
            $model->save();
        }

        return redirect()->route('articles.cq-models.index')
            ->with('success', 'Modello CQ creato con successo.');
    }

    /**
     * Display the specified CQ model.
     */
    public function show(ModelSCQ $cqModel): Response
    {
        return Inertia::render('Articles/CQModels/Show', [
            'model' => $cqModel,
        ]);
    }

    /**
     * Show the form for editing the specified CQ model.
     */
    public function edit(ModelSCQ $cqModel): Response
    {
        return Inertia::render('Articles/CQModels/Edit', [
            'model' => $cqModel,
        ]);
    }

    /**
     * Update the specified CQ model.
     */
    public function update(Request $request, ModelSCQ $cqModel)
    {
        $validated = $request->validate([
            'cod_model' => [
                'nullable',
                'string',
                'max:255',
                function ($attribute, $value, $fail) use ($cqModel) {
                    if (! empty($value)) {
                        $exists = ModelSCQ::where('cod_model', $value)
                            ->where('id', '!=', $cqModel->id)
                            ->where('removed', false)
                            ->exists();
                        if ($exists) {
                            $fail('Il codice esiste già.');
                        }
                    }
                },
            ],
            'description_model' => 'required|string|max:255',
            'filename' => 'nullable|string|max:255',
        ]);

        // Generar código si no se proporcionó
        if (empty($validated['cod_model'])) {
            $validated['cod_model'] = ModelSCQ::generateNextCQUCode();
        }

        if ($request->hasFile('filename')) {
            $request->validate([
                'filename' => 'file|mimes:pdf|max:10240',
            ], [
                'filename.file' => 'Il file caricato non è valido.',
                'filename.mimes' => 'Il file deve essere un PDF.',
                'filename.max' => 'Il file non può superare 10MB.',
            ]);
        }

        $cqModel->update($validated);

        if ($request->hasFile('filename')) {
            // eliminar antiguo si existe
            if ($cqModel->filename) {
                $oldPath = $this->getFilePath($cqModel);
                if (file_exists($oldPath)) {
                    @unlink($oldPath);
                }
            }

            $file = $request->file('filename');
            $originalName = $file->getClientOriginalName();

            $directory = storage_path('app/modelsCQ/'.$cqModel->uuid);
            if (! file_exists($directory)) {
                mkdir($directory, 0755, true);
            }

            $file->move($directory, $originalName);
            $cqModel->filename = $originalName;
            $cqModel->save();
        }

        return redirect()->route('articles.cq-models.index')
            ->with('success', 'Modello CQ aggiornato con successo.');
    }

    /**
     * Remove the specified CQ model (soft delete).
     */
    public function destroy(ModelSCQ $cqModel)
    {
        $cqModel->removed = true;
        $cqModel->save();

        return redirect()->route('articles.cq-models.index')
            ->with('success', 'Modello CQ eliminato con successo.');
    }

    /**
     * Generate next CQU number (AJAX endpoint).
     */
    public function generateCQUNumber()
    {
        try {
            $cquNumber = ModelSCQ::generateNextCQUCode();

            return response()->json(['cqunumber' => $cquNumber]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    /**
     * Download file for a CQ model.
     */
    public function downloadFile(ModelSCQ $cqModel)
    {
        if (! $cqModel->filename) {
            return redirect()->route('articles.cq-models.index')
                ->withErrors(['error' => 'Nessun file trovato per questo modello.']);
        }

        $filePath = $this->getFilePath($cqModel);

        if (! file_exists($filePath)) {
            return redirect()->route('articles.cq-models.index')
                ->withErrors(['error' => 'File non trovato sul server.']);
        }

        return response()->download($filePath, $cqModel->filename);
    }

    /**
     * Get the full file path including filename.
     */
    private function getFilePath(ModelSCQ $cqModel): string
    {
        $directory = storage_path('app/modelsCQ/'.$cqModel->uuid);

        // Assicurare che la directory esista
        if (! file_exists($directory)) {
            mkdir($directory, 0755, true);
        }

        return $directory.'/'.$cqModel->filename;
    }
}
