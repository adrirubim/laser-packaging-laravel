<?php

namespace Tests\Feature\Controllers;

use App\Models\Article;
use App\Models\ArticleCategory;
use App\Models\ArticleIC;
use App\Models\ArticleIO;
use App\Models\ArticleIP;
use App\Models\CriticalIssue;
use App\Models\Machinery;
use App\Models\Material;
use App\Models\Offer;
use App\Models\OfferLasFamily;
use App\Models\PalletType;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class ArticleControllerTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

    protected Offer $offer;

    protected OfferLasFamily $lasFamily;

    protected PalletType $palletType;

    protected ArticleCategory $category;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();

        $this->lasFamily = OfferLasFamily::factory()->create([
            'code' => '31',
            'removed' => false,
        ]);

        $this->offer = Offer::factory()->create([
            'lasfamily_uuid' => $this->lasFamily->uuid,
            'removed' => false,
        ]);

        $this->palletType = PalletType::factory()->create(['removed' => false]);
        $this->category = ArticleCategory::factory()->create(['removed' => false]);
    }

    #[Test]
    public function it_generates_las_code_automatically_when_creating_article()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('articles.store'), [
            'offer_uuid' => $this->offer->uuid,
            'article_descr' => 'Test Article',
            'plan_packaging' => 10,
            'pallet_plans' => 1,
            'lot_attribution' => 0,
        ]);

        $response->assertRedirect(route('articles.index'));
        $response->assertSessionHas('success');

        $article = Article::latest()->first();
        $this->assertNotNull($article->cod_article_las);
        $this->assertStringStartsWith('LAS31', $article->cod_article_las);
        $this->assertMatchesRegularExpression('/^LAS31\d{4}$/', $article->cod_article_las);
    }

    #[Test]
    public function it_uses_provided_las_code_if_valid()
    {
        $this->actingAs($this->user);

        $lasCode = 'LAS310001';

        $response = $this->post(route('articles.store'), [
            'offer_uuid' => $this->offer->uuid,
            'cod_article_las' => $lasCode,
            'article_descr' => 'Test Article',
            'plan_packaging' => 10,
            'pallet_plans' => 1,
            'lot_attribution' => 0,
        ]);

        $response->assertRedirect(route('articles.index'));

        $article = Article::latest()->first();
        $this->assertEquals($lasCode, $article->cod_article_las);
    }

    #[Test]
    public function it_rejects_duplicate_las_code()
    {
        $this->actingAs($this->user);

        $lasCode = 'LAS310001';

        // Create first article
        Article::factory()->create([
            'offer_uuid' => $this->offer->uuid,
            'cod_article_las' => $lasCode,
            'removed' => false,
        ]);

        // Try to create second article with same code
        $response = $this->post(route('articles.store'), [
            'offer_uuid' => $this->offer->uuid,
            'cod_article_las' => $lasCode,
            'article_descr' => 'Test Article',
            'plan_packaging' => 10,
            'pallet_plans' => 1,
            'lot_attribution' => 0,
        ]);

        $response->assertSessionHasErrors(['cod_article_las']);
    }

    #[Test]
    public function it_syncs_many_to_many_relationships()
    {
        $this->actingAs($this->user);

        $material1 = Material::factory()->create(['removed' => false]);
        $material2 = Material::factory()->create(['removed' => false]);
        $machinery1 = Machinery::factory()->create(['removed' => false]);
        $criticalIssue1 = CriticalIssue::factory()->create(['removed' => false]);

        $response = $this->post(route('articles.store'), [
            'offer_uuid' => $this->offer->uuid,
            'article_descr' => 'Test Article',
            'plan_packaging' => 10,
            'pallet_plans' => 1,
            'lot_attribution' => 0,
            'materials' => [$material1->uuid, $material2->uuid],
            'machinery' => [['machinery_uuid' => $machinery1->uuid, 'value' => 'test']],
            'critical_issues' => [$criticalIssue1->uuid],
        ]);

        $response->assertRedirect(route('articles.index'));

        $article = Article::latest()->first();

        // Verify relationships
        $this->assertCount(2, $article->materials);
        $this->assertCount(1, $article->machinery);
        $this->assertCount(1, $article->criticalIssues);

        $this->assertTrue($article->materials->contains($material1));
        $this->assertTrue($article->materials->contains($material2));
        $this->assertTrue($article->machinery->contains($machinery1));
        $this->assertTrue($article->criticalIssues->contains($criticalIssue1));
    }

    #[Test]
    public function it_syncs_instruction_relationships()
    {
        $this->actingAs($this->user);

        $packagingInstruction = ArticleIC::factory()->create(['removed' => false]);
        $operatingInstruction = ArticleIO::factory()->create(['removed' => false]);
        $palletizingInstruction = ArticleIP::factory()->create(['removed' => false]);

        $response = $this->post(route('articles.store'), [
            'offer_uuid' => $this->offer->uuid,
            'article_descr' => 'Test Article',
            'plan_packaging' => 10,
            'pallet_plans' => 1,
            'lot_attribution' => 0,
            'packaging_instructions' => [$packagingInstruction->uuid],
            'operating_instructions' => [$operatingInstruction->uuid],
            'palletizing_instructions' => [$palletizingInstruction->uuid],
        ]);

        $response->assertRedirect(route('articles.index'));

        $article = Article::latest()->first();

        // Verify instruction relationships
        $this->assertCount(1, $article->packagingInstructions);
        $this->assertCount(1, $article->operatingInstructions);
        $this->assertCount(1, $article->palletizingInstructions);
    }

    #[Test]
    public function it_generates_sequential_las_codes_for_same_family()
    {
        $this->actingAs($this->user);

        // Create first article
        $response1 = $this->post(route('articles.store'), [
            'offer_uuid' => $this->offer->uuid,
            'article_descr' => 'First Article',
            'plan_packaging' => 10,
            'pallet_plans' => 1,
            'lot_attribution' => 0,
        ]);

        $article1 = Article::latest()->first();
        $firstCode = $article1->cod_article_las;

        // Create second article
        $response2 = $this->post(route('articles.store'), [
            'offer_uuid' => $this->offer->uuid,
            'article_descr' => 'Second Article',
            'plan_packaging' => 10,
            'pallet_plans' => 1,
            'lot_attribution' => 0,
        ]);

        $article2 = Article::where('id', '>', $article1->id)->first();
        $secondCode = $article2->cod_article_las;

        // Verify codes are sequential
        $this->assertStringStartsWith('LAS31', $firstCode);
        $this->assertStringStartsWith('LAS31', $secondCode);

        $firstProgressive = (int) substr($firstCode, -4);
        $secondProgressive = (int) substr($secondCode, -4);

        $this->assertEquals($firstProgressive + 1, $secondProgressive);
    }

    #[Test]
    public function it_requires_offer_with_las_family_for_code_generation()
    {
        $this->actingAs($this->user);

        // Create offer without LAS family
        $offerWithoutFamily = Offer::factory()->create([
            'lasfamily_uuid' => null,
            'removed' => false,
        ]);

        $response = $this->post(route('articles.store'), [
            'offer_uuid' => $offerWithoutFamily->uuid,
            'article_descr' => 'Test Article',
            'plan_packaging' => 10,
            'pallet_plans' => 1,
        ]);

        // Should fail because it cannot generate code without LAS family
        $response->assertSessionHasErrors();
    }

    #[Test]
    public function it_displays_index_page_with_articles()
    {
        $this->actingAs($this->user);

        $article1 = Article::factory()->create([
            'offer_uuid' => $this->offer->uuid,
            'removed' => false,
            'cod_article_las' => 'LAS310001',
            'article_descr' => 'Test Article 1',
        ]);

        $article2 = Article::factory()->create([
            'offer_uuid' => $this->offer->uuid,
            'removed' => false,
            'cod_article_las' => 'LAS310002',
            'article_descr' => 'Test Article 2',
        ]);

        $response = $this->get(route('articles.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('Articles/Index')
            ->has('articles')
            ->has('articles.data')
            ->has('offers')
            ->has('categories')
        );
    }

    #[Test]
    public function it_only_shows_active_articles_in_index()
    {
        $this->actingAs($this->user);

        $activeArticle = Article::factory()->create([
            'offer_uuid' => $this->offer->uuid,
            'removed' => false,
            'cod_article_las' => 'LAS310001',
        ]);

        $removedArticle = Article::factory()->create([
            'offer_uuid' => $this->offer->uuid,
            'removed' => true,
            'cod_article_las' => 'LAS310002',
        ]);

        $response = $this->get(route('articles.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->where('articles.data', function ($data) {
            $this->assertCount(1, $data);
            $this->assertEquals('LAS310001', $data[0]['cod_article_las']);

            return true;
        })
        );
    }

    #[Test]
    public function it_filters_articles_by_search_term()
    {
        $this->actingAs($this->user);

        $article1 = Article::factory()->create([
            'offer_uuid' => $this->offer->uuid,
            'removed' => false,
            'cod_article_las' => 'LAS310001',
            'article_descr' => 'Test Article',
        ]);

        $article2 = Article::factory()->create([
            'offer_uuid' => $this->offer->uuid,
            'removed' => false,
            'cod_article_las' => 'LAS310002',
            'article_descr' => 'Other Article',
        ]);

        $response = $this->get(route('articles.index', ['search' => 'Test']));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->where('articles.data', function ($data) {
            $this->assertCount(1, $data);
            $this->assertEquals('LAS310001', $data[0]['cod_article_las']);

            return true;
        })
        );
    }

    #[Test]
    public function it_filters_articles_by_offer_uuid()
    {
        $this->actingAs($this->user);

        $offer2 = Offer::factory()->create([
            'lasfamily_uuid' => $this->lasFamily->uuid,
            'removed' => false,
        ]);

        $article1 = Article::factory()->create([
            'offer_uuid' => $this->offer->uuid,
            'removed' => false,
            'cod_article_las' => 'LAS310001',
        ]);

        $article2 = Article::factory()->create([
            'offer_uuid' => $offer2->uuid,
            'removed' => false,
            'cod_article_las' => 'LAS310002',
        ]);

        $response = $this->get(route('articles.index', ['offer_uuid' => $this->offer->uuid]));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->where('articles.data', function ($data) {
            $this->assertCount(1, $data);
            $this->assertEquals('LAS310001', $data[0]['cod_article_las']);

            return true;
        })
        );
    }

    #[Test]
    public function it_filters_articles_by_category()
    {
        $this->actingAs($this->user);

        $category2 = ArticleCategory::factory()->create(['removed' => false]);

        $article1 = Article::factory()->create([
            'offer_uuid' => $this->offer->uuid,
            'article_category' => $this->category->uuid,
            'removed' => false,
            'cod_article_las' => 'LAS310001',
        ]);

        $article2 = Article::factory()->create([
            'offer_uuid' => $this->offer->uuid,
            'article_category' => $category2->uuid,
            'removed' => false,
            'cod_article_las' => 'LAS310002',
        ]);

        $response = $this->get(route('articles.index', ['article_category' => $this->category->uuid]));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->where('articles.data', function ($data) {
            $this->assertCount(1, $data);
            $this->assertEquals('LAS310001', $data[0]['cod_article_las']);

            return true;
        })
        );
    }

    #[Test]
    public function it_displays_create_form()
    {
        $this->actingAs($this->user);

        $response = $this->get(route('articles.create'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('Articles/Create')
            ->has('offers')
            ->has('categories')
            ->has('palletTypes')
            ->has('materials')
            ->has('machinery')
        );
    }

    #[Test]
    public function it_displays_show_page()
    {
        $this->actingAs($this->user);

        $article = Article::factory()->create([
            'offer_uuid' => $this->offer->uuid,
            'removed' => false,
            'cod_article_las' => 'LAS310001',
        ]);

        $response = $this->get(route('articles.show', $article));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('Articles/Show')
            ->has('article')
            ->where('article.cod_article_las', 'LAS310001')
        );
    }

    #[Test]
    public function it_displays_edit_form()
    {
        $this->actingAs($this->user);

        $article = Article::factory()->create([
            'offer_uuid' => $this->offer->uuid,
            'removed' => false,
            'cod_article_las' => 'LAS310001',
        ]);

        $response = $this->get(route('articles.edit', $article));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('Articles/Edit')
            ->has('article')
            ->has('offers')
            ->has('categories')
            ->has('palletTypes')
            ->has('materials')
            ->has('machinery')
        );
    }

    #[Test]
    public function it_updates_article_successfully()
    {
        $this->actingAs($this->user);

        $article = Article::factory()->create([
            'offer_uuid' => $this->offer->uuid,
            'removed' => false,
            'cod_article_las' => 'LAS310001',
            'article_descr' => 'Original Description',
        ]);

        $response = $this->put(route('articles.update', $article), [
            'offer_uuid' => $this->offer->uuid,
            'article_descr' => 'Updated Description',
            'plan_packaging' => 10,
            'pallet_plans' => 1,
            'lot_attribution' => 0,
        ]);

        $response->assertRedirect(route('articles.show', $article));
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('articles', [
            'id' => $article->id,
            'article_descr' => 'Updated Description',
        ]);
    }

    #[Test]
    public function it_updates_article_relationships()
    {
        $this->actingAs($this->user);

        $article = Article::factory()->create([
            'offer_uuid' => $this->offer->uuid,
            'removed' => false,
            'cod_article_las' => 'LAS310001',
        ]);

        $material1 = Material::factory()->create(['removed' => false]);
        $material2 = Material::factory()->create(['removed' => false]);

        $response = $this->put(route('articles.update', $article), [
            'offer_uuid' => $this->offer->uuid,
            'article_descr' => 'Test Article',
            'plan_packaging' => 10,
            'pallet_plans' => 1,
            'lot_attribution' => 0,
            'materials' => [$material1->uuid, $material2->uuid],
        ]);

        $response->assertRedirect(route('articles.show', $article));

        $article->refresh();
        $this->assertCount(2, $article->materials);
    }

    #[Test]
    public function it_deletes_article_successfully()
    {
        $this->actingAs($this->user);

        $article = Article::factory()->create([
            'offer_uuid' => $this->offer->uuid,
            'removed' => false,
            'cod_article_las' => 'LAS310001',
        ]);

        $articleId = $article->id;

        $response = $this->delete(route('articles.destroy', $article));

        $response->assertRedirect(route('articles.index'));
        $response->assertSessionHas('success');

        // Verify directly in database without using model (which may have scopes)
        $this->assertDatabaseHas('articles', [
            'id' => $articleId,
            'removed' => 1,
        ]);

        // Verify article no longer appears in active scope
        $this->assertNull(Article::active()->find($articleId));

        // Verify article exists without scope
        $deletedArticle = Article::withoutGlobalScopes()->find($articleId);
        $this->assertNotNull($deletedArticle);
        $this->assertTrue($deletedArticle->removed);
    }

    #[Test]
    public function it_prevents_deleting_article_with_orders()
    {
        $this->actingAs($this->user);

        $article = Article::factory()->create([
            'offer_uuid' => $this->offer->uuid,
            'removed' => false,
            'cod_article_las' => 'LAS310001',
        ]);

        // Create associated order
        $order = \App\Models\Order::factory()->create([
            'article_uuid' => $article->uuid,
            'removed' => false,
        ]);

        $response = $this->delete(route('articles.destroy', $article));

        $response->assertSessionHasErrors(['error']);

        $this->assertDatabaseHas('articles', [
            'id' => $article->id,
            'removed' => false,
        ]);
    }

    #[Test]
    public function it_returns_las_code_via_ajax()
    {
        $this->actingAs($this->user);

        $response = $this->get(route('articles.get-las-code', ['offer_uuid' => $this->offer->uuid]));

        $response->assertStatus(200);
        $response->assertJsonStructure(['las_code']);
        $this->assertStringStartsWith('LAS31', $response->json('las_code'));
    }

    #[Test]
    public function it_validates_offer_uuid_for_las_code_endpoint()
    {
        $this->actingAs($this->user);

        $response = $this->getJson(route('articles.get-las-code'));

        $response->assertStatus(422);
        $response->assertJsonStructure(['error', 'errors']);
    }

    #[Test]
    public function it_validates_required_fields_on_store()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('articles.store'), []);

        $response->assertSessionHasErrors(['offer_uuid', 'article_descr']);
    }

    #[Test]
    public function it_duplicates_article_with_all_relationships()
    {
        $this->actingAs($this->user);

        // Create source article with relationships
        $material1 = Material::factory()->create(['removed' => false]);
        $material2 = Material::factory()->create(['removed' => false]);
        $machinery1 = Machinery::factory()->create(['removed' => false]);
        $criticalIssue = CriticalIssue::factory()->create(['removed' => false]);
        $packagingInstruction = ArticleIC::factory()->create(['removed' => false]);
        $operatingInstruction = ArticleIO::factory()->create(['removed' => false]);
        $palletizingInstruction = ArticleIP::factory()->create(['removed' => false]);

        $sourceArticle = Article::factory()->create([
            'offer_uuid' => $this->offer->uuid,
            'article_category' => $this->category->uuid,
            'pallet_uuid' => $this->palletType->uuid,
            'removed' => false,
        ]);

        // Assign relationships to source article
        $sourceArticle->materials()->attach($material1->uuid, ['uuid' => \Illuminate\Support\Str::uuid(), 'removed' => false]);
        $sourceArticle->materials()->attach($material2->uuid, ['uuid' => \Illuminate\Support\Str::uuid(), 'removed' => false]);
        $sourceArticle->machinery()->attach($machinery1->uuid, ['uuid' => \Illuminate\Support\Str::uuid(), 'removed' => false]);
        $sourceArticle->criticalIssues()->attach($criticalIssue->uuid, ['uuid' => \Illuminate\Support\Str::uuid(), 'removed' => false]);
        $sourceArticle->packagingInstructions()->attach($packagingInstruction->uuid, ['uuid' => \Illuminate\Support\Str::uuid(), 'removed' => false]);
        $sourceArticle->operatingInstructions()->attach($operatingInstruction->uuid, ['uuid' => \Illuminate\Support\Str::uuid(), 'removed' => false]);
        $sourceArticle->palletizingInstructions()->attach($palletizingInstruction->uuid, ['uuid' => \Illuminate\Support\Str::uuid(), 'removed' => false]);

        $response = $this->post(route('articles.store'), [
            'offer_uuid' => $this->offer->uuid,
            'article_descr' => 'Articolo duplicato',
            'source_article_uuid' => $sourceArticle->uuid,
            'lot_attribution' => 0,
        ]);

        $response->assertRedirect(route('articles.index'));
        $response->assertSessionHas('success');

        // Verify new article was created
        $this->assertDatabaseHas('articles', [
            'article_descr' => 'Articolo duplicato',
            'offer_uuid' => $this->offer->uuid,
            'removed' => false,
        ]);

        $duplicatedArticle = Article::where('article_descr', 'Articolo duplicato')->first();
        $this->assertNotNull($duplicatedArticle);
        $this->assertNotEquals($sourceArticle->uuid, $duplicatedArticle->uuid);

        // Verify relationships were copied
        $this->assertEquals(2, $duplicatedArticle->materials()->count());
        $this->assertEquals(1, $duplicatedArticle->machinery()->count());
        $this->assertEquals(1, $duplicatedArticle->criticalIssues()->count());
        $this->assertEquals(1, $duplicatedArticle->packagingInstructions()->count());
        $this->assertEquals(1, $duplicatedArticle->operatingInstructions()->count());
        $this->assertEquals(1, $duplicatedArticle->palletizingInstructions()->count());
    }

    #[Test]
    public function it_copies_line_layout_file_when_duplicating_article()
    {
        $this->actingAs($this->user);

        // Create source article with line_layout
        $sourceArticle = Article::factory()->create([
            'offer_uuid' => $this->offer->uuid,
            'line_layout' => 'test-layout.pdf',
            'removed' => false,
        ]);

        // Create test directory and file
        $sourcePath = storage_path('app/line_layout/'.$sourceArticle->uuid.'/');
        if (! file_exists($sourcePath)) {
            mkdir($sourcePath, 0755, true);
        }
        file_put_contents($sourcePath.'test-layout.pdf', 'test content');

        $response = $this->post(route('articles.store'), [
            'offer_uuid' => $this->offer->uuid,
            'article_descr' => 'Articolo con layout copiato',
            'source_article_uuid' => $sourceArticle->uuid,
            'lot_attribution' => 0,
        ]);

        $response->assertRedirect(route('articles.index'));

        $duplicatedArticle = Article::where('article_descr', 'Articolo con layout copiato')->first();
        $this->assertNotNull($duplicatedArticle);
        $this->assertEquals('test-layout.pdf', $duplicatedArticle->line_layout);

        // Verify file was copied
        $targetPath = storage_path('app/line_layout/'.$duplicatedArticle->uuid.'/');
        $this->assertTrue(file_exists($targetPath.'test-layout.pdf'));
        $this->assertEquals('test content', file_get_contents($targetPath.'test-layout.pdf'));

        // Cleanup
        if (file_exists($targetPath.'test-layout.pdf')) {
            unlink($targetPath.'test-layout.pdf');
            rmdir($targetPath);
        }
        if (file_exists($sourcePath.'test-layout.pdf')) {
            unlink($sourcePath.'test-layout.pdf');
            rmdir($sourcePath);
        }
    }

    #[Test]
    public function it_uploads_line_layout_file_on_create()
    {
        $this->actingAs($this->user);

        $file = \Illuminate\Http\UploadedFile::fake()->create('test-layout.pdf', 100);

        $response = $this->post(route('articles.store'), [
            'offer_uuid' => $this->offer->uuid,
            'article_descr' => 'Articolo con layout',
            'line_layout_file' => $file,
            'lot_attribution' => 0,
        ]);

        $response->assertRedirect(route('articles.index'));

        $article = Article::where('article_descr', 'Articolo con layout')->first();
        $this->assertNotNull($article);
        $this->assertEquals('test-layout.pdf', $article->line_layout);

        // Verify file was saved
        $filePath = storage_path('app/line_layout/'.$article->uuid.'/test-layout.pdf');
        $this->assertTrue(file_exists($filePath));

        // Cleanup
        if (file_exists($filePath)) {
            unlink($filePath);
            rmdir(dirname($filePath));
        }
    }

    #[Test]
    public function it_uploads_line_layout_file_on_update()
    {
        $this->actingAs($this->user);

        $article = Article::factory()->create([
            'offer_uuid' => $this->offer->uuid,
            'removed' => false,
        ]);

        $file = \Illuminate\Http\UploadedFile::fake()->create('new-layout.pdf', 100);

        $response = $this->put(route('articles.update', $article), [
            'offer_uuid' => $this->offer->uuid,
            'article_descr' => $article->article_descr,
            'line_layout_file' => $file,
            'lot_attribution' => 0,
        ]);

        $response->assertRedirect(route('articles.show', $article));

        $article->refresh();
        $this->assertEquals('new-layout.pdf', $article->line_layout);

        // Verify file was saved
        $filePath = storage_path('app/line_layout/'.$article->uuid.'/new-layout.pdf');
        $this->assertTrue(file_exists($filePath));

        // Cleanup
        if (file_exists($filePath)) {
            unlink($filePath);
            rmdir(dirname($filePath));
        }
    }

    #[Test]
    public function it_downloads_line_layout_file()
    {
        $this->actingAs($this->user);

        $article = Article::factory()->create([
            'offer_uuid' => $this->offer->uuid,
            'line_layout' => 'test-download.pdf',
            'removed' => false,
        ]);

        // Create test file
        $filePath = storage_path('app/line_layout/'.$article->uuid.'/');
        if (! file_exists($filePath)) {
            mkdir($filePath, 0755, true);
        }
        file_put_contents($filePath.'test-download.pdf', 'test download content');

        $response = $this->get(route('articles.download-line-layout', $article));

        $response->assertStatus(200);
        $response->assertDownload('test-download.pdf');

        // Cleanup
        if (file_exists($filePath.'test-download.pdf')) {
            unlink($filePath.'test-download.pdf');
            rmdir($filePath);
        }
    }

    #[Test]
    public function it_returns_error_when_downloading_nonexistent_line_layout_file()
    {
        $this->actingAs($this->user);

        $article = Article::factory()->create([
            'offer_uuid' => $this->offer->uuid,
            'line_layout' => null,
            'removed' => false,
        ]);

        $response = $this->get(route('articles.download-line-layout', $article));

        $response->assertRedirect();
        $response->assertSessionHasErrors(['error']);
    }

    #[Test]
    public function it_validates_required_fields_on_update()
    {
        $this->actingAs($this->user);

        $article = Article::factory()->create([
            'offer_uuid' => $this->offer->uuid,
            'removed' => false,
        ]);

        $response = $this->put(route('articles.update', $article), []);

        $response->assertSessionHasErrors(['offer_uuid', 'article_descr']);
    }
}
