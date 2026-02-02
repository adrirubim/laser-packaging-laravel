<?php

namespace Database\Factories;

use App\Models\OfferSeasonality;
use Illuminate\Database\Eloquent\Factories\Factory;

class OfferSeasonalityFactory extends Factory
{
    protected $model = OfferSeasonality::class;

    public function definition(): array
    {
        return [
            'uuid' => \Illuminate\Support\Str::uuid()->toString(),
            'name' => $this->faker->words(3, true),
            'removed' => false,
        ];
    }
}
