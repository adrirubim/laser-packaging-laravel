<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OfferLasFamily extends Model
{
    use HasFactory, HasUuids;

    protected static function newFactory()
    {
        return \Database\Factories\OfferLasFamilyFactory::new();
    }

    protected $table = 'offerlasfamily';

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
        'code',
        'name',
        'removed',
    ];

    protected $casts = [
        'removed' => 'boolean',
    ];

    /**
     * Scope a query to only include active (non-removed) LAS families.
     */
    public function scopeActive($query)
    {
        return $query->where('removed', false);
    }

    /**
     * Get offers that use this LAS family.
     */
    public function offers()
    {
        return $this->hasMany(Offer::class, 'lasfamily_uuid', 'uuid');
    }
}
