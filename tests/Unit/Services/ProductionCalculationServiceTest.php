<?php

namespace Tests\Unit\Services;

use App\Models\Offer;
use App\Models\OfferOperation;
use App\Models\OfferOperationList;
use App\Services\ProductionCalculationService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class ProductionCalculationServiceTest extends TestCase
{
    use RefreshDatabase;

    protected ProductionCalculationService $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = new ProductionCalculationService;
    }

    #[Test]
    public function it_calculates_production_time_correctly()
    {
        $offer = Offer::factory()->create([
            'piece' => 10,
            'removed' => false,
        ]);

        $category = \App\Models\OfferOperationCategory::factory()->create([
            'removed' => false,
        ]);

        $operation = OfferOperation::factory()->create([
            'category_uuid' => $category->uuid,
            'secondi_operazione' => 5.0,
            'removed' => false,
        ]);

        // Create operation with 5 seconds per operation, 2 operations
        OfferOperationList::factory()->create([
            'offer_uuid' => $offer->uuid,
            'offeroperation_uuid' => $operation->uuid,
            'num_op' => 2,
            'removed' => false,
        ]);

        $result = $this->service->calculateProductionTime($offer->uuid);

        $this->assertIsArray($result);
        $this->assertArrayHasKey('total_seconds', $result);
        $this->assertArrayHasKey('unexpected_seconds', $result);
        $this->assertArrayHasKey('theoretical_time', $result);
        $this->assertArrayHasKey('production_time_cfz', $result);
        $this->assertArrayHasKey('production_average_cfz', $result);
        $this->assertArrayHasKey('production_average_pz', $result);

        // Verify calculations: 5 seconds * 2 operations = 10 seconds
        $this->assertEquals(10.0, $result['total_seconds']);
        // Unexpected: 10 * 0.05 = 0.5
        $this->assertEquals(0.5, $result['unexpected_seconds']);
        // Theoretical time: 10 + 0.5 = 10.5
        $this->assertEquals(10.5, $result['theoretical_time']);
    }

    #[Test]
    public function it_throws_exception_when_offer_has_no_operations()
    {
        $offer = Offer::factory()->create([
            'piece' => 10,
            'removed' => false,
        ]);

        $this->expectException(\Exception::class);
        $this->expectExceptionMessage(__('services.production_calculation.offer_no_operations'));

        $this->service->calculateProductionTime($offer->uuid);
    }
}
