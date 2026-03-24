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
  - [ ] 2.2 Add text extraction helper: `extractTextFromTipTap(json: string): string` — recursively walk `content[]` arrays, collect `text` fields from text nodes, join with spaces
  - [ ] 2.3 Handle edge cases: empty content returns 1 min, invalid JSON returns 1 min (graceful fallback)

- [ ] Task 3: Blog date formatter (AC: #1)
  - [ ] 3.1 In `src/lib/utils/format-date.ts`, add `formatBlogDate(date: Date, locale: Locale): string` — use `new Intl.DateTimeFormat(intlLocale, { year: 'numeric', month: 'long', day: 'numeric' })`. Map locale: `'es'` → `'es-ES'`, `'en'` → `'en-US'`

- [ ] Task 4: Public blog i18n translations (AC: #1, #5, #7)
  - [ ] 4.1 In `src/lib/i18n/translations.ts`, add keys (follow `projects.*` pattern):
    - `'blog.meta.title'`: `{ es: 'Blog — ChrisBP', en: 'Blog — ChrisBP' }`
    - `'blog.meta.description'`: `{ es: 'Artículos sobre desarrollo web, tecnología y proceso creativo', en: 'Articles about web development, technology and creative process' }`
    - `'blog.heading'`: `{ es: 'Blog', en: 'Blog' }`
    - `'blog.intro'`: intro paragraph for the blog page (ES/EN)
    - `'blog.noArticles'`: `{ es: 'No hay artículos publicados aún.', en: 'No published articles yet.' }`
    - `'blog.readingTime'`: `{ es: '{minutes} min de lectura', en: '{minutes} min read' }`
  - [ ] 4.2 Add `'blog'` to the translation type if the type system requires it

- [ ] Task 5: BlogCard.astro component (AC: #1, #3, #4)
  - [ ] 5.1 Create `src/components/blog/BlogCard.astro` — receives `post: BlogPost`, `locale: Locale`, `readingTimeLabel: string`
  - [ ] 5.2 Wrap in `<a>` linking to `/blog/{slug}` (use `localizeHref` for locale prefix). Entire card is clickable
  - [ ] 5.3 Use Card.astro as wrapper with `as="article"`, `hoverable={true}`
  - [ ] 5.4 Layout: cover image thumbnail (left/top), title `<h2>`, date (formatted with `formatBlogDate`), reading time (with `calculateReadingTime`). Use `<time datetime="...">` for date
  - [ ] 5.5 Cover image: if `post.coverImage` exists, render `<img>` with `loading="lazy"`, `alt={post.title[locale]}`, fixed aspect ratio. If no cover, show placeholder or omit
  - [ ] 5.6 Use `post.title[locale]` for bilingual title, `post.content[locale]` for reading time calculation
  - [ ] 5.7 Responsive: stack vertically on mobile, horizontal on larger screens. Match project cards grid (1 col mobile, 2 cols tablet, 3 cols desktop)

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
  - [ ] 10.5 Mock Firestore with chained `.where().orderBy().get()` — follow pattern of existing collection tests

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

### Reading Time Calculation

**Formula:** `Math.max(1, Math.ceil(wordCount / 200))`
- 200 words/minute is standard blog reading speed
- Minimum 1 minute (even for very short posts)
- Count words by splitting extracted text on whitespace

**Function signature:**
```typescript
// src/lib/utils/reading-time.ts
export function extractTextFromTipTap(json: string): string {
  // Parse JSON, recursively collect text nodes
}

export function calculateReadingTime(contentJson: string): number {
  const text = extractTextFromTipTap(contentJson);
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / 200));
}
```

### Locale Routing Pattern — Two Files (Confirmed)

The project uses **separate Astro files** for each locale:
- EN (default, no prefix): `src/pages/blog/index.astro` → `/blog`
- ES (prefix `/es/`): `src/pages/es/blog/index.astro` → `/es/blog`

Both files are identical in logic — only import paths differ (ES adds one `../` level). Locale is auto-detected from URL via `getLocaleFromUrl(Astro.url)`.

**Confirmed by existing pattern:**
- `src/pages/projects/index.astro` (EN)
- `src/pages/es/projects/index.astro` (ES)

### Page Template Pattern (from projects)

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import Section from '../../components/common/Section.astro';
import Container from '../../components/common/Container.astro';
import BlogCard from '../../components/blog/BlogCard.astro';
import { adminDb } from '../../lib/firebase/admin';
import { getPublishedBlogPosts } from '../../lib/firebase/collections';
import { getLocaleFromUrl } from '../../lib/i18n/config';
import { t } from '../../lib/i18n/translations';

const locale = getLocaleFromUrl(Astro.url);
const posts = await getPublishedBlogPosts(adminDb);
---

<BaseLayout
  title={t('blog.meta.title', locale)}
  description={t('blog.meta.description', locale)}
  currentPage="blog"
>
  <Section variant="default">
    <Container variant="default">
      <h1 class="sr-only">{t('blog.heading', locale)}</h1>
      <p class="text-body text-text-secondary mb-8">
        {t('blog.intro', locale)}
      </p>
      {posts.length > 0 ? (
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <BlogCard
              post={post}
              locale={locale}
              readingTimeLabel={t('blog.readingTime', locale)}
            />
          ))}
        </div>
      ) : (
        <p class="text-text-secondary text-center py-12">
          {t('blog.noArticles', locale)}
        </p>
      )}
    </Container>
  </Section>
