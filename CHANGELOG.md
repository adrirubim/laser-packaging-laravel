# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project aims to follow [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

### [Unreleased]

#### Changed

- Dependencies (npm): bumped `vite` to `8.0.8`, `lucide-react` to `1.8.0`, `react` / `react-dom` / `react-is` to `19.2.5`, and `typescript-eslint` to `8.58.2`.
- Dependencies (Composer): bumped `laravel/framework` to `13.5.0`, `inertiajs/inertia-laravel` to `3.0.6`, `laravel/boost` to `2.4.4`, and `phpunit/phpunit` to `13.1.5`.
- Wayfinder: regenerated `resources/js/routes/**` and `resources/js/actions/**`; updated Inertia `<Form>` usage to use `action={route.url()}` + `method="..."` (Wayfinder no longer provides `.form()` in generated types).
- Documentation: aligned version references and recommended commands (dev + CI parity) with the current stack.

### [1.0.0] - 2026-03-09

#### Added

- Initial public release of the laser packaging planning application.
- Full Laravel backend with Actions, Services, Repositories and rich test suite
  (Feature, Unit and Performance tests).
- Inertia + React frontend with Tailwind CSS and Wayfinder‑based routing.
- GitHub Actions CI for tests and linters.
- Branch protection policy and documentation.

