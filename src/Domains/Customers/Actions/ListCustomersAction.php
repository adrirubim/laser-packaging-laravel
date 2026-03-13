<?php

declare(strict_types=1);

namespace Domain\Customers\Actions;

use App\Models\Customer;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class ListCustomersAction
{
    /**
     * @param  array<string, mixed>  $filters
     */
    public function execute(array $filters): LengthAwarePaginator
    {
        $query = Customer::active();

        $search = $filters['search'] ?? null;
        if (is_string($search) && $search !== '') {
            $query->where(function ($q) use ($search) {
                $q->where('code', 'like', "%{$search}%")
                    ->orWhere('company_name', 'like', "%{$search}%")
                    ->orWhere('vat_number', 'like', "%{$search}%");
            });
        }

        $province = $filters['province'] ?? null;
        if (is_string($province) && $province !== '') {
            $query->where('province', $province);
        }

        $sortByRaw = is_string($filters['sort_by'] ?? null)
            ? $filters['sort_by']
            : (is_string($filters['sort'] ?? null) ? $filters['sort'] : 'company_name');

        $sortOrderRaw = is_string($filters['sort_order'] ?? null)
            ? $filters['sort_order']
            : (is_string($filters['direction'] ?? null) ? $filters['direction'] : 'asc');

        $allowedSorts = ['code', 'company_name', 'city', 'province'];
        $sortBy = in_array($sortByRaw, $allowedSorts, true) ? $sortByRaw : 'company_name';

        $sortOrder = $sortOrderRaw === 'desc' ? 'desc' : 'asc';

        $perPage = isset($filters['per_page']) ? (int) $filters['per_page'] : 15;

        return $query->orderBy($sortBy, $sortOrder)->paginate($perPage);
    }
}
