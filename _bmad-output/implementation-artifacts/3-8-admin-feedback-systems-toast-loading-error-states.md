# Story 3.8: Admin Feedback Systems — Toast, Loading, Error States

Status: ready-for-dev

## Story

As Christopher (admin),
I want clear visual feedback for every action I take,
so that I always know the status of my operations and never feel uncertain.

## Acceptance Criteria

1. **Given** successful save **When** completed **Then** Toast: green checkmark, "Proyecto guardado exitosamente" (o equivalente según entidad), auto-dismiss 4s.
2. **Given** failed operation **When** error occurs **Then** Toast: red, user-friendly error (mapped from Firebase codes to ES/EN via centralized `getFirestoreErrorMessage()`), persists until dismissed.
3. **Given** image uploading **When** upload in progress **Then** progress bar with percentage displayed inside ImageUploader component.
4. **Given** list loading **When** data fetching **Then** skeleton rows (3-5 pulsing gray rows) displayed with `aria-busy="true"`.
5. **Given** form submitting **When** save in progress **Then** spinner + "Guardando..." on button, disabled state prevents double-submit.
6. **Given** multiple toasts **When** stacked **Then** max 3 visible, newest at top, vertical stack.
7. **Given** toast displayed **When** announced **Then** uses `aria-live="polite"` for screen reader announcement.
8. **Given** error messages **When** mapping Firebase codes **Then** centralized via `src/lib/utils/error-messages.ts`, all CRUD pages import from it.

## Tasks / Subtasks

