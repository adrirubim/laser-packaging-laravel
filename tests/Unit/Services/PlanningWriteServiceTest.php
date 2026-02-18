<?php

namespace Tests\Unit\Services;

use App\Models\ProductionPlanning;
use App\Models\ProductionPlanningSummary;
use App\Services\Planning\PlanningWriteService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;
use Tests\TestCase;

class PlanningWriteServiceTest extends TestCase
{
    use RefreshDatabase;

    public function test_save_planning_cell_creates_and_updates_hours(): void
    {
        if (! Schema::hasTable('productionplanning')) {
            $this->markTestSkipped('Tabella legacy productionplanning non presente nel database di test.');
        }

        $service = app(PlanningWriteService::class);

        $orderUuid = Str::uuid()->toString();
        $lineUuid = Str::uuid()->toString();

        // crea una ora intera (4 quarti) con 2 addetti
        $result = $service->savePlanningCell(
            $orderUuid,
            $lineUuid,
            '2026-02-12',
            8,
            0,
            2,
            'hour'
        );

        $this->assertNotNull($result['planning_id']);

        /** @var ProductionPlanning $row */
        $row = ProductionPlanning::firstOrFail();
        $this->assertSame($orderUuid, $row->order_uuid);
        $this->assertSame($lineUuid, $row->lasworkline_uuid);
        $this->assertEquals([
            '800' => 2,
            '815' => 2,
            '830' => 2,
            '845' => 2,
        ], $row->hours);

        // poner la stessa ora a 0 => deve eliminare i quarti
        $result2 = $service->savePlanningCell(
            $orderUuid,
            $lineUuid,
            '2026-02-12',
            8,
            0,
            0,
            'hour'
        );

        $this->assertNull($result2['planning_id']);
        $this->assertSame(0, ProductionPlanning::count());
    }

    public function test_save_summary_value_upserts_and_resets(): void
    {
        if (! Schema::hasTable('productionplanning_summary')) {
            $this->markTestSkipped('Tabella legacy productionplanning_summary non presente nel database di test.');
        }

        $service = app(PlanningWriteService::class);

        $result = $service->saveSummaryValue(
            'assenze',
            '2026-02-12',
            8,
            0,
            1,
            0,
            'hour'
        );

        $this->assertNotNull($result['summary_id']);

        /** @var ProductionPlanningSummary $row */
        $row = ProductionPlanningSummary::firstOrFail();
        $this->assertSame('assenze', $row->summary_type);
        $this->assertEquals([
            '800' => 1,
            '815' => 1,
            '830' => 1,
            '845' => 1,
        ], $row->hours);

        // Reset della stessa ora
        $result2 = $service->saveSummaryValue(
            'assenze',
            '2026-02-12',
            8,
            0,
            0,
            1,
            'hour'
        );

        $this->assertNull($result2['summary_id']);
        $this->assertSame(0, ProductionPlanningSummary::count());
    }
}
