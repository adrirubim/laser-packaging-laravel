# Comportamiento de Articoli (Artículos)

Documento de **referencia** del módulo Articoli en `laser-packaging-laravel`: modelo de datos de artículos, relaciones (offer, categoría, instrucciones IC/IP/IO, modelos CQ, fogli pallet, materiales, macchinari, criticità), listado, creación, edición, duplicación, detalle y eliminación. El legacy (`laser-packaging-be`) se cita como origen cuando aporta contexto.

**Estado:** Módulo cerrado. UX/UI nivel 10: pantallas Articles (Index, Create, Edit, Show) y sub-recursos (PackagingInstructions, PalletizationInstructions, OperationalInstructions, CQModels, PalletSheets) usan FlashNotifications, ConfirmDeleteDialog, FormValidationNotification y ConfirmCloseDialog; empty state diferenciado (nessun articolo / nessun risultato per i filtri) y en cada Index de sub-recursos; copy duplicazione esplicito e "Salva come nuovo articolo"; aria-labels en acciones; sin popups nativos.

---

## Auditoría de cobertura legacy vs Laravel

| **Área** | **Legacy** | **Laravel** | **Sección** |
|----------|------------|-------------|-------------|
| Listado articoli | scaffold, botones Modifica/Duplica/Crea ordine/Elimina | Index, filtros, sort, ConfirmDeleteDialog, FlashNotifications | §3 |
| Creazione / Store | insertDialog(offer_uuid), saveArticle (JSON) | create(), store(), CreateArticleAction | §4 |
| Modifica / Update | editDialog(article_uuid), saveArticle | edit(), update(), UpdateArticleAction | §4 |
| Duplicazione | duplicateDialog → saveArticle con source_article_uuid | create?source_article_uuid= + prellenado | §4 |
| Dettaglio | showDetails(id) | show(article) con relaciones | §5 |
| Eliminazione | doDelete (blocco se ordini collegati) | destroy (blocco se orders) | §3, §8 |
| Codice LAS | generateLASNumber(offer_uuid) | ArticleCodeService::generateNextLAS, getLasCode | §1.3, §8 |
| IC/IP/IO (generate + CRUD) | generateICNumber, generateIPNumber, generateIONumber | rutas generate-*-number, resource controllers | §6.1 |
| Layout linea | saveLineLayoutFile, downloadLineLayoutFile | store/update file, downloadLineLayoutFile | §4, §8 |
| Relaciones N:N (criticità, materiali, macchinari, IC/IP/IO) | saveArticle sincroniza pivots | CreateArticleAction, UpdateArticleAction | §2.2, §8 |
| Sub-recursos (CQ, PalletSheets) | modelsCQ, foglioPallet | articles/cq-models, articles/pallet-sheets | §6.2 |

---

## 1. Estructura legacy Articoli

### 1.1. Plugin principal y archivos

- **Articles (anagrafica articoli)**
  - **Clase:** `application/plugins/articles/class/articles.php` (~3100 líneas)
  - **Modelo:** `articles_model.php` (tabla `articles`)
  - **Vistas:** `articles_insertDialog.twig`, `articles_editDialog.twig`, `articles_duplicateDialog.twig`, `articles_showDetails.twig`
  - **JS:** `view/js/articles/articles.js`
  - **Botones listado:** Modifica (openEditDialog), Duplica (openDuplicateDialog), Crea ordine (order.openAddNewOrderDialog); botón Duplica offerta (offer) desde otra vista.
- **Tabla:** `articles`; borrado lógico `removed`; scaffold con "creation" y "edit" ocultos (alta desde oferta o duplicación).

### 1.2. Sub-entidades (legacy)

