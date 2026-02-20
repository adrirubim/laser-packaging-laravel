# Test Coverage

**Stack:** [VERSION_STACK.md](VERSION_STACK.md) · **Suite:** 994 tests, 6682+ assertions (Unit, Feature, Performance).

## How to Run

Feature tests use Inertia + Vite. If you see *"Unable to locate file in Vite manifest"*, run:

```bash
npm run build
php artisan test
```

Suites: `--testsuite=Unit` | `--testsuite=Feature` | `--testsuite=Performance`

## Coverage by Component

| Component | Total | Covered | Notes |
|-----------|-------|---------|-------|
| **HTTP Controllers** | 40 | 40 | Feature/Controllers, Api, Settings; includes PlanningController. |
| **Services** | 10 | 10 | Codes, numbers, pallet/production calculations; Planning: Data, Replan, Calculation, Write. |
| **Repositories** | 7 | 7 | Article, Customer, Division, Shipping, Dashboard, Offer, Order. |
| **Actions** | 8 + Fortify | 5 direct | Create/Update Offer/Order, SyncOrderEmployees have Unit tests; others via Feature. |
| **Production Portal API** | 1 | 1 | ProductionPortalControllerTest. |
| **Auth / Settings** | 8 | 8 | Fortify + Profile, Password, 2FA. |
| **E2E Flows** | 1 | 1 | OfferArticleOrderFlowTest. |
| **Performance** | 3 | 3 | Concurrency, Load, ApiResponseTime. |
| **Models** | many | 3 Unit | OfferRelations, Order, Machinery; rest via Feature. |

Coverage report (when PCOV/Xdebug available): `php artisan test --coverage`.
