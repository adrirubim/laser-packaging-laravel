<?php

namespace Database\Factories;

use App\Models\OfferTypeOrder;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\OfferTypeOrder>
 */
class OfferTypeOrderFactory extends Factory
{
    protected $model = OfferTypeOrder::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'uuid' => \Illuminate\Support\Str::uuid()->toString(),
            'code' => $this->faker->unique()->bothify('OT-###'),
            'name' => $this->faker->words(3, true),
            'removed' => false,
        ];
    }
}
