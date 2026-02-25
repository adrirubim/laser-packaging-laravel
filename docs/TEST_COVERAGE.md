# Test Coverage

**Stack:** [VERSION_STACK.md](VERSION_STACK.md) · **Suite:** 1017+ PHP tests (Unit, Feature, Performance), 24 Vitest tests (React/Planning).

## How to Run

Feature tests use Inertia + Vite. If you see *"Unable to locate file in Vite manifest"*, run:

```bash
npm run build
php artisan test
```

**Full pre-push pipeline** (matches GitHub CI):

```bash
php scripts/i18n-check.php && ./vendor/bin/pint && npm run format && npm run format:check && npm run lint && npm run types && php artisan config:clear && php artisan test && npm run test -- --run && npm run build
```

**Suites:** `--testsuite=Unit` | `--testsuite=Feature` | `--testsuite=Performance` · **Vitest:** `npm run test -- --run`

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

**Vitest (frontend):** Planning and other React tests in `resources/js/pages/**/*.test.tsx` — run with `npm run test -- --run`. Included in CI.

Performance suites (Concurrency, Load, API response time) are described in [tests/Performance/README.md](../tests/Performance/README.md).
