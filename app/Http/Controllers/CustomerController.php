<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCustomerRequest;
use App\Http\Requests\UpdateCustomerRequest;
use App\Models\Customer;
use App\Repositories\CustomerRepository;
use Domain\Customers\Actions\CreateCustomerAction;
use Domain\Customers\Actions\ListCustomersAction;
use Domain\Customers\Actions\SoftDeleteCustomerAction;
use Domain\Customers\Actions\UpdateCustomerAction;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CustomerController extends Controller
{
    public function __construct(
        protected CustomerRepository $customerRepository,
        protected ListCustomersAction $listCustomersAction,
        protected CreateCustomerAction $createCustomer,
        protected UpdateCustomerAction $updateCustomer,
        protected SoftDeleteCustomerAction $softDeleteCustomer,
    ) {}

    /**
     * Display a listing of customers.
     */
    public function index(Request $request): Response
    {
        $customers = $this->listCustomersAction->execute($request->all());
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
        $this->createCustomer->execute($request->validated());

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
    public function update(UpdateCustomerRequest $request, \App\Models\Customer $customer)
    {
        $this->updateCustomer->execute($customer, $request->validated());

        // Invalidate cache
        $this->customerRepository->clearCache();

        return redirect()->route('customers.index')
            ->with('success', __('flash.customer.updated'));
    }

    /**
     * Remove the specified customer (soft delete).
     */
    public function destroy(\App\Models\Customer $customer)
    {
        $result = $this->softDeleteCustomer->execute($customer);
        if ($result->canDelete === false) {
            return back()->withErrors([
                'error' => $result->message,
            ]);
        }

        // Invalidate cache
        $this->customerRepository->clearCache();

        return redirect()->route('customers.index')
            ->with('success', __('flash.customer.deleted'));
    }
}
