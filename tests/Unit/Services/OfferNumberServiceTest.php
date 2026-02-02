<?php

namespace Tests\Unit\Services;

use App\Models\Offer;
use App\Services\OfferNumberService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class OfferNumberServiceTest extends TestCase
{
    use RefreshDatabase;

    protected OfferNumberService $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = new OfferNumberService;
    }

    #[Test]
    public function it_generates_offer_number_in_correct_format()
    {
        $number = $this->service->generateNext();

        $this->assertMatchesRegularExpression('/^\d{4}_\d{3}_\d{2}_[A-Z]$/', $number);
        $this->assertStringStartsWith(date('Y'), $number);
    }

    #[Test]
    public function it_uses_default_subversion_and_suffix()
    {
        $number = $this->service->generateNext();

        $parts = explode('_', $number);
        $this->assertCount(4, $parts);
        $this->assertEquals('01', $parts[2]); // Subversión default
        $this->assertEquals('A', $parts[3]); // Sufijo default
    }

    #[Test]
    public function it_accepts_custom_subversion_and_suffix()
    {
        $number = $this->service->generateNext('02', 'B');

        $parts = explode('_', $number);
        $this->assertEquals('02', $parts[2]);
        $this->assertEquals('B', $parts[3]);
    }

    #[Test]
    public function it_generates_sequential_numbers()
    {
        $first = $this->service->generateNext();

        Offer::factory()->create([
            'offer_number' => $first,
            'removed' => false,
        ]);

        $second = $this->service->generateNext();

        $this->assertNotEquals($first, $second);

        // Extraer el número progresivo
        $firstParts = explode('_', $first);
        $secondParts = explode('_', $second);

        $firstProgressive = (int) $firstParts[1];
        $secondProgressive = (int) $secondParts[1];

        $this->assertEquals($firstProgressive + 1, $secondProgressive);
    }

    #[Test]
    public function it_starts_from_001_when_no_offers_exist()
    {
        $number = $this->service->generateNext();

        $parts = explode('_', $number);
        $progressive = (int) $parts[1];
        $this->assertEquals(1, $progressive);
    }

    #[Test]
    public function it_validates_uniqueness()
    {
        $number = $this->service->generateNext();

        Offer::factory()->create([
            'offer_number' => $number,
            'removed' => false,
        ]);

        $this->assertTrue($this->service->exists($number));
        $this->assertFalse($this->service->exists('2025_999_01_A'));
    }

    #[Test]
    public function it_excludes_current_offer_in_uniqueness_check()
    {
        $offer = Offer::factory()->create([
            'offer_number' => '2025_001_01_A',
            'removed' => false,
        ]);

        $this->assertFalse($this->service->exists('2025_001_01_A', $offer->id));
        $this->assertTrue($this->service->exists('2025_001_01_A'));
    }

    #[Test]
    public function it_only_considers_active_offers()
    {
        $number = '2025_001_01_A';

        Offer::factory()->create([
            'offer_number' => $number,
            'removed' => true,
        ]);

        $this->assertFalse($this->service->exists($number));
    }
}
