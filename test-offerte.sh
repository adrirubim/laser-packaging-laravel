#!/bin/bash

# Script para ejecutar todos los tests de la sección "Offerte"
# Incluye todos los subdirectorios y módulos relacionados

echo "=========================================="
echo "Ejecutando tests de la sección OFFERTE"
echo "=========================================="
echo ""

# Lista de todos los tests de Offerte
TESTS=(
    "tests/Feature/Controllers/OfferActivityControllerTest.php"
    "tests/Feature/Controllers/OfferSectorControllerTest.php"
    "tests/Feature/Controllers/OfferSeasonalityControllerTest.php"
    "tests/Feature/Controllers/LasFamilyControllerTest.php"
    "tests/Feature/Controllers/LasWorkLineControllerTest.php"
    "tests/Feature/Controllers/LsResourceControllerTest.php"
    "tests/Feature/Controllers/OfferOrderTypeControllerTest.php"
    "tests/Feature/Controllers/OfferOperationCategoryControllerTest.php"
    "tests/Feature/Controllers/OfferOperationControllerTest.php"
    "tests/Feature/Controllers/OfferControllerTest.php"
)

# Ejecutar todos los tests
php artisan test "${TESTS[@]}" --testdox

echo ""
echo "=========================================="
echo "Tests completados"
echo "=========================================="
