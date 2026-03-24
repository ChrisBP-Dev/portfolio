# Story 4.5: Blog Public — Article Page y OpenGraph

Status: review

## Story

As a visitor,
I want to read a blog article with professional formatting and share it on LinkedIn,
So that I can evaluate Christopher's technical depth and share it with others.

## Acceptance Criteria

1. **Given** I navigate to `/blog/[slug]` **When** page loads **Then** article renders with: title, date, reading time, cover image, rich content (headings, paragraphs, lists, code blocks with monospace font, embedded images, links).
2. **And** content area max-width 720px for optimal reading.
3. **And** code blocks use JetBrains Mono font with syntax-appropriate styling.
4. **And** OpenGraph meta tags generated per article: `og:title`, `og:description`, `og:image` (cover image URL), `og:type: article`.
5. **And** Twitter Card meta tags included.
6. **And** pasting URL in LinkedIn shows professional preview with title, description and cover image.
7. **And** `/es/blog/[slug]` shows Spanish version.
8. **And** page generated at build time via `getStaticPaths()`.

**(FR7, FR43, FR46 partial, UX-DR30)**

## Tasks / Subtasks

- [x] Task 1: TipTap JSON to HTML renderer (AC: #1, #3)
  - [x] 1.1 Create `src/lib/utils/tiptap-renderer.ts` with `renderTipTapToHtml(json: string): string`
  - [x] 1.2 Parse TipTap JSON, recursively walk nodes, emit HTML string. Handle all node types used by the editor: `doc`, `paragraph`, `heading` (levels 1-3), `bulletList`, `orderedList`, `listItem`, `codeBlock`, `blockquote`, `horizontalRule`, `hardBreak`, `image`
  - [x] 1.3 Handle all mark types: `bold` → `<strong>`, `italic` → `<em>`, `strike` → `<s>`, `code` → `<code>`, `link` → `<a href="..." target="_blank" rel="noopener noreferrer">`
  - [x] 1.4 Image nodes: `<img src="..." alt="..." loading="lazy" />` — use `attrs.src` and `attrs.alt`
  - [x] 1.5 Code blocks: `<pre><code>...</code></pre>` — CSS class `blog-code-block` added for JetBrains Mono styling
  - [x] 1.6 Graceful fallback: invalid JSON or empty content returns empty string

- [x] Task 2: HTML sanitization utility (AC: #1)
  - [x] 2.0 Install `@types/sanitize-html` as devDependency: `pnpm add -D @types/sanitize-html` — required for TypeScript strict mode. Verify first: run `pnpm add -D @types/sanitize-html` — if types are already bundled in `sanitize-html@2.17.1` this will be a no-op or redundant (safe either way)
  - [x] 2.1 Create `src/lib/utils/sanitize-blog-html.ts` with `sanitizeBlogHtml(html: string): string`
  - [x] 2.2 Use `sanitize-html` (already in `package.json` v2.17.1) with allowlist: tags `h1, h2, h3, p, ul, ol, li, blockquote, pre, code, a, img, strong, em, s, br, hr`, allowed attributes: `a[href,target,rel]`, `img[src,alt,loading]`, `pre[class]`, `code[class]`
  - [x] 2.3 Compose pipeline: `sanitizeBlogHtml(renderTipTapToHtml(json))` — this is the safe render path

- [x] Task 3: Extend BaseLayout with OpenGraph props (AC: #4, #5)
  - [x] 3.1 Add optional Props to `BaseLayout.astro`: `ogImage?: string`, `ogType?: string`, `ogDescription?: string`
  - [x] 3.2 In `<head>`, add conditional OG meta tags: `og:title` (from existing `title` prop), `og:description` (from `ogDescription` ?? `description`), `og:image`, `og:type`, `og:url` (from canonical URL), `og:locale`, `og:site_name`
  - [x] 3.3 Add Twitter Card meta tags: `twitter:card` (use `summary_large_image` when `ogImage` is present, else `summary`), `twitter:title`, `twitter:description`, `twitter:image`
  - [x] 3.4 Existing pages that don't pass OG props remain unchanged (no regression)

- [x] Task 4: Blog article i18n translations (AC: #1, #7)
  - [x] 4.1 In `src/lib/i18n/translations.ts`, add keys:
    - `'blog.article.backToBlog'`: `{ es: '← Volver al Blog', en: '← Back to Blog' }`
    - `'blog.article.publishedOn'`: `{ es: 'Publicado el', en: 'Published on' }`

- [x] Task 5: BlogContent.astro component (AC: #1, #2, #3)
  - [x] 5.1 Create `src/components/blog/BlogContent.astro` — receives `contentHtml: string`
  - [x] 5.2 Render sanitized HTML via `<div class="blog-content" set:html={contentHtml} />`
  - [x] 5.3 Add scoped styles in `<style>` for `.blog-content` (using Astro's scoped styles with `:global()` for child selectors):
    - `max-width: 720px` on the wrapper (AC #2)
    - `h1, h2, h3`: heading sizes with `margin-top: 2rem, margin-bottom: 1rem`, `font-weight: bold`
    - `p`: `margin-bottom: 1rem`, `line-height: 1.75`
    - `ul, ol`: `list-style` (disc/decimal), `padding-left: 1.5rem`, `margin-bottom: 1rem`
    - `blockquote`: `border-left: 4px solid var(--color-primary)`, `padding-left: 1rem`, `color: var(--color-text-secondary)`, `margin-bottom: 1rem`
    - `pre` (code blocks): `background: var(--color-surface)`, `border: 1px solid var(--color-border)`, `border-radius: 0.75rem`, `padding: 1rem`, `overflow-x: auto`, `margin-bottom: 1rem`
    - `pre code`: `font-family: 'JetBrains Mono', monospace` (AC #3), `font-size: 0.875rem`, `line-height: 1.6`
    - Inline `code` (not inside `pre`): `background: var(--color-surface)`, `padding: 0.125rem 0.375rem`, `border-radius: 0.25rem`, `font-family: 'JetBrains Mono', monospace`, `font-size: 0.875em`
    - `img`: `max-width: 100%`, `border-radius: 0.75rem`, `margin: 1.5rem 0`
    - `a`: `color: var(--color-primary)`, `text-decoration: underline`
    - `hr`: `border-color: var(--color-border)`, `margin: 2rem 0`
    - `s`: `text-decoration: line-through`

- [x] Task 6: Blog article page — EN (AC: #1, #2, #4, #5, #8)
  - [x] 6.1 Create `src/pages/blog/[slug].astro` — follow pattern of `src/pages/projects/[slug].astro`
  - [x] 6.2 `getStaticPaths()`: call `getPublishedBlogPosts(adminDb)`, map each post to `{ params: { slug: post.slug }, props: { post } }`. If no posts, `console.warn` and return empty array
  - [x] 6.3 Import and use: `BaseLayout` (`../../layouts/BaseLayout.astro`), `Section`, `Container` (`../../components/common/`), `BlogContent` (`../../components/blog/BlogContent.astro`), `adminDb` (`../../lib/firebase/admin`), `getPublishedBlogPosts` (`../../lib/firebase/collections`), `getLocaleFromUrl` (`../../lib/i18n/config`), `t` (`../../lib/i18n/translations`), `localizeHref` (`../../data/navigation`), `calculateReadingTime`, `extractTextFromTipTap` (`../../lib/utils/reading-time`), `formatBlogDate` (`../../lib/utils/format-date`), `renderTipTapToHtml` (`../../lib/utils/tiptap-renderer`), `sanitizeBlogHtml` (`../../lib/utils/sanitize-blog-html`)
  - [x] 6.4 In frontmatter: compute `contentHtml = sanitizeBlogHtml(renderTipTapToHtml(post.content[locale]))`, `readingTime = calculateReadingTime(post.content[locale])`, `readingTimeLabel = t('blog.readingTime', locale).replace('{minutes}', String(readingTime))`
  - [x] 6.5 In frontmatter: `const ogDesc = extractTextFromTipTap(post.content[locale]).slice(0, 160);`. BaseLayout props: `title={post.title[locale] + ' — ChrisBP'}`, `description={ogDesc}`, `currentPage="blog"`, `ogImage={post.coverImage?.url}`, `ogType="article"`  — `ogDescription` omitted; BaseLayout uses `ogDescription ?? description` fallback, so passing only `description` avoids redundancy
  - [x] 6.6 Structure:
    - Back link: `<a href={localizeHref('/blog', locale)}>` with `t('blog.article.backToBlog', locale)`
    - `<h1>` with `post.title[locale]`
    - Meta row: `<p class="text-sm text-[var(--color-text-secondary)] mb-6"><time datetime={post.createdAt.toISOString()}>{t('blog.article.publishedOn', locale)} {formatBlogDate(post.createdAt, locale)}</time>{' · '}{readingTimeLabel}</p>`
    - Cover image: `{post.coverImage && (<img src={post.coverImage.url} alt={post.title[locale]} fetchpriority="high" class="w-full rounded-xl object-cover max-h-96 aspect-video mb-8" />)}` — only render when coverImage exists (field is optional in schema)
    - `<BlogContent contentHtml={contentHtml} />`
  - [x] 6.7 Wrap all content inside Section/Container with `<article>` semantic tag (accessibility requirement — single article per page)

- [x] Task 7: Blog article page — ES (AC: #7)
  - [x] 7.1 Create `src/pages/es/blog/[slug].astro` — copy `src/pages/blog/[slug].astro` and change ALL import paths from `../../` to `../../../` (3 levels deep). No other changes needed. See exact pattern in `src/pages/es/projects/[slug].astro`. Affected imports: `BaseLayout` (`../../../layouts/`), `Section`, `Container` (`../../../components/common/`), `BlogContent` (`../../../components/blog/`), `adminDb` (`../../../lib/firebase/admin`), `getPublishedBlogPosts` (`../../../lib/firebase/collections`), `getLocaleFromUrl` (`../../../lib/i18n/config`), `t` (`../../../lib/i18n/translations`), `localizeHref` (`../../../data/navigation`), utilities (`../../../lib/utils/`)
  - [x] 7.2 Locale auto-detected from URL via `getLocaleFromUrl(Astro.url)` — no hardcoded locale

- [x] Task 8: Unit tests — TipTap renderer (AC: #1, #3)
  - [x] 8.1 Create `src/lib/utils/__tests__/tiptap-renderer.test.ts`
  - [x] 8.2 Test: paragraph with text → `<p>text</p>`
  - [x] 8.3 Test: heading level 2 → `<h2>text</h2>`
  - [x] 8.4 Test: bold + italic marks → `<strong><em>text</em></strong>`
  - [x] 8.5 Test: link mark → `<a href="..." target="_blank" rel="noopener noreferrer">text</a>`
  - [x] 8.6 Test: code block → `<pre class="blog-code-block"><code>code</code></pre>`
  - [x] 8.7 Test: bullet list → `<ul><li><p>item</p></li></ul>`
  - [x] 8.8 Test: ordered list → `<ol><li><p>item</p></li></ol>`
  - [x] 8.9 Test: image node → `<img src="..." alt="..." loading="lazy" />`
  - [x] 8.10 Test: blockquote → `<blockquote><p>text</p></blockquote>`
  - [x] 8.11 Test: horizontal rule → `<hr />`
  - [x] 8.12 Test: hard break → `<br />`
  - [x] 8.13 Test: inline code mark → `<code>text</code>`
  - [x] 8.14 Test: strikethrough mark → `<s>text</s>`
  - [x] 8.15 Test: complex document with mixed nodes renders correctly
  - [x] 8.16 Test: empty/invalid JSON → empty string
  - [x] 8.17 Test: nested list items render correctly

- [x] Task 9: Unit tests — HTML sanitization (AC: #1)
  - [x] 9.1 Create `src/lib/utils/__tests__/sanitize-blog-html.test.ts`
  - [x] 9.2 Test: allowed tags pass through (p, h2, a, img, pre, code, ul, ol, li, strong, em, blockquote, hr, br, s)
  - [x] 9.3 Test: `<script>` tags stripped
  - [x] 9.4 Test: `<iframe>` tags stripped
  - [x] 9.5 Test: `onerror`, `onclick` event handlers stripped from attributes
  - [x] 9.6 Test: `a[href]` with `javascript:` protocol stripped
  - [x] 9.7 Test: `img[src,alt,loading]` allowed, `img[onerror]` stripped
  - [x] 9.8 Test: full pipeline `sanitizeBlogHtml(renderTipTapToHtml(json))` produces safe output

- [x] Task 10: E2E tests — blog article page (AC: #1, #2, #3, #4, #5, #7)
  - [x] 10.1 Create `tests/e2e/blog-article.spec.ts` — follow pattern of `tests/e2e/project-detail.spec.ts`
  - [x] 10.2 Test EN: navigate from `/blog` listing, click first card, verify article page loads at `/blog/[slug]`
  - [x] 10.3 Test EN: page has `<h1>` with article title, `<time>` with date, reading time text
  - [x] 10.4 Test EN: if cover image exists, `<img>` visible with `fetchpriority="high"`
  - [x] 10.5 Test EN: content area `.blog-content` is visible with rendered HTML
  - [x] 10.6 Test EN: back link navigates to `/blog`
  - [x] 10.7 Test EN: page title includes article title and "ChrisBP"
  - [x] 10.8 Test EN: OG meta tags present — `og:title`, `og:description`, `og:type` with value "article"
  - [x] 10.9 Test EN: Twitter Card meta `twitter:card` present
  - [x] 10.10 Test ES: page loads at `/es/blog/[slug]` with Spanish content
  - [x] 10.11 Test ES: back link navigates to `/es/blog`

## Dev Notes

### TipTap JSON → HTML Renderer — Design

The editor uses **StarterKit + Image + Link** (`RichTextEditor.svelte:59-62`). This defines the exact node/mark types to support:

**Node types** (from StarterKit + extensions):
| TipTap node | HTML output |
|---|---|
| `doc` | (wrapper, no HTML tag) |
| `paragraph` | `<p>` |
| `heading` | `<h1>`, `<h2>`, `<h3>` (via `attrs.level`) |
| `bulletList` | `<ul>` |
| `orderedList` | `<ol>` |
| `listItem` | `<li>` |
| `codeBlock` | `<pre class="blog-code-block"><code>` |
| `blockquote` | `<blockquote>` |
| `horizontalRule` | `<hr />` |
| `hardBreak` | `<br />` |
| `image` | `<img src="..." alt="..." loading="lazy" />` |

**Mark types:**
| TipTap mark | HTML output |
|---|---|
| `bold` | `<strong>` |
| `italic` | `<em>` |
| `strike` | `<s>` |
| `code` | `<code>` |
| `link` | `<a href="..." target="_blank" rel="noopener noreferrer">` |

**Renderer implementation pattern:**
```typescript
// src/lib/utils/tiptap-renderer.ts
function renderNode(node: TipTapNode): string {
  // switch on node.type → emit opening tag + recurse children + closing tag
}
function renderMarks(text: string, marks: TipTapMark[]): string {
  // wrap text in mark tags from outer → inner
}
export function renderTipTapToHtml(json: string): string {
  // JSON.parse → renderNode(doc) → HTML string
  // try-catch → empty string on failure
}
```

Do NOT import TipTap library for rendering — write a lightweight custom renderer. TipTap's editor dependencies are heavy and unnecessary at build time.

### HTML Sanitization — Security Critical

`sanitize-html` v2.17.1 is already in `package.json`. This is the **FIRST** time it's used in the project.

```typescript
// src/lib/utils/sanitize-blog-html.ts
import sanitizeHtml from 'sanitize-html';

export function sanitizeBlogHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: ['h1','h2','h3','p','ul','ol','li','blockquote','pre','code','a','img','strong','em','s','br','hr'],
    allowedAttributes: {
      a: ['href', 'target', 'rel'],
      img: ['src', 'alt', 'loading'],
      pre: ['class'],
      code: ['class'],
    },
    allowedSchemes: ['http', 'https', 'mailto'],
  });
}
```

**Pipeline:** `sanitizeBlogHtml(renderTipTapToHtml(post.content[locale]))` — render first, sanitize second. This prevents XSS from any malicious content stored in Firestore.

### OpenGraph — BaseLayout Extension

Current BaseLayout (`src/layouts/BaseLayout.astro:15-19`) has Props:
```typescript
interface Props {
  title: string;
  description?: string;
  currentPage?: 'home' | 'projects' | 'experience' | 'blog' | 'contact';
}
```

Extend to:
```typescript
interface Props {
  title: string;
  description?: string;
  currentPage?: 'home' | 'projects' | 'experience' | 'blog' | 'contact';
  ogImage?: string;
  ogType?: string;       // default: 'website'
  ogDescription?: string; // falls back to description
}
```

`og:image` must be an absolute URL (`https://...`). Firebase Storage URLs from `post.coverImage.url` are already absolute — do NOT modify or prefix them.

Add in `<head>` after line 46 (after hreflang links):
```html
<meta property="og:title" content={title} />
<meta property="og:description" content={ogDescription ?? description} />
<meta property="og:url" content={locale === 'en' ? enHref : esHref} />
<meta property="og:locale" content={locale === 'en' ? 'en_US' : 'es_ES'} />
<meta property="og:site_name" content="ChrisBP" />
<meta property="og:type" content={ogType ?? 'website'} />
{ogImage && <meta property="og:image" content={ogImage} />}
<meta name="twitter:card" content={ogImage ? 'summary_large_image' : 'summary'} />
<meta name="twitter:title" content={title} />
<meta name="twitter:description" content={ogDescription ?? description} />
{ogImage && <meta name="twitter:image" content={ogImage} />}
```

### OG Description — Content Extraction

For `og:description`, extract first ~160 characters of plain text from the blog post content. Reuse `extractTextFromTipTap()` from `src/lib/utils/reading-time.ts`:

```typescript
const ogDesc = extractTextFromTipTap(post.content[locale]).slice(0, 160);
```

If content is empty/short, the description will just be shorter — no special handling needed.

### Blog Article Page — Layout Structure

```
┌──────────────────────────────────────────────────┐
│ BaseLayout (with OG meta tags)                    │
│ ┌──────────────────────────────────────────────┐ │
│ │ Section > Container                           │ │
│ │                                               │ │
│ │ ← Back to Blog (link)                         │ │
│ │                                               │ │
│ │ <h1> Article Title </h1>                      │ │
│ │ Published on March 24, 2026 · 5 min read       │ │
│ │                                               │ │
│ │ ┌────────────────────────────────┐            │ │
│ │ │ Cover Image (if exists)        │            │ │
│ │ │ aspect-video, fetchpriority    │            │ │
│ │ └────────────────────────────────┘            │ │
│ │                                               │ │
│ │ ┌──── BlogContent (max-w 720px) ────┐        │ │
│ │ │ <h2>, <p>, <ul>, <pre><code>,     │        │ │
│ │ │ <img>, <a>, <blockquote> ...      │        │ │
│ │ │ (sanitized HTML via set:html)     │        │ │
│ │ └───────────────────────────────────┘        │ │
│ └──────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────┘
```

Follow project detail page pattern (`src/pages/projects/[slug].astro`):
- `getStaticPaths()` fetches all published posts
- `Astro.props` destructures the post
- Locale from `getLocaleFromUrl(Astro.url)`
- Back link with `localizeHref('/blog', locale)`

### Content Storage — TipTap JSON (NOT HTML)

Blog `content` is stored as TipTap JSON string in Firestore. Example:
```json
{
  "type": "doc",
  "content": [
    { "type": "paragraph", "content": [{ "type": "text", "text": "Hello" }] },
    { "type": "heading", "attrs": { "level": 2 }, "content": [{ "type": "text", "text": "Section" }] },
    { "type": "codeBlock", "content": [{ "type": "text", "text": "const x = 1;" }] },
    { "type": "image", "attrs": { "src": "https://...", "alt": "desc" } }
  ]
}
```

The rendering pipeline at build time: `JSON string → renderTipTapToHtml() → sanitizeBlogHtml() → set:html`

### Code Blocks — JetBrains Mono Styling (AC #3)

JetBrains Mono is already configured in the project as the code font (Astro Fonts API, per project-context.md). The `BlogContent.astro` scoped styles target `pre code` with `font-family: 'JetBrains Mono', monospace`. Code blocks also get:
- Dark surface background with border
- Rounded corners (0.75rem)
- Horizontal scroll for long lines
- 0.875rem font size for readability

### Existing Infrastructure — Reuse, Don't Recreate

- **`getPublishedBlogPosts()`** — `src/lib/firebase/collections.ts:83-90` — reuse for `getStaticPaths()`
- **`calculateReadingTime()`** — `src/lib/utils/reading-time.ts:23-27` — reuse in article page
- **`extractTextFromTipTap()`** — `src/lib/utils/reading-time.ts:12-21` — reuse for OG description
- **`formatBlogDate()`** — `src/lib/utils/format-date.ts:3-10` — reuse for article date
- **`localizeHref()`** — `src/data/navigation.ts:14-17` — reuse for back link and hreflang
- **`getLocaleFromUrl()`** — `src/lib/i18n/config.ts:9-13` — reuse for locale detection
- **`Section`, `Container`** — `src/components/common/` — reuse for layout
- **`BaseLayout`** — `src/layouts/BaseLayout.astro` — extend with OG props (Task 3)
- **Blog translations** — `blog.readingTime` already exists from story 4-4

### E2E Testing Notes

Tests run against `pnpm preview` (built static pages). If no published posts exist at build time, no article pages exist. Tests should navigate from blog listing to first article, similar to `project-detail.spec.ts` pattern.

Skip tests conditionally if no blog cards found on listing page.

For OG meta tags, use `page.locator('meta[property="og:title"]')` etc. These are `<meta>` tags in `<head>`, accessible via Playwright attribute selectors.

### Previous Story Learnings (4-1 → 4-4)

- **TipTap content is JSON string** (NOT HTML) — use `JSON.parse()` to process
- **Slug from EN** (`defaultLocale = 'en'`) — URLs: `/blog/[slug]` (EN), `/es/blog/[slug]` (ES)
- **`parseBlogPost()` already exists** in `collections.ts:64-71` with `toDate()` conversion
- **`coverImage` is optional** — handle missing gracefully (omit image section entirely)
- **Public reads use Admin SDK** (`adminDb`) at build time, not client SDK
- **Blog listing grid pattern** — `src/pages/blog/index.astro` for page structure reference
- **E2E conditional tests** — `test.skip(count === 0, '...')` pattern for conditional sections

### Git Intelligence — Recent Commits

Story 4-4 (most recent) established:
- Blog listing page pattern at `src/pages/blog/index.astro`
- `BlogCard.astro` component pattern
- `getPublishedBlogPosts()` collection helper
- Reading time and blog date utilities
- Blog i18n translation keys (`blog.*`)
- E2E test pattern at `tests/e2e/blog-page.spec.ts`
- Firestore composite index for status+createdAt query

### Accessibility Requirements

- `<article>` semantic tag wrapping entire blog post content
- `<h1>` for article title — single h1 per page
- `<time datetime="...">` for date (machine-readable)
- `alt` text on cover image (use `post.title[locale]`)
- `fetchpriority="high"` on cover image (above the fold)
- `loading="lazy"` on embedded content images (below the fold, rendered by TipTap renderer)
- Links in content open `target="_blank"` with `rel="noopener noreferrer"`
- Back link clearly labeled for navigation
- Content area `max-width: 720px` ensures optimal line length (~65-80 chars per line)
- Heading hierarchy: page `<h1>` (title) → content headings (`<h2>`, `<h3>`)

### Project Structure Notes

```
src/
├── pages/
│   ├── blog/
│   │   ├── index.astro              # EXISTS — Blog listing EN
│   │   └── [slug].astro             # NEW — Blog article EN
│   └── es/
│       └── blog/
│           ├── index.astro          # EXISTS — Blog listing ES
│           └── [slug].astro         # NEW — Blog article ES
├── components/
│   └── blog/
│       ├── BlogCard.astro           # EXISTS — Blog card
│       └── BlogContent.astro        # NEW — Sanitized content renderer
├── layouts/
│   └── BaseLayout.astro             # MODIFY — add OG/Twitter meta props
├── lib/
│   ├── utils/
│   │   ├── tiptap-renderer.ts       # NEW — TipTap JSON → HTML
│   │   ├── sanitize-blog-html.ts    # NEW — HTML sanitization wrapper
│   │   ├── reading-time.ts          # EXISTS — reuse extractTextFromTipTap
│   │   ├── format-date.ts           # EXISTS — reuse formatBlogDate
│   │   └── __tests__/
│   │       ├── tiptap-renderer.test.ts     # NEW
│   │       └── sanitize-blog-html.test.ts  # NEW
│   └── i18n/
│       └── translations.ts         # MODIFY — add blog.article.* keys

tests/e2e/
└── blog-article.spec.ts            # NEW — Blog article E2E tests
```

### References

**Planning artifacts:**
- [epics.md#Epic 4, Story 4.5] — Acceptance criteria, FR7, FR43, UX-DR30
- [architecture.md#Frontend Architecture] — Routing for `blog/[slug]`, `BlogContent.astro` component
- [architecture.md#Data Architecture] — BlogPosts schema, TipTap HTML sanitization gap note
- [ux-design-specification.md#UX-DR30] — Blog post page: Poppins, 720px, format rendering, OG
- [prd.md#FR7] — Visitors can read individual blog article with rich formatting
- [prd.md#FR43] — Each blog article generates OG with title, description, image
- [prd.md#FR46 partial] — Clean URL via slug `/blog/[slug]`

**Implementation context:**
- [4-4-blog-public-listing-page.md] — Blog listing page complete, utilities created, patterns established
- [project-context.md] — SSG build time pattern, Admin SDK for public pages, sanitize-html rule, JetBrains Mono

**Codebase (modify):**
- [src/layouts/BaseLayout.astro] — Add OG/Twitter Card meta tag props
- [src/lib/i18n/translations.ts] — Add `blog.article.*` translation keys

**Codebase (new):**
- [src/pages/blog/[slug].astro] — Blog article page EN
- [src/pages/es/blog/[slug].astro] — Blog article page ES
- [src/components/blog/BlogContent.astro] — Sanitized content renderer
- [src/lib/utils/tiptap-renderer.ts] — TipTap JSON → HTML renderer
- [src/lib/utils/sanitize-blog-html.ts] — HTML sanitization wrapper
- [src/lib/utils/__tests__/tiptap-renderer.test.ts] — Renderer unit tests
- [src/lib/utils/__tests__/sanitize-blog-html.test.ts] — Sanitization unit tests
- [tests/e2e/blog-article.spec.ts] — Blog article E2E tests

**Codebase (reference — patterns to follow):**
- [src/pages/projects/[slug].astro] — Dynamic page with `getStaticPaths()`, BaseLayout, Section/Container
- [src/pages/es/projects/[slug].astro] — ES locale dynamic page (identical logic, different import paths)
- [src/pages/blog/index.astro] — Blog listing page structure, imports
- [src/components/blog/BlogCard.astro] — Blog card component pattern
- [src/lib/utils/reading-time.ts] — `extractTextFromTipTap()` recursive walker pattern
- [src/lib/utils/tiptap-helpers.ts:20-30] — `findImageNodes()` recursive node traversal pattern
- [src/lib/firebase/collections.ts:83-90] — `getPublishedBlogPosts()` Firestore query
- [src/components/admin/RichTextEditor.svelte:59-62] — TipTap extensions: StarterKit(h1-3), Image, Link
- [tests/e2e/project-detail.spec.ts] — E2E test pattern for detail pages with conditional sections
- [tests/e2e/blog-page.spec.ts] — E2E test pattern for blog listing

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (1M context)

### Debug Log References

- Pre-existing E2E test failures in `project-detail.spec.ts` fixed: `h1` locator resolved to multiple elements due to strict mode violation. Fixed by scoping to `main h1`.

### Completion Notes List

- Task 1: Created lightweight TipTap JSON → HTML renderer (`tiptap-renderer.ts`) supporting all node types (doc, paragraph, heading, bulletList, orderedList, listItem, codeBlock, blockquote, horizontalRule, hardBreak, image) and mark types (bold, italic, strike, code, link). HTML entity escaping included for XSS prevention at render level.
- Task 2: Created HTML sanitization wrapper (`sanitize-blog-html.ts`) using `sanitize-html` with strict allowlist. Installed `@types/sanitize-html` for TypeScript strict mode. Pipeline: render → sanitize → set:html.
- Task 3: Extended BaseLayout with `ogImage`, `ogType`, `ogDescription` optional props. Added OG meta tags (title, description, url, locale, site_name, type, image) and Twitter Card meta tags. Existing pages unaffected (props optional with defaults).
- Task 4: Added `blog.article.backToBlog` and `blog.article.publishedOn` translation keys in both EN and ES.
- Task 5: Created `BlogContent.astro` with scoped styles using `:global()` for all content elements. max-width 720px, JetBrains Mono for code blocks, all styling per spec.
- Task 6: Created EN blog article page (`src/pages/blog/[slug].astro`) with getStaticPaths, OG meta, article semantic tag, cover image (optional), reading time, date formatting.
- Task 7: Created ES blog article page (`src/pages/es/blog/[slug].astro`) with `../../../` import paths. Locale auto-detected from URL.
- Task 8: 18 unit tests for TipTap renderer covering all node types, mark types, nested lists, complex documents, HTML entity escaping, and graceful fallback.
- Task 9: 8 unit tests for HTML sanitization covering allowed tags passthrough, script/iframe stripping, event handler removal, javascript: protocol blocking, and full pipeline safety.
- Task 10: 10 E2E tests (8 EN + 2 ES) for blog article page. All tests skip gracefully when no published articles exist at build time.
- Bonus: Fixed pre-existing `project-detail.spec.ts` strict mode violation (h1 locator → main h1).

### File List

**New files:**
- src/lib/utils/tiptap-renderer.ts
- src/lib/utils/sanitize-blog-html.ts
- src/components/blog/BlogContent.astro
- src/pages/blog/[slug].astro
- src/pages/es/blog/[slug].astro
- src/lib/utils/__tests__/tiptap-renderer.test.ts
- src/lib/utils/__tests__/sanitize-blog-html.test.ts
- tests/e2e/blog-article.spec.ts

**Modified files:**
- src/layouts/BaseLayout.astro (OG/Twitter meta props)
- src/lib/i18n/translations.ts (blog.article.* keys)
- tests/e2e/project-detail.spec.ts (fix h1 locator strict mode)
- package.json (added @types/sanitize-html devDep)
- pnpm-lock.yaml (lockfile update)
