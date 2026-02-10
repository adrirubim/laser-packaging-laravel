<?php

namespace Database\Seeders;

use App\Models\Article;
use App\Models\ArticleCategory;
use App\Models\ArticleCheckMaterial;
use App\Models\ArticleIC;
use App\Models\ArticleIO;
use App\Models\ArticleIP;
use App\Models\CriticalIssue;
use App\Models\Customer;
use App\Models\CustomerDivision;
use App\Models\CustomerShippingAddress;
use App\Models\Employee;
use App\Models\EmployeeContract;
use App\Models\Machinery;
use App\Models\Material;
use App\Models\ModelSCQ;
use App\Models\Offer;
use App\Models\OfferActivity;
use App\Models\OfferLasFamily;
use App\Models\OfferLasWorkLine;
use App\Models\OfferLsResource;
use App\Models\OfferOperation;
use App\Models\OfferOperationCategory;
use App\Models\OfferOperationList;
use App\Models\OfferOrderEmployee;
use App\Models\OfferOrderState;
use App\Models\OfferSeasonality;
use App\Models\OfferSector;
use App\Models\OfferType;
use App\Models\OfferTypeOrder;
use App\Models\Order;
use App\Models\PalletSheet;
use App\Models\PalletType;
use App\Models\ProductionOrderProcessing;
use App\Models\Supplier;
use App\Models\ValueTypes;
use App\Services\OrderProductionNumberService;
use Faker\Factory as Faker;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

/**
 * Seeder de datos de prueba para probar todas las funciones de la aplicación.
 *
 * Cobertura principal:
 * - Clientes, divisiones, direcciones de envío, proveedores
 * - Empleados, contratos, tipos de valor, materiales, maquinaria, tipos pallet
 * - Categorías artículo, instrucciones (IC/IO/IP), ModelSCQ, CriticalIssue, PalletSheet
 * - Ofertas (actividades, sectores, estacionalidad, familias LAS, recursos, tipos orden, tipos oferta, operaciones)
 * - Artículos con relaciones (instrucciones, materiales, maquinaria, críticos, Verifica Consumi)
 * - Órdenes en todos los estados: Pianificato (0), In Allestimento (1), Lanciato (2), In Avanzamento (3), Sospese (4), Evaso (5), Saldato (6)
 * - ProductionOrderProcessing, OfferOrderState, asignaciones empleado-orden
 *
 * Descargas: se crean archivos placeholder en storage para que funcionen las descargas
 * (packaging/operational/palletization instructions, ModelSCQ, PalletSheet, line_layout artículo, operaciones oferta).
 */
class TestDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        if (app()->environment('production')) {
            throw new \RuntimeException(
                'TestDataSeeder cannot run in production. It wipes all data. Use only in local or test environments.'
            );
        }

        $faker = Faker::create();

        $this->command->info('🌱 Creando datos de prueba...');
        $this->command->warn('⚠️  Limpiando datos existentes...');

        // Limpiar datos existentes para que el dashboard solo muestre los datos del seeder
        // Disattivare verifica chiavi esterne temporaneamente (PostgreSQL)
        DB::statement('SET session_replication_role = replica;');

        // Eliminar en orden de dependencias: tablas hijas/pivot antes que padres
        // Usamos DB::table() con truncate para limpiar completamente y evitar los scopes de SoftDeletes
        DB::table('productionorderprocessing')->truncate();
        DB::table('offerorderemployee')->truncate();
        DB::table('orderorder')->truncate();
        DB::table('articlecheckmaterial')->truncate();
        DB::table('articlematerials')->truncate();
        DB::table('articlemachinery')->truncate();
        DB::table('articlecritical')->truncate();
        DB::table('articlesicassigned')->truncate();
        DB::table('articlesioassigned')->truncate();
        DB::table('articlesipassigned')->truncate();
        DB::table('articles')->truncate();
        DB::table('offeroperationlist')->truncate();
        DB::table('offerarticles')->truncate();
        DB::table('offer')->truncate();
        DB::table('customershippingaddress')->truncate();
        DB::table('customerdivision')->truncate();
        DB::table('customer')->truncate();
        DB::table('employeecontracts')->truncate();
        DB::table('employee')->truncate();
        DB::table('supplier')->truncate();
        DB::table('materials')->truncate();
        DB::table('machinery')->truncate();
        DB::table('pallettype')->truncate();
        DB::table('articlecategory')->truncate();
        DB::table('offeractivity')->truncate();
        DB::table('offersector')->truncate();
        DB::table('offerseasonality')->truncate();
        DB::table('offerlasfamily')->truncate();
        DB::table('offerlasworkline')->truncate();
        DB::table('offerlsresource')->truncate();
        DB::table('offertypeorder')->truncate();
        DB::table('offeroperationcategory')->truncate();
        DB::table('offeroperation')->truncate();
        DB::table('offertype')->truncate();
        DB::table('articlesic')->truncate();
        DB::table('articlesio')->truncate();
        DB::table('articlesip')->truncate();
        DB::table('modelscq')->truncate();
        DB::table('criticalissues')->truncate();
        DB::table('articlefogliopallet')->truncate();
        DB::table('valuetypes')->truncate();
        DB::table('offerorderstate')->truncate();

        // Riattivare verifica chiavi esterne
        DB::statement('SET session_replication_role = DEFAULT;');

        $this->command->info('   ✅ Datos existentes eliminados');

        // 1. Crear Clientes
        $this->command->info('📦 Creando clientes...');
        $customers = Customer::factory()->count(5)->create();
        // Cliente DEMO-ALL: tutti i campi per verificare gli input (Clienti → cercare CLI-DEMO-ALL)
        $demoCustomer = Customer::factory()->create([
            'code' => 'CLI-DEMO-ALL',
            'company_name' => 'Demo All - Tutti i campi clienti',
            'vat_number' => '12345678901',
            'co' => 'Ufficio Demo',
            'street' => 'Via Demo All 1',
            'postal_code' => '00100',
            'city' => 'Roma',
            'province' => 'RM',
            'country' => 'Italia',
            'removed' => false,
        ]);
        $customers->push($demoCustomer);
        $this->command->info("   ✅ {$customers->count()} clientes creados (1 demo: CLI-DEMO-ALL)");

        // 2. Crear Divisiones de Clientes
        $this->command->info('🏢 Creando divisiones de clientes...');
        $divisions = collect();
        foreach ($customers as $customer) {
            $customerDivisions = CustomerDivision::factory()
                ->count(rand(1, 3))
                ->create(['customer_uuid' => $customer->uuid]);
            $divisions = $divisions->merge($customerDivisions);
        }
        // Divisioni per il cliente DEMO-ALL (2 divisioni con tutti i campi)
        $demoDiv1 = CustomerDivision::factory()->create([
            'customer_uuid' => $demoCustomer->uuid,
            'name' => 'Demo All Divisione 1',
            'removed' => false,
        ]);
        $demoDiv2 = CustomerDivision::factory()->create([
            'customer_uuid' => $demoCustomer->uuid,
            'name' => 'Demo All Divisione 2',
            'removed' => false,
        ]);
        $divisions = $divisions->merge(collect([$demoDiv1, $demoDiv2]));
        $this->command->info("   ✅ {$divisions->count()} divisiones creadas (2 per CLI-DEMO-ALL)");

        // 3. Creare indirizzi di spedizione
        $this->command->info('📍 Creando direcciones de envío...');
        $shippingAddresses = collect();
        foreach ($divisions as $division) {
            $addresses = CustomerShippingAddress::factory()
                ->count(rand(1, 2))
                ->create(['customerdivision_uuid' => $division->uuid]);
            $shippingAddresses = $shippingAddresses->merge($addresses);
        }
        // 2 indirizzi per ogni divisione demo con TUTTI i campi compilati (Show/Edit: campo vuoto = qualcosa non funziona)
        foreach ([$demoDiv1, $demoDiv2] as $idx => $demoDiv) {
            $suffix = $idx + 1;
            $shippingAddresses = $shippingAddresses->merge(collect([
                CustomerShippingAddress::factory()->create([
                    'customerdivision_uuid' => $demoDiv->uuid,
                    'co' => 'Reparto Demo '.$suffix,
                    'street' => 'Via Demo All '.$suffix.', 1',
                    'postal_code' => '0010'.$suffix,
                    'city' => 'Roma',
                    'province' => 'RM',
                    'country' => 'Italia',
                    'contacts' => 'Tel: 06 1234567'.$suffix.', Email: demo'.$suffix.'@indirizzo.it',
                    'removed' => false,
                ]),
                CustomerShippingAddress::factory()->create([
                    'customerdivision_uuid' => $demoDiv->uuid,
                    'co' => 'Magazzino Demo '.$suffix,
                    'street' => 'Piazza Demo '.$suffix.', 10',
                    'postal_code' => '0010'.($suffix + 2),
                    'city' => 'Milano',
                    'province' => 'MI',
                    'country' => 'Italia',
                    'contacts' => 'Tel: 02 9876543'.$suffix.', Email: mag'.$suffix.'@demo.it',
                    'removed' => false,
                ]),
            ]));
        }
        $this->command->info("   ✅ {$shippingAddresses->count()} direcciones creadas");

        // 4. Crear Proveedores
        $this->command->info('🏭 Creando proveedores...');
        $suppliers = Supplier::factory()->count(3)->create();
        // Fornitore DEMO-ALL: tutti i campi (Fornitori → cercare FORN-DEMO-ALL)
        $demoSupplier = Supplier::factory()->create([
            'code' => 'FORN-DEMO-ALL',
            'company_name' => 'Demo All Fornitori - Tutti i campi',
            'vat_number' => '98765432109',
            'co' => 'Ufficio Demo Fornitori',
            'street' => 'Via Fornitori Demo 1',
            'postal_code' => '20100',
            'city' => 'Milano',
            'province' => 'MI',
            'country' => 'Italia',
            'contacts' => 'Tel: 02 1234567, Email: demo@fornitori.it',
            'removed' => false,
        ]);
        $suppliers->push($demoSupplier);
        $this->command->info("   ✅ {$suppliers->count()} proveedores creados (1 demo: FORN-DEMO-ALL)");

        // 5. Crear Empleados
        $this->command->info('👥 Creando empleados...');
        $employees = Employee::factory()->count(10)->create();
        // Dipendente DEMO-ALL: tutti i campi (Personale → cercare EMP-DEMO-ALL)
        $demoEmployee = Employee::factory()->create([
            'name' => 'Demo',
            'surname' => 'All',
            'matriculation_number' => 'EMP-DEMO-ALL',
            'portal_enabled' => true,
            'removed' => false,
        ]);
        $employees->push($demoEmployee);
        // Un paio di dipendenti con nomi italiani realistici per test
        $rossi = Employee::factory()->create([
            'name' => 'Marco',
            'surname' => 'Rossi',
            'matriculation_number' => 'EMP-ROSSI-01',
            'portal_enabled' => true,
            'removed' => false,
        ]);
        $employees->push($rossi);
        $bianchi = Employee::factory()->create([
            'name' => 'Laura',
            'surname' => 'Bianchi',
            'matriculation_number' => 'EMP-BIANCHI-01',
            'portal_enabled' => false,
            'removed' => false,
        ]);
        $employees->push($bianchi);
        $this->command->info("   ✅ {$employees->count()} empleados creados (demo: EMP-DEMO-ALL, Rossi, Bianchi)");

        // 5.1. Crear Contratos de Empleados (pay_level 0-8, parità legacy; alcuni a tempo indeterminato)
        $this->command->info('📝 Creando contratos de empleados...');
        $contracts = collect();
        foreach ($employees as $employee) {
            $contractCount = rand(1, 3);
            for ($i = 0; $i < $contractCount; $i++) {
                $startDate = $faker->dateTimeBetween('-2 years', 'now');
                $isActive = $faker->boolean(70);
                // ~20% contratti a tempo indeterminato (end_date null)
                $hasEndDate = $faker->boolean(80);
                $endDate = null;
                if ($hasEndDate) {
                    if ($isActive) {
                        $endDate = $faker->dateTimeBetween('+1 year', '+3 years');
                    } else {
                        $endDate = $faker->dateTimeBetween($startDate, 'now');
                    }
                }

                $supplierUuid = $suppliers->random()->uuid;
                // Livelli 0-8 (D1..A1) come in legacy; distribuzione più realistica (più bassi che alti)
                $payLevel = $faker->numberBetween(0, 8);

                $contract = EmployeeContract::factory()->create([
                    'employee_uuid' => $employee->uuid,
                    'supplier_uuid' => $supplierUuid,
                    'pay_level' => $payLevel,
                    'start_date' => $startDate->format('Y-m-d'),
                    'end_date' => $endDate ? $endDate->format('Y-m-d') : null,
                    'removed' => false,
                ]);
                $contracts->push($contract);
            }
        }
        // Almeno 2 contratti per il dipendente DEMO-ALL
        $demoContractCount = $contracts->where('employee_uuid', $demoEmployee->uuid)->count();
        if ($demoContractCount < 2) {
            for ($i = $demoContractCount; $i < 2; $i++) {
                $startDate = $faker->dateTimeBetween('-1 year', 'now');
                $endDate = $faker->boolean(80) ? $faker->dateTimeBetween('+1 year', '+3 years') : null;
                $contracts->push(EmployeeContract::factory()->create([
                    'employee_uuid' => $demoEmployee->uuid,
                    'supplier_uuid' => $demoSupplier->uuid,
                    'pay_level' => $faker->numberBetween(0, 8),
                    'start_date' => $startDate->format('Y-m-d'),
                    'end_date' => $endDate ? $endDate->format('Y-m-d') : null,
                    'removed' => false,
                ]));
            }
        }
        // Esempio "proroga": Rossi ha un contratto scaduto e uno nuovo che inizia il giorno dopo (stesso datore)
        $supplierForProroga = $suppliers->random();
        $endFirstContract = $faker->dateTimeBetween('-6 months', '-1 month');
        $startFirstContract = (clone $endFirstContract)->modify('-1 year');
        $startSecondContract = (clone $endFirstContract)->modify('+1 day');
        $contracts->push(EmployeeContract::factory()->create([
            'employee_uuid' => $rossi->uuid,
            'supplier_uuid' => $supplierForProroga->uuid,
            'pay_level' => $faker->numberBetween(2, 5),
            'start_date' => $startFirstContract->format('Y-m-d'),
            'end_date' => $endFirstContract->format('Y-m-d'),
            'removed' => false,
        ]));
        $contracts->push(EmployeeContract::factory()->create([
            'employee_uuid' => $rossi->uuid,
            'supplier_uuid' => $supplierForProroga->uuid,
            'pay_level' => $faker->numberBetween(2, 5),
            'start_date' => $startSecondContract->format('Y-m-d'),
            'end_date' => (clone $startSecondContract)->modify('+2 years')->format('Y-m-d'),
            'removed' => false,
        ]));
        $this->command->info("   ✅ {$contracts->count()} contratos de empleados creados (incl. ejemplo prórroga para Rossi)");

        // 6. Crear Tipos de Valor y Materiales y Maquinaria
        $this->command->info('🔧 Creando tipos de valor...');
        $valueTypes = ValueTypes::factory()->count(5)->create();
        $this->command->info("   ✅ {$valueTypes->count()} tipos de valor creados");

        $this->command->info('🔧 Creando materiales y maquinaria...');
        $materials = Material::factory()->count(5)->create();
        // Materiale DEMO-ALL (Articoli > Materiali)
        $demoMaterial = Material::factory()->create([
            'cod' => 'MAT-DEMO-ALL',
            'description' => 'Demo All - Materiale per Cerca e verifica',
            'removed' => false,
        ]);
        $materials = $materials->merge(collect([$demoMaterial]));
        $machinery = collect();
        for ($i = 0; $i < 5; $i++) {
            $machinery->push(Machinery::factory()->create([
                'value_type_uuid' => $valueTypes->random()->id,
            ]));
        }
        // Macchinario DEMO-ALL (Articoli > Macchinari)
        $demoMachinery = Machinery::factory()->create([
            'cod' => 'MAC-DEMO-ALL',
            'description' => 'Demo All - Macchinario per Cerca e verifica',
            'value_type_uuid' => $valueTypes->first()->id,
            'removed' => false,
        ]);
        $machinery = $machinery->merge(collect([$demoMachinery]));
        $palletTypes = PalletType::factory()->count(3)->create();
        // Tipo pallet DEMO-ALL (Articoli > Tipi pallet)
        $demoPalletType = PalletType::factory()->create([
            'cod' => 'PAL-DEMO-ALL',
            'description' => 'Demo All - Tipo pallet per Cerca e verifica',
            'removed' => false,
        ]);
        $palletTypes = $palletTypes->merge(collect([$demoPalletType]));
        $this->command->info("   ✅ {$materials->count()} materiales, {$machinery->count()} maquinarias, {$palletTypes->count()} tipos de pallet creados");

        // 7. Creare categorie di articoli
        $this->command->info('📋 Creando categorías de artículos...');
        $categories = ArticleCategory::factory()->count(5)->create();
        // Categoria articolo DEMO-ALL (Articoli > Categorie)
        $demoArticleCategory = ArticleCategory::factory()->create([
            'name' => 'Demo All - Categorie articoli',
            'removed' => false,
        ]);
        $categories = $categories->merge(collect([$demoArticleCategory]));
        $this->command->info("   ✅ {$categories->count()} categorías creadas");

        // 7.1. Creare istruzioni e modelli relativi agli articoli
        $this->command->info('📄 Creando instrucciones y modelos para artículos...');
        $articleICs = ArticleIC::factory()->count(10)->create();
        // Istruzione di Confezionamento DEMO-ALL (Articoli > Istruzioni di confezionamento) – Cerca "Demo"
        $demoArticleIC = ArticleIC::factory()->create([
            'code' => 'IC-DEMO-ALL',
            'number' => 'DEMO-ALL',
            'filename' => 'demo-ic.pdf',
            'removed' => false,
        ]);
        $articleICs = $articleICs->merge(collect([$demoArticleIC]));
        $articleIOs = ArticleIO::factory()->count(10)->create();
        // Istruzione Operativa DEMO-ALL (Articoli > Istruzioni operative) – Cerca "Demo"
        $demoArticleIO = ArticleIO::factory()->create([
            'code' => 'IO-DEMO-ALL',
            'number' => 'DEMO-ALL',
            'filename' => 'demo-io.pdf',
            'removed' => false,
        ]);
        $articleIOs = $articleIOs->merge(collect([$demoArticleIO]));
        $articleIPs = ArticleIP::factory()->count(10)->create();
        // Istruzione di Pallettizzazione DEMO-ALL (Articoli > Istruzioni di pallettizzazione) – Cerca "Demo"
        $demoArticleIP = ArticleIP::factory()->create([
            'code' => 'IP-DEMO-ALL',
            'number' => 'DEMO-ALL',
            'length_cm' => 120,
            'depth_cm' => 80,
            'height_cm' => 100,
            'volume_dmc' => 960,
            'plan_packaging' => 6,
            'pallet_plans' => 3,
            'qty_pallet' => 500,
            'units_per_neck' => 24,
            'units_pallet' => 1200,
            'interlayer_every_floors' => 2,
            'filename' => 'demo-ip.pdf',
            'removed' => false,
        ]);
        $articleIPs = $articleIPs->merge(collect([$demoArticleIP]));
        $modelSCQs = ModelSCQ::factory()->count(5)->create();
        // Modello SCQ DEMO-ALL (Articoli > Modelli CQ) – Cerca "Demo"
        $demoModelSCQ = ModelSCQ::factory()->create([
            'cod_model' => 'MOD-DEMO-ALL',
            'description_model' => 'Demo All - Modello SCQ per verifica input',
            'filename' => 'demo-model.pdf',
            'removed' => false,
        ]);
        $modelSCQs = $modelSCQs->merge(collect([$demoModelSCQ]));

        // Crear archivos placeholder en storage para que las descargas funcionen con datos de prueba
        $placeholderContent = "File di test generato dal seeder. Placeholder per download.\n";
        foreach (['packaging-instructions' => $articleICs, 'operational-instructions' => $articleIOs, 'palletization-instructions' => $articleIPs] as $dir => $collection) {
            $basePath = storage_path('app/'.$dir);
            if (! is_dir($basePath)) {
                mkdir($basePath, 0755, true);
            }
            foreach ($collection as $item) {
                if (! empty($item->filename)) {
                    $filePath = $basePath.'/'.$item->filename;
                    if (! file_exists($filePath)) {
                        file_put_contents($filePath, $placeholderContent);
                    }
                }
            }
        }

        // Crear directorios y archivos placeholder para ModelSCQ
        foreach ($modelSCQs as $model) {
            if ($model->filename) {
                $directory = storage_path('app/modelsCQ/'.$model->uuid);
                if (! file_exists($directory)) {
                    mkdir($directory, 0755, true);
                }
                $filePath = $directory.'/'.$model->filename;
                if (! file_exists($filePath)) {
                    file_put_contents($filePath, $placeholderContent);
                }
            }
        }

        $criticalIssues = CriticalIssue::factory()->count(5)->create();
        // Problema critico DEMO-ALL (Articoli > Problemi critici)
        $demoCriticalIssue = CriticalIssue::factory()->create([
            'name' => 'Demo All - Problemi critici',
        ]);
        $criticalIssues = $criticalIssues->merge(collect([$demoCriticalIssue]));
        $palletSheets = PalletSheet::factory()->count(5)->create();
        // Foglio pallet DEMO-ALL (Articoli > Fogli pallet) – Cerca "Demo"
        $demoPalletSheet = PalletSheet::factory()->create([
            'code' => 'PAL-SHEET-DEMO',
            'description' => 'Demo All - Foglio pallet per verifica input',
            'filename' => 'demo-pallet-sheet.pdf',
            'removed' => false,
        ]);
        $palletSheets = $palletSheets->merge(collect([$demoPalletSheet]));

        // Crear archivos placeholder para PalletSheet (foglioPallet/{uuid}/filename)
        foreach ($palletSheets as $sheet) {
            if (! empty($sheet->filename)) {
                $directory = storage_path('app/foglioPallet/'.$sheet->uuid);
                if (! is_dir($directory)) {
                    mkdir($directory, 0755, true);
                }
                $filePath = $directory.'/'.$sheet->filename;
                if (! file_exists($filePath)) {
                    file_put_contents($filePath, $placeholderContent);
                }
            }
        }
        $this->command->info("   ✅ {$articleICs->count()} instrucciones IC, {$articleIOs->count()} instrucciones IO, {$articleIPs->count()} instrucciones IP creadas");
        $this->command->info("   ✅ {$modelSCQs->count()} modelos SCQ, {$criticalIssues->count()} problemas críticos, {$palletSheets->count()} hojas de pallet creadas");
        $this->command->info('   📌 IC/IO/IP, Modelli CQ, Fogli pallet: Cerca "Demo" nelle rispettive sezioni Articoli per verificare tutti gli input');

        // 7.2. Crear datos relacionados con Ofertas
        $this->command->info('💼 Creando datos relacionados con ofertas...');
        $activities = OfferActivity::factory()->count(5)->create();
        // Attività DEMO-ALL: per Offerte/Attività (cercare "Demo All")
        $demoActivity = OfferActivity::factory()->create([
            'name' => 'Demo All - Attività',
            'removed' => false,
        ]);
        $activities = $activities->merge(collect([$demoActivity]));
        $sectors = OfferSector::factory()->count(5)->create();
        // Settore DEMO-ALL: per Offerte/Settori (cercare "Demo All")
        $demoSector = OfferSector::factory()->create([
            'name' => 'Demo All - Settori',
            'removed' => false,
        ]);
        $sectors = $sectors->merge(collect([$demoSector]));
        $seasonalities = OfferSeasonality::factory()->count(4)->create();
        // Stagionalità DEMO-ALL (Offerte > Stagionalità)
        $demoSeasonality = OfferSeasonality::factory()->create([
            'name' => 'Demo All - Stagionalità',
            'removed' => false,
        ]);
        $seasonalities = $seasonalities->merge(collect([$demoSeasonality]));
        $lasFamilies = OfferLasFamily::factory()->count(5)->create();
        // Famiglie LAS DEMO-ALL (Offerte > Famiglie LAS)
        $demoLasFamily = OfferLasFamily::factory()->create([
            'code' => 'LAS-FAM-DEMO',
            'name' => 'Demo All - Famiglie LAS',
            'removed' => false,
        ]);
        $lasFamilies = $lasFamilies->merge(collect([$demoLasFamily]));
        $lasWorkLines = OfferLasWorkLine::factory()->count(5)->create();
        // Linee di lavoro DEMO-ALL (Offerte > Linee di lavoro)
        $demoLasWorkLine = OfferLasWorkLine::factory()->create([
            'code' => 'LWL-DEMO',
            'name' => 'Demo All - Linee di lavoro',
            'removed' => false,
        ]);
        $lasWorkLines = $lasWorkLines->merge(collect([$demoLasWorkLine]));
        $lsResources = OfferLsResource::factory()->count(5)->create();
        // Risorse L&S DEMO-ALL (Offerte > Risorse L&S)
        $demoLsResource = OfferLsResource::factory()->create([
            'code' => 'LSR-DEMO',
            'name' => 'Demo All - Risorse L&S',
            'removed' => false,
        ]);
        $lsResources = $lsResources->merge(collect([$demoLsResource]));
        $orderTypes = OfferTypeOrder::factory()->count(5)->create();
        // Tipi di ordine DEMO-ALL (Offerte > Tipi di ordine)
        $demoOrderType = OfferTypeOrder::factory()->create([
            'code' => 'ORD-TIPO-DEMO',
            'name' => 'Demo All - Tipi ordine',
            'removed' => false,
        ]);
        $orderTypes = $orderTypes->merge(collect([$demoOrderType]));
        $offerTypes = OfferType::factory()->count(4)->create();
        // Tipi di offerta DEMO-ALL (Offerte > Tipi di offerta)
        $demoOfferType = OfferType::factory()->create([
            'name' => 'Demo All - Tipi offerta',
            'removed' => false,
        ]);
        $offerTypes = $offerTypes->merge(collect([$demoOfferType]));
        $operationCategories = OfferOperationCategory::factory()->count(5)->create();
        $operations = collect();
        foreach ($operationCategories as $category) {
            $categoryOperations = OfferOperation::factory()
                ->count(rand(3, 6))
                ->create(['category_uuid' => $category->uuid]);
            $operations = $operations->merge($categoryOperations);
        }
        // Categoria e operazione DEMO-ALL (Offerte > Categorie operazioni, Offerte > Operazioni)
        $demoOperationCategory = OfferOperationCategory::factory()->create([
            'code' => 'CAT-OP-DEMO',
            'name' => 'Demo All - Categorie operazioni',
            'removed' => false,
        ]);
        $operationCategories = $operationCategories->merge(collect([$demoOperationCategory]));
        $demoOperation = OfferOperation::factory()->create([
            'category_uuid' => $demoOperationCategory->uuid,
            'codice' => 'OP-DEMO-ALL',
            'codice_univoco' => 'UNI-DEMO-ALL',
            'descrizione' => 'Demo All - Operazione per Cerca e verifica',
            'secondi_operazione' => 120,
            'filename' => null,
            'removed' => false,
        ]);
        $operations = $operations->merge(collect([$demoOperation]));

        // Archivos placeholder para OfferOperation (descarga operaciones: disk public, offer-operations/uuid_filename)
        $offerOpsDir = storage_path('app/public/offer-operations');
        if (! is_dir($offerOpsDir)) {
            mkdir($offerOpsDir, 0755, true);
        }
        foreach ($operations as $op) {
            if (! empty($op->filename)) {
                $storedPath = 'offer-operations/'.$op->uuid.'_'.basename($op->filename);
                $fullPath = storage_path('app/public/'.$storedPath);
                if (! file_exists($fullPath)) {
                    file_put_contents($fullPath, "File di test generato dal seeder. Placeholder per download.\n");
                }
                $op->update(['filename' => $storedPath]);
            }
        }

        $this->command->info("   ✅ {$activities->count()} actividades, {$sectors->count()} sectores, {$seasonalities->count()} estacionalidades creadas");
        $this->command->info("   ✅ {$lasFamilies->count()} familias LAS, {$lasWorkLines->count()} líneas de trabajo, {$lsResources->count()} recursos L&S creados");
        $this->command->info("   ✅ {$orderTypes->count()} tipos de orden, {$operationCategories->count()} categorías de operaciones, {$operations->count()} operaciones creadas");

        // 8. Crear Ofertas
        $this->command->info('💼 Creando ofertas...');
        $offers = collect();

        // Ottenere l'ultimo numero di offerta esistente per evitare conflitti
        $lastOfferNumber = Offer::where('offer_number', 'like', date('Y').'_%')
            ->orderBy('offer_number', 'desc')
            ->value('offer_number');

        $nextOfferSequence = 1;
        if ($lastOfferNumber) {
            // Estrarre il numero sequenziale dall'ultimo offer_number (formato: YYYY_NNN_01_A)
            $parts = explode('_', $lastOfferNumber);
            if (count($parts) >= 2 && is_numeric($parts[1])) {
                $nextOfferSequence = (int) $parts[1] + 1;
            }
        }

        foreach ($customers as $customer) {
            $customerDivisions = $divisions->where('customer_uuid', $customer->uuid);
            if ($customerDivisions->isEmpty()) {
                continue;
            }

            $offerCount = rand(2, 4);
            for ($i = 0; $i < $offerCount; $i++) {
                $offerNumber = date('Y').'_'.str_pad($nextOfferSequence, 3, '0', STR_PAD_LEFT).'_01_A';
                $nextOfferSequence++;

                $offer = Offer::factory()->create([
                    'customer_uuid' => $customer->uuid,
                    'customerdivision_uuid' => $customerDivisions->random()->uuid,
                    'offer_number' => $offerNumber,
                    // Asignar datos relacionados con ofertas aleatoriamente
                    'activity_uuid' => $activities->random()->uuid,
                    'sector_uuid' => $sectors->random()->uuid,
                    'seasonality_uuid' => $seasonalities->random()->uuid,
                    'type_uuid' => $offerTypes->random()->uuid,
                    'lasfamily_uuid' => $lasFamilies->random()->uuid,
                    'lasworkline_uuid' => $lasWorkLines->random()->uuid,
                    'lsresource_uuid' => $lsResources->random()->uuid,
                    'order_type_uuid' => $orderTypes->random()->uuid,
                    // Asegurar que todos los campos opcionales tengan valores
                    'offer_date' => $faker->dateTimeBetween('-1 year', 'now'),
                    'validity_date' => $faker->dateTimeBetween('now', '+1 year'),
                    'customer_ref' => $faker->numerify('REF-#####'),
                    'article_code_ref' => $faker->bothify('ART-???-####'),
                    'provisional_description' => $faker->sentence(10),
                    'unit_of_measure' => $faker->randomElement(['PZ', 'KG', 'L', 'M', 'CFZ']),
                    'quantity' => $faker->randomFloat(2, 100, 10000),
                    'piece' => $faker->numberBetween(1, 100),
                    'declared_weight_cfz' => $faker->randomFloat(3, 0.1, 10),
                    'declared_weight_pz' => $faker->randomFloat(3, 0.01, 1),
                    'notes' => $faker->text(200),
                    'expected_workers' => $faker->numberBetween(1, 10),
                    'expected_revenue' => $faker->randomFloat(2, 1000, 100000),
                    'rate_cfz' => $faker->randomFloat(4, 0.1, 100),
                    'rate_pz' => $faker->randomFloat(4, 0.01, 10),
                    'rate_rounding_cfz' => $faker->randomFloat(4, 0.01, 1),
                    'rate_increase_cfz' => $faker->randomFloat(4, -10, 50),
                    'materials_euro' => $faker->randomFloat(2, 100, 10000),
                    'logistics_euro' => $faker->randomFloat(2, 50, 5000),
                    'other_euro' => $faker->randomFloat(2, 0, 2000),
                    'offer_notes' => $faker->text(300),
                    'ls_setup_cost' => $faker->randomFloat(2, 0, 100),
                    'ls_other_costs' => $faker->randomFloat(2, 0, 5000),
                    'approval_status' => $faker->randomElement([0, 1, 2]),
                    'removed' => false,
                ]);

                // Crear operaciones para esta oferta (OfferOperationList)
                $operationCount = rand(2, 5);
                $selectedOperations = $operations->random(min($operationCount, $operations->count()));
                foreach ($selectedOperations as $operation) {
                    OfferOperationList::factory()->create([
                        'offer_uuid' => $offer->uuid,
                        'offeroperation_uuid' => $operation->uuid,
                        'num_op' => rand(1, 10), // Numero intero tra 1 e 10
                    ]);
                }

                $offers->push($offer);
            }
        }
        // Offerta DEMO-ALL: tutti i campi + operazioni (Offerte → cercare 2026_999_01_A)
        $demoOffer = Offer::factory()->create([
            'customer_uuid' => $demoCustomer->uuid,
            'customerdivision_uuid' => $demoDiv1->uuid,
            'offer_number' => date('Y').'_999_01_A',
            'activity_uuid' => $demoActivity->uuid,
            'sector_uuid' => $demoSector->uuid,
            'seasonality_uuid' => $demoSeasonality->uuid,
            'type_uuid' => $demoOfferType->uuid,
            'lasfamily_uuid' => $demoLasFamily->uuid,
            'lasworkline_uuid' => $demoLasWorkLine->uuid,
            'lsresource_uuid' => $demoLsResource->uuid,
            'order_type_uuid' => $demoOrderType->uuid,
            'offer_date' => now()->subMonths(2),
            'validity_date' => now()->addYear(),
            'customer_ref' => 'REF-DEMO-ALL',
            'article_code_ref' => 'ART-DEMO-ALL',
            'provisional_description' => 'Demo All: tutti i campi offerta compilati per verificare gli input.',
            'unit_of_measure' => 'CFZ',
            'quantity' => 5000,
            'piece' => 24,
            'declared_weight_cfz' => 12.5,
            'declared_weight_pz' => 0.52,
            'notes' => 'Note demo offerta.',
            'expected_workers' => 5,
            'expected_revenue' => 50000,
            'rate_cfz' => 0.06399,
            'rate_pz' => 4.28745,
            'rate_rounding_cfz' => 0.01,
            'rate_increase_cfz' => 5.5,
            'materials_euro' => 5000,
            'logistics_euro' => 1500,
            'other_euro' => 500,
            'offer_notes' => 'Offer notes demo all.',
            'ls_setup_cost' => 100,
            'ls_other_costs' => 200,
            'approval_status' => 1,
            'removed' => false,
        ]);
        // Lista operazioni demo: includere sempre l'operazione Demo All + altre 4
        $otherOperations = $operations->where('uuid', '!=', $demoOperation->uuid)->take(4);
        OfferOperationList::factory()->create([
            'offer_uuid' => $demoOffer->uuid,
            'offeroperation_uuid' => $demoOperation->uuid,
            'num_op' => 1,
        ]);
        foreach ($otherOperations as $operation) {
            OfferOperationList::factory()->create([
                'offer_uuid' => $demoOffer->uuid,
                'offeroperation_uuid' => $operation->uuid,
                'num_op' => rand(2, 10),
            ]);
        }
        $offers->push($demoOffer);
        $this->command->info("   ✅ {$offers->count()} ofertas creadas (1 demo: 2026_999_01_A)");
        $this->command->info('   📌 Attività demo: cercare "Demo All" in Offerte > Attività');
        $this->command->info('   📌 Settori demo: cercare "Demo All" in Offerte > Settori');
        $this->command->info('   📌 Stagionalità demo: cercare "Demo All" in Offerte > Stagionalità');
        $this->command->info('   📌 Tipi offerta, Famiglie LAS, Linee lavoro, Risorse L&S, Tipi ordine: cercare "Demo All" nelle rispettive sezioni Offerte');
        $this->command->info('   📌 Categorie operazioni / Operazioni: cercare "Demo All" o "OP-DEMO-ALL" in Offerte > Categorie operazioni, Offerte > Operazioni');

        // 9. Creare articoli
        $this->command->info('📦 Creando artículos...');
        $articles = collect();

        // Articolo DEMO con TUTTI i campi compilati per verificare tutti gli input (Show/Edit/Duplica)
        if ($demoOffer && $articleICs->isNotEmpty() && $articleIOs->isNotEmpty() && $articleIPs->isNotEmpty()) {
            $demoArticle = Article::factory()->create([
                'offer_uuid' => $demoOffer->uuid,
                'cod_article_las' => 'LAS-DEMO-ALL',
                'visibility_cod' => true,
                'stock_managed' => false,
                'cod_article_client' => 'CLI-DEMO-001',
                'article_descr' => 'Demo: tutti i campi compilati per verificare gli input (cercare LAS-DEMO-ALL)',
                'additional_descr' => 'Articolo demo con tutti i campi compilati per verificare gli input in Visualizza, Modifica e Duplica.',
                'article_category' => $demoArticleCategory->uuid,
                'um' => 'KG',
                'lot_attribution' => 0, // A carico del cliente
                'expiration_attribution' => 1, // A carico ns.
                'ean' => '8569772586522',
                'db' => 0, // A carico del cliente
                'pallet_uuid' => $demoPalletType->uuid,
                'plan_packaging' => 6,
                'pallet_plans' => 3,
                'line_layout' => 'LAY-DEMO.pdf',
                'weight_kg' => 34.527,
                'length_cm' => 138.63,
                'depth_cm' => 156.06,
                'height_cm' => 34.69,
                'labels_external' => 0, // Non presenti
                'labels_pvp' => 0,
                'value_pvp' => 370.69,
                'labels_ingredient' => 2, // Da ricevere
                'labels_data_variable' => 0,
                'label_of_jumpers' => 0,
                'nominal_weight_control' => 0, // CONTROLLO PESO ALMENO
                'weight_unit_of_measur' => 'MG',
                'weight_value' => 44.999,
                'object_control_weight' => 0, // PRODOTTO NUDO
                'allergens' => false,
                'pallet_sheet' => $demoPalletSheet->uuid,
                'model_uuid' => $demoModelSCQ->uuid,
                'packaging_instruct_uuid' => $demoArticleIC->uuid,
                'operating_instruct_uuid' => $demoArticleIO->uuid,
                'palletizing_instruct_uuid' => $demoArticleIP->uuid,
                'machinery_uuid' => $demoMachinery->uuid,
                'materials_uuid' => $demoMaterial->uuid,
                'article_critical_uuid' => $demoCriticalIssue->uuid,
                'critical_issues_uuid' => $demoCriticalIssue->uuid,
                'check_material' => 1,
                'customer_samples_list' => 1, // Pre produzione
                'production_approval_checkbox' => true,
                'production_approval_employee' => $demoEmployee->uuid,
                'production_approval_date' => now()->subDays(10),
                'production_approval_notes' => 'Approvazione produzione demo.',
                'approv_quality_checkbox' => true,
                'approv_quality_employee' => $demoEmployee->uuid,
                'approv_quality_date' => now()->subDays(8),
                'approv_quality_notes' => 'Nota qualità demo.',
                'commercial_approval_checkbox' => true,
                'commercial_approval_employee' => $demoEmployee->uuid,
                'commercial_approval_date' => now()->subDays(5),
                'commercial_approval_notes' => 'Approvazione commerciale demo.',
                'client_approval_checkbox' => true,
                'client_approval_employee' => $demoEmployee->uuid,
                'client_approval_date' => now()->subDays(2),
                'client_approval_notes' => 'Ut cumque odio iusto et. Deleniti aliquid quos id. Nisi ducimus reiciendis commodi nobis earum maiores.',
                'check_approval' => '1',
                'media_reale_cfz_h_pz' => 346.1761,
                'removed' => false,
            ]);
            $demoOffer->articles()->attach($demoArticle->uuid, [
                'uuid' => \Illuminate\Support\Str::uuid()->toString(),
                'removed' => false,
            ]);
            $demoArticle->packagingInstructions()->attach($demoArticleIC->uuid, [
                'uuid' => \Illuminate\Support\Str::uuid()->toString(),
                'removed' => false,
            ]);
            $demoArticle->operatingInstructions()->attach($demoArticleIO->uuid, [
                'uuid' => \Illuminate\Support\Str::uuid()->toString(),
                'removed' => false,
            ]);
            $demoArticle->palletizingInstructions()->attach($demoArticleIP->uuid, [
                'uuid' => \Illuminate\Support\Str::uuid()->toString(),
                'removed' => false,
            ]);
            // Materiali, macchinari e criticità per il demo (includere sempre i record Demo All)
            $demoArticle->materials()->attach($demoMaterial->uuid, [
                'uuid' => \Illuminate\Support\Str::uuid()->toString(),
                'removed' => false,
            ]);
            $otherMaterial = $materials->where('uuid', '!=', $demoMaterial->uuid)->first();
            if ($otherMaterial) {
                $demoArticle->materials()->attach($otherMaterial->uuid, [
                    'uuid' => \Illuminate\Support\Str::uuid()->toString(),
                    'removed' => false,
                ]);
            }
            $demoArticle->machinery()->attach($demoMachinery->uuid, [
                'uuid' => \Illuminate\Support\Str::uuid()->toString(),
                'removed' => false,
                'value' => '42',
            ]);
            $otherMachinery = $machinery->where('uuid', '!=', $demoMachinery->uuid)->first();
            if ($otherMachinery) {
                $demoArticle->machinery()->attach($otherMachinery->uuid, [
                    'uuid' => \Illuminate\Support\Str::uuid()->toString(),
                    'removed' => false,
                    'value' => '100',
                ]);
            }
            $demoArticle->criticalIssues()->attach($demoCriticalIssue->uuid, [
                'uuid' => \Illuminate\Support\Str::uuid()->toString(),
                'removed' => false,
            ]);
            $otherCriticalIssue = $criticalIssues->where('uuid', '!=', $demoCriticalIssue->uuid)->first();
            if ($otherCriticalIssue) {
                $demoArticle->criticalIssues()->attach($otherCriticalIssue->uuid, [
                    'uuid' => \Illuminate\Support\Str::uuid()->toString(),
                    'removed' => false,
                ]);
            }
            $articles->push($demoArticle);
        }

        // Garantizar que LAS-DEMO-ALL tenga siempre 2 Materiali di Consumo incluso Demo All
        $demoArticleForMaterials = $articles->firstWhere('cod_article_las', 'LAS-DEMO-ALL');
        if ($demoArticleForMaterials && $materials->count() >= 2) {
            $twoMaterialUuids = collect([$demoMaterial->uuid])->merge(
                $materials->where('uuid', '!=', $demoMaterial->uuid)->take(1)->pluck('uuid')
            );
            $syncData = $twoMaterialUuids->mapWithKeys(fn ($uuid) => [
                $uuid => ['uuid' => \Illuminate\Support\Str::uuid()->toString(), 'removed' => false],
            ])->all();
            $demoArticleForMaterials->materials()->sync($syncData);
        }

        foreach ($offers as $offer) {
            $articleCount = rand(3, 6);
            for ($i = 0; $i < $articleCount; $i++) {
                // Determinar si tiene aprobaciones
                $hasProductionApproval = $faker->boolean(50);
                $hasQualityApproval = $faker->boolean(50);
                $hasCommercialApproval = $faker->boolean(50);
                $hasClientApproval = $faker->boolean(50);

                $article = Article::factory()->create([
                    'offer_uuid' => $offer->uuid,
                    'materials_uuid' => $materials->random()?->uuid,
                    'machinery_uuid' => $machinery->random()?->uuid,
                    'pallet_uuid' => $palletTypes->random()?->uuid,
                    'article_category' => $categories->random()?->uuid,
                    'model_uuid' => $modelSCQs->random()?->uuid,
                    'article_critical_uuid' => $criticalIssues->random()?->uuid,
                    'critical_issues_uuid' => $criticalIssues->random()?->uuid,
                    'pallet_sheet' => $palletSheets->isNotEmpty() ? $palletSheets->random()->uuid : null,
                    'production_approval_checkbox' => $hasProductionApproval,
                    'production_approval_employee' => $hasProductionApproval ? $employees->random()?->uuid : null,
                    'production_approval_date' => $hasProductionApproval ? $faker->dateTimeBetween('-1 year', 'now') : null,
                    'production_approval_notes' => $hasProductionApproval && $faker->boolean(30) ? $faker->text(200) : null,
                    'approv_quality_checkbox' => $hasQualityApproval,
                    'approv_quality_employee' => $hasQualityApproval ? $employees->random()?->uuid : null,
                    'approv_quality_date' => $hasQualityApproval ? $faker->dateTimeBetween('-1 year', 'now') : null,
                    'approv_quality_notes' => $hasQualityApproval && $faker->boolean(30) ? $faker->text(200) : null,
                    'commercial_approval_checkbox' => $hasCommercialApproval,
                    'commercial_approval_employee' => $hasCommercialApproval ? $employees->random()?->uuid : null,
                    'commercial_approval_date' => $hasCommercialApproval ? $faker->dateTimeBetween('-1 year', 'now') : null,
                    'commercial_approval_notes' => $hasCommercialApproval && $faker->boolean(30) ? $faker->text(200) : null,
                    'client_approval_checkbox' => $hasClientApproval,
                    'client_approval_employee' => $hasClientApproval ? $employees->random()?->uuid : null,
                    'client_approval_date' => $hasClientApproval ? $faker->dateTimeBetween('-1 year', 'now') : null,
                    'client_approval_notes' => $hasClientApproval && $faker->boolean(30) ? $faker->text(200) : null,
                    'check_approval' => $hasClientApproval ? 1 : 0, // Deve coincidere con client_approval_checkbox secondo il legacy
                ]);

                // Pivot offerarticles: l'app usa $offer->articles() per validare e elencare gli articoli dell'offerta
                $offer->articles()->attach($article->uuid, [
                    'uuid' => \Illuminate\Support\Str::uuid()->toString(),
                    'removed' => false,
                ]);

                // Assegnare SEMPRE almeno 1 IC, 1 IO, 1 IP a ogni articolo (affinché in Visualizza compaiano le 3 schede)
                if ($articleICs->isNotEmpty()) {
                    $one = $articleICs->take(1);
                    $more = $articleICs->count() > 1 ? $articleICs->random(min(rand(0, 2), $articleICs->count() - 1))->unique('uuid') : collect();
                    foreach ($one->merge($more)->unique('uuid') as $ic) {
                        $article->packagingInstructions()->attach($ic->uuid, [
                            'uuid' => \Illuminate\Support\Str::uuid()->toString(),
                            'removed' => false,
                        ]);
                    }
                }
                if ($articleIOs->isNotEmpty()) {
                    $one = $articleIOs->take(1);
                    $more = $articleIOs->count() > 1 ? $articleIOs->random(min(rand(0, 2), $articleIOs->count() - 1))->unique('uuid') : collect();
                    foreach ($one->merge($more)->unique('uuid') as $io) {
                        $article->operatingInstructions()->attach($io->uuid, [
                            'uuid' => \Illuminate\Support\Str::uuid()->toString(),
                            'removed' => false,
                        ]);
                    }
                }
                if ($articleIPs->isNotEmpty()) {
                    $one = $articleIPs->take(1);
                    $more = $articleIPs->count() > 1 ? $articleIPs->random(min(rand(0, 2), $articleIPs->count() - 1))->unique('uuid') : collect();
                    foreach ($one->merge($more)->unique('uuid') as $ip) {
                        $article->palletizingInstructions()->attach($ip->uuid, [
                            'uuid' => \Illuminate\Support\Str::uuid()->toString(),
                            'removed' => false,
                        ]);
                    }
                }

                // Asignar relaciones many-to-many: materials, machinery (con value en pivot), criticalIssues
                if ($materials->isNotEmpty()) {
                    $selectedMaterials = $materials->random(min(rand(1, 3), $materials->count()));
                    foreach ($selectedMaterials as $material) {
                        $article->materials()->attach($material->uuid, [
                            'uuid' => \Illuminate\Support\Str::uuid()->toString(),
                            'removed' => false,
                        ]);
                    }
                }

                if ($machinery->isNotEmpty()) {
                    $selectedMachinery = $machinery->random(min(rand(1, 2), $machinery->count()));
                    foreach ($selectedMachinery as $mach) {
                        $article->machinery()->attach($mach->uuid, [
                            'uuid' => \Illuminate\Support\Str::uuid()->toString(),
                            'removed' => false,
                            'value' => $faker->randomElement([$faker->numerify('##'), $faker->numerify('#,#'), $faker->word()]),
                        ]);
                    }
                }

                // CriticalIssues: assegnare 0-2 problemi critici casuali (non tutti gli articoli hanno problemi)
                if ($criticalIssues->isNotEmpty() && $faker->boolean(60)) { // 60% de probabilidad
                    $selectedCriticalIssues = $criticalIssues->random(min(rand(1, 2), $criticalIssues->count()));
                    foreach ($selectedCriticalIssues as $criticalIssue) {
                        $article->criticalIssues()->attach($criticalIssue->uuid, [
                            'uuid' => \Illuminate\Support\Str::uuid()->toString(),
                            'removed' => false,
                        ]);
                    }
                }

                $articles->push($article);
            }
        }
        $this->command->info("   ✅ {$articles->count()} artículos creados");
        $this->command->info('   📌 Articolo demo con tutti i campi: cercare "LAS-DEMO-ALL" → Visualizza / Modifica / Duplica');

        // Archivos placeholder para Article line_layout (descarga layout linea: storage/app/line_layout/{uuid}/{filename})
        $lineLayoutPlaceholder = "File di test generato dal seeder. Placeholder layout linea.\n";
        foreach ($articles as $article) {
            if (! empty($article->line_layout)) {
                $dir = storage_path('app/line_layout/'.$article->uuid);
                if (! is_dir($dir)) {
                    mkdir($dir, 0755, true);
                }
                $filePath = $dir.'/'.$article->line_layout;
                if (! file_exists($filePath)) {
                    file_put_contents($filePath, $lineLayoutPlaceholder);
                }
            }
        }

        // Verifica Consumi Materiali: creare record per poter testare la sezione in Articoli
        $checkMaterialCount = 0;
        foreach ($articles as $article) {
            if ($materials->isEmpty()) {
                continue;
            }
            // Circa 40% degli articoli avranno 1-3 materiali di verifica
            if ($faker->boolean(40)) {
                $selectedMaterials = $materials->random(min(rand(1, 3), $materials->count()));
                foreach ($selectedMaterials as $material) {
                    ArticleCheckMaterial::create([
                        'uuid' => \Illuminate\Support\Str::uuid()->toString(),
                        'article_uuid' => $article->uuid,
                        'material_uuid' => $material->uuid,
                        'um' => $material->um ?? 'PZ',
                        'quantity_expected' => $faker->randomFloat(2, 1, 500),
                        'quantity_effective' => $faker->boolean(70) ? $faker->randomFloat(2, 1, 500) : null,
                        'removed' => false,
                    ]);
                    $checkMaterialCount++;
                }
            }
        }
        // Assicurare che l'articolo demo LAS-DEMO-ALL abbia almeno 2 Verifica Consumi (e 2 Materiali di Consumo) per verificare il flusso
        $demoArticle = $articles->firstWhere('cod_article_las', 'LAS-DEMO-ALL');
        if ($demoArticle && $materials->isNotEmpty()) {
            $existingChecks = ArticleCheckMaterial::where('article_uuid', $demoArticle->uuid)->where('removed', false)->get();
            $needed = max(0, 2 - $existingChecks->count());
            if ($needed > 0) {
                $usedMaterialUuids = $existingChecks->pluck('material_uuid')->toArray();
                $candidates = $materials->filter(fn ($m) => ! in_array($m->uuid, $usedMaterialUuids));
                foreach ($candidates->take($needed) as $material) {
                    ArticleCheckMaterial::create([
                        'uuid' => \Illuminate\Support\Str::uuid()->toString(),
                        'article_uuid' => $demoArticle->uuid,
                        'material_uuid' => $material->uuid,
                        'um' => $material->um ?? 'PZ',
                        'quantity_expected' => $faker->randomFloat(2, 50, 400),
                        'quantity_effective' => $faker->boolean(80) ? $faker->randomFloat(2, 40, 450) : null,
                        'removed' => false,
                    ]);
                    $checkMaterialCount++;
                }
            }
        }
        $this->command->info("   ✅ {$checkMaterialCount} registri Verifica Consumi Materiali creati");

        // 10. Crear Órdenes con diferentes status
        $this->command->info('📋 Creando órdenes con diferentes status...');

        $orderProductionNumberService = app(OrderProductionNumberService::class);

        // Assicurare che tutte le divisioni abbiano almeno un indirizzo di spedizione
        $this->command->info('📍 Verificando direcciones de envío...');
        foreach ($divisions as $division) {
            if ($shippingAddresses->where('customerdivision_uuid', $division->uuid)->isEmpty()) {
                $newAddresses = CustomerShippingAddress::factory()
                    ->count(2)
                    ->create(['customerdivision_uuid' => $division->uuid]);
                $shippingAddresses = $shippingAddresses->merge($newAddresses);
            }
        }
        $this->command->info("   ✅ Total direcciones: {$shippingAddresses->count()}");

        // Convertir Collection a Eloquent Collection y cargar relaciones
        $articleUuids = $articles->pluck('uuid')->toArray();
        $articlesWithRelations = Article::whereIn('uuid', $articleUuids)
            ->with('offer.customerDivision')
            ->get();

        // Filtrare articoli che hanno offerta e divisione valide
        $validArticles = $articlesWithRelations->filter(function ($article) use ($shippingAddresses) {
            if (! $article->offer || ! $article->offer->customerDivision) {
                return false;
            }
            $division = $article->offer->customerDivision;

            return $shippingAddresses->where('customerdivision_uuid', $division->uuid)->isNotEmpty();
        });

        if ($validArticles->isEmpty()) {
            $this->command->error('❌ No hay artículos válidos con direcciones de envío. Abortando creación de órdenes.');

            return;
        }

        $this->command->info("   ✅ Artículos válidos para órdenes: {$validArticles->count()}");

        // Órdenes: tutti gli stati (0–6) e varietà di date di consegna per simulare la realtà.
        // Negli stati aperti (0–4): prima ordine in ritardo (icona rossa), seconda urgente 0–3 giorni (gialla), altre normali (verde).
        // Evaso/Saldato: date sempre nel passato (in lista icona verde per ordini chiusi).

        // Órdenes Pianificato (status 0) – Variedad de fechas: in ritardo, urgente, normal (simula realidad)
        $ordersPianificato = collect();
        for ($i = 0; $i < min(5, $validArticles->count()); $i++) {
            $article = $validArticles->random();
            $offer = $article->offer;
            $division = $offer->customerDivision;
            $availableAddresses = $shippingAddresses->where('customerdivision_uuid', $division->uuid);
            if ($availableAddresses->isEmpty()) {
                continue;
            }
            $quantity = rand(100, 1000);
            if ($i === 0) {
                $deliveryDate = now()->subDays(rand(2, 14)); // In ritardo → icona rossa in lista
            } elseif ($i === 1) {
                $deliveryDate = now()->addDays(rand(1, 3)); // Urgente (0–3 giorni) → icona gialla
            } else {
                $deliveryDate = now()->addDays(rand(10, 45));
            }
            $order = Order::factory()->create([
                'article_uuid' => $article->uuid,
                'order_production_number' => $orderProductionNumberService->generateNext(),
                'status' => Order::STATUS_PIANIFICATO,
                'quantity' => $quantity,
                'worked_quantity' => 0,
                'delivery_requested_date' => $deliveryDate,
                'expected_production_start_date' => $deliveryDate->copy()->subDays(rand(5, 15)),
                'customershippingaddress_uuid' => $availableAddresses->random()->uuid,
                'number_customer_reference_order' => 'REF-'.str_pad(rand(1000, 9999), 6, '0', STR_PAD_LEFT),
                'line' => rand(1, 5),
                'type_lot' => rand(0, 2),
                'lot' => null,
                'expiration_date' => $deliveryDate->copy()->addDays(rand(30, 365)),
                'external_labels' => rand(0, 2),
                'pvp_labels' => rand(0, 2),
                'ingredients_labels' => rand(0, 2),
                'variable_data_labels' => rand(0, 2),
                'label_of_jumpers' => rand(0, 2),
                'indications_for_shop' => null,
                'indications_for_production' => null,
                'indications_for_delivery' => null,
                'status_semaforo' => json_encode(['etichette' => 0, 'packaging' => 0, 'prodotto' => 0]),
                'motivazione' => null,
                'autocontrollo' => false,
            ]);
            $ordersPianificato->push($order);
        }
        // Ordine DEMO-ALL: articolo LAS-DEMO-ALL con tutti i campi (Ordini → filtrare per articolo LAS-DEMO-ALL)
        $demoArticleForOrder = $validArticles->first(fn ($a) => $a->cod_article_las === 'LAS-DEMO-ALL');
        if ($demoArticleForOrder) {
            $demoOrderDivision = $demoArticleForOrder->offer->customerDivision;
            $demoOrderAddresses = $shippingAddresses->where('customerdivision_uuid', $demoOrderDivision->uuid);
            if ($demoOrderAddresses->isNotEmpty()) {
                $deliveryDate = now()->addDays(30);
                $ordersPianificato->push(Order::factory()->create([
                    'article_uuid' => $demoArticleForOrder->uuid,
                    'order_production_number' => $orderProductionNumberService->generateNext(),
                    'status' => Order::STATUS_PIANIFICATO,
                    'quantity' => 1000,
                    'worked_quantity' => 0,
                    'delivery_requested_date' => $deliveryDate,
                    'expected_production_start_date' => $deliveryDate->copy()->subDays(10),
                    'customershippingaddress_uuid' => $demoOrderAddresses->first()->uuid,
                    'number_customer_reference_order' => 'REF-DEMO-ALL',
                    'line' => 1,
                    'type_lot' => 1,
                    'lot' => 'LOT-DEMO-ALL',
                    'expiration_date' => $deliveryDate->copy()->addDays(180),
                    'external_labels' => 1,
                    'pvp_labels' => 1,
                    'ingredients_labels' => 2,
                    'variable_data_labels' => 1,
                    'label_of_jumpers' => 0,
                    'indications_for_shop' => 'Indicazioni demo per shop.',
                    'indications_for_production' => 'Indicazioni demo per produzione.',
                    'indications_for_delivery' => 'Indicazioni demo per consegna.',
                    'status_semaforo' => json_encode(['etichette' => 0, 'packaging' => 0, 'prodotto' => 0]),
                    'motivazione' => 'Nessuna (ordine demo – tutti i campi compilati per verifica).',
                    'autocontrollo' => true,
                ]));
            }
        }
        $this->command->info("   ✅ {$ordersPianificato->count()} órdenes Pianificato (status 0) creadas (1 demo con LAS-DEMO-ALL)");

        // Órdenes In Allestimento (status 1) – Variedad fechas: ritardo, urgente, normal
        $ordersInAllestimento = collect();
        for ($i = 0; $i < min(5, $validArticles->count()); $i++) {
            $article = $validArticles->random();
            $offer = $article->offer;
            $division = $offer->customerDivision;
            $availableAddresses = $shippingAddresses->where('customerdivision_uuid', $division->uuid);
            if ($availableAddresses->isEmpty()) {
                continue;
            }
            $quantity = rand(100, 1000);
            if ($i === 0) {
                $deliveryDate = now()->subDays(rand(2, 10));
            } elseif ($i === 1) {
                $deliveryDate = now()->addDays(rand(1, 3));
            } else {
                $deliveryDate = now()->addDays(rand(5, 25));
            }

            // Semáforo más realista para fase In Allestimento:
            // - Algunas órdenes completamente rojas (nada listo)
            // - Otras parcialmente listas
            // - Algunas totalmente verdes (listas para lanzar)
            $semaforoPatterns = [
                ['etichette' => 0, 'packaging' => 0, 'prodotto' => 0],
                ['etichette' => 2, 'packaging' => 1, 'prodotto' => 0],
                ['etichette' => 1, 'packaging' => 1, 'prodotto' => 0],
                ['etichette' => 2, 'packaging' => 2, 'prodotto' => 1],
                ['etichette' => 2, 'packaging' => 2, 'prodotto' => 2],
            ];
            $statusSemaforo = $semaforoPatterns[array_rand($semaforoPatterns)];
            $order = Order::factory()->create([
                'article_uuid' => $article->uuid,
                'order_production_number' => $orderProductionNumberService->generateNext(),
                'status' => Order::STATUS_IN_ALLESTIMENTO,
                'quantity' => $quantity,
                'worked_quantity' => 0,
                'delivery_requested_date' => $deliveryDate,
                'expected_production_start_date' => $deliveryDate->copy()->subDays(rand(3, 10)),
                'customershippingaddress_uuid' => $availableAddresses->random()->uuid,
                'number_customer_reference_order' => 'REF-'.str_pad(rand(1000, 9999), 6, '0', STR_PAD_LEFT),
                'line' => rand(1, 5),
                'type_lot' => rand(0, 2),
                'lot' => null,
                'expiration_date' => $deliveryDate->copy()->addDays(rand(30, 365)),
                'external_labels' => rand(0, 2),
                'pvp_labels' => rand(0, 2),
                'ingredients_labels' => rand(0, 2),
                'variable_data_labels' => rand(0, 2),
                'label_of_jumpers' => rand(0, 2),
                'indications_for_shop' => null,
                'indications_for_production' => null,
                'indications_for_delivery' => null,
                'status_semaforo' => json_encode($statusSemaforo),
                'motivazione' => null,
                'autocontrollo' => false,
            ]);
            $ordersInAllestimento->push($order);
        }
        // Orden demo determinista In Allestimento
        if ($validArticles->isNotEmpty()) {
            $demoArticleStatus1 = $validArticles->first();
            $offer = $demoArticleStatus1->offer;
            $division = $offer->customerDivision;
            $availableAddresses = $shippingAddresses->where('customerdivision_uuid', $division->uuid);
            if ($availableAddresses->isNotEmpty()) {
                $deliveryDate = now()->addDays(15);
                $ordersInAllestimento->push(Order::factory()->create([
                    'article_uuid' => $demoArticleStatus1->uuid,
                    'order_production_number' => $orderProductionNumberService->generateNext(),
                    'status' => Order::STATUS_IN_ALLESTIMENTO,
                    'quantity' => 750,
                    'worked_quantity' => 0,
                    'delivery_requested_date' => $deliveryDate,
                    'expected_production_start_date' => $deliveryDate->copy()->subDays(7),
                    'customershippingaddress_uuid' => $availableAddresses->first()->uuid,
                    'number_customer_reference_order' => 'REF-DEMO-STATUS-1',
                    'line' => 1,
                    'type_lot' => 1,
                    'lot' => null,
                    'expiration_date' => $deliveryDate->copy()->addDays(180),
                    'external_labels' => 1,
                    'pvp_labels' => 1,
                    'ingredients_labels' => 1,
                    'variable_data_labels' => 1,
                    'label_of_jumpers' => 1,
                    'indications_for_shop' => 'Demo stato 1 - shop',
                    'indications_for_production' => 'Demo stato 1 - produzione',
                    'indications_for_delivery' => 'Demo stato 1 - consegna',
                    'status_semaforo' => json_encode(['etichette' => 2, 'packaging' => 2, 'prodotto' => 2]),
                    'motivazione' => null,
                    'autocontrollo' => false,
                ]));
            }
        }
        $this->command->info("   ✅ {$ordersInAllestimento->count()} órdenes In Allestimento (status 1) creadas");

        // Órdenes Lanciate (status 2)
        $ordersLanciate = collect();
        for ($i = 0; $i < min(8, $validArticles->count()); $i++) {
            $article = $validArticles->random();
            $offer = $article->offer;
            $division = $offer->customerDivision;
            $availableAddresses = $shippingAddresses->where('customerdivision_uuid', $division->uuid);

            if ($availableAddresses->isEmpty()) {
                continue;
            }

            $quantity = rand(100, 1000);
            if ($i === 0) {
                $deliveryDate = now()->subDays(rand(2, 7));
            } elseif ($i === 1) {
                $deliveryDate = now()->addDays(rand(1, 3));
            } else {
                $deliveryDate = now()->addDays(rand(5, 30));
            }

            // Semáforo para Lanciato: normalmente quasi tutto pronto,
            // ma non sempre completamente verde
            $semaforoPatternsLanciate = [
                ['etichette' => 2, 'packaging' => 1, 'prodotto' => 0],
                ['etichette' => 2, 'packaging' => 2, 'prodotto' => 1],
                ['etichette' => 1, 'packaging' => 2, 'prodotto' => 1],
                ['etichette' => 2, 'packaging' => 2, 'prodotto' => 2],
            ];
            $statusSemaforoLanciate = $semaforoPatternsLanciate[array_rand($semaforoPatternsLanciate)];

            $order = Order::factory()->create([
                'article_uuid' => $article->uuid,
                'order_production_number' => $orderProductionNumberService->generateNext(),
                'status' => Order::STATUS_LANCIATO,
                'quantity' => $quantity,
                'worked_quantity' => 0,
                'delivery_requested_date' => $deliveryDate,
                'expected_production_start_date' => $deliveryDate->copy()->subDays(rand(3, 10)),
                'customershippingaddress_uuid' => $availableAddresses->random()->uuid,
                'number_customer_reference_order' => 'REF-'.str_pad(rand(1000, 9999), 6, '0', STR_PAD_LEFT),
                'line' => rand(1, 5),
                'type_lot' => rand(0, 2),
                'lot' => rand(0, 2) > 0 ? 'LOT-'.str_pad(rand(1, 9999), 5, '0', STR_PAD_LEFT) : null,
                'expiration_date' => $deliveryDate->copy()->addDays(rand(30, 365)),
                'external_labels' => rand(0, 2),
                'pvp_labels' => rand(0, 2),
                'ingredients_labels' => rand(0, 2),
                'variable_data_labels' => rand(0, 2),
                'label_of_jumpers' => rand(0, 2),
                'indications_for_shop' => rand(0, 1) ? 'Indicaciones para tienda: '.$faker->sentence(10) : null,
                'indications_for_production' => rand(0, 1) ? 'Indicaciones para producción: '.$faker->sentence(10) : null,
                'indications_for_delivery' => rand(0, 1) ? 'Indicaciones para entrega: '.$faker->sentence(10) : null,
                'status_semaforo' => json_encode($statusSemaforoLanciate),
                'motivazione' => null,
                'autocontrollo' => false,
            ]);
            $ordersLanciate->push($order);
        }
        // Orden demo determinista Lanciato
        if ($validArticles->isNotEmpty()) {
            $demoArticleStatus2 = $validArticles->first();
            $offer = $demoArticleStatus2->offer;
            $division = $offer->customerDivision;
            $availableAddresses = $shippingAddresses->where('customerdivision_uuid', $division->uuid);
            if ($availableAddresses->isNotEmpty()) {
                $deliveryDate = now()->addDays(20);
                $ordersLanciate->push(Order::factory()->create([
                    'article_uuid' => $demoArticleStatus2->uuid,
                    'order_production_number' => $orderProductionNumberService->generateNext(),
                    'status' => Order::STATUS_LANCIATO,
                    'quantity' => 600,
                    'worked_quantity' => 0,
                    'delivery_requested_date' => $deliveryDate,
                    'expected_production_start_date' => $deliveryDate->copy()->subDays(5),
                    'customershippingaddress_uuid' => $availableAddresses->first()->uuid,
                    'number_customer_reference_order' => 'REF-DEMO-STATUS-2',
                    'line' => 2,
                    'type_lot' => 1,
                    'lot' => 'LOT-DEM02',
                    'expiration_date' => $deliveryDate->copy()->addDays(200),
                    'external_labels' => 1,
                    'pvp_labels' => 1,
                    'ingredients_labels' => 2,
                    'variable_data_labels' => 1,
                    'label_of_jumpers' => 0,
                    'indications_for_shop' => 'Demo stato 2 - shop',
                    'indications_for_production' => 'Demo stato 2 - produzione',
                    'indications_for_delivery' => 'Demo stato 2 - consegna',
                    'status_semaforo' => json_encode(['etichette' => 2, 'packaging' => 2, 'prodotto' => 1]),
                    'motivazione' => null,
                    'autocontrollo' => false,
                ]));
            }
        }
        $this->command->info("   ✅ {$ordersLanciate->count()} órdenes Lanciate (status 2) creadas");

        // Órdenes In Avanzamento (status 3) – Variedad fechas: ritardo, urgente, normal (più 2 demo fisse sotto)
        $ordersInAvanzamento = collect();
        for ($i = 0; $i < min(12, $validArticles->count()); $i++) {
            $article = $validArticles->random();
            $offer = $article->offer;
            $division = $offer->customerDivision;
            $availableAddresses = $shippingAddresses->where('customerdivision_uuid', $division->uuid);

            if ($availableAddresses->isEmpty()) {
                continue;
            }

            $quantity = rand(100, 1000);
            $workedQuantity = rand(10, (int) ($quantity * 0.8));
            if ($i === 0) {
                $deliveryDate = now()->subDays(rand(2, 10));
            } elseif ($i === 1) {
                $deliveryDate = now()->addDays(rand(1, 3));
            } else {
                $deliveryDate = now()->addDays(rand(3, 20));
            }
            $startDate = now()->subDays(rand(1, 5));

            // Semáforo per In Avanzamento: quasi sempre almeno giallo,
            // spesso tutto verde quando l'ordine è vicino al completamento
            $semaforoPatternsAvanzamento = [
                ['etichette' => 1, 'packaging' => 1, 'prodotto' => 1],
                ['etichette' => 2, 'packaging' => 1, 'prodotto' => 1],
                ['etichette' => 2, 'packaging' => 2, 'prodotto' => 1],
                ['etichette' => 2, 'packaging' => 2, 'prodotto' => 2],
            ];
            $statusSemaforoAvanzamento = $semaforoPatternsAvanzamento[array_rand($semaforoPatternsAvanzamento)];

            $order = Order::factory()->create([
                'article_uuid' => $article->uuid,
                'order_production_number' => $orderProductionNumberService->generateNext(),
                'status' => Order::STATUS_IN_AVANZAMENTO,
                'quantity' => $quantity,
                'worked_quantity' => $workedQuantity,
                'delivery_requested_date' => $deliveryDate,
                'expected_production_start_date' => $startDate,
                'customershippingaddress_uuid' => $availableAddresses->random()->uuid,
                'number_customer_reference_order' => 'REF-'.str_pad(rand(1000, 9999), 6, '0', STR_PAD_LEFT),
                'line' => rand(1, 5),
                'type_lot' => rand(0, 2),
                'lot' => rand(0, 2) > 0 ? 'LOT-'.str_pad(rand(1, 9999), 5, '0', STR_PAD_LEFT) : null,
                'expiration_date' => $deliveryDate->copy()->addDays(rand(30, 365)),
                'external_labels' => rand(0, 2),
                'pvp_labels' => rand(0, 2),
                'ingredients_labels' => rand(0, 2),
                'variable_data_labels' => rand(0, 2),
                'label_of_jumpers' => rand(0, 2),
                'indications_for_shop' => rand(0, 1) ? 'Indicaciones para tienda: '.$faker->sentence(10) : null,
                'indications_for_production' => rand(0, 1) ? 'Indicaciones para producción: '.$faker->sentence(10) : null,
                'indications_for_delivery' => rand(0, 1) ? 'Indicaciones para entrega: '.$faker->sentence(10) : null,
                'status_semaforo' => json_encode($statusSemaforoAvanzamento),
                'motivazione' => null,
                'autocontrollo' => $workedQuantity >= $quantity * 0.9,
            ]);
            $ordersInAvanzamento->push($order);
        }
        // Orden demo determinista In Avanzamento
        if ($validArticles->isNotEmpty()) {
            $demoArticleStatus3 = $validArticles->first();
            $offer = $demoArticleStatus3->offer;
            $division = $offer->customerDivision;
            $availableAddresses = $shippingAddresses->where('customerdivision_uuid', $division->uuid);
            if ($availableAddresses->isNotEmpty()) {
                $quantity = 800;
                $workedQuantity = 500;
                $deliveryDate = now()->addDays(10);
                $startDate = now()->subDays(3);
                $ordersInAvanzamento->push(Order::factory()->create([
                    'article_uuid' => $demoArticleStatus3->uuid,
                    'order_production_number' => $orderProductionNumberService->generateNext(),
                    'status' => Order::STATUS_IN_AVANZAMENTO,
                    'quantity' => $quantity,
                    'worked_quantity' => $workedQuantity,
                    'delivery_requested_date' => $deliveryDate,
                    'expected_production_start_date' => $startDate,
                    'customershippingaddress_uuid' => $availableAddresses->first()->uuid,
                    'number_customer_reference_order' => 'REF-DEMO-STATUS-3',
                    'line' => 3,
                    'type_lot' => 2,
                    'lot' => 'LOT-DEM03',
                    'expiration_date' => $deliveryDate->copy()->addDays(150),
                    'external_labels' => 2,
                    'pvp_labels' => 2,
                    'ingredients_labels' => 2,
                    'variable_data_labels' => 2,
                    'label_of_jumpers' => 1,
                    'indications_for_shop' => 'Demo stato 3 - shop',
                    'indications_for_production' => 'Demo stato 3 - produzione',
                    'indications_for_delivery' => 'Demo stato 3 - consegna',
                    'status_semaforo' => json_encode(['etichette' => 2, 'packaging' => 2, 'prodotto' => 2]),
                    'motivazione' => null,
                    'autocontrollo' => false,
                ]));
            }
        }
        // Demo urgenza: 2 ordini In Avanzamento per testare gli iconi in lista
        // (triangolo rosso = in ritardo, triangolo giallo = urgente 0–3 giorni).
        if ($validArticles->isNotEmpty() && $shippingAddresses->isNotEmpty()) {
            $demoArt = $validArticles->first();
            $demoDivision = $demoArt->offer->customerDivision;
            $demoAddresses = $shippingAddresses->where('customerdivision_uuid', $demoDivision->uuid);
            if ($demoAddresses->isNotEmpty()) {
                $addr = $demoAddresses->first();
                // Ordine in ritardo (data consegna nel passato) → icona rossa in lista
                $ordersInAvanzamento->push(Order::factory()->create([
                    'article_uuid' => $demoArt->uuid,
                    'order_production_number' => $orderProductionNumberService->generateNext(),
                    'status' => Order::STATUS_IN_AVANZAMENTO,
                    'quantity' => 500,
                    'worked_quantity' => 200,
                    'delivery_requested_date' => now()->subDays(5),
                    'expected_production_start_date' => now()->subDays(10),
                    'customershippingaddress_uuid' => $addr->uuid,
                    'number_customer_reference_order' => 'REF-DEMO-RITARDO',
                    'line' => 1,
                    'type_lot' => 1,
                    'lot' => 'LOT-DEM-R',
                    'expiration_date' => now()->addDays(90),
                    'external_labels' => 1,
                    'pvp_labels' => 1,
                    'ingredients_labels' => 1,
                    'variable_data_labels' => 1,
                    'label_of_jumpers' => 0,
                    'indications_for_shop' => null,
                    'indications_for_production' => null,
                    'indications_for_delivery' => null,
                    'status_semaforo' => json_encode(['etichette' => 2, 'packaging' => 2, 'prodotto' => 2]),
                    'motivazione' => null,
                    'autocontrollo' => false,
                ]));
                // Ordine urgente (consegna tra 2 giorni) → icona gialla in lista
                $ordersInAvanzamento->push(Order::factory()->create([
                    'article_uuid' => $demoArt->uuid,
                    'order_production_number' => $orderProductionNumberService->generateNext(),
                    'status' => Order::STATUS_IN_AVANZAMENTO,
                    'quantity' => 400,
                    'worked_quantity' => 150,
                    'delivery_requested_date' => now()->addDays(2),
                    'expected_production_start_date' => now()->subDays(3),
                    'customershippingaddress_uuid' => $addr->uuid,
                    'number_customer_reference_order' => 'REF-DEMO-URGENTE',
                    'line' => 2,
                    'type_lot' => 1,
                    'lot' => 'LOT-DEM-U',
                    'expiration_date' => now()->addDays(120),
                    'external_labels' => 1,
                    'pvp_labels' => 1,
                    'ingredients_labels' => 1,
                    'variable_data_labels' => 1,
                    'label_of_jumpers' => 0,
                    'indications_for_shop' => null,
                    'indications_for_production' => null,
                    'indications_for_delivery' => null,
                    'status_semaforo' => json_encode(['etichette' => 2, 'packaging' => 2, 'prodotto' => 2]),
                    'motivazione' => null,
                    'autocontrollo' => false,
                ]));
            }
        }

        $this->command->info("   ✅ {$ordersInAvanzamento->count()} órdenes In Avanzamento (status 3) creadas");

        // Órdenes Sospese (status 4)
        $motivazioni = [
            'Falta de material',
            'Problema técnico en maquinaria',
            'Esperando aprobación del cliente',
            'Cambio en especificaciones',
            'Problema de calidad detectado',
            'Falta de personal',
            'Revisión de proceso requerida',
        ];

        $ordersSospese = collect();
        for ($i = 0; $i < min(5, $validArticles->count()); $i++) {
            $article = $validArticles->random();
            $offer = $article->offer;
            $division = $offer->customerDivision;
            $availableAddresses = $shippingAddresses->where('customerdivision_uuid', $division->uuid);

            if ($availableAddresses->isEmpty()) {
                continue;
            }

            $quantity = rand(100, 1000);
            if ($i === 0) {
                $deliveryDate = now()->subDays(rand(2, 14));
            } elseif ($i === 1) {
                $deliveryDate = now()->addDays(rand(1, 3));
            } else {
                $deliveryDate = now()->addDays(rand(5, 30));
            }

            // Semáforo per Sospeso: motivazioni diverse, semaforo spesso "a metà"
            $semaforoPatternsSospese = [
                ['etichette' => 0, 'packaging' => 1, 'prodotto' => 1],
                ['etichette' => 2, 'packaging' => 0, 'prodotto' => 1],
                ['etichette' => 1, 'packaging' => 2, 'prodotto' => 0],
                ['etichette' => 1, 'packaging' => 1, 'prodotto' => 1],
            ];
            $statusSemaforoSospese = $semaforoPatternsSospese[array_rand($semaforoPatternsSospese)];

            $order = Order::factory()->create([
                'article_uuid' => $article->uuid,
                'order_production_number' => $orderProductionNumberService->generateNext(),
                'status' => Order::STATUS_SOSPESO,
                'quantity' => $quantity,
                'worked_quantity' => rand(10, (int) ($quantity * 0.5)),
                'delivery_requested_date' => $deliveryDate,
                'expected_production_start_date' => now()->subDays(rand(1, 10)),
                'customershippingaddress_uuid' => $availableAddresses->random()->uuid,
                'number_customer_reference_order' => 'REF-'.str_pad(rand(1000, 9999), 6, '0', STR_PAD_LEFT),
                'line' => rand(1, 5),
                'type_lot' => rand(0, 2),
                'lot' => rand(0, 2) > 0 ? 'LOT-'.str_pad(rand(1, 9999), 5, '0', STR_PAD_LEFT) : null,
                'expiration_date' => $deliveryDate->copy()->addDays(rand(30, 365)),
                'external_labels' => rand(0, 2),
                'pvp_labels' => rand(0, 2),
                'ingredients_labels' => rand(0, 2),
                'variable_data_labels' => rand(0, 2),
                'label_of_jumpers' => rand(0, 2),
                'indications_for_shop' => rand(0, 1) ? 'Indicaciones para tienda: '.$faker->sentence(10) : null,
                'indications_for_production' => rand(0, 1) ? 'Indicaciones para producción: '.$faker->sentence(10) : null,
                'indications_for_delivery' => rand(0, 1) ? 'Indicaciones para entrega: '.$faker->sentence(10) : null,
                'status_semaforo' => json_encode($statusSemaforoSospese),
                'motivazione' => $motivazioni[array_rand($motivazioni)],
                'autocontrollo' => false,
            ]);
            $ordersSospese->push($order);
        }
        // Orden demo determinista Sospeso
        if ($validArticles->isNotEmpty()) {
            $demoArticleStatus4 = $validArticles->first();
            $offer = $demoArticleStatus4->offer;
            $division = $offer->customerDivision;
            $availableAddresses = $shippingAddresses->where('customerdivision_uuid', $division->uuid);
            if ($availableAddresses->isNotEmpty()) {
                $quantity = 900;
                $deliveryDate = now()->addDays(12);
                $ordersSospese->push(Order::factory()->create([
                    'article_uuid' => $demoArticleStatus4->uuid,
                    'order_production_number' => $orderProductionNumberService->generateNext(),
                    'status' => Order::STATUS_SOSPESO,
                    'quantity' => $quantity,
                    'worked_quantity' => 300,
                    'delivery_requested_date' => $deliveryDate,
                    'expected_production_start_date' => now()->subDays(4),
                    'customershippingaddress_uuid' => $availableAddresses->first()->uuid,
                    'number_customer_reference_order' => 'REF-DEMO-STATUS-4',
                    'line' => 4,
                    'type_lot' => 1,
                    'lot' => 'LOT-DEM04',
                    'expiration_date' => $deliveryDate->copy()->addDays(200),
                    'external_labels' => 1,
                    'pvp_labels' => 1,
                    'ingredients_labels' => 1,
                    'variable_data_labels' => 1,
                    'label_of_jumpers' => 1,
                    'indications_for_shop' => 'Demo stato 4 - shop',
                    'indications_for_production' => 'Demo stato 4 - produzione',
                    'indications_for_delivery' => 'Demo stato 4 - consegna',
                    'status_semaforo' => json_encode(['etichette' => 1, 'packaging' => 2, 'prodotto' => 0]),
                    'motivazione' => 'Demo sospensione – ordine stato 4.',
                    'autocontrollo' => false,
                ]));
            }
        }
        $this->command->info("   ✅ {$ordersSospese->count()} órdenes Sospese (status 4) creadas");

        // Órdenes Evaso (status 5) - Completate
        // Coherente: la data di consegna è nel passato (ordine già evaso).
        // In lista, per status 5 e 6 la colonna "Data di consegna" mostra sempre
        // icona verde (nessun "pericolo"): ordine chiuso = non ha senso segnalare ritardo.
        $ordersEvaso = collect();
        for ($i = 0; $i < min(15, $validArticles->count()); $i++) {
            $article = $validArticles->random();
            $offer = $article->offer;
            $division = $offer->customerDivision;
            $availableAddresses = $shippingAddresses->where('customerdivision_uuid', $division->uuid);

            if ($availableAddresses->isEmpty()) {
                continue;
            }

            $quantity = rand(100, 1000);
            $deliveryDate = now()->subDays(rand(1, 60));
            $startDate = $deliveryDate->copy()->subDays(rand(5, 15));

            // Creare l'ordine con data di creazione nel passato
            $createdAt = $startDate->copy()->subDays(rand(1, 5));
            // La data di aggiornamento (completamento) sarà dopo la creazione
            // Simulando che l'ordine abbia impiegato tra 3 e 20 giorni per completarsi
            $completedAt = $createdAt->copy()->addDays(rand(3, 20));

            $order = Order::factory()->create([
                'article_uuid' => $article->uuid,
                'order_production_number' => $orderProductionNumberService->generateNext(),
                'status' => Order::STATUS_EVASO,
                'quantity' => $quantity,
                'worked_quantity' => $quantity, // Completamente trabajada
                'delivery_requested_date' => $deliveryDate,
                'expected_production_start_date' => $startDate,
                'customershippingaddress_uuid' => $availableAddresses->random()->uuid,
                'number_customer_reference_order' => 'REF-'.str_pad(rand(1000, 9999), 6, '0', STR_PAD_LEFT),
                'line' => rand(1, 5),
                'type_lot' => rand(0, 2),
                'lot' => rand(0, 2) > 0 ? 'LOT-'.str_pad(rand(1, 9999), 5, '0', STR_PAD_LEFT) : null,
                'expiration_date' => $deliveryDate->copy()->addDays(rand(30, 365)),
                'external_labels' => rand(0, 2),
                'pvp_labels' => rand(0, 2),
                'ingredients_labels' => rand(0, 2),
                'variable_data_labels' => rand(0, 2),
                'label_of_jumpers' => rand(0, 2),
                'indications_for_shop' => rand(0, 1) ? 'Indicaciones para tienda: '.$faker->sentence(10) : null,
                'indications_for_production' => rand(0, 1) ? 'Indicaciones para producción: '.$faker->sentence(10) : null,
                'indications_for_delivery' => rand(0, 1) ? 'Indicaciones para entrega: '.$faker->sentence(10) : null,
                'status_semaforo' => json_encode([
                    'etichette' => 2, // Completado
                    'packaging' => 2, // Completado
                    'prodotto' => 2, // Completado
                ]),
                'motivazione' => null,
                'autocontrollo' => true,
                'created_at' => $createdAt,
            ]);

            // Aggiornare updated_at per simulare la data di completamento
            $order->updated_at = $completedAt;
            $order->save();

            $ordersEvaso->push($order);
        }
        $this->command->info("   ✅ {$ordersEvaso->count()} órdenes Evaso (status 5) creadas");

        // Órdenes Saldato (status 6) - Completate
        // Coherente: data di consegna nel passato (ordine saldato).
        // In lista si mostra sempre icona verde (nessun pericolo) per coerenza con la UI.
        $ordersSaldato = collect();
        for ($i = 0; $i < min(10, $validArticles->count()); $i++) {
            $article = $validArticles->random();
            $offer = $article->offer;
            $division = $offer->customerDivision;
            $availableAddresses = $shippingAddresses->where('customerdivision_uuid', $division->uuid);

            if ($availableAddresses->isEmpty()) {
                continue;
            }

            $quantity = rand(100, 1000);
            $deliveryDate = now()->subDays(rand(30, 120));
            $startDate = $deliveryDate->copy()->subDays(rand(10, 20));

            // Creare l'ordine con data di creazione nel passato
            $createdAt = $startDate->copy()->subDays(rand(1, 5));
            // La data di aggiornamento (completamento) sarà dopo la creazione
            // Simulando che l'ordine abbia impiegato tra 5 e 25 giorni per completarsi
            $completedAt = $createdAt->copy()->addDays(rand(5, 25));

            $order = Order::factory()->create([
                'article_uuid' => $article->uuid,
                'order_production_number' => $orderProductionNumberService->generateNext(),
                'status' => Order::STATUS_SALDATO,
                'quantity' => $quantity,
                'worked_quantity' => $quantity, // Completamente trabajada
                'delivery_requested_date' => $deliveryDate,
                'expected_production_start_date' => $startDate,
                'customershippingaddress_uuid' => $availableAddresses->random()->uuid,
                'number_customer_reference_order' => 'REF-'.str_pad(rand(1000, 9999), 6, '0', STR_PAD_LEFT),
                'line' => rand(1, 5),
                'type_lot' => rand(0, 2),
                'lot' => rand(0, 2) > 0 ? 'LOT-'.str_pad(rand(1, 9999), 5, '0', STR_PAD_LEFT) : null,
                'expiration_date' => $deliveryDate->copy()->addDays(rand(30, 365)),
                'external_labels' => rand(0, 2),
                'pvp_labels' => rand(0, 2),
                'ingredients_labels' => rand(0, 2),
                'variable_data_labels' => rand(0, 2),
                'label_of_jumpers' => rand(0, 2),
                'indications_for_shop' => rand(0, 1) ? 'Indicaciones para tienda: '.$faker->sentence(10) : null,
                'indications_for_production' => rand(0, 1) ? 'Indicaciones para producción: '.$faker->sentence(10) : null,
                'indications_for_delivery' => rand(0, 1) ? 'Indicaciones para entrega: '.$faker->sentence(10) : null,
                'status_semaforo' => json_encode([
                    'etichette' => 2, // Completado
                    'packaging' => 2, // Completado
                    'prodotto' => 2, // Completado
                ]),
                'motivazione' => null,
                'autocontrollo' => true,
                'created_at' => $createdAt,
            ]);

            // Aggiornare updated_at per simulare la data di completamento
            $order->updated_at = $completedAt;
            $order->save();

            $ordersSaldato->push($order);
        }
        $this->command->info("   ✅ {$ordersSaldato->count()} órdenes Saldato (status 6) creadas");

        // 11. Crear Procesamientos de Órdenes (ProductionOrderProcessing)
        $this->command->info('⚙️  Creando procesamientos de órdenes...');

        // Combinare tutti gli ordini in produzione (Lanciato e In Avanzamento)
        $ordersInProduction = $ordersLanciate->merge($ordersInAvanzamento);

        $processings = collect();
        foreach ($ordersInProduction as $order) {
            // Creare più lavorazioni per ordine (simulando lavoro di diversi dipendenti)
            $processingCount = rand(2, 5);
            $remainingQuantity = $order->quantity - ($order->worked_quantity ?? 0);

            // Si la orden ya tiene worked_quantity, ajustar remainingQuantity
            if ($remainingQuantity <= 0) {
                $remainingQuantity = $order->quantity; // Resetear para crear procesamientos
            }

            for ($i = 0; $i < $processingCount && $remainingQuantity > 0; $i++) {
                $processingQuantity = min(
                    $remainingQuantity,
                    rand(10, max(10, (int) ($remainingQuantity / $processingCount) + 20))
                );
                $remainingQuantity -= $processingQuantity;

                // Fecha de procesamiento: entre la fecha de inicio esperada y ahora
                $startDate = $order->expected_production_start_date ?? now()->subDays(rand(1, 10));

                // Asegurar que la fecha de inicio sea anterior a ahora
                // Si la fecha de inicio es futura, usar una fecha pasada como inicio
                $minDate = $startDate && $startDate->isFuture()
                    ? now()->subDays(rand(5, 15))
                    : ($startDate ?? now()->subDays(rand(5, 15)));

                // Asegurar que minDate sea anterior a now()
                if ($minDate->isFuture()) {
                    $minDate = now()->subDays(rand(5, 15));
                }

                $processedDate = $faker->dateTimeBetween($minDate, 'now');

                $processing = ProductionOrderProcessing::create([
                    'uuid' => \Illuminate\Support\Str::uuid()->toString(),
                    'employee_uuid' => $employees->random()->uuid,
                    'order_uuid' => $order->uuid,
                    'quantity' => $processingQuantity,
                    'processed_datetime' => $processedDate,
                    'removed' => false,
                ]);
                $processings->push($processing);
            }
        }

        $this->command->info("   ✅ {$processings->count()} procesamientos de órdenes creados");

        // 12. Crear Estados de Órdenes (OfferOrderState)
        $this->command->info('📊 Creando estados de órdenes...');
        $orderStates = collect();
        $stateNames = [
            'En Revisión',
            'Pendiente Aprobación',
            'En Preparación',
            'Listo para Producción',
            'En Calidad',
            'Finalizado',
        ];

        $sorting = 1;
        foreach ($stateNames as $stateName) {
            $orderState = OfferOrderState::factory()->create([
                'name' => $stateName,
                'sorting' => $sorting++,
                'initial' => $sorting === 2, // El segundo estado es inicial
                'production' => in_array($stateName, ['En Preparación', 'Listo para Producción']),
                'removed' => false,
            ]);
            $orderStates->push($orderState);
        }
        $this->command->info("   ✅ {$orderStates->count()} estados de órdenes creados");

        // 13. Crear Asignaciones de Empleados a Órdenes (OfferOrderEmployee)
        $this->command->info('👥 Creando asignaciones de empleados a órdenes...');
        $allOrders = $ordersPianificato->merge($ordersInAllestimento)
            ->merge($ordersLanciate)
            ->merge($ordersInAvanzamento)
            ->merge($ordersSospese)
            ->merge($ordersEvaso)
            ->merge($ordersSaldato);

        $orderEmployeeAssignments = collect();
        foreach ($allOrders as $order) {
            // Asignar 1-3 empleados aleatorios a cada orden
            $employeeCount = rand(1, min(3, $employees->count()));
            $selectedEmployees = $employees->random($employeeCount);

            foreach ($selectedEmployees as $employee) {
                $assignment = OfferOrderEmployee::factory()->create([
                    'order_uuid' => $order->uuid,
                    'employee_uuid' => $employee->uuid,
                    'removed' => false,
                ]);
                $orderEmployeeAssignments->push($assignment);
            }
        }
        $this->command->info("   ✅ {$orderEmployeeAssignments->count()} asignaciones de empleados a órdenes creadas");

        // Resumen final
        $totalOrders = $ordersPianificato->count() + $ordersInAllestimento->count() +
                      $ordersLanciate->count() + $ordersInAvanzamento->count() +
                      $ordersSospese->count() + $ordersEvaso->count() + $ordersSaldato->count();

        $this->command->info('');
        $this->command->info('✅ Datos de prueba creados exitosamente!');
        $this->command->info('');
        $this->command->info('📊 Resumen:');
        $this->command->info("   - Clientes: {$customers->count()}");
        $this->command->info("   - Divisiones: {$divisions->count()}");
        $this->command->info("   - Direcciones: {$shippingAddresses->count()}");
        $this->command->info("   - Proveedores: {$suppliers->count()}");
        $this->command->info("   - Empleados: {$employees->count()}");
        $this->command->info("   - Contratos de empleados: {$contracts->count()}");
        $this->command->info("   - Tipos de valor: {$valueTypes->count()}");
        $this->command->info("   - Materiales: {$materials->count()}");
        $this->command->info("   - Maquinaria: {$machinery->count()}");
        $this->command->info("   - Tipos de pallet: {$palletTypes->count()}");
        $this->command->info("   - Categorías de artículos: {$categories->count()}");
        $this->command->info("   - Actividades: {$activities->count()}");
        $this->command->info("   - Sectores: {$sectors->count()}");
        $this->command->info("   - Estacionalidades: {$seasonalities->count()}");
        $this->command->info("   - Familias LAS: {$lasFamilies->count()}");
        $this->command->info("   - Líneas de trabajo LAS: {$lasWorkLines->count()}");
        $this->command->info("   - Recursos L&S: {$lsResources->count()}");
        $this->command->info("   - Tipos de orden: {$orderTypes->count()}");
        $this->command->info("   - Tipi di offerta (OfferType): {$offerTypes->count()}");
        $this->command->info("   - Categorías de operaciones: {$operationCategories->count()}");
        $this->command->info("   - Operaciones: {$operations->count()}");
        $this->command->info("   - Instrucciones IC: {$articleICs->count()}");
        $this->command->info("   - Instrucciones IO: {$articleIOs->count()}");
        $this->command->info("   - Instrucciones IP: {$articleIPs->count()}");
        $this->command->info("   - Modelos SCQ: {$modelSCQs->count()}");
        $this->command->info("   - Problemas críticos: {$criticalIssues->count()}");
        $this->command->info("   - Hojas de pallet: {$palletSheets->count()}");
        $this->command->info("   - Ofertas: {$offers->count()}");
        $this->command->info("   - Artículos: {$articles->count()}");
        $this->command->info("   - Órdenes totales: {$totalOrders}");
        $this->command->info("     • Pianificato (0): {$ordersPianificato->count()}");
        $this->command->info("     • In Allestimento (1): {$ordersInAllestimento->count()}");
        $this->command->info("     • Lanciate (2): {$ordersLanciate->count()}");
        $this->command->info("     • In Avanzamento (3): {$ordersInAvanzamento->count()}");
        $this->command->info("     • Sospese (4): {$ordersSospese->count()}");
        $this->command->info("     • Evaso (5): {$ordersEvaso->count()}");
        $this->command->info("     • Saldato (6): {$ordersSaldato->count()}");
        $this->command->info("   - Procesamientos de órdenes: {$processings->count()}");
        $this->command->info("   - Estados de órdenes: {$orderStates->count()}");
        $this->command->info("   - Asignaciones empleados-órdenes: {$orderEmployeeAssignments->count()}");
        $this->command->info('');
        $this->command->info('🎯 Ahora puedes verificar el dashboard con datos reales!');
    }
}
