# Contributing

Thank you for your interest in contributing. **Repository:** [github.com/adrirubim/laser-packaging-laravel](https://github.com/adrirubim/laser-packaging-laravel). Please read the [README](README.md) first (installation, code standards, and **Before Pushing to GitHub**).

## Before You Submit

1. **Run locally** (same as CI): `php scripts/i18n-check.php`, `./vendor/bin/pint`, `npm run format`, `npm run format:check`, `npm run lint`, `npm run types`, `php artisan config:clear`, `php artisan test`, `npm run test -- --run`, `npm run build`. See [docs/TEST_COVERAGE.md](docs/TEST_COVERAGE.md) and [README Before Pushing](README.md#-before-pushing-to-github).
2. Follow **PSR-12** (PHP) and project conventions (TypeScript/React).
3. Add or update tests for new behavior where relevant.
4. **Documentation:** Any documentation you add or change must be in **English**, professional in tone, and aligned with current best practices (see [docs/GIT_WHAT_TO_COMMIT.md](docs/GIT_WHAT_TO_COMMIT.md)).

## Branching and Commits

- Branch from `main` (or `develop` if that’s the project’s default). Use short, descriptive names: `fix/issue-123`, `feature/planning-export`, `docs/readme`.
- Prefer clear commit messages; optional: [Conventional Commits](https://www.conventionalcommits.org/) (`fix:`, `feat:`, `docs:`).

## Pull Requests

Open a PR against the base branch. Use the pull request template checklist; CI must pass before merge. Link the related issue in the description (e.g. `Fixes #123`).

## Issues

When opening a new issue, use **Bug report** or **Feature request** from the issue template dropdown so we have the right context.

## Questions

For questions or coordination, contact the maintainer (see [Author](README.md#-author) in the README).
