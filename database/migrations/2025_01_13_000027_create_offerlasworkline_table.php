<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('offerlasworkline')) {
            return;
        }

        Schema::create('offerlasworkline', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->string('code')->nullable();
            $table->string('name')->nullable();
            $table->boolean('removed')->default(false);
            $table->timestamps();

            $table->index('uuid');
            $table->index('removed');
            $table->unique('code');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('offerlasworkline');
    }
};
