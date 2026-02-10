# Comportamiento de órdenes y estados (Ordini)

Documento de **referencia** del módulo Ordini: modelo de datos, estados, transiciones, Gestisci Stato, semáforo y portal de producción. El legacy (`laser-packaging-be`) se cita solo como origen cuando aporta contexto.


**Estado:** Módulo cerrado. Pantallas (Index, Show, Create, Edit, ManageStatus, Production Advancements, Production Order Processing) usan FlashNotifications, ConfirmDeleteDialog, AlertDialog, FormValidationNotification y ConfirmCloseDialog; sin popups nativos. La lógica de cambio automático de estado en función de la **worked_quantity** y de las transiciones manuales en Gestisci Stato está alineada con el legacy.
 ---

## Auditoría de cobertura legacy vs Laravel *(obsoleta — solo referencia histórica)*

Esta sección resume **qué partes de la sección Ordini del legacy están ya auditadas y reflejadas aquí**, y qué queda pendiente de revisar “al milímetro”.

### Estructura legacy Ordini

- **Clase principal:** `application/plugins/order/class/order.php` (~1626 líneas)
- **Modelo:** `order_model.php`
- **Vistas:** `order_showDetails.twig`, `order_manageOrderStatusDialog.twig`, `order_editDialog.twig`, `order_insertDialog.twig`, `order_otherDialog.twig`, `order_downloadBarcode.twig`, `order_downloadAutocontrollo.twig`
- **JS:** `view/js/order/order.js` (~925 líneas)
- **Relacionados:** `orderState.php`, `orderEmployee.php` (y modelos)

### Revisado en detalle (paridad comprobada o documentada)

| **Área** | **Legacy** | **Laravel** | **Sección en este doc** |
|--------|-----------|------------|--------------------------|
| **Listado (Index)** | `getList()`, orden de columnas, `article_uuid` → `cod_article_las`, `status` → etiqueta, semáforo solo status 1 | `OrderController::index`, `Orders/Index.tsx`, columnas visibles/ocultas | §3 Listado |
| **Columnas por defecto** | `visible => false` para `status_semaforo`, `worked_quantity` | Progresso y Semaforo ocultas por defecto; Azioni siempre visible | §3 Listado |
| **Gestisci Stato** | `manageOrderStatusDialog()` + `changeStatusTo*`, `saveSemaforo()` | `manageStatus`, `changeStatus`, `saveSemaforo`, `Orders/ManageStatus.tsx` | §4 Gestisci Stato |
| **Transiciones de estado** | 0→1, 1→2, 2→3, 3→4/5, 4→3, 5→6, 6 bloqueado | `isValidStatusTransition`, mismos flujos | §6 Transiciones |
| **Semáforo (E/P/P)** | Solo en status 1, guardado con `saveSemaforo` | Igual en ManageStatus y backend | §5 Semáforo |
| **Iconos urgenza (data consegna)** | (comportamiento implícito en legacy) | Verde / amarillo 0–3 días / rojo pasado; Evaso/Saldato siempre verde | §3 Listado / lógica de `getUrgencyStatus` |
| **Diálogo “Altro”** | `otherDialog`: Gestisci Stato, Stampa Barcode, Stampa Autocontrollo | En Laravel: acciones en dropdown (Gestisci Stato, Barcode, Autocontrollo) | §4 y rutas `orders.*` |
| **Download Barcode / Autocontrollo** | `downloadBarcode()`, `downloadAutocontrollo()` | `OrderController::downloadBarcode`, `downloadAutocontrollo` | §4 / rutas `orders.*` |

### Revisado de forma parcial o solo documental *(histórico, no tareas pendientes)*

> Estas filas documentan cómo se comparó el legacy con Laravel durante la migración. **Hoy el comportamiento está implementado en Laravel; no son TODOs.**

| **Área** | **Qué se documentó del legacy** |
|--------|----------------------------------|
| **Crear orden (insert)** | `insertDialog()` + `saveOrder()`: campos enviados, validaciones, unicidad, valores por defecto desde artículo. En Laravel: comprobar Create/Store contra lo descrito en §2. |
| **Editar orden** | `editDialog()` + POST save: qué campos son editables, reglas por estado, validación. En Laravel: Edit/Update y formulario equivalente (§3.1/3.2). |
| **Detalle orden (show)** | `showDetails()`: todos los campos mostrados, materiales, dirección, `pallet_sheet`, U.m., indicaciones. En Laravel: página Show y props que se envían (§3.2). |
| **Listado: filtros** | Cómo el scaffold legacy aplica filtros (búsqueda, estado, etc.) y si hay filtros extra. Paridad con filtros del Index Laravel (§3.3). |
| **`order.js` completo** | Validaciones, formato numérico (`num_filter`), `calculateRemainQuantity`, flujos de diálogos (open/close/confirm), mensajes de error. |
| **`order_editDialog.twig` / `order_insertDialog.twig`** | Estructura exacta de campos, obligatorios, deshabilitados por estado. |
| **`order_showDetails.twig`** | Layout completo y todos los bloques (solo lectura). |

### No revisado en profundidad *(histórico, impacto bajo en el día a día)*

> Áreas del legacy que no se auditaron “al milímetro”. Se mantienen como referencia por si en el futuro se necesita profundizar, pero **no bloquean el módulo Ordini en Laravel**.

| **Área** | **Descripción (visión legacy)** |
|--------|-----------------|
| **`getEmployeeOrderList`** | Webservice portal: lista de órdenes por empleado. Existe ruta API en Laravel; falta auditar paridad de respuesta y filtros. |
| **`getInfo`** | Uso en portal u otros endpoints; no contrastado aún con Laravel. |
| **`orderState` / `orderEmployee`** | Uso en listado o detalle (asignaciones empleado‑orden). Laravel tiene `OrderEmployeeController` y rutas; falta revisión detallada. |
| **Borrado lógico** | Comportamiento de `removed` y botón "remove" en listado (scaffold `delete` behaviour) vs. `Order::active()` en Laravel. |
| **`order_downloadBarcode.twig` / `order_downloadAutocontrollo.twig`** | Contenido de los PDF/impresiones (layout, datos) vs implementación Laravel. |

---

## 1. Modelo de datos de la orden (legacy)

En el legacy la lógica principal está en `application/plugins/order/class/order.php`, clase `order\order`, que trabaja sobre la tabla `orderorder`.

### 1.1. Campos relevantes

Los campos clave para comprender el comportamiento son (no es un listado completo de columnas, solo las relevantes para flujo y estados):

- **Identificación y claves**
  - `id`: identificador numérico interno (PK).
  - `uuid`: identificador UUID de la orden (clave pública para webservices y UI).
  - `article_uuid`: referencia al artículo (`articles`).

