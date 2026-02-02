<?php

namespace Database\Factories;

use App\Models\ArticleIC;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ArticleIC>
 */
class ArticleICFactory extends Factory
{
    protected $model = ArticleIC::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'uuid' => \Illuminate\Support\Str::uuid()->toString(),
            'code' => $this->faker->unique()->bothify('IC-???'),
            // Siempre generar todos los campos
            'number' => $this->faker->numerify('####'),
            'filename' => $this->faker->word().'.pdf',
            'removed' => false,
        ];
    }
}
