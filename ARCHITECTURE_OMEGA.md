## Omega 2026 – Action → Resource → Response

This document describes the final, stable architecture of the application after the **Omega 2026** refactor.  
A new developer should be able to understand how the backend and frontend are wired by reading this file and
inspecting the folder structure.

- **Domain Actions (`src/Domains/*/Actions`)**  
  All business logic lives in **domain actions**.  
  - Controllers only orchestrate: they validate the request, call an Action, and choose the response type (Inertia, redirect, JSON).  
  - Each Action encapsulates a clear use‑case (create/update an entity, sync relationships, calculate metrics, etc.).

- **Resources (`app/Http/Resources/*`)**  
  All output to the frontend (Inertia SPA or APIs) is normalized through `JsonResource`.  
  - Inertia views use module‑specific resources (for example `OrderResource`, `PlanningBoardResource`, …).  
  - Generic APIs use `ApiResponseResource`, which standardizes the contract `{ success, message, data }`.

- **Standard JSON Response (`ApiResponseResource`)**  
  `ApiResponseResource` is the **only** exit door for JSON responses in controllers (except for very low‑level middleware or `Handler`).  
  - **Success**: `ApiResponseResource::success(true, message?, data?)`  
    - `success`: `true` when the operation completes successfully.  
    - `message`: short, human‑readable text (optional).  
    - `data`: typed payload (objects, arrays, transformed resources, etc.).  
  - **Error**: `ApiResponseResource::error(message, data?)`  
    - `success` is always `false`.  
    - `message` explains the error at a high level.  
    - `data` may contain additional details (for example, validation `errors`).  
  - Direct `response()->json()` calls are only allowed in very specific system middleware or in `Handler.php`.  
    Any controller endpoint returning JSON must use `ApiResponseResource`.

- **Views vs. APIs**  
  - **Web / Inertia views**: controllers return `Inertia::render(...)` with props already transformed by domain resources when appropriate.  
  - **APIs / AJAX**: controllers return `ApiResponseResource::success()` or `::error()`; any legacy or special structure must be wrapped inside `data` or, in exceptional cases, added via `->additional([...])` only when regression tests require it.

- **Architecture guardrail**  
  - If you detect “smart” business logic in a controller (beyond a simple `all()`/`find()` or delegating to a repository), move it into an Action under `src/Domains/{Domain}/Actions/`.  
  - Any new JSON endpoint must:  
    1. Call a **Domain Action**.  
    2. Pass the result through a **Resource** (where applicable).  
    3. Return the final payload wrapped in **`ApiResponseResource`**.  
  - This prevents architecture drift back into fat controllers or ad‑hoc JSON responses.

## Quick Start for Developers

- **Golden rule: Action → Resource → Response → Types**
  1. **Create the Domain Action** (`src/Domains/{Domain}/Actions/*Action.php`)  
     - Encapsulates the whole use‑case (reads/writes, business validation, side‑effects).  
     - Returns simple data structures (arrays/DTOs) or models already prepared for the Resource.
  2. **Define/update the Resource** (`app/Http/Resources/*`)  
     - Translates the Action result into the JSON contract expected by the frontend or API consumers.  
     - Contains no business rules; only projection/mapping and formatting.
  3. **Update the Controller** (`app/Http/Controllers/*Controller.php`)  
     - Injects the Action via constructor.  
     - Validates input with a Form Request.  
     - Calls the Action and returns:
       - `Inertia::render(...)` for SPA views, using Resources where appropriate.
       - `ApiResponseResource::success(...)` / `::error(...)` for JSON endpoints.
  4. **Type the frontend** (`resources/js/types/DomainModels.d.ts` + React pages)  
     - Add/adjust `Domain{Area}*` interfaces so they mirror the JSON produced by the Resource.  
     - Use these types in pages (`resources/js/pages/**`) and components to avoid `any` and to keep strict‑boolean rules enforced.

- **Checklist when adding a feature**
  - Is there already an Action in `src/Domains/{Domain}/Actions` that you can reuse or extend before creating a new one?  
  - Does the controller simply orchestrate (validate → call Action → return Resource/Response)?  
  - Is the JSON contract centralized in a `JsonResource` / `ApiResponseResource` and **not** hard‑coded in the controller?  
  - Does the frontend import only typed data from `DomainModels.d.ts` and avoid `any`?

