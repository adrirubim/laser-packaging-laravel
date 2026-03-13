<?php

require __DIR__.'/../vendor/autoload.php';

$app = require_once __DIR__.'/../bootstrap/app.php';
$app->make(Kernel::class)->bootstrap();

use Illuminate\Contracts\Console\Kernel;
use Illuminate\Support\Facades\DB;

echo "🔍 Verificando columnas en la tabla machinery...\n\n";

// Obtener columnas actuales
$columns = DB::select("SELECT column_name FROM information_schema.columns WHERE table_name = 'machinery' ORDER BY ordinal_position");
$columnNames = array_column($columns, 'column_name');
echo 'Columnas actuales: '.implode(', ', $columnNames)."\n\n";

// Agregar columna 'parameter' si no existe
if (! in_array('parameter', $columnNames)) {
    echo "➕ Agregando columna 'parameter'...\n";
    try {
        DB::statement('ALTER TABLE machinery ADD COLUMN parameter VARCHAR(255) NULL');
        echo "✅ Columna 'parameter' agregada exitosamente\n\n";
    } catch (Exception $e) {
        echo "❌ Error al agregar 'parameter': ".$e->getMessage()."\n\n";
    }
} else {
    echo "✅ Columna 'parameter' ya existe\n\n";
}

// Agregar columna 'value_type_uuid' si no existe
if (! in_array('value_type_uuid', $columnNames)) {
    echo "➕ Agregando columna 'value_type_uuid'...\n";
    try {
        DB::statement('ALTER TABLE machinery ADD COLUMN value_type_uuid INTEGER NULL');
        echo "✅ Columna 'value_type_uuid' agregada exitosamente\n\n";

        // Add index
        echo "➕ Agregando índice en 'value_type_uuid'...\n";
        try {
            DB::statement('CREATE INDEX IF NOT EXISTS machinery_value_type_uuid_index ON machinery(value_type_uuid)');
            echo "✅ Índice agregado exitosamente\n\n";
        } catch (Exception $e) {
            echo '⚠️  Advertencia al agregar índice: '.$e->getMessage()."\n\n";
        }
    } catch (Exception $e) {
        echo "❌ Error al agregar 'value_type_uuid': ".$e->getMessage()."\n\n";
    }
} else {
    echo "✅ Columna 'value_type_uuid' ya existe\n\n";
}

// Verify final columns
$columnsAfter = DB::select("SELECT column_name FROM information_schema.columns WHERE table_name = 'machinery' ORDER BY ordinal_position");
$columnNamesAfter = array_column($columnsAfter, 'column_name');
echo '📋 Columnas finales: '.implode(', ', $columnNamesAfter)."\n\n";

if (in_array('parameter', $columnNamesAfter) && in_array('value_type_uuid', $columnNamesAfter)) {
    echo "✅ ¡Todas las columnas están presentes! Ahora puedes ejecutar el seeder.\n";
} else {
    echo "❌ Algunas columnas aún faltan. Revisa los errores arriba.\n";
}
