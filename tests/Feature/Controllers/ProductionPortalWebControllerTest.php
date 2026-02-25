<?php

namespace Tests\Feature\Controllers;

use App\Models\Article;
use App\Models\Customer;
use App\Models\CustomerDivision;
use App\Models\CustomerShippingAddress;
use App\Models\Employee;
use App\Models\EmployeePortalToken;
use App\Models\Offer;
use App\Models\Order;
use App\Models\PalletType;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class ProductionPortalWebControllerTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

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

        $this->user = User::factory()->create();
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
            'removed' => false,
        ]);
        $this->order = Order::factory()->create([
            'status' => Order::STATUS_LANCIATO,
            'article_uuid' => $this->article->uuid,
            'customershippingaddress_uuid' => $this->shippingAddress->uuid,
            'order_production_number' => '2025.0001',
            'quantity' => 100,
            'removed' => false,
        ]);
        $this->employee = Employee::factory()->create([
            'portal_enabled' => true,
            'password' => hash('sha512', 'password123'),
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
    public function it_displays_login_page()
    {
        $response = $this->get(route('production-portal.login'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('ProductionPortal/Login')
        );
    }

    #[Test]
    public function it_authenticates_with_matriculation_number_and_password()
    {
        $response = $this->post(route('production-portal.authenticate'), [
            'matriculation_number' => $this->employee->matriculation_number,
            'password' => 'password123',
        ]);

        $response->assertRedirect(route('production-portal.dashboard'));
        $this->assertNotNull(session('production_portal_token'));
        $this->assertNotNull(session('production_portal_employee'));
    }

    #[Test]
    public function it_authenticates_with_employee_number_and_order_number()
    {
        // Ensure order is in valid state (STATUS_LANCIATO or STATUS_IN_AVANZAMENTO)
        $this->order->update(['status' => Order::STATUS_LANCIATO]);

        $response = $this->post(route('production-portal.authenticate'), [
            'employee_number' => (string) $this->employee->id,
            'order_number' => (string) $this->order->id,
        ]);

        // May redirect to dashboard or order detail depending on whether order_uuid exists
        $response->assertRedirect();
        $this->assertNotNull(session('production_portal_token'));
    }

    #[Test]
    public function it_rejects_invalid_credentials()
    {
        $response = $this->post(route('production-portal.authenticate'), [
            'matriculation_number' => (string) $this->employee->id,
            'password' => 'wrongpassword',
        ]);

        $response->assertSessionHasErrors(['error']);
    }

    #[Test]
    public function it_validates_required_fields_for_matriculation_login()
    {
        $response = $this->post(route('production-portal.authenticate'), []);

        $response->assertSessionHasErrors();
    }

    #[Test]
    public function it_validates_required_fields_for_ean_login()
    {
        $response = $this->post(route('production-portal.authenticate'), [
            'employee_number' => (string) $this->employee->id,
            // missing order_number
        ]);

        $response->assertSessionHasErrors(['order_number']);
    }

    #[Test]
    public function it_displays_dashboard_when_authenticated()
    {
        $token = $this->createValidToken();

        // Mock the API response
        $this->mock(\App\Http\Controllers\Api\ProductionPortalController::class, function ($mock) {
            $mock->shouldReceive('getEmployeeOrderList')
                ->once()
                ->andReturn(response()->json([
                    'ok' => 1,
                    'order' => [],
                ]));
        });

        $response = $this->withSession([
            'production_portal_token' => $token,
            'production_portal_employee' => $this->employee->toArray(),
        ])->get(route('production-portal.dashboard'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('ProductionPortal/Dashboard')
            ->has('orders')
            ->has('employee')
        );
    }

    #[Test]
    public function it_redirects_to_login_when_not_authenticated()
    {
        // Controller verifies session and redirects if there's no token
        $response = $this->get(route('production-portal.dashboard'));

        $response->assertRedirect(route('production-portal.login'));
    }

    #[Test]
    public function it_shows_order_detail_when_authenticated()
    {
        $token = $this->createValidToken();

        // Mock the API response
        $this->mock(\App\Http\Controllers\Api\ProductionPortalController::class, function ($mock) {
            $mock->shouldReceive('getInfo')
                ->once()
                ->andReturn(response()->json([
                    'ok' => 1,
                    'order' => [
                        'uuid' => $this->order->uuid,
                        'order_production_number' => '2025.0001',
                    ],
                ]));
        });

        $response = $this->withSession([
            'production_portal_token' => $token,
            'production_portal_employee' => $this->employee->toArray(),
        ])->get(route('production-portal.order', ['order' => $this->order->uuid]));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('ProductionPortal/OrderDetail')
            ->has('order')
            ->has('employee')
        );
    }

    #[Test]
    public function it_logs_out_and_clears_session()
    {
        $token = $this->createValidToken();

        $response = $this->withSession([
            'production_portal_token' => $token,
            'production_portal_employee' => $this->employee->toArray(),
        ])->post(route('production-portal.logout'));

        $response->assertRedirect(route('production-portal.login'));
        $response->assertSessionHas('success');
        $this->assertNull(session('production_portal_token'));
        $this->assertNull(session('production_portal_employee'));
    }
}
