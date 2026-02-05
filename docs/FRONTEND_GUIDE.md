### Frontend architecture & conventions (Inertia + React 19)

**Stack (exact versions in use):** Inertia.js 2.3.x, React 19.2.x, TypeScript 5.9.x, Vite 7.3.x, Tailwind CSS 4.1.x. Reference: February 2026. Full details: `docs/VERSION_STACK.md`.

This document is the source of truth for **frontend architecture and consistency** in this project.  
The UI language is **Italian** (labels like `Visualizza`, `Modifica`, etc.), but all explanations here are in **English** to be GitHub‑friendly.

---

## Frontend quickstart (TL;DR for contributors)

- **UI language & labels**
  - UI is in **Italian**; keep labels like `Visualizza`, `Modifica`, `Elimina`, `Cerca`, `Nuovo/Nuova {Entità}`.
  - Actions column header is always `Azioni`, with a `MoreHorizontal` menu.

- **Index pages**
  - Wrap with `AppLayout` + breadcrumbs; use `<Head title="Nome Sezione" />` and matching `<h1>`.  
  - Use `IndexHeader` for the top area (title + subtitle on the left, actions on the right).  
  - The **create** button (`Nuovo/Nuova {Entità}`) is always the **first** button on the right; secondary actions come after.  
  - Use `SearchInput` for simple search (`search` query param, `debounceMs = 500`) and `Pagination` for paginated lists.  
  - Use the standard `Azioni` column with `ActionsDropdown` (or matching pattern) instead of per‑page action menus.

- **Show pages**
  - `AppLayout` with breadcrumbs: list → entity.  
  - Header: left = title + `Codice: {codice}`; right = `Modifica` and `Elimina` buttons.  
  - Use `Card` for grouped details and separate `Card`s for related lists with clear empty states.

- **Forms (Create/Edit)**
  - `AppLayout` + breadcrumbs: list → entity → `Modifica` / `Nuovo/Nuova`.  
  - Use a single `Card` as container with `CardTitle` and `CardDescription`.  
  - Use `FormLabel`, `Input`/`Select`/`Textarea`, `InputError` for each field; keep placeholders short and specific.  
  - Action row: primary submit (`Crea {Entità}` / `Aggiorna {Entità}` with loading state) + outline cancel back to `Show`/`Index`.

- **Flash messages & notifications**
  - Do **not** implement ad‑hoc flash banners.  
  - Use `useFlashNotifications()` and `<FlashNotifications flash={flash} />` near the top of the page.
  - For long forms, add `FormValidationNotification` at the top with `hasAttemptedSubmit`.

- **Dialogs & destructive actions**
  - Use `ConfirmDeleteDialog` for all deletions (no `window.confirm`).  
  - Use `ConfirmCloseDialog` on long/critical forms (Offers, Articles, Customers, Orders, CustomerShippingAddresses) when the user tries to close with unsaved changes.

- **Loading states**
  - Use **Skeletons** for heavy `Index` pages (Dashboard, Orders, Materials, Machinery, ProductionOrderProcessing).  
  - Use small `Spinner` only for inline, short‑lived loading.

- **Routing & types**
  - Use Wayfinder‑generated actions/routes from `@/actions` / `@/routes` instead of hard‑coded URLs.  
  - Keep everything typed with TypeScript 5.9 and reuse shared types from `resources/js/lib` where possible.

For full details, examples and the list of modules already aligned, see the sections below.

---

## 1. Standard terminology and actions

The whole backoffice uses **Italian** in the interface. We standardize labels and positions so that screens behave the same.

