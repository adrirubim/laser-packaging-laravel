---
name: phpunit-laravel
description: >-
  Activates when creating or editing PHPUnit tests, touching code covered by
  tests, or running php artisan test. Enforces enterprise standards: coverage,
  factories, filters, and no removal of tests without approval.
---

# PHPUnit & Laravel Testing (enterprise)

## When to apply

- Creating or editing tests (Feature, Unit, Performance).
- Modifying controllers, services, actions or models that have associated tests.
- Running `php artisan test` or discussing coverage/test strategy.

## Mandatory rules

1. **Every behaviour change** must have a test (new or updated). Run the affected tests before considering the change done.
2. **Use factories** to create models in tests. Check `states` before building data by hand.
3. **Do not remove** tests or test files without explicit user approval.
4. **PHPUnit only:** if Pest appears, convert to PHPUnit (this project uses PHPUnit).
5. **Create tests with Artisan:** `php artisan make:test --phpunit NameTest` (Feature by default; `--unit` for unit).

## Execution

- Full suite: `php artisan test --compact`
- One file: `php artisan test --compact tests/Feature/Controllers/PlanningControllerTest.php`
- One method: `php artisan test --compact --filter=index_returns_inertia_planning_page`

Run the **minimum set** of tests that proves the change does not break anything.

## Project conventions

- **TestCase:** `Tests\TestCase` with `RefreshDatabase` where needed.
- **Attributes:** use `#[Test]` to mark tests (PHPUnit 12).
- **Inertia:** `$response->assertInertia(fn ($page) => $page->component('...')->has('...'))`.
- **API JSON:** `assertJsonPath('error_code', 0)`, `assertJsonStructure([...])`, `assertJsonValidationErrors([...])`.
- **Factories:** `User::factory()->create()`, states when they exist (e.g. `Offer::factory()->create([...])`).
- **Conditional skips:** if a test depends on schema (e.g. legacy table), `$this->markTestSkipped('...')` with a clear message.

## Enterprise goal

Keep coverage high, tests fast and predictable, and zero regressions on merge. Tests are part of the product, not temporary files.
