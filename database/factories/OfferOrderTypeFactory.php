<?php

namespace Database\Factories;

use App\Models\OfferOrderType;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class OfferOrderTypeFactory extends Factory
{
    protected $model = OfferOrderType::class;

    public function definition(): array
    {
        return [
            'uuid' => Str::uuid()->toString(),
            'code' => $this->faker->unique()->bothify('OT-???'),
            'name' => $this->faker->words(3, true),
            'removed' => false,
        ];
    }
}
