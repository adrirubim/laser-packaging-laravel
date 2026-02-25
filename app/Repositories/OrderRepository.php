<?php

namespace App\Repositories;

use App\Enums\OrderStatus;
use App\Models\Article;
use App\Models\Customer;
use App\Models\CustomerShippingAddress;
use App\Models\Order;
use App\Repositories\Concerns\HasCommonQueries;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;

class OrderRepository
{
    use HasCommonQueries;

    /**
     * Get paginated orders for index page with filters and search.
     */
    public function getForIndex(Request $request): LengthAwarePaginator
    {
        $query = Order::active()->with(['article', 'shippingAddress.customerDivision.customer']);

        // Filters
        $this->applyFilter($query, $request, 'article_uuid');

        // Status filter
        if ($request->has('status') && $request->filled('status')) {
            $status = $request->get('status');
            // If status is 'completed', include both EVASO (5) and SALDATO (6)
            if ($status === 'completed' || $status === '5,6') {
                $query->whereIn('status', [Order::STATUS_EVASO, Order::STATUS_SALDATO]);
            } elseif (str_contains($status, ',')) {
                // Multiple states (e.g. 0,1,2,3,4 = active only, excluded Evaso/Saldato)
                $ids = array_map('intval', array_filter(explode(',', $status), 'is_numeric'));
                if (count($ids) > 0) {
                    $query->whereIn('status', $ids);
                }
            } else {
                $statusValue = is_numeric($status) ? (int) $status : null;
                if ($statusValue !== null) {
                    $query->where('status', $statusValue);
                }
            }
        }

        // Customer filter
        if ($request->has('customer_uuid') && $request->filled('customer_uuid')) {
            $customerUuid = $request->get('customer_uuid');
            $query->whereHas('shippingAddress.customerDivision', function ($q) use ($customerUuid) {
                $q->where('customer_uuid', $customerUuid);
            });
        }

        // Date range filter (delivery_requested_date) — read from query string (GET)
        $dateFrom = $request->query('date_from');
        if ($dateFrom !== null && $dateFrom !== '') {
            $query->whereDate('delivery_requested_date', '>=', $dateFrom);
        }
        $dateTo = $request->query('date_to');
        if ($dateTo !== null && $dateTo !== '') {
            $query->whereDate('delivery_requested_date', '<=', $dateTo);
        }

        // Minimum quantity filter
        if ($request->has('min_quantity') && $request->filled('min_quantity')) {
            $minQuantity = $request->get('min_quantity');
            if (is_numeric($minQuantity)) {
                $query->where('quantity', '>=', (float) $minQuantity);
            }
        }

        // Maximum quantity filter
        if ($request->has('max_quantity') && $request->filled('max_quantity')) {
            $maxQuantity = $request->get('max_quantity');
            if (is_numeric($maxQuantity)) {
                $query->where('quantity', '<=', (float) $maxQuantity);
            }
        }

        // Autocontrollo filter
        if ($request->has('autocontrollo') && $request->filled('autocontrollo')) {
            $autocontrollo = $request->get('autocontrollo');
            if ($autocontrollo === 'false' || $autocontrollo === '0') {
                $query->where('autocontrollo', false);
            } elseif ($autocontrollo === 'true' || $autocontrollo === '1') {
                $query->where('autocontrollo', true);
            }
        }

        // Search: production number, customer ref and article (code/description) in single AND so status filter is respected
        if ($request->filled('search')) {
            $search = $request->get('search');
            $query->where(function ($q) use ($search) {
                $q->where('order_production_number', 'like', "%{$search}%")
                    ->orWhere('number_customer_reference_order', 'like', "%{$search}%")
                    ->orWhereHas('article', function ($sub) use ($search) {
                        $sub->where('cod_article_las', 'like', "%{$search}%")
                            ->orWhere('article_descr', 'like', "%{$search}%");
                    });
            });
        }

        // Ordinamento
        $sortBy = $request->get('sort_by', 'order_production_number');
        $sortOrder = $request->get('sort_order', 'desc');

        // Verify sortable columns
        $allowedSortColumns = [
            'order_production_number',
            'delivery_requested_date',
            'quantity',
            'status',
            'id',
        ];

        if (in_array($sortBy, $allowedSortColumns)) {
            $query->orderBy($sortBy, $sortOrder === 'asc' ? 'asc' : 'desc');
        } else {
            $query->orderBy('order_production_number', 'desc');
        }

        $paginator = $this->applyPagination($query, $request);

        return $paginator->withQueryString();
    }

    /**
     * Get orders for production advancements page.
     */
    public function getForProductionAdvancements(Request $request): LengthAwarePaginator
    {
        $query = Order::active()
            ->whereIn('status', [OrderStatus::LANCIATO->value, OrderStatus::IN_AVANZAMENTO->value])
            ->with(['article', 'shippingAddress']);

        // Filtri
        $this->applyFilter($query, $request, 'article_uuid');

        // Search
        $this->applySearch($query, $request, [
            'order_production_number',
            'number_customer_reference_order',
        ]);

        // Ordinamento
        $sortBy = $request->get('sort_by', 'order_production_number');
        $sortOrder = $request->get('sort_order', 'desc');

        $allowedSorts = ['order_production_number', 'quantity', 'status'];
        if (in_array($sortBy, $allowedSorts)) {
            $query->orderBy($sortBy, $sortOrder);
        } else {
            $query->orderBy('order_production_number', 'desc');
        }

        return $this->applyPagination($query, $request, 10);
    }

