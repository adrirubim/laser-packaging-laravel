# Performance Tests

This directory contains performance tests to validate that the system can handle real‑world load and to detect optimization opportunities.

## Suites

### 1. ConcurrencyTest.php
Concurrent tests to ensure data integrity under load.

**Tests:**
- `test_concurrent_production_number_generation()` – 50 concurrent production number generations
- `test_concurrent_offer_number_generation()` – 30 concurrent offer number generations
- `test_concurrent_las_code_generation()` – 20 concurrent LAS code generations
- `test_concurrent_order_processing_updates()` – concurrent order processing updates

**Targets:**
- Production number generation: < 5 seconds for 50 iterations
- Offer number generation: < 3 seconds for 30 iterations
- LAS code generation: < 3 seconds for 20 iterations
- Order processing updates: < 2 seconds for 10 concurrent updates

### 2. LoadTest.php
Tests with large datasets to detect bottlenecks.

**Tests:**
- `test_orders_index_with_large_dataset()` – 1000 orders, target < 500ms
- `test_offers_index_with_large_dataset()` – 500 offers, target < 500ms
- `test_articles_index_with_large_dataset()` – 1000 articles, target < 500ms
- `test_search_performance_with_large_dataset()` – search with 1000+ records, target < 300ms
- `test_pagination_performance()` – pagination with 2000 records, target < 500ms per page
- `test_relationship_loading_performance()` – eager loading performance, target < 200ms

**Targets:**
- Index pages: < 500ms with 1000+ records
- Search: < 300ms with 1000+ records
- Pagination: < 500ms for any page
- Relationship loading: < 200ms for 50 records with relationships

### 3. ApiResponseTimeTest.php
Tests for Production Portal endpoints to ensure acceptable response times.

**Tests:**
- `test_authentication_endpoint_response_time()` – target < 500ms
- `test_login_endpoint_response_time()` – target < 300ms
- `test_get_employee_order_list_response_time()` – target < 500ms with 50 orders
- `test_get_order_info_response_time()` – target < 300ms
- `test_add_pallet_quantity_response_time()` – target < 400ms
- `test_add_manual_quantity_response_time()` – target < 400ms
- `test_concurrent_api_requests()` – 10 concurrent requests, target < 3 seconds total

**Performance Targets:**
- Authentication: < 500ms
- Login: < 300ms
- Order list: < 500ms
- Order info: < 300ms
- Processing endpoints: < 400ms
- Concurrent requests: < 3 seconds for 10 requests

## Running Performance Tests

### Run all:
```bash
php artisan test --testsuite=Performance
```

### LoadTest and parallel execution
LoadTest (`@group load`) creates large datasets and relies on a fully migrated database. When using parallel testing (`php artisan test --parallel`), LoadTest may fail with database errors (e.g. "relation users does not exist"). Run LoadTest separately:

```bash
# Option 1: Exclude load from parallel, then run load tests
php artisan test --parallel --exclude-group=load
php artisan test --group=load

# Option 2: Use composer scripts
composer test:parallel
composer test:load
```

### Run a single class:
```bash
php artisan test tests/Performance/ConcurrencyTest.php
php artisan test tests/Performance/LoadTest.php
php artisan test tests/Performance/ApiResponseTimeTest.php
```

### Run a single test:
```bash
php artisan test --filter test_concurrent_production_number_generation
php artisan test --filter test_orders_index_with_large_dataset
```

## Baselines

These tests establish baselines. If they start failing:

1. **Check database indexes** – ensure proper indexes on frequently queried columns
2. **Review query optimization** – use eager loading, avoid N+1 queries
3. **Check server resources** – CPU, memory, database connection pool
4. **Review code** – look for inefficient algorithms or loops

## Notes

- Performance tests use PostgreSQL (configured in `phpunit.xml`).
- Tests use the `RefreshDatabase` trait for automatic cleanup.
- These tests focus on response times, not absolute throughput.
- Adjust performance targets based on actual production requirements.
- See [docs/DATABASE.md](../../docs/DATABASE.md) for database setup.

## Future Improvements

- Add memory usage tracking
- Add database query count assertions
- Add stress testing (gradual load increase)
- Add spike testing (sudden load increase)
- Add endurance testing (sustained load over time)
