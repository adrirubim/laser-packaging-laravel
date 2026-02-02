<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Verificar si la columna uuid existe
        $hasUuidColumn = Schema::hasColumn('valuetypes', 'uuid');

        if (! $hasUuidColumn) {
            Schema::table('valuetypes', function (Blueprint $table) {
                $table->uuid('uuid')->unique()->after('id');
            });

            // Generar UUIDs para los registros existentes
            $valueTypes = DB::table('valuetypes')->get();
            foreach ($valueTypes as $valueType) {
                DB::table('valuetypes')
                    ->where('id', $valueType->id)
                    ->update(['uuid' => \Illuminate\Support\Str::uuid()->toString()]);
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasColumn('valuetypes', 'uuid')) {
            Schema::table('valuetypes', function (Blueprint $table) {
                $table->dropUnique(['uuid']);
                $table->dropColumn('uuid');
            });
        }
    }
};
