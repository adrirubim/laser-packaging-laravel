<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('offerlsresource')) {
            return;
        }

        if (Schema::hasColumn('offerlsresource', 'name')) {
            return;
        }

        // Use raw SQL for PostgreSQL compatibility
        \Illuminate\Support\Facades\DB::statement('ALTER TABLE offerlsresource ADD COLUMN name VARCHAR(255) NULL');
    }

    public function down(): void
    {
        if (Schema::hasColumn('offerlsresource', 'name')) {
            Schema::table('offerlsresource', function (Blueprint $table) {
                $table->dropColumn('name');
            });
        }
    }
};
