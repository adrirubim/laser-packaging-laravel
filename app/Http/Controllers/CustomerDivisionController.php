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

        // Invalidate cache
        $this->repository->clearCache($division->customer_uuid);

        return redirect()->route('customer-divisions.index')
            ->with('success', __('flash.customer_division.created'));
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

        // Invalidate cache (both previous and new customer if changed)
        $this->repository->clearCache($oldCustomerUuid);
        if ($oldCustomerUuid !== $customerDivision->customer_uuid) {
            $this->repository->clearCache($customerDivision->customer_uuid);
        }

        return redirect()->route('customer-divisions.index')
            ->with('success', __('flash.customer_division.updated'));
    }

    /**
     * Remove the specified customer division (soft delete).
     */
    public function destroy(CustomerDivision $customerDivision)
    {
        // Verify if has active shipping addresses
        if ($customerDivision->shippingAddresses()->where('removed', false)->exists()) {
            return back()->withErrors([
                'error' => __('flash.cannot_delete_division_addresses'),
            ]);
        }

        // Verify if has active offers
        if ($customerDivision->offers()->where('removed', false)->exists()) {
            return back()->withErrors([
                'error' => __('flash.cannot_delete_division_offers'),
            ]);
        }

        $customerUuid = $customerDivision->customer_uuid;
        $customerDivision->update(['removed' => true]);

        // Invalidate cache
        $this->repository->clearCache($customerUuid);

        return redirect()->route('customer-divisions.index')
            ->with('success', __('flash.customer_division.deleted'));
    }
}
