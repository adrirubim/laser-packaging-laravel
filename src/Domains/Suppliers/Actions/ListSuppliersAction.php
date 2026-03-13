<?php

declare(strict_types=1);

namespace Domain\Suppliers\Actions;

use App\Models\Supplier;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class ListSuppliersAction
{
    /**
     * @param  array<string, mixed>  $filters
     */
    public function execute(array $filters): LengthAwarePaginator
    {
        $query = Supplier::active();

        $search = $filters['search'] ?? null;
        if (is_string($search) && $search !== '') {
            $query->where(function ($q) use ($search) {
                $q->where('code', 'like', "%{$search}%")
                    ->orWhere('company_name', 'like', "%{$search}%")
                    ->orWhere('vat_number', 'like', "%{$search}%");
            });
        }

        $sortByRaw = is_string($filters['sort_by'] ?? null) ? $filters['sort_by'] : 'company_name';
        $sortOrderRaw = is_string($filters['sort_order'] ?? null) ? $filters['sort_order'] : 'asc';

        $allowedSorts = ['code', 'company_name', 'vat_number', 'city', 'province', 'country'];
        $sortBy = in_array($sortByRaw, $allowedSorts, true) ? $sortByRaw : 'company_name';
        $sortOrder = $sortOrderRaw === 'desc' ? 'desc' : 'asc';

        $query->orderBy($sortBy, $sortOrder);

        $perPage = isset($filters['per_page']) ? (int) $filters['per_page'] : 15;

        return $query->paginate($perPage);
    }
}
