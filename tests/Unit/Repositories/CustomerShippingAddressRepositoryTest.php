<?php

namespace Tests\Unit\Repositories;

use App\Models\Customer;
use App\Models\CustomerDivision;
use App\Models\CustomerShippingAddress;
use App\Repositories\CustomerShippingAddressRepository;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class CustomerShippingAddressRepositoryTest extends TestCase
{
    use RefreshDatabase;

    protected CustomerShippingAddressRepository $repository;

    protected function setUp(): void
    {
        parent::setUp();
        $this->repository = new CustomerShippingAddressRepository;
    }

    #[Test]
    public function it_returns_paginated_addresses_for_index()
    {
        $customer = Customer::factory()->create(['removed' => false]);
        $division = CustomerDivision::factory()->create(['customer_uuid' => $customer->uuid, 'removed' => false]);
        CustomerShippingAddress::factory()->count(3)->create(['customerdivision_uuid' => $division->uuid, 'removed' => false]);

        $request = Request::create('/customer-shipping-addresses', 'GET');
        $result = $this->repository->getForIndex($request);

        $this->assertInstanceOf(\Illuminate\Pagination\LengthAwarePaginator::class, $result);
        $this->assertCount(3, $result->items());
    }

    #[Test]
    public function it_filters_by_customerdivision_uuid()
    {
        $customer = Customer::factory()->create(['removed' => false]);
        $div1 = CustomerDivision::factory()->create(['customer_uuid' => $customer->uuid, 'removed' => false]);
        $div2 = CustomerDivision::factory()->create(['customer_uuid' => $customer->uuid, 'removed' => false]);
        CustomerShippingAddress::factory()->create(['customerdivision_uuid' => $div1->uuid, 'street' => 'Street A', 'removed' => false]);
        CustomerShippingAddress::factory()->create(['customerdivision_uuid' => $div2->uuid, 'street' => 'Street B', 'removed' => false]);

        $request = Request::create('/customer-shipping-addresses', 'GET', ['customerdivision_uuid' => $div1->uuid]);
        $result = $this->repository->getForIndex($request);

        $this->assertCount(1, $result->items());
        $this->assertEquals('Street A', $result->items()[0]->street);
    }

    #[Test]
    public function it_searches_by_street()
    {
        $customer = Customer::factory()->create(['removed' => false]);
        $division = CustomerDivision::factory()->create(['customer_uuid' => $customer->uuid, 'removed' => false]);
        CustomerShippingAddress::factory()->create([
            'customerdivision_uuid' => $division->uuid,
            'street' => 'Via Roma 1',
            'city' => 'Roma',
            'postal_code' => '00100',
            'co' => 'c/o Roma Company',
            'contacts' => 'Tel: 111111',
            'removed' => false,
        ]);
        CustomerShippingAddress::factory()->create([
            'customerdivision_uuid' => $division->uuid,
            'street' => 'Via Milano 2',
            'city' => 'Milano',
            'postal_code' => '20100',
            'co' => 'c/o Milano Company',
            'contacts' => 'Tel: 222222',
            'removed' => false,
        ]);

        $request = Request::create('/customer-shipping-addresses', 'GET', ['search' => 'Roma']);
        $result = $this->repository->getForIndex($request);

        $this->assertCount(1, $result->items());
        $this->assertEquals('Via Roma 1', $result->items()[0]->street);
    }

    #[Test]
    public function it_searches_by_division_name()
    {
        $customer = Customer::factory()->create(['removed' => false]);
        $divisionA = CustomerDivision::factory()->create(['customer_uuid' => $customer->uuid, 'name' => 'Wilkinson Group', 'removed' => false]);
        $divisionB = CustomerDivision::factory()->create(['customer_uuid' => $customer->uuid, 'name' => 'Other Division', 'removed' => false]);
        CustomerShippingAddress::factory()->create(['customerdivision_uuid' => $divisionA->uuid, 'street' => 'Via A', 'removed' => false]);
        CustomerShippingAddress::factory()->create(['customerdivision_uuid' => $divisionB->uuid, 'street' => 'Via B', 'removed' => false]);

        $request = Request::create('/customer-shipping-addresses', 'GET', ['search' => 'Wilkinson']);
        $result = $this->repository->getForIndex($request);

        $this->assertCount(1, $result->items());
        $this->assertEquals('Via A', $result->items()[0]->street);
    }

    #[Test]
    public function it_respects_division_filter_when_search_matches_multiple_divisions()
    {
        $customer = Customer::factory()->create(['removed' => false]);
        $division1 = CustomerDivision::factory()->create(['customer_uuid' => $customer->uuid, 'name' => 'Demo All Divisione 1', 'removed' => false]);
        $division2 = CustomerDivision::factory()->create(['customer_uuid' => $customer->uuid, 'name' => 'Demo All Divisione 2', 'removed' => false]);
        CustomerShippingAddress::factory()->create(['customerdivision_uuid' => $division1->uuid, 'street' => 'Via Demo 1', 'removed' => false]);
        CustomerShippingAddress::factory()->create(['customerdivision_uuid' => $division2->uuid, 'street' => 'Via Demo 2', 'removed' => false]);

        $request = Request::create('/customer-shipping-addresses', 'GET', [
            'search' => 'Demo',
            'customerdivision_uuid' => $division2->uuid,
        ]);
        $result = $this->repository->getForIndex($request);

        $this->assertCount(1, $result->items());
        $this->assertEquals($division2->uuid, $result->items()[0]->customerdivision_uuid);
        $this->assertEquals('Via Demo 2', $result->items()[0]->street);
    }

    #[Test]
    public function it_returns_divisions_for_form_with_cache()
    {
        $customer = Customer::factory()->create(['removed' => false]);
        CustomerDivision::factory()->create(['customer_uuid' => $customer->uuid, 'name' => 'Division X', 'removed' => false]);

        $result = $this->repository->getDivisionsForForm($customer->uuid);

        $this->assertCount(1, $result);
        $this->assertEquals('Division X', $result->first()->name);
        $this->assertTrue(Cache::has("shipping_address_divisions_{$customer->uuid}"));
    }

    #[Test]
    public function it_returns_divisions_by_customer_uuid()
    {
        $customer = Customer::factory()->create(['removed' => false]);
        CustomerDivision::factory()->create(['customer_uuid' => $customer->uuid, 'name' => 'Div', 'removed' => false]);

        $result = $this->repository->getByCustomerUuid($customer->uuid);

        $this->assertCount(1, $result);
        $this->assertEquals('Div', $result->first()->name);
    }

    #[Test]
    public function it_clears_cache()
    {
        $customer = Customer::factory()->create(['removed' => false]);
        CustomerDivision::factory()->create(['customer_uuid' => $customer->uuid, 'removed' => false]);
        $this->repository->getDivisionsForForm($customer->uuid);
        $this->assertTrue(Cache::has("shipping_address_divisions_{$customer->uuid}"));

        $this->repository->clearCache($customer->uuid);
        $this->assertFalse(Cache::has("shipping_address_divisions_{$customer->uuid}"));

        $this->repository->getDivisionsForForm();
        $this->assertTrue(Cache::has('shipping_address_divisions_all'));
        $this->repository->clearCache();
        $this->assertFalse(Cache::has('shipping_address_divisions_all'));
    }
}
