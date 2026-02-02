<?php

namespace Tests\Feature\Controllers;

use App\Models\Material;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class MaterialControllerTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    #[Test]
    public function it_displays_index_page_with_materials()
    {
        $this->actingAs($this->user);

        Material::factory()->create([
            'removed' => false,
            'cod' => 'MAT-001',
            'description' => 'Material 1',
        ]);

        $response = $this->get(route('materials.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->has('materials')
            ->has('materials.data')
        );
    }

    #[Test]
    public function it_filters_materials_by_search()
    {
        $this->actingAs($this->user);

        Material::factory()->create(['cod' => 'MAT-001', 'description' => 'Material Alpha']);
        Material::factory()->create(['cod' => 'MAT-002', 'description' => 'Material Beta']);

        $response = $this->get(route('materials.index', ['search' => 'Alpha']));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->where('filters.search', 'Alpha')
        );
    }

    #[Test]
    public function it_shows_create_form()
    {
        $this->actingAs($this->user);

        $response = $this->get(route('materials.create'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('Materials/Create')
        );
    }

    #[Test]
    public function it_stores_new_material()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('materials.store'), [
            'cod' => 'MAT-NEW',
            'description' => 'New Material',
        ]);

        $response->assertRedirect(route('materials.index'));
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('materials', [
            'cod' => 'MAT-NEW',
            'description' => 'New Material',
            'removed' => false,
        ]);
    }

    #[Test]
    public function it_validates_unique_code()
    {
        $this->actingAs($this->user);

        Material::factory()->create(['cod' => 'MAT-001']);

        $response = $this->post(route('materials.store'), [
            'cod' => 'MAT-001',
            'description' => 'Duplicate',
        ]);

        $response->assertSessionHasErrors(['cod']);
    }

    #[Test]
    public function it_shows_material()
    {
        $this->actingAs($this->user);

        $material = Material::factory()->create();

        $response = $this->get(route('materials.show', $material));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('Materials/Show')
            ->has('material')
        );
    }

    #[Test]
    public function it_shows_edit_form()
    {
        $this->actingAs($this->user);

        $material = Material::factory()->create();

        $response = $this->get(route('materials.edit', $material));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('Materials/Edit')
            ->has('material')
        );
    }

    #[Test]
    public function it_updates_material()
    {
        $this->actingAs($this->user);

        $material = Material::factory()->create([
            'cod' => 'MAT-OLD',
            'description' => 'Old Description',
        ]);

        $response = $this->put(route('materials.update', $material), [
            'cod' => 'MAT-NEW',
            'description' => 'New Description',
        ]);

        $response->assertRedirect(route('materials.index'));
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('materials', [
            'id' => $material->id,
            'cod' => 'MAT-NEW',
            'description' => 'New Description',
        ]);
    }

    #[Test]
    public function it_destroys_material()
    {
        $this->actingAs($this->user);

        $material = Material::factory()->create();

        $response = $this->delete(route('materials.destroy', $material));

        $response->assertRedirect(route('materials.index'));
        $response->assertSessionHas('success');

        $material->refresh();
        $this->assertTrue($material->removed);

        $this->assertDatabaseHas('materials', [
            'id' => $material->id,
            'removed' => true,
        ]);
    }

    #[Test]
    public function it_requires_cod()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('materials.store'), [
            'description' => 'Test Description',
        ]);

        $response->assertSessionHasErrors(['cod']);
    }

    #[Test]
    public function it_requires_description()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('materials.store'), [
            'cod' => 'MAT-001',
        ]);

        $response->assertSessionHasErrors(['description']);
    }

    #[Test]
    public function it_validates_cod_max_length()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('materials.store'), [
            'cod' => str_repeat('a', 256), // Più di 255 caratteri
            'description' => 'Test Description',
        ]);

        $response->assertSessionHasErrors(['cod']);
    }

    #[Test]
    public function it_validates_description_max_length()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('materials.store'), [
            'cod' => 'MAT-001',
            'description' => str_repeat('a', 256), // Più di 255 caratteri
        ]);

        $response->assertSessionHasErrors(['description']);
    }

    #[Test]
    public function it_only_shows_active_materials()
    {
        $this->actingAs($this->user);

        $active = Material::factory()->create(['removed' => false, 'cod' => 'MAT-ACTIVE']);
        $removed = Material::factory()->create(['removed' => true, 'cod' => 'MAT-REMOVED']);

        $response = $this->get(route('materials.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->where('materials.data', function ($data) use ($active) {
            $dataArray = is_object($data) && method_exists($data, 'toArray') ? $data->toArray() : (array) $data;
            $this->assertCount(1, $dataArray);
            $this->assertEquals($active->uuid, $dataArray[0]['uuid']);

            return true;
        })
        );
    }

    #[Test]
    public function it_paginates_materials()
    {
        $this->actingAs($this->user);

        Material::factory()->count(20)->create(['removed' => false]);

        $response = $this->get(route('materials.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->where('materials.data', function ($data) {
            $dataArray = is_object($data) && method_exists($data, 'toArray') ? $data->toArray() : (array) $data;
            $this->assertCount(15, $dataArray);

            return true;
        })
            ->has('materials.current_page')
            ->has('materials.last_page')
        );
    }

    #[Test]
    public function it_handles_empty_search_results()
    {
        $this->actingAs($this->user);

        $response = $this->get(route('materials.index', [
            'search' => 'NonExistentMaterial',
        ]));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->where('materials.data', function ($data) {
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

        $material = Material::factory()->create();

        $response = $this->get(route('materials.show', $material));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->has('material.articles')
        );
    }

    #[Test]
    public function it_validates_cod_max_length_on_update()
    {
        $this->actingAs($this->user);

        $material = Material::factory()->create();

        $response = $this->put(route('materials.update', $material), [
            'cod' => str_repeat('a', 256),
            'description' => 'Test Description',
        ]);

        $response->assertSessionHasErrors(['cod']);
    }

    #[Test]
    public function it_validates_description_max_length_on_update()
    {
        $this->actingAs($this->user);

        $material = Material::factory()->create();

        $response = $this->put(route('materials.update', $material), [
            'cod' => 'MAT-001',
            'description' => str_repeat('a', 256),
        ]);

        $response->assertSessionHasErrors(['description']);
    }
}
