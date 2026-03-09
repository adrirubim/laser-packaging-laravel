## Branch workflow & protection

This repository follows a **short‑lived branch, long‑lived `main`** model.

- **`main`** is always deployable. Changes land here only via Pull Request.
- **Feature branches** are created from `main` and deleted after merge.

Recommended branch types:

- `feature/<ticket-or-short-name>` for new features.
- `fix/<ticket-or-short-name>` for bug fixes.
- `chore/<short-name>` for tooling, docs, or refactors.

### Pull Requests

- Keep PRs **small and focused** on one concern.
- Ensure the PR has:
  - A clear title and short description of the change.
  - Links to tickets or related PRs when applicable.
  - Checked items in the PR template (tests, docs, screenshots).
- All CI checks must pass before merging:
  - `tests` workflow (PHP, JS/TS, Vitest, Laravel tests).
  - `linter` workflow (Pint, ESLint, Prettier check).

### Branch protection (GitHub)

For the default branch (`main`), the recommended protection rules are:

- Require **Pull Request** before merging.
- Require **at least 1 approving review**.
- Dismiss outdated approvals when new commits are pushed.
- Require **status checks to pass** before merging:
  - `tests`
  - `linter`
- Restrict force pushes to admins only, and avoid rewriting `main` history.

### Local pre‑push habits

Before pushing a branch:

- Run at minimum:
  - `composer test` or `php artisan test --compact` for backend changes.
  - `npm test` / `npm run test -- --run` for frontend changes.
  - `npm run lint` and `npm run format:check` for JS/TS.
- Make sure your commit history is clean:
  - Prefer a few meaningful commits over many “fix typo” commits.
  - Use interactive rebase only on your own branches, never on `main`.

