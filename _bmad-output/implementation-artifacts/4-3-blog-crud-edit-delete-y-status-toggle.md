# Story 4.3: Blog CRUD — Edit, Delete y Status Toggle

Status: ready-for-dev

## Story

As Christopher (admin),
I want to edit articles, toggle their publish status, and delete them with asset cleanup,
So that I have full control over my blog content lifecycle.

## Acceptance Criteria

1. **Given** I click edit on an article **When** form opens **Then** all fields pre-populated including rich text content in the TipTap editor.
2. **And** I can change status between published and draft with a toggle — saving reflects immediately.
3. **And** clicking delete shows ConfirmDialog: "¿Eliminar '[title]'? Se eliminarán la portada y N imágenes embebidas de Storage."
4. **And** confirming delete: cover image + all embedded images deleted from Storage via `deleteByPrefix('blog/{postId}/')`, document deleted, toast, returns to list.
5. **And** replacing cover image follows ImageSlot replace flow (upload new, delete old from Storage).

**(FR33, FR34, FR35)**

## Scope Note

Story 4-1 built the full BlogCrudPage infrastructure (list + create + delete + edit skeleton) so all CRUD modes exist structurally. **This story focuses on:**

1. **Fixing the cover image lifecycle bug** — BlogForm.handleSubmit ignores `processed.toDelete` from `processImageSlot()`, so replaced/removed cover images are never cleaned from Storage. ProjectForm does this correctly (lines 358-365); BlogForm must follow the same pattern.
2. **Orphaned inline image cleanup on edit save** — When a user removes inline images from TipTap content during editing, those `StoredImage` files remain in Storage. Compare `initialData.images` vs final `mergedImages`, delete the difference.
3. **Enhanced delete confirmation** — Current i18n key is generic ("imágenes asociadas"). Update to show specific count: cover + N embedded images.
4. **Comprehensive edit/delete/status tests** — Unit tests for the fixed lifecycle and E2E tests for the full edit flow.

**Out of scope:** Orphaned images from abandoned forms (user opens create, uploads images, then navigates away without saving). This is a known limitation across all entity forms.

## Tasks / Subtasks

