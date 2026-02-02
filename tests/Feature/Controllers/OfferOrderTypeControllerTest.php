<?php

namespace Tests\Feature\Controllers;

use App\Models\OfferOrderType;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class OfferOrderTypeControllerTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    #[Test]
    public function it_displays_index_page_with_order_types()
    {
        $this->actingAs($this->user);

        OfferOrderType::factory()->create(['removed' => false, 'name' => 'Tipo Ordine Test 1']);
        OfferOrderType::factory()->create(['removed' => false, 'name' => 'Tipo Ordine Test 2']);

        $response = $this->get('/offers/order-types');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->has('orderTypes')->has('orderTypes.data'));
    }

    #[Test]
    public function it_stores_new_order_type()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('offer-order-types.store'), [
            'uuid' => \Illuminate\Support\Str::uuid()->toString(),
            'code' => 'OT-001',
            'name' => 'Nuovo Tipo Ordine',
        ]);

        $response->assertRedirect(route('offer-order-types.index'));
        $response->assertSessionHas('success', 'Tipo ordine creato con successo.');
        $this->assertDatabaseHas('offertypeorder', ['code' => 'OT-001', 'name' => 'Nuovo Tipo Ordine', 'removed' => false]);
    }

    #[Test]
    public function it_shows_create_form()
    {
        $this->actingAs($this->user);

        $response = $this->get(route('offer-order-types.create'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('OfferOrderTypes/Create'));
    }

    #[Test]
    public function it_shows_order_type_details()
    {
        $this->actingAs($this->user);

        $orderType = OfferOrderType::factory()->create(['name' => 'Tipo Test', 'code' => 'OT-001']);

        $response = $this->get(route('offer-order-types.show', $orderType));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('OfferOrderTypes/Show')
            ->has('orderType')
            ->where('orderType.name', 'Tipo Test')
        );
    }

    #[Test]
    public function it_shows_edit_form()
    {
        $this->actingAs($this->user);

        $orderType = OfferOrderType::factory()->create(['name' => 'Tipo Test', 'code' => 'OT-001']);

        $response = $this->get(route('offer-order-types.edit', $orderType));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('OfferOrderTypes/Edit')
            ->has('orderType')
            ->where('orderType.name', 'Tipo Test')
        );
    }

    #[Test]
    public function it_updates_order_type()
    {
        $this->actingAs($this->user);

        $orderType = OfferOrderType::factory()->create(['code' => 'OT-001', 'name' => 'Tipo Originale']);

        $response = $this->put(route('offer-order-types.update', $orderType), [
            'code' => 'OT-002',
            'name' => 'Tipo Aggiornato',
        ]);

        $response->assertRedirect(route('offer-order-types.index'));
        $this->assertDatabaseHas('offertypeorder', ['id' => $orderType->id, 'name' => 'Tipo Aggiornato']);
    }

    #[Test]
    public function it_soft_deletes_order_type()
    {
        $this->actingAs($this->user);

        $orderType = OfferOrderType::factory()->create(['removed' => false]);

        $response = $this->delete(route('offer-order-types.destroy', $orderType));

        $response->assertRedirect(route('offer-order-types.index'));
        $orderType->refresh();
        $this->assertTrue($orderType->removed);
    }

    #[Test]
    public function it_filters_order_types_by_search()
    {
        $this->actingAs($this->user);

        OfferOrderType::factory()->create(['removed' => false, 'code' => 'OT-001', 'name' => 'Tipo Alpha']);
        OfferOrderType::factory()->create(['removed' => false, 'code' => 'OT-002', 'name' => 'Tipo Beta']);

        $response = $this->get('/offers/order-types?search=Alpha');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->where('orderTypes.data', function ($data) {
            $dataArray = is_object($data) && method_exists($data, 'toArray') ? $data->toArray() : $data;
            $this->assertCount(1, $dataArray);
            $this->assertEquals('Tipo Alpha', $dataArray[0]['name']);

            return true;
        })
        );
    }

    #[Test]
    public function it_filters_order_types_by_code()
    {
        $this->actingAs($this->user);

        OfferOrderType::factory()->create(['removed' => false, 'code' => 'OT-001', 'name' => 'Tipo Alpha']);
        OfferOrderType::factory()->create(['removed' => false, 'code' => 'OT-002', 'name' => 'Tipo Beta']);

        $response = $this->get('/offers/order-types?search=OT-001');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->where('orderTypes.data', function ($data) {
            $dataArray = is_object($data) && method_exists($data, 'toArray') ? $data->toArray() : $data;
            $this->assertCount(1, $dataArray);
            $this->assertEquals('OT-001', $dataArray[0]['code']);

            return true;
        })
        );
    }

    #[Test]
    public function it_paginates_order_types()
    {
        $this->actingAs($this->user);

        OfferOrderType::factory()->count(20)->create(['removed' => false]);

        $response = $this->get('/offers/order-types');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->has('orderTypes')
            ->where('orderTypes.current_page', 1)
            ->where('orderTypes.last_page', function ($lastPage) {
                $this->assertGreaterThan(1, $lastPage);

                return true;
            })
        );
    }

    #[Test]
    public function it_handles_empty_search_results()
    {
        $this->actingAs($this->user);

        OfferOrderType::factory()->create(['removed' => false, 'code' => 'OT-001', 'name' => 'Tipo Test']);

        $response = $this->get('/offers/order-types?search=NonExistent');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->where('orderTypes.data', [])
        );
    }

    #[Test]
    public function it_validates_required_fields_on_store()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('offer-order-types.store'), []);

        $response->assertSessionHasErrors(['code', 'name']);
    }

    #[Test]
    public function it_validates_code_max_length_on_store()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('offer-order-types.store'), [
            'code' => str_repeat('a', 256),
            'name' => 'Test Order Type',
        ]);

        $response->assertSessionHasErrors(['code']);
    }

    #[Test]
    public function it_validates_name_max_length_on_store()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('offer-order-types.store'), [
            'code' => 'OT-001',
            'name' => str_repeat('a', 256),
        ]);

        $response->assertSessionHasErrors(['name']);
    }

    #[Test]
    public function it_validates_unique_code_on_store()
    {
        $this->actingAs($this->user);

        OfferOrderType::factory()->create(['code' => 'OT-001', 'removed' => false]);

        $response = $this->post(route('offer-order-types.store'), [
            'code' => 'OT-001',
            'name' => 'Test Order Type',
        ]);

        $response->assertSessionHasErrors(['code']);
    }

    #[Test]
    public function it_validates_required_fields_on_update()
    {
        $this->actingAs($this->user);

        $orderType = OfferOrderType::factory()->create();

        $response = $this->put(route('offer-order-types.update', $orderType), []);

        $response->assertSessionHasErrors(['code', 'name']);
    }

    #[Test]
    public function it_validates_code_max_length_on_update()
    {
        $this->actingAs($this->user);

        $orderType = OfferOrderType::factory()->create();

        $response = $this->put(route('offer-order-types.update', $orderType), [
            'code' => str_repeat('a', 256),
            'name' => 'Test Order Type',
        ]);

        $response->assertSessionHasErrors(['code']);
    }

    #[Test]
    public function it_validates_name_max_length_on_update()
    {
        $this->actingAs($this->user);

        $orderType = OfferOrderType::factory()->create();

        $response = $this->put(route('offer-order-types.update', $orderType), [
            'code' => 'OT-001',
            'name' => str_repeat('a', 256),
        ]);

        $response->assertSessionHasErrors(['name']);
    }

    #[Test]
    public function it_validates_unique_code_on_update()
    {
        $this->actingAs($this->user);

        $orderType1 = OfferOrderType::factory()->create(['code' => 'OT-001', 'removed' => false]);
        $orderType2 = OfferOrderType::factory()->create(['code' => 'OT-002', 'removed' => false]);

        $response = $this->put(route('offer-order-types.update', $orderType2), [
            'code' => 'OT-001',
            'name' => 'Test Order Type',
        ]);

        $response->assertSessionHasErrors(['code']);
    }

    #[Test]
    public function it_only_shows_active_order_types()
    {
        $this->actingAs($this->user);

        OfferOrderType::factory()->create(['removed' => false, 'code' => 'OT-001', 'name' => 'Tipo Attivo']);
        OfferOrderType::factory()->create(['removed' => true, 'code' => 'OT-002', 'name' => 'Tipo Eliminato']);

        $response = $this->get('/offers/order-types');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->where('orderTypes.data', function ($data) {
            $dataArray = is_object($data) && method_exists($data, 'toArray') ? $data->toArray() : $data;
            $this->assertCount(1, $dataArray);
            $this->assertEquals('Tipo Attivo', $dataArray[0]['name']);

            return true;
        })
        );
    }
}
