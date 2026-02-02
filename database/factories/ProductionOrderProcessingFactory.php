<?php

namespace Database\Factories;

use App\Models\Employee;
use App\Models\Order;
use App\Models\ProductionOrderProcessing;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ProductionOrderProcessing>
 */
class ProductionOrderProcessingFactory extends Factory
{
    protected $model = ProductionOrderProcessing::class;

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
            'order_uuid' => fn () => Order::factory()->create()->uuid,
            'quantity' => $this->faker->randomFloat(2, 1, 100),
            'processed_datetime' => $this->faker->dateTimeBetween('-1 month', 'now'),
            'removed' => false,
        ];
    }
}
