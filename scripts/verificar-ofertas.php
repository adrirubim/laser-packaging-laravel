<?php

/**
 * Quick verification script for offers form
 *
 * Usage: php artisan tinker < scripts/verificar-ofertas.php
 * Or: php scripts/verificar-ofertas.php (from project root)
 */

require __DIR__.'/../vendor/autoload.php';

$app = require_once __DIR__.'/../bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

echo "=== VERIFICACIÓN DEL FORMULARIO DE OFERTAS ===\n\n";

// 1. Verify last offer created
echo "1. Verificando última oferta creada...\n";
$offer = \App\Models\Offer::latest()->first();

if (! $offer) {
    echo "   ⚠️  No se encontraron ofertas en la base de datos.\n";
    echo "   → Crea una oferta desde el formulario primero.\n\n";
    exit(1);
}

echo "   ✓ Oferta encontrada: {$offer->offer_number}\n";
echo "   - UUID: {$offer->uuid}\n";
echo "   - Fecha: {$offer->offer_date}\n";
echo '   - Validez: '.($offer->validity_date ?? 'null')."\n\n";

// 2. Verificar mapeo de campos
echo "2. Verificando mapeo de campos...\n";
$fields = [
    'customer_uuid' => 'Cliente',
    'customerdivision_uuid' => 'División',
    'activity_uuid' => 'Actividad',
    'sector_uuid' => 'Sector',
    'seasonality_uuid' => 'Estacionalidad',
    'order_type_uuid' => 'Tipo de Orden',
    'lasfamily_uuid' => 'Familia LAS',
    'lasworkline_uuid' => 'Línea de Trabajo LAS',
    'lsresource_uuid' => 'Recurso L&S',
];

$errors = [];
foreach ($fields as $field => $label) {
    if (! isset($offer->$field) || $offer->$field === null) {
        // Some fields are nullable, verify which are required
        if (in_array($field, ['customer_uuid', 'activity_uuid', 'sector_uuid', 'seasonality_uuid', 'order_type_uuid', 'lasfamily_uuid', 'lasworkline_uuid'])) {
            $errors[] = "   ✗ {$label} ({$field}) está vacío pero debería estar presente";
        } else {
            echo "   ⚠️  {$label} ({$field}) está vacío (nullable)\n";
        }
    } else {
        echo "   ✓ {$label}: {$offer->$field}\n";
    }
}

if (! empty($errors)) {
    echo "\n   ERRORES ENCONTRADOS:\n";
    foreach ($errors as $error) {
        echo $error."\n";
    }
} else {
    echo "   ✓ Todos los campos requeridos están presentes\n";
}
echo "\n";

// 3. Verificar relaciones
echo "3. Verificando relaciones...\n";

// Cliente
if ($offer->customer) {
    echo "   ✓ Cliente: {$offer->customer->company_name}\n";
} else {
    echo "   ✗ Cliente: No se encontró la relación\n";
}

// Division
if ($offer->customerDivision) {
    echo "   ✓ División: {$offer->customerDivision->name}\n";
} else {
    echo "   ⚠️  División: No hay división asociada (puede ser normal)\n";
}

// Actividad
if ($offer->activity) {
    echo "   ✓ Actividad: {$offer->activity->name}\n";
} else {
    echo "   ✗ Actividad: No se encontró la relación\n";
}

// Sector
if ($offer->sector) {
    echo "   ✓ Sector: {$offer->sector->name}\n";
} else {
    echo "   ✗ Sector: No se encontró la relación\n";
}

// Estacionalidad
if ($offer->seasonality) {
    echo "   ✓ Estacionalidad: {$offer->seasonality->name}\n";
} else {
    echo "   ✗ Estacionalidad: No se encontró la relación\n";
}

// Tipo de Orden
if ($offer->typeOrder) {
    echo "   ✓ Tipo de Orden: {$offer->typeOrder->name}\n";
} else {
    echo "   ✗ Tipo de Orden: No se encontró la relación\n";
}

// Familia LAS
if ($offer->lasFamily) {
    echo "   ✓ Familia LAS: {$offer->lasFamily->name}\n";
} else {
    echo "   ✗ Familia LAS: No se encontró la relación\n";
}

// LAS Work Line
if ($offer->lasWorkLine) {
    echo "   ✓ Línea de Trabajo LAS: {$offer->lasWorkLine->name}\n";
} else {
    echo "   ✗ Línea de Trabajo LAS: No se encontró la relación\n";
}

// Recurso L&S
if ($offer->lsResource) {
    echo "   ✓ Recurso L&S: {$offer->lsResource->name}\n";
} else {
    echo "   ⚠️  Recurso L&S: No hay recurso asociado (puede ser normal)\n";
}

echo "\n";

// 4. Verificar operaciones
echo "4. Verificando operaciones...\n";
$operations = $offer->operationList;

if ($operations->count() > 0) {
    echo "   ✓ Se encontraron {$operations->count()} operación(es):\n";
    foreach ($operations as $op) {
        $operation = $op->operation;
        $operationName = $operation ? $operation->name : 'N/A';
        echo "      - {$operationName} (N° Op: {$op->num_op})\n";
    }
} else {
    echo "   ⚠️  No se encontraron operaciones asociadas\n";
    echo "   → Esto puede ser normal si no se agregaron operaciones al crear la oferta\n";
}
echo "\n";

// 5. Verify articles
echo "5. Verificando artículos...\n";
$articlesDirect = $offer->articlesDirect;
$articlesPivot = $offer->articles;

echo "   - Artículos directos (offer_uuid): {$articlesDirect->count()}\n";
echo "   - Artículos pivot (offerarticles): {$articlesPivot->count()}\n";

$allArticles = $offer->articles->merge($offer->articlesDirect)->unique('uuid');
echo "   - Total artículos únicos: {$allArticles->count()}\n";

if ($allArticles->count() > 0) {
    echo "   ✓ Artículos encontrados:\n";
    foreach ($allArticles as $article) {
        echo "      - {$article->cod_article_las}";
        if ($article->article_descr) {
            echo " - {$article->article_descr}";
        }
        echo "\n";
    }
} else {
    echo "   ⚠️  No hay artículos asociados (esto es normal, los artículos se crean por separado)\n";
}
echo "\n";

// 6. Verify numeric fields
echo "6. Verificando campos numéricos...\n";
$numericFields = [
    'quantity' => 'Cantidad',
    'piece' => 'Piezas',
    'declared_weight_cfz' => 'Peso declarado CFZ',
    'declared_weight_pz' => 'Peso declarado PZ',
    'expected_workers' => 'Trabajadores esperados',
    'expected_revenue' => 'Ingresos esperados',
    'rate_cfz' => 'Tarifa CFZ',
    'rate_pz' => 'Tarifa PZ',
];

foreach ($numericFields as $field => $label) {
    if ($offer->$field !== null) {
        echo "   ✓ {$label}: {$offer->$field}\n";
    }
}
echo "\n";

// 7. Resumen
echo "=== RESUMEN ===\n";
echo "Oferta verificada: {$offer->offer_number}\n";
echo "UUID: {$offer->uuid}\n";
echo "URL de detalles: http://localhost:8000/offers/{$offer->uuid}\n";
echo "\n";

if (empty($errors)) {
    echo "✓ La oferta parece estar correctamente configurada.\n";
    echo "  Revisa manualmente el formulario y la vista de detalles para confirmar.\n";
} else {
    echo "⚠️  Se encontraron algunos problemas. Revisa los errores arriba.\n";
}
