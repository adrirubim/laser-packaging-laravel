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

        // Ottenere customer_uuid della divisione per invalidare cache
        $division = CustomerDivision::where('uuid', $address->customerdivision_uuid)->first();
        if ($division) {
            $this->repository->clearCache($division->customer_uuid);
        }

        return redirect()->route('customer-shipping-addresses.index')
            ->with('success', 'Indirizzo di spedizione creato con successo.');
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

        // Ottenere nuova divisione per invalidare cache
        $newDivision = CustomerDivision::where('uuid', $customerShippingAddress->customerdivision_uuid)->first();
        $newCustomerUuid = $newDivision ? $newDivision->customer_uuid : null;

        // Invalidare cache (sia del cliente precedente che del nuovo se è cambiato)
        if ($oldCustomerUuid) {
            $this->repository->clearCache($oldCustomerUuid);
        }
        if ($newCustomerUuid && $oldCustomerUuid !== $newCustomerUuid) {
            $this->repository->clearCache($newCustomerUuid);
        }

        return redirect()->route('customer-shipping-addresses.index')
            ->with('success', 'Indirizzo di spedizione aggiornato con successo.');
    }

    /**
     * Remove the specified customer shipping address (soft delete).
     */
    public function destroy(CustomerShippingAddress $customerShippingAddress)
    {
        // Verificare se ha ordini associati
        if ($customerShippingAddress->orders()->where('removed', false)->exists()) {
            return back()->withErrors([
                'error' => 'Non è possibile eliminare l\'indirizzo. Ha ordini associati.',
            ]);
        }

        $division = $customerShippingAddress->customerDivision;
        $customerUuid = $division ? $division->customer_uuid : null;

        $customerShippingAddress->update(['removed' => true]);

        // Invalidare cache indirizzi di spedizione (pulire tutte perché non sappiamo quali articoli le usano)
        $this->orderRepository->clearShippingAddressesCache();

        // Invalidare cache del repository
        if ($customerUuid) {
            $this->repository->clearCache($customerUuid);
        }

        return redirect()->route('customer-shipping-addresses.index')
            ->with('success', 'Indirizzo di spedizione eliminato con successo.');
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

        // Se è una richiesta AJAX/Inertia, restituire JSON
        if ($request->wantsJson() || $request->header('X-Inertia')) {
            return response()->json([
                'customer_divisions' => $divisions,
            ]);
        }

        // Retornar como Inertia props para consistencia
        return Inertia::render('CustomerShippingAddresses/Create', [
            'customers' => $this->customerRepository->getForSelect(),
            'divisions' => $divisions,
            'customer_uuid' => $request->get('customer_uuid'),
        ]);
    }
}