- **Números de orden**
  - `order_production_number`:
    - Número de orden de producción (`YYYY.####`, por ejemplo `2025.0007`).
    - Se genera automáticamente con `generateOrderProductionNumber()` cuando no se proporciona.
    - Debe ser **único**: `saveOrder()` comprueba que no se repita.
  - `number_customer_reference_order`:
    - Número de orden de referencia del cliente (opcional).
  - `line`:
    - Línea de orden (numérica).

- **Cantidades y fechas**
  - `quantity`: cantidad total pedida en la orden.
  - `worked_quantity`: cantidad ya trabajada/producida.
  - `delivery_requested_date`: fecha de entrega solicitada (timestamp en legacy).
  - `expected_production_start_date`: fecha prevista de inicio producción.
  - `expiration_date`: fecha de caducidad del lote.

- **Lote**
  - `type_lot`:
    - Tipo de lote:
      - 0: `Inserimento Manuale`.
      - 1: `Lotto a 6 cifre`.
      - 2: `Lotto a 4 cifre`.
  - `lot`: valor de lote (string/nullable).

- **Direcciones y cliente**
  - `customershippingaddress_uuid`: referencia a la dirección de envío seleccionada.
  - Desde esta dirección se obtiene la `customerdivision` y, a través de ella, el `customer`.

- **Etiquetas y materiales**
  - `external_labels`, `pvp_labels`, `ingredients_labels`, `variable_data_labels`, `label_of_jumpers`:
    - Valores enteros que representan estados de distintas familias de etiquetas.
    - Se inicializan a partir del artículo (`articles`) al crear.
  - `status_semaforo`:
    - JSON con estructura:
      - `etichette`: 0 / 1 / 2.
      - `packaging`: 0 / 1 / 2.
      - `prodotto`: 0 / 1 / 2.
    - Usado para el “semaforo” visual en UI.

- **Estado y control**
  - `status`: entero 0–6 que representa el estado de la orden (ver §1.2).
  - `motivazione`: texto de motivo cuando la orden está en `Sospeso`.
  - `autocontrollo`: flag numérico/booleano utilizado para control de autocontroles.
  - `removed`: flag lógico que indica “borrado lógico”.

### 1.2. Estados y significados

Los estados son numéricos y se mapean a etiquetas legibles:

- **0 — Pianificato**
- **1 — In Allestimento**
- **2 — Lanciato**
- **3 — In Avanzamento**
- **4 — Sospeso**
- **5 — Evaso**
- **6 — Saldato**

En el legacy:

- La propiedad privada `$orderStates_values` define este mapping:
  - `0 => 'Pianificato'`
  - `1 => 'In Allestimento'`
  - `2 => 'Lanciato'`
  - `3 => 'In Avanzamento'`
  - `4 => 'Sospeso'`
  - `5 => 'Evaso'`
  - `6 => 'Saldato'`

En Laravel:

- El enum `App\Enums\OrderStatus` define exactamente los mismos valores y etiquetas.
- El modelo `App\Models\Order` expone un accesor `status_label` que devuelve la etiqueta legible a partir del entero `status`.

---

## 2. Creación de una orden (legacy)

### 2.1. Flujo “Insert Dialog” (pantalla de alta)

Método **`insertDialog()`** en `order\order`:

- Entrada:
  - `POST['article_uuid']`: identificador del artículo sobre el que se va a crear la orden.
- Pasos principales:
  1. Genera un `uuid` nuevo para la orden (`\Utility::oneTimeToken()`).
  2. Recupera el **artículo**:
     - `articles\articles::getByUUID($article_uuid)`.
     - De ahí obtiene:
       - `cod_article_las` (código LAS de artículo).
       - Valores por defecto de etiquetas (`labels_external`, `labels_pvp`, `labels_data_variable`, `labels_ingredient`, `label_of_jumpers`).
  3. Recupera la **oferta** asociada al artículo:
     - `offer\offer::getByUUID($article['offer_uuid'])`.
     - De ahí obtiene:
       - `unit_of_measure` (`um`).
       - `customerdivision_uuid` para cargar direcciones de envío.
  4. Carga la **lista de direcciones de envío** (`customerShippingAddress`):
     - Filtra por `customerdivision_uuid` y `removed = 0`.
  5. Construye listas de opciones para:
     - `external_labels_values`, `pvp_labels_values`, `ingredients_labels_values`, `variable_data_labels_values`, `label_of_jumpers_values`.
  6. Carga **materiales** del artículo (`articles\articleMaterial_model` + `articles\materials`) para mostrarlos como lista en el diálogo.
  7. Si existe, carga el **foglio pallet** (`articles\foglioPallet`) asociado al artículo.
  8. Empuja todos estos datos a la vista (`view->push`) incluyendo:
     - `uuid` de la nueva orden.
     - `article_uuid`.
     - Número de producción **precalculado** con `generateOrderProductionNumber()`.
     - Listas de etiquetas, materiales, tipos de lote, etc.

**En Laravel**, este flujo se replica en `OrderController::create()` y en la lógica de repositorios/servicios:

- Se genera `productionNumber` usando `OrderProductionNumberService::generateNext()`.
- Se cargan artículo, direcciones de envío, materiales y demás opciones a través de `OrderRepository::getFormOptions()` y `OrderRepository::getArticleForForm()`.

### 2.2. Guardado de orden (`saveOrder()`)

**Legacy**

El método `saveOrder()` actúa como webservice que recibe un JSON bruto (`php://input`) con todos los datos del formulario de orden.

Pasos clave:

1. **Lectura y validación básica JSON**
   - `json_decode(file_get_contents("php://input"), true)`.
   - Si `!$data`, responde error JSON `"Dati non validi"`.
   - (En el código actual se ve un posible placeholder `if (!empty($missingFields))...` que serviría para validar campos obligatorios; en la versión que vemos, está sin rellenar).

2. **Chequeo de unicidad de `order_production_number`**
   - Busca órdenes en `orderorder` donde:
     - `order_production_number = $data["order_production_number"]`.
     - `removed = 0`.
   - Si está editando una orden existente (`isset($data['id'])`), excluye la propia orden de la comprobación.
   - Si encuentra alguna otra orden:
     - Devuelve error JSON `"Questo numero esiste già"`.

