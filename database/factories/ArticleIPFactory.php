<?php

namespace Database\Factories;

use App\Models\ArticleIP;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ArticleIP>
 */
class ArticleIPFactory extends Factory
{
    protected $model = ArticleIP::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'uuid' => \Illuminate\Support\Str::uuid()->toString(),
            'code' => $this->faker->unique()->bothify('IP-???'),
            // Siempre generar todos los campos
            'number' => $this->faker->numerify('####'),
            'length_cm' => $this->faker->randomFloat(2, 10, 200),
            'depth_cm' => $this->faker->randomFloat(2, 10, 200),
            'height_cm' => $this->faker->randomFloat(2, 10, 200),
            'volume_dmc' => $this->faker->randomFloat(2, 1, 1000),
            'plan_packaging' => $this->faker->numberBetween(1, 100),
            'pallet_plans' => $this->faker->numberBetween(1, 10),
            'qty_pallet' => $this->faker->numberBetween(1, 1000),
            'units_per_neck' => $this->faker->numberBetween(1, 100),
            'units_pallet' => $this->faker->numberBetween(1, 10000),
            'interlayer_every_floors' => $this->faker->numberBetween(0, 10),
            'filename' => $this->faker->word().'.pdf',
            'removed' => false,
        ];
    }
}
