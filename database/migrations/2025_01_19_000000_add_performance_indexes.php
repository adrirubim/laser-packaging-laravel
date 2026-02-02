<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Verificar si un índice existe en PostgreSQL.
     */
    private function indexExists(string $table, string $indexName): bool
    {
        try {
            $result = DB::selectOne(
                'SELECT COUNT(*) as count FROM pg_indexes WHERE tablename = ? AND indexname = ?',
                [$table, $indexName]
            );

            return isset($result->count) && $result->count > 0;
        } catch (\Exception $e) {
            // Se c'è un errore nella query, assumere che l'indice non esista
            return false;
        }
    }

    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Indici per orderorder (tabella ordini)
        if (! $this->indexExists('orderorder', 'orderorder_article_uuid_index')) {
            Schema::table('orderorder', function (Blueprint $table) {
                $table->index('article_uuid', 'orderorder_article_uuid_index');
            });
        }
        if (! $this->indexExists('orderorder', 'orderorder_status_index')) {
            Schema::table('orderorder', function (Blueprint $table) {
                $table->index('status', 'orderorder_status_index');
            });
        }
        if (! $this->indexExists('orderorder', 'orderorder_removed_index')) {
            Schema::table('orderorder', function (Blueprint $table) {
                $table->index('removed', 'orderorder_removed_index');
            });
        }
        if (! $this->indexExists('orderorder', 'orderorder_removed_status_index')) {
            Schema::table('orderorder', function (Blueprint $table) {
                $table->index(['removed', 'status'], 'orderorder_removed_status_index');
            });
        }
        if (! $this->indexExists('orderorder', 'orderorder_order_production_number_index')) {
            Schema::table('orderorder', function (Blueprint $table) {
                $table->index('order_production_number', 'orderorder_order_production_number_index');
            });
        }

        // Índices para articles
        if (! $this->indexExists('articles', 'articles_offer_uuid_index')) {
            Schema::table('articles', function (Blueprint $table) {
                $table->index('offer_uuid', 'articles_offer_uuid_index');
            });
        }
        if (! $this->indexExists('articles', 'articles_article_category_index')) {
            Schema::table('articles', function (Blueprint $table) {
                $table->index('article_category', 'articles_article_category_index');
            });
        }
        if (! $this->indexExists('articles', 'articles_removed_index')) {
            Schema::table('articles', function (Blueprint $table) {
                $table->index('removed', 'articles_removed_index');
            });
        }
        if (! $this->indexExists('articles', 'articles_removed_offer_uuid_index')) {
            Schema::table('articles', function (Blueprint $table) {
                $table->index(['removed', 'offer_uuid'], 'articles_removed_offer_uuid_index');
            });
        }
        if (! $this->indexExists('articles', 'articles_cod_article_las_index')) {
            Schema::table('articles', function (Blueprint $table) {
                $table->index('cod_article_las', 'articles_cod_article_las_index');
            });
        }

        // Índices para offer
        if (! $this->indexExists('offer', 'offer_customer_uuid_index')) {
            Schema::table('offer', function (Blueprint $table) {
                $table->index('customer_uuid', 'offer_customer_uuid_index');
            });
        }
        if (! $this->indexExists('offer', 'offer_customerdivision_uuid_index')) {
            Schema::table('offer', function (Blueprint $table) {
                $table->index('customerdivision_uuid', 'offer_customerdivision_uuid_index');
            });
        }
        if (! $this->indexExists('offer', 'offer_removed_index')) {
            Schema::table('offer', function (Blueprint $table) {
                $table->index('removed', 'offer_removed_index');
            });
        }
        if (! $this->indexExists('offer', 'offer_removed_customer_uuid_index')) {
            Schema::table('offer', function (Blueprint $table) {
                $table->index(['removed', 'customer_uuid'], 'offer_removed_customer_uuid_index');
            });
        }

        // Índices para customer
        if (! $this->indexExists('customer', 'customer_removed_index')) {
            Schema::table('customer', function (Blueprint $table) {
                $table->index('removed', 'customer_removed_index');
            });
        }
        if (! $this->indexExists('customer', 'customer_code_index')) {
            Schema::table('customer', function (Blueprint $table) {
                $table->index('code', 'customer_code_index');
            });
        }

        // Índices para customerdivision
        if (! $this->indexExists('customerdivision', 'customerdivision_customer_uuid_index')) {
            Schema::table('customerdivision', function (Blueprint $table) {
                $table->index('customer_uuid', 'customerdivision_customer_uuid_index');
            });
        }
        if (! $this->indexExists('customerdivision', 'customerdivision_removed_index')) {
            Schema::table('customerdivision', function (Blueprint $table) {
                $table->index('removed', 'customerdivision_removed_index');
            });
        }

        // Índices para employee
        if (! $this->indexExists('employee', 'employee_removed_index')) {
            Schema::table('employee', function (Blueprint $table) {
                $table->index('removed', 'employee_removed_index');
            });
        }
        if (! $this->indexExists('employee', 'employee_portal_enabled_index')) {
            Schema::table('employee', function (Blueprint $table) {
                $table->index('portal_enabled', 'employee_portal_enabled_index');
            });
        }
        if (! $this->indexExists('employee', 'employee_matriculation_number_index')) {
            Schema::table('employee', function (Blueprint $table) {
                $table->index('matriculation_number', 'employee_matriculation_number_index');
            });
        }

        // Índices para offerorderemployee
        if (! $this->indexExists('offerorderemployee', 'offerorderemployee_order_uuid_index')) {
            Schema::table('offerorderemployee', function (Blueprint $table) {
                $table->index('order_uuid', 'offerorderemployee_order_uuid_index');
            });
        }
        if (! $this->indexExists('offerorderemployee', 'offerorderemployee_employee_uuid_index')) {
            Schema::table('offerorderemployee', function (Blueprint $table) {
                $table->index('employee_uuid', 'offerorderemployee_employee_uuid_index');
            });
        }
        if (! $this->indexExists('offerorderemployee', 'offerorderemployee_removed_index')) {
            Schema::table('offerorderemployee', function (Blueprint $table) {
                $table->index('removed', 'offerorderemployee_removed_index');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orderorder', function (Blueprint $table) {
            if ($this->indexExists('orderorder', 'orderorder_article_uuid_index')) {
                $table->dropIndex('orderorder_article_uuid_index');
            }
            if ($this->indexExists('orderorder', 'orderorder_status_index')) {
                $table->dropIndex('orderorder_status_index');
            }
            if ($this->indexExists('orderorder', 'orderorder_removed_index')) {
                $table->dropIndex('orderorder_removed_index');
            }
            if ($this->indexExists('orderorder', 'orderorder_removed_status_index')) {
                $table->dropIndex('orderorder_removed_status_index');
            }
            if ($this->indexExists('orderorder', 'orderorder_order_production_number_index')) {
                $table->dropIndex('orderorder_order_production_number_index');
            }
        });

        Schema::table('articles', function (Blueprint $table) {
            if ($this->indexExists('articles', 'articles_offer_uuid_index')) {
                $table->dropIndex('articles_offer_uuid_index');
            }
            if ($this->indexExists('articles', 'articles_article_category_index')) {
                $table->dropIndex('articles_article_category_index');
            }
            if ($this->indexExists('articles', 'articles_removed_index')) {
                $table->dropIndex('articles_removed_index');
            }
            if ($this->indexExists('articles', 'articles_removed_offer_uuid_index')) {
                $table->dropIndex('articles_removed_offer_uuid_index');
            }
            if ($this->indexExists('articles', 'articles_cod_article_las_index')) {
                $table->dropIndex('articles_cod_article_las_index');
            }
        });

        Schema::table('offer', function (Blueprint $table) {
            if ($this->indexExists('offer', 'offer_customer_uuid_index')) {
                $table->dropIndex('offer_customer_uuid_index');
            }
            if ($this->indexExists('offer', 'offer_customerdivision_uuid_index')) {
                $table->dropIndex('offer_customerdivision_uuid_index');
            }
            if ($this->indexExists('offer', 'offer_removed_index')) {
                $table->dropIndex('offer_removed_index');
            }
            if ($this->indexExists('offer', 'offer_removed_customer_uuid_index')) {
                $table->dropIndex('offer_removed_customer_uuid_index');
            }
        });

        Schema::table('customer', function (Blueprint $table) {
            if ($this->indexExists('customer', 'customer_removed_index')) {
                $table->dropIndex('customer_removed_index');
            }
            if ($this->indexExists('customer', 'customer_code_index')) {
                $table->dropIndex('customer_code_index');
            }
        });

        Schema::table('customerdivision', function (Blueprint $table) {
            if ($this->indexExists('customerdivision', 'customerdivision_customer_uuid_index')) {
                $table->dropIndex('customerdivision_customer_uuid_index');
            }
            if ($this->indexExists('customerdivision', 'customerdivision_removed_index')) {
                $table->dropIndex('customerdivision_removed_index');
            }
        });

        Schema::table('employee', function (Blueprint $table) {
            if ($this->indexExists('employee', 'employee_removed_index')) {
                $table->dropIndex('employee_removed_index');
            }
            if ($this->indexExists('employee', 'employee_portal_enabled_index')) {
                $table->dropIndex('employee_portal_enabled_index');
            }
            if ($this->indexExists('employee', 'employee_matriculation_number_index')) {
                $table->dropIndex('employee_matriculation_number_index');
            }
        });

        Schema::table('offerorderemployee', function (Blueprint $table) {
            if ($this->indexExists('offerorderemployee', 'offerorderemployee_order_uuid_index')) {
                $table->dropIndex('offerorderemployee_order_uuid_index');
            }
            if ($this->indexExists('offerorderemployee', 'offerorderemployee_employee_uuid_index')) {
                $table->dropIndex('offerorderemployee_employee_uuid_index');
            }
            if ($this->indexExists('offerorderemployee', 'offerorderemployee_removed_index')) {
                $table->dropIndex('offerorderemployee_removed_index');
            }
        });
    }
};
