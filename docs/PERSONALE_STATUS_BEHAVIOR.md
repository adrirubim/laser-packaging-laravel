# Comportamiento de Personale (Empleados y Contratos)

Documento de **referencia** del módulo Personale en `laser-packaging-laravel`: modelo de datos de empleados (employee), contratos (employeecontracts), asignación a órdenes (offerorderemployee), portal de producción (login/token) y código de barras. El legacy (`laser-packaging-be`) se cita como origen cuando aporta contexto.

**Estado:** Módulo cerrado. UX/UI nivel 10: pantallas Employees (Index, Create, Edit, Show), Contratti (ContractsIndex, Create, Edit), OrderEmployees (Index, ManageOrder) usan FlashNotifications, ConfirmDeleteDialog, FormValidationNotification y ConfirmCloseDialog; flujo Proroga; pay_level 0–8 (paridad completa con legacy); empty state; aria-labels; sin popups nativos.

---

## 1. Estructura legacy Personale

### 1.1. Plugins y archivos

- **Employee (empleados)**
  - **Clase:** `application/plugins/employee/class/employee.php`
  - **Modelo:** `employee_model.php` (tabla `employee`)
  - **Vistas:** scaffold estándar (insert/edit/show/list vía scaffold); `employee_downloadBarcode.twig`
  - **JS:** `view/js/employee/employee.js`
- **EmployeeContract (contratos)**
  - **Clase:** `application/plugins/employee/class/employeeContract.php`
  - **Modelo:** `employeeContract_model.php` (tabla `employeecontracts`)
  - **Vistas:** `employeeContract_insertDialog.twig`, `employeeContract_editDialog.twig`, `employeeContract_prorogaDialog.twig`, `employeeContract_showDetails.twig`
  - **JS:** `view/js/employeeContract/employeeContract.js`
- **Order–Employee (asignación orden–empleado)**
  - **Clase:** `application/plugins/order/class/orderEmployee.php`
  - **Modelo:** `orderEmployee_model.php` (tabla `offerorderemployee`)
  - Sin vistas propias de listado en backoffice; se usa desde offer/order (asignación de empleados).
- **Portal token:** `employeePortalToken_model.php` (tabla para tokens de acceso al portal).

---

## 2. Modelo de datos

### 2.1. Tabla `employee` (legacy y Laravel)

| Campo                 | Tipo / uso | Legacy | Laravel |
|-----------------------|------------|--------|---------|
| `id`                  | PK         | ✓      | ✓       |
| `uuid`                | UUID       | ✓      | ✓       |
| `name`                | Nombre     | ✓      | ✓       |
| `surname`             | Apellido   | ✓      | ✓       |
| `matriculation_number`| Matrícula  | ✓ (único) | ✓ (único) |
| `password`            | Hash SHA512| ✓      | ✓       |
| `portal_enabled`      | Acceso portal | ✓  | ✓       |
| `removed`             | Soft delete| ✓      | ✓       |

- **Legacy:** `employee::doSave()` comprueba que no exista otro empleado con el mismo `matriculation_number` (excluyendo el actual en edición). Si existe, devuelve "Questo codice esiste già".
- **Laravel:** Validación de unicidad en `StoreEmployeeRequest` / `UpdateEmployeeRequest` (campo `matriculation_number`).

### 2.2. Tabla `employeecontracts` (legacy y Laravel)

| Campo            | Tipo / uso | Legacy | Laravel |
|------------------|------------|--------|---------|
| `id`             | PK         | ✓      | ✓       |
| `uuid`           | UUID       | ✓      | ✓       |
| `employee_uuid`  | FK employee| ✓      | ✓       |
| `supplier_uuid`  | FK supplier| ✓      | ✓       |
| `pay_level`      | Nivel (0–8) | ✓     | ✓       |
| `start_date`     | Fecha inicio| ✓ (timestamp) | ✓ (date) |
| `end_date`       | Fecha fin  | ✓ (timestamp, nullable) | ✓ (date, nullable) |
| `removed`        | Soft delete| ✓      | ✓       |

