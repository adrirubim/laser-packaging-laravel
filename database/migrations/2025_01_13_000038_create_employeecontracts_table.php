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
        Schema::create('employeecontracts', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->uuid('employee_uuid');
            $table->uuid('supplier_uuid')->nullable();
            $table->integer('pay_level')->nullable(); // 0-8 (C3, B1, B2, B3, A1, etc.)
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->boolean('removed')->default(false);
            $table->timestamps();

            $table->index('uuid');
            $table->index('employee_uuid');
            $table->index('supplier_uuid');
            $table->index('removed');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('employeecontracts');
    }
};
