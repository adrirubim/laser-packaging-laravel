<?php

namespace Database\Factories;

use App\Models\Article;
use App\Models\Offer;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Article>
 */
class ArticleFactory extends Factory
{
    protected $model = Article::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'uuid' => \Illuminate\Support\Str::uuid()->toString(),
            'offer_uuid' => fn () => Offer::factory()->create()->uuid,
            'cod_article_las' => 'LAS'.$this->faker->numerify('####').str_pad($this->faker->numberBetween(1, 9999), 4, '0', STR_PAD_LEFT),
            'visibility_cod' => $this->faker->boolean(80),
            'stock_managed' => $this->faker->boolean(50),
            'cod_article_client' => $this->faker->bothify('CLI-???-####'),
            'article_descr' => $this->faker->sentence(5),
            'additional_descr' => $this->faker->text(200),
            'article_category' => null,
            'um' => $this->faker->randomElement(['PZ', 'KG', 'L', 'M']),
            'lot_attribution' => $this->faker->randomElement([0, 1]), // 0: Cliente, 1: Noi
            'expiration_attribution' => $this->faker->randomElement([0, 1]), // 0: Cliente, 1: Noi
            'ean' => $this->faker->ean13(),
            'db' => $this->faker->randomElement([0, 1, 2]), // 0: Cliente, 1: Noi, 2: Entrambi
            'packaging_instruct_uuid' => null,
            'operating_instruct_uuid' => null,
            'palletizing_instruct_uuid' => null,
            'line_layout' => $this->faker->bothify('LAY-###'),
            'weight_kg' => $this->faker->randomFloat(3, 0.1, 50),
            'length_cm' => $this->faker->randomFloat(2, 1, 200),
            'depth_cm' => $this->faker->randomFloat(2, 1, 200),
            'height_cm' => $this->faker->randomFloat(2, 1, 200),
            'plan_packaging' => $this->faker->numberBetween(1, 50),
            'pallet_plans' => $this->faker->numberBetween(1, 10),
            'units_per_neck' => $this->faker->numberBetween(1, 100),
            'interlayer_every_floors' => $this->faker->numberBetween(0, 5),
            'allergens' => $this->faker->text(100),
            'value_pvp' => $this->faker->randomFloat(2, 0.01, 1000),
            'labels_external' => $this->faker->numberBetween(0, 2),
            'labels_pvp' => $this->faker->numberBetween(0, 2),
            'labels_ingredient' => $this->faker->numberBetween(0, 2),
            'labels_data_variable' => $this->faker->numberBetween(0, 2),
            'label_of_jumpers' => $this->faker->numberBetween(0, 2),
            'check_material' => $this->faker->boolean(30),
            'production_approval_checkbox' => $this->faker->boolean(50),
            'production_approval_employee' => null,
            'production_approval_date' => $this->faker->boolean(50) ? $this->faker->dateTimeBetween('-1 year', 'now') : null,
            'production_approval_notes' => $this->faker->boolean(30) ? $this->faker->text(200) : null,
            'approv_quality_checkbox' => $this->faker->boolean(50),
            'approv_quality_employee' => null,
            'approv_quality_date' => $this->faker->boolean(50) ? $this->faker->dateTimeBetween('-1 year', 'now') : null,
            'approv_quality_notes' => $this->faker->boolean(30) ? $this->faker->text(200) : null,
            'commercial_approval_checkbox' => $this->faker->boolean(50),
            'commercial_approval_employee' => null,
            'commercial_approval_date' => $this->faker->boolean(50) ? $this->faker->dateTimeBetween('-1 year', 'now') : null,
            'commercial_approval_notes' => $this->faker->boolean(30) ? $this->faker->text(200) : null,
            'client_approval_checkbox' => $this->faker->boolean(50),
            'client_approval_employee' => null,
            'client_approval_date' => $this->faker->boolean(50) ? $this->faker->dateTimeBetween('-1 year', 'now') : null,
            'client_approval_notes' => $this->faker->boolean(30) ? $this->faker->text(200) : null,
            'check_approval' => $this->faker->boolean(30),
            'media_reale_cfz_h_pz' => $this->faker->randomFloat(4, 0.1, 1000),
            'nominal_weight_control' => $this->faker->boolean(50),
            'weight_unit_of_measur' => $this->faker->randomElement(['KG', 'G', 'MG']),
            'weight_value' => $this->faker->randomFloat(3, 0.1, 50),
            'object_control_weight' => $this->faker->boolean(50),
            'pallet_sheet' => null, // UUID PalletSheet, will be assigned in seeder
            'customer_samples_list' => $this->faker->boolean(30) ? 1 : 0, // Entero: 0 o 1
            'removed' => false,
        ];
    }
}
