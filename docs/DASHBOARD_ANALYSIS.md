## Análisis profundo del Dashboard y propuestas de mejora

**Fecha**: 2026-02-10  
**Ámbito**: `resources/js/pages/Dashboard.tsx` + componentes de gráficos relacionados.

---

### 1. Estado actual del dashboard – fortalezas y decisiones de diseño

El dashboard ya está a un **nivel muy profesional**. Puntos fuertes principales:

#### 1.1. Layout y estructura visual

- Usa el `AppLayout` estándar con breadcrumbs y contenedor con padding:
  - `div.flex.h-full.flex-1.flex-col.gap-4.overflow-x-auto.rounded-xl.p-4`.
- La página se organiza en bloques muy claros:
  1. Cabecera con título, subtítulo, acciones rápidas y filtros.
  2. Alertas (órdenes suspendidas, en retraso, autocontrol pendiente).
  3. KPIs de alto nivel (Órdenes, Ofertas, Artículos, Clientes).
  4. Tarjetas de métricas de rendimiento.
  5. Tarjeta destacada de progreso de producción.
  6. Gráfico de tendencias de órdenes y gráfico de distribución por estado.
  7. Gráfico de progreso de producción por orden (barras).
  8. Listas de órdenes urgentes y recientes.
  9. Gráficos de Top clientes y Top artículos.

Esta estructura es muy escaneable y está totalmente alineada con los patrones modernos de dashboards B2B.

#### 1.2. Filtros y acciones rápidas

- **Acciones rápidas**:
  - `Nuovo Ordine` (primaria) y `Nuova Offerta` (secundaria) alineadas a la derecha → buena priorización.
- **Filtros**:
  - **Filtro de fecha** con presets: `Tutto il tempo`, `Oggi`, `Questa settimana`, `Questo mese`, `Personalizzato`.
  - Diálogo de **rango de fechas personalizado** con:
    - Datepickers directos.
    - Atajos “Ultimi 7 giorni” y “Ultimo mese”.
  - **Filtro de cliente** (`Tutti i clienti` + lista).
  - **Filtro de estado**:
    - Dropdown multi‑selección con badge de recuento de estados activos.
    - Opción “Rimuovi filtri” que limpia solo los estados, manteniendo el resto de filtros.
- **Auto‑refresh**:
  - Toggle `Auto` que recarga los props clave cada 60s con `router.reload`.
  - Botón manual `Aggiorna` con spinner y estado disabled.
- **Exportación**:
  - Menú `Esporta` que construye un CSV muy rico con:
    - Filtros seleccionados.
    - KPIs de órdenes/producción.
    - Alertas, top clientes/artículos.
    - Tendencias y comparativa con periodo anterior.

En conjunto, las capacidades de filtrado y exportación están **muy por encima de la media**.

#### 1.3. Alertas

- Bloque de alertas en la parte superior con colores de severidad (baja/media/alta/crítica).
- Cada alerta:
  - Muestra título, descripción y conteo.
  - Cuando aplica, es una **tarjeta clicable completa**:
    - `overdue` con `first_order_uuid` → navega a `/orders/{uuid}`.
    - `suspended` → `/orders?status=4`.
    - `autocontrollo` → `/orders?autocontrollo=false`.
  - Tiene un `aria-label` claro describiendo la acción.

Esto hace que las alertas sean accionables, no solo informativas.

#### 1.4. Tarjetas KPI

- Cuatro tarjetas principales:
  - **Ordini Totali** (con desglose `lanciato` y `in_avanzamento` + comparación con periodo anterior).
  - **Offerte** (totales + activas).
  - **Articoli**.
  - **Clienti**.
- Cada tarjeta:
  - Es un enlace completo a la vista índice correspondiente.
  - Usa color de borde acentuado + fondo de icono.
  - Muestra skeletons cuando `isLoading` es `true`.
  - Usa tooltips para aclarar las métricas.

Constituyen un resumen “de un vistazo” muy sólido.

#### 1.5. Métricas de rendimiento

- Tres tarjetas de rendimiento:
  1. **Tasso di Completamento** → porcentaje de órdenes completadas; clicable hacia órdenes filtradas por estado completado.
  2. **Tempo Medio di Produzione** → tiempo medio de producción en días.
  3. **Ordini per Giorno** → media de órdenes procesadas por día.