3. **Construcción del array `$orderData`**
   - Mappea los campos de entrada a la estructura de base de datos, con conversiones:
     - `uuid`, `article_uuid`, `order_production_number`, `number_customer_reference_order` tal cual.
     - `line`, `quantity`, `worked_quantity`:
       - Se convierten a numéricos solo si `is_numeric(...)`, si no, se dejan en `null`.
     - Fechas (`delivery_requested_date`, `expected_production_start_date`, `expiration_date`):
       - Convertidas a timestamp mediante `convertToTimestamp()` (usa `strtotime()` o `null` si vacío).
     - `customershippingaddress_uuid`:
       - Si viene vacía, se guarda como `null`.
     - Campos de tipo entero para etiquetas (`external_labels`, `pvp_labels`, `ingredients_labels`, `variable_data_labels`, `label_of_jumpers`):
       - Si vienen vacíos, se guardan como `null`.
       - Si vienen con valor, se castea a `(int)`.
     - Textos libres: `indications_for_shop`, `indications_for_production`, `indications_for_delivery` tal cual.

4. **Persistencia**
   - Si `isset($data['id'])` → **edición**:
     - Llama a `$this->model->update($data['id'], $orderData)`.
   - Si **no** hay `id` → **nueva orden**:
     - Añade al array:
       - `status = 0` (`Pianificato`).
       - `status_semaforo = {"etichette":0,"packaging":0,"prodotto":0}` (codificado como JSON string).
     - Llama a `$this->model->save($orderData)`.

5. **Respuesta**
   - Si `$result` es truthy:
     - Devuelve `{"ok":1}` como respuesta JSON de éxito.
   - Si no:
     - Devuelve error JSON usando `ORDER_NOT_SAVED`.

**Laravel**

Este mismo comportamiento se replica de forma más estructurada en:

- `StoreOrderRequest`: se encarga de la validación detallada de campos (tipos, requeridos, formatos).
- `CreateOrderAction::execute(array $validated)`:
  - Convierte strings vacíos a `null` en los campos nullable (direcciones, textos de indicaciones, fechas).
  - Comprueba la **unicidad** de `order_production_number` mediante `OrderProductionNumberService::exists()` (con opción de excluir un `id` en el caso de update).
  - Si el número no viene, lo genera automáticamente (`generateNext()`), exactamente igual que el legacy.
  - Inicializa `status` = `PIANIFICATO` (0).
  - Inicializa `status_semaforo` con el JSON de 3 campos a 0.
  - Crea la orden vía `Order::create($validated)` (modelo Eloquent).
- `UpdateOrderRequest` / `UpdateOrderAction::execute(Order $order, array $validated)`:
  - Valida los mismos campos que en el alta (con unicidad de número de producción excluyendo la propia orden).
  - Normaliza strings vacíos a `null` en campos nullable.
  - **Cambio automático de estado:** si el payload incluye `worked_quantity` y esta es mayor que la `worked_quantity` actual, y el `status` actual es ≤ `LANCIATO` (0–2) y *no* se ha enviado un `status` explícito en la request, el Action actualiza `status` a `IN_AVANZAMENTO` (3). Esto replica el comportamiento del portal/legacy (doSave/doDelete en `productionorderprocessing`) cuando se empieza a trabajar una orden.
  - Si la request envía un `status` explícito (por ejemplo, se pasa manualmente a `SOSPESO` desde Gestisci Stato), este valor tiene prioridad y **no se fuerza** el cambio automático a `IN_AVANZAMENTO`.

Resultado: **la lógica de alta y actualización de orden (campos, unicidad, estado inicial, cambio automático a IN_AVANZAMENTO y semáforo) es equivalente a la del legacy, encapsulada en Form Requests y Actions**.

---

## 3. Edición, detalle y listado de órdenes (legacy)

### 3.1. Edición de orden (`editDialog()`)

Método `editDialog()`:

- Entrada:
  - `POST['order_uuid']`.
- Pasos:
  1. Carga la orden por `uuid` (`getByUUID`), lanzando excepción si no existe.
  2. Carga el **artículo** asociado, la **oferta**, la **unidad de medida**, la **customerdivision** y la lista de direcciones de envío, igual que en `insertDialog()`.
  3. Vuelve a construir las listas de opciones de etiquetas (`external`, `pvp`, `ingredients`, `variable_data`, `jumpers`) y de materiales.
  4. Si existe, carga el `foglio pallet` del artículo.
  5. Empuja a la vista todos los campos de la orden (`id`, `uuid`, `order_production_number`, `number_customer_reference_order`, `line`, `quantity`, `worked_quantity`, fechas convertidas a `Y-m-d`, `type_lot`, `lot`, `expiration_date`, valores seleccionados de etiquetas, indicaciones, etc.).

En Laravel, este comportamiento se refleja en `OrderController::edit(Order $order)`, que:

- Carga la orden y sus relaciones necesarias.
- Obtiene de `OrderRepository` los mismos conjuntos de datos (artículos, shipping addresses, artículo para formulario, opciones de etiquetas y tipo de lote).

### 3.2. Detalle de orden (`showDetails()` / `getInfo()`)

**`showDetails()` (legacy backoffice)**:

- Carga la orden por `id`.
- Carga:
  - Artículo y código LAS.
  - Oferta y unidad de medida.
  - Lista de direcciones de envío y selecciona la que coincide con `customershippingaddress_uuid`, construyendo un string legible de dirección.
  - Valores legibles de etiquetas y tipo de lote a partir de los arrays de valores (`$external_labels_values`, `$ingredients_labels_values`, etc.).
  - Materiales vinculados al artículo.
  - Foglio pallet (si existe).
- Calcula `remain_quantity = quantity - worked_quantity`.
- Pasa todo a la vista de detalle.

**`getInfo()` (webservice portal)**:

- Entrada:
  - `call_data->order_uuid` en el cuerpo de la petición.
- Pasos:
  - Comprueba que el empleado está logueado.
  - Carga la orden por `uuid` y elimina campos internos (`id`, `removed`).
  - Carga:
    - `CustomerShippingAddress` → `CustomerDivision` → `Customer` (quitando campos internos).
    - Artículo, oferta, línea de trabajo (`lasWorkLine`), tipo de pallet (`pallet_type`).
  - Calcula `remain_quantity = quantity - worked_quantity`.
  - Devuelve toda esta estructura en `webserver->setAnswer(['order' => $order])`.

En Laravel, estos conceptos se replican en:

- `OrderController::show(Order $order)` (detalle para backoffice vía Inertia).
- Los controladores/servicios del **Production Portal** en Laravel (no detallados aquí, pero con tests en `tests/Feature/Controllers/ProductionOrderProcessingControllerTest.php` y API en `routes/api.php`), que devuelven los mismos datos esenciales (orden + artículo + cliente + remain_quantity).

### 3.3. Listado de órdenes (`getList()` legacy vs `OrderRepository::getForIndex()`)

