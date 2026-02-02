<?php

namespace Database\Factories;

use App\Models\OfferLasWorkLine;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\OfferLasWorkLine>
 */
class OfferLasWorkLineFactory extends Factory
{
    protected $model = OfferLasWorkLine::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'uuid' => \Illuminate\Support\Str::uuid()->toString(),
            'code' => $this->faker->unique()->bothify('LWL-???'),
            'name' => $this->faker->words(3, true),
            'removed' => false,
        ];
    }
}
