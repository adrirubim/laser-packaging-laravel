# Test Database Configuration

**Last updated:** 2026-01-28

Tests run against **PostgreSQL** to match the production environment. The connection is configured in `phpunit.xml`.

## Create the Test Database

1. Connect to PostgreSQL as user `postgres`:

```bash
psql -U postgres
```

2. Create the test database:

```sql
CREATE DATABASE laser_packaging_test;
```

Or run the SQL script included in the project:

```bash
psql -U postgres -f CREATE_TEST_DATABASE.sql
```

3. Verify that the database was created:

```bash
psql -U postgres -l
```

## Connection configuration

The test credentials live in **`phpunit.xml`** (the `<php><env>...</env></php>` section):

| Variable   | Default value          | Description        |
|-----------|-------------------------|--------------------|
| `DB_CONNECTION` | `pgsql`           | Driver             |
| `DB_DATABASE`   | `laser_packaging_test` | Database name |
| `DB_USERNAME`   | `postgres`        | User               |
| `DB_PASSWORD`   | empty by default  | Password (set in `.env.testing` if your PostgreSQL requires it) |

If your environment uses a different user/password, create **`.env.testing`** in the project root (it is not committed). PHPUnit loads `.env.testing` when `APP_ENV=testing`.

## Migrations

Before running the tests for the first time, you can apply migrations on the test environment:

```bash
php artisan migrate --env=testing
```

Tests that use the **`RefreshDatabase`** trait will run migrations automatically; running them manually is optional if all tests use that trait.

## Running the tests

```bash
php artisan test
```

For tests that render Inertia (Vite) views, generate the build first:

```bash
npm run build
php artisan test
```

## Notes

- The test database is automatically cleaned after each test thanks to the `RefreshDatabase` trait.
- The test database is independent from development/production databases.
- See **`README_SEED_TEST_DATA.md`** for demo data (seeder); the seeder is used in development, not in the PHPUnit test database.
