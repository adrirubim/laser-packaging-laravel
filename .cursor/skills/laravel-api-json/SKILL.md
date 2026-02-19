---
name: laravel-api-json
description: >-
  Activates when creating or modifying endpoints that return JSON: api/*
  routes, controllers using response()->json(), API Resources. Consistent
  response shape and appropriate HTTP codes.
---

# Laravel API JSON

## When to apply

- Defining or changing routes in `routes/api.php`.
- Returning JSON from controllers (`response()->json()`, API Resources).
- Handling validation errors (422) or server errors (500) in APIs.

## Response contract

1. **Success:** Stable structure (e.g. `data`, or in this project Planning: `error_code: 0`, `lines`, `planning`, etc.). Prefer API Resources for list/detail when the module already uses them.
2. **Validation error (422):** Return `error_code: -1` (if the project uses it) and/or `message` + `errors` (Laravel format). Do not change the existing contract in modules like Planning.
3. **Server error (500):** `error_code: -1`, `message` (generic in production; detail only if `config('app.debug')`).
4. **HTTP codes:** 200 success, 422 validation, 401 unauthenticated, 403 unauthorized, 500 server error.

## Validation in API

- Use Form Request or `Validator::make()`; on failure return `response()->json([...], 422)` with the structure the project already uses (e.g. Laravel `errors`, or `error_code` + `message`).

## Documentation

- If adding a new public endpoint or a new contract, consider documenting the request/response structure in the repo (README, Postman, or API docs).

Goal: predictable APIs for the frontend and integrations; do not invent new formats per endpoint.
