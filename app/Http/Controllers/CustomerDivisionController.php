<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCustomerDivisionRequest;
use App\Http\Requests\UpdateCustomerDivisionRequest;
use App\Models\Customer;
use App\Models\CustomerDivision;
use App\Repositories\CustomerDivisionRepository;
use App\Repositories\CustomerRepository;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CustomerDivisionController extends Controller
{
    protected CustomerDivisionRepository $repository;

    protected CustomerRepository $customerRepository;

    public function __construct(
        CustomerDivisionRepository $repository,
        CustomerRepository $customerRepository
    ) {
        $this->repository = $repository;
        $this->customerRepository = $customerRepository;
    }

    /**
     * Display a listing of customer divisions.
     */
    public function index(Request $request): Response
    {
        $divisions = $this->repository->getForIndex($request);
        $customers = Customer::active()->orderBy('company_name')->get(['uuid', 'company_name']);

        return Inertia::render('CustomerDivisions/Index', [
            'divisions' => $divisions,
            'customers' => $customers,
            'filters' => $request->only(['search', 'customer_uuid', 'sort_by', 'sort_order', 'per_page']),
        ]);
    }

    /**
     * Show the form for creating a new customer division.
     */
    public function create(Request $request): Response
    {
        $customers = $this->customerRepository->getForSelect();

        return Inertia::render('CustomerDivisions/Create', [
            'customers' => $customers,
            'customer_uuid' => $request->get('customer_uuid'),
        ]);
    }

    /**
     * Store a newly created customer division.
     */
    public function store(StoreCustomerDivisionRequest $request)
    {
        $division = CustomerDivision::create($request->validated());

        // Invalidare cache
        $this->repository->clearCache($division->customer_uuid);

        return redirect()->route('customer-divisions.index')
            ->with('success', 'Divisione creata con successo.');
    }

    /**
     * Display the specified customer division.
     */
    public function show(CustomerDivision $customerDivision): Response
    {
        $customerDivision->load(['customer', 'shippingAddresses' => function ($query) {
            $query->where('removed', false);
        }]);

        return Inertia::render('CustomerDivisions/Show', [
            'division' => $customerDivision,
        ]);
    }

    /**
     * Show the form for editing the specified customer division.
     */
    public function edit(CustomerDivision $customerDivision): Response
    {
        $customers = $this->customerRepository->getForSelect();

        return Inertia::render('CustomerDivisions/Edit', [
            'division' => $customerDivision,
            'customers' => $customers,
        ]);
    }

    /**
     * Update the specified customer division.
     */
    public function update(UpdateCustomerDivisionRequest $request, CustomerDivision $customerDivision)
    {
        $oldCustomerUuid = $customerDivision->customer_uuid;
        $customerDivision->update($request->validated());

        // Invalidare cache (sia del cliente precedente che del nuovo se è cambiato)
        $this->repository->clearCache($oldCustomerUuid);
        if ($oldCustomerUuid !== $customerDivision->customer_uuid) {
            $this->repository->clearCache($customerDivision->customer_uuid);
        }

        return redirect()->route('customer-divisions.index')
            ->with('success', 'Divisione aggiornata con successo.');
    }

    /**
     * Remove the specified customer division (soft delete).
     */
    public function destroy(CustomerDivision $customerDivision)
    {
        // Verificare se ha indirizzi di spedizione attivi
        if ($customerDivision->shippingAddresses()->where('removed', false)->exists()) {
            return back()->withErrors([
                'error' => 'Non è possibile eliminare la divisione. Ha indirizzi di spedizione associati.',
            ]);
        }

        // Verificare se ha offerte attive
        if ($customerDivision->offers()->where('removed', false)->exists()) {
            return back()->withErrors([
                'error' => 'Non è possibile eliminare la divisione. Ha offerte associate.',
            ]);
        }

        $customerUuid = $customerDivision->customer_uuid;
        $customerDivision->update(['removed' => true]);

        // Invalidare cache
        $this->repository->clearCache($customerUuid);

        return redirect()->route('customer-divisions.index')
            ->with('success', 'Divisione eliminata con successo.');
    }
}
