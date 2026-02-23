# Project Status

**Stack:** [VERSION_STACK.md](VERSION_STACK.md) · **Status:** Production-ready.

## Completed

- **Core modules:** Offers, Customers, Articles, Orders (including Production Planning API and UI), master data, Production Portal (web and API). See [../README.md](../README.md) for the full list.
- **i18n (IT, ES, EN):** Session locale; selector on **Welcome** (`LocaleDropdown`) and **Settings → Appearance** (`LocaleTabs`) only. UI: `lang/*.json` and `useTranslations()` / `t()` for welcome, auth, Settings (layout, Appearance, Profile, Password, 2FA), **sidebar** (`nav.*`), and **common CRUD** (`common.*`). Index pages using shared components (e.g. Materials, PalletTypes) and `ActionsDropdown` / `SearchInput` are translated. Backend: `lang/it/`, `lang/es/`, `lang/en/` for auth and validation. See [I18N.md](I18N.md).

## Testing

Run `npm run build` then `php artisan test`. Test database: [../README_TEST_DATABASE.md](../README_TEST_DATABASE.md). Coverage: [TEST_COVERAGE.md](TEST_COVERAGE.md).

## Demo data

`TestDataSeeder` — see [../README_SEED_TEST_DATA.md](../README_SEED_TEST_DATA.md).

## Next steps (production)

Staging: run build and tests; configure environment. Production: environment variables, backups, monitoring.
