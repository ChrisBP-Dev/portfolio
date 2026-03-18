# Story 1.8: i18n Foundation y LocaleToggle

Status: review

## Story

As a visitor,
I want to switch the site language between Spanish and English,
So that I can read content in my preferred language.

## Acceptance Criteria

1. **AC-1: Default Spanish routing** — `GET /` renders Spanish content; `Astro.currentLocale` returns `'es'`
2. **AC-2: English routing** — `GET /en/` renders English content; `Astro.currentLocale` returns `'en'`
3. **AC-3: Static translations dictionary** — `src/lib/i18n/translations.ts` provides both ES and EN for all UI strings (nav labels, buttons, section titles, aria-labels)
4. **AC-4: LocaleToggle FAB** — Renders floating bottom-right with active locale flag (Spain for ES, USA for EN)
5. **AC-5: Locale switching** — On Spanish page, clicking LocaleToggle navigates to English equivalent URL via `window.location.href` (and vice versa); flag changes accordingly. Note: Astro SSG generates separate HTML files per locale, so navigation is a standard page transition — this is correct and expected for static output. Do NOT attempt SPA-like navigation or View Transitions.
6. **AC-6: Locale-aware URLs** — `/en/projects` renders in English with correct URL; all existing pages have `/en/` counterparts
7. **AC-7: Svelte 5 island** — LocaleToggle is a Svelte 5 component with `client:load` hydration
8. **AC-8: Accessibility** — `aria-label` reads "Cambiar a inglés" on ES pages, "Switch to Spanish" on EN pages
9. **AC-9: Existing components localized** — Banner, Header nav labels, Footer heading, MobileMenu aria-labels, SkipNav text all render in the active locale

## Tasks / Subtasks

- [x] **Task 1: Astro i18n configuration** (AC: 1, 2)
  - [x] 1.1 Add `i18n` block to `astro.config.mjs`: `defaultLocale: 'es'`, `locales: ['es', 'en']`, `routing: { prefixDefaultLocale: false, redirectToDefaultLocale: true }`
  - [x] 1.2 Verify `Astro.currentLocale` returns `'es'` on `/` and `'en'` on `/en/`

- [x] **Task 2: i18n config module** (AC: 1, 2, 3)
  - [x] 2.1 Create `src/lib/i18n/config.ts` — export `defaultLocale`, `locales`, `type Locale` (reuse from `shared-schemas.ts`), helper `getLocaleFromUrl(url: URL): Locale`
  - [x] 2.2 Delete `src/lib/i18n/.gitkeep`

- [x] **Task 3: Static translations dictionary** (AC: 3, 9)
  - [x] 3.1 Create `src/lib/i18n/translations.ts` — `Record<string, Record<Locale, string>>` covering: nav labels (Home/Inicio, Projects/Proyectos, Experience/Experiencia, Blog, Contact/Contacto), Banner text, Footer heading, SkipNav text, MobileMenu aria-labels, LocaleToggle aria-labels, BaseLayout default description
  - [x] 3.2 Export `t(key: string, locale: Locale): string` helper function

- [x] **Task 4: Localize navigation data** (AC: 3, 9)
  - [x] 4.1 Refactor `src/data/navigation.ts` — change `label` from `string` to `Record<Locale, string>` (e.g., `{ es: 'Inicio', en: 'Home' }`) or use translations dictionary with keys
  - [x] 4.2 Update `Header.astro` to pass `locale` and render localized nav labels
  - [x] 4.3 Update `MobileMenu.svelte` to accept `locale` prop (`'es' | 'en'`). Specific changes: (a) Add `locale` to Props interface, (b) Change nav label rendering from `item.label` to `item.label[locale]` (since `label` becomes `Record<Locale, string>`), (c) Change hrefs from `item.href` to `localizeHref(item.href, locale)` — import `localizeHref` from navigation.ts, (d) Change hamburger aria-label from hardcoded `'Abrir menú'/'Cerrar menú'` to use translations: `t('mobile.open', locale)`/`t('mobile.close', locale)`, (e) Change nav aria-label from `'Navegación principal'` to `t('nav.aria', locale)` — import `t` from translations.ts

