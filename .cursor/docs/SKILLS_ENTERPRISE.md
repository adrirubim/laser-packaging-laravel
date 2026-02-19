# Skills for enterprise-level — laser-packaging-laravel

**Scope:** Skills in `.cursor/skills/` apply to the **entire project** and are tracked in the repo (not ignored): anyone who clones the project gets the same enterprise standard. Activation rules are in `laravel-boost.mdc`.

This document defines which skills benefit the project and raise it to **enterprise** level: quality, maintainability, security, UX, and domain consistency.

---

## 1. Base skills (already present)

| Skill | Use |
|-------|-----|
| **wayfinder-development** | Backend routes in frontend (`@/actions`, `@/routes`), links and forms with Wayfinder. |
| **inertia-react-development** | Inertia pages, `<Link>`, `<Form>`, useForm, deferred props, prefetch, polling. |
| **tailwindcss-development** | Tailwind v4 styles, layout, responsive, dark mode. |

---

## 2. External skills (already in project)

These skills are added in `.cursor/skills/` (source: vercel-labs/agent-skills). No need to reinstall via CLI.

| Skill | Enterprise impact | When to activate |
|-------|-------------------|------------------|
| **react-best-practices** | Reduces re-renders, waterfalls, and bundle size; improves data fetching and performance in large views (e.g. Planning/Index.tsx). | When writing, reviewing, or refactoring React/Inertia. |
| **composition-patterns** | Scales components (props, composition, reusable libraries); avoids 2000+ line monoliths. | When refactoring complex pages or building reusable components. |
| **web-design-guidelines** | Accessibility, performance, and UX; aligns UI with enterprise standards. | When designing or reviewing UI, forms, and flows. |

*(CLI alternative: `npx skills add vercel-labs/agent-skills -a cursor --skill <name>` to install in Cursor; without `-a cursor` it may target another agent like Copilot.)*

---

## 3. Project-specific skills (in `.cursor/skills/`)

### 3.1 phpunit-laravel

- **Goal:** Keep PHPUnit tests as the enterprise standard: coverage, factories, filters, and no removal of tests without approval.
- **Location:** `.cursor/skills/phpunit-laravel/SKILL.md`
- **Activate when:** Creating or editing tests, touching controllers/services that have tests, running `php artisan test`.

### 3.2 planning-domain

- **Goal:** Unify planning domain rules: shifts (shift_mode, shift_morning, shift_afternoon), zoom (hour/quarter), API contract (error_code, lines/planning/contracts/summary), dates and validations.
- **Location:** `.cursor/skills/planning-domain/SKILL.md`
- **Activate when:** Working on Planning (controller, services, Index.tsx view, `/api/planning/*` API).

### 3.3 laravel-form-requests

- **Goal:** Validation via Form Request; rules convention (string vs array); messages; check sibling requests.
- **Location:** `.cursor/skills/laravel-form-requests/SKILL.md`
- **Activate when:** Creating or editing Form Requests, validation rules, or error messages.

### 3.4 laravel-api-json

- **Goal:** Consistent JSON responses (error_code, message, structure); 422/500; API Resources when applicable.
- **Location:** `.cursor/skills/laravel-api-json/SKILL.md`
- **Activate when:** api/* routes, controllers returning JSON, API Resources.

---

## 4. “Exponential enterprise” impact summary

| Area | Skills that raise it | Result |
|------|----------------------|--------|
| **Frontend performance** | react-best-practices, composition-patterns | Fewer re-renders, more modular and maintainable code. |
| **Quality and regressions** | phpunit-laravel, laravel-boost (tests) | Mandatory and consistent tests; fewer bugs in production. |
| **UX and accessibility** | web-design-guidelines, tailwindcss-development | Predictable and accessible UI. |
| **Planning domain** | planning-domain | Consistent planning behaviour and API across backend and frontend. |
| **Routes and forms** | wayfinder-development, inertia-react-development | Navigation and forms without breakage. |

---

## 5. Suggested adoption order

1. **Immediate:** Use the 3 base skills well (wayfinder, inertia-react, tailwindcss).
2. **Short term:** Use **react-best-practices** and **composition-patterns**; create and use **phpunit-laravel** and **planning-domain**.
3. **Medium term:** Add **web-design-guidelines** and review critical UI (Planning, forms, lists) with that skill.

---

## 6. What to install manually

### Project summary

- **Stack:** Laravel 12, Inertia v2, React 19, Tailwind v4, Wayfinder, Fortify, PHPUnit 12, PrimeReact/Radix, TypeScript.
- **Already in `.cursor/skills/`:** wayfinder, inertia-react, tailwindcss, phpunit-laravel, planning-domain, react-best-practices, composition-patterns, web-design-guidelines, laravel-form-requests, laravel-api-json.

### Install via CLI (Global = all your projects)

To have these skills apply to **all** your projects in Cursor, install them **Global** (one command per skill). **Exact names in the repo** (CLI does not accept `react-best-practices` or `composition-patterns`):

```bash
npx skills add vercel-labs/agent-skills -a cursor --skill vercel-react-best-practices
npx skills add vercel-labs/agent-skills -a cursor --skill vercel-composition-patterns
npx skills add vercel-labs/agent-skills -a cursor --skill web-design-guidelines
```

For each run: choose **Global** and **Symlink (Recommended)**.

### Create manually (this repo only or copy to Global)

These skills are **not** in vercel-labs/agent-skills; create them by hand (copy the folder to `.cursor/skills/` in the project or to `~/.cursor/skills/` for Global):

| Skill | Location | Purpose |
|-------|----------|---------|
| **laravel-form-requests** | `.cursor/skills/laravel-form-requests/SKILL.md` | Validation: always Form Request; rules convention (string vs array); messages; check sibling requests. |
| **laravel-api-json** | `.cursor/skills/laravel-api-json/SKILL.md` | JSON APIs: consistent response (error_code, message, structure); when to use API Resources; 422 validation. |

They are already created in this project (section 3). To use them in **all** your Laravel projects, copy the `laravel-form-requests` and `laravel-api-json` folders to `~/.cursor/skills/` (or the path Cursor uses on your system).

### What not to install

- **react-native-skills** (Vercel): this project is web-only; not applicable.
- Skills for other stacks (pure Next.js, etc.) unless you have projects in that stack and want Global.

Reference document for the agent and the team. It does not replace the rules in `laravel-boost.mdc` or in each SKILL.md.
