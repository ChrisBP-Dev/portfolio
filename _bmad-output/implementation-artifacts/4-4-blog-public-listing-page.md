# Story 4.4: Blog Public — Listing Page

Status: ready-for-dev

## Story

As a visitor,
I want to see a list of published blog articles,
So that I can discover Christopher's technical writing.

## Acceptance Criteria

1. **Given** I navigate to `/blog` **When** page loads **Then** list of published articles as cards: title, date, estimated reading time, cover image thumbnail.
2. **And** only articles with `status: 'published'` are visible — drafts are NOT shown.
3. **And** cards are visually consistent with project cards style (same Card component, blog variant).
4. **And** clicking a card navigates to `/blog/[slug]`.
5. **And** `/es/blog` shows Spanish version with Spanish titles.
6. **And** page generated at build time from Firestore BlogPosts collection (only published).
7. **And** empty state shows when no published articles exist.

**(FR6, FR37, UX-DR29)**

## Scope Note

This story creates the **public blog listing page only**. The individual article page (`/blog/[slug]`) with rich content rendering and OpenGraph is **Story 4-5**.

**In scope:**
- `getAllBlogPosts()` collection helper (filter `status === 'published'`, order by `createdAt desc`)
- `calculateReadingTime()` utility for TipTap JSON content
- `formatBlogDate()` utility for article dates
- `BlogCard.astro` component
- Blog listing pages (EN at `/blog`, ES at `/es/blog`)
- Public blog i18n translations
- Unit tests for new utilities and collection helper
- E2E tests for page structure and bilingual routing

**Out of scope:**
- Blog article detail page (`/blog/[slug]`) — Story 4-5
- OpenGraph per article — Story 4-5
- Blog HTML content rendering with sanitize-html — Story 4-5

## Tasks / Subtasks