**Legacy (`getList()` override en `order\order`)**:

- Llama a `parent::getList(true)` para obtener cabeceras y datos de tabla.
- Reordena las columnas para que el listado tenga el orden deseado:
  - `id`, `order_production_number`, `number_customer_reference_order`, `line`, `article_uuid`, `quantity`, `delivery_requested_date`, `status`, …
- Reescribe algunos campos en cada fila de orden:
  - `article_uuid`:
    - Lo reemplaza por `cod_article_las` del artículo vinculado (mostrando código LAS en lugar de UUID).
    - Guarda `article_uuid_orig` con el valor original.
  - `status`:
    - Reemplaza el entero por la etiqueta (`Pianificato`, `In Allestimento`, etc.) usando `$orderStates_values`.
    - Guarda `status_orig` con el valor numérico.
  - `status_semaforo`:
    - Guarda `status_semaforo_orig` con el valor original de la BD.
    - Si `status_orig == 1` (`In Allestimento`):
      - Decodifica JSON y genera una cadena HTML con tres iconos `<i class="fa fa-circle ...">` para `etichette`, `packaging` y `prodotto` con color rojo/amarillo/verde.
    - Si no, `status_semaforo` se deja vacío (`''`).
- Devuelve los datos (o los escupe como JSON si `raw` es `false`).

**Laravel (`OrderRepository::getForIndex()`)**:

- Trabaja sobre `Order::active()` (scope del modelo que filtra `removed = false`).
- Eager-load de relaciones esenciales (`article`, `shippingAddress.customerDivision.customer`).
- Aplica filtros de búsqueda, estado, cliente, fechas, cantidades y autocontrol, y control de ordenación.
- El mapeo de código LAS, etiquetas de estado y semáforo se hace en el lado de frontend (React/Inertia) utilizando:
  - El acceso `status_label` del modelo.
  - Constantes en `resources/js/constants/orderStatus.ts` y `orderLabels.ts`.
  - El campo `status_semaforo` ya decodificado como array desde Eloquent.

En ambos casos, la intención es la misma: en el legacy la tabla **no** muestra columnas Semafori ni Progresso (campos con `visible => false`). En Laravel, «Progresso» y «Semaforo» están ocultas por defecto; el usuario puede activarlas desde el menú «Colonne visibili». En el listado se muestra un código de artículo legible, un nombre de estado legible y, si se activa la columna Semaforo, el semáforo solo cuando la orden está en **In Allestimento** (status 1).

---

## 4. Diálogo “Gestisci Stato” / “Manage Status”

**Legacy**

- Método `manageOrderStatusDialog()` en `order\order`:
  - Carga la orden por `uuid`.
  - Pasa al `view`:
    - `id`, `uuid`, `order_production_number`.
    - `status` (numérico) y `order_status` (texto).
    - `status_semaforo` (JSON decodificado con `etichette`, `packaging`, `prodotto`).
    - `quantity`, `worked_quantity`, `motivazione`.
  - El frontend usa este diálogo para “Gestisci Stato” y llama a los webservices de cambio de estado.

**Laravel**

- Método `OrderController::manageStatus(Order $order)`:
  - Carga la orden y sus relaciones básicas.
  - Normaliza `status_semaforo`:
    - Si viene como string, lo decodifica (`json_decode`).
    - Si no es un array válido, lo reemplaza por `['etichette' => 0, 'packaging' => 0, 'prodotto' => 0]`.
  - Envía a Inertia:
    - `order`.
    - `statusSemaforo` (array con `etichette`, `packaging`, `prodotto`).
    - `statusOptions` (`OrderStatus::options()`, lista de estados con `value` y `label`).

Resultado: **el diálogo de gestión de estado existe y transmite la misma información que el legacy, con una interfaz más tipada en Laravel**.

#### Afinado UX/UI de la pantalla Gestisci Stato (Laravel)

