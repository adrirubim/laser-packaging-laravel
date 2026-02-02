<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LasFamily extends Model
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

    public function scopeActive($query)
    {
        return $query->where('removed', false);
    }
}
