<?php

declare(strict_types=1);

namespace Domain\Employees\Actions;

use App\Models\Employee;

class UpdateEmployeeAction
{
    /**
     * @param  array<string, mixed>  $data
     */
    public function execute(Employee $employee, array $data): Employee
    {
        $payload = $data;

        if (isset($payload['password']) && $payload['password'] !== '') {
            $payload['password'] = hash('sha512', (string) $payload['password']);
        } else {
            unset($payload['password']);
        }

        $employee->update($payload);

        return $employee->refresh();
    }
}
