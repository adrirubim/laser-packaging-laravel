<?php

namespace Database\Factories;

use App\Models\ArticleIO;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ArticleIO>
 */
class ArticleIOFactory extends Factory
{
    protected $model = ArticleIO::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'uuid' => \Illuminate\Support\Str::uuid()->toString(),
            'code' => $this->faker->unique()->bothify('IO-???'),
            // Siempre generar todos los campos
            'number' => $this->faker->numerify('####'),
            'filename' => $this->faker->word().'.pdf',
            'removed' => false,
        ];
    }
}
