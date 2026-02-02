<?php

namespace Database\Factories;

use App\Models\OfferLsResource;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\OfferLsResource>
 */
class OfferLsResourceFactory extends Factory
{
    protected $model = OfferLsResource::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'uuid' => \Illuminate\Support\Str::uuid()->toString(),
            'code' => $this->faker->unique()->bothify('LSR-???'),
            'name' => $this->faker->words(3, true),
            'removed' => false,
        ];
    }
}
