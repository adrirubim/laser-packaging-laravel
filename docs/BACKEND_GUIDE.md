# Backend Guide

**Stack:** [VERSION_STACK.md](VERSION_STACK.md). Laravel 12.48.x, PHP 8.4.x, PostgreSQL, Inertia.js 2.3.x, PHPUnit 12.

## 1. Architecture

The backend follows a layered approach:

```text
Request → Controller → Service / Action → Repository → Model
                    ↓
             Inertia / JSON response
```

- **Controllers** (`app/Http/Controllers/`)  
  Handle HTTP concerns: routing, auth, validation (via Form Requests), returning Inertia/JSON responses.

- **Services** (`app/Services/`)  
  Encapsulate domain logic (codes, calculations, number generation, etc.).

- **Actions** (`app/Actions/`)  
  Orchestrate complex flows (create/update Offer/Article/Order, sync employees, etc.), typically transactional.

- **Repositories** (`app/Repositories/`)  
  Provide query and persistence abstractions over Eloquent models, especially for complex reads (dashboard, filters, reporting).

- **Models** (`app/Models/`)  
  UUID‑based Eloquent models with casts, accessors, relationships and scopes.

---

## 2. Controllers

- Keep controllers **thin**:
  - Inject services/actions via constructor.
  - Move business rules out of controllers into Services/Actions.
  - Use **Form Requests** for validation and authorization.

- Standard patterns:
  - `index()` → repository for filters, pagination and eager loading.  
  - `store()` / `update()` → call a dedicated Action (e.g. `CreateOfferAction`, `UpdateOrderAction`).  
  - `destroy()` → soft delete (`removed` flag) when applicable.

- Responses:
  - Inertia pages for backoffice (`Inertia::render()` with React pages under `resources/js/pages`).  
  - JSON for API endpoints (especially Production Portal).

## 3. Services & Actions

### Services

- Focus on **single responsibilities**:
  - Code generation (LAS codes, offer numbers, production numbers).  
  - Domain calculations (pallets, production metrics).
- Tested with dedicated **Unit tests** (see `tests/Unit/Services/*`).

### Actions

- Represent **high‑level flows**, for example:
  - `CreateOfferAction`, `UpdateOfferAction`.  
  - `CreateOrderAction`, `UpdateOrderAction`.  
  - `SyncOrderEmployeesAction`.
- Typical responsibilities:
  - Wrap work in DB transactions.  
  - Call repositories/services.  
  - Emit events / clear caches when needed.
- Actions have **Unit tests** (see `tests/Unit/Actions/*`) and are also exercised by Feature tests.

## 4. Repositories

- Each repository encapsulates queries for a given aggregate:
  - Examples: `ArticleRepository`, `CustomerRepository`, `DashboardRepository`, `OrderRepository`, etc.
- Responsibilities:
  - Complex filters & pagination (search, status, date ranges).  
  - Eager loading relations to avoid N+1 queries.  
  - Query composition reused across controllers/actions.
- All repositories have **Unit tests** in `tests/Unit/Repositories/`.

When adding new complex queries:
- Prefer **adding a method in an existing repository** over inline queries in controllers.  
- Make sure to cover it with a repository Unit test.

## 5. Models and Validation

### Models

- All primary models use **UUIDs** as identifiers.  
- Use:
  - Relationship methods with proper return types (e.g. `belongsTo`, `hasMany`, `belongsToMany`).  
  - Accessors/mutators for derived fields (e.g. `status_label`, `valuetype`).  
  - Scopes for common filters (e.g. `active()`).

There are dedicated Unit tests for key models (e.g. `OrderModelTest`, `MachineryModelTest`) plus broad Feature coverage.

### Validation

- Use **Form Request** classes for validation and authorization:
  - Keep rules and messages close to the domain.  
  - Avoid inline `$request->validate()` in controllers.
- Backend validation errors are surfaced in frontend via Inertia and shown using:
  - `InputError` (per‑field).  
  - `FormValidationNotification` (summary at top of long forms).

## 6. Caching & dashboard

- Use **caching** for heavy dashboard queries and frequently accessed aggregates (see `DashboardRepository` and related services).
- Ensure caches are **invalidated** when:
  - Orders, offers or articles are created/updated/deleted.  
  - Critical reference data changes.
- There are Unit tests verifying cache behavior and dashboard data.

## 7. Production Portal API

- Production Portal provides a **web UI** + **REST API** for production workers.
- API endpoints are tested in `tests/Feature/Api/ProductionPortalControllerTest.php` and in **performance tests**:
  - Authentication and login response times.  
  - Order list and order info.  
  - Endpoints for pallet/manual quantities and concurrent requests.

When adding new API endpoints:
- Follow existing patterns in `routes/api.php` and `ProductionPortalController`.  
- Keep auth/token handling consistent.  
- Add Feature tests and, if performance‑sensitive, extend `tests/Performance/ApiResponseTimeTest.php`.

## 8. Adding a Feature (Checklist)

When you add a new backend module or extend an existing one:

1. **Model**  
   - Add a UUID‑based model with relationships and scopes.
2. **Migration & factory**  
   - Create migration using `php artisan make:migration`.  
   - Add a factory for tests and seeders.
3. **Repository**  
   - Add methods for complex reads/filters.  
   - Cover with repository Unit tests.
4. **Service / Action**  
   - Place domain logic in a Service.  
   - Wrap complex flows in an Action with Unit tests.
5. **Controller**  
   - Keep it thin; use Form Requests and call Actions/Repositories.  
   - Return Inertia/JSON as appropriate.
6. **Tests**  
   - Add Unit tests for services/actions/repositories.  
   - Add Feature tests for controllers/API endpoints.  
   - Update [TEST_COVERAGE.md](TEST_COVERAGE.md) when introducing new critical components.

