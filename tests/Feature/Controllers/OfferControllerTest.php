<?php

namespace Tests\Feature\Controllers;

use App\Models\Article;
use App\Models\Customer;
use App\Models\CustomerDivision;
use App\Models\LasWorkLine;
use App\Models\LsResource;
use App\Models\Offer;
use App\Models\OfferActivity;
use App\Models\OfferLasFamily;
use App\Models\OfferOrderType;
use App\Models\OfferSeasonality;
use App\Models\OfferSector;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class OfferControllerTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

    protected Customer $customer;

    protected CustomerDivision $division;

    protected OfferActivity $activity;

    protected OfferSector $sector;

    protected OfferSeasonality $seasonality;

    protected OfferOrderType $orderType;

    protected OfferLasFamily $lasFamily;

    protected LasWorkLine $lasWorkLine;

    protected LsResource $lsResource;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();
        $this->customer = Customer::factory()->create(['removed' => false]);
        $this->division = CustomerDivision::factory()->create([
            'customer_uuid' => $this->customer->uuid,
            'removed' => false,
        ]);
        $this->activity = OfferActivity::factory()->create(['removed' => false]);
        $this->sector = OfferSector::factory()->create(['removed' => false]);
        $this->seasonality = OfferSeasonality::factory()->create(['removed' => false]);
        $this->orderType = OfferOrderType::factory()->create(['removed' => false]);
        $this->lasFamily = OfferLasFamily::factory()->create(['removed' => false]);
        $this->lasWorkLine = LasWorkLine::factory()->create(['removed' => false]);
        $this->lsResource = LsResource::factory()->create(['removed' => false]);
    }

    #[Test]
    public function it_generates_offer_number_automatically_when_creating_offer()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('offers.store'), [
            'customer_uuid' => $this->customer->uuid,
            'customerdivision_uuid' => $this->division->uuid,
            'offer_date' => now()->format('Y-m-d'),
            'activity_uuid' => $this->activity->uuid,
            'sector_uuid' => $this->sector->uuid,
            'seasonality_uuid' => $this->seasonality->uuid,
            'order_type_uuid' => $this->orderType->uuid,
            'lasfamily_uuid' => $this->lasFamily->uuid,
            'lasworkline_uuid' => $this->lasWorkLine->uuid,
            'unit_of_measure' => 'PZ',
            'quantity' => 1000,
            'piece' => 100,
            'expected_revenue' => 1000.00,
        ]);

        $response->assertRedirect(route('offers.index'));
        $response->assertSessionHas('success');

        $offer = Offer::latest()->first();
        $this->assertNotNull($offer->offer_number);
        $this->assertMatchesRegularExpression('/^\d{4}_\d{3}_\d{2}_[A-Z]$/', $offer->offer_number);
    }

    #[Test]
    public function it_uses_provided_offer_number_if_valid()
    {
        $this->actingAs($this->user);

        $offerNumber = date('Y').'_001_01_A';

        $response = $this->post(route('offers.store'), [
            'customer_uuid' => $this->customer->uuid,
            'customerdivision_uuid' => $this->division->uuid,
            'offer_number' => $offerNumber,
            'offer_date' => now()->format('Y-m-d'),
            'activity_uuid' => $this->activity->uuid,
            'sector_uuid' => $this->sector->uuid,
            'seasonality_uuid' => $this->seasonality->uuid,
            'order_type_uuid' => $this->orderType->uuid,
            'lasfamily_uuid' => $this->lasFamily->uuid,
            'lasworkline_uuid' => $this->lasWorkLine->uuid,
            'unit_of_measure' => 'PZ',
            'quantity' => 1000,
            'piece' => 100,
            'expected_revenue' => 1000.00,
        ]);

        $response->assertRedirect(route('offers.index'));

        $offer = Offer::latest()->first();
        $this->assertEquals($offerNumber, $offer->offer_number);
    }

    #[Test]
    public function it_rejects_duplicate_offer_number()
    {
        $this->actingAs($this->user);

        $offerNumber = date('Y').'_001_01_A';

        // Crear primera oferta
        Offer::factory()->create([
            'customer_uuid' => $this->customer->uuid,
            'customerdivision_uuid' => $this->division->uuid,
            'offer_number' => $offerNumber,
            'removed' => false,
        ]);

        // Tentare di creare seconda offerta con lo stesso numero
        $response = $this->post(route('offers.store'), [
            'customer_uuid' => $this->customer->uuid,
            'customerdivision_uuid' => $this->division->uuid,
            'offer_number' => $offerNumber,
            'offer_date' => now()->format('Y-m-d'),
            'activity_uuid' => $this->activity->uuid,
            'sector_uuid' => $this->sector->uuid,
            'seasonality_uuid' => $this->seasonality->uuid,
            'order_type_uuid' => $this->orderType->uuid,
            'lasfamily_uuid' => $this->lasFamily->uuid,
            'lasworkline_uuid' => $this->lasWorkLine->uuid,
            'unit_of_measure' => 'PZ',
            'quantity' => 1000,
            'piece' => 100,
            'expected_revenue' => 1000.00,
        ]);

        $response->assertSessionHasErrors(['offer_number']);
    }

    #[Test]
    public function it_prevents_deleting_offer_with_articles()
    {
        $this->actingAs($this->user);

        $offer = Offer::factory()->create([
            'customer_uuid' => $this->customer->uuid,
            'customerdivision_uuid' => $this->division->uuid,
            'removed' => false,
        ]);

        // Creare articolo associato
        Article::factory()->create([
            'offer_uuid' => $offer->uuid,
            'removed' => false,
        ]);

        $response = $this->delete(route('offers.destroy', $offer));

        $response->assertRedirect(route('offers.index'));
        $response->assertSessionHas('error');

        // Verificar que la oferta no fue eliminada
        $offer->refresh();
        $this->assertFalse($offer->removed);
    }

    #[Test]
    public function it_allows_deleting_offer_without_articles()
    {
        $this->actingAs($this->user);

        $offer = Offer::factory()->create([
            'customer_uuid' => $this->customer->uuid,
            'customerdivision_uuid' => $this->division->uuid,
            'removed' => false,
        ]);

        $response = $this->delete(route('offers.destroy', $offer));

        $response->assertRedirect(route('offers.index'));
        $response->assertSessionHas('success');

        // Verificar que la oferta fue marcada como eliminada
        $offer->refresh();
        $this->assertTrue($offer->removed);
    }

    #[Test]
    public function it_displays_index_page_with_offers()
    {
        $this->actingAs($this->user);

        $offer1 = Offer::factory()->create([
            'customer_uuid' => $this->customer->uuid,
            'customerdivision_uuid' => $this->division->uuid,
            'offer_number' => '2025_001_01_A',
            'removed' => false,
        ]);

        $offer2 = Offer::factory()->create([
            'customer_uuid' => $this->customer->uuid,
            'customerdivision_uuid' => $this->division->uuid,
            'offer_number' => '2025_002_01_A',
            'removed' => false,
        ]);

        $response = $this->get(route('offers.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('Offers/Index')
            ->has('offers')
            ->has('offers.data')
            ->has('customers')
        );
    }

    #[Test]
    public function it_only_shows_active_offers_in_index()
    {
        $this->actingAs($this->user);

        $activeOffer = Offer::factory()->create([
            'customer_uuid' => $this->customer->uuid,
            'customerdivision_uuid' => $this->division->uuid,
            'offer_number' => '2025_001_01_A',
            'removed' => false,
        ]);

        $removedOffer = Offer::factory()->create([
            'customer_uuid' => $this->customer->uuid,
            'customerdivision_uuid' => $this->division->uuid,
            'offer_number' => '2025_002_01_A',
            'removed' => true,
        ]);

        $response = $this->get(route('offers.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->where('offers.data', function ($data) {
            $dataArray = is_object($data) && method_exists($data, 'toArray') ? $data->toArray() : (array) $data;
            $offerNumbers = array_column($dataArray, 'offer_number');
            $this->assertContains('2025_001_01_A', $offerNumbers);
            $this->assertNotContains('2025_002_01_A', $offerNumbers);

            return true;
        })
        );
    }

    #[Test]
    public function it_filters_offers_by_customer_uuid()
    {
        $this->actingAs($this->user);

        $customer2 = Customer::factory()->create(['removed' => false]);
        $division2 = CustomerDivision::factory()->create([
            'customer_uuid' => $customer2->uuid,
            'removed' => false,
        ]);

        $offer1 = Offer::factory()->create([
            'customer_uuid' => $this->customer->uuid,
            'customerdivision_uuid' => $this->division->uuid,
            'offer_number' => '2025_001_01_A',
            'removed' => false,
        ]);

        $offer2 = Offer::factory()->create([
            'customer_uuid' => $customer2->uuid,
            'customerdivision_uuid' => $division2->uuid,
            'offer_number' => '2025_002_01_A',
            'removed' => false,
        ]);

        $response = $this->get(route('offers.index', [
            'customer_uuid' => $this->customer->uuid,
        ]));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->has('filters')
            ->where('filters.customer_uuid', $this->customer->uuid)
        );
    }

    #[Test]
    public function it_filters_offers_by_search_term()
    {
        $this->actingAs($this->user);

        $offer = Offer::factory()->create([
            'customer_uuid' => $this->customer->uuid,
            'customerdivision_uuid' => $this->division->uuid,
            'offer_number' => '2025_001_01_A',
            'provisional_description' => 'Test Offer Description',
            'removed' => false,
        ]);

        $response = $this->get(route('offers.index', [
            'search' => '2025_001',
        ]));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->has('filters')
            ->where('filters.search', '2025_001')
        );
    }

    #[Test]
    public function it_displays_create_form()
    {
        $this->actingAs($this->user);

        $response = $this->get(route('offers.create'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('Offers/Create')
            ->has('customers')
            ->has('divisions')
            ->has('activities')
            ->has('sectors')
            ->has('seasonalities')
            ->has('orderTypes')
            ->has('lasFamilies')
            ->has('lasWorkLines')
            ->has('lsResources')
            ->has('offerNumber')
        );
    }

    #[Test]
    public function it_displays_create_form_with_customer_uuid()
    {
        $this->actingAs($this->user);

        $response = $this->get(route('offers.create', [
            'customer_uuid' => $this->customer->uuid,
        ]));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('Offers/Create')
            ->has('divisions')
            ->where('divisions.0.uuid', $this->division->uuid)
        );
    }

    #[Test]
    public function it_displays_show_page()
    {
        $this->actingAs($this->user);

        $offer = Offer::factory()->create([
            'customer_uuid' => $this->customer->uuid,
            'customerdivision_uuid' => $this->division->uuid,
            'offer_number' => '2025_001_01_A',
            'removed' => false,
        ]);

        $response = $this->get(route('offers.show', $offer));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('Offers/Show')
            ->has('offer')
            ->where('offer.offer_number', '2025_001_01_A')
        );
    }

    #[Test]
    public function it_displays_edit_form()
    {
        $this->actingAs($this->user);

        $offer = Offer::factory()->create([
            'customer_uuid' => $this->customer->uuid,
            'customerdivision_uuid' => $this->division->uuid,
            'offer_number' => '2025_001_01_A',
            'removed' => false,
        ]);

        $response = $this->get(route('offers.edit', $offer));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('Offers/Edit')
            ->has('offer')
            ->has('customers')
            ->has('divisions')
            ->where('offer.offer_number', '2025_001_01_A')
        );
    }

    #[Test]
    public function it_updates_offer_successfully()
    {
        $this->actingAs($this->user);

        $offer = Offer::factory()->create([
            'customer_uuid' => $this->customer->uuid,
            'customerdivision_uuid' => $this->division->uuid,
            'offer_number' => '2025_001_01_A',
            'provisional_description' => 'Original Description',
            'removed' => false,
        ]);

        $response = $this->put(route('offers.update', $offer), [
            'customer_uuid' => $this->customer->uuid,
            'customerdivision_uuid' => $this->division->uuid,
            'offer_number' => '2025_001_01_A',
            'offer_date' => now()->format('Y-m-d'),
            'validity_date' => $offer->validity_date->format('Y-m-d'),
            'activity_uuid' => $this->activity->uuid,
            'sector_uuid' => $this->sector->uuid,
            'seasonality_uuid' => $this->seasonality->uuid,
            'order_type_uuid' => $this->orderType->uuid,
            'lasfamily_uuid' => $this->lasFamily->uuid,
            'lasworkline_uuid' => $this->lasWorkLine->uuid,
            'unit_of_measure' => $offer->unit_of_measure,
            'quantity' => $offer->quantity,
            'piece' => $offer->piece,
            'expected_revenue' => $offer->expected_revenue,
            'rate_rounding_cfz' => $offer->rate_rounding_cfz,
            'rate_increase_cfz' => $offer->rate_increase_cfz,
            'materials_euro' => $offer->materials_euro,
            'logistics_euro' => $offer->logistics_euro,
            'other_euro' => $offer->other_euro,
            'provisional_description' => 'Updated Description',
        ]);

        $response->assertRedirect(route('offers.show', $offer->uuid));
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('offer', [
            'id' => $offer->id,
            'provisional_description' => 'Updated Description',
        ]);
    }

    #[Test]
    public function it_rejects_duplicate_offer_number_on_update()
    {
        $this->actingAs($this->user);

        $offer1 = Offer::factory()->create([
            'customer_uuid' => $this->customer->uuid,
            'customerdivision_uuid' => $this->division->uuid,
            'offer_number' => '2025_001_01_A',
            'removed' => false,
        ]);

        $offer2 = Offer::factory()->create([
            'customer_uuid' => $this->customer->uuid,
            'customerdivision_uuid' => $this->division->uuid,
            'offer_number' => '2025_002_01_A',
            'removed' => false,
        ]);

        // Tentare di aggiornare offer2 con il numero di offer1
        $response = $this->put(route('offers.update', $offer2), [
            'customer_uuid' => $this->customer->uuid,
            'customerdivision_uuid' => $this->division->uuid,
            'offer_number' => '2025_001_01_A',
            'offer_date' => now()->format('Y-m-d'),
            'validity_date' => $offer2->validity_date->format('Y-m-d'),
            'activity_uuid' => $this->activity->uuid,
            'sector_uuid' => $this->sector->uuid,
            'seasonality_uuid' => $this->seasonality->uuid,
            'order_type_uuid' => $this->orderType->uuid,
            'lasfamily_uuid' => $this->lasFamily->uuid,
            'lasworkline_uuid' => $this->lasWorkLine->uuid,
            'unit_of_measure' => $offer2->unit_of_measure,
            'quantity' => $offer2->quantity,
            'piece' => $offer2->piece,
            'expected_revenue' => $offer2->expected_revenue,
            'rate_rounding_cfz' => $offer2->rate_rounding_cfz,
            'rate_increase_cfz' => $offer2->rate_increase_cfz,
            'materials_euro' => $offer2->materials_euro,
            'logistics_euro' => $offer2->logistics_euro,
            'other_euro' => $offer2->other_euro,
        ]);

        $response->assertSessionHasErrors(['offer_number']);
    }

    #[Test]
    public function it_allows_updating_offer_with_same_number()
    {
        $this->actingAs($this->user);

        $offer = Offer::factory()->create([
            'customer_uuid' => $this->customer->uuid,
            'customerdivision_uuid' => $this->division->uuid,
            'offer_number' => '2025_001_01_A',
            'removed' => false,
        ]);

        $response = $this->put(route('offers.update', $offer), [
            'customer_uuid' => $this->customer->uuid,
            'customerdivision_uuid' => $this->division->uuid,
            'offer_number' => '2025_001_01_A', // Stesso numero
            'offer_date' => now()->format('Y-m-d'),
            'validity_date' => $offer->validity_date->format('Y-m-d'),
            'activity_uuid' => $this->activity->uuid,
            'sector_uuid' => $this->sector->uuid,
            'seasonality_uuid' => $this->seasonality->uuid,
            'order_type_uuid' => $this->orderType->uuid,
            'lasfamily_uuid' => $this->lasFamily->uuid,
            'lasworkline_uuid' => $this->lasWorkLine->uuid,
            'unit_of_measure' => $offer->unit_of_measure,
            'quantity' => $offer->quantity,
            'piece' => $offer->piece,
            'expected_revenue' => $offer->expected_revenue,
            'rate_rounding_cfz' => $offer->rate_rounding_cfz,
            'rate_increase_cfz' => $offer->rate_increase_cfz,
            'materials_euro' => $offer->materials_euro,
            'logistics_euro' => $offer->logistics_euro,
            'other_euro' => $offer->other_euro,
        ]);

        $response->assertRedirect(route('offers.show', $offer->uuid));
        $response->assertSessionHas('success');

        $offer->refresh();
        $this->assertEquals('2025_001_01_A', $offer->offer_number);
    }

    #[Test]
    public function it_returns_divisions_for_customer()
    {
        $this->actingAs($this->user);

        $response = $this->getJson(route('offers.get-divisions', [
            'customer_uuid' => $this->customer->uuid,
        ]));

        $response->assertStatus(200);
        $response->assertJsonStructure([
            '*' => ['uuid', 'name'],
        ]);
        $response->assertJsonFragment([
            'uuid' => $this->division->uuid,
            'name' => $this->division->name,
        ]);
    }

    #[Test]
    public function it_validates_customer_uuid_for_divisions_endpoint()
    {
        $this->actingAs($this->user);

        $response = $this->getJson(route('offers.get-divisions'));

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['customer_uuid']);
    }

    #[Test]
    public function it_requires_valid_customer_uuid_for_divisions()
    {
        $this->actingAs($this->user);

        $response = $this->getJson(route('offers.get-divisions'), [
            'customer_uuid' => 'invalid-uuid',
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['customer_uuid']);
    }

    #[Test]
    public function it_returns_only_active_divisions()
    {
        $this->actingAs($this->user);

        $removedDivision = CustomerDivision::factory()->create([
            'customer_uuid' => $this->customer->uuid,
            'removed' => true,
        ]);

        $response = $this->getJson(route('offers.get-divisions', [
            'customer_uuid' => $this->customer->uuid,
        ]));

        $response->assertStatus(200);
        $response->assertJsonMissing([
            'uuid' => $removedDivision->uuid,
        ]);
        $response->assertJsonFragment([
            'uuid' => $this->division->uuid,
        ]);
    }

    #[Test]
    public function it_validates_date_format_for_offer_date()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('offers.store'), [
            'customer_uuid' => $this->customer->uuid,
            'customerdivision_uuid' => $this->division->uuid,
            'offer_date' => 'invalid-date-format',
            'activity_uuid' => $this->activity->uuid,
            'sector_uuid' => $this->sector->uuid,
            'seasonality_uuid' => $this->seasonality->uuid,
            'order_type_uuid' => $this->orderType->uuid,
            'lasfamily_uuid' => $this->lasFamily->uuid,
            'lasworkline_uuid' => $this->lasWorkLine->uuid,
            'unit_of_measure' => 'PZ',
            'quantity' => 1000,
            'piece' => 100,
            'expected_revenue' => 1000.00,
        ]);

        $response->assertSessionHasErrors(['offer_date']);
    }

    #[Test]
    public function it_validates_date_format_for_validity_date()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('offers.store'), [
            'customer_uuid' => $this->customer->uuid,
            'customerdivision_uuid' => $this->division->uuid,
            'validity_date' => 'not-a-date',
            'activity_uuid' => $this->activity->uuid,
            'sector_uuid' => $this->sector->uuid,
            'seasonality_uuid' => $this->seasonality->uuid,
            'order_type_uuid' => $this->orderType->uuid,
            'lasfamily_uuid' => $this->lasFamily->uuid,
            'lasworkline_uuid' => $this->lasWorkLine->uuid,
            'unit_of_measure' => 'PZ',
            'quantity' => 1000,
            'piece' => 100,
            'expected_revenue' => 1000.00,
        ]);

        $response->assertSessionHasErrors(['validity_date']);
    }

    #[Test]
    public function it_validates_numeric_minimum_for_quantity()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('offers.store'), [
            'customer_uuid' => $this->customer->uuid,
            'customerdivision_uuid' => $this->division->uuid,
            'activity_uuid' => $this->activity->uuid,
            'sector_uuid' => $this->sector->uuid,
            'seasonality_uuid' => $this->seasonality->uuid,
            'order_type_uuid' => $this->orderType->uuid,
            'lasfamily_uuid' => $this->lasFamily->uuid,
            'lasworkline_uuid' => $this->lasWorkLine->uuid,
            'unit_of_measure' => 'PZ',
            'quantity' => -10,
            'piece' => 100,
            'expected_revenue' => 1000.00,
        ]);

        $response->assertSessionHasErrors(['quantity']);
    }

    #[Test]
    public function it_validates_numeric_minimum_for_piece()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('offers.store'), [
            'customer_uuid' => $this->customer->uuid,
            'customerdivision_uuid' => $this->division->uuid,
            'activity_uuid' => $this->activity->uuid,
            'sector_uuid' => $this->sector->uuid,
            'seasonality_uuid' => $this->seasonality->uuid,
            'order_type_uuid' => $this->orderType->uuid,
            'lasfamily_uuid' => $this->lasFamily->uuid,
            'lasworkline_uuid' => $this->lasWorkLine->uuid,
            'unit_of_measure' => 'PZ',
            'quantity' => 1000,
            'piece' => -5,
            'expected_revenue' => 1000.00,
        ]);

        $response->assertSessionHasErrors(['piece']);
    }

    #[Test]
    public function it_validates_integer_minimum_for_expected_workers()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('offers.store'), [
            'customer_uuid' => $this->customer->uuid,
            'customerdivision_uuid' => $this->division->uuid,
            'activity_uuid' => $this->activity->uuid,
            'sector_uuid' => $this->sector->uuid,
            'seasonality_uuid' => $this->seasonality->uuid,
            'order_type_uuid' => $this->orderType->uuid,
            'lasfamily_uuid' => $this->lasFamily->uuid,
            'lasworkline_uuid' => $this->lasWorkLine->uuid,
            'unit_of_measure' => 'PZ',
            'quantity' => 1000,
            'piece' => 100,
            'expected_workers' => -1,
            'expected_revenue' => 1000.00,
        ]);

        $response->assertSessionHasErrors(['expected_workers']);
    }

    #[Test]
    public function it_validates_max_length_for_string_fields()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('offers.store'), [
            'customer_uuid' => $this->customer->uuid,
            'customerdivision_uuid' => $this->division->uuid,
            'offer_number' => str_repeat('a', 256), // Più di 255 caratteri
            'activity_uuid' => $this->activity->uuid,
            'sector_uuid' => $this->sector->uuid,
            'seasonality_uuid' => $this->seasonality->uuid,
            'order_type_uuid' => $this->orderType->uuid,
            'lasfamily_uuid' => $this->lasFamily->uuid,
            'lasworkline_uuid' => $this->lasWorkLine->uuid,
            'unit_of_measure' => 'PZ',
            'quantity' => 1000,
            'piece' => 100,
            'expected_revenue' => 1000.00,
        ]);

        $response->assertSessionHasErrors(['offer_number']);
    }

    #[Test]
    public function it_accepts_zero_for_numeric_fields()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('offers.store'), [
            'customer_uuid' => $this->customer->uuid,
            'customerdivision_uuid' => $this->division->uuid,
            'activity_uuid' => $this->activity->uuid,
            'sector_uuid' => $this->sector->uuid,
            'seasonality_uuid' => $this->seasonality->uuid,
            'order_type_uuid' => $this->orderType->uuid,
            'lasfamily_uuid' => $this->lasFamily->uuid,
            'lasworkline_uuid' => $this->lasWorkLine->uuid,
            'unit_of_measure' => 'PZ',
            'quantity' => 0,
            'piece' => 0,
            'expected_revenue' => 0,
        ]);

        $response->assertRedirect(route('offers.index'));
        $this->assertDatabaseHas('offer', [
            'quantity' => 0,
            'piece' => 0,
        ]);
    }

    #[Test]
    public function it_handles_empty_search_results()
    {
        $this->actingAs($this->user);

        $response = $this->get(route('offers.index', ['search' => 'NONEXISTENT12345']));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('Offers/Index')
            ->has('offers')
            ->has('offers.data')
        );

        // Verificar que no hay resultados
        $response->assertInertia(fn ($page) => $page->has('offers.data')
            ->where('offers.data', [])
        );
    }

    #[Test]
    public function it_handles_pagination_correctly()
    {
        $this->actingAs($this->user);

        // Creare più di 15 offerte (default per_page)
        Offer::factory()->count(20)->create([
            'customer_uuid' => $this->customer->uuid,
            'customerdivision_uuid' => $this->division->uuid,
            'removed' => false,
        ]);

        $response = $this->get(route('offers.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->has('offers')
            ->has('offers.current_page')
            ->has('offers.last_page')
        );
    }

    #[Test]
    public function it_filters_by_customerdivision_uuid()
    {
        $this->actingAs($this->user);

        $division2 = CustomerDivision::factory()->create([
            'customer_uuid' => $this->customer->uuid,
            'removed' => false,
        ]);

        $offer1 = Offer::factory()->create([
            'customer_uuid' => $this->customer->uuid,
            'customerdivision_uuid' => $this->division->uuid,
            'offer_number' => '2025_001_01_A',
            'removed' => false,
        ]);

        $offer2 = Offer::factory()->create([
            'customer_uuid' => $this->customer->uuid,
            'customerdivision_uuid' => $division2->uuid,
            'offer_number' => '2025_002_01_A',
            'removed' => false,
        ]);

        $response = $this->get(route('offers.index', [
            'customerdivision_uuid' => $this->division->uuid,
        ]));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->has('filters')
            ->where('filters.customerdivision_uuid', $this->division->uuid)
        );
    }

    #[Test]
    public function it_handles_offer_with_nullable_fields()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('offers.store'), [
            'customer_uuid' => $this->customer->uuid,
            'customerdivision_uuid' => null,
            'validity_date' => null,
            'activity_uuid' => null,
            'sector_uuid' => null,
            'seasonality_uuid' => null,
            'type_uuid' => null,
            'order_type_uuid' => null,
            'lasfamily_uuid' => null,
            'lasworkline_uuid' => null,
            'lsresource_uuid' => null,
            'unit_of_measure' => null,
            'quantity' => null,
            'piece' => null,
        ]);

        $response->assertRedirect(route('offers.index'));
        $this->assertDatabaseHas('offer', [
            'customer_uuid' => $this->customer->uuid,
            'customerdivision_uuid' => null,
        ]);
    }

    #[Test]
    public function it_searches_by_provisional_description()
    {
        $this->actingAs($this->user);

        $offer = Offer::factory()->create([
            'customer_uuid' => $this->customer->uuid,
            'customerdivision_uuid' => $this->division->uuid,
            'offer_number' => '2025_003_01_A',
            'provisional_description' => 'Test Description Search',
            'removed' => false,
        ]);

        $response = $this->get(route('offers.index', ['search' => 'Test Description']));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->where('filters.search', 'Test Description')
        );
    }
}
