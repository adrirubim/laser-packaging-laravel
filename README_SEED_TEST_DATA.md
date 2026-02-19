# Demo/Test Data for the Dashboard

This document explains how to create demo data to verify the full behaviour of the dashboard and all system features.

## 📋 Test Data Seeder

There is a full seeder (`TestDataSeeder`) that generates realistic demo data to test all features.

### Data created

The seeder creates (approximate numbers, tuned for realistic coverage):

1. **6 Customers** – with complete data (including one `CLI-DEMO-ALL`)
2. **Customer Divisions** – 1–3 divisions per customer (≈15 in total)
3. **Shipping Addresses** – 1–2 addresses per division (≈27 in total)
4. **4 Suppliers** – for employee contracts (including `FORN-DEMO-ALL`)
5. **13 Employees** – with complete data (including `EMP-DEMO-ALL` and examples “Rossi/Bianchi”)
6. **25 Employee Contracts** – 1–3 per employee, all fields filled:
   - 100% with supplier assigned
   - ≈70% active contracts (end_date in the future)
   - ≈30% ended contracts (end_date in the past)
   - All with salary level (0–4)
   - All dates valid (end_date > start_date)
7. **Materials and Machinery** – 6 materials, 6 machines, 4 pallet types
8. **Article Categories** – 6 categories
9. **Instructions and models** – 11 IC, 11 IO, 11 IP, 6 ModelSCQ, 6 CriticalIssue, 6 PalletSheet (all with placeholder files in storage for downloads)
10. **Offers** – activities, sectors, seasonality, offer/order types, LAS families, operations; 2–4 offers per customer with operations (OfferOperationList) → 22 offers total + 1 DEMO-ALL offer `2026_999_01_A`
11. **Articles** – 3–6 articles per offer + **1 demo article**
    - **All** articles have at least 1 packaging instruction (IC), 1 palletization (IP) and 1 operational (IO), so that in Show (Visualizza) “Visualizza” the three cards with ⋯ (Download file) appear.
    - **Demo article** to verify **all inputs**: code **`LAS-DEMO-ALL`** (all fields filled). It has **all fields** filled (base info, offer, category, pallet, packaging plan, pallet plans, line_layout, materials, machinery, critical issues, IC/IP/IO instructions, labels, weight and control, approvals, average productivity, Material Consumption Verification). In Articles (Articoli) → search for **"LAS-DEMO-ALL"** → Show / Edit / Duplicate to verify each input.
    - Relations: materials (1–3), machinery (1–2 with `value` on pivot), criticalIssues (0–2), IC/IO/IP instructions (1–3 per type), pivot offerarticles, Material Consumption Verification (~40% of articles)
    - Placeholder files for line_layout under `storage/app/line_layout/{uuid}/`
12. **Orders in all 7 statuses (operational snapshot):**
    - **~6 orders Pianificato** (status 0)
    - **~6 orders In Allestimento** (status 1)
    - **~9 orders Lanciate** (status 2)
    - **~15 orders In Avanzamento** (status 3)
    - **~6 orders Sospese** (status 4, with `motivazione`)
    - **~15 orders Evaso** (status 5)
    - **~10 orders Saldato** (status 6)
13. **Order States (OfferOrderState)** – 6 custom states
14. **Order–Employee assignments (OfferOrderEmployee)** – 1–3 employees per order
15. **Order Processings (ProductionOrderProcessing)** – 2–5 processings per order in Lanciato / In Avanzamento

16. **Production Planning** – `productionplanning` and `productionplanning_summary` rows for orders in planning status; one empty work line **LWL-VUOTA** for UI testing.
17. **Historical + daily completed orders for dashboard trends**:
    - **~50 historical completed orders** spread over the **last 12 months** (Evaso/Saldato) to feed long‑term trends and previous‑period comparisons.
    - **365 daily completed orders** (1 per day) for the **last 365 days**, all completed, so that dashboard date filters (`Oggi`, `Questa settimana`, `Questo mese`, long periods) always find data.

**Total:** dozens of orders in the 7 operational statuses + several hundred historical completed orders.  
**Downloads:** placeholder files are created in storage for instructions (packaging/operational/palletization), ModelSCQ, PalletSheet, article line_layout and offer operations (`offer-operations/`).

