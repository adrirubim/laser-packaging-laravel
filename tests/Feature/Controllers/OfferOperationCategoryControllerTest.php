<?php

namespace Tests\Feature\Controllers;

use App\Models\OfferOperationCategory;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class OfferOperationCategoryControllerTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    #[Test]
    public function it_displays_index_page_with_categories()
    {
        $this->actingAs($this->user);

        OfferOperationCategory::factory()->create(['removed' => false, 'name' => 'Categoria Test 1']);
        OfferOperationCategory::factory()->create(['removed' => false, 'name' => 'Categoria Test 2']);

        $response = $this->get('/offers/operation-categories');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->has('categories')->has('categories.data'));
    }

    #[Test]
    public function it_stores_new_category()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('offer-operation-categories.store'), [
            'uuid' => \Illuminate\Support\Str::uuid()->toString(),
            'code' => 'CAT-001',
            'name' => 'Nuova Categoria',
        ]);

        $response->assertRedirect(route('offer-operation-categories.index'));
        $response->assertSessionHas('success', 'Categoria operazione creata con successo.');
        $this->assertDatabaseHas('offeroperationcategory', ['code' => 'CAT-001', 'name' => 'Nuova Categoria', 'removed' => false]);
    }

    #[Test]
    public function it_shows_create_form()
    {
        $this->actingAs($this->user);

        $response = $this->get(route('offer-operation-categories.create'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('OfferOperationCategories/Create'));
    }

    #[Test]
    public function it_shows_category_details()
    {
        $this->actingAs($this->user);

        $category = OfferOperationCategory::factory()->create(['name' => 'Categoria Test', 'code' => 'CAT-001']);

        $response = $this->get(route('offer-operation-categories.show', $category));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('OfferOperationCategories/Show')
            ->has('category')
            ->where('category.name', 'Categoria Test')
        );
    }

    #[Test]
    public function it_shows_edit_form()
    {
        $this->actingAs($this->user);

        $category = OfferOperationCategory::factory()->create(['name' => 'Categoria Test', 'code' => 'CAT-001']);

        $response = $this->get(route('offer-operation-categories.edit', $category));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('OfferOperationCategories/Edit')
            ->has('category')
            ->where('category.name', 'Categoria Test')
        );
    }

    #[Test]
    public function it_updates_category()
    {
        $this->actingAs($this->user);

        $category = OfferOperationCategory::factory()->create(['code' => 'CAT-001', 'name' => 'Categoria Originale']);

        $response = $this->put(route('offer-operation-categories.update', $category), [
            'code' => 'CAT-002',
            'name' => 'Categoria Aggiornata',
        ]);

        $response->assertRedirect(route('offer-operation-categories.index'));
        $this->assertDatabaseHas('offeroperationcategory', ['id' => $category->id, 'name' => 'Categoria Aggiornata']);
    }

    #[Test]
    public function it_soft_deletes_category()
    {
        $this->actingAs($this->user);

        $category = OfferOperationCategory::factory()->create(['removed' => false]);

        $response = $this->delete(route('offer-operation-categories.destroy', $category));

        $response->assertRedirect(route('offer-operation-categories.index'));
        $category->refresh();
        $this->assertTrue($category->removed);
    }

    #[Test]
    public function it_filters_categories_by_search()
    {
        $this->actingAs($this->user);

        OfferOperationCategory::factory()->create(['removed' => false, 'code' => 'CAT-001', 'name' => 'Categoria Alpha']);
        OfferOperationCategory::factory()->create(['removed' => false, 'code' => 'CAT-002', 'name' => 'Categoria Beta']);

        $response = $this->get('/offers/operation-categories?search=Alpha');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->where('categories.data', function ($data) {
            $dataArray = is_object($data) && method_exists($data, 'toArray') ? $data->toArray() : $data;
            $this->assertCount(1, $dataArray);
            $this->assertEquals('Categoria Alpha', $dataArray[0]['name']);

            return true;
        })
        );
    }

    #[Test]
    public function it_filters_categories_by_code()
    {
        $this->actingAs($this->user);

        OfferOperationCategory::factory()->create(['removed' => false, 'code' => 'CAT-001', 'name' => 'Categoria Alpha']);
        OfferOperationCategory::factory()->create(['removed' => false, 'code' => 'CAT-002', 'name' => 'Categoria Beta']);

        $response = $this->get('/offers/operation-categories?search=CAT-001');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->where('categories.data', function ($data) {
            $dataArray = is_object($data) && method_exists($data, 'toArray') ? $data->toArray() : $data;
            $this->assertCount(1, $dataArray);
            $this->assertEquals('CAT-001', $dataArray[0]['code']);

            return true;
        })
        );
    }

    #[Test]
    public function it_paginates_categories()
    {
        $this->actingAs($this->user);

        OfferOperationCategory::factory()->count(20)->create(['removed' => false]);

        $response = $this->get('/offers/operation-categories');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->has('categories')
            ->where('categories.current_page', 1)
            ->where('categories.last_page', function ($lastPage) {
                $this->assertGreaterThan(1, $lastPage);

                return true;
            })
        );
    }

    #[Test]
    public function it_handles_empty_search_results()
    {
        $this->actingAs($this->user);

        OfferOperationCategory::factory()->create(['removed' => false, 'code' => 'CAT-001', 'name' => 'Categoria Test']);

        $response = $this->get('/offers/operation-categories?search=NonExistent');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->where('categories.data', [])
        );
    }

    #[Test]
    public function it_validates_required_fields_on_store()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('offer-operation-categories.store'), []);

        $response->assertSessionHasErrors(['uuid', 'code', 'name']);
    }

    #[Test]
    public function it_validates_code_max_length_on_store()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('offer-operation-categories.store'), [
            'uuid' => \Illuminate\Support\Str::uuid()->toString(),
            'code' => str_repeat('a', 256),
            'name' => 'Test Category',
        ]);

        $response->assertSessionHasErrors(['code']);
    }

    #[Test]
    public function it_validates_name_max_length_on_store()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('offer-operation-categories.store'), [
            'uuid' => \Illuminate\Support\Str::uuid()->toString(),
            'code' => 'CAT-001',
            'name' => str_repeat('a', 256),
        ]);

        $response->assertSessionHasErrors(['name']);
    }

    #[Test]
    public function it_validates_unique_code_on_store()
    {
        $this->actingAs($this->user);

        OfferOperationCategory::factory()->create(['code' => 'CAT-001', 'removed' => false]);

        $response = $this->post(route('offer-operation-categories.store'), [
            'uuid' => \Illuminate\Support\Str::uuid()->toString(),
            'code' => 'CAT-001',
            'name' => 'Test Category',
        ]);

        $response->assertSessionHasErrors(['code']);
    }

    #[Test]
    public function it_validates_uuid_format_on_store()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('offer-operation-categories.store'), [
            'uuid' => 'invalid-uuid',
            'code' => 'CAT-001',
            'name' => 'Test Category',
        ]);

        $response->assertSessionHasErrors(['uuid']);
    }

    #[Test]
    public function it_validates_unique_uuid_on_store()
    {
        $this->actingAs($this->user);

        $uuid = \Illuminate\Support\Str::uuid()->toString();
        OfferOperationCategory::factory()->create(['uuid' => $uuid]);

        $response = $this->post(route('offer-operation-categories.store'), [
            'uuid' => $uuid,
            'code' => 'CAT-001',
            'name' => 'Test Category',
        ]);

        $response->assertSessionHasErrors(['uuid']);
    }

    #[Test]
    public function it_validates_required_fields_on_update()
    {
        $this->actingAs($this->user);

        $category = OfferOperationCategory::factory()->create();

        $response = $this->put(route('offer-operation-categories.update', $category), []);

        $response->assertSessionHasErrors(['code', 'name']);
    }

    #[Test]
    public function it_validates_code_max_length_on_update()
    {
        $this->actingAs($this->user);

        $category = OfferOperationCategory::factory()->create();

        $response = $this->put(route('offer-operation-categories.update', $category), [
            'code' => str_repeat('a', 256),
            'name' => 'Test Category',
        ]);

        $response->assertSessionHasErrors(['code']);
    }

    #[Test]
    public function it_validates_name_max_length_on_update()
    {
        $this->actingAs($this->user);

        $category = OfferOperationCategory::factory()->create();

        $response = $this->put(route('offer-operation-categories.update', $category), [
            'code' => 'CAT-001',
            'name' => str_repeat('a', 256),
        ]);

        $response->assertSessionHasErrors(['name']);
    }

    #[Test]
    public function it_validates_unique_code_on_update()
    {
        $this->actingAs($this->user);

        $category1 = OfferOperationCategory::factory()->create(['code' => 'CAT-001', 'removed' => false]);
        $category2 = OfferOperationCategory::factory()->create(['code' => 'CAT-002', 'removed' => false]);

        $response = $this->put(route('offer-operation-categories.update', $category2), [
            'code' => 'CAT-001',
            'name' => 'Test Category',
        ]);

        $response->assertSessionHasErrors(['code']);
    }

    #[Test]
    public function it_loads_operations_relationship_on_show()
    {
        $this->actingAs($this->user);

        $category = OfferOperationCategory::factory()->create(['removed' => false]);

        $response = $this->get(route('offer-operation-categories.show', $category));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->has('category.operations')
        );
    }

    #[Test]
    public function it_only_shows_active_categories()
    {
        $this->actingAs($this->user);

        OfferOperationCategory::factory()->create(['removed' => false, 'code' => 'CAT-001', 'name' => 'Categoria Attiva']);
        OfferOperationCategory::factory()->create(['removed' => true, 'code' => 'CAT-002', 'name' => 'Categoria Eliminata']);

        $response = $this->get('/offers/operation-categories');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->where('categories.data', function ($data) {
            $dataArray = is_object($data) && method_exists($data, 'toArray') ? $data->toArray() : $data;
            $this->assertCount(1, $dataArray);
            $this->assertEquals('Categoria Attiva', $dataArray[0]['name']);

            return true;
        })
        );
    }
}
