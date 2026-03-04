# Contributing to Laser Packaging Laravel

Thank you for your interest in contributing to Laser Packaging Laravel.  
Please read this guide and the main `README` before opening pull requests.

---

## Branching and Commits

- Branch from `main` (or `develop` if that’s the project’s default).
- Use short, descriptive branch names: `fix/issue-123`, `feature/planning-export`, `docs/readme`.
- Prefer clear commit messages; optionally follow [Conventional Commits](https://www.conventionalcommits.org/) (`fix:`, `feat:`, `docs:`, etc.).

---

## Local Validation (Before You Submit)

Run the same steps as CI before opening a pull request:

1. **Formatting and static checks**
   - `php scripts/i18n-check.php`
   - `./vendor/bin/pint`
   - `npm run format`
   - `npm run format:check`
   - `npm run lint`
   - `npm run types`
2. **Application checks**
   - `php artisan config:clear`
   - `php artisan test`
   - `npm run test -- --run`
   - `npm run build`

See `docs/TEST_COVERAGE.md` and the README “Before Pushing” section for details.

---

## Code Standards and Tests

- Follow **PSR-12** for PHP and project conventions for TypeScript/React.
- Add or update tests for new behavior where relevant.

---

## Documentation

- Any documentation you add or change must be in **English**, professional in tone, and aligned with current best practices.
- See `docs/GIT_WHAT_TO_COMMIT.md` for guidance on what belongs in the repo.

---

## Pull Requests and Issues

- Open pull requests against the base branch (usually `main`); CI must be green before merge.
- Clearly describe the scope of the change and areas of the codebase touched.
- Use the PR template checklist and link related issues (for example, `Fixes #123`).
- When opening a new issue, use the **Bug report** or **Feature request** templates so the context is clear.

---

## Questions

For questions or coordination, contact the maintainer (see `README` → Author).
