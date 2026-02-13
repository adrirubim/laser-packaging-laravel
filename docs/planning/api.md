# Planning API

**Last updated:** 13 February 2026

REST endpoints for Production Planning (Ordini → Pianificazione Produzione). Used by the planning UI and API clients.

---

## 1. `GET /api/planning/data`

**Purpose**  
Load everything needed to render the "Pianificazione Produzione" screen: work lines, orders per line, existing planning, active contracts, and summary rows.

**Parameters (query or POST)**

- `start_date` (string, required) – `YYYY-MM-DD HH:mm:ss`
- `end_date` (string, required) – `YYYY-MM-DD HH:mm:ss`

**Success response**

```json
{
  "error_code": 0,
  "lines": [
    {
      "uuid": "line-uuid",
      "code": "WL001",
      "name": "Linea di Lavoro 1",
      "orders": [
        {
          "uuid": "order-uuid",
          "code": "ORD2026001",
          "article_code": "ART-LAS-001",
          "description": "Article description",
          "delivery_requested_date": 1739385600,
          "quantity": 100,
          "worked_quantity": 40,
          "status": 0,
          "shift_mode": 0,
          "shift_morning": 0,
          "shift_afternoon": 0,
          "work_saturday": 0
        }
      ]
    }
  ],
  "planning": [
    {
      "id": 1,
      "order_uuid": "order-uuid",
      "lasworkline_uuid": "line-uuid",
      "date": "2026-02-12 00:00:00",
      "hours": "{\"800\":2,\"815\":2}"
    }
  ],
  "contracts": [
    {
      "id": 1,
      "employee_uuid": "emp-uuid",
      "qualifica": 1,
      "start_date": 1700000000,
      "end_date": null,
      "employee_name": "Mario",
      "employee_surname": "Rossi"
    }
  ],
  "summary": [
    {
      "id": 1,
      "date": "2026-02-12",
      "summary_type": "assenze",
      "hours": "{\"800\":1}"
    }
  ]
}
```

**Error response**

```json
{
  "error_code": -1,
  "message": "Error details"
}
```

---

## 2. `POST /api/planning/save`

**Purpose**  
Save or update planning for a specific cell (one hour or quarter-hour) and trigger future replanning.

**Parameters (JSON or form-data body)**

- `order_uuid` (string, required)
- `lasworkline_uuid` (string, required)
- `date` (string, required) – format `YYYY-MM-DD`
- `hour` (int, required) – 0–23
- `minute` (int, required) – 0, 15, 30, 45
- `workers` (int, required) – number of workers
- `zoom_level` (string, optional, default `'hour'`) – `'hour'` or `'quarter'`

**Success response**

```json
{
  "error_code": 0,
  "message": "Planning saved successfully",
  "planning_id": 123,
  "replan_result": {
    "message": "Planning aligned",
    "quarters_needed": 20,
    "quarters_planned": 20
  }
}
```

**Validation error**

```json
{
  "error_code": -1,
  "message": "Missing parameters"
}
```

---

## 3. `POST /api/planning/summary`

**Purpose**  
Save or reset manual values for summary rows (ASSENZE, CAPOREPARTO, MAGAZZINIERI) for a given hour.

**Parameters**

- `summary_type` (string, required) – `'assenze'`, `'caporeparto'`, `'magazzinieri'`, etc.
- `date` (string, required) – `YYYY-MM-DD`
- `hour` (int, required)
- `minute` (int, required)
- `value` (int, required)
- `reset` (int, required) – 1 = reset to default value, 0 = save explicit value
- `zoom_level` (string, optional) – `'hour'` or `'quarter'`

**Success response**

```json
{
  "error_code": 0,
  "message": "Summary saved",
  "summary_id": 1
}
```

---

## 4. `POST /api/planning/calculate-hours`

**Purpose**  
Calculate how many hours (and quarters) are needed to complete an order.

**Parameters**

- `order_uuid` (string, required)

**Success response**

```json
{
  "error_code": 0,
  "order_uuid": "order-uuid",
  "lasworkline_uuid": "line-uuid",
  "quantity": 400,
  "worked_quantity": 200,
  "remaining_quantity": 200,
  "media_reale_pz_h_ps": 25,
  "expected_workers": 2,
  "hours_needed": 4.0
}
```

**Error response**

```json
{
  "error_code": -1,
  "message": "Insufficient data for calculation"
}
```

---

## 5. `POST /api/planning/check-today`

**Purpose**  
Cron-style endpoint that checks all orders with planning for **today** and, if actual production (`worked_quantity`) has changed, adjusts future planning.

**Parameters**

- None.

**Success response**

```json
{
  "error_code": 0,
  "message": "Check completed: 5 orders checked, 2 modified",
  "date": "2026-02-12",
  "orders_checked": 5,
  "orders_modified": 2,
  "details": [
    {
      "order_uuid": "order-uuid",
      "result": {
        "message": "Added 4 quarters",
        "quarters_added": 4
      }
    }
  ]
}
```

---

**Implementation:** `app/Http/Controllers/Api/PlanningController`, `app/Services/PlanningDataService`, `PlanningReplanService`, `PlanningCalculationService`, `PlanningWriteService`. Any change to request/response shape must be reflected here and in the frontend that consumes these endpoints.
