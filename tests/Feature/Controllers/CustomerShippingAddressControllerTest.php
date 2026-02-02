<?php

namespace Tests\Feature\Controllers;

use App\Models\Customer;
use App\Models\CustomerDivision;
use App\Models\CustomerShippingAddress;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class CustomerShippingAddressControllerTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

    protected Customer $customer;

    protected CustomerDivision $division;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();

        $this->customer = Customer::factory()->create([
            'removed' => false,
            'code' => 'CLI001',
            'company_name' => 'Test Customer SRL',
        ]);

        $this->division = CustomerDivision::factory()->create([
            'customer_uuid' => $this->customer->uuid,
            'name' => 'Divisione Test',
            'removed' => false,
        ]);
    }

    #[Test]
    public function it_displays_create_form_with_customers()
    {
        $this->actingAs($this->user);

        $response = $this->get(route('customer-shipping-addresses.create'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->has('customers')
            ->where('customers.0.uuid', $this->customer->uuid)
        );
    }

    #[Test]
    public function it_loads_divisions_when_customer_is_provided()
    {
        $this->actingAs($this->user);

        $response = $this->get(route('customer-shipping-addresses.create', [
            'customer_uuid' => $this->customer->uuid,
        ]));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->has('divisions')
            ->where('divisions.0.uuid', $this->division->uuid)
            ->where('divisions.0.name', 'Divisione Test')
        );
    }

    #[Test]
    public function it_creates_shipping_address_successfully()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('customer-shipping-addresses.store'), [
            'customerdivision_uuid' => $this->division->uuid,
            'co' => 'c/o Test',
            'street' => 'Via Roma 1',
            'postal_code' => '00100',
            'city' => 'Roma',
            'province' => 'RM',
            'country' => 'Italia',
            'contacts' => 'Tel: 123456789',
        ]);

        $response->assertRedirect(route('customer-shipping-addresses.index'));
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('customershippingaddress', [
            'customerdivision_uuid' => $this->division->uuid,
            'street' => 'Via Roma 1',
            'city' => 'Roma',
            'postal_code' => '00100',
            'removed' => false,
        ]);
    }

    #[Test]
    public function it_requires_customerdivision_uuid()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('customer-shipping-addresses.store'), [
            'street' => 'Via Roma 1',
        ]);

        $response->assertSessionHasErrors(['customerdivision_uuid']);
    }

    #[Test]
    public function it_requires_street()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('customer-shipping-addresses.store'), [
            'customerdivision_uuid' => $this->division->uuid,
        ]);

        $response->assertSessionHasErrors(['street']);
    }

    #[Test]
    public function it_validates_customerdivision_uuid_exists()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('customer-shipping-addresses.store'), [
            'customerdivision_uuid' => 'non-existent-uuid',
            'street' => 'Via Roma 1',
        ]);

        $response->assertSessionHasErrors(['customerdivision_uuid']);
    }

    #[Test]
    public function it_loads_divisions_via_ajax_endpoint()
    {
        $this->actingAs($this->user);

        // Creare un'altra divisione per lo stesso cliente
        $division2 = CustomerDivision::factory()->create([
            'customer_uuid' => $this->customer->uuid,
            'name' => 'Divisione 2',
            'removed' => false,
        ]);

        $response = $this->getJson('/customer-shipping-addresses/load-divisions?customer_uuid='.$this->customer->uuid);

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'customer_divisions' => [
                '*' => ['uuid', 'name'],
            ],
        ]);

        $divisions = $response->json('customer_divisions');
        $this->assertCount(2, $divisions);

        // Verificare che entrambe le divisioni siano presenti (senza dipendere dall'ordine)
        $divisionNames = array_column($divisions, 'name');
        $this->assertContains('Divisione Test', $divisionNames);
        $this->assertContains('Divisione 2', $divisionNames);
    }

    #[Test]
    public function it_only_loads_active_divisions()
    {
        $this->actingAs($this->user);

        // Creare una divisione rimossa
        $removedDivision = CustomerDivision::factory()->create([
            'customer_uuid' => $this->customer->uuid,
            'name' => 'Divisione Removida',
            'removed' => true,
        ]);

        $response = $this->getJson('/customer-shipping-addresses/load-divisions?customer_uuid='.$this->customer->uuid);

        $response->assertStatus(200);
        $divisions = $response->json('customer_divisions');

        // Deve restituire solo la divisione attiva
        $this->assertCount(1, $divisions);
        $this->assertEquals('Divisione Test', $divisions[0]['name']);
    }

    #[Test]
    public function it_creates_address_with_all_optional_fields()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('customer-shipping-addresses.store'), [
            'customerdivision_uuid' => $this->division->uuid,
            'co' => 'c/o Test Company',
            'street' => 'Via Test 123',
            'postal_code' => '20100',
            'city' => 'Milano',
            'province' => 'MI',
            'country' => 'Italia',
            'contacts' => 'Email: test@example.com, Tel: 123456789',
        ]);

        $response->assertRedirect(route('customer-shipping-addresses.index'));

        $this->assertDatabaseHas('customershippingaddress', [
            'customerdivision_uuid' => $this->division->uuid,
            'co' => 'c/o Test Company',
            'street' => 'Via Test 123',
            'postal_code' => '20100',
            'city' => 'Milano',
            'province' => 'MI',
            'country' => 'Italia',
            'contacts' => 'Email: test@example.com, Tel: 123456789',
        ]);
    }

    #[Test]
    public function it_generates_uuid_automatically()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('customer-shipping-addresses.store'), [
            'customerdivision_uuid' => $this->division->uuid,
            'street' => 'Via Test 123',
        ]);

        $address = CustomerShippingAddress::latest()->first();
        $this->assertNotNull($address->uuid);
        $this->assertMatchesRegularExpression('/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i', $address->uuid);
    }

    #[Test]
    public function it_displays_index_page_with_addresses()
    {
        $this->actingAs($this->user);

        $address1 = CustomerShippingAddress::factory()->create([
            'customerdivision_uuid' => $this->division->uuid,
            'street' => 'Via Roma 1',
            'city' => 'Roma',
            'removed' => false,
        ]);

        $address2 = CustomerShippingAddress::factory()->create([
            'customerdivision_uuid' => $this->division->uuid,
            'street' => 'Via Milano 2',
            'city' => 'Milano',
            'removed' => false,
        ]);

        $response = $this->get(route('customer-shipping-addresses.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->has('addresses')
            ->has('addresses.data')
            ->has('divisions')
            ->where('addresses.data', function ($data) {
                $this->assertCount(2, $data);

                return true;
            })
        );
    }

    #[Test]
    public function it_only_shows_active_addresses_in_index()
    {
        $this->actingAs($this->user);

        $activeAddress = CustomerShippingAddress::factory()->create([
            'customerdivision_uuid' => $this->division->uuid,
            'street' => 'Via Attiva',
            'removed' => false,
        ]);

        $removedAddress = CustomerShippingAddress::factory()->create([
            'customerdivision_uuid' => $this->division->uuid,
            'street' => 'Via Rimossa',
            'removed' => true,
        ]);

        $response = $this->get(route('customer-shipping-addresses.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->where('addresses.data', function ($data) {
            $this->assertCount(1, $data);
            $this->assertEquals('Via Attiva', $data[0]['street']);

            return true;
        })
        );
    }

    #[Test]
    public function it_filters_addresses_by_division()
    {
        $this->actingAs($this->user);

        $division2 = CustomerDivision::factory()->create([
            'customer_uuid' => $this->customer->uuid,
            'name' => 'Divisione 2',
            'removed' => false,
        ]);

        $address1 = CustomerShippingAddress::factory()->create([
            'customerdivision_uuid' => $this->division->uuid,
            'street' => 'Via Divisione 1',
            'removed' => false,
        ]);

        $address2 = CustomerShippingAddress::factory()->create([
            'customerdivision_uuid' => $division2->uuid,
            'street' => 'Via Divisione 2',
            'removed' => false,
        ]);

        $response = $this->get(route('customer-shipping-addresses.index', [
            'customerdivision_uuid' => $this->division->uuid,
        ]));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->where('addresses.data', function ($data) {
            $this->assertCount(1, $data);
            $this->assertEquals($this->division->uuid, $data[0]['customerdivision_uuid']);

            return true;
        })
        );
    }

    #[Test]
    public function it_searches_addresses_by_street()
    {
        $this->actingAs($this->user);

        $address1 = CustomerShippingAddress::factory()->create([
            'customerdivision_uuid' => $this->division->uuid,
            'street' => 'Via Roma 1',
            'removed' => false,
        ]);

        $address2 = CustomerShippingAddress::factory()->create([
            'customerdivision_uuid' => $this->division->uuid,
            'street' => 'Via Milano 2',
            'removed' => false,
        ]);

        $response = $this->get(route('customer-shipping-addresses.index', [
            'search' => 'Roma',
        ]));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->where('addresses.data', function ($data) {
            $this->assertCount(1, $data);
            $this->assertEquals('Via Roma 1', $data[0]['street']);

            return true;
        })
        );
    }

    #[Test]
    public function it_searches_addresses_by_city()
    {
        $this->actingAs($this->user);

        $address1 = CustomerShippingAddress::factory()->create([
            'customerdivision_uuid' => $this->division->uuid,
            'street' => 'Via Test 1',
            'city' => 'Roma',
            'removed' => false,
        ]);

        $address2 = CustomerShippingAddress::factory()->create([
            'customerdivision_uuid' => $this->division->uuid,
            'street' => 'Via Test 2',
            'city' => 'Milano',
            'removed' => false,
        ]);

        $response = $this->get(route('customer-shipping-addresses.index', [
            'search' => 'Milano',
        ]));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->where('addresses.data', function ($data) {
            $this->assertCount(1, $data);
            $this->assertEquals('Milano', $data[0]['city']);

            return true;
        })
        );
    }

    #[Test]
    public function it_searches_addresses_by_postal_code()
    {
        $this->actingAs($this->user);

        $address1 = CustomerShippingAddress::factory()->create([
            'customerdivision_uuid' => $this->division->uuid,
            'street' => 'Via Test 1',
            'postal_code' => '00100',
            'removed' => false,
        ]);

        $address2 = CustomerShippingAddress::factory()->create([
            'customerdivision_uuid' => $this->division->uuid,
            'street' => 'Via Test 2',
            'postal_code' => '20100',
            'removed' => false,
        ]);

        $response = $this->get(route('customer-shipping-addresses.index', [
            'search' => '00100',
        ]));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->where('addresses.data', function ($data) {
            $this->assertCount(1, $data);
            $this->assertEquals('00100', $data[0]['postal_code']);

            return true;
        })
        );
    }

    #[Test]
    public function it_searches_addresses_by_co()
    {
        $this->actingAs($this->user);

        $address1 = CustomerShippingAddress::factory()->create([
            'customerdivision_uuid' => $this->division->uuid,
            'street' => 'Via Test 1',
            'co' => 'c/o Test Company',
            'removed' => false,
        ]);

        $address2 = CustomerShippingAddress::factory()->create([
            'customerdivision_uuid' => $this->division->uuid,
            'street' => 'Via Test 2',
            'co' => 'c/o Another Company',
            'removed' => false,
        ]);

        $response = $this->get(route('customer-shipping-addresses.index', [
            'search' => 'Test Company',
        ]));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->where('addresses.data', function ($data) {
            $this->assertCount(1, $data);
            $this->assertEquals('c/o Test Company', $data[0]['co']);

            return true;
        })
        );
    }

    #[Test]
    public function it_searches_addresses_by_contacts()
    {
        $this->actingAs($this->user);

        $address1 = CustomerShippingAddress::factory()->create([
            'customerdivision_uuid' => $this->division->uuid,
            'street' => 'Via Test 1',
            'contacts' => 'Tel: 123456789',
            'removed' => false,
        ]);

        $address2 = CustomerShippingAddress::factory()->create([
            'customerdivision_uuid' => $this->division->uuid,
            'street' => 'Via Test 2',
            'contacts' => 'Email: test@example.com',
            'removed' => false,
        ]);

        $response = $this->get(route('customer-shipping-addresses.index', [
            'search' => '123456789',
        ]));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->where('addresses.data', function ($data) {
            $this->assertCount(1, $data);
            $this->assertEquals('Tel: 123456789', $data[0]['contacts']);

            return true;
        })
        );
    }

    #[Test]
    public function it_searches_addresses_by_division_name()
    {
        $this->actingAs($this->user);

        $divisionA = CustomerDivision::factory()->create([
            'customer_uuid' => $this->customer->uuid,
            'name' => 'Wilkinson Group',
            'removed' => false,
        ]);
        $divisionB = CustomerDivision::factory()->create([
            'customer_uuid' => $this->customer->uuid,
            'name' => 'Other Division',
            'removed' => false,
        ]);
        CustomerShippingAddress::factory()->create([
            'customerdivision_uuid' => $divisionA->uuid,
            'street' => 'Via A',
            'removed' => false,
        ]);
        CustomerShippingAddress::factory()->create([
            'customerdivision_uuid' => $divisionB->uuid,
            'street' => 'Via B',
            'removed' => false,
        ]);

        $response = $this->get(route('customer-shipping-addresses.index', [
            'search' => 'Wilkinson',
        ]));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->where('addresses.data', function ($data) {
            $this->assertCount(1, $data);
            $this->assertEquals('Via A', $data[0]['street']);

            return true;
        })
        );
    }

    #[Test]
    public function it_paginates_addresses()
    {
        $this->actingAs($this->user);

        CustomerShippingAddress::factory()->count(20)->create([
            'customerdivision_uuid' => $this->division->uuid,
            'removed' => false,
        ]);

        $response = $this->get(route('customer-shipping-addresses.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->where('addresses.data', function ($data) {
            $this->assertCount(15, $data);

            return true;
        })
            ->has('addresses.current_page')
            ->has('addresses.last_page')
        );
    }

    #[Test]
    public function it_displays_show_page_with_address_details()
    {
        $this->actingAs($this->user);

        $address = CustomerShippingAddress::factory()->create([
            'customerdivision_uuid' => $this->division->uuid,
            'street' => 'Via Test 123',
            'city' => 'Roma',
            'postal_code' => '00100',
            'removed' => false,
        ]);

        $response = $this->get(route('customer-shipping-addresses.show', $address));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->has('address')
            ->where('address.uuid', $address->uuid)
            ->where('address.street', 'Via Test 123')
            ->has('address.customer_division')
            ->has('address.customer_division.customer')
        );
    }

    #[Test]
    public function it_loads_orders_in_show()
    {
        $this->actingAs($this->user);

        $address = CustomerShippingAddress::factory()->create([
            'customerdivision_uuid' => $this->division->uuid,
            'removed' => false,
        ]);

        $response = $this->get(route('customer-shipping-addresses.show', $address));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->has('address.orders')
        );
    }

    #[Test]
    public function it_displays_edit_form_with_address_data()
    {
        $this->actingAs($this->user);

        $address = CustomerShippingAddress::factory()->create([
            'customerdivision_uuid' => $this->division->uuid,
            'street' => 'Via Originale',
            'city' => 'Roma',
            'postal_code' => '00100',
            'removed' => false,
        ]);

        $response = $this->get(route('customer-shipping-addresses.edit', $address));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->has('address')
            ->where('address.uuid', $address->uuid)
            ->where('address.street', 'Via Originale')
            ->has('customers')
            ->has('divisions')
        );
    }

    #[Test]
    public function it_loads_divisions_for_customer_in_edit()
    {
        $this->actingAs($this->user);

        $address = CustomerShippingAddress::factory()->create([
            'customerdivision_uuid' => $this->division->uuid,
            'removed' => false,
        ]);

        $division2 = CustomerDivision::factory()->create([
            'customer_uuid' => $this->customer->uuid,
            'name' => 'Divisione 2',
            'removed' => false,
        ]);

        $response = $this->get(route('customer-shipping-addresses.edit', $address));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->where('divisions', function ($divisions) {
            $this->assertCount(2, $divisions);

            return true;
        })
        );
    }

    #[Test]
    public function it_updates_address_successfully()
    {
        $this->actingAs($this->user);

        $address = CustomerShippingAddress::factory()->create([
            'customerdivision_uuid' => $this->division->uuid,
            'street' => 'Via Originale',
            'city' => 'Roma',
            'postal_code' => '00100',
            'removed' => false,
        ]);

        $response = $this->put(route('customer-shipping-addresses.update', $address), [
            'customerdivision_uuid' => $this->division->uuid,
            'co' => 'c/o Updated',
            'street' => 'Via Aggiornata',
            'postal_code' => '20100',
            'city' => 'Milano',
            'province' => 'MI',
            'country' => 'Italia',
            'contacts' => 'Tel: 987654321',
        ]);

        $response->assertRedirect(route('customer-shipping-addresses.index'));
        $response->assertSessionHas('success', 'Indirizzo di spedizione aggiornato con successo.');

        $this->assertDatabaseHas('customershippingaddress', [
            'id' => $address->id,
            'street' => 'Via Aggiornata',
            'city' => 'Milano',
            'postal_code' => '20100',
            'province' => 'MI',
        ]);
    }

    #[Test]
    public function it_requires_customerdivision_uuid_on_update()
    {
        $this->actingAs($this->user);

        $address = CustomerShippingAddress::factory()->create([
            'customerdivision_uuid' => $this->division->uuid,
            'removed' => false,
        ]);

        $response = $this->put(route('customer-shipping-addresses.update', $address), [
            'street' => 'Via Test',
        ]);

        $response->assertSessionHasErrors(['customerdivision_uuid']);
    }

    #[Test]
    public function it_requires_street_on_update()
    {
        $this->actingAs($this->user);

        $address = CustomerShippingAddress::factory()->create([
            'customerdivision_uuid' => $this->division->uuid,
            'removed' => false,
        ]);

        $response = $this->put(route('customer-shipping-addresses.update', $address), [
            'customerdivision_uuid' => $this->division->uuid,
        ]);

        $response->assertSessionHasErrors(['street']);
    }

    #[Test]
    public function it_validates_customerdivision_uuid_exists_on_update()
    {
        $this->actingAs($this->user);

        $address = CustomerShippingAddress::factory()->create([
            'customerdivision_uuid' => $this->division->uuid,
            'removed' => false,
        ]);

        $response = $this->put(route('customer-shipping-addresses.update', $address), [
            'customerdivision_uuid' => 'non-existent-uuid',
            'street' => 'Via Test',
        ]);

        $response->assertSessionHasErrors(['customerdivision_uuid']);
    }

    #[Test]
    public function it_validates_postal_code_format_on_update()
    {
        $this->actingAs($this->user);

        $address = CustomerShippingAddress::factory()->create([
            'customerdivision_uuid' => $this->division->uuid,
            'removed' => false,
        ]);

        // CAP con formato errato (meno di 5 cifre)
        $response = $this->put(route('customer-shipping-addresses.update', $address), [
            'customerdivision_uuid' => $this->division->uuid,
            'street' => 'Via Test',
            'postal_code' => '1234',
        ]);

        $response->assertSessionHasErrors(['postal_code']);

        // CAP con formato incorrecto (letras)
        $response = $this->put(route('customer-shipping-addresses.update', $address), [
            'customerdivision_uuid' => $this->division->uuid,
            'street' => 'Via Test',
            'postal_code' => 'ABC12',
        ]);

        $response->assertSessionHasErrors(['postal_code']);
    }

    #[Test]
    public function it_validates_province_format_on_update()
    {
        $this->actingAs($this->user);

        $address = CustomerShippingAddress::factory()->create([
            'customerdivision_uuid' => $this->division->uuid,
            'removed' => false,
        ]);

        // Provincia con formato errato (più di 2 caratteri)
        $response = $this->put(route('customer-shipping-addresses.update', $address), [
            'customerdivision_uuid' => $this->division->uuid,
            'street' => 'Via Test',
            'province' => 'ROM',
        ]);

        $response->assertSessionHasErrors(['province']);

        // Provincia con formato errato (minuscole)
        $response = $this->put(route('customer-shipping-addresses.update', $address), [
            'customerdivision_uuid' => $this->division->uuid,
            'street' => 'Via Test',
            'province' => 'rm',
        ]);

        $response->assertSessionHasErrors(['province']);
    }

    #[Test]
    public function it_soft_deletes_address()
    {
        $this->actingAs($this->user);

        $address = CustomerShippingAddress::factory()->create([
            'customerdivision_uuid' => $this->division->uuid,
            'street' => 'Via da Eliminare',
            'removed' => false,
        ]);

        $response = $this->delete(route('customer-shipping-addresses.destroy', $address));

        $response->assertRedirect(route('customer-shipping-addresses.index'));
        $response->assertSessionHas('success', 'Indirizzo di spedizione eliminato con successo.');

        $address->refresh();
        $this->assertTrue($address->removed);

        $this->assertDatabaseHas('customershippingaddress', [
            'id' => $address->id,
            'removed' => 1,
        ]);
    }

    #[Test]
    public function it_does_not_show_deleted_address_in_index()
    {
        $this->actingAs($this->user);

        $activeAddress = CustomerShippingAddress::factory()->create([
            'customerdivision_uuid' => $this->division->uuid,
            'street' => 'Via Attiva',
            'removed' => false,
        ]);

        $deletedAddress = CustomerShippingAddress::factory()->create([
            'customerdivision_uuid' => $this->division->uuid,
            'street' => 'Via Eliminata',
            'removed' => true,
        ]);

        $response = $this->get(route('customer-shipping-addresses.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->where('addresses.data', function ($data) {
            $this->assertCount(1, $data);
            $this->assertEquals('Via Attiva', $data[0]['street']);

            return true;
        })
        );
    }

    #[Test]
    public function it_validates_postal_code_format_on_create()
    {
        $this->actingAs($this->user);

        // CAP con formato errato (meno di 5 cifre)
        $response = $this->post(route('customer-shipping-addresses.store'), [
            'customerdivision_uuid' => $this->division->uuid,
            'street' => 'Via Test',
            'postal_code' => '1234',
        ]);

        $response->assertSessionHasErrors(['postal_code']);

        // CAP con formato incorrecto (letras)
        $response = $this->post(route('customer-shipping-addresses.store'), [
            'customerdivision_uuid' => $this->division->uuid,
            'street' => 'Via Test',
            'postal_code' => 'ABC12',
        ]);

        $response->assertSessionHasErrors(['postal_code']);
    }

    #[Test]
    public function it_validates_province_format_on_create()
    {
        $this->actingAs($this->user);

        // Provincia con formato errato (più di 2 caratteri)
        $response = $this->post(route('customer-shipping-addresses.store'), [
            'customerdivision_uuid' => $this->division->uuid,
            'street' => 'Via Test',
            'province' => 'ROM',
        ]);

        $response->assertSessionHasErrors(['province']);

        // Provincia con formato errato (minuscole)
        $response = $this->post(route('customer-shipping-addresses.store'), [
            'customerdivision_uuid' => $this->division->uuid,
            'street' => 'Via Test',
            'province' => 'rm',
        ]);

        $response->assertSessionHasErrors(['province']);
    }

    #[Test]
    public function it_handles_empty_search_results()
    {
        $this->actingAs($this->user);

        $response = $this->get(route('customer-shipping-addresses.index', [
            'search' => 'NonExistentAddress',
        ]));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->where('addresses.data', function ($data) {
            $this->assertCount(0, $data);

            return true;
        })
        );
    }

    #[Test]
    public function it_validates_street_max_length()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('customer-shipping-addresses.store'), [
            'customerdivision_uuid' => $this->division->uuid,
            'street' => str_repeat('a', 256), // Più di 255 caratteri
        ]);

        $response->assertSessionHasErrors(['street']);
    }

    #[Test]
    public function it_validates_co_max_length()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('customer-shipping-addresses.store'), [
            'customerdivision_uuid' => $this->division->uuid,
            'street' => 'Via Test',
            'co' => str_repeat('a', 256), // Più di 255 caratteri
        ]);

        $response->assertSessionHasErrors(['co']);
    }

    #[Test]
    public function it_validates_city_max_length()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('customer-shipping-addresses.store'), [
            'customerdivision_uuid' => $this->division->uuid,
            'street' => 'Via Test',
            'city' => str_repeat('a', 256), // Più di 255 caratteri
        ]);

        $response->assertSessionHasErrors(['city']);
    }

    #[Test]
    public function it_validates_country_max_length()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('customer-shipping-addresses.store'), [
            'customerdivision_uuid' => $this->division->uuid,
            'street' => 'Via Test',
            'country' => str_repeat('a', 256), // Più di 255 caratteri
        ]);

        $response->assertSessionHasErrors(['country']);
    }

    #[Test]
    public function it_validates_street_max_length_on_update()
    {
        $this->actingAs($this->user);

        $address = CustomerShippingAddress::factory()->create([
            'customerdivision_uuid' => $this->division->uuid,
            'removed' => false,
        ]);

        $response = $this->put(route('customer-shipping-addresses.update', $address), [
            'customerdivision_uuid' => $this->division->uuid,
            'street' => str_repeat('a', 256), // Più di 255 caratteri
        ]);

        $response->assertSessionHasErrors(['street']);
    }

    #[Test]
    public function it_validates_load_divisions_with_invalid_customer_uuid()
    {
        $this->actingAs($this->user);

        $response = $this->getJson(route('customer-shipping-addresses.load-divisions'), [
            'customer_uuid' => 'invalid-uuid',
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['customer_uuid']);
    }

    #[Test]
    public function it_validates_load_divisions_without_customer_uuid()
    {
        $this->actingAs($this->user);

        $response = $this->getJson('/customer-shipping-addresses/load-divisions');

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['customer_uuid']);
    }

    #[Test]
    public function it_handles_address_with_all_nullable_fields()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('customer-shipping-addresses.store'), [
            'customerdivision_uuid' => $this->division->uuid,
            'street' => 'Via Test',
        ]);

        $response->assertRedirect(route('customer-shipping-addresses.index'));

        $this->assertDatabaseHas('customershippingaddress', [
            'customerdivision_uuid' => $this->division->uuid,
            'street' => 'Via Test',
            'co' => null,
            'postal_code' => null,
            'city' => null,
            'province' => null,
            'country' => null,
            'contacts' => null,
            'removed' => false,
        ]);
    }

    #[Test]
    public function it_handles_empty_divisions_list_when_customer_has_no_divisions()
    {
        $this->actingAs($this->user);

        $customerWithoutDivisions = Customer::factory()->create([
            'removed' => false,
        ]);

        $response = $this->getJson('/customer-shipping-addresses/load-divisions?customer_uuid='.$customerWithoutDivisions->uuid);

        $response->assertStatus(200);
        $divisions = $response->json('customer_divisions');
        $this->assertCount(0, $divisions);
    }

    #[Test]
    public function it_validates_co_max_length_on_update()
    {
        $this->actingAs($this->user);

        $address = CustomerShippingAddress::factory()->create([
            'customerdivision_uuid' => $this->division->uuid,
            'removed' => false,
        ]);

        $response = $this->put(route('customer-shipping-addresses.update', $address), [
            'customerdivision_uuid' => $this->division->uuid,
            'street' => 'Via Test',
            'co' => str_repeat('a', 256), // Più di 255 caratteri
        ]);

        $response->assertSessionHasErrors(['co']);
    }

    #[Test]
    public function it_validates_city_max_length_on_update()
    {
        $this->actingAs($this->user);

        $address = CustomerShippingAddress::factory()->create([
            'customerdivision_uuid' => $this->division->uuid,
            'removed' => false,
        ]);

        $response = $this->put(route('customer-shipping-addresses.update', $address), [
            'customerdivision_uuid' => $this->division->uuid,
            'street' => 'Via Test',
            'city' => str_repeat('a', 256), // Più di 255 caratteri
        ]);

        $response->assertSessionHasErrors(['city']);
    }

    #[Test]
    public function it_validates_country_max_length_on_update()
    {
        $this->actingAs($this->user);

        $address = CustomerShippingAddress::factory()->create([
            'customerdivision_uuid' => $this->division->uuid,
            'removed' => false,
        ]);

        $response = $this->put(route('customer-shipping-addresses.update', $address), [
            'customerdivision_uuid' => $this->division->uuid,
            'street' => 'Via Test',
            'country' => str_repeat('a', 256), // Più di 255 caratteri
        ]);

        $response->assertSessionHasErrors(['country']);
    }

    #[Test]
    public function it_accepts_valid_postal_code_format()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('customer-shipping-addresses.store'), [
            'customerdivision_uuid' => $this->division->uuid,
            'street' => 'Via Test',
            'postal_code' => '12345', // Formato valido: 5 cifre
        ]);

        $response->assertRedirect(route('customer-shipping-addresses.index'));

        $this->assertDatabaseHas('customershippingaddress', [
            'customerdivision_uuid' => $this->division->uuid,
            'postal_code' => '12345',
        ]);
    }

    #[Test]
    public function it_accepts_valid_province_format()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('customer-shipping-addresses.store'), [
            'customerdivision_uuid' => $this->division->uuid,
            'street' => 'Via Test',
            'province' => 'RM', // Formato valido: 2 lettere maiuscole
        ]);

        $response->assertRedirect(route('customer-shipping-addresses.index'));

        $this->assertDatabaseHas('customershippingaddress', [
            'customerdivision_uuid' => $this->division->uuid,
            'province' => 'RM',
        ]);
    }

    #[Test]
    public function it_handles_show_with_no_orders()
    {
        $this->actingAs($this->user);

        $address = CustomerShippingAddress::factory()->create([
            'customerdivision_uuid' => $this->division->uuid,
            'removed' => false,
        ]);

        $response = $this->get(route('customer-shipping-addresses.show', $address));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->has('address.orders')
            ->where('address.orders', function ($orders) {
                $ordersArray = is_object($orders) && method_exists($orders, 'toArray') ? $orders->toArray() : (array) $orders;
                $this->assertIsArray($ordersArray);

                return true;
            })
        );
    }

    #[Test]
    public function it_handles_create_with_customerdivision_uuid_parameter()
    {
        $this->actingAs($this->user);

        $response = $this->get(route('customer-shipping-addresses.create', [
            'customer_uuid' => $this->customer->uuid,
            'customerdivision_uuid' => $this->division->uuid,
        ]));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->where('customerdivision_uuid', $this->division->uuid)
        );
    }
}
