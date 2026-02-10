# Análisis del backend legacy (laser-packaging-be)

Documento de **referencia milimétrica** del backend legacy `laser-packaging-be`: arquitectura, entrada, configuración, menú, plugins (customer, supplier, offer, articles, order, employee, production), modelos, tablas, webservices del portal y códigos de error. Sirve como fuente única para migración y paridad con `laser-packaging-laravel`.

**Estado:** Auditoría detallada del código legacy. No sustituye a PERSONALE_STATUS_BEHAVIOR.md ni ORDER_STATUS_BEHAVIOR.md en lo ya documentado allí; los complementa con visión global del BE.

---

## 1. Visión general

- **Stack:** PHP 8.x, framework MVC propio (`internetone/codebase` vía Composer), Twig, jQuery, Bootstrap 4.
- **Entrada:** `index.php` carga `vendor/autoload.php` y enruta con `mvc\router` (`$router->route()`). No hay rutas explícitas en el repo; el enrutado viene del framework en `vendor/`.
- **Configuración:** `config/config.php` extiende `\mvc\config`; versión `1.0.4`, nombre "Laser Packaging", SMTP y `loadCustomXML()`.
- **Menú backoffice:** Definido en `config/coreMenu.xml`; no hay entrada para el portal (solo webservice).

---

## 2. Estructura de directorios

```
laser-packaging-be/
├── index.php              # Entrada HTTP; router->route()
├── p.php                  # phpinfo() (utilidad)
├── cronjob.php
├── seed.php
├── composer.json          # internetone/codebase, hackzilla/password-generator, picqer/php-barcode-generator
├── config/
│   ├── config.php         # Config app (versión, SMTP, ws_software_name)
│   ├── coreMenu.xml       # Menú lateral backoffice (grupos e ítems)
│   └── error_codes.xml    # Códigos y mensajes de error (4xxxx)
├── application/
│   ├── class/             # Controladores raíz (sin namespace plugin)
│   │   ├── customer.php
│   │   ├── customerDivision.php
│   │   ├── customerShippingAddress.php
│   │   ├── supplier.php
│   │   └── valuetypes.php
│   ├── model/             # Modelos raíz
│   │   ├── customer_model.php
│   │   ├── customerDivision_model.php
│   │   ├── customerShippingAddress_model.php
│   │   ├── supplier_model.php
│   │   └── valuetypes_model.php
│   ├── view/              # Vistas/tpl/js raíz (customerShippingAddress, etc.)
│   └── plugins/
│       ├── articles/      # Articoli
│       │   ├── class/     # articles, articleCategory, articleCheckMaterial, articleCritical, etc.
│       │   ├── model/     # articles_model, articleCategory_model, ...
│       │   └── view/      # twig, js
│       ├── employee/      # Personale
│       │   ├── class/     # employee, employeeContract
│       │   ├── model/     # employee_model, employeeContract_model, employeePortalToken_model
│       │   └── view/      # twig, tpl (hbs), js
│       ├── offer/         # Offerte
│       │   ├── class/     # offer, offerArticles, activity, sector, type, lasFamily, lasWorkLine, ...
│       │   ├── model/     # offer_model, offerArticles_model, ...
│       │   └── view/      # twig, tpl, js
│       ├── order/         # Ordini
│       │   ├── class/     # order, orderState, orderEmployee
│       │   ├── model/     # order_model, orderState_model, orderEmployee_model
│       │   └── view/      # twig, tpl, js
│       └── production/    # Produzione (portal + avanzamenti)
│           ├── class/     # portal, orderProcessing
│           └── model/     # orderProcessing_model
├── docker/
└── vendor/                # internetone/codebase (MVC, scaffold, ws), picqer, hackzilla
```

---

## 3. Menú backoffice (coreMenu.xml)

| Grupo      | Label              | Clase raíz     | Ítems (class → method → label) |
|-----------|--------------------|----------------|---------------------------------|
| customer  | Clienti            | customer      | customer → showList (Anagrafica), customerDivision (Divisioni), customerShippingAddress (Indirizzi) |
| supplier  | Fornitori           | supplier      | supplier → showList (Anagrafica) |
| offers    | Offerte             | order\order   | offer\offer (Lista), activity (Attività), sector (Settori), type (Stagionalità), lasFamily, lasWorkLine, lsResource, offertypeorder, offeroperationcategory, offeroperation |
| articles  | Articoli            | articles\articles | articles (Anagrafica), articleCategory, machinery, criticalIssues, materials, palletType, modelsCQ, foglioPallet, articlesIC, articlesIP, articlesIO |
| orders    | Ordini              | order\order   | order\order (Lista), production\orderProcessing (Avanzamenti Di Produzione) |
| employee  | Personale           | employee\employee | employee\employee (Anagrafica), employee\employeeContract (Contratti) |

