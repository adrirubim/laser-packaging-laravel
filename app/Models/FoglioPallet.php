<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class FoglioPallet extends Model
{
    use HasUuids;

    protected $table = 'articlefogliopallet';

    protected $fillable = [
        'uuid',
        'code',
        'description',
        'filename',
        'removed',
    ];

    protected $casts = [
        'removed' => 'boolean',
    ];

    /**
     * Scope a query to only include active (non-removed) foglio pallet.
     */
    public function scopeActive($query)
    {
        return $query->where('removed', false);
    }
}
