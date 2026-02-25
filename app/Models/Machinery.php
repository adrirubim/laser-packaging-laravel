<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Machinery extends Model
{
    use HasFactory, HasUuids;

    protected static function newFactory()
    {
        return \Database\Factories\MachineryFactory::new();
    }

    protected $table = 'machinery';

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
        'cod',
        'description',
        'parameter',
        'value_type_uuid',
        'removed',
    ];

    protected $casts = [
        'removed' => 'boolean',
    ];

    /**
     * Get the value type for this machinery.
     */
    public function valueType(): BelongsTo
    {
        return $this->belongsTo(ValueTypes::class, 'value_type_uuid', 'id');
    }

    /**
     * Get valuetype as string (for compatibility with legacy).
     * Returns the type field from ValueTypes or null.
     *
     * Note: In legacy, valuetype can be "testo", "numero", or a comma-separated list.
     * For now, if there is no related valueType or it lacks the required fields, return null.
     */
    public function getValuetypeAttribute(): ?string
    {
        // Check if relation is loaded
        if (! $this->relationLoaded('valueType')) {
            return null;
        }

        // Try to get the relation safely
        try {
            // Verify the relation exists using getRelationValue which is safer
            // getRelationValue returns null if relation is not loaded or does not exist
            $valueType = $this->getRelationValue('valueType');

            // If relation is null, return null
            if (! $valueType || ! is_object($valueType)) {
                return null;
            }

            // Verify it's a Model instance before calling getAttributes
            if (! ($valueType instanceof \Illuminate\Database\Eloquent\Model)) {
                return null;
            }

            // Try to get from fields that might exist in ValueTypes
            // If ValueTypes doesn't have these fields, return null to avoid errors
            $attributes = $valueType->getAttributes();
            if (isset($attributes['type'])) {
                return $attributes['type'];
            }
            if (isset($attributes['values'])) {
                return $attributes['values'];
            }
        } catch (\Exception $e) {
            // If there's an error accessing the relation or its attributes, return null
            return null;
        } catch (\Error $e) {
            // Also catch PHP errors (like undefined properties)
            return null;
        }

        // By default, return null if it doesn't have the expected fields
        return null;
    }

    /**
     * Get the articles that use this machinery.
     */
    public function articles(): BelongsToMany
    {
        return $this->belongsToMany(Article::class, 'articlemachinery', 'machinery_uuid', 'article_uuid', 'uuid', 'uuid')
            ->wherePivot('removed', false)
            ->withTimestamps();
    }

    /**
     * Scope a query to only include active machinery.
     */
    public function scopeActive($query)
    {
        return $query->where('removed', false);
    }
}
