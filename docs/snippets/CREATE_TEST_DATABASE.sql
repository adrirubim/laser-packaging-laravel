-- Script para crear la base de datos de test para PostgreSQL
-- Ejecutar como usuario postgres: psql -U postgres -f CREATE_TEST_DATABASE.sql

-- Crear base de datos de test
CREATE DATABASE laser_packaging_test;

-- Comentario
COMMENT ON DATABASE laser_packaging_test IS 'Base de datos de test para laser-packaging-laravel';
