<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class CustomerDivision extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected static function newFactory()
    {
        return \Database\Factories\CustomerDivisionFactory::new();
    }

    protected $table = 'customerdivision';

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
        'customer_uuid',
        'code',
        'name',
        'email',
        'contacts',
        'removed',
    ];

    protected $casts = [
        'removed' => 'boolean',
    ];

    /**
     * Get the customer that owns the division.
     */
    public function customer()
    {
        return $this->belongsTo(Customer::class, 'customer_uuid', 'uuid');
    }

    /**
     * Get the shipping addresses for the division.
     */
    public function shippingAddresses()
    {
        return $this->hasMany(CustomerShippingAddress::class, 'customerdivision_uuid', 'uuid');
    }

    /**
     * Get only active shipping addresses for the division.
     */
    public function activeShippingAddresses()
    {
        return $this->hasMany(CustomerShippingAddress::class, 'customerdivision_uuid', 'uuid')
            ->where('removed', false);
    }

    /**
     * Get the offers for the division.
     */
    public function offers(): HasMany
    {
        return $this->hasMany(Offer::class, 'customerdivision_uuid', 'uuid');
    }

    /**
     * Scope a query to only include active divisions.
     */
    public function scopeActive($query)
    {
        return $query->where('removed', false);
    }
}
