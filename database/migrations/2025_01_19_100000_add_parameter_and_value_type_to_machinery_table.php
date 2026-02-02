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
        if (! Schema::hasColumn('machinery', 'parameter')) {
            Schema::table('machinery', function (Blueprint $table) {
                $table->string('parameter')->nullable()->after('description');
            });
        }

        if (! Schema::hasColumn('machinery', 'value_type_uuid')) {
            Schema::table('machinery', function (Blueprint $table) {
                $table->integer('value_type_uuid')->nullable()->after('parameter');
            });

            // Aggiungere indice in un'operazione separata
            Schema::table('machinery', function (Blueprint $table) {
                if (! $this->indexExists('machinery', 'machinery_value_type_uuid_index')) {
                    $table->index('value_type_uuid');
                }
            });
        }
    }

    /**
     * Check if an index exists on a table
     */
    private function indexExists(string $table, string $index): bool
    {
        $connection = Schema::getConnection();
        $databaseName = $connection->getDatabaseName();

        $result = $connection->select(
            "SELECT COUNT(*) as count 
             FROM pg_indexes 
             WHERE schemaname = 'public' 
             AND tablename = ? 
             AND indexname = ?",
            [$table, $index]
        );

        return $result[0]->count > 0;
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('machinery', function (Blueprint $table) {
            $table->dropIndex(['value_type_uuid']);
            $table->dropColumn(['parameter', 'value_type_uuid']);
        });
    }
};
