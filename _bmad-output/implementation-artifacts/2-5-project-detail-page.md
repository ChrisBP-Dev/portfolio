# Story 2.5: Project Detail Page

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a visitor (Sarah),
I want to see full details of a project with screenshots, technologies and links,
So that I can deeply evaluate Christopher's work quality.

## Acceptance Criteria

1. **Given** I navigate to `/projects/[slug]` **When** page loads **Then** full project: name as h1, complete description, features list, technology chips, main image, screenshots gallery, external links (website, source code)
2. **And** clicking a screenshot opens ImageViewer — **DEFERRED to Story 2.6**. For now, screenshots display as a gallery grid. Add `data-screenshot-index` attributes and a wrapper `id="screenshot-gallery"` so ImageViewer (Story 2.6) can hook in without modifying this page.
3. **And** `websiteUrl` or `sourceCodeUrl` display with appropriate labels when present, hidden when absent
4. **And** `/en/projects/[slug]` shows English version with all content in English
5. **And** page generated at build time via `getStaticPaths()` from Firestore data
6. **And** a "Back to Projects" link navigates to `/projects` (or `/en/projects` for EN locale)

**(FR3, FR46 partial, UX-DR28)**

## Tasks / Subtasks

- [ ] Task 1: i18n translations for Project Detail page (AC: #4)
  - [ ] 1.1 Add translation keys to `src/lib/i18n/translations.ts`:
    - `projects.detail.features` — "Características" / "Features"
    - `projects.detail.backToProjects` — "← Volver a Proyectos" / "← Back to Projects"
  - [ ] 1.2 Verify existing keys already cover: `projects.technologies`, `projects.website`, `projects.sourceCode`, `projects.screenshots` (reuse from Story 2.4)

- [ ] Task 2: Create `src/pages/projects/[slug].astro` — Project detail page ES (AC: #1, #2, #3, #5, #6)
  - [ ] 2.1 Frontmatter — `getStaticPaths()` + data fetching:
    ```typescript
    ---
    import BaseLayout from '../../layouts/BaseLayout.astro';
    import Section from '../../components/common/Section.astro';
    import Container from '../../components/common/Container.astro';
    import Badge from '../../components/common/Badge.astro';
    import Button from '../../components/common/Button.astro';
    import { adminDb } from '../../lib/firebase/admin';
    import { getAllProjects, getAllTechnologies } from '../../lib/firebase/collections';
    import { getLocaleFromUrl } from '../../lib/i18n/config';
    import { t } from '../../lib/i18n/translations';
    import { localizeHref } from '../../data/navigation';
    import type { Technology } from '../../lib/schemas/technology-schema';

    export async function getStaticPaths() {
      const projects = await getAllProjects(adminDb);
      return projects.map((project) => ({
        params: { slug: project.slug },
        props: { project },
      }));
    }

    const { project } = Astro.props;
    const locale = getLocaleFromUrl(Astro.url);
    const allTechnologies = await getAllTechnologies(adminDb);

    const techMap = new Map(allTechnologies.map((t) => [t.id, t]));
    function getTechByIds(techIds: string[]): Technology[] {
      return techIds
        .map((id) => techMap.get(id))
        .filter((t): t is Technology => t !== undefined);
    }

    const resolvedTechs = getTechByIds(project.technologies);
    ---
    ```
  - [ ] 2.2 Page layout structure — use `Container variant="default"` (1200px max):
    - `BaseLayout` with `title={project.companyName[locale] + ' — ChrisBP'}`, `description={project.shortDescription[locale]}`, `currentPage="projects"`
    - Back link at top: `<a>` with `t('projects.detail.backToProjects', locale)`, links to `localizeHref('/projects', locale)`
    - `<h1>` with project name `{project.companyName[locale]}`
    - Main image: `<img src={project.mainImage.url} alt={project.companyName[locale]} class="w-full rounded-xl object-cover max-h-96 aspect-video" />`
    - Description: `<p>{project.shortDescription[locale]}</p>`
    - Features list: `<ul>` iterating `project.features[locale]` as `<li>` items
    - Technologies section: heading + Badge.astro chips with tech icon + name
    - External links section: Button.astro components for websiteUrl / sourceCodeUrl (conditional rendering)
    - Screenshots gallery section: grid of clickable images with `data-screenshot-index` attributes
  - [ ] 2.3 Detailed HTML structure:
    ```astro
    <BaseLayout
      title={project.companyName[locale] + ' — ChrisBP'}
      description={project.shortDescription[locale]}
      currentPage="projects"
    >
      <Section variant="default">
        <Container variant="default">
          <!-- Back link -->
          <a href={localizeHref('/projects', locale)} class="inline-flex items-center text-primary hover:underline text-body-sm mb-6">
            {t('projects.detail.backToProjects', locale)}
          </a>

          <!-- Project name -->
          <h1 class="text-heading-1 font-bold mb-6">{project.companyName[locale]}</h1>

          <!-- Main image -->
          <img
            src={project.mainImage.url}
            alt={project.companyName[locale]}
            class="w-full rounded-xl object-cover max-h-96 aspect-video mb-8"
          />

          <!-- Description -->
          <p class="text-body text-text-secondary mb-8">
            {project.shortDescription[locale]}
          </p>

          <!-- Features list -->
          {project.features[locale].length > 0 && (
            <div class="mb-8">
              <h2 class="text-heading-2 font-semibold mb-4">
                {t('projects.detail.features', locale)}
              </h2>
              <ul class="list-disc list-inside space-y-2 text-body text-text-secondary">
                {project.features[locale].map((feature) => (
                  <li>{feature}</li>
                ))}
              </ul>
            </div>
          )}

          <!-- Technologies -->
          {resolvedTechs.length > 0 && (
            <div class="mb-8">
              <h2 class="text-heading-2 font-semibold mb-4">
                {t('projects.technologies', locale)}
              </h2>
              <div class="flex flex-wrap gap-2">
                {resolvedTechs.map((tech) => (
                  <Badge variant="technology">
                    <img src={tech.image.url} alt={tech.name} loading="lazy" class="w-4 h-4" />
                    {tech.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <!-- External links -->
          {(project.websiteUrl || project.sourceCodeUrl) && (
            <div class="flex flex-wrap gap-4 mb-8">
              {project.websiteUrl && (
                <Button
                  variant="secondary"
                  href={String(project.websiteUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${t('projects.website', locale)} (${locale === 'es' ? 'abre en nueva pestaña' : 'opens in new tab'})`}
                >
                  {t('projects.website', locale)} ↗
                </Button>
              )}
              {project.sourceCodeUrl && (
                <Button
                  variant="secondary"
                  href={String(project.sourceCodeUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${t('projects.sourceCode', locale)} (${locale === 'es' ? 'abre en nueva pestaña' : 'opens in new tab'})`}
                >
                  {t('projects.sourceCode', locale)} ↗
                </Button>
              )}
            </div>
          )}

          <!-- Screenshots gallery -->
          {project.screenshots.length > 0 && (
            <div class="mb-8">
              <h2 class="text-heading-2 font-semibold mb-4">
                {t('projects.screenshots', locale)}
              </h2>
              <div id="screenshot-gallery" class="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {project.screenshots.map((ss, index) => (
                  <button
                    type="button"
                    data-screenshot-index={index}
                    aria-label={`${project.companyName[locale]} screenshot ${index + 1}`}
                    class="cursor-pointer rounded-lg overflow-hidden border border-border hover:border-primary transition-colors duration-200 focus:outline-2 focus:outline-primary focus:outline-offset-2"
                  >
                    <img
                      src={ss.url}
                      alt={`${project.companyName[locale]} screenshot ${index + 1}`}
                      loading="lazy"
                      decoding="async"
                      class="w-full h-auto object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </Container>
      </Section>
    </BaseLayout>
    ```

- [ ] Task 3: Create `src/pages/en/projects/[slug].astro` — Project detail page EN (AC: #4, #5)
  - [ ] 3.1 Create directory `src/pages/en/projects/` (already exists) and add `[slug].astro`
  - [ ] 3.2 Same structure as ES version but import paths use `../../../` (three levels up)
  - [ ] 3.3 Back link uses `localizeHref('/projects', locale)` — returns `/en/projects` automatically for EN locale. Import `localizeHref` from `../../../data/navigation`
  - [ ] 3.4 Verify `getLocaleFromUrl(Astro.url)` correctly returns `'en'` for this path

- [ ] Task 4: Verify pipeline (AC: all)
  - [ ] 4.1 Run `pnpm lint && pnpm type-check && pnpm test && pnpm build`
  - [ ] 4.2 Verify build generates HTML files for each project slug in both locales
  - [ ] 4.3 Verify existing tests pass (no regressions)

- [ ] Task 5: E2E tests (AC: #1, #3, #4, #6)
  - [ ] 5.1 Create `tests/e2e/project-detail.spec.ts`:
    ```typescript
    test.describe('Project Detail Page — ES', () => {
      test('page loads with project name, description, and main image', ...);
      test('displays features list when project has features', ...);
      test('displays technology chips with icons', ...);
      test('displays external links with target=_blank when present', ...);
      test('displays screenshot gallery with data attributes', ...);
      test('back link navigates to projects listing', ...);
      test('page title includes project name and ChrisBP', ...);
    });

    test.describe('Project Detail Page — EN', () => {
      test('page loads with English content at /en/projects/[slug]', ...);
      test('back link navigates to /en/projects', ...);
    });
    ```
  - [ ] 5.2 Slug discovery strategy: navigate to `/projects`, locate the first project card link via `page.locator('main a[href*="/projects/"]').first()`, extract its `href`, then `page.goto(href)` to the detail page. This avoids hardcoding slugs that may change. Same pattern for EN: navigate `/en/projects`, find first card link
  - [ ] 5.3 Verify h1 exists with project name, main image exists (no `loading="lazy"` on main image), description text exists
  - [ ] 5.4 Verify technologies section renders with Badge-style chips
  - [ ] 5.5 Verify back link navigates correctly (check final URL matches `/projects` for ES, `/en/projects` for EN)
  - [ ] 5.6 Verify external links have `target="_blank"` and `rel="noopener noreferrer"` attributes
  - [ ] 5.7 Verify page title: `await expect(page).toHaveTitle(/.*— ChrisBP/)`
  - [ ] 5.8 Verify screenshot gallery wrapper has `id="screenshot-gallery"` and buttons have `data-screenshot-index` attributes

## Dev Notes

### CRITICAL: This is a NEW feature — No Visual Reference from Flutter

UX-DR28: "Página detalle proyecto /projects/[slug] — screenshots con ImageViewer, descripción completa, tecnologías con chips, links externos. **Feature nueva (no existía en Flutter).**"

There are NO screenshots in `_bmad-output/planning-artifacts/visual-reference/` for this page. Design it to be visually consistent with the existing site: same color tokens, spacing, typography, and component patterns. Use `Container variant="default"` (1200px) for the main layout.

### FIRST `getStaticPaths()` in the Project

This is the first dynamic route in the codebase. Pattern:

```typescript
export async function getStaticPaths() {
  const projects = await getAllProjects(adminDb);
  return projects.map((project) => ({
    params: { slug: project.slug },
    props: { project },
  }));
}
```

Astro calls `getStaticPaths()` at build time and generates one HTML page per slug. The `project` object is passed via `Astro.props`. This is the standard Astro SSG pattern.

### ImageViewer Dependency — DEFER, Don't Block

Story 2.6 (ImageViewer) is listed as a dependency but is NOT implemented yet. **Do not block this story.** Instead:
- Render screenshots in a grid of `<button>` elements (not `<a>`)
- Add `data-screenshot-index={index}` attributes to each button
- Add `aria-label` to each button with descriptive text (e.g., `"ProjectName screenshot 1"`) for accessibility
- Wrap the grid in a `<div id="screenshot-gallery">`
- Story 2.6 will add the Svelte ImageViewer island that hooks into these elements
- The buttons will be non-functional clicks until Story 2.6 — this is acceptable

### URL Objects from Zod 4

`z.url()` in Zod 4 returns native `URL` objects, not strings. This affects:
- `project.websiteUrl` — type is `URL | undefined`
- `project.sourceCodeUrl` — type is `URL | undefined`
- `project.mainImage.url` — type is `URL`
- `project.screenshots[n].url` — type is `URL`

In Astro templates, `{url}` calls `.toString()` automatically for `src` and `href` attributes. However, for Button.astro `href` prop (type `string`), wrap with `String(project.websiteUrl)` to satisfy TypeScript.

For `<img src={...}>` attributes, URL objects work directly in Astro templates.

### Astro Components Available in This Page (unlike Svelte)

Since this is an Astro page (not a Svelte island), you CAN use:
- `Badge.astro` with `variant="technology"` for technology chips
- `Button.astro` with `variant="secondary"` for external links
- `Section.astro` and `Container.astro` for layout

This is different from Story 2.4 where Badge/Button couldn't be used inside ProjectFilter.svelte.

### Data Access — Functions Already Exist

Both `getAllProjects(db)` and `getAllTechnologies(db)` exist in `src/lib/firebase/collections.ts`:
- `getAllProjects(db)` — orders by `slug`, returns `Project[]`
- `getAllTechnologies(db)` — orders by `name`, returns `Technology[]`

**DO NOT recreate these functions.** Call `getAllTechnologies` separately to resolve technology IDs to objects.

### Data Shape After Zod Parsing

```typescript
// Project (from projectSchema)
{
  id: string,
  companyName: { es: string, en: string },
  shortDescription: { es: string, en: string },
  features: { es: string[], en: string[] },
  mainImage: { url: URL, storagePath: string },
  screenshots: StoredImage[],              // { url: URL, storagePath: string }[]
  websiteUrl?: URL,                        // Optional URL object
  sourceCodeUrl?: URL,                     // Optional URL object
  technologies: string[],                 // Array of Technology IDs (NOT names)
  slug: string,
}

// Technology (from technologySchema)
{
  id: string,
  name: string,                            // NOT localized
  image: { url: URL, storagePath: string },
  experienceYears: number,
}
```

**CRITICAL:** `project.technologies` contains Technology **IDs**, not names. Resolve IDs to Technology objects using the helper function. Same pattern as Story 2.4.

### i18n — Reuse Existing Keys

Most translation keys needed are already defined from Story 2.4:
- `projects.technologies` — "Tecnologías" / "Technologies"
- `projects.website` — "Website" / "Website"
- `projects.sourceCode` — "Código Fuente" / "Source Code"
- `projects.screenshots` — "Screenshots" / "Screenshots"

Only add new keys for:
- `projects.detail.features` — "Características" / "Features"
- `projects.detail.backToProjects` — "← Volver a Proyectos" / "← Back to Projects"

### Back Link Localization

The back link must point to the correct locale prefix. Use `localizeHref('/projects', locale)` from `../../data/navigation` — it returns `/projects` for ES and `/en/projects` for EN automatically. This is the same pattern used in `ProjectsSection.astro` and other pages for consistency.

### Responsive Layout

| Breakpoint | Screenshot Grid | Layout |
|------------|----------------|--------|
| <450px (mobile) | 2 columns | Full-width content, stacked sections |
| ≥450px (tablet/desktop) | 3 columns | Same as mobile but wider screenshots grid |

The main content uses `Container variant="default"` (max 1200px). No sidebar needed.

### Images — External Firebase Storage URLs

- **DO NOT use Astro `<Image />`** — only works with local assets in `src/assets/`
- Use plain `<img>` with `loading="lazy"` for Firebase Storage URLs
- Main image: eager loading (above the fold), no `loading="lazy"`. Add `aspect-video` class to prevent CLS (Cumulative Layout Shift)
- Screenshots: `loading="lazy"` and `decoding="async"` (below the fold)

### Accessibility — External Links (Lighthouse a11y)

Story 2.4 had Lighthouse accessibility score drop to 0.86. To prevent similar issues:
- External links with `target="_blank"` must include `aria-label` indicating they open in a new tab (WCAG G200)
- Add visual indicator `↗` to external link button text
- Screenshot buttons need `aria-label` with descriptive text since they wrap images

### Project Structure Notes

Files to create:
```
src/pages/projects/[slug].astro              # Project detail page (ES)
src/pages/en/projects/[slug].astro           # Project detail page (EN)
tests/e2e/project-detail.spec.ts             # E2E tests
```

Files to modify:
```
src/lib/i18n/translations.ts                 # Add projects.detail.* keys
```

### Existing Helpers

| Helper | Import From | Usage |
|--------|-------------|-------|
| `t(key, locale)` | `../../lib/i18n/translations` | Static UI strings in Astro pages |
| `localizeHref(path, locale)` | `../../data/navigation` | URL locale prefix |
| `getLocaleFromUrl(url)` | `../../lib/i18n/config` | Extract locale from URL |
| `item.field[locale]` | Direct indexing | Firestore localized data |

### Anti-Patterns to Avoid

1. **DO NOT use Astro `<Image />`** for Firebase Storage URLs — only works with local assets
2. **DO NOT import `admin.ts` in Svelte** — Admin SDK is build-time only
3. **DO NOT hardcode text** — use `t(key, locale)` for all UI strings
4. **DO NOT create a Svelte component for the entire page** — this is an Astro page using Astro components. Svelte is only needed for ImageViewer (Story 2.6)
5. **DO NOT block on ImageViewer** — render screenshots as clickable buttons with data attributes for Story 2.6 to hook into
6. **DO NOT use `project.technologies` as display names** — they are IDs, resolve to Technology objects
7. **DO NOT add `loading="lazy"` to the main image** — it's above the fold
8. **DO NOT omit `aria-label` on external links with `target="_blank"`** — required for Lighthouse accessibility (WCAG G200). Story 2.4 suffered a11y regression from missing labels
9. **DO NOT omit `aspect-video` on the main image** — prevents CLS layout shift that penalizes Lighthouse Performance

### Previous Story Intelligence

**De Story 2.4:**
- ProjectFilter.svelte established patterns: technology resolution via `getTechByIds()`, URL object usage (`project.websiteUrl` used directly as href), screenshot thumbnails with `loading="lazy"`, tech chips styling `bg-primary/10 text-primary border border-primary/30 rounded-full`
- Project cards already link to `/projects/[slug]` via `localizeHref()` — those links currently 404, this story fixes them
- Code review patches: use `loading="lazy"` on tech images, guard empty tech arrays, proper labels for accessibility

**De Story 2.3:**
- Card pattern: `bg-surface border border-border rounded-xl overflow-hidden hover:bg-surface-elevated transition-colors duration-200`
- `.gradient-text` class available globally for gradient headings
- `adminDb` SSG data fetching works reliably

**De Epic 1 Retro:**
- Validate Astro v6 APIs against actual behavior
- `pnpm build` is Definition of Done
- Code review mandatory before closing story

**Note:** `_bmad-output/project-context.md` is OUTDATED (describes old Flutter project). Use `architecture.md` and `epics.md` as authoritative sources.

### Git Intelligence

Recent commits:
- `af17c90` fix: code review patches for story 2.4 — i18n, lazy loading, guard, E2E assertions
- `96c6460` feat: seed Experiences collection from Flutter archive data
- `9fa34d7` fix: add vertical padding to project card links for touch target size
- `32e201c` fix: improve accessibility for projects page — label, h1, heading structure
- `9938688` feat: implement story 2.4 — Projects Listing y Filtro por Tecnología

Pattern: semantic prefixes (`feat:`, `fix:`, `docs:`). Use `feat: implement story 2.5 — Project Detail Page`.

### References

- [Source: _bmad-output/planning-artifacts/epics.md — Story 2.5]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md — UX-DR28]
- [Source: _bmad-output/planning-artifacts/architecture.md — Frontend Architecture, Routing]
- [Source: _bmad-output/implementation-artifacts/2-4-projects-listing-y-filtro-por-tecnologia.md]
- [Source: src/lib/schemas/project-schema.ts — Project type]
- [Source: src/lib/schemas/shared-schemas.ts — StoredImage, z.url() returns URL objects]

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### Change Log

### File List
