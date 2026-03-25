# Story 5.2: Sitemap, robots.txt y Structured Data

Status: ready-for-dev

## Story

As a search engine crawler,
I want properly structured sitemap, robots.txt and JSON-LD data,
So that the portfolio is correctly indexed and shows rich results.

## Acceptance Criteria

1. **Given** `@astrojs/sitemap` is configured **When** site builds **Then** `sitemap-index.xml` and `sitemap-0.xml` are generated with all public pages (Home, Projects listing, each project detail, Blog listing, each blog post, Contact) in both locales (EN sin prefijo, ES con `/es/`)
2. **And** `robots.txt` allows indexation of all public pages, blocks `/admin/*`, and includes `Sitemap:` directive pointing to `https://portfolio-chrisbp.web.app/sitemap-index.xml`
3. **And** JSON-LD structured data on Home: `Person` schema (name, role, URL, social links)
4. **And** JSON-LD on project detail: `CreativeWork` with name, description, technologies, image
5. **And** JSON-LD on blog posts: `BlogPosting` with title, datePublished, dateModified, author, description
6. **And** all structured data validates against Google's Rich Results Test schema expectations (valid JSON-LD, correct `@type`, required properties present)

## Tasks / Subtasks

- [ ] Task 1: Install and configure `@astrojs/sitemap` (AC: 1)
  - [ ] 1.1 `pnpm add @astrojs/sitemap`
  - [ ] 1.2 Add `sitemap()` integration to `astro.config.mjs` with i18n config
  - [ ] 1.3 Verify `pnpm build` generates `dist/sitemap-index.xml` and `dist/sitemap-0.xml` with all public pages in both locales
- [ ] Task 2: Update `robots.txt` (AC: 2)
  - [ ] 2.1 Add `Sitemap: https://portfolio-chrisbp.web.app/sitemap-index.xml` directive to `public/robots.txt`
- [ ] Task 3: Create JSON-LD utility functions (AC: 3, 4, 5)
  - [ ] 3.1 Add `generatePersonJsonLd()` to `src/lib/utils/seo.ts` — Person schema for Home
  - [ ] 3.2 Add `generateCreativeWorkJsonLd()` — CreativeWork schema for project detail pages
  - [ ] 3.3 Add `generateBlogPostingJsonLd()` — BlogPosting schema for blog articles
- [ ] Task 4: Inject JSON-LD into pages (AC: 3, 4, 5)
  - [ ] 4.1 Add `jsonLd` optional prop to `BaseLayout.astro` — render as `<script type="application/ld+json">`
  - [ ] 4.2 Generate and pass Person JSON-LD in `src/pages/index.astro` and `src/pages/es/index.astro`
  - [ ] 4.3 Generate and pass CreativeWork JSON-LD in `src/pages/projects/[slug].astro` and `src/pages/es/projects/[slug].astro`
  - [ ] 4.4 Generate and pass BlogPosting JSON-LD in `src/pages/blog/[slug].astro` and `src/pages/es/blog/[slug].astro`
- [ ] Task 5: Unit tests for JSON-LD generators (AC: 3, 4, 5, 6)
  - [ ] 5.1 Tests for `generatePersonJsonLd()` — required fields, schema type, social links
  - [ ] 5.2 Tests for `generateCreativeWorkJsonLd()` — project fields, technologies, image URL
  - [ ] 5.3 Tests for `generateBlogPostingJsonLd()` — dates, author, description
- [ ] Task 6: E2E tests for sitemap, robots.txt, and structured data (AC: 1, 2, 3, 4, 5, 6)
  - [ ] 6.1 E2E: Verify `sitemap-index.xml` accessible and links to sitemap files
  - [ ] 6.2 E2E: Verify `sitemap-0.xml` contains both locale URLs for all public pages
  - [ ] 6.3 E2E: Verify `robots.txt` includes Sitemap directive and blocks `/admin`
  - [ ] 6.4 E2E: Verify Home page has valid Person JSON-LD
  - [ ] 6.5 E2E: Verify project detail page has valid CreativeWork JSON-LD
  - [ ] 6.6 E2E: Verify blog article page has valid BlogPosting JSON-LD
- [ ] Task 7: Verify full test suite passes and no regressions (AC: all)
  - [ ] 7.1 `pnpm test` — all Vitest unit tests pass
  - [ ] 7.2 `pnpm test:e2e` — all Playwright E2E tests pass (including new + existing)

