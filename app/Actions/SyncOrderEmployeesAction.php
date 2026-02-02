<?php

namespace App\Actions;

use App\Models\OfferOrderEmployee;
use Illuminate\Support\Facades\DB;

class SyncOrderEmployeesAction
{
    /**
     * Execute the action to sync employee assignments for an order.
     *
     * @param  string  $orderUuid  Order UUID
     * @param  array  $employeeUuids  Array of employee UUIDs to assign
     */
    public function execute(string $orderUuid, array $employeeUuids): void
    {
        DB::transaction(function () use ($orderUuid, $employeeUuids) {
            // Get existing assignments
            $existingAssignments = OfferOrderEmployee::where('order_uuid', $orderUuid)
                ->where('removed', false)
                ->get();

            // Remove assignments that are not in the new list
            foreach ($existingAssignments as $assignment) {
                if (! in_array($assignment->employee_uuid, $employeeUuids)) {
                    $assignment->update(['removed' => true]);
                }
            }

            // Add new assignments
            $existingEmployeeUuids = $existingAssignments->pluck('employee_uuid')->toArray();
            foreach ($employeeUuids as $employeeUuid) {
                if (! in_array($employeeUuid, $existingEmployeeUuids)) {
                    OfferOrderEmployee::create([
                        'order_uuid' => $orderUuid,
                        'employee_uuid' => $employeeUuid,
                        'removed' => false,
                    ]);
                }
            }
        });
    }
}
