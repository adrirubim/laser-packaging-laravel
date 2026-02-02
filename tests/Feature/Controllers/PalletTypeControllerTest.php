<?php

namespace Tests\Feature\Controllers;

use App\Models\PalletType;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class PalletTypeControllerTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    #[Test]
    public function it_displays_index_page_with_pallet_types()
    {
        $this->actingAs($this->user);

        PalletType::factory()->create([
            'removed' => false,
            'cod' => 'PAL-001',
            'description' => 'Pallet Type 1',
        ]);

        $response = $this->get(route('pallet-types.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->has('palletTypes')
            ->has('palletTypes.data')
        );
    }

    #[Test]
    public function it_filters_pallet_types_by_search()
    {
        $this->actingAs($this->user);

        PalletType::factory()->create(['cod' => 'PAL-001', 'description' => 'Type Alpha']);
        PalletType::factory()->create(['cod' => 'PAL-002', 'description' => 'Type Beta']);

        $response = $this->get(route('pallet-types.index', ['search' => 'Alpha']));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->where('filters.search', 'Alpha')
        );
    }

    #[Test]
    public function it_shows_create_form()
    {
        $this->actingAs($this->user);

        $response = $this->get(route('pallet-types.create'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('PalletTypes/Create')
        );
    }

    #[Test]
    public function it_stores_new_pallet_type()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('pallet-types.store'), [
            'cod' => 'PAL-NEW',
            'description' => 'New Pallet Type',
        ]);

        $response->assertRedirect(route('pallet-types.index'));
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('pallettype', [
            'cod' => 'PAL-NEW',
            'description' => 'New Pallet Type',
            'removed' => false,
        ]);
    }

    #[Test]
    public function it_validates_unique_code()
    {
        $this->actingAs($this->user);

        PalletType::factory()->create(['cod' => 'PAL-001']);

        $response = $this->post(route('pallet-types.store'), [
            'cod' => 'PAL-001',
            'description' => 'Duplicate',
        ]);

        $response->assertSessionHasErrors(['cod']);
    }

    #[Test]
    public function it_shows_pallet_type()
    {
        $this->actingAs($this->user);

        $palletType = PalletType::factory()->create();

        $response = $this->get(route('pallet-types.show', $palletType));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('PalletTypes/Show')
            ->has('palletType')
        );
    }

    #[Test]
    public function it_shows_edit_form()
    {
        $this->actingAs($this->user);

        $palletType = PalletType::factory()->create();

        $response = $this->get(route('pallet-types.edit', $palletType));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('PalletTypes/Edit')
            ->has('palletType')
        );
    }

    #[Test]
    public function it_updates_pallet_type()
    {
        $this->actingAs($this->user);

        $palletType = PalletType::factory()->create([
            'cod' => 'PAL-OLD',
            'description' => 'Old Description',
        ]);

        $response = $this->put(route('pallet-types.update', $palletType), [
            'cod' => 'PAL-NEW',
            'description' => 'New Description',
        ]);

        $response->assertRedirect(route('pallet-types.index'));
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('pallettype', [
            'id' => $palletType->id,
            'cod' => 'PAL-NEW',
            'description' => 'New Description',
        ]);
    }

    #[Test]
    public function it_destroys_pallet_type()
    {
        $this->actingAs($this->user);

        $palletType = PalletType::factory()->create();

        $response = $this->delete(route('pallet-types.destroy', $palletType));

        $response->assertRedirect(route('pallet-types.index'));
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('pallettype', [
            'id' => $palletType->id,
            'removed' => true,
        ]);
    }

    #[Test]
    public function it_requires_cod()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('pallet-types.store'), [
            'description' => 'Test Description',
        ]);

        $response->assertSessionHasErrors(['cod']);
    }

    #[Test]
    public function it_requires_description()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('pallet-types.store'), [
            'cod' => 'PAL-001',
        ]);

        $response->assertSessionHasErrors(['description']);
    }

    #[Test]
    public function it_validates_cod_max_length()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('pallet-types.store'), [
            'cod' => str_repeat('a', 256), // Más de 255 caracteres
            'description' => 'Test Description',
        ]);

        $response->assertSessionHasErrors(['cod']);
    }

    #[Test]
    public function it_validates_description_max_length()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('pallet-types.store'), [
            'cod' => 'PAL-001',
            'description' => str_repeat('a', 256), // Más de 255 caracteres
        ]);

        $response->assertSessionHasErrors(['description']);
    }

    #[Test]
    public function it_only_shows_active_pallet_types()
    {
        $this->actingAs($this->user);

        $active = PalletType::factory()->create(['removed' => false, 'cod' => 'PAL-ACTIVE']);
        $removed = PalletType::factory()->create(['removed' => true, 'cod' => 'PAL-REMOVED']);

        $response = $this->get(route('pallet-types.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->where('palletTypes.data', function ($data) use ($active) {
            $dataArray = is_object($data) && method_exists($data, 'toArray') ? $data->toArray() : (array) $data;
            $this->assertCount(1, $dataArray);
            $this->assertEquals($active->uuid, $dataArray[0]['uuid']);

            return true;
        })
        );
    }

    #[Test]
    public function it_paginates_pallet_types()
    {
        $this->actingAs($this->user);

        PalletType::factory()->count(20)->create(['removed' => false]);

        $response = $this->get(route('pallet-types.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->where('palletTypes.data', function ($data) {
            $dataArray = is_object($data) && method_exists($data, 'toArray') ? $data->toArray() : (array) $data;
            $this->assertCount(15, $dataArray);

            return true;
        })
            ->has('palletTypes.current_page')
            ->has('palletTypes.last_page')
        );
    }

    #[Test]
    public function it_handles_empty_search_results()
    {
        $this->actingAs($this->user);

        $response = $this->get(route('pallet-types.index', [
            'search' => 'NonExistentPallet',
        ]));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->where('palletTypes.data', function ($data) {
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

        $palletType = PalletType::factory()->create();

        $response = $this->get(route('pallet-types.show', $palletType));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->has('palletType.articles')
        );
    }

    #[Test]
    public function it_validates_cod_max_length_on_update()
    {
        $this->actingAs($this->user);

        $palletType = PalletType::factory()->create();

        $response = $this->put(route('pallet-types.update', $palletType), [
            'cod' => str_repeat('a', 256),
            'description' => 'Test Description',
        ]);

        $response->assertSessionHasErrors(['cod']);
    }

    #[Test]
    public function it_validates_description_max_length_on_update()
    {
        $this->actingAs($this->user);

        $palletType = PalletType::factory()->create();

        $response = $this->put(route('pallet-types.update', $palletType), [
            'cod' => 'PAL-001',
            'description' => str_repeat('a', 256),
        ]);

        $response->assertSessionHasErrors(['description']);
    }
}