- **Main actions (`Azioni` column)**  
  - **Visualizza**  
    - Icon: `Eye` (lucide-react).  
    - Purpose: open a detail screen (`Show` page).  
    - Placement: inside the actions menu in `Index` tables; may also appear as a secondary button in other views.
  - **Modifica**  
    - Icon: `Edit`.  
    - Purpose: go to the edit form (`Edit` page).  
    - Placement: in the actions menu in `Index`; main (or secondary) button in `Show`.
  - **Elimina**  
    - Icon: `Trash2`.  
    - Purpose: delete a record.  
    - Confirmation: **always** use `ConfirmDeleteDialog` (never `window.confirm`).  
    - Recommended copy:  
      - Title: `Elimina {Entità}`  
      - Description: `Sei sicuro di voler eliminare questa {entità}? Questa azione non può essere annullata.`
  - **Scarica allegato** (when applicable)  
    - Icon: `Download`.  
    - Disabled when there is no file.
  - **Nuovo/Nuova {Entità}** (create)  
    - Icon: `Plus`.  
    - Placement: primary button top‑right on `Index` pages.  
    - Examples: `Nuovo Macchinario`, `Nuova Operazione`.

- **Actions column**  
  - Table header: always `Azioni`.  
  - Content: “more” button with `MoreHorizontal` opening a `DropdownMenu` with `DropdownMenuItem` in this order:
    1. `Visualizza`
    2. `Modifica`
    3. Domain‑specific actions (e.g. `Scarica allegato`)
    4. `Elimina` (last item, destructive style when possible).

---

## 2. Index pages

Examples: `Machinery/Index.tsx`, `Materials/Index.tsx`, `OfferOperations/Index.tsx`.

### 2.1. Layout

- Always use `AppLayout` with `breadcrumbs`.  
- Titles:
  - `<Head title="Nome Sezione" />` (e.g. `Macchinari`, `Operazioni`).  
  - `<h1>`: same text as `<Head>`.  
- Subtitle: short, consistent description, for example:
  - `Elenco dei macchinari attivi con Cerca.`  
  - `Elenco delle operazioni attive con Cerca e filtri.`

### 2.2. Top actions bar

- Left side: block with main title and subtitle.  
- Right side: **create button always first** if there are several buttons:
  - `Link` to the corresponding `create()` route.  
  - Tailwind classes (already used in the project):  
    - `inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90`.  
  - Icon `Plus` on the left of the label.
- If there are more buttons (e.g. “Esporta CSV”, view switch, settings):
  - The create button (`Nuovo Ordine`, `Aggiungi nuovo`, etc.) stays **first** on the right.
  - Secondary buttons come after, using `border border-input bg-background ... hover:bg-muted`.  
  - Use `flex-wrap` on the header container so buttons do not overflow on narrow screens.

### 2.3. Flash messages

Use the same pattern in all sections: centralized **`FlashNotifications`** component with the `useFlashNotifications()` hook.

- **Standard usage**  
  - For pages receiving flash from backend (e.g. `usePage().props.flash`):  
    - Import `FlashNotifications` and `useFlashNotifications` from `@/components/flash-notifications`.  
    - Get flash with `const { flash } = useFlashNotifications();`.  
    - Render `<FlashNotifications flash={flash} />` at the top of the content (e.g. just under the header).
  - **Do not** use local `showFlash` state or `useEffect` timers: the component handles manual close (X) and auto‑dismiss after 5s.

- **Unified styles (internal to the component)**  
  - **Success**: emerald border/background (`border-emerald-500/40`, `bg-emerald-500/5`, `text-emerald-700` / `dark:text-emerald-300`).  
  - **Error**: rose border/background (`border-rose-500/40`, `bg-rose-500/5`, `text-rose-700` / `dark:text-rose-300`).

Implementation details and list of migrated pages are summarized in section **8**.

### 2.4. Filters and search

- **Simple search**  
  - Use the generic `SearchInput` component whenever possible.  
  - Label: `Cerca`.  
  - Context‑specific placeholder, e.g.:
    - `Codice, descrizione...`  
    - `Codice, descrizione o parametro...`  
  - Parameters:
    - `debounceMs = 500`.  
    - `onChange` calling `router.get` while preserving state and scroll.  
  - URL query parameter name: always `search`.

