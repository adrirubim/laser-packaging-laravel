<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Añade la columna work_saturday al listado de órdenes de producción,
     * usada por la planificación para saber si el sábado es laborable
     * para ese orden (mirror del campo legacy).
     */
    public function up(): void
    {
        Schema::table('orderorder', function (Blueprint $table) {
            $table->boolean('work_saturday')
                ->default(false)
                ->after('shift_afternoon');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orderorder', function (Blueprint $table) {
            $table->dropColumn('work_saturday');
        });
    }
};
