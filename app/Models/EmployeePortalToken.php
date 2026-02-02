<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class EmployeePortalToken extends Model
{
    use HasUuids;

    protected $table = 'employeeportaltoken';

    protected $primaryKey = 'id';

    protected $keyType = 'int';

    public $incrementing = true;

    /**
     * Get the columns that should receive a unique identifier.
     * This tells HasUuids to use 'uuid' field, not 'id'.
     */
    public function uniqueIds(): array
    {
        return ['uuid'];
    }

    protected $fillable = [
        'uuid',
        'employee_uuid',
        'token',
        'removed',
    ];

    protected $casts = [
        'removed' => 'boolean',
    ];

    /**
     * Scope a query to only include active (non-removed) tokens.
     */
    public function scopeActive($query)
    {
        return $query->where('removed', false);
    }

    /**
     * Scope a query to only include tokens not older than 6 months.
     */
    public function scopeValid($query)
    {
        $sixMonthsAgo = now()->subMonths(6);

        return $query->where('created_at', '>=', $sixMonthsAgo);
    }

    /**
     * Get the employee for this token.
     */
    public function employee()
    {
        return $this->belongsTo(Employee::class, 'employee_uuid', 'uuid');
    }
}