## Dev Notes

### Architecture Compliance

- **Output mode**: `output: 'static'` (SSG). Sitemap generated at build time, JSON-LD rendered statically in HTML
- **No client JS added**: JSON-LD is `<script type="application/ld+json">` — not executable JS, does not affect bundle size
- **Pattern from story 5-1**: Extract pure logic to `src/lib/utils/seo.ts`, test with Vitest. Astro components tested via E2E only
- [Source: docs/architecture.md — lines 391, 859, 1135]

### @astrojs/sitemap Configuration

Latest version: **3.7.x** (compatible with Astro 6). Install:

```bash
pnpm add @astrojs/sitemap
```

Configuration in `astro.config.mjs`:

```javascript
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://portfolio-chrisbp.web.app', // already set
  integrations: [svelte(), sitemap({
    i18n: {
      defaultLocale: 'en',
      locales: {
        en: 'en',
        es: 'es',
      },
    },
  })],
});
```

**Output**: Generates `dist/sitemap-index.xml` + `dist/sitemap-0.xml`. The integration automatically discovers all static pages including dynamic routes from `getStaticPaths()`. Admin pages with `<meta name="robots" content="noindex, nofollow" />` are NOT automatically excluded by the integration — use `filter` option to exclude `/admin/*`:

```javascript
sitemap({
  filter: (page) => !page.includes('/admin'),
  i18n: { ... }
})
```

### robots.txt Update

Current `public/robots.txt`:
```
User-agent: *
Allow: /
Disallow: /admin
```

Add Sitemap directive:
```
User-agent: *
Allow: /
Disallow: /admin

Sitemap: https://portfolio-chrisbp.web.app/sitemap-index.xml
```

### JSON-LD Schemas (in `src/lib/utils/seo.ts`)

**CRITICAL**: Generate JSON-LD as plain objects, serialize with `JSON.stringify()`. Do NOT import any JSON-LD library — vanilla objects are sufficient and keep bundle at zero.

#### Person Schema (Home Page)

```typescript
export interface PersonJsonLd {
  '@context': 'https://schema.org';
  '@type': 'Person';
  name: string;
  jobTitle: string;
  url: string;
  sameAs: string[];
  image?: string;
}

export function generatePersonJsonLd(siteUrl: string): PersonJsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Christopher Bobadilla',
    jobTitle: 'Mobile & Web Developer',
    url: siteUrl,
    sameAs: [
      'https://github.com/ChrisBP-Dev',
      'https://www.linkedin.com/in/christopher-bobadilla',
      'https://www.tiktok.com/@chrisbp_dev',
    ],
  };
}
```

#### CreativeWork Schema (Project Detail)

```typescript
export interface CreativeWorkJsonLd {
  '@context': 'https://schema.org';
  '@type': 'CreativeWork';
  name: string;
  description: string;
  image?: string;
  url: string;
  author: { '@type': 'Person'; name: string };
  keywords?: string;
}

export function generateCreativeWorkJsonLd(params: {
  name: string;
  description: string;
  imageUrl?: string;
  pageUrl: string;
  technologies: string[];
}): CreativeWorkJsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: params.name,
    description: params.description,
    ...(params.imageUrl && { image: params.imageUrl }),
    url: params.pageUrl,
    author: { '@type': 'Person', name: 'Christopher Bobadilla' },
    ...(params.technologies.length > 0 && { keywords: params.technologies.join(', ') }),
  };
}
```

#### BlogPosting Schema (Blog Article)

```typescript
export interface BlogPostingJsonLd {
  '@context': 'https://schema.org';
  '@type': 'BlogPosting';
  headline: string;
  description: string;
  datePublished: string;
  dateModified: string;
  author: { '@type': 'Person'; name: string; url: string };
  image?: string;
  url: string;
}

export function generateBlogPostingJsonLd(params: {
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  coverImageUrl?: string;
  pageUrl: string;
  siteUrl: string;
}): BlogPostingJsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: params.title,
    description: params.description,
    datePublished: params.createdAt.toISOString(),
    dateModified: params.updatedAt.toISOString(),
    author: {
      '@type': 'Person',
      name: 'Christopher Bobadilla',
      url: params.siteUrl,
    },
    ...(params.coverImageUrl && { image: params.coverImageUrl }),
    url: params.pageUrl,
  };
}
```

