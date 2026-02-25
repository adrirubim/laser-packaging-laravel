<?php

namespace Tests\Unit\Services;

use App\Models\Article;
use App\Models\Offer;
use App\Models\Order;
use App\Models\ProductionOrderProcessing;
use App\Services\Planning\PlanningCalculationService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PlanningCalculationServiceTest extends TestCase
{
    use RefreshDatabase;

    public function test_calculate_for_order_with_valid_data(): void
    {
        $offer = Offer::factory()->create([
            'piece' => 2,
            'expected_workers' => 2,
        ]);

        $article = Article::factory()->create([
            'offer_uuid' => $offer->uuid,
            'media_reale_cfz_h_pz' => 10, // 10 cfz/h per addetto
        ]);

        $order = Order::factory()->create([
            'article_uuid' => $article->uuid,
            'quantity' => 400,
            'worked_quantity' => 0,
        ]);

        // one processing of 50 pieces already registered
        ProductionOrderProcessing::factory()->create([
            'order_uuid' => $order->uuid,
            'quantity' => 50,
        ]);

        $service = app(PlanningCalculationService::class);

        $result = $service->calculateForOrder($order->fresh());

        $this->assertSame(0, $result['error_code']);
        $this->assertSame($order->uuid, $result['order_uuid']);
        $this->assertSame(400.0, $result['quantity']);
        $this->assertSame(50.0, $result['worked_quantity']);
        $this->assertSame(350.0, $result['remaining_quantity']);

        // media_reale_pz_h_ps = media_reale_cfz_h_pz * piece = 10 * 2 = 20
        $this->assertSame(20.0, $result['media_reale_pz_h_ps']);
        $this->assertSame(2, $result['expected_workers']);

        // hours_needed = 350 / (20 * 2) = 8.75 h => 35 quarti
        $this->assertEquals(8.75, $result['hours_needed']);
        $this->assertSame(35, $result['quarters_needed']);
    }

    public function test_calculate_for_order_with_missing_data_returns_error(): void
    {
        $offer = Offer::factory()->create();

        // Articolo collegato a un'offerta ma senza media_reale => dati insufficienti
        $article = Article::factory()->create([
            'offer_uuid' => $offer->uuid,
            'media_reale_cfz_h_pz' => null,
        ]);

        $order = Order::factory()->create([
            'article_uuid' => $article->uuid,
            'quantity' => 100,
        ]);

        $service = app(PlanningCalculationService::class);

        $result = $service->calculateForOrder($order);

        $this->assertSame(-1, $result['error_code']);
        $this->assertArrayHasKey('message', $result);
    }
}
