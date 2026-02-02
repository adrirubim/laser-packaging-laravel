<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Article extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    /**
     * Create a new factory instance for the model.
     */
    protected static function newFactory()
    {
        return \Database\Factories\ArticleFactory::new();
    }

    protected $table = 'articles';

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
        'offer_uuid',
        'cod_article_las',
        'visibility_cod',
        'stock_managed',
        'cod_article_client',
        'article_descr',
        'additional_descr',
        'article_category',
        'um',
        'lot_attribution',
        'expiration_attribution',
        'ean',
        'db',
        'line_layout',
        'weight_kg',
        'length_cm',
        'depth_cm',
        'height_cm',
        'machinery_uuid',
        'packaging_instruct_uuid',
        'palletizing_instruct_uuid',
        'operating_instruct_uuid',
        'labels_external',
        'labels_pvp',
        'value_pvp',
        'labels_ingredient',
        'labels_data_variable',
        'label_of_jumpers',
        'plan_packaging',
        'pallet_plans',
        'units_per_neck',
        'interlayer_every_floors',
        'allergens',
        'article_critical_uuid',
        'critical_issues_uuid',
        'nominal_weight_control',
        'weight_unit_of_measur',
        'weight_value',
        'object_control_weight',
        'materials_uuid',
        'pallet_uuid',
        'pallet_sheet',
        'model_uuid',
        'customer_samples_list',
        'check_material',
        'production_approval_checkbox',
        'production_approval_employee',
        'production_approval_date',
        'production_approval_notes',
        'approv_quality_checkbox',
        'approv_quality_employee',
        'approv_quality_date',
        'approv_quality_notes',
        'commercial_approval_checkbox',
        'commercial_approval_employee',
        'commercial_approval_date',
        'commercial_approval_notes',
        'client_approval_checkbox',
        'client_approval_employee',
        'client_approval_date',
        'client_approval_notes',
        'check_approval',
        'media_reale_cfz_h_pz',
    ];

    protected $casts = [
        'visibility_cod' => 'boolean',
        'stock_managed' => 'boolean',
        'weight_kg' => 'decimal:3',
        'length_cm' => 'decimal:2',
        'depth_cm' => 'decimal:2',
        'height_cm' => 'decimal:2',
        'value_pvp' => 'decimal:2',
        'weight_value' => 'decimal:3',
        'check_material' => 'boolean',
        'production_approval_checkbox' => 'boolean',
        'production_approval_date' => 'datetime',
        'approv_quality_checkbox' => 'boolean',
        'approv_quality_date' => 'datetime',
        'commercial_approval_checkbox' => 'boolean',
        'commercial_approval_date' => 'datetime',
        'client_approval_checkbox' => 'boolean',
        'client_approval_date' => 'datetime',
        'media_reale_cfz_h_pz' => 'decimal:4',
        'removed' => 'boolean',
    ];

    /**
     * Get the offer that owns the article.
     */
    public function offer(): BelongsTo
    {
        return $this->belongsTo(Offer::class, 'offer_uuid', 'uuid');
    }

    /**
     * Get the materials for the article.
     */
    public function materials(): BelongsToMany
    {
        return $this->belongsToMany(Material::class, 'articlematerials', 'article_uuid', 'material_uuid', 'uuid', 'uuid')
            ->wherePivot('removed', false)
            ->withTimestamps();
    }

    /**
     * Get the machinery for the article.
     */
    public function machinery(): BelongsToMany
    {
        return $this->belongsToMany(Machinery::class, 'articlemachinery', 'article_uuid', 'machinery_uuid', 'uuid', 'uuid')
            ->wherePivot('removed', false)
            ->withPivot('value')
            ->withTimestamps();
    }

    /**
     * Get the critical issues for the article.
     */
    public function criticalIssues(): BelongsToMany
    {
        return $this->belongsToMany(CriticalIssue::class, 'articlecritical', 'article_uuid', 'critical_uuid', 'uuid', 'uuid')
            ->wherePivot('removed', false)
            ->withTimestamps();
    }

    /**
     * Get the orders for the article.
     */
    public function orders()
    {
        return $this->hasMany(Order::class, 'article_uuid', 'uuid');
    }

    /**
     * Get the packaging instructions (IC) assigned to this article.
     */
    public function packagingInstructions()
    {
        return $this->belongsToMany(ArticleIC::class, 'articlesicassigned', 'article_uuid', 'packaging_instruct_uuid', 'uuid', 'uuid')
            ->wherePivot('removed', false)
            ->withTimestamps();
    }

    /**
     * Get the operating instructions (IO) assigned to this article.
     */
    public function operatingInstructions()
    {
        return $this->belongsToMany(ArticleIO::class, 'articlesioassigned', 'article_uuid', 'operating_instruct_uuid', 'uuid', 'uuid')
            ->wherePivot('removed', false)
            ->withTimestamps();
    }

    /**
     * Get the palletizing instructions (IP) assigned to this article.
     */
    public function palletizingInstructions()
    {
        return $this->belongsToMany(ArticleIP::class, 'articlesipassigned', 'article_uuid', 'palletizing_instruct_uuid', 'uuid', 'uuid')
            ->wherePivot('removed', false)
            ->withTimestamps();
    }

    /**
     * Get check materials for this article.
     */
    public function checkMaterials()
    {
        return $this->hasMany(ArticleCheckMaterial::class, 'article_uuid', 'uuid');
    }

    /**
     * Get the category for this article.
     */
    public function category()
    {
        return $this->belongsTo(ArticleCategory::class, 'article_category', 'uuid');
    }

    /**
     * Get the pallet type for this article.
     */
    public function palletType()
    {
        return $this->belongsTo(PalletType::class, 'pallet_uuid', 'uuid');
    }

    /**
     * Get the pallet sheet for this article.
     */
    public function palletSheet()
    {
        return $this->belongsTo(PalletSheet::class, 'pallet_sheet', 'uuid');
    }

    /**
     * Get the CQ model for this article.
     */
    public function model()
    {
        return $this->belongsTo(ModelSCQ::class, 'model_uuid', 'uuid');
    }

    /**
     * Scope a query to only include active articles.
     */
    public function scopeActive($query)
    {
        return $query->where('removed', false)->whereNull('deleted_at');
    }
}