- **Clearing search**  
  - Clear button that:
    - Empties the search input.  
    - Calls `router.get` without the `search` parameter but preserves other filters (e.g. `category_uuid`).

- **Additional filters (selects, etc.)**  
  - Organize in a `grid` of one or two columns (`md:grid-cols-2`).  
  - Label: `text-xs font-medium text-muted-foreground`.  
  - `Select` with a consistent “all” option:
    - e.g. `Tutte le categorie` with value `all`, mapped in logic to `''` or `undefined`.

### 2.5. Results table

- Container:  
  - `relative min-h-[300px] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 bg-card dark:border-sidebar-border`.  
- Table:
  - `min-w-full border-separate border-spacing-0 text-left text-sm`.  
  - Sticky `thead`:  
    - `sticky top-0 z-10 bg-muted/80 backdrop-blur`.  
  - Headers:
    - Row with `text-xs tracking-wide text-muted-foreground uppercase`.

- Empty state row:
  - Single row with `colSpan` covering all columns.  
  - Text like:
    - `Nessun macchinario trovato per i filtri attuali.`  
    - `Nessuna operazione trovata per i filtri attuali.`

- Special columns:
  - IDs/UUIDs: `font-mono text-xs` for readability and copy‑paste.  
  - Optional values: show `—` with `text-muted-foreground` when empty.

- `Azioni` column:
  - Header: `Azioni`, right‑aligned (`text-right`).  
  - Cells:
    - `DropdownMenu` with `DropdownMenuTrigger` using `Button variant="ghost" size="icon"` and `MoreHorizontal`.  
    - `DropdownMenuItem`s ordered as in section 1.

### 2.6. Pagination

- Prefer the reusable `Pagination` component in all paginated lists.  
- Typical props:
  - `links={paginated.links}`  
  - `currentPage={paginated.current_page}`  
  - `lastPage={paginated.last_page}`  
  - Optional `totalItems`.  
- Text:
  - `Pagina {currentPage} di {lastPage} ({N risultati})` when `totalItems` is provided.  
- Navigation:
  - `Precedente` and `Successivo` buttons with `ChevronLeft` / `ChevronRight`, following `Pagination.tsx` styles.

---

## 3. Detail pages (`Show`)

Example: `Machinery/Show.tsx`.

### 3.1. Layout and breadcrumbs

- Use `AppLayout` with `breadcrumbs`:
  - Level 1: listing (`Macchinari`, `Operazioni`, etc.).  
  - Level 2: entity identifier (e.g. code or short description).  
- `<Head title="Entità {codice}" />`.

### 3.2. Page header

- Left:
  - `<h1>`: main name/description.  
  - Subtitle with code/ID: `Codice: {codice}`.

- Right:
  - **Modifica** button:
    - `Button asChild variant="outline"` with `Link` to the `edit` route.  
  - **Elimina** button:
    - `Button variant="destructive"`.  
    - Opens `ConfirmDeleteDialog` instead of `window.confirm`.

### 3.3. Detail sections

- Use `Card` to group main fields:
  - `CardTitle`: `Dettagli {Entità}`.  
  - `CardDescription`: short context such as `Informazioni di base sul macchinario`.  
  - Each field:
    - Label using `Label` with `text-sm font-medium text-muted-foreground`.  
    - Value in `<p>` with a clear hierarchy of sizes (`text-lg font-semibold` for main values).  
    - Optional fields: show `-` with `text-muted-foreground` when there is no value.

### 3.4. Related lists

- When there are collections (e.g. `Articoli Associati`):
  - Separate `Card` for the list.  
  - Clear title and description:
    - `CardTitle`: `Articoli Associati`.  
    - `CardDescription`: `Articoli che utilizzano questo macchinario`.  
  - Each item:
    - Box with `rounded-lg border p-3`.  
    - Code in `font-mono font-medium`.  
    - Description in `text-sm text-muted-foreground` if present.

