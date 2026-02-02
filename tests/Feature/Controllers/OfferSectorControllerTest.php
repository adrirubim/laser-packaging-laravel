<?php

namespace Tests\Feature\Controllers;

use App\Models\OfferSector;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class OfferSectorControllerTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    #[Test]
    public function it_displays_index_page_with_sectors()
    {
        $this->actingAs($this->user);

        OfferSector::factory()->create(['removed' => false, 'name' => 'Settore Test 1']);
        OfferSector::factory()->create(['removed' => false, 'name' => 'Settore Test 2']);

        $response = $this->get('/offers/sectors');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->has('sectors')->has('sectors.data'));
    }

    #[Test]
    public function it_stores_new_sector()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('offer-sectors.store'), [
            'uuid' => \Illuminate\Support\Str::uuid()->toString(),
            'name' => 'Nuovo Settore',
        ]);

        $response->assertRedirect(route('offer-sectors.index'));
        $response->assertSessionHas('success', 'Settore creato con successo.');
        $this->assertDatabaseHas('offersector', ['name' => 'Nuovo Settore', 'removed' => false]);
    }

    #[Test]
    public function it_updates_sector()
    {
        $this->actingAs($this->user);

        $sector = OfferSector::factory()->create(['name' => 'Settore Originale']);

        $response = $this->put(route('offer-sectors.update', $sector), [
            'name' => 'Settore Aggiornato',
        ]);

        $response->assertRedirect(route('offer-sectors.index'));
        $this->assertDatabaseHas('offersector', ['id' => $sector->id, 'name' => 'Settore Aggiornato']);
    }

    #[Test]
    public function it_shows_create_form()
    {
        $this->actingAs($this->user);

        $response = $this->get(route('offer-sectors.create'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('OfferSectors/Create'));
    }

    #[Test]
    public function it_shows_sector_details()
    {
        $this->actingAs($this->user);

        $sector = OfferSector::factory()->create(['name' => 'Settore Test']);

        $response = $this->get(route('offer-sectors.show', $sector));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('OfferSectors/Show')
            ->has('sector')
            ->where('sector.name', 'Settore Test')
        );
    }

    #[Test]
    public function it_shows_edit_form()
    {
        $this->actingAs($this->user);

        $sector = OfferSector::factory()->create(['name' => 'Settore Test']);

        $response = $this->get(route('offer-sectors.edit', $sector));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('OfferSectors/Edit')
            ->has('sector')
            ->where('sector.name', 'Settore Test')
        );
    }

    #[Test]
    public function it_soft_deletes_sector()
    {
        $this->actingAs($this->user);

        $sector = OfferSector::factory()->create(['removed' => false]);

        $response = $this->delete(route('offer-sectors.destroy', $sector));

        $response->assertRedirect(route('offer-sectors.index'));
        $sector->refresh();
        $this->assertTrue($sector->removed);
    }

    #[Test]
    public function it_filters_sectors_by_search()
    {
        $this->actingAs($this->user);

        OfferSector::factory()->create(['removed' => false, 'name' => 'Settore Alpha']);
        OfferSector::factory()->create(['removed' => false, 'name' => 'Settore Beta']);

        $response = $this->get('/offers/sectors?search=Alpha');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->where('sectors.data', function ($data) {
            $dataArray = is_object($data) && method_exists($data, 'toArray') ? $data->toArray() : $data;
            $this->assertCount(1, $dataArray);
            $this->assertEquals('Settore Alpha', $dataArray[0]['name']);

            return true;
        })
        );
    }

    #[Test]
    public function it_paginates_sectors()
    {
        $this->actingAs($this->user);

        OfferSector::factory()->count(20)->create(['removed' => false]);

        $response = $this->get('/offers/sectors');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->has('sectors')
            ->where('sectors.current_page', 1)
            ->where('sectors.last_page', function ($lastPage) {
                $this->assertGreaterThan(1, $lastPage);

                return true;
            })
        );
    }

    #[Test]
    public function it_handles_empty_search_results()
    {
        $this->actingAs($this->user);

        OfferSector::factory()->create(['removed' => false, 'name' => 'Settore Test']);

        $response = $this->get('/offers/sectors?search=NonExistent');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->where('sectors.data', [])
        );
    }

    #[Test]
    public function it_validates_required_fields_on_store()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('offer-sectors.store'), []);

        $response->assertSessionHasErrors(['uuid', 'name']);
    }

    #[Test]
    public function it_validates_name_max_length_on_store()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('offer-sectors.store'), [
            'uuid' => \Illuminate\Support\Str::uuid()->toString(),
            'name' => str_repeat('a', 256),
        ]);

        $response->assertSessionHasErrors(['name']);
    }

    #[Test]
    public function it_validates_uuid_format_on_store()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('offer-sectors.store'), [
            'uuid' => 'invalid-uuid',
            'name' => 'Test Sector',
        ]);

        $response->assertSessionHasErrors(['uuid']);
    }

    #[Test]
    public function it_validates_unique_uuid_on_store()
    {
        $this->actingAs($this->user);

        $uuid = \Illuminate\Support\Str::uuid()->toString();
        OfferSector::factory()->create(['uuid' => $uuid]);

        $response = $this->post(route('offer-sectors.store'), [
            'uuid' => $uuid,
            'name' => 'Test Sector',
        ]);

        $response->assertSessionHasErrors(['uuid']);
    }

    #[Test]
    public function it_validates_required_fields_on_update()
    {
        $this->actingAs($this->user);

        $sector = OfferSector::factory()->create();

        $response = $this->put(route('offer-sectors.update', $sector), []);

        $response->assertSessionHasErrors(['name']);
    }

    #[Test]
    public function it_validates_name_max_length_on_update()
    {
        $this->actingAs($this->user);

        $sector = OfferSector::factory()->create();

        $response = $this->put(route('offer-sectors.update', $sector), [
            'name' => str_repeat('a', 256),
        ]);

        $response->assertSessionHasErrors(['name']);
    }

    #[Test]
    public function it_only_shows_active_sectors()
    {
        $this->actingAs($this->user);

        OfferSector::factory()->create(['removed' => false, 'name' => 'Settore Attivo']);
        OfferSector::factory()->create(['removed' => true, 'name' => 'Settore Eliminato']);

        $response = $this->get('/offers/sectors');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->where('sectors.data', function ($data) {
            $dataArray = is_object($data) && method_exists($data, 'toArray') ? $data->toArray() : $data;
            $this->assertCount(1, $dataArray);
            $this->assertEquals('Settore Attivo', $dataArray[0]['name']);

            return true;
        })
        );
    }
}
