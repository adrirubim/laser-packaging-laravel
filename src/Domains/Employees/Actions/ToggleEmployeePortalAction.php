<?php

declare(strict_types=1);

namespace Domain\Employees\Actions;

use App\Models\Employee;

class ToggleEmployeePortalAction
{
    /**
     * @return array<string, mixed>
     */
    public function execute(Employee $employee): array
    {
        $employee->update([
            'portal_enabled' => ! $employee->portal_enabled,
        ]);

        return [
            'employee_uuid' => $employee->uuid,
            'portal_enabled' => $employee->portal_enabled,
        ];
    }
}