- [ ] Task 1: Fix cover image lifecycle in BlogForm edit save (AC: #5)
  - [ ] 1.1 Import `cleanupDeletedImages` from `../../lib/firebase/image-slot-processor` in `BlogForm.svelte`
  - [ ] 1.2 After `processImageSlot()` (line ~286), collect `processed.toDelete` array
  - [ ] 1.3 Handle cover removed case: when `coverImageSlot.type === 'removed'` (NOT just `processed.image === null`, which also matches 'empty'), call `updateDoc` with `coverImage: deleteField()` to clear from Firestore — import `deleteField` from `firebase/firestore`
  - [ ] 1.4 Handle `processed.image` truthy case (new or replaced cover): existing `updateDoc` with `coverImage: processed.image` (already works)
  - [ ] 1.5 After document update, call `cleanupDeletedImages(processed.toDelete)` wrapped in non-blocking try-catch (orphans OK, same pattern as ProjectForm lines 358-365)
  - [ ] 1.6 Handle edge case: if `coverImageSlot.type === 'existing'` (no change), processImageSlot returns `{ image: slot.image, toDelete: [] }` — no cleanup needed, no updateDoc needed for coverImage

- [ ] Task 2: Orphaned inline image cleanup on edit save (AC: #1, #5)
  - [ ] 2.1 In `handleSubmit()`, after computing `mergedImages`, compare against initial images to find orphans: `const orphanedImages = (initialData?.images ?? []).filter(img => !mergedImages.some(m => m.storagePath === img.storagePath))`
  - [ ] 2.2 For each orphaned image, delete from Storage via `imageService.delete(orphan)` where `orphan` is a `StoredImage` object — non-blocking, try-catch with `console.warn` (same pattern as cover image cleanup). Note: `imageService.delete` signature is `deleteSingle(image: StoredImage): Promise<void>` — takes the full StoredImage, not just the path
  - [ ] 2.3 Only run orphan cleanup in edit mode (`mode === 'edit' && initialData`)
  - [ ] 2.4 Run orphan cleanup AFTER document save succeeds (safe-first: Firestore updated first, then Storage cleanup)

- [ ] Task 3: Enhanced delete confirmation message (AC: #3)
  - [ ] 3.1 Update i18n keys in `translations.ts`:
    - `admin.blog.deleteConfirmMessage`: Change to "¿Eliminar '{name}'? Se eliminarán la portada y {imageCount} imágenes embebidas de Storage." / "Delete '{name}'? The cover image and {imageCount} embedded images will be deleted from Storage."
    - `admin.blog.deleteConfirmMessageNoImages`: "¿Eliminar '{name}'? Se eliminará la portada de Storage." / "Delete '{name}'? The cover image will be deleted from Storage."
    - `admin.blog.deleteConfirmMessageNoCover`: "¿Eliminar '{name}'? Se eliminarán {imageCount} imágenes embebidas de Storage." / "Delete '{name}'? {imageCount} embedded images will be deleted from Storage."
    - `admin.blog.deleteConfirmMessageEmpty`: "¿Eliminar '{name}'?" / "Delete '{name}'?"
  - [ ] 3.2 Update `deleteDialogMessage` derived in `BlogCrudPage.svelte`: compute `hasCover = !!deletingPost.coverImage`, `imageCount = deletingPost.images?.length ?? 0`, select appropriate i18n key based on combination, replace `{name}` and `{imageCount}` placeholders

- [ ] Task 4: Unit tests — cover image lifecycle fix (AC: #5)
  - **Note:** `blog-form.test.ts` already mocks `processImageSlot` (vi.mock) and Firestore ops (`mockSetDoc`, `mockUpdateDoc`, `mockDoc`). **Extend the existing mock setup** — add `cleanupDeletedImages` mock to the `image-slot-processor` mock module and add `imageService.delete` mock to a new `image-service` mock module. Do NOT create a separate mock setup.
  - [ ] 4.1 In `blog-form.test.ts`, add test: edit mode with replaced cover image → on submit, `processImageSlot` returns `toDelete: ['old/path.webp']` → verify `cleanupDeletedImages` called with old path
  - [ ] 4.2 Add test: edit mode with removed cover image → on submit, `updateDoc` called with `coverImage: deleteField()` AND `cleanupDeletedImages` called with old path
  - [ ] 4.3 Add test: edit mode with unchanged cover image (type 'existing') → `cleanupDeletedImages` NOT called (no orphans)
  - [ ] 4.4 Add test: cover image cleanup failure doesn't block save (try-catch, document already saved)

- [ ] Task 5: Unit tests — orphaned inline image cleanup (AC: #1, #5)
  - **Note:** Reuse the `imageService.delete` mock added in Task 4. The mock for `image-service` must export both `imageService` (value) and `UploadHandle` (type) to match the modified import in BlogForm.
  - [ ] 5.1 In `blog-form.test.ts`, add test: edit mode, initialData has 3 images, after edit content only references 2 → verify `imageService.delete()` called for orphaned image's storagePath
  - [ ] 5.2 Add test: edit mode, no images removed → `imageService.delete()` NOT called
  - [ ] 5.3 Add test: create mode → orphan cleanup NOT executed (no initialData to compare)
  - [ ] 5.4 Add test: orphan cleanup failure doesn't block save (non-blocking try-catch)

- [ ] Task 6: Unit tests — delete confirmation with image count (AC: #3)
  - **Note:** `blog-crud.test.ts` already has a basic delete dialog message test (lines 176-187) that tests the current generic message with `{name}` substitution. **Replace/extend that existing test** with the four variants below — do NOT create a duplicate test suite.
  - [ ] 6.1 In `blog-crud.test.ts`, add test: post with coverImage + 3 embedded images → dialog message shows "portada y 3 imágenes embebidas"
  - [ ] 6.2 Add test: post with coverImage but 0 embedded images → dialog shows "portada de Storage"
  - [ ] 6.3 Add test: post without coverImage but 2 embedded images → dialog shows "2 imágenes embebidas"
  - [ ] 6.4 Add test: post with no images at all → dialog shows just "¿Eliminar '{name}'?"

- [ ] Task 7: E2E tests — edit flow (AC: #1, #2, #5)
  - [ ] 7.1 In `admin-blog.spec.ts`, add test: create article with title/content/draft status → click edit → verify all fields populated (title ES, title EN, slug, status, content in TipTap editors) → change title → change status to published → save → verify list shows updated title + "Publicado" badge
  - [ ] 7.2 Add test: edit article → modify content in TipTap editor → save → edit again → verify modified content persisted
  - [ ] 7.3 Add test: edit article → make no changes → cancel → no unsaved changes warning (hasChanges is false after init)
  - [ ] 7.4 Add test: edit article → change title → cancel → unsaved changes warning appears → confirm discard → returns to list
  - [ ] 7.5 Cleanup: delete test articles created during edit tests

- [ ] Task 8: E2E tests — delete with verification (AC: #3, #4)
  - [ ] 8.1 In `admin-blog.spec.ts`, add test: create article → click delete → verify ConfirmDialog shows correct message with title → confirm → verify article removed from list → verify toast shown

## Dev Notes

### Critical Bug: Cover Image Lifecycle in BlogForm (Task 1)

**Current BlogForm.svelte (lines 284-303):**
```typescript
// Process cover image
try {
  const processed = await processImageSlot(
    coverImageSlot,
    `blog/${docId}/`,
    (p) => { coverImageProgress = p; },
  );
  coverImageProgress = null;

  if (processed.image) {
    await updateDoc(doc(db, BLOG_COLLECTION, docId), {
      coverImage: processed.image,
    });
  }
  // ⚠️ BUG: processed.toDelete is NEVER processed
  // ⚠️ BUG: processed.image === null (removed) doesn't clear coverImage field
```

**ProjectForm.svelte (lines 358-365) — correct pattern:**
```typescript
const allDeletePaths = [
  ...mainProcessed.toDelete,
  ...screenshotResults.flatMap((r) => r.toDelete),
];
if (allDeletePaths.length > 0) {
  await cleanupDeletedImages(allDeletePaths);
}
```

**Fix — apply the same pattern to BlogForm:**
```typescript
try {
  const processed = await processImageSlot(
    coverImageSlot,
    `blog/${docId}/`,
    (p) => { coverImageProgress = p; },
  );
  coverImageProgress = null;

  // Update Firestore with new image or clear if removed
  if (processed.image) {
    await updateDoc(doc(db, BLOG_COLLECTION, docId), {
      coverImage: processed.image,
    });
  } else if (coverImageSlot.type === 'removed') {
    await updateDoc(doc(db, BLOG_COLLECTION, docId), {
      coverImage: deleteField(),
    });
  }
  // else: type 'empty' or 'existing' — no coverImage update needed

  // Cleanup old images from Storage (non-blocking)
  if (processed.toDelete.length > 0) {
    try {
      await cleanupDeletedImages(processed.toDelete);
    } catch (cleanupError) {
      console.warn('Cover image cleanup failed (orphans may remain):', cleanupError);
    }
  }
} catch (uploadError) {
  console.error('Cover image processing failed:', uploadError);
} finally {
  activeUploads = [];
}
```

**Imports to add in BlogForm.svelte:**
```typescript
import { deleteField } from 'firebase/firestore';
import { cleanupDeletedImages } from '../../lib/firebase/image-slot-processor';
```

### Orphaned Inline Image Cleanup (Task 2)

When editing a post, the user may remove inline images from TipTap content. After `extractImagesFromContent()` runs, the resulting `mergedImages` will exclude images no longer in the content. But the actual files remain in Storage.

**Pattern — add AFTER document save in handleSubmit():**
```typescript
// Cleanup orphaned inline images (edit mode only)
if (mode === 'edit' && initialData) {
  const orphanedImages = (initialData.images ?? []).filter(
    (img) => !mergedImages.some((m) => m.storagePath === img.storagePath),
  );
  for (const orphan of orphanedImages) {
    try {
      await imageService.delete(orphan); // Takes StoredImage object, not path string
    } catch (cleanupError) {
      console.warn(`Orphaned image cleanup failed for ${orphan.storagePath}:`, cleanupError);
    }
  }
}
```

**`imageService.delete` API** (from `image-service.ts:101-103`):
```typescript
async function deleteSingle(image: StoredImage): Promise<void> {
  await withRetry(() => deleteObject(ref(storage, image.storagePath)));
}
export const imageService = { upload, replace, delete: deleteSingle, deleteByPrefix };
```
Takes a `StoredImage` object (with `url` and `storagePath`), not a bare path string.

**Placement:** After the Firestore document is updated (line ~282) and before cover image processing. This ensures the document reflects the correct images[] array before any cleanup.

**Import required:** `imageService` must be added to BlogForm.svelte imports. Line 4 is currently a **type-only import**: `import type { UploadHandle } from '../../lib/firebase/image-service';` — **MODIFY this existing line** (do NOT add a second import) to: `import { imageService, type UploadHandle } from '../../lib/firebase/image-service';`

### Delete Confirmation Message Enhancement (Task 3)

**Current (generic):**
```
"¿Eliminar '{name}'? Se eliminarán también las imágenes asociadas."
```

**Required (specific, per AC #3):**
```
"¿Eliminar '{name}'? Se eliminarán la portada y 3 imágenes embebidas de Storage."
```

**Logic in BlogCrudPage.svelte:**
```typescript
let deleteDialogMessage = $derived.by(() => {
  if (!deletingPost) return '';
  const hasCover = !!deletingPost.coverImage;
  const imageCount = deletingPost.images?.length ?? 0;

  if (hasCover && imageCount > 0) {
    return t('admin.blog.deleteConfirmMessage', locale)
      .replace('{name}', deletingPost.title.es)
      .replace('{imageCount}', String(imageCount));
  } else if (hasCover && imageCount === 0) {
    return t('admin.blog.deleteConfirmMessageNoImages', locale)
      .replace('{name}', deletingPost.title.es);
  } else if (!hasCover && imageCount > 0) {
    return t('admin.blog.deleteConfirmMessageNoCover', locale)
      .replace('{name}', deletingPost.title.es)
      .replace('{imageCount}', String(imageCount));
  } else {
    return t('admin.blog.deleteConfirmMessageEmpty', locale)
      .replace('{name}', deletingPost.title.es);
  }
});
```

### Edit Mode — Already Working (Verification Only)

The following edit features were built in Story 4-1 and are structurally complete:
- **BlogCrudPage** `handleEdit(post)` → sets `editingPost`, switches to `viewMode: 'edit'`
- **BlogForm** `$effect` init guard with `initializedForId` → populates all fields from `initialData`
- **TipTap content loading**: `contentEs` and `contentEn` populated from `initialData.content.es/.en` → RichTextEditor receives as `content` prop
- **Slug in edit mode**: `slugManuallyEdited = true` prevents auto-generation overwriting the existing slug
- **Slug uniqueness**: `isSlugUnique(slug, excludeId)` passes `initialData.id` as excludeId in edit mode
- **Status field**: `<select>` with draft/published options, populated from `initialData.status`
- **updateDoc** in edit mode (line 278-279)
- **uploadedImages seeded** from `initialData.images ?? []` (line 80) — ensures pre-existing inline images survive save

**Do NOT re-implement these.** Focus on the bugs and gaps listed in Tasks 1-3.

### Existing Patterns to REUSE

| Pattern | Source File | What to Reuse |
|---|---|---|
| Cover cleanup with toDelete | `ProjectForm.svelte:358-365` | `cleanupDeletedImages(processed.toDelete)` pattern |
| deleteField() for null fields | `firebase/firestore` | `deleteField()` to remove coverImage from Firestore |
| Non-blocking image cleanup | `BlogCrudPage.svelte:64-68` | `try-catch + console.warn` pattern for Storage cleanup |
| Image service delete | `image-service.ts` | Check for `delete(path)` or `deleteByPath(path)` method |
| i18n with placeholders | `translations.ts` | `.replace('{name}', value).replace('{count}', String(n))` |
| E2E admin helpers | `tests/e2e/admin-helpers.ts` | `ensureAdminLogin()`, `fillVisible()`, `clickListAction()` |
| E2E TipTap interaction | `admin-blog.spec.ts` | `page.locator('.ProseMirror')`, `page.keyboard.type()` |

### File Structure

```
src/components/admin/
  ├── BlogForm.svelte                # MODIFY — fix cover lifecycle, add orphan cleanup
  ├── BlogCrudPage.svelte            # MODIFY — enhanced delete message with image count
  └── __tests__/
      ├── blog-form.test.ts          # MODIFY — add edit lifecycle tests
      └── blog-crud.test.ts          # MODIFY — add delete dialog message tests

src/lib/i18n/
  └── translations.ts               # MODIFY — add deleteConfirmMessage variants

tests/e2e/
  └── admin-blog.spec.ts            # MODIFY — add edit flow + delete verification E2E
```

### Accessibility Requirements

- No new components — all existing a11y (dialogs, forms, badges) from Story 4-1 applies
- Status change via `<select>` (keyboard accessible, `<label>` with `for` attribute)
- Delete dialog: already has `role="alertdialog"`, `aria-modal`, `aria-labelledby`, `aria-describedby`
- Unsaved changes: `window.confirm()` is natively accessible

### Previous Story Learnings (Stories 4-1 and 4-2)

- **TipTap cursor loss bug**: Fixed with `untrack()` — don't add reactive dependencies in RichTextEditor `$effect`
- **Slug from EN (defaultLocale)**: Confirmed correct in current code — `slugify(titleEn)`, NOT `titleEs`
- **Double-submit guard**: `if (saving) return;` at top of handleSubmit — already in place
- **Edit mode seeds uploadedImages**: `initialData.images ?? []` at line 80 — critical for inline image tracking during save
- **Code review tautological tests**: Avoid test patterns like `expect(mock).toHaveBeenCalled()` without verifying arguments or sequence
- **Cancel during upload**: ImageUploadDialog handles cancel/Escape during active upload correctly (4-2 fix)

### Testing Strategy

**Unit tests (Vitest):**
- Mock `cleanupDeletedImages` and `imageService.delete` via `vi.mock()`
- Verify call order: document save FIRST, then Storage cleanup
- Verify non-blocking behavior: cleanup failure doesn't throw
- Verify delete dialog message variants with different image counts

**E2E tests (Playwright):**
- Full edit round-trip: create → edit → change → save → verify
- Use `page.locator('.ProseMirror')` for TipTap content verification
- Use `page.locator('select#blog-status')` for status toggle
- Use existing `clickListAction(page, title, 'edit')` helper
- Idempotent: create and delete test data within each test

**Coverage target:** ~6 new unit tests (lifecycle + delete dialog) + ~5 E2E tests (edit flow + delete verification).

### Line Number Note

Line numbers referenced in this story (e.g., 284-303, 80, 358-365) are approximate snapshots. Search by content/function name rather than relying on exact line numbers — they may shift if other changes land first.

### Project Structure Notes

- No new files — only modifications to existing components
- Follow existing kebab-case/PascalCase conventions
- `deleteField()` is a Firestore sentinel value — removes the field from the document entirely
- `cleanupDeletedImages` already exported from `image-slot-processor.ts` — just import it
- Admin locale fixed to `'es'` for all `t()` calls

### References

**Planning artifacts:**
- [epics.md#Epic 4, Story 4.3] — Acceptance criteria, FR33, FR34, FR35
- [architecture.md#Image Lifecycle] — StoredImage, ImageSlot, safe-first operations, Storage paths
- [ux-design-specification.md#Journey 3] — Blog editor UX flow, CRUD consistency

**Implementation context:**
- [4-1-blog-crud-list-create-y-editor-rico.md] — BlogCrudPage built with edit skeleton, TipTap integration, delete flow
- [4-2-blog-image-insertion-in-content.md] — ImageUploadDialog, extractImagesFromContent, uploadedImages seeding, deferred orphan cleanup to 4-3
- [project-context.md] — Image lifecycle (safe-first), processImageSlot, cleanupDeletedImages, deleteField patterns

**Codebase (modify):**
- [src/components/admin/BlogForm.svelte:284-303] — Fix: add toDelete handling + orphan cleanup
- [src/components/admin/BlogCrudPage.svelte:84-88] — Fix: enhanced delete dialog message
- [src/lib/i18n/translations.ts:327-329] — Add: delete message variants
- [src/components/admin/__tests__/blog-form.test.ts] — Add: edit lifecycle tests
- [src/components/admin/__tests__/blog-crud.test.ts] — Add: delete dialog tests
- [tests/e2e/admin-blog.spec.ts] — Add: edit flow E2E

**Codebase (reference — correct pattern):**
- [src/components/admin/ProjectForm.svelte:358-365] — cleanupDeletedImages pattern to replicate
- [src/lib/firebase/image-slot-processor.ts] — processImageSlot + cleanupDeletedImages API
- [src/lib/firebase/image-service.ts] — imageService.delete/deleteByPrefix API

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
