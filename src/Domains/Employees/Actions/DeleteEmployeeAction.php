<?php

declare(strict_types=1);

namespace Domain\Employees\Actions;

use App\Models\Employee;

class DeleteEmployeeAction
{
    public function execute(Employee $employee): void
    {
        $employee->update(['removed' => true]);
    }
}
