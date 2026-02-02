<?php

namespace Database\Factories;

use App\Models\PalletType;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\PalletType>
 */
class PalletTypeFactory extends Factory
{
    protected $model = PalletType::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'uuid' => \Illuminate\Support\Str::uuid()->toString(),
            'cod' => $this->faker->unique()->bothify('PAL-???'),
            // Generare sempre descrizione
            'description' => $this->faker->sentence(),
            'removed' => false,
        ];
    }
}
