# Laser Packaging Laravel

> A modern, enterprise-grade application for managing offers, articles, orders and a production portal (web + API). Built with Laravel 12, React 19 (Inertia.js), and PostgreSQL. Featuring a professional UI/UX, comprehensive security, and optimized performance.

[![PHP](https://img.shields.io/badge/PHP-8.4+-777BB4?style=flat&logo=php&logoColor=white)](https://www.php.net/)
[![Laravel](https://img.shields.io/badge/Laravel-12.53-FF2D20?style=flat&logo=laravel&logoColor=white)](https://laravel.com/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-316192?style=flat&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.2-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Tests](https://img.shields.io/badge/Tests-1017%2B%20passing-brightgreen?style=flat)](docs/TEST_COVERAGE.md)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=flat)](LICENSE)

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

### Key Highlights

- **Modern Stack:** Laravel 12.53.x, React 19.2.x, Inertia.js 2.3.x, TypeScript 5.9.x, Vite 7.3.x, Tailwind CSS 4.2.x, Radix UI
- **Professional UI/UX:** Skeleton loaders, dashboard charts, real-time search, mobile-responsive, accessibility (WCAG AA)
- **Enterprise Security:** Form Requests, validation, `.env` handling, test DB isolation
- **Optimized Performance:** Caching, indexes, Performance test suite (Concurrency, Load, API)
- **Comprehensive Testing:** 1017+ PHP tests, 24 Vitest tests, covering all critical paths
- **Documentation:** [docs/README.md](docs/README.md) (index), [test coverage](docs/TEST_COVERAGE.md), [VERSION_STACK](docs/VERSION_STACK.md)

---

<a id="features"></a>
## ✨ Features

### 🔐 Security & Stability

- ✅ **Form Request Validation** — Comprehensive input validation and sanitization
- ✅ **Authorization** — Middleware and policy enforcement on controllers
- ✅ **`.env` Handling** — Never commit secrets; `.env.example` as template only
- ✅ **Test DB Isolation** — PostgreSQL test database, `RefreshDatabase` trait
- ✅ **Soft Deletes** — `removed` flag for data retention
- ✅ **CSRF Protection** — Built-in Laravel CSRF token validation
- ✅ **API Authentication** — Token-based auth for Production Portal API
- ✅ **Login rate limiting** — 5 attempts/minute per email+IP (Fortify); 2FA throttle (see `FortifyServiceProvider`)
- ✅ **Multi-language auth/validation** — `lang/it/`, `lang/es/`, `lang/en/` for login, password, and validation messages

### ⚡ Performance

- ✅ **Database Indexing** — Optimized indexes on frequently queried columns
- ✅ **Strategic Caching** — Smart caching with automatic invalidation in controllers
- ✅ **Query Optimization** — Eager loading, repositories, focused queries
- ✅ **React Performance** — Memoized components, optimized re-renders
- ✅ **Configurable Pagination** — Flexible per-page options across modules
- ✅ **Performance Tests** — Concurrency, Load, API response time suites

### 🎨 User Experience & Interface

- ✅ **Skeleton Loaders** — Professional loading states for all async operations
- ✅ **Dashboard Charts** — Interactive charts (Recharts, 5 chart types)
- ✅ **Advanced Filtering** — Search, sortable columns, filters across modules
- ✅ **Delete Confirmation Dialogs** — Professional confirmation modals
- ✅ **Real-Time Search** — Debounced search (500ms) with loading indicators
- ✅ **Flash Notifications** — Auto-dismiss with manual close
- ✅ **Mobile Responsive** — Card views and layouts optimized for mobile
- ✅ **Accessibility (A11y)** — WCAG AA compliance, ARIA labels, keyboard navigation
- ✅ **File Upload** — OfferOperations with validation and storage
- ✅ **Consistent Icons** — Standardized action icons (Eye, Edit, Trash2)
- ✅ **Password UX** — Visibility toggle (eye) on all password fields; strength indicator (Debole/Media/Forte) on register and settings; real-time “Le password non coincidono” when confirmation does not match (register, reset password, change password)

### ⚙️ Functionality

- ✅ **Full CRUD** — Offers, Articles, Orders, Clients, Master data (40 controllers)
- ✅ **Production Portal** — Web frontend (Login, Dashboard, Order Detail) + REST API (9 endpoints)
- ✅ **Production Planning** — Orders → Production Planning (API and UI for planning data, replan, calculations)
- ✅ **UUID-Based Models** — All models use UUIDs as primary identifiers
- ✅ **Service Layer** — Business logic in Services (codes, calculations, numbers)
- ✅ **Repository Pattern** — 7 repositories for data access abstraction
- ✅ **Action Classes** — 7 actions for complex flows (Create/Update Article, Order, Offer)
- ✅ **Form Requests** — 32 classes for validation
- ✅ **Enums** — Type-safe (OrderStatus, OrderLabelStatus)
- ✅ **Centralized Messages** — `lang/{it,es,en}/` for auth, validation, pagination, and messages (multi-language)
- ✅ **Language selector (IT, ES, GB)** — Locale persisted in `user_preferences` (authenticated) or session (guests); selector on **Welcome** (`LocaleDropdown`) and **Settings → Appearance** (`LocaleTabs`); `POST /locale`, `SetLocale` middleware

### 🏗️ Code Quality

- ✅ **Layered Architecture** — Controller → Service/Action → Repository → Model
- ✅ **SOLID Principles** — Clean, maintainable, and extensible code
- ✅ **TypeScript** — Full type safety across frontend
- ✅ **ESLint** — Lint and fix on frontend and scripts
- ✅ **English Documentation** — Code comments and docblocks in English
- ✅ **Comprehensive Testing** — 1017+ PHP tests, 24 Vitest tests

### 👥 Target users & use cases

- **Enterprise internal platforms (offers & production)**: companies that need a robust back-office to manage offers, articles, orders and production planning with a clear audit trail and multi-language support.
- **Manufacturing / packaging teams**: operations teams that require a single source of truth for master data (customers, materials, machinery, critical issues) and a production portal that aligns business logic with factory workflows.
- **SaaS-style B2B tools**: products that expose a production portal or API to external partners and need hard guarantees on validation, security, and performance under real concurrency.
- **Engineering teams (Laravel + React)**: teams that want a reference implementation of a **Laravel 12 + React 19 + Inertia** stack with professional UX patterns (skeleton loaders, charts, filters) and a large, well-tested codebase.

---

<a id="tech-stack"></a>
## 🛠 Tech Stack

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

- **Testing:** PHPUnit 13
- **Code Quality:** ESLint 10, Prettier 3
- **Package Manager:** Composer, NPM (npm uses `.npmrc` with `legacy-peer-deps` for install/ci)

---

<a id="requirements"></a>
## 📦 Requirements

- **PHP** >= 8.4  
  Check in WSL: `php -v`
- **PostgreSQL** (app and tests; see [docs/DATABASE.md](docs/DATABASE.md))
- **Node.js** >= 20 (reference env: 20.19.6)  
  Check: `node -v`
- **Composer** >= 2.0  
  Check: `composer -V`
- **NPM** >= 10.0  
  Check: `npm -v`

---

<a id="installation"></a>
## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/adrirubim/laser-packaging-laravel.git
cd laser-packaging-laravel
```

### 2. Install Dependencies

```bash
# Install PHP dependencies
composer install

# Install Node dependencies (uses .npmrc; run npm ci in CI)
npm install
```

### 3. Environment Configuration

```bash
# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate
```

### 4. Database Setup

Configure your database in `.env` (use your own credentials; never commit `.env`). Example for PostgreSQL:

```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=laser_packaging
DB_USERNAME=postgres
DB_PASSWORD=
```

### 5. Run Migrations and Seeders

```bash
# Run migrations on the development database (laser_packaging)
php artisan migrate

# (Optional) Seed full demo data for dashboard + flows (development DB only)
php artisan db:seed --class=TestDataSeeder
```

### 6. Create Storage Link

```bash
# Create symbolic link for public storage
php artisan storage:link
```

### 7. Build and Start Development Servers

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

All documentation is in **English**. Single index: **[docs/README.md](docs/README.md)**.

| Section | Links |
|---------|--------|
| **Overview** | [VERSION_STACK](docs/VERSION_STACK.md) · [PROJECT_STATUS](docs/PROJECT_STATUS.md) |
| **Getting started** | [Database setup](docs/DATABASE.md) |
| **Development** | [Backend](docs/BACKEND_GUIDE.md) · [Frontend](docs/FRONTEND_GUIDE.md) · [i18n](docs/I18N.md) |
| **Testing** | [Coverage](docs/TEST_COVERAGE.md) |
| **Policy** | [What to commit](docs/GIT_WHAT_TO_COMMIT.md) · [SECURITY](SECURITY.md) · [CONTRIBUTING](CONTRIBUTING.md) · [LICENSE](LICENSE) |

---

<a id="cicd"></a>
## 🔄 CI/CD

GitHub Actions runs **tests** and **lint** on every push and pull request to `main` and `develop`.

- **Tests** (`.github/workflows/tests.yml`): PHP 8.4, Node 22, `composer install`, `npm ci --legacy-peer-deps`, `npm run build`, i18n-check, config:clear, TypeScript check, Vitest, `php artisan test`
- **Lint** (`.github/workflows/lint.yml`): `composer install`, `npm ci --legacy-peer-deps`, Pint, `npm run format:check`, `npm run lint` (ESLint 10)

---

<a id="testing"></a>
## 🧪 Testing

### Run Tests

```bash
# Build frontend first (required for Inertia/Vite in Feature tests)
npm run build

# Run all tests
php artisan test

# Run specific test suite
php artisan test --testsuite=Unit
php artisan test --testsuite=Feature
php artisan test --testsuite=Performance

# Run PHP + frontend (Vitest) tests together
php artisan test:all
# If PHP tests show 419 (Page Expired) under test:all, run separately:
#   php artisan test && npm run test -- --run
```

**Frontend tests (Vitest):** Planning and other React tests live in `resources/js/pages/**/*.test.tsx`. Run them with `npm run test` or include them in one go with `php artisan test:all`.

### Test Coverage

- ✅ **1017+ PHP tests** (Unit, Feature, Performance) plus **24 Vitest tests** (React/Planning)
- ✅ **6841+ assertions** across all test suites
- ✅ **Feature tests** for all controllers
- ✅ **Unit tests** for services and repositories
- ✅ **Performance tests** (Concurrency, Load, API response time)

See [docs/TEST_COVERAGE.md](docs/TEST_COVERAGE.md) for details.

### Test Database

See [docs/DATABASE.md](docs/DATABASE.md). Tests run against a **separate PostgreSQL database** (`laser_packaging_test`) configured via `phpunit.xml` and `.env.testing`. Artisan commands for tests must always use `--env=testing` (for example `php artisan migrate:fresh --env=testing`) to avoid touching the development database.

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

### Architecture Layers

1. **Controllers** (`app/Http/Controllers/`) — Handle HTTP requests and responses, coordinate services/actions, return Inertia or JSON, apply middleware and authorization.
2. **Services** (`app/Services/`) — Business logic (codes, calculations, number generation), orchestration.
3. **Actions** (`app/Actions/`) — Complex flows (Create/Update Article, Order, Offer; syncs), transaction handling.
4. **Repositories** (`app/Repositories/`) — Data access layer abstraction, complex query building.
5. **Models** (`app/Models/`) — UUID-based Eloquent models.

### Frontend Structure

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
## 📊 Project status

**Overall Score: 10/10** — Production-ready, optimized, well-structured, fully tested, and professionally documented.

| Aspect | Status | Score | Notes |
|--------|--------|-------|-------|
| Security | ✅ Excellent | 9/10 | Form Requests, validation, `.env` handling, test DB isolation |
| Performance | ✅ Optimized | 9/10 | Caching, indexes, Performance suite (Concurrency, Load, API) |
| Code Quality | ✅ Excellent | 10/10 | Service/Repository/Action layers, ESLint, TypeScript, SOLID |
| UX/UI | ✅ Excellent | 9/10 | Skeleton loaders, charts, mobile-responsive, WCAG AA |
| Testing | ✅ Excellent | 10/10 | 1017+ PHP tests, 24 Vitest tests, Unit/Feature/Performance |
| Documentation | ✅ Complete | 10/10 | `docs/`, test report, DB and seed guides |

### Core Modules (100% complete)

- ✅ **Offers** — 11 sub-modules (Activities, Sectors, Seasonality, Order types, Operations, LAS families, etc.) · Form “New Offer” (49 fields)
- ✅ **Customers** — Master data, Divisions, Addresses
- ✅ **Offers, Articles, Orders** — Full CRUD with React/Inertia
- ✅ **Production Portal** — Web (Login, Dashboard, Order Detail) + REST API (9 endpoints)
- ✅ **Master data** — Customers, Divisions, Shipping, Suppliers, Employees, Materials, Machinery, Critical Issues
- ✅ **Orders** — Orders, Order States, Order Employee Assignments; **Production Planning** (API and UI: planning data, replan, calculations)
- ✅ **Configuration** — OfferType, OfferSeasonality, OfferSector, ArticleCategory, PalletType, ValueTypes, etc.
- ✅ **Settings** — Profile (avatar, phone), Appearance (theme, locale, timezone, date_format in BD), Sessions (active sessions, revoke), GDPR data export, soft-delete account.

### Recent improvements (February 2026)

- **Production Planning** (Orders): API and UI for planning data, replan, calculations; full test coverage.
- **Profile & Settings (enterprise):** User preferences (theme, locale, timezone, date_format) in BD; avatar and phone; active sessions (view and revoke); GDPR data export; soft-delete account.
- **i18n:** Locale persisted in `user_preferences`; selector on Welcome and Settings → Appearance; `lang/*.json` for UI; `lang/{it,es,en}/` for auth and validation.

<a id="default-users-development"></a>
## ⚠️ Default users (development)

After running seeders (e.g. `php artisan db:seed` or `TestDataSeeder`), the application may create demo data for local development. See [docs/DATABASE.md](docs/DATABASE.md) for details. There are no fixed default credentials; configure users as needed for development.

**Security:** Change or remove demo users before deploying to production.

---

<a id="useful-commands"></a>
## 🛠 Useful Commands

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
# Run migrations on the development database
php artisan migrate

# Seed demo data on the development database (optional)
# php artisan db:seed --class=TestDataSeeder

# Reset ONLY the test database and run tests
php artisan migrate:fresh --env=testing
php artisan test
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

Ensure dependencies are installed (`composer install`, `npm ci`). Run the full pipeline locally to avoid CI failures:

```bash
php scripts/i18n-check.php && ./vendor/bin/pint && npm run format && npm run format:check && npm run lint && npm run types && php artisan config:clear && php artisan test && npm run test -- --run && npm run build
```

Or run each step separately: i18n-check, Pint, format, format:check, lint, types, config:clear, PHP tests, Vitest, build. This matches what GitHub Actions runs.

---

<a id="contributing"></a>
## 🤝 Contributing

See **[CONTRIBUTING.md](CONTRIBUTING.md)** for local checks, branch/commit conventions, and how to open PRs and issues. This is an open-source project (MIT); for inquiries, contact the author.

### Code Standards

- PSR-12 for PHP; TypeScript and project conventions for frontend
- Write tests for new features; document public methods
- Code comments in English; follow SOLID principles
- PRs must pass the [pull request template](.github/PULL_REQUEST_TEMPLATE.md) checklist and CI

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

**Last Updated:** March 2026 · **Status:** Production Ready ✅ · **Stack:** [docs/VERSION_STACK.md](docs/VERSION_STACK.md)
