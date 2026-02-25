<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCustomerShippingAddressRequest;
use App\Http\Requests\UpdateCustomerShippingAddressRequest;
use App\Models\Customer;
use App\Models\CustomerDivision;
use App\Models\CustomerShippingAddress;
use App\Repositories\CustomerRepository;
use App\Repositories\CustomerShippingAddressRepository;
use App\Repositories\OrderRepository;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CustomerShippingAddressController extends Controller
{
    protected CustomerShippingAddressRepository $repository;

    protected CustomerRepository $customerRepository;

    protected OrderRepository $orderRepository;

    public function __construct(
        CustomerShippingAddressRepository $repository,
        CustomerRepository $customerRepository,
        OrderRepository $orderRepository
    ) {
        $this->repository = $repository;
        $this->customerRepository = $customerRepository;
        $this->orderRepository = $orderRepository;
    }

    /**
     * Display a listing of customer shipping addresses.
     */
    public function index(Request $request): Response
    {
        $addresses = $this->repository->getForIndex($request);
        $divisions = $this->repository->getDivisionsForForm();

        return Inertia::render('CustomerShippingAddresses/Index', [
            'addresses' => $addresses,
            'divisions' => $divisions,
            'filters' => $request->only(['search', 'customerdivision_uuid', 'sort_by', 'sort_order', 'per_page']),
        ]);
    }

    /**
     * Show the form for creating a new customer shipping address.
     */
    public function create(Request $request): Response
    {
        $customers = Customer::active()->orderBy('company_name')->get(['uuid', 'code', 'company_name']);

        $customerUuid = $request->get('customer_uuid');
        $divisions = $customerUuid ? $this->repository->getDivisionsForForm($customerUuid) : collect([]);

        return Inertia::render('CustomerShippingAddresses/Create', [
            'customers' => $customers,
            'divisions' => $divisions,
            'customer_uuid' => $customerUuid,
            'customerdivision_uuid' => $request->get('customerdivision_uuid'),
        ]);
    }

    /**
     * Store a newly created customer shipping address.
     */
    public function store(StoreCustomerShippingAddressRequest $request)
    {
        $address = CustomerShippingAddress::create($request->validated());

        // Get division's customer_uuid to invalidate cache
        $division = CustomerDivision::where('uuid', $address->customerdivision_uuid)->first();
        if ($division) {
            $this->repository->clearCache($division->customer_uuid);
        }

        return redirect()->route('customer-shipping-addresses.index')
            ->with('success', __('flash.customer_shipping_address.created'));
    }

    /**
     * Display the specified customer shipping address.
     */
    public function show(CustomerShippingAddress $customerShippingAddress): Response
    {
        $customerShippingAddress->load(['customerDivision.customer', 'orders']);

        return Inertia::render('CustomerShippingAddresses/Show', [
            'address' => $customerShippingAddress,
        ]);
    }

    /**
     * Show the form for editing the specified customer shipping address.
     */
    public function edit(CustomerShippingAddress $customerShippingAddress): Response
    {
        $customerShippingAddress->load('customerDivision.customer');

        $customers = $this->customerRepository->getForSelect();

        $customer_uuid = $customerShippingAddress->customerDivision->customer_uuid ?? null;
        $divisions = $customer_uuid ? $this->repository->getDivisionsForForm($customer_uuid) : collect([]);

        return Inertia::render('CustomerShippingAddresses/Edit', [
            'address' => $customerShippingAddress,
            'customers' => $customers,
            'divisions' => $divisions,
            'customer_uuid' => $customer_uuid,
        ]);
    }

    /**
     * Update the specified customer shipping address.
     */
    public function update(UpdateCustomerShippingAddressRequest $request, CustomerShippingAddress $customerShippingAddress)
    {
        $oldDivision = $customerShippingAddress->customerDivision;
        $oldCustomerUuid = $oldDivision ? $oldDivision->customer_uuid : null;

        $customerShippingAddress->update($request->validated());

        // Get new division to invalidate cache
        $newDivision = CustomerDivision::where('uuid', $customerShippingAddress->customerdivision_uuid)->first();
        $newCustomerUuid = $newDivision ? $newDivision->customer_uuid : null;

        // Invalidate cache (both previous and new customer if changed)
        if ($oldCustomerUuid) {
            $this->repository->clearCache($oldCustomerUuid);
        }
        if ($newCustomerUuid && $oldCustomerUuid !== $newCustomerUuid) {
            $this->repository->clearCache($newCustomerUuid);
        }

        return redirect()->route('customer-shipping-addresses.index')
            ->with('success', __('flash.customer_shipping_address.updated'));
    }

    /**
     * Remove the specified customer shipping address (soft delete).
     */
    public function destroy(CustomerShippingAddress $customerShippingAddress)
    {
        // Check if it has associated orders
        if ($customerShippingAddress->orders()->where('removed', false)->exists()) {
            return back()->withErrors([
                'error' => __('flash.cannot_delete_address'),
            ]);
        }

        $division = $customerShippingAddress->customerDivision;
        $customerUuid = $division ? $division->customer_uuid : null;

        $customerShippingAddress->update(['removed' => true]);

        // Invalidate shipping address cache (clear all since we do not know which articles use them)
        $this->orderRepository->clearShippingAddressesCache();

        // Invalidate repository cache
        if ($customerUuid) {
            $this->repository->clearCache($customerUuid);
        }

        return redirect()->route('customer-shipping-addresses.index')
            ->with('success', __('flash.customer_shipping_address.deleted'));
    }

    /**
     * Load divisions by customer UUID (for AJAX requests).
     */
    public function loadDivisions(Request $request)
    {
        $request->validate([
            'customer_uuid' => 'required|exists:customer,uuid',
        ]);

        $divisions = $this->repository->getByCustomerUuid($request->get('customer_uuid'));

        // If it's an AJAX/Inertia request, return JSON
        if ($request->wantsJson() || $request->header('X-Inertia')) {
            return response()->json([
                'customer_divisions' => $divisions,
            ]);
        }

        // Return as Inertia props for consistency
        return Inertia::render('CustomerShippingAddresses/Create', [
            'customers' => $this->customerRepository->getForSelect(),
            'divisions' => $divisions,
            'customer_uuid' => $request->get('customer_uuid'),
        ]);
    }
}
