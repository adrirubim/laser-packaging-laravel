<?php

namespace Database\Factories;

use App\Models\OfferActivity;
use Illuminate\Database\Eloquent\Factories\Factory;

class OfferActivityFactory extends Factory
{
    protected $model = OfferActivity::class;

    public function definition(): array
    {
        return [
            'uuid' => \Illuminate\Support\Str::uuid()->toString(),
            'name' => $this->faker->words(3, true),
            'removed' => false,
        ];
    }
}
