<?php

namespace Database\Factories;

use App\Models\CriticalIssue;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\CriticalIssue>
 */
class CriticalIssueFactory extends Factory
{
    protected $model = CriticalIssue::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'uuid' => \Illuminate\Support\Str::uuid()->toString(),
            'name' => $this->faker->unique()->word(),
            'removed' => false,
        ];
    }
}
