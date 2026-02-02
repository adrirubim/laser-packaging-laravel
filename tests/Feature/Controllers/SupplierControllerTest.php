<?php

namespace Tests\Feature\Controllers;

use App\Models\Supplier;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class SupplierControllerTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    #[Test]
    public function it_displays_index_page_with_suppliers()
    {
        $this->actingAs($this->user);

        Supplier::factory()->create([
            'removed' => false,
            'code' => 'SUP-001',
            'company_name' => 'Supplier 1',
        ]);

        $response = $this->get(route('suppliers.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->has('suppliers')
            ->has('suppliers.data')
        );
    }

    #[Test]
    public function it_filters_suppliers_by_search()
    {
        $this->actingAs($this->user);

        Supplier::factory()->create(['code' => 'SUP-001', 'company_name' => 'Supplier Alpha']);
        Supplier::factory()->create(['code' => 'SUP-002', 'company_name' => 'Supplier Beta']);

        $response = $this->get(route('suppliers.index', ['search' => 'Alpha']));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->where('filters.search', 'Alpha')
        );
    }

    #[Test]
    public function it_shows_create_form()
    {
        $this->actingAs($this->user);

        $response = $this->get(route('suppliers.create'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('Suppliers/Create')
        );
    }

    #[Test]
    public function it_stores_new_supplier()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('suppliers.store'), [
            'code' => 'SUP-NEW',
            'company_name' => 'New Supplier',
            'vat_number' => 'IT12345678901',
            'street' => 'Via Test 123',
            'city' => 'Milano',
            'postal_code' => '20100',
            'country' => 'Italia',
        ]);

        $response->assertRedirect(route('suppliers.index'));
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('supplier', [
            'code' => 'SUP-NEW',
            'company_name' => 'New Supplier',
            'removed' => false,
        ]);
    }

    #[Test]
    public function it_validates_unique_code()
    {
        $this->actingAs($this->user);

        Supplier::factory()->create(['code' => 'SUP-001']);

        $response = $this->post(route('suppliers.store'), [
            'code' => 'SUP-001',
            'company_name' => 'Duplicate',
        ]);

        $response->assertSessionHasErrors(['code']);
    }

    #[Test]
    public function it_shows_supplier()
    {
        $this->actingAs($this->user);

        $supplier = Supplier::factory()->create();

        $response = $this->get(route('suppliers.show', $supplier));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('Suppliers/Show')
            ->has('supplier')
        );
    }

    #[Test]
    public function it_shows_edit_form()
    {
        $this->actingAs($this->user);

        $supplier = Supplier::factory()->create();

        $response = $this->get(route('suppliers.edit', $supplier));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('Suppliers/Edit')
            ->has('supplier')
        );
    }

    #[Test]
    public function it_updates_supplier()
    {
        $this->actingAs($this->user);

        $supplier = Supplier::factory()->create([
            'code' => 'SUP-OLD',
            'company_name' => 'Old Supplier',
        ]);

        $response = $this->put(route('suppliers.update', $supplier), [
            'code' => 'SUP-NEW',
            'company_name' => 'New Supplier',
        ]);

        $response->assertRedirect(route('suppliers.index'));
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('supplier', [
            'id' => $supplier->id,
            'code' => 'SUP-NEW',
            'company_name' => 'New Supplier',
        ]);
    }

    #[Test]
    public function it_destroys_supplier()
    {
        $this->actingAs($this->user);

        $supplier = Supplier::factory()->create();

        $response = $this->delete(route('suppliers.destroy', $supplier));

        $response->assertRedirect(route('suppliers.index'));
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('supplier', [
            'id' => $supplier->id,
            'removed' => true,
        ]);
    }

    #[Test]
    public function it_requires_code()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('suppliers.store'), [
            'company_name' => 'Test Supplier',
        ]);

        $response->assertSessionHasErrors(['code']);
    }

    #[Test]
    public function it_requires_company_name()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('suppliers.store'), [
            'code' => 'SUP-001',
        ]);

        $response->assertSessionHasErrors(['company_name']);
    }

    #[Test]
    public function it_validates_code_max_length()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('suppliers.store'), [
            'code' => str_repeat('a', 256),
            'company_name' => 'Test Supplier',
        ]);

        $response->assertSessionHasErrors(['code']);
    }

    #[Test]
    public function it_validates_company_name_max_length()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('suppliers.store'), [
            'code' => 'SUP-001',
            'company_name' => str_repeat('a', 256),
        ]);

        $response->assertSessionHasErrors(['company_name']);
    }

    #[Test]
    public function it_only_shows_active_suppliers()
    {
        $this->actingAs($this->user);

        $active = Supplier::factory()->create(['removed' => false, 'code' => 'SUP-ACTIVE']);
        $removed = Supplier::factory()->create(['removed' => true, 'code' => 'SUP-REMOVED']);

        $response = $this->get(route('suppliers.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->where('suppliers.data', function ($data) use ($active) {
            $dataArray = is_object($data) && method_exists($data, 'toArray') ? $data->toArray() : (array) $data;
            $this->assertCount(1, $dataArray);
            $this->assertEquals($active->uuid, $dataArray[0]['uuid']);

            return true;
        })
        );
    }

    #[Test]
    public function it_paginates_suppliers()
    {
        $this->actingAs($this->user);

        Supplier::factory()->count(20)->create(['removed' => false]);

        $response = $this->get(route('suppliers.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->where('suppliers.data', function ($data) {
            $dataArray = is_object($data) && method_exists($data, 'toArray') ? $data->toArray() : (array) $data;
            $this->assertCount(15, $dataArray);

            return true;
        })
            ->has('suppliers.current_page')
            ->has('suppliers.last_page')
        );
    }

    #[Test]
    public function it_handles_empty_search_results()
    {
        $this->actingAs($this->user);

        $response = $this->get(route('suppliers.index', [
            'search' => 'NonExistentSupplier',
        ]));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->where('suppliers.data', function ($data) {
            $dataArray = is_object($data) && method_exists($data, 'toArray') ? $data->toArray() : (array) $data;
            $this->assertCount(0, $dataArray);

            return true;
        })
        );
    }

    #[Test]
    public function it_searches_by_vat_number()
    {
        $this->actingAs($this->user);

        Supplier::factory()->create(['vat_number' => 'IT12345678901', 'code' => 'SUP-001']);
        Supplier::factory()->create(['vat_number' => 'IT98765432109', 'code' => 'SUP-002']);

        $response = $this->get(route('suppliers.index', ['search' => '12345678901']));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->where('suppliers.data', function ($data) {
            $dataArray = is_object($data) && method_exists($data, 'toArray') ? $data->toArray() : (array) $data;
            $this->assertCount(1, $dataArray);

            return true;
        })
        );
    }
}