    /**
     * Get form options for order forms (create/edit).
     * This method centralizes all the options needed for order forms.
     * Results are cached for 15 minutes to improve performance.
     *
     * @param  bool  $onlyWithOrders  Se true, restituisce solo articoli che hanno ordini (utile per filtri)
     * @param  array|null  $statusFilter  Se fornito, filtra ordini per questi stati (es: [2, 3] per Lanciato e In Avanzamento)
     */
    public function getFormOptions(bool $onlyWithOrders = false, ?array $statusFilter = null): array
    {
        $cacheKey = $onlyWithOrders
            ? ($statusFilter ? 'order_form_options_filter_'.implode('_', $statusFilter) : 'order_form_options_filter')
            : 'order_form_options';

        return Cache::remember($cacheKey, 900, function () use ($onlyWithOrders, $statusFilter) {
            $query = Article::active()->with('offer');

            // If we want only articles with orders (for filters)
            if ($onlyWithOrders) {
                $ordersQuery = Order::active();

                // If there is status filter, apply it
                if ($statusFilter !== null && ! empty($statusFilter)) {
                    $ordersQuery->whereIn('status', $statusFilter);
                }

                $articlesWithOrders = $ordersQuery
                    ->distinct()
                    ->pluck('article_uuid')
                    ->filter()
                    ->toArray();

                if (! empty($articlesWithOrders)) {
                    $query->whereIn('uuid', $articlesWithOrders);
                }
            }

            // Get customers with active orders (always, regardless of onlyWithOrders)
            $customerUuids = Order::active()
                ->whereHas('shippingAddress.customerDivision.customer')
                ->with('shippingAddress.customerDivision.customer')
                ->get()
                ->pluck('shippingAddress.customerDivision.customer.uuid')
                ->filter()
                ->unique()
                ->values()
                ->toArray();

            $customers = collect([]);
            if (! empty($customerUuids)) {
                $customers = Customer::whereIn('uuid', $customerUuids)
                    ->where('removed', false)
                    ->orderBy('code')
                    ->get(['uuid', 'code', 'company_name'])
                    ->map(function ($customer) {
                        return [
                            'uuid' => $customer->uuid,
                            'code' => $customer->code ?? '',
                            'name' => $customer->company_name ?? '',
                        ];
                    });
            }

            $articlesResult = $query
                ->orderBy('cod_article_las')
                ->get(['uuid', 'cod_article_las', 'article_descr', 'offer_uuid']);

            return [
                'articles' => $articlesResult,
                'customers' => $customers,
            ];
        });
    }

    /**
     * Get shipping addresses for a specific article.
     * This method retrieves shipping addresses based on the article's offer's customer division.
     * Results are cached for 15 minutes per article to improve performance.
     */
    public function getShippingAddressesForArticle(?string $articleUuid): Collection
    {
        if (! $articleUuid) {
            return collect([]);
        }

        $cacheKey = "order_shipping_addresses_{$articleUuid}";

        return Cache::remember($cacheKey, 900, function () use ($articleUuid) {
            $article = Article::where('uuid', $articleUuid)
                ->where('removed', false)
                ->with('offer.customerDivision')
                ->first();

            if (! $article || ! $article->offer || ! $article->offer->customerDivision) {
                return collect([]);
            }

            return CustomerShippingAddress::where(
                'customerdivision_uuid',
                $article->offer->customerDivision->uuid
            )
                ->where('removed', false)
                ->orderBy('street')
                ->get(['uuid', 'street', 'city', 'postal_code']);
        });
    }

    /**
     * Get article with relationships for order forms.
     */
    public function getArticleForForm(?string $articleUuid): ?Article
    {
        if (! $articleUuid) {
            return null;
        }

        return Article::where('uuid', $articleUuid)
            ->where('removed', false)
            ->with([
                'offer.customerDivision',
                'palletSheet',
                'materials' => function ($query) {
                    $query->select('materials.uuid', 'materials.cod', 'materials.description')
                        ->where('articlematerials.removed', false);
                },
            ])
            ->first();
    }

    /**
     * Clear the cache for order form options.
     * This should be called when articles or orders are updated.
     */
    public function clearFormOptionsCache(): void
    {
        Cache::forget('order_form_options');
        Cache::forget('order_form_options_filter');
        // Note: Variants with statusFilter are cleared automatically after 15 minutes
        // In production with Redis/Memcached, cache tags would be more efficient to invalidate all variants
    }

    /**
     * Clear the cache for shipping addresses of a specific article.
     * This should be called when shipping addresses or customer divisions are updated.
     *
     * Note: When called without articleUuid, this method does not clear all shipping address caches
     * because we don't have a way to enumerate all cached article UUIDs without cache tags.
     * In production, consider using cache tags (Redis/Memcached) for more efficient invalidation.
     * For now, the cache will expire naturally after 15 minutes.
     */
    public function clearShippingAddressesCache(?string $articleUuid = null): void
    {
        if ($articleUuid) {
            Cache::forget("order_shipping_addresses_{$articleUuid}");
        }
        // When called without articleUuid, we cannot efficiently clear all related caches
        // without cache tags. The cache will expire naturally after 15 minutes.
        // In production with Redis/Memcached, you could use:
        // Cache::tags(['order_shipping_addresses'])->flush();
    }
}
