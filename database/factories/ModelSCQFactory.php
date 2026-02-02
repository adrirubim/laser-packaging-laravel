<?php

namespace Database\Factories;

use App\Models\ModelSCQ;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ModelSCQ>
 */
class ModelSCQFactory extends Factory
{
    protected $model = ModelSCQ::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'uuid' => \Illuminate\Support\Str::uuid()->toString(),
            'cod_model' => 'CQU'.str_pad($this->faker->unique()->numberBetween(1, 999), 3, '0', STR_PAD_LEFT),
            'description_model' => $this->faker->sentence(3),
            // Siempre generar filename
            'filename' => $this->faker->word().'.pdf',
            'removed' => false,
        ];
    }
}
