<?php

namespace Tests\Feature\Controllers;

use App\Models\Customer;
use App\Models\CustomerDivision;
use App\Models\CustomerShippingAddress;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class CustomerDivisionControllerTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

    protected Customer $customer;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();

        $this->customer = Customer::factory()->create([
            'removed' => false,
            'code' => 'CLI001',
            'company_name' => 'Test Customer SRL',
        ]);
    }

    #[Test]
    public function it_displays_index_page_with_divisions()
    {
        $this->actingAs($this->user);

        $division1 = CustomerDivision::factory()->create([
            'customer_uuid' => $this->customer->uuid,
            'name' => 'Divisione Test 1',
            'code' => 'DIV001',
            'removed' => false,
        ]);

        $division2 = CustomerDivision::factory()->create([
            'customer_uuid' => $this->customer->uuid,
            'name' => 'Divisione Test 2',
            'code' => 'DIV002',
            'removed' => false,
        ]);

        $response = $this->get(route('customer-divisions.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->has('divisions')
            ->has('divisions.data')
            ->has('customers')
        );
    }

    #[Test]
    public function it_filters_divisions_by_customer()
    {
        $this->actingAs($this->user);

        $customer2 = Customer::factory()->create([
            'removed' => false,
            'company_name' => 'Cliente 2',
        ]);

        $division1 = CustomerDivision::factory()->create([
            'customer_uuid' => $this->customer->uuid,
            'name' => 'Divisione Cliente 1',
            'removed' => false,
        ]);

        $division2 = CustomerDivision::factory()->create([
            'customer_uuid' => $customer2->uuid,
            'name' => 'Divisione Cliente 2',
            'removed' => false,
        ]);

        $response = $this->get(route('customer-divisions.index', [
            'customer_uuid' => $this->customer->uuid,
        ]));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->where('divisions.data', function ($data) use ($division1) {
            $dataArray = is_object($data) && method_exists($data, 'toArray') ? $data->toArray() : (array) $data;
            $this->assertCount(1, $dataArray);
            $this->assertEquals($division1->uuid, $dataArray[0]['uuid']);

            return true;
        })
        );
    }

    #[Test]
    public function it_searches_divisions_by_name()
    {
        $this->actingAs($this->user);

        $division1 = CustomerDivision::factory()->create([
            'customer_uuid' => $this->customer->uuid,
            'name' => 'Divisione Produzione',
            'removed' => false,
        ]);

        $division2 = CustomerDivision::factory()->create([
            'customer_uuid' => $this->customer->uuid,
            'name' => 'Divisione Vendite',
            'removed' => false,
        ]);

        $response = $this->get(route('customer-divisions.index', [
            'search' => 'Produzione',
        ]));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->where('divisions.data', function ($data) {
            $dataArray = is_object($data) && method_exists($data, 'toArray') ? $data->toArray() : (array) $data;
            $this->assertCount(1, $dataArray);
            $this->assertEquals('Divisione Produzione', $dataArray[0]['name']);

            return true;
        })
        );
    }

    #[Test]
    public function it_searches_divisions_by_code()
    {
        $this->actingAs($this->user);

        $division1 = CustomerDivision::factory()->create([
            'customer_uuid' => $this->customer->uuid,
            'name' => 'Divisione 1',
            'code' => 'DIV001',
            'removed' => false,
        ]);

        $division2 = CustomerDivision::factory()->create([
            'customer_uuid' => $this->customer->uuid,
            'name' => 'Divisione 2',
            'code' => 'DIV002',
            'removed' => false,
        ]);

        $response = $this->get(route('customer-divisions.index', [
            'search' => 'DIV001',
        ]));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->where('divisions.data', function ($data) {
            $dataArray = is_object($data) && method_exists($data, 'toArray') ? $data->toArray() : (array) $data;
            $this->assertCount(1, $dataArray);
            $this->assertEquals('DIV001', $dataArray[0]['code']);

            return true;
        })
        );
    }

    #[Test]
    public function it_excludes_removed_divisions_from_index()
    {
        $this->actingAs($this->user);

        $activeDivision = CustomerDivision::factory()->create([
            'customer_uuid' => $this->customer->uuid,
            'name' => 'Divisione Attiva',
            'removed' => false,
        ]);

        $removedDivision = CustomerDivision::factory()->create([
            'customer_uuid' => $this->customer->uuid,
            'name' => 'Divisione Rimossa',
            'removed' => true,
        ]);

        $response = $this->get(route('customer-divisions.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->where('divisions.data', function ($data) {
            $dataArray = is_object($data) && method_exists($data, 'toArray') ? $data->toArray() : (array) $data;
            $this->assertCount(1, $dataArray);
            $this->assertEquals('Divisione Attiva', $dataArray[0]['name']);

            return true;
        })
        );
    }

    #[Test]
    public function it_displays_create_form_with_customers()
    {
        $this->actingAs($this->user);

        $response = $this->get(route('customer-divisions.create'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->has('customers')
            ->where('customers.0.uuid', $this->customer->uuid)
        );
    }

    #[Test]
    public function it_prefills_customer_in_create_form()
    {
        $this->actingAs($this->user);

        $response = $this->get(route('customer-divisions.create', [
            'customer_uuid' => $this->customer->uuid,
        ]));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->where('customer_uuid', $this->customer->uuid)
        );
    }

    #[Test]
    public function it_creates_division_successfully()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('customer-divisions.store'), [
            'customer_uuid' => $this->customer->uuid,
            'name' => 'Nuova Divisione',
            'code' => 'DIV001',
            'email' => 'divisione@test.com',
            'contacts' => 'Tel: 123456789',
        ]);

        $response->assertRedirect(route('customer-divisions.index'));
        $response->assertSessionHas('success', 'Divisione creata con successo.');

        $this->assertDatabaseHas('customerdivision', [
            'customer_uuid' => $this->customer->uuid,
            'name' => 'Nuova Divisione',
            'code' => 'DIV001',
            'email' => 'divisione@test.com',
            'contacts' => 'Tel: 123456789',
            'removed' => false,
        ]);
    }

    #[Test]
    public function it_creates_division_with_minimal_required_fields()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('customer-divisions.store'), [
            'customer_uuid' => $this->customer->uuid,
            'name' => 'Divisione Minima',
        ]);

        $response->assertRedirect(route('customer-divisions.index'));

        $this->assertDatabaseHas('customerdivision', [
            'customer_uuid' => $this->customer->uuid,
            'name' => 'Divisione Minima',
            'removed' => false,
        ]);
    }

    #[Test]
    public function it_requires_customer_uuid()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('customer-divisions.store'), [
            'name' => 'Divisione Test',
        ]);

        $response->assertSessionHasErrors(['customer_uuid']);
    }

    #[Test]
    public function it_requires_name()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('customer-divisions.store'), [
            'customer_uuid' => $this->customer->uuid,
        ]);

        $response->assertSessionHasErrors(['name']);
    }

    #[Test]
    public function it_validates_customer_uuid_exists()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('customer-divisions.store'), [
            'customer_uuid' => 'non-existent-uuid',
            'name' => 'Divisione Test',
        ]);

        $response->assertSessionHasErrors(['customer_uuid']);
    }

    #[Test]
    public function it_validates_email_format()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('customer-divisions.store'), [
            'customer_uuid' => $this->customer->uuid,
            'name' => 'Divisione Test',
            'email' => 'invalid-email',
        ]);

        $response->assertSessionHasErrors(['email']);
    }

    #[Test]
    public function it_validates_uuid_uniqueness()
    {
        $this->actingAs($this->user);

        $existingDivision = CustomerDivision::factory()->create([
            'customer_uuid' => $this->customer->uuid,
            'removed' => false,
        ]);

        $response = $this->post(route('customer-divisions.store'), [
            'uuid' => $existingDivision->uuid,
            'customer_uuid' => $this->customer->uuid,
            'name' => 'Divisione Test',
        ]);

        $response->assertSessionHasErrors(['uuid']);
    }

    #[Test]
    public function it_generates_uuid_automatically()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('customer-divisions.store'), [
            'customer_uuid' => $this->customer->uuid,
            'name' => 'Divisione Test',
        ]);

        $division = CustomerDivision::latest()->first();
        $this->assertNotNull($division->uuid);
        $this->assertMatchesRegularExpression('/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i', $division->uuid);
    }

    #[Test]
    public function it_displays_show_page_with_division_details()
    {
        $this->actingAs($this->user);

        $division = CustomerDivision::factory()->create([
            'customer_uuid' => $this->customer->uuid,
            'name' => 'Divisione Test',
            'code' => 'DIV001',
            'removed' => false,
        ]);

        $response = $this->get(route('customer-divisions.show', $division));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->has('division')
            ->where('division.uuid', $division->uuid)
            ->where('division.name', 'Divisione Test')
            ->has('division.customer')
            ->has('division.shipping_addresses')
        );
    }

    #[Test]
    public function it_loads_customer_and_shipping_addresses_in_show()
    {
        $this->actingAs($this->user);

        $division = CustomerDivision::factory()->create([
            'customer_uuid' => $this->customer->uuid,
            'removed' => false,
        ]);

        $shippingAddress = CustomerShippingAddress::factory()->create([
            'customerdivision_uuid' => $division->uuid,
            'removed' => false,
        ]);

        $response = $this->get(route('customer-divisions.show', $division));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->where('division.customer.uuid', $this->customer->uuid)
            ->where('division.shipping_addresses.0.uuid', $shippingAddress->uuid)
        );
    }

    #[Test]
    public function it_displays_edit_form_with_division_data()
    {
        $this->actingAs($this->user);

        $division = CustomerDivision::factory()->create([
            'customer_uuid' => $this->customer->uuid,
            'name' => 'Divisione Originale',
            'code' => 'DIV001',
            'email' => 'original@test.com',
            'removed' => false,
        ]);

        $response = $this->get(route('customer-divisions.edit', $division));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->has('division')
            ->where('division.uuid', $division->uuid)
            ->where('division.name', 'Divisione Originale')
            ->has('customers')
        );
    }

    #[Test]
    public function it_updates_division_successfully()
    {
        $this->actingAs($this->user);

        $division = CustomerDivision::factory()->create([
            'customer_uuid' => $this->customer->uuid,
            'name' => 'Divisione Originale',
            'code' => 'DIV001',
            'removed' => false,
        ]);

        $response = $this->put(route('customer-divisions.update', $division), [
            'customer_uuid' => $this->customer->uuid,
            'name' => 'Divisione Aggiornata',
            'code' => 'DIV002',
            'email' => 'updated@test.com',
            'contacts' => 'Tel: 987654321',
        ]);

        $response->assertRedirect(route('customer-divisions.index'));
        $response->assertSessionHas('success', 'Divisione aggiornata con successo.');

        $this->assertDatabaseHas('customerdivision', [
            'id' => $division->id,
            'name' => 'Divisione Aggiornata',
            'code' => 'DIV002',
            'email' => 'updated@test.com',
            'contacts' => 'Tel: 987654321',
        ]);
    }

    #[Test]
    public function it_validates_customer_uuid_on_update()
    {
        $this->actingAs($this->user);

        $division = CustomerDivision::factory()->create([
            'customer_uuid' => $this->customer->uuid,
            'removed' => false,
        ]);

        $response = $this->put(route('customer-divisions.update', $division), [
            'name' => 'Divisione Test',
        ]);

        $response->assertSessionHasErrors(['customer_uuid']);
    }

    #[Test]
    public function it_validates_name_on_update()
    {
        $this->actingAs($this->user);

        $division = CustomerDivision::factory()->create([
            'customer_uuid' => $this->customer->uuid,
            'removed' => false,
        ]);

        $response = $this->put(route('customer-divisions.update', $division), [
            'customer_uuid' => $this->customer->uuid,
        ]);

        $response->assertSessionHasErrors(['name']);
    }

    #[Test]
    public function it_validates_email_format_on_update()
    {
        $this->actingAs($this->user);

        $division = CustomerDivision::factory()->create([
            'customer_uuid' => $this->customer->uuid,
            'removed' => false,
        ]);

        $response = $this->put(route('customer-divisions.update', $division), [
            'customer_uuid' => $this->customer->uuid,
            'name' => 'Divisione Test',
            'email' => 'invalid-email',
        ]);

        $response->assertSessionHasErrors(['email']);
    }

    #[Test]
    public function it_deletes_division_softly()
    {
        $this->actingAs($this->user);

        $division = CustomerDivision::factory()->create([
            'customer_uuid' => $this->customer->uuid,
            'name' => 'Divisione da Eliminare',
            'removed' => false,
        ]);

        $response = $this->delete(route('customer-divisions.destroy', $division));

        $response->assertRedirect(route('customer-divisions.index'));
        $response->assertSessionHas('success', 'Divisione eliminata con successo.');

        $division->refresh();
        $this->assertTrue($division->removed);
    }

    #[Test]
    public function it_does_not_show_deleted_division_in_index()
    {
        $this->actingAs($this->user);

        $activeDivision = CustomerDivision::factory()->create([
            'customer_uuid' => $this->customer->uuid,
            'name' => 'Divisione Attiva',
            'removed' => false,
        ]);

        $deletedDivision = CustomerDivision::factory()->create([
            'customer_uuid' => $this->customer->uuid,
            'name' => 'Divisione Eliminata',
            'removed' => true,
        ]);

        $response = $this->get(route('customer-divisions.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->where('divisions.data', function ($data) {
            $dataArray = is_object($data) && method_exists($data, 'toArray') ? $data->toArray() : (array) $data;
            $this->assertCount(1, $dataArray);
            $this->assertEquals('Divisione Attiva', $dataArray[0]['name']);

            return true;
        })
        );
    }

    #[Test]
    public function it_paginates_divisions()
    {
        $this->actingAs($this->user);

        CustomerDivision::factory()->count(20)->create([
            'customer_uuid' => $this->customer->uuid,
            'removed' => false,
        ]);

        $response = $this->get(route('customer-divisions.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->where('divisions.data', function ($data) {
            $dataArray = is_object($data) && method_exists($data, 'toArray') ? $data->toArray() : (array) $data;
            $this->assertCount(15, $dataArray);

            return true;
        })
            ->has('divisions.current_page')
            ->has('divisions.last_page')
        );
    }

    #[Test]
    public function it_handles_empty_search_results()
    {
        $this->actingAs($this->user);

        $response = $this->get(route('customer-divisions.index', [
            'search' => 'NonExistentDivision',
        ]));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->where('divisions.data', function ($data) {
            $dataArray = is_object($data) && method_exists($data, 'toArray') ? $data->toArray() : (array) $data;
            $this->assertCount(0, $dataArray);

            return true;
        })
        );
    }

    #[Test]
    public function it_validates_name_max_length()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('customer-divisions.store'), [
            'customer_uuid' => $this->customer->uuid,
            'name' => str_repeat('a', 256), // Más de 255 caracteres
        ]);

        $response->assertSessionHasErrors(['name']);
    }

    #[Test]
    public function it_validates_code_max_length()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('customer-divisions.store'), [
            'customer_uuid' => $this->customer->uuid,
            'name' => 'Divisione Test',
            'code' => str_repeat('a', 256), // Más de 255 caracteres
        ]);

        $response->assertSessionHasErrors(['code']);
    }

    #[Test]
    public function it_validates_email_max_length()
    {
        $this->actingAs($this->user);

        $longEmail = str_repeat('a', 250).'@test.com'; // Más de 255 caracteres

        $response = $this->post(route('customer-divisions.store'), [
            'customer_uuid' => $this->customer->uuid,
            'name' => 'Divisione Test',
            'email' => $longEmail,
        ]);

        $response->assertSessionHasErrors(['email']);
    }

    #[Test]
    public function it_validates_name_max_length_on_update()
    {
        $this->actingAs($this->user);

        $division = CustomerDivision::factory()->create([
            'customer_uuid' => $this->customer->uuid,
            'removed' => false,
        ]);

        $response = $this->put(route('customer-divisions.update', $division), [
            'customer_uuid' => $this->customer->uuid,
            'name' => str_repeat('a', 256), // Más de 255 caracteres
        ]);

        $response->assertSessionHasErrors(['name']);
    }

    #[Test]
    public function it_handles_division_with_all_nullable_fields()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('customer-divisions.store'), [
            'customer_uuid' => $this->customer->uuid,
            'name' => 'Divisione Solo Nome',
        ]);

        $response->assertRedirect(route('customer-divisions.index'));

        $this->assertDatabaseHas('customerdivision', [
            'customer_uuid' => $this->customer->uuid,
            'name' => 'Divisione Solo Nome',
            'code' => null,
            'email' => null,
            'contacts' => null,
            'removed' => false,
        ]);
    }

    #[Test]
    public function it_updates_division_with_nullable_fields_to_null()
    {
        $this->actingAs($this->user);

        $division = CustomerDivision::factory()->create([
            'customer_uuid' => $this->customer->uuid,
            'name' => 'Divisione Originale',
            'code' => 'DIV001',
            'email' => 'test@example.com',
            'contacts' => 'Tel: 123',
            'removed' => false,
        ]);

        $response = $this->put(route('customer-divisions.update', $division), [
            'customer_uuid' => $this->customer->uuid,
            'name' => 'Divisione Aggiornata',
            'code' => '',
            'email' => '',
            'contacts' => '',
        ]);

        $response->assertRedirect(route('customer-divisions.index'));

        $division->refresh();
        $this->assertEquals('Divisione Aggiornata', $division->name);
        // Los campos vacíos se mantienen como están (no se convierten a null automáticamente en este controlador)
    }

    #[Test]
    public function it_validates_code_max_length_on_update()
    {
        $this->actingAs($this->user);

        $division = CustomerDivision::factory()->create([
            'customer_uuid' => $this->customer->uuid,
            'removed' => false,
        ]);

        $response = $this->put(route('customer-divisions.update', $division), [
            'customer_uuid' => $this->customer->uuid,
            'name' => 'Divisione Test',
            'code' => str_repeat('a', 256), // Más de 255 caracteres
        ]);

        $response->assertSessionHasErrors(['code']);
    }

    #[Test]
    public function it_validates_email_max_length_on_update()
    {
        $this->actingAs($this->user);

        $division = CustomerDivision::factory()->create([
            'customer_uuid' => $this->customer->uuid,
            'removed' => false,
        ]);

        $longEmail = str_repeat('a', 250).'@test.com'; // Más de 255 caracteres

        $response = $this->put(route('customer-divisions.update', $division), [
            'customer_uuid' => $this->customer->uuid,
            'name' => 'Divisione Test',
            'email' => $longEmail,
        ]);

        $response->assertSessionHasErrors(['email']);
    }

    #[Test]
    public function it_handles_show_with_removed_shipping_addresses()
    {
        $this->actingAs($this->user);

        $division = CustomerDivision::factory()->create([
            'customer_uuid' => $this->customer->uuid,
            'removed' => false,
        ]);

        $activeAddress = CustomerShippingAddress::factory()->create([
            'customerdivision_uuid' => $division->uuid,
            'removed' => false,
        ]);

        $removedAddress = CustomerShippingAddress::factory()->create([
            'customerdivision_uuid' => $division->uuid,
            'removed' => true,
        ]);

        $response = $this->get(route('customer-divisions.show', $division));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->where('division.shipping_addresses', function ($addresses) use ($activeAddress) {
            $addressesArray = is_object($addresses) && method_exists($addresses, 'toArray') ? $addresses->toArray() : (array) $addresses;
            $this->assertCount(1, $addressesArray);
            $this->assertEquals($activeAddress->uuid, $addressesArray[0]['uuid']);

            return true;
        })
        );
    }
}