- [x] **Task 5: Update BaseLayout for i18n** (AC: 1, 2, 9)
  - [x] 5.1 Change `<html lang="es">` to `<html lang={locale}>` using `Astro.currentLocale`
  - [x] 5.2 Add `locale` to Props, derive from `Astro.currentLocale ?? 'es'`
  - [x] 5.3 Pass `locale` down to Header, Banner, Footer, SkipNav
  - [x] 5.4 Localize default `description` meta tag
  - [x] 5.5 Add `<link rel="alternate" hreflang="es" href="...">` and `<link rel="alternate" hreflang="en" href="...">` tags using `getRelativeLocaleUrl` from `astro:i18n`

- [x] **Task 6: Localize existing layout components** (AC: 9)
  - [x] 6.1 `Banner.astro` — accept `locale` prop, render "Bienvenido a mi Portfolio" / "Welcome to my Portfolio"
  - [x] 6.2 `Footer.astro` — accept `locale` prop, render "Contacto" / "Contact", localize aria-labels
  - [x] 6.3 `SkipNav.astro` — accept `locale` prop, render "Saltar al contenido" / "Skip to content"
  - [x] 6.4 `Header.astro` — accept `locale` prop, localize nav `aria-label`, pass locale to MobileMenu
  - [x] 6.5 Update all component nav `href` values to use locale-aware URLs (e.g., on EN pages, links point to `/en/projects` not `/projects`)

- [x] **Task 7: Create LocaleToggle.svelte** (AC: 4, 5, 7, 8)
  - [x] 7.1 Create `src/components/layout/LocaleToggle.svelte` — Svelte 5 island with `client:load`
  - [x] 7.2 Props: `currentLocale: 'es' | 'en'`, `currentPath: string`
  - [x] 7.3 Render as FAB: `position: fixed`, `bottom-right`, `z-[55]` (above content, below modals)
  - [x] 7.4 Show flag emoji or SVG: Spain flag for ES, USA flag for EN (active locale shown)
  - [x] 7.5 `onclick` → `window.location.href` to locale-switched URL (compute target path by adding/removing `/en/` prefix)
  - [x] 7.6 `aria-label` — "Cambiar a inglés" when on ES, "Switch to Spanish" when on EN
  - [x] 7.7 Touch target `min-h-11 min-w-11`, focus ring `focus:outline-2 focus:outline-offset-2 focus:outline-primary`
  - [x] 7.8 Styling: `bg-surface border border-border rounded-full shadow-lg` with hover/active states

- [x] **Task 8: Place LocaleToggle in BaseLayout** (AC: 4)
  - [x] 8.1 Import and render `<LocaleToggle client:load currentLocale={locale} currentPath={Astro.url.pathname} />` in BaseLayout, after `<Footer />`
  - [x] 8.2 Position: fixed bottom-right (CSS in the component, NOT in BaseLayout)

- [x] **Task 9: Create `/en/` page routes** (AC: 2, 6)
  - [x] 9.1 Create `src/pages/en/index.astro` — mirrors `src/pages/index.astro` but with English content/locale
  - [x] 9.2 For MVP, only `en/index.astro` is needed (other pages created in Epic 2); add placeholder or redirect for future routes

- [x] **Task 10: Unit tests** (AC: 1-9)
  - [x] 10.1 Create `src/lib/i18n/__tests__/config.test.ts` — test `getLocaleFromUrl()` with various URL patterns (`/`, `/en/`, `/projects`, `/en/projects`)
  - [x] 10.2 Create `src/lib/i18n/__tests__/translations.test.ts` — test `t()` returns correct strings for both locales, test all keys exist in both ES and EN, test unknown key returns key itself
  - [x] 10.3 Create `src/data/__tests__/navigation.test.ts` — test `localizeHref()`: returns unchanged href for `'es'` locale, prefixes `/en` for `'en'` locale, handles root `/` correctly (`/en/` not `/en`), handles nested paths (`/projects` → `/en/projects`)
  - [x] 10.4 Verify all existing tests still pass (`pnpm test`)