### BaseLayout Integration

Add optional `jsonLd` prop to BaseLayout. Render in `<head>`:

```astro
interface Props {
  // ... existing props
  jsonLd?: Record<string, unknown>;
}

// In <head>, after existing meta tags:
{jsonLd && (
  <script type="application/ld+json" set:html={JSON.stringify(jsonLd)} />
)}
```

### Page Integration Examples

**CRITICAL — Import paths differ by nesting depth:**

| Page file | Import path for `seo.ts` |
|-----------|--------------------------|
| `src/pages/index.astro` | `'../lib/utils/seo'` |
| `src/pages/es/index.astro` | `'../../lib/utils/seo'` |
| `src/pages/projects/[slug].astro` | `'../../lib/utils/seo'` |
| `src/pages/es/projects/[slug].astro` | `'../../../lib/utils/seo'` |
| `src/pages/blog/[slug].astro` | `'../../lib/utils/seo'` |
| `src/pages/es/blog/[slug].astro` | `'../../../lib/utils/seo'` |

**Note:** `Astro.site!.href` returns `'https://portfolio-chrisbp.web.app/'` (with trailing slash). This is correct and expected for schema.org URLs.

**Home page** (`src/pages/index.astro`):
```astro
import { generatePersonJsonLd } from '../lib/utils/seo';

const personJsonLd = generatePersonJsonLd(Astro.site!.href);

<BaseLayout
  title={t('home.meta.title', locale)}
  currentPage="home"
  jsonLd={personJsonLd}
/>
```
ES variant (`src/pages/es/index.astro`) — identical logic, import from `'../../lib/utils/seo'`.

**Project detail** (`src/pages/projects/[slug].astro`):
```astro
import { generateCreativeWorkJsonLd } from '../../lib/utils/seo';

// IMPORTANT: resolvedTechs already exists on this page (line 39) — reuse it for tech NAMES
// DO NOT use project.technologies directly — those are Firestore IDs, not display names
const creativeWorkJsonLd = generateCreativeWorkJsonLd({
  name: project.companyName[locale],
  description: project.shortDescription[locale],
  imageUrl: project.mainImage.url,
  pageUrl: new URL(Astro.url.pathname, Astro.site).href,
  technologies: resolvedTechs.map(t => t.name),
});

<BaseLayout jsonLd={creativeWorkJsonLd} ... />
```
ES variant (`src/pages/es/projects/[slug].astro`) — identical logic, import from `'../../../lib/utils/seo'`.

**Blog article** (`src/pages/blog/[slug].astro`):
```astro
import { generateBlogPostingJsonLd } from '../../lib/utils/seo';

// IMPORTANT: variable is ogDesc (not ogDescription) — already computed on line 34
const blogPostingJsonLd = generateBlogPostingJsonLd({
  title: post.title[locale],
  description: ogDesc,
  createdAt: post.createdAt,
  updatedAt: post.updatedAt,
  coverImageUrl: post.coverImage?.url,
  pageUrl: new URL(Astro.url.pathname, Astro.site).href,
  siteUrl: Astro.site!.href,
});

<BaseLayout jsonLd={blogPostingJsonLd} ... />
```
ES variant (`src/pages/es/blog/[slug].astro`) — identical logic, import from `'../../../lib/utils/seo'`.

### Files To Create/Modify

| Action | File | Import for `seo.ts` | Description |
|--------|------|---------------------|-------------|
| MODIFY | `astro.config.mjs` | N/A | Add `@astrojs/sitemap` integration with i18n + admin filter |
| MODIFY | `public/robots.txt` | N/A | Add `Sitemap:` directive |
| MODIFY | `src/lib/utils/seo.ts` | N/A (source file) | Add JSON-LD generator functions + types |
| MODIFY | `src/layouts/BaseLayout.astro` | N/A | Add `jsonLd` optional prop + `<script>` render |
| MODIFY | `src/pages/index.astro` | `'../lib/utils/seo'` | Pass Person JSON-LD |
| MODIFY | `src/pages/es/index.astro` | `'../../lib/utils/seo'` | Pass Person JSON-LD |
| MODIFY | `src/pages/projects/[slug].astro` | `'../../lib/utils/seo'` | Pass CreativeWork JSON-LD (use `resolvedTechs.map(t => t.name)`) |
| MODIFY | `src/pages/es/projects/[slug].astro` | `'../../../lib/utils/seo'` | Pass CreativeWork JSON-LD (use `resolvedTechs.map(t => t.name)`) |
| MODIFY | `src/pages/blog/[slug].astro` | `'../../lib/utils/seo'` | Pass BlogPosting JSON-LD (use `ogDesc` variable) |
| MODIFY | `src/pages/es/blog/[slug].astro` | `'../../../lib/utils/seo'` | Pass BlogPosting JSON-LD (use `ogDesc` variable) |
| MODIFY | `src/lib/utils/__tests__/seo.test.ts` | `'../seo'` | Add JSON-LD unit tests |
| CREATE | `tests/e2e/seo-validation.spec.ts` | N/A | E2E for sitemap, robots.txt, JSON-LD |

