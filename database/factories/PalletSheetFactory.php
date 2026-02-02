<?php

namespace Database\Factories;

use App\Models\PalletSheet;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\PalletSheet>
 */
class PalletSheetFactory extends Factory
{
    protected $model = PalletSheet::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'uuid' => \Illuminate\Support\Str::uuid()->toString(),
            'code' => $this->faker->unique()->bothify('FP-???-####'),
            'description' => $this->faker->sentence(3),
            // Siempre generar filename
            'filename' => $this->faker->word().'.pdf',
            'removed' => false,
        ];
    }
}
