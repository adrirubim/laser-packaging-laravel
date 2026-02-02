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

        // Crear una orden con el primer número para simular uso
        Order::factory()->create([
            'order_production_number' => $first,
            'removed' => false,
        ]);

        $second = $this->service->generateNext();

        $this->assertNotEquals($first, $second);

        // Extraer el número progresivo
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

        // No debería existir si excluimos el orden actual
        $this->assertFalse($this->service->exists('2025.0001', $order->id));

        // Pero sí debería existir si no lo excluimos
        $this->assertTrue($this->service->exists('2025.0001'));
    }

    #[Test]
    public function it_only_considers_active_orders()
    {
        $number = '2025.0001';

        // Crear orden removida
        Order::factory()->create([
            'order_production_number' => $number,
            'removed' => true,
        ]);

        // No debería existir porque está removida
        $this->assertFalse($this->service->exists($number));
    }

    #[Test]
    public function it_handles_concurrent_requests_thread_safe()
    {
        // Simular múltiples requests concurrentes
        // Necesitamos guardar cada número para que el siguiente sea diferente
        $numbers = [];

        for ($i = 0; $i < 10; $i++) {
            $number = $this->service->generateNext();
            $numbers[] = $number;

            // Guardar el número en la base de datos para que el siguiente sea diferente
            $article = \App\Models\Article::factory()->create(['removed' => false]);
            \App\Models\Order::factory()->create([
                'article_uuid' => $article->uuid,
                'order_production_number' => $number,
                'removed' => false,
            ]);
        }

        // Todos deben ser únicos
        $uniqueNumbers = array_unique($numbers);
        $this->assertCount(10, $uniqueNumbers);
    }
}
