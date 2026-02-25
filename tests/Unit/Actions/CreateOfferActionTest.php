<?php

namespace Tests\Unit\Actions;

use App\Actions\CreateOfferAction;
use App\Models\Offer;
use App\Services\OfferNumberService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class CreateOfferActionTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_returns_error_when_offer_number_already_exists()
    {
        // Arrange: create existing offer with concrete number
        $existing = Offer::factory()->create([
            'offer_number' => 'OFF-123',
        ]);

        // Act: run the Action with the same number
        /** @var CreateOfferAction $action */
        $action = $this->app->make(CreateOfferAction::class);

        $result = $action->execute([
            'offer_number' => $existing->offer_number,
            'customer_uuid' => $existing->customer_uuid,
        ]);

        // Assert: Action returns coherent error array
        $this->assertIsArray($result);
        $this->assertTrue($result['error']);
        $this->assertSame('offer_number', $result['field']);
        $this->assertNotEmpty($result['message']);
    }

    #[Test]
    public function it_generates_offer_number_when_missing()
    {
        // Arrange: mock numbering service that always returns same value
        $fakeService = new class extends OfferNumberService
        {
            public function __construct() {}

            public function generateNext(?string $subVersion = null, ?string $suffix = null): string
            {
                return 'OFF-TEST-0001';
            }
        };

        $this->app->instance(OfferNumberService::class, $fakeService);

        /** @var CreateOfferAction $action */
        $action = $this->app->make(CreateOfferAction::class);

        // Act
        $result = $action->execute([
            'customer_uuid' => Offer::factory()->make()->customer_uuid,
            // offer_number omitted to force generateNext()
        ]);

        // Assert
        $this->assertInstanceOf(Offer::class, $result);
        $this->assertSame('OFF-TEST-0001', $result->offer_number);
    }
}
