<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class ModelsCQ extends Model
{
    use HasUuids;

    protected $table = 'modelscq';

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
     * Scope a query to only include active (non-removed) models.
     */
    public function scopeActive($query)
    {
        return $query->where('removed', false);
    }

    /**
     * Generate the next CQU code in a thread-safe manner.
     * Uses database transaction with SELECT FOR UPDATE to prevent duplicates.
     */
    public static function generateNextCQUCode(): string
    {
        return \Illuminate\Support\Facades\DB::transaction(function () {
            $lastModel = static::where('cod_model', 'like', 'CQU%')
                ->where('removed', false)
                ->orderByRaw('CAST(SUBSTRING(cod_model, 4) AS UNSIGNED) DESC')
                ->lockForUpdate()
                ->first();

            $progressive = 1;
            if ($lastModel && ! empty($lastModel->cod_model)) {
                $lastNumber = intval(substr($lastModel->cod_model, 3));
                $progressive = $lastNumber + 1;
            }

            return sprintf('CQU%03d', $progressive);
        });
    }

    /**
     * Check if a CQU code already exists.
     */
    public static function codeExists(string $code): bool
    {
        return static::where('cod_model', $code)
            ->where('removed', false)
            ->exists();
    }
}
