# Laser Packaging Laravel

[![PHP 8.4](https://img.shields.io/badge/PHP-8.4+-777BB4?logo=php&logoColor=white)](https://www.php.net/)
[![Laravel 12.48](https://img.shields.io/badge/Laravel-12.48-FF2D20?logo=laravel&logoColor=white)](https://laravel.com/)
[![React 19.2](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript 5.9](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tests 994 passing](https://img.shields.io/badge/Tests-994%20passing-10B981)](docs/TEST_COVERAGE.md)
[![License MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> A modern, enterprise-grade application for managing offers, articles, orders and a production portal (web + API). Built with Laravel 12.48.x, React 19.2.x (Inertia.js 2.3.x), TypeScript 5.9.x, Vite 7.3.x, Tailwind CSS 4.1.x, and PostgreSQL. Featuring a professional UI/UX, comprehensive security, and optimized performance. **Exact versions:** [docs/VERSION_STACK.md](docs/VERSION_STACK.md).

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Requirements](#requirements)
- [Installation](#installation)
- [Security](#security)
- [Documentation](#documentation)
- [CI/CD](#cicd)
- [Testing](#testing)
- [Architecture](#architecture)
- [Project Status](#project-status)
- [Default Users](#default-users-development)
- [Useful Commands](#useful-commands)
- [Before Pushing to GitHub](#before-pushing-to-github)
- [Contributing](#contributing)
- [Author](#author)
- [License](#license)

---

<a id="overview"></a>
## 🎯 Overview

Laser Packaging Laravel is a **production-ready** content management system designed for offers, articles, orders, and production tracking. It combines Laravel's robust backend with React's reactive frontend (Inertia.js), delivering a seamless, performant, and secure experience.

### Highlights

Modern stack (Laravel 12, React 19, Inertia, TypeScript, Vite, Tailwind). Professional UI (skeletons, charts, search, mobile, WCAG AA). Security (Form Requests, `.env`, test DB). Performance (caching, indexes, Performance suite). **994 tests**, 6682+ assertions. Docs: [docs/](docs/README.md).

---

<a id="features"></a>
## ✨ Features

### Features

**Security:** Form Requests, authorization, `.env` only as template, test DB (PostgreSQL, `RefreshDatabase`), soft deletes (`removed`), CSRF, API token auth.  
**Performance:** Indexes, caching with invalidation, eager loading, repositories, React memoization, pagination, Performance test suite.  
**UX:** Skeletons, dashboard charts (Recharts), debounced search, confirm dialogs, flash notifications, mobile-responsive, WCAG AA, file upload.  
**Functionality:** Full CRUD (Offers, Articles, Orders, Clients, master data; 40 controllers), Production Portal (web + 9 API endpoints), UUID models, Services, 7 Repositories, 7 Actions, 32 Form Requests, Enums, `lang/it/messages.php`.  
**Quality:** Layered architecture (Controller → Service/Action → Repository → Model), TypeScript, ESLint, 994 tests.

---

<a id="tech-stack"></a>
## 🛠️ Tech Stack

### Backend

- **Framework:** Laravel 12
- **Language:** PHP 8.4+
- **Database:** PostgreSQL (MySQL supported)
- **Authentication:** Laravel Fortify
- **Validation:** Form Request classes

### Frontend

- **Framework:** React 19 with Inertia.js
- **Language:** TypeScript 5.9
- **Styling:** Tailwind CSS 4.1 · Radix UI
- **Build Tool:** Vite 7

### Development Tools

- **Testing:** PHPUnit 12
- **Code Quality:** ESLint, Prettier
- **Package Manager:** Composer, NPM

---

<a id="requirements"></a>
## 📦 Requirements

- **PHP** >= 8.4  
  Check in WSL: `php -v`
- **PostgreSQL** (app and tests; see [README_TEST_DATABASE.md](README_TEST_DATABASE.md))
- **Node.js** >= 20 (reference env: 20.19.6)  
  Check: `node -v`
- **Composer** >= 2.0  
  Check: `composer -V`
- **NPM** >= 10.0  
  Check: `npm -v`

---

<a id="installation"></a>
## 🚀 Installation

### 1. Clone the repository

```bash
git clone https://github.com/adrirubim/laser-packaging-laravel.git
cd laser-packaging-laravel
```

### 2. Install dependencies

```bash
# Install PHP dependencies
composer install

# Install Node dependencies
npm install
```

### 3. Environment configuration

```bash
# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate
```

### 4. Database setup

Configure your database in `.env` (use your own credentials; never commit `.env`). Example for PostgreSQL:

```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=laser_packaging
DB_USERNAME=postgres
DB_PASSWORD=
```

### 5. Run migrations and seeders

```bash
# Run migrations on the development database (laser_packaging)
php artisan migrate

# (Optional) Seed full demo data for dashboard + flows (development DB only)
php artisan db:seed --class=TestDataSeeder
```

### 6. Create storage link

```bash
# Create symbolic link for public storage
php artisan storage:link
```

### 7. Build frontend and start development servers

```bash
# Build assets (required for tests and production)
npm run build

# Start Laravel only
php artisan serve
```

Then open **http://localhost:8000**. For full dev (Laravel + Vite): `npm run dev`.

**PDF generation (optional):**

- **wkhtmltopdf** — For offer/order PDFs (configurable via `WKHTMLTOPDF_PATH`).
- **dompdf** — For employee barcode PDF (Composer dependency).

---

<a id="security"></a>
## 🔒 Security

- **Never commit `.env`** — It is in `.gitignore`; use `.env.example` as a template and set your own `APP_KEY`, `DB_*`, and other secrets locally or via your deployment environment.
- **Default users** — If using seeders for development, change or remove demo users before production. See [Default Users](#default-users-development).
- **Production** — Set `APP_DEBUG=false`, use strong `APP_KEY`, restrict `APP_URL`, and configure proper DB and mail credentials outside the repository.

---

<a id="documentation"></a>
## 📚 Documentation

Everything is linked from **[docs/](docs/README.md)**:

| Doc | Description |
|-----|-------------|
| [docs/README.md](docs/README.md) | Full documentation index |
| [README_TEST_DATABASE.md](README_TEST_DATABASE.md) | Test database configuration (PostgreSQL) |
| [README_SEED_TEST_DATA.md](README_SEED_TEST_DATA.md) | Demo/test data seeder for dashboard and flows |
| [docs/PROJECT_STATUS.md](docs/PROJECT_STATUS.md) | Project status and module overview |
| [docs/TEST_COVERAGE.md](docs/TEST_COVERAGE.md) | Test suites and coverage |
| [docs/BACKEND_GUIDE.md](docs/BACKEND_GUIDE.md) | Backend architecture & conventions (controllers, services, actions, repositories, models) |
| [docs/FRONTEND_GUIDE.md](docs/FRONTEND_GUIDE.md) | Frontend architecture & conventions (Inertia + React) and consistency guide |
| [docs/planning/api.md](docs/planning/api.md) | Planning API (endpoints) |
| [SECURITY.md](SECURITY.md) | How to report security vulnerabilities |

---

<a id="cicd"></a>
## 🔄 CI/CD

GitHub Actions runs **tests** and **lint** on every push and pull request to `main`.

- **Tests** (`.github/workflows/tests.yml`): PHP 8.4, Node 22, `composer install`, `npm ci`, `npm run build`, `./vendor/bin/phpunit`
- **Lint** (`.github/workflows/lint.yml`): `npm run lint` (ESLint)

---

<a id="testing"></a>
## 🧪 Testing

### Run tests

```bash
# Build frontend first (required for Inertia/Vite in Feature tests)
npm run build

# Run all tests
php artisan test

# Run specific test suite
php artisan test --testsuite=Unit
php artisan test --testsuite=Feature
php artisan test --testsuite=Performance
```

### Test coverage

- ✅ **994 tests passing**
- ✅ **6682+ assertions** across all test suites
- ✅ **Feature tests** for all controllers
- ✅ **Unit tests** for services and repositories
- ✅ **Performance tests** (Concurrency, Load, API response time)

See [docs/TEST_COVERAGE.md](docs/TEST_COVERAGE.md) for details.

### Test database

- Configured in `phpunit.xml` (PostgreSQL, database `laser_packaging_test`)
- CI uses password `postgres`; adjust `phpunit.xml` locally if your test DB uses different credentials
- Automatically refreshed with `RefreshDatabase` trait
- Isolated test environment

---

<a id="architecture"></a>
## 🏗 Architecture

The project follows a **layered architecture** with clear separation of concerns.

**Request flow:**

```
Request → Controller → Service / Action → Repository → Model
                ↓
         Inertia response (React pages)
```

### Architecture layers

1. **Controllers** (`app/Http/Controllers/`) — Handle HTTP requests and responses, coordinate services/actions, return Inertia or JSON, apply middleware and authorization.
2. **Services** (`app/Services/`) — Business logic (codes, calculations, number generation), orchestration.
3. **Actions** (`app/Actions/`) — Complex flows (Create/Update Article, Order, Offer; syncs), transaction handling.
4. **Repositories** (`app/Repositories/`) — Data access layer abstraction, complex query building.
5. **Models** (`app/Models/`) — UUID-based Eloquent models.

### Frontend structure

| Path | Purpose |
|------|---------|
| `resources/js/pages/` | Inertia page components (180+ components) |
| `resources/js/components/` | Reusable UI components |
| `resources/js/layouts/` | Page layout wrappers |
| `resources/js/hooks/` | Custom React hooks |
| `resources/js/lib/` | API clients, utilities, validation |

Backend tree: `app/Http/Controllers/`, `app/Services/`, `app/Actions/`, `app/Repositories/`, `app/Models/`, `app/Enums/` (see repo).

---

<a id="project-status"></a>
## 📊 Project Status

**Overall Score: 10/10** — Production-ready, optimized, well-structured, fully tested, and professionally documented.

| Aspect | Status | Score | Notes |
|--------|--------|-------|-------|
| Security | ✅ Excellent | 9/10 | Form Requests, validation, `.env` handling, test DB isolation |
| Performance | ✅ Optimized | 9/10 | Caching, indexes, Performance suite (Concurrency, Load, API) |
| Code Quality | ✅ Excellent | 10/10 | Service/Repository/Action layers, ESLint, TypeScript, SOLID |
| UX/UI | ✅ Excellent | 9/10 | Skeleton loaders, charts, mobile-responsive, WCAG AA |
| Testing | ✅ Excellent | 10/10 | 994 tests, 6682+ assertions, Unit/Feature/Performance |
| Documentation | ✅ Complete | 10/10 | `docs/`, test report, DB and seed guides |

### Core modules (100% complete)

- ✅ **Offerte** — 11 sub-modules (Attività, Settori, Stagionalità, Tipi ordini, Operazioni, Famiglia LAS, etc.) · Form “Nueva Offerta” (49 campos)
- ✅ **Clienti** — Anagrafica, Divisioni, Indirizzi
- ✅ **Offers, Articles, Orders** — Full CRUD with React/Inertia
- ✅ **Production Portal** — Web (Login, Dashboard, Order Detail) + REST API (9 endpoints)
- ✅ **Anagrafica** — Customers, Divisions, Shipping, Suppliers, Employees, Materials, Machinery, Critical Issues
- ✅ **Ordini** — Orders, Order States, Order Employee Assignments; **Production Planning** (API + UI: planning data, replan, calculations)
- ✅ **Configuration** — OfferType, OfferSeasonality, OfferSector, ArticleCategory, PalletType, ValueTypes, etc.

### Recent improvements (February 2026)

- Production Planning module (Ordini): API and UI for planning data, replan, and calculations; full test coverage. Unified documentation under `docs/`; DEMO-ALL seeder and verification test; production ready.

<a id="default-users-development"></a>
## 👥 Default Users (development)

After running seeders (e.g. `php artisan db:seed` or `TestDataSeeder`), the application may create demo data for local development. See [README_SEED_TEST_DATA.md](README_SEED_TEST_DATA.md) for details. There are no fixed default credentials; configure users as needed for development.

**Security:** Change or remove demo users before deploying to production.

---

<a id="useful-commands"></a>
## 🛠️ Useful Commands

### Development

```bash
# Start Laravel server only
php artisan serve

# Start Laravel + Vite
npm run dev

# Build for production
npm run build
```

### Database

```bash
# Run migrations
php artisan migrate

# Reset and seed (optional)
# php artisan migrate:fresh --seed
```

### Testing

```bash
# Run all tests (build frontend first)
npm run build
php artisan test

# Run specific suite
php artisan test --testsuite=Unit
php artisan test --testsuite=Feature
```

### Code Quality

```bash
# Format and lint
npm run format
npm run lint
npm run types
```

### Cache & Optimization

```bash
# Clear all caches
php artisan optimize:clear

# Clear specific cache
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Cache configuration
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### Storage

```bash
# Create symbolic link
php artisan storage:link
```

---

<a id="before-pushing-to-github"></a>
## 📤 Before Pushing to GitHub

Ensure dependencies are installed (`composer install` and `npm ci`). Then run locally to avoid CI failures:

```bash
# Linting / formatting
vendor/bin/pint
npm run format
npm run lint

# Ensure test database is migrated
php artisan migrate:fresh --env=testing

# Build + tests (same as CI)
npm run build
./vendor/bin/phpunit
```

Optional: `npm run types`.

---

<a id="contributing"></a>
## 🤝 Contributing

This is an open-source project (MIT). For contributions or inquiries, please contact the author. See code standards below.

### Code Standards

- Follow PSR-12 coding standards for PHP
- Use TypeScript for all frontend code
- Write tests for new features
- Document public methods
- Keep code comments in English
- Follow SOLID principles

---

<a id="author"></a>
## 👨‍💻 Author

**Developed by:** [Adrián Morillas Pérez](https://linktr.ee/adrianmorillasperez)

### Connect

- 📧 **Email:** [adrianmorillasperez@gmail.com](mailto:adrianmorillasperez@gmail.com)
- 💻 **GitHub:** [@adrirubim](https://github.com/adrirubim)
- 🌐 **Linktree:** [adrianmorillasperez](https://linktr.ee/adrianmorillasperez)
- 💼 **LinkedIn:** [Adrián Morillas Pérez](https://www.linkedin.com/in/adrianmorillasperez)
- 📱 **Instagram:** [@adrirubim](https://instagram.com/adrirubim)
- 📘 **Facebook:** [AdRubiM](https://facebook.com/adrirubim)

---

<a id="license"></a>
## 📄 License

[MIT](LICENSE)

---

**Last Updated:** 13 February 2026  
**Status:** Production Ready ✅  
**Stack versions:** [docs/VERSION_STACK.md](docs/VERSION_STACK.md)
