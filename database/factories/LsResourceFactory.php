<?php

namespace Database\Factories;

use App\Models\LsResource;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class LsResourceFactory extends Factory
{
    protected $model = LsResource::class;

    public function definition(): array
    {
        return [
            'uuid' => Str::uuid()->toString(),
            'code' => $this->faker->unique()->bothify('LSR-???'),
            'name' => $this->faker->words(3, true),
            'removed' => false,
        ];
    }
}
