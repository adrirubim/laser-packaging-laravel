<?php

namespace Tests\Unit\Repositories;

use App\Models\Article;
use App\Models\Offer;
use App\Repositories\ArticleRepository;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class ArticleRepositoryTest extends TestCase
{
    use RefreshDatabase;

    protected ArticleRepository $repository;

    protected function setUp(): void
    {
        parent::setUp();
        $this->repository = new ArticleRepository;
    }

    #[Test]
    public function it_returns_paginated_articles_for_index()
    {
        $offer = Offer::factory()->create(['removed' => false]);
        Article::factory()->count(3)->create(['offer_uuid' => $offer->uuid, 'removed' => false]);

        $request = Request::create('/articles', 'GET');
        $result = $this->repository->getForIndex($request);

        $this->assertInstanceOf(\Illuminate\Pagination\LengthAwarePaginator::class, $result);
        $this->assertCount(3, $result->items());
    }

    #[Test]
    public function it_filters_by_offer_uuid()
    {
        $offer1 = Offer::factory()->create(['removed' => false]);
        $offer2 = Offer::factory()->create(['removed' => false]);
        Article::factory()->create(['offer_uuid' => $offer1->uuid, 'cod_article_las' => 'ART1', 'removed' => false]);
        Article::factory()->create(['offer_uuid' => $offer2->uuid, 'cod_article_las' => 'ART2', 'removed' => false]);

        $request = Request::create('/articles', 'GET', ['offer_uuid' => $offer1->uuid]);
        $result = $this->repository->getForIndex($request);

        $this->assertCount(1, $result->items());
        $this->assertEquals('ART1', $result->items()[0]->cod_article_las);
    }

    #[Test]
    public function it_searches_by_cod_article_las()
    {
        $offer = Offer::factory()->create(['removed' => false]);
        Article::factory()->create(['offer_uuid' => $offer->uuid, 'cod_article_las' => 'LAS-001', 'removed' => false]);
        Article::factory()->create(['offer_uuid' => $offer->uuid, 'cod_article_las' => 'LAS-002', 'removed' => false]);

        $request = Request::create('/articles', 'GET', ['search' => 'LAS-001']);
        $result = $this->repository->getForIndex($request);

        $this->assertCount(1, $result->items());
        $this->assertEquals('LAS-001', $result->items()[0]->cod_article_las);
    }

    #[Test]
    public function it_returns_articles_for_select()
    {
        $offer = Offer::factory()->create(['removed' => false]);
        Article::factory()->create(['offer_uuid' => $offer->uuid, 'cod_article_las' => 'ART-A', 'removed' => false]);

        $result = $this->repository->getForSelect();

        $this->assertCount(1, $result);
        $this->assertEquals('ART-A', $result->first()->cod_article_las);
    }

    #[Test]
    public function it_returns_form_options_with_required_keys()
    {
        $options = $this->repository->getFormOptions();

        $this->assertIsArray($options);
        $this->assertArrayHasKey('offers', $options);
        $this->assertArrayHasKey('categories', $options);
        $this->assertArrayHasKey('palletTypes', $options);
        $this->assertArrayHasKey('materials', $options);
        $this->assertArrayHasKey('machinery', $options);
        $this->assertArrayHasKey('criticalIssues', $options);
        $this->assertArrayHasKey('packagingInstructions', $options);
        $this->assertArrayHasKey('operatingInstructions', $options);
        $this->assertArrayHasKey('palletizingInstructions', $options);
        $this->assertArrayHasKey('cqModels', $options);
        $this->assertArrayHasKey('palletSheets', $options);
        $this->assertArrayHasKey('lotAttributionList', $options);
        $this->assertArrayHasKey('expirationAttributionList', $options);
    }

    #[Test]
    public function it_caches_form_options()
    {
        $options1 = $this->repository->getFormOptions();
        $this->assertTrue(Cache::has('article_form_options'));

        $options2 = $this->repository->getFormOptions();
        $this->assertEquals($options1, $options2);
    }

    #[Test]
    public function it_clears_form_options_cache()
    {
        $this->repository->getFormOptions();
        $this->assertTrue(Cache::has('article_form_options'));

        $this->repository->clearFormOptionsCache();
        $this->assertFalse(Cache::has('article_form_options'));
    }

    #[Test]
    public function it_returns_article_for_edit_with_relationships()
    {
        $offer = Offer::factory()->create(['removed' => false]);
        $article = Article::factory()->create(['offer_uuid' => $offer->uuid, 'removed' => false]);

        $result = $this->repository->getForEdit($article);

        $this->assertInstanceOf(Article::class, $result);
        $this->assertTrue($result->relationLoaded('offer'));
        $this->assertTrue($result->relationLoaded('category'));
        $this->assertTrue($result->relationLoaded('palletType'));
    }

    #[Test]
    public function it_returns_null_for_source_article_when_uuid_is_null()
    {
        $result = $this->repository->getSourceArticleForDuplication(null);
        $this->assertNull($result);
    }

    #[Test]
    public function it_returns_source_article_for_duplication_with_relationships()
    {
        $offer = Offer::factory()->create(['removed' => false]);
        $article = Article::factory()->create(['offer_uuid' => $offer->uuid, 'cod_article_las' => 'DUP-ART', 'removed' => false]);

        $result = $this->repository->getSourceArticleForDuplication($article->uuid);

        $this->assertInstanceOf(Article::class, $result);
        $this->assertEquals('DUP-ART', $result->cod_article_las);
        $this->assertTrue($result->relationLoaded('materials'));
        $this->assertTrue($result->relationLoaded('machinery'));
    }
}
