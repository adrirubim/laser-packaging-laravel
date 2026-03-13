<?php

declare(strict_types=1);

namespace Domain\Employees\Actions;

use App\Models\Employee;
use App\Models\EmployeeContract;
use Illuminate\Support\Collection;

class ListEmployeeContractsAction
{
    /**
     * @return Collection<int, EmployeeContract>
     */
    public function execute(Employee $employee): Collection
    {
        return $employee->contracts()
            ->where('removed', false)
            ->orderBy('start_date', 'desc')
            ->get();
    }
}