- **Legacy `pay_level_values`:** 0 = D1 (ex 2a), 1 = D2 (ex 3a), 2 = C1 (ex 3a Super), 3 = C2 (ex 4a), 4 = C3 (ex 5a), 5 = B1 (ex 5a Super), 6 = B2 (ex 6a), 7 = B3 (ex 7a), 8 = A1 (ex 8a Quadri).
- **Laravel:** Usa los mismos 9 niveles 0–8 que el legacy, con las mismas etiquetas (`EmployeeContract::PAY_LEVEL_*` y `getPayLevelLabelAttribute()`) y opciones en la UI (Contracts/Create, ContractsIndex). Las rutas legacy JSON (`storeContractLegacy`, `updateContractLegacy`) y las rutas “nuevas” via Contracts/Create/Edit validan pay_level dentro de 0–8.

### 2.3. Tabla `offerorderemployee` (legacy y Laravel)

| Campo           | Uso        | Legacy | Laravel |
|-----------------|------------|--------|---------|
| `id` / etc.     | PK, uuid   | ✓      | ✓       |
| `order_uuid`    | FK orden   | ✓      | ✓       |
| `employee_uuid` | FK empleado| ✓      | ✓       |
| `removed`       | Soft delete| ✓      | ✓       |

- Asignación N:N entre orden y employee. Legacy: `orderEmployee::getEmployeeAssignment(order_uuid)`, `saveEmployeeAssignment(order_uuid, employee_list)`, `checkEmployeeOrder(employee_uuid, order_uuid)`.

---

## 3. Empleados (Employee): listado, creación, edición, detalle, eliminación

### 3.1. Legacy

- **Listado:** scaffold `employee` con alias "Personale"; campos visibles: id, name, surname, matriculation_number, portal_enabled (password y removed con `visible => false`). Borrado lógico con `delete` → update `removed = 1`.
- **Creación/edición:** formulario scaffold (nombre, apellido, matriculation_number, password, portal_enabled). `doSave()` valida unicidad de `matriculation_number`.
- **getAll():** JSON con lista de empleados activos (`removed = 0`). Usado por otros módulos (p. ej. contratos, offer).
- **getByUUID(uuid)** / **getByID(id):** obtienen un empleado activo; excepción si no existe.

### 3.2. Laravel

- **EmployeeController::index:** `Employee::active()`, filtros por `search` (nombre, apellido, matrícula), `portal_enabled`, ordenación (surname/name/matriculation_number), paginación. Render `Employees/Index`.
- **create/store:** `Employees/Create`, `StoreEmployeeRequest` (password hasheado con SHA512, portal_enabled). Redirect a index con flash success.
- **show:** `Employees/Show` con relaciones contracts, portalTokens, orderProcessings, orders.
- **edit/update:** `Employees/Edit`, `UpdateEmployeeRequest` (password opcional; si viene, se hashea SHA512).
- **destroy:** Soft delete; antes comprueba que no existan `orderProcessings` activos. Redirect a index con success.

**Paridad:** Listado, CRUD y borrado lógico equivalentes. Unicidad de matriculation_number y password SHA512 replicados.

---

## 4. Contratos (EmployeeContract): listado, creación, edición, prórroga, detalle

### 4.1. Legacy

- **Listado:** scaffold `employeeContract` (tabla "Contratti Personale"). Botones: edit, proroga, remove; botón de cabecera "Aggiungi" → insertDialog. En listado `pay_level` se muestra como texto (pay_level_values).
- **insertDialog():** Recibe opcionalmente `employee_uuid` y `supplier_uuid`. Carga `pay_level_list`, `all_employees`, `all_suppliers`; pasa uuid nuevo, employee/supplier preseleccionados.
- **saveEmployeeContract():** JSON con uuid, employee_uuid, supplier_uuid, start_date, end_date, pay_level. Convierte fechas con `convertToTimestamp`. Si `id` → update; si no → save. Respuesta "ok" o error.
- **editDialog():** Recibe `employeecontract_uuid`. Carga contrato, pay_level_list, all_employees, all_suppliers; devuelve datos para formulario (start_date/end_date como string Y-m-d).
- **prorogaDialog():** Recibe `employeecontract_uuid`. Nuevo UUID para el contrato prorrogado; start_date sugerida = end_date del contrato actual (o start_date si no hay end_date). Mismo esquema de opciones (employee, supplier, pay_level, date).
- **showDetails():** Detalle del contrato por ID con employee y supplier cargados; pay_level como texto.

### 4.2. Laravel

