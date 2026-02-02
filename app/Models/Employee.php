<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Hash;

class Employee extends Model
{
    use HasUuids, \Illuminate\Database\Eloquent\Factories\HasFactory;

    /**
     * Create a new factory instance for the model.
     */
    protected static function newFactory()
    {
        return \Database\Factories\EmployeeFactory::new();
    }

    protected $table = 'employee';

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

    /**
     * Get the route key for the model.
     */
    public function getRouteKeyName()
    {
        return 'uuid';
    }

    protected $fillable = [
        'uuid',
        'name',
        'surname',
        'matriculation_number',
        'password',
        'portal_enabled',
        'removed',
    ];

    protected $casts = [
        'portal_enabled' => 'boolean',
        'removed' => 'boolean',
    ];

    protected $hidden = [
        'password',
    ];

    /**
     * Scope a query to only include active (non-removed) employees.
     */
    public function scopeActive($query)
    {
        return $query->where('removed', false);
    }

    /**
     * Scope a query to only include portal-enabled employees.
     */
    public function scopePortalEnabled($query)
    {
        return $query->where('portal_enabled', true);
    }

    /**
     * Verify password (SHA512 hash).
     */
    public function verifyPassword(string $password): bool
    {
        return hash('sha512', $password) === $this->password;
    }

    /**
     * Get contracts for this employee.
     */
    public function contracts()
    {
        return $this->hasMany(EmployeeContract::class, 'employee_uuid', 'uuid');
    }

    /**
     * Get portal tokens for this employee.
     */
    public function portalTokens()
    {
        return $this->hasMany(EmployeePortalToken::class, 'employee_uuid', 'uuid');
    }

    /**
     * Get order processings for this employee.
     */
    public function orderProcessings()
    {
        return $this->hasMany(ProductionOrderProcessing::class, 'employee_uuid', 'uuid');
    }

    /**
     * Get orders assigned to this employee.
     */
    public function orders()
    {
        return $this->belongsToMany(Order::class, 'offerorderemployee', 'employee_uuid', 'order_uuid', 'uuid', 'uuid')
            ->wherePivot('removed', false)
            ->withTimestamps();
    }
}
