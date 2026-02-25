<?php

namespace Tests\Unit\Models;

use App\Models\Customer;
use App\Models\CustomerDivision;
use App\Models\Offer;
use App\Models\OfferActivity;
use App\Models\OfferLasFamily;
use App\Models\OfferLasWorkLine;
use App\Models\OfferLsResource;
use App\Models\OfferOperation;
use App\Models\OfferOperationList;
use App\Models\OfferOrderType;
use App\Models\OfferSeasonality;
use App\Models\OfferSector;
use App\Models\OfferType;
use App\Models\OfferTypeOrder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class OfferRelationsTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function offer_belongs_to_customer()
    {
        $customer = Customer::factory()->create();
        $offer = Offer::factory()->create(['customer_uuid' => $customer->uuid]);

        $this->assertInstanceOf(Customer::class, $offer->customer);
        $this->assertEquals($customer->uuid, $offer->customer->uuid);
    }

    #[Test]
    public function offer_belongs_to_customer_division()
    {
        $division = CustomerDivision::factory()->create();
        $offer = Offer::factory()->create(['customerdivision_uuid' => $division->uuid]);

        $this->assertInstanceOf(CustomerDivision::class, $offer->customerDivision);
        $this->assertEquals($division->uuid, $offer->customerDivision->uuid);
    }

    #[Test]
    public function offer_belongs_to_activity()
    {
        $activity = OfferActivity::factory()->create();
        $offer = Offer::factory()->create(['activity_uuid' => $activity->uuid]);

        $this->assertInstanceOf(OfferActivity::class, $offer->activity);
        $this->assertEquals($activity->uuid, $offer->activity->uuid);
    }

    #[Test]
    public function offer_belongs_to_sector()
    {
        $sector = OfferSector::factory()->create();
        $offer = Offer::factory()->create(['sector_uuid' => $sector->uuid]);

        $this->assertInstanceOf(OfferSector::class, $offer->sector);
        $this->assertEquals($sector->uuid, $offer->sector->uuid);
    }

    #[Test]
    public function offer_belongs_to_seasonality()
    {
        $seasonality = OfferSeasonality::factory()->create();
        $offer = Offer::factory()->create(['seasonality_uuid' => $seasonality->uuid]);

        $this->assertInstanceOf(OfferSeasonality::class, $offer->seasonality);
        $this->assertEquals($seasonality->uuid, $offer->seasonality->uuid);
    }

    #[Test]
    public function offer_belongs_to_type()
    {
        $type = OfferType::factory()->create();
        $offer = Offer::factory()->create(['type_uuid' => $type->uuid]);

        $this->assertInstanceOf(OfferType::class, $offer->type);
        $this->assertEquals($type->uuid, $offer->type->uuid);
    }

    #[Test]
    public function offer_belongs_to_order_type()
    {
        $orderType = OfferOrderType::factory()->create();
        $offer = Offer::factory()->create(['order_type_uuid' => $orderType->uuid]);

        $this->assertInstanceOf(OfferOrderType::class, $offer->orderType);
        $this->assertEquals($orderType->uuid, $offer->orderType->uuid);
    }

    #[Test]
    public function offer_belongs_to_type_order_alias()
    {
        $orderType = OfferTypeOrder::create([
            'name' => 'Test Type Order',
            'removed' => false,
        ]);
        $offer = Offer::factory()->create(['order_type_uuid' => $orderType->uuid]);

        // Verify that typeOrder() works too (alias)
        $this->assertInstanceOf(OfferTypeOrder::class, $offer->typeOrder);
        $this->assertEquals($orderType->uuid, $offer->typeOrder->uuid);
    }

    #[Test]
    public function offer_belongs_to_las_family()
    {
        $lasFamily = OfferLasFamily::factory()->create();
        $offer = Offer::factory()->create(['lasfamily_uuid' => $lasFamily->uuid]);

        $this->assertInstanceOf(OfferLasFamily::class, $offer->lasFamily);
        $this->assertEquals($lasFamily->uuid, $offer->lasFamily->uuid);
    }

    #[Test]
    public function offer_belongs_to_las_work_line()
    {
        $lasWorkLine = OfferLasWorkLine::create([
            'code' => 'LWL-TEST',
            'name' => 'Test Work Line',
            'removed' => false,
        ]);
        $offer = Offer::factory()->create(['lasworkline_uuid' => $lasWorkLine->uuid]);

        $this->assertInstanceOf(OfferLasWorkLine::class, $offer->lasWorkLine);
        $this->assertEquals($lasWorkLine->uuid, $offer->lasWorkLine->uuid);
    }

    #[Test]
    public function offer_belongs_to_ls_resource()
    {
        $lsResource = OfferLsResource::create([
            'code' => 'LSR-TEST',
            'name' => 'Test Resource',
            'removed' => false,
        ]);
        $offer = Offer::factory()->create(['lsresource_uuid' => $lsResource->uuid]);

        $this->assertInstanceOf(OfferLsResource::class, $offer->lsResource);
        $this->assertEquals($lsResource->uuid, $offer->lsResource->uuid);
    }

    #[Test]
    public function offer_has_many_operation_lists()
    {
        $offer = Offer::factory()->create();
        $operation = OfferOperation::factory()->create();

        $operationList1 = OfferOperationList::factory()->create([
            'offer_uuid' => $offer->uuid,
            'offeroperation_uuid' => $operation->uuid,
        ]);
        $operationList2 = OfferOperationList::factory()->create([
            'offer_uuid' => $offer->uuid,
            'offeroperation_uuid' => $operation->uuid,
        ]);

        $this->assertCount(2, $offer->operationList);
        $this->assertInstanceOf(OfferOperationList::class, $offer->operationList->first());
    }

    #[Test]
    public function offer_has_many_operation_lists_alias()
    {
        $offer = Offer::factory()->create();
        $operation = OfferOperation::factory()->create();

        OfferOperationList::factory()->create([
            'offer_uuid' => $offer->uuid,
            'offeroperation_uuid' => $operation->uuid,
        ]);

        // Verify that operationLists() works too (alias)
        $this->assertCount(1, $offer->operationLists);
        $this->assertInstanceOf(OfferOperationList::class, $offer->operationLists->first());
    }

    #[Test]
    public function offer_operation_has_many_operation_lists()
    {
        $offer = Offer::factory()->create();
        $operation = OfferOperation::factory()->create();

        $operationList1 = OfferOperationList::factory()->create([
            'offer_uuid' => $offer->uuid,
            'offeroperation_uuid' => $operation->uuid,
        ]);
        $operationList2 = OfferOperationList::factory()->create([
            'offer_uuid' => $offer->uuid,
            'offeroperation_uuid' => $operation->uuid,
        ]);

        $this->assertCount(2, $operation->operationLists);
        $this->assertInstanceOf(OfferOperationList::class, $operation->operationLists->first());
    }
}