- [x] **Task 11: Build verification** (AC: 1-9)
  - [x] 11.1 `pnpm type-check` — 0 errors
  - [x] 11.2 `pnpm test` — all tests pass (baseline: 58, expected: ~68+), 0 regressions
  - [x] 11.3 `pnpm build` — succeeds, generates both `/` and `/en/` routes in `dist/`

## Dev Notes

### Architecture Constraints

- **Framework:** Astro 6.0.5 SSG (`output: 'static'`), Svelte 5.53.12 for islands, Tailwind CSS 4.2.1 (CSS-first)
- **i18n approach:** Astro native i18n — NO third-party i18n library needed
- **Routing:** Folder-based. Spanish at root `/`, English under `/en/`. `prefixDefaultLocale: false`
- **Astro 6 breaking change:** `redirectToDefaultLocale` defaults to `false` in Astro 6 (was `true` in v5). Set explicitly to `true` so that `/es/` redirects to `/` (default locale has no prefix).
- **Static output:** `getRelativeLocaleUrl()` from `astro:i18n` works with static builds for URL generation. Import: `import { getRelativeLocaleUrl } from 'astro:i18n';`
- **`Astro.currentLocale`:** Available in all `.astro` files, returns current locale from URL

### LocaleToggle Architecture

- **Type:** Svelte 5 island with `client:load` (must be interactive immediately)
- **Pattern:** FAB (Floating Action Button) — fixed position bottom-right, always visible
- **State:** Stateless — reads `currentLocale` and `currentPath` as props, navigates on click
- **Navigation:** `window.location.href` assignment (changes route; Astro SSG pages are separate HTML files, so full navigation is expected and correct for static output)
- **Positioning:** `fixed bottom-6 right-6 z-[55]` — below MobileMenu overlay (z-[60]) but above normal content (z-50)
- **Stacking with ThemeToggle (story 1.9):** LocaleToggle at `bottom-6 right-6`, ThemeToggle will stack above at `bottom-20 right-6` (coordinate positioning in story 1.9)

### Translations Dictionary Structure

```typescript
// src/lib/i18n/translations.ts
import type { Locale } from './config';

const translations: Record<string, Record<Locale, string>> = {
  // Navigation
  'nav.home': { es: 'Inicio', en: 'Home' },
  'nav.projects': { es: 'Proyectos', en: 'Projects' },
  'nav.experience': { es: 'Experiencia', en: 'Experience' },
  'nav.blog': { es: 'Blog', en: 'Blog' },
  'nav.contact': { es: 'Contacto', en: 'Contact' },

  // Layout
  'banner.welcome': { es: 'Bienvenido a mi Portfolio', en: 'Welcome to my Portfolio' },
  'footer.contact': { es: 'Contacto', en: 'Contact' },
  'skipnav.label': { es: 'Saltar al contenido', en: 'Skip to content' },

  // Aria labels
  'nav.aria': { es: 'Navegación principal', en: 'Main navigation' },
  'mobile.open': { es: 'Abrir menú', en: 'Open menu' },
  'mobile.close': { es: 'Cerrar menú', en: 'Close menu' },
  'locale.switch': { es: 'Cambiar a inglés', en: 'Switch to Spanish' },

  // Meta
  'meta.description': { es: 'Portfolio de Christopher Bobadilla', en: "Christopher Bobadilla's Portfolio" },

  // Social aria
  'social.tiktok': { es: 'Visitar perfil de TikTok', en: 'Visit TikTok profile' },
  'social.github': { es: 'Visitar perfil de GitHub', en: 'Visit GitHub profile' },
  'social.linkedin': { es: 'Visitar perfil de LinkedIn', en: 'Visit LinkedIn profile' },
};

export function t(key: string, locale: Locale): string {
  return translations[key]?.[locale] ?? key;
}

export default translations;
```

### Navigation Data Refactor

