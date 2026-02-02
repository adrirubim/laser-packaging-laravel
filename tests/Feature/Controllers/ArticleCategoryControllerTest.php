<?php

namespace Tests\Feature\Controllers;

use App\Models\Article;
use App\Models\ArticleCategory;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class ArticleCategoryControllerTest extends TestCase
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

        $category1 = ArticleCategory::factory()->create([
            'removed' => false,
            'name' => 'Category 1',
        ]);

        $category2 = ArticleCategory::factory()->create([
            'removed' => false,
            'name' => 'Category 2',
        ]);

        $response = $this->get(route('article-categories.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('ArticleCategories/Index')
            ->has('categories')
            ->has('categories.data')
            ->where('categories.data', function ($data) {
                $this->assertCount(2, $data);
                $names = collect($data)->pluck('name')->toArray();
                $this->assertContains('Category 1', $names);
                $this->assertContains('Category 2', $names);

                return true;
            })
        );
    }

    #[Test]
    public function it_only_shows_active_categories_in_index()
    {
        $this->actingAs($this->user);

        $activeCategory = ArticleCategory::factory()->create([
            'removed' => false,
            'name' => 'Active Category',
        ]);

        $removedCategory = ArticleCategory::factory()->create([
            'removed' => true,
            'name' => 'Removed Category',
        ]);

        $response = $this->get(route('article-categories.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->where('categories.data', function ($data) {
            $this->assertCount(1, $data);
            $this->assertEquals('Active Category', $data[0]['name']);

            return true;
        })
        );
    }

    #[Test]
    public function it_filters_categories_by_search_term()
    {
        $this->actingAs($this->user);

        $category1 = ArticleCategory::factory()->create([
            'removed' => false,
            'name' => 'Test Category',
        ]);

        $category2 = ArticleCategory::factory()->create([
            'removed' => false,
            'name' => 'Other Category',
        ]);

        $response = $this->get(route('article-categories.index', ['search' => 'Test']));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->where('categories.data', function ($data) {
            $this->assertCount(1, $data);
            $this->assertEquals('Test Category', $data[0]['name']);

            return true;
        })
        );
    }

    #[Test]
    public function it_paginates_categories()
    {
        $this->actingAs($this->user);

        // Crear más de 15 categorías para forzar paginación
        ArticleCategory::factory()->count(20)->create(['removed' => false]);

        $response = $this->get(route('article-categories.index'));

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
    public function it_displays_create_form()
    {
        $this->actingAs($this->user);

        $response = $this->get(route('article-categories.create'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('ArticleCategories/Create')
        );
    }

    #[Test]
    public function it_creates_category_successfully()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('article-categories.store'), [
            'name' => 'New Category',
        ]);

        $response->assertRedirect(route('article-categories.index'));
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('articlecategory', [
            'name' => 'New Category',
            'removed' => false,
        ]);
    }

    #[Test]
    public function it_validates_required_fields_on_store()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('article-categories.store'), []);

        $response->assertSessionHasErrors(['name']);
    }

    #[Test]
    public function it_validates_name_max_length_on_store()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('article-categories.store'), [
            'name' => str_repeat('a', 256),
        ]);

        $response->assertSessionHasErrors(['name']);
    }

    #[Test]
    public function it_displays_show_page()
    {
        $this->actingAs($this->user);

        $category = ArticleCategory::factory()->create([
            'removed' => false,
            'name' => 'Test Category',
        ]);

        $response = $this->get(route('article-categories.show', $category));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('ArticleCategories/Show')
            ->has('category')
            ->where('category.name', 'Test Category')
        );
    }

    #[Test]
    public function it_loads_articles_relationship_on_show()
    {
        $this->actingAs($this->user);

        $category = ArticleCategory::factory()->create(['removed' => false]);
        $offer = \App\Models\Offer::factory()->create(['removed' => false]);

        $article = Article::factory()->create([
            'offer_uuid' => $offer->uuid,
            'article_category' => $category->uuid,
            'removed' => false,
        ]);

        $response = $this->get(route('article-categories.show', $category));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->has('category.articles')
            ->where('category.articles', function ($articles) {
                $this->assertCount(1, $articles);

                return true;
            })
        );
    }

    #[Test]
    public function it_displays_edit_form()
    {
        $this->actingAs($this->user);

        $category = ArticleCategory::factory()->create([
            'removed' => false,
            'name' => 'Test Category',
        ]);

        $response = $this->get(route('article-categories.edit', $category));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('ArticleCategories/Edit')
            ->has('category')
            ->where('category.name', 'Test Category')
        );
    }

    #[Test]
    public function it_updates_category_successfully()
    {
        $this->actingAs($this->user);

        $category = ArticleCategory::factory()->create([
            'removed' => false,
            'name' => 'Original Name',
        ]);

        $response = $this->put(route('article-categories.update', $category), [
            'name' => 'Updated Name',
        ]);

        $response->assertRedirect(route('article-categories.index'));
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('articlecategory', [
            'id' => $category->id,
            'name' => 'Updated Name',
        ]);
    }

    #[Test]
    public function it_validates_required_fields_on_update()
    {
        $this->actingAs($this->user);

        $category = ArticleCategory::factory()->create(['removed' => false]);

        $response = $this->put(route('article-categories.update', $category), []);

        $response->assertSessionHasErrors(['name']);
    }

    #[Test]
    public function it_validates_name_max_length_on_update()
    {
        $this->actingAs($this->user);

        $category = ArticleCategory::factory()->create(['removed' => false]);

        $response = $this->put(route('article-categories.update', $category), [
            'name' => str_repeat('a', 256),
        ]);

        $response->assertSessionHasErrors(['name']);
    }

    #[Test]
    public function it_deletes_category_successfully()
    {
        $this->actingAs($this->user);

        $category = ArticleCategory::factory()->create([
            'removed' => false,
            'name' => 'Test Category',
        ]);

        $response = $this->delete(route('article-categories.destroy', $category));

        $response->assertRedirect(route('article-categories.index'));
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('articlecategory', [
            'id' => $category->id,
            'removed' => true,
        ]);
    }

    #[Test]
    public function it_only_allows_accessing_active_categories()
    {
        $this->actingAs($this->user);

        $removedCategory = ArticleCategory::factory()->create([
            'removed' => true,
        ]);

        $response = $this->get(route('article-categories.show', $removedCategory));

        $response->assertStatus(404);
    }
}
