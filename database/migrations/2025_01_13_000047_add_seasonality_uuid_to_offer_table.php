<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('offer')) {
            return;
        }

        if (Schema::hasColumn('offer', 'seasonality_uuid')) {
            return;
        }

        // Use raw SQL for PostgreSQL compatibility
        \Illuminate\Support\Facades\DB::statement('ALTER TABLE offer ADD COLUMN seasonality_uuid UUID NULL');

        // Add foreign key constraint if needed
        try {
            \Illuminate\Support\Facades\DB::statement('ALTER TABLE offer ADD CONSTRAINT offer_seasonality_uuid_foreign FOREIGN KEY (seasonality_uuid) REFERENCES offerseasonality(uuid)');
        } catch (\Exception $e) {
            // Constraint might already exist, ignore
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('offer', 'seasonality_uuid')) {
            Schema::table('offer', function (Blueprint $table) {
                $table->dropForeign(['seasonality_uuid']);
                $table->dropColumn('seasonality_uuid');
            });
        }
    }
};
