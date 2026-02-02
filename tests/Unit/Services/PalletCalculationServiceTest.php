<?php

namespace Tests\Unit\Services;

use App\Models\Article;
use App\Models\Order;
use App\Models\ProductionOrderProcessing;
use App\Services\PalletCalculationService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class PalletCalculationServiceTest extends TestCase
{
    use RefreshDatabase;

    protected PalletCalculationService $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = new PalletCalculationService;
    }

    #[Test]
    public function it_calculates_pallet_quantity_correctly()
    {
        $article = Article::factory()->create([
            'plan_packaging' => 10,
            'pallet_plans' => 5,
            'removed' => false,
        ]);

        $quantity = $this->service->getPalletQuantity($article->uuid);

        $this->assertEquals(50, $quantity); // 10 * 5
    }

    #[Test]
    public function it_throws_exception_when_article_has_invalid_packaging()
    {
        $article = Article::factory()->create([
            'plan_packaging' => 0,
            'pallet_plans' => 5,
            'removed' => false,
        ]);

        $this->expectException(\Exception::class);
        $this->expectExceptionMessage('L\'articolo non ha configurazione di packaging valida');

        $this->service->getPalletQuantity($article->uuid);
    }

    #[Test]
    public function it_calculates_processed_quantity()
    {
        $order = Order::factory()->create([
            'removed' => false,
        ]);

        ProductionOrderProcessing::factory()->create([
            'order_uuid' => $order->uuid,
            'quantity' => 10.5,
            'removed' => false,
        ]);

        ProductionOrderProcessing::factory()->create([
            'order_uuid' => $order->uuid,
            'quantity' => 20.3,
            'removed' => false,
        ]);

        $processed = $this->service->getProcessedQuantity($order->uuid);

        $this->assertEquals(30.8, $processed);
    }

    #[Test]
    public function it_excludes_removed_processings()
    {
        $order = Order::factory()->create([
            'removed' => false,
        ]);

        ProductionOrderProcessing::factory()->create([
            'order_uuid' => $order->uuid,
            'quantity' => 10,
            'removed' => false,
        ]);

        ProductionOrderProcessing::factory()->create([
            'order_uuid' => $order->uuid,
            'quantity' => 20,
            'removed' => true, // Removido
        ]);

        $processed = $this->service->getProcessedQuantity($order->uuid);

        $this->assertEquals(10, $processed);
    }

    #[Test]
    public function it_calculates_quantity_to_finish_pallet()
    {
        $article = Article::factory()->create([
            'plan_packaging' => 10,
            'pallet_plans' => 5, // 50 por pallet
            'removed' => false,
        ]);

        $order = Order::factory()->create([
            'article_uuid' => $article->uuid,
            'removed' => false,
        ]);

        // Procesar 30 unidades (faltan 20 para completar pallet de 50)
        ProductionOrderProcessing::factory()->create([
            'order_uuid' => $order->uuid,
            'quantity' => 30,
            'removed' => false,
        ]);

        $quantityToFinish = $this->service->getQuantityToFinishPallet($order->uuid);

        $this->assertEquals(20, $quantityToFinish);
    }

    #[Test]
    public function it_detects_when_pallet_will_be_completed()
    {
        $article = Article::factory()->create([
            'plan_packaging' => 10,
            'pallet_plans' => 5, // 50 por pallet
            'removed' => false,
        ]);

        $order = Order::factory()->create([
            'article_uuid' => $article->uuid,
            'removed' => false,
        ]);

        // Procesar 30 unidades
        ProductionOrderProcessing::factory()->create([
            'order_uuid' => $order->uuid,
            'quantity' => 30,
            'removed' => false,
        ]);

        // Añadir 20 más debería completar el pallet
        $this->assertTrue($this->service->willCompletePallet($order->uuid, 20));

        // Añadir 10 más NO debería completar el pallet
        $this->assertFalse($this->service->willCompletePallet($order->uuid, 10));
    }

    #[Test]
    public function it_calculates_completed_pallets()
    {
        $article = Article::factory()->create([
            'plan_packaging' => 10,
            'pallet_plans' => 5, // 50 por pallet
            'removed' => false,
        ]);

        $order = Order::factory()->create([
            'article_uuid' => $article->uuid,
            'removed' => false,
        ]);

        // Procesar 150 unidades = 3 pallets completos
        ProductionOrderProcessing::factory()->create([
            'order_uuid' => $order->uuid,
            'quantity' => 150,
            'removed' => false,
        ]);

        $completed = $this->service->getCompletedPallets($order->uuid);

        $this->assertEquals(3, $completed);
    }
}
