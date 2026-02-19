---
name: laravel-form-requests
description: >-
  Activates when creating or modifying validation in Laravel: Form Requests,
  rules in controllers, error messages. Enforces always using Form Request
  and following the project convention (string vs array).
---

# Laravel Form Requests and validation

## When to apply

- Creating or editing HTTP request validation.
- Adding rules to controllers or Form Requests.
- Defining validation error messages.

## Mandatory rules

1. **Always Form Request** for input validation in controllers; do not use Validator::make() or $request->validate() inline in the controller when a Form Request exists (or can exist) for that action.
2. **Check sibling requests** in app/Http/Requests/ to follow the same convention: this project uses **string-format rules** (e.g. 'field' => 'required|string|max:255') and sometimes array for rules with Rule:: (e.g. Rule::enum(), Rule::exists()).
3. **Include messages** when useful for the user; optional if rules are standard.
4. **authorize():** return true or authorization logic; do not leave it empty without a reason.

## Create Form Request

php artisan make:request NameRequest --no-interaction

## Project convention

String rules; when Rule:: is needed, use array: ['nullable', 'integer', Rule::enum(OrderLabelStatus::class)]. Keep consistency with existing Store*Request and Update*Request in the same module.