- **Estado 0 – Pianificato**: en la card “Cambia Stato Ordine” solo se ofrece “Passa In Allestimento”, con texto de ayuda que explica que este paso prepara el orden para materiales/etiquetas y no está pensado para “ir y venir” frecuentemente.
- **Estado 1 – In Allestimento**: la card lateral se llama “Semaforo materiali e controlli” y muestra selects para `Etichette`, `Packaging` y `Prodotto` (0/1/2) con iconos rojo/amarillo/verde; debajo hay un resumen global (NON pronto / pronto con reservas / tutto pronto). La card “Cambia Stato Ordine” explica que, con el semáforo al menos en amarillo, se puede pasar a Lanciato, y que con todo verde se recomienda hacerlo.
- **Estado 2 – Lanciato**: se deja claro que el paso a Avanzamento es automático a la primera cantidad registrada desde el portal; se ofrece un botón “Forza In Avanzamento” con texto de ayuda sobre cuándo usarlo (arranque inmediato o correcciones manuales).
- **Estado 3 – In Avanzamento**: dos botones principales (“Sospendi” y “Passa In Evaso”) con copia que explica que Sospendi requiere motivación y que Evaso marca la producción como completada; un texto auxiliar resume ambos caminos.
- **Estado 4 – Sospeso**: se muestra la motivación guardada y un único CTA “Riprendi (Ritorna In Avanzamento)” con texto aclaratorio de que se usa cuando se ha resuelto el motivo de la suspensión.
- **Estado 5 – Evaso**: solo permite pasar a Saldato; bajo el selector se explica que desde Evaso el único paso siguiente es completar el orden cerrándolo en Saldato tras la parte administrativa.
- **Estado 6 – Saldato**: la card “Cambia Stato Ordine” se convierte en un bloque final con borde/fondo emerald suave, icono CheckCircle2, título “L'ordine è stato Saldato.” y subtítulo “Non sono possibili ulteriori modifiche di stato. L'ordine è chiuso definitivamente.”
- **Modales de confirmación**: todas las confirmaciones de cambio de estado (volver a detalles, Allestimento, Sospeso, Evaso, Riprendi, Forza In Avanzamento) usan `AlertDialog` con títulos, descripciones y labels coherentes en lugar de **AlertDialog**/**AlertDialog** con textarea, incluyendo un textarea dedicado para la motivación de Sospeso.

---

## 5. Semáforo de estado (`status_semaforo`)

**Legacy**

- Campo `status_semaforo` en `orderorder`, que contiene un JSON con:
  - `etichette` (0/1/2).
  - `packaging` (0/1/2).
  - `prodotto` (0/1/2).
- Método `saveSemaforo()`:
  - Recibe `order_uuid` y los tres campos.
  - Guarda el JSON en la base de datos **sin comprobar el estado**.
- En el listado (`getList()` en `order\order`):
  - Solo cuando `status_orig == 1` (**In Allestimento**) se renderiza el semáforo HTML (tres círculos de colores E/P/P).
- En el diálogo de gestión de estado (`manageOrderStatusDialog()`):
  - Siempre pasa `status_semaforo` decodificado a la vista, pero en la práctica el semáforo se usa visualmente en la fase de **allestimento**.

**Laravel**

- Modelo `Order`:
  - `status_semaforo` está en `$fillable` y se castea a `array`.
- `OrderController::saveSemaforo(SaveSemaforoRequest $request, Order $order)`:
  - Actualiza `status_semaforo` con los tres campos `etichette`, `packaging`, `prodotto` **sin comprobar el estado**, como el legacy.
  - Calcula:
    - `all_green`: true si los tres valen `2`.
    - `can_change_to_lanciato`: true si `all_green` y el estado actual es `IN_ALLESTIMENTO`.
  - Devuelve un JSON con `success`, `message`, `all_green` y `can_change_to_lanciato`.
- Frontend:
  - En el **listado de órdenes** (`Orders/Index.tsx`):
    - Hay una columna “Semaforo” que **solo muestra los tres puntos E/P/P cuando `status === 1` (In Allestimento)**; en otros estados muestra `-`, igual que el legacy.
  - En la pantalla **“Gestisci Stato Ordine”** (`Orders/ManageStatus.tsx`):
    - La tarjeta de semáforo (selects y botón “Salva Semaforo”) **solo se muestra cuando `order.status === 1` (In Allestimento)**, reproduciendo el uso visual del legacy.

Resultado: **el semáforo se almacena y actualiza igual que en el legacy y solo se muestra al usuario durante la fase `In Allestimento`, tanto en el listado como en la pantalla de gestión de estado**.

---

## 6. Transiciones de estado

### 6.1. Legacy (`laser-packaging-be`)

En `application/plugins/order/class/order.php` las transiciones se implementan como webservices separados:

- **`changeStatusToAllestimento`**
  - Input: `order_uuid` (JSON en `php://input`).
  - Acción: `status = 1` (In Allestimento).

- **`changeStatusToLanciato`**
  - Input: `order_uuid`.
  - Acción: `status = 2` (Lanciato).

- **`changeStatusToInAvanzamento` / `forceStatusToInAvanzamento`**
  - `changeStatusToInAvanzamento($order_uuid)`:
    - Acción directa: `status = 3` (In Avanzamento).
  - `forceStatusToInAvanzamento()` (webservice):
    - Input: `order_uuid`.
    - Llama a `changeStatusToInAvanzamento`.
    - Pone `autocontrollo = 0`.

- **`changeStatusToSospeso`**
  - Input: `order_uuid`, `motivazione` (obligatoria).
  - Acción: `status = 4` y guarda `motivazione`.

- **`changeStatusToEvaso`**
  - Input: `order_uuid`.
  - Acción: `status = 5` (Evaso).

- **`changeStatusToSaldato`**
  - Input: `order_uuid`.
  - Acción: `status = 6` (Saldato).

No existe ningún método que reduzca el estado desde `Saldato` (6) a un estado anterior.

**Efecto importante:**  
Una vez que la orden llega a **`Saldato`**, **no hay endpoints para cambiar su estado**. En la práctica, `Saldato` es un estado final.

---

### 6.2. Laravel (`laser-packaging-laravel`)

En Laravel se centraliza el cambio de estado en un único endpoint:

- **Request de validación**: `App\Http\Requests\ChangeOrderStatusRequest`
  - `status`:
    - Requerido.
    - Entero.
    - Debe estar en `OrderStatus::values()` (0–6).
  - Si `status` es `SOSPESO` (4), entonces:
    - `motivazione` es requerida (`string`, máx. 1000 caracteres).

- **Controlador**: `OrderController::changeStatus(ChangeOrderStatusRequest $request, Order $order)`

  - Obtiene:
    - `currentStatus = $order->status`.
    - `newStatus = (int) $request->input('status')`.
  - Valida la transición con:
    - `isValidStatusTransition(int $currentStatus, int $newStatus)`.
  - Si la transición **no es válida**:
    - Devuelve `HTTP 400` con `Transizione di stato non valida.`.
  - Si es válida, construye `$updateData`:
    - Siempre actualiza `'status' => $newStatus`.
    - Si `newStatus` es `SOSPESO`:
      - Añade `'motivazione' => $request->input('motivazione')`.
    - Si `newStatus` es `IN_AVANZAMENTO` **y** la request contiene `force`:
      - Añade `'autocontrollo' => false` (equivalente a `autocontrollo = 0` del legacy).
  - Actualiza la orden y devuelve JSON de éxito con la orden refrescada.

- **Reglas de transición actuales**: `OrderController::isValidStatusTransition()`

  - Siempre permite cambiar a `SOSPESO`:

    ```php
    if ($newStatus === OrderStatus::SOSPESO->value) {
        return true;
    }
    ```

  - Desde `SOSPESO` permite cambiar a cualquier otro estado (menos `SOSPESO` otra vez):

    ```php
    if ($currentStatus === OrderStatus::SOSPESO->value) {
        return $newStatus !== OrderStatus::SOSPESO->value;
    }
    ```

  - Define una cadena de transiciones lineales:

    ```php
    $validTransitions = [
        OrderStatus::PIANIFICATO->value     => [OrderStatus::IN_ALLESTIMENTO->value],
        OrderStatus::IN_ALLESTIMENTO->value => [OrderStatus::LANCIATO->value],
        OrderStatus::LANCIATO->value        => [OrderStatus::IN_AVANZAMENTO->value],
        OrderStatus::IN_AVANZAMENTO->value  => [OrderStatus::EVASO->value],
        OrderStatus::EVASO->value           => [OrderStatus::SALDATO->value],
    ];
    ```

#### 6.3. Estado `Saldato`: paridad con el legacy

En el legacy:

- No existen endpoints que modifiquen el estado de una orden una vez que está en `Saldato` (6).
- En la práctica, **`Saldato` es un estado final inmutable**.

En Laravel:

- `OrderController::isValidStatusTransition()` ya bloquea cualquier transición desde `Saldato`: la primera comprobación es `if ($currentStatus === OrderStatus::SALDATO->value) return false;`.
- Por tanto, una orden saldada **no puede cambiar de estado** (paridad con el legacy). El flujo `Pianificato → … → Saldato` se mantiene y `Sospeso` es flexible solo **antes** de `Saldato`.

---

## 7. Portal de producción y cantidades

**Legacy**

- Webservice `getEmployeeOrderList()`:
  - Devuelve solo órdenes con `status` en `[2,3]` (Lanciato, In Avanzamento).
  - Calcula:
    - `remain_quantity = quantity - worked_quantity`.
  - Adjunta información de cliente, división y artículo.

**Laravel**

- `OrderController::productionAdvancements()` + `OrderRepository::getForProductionAdvancements()`:
  - Filtra `whereIn('status', [OrderStatus::LANCIATO->value, OrderStatus::IN_AVANZAMENTO->value])`.
  - Eager-loading de `article` y `shippingAddress`.
  - Aplica filtros y paginación.
- `OrderController::show(Order $order)`:
  - Calcula `remain_quantity = quantity - (worked_quantity ?? 0)` y lo pasa a la vista Inertia.

Resultado: **el portal de producción en Laravel replica el comportamiento del legacy para órdenes activas (estados 2 y 3) y el cálculo de cantidad restante**.

**Pantallas Laravel:** `/orders/production-advancements` (`Orders/ProductionAdvancements.tsx`): listado con filtros, FlashNotifications, ConfirmDeleteDialog; enlaces a Show/Edit del orden. `/production-order-processing` (`ProductionOrderProcessing/Index.tsx`, `Create.tsx`): listado de trabajaciones con filtros y export CSV, alta con FormValidationNotification y ConfirmCloseDialog; sin Show/Edit (no implementados en backend).

---

## 8. Fases de vida de una orden en el legacy (fase por fase)

Esta sección resume **toda la vida de una orden en el legacy**, estado por estado, indicando:

- Cómo entra en cada estado.
- Qué significa cada fase a nivel funcional.
- Cómo sale de cada estado.

### 8.1. Creación de la orden (antes de estados)

- **Pantalla de alta**: `insertDialog()`
  - Genera un nuevo `uuid` para la orden.
  - Carga el artículo (`articles\articles::getByUUID`) y, desde ahí:
    - Código LAS, etiquetas por defecto, pallet, materiales.
  - Carga la oferta (`offer\offer::getByUUID`) y:
    - Unidad de medida, división de cliente, direcciones de envío.
  - Calcula un número de producción provisional (`generateOrderProductionNumber()`).
  - Construye todas las listas de opciones necesarias (etiquetas, tipo de lote, materiales, etc.) y las empuja a la vista.

- **Webservice de guardado**: `saveOrder()`
  - Lee JSON desde `php://input`.
  - Verifica que los datos no están vacíos.
  - Comprueba la **unicidad** de `order_production_number` (ignorando la orden actual en modo edición).
  - Construye `$orderData` convirtiendo:
    - Números (`line`, `quantity`, `worked_quantity`) solo si son numéricos.
    - Fechas (`delivery_requested_date`, `expected_production_start_date`, `expiration_date`) a timestamp o `null`.
    - Direcciones, lotes y etiquetas a valores numéricos o `null` según contenido.
  - Si es una **nueva** orden (no hay `id`):
    - Fija `status = 0` (`Pianificato`).
    - Fija `status_semaforo = {"etichette":0,"packaging":0,"prodotto":0}`.
    - Llama a `model->save($orderData)`.

Resultado de esta fase: la orden queda almacenada en `orderorder` con **estado 0 – Pianificato** y semáforo en rojo (0,0,0).

### 8.2. Estado 0 – `Pianificato`

- **Significado**:
  - Orden creada y planificada, pero todavía sin preparación de materiales/etiquetas.

- **Comportamiento en UI**:
  - En el listado (`getList()`):
    - `status` se muestra como “Pianificato” usando `$orderStates_values[0]`.
    - `status_semaforo` se deja vacío (no se muestra semáforo).

- **Salida del estado**:
  - Sólo se puede abandonar este estado mediante el webservice:
    - `changeStatusToAllestimento()` → `status = 1` (`In Allestimento`).

### 8.3. Estado 1 – `In Allestimento`

- **Entrada al estado**:
  - Webservice `changeStatusToAllestimento()`:
    - Entrada: JSON con `order_uuid`.
    - Acción: carga la orden por `uuid` y hace `update(id, ['status' => 1])`.

- **Significado**:
  - Fase de **preparación**:
    - Se revisan/ajustan etiquetas (externas, PVP, ingredientes, datos variables, cavallotti).
    - Se verifican materiales y packaging.

- **Semáforo**:
  - `saveSemaforo()`:
    - Entrada: `order_uuid` y valores de `etichette`, `packaging`, `prodotto`.
    - Acción: reconstruye `status_semaforo` como JSON con estos valores.
  - En el listado (`getList()`):
    - Sólo si `status_orig == 1`:
      - Decodifica `status_semaforo`.
      - Genera una cadena HTML con tres iconos de color:
        - `E` (etichette), `P` (packaging), `P` (prodotto), cada uno rojo/amarillo/verde según 0/1/2.

- **Salida del estado**:
  - Cuando la preparación está completa, se lanza producción:
    - `changeStatusToLanciato()` → `status = 2` (`Lanciato`).

### 8.4. Estado 2 – `Lanciato`

- **Entrada al estado**:
  - Webservice `changeStatusToLanciato()`:
    - Entrada: `order_uuid`.
    - Acción: `update(id, ['status' => 2])`.

- **Significado**:
  - Orden **lanzada a producción**:
    - Materiales y etiquetas deberían estar listos.
    - La orden ya es visible para el portal de producción.

- **Portal de producción**:
  - `getEmployeeOrderList()`:
    - Selecciona órdenes con `status in [2, 3]` y `removed = 0`.
    - Por tanto, las órdenes en `Lanciato` empiezan a aparecer a los operarios como “para empezar”.

- **Semáforo en listado**:
  - Aunque `status_semaforo` siga existiendo, ya **no se pinta** en el listado porque solo se muestra en `In Allestimento`.

- **Salida del estado**:
  - Cuando empiezan los avances reales:
    - `changeStatusToInAvanzamento($order_uuid)` → `status = 3` (`In Avanzamento`), o
    - `forceStatusToInAvanzamento()` (ver siguiente sección).

### 8.5. Estado 3 – `In Avanzamento`

- **Entrada al estado**:
  - Método interno `changeStatusToInAvanzamento($order_uuid)`:
    - Carga la orden por `uuid`.
    - `update(id, ['status' => 3])`.
  - Webservice `forceStatusToInAvanzamento()`:
    - Entrada: JSON con `order_uuid`.
    - Pasos:
      1. Llama a `changeStatusToInAvanzamento($uuid)` → pasa a estado 3.
      2. Vuelve a cargar la orden.
      3. `update(id, ['autocontrollo' => 0])`.

- **Significado**:
  - Orden **en curso de producción**:
    - Se van registrando cantidades trabajadas (`worked_quantity`) a través de otros flujos de portal de producción.

- **Portal de producción**:
  - `getEmployeeOrderList()`:
    - Sigue devolviendo órdenes con estado 3 como activas.
    - Calcula para cada orden:
      - `remain_quantity = quantity - worked_quantity`.

- **Salida del estado**:
  - Cuando se termina la producción:
    - `changeStatusToEvaso()` → `status = 5` (`Evaso`).
  - Opcionalmente, en cualquier momento se puede ir al estado de pausa `Sospeso` (4) usando `changeStatusToSospeso()`.

### 8.6. Estado 4 – `Sospeso` (ramal de pausa)

- **Entrada al estado**:
  - Webservice `changeStatusToSospeso()`:
    - Entrada: JSON con `order_uuid` y `motivazione`.
    - Si falta alguno, lanza error `"Dati non validi"`.
    - Acción: `update(id, ['status' => 4, 'motivazione' => $input['motivazione']])`.

- **Significado**:
  - Orden **pausada temporalmente** por algún motivo (incidencia, cliente, falta de material, etc.).
  - Es un estado **transversal**: la orden puede venir de 1, 2 o 3 según el flujo anterior.

- **Portal de producción**:
  - No muestra órdenes en `Sospeso` porque `getEmployeeOrderList()` filtra solo `[2, 3]`.

- **Salida del estado**:
  - El legacy **no define una API específica** para “salir de Sospeso”; simplemente se pueden volver a usar los otros webservices de cambio de estado (por ejemplo, `changeStatusToLanciato` o `changeStatusToInAvanzamento`).
  - Esto hace de `Sospeso` un estado **flexible** que permite pausar y luego retomar en la fase adecuada.

### 8.7. Estado 5 – `Evaso`

- **Entrada al estado**:
  - Webservice `changeStatusToEvaso()`:
    - Entrada: JSON con `order_uuid`.
    - Acción: `update(id, ['status' => 5])`.

- **Significado**:
  - Orden **producida/entregada** desde el punto de vista de producción.
  - A nivel de negocio, se interpreta como “satisfecha” pero todavía puede faltar el cierre contable/financiero.

- **Portal de producción**:
  - Las órdenes en `Evaso` ya **no se muestran** a los operarios (no entran en el filtro `[2,3]`).

- **Salida del estado**:
  - Cierre contable total:
    - `changeStatusToSaldato()` → `status = 6`.

### 8.8. Estado 6 – `Saldato` (estado final)

- **Entrada al estado**:
  - Webservice `changeStatusToSaldato()`:
    - Entrada: JSON con `order_uuid`.
    - Acción: `update(id, ['status' => 6])`.

- **Significado**:
  - Orden **cerrada definitivamente**:
    - Producida, entregada y saldada (facturada/contabilizada).

- **Inmutabilidad**:
  - En todo el archivo `order.php` **no existe ningún otro webservice ni método** que cambie el estado de una orden una vez que está en `Saldato` (6).
  - Tampoco hay lógica automática que lo cambie de vuelta.
  - Por tanto:
    - **`Saldato` actúa como un estado terminal**, desde el cual no hay transiciones estándar hacia otros estados.

### 8.9. Portal de producción – fases “visibles”

Resumen desde el punto de vista del portal de producción (`getEmployeeOrderList()`):

- **Órdenes visibles a operarios**:
  - Solo estados:
    - `2 — Lanciato`.
    - `3 — In Avanzamento`.
- **Información clave expuesta**:
  - Datos de cliente (cadena CustomerShippingAddress → CustomerDivision → Customer).
  - Datos de artículo (código LAS, descripción, etc.).
  - Campo `remain_quantity = quantity - worked_quantity` calculado sobre la marcha.
  - Se eliminan campos internos (`id`, `removed`) antes de devolver.

Cuando una orden pasa a `Evaso` (5) o `Saldato` (6), deja de aparecer en este listado, replicando el comportamiento deseado de “solo ver lo que está en curso o a punto de empezar”.

---

## 9. Resumen

- **Estados y etiquetas**: replicados 1:1 mediante `OrderStatus` y constantes en el modelo `Order`.
- **Estado inicial y semáforo**: se inicializan igual que en el legacy (`Pianificato` + semáforo en 0).
- **Gestión de estado**: el diálogo “Gestisci Stato”/“Manage Status” expone la misma información, con estructura mejorada en Laravel.
- **Semáforo**: mismo significado y almacenamiento; solo se muestra en fase `In Allestimento` tanto en listado como en gestión.
- **Portal de producción**: mismas condiciones de selección (estados 2 y 3) y mismo cálculo de `remain_quantity`; pantallas Production Advancements y Production Order Processing con FlashNotifications, ConfirmDeleteDialog, FormValidationNotification y ConfirmCloseDialog donde aplica.
- **Estado final**: `OrderController::isValidStatusTransition` trata `Saldato` como **estado final inmutable**, igual que el legacy.

---

## 10. Comportamiento visual por fase (legacy vs Laravel)

Esta sección resume, para cada estado, **qué ve y qué puede hacer el usuario** en pantalla, y cómo se ha replicado en Laravel.

### Estado 0 – Pianificato

- **Legacy**
  - Listado:
    - Columna “Stato”: “Pianificato”.
    - Columna semáforo: vacía.
  - Gestisci Stato:
    - Solo información de la orden.
    - Botón para pasar a:
      - `In Allestimento` (1) mediante “Passa In Allestimento”.
- **Laravel**
  - `Orders/Index.tsx`:
    - Estado mostrado como “Pianificato”.
    - Columna “Semaforo”: `-`.
  - `Orders/ManageStatus.tsx`:
    - Tarjeta “Informazioni Ordine”.
    - Tarjeta “Cambia Stato Ordine”:
      - Muestra **un único botón** “Passa In Allestimento” que:
        - Pide confirmación mediante **AlertDialog** (modal con título y descripción).
        - Llama al endpoint de cambio de estado con destino `In Allestimento` (1), igual que el botón del legacy.

### Estado 1 – In Allestimento

- **Legacy**
  - Listado:
    - Estado: “In Allestimento”.
    - Columna semáforo: tres puntos E/P/P coloreados según `status_semaforo`.
  - Gestisci Stato:
    - Información de la orden.
    - Controles para semáforo (3 selectores).
    - Acciones:
      - Pasar a `Lanciato` (2) cuando todo está listo (botón “Passa In Lanciato”).
      - No ofrece botón directo para ir a `Sospeso` desde este diálogo.
- **Laravel**
  - `Orders/Index.tsx`:
    - Estado: “In Allestimento”.
    - Columna “Semaforo”: tres puntos E/P/P con colores según `status_semaforo`, solo si `status === 1`.
  - `Orders/ManageStatus.tsx`:
    - Tarjeta “Semaforo” (solo si `order.status === 1`):
      - Selects para `Etichette`, `Packaging`, `Prodotto`.
      - Botón “Salva Semaforo”.
    - Tarjeta “Cambia Stato Ordine”:
      - Ofrece `Lanciato` (2) como nuevo estado **cuando los tres semáforos son > 0** (al menos amarillos), reproduciendo la lógica de visibilidad del botón “Passa In Lanciato” del legacy.
      - Cuando los tres semáforos están en verde, se ofrece confirmación mediante **AlertDialog** para cambiar a `Lanciato`.

### Estado 2 – Lanciato

- **Legacy**
  - Listado:
    - Estado: “Lanciato”.
    - Semáforo: vacío.
  - Gestisci Stato:
    - Sin semáforo.
    - Mensaje fijo: “L'ordine è stato lanciato. Quando verrà inserita la prima quantità lo stato cambierà automaticamente.”
    - Acción:
      - Botón único “Forza In Avanzamento” → pasa explícitamente a `In Avanzamento` (3).
- **Laravel**
  - `Orders/Index.tsx`:
    - Estado: “Lanciato”.
    - Columna “Semaforo”: `-`.
  - `Orders/ManageStatus.tsx`:
    - No se muestra la tarjeta de semáforo.
    - Tarjeta “Cambia Stato Ordine”:
      - Muestra el mismo mensaje de texto que el legacy.
      - Muestra un único botón “Forza In Avanzamento” que:
        - Pide confirmación mediante **AlertDialog**.
        - Llama al cambio de estado con destino `In Avanzamento` (3).

### Estado 3 – In Avanzamento

- **Legacy**
  - Listado:
    - Estado: “In Avanzamento”.
    - Semáforo: vacío.
  - Gestisci Stato:
    - Muestra `Q.tà ordine` y `Q.tà Lavorata` como campos de solo lectura.
    - Sin semáforo.
    - Acciones:
      - Botón “Sospendi” → pasa a `Sospeso` (4, con motivazione).
      - Botón “Passa In Evaso” → pasa a `Evaso` (5).
- **Laravel**
  - `Orders/Index.tsx`:
    - Muestra barra de progreso y porcentaje, estado “In Avanzamento”.
    - Columna “Semaforo”: `-`.
  - `Orders/ManageStatus.tsx`:
    - Tarjeta “Informazioni Ordine”:
      - Muestra `Quantità` y `Quantità Lavorata` cuando están presentes (campos de solo lectura), igual que los inputs `Q.tà ordine` y `Q.tà Lavorata` del legacy.
    - No hay tarjeta de semáforo.
    - Tarjeta “Cambia Stato Ordine”:
      - Muestra el mensaje “L'ordine è in avanzamento. Puoi sospenderlo o passarlo in Evaso.”.
      - Muestra **dos botones separados**, como en el legacy:
        - “Sospendi”:
          - Abre un **AlertDialog** con textarea solicitando la motivazione.
          - Si el usuario introduce un texto no vacío, llama a `change-status` con `status = 4` y `motivazione`, replicando el `swalPrompt` del legacy + webservice `changeStatusToSospeso`.
        - “Passa In Evaso”:
          - Muestra una confirmación **AlertDialog**.
          - Si se acepta, llama a `change-status` con `status = 5`, equivalente al webservice `changeStatusToEvaso`.

### Estado 4 – Sospeso

- **Legacy**
  - Listado:
    - Estado: “Sospeso”.
    - Semáforo: vacío.
  - Gestisci Stato:
    - Muestra motivazione de la suspensión.
    - Botón “Riprendi (Ritorna In Avanzamento)”:
      - Pasa siempre a `In Avanzamento` (3); desde este diálogo no se ofrecen otros destinos.
- **Laravel**
  - `Orders/Index.tsx`:
    - Estado: “Sospeso”.
    - Semáforo: `-`.
  - `Orders/ManageStatus.tsx`:
    - Tarjeta “Informazioni Ordine”:
      - Muestra la `Motivazione sospensione` cuando existe.
    - Sin semáforo.
    - Tarjeta “Cambia Stato Ordine”:
      - Muestra el mensaje “L'ordine è sospeso. Puoi riprenderlo tornando in Avanzamento.”.
      - Muestra un **único botón** “Riprendi (Ritorna In Avanzamento)” que:
        - Pide confirmación.
        - Llama al cambio de estado con destino `In Avanzamento` (3), igual que el webservice `changeStatusToInAvanzamento` del legacy.

### Estado 5 – Evaso

- **Legacy**
  - Listado:
    - Estado: “Evaso”.
    - Semáforo: vacío.
  - Gestisci Stato:
    - Acciones:
      - Muestra cantidades (`Q.tà ordine` y `Q.tà Lavorata`) en solo lectura.
      - Botón “Passa in Saldato” → pasa a `Saldato` (6). No ofrece botón de `Sospeso` en este diálogo.
- **Laravel**
  - `Orders/Index.tsx`:
    - Estado: “Evaso”.
    - Semáforo: `-`.
  - `Orders/ManageStatus.tsx`:
    - Sin semáforo.
    - Tarjeta “Informazioni Ordine” muestra `Quantità` y `Quantità Lavorata` cuando están presentes.
    - Tarjeta “Cambia Stato Ordine”:
      - Solo ofrece `Saldato` (6) como nuevo estado, replicando el único botón “Passa in Saldato” del legacy.

### Estado 6 – Saldato

- **Legacy**
  - Listado:
    - Estado: “Saldato”.
    - Semáforo: vacío.
  - Gestisci Stato:
    - Solo se muestra el texto: “L'ordine è stato Saldato.” (párrafo centrado). No hay botones ni inputs; el estado es final e inmutable.
- **Laravel**
  - `Orders/Index.tsx`:
    - Estado: “Saldato”.
    - Semáforo: `-`.
  - `Orders/ManageStatus.tsx`:
    - No se muestra la tarjeta de semáforo (solo en estado 1).
    - Tarjeta “Cambia Stato Ordine” (estilo “estado final”: borde/fondo emerald suave):
      - Sin descripción en el header (evita repetición).
      - Contenido: bloque centrado con icono CheckCircle2, título “L'ordine è stato Saldato.” y subtítulo “Non sono possibili ulteriori modifiche di stato. L'ordine è chiuso definitivamente.” Sin selector ni botón; pantalla solo informativa.