```typescript
// src/data/navigation.ts — UPDATED
import type { Locale } from '../lib/i18n/config';

export const navItems = [
  { key: 'home', href: '/', label: { es: 'Inicio', en: 'Home' } },
  { key: 'projects', href: '/projects', label: { es: 'Proyectos', en: 'Projects' } },
  { key: 'experience', href: '/experience', label: { es: 'Experiencia', en: 'Experience' } },
  { key: 'blog', href: '/blog', label: { es: 'Blog', en: 'Blog' } },
  { key: 'contact', href: '/contact', label: { es: 'Contacto', en: 'Contact' } },
] as const;

export type NavKey = (typeof navItems)[number]['key'];

/** Prefix href with /en for English locale */
export function localizeHref(href: string, locale: Locale): string {
  if (locale === 'en') return `/en${href}`;
  return href;
}
```

### Astro Config i18n Block

```javascript
// astro.config.mjs — ADD to defineConfig
i18n: {
  defaultLocale: 'es',
  locales: ['es', 'en'],
  routing: {
    prefixDefaultLocale: false,
    redirectToDefaultLocale: true,
  },
},
```

### Components NOT Modified (Excluded from i18n)

- `src/layouts/AdminLayout.astro` — NO changes. Admin pages are single-language (Spanish only) per architecture. Do NOT add locale prop or translations to AdminLayout.

### Existing Components to Modify

| File | Change | Props Added |
|------|--------|-------------|
| `astro.config.mjs` | Add `i18n` config block | — |
| `src/layouts/BaseLayout.astro` | Dynamic `lang`, pass `locale`, hreflang links, localized description | `locale` derived from `Astro.currentLocale` |
| `src/components/layout/Header.astro` | Accept `locale`, localize nav labels, locale-aware hrefs, localize aria-label | `locale: Locale` |
| `src/components/layout/MobileMenu.svelte` | Accept `locale` prop, localize labels and aria-labels, locale-aware hrefs | `locale: 'es' \| 'en'` |
| `src/components/layout/Banner.astro` | Accept `locale`, use translations for text | `locale: Locale` |
| `src/components/layout/Footer.astro` | Accept `locale`, localize heading and aria-labels | `locale: Locale` |
| `src/components/common/SkipNav.astro` | Accept `locale`, localize link text | `locale: Locale` |
| `src/data/navigation.ts` | Bilingual labels, `localizeHref()` helper | — |

### Props Interface Changes (Before → After)

```typescript
// BaseLayout.astro
// BEFORE:
interface Props { title: string; description?: string; currentPage?: NavKey; }
// AFTER:
interface Props { title: string; description?: string; currentPage?: NavKey; }
// locale is NOT a prop — derived internally: const locale = (Astro.currentLocale ?? 'es') as Locale;

// Header.astro
// BEFORE:
interface Props { currentPage?: NavKey; }
// AFTER:
interface Props { currentPage?: NavKey; locale: Locale; }

// MobileMenu.svelte (Svelte 5 Props — must be serializable for hydration)
// BEFORE:
interface Props { currentPage?: string; }
// AFTER:
interface Props { currentPage?: string; locale: 'es' | 'en'; }
// NOTE: Use string literal union, NOT imported Locale type (Svelte island serialization)

// Banner.astro
// BEFORE: no Props interface (no props)
// AFTER:
interface Props { locale: Locale; }

// Footer.astro
// BEFORE: no Props interface (no props)
// AFTER:
interface Props { locale: Locale; }

// SkipNav.astro
// BEFORE: no Props interface (no props)
// AFTER:
interface Props { locale: Locale; }
```

### Files to Create

| File | Purpose |
|------|---------|
| `src/lib/i18n/config.ts` | Locale type, default locale, `getLocaleFromUrl()` helper |
| `src/lib/i18n/translations.ts` | UI strings dictionary + `t()` helper |
| `src/components/layout/LocaleToggle.svelte` | FAB component for locale switching |
| `src/pages/en/index.astro` | English home page |
| `src/lib/i18n/__tests__/config.test.ts` | Unit tests for locale config |
| `src/lib/i18n/__tests__/translations.test.ts` | Unit tests for translations |
| `src/data/__tests__/navigation.test.ts` | Unit tests for `localizeHref()` |