- **contractsIndex:** `EmployeeContract::active()` con filtros employee_uuid, supplier_uuid, search (sobre el empleado), ordenación (start_date, end_date, pay_level, employee, supplier), paginación. Render `Employees/ContractsIndex` con lista de contratos, employees y suppliers para filtros.
- **createContract / storeContract:** Rutas `employees/contracts/create` y `POST employees/contracts`. Form request con employee_uuid, supplier_uuid, start_date (required), end_date (nullable, after:start_date), pay_level (nullable, in:0,1,2,3,4). Redirect al índice de contratos.
- **editContract / updateContract:** Edición/actualización de un solo contrato; mismos campos.
- **destroyContract:** Soft delete del contrato.
- **Prórroga:** En legacy es un diálogo que crea un **nuevo** contrato con nuevo UUID y fecha de inicio sugerida. En Laravel no hay ruta dedicada "proroga"; se puede replicar creando un nuevo contrato desde Contracts/Create prellenando employee/supplier/fechas.

**Paridad:** Listado, alta y modificación de contratos equivalentes. Prórroga en legacy = nuevo contrato con fecha inicio = fin del anterior; en Laravel se hace a mano desde Create o con una futura acción "Proroga" que prerellene el formulario. **Pay level:** tanto legacy como Laravel usan ahora 0–8.

---

## 5. Asignación orden–empleado (Order Employee)

### 5.1. Legacy

- **orderEmployee::getEmployeeAssignment:** POST order_uuid → JSON `{ assignments: [ employee_uuid, ... ] }` (lista de employee_uuid asignados al orden, removed = 0).
- **orderEmployee::saveEmployeeAssignment:** POST order_uuid + employee_list (array de employee_uuid). Para cada asignación existente que ya no esté en la lista → marked removed = 1. Para cada uuid de la lista aún no asignado → nuevo registro (uuid, order_uuid, employee_uuid) con removed = 0.
- **checkEmployeeOrder(employee_uuid, order_uuid):** devuelve si existe asignación activa.

Usado desde la interfaz offer/order (asignación de empleados) y desde el portal para comprobar si el operario puede trabajar en un orden.

### 5.2. Laravel

- **OrderEmployeeController::getEmployeeAssignments:** GET con order_uuid → JSON `{ assignments: [ ... ] }` (mismo formato).
- **saveEmployeeAssignments:** Request order_uuid + employee_list; `SyncOrderEmployeesAction::execute(order_uuid, employee_list)` alinea el pivot `offerorderemployee` (añadir/quitar/soft delete). Redirect a `orders.show` con success.
- **checkEmployeeOrder:** GET con employee_uuid y order_uuid → JSON `{ assigned: true|false }`.
- **manageOrder(Order $order):** Render `OrderEmployees/ManageOrder` con orden, lista de asignados y lista total de empleados para gestionar las asignaciones desde la pantalla del orden.

**Paridad:** Lógica de asignación y desasignación equivalente; Laravel centraliza la sincronización en una Action.

---

## 6. Portal de producción: login y token

### 6.1. Legacy

- **employee::login():** Webservice. call_data: matriculation_number, password. Verifica con `real_login()` (password hasheado SHA512, portal_enabled = 1, removed = 0). Crea registro en `employeePortalToken` (employee_uuid, token, created_at). Responde con datos del empleado (sin id, password, removed) + token. Token válido 6 meses (en checkUserLogged se comprueba created_at >= now - 6 months).
- **checkUserLogged():** Lee user_data.token; busca token en employeePortalToken; carga employee; lanza si no válido. Usado por otros webservices del portal.
- **checkToken():** Solo verifica token y responde ok.

### 6.2. Laravel

- Login portal: típicamente en `ProductionPortal` (p. ej. `ProductionPortalWebController` o API). Verificar que se use el mismo esquema: password SHA512, portal_enabled, token en tabla equivalente (employee_portal_token o similar) y mismo criterio de expiración si aplica.
- API production: `ProductionPortalController::getEmployeeOrderList` etc. deben validar empleado logueado de forma equivalente.

**Paridad:** Revisar en Laravel que login, generación de token y validación de sesión repliquen legacy (SHA512, portal_enabled, ventana 6 meses).

### 6.3. Conclusión para implementación en Laravel

- **URL del portal:** En Laravel el empleado accede al portal en **`/production-portal/login`** (p. ej. `http://localhost:8000/production-portal/login`). Login con matrícula + contraseña o EAN (código de barras).
- **Acceso desde el backoffice:** En el legacy el portal es solo un **webservice** (`production\portal`, `@webservice portal`); no existe enlace ni entrada en el menú del backoffice. Por tanto **no es necesario** añadir un enlace "Portal dipendenti" en el sidebar o en Personale para mantener paridad. Si se desea mejorar la discoverability, se puede añadir opcionalmente (p. ej. en Personale o en el pie de la app) un enlace "Portale di Produzione" que apunte a esa URL.
- **Resumen:** Mantener la URL `/production-portal/login` como punto de entrada; la paridad con legacy se cumple sin enlace desde el backoffice.

