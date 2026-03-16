---
stepsCompleted: ['step-01-detect-mode', 'step-02-load-context', 'step-03-risk-and-testability', 'step-04-coverage-plan', 'step-05-generate-output']
lastStep: 'step-05-generate-output'
lastSaved: '2026-03-16'
workflowType: 'testarch-test-design'
inputDocuments:
  - '_bmad-output/planning-artifacts/prd.md'
  - '_bmad-output/planning-artifacts/architecture.md'
  - '_bmad-output/planning-artifacts/ux-design-specification.md'
---

# Test Design for QA: Portfolio ChrisBP

**Purpose:** Receta de ejecución de tests. Define qué testear, cómo testearlo, y qué necesita QA de otros equipos.

**Date:** 2026-03-16
**Author:** TEA Master Test Architect
**Status:** Draft
**Project:** portfolio

**Related:** Ver documento de Arquitectura (`test-design-architecture.md`) para concerns de testabilidad y blockers arquitectónicos.

---

## Executive Summary

**Scope:** Testing completo de la migración del portfolio: sitio público SSG, panel admin SPA, blog con editor rico, gestión de imágenes, i18n, SEO, y seguridad.

**Risk Summary:**

- Total Risks: 11 (3 high-priority score >=6, 5 medium, 3 low)
- Categorías críticas: TECH (5 riesgos), SEC (2 riesgos)

**Coverage Summary:**

- P0 tests: ~18 (core journeys, validación, seguridad)
- P1 tests: ~26 (CRUD completo, SEO, accesibilidad)
- P2 tests: ~13 (flujos secundarios, edge cases)
- P3 tests: 0
- **Total**: ~57 tests (~29-44 horas con 1 desarrollador)

---

## Not in Scope

| Item | Razón | Mitigación |
|---|---|---|
| **Load/stress testing** | Portfolio personal, <100 usuarios concurrentes | Firebase Hosting CDN maneja la carga; Lighthouse CI valida performance |
| **Disaster recovery testing** | Firebase Spark plan, datos replicables | Backup manual vía `firebase firestore:export` |
| **Contract testing (Pact)** | No hay microservicios — Firebase BaaS directo | N/A |
| **Visual regression testing** | Scope de MVP; diseño replicado del Flutter existente | Revisión manual + Lighthouse Accessibility |

---

## Dependencies & Test Blockers

### Backend/Architecture Dependencies (Pre-Implementación)

**Source:** Ver documento de Arquitectura "Quick Guide" para planes detallados

1. **Firebase Emulator Suite** — Christopher — Pre-implementación
   - QA necesita emuladores de Auth, Firestore y Storage funcionando
   - Sin esto, tests tocan producción o no son ejecutables

2. **Zod Schemas definidos** — Christopher — Con implementación de modelos
   - QA necesita schemas para crear factories de datos válidos
   - Sin esto, tests usan datos hardcodeados y frágiles

### QA Infrastructure Setup (Pre-Implementación)

1. **Test Data Factories** — Christopher
   - Factories para Project, Technology, Experience, BlogPost con faker
   - Auto-cleanup después de cada test para parallel safety

2. **Test Environments**
   - Local: Firebase Emulator Suite + `pnpm dev` (Astro dev server)
   - CI/CD: GitHub Actions con emuladores cached + `pnpm build` para SSG tests

**Ejemplo de factory pattern:**

```typescript
import { describe, it, expect } from 'vitest';
import { ProjectSchema } from '@/lib/schemas';
import { createProject } from '@/test/factories';

describe('Project Schema', () => {
  it('valida un proyecto correctamente formado', () => {
    const project = createProject();
    const result = ProjectSchema.safeParse(project);
    expect(result.success).toBe(true);
  });

  it('rechaza proyecto sin nombre', () => {
    const project = createProject({ companyName: undefined });
    const result = ProjectSchema.safeParse(project);
    expect(result.success).toBe(false);
  });
});
```

---

## Risk Assessment

**Nota:** Detalles completos en documento de Arquitectura. Esta sección resume riesgos relevantes para planificación de tests QA.

### High-Priority Risks (Score >=6)

| Risk ID | Cat. | Descripción | Score | Cobertura QA |
|---|---|---|---|---|
| **R-01** | TECH | Sin aislamiento de entorno de test | **6** | Prerequisito: emuladores configurados antes de tests |
| **R-02** | SEC | Security Rules no validadas | **6** | I-001 a I-007: tests de rules con emulador |
| **R-03** | BUS | Timeline agresivo | **6** | Priorizar P0 (18 tests) primero |

### Medium/Low-Priority Risks

