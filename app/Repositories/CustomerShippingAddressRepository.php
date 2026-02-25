<?php

namespace App\Repositories;

use App\Models\CustomerDivision;
use App\Models\CustomerShippingAddress;
use App\Repositories\Concerns\HasCommonQueries;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;

class CustomerShippingAddressRepository
{
    use HasCommonQueries;

    /**
     * Get paginated addresses for index page.
     */
    public function getForIndex(Request $request): LengthAwarePaginator
    {
        $query = CustomerShippingAddress::active()
            ->with(['customerDivision.customer']);

        // Filtro per divisione
        $this->applyFilter($query, $request, 'customerdivision_uuid');

        // Search (Street, city, postal code, C/O, contacts and Customer Division).
        // Manteniamo il filtro customerdivision_uuid sempre applicato PRIMA,
        // so search does not "escape" outside selected division.
        if ($request->filled('search')) {
            $search = $request->get('search');
            $query->where(function ($q) use ($search) {
                $q->where('street', 'like', "%{$search}%")
                    ->orWhere('city', 'like', "%{$search}%")
                    ->orWhere('postal_code', 'like', "%{$search}%")
                    ->orWhere('co', 'like', "%{$search}%")
                    ->orWhere('contacts', 'like', "%{$search}%")
                    ->orWhereHas('customerDivision', function ($sub) use ($search) {
                        $sub->where('name', 'like', "%{$search}%");
                    });
            });
        }

        // Ordinamento
        $sortColumn = $request->get('sort_by', 'street');
        $sortDirection = $request->get('sort_order', 'asc');

        // Verify that sort column is valid
        $allowedSorts = ['street', 'city', 'postal_code', 'province'];
        if (! in_array($sortColumn, $allowedSorts)) {
            $sortColumn = 'street';
        }

        // Verify address
        if (! in_array($sortDirection, ['asc', 'desc'])) {
            $sortDirection = 'asc';
        }

        return $this->applyPagination(
            $query->orderBy($sortColumn, $sortDirection),
            $request
        );
    }

    /**
     * Get divisions for form (with cache).
     */
    public function getDivisionsForForm(?string $customerUuid = null): Collection
    {
        $cacheKey = $customerUuid
            ? "shipping_address_divisions_{$customerUuid}"
            : 'shipping_address_divisions_all';

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
        return $this->getDivisionsForForm($customerUuid);
    }

    /**
     * Clear cache for addresses.
     */
    public function clearCache(?string $customerUuid = null): void
    {
        if ($customerUuid) {
            Cache::forget("shipping_address_divisions_{$customerUuid}");
        }
        Cache::forget('shipping_address_divisions_all');
    }
}