### "Demo All" records (all fields filled)

Each main section has **one DEMO-ALL record** with **all fields and relations filled** (no optional left blank), for:

1. **Show/Edit:** Verify each input displays and saves correctly. If a field is empty on the demo record, that is the one failing or not being passed.
2. **Create/Duplicate:** Where applicable (e.g. Duplicate article, New offer from customer), the demo record is the source with all fields; when duplicating or creating from context, any field that does not reach the form should be reviewed.

| Section | Code / criterion | Where to find |
|--------|--------------------|--------------|
| **Customers (Clienti)** | `CLI-DEMO-ALL` | Customers → search for "CLI-DEMO-ALL" or "Demo All" |
| **Divisions (Divisioni)** | 2 divisions of DEMO-ALL customer | Inside customer CLI-DEMO-ALL |
| **Shipping addresses** | 2 per division (DEMO-ALL customer) | Inside each division of CLI-DEMO-ALL |
| **Suppliers (Fornitori)** | `FORN-DEMO-ALL` | Suppliers → search for "FORN-DEMO-ALL" |
| **Staff / Employees (Personale)** | `EMP-DEMO-ALL` | Staff → search for "DEMO-ALL" or "EMP-DEMO-ALL" |
| **Contracts (Contratti)** | ≥2 contracts of employee EMP-DEMO-ALL | Inside employee EMP-DEMO-ALL |
| **Offers (Offerte)** | `2026_999_01_A` | Offers → search for "2026_999_01_A" or "Demo All" |
| **Activities (Offerte > Attività)** | `Demo All - Attività` | Offers > Activities → search for "Demo All" |
| **Sectors (Offerte > Settori)** | `Demo All - Settori` | Offers > Sectors → search for "Demo All" |
| **Seasonality (Offerte > Stagionalità)** | `Demo All - Stagionalità` | Offers > Seasonality → search for "Demo All" |
| **Offer types (Offerte > Tipi)** | `Demo All - Tipi offerta` | Offers > Offer types → search for "Demo All" |
| **LAS families (Offerte > Famiglie LAS)** | `Demo All - Famiglie LAS` / `LAS-FAM-DEMO` | Offers > LAS families → search for "Demo All" |
| **Work lines (Offerte > Linee di lavoro)** | `Demo All - Linee di lavoro` / `LWL-DEMO` | Offers > Work lines → search for "Demo All" |
| **L&S resources (Offerte > Risorse L&S)** | `Demo All - Risorse L&S` / `LSR-DEMO` | Offers > L&S resources → search for "Demo All" |
| **Order types (Offerte > Tipi di ordine)** | `Demo All - Tipi ordine` / `ORD-TIPO-DEMO` | Offers > Order types → search for "Demo All" |
| **Operation categories (Offerte > Categorie operazioni)** | `Demo All - Categorie operazioni` / `CAT-OP-DEMO` | Offers > Operation categories → search for "Demo All" |
| **Operations (Offerte > Operazioni)** | `Demo All - Operazione` / `OP-DEMO-ALL` | Offers > Operations → search for "Demo All" or "OP-DEMO-ALL" |
| **Articles (Articoli)** | `LAS-DEMO-ALL` | Articles → search for "LAS-DEMO-ALL" |
| **Materials (Articoli > Materiali)** | `Demo All - Materiale` / `MAT-DEMO-ALL` | Articles > Materials → search for "Demo All" |
| **Machinery (Articoli > Macchinari)** | `Demo All - Macchinario` / `MAC-DEMO-ALL` | Articles > Machinery → search for "Demo All" |
| **Pallet types (Articoli > Tipi pallet)** | `Demo All - Tipo pallet` / `PAL-DEMO-ALL` | Articles > Pallet types → search for "Demo All" |
| **Article categories (Articoli > Categorie)** | `Demo All - Categorie articoli` | Articles > Categories → search for "Demo All" |
| **Critical issues (Articoli > Problemi critici)** | `Demo All - Problemi critici` | Articles > Critical issues → search for "Demo All" |
| **Packaging instructions (Articoli > IC)** | `IC-DEMO-ALL` / `DEMO-ALL` | Articles > Packaging instructions → search "Demo" |
| **Operational instructions (Articoli > IO)** | `IO-DEMO-ALL` / `DEMO-ALL` | Articles > Operational instructions → search "Demo" |
| **Palletization instructions (Articoli > IP)** | `IP-DEMO-ALL` / `DEMO-ALL` | Articles > Palletization instructions → search "Demo" |
| **CQ models (Articoli > Modelli CQ)** | `MOD-DEMO-ALL` / "Demo All - Modello SCQ" | Articles > CQ models → search "Demo" |
| **Pallet sheets (Articoli > Fogli pallet)** | `PAL-SHEET-DEMO` / "Demo All - Foglio pallet" | Articles > Pallet sheets → search "Demo" |
| **Orders (Ordini)** | 1 Planned order with article LAS-DEMO-ALL | Orders → search "Demo" or "REF-DEMO-ALL" or "LAS-DEMO" (no Status filter) |