### Testing Strategy

**Unit tests** (`src/lib/utils/__tests__/seo.test.ts` — extend existing):

- `generatePersonJsonLd`: returns correct `@context`, `@type: 'Person'`, name, jobTitle, sameAs array with 3 social URLs, url matches site
- `generateCreativeWorkJsonLd`: returns correct `@type: 'CreativeWork'`, name/description from params, keywords from technologies, author.name = 'Christopher Bobadilla', image optional (undefined when not provided)
- `generateBlogPostingJsonLd`: returns correct `@type: 'BlogPosting'`, headline, ISO date strings, author with url, image optional, description present

**E2E tests** (`tests/e2e/seo-validation.spec.ts` — new file):

Run against `pnpm preview` (built static output). **No existing E2E tests fetch non-HTML content** — this will be the first.

**CRITICAL — `page.goto()` for non-HTML returns `Response | null`**. Always null-check before calling `.text()`:

```typescript
// Sitemap — use page.goto() which returns Response | null
const sitemapIndexResponse = await page.goto('/sitemap-index.xml');
expect(sitemapIndexResponse).not.toBeNull();
expect(sitemapIndexResponse!.status()).toBe(200);
const sitemapIndexText = await sitemapIndexResponse!.text();
// Verify contains <sitemap> entries pointing to sitemap-0.xml

const sitemapResponse = await page.goto('/sitemap-0.xml');
expect(sitemapResponse).not.toBeNull();
const sitemapText = await sitemapResponse!.text();
// Verify contains <url> entries for /, /es/, /projects, /es/projects/, /blog, /es/blog/, /contact, /es/contact/
// Verify contains dynamic project slugs and blog slugs
// Verify does NOT contain /admin URLs

// Robots.txt
const robotsResponse = await page.goto('/robots.txt');
expect(robotsResponse).not.toBeNull();
const robotsText = await robotsResponse!.text();
// Verify contains 'Sitemap: https://portfolio-chrisbp.web.app/sitemap-index.xml'
// Verify contains 'Disallow: /admin'

// JSON-LD Home — use page.locator for script tags inside HTML pages
await page.goto('/');
const personLd = await page.locator('script[type="application/ld+json"]').textContent();
expect(personLd).not.toBeNull();
const personData = JSON.parse(personLd!);
// Assert @type === 'Person', name, sameAs.length === 3

// JSON-LD Project Detail — discover first slug dynamically (same pattern as project-detail.spec.ts)
await page.goto('/projects/<first-slug>');
const projectLd = await page.locator('script[type="application/ld+json"]').textContent();
expect(projectLd).not.toBeNull();
const projectData = JSON.parse(projectLd!);
// Assert @type === 'CreativeWork', name, description, author.name

// JSON-LD Blog Article — discover first slug dynamically (same pattern as blog-article.spec.ts)
await page.goto('/blog/<first-slug>');
const blogLd = await page.locator('script[type="application/ld+json"]').textContent();
expect(blogLd).not.toBeNull();
const blogData = JSON.parse(blogLd!);
// Assert @type === 'BlogPosting', headline, datePublished, author.name, author.url
```

### Existing Data Available at Build Time

| Page | Data Source | Available Fields for JSON-LD |
|------|------------|------------------------------|
| Home | Static (hardcoded) | name, jobTitle, siteUrl, social links |
| Project `[slug]` | `getProjects()` via Admin SDK | `companyName[locale]`, `shortDescription[locale]`, `mainImage.url`, `technologies[]` (IDs — resolve via `resolvedTechs` already on page), `slug` |
| Blog `[slug]` | `getBlogPosts()` via Admin SDK | `title[locale]`, `content[locale]`, `coverImage?.url`, `createdAt`, `updatedAt`, `slug` |

