<?php

namespace Tests\Performance;

use App\Models\Article;
use App\Models\Customer;
use App\Models\CustomerDivision;
use App\Models\CustomerShippingAddress;
use App\Models\Employee;
use App\Models\Offer;
use App\Models\Order;
use App\Models\PalletType;
use App\Services\OrderProductionNumberService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Performance Tests: API Response Time Testing
 *
 * Tests Production Portal API endpoints for acceptable response times
 * under various load conditions.
 */
class ApiResponseTimeTest extends TestCase
{
    use RefreshDatabase;

    protected Employee $employee;

    protected Order $order;

    protected string $token;

    protected function setUp(): void
    {
        parent::setUp();

        // Create employee
        $this->employee = Employee::factory()->create([
            'portal_enabled' => true,
            'password' => hash('sha512', 'password123'),
            'removed' => false,
        ]);

        // Create order data
        $customer = Customer::factory()->create(['removed' => false]);
        $division = CustomerDivision::factory()->create([
            'customer_uuid' => $customer->uuid,
            'removed' => false,
        ]);
        $shippingAddress = CustomerShippingAddress::factory()->create([
            'customerdivision_uuid' => $division->uuid,
            'removed' => false,
        ]);
        $offer = Offer::factory()->create([
            'customer_uuid' => $customer->uuid,
            'customerdivision_uuid' => $division->uuid,
            'removed' => false,
        ]);
        $palletType = PalletType::factory()->create(['removed' => false]);
        $article = Article::factory()->create([
            'offer_uuid' => $offer->uuid,
            'pallet_uuid' => $palletType->uuid,
            'plan_packaging' => 10,
            'pallet_plans' => 10,
            'removed' => false,
        ]);

        $this->order = Order::factory()->create([
            'article_uuid' => $article->uuid,
            'customershippingaddress_uuid' => $shippingAddress->uuid,
            'status' => 2, // Lanciato
            'quantity' => 1000,
            'worked_quantity' => 0,
            'removed' => false,
        ]);

        // Generate token for employee
        $this->token = base64_encode($this->employee->id.':'.time());
    }

    /**
     * Test: Authentication endpoint response time
     *
     * Tests EAN authentication endpoint performance.
     */
    public function test_authentication_endpoint_response_time(): void
    {
        $startTime = microtime(true);

        $response = $this->postJson('/api/production/authenticate', [
            'employee_number' => (string) $this->employee->id,
            'order_number' => (string) $this->order->id,
        ]);

        $endTime = microtime(true);
        $duration = ($endTime - $startTime) * 1000;

        $response->assertStatus(200);
        $this->assertLessThan(500, $duration,
            'Authentication endpoint should respond in less than 500ms');
    }

    /**
     * Test: Login endpoint response time
     *
     * Tests employee login endpoint performance.
     */
    public function test_login_endpoint_response_time(): void
    {
        $startTime = microtime(true);

        $response = $this->postJson('/api/production/login', [
            'matriculation_number' => $this->employee->matriculation_number,
            'password' => 'password123', // Default factory password
        ]);

        $endTime = microtime(true);
        $duration = ($endTime - $startTime) * 1000;

        $response->assertStatus(200);
        $this->assertLessThan(300, $duration,
            'Login endpoint should respond in less than 300ms');
    }

    /**
     * Test: Get employee order list response time
     *
     * Tests order list endpoint with multiple orders.
     */
    public function test_get_employee_order_list_response_time(): void
    {
        // Create multiple orders for the employee
        $customer = Customer::factory()->create(['removed' => false]);
        $division = CustomerDivision::factory()->create([
            'customer_uuid' => $customer->uuid,
            'removed' => false,
        ]);
        $shippingAddress = CustomerShippingAddress::factory()->create([
            'customerdivision_uuid' => $division->uuid,
            'removed' => false,
        ]);
        $offer = Offer::factory()->create([
            'customer_uuid' => $customer->uuid,
            'customerdivision_uuid' => $division->uuid,
            'removed' => false,
        ]);
        $palletType = PalletType::factory()->create(['removed' => false]);
        $article = Article::factory()->create([
            'offer_uuid' => $offer->uuid,
            'pallet_uuid' => $palletType->uuid,
            'removed' => false,
        ]);

        // Create 50 orders with unique production numbers
        // Pass order_production_number as null to avoid factory's generation, then assign generated number
        $orderNumberService = new OrderProductionNumberService;
        for ($i = 0; $i < 50; $i++) {
            $order = Order::factory()->make([
                'article_uuid' => $article->uuid,
                'customershippingaddress_uuid' => $shippingAddress->uuid,
                'order_production_number' => null, // Override factory's generation
                'status' => 2, // Lanciato
                'removed' => false,
            ]);
            $order->order_production_number = $orderNumberService->generateNext();
            $order->save();
        }

        // Authenticate first
        $authResponse = $this->postJson('/api/production/authenticate', [
            'employee_number' => (string) $this->employee->id,
            'order_number' => (string) $this->order->id,
        ]);
        $token = $authResponse->json('employee.token');

        $startTime = microtime(true);

        $response = $this->postJson('/api/production/employee-order-list', [
            'token' => $token,
        ]);

        $endTime = microtime(true);
        $duration = ($endTime - $startTime) * 1000;

        $response->assertStatus(200);
        $this->assertLessThan(500, $duration,
            'Get employee order list should respond in less than 500ms with 50 orders');
    }

