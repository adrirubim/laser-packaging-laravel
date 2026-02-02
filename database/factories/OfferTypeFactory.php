<?php

namespace Database\Factories;

use App\Models\OfferType;
use Illuminate\Database\Eloquent\Factories\Factory;

class OfferTypeFactory extends Factory
{
    protected $model = OfferType::class;

    public function definition(): array
    {
        return [
            'uuid' => \Illuminate\Support\Str::uuid()->toString(),
            'name' => $this->faker->words(3, true),
            'removed' => false,
        ];
    }
}
