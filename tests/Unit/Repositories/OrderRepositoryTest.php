<?php

namespace Tests\Unit\Repositories;

use App\Models\Article;
use App\Models\Customer;
use App\Models\CustomerDivision;
use App\Models\CustomerShippingAddress;
use App\Models\Offer;
use App\Models\Order;
use App\Repositories\OrderRepository;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class OrderRepositoryTest extends TestCase
{
    use RefreshDatabase;

    protected OrderRepository $repository;

    protected function setUp(): void
    {
        parent::setUp();
        $this->repository = new OrderRepository;
    }

    #[Test]
    public function it_returns_paginated_orders_for_index()
    {
        $customer = Customer::factory()->create(['removed' => false]);
        $division = CustomerDivision::factory()->create(['customer_uuid' => $customer->uuid, 'removed' => false]);
        $address = CustomerShippingAddress::factory()->create(['customerdivision_uuid' => $division->uuid, 'removed' => false]);
        $offer = Offer::factory()->create(['customer_uuid' => $customer->uuid, 'customerdivision_uuid' => $division->uuid, 'removed' => false]);
        $article = Article::factory()->create(['offer_uuid' => $offer->uuid, 'removed' => false]);
        Order::factory()->count(2)->create([
            'article_uuid' => $article->uuid,
            'customershippingaddress_uuid' => $address->uuid,
            'removed' => false,
        ]);

        $request = Request::create('/orders', 'GET');
        $result = $this->repository->getForIndex($request);

        $this->assertInstanceOf(\Illuminate\Pagination\LengthAwarePaginator::class, $result);
        $this->assertCount(2, $result->items());
    }

    #[Test]
    public function it_filters_by_article_uuid()
    {
        $customer = Customer::factory()->create(['removed' => false]);
        $division = CustomerDivision::factory()->create(['customer_uuid' => $customer->uuid, 'removed' => false]);
        $address = CustomerShippingAddress::factory()->create(['customerdivision_uuid' => $division->uuid, 'removed' => false]);
        $offer = Offer::factory()->create(['customer_uuid' => $customer->uuid, 'customerdivision_uuid' => $division->uuid, 'removed' => false]);
        $article1 = Article::factory()->create(['offer_uuid' => $offer->uuid, 'removed' => false]);
        $article2 = Article::factory()->create(['offer_uuid' => $offer->uuid, 'removed' => false]);
        Order::factory()->create(['article_uuid' => $article1->uuid, 'customershippingaddress_uuid' => $address->uuid, 'order_production_number' => '2025.0001', 'removed' => false]);
        Order::factory()->create(['article_uuid' => $article2->uuid, 'customershippingaddress_uuid' => $address->uuid, 'order_production_number' => '2025.0002', 'removed' => false]);

        $request = Request::create('/orders', 'GET', ['article_uuid' => $article1->uuid]);
        $result = $this->repository->getForIndex($request);

        $this->assertCount(1, $result->items());
        $this->assertEquals('2025.0001', $result->items()[0]->order_production_number);
    }

    #[Test]
    public function it_filters_by_status()
    {
        $customer = Customer::factory()->create(['removed' => false]);
        $division = CustomerDivision::factory()->create(['customer_uuid' => $customer->uuid, 'removed' => false]);
        $address = CustomerShippingAddress::factory()->create(['customerdivision_uuid' => $division->uuid, 'removed' => false]);
        $offer = Offer::factory()->create(['customer_uuid' => $customer->uuid, 'customerdivision_uuid' => $division->uuid, 'removed' => false]);
        $article = Article::factory()->create(['offer_uuid' => $offer->uuid, 'removed' => false]);
        Order::factory()->create(['article_uuid' => $article->uuid, 'customershippingaddress_uuid' => $address->uuid, 'status' => 0, 'removed' => false]);
        Order::factory()->create(['article_uuid' => $article->uuid, 'customershippingaddress_uuid' => $address->uuid, 'status' => 2, 'removed' => false]);

        $request = Request::create('/orders', 'GET', ['status' => '0']);
        $result = $this->repository->getForIndex($request);

        $this->assertCount(1, $result->items());
        $this->assertEquals(0, $result->items()[0]->status);
    }

    #[Test]
    public function it_returns_orders_for_production_advancements()
    {
        $customer = Customer::factory()->create(['removed' => false]);
        $division = CustomerDivision::factory()->create(['customer_uuid' => $customer->uuid, 'removed' => false]);
        $address = CustomerShippingAddress::factory()->create(['customerdivision_uuid' => $division->uuid, 'removed' => false]);
        $offer = Offer::factory()->create(['customer_uuid' => $customer->uuid, 'customerdivision_uuid' => $division->uuid, 'removed' => false]);
        $article = Article::factory()->create(['offer_uuid' => $offer->uuid, 'removed' => false]);
        Order::factory()->create([
            'article_uuid' => $article->uuid,
            'customershippingaddress_uuid' => $address->uuid,
            'status' => 2,
            'removed' => false,
        ]);

        $request = Request::create('/orders/production-advancements', 'GET');
        $result = $this->repository->getForProductionAdvancements($request);

        $this->assertInstanceOf(\Illuminate\Pagination\LengthAwarePaginator::class, $result);
        $this->assertGreaterThanOrEqual(1, $result->total());
    }

    #[Test]
    public function it_returns_form_options_with_articles_and_customers()
    {
        $options = $this->repository->getFormOptions();

        $this->assertIsArray($options);
        $this->assertArrayHasKey('articles', $options);
        $this->assertArrayHasKey('customers', $options);
        $this->assertTrue(Cache::has('order_form_options'));
    }

    #[Test]
    public function it_returns_empty_collection_for_shipping_addresses_when_article_uuid_is_null()
    {
        $result = $this->repository->getShippingAddressesForArticle(null);
        $this->assertInstanceOf(\Illuminate\Support\Collection::class, $result);
        $this->assertCount(0, $result);
    }

    #[Test]
    public function it_returns_shipping_addresses_for_article()
    {
        $customer = Customer::factory()->create(['removed' => false]);
        $division = CustomerDivision::factory()->create(['customer_uuid' => $customer->uuid, 'removed' => false]);
        $address = CustomerShippingAddress::factory()->create([
            'customerdivision_uuid' => $division->uuid,
            'street' => 'Via Test 1',
            'removed' => false,
        ]);
        $offer = Offer::factory()->create([
            'customer_uuid' => $customer->uuid,
            'customerdivision_uuid' => $division->uuid,
            'removed' => false,
        ]);
        $article = Article::factory()->create(['offer_uuid' => $offer->uuid, 'removed' => false]);

        $result = $this->repository->getShippingAddressesForArticle($article->uuid);

        $this->assertCount(1, $result);
        $this->assertEquals('Via Test 1', $result->first()->street);
        $this->assertTrue(Cache::has("order_shipping_addresses_{$article->uuid}"));
    }

    #[Test]
    public function it_returns_null_for_article_for_form_when_uuid_is_null()
    {
        $result = $this->repository->getArticleForForm(null);
        $this->assertNull($result);
    }

    #[Test]
    public function it_returns_article_for_form_with_relationships()
    {
        $customer = Customer::factory()->create(['removed' => false]);
        $division = CustomerDivision::factory()->create(['customer_uuid' => $customer->uuid, 'removed' => false]);
        $offer = Offer::factory()->create(['customer_uuid' => $customer->uuid, 'customerdivision_uuid' => $division->uuid, 'removed' => false]);
        $article = Article::factory()->create(['offer_uuid' => $offer->uuid, 'cod_article_las' => 'FORM-ART', 'removed' => false]);

        $result = $this->repository->getArticleForForm($article->uuid);

        $this->assertInstanceOf(Article::class, $result);
        $this->assertEquals('FORM-ART', $result->cod_article_las);
        $this->assertTrue($result->relationLoaded('offer'));
    }

    #[Test]
    public function it_clears_form_options_cache()
    {
        $this->repository->getFormOptions();
        $this->assertTrue(Cache::has('order_form_options'));

        $this->repository->clearFormOptionsCache();
        $this->assertFalse(Cache::has('order_form_options'));
    }

    #[Test]
    public function it_clears_shipping_addresses_cache_for_article()
    {
        $customer = Customer::factory()->create(['removed' => false]);
        $division = CustomerDivision::factory()->create(['customer_uuid' => $customer->uuid, 'removed' => false]);
        $offer = Offer::factory()->create(['customer_uuid' => $customer->uuid, 'customerdivision_uuid' => $division->uuid, 'removed' => false]);
        $article = Article::factory()->create(['offer_uuid' => $offer->uuid, 'removed' => false]);
        $this->repository->getShippingAddressesForArticle($article->uuid);
        $this->assertTrue(Cache::has("order_shipping_addresses_{$article->uuid}"));

        $this->repository->clearShippingAddressesCache($article->uuid);
        $this->assertFalse(Cache::has("order_shipping_addresses_{$article->uuid}"));
    }
}
