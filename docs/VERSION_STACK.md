# Versiones del stack (referencia exacta)

**Última actualización:** 2026-02-04  
Las versiones indicadas son las **resueltas** en `package-lock.json` y `composer.lock`. Para comprobar las actuales en tu entorno: `npm ls <paquete>` y `composer show <paquete>`.

---

## Backend (PHP / Composer)

| Paquete | Versión exacta (composer.lock) | Require en composer.json |
|---------|--------------------------------|---------------------------|
| **PHP** | 8.4.x (entorno; mínimo 8.2) | `^8.2` |
| **laravel/framework** | 12.48.1 | `^12.0` |
| **inertiajs/inertia-laravel** | 2.0.19 | `^2.0` |
| **laravel/fortify** | (ver composer.lock) | `^1.30` |
| **laravel/wayfinder** | 0.1.13 | `^0.1.9` |
| **phpunit/phpunit** | 12.5.8 | `^12.5.8` |

---

## Entorno de ejecución

| Herramienta | Versión (entorno de referencia) | Nota |
|-------------|----------------------------------|------|
| **Node.js** | 20.x (p. ej. 20.19.6) | Mínimo 18; comprobar: `node -v` |

---

## Frontend (Node / npm)

| Paquete | Versión exacta (package-lock.json) | Rango en package.json |
|---------|-------------------------------------|------------------------|
| **react** | 19.2.4 | `^19.2.0` |
| **react-dom** | 19.2.4 | `^19.2.0` |
| **@inertiajs/react** | 2.3.11 | `^2.3.7` |
| **typescript** | 5.9.3 | `^5.7.2` |
| **vite** | 7.3.1 | `^7.0.4` |
| **tailwindcss** | 4.1.18 | `^4.0.0` |
| **@types/react** | (alineado a react 19) | `^19.2.0` |
| **@types/react-dom** | (alineado a react-dom 19) | `^19.2.0` |

---

## Resumen one-liner (documentación)

Para citar el stack en otros documentos, usar:

- **Backend:** PHP 8.2+, Laravel 12.48.x, Inertia Laravel 2.0.x, Wayfinder 0.1.x  
- **Frontend:** React 19.2.x, Inertia.js React 2.3.x, TypeScript 5.9.x, Vite 7.3.x, Tailwind CSS 4.1.x  

Referencia: **febrero 2026**. Detalle completo: este archivo (`docs/VERSION_STACK.md`).