---

## 7. Código de barras del empleado

### 7.1. Legacy

- **employee::downloadBarcode():** POST uuid. Código barcode = `str_pad(employee['id'], 13, '0', STR_PAD_LEFT)` (ID numérico a 13 cifras). Genera HTML con TypeCode128, lo convierte a PDF con wkhtmltopdf, devuelve PDF con nombre de archivo `barcode_addetto_{matriculation_number}.pdf`.

### 7.2. Laravel

- **EmployeeController::downloadBarcode(Employee $employee):** Mismo criterio: código = ID con padding 13, Code128, generación PDF (p. ej. Dompdf o wkhtmltopdf según implementación). Nombre de archivo coherente con matriculation_number.

**Paridad:** Mismo algoritmo de código (ID 13 cifras) y mismo uso para login/portal (EAN addetto). El formato PDF y la librería pueden diferir; el resultado funcional debe ser el mismo.

---

## 8. Resumen

| Área | Legacy | Laravel | Notas |
|------|--------|---------|--------|
| **Employee CRUD** | scaffold + doSave, unicidad matriculation_number, SHA512 | EmployeeController, Store/UpdateEmployeeRequest, mismo hash | Paridad |
| **Listado Employee** | getListFiltered, getAll | index con filtros search, portal_enabled, sort, pagination | Paridad |
| **Listado Contratti** | getList, pay_level como texto | contractsIndex con filtros y sort | Paridad |
| **Contratti create/edit** | insertDialog, editDialog, saveEmployeeContract | createContract, storeContract, editContract, updateContract | Paridad; pay_level 0–8 en ambos lados |
| **Prórroga contrato** | prorogaDialog → nuevo contrato | No hay ruta dedicada; equivalente = Create con datos prellenados | Implementar prórroga opcional |
| **Order–Employee** | getEmployeeAssignment, saveEmployeeAssignment, checkEmployeeOrder | getEmployeeAssignments, saveEmployeeAssignments, checkEmployeeOrder, ManageOrder | Paridad |
| **Portal login/token** | login(), checkUserLogged(), token 6 meses | Verificar ProductionPortal + API mismo esquema | Revisar paridad |
| **Barcode** | downloadBarcode, ID 13 cifras, PDF | downloadBarcode, mismo código, PDF | Paridad |

### Discrepancias a valorar

1. **Pay level contratos:** Legacy y Laravel usan 9 niveles (0–8) con las mismas etiquetas (D1…A1), tanto en modelo (`EmployeeContract`), como en UI (Contracts/Create, ContractsIndex) y en validaciones (Contracts Requests + rutas legacy JSON).
2. **Prórroga contratos:** En Laravel falta un flujo dedicado "Proroga"; se puede añadir una ruta/acción que abra Create con employee, supplier y start_date prellenados a partir de un contrato existente.

---

## 9. Recomendaciones para UX/UI nivel 10 y paridad 100% profesional

Para alinear el módulo Personale al mismo estándar que Ordini (sin `window.confirm`/`alert`, copy claro, modales coherentes) y lograr una experiencia "10" en UX/UI:

### 9.1. Consistencia de modales y notificaciones

- **Employees/Create y Employees/Edit**
  - Usar **FormValidationNotification** cuando el servidor devuelva errores de validación (como en Orders/Create, ProductionOrderProcessing/Create).
  - Usar **ConfirmCloseDialog** en "Annulla" / "Indietro": confirmar antes de salir si el usuario ha modificado algo (mismo patrón que Orders/Create).
- **Employees/Contracts/Create y Employees/Contracts/Edit**
  - Mismo enfoque: **FormValidationNotification** para errores del servidor, **ConfirmCloseDialog** al salir con datos no guardados.
- **Employees/Index, Show, ContractsIndex**
  - Ya en uso: **FlashNotifications** y **ConfirmDeleteDialog** para eliminación. Verificar que los textos (title, description, itemName) estén en italiano y sean coherentes con el resto de la app.
- **OrderEmployees/ManageOrder**
  - Si hay guardado con redirect: mostrar **FlashNotifications** para success/error. Si en el futuro se añade "Rimuovi tutti" u otras acciones destructivas, usar **ConfirmDeleteDialog** o **AlertDialog**, nunca `window.confirm`.

