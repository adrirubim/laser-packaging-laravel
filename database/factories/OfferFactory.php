<?php

namespace Database\Factories;

use App\Models\Customer;
use App\Models\Offer;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Offer>
 */
class OfferFactory extends Factory
{
    protected $model = Offer::class;

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
            // Use unique() to avoid violating UNIQUE constraint in intensive tests
            'offer_number' => date('Y').'_'.str_pad($this->faker->unique()->numberBetween(1, 999), 3, '0', STR_PAD_LEFT).'_01_A',
            'offer_date' => $this->faker->dateTimeBetween('-1 year', 'now'),
            // Always generate validity date (between now and 1 year in future)
            'validity_date' => $this->faker->dateTimeBetween('now', '+1 year'),
            // Always generate customer reference
            'customer_ref' => $this->faker->numerify('REF-#####'),
            // Always generate article reference code
            'article_code_ref' => $this->faker->bothify('ART-???-####'),
            // Always generate provisional description
            'provisional_description' => $this->faker->sentence(),
            'unit_of_measure' => $this->faker->randomElement(['PZ', 'KG', 'L', 'M']),
            'quantity' => $this->faker->randomFloat(2, 100, 10000),
            'piece' => $this->faker->numberBetween(1, 100),
            // Always generate declared weights
            'declared_weight_cfz' => $this->faker->randomFloat(3, 0.1, 10),
            'declared_weight_pz' => $this->faker->randomFloat(3, 0.01, 1),
            // Always generate notes
            'notes' => $this->faker->text(500),
            // Always generate expected workers
            'expected_workers' => $this->faker->numberBetween(1, 10),
            // Always generate expected revenue
            'expected_revenue' => $this->faker->randomFloat(2, 1000, 100000),
            // Always generate rates
            'rate_cfz' => $this->faker->randomFloat(2, 0.1, 100),
            'rate_pz' => $this->faker->randomFloat(2, 0.01, 10),
            'rate_rounding_cfz' => $this->faker->randomFloat(2, 0.01, 1),
            'rate_increase_cfz' => $this->faker->randomFloat(2, 0, 50),
            // Always generate costs
            'materials_euro' => $this->faker->randomFloat(2, 100, 10000),
            'logistics_euro' => $this->faker->randomFloat(2, 50, 5000),
            'other_euro' => $this->faker->randomFloat(2, 0, 2000),
            'approval_status' => Offer::APPROVAL_STATUS_PENDING,
            'removed' => false,
        ];
    }
}
