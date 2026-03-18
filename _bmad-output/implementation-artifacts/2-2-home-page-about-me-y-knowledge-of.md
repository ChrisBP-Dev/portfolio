# Story 2.2: Home Page — About Me y Knowledge Of

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a visitor (Sarah),
I want to see Christopher's professional identity and technical skills immediately,
So that I can form a positive first impression within 3 seconds.

## Acceptance Criteria

1. **Given** I visit `/` **When** the page loads **Then** About Me section shows: avatar/mascota ChrisBP circular with gradient border, heading "I code and create content" with "content" in CSS gradient (`background-clip: text`), description paragraph centered, two CTAs: "Get in Touch" (primary) + "Download Resume" (secondary)
2. **And** Knowledge Of section shows: title "KNOWLEDGE OF" bold centered, technologies in horizontal row (icon/image + name), compact layout NOT categorized grid
3. **And** technologies display real data from Firestore Technologies collection via Admin SDK at build time
4. **And** content displays in the selected locale (`field[locale]`)
5. **And** responsive: single column mobile, centered desktop

**(FR1 partial, FR13 partial, UX-DR24, UX-DR25)**

## Tasks / Subtasks

- [ ] Task 1: Data access layer — `getAllTechnologies()` (AC: #3)
  - [ ] 1.1 Add `getAllTechnologies(db: FirebaseFirestore.Firestore)` to `src/lib/firebase/collections.ts` — queries `COLLECTION_PATHS.technologies`, maps with `parseTechnology()`, returns `Technology[]`
  - [ ] 1.2 Add `getAllProjects(db)` and `getAllExperiences(db)` in the same pattern (Story 2.3 will need them — establish the pattern now)
  - [ ] 1.3 Unit tests in `src/lib/firebase/__tests__/collections.test.ts` — test parse + get functions with mock Firestore

- [ ] Task 2: i18n translations for Home page (AC: #4)
  - [ ] 2.1 Add translation keys to `src/lib/i18n/translations.ts`:
    - `home.hero.heading` — "Yo programo y creo" / "I code and create"
    - `home.hero.headingAccent` — "contenido" / "content"
    - `home.hero.description` — paragraph describing Christopher (ES/EN)
    - `home.hero.cta.contact` — "Contáctame" / "Get in Touch"
    - `home.hero.cta.resume` — "Descargar CV" / "Download Resume"
    - `home.knowledgeOf.title` — "CONOCIMIENTOS" / "KNOWLEDGE OF"
    - `home.meta.title` — "Portfolio — ChrisBP" / "Portfolio — ChrisBP"
    - `home.meta.description` — SEO description for home page (ES/EN)
  - [ ] 2.2 Unit tests: verify all new keys exist for both `es` and `en` locales

- [ ] Task 3: HeroSection.astro component (AC: #1, #4, #5)
  - [ ] 3.1 Create `src/components/home/HeroSection.astro`
  - [ ] 3.2 Props: `locale: Locale`
  - [ ] 3.3 Avatar: use `cbp-short-logo-dark.png` from `src/assets/logo/` with Astro `<Image />` — circular crop (`rounded-full`), gradient border (2-3px solid with brand gradient via `border-image` or wrapper div with gradient background + inner padding)
  - [ ] 3.4 Heading: split into two parts — regular text + accent word. Accent word uses CSS `background-clip: text` with `background-image: linear-gradient(135deg, #48A1CD, #108385)` and `text-fill-color: transparent`
  - [ ] 3.5 Description paragraph: centered, max-width for readability, `text-secondary` color
  - [ ] 3.6 Two CTAs using existing `Button.astro`: "Get in Touch" (`variant="primary"`, `href` → localized `/contact`) + "Download Resume" (`variant="secondary"`, `href` → `/resume.pdf` or placeholder)
  - [ ] 3.7 Responsive: all content centered, spacing scales with Section variant `hero`
  - [ ] 3.8 Wrap in existing `Section.astro` with `variant="hero"` and `Container.astro`

- [ ] Task 4: TechnologiesSection.astro component (AC: #2, #3, #4, #5)
  - [ ] 4.1 Create `src/components/home/TechnologiesSection.astro`
  - [ ] 4.2 Props: `technologies: Technology[]`, `locale: Locale`
  - [ ] 4.3 Title "KNOWLEDGE OF" bold centered — use `t('home.knowledgeOf.title', locale)`, uppercase, font-weight 700, `heading-2` size
  - [ ] 4.4 Technology items in horizontal flex row (`flex flex-wrap justify-center gap-6 lg:gap-8`): each item is vertical stack (image on top, name below centered)
  - [ ] 4.5 Technology images: `<img>` tag (NOT Astro `<Image />` — these are external Firebase Storage URLs), `loading="lazy"`, reasonable size (48-64px), `alt={tech.name}`
  - [ ] 4.6 Technology names: `tech.name` (not localized — technology names are universal per schema)
  - [ ] 4.7 Wrap in existing `Section.astro` and `Container.astro`
  - [ ] 4.8 Compact layout — NOT categorized grid, just a centered row

- [ ] Task 5: Wire up Home pages with data fetching (AC: all)
  - [ ] 5.1 Update `src/pages/index.astro`:
    - Import `adminDb` from `../../lib/firebase/admin`
    - Import `getAllTechnologies` from `../../lib/firebase/collections`
    - Import `getLocaleFromUrl` from `../../lib/i18n/config`
    - Query technologies in frontmatter: `const technologies = await getAllTechnologies(adminDb)`
    - Get locale: `const locale = getLocaleFromUrl(Astro.url)`
    - Replace `<h1>Astro</h1>` with `<HeroSection>` + `<TechnologiesSection>`
    - Update BaseLayout props: localized `title` and `description` for SEO
  - [ ] 5.2 Update `src/pages/en/index.astro` — same pattern, English locale
  - [ ] 5.3 Verify `pnpm build` succeeds — this is the FIRST real Admin SDK usage in build time (validates SSG architecture)

- [ ] Task 6: Unit tests (AC: all)
  - [ ] 6.1 Test `getAllTechnologies()` — mock Firestore, verify parse flow and return type
  - [ ] 6.2 Test all new i18n keys exist for both locales
  - [ ] 6.3 Verify CI pipeline passes (`pnpm lint && pnpm type-check && pnpm test && pnpm build`)

## Dev Notes

### CRITICAL: First Real Admin SDK Usage in Build Time

Story 2.1 validated Admin SDK works for scripts. This story is the **first test of Admin SDK during `astro build`** (SSG data fetching). If `adminDb` fails to query Firestore during build, the entire SSG architecture needs rethinking.

**Expected pattern in page frontmatter:**
```typescript
// src/pages/index.astro
---
import { adminDb } from '../lib/firebase/admin';
import { getAllTechnologies } from '../lib/firebase/collections';
import { getLocaleFromUrl } from '../lib/i18n/config';

const locale = getLocaleFromUrl(Astro.url);
const technologies = await getAllTechnologies(adminDb);
---
```

`admin.ts` uses `import.meta.env` (Astro-compatible, NOT `process.env`). This should work in Astro's build pipeline since frontmatter runs in Node context where `import.meta.env` is populated by Vite.

### Data Access Pattern — `getAllTechnologies()` in collections.ts

Add to `src/lib/firebase/collections.ts`. Accept Firestore instance as parameter for testability:

```typescript
import type { Firestore } from 'firebase-admin/firestore';

export async function getAllTechnologies(db: Firestore): Promise<Technology[]> {
  const snapshot = await db.collection(COLLECTION_PATHS.technologies).get();
  return snapshot.docs.map((doc) => parseTechnology(doc.data(), doc.id));
}
```

**Why parameter injection:** `collections.ts` currently has NO import of `admin.ts`. Keeping it that way means the parse functions remain usable in any context (migration scripts, tests, future client SDK). The `db` parameter is injected by the caller.

Also add `getAllProjects()` and `getAllExperiences()` following the same pattern — Story 2.3 needs them, and establishing the pattern now prevents duplication later.

### Avatar/Mascot Image

The architecture spec mentions `src/assets/avatar.webp` but this file does NOT exist in the codebase. Only these logo files exist:
- `src/assets/logo/cbp-short-logo-dark.png` — ChrisBP mascot (gorra de dinosaurio + `</>`)
- `src/assets/logo/cbp-large-logo-dark.png` — Full logo

**Use `cbp-short-logo-dark.png`** as the avatar/mascot in HeroSection. This IS the ChrisBP mascot per the UX spec. Use Astro `<Image />` for build-time optimization (local asset, not Firebase URL).

**Gradient border technique:**
```html
<div class="rounded-full bg-gradient-to-br from-primary to-primary-dark p-[3px]">
  <div class="rounded-full bg-background">
    <Image src={avatar} alt="ChrisBP" class="rounded-full" width={120} height={120} />
  </div>
</div>
```

### CSS Gradient Text Effect

The heading "I code and create **content**" has the word "content" (or "contenido" in ES) rendered with the brand gradient. CSS technique:

```css
.gradient-text {
  background-image: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent; /* fallback */
}
```

**Implementation:** Split the heading into two translation keys (`home.hero.heading` + `home.hero.headingAccent`) so the gradient wraps only the accent word. Render as:
```astro
<h1 class="text-display font-bold text-center">
  {t('home.hero.heading', locale)}{' '}
  <span class="gradient-text">{t('home.hero.headingAccent', locale)}</span>
</h1>
```

### "Download Resume" CTA

The button links to a resume PDF. Check if a PDF exists in `public/` directory. If not:
- Create a placeholder file at `public/resume.pdf` (or `public/cv-christopher-bobadilla.pdf`)
- Christopher will replace with his real CV later
- The `href` should be a direct path: `/resume.pdf`
- Add `download` attribute to the `<a>` tag for download behavior

### Technology Images — External URLs from Firebase Storage

Technologies in Firestore have `image: StoredImage { url, storagePath }`. The `url` is a Firebase Storage download URL (external).

**DO NOT use Astro `<Image />`** for these — it only optimizes local assets in `src/assets/`. Use plain `<img>` tag:
```astro
<img src={tech.image.url} alt={tech.name} width="56" height="56" loading="lazy" />
```

### Firestore State After Migration (from Story 2.1)

```
Technologies: 4 docs (new schema)
  - Each has: id, name, image: { url, storagePath }, experienceYears
  - Names are universal (not localized): e.g., "Flutter", "Firebase", "Dart", "Google Gemini"
```

### Existing Components to Reuse — DO NOT Recreate

| Component | Path | Use For |
|-----------|------|---------|
| `Button.astro` | `src/components/common/Button.astro` | CTAs (primary + secondary variants) |
| `Section.astro` | `src/components/common/Section.astro` | Section wrapper (`variant="hero"` for hero, `variant="default"` for Knowledge Of) |
| `Container.astro` | `src/components/common/Container.astro` | Centered content wrapper |
| `BaseLayout.astro` | `src/layouts/BaseLayout.astro` | Page layout (Header, Footer, Banner, toggles, SEO) |

**DO NOT create** SectionTitle, GradientText, or other new common components unless truly reusable across 3+ stories. Inline the styles in the home components.

### i18n Pattern — Static UI Strings vs. Dynamic Data

Two separate i18n systems:
1. **Static UI strings** → `t('key', locale)` from `src/lib/i18n/translations.ts` — for headings, labels, CTAs
2. **Dynamic data** → `item.field[locale]` from Firestore — for project names, descriptions, etc.

For this story, technologies use `tech.name` (NOT localized — names are universal). Only UI labels (heading, description, CTAs, section titles) use `t()`.

### Visual References — MUST Consult Before Implementing

Screenshots of the existing Flutter site are at `_bmad-output/planning-artifacts/visual-reference/`:
- **`01-desktop-home-top.png`** — Desktop: Banner, header, avatar/mascot, "I code and create content", about, Knowledge Of
- **`06-mobile-home-top.png`** — Mobile: Same sections in single-column layout
- **`12-mobile-light-mode.png`** — Light mode variant

**Replicate the visual layout faithfully.** Improvements in CSS animations/transitions are allowed, but the structure and "look & feel" must match.

### Responsive Breakpoints

| Breakpoint | Tailwind Prefix | Behavior |
|------------|-----------------|----------|
| <450px (mobile) | (default) | Single column, full-width, scaled typography |
| >=450px (tablet) | `sm:` | Centered content, slight spacing increase |
| >=900px (desktop) | `lg:` | Full layout, generous spacing, max-width 1200px |

### Tailwind CSS 4 — CSS-First Config

Tokens are in `src/styles/global.css` using `@theme` directive. **No `tailwind.config.ts` file.** Custom properties are available as Tailwind utilities:

```css
/* Already defined in global.css */
--color-primary: #48A1CD;
--color-primary-dark: #108385;
--color-background: ...;
--color-surface: ...;
--color-text-primary: ...;
--color-text-secondary: ...;
```

Use as: `bg-primary`, `text-primary`, `text-text-primary`, `bg-background`, `bg-surface`, etc.

Typography compounds: `text-display`, `text-heading-1`, `text-heading-2`, `text-body`, etc. — already configured with size + line-height + font-weight.

### Project Structure Notes

Files to create:
```
src/components/home/
├── HeroSection.astro          # About Me section
└── TechnologiesSection.astro  # Knowledge Of section
```

Files to modify:
```
src/lib/firebase/collections.ts       # Add getAllTechnologies(), getAllProjects(), getAllExperiences()
src/lib/i18n/translations.ts          # Add home.* translation keys
src/pages/index.astro                 # Replace stub with real home content (ES)
src/pages/en/index.astro              # Replace stub with real home content (EN)
```

Files to create (tests):
```
src/lib/firebase/__tests__/collections.test.ts   # Test get* functions (if not already existing)
```

Verify existence and add test for new functions if file already exists.

`src/components/home/` directory exists (has `.gitkeep`) — remove `.gitkeep` after adding real files.

### Testing Standards

- Framework: Vitest
- Mock Firestore for `getAllTechnologies()` tests — use `vi.fn()` to mock `db.collection().get()`
- Test factories exist in `src/test/factories/technology.ts` — use `createTechnology()` to generate test data
- Verify all i18n keys exist for both locales with a simple loop test
- Build verification (`pnpm build`) validates the SSG data fetching pipeline end-to-end

### Previous Story Intelligence

**De Story 2.1 (Data Migration):**
- Migration completed successfully: `Technologies: 4 docs` in new schema
- Cross-collection migration from lowercase → PascalCase collections
- `collections.ts` is 100% Node-compatible — no Astro-specific imports, safe to use in any context
- `parseTechnology()` validates against `technologySchema` with Zod — returns typed `Technology`
- `stripUndefined()` helper exists for Firestore compatibility

**De Epic 1 Retrospective:**
- Bad spec caused 30% of stories to need rework — **validate all Astro APIs against v6 docs**
- Code review is mandatory — run `/bmad-code-review` after implementation
- CI/CD verification is part of Definition of Done — `pnpm build` MUST pass
- First real Admin SDK usage in build-time — if it fails, architecture needs rethinking
- Playwright E2E tests should start from this story onwards (retro recommendation)

### Git Intelligence

Recent commits:
- `66fb75a` fix: resolve type errors in migration script (pre-existing CI failures)
- `b5cda91` fix: code review patches for story 2.1 — migration script robustness
- `e1dec05` feat: implement story 2.1 — Data Migration Script (Flutter → professional schema)

Pattern: semantic commit prefixes (`feat:`, `fix:`, `docs:`), descriptive messages. The dev should use `feat: implement story 2.2 — Home Page About Me & Knowledge Of`.

### Anti-Patterns to Avoid

1. **DO NOT create Svelte islands for static content.** HeroSection and TechnologiesSection are 100% static — use `.astro` components (zero JS to browser)
2. **DO NOT import `admin.ts` in client-side code or Svelte components.** Admin SDK is build-time only
3. **DO NOT create `interface Technology` manually** — use `type Technology` from `z.infer<typeof technologySchema>` (already exported from schema file)
4. **DO NOT use `<Image />` for Firebase Storage URLs** — it only works with local assets
5. **DO NOT hardcode text strings in components** — use `t(key, locale)` for all UI text
6. **DO NOT create a categorized technology grid** — the design is a simple horizontal row, not a grid with categories

### References

- [Source: _bmad-output/planning-artifacts/visual-reference/01-desktop-home-top.png] — Desktop home visual reference
- [Source: _bmad-output/planning-artifacts/visual-reference/06-mobile-home-top.png] — Mobile home visual reference
- [Source: _bmad-output/planning-artifacts/visual-reference/12-mobile-light-mode.png] — Light mode variant
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#About Me] — UX spec for About Me section
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Knowledge Of] — UX spec for Knowledge Of section
- [Source: _bmad-output/planning-artifacts/architecture.md#Component Architecture] — Astro vs Svelte component rules
- [Source: _bmad-output/planning-artifacts/architecture.md#Data Architecture] — SSG data fetching pattern
- [Source: _bmad-output/planning-artifacts/epics.md#Story 2.2] — Original acceptance criteria
- [Source: src/lib/firebase/collections.ts] — Parse helpers and COLLECTION_PATHS
- [Source: src/lib/firebase/admin.ts] — Admin SDK init (build-time only)
- [Source: src/lib/schemas/technology-schema.ts] — Technology Zod schema
- [Source: src/lib/i18n/translations.ts] — Current translation keys
- [Source: src/lib/i18n/config.ts] — Locale config and getLocaleFromUrl()
- [Source: src/components/common/Button.astro] — Button component (primary/secondary variants)
- [Source: src/components/common/Section.astro] — Section wrapper component
- [Source: src/components/common/Container.astro] — Centered content wrapper
- [Source: src/layouts/BaseLayout.astro] — Main page layout
- [Source: _bmad-output/implementation-artifacts/2-1-data-migration-script.md] — Previous story learnings
- [Source: _bmad-output/implementation-artifacts/epic-1-retro-2026-03-18.md] — Epic 1 retrospective

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
