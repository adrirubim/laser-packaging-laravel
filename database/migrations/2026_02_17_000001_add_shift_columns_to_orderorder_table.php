<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Turni (réplica legacy): 0 = Giornata (8-16), 1 = Turni (6-22) con mattina/pomeriggio.
     */
    public function up(): void
    {
        Schema::table('orderorder', function (Blueprint $table) {
            $table->unsignedTinyInteger('shift_mode')->default(0)->after('removed');
            $table->boolean('shift_morning')->default(false)->after('shift_mode');
            $table->boolean('shift_afternoon')->default(false)->after('shift_morning');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orderorder', function (Blueprint $table) {
            $table->dropColumn(['shift_mode', 'shift_morning', 'shift_afternoon']);
        });
    }
};
