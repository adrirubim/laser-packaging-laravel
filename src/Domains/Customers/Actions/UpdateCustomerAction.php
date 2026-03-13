<?php

declare(strict_types=1);

namespace Domain\Customers\Actions;

use App\Models\Customer;

class UpdateCustomerAction
{
    /**
     * @param  array<string, mixed>  $data
     */
    public function execute(Customer $customer, array $data): Customer
    {
        $customer->update($data);

        return $customer;
    }
}
