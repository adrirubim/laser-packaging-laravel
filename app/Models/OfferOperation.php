<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OfferOperation extends Model
{
    use HasFactory, HasUuids;

    protected static function newFactory()
    {
        return \Database\Factories\OfferOperationFactory::new();
    }

    protected $table = 'offeroperation';

    protected $primaryKey = 'id';

    protected $keyType = 'int';

    public $incrementing = true;

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
        'category_uuid',
        'codice',
        'codice_univoco',
        'descrizione',
        'secondi_operazione',
        'filename',
        'removed',
    ];

    protected $casts = [
        'removed' => 'boolean',
        'secondi_operazione' => 'integer',
    ];

    public function scopeActive($query)
    {
        return $query->where('removed', false);
    }

    public function category()
    {
        return $this->belongsTo(OfferOperationCategory::class, 'category_uuid', 'uuid');
    }

    /**
     * Get the operation lists that use this operation.
     */
    public function operationLists()
    {
        return $this->hasMany(OfferOperationList::class, 'offeroperation_uuid', 'uuid');
    }

    /**
     * Accessor for 'code' (alias of 'codice').
     */
    public function getCodeAttribute()
    {
        return $this->codice;
    }

    /**
     * Accessor for 'description' (alias of 'descrizione').
     */
    public function getDescriptionAttribute()
    {
        return $this->descrizione;
    }
}
