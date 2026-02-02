<?php

namespace Tests\Feature\Controllers;

use App\Models\Customer;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class CustomerControllerTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();
    }

    #[Test]
    public function it_displays_index_page_with_customers()
    {
        $this->actingAs($this->user);

        $customer1 = Customer::factory()->create([
            'removed' => false,
            'code' => 'CLI001',
            'company_name' => 'Cliente Test 1',
        ]);

        $customer2 = Customer::factory()->create([
            'removed' => false,
            'code' => 'CLI002',
            'company_name' => 'Cliente Test 2',
        ]);

        $response = $this->get(route('customers.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->has('customers')
            ->has('customers.data')
            ->where('customers.data', function ($data) {
                $this->assertCount(2, $data);
                // Convertir Collection a array si es necesario
                if (is_object($data) && method_exists($data, 'toArray')) {
                    $dataArray = $data->toArray();
                } else {
                    $dataArray = (array) $data;
                }
                $codes = array_column($dataArray, 'code');
                $this->assertContains('CLI001', $codes);
                $this->assertContains('CLI002', $codes);

                return true;
            })
        );
    }

    #[Test]
    public function it_only_shows_active_customers_in_index()
    {
        $this->actingAs($this->user);

        $activeCustomer = Customer::factory()->create([
            'removed' => false,
            'code' => 'CLI001',
            'company_name' => 'Cliente Activo',
        ]);

        $removedCustomer = Customer::factory()->create([
            'removed' => true,
            'code' => 'CLI002',
            'company_name' => 'Cliente Removido',
        ]);

        $response = $this->get(route('customers.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->has('customers')
            ->has('customers.data')
            ->where('customers.data', function ($data) {
                $this->assertCount(1, $data);
                $this->assertEquals('CLI001', $data[0]['code']);

                return true;
            })
        );
    }

    #[Test]
    public function it_filters_customers_by_search_term()
    {
        $this->actingAs($this->user);

        $customer1 = Customer::factory()->create([
            'removed' => false,
            'code' => 'CLI001',
            'company_name' => 'Empresa ABC',
            'vat_number' => '12345678901',
        ]);

        $customer2 = Customer::factory()->create([
            'removed' => false,
            'code' => 'CLI002',
            'company_name' => 'Empresa XYZ',
            'vat_number' => '98765432109',
        ]);

        // Cercare per codice
        $response = $this->get(route('customers.index', ['search' => 'CLI001']));
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->where('customers.data', function ($data) {
            $this->assertCount(1, $data);
            $this->assertEquals('CLI001', $data[0]['code']);

            return true;
        })
        );

        // Buscar por nombre de empresa
        $response = $this->get(route('customers.index', ['search' => 'ABC']));
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->where('customers.data', function ($data) {
            $this->assertCount(1, $data);
            $this->assertEquals('Empresa ABC', $data[0]['company_name']);

            return true;
        })
        );

        // Buscar por partita IVA
        $response = $this->get(route('customers.index', ['search' => '12345678901']));
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->where('customers.data', function ($data) {
            $this->assertCount(1, $data);
            $this->assertEquals('12345678901', $data[0]['vat_number']);

            return true;
        })
        );
    }

    #[Test]
    public function it_displays_create_form()
    {
        $this->actingAs($this->user);

        $response = $this->get(route('customers.create'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('Customers/Create')
        );
    }

    #[Test]
    public function it_creates_customer_successfully()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('customers.store'), [
            'code' => 'CLI001',
            'company_name' => 'Test Customer SRL',
            'vat_number' => '12345678901',
            'co' => 'c/o Test',
            'street' => 'Via Roma 1',
            'postal_code' => '00100',
            'city' => 'Roma',
            'province' => 'RM',
            'country' => 'Italia',
        ]);

        $response->assertRedirect(route('customers.index'));
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('customer', [
            'code' => 'CLI001',
            'company_name' => 'Test Customer SRL',
            'vat_number' => '12345678901',
            'street' => 'Via Roma 1',
            'removed' => false,
        ]);
    }

    #[Test]
    public function it_requires_code()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('customers.store'), [
            'company_name' => 'Test Customer SRL',
            'street' => 'Via Roma 1',
        ]);

        $response->assertSessionHasErrors(['code']);
    }

    #[Test]
    public function it_requires_company_name()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('customers.store'), [
            'code' => 'CLI001',
            'street' => 'Via Roma 1',
        ]);

        $response->assertSessionHasErrors(['company_name']);
    }

    #[Test]
    public function it_requires_street()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('customers.store'), [
            'code' => 'CLI001',
            'company_name' => 'Test Customer SRL',
        ]);

        $response->assertSessionHasErrors(['street']);
    }

    #[Test]
    public function it_validates_unique_code()
    {
        $this->actingAs($this->user);

        Customer::factory()->create([
            'code' => 'CLI001',
            'removed' => false,
        ]);

        $response = $this->post(route('customers.store'), [
            'code' => 'CLI001',
            'company_name' => 'Test Customer SRL',
            'street' => 'Via Roma 1',
        ]);

        $response->assertSessionHasErrors(['code']);
    }

    #[Test]
    public function it_creates_customer_with_minimal_required_fields()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('customers.store'), [
            'code' => 'CLI001',
            'company_name' => 'Test Customer SRL',
            'street' => 'Via Roma 1',
        ]);

        $response->assertRedirect(route('customers.index'));

        $this->assertDatabaseHas('customer', [
            'code' => 'CLI001',
            'company_name' => 'Test Customer SRL',
            'street' => 'Via Roma 1',
            'removed' => false,
        ]);
    }

    #[Test]
    public function it_generates_uuid_automatically()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('customers.store'), [
            'code' => 'CLI001',
            'company_name' => 'Test Customer SRL',
            'street' => 'Via Roma 1',
        ]);

        $customer = Customer::where('code', 'CLI001')->first();
        $this->assertNotNull($customer->uuid);
        $this->assertMatchesRegularExpression('/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i', $customer->uuid);
    }

    #[Test]
    public function it_displays_show_page_with_customer()
    {
        $this->actingAs($this->user);

        $customer = Customer::factory()->create([
            'removed' => false,
            'code' => 'CLI001',
            'company_name' => 'Test Customer SRL',
        ]);

        $response = $this->get(route('customers.show', $customer));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('Customers/Show')
            ->where('customer.code', 'CLI001')
            ->where('customer.company_name', 'Test Customer SRL')
        );
    }

    #[Test]
    public function it_loads_divisions_and_offers_in_show()
    {
        $this->actingAs($this->user);

        $customer = Customer::factory()->create([
            'removed' => false,
            'code' => 'CLI001',
        ]);

        $response = $this->get(route('customers.show', $customer));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->has('customer')
            ->has('customer.divisions')
            ->has('customer.offers')
        );
    }

    #[Test]
    public function it_displays_edit_form_with_customer()
    {
        $this->actingAs($this->user);

        $customer = Customer::factory()->create([
            'removed' => false,
            'code' => 'CLI001',
            'company_name' => 'Test Customer SRL',
        ]);

        $response = $this->get(route('customers.edit', $customer));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('Customers/Edit')
            ->where('customer.code', 'CLI001')
            ->where('customer.company_name', 'Test Customer SRL')
        );
    }

    #[Test]
    public function it_updates_customer_successfully()
    {
        $this->actingAs($this->user);

        $customer = Customer::factory()->create([
            'removed' => false,
            'code' => 'CLI001',
            'company_name' => 'Test Customer SRL',
            'street' => 'Via Roma 1',
        ]);

        $response = $this->put(route('customers.update', $customer), [
            'code' => 'CLI001',
            'company_name' => 'Updated Customer SRL',
            'vat_number' => '12345678901',
            'co' => 'c/o Updated',
            'street' => 'Via Milano 2',
            'postal_code' => '20100',
            'city' => 'Milano',
            'province' => 'MI',
            'country' => 'Italia',
        ]);

        $response->assertRedirect(route('customers.index'));
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('customer', [
            'id' => $customer->id,
            'code' => 'CLI001',
            'company_name' => 'Updated Customer SRL',
            'street' => 'Via Milano 2',
        ]);
    }

    #[Test]
    public function it_validates_unique_code_on_update_excluding_current()
    {
        $this->actingAs($this->user);

        $customer1 = Customer::factory()->create([
            'code' => 'CLI001',
            'removed' => false,
        ]);

        $customer2 = Customer::factory()->create([
            'code' => 'CLI002',
            'removed' => false,
        ]);

        // Tentare di cambiare CLI002 in CLI001 dovrebbe fallire
        $response = $this->put(route('customers.update', $customer2), [
            'code' => 'CLI001',
            'company_name' => 'Test Customer SRL',
            'street' => 'Via Roma 1',
        ]);

        $response->assertSessionHasErrors(['code']);

        // Ma aggiornare CLI001 mantenendo il suo codice dovrebbe funzionare
        $response = $this->put(route('customers.update', $customer1), [
            'code' => 'CLI001',
            'company_name' => 'Updated Name',
            'street' => 'Via Roma 1',
        ]);

        $response->assertRedirect(route('customers.index'));
    }

    #[Test]
    public function it_requires_code_on_update()
    {
        $this->actingAs($this->user);

        $customer = Customer::factory()->create([
            'code' => 'CLI001',
            'removed' => false,
        ]);

        $response = $this->put(route('customers.update', $customer), [
            'company_name' => 'Test Customer SRL',
            'street' => 'Via Roma 1',
        ]);

        $response->assertSessionHasErrors(['code']);
    }

    #[Test]
    public function it_requires_company_name_on_update()
    {
        $this->actingAs($this->user);

        $customer = Customer::factory()->create([
            'code' => 'CLI001',
            'removed' => false,
        ]);

        $response = $this->put(route('customers.update', $customer), [
            'code' => 'CLI001',
            'street' => 'Via Roma 1',
        ]);

        $response->assertSessionHasErrors(['company_name']);
    }

    #[Test]
    public function it_requires_street_on_update()
    {
        $this->actingAs($this->user);

        $customer = Customer::factory()->create([
            'code' => 'CLI001',
            'removed' => false,
        ]);

        $response = $this->put(route('customers.update', $customer), [
            'code' => 'CLI001',
            'company_name' => 'Test Customer SRL',
        ]);

        $response->assertSessionHasErrors(['street']);
    }

    #[Test]
    public function it_soft_deletes_customer()
    {
        $this->actingAs($this->user);

        $customer = Customer::factory()->create([
            'removed' => false,
            'code' => 'CLI001',
        ]);

        $response = $this->delete(route('customers.destroy', $customer));

        $response->assertRedirect(route('customers.index'));
        $response->assertSessionHas('success');

        // Refrescar el modelo para obtener los valores actualizados
        $customer->refresh();
        $this->assertTrue($customer->removed);

        // Verificare anche nel database
        $this->assertDatabaseHas('customer', [
            'id' => $customer->id,
            'removed' => 1,
        ]);
    }

    #[Test]
    public function it_paginates_customers()
    {
        $this->actingAs($this->user);

        // Creare più di 15 clienti (default per_page)
        Customer::factory()->count(20)->create([
            'removed' => false,
        ]);

        $response = $this->get(route('customers.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->where('customers.data', function ($data) {
            $this->assertCount(15, $data);

            return true;
        })
            ->has('customers.current_page')
            ->has('customers.last_page')
        );
    }

    #[Test]
    public function it_respects_per_page_parameter()
    {
        $this->actingAs($this->user);

        Customer::factory()->count(25)->create([
            'removed' => false,
        ]);

        $response = $this->get(route('customers.index', ['per_page' => 10]));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->where('customers.data', function ($data) {
            $this->assertCount(10, $data);

            return true;
        })
        );
    }

    #[Test]
    public function it_orders_customers_by_company_name()
    {
        $this->actingAs($this->user);

        Customer::factory()->create([
            'removed' => false,
            'company_name' => 'Zeta Company',
        ]);

        Customer::factory()->create([
            'removed' => false,
            'company_name' => 'Alpha Company',
        ]);

        Customer::factory()->create([
            'removed' => false,
            'company_name' => 'Beta Company',
        ]);

        $response = $this->get(route('customers.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->where('customers.data', function ($data) {
            $this->assertEquals('Alpha Company', $data[0]['company_name']);
            $this->assertEquals('Beta Company', $data[1]['company_name']);
            $this->assertEquals('Zeta Company', $data[2]['company_name']);

            return true;
        })
        );
    }

    #[Test]
    public function it_filters_customers_by_province()
    {
        $this->actingAs($this->user);

        $customer1 = Customer::factory()->create([
            'removed' => false,
            'code' => 'CLI001',
            'company_name' => 'Cliente Roma',
            'province' => 'RM',
        ]);

        $customer2 = Customer::factory()->create([
            'removed' => false,
            'code' => 'CLI002',
            'company_name' => 'Cliente Milano',
            'province' => 'MI',
        ]);

        $customer3 = Customer::factory()->create([
            'removed' => false,
            'code' => 'CLI003',
            'company_name' => 'Cliente Roma 2',
            'province' => 'RM',
        ]);

        // Filtrar por provincia RM
        $response = $this->get(route('customers.index', ['province' => 'RM']));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->where('customers.data', function ($data) {
            $this->assertCount(2, $data);
            $provinces = collect($data)->pluck('province')->toArray();
            $this->assertContains('RM', $provinces);
            $this->assertNotContains('MI', $provinces);

            return true;
        })
            ->where('filters.province', 'RM')
        );

        // Filtrar por provincia MI
        $response = $this->get(route('customers.index', ['province' => 'MI']));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->where('customers.data', function ($data) {
            $this->assertCount(1, $data);
            $this->assertEquals('MI', collect($data)->first()['province']);

            return true;
        })
        );
    }

    #[Test]
    public function it_validates_vat_number_format()
    {
        $this->actingAs($this->user);

        // VAT number deve avere esattamente 11 cifre
        $response = $this->post(route('customers.store'), [
            'code' => 'CLI001',
            'company_name' => 'Test Customer SRL',
            'street' => 'Via Roma 1',
            'vat_number' => '1234567890', // Solo 10 cifre
        ]);

        $response->assertSessionHasErrors(['vat_number']);
    }

    #[Test]
    public function it_validates_vat_number_accepts_11_digits()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('customers.store'), [
            'code' => 'CLI001',
            'company_name' => 'Test Customer SRL',
            'street' => 'Via Roma 1',
            'vat_number' => '12345678901', // 11 cifre - valido
        ]);

        $response->assertRedirect(route('customers.index'));
        $this->assertDatabaseHas('customer', [
            'code' => 'CLI001',
            'vat_number' => '12345678901',
        ]);
    }

    #[Test]
    public function it_validates_vat_number_rejects_letters()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('customers.store'), [
            'code' => 'CLI001',
            'company_name' => 'Test Customer SRL',
            'street' => 'Via Roma 1',
            'vat_number' => '1234567890A', // Contiene letra
        ]);

        $response->assertSessionHasErrors(['vat_number']);
    }

    #[Test]
    public function it_validates_max_length_for_string_fields()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('customers.store'), [
            'code' => str_repeat('a', 256), // Più di 255 caratteri
            'company_name' => 'Test Customer SRL',
            'street' => 'Via Roma 1',
        ]);

        $response->assertSessionHasErrors(['code']);
    }

    #[Test]
    public function it_accepts_nullable_vat_number()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('customers.store'), [
            'code' => 'CLI001',
            'company_name' => 'Test Customer SRL',
            'street' => 'Via Roma 1',
            'vat_number' => null,
        ]);

        $response->assertRedirect(route('customers.index'));
        $this->assertDatabaseHas('customer', [
            'code' => 'CLI001',
            'vat_number' => null,
        ]);
    }

    #[Test]
    public function it_handles_empty_search_results()
    {
        $this->actingAs($this->user);

        $response = $this->get(route('customers.index', ['search' => 'NONEXISTENT12345']));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->has('customers')
            ->has('customers.data')
        );

        // Verificar que no hay resultados
        $response->assertInertia(fn ($page) => $page->has('customers.data')
            ->where('customers.data', [])
        );
    }

    #[Test]
    public function it_handles_customer_with_all_nullable_fields()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('customers.store'), [
            'code' => 'CLI002',
            'company_name' => 'Test Customer SRL',
            'street' => 'Via Roma 1',
            'vat_number' => null,
            'co' => null,
            'postal_code' => null,
            'city' => null,
            'province' => null,
            'country' => null,
        ]);

        $response->assertRedirect(route('customers.index'));
        $this->assertDatabaseHas('customer', [
            'code' => 'CLI002',
            'vat_number' => null,
        ]);
    }
}
