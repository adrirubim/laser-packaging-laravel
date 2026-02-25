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
        Schema::table('users', function (Blueprint $table) {
            $table->string('phone', 50)->nullable()->after('email');
            $table->string('avatar_path')->nullable()->after('phone');
            $table->json('preferences')->nullable()->after('avatar_path');
            $table->timestamp('last_login_at')->nullable()->after('preferences');
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'phone',
                'avatar_path',
                'preferences',
                'last_login_at',
                'deleted_at',
            ]);
        });
    }
};