    /**
     * Test: Get order info response time
     *
     * Tests order info endpoint with full relationship loading.
     */
    public function test_get_order_info_response_time(): void
    {
        // Authenticate first
        $authResponse = $this->postJson('/api/production/authenticate', [
            'employee_number' => (string) $this->employee->id,
            'order_number' => (string) $this->order->id,
        ]);
        $token = $authResponse->json('employee.token');

        $startTime = microtime(true);

        $response = $this->postJson('/api/production/get-info', [
            'order_uuid' => $this->order->uuid,
            'token' => $token,
        ]);

        $endTime = microtime(true);
        $duration = ($endTime - $startTime) * 1000;

        $response->assertStatus(200);
        $this->assertLessThan(300, $duration,
            'Get order info should respond in less than 300ms');
    }

    /**
     * Test: Add pallet quantity response time
     *
     * Tests pallet quantity processing endpoint performance.
     */
    public function test_add_pallet_quantity_response_time(): void
    {
        // Authenticate first
        $authResponse = $this->postJson('/api/production/authenticate', [
            'employee_number' => (string) $this->employee->id,
            'order_number' => (string) $this->order->id,
        ]);
        $token = $authResponse->json('employee.token');

        $startTime = microtime(true);

        $response = $this->postJson('/api/production/add-pallet-quantity', [
            'order_uuid' => $this->order->uuid,
            'token' => $token,
        ]);

        $endTime = microtime(true);
        $duration = ($endTime - $startTime) * 1000;

        $response->assertStatus(200);
        $this->assertLessThan(400, $duration,
            'Add pallet quantity should respond in less than 400ms');
    }

    /**
     * Test: Add manual quantity response time
     *
     * Tests manual quantity processing endpoint performance.
     */
    public function test_add_manual_quantity_response_time(): void
    {
        // Authenticate first
        $authResponse = $this->postJson('/api/production/authenticate', [
            'employee_number' => (string) $this->employee->id,
            'order_number' => (string) $this->order->id,
        ]);
        $token = $authResponse->json('employee.token');

        $startTime = microtime(true);

        $response = $this->postJson('/api/production/add-manual-quantity', [
            'order_uuid' => $this->order->uuid,
            'quantity' => 50,
            'token' => $token,
        ]);

        $endTime = microtime(true);
        $duration = ($endTime - $startTime) * 1000;

        $response->assertStatus(200);
        $this->assertLessThan(400, $duration,
            'Add manual quantity should respond in less than 400ms');
    }

    /**
     * Test: Multiple concurrent API requests
     *
     * Tests API performance under concurrent load.
     */
    public function test_concurrent_api_requests(): void
    {
        // Authenticate first
        $authResponse = $this->postJson('/api/production/authenticate', [
            'employee_number' => (string) $this->employee->id,
            'order_number' => (string) $this->order->id,
        ]);
        $token = $authResponse->json('employee.token');

        $concurrentRequests = 10;
        $durations = [];
        $startTime = microtime(true);

        // Simulate concurrent requests
        for ($i = 0; $i < $concurrentRequests; $i++) {
            $requestStart = microtime(true);

            $response = $this->postJson('/api/production/employee-order-list', [
                'token' => $token,
            ]);

            $requestEnd = microtime(true);
            $durations[] = ($requestEnd - $requestStart) * 1000;

            $response->assertStatus(200);
        }

        $totalDuration = (microtime(true) - $startTime) * 1000;
        $averageDuration = array_sum($durations) / count($durations);
        $maxDuration = max($durations);

        // Assertions
        $this->assertLessThan(3000, $totalDuration,
            '10 concurrent requests should complete in less than 3 seconds');
        $this->assertLessThan(500, $averageDuration,
            'Average response time should be less than 500ms');
        $this->assertLessThan(1000, $maxDuration,
            'Maximum response time should be less than 1 second');
    }
}
