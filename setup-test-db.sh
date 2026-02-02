#!/bin/bash

# Script para configurar la base de datos de test en PostgreSQL

echo "Configurando base de datos de test para PostgreSQL..."

# Variables de configuración (ajustar según tu entorno)
DB_NAME="laser_packaging_test"
DB_USER="postgres"
DB_HOST="localhost"
DB_PORT="5432"

# Verificar si PostgreSQL está disponible
if ! command -v psql &> /dev/null; then
    echo "Error: psql no está instalado o no está en el PATH"
    exit 1
fi

# Crear la base de datos de test
echo "Creando base de datos '$DB_NAME'..."
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -c "CREATE DATABASE $DB_NAME;" 2>/dev/null

if [ $? -eq 0 ]; then
    echo "✓ Base de datos '$DB_NAME' creada exitosamente"
elif [ $? -eq 1 ]; then
    echo "⚠ La base de datos '$DB_NAME' ya existe (esto está bien)"
else
    echo "✗ Error al crear la base de datos. Verifica las credenciales de PostgreSQL."
    exit 1
fi

echo ""
echo "Base de datos de test configurada correctamente."
echo "Ahora puedes ejecutar los tests con: php artisan test"
