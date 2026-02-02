<?php

namespace Tests\Feature\Controllers;

use App\Models\Offer;
use App\Models\OfferOperation;
use App\Models\OfferOperationList;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class OfferOperationListControllerTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    #[Test]
    public function it_displays_index_page_with_operation_lists()
    {
        $this->actingAs($this->user);

        $offer = Offer::factory()->create();
        $operation = OfferOperation::factory()->create();

        OfferOperationList::factory()->create([
            'offer_uuid' => $offer->uuid,
            'offeroperation_uuid' => $operation->uuid,
            'removed' => false,
        ]);

        $response = $this->get(route('offer-operation-lists.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->has('operationLists')
            ->has('operationLists.data')
        );
    }

    #[Test]
    public function it_filters_operation_lists_by_search()
    {
        $this->actingAs($this->user);

        $offer = Offer::factory()->create(['offer_number' => 'OFF-001']);
        $operation = OfferOperation::factory()->create(['codice' => 'OP-001']);

        OfferOperationList::factory()->create([
            'offer_uuid' => $offer->uuid,
            'offeroperation_uuid' => $operation->uuid,
        ]);

        $response = $this->get(route('offer-operation-lists.index', ['search' => 'OFF-001']));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->where('filters.search', 'OFF-001')
        );
    }

    #[Test]
    public function it_shows_create_form()
    {
        $this->actingAs($this->user);

        $response = $this->get(route('offer-operation-lists.create'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('OfferOperationLists/Create')
            ->has('offers')
            ->has('operations')
        );
    }

    #[Test]
    public function it_stores_new_operation_list()
    {
        $this->actingAs($this->user);

        $offer = Offer::factory()->create();
        $operation = OfferOperation::factory()->create();

        $response = $this->post(route('offer-operation-lists.store'), [
            'offer_uuid' => $offer->uuid,
            'offeroperation_uuid' => $operation->uuid,
            'num_op' => 1.5,
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('offeroperationlist', [
            'offer_uuid' => $offer->uuid,
            'offeroperation_uuid' => $operation->uuid,
            'num_op' => 1.5,
            'removed' => false,
        ]);
    }

    #[Test]
    public function it_validates_duplicate_operation_in_same_offer()
    {
        $this->actingAs($this->user);

        $offer = Offer::factory()->create();
        $operation = OfferOperation::factory()->create();

        OfferOperationList::factory()->create([
            'offer_uuid' => $offer->uuid,
            'offeroperation_uuid' => $operation->uuid,
        ]);

        $response = $this->post(route('offer-operation-lists.store'), [
            'offer_uuid' => $offer->uuid,
            'offeroperation_uuid' => $operation->uuid,
            'num_op' => 2.0,
        ]);

        $response->assertSessionHasErrors(['offeroperation_uuid']);
    }

    #[Test]
    public function it_shows_operation_list()
    {
        $this->actingAs($this->user);

        $operationList = OfferOperationList::factory()->create();

        $response = $this->get(route('offer-operation-lists.show', $operationList));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('OfferOperationLists/Show')
            ->has('operationList')
        );
    }

    #[Test]
    public function it_shows_edit_form()
    {
        $this->actingAs($this->user);

        $operationList = OfferOperationList::factory()->create();

        $response = $this->get(route('offer-operation-lists.edit', $operationList));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('OfferOperationLists/Edit')
            ->has('operationList')
            ->has('offers')
            ->has('operations')
        );
    }

    #[Test]
    public function it_updates_operation_list()
    {
        $this->actingAs($this->user);

        $operationList = OfferOperationList::factory()->create(['num_op' => 1.0]);
        $newOperation = OfferOperation::factory()->create();

        $response = $this->put(route('offer-operation-lists.update', $operationList), [
            'offer_uuid' => $operationList->offer_uuid,
            'offeroperation_uuid' => $newOperation->uuid,
            'num_op' => 2.5,
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('offeroperationlist', [
            'id' => $operationList->id,
            'offeroperation_uuid' => $newOperation->uuid,
            'num_op' => 2.5,
        ]);
    }

    #[Test]
    public function it_validates_duplicate_operation_on_update()
    {
        $this->actingAs($this->user);

        $offer = Offer::factory()->create();
        $operation1 = OfferOperation::factory()->create();
        $operation2 = OfferOperation::factory()->create();

        $list1 = OfferOperationList::factory()->create([
            'offer_uuid' => $offer->uuid,
            'offeroperation_uuid' => $operation1->uuid,
        ]);

        $list2 = OfferOperationList::factory()->create([
            'offer_uuid' => $offer->uuid,
            'offeroperation_uuid' => $operation2->uuid,
        ]);

        $response = $this->put(route('offer-operation-lists.update', $list2), [
            'offer_uuid' => $offer->uuid,
            'offeroperation_uuid' => $operation1->uuid,
            'num_op' => 1.0,
        ]);

        $response->assertSessionHasErrors(['offeroperation_uuid']);
    }

    #[Test]
    public function it_destroys_operation_list()
    {
        $this->actingAs($this->user);

        $operationList = OfferOperationList::factory()->create();

        $response = $this->delete(route('offer-operation-lists.destroy', $operationList));

        $response->assertRedirect();
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('offeroperationlist', [
            'id' => $operationList->id,
            'removed' => true,
        ]);
    }

    #[Test]
    public function it_filters_operation_lists_by_offer_uuid()
    {
        $this->actingAs($this->user);

        $offer1 = Offer::factory()->create();
        $offer2 = Offer::factory()->create();
        $operation = OfferOperation::factory()->create();

        OfferOperationList::factory()->create([
            'offer_uuid' => $offer1->uuid,
            'offeroperation_uuid' => $operation->uuid,
        ]);

        OfferOperationList::factory()->create([
            'offer_uuid' => $offer2->uuid,
            'offeroperation_uuid' => $operation->uuid,
        ]);

        $response = $this->get(route('offer-operation-lists.index', ['offer_uuid' => $offer1->uuid]));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->where('filters.offer_uuid', $offer1->uuid)
        );
    }

    #[Test]
    public function it_paginates_operation_lists()
    {
        $this->actingAs($this->user);

        $offer = Offer::factory()->create();
        $operation = OfferOperation::factory()->create();

        OfferOperationList::factory()->count(20)->create([
            'offer_uuid' => $offer->uuid,
            'offeroperation_uuid' => $operation->uuid,
        ]);

        $response = $this->get(route('offer-operation-lists.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->has('operationLists')
            ->where('operationLists.current_page', 1)
            ->where('operationLists.last_page', function ($lastPage) {
                $this->assertGreaterThan(1, $lastPage);

                return true;
            })
        );
    }

    #[Test]
    public function it_handles_empty_search_results()
    {
        $this->actingAs($this->user);

        $offer = Offer::factory()->create(['offer_number' => 'OFF-001']);
        $operation = OfferOperation::factory()->create();

        OfferOperationList::factory()->create([
            'offer_uuid' => $offer->uuid,
            'offeroperation_uuid' => $operation->uuid,
        ]);

        $response = $this->get(route('offer-operation-lists.index', ['search' => 'NonExistent']));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->where('operationLists.data', [])
        );
    }

    #[Test]
    public function it_validates_required_fields_on_store()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('offer-operation-lists.store'), []);

        $response->assertSessionHasErrors(['offer_uuid', 'offeroperation_uuid', 'num_op']);
    }

    #[Test]
    public function it_validates_num_op_min_value()
    {
        $this->actingAs($this->user);

        $offer = Offer::factory()->create();
        $operation = OfferOperation::factory()->create();

        $response = $this->post(route('offer-operation-lists.store'), [
            'offer_uuid' => $offer->uuid,
            'offeroperation_uuid' => $operation->uuid,
            'num_op' => -1,
        ]);

        $response->assertSessionHasErrors(['num_op']);
    }

    #[Test]
    public function it_validates_num_op_numeric()
    {
        $this->actingAs($this->user);

        $offer = Offer::factory()->create();
        $operation = OfferOperation::factory()->create();

        $response = $this->post(route('offer-operation-lists.store'), [
            'offer_uuid' => $offer->uuid,
            'offeroperation_uuid' => $operation->uuid,
            'num_op' => 'invalid',
        ]);

        $response->assertSessionHasErrors(['num_op']);
    }

    #[Test]
    public function it_validates_required_fields_on_update()
    {
        $this->actingAs($this->user);

        $operationList = OfferOperationList::factory()->create();

        $response = $this->put(route('offer-operation-lists.update', $operationList), []);

        $response->assertSessionHasErrors(['offer_uuid', 'offeroperation_uuid', 'num_op']);
    }

    #[Test]
    public function it_validates_num_op_min_value_on_update()
    {
        $this->actingAs($this->user);

        $operationList = OfferOperationList::factory()->create();
        $offer = Offer::factory()->create();
        $operation = OfferOperation::factory()->create();

        $response = $this->put(route('offer-operation-lists.update', $operationList), [
            'offer_uuid' => $offer->uuid,
            'offeroperation_uuid' => $operation->uuid,
            'num_op' => -1,
        ]);

        $response->assertSessionHasErrors(['num_op']);
    }

    #[Test]
    public function it_loads_offer_and_operation_relationships_on_show()
    {
        $this->actingAs($this->user);

        $operationList = OfferOperationList::factory()->create();

        $response = $this->get(route('offer-operation-lists.show', $operationList));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->has('operationList.offer')
            ->has('operationList.operation')
        );
    }

    #[Test]
    public function it_only_shows_active_operation_lists()
    {
        $this->actingAs($this->user);

        $offer = Offer::factory()->create();
        $operation = OfferOperation::factory()->create();

        OfferOperationList::factory()->create([
            'offer_uuid' => $offer->uuid,
            'offeroperation_uuid' => $operation->uuid,
            'removed' => false,
        ]);

        OfferOperationList::factory()->create([
            'offer_uuid' => $offer->uuid,
            'offeroperation_uuid' => $operation->uuid,
            'removed' => true,
        ]);

        $response = $this->get(route('offer-operation-lists.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->where('operationLists.data', function ($data) {
            $dataArray = is_object($data) && method_exists($data, 'toArray') ? $data->toArray() : $data;
            $this->assertCount(1, $dataArray);

            return true;
        })
        );
    }
}
