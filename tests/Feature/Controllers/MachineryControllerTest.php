<?php

namespace Tests\Feature\Controllers;

use App\Models\Machinery;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class MachineryControllerTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    #[Test]
    public function it_displays_index_page_with_machinery()
    {
        $this->actingAs($this->user);

        Machinery::factory()->create([
            'removed' => false,
            'cod' => 'MAC-001',
            'description' => 'Machinery 1',
        ]);

        $response = $this->get(route('machinery.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->has('machinery')
            ->has('machinery.data')
        );
    }

    #[Test]
    public function it_filters_machinery_by_search()
    {
        $this->actingAs($this->user);

        Machinery::factory()->create(['cod' => 'MAC-001', 'description' => 'Machine Alpha']);
        Machinery::factory()->create(['cod' => 'MAC-002', 'description' => 'Machine Beta']);

        $response = $this->get(route('machinery.index', ['search' => 'Alpha']));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->where('filters.search', 'Alpha')
        );
    }

    #[Test]
    public function it_shows_create_form()
    {
        $this->actingAs($this->user);

        $response = $this->get(route('machinery.create'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('Machinery/Create')
        );
    }

    #[Test]
    public function it_stores_new_machinery()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('machinery.store'), [
            'cod' => 'MAC-NEW',
            'description' => 'New Machinery',
        ]);

        $response->assertRedirect(route('machinery.index'));
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('machinery', [
            'cod' => 'MAC-NEW',
            'description' => 'New Machinery',
            'removed' => false,
        ]);
    }

    #[Test]
    public function it_validates_unique_code()
    {
        $this->actingAs($this->user);

        Machinery::factory()->create(['cod' => 'MAC-001']);

        $response = $this->post(route('machinery.store'), [
            'cod' => 'MAC-001',
            'description' => 'Duplicate',
        ]);

        $response->assertSessionHasErrors(['cod']);
    }

    #[Test]
    public function it_shows_machinery()
    {
        $this->actingAs($this->user);

        $machinery = Machinery::factory()->create();

        $response = $this->get(route('machinery.show', $machinery));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('Machinery/Show')
            ->has('machinery')
        );
    }

    #[Test]
    public function it_shows_edit_form()
    {
        $this->actingAs($this->user);

        $machinery = Machinery::factory()->create();

        $response = $this->get(route('machinery.edit', $machinery));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('Machinery/Edit')
            ->has('machinery')
        );
    }

    #[Test]
    public function it_updates_machinery()
    {
        $this->actingAs($this->user);

        $machinery = Machinery::factory()->create([
            'cod' => 'MAC-OLD',
            'description' => 'Old Description',
        ]);

        $response = $this->put(route('machinery.update', $machinery), [
            'cod' => 'MAC-NEW',
            'description' => 'New Description',
        ]);

        $response->assertRedirect(route('machinery.index'));
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('machinery', [
            'id' => $machinery->id,
            'cod' => 'MAC-NEW',
            'description' => 'New Description',
        ]);
    }

    #[Test]
    public function it_destroys_machinery()
    {
        $this->actingAs($this->user);

        $machinery = Machinery::factory()->create();

        $response = $this->delete(route('machinery.destroy', $machinery));

        $response->assertRedirect(route('machinery.index'));
        $response->assertSessionHas('success');

        $machinery->refresh();
        $this->assertTrue($machinery->removed);

        $this->assertDatabaseHas('machinery', [
            'id' => $machinery->id,
            'removed' => true,
        ]);
    }

    #[Test]
    public function it_requires_cod()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('machinery.store'), [
            'description' => 'Test Description',
        ]);

        $response->assertSessionHasErrors(['cod']);
    }

    #[Test]
    public function it_requires_description()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('machinery.store'), [
            'cod' => 'MAC-001',
        ]);

        $response->assertSessionHasErrors(['description']);
    }

    #[Test]
    public function it_validates_cod_max_length()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('machinery.store'), [
            'cod' => str_repeat('a', 256), // Più di 255 caratteri
            'description' => 'Test Description',
        ]);

        $response->assertSessionHasErrors(['cod']);
    }

    #[Test]
    public function it_validates_description_max_length()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('machinery.store'), [
            'cod' => 'MAC-001',
            'description' => str_repeat('a', 256), // Más de 255 caracteres
        ]);

        $response->assertSessionHasErrors(['description']);
    }

    #[Test]
    public function it_only_shows_active_machinery()
    {
        $this->actingAs($this->user);

        $active = Machinery::factory()->create(['removed' => false, 'cod' => 'MAC-ACTIVE']);
        $removed = Machinery::factory()->create(['removed' => true, 'cod' => 'MAC-REMOVED']);

        $response = $this->get(route('machinery.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->where('machinery.data', function ($data) use ($active) {
            $dataArray = is_object($data) && method_exists($data, 'toArray') ? $data->toArray() : (array) $data;
            $this->assertCount(1, $dataArray);
            $this->assertEquals($active->uuid, $dataArray[0]['uuid']);

            return true;
        })
        );
    }

    #[Test]
    public function it_paginates_machinery()
    {
        $this->actingAs($this->user);

        Machinery::factory()->count(20)->create(['removed' => false]);

        $response = $this->get(route('machinery.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->where('machinery.data', function ($data) {
            $dataArray = is_object($data) && method_exists($data, 'toArray') ? $data->toArray() : (array) $data;
            $this->assertCount(15, $dataArray);

            return true;
        })
            ->has('machinery.current_page')
            ->has('machinery.last_page')
        );
    }

    #[Test]
    public function it_handles_empty_search_results()
    {
        $this->actingAs($this->user);

        $response = $this->get(route('machinery.index', [
            'search' => 'NonExistentMachinery',
        ]));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->where('machinery.data', function ($data) {
            $dataArray = is_object($data) && method_exists($data, 'toArray') ? $data->toArray() : (array) $data;
            $this->assertCount(0, $dataArray);

            return true;
        })
        );
    }

    #[Test]
    public function it_loads_articles_in_show()
    {
        $this->actingAs($this->user);

        $machinery = Machinery::factory()->create();

        $response = $this->get(route('machinery.show', $machinery));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->has('machinery.articles')
        );
    }

    #[Test]
    public function it_validates_cod_max_length_on_update()
    {
        $this->actingAs($this->user);

        $machinery = Machinery::factory()->create();

        $response = $this->put(route('machinery.update', $machinery), [
            'cod' => str_repeat('a', 256),
            'description' => 'Test Description',
        ]);

        $response->assertSessionHasErrors(['cod']);
    }

    #[Test]
    public function it_validates_description_max_length_on_update()
    {
        $this->actingAs($this->user);

        $machinery = Machinery::factory()->create();

        $response = $this->put(route('machinery.update', $machinery), [
            'cod' => 'MAC-001',
            'description' => str_repeat('a', 256),
        ]);

        $response->assertSessionHasErrors(['description']);
    }
}
