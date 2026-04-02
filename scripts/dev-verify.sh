#!/usr/bin/env bash
set -euo pipefail

echo "==> laser-packaging-laravel – local quality gate (CI parity)"

echo "==> 1/3 Lint (Pint) + frontend format/lint/types + build"
composer install -q --no-ansi --no-interaction --no-scripts --no-progress --prefer-dist
npm ci --legacy-peer-deps
vendor/bin/pint
npm run format:check
npm run lint
npm run types
npm run build

echo "==> 2/3 Vitest"
npm run test -- --run

echo "==> 3/3 PHP tests"
cp -f .env.example .env
php artisan key:generate
php scripts/i18n-check.php
php artisan config:clear
php artisan test --compact

echo "==> Quality gate completed successfully."

