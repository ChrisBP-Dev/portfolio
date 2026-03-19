# Story 2.4: Projects Listing y Filtro por Tecnología

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a visitor (Sarah),
I want to browse all projects and filter by technology,
So that I can find relevant work samples quickly.

## Acceptance Criteria

1. **Given** I navigate to `/projects` **When** page loads **Then** introductory text, filter dropdown "Filter by:" with "All Projects" default, project cards in grid (2 cols desktop, 1 col mobile)
2. **And** selecting a technology in ProjectFilter instantly shows only projects using that technology
3. **And** "All Projects" selected shows all projects
4. **And** each project card shows name, description, technology chips, screenshots thumbnail, link to detail
5. **And** ProjectFilter is a Svelte 5 island with `client:load`
6. **And** content in selected locale
7. **And** `/en/projects` shows English version

**(FR2, FR13 partial, UX-DR16)**

## Tasks / Subtasks

- [ ] Task 1: i18n translations for Projects page (AC: #6, #7)
  - [ ] 1.1 Add translation keys to `src/lib/i18n/translations.ts`:
    - `projects.meta.title` — "Proyectos — ChrisBP" / "Projects — ChrisBP"
    - `projects.meta.description` — "Proyectos personales y profesionales de ChrisBP" / "ChrisBP's personal and professional projects"
    - `projects.intro` — "Como desarrollador, he tenido la oportunidad de trabajar en diferentes proyectos, tanto personales como profesionales. A continuación algunos de los proyectos en los que he trabajado:" / "As a developer, I've had the opportunity to work on different projects, both personal and professional. Below are some of the projects I've worked on:"
    - `projects.filter.label` — "Filter by:" / "Filter by:"
    - `projects.filter.all` — "Todos los Proyectos" / "All Projects"
    - `projects.technologies` — "Tecnologías" / "Technologies"
    - `projects.website` — "Website" / "Website"
    - `projects.sourceCode` — "Código Fuente" / "Source Code"
    - `projects.screenshots` — "Screenshots" / "Screenshots"
    - `projects.noResults` — "No se encontraron proyectos con esta tecnología" / "No projects found with this technology"
  - [ ] 1.2 Verify existing dynamic i18n tests pass with new keys

- [ ] Task 2: Create `src/pages/projects/index.astro` — Projects listing page ES (AC: #1, #4, #6)
  - [ ] 2.1 Create directory `src/pages/projects/` and add `index.astro`
  - [ ] 2.2 Frontmatter — imports and data fetching:
    ```typescript
    ---
    import BaseLayout from '../../layouts/BaseLayout.astro';
    import Section from '../../components/common/Section.astro';
    import Container from '../../components/common/Container.astro';
    import ProjectFilter from '../../components/projects/ProjectFilter.svelte';
    import { adminDb } from '../../lib/firebase/admin';
    import { getAllProjects, getAllTechnologies } from '../../lib/firebase/collections';
    import { getLocaleFromUrl } from '../../lib/i18n/config';
    import { t } from '../../lib/i18n/translations';

    const locale = getLocaleFromUrl(Astro.url);
    const projects = await getAllProjects(adminDb);
    const technologies = await getAllTechnologies(adminDb);
    ---
    ```
  - [ ] 2.3 Page structure:
    - `BaseLayout` with `title={t('projects.meta.title', locale)}`, `description={t('projects.meta.description', locale)}`, `currentPage="projects"`
    - `Section variant="default"` + `Container variant="default"`
    - Introductory `<p>` with `t('projects.intro', locale)`, `text-body text-text-secondary mb-8`
    - `ProjectFilter` Svelte island with `client:load` passing serialized data (see Task 3)
  - [ ] 2.4 Pass data to ProjectFilter as JSON-serializable props:
    ```astro
    <ProjectFilter
      client:load
      projects={projects}
      technologies={technologies}
      locale={locale}
      filterLabel={t('projects.filter.label', locale)}
      allProjectsLabel={t('projects.filter.all', locale)}
      technologiesLabel={t('projects.technologies', locale)}
      websiteLabel={t('projects.website', locale)}
      sourceCodeLabel={t('projects.sourceCode', locale)}
      screenshotsLabel={t('projects.screenshots', locale)}
      noResultsLabel={t('projects.noResults', locale)}
    />
    ```

- [ ] Task 3: Create `src/components/projects/ProjectFilter.svelte` — Interactive filter island (AC: #1, #2, #3, #4, #5)
  - [ ] 3.1 Create `src/components/projects/ProjectFilter.svelte` (remove `.gitkeep` from `src/components/projects/` if present: `git rm src/components/projects/.gitkeep`)
  - [ ] 3.2 Props interface using Svelte 5 `$props()`:
    ```svelte
    <script lang="ts">
      import type { Project } from '../../lib/schemas/project-schema';
      import type { Technology } from '../../lib/schemas/technology-schema';
      import type { Locale } from '../../lib/i18n/config';

      let {
        projects,
        technologies,
        locale,
        filterLabel,
        allProjectsLabel,
        technologiesLabel,
        websiteLabel,
        sourceCodeLabel,
        screenshotsLabel,
        noResultsLabel,
      }: {
        projects: Project[];
        technologies: Technology[];
        locale: Locale;
        filterLabel: string;
        allProjectsLabel: string;
        technologiesLabel: string;
        websiteLabel: string;
        sourceCodeLabel: string;
        screenshotsLabel: string;
        noResultsLabel: string;
      } = $props();
    </script>
    ```
  - [ ] 3.3 Filter state with Svelte 5 runes:
    ```svelte
    let selectedTech = $state<string>('');

    let filteredProjects = $derived(
      selectedTech === ''
        ? projects
        : projects.filter(p => p.technologies.includes(selectedTech))
    );
    ```
  - [ ] 3.4 Filter dropdown UI — matches visual reference:
    - `<div class="flex items-center justify-end gap-2 mb-6">`
    - `<span class="text-body-sm text-text-secondary">{filterLabel}</span>`
    - `<select>` with `bg-surface border border-border rounded-lg px-3 py-2 text-body-sm`
    - Default `<option value="">{allProjectsLabel}</option>`
    - Map technologies to `<option value={tech.id}>{tech.name}</option>`
    - Bind: `bind:value={selectedTech}`
  - [ ] 3.5 Project cards grid:
    - `<div class="grid grid-cols-1 sm:grid-cols-2 gap-6">`
    - Each card: `bg-surface border border-border rounded-xl overflow-hidden` (same surface card pattern as visual reference)
    - Card content layout (per visual reference — expanded card with all info visible):
      - **Project name**: `<h2 class="text-heading-3 font-bold p-4 pb-0">{project.companyName[locale]}</h2>`
      - **Description**: `<p class="text-body-sm text-text-secondary px-4 py-2">{project.shortDescription[locale]}</p>`
      - **Website link** (if exists): `<a href={project.websiteUrl} target="_blank" rel="noopener noreferrer" class="text-primary text-body-sm px-4 hover:underline">{websiteLabel}: {project.websiteUrl}</a>`
      - **Source code link** (if exists): same pattern
      - **Technologies section**: `<div class="px-4 py-2"><h3 class="text-body-sm font-semibold mb-2">{technologiesLabel}</h3>` + technology chips row
      - **Technology chips**: For each `techId` in `project.technologies`, find matching technology in `technologies` array, render: `<span class="inline-flex items-center gap-1 bg-primary/10 text-primary border border-primary/30 rounded-full px-2 py-1 text-caption">{techImage} {techName}</span>` — same styling as Badge.astro technology variant
      - **Screenshots section**: `<div class="px-4 py-2"><h3 class="text-body-sm font-semibold mb-2">{screenshotsLabel}</h3>` + horizontal scroll of screenshot thumbnails
      - **Screenshot thumbnails**: `<div class="flex gap-2 overflow-x-auto px-4 pb-4">` with each screenshot as `<img src={ss.url} alt="Screenshot" loading="lazy" class="h-24 rounded-lg object-cover">`
  - [ ] 3.6 No results state: when `filteredProjects.length === 0`, show `<p class="text-body text-text-secondary text-center py-12">{noResultsLabel}</p>`
  - [ ] 3.7 Project card links to detail page: wrap project name or add a link element — `href={locale === 'en' ? `/en/projects/${project.slug}` : `/projects/${project.slug}`}` (detail pages will be built in Story 2.5, 404 is expected now)
  - [ ] 3.8 Technology resolution helper (inside component):
    ```svelte
    function getTechByIds(techIds: string[]): Technology[] {
      return techIds
        .map(id => technologies.find(t => t.id === id))
        .filter((t): t is Technology => t !== undefined);
    }
    ```

- [ ] Task 4: Create `src/pages/en/projects/index.astro` — Projects listing page EN (AC: #7)
  - [ ] 4.1 Create directory `src/pages/en/projects/` and add `index.astro`
  - [ ] 4.2 Same structure as ES version but import paths use `../../../` (three levels up from `src/pages/en/projects/`)
  - [ ] 4.3 Verify `getLocaleFromUrl(Astro.url)` correctly returns `'en'` for this path

- [ ] Task 5: Unit tests (AC: all)
  - [ ] 5.1 Verify all new i18n keys exist for both locales (existing dynamic test handles this)
  - [ ] 5.2 Verify CI pipeline passes: `pnpm lint && pnpm type-check && pnpm test && pnpm build`

- [ ] Task 6: E2E tests (AC: #1, #2, #3, #6, #7)
  - [ ] 6.1 Create `tests/e2e/projects-page.spec.ts` (new file — this is a new page, not extending home-page tests):
    ```typescript
    test.describe('Projects Page — ES', () => {
      test('page loads with intro text, filter dropdown, and project cards', ...);
      test('filter dropdown shows "All Projects" by default with technology options', ...);
      test('selecting a technology filters project cards', ...);
      test('each project card shows name, description, technology chips, and screenshots', ...);
    });

    test.describe('Projects Page — EN', () => {
      test('page loads with English content at /en/projects', ...);
      test('filter works correctly in English locale', ...);
    });
    ```
  - [ ] 6.2 Test filter interaction: select a technology → verify card count changes → select "All" → verify all cards return
  - [ ] 6.3 Verify project cards contain expected elements (name heading, description text, technology badges)

## Dev Notes

### CRITICAL: Visual Reference — Consult BEFORE Implementing

Screenshots in `_bmad-output/planning-artifacts/visual-reference/`:
- **`04-desktop-projects-page.png`** — Desktop: 2-column grid, expanded project cards with all info, filter dropdown top-right
- **`10-mobile-projects-page.png`** — Mobile: Contact page screenshot (NOTE: not the projects mobile view — use desktop reference and apply responsive patterns)

**Replicate the layout faithfully.** Key observations from visual reference:

| Element | Visual Reference Detail |
|---------|------------------------|
| Page intro | Paragraph text at top of page, below header |
| Filter dropdown | Right-aligned, "Filter by:" label + `<select>` with "All Projects" default |
| Card layout | 2 columns desktop, each card is a surface card with ALL info expanded (NOT just thumbnail + name) |
| Project name | Bold heading inside card, NO gradient |
| Description | Full description paragraph (NOT truncated with line-clamp) |
| Website link | Shown as clickable URL text inside card |
| Technologies section | "Technologies" sub-heading + chips row with icons |
| Technology chips | Same as Badge.astro `technology` variant: `bg-primary/10 text-primary border border-primary/30 rounded-full` with small icon + name |
| Screenshots section | "Screenshots" sub-heading + horizontal row of thumbnail images |
| Grid | 2 columns on desktop, 1 column on mobile |

### Architecture: ProjectFilter is a Svelte 5 Island

The filter needs client-side interactivity for instant filtering. Architecture mandates:
- Use Svelte 5 with runes (`$state`, `$derived`, `$props`)
- Hydrate with `client:load` (filter must be interactive immediately)
- All project data is serialized from Astro → Svelte as props at build time
- Filtering happens client-side only (no API calls) — all data is already available

### Data Access — Functions Already Exist

Both `getAllProjects(db)` and `getAllTechnologies(db)` exist in `src/lib/firebase/collections.ts`:
- `getAllProjects(db)` — orders by `slug`, returns `Project[]`
- `getAllTechnologies(db)` — orders by `name`, returns `Technology[]`

**DO NOT recreate these functions.**

### Data Shape After Zod Parsing

```typescript
// Project (from projectSchema)
{
  id: string,
  companyName: { es: string, en: string },
  shortDescription: { es: string, en: string },
  features: { es: string[], en: string[] },
  mainImage: { url: string, storagePath: string },
  screenshots: StoredImage[],           // { url, storagePath }[]
  websiteUrl?: string,                  // Optional URL
  sourceCodeUrl?: string,               // Optional URL
  technologies: string[],              // Array of Technology IDs (NOT names)
  slug: string,                         // For URL /projects/[slug]
}

// Technology (from technologySchema)
{
  id: string,
  name: string,                         // NOT localized (tech names universal)
  image: { url: string, storagePath: string },
  experienceYears: number,
}
```

**CRITICAL:** `project.technologies` contains Technology **IDs**, not names. You must resolve IDs to Technology objects to display names and icons. Use the `getTechByIds()` helper inside the Svelte component.

### Filtering Logic

```
selectedTech = '' → show ALL projects
selectedTech = 'abc123' → show projects where project.technologies.includes('abc123')
```

The filter uses Technology IDs as values. The `<select>` renders `tech.name` as display text and `tech.id` as value.

### i18n for Svelte Islands — Pass Pre-Translated Labels

Svelte islands cannot call `t()` directly (it's a server-side function). Pass all needed translated strings as props from the Astro page:
```astro
<ProjectFilter
  client:load
  filterLabel={t('projects.filter.label', locale)}
  allProjectsLabel={t('projects.filter.all', locale)}
  ...
/>
```

This is the established pattern — MobileMenu.svelte and other islands receive translated strings as props.

### URL Localization Inside Svelte

`localizeHref()` is TypeScript — usable in Svelte. But for simplicity, pass `locale` as a prop and compute the URL inline:
```svelte
href={locale === 'en' ? `/en/projects/${project.slug}` : `/projects/${project.slug}`}
```

### Images — External Firebase Storage URLs

- **DO NOT use Astro `<Image />`** — only works with local assets in `src/assets/`
- Use plain `<img>` with `loading="lazy"` for Firebase Storage URLs
- Technology icons: `<img src={tech.image.url} alt={tech.name} class="w-4 h-4" />`
- Screenshot thumbnails: `<img src={ss.url} loading="lazy" class="h-24 rounded-lg object-cover" />`

### Page Wiring Pattern (SSG Data Fetching)

```typescript
// src/pages/projects/index.astro (frontmatter)
---
const locale = getLocaleFromUrl(Astro.url);
const projects = await getAllProjects(adminDb);
const technologies = await getAllTechnologies(adminDb);
---
```

For `en/projects/index.astro`: same imports but paths use `../../../lib/` (three levels up from `src/pages/en/projects/`).

### Helpers Available

| Helper | Import From | Usage |
|--------|-------------|-------|
| `t(key, locale)` | `../../lib/i18n/translations` | Static UI strings in Astro pages |
| `localizeHref(path, locale)` | `../../data/navigation` | URL prefix (use in Astro, not needed in Svelte) |
| `getLocaleFromUrl(url)` | `../../lib/i18n/config` | Extract locale from URL |
| `item.field[locale]` | Direct indexing | Firestore localized data |

### Existing Components to Reuse

| Component | Path | Use For |
|-----------|------|---------|
| `Section.astro` | `src/components/common/Section.astro` | Page section wrapper |
| `Container.astro` | `src/components/common/Container.astro` | Centered content (1200px max) |
| `BaseLayout.astro` | `src/layouts/BaseLayout.astro` | Page shell with header/footer |

**DO NOT use Card.astro** inside Svelte island — Astro components cannot render inside Svelte.
**DO NOT use Badge.astro** inside Svelte island — replicate the technology chip styling inline.

### Responsive Breakpoints

| Breakpoint | Tailwind Prefix | Projects Grid |
|------------|-----------------|---------------|
| <450px (mobile) | (default) | 1 column |
| ≥450px (tablet/desktop) | `sm:` | 2 columns |

Note: Visual reference shows 2 columns max on desktop (not 3 like home page preview). The projects page cards are larger with more content, so 2 columns is appropriate.

### Project Structure Notes

Files to create:
```
src/pages/projects/index.astro           # Projects listing page (ES)
src/pages/en/projects/index.astro        # Projects listing page (EN)
src/components/projects/ProjectFilter.svelte  # Interactive filter island
tests/e2e/projects-page.spec.ts          # E2E tests for projects page
```

Files to modify:
```
src/lib/i18n/translations.ts             # Add projects.* translation keys
```

Files to remove:
```
src/components/projects/.gitkeep         # git rm after adding ProjectFilter.svelte
```

### Testing Standards

- **Vitest** for unit tests — existing dynamic i18n test auto-covers new translation keys
- **Playwright** for E2E — create new `tests/e2e/projects-page.spec.ts` (separate page, separate test file)
- Test factories exist: `createProject()`, `createTechnology()` in `src/test/factories/`
- CI pipeline: `pnpm lint && pnpm type-check && pnpm test && pnpm build` must pass

### Anti-Patterns to Avoid

1. **DO NOT use Astro `<Image />`** for Firebase Storage URLs — only works with local assets
2. **DO NOT call `t()` inside Svelte components** — pass translated strings as props from Astro
3. **DO NOT use Astro components (Card, Badge) inside Svelte** — Astro components cannot be rendered inside Svelte islands
4. **DO NOT import `admin.ts` in Svelte** — Admin SDK is build-time only, never client-side
5. **DO NOT create 3-column grid** — visual reference shows 2-column layout for this page
6. **DO NOT truncate descriptions with `line-clamp`** — visual reference shows full descriptions in project cards
7. **DO NOT hardcode text** — use `t(key, locale)` in Astro, props in Svelte
8. **DO NOT add pagination** — data volume is low (~5-10 projects), all rendered at build time
9. **DO NOT use `project.technologies` as display names** — they are IDs, resolve to Technology objects

### Previous Story Intelligence

**De Story 2.3 (Projects Destacados & Experience):**
- `getAllProjects()` and `getAllTechnologies()` validated and working for SSG
- Project card pattern established: `bg-surface border border-border rounded-xl overflow-hidden`
- `<img>` tags for Firebase Storage URLs (NOT Astro `<Image />`)
- `.gradient-text` class available globally in `global.css` (extracted in Story 2.3)
- `localizeHref()` from `src/data/navigation.ts` is canonical URL helper
- E2E tests verify project cards at `/` — new page tests go in new file
- Badge.astro technology variant: `bg-primary/10 text-primary border border-primary/30 rounded-full px-2 py-1 text-caption` — replicate in Svelte inline
- Home page ProjectsSection.astro cards use simplified view (image + name + short description). Projects page cards need EXPANDED view (all info visible per visual reference)
- Experiences Firestore collection was empty — projects collection has data (~4 projects visible in visual reference)

**De Story 2.2:**
- SSG data fetching validated: `adminDb` works in page frontmatter
- Code review found sequential Firebase fetches as deferred item (D1) — acceptable for now

**De Epic 1 Retrospective:**
- Validate Astro v6 APIs against docs before using
- Code review mandatory after implementation
- CI/CD verification (`pnpm build`) is part of Definition of Done

### project-context.md is OUTDATED

`_bmad-output/project-context.md` describes the OLD Flutter/Dart project. **Ignore it** for tech decisions. Use `architecture.md` and `epics.md` as authoritative sources.

### Git Intelligence

Recent commits:
- `eea01be` docs: close story 2.3 — code review passed, status → done
- `c28ae77` feat: implement story 2.3 — Home Page Projects Destacados & Experience
- `9f13a5b` docs: add import paths and syntax fixes to story 2.3
- `3204327` docs: create story 2.3 — Home Page Projects Destacados & Experience

Pattern: semantic prefixes (`feat:`, `fix:`, `docs:`). Use `feat: implement story 2.4 — Projects Listing y Filtro por Tecnología`.

### References

**Visual:** `_bmad-output/planning-artifacts/visual-reference/` → `04-desktop-projects-page.png`
**Specs:** `_bmad-output/planning-artifacts/` → `ux-design-specification.md` (UX-DR16), `architecture.md`, `epics.md`
**Previous work:** `_bmad-output/implementation-artifacts/2-3-home-page-projects-destacados-y-experience.md`

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
