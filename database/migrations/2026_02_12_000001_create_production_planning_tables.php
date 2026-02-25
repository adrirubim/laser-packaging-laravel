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
        // Main planning table (legacy: productionplanning)
        if (! Schema::hasTable('productionplanning')) {
            Schema::create('productionplanning', function (Blueprint $table) {
                $table->bigIncrements('id');
                $table->uuid('order_uuid')->index();
                $table->uuid('lasworkline_uuid')->index();
                $table->date('date')->index();
                // In legacy it's an associative array HHmm => workers
                $table->json('hours')->nullable();
            });
        }

        // Summary table (legacy: productionplanning_summary)
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

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('productionplanning_summary');
        Schema::dropIfExists('productionplanning');
    }
};
