# Demo/Test Data for the Dashboard

This document explains how to create demo data to verify the full behaviour of the dashboard and all system features.

## 📋 Test Data Seeder

There is a full seeder (`TestDataSeeder`) that generates realistic demo data to test all features.

### Data created

The seeder creates:

1. **5 Customers** – with complete data
2. **Customer Divisions** – 1–3 divisions per customer
3. **Shipping Addresses** – 1–2 addresses per division
4. **3 Suppliers** – for employee contracts
5. **10 Employees** – with complete data
6. **18–30 Employee Contracts** – 1–3 contracts per employee, all fields filled:
   - 100% with a supplier assigned
   - 70% active contracts (end_date in the future)
   - 30% finished contracts (end_date in the past)
   - All with pay level (0–4)
   - All dates valid (end_date after start_date)
7. **Materials and Machinery** – 5 materials, 5 machines, 3 pallet types
8. **Article Categories** – 5 categories
9. **Instructions and models** – 10 IC, 10 IO, 10 IP, 5 ModelSCQ, 5 CriticalIssue, 5 PalletSheet (with placeholder files in storage for downloads)
10. **Offers** – activities, sectors, seasonality, offer/order types, LAS families, operations; 2–4 offers per customer with operations (OfferOperationList)
11. **Articles** – 3–6 articles per offer + **1 demo article**
    - **All** articles have at least 1 Istruzione di Confezionamento (IC), 1 di Pallettizzazione (IP) and 1 Operativa (IO), so that in “Visualizza” the three cards with ⋯ (Scarica file) appear.
    - **Demo article** to verify **all inputs**: code **`LAS-DEMO-ALL`** (tutti i campi compilati). It has **all fields** filled (informazioni base, offerta, categoria, pallet, piano imballaggio, piani pallet, line_layout, materiali, macchinari, criticità, istruzioni IC/IP/IO, etichette, peso e controllo, approvazioni, media produttività, Verifica Consumi Materiali). In Articoli → search for **"LAS-DEMO-ALL"** → Visualizza / Modifica / Duplica to verify each input.
    - Relations: materials (1–3), machinery (1–2 with `value` on pivot), criticalIssues (0–2), IC/IO/IP instructions (1–3 per type), pivot offerarticles, Verifica Consumi Materiali (~40% of articles)
    - Placeholder files for line_layout under `storage/app/line_layout/{uuid}/`
12. **Orders in all 7 statuses:**
    - **5 orders Pianificato** (status 0)
    - **5 orders In Allestimento** (status 1)
    - **8 orders Lanciate** (status 2)
    - **12 orders In Avanzamento** (status 3)
    - **5 orders Sospese** (status 4, with `motivazione`)
    - **15 orders Evaso** (status 5)
    - **10 orders Saldato** (status 6)
13. **Order States (OfferOrderState)** – 6 custom states
14. **Order–Employee assignments (OfferOrderEmployee)** – 1–3 employees per order
15. **Order Processings (ProductionOrderProcessing)** – 2–5 processings per order in Lanciato / In Avanzamento

**Total: ~60 orders** across the 7 statuses. **Downloads:** placeholder files are created in storage for instructions (packaging/operational/palletization), ModelSCQ, PalletSheet, article line_layout and offer operations (`offer-operations/`).

### Registros "Demo All" (tutti i campi compilati)

En cada sección principal hay **un registro DEMO-ALL** con **todos los campos y relaciones rellenados** (nada opcional en blanco), para:

1. **Show/Edit:** Verificar que cada input se muestra y guarda correctamente. Si un campo aparece vacío en el registro demo, ese es el que falla o no se está pasando.
2. **Create/Duplicate:** Donde aplique (p. ej. Duplica articolo, Nuova offerta da cliente), el registro demo sirve de fuente con todos los campos; al duplicar o crear desde contexto, los campos que no lleguen al formulario son los que hay que revisar.

