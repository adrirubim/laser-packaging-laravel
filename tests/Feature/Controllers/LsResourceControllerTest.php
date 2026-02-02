<?php

namespace Tests\Feature\Controllers;

use App\Models\LsResource;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class LsResourceControllerTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    #[Test]
    public function it_displays_index_page_with_resources()
    {
        $this->actingAs($this->user);

        LsResource::factory()->create(['removed' => false, 'name' => 'Risorsa Test 1']);
        LsResource::factory()->create(['removed' => false, 'name' => 'Risorsa Test 2']);

        $response = $this->get(route('ls-resources.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->has('resources')->has('resources.data'));
    }

    #[Test]
    public function it_stores_new_resource()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('ls-resources.store'), [
            'uuid' => \Illuminate\Support\Str::uuid()->toString(),
            'code' => 'LSR-001',
            'name' => 'Nuova Risorsa L&S',
        ]);

        $response->assertRedirect(route('ls-resources.index'));
        $response->assertSessionHas('success', 'Risorsa L&S creata con successo.');
        $this->assertDatabaseHas('offerlsresource', ['code' => 'LSR-001', 'name' => 'Nuova Risorsa L&S', 'removed' => false]);
    }

    #[Test]
    public function it_shows_create_form()
    {
        $this->actingAs($this->user);

        $response = $this->get(route('ls-resources.create'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('LsResources/Create'));
    }

    #[Test]
    public function it_shows_resource_details()
    {
        $this->actingAs($this->user);

        $resource = LsResource::factory()->create(['name' => 'Risorsa Test', 'code' => 'LSR-001']);

        $response = $this->get(route('ls-resources.show', $resource));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('LsResources/Show')
            ->has('resource')
            ->where('resource.name', 'Risorsa Test')
        );
    }

    #[Test]
    public function it_shows_edit_form()
    {
        $this->actingAs($this->user);

        $resource = LsResource::factory()->create(['name' => 'Risorsa Test', 'code' => 'LSR-001']);

        $response = $this->get(route('ls-resources.edit', $resource));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('LsResources/Edit')
            ->has('resource')
            ->where('resource.name', 'Risorsa Test')
        );
    }

    #[Test]
    public function it_updates_resource()
    {
        $this->actingAs($this->user);

        $resource = LsResource::factory()->create(['code' => 'LSR-001', 'name' => 'Risorsa Originale']);

        $response = $this->put(route('ls-resources.update', $resource), [
            'code' => 'LSR-002',
            'name' => 'Risorsa Aggiornata',
        ]);

        $response->assertRedirect(route('ls-resources.index'));
        $this->assertDatabaseHas('offerlsresource', ['id' => $resource->id, 'name' => 'Risorsa Aggiornata']);
    }

    #[Test]
    public function it_soft_deletes_resource()
    {
        $this->actingAs($this->user);

        $resource = LsResource::factory()->create(['removed' => false]);

        $response = $this->delete(route('ls-resources.destroy', $resource));

        $response->assertRedirect(route('ls-resources.index'));
        $resource->refresh();
        $this->assertTrue($resource->removed);
    }

    #[Test]
    public function it_filters_resources_by_search()
    {
        $this->actingAs($this->user);

        LsResource::factory()->create(['removed' => false, 'code' => 'LSR-001', 'name' => 'Risorsa Alpha']);
        LsResource::factory()->create(['removed' => false, 'code' => 'LSR-002', 'name' => 'Risorsa Beta']);

        $response = $this->get(route('ls-resources.index', ['search' => 'Alpha']));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->where('resources.data', function ($data) {
            $dataArray = is_object($data) && method_exists($data, 'toArray') ? $data->toArray() : $data;
            $this->assertCount(1, $dataArray);
            $this->assertEquals('Risorsa Alpha', $dataArray[0]['name']);

            return true;
        })
        );
    }

    #[Test]
    public function it_paginates_resources()
    {
        $this->actingAs($this->user);

        LsResource::factory()->count(20)->create(['removed' => false]);

        $response = $this->get(route('ls-resources.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->has('resources')
            ->where('resources.current_page', 1)
            ->where('resources.last_page', function ($lastPage) {
                $this->assertGreaterThan(1, $lastPage);

                return true;
            })
        );
    }

    #[Test]
    public function it_handles_empty_search_results()
    {
        $this->actingAs($this->user);

        LsResource::factory()->create(['removed' => false, 'code' => 'LSR-001', 'name' => 'Risorsa Test']);

        $response = $this->get(route('ls-resources.index', ['search' => 'NonExistent']));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->where('resources.data', [])
        );
    }

    #[Test]
    public function it_validates_required_fields_on_store()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('ls-resources.store'), []);

        $response->assertSessionHasErrors(['uuid', 'code']);
    }

    #[Test]
    public function it_validates_code_max_length_on_store()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('ls-resources.store'), [
            'uuid' => \Illuminate\Support\Str::uuid()->toString(),
            'code' => str_repeat('a', 256),
            'name' => 'Test Resource',
        ]);

        $response->assertSessionHasErrors(['code']);
    }

    #[Test]
    public function it_validates_name_max_length_on_store()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('ls-resources.store'), [
            'uuid' => \Illuminate\Support\Str::uuid()->toString(),
            'code' => 'LSR-001',
            'name' => str_repeat('a', 256),
        ]);

        $response->assertSessionHasErrors(['name']);
    }

    #[Test]
    public function it_validates_required_fields_on_update()
    {
        $this->actingAs($this->user);

        $resource = LsResource::factory()->create();

        $response = $this->put(route('ls-resources.update', $resource), []);

        $response->assertSessionHasErrors(['code']);
    }

    #[Test]
    public function it_validates_code_max_length_on_update()
    {
        $this->actingAs($this->user);

        $resource = LsResource::factory()->create();

        $response = $this->put(route('ls-resources.update', $resource), [
            'code' => str_repeat('a', 256),
            'name' => 'Test Resource',
        ]);

        $response->assertSessionHasErrors(['code']);
    }

    #[Test]
    public function it_validates_name_max_length_on_update()
    {
        $this->actingAs($this->user);

        $resource = LsResource::factory()->create();

        $response = $this->put(route('ls-resources.update', $resource), [
            'code' => 'LSR-001',
            'name' => str_repeat('a', 256),
        ]);

        $response->assertSessionHasErrors(['name']);
    }

    #[Test]
    public function it_only_shows_active_resources()
    {
        $this->actingAs($this->user);

        LsResource::factory()->create(['removed' => false, 'code' => 'LSR-001', 'name' => 'Risorsa Attiva']);
        LsResource::factory()->create(['removed' => true, 'code' => 'LSR-002', 'name' => 'Risorsa Eliminata']);

        $response = $this->get(route('ls-resources.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->where('resources.data', function ($data) {
            $dataArray = is_object($data) && method_exists($data, 'toArray') ? $data->toArray() : $data;
            $this->assertCount(1, $dataArray);
            $this->assertEquals('Risorsa Attiva', $dataArray[0]['name']);

            return true;
        })
        );
    }
}
