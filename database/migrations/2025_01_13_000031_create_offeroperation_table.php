<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('offeroperation')) {
            return;
        }

        Schema::create('offeroperation', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->uuid('category_uuid')->nullable();
            $table->string('codice')->nullable();
            $table->string('codice_univoco')->nullable();
            $table->string('descrizione')->nullable();
            $table->integer('secondi_operazione')->nullable();
            $table->string('filename')->nullable();
            $table->boolean('removed')->default(false);
            $table->timestamps();

            $table->index('uuid');
            $table->index('category_uuid');
            $table->index('removed');
            $table->unique('codice_univoco');

            $table->foreign('category_uuid')->references('uuid')->on('offeroperationcategory')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('offeroperation');
    }
};
