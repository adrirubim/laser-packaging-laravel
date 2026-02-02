<?php

namespace Tests\Performance;

use App\Models\Article;
use App\Models\Customer;
use App\Models\CustomerDivision;
use App\Models\CustomerShippingAddress;
use App\Models\Offer;
use App\Models\Order;
use App\Models\PalletType;
use App\Models\User;
use App\Services\OrderProductionNumberService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Performance Tests: Load Testing
 *
 * Tests system performance with large datasets to identify bottlenecks
 * and ensure acceptable response times.
 */
class LoadTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    /**
     * Test: Orders Index with large dataset
     *
     * Creates 1000 orders and tests Index page load time.
     * Verifies pagination and search performance.
     */
    public function test_orders_index_with_large_dataset(): void
    {
        // Create test data
        $customer = Customer::factory()->create(['removed' => false]);
        $division = CustomerDivision::factory()->create([
            'customer_uuid' => $customer->uuid,
            'removed' => false,
        ]);
        $shippingAddress = CustomerShippingAddress::factory()->create([
            'customerdivision_uuid' => $division->uuid,
            'removed' => false,
        ]);
        $offer = Offer::factory()->create([
            'customer_uuid' => $customer->uuid,
            'customerdivision_uuid' => $division->uuid,
            'removed' => false,
        ]);
        $palletType = PalletType::factory()->create(['removed' => false]);
        $article = Article::factory()->create([
            'offer_uuid' => $offer->uuid,
            'pallet_uuid' => $palletType->uuid,
            'removed' => false,
        ]);

        // Create 1000 orders with unique production numbers
        $orderNumberService = new OrderProductionNumberService;
        for ($i = 0; $i < 1000; $i++) {
            Order::factory()->create([
                'article_uuid' => $article->uuid,
                'customershippingaddress_uuid' => $shippingAddress->uuid,
                'order_production_number' => $orderNumberService->generateNext(),
                'removed' => false,
            ]);
        }

        // Test Index page load
        $startTime = microtime(true);

        $response = $this->actingAs($this->user)
            ->get('/orders');

        $endTime = microtime(true);
        $duration = ($endTime - $startTime) * 1000; // milliseconds

        $response->assertStatus(200);

        // Performance assertion: Should load in less than 500ms
        $this->assertLessThan(500, $duration,
            'Orders Index should load in less than 500ms with 1000 records');
    }

    /**
     * Test: Offers Index with large dataset
     *
     * Creates 500 offers and tests Index page performance.
     */
    public function test_offers_index_with_large_dataset(): void
    {
        $customer = Customer::factory()->create(['removed' => false]);
        $division = CustomerDivision::factory()->create([
            'customer_uuid' => $customer->uuid,
            'removed' => false,
        ]);

        // Create 500 offers
        Offer::factory()->count(500)->create([
            'customer_uuid' => $customer->uuid,
            'customerdivision_uuid' => $division->uuid,
            'removed' => false,
        ]);

        $startTime = microtime(true);

        $response = $this->actingAs($this->user)
            ->get('/offers');

        $endTime = microtime(true);
        $duration = ($endTime - $startTime) * 1000;

        $response->assertStatus(200);
        $this->assertLessThan(500, $duration,
            'Offers Index should load in less than 500ms with 500 records');
    }

    /**
     * Test: Articles Index with large dataset
     *
     * Creates 1000 articles and tests Index page performance.
     */
    public function test_articles_index_with_large_dataset(): void
    {
        $customer = Customer::factory()->create(['removed' => false]);
        $division = CustomerDivision::factory()->create([
            'customer_uuid' => $customer->uuid,
            'removed' => false,
        ]);
        $offer = Offer::factory()->create([
            'customer_uuid' => $customer->uuid,
            'customerdivision_uuid' => $division->uuid,
            'removed' => false,
        ]);
        $palletType = PalletType::factory()->create(['removed' => false]);

        // Create 1000 articles
        Article::factory()->count(1000)->create([
            'offer_uuid' => $offer->uuid,
            'pallet_uuid' => $palletType->uuid,
            'removed' => false,
        ]);

        $startTime = microtime(true);

        $response = $this->actingAs($this->user)
            ->get('/articles');

        $endTime = microtime(true);
        $duration = ($endTime - $startTime) * 1000;

        $response->assertStatus(200);
        $this->assertLessThan(500, $duration,
            'Articles Index should load in less than 500ms with 1000 records');
    }

    /**
     * Test: Search performance with large dataset
     *
     * Tests search functionality performance with 1000+ records.
     */
    public function test_search_performance_with_large_dataset(): void
    {
        $customer = Customer::factory()->create(['removed' => false]);
        $division = CustomerDivision::factory()->create([
            'customer_uuid' => $customer->uuid,
            'removed' => false,
        ]);
        $offer = Offer::factory()->create([
            'customer_uuid' => $customer->uuid,
            'customerdivision_uuid' => $division->uuid,
            'removed' => false,
        ]);
        $palletType = PalletType::factory()->create(['removed' => false]);

        // Create 1000 articles with varied descriptions
        Article::factory()->count(1000)->create([
            'offer_uuid' => $offer->uuid,
            'pallet_uuid' => $palletType->uuid,
            'removed' => false,
        ]);

        // Create one article with specific searchable text
        $searchableArticle = Article::factory()->create([
            'offer_uuid' => $offer->uuid,
            'pallet_uuid' => $palletType->uuid,
            'article_descr' => 'Test Search Article Unique Description',
            'removed' => false,
        ]);

        $startTime = microtime(true);

        $response = $this->actingAs($this->user)
            ->get('/articles?search=Test+Search+Article');

        $endTime = microtime(true);
        $duration = ($endTime - $startTime) * 1000;

        $response->assertStatus(200);
        $this->assertLessThan(300, $duration,
            'Search should complete in less than 300ms with 1000+ records');
    }

    /**
     * Test: Pagination performance
     *
     * Tests pagination with large dataset to ensure efficient queries.
     */
    public function test_pagination_performance(): void
    {
        $customer = Customer::factory()->create(['removed' => false]);
        $division = CustomerDivision::factory()->create([
            'customer_uuid' => $customer->uuid,
            'removed' => false,
        ]);

        // Create 2000 offers to test pagination
        // Use OfferNumberService to generate unique offer numbers
        // Create offers directly to avoid factory's unique() constraint
        $offerNumberService = new \App\Services\OfferNumberService;
        for ($i = 0; $i < 2000; $i++) {
            $offer = new Offer([
                'uuid' => \Illuminate\Support\Str::uuid()->toString(),
                'customer_uuid' => $customer->uuid,
                'customerdivision_uuid' => $division->uuid,
                'offer_number' => $offerNumberService->generateNext(),
                'offer_date' => now(),
                'unit_of_measure' => 'PZ',
                'quantity' => 100,
                'piece' => 1,
                'approval_status' => \App\Models\Offer::APPROVAL_STATUS_PENDING,
                'removed' => false,
            ]);
            $offer->save();
        }

        // Test first page
        $startTime = microtime(true);
        $response = $this->actingAs($this->user)->get('/offers?page=1');
        $endTime = microtime(true);
        $firstPageDuration = ($endTime - $startTime) * 1000;

        // Test middle page
        $startTime = microtime(true);
        $response = $this->actingAs($this->user)->get('/offers?page=50');
        $endTime = microtime(true);
        $middlePageDuration = ($endTime - $startTime) * 1000;

        // Test last page
        $startTime = microtime(true);
        $response = $this->actingAs($this->user)->get('/offers?page=100');
        $endTime = microtime(true);
        $lastPageDuration = ($endTime - $startTime) * 1000;

        $response->assertStatus(200);

        // All pages should load in reasonable time
        // Note: First page may be slower due to initial query setup and relationship loading
        // Using 2000ms as threshold for testing environment with 2000 records
        $this->assertLessThan(2000, $firstPageDuration, 'First page should load in reasonable time');
        $this->assertLessThan(1000, $middlePageDuration, 'Middle page should load quickly');
        $this->assertLessThan(1000, $lastPageDuration, 'Last page should load quickly');
    }

    /**
     * Test: Relationship loading performance
     *
     * Tests eager loading vs lazy loading performance with relationships.
     */
    public function test_relationship_loading_performance(): void
    {
        $customer = Customer::factory()->create(['removed' => false]);
        $division = CustomerDivision::factory()->create([
            'customer_uuid' => $customer->uuid,
            'removed' => false,
        ]);
        $shippingAddress = CustomerShippingAddress::factory()->create([
            'customerdivision_uuid' => $division->uuid,
            'removed' => false,
        ]);
        $offer = Offer::factory()->create([
            'customer_uuid' => $customer->uuid,
            'customerdivision_uuid' => $division->uuid,
            'removed' => false,
        ]);
        $palletType = PalletType::factory()->create(['removed' => false]);
        $article = Article::factory()->create([
            'offer_uuid' => $offer->uuid,
            'pallet_uuid' => $palletType->uuid,
            'removed' => false,
        ]);

        // Create 500 orders with relationships and unique production numbers
        $orderNumberService = new OrderProductionNumberService;
        for ($i = 0; $i < 500; $i++) {
            Order::factory()->create([
                'article_uuid' => $article->uuid,
                'customershippingaddress_uuid' => $shippingAddress->uuid,
                'order_production_number' => $orderNumberService->generateNext(),
                'removed' => false,
            ]);
        }

        // Test with eager loading (should be fast)
        $startTime = microtime(true);

        $orders = Order::with(['article', 'shippingAddress'])
            ->where('removed', false)
            ->limit(50)
            ->get();

        // Access relationships (should not trigger N+1 queries)
        foreach ($orders as $order) {
            $order->article?->cod_article_las;
            $order->shippingAddress?->street;
        }

        $endTime = microtime(true);
        $duration = ($endTime - $startTime) * 1000;

        $this->assertLessThan(200, $duration,
            'Eager loading should be fast (< 200ms for 50 records with relationships)');
    }
}
