# Story 4.1: Blog CRUD — List, Create y Editor Rico

Status: ready-for-dev

## Story

As Christopher (admin),
I want to create blog posts with a rich text editor, custom slugs and cover images,
So that I can publish technical articles about my work.

## Acceptance Criteria

1. **Given** admin Blog page **When** loaded **Then** list shows all articles (published and drafts) with title, status badge (green "Publicado" / orange "Borrador"), date, action buttons.
2. **And** empty list shows empty state: "No hay artículos de blog. [Escribir el primero →]".
3. **And** "Crear nuevo" opens form: title (BilingualField), slug (auto-generated from ES title, editable), cover image (ImageUploader), status toggle (draft default / published), content editor (RichTextEditor).
4. **And** RichTextEditor (TipTap) has compact toolbar: H1-H3, Bold, Code block, Link, Image insert, List (ordered/unordered).
5. **And** saving stores to Firestore `BlogPosts` collection with `createdAt` timestamp, uploads cover image via ImageService, toast confirmation.
6. **And** slug is validated as URL-friendly (lowercase, hyphens, no spaces or special chars) — regex: `/^[a-z0-9]+(?:-[a-z0-9]+)*$/`.
7. **And** content is stored as TipTap JSON in Firestore (bilingual: `{ es, en }`), HTML generated at render time.

## Tasks / Subtasks

