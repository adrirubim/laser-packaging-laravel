<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreSupplierRequest;
use App\Http\Requests\UpdateSupplierRequest;
use App\Http\Resources\SupplierResource;
use Domain\Suppliers\Actions\CreateSupplierAction;
use Domain\Suppliers\Actions\ListSuppliersAction;
use Domain\Suppliers\Actions\SoftDeleteSupplierAction;
use Domain\Suppliers\Actions\UpdateSupplierAction;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SupplierController extends Controller
{
    public function __construct(
        protected ListSuppliersAction $listSuppliers,
        protected CreateSupplierAction $createSupplier,
        protected UpdateSupplierAction $updateSupplier,
        protected SoftDeleteSupplierAction $softDeleteSupplier,
    ) {}

    /**
     * Display a listing of suppliers.
     */
    public function index(Request $request): Response
    {
        $suppliers = $this->listSuppliers->execute($request->all());
        $suppliersArray = $suppliers->toArray();
        $suppliersArray['data'] = SupplierResource::collection($suppliers)->resolve();

        return Inertia::render('Suppliers/Index', [
            'suppliers' => $suppliersArray,
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
        $this->createSupplier->execute($request->validated());

        return redirect()->route('suppliers.index')
            ->with('success', __('flash.supplier.created'));
    }

    /**
     * Display the specified supplier.
     */
    public function show(\App\Models\Supplier $supplier): Response
    {
        $supplierResource = SupplierResource::make($supplier)->toArray(request());

        return Inertia::render('Suppliers/Show', [
            'supplier' => $supplierResource,
        ]);
    }

    /**
     * Show the form for editing the specified supplier.
     */
    public function edit(\App\Models\Supplier $supplier): Response
    {
        $supplierResource = SupplierResource::make($supplier)->toArray(request());

        return Inertia::render('Suppliers/Edit', [
            'supplier' => $supplierResource,
        ]);
    }

    /**
     * Update the specified supplier.
     */
    public function update(UpdateSupplierRequest $request, \App\Models\Supplier $supplier)
    {
        $this->updateSupplier->execute($supplier, $request->validated());

        return redirect()->route('suppliers.index')
            ->with('success', __('flash.supplier.updated'));
    }

    /**
     * Remove the specified supplier (soft delete).
     */
    public function destroy(\App\Models\Supplier $supplier)
    {
        $this->softDeleteSupplier->execute($supplier);

        return redirect()->route('suppliers.index')
            ->with('success', __('flash.supplier.deleted'));
    }
}