- Cada tarjeta:
  - Tiene icono descriptivo y tooltip.
  - Usa degradados y bordes sutiles para dar jerarquía.
  - Muestra texto de contexto bajo el número principal.

Son métricas fáciles de interpretar y muy visibles.

#### 1.6. Tarjeta destacada de progreso de producción

- Tarjeta grande “Progresso di Produzione”, enlazada a `Orders/ProductionAdvancements`.
- Muestra:
  - Porcentaje de progreso actual con comparación frente a periodo anterior.
  - Cantidades procesadas / totales / restantes.
  - Barra de progreso horizontal con colocación de texto adaptable (texto dentro de la barra solo cuando hay espacio).

Es un “hero metric” bien diseñado para el dashboard.

#### 1.7. Gráficos e interacción

- **OrdersTrendChart**:
  - Muestra la tendencia de órdenes con posible overlay de periodo anterior.
  - `onPointClick` navega al índice de Órdenes filtrado por ese día.
- **OrderStatusChart**:
  - Muestra la distribución de estados.
  - `onStatusClick` mapea las keys del gráfico a filtros del índice de Órdenes (`2`, `3`, `4`, `completed`).
- **ProductionProgressChart**:
  - Muestra el progreso por orden; `onBarClick` lleva al detalle de la orden.
- **TopCustomersChart / TopArticlesChart**:
  - Gráficos de barras con `onBarClick` → vista `Show` de cliente o artículo.

Todos los gráficos son **accionables**, no meras decoraciones.

#### 1.8. Tarjetas de órdenes urgentes y recientes

- **Ordini Urgenti**:
  - Fondo con gradiente y descripción clara.
  - Botón rápido “Vedi tutte” hacia el índice de Órdenes.
  - Lista de órdenes urgentes con:
    - Estado visual (retraso / cerca de vencimiento / normal) mediante colores de borde y hover.
    - Número de producción, badge de estado y posible badge “In Ritardo”.
    - Artículo, descripción y detalle de entrega (`N giorni rimanenti / in ritardo`).
  - Cada fila es un botón que abre el detalle de la orden.
- **Ordini Recenti**:
  - Layout similar con tema azul.
  - Muestra número de producción, estado, artículo, cliente y fecha de creación.

Ambas listas están muy bien resueltas y dan acceso inmediato a la operación diaria.

#### 1.9. Accesibilidad y carga

- Uso de `aria-label` en elementos interactivos clave (filtros, alertas, tarjetas).
- Anillos `focus-visible` en tarjetas y botones.
- Skeletons en secciones pesadas mientras cargan.

En general, el dashboard es **accesible y pulido**.

---

### 2. Puntos de mejora y oportunidades

Aun siendo muy sólido, hay áreas donde se puede empujar a un nivel “supremo”:

1. **Densidad de la barra superior**  
   - La cabecera muestra:
     - Título + subtítulo.
     - `Nuovo Ordine`, `Nuova Offerta`.
     - Filtro de fecha.
     - Filtro de cliente.
     - Filtro de estado.
     - Auto, botón de refresco manual, exportación.  
   - Para un estándar de UI 2026, queda algo **cargado**, sobre todo en pantallas más estrechas.

2. **Falta un “modo foco” en los gráficos**  
   - Los gráficos son accionables, pero no se pueden **ampliar** para análisis visual más profundo.

3. **Las listas tienen menos cross‑filters rápidos que los gráficos**  
   - En los gráficos se puede hacer clic y navegar a vistas filtradas.
   - En las listas de Órdenes urgentes/recientes aún no se exponen filtros rápidos hacia el índice por estado o cliente.

4. **Lógica de auto‑refresh básica**  
   - El auto‑refresh corre cada 60s independientemente de si la pestaña está visible.
   - En dashboards reales es habitual pausar el polling cuando la pestaña está oculta.

5. **No hay “vistas guardadas” (saved views) de filtros**  
   - Los power users suelen reutilizar siempre los mismos conjuntos de filtros (periodo + cliente + estados).  
   - Ahora mismo tienen que reconfigurarlos cada vez.

---

