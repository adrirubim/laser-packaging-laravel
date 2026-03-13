<?php

declare(strict_types=1);

namespace Domain\Customers\Actions;

use App\Models\Customer;

class SoftDeleteCustomerAction
{
    public function __construct() {}

    public function execute(Customer $customer): SoftDeleteCustomerResult
    {
        if ($customer->divisions()->where('removed', false)->exists()) {
            return new SoftDeleteCustomerResult(
                false,
                (string) __('flash.cannot_delete_customer_divisions'),
            );
        }

        if ($customer->offers()->where('removed', false)->exists()) {
            return new SoftDeleteCustomerResult(
                false,
                (string) __('flash.cannot_delete_customer_offers'),
            );
        }

        $customer->update(['removed' => true]);

        return new SoftDeleteCustomerResult(true, null);
    }
}

final class SoftDeleteCustomerResult
{
    public function __construct(
        public readonly bool $canDelete,
        public readonly ?string $message,
    ) {}
}
