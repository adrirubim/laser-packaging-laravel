## App layer overview

This directory contains all backend application code. The structure is layered and domain‑oriented:

- `Http/` – Controllers, middleware and form requests. Controllers are thin and delegate to Actions/Services.
- `Models/` – Eloquent models (UUID identifiers, relationships, scopes, casts).
- `Actions/` – Orchestrate high‑level flows (create/update offers, orders, sync employees, etc.).
- `Services/` – Domain services for calculations, code generation and reusable business logic.
- `Repositories/` – Query and persistence abstractions over models, especially for complex reads.
- `Enums/` – Backed enums representing fixed domain concepts (statuses, types, etc.).
- `Console/` – Artisan commands.

### Domain organization

Within `Actions/`, `Services/` and `Repositories/`, code is grouped by domain (Offers, Orders, Planning, Customers, etc.).

When adding new functionality:

1. **Identify the domain** (e.g. Offers, Orders, Planning).
2. Add or extend:
   - A **Service** for reusable domain logic.
   - An **Action** for orchestrating a complete flow.
   - A **Repository** method for complex queries or filters.
3. Keep controllers focused on HTTP concerns and delegation.
4. Add Unit tests under `tests/Unit/<Layer>/` and Feature tests under `tests/Feature/`.

For a detailed architecture walkthrough, see `docs/BACKEND_GUIDE.md`.

