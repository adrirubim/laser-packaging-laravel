<?php

declare(strict_types=1);

namespace Domain\Suppliers\Actions;

use App\Models\Supplier;

class SoftDeleteSupplierAction
{
    public function execute(Supplier $supplier): void
    {
        $supplier->update(['removed' => true]);
    }
}
