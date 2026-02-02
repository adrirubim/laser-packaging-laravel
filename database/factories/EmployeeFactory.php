<?php

namespace Database\Factories;

use App\Models\Employee;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Employee>
 */
class EmployeeFactory extends Factory
{
    protected $model = Employee::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'uuid' => \Illuminate\Support\Str::uuid()->toString(),
            'name' => $this->faker->firstName(),
            'surname' => $this->faker->lastName(),
            'matriculation_number' => $this->faker->unique()->numerify('EMP-####'),
            'password' => hash('sha512', 'password'), // SHA512 como en el sistema legacy
            'portal_enabled' => $this->faker->boolean(70),
            'removed' => false,
        ];
    }
}
