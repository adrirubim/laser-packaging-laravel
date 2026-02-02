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
     * Nota: En el legacy, valuetype puede ser "testo", "numero", o una lista separada por comas.
     * Por ahora, si no hay valueType relacionado o no tiene los campos necesarios, retornamos null.
     */
    public function getValuetypeAttribute(): ?string
    {
        // Verificar si la relación está cargada
        if (! $this->relationLoaded('valueType')) {
            return null;
        }

        // Tentare di ottenere la relazione in modo sicuro
        try {
            // Verificare se la relazione esiste usando getRelationValue che è più sicuro
            // getRelationValue retorna null si la relación no está cargada o no existe
            $valueType = $this->getRelationValue('valueType');

            // Se la relazione è null, restituire null
            if (! $valueType || ! is_object($valueType)) {
                return null;
            }

            // Verificare che sia un'istanza di Model prima di chiamare getAttributes
            if (! ($valueType instanceof \Illuminate\Database\Eloquent\Model)) {
                return null;
            }

            // Tentare di ottenere da campi che potrebbero esistere in ValueTypes
            // Si ValueTypes no tiene estos campos, retornar null para evitar errores
            $attributes = $valueType->getAttributes();
            if (isset($attributes['type'])) {
                return $attributes['type'];
            }
            if (isset($attributes['values'])) {
                return $attributes['values'];
            }
        } catch (\Exception $e) {
            // Se c'è un errore accedendo alla relazione o ai suoi attributi, restituire null
            return null;
        } catch (\Error $e) {
            // Catturare anche errori PHP (come proprietà non definite)
            return null;
        }

        // Por defecto, retornar null si no tiene los campos esperados
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
