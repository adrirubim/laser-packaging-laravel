# Coherencia de breadcrumbs

Los breadcrumbs deben reflejar **exactamente** la jerarquía del menú lateral (`app-sidebar.tsx`).

## Reglas

1. **Primer nivel**: siempre el grupo del sidebar (Clienti, Fornitori, Offerte, Articoli, Ordini, Personale). Usar claves `nav.*` y `t()`.
2. **Niveles siguientes**: ítem del menú o nombre de la página. Usar `nav.*` cuando coincida con el sidebar; si no existe clave, mantener texto traducido en la página.
3. **Rutas**: el `href` del primer nivel debe apuntar al índice de ese grupo (p. ej. `orders.index().url` para Ordini, `articles.index().url` para Articoli).
4. **Traducciones**: todos los títulos de breadcrumb usan `t('nav.xxx')` o `t('common.xxx')`; no texto hardcodeado.

## Jerarquía de referencia (sidebar)

| Grupo (nav)   | Subsecciones (nav) / ruta típica |
|---------------|-----------------------------------|
| **nav.dashboard** | Pannello (solo ítem) |
| **nav.customers** | anagrafica → customers, divisioni → customer-divisions, indirizzi → customer-shipping-addresses |
| **nav.suppliers** | anagrafica → suppliers |
| **nav.offers**    | lista → offers, attivita, settori, stagionalita, famiglia_las, las_linee_lavoro, ls_risorse, tipi_ordini, categorie_operazioni, operazioni |
| **nav.articles**  | anagrafica → articles, categoria_articoli, macchinari → machinery, criticita, materiali → materials, tipo_pallet → pallet-types, modelli_cq, fogli_pallet, istruzioni_confezionamento, istruzioni_pallettizzazione, istruzioni_operative |
| **nav.orders**    | lista → orders, in_produzione → production-advancements, avanzamenti_produzione → production-order-processing, pianificazione_produzione → planning |
| **nav.personale** | anagrafica → employees, contratti → employees/contracts |

## Ejemplos correctos

- **Planning**: `Ordini` → `Pianificazione Produzione` (nav.orders, nav.pianificazione_produzione).
- **Materiali**: `Articoli` → `Materiali` (nav.articles, nav.materiali).
- **Gestione Lavorazione Ordini**: `Ordini` → `Avanzamenti di Produzione` (nav.orders, nav.avanzamenti_produzione).
- **Divisioni Create**: `Clienti` → `Divisioni` → `Nuovo` (nav.customers, nav.divisioni, common.new).
