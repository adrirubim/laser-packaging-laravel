<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CustomerShippingAddress extends Model
{
    use HasFactory, HasUuids;

    protected static function newFactory()
    {
        return \Database\Factories\CustomerShippingAddressFactory::new();
    }

    protected $table = 'customershippingaddress';

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
        'customerdivision_uuid',
        'co',
        'street',
        'postal_code',
        'city',
        'province',
        'country',
        'contacts',
        'removed',
    ];

    protected $casts = [
        'removed' => 'boolean',
    ];

    /**
     * Scope a query to only include active (non-removed) shipping addresses.
     */
    public function scopeActive($query)
    {
        return $query->where('removed', false);
    }

    /**
     * Get the customer division for this shipping address.
     */
    public function customerDivision()
    {
        return $this->belongsTo(CustomerDivision::class, 'customerdivision_uuid', 'uuid');
    }

    /**
     * Get orders that use this shipping address.
     */
    public function orders()
    {
        return $this->hasMany(Order::class, 'customershippingaddress_uuid', 'uuid');
    }
}
