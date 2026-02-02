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
        Schema::create('articles', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->uuid('offer_uuid');
            $table->string('cod_article_las')->unique();
            $table->boolean('visibility_cod')->default(true);
            $table->boolean('stock_managed')->default(false);
            $table->string('cod_article_client')->nullable();
            $table->text('article_descr')->nullable();
            $table->text('additional_descr')->nullable();
            $table->uuid('article_category')->nullable();
            $table->string('um')->nullable(); // Unità di misura
            $table->integer('lot_attribution')->nullable(); // 0: Cliente, 1: Noi
            $table->integer('expiration_attribution')->nullable(); // 0: Cliente, 1: Noi
            $table->string('ean')->nullable();
            $table->integer('db')->nullable(); // 0: Cliente, 1: Noi, 2: Entrambi
            $table->string('line_layout')->nullable();
            $table->decimal('weight_kg', 10, 3)->nullable();
            $table->decimal('length_cm', 10, 2)->nullable();
            $table->decimal('depth_cm', 10, 2)->nullable();
            $table->decimal('height_cm', 10, 2)->nullable();
            $table->uuid('machinery_uuid')->nullable();
            $table->uuid('packaging_instruct_uuid')->nullable(); // IC
            $table->uuid('palletizing_instruct_uuid')->nullable(); // IP
            $table->uuid('operating_instruct_uuid')->nullable(); // IO
            $table->integer('labels_external')->nullable(); // 0: Non presenti, 1: Da stampare, 2: Da ricevere
            $table->integer('labels_pvp')->nullable();
            $table->decimal('value_pvp', 10, 2)->nullable();
            $table->integer('labels_ingredient')->nullable();
            $table->integer('labels_data_variable')->nullable();
            $table->integer('label_of_jumpers')->nullable();
            $table->integer('plan_packaging')->nullable();
            $table->integer('pallet_plans')->nullable();
            $table->integer('units_per_neck')->nullable();
            $table->integer('interlayer_every_floors')->nullable();
            $table->text('allergens')->nullable();
            $table->uuid('article_critical_uuid')->nullable();
            $table->uuid('critical_issues_uuid')->nullable();
            $table->integer('nominal_weight_control')->nullable(); // 0: CONTROLLO PESO ALMENO, 1: CONTROLLO CONTENENZA
            $table->string('weight_unit_of_measur')->nullable();
            $table->decimal('weight_value', 10, 3)->nullable();
            $table->integer('object_control_weight')->nullable(); // 0: PRODOTTO NUDO, 1: PRODOTTO CON INCARTO PRIMARIO
            $table->uuid('materials_uuid')->nullable();
            $table->uuid('pallet_uuid')->nullable();
            $table->uuid('pallet_sheet')->nullable();
            $table->uuid('model_uuid')->nullable();
            $table->integer('customer_samples_list')->nullable(); // 0: Pre produzione, 1: Successive produzioni
            $table->boolean('check_material')->default(false);
            $table->boolean('production_approval_checkbox')->default(false);
            $table->uuid('production_approval_employee')->nullable();
            $table->timestamp('production_approval_date')->nullable();
            $table->text('production_approval_notes')->nullable();
            $table->boolean('approv_quality_checkbox')->default(false);
            $table->uuid('approv_quality_employee')->nullable();
            $table->timestamp('approv_quality_date')->nullable();
            $table->text('approv_quality_notes')->nullable();
            $table->boolean('commercial_approval_checkbox')->default(false);
            $table->uuid('commercial_approval_employee')->nullable();
            $table->timestamp('commercial_approval_date')->nullable();
            $table->text('commercial_approval_notes')->nullable();
            $table->boolean('client_approval_checkbox')->default(false);
            $table->uuid('client_approval_employee')->nullable();
            $table->timestamp('client_approval_date')->nullable();
            $table->text('client_approval_notes')->nullable();
            $table->string('check_approval')->nullable();
            $table->decimal('media_reale_cfz_h_pz', 10, 4)->nullable();
            $table->boolean('removed')->default(false);
            $table->timestamps();
            $table->softDeletes();

            $table->index('uuid');
            $table->index('offer_uuid');
            $table->index('cod_article_las');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('articles');
    }
};
