<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCustomerRequest;
use App\Http\Requests\UpdateCustomerRequest;
use App\Models\Customer;
use App\Repositories\CustomerRepository;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CustomerController extends Controller
{
    protected CustomerRepository $customerRepository;

    public function __construct(CustomerRepository $customerRepository)
    {
        $this->customerRepository = $customerRepository;
    }

    /**
     * Display a listing of customers.
     */
    public function index(Request $request): Response
    {
        $customers = $this->customerRepository->getForIndex($request);
        $provinces = $this->customerRepository->getProvinces();

        return Inertia::render('Customers/Index', [
            'customers' => $customers,
            'filters' => $request->only(['search', 'province', 'sort_by', 'sort_order', 'sort', 'direction', 'per_page']), // Mantener compatibilidad con sort/direction
            'provinces' => $provinces,
        ]);
    }

    /**
     * Show the form for creating a new customer.
     */
    public function create(): Response
    {
        return Inertia::render('Customers/Create');
    }

    /**
     * Store a newly created customer.
     */
    public function store(StoreCustomerRequest $request)
    {
        $customer = Customer::create($request->validated());

        // Invalidare cache
        $this->customerRepository->clearCache();

        return redirect()->route('customers.index')
            ->with('success', 'Cliente creato con successo.');
    }

    /**
     * Display the specified customer.
     */
    public function show(Customer $customer): Response
    {
        $customer->load(['divisions', 'offers']);

        return Inertia::render('Customers/Show', [
            'customer' => $customer,
        ]);
    }

    /**
     * Show the form for editing the specified customer.
     */
    public function edit(Customer $customer): Response
    {
        return Inertia::render('Customers/Edit', [
            'customer' => $customer,
        ]);
    }

    /**
     * Update the specified customer.
     */
    public function update(UpdateCustomerRequest $request, Customer $customer)
    {
        $customer->update($request->validated());

        // Invalidare cache
        $this->customerRepository->clearCache();

        return redirect()->route('customers.index')
            ->with('success', 'Cliente aggiornato con successo.');
    }

    /**
     * Remove the specified customer (soft delete).
     */
    public function destroy(Customer $customer)
    {
        // Verificare se ha divisioni attive
        if ($customer->divisions()->where('removed', false)->exists()) {
            return back()->withErrors([
                'error' => 'Non è possibile eliminare il cliente. Ha divisioni associate.',
            ]);
        }

        // Verificare se ha offerte attive
        if ($customer->offers()->where('removed', false)->exists()) {
            return back()->withErrors([
                'error' => 'Non è possibile eliminare il cliente. Ha offerte associate.',
            ]);
        }

        $customer->update(['removed' => true]);

        // Invalidare cache
        $this->customerRepository->clearCache();

        return redirect()->route('customers.index')
            ->with('success', 'Cliente eliminato con successo.');
    }
}
