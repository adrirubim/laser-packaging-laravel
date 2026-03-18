# Troubleshooting

Common errors and their fixes for **Laser Packaging Laravel**.

---

## 1) `Illuminate\Foundation\ViteException: Unable to locate file in Vite manifest`

**Cause:** Frontend assets were not built, so `public/build/manifest.json` is missing/outdated.

**Fix:**

```bash
npm run build
```

For local development with HMR, run:

```bash
composer run dev
```

---

## 2) `npm` shows `MISSING ...win32...` optional dependencies (WSL/Linux)

You may see output like:

- `@rollup/rollup-win32-x64-msvc MISSING`
- `lightningcss-win32-x64-msvc MISSING`

**This is expected on WSL/Linux.** These are optional Windows binaries. Nothing to fix.

---

## 3) `npm ci` fails with peer dependency conflicts

This repository uses `.npmrc` with:

- `legacy-peer-deps=true`

**Fix:** Use the same flags as CI:

```bash
npm ci --legacy-peer-deps
```

---

## 4) Queue-related features not running

In local development, the recommended entrypoint is:

```bash
composer run dev
```

It runs the Laravel server, a queue listener, log tailing (Pail), and Vite.

If you start only `php artisan serve`, any queued jobs will not be processed until you start a worker:

```bash
php artisan queue:listen --tries=1
```

---

## 5) Database errors in tests (PostgreSQL)

Tests expect a separate database (see `docs/DATABASE.md`):

- `laser_packaging_test`

If migrations fail for tests, run:

```bash
php artisan migrate:fresh --env=testing
php artisan test
```

---

## 6) Dependabot alerts for `undici` (jsdom transitive dependency)

Dependabot alerts for `undici` may appear if the lock file contains a vulnerable transitive version.

**Verify the actual installed version:**

```bash
npm ls undici --all
```

**Fix:** update the dependency chain and commit the lockfile:

```bash
npm install
npm audit
```

Alerts resolve on GitHub once the updated `package-lock.json` is pushed to the default branch.

---

## 7) WSL path / `cd` issues

The repository path is:

- `/var/www/laser-packaging-laravel`

Common mistakes:

- Using `_` instead of `-`
- Copying the `$` prompt into the path

---

## 8) TypeScript check script name

This repository uses:

- `npm run types` (not `npm run type`)

To see scripts:

```bash
npm run
```

