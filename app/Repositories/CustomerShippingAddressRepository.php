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

        // Ricerca (Via, città, CAP, C/O, contatti e Divisione Cliente) in un solo AND
        // affinché il filtro customerdivision_uuid sia sempre rispettato
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

        // Verificare che la colonna di ordinamento sia valida
        $allowedSorts = ['street', 'city', 'postal_code', 'province'];
        if (! in_array($sortColumn, $allowedSorts)) {
            $sortColumn = 'street';
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
