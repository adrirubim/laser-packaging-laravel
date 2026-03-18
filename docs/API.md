# API Guide

This repository contains two API surfaces:

1. **Production Portal API** (`/api/production/*`) — used by devices/scanners and the Production Portal UI. It uses a **token passed in request payload**.
2. **Planning API** (`/api/planning/*`) — internal endpoints used by the authenticated Planning UI (`/planning`). They are same-origin calls and are not a public API contract.

All endpoints are defined in `routes/api.php`.

---

## 1) Production Portal API

### 1.1 Authentication options

There are two authentication flows:

#### A) EAN-based authenticate (employee + order)

**POST** `/api/production/authenticate`

Payload:

- `employee_number` (string, required)
- `order_number` (string, required)

Response:

- Uses `ApiResponseResource` with legacy `ok` fields preserved (`ok`, `order_uuid`, etc.).
- On error, returns an error message and HTTP status from the underlying Action.

#### B) Login (matriculation + password)

**POST** `/api/production/login`

Payload:

- `matriculation_number` (string, required)
- `password` (string, required)

Response:

- `employee.token` is a temporary portal token used for subsequent requests.

### 1.2 Token validation

**POST** `/api/production/check-token`

Payload:

- `token` (string, required)  
  *(Also accepted as `user_data.token` for legacy clients.)*

### 1.3 Token-protected endpoints

All endpoints below expect `token` in the request payload and return `401` if invalid/expired:

- **POST** `/api/production/add-pallet-quantity`
  - `order_uuid` (string, required)
  - `token` (string, required)

- **POST** `/api/production/add-manual-quantity`
  - `order_uuid` (string, required)
  - `quantity` (number, required, min 0.01)
  - `token` (string, required)
  - Response may include `print_url` in data.

- **POST** `/api/production/suspend-order`
  - `order_uuid` (string, required)
  - `token` (string, required)

- **POST** `/api/production/confirm-autocontrollo`
  - `order_uuid` (string, required)
  - `token` (string, required)

- **POST** `/api/production/employee-order-list`
  - `token` (string, required)

- **POST** `/api/production/get-info`
  - `order_uuid` (string, required)
  - `token` (string, required)

Implementation reference: `app/Http/Controllers/Api/ProductionPortalController.php`.

---

## 2) Planning API (internal)

These endpoints are used by the Planning UI (`GET /planning`) and return JSON resources.
They are not currently wrapped by `ApiResponseResource` and may include:

- `error_code`
- `message`
- `errors` (validation)

Endpoints:

- **POST** `/api/planning/data`
  - `start_date` (string, optional)
  - `end_date` (string, optional)

- **POST** `/api/planning/save`
  - `order_uuid` (string, required)
  - `lasworkline_uuid` (string, required)
  - `date` (date, required)
  - `hour` (int 0–23, required)
  - `minute` (int in 0,15,30,45, required)
  - `workers` (int >= 0, required)
  - `zoom_level` (`hour` or `quarter`, optional)

- **POST** `/api/planning/summary/save`
  - `summary_type` (string, required)
  - `date` (date, required)
  - `hour` (int 0–23, required)
  - `minute` (int in 0,15,30,45, required)
  - `value` (int, required)
  - `reset` (int 0/1, required)
  - `zoom_level` (`hour` or `quarter`, optional)

- **POST** `/api/planning/calculate-hours`
  - `order_uuid` (string, required)

- **POST** `/api/planning/check-today`
  - No required params (acts like a cron-style endpoint)

- **POST** `/api/planning/force-reschedule`
  - `order_uuid` (uuid, required)

Implementation reference: `app/Http/Controllers/Planning/PlanningController.php`.