| Sección | Código / Criterio | Dónde buscar |
|--------|--------------------|--------------|
| **Clienti** | `CLI-DEMO-ALL` | Clienti → buscar "CLI-DEMO-ALL" o "Demo All" |
| **Divisioni** | 2 divisioni del cliente DEMO-ALL | Dentro del cliente CLI-DEMO-ALL |
| **Indirizzi di spedizione** | 2 per divisione (cliente DEMO-ALL) | Dentro cada divisione de CLI-DEMO-ALL |
| **Fornitori** | `FORN-DEMO-ALL` | Fornitori → buscar "FORN-DEMO-ALL" |
| **Personale (Dipendenti)** | `EMP-DEMO-ALL` | Personale → buscar "DEMO-ALL" o "EMP-DEMO-ALL" |
| **Contratti** | ≥2 contratti del dipendente EMP-DEMO-ALL | Dentro del dipendente EMP-DEMO-ALL |
| **Offerte** | `2026_999_01_A` | Offerte → buscar "2026_999_01_A" o "Demo All" |
| **Attività** (Offerte > Attività) | `Demo All - Attività` | Offerte > Attività → buscar "Demo All" |
| **Settori** (Offerte > Settori) | `Demo All - Settori` | Offerte > Settori → buscar "Demo All" |
| **Stagionalità** (Offerte > Stagionalità) | `Demo All - Stagionalità` | Offerte > Stagionalità → buscar "Demo All" |
| **Tipi di offerta** (Offerte > Tipi) | `Demo All - Tipi offerta` | Offerte > Tipi di offerta → buscar "Demo All" |
| **Famiglie LAS** (Offerte > Famiglie LAS) | `Demo All - Famiglie LAS` / `LAS-FAM-DEMO` | Offerte > Famiglie LAS → buscar "Demo All" |
| **Linee di lavoro** (Offerte > Linee di lavoro) | `Demo All - Linee di lavoro` / `LWL-DEMO` | Offerte > Linee di lavoro → buscar "Demo All" |
| **Risorse L&S** (Offerte > Risorse L&S) | `Demo All - Risorse L&S` / `LSR-DEMO` | Offerte > Risorse L&S → buscar "Demo All" |
| **Tipi di ordine** (Offerte > Tipi di ordine) | `Demo All - Tipi ordine` / `ORD-TIPO-DEMO` | Offerte > Tipi di ordine → buscar "Demo All" |
| **Categorie operazioni** (Offerte > Categorie operazioni) | `Demo All - Categorie operazioni` / `CAT-OP-DEMO` | Offerte > Categorie operazioni → buscar "Demo All" |
| **Operazioni** (Offerte > Operazioni) | `Demo All - Operazione` / `OP-DEMO-ALL` | Offerte > Operazioni → buscar "Demo All" o "OP-DEMO-ALL" |
| **Articoli** | `LAS-DEMO-ALL` | Articoli → buscar "LAS-DEMO-ALL" |
| **Materiali** (Articoli > Materiali) | `Demo All - Materiale` / `MAT-DEMO-ALL` | Articoli > Materiali → buscar "Demo All" |
| **Macchinari** (Articoli > Macchinari) | `Demo All - Macchinario` / `MAC-DEMO-ALL` | Articoli > Macchinari → buscar "Demo All" |
| **Tipi pallet** (Articoli > Tipi pallet) | `Demo All - Tipo pallet` / `PAL-DEMO-ALL` | Articoli > Tipi pallet → buscar "Demo All" |
| **Categorie articoli** (Articoli > Categorie) | `Demo All - Categorie articoli` | Articoli > Categorie → buscar "Demo All" |
| **Problemi critici** (Articoli > Problemi critici) | `Demo All - Problemi critici` | Articoli > Problemi critici → buscar "Demo All" |
| **Istruzioni di confezionamento** (Articoli > IC) | `IC-DEMO-ALL` / `DEMO-ALL` | Articoli > Istruzioni di confezionamento → **Cerca** "Demo" |
| **Istruzioni operative** (Articoli > IO) | `IO-DEMO-ALL` / `DEMO-ALL` | Articoli > Istruzioni operative → **Cerca** "Demo" |
| **Istruzioni di pallettizzazione** (Articoli > IP) | `IP-DEMO-ALL` / `DEMO-ALL` | Articoli > Istruzioni di pallettizzazione → **Cerca** "Demo" |
| **Modelli CQ** (Articoli > Modelli CQ) | `MOD-DEMO-ALL` / "Demo All - Modello SCQ" | Articoli > Modelli CQ → **Cerca** "Demo" |
| **Fogli pallet** (Articoli > Fogli pallet) | `PAL-SHEET-DEMO` / "Demo All - Foglio pallet" | Articoli > Fogli pallet → **Cerca** "Demo" |
| **Ordini** | 1 ordine Pianificato con articolo LAS-DEMO-ALL | Ordini → **Cerca** "Demo" o "REF-DEMO-ALL" o "LAS-DEMO" (no filtro Stato) |

**Resumen:** Ogni sezione e sotto-sezione ha almeno un registro **Demo All** trovabile con **Cerca** "Demo" / "Demo All" e con **tutti i campi rellenados** (nessun opzionale vuoto), così in Show/Edit/Create/Duplicate: **se un campo è vuoto, è quello che fallisce**. Cliente DEMO-ALL → Offerta DEMO-ALL → Artículo LAS-DEMO-ALL (con single-FK e relazioni: IC, IO, IP, Modelli CQ, Fogli pallet, Materiali, Macchinari, Criticità, approvazioni con dipendente demo) → Ordine demo (lot, motivazione, etichette, indicazioni compilati). Indirizzi demo: co, via, città, CAP, contatti sempre compilati.

