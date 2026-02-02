<?php

namespace Database\Factories;

use App\Models\OfferOrderState;
use Illuminate\Database\Eloquent\Factories\Factory;

class OfferOrderStateFactory extends Factory
{
    protected $model = OfferOrderState::class;

    public function definition(): array
    {
        return [
            'uuid' => \Illuminate\Support\Str::uuid()->toString(),
            'name' => $this->faker->unique()->words(2, true),
            'sorting' => $this->faker->numberBetween(1, 100),
            'initial' => false,
            'production' => false,
            'removed' => false,
        ];
    }
}
