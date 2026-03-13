<?php

declare(strict_types=1);

namespace Domain\Offers\Actions;

use App\Models\CustomerDivision;

class GetDivisionsForCustomerAction
{
    /**
     * @return array<int, array{uuid: string, name: string}>
     */
    public function execute(string $customerUuid): array
    {
        $divisions = CustomerDivision::where('customer_uuid', $customerUuid)
            ->where('removed', false)
            ->orderBy('name')
            ->get(['uuid', 'name']);

        return $divisions->map(
            static fn (CustomerDivision $division) => [
                'uuid' => $division->uuid,
                'name' => $division->name,
            ],
        )->all();
    }
}
