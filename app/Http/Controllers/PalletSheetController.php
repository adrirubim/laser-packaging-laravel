<?php

namespace App\Http\Controllers;

use App\Models\PalletSheet;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PalletSheetController extends Controller
{
    /**
     * Display a listing of pallet sheets.
     */
    public function index(Request $request): Response
    {
        $query = PalletSheet::active();

        // Validate and apply filters
        $validated = $request->validate([
            'search' => 'nullable|string|max:255',
            'per_page' => 'nullable|integer|min:1|max:100',
            'sort_by' => 'nullable|string|in:code,description,filename',
            'sort_order' => 'nullable|string|in:asc,desc',
        ]);

        // Search
        if (! empty($validated['search'])) {
            $search = $validated['search'];
            $query->where(function ($q) use ($search) {
                $q->where('code', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('filename', 'like', "%{$search}%");
            });
        }

        // Ordinamento
        $sortBy = $validated['sort_by'] ?? 'code';
        $sortOrder = $validated['sort_order'] ?? 'asc';
        $query->orderBy($sortBy, $sortOrder);

        $perPage = $validated['per_page'] ?? 15;
        $sheets = $query->paginate($perPage);

        return Inertia::render('Articles/PalletSheets/Index', [
            'sheets' => $sheets,
            'filters' => [
                'search' => $validated['search'] ?? null,
                'per_page' => $perPage,
                'sort_by' => $sortBy,
                'sort_order' => $sortOrder,
            ],
        ]);
    }

    /**
     * Show the form for creating a new pallet sheet.
     */
    public function create(): Response
    {
        return Inertia::render('Articles/PalletSheets/Create');
    }

    /**
     * Store a newly created pallet sheet.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => [
                'required',
                'string',
                'max:255',
                function ($attribute, $value, $fail) {
                    if (PalletSheet::where('code', $value)->where('removed', false)->exists()) {
                        $fail(__('validation.code_exists'));
                    }
                },
            ],
            'description' => 'required|string|max:255',
            'filename' => 'nullable|string|max:255',
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

        $sheet = PalletSheet::create($validated);

        if ($request->hasFile('filename')) {
            $file = $request->file('filename');
            $originalName = $file->getClientOriginalName();
            $directory = $this->filePath($sheet);

            if (! file_exists($directory)) {
                mkdir($directory, 0755, true);
            }

            $file->move($directory, $originalName);
            $sheet->filename = $originalName;
            $sheet->save();
        }

        return redirect()->route('articles.pallet-sheets.index')
            ->with('success', __('flash.pallet_sheet.created'));
    }

    /**
     * Display the specified pallet sheet.
     */
    public function show(PalletSheet $palletSheet): Response
    {
        return Inertia::render('Articles/PalletSheets/Show', [
            'sheet' => $palletSheet,
        ]);
    }

    /**
     * Show the form for editing the specified pallet sheet.
     */
    public function edit(PalletSheet $palletSheet): Response
    {
        return Inertia::render('Articles/PalletSheets/Edit', [
            'sheet' => $palletSheet,
        ]);
    }

    /**
     * Update the specified pallet sheet.
     */
    public function update(Request $request, PalletSheet $palletSheet)
    {
        $validated = $request->validate([
            'code' => [
                'required',
                'string',
                'max:255',
                function ($attribute, $value, $fail) use ($palletSheet) {
                    $exists = PalletSheet::where('code', $value)
                        ->where('id', '!=', $palletSheet->id)
                        ->where('removed', false)
                        ->exists();
                    if ($exists) {
                        $fail(__('validation.code_exists'));
                    }
                },
            ],
            'description' => 'required|string|max:255',
            'filename' => 'nullable|string|max:255',
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

        $palletSheet->update($validated);

        if ($request->hasFile('filename')) {
            // rimuovere file precedente
            if ($palletSheet->filename) {
                $oldDir = $this->filePath($palletSheet);
                $oldFile = $oldDir.$palletSheet->filename;
                if (file_exists($oldFile)) {
                    @unlink($oldFile);
                }
            }

            $file = $request->file('filename');
            $originalName = $file->getClientOriginalName();
            $directory = $this->filePath($palletSheet);

            if (! file_exists($directory)) {
                mkdir($directory, 0755, true);
            }

            $file->move($directory, $originalName);
            $palletSheet->filename = $originalName;
            $palletSheet->save();
        }

        return redirect()->route('articles.pallet-sheets.index')
            ->with('success', __('flash.pallet_sheet.updated'));
    }

    /**
     * Remove the specified pallet sheet (soft delete).
     */
    public function destroy(PalletSheet $palletSheet)
    {
        $palletSheet->removed = true;
        $palletSheet->save();

        return redirect()->route('articles.pallet-sheets.index')
            ->with('success', __('flash.pallet_sheet.deleted'));
    }

    /**
     * Download file for a pallet sheet.
     */
    public function downloadFile(PalletSheet $palletSheet)
    {
        if (! $palletSheet->filename) {
            return back()->withErrors(['error' => __('flash.file_not_found_pallet')]);
        }

        $path = $this->filePath($palletSheet);
        $filePath = $path.$palletSheet->filename;

        if (! file_exists($filePath)) {
            return back()->withErrors(['error' => __('flash.file_not_found')]);
        }

        return response()->download($filePath, $palletSheet->filename);
    }

    /**
     * Get the file path for pallet sheet files.
     */
    private function filePath(PalletSheet $palletSheet): string
    {
        return storage_path('app/foglioPallet/'.$palletSheet->uuid.'/');
    }
}
