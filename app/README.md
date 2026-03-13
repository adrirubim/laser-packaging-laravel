## App layer overview

This directory contains all backend application code that sits on top of the domain layer.  
The structure is layered and domain‑oriented, and follows the **Omega 2026 – Action → Resource → Response** rules
described in `ARCHITECTURE_OMEGA.md`.

- `Http/` – Controllers, middleware and form requests.  
  Controllers are thin: they validate input, call **Domain Actions** under `src/Domains/{Domain}/Actions`, and decide
  whether to return an Inertia view or a JSON response (`ApiResponseResource`).
- `Models/` – Eloquent models (UUID identifiers, relationships, scopes, casts).
- `Actions/` – Legacy/system‑level actions (Fortify, shared concerns).  
  All **business** actions now live in `src/Domains/*/Actions`.
- `Services/` – Application‑level services for calculations, code generation and reusable business logic that is shared
  across multiple domains.
- `Repositories/` – Query and persistence abstractions over models, especially for complex reads.
- `Enums/` – Backed enums representing fixed domain concepts (statuses, types, etc.).
- `Console/` – Artisan commands.

### Domain organization

Business logic is grouped by domain primarily under `src/Domains/{Domain}/Actions` (Offers, Orders, Planning, Customers, etc.).
Controllers, Services and Repositories in `app/` depend on those domain Actions instead of duplicating business rules.

When adding new functionality:

1. **Identify the domain** (for example Offers, Orders, Planning).
2. Add or extend:
   - A **Domain Action** in `src/Domains/{Domain}/Actions` for the main use‑case.
   - A **Service** when you need reusable logic shared by multiple Actions or controllers.
   - A **Repository** method for complex queries or filters.
3. Keep controllers focused on HTTP concerns and orchestration (validation → Action → Resource/Response).
4. Add Unit tests under `tests/Unit/<Layer>/` and Feature tests under `tests/Feature/` for each new behavior.

For a detailed architecture walkthrough, see:

- `ARCHITECTURE_OMEGA.md` – Omega 2026 domain architecture and Action → Resource → Response rules.
- `docs/BACKEND_GUIDE.md` – Backend guides, examples and patterns.

