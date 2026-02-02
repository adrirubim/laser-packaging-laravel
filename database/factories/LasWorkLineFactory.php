<?php

namespace Database\Factories;

use App\Models\LasWorkLine;
use Illuminate\Database\Eloquent\Factories\Factory;

class LasWorkLineFactory extends Factory
{
    protected $model = LasWorkLine::class;

    public function definition(): array
    {
        return [
            'uuid' => \Illuminate\Support\Str::uuid()->toString(),
            'code' => $this->faker->unique()->bothify('LWL-???'),
            'name' => $this->faker->words(3, true),
            'removed' => false,
        ];
    }
}