**Summary:** Each section and sub-section has at least one **Demo All** record findable by searching "Demo" / "Demo All" with **all fields filled** (no optional empty); in Show/Edit/Create/Duplicate, **if a field is empty, that is the one failing**. DEMO-ALL customer → DEMO-ALL offer → Article LAS-DEMO-ALL (with single FKs and relations: IC, IO, IP, CQ models, pallet sheets, materials, machinery, critical issues, approvals with demo employee) → demo order (lot, reason, labels, notes filled). Demo addresses: company, street, city, postcode, contacts always filled.

### Sections without a "Demo All" record

| Section | Note |
|--------|------|
| Offers > Operation lists | Linked to demo offer from Offer Show (contains operation OP-DEMO-ALL) |
| Offers > Operations | Operations; the demo offer has an operation list |
| Value Types | Value types (catalogue) |
| Order employees | Assignments; tested from Orders / Staff management |

### Flows with pre-filled context

With the seeder data you can verify that forms receive and display the initial data correctly when opened from a context:

| Flow | Where | Query / context |
|-------|--------|-------------------|
| New offer from customer | Customer Show → "Nuova Offerta" | `?customer_uuid=` → Customer pre-filled |
| Create division from customer | Customer Show → "Nuova Divisione" | `?customer_uuid=` → Customer pre-filled |
| Create address from customer/division | From division or list | `?customer_uuid=` and optional `?customerdivision_uuid=` |
| Duplicate offer | Offers Index/Show → "Duplica" | `?duplicate_from=` → all fields from offer |
| Convert to article | Offers Index/Show → "Converti in Articolo" | `?offer_uuid=` → Offer and derived data |
| Create article (duplicate) | Articles Index/Show → "Duplica" | `?source_article_uuid=` → IC/IP/IO relations, critical issues, Material Consumption Verification |
| Create order from article | Articles Index/Show → "Crea Ordine" | `?article_uuid=` → Article, production number, delivery place (if only one) |
| New operation (category) | OfferOperationCategories Show → "Nuova Operazione" | `?category_uuid=` → Category pre-filled |
| Offer operation list | From offer | `?offer_uuid=` → Offer pre-filled |

### Automated verification (tests)

An integration test checks that all DEMO-ALL sections load correctly (Show and Edit) and that data is passed to the frontend consistently:

```bash
php artisan test tests/Feature/Flows/DemoAllSectionsVerificationTest.php
```

The test creates minimal data with the same DEMO-ALL codes (CLI-DEMO-ALL, FORN-DEMO-ALL, EMP-DEMO-ALL, 2026_999_01_A, LAS-DEMO-ALL and one order) and verifies that each page returns 200 and that Inertia receives the expected props (e.g. `customer.divisions`, `offer.customer`, `order.article`).

## How to run the seeder

### Option 1: Run the seeder directly

```bash
cd laser-packaging-laravel
php artisan db:seed --class=TestDataSeeder
```

### Option 2: Run all seeders (includes test user)

```bash
cd laser-packaging-laravel
php artisan db:seed
```

**Note:** The main `DatabaseSeeder` only creates the test user. To create full demo data, run `TestDataSeeder` directly.

