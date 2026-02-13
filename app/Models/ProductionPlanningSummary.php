<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Legacy production planning summary (`productionplanning_summary`) model.
 */
class ProductionPlanningSummary extends Model
{
    use HasFactory;

    protected $table = 'productionplanning_summary';

    public $timestamps = false;

    protected $fillable = [
        'date',
        'summary_type',
        'hours',
        'removed',
    ];

    protected $casts = [
        'date' => 'date',
        'hours' => 'array',
        'removed' => 'boolean',
    ];
}

