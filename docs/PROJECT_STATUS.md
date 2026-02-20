# Project Status

**Stack:** [VERSION_STACK.md](VERSION_STACK.md) · **Status:** Production-ready. Core modules, Inertia + React/TypeScript, Unit/Feature/Performance tests, and demo seeders are in place.

## Completed

Offers, Customers, Articles, Orders (including **Production Planning** — API and UI), master data (Anagrafica), Production Portal (web and API), and configuration. See [../README.md](../README.md) for the full list.

## Testing

Run `npm run build` then `php artisan test`. If you see *Vite manifest* errors, the frontend build is required. Test database: [../README_TEST_DATABASE.md](../README_TEST_DATABASE.md). Coverage: [TEST_COVERAGE.md](TEST_COVERAGE.md).

## Demo Data

`TestDataSeeder` — see [../README_SEED_TEST_DATA.md](../README_SEED_TEST_DATA.md). Covers Customers, Suppliers, Offers, Articles, Orders, and Staff; orders in all seven statuses; placeholder files for downloads.

## Next Steps (Production)

- [ ] Staging: run build and tests; configure environment
- [ ] Production: environment variables, backups, monitoring

Optional: additional Form Requests or repositories for smaller modules; frontend optimizations; i18n.
