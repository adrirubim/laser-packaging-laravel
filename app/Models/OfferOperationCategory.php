<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OfferOperationCategory extends Model
{
    use HasFactory, HasUuids;

    protected static function newFactory()
    {
        return \Database\Factories\OfferOperationCategoryFactory::new();
    }

    protected $table = 'offeroperationcategory';

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
        'code',
        'name',
        'removed',
    ];

    protected $casts = [
        'removed' => 'boolean',
    ];

    public function scopeActive($query)
    {
        return $query->where('removed', false);
    }

    public function operations()
    {
        return $this->hasMany(OfferOperation::class, 'category_uuid', 'uuid');
    }
}
