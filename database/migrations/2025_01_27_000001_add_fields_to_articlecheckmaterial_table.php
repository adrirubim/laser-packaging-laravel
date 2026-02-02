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
        Schema::table('articlecheckmaterial', function (Blueprint $table) {
            if (! Schema::hasColumn('articlecheckmaterial', 'um')) {
                $table->string('um', 50)->nullable()->after('material_uuid');
            }
            if (! Schema::hasColumn('articlecheckmaterial', 'quantity_expected')) {
                $table->decimal('quantity_expected', 10, 2)->nullable()->after('um');
            }
            if (! Schema::hasColumn('articlecheckmaterial', 'quantity_effective')) {
                $table->decimal('quantity_effective', 10, 2)->nullable()->after('quantity_expected');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('articlecheckmaterial', function (Blueprint $table) {
            if (Schema::hasColumn('articlecheckmaterial', 'um')) {
                $table->dropColumn('um');
            }
            if (Schema::hasColumn('articlecheckmaterial', 'quantity_expected')) {
                $table->dropColumn('quantity_expected');
            }
            if (Schema::hasColumn('articlecheckmaterial', 'quantity_effective')) {
                $table->dropColumn('quantity_effective');
            }
        });
    }
};
