# Story 1.7: Layouts, Header, Footer y Banner

Status: done

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

- [x] Task 1: Create SkipNav component (AC: #7)
  - [x] 1.1 Create `src/components/common/SkipNav.astro` — `<a>` linking to `#main`, sr-only + focus-visible styles
- [x] Task 2: Create Banner component (AC: #6)
  - [x] 2.1 Create `src/components/layout/Banner.astro` — full-width `[background:var(--brand-gradient)]`, white text centered
- [x] Task 3: Create Header component (AC: #3, #9)
  - [x] 3.1 Create `src/components/layout/Header.astro` — pinned `<header>` with `<nav>`, logo left, 5 desktop links right
  - [x] 3.2 Implement active nav item detection via `currentPage` prop → `aria-current="page"` + gradient `::after` underline
  - [x] 3.3 Embed `<MobileMenu client:load currentPage={currentPage} />` inside Header (hamburger lives in Svelte island, not in Astro)
- [x] Task 4: Create MobileMenu island (AC: #4, #9)
  - [x] 4.1 Create `src/components/layout/MobileMenu.svelte` — Svelte 5 Runes island with `client:load`
  - [x] 4.2 Hamburger toggle button (`lg:hidden`) + slide-down overlay + logo + X close + centered nav items
  - [x] 4.3 Escape key closes, focus trap (Tab wraps first↔last), body scroll lock via `$effect`
  - [x] 4.4 `prefers-reduced-motion: reduce` via CSS media query (Tailwind `motion-reduce:`)
- [x] Task 5: Create Footer component (AC: #5)
  - [x] 5.1 Create `src/components/layout/Footer.astro` — semantic `<footer>`, "Contact" title, 3 social icon links, copyright
  - [x] 5.2 Social links: TikTok, GitHub, LinkedIn — `target="_blank" rel="noopener noreferrer"` with `aria-label`
- [x] Task 6: Create BaseLayout (AC: #1, #7)
  - [x] 6.1 Create `src/layouts/BaseLayout.astro` — html + head + body shell
  - [x] 6.2 Compose: SkipNav → Banner → Header → `<main id="main">` → Footer
  - [x] 6.3 Accept props: `title`, `description`, `currentPage`
  - [x] 6.4 Import global.css, set `lang="es"`, `class="dark"` on `<html>`
- [x] Task 7: Create AdminLayout (AC: #2)
  - [x] 7.1 Create `src/layouts/AdminLayout.astro` — full `<html>` shell (lang, dark, head, global.css) + `<aside>` sidebar placeholder + `<main>` content area
- [x] Task 8: Refactor index.astro to use BaseLayout (AC: #1)
  - [x] 8.1 Replace inline HTML with `<BaseLayout title="Portfolio — ChrisBP" currentPage="home">`
- [x] Task 9: Responsive & accessibility verification (AC: #8, #9)
  - [x] 9.1 Verify all 3 breakpoints render correctly
  - [x] 9.2 `pnpm type-check && pnpm build && pnpm test` — all green, 0 regressions
- [x] Task 10: Add layout component type tests
  - [x] 10.1 Create `src/components/layout/__tests__/layout-props.test.ts` — type-check imports for Header, Footer, Banner, SkipNav, MobileMenu

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
- Text "Welcome to my Portfolio" — `text-white text-center` (English placeholder — will be i18n'd in story 1.8)
- Compact height: `py-3` or `py-4`
- No Container wrapper (full-width bleed)
- Banner is NOT fixed — it scrolls with page content (only Header is fixed)

#### Header.astro

Props: `currentPage: 'home' | 'projects' | 'experience' | 'blog' | 'contact'`

- `<header class="fixed top-0 w-full h-16 bg-background/95 backdrop-blur-sm z-50 border-b border-border">`
- Inside: `<Container>` wrapping logo + desktop nav + MobileMenu island
- Logo: `import { Image } from 'astro:assets'` + `import logo from '../../assets/logo/cbp-short-logo-dark.png'` → `<Image src={logo} alt="ChrisBP" class="h-10 w-auto" />`
- Desktop nav (`hidden lg:flex gap-8 items-center`): 5 links — Home (`/`), Projects (`/projects`), Experience (`/experience`), Blog (`/blog`), Contact (`/contact`)
- Active link: `aria-current="page"` + `::after` pseudo-element underline with `[background:var(--brand-gradient)]` height `2px` — NO `border-image` (breaks on rounded elements)
- Inactive link: `relative` + no `::after` visible, `hover:text-primary` transition
- Tablet (sm to lg): shows hamburger menu — same as mobile
- Hamburger button lives INSIDE `MobileMenu.svelte` (not in Astro) — Astro ships zero JS, cannot handle click events
- Embed: `<MobileMenu client:load currentPage={currentPage} />`

#### MobileMenu.svelte (Svelte 5 Island)

Props: `currentPage: string` — internal state only, NO `isOpen` prop

**Svelte 5 Runes (mandatory per architecture):**
- `let isOpen = $state(false)` for toggle state
- `$effect()` for body scroll lock and keyboard listener cleanup

**Hamburger button (rendered by this component, visible `lg:hidden`):**
- `<button class="lg:hidden min-h-11 min-w-11 ..." aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={isOpen}>`
- Toggles `isOpen` on click

**Overlay (when open):**
- Full-screen overlay: `fixed inset-0 z-[60] bg-background`
- Slide-down animation: CSS `transform: translateY(-100%)` → `translateY(0)` with `transition: transform 300ms ease-in-out`
- Content: logo at top + X close button + 5 nav items centered vertically
- Close triggers: X button click, Escape key, nav item click

**Focus trap implementation:**
- On open, query focusable elements: `menu.querySelectorAll('a[href], button')`
- On Tab at last element → focus first element; on Shift+Tab at first element → focus last element
- Implement in `$effect()` with keydown listener; cleanup on close

**Body scroll lock:**
- `$effect()`: when `isOpen` → save `document.body.style.overflow`, set `'hidden'`; cleanup restores original value

**Reduced motion:**
- Use CSS media query: `@media (prefers-reduced-motion: reduce) { .mobile-overlay { transition: none; } }`
- Or Tailwind: `motion-reduce:transition-none` on the overlay element

- Hydrate with `client:load` (must be interactive immediately)

#### Footer.astro

- `<footer class="w-full bg-surface border-t border-border py-12">`
- Inside: `<Container>` centered content
- `<h2>` "Contact" centered (use `text-heading-2`)
- 3 social links centered as inline SVG icons with `fill="currentColor"` for theme compatibility:
  - TikTok → `href="https://www.tiktok.com/@chrisbp_dev"` `aria-label="Visitar perfil de TikTok"`
  - GitHub → `href="https://github.com/ChrisBP-Dev"` `aria-label="Visitar perfil de GitHub"`
  - LinkedIn → `href="https://www.linkedin.com/in/christopher-bobadilla"` `aria-label="Visitar perfil de LinkedIn"`
  - All with `target="_blank" rel="noopener noreferrer"`, `min-h-11 min-w-11` touch target, `focus:outline-2 focus:outline-offset-2 focus:outline-primary`
- Copyright: dynamic year via frontmatter `const currentYear = new Date().getFullYear()` → `©${currentYear} Christopher Bobadilla` — `text-text-muted text-body-sm`

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
    <main id="main" class="flex-1 pt-16">
      <slot />
    </main>
    <Footer />
  </body>
</html>
```

**Note:** `pt-16` (64px) matches the fixed Header height `h-16`. Banner is NOT fixed so it doesn't affect padding.

#### AdminLayout.astro

Props: `title: string`

- Full `<html lang="es" class="dark">` shell — same boilerplate as BaseLayout:
  - `import '../styles/global.css'` in frontmatter
  - `<head>`: charset, viewport, generator, description ("Admin — Portfolio ChrisBP"), `<title>{title}</title>`
- `<body class="bg-background text-text-primary min-h-screen flex">`
- `<aside class="w-64 bg-surface border-r border-border min-h-screen">` placeholder with HTML comment `<!-- sidebar — story 3.2 -->`
- `<main class="flex-1"><slot /></main>` for content
- No Banner, no public Header/Footer, no SkipNav

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
- Logo assets at `src/assets/logo/cbp-short-logo-dark.png` — use `import { Image } from 'astro:assets'` for build-time optimization (per architecture decision)

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
- NEVER `border-image` with gradient on rounded elements (CSS limitation) — use `::after` pseudo-element with `[background:var(--brand-gradient)]` instead
- Astro `.astro` components CANNOT have click handlers (zero JS) — interactive toggles MUST live inside Svelte islands

**Test approach:**
- `pnpm type-check` as primary validation (compile-time Props checking)
- `pnpm build` verifies static HTML renders without error
- `pnpm test` — existing 53 tests must remain green
- New type-check test file for layout components at `src/components/layout/__tests__/layout-props.test.ts`

### Git Intelligence

Recent commits follow pattern: `feat: implement story X.X — description` for implementation, `docs: create story X.X` for story files. Files changed in 1.6: 6 components in `src/components/common/` + 1 test file. All 53 tests passing. CI pipeline validates: lint → type-check → test → build.

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (1M context)

### Debug Log References

- Build inicialmente falló por falta de `sharp` — se agregó como dependencia para `astro:assets` Image optimization
- MobileMenu logo corregido: se usa import Vite en vez de ruta pública directa

### Completion Notes List

- SkipNav: componente `<a>` sr-only con focus-visible, enlaza a `#main`
- Banner: barra gradient full-width con texto blanco centrado, usa `var(--brand-gradient)`
- Header: `<header>` fijo con logo (Image optimizada), 5 nav items desktop, active link con `aria-current="page"` y `::after` gradient underline
- MobileMenu: isla Svelte 5 con `$state`/`$effect`, hamburger `lg:hidden`, overlay slide-down con animación, focus trap, scroll lock, Escape cierra, `prefers-reduced-motion`
- Footer: `<footer>` semántico con "Contact", 3 iconos SVG inline (TikTok, GitHub, LinkedIn), copyright dinámico
- BaseLayout: shell HTML completo (`lang="es"`, `class="dark"`) con composición SkipNav → Banner → Header → main → Footer
- AdminLayout: shell HTML con `<aside>` sidebar placeholder + `<main>` content area
- index.astro refactorizado a usar BaseLayout
- Tests: 5 nuevos tests de importabilidad para layout components (58 total, 0 regresiones)
- Validación: `pnpm type-check` 0 errores, `pnpm test` 58 tests passed, `pnpm build` exitoso
- Dependencia `sharp` agregada para soporte de Image optimization de Astro

### File List

- `src/components/common/SkipNav.astro` — NUEVO
- `src/components/layout/Banner.astro` — NUEVO
- `src/components/layout/Header.astro` — NUEVO
- `src/components/layout/MobileMenu.svelte` — NUEVO
- `src/components/layout/Footer.astro` — NUEVO
- `src/components/layout/__tests__/layout-props.test.ts` — NUEVO
- `src/layouts/BaseLayout.astro` — NUEVO
- `src/layouts/AdminLayout.astro` — NUEVO
- `src/pages/index.astro` — MODIFICADO (refactorizado a BaseLayout)
- `src/components/layout/.gitkeep` — ELIMINADO
- `src/layouts/.gitkeep` — ELIMINADO
- `package.json` — MODIFICADO (sharp dependency)
- `pnpm-lock.yaml` — MODIFICADO

## Code Review Record

### Review Model Used

Claude Opus 4.6 (1M context)

### Review Layers

- **Blind Hunter** — adversarial review, diff only (no project context)
- **Edge Case Hunter** — boundary conditions, race conditions, unhandled paths
- **Acceptance Auditor** — spec compliance, AC verification

### Triage Summary

| Categoría | Cantidad |
|-----------|----------|
| Bad Spec | 3 |
| Patch | 6 |
| Defer | 2 |
| Rechazados (ruido) | 14 |

### Bad Spec Findings (Corregidos)

- **BS-1**: Banner invisible detrás del Header `fixed top-0` — composición visual rota. El Banner (estático) quedaba oculto detrás del Header fijo con z-50. **Fix:** Header cambiado de `fixed top-0` a `sticky top-0`, eliminado `pt-16` del `<main>` en BaseLayout.
- **BS-2**: Breakpoints del spec (450/900px) contradicen `lg:` (1024px) usado en componentes — contradicción interna del spec. **Nota:** No se modificó; los breakpoints `lg:` son la implementación pragmática correcta para Tailwind v4.
- **BS-3**: SkipNav spec dice "focus-visible styles" pero el code template usa `focus:`. **Fix:** Cambiado a `focus-visible:` en SkipNav.astro.

### Patches Applied (6)

- **P-1**: Focus trap guard para NodeList vacía — `if (focusable.length === 0) return;` en MobileMenu.svelte
- **P-2**: Retorno de focus al trigger button al cerrar — `bind:this={triggerRef}` + `triggerRef?.focus()` en `close()`
- **P-3**: Cierre automático al redimensionar a desktop — `matchMedia('(min-width: 1024px)')` listener en `$effect`
- **P-4**: Animación de salida (slide-up) — reemplazado CSS `@keyframes` con Svelte custom `transition:slideDown` que soporta intro+outro, `cubicInOut` easing, y `prefers-reduced-motion`
- **P-5**: `tabindex="-1"` agregado a `<main id="main">` para que el skip link mueva el focus correctamente
- **P-6**: `navItems` duplicado extraído a `src/data/navigation.ts` — importado en Header.astro y MobileMenu.svelte

### Deferred Items (2)

- **D-1**: `lang="es"` con contenido en inglés — será resuelto en story 1.8 (i18n)
- **D-2**: AdminLayout sidebar sin responsive handling — placeholder para story 3.2

### CI Fix (post-review)

El CI falló por un bug pre-existente en la config de ESLint (originado en story 1.1/1.3): el parser de TypeScript no estaba configurado para archivos `.svelte`. Esto era latente porque MobileMenu.svelte es el primer archivo Svelte con `<script lang="ts">` del proyecto.

- **eslint.config.js**: agregado `tseslint.parser` para `.svelte`, browser globals (`window`, `document`, `HTMLElement`, etc.), y `argsIgnorePattern: ^_` para `@typescript-eslint/no-unused-vars`
- **MobileMenu.svelte**: `$props()` inline type annotation cambiada a `interface Props` (compatible con svelte-eslint-parser), `$state` cast para triggerRef, `{#each}` key agregada (`item.key`)

### Verification

- `pnpm lint`: 0 errores
- `pnpm type-check`: 0 errores (37 archivos)
- `pnpm test`: 58 tests passed, 0 regresiones
- `pnpm build`: exitoso, 1 página generada

### Files Modified by Code Review

- `src/components/common/SkipNav.astro` — focus: → focus-visible: (BS-3)
- `src/components/layout/Header.astro` — fixed → sticky, navItems import (BS-1, P-6)
- `src/components/layout/MobileMenu.svelte` — focus trap guard, focus return, matchMedia, Svelte transition, navItems import, Props interface, {#each} key (P-1 a P-6, CI fix)
- `src/layouts/BaseLayout.astro` — remove pt-16, add tabindex="-1" (BS-1, P-5)
- `src/data/navigation.ts` — NUEVO, shared navItems + NavKey type (P-6)
- `eslint.config.js` — MODIFICADO, TypeScript parser + browser globals para Svelte (CI fix, pre-existente de story 1.1/1.3)
