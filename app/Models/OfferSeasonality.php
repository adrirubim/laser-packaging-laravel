<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class OfferSeasonality extends Model
{
    use HasFactory, HasUuids;

    protected static function newFactory()
    {
        return \Database\Factories\OfferSeasonalityFactory::new();
    }

    protected $table = 'offerseasonality';

    protected $primaryKey = 'id';

    protected $keyType = 'int';

    public $incrementing = true;

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
     * Get the offers for this seasonality.
     */
    public function offers(): HasMany
    {
        return $this->hasMany(Offer::class, 'seasonality_uuid', 'uuid');
    }

    public function scopeActive($query)
    {
        return $query->where('removed', false);
    }
}
