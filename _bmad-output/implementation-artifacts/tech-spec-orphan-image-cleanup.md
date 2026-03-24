---
title: 'Orphan Image Cleanup on Form Abandonment'
type: 'feature'
created: '2026-03-24'
status: 'done'
baseline_commit: 'e992154'
context: []
---

# Orphan Image Cleanup on Form Abandonment

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Cuando el usuario sube imágenes en forms admin (BlogForm, ProjectForm, TechnologyForm) y navega sin guardar, las imágenes quedan en Firebase Storage como orphans sin referencia en Firestore.

**Approach:** Trackear un flag `savedSuccessfully` por form. En el cleanup del `$effect` al desmontar, si el flag es false, eliminar todas las imágenes subidas durante esa sesión. Non-blocking fire-and-forget con console.warn en fallos.

## Boundaries & Constraints

**Always:**
- Non-blocking cleanup (fire-and-forget, sin await en el cleanup)
- try-catch con console.warn por imagen — fallo parcial aceptable
- Solo limpiar imágenes subidas durante ESTE ciclo de vida del componente
- Set savedSuccessfully DESPUÉS del write exitoso final a Firestore

**Ask First:**
- Cambios al control flow del save más allá de agregar el flag

**Never:**
- Bloquear al usuario o mostrar UI durante cleanup
- Throw errors desde cleanup
- Borrar imágenes de sesiones previas o de otros forms
- Limpiar imágenes existentes en edit mode que no fueron modificadas

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Create + abandon con uploads | Usuario sube imágenes, navega sin guardar | Imágenes eliminadas de Storage | console.warn, orphans quedan |
| Create + save exitoso | Usuario sube imágenes, guarda | Imágenes preservadas, sin cleanup | N/A |
| Edit + abandon con nuevos uploads | Usuario agrega imágenes nuevas, navega sin guardar | Solo nuevas imágenes de sesión eliminadas | console.warn |
| Edit + save exitoso | Usuario agrega imágenes nuevas, guarda | Imágenes preservadas | N/A |
| Abandon sin uploads | Usuario abre form, navega sin cambios | No cleanup triggered | N/A |
| Fallo parcial en cleanup | Algunos deletes fallan | Deletes exitosos proceden, fallos solo warn | console.warn por fallo |

</frozen-after-approval>

## Code Map

- `src/components/admin/BlogForm.svelte` -- inline images subidas ANTES de save (uploadedImages), cover durante save
- `src/components/admin/ProjectForm.svelte` -- imágenes subidas DURANTE save (handleCreateSubmit/handleEditSubmit)
- `src/components/admin/TechnologyForm.svelte` -- imagen subida DURANTE save
- `src/lib/firebase/image-service.ts` -- delete(StoredImage) y deleteByPrefix(path) methods
- `src/lib/firebase/image-slot-processor.ts` -- processImageSlot, cleanupDeletedImages utilities
- `src/components/admin/__tests__/` -- directorio de tests existentes

## Tasks & Acceptance

**Execution:**
- [x] `src/lib/firebase/orphan-cleanup.ts` -- Crear utility compartida: `cleanupOrphanedImages(images: StoredImage[])` que itera y llama imageService.delete con .catch y console.warn por imagen
- [x] `src/components/admin/BlogForm.svelte` -- Agregar savedSuccessfully flag + sessionInlineImages[] (separado de uploadedImages, solo acumula en handleImageUploaded) + sessionCoverImage tracker. Resetear los 3 trackers en el bloque de re-inicialización edit mode. Set flag=true después del save final. En $effect cleanup: si !savedSuccessfully, llamar cleanupOrphanedImages con sessionInlineImages + sessionCoverImage
- [x] `src/components/admin/ProjectForm.svelte` -- Agregar savedSuccessfully flag + sessionUploadedImages[]. Resetear ambos en el bloque de re-inicialización edit mode. Push después de cada upload en create/edit submit. Limpiar sessionUploadedImages en catch/rollback de create. Set flag=true después del save. En $effect cleanup: si !savedSuccessfully, llamar cleanupOrphanedImages
- [x] `src/components/admin/TechnologyForm.svelte` -- Agregar savedSuccessfully flag + sessionUploadedImage tracker. Resetear ambos en el bloque de re-inicialización edit mode. Set después de upload en create/edit submit. Limpiar sessionUploadedImage en catch/rollback de create. Set flag=true después del save. En $effect cleanup: si !savedSuccessfully, llamar cleanupOrphanedImages
- [x] `src/lib/firebase/__tests__/orphan-cleanup.test.ts` -- Unit tests: cleanup invoca delete cuando hay imágenes, no invoca cuando array vacío, fallo parcial logea warning sin throw
- [x] E2E test -- Verificar que happy path de save funciona correctamente sin que cleanup interfiera

