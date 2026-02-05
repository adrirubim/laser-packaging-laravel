<?php

namespace Tests\Unit\Actions;

use App\Actions\CreateOrderAction;
use App\Enums\OrderStatus;
use App\Models\Order;
use App\Services\OrderProductionNumberService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class CreateOrderActionTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_returns_error_when_production_number_already_exists()
    {
        $existing = Order::factory()->create([
            'order_production_number' => 'ORD-123',
        ]);

        /** @var CreateOrderAction $action */
        $action = $this->app->make(CreateOrderAction::class);

        $result = $action->execute([
            'article_uuid' => $existing->article_uuid,
            'quantity' => 10,
            'order_production_number' => $existing->order_production_number,
        ]);

        $this->assertIsArray($result);
        $this->assertTrue($result['error']);
        $this->assertSame('order_production_number', $result['field']);
        $this->assertNotEmpty($result['message']);
    }

    #[Test]
    public function it_generates_production_number_and_initial_status_when_missing()
    {
        $fakeService = new class extends OrderProductionNumberService
        {
            public function __construct() {}

            public function generateNext(): string
            {
                return 'ORD-TEST-0001';
            }
        };

        $this->app->instance(OrderProductionNumberService::class, $fakeService);

        /** @var CreateOrderAction $action */
        $action = $this->app->make(CreateOrderAction::class);

        $result = $action->execute([
            'article_uuid' => Order::factory()->make()->article_uuid,
            'quantity' => 5,
        ]);

        $this->assertInstanceOf(Order::class, $result);
        $this->assertSame('ORD-TEST-0001', $result->order_production_number);
        $this->assertSame(OrderStatus::PIANIFICATO->value, $result->status);
        $this->assertIsString($result->status_semaforo);
        $decoded = json_decode($result->status_semaforo, true);
        $this->assertIsArray($decoded);
        $this->assertSame(
            ['etichette' => 0, 'packaging' => 0, 'prodotto' => 0],
            $decoded
        );
    }
}
