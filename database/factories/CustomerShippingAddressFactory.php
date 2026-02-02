<?php

namespace Database\Factories;

use App\Models\CustomerDivision;
use App\Models\CustomerShippingAddress;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\CustomerShippingAddress>
 */
class CustomerShippingAddressFactory extends Factory
{
    protected $model = CustomerShippingAddress::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Codici provincia italiani (2 lettere)
        $italianProvinces = [
            'RM', 'MI', 'TO', 'NA', 'FI', 'PA', 'GE', 'BO', 'BA', 'VE',
            'CA', 'TA', 'PD', 'VR', 'VI', 'TS', 'BG', 'BS', 'PV', 'CR',
            'MN', 'FE', 'RA', 'RE', 'MO', 'PR', 'PC', 'PI', 'PT', 'LI',
            'GR', 'SI', 'AR', 'FI', 'PO', 'LU', 'MS', 'PT', 'AN', 'PU',
            'MC', 'AP', 'TE', 'AQ', 'PE', 'CH', 'CB', 'IS', 'CE', 'BN',
            'AV', 'SA', 'FG', 'BA', 'TA', 'BR', 'LE', 'MT', 'PZ', 'CZ',
            'CS', 'RC', 'VV', 'ME', 'CT', 'EN', 'CL', 'AG', 'TP', 'SR',
            'RG', 'SS', 'NU', 'OR', 'CA', 'OT', 'VS', 'CI', 'SU', 'OG',
        ];

        return [
            'uuid' => \Illuminate\Support\Str::uuid()->toString(),
            'customerdivision_uuid' => fn () => CustomerDivision::factory()->create()->uuid,
            // Siempre generar C/O (Care Of)
            'co' => $this->faker->randomElement([
                $this->faker->word(),
                $this->faker->name(),
                'Ufficio Amministrazione',
                'Ufficio Acquisti',
                'Magazzino',
                'Reparto Vendite',
                'Ufficio Commerciale',
                'Ricevimento Merci',
            ]),
            // Generare sempre indirizzo completo
            'street' => $this->faker->streetAddress(),
            // CAP: 5 cifre numeriche (formato italiano corretto)
            'postal_code' => $this->faker->numerify('#####'), // 5 cifre
            'city' => $this->faker->city(),
            // Provincia: codice di 2 lettere (formato italiano corretto)
            'province' => $this->faker->randomElement($italianProvinces),
            'country' => $this->faker->country(),
            // Generare sempre contatti con formati diversi
            'contacts' => $this->faker->randomElement([
                $this->faker->phoneNumber(),
                $this->faker->phoneNumber().' / '.$this->faker->phoneNumber(),
                $this->faker->name().' - '.$this->faker->phoneNumber(),
                $this->faker->name().' ('.$this->faker->phoneNumber().')',
                $this->faker->name().', Tel: '.$this->faker->phoneNumber().', Email: '.$this->faker->email(),
                'Responsabile: '.$this->faker->name().', Tel: '.$this->faker->phoneNumber(),
                'Magazzino - Tel: '.$this->faker->phoneNumber().', Email: '.$this->faker->email(),
            ]),
            'removed' => false,
        ];
    }
}
