<?php

declare(strict_types=1);

namespace Domain\Suppliers\Actions;

use App\Models\Supplier;

class UpdateSupplierAction
{
    /**
     * @param  array<string, mixed>  $data
     */
    public function execute(Supplier $supplier, array $data): Supplier
    {
        $supplier->update($data);

        return $supplier;
    }
}
