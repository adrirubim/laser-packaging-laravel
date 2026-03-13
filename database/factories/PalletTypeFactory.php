<?php

namespace Database\Factories;

use App\Models\PalletType;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<PalletType>
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
            'uuid' => Str::uuid()->toString(),
            'cod' => $this->faker->unique()->bothify('PAL-???'),
            // Always generate description
            'description' => $this->faker->sentence(),
            'removed' => false,
        ];
    }
}
