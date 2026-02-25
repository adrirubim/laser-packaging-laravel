<?php

namespace Tests\Feature\Controllers;

use App\Models\Article;
use App\Models\Customer;
use App\Models\CustomerDivision;
use App\Models\CustomerShippingAddress;
use App\Models\Offer;
use App\Models\Order;
use App\Models\PalletType;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class OrderControllerTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

    protected Article $article;

    protected CustomerShippingAddress $shippingAddress;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();

        $customer = Customer::factory()->create(['removed' => false]);
        $division = CustomerDivision::factory()->create([
            'customer_uuid' => $customer->uuid,
            'removed' => false,
        ]);
        $this->shippingAddress = CustomerShippingAddress::factory()->create([
            'customerdivision_uuid' => $division->uuid,
            'removed' => false,
        ]);
        $offer = Offer::factory()->create([
            'customer_uuid' => $customer->uuid,
            'customerdivision_uuid' => $division->uuid,
            'removed' => false,
        ]);
        $palletType = PalletType::factory()->create(['removed' => false]);
        $this->article = Article::factory()->create([
            'offer_uuid' => $offer->uuid,
            'pallet_uuid' => $palletType->uuid,
            'removed' => false,
        ]);
    }

    #[Test]
    public function it_generates_production_number_automatically_when_creating_order()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('orders.store'), [
            'article_uuid' => $this->article->uuid,
            'quantity' => 100,
            'customershippingaddress_uuid' => $this->shippingAddress->uuid,
        ]);

        $response->assertRedirect(route('orders.index'));
        $response->assertSessionHas('success');

        $order = Order::latest()->first();
        $this->assertNotNull($order->order_production_number);
        $this->assertMatchesRegularExpression('/^\d{4}\.\d{4}$/', $order->order_production_number);
    }

    #[Test]
    public function it_uses_provided_production_number_if_valid()
    {
        $this->actingAs($this->user);

        $productionNumber = '2025.0001';

        $response = $this->post(route('orders.store'), [
            'article_uuid' => $this->article->uuid,
            'order_production_number' => $productionNumber,
            'quantity' => 100,
            'customershippingaddress_uuid' => $this->shippingAddress->uuid,
        ]);

        $response->assertRedirect(route('orders.index'));

        $order = Order::latest()->first();
        $this->assertEquals($productionNumber, $order->order_production_number);
    }

    #[Test]
    public function it_rejects_duplicate_production_number()
    {
        $this->actingAs($this->user);

        $productionNumber = '2025.0001';

        // Create first order
        Order::factory()->create([
            'article_uuid' => $this->article->uuid,
            'order_production_number' => $productionNumber,
            'customershippingaddress_uuid' => $this->shippingAddress->uuid,
            'quantity' => 100,
            'removed' => false,
        ]);

        // Try to create second order with same number
        $response = $this->post(route('orders.store'), [
            'article_uuid' => $this->article->uuid,
            'order_production_number' => $productionNumber,
            'quantity' => 100,
            'customershippingaddress_uuid' => $this->shippingAddress->uuid,
        ]);

        $response->assertSessionHasErrors(['order_production_number']);
    }

    #[Test]
    public function it_initializes_order_with_correct_default_status()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('orders.store'), [
            'article_uuid' => $this->article->uuid,
            'quantity' => 100,
            'customershippingaddress_uuid' => $this->shippingAddress->uuid,
        ]);

        $order = Order::latest()->first();
        $this->assertEquals(Order::STATUS_PIANIFICATO, $order->status);
    }

    #[Test]
    public function it_initializes_semaphores_correctly()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('orders.store'), [
            'article_uuid' => $this->article->uuid,
            'quantity' => 100,
            'customershippingaddress_uuid' => $this->shippingAddress->uuid,
        ]);

        $order = Order::latest()->first();
        $semaforo = json_decode($order->status_semaforo, true);

        $this->assertEquals(0, $semaforo['etichette']);
        $this->assertEquals(0, $semaforo['packaging']);
        $this->assertEquals(0, $semaforo['prodotto']);
    }

    #[Test]
    public function it_updates_order_status_when_worked_quantity_is_set()
    {
        $this->actingAs($this->user);

        $order = Order::factory()->create([
            'article_uuid' => $this->article->uuid,
            'order_production_number' => '2025.0001',
            'status' => Order::STATUS_PIANIFICATO,
            'worked_quantity' => 0,
            'customershippingaddress_uuid' => $this->shippingAddress->uuid,
            'quantity' => 100,
            'removed' => false,
        ]);

        $response = $this->put(route('orders.update', $order), [
            'article_uuid' => $this->article->uuid,
            'order_production_number' => '2025.0001',
            'quantity' => 100,
            'worked_quantity' => 50,
            'customershippingaddress_uuid' => $this->shippingAddress->uuid,
        ]);

        $response->assertRedirect(route('orders.index'));

        $order->refresh();

        // If worked_quantity > 0 and status <= 2, should transition to STATUS_IN_AVANZAMENTO (3)
        $this->assertEquals(Order::STATUS_IN_AVANZAMENTO, $order->status);
        $this->assertEquals(50, $order->worked_quantity);
    }

    #[Test]
    public function it_displays_index_page_with_orders()
    {
        $this->actingAs($this->user);

        $order1 = Order::factory()->create([
            'article_uuid' => $this->article->uuid,
            'order_production_number' => '2025.0001',
            'quantity' => 100,
            'customershippingaddress_uuid' => $this->shippingAddress->uuid,
            'removed' => false,
        ]);

        $order2 = Order::factory()->create([
            'article_uuid' => $this->article->uuid,
            'order_production_number' => '2025.0002',
            'quantity' => 200,
            'customershippingaddress_uuid' => $this->shippingAddress->uuid,
            'removed' => false,
        ]);

        $response = $this->get(route('orders.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('Orders/Index')
            ->has('orders')
            ->has('orders.data')
            ->has('articles')
        );
    }

    #[Test]
    public function it_only_shows_active_orders_in_index()
    {
        $this->actingAs($this->user);

        $activeOrder = Order::factory()->create([
            'article_uuid' => $this->article->uuid,
            'order_production_number' => '2025.0001',
            'quantity' => 100,
            'customershippingaddress_uuid' => $this->shippingAddress->uuid,
            'removed' => false,
        ]);

        $removedOrder = Order::factory()->create([
            'article_uuid' => $this->article->uuid,
            'order_production_number' => '2025.0002',
            'quantity' => 200,
            'customershippingaddress_uuid' => $this->shippingAddress->uuid,
            'removed' => true,
        ]);

        $response = $this->get(route('orders.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->where('orders.data', function ($data) {
            $dataArray = is_object($data) && method_exists($data, 'toArray') ? $data->toArray() : (array) $data;
            $productionNumbers = array_column($dataArray, 'order_production_number');
            $this->assertContains('2025.0001', $productionNumbers);
            $this->assertNotContains('2025.0002', $productionNumbers);

            return true;
        })
        );
    }

    #[Test]
    public function it_filters_orders_by_search_term()
    {
        $this->actingAs($this->user);

        $order1 = Order::factory()->create([
            'article_uuid' => $this->article->uuid,
            'order_production_number' => '2025.0001',
            'quantity' => 100,
            'customershippingaddress_uuid' => $this->shippingAddress->uuid,
            'removed' => false,
        ]);

        $response = $this->get(route('orders.index', ['search' => '2025.0001']));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->has('orders')
            ->has('filters')
            ->where('filters.search', '2025.0001')
        );
    }

    #[Test]
    public function it_filters_orders_by_article_uuid()
    {
        $this->actingAs($this->user);

        $article2 = Article::factory()->create([
            'offer_uuid' => $this->article->offer_uuid,
            'removed' => false,
        ]);

        $order1 = Order::factory()->create([
            'article_uuid' => $this->article->uuid,
            'order_production_number' => '2025.0001',
            'quantity' => 100,
            'customershippingaddress_uuid' => $this->shippingAddress->uuid,
            'removed' => false,
        ]);

        $order2 = Order::factory()->create([
            'article_uuid' => $article2->uuid,
            'order_production_number' => '2025.0002',
            'quantity' => 200,
            'customershippingaddress_uuid' => $this->shippingAddress->uuid,
            'removed' => false,
        ]);

        $response = $this->get(route('orders.index', ['article_uuid' => $this->article->uuid]));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->has('filters')
            ->where('filters.article_uuid', $this->article->uuid)
        );
    }

    #[Test]
    public function it_displays_create_form()
    {
        $this->actingAs($this->user);

        $response = $this->get(route('orders.create'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('Orders/Create')
            ->has('articles')
            ->has('shippingAddresses')
            ->has('productionNumber')
        );
    }

    #[Test]
    public function it_displays_create_form_with_article_uuid()
    {
        $this->actingAs($this->user);

        $response = $this->get(route('orders.create', ['article_uuid' => $this->article->uuid]));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('Orders/Create')
            ->has('article')
            ->has('shippingAddresses')
            ->where('article.uuid', $this->article->uuid)
        );
    }

    #[Test]
    public function it_displays_show_page()
    {
        $this->actingAs($this->user);

        $order = Order::factory()->create([
            'article_uuid' => $this->article->uuid,
            'order_production_number' => '2025.0001',
            'quantity' => 100,
            'worked_quantity' => 50,
            'customershippingaddress_uuid' => $this->shippingAddress->uuid,
            'removed' => false,
        ]);

        $response = $this->get(route('orders.show', $order));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('Orders/Show')
            ->has('order')
            ->where('order.order_production_number', '2025.0001')
        );

        // Verify remain_quantity calculated
        $order->refresh();
        $this->assertEquals(50.0, $order->quantity - $order->worked_quantity);
    }

    #[Test]
    public function it_displays_edit_form()
    {
        $this->actingAs($this->user);

        $order = Order::factory()->create([
            'article_uuid' => $this->article->uuid,
            'order_production_number' => '2025.0001',
            'quantity' => 100,
            'customershippingaddress_uuid' => $this->shippingAddress->uuid,
            'removed' => false,
        ]);

        $response = $this->get(route('orders.edit', $order));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('Orders/Edit')
            ->has('order')
            ->has('articles')
            ->has('shippingAddresses')
            ->where('order.order_production_number', '2025.0001')
        );
    }

    #[Test]
    public function it_deletes_order_successfully()
    {
        $this->actingAs($this->user);

        $order = Order::factory()->create([
            'article_uuid' => $this->article->uuid,
            'order_production_number' => '2025.0001',
            'quantity' => 100,
            'customershippingaddress_uuid' => $this->shippingAddress->uuid,
            'removed' => false,
        ]);

        $orderId = $order->id;

        $response = $this->delete(route('orders.destroy', $order));

        $response->assertRedirect(route('orders.index'));
        $response->assertSessionHas('success');

        // Verify in database directly
        $this->assertDatabaseHas('orderorder', [
            'id' => $orderId,
            'removed' => true,
        ]);

        // Verify also by reloading the model
        $order->refresh();
        $this->assertTrue((bool) $order->removed);
    }

    #[Test]
    public function it_displays_production_advancements_page()
    {
        $this->actingAs($this->user);

        $order1 = Order::factory()->create([
            'article_uuid' => $this->article->uuid,
            'order_production_number' => '2025.0001',
            'quantity' => 100,
            'worked_quantity' => 50,
            'status' => Order::STATUS_IN_AVANZAMENTO,
            'customershippingaddress_uuid' => $this->shippingAddress->uuid,
            'removed' => false,
        ]);

        $response = $this->get(route('orders.production-advancements'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('Orders/ProductionAdvancements')
            ->has('orders')
            ->has('orders.data')
            ->has('articles')
        );
    }

    #[Test]
    public function it_filters_production_advancements_by_search()
    {
        $this->actingAs($this->user);

        $order = Order::factory()->create([
            'article_uuid' => $this->article->uuid,
            'order_production_number' => '2025.0001',
            'quantity' => 100,
            'worked_quantity' => 50,
            'status' => Order::STATUS_IN_AVANZAMENTO,
            'customershippingaddress_uuid' => $this->shippingAddress->uuid,
            'removed' => false,
        ]);

        $response = $this->get(route('orders.production-advancements', ['search' => '2025.0001']));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->has('filters')
            ->where('filters.search', '2025.0001')
        );
    }

    #[Test]
    public function it_returns_shipping_addresses_for_article()
    {
        $this->actingAs($this->user);

        $response = $this->getJson(route('orders.get-shipping-addresses', [
            'article_uuid' => $this->article->uuid,
        ]));

        $response->assertStatus(200);
        $response->assertJsonStructure([
            '*' => ['uuid', 'street', 'city', 'postal_code'],
        ]);
    }

    #[Test]
    public function it_validates_article_uuid_for_shipping_addresses_endpoint()
    {
        $this->actingAs($this->user);

        $response = $this->getJson(route('orders.get-shipping-addresses'));

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['article_uuid']);
    }

    #[Test]
    public function it_requires_valid_article_uuid_for_shipping_addresses()
    {
        $this->actingAs($this->user);

        $response = $this->getJson(route('orders.get-shipping-addresses'), [
            'article_uuid' => 'invalid-uuid',
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['article_uuid']);
    }

    #[Test]
    public function it_returns_empty_shipping_addresses_when_article_has_none()
    {
        $this->actingAs($this->user);

        $articleWithoutAddresses = Article::factory()->create([
            'offer_uuid' => $this->article->offer_uuid,
            'removed' => false,
        ]);

        $response = $this->getJson(route('orders.get-shipping-addresses', [
            'article_uuid' => $articleWithoutAddresses->uuid,
        ]));

        $response->assertStatus(200);
        $response->assertJson([]);
    }

    #[Test]
    public function it_validates_date_format_for_delivery_requested_date()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('orders.store'), [
            'article_uuid' => $this->article->uuid,
            'quantity' => 100,
            'customershippingaddress_uuid' => $this->shippingAddress->uuid,
            'delivery_requested_date' => 'invalid-date',
        ]);

        $response->assertSessionHasErrors(['delivery_requested_date']);
    }

    #[Test]
    public function it_validates_date_format_for_expected_production_start_date()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('orders.store'), [
            'article_uuid' => $this->article->uuid,
            'quantity' => 100,
            'customershippingaddress_uuid' => $this->shippingAddress->uuid,
            'expected_production_start_date' => 'not-a-date',
        ]);

        $response->assertSessionHasErrors(['expected_production_start_date']);
    }

    #[Test]
    public function it_validates_date_format_for_expiration_date()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('orders.store'), [
            'article_uuid' => $this->article->uuid,
            'quantity' => 100,
            'customershippingaddress_uuid' => $this->shippingAddress->uuid,
            'expiration_date' => 'invalid',
        ]);

        $response->assertSessionHasErrors(['expiration_date']);
    }

    #[Test]
    public function it_accepts_valid_date_formats()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('orders.store'), [
            'article_uuid' => $this->article->uuid,
            'quantity' => 100,
            'customershippingaddress_uuid' => $this->shippingAddress->uuid,
            'delivery_requested_date' => '2025-12-31',
            'expected_production_start_date' => '2025-01-15',
            'expiration_date' => '2026-01-01',
        ]);

        $response->assertRedirect(route('orders.index'));
        $this->assertDatabaseHas('orderorder', [
            'delivery_requested_date' => '2025-12-31',
        ]);
    }

    #[Test]
    public function it_validates_quantity_minimum_value()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('orders.store'), [
            'article_uuid' => $this->article->uuid,
            'quantity' => -1,
            'customershippingaddress_uuid' => $this->shippingAddress->uuid,
        ]);

        $response->assertSessionHasErrors(['quantity']);
    }

    #[Test]
    public function it_validates_worked_quantity_minimum_value()
    {
        $this->actingAs($this->user);

        $order = Order::factory()->create([
            'article_uuid' => $this->article->uuid,
            'order_production_number' => '2025.0001',
            'quantity' => 100,
            'customershippingaddress_uuid' => $this->shippingAddress->uuid,
            'removed' => false,
        ]);

        $response = $this->put(route('orders.update', $order), [
            'article_uuid' => $this->article->uuid,
            'order_production_number' => '2025.0001',
            'quantity' => 100,
            'worked_quantity' => -5,
            'customershippingaddress_uuid' => $this->shippingAddress->uuid,
        ]);

        $response->assertSessionHasErrors(['worked_quantity']);
    }

    #[Test]
    public function it_accepts_zero_for_numeric_fields()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('orders.store'), [
            'article_uuid' => $this->article->uuid,
            'quantity' => 0,
            'customershippingaddress_uuid' => $this->shippingAddress->uuid,
        ]);

        $response->assertRedirect(route('orders.index'));
        $this->assertDatabaseHas('orderorder', [
            'quantity' => 0,
        ]);
    }

    #[Test]
    public function it_validates_max_length_for_string_fields()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('orders.store'), [
            'article_uuid' => $this->article->uuid,
            'quantity' => 100,
            'customershippingaddress_uuid' => $this->shippingAddress->uuid,
            'order_production_number' => str_repeat('a', 256), // More than 255 characters
        ]);

        $response->assertSessionHasErrors(['order_production_number']);
    }

    #[Test]
    public function it_validates_integer_fields()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('orders.store'), [
            'article_uuid' => $this->article->uuid,
            'quantity' => 100,
            'customershippingaddress_uuid' => $this->shippingAddress->uuid,
            'line' => 'not-an-integer',
        ]);

        $response->assertSessionHasErrors(['line']);
    }

    #[Test]
    public function it_handles_order_without_shipping_address()
    {
        $this->actingAs($this->user);

        $order = Order::factory()->create([
            'article_uuid' => $this->article->uuid,
            'order_production_number' => '2025.0015',
            'quantity' => 100,
            'customershippingaddress_uuid' => null,
            'removed' => false,
        ]);

        $response = $this->get(route('orders.show', $order));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('Orders/Show')
            ->has('order')
        );
    }

    #[Test]
    public function it_handles_empty_search_results()
    {
        $this->actingAs($this->user);

        $response = $this->get(route('orders.index', ['search' => 'NONEXISTENT12345']));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('Orders/Index')
            ->has('orders')
            ->has('orders.data')
            ->where('orders.data', [])
        );
    }

    #[Test]
    public function it_handles_pagination_correctly()
    {
        $this->actingAs($this->user);

        // Create more than 15 orders (default per_page)
        Order::factory()->count(20)->create([
            'article_uuid' => $this->article->uuid,
            'removed' => false,
        ]);

        $response = $this->get(route('orders.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->has('orders')
            ->has('orders.current_page')
            ->has('orders.last_page')
        );
    }

    #[Test]
    public function it_handles_invalid_article_uuid_filter()
    {
        $this->actingAs($this->user);

        // Create an order to ensure there's data
        Order::factory()->create([
            'article_uuid' => $this->article->uuid,
            'removed' => false,
        ]);

        // Use a valid UUID not present in database
        $nonExistentUuid = \Illuminate\Support\Str::uuid()->toString();

        $response = $this->get(route('orders.index', ['article_uuid' => $nonExistentUuid]));

        $response->assertStatus(200);
        // Filter should return empty results if UUID doesn't exist
        $response->assertInertia(fn ($page) => $page->has('orders')
            ->has('orders.data')
            ->where('orders.data', [])
        );
    }

    #[Test]
    public function it_calculates_remain_quantity_correctly()
    {
        $this->actingAs($this->user);

        $order = Order::factory()->create([
            'article_uuid' => $this->article->uuid,
            'order_production_number' => '2025.0016',
            'quantity' => 100,
            'worked_quantity' => 30,
            'customershippingaddress_uuid' => $this->shippingAddress->uuid,
            'removed' => false,
        ]);

        $response = $this->get(route('orders.show', $order));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('Orders/Show')
            ->has('order')
        );

        // Verify remain_quantity using assertInertia
        $response->assertInertia(fn ($page) => $page->where('order.remain_quantity', 70)
        );
    }

    #[Test]
    public function it_handles_order_with_zero_worked_quantity()
    {
        $this->actingAs($this->user);

        $order = Order::factory()->create([
            'article_uuid' => $this->article->uuid,
            'order_production_number' => '2025.0017',
            'quantity' => 100,
            'worked_quantity' => 0,
            'customershippingaddress_uuid' => $this->shippingAddress->uuid,
            'removed' => false,
        ]);

        $response = $this->get(route('orders.show', $order));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('Orders/Show')
            ->has('order')
        );

        // Verify remain_quantity
        $response->assertInertia(fn ($page) => $page->where('order.remain_quantity', 100)
        );
    }

    #[Test]
    public function it_handles_order_with_worked_quantity_equal_to_quantity()
    {
        $this->actingAs($this->user);

        $order = Order::factory()->create([
            'article_uuid' => $this->article->uuid,
            'order_production_number' => '2025.0018',
            'quantity' => 100,
            'worked_quantity' => 100,
            'customershippingaddress_uuid' => $this->shippingAddress->uuid,
            'removed' => false,
        ]);

        $response = $this->get(route('orders.show', $order));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('Orders/Show')
            ->has('order')
        );

        // Verify remain_quantity
        $response->assertInertia(fn ($page) => $page->where('order.remain_quantity', 0)
        );
    }
}
