<?php

namespace App\Repositories\Concerns;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;

trait HasCommonQueries
{
    /**
     * Apply common search filter to query.
     *
     * @param  array  $searchFields  Fields to search in
     */
    protected function applySearch(Builder $query, Request $request, array $searchFields): Builder
    {
        if (! $request->filled('search')) {
            return $query;
        }

        $search = $request->get('search');

        return $query->where(function ($q) use ($search, $searchFields) {
            foreach ($searchFields as $index => $field) {
                if ($index === 0) {
                    $q->where($field, 'like', "%{$search}%");
                } else {
                    $q->orWhere($field, 'like', "%{$search}%");
                }
            }
        });
    }

    /**
     * Apply common pagination to query.
     *
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    protected function applyPagination(Builder $query, Request $request, int $defaultPerPage = 15)
    {
        return $query->paginate($request->get('per_page', $defaultPerPage));
    }

    /**
     * Apply common filter for a specific field.
     *
     * @param  string|null  $requestKey  Optional request key (defaults to fieldName)
     */
    protected function applyFilter(Builder $query, Request $request, string $fieldName, ?string $requestKey = null): Builder
    {
        $key = $requestKey ?? $fieldName;

        if ($request->filled($key)) {
            $query->where($fieldName, $request->get($key));
        }

        return $query;
    }
}
