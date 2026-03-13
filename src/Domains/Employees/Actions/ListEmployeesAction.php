<?php

declare(strict_types=1);

namespace Domain\Employees\Actions;

use App\Models\Employee;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class ListEmployeesAction
{
    /**
     * @param  array<string, mixed>  $filters
     */
    public function execute(array $filters): LengthAwarePaginator
    {
        $query = Employee::query()->active();

        $portalEnabled = $filters['portal_enabled'] ?? null;
        if ($portalEnabled === '1' || $portalEnabled === 'true') {
            $query->portalEnabled();
        } elseif ($portalEnabled === '0' || $portalEnabled === 'false') {
            $query->where('portal_enabled', false);
        }

        $search = $filters['search'] ?? null;
        if (is_string($search) && $search !== '') {
            $query->where(function ($q) use ($search) {
                $q->where('matriculation_number', 'like', "%{$search}%")
                    ->orWhere('name', 'like', "%{$search}%")
                    ->orWhere('surname', 'like', "%{$search}%")
                    ->orWhereRaw("CONCAT(name, ' ', surname) LIKE ?", ["%{$search}%"]);
            });
        }

        $sortBy = is_string($filters['sort_by'] ?? null) ? $filters['sort_by'] : 'surname';
        $sortOrder = is_string($filters['sort_order'] ?? null) ? $filters['sort_order'] : 'asc';

        $allowedSortColumns = ['id', 'name', 'surname', 'matriculation_number'];
        if (in_array($sortBy, $allowedSortColumns, true)) {
            $query->orderBy($sortBy, $sortOrder);
        } else {
            $query->orderBy('surname', 'asc')->orderBy('name', 'asc');
        }

        $perPage = $filters['per_page'] ?? 10;

        return $query->paginate((int) $perPage);
    }
}
