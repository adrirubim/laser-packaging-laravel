<?php

namespace Database\Factories;

use App\Models\OfferSector;
use Illuminate\Database\Eloquent\Factories\Factory;

class OfferSectorFactory extends Factory
{
    protected $model = OfferSector::class;

    public function definition(): array
    {
        return [
            'uuid' => \Illuminate\Support\Str::uuid()->toString(),
            'name' => $this->faker->words(3, true),
            'removed' => false,
        ];
    }
}
