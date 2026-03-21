# Story 3.7: CRUD Experiences

Status: ready-for-dev

## Story

As Christopher (admin),
I want to manage my work experiences with bilingual details,
so that my professional history stays current.

## Acceptance Criteria

1. **Given** admin navigates to Experiences page, **When** loaded, **Then** list shows all experiences with company name, date range (formatted via `Intl.DateTimeFormat`), job title (current locale), and action buttons (Edit / Delete).
2. **Given** no experiences exist, **When** page loaded, **Then** empty state shows illustration + CTA "Crear la primera".
3. **Given** admin clicks "Crear nueva", **When** form shown, **Then** fields: `companyName` (text), `jobName` (BilingualField), `responsibilities` (BilingualArrayField — add/remove items per language), `startDate` (date input), `endDate` (date input, nullable — checkbox "Actualmente trabajando" sets endDate to null). All required fields marked with asterisk.
4. **Given** admin submits valid form, **When** saved, **Then** Firestore document created with `Timestamp.fromDate()` for dates, success toast shown, list refreshed.
5. **Given** admin edits an experience, **When** form opens, **Then** all fields pre-populated with current data, including bilingual arrays and dates. Checkbox "Actualmente trabajando" checked if `endDate === null`.
6. **Given** admin clicks delete, **When** ConfirmDialog confirmed, **Then** Firestore document deleted, success toast, list refreshed. **No image cleanup needed.**
7. **Given** endDate is set and is before startDate, **When** submitting, **Then** validation error shown: "La fecha de fin debe ser posterior a la de inicio".

## Tasks / Subtasks

