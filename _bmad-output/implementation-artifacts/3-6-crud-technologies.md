# Story 3.6: CRUD Technologies

Status: review

## Story

As Christopher (admin),
I want to manage my technology skills with icons,
So that visitors see an accurate representation of my technical expertise.

## Acceptance Criteria

1. **Given** admin Technologies page **When** loaded **Then** list shows all technologies with icon, name, experience years, action buttons
2. **And** empty list shows empty state with CTA "Crear la primera"
3. **And** create form: name (text), image (ImageUploader), experienceYears (number)
4. **And** saving stores to Firestore, uploads image, toast confirmation
5. **And** editing pre-populates form, image shows existing state
6. **And** deleting via ConfirmDialog removes technology + image from Storage, toast confirmation
**(FR23, FR24, FR25, FR26)**

## Tasks / Subtasks

- [x] Task 1: Extend technology schema for form validation (AC: #3)
  - [x] 1.1 Add `technologyFormSchema` to `technology-schema.ts`: `technologySchema.omit({ id: true, image: true })` — validates name + experienceYears only (image handled via ImageSlot)
  - [x] 1.2 Add `TechnologyFirestoreData` type: `z.infer<typeof technologyFirestoreSchema>`
  - [x] 1.3 Add `TechnologyWithId` type: `TechnologyFirestoreData & { id: string }`
  - [x] 1.4 Export all new types

- [x] Task 2: TechnologyList component (AC: #1, #2)
  - [x] 2.1 Create `TechnologyList.svelte` following `ProjectList.svelte` pattern exactly
  - [x] 2.2 Props: `onCreateNew`, `onEdit?: (tech: TechnologyWithId) => void`, `onDelete?: (tech: TechnologyWithId) => void`
  - [x] 2.3 Load technologies: `query(collection(db, TECHNOLOGIES_COLLECTION), orderBy('name'))` + `technologyFirestoreSchema.safeParse()`
  - [x] 2.4 Export `loadTechnologies()` method for parent to call after mutations
  - [x] 2.5 List item layout: icon (32x32 `object-contain rounded`), name, experience years badge ("N años"), edit + delete buttons
  - [x] 2.6 Skeleton loading: 4 rows with `motion-safe:animate-pulse`
  - [x] 2.7 Error state: red-tinted box with error message
  - [x] 2.8 Empty state: icon + "No hay tecnologías aún" + "Crear la primera" CTA link

- [x] Task 3: TechnologyForm component (AC: #3, #4, #5)
  - [x] 3.1 Create `TechnologyForm.svelte` — simpler than ProjectForm (no bilingual fields, no screenshots, no slug, no URLs)
  - [x] 3.2 Props: `mode?: 'create' | 'edit'` (default `'create'`), `initialData?: TechnologyWithId | null`, `onCancel: () => void`, `onSaved: () => void`
  - [x] 3.3 Form state: `name = $state('')`, `experienceYears = $state(0)`, `imageSlot = $state<ImageSlot>({ type: 'empty' })`, `errors = $state<Record<string, string>>({})`, `saving = $state(false)`, `hasChanges = $state(false)`
  - [x] 3.4 Edit mode initialization via `$effect` with `initialized` flag guard (same pattern as ProjectForm — see Init Pattern below)
  - [x] 3.5 Validation: `validateField(field)` on blur + `validateAll()` on submit + `scrollToFirstError()` after failed validation (same pattern as ProjectForm: `document.querySelector('[role="alert"]')?.scrollIntoView({ behavior: 'smooth', block: 'center' })`)
    - `name`: required, min 1 char
    - `experienceYears`: required, integer ≥ 0 (reject negative, decimal, empty)
    - `imageSlot`: reject `empty` and `removed` types (image is required)
  - [x] 3.6 Create submit handler:
    1. Validate → build form data → `addDoc()` → get docId
    2. Upload image to `technologies/${docId}/` via `imageService.upload()`
    3. `updateDoc()` with image reference
    4. Toast success → call `onSaved()`
    5. On failure: clean up created doc if image upload fails, toast error
  - [x] 3.7 Edit submit handler:
    1. Validate → `processImageSlot(imageSlot, `technologies/${docId}/`)`
    2. Build payload: `{ name, experienceYears, image: processed.image }`
    3. `updateDoc()` with payload
    4. `cleanupDeletedImages(processed.toDelete)` after update succeeds
    5. Toast success → call `onSaved()`
    6. On failure: toast error, re-enable save button
  - [x] 3.8 Cancel handler with `window.confirm()` if `hasChanges` is true
  - [x] 3.9 `markDirty()` function called on every input change to track `hasChanges`
  - [x] 3.10 Derived save/saving button labels per mode (create: "Guardar tecnología" / "Guardando...", edit: "Guardar cambios" / "Guardando cambios...") — uses i18n keys `admin.technologies.form.save` / `admin.technologies.form.saving` / `admin.technologies.form.saveEdit` / `admin.technologies.form.savingEdit`

- [x] Task 4: TechnologiesCrudPage component (AC: all)
  - [x] 4.1 Create `TechnologiesCrudPage.svelte` following `ProjectsCrudPage.svelte` pattern exactly
  - [x] 4.2 State: `viewMode: 'list' | 'create' | 'edit'`, `editingTech: TechnologyWithId | null`, `deletingTech: TechnologyWithId | null`, `showDeleteDialog: boolean`, `deleting: boolean`
  - [x] 4.3 Delete flow: `handleDeleteRequest()` → `ConfirmDialog` → `handleConfirmDelete()`:
    1. `imageService.delete(deletingTech.image)` — single image, NOT `deleteByPrefix` (technology has exactly 1 image)
    2. `deleteDoc(doc(db, TECHNOLOGIES_COLLECTION, techId))`
    3. Toast success, close dialog, refresh list
  - [x] 4.4 Delete dialog message: "¿Eliminar '{name}'? Se eliminará también su imagen de Storage."
  - [x] 4.5 Back-to-list button above form title (same pattern as ProjectsCrudPage)
  - [x] 4.6 `getFirestoreErrorMessage()` with duck-typed code mapping (same pattern as ProjectsCrudPage)

- [x] Task 5: Wire technologies.astro page (AC: #1)
  - [x] 5.1 Replace placeholder content in `src/pages/admin/technologies.astro` with `TechnologiesCrudPage client:only="svelte"`
  - [x] 5.2 Keep `AdminLayout` + `AuthGuard` wrapper (already in place)

- [x] Task 6: i18n keys (AC: all)
  - [x] 6.1 Add keys to `translations.ts`:
    - `admin.technologies.title`: "Tecnologías" / "Technologies"
    - `admin.technologies.createTitle`: "Crear tecnología" / "Create technology"
    - `admin.technologies.editTitle`: "Editar tecnología" / "Edit technology"
    - `admin.technologies.createNew`: "Crear nueva" / "Create new"
    - `admin.technologies.empty`: "No hay tecnologías aún" / "No technologies yet"
    - `admin.technologies.emptyCta`: "Crear la primera" / "Create the first one"
    - `admin.technologies.loading`: "Cargando tecnologías..." / "Loading technologies..."
    - `admin.technologies.errorLoading`: "Error al cargar tecnologías" / "Error loading technologies"
    - `admin.technologies.edit`: "Editar" / "Edit"
    - `admin.technologies.delete`: "Eliminar" / "Delete"
    - `admin.technologies.form.name`: "Nombre" / "Name"
    - `admin.technologies.form.experienceYears`: "Años de experiencia" / "Years of experience"
    - `admin.technologies.form.image`: "Icono / Imagen" / "Icon / Image"
    - `admin.technologies.form.save`: "Guardar tecnología" / "Save technology"
    - `admin.technologies.form.saving`: "Guardando..." / "Saving..."
    - `admin.technologies.form.saveEdit`: "Guardar cambios" / "Save changes"
    - `admin.technologies.form.savingEdit`: "Guardando cambios..." / "Saving changes..."
    - `admin.technologies.createSuccessToast`: "Tecnología guardada exitosamente" / "Technology saved successfully"
    - `admin.technologies.editSuccessToast`: "Tecnología guardada exitosamente" / "Technology saved successfully"
    - `admin.technologies.createErrorToast`: "Error al guardar la tecnología" / "Error saving technology"
    - `admin.technologies.deleteConfirmTitle`: "Eliminar tecnología" / "Delete technology"
    - `admin.technologies.deleteConfirmMessage`: "¿Eliminar '{name}'? Se eliminará también su imagen de Storage." / "Delete '{name}'? Its image will also be removed from Storage."
    - `admin.technologies.deleteConfirmButton`: "Eliminar" / "Delete"
    - `admin.technologies.deleteSuccessToast`: "Tecnología eliminada exitosamente" / "Technology deleted successfully"
    - `admin.technologies.deleteErrorToast`: "Error al eliminar la tecnología" / "Error deleting technology"
    - `admin.technologies.form.experienceYearsUnit`: "años" / "years" (for list badge display)
    - `admin.technologies.form.discardChanges`: "¿Descartar los cambios sin guardar?" / "Discard unsaved changes?"
    - `admin.validation.numberRequired`: "Introduce un número válido" / "Enter a valid number"
    - `admin.validation.numberNonNegative`: "El valor debe ser mayor o igual a 0" / "Value must be 0 or greater"

- [x] Task 7: Unit tests (AC: all)
  - [x] 7.1 Tests for TechnologyList: loading skeleton, error state, empty state with CTA, renders tech list with icon/name/years, calls onEdit/onDelete callbacks
  - [x] 7.2 Tests for TechnologyForm: validates required name, validates experienceYears (non-negative integer), validates image required, rejects removed image in edit mode, create submit flow (addDoc → upload → updateDoc order), edit submit flow (processImageSlot → updateDoc → cleanup order), cancel with unsaved changes shows confirm
  - [x] 7.3 Tests for TechnologiesCrudPage: view mode transitions (list → create → list, list → edit → list), delete flow (delete dialog → confirm → imageService.delete + deleteDoc order), FirebaseError code mapping

## Dev Notes

### Critical Architecture Constraints

- **Framework**: Astro 6 + Svelte 5. All interactive admin components are Svelte 5 islands
- **Svelte 5 Runes ONLY**: Use `$state`, `$derived`, `$effect`, `$props()`. NEVER use Svelte 4 syntax
- **`client:only="svelte"` is MANDATORY** for ALL admin Svelte components — Firebase requires `window`, SSR will crash
- **No API routes** — CRUD uses Firebase client SDK directly (`addDoc`, `updateDoc`, `deleteDoc`, `getDocs`)
- **Zod schemas are source of truth** — types derived via `z.infer<>`, never manual interfaces
- **`prefers-reduced-motion: reduce`** — ALL auto-play animations MUST use `motion-safe:` prefix

### Technology Data Model

```typescript
// technology-schema.ts — Firestore collection: "Technologies"
{
  name: string,           // NOT bilingual (tech names are universal)
  image: StoredImage,     // { url: string, storagePath: string }
  experienceYears: number // Non-negative integer — UI formats "N años" / "N years"
}
```

**Key difference from Projects**: No bilingual fields, no screenshots, no slug, no URLs. Single image only. This is the simplest CRUD entity with image management.

### Existing Code to Reuse (DO NOT Reinvent)

| What | Path | Usage in This Story |
|------|------|---------------------|
| ProjectsCrudPage | `src/components/admin/ProjectsCrudPage.svelte` | COPY PATTERN: view mode, delete flow, back-to-list, error mapping |
| ProjectList | `src/components/admin/ProjectList.svelte` | COPY PATTERN: load/parse/display, skeleton, empty, error states |
| ProjectForm | `src/components/admin/ProjectForm.svelte` | COPY PATTERN: create/edit handlers, ImageSlot processing, validation |
| ImageUploader | `src/components/admin/ImageUploader.svelte` | REUSE AS-IS: handles all 5 ImageSlot states with badges |
| ConfirmDialog | `src/components/admin/ConfirmDialog.svelte` | REUSE AS-IS: delete confirmation modal |
| Toast | `src/components/admin/Toast.svelte` | REUSE AS-IS: success/error notifications |
| ImageSlotProcessor | `src/lib/firebase/image-slot-processor.ts` | USE: `processImageSlot()` for edit, `cleanupDeletedImages()` post-save |
| ImageService | `src/lib/firebase/image-service.ts` | USE: `imageService.upload()` for create, `imageService.delete()` for delete |
| Technology schema | `src/lib/schemas/technology-schema.ts` | EXTEND: add `technologyFormSchema`, `TechnologyWithId` type |
| StoredImage schema | `src/lib/schemas/shared-schemas.ts` | `storedImageSchema`, `StoredImage` type — already imported by technology-schema |
| Toast store | `src/lib/utils/toast-store.svelte.ts` | `toastStore.success()`, `toastStore.error()` |
| i18n | `src/lib/i18n/translations.ts` | `t(key, 'es')` — add new keys for technologies |
| Test factory | `src/test/factories/technology.ts` | `createTechnology()` — already exists |
| TechnologySelector | `src/components/admin/TechnologySelector.svelte` | REFERENCE: demonstrates the exact Firestore query pattern for technologies |

**Import paths are relative** — from `src/components/admin/TechnologyForm.svelte`:
```typescript
import { processImageSlot, cleanupDeletedImages } from '../../lib/firebase/image-slot-processor';
import { imageService } from '../../lib/firebase/image-service';
import { collection, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase/client';
import { technologyFormSchema } from '../../lib/schemas/technology-schema';
import type { TechnologyWithId } from '../../lib/schemas/technology-schema';
import type { ImageSlot } from '../../lib/schemas/image-slot';
import { t } from '../../lib/i18n/translations';
import { toastStore } from '../../lib/utils/toast-store.svelte';
import ImageUploader from './ImageUploader.svelte';
```

**Import paths** — from `src/components/admin/TechnologyList.svelte`:
```typescript
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase/client';
import { technologyFirestoreSchema } from '../../lib/schemas/technology-schema';
import type { TechnologyWithId } from '../../lib/schemas/technology-schema';
import { t } from '../../lib/i18n/translations';
```

### Schema Extension Pattern

Add to `src/lib/schemas/technology-schema.ts`:

```typescript
/** For form validation — excludes id and image (handled by ImageSlot) */
export const technologyFormSchema = technologySchema.omit({
  id: true,
  image: true,
});

export type TechnologyFirestoreData = z.infer<typeof technologyFirestoreSchema>;
export type TechnologyWithId = TechnologyFirestoreData & { id: string };
```

### Edit Form — Initialization Pattern

Same pattern as ProjectForm. Use `$effect` with `initialized` flag guard:

```typescript
let initialized = $state(false);

$effect(() => {
  if (mode === 'edit' && initialData && !initialized) {
    initialized = true;
    name = initialData.name;
    experienceYears = initialData.experienceYears;
    imageSlot = { type: 'existing', image: initialData.image };
    hasChanges = false;
  }
});
```

**CRITICAL**: Track `initialData.id` in the initialized flag — if user edits tech A then tech B without component destruction, re-initialize:

```typescript
let initializedId = $state('');

$effect(() => {
  if (mode === 'edit' && initialData && initializedId !== initialData.id) {
    initializedId = initialData.id;
    // ... populate fields
  }
});
```

### Create Submit — Document-First Pattern

Technologies follow the same create pattern as Projects — create doc first, then upload image:

```typescript
async function handleCreateSubmit(): Promise<void> {
  if (!validateAll()) return;
  saving = true;
  try {
    const formData = { name: name.trim(), experienceYears };
    const docRef = await addDoc(collection(db, TECHNOLOGIES_COLLECTION), formData);
    const docId = docRef.id;

    if (imageSlot.type === 'new') {
      const imagePath = `technologies/${docId}/${crypto.randomUUID()}.webp`;
      const storedImage = await imageService.upload(imageSlot.file, imagePath);
      await updateDoc(doc(db, TECHNOLOGIES_COLLECTION, docId), { image: storedImage });
    }

    toastStore.success(t('admin.technologies.createSuccessToast', locale));
    onSaved();
  } catch (error) {
    console.error('Failed to create technology:', error);
    toastStore.error(t('admin.technologies.createErrorToast', locale));
  } finally {
    saving = false;
  }
}
```

### Edit Submit — processImageSlot Pattern

```typescript
async function handleEditSubmit(): Promise<void> {
  if (!initialData) return;
  const docId = initialData.id;
  if (!validateAll()) return;
  saving = true;
  try {
    const processed = await processImageSlot(imageSlot, `technologies/${docId}/`);
    const payload = {
      name: name.trim(),
      experienceYears,
      ...(processed.image && { image: processed.image }),
    };

    await updateDoc(doc(db, TECHNOLOGIES_COLLECTION, docId), payload);

    if (processed.toDelete.length > 0) {
      await cleanupDeletedImages(processed.toDelete);
    }

    toastStore.success(t('admin.technologies.editSuccessToast', locale));
    onSaved();
  } catch (error) {
    console.error('Failed to update technology:', error);
    toastStore.error(t('admin.technologies.createErrorToast', locale));
  } finally {
    saving = false;
  }
}
```

### Delete Flow — Single Image Delete

Technologies have exactly 1 image (not a prefix with multiple files like projects). Use `imageService.delete()` instead of `deleteByPrefix()`:

```typescript
async function handleConfirmDelete(): Promise<void> {
  if (!deletingTech) return;
  deleting = true;
  try {
    await imageService.delete(deletingTech.image);
    await deleteDoc(doc(db, TECHNOLOGIES_COLLECTION, deletingTech.id));
    toastStore.success(t('admin.technologies.deleteSuccessToast', locale));
    showDeleteDialog = false;
    deletingTech = null;
    listRef?.loadTechnologies();
  } catch (error) {
    console.error('Failed to delete technology:', error);
    toastStore.error(getFirestoreErrorMessage(error));
    showDeleteDialog = false;
    deletingTech = null;
  } finally {
    deleting = false;
  }
}
```

**Why `imageService.delete()` instead of `deleteByPrefix()`**: Each technology stores exactly one image. `deleteByPrefix()` would work but adds unnecessary overhead (listing all objects under prefix, then deleting). Direct `delete(image)` is cleaner and faster.

### Delete Dialog Message

Technologies have exactly 1 image, so the message is simpler than projects:

```typescript
let deleteDialogMessage = $derived.by(() => {
  if (!deletingTech) return '';
  return t('admin.technologies.deleteConfirmMessage', locale)
    .replace('{name}', deletingTech.name);
});
```

### TechnologyList — Item Layout

```
┌─────────────────────────────────────────────────────────┐
│ [icon 32x32]  Astro        3 años    [Editar] [Eliminar]│
│ [icon 32x32]  TypeScript   5 años    [Editar] [Eliminar]│
│ [icon 32x32]  React        4 años    [Editar] [Eliminar]│
└─────────────────────────────────────────────────────────┘
```

- Icon: `w-8 h-8 object-contain rounded` (smaller than project thumbnails since these are logos/icons)
- Name: `font-semibold text-text-primary truncate`
- Experience: `text-sm text-text-muted` badge showing "N años"
- OrderBy: `'name'` (alphabetical)

### TechnologyForm — Layout

```
┌─────────────────────────────────────────┐
│ ← Tecnologías                           │
│ Crear tecnología / Editar tecnología    │
├─────────────────────────────────────────┤
│ Nombre *                                │
│ ┌─────────────────────────────────────┐ │
│ │ [text input]                        │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ Años de experiencia *                   │
│ ┌───────────┐                           │
│ │ [number]  │                           │
│ └───────────┘                           │
│                                         │
│ Icono / Imagen *                        │
│ ┌───────────────────┐                   │
│ │ [ImageUploader]   │                   │
│ └───────────────────┘                   │
│                                         │
│       [Cancelar]  [Guardar tecnología]  │
└─────────────────────────────────────────┘
```

- No bilingual fields (BilingualField NOT used)
- No ScreenshotManager (single image only via ImageUploader)
- No slug field, no URL fields
- `max-w-lg` form width (narrower than projects since fewer fields)

### Validation Rules

| Field | Rule | Error Message |
|-------|------|---------------|
| name | Required, min 1 char after trim | `admin.validation.required` |
| experienceYears | Required, integer ≥ 0 | `admin.validation.numberRequired` / `admin.validation.numberNonNegative` |
| image | Required (reject `empty` and `removed`) | `admin.validation.imageRequired` |

Validation on blur per field + full validation on submit (same pattern as ProjectForm).

### ExperienceYears Input

Use `<input type="number" min="0" step="1">` with manual validation:

```typescript
function validateExperienceYears(): boolean {
  if (isNaN(experienceYears) || experienceYears < 0) {
    errors.experienceYears = t('admin.validation.numberNonNegative', locale);
    return false;
  }
  if (!Number.isInteger(experienceYears)) {
    errors.experienceYears = t('admin.validation.numberRequired', locale);
    return false;
  }
  errors.experienceYears = '';
  return true;
}
```

### Data Integrity Note: Project References

Projects reference technologies by ID array (`technologies: string[]`). Deleting a technology does NOT cascade-update projects. This is by design:
- The public site filters out missing technology references gracefully
- TechnologySelector in ProjectForm loads available technologies dynamically
- No blocking constraint needed — Christopher can re-assign technologies when editing projects

### Responsive Design

- **Mobile (<450px)**: Form fields full-width, list items stack vertically (icon + name above, buttons below)
- **Tablet (450-900px)**: Form centered, list items horizontal
- **Desktop (≥900px)**: Form max-w-lg centered, list items horizontal with all elements visible
- Breakpoints: `sm:` = 450px, `lg:` = 900px

### Admin Locale

Admin UI locale is fixed `'es'` — call `t(key, 'es')` for all UI strings.

### Error Handling

- `getFirestoreErrorMessage()` with duck-typed code mapping: `permission-denied`, `not-found`, `unavailable`
- Toast for all operation results (success/error)
- Console.error for debugging, never expose raw errors to user
- On create failure after addDoc but before image upload: orphaned empty doc (minor — can be cleaned manually)

### Testing Requirements

- **Test naming**: `[P0] 3.6-TEST-NNN: description` for acceptance criteria, `[P1]` for edge cases
- **Mock pattern**: `vi.hoisted()` + `vi.mock('firebase/firestore', ...)` for Firestore mocks
- **Test factories**: Use `createTechnology()` from `src/test/factories/technology.ts`
- **Co-located tests**: `src/components/admin/__tests__/technology-*.test.ts`
- **Minimum tests**: TechnologyList (load, empty, error), TechnologyForm (validation, create flow, edit flow), TechnologiesCrudPage (view modes, delete flow)

**WARNING**: NEVER import from `collections.ts` in Svelte islands — Admin SDK side-effects crash in browser. Use string constant `'Technologies'` directly in components.

### Project Structure Notes

New files to create:
```
src/components/admin/
├── TechnologiesCrudPage.svelte     # Main CRUD orchestrator
├── TechnologyList.svelte           # List with load/empty/error states
├── TechnologyForm.svelte           # Create/edit form
├── __tests__/
│   ├── technology-list.test.ts     # TechnologyList tests
│   ├── technology-form.test.ts     # TechnologyForm tests
│   └── technology-crud.test.ts     # TechnologiesCrudPage tests
```

Files to modify:
```
src/lib/schemas/technology-schema.ts    # Add technologyFormSchema, TechnologyWithId
src/pages/admin/technologies.astro      # Replace placeholder with TechnologiesCrudPage
src/lib/i18n/translations.ts           # Add admin.technologies.* keys
```

### Previous Story Intelligence

**From Story 3.5 (CRUD Projects — Edit y Delete):**
- `$effect` init with `initialized` flag guard — prevents infinite re-render loop. MUST track `initialData.id` for re-initialization when switching between items (CR-P-3 fix)
- `processImageSlot()` + `cleanupDeletedImages()` — the correct pattern for edit mode image handling
- `getFirestoreErrorMessage()` with duck-typed `code` property — reuse exact same pattern
- ConfirmDialog is reusable as-is — just pass different title/message/callbacks
- Delete flow order: delete image(s) first → delete Firestore document → toast → refresh list
- `ImageUploader` already handles all 5 ImageSlot states with visual badges (existing=blue, new=green, replaced=orange)
- `saving` flag must be reset on success path before toast (CR-P-2 fix from story 3.5)
- ConfirmDialog Escape/backdrop blocked during `confirming` state (CR-P-1 fix)
- Back-to-list button improves navigation UX — include in TechnologiesCrudPage

**From Story 3.4 (CRUD Projects — List y Create):**
- Document-first create pattern: `addDoc()` → upload image → `updateDoc()` with image reference
- `buildFormData()` returns non-image fields for the Firestore payload
- Toast store handles success/error with auto-dismiss/persist behavior
- ProjectList `loadProjects()` is exported for parent refresh — do the same with `loadTechnologies()`

**From Story 3.3 (ImageService):**
- `imageService.upload(file, path)` returns `StoredImage { url, storagePath }`
- `imageService.delete(image)` deletes by `image.storagePath` — use for single technology image delete
- `imageService.deleteByPrefix(prefix)` — NOT needed for technologies (single image)
- Storage path pattern: `technologies/{technologyId}/{uuid}.webp`

**Code Review Intelligence (Story 3.5):**
- BS-1: ImageUploader `handleFile()` produces `replaced` state for existing images, `removeImage()` produces `removed` state — these transitions are correct and handled automatically
- BS-2: Visual status badges already in ImageUploader — no additional work needed
- P-4: `getFirestoreErrorMessage()` is copy-paste ready from ProjectsCrudPage
- Initialization pattern must track `initialData.id`, not just boolean flag

### Git Intelligence

Recent commits follow pattern: `docs: create story X.Y` → `feat: implement story X.Y` → `fix: validate/code-review patches`

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (1M context)

### Completion Notes List

- Task 1: Extended technology-schema.ts with `technologyFormSchema`, `TechnologyFirestoreData`, `TechnologyWithId` types
- Task 2: Created TechnologyList.svelte with load/empty/error/skeleton states, exported `loadTechnologies()`, ordered by name
- Task 3: Created TechnologyForm.svelte with create/edit modes, ImageSlot validation, `$effect` init with `initializedId` guard, `scrollToFirstError()`, cancel confirmation, derived labels
- Task 4: Created TechnologiesCrudPage.svelte with view mode orchestration, delete flow using `imageService.delete()` (single image), ConfirmDialog, `getFirestoreErrorMessage()`, back-to-list button
- Task 5: Replaced technologies.astro placeholder with `TechnologiesCrudPage client:only="svelte"`
- Task 6: Added 29 i18n keys to translations.ts including `discardChanges`, `numberRequired`, `numberNonNegative`
- Task 7: Created 46 unit tests across 3 test files — all passing, 0 regressions (742 total)
- All quality gates passed: 0 type errors, 0 lint errors, 742/742 tests green

### File List

New files:
- src/components/admin/TechnologiesCrudPage.svelte
- src/components/admin/TechnologyList.svelte
- src/components/admin/TechnologyForm.svelte
- src/components/admin/__tests__/technology-list.test.ts
- src/components/admin/__tests__/technology-form.test.ts
- src/components/admin/__tests__/technology-crud.test.ts

Modified files:
- src/lib/schemas/technology-schema.ts
- src/lib/i18n/translations.ts
- src/pages/admin/technologies.astro
