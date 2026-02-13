# Stack versions (exact reference)

**Last updated:** 13 February 2026  
Versions below are **resolved** in `package-lock.json` and `composer.lock`. To check your environment: `npm ls <package>` and `composer show <package>`.

---

## Backend (PHP / Composer)

| Package | Exact version (composer.lock) | Require in composer.json |
|---------|-------------------------------|---------------------------|
| **PHP** | 8.4.x (environment; minimum 8.2) | `^8.2` |
| **laravel/framework** | 12.48.1 | `^12.0` |
| **inertiajs/inertia-laravel** | 2.0.19 | `^2.0` |
| **laravel/fortify** | (see composer.lock) | `^1.30` |
| **laravel/wayfinder** | 0.1.13 | `^0.1.9` |
| **phpunit/phpunit** | 12.5.8 | `^12.5.8` |

---

## Runtime environment

| Tool | Version (reference environment) | Note |
|------|----------------------------------|------|
| **Node.js** | 20.x (e.g. 20.19.6) | Minimum 18; check: `node -v` |

---

## Frontend (Node / npm)

| Package | Exact version (package-lock.json) | Range in package.json |
|---------|-----------------------------------|------------------------|
| **react** | 19.2.4 | `^19.2.0` |
| **react-dom** | 19.2.4 | `^19.2.0` |
| **@inertiajs/react** | 2.3.11 | `^2.3.7` |
| **typescript** | 5.9.3 | `^5.7.2` |
| **vite** | 7.3.1 | `^7.0.4` |
| **tailwindcss** | 4.1.18 | `^4.0.0` |
| **@types/react** | (aligned to react 19) | `^19.2.0` |
| **@types/react-dom** | (aligned to react-dom 19) | `^19.2.0` |

---

## One-liner summary (for documentation)

To cite the stack in other docs:

- **Backend:** PHP 8.2+, Laravel 12.48.x, Inertia Laravel 2.0.x, Wayfinder 0.1.x  
- **Frontend:** React 19.2.x, Inertia.js React 2.3.x, TypeScript 5.9.x, Vite 7.3.x, Tailwind CSS 4.1.x  

Reference: **February 2026**. Full detail: this file (`docs/VERSION_STACK.md`).