**Nota:** No existe ítem de menú para el portal de producción. El portal es solo API (`ws_key = 'portal'`).

---

## 4. Patrones de código legacy

### 4.1. Scaffold

- Los controladores de listado/CRUD suelen extender `\scaffold`.
- En el constructor: definen `$fields` (alias, visible, type), `$scaffold_object` (table, table_alias, delete behaviour, show_list, fields, list_buttons, js, etc.) y llaman a `$this->initScaffold($scaffold_object)`.
- **Borrado:** casi siempre lógico: `"delete" => ['behaviour' => 'update', 'field' => 'removed', 'deleted' => 1]`.
- Métodos típicos heredados/uso: `showList`, `getListFiltered`, `doSave`, `doDelete`, `insertDialog`, `editDialog`, diálogos custom (ej. `manageOrderStatusDialog`, `prorogaDialog`).

### 4.2. Modelos

- Extienden `\scaffold_model`.
- `const table = 'nombre_tabla';` y `parent::__construct($router, self::table)`.
- Algunos override `save`/`update` (ej. employeeContract_model para fechas vacías).

### 4.3. Webservices (portal)

- Clase `production\portal` extiende `\ws`, `protected $ws_key = 'portal'`.
- Los métodos que exponen API del portal están anotados con `@webservice portal`.
- Los controladores que usan el portal obtienen el webserver con `$this->router->getWebServer()` y llaman a `$this->webserver->getData()`, `setAnswer()`, `setUser()`.
- Contrato de llamada: `params->call_data` para input; `params->user_data` para token/sesión (tras login). Respuesta vía `setAnswer()` (y en portal se mezcla `user_info` en la respuesta).

---

## 5. Tablas y modelos (resumen)

| Tabla (model)                    | Plugin / clase modelo              | Uso principal |
|----------------------------------|------------------------------------|----------------|
| customer                         | application, customer_model        | Clientes |
| customerdivision                 | application, customerDivision_model| Divisiones cliente |
| customershippingaddress          | application, customerShippingAddress_model | Direcciones envío |
| supplier                         | application, supplier_model        | Fornitori |
| employee                         | employee, employee_model            | Personale |
| employeecontracts                | employee, employeeContract_model   | Contratti |
| employeeportaltoken              | employee, employeePortalToken_model| Tokens login portal |
| offerorderemployee               | order, orderEmployee_model         | Asignación orden–empleado |
| orderorder                       | order, order_model                 | Ordini |
| offerorderstate                  | order, orderState_model            | Estados orden (catálogo) |
| productionorderprocessing        | production, orderProcessing_model  | Avanzamenti (cantidad trabajada por orden) |
| (articles, offer, etc.)         | articles, offer, …                 | Articoli, offerte, etc. |

- **orderState** (clase) usa en su scaffold la tabla `offerorder` en el código inspeccionado; el **modelo** orderState_model usa `offerorderstate`. En caso de duda, prevalecer tabla del modelo: `offerorderstate`.

---

## 6. Plugins: resumen por dominio

### 6.1. Customer (application/class + model + view)

- **customer:** scaffold, tabla `customer`, CRUD, `getAllCustomers()`.
- **customerDivision:** scaffold, divisiones por cliente.
- **customerShippingAddress:** scaffold, direcciones de envío por división; usadas en órdenes y ofertas.

### 6.2. Supplier (application/class)

- **supplier:** scaffold, tabla `supplier`, CRUD, `getByUUID`, `getAllSuppliers()` (usado en contratos empleado).

### 6.3. Employee (plugins/employee)

- **employee:** scaffold tabla `employee`, alias "Personale"; listado con id, name, surname, matriculation_number, portal_enabled; borrado lógico; botón barcode; `getByUUID`, `getByID`, `getAll()`, `doSave()` (unicidad matriculation_number), `downloadBarcode()` (ID 13 cifras, Code128, wkhtmltopdf).  
  **Webservice portal:** `login()` (matriculation_number + password, SHA512, portal_enabled, crea employeePortalToken, responde empleado + token), `checkUserLogged()` (user_data.token, token válido 6 meses), `checkToken()`.
