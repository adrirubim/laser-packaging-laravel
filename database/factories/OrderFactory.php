<?php

namespace Database\Factories;

use App\Models\Article;
use App\Models\Order;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Order>
 */
class OrderFactory extends Factory
{
    protected $model = Order::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'uuid' => \Illuminate\Support\Str::uuid()->toString(),
            'article_uuid' => fn () => Article::factory()->create()->uuid,
            'order_production_number' => date('Y').'.'.str_pad($this->faker->unique()->numberBetween(1, 99999), 5, '0', STR_PAD_LEFT),
            'number_customer_reference_order' => $this->faker->optional()->numerify('REF-#####'),
            'line' => $this->faker->optional()->numberBetween(1, 10),
            'quantity' => $this->faker->randomFloat(2, 10, 1000),
            'worked_quantity' => $this->faker->randomFloat(2, 0, 500),
            'delivery_requested_date' => $this->faker->optional()->dateTimeBetween('now', '+1 year'),
            'expected_production_start_date' => $this->faker->optional()->dateTimeBetween('now', '+6 months'),
            'type_lot' => $this->faker->optional()->numberBetween(0, 2),
            'lot' => $this->faker->optional()->numerify('LOT-#####'),
            'expiration_date' => $this->faker->optional()->dateTimeBetween('+1 year', '+2 years'),
            'external_labels' => $this->faker->optional()->numberBetween(0, 2),
            'pvp_labels' => $this->faker->optional()->numberBetween(0, 2),
            'ingredients_labels' => $this->faker->optional()->numberBetween(0, 2),
            'variable_data_labels' => $this->faker->optional()->numberBetween(0, 2),
            'label_of_jumpers' => $this->faker->optional()->numberBetween(0, 2),
            'indications_for_shop' => $this->faker->optional()->text(200),
            'indications_for_production' => $this->faker->optional()->text(200),
            'indications_for_delivery' => $this->faker->optional()->text(200),
            'status' => Order::STATUS_PIANIFICATO,
            'status_semaforo' => json_encode(['etichette' => 0, 'packaging' => 0, 'prodotto' => 0]),
            'motivazione' => null,
            'autocontrollo' => false,
            'removed' => false,
        ];
    }
}
