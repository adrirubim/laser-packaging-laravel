<?php

namespace Tests\Unit\Repositories;

use App\Models\Customer;
use App\Repositories\CustomerRepository;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class CustomerRepositoryTest extends TestCase
{
    use RefreshDatabase;

    protected CustomerRepository $repository;

    protected function setUp(): void
    {
        parent::setUp();
        $this->repository = new CustomerRepository;
    }

    #[Test]
    public function it_returns_paginated_customers_for_index()
    {
        Customer::factory()->count(3)->create(['removed' => false]);

        $request = Request::create('/customers', 'GET');
        $result = $this->repository->getForIndex($request);

        $this->assertInstanceOf(\Illuminate\Pagination\LengthAwarePaginator::class, $result);
        $this->assertCount(3, $result->items());
    }

    #[Test]
    public function it_filters_by_search()
    {
        Customer::factory()->create(['company_name' => 'Acme Corp', 'removed' => false]);
        Customer::factory()->create(['company_name' => 'Other Inc', 'removed' => false]);

        $request = Request::create('/customers', 'GET', ['search' => 'Acme']);
        $result = $this->repository->getForIndex($request);

        $this->assertCount(1, $result->items());
        $this->assertEquals('Acme Corp', $result->items()[0]->company_name);
    }

    #[Test]
    public function it_filters_by_province()
    {
        Customer::factory()->create(['province' => 'RM', 'removed' => false]);
        Customer::factory()->create(['province' => 'MI', 'removed' => false]);

        $request = Request::create('/customers', 'GET', ['province' => 'RM']);
        $result = $this->repository->getForIndex($request);

        $this->assertCount(1, $result->items());
        $this->assertEquals('RM', $result->items()[0]->province);
    }

    #[Test]
    public function it_returns_only_active_customers()
    {
        Customer::factory()->create(['removed' => false, 'code' => 'C1']);
        Customer::factory()->create(['removed' => true, 'code' => 'C2']);

        $request = Request::create('/customers', 'GET');
        $result = $this->repository->getForIndex($request);

        $this->assertCount(1, $result->items());
        $this->assertEquals('C1', $result->items()[0]->code);
    }

    #[Test]
    public function it_returns_customers_for_select_with_cache()
    {
        Customer::factory()->create(['company_name' => 'Test Customer', 'removed' => false]);

        $result = $this->repository->getForSelect();

        $this->assertCount(1, $result);
        $this->assertEquals('Test Customer', $result->first()->company_name);
        $this->assertTrue(Cache::has('customers_for_select'));
    }

    #[Test]
    public function it_clears_cache()
    {
        Customer::factory()->create(['removed' => false]);
        $this->repository->getForSelect();
        $this->assertTrue(Cache::has('customers_for_select'));

        $this->repository->clearCache();
        $this->assertFalse(Cache::has('customers_for_select'));
    }

    #[Test]
    public function it_returns_provinces()
    {
        Customer::factory()->create(['province' => 'RM', 'removed' => false]);
        Customer::factory()->create(['province' => 'RM', 'removed' => false]);
        Customer::factory()->create(['province' => 'MI', 'removed' => false]);

        $provinces = $this->repository->getProvinces();

        $this->assertIsArray($provinces);
        $this->assertContains('RM', $provinces);
        $this->assertContains('MI', $provinces);
        $this->assertCount(2, $provinces);
    }

    #[Test]
    public function it_orders_index_by_sort_by_and_sort_order()
    {
        Customer::factory()->create(['company_name' => 'Z Company', 'removed' => false]);
        Customer::factory()->create(['company_name' => 'A Company', 'removed' => false]);

        $request = Request::create('/customers', 'GET', ['sort_by' => 'company_name', 'sort_order' => 'asc']);
        $result = $this->repository->getForIndex($request);

        $items = $result->items();
        $this->assertEquals('A Company', $items[0]->company_name);
        $this->assertEquals('Z Company', $items[1]->company_name);
    }
}