### Files to Delete

| File | Reason |
|------|--------|
| `src/lib/i18n/.gitkeep` | Replaced by actual files |

### Critical Anti-Patterns to Avoid

- **NEVER** use suffix pattern (`fieldEs`/`fieldEn`) — always nested objects `{ es, en }`
- **NEVER** hardcode locale strings in components — always use `t()` or translations dict
- **NEVER** import from Flutter patterns — Astro native i18n is the approach
- **NEVER** use `next-intl` or other third-party i18n libraries — Astro has built-in support
- **NEVER** create a global Svelte store for locale — use `Astro.currentLocale` (SSG, not SPA)
- **NEVER** use `client:visible` for LocaleToggle — must be `client:load` (immediate interaction). NOTE: The architecture doc says `client:visible` for LanguageToggle — this was corrected here because the toggle must be interactive immediately on page load, not lazily when scrolled into view.

### Locale Type — Reuse Existing Schema

`Locale` type already exists in `src/lib/schemas/shared-schemas.ts`:
```typescript
export const localeSchema = z.enum(['es', 'en']);
export type Locale = z.infer<typeof localeSchema>; // 'es' | 'en'
```

Reuse in `src/lib/i18n/config.ts`:
```typescript
export type { Locale } from '../schemas/shared-schemas';
export { localeSchema } from '../schemas/shared-schemas';
import type { Locale } from '../schemas/shared-schemas';

export const defaultLocale: Locale = 'es';
export const locales: Locale[] = ['es', 'en'];

/** Extract locale from URL path. Returns defaultLocale if no locale prefix found. */
export function getLocaleFromUrl(url: URL): Locale {
  const [, lang] = url.pathname.split('/');
  if ((locales as string[]).includes(lang)) return lang as Locale;
  return defaultLocale;
}
```

### Project Structure Notes

