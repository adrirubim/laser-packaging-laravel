<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ModelSCQ extends Model
{
    use HasFactory, HasUuids;

    protected static function newFactory()
    {
        return \Database\Factories\ModelSCQFactory::new();
    }

    protected $table = 'modelscq';

    protected $primaryKey = 'id';

    protected $keyType = 'int';

    public $incrementing = true;

    /**
     * Get the columns that should receive a unique identifier.
     */
    public function uniqueIds(): array
    {
        return ['uuid'];
    }

    protected $fillable = [
        'uuid',
        'cod_model',
        'description_model',
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
     * Scope a query to only include active (non-removed) models.
     */
    public function scopeActive($query)
    {
        return $query->where('removed', false);
    }

    /**
     * Generate the next CQU code.
     */
    public static function generateNextCQUCode(): string
    {
        // PostgreSQL no tiene UNSIGNED, usar INTEGER o CAST a INTEGER
        $driver = \Illuminate\Support\Facades\DB::connection()->getDriverName();
        if ($driver === 'pgsql') {
            $lastModel = self::where('cod_model', 'like', 'CQU%')
                ->where('removed', false)
                ->orderByRaw('CAST(SUBSTRING(cod_model, 4) AS INTEGER) DESC')
                ->lockForUpdate()
                ->first();
        } else {
            $lastModel = self::where('cod_model', 'like', 'CQU%')
                ->where('removed', false)
                ->orderByRaw('CAST(SUBSTRING(cod_model, 4) AS UNSIGNED) DESC')
                ->lockForUpdate()
                ->first();
        }

        $progressive = 1;
        if ($lastModel && ! empty($lastModel->cod_model)) {
            $lastNumber = intval(substr($lastModel->cod_model, 3));
            $progressive = $lastNumber + 1;
        }

        return sprintf('CQU%03d', $progressive);
    }
}
