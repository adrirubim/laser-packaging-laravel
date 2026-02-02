<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OfferLasWorkLine extends Model
{
    use HasFactory, HasUuids;

    protected static function newFactory()
    {
        return \Database\Factories\OfferLasWorkLineFactory::new();
    }

    protected $table = 'offerlasworkline';

    protected $primaryKey = 'id';

    protected $keyType = 'int';

    public $incrementing = true;

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
     * Scope a query to only include active (non-removed) LAS work lines.
     */
    public function scopeActive($query)
    {
        return $query->where('removed', false);
    }

    /**
     * Get offers that use this LAS work line.
     */
    public function offers()
    {
        return $this->hasMany(Offer::class, 'lasworkline_uuid', 'uuid');
    }
}