- [ ] Task 1: `getAllBlogPosts()` collection helper (AC: #2, #6)
  - [ ] 1.1 In `src/lib/firebase/collections.ts`, add `getPublishedBlogPosts(db: Firestore): Promise<BlogPost[]>` — query `BlogPosts` collection with `.where('status', '==', 'published').orderBy('createdAt', 'desc')`, parse with `parseBlogPost()`
  - [ ] 1.2 Follow exact pattern of `getAllProjects()` (line 78-81): snapshot → docs.map → parse

- [ ] Task 2: Reading time utility (AC: #1)
  - [ ] 2.1 Create `src/lib/utils/reading-time.ts` with `calculateReadingTime(contentJson: string): number` — parse TipTap JSON, recursively extract text from all nodes, count words (split by whitespace), return `Math.max(1, Math.ceil(wordCount / 200))`
  - [ ] 2.2 Add text extraction helper: `extractTextFromTipTap(json: string): string` — recursively walk `content[]` arrays, collect `text` fields from text nodes, join with spaces. Follow the recursive traversal pattern from `findImageNodes` in `tiptap-helpers.ts:20-30` for consistency
  - [ ] 2.3 Handle edge cases: empty content returns 1 min, invalid JSON returns 1 min (graceful fallback)

- [ ] Task 3: Blog date formatter (AC: #1)
  - [ ] 3.1 In `src/lib/utils/format-date.ts`, add `formatBlogDate(date: Date, locale: Locale): string` — use `new Intl.DateTimeFormat(intlLocale, { year: 'numeric', month: 'long', day: 'numeric' })`. Map locale: `'es'` → `'es-ES'`, `'en'` → `'en-US'`

- [ ] Task 4: Public blog i18n translations (AC: #1, #5, #7)
  - [ ] 4.1 In `src/lib/i18n/translations.ts`, add keys (follow `projects.*` pattern):
    - `'blog.meta.title'`: `{ es: 'Blog — ChrisBP', en: 'Blog — ChrisBP' }`
    - `'blog.meta.description'`: `{ es: 'Artículos sobre desarrollo web, tecnología y proceso creativo', en: 'Articles about web development, technology and creative process' }`
    - `'blog.heading'`: `{ es: 'Blog', en: 'Blog' }`
    - `'blog.intro'`: `{ es: 'Artículos sobre desarrollo web, tecnología y mi proceso creativo como desarrollador.', en: 'Articles about web development, technology, and my creative process as a developer.' }`
    - `'blog.noArticles'`: `{ es: 'No hay artículos publicados aún.', en: 'No published articles yet.' }`
    - `'blog.readingTime'`: `{ es: '{minutes} min de lectura', en: '{minutes} min read' }`
  - [ ] 4.2 Add `'blog'` to the translation type if the type system requires it

- [ ] Task 5: BlogCard.astro component (AC: #1, #3, #4)
  - [ ] 5.1 Create `src/components/blog/BlogCard.astro` — receives `post: BlogPost`, `locale: Locale`, `readingTimeLabel: string`
  - [ ] 5.2 Wrap in `<a>` linking to `/blog/{slug}` (import `localizeHref` from `../../data/navigation` for locale prefix). Entire card is clickable
  - [ ] 5.3 Use Card.astro as wrapper with `as="article"`, `hoverable={true}`, `class="p-0"` — Card.astro applies `p-4` by default; override to `p-0` so cover image goes edge-to-edge, then add `p-4` only to the text content `<div>` inside
  - [ ] 5.4 Layout: cover image thumbnail (left/top), title `<h2>`, date (formatted with `formatBlogDate`), reading time (with `calculateReadingTime`). Use `<time datetime="...">` for date
  - [ ] 5.5 Cover image: if `post.coverImage` exists, render `<img>` with `loading="lazy"`, `alt={post.title[locale]}`, fixed aspect ratio. If no cover image, omit the image section entirely (no placeholder needed)
  - [ ] 5.6 Use `post.title[locale]` for bilingual title, `post.content[locale]` for reading time calculation
  - [ ] 5.7 Card layout is always vertical (image top → text bottom). Responsive applies to the **grid** only (1 col mobile, 2 cols tablet, 3 cols desktop) — matching project cards grid

- [ ] Task 6: Blog listing page — EN (AC: #1, #2, #4, #6)
  - [ ] 6.1 Create `src/pages/blog/index.astro` — follow exact pattern of `src/pages/projects/index.astro`
  - [ ] 6.2 Import and use: `BaseLayout`, `Section`, `Container`, `BlogCard`, `adminDb`, `getPublishedBlogPosts`, `getLocaleFromUrl`, `t`, `calculateReadingTime`, `formatBlogDate`
  - [ ] 6.3 Build-time query: `const posts = await getPublishedBlogPosts(adminDb);`
  - [ ] 6.4 BaseLayout props: `title={t('blog.meta.title', locale)}`, `description={t('blog.meta.description', locale)}`, `currentPage="blog"`
  - [ ] 6.5 Structure: `<h1 class="sr-only">` heading + intro paragraph + grid of BlogCard components, or empty state if `posts.length === 0`
  - [ ] 6.6 Grid: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6` (match project cards grid)

- [ ] Task 7: Blog listing page — ES (AC: #5)
  - [ ] 7.1 Create `src/pages/es/blog/index.astro` — same content as EN page, only import paths differ (add one `../` level)
  - [ ] 7.2 Locale auto-detected from URL via `getLocaleFromUrl(Astro.url)` — no hardcoded locale

- [ ] Task 8: Unit tests — reading time utility (AC: #1)
  - [ ] 8.1 Create `src/lib/utils/__tests__/reading-time.test.ts`
  - [ ] 8.2 Test: single paragraph with ~200 words → 1 min
  - [ ] 8.3 Test: ~600 words → 3 min
  - [ ] 8.4 Test: empty content (empty doc) → 1 min
  - [ ] 8.5 Test: invalid JSON → 1 min (graceful fallback)
  - [ ] 8.6 Test: content with headings, lists, code blocks → correctly counts all text nodes
  - [ ] 8.7 Test: `extractTextFromTipTap` extracts text from nested TipTap JSON structure

- [ ] Task 9: Unit tests — blog date formatter (AC: #1)
  - [ ] 9.1 In `src/lib/utils/__tests__/format-date.test.ts` (extend existing), add tests for `formatBlogDate`
  - [ ] 9.2 Test: EN locale → "March 15, 2026" format
  - [ ] 9.3 Test: ES locale → "15 de marzo de 2026" format

- [ ] Task 10: Unit tests — collection helper (AC: #2)
  - [ ] 10.1 In `src/lib/firebase/__tests__/collections.test.ts` (extend existing), add tests for `getPublishedBlogPosts`
  - [ ] 10.2 Test: returns only published posts (filter applied)
  - [ ] 10.3 Test: returns posts ordered by createdAt desc
  - [ ] 10.4 Test: returns empty array when no published posts
  - [ ] 10.5 Mock Firestore with chained `.where().orderBy().get()` — follow pattern of existing collection tests. Use `createBlogPost` factory from `src/test/factories` (already exists)

- [ ] Task 11: E2E tests — blog listing page (AC: #1, #3, #4, #5, #7)
  - [ ] 11.1 Create `tests/e2e/blog-page.spec.ts` — follow pattern of `projects-page.spec.ts`
  - [ ] 11.2 Test EN: page loads at `/blog` with heading and intro text
  - [ ] 11.3 Test EN: if articles exist, cards show `<article>` elements with `<h2>` title, `<time>` date, and reading time
  - [ ] 11.4 Test EN: cards link to `/blog/[slug]` URL pattern
  - [ ] 11.5 Test ES: page loads at `/es/blog` with Spanish content
  - [ ] 11.6 Test: page title and meta description are set correctly

## Dev Notes

### Content Storage Format — TipTap JSON

Blog post content is stored as **TipTap JSON string** (NOT HTML). The RichTextEditor saves via `JSON.stringify(editor.getJSON())` (`RichTextEditor.svelte:66`).

**TipTap JSON structure:**
```json
{
  "type": "doc",
  "content": [
    { "type": "paragraph", "content": [{ "type": "text", "text": "Hello world" }] },
    { "type": "heading", "attrs": { "level": 2 }, "content": [{ "type": "text", "text": "Section" }] },
    { "type": "bulletList", "content": [
      { "type": "listItem", "content": [
        { "type": "paragraph", "content": [{ "type": "text", "text": "Item 1" }] }
      ]}
    ]},
    { "type": "image", "attrs": { "src": "https://...", "alt": "..." } }
  ]
}
```

To extract text for reading time: recursively walk `content[]` arrays, collect `text` fields from nodes with `type === 'text'`, join with spaces, count words. Ignore image nodes (no text).

### Reading Time — Formula & Edge Cases

**Formula:** `Math.max(1, Math.ceil(wordCount / 200))` — 200 wpm standard, minimum 1 min.

```typescript
// src/lib/utils/reading-time.ts
export function extractTextFromTipTap(json: string): string { /* recursive text node collection */ }
export function calculateReadingTime(contentJson: string): number {
  const text = extractTextFromTipTap(contentJson);
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / 200));
}
```

Edge cases: empty string → 1 min, invalid JSON → 1 min, `null`/`undefined` → 1 min (graceful fallback with try-catch).

### BlogCard.astro — Layout & Padding

```
┌─────────────────────────────────┐  ← Card.astro with class="p-0" (override default p-4)
│  Cover Image (edge-to-edge)     │  ← aspect-video, rounded-t-xl, lazy
├─────────────────────────────────┤
│  ┌─ p-4 ─────────────────────┐ │  ← text content div with own padding
│  │ Title (h2)                 │ │
│  │ <time> date · N min read   │ │
│  └────────────────────────────┘ │
└─────────────────────────────────┘
```

- Card wraps with `as="article"`, `hoverable={true}`, `class="p-0"`
- Cover image: `rounded-t-xl` (match Card's `rounded-xl`), omit entirely if no `coverImage`
- `<a href={localizeHref('/blog/' + post.slug, locale)}>` wraps entire card — import `localizeHref` from `../../data/navigation`
- `<time datetime={post.createdAt.toISOString()}>` for semantic date
- Reading time: `readingTimeLabel.replace('{minutes}', String(calculateReadingTime(post.content[locale])))`

### Firestore Composite Index Note

The `.where('status', ...)` + `.orderBy('createdAt', ...)` query requires a composite index. Emulators don't need it; production auto-suggests on first run or add to `firestore.indexes.json`.

### Existing Infrastructure — No Changes Needed

- **Navigation:** Blog already in `src/data/navigation.ts:6` — no changes needed
- **BaseLayout:** Already accepts `currentPage="blog"` — no changes needed
- **Card.astro:** `src/components/common/Card.astro` — accepts `as`, `hoverable`, `class` props
- **Section/Container:** `src/components/common/` — use `variant="default"`
- **`localizeHref()`:** In `src/data/navigation.ts` — prefixes `/es` for ES locale
- **`getLocaleFromUrl()`:** In `src/lib/i18n/config.ts` — extracts locale from URL
- **`createBlogPost` factory:** In `src/test/factories` — use in unit tests

### E2E Testing Notes

Tests run against `pnpm preview` (built static pages). If no published posts exist at build time, empty state shows. Tests should handle both scenarios: always verify page loads + meta, conditionally verify cards if articles present.

### Previous Story Learnings (4-1 → 4-3)

- **TipTap content is JSON string** (NOT HTML) — use `JSON.parse()` to process
- **Slug from EN** (`defaultLocale = 'en'`) — URLs: `/blog/[slug]` (EN), `/es/blog/[slug]` (ES)
- **`parseBlogPost()` already exists** in `collections.ts:64-71` with `toDate()` conversion
- **`coverImage` is optional** — handle missing gracefully (omit image section)
- **Public reads use Admin SDK** (`adminDb`) at build time, not client SDK

### Accessibility Requirements

- `<h1 class="sr-only">` for page heading (follows projects page pattern)
- `<article>` tag on each blog card (via Card `as="article"`)
- `<time datetime="...">` for dates (machine-readable)
- `alt` text on cover images (use `post.title[locale]`)
- `loading="lazy"` on cover images (below-the-fold)
- Semantic heading hierarchy: page `<h1>` (sr-only) → card `<h2>` (title)
- All card content inside `<a>` with clear focus state for keyboard navigation

### Project Structure Notes

```
src/
├── pages/
│   ├── blog/
│   │   └── index.astro              # NEW — Blog listing EN
│   └── es/
│       └── blog/
│           └── index.astro          # NEW — Blog listing ES
├── components/
│   └── blog/
│       └── BlogCard.astro           # NEW — Blog article card
├── lib/
│   ├── firebase/
│   │   └── collections.ts          # MODIFY — add getPublishedBlogPosts()
│   ├── utils/
│   │   ├── reading-time.ts         # NEW — calculateReadingTime + extractTextFromTipTap
│   │   ├── format-date.ts          # MODIFY — add formatBlogDate()
│   │   └── __tests__/
│   │       ├── reading-time.test.ts # NEW — reading time unit tests
│   │       └── format-date.test.ts  # MODIFY — add formatBlogDate tests
│   └── i18n/
│       └── translations.ts         # MODIFY — add blog.* public keys
└── lib/firebase/__tests__/
    └── collections.test.ts          # MODIFY — add getPublishedBlogPosts tests

tests/e2e/
└── blog-page.spec.ts               # NEW — Blog listing E2E tests
```

### References

**Planning artifacts:**
- [epics.md#Epic 4, Story 4.4] — Acceptance criteria, FR6, FR37
- [architecture.md#Data Architecture] — BlogPosts schema, SSG data fetch pattern
- [architecture.md#Frontend Architecture] — Routing for blog pages, Card component
- [ux-design-specification.md#Chosen Direction] — Blog as visual extension of site, cards with metadata
- [prd.md#FR6] — Visitors can view listing of published blog articles
- [prd.md#FR37] — Only published articles visible in public

**Implementation context:**
- [4-3-blog-crud-edit-delete-y-status-toggle.md] — Blog admin CRUD complete, content stored as TipTap JSON
- [project-context.md] — SSG build time pattern, Admin SDK for public pages, Intl.DateTimeFormat for dates

**Codebase (modify):**
- [src/lib/firebase/collections.ts] — Add `getPublishedBlogPosts()` function
- [src/lib/utils/format-date.ts] — Add `formatBlogDate()` function
- [src/lib/i18n/translations.ts] — Add `blog.*` public translation keys
- [src/lib/firebase/__tests__/collections.test.ts] — Add collection helper tests
- [src/lib/utils/__tests__/format-date.test.ts] — Add date formatter tests

**Codebase (new):**
- [src/pages/blog/index.astro] — Blog listing page EN
- [src/pages/es/blog/index.astro] — Blog listing page ES
- [src/components/blog/BlogCard.astro] — Blog card component
- [src/lib/utils/reading-time.ts] — Reading time utility
- [src/lib/utils/__tests__/reading-time.test.ts] — Reading time tests
- [tests/e2e/blog-page.spec.ts] — E2E tests

**Codebase (reference — patterns to follow):**
- [src/pages/projects/index.astro] — Page structure, build-time query, BaseLayout usage
- [src/pages/es/projects/index.astro] — ES locale page (identical logic, different import paths)
- [src/lib/firebase/collections.ts:78-81] — `getAllProjects()` pattern for Firestore query
- [src/components/common/Card.astro] — Generic card wrapper
- [src/lib/utils/tiptap-helpers.ts:20-30] — Recursive TipTap JSON node traversal pattern
- [tests/e2e/projects-page.spec.ts] — E2E test pattern for public listing pages
- [src/data/navigation.ts:6] — Blog already in nav items

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
