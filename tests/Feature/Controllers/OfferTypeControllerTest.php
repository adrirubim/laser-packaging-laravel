<?php

namespace Tests\Feature\Controllers;

use App\Models\OfferType;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class OfferTypeControllerTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    #[Test]
    public function it_displays_index_page_with_offer_types()
    {
        $this->actingAs($this->user);

        OfferType::factory()->create(['removed' => false, 'name' => 'Tipo Test 1']);
        OfferType::factory()->create(['removed' => false, 'name' => 'Tipo Test 2']);

        $response = $this->get('/offers/types');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->has('offerTypes')->has('offerTypes.data'));
    }

    #[Test]
    public function it_stores_new_offer_type()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('offer-types.store'), [
            'uuid' => '550e8400-e29b-41d4-a716-446655440000',
            'name' => 'Nuovo Tipo',
        ]);

        $response->assertRedirect(route('offer-types.index'));
        $response->assertSessionHas('success', 'Tipo di offerta creato con successo.');
        $this->assertDatabaseHas('offertype', ['name' => 'Nuovo Tipo', 'removed' => false]);
    }

    #[Test]
    public function it_updates_offer_type()
    {
        $this->actingAs($this->user);

        $offerType = OfferType::factory()->create(['name' => 'Tipo Originale']);

        $response = $this->put(route('offer-types.update', $offerType), [
            'name' => 'Tipo Aggiornato',
        ]);

        $response->assertRedirect(route('offer-types.index'));
        $this->assertDatabaseHas('offertype', ['id' => $offerType->id, 'name' => 'Tipo Aggiornato']);
    }

    #[Test]
    public function it_shows_create_form()
    {
        $this->actingAs($this->user);

        $response = $this->get(route('offer-types.create'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('OfferTypes/Create'));
    }

    #[Test]
    public function it_shows_offer_type_details()
    {
        $this->actingAs($this->user);

        $offerType = OfferType::factory()->create(['name' => 'Tipo Test']);

        $response = $this->get(route('offer-types.show', $offerType));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('OfferTypes/Show')
            ->has('offerType')
            ->where('offerType.name', 'Tipo Test')
        );
    }

    #[Test]
    public function it_shows_edit_form()
    {
        $this->actingAs($this->user);

        $offerType = OfferType::factory()->create(['name' => 'Tipo Test']);

        $response = $this->get(route('offer-types.edit', $offerType));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('OfferTypes/Edit')
            ->has('offerType')
            ->where('offerType.name', 'Tipo Test')
        );
    }

    #[Test]
    public function it_deletes_offer_type_softly()
    {
        $this->actingAs($this->user);

        $offerType = OfferType::factory()->create(['name' => 'Tipo da Eliminare', 'removed' => false]);

        $response = $this->delete(route('offer-types.destroy', $offerType));

        $response->assertRedirect(route('offer-types.index'));
        $response->assertSessionHas('success', 'Tipo di offerta eliminato con successo.');

        $offerType->refresh();
        $this->assertTrue($offerType->removed);
    }

    #[Test]
    public function it_filters_offer_types_by_search()
    {
        $this->actingAs($this->user);

        OfferType::factory()->create(['name' => 'Tipo A', 'removed' => false]);
        OfferType::factory()->create(['name' => 'Tipo B', 'removed' => false]);
        OfferType::factory()->create(['name' => 'Altro Tipo', 'removed' => false]);

        $response = $this->get('/offers/types?search=Tipo A');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('OfferTypes/Index')
            ->has('offerTypes.data', 1)
            ->where('offerTypes.data.0.name', 'Tipo A')
        );
    }

    #[Test]
    public function it_excludes_removed_offer_types_from_index()
    {
        $this->actingAs($this->user);

        OfferType::factory()->create(['name' => 'Tipo Attivo', 'removed' => false]);
        OfferType::factory()->create(['name' => 'Tipo Rimosso', 'removed' => true]);

        $response = $this->get('/offers/types');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('OfferTypes/Index')
            ->has('offerTypes.data', 1)
            ->where('offerTypes.data.0.name', 'Tipo Attivo')
        );
    }

    #[Test]
    public function it_validates_required_fields_on_store()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('offer-types.store'), []);

        $response->assertSessionHasErrors(['uuid', 'name']);
    }

    #[Test]
    public function it_validates_uuid_format_on_store()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('offer-types.store'), [
            'uuid' => 'invalid-uuid',
            'name' => 'Tipo Test',
        ]);

        $response->assertSessionHasErrors(['uuid']);
    }

    #[Test]
    public function it_validates_unique_uuid_on_store()
    {
        $this->actingAs($this->user);

        $existingType = OfferType::factory()->create(['uuid' => '550e8400-e29b-41d4-a716-446655440000']);

        $response = $this->post(route('offer-types.store'), [
            'uuid' => '550e8400-e29b-41d4-a716-446655440000',
            'name' => 'Tipo Test',
        ]);

        $response->assertSessionHasErrors(['uuid']);
    }

    #[Test]
    public function it_validates_name_required_on_update()
    {
        $this->actingAs($this->user);

        $offerType = OfferType::factory()->create();

        $response = $this->put(route('offer-types.update', $offerType), [
            'name' => '',
        ]);

        $response->assertSessionHasErrors(['name']);
    }
}
