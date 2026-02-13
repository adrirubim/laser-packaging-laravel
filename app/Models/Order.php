<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Cache;

class Order extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    /**
     * The "booted" method of the model.
     */
    protected static function booted(): void
    {
        // Clear dashboard cache when order is created, updated, or deleted
        static::created(function () {
            static::clearDashboardCache();
        });

        static::updated(function ($order) {
            // Clear cache if status changed
            if ($order->wasChanged('status') || $order->wasChanged('removed')) {
                static::clearDashboardCache();
            }
        });

        static::deleted(function () {
            static::clearDashboardCache();
        });
    }

    /**
     * Clear all dashboard-related cache
     */
    protected static function clearDashboardCache(): void
    {
        // Clear all date filter variations
        foreach (['all', 'today', 'week', 'month'] as $filter) {
            Cache::forget("dashboard_stats_{$filter}_all_all");
            Cache::forget("dashboard_top_customers_{$filter}");
            Cache::forget("dashboard_top_articles_{$filter}");
            Cache::forget("dashboard_performance_{$filter}");
        }

        // Clear urgent and recent orders cache
        Cache::forget('dashboard_urgent_orders');
        Cache::forget('dashboard_recent_orders');
    }

    /**
     * Create a new factory instance for the model.
     */
    protected static function newFactory()
    {
        return \Database\Factories\OrderFactory::new();
    }

    protected $table = 'orderorder';

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
        'article_uuid',
        'order_production_number',
        'number_customer_reference_order',
        'line',
        'quantity',
        'worked_quantity',
        'delivery_requested_date',
        'shift_mode',
        'shift_morning',
        'shift_afternoon',
        'work_saturday',
        'customershippingaddress_uuid',
        'expected_production_start_date',
        'type_lot',
        'lot',
        'expiration_date',
        'external_labels',
        'pvp_labels',
        'ingredients_labels',
        'variable_data_labels',
        'label_of_jumpers',
        'indications_for_shop',
        'indications_for_production',
        'indications_for_delivery',
        'status',
        'status_semaforo',
        'motivazione',
        'autocontrollo',
        'removed',
    ];

    protected $casts = [
        'quantity' => 'decimal:2',
        'worked_quantity' => 'decimal:2',
        'delivery_requested_date' => 'datetime',
        'expected_production_start_date' => 'datetime',
        'expiration_date' => 'datetime',
        'shift_mode' => 'integer',
        'shift_morning' => 'boolean',
        'shift_afternoon' => 'boolean',
        'work_saturday' => 'boolean',
        'status_semaforo' => 'array',
        'autocontrollo' => 'boolean',
        'removed' => 'boolean',
    ];

    // Order status constants
    const STATUS_PIANIFICATO = 0;

    const STATUS_IN_ALLESTIMENTO = 1;

    const STATUS_LANCIATO = 2;

    const STATUS_IN_AVANZAMENTO = 3;

    const STATUS_SOSPESO = 4;

    const STATUS_EVASO = 5;

    const STATUS_SALDATO = 6;

    /**
     * Get the article for the order.
     */
    public function article()
    {
        return $this->belongsTo(Article::class, 'article_uuid', 'uuid');
    }

    /**
     * Get the shipping address for the order.
     */
    public function shippingAddress()
    {
        return $this->belongsTo(CustomerShippingAddress::class, 'customershippingaddress_uuid', 'uuid');
    }

    /**
     * Get the status label.
     */
    public function getStatusLabelAttribute(): string
    {
        return match ($this->status) {
            self::STATUS_PIANIFICATO => 'Pianificato',
            self::STATUS_IN_ALLESTIMENTO => 'In Allestimento',
            self::STATUS_LANCIATO => 'Lanciato',
            self::STATUS_IN_AVANZAMENTO => 'In Avanzamento',
            self::STATUS_SOSPESO => 'Sospeso',
            self::STATUS_EVASO => 'Evaso',
            self::STATUS_SALDATO => 'Saldato',
            default => 'N/D',
        };
    }

    /**
     * Get the state for this order.
     */
    public function state()
    {
        return $this->belongsTo(OfferOrderState::class, 'status', 'id');
    }

    /**
     * Get employees assigned to this order.
     */
    public function employees()
    {
        return $this->belongsToMany(Employee::class, 'offerorderemployee', 'order_uuid', 'employee_uuid')
            ->wherePivot('removed', false)
            ->withTimestamps();
    }

    /**
     * Get processings for this order.
     */
    public function processings()
    {
        return $this->hasMany(ProductionOrderProcessing::class, 'order_uuid', 'uuid');
    }

    /**
     * Get planning rows for this order.
     */
    public function productionPlannings()
    {
        return $this->hasMany(ProductionPlanning::class, 'order_uuid', 'uuid');
    }

    /**
     * Scope a query to only include active orders.
     */
    public function scopeActive($query)
    {
        return $query->where('removed', false);
    }
}
