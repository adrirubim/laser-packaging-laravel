<?php

namespace Database\Factories;

use App\Models\OfferOperationCategory;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\OfferOperationCategory>
 */
class OfferOperationCategoryFactory extends Factory
{
    protected $model = OfferOperationCategory::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'uuid' => \Illuminate\Support\Str::uuid()->toString(),
            'code' => $this->faker->unique()->bothify('CAT-???'),
            'name' => $this->faker->words(3, true),
            'removed' => false,
        ];
    }
}
