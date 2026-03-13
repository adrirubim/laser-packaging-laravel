<?php

declare(strict_types=1);

namespace Domain\Orders\Actions;

use App\Models\OfferOrderEmployee;
use Illuminate\Support\Facades\DB;

class SyncOrderEmployeesAction
{
    /**
     * @param  array<int, string>  $employeeUuids
     */
    public function execute(string $orderUuid, array $employeeUuids): void
    {
        DB::transaction(function () use ($orderUuid, $employeeUuids): void {
            $existingAssignments = OfferOrderEmployee::where('order_uuid', $orderUuid)
                ->where('removed', false)
                ->get();

            foreach ($existingAssignments as $assignment) {
                if (! in_array($assignment->employee_uuid, $employeeUuids, true)) {
                    $assignment->update(['removed' => true]);
                }
            }

            $existingEmployeeUuids = $existingAssignments->pluck('employee_uuid')->toArray();
            foreach ($employeeUuids as $employeeUuid) {
                if (! in_array($employeeUuid, $existingEmployeeUuids, true)) {
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