### Secciones sin registro "Demo All"


| Sección | Nota |
|--------|------|
| Offerte > Liste operazioni | Vinculado a oferta demo desde Offerte Show (contiene operación OP-DEMO-ALL) |
| Offerte > Operazioni | Operaciones; la oferta demo tiene lista operazioni |
| Value Types | Tipos de valor (catálogo) |
| Order employees | Asignaciones; se prueban desde Ordini / Gestione personale |

### Flujos con prerellenado (desde contexto)

Con los datos del seeder puedes probar que los formularios reciben y muestran correctamente los datos iniciales cuando se abren desde un contexto:

| Flujo | Dónde | Query / contexto |
|-------|--------|-------------------|
| Nuova Offerta desde Cliente | Cliente Show → "Nuova Offerta" | `?customer_uuid=` → Cliente prerellenado |
| Crea Divisione desde Cliente | Cliente Show → "Nuova Divisione" | `?customer_uuid=` → Cliente prerellenado |
| Crea Indirizzo desde Cliente/Divisione | Desde división o listado | `?customer_uuid=` y opcional `?customerdivision_uuid=` |
| Duplica Offerta | Offerte Index/Show → "Duplica" | `?duplicate_from=` → todos los campos desde oferta |
| Converti in Articolo | Offerte Index/Show → "Converti in Articolo" | `?offer_uuid=` → Offerta y datos derivados |
| Crea Articolo (duplicar) | Articoli Index/Show → "Duplica" | `?source_article_uuid=` → relaciones IC/IP/IO, criticità, Verifica Consumi |
| Crea Ordine desde Articolo | Articoli Index/Show → "Crea Ordine" | `?article_uuid=` → Articolo, N. produzione, Luogo di consegna (si uno solo) |
| Nuova Operazione (categoria) | OfferOperationCategories Show → "Nuova Operazione" | `?category_uuid=` → Categoria prerellenada |
| Lista Operazioni Offerta | Desde oferta | `?offer_uuid=` → Offerta prerellenada |

### Verificación automática (tests)

Un test de integración comprueba que todas las secciones DEMO-ALL cargan correctamente (Show y Edit) y que los datos se pasan al frontend de forma consistente:

```bash
php artisan test tests/Feature/Flows/DemoAllSectionsVerificationTest.php
```

El test crea datos mínimos con los mismos códigos DEMO-ALL (CLI-DEMO-ALL, FORN-DEMO-ALL, EMP-DEMO-ALL, 2026_999_01_A, LAS-DEMO-ALL y una orden) y verifica que cada página responda 200 y que Inertia reciba las props esperadas (p. ej. `customer.divisions`, `offer.customer`, `order.article`).

## 🚀 Cómo Ejecutar el Seeder

### Opción 1: Ejecutar directamente el seeder

```bash
cd laser-packaging-laravel
php artisan db:seed --class=TestDataSeeder
```

### Opción 2: Ejecutar todos los seeders (incluye usuario de prueba)

```bash
cd laser-packaging-laravel
php artisan db:seed
```

**Nota:** El `DatabaseSeeder` principal solo crea el usuario de prueba. Para crear los datos de prueba completos, ejecuta el `TestDataSeeder` directamente.

## ✅ Verificación

Después de ejecutar el seeder, puedes verificar los datos:

### Verificar órdenes por status

```bash
php artisan tinker
```

Luego ejecuta:

```php
use App\Models\Order;

// Total de órdenes
Order::where('removed', false)->count();

// Por status (7 estados)
Order::where('removed', false)->where('status', 0)->count(); // Pianificato
Order::where('removed', false)->where('status', 1)->count(); // In Allestimento
Order::where('removed', false)->where('status', 2)->count(); // Lanciate
Order::where('removed', false)->where('status', 3)->count(); // In Avanzamento
Order::where('removed', false)->where('status', 4)->count(); // Sospese
Order::where('removed', false)->where('status', 5)->count(); // Evaso
Order::where('removed', false)->where('status', 6)->count(); // Saldato
```

### Check in the Dashboard

1. Open the dashboard: `http://localhost:8000/dashboard`
2. Verify that the "Stato degli Ordini" cards show non‑zero numbers
3. Click each card to verify that filters work correctly

## 🔄 Re-running the Seeder

If you need to recreate the demo data:

**⚠️ WARNING:** The current seeder **does wipe** all existing data before creating new demo data. This ensures the dashboard only shows seeder data.

The seeder automatically truncates all related tables before inserting the new demo data.

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

**Last updated:** 2026-01-28
