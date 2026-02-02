<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Customer extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    /**
     * Create a new factory instance for the model.
     */
    protected static function newFactory()
    {
        return \Database\Factories\CustomerFactory::new();
    }

    protected $table = 'customer';

    protected $primaryKey = 'id';

    protected $keyType = 'int';

    public $incrementing = true;

    /**
     * Generate a new UUID for the model (but not as primary key).
     * This is used by HasUuids trait for the 'uuid' field.
     */
    public function newUniqueId(): string
    {
        return (string) \Illuminate\Support\Str::uuid();
    }

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
        'code',
        'company_name',
        'vat_number',
        'co',
        'street',
        'postal_code',
        'city',
        'province',
        'country',
        'removed',
    ];

    protected $casts = [
        'removed' => 'boolean',
    ];

    /**
     * Get the divisions for the customer.
     */
    public function divisions()
    {
        return $this->hasMany(CustomerDivision::class, 'customer_uuid', 'uuid');
    }

    /**
     * Get the offers for the customer.
     */
    public function offers()
    {
        return $this->hasMany(Offer::class, 'customer_uuid', 'uuid');
    }

    /**
     * Scope a query to only include active customers.
     */
    public function scopeActive($query)
    {
        return $query->where('removed', false);
    }
}
