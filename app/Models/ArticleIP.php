<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ArticleIP extends Model
{
    use HasFactory, HasUuids;

    protected static function newFactory()
    {
        return \Database\Factories\ArticleIPFactory::new();
    }

    protected $table = 'articlesip';

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
        'number',
        'length_cm',
        'depth_cm',
        'height_cm',
        'volume_dmc',
        'plan_packaging',
        'pallet_plans',
        'qty_pallet',
        'units_per_neck',
        'units_pallet',
        'interlayer_every_floors',
        'filename',
        'removed',
    ];

    protected $casts = [
        'length_cm' => 'decimal:2',
        'depth_cm' => 'decimal:2',
        'height_cm' => 'decimal:2',
        'volume_dmc' => 'decimal:2',
        'plan_packaging' => 'integer',
        'pallet_plans' => 'integer',
        'qty_pallet' => 'integer',
        'units_per_neck' => 'integer',
        'units_pallet' => 'integer',
        'interlayer_every_floors' => 'integer',
        'removed' => 'boolean',
    ];

    /**
     * Get the route key for the model.
     */
    public function getRouteKeyName()
    {
        return 'uuid';
    }

    /**
     * Scope a query to only include active (non-removed) article IP.
     */
    public function scopeActive($query)
    {
        return $query->where('removed', false);
    }

    /**
     * Get articles that have this IP assigned.
     */
    public function articles()
    {
        return $this->belongsToMany(Article::class, 'articlesipassigned', 'palletizing_instruct_uuid', 'article_uuid', 'uuid', 'uuid')
            ->wherePivot('removed', false)
            ->withTimestamps();
    }
}
