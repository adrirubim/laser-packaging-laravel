# Stack Versions (Exact Reference)

Versions are resolved in `package-lock.json` and `composer.lock`. Check locally with `npm ls <pkg>` or `composer show <pkg>`.

---

## Backend (PHP / Composer)

| Package | Exact version (composer.lock) | Require in composer.json |
|---------|-------------------------------|---------------------------|
| **PHP** | 8.4.x (environment; minimum 8.2) | `^8.2` |
| **laravel/framework** | 13.4.0 | `^13.0` |
| **inertiajs/inertia-laravel** | 3.0.2 | `^3` |
| **laravel/fortify** | 1.36.2 | `^1.30` |
| **laravel/wayfinder** | 0.1.15 | `^0.1.9` |
| **phpunit/phpunit** | 13.1.0 | `^13.0` |

---

## Runtime Environment

| Tool | Version (reference environment) | Note |
|------|----------------------------------|------|
| **Node.js** | 22.22.x (e.g. 22.22.1) | Minimum 22.0.0; check: `node -v` |
| **npm** | 11.12.x (e.g. 11.12.1) | Reference environment; check: `npm -v` |
| **Composer** | 2.9.x (e.g. 2.9.5) | Reference environment; check: `composer -V` |

---

## Frontend (Node / npm)

| Package | Exact version (package-lock.json) | Range in package.json |
|---------|-----------------------------------|------------------------|
| **react** | 19.2.4 | `^19.2.0` |
| **react-dom** | 19.2.4 | `^19.2.0` |
| **@inertiajs/react** | 3.0.2 | `^3.0.2` |
| **typescript** | 6.0.2 | `^6.0.2` |
| **vite** | 8.0.6 | `^8.0.6` |
| **tailwindcss** | 4.2.2 | `^4.2.2` |
| **@types/react** | 19.2.14 | `^19.2.0` |
| **@types/react-dom** | 19.2.3 | `^19.2.0` |
| **eslint** | 10.2.0 | `^10.2.0` |
| **@eslint/js** | 10.0.1 | `^10.0.1` |
| **react-is** | 19.2.4 | `^19.0.0` (for recharts) |

---

## One-Liner Summary

To cite the stack in other documentation:

- **Backend:** PHP 8.2+, Laravel 13.4.x, Inertia Laravel 3.0.x, Wayfinder 0.1.x  
- **Frontend:** React 19.2.x, Inertia React 3.0.x, TypeScript 6.0.x, Vite 8.0.x, Tailwind CSS 4.2.x  

Reference: **March 2026**. Full detail: this file.
