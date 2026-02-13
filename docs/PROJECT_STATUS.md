# Project status

**Last updated:** 13 February 2026 · **Stack:** [VERSION_STACK.md](VERSION_STACK.md)

**Status:** Production-ready. Core modules, frontend (Inertia + React/TypeScript), tests (Unit/Feature/Performance), and demo data in place.

## Completed

Offerte, Clienti, Articoli, Ordini (including **Production Planning** — API + UI), Anagrafica, Production Portal (web + API), configuration. See [../README.md](../README.md) for the full list.

## Testing

Run: `npm run build` then `php artisan test`. If you see *Vite manifest* errors, the build is required. Test DB: [../README_TEST_DATABASE.md](../README_TEST_DATABASE.md). Coverage: [TEST_COVERAGE.md](TEST_COVERAGE.md).

## Demo data

`TestDataSeeder` — see [../README_SEED_TEST_DATA.md](../README_SEED_TEST_DATA.md). Covers Clienti, Fornitori, Offerte, Articoli, Ordini, Personale; orders in all 7 statuses; placeholder files for downloads.

## Next steps (production)

- [ ] Staging: run build + tests, configure env
- [ ] Production: env vars, backups, monitoring

Optional: extra Form Requests/repositories for small modules; frontend optimizations; i18n.
