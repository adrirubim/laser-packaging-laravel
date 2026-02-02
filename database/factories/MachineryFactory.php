<?php

namespace Database\Factories;

use App\Models\Machinery;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Machinery>
 */
class MachineryFactory extends Factory
{
    protected $model = Machinery::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'uuid' => \Illuminate\Support\Str::uuid()->toString(),
            'cod' => $this->faker->unique()->bothify('MCH-???'),
            // Generare sempre descrizione
            'description' => $this->faker->sentence(),
            'parameter' => $this->faker->word(),
            'value_type_uuid' => null, // Verrà assegnato nel seeder
            'removed' => false,
        ];
    }
}
