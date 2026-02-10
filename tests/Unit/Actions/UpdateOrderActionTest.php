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

    #[Test]
    public function it_does_not_change_status_when_worked_quantity_is_missing()
    {
        $fakeService = new class extends OrderProductionNumberService
        {
            public function __construct() {}
        };

        $this->app->instance(OrderProductionNumberService::class, $fakeService);

        $order = Order::factory()->create([
            'order_production_number' => 'ORD-NO-WORKED',
            'status' => OrderStatus::LANCIATO->value,
            'worked_quantity' => 10,
        ]);

        /** @var UpdateOrderAction $action */
        $action = $this->app->make(UpdateOrderAction::class);

        $result = $action->execute($order, [
            'order_production_number' => $order->order_production_number,
            // worked_quantity non passato
        ]);

        $this->assertInstanceOf(Order::class, $result);
        $this->assertSame(OrderStatus::LANCIATO->value, $result->status);
        $this->assertSame(10.0, (float) $result->worked_quantity);
    }

    #[Test]
    public function it_does_not_force_in_avanazamento_when_status_is_already_higher()
    {
        $fakeService = new class extends OrderProductionNumberService
        {
            public function __construct() {}
        };

        $this->app->instance(OrderProductionNumberService::class, $fakeService);

        $order = Order::factory()->create([
            'order_production_number' => 'ORD-STATUS-HIGH',
            'status' => OrderStatus::IN_AVANZAMENTO->value,
            'worked_quantity' => 10,
        ]);

        /** @var UpdateOrderAction $action */
        $action = $this->app->make(UpdateOrderAction::class);

        $result = $action->execute($order, [
            'order_production_number' => $order->order_production_number,
            'worked_quantity' => 20,
        ]);

        $this->assertInstanceOf(Order::class, $result);
        // Rimane IN_AVANZAMENTO, non viene toccato
        $this->assertSame(OrderStatus::IN_AVANZAMENTO->value, $result->status);
        $this->assertSame(20.0, (float) $result->worked_quantity);
    }

    #[Test]
    public function it_respects_explicit_status_even_when_worked_quantity_increases()
    {
        $fakeService = new class extends OrderProductionNumberService
        {
            public function __construct() {}
        };

        $this->app->instance(OrderProductionNumberService::class, $fakeService);

        $order = Order::factory()->create([
            'order_production_number' => 'ORD-EXPLICIT-STATUS',
            'status' => OrderStatus::LANCIATO->value,
            'worked_quantity' => 0,
        ]);

        /** @var UpdateOrderAction $action */
        $action = $this->app->make(UpdateOrderAction::class);

        $result = $action->execute($order, [
            'order_production_number' => $order->order_production_number,
            'worked_quantity' => 5,
            'status' => OrderStatus::SOSPESO->value,
        ]);

        $this->assertInstanceOf(Order::class, $result);
        // Lo status esplicito ha la precedenza
        $this->assertSame(OrderStatus::SOSPESO->value, $result->status);
        $this->assertSame(5.0, (float) $result->worked_quantity);
    }
}
