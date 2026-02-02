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
        Schema::create('offeroperationlist', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->uuid('offer_uuid');
            $table->uuid('offeroperation_uuid');
            $table->decimal('num_op', 10, 5)->nullable(); // Numero di operazioni
            $table->boolean('removed')->default(false);
            $table->timestamps();

            $table->index('uuid');
            $table->index('offer_uuid');
            $table->index('offeroperation_uuid');
            $table->index('removed');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('offeroperationlist');
    }
};