| Entidad | Clase | Modelo | Tabla | Vistas / uso |
|--------|--------|--------|-------|--------------|
| ArticleCategory | articleCategory | articleCategory_model | articlecategory | Listado "Categoria Articoli" en menú |
| Machinery | machinery | machinery_model | machinery | Listado "Macchinari"; asignación en artículo |
| CriticalIssues | criticalIssues | criticalIssues_model | criticalissues | Listado "Criticità"; N:N con artículo |
| Materials | materials | materials_model | materials | Listado "Materiali"; N:N y check materiali |
| PalletType | palletType | palletType_model | pallettype | Listado "Tipo pallet"; FK en artículo |
| ModelsCQ | modelsCQ | modelsCQ_model | modelscq | Listado "Modelli CQ"; FK model_uuid en artículo |
| FoglioPallet | foglioPallet | foglioPallet_model | (foglio pallet) | Listado "Fogli Pallet"; FK pallet_sheet en artículo |
| ArticlesIC | articlesIC | articlesIC_model, articlesICAssigned | articlesic, articlesicassigned | Istruzioni di confezionamento; N:N con artículo |
| ArticlesIP | articlesIP | articlesIP_model, articlesIPAssigned | articlesip, articlesipassigned | Istruzioni di pallettizzazione; N:N |
| ArticlesIO | articlesIO | articlesIO_model, articlesIOAssigned | articlesio, articlesioassigned | Istruzioni operative; N:N |
| ArticleCritical | (uso en articles) | articleCritical_model | articlecritical | N:N artículo–criticità |
| ArticleMaterial | (uso en articles) | articleMaterial_model | articlematerial | N:N artículo–materiale |
| ArticleMachinery | (uso en articles) | articleMachinery_model | articlemachinery | N:N artículo–macchinario con valor |
| ArticleCheckMaterial | (uso en articles) | articleCheckMaterial_model | articlecheckmaterial | Verifica consumi (material_uuid, um, quantity_expected, quantity_effective) |

### 1.3. Generación de códigos (legacy)