| Risk ID | Cat. | Descripción | Score | Cobertura QA |
|---|---|---|---|---|
| R-04 | DATA | Assets huérfanos en Storage | 4 | U-005, U-006, E-007, E-017: tests de lifecycle |
| R-05 | TECH | TipTap difícil en E2E | 4 | U-016, U-017: unit tests de serialización; E-011: E2E happy path |
| R-06 | TECH | Emuladores lentos en CI | 4 | Cache en GitHub Actions |
| R-07 | BUS | i18n incompleto | 4 | E-003: cambio ES→EN; U-003: Localized type |
| R-08 | TECH | Image upload en E2E | 4 | E-005, E-017: setInputFiles() + emulador |
| R-09 | SEC | Admin auth bypass | 3 | E-014: redirect a login sin auth |
| R-10 | PERF | Lighthouse variabilidad | 2 | Múltiples runs con mediana en CI |
| R-11 | DATA | SSG reproducibilidad | 2 | Emulador con datos controlados |

---

## Entry Criteria

- [ ] Firebase Emulator Suite configurado y funcionando (Auth, Firestore, Storage)
- [ ] Zod schemas definidos para las 4 colecciones
- [ ] Factories de datos creadas con faker
- [ ] Astro dev server levanta sin errores con datos del emulador
- [ ] GitHub Actions pipeline configurado con emuladores

## Exit Criteria

- [ ] Todos los P0 tests pasando (18/18)
- [ ] Todos los P1 tests pasando o triaged (>=24/26)
- [ ] Sin bugs open de alta severidad
- [ ] Lighthouse >95 en 4 categorías para Home
- [ ] Cobertura Vitest >=80%

---

## Test Coverage Plan

**IMPORTANT:** P0/P1/P2/P3 = **prioridad y nivel de riesgo** (qué priorizar si hay poco tiempo), NO timing de ejecución. Ver "Execution Strategy" para cuándo se ejecutan.

### P0 (Critical)

**Criteria:** Bloquea funcionalidad core + Riesgo alto (>=6) + Sin workaround

| Test ID | Requisito | Nivel | Risk Link | Notas |
|---|---|---|---|---|
| **U-001** | Zod valida docs válidos (4 colecciones) | Unit | R-04 | Base de toda validación |
| **U-002** | Zod rechaza docs inválidos | Unit | R-04 | Edge cases de validación |
| **U-004** | ImageService.upload retorna StoredImage | Unit | R-04 | Core gestión imágenes |
| **U-005** | ImageService.replace orden correcto | Unit | R-04 | Previene huérfanos |
| **U-006** | ImageService.delete elimina archivo | Unit | R-04 | Previene huérfanos |
| **U-008** | Meta tags generation correcta por página | Unit | — | SEO es objetivo principal |
| **I-001** | Security Rules: read público permitido | Integration | R-02 | Seguridad crítica |
| **I-002** | Security Rules: write sin auth denegado | Integration | R-02 | Seguridad crítica |
| **I-003** | Security Rules: write solo UID admin | Integration | R-02 | Seguridad crítica |
| **I-004** | Security Rules: write UID no-admin denegado | Integration | R-02 | Seguridad crítica |
| **E-001** | Journey Sarah: Home → Projects → detalle | E2E | — | Journey principal |
| **E-003** | Cambio idioma ES→EN, contenido cambia | E2E | R-07 | i18n es pervasivo |
| **E-004** | Login → dashboard → secciones admin | E2E | R-02 | Auth flow |
| **E-005** | CRUD Project: crear con imagen y datos ES/EN | E2E | R-08 | Journey admin core |
| **E-011** | Blog: crear post con editor, slug, publicar | E2E | R-05 | Journey blogger |
| **E-012** | Blog: draft no visible en sitio público | E2E | — | Privacidad de contenido |
| **E-014** | Ruta protegida: /admin sin auth → redirect login | E2E | R-09 | Seguridad UX |
| **L-001** | Home: Lighthouse >95 en 4 categorías | Lighthouse | R-10 | Quality gate principal |

**Total P0:** 18 tests

---

### P1 (High)

**Criteria:** Features importantes + Riesgo medio (3-4) + Workflows comunes

