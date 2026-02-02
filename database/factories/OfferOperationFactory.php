<?php

namespace Database\Factories;

use App\Models\OfferOperation;
use App\Models\OfferOperationCategory;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\OfferOperation>
 */
class OfferOperationFactory extends Factory
{
    protected $model = OfferOperation::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'uuid' => \Illuminate\Support\Str::uuid()->toString(),
            'category_uuid' => fn () => OfferOperationCategory::factory()->create()->uuid,
            // Siempre generar todos los campos
            'codice' => $this->faker->unique()->bothify('OP-???-####'),
            'codice_univoco' => $this->faker->unique()->bothify('UNI-???-####'),
            'descrizione' => $this->faker->sentence(),
            'secondi_operazione' => $this->faker->numberBetween(10, 3600),
            'filename' => $this->faker->word().'.pdf',
            'removed' => false,
        ];
    }
}
