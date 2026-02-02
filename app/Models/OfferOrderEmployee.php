<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class OfferOrderEmployee extends Model
{
    use HasUuids, \Illuminate\Database\Eloquent\Factories\HasFactory;

    /**
     * Create a new factory instance for the model.
     */
    protected static function newFactory()
    {
        return \Database\Factories\OfferOrderEmployeeFactory::new();
    }

    protected $table = 'offerorderemployee';

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
        'order_uuid',
        'employee_uuid',
        'removed',
    ];

    protected $casts = [
        'removed' => 'boolean',
    ];

    /**
     * Scope a query to only include active (non-removed) assignments.
     */
    public function scopeActive($query)
    {
        return $query->where('removed', false);
    }

    /**
     * Get the order for this assignment.
     */
    public function order()
    {
        return $this->belongsTo(Order::class, 'order_uuid', 'uuid');
    }

    /**
     * Get the employee for this assignment.
     */
    public function employee()
    {
        return $this->belongsTo(Employee::class, 'employee_uuid', 'uuid');
    }
}
