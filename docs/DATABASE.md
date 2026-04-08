# Database Setup

Database configuration for development and testing.

---

## Test Database

Tests run against a **separate PostgreSQL database** to avoid touching development data.

Configuration is split between:

- `phpunit.xml` (DB name, host for the test process)
- `.env.testing` (full connection details for `--env=testing` artisan commands)

### Quick setup

1. Create the database:
   ```bash
   psql -U postgres -c "CREATE DATABASE laser_packaging_test;"
   ```

2. Create `.env.testing` (not committed to git) with your local credentials, for example:
   ```env
   APP_ENV=testing

   DB_CONNECTION=pgsql
   DB_HOST=127.0.0.1
   DB_PORT=5432
   DB_DATABASE=laser_packaging_test
   DB_USERNAME=postgres
   DB_PASSWORD=Passw0rd1!

   SESSION_DRIVER=array
   QUEUE_CONNECTION=sync
   CACHE_STORE=array
   MAIL_MAILER=array
   ```

3. Run migrations **only on the test database**:
   ```bash
   php artisan migrate:fresh --env=testing
   ```

4. Run tests (they will also use `laser_packaging_test`):
   ```bash
   php artisan test --compact
   ```

---

## Demo Data (Development)

To seed demo data for dashboard and flows:

```bash
php artisan db:seed --class=TestDataSeeder
```

This creates customers, offers, articles, orders in various statuses, and planning data. Use only on the development database.

### Verification

```bash
php artisan test --compact tests/Feature/Flows/DemoAllSectionsVerificationTest.php
```