- [ ] Task 1: Install TipTap v3 dependencies (AC: #4)
  - [ ] 1.1 `pnpm add @tiptap/core @tiptap/pm @tiptap/starter-kit @tiptap/extension-image @tiptap/extension-link`
  - [ ] 1.2 Verify build passes — `pnpm build` and `pnpm type-check`

- [ ] Task 2: Extend blog-post-schema.ts with form/firestore variants (AC: #5, #6, #7)
  - [ ] 2.1 Make `coverImage` optional in the **base** `blogPostBaseSchema` (change to `storedImageSchema.optional()`), then add `blogPostFirestoreSchema` — omit `id`, `images` defaults to `[]`. This ensures `parseBlogPost()` in `collections.ts` won't crash on posts without cover images.
  - [ ] 2.2 Add `blogPostFormSchema` — omit `id`, `coverImage`, `images`, `createdAt`, `updatedAt` (form doesn't handle these)
  - [ ] 2.3 Change `content` field type to store TipTap JSON: keep `localizedString` type (JSON stringified or raw object — see Dev Notes)
  - [ ] 2.4 Export types: `BlogPostFirestore`, `BlogPostForm`, `BlogPostWithId`

- [ ] Task 3: Create RichTextEditor.svelte component (AC: #4)
  - [ ] 3.1 Create `src/components/admin/RichTextEditor.svelte` using `@tiptap/core` with Svelte 5 `createSubscriber()` pattern (see Dev Notes for exact approach)
  - [ ] 3.2 Props: `content: string` (TipTap JSON string), `onUpdate: (json: string) => void`, `label: string`, `error?: string`
  - [ ] 3.3 Toolbar buttons: H1, H2, H3 | Bold | Code block | Link | Image | Bullet list, Ordered list
  - [ ] 3.4 Toolbar uses `editor.chain().focus().toggleHeading({level})` pattern — active state via `editor.isActive('heading', {level})`
  - [ ] 3.5 Image button: emits custom event or calls callback that parent handles (upload via ImageService, then `editor.chain().focus().setImage({src}).run()`)
  - [ ] 3.6 Style editor content area: min-height 300px, border, rounded, padding, focus ring. Prose styles for headings, lists, code blocks
  - [ ] 3.7 Cleanup: `editor.destroy()` in `$effect` return cleanup
  - [ ] 3.8 Add `aria-label` on editor and toolbar, `role="toolbar"` on toolbar container

- [ ] Task 4: Create BlogForm.svelte (AC: #3, #5, #6, #7)
  - [ ] 4.1 Create `src/components/admin/BlogForm.svelte` — follow `ProjectForm.svelte` pattern
  - [ ] 4.2 Props: `mode: 'create' | 'edit'`, `initialData?: BlogPostWithId | null`, `onCancel: () => void`, `onSaved: () => void`
  - [ ] 4.3 Form state with `$state`: `titleEs`, `titleEn`, `slug`, `status` (default 'draft'), `contentEs` (TipTap JSON), `contentEn` (TipTap JSON), `coverImageSlot: ImageSlot`
  - [ ] 4.4 Auto-generate slug from ES title using `slugify()` from `src/lib/utils/slugify.ts` — only auto-generate when slug field hasn't been manually edited
  - [ ] 4.5 Slug validation: validate against regex, check uniqueness via Firestore query (exclude current doc in edit mode)
  - [ ] 4.6 BilingualField for title (reuse existing component)
  - [ ] 4.7 Two RichTextEditor instances: one for ES content, one for EN content — use tabs or toggle similar to BilingualField pattern
  - [ ] 4.8 ImageUploader for cover image (single, optional)
  - [ ] 4.9 Status toggle: draft/published — use styled toggle or select
  - [ ] 4.10 Validation on submit: title.es required, title.en required, slug required+valid+unique, contentEs required (non-empty JSON), contentEn required
  - [ ] 4.11 Create flow: `addDoc()` → process cover image via `processImageSlot()` from `src/lib/firebase/image-slot-processor.ts` → `updateDoc()` with `coverImage` StoredImage → toast success
  - [ ] 4.12 `initializedForId` guard for edit mode (prevent infinite `$effect` re-init)
  - [ ] 4.13 `hasChanges` tracking + `getHasChanges()` export
  - [ ] 4.14 Upload handle cleanup in `$effect` return
  - [ ] 4.15 Double-submit guard: early return if `saving === true`
  - [ ] 4.16 `aria-busy` on submit button when saving

- [ ] Task 5: Create BlogList.svelte (AC: #1, #2)
  - [ ] 5.1 Create `src/components/admin/BlogList.svelte` — follow `TechnologyList.svelte` pattern
  - [ ] 5.2 Load all BlogPosts from Firestore `BlogPosts` collection, ordered by `createdAt` desc
  - [ ] 5.3 Parse each doc with `blogPostFirestoreSchema.safeParse()` — skip invalid entries, never crash list
  - [ ] 5.4 Error state UI: if Firestore query fails, show error message with retry button
  - [ ] 5.5 Display: title (ES), status badge (green "Publicado" / orange "Borrador"), formatted date, Edit and Delete action buttons
  - [ ] 5.6 Empty state: "No hay artículos de blog." with CTA link "Escribir el primero →" that triggers create mode
  - [ ] 5.7 Skeleton loader (3-5 pulsing rows) with `aria-busy="true"` during load
  - [ ] 5.8 Expose `loadPosts()` method for parent to call after save/delete

- [ ] Task 6: Create BlogCrudPage.svelte (AC: #1, #2, #3)
  - [ ] 6.1 Create `src/components/admin/BlogCrudPage.svelte` — follow `ProjectsCrudPage.svelte` pattern
  - [ ] 6.2 View mode state machine: `'list' | 'create' | 'edit'`
  - [ ] 6.3 Wire BlogList (list mode) and BlogForm (create/edit mode)
  - [ ] 6.4 Delete flow: ConfirmDialog → `deleteDoc()` first → `imageService.deleteByPrefix('blog/{postId}/')` second → toast → reload list
  - [ ] 6.5 Unsaved changes guard on cancel/back: `window.confirm()` if `hasChanges`
  - [ ] 6.6 Header with title + "Crear nuevo" button (visible in list mode)
  - [ ] 6.7 Include `<Toast />` component in the template (required for `toastStore` notifications to render)

- [ ] Task 7: Update blog.astro page (AC: #1)
  - [ ] 7.1 Replace placeholder content in `src/pages/admin/blog.astro` with `BlogCrudPage client:only="svelte"`
  - [ ] 7.2 Keep AuthGuard wrapper and AdminLayout

- [ ] Task 8: Add i18n keys for blog admin (AC: all)
  - [ ] 8.1 Add keys in `src/lib/i18n/translations.ts` under `admin.blog.*` (follow existing `admin.technologies.*` / `admin.projects.*` key structure):
    - Page: `admin.blog.title`, `admin.blog.createNew`, `admin.blog.editTitle`, `admin.blog.createTitle`
    - Labels: `admin.blog.titleLabel`, `admin.blog.slugLabel`, `admin.blog.contentLabel`, `admin.blog.coverImageLabel`, `admin.blog.statusLabel`
    - Status: `admin.blog.statusPublished`, `admin.blog.statusDraft`
    - Toasts: `admin.blog.saveSuccessToast`, `admin.blog.deleteSuccessToast`
    - Empty/loading/error: `admin.blog.emptyState`, `admin.blog.emptyStateCta`, `admin.blog.loading`, `admin.blog.errorLoading`
    - Delete dialog: `admin.blog.deleteConfirmTitle`, `admin.blog.deleteConfirmMessage`, `admin.blog.deleteConfirmButton`
    - Validation: `admin.blog.slugInUse`, `admin.blog.slugInvalid`, `admin.blog.contentRequired`
    - Form actions: `admin.blog.form.save`, `admin.blog.form.saving`, `admin.blog.form.cancel`, `admin.blog.form.discardChanges`
    - List actions: `admin.blog.edit`, `admin.blog.delete`

- [ ] Task 9: Unit tests (AC: all)
  - [ ] 9.1 `src/components/admin/__tests__/blog-list.test.ts`: load, parse, display, empty state, skeleton, status badges
  - [ ] 9.2 `src/components/admin/__tests__/blog-form.test.ts`: validation (title required, slug format, slug uniqueness, content required), create flow, edit initialization, hasChanges, double-submit guard
  - [ ] 9.3 `src/components/admin/__tests__/blog-crud.test.ts`: view mode transitions, delete flow (doc first then images), unsaved changes guard
  - [ ] 9.4 `src/lib/__tests__/blog-post-schema.test.ts`: base schema, firestore variant, form variant, slug regex, date refinement
  - [ ] 9.5 Mock Firebase client SDK (NOT admin SDK) — follow existing test patterns in `__tests__/`

- [ ] Task 10: E2E tests (AC: all)
  - [ ] 10.1 `tests/e2e/admin-blog.spec.ts`: login → navigate to Blog → create article with title+slug+content → verify appears in list with "Borrador" badge → delete → verify removed
  - [ ] 10.2 Test empty state CTA triggers create form
  - [ ] 10.3 Use existing admin auth setup: `tests/e2e/auth.setup.ts` for login, `tests/e2e/admin-helpers.ts` for `ensureAdminLogin()` helper

## Dev Notes

### Framework Requirements

- Astro 6 + Svelte 5 runes: `$state`, `$derived`, `$effect`, `$props()` — NEVER Svelte 4 syntax
- `client:only="svelte"` MANDATORY for all Firebase-accessing components
- Zod schemas = source of truth → `z.infer<>` for all types
- `motion-safe:` prefix on all auto-play animations
- Admin locale fixed to `'es'` — pass `'es'` to all `t()` calls
- NEVER hardcode UI strings — always `translations.ts`

### TipTap v3 + Svelte 5 Integration (Critical)

**No official `@tiptap/svelte` package exists.** Use `@tiptap/core` directly with custom wrapper.

**Pattern (Svelte 5 runes + createSubscriber):**
```typescript
import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import { createSubscriber } from 'svelte/reactivity';

let element: HTMLDivElement;
let editorInstance: Editor | undefined;

// Bridge TipTap transactions → Svelte reactivity
const subscribe = createSubscriber((update) => {
  editorInstance?.on('transaction', update);
  return () => editorInstance?.off('transaction', update);
});

// Reactive getter — call subscribe() to trigger Svelte re-renders
function getEditor(): Editor | undefined {
  subscribe();
  return editorInstance;
}

$effect(() => {
  editorInstance = new Editor({
    element,
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Image,
    ],
    content: initialContent,  // TipTap JSON object
    onUpdate: ({ editor }) => {
      onUpdate(JSON.stringify(editor.getJSON()));
    },
  });
  return () => editorInstance?.destroy();
});
```

**TipTap v3 breaking changes to know:**
- `setContent` signature: `(content, options)` — not positional booleans
- StarterKit includes: Heading, Bold, Italic, CodeBlock, BulletList, OrderedList, etc.
- Link extension is **NOT** in StarterKit — requires separate `@tiptap/extension-link`
- Image extension is **NOT** in StarterKit — requires separate `@tiptap/extension-image`
- All extensions are MIT licensed (core + extensions are free)

**Editor extensions setup:**
```typescript
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';

extensions: [
  StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
  Image,
  Link.configure({ openOnClick: false }),  // Don't open links in editor
]
```

### Content Storage Strategy

**Store TipTap JSON (not HTML) in Firestore.** Reasons:
- Round-trips perfectly to/from editor without parse step
- Firestore handles nested objects natively
- HTML generated at build time for public pages (via `generateHTML()` from `@tiptap/core`)
- Content field is `localizedString` = `{ es: string, en: string }` — store JSON.stringify'd TipTap doc per locale

**Content field type in schema:**
```typescript
content: localizedString  // { es: JSON.stringify(tiptapDoc), en: JSON.stringify(tiptapDoc) }
```

**Public rendering (build-time, Story 4.4/4.5):** Use `generateHTML(json, extensions)` from `@tiptap/core` + sanitize with `sanitize-html` before `set:html`.

### Existing Patterns to REUSE (Don't Reinvent)

| Pattern | Source File | What to Copy |
|---|---|---|
| CRUD state machine | `ProjectsCrudPage.svelte` | viewMode, delete flow, ConfirmDialog |
| Form with images | `ProjectForm.svelte` | ImageSlot, upload handles, $effect cleanup, initializedForId guard |
| Simple form | `TechnologyForm.svelte` | Single image upload, validation, error display |
| BilingualField | `BilingualField.svelte` | Tabs mobile / side-by-side desktop |
| ImageUploader | `ImageUploader.svelte` | Drag-drop, preview, progress bar |
| List with parse | `TechnologyList.svelte` | safeParse, skeleton, empty state |
| Toast | `toast-store.svelte.ts` | `toastStore.success()`, `toastStore.error()` |
| Error mapping | `error-messages.ts` | `getFirestoreErrorMessage(error, 'es')` |
| Slug generation | `slugify.ts` | `slugify(titleEs)` for auto-slug |
| Image lifecycle | `src/lib/firebase/image-service.ts` | upload, replace, delete, deleteByPrefix |
| ImageSlot | `src/lib/schemas/image-slot.ts` | Discriminated union: empty/existing/new/replaced/removed |
| processImageSlot | `src/lib/firebase/image-slot-processor.ts` | Encapsulated image state transitions — use this for create/save flows |

### File Structure (Create These)

```
src/components/admin/
  ├── BlogCrudPage.svelte          # Orchestrator: view mode, delete, navigation
  ├── BlogList.svelte              # List display, load, parse, skeleton
  ├── BlogForm.svelte              # Create/edit form, validation, save
  ├── RichTextEditor.svelte        # TipTap wrapper component
  └── __tests__/
      ├── blog-list.test.ts
      ├── blog-form.test.ts
      └── blog-crud.test.ts

src/lib/schemas/
  └── blog-post-schema.ts         # EXTEND existing (add firestore/form variants)

src/lib/i18n/
  └── translations.ts             # ADD admin.blog.* keys

src/pages/admin/
  └── blog.astro                   # UPDATE existing placeholder

tests/e2e/
  └── admin-blog.spec.ts           # E2E happy path
```

### Firestore Document Structure

```typescript
// Collection: BlogPosts/{postId}
{
  title: { es: "Mi artículo", en: "My article" },
  slug: "mi-articulo",
  content: { es: "{...tiptap json...}", en: "{...tiptap json...}" },
  coverImage: { url: "https://...", storagePath: "blog/{postId}/cover.webp" },  // optional
  images: [],  // embedded images tracked for cleanup (Story 4.2)
  status: "draft",  // | "published"
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

**Storage paths:**
```
blog/{postId}/cover.webp              # Cover image
blog/{postId}/images/{uuid}.webp      # Embedded images (Story 4.2)
```

### Delete Flow (Safe-First Order — Epic 3 Lesson D-1)

```
1. deleteDoc(doc(db, 'BlogPosts', postId))     ← Document first
2. imageService.deleteByPrefix('blog/{postId}/')  ← Images second (non-blocking, try-catch)
3. toastStore.success(...)
```
Orphaned images acceptable if step 2 fails — refs are clean after step 1.

### Create Flow

```
1. Validate form fields (title, slug, content, status)
2. Check slug uniqueness (see Slug Uniqueness Query below)
3. addDoc(collection(db, 'BlogPosts'), { title, slug, content, status, images: [], createdAt, updatedAt })
4. Process coverImage via processImageSlot(coverImageSlot, imageService, `blog/${docRef.id}/cover.webp`)
   → if returns StoredImage: updateDoc with coverImage field
5. toastStore.success(t('admin.blog.saveSuccessToast', 'es'))
6. onSaved() → parent returns to list view
```

### Slug Uniqueness Query

```typescript
import { collection, query, where, limit, getDocs } from 'firebase/firestore';

async function isSlugUnique(slug: string, excludeId?: string): Promise<boolean> {
  const q = query(collection(db, 'BlogPosts'), where('slug', '==', slug), limit(1));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return true;
  // In edit mode, exclude current document
  return excludeId ? snapshot.docs[0].id === excludeId : false;
}
```

### Form Field IDs (Convention from Epic 3)

Follow `blog-{fieldname}` pattern consistently:
- `blog-title-es`, `blog-title-en`
- `blog-slug`
- `blog-content-es`, `blog-content-en`
- `blog-cover-image`
- `blog-status`

### Slug Auto-Generation Logic

```typescript
let slugManuallyEdited = $state(false);

// Auto-generate slug from ES title when not manually edited
$effect(() => {
  if (!slugManuallyEdited && titleEs) {
    slug = slugify(titleEs);
  }
});

// On slug field input: mark as manually edited
function handleSlugInput() {
  slugManuallyEdited = true;
}
```

### Accessibility Requirements

- `<form>` with `aria-label`
- All inputs have `<label>` with `for` attribute
- Required fields: `aria-required="true"` + visual asterisk
- Errors: `aria-describedby` pointing to error message element
- RichTextEditor: `aria-label="Editor de contenido"`, `role="textbox"`, `aria-multiline="true"`
- Toolbar: `role="toolbar"`, `aria-label="Formato de texto"`
- Status badges: include `aria-label` with full status text
- Submit button: `aria-busy={saving}` when saving

### Epic 3 Deferred Items — Prevent Replication

- **D-1 (delete non-atomic):** FIXED — delete doc first, images second (see Delete Flow above)
- **D-3 (double-submit):** Add `if (saving) return;` at top of `handleSubmit()`
- **D-2 (back button bypass):** Implement unsaved changes check before switching viewMode

### Testing Strategy

**Unit tests (Vitest):** Mock Firebase client SDK. Use `vi.mock('firebase/firestore')`. Test factory for BlogPost objects. Co-locate in `__tests__/`.

**E2E tests (Playwright):** Reuse admin auth setup (`tests/e2e/setup/`). Test: navigate → create → verify list → delete → verify removed.

**Coverage target:** ~30-40 tests across 4 test files.

### Project Structure Notes

- All paths follow kebab-case convention
- Components follow PascalCase naming
- Blog CRUD follows identical architecture to Projects/Technologies/Experiences CRUD
- `COLLECTION_PATHS.blogPosts` already registered in `collections.ts`
- `parseBlogPost()` already exists in `collections.ts`
- `blogPostSchema` already exists in `blog-post-schema.ts` (extend, don't replace)

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 4.1] — Acceptance criteria, implementation note
- [Source: _bmad-output/planning-artifacts/architecture.md#Blog Editor] — TipTap decision, storage paths
- [Source: _bmad-output/planning-artifacts/architecture.md#Image Lifecycle] — ImageSlot, safe-first order
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Journey 3] — Blog editor UX flow
- [Source: _bmad-output/planning-artifacts/prd.md#FR31-FR37] — Blog functional requirements
- [Source: _bmad-output/project-context.md] — HTML sanitization, form state patterns, testing standards
- [Source: _bmad-output/implementation-artifacts/epic-3-retro-2026-03-22.md] — Deferred items D-1, D-2, D-3
- [Source: src/lib/schemas/blog-post-schema.ts] — Existing schema (extend with variants)
- [Source: src/lib/firebase/collections.ts] — parseBlogPost(), COLLECTION_PATHS.blogPosts
- [Source: src/lib/utils/slugify.ts] — Reuse for auto-slug
- [Source: src/components/admin/ProjectsCrudPage.svelte] — CRUD orchestrator pattern
- [Source: src/components/admin/ProjectForm.svelte] — Form with images pattern
- [TipTap v3 docs] — StarterKit, Image extension, generateHTML()
- [Svelte 5 createSubscriber] — Bridge TipTap transactions to Svelte reactivity

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
