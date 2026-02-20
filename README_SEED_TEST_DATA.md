# Demo / Test Data for the Dashboard

**Quick start:** Run `php artisan db:seed --class=TestDataSeeder` (development database only). This creates customers, offers, articles, orders in all statuses, planning data, and DEMO-ALL records for verification.

**Extended documentation** (data created, DEMO-ALL table, flows, verification) is maintained locally and is not part of the repository.

**Verification test:** `php artisan test tests/Feature/Flows/DemoAllSectionsVerificationTest.php`
