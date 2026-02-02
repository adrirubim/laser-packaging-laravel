<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('offer', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->uuid('customer_uuid');
            $table->uuid('customerdivision_uuid')->nullable();
            $table->uuid('activity_uuid')->nullable();
            $table->uuid('sector_uuid')->nullable();
            $table->uuid('type_uuid')->nullable();
            $table->uuid('order_type_uuid')->nullable();
            $table->uuid('lasfamily_uuid')->nullable();
            $table->uuid('lasworkline_uuid')->nullable();
            $table->uuid('lsresource_uuid')->nullable();
            $table->string('offer_number')->unique();
            $table->date('offer_date');
            $table->date('validity_date')->nullable();
            $table->string('customer_ref')->nullable();
            $table->string('article_code_ref')->nullable();
            $table->text('provisional_description')->nullable();
            $table->string('unit_of_measure')->nullable();
            $table->decimal('quantity', 10, 2)->nullable();
            $table->integer('piece')->nullable();
            $table->decimal('declared_weight_cfz', 10, 3)->nullable();
            $table->decimal('declared_weight_pz', 10, 3)->nullable();
            $table->text('notes')->nullable();
            $table->integer('expected_workers')->nullable();
            $table->decimal('expected_revenue', 10, 2)->nullable();
            $table->decimal('rate_cfz', 10, 4)->nullable();
            $table->decimal('rate_pz', 10, 4)->nullable();
            $table->decimal('rate_rounding_cfz', 10, 4)->nullable();
            $table->decimal('rate_increase_cfz', 10, 4)->nullable();
            $table->decimal('materials_euro', 10, 2)->nullable();
            $table->decimal('logistics_euro', 10, 2)->nullable();
            $table->decimal('other_euro', 10, 2)->nullable();
            $table->text('offer_notes')->nullable();
            $table->decimal('ls_setup_cost', 10, 2)->nullable();
            $table->decimal('ls_other_costs', 10, 2)->nullable();
            $table->integer('approval_status')->default(0); // 0: In attesa, 1: Approvata, 2: Respinta
            $table->boolean('removed')->default(false);
            $table->timestamps();
            $table->softDeletes();

            $table->index('uuid');
            $table->index('customer_uuid');
            $table->index('offer_number');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('offer');
    }
};
