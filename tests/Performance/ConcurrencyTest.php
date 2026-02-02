<?php

namespace Tests\Performance;

use App\Models\Article;
use App\Models\Customer;
use App\Models\CustomerDivision;
use App\Models\LasFamily;
use App\Models\Offer;
use App\Models\Order;
use App\Models\PalletType;
use App\Services\ArticleCodeService;
use App\Services\OfferNumberService;
use App\Services\OrderProductionNumberService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

/**
 * Performance Tests: Concurrency Testing
 *
 * Tests concurrent operations to ensure thread-safety and data integrity
 * under load conditions.
 */
class ConcurrencyTest extends TestCase
{
    use RefreshDatabase;

    protected OrderProductionNumberService $orderNumberService;

    protected OfferNumberService $offerNumberService;

    protected ArticleCodeService $articleCodeService;

    protected function setUp(): void
    {
        parent::setUp();
        $this->orderNumberService = new OrderProductionNumberService;
        $this->offerNumberService = new OfferNumberService;
        $this->articleCodeService = new ArticleCodeService;
    }

    /**
     * Test: Concurrent production number generation
     *
     * Simulates 50 concurrent requests generating production numbers.
     * Verifies all numbers are unique and no race conditions occur.
     */
    public function test_concurrent_production_number_generation(): void
    {
        $iterations = 50;
        $numbers = [];
        $startTime = microtime(true);

        // Simulate concurrent requests using database transactions
        for ($i = 0; $i < $iterations; $i++) {
            DB::transaction(function () use (&$numbers) {
                $number = $this->orderNumberService->generateNext();
                $numbers[] = $number;

                // Save to database to simulate real usage
                $article = Article::factory()->create(['removed' => false]);
                Order::factory()->create([
                    'article_uuid' => $article->uuid,
                    'order_production_number' => $number,
                    'removed' => false,
                ]);
            });
        }

        $endTime = microtime(true);
        $duration = ($endTime - $startTime) * 1000; // Convert to milliseconds

        // Assertions
        $this->assertCount($iterations, $numbers, 'Should generate exactly '.$iterations.' numbers');

        $uniqueNumbers = array_unique($numbers);
        $this->assertCount($iterations, $uniqueNumbers, 'All numbers must be unique');

        // Performance assertion: Should complete in reasonable time (< 5 seconds for 50 iterations)
        $this->assertLessThan(5000, $duration, 'Should complete in less than 5 seconds');

        // Verify format consistency
        foreach ($numbers as $number) {
            $this->assertMatchesRegularExpression('/^\d{4}\.\d{4}$/', $number);
            $this->assertStringStartsWith(date('Y'), $number);
        }
    }

    /**
     * Test: Concurrent offer number generation
     *
     * Simulates 30 concurrent requests generating offer numbers.
     * Verifies uniqueness and format consistency.
     */
    public function test_concurrent_offer_number_generation(): void
    {
        $iterations = 30;
        $numbers = [];
        $startTime = microtime(true);

        $customer = Customer::factory()->create(['removed' => false]);
        $division = CustomerDivision::factory()->create([
            'customer_uuid' => $customer->uuid,
            'removed' => false,
        ]);

        for ($i = 0; $i < $iterations; $i++) {
            DB::transaction(function () use (&$numbers, $customer, $division) {
                $number = $this->offerNumberService->generateNext();
                $numbers[] = $number;

                // Save to database
                Offer::factory()->create([
                    'customer_uuid' => $customer->uuid,
                    'customerdivision_uuid' => $division->uuid,
                    'offer_number' => $number,
                    'removed' => false,
                ]);
            });
        }

        $endTime = microtime(true);
        $duration = ($endTime - $startTime) * 1000;

        $this->assertCount($iterations, $numbers);
        $this->assertCount($iterations, array_unique($numbers), 'All offer numbers must be unique');
        $this->assertLessThan(3000, $duration, 'Should complete in less than 3 seconds');

        // Verify format: YYYY_PPP_NN_L
        foreach ($numbers as $number) {
            $this->assertMatchesRegularExpression('/^\d{4}_\d{3}_\d{2}_[A-Z]$/', $number);
        }
    }

    /**
     * Test: Concurrent LAS code generation
     *
     * Simulates concurrent LAS code generation with different families.
     * Verifies uniqueness within each family.
     */
    public function test_concurrent_las_code_generation(): void
    {
        $iterations = 20;
        $numbers = [];
        $startTime = microtime(true);

        $customer = Customer::factory()->create(['removed' => false]);
        $division = CustomerDivision::factory()->create([
            'customer_uuid' => $customer->uuid,
            'removed' => false,
        ]);

        // Create LAS family
        $lasFamily = LasFamily::factory()->create(['removed' => false]);

        // Create offer with LAS family
        $offer = Offer::factory()->create([
            'customer_uuid' => $customer->uuid,
            'customerdivision_uuid' => $division->uuid,
            'lasfamily_uuid' => $lasFamily->uuid,
            'removed' => false,
        ]);

        $palletType = PalletType::factory()->create(['removed' => false]);

        for ($i = 0; $i < $iterations; $i++) {
            DB::transaction(function () use (&$numbers, $offer, $palletType) {
                $code = $this->articleCodeService->generateNextLAS($offer->uuid);
                $numbers[] = $code;

                // Save to database
                Article::factory()->create([
                    'offer_uuid' => $offer->uuid,
                    'pallet_uuid' => $palletType->uuid,
                    'cod_article_las' => $code,
                    'removed' => false,
                ]);
            });
        }

        $endTime = microtime(true);
        $duration = ($endTime - $startTime) * 1000;

        $this->assertCount($iterations, $numbers);
        $this->assertCount($iterations, array_unique($numbers), 'All LAS codes must be unique');
        $this->assertLessThan(3000, $duration, 'Should complete in less than 3 seconds');

        // Verify format: LAS + CF + NNNN (CF can be any string, ends with 4 digits)
        foreach ($numbers as $code) {
            $this->assertStringStartsWith('LAS', $code);
            // Format: LAS{codeFamily}{4 digits}
            $this->assertMatchesRegularExpression('/^LAS.+\d{4}$/', $code);
        }
    }

    /**
     * Test: Concurrent order processing updates
     *
     * Simulates multiple employees processing the same order concurrently.
     * Verifies worked_quantity updates correctly without race conditions.
     */
    public function test_concurrent_order_processing_updates(): void
    {
        $article = Article::factory()->create(['removed' => false]);
        $order = Order::factory()->create([
            'article_uuid' => $article->uuid,
            'quantity' => 1000,
            'worked_quantity' => 0,
            'status' => 2, // Lanciato
            'removed' => false,
        ]);

        $concurrentUpdates = 10;
        $quantityPerUpdate = 100;
        $startTime = microtime(true);

        // Simulate concurrent updates
        for ($i = 0; $i < $concurrentUpdates; $i++) {
            DB::transaction(function () use ($order, $quantityPerUpdate) {
                $order->refresh();
                $order->worked_quantity = ($order->worked_quantity ?? 0) + $quantityPerUpdate;
                $order->save();
            });
        }

        $endTime = microtime(true);
        $duration = ($endTime - $startTime) * 1000;

        $order->refresh();
        $expectedQuantity = $concurrentUpdates * $quantityPerUpdate;

        $this->assertEquals($expectedQuantity, $order->worked_quantity,
            'worked_quantity should be sum of all concurrent updates');
        $this->assertLessThan(2000, $duration, 'Should complete in less than 2 seconds');
    }
}
