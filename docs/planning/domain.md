# Planning – Data model

**Last updated:** 13 February 2026

Data model for Production Planning: tables, relationships, Laravel models. Document schema changes here.

---

## 1. Main entities

| Entity | Table | Notes |
|--------|--------|--------|
| **Work lines** | `offerlasworkline` | LAS work lines (code, name); soft delete `removed`. |
| **Offers** | `offer` | `lasworkline_uuid` → work line; `expected_workers`, `piece`; soft delete. |
| **Articles** | `articles` | `offer_uuid`; `media_reale_cfz_h_pz`, `real_workers`, `check_approval`; category, machinery, materials, etc. |
| **Orders** | `orderorder` | `article_uuid`; `quantity`, `worked_quantity`, `delivery_requested_date` (Unix); `status` 0–6; shift fields. |
| **Planning** | `productionplanning` | `order_uuid`, `lasworkline_uuid`, `date`, `hours` (JSON, keys HHmm, values = workers). |
| **Planning summary** | `productionplanning_summary` | `date`, `summary_type` (e.g. `assenze`, `caporeparto`, `magazzinieri`), `hours` (JSON); soft delete. |
| **Employees** | `employee` | `name`, `surname`; soft delete. |
| **Contracts** | `employeecontracts` | `employee_uuid`, `supplier_uuid`, `pay_level`, `qualifica` (0–3), `start_date`, `end_date`. |
| **Order processings** | `productionorderprocessing` | `order_uuid`, `employee_uuid`, `quantity`, `processed_datetime`; soft delete. |

Order **status** values: 0 = Pianificato, 1 = In Allestimento, 2 = Lanciato, 3 = In Avanzamento, 4 = Sospese, 5 = Evaso, 6 = Saldato.  
**Qualifica:** 0 = Addetto produzione, 1 = Caporeparto, 2 = Impiegato, 3 = Magazziniere.

---

## 2. Relationships (simplified)

```text
OfferLasWorkLine (offerlasworkline)
    │
    ├──< Offer (1:N)
    │       └──< Article (1:N)
    │               └──< Order (1:N)
    │                       ├──< ProductionPlanning (1:N)
    │                       └──< ProductionOrderProcessing (1:N)
    │
    └──< ProductionPlanning (1:N via lasworkline_uuid)

Employee
    └──< EmployeeContract (1:N)
```

Planning summary rows (assenze, caporeparto, magazzinieri) are keyed by date and summary_type; they are not directly linked to employee/contract tables but represent aggregate values per time slot.

---

## 3. Laravel models

In `app/Models/`:

- `OfferLasWorkLine` → table `offerlasworkline`; relations: `offers()`, `productionPlannings()`
- `Offer` → `lasWorkLine()`, `articles()`
- `Article` → `offer()`, `orders()`
- `Order` → `article()`, `productionPlannings()`, `orderProcessings()`
- `ProductionPlanning` → `order()`, `lasWorkLine()`
- `ProductionPlanningSummary` → table `productionplanning_summary`
- `Employee` → `contracts()`, `orderProcessings()`
- `EmployeeContract` → `employee()`
- `ProductionOrderProcessing` → `order()`, `employee()`

Models use `uuid` as the business key where applicable; primary key remains `id`. Tables follow the names above (`protected $table`). See [BACKEND_GUIDE.md](../BACKEND_GUIDE.md) for controller/service/repository conventions.
