<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class CriticalIssue extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected static function newFactory()
    {
        return \Database\Factories\CriticalIssueFactory::new();
    }

    protected $table = 'criticalissues';

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
    ];

    protected $casts = [
        'removed' => 'boolean',
    ];

    /**
     * Get the articles that have this critical issue.
     */
    public function articles(): BelongsToMany
    {
        return $this->belongsToMany(Article::class, 'articlecritical', 'critical_uuid', 'article_uuid', 'uuid', 'uuid')
            ->wherePivot('removed', false)
            ->withTimestamps();
    }

    /**
     * Scope a query to only include active critical issues.
     */
    public function scopeActive($query)
    {
        return $query->where('removed', false);
    }
}
