<?php

namespace Tests\Feature\Controllers;

use App\Models\LasFamily;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class LasFamilyControllerTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    #[Test]
    public function it_displays_index_page_with_families()
    {
        $this->actingAs($this->user);

        LasFamily::factory()->create(['removed' => false, 'name' => 'Famiglia Test 1']);
        LasFamily::factory()->create(['removed' => false, 'name' => 'Famiglia Test 2']);

        $response = $this->get(route('las-families.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->has('families')->has('families.data'));
    }

    #[Test]
    public function it_stores_new_family()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('las-families.store'), [
            'uuid' => \Illuminate\Support\Str::uuid()->toString(),
            'code' => 'LAS-001',
            'name' => 'Nuova Famiglia LAS',
        ]);

        $response->assertRedirect(route('las-families.index'));
        $response->assertSessionHas('success', 'Famiglia LAS creata con successo.');
        $this->assertDatabaseHas('offerlasfamily', ['code' => 'LAS-001', 'name' => 'Nuova Famiglia LAS', 'removed' => false]);
    }

    #[Test]
    public function it_validates_unique_code()
    {
        $this->actingAs($this->user);

        LasFamily::factory()->create(['code' => 'LAS-001']);

        $response = $this->post(route('las-families.store'), [
            'code' => 'LAS-001',
            'name' => 'Famiglia Duplicata',
        ]);

        $response->assertSessionHasErrors(['code']);
    }

    #[Test]
    public function it_updates_family()
    {
        $this->actingAs($this->user);

        $family = LasFamily::factory()->create(['code' => 'LAS-001', 'name' => 'Famiglia Originale']);

        $response = $this->put(route('las-families.update', $family->uuid), [
            'code' => 'LAS-002',
            'name' => 'Famiglia Aggiornata',
        ]);

        $response->assertRedirect(route('las-families.index'));
        $this->assertDatabaseHas('offerlasfamily', ['id' => $family->id, 'name' => 'Famiglia Aggiornata']);
    }

    #[Test]
    public function it_shows_create_form()
    {
        $this->actingAs($this->user);

        $response = $this->get(route('las-families.create'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('LasFamilies/Create'));
    }

    #[Test]
    public function it_shows_family_details()
    {
        $this->actingAs($this->user);

        $family = LasFamily::factory()->create(['name' => 'Famiglia Test', 'code' => 'TEST-001']);

        $response = $this->get(route('las-families.show', $family->uuid));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('LasFamilies/Show')
            ->has('family')
            ->where('family.name', 'Famiglia Test')
            ->where('family.code', 'TEST-001')
        );
    }

    #[Test]
    public function it_shows_edit_form()
    {
        $this->actingAs($this->user);

        $family = LasFamily::factory()->create(['name' => 'Famiglia Test', 'code' => 'TEST-001']);

        $response = $this->get(route('las-families.edit', $family->uuid));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('LasFamilies/Edit')
            ->has('family')
            ->where('family.name', 'Famiglia Test')
        );
    }

    #[Test]
    public function it_soft_deletes_family()
    {
        $this->actingAs($this->user);

        $family = LasFamily::factory()->create(['removed' => false]);

        $response = $this->delete(route('las-families.destroy', $family->uuid));

        $response->assertRedirect(route('las-families.index'));
        $family->refresh();
        $this->assertTrue($family->removed);
    }

    #[Test]
    public function it_filters_families_by_search()
    {
        $this->actingAs($this->user);

        LasFamily::factory()->create(['removed' => false, 'code' => 'LAS-001', 'name' => 'Famiglia Alpha']);
        LasFamily::factory()->create(['removed' => false, 'code' => 'LAS-002', 'name' => 'Famiglia Beta']);

        $response = $this->get(route('las-families.index', ['search' => 'Alpha']));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->where('families.data', function ($data) {
            $dataArray = is_object($data) && method_exists($data, 'toArray') ? $data->toArray() : $data;
            $this->assertCount(1, $dataArray);
            $this->assertEquals('Famiglia Alpha', $dataArray[0]['name']);

            return true;
        })
        );
    }

    #[Test]
    public function it_filters_families_by_code()
    {
        $this->actingAs($this->user);

        LasFamily::factory()->create(['removed' => false, 'code' => 'LAS-001', 'name' => 'Famiglia Alpha']);
        LasFamily::factory()->create(['removed' => false, 'code' => 'LAS-002', 'name' => 'Famiglia Beta']);

        $response = $this->get(route('las-families.index', ['search' => 'LAS-001']));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->where('families.data', function ($data) {
            $dataArray = is_object($data) && method_exists($data, 'toArray') ? $data->toArray() : $data;
            $this->assertCount(1, $dataArray);
            $this->assertEquals('LAS-001', $dataArray[0]['code']);

            return true;
        })
        );
    }

    #[Test]
    public function it_paginates_families()
    {
        $this->actingAs($this->user);

        LasFamily::factory()->count(20)->create(['removed' => false]);

        $response = $this->get(route('las-families.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->has('families')
            ->where('families.current_page', 1)
            ->where('families.last_page', function ($lastPage) {
                $this->assertGreaterThan(1, $lastPage);

                return true;
            })
        );
    }

    #[Test]
    public function it_handles_empty_search_results()
    {
        $this->actingAs($this->user);

        LasFamily::factory()->create(['removed' => false, 'code' => 'LAS-001', 'name' => 'Famiglia Test']);

        $response = $this->get(route('las-families.index', ['search' => 'NonExistent']));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->where('families.data', [])
        );
    }

    #[Test]
    public function it_validates_required_fields_on_store()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('las-families.store'), []);

        $response->assertSessionHasErrors(['uuid', 'code', 'name']);
    }

    #[Test]
    public function it_validates_code_max_length_on_store()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('las-families.store'), [
            'uuid' => \Illuminate\Support\Str::uuid()->toString(),
            'code' => str_repeat('a', 256),
            'name' => 'Test Family',
        ]);

        $response->assertSessionHasErrors(['code']);
    }

    #[Test]
    public function it_validates_name_max_length_on_store()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('las-families.store'), [
            'uuid' => \Illuminate\Support\Str::uuid()->toString(),
            'code' => 'LAS-001',
            'name' => str_repeat('a', 256),
        ]);

        $response->assertSessionHasErrors(['name']);
    }

    #[Test]
    public function it_validates_required_fields_on_update()
    {
        $this->actingAs($this->user);

        $family = LasFamily::factory()->create();

        $response = $this->put(route('las-families.update', $family->uuid), []);

        $response->assertSessionHasErrors(['code', 'name']);
    }

    #[Test]
    public function it_validates_code_max_length_on_update()
    {
        $this->actingAs($this->user);

        $family = LasFamily::factory()->create();

        $response = $this->put(route('las-families.update', $family->uuid), [
            'code' => str_repeat('a', 256),
            'name' => 'Test Family',
        ]);

        $response->assertSessionHasErrors(['code']);
    }

    #[Test]
    public function it_validates_name_max_length_on_update()
    {
        $this->actingAs($this->user);

        $family = LasFamily::factory()->create();

        $response = $this->put(route('las-families.update', $family->uuid), [
            'code' => 'LAS-001',
            'name' => str_repeat('a', 256),
        ]);

        $response->assertSessionHasErrors(['name']);
    }

    #[Test]
    public function it_only_shows_active_families()
    {
        $this->actingAs($this->user);

        LasFamily::factory()->create(['removed' => false, 'code' => 'LAS-001', 'name' => 'Famiglia Attiva']);
        LasFamily::factory()->create(['removed' => true, 'code' => 'LAS-002', 'name' => 'Famiglia Eliminata']);

        $response = $this->get(route('las-families.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->where('families.data', function ($data) {
            $dataArray = is_object($data) && method_exists($data, 'toArray') ? $data->toArray() : $data;
            $this->assertCount(1, $dataArray);
            $this->assertEquals('Famiglia Attiva', $dataArray[0]['name']);

            return true;
        })
        );
    }
}
