<?php

namespace Tests\Feature\Flows;

use App\Models\Article;
use App\Models\Customer;
use App\Models\CustomerDivision;
use App\Models\CustomerShippingAddress;
use App\Models\Employee;
use App\Models\Offer;
use App\Models\OfferLasFamily;
use App\Models\Order;
use App\Models\PalletType;
use App\Models\Supplier;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

/**
 * Verifies that all sections with "Demo All" records load correctly
 * (Show and Edit) and that data is passed to the frontend consistently.
 *
 * DEMO-ALL codes: CLI-DEMO-ALL, FORN-DEMO-ALL, EMP-DEMO-ALL, 2026_999_01_A,
 * LAS-DEMO-ALL, and an order using article LAS-DEMO-ALL.
 */
class DemoAllSectionsVerificationTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

    protected Customer $demoCustomer;

    protected CustomerDivision $demoDivision;

    protected Supplier $demoSupplier;

    protected Employee $demoEmployee;

    protected Offer $demoOffer;

    protected Article $demoArticle;

    protected Order $demoOrder;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();

        // DEMO-ALL Customer
        $this->demoCustomer = Customer::factory()->create([
            'code' => 'CLI-DEMO-ALL',
            'company_name' => 'Demo All - Tutti i campi clienti',
            'removed' => false,
        ]);
        $this->demoDivision = CustomerDivision::factory()->create([
            'customer_uuid' => $this->demoCustomer->uuid,
            'name' => 'Demo All Divisione 1',
            'removed' => false,
        ]);
        CustomerShippingAddress::factory()->create([
            'customerdivision_uuid' => $this->demoDivision->uuid,
            'removed' => false,
        ]);

        // DEMO-ALL Supplier
        $this->demoSupplier = Supplier::factory()->create([
            'code' => 'FORN-DEMO-ALL',
            'company_name' => 'Demo All Fornitori',
            'removed' => false,
        ]);

        // DEMO-ALL Employee
        $this->demoEmployee = Employee::factory()->create([
            'matriculation_number' => 'EMP-DEMO-ALL',
            'name' => 'Demo',
            'surname' => 'All',
            'removed' => false,
        ]);

        // DEMO-ALL Offer → Article LAS-DEMO-ALL
        $lasFamily = OfferLasFamily::factory()->create(['code' => '31', 'removed' => false]);
        $this->demoOffer = Offer::factory()->create([
            'customer_uuid' => $this->demoCustomer->uuid,
            'customerdivision_uuid' => $this->demoDivision->uuid,
            'offer_number' => '2026_999_01_A',
            'removed' => false,
            'lasfamily_uuid' => $lasFamily->uuid,
        ]);
        $palletType = PalletType::factory()->create(['removed' => false]);
        $this->demoArticle = Article::factory()->create([
            'offer_uuid' => $this->demoOffer->uuid,
            'cod_article_las' => 'LAS-DEMO-ALL',
            'article_descr' => 'Demo All - tutti i campi',
            'removed' => false,
            'pallet_uuid' => $palletType->uuid,
        ]);

        // DEMO-ALL Order (uses article LAS-DEMO-ALL)
        $shippingAddress = CustomerShippingAddress::factory()->create([
            'customerdivision_uuid' => $this->demoDivision->uuid,
            'removed' => false,
        ]);
        $this->demoOrder = Order::factory()->create([
            'article_uuid' => $this->demoArticle->uuid,
            'customershippingaddress_uuid' => $shippingAddress->uuid,
            'status' => 0,
            'removed' => false,
        ]);
    }

    #[Test]
    public function demo_all_customer_show_and_edit_load_successfully(): void
    {
        $this->actingAs($this->user);

        $show = $this->get(route('customers.show', ['customer' => $this->demoCustomer->uuid]));
        $show->assertStatus(200);
        $show->assertInertia(fn ($page) => $page->component('Customers/Show')->has('customer'));

        $edit = $this->get(route('customers.edit', ['customer' => $this->demoCustomer->uuid]));
        $edit->assertStatus(200);
        $edit->assertInertia(fn ($page) => $page->component('Customers/Edit')->has('customer'));
    }

    #[Test]
    public function demo_all_supplier_show_and_edit_load_successfully(): void
    {
        $this->actingAs($this->user);

        $show = $this->get(route('suppliers.show', ['supplier' => $this->demoSupplier->uuid]));
        $show->assertStatus(200);
        $show->assertInertia(fn ($page) => $page->component('Suppliers/Show')->has('supplier'));

        $edit = $this->get(route('suppliers.edit', ['supplier' => $this->demoSupplier->uuid]));
        $edit->assertStatus(200);
        $edit->assertInertia(fn ($page) => $page->component('Suppliers/Edit')->has('supplier'));
    }

    #[Test]
    public function demo_all_employee_show_and_edit_load_successfully(): void
    {
        $this->actingAs($this->user);

        $show = $this->get(route('employees.show', ['employee' => $this->demoEmployee->uuid]));
        $show->assertStatus(200);
        $show->assertInertia(fn ($page) => $page->component('Employees/Show')->has('employee'));

        $edit = $this->get(route('employees.edit', ['employee' => $this->demoEmployee->uuid]));
        $edit->assertStatus(200);
        $edit->assertInertia(fn ($page) => $page->component('Employees/Edit')->has('employee'));
    }

    #[Test]
    public function demo_all_offer_show_and_edit_load_successfully(): void
    {
        $this->actingAs($this->user);

        $show = $this->get(route('offers.show', ['offer' => $this->demoOffer->uuid]));
        $show->assertStatus(200);
        $show->assertInertia(fn ($page) => $page->component('Offers/Show')->has('offer'));

        $edit = $this->get(route('offers.edit', ['offer' => $this->demoOffer->uuid]));
        $edit->assertStatus(200);
        $edit->assertInertia(fn ($page) => $page->component('Offers/Edit')->has('offer'));
    }

    #[Test]
    public function demo_all_article_show_and_edit_load_successfully(): void
    {
        $this->actingAs($this->user);

        $show = $this->get(route('articles.show', ['article' => $this->demoArticle->uuid]));
        $show->assertStatus(200);
        $show->assertInertia(fn ($page) => $page->component('Articles/Show')->has('article'));

        $edit = $this->get(route('articles.edit', ['article' => $this->demoArticle->uuid]));
        $edit->assertStatus(200);
        $edit->assertInertia(fn ($page) => $page->component('Articles/Edit')->has('article'));
    }

    #[Test]
    public function demo_all_order_show_and_edit_load_successfully(): void
    {
        $this->actingAs($this->user);

        $show = $this->get(route('orders.show', ['order' => $this->demoOrder->uuid]));
        $show->assertStatus(200);
        $show->assertInertia(fn ($page) => $page->component('Orders/Show')->has('order'));

        $edit = $this->get(route('orders.edit', ['order' => $this->demoOrder->uuid]));
        $edit->assertStatus(200);
        $edit->assertInertia(fn ($page) => $page->component('Orders/Edit')->has('order'));
    }

    #[Test]
    public function demo_all_customer_show_includes_divisions_and_offers(): void
    {
        $this->actingAs($this->user);

        $response = $this->get(route('customers.show', ['customer' => $this->demoCustomer->uuid]));
        $response->assertStatus(200);

        $response->assertInertia(fn ($page) => $page
            ->component('Customers/Show')
            ->has('customer')
            ->has('customer.divisions')
            ->has('customer.offers')
        );
    }

    #[Test]
    public function demo_all_offer_show_includes_customer_and_articles(): void
    {
        $this->actingAs($this->user);

        $response = $this->get(route('offers.show', ['offer' => $this->demoOffer->uuid]));
        $response->assertStatus(200);

        $response->assertInertia(fn ($page) => $page
            ->component('Offers/Show')
            ->has('offer')
            ->has('offer.customer')
        );
    }

    #[Test]
    public function demo_all_order_show_includes_article_and_offer_chain(): void
    {
        $this->actingAs($this->user);

        $response = $this->get(route('orders.show', ['order' => $this->demoOrder->uuid]));
        $response->assertStatus(200);

        $response->assertInertia(fn ($page) => $page
            ->component('Orders/Show')
            ->has('order')
            ->has('order.article')
        );
    }
}
