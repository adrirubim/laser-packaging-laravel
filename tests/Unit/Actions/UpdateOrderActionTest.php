<?php

namespace Tests\Unit\Actions;

use App\Actions\UpdateOrderAction;
use App\Enums\OrderStatus;
use App\Models\Order;
use App\Services\OrderProductionNumberService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class UpdateOrderActionTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_returns_error_when_production_number_conflicts()
    {
        $existing = Order::factory()->create([
            'order_production_number' => 'ORD-EXISTING',
        ]);

        $order = Order::factory()->create([
            'order_production_number' => 'ORD-ORIGINAL',
        ]);

        /** @var UpdateOrderAction $action */
        $action = $this->app->make(UpdateOrderAction::class);

        $result = $action->execute($order, [
            'order_production_number' => $existing->order_production_number,
        ]);

        $this->assertIsArray($result);
        $this->assertTrue($result['error']);
        $this->assertSame('order_production_number', $result['field']);
        $this->assertNotEmpty($result['message']);
    }

    #[Test]
    public function it_sets_status_to_in_avanazamento_when_worked_quantity_increases()
    {
        $fakeService = new class extends OrderProductionNumberService
        {
            public function __construct() {}
        };

        $this->app->instance(OrderProductionNumberService::class, $fakeService);

        $order = Order::factory()->create([
            'order_production_number' => 'ORD-STATUS',
            'status' => OrderStatus::LANCIATO->value,
            'worked_quantity' => 0,
        ]);

        /** @var UpdateOrderAction $action */
        $action = $this->app->make(UpdateOrderAction::class);

        $result = $action->execute($order, [
            'order_production_number' => $order->order_production_number,
            'worked_quantity' => 5,
        ]);

        $this->assertInstanceOf(Order::class, $result);
        $this->assertSame(OrderStatus::IN_AVANZAMENTO->value, $result->status);
    }
}
