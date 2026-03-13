<?php

declare(strict_types=1);

namespace Domain\Articles\Actions;

use App\Models\ArticleIO;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class ListArticleIOAction
{
    /**
     * @param  array<string, mixed>  $filters
     */
    public function execute(array $filters): LengthAwarePaginator
    {
        $query = ArticleIO::query()->active();

        $search = $filters['search'] ?? null;
        if (is_string($search) && $search !== '') {
            $query->where(function ($q) use ($search) {
                $q->where('code', 'like', "%{$search}%")
                    ->orWhere('number', 'like', "%{$search}%")
                    ->orWhere('filename', 'like', "%{$search}%");
            });
        }

        $sortBy = is_string($filters['sort_by'] ?? null) ? $filters['sort_by'] : 'code';
        $sortOrder = is_string($filters['sort_order'] ?? null) ? $filters['sort_order'] : 'asc';

        $allowedSorts = ['code', 'number', 'filename'];
        if (in_array($sortBy, $allowedSorts, true)) {
            $query->orderBy($sortBy, $sortOrder);
        } else {
            $query->orderBy('code', 'asc');
        }

        $perPage = (int) ($filters['per_page'] ?? 15);

        return $query->paginate($perPage);
    }
}
