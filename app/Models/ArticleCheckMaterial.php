<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class ArticleCheckMaterial extends Model
{
    use HasUuids;

    protected $table = 'articlecheckmaterial';

    protected $primaryKey = 'id';

    protected $keyType = 'int';

    public $incrementing = true;

    /**
     * Never mass-assign or auto-fill id (bigint). Only uuid gets a UUID.
     */
    protected $guarded = ['id'];

    /**
     * Get the columns that should receive a unique identifier.
     */
    public function uniqueIds(): array
    {
        return ['uuid'];
    }

    /**
     * Ensure id is never set to a UUID before insert (id is bigint auto-increment).
     */
    protected static function booted(): void
    {
        static::creating(function (self $model) {
            $attrs = $model->getAttributes();
            if (array_key_exists('id', $attrs) && is_string($attrs['id'])) {
                $model->offsetUnset('id');
            }
        });
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
        'article_uuid',
        'material_uuid',
        'um',
        'quantity_expected',
        'quantity_effective',
        'removed',
    ];

    protected $casts = [
        'quantity_expected' => 'decimal:2',
        'quantity_effective' => 'decimal:2',
        'removed' => 'boolean',
    ];

    /**
     * Scope a query to only include active (non-removed) check materials.
     */
    public function scopeActive($query)
    {
        return $query->where('removed', false);
    }

    /**
     * Get the article for this check material.
     */
    public function article()
    {
        return $this->belongsTo(Article::class, 'article_uuid', 'uuid');
    }

    /**
     * Get the material for this check material.
     */
    public function material()
    {
        return $this->belongsTo(Material::class, 'material_uuid', 'uuid');
    }
}
