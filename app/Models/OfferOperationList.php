<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OfferOperationList extends Model
{
    use HasFactory, HasUuids;

    /**
     * Get the route key for the model.
     */
    public function getRouteKeyName()
    {
        return 'uuid';
    }

    /**
     * Create a new factory instance for the model.
     */
    protected static function newFactory()
    {
        return \Database\Factories\OfferOperationListFactory::new();
    }

    protected $table = 'offeroperationlist';

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
        'offer_uuid',
        'offeroperation_uuid',
        'num_op',
        'removed',
    ];

    protected $casts = [
        'num_op' => 'decimal:5',
        'removed' => 'boolean',
    ];

    /**
     * Scope a query to only include active (non-removed) operation lists.
     */
    public function scopeActive($query)
    {
        return $query->where('removed', false);
    }

    /**
     * Get the offer that owns this operation list.
     */
    public function offer()
    {
        return $this->belongsTo(Offer::class, 'offer_uuid', 'uuid');
    }

    /**
     * Get the operation for this list item.
     */
    public function operation()
    {
        return $this->belongsTo(OfferOperation::class, 'offeroperation_uuid', 'uuid');
    }
}
