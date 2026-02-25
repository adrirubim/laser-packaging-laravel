<?php

namespace Tests\Unit\Services;

use App\Models\Article;
use App\Models\Offer;
use App\Models\OfferLasFamily;
use App\Services\ArticleCodeService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class ArticleCodeServiceTest extends TestCase
{
    use RefreshDatabase;

    protected ArticleCodeService $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = new ArticleCodeService;
    }

    #[Test]
    public function it_generates_las_code_in_correct_format_and_starts_from_0001()
    {
        $family = OfferLasFamily::factory()->create([
            'code' => '31',
            'removed' => false,
        ]);

        $offer = Offer::factory()->create([
            'lasfamily_uuid' => $family->uuid,
            'removed' => false,
        ]);

        $code = $this->service->generateNextLAS($offer->uuid);

        $this->assertMatchesRegularExpression('/^LAS31\d{4}$/', $code);
        $this->assertStringEndsWith('0001', $code);
    }

    #[Test]
    public function it_generates_sequential_las_codes_for_same_family()
    {
        $family = OfferLasFamily::factory()->create([
            'code' => '31',
            'removed' => false,
        ]);

        $offer = Offer::factory()->create([
            'lasfamily_uuid' => $family->uuid,
            'removed' => false,
        ]);

        // Create existing articles with LAS codes for that family
        Article::factory()->create([
            'offer_uuid' => $offer->uuid,
            'cod_article_las' => 'LAS310001',
            'removed' => false,
        ]);

        Article::factory()->create([
            'offer_uuid' => $offer->uuid,
            'cod_article_las' => 'LAS310005',
            'removed' => false,
        ]);

        $code = $this->service->generateNextLAS($offer->uuid);

        // Must continue from max found (0005 → 0006)
        $this->assertSame('LAS310006', $code);
    }

    #[Test]
    public function it_throws_exception_if_offer_has_no_las_family()
    {
        $offer = Offer::factory()->create([
            'lasfamily_uuid' => null,
            'removed' => false,
        ]);

        $this->expectException(\Exception::class);
        $this->expectExceptionMessage(__('services.article_code.offer_no_las_family'));

        $this->service->generateNextLAS($offer->uuid);
    }

    #[Test]
    public function it_checks_if_las_code_exists_excluding_article_id()
    {
        $family = OfferLasFamily::factory()->create([
            'code' => '31',
            'removed' => false,
        ]);

        $offer = Offer::factory()->create([
            'lasfamily_uuid' => $family->uuid,
            'removed' => false,
        ]);

        $article = Article::factory()->create([
            'offer_uuid' => $offer->uuid,
            'cod_article_las' => 'LAS310010',
            'removed' => false,
        ]);

        $this->assertTrue($this->service->lasCodeExists('LAS310010'));
        $this->assertFalse($this->service->lasCodeExists('LAS310010', $article->id));
        $this->assertFalse($this->service->lasCodeExists('LAS310011'));
    }
}
