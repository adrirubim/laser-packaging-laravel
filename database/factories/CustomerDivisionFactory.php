<?php

namespace Database\Factories;

use App\Models\Customer;
use App\Models\CustomerDivision;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\CustomerDivision>
 */
class CustomerDivisionFactory extends Factory
{
    protected $model = CustomerDivision::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'uuid' => \Illuminate\Support\Str::uuid()->toString(),
            'customer_uuid' => fn () => Customer::factory()->create()->uuid,
            // Always generate division code
            'code' => $this->faker->unique()->bothify('DIV-???'),
            // Always generate division name
            'name' => $this->faker->randomElement([
                $this->faker->company().' - Sede Centrale',
                $this->faker->company().' - Filiale',
                $this->faker->company().' - Divisione',
                $this->faker->company().' - Ufficio Commerciale',
                $this->faker->company().' - Magazzino',
                $this->faker->company(),
                $this->faker->companySuffix().' '.$this->faker->company(),
            ]),
            // Siempre generar email (usar email de la empresa o personal)
            'email' => $this->faker->companyEmail(),
            // Siempre generar contactos con diferentes formatos
            'contacts' => $this->faker->randomElement([
                $this->faker->phoneNumber(),
                $this->faker->phoneNumber().' / '.$this->faker->phoneNumber(),
                $this->faker->name().' - '.$this->faker->phoneNumber(),
                $this->faker->name().' ('.$this->faker->phoneNumber().')',
                $this->faker->name().', Tel: '.$this->faker->phoneNumber().', Email: '.$this->faker->email(),
            ]),
            'removed' => false,
        ];
    }
}