### 3. Propuestas para llevar el dashboard a nivel supremo

Propuestas priorizadas, centradas en máximo valor vs complejidad y siguiendo principios de diseño 2026:

- **Claridad primero**: menos elementos simultáneos en cabecera, más jerarquía visual.
- **Acciones evidentes**: todo lo que se puede clicar tiene un objetivo claro (crear, filtrar, navegar).
- **Profundidad bajo demanda**: detalles avanzados (modo foco, vistas guardadas) solo aparecen cuando el usuario los pide.

#### 3.1. Simplificar y estructurar la barra superior (ALTA prioridad)

**Objetivo**: que la primera impresión sea limpia y legible en todos los dispositivos.

- **Fila principal** (lo más importante, siempre visible):
  - Izquierda: título `Dashboard` + subtítulo.
  - Derecha:
    - `Nuovo Ordine` (primario).
    - `Nuova Offerta` (outline).
- **Fila de filtros** (justo debajo, a ancho completo, usando `flex-wrap` o `grid`):
  - Filtro de fecha.
  - Filtro de cliente.
  - Filtro de estado.
- **Acciones secundarias**:
  - Agrupar `Auto`, `Aggiorna`, `Esporta` en un menú “Altro”:
    - Por ejemplo, botón con icono `Settings` o `SlidersHorizontal` → `DropdownMenu`:
      - `Attiva/Disattiva aggiornamento automatico` (con check).
      - `Aggiorna ora`.
      - `Esporta CSV`.
  - Alternativa:
    - Mantener `Aggiorna` como botón independiente y mover solo `Auto` y `Esporta` al menú.

**Impacto**:

- Cabecera más limpia.
- Mejor comportamiento en viewports estrechos.

#### 3.2. Añadir cross‑filters rápidos desde las listas (ALTA prioridad)

**Objetivo**: replicar el patrón de “clic para filtrar” de los gráficos en las listas.

Ideas de implementación:

- En **Ordini Urgenti** y **Ordini Recenti**:
  - Hacer el **badge de estado** clicable:
    - Clic → índice de Órdenes con filtro `status` correspondiente.
  - Hacer el **nombre del cliente** (si se muestra) clicable:
    - Clic → índice de Órdenes filtrado por ese cliente.
  - Opcional: pequeño tooltip “Filtra ordini per questo stato/cliente”.

Resultado: el usuario puede saltar desde una fila concreta a una **vista agregada de órdenes similares** en un clic.

#### 3.3. Añadir “modo foco” a los gráficos clave (MEDIA prioridad)

**Objetivo**: permitir análisis visual profundo sin salir del dashboard.

Gráficos objetivo:

- `OrdersTrendChart`
- `OrderStatusChart`
- `ProductionProgressChart`
- `TopCustomersChart`
- `TopArticlesChart`

Patrón:

- En el `CardHeader` de cada gráfico, añadir un pequeño botón `icon` con `Maximize2`:

  ```tsx
  <Button
    variant="ghost"
    size="icon"
    className="h-7 w-7"
    aria-label="Apri grafico in vista dettagliata"
    onClick={() => setTrendFocusOpen(true)}
  >
    <Maximize2 className="h-4 w-4" />
  </Button>
  ```

- Al hacer clic se abre un `Dialog` grande (por ejemplo `max-w-5xl`) con **el mismo gráfico** pero:
  - Más alto/ancho.
  - Controles extra opcionales (por ejemplo selector de granularidad día/semana/mes solo en modo foco).
- Dentro del diálogo:
  - Mantener los `onClick` existentes:
    - Punto → índice de Órdenes filtrado por día.
    - Slice de estado → índice filtrado por estado.
    - Barra en TopCustomers/TopArticles → vistas `Show`.

Este patrón encaja con las tendencias 2026, donde muchos dashboards ofrecen “zoom” interactivo en gráficos complejos.

#### 3.4. Auto‑refresh más inteligente (MEDIA prioridad)

**Objetivo**: reducir carga innecesaria sin perder sensación de tiempo real.

Mejora sobre el `useEffect` actual de auto‑refresh:

- Solo arrancar el intervalo cuando:
  - `autoRefreshEnabled === true` **y**
  - `document.hidden === false`.
