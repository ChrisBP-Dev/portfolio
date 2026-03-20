# Story 3.4: CRUD Projects — List y Create

Status: done

## Story

As Christopher (admin),
I want to see all my projects and create new ones with bilingual fields and images,
So that I can add new work to my portfolio.

## Acceptance Criteria

1. **Given** admin Projects page **When** loaded **Then** list shows all projects with thumbnail, name (current locale), action buttons (edit, delete)
2. **And** empty list shows empty state: illustration + "No hay proyectos aún. [Crear el primero →]"
3. **And** "Crear nuevo" opens form with sections:
   - Información Básica (BilingualField for name, description, features)
   - Imágenes (main image uploader + screenshots multi-uploader)
   - Metadata (technology selector, URLs optional, slug auto-generated from title)
4. **And** BilingualField on desktop: ES/EN side by side with colored badges (ES blue, EN green). Mobile: tabs
5. **And** filling required fields + uploading images + clicking "Guardar" saves to Firestore, uploads images via ImageService, shows toast "Proyecto guardado exitosamente", returns to list
6. **And** slug auto-generated from ES title, editable manually
7. **And** validation inline on blur, required fields with asterisk

## Tasks / Subtasks

- [x] Task 1: ProjectList component (AC: #1, #2)
  - [x] 1.1 Create `ProjectList.svelte` — query Firestore `Projects` collection via client SDK, parse with `projectSchema`, display list
  - [x] 1.2 List item: thumbnail (mainImage.url, 64x64), companyName[locale], slug, edit/delete action buttons
  - [x] 1.3 Empty state: illustration placeholder + CTA "No hay proyectos aún. Crear el primero →"
  - [x] 1.4 Loading state: 3-5 skeleton rows (pulsing gray) while fetching
  - [x] 1.5 Wire edit button to toggle form view (pre-populate — story 3.5), delete button placeholder (story 3.5)

- [x] Task 2: BilingualField component (AC: #4)
  - [x] 2.1 Create `BilingualField.svelte` — reusable for text inputs and textareas
  - [x] 2.2 Desktop (≥900px): ES/EN inputs side by side with colored badges (ES=blue `#48A1CD`, EN=green `#10B981`)
  - [x] 2.3 Mobile (<900px): Tab switcher ES/EN, single input visible at a time
  - [x] 2.4 Props: `label`, `nameEs`/`nameEn` values (bindable), `type` ('input'|'textarea'), `required`, `errorEs`/`errorEn`
  - [x] 2.5 Accessibility: `<fieldset>` + `<legend>`, `aria-required`, `aria-invalid`, `aria-describedby` for errors

- [x] Task 3: BilingualArrayField component (AC: #3, #4)
  - [x] 3.1 Create `BilingualArrayField.svelte` — for features list (ES/EN arrays)
  - [x] 3.2 Desktop: ES list left, EN list right with add/remove buttons per item
  - [x] 3.3 Mobile: Tab switcher ES/EN
  - [x] 3.4 Each item is a text input with remove (X) button, "Agregar" button at bottom
  - [x] 3.5 Edge cases: max 10 items per language, empty items filtered on submit, handle empty arrays gracefully

- [x] Task 4: ImageUploader component (AC: #3)
  - [x] 4.1 Create `ImageUploader.svelte` — single image slot (for mainImage)
  - [x] 4.2 States: empty (dotted area + camera icon), previewing (File selected, ObjectURL preview), uploading (progress bar), error
  - [x] 4.3 Click or drag-and-drop to select file, accept `image/*`, validate max 5MB client-side (show friendly error via toast: "Intenta con un archivo menor a 5MB")
  - [x] 4.4 On file select: create ObjectURL preview, set ImageSlot to `{ type: 'new', file, preview }`
  - [x] 4.5 Remove button to clear selection
  - [x] 4.6 Accessibility: label, `aria-describedby` for instructions

- [x] Task 5: ScreenshotManager component (AC: #3)
  - [x] 5.1 Create `ScreenshotManager.svelte` — multiple image slots (for screenshots array)
  - [x] 5.2 Grid of ImageSlot cards + "Agregar screenshot" button
  - [x] 5.3 Each card: preview thumbnail + remove (X) button
  - [x] 5.4 Track array of ImageSlot objects, each `{ type: 'new', file, preview }`
  - [x] 5.5 Support drag-and-drop for bulk file selection + click fallback for keyboard/a11y users

- [x] Task 6: TechnologySelector component (AC: #3)
  - [x] 6.1 Create `TechnologySelector.svelte` — multi-select from existing Technologies collection
  - [x] 6.2 Fetch all technologies from Firestore on mount
  - [x] 6.3 Display as chip-toggle grid: technology name + icon, selected = highlighted background, unselected = muted
  - [x] 6.4 Selected technologies stored as `string[]` (document IDs)

- [x] Task 7: ProjectForm component (AC: #3, #5, #6, #7)
  - [x] 7.1 Create `ProjectForm.svelte` — orchestrates all form sections, max-width ~700px for readability
  - [x] 7.2 Sections with visual separators (`border-b border-border pb-6 mb-6`): Información Básica (BilingualField × 2 + BilingualArrayField), Imágenes (ImageUploader + ScreenshotManager), Metadata (TechnologySelector + URL inputs + slug)
  - [x] 7.3 Slug auto-generation: derive from `companyName.es` using `slugify()` util, updates in real-time as user types. Toggle "Editar slug manualmente" to allow custom editing
  - [x] 7.4 Validation on blur: required fields (companyName.es, companyName.en, shortDescription.es, shortDescription.en, mainImage), inline error messages below each field. On submit validation failure: scroll to first invalid field
  - [x] 7.5 Submit handler (**strict order — DO NOT change**):
    1. Validate all fields with Zod `projectSchema`
    2. Disable button, show "Guardando..." + spinner
    3. `addDoc()` to Firestore with non-image fields → get `docId`
    4. Generate storage paths: `projects/{docId}/main/{uuid}.webp`, `projects/{docId}/screenshots/{uuid}.webp` using `crypto.randomUUID()`
    5. Upload images via `imageService.upload(file, path)` → get `StoredImage` references
    6. `updateDoc()` to add `mainImage` and `screenshots` references
    7. Show success toast "Proyecto guardado exitosamente"
    8. Return to list view after ~1.5s delay
    9. On failure after `addDoc()`: show error toast, re-enable button
  - [x] 7.6 Button states: "Guardando..." + spinner + disabled during submit (prevent double-submit)
  - [x] 7.7 Cancel button: if form has unsaved changes, show confirmation "¿Descartar cambios?" before returning to list. If no changes, return immediately

- [x] Task 8: ProjectsCrudPage component (AC: all)
  - [x] 8.1 Create `ProjectsCrudPage.svelte` — parent component managing list/form view state
  - [x] 8.2 State: `'list' | 'create'` view mode
  - [x] 8.3 Wire into existing `src/pages/admin/projects.astro` replacing placeholder content
  - [x] 8.4 Use `client:only="svelte"` directive

- [x] Task 9: Slug utility (AC: #6)
  - [x] 9.1 Create `slugify()` in `src/lib/utils/slugify.ts` — lowercase, replace spaces/accents with hyphens, remove special chars
  - [x] 9.2 Unit tests for slugify with Spanish characters (á, é, ñ, etc.)

- [x] Task 10: Toast notification (AC: #5)
  - [x] 10.1 Create `Toast.svelte` — success/error toast notification component, positioned bottom-right with slide-up entrance animation
  - [x] 10.2 Success: green + checkmark, auto-dismiss 4s
  - [x] 10.3 Error: red, persists until dismissed
  - [x] 10.4 Stack vertically, max 3 visible, `aria-live="polite"`, newest on top
  - [x] 10.5 Create `toast-store.svelte.ts` — reactive store for managing toast queue
  - [x] 10.6 **`prefers-reduced-motion: reduce`** — disable slide/fade animations when user prefers reduced motion (established rule from story 3.2)

- [x] Task 11: i18n keys (AC: all)
  - [x] 11.1 Add translation keys to `src/lib/i18n/translations.ts` for all admin project labels, form fields, buttons, validation messages, toast messages, empty states
  - [x] 11.2 Required validation error templates: `admin.validation.required` = "Este campo es obligatorio", `admin.validation.urlInvalid` = "Introduce una URL válida", `admin.validation.slugInvalid` = "El slug solo puede contener letras minúsculas, números y guiones", `admin.validation.fileTooLarge` = "Intenta con un archivo menor a 5MB"

- [x] Task 12: Unit tests (AC: all)
  - [x] 12.1 Tests for `slugify()` — Spanish chars, edge cases, empty strings
  - [x] 12.2 Tests for project form validation — required fields, optional fields, Zod schema validation
  - [x] 12.3 Tests for toast store — add, remove, auto-dismiss, max limit

## Dev Notes

### Critical Architecture Constraints

- **Framework**: Astro 6 + Svelte 5 (NOT Next.js/React). All interactive admin components are Svelte 5 islands
- **Svelte 5 Runes ONLY**: Use `$state`, `$derived`, `$effect`, `$props()`. NEVER use Svelte 4 syntax (`export let`, `$:`, `onMount` from lifecycle)
- **`client:only="svelte"` is MANDATORY** for ALL admin Svelte components — Firebase requires `window`, SSR will crash without this directive
- **No API routes needed** — all CRUD uses Firebase client SDK directly from Svelte islands (`addDoc`, `getDocs`, `collection` from `firebase/firestore`)
- **Zod schemas are source of truth** — types derived via `z.infer<>`, never manual interfaces
- **`prefers-reduced-motion: reduce`** — ALL animations/transitions MUST be wrapped in motion media query (established rule from story 3.2 code review)

### Existing Code to Reuse (DO NOT Reinvent)

| What | Path | Usage |
|------|------|-------|
| Project Zod schema | `src/lib/schemas/project-schema.ts` | Validation + type derivation |
| Shared schemas (LocalizedString, StoredImage) | `src/lib/schemas/shared-schemas.ts` | Reuse `localizedString`, `storedImageSchema` |
| ImageSlot discriminated union | `src/lib/schemas/image-slot.ts` | 5-state UI tracking for image slots |
| ImageService | `src/lib/firebase/image-service.ts` | `upload()`, `replace()`, `delete()`, `deleteByPrefix()` — all with retry |
| ImageSlotProcessor | `src/lib/firebase/image-slot-processor.ts` | `processImageSlot()`, `cleanupDeletedImages()` |
| Firebase client SDK | `src/lib/firebase/client.ts` | `db`, `storage`, `auth` exports |
| Collection name | Define locally: `const PROJECTS_COLLECTION = 'Projects'` | DO NOT import from `collections.ts` (Admin SDK side-effects) |
| Parse pattern | Use `projectSchema.parse(doc.data())` inline | DO NOT import `parseProject` from `collections.ts` |
| Auth errors | `src/lib/firebase/auth-errors.ts` | Pattern for error mapping |
| Storage errors | `src/lib/firebase/storage-errors.ts` | Pattern for Storage error mapping |
| i18n function | `src/lib/i18n/translations.ts` | `t(key, locale)` function |
| Test factories | `src/test/factories/` | `createProject()`, `createTechnology()` |
| Admin layout | `src/layouts/AdminLayout.astro` | Wraps all admin pages (sidebar + breadcrumb) |
| Admin sidebar | `src/components/admin/AdminSidebar.svelte` | Already navigates to `/admin/projects` |
| Placeholder page | `src/pages/admin/projects.astro` | Already exists — replace placeholder content |
| Input component | `src/components/common/Input.astro` | Reusable field (text, textarea, select, file) |
| Button component | `src/components/common/Button.astro` | primary/secondary/danger/ghost variants |

**Import paths are relative** — from `src/components/admin/ProjectForm.svelte`, import schemas as `import { projectSchema } from '../../lib/schemas/project-schema'`, firebase as `import { db } from '../../lib/firebase/client'`. NO path aliases (`@lib`, `$lib`).

### Firebase Client SDK Patterns (Browser Only)

**WARNING**: NEVER import from `collections.ts` in Svelte islands — it has Admin SDK side-effects that crash in browser. Define collection name locally and parse data inline.

```typescript
// READ: List all projects
import { db } from '../../lib/firebase/client';
import { collection, getDocs, addDoc, query, orderBy } from 'firebase/firestore';
import { projectSchema } from '../../lib/schemas/project-schema';

const PROJECTS_COLLECTION = 'Projects';

const q = query(collection(db, PROJECTS_COLLECTION), orderBy('slug'));
const snapshot = await getDocs(q);
const projects = snapshot.docs.map(doc => ({
  ...projectSchema.parse(doc.data()),
  id: doc.id,
}));

// CREATE: Add new project
const docRef = await addDoc(collection(db, PROJECTS_COLLECTION), projectData);
```

### Image Upload Flow (Create Mode)

1. User selects files → create `ObjectURL` previews → set ImageSlot to `{ type: 'new', file, preview }`
2. On form submit (after validation):
   a. `addDoc()` to Firestore with all non-image fields → get `docId`
   b. Generate storage paths with `crypto.randomUUID()`:
      - Main image: `projects/{docId}/main/{uuid}.webp`
      - Screenshots: `projects/{docId}/screenshots/{uuid}.webp`
   c. `imageService.upload(file, path)` for each new slot → returns `StoredImage { url, storagePath }`
   d. `updateDoc()` to add `mainImage` and `screenshots` StoredImage references
3. **Path generation is caller responsibility** — ImageService only uses paths as provided
4. **Rollback**: If image upload fails after `addDoc()`, show error toast and re-enable button. Orphaned partial documents can be cleaned manually or in a future story
5. **File validation**: Reject files > 5MB client-side before upload attempt

### Slug Generation

- Auto-derive from `companyName.es`: lowercase → replace accents (á→a, ñ→n) → replace spaces with hyphens → remove non-alphanumeric
- Allow manual editing via toggle/checkbox "Editar slug manualmente"
- Validate uniqueness is NOT required at this stage (Firestore doesn't enforce unique fields without extra logic)

### Form Validation Rules

| Field | Required | Validation |
|-------|----------|------------|
| companyName.es | Yes | `string().min(1)` |
| companyName.en | Yes | `string().min(1)` |
| shortDescription.es | Yes | `string().min(1)` |
| shortDescription.en | Yes | `string().min(1)` |
| features.es | No | `string[]` (can be empty) |
| features.en | No | `string[]` (can be empty) |
| mainImage | Yes | Must have file selected, max 5MB per file |
| screenshots | No | `StoredImage[]` (can be empty) |
| websiteUrl | No | `z.string().url().optional()` |
| sourceCodeUrl | No | `z.string().url().optional()` |
| technologies | No | `string[]` (can be empty) |
| slug | Yes | `string().min(1).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)` |

### Responsive Design

- **Mobile (<450px)**: Single column, bilingual fields as ES/EN tabs, full-width inputs, sidebar as drawer
- **Tablet (450-900px)**: Intermediate, bilingual may be side-by-side if space allows
- **Desktop (≥900px)**: Bilingual fields side-by-side, multi-column form sections, sidebar expanded 250px
- **Breakpoint Tailwind classes**: `sm:` = 450px, `lg:` = 900px

### Styling Patterns (Tailwind CSS v4)

- **Surface/cards**: `bg-surface rounded-lg border border-border`
- **Text**: `text-text-primary`, `text-text-secondary`, `text-text-muted`
- **Focus**: `focus:ring-2 focus:ring-primary focus:outline-none`
- **Error**: `border-error text-error`
- **Buttons**: Primary = `[background:var(--brand-gradient)] text-white`, Secondary = `border border-border text-text-primary`
- **Badges**: ES = `bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200`, EN = `bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200`

### Admin Locale

- Admin UI locale is fixed `'es'` (Christopher is Spanish-speaking)
- Call `t(key, 'es')` for all UI strings
- Bilingual form fields have both ES/EN inputs but labels and UI chrome are in Spanish

### Error Handling

- Use `instanceof FirebaseError` + code-based mapping
- Follow `auth-errors.ts` and `storage-errors.ts` patterns for any new error codes
- User-friendly messages, never raw error strings or stack traces
- Toast for operation results (success/error)

### Testing Requirements

- **Test naming**: `[P0] 3.4-TEST-NNN: description` for acceptance criteria, `[P1]` for edge cases
- **Mock pattern**: `vi.hoisted()` + `vi.mock('firebase/firestore', ...)` for Firestore mocks
- **Test factories**: Use `createProject()` from `src/test/factories/`
- **Co-located tests**: `src/lib/utils/__tests__/slugify.test.ts`, `src/components/admin/__tests__/...`
- **Minimum tests**: slugify utility, form validation, toast store logic

### Project Structure Notes

New files to create:
```
src/components/admin/
├── ProjectsCrudPage.svelte    # Parent: list/create view state
├── ProjectList.svelte         # List with loading/empty states
├── ProjectForm.svelte         # Create form orchestrator
├── BilingualField.svelte      # Reusable ES/EN dual input
├── BilingualArrayField.svelte # Reusable ES/EN array input (features)
├── ImageUploader.svelte       # Single image upload + preview
├── ScreenshotManager.svelte   # Multiple screenshots grid
├── TechnologySelector.svelte  # Multi-select technologies
├── Toast.svelte               # Toast notification component
├── __tests__/
│   └── (component tests if needed)
src/lib/utils/
├── slugify.ts                 # Slug generation utility
├── toast-store.ts             # Toast queue management
├── __tests__/
│   ├── slugify.test.ts
│   └── toast-store.test.ts
```

Files to modify:
```
src/pages/admin/projects.astro   # Replace placeholder with ProjectsCrudPage
src/lib/i18n/translations.ts     # Add admin.projects.* keys
```

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Epic3-Story3.4]
- [Source: _bmad-output/planning-artifacts/architecture.md#AdminPages]
- [Source: _bmad-output/planning-artifacts/architecture.md#FirestoreCollections]
- [Source: _bmad-output/planning-artifacts/architecture.md#FormHandling]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#AdminForms]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#ImageUploader]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#BilingualField]
- [Source: _bmad-output/planning-artifacts/prd.md#FR19-FR22]
- [Source: _bmad-output/planning-artifacts/prd.md#FR38-FR41]

### Previous Story Intelligence

**From Story 3.1 (Auth):**
- `client:only="svelte"` discovered as mandatory — `client:load` causes SSR crash with Firebase
- Error mapping pattern: `instanceof FirebaseError` with code-based localized messages
- Admin locale fixed to `'es'`
- Navigation uses `window.location.href` (no View Transitions in admin)

**From Story 3.2 (Dashboard/Sidebar):**
- Never import from `collections.ts` in Svelte islands (has Admin SDK side-effects). Use local const or `COLLECTION_PATHS` only
- Sidebar active state: `startsWith(path + '/')` for exact segment matching
- Body scroll lock pattern for modals/drawers via `$effect` cleanup
- `prefers-reduced-motion: reduce` must wrap all animations
- ESLint browser globals configured via `...globals.browser` in `eslint.config.js`

**From Story 3.3 (ImageService):**
- Safe-first replace order: upload new → return to caller → async delete old
- Retry only network errors (2 retries max, 300ms exponential backoff)
- `deleteByPrefix` is recursive (handles nested directories)
- `Promise.allSettled` for cascade deletes (log failures, don't propagate)
- Storage path pattern: `{entity}/{entityId}/{purpose}/{uuid}.webp`
- Mock pattern: `vi.hoisted()` for Firebase mock setup in vitest strict mode

### Git Intelligence

Recent commits show consistent patterns:
- `docs: create story X.Y` → `feat: implement story X.Y` → `fix: quality review patches` → `fix: code review patches`
- Code review patches catch: a11y issues, path matching bugs, SSR compatibility, error handling gaps
- All stories follow: create → implement → quality review → code review cycle

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (1M context)

### Debug Log References

- ESLint `.svelte.ts` parsing: needed to add ESLint config entry for `**/*.svelte.ts` files to support Svelte 5 runes in plain TS modules
- `$state` rune requires `.svelte.ts` extension — renamed `toast-store.ts` → `toast-store.svelte.ts`
- Removed unnecessary `svelte-ignore a11y_no_static_element_interactions` comments (Svelte 5 dropped that warning for elements with role+tabindex)
- **Firebase Storage billing spike**: 126 pushes a main en 5 días (Mar 17-20) generaron 12.87GB de bandwidth en Storage (free tier: 1GB/día). Causa: Lighthouse CI descarga todas las imágenes desde `firebasestorage.googleapis.com` en cada run. Fix: step "Check for code changes" en CI que salta Build/Lighthouse/Deploy cuando solo cambian docs (`_bmad-output/`, `docs/`, etc.)
- **Svelte 5 `{@const}` placement**: `{@const}` solo es válido como hijo directo de `{#snippet}`, `{#each}`, `{#if}`, etc. — NO dentro de un `<div>`. En ScreenshotManager, `{@const stableKeys = getStableKeys()}` dentro de un `<div>` causó error de compilación. Fix: reemplazar con `$derived.by()` en el script block. BilingualArrayField no tuvo este problema porque su `{@const}` estaba dentro de `{#snippet}`.

### Completion Notes List

- **Task 9**: `slugify()` utility handles Spanish accents (á→a, ñ→n, etc.), collapses hyphens, strips edges. 10 unit tests.
- **Task 10**: Toast store (`.svelte.ts`) with $state rune, max 3 toasts, auto-dismiss success (4s), error persists. Toast.svelte with `motion-safe:animate-slide-up` and `prefers-reduced-motion` media query. 8 unit tests.
- **Task 11**: 46 new i18n keys added under `admin.projects.*`, `admin.validation.*`, `admin.bilingual.*` namespaces.
- **Task 2**: BilingualField — fieldset+legend, desktop side-by-side with colored badges (blue ES / green EN), mobile tabs. Supports input/textarea, bindable values, error display with aria.
- **Task 3**: BilingualArrayField — same ES/EN pattern for arrays. Max 10 items, add/remove per item, Svelte 5 snippets for list rendering.
- **Task 4**: ImageUploader — single image with drag-and-drop + click, 5MB validation via toast, ObjectURL preview, remove button. Uses ImageSlot type.
- **Task 5**: ScreenshotManager — multi-image grid, drag-and-drop bulk selection, remove per card, keyboard accessible.
- **Task 6**: TechnologySelector — fetches from Firestore, chip-toggle grid with aria-pressed, loading skeleton, empty state.
- **Task 7**: ProjectForm — orchestrates all sections. Auto-slug from companyName.es via $effect. Inline validation on blur, scroll-to-first-error on submit. Submit follows strict order: addDoc → upload images → updateDoc → success toast → return to list. Cancel with unsaved changes confirmation.
- **Task 1**: ProjectList — queries Firestore, skeleton loading (4 rows), empty state with CTA, list items with thumbnail/name/slug/actions. Edit wired, delete disabled (story 3.5).
- **Task 8**: ProjectsCrudPage — parent managing list/create view state, wired into projects.astro with `client:only="svelte"`.
- **Task 12**: 33 total tests — slugify (10), toast-store (8), project form validation (15). All pass.

### Code Review Record

**Review Date**: 2026-03-20
**Reviewer Model**: Claude Opus 4.6 (1M context)
**Review Method**: 3-layer parallel adversarial (Blind Hunter + Edge Case Hunter + Acceptance Auditor)
**Result**: 14 patches applied, 1 bad-spec noted, 2 deferred, 10 rejected as noise

**Patches Applied (14)**:
1. **[CRITICAL] P-1**: `projectSchema.parse(doc.data())` failed — schema required `id` but Firestore `doc.data()` doesn't include it. Fix: added `projectFirestoreSchema` (omits id) with `safeParse` + per-doc error handling
2. **[HIGH] P-2**: Validation bypassed Zod schema — used hand-rolled regex. Fix: `validateAll()` now uses `projectFormSchema.safeParse()`, per-field blur validation uses schema shape accessors
3. **[HIGH] P-3**: Initial `addDoc` included `mainImage: { url: '', storagePath: '' }` placeholder that broke `storedImageSchema` on orphaned docs. Fix: omitted image fields from initial write
4. **[MEDIUM] P-4**: BilingualField validated on `oninput` instead of `onblur`. Fix: added `onBlurEs`/`onBlurEn` props, moved `validateField` calls to blur handlers
5. **[MEDIUM] P-5**: `animate-spin` on save spinner lacked `prefers-reduced-motion`. Fix: `motion-safe:animate-spin`
6. **[MEDIUM] P-6**: `animate-pulse` on skeletons lacked `prefers-reduced-motion`. Fix: `motion-safe:animate-pulse`
7. **[MEDIUM] P-7**: Object URL memory leak when replacing image without removing first. Fix: revoke previous URL in `handleFile` before creating new one
8. **[MEDIUM] P-8**: Object URLs not revoked on component destroy. Fix: added `$effect` cleanup in ImageUploader and ScreenshotManager
9. **[MEDIUM] P-9**: Index used as `{#each}` key caused DOM reuse bugs. Fix: unique key tracking arrays in BilingualArrayField and ScreenshotManager
10. **[LOW] P-10**: Hardcoded "Crear proyecto" bypassed `t()`. Fix: added `admin.projects.createTitle` i18n key
11. **[LOW] P-11**: `scrollToFirstError` called before DOM updated. Fix: `await tick()` before `querySelector`
12. **[LOW] P-12**: Tabs missing `aria-controls` and `role="tabpanel"`. Fix: added WAI-ARIA tabs pattern to BilingualField and BilingualArrayField
13. **[LOW] P-13**: EN badge colors used `green-*` instead of `emerald-*` (spec: #10B981 = emerald-500). Fix: changed to `emerald-*` classes
14. **[LOW] P-14**: Feature array items not trimmed before save. Fix: added `.map(f => f.trim())` after filter

**Bad Spec (1)**: BS-1 — Rule "ALL animations/transitions MUST be wrapped in motion media query" is too broad for user-initiated hover/focus transitions. Recommendation: amend to "Auto-play animations MUST use motion-safe: prefix. User-initiated transitions are exempt."

**Deferred (1)**:
- D-1: No max screenshot count (not in spec)

**Post-review fix**: D-2 promoted from defer to patch — CI `HEAD~1` only compared last commit, causing build/deploy skip when multi-commit push ended with docs-only commit. Fix: `fetch-depth: 0` + `github.event.before..HEAD` compares all commits in the push. Handles edge cases: workflow_dispatch (always build), first push to branch (always build), force push (git diff compares trees correctly).

### Change Log

- 2026-03-20: Implemented full story 3.4 — CRUD Projects List y Create (all 12 tasks)
- 2026-03-20: CI/CD optimization — skip build/lighthouse/deploy for docs-only commits to prevent Firebase Storage bandwidth spikes
- 2026-03-20: Code review patches — 14 fixes (Zod validation, schema parsing, a11y, memory leaks, motion queries, blur validation)
- 2026-03-20: CI/CD fix — change detection now compares full push range (github.event.before..HEAD) instead of only last commit (HEAD~1)

### File List

New files:
- src/components/admin/ProjectsCrudPage.svelte
- src/components/admin/ProjectList.svelte
- src/components/admin/ProjectForm.svelte
- src/components/admin/BilingualField.svelte
- src/components/admin/BilingualArrayField.svelte
- src/components/admin/ImageUploader.svelte
- src/components/admin/ScreenshotManager.svelte
- src/components/admin/TechnologySelector.svelte
- src/components/admin/Toast.svelte
- src/lib/utils/slugify.ts
- src/lib/utils/toast-store.svelte.ts
- src/lib/utils/__tests__/slugify.test.ts
- src/lib/utils/__tests__/toast-store.test.ts
- src/lib/utils/__tests__/project-form-validation.test.ts

Modified files:
- src/pages/admin/projects.astro
- src/lib/i18n/translations.ts
- src/lib/schemas/project-schema.ts
- src/lib/schemas/technology-schema.ts
- eslint.config.js
- .github/workflows/ci.yml
