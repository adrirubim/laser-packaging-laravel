<?php

namespace Tests\Feature\Flows;

use App\Models\Article;
use App\Models\Customer;
use App\Models\CustomerDivision;
use App\Models\CustomerShippingAddress;
use App\Models\Employee;
use App\Models\EmployeePortalToken;
use App\Models\Offer;
use App\Models\OfferLasFamily;
use App\Models\Order;
use App\Models\PalletType;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class OfferArticleOrderFlowTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    protected function createValidToken(Employee $employee): string
    {
        $currentTime = time();
        $token = base64_encode(Str::random(32).'|'.$currentTime);

        EmployeePortalToken::create([
            'employee_uuid' => $employee->uuid,
            'token' => $token,
            'created_at' => $currentTime,
            'updated_at' => $currentTime,
        ]);

        return $token;
    }

    #[Test]
    public function it_creates_offer_article_and_order_and_links_them_correctly()
    {
        $this->actingAs($this->user);

        $customer = Customer::factory()->create(['removed' => false]);
        $division = CustomerDivision::factory()->create([
            'customer_uuid' => $customer->uuid,
            'removed' => false,
        ]);

        $lasFamily = OfferLasFamily::factory()->create([
            'code' => '31',
            'removed' => false,
        ]);

        // 1) Create offer directly with factory and LAS family
        $offer = Offer::factory()->create([
            'customer_uuid' => $customer->uuid,
            'customerdivision_uuid' => $division->uuid,
            'lasfamily_uuid' => $lasFamily->uuid,
            'removed' => false,
        ]);

        // 2) Create associated article using ArticleController
        $palletType = PalletType::factory()->create(['removed' => false]);

        $articleResponse = $this->post(route('articles.store'), [
            'offer_uuid' => $offer->uuid,
            'article_descr' => 'Flow Article',
            'plan_packaging' => 10,
            'pallet_plans' => 1,
            'pallet_uuid' => $palletType->uuid,
            'lot_attribution' => 0,
        ]);
        $articleResponse->assertRedirect(route('articles.index'));

        $article = Article::latest()->first();
        $this->assertNotNull($article);
        $this->assertEquals($offer->uuid, $article->offer_uuid);
        $this->assertStringStartsWith('LAS', $article->cod_article_las);

        // 3) Create associated order using OrderController
        $shippingAddress = CustomerShippingAddress::factory()->create([
            'customerdivision_uuid' => $division->uuid,
            'removed' => false,
        ]);

        $orderResponse = $this->post(route('orders.store'), [
            'article_uuid' => $article->uuid,
            'quantity' => 100,
            'customershippingaddress_uuid' => $shippingAddress->uuid,
        ]);
        $orderResponse->assertRedirect(route('orders.index'));

        $order = Order::latest()->first();
        $this->assertNotNull($order);
        $this->assertEquals($article->uuid, $order->article_uuid);
        $this->assertEquals($shippingAddress->uuid, $order->customershippingaddress_uuid);
        $this->assertNotNull($order->order_production_number);
    }

    #[Test]
    public function it_processes_order_through_production_portal_after_creating_offer_article_and_order()
    {
        $this->actingAs($this->user);

        // 1) Create customer/division/LAS family, offer, article and order (reusing previous flow)
        $customer = Customer::factory()->create(['removed' => false]);
        $division = CustomerDivision::factory()->create([
            'customer_uuid' => $customer->uuid,
            'removed' => false,
        ]);

        $lasFamily = OfferLasFamily::factory()->create([
            'code' => '31',
            'removed' => false,
        ]);

        // Create offer directly with LAS family assigned
        $offer = Offer::factory()->create([
            'customer_uuid' => $customer->uuid,
            'customerdivision_uuid' => $division->uuid,
            'lasfamily_uuid' => $lasFamily->uuid,
            'removed' => false,
        ]);

        $palletType = PalletType::factory()->create(['removed' => false]);

        $articleResponse = $this->post(route('articles.store'), [
            'offer_uuid' => $offer->uuid,
            'article_descr' => 'Flow Article Portal',
            'plan_packaging' => 10,
            'pallet_plans' => 1,
            'pallet_uuid' => $palletType->uuid,
            'lot_attribution' => 0,
        ]);
        $articleResponse->assertRedirect(route('articles.index'));
        $article = Article::latest()->first();

        $shippingAddress = CustomerShippingAddress::factory()->create([
            'customerdivision_uuid' => $division->uuid,
            'removed' => false,
        ]);

        $orderResponse = $this->post(route('orders.store'), [
            'article_uuid' => $article->uuid,
            'quantity' => 100,
            'customershippingaddress_uuid' => $shippingAddress->uuid,
        ]);
        $orderResponse->assertRedirect(route('orders.index'));
        $order = Order::latest()->first();
        $this->assertNotNull($order);

        // 2) Create portal employee and valid token
        $employee = Employee::factory()->create([
            'portal_enabled' => true,
            'password' => hash('sha512', 'password123'),
            'removed' => false,
        ]);

        $token = $this->createValidToken($employee);

        // 3) Simulate portal processing: add pallet quantity
        $response = $this->postJson('/api/production/add-pallet-quantity', [
            'order_uuid' => $order->uuid,
            'token' => $token,
        ]);

        $response->assertStatus(200)
            ->assertJson(['ok' => 1]);

        // 4) Verify effects on order (worked_quantity and possible state change)
        $order->refresh();
        $this->assertGreaterThan(0, $order->worked_quantity);
        $this->assertTrue(
            in_array($order->status, [Order::STATUS_LANCIATO, Order::STATUS_IN_AVANZAMENTO, Order::STATUS_SOSPESO])
        );
    }

    #[Test]
    public function it_completes_pallet_and_suspends_and_confirms_autocontrollo_via_portal()
    {
        $this->actingAs($this->user);

        // 1) Create base flow: customer, offer, article, order
        $customer = Customer::factory()->create(['removed' => false]);
        $division = CustomerDivision::factory()->create([
            'customer_uuid' => $customer->uuid,
            'removed' => false,
        ]);

        $lasFamily = OfferLasFamily::factory()->create([
            'code' => '31',
            'removed' => false,
        ]);

        $offer = Offer::factory()->create([
            'customer_uuid' => $customer->uuid,
            'customerdivision_uuid' => $division->uuid,
            'lasfamily_uuid' => $lasFamily->uuid,
            'removed' => false,
        ]);

        $palletType = PalletType::factory()->create(['removed' => false]);

        $article = Article::factory()->create([
            'offer_uuid' => $offer->uuid,
            'pallet_uuid' => $palletType->uuid,
            'plan_packaging' => 10,
            'pallet_plans' => 1,
            'removed' => false,
        ]);

        $shippingAddress = CustomerShippingAddress::factory()->create([
            'customerdivision_uuid' => $division->uuid,
            'removed' => false,
        ]);

        $order = Order::factory()->create([
            'article_uuid' => $article->uuid,
            'customershippingaddress_uuid' => $shippingAddress->uuid,
            'status' => Order::STATUS_LANCIATO,
            'quantity' => 100,
            'worked_quantity' => 0,
            'removed' => false,
        ]);

        // 2) Employee and token
        $employee = Employee::factory()->create([
            'portal_enabled' => true,
            'password' => hash('sha512', 'password123'),
            'removed' => false,
        ]);

        $token = $this->createValidToken($employee);

        // 3) Add pallet quantity (10 units) twice and verify worked_quantity
        $this->postJson('/api/production/add-pallet-quantity', [
            'order_uuid' => $order->uuid,
            'token' => $token,
        ])->assertStatus(200)->assertJson(['ok' => 1]);

        $order->refresh();
        $firstWorked = $order->worked_quantity;
        $this->assertEquals(10, $firstWorked);

        $this->postJson('/api/production/add-pallet-quantity', [
            'order_uuid' => $order->uuid,
            'token' => $token,
        ])->assertStatus(200)->assertJson(['ok' => 1]);

        $order->refresh();
        $this->assertEquals(20, $order->worked_quantity);

        // 4) Suspend the order
        $this->postJson('/api/production/suspend-order', [
            'order_uuid' => $order->uuid,
            'token' => $token,
        ])->assertStatus(200)->assertJson(['ok' => 1]);

        $order->refresh();
        $this->assertEquals(Order::STATUS_SOSPESO, $order->status);

        // 5) Confirm autocontrollo
        $this->postJson('/api/production/confirm-autocontrollo', [
            'order_uuid' => $order->uuid,
            'token' => $token,
        ])->assertStatus(200)->assertJson(['ok' => 1]);

        $order->refresh();
        $this->assertTrue($order->autocontrollo);
    }
}
