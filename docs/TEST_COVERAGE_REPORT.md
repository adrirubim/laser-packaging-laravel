# Reporte de Tests / Cobertura (resumen)

**Última actualización:** 2026-01-29

> Nota: este documento es intencionalmente **corto**. El objetivo es explicar **qué** se testea y **cómo** ejecutar los tests de forma reproducible.

## Cómo ejecutar los tests

En este proyecto, muchos tests Feature renderizan el layout de Inertia que usa `@vite()`.  
Si ves errores del tipo **“Unable to locate file in Vite manifest …”**, primero genera el build:

```bash
npm run build
php artisan test
```

### Suites disponibles

```bash
php artisan test --testsuite=Unit
php artisan test --testsuite=Feature
php artisan test --testsuite=Performance
```

## Verificación de cobertura por componente

| Componente | Total | Con tests dedicados | Notas |
|------------|-------|---------------------|--------|
| **Controladores HTTP** | 39 | 39 (100%) | Cada controlador tiene un `*ControllerTest.php` en Feature/Controllers, Feature/Api o Feature/Settings. |
| **Servicios** | 6 | 6 (100%) | ArticleCodeService, InstructionCodeService, OfferNumberService, OrderProductionNumberService, PalletCalculationService, ProductionCalculationService — todos con Unit test. |
| **Repositorios** | 7 | 7 (100%) | Unit: ArticleRepository, CustomerRepository, CustomerDivisionRepository, CustomerShippingAddressRepository, DashboardRepository, OfferRepository, OrderRepository. Todos con tests dedicados en `tests/Unit/Repositories/`. |
| **Actions** | 8 + Fortify | — | Excluidos de `<source>` en `phpunit.xml`; se cubren indirectamente por Feature (Create/Update Article, Order, Offer). |
| **API Production Portal** | 1 controller | 1 (100%) | `Feature/Api/ProductionPortalControllerTest.php`. |
| **Auth / Settings** | 8 | 8 (100%) | Authentication, Registration, PasswordReset, EmailVerification, etc.; Settings: ProfileUpdate, PasswordUpdate, TwoFactorAuthentication. |
| **Flows E2E** | 1 | 1 | `Feature/Flows/OfferArticleOrderFlowTest.php` (oferta → artículo → orden → portal). |
| **Performance** | 3 | 3 (100%) | ConcurrencyTest, LoadTest, ApiResponseTimeTest (ver `tests/Performance/README.md`). |
| **Modelos** | muchos | 1 Unit | Solo `Unit/Models/OfferRelationsTest.php`; el resto se usa en Feature tests. |

**Resumen:**  
- **Controladores, servicios y repositorios:** cobertura al **100%** (cada uno tiene tests dedicados).  
- **Actions:** excluidos del reporte de cobertura en `phpunit.xml`; lógica cubierta por Feature.  
- **Modelos:** la mayoría se ejercitan vía Feature; solo Offer tiene Unit de relaciones.  
- El proyecto tiene tests para **todos** los controladores, servicios, repositorios, API, flujos y performance.

## Nota sobre “cobertura” automática

En algunos entornos PHP NTS, la medición automática de cobertura (Xdebug/PCOV) puede no estar disponible.  
En ese caso, la cobertura se valida por:

- existencia de tests para controladores/servicios/repositorios clave
- aserciones de comportamiento (HTTP, validación, relaciones, archivos, filtros, paginación)

Para generar reporte de cobertura (si PCOV/Xdebug está disponible):

```bash
php artisan test --coverage
# o por suite
php artisan test --testsuite=Unit --coverage
```

## Qué se testea (resumen)

- **Unit**: servicios de generación/cálculo (códigos, números secuenciales, cálculos de producción/pallets); repositorios Dashboard y Offer; modelo Offer (relaciones).
- **Feature**: CRUD de controladores, validaciones, filtros, paginación, soft deletes, endpoints AJAX (todos los controladores listados en la tabla anterior).
- **API**: Production Portal (auth/token, acciones de producción, validación de estados).
- **Flows**: flujos end-to-end (oferta → artículo → orden → portal).
- **Performance**: concurrencia, tiempos de respuesta y carga (ver `tests/Performance/README.md`).

## Cobertura actual (100% en componentes críticos)

- **Repositorios:** los 7 tienen Unit tests: `ArticleRepositoryTest`, `CustomerRepositoryTest`, `CustomerDivisionRepositoryTest`, `CustomerShippingAddressRepositoryTest`, `DashboardRepositoryTest`, `OfferRepositoryTest`, `OrderRepositoryTest`.
- Opcional: incluir **app/Actions** en `<source>` de `phpunit.xml` y añadir tests que ejerciten directamente las Actions.
- Opcional: añadir Unit tests para **modelos** con lógica relevante (relaciones, scopes, accessors).

