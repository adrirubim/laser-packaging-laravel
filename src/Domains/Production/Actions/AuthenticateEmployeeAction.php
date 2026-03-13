<?php

declare(strict_types=1);

namespace Domain\Production\Actions;

use App\Models\Employee;
use App\Models\EmployeePortalToken;
use App\Models\Order;
use Illuminate\Support\Str;

class AuthenticateEmployeeAction
{
    /**
     * Autentica un empleado y un pedido a partir de los códigos EAN.
     *
     * @return array{
     *     success: bool,
     *     status: int,
     *     message: string|null,
     *     data: array<string, mixed>|null
     * }
     */
    public function execute(string $rawEmployeeNumber, string $rawOrderNumber): array
    {
        // Strip leading zeros from both EANs (comportamiento legacy)
        $employeeNumber = ltrim($rawEmployeeNumber, '0');
        $orderNumber = ltrim($rawOrderNumber, '0');

        // Find employee by ID
        $employee = Employee::where('id', $employeeNumber)
            ->where('removed', false)
            ->where('portal_enabled', true)
            ->first();

        if ($employee === null) {
            return [
                'success' => false,
                'status' => 404,
                'message' => __('production_portal.employee_not_found'),
                'data' => null,
            ];
        }

        // Find order by ID
        $order = Order::where('id', $orderNumber)
            ->where('removed', false)
            ->first();

        if ($order === null) {
            return [
                'success' => false,
                'status' => 404,
                'message' => __('planning.replan.order_not_found'),
                'data' => null,
            ];
        }

        // Verify: order must be in status 2 o 3 (LANCIATO o IN_AVANZAMENTO)
        if (
            $order->status !== Order::STATUS_LANCIATO
            && $order->status !== Order::STATUS_IN_AVANZAMENTO
        ) {
            return [
                'success' => false,
                'status' => 400,
                'message' => __('production_portal.order_invalid_status'),
                'data' => null,
            ];
        }

        // Generate temporary token (base64 encoded)
        $token = base64_encode(Str::random(32).'|'.time());

        // Save token in employeeportaltoken
        EmployeePortalToken::create([
            'employee_uuid' => $employee->uuid,
            'token' => $token,
        ]);

        return [
            'success' => true,
            'status' => 200,
            'message' => null,
            'data' => [
                'order_uuid' => $order->uuid,
                'autocontrollo' => $order->autocontrollo ? 1 : 0,
                'employee' => [
                    'uuid' => $employee->uuid,
                    'name' => $employee->name,
                    'surname' => $employee->surname,
                    'matriculation_number' => $employee->matriculation_number,
                    'token' => $token,
                ],
            ],
        ];
    }
}
