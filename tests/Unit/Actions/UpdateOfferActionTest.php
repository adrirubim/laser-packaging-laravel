<?php

namespace Tests\Unit\Actions;

use App\Actions\UpdateOfferAction;
use App\Models\Offer;
use App\Models\OfferOperation;
use App\Models\OfferOperationList;
use App\Repositories\ArticleRepository;
use App\Repositories\OrderRepository;
use App\Services\OfferNumberService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class UpdateOfferActionTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_returns_error_when_offer_number_conflicts_with_another_offer()
    {
        $existing = Offer::factory()->create([
            'offer_number' => 'OFF-EXISTING',
        ]);

        $offerToUpdate = Offer::factory()->create([
            'offer_number' => 'OFF-ORIGINAL',
        ]);

        /** @var UpdateOfferAction $action */
        $action = $this->app->make(UpdateOfferAction::class);

        $result = $action->execute($offerToUpdate, [
            'offer_number' => $existing->offer_number,
        ]);

        $this->assertIsArray($result);
        $this->assertTrue($result['error']);
        $this->assertSame('offer_number', $result['field']);
        $this->assertNotEmpty($result['message']);
    }

    #[Test]
    public function it_updates_operations_and_marks_removed_ones()
    {
        $offer = Offer::factory()->create([
            'offer_number' => 'OFF-OPS',
        ]);

        $operationA = OfferOperation::factory()->create();
        $operationB = OfferOperation::factory()->create();

        // Operación existente vinculada al offer
        $existingList = OfferOperationList::factory()->create([
            'offer_uuid' => $offer->uuid,
            'offeroperation_uuid' => $operationA->uuid,
            'num_op' => 1,
            'removed' => false,
        ]);

        // Fake simple para no depender de la lógica real de servicios/repos
        $fakeNumberService = new class extends OfferNumberService
        {
            public function __construct() {}
        };
        $this->app->instance(OfferNumberService::class, $fakeNumberService);
        $this->app->instance(ArticleRepository::class, $this->createMock(ArticleRepository::class));
        $this->app->instance(OrderRepository::class, $this->createMock(OrderRepository::class));

        /** @var UpdateOfferAction $action */
        $action = $this->app->make(UpdateOfferAction::class);

        $result = $action->execute($offer, [
            'offer_number' => $offer->offer_number,
            'operations' => [
                [
                    'offeroperation_uuid' => $operationA->uuid,
                    'num_op' => 2,
                ],
                [
                    'offeroperation_uuid' => $operationB->uuid,
                    'num_op' => 3,
                ],
            ],
        ]);

        $this->assertInstanceOf(Offer::class, $result);

        $this->assertEquals(2, OfferOperationList::where('offer_uuid', $offer->uuid)->where('removed', false)->count());
        $this->assertTrue($existingList->fresh()->removed === false);
    }
}