**Acceptance Criteria:**
- Given usuario sube imágenes y abandona el form, when el componente se desmonta, then las imágenes subidas se eliminan de Storage
- Given usuario sube imágenes y guarda exitosamente, when el componente se desmonta, then las imágenes permanecen en Storage
- Given cleanup falla para algunas imágenes, when componente se desmonta, then fallos se logean como warnings sin bloquear ni crashear
- Given form en edit mode con imágenes existentes, when usuario abandona sin cambios, then ninguna imagen se elimina

## Design Notes

BlogForm es único: las inline images se suben INMEDIATAMENTE al insertarlas. IMPORTANTE: `uploadedImages` incluye imágenes pre-existentes en edit mode (se carga desde initialData.images). Se DEBE usar un array separado `sessionInlineImages` que solo acumule en handleImageUploaded. El cover se sube durante save via `processImageSlot`.

ProjectForm y TechnologyForm suben imágenes solo DURANTE el proceso de save. Su rollback existente llama `deleteByPrefix` en create mode. Para evitar double-delete, limpiar los session trackers en los bloques catch/rollback.

Los 3 forms pueden ser reutilizados sin remontar (edit mode re-init con initializedId/initializedForId guard). Todos los session trackers DEBEN resetearse en esos bloques de re-inicialización.

La utility compartida `cleanupOrphanedImages` centraliza el patrón delete-with-warn, manteniendo el cleanup code en los forms minimal.

## Verification

**Commands:**
- `npm run test -- orphan-cleanup` -- expected: todos los unit tests pasan
- `npm run build` -- expected: sin errores de tipos
- `npx playwright test` -- expected: E2E tests pasan incluyendo happy path

## Spec Change Log

### Iteration 1 (review loopback)
**Trigger:** Adversarial review found 2 bad_spec issues:
1. CRITICAL — BlogForm cleanup used `uploadedImages` which conflates pre-existing images (loaded from initialData.images in edit mode) with session-uploaded images. On edit-mode abandon, ALL existing images would be deleted. Violates AC #4.
2. MAJOR — Session tracking variables (`savedSuccessfully`, `sessionCoverImage`, etc.) are never reset in edit-mode re-initialization blocks. If component is reused for a different item without remounting, stale state persists.
3. MINOR (patch) — Create-mode rollback already calls deleteByPrefix, but session trackers retained references causing double-delete attempts on unmount.

**Amended:**
- BlogForm task: changed from using `uploadedImages` to a new `sessionInlineImages[]` that only accumulates in `handleImageUploaded`
- All 3 form tasks: added requirement to reset session trackers in edit-mode re-init blocks
- ProjectForm/TechnologyForm tasks: added requirement to clear session trackers in create rollback/catch blocks
- Design Notes: updated to document the uploadedImages conflation trap and re-init requirement

**Known-bad state avoided:** Deleting pre-existing blog post images when user opens edit form and navigates away

**KEEP:**
- `cleanupOrphanedImages` utility is correct and well-tested — preserve as-is
- `savedSuccessfully` flag pattern is correct (plain `let`, not `$state` needed — JS closures capture by reference)
- `sessionCoverImage` single-value tracker for BlogForm is correct (covers only upload during save)
- E2E test and unit tests are correct — preserve as-is
