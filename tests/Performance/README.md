# Tests de Performance

Este directorio contiene tests de performance para validar que el sistema soporte cargas reales y para detectar oportunidades de optimización.

## Suites

### 1. ConcurrencyTest.php
Tests concurrentes para asegurar integridad de datos bajo carga.

**Tests:**
- `test_concurrent_production_number_generation()` - 50 concurrent production number generations
- `test_concurrent_offer_number_generation()` - 30 concurrent offer number generations
- `test_concurrent_las_code_generation()` - 20 concurrent LAS code generations
- `test_concurrent_order_processing_updates()` - Concurrent order processing updates

**Objetivos:**
- Production number generation: < 5 seconds for 50 iterations
- Offer number generation: < 3 seconds for 30 iterations
- LAS code generation: < 3 seconds for 20 iterations
- Order processing updates: < 2 seconds for 10 concurrent updates

### 2. LoadTest.php
Tests con datasets grandes para detectar cuellos de botella.

**Tests:**
- `test_orders_index_with_large_dataset()` - 1000 orders, target < 500ms
- `test_offers_index_with_large_dataset()` - 500 offers, target < 500ms
- `test_articles_index_with_large_dataset()` - 1000 articles, target < 500ms
- `test_search_performance_with_large_dataset()` - Search with 1000+ records, target < 300ms
- `test_pagination_performance()` - Pagination with 2000 records, target < 500ms per page
- `test_relationship_loading_performance()` - Eager loading performance, target < 200ms

**Objetivos:**
- Index pages: < 500ms with 1000+ records
- Search: < 300ms with 1000+ records
- Pagination: < 500ms for any page
- Relationship loading: < 200ms for 50 records with relationships

### 3. ApiResponseTimeTest.php
Tests de endpoints del Production Portal para tiempos de respuesta aceptables.

**Tests:**
- `test_authentication_endpoint_response_time()` - Target < 500ms
- `test_login_endpoint_response_time()` - Target < 300ms
- `test_get_employee_order_list_response_time()` - Target < 500ms with 50 orders
- `test_get_order_info_response_time()` - Target < 300ms
- `test_add_pallet_quantity_response_time()` - Target < 400ms
- `test_add_manual_quantity_response_time()` - Target < 400ms
- `test_concurrent_api_requests()` - 10 concurrent requests, target < 3 seconds total

**Performance Targets:**
- Authentication: < 500ms
- Login: < 300ms
- Order list: < 500ms
- Order info: < 300ms
- Processing endpoints: < 400ms
- Concurrent requests: < 3 seconds for 10 requests

## Ejecutar tests de performance

### Ejecutar todos:
```bash
php artisan test --testsuite=Performance
```

### Ejecutar una clase:
```bash
php artisan test tests/Performance/ConcurrencyTest.php
php artisan test tests/Performance/LoadTest.php
php artisan test tests/Performance/ApiResponseTimeTest.php
```

### Ejecutar un test puntual:
```bash
php artisan test --filter test_concurrent_production_number_generation
php artisan test --filter test_orders_index_with_large_dataset
```

## Baselines

Estos tests establecen baselines. Si fallan:

1. **Check database indexes** - Ensure proper indexes on frequently queried columns
2. **Review query optimization** - Use eager loading, avoid N+1 queries
3. **Check server resources** - CPU, memory, database connection pool
4. **Review code** - Look for inefficient algorithms or loops

## Notas

- Performance tests use PostgreSQL (configured in `phpunit.xml`)
- Tests use `RefreshDatabase` trait for automatic cleanup
- These tests focus on response times, not absolute throughput
- Adjust performance targets based on actual production requirements
- See `README_TEST_DATABASE.md` for database setup instructions

## Futuras mejoras

- Add memory usage tracking
- Add database query count assertions
- Add stress testing (gradual load increase)
- Add spike testing (sudden load increase)
- Add endurance testing (sustained load over time)