### 9.2. Flujo Prórroga de contratos

- Añadir un flujo dedicado **"Proroga"** para no dejar al usuario solo con "Crear nuevo contrato a mano":
  - Desde **ContractsIndex** o desde un eventual detalle de contrato: botón **"Proroga"**.
  - Ruta tipo `GET employees/contracts/create?proroga={contract_uuid}` (o `contracts/{contract}/proroga`).
  - Backend: carga el contrato, devuelve a Create los mismos datos (employee, supplier, pay_level) y **start_date = end_date del contrato** (o hoy si end_date ausente). El usuario confirma/modifica y guarda → nuevo contrato.
  - Copy claro en página: ej. "Nuovo contratto in proroga di [Nombre Apellido – Empresa]. Data inizio suggerita: …".

### 9.3. Pay level contratos (paridad con legacy)

- Si en producción legacy se usan niveles D1, D2, C1, C2 (pay_level 0–3 en parte ya mapeados en Laravel con otras etiquetas):
  - Ampliar **EmployeeContract** (constantes, `getPayLevelLabelAttribute`) y las validaciones **storeContract/updateContract** a todos los niveles 0–8 con las mismas etiquetas del legacy.
  - Actualizar las select/opciones en **Contracts/Create** y **Contracts/Edit** (y ContractsIndex si se muestra la etiqueta).

### 9.4. Copy y mensajes

- Todos los mensajes al usuario en **italiano** en la UI: placeholder, label, mensajes de validación, flash success/error, títulos/descripciones de los diálogos.
- Textos de ayuda donde proceda: ej. en Create Employee explicar "Accesso al Portale Abilitato" (para login desde el portal de producción); en Contratti, breve nota sobre "Data di fine" opcional.
  - *(Nota: la app está en italiano; este documento es la referencia en español.)*
- **Empty state** en Index Personale y ContractsIndex: mensaje claro + CTA (ej. "Nessun dipendente. Crea il primo." con enlace a Create).

### 9.5. Detalle y acciones secundarias

- **Employees/Show:** ya con relación contratos, processings, órdenes. Valorar enlaces rápidos "Gestisci contratti", "Barcode", "Cambia password" si no están ya, con iconos y etiquetas claras.
- **ContractsIndex:** acciones por fila (Modifica, Elimina, **Proroga**) desde dropdown o botones explícitos; evitar acciones destructivas sin confirmación.

### 9.6. Accesibilidad y responsive

- Etiquetas asociadas a todos los inputs (también select); `aria-label` en botones de icono.
- Orden de tab lógico en los formularios; mensajes de error asociados a los campos (InputError / aria-describedby).
- Layout responsive: tablas con scroll horizontal o variante en cards en móvil (como en Orders/ProductionAdvancements); filtros y botones que no se rompan.

### 9.7. Resumen de prioridades

| Prioridad | Acción | Estado |
|-----------|--------|--------|
| Alta | FormValidationNotification + ConfirmCloseDialog en Create/Edit Employee y Create/Edit Contract. | ✅ Implementado |
| Alta | Flujo "Proroga" contratos (ruta + prellenado start_date, employee, supplier). | ✅ Implementado |
| Media | Ampliar pay_level a 0–8 si se usan en legacy. | ✅ Implementado |
| Media | Verificar y unificar textos de ConfirmDeleteDialog (Employee, Contract) en italiano. | ✅ Implementado |
| Baja | Empty state y microcopy; accesibilidad y responsive. | ✅ Implementado |

**Nota:** Las recomendaciones de la sección 9 están implementadas (Employees/*, Contracts/*, EmployeeController, EmployeeContract, Orders/Show para flash tras redirect).

---

## 10. Referencias rápidas

- **Legacy Employee:** `application/plugins/employee/class/employee.php`, `employee_model.php`, `employee/employee.js`
- **Legacy EmployeeContract:** `application/plugins/employee/class/employeeContract.php`, `employeeContract_model.php`, vistas insert/edit/proroga/show, `employeeContract/employeeContract.js`
- **Legacy OrderEmployee:** `application/plugins/order/class/orderEmployee.php`, tabla `offerorderemployee`
- **Laravel:** `App\Models\Employee`, `App\Models\EmployeeContract`, `App\Models\OfferOrderEmployee`; `EmployeeController`, `OrderEmployeeController`; páginas `Employees/*`, `OrderEmployees/*`