- Empty state:
  - `Card` with centered `CardContent` and grey text:
    - `Nessun articolo associato a questo macchinario.`

---

## 4. Forms (`Create` / `Edit`)

Example: `Machinery/Edit.tsx`, `Customers/Edit.tsx`, `Orders/Create.tsx`.

### 4.1. Layout

- `AppLayout` with `breadcrumbs`:
  - Listing.  
  - Entity (for `Edit`/`Show`).  
  - Final action: `Modifica` or `Nuovo/Nuova`.  
- `<Head>`:
  - `Modifica`: `Modifica {Entità} {codice}`.  
  - `Create`: `Nuovo/Nuova {Entità}`.

### 4.2. Form card

- A single `Card` wrapping the form:
  - `CardTitle`:
    - `Modifica {Entità}` / `Nuova {Entità}`.  
  - `CardDescription`:
    - `Aggiorna le informazioni del {entità}`  
    - or `Compila i campi per creare {entità}`.

### 4.3. Fields

- For each field:
  - `FormLabel` (with `required` prop when needed).  
  - `Input`, `Select`, `Textarea` or other `ui` component.  
  - `InputError` under the field for validation messages.  
- Placeholders:
  - Short and specific: `Parametro`, `Descrizione...`, etc.

### 4.4. Action buttons

- Uniform action block:
  - Submit button:
    - Text:
      - `Crea {Entità}` or `Aggiorna {Entità}`.  
    - While `form.processing`:
      - Use a loading label/variant, e.g. `Aggiornamento...`.  
  - Cancel button (`variant="outline"`):
    - Goes back to `Show` or `Index` depending on context:
      - Usually `Edit → Show`, `Create → Index`.

---

## 5. Key reusable components

Use these components instead of duplicating markup/logic.

- **`SearchInput`**
  - Use on all pages with simple search.  
  - Configure only `placeholder`, optional `debounceMs` and `onChange`.  
  - Use `onClear` to reset the search while keeping other filters.

- **`Pagination`**
  - Use for all paginated lists instead of ad‑hoc pagination code.  
  - Keep copy and layout consistent as described in section 2.6.

- **`IndexHeader`**
  - Standard top header for `Index` pages.  
  - Props to control title, subtitle, and right‑side actions.  
  - Always place the **create** button first.

- **`ActionsDropdown`**
  - Reusable actions menu used e.g. in `Orders/Index`.  
  - Standard slots: `viewHref`, `editHref`, `onDelete`.  
  - Domain‑specific actions go into `extraItems`.

- **`ConfirmDeleteDialog`**
  - Standard confirmation dialog for deletion.  
  - Use across all modules; never inline `window.confirm`.

- **`FormValidationNotification`**
  - Summary of validation errors at the top of long forms.  
  - Takes `errors` and `hasAttemptedSubmit` (derived from presence of errors and submit attempts).  
  - Always placed above the form card.

- **`ConfirmCloseDialog`**
  - Used on long/complex forms (Offers, Articles, Customers, Orders, CustomerShippingAddresses) to prevent accidental navigation with unsaved changes.  
  - Cancel/close buttons trigger this dialog instead of immediate navigation.

- **Skeletons & Spinner**
  - Use skeletons for heavy `Index` pages (Dashboard, Orders, Materials, Machinery, ProductionOrderProcessing).  
  - Use `Spinner` for small inline loading states.

---

## 6. Advanced patterns already implemented

The following patterns are already in use and should be reused:

- **Mobile cards + desktop table**  
  - Implemented in `Materials/Index` and `Machinery/Index`.  
  - Desktop: standard table, hidden on small screens.  
  - Mobile: card view, shown on small screens (`md:hidden` / `hidden md:table` pattern).

- **Global Error Boundary (React 19)**  
  - Component: `resources/js/components/error-boundary.tsx`.  
  - App entry (`app.tsx`) wraps the Inertia app with `<ErrorBoundary>`.  
  - Fallback UI is in Italian with a reload button.

