# Frontend guide (Inertia + React 19)

**Stack:** [VERSION_STACK.md](VERSION_STACK.md). Inertia 2.3.x, React 19.2.x, TypeScript 5.9.x, Vite 7.3.x, Tailwind 4.1.x.  
UI language: **Italian** (Visualizza, Modifica, Elimina, Cerca, Nuovo/Nuova {Entità}). This doc is in English.

## Quick reference

- **Index:** `AppLayout` + breadcrumbs, `<Head title="…" />`, `IndexHeader`, create button **first** on the right, `SearchInput` (debounce 500ms, param `search`), `Pagination`, `Azioni` column with `ActionsDropdown` (Visualizza, Modifica, Elimina).
- **Show:** Breadcrumbs list → entity. Header: title + `Codice: {codice}`; right: Modifica, Elimina. `Card` for details and related lists; clear empty states.
- **Forms:** One `Card` with `CardTitle`/`CardDescription`; `FormLabel`, `Input`/`Select`/`Textarea`, `InputError`; submit + outline cancel. Long forms: `FormValidationNotification` at top, `ConfirmCloseDialog` on unsaved close.
- **Flash:** `useFlashNotifications()` + `<FlashNotifications flash={flash} />` only (no ad‑hoc banners).
- **Delete:** Always `ConfirmDeleteDialog` (never `window.confirm`).
- **Loading:** Skeletons on heavy Index pages; `Spinner` for inline only.
- **Routes:** Wayfinder from `@/actions` / `@/routes`; TypeScript types from `resources/js/lib`.

## Key components

`SearchInput`, `Pagination`, `IndexHeader`, `ActionsDropdown`, `ConfirmDeleteDialog`, `FormValidationNotification`, `ConfirmCloseDialog`, Skeletons, `Spinner`.

## Patterns in use

Mobile cards + desktop table (Materials, Machinery, Suppliers). Global Error Boundary in `error-boundary.tsx`. Flash via `FlashNotifications` only. Long forms use `ConfirmCloseDialog` and `FormValidationNotification` (Offers, Articles, Customers, Orders, CustomerShippingAddresses). Skeletons on Dashboard, Orders, ProductionOrderProcessing, Materials, Machinery.

## Tests

See [TEST_COVERAGE.md](TEST_COVERAGE.md). Frontend is exercised via Inertia in Feature tests; main Actions and models have Unit tests.
