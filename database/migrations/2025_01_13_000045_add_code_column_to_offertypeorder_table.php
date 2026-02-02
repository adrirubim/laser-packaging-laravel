<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('offertypeorder')) {
            return;
        }

        if (Schema::hasColumn('offertypeorder', 'code')) {
            return;
        }

        // Use raw SQL for PostgreSQL compatibility
        \Illuminate\Support\Facades\DB::statement('ALTER TABLE offertypeorder ADD COLUMN code VARCHAR(255) NULL');

        // Add unique constraint if needed
        try {
            \Illuminate\Support\Facades\DB::statement('CREATE UNIQUE INDEX offertypeorder_code_unique ON offertypeorder (code) WHERE code IS NOT NULL');
        } catch (\Exception $e) {
            // Index might already exist, ignore
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('offertypeorder', 'code')) {
            Schema::table('offertypeorder', function (Blueprint $table) {
                $table->dropColumn('code');
            });
        }
    }
};
