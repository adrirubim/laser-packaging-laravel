<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('alert_acknowledgements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('alert_key', 64)->index();
            $table->string('scope_hash', 64)->index();
            $table->string('signature', 255)->index();
            $table->timestamp('acknowledged_at');
            $table->timestamps();

            $table->unique(['user_id', 'alert_key', 'scope_hash']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('alert_acknowledgements');
    }
};
