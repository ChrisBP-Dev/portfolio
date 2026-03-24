# Story 4.2: Blog — Image Insertion in Content

Status: review

## Story

As Christopher (admin),
I want to insert images directly into blog article content,
So that my technical articles include screenshots, diagrams and visual explanations.

## Acceptance Criteria

1. **Given** the RichTextEditor **When** I click the image button in toolbar **Then** an ImageUploader dialog opens (replaces current `window.prompt()` flow).
2. **And** after selecting/dropping an image, it uploads to Storage under `blog/{postId}/images/{uuid}.webp` via ImageService.
3. **And** the uploaded image appears inline in the editor content at cursor position.
4. **And** the image `StoredImage` reference is added to the BlogPost `images[]` array for lifecycle tracking.
5. **And** images embedded in content render correctly in the editor preview.

**(FR32)**

## Scope Note

This story replaces the temporary `window.prompt()` image insertion in RichTextEditor (Story 4-1) with a proper file upload dialog using the existing ImageUploader component. The `images[]` array in BlogPost must be populated on save by scanning the TipTap JSON for image nodes and matching them to uploaded StoredImage references.

**Out of scope:** Image deletion/orphan cleanup for removed inline images (handled in Story 4-3 edit/delete flow). Image rendering on public pages (Story 4.5).

## Tasks / Subtasks