- [ ] Task 1: Create centralized `error-messages.ts` utility (AC: #2, #8)
  - [ ] 1.1 Create `src/lib/utils/error-messages.ts` with `getFirestoreErrorMessage(error: unknown, locale: Locale): string`
  - [ ] 1.2 Map Firebase error codes: `permission-denied`, `not-found`, `unavailable`, `unauthenticated`, `resource-exhausted`, `deadline-exceeded`, `already-exists` — fallback to `admin.error.unknown`
  - [ ] 1.3 Also export `getStorageErrorMessage(error: unknown, locale: Locale): string` for Storage-specific codes: `storage/unauthorized`, `storage/canceled`, `storage/unknown`, `storage/object-not-found`, `storage/quota-exceeded`, `storage/retry-limit-exceeded`
  - [ ] 1.4 Add missing i18n keys: `admin.error.unauthenticated`, `admin.error.resourceExhausted`, `admin.error.deadlineExceeded`, `admin.error.alreadyExists`, `admin.error.storageFull`, `admin.error.uploadFailed`

- [ ] Task 2: Refactor all CRUD pages/forms to use centralized error utility (AC: #2, #8)
  - [ ] 2.1 Replace `getFirestoreErrorMessage()` in `TechnologiesCrudPage.svelte` — import from `error-messages.ts`, fix wrong fallback `admin.technologies.deleteErrorToast` → generic
  - [ ] 2.2 Replace `getFirestoreErrorMessage()` in `TechnologyForm.svelte` — import from `error-messages.ts`
  - [ ] 2.3 Replace `getFirestoreErrorMessage()` in `ProjectsCrudPage.svelte` — import from `error-messages.ts`, fix wrong fallback `admin.projects.deleteErrorToast` → generic
  - [ ] 2.4 Replace `getFirestoreErrorMessage()` in `ProjectForm.svelte` — import from `error-messages.ts`
  - [ ] 2.5 Replace `getFirestoreErrorMessage()` in `ExperiencesCrudPage.svelte` — import from `error-messages.ts`
  - [ ] 2.6 Replace `getFirestoreErrorMessage()` in `ExperienceForm.svelte` — import from `error-messages.ts`

- [ ] Task 3: Add upload progress to ImageUploader (AC: #3)
  - [ ] 3.1 Add `uploadProgress` prop to `ImageUploader.svelte`: `uploadProgress?: number | null` (null = not uploading, 0-100 = percentage)
  - [ ] 3.2 Render progress bar UI inside ImageUploader when `uploadProgress !== null` — bar over preview image, percentage text
  - [ ] 3.3 Modify `imageService.upload()` to accept `onProgress?: (percent: number) => void` callback — switch from `uploadBytes` to `uploadBytesResumable` for progress tracking
  - [ ] 3.4 Modify `imageService.replace()` to pass `onProgress` through to upload
  - [ ] 3.5 Update `ProjectForm.svelte` to track upload progress per ImageSlot and pass to ImageUploader

- [ ] Task 4: Add double-submit prevention guard (AC: #5)
  - [ ] 4.1 In `ProjectForm.svelte` `handleSubmit()`: add early return if `saving` is already true
  - [ ] 4.2 In `TechnologyForm.svelte` `handleSubmit()`: add early return if `saving` is already true
  - [ ] 4.3 In `ExperienceForm.svelte` `handleSubmit()`: add early return if `saving` is already true
  - [ ] 4.4 Add `aria-busy={saving ? 'true' : undefined}` on submit buttons in all 3 forms

- [ ] Task 5: Expand toast system with `warning` type (AC: #1, #6)
  - [ ] 5.1 Add `'warning'` to `ToastType` union in `toast-store.svelte.ts`
  - [ ] 5.2 Warning behavior: auto-dismiss 6s (per UX spec), dismissible
  - [ ] 5.3 Update `Toast.svelte`: add orange/amber styling for warning type — `bg-amber-50 border-amber-200 dark:bg-amber-950 dark:border-amber-800`, `!` icon, `text-amber-800 dark:text-amber-200`
  - [ ] 5.4 Export `toastStore.warning(message)` method

- [ ] Task 6: Add i18n keys for new error messages (AC: #2)
  - [ ] 6.1 Add `admin.error.unauthenticated` (es: "Sesión expirada. Inicia sesión nuevamente.", en: "Session expired. Please sign in again.")
  - [ ] 6.2 Add `admin.error.resourceExhausted` (es: "Límite de operaciones alcanzado. Intenta más tarde.", en: "Operation limit reached. Try again later.")
  - [ ] 6.3 Add `admin.error.deadlineExceeded` (es: "La operación tardó demasiado. Intenta nuevamente.", en: "Operation timed out. Please try again.")
  - [ ] 6.4 Add `admin.error.alreadyExists` (es: "El recurso ya existe", en: "Resource already exists")
  - [ ] 6.5 Add `admin.error.storageFull` (es: "Almacenamiento lleno. Elimina archivos antes de subir más.", en: "Storage full. Delete files before uploading more.")
  - [ ] 6.6 Add `admin.error.uploadFailed` (es: "No se pudo subir la imagen. Intenta nuevamente.", en: "Image upload failed. Please try again.")

- [ ] Task 7: Unit tests (AC: all)
  - [ ] 7.1 `error-messages.test.ts`: test all Firebase error code mappings (Firestore + Storage), locale switch, unknown error fallback, non-object error handling
  - [ ] 7.2 `toast-store.test.ts`: test warning type auto-dismiss at 6s, max 3 stacking, success auto-dismiss at 4s, error persistence, remove/clear
  - [ ] 7.3 `image-upload-progress.test.ts`: test `uploadBytesResumable` called, onProgress callback fires, progress percentage forwarded

## Dev Notes

### Framework Requirements

- Astro 6 + Svelte 5 runes: `$state`, `$derived`, `$effect`, `$props()` — NEVER Svelte 4 syntax
- `client:only="svelte"` MANDATORY for admin components (Firebase requires `window`)
- Zod schemas = source of truth → `z.infer<>` for all types
- `motion-safe:` prefix required for all auto-play animations
- Admin locale fixed to `'es'` — call `t(key, 'es')`
- NEVER hardcode UI strings — always in `translations.ts`

### Current State Analysis — What Already Works

| Feature | Status | Location |
|---|---|---|
| Toast success (green, 4s auto-dismiss) | DONE | `toast-store.svelte.ts` + `Toast.svelte` |
| Toast error (red, persist until dismiss) | DONE | `toast-store.svelte.ts` + `Toast.svelte` |
| Max 3 toasts stacking | DONE | `toast-store.svelte.ts` MAX_TOASTS=3 |
| `aria-live="polite"` on toast container | DONE | `Toast.svelte` |
| `role="alert"` on error toasts | DONE | `Toast.svelte` |
| Skeleton loading rows (4 pulsing) | DONE | TechnologyList, ProjectList, ExperienceList |
| Spinner + "Guardando..." on button | DONE | All 3 Form components |
| ConfirmDialog for delete | DONE | All 3 CrudPage components |
| Field-level validation with `role="alert"` | DONE | All 3 Form components |
| Slide-up animation on toast | DONE | `Toast.svelte` CSS |
| `prefers-reduced-motion` respected | DONE | `Toast.svelte` media query |

### What This Story ADDS or FIXES

| Change | Why |
|---|---|
| Centralized `error-messages.ts` | `getFirestoreErrorMessage()` is duplicated in 6 files — DRY violation; 2 CrudPages still have wrong fallbacks |
| Fix fallback in TechnologiesCrudPage | Uses `admin.technologies.deleteErrorToast` instead of `admin.error.unknown` — inconsistent with 3.6 code review lesson |
| Fix fallback in ProjectsCrudPage | Uses `admin.projects.deleteErrorToast` instead of `admin.error.unknown` — same issue |
| Upload progress bar | ImageUploader has no progress indicator during save — user gets no upload feedback |
| Warning toast type | UX spec defines 4 types (success/error/warning/info) — currently only 2 implemented |
| Double-submit guard | Deferred D-3 from 3.7 code review: no guard in `handleSubmit` before calling create/edit handler |
| `aria-busy` on submit buttons | Only LoginForm has this — other forms missing accessibility announcement |
| More Firebase error codes | Only 3 codes mapped (permission-denied, not-found, unavailable) — should cover auth/storage/quota |

### Centralized Error Messages Utility — Design

```typescript
// src/lib/utils/error-messages.ts
import { t } from '../i18n/translations';
import type { Locale } from '../i18n/config';

/** Firebase Firestore error code → i18n key */
const FIRESTORE_ERROR_MAP: Record<string, string> = {
  'permission-denied': 'admin.error.permissionDenied',
  'not-found': 'admin.error.notFound',
  'unavailable': 'admin.error.unavailable',
  'unauthenticated': 'admin.error.unauthenticated',
  'resource-exhausted': 'admin.error.resourceExhausted',
  'deadline-exceeded': 'admin.error.deadlineExceeded',
  'already-exists': 'admin.error.alreadyExists',
};

/** Firebase Storage error code → i18n key */
const STORAGE_ERROR_MAP: Record<string, string> = {
  'storage/unauthorized': 'admin.error.permissionDenied',
  'storage/quota-exceeded': 'admin.error.storageFull',
  'storage/retry-limit-exceeded': 'admin.error.uploadFailed',
  'storage/canceled': 'admin.error.uploadFailed',
  'storage/unknown': 'admin.error.unknown',
};

/**
 * Maps a Firebase error (Firestore or Storage) to a user-friendly translated message.
 * Duck-types `error.code` — works with FirestoreError, StorageError, or any { code: string }.
 */
export function getFirestoreErrorMessage(error: unknown, locale: Locale): string {
  if (typeof error === 'object' && error !== null && 'code' in error) {
    const code = (error as { code: string }).code;
    const key = FIRESTORE_ERROR_MAP[code] ?? STORAGE_ERROR_MAP[code];
    if (key) return t(key, locale);
  }
  return t('admin.error.unknown', locale);
}
```

**Signature change:** The centralized version takes `locale` as a second parameter. In all admin components, pass `'es'` (the fixed admin locale constant).

**Import in components:**
```typescript
import { getFirestoreErrorMessage } from '../../lib/utils/error-messages';
```

Delete the local `function getFirestoreErrorMessage(error: unknown): string { ... }` from each component.

**CRITICAL:** In each component, update all call sites to pass locale: `getFirestoreErrorMessage(error, locale)` instead of just `getFirestoreErrorMessage(error)`.

### Upload Progress — Implementation Pattern

**Step 1: Modify `imageService.upload()` in `image-service.ts`**

```typescript
import { ref, uploadBytesResumable, getDownloadURL, deleteObject, listAll } from 'firebase/storage';

async function upload(
  file: File,
  path: string,
  onProgress?: (percent: number) => void,
): Promise<StoredImage> {
  return withRetry(async () => {
    const storageRef = ref(storage, path);
    const task = uploadBytesResumable(storageRef, file);

    await new Promise<void>((resolve, reject) => {
      task.on('state_changed',
        (snapshot) => {
          const percent = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          onProgress?.(percent);
        },
        (error) => reject(error),
        () => resolve(),
      );
    });

    const url = await getDownloadURL(storageRef);
    return { url, storagePath: path };
  });
}
```

**Step 2: Add `onProgress` passthrough in `replace()`**

```typescript
async function replace(
  oldImage: StoredImage,
  file: File,
  newPath: string,
  onProgress?: (percent: number) => void,
): Promise<StoredImage> {
  const newImage = await upload(file, newPath, onProgress);
  // ... delete old image (unchanged)
}
```

**Step 3: Add progress state to ImageUploader.svelte**

```svelte
<script lang="ts">
  interface Props {
    label: string;
    slot: ImageSlot;
    required?: boolean;
    error?: string;
    uploadProgress?: number | null;  // NEW: null = not uploading
    onChange?: (slot: ImageSlot) => void;
  }

  let { label, slot = $bindable(), required = false, error = '', uploadProgress = null, onChange }: Props = $props();
</script>

<!-- Inside the preview area, BELOW the image badge, ABOVE the remove button: -->
{#if uploadProgress !== null}
  <div class="absolute bottom-0 left-0 right-0 bg-black/60 rounded-b-lg px-3 py-2">
    <div class="flex items-center gap-2">
      <div class="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">
        <div
          class="h-full bg-primary rounded-full transition-[width] duration-200"
          style="width: {uploadProgress}%"
        ></div>
      </div>
      <span class="text-xs text-white font-medium tabular-nums">{uploadProgress}%</span>
    </div>
  </div>
{/if}
```

**Step 4: Track progress in ProjectForm.svelte**

```typescript
let mainImageProgress = $state<number | null>(null);
let screenshotProgress = $state<Map<number, number>>(new Map());

// In processImageSlot():
async function processImageSlot(slot: ImageSlot, path: string, onProgress?: (p: number) => void): Promise<StoredImage | null> {
  if (slot.type === 'new') {
    return imageService.upload(slot.file, path, onProgress);
  }
  if (slot.type === 'replaced') {
    return imageService.replace(slot.old, slot.file, path, onProgress);
  }
  // ...
}

// Pass progress setter:
const mainResult = await processImageSlot(
  mainImageSlot, mainPath,
  (p) => { mainImageProgress = p; }
);

// After upload completes:
mainImageProgress = null;
```

```svelte
<ImageUploader
  label={t('admin.projects.form.mainImage', locale)}
  bind:slot={mainImageSlot}
  required
  error={errors.mainImage}
  uploadProgress={mainImageProgress}
  onChange={handleMainImageChange}
/>
```

**IMPORTANT:** TechnologyForm also uses ImageUploader but only for a single image. Apply the same progress tracking pattern there.

**NOTE:** ExperienceForm has NO images — do NOT add upload progress there.

### Double-Submit Prevention Pattern

Add at the TOP of `handleSubmit()` in each form:

```typescript
async function handleSubmit(): Promise<void> {
  if (saving) return; // ← ADD THIS LINE
  // ... rest of validation and submission
}
```

Already done in the `disabled={saving}` attribute on buttons, but this prevents programmatic/keyboard rapid submits.

### Warning Toast — Additions

```typescript
// In toast-store.svelte.ts:
const WARNING_DISMISS_MS = 6000; // 6s per UX spec

export type ToastType = 'success' | 'error' | 'warning';

// In add() function:
const toast: Toast = {
  id,
  message,
  type,
  dismissible: type !== 'success', // error AND warning are dismissible
};

if (type === 'success') {
  const timer = setTimeout(() => remove(id), AUTO_DISMISS_MS);
  timers.set(id, timer);
} else if (type === 'warning') {
  const timer = setTimeout(() => remove(id), WARNING_DISMISS_MS);
  timers.set(id, timer);
}
// error: no auto-dismiss (already the case)

// Export:
export const toastStore = {
  // ... existing
  warning: (message: string) => add(message, 'warning'),
};
```

### Toast.svelte — Warning Styling

```svelte
<!-- Add warning case in the styling conditional: -->
{toast.type === 'success'
  ? 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800'
  : toast.type === 'warning'
    ? 'bg-amber-50 border-amber-200 dark:bg-amber-950 dark:border-amber-800'
    : 'bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800'}

<!-- Warning icon (! in triangle): -->
{:else if toast.type === 'warning'}
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" aria-hidden="true">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
    <line x1="12" y1="9" x2="12" y2="13"></line>
    <line x1="12" y1="17" x2="12.01" y2="17"></line>
  </svg>

<!-- Warning text color: -->
{toast.type === 'success'
  ? 'text-green-800 dark:text-green-200'
  : toast.type === 'warning'
    ? 'text-amber-800 dark:text-amber-200'
    : 'text-red-800 dark:text-red-200'}
```

### aria-busy on Submit Buttons

Add to ALL 3 form submit buttons:

```svelte
<button
  type="submit"
  disabled={saving}
  aria-busy={saving ? 'true' : undefined}
  class="..."
>
```

### Existing Code to Reuse — DO NOT Reinvent

| What | Where | How |
|---|---|---|
| Toast store | `src/lib/utils/toast-store.svelte.ts` | Extend with `warning` type |
| Toast component | `src/components/admin/Toast.svelte` | Add warning styling |
| i18n utility | `src/lib/i18n/translations.ts` | `t(key, locale)` — import in error-messages.ts |
| Locale type | `src/lib/i18n/config.ts` | Import `Locale` type |
| ImageUploader | `src/components/admin/ImageUploader.svelte` | Add `uploadProgress` prop |
| imageService | `src/lib/firebase/image-service.ts` | Add `onProgress` callback, switch to `uploadBytesResumable` |
| withRetry | `src/lib/firebase/image-service.ts` | Keep for non-progress operations (delete, listAll) |
| Existing error keys | `translations.ts` lines 282-286 | `admin.error.*` — extend, don't duplicate |

### Files That Have `getFirestoreErrorMessage()` to Refactor

| File | Current Fallback | Issue |
|---|---|---|
| `TechnologiesCrudPage.svelte` | `admin.technologies.deleteErrorToast` | WRONG — should be `admin.error.unknown` |
| `ProjectsCrudPage.svelte` | `admin.projects.deleteErrorToast` | WRONG — should be `admin.error.unknown` |
| `ExperiencesCrudPage.svelte` | `admin.error.unknown` | Correct — just extract to import |
| `TechnologyForm.svelte` | `admin.error.unknown` | Correct — just extract to import |
| `ProjectForm.svelte` | `admin.error.unknown` | Correct — just extract to import |
| `ExperienceForm.svelte` | `admin.error.unknown` | Correct — just extract to import |

### Refactoring Pattern — Per File

**Before (in each Svelte component `<script>`):**
```typescript
function getFirestoreErrorMessage(error: unknown): string {
  if (typeof error === 'object' && error !== null && 'code' in error) {
    const code = (error as { code: string }).code;
    if (code === 'permission-denied') return t('admin.error.permissionDenied', locale);
    if (code === 'not-found') return t('admin.error.notFound', locale);
    if (code === 'unavailable') return t('admin.error.unavailable', locale);
  }
  return t('admin.error.unknown', locale); // or wrong entity-specific key
}
```

**After:**
```typescript
import { getFirestoreErrorMessage } from '../../lib/utils/error-messages';
// Delete the local function entirely
// At call sites: getFirestoreErrorMessage(error) → getFirestoreErrorMessage(error, locale)
```

### `uploadBytesResumable` API — Firebase Reference

```typescript
import { uploadBytesResumable } from 'firebase/storage';

const task = uploadBytesResumable(storageRef, file);

task.on('state_changed',
  (snapshot) => {
    // snapshot.bytesTransferred: number
    // snapshot.totalBytes: number
    // snapshot.state: 'running' | 'paused' | 'success' | 'error' | 'canceled'
  },
  (error) => { /* handle error */ },
  () => { /* complete */ }
);
```

**CRITICAL:** `uploadBytesResumable` is from `firebase/storage` (same package as `uploadBytes`). Just change the import — no new dependency.

**withRetry caveat:** `uploadBytesResumable` returns an `UploadTask` (not a Promise). The Promise wrapper in the upload function handles this. If the upload fails with a retryable error, `withRetry` will re-execute the entire upload.

### Testing Requirements

- Test naming: `[P0] 3.8-TEST-NNN: description`
- Mock pattern: `vi.hoisted()` + `vi.mock()`
- Co-located in `src/lib/utils/__tests__/` for error-messages and `src/lib/firebase/__tests__/` for image progress
- Toast store tests: `src/lib/utils/__tests__/toast-store.test.ts`

#### error-messages.test.ts

```typescript
import { describe, it, expect } from 'vitest';
import { getFirestoreErrorMessage } from '../error-messages';

describe('[P0] error-messages', () => {
  it('3.8-TEST-001: maps permission-denied to localized message', () => {
    const error = { code: 'permission-denied' };
    const result = getFirestoreErrorMessage(error, 'es');
    expect(result).toBe('Sin permisos para esta operación');
  });

  it('3.8-TEST-002: maps storage/unauthorized to permission message', () => {
    const error = { code: 'storage/unauthorized' };
    const result = getFirestoreErrorMessage(error, 'es');
    expect(result).toBe('Sin permisos para esta operación');
  });

  it('3.8-TEST-003: unknown code falls back to generic error', () => {
    const error = { code: 'some-unknown-code' };
    const result = getFirestoreErrorMessage(error, 'es');
    expect(result).toBe('Error inesperado');
  });

  it('3.8-TEST-004: non-object error falls back to generic error', () => {
    const result = getFirestoreErrorMessage('string error', 'es');
    expect(result).toBe('Error inesperado');
  });

  it('3.8-TEST-005: returns English when locale is en', () => {
    const error = { code: 'permission-denied' };
    const result = getFirestoreErrorMessage(error, 'en');
    expect(result).toBe('No permission for this operation');
  });
});
```

#### toast-store.test.ts

```typescript
describe('[P0] toast-store', () => {
  it('3.8-TEST-006: warning auto-dismisses after 6s', async () => { ... });
  it('3.8-TEST-007: success auto-dismisses after 4s', async () => { ... });
  it('3.8-TEST-008: error does NOT auto-dismiss', async () => { ... });
  it('3.8-TEST-009: max 3 toasts visible', () => { ... });
  it('3.8-TEST-010: warning is dismissible', () => { ... });
  it('3.8-TEST-011: success is NOT dismissible', () => { ... });
  it('3.8-TEST-012: clear() removes all toasts and timers', () => { ... });
});
```

#### image-upload-progress.test.ts

```typescript
describe('[P0] image-service upload progress', () => {
  it('3.8-TEST-013: calls uploadBytesResumable instead of uploadBytes', async () => { ... });
  it('3.8-TEST-014: onProgress callback receives percentage', async () => { ... });
  it('3.8-TEST-015: upload without onProgress still works', async () => { ... });
  it('3.8-TEST-016: replace passes onProgress to upload', async () => { ... });
});
```

**Mock for uploadBytesResumable:**
```typescript
const mockOn = vi.fn((event, next, error, complete) => {
  // Simulate progress
  next({ bytesTransferred: 50, totalBytes: 100, state: 'running' });
  next({ bytesTransferred: 100, totalBytes: 100, state: 'running' });
  complete();
});

const mockUploadTask = { on: mockOn };
const mockUploadBytesResumable = vi.fn(() => mockUploadTask);
```

### Validation Rules

| Item | Rule |
|---|---|
| `getFirestoreErrorMessage()` | Must ONLY live in `error-messages.ts` — zero copies in components |
| Toast types | `'success' \| 'error' \| 'warning'` — no `'info'` type yet (not needed for admin) |
| Upload progress | Only on components that use ImageUploader (ProjectForm, TechnologyForm) |
| Double-submit guard | `if (saving) return;` — first line of `handleSubmit()` in all 3 forms |
| `aria-busy` | Only on submit buttons, only when `saving` is true |

### Project Structure Notes

**New files:**
- `src/lib/utils/error-messages.ts`
- `src/lib/utils/__tests__/error-messages.test.ts`
- `src/lib/utils/__tests__/toast-store.test.ts`
- `src/lib/firebase/__tests__/image-upload-progress.test.ts`

**Modified files:**
- `src/lib/utils/toast-store.svelte.ts` — add warning type + 6s timer
- `src/components/admin/Toast.svelte` — add warning styling
- `src/components/admin/ImageUploader.svelte` — add uploadProgress prop + progress bar UI
- `src/lib/firebase/image-service.ts` — uploadBytesResumable + onProgress callback
- `src/components/admin/TechnologiesCrudPage.svelte` — import centralized error fn, delete local
- `src/components/admin/TechnologyForm.svelte` — import centralized error fn, delete local, double-submit guard, aria-busy
- `src/components/admin/ProjectsCrudPage.svelte` — import centralized error fn, delete local
- `src/components/admin/ProjectForm.svelte` — import centralized error fn, delete local, double-submit guard, aria-busy, upload progress
- `src/components/admin/ExperiencesCrudPage.svelte` — import centralized error fn, delete local
- `src/components/admin/ExperienceForm.svelte` — import centralized error fn, delete local, double-submit guard, aria-busy
- `src/lib/i18n/translations.ts` — add ~6 new error message keys

### Previous Story Intelligence (from 3.7)

- `getFirestoreErrorMessage()` duck-typed code property — SAME signature, now centralized
- Story 3.6 code review explicitly said: "Do NOT use specific error toast keys" — this story fixes the 2 remaining violations
- Code review D-3 deferred: "No guard in handleSubmit before entering create/edit handler" — this story addresses it
- Code review D-4 deferred: "BilingualField IDs don't follow `exp-{fieldname}` pattern" — NOT in scope for this story
- Story 3.7 had 47 tests across 3 files — this story targets ~16 tests across 3 files (utility-focused, not component-rendering)
- All CRUD pages follow identical patterns — changes can be applied mechanically

### Git Intelligence

Recent commits show:
- `feat: implement story X.X` — main implementation commit
- `fix: code review story X.X` — post-review patches
- All stories pass quality gates: 0 type errors, 0 lint errors, all tests green
- Consistent pattern: schema → components → page wiring → i18n → tests

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Epic 3, Story 3.8]
- [Source: _bmad-output/planning-artifacts/architecture.md#Error Handling Pattern]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Feedback Patterns, UX-DR19, UX-DR35, UX-DR36]
- [Source: _bmad-output/planning-artifacts/prd.md#NFR7, NFR28]
- [Source: _bmad-output/project-context.md#Rules 1-68]
- [Source: _bmad-output/implementation-artifacts/3-7-crud-experiences.md#Code Review Record]

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
