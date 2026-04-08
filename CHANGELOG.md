# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project aims to follow [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

### [Unreleased]

#### Changed

- Dependencies (npm): bumped `vite` to `8.0.7`, `@headlessui/react` to `2.2.10`, and `typescript-eslint` to `8.58.1`.
- Dependencies (Composer): bumped `laravel/boost` to `2.4.2`, `laravel/wayfinder` to `0.1.16`, and `phpunit/phpunit` to `13.1.1`.
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

