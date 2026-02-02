# Configuración de Base de Datos de Test

**Última actualización:** 2026-01-28

Los tests se ejecutan en **PostgreSQL** para asegurar compatibilidad con el entorno de producción. La conexión se configura en `phpunit.xml`.

## Crear la Base de Datos de Test

1. Conectarse a PostgreSQL como usuario `postgres`:

```bash
psql -U postgres
```

2. Crear la base de datos de test:

```sql
CREATE DATABASE laser_packaging_test;
```

O ejecutar el script SQL incluido en el proyecto:

```bash
psql -U postgres -f CREATE_TEST_DATABASE.sql
```

3. Verificar que la base de datos se creó:

```bash
psql -U postgres -l
```

## Configuración de conexión

Las credenciales de test están en **`phpunit.xml`** (bloque `<php><env>...`):

| Variable   | Valor por defecto      | Descripción        |
|-----------|-------------------------|--------------------|
| `DB_CONNECTION` | `pgsql`           | Driver             |
| `DB_DATABASE`   | `laser_packaging_test` | Nombre de la BD   |
| `DB_USERNAME`   | `postgres`        | Usuario            |
| `DB_PASSWORD`   | vacía por defecto   | Contraseña (configurar en `.env.testing` si tu PostgreSQL la requiere) |

Si tu entorno usa otro usuario/contraseña, crea **`.env.testing`** en la raíz (no se sube al repo). PHPUnit carga `.env.testing` cuando `APP_ENV=testing`.

## Migraciones

Antes de ejecutar los tests por primera vez, aplicar migraciones en el entorno de test:

```bash
php artisan migrate --env=testing
```

Los tests que usan el trait **`RefreshDatabase`** ejecutan las migraciones automáticamente; no es obligatorio migrar a mano si todos los tests usan ese trait.

## Ejecutar los Tests

```bash
php artisan test
```

Para tests que renderizan vistas Inertia (Vite), generar antes el build:

```bash
npm run build
php artisan test
```

## Notas

- La base de datos de test se limpia automáticamente después de cada test gracias al trait `RefreshDatabase`.
- La base de datos de test es independiente de la de desarrollo/producción.
- Ver **`README_SEED_TEST_DATA.md`** para datos de prueba (seeder); el seeder se usa en entorno de desarrollo, no en la BD de test de PHPUnit.
