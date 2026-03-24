# Story 4.1: Blog CRUD — List, Create y Editor Rico

Status: done

## Story

As Christopher (admin),
I want to create blog posts with a rich text editor, custom slugs and cover images,
So that I can publish technical articles about my work.

## Scope Note

This story builds the **full Blog CrudPage infrastructure** (list + create + delete + edit skeleton) because the established CRUD orchestrator pattern (`ProjectsCrudPage`, `ExperiencesCrudPage`) requires all view modes in a single component. Story 4.3 scope is adjusted to focus on: edit form initialization from existing data, status toggle UX, and edit-specific validation/edge cases.

## Acceptance Criteria

1. **Given** admin Blog page **When** loaded **Then** list shows all articles (published and drafts) with title, status badge (green "Publicado" / orange "Borrador"), date, action buttons.
2. **And** empty list shows empty state: "No hay artículos de blog. [Escribir el primero →]".
3. **And** "Crear nuevo" opens form: title (BilingualField), slug (auto-generated from ES title, editable), cover image (ImageUploader), status toggle (draft default / published), content editor (RichTextEditor).
4. **And** RichTextEditor (TipTap) has compact toolbar: H1-H3, Bold, Code block, Link, Image insert, List (ordered/unordered).
5. **And** saving stores to Firestore `BlogPosts` collection with `createdAt` timestamp, uploads cover image via ImageService, toast confirmation.
6. **And** slug is validated as URL-friendly (lowercase, hyphens, no spaces or special chars) — regex: `/^[a-z0-9]+(?:-[a-z0-9]+)*$/`.
7. **And** content is stored as TipTap JSON in Firestore (bilingual: `{ es, en }`), HTML generated at render time.

## Tasks / Subtasks

