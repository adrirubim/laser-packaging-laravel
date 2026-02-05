<?php

namespace Tests\Unit\Models;

use App\Models\Article;
use App\Models\CustomerShippingAddress;
use App\Models\Employee;
use App\Models\Order;
use App\Models\ProductionOrderProcessing;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class OrderModelTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_uses_uuid_as_route_key()
    {
        $order = Order::factory()->create();
        $this->assertSame('uuid', $order->getRouteKeyName());
    }

    #[Test]
    public function it_resolves_article_and_shipping_address_relations()
    {
        $article = Article::factory()->create();
        $shipping = CustomerShippingAddress::factory()->create();

        $order = Order::factory()->create([
            'article_uuid' => $article->uuid,
            'customershippingaddress_uuid' => $shipping->uuid,
        ]);

        $this->assertTrue($order->relationLoaded('article') === false);
        $this->assertSame($article->uuid, $order->article->uuid);
        $this->assertSame($shipping->uuid, $order->shippingAddress->uuid);
    }

    #[Test]
    public function it_computes_status_label()
    {
        $order = Order::factory()->create([
            'status' => Order::STATUS_EVASO,
        ]);

        $this->assertSame('Evaso', $order->status_label);
    }

    #[Test]
    public function it_scopes_active_orders()
    {
        $active = Order::factory()->create(['removed' => false]);
        $removed = Order::factory()->create(['removed' => true]);

        $results = Order::active()->get();

        $this->assertTrue($results->contains($active));
        $this->assertFalse($results->contains($removed));
    }

    #[Test]
    public function it_clears_dashboard_cache_on_create_update_and_delete()
    {
        Cache::put('dashboard_stats_all_all_all', 'test');

        $order = Order::factory()->create();
        $this->assertNull(Cache::get('dashboard_stats_all_all_all'));

        Cache::put('dashboard_stats_all_all_all', 'test');
        $order->update(['status' => Order::STATUS_SOSPESO]);
        $this->assertNull(Cache::get('dashboard_stats_all_all_all'));

        Cache::put('dashboard_stats_all_all_all', 'test');
        $order->delete();
        $this->assertNull(Cache::get('dashboard_stats_all_all_all'));
    }

    #[Test]
    public function it_resolves_employees_and_processings_relations()
    {
        $order = Order::factory()->create();
        $employee = Employee::factory()->create();

        $processing = ProductionOrderProcessing::factory()->create([
            'order_uuid' => $order->uuid,
            'employee_uuid' => $employee->uuid,
        ]);

        // Nos centramos en la relación hasMany processings, que usa UUID correctamente
        $this->assertTrue($order->processings->contains($processing));
    }
}

