---
title: 'Epic 3 Deferred Items — Resolución completa (10 fixes de producción)'
type: 'bugfix'
created: '2026-03-22'
status: 'done'
baseline_commit: '4898f28'
context:
  - '_bmad-output/implementation-artifacts/epic-3-retro-2026-03-22.md'
---

# Epic 3 Deferred Items — Resolución completa

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** El admin panel deployado tiene 10 issues identificados en la retro del Epic 3: deletes no-atómicos, navegación sin verificar cambios, uploads sin cancel, screenshots sin atomicidad, creates que dejan orphans, sin component tests, breadcrumbs incompletos, screenshots sin límite, dates con timezone offset, y BilingualField con IDs inconsistentes.

**Approach:** Fix directo en cada archivo afectado siguiendo el inventario de la retro. Priorizar safe-first patterns: deleteDoc antes de images, confirm antes de navegar, cancel en cleanup, allSettled para parciales, rollback best-effort para orphans.

## Boundaries & Constraints

**Always:**
- Backward compatibility en image-service.ts — `await imageService.upload()` debe seguir funcionando
- hasChanges se expone via `export function` en Forms, CrudPages usan `bind:this`
- Tests existentes deben seguir pasando; actualizar si cambia una signature
- Comentarios inline solo donde el código no se explica solo

**Ask First:**
- Si @testing-library/svelte no es compatible con Svelte 5, proponer alternativa antes de implementar
- Si algún fix requiere cambios en componentes compartidos fuera del admin

**Never:**
- Modificar archivos en .claude/, _bmad/, _bmad-output/, docs/
- Agregar features nuevas — solo fixes del inventario
- Breaking changes en APIs públicas de componentes existentes

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Delete project — image cleanup fails | deleteDoc succeeds, deleteByPrefix throws | Project removed from list, warning logged | console.warn, no user-facing error |
| Navigate back with unsaved changes | User clicks back, hasChanges=true | window.confirm shown | If cancel: stay on form |
| Upload cancel on unmount | Component unmounts mid-upload | Upload task cancelled | No orphan files in storage |
| Multi-screenshot partial failure | 3 of 5 screenshots fail upload | 2 saved, toast warning "2/5 subidos, 3 fallaron" | Firestore updated with successful only |
| Create project — image upload fails | addDoc succeeds, upload throws | Best-effort deleteDoc rollback | If rollback fails: console.error |
| Screenshots at limit | User has 10 screenshots, clicks add | Button disabled, toast warning | N/A |
| Deep breadcrumb path | /admin/projects/edit | ["Admin", "Projects", "Edit"] segments | Unknown segments capitalized |
| Date input timezone | "2025-06-15" in date input | Interpreted as local midnight, not UTC | N/A |

</frozen-after-approval>

## Code Map

- `src/lib/firebase/image-service.ts` -- Upload con cancel, backward compat
- `src/components/admin/ProjectsCrudPage.svelte` -- Delete order, navigateToList
- `src/components/admin/TechnologiesCrudPage.svelte` -- Delete order, navigateToList
- `src/components/admin/ExperiencesCrudPage.svelte` -- Verify delete order, navigateToList
- `src/components/admin/ProjectForm.svelte` -- Export hasChanges, upload cancel, allSettled, orphan rollback
- `src/components/admin/TechnologyForm.svelte` -- Export hasChanges, upload cancel, orphan rollback
- `src/components/admin/ExperienceForm.svelte` -- Export hasChanges, date timezone fix
- `src/components/admin/ScreenshotManager.svelte` -- MAX_SCREENSHOTS limit
- `src/components/admin/breadcrumb-utils.ts` -- Deep path support
- `src/components/admin/BilingualField.svelte` -- idPrefix prop
- `src/lib/firebase/__tests__/image-service.test.ts` -- Update for new upload signature
- `src/components/admin/__tests__/admin-breadcrumb.test.ts` -- Deep path tests
- `src/components/admin/__tests__/experience-form.test.ts` -- Date timezone tests

## Tasks & Acceptance

**Execution:**

