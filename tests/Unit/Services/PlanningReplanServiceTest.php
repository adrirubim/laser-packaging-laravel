<?php

namespace Tests\Unit\Services;

use App\Models\Order;
use App\Services\Planning\PlanningReplanService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Tests\TestCase;

class PlanningReplanServiceTest extends TestCase
{
    use RefreshDatabase;

    public function test_auto_schedule_order_returns_error_when_order_not_found(): void
    {
        $service = app(PlanningReplanService::class);
        $result = $service->autoScheduleOrder(Str::uuid()->toString());

        $this->assertTrue($result['error']);
        $this->assertSame('Ordine non trovato', $result['message']);
    }

    public function test_auto_schedule_order_returns_success_stub_when_order_exists(): void
    {
        $order = Order::factory()->create(['removed' => false]);
        $service = app(PlanningReplanService::class);
        $result = $service->autoScheduleOrder($order->uuid);

        $this->assertFalse($result['error']);
        $this->assertArrayHasKey('message', $result);
        $this->assertSame(0, $result['quarters_added']);
        $this->assertSame(0, $result['quarters_removed']);
    }

    public function test_replan_future_returns_error_when_order_not_found(): void
    {
        $service = app(PlanningReplanService::class);
        $result = $service->replanFutureAfterManualEdit(Str::uuid()->toString());

        $this->assertTrue($result['error']);
        $this->assertSame('Ordine non trovato', $result['message']);
    }

    public function test_replan_future_returns_success_stub_when_order_exists(): void
    {
        $order = Order::factory()->create(['removed' => false]);
        $service = app(PlanningReplanService::class);
        $result = $service->replanFutureAfterManualEdit($order->uuid);

        $this->assertFalse($result['error']);
        $this->assertArrayHasKey('message', $result);
        $this->assertSame(0, $result['quarters_added']);
        $this->assertSame(0, $result['quarters_removed']);
    }

    public function test_adjust_for_worked_quantity_returns_error_when_order_not_found(): void
    {
        $service = app(PlanningReplanService::class);
        $result = $service->adjustForWorkedQuantity(Str::uuid()->toString());

        $this->assertTrue($result['error']);
        $this->assertSame('Ordine non trovato', $result['message']);
    }

    public function test_adjust_for_worked_quantity_returns_success_stub_when_order_exists(): void
    {
        $order = Order::factory()->create(['removed' => false]);
        $service = app(PlanningReplanService::class);
        $result = $service->adjustForWorkedQuantity($order->uuid);

        $this->assertFalse($result['error']);
        $this->assertArrayHasKey('message', $result);
        $this->assertSame(0, $result['quarters_removed']);
    }
}
