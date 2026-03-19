---
title: 'Hero Section — Actualizar copy y documentar intención de migración a Firebase'
type: 'feature'
created: '2026-03-19'
status: 'done'
baseline_commit: 'ecc8447'
context:
  - '_bmad-output/implementation-artifacts/2-2-home-page-about-me-y-knowledge-of.md'
---

# Hero Section — Actualizar copy y documentar intención de migración a Firebase

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** El Hero section tiene texto placeholder genérico ("Yo programo y creo contenido") que no refleja el perfil profesional real de Christopher: +4 años en Flutter, expansión a web full-stack, desarrollo aumentado con IA/BMAD Method, y proyectos open source. Además, el Hero es la única sección del sitio con contenido hardcodeado en i18n — todas las demás (Projects, Experience, Technologies) usan Firebase + Admin CMS — y esa asimetría no está documentada como trabajo futuro.

**Approach:** Actualizar las translation keys del Hero en `translations.ts` con copy profesional aprobado por Christopher. Actualizar los E2E tests que verifican el texto del Hero. Actualizar `home.meta.description` para alinearse con el nuevo copy. Documentar un defer en el Code Review Record de story 2.2 indicando que el Hero debería migrar a Firebase admin en el futuro.

## Boundaries & Constraints

**Always:** Mantener ambos idiomas (ES/EN) sincronizados. Pasar CI/CD completo (`pnpm lint && pnpm type-check && pnpm test && pnpm build`). No tocar la estructura visual/CSS del componente HeroSection.astro.

**Ask First:** Si algún test adicional falla por razones no relacionadas al cambio de texto.

**Never:** Modificar la arquitectura del Hero (no migrar a Firebase ahora — solo documentar la intención). No tocar archivos en `.claude/`, `_bmad/`, `_bmad-output/planning-artifacts/`. No cambiar los CTAs (Contáctame / Descargar CV).

</frozen-after-approval>

## Code Map

- `src/lib/i18n/translations.ts` -- Translation keys del Hero y meta description
- `tests/e2e/home-page.spec.ts` -- E2E tests que verifican texto del heading Hero (ES líneas 10-11, EN líneas 67-68)
- `_bmad-output/implementation-artifacts/2-2-home-page-about-me-y-knowledge-of.md` -- Story 2.2 donde documentar el defer

## Tasks & Acceptance

**Execution:**
- [ ] `src/lib/i18n/translations.ts` -- Actualizar `home.hero.heading`, `home.hero.headingAccent`, `home.hero.description` y `home.meta.description` con el nuevo copy aprobado (ES/EN)
- [ ] `tests/e2e/home-page.spec.ts` -- Actualizar assertions del heading en ES (líneas 10-11) y EN (líneas 67-68) para reflejar nuevo texto
- [ ] `_bmad-output/implementation-artifacts/2-2-home-page-about-me-y-knowledge-of.md` -- Añadir defer D5 al Code Review Record: "Hero content hardcodeado en i18n — migrar a Firestore + Admin CMS para consistencia con el resto de secciones"

**Acceptance Criteria:**
- Given I visit `/` When the page loads Then the h1 contains "Yo construyo y creo experiencias"
- Given I visit `/en/` When the page loads Then the h1 contains "I build and create experiences"
- Given I run `pnpm lint && pnpm type-check && pnpm test && pnpm build` When all commands complete Then all pass with zero errors
- Given I run `pnpm exec playwright test` When E2E tests complete Then all pass including updated Hero text assertions
- Given I read story 2.2 Code Review Record Then a defer D5 documents the intent to migrate Hero to Firebase admin

## Verification

**Commands:**
- `pnpm lint` -- expected: 0 errors
- `pnpm type-check` -- expected: 0 errors
- `pnpm test` -- expected: all unit tests pass
- `pnpm build` -- expected: successful SSG build
- `pnpm exec playwright test tests/e2e/home-page.spec.ts` -- expected: all E2E tests pass with updated text
