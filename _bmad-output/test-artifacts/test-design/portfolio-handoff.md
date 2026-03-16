---
title: 'TEA Test Design → BMAD Handoff Document'
version: '1.0'
workflowType: 'testarch-test-design-handoff'
inputDocuments:
  - '_bmad-output/test-artifacts/test-design-architecture.md'
  - '_bmad-output/test-artifacts/test-design-qa.md'
sourceWorkflow: 'testarch-test-design'
generatedBy: 'TEA Master Test Architect'
generatedAt: '2026-03-16'
projectName: 'portfolio'
---

# TEA → BMAD Integration Handoff

## Purpose

Este documento conecta las salidas de test design de TEA con el workflow de descomposición en epics/stories de BMAD (`create-epics-and-stories`). Proporciona guía de integración estructurada para que los requisitos de calidad, evaluaciones de riesgo y estrategias de test fluyan hacia la planificación de implementación.

## TEA Artifacts Inventory

| Artifact | Path | BMAD Integration Point |
|---|---|---|
| Test Design Architecture | `_bmad-output/test-artifacts/test-design-architecture.md` | Requisitos de calidad por epic, blockers pre-implementación |
| Test Design QA | `_bmad-output/test-artifacts/test-design-qa.md` | Acceptance criteria por story, cobertura de test |
| Risk Assessment | (embebido en ambos documentos) | Clasificación de riesgo por epic, prioridad de stories |
| Coverage Strategy | (embebido en QA doc) | Requisitos de test por story |

## Epic-Level Integration Guidance

### Risk References

Los siguientes riesgos P0/P1 deben aparecer como quality gates a nivel de epic:

| Risk ID | Score | Epic que debe referenciarlo | Quality Gate |
|---|---|---|---|
| R-01 | 6 (HIGH) | Epic de setup/infraestructura | Firebase Emulator Suite configurado antes de implementar tests |
| R-02 | 6 (HIGH) | Epic de autenticación/seguridad | Tests de Security Rules pasando antes de cerrar el epic |
| R-03 | 6 (HIGH) | Todos los epics | P0 tests del epic deben pasar antes de merge |
| R-04 | 4 (MED) | Epic de gestión de imágenes | Zero huérfanos verificados en tests E2E |
| R-05 | 4 (MED) | Epic de blog | Unit tests de TipTap serialización pasando |

### Quality Gates

| Epic (estimado) | Gate Criteria |
|---|---|
| **Setup & Infraestructura** | Firebase Emulator Suite funcionando; factories de datos creadas; CI pipeline base |
| **Sitio Público** | E-001 (Home→Projects), E-003 (i18n), L-001 (Lighthouse >95) pasando |
| **Auth & Admin** | I-001 a I-004 (Security Rules), E-004 (login), E-014 (route protection) pasando |
| **CRUD Admin** | E-005 a E-009 (CRUD entities), E-017 (image replace) pasando; U-004 a U-006 (ImageService) pasando |
| **Blog** | E-011 (crear post), E-012 (draft no visible), U-016/U-017 (TipTap serialización) pasando |
| **SEO & Performance** | U-008 a U-011 (meta tags, sitemap, hreflang), L-001 a L-004 (Lighthouse) pasando |
| **Open Source & Deploy** | CI pipeline completo; README documentado; .env.example presente |

## Story-Level Integration Guidance

### P0/P1 Test Scenarios → Story Acceptance Criteria

Los siguientes escenarios de test DEBEN ser acceptance criteria en sus stories correspondientes:

| Test ID | Escenario | Story que debe incluirlo como AC |
|---|---|---|
| U-001/U-002 | Zod schemas validan/rechazan documentos | Story de definición de modelos/schemas |
| U-004/U-005/U-006 | ImageService upload/replace/delete | Story de ImageService |
| I-001 a I-004 | Security Rules Firestore | Story de Firestore Security Rules |
| I-005 a I-007 | Security Rules Storage | Story de Storage Security Rules |
| E-001 | Home carga, navegación a Projects | Story de página Home |
| E-003 | Cambio idioma ES→EN | Story de i18n |
| E-004 | Login → dashboard | Story de login admin |
| E-005 | Crear proyecto con imagen y datos ES/EN | Story de CRUD Projects |
| E-011 | Crear blog post con editor, publicar | Story de CRUD Blog |
| E-012 | Draft no visible en público | Story de estados blog (published/draft) |
| E-014 | /admin sin auth → redirect login | Story de protección de rutas |
| L-001 | Lighthouse >95 en 4 categorías | Story de optimización performance |

### Data-TestId Requirements

Los siguientes `data-testid` son recomendados para testabilidad con Playwright:

| Componente | data-testid recomendado | Usado en test |
|---|---|---|
| Card de proyecto | `project-card` | E-001, E-021 |
| Formulario login | `login-email`, `login-password`, `login-submit` | E-004 |
| Formulario proyecto admin | `project-name-es`, `project-name-en`, `project-image`, `project-save` | E-005 |
| Blog editor | `blog-title-es`, `blog-slug`, `blog-editor`, `blog-publish` | E-011 |
| Language toggle | `lang-toggle` | E-003 |
| Theme toggle | `theme-toggle` | E-016 |
| Nav links | `nav-projects`, `nav-blog`, `nav-contact` | E-001, E-002 |

## Risk-to-Story Mapping

| Risk ID | Category | P x I | Recommended Story/Epic | Test Level |
|---|---|---|---|---|
| R-01 | TECH | 2x3=6 | Epic: Setup & Infraestructura | Integration |
| R-02 | SEC | 2x3=6 | Story: Firestore/Storage Security Rules | Integration |
| R-03 | BUS | 3x2=6 | Todos los epics (quality gate transversal) | Todos |
| R-04 | DATA | 2x2=4 | Story: ImageService + CRUD con imágenes | Unit + E2E |
| R-05 | TECH | 2x2=4 | Story: Blog editor TipTap | Unit + E2E |
| R-06 | TECH | 2x2=4 | Epic: CI/CD Pipeline | CI config |
| R-07 | BUS | 2x2=4 | Story: i18n routing y contenido | E2E |
| R-08 | TECH | 2x2=4 | Story: Image upload/replace en admin | E2E |
| R-09 | SEC | 1x3=3 | Story: Protección rutas admin | E2E |
| R-10 | PERF | 2x1=2 | Story: Lighthouse CI config | Lighthouse |
| R-11 | DATA | 1x2=2 | Story: Build scripts con Admin SDK | Unit |

## Recommended BMAD → TEA Workflow Sequence

1. **TEA Test Design** (`TD`) → produce este documento handoff
2. **BMAD Create Epics & Stories** → consume este handoff, embebe requisitos de calidad
3. **TEA ATDD** (`AT`) → genera acceptance tests por story
4. **BMAD Implementation** → developers implementan con guía test-first
5. **TEA Automate** (`TA`) → genera suite de tests completa
6. **TEA Trace** (`TR`) → valida completitud de cobertura

## Phase Transition Quality Gates

| From Phase | To Phase | Gate Criteria |
|---|---|---|
| Test Design | Epic/Story Creation | Todos los P0 risks tienen estrategia de mitigación |
| Epic/Story Creation | ATDD | Stories tienen acceptance criteria del test design |
| ATDD | Implementation | Failing acceptance tests existen para todos los P0/P1 scenarios |
| Implementation | Test Automation | Todos los acceptance tests pasan |
| Test Automation | Release | Trace matrix muestra >=80% cobertura de P0/P1 requirements |
