# Database Setup

Database configuration for development and testing.

---

## Test Database

Tests run against **PostgreSQL**. Configuration is in `phpunit.xml`.

### Quick setup

1. Create the database:
   ```bash
   psql -U postgres -c "CREATE DATABASE laser_packaging_test;"
   ```

2. Run migrations:
   ```bash
   php artisan migrate:fresh --env=testing
   ```

3. Run tests:
   ```bash
   php artisan test
   ```

Optional: create `.env.testing` in the project root if your setup requires custom credentials (this file is not committed).

---

## Demo Data (Development)

To seed demo data for dashboard and flows:

```bash
php artisan db:seed --class=TestDataSeeder
```

This creates customers, offers, articles, orders in various statuses, and planning data. Use only on the development database.

### Verification

```bash
php artisan test tests/Feature/Flows/DemoAllSectionsVerificationTest.php
```