- [x] Task 1: Create ImageUploadDialog.svelte (AC: #1)
  - [x] 1.1 Create `src/components/admin/ImageUploadDialog.svelte` — a modal dialog wrapping ImageUploader for inline content images
  - [x] 1.2 Props: `open: boolean`, `onClose: () => void`, `onImageUploaded: (image: StoredImage, alt: string) => void`, `postId: string`
  - [x] 1.3 Use ConfirmDialog's modal pattern: `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, backdrop click/Escape to close, focus trap, body scroll lock
  - [x] 1.4 Inside dialog: render `<ImageUploader>` with `label={t('admin.blog.insertImage', locale)}` and bind slot state
  - [x] 1.5 "Insertar" button (primary, disabled until slot type is `'new'`) — on click: upload file via `imageService.upload(file, \`blog/${postId}/images/${crypto.randomUUID()}.webp\`, onProgress)`, show progress, on success call `onImageUploaded(storedImage)` then `onClose()`
  - [x] 1.6 "Cancelar" button (secondary) — calls `onClose()`, revokes any preview objectURL. On successful upload+close, also revoke the preview objectURL before closing
  - [x] 1.7 Upload progress bar inside dialog (reuse ImageUploader's built-in progress or add inline progress)
  - [x] 1.8 Error handling: if upload fails, show error toast via `toastStore.error()`, keep dialog open for retry
  - [x] 1.9 Add optional `altText` input field (empty by default) — passed to `onImageUploaded` for accessibility. Label: `t('admin.blog.imageAltText', locale)`
  - [x] 1.10 `$effect` cleanup: cancel active `UploadHandle` on unmount, revoke objectURLs

- [x] Task 2: Add `onInsertImage` callback prop to RichTextEditor (AC: #1, #3)
  - [x] 2.1 Add new prop `onInsertImage?: () => void` to RichTextEditor.svelte `Props` interface
  - [x] 2.2 Replace `insertImage()` body: if `onInsertImage` prop is provided, call `onInsertImage()` instead of `window.prompt()`. If no callback, keep `window.prompt()` as fallback (backward-compat safety)
  - [x] 2.5 Prevent TipTap Image extension from accepting pasted/dropped base64 images — configure `Image.configure({ allowBase64: false })` so only URLs inserted via `insertImageAtCursor()` are accepted. This prevents untracked data-URL images in content
  - [x] 2.3 Add `insertImageAtCursor(src: string, alt?: string)` exported function that parent can call after upload completes: `editor.chain().focus().setImage({ src, alt }).run()`
  - [x] 2.4 Ensure exported function restores cursor to last known position if editor lost focus during dialog interaction

- [x] Task 3: Wire ImageUploadDialog in BlogForm (AC: #1, #2, #3)
  - [x] 3.1 Add state: `let imageDialogOpen = $state(false)`, `let activeEditorRef: 'es' | 'en' = $state('es')`, `let editorRefEs: RichTextEditor`, `let editorRefEn: RichTextEditor`
  - [x] 3.2 Pass `onInsertImage` callback to both RichTextEditor instances — callback sets `activeEditorRef` to the respective locale and opens dialog (`imageDialogOpen = true`)
  - [x] 3.3 Add `bind:this` on both RichTextEditor components to get component refs
  - [x] 3.4 Render `<ImageUploadDialog>` in BlogForm template with `postId={currentPostId}` — handle `postId` availability (see Task 5 for pre-create flow)
  - [x] 3.5 `onImageUploaded` handler: call `editorRef[activeEditorRef].insertImageAtCursor(image.url, alt)` → track image in `uploadedImages` array
  - [x] 3.6 Add `let uploadedImages = $state<StoredImage[]>([])` to track all inline images. **In edit mode, seed from `initialData?.images ?? []`** during form initialization (alongside existing initialData hydration) — without this, pre-existing inline images are lost on save because `extractImagesFromContent()` won't match them
  - [x] 3.7 UploadHandle cleanup: track active dialog upload handle in `$state`, cancel on form unmount via `$effect` return

- [x] Task 4: Populate `images[]` array on save (AC: #4)
  - [x] 4.1 Create helper `extractImagesFromContent(contentJson: string, uploadedImages: StoredImage[]): StoredImage[]` in `src/lib/utils/tiptap-helpers.ts`
  - [x] 4.2 Logic: parse TipTap JSON, find all `type: 'image'` nodes, extract `src` URLs, match each URL against `uploadedImages` array by `url` field, return only matched StoredImage objects (this ensures only uploaded images are tracked, not external URLs)
  - [x] 4.3 In BlogForm `handleSubmit()`: before saving, call `extractImagesFromContent()` for both ES and EN content, merge unique images (dedupe by `storagePath`), set as `images` field in Firestore document
  - [x] 4.4 Replace the hardcoded `images: []` in the create payload (line ~234 in BlogForm.svelte) with the merged images array

- [x] Task 5: Handle postId for image upload paths (AC: #2)
  - [x] 5.1 Problem: inline images need `blog/{postId}/images/{uuid}.webp` path, but postId doesn't exist until document is created
  - [x] 5.2 Solution: use pre-generated document ID — `const docRef = doc(collection(db, 'BlogPosts'))` to get ID before saving, then use `docRef.id` for both image paths and `setDoc(docRef, data)` instead of `addDoc`
  - [x] 5.3 Refactor BlogForm create flow: generate `docRef` at form mount (NOT lazily on first image insert — avoids null postId race when dialog opens), pass `docRef.id` to ImageUploadDialog as `postId`
  - [x] 5.4 Update `handleSubmit()`: use `setDoc(docRef, data)` for create mode (replaces current `addDoc()`)
  - [x] 5.5 In edit mode: `postId` is `initialData.id` — no change needed

- [x] Task 6: Add i18n keys (AC: all)
  - [x] 6.1 Add to `translations.ts` under `admin.blog.*`:
    - `admin.blog.insertImage` — "Insertar imagen" / "Insert image"
    - `admin.blog.insertImageTitle` — "Insertar imagen en contenido" / "Insert image in content"
    - `admin.blog.uploading` — "Subiendo imagen..." / "Uploading image..."
    - `admin.blog.insertButton` — "Insertar" / "Insert"
    - `admin.blog.imageUploadError` — "Error al subir la imagen. Intente de nuevo." / "Failed to upload image. Please try again."
    - `admin.blog.imageAltText` — "Texto alternativo (opcional)" / "Alt text (optional)"

- [x] Task 7: Unit tests (AC: all)
  - [x] 7.1 `src/components/admin/__tests__/image-upload-dialog.test.ts` (~8 tests): render open/closed, upload flow mock, progress display, error handling, cancel cleanup, a11y attributes (role, aria-modal), Escape close
  - [x] 7.2 `src/lib/__tests__/tiptap-helpers.test.ts` — add tests for `extractImagesFromContent()`: empty content, content with images, content with external URLs (not tracked), deduplication across locales, malformed JSON
  - [x] 7.3 Update `src/components/admin/__tests__/blog-form.test.ts` — add tests: image dialog opens on editor callback, uploaded image tracked in state, images[] populated on save, postId pre-generation, **edit mode seeds uploadedImages from initialData.images** (critical: verify pre-existing images survive save)

- [x] Task 8: E2E tests (AC: #1, #2, #3, #5)
  - [x] 8.1 In `tests/e2e/admin-blog.spec.ts` add test: create article → click image button in toolbar → dialog opens → upload image file → image appears in editor content → save → verify images[] in created document (via Firestore query or re-load edit)
  - [x] 8.2 Test image preview renders in TipTap editor after insertion (visible `<img>` in `.ProseMirror`)
  - [x] 8.3 Test dialog cancel: open dialog → cancel → editor state unchanged
  - [x] 8.4 Use test image file from `tests/fixtures/test-image.png` — create a minimal 1x1 pixel PNG if not exists (e.g., via `Buffer.from('iVBOR...', 'base64')` in test setup or commit a small static file)

## Dev Notes

### Current State (From Story 4-1)

**RichTextEditor.svelte (lines 107-113):**
```typescript
function insertImage(): void {
  const editor = getEditor();
  if (!editor) return;
  const url = window.prompt('URL de imagen');
  if (!url) return;
  editor.chain().focus().setImage({ src: url }).run();
}
```
This `window.prompt()` is the placeholder to replace. The toolbar button already exists and works.

**BlogForm.svelte (line ~234):**
```typescript
images: [],  // Always empty — Story 4-2 populates this
```

**blog-post-schema.ts (line 10):**
```typescript
images: z.array(storedImageSchema),  // Field exists, defaults to [] in Firestore schema
```
Schema is ready — no changes needed.

### Architecture Decision: ImageUploadDialog vs Inline Reuse

**DO NOT reuse ImageUploader directly as a dialog.** ImageUploader is a form field (drag-drop zone + preview) designed for single-slot use. Story 4-2 needs a **modal dialog** wrapper that:
1. Opens/closes on demand from the editor toolbar
2. Handles immediate upload (not deferred to form save like cover image)
3. Returns the `StoredImage` with URL for instant editor insertion
4. Manages its own upload lifecycle independently from the form

**Pattern:** New `ImageUploadDialog.svelte` that wraps `ImageUploader` inside a dialog modal. Uses `imageService.upload()` directly (not `processImageSlot` — no replace/remove states needed for inline images).

### postId Pre-Generation Pattern (Critical)

Inline images need a Storage path like `blog/{postId}/images/{uuid}.webp`. In create mode, the postId doesn't exist yet because no doc has been created.

**Solution:** Pre-generate a Firestore document reference at form mount:
```typescript
import { collection, doc, setDoc } from 'firebase/firestore';

// At form mount — generate immediately, not lazily
const docRef = doc(collection(db, BLOG_COLLECTION));
const postId = docRef.id;  // Available immediately, no network call

// Later, in handleSubmit:
await setDoc(docRef, payload);  // Instead of addDoc()
```

This is a safe, standard Firestore pattern. The ID is client-generated and guaranteed unique.

### Image Tracking Flow

```
1. Form mounts → uploadedImages seeded from initialData.images (edit) or [] (create)
2. User clicks image button in editor toolbar
3. BlogForm opens ImageUploadDialog with postId
4. User selects/drops image → ImageUploader shows preview
5. User optionally enters alt text
6. User clicks "Insertar" → imageService.upload(file, `blog/${postId}/images/${crypto.randomUUID()}.webp`)
7. On success: onImageUploaded(storedImage, alt) → BlogForm stores in uploadedImages[]
8. BlogForm calls editorRef.insertImageAtCursor(storedImage.url, alt)
9. TipTap inserts <img src="url" alt="..."> at cursor position
10. On form save: extractImagesFromContent() scans TipTap JSON for image nodes
11. Matches image URLs to uploadedImages[] → final images[] for Firestore
```

**Edit mode critical path:** Step 1 ensures pre-existing images are in `uploadedImages[]`, so step 11 matches them correctly. Without seeding, all pre-existing inline images would be dropped from `images[]` on save.

### extractImagesFromContent Helper

```typescript
// src/lib/utils/tiptap-helpers.ts

export function extractImagesFromContent(
  contentJson: string,
  uploadedImages: StoredImage[],
): StoredImage[] {
  try {
    const doc = JSON.parse(contentJson);
    const imageUrls = new Set<string>();
    findImageNodes(doc, imageUrls);
    return uploadedImages.filter(img => imageUrls.has(img.url));
  } catch {
    return [];
  }
}

function findImageNodes(node: unknown, urls: Set<string>): void {
  if (!node || typeof node !== 'object') return;
  const n = node as Record<string, unknown>;
  if (n.type === 'image' && typeof n.attrs === 'object' && n.attrs !== null) {
    const src = (n.attrs as Record<string, unknown>).src;
    if (typeof src === 'string') urls.add(src);
  }
  if (Array.isArray(n.content)) {
    for (const child of n.content) findImageNodes(child, urls);
  }
}
```

**Why match against uploadedImages instead of trusting all image URLs?** Security: only track images we actually uploaded to our Storage. External URLs (if user pastes HTML) are not tracked and won't generate orphans.

**Edit mode:** `uploadedImages` must be seeded from `initialData.images` at form init, so pre-existing inline images are matched during save. New uploads are appended to the same array.

### RichTextEditor Export Pattern

To call `insertImageAtCursor()` from BlogForm, the RichTextEditor must export the function:

```svelte
<!-- RichTextEditor.svelte -->
<script lang="ts">
  // ... existing code ...

  export function insertImageAtCursor(src: string, alt = ''): void {
    const editor = getEditor();
    if (!editor) return;
    editor.chain().focus().setImage({ src, ...(alt ? { alt } : {}) }).run();
  }
</script>
```

BlogForm accesses it via `bind:this`:
```svelte
<RichTextEditor bind:this={editorRefEs} ... />
```

### Dialog Modal Pattern (Follow ConfirmDialog — with one difference)

The existing `ConfirmDialog.svelte` uses this modal pattern — follow it for focus trap, backdrop, body scroll lock, Escape close, and `$effect` cleanup. **One key difference:** ConfirmDialog uses `role="alertdialog"` (destructive confirmation), but ImageUploadDialog must use `role="dialog"` (non-alert, standard modal).

- `role="dialog"` (NOT `alertdialog` — this is not an alert)
- `aria-modal="true"`
- `aria-labelledby` pointing to dialog title
- Backdrop with `onclick` → close
- Escape key → close
- Focus trap (tab stays inside dialog)
- `document.body.style.overflow = 'hidden'` on open, restored on close
- `$effect` cleanup for event listeners

### Storage Path Convention

- Cover image: `blog/{postId}/{uuid}.webp` (UUID-named via `processImageSlot`, one per post — NOT a fixed "cover.webp" name)
- Inline images: `blog/{postId}/images/{uuid}.webp` (UUID per image via `crypto.randomUUID()`, multiple per post, in `images/` subdirectory)

Story 4-3 delete flow already calls `imageService.deleteByPrefix('blog/{postId}/')` which recursively deletes both cover and inline images.

### Existing Patterns to REUSE

| Pattern | Source File | What to Reuse |
|---|---|---|
| Modal dialog | `ConfirmDialog.svelte` | Focus trap, backdrop, Escape close, aria-modal, body scroll lock |
| ImageUploader | `ImageUploader.svelte` | Drag-drop zone, file validation (5MB), preview, progress bar |
| Image upload | `image-service.ts` | `imageService.upload(file, path, onProgress)` → `UploadHandle` |
| Upload cleanup | `BlogForm.svelte` | `$effect` return with `handle.cancel()` pattern |
| StoredImage type | `shared-schemas.ts` | `{ url: string, storagePath: string }` |
| Toast feedback | `toast-store.svelte.ts` | `toastStore.success()`, `toastStore.error()` |
| Error mapping | `error-messages.ts` | `getStorageErrorMessage(error, 'es')` |
| TipTap helpers | `tiptap-helpers.ts` | Extend with `extractImagesFromContent()` |

### File Structure

```
src/components/admin/
  ├── ImageUploadDialog.svelte       # NEW — modal dialog for inline image upload
  ├── RichTextEditor.svelte          # MODIFY — add onInsertImage prop + insertImageAtCursor export
  ├── BlogForm.svelte                # MODIFY — wire dialog, track images, pre-generate postId
  └── __tests__/
      └── image-upload-dialog.test.ts  # NEW — dialog unit tests

src/lib/utils/
  └── tiptap-helpers.ts              # MODIFY — add extractImagesFromContent()

src/lib/i18n/
  └── translations.ts               # MODIFY — add admin.blog.insertImage* keys

tests/e2e/
  └── admin-blog.spec.ts            # MODIFY — add inline image insertion E2E test

tests/fixtures/
  └── test-image.png                 # NEW (if not exists) — small test image for E2E
```

### Accessibility Requirements

- ImageUploadDialog: `role="dialog"`, `aria-modal="true"`, `aria-labelledby` to title
- Focus trap inside dialog — Tab/Shift+Tab cycles within dialog elements
- Escape closes dialog (cancel flow, not insert)
- "Insertar" button: `aria-busy={uploading}` during upload, `disabled` until image selected
- Progress bar: `role="progressbar"`, `aria-valuenow`, `aria-valuemin="0"`, `aria-valuemax="100"`
- After image inserted in editor: screen readers should announce via TipTap's built-in content update

### Previous Story Learnings (Story 4-1)

- **TipTap cursor loss bug:** Fixed with `untrack()` — ensure any new `$effect` in RichTextEditor doesn't track content reactively
- **Slug from EN:** defaultLocale is `en` — already correct in current code
- **Double-submit guard:** Already in BlogForm — `if (saving) return;` at top of handleSubmit. Keep for this story's save flow changes
- **`client:only="svelte"` mandatory:** All Firebase-accessing components require this directive
- **Admin locale fixed to `'es'`:** Pass `'es'` to all `t()` calls in admin components
- **TipTap Image paste prevention:** Current `Image` extension is unconfigured (line 59: `Image` with no `.configure()`). Story 4-2 must add `Image.configure({ allowBase64: false })` to prevent pasted/dropped base64 images that bypass Storage upload tracking

### Testing Strategy

**Unit tests (Vitest):** Mock `imageService.upload()` via `vi.mock('../../lib/firebase/image-service')`. Mock dialog open/close behavior. Test `extractImagesFromContent()` with various TipTap JSON structures.

**E2E tests (Playwright):** Use `page.setInputFiles()` on the file input inside the dialog (NOT on the editor). After upload completes, verify `img` tag exists in `.ProseMirror` content. Use `page.waitForSelector('img[src*="firebase"]')` or check for the image element within the editor.

**Coverage target:** ~8 new unit tests (dialog) + ~5 new tiptap-helpers tests + ~3 updated blog-form tests + ~3 new E2E tests.

### Project Structure Notes

- All paths follow kebab-case convention
- Components follow PascalCase naming
- ImageUploadDialog is an admin-only component — lives in `src/components/admin/`
- No changes to Zod schemas needed — `images: z.array(storedImageSchema)` already exists
- `blogPostFormSchema` does NOT include `images` — this is correct, images are managed by the form logic, not validated as form input

### References

**Planning artifacts:**
- [epics.md#Epic 4, Story 4.2] — Acceptance criteria, FR32
- [architecture.md#Image Lifecycle] — StoredImage, ImageSlot, upload patterns, Storage paths
- [architecture.md#Blog Editor] — TipTap integration, content storage as JSON
- [ux-design-specification.md#Journey 3] — Blog editor UX flow
- [prd.md#FR32] — Insert images into blog article content

**Implementation context:**
- [4-1-blog-crud-list-create-y-editor-rico.md] — Previous story: TipTap setup, BlogForm, window.prompt placeholder, images:[] hardcoded
- [project-context.md] — Image lifecycle (safe-first), UploadHandle cleanup, ImageSlot patterns, TipTap rules

**Codebase (extend/reuse):**
- [src/components/admin/RichTextEditor.svelte] — Modify: add onInsertImage + insertImageAtCursor
- [src/components/admin/BlogForm.svelte] — Modify: wire dialog, track images, pre-generate postId
- [src/components/admin/ImageUploader.svelte] — Reuse inside dialog (props: label, slot, onChange)
- [src/components/admin/ConfirmDialog.svelte] — Modal pattern template (focus trap, backdrop, aria)
- [src/lib/firebase/image-service.ts] — `imageService.upload(file, path, onProgress)` API
- [src/lib/utils/tiptap-helpers.ts] — Extend with extractImagesFromContent()
- [src/lib/schemas/shared-schemas.ts] — `StoredImage` type
- [src/lib/schemas/image-slot.ts] — `ImageSlot` discriminated union

**External:**
- [TipTap v3 docs — Image extension] — `setImage({ src, alt })` chain command

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (1M context)

### Debug Log References

- ESLint flagged `new Set()` inside Svelte component (svelte/prefer-svelte-reactivity). Resolved by extracting `mergeUniqueImages()` helper to tiptap-helpers.ts.

### Completion Notes List

- Task 1: Created ImageUploadDialog.svelte — modal dialog wrapping ImageUploader with full a11y (role="dialog", aria-modal, focus trap, Escape close, backdrop close), upload progress bar, alt text input, $effect cleanup for UploadHandle and objectURLs.
- Task 2: Modified RichTextEditor.svelte — added onInsertImage optional callback prop (falls back to window.prompt for backward compat), exported insertImageAtCursor() function, configured Image.configure({ allowBase64: false }) to prevent untracked base64 images.
- Task 3: Wired dialog in BlogForm — added imageDialogOpen state, activeEditorRef tracking, bind:this on both RichTextEditor instances, handleEditorInsertImage/handleImageUploaded handlers, uploadedImages state seeded from initialData.images in edit mode.
- Task 4: Implemented extractImagesFromContent() and mergeUniqueImages() in tiptap-helpers.ts. BlogForm handleSubmit now extracts and deduplicates tracked images from both ES/EN content before saving.
- Task 5: Pre-generated Firestore document reference at form mount using doc(collection(db, BLOG_COLLECTION)). Create mode now uses setDoc instead of addDoc. currentPostId derived from preGeneratedDocRef.id (create) or initialData.id (edit).
- Task 6: Added 6 i18n keys to translations.ts (insertImage, insertImageTitle, uploading, insertButton, imageUploadError, imageAltText).
- Task 7: Created tiptap-helpers.test.ts (13 tests), image-upload-dialog.test.ts (10 tests), updated blog-form.test.ts (5 new tests for inline image tracking, setDoc, edit mode seeding). All 1066 tests pass.
- Task 8: Added 4 E2E tests to admin-blog.spec.ts (dialog open, dialog cancel, full upload+insert flow, cleanup). Created test-image.png fixture (1x1 pixel PNG).

### Change Log

- 2026-03-23: Implemented Story 4-2 — Blog image insertion in content. Replaced window.prompt with ImageUploadDialog, added image tracking with extractImagesFromContent, pre-generated postId with setDoc pattern. 28 new tests added.
- 2026-03-23: Code review fixes — (P1) Cancel button + Escape + backdrop click now work during upload, enabling upload cancellation. (P3) Rewrote tautological dialog unit tests with real logic verification. (P4) Added aria-label to progress bar for screen readers. Note: getFirestoreErrorMessage handles Storage errors correctly (checks both maps); imageUploadError i18n key available as fallback. 1 valid defer: orphaned Storage images on form abandonment (planned in Story 4-3).

### File List

**New:**
- src/components/admin/ImageUploadDialog.svelte
- src/components/admin/__tests__/image-upload-dialog.test.ts
- src/lib/utils/__tests__/tiptap-helpers.test.ts
- tests/fixtures/test-image.png

**Modified:**
- src/components/admin/RichTextEditor.svelte
- src/components/admin/BlogForm.svelte
- src/lib/utils/tiptap-helpers.ts
- src/lib/i18n/translations.ts
- src/components/admin/__tests__/blog-form.test.ts
- tests/e2e/admin-blog.spec.ts
- _bmad-output/implementation-artifacts/sprint-status.yaml
