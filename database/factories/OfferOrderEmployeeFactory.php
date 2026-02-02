<?php

namespace Database\Factories;

use App\Models\Employee;
use App\Models\OfferOrderEmployee;
use App\Models\Order;
use Illuminate\Database\Eloquent\Factories\Factory;

class OfferOrderEmployeeFactory extends Factory
{
    protected $model = OfferOrderEmployee::class;

    public function definition(): array
    {
        return [
            'uuid' => \Illuminate\Support\Str::uuid()->toString(),
            'order_uuid' => fn () => Order::factory()->create()->uuid,
            'employee_uuid' => fn () => Employee::factory()->create()->uuid,
            'removed' => false,
        ];
    }
}
