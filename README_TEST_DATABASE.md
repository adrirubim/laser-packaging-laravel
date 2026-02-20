# Test Database Configuration

Tests run against **PostgreSQL**. The connection is configured in `phpunit.xml`.

**Quick setup:**

1. Create the database: `psql -U postgres -c "CREATE DATABASE laser_packaging_test;"` (or use `CREATE_TEST_DATABASE.sql`).
2. Run migrations: `php artisan migrate:fresh --env=testing`.
3. Run tests: `./vendor/bin/phpunit`.

Optional: create **`.env.testing`** in the project root if your PostgreSQL setup requires a user or password (this file is not committed).

**Extended details** (connection table, migrations, notes) are maintained locally and are not part of the repository.