- [ ] Task 1: Extend experience schema with form validation types (AC: #4)
  - [ ] 1.1 Add `experienceFormSchema` — omit `id`, keep `companyName`, `jobName`, `responsibilities`, `startDate`, `endDate` with `.refine()` for date range validation
  - [ ] 1.2 Add `ExperienceFirestoreData` type — omit `id` from base schema
  - [ ] 1.3 Add `ExperienceWithId` type — `ExperienceFirestoreData & { id: string }`
  - [ ] 1.4 Export all new types from `experience-schema.ts`

- [ ] Task 2: Create ExperienceList component (AC: #1, #2)
  - [ ] 2.1 Create `ExperienceList.svelte` with Props: `onCreateNew`, `onEdit`, `onDelete`
  - [ ] 2.2 State: `experiences: ExperienceWithId[]`, `loading`, `error` — same pattern as TechnologyList
  - [ ] 2.3 `$effect()` calls `loadExperiences()` on mount
  - [ ] 2.4 Export `loadExperiences()` for parent to call after save/delete
  - [ ] 2.5 Query: `getDocs(query(collection(db, 'Experiences'), orderBy('startDate', 'desc')))`
  - [ ] 2.6 Parse each doc via `experienceFirestoreSchema.safeParse()` with date conversion — filter nulls
  - [ ] 2.7 Loading state: 4 skeleton rows with `motion-safe:animate-pulse`
  - [ ] 2.8 Error state: red banner with error message
  - [ ] 2.9 Empty state: illustration SVG + CTA
  - [ ] 2.10 List item layout: company name (bold), job title (locale 'es'), date range (formatted), Edit + Delete buttons
  - [ ] 2.11 Date display: `new Intl.DateTimeFormat('es', { year: 'numeric', month: 'short' }).format(date)` — admin locale is always `'es'`. Show `t('admin.experiences.present', locale)` for null endDate

- [ ] Task 3: Create ExperienceForm component (AC: #3, #4, #5, #7)
  - [ ] 3.1 Create `ExperienceForm.svelte` with Props: `mode`, `initialData`, `onCancel`, `onSaved`
  - [ ] 3.2 Form state: `companyName`, `jobNameEs`, `jobNameEn`, `responsibilitiesEs: string[]`, `responsibilitiesEn: string[]`, `startDate: string` (HTML date input value), `endDate: string`, `currentlyWorking: boolean`
  - [ ] 3.3 Edit initialization via `$effect` with `initializedId` guard pattern (same as TechnologyForm)
  - [ ] 3.4 Date conversion: HTML `<input type="date">` gives `YYYY-MM-DD` string → `new Date(value)` for Zod, `Timestamp.fromDate()` for Firestore
  - [ ] 3.5 "Actualmente trabajando" checkbox: when checked, disable endDate input and set endDate to null on submit. When unchecked, require endDate.
  - [ ] 3.6 Use `BilingualField` for `jobName` (type="input")
  - [ ] 3.7 Use `BilingualArrayField` for `responsibilities`
  - [ ] 3.8 Validation on blur for all fields; `validateAll()` + `scrollToFirstError()` on submit
  - [ ] 3.9 Date range validation: if endDate provided and `endDate < startDate`, set error on endDate field
  - [ ] 3.10 Create submit: `addDoc(collection(db, 'Experiences'), payload)` — payload includes `Timestamp.fromDate()` for dates
  - [ ] 3.11 Edit submit: `updateDoc(doc(db, 'Experiences', id), payload)`
  - [ ] 3.12 `markDirty()` + `handleCancel()` with discard confirmation
  - [ ] 3.13 Save/cancel buttons with spinner + disabled state while saving
  - [ ] 3.14 Error mapping via `getFirestoreErrorMessage()` — contextual toast on error

- [ ] Task 4: Create ExperiencesCrudPage orchestrator (AC: #6)
  - [ ] 4.1 Create `ExperiencesCrudPage.svelte` with view state: `'list' | 'create' | 'edit'`
  - [ ] 4.2 State: `listRef`, `editingExp`, `deletingExp`, `showDeleteDialog`, `deleting`
  - [ ] 4.3 `handleSaved()`: reset to list, call `listRef?.loadExperiences()`
  - [ ] 4.4 `handleEdit()`: set editingExp, switch to edit view
  - [ ] 4.5 `handleDeleteRequest()` / `handleConfirmDelete()`: delete Firestore doc only (no images), toast, refresh list
  - [ ] 4.6 Delete dialog message with `{name}` replacement (use companyName)
  - [ ] 4.7 Back-to-list button + breadcrumb title in form views
  - [ ] 4.8 `getFirestoreErrorMessage()` for delete errors

- [ ] Task 5: Wire experiences.astro page (AC: all)
  - [ ] 5.1 Replace placeholder content with `ExperiencesCrudPage client:only="svelte"`
  - [ ] 5.2 Keep existing `AdminLayout` and `AuthGuard` wrapper

- [ ] Task 6: Add i18n translation keys
  - [ ] 6.1 Add `admin.experiences.*` keys following technology pattern:
    - `title`, `createTitle`, `editTitle`, `createNew`, `empty`, `emptyCta`
    - `loading`, `errorLoading`, `edit`, `delete`
    - `form.companyName`, `form.jobName`, `form.responsibilities`, `form.startDate`, `form.endDate`, `form.currentlyWorking`
    - `form.save`, `form.saving`, `form.saveEdit`, `form.savingEdit`, `form.cancel`, `form.discardChanges`
    - `createSuccessToast`, `editSuccessToast`
    - `deleteConfirmTitle`, `deleteConfirmMessage`, `deleteConfirmButton`, `deleteSuccessToast`, `deleteErrorToast`
    - `form.dateRangeError` (es: "La fecha de fin debe ser posterior a la de inicio", en: "End date must be after start date")
    - `present` (es: "Presente", en: "Present") — used in ExperienceList for null endDate display, NOT a form field

- [ ] Task 7: Unit tests
  - [ ] 7.1 `experience-form.test.ts`: Schema validation tests (companyName required, jobName bilingual required, responsibilities arrays, date range validation, nullable endDate)
  - [ ] 7.2 `experience-crud.test.ts`: Create flow (addDoc called with Timestamp dates), edit flow (updateDoc), delete flow (deleteDoc only, no image service), error handling (toast on failure)
  - [ ] 7.3 `experience-list.test.ts`: Load with date parsing, empty state, error state, ordering by startDate desc

## Dev Notes

### Framework Requirements

- Astro 6 + Svelte 5 runes: `$state`, `$derived`, `$effect`, `$props()` — NEVER Svelte 4 syntax
- `client:only="svelte"` MANDATORY for admin components (Firebase requires `window`)
- No API routes — Firebase client SDK directly: `addDoc`, `updateDoc`, `deleteDoc`, `getDocs`
- Zod schemas = source of truth → `z.infer<>` for all types
- `motion-safe:` prefix required for all auto-play animations
- Admin locale fixed to `'es'` — call `t(key, 'es')`

### Experience Data Model

```typescript
{
  companyName: string,              // NOT bilingual (company names are universal)
  jobName: { es: string, en: string },       // BilingualField
  responsibilities: { es: string[], en: string[] }, // BilingualArrayField
  startDate: Date,                  // Firestore Timestamp on write, Date on read
  endDate: Date | null              // null = "Actualmente trabajando"
}
```

**Key differences from Technologies:** Bilingual fields, array fields, date handling, NO images.
**Key differences from Projects:** No images, no slug, no URLs, no screenshots. But shares bilingual pattern.

**DO NOT copy from TechnologyForm:** `ImageUploader` import/component, `ImageSlot` state/type, `processImageSlot()`, `cleanupDeletedImages()`, `imageService` import, image path generation (`technologies/{docId}/{uuid}.webp`), image validation (`validateImage()`). Experiences has ZERO image logic.

### Existing Code to Reuse — DO NOT Reinvent

| What | Where | How |
|---|---|---|
| Schema base | `src/lib/schemas/experience-schema.ts` | Extend with form/firestore variants |
| Shared schemas | `src/lib/schemas/shared-schemas.ts` | `localizedString`, `localizedStringArray` already used |
| Build-time parse | `src/lib/firebase/collections.ts` | `parseExperience()` + `getAllExperiences()` already exist (Admin SDK) |
| Collection constant | `collections.ts` line 13 | `COLLECTION_PATHS.experiences = 'Experiences'` |
| Test factory | `src/test/factories/experience.ts` | `createExperience()` already defined |
| BilingualField | `src/components/admin/BilingualField.svelte` | Props: `label`, `bind:nameEs`, `bind:nameEn`, `type`, `required`, `errorEs`, `errorEn`, callbacks |
| BilingualArrayField | `src/components/admin/BilingualArrayField.svelte` | Props: `label`, `bind:itemsEs`, `bind:itemsEn`, `onChangeEs`, `onChangeEn`. MAX_ITEMS=10 |
| ConfirmDialog | `src/components/admin/ConfirmDialog.svelte` | Same pattern as TechnologiesCrudPage |
| Toast + toastStore | `src/lib/utils/toast-store.svelte` + `src/components/admin/Toast.svelte` | `toastStore.success()`, `toastStore.error()` |
| Error mapping | See `getFirestoreErrorMessage()` in TechnologiesCrudPage.svelte | Duck-typed `code` property, falls back to generic error key |
| Orchestrator pattern | `TechnologiesCrudPage.svelte` | Copy structure: viewMode, listRef, edit/delete state |
| List pattern | `TechnologyList.svelte` | Copy: loading/error/empty states, exported load function, skeleton |
| Form pattern | `TechnologyForm.svelte` | Copy: `initializedId` guard, `markDirty()`, `scrollToFirstError()`, `validateAll()` |

### Schema Extension Pattern

```typescript
// In experience-schema.ts — ADD these exports:

/** For Firestore doc.data() parsing — no id, dates as Date objects */
export const experienceFirestoreSchema = experienceBaseSchema.omit({ id: true });

/** For form validation — all fields except id, with date range refinement */
export const experienceFormSchema = experienceBaseSchema
  .omit({ id: true })
  .refine(
    (data) => data.endDate === null || data.endDate >= data.startDate,
    { message: 'endDate must be >= startDate', path: ['endDate'] }
  );

export type ExperienceFirestoreData = z.infer<typeof experienceFirestoreSchema>;
export type ExperienceWithId = ExperienceFirestoreData & { id: string };
```

**CRITICAL:** `experienceBaseSchema` is currently a local `const` (not exported). You MUST add `export` to it: `export const experienceBaseSchema = z.object({...})`. This is required because `.omit()` only works on `ZodObject` — it CANNOT be called on `experienceSchema` which is a `ZodEffects` (result of `.refine()`). Also, the existing `.refine()` on `experienceSchema` lacks `path: ['endDate']` — the new `experienceFormSchema` MUST include `path: ['endDate']` so validation errors target the correct form field.

### Date Handling Pattern

```typescript
// HTML date input → Date object
const dateFromInput = new Date(htmlDateString); // "2024-01-15" → Date

// Date → Firestore Timestamp (on write)
import { Timestamp } from 'firebase/firestore';
const firestorePayload = {
  startDate: Timestamp.fromDate(new Date(startDateStr)),
  endDate: currentlyWorking ? null : Timestamp.fromDate(new Date(endDateStr)),
};

// Firestore Timestamp → Date (on read in list component)
// toDate() helper in collections.ts handles this for build-time (Admin SDK)
// For client SDK reads: doc.data().startDate.toDate() — Firestore Timestamp has .toDate()

// Date → display string
const formatted = new Intl.DateTimeFormat('es', { year: 'numeric', month: 'short' }).format(date);
// → "ene 2024"
```

**NEVER use external date libraries** (moment, dayjs, date-fns). Use native `Intl.DateTimeFormat`.

### Date Input in List — Client SDK Read

When reading from Firestore client SDK (`getDocs`), date fields come as Firestore `Timestamp` objects. Convert:

```typescript
// In ExperienceList loadExperiences():
const data = doc.data();
const parsed = {
  ...data,
  id: doc.id,
  startDate: data.startDate?.toDate?.() ?? new Date(data.startDate),
  endDate: data.endDate != null ? (data.endDate?.toDate?.() ?? new Date(data.endDate)) : null,
};
```

Then validate with `experienceFirestoreSchema.safeParse()` (after date conversion).

### Edit Form Initialization

```typescript
let initializedId = $state('');

$effect(() => {
  if (mode === 'edit' && initialData && initializedId !== initialData.id) {
    initializedId = initialData.id;
    companyName = initialData.companyName;
    jobNameEs = initialData.jobName.es;
    jobNameEn = initialData.jobName.en;
    responsibilitiesEs = [...initialData.responsibilities.es];
    responsibilitiesEn = [...initialData.responsibilities.en];
    // Date → YYYY-MM-DD string for HTML input
    startDate = initialData.startDate.toISOString().split('T')[0];
    currentlyWorking = initialData.endDate === null;
    endDate = initialData.endDate ? initialData.endDate.toISOString().split('T')[0] : '';
    hasChanges = false;
    errors = {};
  }
});
```

### Form Submit Payload

```typescript
import { Timestamp } from 'firebase/firestore';

const payload = {
  companyName: companyName.trim(),
  jobName: { es: jobNameEs.trim(), en: jobNameEn.trim() },
  responsibilities: {
    es: responsibilitiesEs.filter(s => s.trim()).map(s => s.trim()),
    en: responsibilitiesEn.filter(s => s.trim()).map(s => s.trim()),
  },
  startDate: Timestamp.fromDate(new Date(startDate)),
  endDate: currentlyWorking ? null : Timestamp.fromDate(new Date(endDate)),
};
```

### Delete Flow — Simplest of All CRUDs

No images = no image cleanup. Delete is just:
```typescript
await deleteDoc(doc(db, EXPERIENCES_COLLECTION, deletingExp.id));
```
No `imageService.delete()`, no `deleteByPrefix()`. ConfirmDialog message should reference company name.

### ExperienceList Item Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Company Name (bold)                                         │
│ Job Title (es) · ene 2024 – Presente    [Editar] [Eliminar] │
└─────────────────────────────────────────────────────────────┘
```

Each row: card with `bg-surface border border-border rounded-lg p-4`, hover border highlight.

### ExperienceForm Layout

```
┌─ Experiencias (back link) ──────────────────────────────┐
│  Crear experiencia / Editar experiencia (h1)             │
│                                                          │
│  Empresa *           [___________________________]       │
│                                                          │
│  Puesto *            [ES] [EN]                          │
│                      [___________________________]       │
│                                                          │
│  Responsabilidades   [ES] [EN]                          │
│                      [___________________________] [×]   │
│                      [___________________________] [×]   │
│                      + Agregar                           │
│                                                          │
│  Fecha de inicio *   [____ date ____]                   │
│  Fecha de fin        [____ date ____]                   │
│  ☐ Actualmente trabajando                               │
│                                                          │
│  [Guardar experiencia]  [Cancelar]                      │
└──────────────────────────────────────────────────────────┘
```

Form max-width: `max-w-lg`. Responsive: stacked on mobile, same width on all breakpoints (no side-by-side layout needed for non-bilingual fields).

**Form field IDs:** Use `exp-{fieldname}` pattern (e.g., `exp-companyName`, `exp-startDate`), error IDs: `exp-{fieldname}-error`. Follows TechnologyForm's `tech-{fieldname}` convention.

### Validation Rules

| Field | Rule | Error key |
|---|---|---|
| companyName | Required, min 1 after trim | `admin.validation.required` |
| jobName.es | Required, min 1 after trim | `admin.validation.required` |
| jobName.en | Required, min 1 after trim | `admin.validation.required` |
| responsibilities.es | At least 1 non-empty item after trim: `responsibilitiesEs.filter(s => s.trim()).length === 0` → error | `admin.validation.required` |
| responsibilities.en | At least 1 non-empty item after trim: `responsibilitiesEn.filter(s => s.trim()).length === 0` → error | `admin.validation.required` |
| startDate | Required, valid date | `admin.validation.required` |
| endDate | Required if `!currentlyWorking`, must be >= startDate | `admin.experiences.form.dateRangeError` |

### BilingualArrayField Integration

```svelte
<BilingualArrayField
  label={t('admin.experiences.form.responsibilities', locale)}
  bind:itemsEs={responsibilitiesEs}
  bind:itemsEn={responsibilitiesEn}
  onChangeEs={() => markDirty()}
  onChangeEn={() => markDirty()}
/>
```

**Note:** `BilingualArrayField` uses i18n keys `admin.projects.form.removeFeature` and `admin.projects.form.addFeature` hardcoded. These keys already exist and are generic enough for experiences too ("+ Agregar feature" / "× Remove"). If a more specific label is desired, it would require modifying BilingualArrayField — but for this story, reuse as-is.

### Collection String Constant

Define a local constant `const EXPERIENCES_COLLECTION = 'Experiences'` in each Svelte component (CrudPage and Form), same pattern as `const TECHNOLOGIES_COLLECTION = 'Technologies'` in TechnologiesCrudPage. NEVER import from `collections.ts` — that file uses Admin SDK types (`firebase-admin/firestore`) which cannot be imported in client-side Svelte islands.

### Error Handling Pattern

Copy `getFirestoreErrorMessage()` from `TechnologiesCrudPage.svelte` into BOTH `ExperiencesCrudPage` (delete errors) AND `ExperienceForm` (save errors). Function duck-types `error.code` and maps `permission-denied` → `admin.error.permissionDenied`, `not-found` → `admin.error.notFound`, `unavailable` → `admin.error.unavailable`, fallback → `admin.error.unknown`. **Do NOT use specific error toast keys** — always use this contextual function (lesson from 3.6 code review).

### Testing Requirements

- Test naming: `[P0] 3.7-TEST-NNN: description`
- Mock pattern: `vi.hoisted()` + `vi.mock('firebase/firestore', ...)`
- Test factory: `createExperience()` from `src/test/factories/experience.ts`
- Co-located in `src/components/admin/__tests__/`
- WARNING: NEVER import from `collections.ts` in tests for client components
- Mock `firebase/firestore` with: `addDoc`, `updateDoc`, `deleteDoc`, `getDocs`, `doc`, `collection`, `query`, `orderBy`, `Timestamp`
- Mock `Timestamp.fromDate()` — this is NEW (3.6 had no dates). Use this pattern:

```typescript
// In vi.hoisted():
const mockTimestamp = { toDate: () => new Date('2024-01-15'), seconds: 0, nanoseconds: 0 };
const mockTimestampFromDate = vi.fn(() => mockTimestamp);

// In vi.mock('firebase/firestore', ...):
Timestamp: { fromDate: mockTimestampFromDate },

// In tests — verify Timestamp conversion:
expect(mockTimestampFromDate).toHaveBeenCalledWith(expect.any(Date));
```

### Project Structure Notes

**New files:**
- `src/components/admin/ExperiencesCrudPage.svelte`
- `src/components/admin/ExperienceList.svelte`
- `src/components/admin/ExperienceForm.svelte`
- `src/components/admin/__tests__/experience-form.test.ts`
- `src/components/admin/__tests__/experience-crud.test.ts`
- `src/components/admin/__tests__/experience-list.test.ts`

**Modified files:**
- `src/lib/schemas/experience-schema.ts` — add form/firestore schemas + types
- `src/lib/i18n/translations.ts` — add `admin.experiences.*` keys
- `src/pages/admin/experiences.astro` — replace placeholder with CrudPage

### Previous Story Intelligence (from 3.6)

- `$effect` init with `initializedId` guard prevents infinite re-render — MUST track `initialData.id`
- `getFirestoreErrorMessage()` duck-typed code property — use in BOTH CrudPage (delete) and Form (save)
- Delete flow order: delete Firestore doc → toast → refresh list (no image step for experiences)
- `saving` flag must reset on success BEFORE toast to prevent button flicker
- ConfirmDialog Escape/backdrop blocked during `confirming` state
- `scrollToFirstError()` uses `await tick()` then `document.querySelector('[role="alert"]')`
- Form validation on blur per field + `validateAll()` on submit
- `hasChanges` flag + `window.confirm()` for discard — NOT custom dialog
- Story 3.6 had 46 tests across 3 files — target similar coverage
- Story 3.6 code review found: error toast was using specific key instead of contextual `getFirestoreErrorMessage()` — don't repeat this mistake

### Git Intelligence

Recent commits show consistent patterns:
- `feat: implement story X.X` for main implementation
- `fix: code review story X.X` for post-review patches
- All stories pass quality gates: 0 type errors, 0 lint errors, all tests green
- Previous story added 29 i18n keys — experiences will need ~30 keys

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Epic 3, Story 3.7]
- [Source: _bmad-output/planning-artifacts/architecture.md#Implementation Sequence Phase 10]
- [Source: _bmad-output/planning-artifacts/prd.md#FR27-FR30]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Admin CRUD]
- [Source: _bmad-output/project-context.md#Rules 1-68]
- [Source: _bmad-output/implementation-artifacts/3-6-crud-technologies.md#Dev Notes]

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
