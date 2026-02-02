<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class OfferActivity extends Model
{
    use HasFactory, HasUuids;

    protected static function newFactory()
    {
        return \Database\Factories\OfferActivityFactory::new();
    }

    protected $table = 'offeractivity';

    protected $primaryKey = 'id';

    protected $keyType = 'int';

    public $incrementing = true;

    /**
     * Get the columns that should receive a unique identifier.
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
        'removed',
    ];

    protected $casts = [
        'removed' => 'boolean',
    ];

    /**
     * Get the offers for this activity.
     */
    public function offers(): HasMany
    {
        return $this->hasMany(Offer::class, 'activity_uuid', 'uuid');
    }

    /**
     * Scope a query to only include active (non-removed) offer activities.
     */
    public function scopeActive($query)
    {
        return $query->where('removed', false);
    }
}
