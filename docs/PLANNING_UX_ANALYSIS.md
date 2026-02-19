# Production Planning — UX/UI and Parity Guide 2026

**Main route:** `/planning`  
**Context:** Production planning module by work lines (Linee di lavoro) and time slots.

This document gives an **executive‑level summary** of the functional and UX/UI state of the planning module in Laravel. It should allow anyone (product, UX, backend, frontend) to:

- Understand **what `/planning` does**.
- See **which UX/UI improvements are already applied**.
- Have a clear view of the **minimum roadmap** towards a Planning Board 2026.

For a deep, function‑by‑function technical checklist of the planning services and frontend behaviours, see the internal document `docs/planning/VERIFICACION_PARIDAD_LEGACY.md` (not committed to git).

---

## 1. Functional scope and pages

- **`GET /planning`**
  - Current production planning view in Laravel (Inertia + React).
  - Zoom at **day level** with two modes:
    - `zoomLevel = 'hour'`: hourly grid.
    - `zoomLevel = 'quarter'`: 15‑minute grid.
  - Includes:
    - Active LAS **lines** (`PlanningLine`).
    - **Orders** per line (`PlanningOrder`), with shift flags.
    - **Per‑cell planning** (`ProductionPlanning`).
    - **Staff summary** (`ProductionPlanningSummary`).

- **Planning backend**
  - Controller: `PlanningController`.
  - Services: `PlanningDataService`, `PlanningWriteService`, `PlanningCalculationService`, `PlanningReplanService`.
  - Key endpoints:
    - `POST /api/planning/data`
    - `POST /api/planning/save`
    - `POST /api/planning/summary/save`
    - `POST /api/planning/calculate-hours`
    - `POST /api/planning/check-today`
    - `POST /api/planning/force-reschedule`

---

## 2. Domain and behaviour overview

- **Backend**
  - Implements all core planning responsibilities:
    - data loading (`getData`‑style orchestration) for lines, orders, planning slots, summaries and contracts,
    - slot generation for the working day (6–22, 15‑minute intervals),
    - shift rules (`shift_mode`, morning/afternoon flags, Saturday handling),
    - hours‑needed calculation and automatic re‑planning,
    - staff summary aggregation (types such as assenze, caporeparto, magazzinieri, disponibili).
  - These behaviours are encapsulated in `PlanningController` + the Planning services and covered by dedicated tests.

- **Frontend (`resources/js/pages/Planning/Index.tsx`)**
  - Implements the planning UI over that domain:
    - calendar column generation from date + zoom (hours/quarters),
    - enable/disable cells according to shift configuration and weekday,
    - per‑slot values (number / `*` in hour view),
    - overdue highlighting and deadline border,
    - summary rows for staff availability and impegno,
    - planning and summary cell editing with keyboard navigation (Tab/Enter/Escape),
    - automatic reload of data after manual edits when the backend reports changes in future quarters.

- **Reference document**
  - For a low‑level, function‑by‑function mapping of backend services and frontend behaviours, refer to the **internal** checklist in  
    `docs/planning/VERIFICACION_PARIDAD_LEGACY.md`.

---

## 3. Technical architecture (short)

- **Backend**
  - `PlanningController`:
    - `index`: renders `/planning` and passes `today`.
    - `data`: orchestrates `PlanningDataService::getData`.
    - `save`: delegates to `PlanningWriteService::savePlanningCell` and then `PlanningReplanService::replanFutureAfterManualEdit`.
    - `saveSummary`: delegates to `PlanningWriteService::saveSummaryValue`.
    - others: hours calculation, check‑today, force‑reschedule.
  - `PlanningDataService`:
    - Aggregates lines, orders, planning, summary and contracts into a single consistent payload for the UI.
  - `PlanningWriteService`:
    - Encapsulates writes to `ProductionPlanning` and `ProductionPlanningSummary` (JSON slots `"800"`, `"815"`, ...).
  - `PlanningReplanService`:
    - Implements `replanFutureAfterManualEdit`, `autoScheduleOrder`, `adjustForWorkedQuantity`, `isWorkingDay`, etc.

- **Frontend (`resources/js/pages/Planning/Index.tsx`)**
  - Stack: Inertia React + TypeScript + Tailwind.
  - Main state:
    - `currentDate`, `zoomLevel`,
    - `lines`, `planning`, `summaries`, `contracts`,
    - `loading`, `error`, `infoMessage`,
    - editing state (`editingCellKey`, `editingValue`, `editingSummaryKey`, etc.).
  - Derived data:
    - `slotColumns` (day/hour/minute, weekend, day‑end),
    - `planningData` and `summaryData` (maps keyed by timestamp),
    - per‑column totals (TOTALE IMPEGNO) and per‑type summaries.
  - Conceptual components:
    - **Toolbar** (navigation and date range),
    - **Legend** (cell states),
    - **Planning grid** (DayGridView),
    - **Summary** (per‑type, per‑hour).

---

## 4. Current UX of `/planning` (executive view)

- **Temporal navigation**
  - **Prev / Next** buttons change `currentDate` by ±1 day.
  - **Oggi** button jumps back to today.
  - The visible range is always a **single day**, with zoom switching between hours and quarters.

