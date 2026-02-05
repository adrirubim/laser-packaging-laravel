<?php

namespace Tests\Unit\Actions;

use App\Actions\SyncOrderEmployeesAction;
use App\Models\Employee;
use App\Models\OfferOrderEmployee;
use App\Models\Order;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class SyncOrderEmployeesActionTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_syncs_employee_assignments_for_an_order()
    {
        $order = Order::factory()->create();
        $employeeA = Employee::factory()->create();
        $employeeB = Employee::factory()->create();
        $employeeC = Employee::factory()->create();

        // Asignación inicial: A y B
        OfferOrderEmployee::create([
            'order_uuid' => $order->uuid,
            'employee_uuid' => $employeeA->uuid,
            'removed' => false,
        ]);
        OfferOrderEmployee::create([
            'order_uuid' => $order->uuid,
            'employee_uuid' => $employeeB->uuid,
            'removed' => false,
        ]);

        /** @var SyncOrderEmployeesAction $action */
        $action = $this->app->make(SyncOrderEmployeesAction::class);

        // Nueva lista: B y C (A debe marcarse como removed, C añadirse)
        $action->execute($order->uuid, [
            $employeeB->uuid,
            $employeeC->uuid,
        ]);

        $this->assertTrue(
            OfferOrderEmployee::where('order_uuid', $order->uuid)
                ->where('employee_uuid', $employeeA->uuid)
                ->first()
                ->removed
        );

        $this->assertFalse(
            OfferOrderEmployee::where('order_uuid', $order->uuid)
                ->where('employee_uuid', $employeeB->uuid)
                ->first()
                ->removed
        );

        $this->assertFalse(
            OfferOrderEmployee::where('order_uuid', $order->uuid)
                ->where('employee_uuid', $employeeC->uuid)
                ->first()
                ->removed
        );
    }
}

