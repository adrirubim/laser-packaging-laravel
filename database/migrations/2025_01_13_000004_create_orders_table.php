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
        Schema::create('orderorder', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->uuid('article_uuid');
            $table->string('order_production_number')->unique();
            $table->string('number_customer_reference_order')->nullable();
            $table->integer('line')->nullable();
            $table->decimal('quantity', 10, 2)->nullable();
            $table->decimal('worked_quantity', 10, 2)->default(0);
            $table->timestamp('delivery_requested_date')->nullable();
            $table->uuid('customershippingaddress_uuid')->nullable();
            $table->timestamp('expected_production_start_date')->nullable();
            $table->integer('type_lot')->nullable(); // 0: Manual, 1: 6 cifre, 2: 4 cifre
            $table->string('lot')->nullable();
            $table->timestamp('expiration_date')->nullable();
            $table->integer('external_labels')->nullable(); // 0: Non presenti, 1: Da stampare, 2: Da ricevere
            $table->integer('pvp_labels')->nullable();
            $table->integer('ingredients_labels')->nullable();
            $table->integer('variable_data_labels')->nullable();
            $table->integer('label_of_jumpers')->nullable();
            $table->text('indications_for_shop')->nullable();
            $table->text('indications_for_production')->nullable();
            $table->text('indications_for_delivery')->nullable();
            $table->integer('status')->default(0); // 0: Pianificato, 1: In Allestimento, 2: Lanciato, 3: In Avanzamento, 4: Sospeso, 5: Evaso, 6: Saldato
            $table->json('status_semaforo')->nullable(); // {etichette: 0, packaging: 0, prodotto: 0}
            $table->text('motivazione')->nullable();
            $table->boolean('autocontrollo')->default(false);
            $table->boolean('removed')->default(false);
            $table->timestamps();
            $table->softDeletes();

            $table->index('uuid');
            $table->index('article_uuid');
            $table->index('order_production_number');
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orderorder');
    }
};
