# Breadcrumb Coherence

Breadcrumbs must **exactly** reflect the sidebar menu hierarchy (`app-sidebar.tsx`).

## Rules

1. **First level**: always the sidebar group (Customers, Suppliers, Offers, Articles, Orders, Personnel). Use `nav.*` keys and `t()`.
2. **Subsequent levels**: menu item or page name. Use `nav.*` when it matches the sidebar; if no key exists, keep translated text in the page.
3. **Routes**: the first-level `href` must point to that group's index (e.g. `orders.index().url` for Orders, `articles.index().url` for Articles).
4. **Translations**: all breadcrumb titles use `t('nav.xxx')` or `t('common.xxx')`; no hardcoded text.

## Reference Hierarchy (sidebar)

| Group (nav)      | Subsections (nav) / typical route                    |
|------------------|------------------------------------------------------|
| **nav.dashboard**| Pannello (single item)                               |
| **nav.customers**| anagrafica → customers, divisioni → customer-divisions, indirizzi → customer-shipping-addresses |
| **nav.suppliers**| anagrafica → suppliers                               |
| **nav.offers**   | lista → offers, attivita, settori, stagionalita, famiglia_las, las_linee_lavoro, ls_risorse, tipi_ordini, categorie_operazioni, operazioni |
| **nav.articles** | anagrafica → articles, categoria_articoli, macchinari → machinery, criticita, materiali → materials, tipo_pallet → pallet-types, modelli_cq, fogli_pallet, istruzioni_confezionamento, istruzioni_pallettizzazione, istruzioni_operative |
| **nav.orders**   | lista → orders, in_produzione → production-advancements, avanzamenti_produzione → production-order-processing, pianificazione_produzione → planning |
| **nav.personale**| anagrafica → employees, contratti → employees/contracts |

## Correct Examples

- **Planning**: `Orders` → `Production Planning` (nav.orders, nav.pianificazione_produzione).
- **Materials**: `Articles` → `Materials` (nav.articles, nav.materiali).
- **Order Processing Management**: `Orders` → `Production Advancements` (nav.orders, nav.avanzamenti_produzione).
- **Create Division**: `Customers` → `Divisions` → `New` (nav.customers, nav.divisioni, common.new).
