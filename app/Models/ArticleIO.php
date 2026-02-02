<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ArticleIO extends Model
{
    use HasFactory, HasUuids;

    protected static function newFactory()
    {
        return \Database\Factories\ArticleIOFactory::new();
    }

    protected $table = 'articlesio';

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
        'filename',
        'removed',
    ];

    protected $casts = [
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
     * Scope a query to only include active (non-removed) article IO.
     */
    public function scopeActive($query)
    {
        return $query->where('removed', false);
    }

    /**
     * Get articles that have this IO assigned.
     */
    public function articles()
    {
        return $this->belongsToMany(Article::class, 'articlesioassigned', 'operating_instruct_uuid', 'article_uuid', 'uuid', 'uuid')
            ->wherePivot('removed', false)
            ->withTimestamps();
    }
}
