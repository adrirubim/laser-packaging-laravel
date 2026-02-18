<?php

namespace Tests\Unit\Services;

use App\Models\Article;
use App\Models\Offer;
use App\Models\OfferLasWorkLine;
use App\Models\Order;
use App\Models\ProductionPlanning;
use App\Services\Planning\PlanningReplanService;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Tests\TestCase;

class PlanningReplanServiceTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Create an order with all required relations/data for planning calculations.
     *
     * @return array{0: Order, 1: OfferLasWorkLine}
     */
    private function makePlannableOrder(array $orderOverrides = [], array $offerOverrides = [], array $articleOverrides = []): array
    {
        $line = OfferLasWorkLine::factory()->create(['removed' => false]);

        $offer = Offer::factory()->create(array_merge([
            'removed' => false,
            'lasworkline_uuid' => $line->uuid,
            'piece' => 1,
            'expected_workers' => 1,
        ], $offerOverrides));

        $article = Article::factory()->create(array_merge([
            'removed' => false,
            'offer_uuid' => $offer->uuid,
            // ensure calculation has a positive "media reale"
            'media_reale_cfz_h_pz' => 100.0,
        ], $articleOverrides));

        $order = Order::factory()->create(array_merge([
            'removed' => false,
            'article_uuid' => $article->uuid,
            'quantity' => 200.0,
            'worked_quantity' => 0.0,
            'delivery_requested_date' => Carbon::parse('2026-02-20 00:00:00'),
            // day shift (08:00-16:00) legacy mode
            'shift_mode' => 0,
            'shift_morning' => false,
            'shift_afternoon' => false,
            'work_saturday' => false,
        ], $orderOverrides));

        return [$order, $line];
    }

    private function countOrderPlanningSlots(string $orderUuid): int
    {
        return ProductionPlanning::query()
            ->where('order_uuid', $orderUuid)
            ->get()
            ->sum(function (ProductionPlanning $p) {
                $hours = $p->hours ?? [];

                return is_array($hours) ? count($hours) : 0;
            });
    }

    public function test_auto_schedule_order_returns_error_when_order_not_found(): void
    {
        $service = app(PlanningReplanService::class);
        $result = $service->autoScheduleOrder(Str::uuid()->toString());

        $this->assertTrue($result['error']);
        $this->assertSame('Ordine non trovato', $result['message']);
    }

    public function test_auto_schedule_order_creates_expected_quarters_for_day_shift(): void
    {
        Carbon::setTestNow(Carbon::parse('2026-02-01 10:00:00'));

        // hoursNeeded = 200 / (50 * 1) = 4h => 16 quarters
        [$order, $line] = $this->makePlannableOrder(
            orderOverrides: ['quantity' => 200.0],
            offerOverrides: ['expected_workers' => 1],
            articleOverrides: ['media_reale_cfz_h_pz' => 50.0],
        );

        $service = app(PlanningReplanService::class);
        $result = $service->autoScheduleOrder($order->uuid);

        $this->assertFalse($result['error']);
        $this->assertSame(16, $result['quarters_added']);
        $this->assertSame(0, $result['quarters_removed']);

        // delivery week is 2026-02-16, mondayRef is 2026-02-09 at 08:00 for shift_mode=0
        $this->assertSame('2026-02-09', substr($result['start_date'], 0, 10));

        $planning = ProductionPlanning::query()
            ->where('order_uuid', $order->uuid)
            ->where('lasworkline_uuid', $line->uuid)
            ->whereDate('date', '2026-02-09')
            ->first();

        $this->assertNotNull($planning);
        $hours = $planning->hours ?? [];
        $this->assertCount(16, $hours);
        $this->assertSame(1, $hours['800']);
        $this->assertSame(1, $hours['1145']);
    }

    public function test_replan_future_returns_error_when_order_not_found(): void
    {
        $service = app(PlanningReplanService::class);
        $result = $service->replanFutureAfterManualEdit(Str::uuid()->toString());

        $this->assertTrue($result['error']);
        $this->assertSame('Ordine non trovato', $result['message']);
    }

    public function test_replan_future_adds_next_quarter_on_saturday_when_enabled(): void
    {
        Carbon::setTestNow(Carbon::parse('2026-02-01 10:00:00'));

        // Need 2 quarters: 50 / (100 * 1) = 0.5h => ceil(2)
        [$order, $line] = $this->makePlannableOrder(
            orderOverrides: ['quantity' => 50.0, 'work_saturday' => true],
            offerOverrides: ['expected_workers' => 1],
            articleOverrides: ['media_reale_cfz_h_pz' => 100.0],
        );

        // Existing future slot is Friday 15:45 → next working slot should be Saturday 08:00 (work_saturday=1)
        ProductionPlanning::create([
            'order_uuid' => $order->uuid,
            'lasworkline_uuid' => $line->uuid,
            'date' => '2026-02-06',
            'hours' => ['1545' => 1],
        ]);

        $service = app(PlanningReplanService::class);
        $result = $service->replanFutureAfterManualEdit($order->uuid);

        $this->assertFalse($result['error']);
        $this->assertSame(1, $result['quarters_added']);
        $this->assertSame(0, $result['quarters_removed']);

        $sat = ProductionPlanning::query()
            ->where('order_uuid', $order->uuid)
            ->whereDate('date', '2026-02-07')
            ->first();
        $this->assertNotNull($sat);
        $this->assertSame(1, ($sat->hours ?? [])['800']);
    }

    public function test_replan_future_removes_quarters_from_tail_when_overplanned(): void
    {
        Carbon::setTestNow(Carbon::parse('2026-02-01 10:00:00'));

        // Need 4 quarters: 100 / (100 * 1) = 1h => 4 quarters
        [$order, $line] = $this->makePlannableOrder(
            orderOverrides: ['quantity' => 100.0],
            offerOverrides: ['expected_workers' => 1],
            articleOverrides: ['media_reale_cfz_h_pz' => 100.0],
        );

        // Overplanned: 8 future quarters on Friday
        ProductionPlanning::create([
            'order_uuid' => $order->uuid,
            'lasworkline_uuid' => $line->uuid,
            'date' => '2026-02-06',
            'hours' => [
                '800' => 1,
                '815' => 1,
                '830' => 1,
                '845' => 1,
                '900' => 1,
                '915' => 1,
                '930' => 1,
                '945' => 1,
            ],
        ]);

        $this->assertSame(8, $this->countOrderPlanningSlots($order->uuid));

        $service = app(PlanningReplanService::class);
        $result = $service->replanFutureAfterManualEdit($order->uuid);

        $this->assertFalse($result['error']);
        $this->assertSame(0, $result['quarters_added']);
        $this->assertSame(4, $result['quarters_removed']);
        $this->assertSame(4, $this->countOrderPlanningSlots($order->uuid));
    }

    public function test_replan_future_skips_saturday_when_disabled(): void
    {
        Carbon::setTestNow(Carbon::parse('2026-02-01 10:00:00'));

        // Need 2 quarters: 50 / (100 * 1) = 0.5h => ceil(2)
        [$order, $line] = $this->makePlannableOrder(
            orderOverrides: ['quantity' => 50.0, 'work_saturday' => false],
            offerOverrides: ['expected_workers' => 1],
            articleOverrides: ['media_reale_cfz_h_pz' => 100.0],
        );

        ProductionPlanning::create([
            'order_uuid' => $order->uuid,
            'lasworkline_uuid' => $line->uuid,
            'date' => '2026-02-06',
            'hours' => ['1545' => 1],
        ]);

        $service = app(PlanningReplanService::class);
        $result = $service->replanFutureAfterManualEdit($order->uuid);

        $this->assertFalse($result['error']);
        $this->assertSame(1, $result['quarters_added']);
        $this->assertSame(0, $result['quarters_removed']);

        // Saturday and Sunday skipped -> Monday
        $mon = ProductionPlanning::query()
            ->where('order_uuid', $order->uuid)
            ->whereDate('date', '2026-02-09')
            ->first();
        $this->assertNotNull($mon);
        $this->assertSame(1, ($mon->hours ?? [])['800']);
    }

    public function test_replan_future_adds_exact_quarters_diff(): void
    {
        Carbon::setTestNow(Carbon::parse('2026-02-01 10:00:00'));

        // remaining=100, media=10, workers=2 => hours=5 => 20 quarters
        [$order, $line] = $this->makePlannableOrder(
            orderOverrides: ['quantity' => 100.0, 'worked_quantity' => 0.0],
            offerOverrides: ['expected_workers' => 2],
            articleOverrides: ['media_reale_cfz_h_pz' => 10.0],
        );

        // Pre-create 8 future quarters on a future date (all count as "future slots")
        ProductionPlanning::create([
            'order_uuid' => $order->uuid,
            'lasworkline_uuid' => $line->uuid,
            'date' => '2026-02-06',
            'hours' => [
                '1000' => 2,
                '1015' => 2,
                '1030' => 2,
                '1045' => 2,
                '1100' => 2,
                '1115' => 2,
                '1130' => 2,
                '1145' => 2,
            ],
        ]);

        $this->assertSame(8, $this->countOrderPlanningSlots($order->uuid));

        $service = app(PlanningReplanService::class);
        $result = $service->replanFutureAfterManualEdit($order->uuid);

        $this->assertFalse($result['error']);
        $this->assertSame(12, $result['quarters_added']);
        $this->assertSame(0, $result['quarters_removed']);
        $this->assertSame(20, $this->countOrderPlanningSlots($order->uuid));
    }

    public function test_adjust_for_worked_quantity_returns_error_when_order_not_found(): void
    {
        $service = app(PlanningReplanService::class);
        $result = $service->adjustForWorkedQuantity(Str::uuid()->toString());

        $this->assertTrue($result['error']);
        $this->assertSame('Ordine non trovato', $result['message']);
    }

    public function test_adjust_for_worked_quantity_removes_quarters_from_tail(): void
    {
        Carbon::setTestNow(Carbon::parse('2026-02-01 10:00:00'));

        // Need 4 quarters: 100 / (100 * 1) = 1h => 4 quarters
        [$order, $line] = $this->makePlannableOrder(
            orderOverrides: ['quantity' => 100.0],
            offerOverrides: ['expected_workers' => 1],
            articleOverrides: ['media_reale_cfz_h_pz' => 100.0],
        );

        // Create 8 planned quarters on a single day
        ProductionPlanning::create([
            'order_uuid' => $order->uuid,
            'lasworkline_uuid' => $line->uuid,
            'date' => '2026-02-09',
            'hours' => [
                '800' => 1,
                '815' => 1,
                '830' => 1,
                '845' => 1,
                '900' => 1,
                '915' => 1,
                '930' => 1,
                '945' => 1,
            ],
        ]);

        $service = app(PlanningReplanService::class);
        $result = $service->adjustForWorkedQuantity($order->uuid);

        $this->assertFalse($result['error']);
        $this->assertSame(4, $result['quarters_removed']);

        $planning = ProductionPlanning::query()
            ->where('order_uuid', $order->uuid)
            ->whereDate('date', '2026-02-09')
            ->first();
        $this->assertNotNull($planning);
        $hours = $planning->hours ?? [];
        $this->assertCount(4, $hours);
        $this->assertArrayHasKey('800', $hours);
        $this->assertArrayHasKey('845', $hours);
        $this->assertArrayNotHasKey('900', $hours);
    }

    public function test_adjust_for_worked_quantity_adds_quarters_when_needed(): void
    {
        Carbon::setTestNow(Carbon::parse('2026-02-01 10:00:00'));

        // Need 8 quarters: 200 / (100 * 1) = 2h => 8 quarters
        [$order, $line] = $this->makePlannableOrder(
            orderOverrides: ['quantity' => 200.0, 'worked_quantity' => 0.0],
            offerOverrides: ['expected_workers' => 1],
            articleOverrides: ['media_reale_cfz_h_pz' => 100.0],
        );

        // Create only 4 planned quarters -> adjust should add 4 more
        ProductionPlanning::create([
            'order_uuid' => $order->uuid,
            'lasworkline_uuid' => $line->uuid,
            'date' => '2026-02-09',
            'hours' => [
                '800' => 1,
                '815' => 1,
                '830' => 1,
                '845' => 1,
            ],
        ]);

        $this->assertSame(4, $this->countOrderPlanningSlots($order->uuid));

        $service = app(PlanningReplanService::class);
        $result = $service->adjustForWorkedQuantity($order->uuid);

        $this->assertFalse($result['error']);
        $this->assertSame(0, $result['quarters_removed']);
        $this->assertSame(8, $this->countOrderPlanningSlots($order->uuid));
    }

    public function test_adjust_for_worked_quantity_removes_tail_after_worked_quantity_increases(): void
    {
        Carbon::setTestNow(Carbon::parse('2026-02-01 10:00:00'));

        // Initial need: remaining=100, media=10, workers=2 => hours=5 => 20 quarters
        [$order, $line] = $this->makePlannableOrder(
            orderOverrides: ['quantity' => 100.0, 'worked_quantity' => 0.0],
            offerOverrides: ['expected_workers' => 2],
            articleOverrides: ['media_reale_cfz_h_pz' => 10.0],
        );

        // Create 20 planned quarters on a single day (10:00 -> 14:45)
        $hours = [];
        $h = 10;
        $m = 0;
        for ($i = 0; $i < 20; $i++) {
            $slotKey = (string) ($h * 100 + $m);
            $hours[$slotKey] = 2;
            $m += 15;
            if ($m >= 60) {
                $m = 0;
                $h++;
            }
        }
        ProductionPlanning::create([
            'order_uuid' => $order->uuid,
            'lasworkline_uuid' => $line->uuid,
            'date' => '2026-02-09',
            'hours' => $hours,
        ]);

        $this->assertSame(20, $this->countOrderPlanningSlots($order->uuid));

        // After worked increases: worked=40 -> remaining=60 -> hours=3 -> 12 quarters (remove 8)
        $order->worked_quantity = 40.0;
        $order->save();

        $service = app(PlanningReplanService::class);
        $result = $service->adjustForWorkedQuantity($order->uuid);

        $this->assertFalse($result['error']);
        $this->assertSame(8, $result['quarters_removed']);
        $this->assertSame(12, $this->countOrderPlanningSlots($order->uuid));
    }

    public function test_auto_schedule_order_skips_or_includes_saturday_based_on_flag(): void
    {
        Carbon::setTestNow(Carbon::parse('2026-02-01 10:00:00'));

        // Need 161 quarters: 2012.5 / (50 * 1) = 40.25h -> ceil(161)
        [$orderNoSat, $lineNoSat] = $this->makePlannableOrder(
            orderOverrides: ['quantity' => 2012.5, 'work_saturday' => false],
            offerOverrides: ['expected_workers' => 1],
            articleOverrides: ['media_reale_cfz_h_pz' => 50.0],
        );

        $service = app(PlanningReplanService::class);
        $resA = $service->autoScheduleOrder($orderNoSat->uuid);
        $this->assertFalse($resA['error']);
        $this->assertSame(161, $resA['quarters_added']);
        $this->assertSame(0, $resA['quarters_removed']);

        $datesA = ProductionPlanning::query()
            ->where('order_uuid', $orderNoSat->uuid)
            ->where('lasworkline_uuid', $lineNoSat->uuid)
            ->pluck('date');
        $this->assertNotEmpty($datesA);
        foreach ($datesA as $d) {
            $dow = Carbon::parse($d)->dayOfWeekIso; // 1..7
            $this->assertNotSame(6, $dow, 'No debería planificar en sábado si work_saturday=0');
            $this->assertNotSame(7, $dow, 'No debería planificar en domingo');
        }

        [$orderYesSat, $lineYesSat] = $this->makePlannableOrder(
            orderOverrides: ['quantity' => 2012.5, 'work_saturday' => true],
            offerOverrides: ['expected_workers' => 1],
            articleOverrides: ['media_reale_cfz_h_pz' => 50.0],
        );

        $resB = $service->autoScheduleOrder($orderYesSat->uuid);
        $this->assertFalse($resB['error']);
        $this->assertSame(161, $resB['quarters_added']);

        $hasSaturday = ProductionPlanning::query()
            ->where('order_uuid', $orderYesSat->uuid)
            ->where('lasworkline_uuid', $lineYesSat->uuid)
            ->whereDate('date', '2026-02-14')
            ->exists();
        $this->assertTrue($hasSaturday, 'Debería incluir sábado si work_saturday=1 y los quarti se desbordan más allá del viernes');
    }

    public function test_auto_schedule_order_respects_morning_shift_hours(): void
    {
        Carbon::setTestNow(Carbon::parse('2026-02-01 10:00:00'));

        [$order, $line] = $this->makePlannableOrder(
            orderOverrides: [
                'quantity' => 100.0,
                'shift_mode' => 1,
                'shift_morning' => true,
                'shift_afternoon' => false,
            ],
            offerOverrides: ['expected_workers' => 1],
            articleOverrides: ['media_reale_cfz_h_pz' => 100.0],
        );

        $service = app(PlanningReplanService::class);
        $result = $service->autoScheduleOrder($order->uuid);

        $this->assertFalse($result['error']);
        $this->assertSame('6:00-14:00', $result['work_hours']);

        $planning = ProductionPlanning::query()
            ->where('order_uuid', $order->uuid)
            ->where('lasworkline_uuid', $line->uuid)
            ->whereDate('date', '2026-02-09')
            ->first();
        $this->assertNotNull($planning);
        $hours = $planning->hours ?? [];
        $this->assertArrayHasKey('600', $hours);
        $this->assertSame(1, $hours['600']);
    }
}
