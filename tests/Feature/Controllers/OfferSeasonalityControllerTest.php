<?php

namespace Tests\Feature\Controllers;

use App\Models\OfferSeasonality;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class OfferSeasonalityControllerTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    #[Test]
    public function it_displays_index_page_with_seasonalities()
    {
        $this->actingAs($this->user);

        OfferSeasonality::factory()->create(['removed' => false, 'name' => 'Stagionalità Test 1']);
        OfferSeasonality::factory()->create(['removed' => false, 'name' => 'Stagionalità Test 2']);

        $response = $this->get('/offers/seasonality');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->has('seasonalities')->has('seasonalities.data'));
    }

    #[Test]
    public function it_stores_new_seasonality()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('offer-seasonalities.store'), [
            'uuid' => \Illuminate\Support\Str::uuid()->toString(),
            'name' => 'Nuova Stagionalità',
        ]);

        $response->assertRedirect(route('offer-seasonalities.index'));
        $response->assertSessionHas('success', 'Stagionalità creata con successo.');
        $this->assertDatabaseHas('offerseasonality', ['name' => 'Nuova Stagionalità', 'removed' => false]);
    }

    #[Test]
    public function it_updates_seasonality()
    {
        $this->actingAs($this->user);

        $seasonality = OfferSeasonality::factory()->create(['name' => 'Stagionalità Originale']);

        $response = $this->put(route('offer-seasonalities.update', $seasonality), [
            'name' => 'Stagionalità Aggiornata',
        ]);

        $response->assertRedirect(route('offer-seasonalities.index'));
        $this->assertDatabaseHas('offerseasonality', ['id' => $seasonality->id, 'name' => 'Stagionalità Aggiornata']);
    }

    #[Test]
    public function it_shows_create_form()
    {
        $this->actingAs($this->user);

        $response = $this->get(route('offer-seasonalities.create'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('OfferSeasonalities/Create'));
    }

    #[Test]
    public function it_shows_seasonality_details()
    {
        $this->actingAs($this->user);

        $seasonality = OfferSeasonality::factory()->create(['name' => 'Stagionalità Test']);

        $response = $this->get(route('offer-seasonalities.show', $seasonality));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('OfferSeasonalities/Show')
            ->has('seasonality')
            ->where('seasonality.name', 'Stagionalità Test')
        );
    }

    #[Test]
    public function it_shows_edit_form()
    {
        $this->actingAs($this->user);

        $seasonality = OfferSeasonality::factory()->create(['name' => 'Stagionalità Test']);

        $response = $this->get(route('offer-seasonalities.edit', $seasonality));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('OfferSeasonalities/Edit')
            ->has('seasonality')
            ->where('seasonality.name', 'Stagionalità Test')
        );
    }

    #[Test]
    public function it_soft_deletes_seasonality()
    {
        $this->actingAs($this->user);

        $seasonality = OfferSeasonality::factory()->create(['removed' => false]);

        $response = $this->delete(route('offer-seasonalities.destroy', $seasonality));

        $response->assertRedirect(route('offer-seasonalities.index'));
        $seasonality->refresh();
        $this->assertTrue($seasonality->removed);
    }

    #[Test]
    public function it_filters_seasonalities_by_search()
    {
        $this->actingAs($this->user);

        OfferSeasonality::factory()->create(['removed' => false, 'name' => 'Stagionalità Alpha']);
        OfferSeasonality::factory()->create(['removed' => false, 'name' => 'Stagionalità Beta']);

        $response = $this->get('/offers/seasonality?search=Alpha');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->where('seasonalities.data', function ($data) {
            $dataArray = is_object($data) && method_exists($data, 'toArray') ? $data->toArray() : $data;
            $this->assertCount(1, $dataArray);
            $this->assertEquals('Stagionalità Alpha', $dataArray[0]['name']);

            return true;
        })
        );
    }

    #[Test]
    public function it_paginates_seasonalities()
    {
        $this->actingAs($this->user);

        OfferSeasonality::factory()->count(20)->create(['removed' => false]);

        $response = $this->get('/offers/seasonality');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->has('seasonalities')
            ->where('seasonalities.current_page', 1)
            ->where('seasonalities.last_page', function ($lastPage) {
                $this->assertGreaterThan(1, $lastPage);

                return true;
            })
        );
    }

    #[Test]
    public function it_handles_empty_search_results()
    {
        $this->actingAs($this->user);

        OfferSeasonality::factory()->create(['removed' => false, 'name' => 'Stagionalità Test']);

        $response = $this->get('/offers/seasonality?search=NonExistent');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->where('seasonalities.data', [])
        );
    }

    #[Test]
    public function it_validates_required_fields_on_store()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('offer-seasonalities.store'), []);

        $response->assertSessionHasErrors(['uuid', 'name']);
    }

    #[Test]
    public function it_validates_name_max_length_on_store()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('offer-seasonalities.store'), [
            'uuid' => \Illuminate\Support\Str::uuid()->toString(),
            'name' => str_repeat('a', 256),
        ]);

        $response->assertSessionHasErrors(['name']);
    }

    #[Test]
    public function it_validates_uuid_format_on_store()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('offer-seasonalities.store'), [
            'uuid' => 'invalid-uuid',
            'name' => 'Test Seasonality',
        ]);

        $response->assertSessionHasErrors(['uuid']);
    }

    #[Test]
    public function it_validates_unique_uuid_on_store()
    {
        $this->actingAs($this->user);

        $uuid = \Illuminate\Support\Str::uuid()->toString();
        OfferSeasonality::factory()->create(['uuid' => $uuid]);

        $response = $this->post(route('offer-seasonalities.store'), [
            'uuid' => $uuid,
            'name' => 'Test Seasonality',
        ]);

        $response->assertSessionHasErrors(['uuid']);
    }

    #[Test]
    public function it_validates_required_fields_on_update()
    {
        $this->actingAs($this->user);

        $seasonality = OfferSeasonality::factory()->create();

        $response = $this->put(route('offer-seasonalities.update', $seasonality), []);

        $response->assertSessionHasErrors(['name']);
    }

    #[Test]
    public function it_validates_name_max_length_on_update()
    {
        $this->actingAs($this->user);

        $seasonality = OfferSeasonality::factory()->create();

        $response = $this->put(route('offer-seasonalities.update', $seasonality), [
            'name' => str_repeat('a', 256),
        ]);

        $response->assertSessionHasErrors(['name']);
    }

    #[Test]
    public function it_only_shows_active_seasonalities()
    {
        $this->actingAs($this->user);

        OfferSeasonality::factory()->create(['removed' => false, 'name' => 'Stagionalità Attiva']);
        OfferSeasonality::factory()->create(['removed' => true, 'name' => 'Stagionalità Eliminata']);

        $response = $this->get('/offers/seasonality');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->where('seasonalities.data', function ($data) {
            $dataArray = is_object($data) && method_exists($data, 'toArray') ? $data->toArray() : $data;
            $this->assertCount(1, $dataArray);
            $this->assertEquals('Stagionalità Attiva', $dataArray[0]['name']);

            return true;
        })
        );
    }
}