- [x] Task 1: Install TipTap v3 dependencies (AC: #4)
  - [x] 1.1 `pnpm add @tiptap/core @tiptap/pm @tiptap/starter-kit @tiptap/extension-image @tiptap/extension-link`
  - [x] 1.2 Verify build passes — `pnpm build` and `pnpm type-check`

- [x] Task 2: Extend blog-post-schema.ts with form/firestore variants (AC: #5, #6, #7)
  - [x] 2.1 Make `coverImage` optional in the **base** `blogPostBaseSchema` (change to `storedImageSchema.optional()`), then add `blogPostFirestoreSchema` — omit `id`, `images` defaults to `[]`. This ensures `parseBlogPost()` in `collections.ts` won't crash on posts without cover images.
  - [x] 2.2 Add `blogPostFormSchema` — omit `id`, `coverImage`, `images`, `createdAt`, `updatedAt` (form doesn't handle these)
  - [x] 2.3 Content field stores TipTap JSON as `JSON.stringify()`'d string inside `localizedString` (`{ es: string, en: string }`). The string value is a serialized TipTap doc, NOT a raw nested object. This keeps the existing `localizedString` validator (min 1 char strings) working without changes.
  - [x] 2.4 Export types: `BlogPostFirestore`, `BlogPostForm`, `BlogPostWithId`
  - [x] 2.5 Update test factory `src/test/factories/blog-post.ts` — change content from HTML strings to valid TipTap JSON strings (e.g., `JSON.stringify({type:"doc",content:[{type:"paragraph",content:[{type:"text",text:"Contenido"}]}]})`)

- [x] Task 3: Create RichTextEditor.svelte component (AC: #4)
  - [x] 3.1 Create `src/components/admin/RichTextEditor.svelte` using `@tiptap/core` with Svelte 5 `createSubscriber()` pattern (see Dev Notes for exact approach)
  - [x] 3.2 Props: `content: string` (TipTap JSON string), `onUpdate: (json: string) => void`, `label: string`, `error?: string`
  - [x] 3.3 Toolbar buttons: H1, H2, H3 | Bold | Code block | Link | Image | Bullet list, Ordered list
  - [x] 3.4 Toolbar uses `editor.chain().focus().toggleHeading({level})` pattern — active state via `editor.isActive('heading', {level})`
  - [x] 3.5 Image button: emits custom event or calls callback that parent handles (upload via ImageService, then `editor.chain().focus().setImage({src}).run()`)
  - [x] 3.6 Style editor content area: min-height 300px, border, rounded, padding, focus ring. Prose styles for headings, lists, code blocks
  - [x] 3.7 Cleanup: `editor.destroy()` in `$effect` return cleanup
  - [x] 3.8 Add `aria-label` on editor and toolbar, `role="toolbar"` on toolbar container
  - [x] 3.9 Error recovery: wrap `new Editor()` in try-catch inside `$effect`. On failure, set `let initError = $state(true)` and render fallback: "Editor no disponible. Intente recargar la página." with `aria-live="assertive"`

- [x] Task 4: Create BlogForm.svelte (AC: #3, #5, #6, #7)
  - [x] 4.1 Create `src/components/admin/BlogForm.svelte` — follow `ExperienceForm.svelte` pattern (closest template: no image gallery, bilingual fields, validation). Reference `ProjectForm.svelte` only for image upload handling.
  - [x] 4.2 Props: `mode: 'create' | 'edit'`, `initialData?: BlogPostWithId | null`, `onCancel: () => void`, `onSaved: () => void`. **Note:** This story only exercises `mode='create'`. Edit initialization from `initialData` will be fully wired in Story 4.3.
  - [x] 4.3 Form state with `$state`: `titleEs`, `titleEn`, `slug`, `status` (default 'draft'), `contentEs` (TipTap JSON), `contentEn` (TipTap JSON), `coverImageSlot: ImageSlot`
  - [x] 4.4 Auto-generate slug from ES title using `slugify()` from `src/lib/utils/slugify.ts` — only auto-generate when slug field hasn't been manually edited. Field ID: `blog-slug`
  - [x] 4.5 Slug validation: validate against regex, check uniqueness via Firestore query (exclude current doc in edit mode)
  - [x] 4.6 BilingualField for title (reuse existing component). Field IDs: `blog-title-es`, `blog-title-en`
  - [x] 4.7 Two RichTextEditor instances for ES and EN content, switched via tab buttons (like BilingualField's mobile pattern). **Critical:** Do NOT destroy/recreate editors on tab switch — use `display: none` on the inactive editor to preserve state. Field IDs: `blog-content-es`, `blog-content-en`
  - [x] 4.8 ImageUploader for cover image (single, optional). Field ID: `blog-cover-image`
  - [x] 4.9 Status toggle: draft/published — use styled toggle or select. Field ID: `blog-status`
  - [x] 4.10 Validation on submit: title.es required, title.en required, slug required+valid+unique, contentEs required (use `isTipTapContentEmpty()` helper — see Dev Notes), contentEn required
  - [x] 4.11 Create flow: `addDoc()` → process cover image via `processImageSlot()` from `src/lib/firebase/image-slot-processor.ts` → `updateDoc()` with `coverImage` StoredImage → toast success
  - [x] 4.12 `initializedForId` guard for edit mode (prevent infinite `$effect` re-init)
  - [x] 4.13 `hasChanges` tracking + `getHasChanges()` export
  - [x] 4.14 Upload handle cleanup in `$effect` return
  - [x] 4.15 Double-submit guard: early return if `saving === true` (Epic 3 fix D-3)
  - [x] 4.16 `aria-busy` on submit button when saving

- [x] Task 5: Create BlogList.svelte (AC: #1, #2)
  - [x] 5.1 Create `src/components/admin/BlogList.svelte` — follow `ExperienceList.svelte` pattern (closest template: simple list with callbacks)
  - [x] 5.2 Load all BlogPosts from Firestore `BlogPosts` collection, ordered by `createdAt` desc
  - [x] 5.3 Parse each doc with `blogPostFirestoreSchema.safeParse()` — skip invalid entries, never crash list
  - [x] 5.4 Error state UI: if Firestore query fails, show error message with retry button
  - [x] 5.5 Display: title (ES), status badge (green "Publicado" / orange "Borrador"), formatted date, Edit and Delete action buttons
  - [x] 5.6 Empty state: "No hay artículos de blog." with CTA link "Escribir el primero →" that triggers create mode
  - [x] 5.7 Skeleton loader (3-5 pulsing rows) with `aria-busy="true"` during load
  - [x] 5.8 Expose `loadPosts()` method for parent to call after save/delete

- [x] Task 6: Create BlogCrudPage.svelte (AC: #1, #2, #3)
  - [x] 6.1 Create `src/components/admin/BlogCrudPage.svelte` — follow `ExperiencesCrudPage.svelte` pattern (closest template: viewMode state machine, ConfirmDialog, unsaved guard)
  - [x] 6.2 View mode state machine: `'list' | 'create' | 'edit'`. **Note:** `'edit'` mode is structurally wired but only fully exercised in Story 4.3.
  - [x] 6.3 Wire BlogList (list mode) and BlogForm (create/edit mode)
  - [x] 6.4 Delete flow: ConfirmDialog → `deleteDoc()` first → `imageService.deleteByPrefix('blog/{postId}/')` second → toast → reload list (Epic 3 fix D-1: safe-first order)
  - [x] 6.5 Unsaved changes guard on cancel/back: `window.confirm()` if `hasChanges` (Epic 3 fix D-2)
  - [x] 6.6 Header with title + "Crear nuevo" button (visible in list mode)
  - [x] 6.7 Include `<Toast />` component in the template — import from `src/components/admin/Toast.svelte` (required for `toastStore` notifications to render)

- [x] Task 7: Update blog.astro page (AC: #1)
  - [x] 7.1 Replace placeholder content in `src/pages/admin/blog.astro` with `BlogCrudPage client:only="svelte"`
  - [x] 7.2 Keep AuthGuard wrapper and AdminLayout

- [x] Task 8: Add i18n keys for blog admin (AC: all)
  - [x] 8.1 Add keys in `src/lib/i18n/translations.ts` under `admin.blog.*` (follow existing `admin.technologies.*` / `admin.projects.*` key structure):
    - Page: `admin.blog.title`, `admin.blog.createNew`, `admin.blog.editTitle`, `admin.blog.createTitle`
    - Labels: `admin.blog.titleLabel`, `admin.blog.slugLabel`, `admin.blog.contentLabel`, `admin.blog.coverImageLabel`, `admin.blog.statusLabel`
    - Status: `admin.blog.statusPublished`, `admin.blog.statusDraft`
    - Toasts: `admin.blog.saveSuccessToast`, `admin.blog.deleteSuccessToast`
    - Empty/loading/error: `admin.blog.emptyState`, `admin.blog.emptyStateCta`, `admin.blog.loading`, `admin.blog.errorLoading`
    - Delete dialog: `admin.blog.deleteConfirmTitle`, `admin.blog.deleteConfirmMessage`, `admin.blog.deleteConfirmButton`
    - Validation: `admin.blog.slugInUse`, `admin.blog.slugInvalid`, `admin.blog.contentRequired`
    - Form actions: `admin.blog.form.save`, `admin.blog.form.saving`, `admin.blog.form.cancel`, `admin.blog.form.discardChanges`
    - List actions: `admin.blog.edit`, `admin.blog.delete`
    - Editor: `admin.blog.editorUnavailable` ("Editor no disponible. Intente recargar la página.")

- [x] Task 9: Unit tests (AC: all)
  - [x] 9.1 `src/components/admin/__tests__/blog-list.test.ts` (~8 tests): load, parse, display, empty state, skeleton, status badges, error state, retry
  - [x] 9.2 `src/components/admin/__tests__/blog-form.test.ts` (~15 tests): validation (title required, slug format, slug uniqueness, content empty check via `isTipTapContentEmpty`), create flow, hasChanges, double-submit guard, image slot processing
  - [x] 9.3 `src/components/admin/__tests__/blog-crud.test.ts` (~7 tests): view mode transitions, delete flow (doc first then images), unsaved changes guard, Toast rendering
  - [x] 9.4 `src/lib/__tests__/blog-post-schema.test.ts` (~5 tests): base schema, firestore variant, form variant, slug regex, date refinement
  - [x] 9.5 Mock Firebase client SDK (NOT admin SDK) — follow existing test patterns in `__tests__/`

- [x] Task 10: E2E tests (AC: all)
  - [x] 10.1 `tests/e2e/admin-blog.spec.ts`: login → navigate to Blog → create article with title+slug+content → verify appears in list with "Borrador" badge → delete → verify removed
  - [x] 10.2 Test empty state CTA triggers create form
  - [x] 10.3 Use existing admin auth setup: `tests/e2e/auth.setup.ts` for login, `tests/e2e/admin-helpers.ts` for `ensureAdminLogin()` helper
  - [x] 10.4 TipTap editor interaction in Playwright: use `page.locator('[role="textbox"][aria-multiline="true"]')` or `.ProseMirror` selector — click to focus, then `page.keyboard.type('Contenido de prueba')` (NOT `.fill()` which replaces `contenteditable` entirely). For structured content, use `page.keyboard.press('Enter')` between paragraphs.

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
import Link from '@tiptap/extension-link';
import { createSubscriber } from 'svelte/reactivity';

let element: HTMLDivElement;
let editorInstance: Editor | undefined;
let initError = $state(false);

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
  try {
    editorInstance = new Editor({
      element,
      extensions: [
        StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
        Image,
        Link.configure({ openOnClick: false }),
      ],
      content: initialContent,  // TipTap JSON object (parsed from string)
      onUpdate: ({ editor }) => {
        onUpdate(JSON.stringify(editor.getJSON()));
      },
    });
  } catch (e) {
    console.error('TipTap initialization failed:', e);
    initError = true;
  }
  return () => editorInstance?.destroy();
});
```

**TipTap v3 breaking changes to know:**
- `setContent` signature: `(content, options)` — not positional booleans
- StarterKit includes: Heading, Bold, Italic, CodeBlock, BulletList, OrderedList, etc.
- Link extension is **NOT** in StarterKit — requires separate `@tiptap/extension-link`
- Image extension is **NOT** in StarterKit — requires separate `@tiptap/extension-image`

### TipTap Empty Content Validation

An "empty" TipTap document still produces valid JSON: `{"type":"doc","content":[{"type":"paragraph"}]}`. Use this helper to detect effectively empty content:

```typescript
function isTipTapContentEmpty(json: string): boolean {
  try {
    const doc = JSON.parse(json);
    if (!doc.content || doc.content.length === 0) return true;
    // Single empty paragraph = empty
    if (doc.content.length === 1 && doc.content[0].type === 'paragraph' && !doc.content[0].content) return true;
    return false;
  } catch {
    return true;
  }
}
```

Place in `src/lib/utils/tiptap-helpers.ts` and import in BlogForm for validation (Task 4.10).

### Bilingual RichTextEditor Pattern

Two TipTap editor instances (ES/EN) managed via tab switching:

```svelte
<!-- Tab buttons -->
<div role="tablist">
  <button role="tab" aria-selected={activeTab === 'es'} onclick={() => activeTab = 'es'}>ES</button>
  <button role="tab" aria-selected={activeTab === 'en'} onclick={() => activeTab = 'en'}>EN</button>
</div>

<!-- Both editors always mounted, toggle visibility with CSS -->
<div style:display={activeTab === 'es' ? 'block' : 'none'}>
  <RichTextEditor content={contentEs} onUpdate={(json) => contentEs = json} label="Contenido ES" />
</div>
<div style:display={activeTab === 'en' ? 'block' : 'none'}>
  <RichTextEditor content={contentEn} onUpdate={(json) => contentEn = json} label="Contenido EN" />
</div>
```

**Critical:** NEVER destroy/recreate editors on tab switch — use `display: none` to preserve TipTap internal state. Destroying resets undo history and cursor position.

### Content Storage Strategy

**Store TipTap JSON (not HTML) in Firestore.** The `content` field is `localizedString` = `{ es: string, en: string }` where each value is `JSON.stringify(tiptapDoc)`.

**Architecture doc says HTML, this story overrides to JSON.** Rationale:
- Round-trips perfectly to/from editor without parse step
- Firestore handles string storage efficiently
- HTML generated at build time for public pages (Story 4.4/4.5) via `generateHTML(JSON.parse(content), extensions)` from `@tiptap/core` + sanitize with `sanitize-html`

### Existing Patterns to REUSE (Don't Reinvent)

| Pattern | Source File | Specific Export/Pattern to Copy |
|---|---|---|
| CRUD state machine | `ExperiencesCrudPage.svelte` | `viewMode` state, `navigateToList()`, `handleDeleteRequest()`, ConfirmDialog wiring |
| Form with images | `ProjectForm.svelte` | `ImageSlot` state, `activeUploads: UploadHandle[]`, `$effect` cleanup, `initializedForId` guard |
| Form validation | `ExperienceForm.svelte` | `errors: Record<string,string>`, `validate*()` functions, `clearError()`, `getHasChanges()` export |
| BilingualField | `BilingualField.svelte` | Direct reuse — tabs mobile / side-by-side desktop |
| ImageUploader | `ImageUploader.svelte` | Direct reuse — drag-drop, preview, progress bar |
| List with parse | `ExperienceList.svelte` | `safeParse()` loop, skeleton loader, empty state CTA, `onEdit`/`onDelete` callbacks |
| Toast | `toast-store.svelte.ts` | `toastStore.success(msg)`, `toastStore.error(msg)` |
| Error mapping | `error-messages.ts` | `getFirestoreErrorMessage(error, 'es')` |
| Slug generation | `slugify.ts` | `slugify(titleEs)` — handles Spanish accents (á,é,í,ó,ú,ñ) |
| Image lifecycle | `image-service.ts` | `upload()`, `deleteByPrefix()` — returns `UploadHandle` with `.cancel()` |
| ImageSlot | `image-slot.ts` | Discriminated union: `'empty'` / `'existing'` / `'new'` / `'replaced'` / `'removed'` |
| processImageSlot | `image-slot-processor.ts` | `processImageSlot(slot, basePath, onProgress)` → `{ image: StoredImage | null, toDelete: string[] }` |

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

src/lib/utils/
  └── tiptap-helpers.ts            # isTipTapContentEmpty() helper

src/lib/schemas/
  └── blog-post-schema.ts         # EXTEND existing (add firestore/form variants)

src/lib/i18n/
  └── translations.ts             # ADD admin.blog.* keys

src/pages/admin/
  └── blog.astro                   # UPDATE existing placeholder

src/test/factories/
  └── blog-post.ts                 # UPDATE content to TipTap JSON format

tests/e2e/
  └── admin-blog.spec.ts           # E2E happy path
```

### Firestore Document Structure

```typescript
// Collection: BlogPosts/{postId}
{
  title: { es: "Mi artículo", en: "My article" },
  slug: "mi-articulo",
  content: { es: "{...tiptap json stringified...}", en: "{...tiptap json stringified...}" },
  coverImage: { url: "https://...", storagePath: "blog/{postId}/cover.webp" },  // optional
  images: [],  // embedded images tracked for cleanup (Story 4.2)
  status: "draft",  // | "published"
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

**Storage path for cover image:** `blog/{postId}/cover.webp` (fixed name, no UUID — only one cover image per post, replaced on edit).

### Delete Flow (Safe-First Order — Epic 3 Fix D-1)

```
1. deleteDoc(doc(db, 'BlogPosts', postId))     ← Document first
2. imageService.deleteByPrefix('blog/{postId}/')  ← Images second (non-blocking, try-catch)
3. toastStore.success(...)
```
Orphaned images acceptable if step 2 fails — refs are clean after step 1.

### Create Flow

```
1. Validate form fields (title, slug, content via isTipTapContentEmpty(), status)
2. Check slug uniqueness (see Slug Uniqueness Query below)
3. addDoc(collection(db, 'BlogPosts'), { title, slug, content, status, images: [], createdAt, updatedAt })
4. Process coverImage via processImageSlot(coverImageSlot, `blog/${docRef.id}/cover.webp`, onProgress)
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
  return excludeId ? snapshot.docs[0].id === excludeId : false;
}
```

### Slug Auto-Generation Logic

```typescript
let slugManuallyEdited = $state(false);

$effect(() => {
  if (!slugManuallyEdited && titleEs) {
    slug = slugify(titleEs);
  }
});

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
- Bilingual content tabs: `role="tablist"` / `role="tab"` / `aria-selected`

### Epic 3 Deferred Items — Prevent Replication

- **D-1 (delete non-atomic):** FIXED in Task 6.4 — delete doc first, images second
- **D-3 (double-submit):** FIXED in Task 4.15 — `if (saving) return;` at top of `handleSubmit()`
- **D-2 (back button bypass):** FIXED in Task 6.5 — unsaved changes check before switching viewMode

### Testing Strategy

**Unit tests (Vitest):** Mock Firebase client SDK via `vi.mock('firebase/firestore')`. Use updated factory `createBlogPost()` from `src/test/factories/blog-post.ts` (TipTap JSON content). Co-locate in `__tests__/`.

**E2E tests (Playwright):** Reuse `ensureAdminLogin()` from `tests/e2e/admin-helpers.ts`. TipTap editor is `contenteditable` — use `page.keyboard.type()` after clicking the `.ProseMirror` element (NOT `.fill()`). Use `tests/e2e/admin-projects.spec.ts` as template for serial test structure.

**Coverage target:** ~35 tests across 4 unit test files + 1 E2E file.

### Project Structure Notes

- All paths follow kebab-case convention
- Components follow PascalCase naming
- Blog CRUD follows identical architecture to Projects/Technologies/Experiences CRUD
- `COLLECTION_PATHS.blogPosts` already registered in `collections.ts`
- `parseBlogPost()` already exists in `collections.ts`
- `blogPostSchema` already exists in `blog-post-schema.ts` (extend, don't replace)
- `AdminDashboard.svelte` already counts `blogPosts` — verify compatibility after schema changes

### References

**Planning artifacts:**
- [epics.md#Epic 4, Story 4.1] — Acceptance criteria, epic scope, cross-story dependencies
- [architecture.md#Blog Editor, #Image Lifecycle] — TipTap decision, storage paths, ImageSlot
- [ux-design-specification.md#Journey 3] — Blog editor UX flow, form layout, interaction patterns
- [prd.md#FR31-FR37] — Blog functional requirements

**Implementation context:**
- [epic-3-retro-2026-03-22.md] — Deferred items D-1/D-2/D-3, E2E mandatory, browser verification required
- [project-context.md] — Form state patterns, image lifecycle, accessibility baseline

**Codebase (extend/reuse):**
- [src/lib/schemas/blog-post-schema.ts] — Existing schema (extend with variants)
- [src/lib/firebase/collections.ts] — `parseBlogPost()`, `COLLECTION_PATHS.blogPosts`
- [src/lib/utils/slugify.ts] — Reuse for auto-slug (Spanish accent support)
- [src/components/admin/ExperiencesCrudPage.svelte] — Primary CRUD orchestrator template
- [src/components/admin/ExperienceForm.svelte] — Primary form template (validation, hasChanges)
- [src/components/admin/ProjectForm.svelte] — Image upload handling template
- [src/test/factories/blog-post.ts] — Test factory (update content format)

**External:**
- [TipTap v3 docs] — StarterKit, Image/Link extensions, `generateHTML()`
- [Svelte 5 createSubscriber] — Bridge TipTap transactions to Svelte reactivity

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (1M context)

### Debug Log References

- **TipTap cursor loss bug:** `$effect` in RichTextEditor tracked `content` prop reactively, causing editor destroy/recreate on every keystroke. Fixed with `untrack()` to read `content` and `onUpdate` without creating reactive dependencies.
- **Slug from wrong locale:** Story spec said "auto-generate from ES title" but `defaultLocale = 'en'` — slugs appear in URLs without locale prefix, so EN is correct. Also found same bug in ProjectForm.svelte (pre-existing from Epic 3). Both fixed.
- **Slug empty-clear bug:** `if (title)` guard prevented slug from clearing when title emptied. Fixed with ternary: `title ? slugify(title) : ''`.

### Completion Notes List

- **Task 1:** Installed TipTap v3 (@tiptap/core, @tiptap/pm, @tiptap/starter-kit, @tiptap/extension-image, @tiptap/extension-link). Build and type-check pass.
- **Task 2:** Extended blog-post-schema.ts: coverImage now optional, added blogPostFirestoreSchema (omits id, images defaults []), blogPostFormSchema (title, content, slug, status only), exported BlogPostFirestore/BlogPostForm/BlogPostWithId types. Updated test factory to TipTap JSON. Created tiptap-helpers.ts with isTipTapContentEmpty().
- **Task 3:** Created RichTextEditor.svelte using @tiptap/core with Svelte 5 createSubscriber() pattern. Toolbar: H1-H3, Bold, Code block, Link, Image, Lists. Error recovery with initError fallback. aria-label, role="toolbar", editor destroy cleanup.
- **Task 4:** Created BlogForm.svelte following ExperienceForm/ProjectForm patterns. BilingualField for title, auto-slug from EN title (defaultLocale), slug uniqueness check, two RichTextEditor instances with CSS display:none tab switch, ImageUploader for optional cover, status select, full validation with isTipTapContentEmpty, create flow with addDoc + processImageSlot, initializedForId guard, hasChanges/getHasChanges export, upload handle cleanup, double-submit guard, aria-busy.
- **Task 5:** Created BlogList.svelte following ExperienceList pattern. Loads BlogPosts ordered by createdAt desc, safeParse with skip invalid, status badges (green Publicado / orange Borrador), formatted dates, empty state with CTA, skeleton loader with aria-busy, error state with retry, exposed loadPosts().
- **Task 6:** Created BlogCrudPage.svelte following ExperiencesCrudPage pattern. viewMode state machine, BlogList/BlogForm wiring, delete flow (doc first D-1, images second non-blocking), unsaved changes guard (D-2), ConfirmDialog, Toast.
- **Task 7:** Updated blog.astro to use BlogCrudPage client:only="svelte" within AuthGuard/AdminLayout.
- **Task 8:** Added 33 admin.blog.* i18n keys in translations.ts covering page, labels, status, toasts, empty/loading/error, delete dialog, validation, form actions, list actions, editor.
- **Task 9:** Created 4 unit test files (39 files total, 1017 tests passing): blog-post-schema.test.ts (15 tests), blog-list.test.ts (8 tests), blog-form.test.ts (15 tests), blog-crud.test.ts (7 tests). All follow existing Firebase mock patterns.
- **Task 10:** Created admin-blog.spec.ts E2E test: create article with TipTap content, verify in list with Borrador badge, empty state CTA test, delete and verify removed.
- All Epic 3 deferred fixes applied: D-1 (delete doc first), D-2 (unsaved changes guard), D-3 (double-submit guard).
- 0 lint errors, 0 type-check errors, 0 test failures.

### Change Log

- 2026-03-23: Story 4.1 implemented — full Blog CRUD (list, create, delete, edit skeleton) with TipTap rich text editor
- 2026-03-23: Post-implementation fixes — TipTap cursor loss (untrack), slug from EN not ES (defaultLocale alignment), slug empty-clear, also fixed pre-existing ProjectForm slug-from-ES bug. Added 2 rules to project-context.md.
- 2026-03-23: Code review fixes — (P-1) double-submit race: moved saving=true before async validateAll(), (P-2) Link extension protocols restricted to http/https/mailto, (P-3) E2E replaced waitForTimeout with condition-based wait. Documented TOCTOU slug race limitation.

### File List

**New files:**
- src/components/admin/RichTextEditor.svelte
- src/components/admin/BlogForm.svelte
- src/components/admin/BlogList.svelte
- src/components/admin/BlogCrudPage.svelte
- src/lib/utils/tiptap-helpers.ts
- src/components/admin/__tests__/blog-list.test.ts
- src/components/admin/__tests__/blog-form.test.ts
- src/components/admin/__tests__/blog-crud.test.ts
- src/lib/__tests__/blog-post-schema.test.ts
- tests/e2e/admin-blog.spec.ts

**Modified files:**
- src/lib/schemas/blog-post-schema.ts (added firestore/form variants, coverImage optional)
- src/test/factories/blog-post.ts (updated content to TipTap JSON)
- src/lib/i18n/translations.ts (added admin.blog.* keys)
- src/pages/admin/blog.astro (replaced placeholder with BlogCrudPage)
- src/components/admin/ProjectForm.svelte (slug from EN instead of ES, empty-clear fix)
- _bmad-output/project-context.md (added slug-from-EN rule + anti-pattern)
- package.json / pnpm-lock.yaml (TipTap dependencies)
