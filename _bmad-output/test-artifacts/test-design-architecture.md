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

# Test Design for Architecture: Portfolio ChrisBP

**Purpose:** Preocupaciones arquitectónicas, gaps de testabilidad y requisitos NFR para revisión por el equipo de desarrollo. Sirve como contrato entre QA e ingeniería sobre lo que debe abordarse antes de que comience el desarrollo de tests.

**Date:** 2026-03-16
**Author:** TEA Master Test Architect
**Status:** Architecture Review Pending
**Project:** portfolio
**PRD Reference:** `_bmad-output/planning-artifacts/prd.md`
**ADR Reference:** `_bmad-output/planning-artifacts/architecture.md`

---

## Executive Summary

**Scope:** Migración completa del portfolio profesional desde Flutter Web a Astro 6 + Svelte 5 + Firebase. Incluye sitio público SSG, panel admin SPA, blog con editor rico, y repositorio open source.

**Business Context** (del PRD):

- **Impacto:** Fortalecer presencia profesional para oportunidades laborales
- **Problema:** Flutter Web renderiza en canvas (sin SEO), admin con UX inconsistente, datos desactualizados
- **Lanzamiento:** 2026-03-16

**Architecture** (del ADR):

- **SSG puro** con Astro 6 — HTML estático desde Firebase Hosting CDN
- **Svelte 5 islands** para interactividad (admin forms, blog editor, toggles)
- **Firebase BaaS** — Auth, Firestore (4 colecciones), Storage (ImageService centralizado)

**Expected Scale:** Bajo (<100 usuarios concurrentes, ~50 documentos Firestore, <500MB Storage)

**Risk Summary:**

- **Total risks**: 11
- **High-priority (>=6)**: 3 riesgos que requieren mitigación inmediata
- **Test effort**: ~57 tests (~29-44 horas para 1 desarrollador)

---

## Quick Guide

### BLOCKERS - Decidir Antes de Implementar

1. **ASR-1: Firebase Emulator Suite** — Configurar emuladores de Auth, Firestore y Storage para tests locales y CI (owner: Christopher, pre-implementación)
2. **ASR-2: Factories de datos** — Crear factories que generen documentos válidos contra Zod schemas para seeding de tests (owner: Christopher, pre-implementación)

**Acción requerida:** Completar estos 2 items antes de escribir el primer test de integración o E2E.

---

### HIGH PRIORITY - Validar Recomendaciones

1. **R-02: Firestore Security Rules** — Escribir tests específicos de rules con el emulador. Recomendación: tests P0 que verifiquen read público, write denegado sin auth, write solo para UID admin (fase de implementación)
2. **R-03: Timeline agresivo** — Priorizar tests P0 (18 tests) y P1 (26 tests). No lanzar sin happy paths de los 4 journeys cubiertos (durante implementación)

**Acción requerida:** Revisar recomendaciones y aprobar o sugerir cambios.

---

### INFO ONLY - Soluciones Proporcionadas

1. **Estrategia de test**: Unit (Vitest) + Integration (emulador) + E2E (Playwright) + Lighthouse CI
2. **Tooling**: Vitest, Playwright, Firebase Emulator Suite, Lighthouse CI
3. **CI/CD**: PR (unit + integration + E2E P0, ~8-13 min) / Merge (+ E2E P1 + Lighthouse full) / Nightly (E2E completo)
4. **Coverage**: 57 escenarios priorizados P0-P2 con clasificación basada en riesgos
5. **Quality gates**: P0 100%, P1 >=95%, Lighthouse >95 en 4 categorías, cobertura >=80%

**Acción requerida:** Solo revisar y confirmar.

---

## Risk Assessment

**Total risks identificados:** 11 (3 high-priority score >=6, 5 medium, 3 low)

### High-Priority Risks (Score >=6)

| Risk ID | Cat. | Descripción | Prob. | Imp. | Score | Mitigación | Owner | Timeline |
|---|---|---|---|---|---|---|---|---|
| **R-01** | **TECH** | Sin aislamiento de entorno de test — tests podrían tocar Firestore producción | 2 | 3 | **6** | Firebase Emulator Suite para tests | Christopher | Pre-implementación |
| **R-02** | **SEC** | Firestore Security Rules no validadas con tests | 2 | 3 | **6** | Tests de Security Rules con emulador | Christopher | Con implementación de auth |
| **R-03** | **BUS** | Timeline agresivo (1 día) — riesgo de omitir tests | 3 | 2 | **6** | Priorizar P0/P1; no lanzar sin cobertura mínima | Christopher | Durante implementación |

### Medium-Priority Risks (Score 3-5)

| Risk ID | Cat. | Descripción | Prob. | Imp. | Score | Mitigación | Owner |
|---|---|---|---|---|---|---|---|
| R-04 | DATA | Assets huérfanos en Storage por operaciones fallidas | 2 | 2 | 4 | Tests de replace/delete verifican limpieza | Christopher |
| R-05 | TECH | TipTap editor difícil de testear en E2E | 2 | 2 | 4 | Unit tests de serialización; E2E solo happy path | Christopher |
| R-06 | TECH | Firebase emuladores lentos en CI | 2 | 2 | 4 | Cache de emuladores en GitHub Actions | Christopher |
| R-07 | BUS | i18n — traducciones incompletas en ES o EN | 2 | 2 | 4 | Tests que verifiquen ambos locales | Christopher |
| R-08 | TECH | Image upload complejo en E2E | 2 | 2 | 4 | setInputFiles() + Storage emulator | Christopher |