- Escuchar `visibilitychange`:
  - Cuando la pestaña se oculta → `clearInterval`.
  - Cuando vuelve a ser visible y `autoRefreshEnabled` sigue a `true` → reiniciar el intervalo.

Se mantiene el mismo UX actual, pero es más amable con navegador, servidor y batería.

#### 3.5. Vistas guardadas de filtros y layout (MEDIA–ALTA prioridad, más trabajo, opcional, en roadmap)

**Objetivo**: permitir que usuarios avanzados definan y reutilicen conjuntos de filtros con nombre y, en una fase posterior, personalizar qué secciones del Dashboard se muestran, **sin ensuciar la cabecera**.

Fase 1 – Vistas guardadas de filtros:

- Introducir un modelo `DashboardView`:

  - `id`, `user_id`, `name`, `is_default`.
  - `filters` JSON:
    - `date_filter`
    - `start_date` / `end_date`
    - `customer_uuid`
    - `statuses` (array de strings).

- En frontend:
  - En lugar de muchas pastillas visibles, usar **un único control compacto**, por ejemplo:
    - Un botón/chip tipo: `Vista: Predefinita ▾`.
    - Al abrir el menú: lista de vistas (`Predefinita`, `Settimana corrente – Produzione`, etc.) + opción `Gestisci viste…`.
  - Seleccionar una vista aplica filtros y llama a `router.get(dashboard().url, savedView.filters)`.

Fase 2 – Preferencias de secciones (similar a “Colonne visibili” en `Ordini`):

- Añadir un botón con **rueda dentada** (`⚙` o `SlidersHorizontal`) en la cabecera del Dashboard.
- Al clicar, abrir un `Dialog` “Impostazioni Dashboard” con checkboxes/toggles para mostrar/ocultar secciones:
  - Alertas.
  - KPIs principales.
  - Métricas de performance.
  - Progresso di Produzione.
  - Tendenze Ordini.
  - Distribuzione Ordini per Stato.
  - Ordini Urgenti.
  - Ordini Recenti.
  - Top 5 Clienti.
  - Top 5 Articoli.
- Guardar las preferencias inicialmente en `localStorage` (por usuario/navegador) con opción clara `Ripristina vista predefinita`.
- En una fase posterior, persistirlas en base de datos por usuario si negocio lo requiere.

Importante: estas funcionalidades quedan documentadas como **mejoras futuras**; no se han implementado aún para mantener el Dashboard actual limpio, pero el diseño está preparado para crecer sin perder claridad.

#### 3.6. Micro‑copy y “health badges” en KPIs (BAJA prioridad)

**Objetivo**: transmitir rápidamente si la situación es buena o preocupante.

Ejemplos:

- En `Tasso di Completamento`:
  - Añadir un pill pequeño en cabecera/cuerpo:
    - `On track` (verde) si la tasa está por encima de un umbral objetivo.
    - `A rischio` (naranja/rojo) si está por debajo.
- En `Progresso di Produzione`:
  - Pill similar según progreso vs ventana temporal.

Así, los números pasan a ser **señales visuales inmediatas** también para perfiles no técnicos.

---

### 4. Orden recomendado de implementación

Para maximizar impacto manteniendo el esfuerzo bajo control:

1. **Simplificar la barra superior** (3.1): impacto visual alto, bajo riesgo. **(Implementado)**  
2. **Añadir filtros rápidos desde listas** (3.2): mejora navegación y descubribilidad. **(Implementado)**  
3. **Modo foco en gráficos** (3.3): gran salto de UX sin tocar backend. **(Implementado)**  
4. **Auto‑refresh inteligente** (3.4): pulido técnico/UX muy agradecido. **(Implementado)**  
5. **Vistas guardadas y preferencias de secciones** (3.5): opcional, más esfuerzo, pero muy potente para power users; queda en roadmap futuro.  
6. **Health badges y micro‑copy** (3.6): capa final de pulido. **(Parcialmente implementado en KPIs clave; ampliable a más métricas si negocio lo requiere).**

Con las mejoras ya aplicadas y las adicionales previstas en el roadmap, el dashboard no solo es “listo para producción”, sino que se alinea con las mejores prácticas de UX empresarial de **primer nivel en 2026** para analítica operativa.

