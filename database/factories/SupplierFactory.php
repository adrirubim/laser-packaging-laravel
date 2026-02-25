<?php

namespace Database\Factories;

use App\Models\Supplier;
use Illuminate\Database\Eloquent\Factories\Factory;

class SupplierFactory extends Factory
{
    protected $model = Supplier::class;

    public function definition(): array
    {
        // Italian province codes (2 letters)
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
            'code' => $this->faker->unique()->bothify('SUP-???'),
            'company_name' => $this->faker->company(),
            // VAT number: 11 numeric digits (correct Italian format)
            'vat_number' => $this->faker->numerify('###########'), // 11 digits
            // Always generate C/O (Care Of)
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
            // Always generate full address
            'street' => $this->faker->streetAddress(),
            'city' => $this->faker->city(),
            // Postal code: 5 numeric digits (correct Italian format)
            'postal_code' => $this->faker->numerify('#####'), // 5 digits
            // Province: 2-letter code (correct Italian format)
            'province' => $this->faker->randomElement($italianProvinces),
            'country' => $this->faker->country(),
            // Always generate contacts with different formats
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
