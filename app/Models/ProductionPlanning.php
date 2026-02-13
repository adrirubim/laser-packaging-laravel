<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Legacy production planning (`productionplanning`) model.
 */
class ProductionPlanning extends Model
{
    use HasFactory;

    protected $table = 'productionplanning';

    public $timestamps = false;

    protected $fillable = [
        'order_uuid',
        'lasworkline_uuid',
        'date',
        'hours',
    ];

    protected $casts = [
        'date' => 'date',
        'hours' => 'array',
    ];

    public function order()
    {
        return $this->belongsTo(Order::class, 'order_uuid', 'uuid');
    }

    public function lasWorkLine()
    {
        return $this->belongsTo(OfferLasWorkLine::class, 'lasworkline_uuid', 'uuid');
    }
}