</BaseLayout>
```

### Collection Helper Pattern

Follow `getAllProjects()` (collections.ts:78-81). The new function filters by `status === 'published'`:

```typescript
export async function getPublishedBlogPosts(db: Firestore): Promise<BlogPost[]> {
  const snapshot = await db
    .collection(COLLECTION_PATHS.blogPosts)
    .where('status', '==', 'published')
    .orderBy('createdAt', 'desc')
    .get();
  return snapshot.docs.map((doc) =>
    parseBlogPost(doc.data() as Record<string, unknown>, doc.id),
  );
}
```

**Firestore composite index required:** This query uses `.where('status', ...)` + `.orderBy('createdAt', ...)` on different fields. Firestore will auto-suggest the index when the query first runs. If running against emulators, no index is needed. For production, the index will be created automatically on first deploy or can be added to `firestore.indexes.json`.

### BlogCard.astro — Component Design

**Props:** `post: BlogPost`, `locale: Locale`, `readingTimeLabel: string`

**Structure:**
```
┌─────────────────────────────────┐
│  ┌────────────────────────────┐ │
│  │     Cover Image            │ │  ← lazy loaded, aspect-ratio 16/9
│  └────────────────────────────┘ │
│  Title (h2)                     │  ← post.title[locale]
│  📅 March 15, 2026 · 5 min read│  ← formatBlogDate + calculateReadingTime
└─────────────────────────────────┘
```

Entire card is wrapped in `<a href="/blog/{slug}">` (with `localizeHref` for ES prefix). Use Card.astro with `as="article"`, `hoverable={true}`.

**Cover image handling:**
- If `post.coverImage` exists: `<img src={post.coverImage.url} alt={post.title[locale]} loading="lazy" class="rounded-lg aspect-video object-cover w-full">`
- If no cover image: omit the image section (no placeholder needed — the card still shows title + metadata)

**Date element:** Use `<time datetime={post.createdAt.toISOString()}>` for semantic HTML.

**Reading time:** Replace `{minutes}` placeholder in `readingTimeLabel` with calculated value.

### Existing Components to REUSE

| Component | File | Usage |
|---|---|---|
| Card.astro | `src/components/common/Card.astro` | Wrapper with `as="article"`, `hoverable={true}` |
| Section.astro | `src/components/common/Section.astro` | Page section with `variant="default"` |
| Container.astro | `src/components/common/Container.astro` | Content wrapper with `variant="default"` |
| BaseLayout.astro | `src/layouts/BaseLayout.astro` | Page shell, already accepts `currentPage="blog"` |

### Navigation — Already Configured

Blog is already in the navigation (`src/data/navigation.ts:6`):
```typescript
{ key: 'blog', href: '/blog', label: { es: 'Blog', en: 'Blog' } },
```

`BaseLayout.astro` already accepts `currentPage="blog"` in its type definition. **No navigation changes needed.**

### E2E Testing Strategy

Follow `projects-page.spec.ts` pattern exactly. The tests run against `pnpm preview` (built static pages).

**Data availability:** The SSG build queries Firestore at build time. If no published blog posts exist in the data source (emulators or production), the empty state will show. Tests should handle both scenarios:
- If articles present: verify card structure
- Always: verify page loads, heading, intro text, meta tags

**Test file structure:**
```typescript
test.describe('Blog Page — EN', () => {
  test('page loads with heading and intro text', async ({ page }) => { ... });
  test('article cards show title, date, and reading time', async ({ page }) => { ... });
  test('article cards link to /blog/[slug]', async ({ page }) => { ... });
});

test.describe('Blog Page — ES', () => {
  test('page loads at /es/blog with Spanish content', async ({ page }) => { ... });
});
```

### Previous Story Learnings (Stories 4-1, 4-2, 4-3)

- **TipTap content is JSON string**: Stored via `JSON.stringify(editor.getJSON())`, NOT HTML. Use `JSON.parse()` to process
- **Slug from EN (defaultLocale)**: Confirmed — slugs are English, URLs are `/blog/[slug]` without locale prefix for EN, `/es/blog/[slug]` for ES
- **`parseBlogPost()` already exists**: In collections.ts:64-71 — handles date conversion with `toDate()`
- **Blog post schema**: `coverImage` is optional (`.optional()`), `images` defaults to `[]`. Handle missing coverImage gracefully
- **Admin creates posts with client SDK, public reads with Admin SDK**: Different Firebase SDKs — admin writes at runtime, public reads at build time

### Git Intelligence

Recent commits show the blog admin CRUD is complete (stories 4-1, 4-2, 4-3). All blog data models, schemas, and admin infrastructure are in place. This story builds the public-facing read layer.

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