## Verification

After running the seeder, you can verify the data:

### Verify orders by status

```bash
php artisan tinker
```

Then run:

```php
use App\Models\Order;

// Total orders
Order::where('removed', false)->count();

// By status (7 states)
Order::where('removed', false)->where('status', 0)->count(); // Pianificato
Order::where('removed', false)->where('status', 1)->count(); // In Allestimento
Order::where('removed', false)->where('status', 2)->count(); // Lanciate
Order::where('removed', false)->where('status', 3)->count(); // In Avanzamento
Order::where('removed', false)->where('status', 4)->count(); // Sospese
Order::where('removed', false)->where('status', 5)->count(); // Evaso
Order::where('removed', false)->where('status', 6)->count(); // Saldato
```

### Check in the dashboard

1. Open the dashboard: `http://localhost:8000/dashboard`
2. Verify that the "Stato degli Ordini" cards show non‑zero numbers for each state
3. Use the **date filter** (`Tutto il tempo`, `Oggi`, `Questa settimana`, `Questo mese`, `Personalizzato`) and check that:
   - KPIs, charts and lists change consistently with the date range
   - There is always data in `Oggi` / `Questa settimana` thanks to the specific demo orders
   - Trends show a continuous history for the last 12 months
4. Use the **customer filter** (`Tutti i clienti` / specific customer) and verify that:
   - All cards and charts are recalculated only with that customer's data
5. Use the **status filter** to check that status distribution and lists respond correctly

## 🔄 Re-running the Seeder

If you need to recreate the demo data:

**⚠️ WARNING:** The current seeder **does wipe** all existing data before creating new demo data. This ensures the dashboard only shows seeder data.

The seeder automatically truncates all related tables before inserting the new demo data.

**Production:** The seeder **refuses to run** when `APP_ENV=production`. Use it only in local or test environments.

## 📊 Data Structure Created

```
Customers (5)
  └── Divisions (1–3 per customer)
      └── Shipping Addresses (1–2 per division)
  └── Offers (2–4 per customer, with OfferOperationList)
      └── Articles (3–6 per offer; pivot offerarticles; IC/IO/IP, materials, machinery, criticalIssues; Verifica Consumi)
          └── Orders (~60 across the 7 statuses: Pianificato, In Allestimento, Lanciate, In Avanzamento, Sospese, Evaso, Saldato)
              └── ProductionOrderProcessing (Lanciato + In Avanzamento)
              └── OfferOrderEmployee (1–3 per order)
Employees (10) → Contracts (1–3 per employee, with supplier)
```

## 🎯 Scenarios Covered

With this data you can test:

- ✅ Dashboard with realistic statistics
- ✅ Status filters in the orders list
- ✅ Clickable dashboard cards
- ✅ Urgent orders (upcoming due dates)
- ✅ Late orders (past due dates)
- ✅ Suspended orders
- ✅ Completed orders (Evaso + Saldato)
- ✅ Relationships between customers, offers, articles and orders
- ✅ Shipping addresses linked to orders
- ✅ CQ models with storage directories created

## 📝 Notes

- Production numbers are automatically generated by `OrderProductionNumberService`.
- Delivery dates are distributed across past, present and future.
- Worked quantities are calculated according to status (0 for Lanciate, partial for In Avanzamento, full for Evaso/Saldato).
- All relations are properly established.
- ModelSCQ files are stored under `storage/app/modelsCQ/{uuid}/`.
- The seeder wipes all existing data before inserting new demo data.
- Many-to-many relations for articles (materials, machinery, criticalIssues) are created automatically.
- Six custom order states are created with different configurations.
- Each order has 1–3 random employees assigned.

## ✅ Full Coverage

The seeder now covers **100% of the main system features**, including:

- ✅ All main models and their relations
- ✅ Custom order states (`OfferOrderState`)
- ✅ Order–employee assignments (`OfferOrderEmployee`)
- ✅ Article many-to-many relations (materials, machinery, criticalIssues)
- ✅ Order processings with multiple employees
- ✅ All data needed to fully test the dashboard and the main flows

---

**Last updated:** 13 February 2026
