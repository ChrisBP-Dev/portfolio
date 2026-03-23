---
title: 'E2E Tests Admin Panel — 9 Playwright tests con auth fixture'
type: 'chore'
created: '2026-03-22'
status: 'done'
baseline_commit: 'd8f1d62'
context:
  - '_bmad-output/test-artifacts/test-design-qa.md'
  - '_bmad-output/implementation-artifacts/deferred-work.md'
---

# E2E Tests Admin Panel — 9 Playwright tests con auth fixture

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** El admin panel (login, dashboard, CRUD projects/technologies/experiences, logout, route protection) no tiene E2E tests. Esto fue identificado como gap en la retro del Epic 3.

**Approach:** Crear auth fixture compartido que logea via UI y persiste storageState. Implementar 9 tests (E-004, E-005, E-006, E-007, E-008, E-009, E-010, E-014, E-017) usando la infra Playwright existente contra Firebase real.

## Boundaries & Constraints

**Always:**
- Login via UI (navigate to /admin/login, fill email/password, submit) — no API shortcuts
- Env vars `E2E_ADMIN_EMAIL` y `E2E_ADMIN_PASSWORD` para credenciales de test
- Limpiar datos creados por tests (delete after create/edit tests) para idempotencia
- Usar selectores semánticos: `getByRole`, `getByLabel`, IDs existentes (`#login-email`, etc.)
- Tests deben pasar con `pnpm build && pnpm preview` (no dev server)

**Ask First:**
- Si Firebase Auth real falla con rate limiting o credenciales inválidas
- Si algún test necesita emuladores en vez de Firebase real

**Never:**
- Modificar código de producción para hacer tests más fáciles
- Hardcodear credenciales en test files
- Tests que dependan del orden de ejecución entre archivos

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Login success | Valid email + password | Redirect to /admin, dashboard visible | N/A |
| Route protection | Navigate /admin/projects without auth | Redirect to /admin/login | N/A |
| Create project | Fill bilingual fields + upload image | Project appears in list | Cleanup: delete after verify |
| Edit project | Change a field, save | Updated value visible in list | N/A |
| Delete project | Click delete, confirm dialog | Project removed from list | N/A |
| Create technology | Fill name + years + upload image | Technology appears in list | Cleanup: delete after verify |
| Create experience | Fill bilingual fields + dates | Experience appears in list | Cleanup: delete after verify |
| Logout | Click sidebar logout | Redirect to /admin/login | N/A |
| Image replace | Edit project, change main image, save | New image visible | N/A |

</frozen-after-approval>

## Code Map

- `playwright.config.ts` -- Add auth project with storageState setup
- `tests/e2e/auth.setup.ts` -- Auth fixture: login via UI, save storageState
- `tests/e2e/admin-auth.spec.ts` -- E-004 (login+dashboard), E-014 (route protection), E-010 (logout)
- `tests/e2e/admin-projects.spec.ts` -- E-005 (create), E-006 (edit), E-007 (delete), E-017 (image replace)
- `tests/e2e/admin-technologies.spec.ts` -- E-008 (create technology)
- `tests/e2e/admin-experiences.spec.ts` -- E-009 (create experience)
- `.env.example` -- Add E2E_ADMIN_EMAIL, E2E_ADMIN_PASSWORD vars

## Tasks & Acceptance

**Execution:**

- [x]`.env` + `.env.example` -- Add `E2E_ADMIN_EMAIL` and `E2E_ADMIN_PASSWORD` env vars
- [x]`playwright.config.ts` -- Add "setup" project for auth + "admin" project that depends on it with storageState
- [x]`tests/e2e/auth.setup.ts` -- Login via UI (#login-email, #login-password), wait for /admin redirect, save storageState to `.auth/admin.json`
- [x]`tests/e2e/admin-auth.spec.ts` -- E-004: verify dashboard 4 sections navigable. E-014: unauthenticated access redirects. E-010: logout redirects to login
- [x]`tests/e2e/admin-projects.spec.ts` -- E-005: create with image (setInputFiles), bilingual fields, verify in list. E-006: edit field, save, verify. E-007: delete + confirm dialog, verify removed. E-017: image replace on edit, verify new image
- [x]`tests/e2e/admin-technologies.spec.ts` -- E-008: create with image, verify in list, cleanup delete
- [x]`tests/e2e/admin-experiences.spec.ts` -- E-009: create with dates + bilingual fields, verify in list, cleanup delete

**Acceptance Criteria:**
- Given valid admin credentials in env, when auth.setup runs, then storageState is saved and reused by all admin tests
- Given an unauthenticated browser, when navigating to /admin/projects, then redirect to /admin/login occurs
- Given a logged-in admin, when creating a project with image + bilingual fields, then the project appears in the list
- Given a logged-in admin, when editing a project field and saving, then the updated value is visible
- Given a logged-in admin, when deleting a project and confirming, then it disappears from the list
- Given a logged-in admin, when clicking logout, then redirect to /admin/login occurs
- Given a logged-in admin, when replacing a project image, then the new image is displayed
- All 9 E2E tests pass with `pnpm exec playwright test tests/e2e/admin-*.spec.ts`

## Design Notes

**Auth fixture pattern** — Playwright setup project:
```ts
// playwright.config.ts
{ name: 'setup', testMatch: /auth\.setup\.ts/ },
{ name: 'admin', dependencies: ['setup'], use: { storageState: '.auth/admin.json' } }
```

**Test cleanup** — Create tests should delete their data at the end (or in afterEach) to keep tests idempotent. Use unique timestamps in names to avoid collisions.

## Verification

**Commands:**
- `pnpm build` -- expected: successful build
- `pnpm exec playwright test tests/e2e/admin-*.spec.ts --project=admin` -- expected: 9 tests pass
- `pnpm exec playwright test tests/e2e/auth.setup.ts` -- expected: auth setup passes

## Spec Change Log
