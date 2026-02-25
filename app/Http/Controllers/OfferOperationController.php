<?php

namespace App\Http\Controllers;

use App\Models\OfferOperation;
use App\Models\OfferOperationCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class OfferOperationController extends Controller
{
    public function index(Request $request): Response
    {
        $query = OfferOperation::active()->with('category');

        if ($request->has('search')) {
            $search = $request->get('search');
            $query->where(function ($q) use ($search) {
                $q->where('codice', 'like', "%{$search}%")
                    ->orWhere('codice_univoco', 'like', "%{$search}%")
                    ->orWhere('descrizione', 'like', "%{$search}%");
            });
        }

        if ($request->has('category_uuid')) {
            $query->where('category_uuid', $request->get('category_uuid'));
        }

        $operations = $query->orderBy('codice')
            ->paginate($request->get('per_page', 15));

        $categories = OfferOperationCategory::active()->orderBy('name')->get(['uuid', 'name']);

        return Inertia::render('OfferOperations/Index', [
            'operations' => $operations,
            'categories' => $categories,
            'filters' => $request->only(['search', 'category_uuid']),
        ]);
    }

    public function create(Request $request): Response
    {
        $categories = OfferOperationCategory::active()->orderBy('name')->get(['uuid', 'name']);

        return Inertia::render('OfferOperations/Create', [
            'categories' => $categories,
            'category_uuid' => $request->get('category_uuid'),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'uuid' => 'required|uuid|unique:offeroperation,uuid',
            'category_uuid' => 'nullable|exists:offeroperationcategory,uuid',
            'codice' => 'nullable|string|max:255',
            'codice_univoco' => 'nullable|string|max:255|unique:offeroperation,codice_univoco',
            'descrizione' => 'nullable|string',
            'secondi_operazione' => 'nullable|numeric|min:0',
        ], [
            'uuid.required' => __('validation.uuid_required'),
            'uuid.uuid' => __('validation.uuid_format'),
            'uuid.unique' => __('validation.uuid_unique'),
            'category_uuid.exists' => __('validation.category_exists'),
            'codice_univoco.unique' => __('validation.codice_univoco_unique'),
            'secondi_operazione.numeric' => __('validation.secondi_numeric'),
            'secondi_operazione.min' => __('validation.secondi_min'),
        ]);

        // Validare il file separatamente se presente
        if ($request->hasFile('filename')) {
            $request->validate([
                'filename' => 'file|max:10240', // 10MB max
            ], [
                'filename.file' => __('validation.file_invalid'),
                'filename.max' => __('validation.file_max_10mb'),
            ]);
        }

        $data = $validated;

        // Gestire l'upload del file se presente
        if ($request->hasFile('filename')) {
            $file = $request->file('filename');
            $originalName = $file->getClientOriginalName();
            $path = $file->storeAs('offer-operations', $validated['uuid'].'_'.$originalName, 'public');
            $data['filename'] = $path;
        } else {
            $data['filename'] = null;
        }

        OfferOperation::create($data);

        return redirect()->route('offer-operations.index')
            ->with('success', __('flash.offer_operation.created'));
    }

    public function show(OfferOperation $offerOperation): Response
    {
        $offerOperation->load('category');

        return Inertia::render('OfferOperations/Show', [
            'operation' => $offerOperation,
        ]);
    }

    public function edit(OfferOperation $offerOperation): Response
    {
        $categories = OfferOperationCategory::active()->orderBy('name')->get(['uuid', 'name']);

        return Inertia::render('OfferOperations/Edit', [
            'operation' => $offerOperation,
            'categories' => $categories,
        ]);
    }

    public function update(Request $request, OfferOperation $offerOperation)
    {
        $validated = $request->validate([
            'uuid' => 'sometimes|uuid|unique:offeroperation,uuid,'.$offerOperation->id,
            'category_uuid' => 'nullable|exists:offeroperationcategory,uuid',
            'codice' => 'nullable|string|max:255',
            'codice_univoco' => 'nullable|string|max:255|unique:offeroperation,codice_univoco,'.$offerOperation->id,
            'descrizione' => 'nullable|string',
            'secondi_operazione' => 'nullable|numeric|min:0',
        ], [
            'uuid.uuid' => __('validation.uuid_format'),
            'uuid.unique' => __('validation.uuid_unique'),
            'category_uuid.exists' => __('validation.category_exists'),
            'codice_univoco.unique' => __('validation.codice_univoco_unique'),
            'secondi_operazione.numeric' => __('validation.secondi_numeric'),
            'secondi_operazione.min' => __('validation.secondi_min'),
        ]);

        // Validare il file separatamente se presente
        if ($request->hasFile('filename')) {
            $request->validate([
                'filename' => 'file|max:10240', // 10MB max
            ], [
                'filename.file' => __('validation.file_invalid'),
                'filename.max' => __('validation.file_max_10mb'),
            ]);
        }

        $data = $validated;

        // Gestire l'upload del file se presente
        if ($request->hasFile('filename')) {
            // Eliminare il file precedente se esiste
            if ($offerOperation->filename && Storage::disk('public')->exists($offerOperation->filename)) {
                Storage::disk('public')->delete($offerOperation->filename);
            }

            $file = $request->file('filename');
            $originalName = $file->getClientOriginalName();
            $path = $file->storeAs('offer-operations', $offerOperation->uuid.'_'.$originalName, 'public');
            $data['filename'] = $path;
        } else {
            // Mantenere il filename esistente se non viene caricato un nuovo file
            unset($data['filename']);
        }

        $offerOperation->update($data);

        return redirect()->route('offer-operations.index')
            ->with('success', __('flash.offer_operation.updated'));
    }

    public function destroy(OfferOperation $offerOperation)
    {
        $offerOperation->update(['removed' => true]);

        return redirect()->route('offer-operations.index')
            ->with('success', __('flash.offer_operation.deleted'));
    }

    /**
     * Download the operation file if available.
     */
    public function downloadFile(OfferOperation $offerOperation)
    {
        if (! $offerOperation->filename) {
            return redirect()->back()->with('error', __('flash.offer_operation.no_file'));
        }

        if (! Storage::disk('public')->exists($offerOperation->filename)) {
            return redirect()->back()->with('error', __('flash.offer_operation.file_not_found'));
        }

        $downloadName = basename($offerOperation->filename);

        return Storage::disk('public')->download($offerOperation->filename, $downloadName);
    }

    /**
     * Load operations for a specific category (AJAX endpoint).
     * Returns active operations for the given category ordered by codice_univoco.
     */
    public function loadCategoryOperations(Request $request)
    {
        $request->validate([
            'category_uuid' => 'required|uuid|exists:offeroperationcategory,uuid',
        ]);

        $operations = OfferOperation::active()
            ->where('category_uuid', $request->get('category_uuid'))
            ->orderBy('codice_univoco')
            ->get(['uuid', 'codice', 'codice_univoco', 'descrizione', 'secondi_operazione']);

        return response()->json([
            'operations' => $operations,
        ]);
    }
}
