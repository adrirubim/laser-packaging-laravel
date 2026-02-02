<?php

namespace App\Repositories;

use App\Models\CustomerDivision;
use App\Repositories\Concerns\HasCommonQueries;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;

class CustomerDivisionRepository
{
    use HasCommonQueries;

    /**
     * Get paginated divisions for index page.
     */
    public function getForIndex(Request $request): LengthAwarePaginator
    {
        $query = CustomerDivision::active()->with('customer');

        // Filtro per cliente
        $this->applyFilter($query, $request, 'customer_uuid');

        // Ricerca
        $this->applySearch($query, $request, ['name', 'code']);

        // Ordinamento
        $sortColumn = $request->get('sort_by', 'name');
        $sortDirection = $request->get('sort_order', 'asc');

        // Verificare che la colonna di ordinamento sia valida
        $allowedSorts = ['name', 'code', 'email'];
        if (! in_array($sortColumn, $allowedSorts)) {
            $sortColumn = 'name';
        }

        // Verificare indirizzo
        if (! in_array($sortDirection, ['asc', 'desc'])) {
            $sortDirection = 'asc';
        }

        return $this->applyPagination(
            $query->orderBy($sortColumn, $sortDirection),
            $request
        );
    }

    /**
     * Get divisions for select dropdowns (with cache).
     */
    public function getForSelect(?string $customerUuid = null): Collection
    {
        $cacheKey = $customerUuid
            ? "customer_divisions_for_select_{$customerUuid}"
            : 'customer_divisions_for_select_all';

        return Cache::remember($cacheKey, 900, function () use ($customerUuid) {
            $query = CustomerDivision::active()->with('customer');

            if ($customerUuid) {
                $query->where('customer_uuid', $customerUuid);
            }

            return $query->orderBy('name')
                ->get(['uuid', 'customer_uuid', 'name']);
        });
    }

    /**
     * Get divisions by customer UUID (for AJAX).
     */
    public function getByCustomerUuid(string $customerUuid): Collection
    {
        return $this->getForSelect($customerUuid);
    }

    /**
     * Clear cache for divisions.
     */
    public function clearCache(?string $customerUuid = null): void
    {
        if ($customerUuid) {
            Cache::forget("customer_divisions_for_select_{$customerUuid}");
        }
        Cache::forget('customer_divisions_for_select_all');
    }
}
