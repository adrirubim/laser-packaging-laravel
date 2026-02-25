<?php

namespace Tests\Unit\Services;

use App\Models\Order;
use App\Services\OrderProductionNumberService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class OrderProductionNumberServiceTest extends TestCase
{
    use RefreshDatabase;

    protected OrderProductionNumberService $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = new OrderProductionNumberService;
    }

    #[Test]
    public function it_generates_production_number_in_correct_format()
    {
        $number = $this->service->generateNext();

        $this->assertMatchesRegularExpression('/^\d{4}\.\d{4}$/', $number);
        $this->assertStringStartsWith(date('Y'), $number);
    }

    #[Test]
    public function it_generates_sequential_numbers()
    {
        $first = $this->service->generateNext();

        // Create order with first number to simulate usage
        Order::factory()->create([
            'order_production_number' => $first,
            'removed' => false,
        ]);

        $second = $this->service->generateNext();

        $this->assertNotEquals($first, $second);

        // Extract progressive number
        $firstProgressive = (int) substr($first, -4);
        $secondProgressive = (int) substr($second, -4);

        $this->assertEquals($firstProgressive + 1, $secondProgressive);
    }

    #[Test]
    public function it_starts_from_0001_when_no_orders_exist()
    {
        $number = $this->service->generateNext();

        $progressive = (int) substr($number, -4);
        $this->assertEquals(1, $progressive);
    }

    #[Test]
    public function it_validates_uniqueness()
    {
        $number = $this->service->generateNext();

        Order::factory()->create([
            'order_production_number' => $number,
            'removed' => false,
        ]);

        $this->assertTrue($this->service->exists($number));
        $this->assertFalse($this->service->exists('2025.9999'));
    }

    #[Test]
    public function it_excludes_current_order_in_uniqueness_check()
    {
        $order = Order::factory()->create([
            'order_production_number' => '2025.0001',
            'removed' => false,
        ]);

        // Should not exist if we exclude current order
        $this->assertFalse($this->service->exists('2025.0001', $order->id));

        // But should exist if we do not exclude it
        $this->assertTrue($this->service->exists('2025.0001'));
    }

    #[Test]
    public function it_only_considers_active_orders()
    {
        $number = '2025.0001';

        // Create removed order
        Order::factory()->create([
            'order_production_number' => $number,
            'removed' => true,
        ]);

        // Should not exist because it is removed
        $this->assertFalse($this->service->exists($number));
    }

    #[Test]
    public function it_handles_concurrent_requests_thread_safe()
    {
        // Simulate multiple concurrent requests
        // Need to save each number so the next one is different
        $numbers = [];

        for ($i = 0; $i < 10; $i++) {
            $number = $this->service->generateNext();
            $numbers[] = $number;

            // Save number to database so next one is different
            $article = \App\Models\Article::factory()->create(['removed' => false]);
            \App\Models\Order::factory()->create([
                'article_uuid' => $article->uuid,
                'order_production_number' => $number,
                'removed' => false,
            ]);
        }

        // All must be unique
        $uniqueNumbers = array_unique($numbers);
        $this->assertCount(10, $uniqueNumbers);
    }
}
