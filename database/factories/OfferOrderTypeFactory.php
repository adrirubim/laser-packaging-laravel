<?php

namespace Database\Factories;

use App\Models\OfferOrderType;
use Illuminate\Database\Eloquent\Factories\Factory;

class OfferOrderTypeFactory extends Factory
{
    protected $model = OfferOrderType::class;

    public function definition(): array
    {
        return [
            'uuid' => \Illuminate\Support\Str::uuid()->toString(),
            'code' => $this->faker->unique()->bothify('OT-???'),
            'name' => $this->faker->words(3, true),
            'removed' => false,
        ];
    }
}
