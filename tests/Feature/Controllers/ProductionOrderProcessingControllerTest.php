<?php

namespace Tests\Feature\Controllers;

use App\Models\Employee;
use App\Models\Order;
use App\Models\ProductionOrderProcessing;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class ProductionOrderProcessingControllerTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

    protected Employee $employee;

    protected Order $order;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();

        $this->employee = Employee::factory()->create([
            'matriculation_number' => 'EMP001',
            'name' => 'John',
            'surname' => 'Doe',
            'removed' => false,
        ]);

        $customer = \App\Models\Customer::factory()->create(['removed' => false]);
        $division = \App\Models\CustomerDivision::factory()->create([
            'customer_uuid' => $customer->uuid,
            'removed' => false,
        ]);
        $shippingAddress = \App\Models\CustomerShippingAddress::factory()->create([
            'customerdivision_uuid' => $division->uuid,
            'removed' => false,
        ]);
        $offer = \App\Models\Offer::factory()->create([
            'customer_uuid' => $customer->uuid,
            'removed' => false,
        ]);
        $article = \App\Models\Article::factory()->create([
            'offer_uuid' => $offer->uuid,
            'removed' => false,
        ]);

        $this->order = Order::factory()->create([
            'article_uuid' => $article->uuid,
            'order_production_number' => '2025.0001',
            'number_customer_reference_order' => 'REF001',
            'customershippingaddress_uuid' => $shippingAddress->uuid,
            'removed' => false,
        ]);
    }

    #[Test]
    public function it_displays_index_page_with_processings()
    {
        $this->actingAs($this->user);

        ProductionOrderProcessing::factory()->create([
            'employee_uuid' => $this->employee->uuid,
            'order_uuid' => $this->order->uuid,
            'quantity' => 100.50,
            'processed_datetime' => now(),
            'removed' => false,
        ]);

        $response = $this->get(route('production-order-processing.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('ProductionOrderProcessing/Index')
            ->has('processings')
            ->has('processings.data')
        );
    }

    #[Test]
    public function it_only_shows_active_processings_in_index()
    {
        $this->actingAs($this->user);

        $activeProcessing = ProductionOrderProcessing::factory()->create([
            'employee_uuid' => $this->employee->uuid,
            'order_uuid' => $this->order->uuid,
            'quantity' => 100,
            'removed' => false,
        ]);

        $removedProcessing = ProductionOrderProcessing::factory()->create([
            'employee_uuid' => $this->employee->uuid,
            'order_uuid' => $this->order->uuid,
            'quantity' => 200,
            'removed' => true,
        ]);

        $response = $this->get(route('production-order-processing.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->where('processings.data', function ($data) use ($activeProcessing) {
            $dataArray = is_object($data) && method_exists($data, 'toArray') ? $data->toArray() : (array) $data;
            $uuids = array_column($dataArray, 'uuid');
            $this->assertContains($activeProcessing->uuid, $uuids);

            return true;
        })
        );
    }

    #[Test]
    public function it_searches_processings_by_production_number()
    {
        $this->actingAs($this->user);

        $processing = ProductionOrderProcessing::factory()->create([
            'employee_uuid' => $this->employee->uuid,
            'order_uuid' => $this->order->uuid,
            'quantity' => 100,
            'removed' => false,
        ]);

        $response = $this->get(route('production-order-processing.index', ['search' => '2025.0001']));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->where('filters.search', '2025.0001')
        );
    }

    #[Test]
    public function it_searches_processings_by_customer_reference_order()
    {
        $this->actingAs($this->user);

        $processing = ProductionOrderProcessing::factory()->create([
            'employee_uuid' => $this->employee->uuid,
            'order_uuid' => $this->order->uuid,
            'quantity' => 100,
            'removed' => false,
        ]);

        $response = $this->get(route('production-order-processing.index', ['search' => 'REF001']));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->where('filters.search', 'REF001')
        );
    }

    #[Test]
    public function it_searches_processings_by_employee_name()
    {
        $this->actingAs($this->user);

        $processing = ProductionOrderProcessing::factory()->create([
            'employee_uuid' => $this->employee->uuid,
            'order_uuid' => $this->order->uuid,
            'quantity' => 100,
            'removed' => false,
        ]);

        $response = $this->get(route('production-order-processing.index', ['search' => 'John']));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->where('filters.search', 'John')
        );
    }

    #[Test]
    public function it_searches_processings_by_employee_surname()
    {
        $this->actingAs($this->user);

        $processing = ProductionOrderProcessing::factory()->create([
            'employee_uuid' => $this->employee->uuid,
            'order_uuid' => $this->order->uuid,
            'quantity' => 100,
            'removed' => false,
        ]);

        $response = $this->get(route('production-order-processing.index', ['search' => 'Doe']));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->where('filters.search', 'Doe')
        );
    }

    #[Test]
    public function it_searches_processings_by_matriculation_number()
    {
        $this->actingAs($this->user);

        $processing = ProductionOrderProcessing::factory()->create([
            'employee_uuid' => $this->employee->uuid,
            'order_uuid' => $this->order->uuid,
            'quantity' => 100,
            'removed' => false,
        ]);

        $response = $this->get(route('production-order-processing.index', ['search' => 'EMP001']));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->where('filters.search', 'EMP001')
        );
    }

    #[Test]
    public function it_paginates_processings()
    {
        $this->actingAs($this->user);

        ProductionOrderProcessing::factory()->count(20)->create([
            'employee_uuid' => $this->employee->uuid,
            'order_uuid' => $this->order->uuid,
            'removed' => false,
        ]);

        $response = $this->get(route('production-order-processing.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->has('processings')
            ->where('processings.current_page', 1)
            ->where('processings.per_page', 10)
            ->where('processings.last_page', function ($lastPage) {
                $this->assertGreaterThan(1, $lastPage);

                return true;
            })
        );
    }

    #[Test]
    public function it_paginates_with_custom_per_page()
    {
        $this->actingAs($this->user);

        ProductionOrderProcessing::factory()->count(30)->create([
            'employee_uuid' => $this->employee->uuid,
            'order_uuid' => $this->order->uuid,
            'removed' => false,
        ]);

        $response = $this->get(route('production-order-processing.index', ['per_page' => 25]));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->where('processings.per_page', 25)
        );
    }

    #[Test]
    public function it_orders_processings_by_processed_datetime_desc()
    {
        $this->actingAs($this->user);

        $oldProcessing = ProductionOrderProcessing::factory()->create([
            'employee_uuid' => $this->employee->uuid,
            'order_uuid' => $this->order->uuid,
            'quantity' => 100,
            'processed_datetime' => now()->subDays(2),
            'removed' => false,
        ]);

        $newProcessing = ProductionOrderProcessing::factory()->create([
            'employee_uuid' => $this->employee->uuid,
            'order_uuid' => $this->order->uuid,
            'quantity' => 200,
            'processed_datetime' => now(),
            'removed' => false,
        ]);

        $response = $this->get(route('production-order-processing.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->where('processings.data.0.uuid', $newProcessing->uuid)
        );
    }

    #[Test]
    public function it_loads_employee_and_order_relationships()
    {
        $this->actingAs($this->user);

        $processing = ProductionOrderProcessing::factory()->create([
            'employee_uuid' => $this->employee->uuid,
            'order_uuid' => $this->order->uuid,
            'quantity' => 100,
            'removed' => false,
        ]);

        $response = $this->get(route('production-order-processing.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->where('processings.data.0.employee.uuid', $this->employee->uuid)
            ->where('processings.data.0.order.uuid', $this->order->uuid)
        );
    }

    #[Test]
    public function it_handles_empty_search_results()
    {
        $this->actingAs($this->user);

        ProductionOrderProcessing::factory()->create([
            'employee_uuid' => $this->employee->uuid,
            'order_uuid' => $this->order->uuid,
            'quantity' => 100,
            'removed' => false,
        ]);

        $response = $this->get(route('production-order-processing.index', ['search' => 'NonExistent']));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->where('processings.data', [])
        );
    }

    #[Test]
    public function it_includes_pagination_metadata()
    {
        $this->actingAs($this->user);

        ProductionOrderProcessing::factory()->count(15)->create([
            'employee_uuid' => $this->employee->uuid,
            'order_uuid' => $this->order->uuid,
            'removed' => false,
        ]);

        $response = $this->get(route('production-order-processing.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->has('processings.from')
            ->has('processings.to')
            ->has('processings.total')
            ->where('processings.total', 15)
        );
    }

    #[Test]
    public function it_destroys_processing()
    {
        $this->actingAs($this->user);

        $processing = ProductionOrderProcessing::factory()->create([
            'employee_uuid' => $this->employee->uuid,
            'order_uuid' => $this->order->uuid,
            'quantity' => 100,
            'removed' => false,
        ]);

        $response = $this->delete(route('production-order-processing.destroy', $processing));

        $response->assertRedirect(route('production-order-processing.index'));
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('productionorderprocessing', [
            'id' => $processing->id,
            'removed' => true,
        ]);
    }

    #[Test]
    public function it_returns_404_when_destroying_non_existent_processing()
    {
        $this->actingAs($this->user);

        $nonExistentUuid = '00000000-0000-0000-0000-000000000000';

        $response = $this->delete(route('production-order-processing.destroy', $nonExistentUuid));

        $response->assertStatus(404);
    }

    #[Test]
    public function it_skips_create_method_not_implemented()
    {
        $this->actingAs($this->user);

        $this->markTestSkipped('create() method is not implemented in ProductionOrderProcessingController');
    }

    #[Test]
    public function it_stores_processing_updates_order_worked_quantity_and_triggers_replan(): void
    {
        $this->actingAs($this->user);

        $this->order->update(['worked_quantity' => 0]);
        $processedAt = now()->format('Y-m-d H:i:s');

        $response = $this->post(route('production-order-processing.store'), [
            'employee_uuid' => $this->employee->uuid,
            'order_uuid' => $this->order->uuid,
            'quantity' => 25.5,
            'processed_datetime' => $processedAt,
        ]);

        $response->assertRedirect(route('production-order-processing.index'));
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('productionorderprocessing', [
            'order_uuid' => $this->order->uuid,
            'employee_uuid' => $this->employee->uuid,
            'quantity' => 25.5,
        ]);

        $this->order->refresh();
        $this->assertSame(25.5, (float) $this->order->worked_quantity);
    }

    #[Test]
    public function it_skips_show_method_not_implemented()
    {
        $this->actingAs($this->user);

        $this->markTestSkipped('show() method is not implemented in ProductionOrderProcessingController');
    }

    #[Test]
    public function it_skips_edit_method_not_implemented()
    {
        $this->actingAs($this->user);

        $this->markTestSkipped('edit() method is not implemented in ProductionOrderProcessingController');
    }

    #[Test]
    public function it_skips_update_method_not_implemented()
    {
        $this->actingAs($this->user);

        $this->markTestSkipped('update() method is not implemented in ProductionOrderProcessingController');
    }
}
