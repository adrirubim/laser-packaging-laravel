# Frontend Guide (Inertia + React 19)

**Stack:** [VERSION_STACK.md](VERSION_STACK.md). Inertia 2.3.x, React 19.2.x, TypeScript 5.9.x, Vite 7.3.x, Tailwind 4.1.x, ESLint 10 (flat config). Routes: Wayfinder (`@/actions`, `@/routes`). **Note:** The application UI labels are in Italian; this documentation uses English.

## Quick Reference

- **Index:** `AppLayout` with breadcrumbs, `<Head title="…" />`, `IndexHeader`, create button first on the right, `SearchInput` (debounce 500ms, param `search`), `Pagination`, actions column with `ActionsDropdown` (View, Edit, Delete).
- **Show:** Breadcrumbs → entity. Header: title and `Codice: {codice}`; right: Edit, Delete. `Card` for details and related lists; clear empty states.
- **Forms:** One `Card` with `CardTitle`/`CardDescription`; `FormLabel`, `Input`/`Select`/`Textarea`, `InputError`; submit and outline cancel. Long forms: `FormValidationNotification` at top, `ConfirmCloseDialog` on unsaved close.
- **Flash:** `useFlashNotifications()` and `<FlashNotifications flash={flash} />` only (no ad-hoc banners).
- **Delete:** Always `ConfirmDeleteDialog` (never `window.confirm`).
- **Loading:** Skeletons on heavy Index pages; `Spinner` for inline use only.
- **Routes:** Wayfinder from `@/actions` and `@/routes`; TypeScript types from `resources/js/lib`.

## Key Components

`SearchInput`, `Pagination`, `IndexHeader`, `ActionsDropdown`, `ConfirmDeleteDialog`, `FormValidationNotification`, `ConfirmCloseDialog`, Skeletons, `Spinner`.

## Patterns in Use

Mobile cards and desktop table (Materials, Machinery, Suppliers). Global error boundary in `error-boundary.tsx`. Flash via `FlashNotifications` only. Long forms use `ConfirmCloseDialog` and `FormValidationNotification` (Offers, Articles, Customers, Orders, CustomerShippingAddresses). Skeletons on Dashboard, Orders, ProductionOrderProcessing, Materials, Machinery.

## Tests

See [TEST_COVERAGE.md](TEST_COVERAGE.md). The frontend is exercised via Inertia in Feature tests; main Actions and models have Unit tests.
