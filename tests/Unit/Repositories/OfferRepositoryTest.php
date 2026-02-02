<?php

namespace Tests\Unit\Repositories;

use App\Models\LasFamily;
use App\Models\LasWorkLine;
use App\Models\LsResource;
use App\Models\OfferActivity;
use App\Models\OfferOperationCategory;
use App\Models\OfferOrderType;
use App\Models\OfferSeasonality;
use App\Models\OfferSector;
use App\Repositories\OfferRepository;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class OfferRepositoryTest extends TestCase
{
    use RefreshDatabase;

    protected OfferRepository $repository;

    protected function setUp(): void
    {
        parent::setUp();
        $this->repository = new OfferRepository;
    }

    #[Test]
    public function it_returns_form_options_with_all_required_keys()
    {
        // Crear datos de prueba
        OfferActivity::factory()->create(['name' => 'Activity 1', 'removed' => false]);
        OfferSector::factory()->create(['name' => 'Sector 1', 'removed' => false]);
        OfferSeasonality::factory()->create(['name' => 'Seasonality 1', 'removed' => false]);
        OfferOrderType::factory()->create(['name' => 'Order Type 1', 'removed' => false]);
        LasFamily::factory()->create(['name' => 'LAS Family 1', 'removed' => false]);
        LasWorkLine::factory()->create(['name' => 'LAS Work Line 1', 'removed' => false]);
        LsResource::factory()->create(['name' => 'LS Resource 1', 'removed' => false]);
        OfferOperationCategory::factory()->create(['name' => 'Category 1', 'removed' => false]);

        $options = $this->repository->getFormOptions();

        $this->assertIsArray($options);
        $this->assertArrayHasKey('activities', $options);
        $this->assertArrayHasKey('sectors', $options);
        $this->assertArrayHasKey('seasonalities', $options);
        $this->assertArrayHasKey('orderTypes', $options);
        $this->assertArrayHasKey('lasFamilies', $options);
        $this->assertArrayHasKey('lasWorkLines', $options);
        $this->assertArrayHasKey('lsResources', $options);
        $this->assertArrayHasKey('operationCategories', $options);
    }

    #[Test]
    public function it_returns_only_active_records()
    {
        // Crear registros activos e inactivos
        OfferActivity::factory()->create(['name' => 'Active Activity', 'removed' => false]);
        OfferActivity::factory()->create(['name' => 'Inactive Activity', 'removed' => true]);

        OfferSector::factory()->create(['name' => 'Active Sector', 'removed' => false]);
        OfferSector::factory()->create(['name' => 'Inactive Sector', 'removed' => true]);

        $options = $this->repository->getFormOptions();

        $this->assertCount(1, $options['activities']);
        $this->assertEquals('Active Activity', $options['activities']->first()->name);

        $this->assertCount(1, $options['sectors']);
        $this->assertEquals('Active Sector', $options['sectors']->first()->name);
    }

    #[Test]
    public function it_orders_options_by_name()
    {
        OfferActivity::factory()->create(['name' => 'Z Activity', 'removed' => false]);
        OfferActivity::factory()->create(['name' => 'A Activity', 'removed' => false]);
        OfferActivity::factory()->create(['name' => 'M Activity', 'removed' => false]);

        $options = $this->repository->getFormOptions();

        $activities = $options['activities'];
        $this->assertCount(3, $activities);
        $this->assertEquals('A Activity', $activities[0]->name);
        $this->assertEquals('M Activity', $activities[1]->name);
        $this->assertEquals('Z Activity', $activities[2]->name);
    }

    #[Test]
    public function it_returns_only_uuid_and_name_fields()
    {
        OfferActivity::factory()->create(['name' => 'Test Activity', 'removed' => false]);

        $options = $this->repository->getFormOptions();

        $activity = $options['activities']->first();
        $this->assertNotNull($activity->uuid);
        $this->assertNotNull($activity->name);

        // Verificar que solo tiene uuid y name (usando getAttributes o toArray)
        $attributes = $activity->getAttributes();
        $this->assertArrayHasKey('uuid', $attributes);
        $this->assertArrayHasKey('name', $attributes);
        $this->assertArrayNotHasKey('removed', $attributes);
        $this->assertArrayNotHasKey('created_at', $attributes);
    }

    #[Test]
    public function it_caches_form_options()
    {
        OfferActivity::factory()->create(['name' => 'Cached Activity', 'removed' => false]);

        // Primera llamada - debe crear el cache
        $options1 = $this->repository->getFormOptions();
        $this->assertTrue(Cache::has('offer_form_options'));

        // Segunda llamada - debe usar el cache
        $options2 = $this->repository->getFormOptions();
        $this->assertEquals($options1, $options2);
    }

    #[Test]
    public function it_clears_form_options_cache()
    {
        OfferActivity::factory()->create(['name' => 'Test Activity', 'removed' => false]);

        // Crear el cache
        $this->repository->getFormOptions();
        $this->assertTrue(Cache::has('offer_form_options'));

        // Limpiar el cache
        $this->repository->clearFormOptionsCache();
        $this->assertFalse(Cache::has('offer_form_options'));
    }

    #[Test]
    public function it_returns_empty_collections_when_no_data_exists()
    {
        $options = $this->repository->getFormOptions();

        $this->assertCount(0, $options['activities']);
        $this->assertCount(0, $options['sectors']);
        $this->assertCount(0, $options['seasonalities']);
        $this->assertCount(0, $options['orderTypes']);
        $this->assertCount(0, $options['lasFamilies']);
        $this->assertCount(0, $options['lasWorkLines']);
        $this->assertCount(0, $options['lsResources']);
        $this->assertCount(0, $options['operationCategories']);
    }
}
