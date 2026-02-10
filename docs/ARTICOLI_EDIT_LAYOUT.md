# Apariencia unificada: Modifica (Edit) en Articoli

Este documento describe el estándar de layout y UX para todas las pantallas **Modifica** (Edit) de la sección Articoli y sus subsecciones, de modo que tengan la misma apariencia consecuente.

## Referencia

- **Pantalla de referencia:** `Articles/Edit` (`/articles/{uuid}/edit` — Modifica Articolo).

## Estructura de layout

Todas las páginas Edit deben usar la misma jerarquía de contenedores:

```tsx
<AppLayout breadcrumbs={breadcrumbs}>
    <Head title="..." />

    <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
        <div className="flex w-full justify-center">
            <div className="w-full max-w-4xl space-y-5">
                <Card>
                    <CardHeader>
                        <CardTitle>Modifica [Entità]</CardTitle>
                        <CardDescription>...</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form ... className="space-y-6">
                            ...
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
    <ConfirmCloseDialog ... />
</AppLayout>
```

### Elementos obligatorios

| Elemento | Clases / Comportamiento |
|----------|-------------------------|
| Contenedor exterior | `flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4` |
| Centrado | `flex w-full justify-center` |
| Ancho máximo | `w-full max-w-4xl space-y-5` (márgenes laterales iguales que Modifica Articolo) |
| Card | Componente `<Card>` sin `className` extra (ya usa `rounded-xl border py-6 shadow-sm`) |
| Form | `className="space-y-6"` |
| Botones de acción | Contenedor `flex items-center gap-4`; orden: **primario (Salva/Aggiorna) primero**, **Annulla (outline) segundo** |
| Annulla | Debe abrir `ConfirmCloseDialog`; al confirmar, navegar al Show o Index correspondiente |
| Estado de envío | Texto de carga: "Salvando..." o "Aggiornando..." según contexto |

### Título y descripción de la card

- **CardTitle:** `Modifica [Entità]` (ej.: "Modifica Articolo", "Modifica Criticità", "Modifica Istruzione di Confezionamento").
- **CardDescription:** Frase corta en italiano, ej. "Modifica i dettagli dell'articolo", "Aggiorna le informazioni della criticità."

### UX común

- **FormValidationNotification** en formularios que reciben errores de validación del servidor (todas las Edit de Articoli que usan `Form` con errores).
- **ConfirmCloseDialog** en todas las Edit; el botón "Annulla" abre el diálogo y, al confirmar, se hace `router.visit(showUrl)` (o index si no hay show).

## Páginas verificadas / actualizadas

Todas las siguientes Edit siguen el estándar anterior (layout, botones, ConfirmCloseDialog donde aplica):

| Ruta / módulo | Archivo | Notas |
|---------------|---------|--------|
| Articoli (Anagrafica) | `Articles/Edit.tsx` | Referencia; formulario multi-card; botones fuera de la última card |
| Categoria Articoli | `ArticleCategories/Edit.tsx` | Layout + ConfirmCloseDialog (ya aplicado previamente) |
| Macchinari | `Machinery/Edit.tsx` | Layout (ya aplicado previamente) |
| Tipi di Pallet | `PalletTypes/Edit.tsx` | Layout (ya aplicado previamente) |
| Criticità | `CriticalIssues/Edit.tsx` | Layout + título/descripción + botones + ConfirmCloseDialog |
| Materiali | `Materials/Edit.tsx` | Layout + descripción + "Aggiornando..." + ConfirmCloseDialog |
| Modelli CQ | `Articles/CQModels/Edit.tsx` | Layout + FormValidationNotification + ConfirmCloseDialog |
| Fogli Pallet | `Articles/PalletSheets/Edit.tsx` | Layout + FormValidationNotification + ConfirmCloseDialog |
| Istruzioni di Confezionamento | `Articles/PackagingInstructions/Edit.tsx` | Layout + FormValidationNotification + ConfirmCloseDialog |
| Istruzioni di Pallettizzazione | `Articles/PalletizationInstructions/Edit.tsx` | Layout + FormValidationNotification + ConfirmCloseDialog |
| Istruzioni Operative | `Articles/OperationalInstructions/Edit.tsx` | Layout + FormValidationNotification + ConfirmCloseDialog |

## Diferencias aceptadas

- **Articles/Edit:** formulario con varias cards (Etichette, Peso e Controllo, Altri Campi, ecc.); los botones "Salva Modifiche" y "Annulla" están en un `div` hermano de las cards, dentro del mismo `Form`. El resto de Edit tienen una sola card y los botones dentro de `CardContent`.
- **Label vs FormLabel:** algunas Edit (p. ej. CriticalIssues, Materials) siguen usando `Label`; otras usan `FormLabel`. Visualmente compatibles; la migración a `FormLabel` puede hacerse de forma gradual.

## Cómo comprobar nuevas Edit

Para cualquier nueva pantalla Modifica bajo Articoli:

1. Usar la misma estructura de tres niveles: contenedor `p-4` → `justify-center` → `max-w-4xl space-y-5`.
2. Una sola `<Card>` con `CardHeader` (CardTitle + CardDescription) y `CardContent` con el `Form`.
3. Form con `className="space-y-6"`.
4. Botones en `div` con `flex items-center gap-4`: primero submit primario, luego "Annulla" con `variant="outline"` que abre `ConfirmCloseDialog`.
5. Incluir `FormValidationNotification` si el backend devuelve errores de validación.
6. Incluir `ConfirmCloseDialog` y, al confirmar, navegar a la URL de detalle (o índice) correspondiente.
