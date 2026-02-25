---
name: planning-domain
description: >-
  Activates when working on planning: PlanningController, Planning/* services,
  Planning/Index.tsx view, /planning and /api/planning/* routes. Unifies
  shifts, zoom, API contract and validations.
---

# Planning — Planning domain

## When to apply

- Any change in `app/Http/Controllers/Planning/`, `app/Services/Planning/`, `resources/js/pages/Planning/`.
- Routes or API: `/planning`, `/api/planning/data`, `/api/planning/save`, `/api/planning/replan`, etc.
- Discussions about shifts, slot, zoom, deadline, overdue, weekend, grid.

## Planning API contract

- **JSON responses** include `error_code`: `0` = OK, `-1` = error/validation.
- **POST /api/planning/data:** body `start_date`, `end_date` (datetime string). Response: `lines`, `planning`, `contracts`, `summary`.
- **POST /api/planning/save:** required validation: `order_uuid`, `lasworkline_uuid`, `date`, `hour` (0–23), `minute` (0|15|30|45), `workers` (≥0). Optional: `zoom_level` (`hour`|`quarter`).
- **Replan:** uses the same shifts and dates; respects `error_code` from the calculation service.

## Shifts (turni)

Defined in `OrderShiftHours` and used in backend and frontend:

- **shift_mode**
  - `0` = Giornata (day shift): 8–16 (hours 8…15 enabled).
  - `1` = Shifts: based on `shift_morning` and `shift_afternoon`.
- **shift_morning / shift_afternoon** (bool/int): when `shift_mode=1` they define morning (6–14), afternoon (14–22), or both (6–22).
- **work_saturday:** whether the order allows work on Saturday (used in replan and in the grid).
- There is no night shift in the current logic.

Enabled hours per order: use the same logic as `OrderShiftHours::forOrder()` and `isHourEnabled()`; the frontend must respect it for disabled cells (read-only or hidden).

## Zoom and cells

- **zoom_level:** `hour` (hourly slots) or `quarter` (quarters: 0, 15, 30, 45).
- **minute** in save: only `0`, `15`, `30`, `45` when zoom is by quarter; consistent with the grid.

## Dates and orders

- **delivery_requested_date:** used for ordering and priority; in API it may be timestamp or null.
- **Order of orders:** excluded statuses (e.g. 4,5,6) and `orderBy('delivery_requested_date')` as in PlanningDataService.
- **N+1:** use eager loading for orders and relations; avoid queries in loops.

## Frontend (Index.tsx)

- Grid: hours/quarters based on `zoom_level`; disabled cells based on shifts and `work_saturday`.
- Navigation: Tab/Enter, date picker, day/week/month range; summary aligned with API data.
- Errors: show messages from `error_code`/`message`; do not invent codes or structures.

## Enterprise goal

Single behavior between backend (PHP) and frontend (React): same shifts, same hours, same API contract and validations.
