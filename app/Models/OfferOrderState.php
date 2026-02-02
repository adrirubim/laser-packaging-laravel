<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class OfferOrderState extends Model
{
    use HasUuids, \Illuminate\Database\Eloquent\Factories\HasFactory;

    /**
     * Create a new factory instance for the model.
     */
    protected static function newFactory()
    {
        return \Database\Factories\OfferOrderStateFactory::new();
    }

    protected $table = 'offerorderstate';

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
        'sorting',
        'initial',
        'production',
        'removed',
    ];

    protected $casts = [
        'sorting' => 'integer',
        'initial' => 'boolean',
        'production' => 'boolean',
        'removed' => 'boolean',
    ];

    /**
     * Scope a query to only include active (non-removed) states.
     */
    public function scopeActive($query)
    {
        return $query->where('removed', false);
    }

    /**
     * Get orders with this state.
     */
    public function orders()
    {
        return $this->hasMany(Order::class, 'status', 'id');
    }
}
