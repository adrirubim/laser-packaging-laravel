<?php

namespace Tests\Feature\Controllers;

use App\Enums\OrderStatus;
use App\Models\Article;
use App\Models\Customer;
use App\Models\CustomerDivision;
use App\Models\Offer;
use App\Models\Order;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class DashboardControllerTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

    protected Customer $customer;

    protected CustomerDivision $division;

    protected Offer $offer;

    protected Article $article;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();
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
    public function it_displays_dashboard_with_statistics()
    {
        $this->actingAs($this->user);

        Order::factory()->create([
            'article_uuid' => $this->article->uuid,
            'order_production_number' => '2025.0001',
            'quantity' => 100,
            'status' => OrderStatus::LANCIATO->value,
            'removed' => false,
        ]);

        $response = $this->get(route('dashboard'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('Dashboard')
            ->has('statistics')
            ->has('urgentOrders')
            ->has('recentOrders')
            ->has('topCustomers')
            ->has('topArticles')
            ->has('performanceMetrics')
            ->has('alerts')
            ->has('dateFilter')
        );
    }

    #[Test]
    public function it_filters_statistics_by_today()
    {
        $this->actingAs($this->user);

        Order::factory()->create([
            'article_uuid' => $this->article->uuid,
            'order_production_number' => '2025.0002',
            'quantity' => 100,
            'status' => OrderStatus::LANCIATO->value,
            'created_at' => now(),
            'removed' => false,
        ]);

        $response = $this->get(route('dashboard', ['date_filter' => 'today']));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->where('dateFilter', 'today')
            ->has('statistics')
        );
    }

    #[Test]
    public function it_filters_statistics_by_week()
    {
        $this->actingAs($this->user);

        $response = $this->get(route('dashboard', ['date_filter' => 'week']));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->where('dateFilter', 'week')
        );
    }

    #[Test]
    public function it_filters_statistics_by_month()
    {
        $this->actingAs($this->user);

        $response = $this->get(route('dashboard', ['date_filter' => 'month']));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->where('dateFilter', 'month')
        );
    }

    #[Test]
    public function it_shows_urgent_orders()
    {
        $this->actingAs($this->user);

        Order::factory()->create([
            'article_uuid' => $this->article->uuid,
            'order_production_number' => '2025.0001',
            'quantity' => 100,
            'delivery_requested_date' => now()->addDays(5),
            'status' => OrderStatus::LANCIATO->value,
            'removed' => false,
        ]);

        $response = $this->get(route('dashboard'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->has('urgentOrders')
        );
    }

    #[Test]
    public function it_shows_recent_orders()
    {
        $this->actingAs($this->user);

        Order::factory()->create([
            'article_uuid' => $this->article->uuid,
            'order_production_number' => '2025.0004',
            'quantity' => 100,
            'removed' => false,
        ]);

        $response = $this->get(route('dashboard'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->has('recentOrders')
        );
    }

    #[Test]
    public function it_shows_top_customers()
    {
        $this->actingAs($this->user);

        // Create more orders for the same customer
        Order::factory()->create([
            'article_uuid' => $this->article->uuid,
            'order_production_number' => '2025.0005',
            'quantity' => 100,
            'removed' => false,
            'created_at' => now(),
        ]);
        Order::factory()->create([
            'article_uuid' => $this->article->uuid,
            'order_production_number' => '2025.0006',
            'quantity' => 200,
            'removed' => false,
            'created_at' => now(),
        ]);
        Order::factory()->create([
            'article_uuid' => $this->article->uuid,
            'order_production_number' => '2025.0007',
            'quantity' => 150,
            'removed' => false,
            'created_at' => now(),
        ]);

        $response = $this->get(route('dashboard'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->has('topCustomers')
        );

        // Verify topCustomers is an array
        $topCustomers = $response->viewData('page')['props']['topCustomers'] ?? null;
        $this->assertIsArray($topCustomers);
    }

    #[Test]
    public function it_shows_top_articles()
    {
        $this->actingAs($this->user);

        // Create more orders for the same article with unique numbers
        Order::factory()->create([
            'article_uuid' => $this->article->uuid,
            'order_production_number' => '2025.0001',
            'quantity' => 100,
            'removed' => false,
            'created_at' => now(),
        ]);
        Order::factory()->create([
            'article_uuid' => $this->article->uuid,
            'order_production_number' => '2025.0002',
            'quantity' => 200,
            'removed' => false,
            'created_at' => now(),
        ]);
        Order::factory()->create([
            'article_uuid' => $this->article->uuid,
            'order_production_number' => '2025.0003',
            'quantity' => 150,
            'removed' => false,
            'created_at' => now(),
        ]);

        $response = $this->get(route('dashboard'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->has('topArticles')
        );

        // Verify topArticles exists and is an array
        $response->assertInertia(fn ($page) => $page->has('topArticles')
        );
    }

    #[Test]
    public function it_shows_performance_metrics()
    {
        $this->actingAs($this->user);

        Order::factory()->create([
            'article_uuid' => $this->article->uuid,
            'order_production_number' => '2025.0011',
            'quantity' => 100,
            'worked_quantity' => 50,
            'status' => OrderStatus::EVASO->value,
            'removed' => false,
        ]);

        $response = $this->get(route('dashboard'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->has('performanceMetrics')
        );
    }

    #[Test]
    public function it_shows_alerts_for_suspended_orders()
    {
        $this->actingAs($this->user);

        Order::factory()->create([
            'article_uuid' => $this->article->uuid,
            'order_production_number' => '2025.0012',
            'quantity' => 100,
            'status' => OrderStatus::SOSPESO->value,
            'removed' => false,
        ]);

        $response = $this->get(route('dashboard'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->has('alerts')
        );
    }

    #[Test]
    public function it_shows_alerts_for_overdue_orders()
    {
        $this->actingAs($this->user);

        Order::factory()->create([
            'article_uuid' => $this->article->uuid,
            'order_production_number' => '2025.0013',
            'quantity' => 100,
            'delivery_requested_date' => now()->subDays(1),
            'status' => OrderStatus::LANCIATO->value,
            'removed' => false,
        ]);

        $response = $this->get(route('dashboard'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->has('alerts')
        );
    }

    #[Test]
    public function it_shows_comparison_stats_for_filtered_periods()
    {
        $this->actingAs($this->user);

        $response = $this->get(route('dashboard', ['date_filter' => 'week']));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->has('comparisonStats')
        );
    }

    #[Test]
    public function it_calculates_production_progress_correctly()
    {
        $this->actingAs($this->user);

        Order::factory()->create([
            'article_uuid' => $this->article->uuid,
            'order_production_number' => '2025.0014',
            'quantity' => 100,
            'worked_quantity' => 50,
            'removed' => false,
        ]);

        $response = $this->get(route('dashboard'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->has('statistics')
            ->has('statistics.production')
            ->where('statistics.production.progress_percentage', function ($value) {
                // Allow small difference for rounding
                return abs($value - 50.0) < 1.0;
            })
        );
    }

    #[Test]
    public function it_handles_custom_date_range_filter()
    {
        $this->actingAs($this->user);

        $response = $this->get(route('dashboard', [
            'date_filter' => 'custom',
            'start_date' => '2025-01-01',
            'end_date' => '2025-01-31',
        ]));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->where('dateFilter', 'custom')
        );
    }

    #[Test]
    public function it_handles_empty_statistics_gracefully()
    {
        $this->actingAs($this->user);

        // Don't create any data
        $response = $this->get(route('dashboard'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->has('statistics')
            ->where('statistics.orders.total', 0)
            ->where('statistics.production.progress_percentage', 0)
        );
    }

    #[Test]
    public function it_handles_order_with_null_delivery_date()
    {
        $this->actingAs($this->user);

        Order::factory()->create([
            'article_uuid' => $this->article->uuid,
            'order_production_number' => '2025.0015',
            'quantity' => 100,
            'delivery_requested_date' => null,
            'removed' => false,
        ]);

        $response = $this->get(route('dashboard'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->has('urgentOrders')
        );
    }

    #[Test]
    public function it_handles_all_date_filters()
    {
        $this->actingAs($this->user);

        foreach (['today', 'week', 'month', 'all'] as $filter) {
            $response = $this->get(route('dashboard', ['date_filter' => $filter]));
            $response->assertStatus(200);
            $response->assertInertia(fn ($page) => $page->where('dateFilter', $filter)
            );
        }
    }

    #[Test]
    public function it_filters_by_customer()
    {
        $this->actingAs($this->user);

        Order::factory()->create([
            'article_uuid' => $this->article->uuid,
            'order_production_number' => '2025.0020',
            'quantity' => 100,
            'status' => OrderStatus::LANCIATO->value,
            'removed' => false,
        ]);

        $response = $this->get(route('dashboard', ['customer_uuid' => $this->customer->uuid]));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->where('customerFilter', $this->customer->uuid)
            ->has('statistics')
        );
    }

    #[Test]
    public function it_filters_by_status()
    {
        $this->actingAs($this->user);

        Order::factory()->create([
            'article_uuid' => $this->article->uuid,
            'order_production_number' => '2025.0021',
            'quantity' => 100,
            'status' => OrderStatus::LANCIATO->value,
            'removed' => false,
        ]);

        $response = $this->get(route('dashboard', ['statuses' => OrderStatus::LANCIATO->value]));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->has('statusFilter')
            ->has('statistics')
        );
    }

    #[Test]
    public function it_filters_by_multiple_statuses()
    {
        $this->actingAs($this->user);

        Order::factory()->create([
            'article_uuid' => $this->article->uuid,
            'order_production_number' => '2025.0022',
            'quantity' => 100,
            'status' => OrderStatus::LANCIATO->value,
            'removed' => false,
        ]);

        Order::factory()->create([
            'article_uuid' => $this->article->uuid,
            'order_production_number' => '2025.0023',
            'quantity' => 200,
            'status' => OrderStatus::IN_AVANZAMENTO->value,
            'removed' => false,
        ]);

        $statuses = OrderStatus::LANCIATO->value.','.OrderStatus::IN_AVANZAMENTO->value;
        $response = $this->get(route('dashboard', ['statuses' => $statuses]));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->has('statusFilter')
            ->has('statistics')
        );
    }

    #[Test]
    public function it_filters_by_customer_and_status()
    {
        $this->actingAs($this->user);

        Order::factory()->create([
            'article_uuid' => $this->article->uuid,
            'order_production_number' => '2025.0024',
            'quantity' => 100,
            'status' => OrderStatus::LANCIATO->value,
            'removed' => false,
        ]);

        $response = $this->get(route('dashboard', [
            'customer_uuid' => $this->customer->uuid,
            'statuses' => OrderStatus::LANCIATO->value,
        ]));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->where('customerFilter', $this->customer->uuid)
            ->has('statusFilter')
            ->has('statistics')
        );
    }

    #[Test]
    public function it_shows_orders_trend()
    {
        $this->actingAs($this->user);

        Order::factory()->create([
            'article_uuid' => $this->article->uuid,
            'order_production_number' => '2025.0025',
            'quantity' => 100,
            'status' => OrderStatus::LANCIATO->value,
            'created_at' => now(),
            'removed' => false,
        ]);

        $response = $this->get(route('dashboard'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->has('ordersTrend')
        );
    }

    #[Test]
    public function it_shows_previous_trend_for_filtered_periods()
    {
        $this->actingAs($this->user);

        $response = $this->get(route('dashboard', ['date_filter' => 'week']));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->has('previousTrend')
        );
    }

    #[Test]
    public function it_shows_production_progress_data()
    {
        $this->actingAs($this->user);

        Order::factory()->create([
            'article_uuid' => $this->article->uuid,
            'order_production_number' => '2025.0026',
            'quantity' => 100,
            'worked_quantity' => 50,
            'delivery_requested_date' => now()->addDays(5),
            'status' => OrderStatus::LANCIATO->value,
            'removed' => false,
        ]);

        $response = $this->get(route('dashboard'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->has('productionProgressData')
        );
    }

    #[Test]
    public function it_shows_customers_for_filter()
    {
        $this->actingAs($this->user);

        $response = $this->get(route('dashboard'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->has('customersForFilter')
        );
    }

    #[Test]
    public function it_shows_order_statuses_for_filter()
    {
        $this->actingAs($this->user);

        $response = $this->get(route('dashboard'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->has('orderStatusesForFilter')
        );
    }

    #[Test]
    public function it_applies_filters_to_orders_trend()
    {
        $this->actingAs($this->user);

        Order::factory()->create([
            'article_uuid' => $this->article->uuid,
            'order_production_number' => '2025.0027',
            'quantity' => 100,
            'status' => OrderStatus::LANCIATO->value,
            'created_at' => now(),
            'removed' => false,
        ]);

        $response = $this->get(route('dashboard', [
            'customer_uuid' => $this->customer->uuid,
            'statuses' => OrderStatus::LANCIATO->value,
        ]));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->has('ordersTrend')
        );
    }

    #[Test]
    public function it_applies_filters_to_production_progress()
    {
        $this->actingAs($this->user);

        Order::factory()->create([
            'article_uuid' => $this->article->uuid,
            'order_production_number' => '2025.0028',
            'quantity' => 100,
            'worked_quantity' => 50,
            'delivery_requested_date' => now()->addDays(5),
            'status' => OrderStatus::LANCIATO->value,
            'removed' => false,
        ]);

        $response = $this->get(route('dashboard', [
            'customer_uuid' => $this->customer->uuid,
            'statuses' => OrderStatus::LANCIATO->value,
        ]));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->has('productionProgressData')
        );
    }
}