### Low-Priority Risks (Score 1-2)

| Risk ID | Cat. | Descripción | Prob. | Imp. | Score | Acción |
|---|---|---|---|---|---|---|
| R-09 | SEC | Admin auth bypass (protección client-side only) | 1 | 3 | 3 | Monitorear — Security Rules son la protección real |
| R-10 | PERF | Lighthouse CI variabilidad por condiciones de red | 2 | 1 | 2 | Monitorear |
| R-11 | DATA | SSG build reproducibilidad con datos cambiantes | 1 | 2 | 2 | Monitorear |

---

## Testability Concerns and Architectural Gaps

### ACTIONABLE CONCERNS

#### Blockers to Fast Feedback

| Concern | Impacto | Qué debe proporcionarse | Owner | Timeline |
|---|---|---|---|---|
| **Sin entorno de test** | Tests tocan producción; no-determinismo | Firebase Emulator Suite configurado | Christopher | Pre-implementación |
| **Sin seeding de datos** | Setup lento; edge cases no testeables | Factories de datos con Zod schemas | Christopher | Pre-implementación |

#### Mejoras Arquitectónicas Necesarias

1. **Admin sin endpoints API headless**
   - **Problema actual:** CRUD opera vía Firebase client SDK directo desde Svelte islands
   - **Cambio requerido:** Extraer lógica de negocio a servicios testeables (ImageService ya lo hace correctamente — replicar patrón para CRUD)
   - **Impacto si no se corrige:** Toda la lógica CRUD solo testeable vía E2E (lento, frágil)
   - **Owner:** Christopher
   - **Timeline:** Durante implementación

### Testability Assessment Summary

#### Lo que funciona bien

- Zod schemas compartidos — validación type-safe, excelente para unit tests
- ImageService centralizado con interface clara — testeable en aislamiento con mocks
- StoredImage + ImageSlot discriminated union — estados UI explícitos, cobertura exhaustiva posible
- Single admin user — sin RBAC, simplifica auth testing
- Astro SSG determinístico — mismo input = mismo output
- TypeScript strict — errores de tipo detectados en compilación

#### Trade-offs Aceptados

- **Client-side auth check** — Acceptable para Phase 1 porque Security Rules protegen los datos a nivel servidor. El check client-side es UX, no seguridad.
- **No monitoring/logging custom** — Acceptable para portfolio personal. Firebase provee monitoring básico.

---

## Risk Mitigation Plans (High-Priority >=6)

### R-01: Sin aislamiento de entorno de test (Score: 6)

**Estrategia de mitigación:**

1. Instalar Firebase CLI con emuladores: `firebase init emulators` (Auth, Firestore, Storage)
2. Configurar `firebase.json` con puertos dedicados para emuladores
3. Crear script npm `test:emulators` que levante emuladores antes de tests
4. Documentar setup en README para replicabilidad

**Owner:** Christopher
**Timeline:** Pre-implementación (antes del primer test)
**Status:** Planned
**Verificación:** `firebase emulators:start` ejecuta sin errores; tests usan emuladores, no producción

### R-02: Firestore Security Rules no validadas (Score: 6)

**Estrategia de mitigación:**

1. Escribir tests de Security Rules usando `@firebase/rules-unit-testing`
2. Cubrir 4 escenarios P0: read público, write sin auth, write con UID admin, write con UID no-admin
3. Incluir tests de Storage Rules (upload/delete permissions)
4. Ejecutar en CI como parte de la suite de integration tests

**Owner:** Christopher
**Timeline:** Con implementación de auth
**Status:** Planned
**Verificación:** 4+ tests de rules pasando en CI; ninguna regla permite escritura no autorizada

### R-03: Timeline agresivo (Score: 6)

**Estrategia de mitigación:**

1. Implementar P0 tests primero (18 tests — core journeys + seguridad)
2. P1 tests en segundo lugar (26 tests — CRUD completo + SEO)
3. No lanzar sin los 4 happy paths de user journeys cubiertos
4. P2 tests pueden completarse post-lanzamiento si timeline es insuficiente

**Owner:** Christopher
**Timeline:** Durante implementación
**Status:** Planned
**Verificación:** 18 P0 tests pasando; 4 user journeys con happy path cubierto

---

## Assumptions and Dependencies

### Assumptions

1. Firebase Emulator Suite funciona correctamente con Auth, Firestore y Storage en macOS y GitHub Actions
2. Astro 6 SSG build es determinístico dado los mismos datos de entrada de Firestore
3. Playwright puede interactuar con Svelte 5 islands hidratadas sin problemas de timing

### Dependencies

1. Firebase Emulator Suite instalado y configurado — requerido antes del primer test
2. Zod schemas definidos — requerido antes de crear factories de datos
3. GitHub Actions configurado con Firebase CLI — requerido para CI

### Riesgos al Plan

- **Riesgo:** Firebase Emulator Suite inestable en GitHub Actions
  - **Impacto:** Tests de integración y E2E fallan intermitentemente en CI
  - **Contingencia:** Cache agresivo de emuladores; retry en CI; timeouts generosos

---

**Fin del Documento de Arquitectura**

**Siguiente paso:** Ver documento QA companion (`test-design-qa.md`) para escenarios de test y estrategia de ejecución.
