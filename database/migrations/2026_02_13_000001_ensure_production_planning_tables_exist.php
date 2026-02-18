<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Ensure production planning tables exist (idempotent).
     * Use when the original migration was recorded but tables are missing on this DB.
     */
    public function up(): void
    {
        if (! Schema::hasTable('productionplanning')) {
            Schema::create('productionplanning', function (Blueprint $table) {
                $table->bigIncrements('id');
                $table->uuid('order_uuid')->index();
                $table->uuid('lasworkline_uuid')->index();
                $table->date('date')->index();
                $table->json('hours')->nullable();
            });
        }

        if (! Schema::hasTable('productionplanning_summary')) {
            Schema::create('productionplanning_summary', function (Blueprint $table) {
                $table->bigIncrements('id');
                $table->date('date')->index();
                $table->string('summary_type', 50)->index();
                $table->json('hours')->nullable();
                $table->boolean('removed')->default(false);
            });
        }
    }

    public function down(): void
    {
        // Leave tables in place; original migration handles drop if needed.
    }
};