- **employeeContract:** scaffold tabla `employeecontracts`, alias "Contratti Personale"; pay_level 0–8; insertDialog, editDialog, prorogaDialog, saveEmployeeContract (JSON: uuid, employee_uuid, supplier_uuid, start_date, end_date, pay_level); conversión fechas timestamp ↔ Y-m-d.
- **employeePortalToken_model:** tabla `employeeportaltoken`; `removeAllTokens(employee_uuid)`.

### 6.4. Order (plugins/order)

- **order:** scaffold tabla `orderorder`; listado con columnas visibles/ocultas (status_semaforo, worked_quantity ocultos por defecto); insertDialog, editDialog, saveOrder, getByUUID, getByID; manageOrderStatusDialog, changeStatusTo* (Allestimento, Lanciato, InAvanzamento, Sospeso, Evaso, Saldato), saveSemaforo; downloadBarcode, downloadAutocontrollo; otherDialog (Gestisci Stato, Barcode, Autocontrollo).  
  **Webservice portal:** `getEmployeeOrderList()` (órdenes status 2 y 3, con article, customer, remain_quantity), `getInfo(order_uuid)` (orden + article, offer, lasworkline, pallet_type, customer, remain_quantity).
- **orderEmployee:** scaffold tabla `offerorderemployee`; getEmployeeAssignment(order_uuid), saveEmployeeAssignment(order_uuid, employee_list), checkEmployeeOrder(employee_uuid, order_uuid).
- **orderState:** scaffold tabla `offerorderstate` (catálogo estados); getByUUID.

### 6.5. Production (plugins/production)

- **portal:** clase `production\portal`, `extends \ws`, `$ws_key = 'portal'`; setUser, setAnswer (mezcla user_info en respuesta). Punto de entrada de todos los métodos anotados con `@webservice portal`.
- **orderProcessing:** scaffold tabla `productionorderprocessing`; listado "Avanzamenti Di Produzione".  
  **Webservice portal:** `addPalletQuantity(order_uuid)`, `addManualQuantity(order_uuid, quantity)`, `suspendOrder(order_uuid)`, `confirmAutocontrollo(order_uuid)`, `authenticate(employee_number, order_number)` (EAN addetto/ordine → token + order_uuid, autocontrollo, employee).  
  doSave/doDelete actualizan worked_quantity de la orden y, si status ≤ 2, cambian a In Avanzamento.
- **orderProcessing_model:** `loadProcessedQuantity(order_uuid)` (SUM quantity donde order_uuid y removed=0).

### 6.6. Articles (plugins/articles)

- Múltiples clases: articles, articleCategory, articleCheckMaterial, articleCritical, machinery, materials, palletType, modelsCQ, foglioPallet, articlesIC, articlesIP, articlesIO, etc., con modelos y vistas twig correspondientes. Usados por órdenes, ofertas y portal (artículo, pallet, foglio pallet).

### 6.7. Offer (plugins/offer)

- offer, offerArticles, activity, sector, type, lasFamily, lasWorkLine, lsResource, offertypeorder, offeroperationcategory, offeroperation, etc. Usados por artículos y órdenes (offer_uuid, lasworkline, unit_of_measure, etc.).

---

## 7. Webservices del portal (lista completa)

Todos se invocan en el contexto del webservice con `ws_key = 'portal'`. Autenticación: `employee\employee::checkUserLogged()` salvo login y authenticate.

| Clase                  | Método                | Autenticación | Descripción |
|------------------------|------------------------|---------------|-------------|
| employee\employee      | login                  | No            | call_data: matriculation_number, password → employee + token (SHA512, portal_enabled, token 6 meses) |
| employee\employee      | checkToken             | Token         | Valida token; respuesta ok |
| order\order            | getEmployeeOrderList   | Token         | Órdenes status 2 y 3 con article, customer, remain_quantity |
| order\order            | getInfo                | Token         | call_data.order_uuid → orden + article, offer, lasworkline, pallet_type, customer, remain_quantity |
| production\orderProcessing | addPalletQuantity   | Token         | call_data.order_uuid → +1 pallet, worked_quantity, opcional print_url |
| production\orderProcessing | addManualQuantity  | Token         | call_data.order_uuid, quantity → registro cantidad, opcional print_url |
| production\orderProcessing | suspendOrder       | Token         | call_data.order_uuid → status 4, motivazione autocontrollo |
| production\orderProcessing | confirmAutocontrollo | Token      | call_data.order_uuid → autocontrollo = 1 |
| production\orderProcessing | authenticate        | No (EAN)      | call_data.employee_number, order_number (EAN) → token + order_uuid + autocontrollo + employee |

