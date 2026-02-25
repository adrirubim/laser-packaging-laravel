<?php

namespace Tests\Feature\Api;

use App\Models\Article;
use App\Models\Customer;
use App\Models\CustomerDivision;
use App\Models\CustomerShippingAddress;
use App\Models\Employee;
use App\Models\EmployeePortalToken;
use App\Models\Offer;
use App\Models\Order;
use App\Models\PalletType;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class ProductionPortalControllerTest extends TestCase
{
    use RefreshDatabase;

    protected Employee $employee;

    protected Order $order;

    protected Article $article;

    protected Offer $offer;

    protected Customer $customer;

    protected CustomerDivision $division;

    protected CustomerShippingAddress $shippingAddress;

    protected PalletType $palletType;

    protected function setUp(): void
    {
        parent::setUp();

        // Create test data
        $this->customer = Customer::factory()->create(['removed' => false]);
        $this->division = CustomerDivision::factory()->create([
            'customer_uuid' => $this->customer->uuid,
            'removed' => false,
        ]);
        $this->shippingAddress = CustomerShippingAddress::factory()->create([
            'customerdivision_uuid' => $this->division->uuid,
            'removed' => false,
        ]);
        $this->palletType = PalletType::factory()->create(['removed' => false]);
        $this->offer = Offer::factory()->create([
            'customer_uuid' => $this->customer->uuid,
            'customerdivision_uuid' => $this->division->uuid,
            'removed' => false,
        ]);
        $this->article = Article::factory()->create([
            'offer_uuid' => $this->offer->uuid,
            'pallet_uuid' => $this->palletType->uuid,
            'plan_packaging' => 10, // 10 pieces per pallet
            'pallet_plans' => 1,
            'removed' => false,
        ]);
        $this->order = Order::factory()->create([
            'article_uuid' => $this->article->uuid,
            'customershippingaddress_uuid' => $this->shippingAddress->uuid,
            'status' => Order::STATUS_LANCIATO,
            'quantity' => 100,
            'worked_quantity' => 0,
            'removed' => false,
        ]);
        $this->employee = Employee::factory()->create([
            'portal_enabled' => true,
            'password' => hash('sha512', 'password123'), // SHA512 as expected by verifyPassword()
            'removed' => false,
        ]);
    }

    protected function createValidToken(): string
    {
        $currentTime = time();
        $token = base64_encode(\Illuminate\Support\Str::random(32).'|'.$currentTime);
        EmployeePortalToken::create([
            'employee_uuid' => $this->employee->uuid,
            'token' => $token,
            'created_at' => $currentTime,
            'updated_at' => $currentTime,
        ]);

        return $token;
    }

    #[Test]
    public function it_authenticates_with_ean_codes()
    {
        $response = $this->postJson('/api/production/authenticate', [
            'employee_number' => (string) $this->employee->id,
            'order_number' => (string) $this->order->id,
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'ok',
                'order_uuid',
                'autocontrollo',
                'employee' => [
                    'uuid',
                    'name',
                    'surname',
                    'matriculation_number',
                    'token',
                ],
            ])
            ->assertJson([
                'ok' => 1,
                'order_uuid' => $this->order->uuid,
                'autocontrollo' => 0,
            ]);

        // Verify the token was created
        $this->assertDatabaseHas('employeeportaltoken', [
            'employee_uuid' => $this->employee->uuid,
        ]);
    }

    #[Test]
    public function it_rejects_authentication_with_invalid_employee()
    {
        $response = $this->postJson('/api/production/authenticate', [
            'employee_number' => '99999',
            'order_number' => (string) $this->order->id,
        ]);

        $response->assertStatus(404)
            ->assertJson(['error' => 'Dipendente non trovato o non abilitato']);
    }

    #[Test]
    public function it_rejects_authentication_with_invalid_order()
    {
        $response = $this->postJson('/api/production/authenticate', [
            'employee_number' => (string) $this->employee->id,
            'order_number' => '99999',
        ]);

        $response->assertStatus(404)
            ->assertJson(['error' => 'Ordine non trovato']);
    }

    #[Test]
    public function it_rejects_authentication_when_order_not_in_valid_status()
    {
        $this->order->status = Order::STATUS_PIANIFICATO;
        $this->order->save();

        $response = $this->postJson('/api/production/authenticate', [
            'employee_number' => (string) $this->employee->id,
            'order_number' => (string) $this->order->id,
        ]);

        $response->assertStatus(400)
            ->assertJson(['error' => 'L\'ordine non è in uno stato valido (deve essere Lanciato o In Avanzamento)']);
    }

    #[Test]
    public function it_authenticates_with_leading_zeros_in_ean_codes()
    {
        $response = $this->postJson('/api/production/authenticate', [
            'employee_number' => '000'.$this->employee->id,
            'order_number' => '000'.$this->order->id,
        ]);

        $response->assertStatus(200)
            ->assertJson(['ok' => 1]);
    }

    #[Test]
    public function it_logs_in_with_matriculation_and_password()
    {
        $response = $this->postJson('/api/production/login', [
            'matriculation_number' => $this->employee->matriculation_number,
            'password' => 'password123',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'ok',
                'employee' => [
                    'uuid',
                    'name',
                    'surname',
                    'matriculation_number',
                    'token',
                ],
            ])
            ->assertJson([
                'ok' => 1,
            ]);

        // Verify the token was created
        $this->assertDatabaseHas('employeeportaltoken', [
            'employee_uuid' => $this->employee->uuid,
        ]);
    }

    #[Test]
    public function it_rejects_login_with_invalid_credentials()
    {
        $response = $this->postJson('/api/production/login', [
            'matriculation_number' => $this->employee->matriculation_number,
            'password' => 'wrongpassword',
        ]);

        $response->assertStatus(401)
            ->assertJson(['error' => 'Credenziali non valide']);
    }

    #[Test]
    public function it_checks_token_validity()
    {
        $token = $this->createValidToken();

        $response = $this->postJson('/api/production/check-token', [
            'token' => $token,
        ]);

        $response->assertStatus(200)
            ->assertJson(['ok' => 1]);
    }

    #[Test]
    public function it_rejects_invalid_token()
    {
        $response = $this->postJson('/api/production/check-token', [
            'token' => 'invalid-token',
        ]);

        $response->assertStatus(401)
            ->assertJson(['error' => 'Token non valido o scaduto']);
    }

    #[Test]
    public function it_checks_token_with_user_data_format()
    {
        $token = $this->createValidToken();

        $response = $this->postJson('/api/production/check-token', [
            'user_data' => [
                'token' => $token,
            ],
        ]);

        $response->assertStatus(200)
            ->assertJson(['ok' => 1]);
    }

    #[Test]
    public function it_adds_pallet_quantity()
    {
        $token = $this->createValidToken();

        $response = $this->postJson('/api/production/add-pallet-quantity', [
            'order_uuid' => $this->order->uuid,
            'token' => $token,
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'ok',
                'print_url',
            ])
            ->assertJson(['ok' => 1]);

        // Verify the processing was created
        $this->assertDatabaseHas('productionorderprocessing', [
            'employee_uuid' => $this->employee->uuid,
            'order_uuid' => $this->order->uuid,
        ]);

        // Verify worked_quantity was updated
        $this->order->refresh();
        $this->assertGreaterThan(0, $this->order->worked_quantity);
    }

    #[Test]
    public function it_updates_order_status_when_adding_pallet_quantity()
    {
        $token = $this->createValidToken();
        $this->order->status = Order::STATUS_PIANIFICATO;
        $this->order->save();

        $response = $this->postJson('/api/production/add-pallet-quantity', [
            'order_uuid' => $this->order->uuid,
            'token' => $token,
        ]);

        $response->assertStatus(200);

        // Verify state changed to IN_AVANZAMENTO
        $this->order->refresh();
        $this->assertEquals(Order::STATUS_IN_AVANZAMENTO, $this->order->status);
    }

    #[Test]
    public function it_adds_manual_quantity()
    {
        $token = $this->createValidToken();

        $response = $this->postJson('/api/production/add-manual-quantity', [
            'order_uuid' => $this->order->uuid,
            'quantity' => 5.5,
            'token' => $token,
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'ok',
                'print_url',
            ])
            ->assertJson(['ok' => 1]);

        // Verify the processing was created
        $this->assertDatabaseHas('productionorderprocessing', [
            'employee_uuid' => $this->employee->uuid,
            'order_uuid' => $this->order->uuid,
            'quantity' => 5.5,
        ]);
    }

    #[Test]
    public function it_rejects_manual_quantity_with_invalid_amount()
    {
        $token = $this->createValidToken();

        $response = $this->postJson('/api/production/add-manual-quantity', [
            'order_uuid' => $this->order->uuid,
            'quantity' => 0,
            'token' => $token,
        ]);

        $response->assertStatus(422); // Validation error
    }

    #[Test]
    public function it_suspends_order()
    {
        $token = $this->createValidToken();

        $response = $this->postJson('/api/production/suspend-order', [
            'order_uuid' => $this->order->uuid,
            'token' => $token,
        ]);

        $response->assertStatus(200)
            ->assertJson(['ok' => 1]);

        // Verify state changed to SOSPESO
        $this->order->refresh();
        $this->assertEquals(Order::STATUS_SOSPESO, $this->order->status);
        $this->assertEquals('Autocontrollo Non Superato', $this->order->motivazione);
    }

    #[Test]
    public function it_confirms_autocontrollo()
    {
        $token = $this->createValidToken();
        $this->order->autocontrollo = false;
        $this->order->save();

        $response = $this->postJson('/api/production/confirm-autocontrollo', [
            'order_uuid' => $this->order->uuid,
            'token' => $token,
        ]);

        $response->assertStatus(200)
            ->assertJson(['ok' => 1]);

        // Verify autocontrollo was set to true
        $this->order->refresh();
        $this->assertTrue($this->order->autocontrollo);
    }

    #[Test]
    public function it_gets_employee_order_list()
    {
        $token = $this->createValidToken();

        // Create another order in valid state
        $order2 = Order::factory()->create([
            'article_uuid' => $this->article->uuid,
            'customershippingaddress_uuid' => $this->shippingAddress->uuid,
            'status' => Order::STATUS_IN_AVANZAMENTO,
            'removed' => false,
        ]);

        $response = $this->postJson('/api/production/employee-order-list', [
            'token' => $token,
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'ok',
                'order' => [
                    '*' => [
                        'uuid',
                        'order_production_number',
                        'quantity',
                        'worked_quantity',
                        'remain_quantity',
                        'status',
                        'status_label',
                        'autocontrollo',
                    ],
                ],
            ])
            ->assertJson(['ok' => 1]);

        $orders = $response->json('order');
        $this->assertCount(2, $orders); // Should include both orders
    }

    #[Test]
    public function it_excludes_orders_not_in_valid_status_from_list()
    {
        $token = $this->createValidToken();

        // Create order in invalid state
        $order2 = Order::factory()->create([
            'article_uuid' => $this->article->uuid,
            'customershippingaddress_uuid' => $this->shippingAddress->uuid,
            'status' => Order::STATUS_PIANIFICATO,
            'removed' => false,
        ]);

        $response = $this->postJson('/api/production/employee-order-list', [
            'token' => $token,
        ]);

        $response->assertStatus(200);
        $orders = $response->json('order');

        // Should only include orders with status 2 or 3
        $orderUuids = collect($orders)->pluck('uuid')->toArray();
        $this->assertContains($this->order->uuid, $orderUuids);
        $this->assertNotContains($order2->uuid, $orderUuids);
    }

    #[Test]
    public function it_gets_complete_order_info()
    {
        $token = $this->createValidToken();

        $response = $this->postJson('/api/production/get-info', [
            'order_uuid' => $this->order->uuid,
            'token' => $token,
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'ok',
                'order' => [
                    'uuid',
                    'order_production_number',
                    'quantity',
                    'worked_quantity',
                    'remain_quantity',
                    'status',
                    'status_label',
                    'autocontrollo',
                    'article',
                    'offer',
                    'customer',
                    'division',
                    'shipping_address',
                ],
            ])
            ->assertJson([
                'ok' => 1,
                'order' => [
                    'uuid' => $this->order->uuid,
                    'quantity' => $this->order->quantity,
                ],
            ]);
    }

    #[Test]
    public function it_rejects_requests_without_token()
    {
        $response = $this->postJson('/api/production/add-pallet-quantity', [
            'order_uuid' => $this->order->uuid,
        ]);

        // Laravel validates first and returns 422 (validation error)
        $response->assertStatus(422)
            ->assertJsonValidationErrors(['token']);
    }

    #[Test]
    public function it_rejects_requests_with_expired_token()
    {
        // Create expired token (more than 6 months)
        $expiredTimestamp = time() - (7 * 30 * 24 * 60 * 60); // 7 months ago
        $token = base64_encode(\Illuminate\Support\Str::random(32).'|'.$expiredTimestamp);

        // Insert directly into database with expired date (more than 6 months)
        $expiredDate = now()->subMonths(7);
        \Illuminate\Support\Facades\DB::table('employeeportaltoken')->insert([
            'uuid' => \Illuminate\Support\Str::uuid()->toString(),
            'employee_uuid' => $this->employee->uuid,
            'token' => $token,
            'created_at' => $expiredDate,
            'removed' => false,
            'updated_at' => $expiredDate,
        ]);

        $response = $this->postJson('/api/production/add-pallet-quantity', [
            'order_uuid' => $this->order->uuid,
            'token' => $token,
        ]);

        $response->assertStatus(401)
            ->assertJson(['error' => 'Token non valido o scaduto']);
    }

    #[Test]
    public function it_rejects_requests_with_disabled_employee()
    {
        $this->employee->portal_enabled = false;
        $this->employee->save();

        $token = $this->createValidToken();

        $response = $this->postJson('/api/production/add-pallet-quantity', [
            'order_uuid' => $this->order->uuid,
            'token' => $token,
        ]);

        $response->assertStatus(401)
            ->assertJson(['error' => 'Token non valido o scaduto']);
    }
}
