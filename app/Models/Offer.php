<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Offer extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    /**
     * Create a new factory instance for the model.
     */
    protected static function newFactory()
    {
        return \Database\Factories\OfferFactory::new();
    }

    protected $table = 'offer';

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
        'customer_uuid',
        'customerdivision_uuid',
        'activity_uuid',
        'sector_uuid',
        'seasonality_uuid',
        'type_uuid',
        'order_type_uuid',
        'lasfamily_uuid',
        'lasworkline_uuid',
        'lsresource_uuid',
        'offer_number',
        'offer_date',
        'validity_date',
        'customer_ref',
        'article_code_ref',
        'provisional_description',
        'unit_of_measure',
        'quantity',
        'piece',
        'declared_weight_cfz',
        'declared_weight_pz',
        'notes',
        'expected_workers',
        'expected_revenue',
        'rate_cfz',
        'rate_pz',
        'rate_rounding_cfz',
        'rate_increase_cfz',
        'materials_euro',
        'logistics_euro',
        'other_euro',
        'offer_notes',
        'ls_setup_cost',
        'ls_other_costs',
        'approval_status',
        'removed',
    ];

    protected $casts = [
        'offer_date' => 'date',
        'validity_date' => 'date',
        'quantity' => 'decimal:2',
        'declared_weight_cfz' => 'decimal:3',
        'declared_weight_pz' => 'decimal:3',
        'expected_revenue' => 'decimal:2',
        'rate_cfz' => 'decimal:4',
        'rate_pz' => 'decimal:4',
        'rate_rounding_cfz' => 'decimal:4',
        'rate_increase_cfz' => 'decimal:4',
        'materials_euro' => 'decimal:2',
        'logistics_euro' => 'decimal:2',
        'other_euro' => 'decimal:2',
        'ls_setup_cost' => 'decimal:2',
        'ls_other_costs' => 'decimal:2',
        'removed' => 'boolean',
    ];

    // Approval status constants
    const APPROVAL_STATUS_PENDING = 0;

    const APPROVAL_STATUS_APPROVED = 1;

    const APPROVAL_STATUS_REJECTED = 2;

    /**
     * Get the customer that owns the offer.
     */
    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class, 'customer_uuid', 'uuid');
    }

    /**
     * Get the customer division for the offer.
     */
    public function customerDivision(): BelongsTo
    {
        return $this->belongsTo(CustomerDivision::class, 'customerdivision_uuid', 'uuid');
    }

    /**
     * Get the articles for the offer (via pivot table).
     */
    public function articles(): BelongsToMany
    {
        return $this->belongsToMany(Article::class, 'offerarticles', 'offer_uuid', 'article_uuid', 'uuid', 'uuid')
            ->wherePivot('removed', false)
            ->withTimestamps();
    }

    /**
     * Get the articles for the offer (via direct relationship using offer_uuid).
     */
    public function articlesDirect(): HasMany
    {
        return $this->hasMany(Article::class, 'offer_uuid', 'uuid')
            ->where('removed', false);
    }

    /**
     * Get the LAS family for this offer.
     * Note: No filtramos por 'removed' porque una oferta puede tener referencias a registros eliminados.
     */
    public function lasFamily()
    {
        return $this->belongsTo(OfferLasFamily::class, 'lasfamily_uuid', 'uuid');
    }

    /**
     * Get the LAS work line for this offer.
     * Note: No filtramos por 'removed' porque una oferta puede tener referencias a registros eliminados.
     */
    public function lasWorkLine()
    {
        return $this->belongsTo(OfferLasWorkLine::class, 'lasworkline_uuid', 'uuid');
    }

    /**
     * Get the LS resource for this offer.
     * Note: No filtramos por 'removed' porque una oferta puede tener referencias a registros eliminados.
     */
    public function lsResource()
    {
        return $this->belongsTo(OfferLsResource::class, 'lsresource_uuid', 'uuid');
    }

    /**
     * Get the type order for this offer.
     * Note: No filtramos por 'removed' porque una oferta puede tener referencias a registros eliminados.
     */
    public function typeOrder()
    {
        return $this->belongsTo(OfferTypeOrder::class, 'order_type_uuid', 'uuid');
    }

    /**
     * Get the type for this offer.
     */
    public function type()
    {
        return $this->belongsTo(OfferType::class, 'type_uuid', 'uuid');
    }

    /**
     * Get the sector for this offer.
     */
    public function sector()
    {
        return $this->belongsTo(OfferSector::class, 'sector_uuid', 'uuid');
    }

    /**
     * Get the activity for this offer.
     */
    public function activity()
    {
        return $this->belongsTo(OfferActivity::class, 'activity_uuid', 'uuid');
    }

    /**
     * Get the seasonality for this offer.
     */
    public function seasonality()
    {
        return $this->belongsTo(OfferSeasonality::class, 'seasonality_uuid', 'uuid');
    }

    /**
     * Get the operation list for this offer.
     */
    public function operationList()
    {
        return $this->hasMany(OfferOperationList::class, 'offer_uuid', 'uuid');
    }

    /**
     * Get the operation lists for this offer (alias for operationList).
     */
    public function operationLists()
    {
        return $this->hasMany(OfferOperationList::class, 'offer_uuid', 'uuid');
    }

    /**
     * Get the order type for this offer (alias for typeOrder for consistency).
     */
    public function orderType()
    {
        return $this->belongsTo(OfferOrderType::class, 'order_type_uuid', 'uuid');
    }

    /**
     * Get the approval status label.
     */
    public function getApprovalStatusLabelAttribute(): string
    {
        return match ($this->approval_status) {
            self::APPROVAL_STATUS_PENDING => 'In attesa di approvazione',
            self::APPROVAL_STATUS_APPROVED => 'Approvata',
            self::APPROVAL_STATUS_REJECTED => 'Respinta',
            default => 'N/D',
        };
    }

    /**
     * Scope a query to only include active offers.
     */
    public function scopeActive($query)
    {
        return $query->where('removed', false)->whereNull('deleted_at');
    }
}
