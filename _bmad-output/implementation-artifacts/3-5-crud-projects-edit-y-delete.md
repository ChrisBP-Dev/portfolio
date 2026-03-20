# Story 3.5: CRUD Projects — Edit y Delete

Status: ready-for-dev

## Story

As Christopher (admin),
I want to edit existing projects and delete them with full asset cleanup,
So that my portfolio stays current and Storage stays clean.

## Acceptance Criteria

1. **Given** I click edit on a project **When** form opens **Then** all fields pre-populated, images show as `existing` ImageSlot (blue "Subida" badge)
2. **And** replacing a screenshot shows orange "Reemplazará" badge. On save: new uploaded, Firestore updated, old deleted from Storage
3. **And** removing a screenshot shows red "Se eliminará" badge. On save: removed from array, deleted from Storage
4. **And** clicking delete shows ConfirmDialog: "¿Eliminar '[name]'? Se eliminarán también N imágenes de Storage." with Cancel + Delete (danger)
5. **And** confirming delete: all images deleted via `deleteByPrefix`, document deleted, toast confirmation, returns to list
6. **And** zero orphaned assets after any edit or delete operation

## Tasks / Subtasks

- [ ] Task 1: Extend ProjectsCrudPage for edit mode (AC: #1)
  - [ ] 1.1 Extend `viewMode` state: `'list' | 'create' | 'edit'`
  - [ ] 1.2 Add `editingProject` state: `$state<ProjectWithId | null>(null)`
  - [ ] 1.3 Wire `onEdit` callback from `ProjectList` → sets `editingProject` + switches to `'edit'` mode
  - [ ] 1.4 Render title conditionally: "Editar proyecto" for edit, "Crear proyecto" for create
  - [ ] 1.5 Pass `initialData` and `mode` props to `ProjectForm` when in edit mode

- [ ] Task 2: Extend ProjectForm for edit mode (AC: #1, #2, #3, #6)
  - [ ] 2.1 Add optional props: `initialData?: ProjectWithId`, `mode?: 'create' | 'edit'` (default `'create'`)
  - [ ] 2.2 Populate form state from `initialData` via `$effect` on mount:
    - Text fields: `companyNameEs = initialData.companyName.es`, etc.
    - Main image: `mainImageSlot = initialData.mainImage ? { type: 'existing', image: initialData.mainImage } : { type: 'empty' }`
    - Screenshots: `screenshots = (initialData.screenshots ?? []).map(img => ({ type: 'existing' as const, image: img }))`
    - Technologies, URLs, slug from initialData
    - Set `manualSlug = true` in edit mode (slug already established)
  - [ ] 2.3 On edit mode mainImage validation: accept `existing`, `new`, `replaced` (only `empty` and `removed` fail)
  - [ ] 2.4 Implement edit submit handler using `processImageSlot` + `cleanupDeletedImages`:
    1. Validate all fields with Zod `projectFormSchema`
    2. Disable button, show "Guardando..." + spinner
    3. Process main image via `processImageSlot(mainImageSlot, 'projects/{docId}/main/')`
    4. Process each screenshot via `processImageSlot(slot, 'projects/{docId}/screenshots/')`
    5. Build update payload from `buildFormData()` + processed images
    6. `updateDoc(doc(db, PROJECTS_COLLECTION, docId), payload)`
    7. `cleanupDeletedImages(allDeletePaths)` — safe-last order
    8. Show success toast "Proyecto guardado exitosamente"
    9. Return to list view after ~1.5s delay
    10. On failure: show error toast, re-enable button
  - [ ] 2.5 Refactor `handleSubmit` to branch on `mode === 'edit'` vs `mode === 'create'`, keeping current create logic intact

- [ ] Task 3: ConfirmDialog component (AC: #4, #5)
  - [ ] 3.1 Create `ConfirmDialog.svelte` — reusable modal for destructive confirmations
  - [ ] 3.2 Props: `open`, `title`, `message`, `confirmLabel`, `cancelLabel`, `confirming` (loading state), `onConfirm`, `onCancel`
  - [ ] 3.3 Visual: centered overlay (`bg-black/50`), surface card, title + message + impact text, Cancel (secondary) left + Confirm (danger red) right
  - [ ] 3.4 Danger button: `bg-error text-white hover:bg-error/90`, disabled + spinner while `confirming`
  - [ ] 3.5 Keyboard: Escape closes, focus trap (tab cycles within dialog), auto-focus Cancel button on open
  - [ ] 3.6 Accessibility: `role="alertdialog"`, `aria-modal="true"`, `aria-labelledby` title, `aria-describedby` message
  - [ ] 3.7 Body scroll lock: `document.body.style.overflow = 'hidden'` in `$effect` with cleanup
  - [ ] 3.8 `prefers-reduced-motion: reduce` — disable backdrop/entry animations

- [ ] Task 4: Wire delete in ProjectList (AC: #4, #5, #6)
  - [ ] 4.1 Add `onDelete` callback prop to `ProjectList`
  - [ ] 4.2 Enable delete button (remove `disabled` attr and muted styling)
  - [ ] 4.3 Delete button: danger styling `text-error border-error/30 hover:bg-error/10 hover:border-error`
  - [ ] 4.4 Wire button click to call `onDelete(project)`

- [ ] Task 5: Delete flow in ProjectsCrudPage (AC: #4, #5, #6)
  - [ ] 5.1 Add `deletingProject` state and `showDeleteDialog` state
  - [ ] 5.2 Wire `onDelete` from `ProjectList` → sets `deletingProject` + opens ConfirmDialog
  - [ ] 5.3 Compose ConfirmDialog message: "¿Eliminar '{name}'? Se eliminarán también {N} imágenes de Storage."
    - Count: 1 (mainImage if exists) + screenshots.length
  - [ ] 5.4 Implement `handleConfirmDelete`:
    1. Set `deleting = true` (confirming state on dialog)
    2. `imageService.deleteByPrefix(`projects/${projectId}/`)` — delete ALL storage files first
    3. `deleteDoc(doc(db, PROJECTS_COLLECTION, projectId))` — then remove document
    4. Close dialog, show success toast "Proyecto eliminado exitosamente"
    5. Call `listRef?.loadProjects()` to refresh list
    6. On failure: show error toast, close dialog, re-enable button

- [ ] Task 6: i18n keys for edit/delete (AC: all)
  - [ ] 6.1 Add keys to `translations.ts`:
    - `admin.projects.editTitle`: "Editar proyecto" / "Edit project"
    - `admin.projects.deleteConfirmTitle`: "Eliminar proyecto" / "Delete project"
    - `admin.projects.deleteConfirmMessage`: Template with name + image count
    - `admin.projects.deleteConfirmButton`: "Eliminar" / "Delete"
    - `admin.projects.deleteSuccessToast`: "Proyecto eliminado exitosamente" / "Project deleted successfully"
    - `admin.projects.deleteErrorToast`: "Error al eliminar el proyecto" / "Error deleting project"
    - `admin.confirm.cancel`: "Cancelar" / "Cancel"
    - `admin.confirm.deleting`: "Eliminando..." / "Deleting..."

- [ ] Task 7: Unit tests (AC: all)
  - [ ] 7.1 Tests for ConfirmDialog: open/close, Escape key, confirm callback, cancel callback, loading state, a11y attributes
  - [ ] 7.2 Tests for delete flow: image count calculation, deleteByPrefix + deleteDoc order
  - [ ] 7.3 Tests for edit form initialization: verify all fields populated from initialData
  - [ ] 7.4 Tests for edit submit: processImageSlot called for each slot, cleanupDeletedImages called after updateDoc

## Dev Notes

### Critical Architecture Constraints

- **Framework**: Astro 6 + Svelte 5 (NOT Next.js/React). All interactive admin components are Svelte 5 islands
- **Svelte 5 Runes ONLY**: Use `$state`, `$derived`, `$effect`, `$props()`. NEVER use Svelte 4 syntax (`export let`, `$:`, `onMount` from lifecycle)
- **`client:only="svelte"` is MANDATORY** for ALL admin Svelte components — Firebase requires `window`, SSR will crash
- **No API routes** — CRUD uses Firebase client SDK directly (`addDoc`, `updateDoc`, `deleteDoc`, `getDocs` from `firebase/firestore`)
- **Zod schemas are source of truth** — types derived via `z.infer<>`, never manual interfaces
- **`prefers-reduced-motion: reduce`** — ALL auto-play animations MUST use `motion-safe:` prefix. User-initiated transitions (hover, focus) are exempt

### Existing Code to Reuse (DO NOT Reinvent)

| What | Path | Usage in This Story |
|------|------|---------------------|
| ProjectsCrudPage | `src/components/admin/ProjectsCrudPage.svelte` | EXTEND: add `'edit'` to viewMode, add editingProject state |
| ProjectForm | `src/components/admin/ProjectForm.svelte` | EXTEND: add initialData/mode props, add edit submit handler |
| ProjectList | `src/components/admin/ProjectList.svelte` | EXTEND: enable delete button, add onDelete prop |
| ImageUploader | `src/components/admin/ImageUploader.svelte` | REUSE AS-IS: already handles `existing`/`replaced` ImageSlot states |
| ScreenshotManager | `src/components/admin/ScreenshotManager.svelte` | REUSE AS-IS: already handles `existing`/`removed`/`replaced` states |
| BilingualField | `src/components/admin/BilingualField.svelte` | REUSE AS-IS |
| BilingualArrayField | `src/components/admin/BilingualArrayField.svelte` | REUSE AS-IS |
| TechnologySelector | `src/components/admin/TechnologySelector.svelte` | REUSE AS-IS |
| Toast | `src/components/admin/Toast.svelte` | REUSE AS-IS |
| ImageSlotProcessor | `src/lib/firebase/image-slot-processor.ts` | USE: `processImageSlot()` for edit submit, `cleanupDeletedImages()` post-save |
| ImageService | `src/lib/firebase/image-service.ts` | USE: `deleteByPrefix()` for cascade delete on project delete |
| ImageSlot type | `src/lib/schemas/image-slot.ts` | 5-state discriminated union: `empty`, `existing`, `new`, `replaced`, `removed` |
| Project schemas | `src/lib/schemas/project-schema.ts` | `projectFormSchema` for validation, `projectFirestoreSchema` for parsing, `ProjectFirestoreData` type |
| StoredImage schema | `src/lib/schemas/shared-schemas.ts` | `storedImageSchema`, `StoredImage` type |
| Toast store | `src/lib/utils/toast-store.svelte.ts` | `toastStore.success()`, `toastStore.error()` |
| Slugify | `src/lib/utils/slugify.ts` | Reuse — no changes needed |
| i18n | `src/lib/i18n/translations.ts` | `t(key, 'es')` — add new keys for edit/delete |
| Test factories | `src/test/factories/` | `createProject()`, `createTechnology()` |

**Import paths are relative** — from `src/components/admin/ProjectForm.svelte`:
```typescript
import { processImageSlot, cleanupDeletedImages } from '../../lib/firebase/image-slot-processor';
import { imageService } from '../../lib/firebase/image-service';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
```

### Edit Form — Initialization Pattern

When entering edit mode, `ProjectsCrudPage` passes the existing `ProjectWithId` to `ProjectForm`. The form initializes from this data:

```typescript
// In ProjectForm — only run once on mount for edit mode
$effect(() => {
  if (mode === 'edit' && initialData) {
    companyNameEs = initialData.companyName.es;
    companyNameEn = initialData.companyName.en;
    shortDescriptionEs = initialData.shortDescription.es;
    shortDescriptionEn = initialData.shortDescription.en;
    featuresEs = [...(initialData.features?.es ?? [])];
    featuresEn = [...(initialData.features?.en ?? [])];
    mainImageSlot = initialData.mainImage
      ? { type: 'existing', image: initialData.mainImage }
      : { type: 'empty' };
    screenshots = (initialData.screenshots ?? []).map(img => ({
      type: 'existing' as const, image: img
    }));
    selectedTechnologies = [...(initialData.technologies ?? [])];
    websiteUrl = initialData.websiteUrl ?? '';
    sourceCodeUrl = initialData.sourceCodeUrl ?? '';
    slug = initialData.slug;
    manualSlug = true; // slug already established in edit mode
    hasChanges = false; // reset after population
  }
});
```

**CRITICAL**: Use `untrack()` or guard with a flag to prevent this `$effect` from re-running when form state changes. The initialization must only happen once.

### Edit Submit — Image Processing with processImageSlot

The edit submit handler MUST use `processImageSlot` and `cleanupDeletedImages` instead of raw `imageService.upload()`:

```typescript
// 1. Process main image
const mainProcessed = await processImageSlot(
  mainImageSlot,
  `projects/${docId}/main/`
);

// 2. Process each screenshot
const screenshotResults = await Promise.all(
  screenshots.map(slot =>
    processImageSlot(slot, `projects/${docId}/screenshots/`)
  )
);

// 3. Build update payload
const payload: Record<string, unknown> = {
  ...buildFormData(),
  mainImage: mainProcessed.image,
  screenshots: screenshotResults.map(r => r.image).filter(Boolean),
};

// 4. Update Firestore
await updateDoc(doc(db, PROJECTS_COLLECTION, docId), payload);

// 5. Cleanup deleted images AFTER document update succeeds
const allDeletePaths = [
  ...mainProcessed.toDelete,
  ...screenshotResults.flatMap(r => r.toDelete),
];
if (allDeletePaths.length > 0) {
  await cleanupDeletedImages(allDeletePaths);
}
```

**Order is critical**: Upload new → update document → delete old. If upload fails, nothing changed. If delete fails, document is correct (orphan is minor).

### Delete Flow — Cascade Delete Pattern

Delete must clean up ALL Storage assets before removing the Firestore document:

```typescript
async function handleConfirmDelete(): Promise<void> {
  deleting = true;
  try {
    // 1. Delete all images via prefix (recursive)
    await imageService.deleteByPrefix(`projects/${projectId}/`);

    // 2. Delete Firestore document
    await deleteDoc(doc(db, PROJECTS_COLLECTION, projectId));

    // 3. Success feedback
    toastStore.success(t('admin.projects.deleteSuccessToast', locale));
    showDeleteDialog = false;
    deletingProject = null;
    listRef?.loadProjects();
  } catch {
    toastStore.error(t('admin.projects.deleteErrorToast', locale));
  } finally {
    deleting = false;
  }
}
```

**`deleteByPrefix` is recursive** — handles `projects/{id}/main/*` AND `projects/{id}/screenshots/*` in one call. Uses `Promise.allSettled` internally so partial failures don't block.

### ConfirmDialog — Component Spec

```
┌───────── Overlay (bg-black/50) ─────────┐
│                                          │
│  ┌─── Card (surface, max-w-md) ───────┐ │
│  │ Title (text-lg font-bold)          │ │
│  │                                    │ │
│  │ Message text with impact info      │ │
│  │ (text-text-secondary)              │ │
│  │                                    │ │
│  │ ┌──────────┐  ┌──────────────────┐│ │
│  │ │ Cancelar │  │   Eliminar       ││ │
│  │ │(secondary│  │ (danger red)     ││ │
│  │ └──────────┘  └──────────────────┘│ │
│  └────────────────────────────────────┘ │
└──────────────────────────────────────────┘
```

- Focus trap: tab cycles between Cancel and Confirm buttons only
- On open: auto-focus Cancel button (safer default)
- Escape closes without confirming
- Click outside overlay closes without confirming
- Body scroll lock via `$effect` cleanup
- `role="alertdialog"` + `aria-modal="true"`

### Image State Badges (Already Implemented in ImageUploader/ScreenshotManager)

| State | Badge Color | Text | Action on Save |
|-------|-------------|------|----------------|
| `existing` | Blue (`primary`) | "Subida" | No-op — keep reference |
| `new` | Green (`success`) | "Nueva" | Upload file, save reference |
| `replaced` | Orange (`warning`) | "Reemplazará" | Upload new, update ref, delete old |
| `removed` | Red (`error`) | "Se eliminará" | Remove ref, delete from Storage |
| `empty` | — | — | No-op |

These badges are already implemented in ImageUploader and ScreenshotManager from story 3.4. No changes needed.

### Responsive Design

- **Mobile (<450px)**: ConfirmDialog full-width with side padding, bilingual fields as tabs, single column
- **Tablet (450-900px)**: ConfirmDialog centered max-w-md, bilingual fields may be side-by-side
- **Desktop (≥900px)**: ConfirmDialog centered max-w-md, form max-width 700px (already set)
- Breakpoints: `sm:` = 450px, `lg:` = 900px

### Admin Locale

- Admin UI locale is fixed `'es'` — call `t(key, 'es')` for all UI strings
- ConfirmDialog message uses project's `companyName.es` for the name

### Firebase Client SDK Patterns

```typescript
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase/client';

const PROJECTS_COLLECTION = 'Projects';

// UPDATE
await updateDoc(doc(db, PROJECTS_COLLECTION, projectId), payload);

// DELETE
await deleteDoc(doc(db, PROJECTS_COLLECTION, projectId));
```

**WARNING**: NEVER import from `collections.ts` in Svelte islands — Admin SDK side-effects crash in browser.

### Error Handling

- `instanceof FirebaseError` + code-based mapping for user-friendly messages
- Toast for all operation results (success/error)
- On delete failure: close dialog, show error toast — do not leave user in limbo
- On edit save failure: re-enable save button, show error toast
- Console.error for debugging, never expose to user

### Testing Requirements

- **Test naming**: `[P0] 3.5-TEST-NNN: description` for acceptance criteria, `[P1]` for edge cases
- **Mock pattern**: `vi.hoisted()` + `vi.mock('firebase/firestore', ...)` for Firestore mocks
- **Test factories**: Use `createProject()` from `src/test/factories/`
- **Co-located tests**: `src/components/admin/__tests__/confirm-dialog.test.ts`
- **Minimum tests**: ConfirmDialog a11y + interaction, delete flow order, edit form initialization

### Project Structure Notes

New files to create:
```
src/components/admin/
├── ConfirmDialog.svelte        # Reusable confirmation modal
├── __tests__/
│   └── confirm-dialog.test.ts  # ConfirmDialog tests
```

Files to modify:
```
src/components/admin/ProjectsCrudPage.svelte  # Add edit mode + delete flow
src/components/admin/ProjectForm.svelte       # Add initialData/mode props, edit submit
src/components/admin/ProjectList.svelte       # Enable delete button, add onDelete
src/lib/i18n/translations.ts                  # Add edit/delete i18n keys
```

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Epic3-Story3.5]
- [Source: _bmad-output/planning-artifacts/architecture.md#ImageSlotProcessor]
- [Source: _bmad-output/planning-artifacts/architecture.md#ImageService]
- [Source: _bmad-output/planning-artifacts/architecture.md#FirestoreCollections]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#UX-DR18-ConfirmDialog]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#UX-DR33-ImageStates]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#UX-DR32-CRUDPattern]
- [Source: _bmad-output/planning-artifacts/prd.md#FR20-FR21]
- [Source: _bmad-output/planning-artifacts/prd.md#FR38-FR41]

### Previous Story Intelligence

**From Story 3.4 (CRUD Projects — List y Create):**
- `ProjectForm.svelte` already imports `updateDoc`, `doc` from `firebase/firestore` — ready for edit
- `ProjectList` already has `onEdit` optional prop wired to edit buttons — just needs parent implementation
- Delete button is disabled with `title="Story 3.5"` — ready to enable
- `buildFormData()` returns non-image fields — reusable for edit payload base
- Submit handler creates doc first, then uploads images, then updates with references — edit needs different order
- `projectFirestoreSchema` (with optional images) was added in code review for safe parsing of `doc.data()`
- `hasChanges` tracking works for both create and edit — markDirty on any input change
- Toast store, validation logic, slug generation — all reusable without changes
- `ProjectWithId` type already defined in `ProjectList.svelte` — need to export or redefine in shared location

**From Story 3.3 (ImageService):**
- `processImageSlot()` handles all 5 ImageSlot states: empty→null, existing→keep, new→upload, replaced→upload+delete-old, removed→delete-old
- `cleanupDeletedImages()` uses `Promise.allSettled` — partial failures logged but don't propagate
- `deleteByPrefix()` recursively lists and deletes all objects under a prefix
- `withRetry()` wraps delete operations with 2 retries, 300ms exponential backoff
- Storage path pattern: `projects/{projectId}/main/{uuid}.webp`, `projects/{projectId}/screenshots/{uuid}.webp`

**From Story 3.2 (Dashboard/Sidebar):**
- Body scroll lock pattern: `$effect(() => { document.body.style.overflow = 'hidden'; return () => { document.body.style.overflow = ''; }; })`
- Never import from `collections.ts` in Svelte islands
- `prefers-reduced-motion: reduce` must wrap auto-play animations

**From Story 3.1 (Auth):**
- `client:only="svelte"` mandatory for all admin Svelte components
- Admin locale fixed to `'es'`
- Navigation uses `window.location.href` (no View Transitions in admin)

**Code Review Intelligence (Story 3.4):**
- P-1: `projectFirestoreSchema` was created to handle `doc.data()` without id — use it
- P-7/P-8: ObjectURL memory leaks — ensure new ConfirmDialog doesn't create any
- P-9: Unique keys for `{#each}` — ConfirmDialog is single instance, no issue
- P-12: WAI-ARIA patterns — ConfirmDialog needs `role="alertdialog"`, focus trap
- BS-1: Auto-play animation rule clarified — use `motion-safe:` only for auto-play, hover/focus exempt

### Git Intelligence

Recent commits show consistent patterns:
- `docs: create story X.Y` → `feat: implement story X.Y` → `fix: quality review patches` → `fix: code review patches`
- Code review patches catch: a11y issues, memory leaks, motion queries, validation gaps
- CI/CD now skips build/lighthouse/deploy for docs-only commits (story 3.4 debug fix)

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
