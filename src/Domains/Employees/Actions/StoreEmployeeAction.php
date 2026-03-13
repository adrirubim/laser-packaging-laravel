<?php

declare(strict_types=1);

namespace Domain\Employees\Actions;

use App\Models\Employee;

class StoreEmployeeAction
{
    /**
     * @param  array<string, mixed>  $data
     */
    public function execute(array $data): Employee
    {
        $payload = $data;

        if (isset($payload['password']) && $payload['password'] !== '') {
            $payload['password'] = hash('sha512', (string) $payload['password']);
        }

        $payload['portal_enabled'] = $payload['portal_enabled'] ?? false;

        /** @var Employee $employee */
        $employee = Employee::query()->create($payload);

        return $employee;
    }
}
