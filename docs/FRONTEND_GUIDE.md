# Frontend Guide (Inertia + React 19)

**Stack:** [VERSION_STACK.md](VERSION_STACK.md). Inertia 2.3.x, React 19.2.x, TypeScript 5.9.x, Vite 7.3.x, Tailwind 4.1.x, ESLint 10 (flat config). Routes: Wayfinder (`@/actions`, `@/routes`).

## Quick reference

- **Index:** `AppLayout` with breadcrumbs, `<Head title="…" />`, `IndexHeader`, create button, `SearchInput` (debounce 500ms, param `search`), `Pagination`, actions column with `ActionsDropdown` (View, Edit, Delete). Use `t('common.*')` and page-specific keys for titles, labels, and empty states.
- **Show:** Breadcrumbs, header with title and code, Edit/Delete; `Card` for details and related lists; clear empty states.
- **Forms:** One `Card` with `CardTitle`/`CardDescription`; `FormLabel`, `Input`/`Select`/`Textarea`, `InputError`; submit and cancel. Use `PasswordInput` for all password fields. Long forms: `FormValidationNotification`, `ConfirmCloseDialog` on unsaved close.
- **Flash:** `useFlashNotifications()` and `<FlashNotifications flash={flash} />` only.
- **Delete:** Always `ConfirmDeleteDialog` (never `window.confirm`).
- **Loading:** Skeletons on heavy Index pages; `Spinner` for inline use only.
- **Routes:** Wayfinder from `@/actions` and `@/routes`; types from `resources/js/lib`.

## Key components

`SearchInput`, `Pagination`, `IndexHeader`, `ActionsDropdown`, `ConfirmDeleteDialog`, `FormValidationNotification`, `ConfirmCloseDialog`, Skeletons, `Spinner`, `PasswordInput`, `PasswordStrengthIndicator`, `LocaleDropdown`, `LocaleTabs`.

- **SearchInput** — Uses `useTranslations()`; default placeholder from `t('common.search_placeholder')` when `placeholder` is not passed; `aria-label` for clear button from `t('common.search_clear')`.
- **ActionsDropdown** — Uses `t('common.view')`, `t('common.edit')`, `t('common.delete')`, `t('common.open_actions_menu')`. Use for all standard View/Edit/Delete actions.
- **LocaleDropdown** — Language selector on the **welcome** page. Round button with SVG flag; menu label from `t('settings.appearance.language_label')`. Uses `usePage().props.locale` and `router.post('/locale', { locale })`.
- **LocaleTabs** — Language selector in **Settings → Appearance** only (three options in a row). `aria-label` from `t('settings.appearance.language_label')`. See [I18N.md](I18N.md).

## i18n

Use `useTranslations()` and `t(key)` for all user-visible strings. Keys live in `lang/{it,es,en}.json` and are shared via Inertia (`props.translations`). Namespaces: `welcome.*`, `auth.*`, `settings.*`, `nav.*` (sidebar), `common.*` (save, cancel, search, actions, code, etc.). Add keys to all three JSON files when adding new copy. See [I18N.md](I18N.md).

## Auth & password fields

- **PasswordInput** (`@/components/ui/password-input`) — Use for all password fields. Show/hide toggle (eye icon). Supports `ref` and standard input props.
- **PasswordStrengthIndicator** — Optional, informational (register and settings). Bar and label from backend/translations (e.g. weak/medium/strong).
- **Password match feedback** — Real-time message when confirmation differs; server-side `confirmed` rule; messages from `lang/{locale}/validation.php`.

## Patterns

Mobile cards and desktop table on Index pages. Global error boundary in `error-boundary.tsx`. Flash via `FlashNotifications` only. Long forms: `ConfirmCloseDialog` and `FormValidationNotification`. Skeletons on Dashboard, Orders, Materials, etc.

## Tests

See [TEST_COVERAGE.md](TEST_COVERAGE.md). Frontend is exercised via Inertia in Feature tests; Wayfinder and key components have unit/React tests where applicable.
