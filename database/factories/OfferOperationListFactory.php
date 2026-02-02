<?php

namespace Database\Factories;

use App\Models\Offer;
use App\Models\OfferOperation;
use App\Models\OfferOperationList;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\OfferOperationList>
 */
class OfferOperationListFactory extends Factory
{
    protected $model = OfferOperationList::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'uuid' => \Illuminate\Support\Str::uuid()->toString(),
            'offer_uuid' => fn () => Offer::factory()->create()->uuid,
            'offeroperation_uuid' => fn () => OfferOperation::factory()->create()->uuid,
            'num_op' => $this->faker->randomFloat(2, 0.1, 100),
            'removed' => false,
        ];
    }
}
