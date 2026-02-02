# Datos de Prueba para el Dashboard

Este documento explica cómo crear datos de prueba para verificar el funcionamiento completo del dashboard y todas las funcionalidades del sistema.

## 📋 Seeder de Datos de Prueba

Se ha creado un seeder completo (`TestDataSeeder`) que genera datos de prueba realistas para probar todas las funcionalidades del sistema.

### Datos que se Crean

El seeder crea:

1. **5 Clientes** - Con datos completos
2. **Divisiones de Clientes** - 1-3 divisiones por cliente
3. **Direcciones de Envío** - 1-2 direcciones por división
4. **3 Proveedores** - Para contratos de empleados
5. **10 Empleados** - Con datos completos
6. **18-30 Contratos de Empleados** - 1-3 contratos por empleado, todos los campos completos:
   - 100% con proveedor asignado
   - 70% contratos activos (con fecha de fin futura)
   - 30% contratos finalizados (con fecha de fin pasada)
   - Todos con nivel de pago (0-4)
   - Todas las fechas válidas (end_date posterior a start_date)
7. **Materiales y Maquinaria** - 5 materiales, 5 maquinarias, 3 tipos de pallet
8. **Categorías de Artículos** - 5 categorías
9. **Instrucciones y modelos** - 10 IC, 10 IO, 10 IP, 5 ModelSCQ, 5 CriticalIssue, 5 PalletSheet (con archivos placeholder en storage para descargas)
10. **Ofertas** - Actividades, sectores, estacionalidades, tipos oferta/orden, familias LAS, operaciones; 2-4 ofertas por cliente con operaciones (OfferOperationList)
11. **Artículos** - 3-6 artículos por oferta + **1 artículo demo**
    - **Todos** los artículos tienen al menos 1 Istruzione di Confezionamento (IC), 1 di Pallettizzazione (IP) y 1 Operativa (IO), para que en Visualizza aparezcan las 3 tarjetas con el menú ⋯ (Scarica file).
    - **Artículo demo** para comprobar **todos los inputs**: código **`LAS-DEMO-ALL`** (tutti i campi compilati). Tiene **todos los campos** rellenados (informazioni base, offerta, categoria, pallet, piano imballaggio, piani pallet, line_layout, materiales, macchinari, criticità, istruzioni IC/IP/IO, etichette, peso e controllo, approvazioni, media produttività, Verifica Consumi Materiali). En Articoli → buscar **"LAS-DEMO-ALL"** → Visualizza / Modifica / Duplica para verificar cada input.
    - Con relaciones: materials (1-3), machinery (1-2 con value en pivot), criticalIssues (0-2), instrucciones IC/IO/IP (1-3 por tipo), pivot offerarticles, Verifica Consumi Materiali (~40 % artículos)
    - Archivos placeholder para line_layout en `storage/app/line_layout/{uuid}/`
12. **Órdenes en los 7 estados:**
    - **5 órdenes Pianificato** (status 0)
    - **5 órdenes In Allestimento** (status 1)
    - **8 órdenes Lanciate** (status 2)
    - **12 órdenes In Avanzamento** (status 3)
    - **5 órdenes Sospese** (status 4, con motivazione)
    - **15 órdenes Evaso** (status 5)
    - **10 órdenes Saldato** (status 6)
13. **Estados de Órdenes (OfferOrderState)** - 6 estados personalizados
14. **Asignaciones Empleados-Órdenes (OfferOrderEmployee)** - 1-3 empleados por orden
15. **Procesamientos de Órdenes (ProductionOrderProcessing)** - 2-5 procesamientos por orden en Lanciato/In Avanzamento

**Total: ~60 órdenes** en los 7 estados. **Descargas:** se crean archivos placeholder en storage para instrucciones (packaging/operational/palletization), ModelSCQ, PalletSheet, line_layout de artículos y operaciones de oferta (`offer-operations/`).

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

### Verificar en el Dashboard

1. Accede al dashboard: `http://localhost:8000/dashboard`
2. Verifica que las tarjetas de "Stato degli Ordini" muestren números diferentes de 0
3. Haz clic en cada tarjeta para verificar que los filtros funcionen correctamente

## 🔄 Re-ejecutar el Seeder

Si necesitas recrear los datos de prueba:

**⚠️ ADVERTENCIA:** El seeder actual **SÍ elimina** todos los datos existentes antes de crear nuevos datos. Esto asegura que el dashboard solo muestre los datos del seeder.

El seeder limpia automáticamente todas las tablas relacionadas usando `truncate` antes de crear los nuevos datos de prueba.

## 📊 Estructura de Datos Creados

```
Clientes (5)
  └── Divisiones (1-3 por cliente)
      └── Direcciones de Envío (1-2 por división)
  └── Ofertas (2-4 por cliente, con OfferOperationList)
      └── Artículos (3-6 por oferta; pivot offerarticles; IC/IO/IP, materials, machinery, criticalIssues; Verifica Consumi)
          └── Órdenes (~60 en los 7 estados: Pianificato, In Allestimento, Lanciate, In Avanzamento, Sospese, Evaso, Saldato)
              └── ProductionOrderProcessing (Lanciato + In Avanzamento)
              └── OfferOrderEmployee (1-3 por orden)
Empleados (10) → Contratos (1-3 por empleado, con proveedor)
```

## 🎯 Casos de Prueba Cubiertos

Con estos datos puedes probar:

- ✅ Dashboard con estadísticas reales
- ✅ Filtros de status en la lista de órdenes
- ✅ Tarjetas clickables del dashboard
- ✅ Órdenes urgentes (con fechas de entrega próximas)
- ✅ Órdenes en retraso (con fechas pasadas)
- ✅ Órdenes suspendidas
- ✅ Órdenes completadas (Evaso + Saldato)
- ✅ Relaciones entre clientes, ofertas, artículos y órdenes
- ✅ Direcciones de envío asociadas a órdenes
- ✅ Modelos CQ con directorios de almacenamiento creados

## 📝 Notas

- Los números de producción se generan automáticamente usando `OrderProductionNumberService`
- Las fechas de entrega se distribuyen entre pasadas, presentes y futuras
- Las cantidades trabajadas se calculan según el status (0 para Lanciate, parcial para In Avanzamento, completa para Evaso/Saldato)
- Todas las relaciones están correctamente establecidas
- Los directorios para archivos de ModelSCQ se crean automáticamente en `storage/app/modelsCQ/{uuid}/`
- El seeder limpia automáticamente todos los datos existentes antes de crear nuevos datos
- Las relaciones many-to-many de artículos se crean automáticamente (materials, machinery, criticalIssues)
- Se crean 6 estados personalizados de órdenes con diferentes configuraciones
- Cada orden tiene asignados 1-3 empleados aleatorios

## ✅ Cobertura Completa

El seeder ahora cubre **100% de las funcionalidades principales** del sistema, incluyendo:

- ✅ Todos los modelos principales y sus relaciones
- ✅ Estados personalizados de órdenes (`OfferOrderState`)
- ✅ Asignaciones de empleados a órdenes (`OfferOrderEmployee`)
- ✅ Relaciones many-to-many de artículos (materials, machinery, criticalIssues)
- ✅ Procesamientos de órdenes con múltiples empleados
- ✅ Todos los datos necesarios para probar el dashboard y todas las funcionalidades

---

**Última actualización:** 2026-01-28
