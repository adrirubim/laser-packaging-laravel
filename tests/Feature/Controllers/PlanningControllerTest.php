<?php

namespace Tests\Feature\Controllers;

use App\Models\Article;
use App\Models\Offer;
use App\Models\OfferLasWorkLine;
use App\Models\Order;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Schema;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class PlanningControllerTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    #[Test]
    public function index_requires_auth(): void
    {
        $response = $this->get(route('planning.index'));
        $response->assertRedirect();
    }

    #[Test]
    public function index_returns_inertia_planning_page(): void
    {
        $response = $this->actingAs($this->user)->get(route('planning.index'));
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Planning/Index')
            ->has('today')
        );
    }

    #[Test]
    public function data_returns_json_with_structure(): void
    {
        $today = now()->toDateString();
        $response = $this->postJson('/api/planning/data', [
            'start_date' => $today.' 00:00:00',
            'end_date' => $today.' 23:59:59',
        ]);
        $response->assertStatus(200);
        $response->assertJsonPath('error_code', 0);
        $response->assertJsonStructure([
            'lines',
            'planning',
            'contracts',
            'summary',
        ]);
    }

    #[Test]
    public function save_validates_input(): void
    {
        $response = $this->postJson('/api/planning/save', []);
        $response->assertStatus(422);
        $response->assertJsonPath('error_code', -1);
        $response->assertJsonValidationErrors(['order_uuid', 'lasworkline_uuid', 'date', 'hour', 'minute', 'workers']);
    }

    #[Test]
    public function save_creates_planning_cell(): void
    {
        if (! Schema::hasTable('productionplanning')) {
            $this->markTestSkipped('Tabella productionplanning non presente.');
        }
        $orderUuid = Order::factory()->create(['removed' => false])->uuid;
        $lineUuid = OfferLasWorkLine::factory()->create(['removed' => false])->uuid;
        $today = now()->toDateString();

        $response = $this->postJson('/api/planning/save', [
            'order_uuid' => $orderUuid,
            'lasworkline_uuid' => $lineUuid,
            'date' => $today,
            'hour' => 8,
            'minute' => 0,
            'workers' => 1,
            'zoom_level' => 'hour',
        ]);
        $response->assertStatus(200);
        $response->assertJsonPath('error_code', 0);
        $response->assertJsonStructure(['planning_id', 'replan_result']);
    }

    #[Test]
    public function save_summary_validates_input(): void
    {
        $response = $this->postJson('/api/planning/summary/save', []);
        $response->assertStatus(422);
        $response->assertJsonPath('error_code', -1);
        $response->assertJsonValidationErrors(['summary_type', 'date', 'hour', 'minute', 'value', 'reset']);
    }

    #[Test]
    public function save_summary_creates_value(): void
    {
        if (! Schema::hasTable('productionplanning_summary')) {
            $this->markTestSkipped('Tabella productionplanning_summary non presente.');
        }
        $today = now()->toDateString();
        $response = $this->postJson('/api/planning/summary/save', [
            'summary_type' => 'assenze',
            'date' => $today,
            'hour' => 8,
            'minute' => 0,
            'value' => 1,
            'reset' => 0,
            'zoom_level' => 'hour',
        ]);
        $response->assertStatus(200);
        $response->assertJsonPath('error_code', 0);
        $response->assertJsonStructure(['summary_id']);
    }

    #[Test]
    public function calculate_hours_returns_404_when_order_not_found(): void
    {
        $response = $this->postJson('/api/planning/calculate-hours', [
            'order_uuid' => '00000000-0000-0000-0000-000000000000',
        ]);
        $response->assertStatus(404);
        $response->assertJsonPath('error_code', -1);
    }

    #[Test]
    public function calculate_hours_returns_calculation_when_order_exists(): void
    {
        $offer = Offer::factory()->create(['piece' => 1, 'expected_workers' => 1]);
        $article = Article::factory()->create([
            'offer_uuid' => $offer->uuid,
            'media_reale_cfz_h_pz' => 10,
        ]);
        $order = Order::factory()->create([
            'article_uuid' => $article->uuid,
            'quantity' => 100,
            'worked_quantity' => 0,
        ]);

        $response = $this->postJson('/api/planning/calculate-hours', [
            'order_uuid' => $order->uuid,
        ]);
        $response->assertStatus(200);
        $response->assertJsonPath('error_code', 0);
        $response->assertJsonPath('order_uuid', $order->uuid);
        $response->assertJsonStructure(['hours_needed', 'quarters_needed']);
    }

    #[Test]
    public function check_today_returns_json(): void
    {
        $response = $this->postJson('/api/planning/check-today');
        $response->assertStatus(200);
        $response->assertJsonPath('error_code', 0);
        $response->assertJsonStructure([
            'message',
            'date',
            'orders_checked',
            'orders_modified',
            'details',
        ]);
    }
}
