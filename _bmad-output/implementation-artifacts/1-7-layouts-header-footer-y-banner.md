# Story 1.7: Layouts, Header, Footer y Banner

Status: ready-for-dev

## Story

As a **visitor**,
I want **professional navigation with consistent header, footer and brand banner**,
so that **I can navigate the portfolio intuitively on any device**.

## Acceptance Criteria

1. **Given** BaseLayout **When** a public page uses it **Then** renders Banner + Header + `<main>` + Footer with semantic HTML (`<header>`, `<main>`, `<footer>`)
2. **And** AdminLayout renders sidebar placeholder + content area with `<aside>` and `<main>` landmarks
3. **And** Header on desktop shows logo ChrisBP left, 5 nav items right (Home, Projects, Experience, Blog, Contact), active item gradient underline, pinned top
4. **And** Header on mobile: hamburger → slide-down animated menu with logo + X close + centered items, Escape closes it
5. **And** Footer shows "Contact" centered, 3 social icons (TikTok, GitHub, LinkedIn), copyright
6. **And** Banner renders full-width gradient (#48A1CD → #108385) with "Welcome to my Portfolio" centered white on all public pages
7. **And** skip nav link "Saltar al contenido" visible on Tab, jumps to `<main>` on Enter
8. **And** responsive across 3 breakpoints (mobile <450px, tablet >=450px, desktop >=900px)
9. **And** `aria-current="page"` on active nav, `aria-expanded` + `aria-label` on hamburger

## Tasks / Subtasks

- [ ] Task 1: Create SkipNav component (AC: #7)
  - [ ] 1.1 Create `src/components/common/SkipNav.astro` — `<a>` linking to `#main`, sr-only + focus-visible styles
- [ ] Task 2: Create Banner component (AC: #6)
  - [ ] 2.1 Create `src/components/layout/Banner.astro` — full-width `[background:var(--brand-gradient)]`, white text centered
- [ ] Task 3: Create Header component (AC: #3, #9)
  - [ ] 3.1 Create `src/components/layout/Header.astro` — pinned `<header>` with `<nav>`, logo left, 5 desktop links right
  - [ ] 3.2 Implement active nav item detection via `currentPage` prop → `aria-current="page"` + gradient underline
  - [ ] 3.3 Add hamburger button (visible `lg:hidden`) with `aria-expanded` + `aria-label`
- [ ] Task 4: Create MobileMenu island (AC: #4, #9)
  - [ ] 4.1 Create `src/components/layout/MobileMenu.svelte` — Svelte 5 island with `client:load`
  - [ ] 4.2 Slide-down animation, overlay, logo + X close + centered nav items
  - [ ] 4.3 Escape key closes, focus trap inside, body scroll lock
  - [ ] 4.4 `prefers-reduced-motion: reduce` disables animation
- [ ] Task 5: Create Footer component (AC: #5)
  - [ ] 5.1 Create `src/components/layout/Footer.astro` — semantic `<footer>`, "Contact" title, 3 social icon links, copyright
  - [ ] 5.2 Social links: TikTok, GitHub, LinkedIn — `target="_blank" rel="noopener noreferrer"` with `aria-label`
- [ ] Task 6: Create BaseLayout (AC: #1, #7)
  - [ ] 6.1 Create `src/layouts/BaseLayout.astro` — html + head + body shell
  - [ ] 6.2 Compose: SkipNav → Banner → Header → `<main id="main">` → Footer
  - [ ] 6.3 Accept props: `title`, `description`, `currentPage`
  - [ ] 6.4 Import global.css, set `lang="es"`, `class="dark"` on `<html>`
- [ ] Task 7: Create AdminLayout (AC: #2)
  - [ ] 7.1 Create `src/layouts/AdminLayout.astro` — `<aside>` sidebar placeholder + `<main>` content area
- [ ] Task 8: Refactor index.astro to use BaseLayout (AC: #1)
  - [ ] 8.1 Replace inline HTML with `<BaseLayout title="Portfolio — ChrisBP" currentPage="home">`
- [ ] Task 9: Responsive & accessibility verification (AC: #8, #9)
  - [ ] 9.1 Verify all 3 breakpoints render correctly
  - [ ] 9.2 `pnpm type-check && pnpm build && pnpm test` — all green, 0 regressions
- [ ] Task 10: Add layout component type tests
  - [ ] 10.1 Create `src/components/layout/__tests__/layout-props.test.ts` — type-check imports for Header, Footer, Banner, SkipNav

## Dev Notes

### Architecture Constraints

- **Framework:** Astro 6.0.5 SSG (`output: 'static'`), Svelte 5.53.12 for islands, Tailwind CSS 4.2.1 (CSS-first)
- **Zero JS rule:** `.astro` components ship zero JS. Only `.svelte` islands with `client:load` send JS (MobileMenu)
- **Semantic HTML:** `<header>`, `<nav>`, `<main>`, `<footer>`, `<aside>` — required landmarks
- **Dark mode:** Already implemented via `class="dark"` on `<html>` — semantic tokens auto-switch

### File Structure (Create These Files)

```
src/
├── layouts/
│   ├── BaseLayout.astro          ← NEW (public page shell)
│   └── AdminLayout.astro         ← NEW (admin page shell)
├── components/
│   ├── common/
│   │   └── SkipNav.astro         ← NEW (skip link)
│   └── layout/
│       ├── Banner.astro          ← NEW (gradient bar)
│       ├── Header.astro          ← NEW (pinned nav)
│       ├── MobileMenu.svelte     ← NEW (interactive island)
│       ├── Footer.astro          ← NEW (contact + social)
│       └── __tests__/
│           └── layout-props.test.ts ← NEW (type-check tests)
```

### Reuse Existing Components

- `Container` (`src/components/common/Container.astro`) — wrap content inside Header, Footer, main area. Max-width 1200px, responsive padding `px-4 sm:px-6 lg:px-8`
- `Button` (`src/components/common/Button.astro`) — use `variant="ghost"` for nav links if needed
- Design tokens from `src/styles/global.css` — **never hardcode hex values**, use semantic tokens

### Component Specifications

#### SkipNav.astro

```astro
<!-- First focusable element in body -->
<a
  href="#main"
  class="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-primary focus:text-white focus:px-4 focus:py-2 focus:rounded-lg"
>
  Saltar al contenido
</a>
```

#### Banner.astro

- Full-width bar with `[background:var(--brand-gradient)]`
- Text "Welcome to my Portfolio" — `text-white text-center`
- Compact height: `py-3` or `py-4`
- No Container wrapper (full-width bleed)

#### Header.astro

Props: `currentPage: 'home' | 'projects' | 'experience' | 'blog' | 'contact'`

- `<header class="fixed top-0 w-full bg-background/95 backdrop-blur-sm z-50 border-b border-border">`
- Inside: `<Container>` wrapping logo + nav
- Logo: import from `src/assets/logo/cbp-short-logo-dark.png` via Astro's `import` + `<img>`
- Desktop nav (`hidden lg:flex`): 5 links — Home (`/`), Projects (`/projects`), Experience (`/experience`), Blog (`/blog`), Contact (`/contact`)
- Active link: `aria-current="page"` attribute + gradient underline via `border-b-2 border-transparent` on inactive, `[border-image:var(--brand-gradient)_1]` or `bg-gradient-to-r from-primary to-primary-dark` underline on active
- Hamburger button (`lg:hidden`): `aria-label="Abrir menú"`, `aria-expanded={false}` (Svelte handles toggle)

#### MobileMenu.svelte (Svelte 5 Island)

Props: `currentPage: string`, `isOpen: boolean` (or internal state)

- Full-screen overlay: `fixed inset-0 z-[60] bg-background`
- Slide-down animation: CSS `transform: translateY(-100%)` → `translateY(0)` with `transition: transform 300ms ease-in-out`
- Content: logo at top + X close button + 5 nav items centered vertically
- Close triggers: X button click, Escape key, nav item click
- Focus trap: first/last focusable element Tab wraps
- Body scroll lock: `document.body.style.overflow = 'hidden'` on open, restore on close
- `prefers-reduced-motion`: check `window.matchMedia('(prefers-reduced-motion: reduce)')` → skip transition
- Hydrate with `client:load` (must be interactive immediately)

#### Footer.astro

- `<footer class="w-full bg-surface border-t border-border">`
- Inside: `<Container>` centered content
- `<h2>` "Contact" centered (use `text-heading-2`)
- 3 social links centered: TikTok, GitHub, LinkedIn — SVG icons or text with `aria-label="Visitar perfil de [platform]"`, `target="_blank"`, `rel="noopener noreferrer"`
- Copyright: "©2024 Christopher Bobadilla" — `text-text-muted text-body-sm`

#### BaseLayout.astro

Props: `title: string`, `description?: string`, `currentPage?: 'home' | 'projects' | 'experience' | 'blog' | 'contact'`

```astro
---
import '../styles/global.css'
import SkipNav from '../components/common/SkipNav.astro'
import Banner from '../components/layout/Banner.astro'
import Header from '../components/layout/Header.astro'
import Footer from '../components/layout/Footer.astro'

interface Props {
  title: string
  description?: string
  currentPage?: 'home' | 'projects' | 'experience' | 'blog' | 'contact'
}

const { title, description = 'Portfolio de Christopher Bobadilla', currentPage = 'home' } = Astro.props
---

<html lang="es" class="dark">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="icon" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width" />
    <meta name="generator" content={Astro.generator} />
    <meta name="description" content={description} />
    <title>{title}</title>
  </head>
  <body class="bg-background text-text-primary min-h-screen flex flex-col">
    <SkipNav />
    <Banner />
    <Header currentPage={currentPage} />
    <main id="main" class="flex-1 pt-[header-height]">
      <slot />
    </main>
    <Footer />
  </body>
</html>
```

**Note:** The `pt-[header-height]` is placeholder — calculate actual header height and apply as padding-top on `<main>` so content doesn't hide behind the fixed header.

#### AdminLayout.astro

Props: `title: string`

- Minimal shell: `<html>` + `<head>` + `<body>` with `<aside>` sidebar placeholder (empty div with comment "sidebar — story 3.2") + `<main>` content area
- No Banner, no public Header/Footer
- `<aside class="w-64 bg-surface border-r border-border min-h-screen">` placeholder
- `<main class="flex-1">` for content slot

### Styling Rules

- **Use semantic token classes:** `bg-background`, `bg-surface`, `text-text-primary`, `text-primary`, `border-border`, `text-text-muted`
- **Brand gradient:** `[background:var(--brand-gradient)]` — NOT `bg-gradient-to-r from-[#48A1CD] to-[#108385]`
- **Focus ring (ALL interactive):** `focus:outline-2 focus:outline-offset-2 focus:outline-primary`
- **Responsive padding:** `px-4 sm:px-6 lg:px-8` (matches Container)
- **Touch targets:** `min-h-11 min-w-11` (44x44px) on all clickable elements
- **Typography:** use compound tokens `text-display`, `text-heading-1`, `text-heading-2`, `text-body`, `text-body-sm`, `text-caption`

### Accessibility Checklist

- Skip link "Saltar al contenido" — first focusable, sr-only until focused
- `<header>` + `<nav>` + `<main>` + `<footer>` landmarks
- `aria-current="page"` on active nav item
- Hamburger: `aria-expanded="true|false"`, `aria-label="Abrir menú"/"Cerrar menú"`
- Mobile menu: focus trap, Escape closes, body scroll locked
- Social links: `aria-label` for icon-only links
- `prefers-reduced-motion: reduce` — disable slide animation
- Color contrast: all text meets WCAG AA (4.5:1 normal, 3:1 large)

### What NOT to Do

- **NO ThemeToggle** — that's story 1.9
- **NO LocaleToggle / i18n routing** — that's story 1.8
- **NO hardcoded hex colors** — use semantic tokens from global.css
- **NO new design tokens** — all tokens defined in story 1.5
- **NO barrel exports (index.ts)** — Astro imports by path directly
- **NO `<div role="button">`** — use real `<button>` or `<a>` elements
- **NO `pointer-events-none` as sole disabled strategy** — omit `href` for disabled `<a>` (lesson from story 1.6)
- **NO logo light variant yet** — only dark variants exist at `src/assets/logo/`

### Out of Scope (Future Stories)

| Feature | Story |
|---------|-------|
| i18n routing, translations, LocaleToggle | 1.8 |
| ThemeToggle, localStorage persistence | 1.9 |
| Firebase SDK configuration | 1.10 |
| Admin sidebar navigation | 3.2 |
| Page content (home sections, projects, etc.) | Epic 2 |

### Project Structure Notes

- Layouts go in `src/layouts/` — matches Astro convention and architecture spec
- Layout sub-components go in `src/components/layout/` — already scaffolded with `.gitkeep`
- SkipNav goes in `src/components/common/` — it's a reusable utility component
- Tests co-located at `src/components/layout/__tests__/`
- Logo assets at `src/assets/logo/cbp-short-logo-dark.png` — use Astro `import` for optimized handling

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 1.7] — AC, user story, UX references
- [Source: _bmad-output/planning-artifacts/architecture.md#Component Architecture] — folder structure, Astro/Svelte split
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#UX-DR21] — Header specs
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#UX-DR22] — Footer specs
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#UX-DR23] — Banner specs
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#UX-DR37] — Semantic HTML
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#UX-DR38] — Keyboard navigation
- [Source: _bmad-output/implementation-artifacts/1-6-componentes-ui-base.md] — Previous story patterns

### Previous Story Intelligence (1.6)

**Patterns to reuse:**
- Props interface with `class?: string` + destructure as `class: className` + `class:list` for conditional classes
- `{...attrs}` spread for native HTML attributes (id, data-*, aria-*)
- `<slot />` for children content
- Focus ring: `focus:outline-2 focus:outline-offset-2 focus:outline-primary`
- Touch target: `min-h-11 min-w-11`

**Lessons learned:**
- Use discriminated unions for multi-variant props (e.g., if Header needs variant types)
- `transition-all` instead of `transition-colors` when animating shadow/filter too
- Nullish coalescing for optional string props to avoid rendering "undefined"
- Brand gradient via `[background:var(--brand-gradient)]` (Tailwind arbitrary value referencing CSS custom property)
- NEVER `border-image` with gradient on rounded elements (CSS limitation) — use alternative approaches

**Test approach:**
- `pnpm type-check` as primary validation (compile-time Props checking)
- `pnpm build` verifies static HTML renders without error
- `pnpm test` — existing 53 tests must remain green
- New type-check test file for layout components at `src/components/layout/__tests__/layout-props.test.ts`

### Git Intelligence

Recent commits follow pattern: `feat: implement story X.X — description` for implementation, `docs: create story X.X` for story files. Files changed in 1.6: 6 components in `src/components/common/` + 1 test file. All 53 tests passing. CI pipeline validates: lint → type-check → test → build.

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
