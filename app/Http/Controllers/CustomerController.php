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

        // Invalidate cache
        $this->customerRepository->clearCache();

        return redirect()->route('customers.index')
            ->with('success', __('flash.customer.created'));
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

        // Invalidate cache
        $this->customerRepository->clearCache();

        return redirect()->route('customers.index')
            ->with('success', __('flash.customer.updated'));
    }

    /**
     * Remove the specified customer (soft delete).
     */
    public function destroy(Customer $customer)
    {
        // Verify if has active divisions
        if ($customer->divisions()->where('removed', false)->exists()) {
            return back()->withErrors([
                'error' => __('flash.cannot_delete_customer_divisions'),
            ]);
        }

        // Verify if has active offers
        if ($customer->offers()->where('removed', false)->exists()) {
            return back()->withErrors([
                'error' => __('flash.cannot_delete_customer_offers'),
            ]);
        }

        $customer->update(['removed' => true]);

        // Invalidate cache
        $this->customerRepository->clearCache();

        return redirect()->route('customers.index')
            ->with('success', __('flash.customer.deleted'));
    }
}