- **Flash notifications**  
  - Centralized via `FlashNotifications` + `useFlashNotifications`.  
  - No per‑page flash timers or local state.

- **Consistent wording**
  - Titles and subtitles aligned across Articles and sub‑modules.  
  - Micro‑copy tweaks in Italian can be done incrementally but must keep the same structure.

---

## 7. Good practices for 2026 (recommendations)

These practices are already applied in core modules and must be reused in new screens:

- **Loading states**
  - Always show skeletons for heavy dashboards / lists.  
  - Use button‑level spinners and disabled states during form submission.

- **Accessibility**
  - Use semantic HTML (headings in order, correct list/section tags).  
  - Ensure buttons and links have clear labels, not only icons.  
  - Keep sufficient color contrast (at least WCAG AA).

- **Complex forms**
  - For long/critical forms, always:
    - Use `FormValidationNotification` at the top.  
    - Use `ConfirmCloseDialog` when navigating away with dirty state.  
    - Group fields with clear section titles and descriptions.

---

## 8. Summary of improvements already applied

This section summarizes the consistency improvements that are **already implemented** and acts as a quick checklist for new modules.

### 8.1. Frontend

| Improvement | Status |
|------------|--------|
| **Error Boundary (React 19)** | ✅ Implemented in `error-boundary.tsx` (class component, stable API in React 19); app wrapped in `app.tsx`. Fallback UI in Italian with “Ricarica la pagina” button. |
| **Default language in `AlertError`** | ✅ Default error title changed to `Qualcosa è andato storto.` |
| **Section for ValueTypes** | ✅ Updated and aligned with code: ValueTypes described as consistent (IndexHeader, SearchInput, actions menu, ConfirmDeleteDialog, Pagination). |
| **ConfirmCloseDialog in long forms** | ✅ Added to Offers, Articles, Customers, CustomerShippingAddresses and Orders forms. |
| **FormValidationNotification in long forms** | ✅ Added to Offers, Articles, Customers, CustomerShippingAddresses and Orders, with `hasAttemptedSubmit` handling. |
| **ActionsDropdown in Orders/Index** | ✅ `Orders/Index` uses `ActionsDropdown` as the standard actions container; domain actions (Visualizza, Modifica, Gestisci Stato, Stampa Barcode/Autocontrollo, Elimina) are passed via `viewHref`, `editHref`, `onDelete` and `extraItems`. |
| **Mobile view for simple Index pages** | ✅ Mobile cards added in `Materials/Index` and `Machinery/Index`, following the `Suppliers/Index` pattern (desktop table + mobile cards). |
| **Skeletons in key Index pages** | ✅ Loading skeletons in `Dashboard`, `Orders/Index`, `ProductionOrderProcessing/Index`, `Materials/Index` and `Machinery/Index`. |
| **Wording for Articles and sub‑modules** | ✅ Main wording (titles, subtitles, short descriptions) reviewed across Articles and sub‑modules; text is coherent with the rest of the backoffice. Future tweaks are micro‑copy only. |

### 8.2. Tests (see also `docs/TEST_COVERAGE_REPORT.md`)

| Improvement | Status |
|------------|--------|
| **Action tests** | ✅ `app/Actions` is included under `<source>` in `phpunit.xml` and main Actions (`CreateOfferAction`, `UpdateOfferAction`, `CreateOrderAction`, `UpdateOrderAction`, `SyncOrderEmployeesAction`) have direct Unit tests. |
| **Model unit tests** | ✅ In addition to `OfferRelationsTest`, Unit tests exist for key models: `OrderModelTest` (relations, scopes, cache) and `MachineryModelTest` (scopes and `valuetype` accessor). |

> For **new screens or modules**, reuse these patterns: `ConfirmCloseDialog` + `FormValidationNotification` on long forms, `ActionsDropdown` in action columns, skeletons in heavy Index pages, and wording aligned with this guide.

