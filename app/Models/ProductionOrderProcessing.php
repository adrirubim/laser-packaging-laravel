<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class ProductionOrderProcessing extends Model
{
    use HasUuids, \Illuminate\Database\Eloquent\Factories\HasFactory;

    /**
     * Create a new factory instance for the model.
     */
    protected static function newFactory()
    {
        return \Database\Factories\ProductionOrderProcessingFactory::new();
    }

    protected $table = 'productionorderprocessing';

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
        'order_uuid',
        'quantity',
        'processed_datetime',
        'removed',
    ];

    protected $casts = [
        'quantity' => 'decimal:2',
        'processed_datetime' => 'datetime',
        'removed' => 'boolean',
    ];

    /**
     * Scope a query to only include active (non-removed) processings.
     */
    public function scopeActive($query)
    {
        return $query->where('removed', false);
    }

    /**
     * Get the employee for this processing.
     */
    public function employee()
    {
        return $this->belongsTo(Employee::class, 'employee_uuid', 'uuid');
    }

    /**
     * Get the route key for the model.
     */
    public function getRouteKeyName()
    {
        return 'uuid';
    }

    /**
     * Get the order for this processing.
     */
    public function order()
    {
        return $this->belongsTo(Order::class, 'order_uuid', 'uuid');
    }

    /**
     * Load processed quantity for an order.
     */
    public static function loadProcessedQuantity(string $orderUuid): float
    {
        return static::where('order_uuid', $orderUuid)
            ->where('removed', false)
            ->sum('quantity') ?? 0;
    }
}
