# Deployment Guide

This guide describes how to deploy **Laser Packaging Laravel** in production.

The application is a Laravel + Inertia (React) monolith with:

- A web backoffice (authenticated, verified users).
- A Production Portal (web + API) used by devices/scanners.
- A Planning board that uses internal API endpoints (`/api/planning/*`) from the authenticated UI.

> This document focuses on the **operational shape** of the project. For code architecture, see `ARCHITECTURE_OMEGA.md`.

---

## 1. Requirements

- **PHP**: 8.4+ (project minimum is 8.4; reference environment is 8.4.x)
- **Composer**: 2.x
- **Node.js**: 22.x (CI uses Node 22)
- **Database**: PostgreSQL recommended (CI uses Postgres 16); MySQL is possible but not the default

---

## 2. Environment variables

Start from `.env.example` and set production values outside the repo (CI secrets, server secret manager, etc.).

Minimum essentials:

- `APP_ENV=production`
- `APP_DEBUG=false`
- `APP_KEY=...` (generate with `php artisan key:generate --show`)
- `APP_URL=...` (public base URL)
- `DB_*` (production database)

Optional but commonly required:

- `CACHE_STORE` / `SESSION_DRIVER` (Redis recommended for multi-instance)
- `QUEUE_CONNECTION` (database/redis)
- `MAIL_MAILER` and provider credentials

---

## 3. Build & install (one-time / per release)

On the server (or CI/CD runner):

```bash
composer install --no-interaction --prefer-dist --optimize-autoloader --no-dev
npm ci --legacy-peer-deps
npm run build
php artisan migrate --force
php artisan storage:link
php artisan optimize
```

Notes:

- The repository does **not** commit `public/build/`. Always run `npm run build` during deployment.
- `npm ci --legacy-peer-deps` matches CI (see `.npmrc`).

---

## 4. Runtime processes

### 4.1 Web (PHP-FPM)

Serve `public/` via Nginx/Apache and route all requests to `public/index.php`.

### 4.2 Queue worker

The project uses a queue listener in development (`composer run dev` runs `php artisan queue:listen`).
For production, run a supervised worker:

```bash
php artisan queue:work --tries=1
```

Use Supervisor/systemd and keep it always-on.

### 4.3 Scheduler (cron)

If you use scheduled tasks (recommended for maintenance/automation), configure cron:

```bash
* * * * * php /path/to/artisan schedule:run >> /dev/null 2>&1
```

---

## 5. Storage & permissions

Ensure the web user can write:

- `storage/`
- `bootstrap/cache/`

If using file uploads, make sure `storage/app` is on persistent storage (and backed up if needed).

---

## 6. Security considerations

- Never deploy with `APP_DEBUG=true`.
- Do not commit secrets. Follow `SECURITY.md` / `docs/SECURITY.md`.
- The Production Portal API uses a **token passed in request payload** (not cookies). Treat tokens as secrets and rotate/expire as needed.

---

## 7. Verifications

Before shipping a release:

```bash
composer audit
npm audit
php artisan test --compact
npm run types
npm run build
```

See also `docs/TEST_COVERAGE.md` for the full CI-equivalent pipeline.

