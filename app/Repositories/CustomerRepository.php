<?php

namespace App\Repositories;

use App\Models\Customer;
use App\Repositories\Concerns\HasCommonQueries;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class CustomerRepository
{
    use HasCommonQueries;

    /**
     * Get paginated customers for index page with filters, search, and sorting.
     */
    public function getForIndex(Request $request): LengthAwarePaginator
    {
        $query = Customer::active();

        // Ricerca
        $this->applySearch($query, $request, [
            'code',
            'company_name',
            'vat_number',
        ]);

        // Filter by province
        $this->applyFilter($query, $request, 'province');

        // Ordinamento (unificato: sort_by/sort_order)
        $sortColumn = $request->get('sort_by', $request->get('sort', 'company_name')); // Compatibilidad con sort antiguo
        $sortDirection = $request->get('sort_order', $request->get('direction', 'asc')); // Compatibilidad con direction antiguo

        // Verify that sort column is valid
        $allowedSorts = ['code', 'company_name', 'city', 'province'];
        if (! in_array($sortColumn, $allowedSorts)) {
            $sortColumn = 'company_name';
        }

        return $this->applyPagination(
            $query->orderBy($sortColumn, $sortDirection),
            $request
        );
    }

    /**
     * Get customers for select dropdowns (with cache).
     */
    public function getForSelect(): Collection
    {
        return \Illuminate\Support\Facades\Cache::remember('customers_for_select', 900, function () {
            return Customer::active()
                ->orderBy('company_name')
                ->get(['uuid', 'code', 'company_name']);
        });
    }

    /**
     * Clear cache for customers.
     */
    public function clearCache(): void
    {
        \Illuminate\Support\Facades\Cache::forget('customers_for_select');
    }

    /**
     * Get unique provinces for filtering.
     */
    public function getProvinces(): array
    {
        return Customer::active()
            ->whereNotNull('province')
            ->where('province', '!=', '')
            ->distinct()
            ->orderBy('province')
            ->pluck('province')
            ->toArray();
    }
}
