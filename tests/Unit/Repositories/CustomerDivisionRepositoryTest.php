<?php

namespace Tests\Unit\Repositories;

use App\Models\Customer;
use App\Models\CustomerDivision;
use App\Repositories\CustomerDivisionRepository;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class CustomerDivisionRepositoryTest extends TestCase
{
    use RefreshDatabase;

    protected CustomerDivisionRepository $repository;

    protected function setUp(): void
    {
        parent::setUp();
        $this->repository = new CustomerDivisionRepository;
    }

    #[Test]
    public function it_returns_paginated_divisions_for_index()
    {
        $customer = Customer::factory()->create(['removed' => false]);
        CustomerDivision::factory()->count(3)->create(['customer_uuid' => $customer->uuid, 'removed' => false]);

        $request = Request::create('/customer-divisions', 'GET');
        $result = $this->repository->getForIndex($request);

        $this->assertInstanceOf(\Illuminate\Pagination\LengthAwarePaginator::class, $result);
        $this->assertCount(3, $result->items());
    }

    #[Test]
    public function it_filters_by_customer_uuid()
    {
        $c1 = Customer::factory()->create(['removed' => false]);
        $c2 = Customer::factory()->create(['removed' => false]);
        CustomerDivision::factory()->create(['customer_uuid' => $c1->uuid, 'name' => 'Div 1', 'removed' => false]);
        CustomerDivision::factory()->create(['customer_uuid' => $c2->uuid, 'name' => 'Div 2', 'removed' => false]);

        $request = Request::create('/customer-divisions', 'GET', ['customer_uuid' => $c1->uuid]);
        $result = $this->repository->getForIndex($request);

        $this->assertCount(1, $result->items());
        $this->assertEquals('Div 1', $result->items()[0]->name);
    }

    #[Test]
    public function it_searches_by_name()
    {
        $customer = Customer::factory()->create(['removed' => false]);
        CustomerDivision::factory()->create(['customer_uuid' => $customer->uuid, 'name' => 'Target Division', 'removed' => false]);
        CustomerDivision::factory()->create(['customer_uuid' => $customer->uuid, 'name' => 'Other Division', 'removed' => false]);

        $request = Request::create('/customer-divisions', 'GET', ['search' => 'Target']);
        $result = $this->repository->getForIndex($request);

        $this->assertCount(1, $result->items());
        $this->assertEquals('Target Division', $result->items()[0]->name);
    }

    #[Test]
    public function it_returns_divisions_for_select_with_cache()
    {
        $customer = Customer::factory()->create(['removed' => false]);
        CustomerDivision::factory()->create(['customer_uuid' => $customer->uuid, 'name' => 'Division A', 'removed' => false]);

        $result = $this->repository->getForSelect();

        $this->assertCount(1, $result);
        $this->assertEquals('Division A', $result->first()->name);
        $this->assertTrue(Cache::has('customer_divisions_for_select_all'));
    }

    #[Test]
    public function it_returns_divisions_for_select_filtered_by_customer()
    {
        $customer = Customer::factory()->create(['removed' => false]);
        CustomerDivision::factory()->create(['customer_uuid' => $customer->uuid, 'name' => 'Div For Customer', 'removed' => false]);

        $result = $this->repository->getForSelect($customer->uuid);

        $this->assertCount(1, $result);
        $this->assertEquals('Div For Customer', $result->first()->name);
        $this->assertTrue(Cache::has("customer_divisions_for_select_{$customer->uuid}"));
    }

    #[Test]
    public function it_returns_divisions_by_customer_uuid()
    {
        $customer = Customer::factory()->create(['removed' => false]);
        CustomerDivision::factory()->create(['customer_uuid' => $customer->uuid, 'name' => 'Div 1', 'removed' => false]);

        $result = $this->repository->getByCustomerUuid($customer->uuid);

        $this->assertCount(1, $result);
        $this->assertEquals('Div 1', $result->first()->name);
    }

    #[Test]
    public function it_clears_cache()
    {
        $customer = Customer::factory()->create(['removed' => false]);
        CustomerDivision::factory()->create(['customer_uuid' => $customer->uuid, 'removed' => false]);
        $this->repository->getForSelect($customer->uuid);
        $this->assertTrue(Cache::has("customer_divisions_for_select_{$customer->uuid}"));

        $this->repository->clearCache($customer->uuid);
        $this->assertFalse(Cache::has("customer_divisions_for_select_{$customer->uuid}"));

        $this->repository->getForSelect();
        $this->assertTrue(Cache::has('customer_divisions_for_select_all'));
        $this->repository->clearCache();
        $this->assertFalse(Cache::has('customer_divisions_for_select_all'));
    }
}
