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
        Schema::create('articlesip', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->string('code')->nullable();
            $table->string('number')->nullable();
            $table->decimal('length_cm', 10, 2)->nullable(); // Larghezza collo
            $table->decimal('depth_cm', 10, 2)->nullable(); // Neck depth
            $table->decimal('height_cm', 10, 2)->nullable(); // Altezza collo
            $table->decimal('volume_dmc', 10, 2)->nullable(); // Volume collo
            $table->integer('plan_packaging')->nullable(); // Colli per piano
            $table->integer('pallet_plans')->nullable(); // Piani per pallet
            $table->integer('qty_pallet')->nullable(); // Colli per pallet
            $table->integer('units_per_neck')->nullable(); // Units per neck
            $table->integer('units_pallet')->nullable(); // Units per pallet
            $table->integer('interlayer_every_floors')->nullable(); // Interfalda ogni
            $table->string('filename')->nullable();
            $table->boolean('removed')->default(false);
            $table->timestamps();

            $table->index('uuid');
            $table->index(['code', 'number']);
            $table->index('removed');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('articlesip');
    }
};
