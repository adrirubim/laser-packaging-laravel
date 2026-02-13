<?php

namespace Tests\Unit\Services;

use App\Models\Article;
use App\Models\Employee;
use App\Models\EmployeeContract;
use App\Models\Offer;
use App\Models\OfferLasWorkLine;
use App\Models\Order;
use App\Models\ProductionPlanning;
use App\Models\ProductionPlanningSummary;
use App\Models\Supplier;
use App\Services\Planning\PlanningDataService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;

class PlanningDataServiceTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        if (! Schema::hasTable('productionplanning') || ! Schema::hasTable('productionplanning_summary')) {
            $this->markTestSkipped('Tabelle planning non presenti nel database di test.');
        }
    }

    public function test_get_data_returns_structure_with_empty_tables(): void
    {
        $service = app(PlanningDataService::class);
        $today = now()->toDateString();

        $result = $service->getData(
            $today.' 00:00:00',
            $today.' 23:59:59'
        );

        $this->assertArrayHasKey('lines', $result);
        $this->assertArrayHasKey('planning', $result);
        $this->assertArrayHasKey('contracts', $result);
        $this->assertArrayHasKey('summary', $result);
        $this->assertIsArray($result['lines']);
        $this->assertIsArray($result['planning']);
        $this->assertIsArray($result['contracts']);
        $this->assertIsArray($result['summary']);
    }

    public function test_get_data_returns_lines_and_orders_when_seeded(): void
    {
        $line = OfferLasWorkLine::factory()->create(['removed' => false]);
        $offer = Offer::factory()->create([
            'lasworkline_uuid' => $line->uuid,
            'removed' => false,
        ]);
        $article = Article::factory()->create([
            'offer_uuid' => $offer->uuid,
            'removed' => false,
        ]);
        $order = Order::factory()->create([
            'article_uuid' => $article->uuid,
            'order_production_number' => 'ORD-TEST-001',
            'removed' => false,
        ]);

        $service = app(PlanningDataService::class);
        $today = now()->toDateString();
        $result = $service->getData($today.' 00:00:00', $today.' 23:59:59');

        $this->assertCount(1, $result['lines']);
        $this->assertSame($line->uuid, $result['lines'][0]['uuid']);
        $this->assertSame($line->code, $result['lines'][0]['code']);
        $this->assertCount(1, $result['lines'][0]['orders']);
        $this->assertSame($order->uuid, $result['lines'][0]['orders'][0]['uuid']);
        $this->assertSame('ORD-TEST-001', $result['lines'][0]['orders'][0]['code']);
        $this->assertSame($article->cod_article_las, $result['lines'][0]['orders'][0]['article_code']);
    }

    public function test_get_data_includes_planning_and_summary_when_present(): void
    {
        $line = OfferLasWorkLine::factory()->create(['removed' => false]);
        $offer = Offer::factory()->create(['lasworkline_uuid' => $line->uuid, 'removed' => false]);
        $article = Article::factory()->create(['offer_uuid' => $offer->uuid, 'removed' => false]);
        $order = Order::factory()->create(['article_uuid' => $article->uuid, 'removed' => false]);

        $today = now()->toDateString();
        ProductionPlanning::create([
            'order_uuid' => $order->uuid,
            'lasworkline_uuid' => $line->uuid,
            'date' => $today,
            'hours' => ['800' => 1, '815' => 1],
        ]);
        ProductionPlanningSummary::create([
            'date' => $today,
            'summary_type' => 'assenze',
            'hours' => ['800' => 2],
            'removed' => false,
        ]);

        $service = app(PlanningDataService::class);
        $result = $service->getData($today.' 00:00:00', $today.' 23:59:59');

        $this->assertCount(1, $result['planning']);
        $this->assertSame($order->uuid, $result['planning'][0]['order_uuid']);
        $this->assertStringContainsString('800', $result['planning'][0]['hours']);

        $this->assertCount(1, $result['summary']);
        $this->assertSame('assenze', $result['summary'][0]['summary_type']);
        $this->assertStringContainsString('800', $result['summary'][0]['hours']);
    }

    public function test_get_data_includes_contracts_in_range(): void
    {
        $supplier = Supplier::factory()->create();
        $employee = Employee::factory()->create();
        $start = now()->subDays(5);
        $end = now()->addDays(5);
        EmployeeContract::factory()->create([
            'employee_uuid' => $employee->uuid,
            'supplier_uuid' => $supplier->uuid,
            'start_date' => $start,
            'end_date' => $end,
            'removed' => false,
        ]);

        $service = app(PlanningDataService::class);
        $today = now()->toDateString();
        $result = $service->getData($today.' 00:00:00', $today.' 23:59:59');

        $this->assertGreaterThanOrEqual(1, count($result['contracts']));
        $contract = collect($result['contracts'])->firstWhere('employee_uuid', $employee->uuid);
        $this->assertNotNull($contract);
    }
}