### Anti-Patterns to Avoid

- **DO NOT** install any JSON-LD library — vanilla objects + `JSON.stringify()` is sufficient
- **DO NOT** add JSON-LD to listing pages (Projects list, Blog list) — only detail pages need structured data
- **DO NOT** add JSON-LD to admin pages
- **DO NOT** add client-side JavaScript for JSON-LD — it's `<script type="application/ld+json">` which is purely declarative
- **DO NOT** use `project.technologies` directly for JSON-LD keywords — those are Firestore IDs, use `resolvedTechs.map(t => t.name)` for display names
- **DO NOT** hardcode page URLs in JSON-LD — use `Astro.url` and `Astro.site` for absolute URL construction
- **DO NOT** forget to filter admin pages from sitemap
- **DO NOT** import the `@astrojs/sitemap` filter in page files — it's only configured in `astro.config.mjs`

### Project Structure Notes

- All new code goes in existing files (seo.ts, BaseLayout.astro, page files) — no new component files
- Only new file: `tests/e2e/seo-validation.spec.ts` (architecture specifies this filename)
- Tests co-located: unit tests in `__tests__/` next to source, E2E in `tests/e2e/`
- [Source: architecture.md — lines 593-606, 977-988]

### Previous Story Intelligence (5-1)

**Key learnings from story 5-1:**
- Extract pure logic to `seo.ts` utility functions — Astro components cannot be unit-tested
- E2E tests use `page.locator()` with regex patterns for meta tag verification
- Test against `pnpm preview` (built output), not dev server
- `Astro.site` returns `URL` object — use `.href` for string representation
- OG image already handled with `resolveOgImage()` fallback pattern
- AdminLayout has `<meta name="robots" content="noindex, nofollow" />` (already SEO-excluded)
- Blog pages already have `ogType="article"` and pass `ogImage={post.coverImage?.url}`
- All existing meta tag E2E tests pass (1206 unit + 150 E2E total)

**Exact variable names in current code (verified):**
- Blog pages: `ogDesc` (NOT `ogDescription`) — computed on line 34 of `blog/[slug].astro`
- Project pages: `resolvedTechs` — computed on line 39 of `projects/[slug].astro`, contains `Technology[]` with `.name` field
- `project.technologies` is `string[]` of Firestore IDs — never use directly for JSON-LD keywords
- BaseLayout Props: `{ title, description, currentPage, ogImage, ogType, ogDescription }` — add `jsonLd` here
- `Astro.site!` is safe (always defined via `astro.config.mjs` `site` field)
- E2E tests: `page.goto()` for non-HTML returns `Response | null` — always null-check

**Review corrections from 5-1 to avoid repeating:**
- Always check all layout files when modifying shared patterns
- Don't create duplicate test cases — verify each test covers a unique edge case
- Verify external library API docs per specific use (Sharp PNG quality issue)

**Valid defer D-1 (mainImage schema mismatch)**: `projectSchema` requires mainImage, `projectFirestoreSchema` makes it optional. Mitigated by orphan cleanup. Not a blocker for this story since `getStaticPaths()` in project pages already handles the parsed data safely.

### Social Links Reference (for Person JSON-LD)

- GitHub: `https://github.com/ChrisBP-Dev`
- LinkedIn: `https://www.linkedin.com/in/christopher-bobadilla`
- TikTok: `https://www.tiktok.com/@chrisbp_dev`

[Source: src/components/layout/Footer.astro — lines 21, 33, 45]

### References

- [Source: _bmad-output/planning-artifacts/epics.md — Epic 5, Story 5.2 lines 811-825]
- [Source: _bmad-output/planning-artifacts/architecture.md — SEO section lines 82-88, 1059, 1112, 1135]
- [Source: _bmad-output/planning-artifacts/architecture.md — testing standards lines 593-606]
- [Source: _bmad-output/planning-artifacts/architecture.md — file structure lines 824-991]
- [Source: _bmad-output/project-context.md — i18n pattern lines 40-41, 192-194]
- [Source: _bmad-output/project-context.md — SEO rules line 112]
- [Source: _bmad-output/project-context.md — Lighthouse CI line 234]
- [Source: @astrojs/sitemap docs — https://docs.astro.build/en/guides/integrations-guide/sitemap/]

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
