<?php

namespace Database\Factories;

use App\Models\OfferLasFamily;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\OfferLasFamily>
 */
class OfferLasFamilyFactory extends Factory
{
    protected $model = OfferLasFamily::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'uuid' => \Illuminate\Support\Str::uuid()->toString(),
            'code' => $this->faker->unique()->bothify('LAS-???'),
            'name' => $this->faker->words(3, true),
            'removed' => false,
        ];
    }
}
