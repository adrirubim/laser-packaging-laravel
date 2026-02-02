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
        Schema::create('customerdivision', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->uuid('customer_uuid');
            $table->string('code')->nullable();
            $table->string('name')->nullable();
            $table->boolean('removed')->default(false);
            $table->timestamps();
            $table->softDeletes();

            $table->index('uuid');
            $table->index('customer_uuid');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('customerdivision');
    }
};