- **Planning grid**
  - Rows:
    - Line (sticky left) + that line’s orders.
  - Columns:
    - Day × hour or day × quarter, depending on `zoomLevel`.
  - Cell behaviour:
    - Green = occupied (workers assigned).
    - Grey = free / not enabled due to shift/weekend.
    - Red = overdue (delivery date exceeded).
    - Amber border = deadline on the last on‑time column.
    - In hour view: `*` indicates mixed quarter values.
  - Editing:
    - Click → inline numeric editor for workers.
    - Enter/blur = save; Escape = cancel.

- **Staff summary**
  - Fixed rows: TOTALE IMPEGNO, DA IMPIEGARE, ASSENZE, DISPONIBILI, CAPOREPARTO, MAGAZZINIERI.
  - Columns: working hours.
  - ASSENZE, CAPOREPARTO, MAGAZZINIERI are editable.
  - DISPONIBILI is highlighted in red when non‑zero.

- **Automatic re‑planning**
  - After saving a planning cell, the backend may add/remove future quarters.
  - If there are changes (`quarters_added` / `quarters_removed`), the UI reloads data to reflect the new queue state.

---

## 5. UX/UI improvements already applied (2026)

These improvements are implemented in `Planning/Index.tsx` and aligned with the project’s modern design system.

### 5.1 Toolbar (top controls)

- Clear container:
  - `<header role="toolbar" aria-label="Controlli pianificazione">` with `rounded-lg border bg-muted/20 px-4 py-3 shadow-sm`.
- Well‑defined groups:
  - Navigation (Prev/Next + Oggi).
  - Current date or range (`Data:` / `Range:`) with calendar icon.
  - **Zoom** (Ore/Quarti) and **Period** (for future views) grouped with uppercase labels.
- Accessibility:
  - All buttons use `focus-visible:ring-2` with consistent `ring` and `ring-offset`.
  - The **Oggi** button is visually emphasised when the view is already on today.

### 5.2 Legend

- Semantic block:
  - `<section aria-labelledby="planning-legend-title">` with a clear “Legend” heading.
  - Uses `<dl> / <dt> / <dd>` to describe states (green busy, grey free, red overdue, amber border deadline, `*` mixed values).
- Collapsible behaviour:
  - On mobile/tablet, the legend can be collapsed with `<details>/<summary>` to save vertical space.
- Actions:
  - **“Vista classica (modifica slot)”** link aligned to the right, sharing the same focus and visual treatment as the rest of the modern UI.

### 5.3 Table header

- Sticky thead:
  - `<thead className="sticky top-0 z-20 border-b-2 border-border bg-card shadow-sm">` keeps headers visible while scrolling.
- Visual hierarchy:
  - `Linea` and `Ordine` columns use a slightly different background and right border to separate them from time slots.
  - Z‑index is tuned so left‑sticky columns correctly overlay the horizontal scroll area.
- Accessibility:
  - All header cells (`<th>`) use `scope="col"`.
  - The per‑day zoom (`+`) button has a title and consistent focus‑ring.

### 5.4 Feedback and loading states

- Messages:
  - Clear success/error messages after saving planning or summary data.
  - **Riprova** button on error banners to retry without a full page reload.
- Loading:
  - Navigation and zoom controls are disabled while `loading === true`.
  - Visual indicators (skeleton/spinner) are shown over planning areas.

---

## 6. UX roadmap 2026 (high level)

This section captures only the **current, relevant** enterprise‑level lines of work. Older P1–P4 / 7.x proposal tables are considered superseded by this summary.

- **6.1 Advanced time ranges**
  - Add **weekly** and **monthly** views:
    - Week: day × hour/quarter matrix with coherent navigation and a clear range label.
    - Month: compact per‑day view with per‑line totals and drill‑down to daily view.

- **6.2 Planning Board 2026**
  - Introduce/complete a `Planning/Board` view with:
    - Advanced toolbar (range, filters by line/status/shift, always‑visible legend).
    - Virtualised grid (for many lines/orders) with sticky first column.
    - Side panel with order details, replan actions, and navigation to order detail.

- **6.3 Accessibility and usability**
  - Review end‑to‑end keyboard navigation (including the future board).
  - Ensure all interactive elements have appropriate `aria-label` and visible focus in light/dark modes.
  - Consolidate tooltips (e.g. “08:15 – Occupato/Libero/oltre data consegna”) across all relevant cells.

- **6.4 Security and robustness**
  - Align `/api/planning/*` routes with the global authentication policy (e.g. `auth:sanctum` or equivalent middleware).
  - Centralise error and toast handling following the project‑wide pattern.

---

## 7. How to use this document

- To see the detailed technical checklist for planning services and frontend behaviours:  
  → see `docs/planning/VERIFICACION_PARIDAD_LEGACY.md` (internal).
- To understand the current behaviour and UX of `/planning`:  
  → see sections **3–5** of this document.
- To plan future work (modern board, weekly/monthly views, accessibility):  
  → use section **6** as the primary roadmap.

This document should be updated whenever there are significant changes to `/planning` or when `Planning/Board` becomes the main view.

