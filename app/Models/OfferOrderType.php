<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class OfferOrderType extends Model
{
    use HasFactory, HasUuids;

    protected static function newFactory()
    {
        return \Database\Factories\OfferOrderTypeFactory::new();
    }

    protected $table = 'offertypeorder';

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
        'code',
        'name',
        'removed',
    ];

    protected $casts = [
        'removed' => 'boolean',
    ];

    /**
     * Get the offers for this order type.
     */
    public function offers(): HasMany
    {
        return $this->hasMany(Offer::class, 'order_type_uuid', 'uuid');
    }

    public function scopeActive($query)
    {
        return $query->where('removed', false);
    }
}
