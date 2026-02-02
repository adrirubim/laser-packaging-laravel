<?php

namespace Database\Factories;

use App\Models\Employee;
use App\Models\EmployeeContract;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\EmployeeContract>
 */
class EmployeeContractFactory extends Factory
{
    protected $model = EmployeeContract::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'uuid' => \Illuminate\Support\Str::uuid()->toString(),
            'employee_uuid' => fn () => Employee::factory()->create()->uuid,
            'supplier_uuid' => null, // Nullable by default, can be overridden in tests
            'pay_level' => $this->faker->numberBetween(0, 4),
            'start_date' => $this->faker->date(),
            'end_date' => $this->faker->optional()->date(),
            'removed' => false,
        ];
    }
}
