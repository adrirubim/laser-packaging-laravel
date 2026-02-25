<?php

namespace Tests\Feature\Controllers;

use App\Models\Employee;
use App\Models\OfferOrderEmployee;
use App\Models\Order;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class OrderEmployeeControllerTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    #[Test]
    public function it_displays_index_page_with_assignments()
    {
        $this->actingAs($this->user);

        $order = Order::factory()->create();
        $employee = Employee::factory()->create();

        OfferOrderEmployee::factory()->create([
            'order_uuid' => $order->uuid,
            'employee_uuid' => $employee->uuid,
            'removed' => false,
        ]);

        $response = $this->get(route('order-employees.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->has('assignments')
            ->has('assignments.data')
        );
    }

    #[Test]
    public function it_filters_assignments_by_order()
    {
        $this->actingAs($this->user);

        $order1 = Order::factory()->create();
        $order2 = Order::factory()->create();
        $employee = Employee::factory()->create();

        OfferOrderEmployee::factory()->create([
            'order_uuid' => $order1->uuid,
            'employee_uuid' => $employee->uuid,
        ]);

        $response = $this->get(route('order-employees.index', ['order_uuid' => $order1->uuid]));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->where('filters.order_uuid', $order1->uuid)
        );
    }

    #[Test]
    public function it_shows_manage_order_page()
    {
        $this->actingAs($this->user);

        $order = Order::factory()->create();
        $employee = Employee::factory()->create();

        OfferOrderEmployee::factory()->create([
            'order_uuid' => $order->uuid,
            'employee_uuid' => $employee->uuid,
        ]);

        $response = $this->get(route('orders.manage-employees', $order));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('OrderEmployees/ManageOrder')
            ->has('order')
            ->has('assignedEmployees')
            ->has('allEmployees')
        );
    }

    #[Test]
    public function it_gets_employee_assignments_via_api()
    {
        $this->actingAs($this->user);

        $order = Order::factory()->create();
        $employee1 = Employee::factory()->create();
        $employee2 = Employee::factory()->create();

        OfferOrderEmployee::factory()->create([
            'order_uuid' => $order->uuid,
            'employee_uuid' => $employee1->uuid,
        ]);

        $response = $this->get(route('order-employees.get-assignments', [
            'order_uuid' => $order->uuid,
        ]));

        $response->assertStatus(200);
        $response->assertJsonStructure(['assignments']);
        $response->assertJson(['assignments' => [$employee1->uuid]]);
    }

    #[Test]
    public function it_saves_employee_assignments_via_api()
    {
        $this->actingAs($this->user);

        $order = Order::factory()->create();
        $employee1 = Employee::factory()->create();
        $employee2 = Employee::factory()->create();

        $response = $this->post(route('order-employees.save-assignments'), [
            'order_uuid' => $order->uuid,
            'employee_list' => [$employee1->uuid, $employee2->uuid],
        ]);

        // Method now returns redirect instead of JSON
        $response->assertRedirect(route('orders.show', $order->uuid));
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('offerorderemployee', [
            'order_uuid' => $order->uuid,
            'employee_uuid' => $employee1->uuid,
            'removed' => false,
        ]);

        $this->assertDatabaseHas('offerorderemployee', [
            'order_uuid' => $order->uuid,
            'employee_uuid' => $employee2->uuid,
            'removed' => false,
        ]);
    }

    #[Test]
    public function it_updates_employee_assignments_via_api()
    {
        $this->actingAs($this->user);

        $order = Order::factory()->create();
        $employee1 = Employee::factory()->create();
        $employee2 = Employee::factory()->create();
        $employee3 = Employee::factory()->create();

        // Create initial assignment
        OfferOrderEmployee::factory()->create([
            'order_uuid' => $order->uuid,
            'employee_uuid' => $employee1->uuid,
        ]);

        // Update assignments
        $response = $this->post(route('order-employees.save-assignments'), [
            'order_uuid' => $order->uuid,
            'employee_list' => [$employee2->uuid, $employee3->uuid],
        ]);

        // Method now returns redirect instead of JSON
        $response->assertRedirect(route('orders.show', $order->uuid));
        $response->assertSessionHas('success');

        // Verify employee1 was removed
        $this->assertDatabaseHas('offerorderemployee', [
            'order_uuid' => $order->uuid,
            'employee_uuid' => $employee1->uuid,
            'removed' => true,
        ]);

        // Verify employee2 and employee3 were added
        $this->assertDatabaseHas('offerorderemployee', [
            'order_uuid' => $order->uuid,
            'employee_uuid' => $employee2->uuid,
            'removed' => false,
        ]);
    }

    #[Test]
    public function it_checks_if_employee_is_assigned_to_order()
    {
        $this->actingAs($this->user);

        $order = Order::factory()->create();
        $employee = Employee::factory()->create();

        OfferOrderEmployee::factory()->create([
            'order_uuid' => $order->uuid,
            'employee_uuid' => $employee->uuid,
        ]);

        $response = $this->get(route('order-employees.check-assignment', [
            'order_uuid' => $order->uuid,
            'employee_uuid' => $employee->uuid,
        ]));

        $response->assertStatus(200);
        $response->assertJson(['assigned' => true]);
    }

    #[Test]
    public function it_returns_false_when_employee_not_assigned()
    {
        $this->actingAs($this->user);

        $order = Order::factory()->create();
        $employee = Employee::factory()->create();

        $response = $this->get(route('order-employees.check-assignment', [
            'order_uuid' => $order->uuid,
            'employee_uuid' => $employee->uuid,
        ]));

        $response->assertStatus(200);
        $response->assertJson(['assigned' => false]);
    }

    #[Test]
    public function it_destroys_assignment()
    {
        $this->actingAs($this->user);

        $assignment = OfferOrderEmployee::factory()->create([
            'removed' => false,
        ]);

        $response = $this->delete(route('order-employees.destroy', $assignment));

        $response->assertRedirect();
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('offerorderemployee', [
            'id' => $assignment->id,
            'removed' => true,
        ]);
    }

    #[Test]
    public function it_filters_assignments_by_employee()
    {
        $this->actingAs($this->user);

        $order = Order::factory()->create();
        $employee1 = Employee::factory()->create();
        $employee2 = Employee::factory()->create();

        OfferOrderEmployee::factory()->create([
            'order_uuid' => $order->uuid,
            'employee_uuid' => $employee1->uuid,
        ]);

        OfferOrderEmployee::factory()->create([
            'order_uuid' => $order->uuid,
            'employee_uuid' => $employee2->uuid,
        ]);

        $response = $this->get(route('order-employees.index', ['employee_uuid' => $employee1->uuid]));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->where('filters.employee_uuid', $employee1->uuid)
        );
    }

    #[Test]
    public function it_paginates_assignments()
    {
        $this->actingAs($this->user);

        $order = Order::factory()->create();
        $employee = Employee::factory()->create();

        OfferOrderEmployee::factory()->count(20)->create([
            'order_uuid' => $order->uuid,
            'employee_uuid' => $employee->uuid,
            'removed' => false,
        ]);

        $response = $this->get(route('order-employees.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->has('assignments')
            ->where('assignments.current_page', 1)
            ->where('assignments.last_page', function ($lastPage) {
                $this->assertGreaterThan(1, $lastPage);

                return true;
            })
        );
    }

    #[Test]
    public function it_handles_empty_assignments_list()
    {
        $this->actingAs($this->user);

        $response = $this->get(route('order-employees.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->where('assignments.data', [])
        );
    }

    #[Test]
    public function it_validates_order_uuid_required_on_get_assignments()
    {
        $this->actingAs($this->user);

        $response = $this->get(route('order-employees.get-assignments'));

        $response->assertSessionHasErrors(['order_uuid']);
    }

    #[Test]
    public function it_validates_order_uuid_exists_on_get_assignments()
    {
        $this->actingAs($this->user);

        $response = $this->get(route('order-employees.get-assignments', [
            'order_uuid' => '00000000-0000-0000-0000-000000000000',
        ]));

        $response->assertSessionHasErrors(['order_uuid']);
    }

    #[Test]
    public function it_validates_order_uuid_required_on_save_assignments()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('order-employees.save-assignments'), [
            'employee_list' => [],
        ]);

        $response->assertSessionHasErrors(['order_uuid']);
    }

    #[Test]
    public function it_validates_employee_list_required_on_save_assignments()
    {
        $this->actingAs($this->user);

        $order = Order::factory()->create();

        $response = $this->post(route('order-employees.save-assignments'), [
            'order_uuid' => $order->uuid,
        ]);

        $response->assertSessionHasErrors(['employee_list']);
    }

    #[Test]
    public function it_validates_employee_list_array_on_save_assignments()
    {
        $this->actingAs($this->user);

        $order = Order::factory()->create();

        $response = $this->post(route('order-employees.save-assignments'), [
            'order_uuid' => $order->uuid,
            'employee_list' => 'not-an-array',
        ]);

        $response->assertSessionHasErrors(['employee_list']);
    }

    #[Test]
    public function it_validates_employee_uuid_exists_on_save_assignments()
    {
        $this->actingAs($this->user);

        $order = Order::factory()->create();

        $response = $this->post(route('order-employees.save-assignments'), [
            'order_uuid' => $order->uuid,
            'employee_list' => ['00000000-0000-0000-0000-000000000000'],
        ]);

        $response->assertSessionHasErrors(['employee_list.0']);
    }

    #[Test]
    public function it_validates_employee_uuid_required_on_check_assignment()
    {
        $this->actingAs($this->user);

        $order = Order::factory()->create();

        $response = $this->get(route('order-employees.check-assignment', [
            'order_uuid' => $order->uuid,
        ]));

        $response->assertSessionHasErrors(['employee_uuid']);
    }

    #[Test]
    public function it_validates_order_uuid_required_on_check_assignment()
    {
        $this->actingAs($this->user);

        $employee = Employee::factory()->create();

        $response = $this->get(route('order-employees.check-assignment', [
            'employee_uuid' => $employee->uuid,
        ]));

        $response->assertSessionHasErrors(['order_uuid']);
    }

    #[Test]
    public function it_only_shows_active_assignments()
    {
        $this->actingAs($this->user);

        $order = Order::factory()->create();
        $employee = Employee::factory()->create();

        OfferOrderEmployee::factory()->create([
            'order_uuid' => $order->uuid,
            'employee_uuid' => $employee->uuid,
            'removed' => false,
        ]);

        OfferOrderEmployee::factory()->create([
            'order_uuid' => $order->uuid,
            'employee_uuid' => $employee->uuid,
            'removed' => true,
        ]);

        $response = $this->get(route('order-employees.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->where('assignments.data', function ($data) {
            $dataArray = is_object($data) && method_exists($data, 'toArray') ? $data->toArray() : $data;
            $this->assertCount(1, $dataArray);

            return true;
        })
        );
    }

    #[Test]
    public function it_loads_order_and_employee_relationships()
    {
        $this->actingAs($this->user);

        $order = Order::factory()->create();
        $employee = Employee::factory()->create();

        OfferOrderEmployee::factory()->create([
            'order_uuid' => $order->uuid,
            'employee_uuid' => $employee->uuid,
            'removed' => false,
        ]);

        $response = $this->get(route('order-employees.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->where('assignments.data', function ($data) {
            $dataArray = is_object($data) && method_exists($data, 'toArray') ? $data->toArray() : $data;
            $this->assertArrayHasKey('order', $dataArray[0]);
            $this->assertArrayHasKey('employee', $dataArray[0]);

            return true;
        })
        );
    }
}
