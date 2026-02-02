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
        Schema::create('offerorderstate', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->string('name')->nullable();
            $table->integer('sorting')->nullable();
            $table->boolean('initial')->default(false);
            $table->boolean('production')->default(false);
            $table->boolean('removed')->default(false);
            $table->timestamps();

            $table->index('uuid');
            $table->index('removed');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('offerorderstate');
    }
};