| Test ID | Requisito | Nivel | Risk Link | Notas |
|---|---|---|---|---|
| **U-003** | Localized type acceso `field[locale]` | Unit | R-07 | Patrón pervasivo |
| **U-007** | ImageSlot transitions completas | Unit | R-04 | Discriminated union |
| **U-009** | Blog OpenGraph con título, descripción, imagen | Unit | — | Compartibilidad LinkedIn |
| **U-010** | Sitemap incluye públicas, excluye /admin | Unit | — | SEO técnico |
| **U-011** | hreflang tags ES/EN por página | Unit | R-07 | i18n SEO |
| **U-013** | Theme persistence localStorage | Unit | — | UX preferencia tema |
| **U-015** | Slug generation URL-friendly | Unit | — | Routing limpio |
| **U-016** | TipTap serialización a HTML sanitizado | Unit | R-05 | Mitiga TipTap risk |
| **U-017** | TipTap deserialización HTML→editor | Unit | R-05 | Edición posts |
| **U-018** | Migration script transforma schema correctamente | Unit | — | One-time crítico |
| **I-005** | Storage Rules: read público | Integration | R-02 | Imágenes públicas |
| **I-006** | Storage Rules: upload sin auth denegado | Integration | R-02 | Protección Storage |
| **I-007** | Storage Rules: upload solo UID admin | Integration | R-02 | Single admin |
| **I-008** | Firebase Auth: login válido retorna token | Integration | — | Auth flow |
| **I-009** | Firebase Auth: login inválido retorna error | Integration | — | Error handling |
| **E-002** | Blog list visible, artículo legible con formato | E2E | — | Journey Sarah |
| **E-006** | CRUD Project: editar existente | E2E | — | Journey admin |
| **E-007** | CRUD Project: eliminar + limpieza assets | E2E | R-04 | Previene huérfanos |
| **E-008** | CRUD Technology: crear con imagen | E2E | R-08 | Admin completo |
| **E-009** | CRUD Experience: crear con datos ES/EN | E2E | — | Admin completo |
| **E-010** | Logout funcional | E2E | — | Auth completo |
| **E-013** | Blog post publicado visible en /blog y /blog/[slug] | E2E | — | Blog público |
| **E-015** | Responsive: Home en mobile, tablet, desktop | E2E | — | Accesibilidad |
| **E-016** | Dark/Light toggle + persistencia | E2E | — | UX |
| **E-017** | Image replace: nueva visible, vieja eliminada | E2E | R-04 | Lifecycle imágenes |
| **L-002** | Project detail: Lighthouse >95 | Lighthouse | R-10 | Performance |

**Total P1:** 26 tests

---

### P2 (Medium)

**Criteria:** Features secundarias + Riesgo bajo (1-2) + Edge cases

| Test ID | Requisito | Nivel | Risk Link | Notas |
|---|---|---|---|---|
| **U-012** | JSON-LD structured data válido | Unit | — | SEO avanzado |
| **U-014** | Theme respeta prefers-color-scheme | Unit | — | Accesibilidad |
| **U-019** | Contact form genera URL WhatsApp/mailto | Unit | — | Contacto |
| **I-010** | Firestore queries indexadas | Integration | — | Performance queries |
| **E-018** | Experience timeline orden cronológico | E2E | — | Visualización |
| **E-019** | Contact form genera link correcto | E2E | — | Contacto |
| **E-020** | Social links funcionales | E2E | — | Redes sociales |
| **E-021** | Project filter por tecnología | E2E | — | Navegación |
| **E-022** | Image viewer ampliar screenshot | E2E | — | UX |
| **E-023** | Blog: editar post, cambiar estado | E2E | — | Blog management |
| **E-024** | Blog: eliminar post + assets | E2E | R-04 | Blog cleanup |
| **L-003** | Blog post: Lighthouse >95 | Lighthouse | R-10 | Performance |
| **L-004** | Bundle JS total <50KB | Lighthouse | — | Performance |

**Total P2:** 13 tests

---

## Execution Strategy

**Filosofía:** Ejecutar todo en PRs a menos que sea costoso o largo. Playwright con paralelización ejecuta docenas de tests en minutos.

**Organizado por TIPO DE HERRAMIENTA:**

### Every PR: Vitest + Playwright (~8-13 min)

**Todos los tests funcionales:**

- Unit tests (Vitest): ~19 tests, ~1-2 min
- Integration tests (Vitest + Firebase Emulator): ~10 tests, ~2-3 min
- E2E P0 (Playwright + Emulator): ~6 tests, ~5-8 min
- Total: ~35 tests en PR

**Why run in PRs:** Feedback rápido, sin infraestructura costosa

### Pre-merge to main: + E2E P1 + Lighthouse (~15-20 min)

- E2E P0 + P1 (Playwright): ~17 tests, ~10-15 min
- Lighthouse CI Home + Project detail: ~5 min

### Nightly: E2E completo + Lighthouse full (~20-30 min)

- E2E P0 + P1 + P2 (Playwright): ~24 tests
- Lighthouse CI todas las páginas: 4 audits

---

## QA Effort Estimate

| Prioridad | Count | Effort Range | Notas |
|---|---|---|---|
| P0 | ~18 | ~8-12 horas | Setup de seguridad, journeys core, validación |
| P1 | ~26 | ~12-18 horas | CRUD completo, SEO, accesibilidad |
| P2 | ~13 | ~5-8 horas | Edge cases, flujos secundarios |
| Infraestructura | — | ~4-6 horas | Emulador, CI pipeline, fixtures, factories |
| **Total** | **~57** | **~29-44 horas** | **1 desarrollador** |