- `src/lib/i18n/` is the designated folder per architecture [Source: architecture.md#Organización-del-proyecto]
- Architecture doc uses `LanguageToggle.svelte` as name — this story uses `LocaleToggle.svelte` (matching epics/UX naming). `LocaleToggle.svelte` is the canonical name. Do NOT create a file named `LanguageToggle.svelte`.
- Tests go in `src/lib/i18n/__tests__/` (co-located pattern) [Source: architecture.md#Testing]
- Navigation data stays in `src/data/navigation.ts` (established in story 1.7)

### Previous Story Intelligence (1.7)

**Patterns to reuse:**
- Props interface with `class?: string` for custom styling
- Svelte 5 Runes: `$state`, `$derived`, `$effect` — though LocaleToggle is mostly stateless
- `client:load` for immediate hydration
- Focus ring: `focus:outline-2 focus:outline-offset-2 focus:outline-primary`
- Touch target: `min-h-11 min-w-11` (44x44px)
- Semantic tokens: `bg-surface`, `border-border`, `text-text-primary`

**Deferred item from 1.7 resolved here:**
- D-1: `lang="es"` hardcoded — now dynamic via `Astro.currentLocale`

**Bug fix from 1.7:**
- Banner currently displays "Welcome to my Portfolio" (English) even on the Spanish page (`lang="es"`). This story fixes this by localizing Banner text: ES → "Bienvenido a mi Portfolio", EN → "Welcome to my Portfolio".

**Hardcoded strings identified in 1.7 to localize:**
- Banner: "Welcome to my Portfolio" (currently English on Spanish page — BUG)
- SkipNav: "Saltar al contenido"
- Footer: "Contact" heading, 3 Spanish aria-labels
- MobileMenu: "Abrir menú" / "Cerrar menú" / "Navegación principal"
- Navigation: English-only labels (Home, Projects, Experience, Blog, Contact)
- BaseLayout: `lang="es"`, Spanish-only description meta

**Code review insights from 1.7:**
- `sharp` dependency already installed for `astro:assets` Image optimization
- Header uses `sticky top-0` (not fixed) — resolved in 1.7 review
- Navigation items shared via `src/data/navigation.ts` (extracted during review)
- `tabindex="-1"` on `<main id="main">` for skip link focus

### Git Intelligence

Recent commits show clean story-by-story progression.
- **Baseline before this story:** 58 tests passing, 0 type errors (37 files), 1 page generated
- **Expected after this story:** ~68+ tests (adding config, translations, navigation tests), 0 type errors, 2 pages generated (`/` and `/en/`)

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Epic-1, Story 1.8]
- [Source: _bmad-output/planning-artifacts/architecture.md#i18n, #Routing, #Organización-del-proyecto]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#FABs-flotantes, #LocaleToggle, #Accessibility]
- [Source: _bmad-output/implementation-artifacts/1-7-layouts-header-footer-y-banner.md#Dev-Notes, #Deferred-Items]
- [Source: Astro i18n docs — https://docs.astro.build/en/guides/internationalization/]
- [Source: Astro i18n API — https://docs.astro.build/en/reference/modules/astro-i18n/]

## Dev Agent Record

### Agent Model Used
Claude Opus 4.6 (1M context)

### Debug Log References
- Astro 6 `redirectToDefaultLocale: true` incompatible con `prefixDefaultLocale: false` — removido de config (no causa loops infinitos sin prefix)
- TypeScript strict null check en `getLocaleFromUrl` — agregado guard `lang &&` antes de `.includes()`

### Completion Notes List
- Configurado Astro i18n nativo con `defaultLocale: 'es'`, `locales: ['es', 'en']`, `prefixDefaultLocale: false`
- Creado módulo `src/lib/i18n/config.ts` con `getLocaleFromUrl()`, reutilizando `Locale` type de `shared-schemas.ts`
- Creado diccionario de traducciones con 16 claves cubriendo nav, layout, aria-labels, meta, social
- Refactorizado `navigation.ts` con labels bilingues `Record<Locale, string>` y helper `localizeHref()`
- `BaseLayout.astro`: `lang` dinámico, `locale` derivado de `Astro.currentLocale`, hreflang alternates, descripción localizada
- Localizados Banner, Footer, SkipNav, Header y MobileMenu con prop `locale` y traducciones `t()`
- Creado `LocaleToggle.svelte` como FAB fixed bottom-right z-[55] con banderas emoji, `client:load`
- Creado `src/pages/en/index.astro` para ruta inglés
- Bug fix: Banner ahora muestra "Bienvenido a mi Portfolio" en ES (era "Welcome to my Portfolio")
- Tests: 111 total (58 baseline + 53 nuevos), 0 regresiones
- Type-check: 0 errores (43 archivos)
- Build: 2 páginas generadas (/ y /en/)
- Lint: 0 errores

### Change Log
- 2026-03-18: Implementación completa de Story 1.8 — i18n foundation, traducciones, LocaleToggle FAB, localización de componentes existentes

### File List
- `astro.config.mjs` — modificado (agregado bloque i18n)
- `src/lib/i18n/config.ts` — creado
- `src/lib/i18n/translations.ts` — creado
- `src/lib/i18n/.gitkeep` — eliminado
- `src/data/navigation.ts` — modificado (labels bilingues, localizeHref)
- `src/layouts/BaseLayout.astro` — modificado (lang dinámico, locale, hreflang, LocaleToggle)
- `src/components/layout/Header.astro` — modificado (locale prop, nav localizado)
- `src/components/layout/MobileMenu.svelte` — modificado (locale prop, labels/aria localizados)
- `src/components/layout/Banner.astro` — modificado (locale prop, texto localizado)
- `src/components/layout/Footer.astro` — modificado (locale prop, heading y aria localizados)
- `src/components/common/SkipNav.astro` — modificado (locale prop, texto localizado)
- `src/components/layout/LocaleToggle.svelte` — creado
- `src/pages/en/index.astro` — creado
- `src/lib/i18n/__tests__/config.test.ts` — creado
- `src/lib/i18n/__tests__/translations.test.ts` — creado
- `src/data/__tests__/navigation.test.ts` — creado