- **Codice LAS:** `generateLASNumber(offer_uuid)`: formato `LAS` + codice famiglia (da lasFamily dell'offerta) + progressivo 4 cifre; `getLastArticle(codice_famiglia)` busca último `cod_article_las LIKE 'LAS{cod_famiglia}%'`.
- **IC:** `generateICNumber()`: último artículo con `packaging_instruct_uuid LIKE "IC%"` (o campo packaging_instruct_laser), progresivo 4 cifras → `IC%04d`.
- **IP:** `generateIPNumber()`: último con palletizing_instruct; formato `IP%04d`.
- **IO:** `generateIONumber()`: último con operating_instruct; formato `IO%04d`.

---

## 2. Modelo de datos artículo (legacy y Laravel)

### 2.1. Tabla `articles` (campos principales)

| Campo | Tipo / uso | Legacy | Laravel |
|-------|-------------|--------|---------|
| id, uuid | PK, UUID | ✓ | ✓ |
| offer_uuid | FK offerta | ✓ | ✓ |
| cod_article_las | Código LAS (único) | ✓ | ✓ |
| visibility_cod, stock_managed | Boolean | ✓ | ✓ |
| cod_article_client, article_descr, additional_descr | Texto | ✓ | ✓ |
| article_category | FK categoria (o string legacy) | ✓ | ✓ |
| um | Unidad medida (da offerta) | ✓ | ✓ |
| lot_attribution | 0 = A carico cliente, 1 = A carico ns. | ✓ | ✓ |
| expiration_attribution | 0, 1 | ✓ | ✓ |
| ean, db | 0,1,2 Entrambi | ✓ | ✓ |
| line_layout | Nombre archivo layout linea | ✓ | ✓ |
| weight_kg, length_cm, depth_cm, height_cm | Decimal | ✓ | ✓ |
| machinery_uuid | (legacy un solo UUID; Laravel N:N article_machinery) | ✓ | N:N |
| packaging_instruct_uuid | (legacy puede ser uno; Laravel N:N) | ✓ | N:N packaging_instructions |
| palletizing_instruct_uuid | Idem | ✓ | N:N palletizing_instructions |
| operating_instruct_uuid | Idem | ✓ | N:N operating_instructions |
| labels_* (external, pvp, ingredient, data_variable, jumpers) | 0 Non presenti, 1 Da stampare, 2 Da ricevere | ✓ | ✓ |
| value_pvp, plan_packaging, pallet_plans, units_per_neck, interlayer_every_floors | Numéricos | ✓ | ✓ |
| allergens, article_critical_uuid, critical_issues_uuid | Criticità / allergeni | ✓ | N:N criticalIssues |
| nominal_weight_control, weight_unit_of_measur, weight_value, object_control_weight | Peso/controllo | ✓ | ✓ |
| materials_uuid, pallet_uuid, pallet_sheet, model_uuid | FKs | ✓ | ✓ |
| customer_samples_list, check_material | Vari | ✓ | ✓ |
| production_approval_*, approv_quality_*, commercial_approval_*, client_approval_* | Approvazioni (checkbox, employee, date, notes) | ✓ | ✓ |
| check_approval, media_reale_cfz_h_pz | | ✓ | ✓ |
| removed | Soft delete | ✓ | ✓ (SoftDeletes) |

- **Legacy saveArticle()** campos obligatorios: `offer_uuid`, `cod_article_las`, `article_descr`, `um`, `lot_attribution`. Resto opcional o con valor por defecto.
- **Laravel** StoreArticleRequest / UpdateArticleRequest: `offer_uuid`, `article_descr`, `lot_attribution` required; `cod_article_las` único (nullable en store si se genera); relaciones como arrays (packaging_instructions, palletizing_instructions, operating_instructions, critical_issues, materials, machinery, check_materials).

### 2.2. Relaciones N:N (legacy vs Laravel)

- **Legacy:** Guarda en tablas pivot (articlesICAssigned, articlesIPAssigned, articlesIOAssigned, articleCritical, articleMaterial, articleMachinery, articleCheckMaterial) en `saveArticle()`: borra por article_uuid y vuelve a insertar los arrays enviados.
- **Laravel:** Eloquent belongsToMany / pivot; CreateArticleAction y UpdateArticleAction sincronizan relaciones.

---

## 3. Listado artículos (Index)

### 3.1. Legacy

- Scaffold tabla "Articoli"; botones "creation" y "edit" ocultos; "remove" y "details" visibles.
- List fields: todos los definidos en `$fields` (muchos con `visible => false` en listado). Columnas visibles por defecto incluyen id, uuid, offer_uuid, cod_article_las, cod_article_client, article_descr, additional_descr, article_category, um, check_approval (visible true), etc.
- Acciones por fila: Modifica, Duplica, Crea ordine (y desde otra vista Duplica offerta).
- Borrado: `doDelete()` comprueba que no existan órdenes con `article_uuid` y removed=0; si hay, devuelve error ARTICLE_DELETE_ORDER; si no, parent::doDelete (update removed=1).

### 3.2. Laravel

- **ArticleController::index:** ArticleRepository::getForIndex (filtros search, offer_uuid, article_category, sort_by, sort_order, paginación). Inertia `Articles/Index` con articles, offers, categories, filters.
- **Articles/Index.tsx:** FlashNotifications, ConfirmDeleteDialog; filtros (search, offer, category), ordenación, tabla con acciones (Visualizza, Modifica, Duplica, Crea ordine, Elimina). Mensaje "Nessun articolo trovato per i filtri attuali" cuando la búsqueda no devuelve resultados.
- **destroy:** Comprueba `article->orders()->where('removed', false)->exists()`; si existe, back con error; si no, soft delete y redirect a index con success.

**Paridad:** Listado, filtros, borrado con comprobación de órdenes equivalentes. En Laravel la creación puede ser desde Index (link "Crea articolo") o desde Oferta "Converti in Articolo"; en legacy el botón creación estaba oculto y la alta era desde oferta o duplicación.

---

## 4. Creación y edición de artículos

### 4.1. Legacy

- **insertDialog():** Recibe `POST['offer_uuid']`; carga oferta, genera UUID nuevo, prepara listas (lot_attribution, expiration, db, categorías, machinery, labels, critical issues, IC, IP, IO, pallet, models CQ, pallet sheets, nominal_weight_control, object_control_weight, customer_samples). No genera cod_article_las en el diálogo; se envía en saveArticle (o se genera en front).
- **editDialog():** Recibe `POST['article_uuid']`; carga artículo, oferta, mismas listas que insertDialog más datos del artículo (incl. instrucciones/macchinari/materiali/criticità asignados).
- **duplicateDialog():** Recibe `POST['article_uuid']`; nuevo UUID; start_date sugerida = end_date del artículo origen (o lógica equivalente); prellena todos los campos del artículo fuente excepto uuid y cod_article_las (nuevo).
- **saveArticle():** JSON body; campos obligatorios; si `id` → update; si no → save. Guarda line_layout (archivo), copia en duplicación; sincroniza articleCritical, articlesIPAssigned, articlesIOAssigned, articlesICAssigned, articleMaterial, articleCheckMaterial, articleMachinery.

### 4.2. Laravel

- **create(Request):** getFormOptions(); si `source_article_uuid` carga artículo para duplicación; si `offer_uuid` genera lasCode vía ArticleCodeService; calcula media dall'offerta; Inertia `Articles/Create` con todas las opciones y sourceArticle/lasCode/um/mediaValues.
- **store(Request):** Validación amplia; CreateArticleAction::execute; redirect a articles.index con success.
- **edit(Article):** getFormOptions(), getForEdit(article); media dall'offerta; Inertia `Articles/Edit`.
- **update(Request, Article):** Validación (cod_article_las único excluyendo actual); UpdateArticleAction::execute; redirect a articles.show con success.
- **Duplicación:** Ruta `articles.create` con `?source_article_uuid={uuid}`; Create prellena desde sourceArticle.

**Paridad:** Flujos create/edit/duplicate equivalentes. Laravel usa FormValidationNotification y ConfirmCloseDialog en Create y Edit; legacy devolvía JSON con mensaje "I seguenti campi sono obbligatori: ...".

---

## 5. Detalle artículo (Show)

### 5.1. Legacy

- **showDetails():** Recibe ID; getDetailData; carga artículo, pallet, category, model, offer, lasworkline, foglio pallet, media calcolate dall'offerta; prepara bloques para vista (solo lectura).

### 5.2. Laravel

- **show(Article):** Carga relaciones (offer, category, palletType, palletSheet, model, materials, machinery, criticalIssues, packagingInstructions, operatingInstructions, palletizingInstructions, checkMaterials.material, orders). Inertia `Articles/Show` con article. Acciones: Modifica, Duplica, Crea ordine, Elimina (ConfirmDeleteDialog), Download layout linea.

**Paridad:** Misma información de detalle y enlaces a Modifica/Duplica/Ordine; Laravel centraliza relaciones en Eloquent.

---

## 6. Sub-recursos: instrucciones y anagrafiche

### 6.1. Istruzioni di confezionamento (IC), pallettizzazione (IP), operative (IO)

- **Legacy:** articlesIC, articlesIP, articlesIO con modelos y tablas propias; asignación N:N vía articlesICAssigned, etc., guardada desde saveArticle.
- **Laravel:** Rutas `articles/packaging-instructions`, `articles/palletization-instructions`, `articles/operational-instructions`; controladores ArticleICController, ArticleIPController, ArticleIOController; recursos full CRUD + generateICNumber/generateIPNumber/generateIONumber + download. Páginas PackagingInstructions/*, PalletizationInstructions/*, OperationalInstructions/* con ConfirmDeleteDialog, FlashNotifications.

### 6.2. Modelli CQ, Fogli Pallet

- **Legacy:** modelsCQ, foglioPallet; listados en menú; FK en artículo (model_uuid, pallet_sheet).
- **Laravel:** Rutas `articles/cq-models`, `articles/pallet-sheets`; ModelSCQController, PalletSheetController; CRUD + generateCQUNumber, downloadFile. Páginas CQModels/*, PalletSheets/* con mismos patrones de diálogos y flash.

### 6.3. Categorías, Macchinari, Criticità, Materiali

- **Laravel:** article-categories, machinery, critical-issues, materials como recursos en rutas; usados en formulario artículo como listas desplegables o multi-select.

---

## 7. Códigos de error (legacy)

- ARTICLE_NOT_FOUND (-40501)
- ARTICLE_DELETE_ORDER (-40502): "Impossibile eliminare l'articolo. Trovati uno o più ordini collegati."
- ARTICLE_IC_NOT_FOUND / ARTICLE_IO_NOT_FOUND / ARTICLE_IP_NOT_FOUND (-40503–40505)
- ARTICLE_IC_NOT_SAVED / ARTICLE_IO_NOT_SAVED / ARTICLE_IP_NOT_SAVED (-40506–40508)

Laravel: mensajes equivalentes en validación y en destroy (ordini associati).

---

## 8. Resumen paridad

| Área | Legacy | Laravel | Notas |
|------|--------|---------|--------|
| Listado articoli | scaffold, botones Modifica/Duplica/Crea ordine/Elimina | Index con filtros, sort, ConfirmDeleteDialog, FlashNotifications | Paridad |
| Creazione | insertDialog(offer_uuid), saveArticle | create(offer_uuid/source_article_uuid), store, CreateArticleAction | Paridad; duplicazione con source_article_uuid |
| Modifica | editDialog(article_uuid), saveArticle | edit(article), update, UpdateArticleAction | Paridad |
| Duplicazione | duplicateDialog → saveArticle con source_article_uuid | create?source_article_uuid= + prellenado | Paridad |
| Dettaglio | showDetails(id) | show(article) con relaciones | Paridad |
| Eliminazione | doDelete (blocco se ordini) | destroy (blocco si orders) | Paridad |
| Codice LAS | generateLASNumber(offer_uuid) | ArticleCodeService::generateNextLAS | Paridad |
| IC/IP/IO | generateICNumber, etc. | rutas generate-ic-number, etc. | Paridad |
| Layout linea | saveLineLayoutFile, copyLineLayoutFile, downloadLineLayoutFile | store/update con file, downloadLineLayoutFile | Paridad |
| Relaciones N:N | saveArticle sincroniza pivots | CreateArticleAction / UpdateArticleAction | Paridad |

---

## 9. Recomendaciones para UX/UI nivel 10 (Articoli)

Para alinear el módulo Articoli al mismo estándar que Personale y Ordini (sin `window.confirm`/`alert`, copy claro, modales coherentes) y lograr una experiencia "10" en UX/UI:

### 9.1. Consistencia de modales y notificaciones

- **Articles/Create y Articles/Edit**
  - **FormValidationNotification** cuando el servidor devuelva errores de validación. ✅ Ya en uso en Create y Edit.
  - **ConfirmCloseDialog** en "Annulla" / "Indietro": confirmar antes de salir si el usuario ha modificado algo. ✅ Ya en uso en Create y Edit.
- **Articles/Index**
  - **FlashNotifications** para success/error tras create, update, destroy. ✅ En uso.
  - **ConfirmDeleteDialog** para eliminación (titolo/descrizione/itemName en italiano). ✅ En uso.
- **Sub-recursos (PackagingInstructions, PalletizationInstructions, OperationalInstructions, CQModels, PalletSheets)**
  - ConfirmDeleteDialog y FlashNotifications ya usados en Index y Show. Verificar que Create/Edit de cada sub-recurso usen **FormValidationNotification** y **ConfirmCloseDialog** si existen formularios largos con riesgo de salida accidental.

### 9.2. Empty state y microcopy

- **Articles/Index:** Actualmente se muestra "Nessun articolo trovato per i filtri attuali" cuando los filtros no devuelven resultados. Añadir un **empty state específico** cuando no hay ningún artículo en el sistema (total count = 0): mensaje tipo "Nessun articolo. Crea il primo." con CTA a "Crea articolo" (o desde Offerta "Converti in Articolo" si la creación siempre parte de oferta). Diferenciar así "nessun risultato per i filtri" de "nessun articolo in anagrafica".
- **Sub-recursos (IC, IP, IO, CQ, PalletSheets):** Empty state en cada Index con mensaje claro + CTA "Crea il primo" (es. "Nessuna istruzione di confezionamento", "Aggiungi").
- **Copy:** Todos los mensajes al usuario en **italiano** (placeholders, label, validación, flash, títulos/descripciones de diálogos). Textos de ayuda donde proceda (es. "Codice LAS generato dalla famiglia dell'offerta", "Layout linea: file opzionale").

### 9.3. Flujo Duplicazione

- En legacy **duplicateDialog** abre un formulario con todos los datos del artículo origen y nuevo UUID; el código LAS se debe generar o introducir nuevo.
- En Laravel la duplicación vía `articles.create?source_article_uuid=...` ya prellena desde sourceArticle; asegurar que el copy en Create indique claramente "Duplicazione di [cod_article_las - descrizione]" cuando exista sourceArticle, y que el botón "Salva" no confunda (es. "Salva come nuovo articolo").

### 9.4. Detalle (Show) y acciones secundarias

- **Articles/Show:** Enlaces rápidos claros: Modifica, Duplica, Crea ordine, Elimina, Download layout linea. Evitar acciones destructivas sin confirmación (Elimina con ConfirmDeleteDialog). ✅ Elimina ya usa ConfirmDeleteDialog.
- **Accesibilidad:** `aria-label` en botones de icono (es. "Modifica articolo", "Duplica articolo", "Elimina articolo"); etiquetas asociadas a todos los inputs en Create/Edit.

### 9.5. Accesibilidad y responsive

- Etiquetas asociadas a todos los inputs y select; mensajes de error asociados a los campos (InputError / aria-describedby).
- Orden de tab lógico en los formularios (Articles Create/Edit son largos; agrupar por secciones y orden coherente).
- Layout responsive: tablas con scroll horizontal o variante en cards en móvil; filtros y botones que no se rompan.

### 9.6. Resumen prioridades Articoli

| Prioridad | Acción | Estado |
|-----------|--------|--------|
| Alta | FormValidationNotification + ConfirmCloseDialog en Articles Create/Edit. | ✅ Implementado |
| Alta | ConfirmDeleteDialog + FlashNotifications en Index y Show. | ✅ Implementado |
| Media | Empty state "nessun articolo in anagrafica" (count=0) vs "nessun risultato per i filtri" en Index. | ✅ Implementado |
| Media | FormValidationNotification + ConfirmCloseDialog en Create/Edit sub-recursos (IC, IP, IO, CQ, PalletSheets). | ✅ Implementado (PackagingInstructions Create); stesso pattern applicabile agli altri. |
| Baja | Copy duplicazione esplicito ("Duplicazione di ..."); aria-labels en botones icono; empty state sub-recursos. | ✅ Implementado |

**Nota:** Le raccomandazioni della sezione 9 sono state implementate (Articles Index empty state con total; Create copy duplicazione e "Salva come nuovo articolo"; Show aria-labels; PackagingInstructions Index empty state + Create con FormValidationNotification e ConfirmCloseDialog; empty state in PalletizationInstructions, OperationalInstructions, CQModels, PalletSheets Index).

---

## 10. Apariencia unificada: Modifica (Edit)

Este apartado describe el estándar de layout y UX para todas las pantallas **Modifica** (Edit) de la sección Articoli y sus subsecciones, de modo que tengan la misma apariencia consecuente. Detalle completo en `docs/ARTICOLI_EDIT_LAYOUT.md`.

### 10.1. Referencia

- **Pantalla de referencia:** `Articles/Edit` (`/articles/{uuid}/edit` — Modifica Articolo).

### 10.2. Estructura de layout

Todas las páginas Edit usan la misma jerarquía de contenedores:

- **Contenedor exterior:** `flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4`
- **Centrado:** `flex w-full justify-center`
- **Ancho máximo:** `w-full max-w-4xl space-y-5` (márgenes laterales iguales que Modifica Articolo)
- **Card:** `<Card>` sin `className` extra; `CardHeader` (CardTitle + CardDescription) y `CardContent` con el `Form` (`className="space-y-6"`).
- **Botones:** contenedor `flex items-center gap-4`; orden: **primario (Salva/Aggiorna) primero**, **Annulla (outline) segundo**; Annulla abre **ConfirmCloseDialog** y al confirmar se navega al Show o Index.
- **CardTitle:** `Modifica [Entità]`; **CardDescription:** frase corta en italiano (ej. "Aggiorna le informazioni della criticità.").
- **UX común:** FormValidationNotification cuando hay errores de validación; ConfirmCloseDialog en todas las Edit; estado de envío "Salvando..." o "Aggiornando...".

### 10.3. Páginas verificadas

| Ruta / módulo | Archivo | Notas |
|---------------|---------|--------|
| Articoli (Anagrafica) | `Articles/Edit.tsx` | Referencia; multi-card; botones fuera de la última card |
| Categoria Articoli | `ArticleCategories/Edit.tsx` | Layout + ConfirmCloseDialog |
| Macchinari | `Machinery/Edit.tsx` | Layout |
| Tipi di Pallet | `PalletTypes/Edit.tsx` | Layout |
| Criticità | `CriticalIssues/Edit.tsx` | Layout + título/descripción + botones + ConfirmCloseDialog |
| Materiali | `Materials/Edit.tsx` | Layout + ConfirmCloseDialog |
| Modelli CQ | `Articles/CQModels/Edit.tsx` | Layout + FormValidationNotification + ConfirmCloseDialog |
| Fogli Pallet | `Articles/PalletSheets/Edit.tsx` | Idem |
| Istruzioni di Confezionamento | `Articles/PackagingInstructions/Edit.tsx` | Idem |
| Istruzioni di Pallettizzazione | `Articles/PalletizationInstructions/Edit.tsx` | Idem |
| Istruzioni Operative | `Articles/OperationalInstructions/Edit.tsx` | Idem |

**Doc completo:** `docs/ARTICOLI_EDIT_LAYOUT.md` (estructura TSX, elementos obligatorios, diferencias aceptadas, checklist para nuevas Edit).

---

## 11. Referencias rápidas

- **Legacy Articles:** `application/plugins/articles/class/articles.php`, `articles_model.php`; vistas insert/edit/duplicate/show; `view/js/articles/articles.js`
- **Legacy sub-entità:** articlesIC, articlesIP, articlesIO, modelsCQ, foglioPallet, articleCategory, machinery, materials, criticalIssues, palletType
- **Laravel:** `App\Models\Article`, `ArticleController`, `CreateArticleAction`, `UpdateArticleAction`, `ArticleCodeService`, `ArticleRepository`; páginas `Articles/*`, `Articles/PackagingInstructions/*`, `Articles/PalletizationInstructions/*`, `Articles/OperationalInstructions/*`, `Articles/CQModels/*`, `Articles/PalletSheets/*`
- **Docs:** `LEGACY_BACKEND_BEHAVIOR.md` (§6.6 Articles), `ORDER_STATUS_BEHAVIOR.md` (uso article en órdenes), `ARTICOLI_EDIT_LAYOUT.md` (estándar layout Modifica/Edit §10)
