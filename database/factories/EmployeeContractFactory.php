<?php

namespace Database\Factories;

use App\Models\Employee;
use App\Models\EmployeeContract;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<EmployeeContract>
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
            'uuid' => Str::uuid()->toString(),
            'employee_uuid' => fn () => Employee::factory()->create()->uuid,
            'supplier_uuid' => null, // Nullable by default, can be overridden in tests
            'pay_level' => $this->faker->numberBetween(0, 8),
            'start_date' => $this->faker->date(),
            'end_date' => $this->faker->optional()->date(),
            'removed' => false,
        ];
    }
}
