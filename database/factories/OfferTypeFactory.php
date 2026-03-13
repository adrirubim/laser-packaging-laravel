<?php

namespace Database\Factories;

use App\Models\OfferType;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class OfferTypeFactory extends Factory
{
    protected $model = OfferType::class;

    public function definition(): array
    {
        return [
            'uuid' => Str::uuid()->toString(),
            'name' => $this->faker->words(3, true),
            'removed' => false,
        ];
    }
}
