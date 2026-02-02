<?php

namespace Tests\Unit\Repositories;

use App\Enums\OrderStatus;
use App\Models\Article;
use App\Models\Customer;
use App\Models\CustomerDivision;
use App\Models\Offer;
use App\Models\Order;
use App\Repositories\CustomerRepository;
use App\Repositories\DashboardRepository;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class DashboardRepositoryTest extends TestCase
{
    use RefreshDatabase;

    protected DashboardRepository $repository;

    protected Customer $customer;

    protected CustomerDivision $division;

    protected Offer $offer;

    protected Article $article;

    protected function setUp(): void
    {
        parent::setUp();

        $customerRepository = $this->app->make(CustomerRepository::class);
        $this->repository = new DashboardRepository($customerRepository);

        $this->customer = Customer::factory()->create(['removed' => false]);
        $this->division = CustomerDivision::factory()->create([
            'customer_uuid' => $this->customer->uuid,
            'removed' => false,
        ]);
        $this->offer = Offer::factory()->create([
            'customer_uuid' => $this->customer->uuid,
            'customerdivision_uuid' => $this->division->uuid,
            'removed' => false,
        ]);
        $this->article = Article::factory()->create([
            'offer_uuid' => $this->offer->uuid,
            'removed' => false,
        ]);
    }

    #[Test]
    public function it_gets_statistics()
    {
        Order::factory()->create([
            'article_uuid' => $this->article->uuid,
            'order_production_number' => '2025.0001',
            'quantity' => 100,
            'worked_quantity' => 50,
            'status' => OrderStatus::LANCIATO->value,
            'removed' => false,
        ]);

        $dateRange = ['start' => null, 'end' => null];
        $statistics = $this->repository->getStatistics($dateRange);

        $this->assertIsArray($statistics);
        $this->assertArrayHasKey('orders', $statistics);
        $this->assertArrayHasKey('offers', $statistics);
        $this->assertArrayHasKey('articles', $statistics);
        $this->assertArrayHasKey('customers', $statistics);
        $this->assertArrayHasKey('production', $statistics);
        $this->assertEquals(1, $statistics['orders']['total']);
    }

    #[Test]
    public function it_filters_statistics_by_customer()
    {
        $otherCustomer = Customer::factory()->create(['removed' => false]);
        $otherDivision = CustomerDivision::factory()->create([
            'customer_uuid' => $otherCustomer->uuid,
            'removed' => false,
        ]);
        $otherOffer = Offer::factory()->create([
            'customer_uuid' => $otherCustomer->uuid,
            'customerdivision_uuid' => $otherDivision->uuid,
            'removed' => false,
        ]);
        $otherArticle = Article::factory()->create([
            'offer_uuid' => $otherOffer->uuid,
            'removed' => false,
        ]);

        Order::factory()->create([
            'article_uuid' => $this->article->uuid,
            'order_production_number' => '2025.0002',
            'quantity' => 100,
            'status' => OrderStatus::LANCIATO->value,
            'removed' => false,
        ]);

        Order::factory()->create([
            'article_uuid' => $otherArticle->uuid,
            'order_production_number' => '2025.0003',
            'quantity' => 200,
            'status' => OrderStatus::LANCIATO->value,
            'removed' => false,
        ]);

        $dateRange = ['start' => null, 'end' => null];
        $statistics = $this->repository->getStatistics($dateRange, $this->customer->uuid);

        $this->assertEquals(1, $statistics['orders']['total']);
    }

    #[Test]
    public function it_filters_statistics_by_status()
    {
        Order::factory()->create([
            'article_uuid' => $this->article->uuid,
            'order_production_number' => '2025.0004',
            'quantity' => 100,
            'status' => OrderStatus::LANCIATO->value,
            'removed' => false,
        ]);

        Order::factory()->create([
            'article_uuid' => $this->article->uuid,
            'order_production_number' => '2025.0005',
            'quantity' => 200,
            'status' => OrderStatus::IN_AVANZAMENTO->value,
            'removed' => false,
        ]);

        $dateRange = ['start' => null, 'end' => null];
        $statistics = $this->repository->getStatistics($dateRange, null, [OrderStatus::LANCIATO->value]);

        $this->assertEquals(1, $statistics['orders']['total']);
        $this->assertEquals(1, $statistics['orders']['lanciato']);
    }

    #[Test]
    public function it_gets_urgent_orders()
    {
        Order::factory()->create([
            'article_uuid' => $this->article->uuid,
            'order_production_number' => '2025.0006',
            'quantity' => 100,
            'delivery_requested_date' => now()->addDays(5),
            'status' => OrderStatus::LANCIATO->value,
            'removed' => false,
        ]);

        $urgentOrders = $this->repository->getUrgentOrders();

        $this->assertIsArray($urgentOrders);
        $this->assertCount(1, $urgentOrders);
        $this->assertEquals('2025.0006', $urgentOrders[0]['order_production_number']);
    }

    #[Test]
    public function it_gets_recent_orders()
    {
        Order::factory()->create([
            'article_uuid' => $this->article->uuid,
            'order_production_number' => '2025.0007',
            'quantity' => 100,
            'removed' => false,
        ]);

        $recentOrders = $this->repository->getRecentOrders();

        $this->assertIsArray($recentOrders);
        $this->assertCount(1, $recentOrders);
        $this->assertEquals('2025.0007', $recentOrders[0]['order_production_number']);
    }

    #[Test]
    public function it_gets_top_customers()
    {
        Order::factory()->count(3)->create([
            'article_uuid' => $this->article->uuid,
            'quantity' => 100,
            'removed' => false,
        ]);

        $dateRange = ['start' => null, 'end' => null];
        $topCustomers = $this->repository->getTopCustomers($dateRange);

        $this->assertIsArray($topCustomers);
        $this->assertCount(1, $topCustomers);
        $this->assertEquals($this->customer->uuid, $topCustomers[0]['uuid']);
        $this->assertEquals(3, $topCustomers[0]['order_count']);
    }

    #[Test]
    public function it_filters_top_customers_by_customer()
    {
        $dateRange = ['start' => null, 'end' => null];
        $topCustomers = $this->repository->getTopCustomers($dateRange, 5, $this->customer->uuid);

        $this->assertIsArray($topCustomers);
    }

    #[Test]
    public function it_gets_top_articles()
    {
        Order::factory()->create([
            'article_uuid' => $this->article->uuid,
            'order_production_number' => '2025.0008',
            'quantity' => 100,
            'removed' => false,
        ]);

        Order::factory()->create([
            'article_uuid' => $this->article->uuid,
            'order_production_number' => '2025.0009',
            'quantity' => 200,
            'removed' => false,
        ]);

        $dateRange = ['start' => null, 'end' => null];
        $topArticles = $this->repository->getTopArticles($dateRange);

        $this->assertIsArray($topArticles);
        $this->assertCount(1, $topArticles);
        $this->assertEquals($this->article->uuid, $topArticles[0]['uuid']);
        $this->assertEquals(300, $topArticles[0]['total_quantity']);
    }

    #[Test]
    public function it_gets_performance_metrics()
    {
        Order::factory()->create([
            'article_uuid' => $this->article->uuid,
            'order_production_number' => '2025.0010',
            'quantity' => 100,
            'status' => OrderStatus::EVASO->value,
            'removed' => false,
        ]);

        $dateRange = ['start' => null, 'end' => null];
        $metrics = $this->repository->getPerformanceMetrics($dateRange);

        $this->assertIsArray($metrics);
        $this->assertArrayHasKey('completion_rate', $metrics);
        $this->assertArrayHasKey('avg_production_time_days', $metrics);
        $this->assertArrayHasKey('orders_per_day', $metrics);
        $this->assertEquals(100, $metrics['completion_rate']);
    }

    #[Test]
    public function it_gets_alerts()
    {
        Order::factory()->create([
            'article_uuid' => $this->article->uuid,
            'order_production_number' => '2025.0011',
            'quantity' => 100,
            'status' => OrderStatus::SOSPESO->value,
            'removed' => false,
        ]);

        $alerts = $this->repository->getAlerts();

        $this->assertIsArray($alerts);
        $this->assertGreaterThan(0, count($alerts));
    }

    #[Test]
    public function it_gets_comparison_stats()
    {
        $dateRange = [
            'start' => now()->startOfWeek(),
            'end' => now()->endOfWeek(),
        ];

        $comparisonStats = $this->repository->getComparisonStats('week', $dateRange);

        $this->assertIsArray($comparisonStats);
        $this->assertArrayHasKey('orders', $comparisonStats);
        $this->assertArrayHasKey('production', $comparisonStats);
    }

    #[Test]
    public function it_returns_null_comparison_stats_for_all_filter()
    {
        $dateRange = ['start' => null, 'end' => null];
        $comparisonStats = $this->repository->getComparisonStats('all', $dateRange);

        $this->assertNull($comparisonStats);
    }

    #[Test]
    public function it_gets_production_progress_data()
    {
        Order::factory()->create([
            'article_uuid' => $this->article->uuid,
            'order_production_number' => '2025.0012',
            'quantity' => 100,
            'worked_quantity' => 50,
            'delivery_requested_date' => now()->addDays(5),
            'status' => OrderStatus::LANCIATO->value,
            'removed' => false,
        ]);

        $progressData = $this->repository->getProductionProgressData();

        $this->assertIsArray($progressData);
        $this->assertCount(1, $progressData);
        $this->assertEquals('2025.0012', $progressData[0]['orderNumber']);
        $this->assertEquals(50, $progressData[0]['progress']);
    }

    #[Test]
    public function it_gets_customers_for_filter()
    {
        $customers = $this->repository->getCustomersForFilter();

        $this->assertIsArray($customers);
        $this->assertGreaterThan(0, count($customers));
    }

    #[Test]
    public function it_gets_order_statuses_for_filter()
    {
        $statuses = $this->repository->getOrderStatusesForFilter();

        $this->assertIsArray($statuses);
        $this->assertCount(5, $statuses);
    }

    #[Test]
    public function it_gets_orders_trend()
    {
        Order::factory()->create([
            'article_uuid' => $this->article->uuid,
            'order_production_number' => '2025.0013',
            'quantity' => 100,
            'created_at' => now(),
            'removed' => false,
        ]);

        $dateRange = ['start' => now()->startOfDay(), 'end' => now()->endOfDay()];
        $trend = $this->repository->getOrdersTrend($dateRange);

        $this->assertIsArray($trend);
        $this->assertGreaterThan(0, count($trend));
    }

    #[Test]
    public function it_filters_orders_trend_by_customer()
    {
        Order::factory()->create([
            'article_uuid' => $this->article->uuid,
            'order_production_number' => '2025.0014',
            'quantity' => 100,
            'created_at' => now(),
            'removed' => false,
        ]);

        $dateRange = ['start' => now()->startOfDay(), 'end' => now()->endOfDay()];
        $trend = $this->repository->getOrdersTrend($dateRange, 'day', $this->customer->uuid);

        $this->assertIsArray($trend);
    }

    #[Test]
    public function it_filters_orders_trend_by_status()
    {
        Order::factory()->create([
            'article_uuid' => $this->article->uuid,
            'order_production_number' => '2025.0015',
            'quantity' => 100,
            'status' => OrderStatus::LANCIATO->value,
            'created_at' => now(),
            'removed' => false,
        ]);

        $dateRange = ['start' => now()->startOfDay(), 'end' => now()->endOfDay()];
        $trend = $this->repository->getOrdersTrend($dateRange, 'day', null, [OrderStatus::LANCIATO->value]);

        $this->assertIsArray($trend);
    }
}
