# Contributing to Laser Packaging Laravel

Thank you for your interest in contributing to Laser Packaging Laravel.  
Please read this guide and the main `README.md` before opening pull requests.

---

## Branching and commits

- Branch from `main` (or `develop` if that’s the project’s default).
- Use short, descriptive branch names: `fix/issue-123`, `feature/planning-export`, `docs/readme`.
- Prefer clear commit messages; optionally follow [Conventional Commits](https://www.conventionalcommits.org/) (`fix:`, `feat:`, `docs:`, etc.).

---

## Local validation (CI parity)

Run the same steps as CI before opening a pull request.

### Lint pipeline (matches `.github/workflows/lint.yml`)

```bash
composer install -q --no-ansi --no-interaction --no-scripts --no-progress --prefer-dist
npm ci --legacy-peer-deps
vendor/bin/pint
npm run format:check
npm run lint
```

### Tests pipeline (matches `.github/workflows/tests.yml`)

```bash
npm ci --legacy-peer-deps
composer install --no-interaction --prefer-dist --optimize-autoloader
npm run build
cp .env.example .env
php artisan key:generate
php scripts/i18n-check.php
php artisan config:clear
npm run types
npm run test -- --run
php artisan test --compact
```

See `docs/TEST_COVERAGE.md` and the README “Before Pushing to GitHub” section for details.

---

## Code standards and tests

- Follow **PSR-12** for PHP and project conventions for TypeScript/React.
- Add or update tests for new behavior where relevant.

---

## Documentation

- Any documentation you add or change must be in **English**, professional in tone, and aligned with the current project state.
- See `docs/GIT_WHAT_TO_COMMIT.md` for guidance on what belongs in the repo.

---

## Pull requests and issues

- Open pull requests against the base branch (usually `main`); CI must be green before merge.
- Clearly describe the scope of the change and areas of the codebase touched.
- Use the PR template checklist and link related issues (for example, `Fixes #123`).
- When opening a new issue, use the **Bug report** or **Feature request** templates so the context is clear.

---

## Questions

For questions or coordination, contact the maintainer (see `README.md` → Author).

