<?php

declare(strict_types=1);

namespace Domain\Customers\Actions;

use App\Models\Customer;

class CreateCustomerAction
{
    /**
     * @param  array<string, mixed>  $data
     */
    public function execute(array $data): Customer
    {
        return Customer::create($data);
    }
}
