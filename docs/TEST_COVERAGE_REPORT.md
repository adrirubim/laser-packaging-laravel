# Test & Coverage Report (summary)

**Last updated:** 2026-02-05  
**Stack (exact versions):** [VERSION_STACK.md](VERSION_STACK.md)

> This document is intentionally **short**. The goal is to explain **what** is tested and **how** to run tests in a reproducible way.

## How to run the tests

In this project, many Feature tests render the Inertia layout that uses `@vite()`.  
If you see errors like **“Unable to locate file in Vite manifest …”**, generate the build first:

```bash
npm run build
php artisan test
```

### Available suites

```bash
php artisan test --testsuite=Unit
php artisan test --testsuite=Feature
php artisan test --testsuite=Performance
```

## Coverage by component

| Component | Total | With dedicated tests | Notes |
|-----------|-------|----------------------|-------|
| **HTTP Controllers** | 39 | 39 (100%) | Each controller has a `*ControllerTest.php` in Feature/Controllers, Feature/Api or Feature/Settings. |
| **Services** | 6 | 6 (100%) | ArticleCodeService, InstructionCodeService, OfferNumberService, OrderProductionNumberService, PalletCalculationService, ProductionCalculationService — all with Unit tests. |
| **Repositories** | 7 | 7 (100%) | Unit: ArticleRepository, CustomerRepository, CustomerDivisionRepository, CustomerShippingAddressRepository, DashboardRepository, OfferRepository, OrderRepository (all in `tests/Unit/Repositories/`). |
| **Actions** | 8 + Fortify | 5 (partial) | `CreateOfferAction`, `UpdateOfferAction`, `CreateOrderAction`, `UpdateOrderAction`, `SyncOrderEmployeesAction` have direct Unit tests; the others are covered indirectly via Feature tests. |
| **Production Portal API** | 1 controller | 1 (100%) | `Feature/Api/ProductionPortalControllerTest.php`. |
| **Auth / Settings** | 8 | 8 (100%) | Authentication, Registration, PasswordReset, EmailVerification, etc.; Settings: ProfileUpdate, PasswordUpdate, TwoFactorAuthentication. |
| **E2E Flows** | 1 | 1 | `Feature/Flows/OfferArticleOrderFlowTest.php` (offer → article → order → portal). |
| **Performance** | 3 | 3 (100%) | ConcurrencyTest, LoadTest, ApiResponseTimeTest (see `tests/Performance/README.md`). |
| **Models** | many | 3 Unit | `Unit/Models/OfferRelationsTest.php`, `OrderModelTest.php`, `MachineryModelTest.php`; the other models are exercised by Feature tests. |

**Summary:**  
- **Controllers, services and repositories:** **100%** covered (each has dedicated tests).  
- **Actions:** the main Actions for offers/orders and employee sync (`CreateOfferAction`, `UpdateOfferAction`, `CreateOrderAction`, `UpdateOrderAction`, `SyncOrderEmployeesAction`) have dedicated Unit tests in addition to indirect Feature coverage.  
- **Models:** besides `OfferRelationsTest`, there are Unit tests for `Order` (`OrderModelTest`) and `Machinery` (`MachineryModelTest`) that verify key relations, scopes and accessors; the rest of the models are covered through Feature tests.  
- The project has tests for **all** controllers, services, repositories, API, flows and performance suites.

## Note on automatic “coverage” reports

On some PHP NTS environments, automatic coverage reporting (Xdebug/PCOV) may not be available.  
In that case, coverage is validated by:

- existence of tests for key controllers/services/repositories
- behavioural assertions (HTTP, validation, relations, files, filters, pagination)

To generate a coverage report (if PCOV/Xdebug is available):

```bash
php artisan test --coverage
# or per suite
php artisan test --testsuite=Unit --coverage
```

## What is tested (summary)

- **Unit**: services for generation/calculation (codes, sequential numbers, production/pallet calculations); Dashboard/Offer repositories; Offer model relations.
- **Feature**: controller CRUD, validation, filters, pagination, soft deletes, AJAX endpoints (all controllers listed in the table above).
- **API**: Production Portal (auth/token, production actions, status validation).
- **Flows**: end-to-end flows (offer → article → order → portal).
- **Performance**: concurrency, response times and load (see `tests/Performance/README.md`).

## Current coverage (100% on critical components)

- **Repositories:** all 7 have Unit tests: `ArticleRepositoryTest`, `CustomerRepositoryTest`, `CustomerDivisionRepositoryTest`, `CustomerShippingAddressRepositoryTest`, `DashboardRepositoryTest`, `OfferRepositoryTest`, `OrderRepositoryTest`.
- **Actions:** the main Actions for offers/orders and employee sync (`CreateOfferAction`, `UpdateOfferAction`, `CreateOrderAction`, `UpdateOrderAction`, `SyncOrderEmployeesAction`) have dedicated Unit tests plus indirect Feature coverage.
- **Models:** besides `OfferRelationsTest`, there are Unit tests for `Order` (`OrderModelTest`) and `Machinery` (`MachineryModelTest`) that verify important relations, scopes and accessors.

