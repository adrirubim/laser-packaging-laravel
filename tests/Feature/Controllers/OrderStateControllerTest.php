<?php

namespace Tests\Feature\Controllers;

use App\Models\OfferOrderState;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class OrderStateControllerTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    #[Test]
    public function it_displays_index_page_with_order_states()
    {
        $this->actingAs($this->user);

        OfferOrderState::factory()->create([
            'removed' => false,
            'name' => 'Pianificato',
            'sorting' => 1,
        ]);

        OfferOrderState::factory()->create([
            'removed' => false,
            'name' => 'In Avanzamento',
            'sorting' => 2,
        ]);

        $response = $this->get(route('order-states.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->has('orderStates')
            ->has('orderStates.data')
        );
    }

    #[Test]
    public function it_shows_create_form()
    {
        $this->actingAs($this->user);

        $response = $this->get(route('order-states.create'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('OrderStates/Create')
        );
    }

    #[Test]
    public function it_stores_new_order_state()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('order-states.store'), [
            'name' => 'Nuevo Estado',
            'sorting' => 10,
            'initial' => true,
            'production' => false,
        ]);

        $response->assertRedirect(route('order-states.index'));
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('offerorderstate', [
            'name' => 'Nuevo Estado',
            'sorting' => 10,
            'initial' => true,
            'production' => false,
            'removed' => false,
        ]);
    }

    #[Test]
    public function it_auto_assigns_sorting_if_not_provided()
    {
        $this->actingAs($this->user);

        OfferOrderState::factory()->create(['sorting' => 5]);

        $response = $this->post(route('order-states.store'), [
            'name' => 'Estado Sin Sorting',
        ]);

        $response->assertRedirect(route('order-states.index'));

        $this->assertDatabaseHas('offerorderstate', [
            'name' => 'Estado Sin Sorting',
            'sorting' => 6,
        ]);
    }

    #[Test]
    public function it_validates_unique_name()
    {
        $this->actingAs($this->user);

        OfferOrderState::factory()->create([
            'name' => 'Estado Existente',
        ]);

        $response = $this->post(route('order-states.store'), [
            'name' => 'Estado Existente',
        ]);

        $response->assertSessionHasErrors(['name']);
    }

    #[Test]
    public function it_shows_order_state()
    {
        $this->actingAs($this->user);

        $state = OfferOrderState::factory()->create([
            'name' => 'Estado Test',
            'sorting' => 1,
        ]);

        $response = $this->get(route('order-states.show', $state));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('OrderStates/Show')
            ->has('orderState')
            ->where('orderState.name', 'Estado Test')
        );
    }

    #[Test]
    public function it_shows_edit_form()
    {
        $this->actingAs($this->user);

        $state = OfferOrderState::factory()->create();

        $response = $this->get(route('order-states.edit', $state));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('OrderStates/Edit')
            ->has('orderState')
        );
    }

    #[Test]
    public function it_updates_order_state()
    {
        $this->actingAs($this->user);

        $state = OfferOrderState::factory()->create([
            'name' => 'Estado Original',
            'sorting' => 1,
        ]);

        $response = $this->put(route('order-states.update', $state), [
            'name' => 'Estado Actualizado',
            'sorting' => 2,
            'initial' => false,
            'production' => true,
        ]);

        $response->assertRedirect(route('order-states.index'));
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('offerorderstate', [
            'id' => $state->id,
            'name' => 'Estado Actualizado',
            'sorting' => 2,
            'initial' => false,
            'production' => true,
        ]);
    }

    #[Test]
    public function it_validates_unique_name_on_update()
    {
        $this->actingAs($this->user);

        $state1 = OfferOrderState::factory()->create(['name' => 'Estado 1']);
        $state2 = OfferOrderState::factory()->create(['name' => 'Estado 2']);

        $response = $this->put(route('order-states.update', $state2), [
            'name' => 'Estado 1',
        ]);

        $response->assertSessionHasErrors(['name']);
    }

    #[Test]
    public function it_destroys_order_state()
    {
        $this->actingAs($this->user);

        $state = OfferOrderState::factory()->create();

        $response = $this->delete(route('order-states.destroy', $state));

        $response->assertRedirect(route('order-states.index'));
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('offerorderstate', [
            'id' => $state->id,
            'removed' => true,
        ]);
    }

    #[Test]
    public function it_paginates_order_states()
    {
        $this->actingAs($this->user);

        OfferOrderState::factory()->count(20)->create(['removed' => false]);

        $response = $this->get(route('order-states.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->has('orderStates')
            ->where('orderStates.current_page', 1)
            ->where('orderStates.last_page', function ($lastPage) {
                $this->assertGreaterThan(1, $lastPage);

                return true;
            })
        );
    }

    #[Test]
    public function it_loads_orders_relationship_on_show()
    {
        $this->actingAs($this->user);

        $state = OfferOrderState::factory()->create(['removed' => false]);

        $response = $this->get(route('order-states.show', $state));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->has('orderState.orders')
        );
    }

    #[Test]
    public function it_validates_name_max_length_on_store()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('order-states.store'), [
            'name' => str_repeat('a', 256),
        ]);

        $response->assertSessionHasErrors(['name']);
    }

    #[Test]
    public function it_validates_sorting_integer_on_store()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('order-states.store'), [
            'name' => 'Test State',
            'sorting' => 'invalid',
        ]);

        $response->assertSessionHasErrors(['sorting']);
    }

    #[Test]
    public function it_validates_sorting_min_value_on_store()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('order-states.store'), [
            'name' => 'Test State',
            'sorting' => -1,
        ]);

        $response->assertSessionHasErrors(['sorting']);
    }

    #[Test]
    public function it_only_shows_active_order_states()
    {
        $this->actingAs($this->user);

        OfferOrderState::factory()->create(['removed' => false, 'name' => 'Estado Activo']);
        OfferOrderState::factory()->create(['removed' => true, 'name' => 'Estado Eliminado']);

        $response = $this->get(route('order-states.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->where('orderStates.data', function ($data) {
            $dataArray = is_object($data) && method_exists($data, 'toArray') ? $data->toArray() : $data;
            $this->assertCount(1, $dataArray);
            $this->assertEquals('Estado Activo', $dataArray[0]['name']);

            return true;
        })
        );
    }
}
