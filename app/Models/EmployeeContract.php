<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EmployeeContract extends Model
{
    use HasFactory, HasUuids;

    protected static function newFactory()
    {
        return \Database\Factories\EmployeeContractFactory::new();
    }

    protected $table = 'employeecontracts';

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
        'employee_uuid',
        'supplier_uuid',
        'pay_level',
        'start_date',
        'end_date',
        'removed',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'pay_level' => 'integer',
        'removed' => 'boolean',
    ];

    /**
     * Pay level constants.
     */
    const PAY_LEVEL_0 = 0; // C3 (ex 5a)

    const PAY_LEVEL_1 = 1; // B1 (ex 5a Super)

    const PAY_LEVEL_2 = 2; // B2 (ex 6a)

    const PAY_LEVEL_3 = 3; // B3 (ex 7a)

    const PAY_LEVEL_4 = 4; // A1 (ex 8a Quadri)

    /**
     * Get pay level label.
     */
    public function getPayLevelLabelAttribute(): string
    {
        return match ($this->pay_level) {
            0 => 'C3 (ex 5a)',
            1 => 'B1 (ex 5a Super)',
            2 => 'B2 (ex 6a)',
            3 => 'B3 (ex 7a)',
            4 => 'A1 (ex 8a Quadri)',
            default => 'N/D',
        };
    }

    /**
     * Scope a query to only include active (non-removed) contracts.
     */
    public function scopeActive($query)
    {
        return $query->where('removed', false);
    }

    /**
     * Get the employee for this contract.
     */
    public function employee()
    {
        return $this->belongsTo(Employee::class, 'employee_uuid', 'uuid');
    }

    /**
     * Get the supplier for this contract.
     */
    public function supplier()
    {
        return $this->belongsTo(Supplier::class, 'supplier_uuid', 'uuid');
    }
}
