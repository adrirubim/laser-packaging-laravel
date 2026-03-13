<?php

declare(strict_types=1);

namespace Domain\Suppliers\Actions;

use App\Models\Supplier;

class CreateSupplierAction
{
    /**
     * @param  array<string, mixed>  $data
     */
    public function execute(array $data): Supplier
    {
        if (! array_key_exists('removed', $data)) {
            $data['removed'] = false;
        }

        return Supplier::create($data);
    }
}
