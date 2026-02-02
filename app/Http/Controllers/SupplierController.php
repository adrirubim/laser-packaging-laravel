<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSupplierRequest;
use App\Http\Requests\UpdateSupplierRequest;
use App\Models\Supplier;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SupplierController extends Controller
{
    /**
     * Display a listing of suppliers.
     */
    public function index(Request $request): Response
    {
        $query = Supplier::active();

        // Filtros
        if ($request->has('search')) {
            $search = $request->get('search');
            $query->where(function ($q) use ($search) {
                $q->where('code', 'like', "%{$search}%")
                    ->orWhere('company_name', 'like', "%{$search}%")
                    ->orWhere('vat_number', 'like', "%{$search}%");
            });
        }

        // Ordinamento
        $sortBy = $request->get('sort_by', 'company_name');
        $sortOrder = $request->get('sort_order', 'asc');

        $allowedSorts = ['code', 'company_name', 'vat_number', 'city', 'province', 'country'];
        if (in_array($sortBy, $allowedSorts)) {
            $query->orderBy($sortBy, $sortOrder);
        } else {
            $query->orderBy('company_name', 'asc');
        }

        $suppliers = $query->paginate($request->get('per_page', 15));

        return Inertia::render('Suppliers/Index', [
            'suppliers' => $suppliers,
            'filters' => $request->only(['search', 'sort_by', 'sort_order']),
        ]);
    }

    /**
     * Show the form for creating a new supplier.
     */
    public function create(): Response
    {
        return Inertia::render('Suppliers/Create');
    }

    /**
     * Store a newly created supplier.
     */
    public function store(StoreSupplierRequest $request)
    {
        $validated = $request->validated();
        $validated['removed'] = false;
        $supplier = Supplier::create($validated);

        return redirect()->route('suppliers.index')
            ->with('success', 'Fornitore creato con successo.');
    }

    /**
     * Display the specified supplier.
     */
    public function show(Supplier $supplier): Response
    {
        return Inertia::render('Suppliers/Show', [
            'supplier' => $supplier,
        ]);
    }

    /**
     * Show the form for editing the specified supplier.
     */
    public function edit(Supplier $supplier): Response
    {
        return Inertia::render('Suppliers/Edit', [
            'supplier' => $supplier,
        ]);
    }

    /**
     * Update the specified supplier.
     */
    public function update(UpdateSupplierRequest $request, Supplier $supplier)
    {
        $supplier->update($request->validated());

        return redirect()->route('suppliers.index')
            ->with('success', 'Fornitore aggiornato con successo.');
    }

    /**
     * Remove the specified supplier (soft delete).
     */
    public function destroy(Supplier $supplier)
    {
        $supplier->update(['removed' => true]);

        return redirect()->route('suppliers.index')
            ->with('success', 'Fornitore eliminato con successo.');
    }
}