- [x]`src/lib/firebase/image-service.ts` -- Modify upload() to return UploadHandle (PromiseLike + cancel). UploadHandle implements `then/catch` for backward compat plus `cancel()` that calls `uploadTask.cancel()`
- [x]`src/lib/firebase/__tests__/image-service.test.ts` -- Update upload tests for UploadHandle, add cancel test
- [x]`src/components/admin/ProjectForm.svelte` -- (a) Export `getHasChanges()`. (b) Store upload cancel refs, call in cleanup. (c) Change screenshot Promise.all→Promise.allSettled with partial success toast. (d) Add deleteDoc rollback if image upload fails after addDoc in create
- [x]`src/components/admin/TechnologyForm.svelte` -- (a) Export `getHasChanges()`. (b) Store upload cancel ref, call in cleanup. (c) Add deleteDoc rollback if image upload fails after addDoc in create
- [x]`src/components/admin/ExperienceForm.svelte` -- (a) Export `getHasChanges()`. (b) Fix date parsing: `new Date(value + 'T00:00:00')` in submit and edit init
- [x]`src/components/admin/ProjectsCrudPage.svelte` -- (a) Invert delete: deleteDoc first, then deleteByPrefix (warn on image fail). (b) Add `bind:this` on form, `navigateToList()` with confirm on back+cancel
- [x]`src/components/admin/TechnologiesCrudPage.svelte` -- (a) Invert delete: deleteDoc first, then imageService.delete (warn on image fail). (b) Add bind:this + navigateToList()
- [x]`src/components/admin/ExperiencesCrudPage.svelte` -- (a) Verify delete order (no images). (b) Add bind:this + navigateToList()
- [x]`src/components/admin/ScreenshotManager.svelte` -- Add MAX_SCREENSHOTS=10, validate in addFiles(), disable button at limit, toast warning
- [x]`src/components/admin/breadcrumb-utils.ts` -- Support deep paths: split segments, capitalize unknown, build progressive hrefs
- [x]`src/components/admin/__tests__/admin-breadcrumb.test.ts` -- Add tests for deep paths
- [x]`src/components/admin/BilingualField.svelte` -- Add optional `idPrefix` prop, use `{idPrefix}-es`/`{idPrefix}-en` when provided, fallback to current label-slug pattern
- [x]Update ProjectForm and ExperienceForm BilingualField consumers to pass `idPrefix`
- [x]Evaluate @testing-library/svelte Svelte 5 compatibility — install if compatible, create ConfirmDialog component test; if not, document in test file
- [x]`src/components/admin/__tests__/experience-form.test.ts` -- Update date-related tests for timezone fix

**Acceptance Criteria:**
- Given a project delete, when deleteDoc succeeds but image cleanup fails, then the project is removed and a warning is logged
- Given a user on a form with unsaved changes, when clicking back or cancel, then a confirmation dialog appears
- Given a component unmounts during upload, when cleanup runs, then the upload task is cancelled
- Given 5 screenshot uploads where 3 fail, when create completes, then 2 screenshots are saved and a warning toast shows "2 de 5 subidos"
- Given a create where addDoc succeeds but image upload fails, then a best-effort deleteDoc rollback is attempted
- Given /admin/projects/edit path, when breadcrumb renders, then it shows Admin > Projects > Edit
- Given 10 screenshots already added, when user tries to add more, then the button is disabled and a warning toast appears
- Given "2025-06-15" date input, when form submits, then Firestore stores local midnight (not UTC-shifted)
- Given BilingualField with idPrefix="company", when rendered, then inputs have ids "company-es" and "company-en"

## Design Notes

**UploadHandle pattern** — Return object that is both PromiseLike and has cancel():
```ts
interface UploadHandle extends PromiseLike<StoredImage> {
  cancel: () => void;
}
// await imageService.upload() still works (JS checks .then())
// const { promise, cancel } = is NOT needed — just store handle
```

**hasChanges exposure** — Svelte 5 export function pattern:
```svelte
// Form: export function getHasChanges() { return hasChanges; }
// CrudPage: let formRef; <Form bind:this={formRef} />
// navigateToList(): if (formRef?.getHasChanges() && !confirm(...)) return;
```

## Verification

**Commands:**
- `pnpm lint` -- expected: 0 errors
- `pnpm type-check` -- expected: 0 errors
- `pnpm test` -- expected: all tests pass (existing + new)
- `pnpm build` -- expected: successful build

**Manual checks:**
- Admin login → delete a project → verify removed + no console errors
- Edit form → change field → click back → confirm dialog appears
- Navigate breadcrumbs on /admin/projects/edit → 3 segments shown

## Spec Change Log