**Assumptions:**

- Incluye diseño, implementación, debugging, integración CI
- Excluye mantenimiento continuo (~10% esfuerzo)
- Asume infraestructura de test (factories, fixtures) lista

---

## Implementation Planning Handoff

| Work Item | Owner | Target | Dependencies |
|---|---|---|---|
| Configurar Firebase Emulator Suite | Christopher | Pre-implementación | Firebase CLI instalado |
| Crear factories de datos (4 colecciones) | Christopher | Con Zod schemas | Schemas definidos |
| Escribir tests Security Rules (I-001 a I-007) | Christopher | Con auth implementada | Emulador funcionando |
| Implementar unit tests ImageService (U-004 a U-006) | Christopher | Con ImageService | ImageService implementado |
| Configurar Lighthouse CI en GitHub Actions | Christopher | Con CI pipeline | Pipeline base configurado |
| Implementar E2E journeys P0 (E-001 a E-014) | Christopher | Post-implementación | Sitio funcional + emulador |

---

## Tooling & Access

| Tool | Propósito | Acceso | Status |
|---|---|---|---|
| Firebase Emulator Suite | Tests locales y CI | Instalación local + CI | Pending |
| Vitest | Unit + Integration tests | npm dependency | Pending |
| Playwright | E2E tests cross-browser | npm dependency | Pending |
| Lighthouse CI | Performance/SEO/A11y gates | GitHub Actions | Pending |
| @faker-js/faker | Data generation para factories | npm dependency | Pending |

---

## Interworking & Regression

| Servicio/Componente | Impacto | Scope de Regresión | Validación |
|---|---|---|---|
| **Firebase Auth** | Login/logout admin | Auth tests (I-008, I-009, E-004, E-010) | Token válido, redirect sin auth |
| **Firestore** | CRUD 4 colecciones | Security Rules (I-001 a I-004), CRUD E2E | Datos persisten correctamente |
| **Firebase Storage** | Upload/replace/delete imágenes | ImageService unit tests, E2E image tests | Zero huérfanos post-operación |
| **Astro SSG** | Build genera HTML estático | Lighthouse CI, meta tags unit tests | Build exitoso, HTML correcto |

**Estrategia de regresión:**

- Todos los tests P0 + P1 deben pasar antes de merge a main
- Lighthouse CI como gate automático en cada deploy

---

## Appendix A: Code Examples & Tagging

**Vitest Tags para ejecución selectiva:**

```typescript
// tests/unit/schemas.test.ts
import { describe, it, expect } from 'vitest';
import { ProjectSchema } from '@/lib/schemas';
import { createProject } from '@/test/factories';

// P0 critical test
describe('ProjectSchema @p0 @unit', () => {
  it('valida proyecto con todos los campos requeridos', () => {
    const project = createProject();
    expect(ProjectSchema.safeParse(project).success).toBe(true);
  });

  it('rechaza proyecto sin slug', () => {
    const project = createProject({ slug: undefined });
    expect(ProjectSchema.safeParse(project).success).toBe(false);
  });
});
```

**Playwright Tags para ejecución selectiva:**

```typescript
// tests/e2e/public-site.spec.ts
import { test, expect } from '@playwright/test';

// P0 critical journey
test('@P0 @E2E Journey Sarah: Home carga y navega a Projects', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toBeVisible();
  await page.click('a[href*="projects"]');
  await expect(page).toHaveURL(/projects/);
  await expect(page.locator('[data-testid="project-card"]').first()).toBeVisible();
});

// P0 security
test('@P0 @E2E Admin protegido: redirect sin auth', async ({ page }) => {
  await page.goto('/admin');
  await expect(page).toHaveURL(/admin\/login/);
});
```

**Ejecutar por tag:**

```bash
# Solo P0
npx vitest --grep @p0
npx playwright test --grep @P0

# P0 + P1
npx playwright test --grep "@P0|@P1"

# Solo security
npx playwright test --grep @Security
```

---

## Appendix B: Knowledge Base References

- **Risk Governance**: `risk-governance.md` — Metodología de scoring de riesgos
- **Test Levels Framework**: `test-levels-framework.md` — Selección E2E vs Integration vs Unit
- **Test Quality**: `test-quality.md` — Definition of Done (sin hard waits, <300 líneas, <1.5 min)
- **Playwright CLI**: `playwright-cli.md` — Browser automation para exploración de selectores

---

**Generated by:** TEA Master Test Architect
**Workflow:** `_bmad/tea/workflows/testarch/bmad-testarch-test-design`
