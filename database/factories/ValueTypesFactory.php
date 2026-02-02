<?php

namespace Database\Factories;

use App\Models\ValueTypes;
use Illuminate\Database\Eloquent\Factories\Factory;

class ValueTypesFactory extends Factory
{
    protected $model = ValueTypes::class;

    public function definition(): array
    {
        return [
            'removed' => false,
        ];
    }
}