---

## 8. Códigos de error (error_codes.xml)

Rangos por dominio (resumen):

| Rango   | Dominio        | Ejemplos |
|---------|----------------|----------|
| 400xx   | Core           | NOT_VALID_CONFIG_KEY, MISSING_PARAMS, PARAMS_NOT_VALID, FILL_ALL_PARAMS, UNAUTHORIZED_ACCESS, UUID_REQUIRED, FILE_NOT_FOUND |
| 401xx   | Employee (login)| EMPLOYEE_WRONG_LOGIN_DATA, EMPLOYEE_USER_VALIDATION, SUPPLIER_NOT_FOUND |
| 402xx   | Order          | ORDER_NOT_FOUND, ORDER_NOT_SAVED |
| 403xx   | State          | STATE_NOT_FOUND |
| 404xx   | Customer       | CUSTOMER_NOT_FOUND, CUSTOMER_DATA_INVALID, CUSTOMER_FIELDS_REQUIRED, CUSTOMER_SAVE_ERROR |
| 405xx   | Article        | ARTICLE_NOT_FOUND, ARTICLE_DELETE_ORDER, ARTICLE_IC/IO/IP_NOT_FOUND, ARTICLE_*_NOT_SAVED |
| 406xx–416xx | Activity, Sector, Type, LAS, Article subentidades | ACTIVITY_NOT_FOUND, SECTOR_NOT_FOUND, …, PALLETTYPE_NOT_FOUND, PALLETSHEET_NOT_FOUND, MODELCQ_* |
| 418xx   | Offer          | OFFER_NOT_FOUND, OFFER_DATA_INVALID, OFFER_NUMBER_DUPLICATE, OFFER_SAVE_ERROR, … |
| 419xx   | Foglio pallet  | FOGLIO_PALLET_* |
| 420xx–421xx | Customer address/division | CUSTOMER_ADDRESS_NOT_FOUND, DIVISION_NOT_FOUND |
| 422xx   | EAN            | MISSING_EAN_DATA |
| 423xx   | Employee       | EMPLOYEE_NOT_FOUND |
| 424xx   | Employee processing | MISSING_EMPLOYEE_PROCESSING_DATA |
| 425xx   | Order processing | MISSING_ORDER_PROCESSING_DATA |

---

## 9. Vistas y front (legacy)

- **Twig:** Formularios y diálogos (insertDialog, editDialog, showDetails, prorogaDialog, manageOrderStatusDialog, otherDialog, downloadBarcode, downloadAutocontrollo, etc.) en `application/view/` y `application/plugins/*/view/*.twig`.
- **JS:** Por plugin en `view/js/<plugin>/<entidad>.js` (ej. order/order.js, employee/employee.js, employeeContract/employeeContract.js); referenciados en scaffold con `"__relocate__js/..."`.
- **Tpl (Handlebars):** Botones y parciales en `view/tpl/` (ej. order/editOrderButton.hbs, employeeContract/prorogaButton.hbs).

---

## 10. Referencias cruzadas con documentación Laravel

| Tema legacy                    | Doc Laravel / sección |
|--------------------------------|------------------------|
| Personale (employee, contracts, portal login, barcode) | PERSONALE_STATUS_BEHAVIOR.md (§1–§7, §9); §6.3 conclusión portal |
| Ordini (estados, Gestisci Stato, semáforo, portal getEmployeeOrderList, getInfo) | ORDER_STATUS_BEHAVIOR.md (§1–§7, auditoría) |
| Portal producción (URL, sin enlace backoffice) | PERSONALE_STATUS_BEHAVIOR.md §6.3 |

---

## 11. Conclusión para migración

- El backend legacy es un **único punto de entrada** (`index.php` → router del framework) con menú en `coreMenu.xml` y **sin ruta web** para el portal; el portal es **solo API** (`ws_key = 'portal'`).
- **Scaffold** define tablas, campos, borrado lógico, botones y JS; los controladores añaden métodos específicos (diálogos, validaciones, webservices).
- **Paridad Laravel:** Mantener mismos nombres de tabla/campo donde aplique, mismos criterios de negocio (SHA512, portal_enabled, token 6 meses, estados orden 0–6, pay_level 0–8, etc.) según PERSONALE_STATUS_BEHAVIOR.md y ORDER_STATUS_BEHAVIOR.md.
- Este documento es la **referencia milimétrica** del BE legacy; para reglas de negocio detalladas por módulo, seguir los documentos *_STATUS_BEHAVIOR.md correspondientes.
