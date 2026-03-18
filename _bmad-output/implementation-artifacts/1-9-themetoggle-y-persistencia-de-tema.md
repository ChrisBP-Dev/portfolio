# Story 1.9: ThemeToggle y Persistencia de Tema

Status: review

## Story

As a visitor,
I want to toggle between dark and light themes with my preference remembered,
So that I can browse in my preferred visual mode across sessions.

## Acceptance Criteria

1. **AC-1: Dark theme default** — First visit with no stored preference and no OS preference loads dark theme (`<html class="dark">`)
2. **AC-2: ThemeToggle FAB** — Renders fixed bottom-right, stacked above LocaleToggle. Shows sun icon in dark mode (meaning "switch to light"), moon icon in light mode (meaning "switch to dark")
3. **AC-3: Theme switching** — Clicking ThemeToggle toggles `.dark` class on `<html>`, all semantic color tokens update instantly via CSS custom properties
4. **AC-4: Smooth transition** — Theme change includes `transition-colors duration-200` on all elements. If `prefers-reduced-motion: reduce`, transition completes immediately (duration-0)
5. **AC-5: localStorage persistence** — After toggling, preference is stored in `localStorage` key `'theme'` with value `'dark'` or `'light'`. Reopening browser restores the saved preference
6. **AC-6: prefers-color-scheme respect** — First visit with NO stored preference but OS set to `prefers-color-scheme: light` → light theme applied. Stored preference always overrides OS preference
7. **AC-7: Svelte 5 island** — ThemeToggle is a Svelte 5 component hydrated with `client:load`
8. **AC-8: Accessibility** — `aria-label` reads locale-aware text: "Cambiar a modo claro"/"Cambiar a modo oscuro" on ES pages, "Switch to light mode"/"Switch to dark mode" on EN pages
9. **AC-9: FOUC prevention** — Inline `<script>` in `<head>` (before any rendering) reads localStorage/prefers-color-scheme and sets `<html>` class synchronously, preventing flash of wrong theme
**(FR11, FR12 fulfilled)**

## Tasks / Subtasks

- [x] **Task 1: Anti-FOUC inline script** (AC: 1, 5, 6, 9)
  - [x] 1.1 Create `src/components/layout/ThemeScript.astro` containing an inline `<script is:inline>` that runs synchronously in `<head>`
  - [x] 1.2 Script logic: (1) read `localStorage.getItem('theme')`, (2) if stored value exists, use it, (3) else check `window.matchMedia('(prefers-color-scheme: light)').matches`, (4) if OS prefers light → remove `.dark`, (5) else keep `.dark` (default). Also set `document.documentElement.style.colorScheme` to match (`'dark'` or `'light'`) so native browser UI (scrollbars, form controls) matches the theme
  - [x] 1.3 Script must NOT use any imports or modules — pure inline JS for synchronous execution

- [x] **Task 2: Add theme translations** (AC: 8)
  - [x] 2.1 Add to `src/lib/i18n/translations.ts`: `'theme.toLight': { es: 'Cambiar a modo claro', en: 'Switch to light mode' }` and `'theme.toDark': { es: 'Cambiar a modo oscuro', en: 'Switch to dark mode' }`

- [x] **Task 3: Create ThemeToggle.svelte** (AC: 2, 3, 4, 5, 7, 8)
  - [x] 3.1 Create `src/components/layout/ThemeToggle.svelte` — Svelte 5 island
  - [x] 3.2 Props: `currentLocale: 'es' | 'en'` (for localized aria-label)
  - [x] 3.3 State: read initial theme from `document.documentElement.classList.contains('dark')` on mount
  - [x] 3.4 Toggle function: toggle `.dark` class on `document.documentElement`, update `document.documentElement.style.colorScheme`, save to `localStorage.setItem('theme', newTheme)`, update internal state. Guard transition timeout with `clearTimeout` to handle rapid clicks
  - [x] 3.5 Icons: sun icon (`☀️` or SVG) when dark mode active, moon icon (`🌙` or SVG) when light mode active
  - [x] 3.6 `aria-label`: use `t('theme.toLight', currentLocale)` when dark, `t('theme.toDark', currentLocale)` when light — import `t` from translations
  - [x] 3.7 Positioning: `fixed bottom-20 right-6 z-[55]` — stacked directly above LocaleToggle (`bottom-6`)
  - [x] 3.8 Styling: `bg-surface border border-border rounded-full shadow-lg` — same pattern as LocaleToggle
  - [x] 3.9 Touch target: `min-h-11 min-w-11` (44x44px), focus ring `focus:outline-2 focus:outline-offset-2 focus:outline-primary`
  - [x] 3.10 Transition: `active:scale-95 transition-all` on the button itself. The color transition happens via CSS (Task 4)

- [x] **Task 4: Add theme transition CSS and color-scheme** (AC: 4)
  - [x] 4.1 Add `color-scheme` declarations to `src/styles/global.css`: `:root { color-scheme: light; }` and `.dark { color-scheme: dark; }` — ensures native browser UI (scrollbars, form controls, `<select>`, `<input>`) matches the active theme
  - [x] 4.2 Add `.theme-transitioning` rule to `src/styles/global.css` that applies `transition: color 200ms, background-color 200ms, border-color 200ms, box-shadow 200ms` with `!important` to `*, *::before, *::after`
  - [x] 4.3 Use `@media (prefers-reduced-motion: reduce)` to set `transition-duration: 0ms !important`
  - [x] 4.4 Approach: add a temporary class (`theme-transitioning`) to `<html>` during toggle, apply transitions only while that class exists, remove after 200ms with `clearTimeout` guard for rapid clicks. This avoids permanent transitions on every property change during normal interaction

- [x] **Task 5: Integrate in BaseLayout** (AC: 2, 9)
  - [x] 5.1 Import `ThemeScript.astro` and render in `<head>` AFTER `<meta charset="utf-8" />` but BEFORE any stylesheet `<link>` tags to prevent FOUC
  - [x] 5.2 Import `ThemeToggle.svelte` and render after `<LocaleToggle>` with `client:load`
  - [x] 5.3 Pass `currentLocale={locale}` prop to ThemeToggle
  - [x] 5.4 Keep `class="dark"` on `<html>` in the template — the inline script REMOVES it only for light-preference users. Dark is the default state

- [x] **Task 6: Unit tests** (AC: 1-9)
  - [x] 6.1 Create `src/components/layout/__tests__/theme-toggle.test.ts`:
    - Test ThemeToggle module exists and is importable
    - Test that ThemeToggle exports are valid
  - [x] 6.2 Add theme translation keys to `src/lib/i18n/__tests__/translations.test.ts`:
    - Test `t('theme.toLight', 'es')` returns "Cambiar a modo claro"
    - Test `t('theme.toLight', 'en')` returns "Switch to light mode"
    - Test `t('theme.toDark', 'es')` returns "Cambiar a modo oscuro"
    - Test `t('theme.toDark', 'en')` returns "Switch to dark mode"
  - [x] 6.3 Create `src/lib/__tests__/theme-persistence.test.ts`:
    - Test localStorage mock: setting 'dark' → read returns 'dark'
    - Test localStorage mock: setting 'light' → read returns 'light'
    - Test no stored value + no media query → default is 'dark'
    - Test no stored value + prefers-color-scheme: light → theme is 'light'
    - Test stored value overrides OS preference
  - [x] 6.4 Run `pnpm test` and verify all existing tests pass with 0 regressions — contrast/token tests in `src/styles/__tests__/` validate both light and dark themes

- [x] **Task 7: Build verification** (AC: 1-9)
  - [x] 7.1 `pnpm type-check` — 0 errors
  - [x] 7.2 `pnpm test` — all tests pass (baseline: 111, expected: ~120+), 0 regressions
  - [x] 7.3 `pnpm build` — succeeds
  - [x] 7.4 `pnpm lint` — 0 errors

## Dev Notes

### Architecture Constraints

- **Framework:** Astro 6.0.5 SSG (`output: 'static'`), Svelte 5.53.12 for islands, Tailwind CSS 4.2.1 (CSS-first)
- **Dark mode strategy:** Class-based via `@custom-variant dark (&:where(.dark, .dark *))` in `global.css`
- **Token system:** `:root` defines light tokens, `.dark` overrides with dark tokens. Tailwind `@theme inline` bridges CSS variables to utility classes (`bg-background`, `text-text-primary`, etc.)
- **SSG constraint:** Pages are static HTML. Theme must be resolved before first paint via inline script — NO server-side rendering, NO `Astro.cookies`

### Theme Switching Mechanism

The entire theme system is already built (story 1.5). Switching theme = toggling `.dark` class on `<html>`:

```
Dark active:  <html class="dark"> → .dark CSS vars active → all bg-background/text-text-primary use dark values
Light active: <html>              → :root CSS vars active → all bg-background/text-text-primary use light values
```

**NO new CSS variables needed.** All 12 semantic tokens already have both light and dark values in `global.css`. The ThemeToggle only needs to toggle the `.dark` class and persist the choice.

### FOUC Prevention (CRITICAL)

Without an inline script, Astro SSG would serve `<html class="dark">` and then JS would run later, potentially removing `.dark` for users who prefer light — causing a visible flash.

**Solution:** `ThemeScript.astro` renders a synchronous `<script is:inline>` in `<head>`:

```javascript
// ThemeScript.astro — runs BEFORE any CSS/content renders
(function() {
  var d = document.documentElement;
  var stored = localStorage.getItem('theme');
  var isLight = stored === 'light' || (!stored && window.matchMedia('(prefers-color-scheme: light)').matches);
  if (isLight) {
    d.classList.remove('dark');
  }
  d.style.colorScheme = isLight ? 'light' : 'dark';
})();
```

**Key:** `is:inline` in Astro means the script is NOT bundled — it's placed directly in `<head>` and executes synchronously before the browser renders the page.

### ThemeToggle Architecture

- **Type:** Svelte 5 island with `client:load`
- **Pattern:** FAB (Floating Action Button) — same pattern as LocaleToggle
- **State:** Reads from DOM (`document.documentElement.classList.contains('dark')`) on mount. Toggles class and persists to localStorage.
- **NOT a Svelte store** — This is an SSG site with separate HTML per page. Each page load mounts a fresh ThemeToggle island. The inline script ensures the correct class is set before hydration, so the ThemeToggle reads the already-correct state from the DOM.

### FAB Stacking Layout

```
  ┌──────────────────────────────┐
  │                              │
  │          Page content        │
  │                              │
  │                    ┌───┐     │
  │                    │ ☀️│  ← ThemeToggle  (bottom-20 right-6, z-[55])
  │                    └───┘     │
  │                    ┌───┐     │
  │                    │ 🇪🇸│  ← LocaleToggle (bottom-6 right-6, z-[55])
  │                    └───┘     │
  └──────────────────────────────┘
```

- `bottom-20` = 5rem = 80px from bottom (LocaleToggle is 44px tall at bottom-6=24px, gap between them ~12px)
- Both use `z-[55]` — same layer, no overlap. Below MobileMenu overlay (`z-[60]`)

### Svelte 5 Component Pattern (from LocaleToggle)

```svelte
<script lang="ts">
  import { t } from '../../lib/i18n/translations';

  interface Props {
    currentLocale: 'es' | 'en';
  }

  let { currentLocale }: Props = $props();

  let isDark = $state(true); // Will be set correctly on mount

  // Read actual theme from DOM on mount
  $effect(() => {
    isDark = document.documentElement.classList.contains('dark');
  });

  const ariaLabel = $derived(
    isDark ? t('theme.toLight', currentLocale) : t('theme.toDark', currentLocale)
  );

  const icon = $derived(isDark ? '☀️' : '🌙');

  let transitionTimer: ReturnType<typeof setTimeout>;

  function toggleTheme() {
    clearTimeout(transitionTimer);
    document.documentElement.classList.add('theme-transitioning');

    isDark = !isDark;
    document.documentElement.classList.toggle('dark', isDark);
    document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');

    transitionTimer = setTimeout(() => {
      document.documentElement.classList.remove('theme-transitioning');
    }, 200);
  }
</script>
```

**Note on `$effect`:** The `$effect` runs once after mount and reads the DOM state set by the inline script. This ensures the island starts in sync with the actual theme.

**Note on SSG navigation:** Every page load in this SSG site is a full HTML reload. The ThemeScript inline runs again on each navigation, reading localStorage. State continuity between pages is automatic — no Svelte store or cross-page sync needed.

### Theme Transition Approach

To avoid all CSS transitions firing on every interaction (e.g., hover states use `transition-all`), use a temporary class approach:

```javascript
let transitionTimer: ReturnType<typeof setTimeout>;

function toggleTheme() {
  clearTimeout(transitionTimer);
  document.documentElement.classList.add('theme-transitioning');

  isDark = !isDark;
  document.documentElement.classList.toggle('dark', isDark);
  document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
  localStorage.setItem('theme', isDark ? 'dark' : 'light');

  transitionTimer = setTimeout(() => {
    document.documentElement.classList.remove('theme-transitioning');
  }, 200);
}
```

CSS in `global.css` — add both `color-scheme` and transition rules:
```css
/* color-scheme — tells browser native UI (scrollbars, form controls) to match theme */
:root { color-scheme: light; }
.dark { color-scheme: dark; }

/* Theme transition — only active during toggle */
.theme-transitioning,
.theme-transitioning *,
.theme-transitioning *::before,
.theme-transitioning *::after {
  transition: color 200ms ease, background-color 200ms ease, border-color 200ms ease, box-shadow 200ms ease !important;
}

@media (prefers-reduced-motion: reduce) {
  .theme-transitioning,
  .theme-transitioning *,
  .theme-transitioning *::before,
  .theme-transitioning *::after {
    transition-duration: 0ms !important;
  }
}
```

### Translations to Add

Add 2 keys to `src/lib/i18n/translations.ts`:

```typescript
// Theme toggle aria
'theme.toLight': { es: 'Cambiar a modo claro', en: 'Switch to light mode' },
'theme.toDark': { es: 'Cambiar a modo oscuro', en: 'Switch to dark mode' },
```

### BaseLayout Changes

```astro
<!-- BEFORE (head): -->
<html lang={locale} class="dark">
  <head>
    <meta charset="utf-8" />
    ...
  </head>

<!-- AFTER (head): -->
<html lang={locale} class="dark">
  <head>
    <meta charset="utf-8" />
    <ThemeScript />  <!-- AFTER charset, BEFORE any stylesheet links -->
    ...
  </head>

<!-- BEFORE (body end): -->
    <LocaleToggle client:load currentLocale={locale} currentPath={Astro.url.pathname} />
  </body>

<!-- AFTER (body end): -->
    <ThemeToggle client:load currentLocale={locale} />
    <LocaleToggle client:load currentLocale={locale} currentPath={Astro.url.pathname} />
  </body>
```

**Important:** Keep `class="dark"` on `<html>` in the template. The inline script REMOVES it for light users. This means the static HTML always starts dark (correct for default), and the script adjusts before rendering.

### AdminLayout — NO Changes

`AdminLayout.astro` is single-language Spanish-only per architecture. Admin pages always use dark theme. Do NOT add ThemeScript, ThemeToggle, or any theme switching to AdminLayout.

### Files to Create

| File | Purpose |
|------|---------|
| `src/components/layout/ThemeScript.astro` | Inline FOUC-prevention script for `<head>` |
| `src/components/layout/ThemeToggle.svelte` | FAB component for theme switching |
| `src/components/layout/__tests__/theme-toggle.test.ts` | Module importability tests |
| `src/lib/__tests__/theme-persistence.test.ts` | Theme logic tests (localStorage, prefers-color-scheme) |

### Files to Modify

| File | Change |
|------|--------|
| `src/lib/i18n/translations.ts` | Add `theme.toLight` and `theme.toDark` keys |
| `src/styles/global.css` | Add `color-scheme` declarations + `.theme-transitioning` transition rules |
| `src/layouts/BaseLayout.astro` | Import ThemeScript + ThemeToggle, add to layout |

### Critical Anti-Patterns to Avoid

- **NEVER** use a Svelte store for theme state — SSG pages are independent HTML files, stores don't persist across navigation
- **NEVER** use `client:visible` for ThemeToggle — must be `client:load` for immediate interaction
- **NEVER** remove `class="dark"` from the HTML template — the inline script needs it as the starting state
- **NEVER** use `Astro.cookies` or server-side theme detection — this is a static site
- **NEVER** add permanent `transition-colors` to body/html — it would make ALL state changes animated (hover, focus, etc.). Use the temporary class approach
- **NEVER** use `document.write()` or `<noscript>` for theme — the inline script approach is cleaner and correct
- **NEVER** import the ThemeScript as a module — `is:inline` is required for synchronous execution

### Project Structure Notes

- ThemeToggle lives in `src/components/layout/` alongside LocaleToggle [Source: architecture.md#Organización-del-proyecto]
- Architecture doc names it `ThemeToggle.svelte` — use this exact name [Source: architecture.md line 913]
- Tests go co-located: `src/components/layout/__tests__/` and `src/lib/__tests__/`
- The `global.css` file owns all theme token definitions — transition rules go here too

### Previous Story Intelligence (1.8)

**Patterns established to reuse:**
- Svelte 5 Props pattern: `interface Props { ... }` + `let { ... }: Props = $props()`
- `$derived()` for computed values (aria-label, icon)
- FAB styling: `bg-surface border border-border rounded-full shadow-lg hover:shadow-xl active:scale-95 transition-all`
- Focus ring: `focus:outline-2 focus:outline-offset-2 focus:outline-primary`
- Touch target: `min-h-11 min-w-11`
- Import translations: `import { t } from '../../lib/i18n/translations'`
- `client:load` for immediate hydration
- Use `'es' | 'en'` string literal union in Svelte props (NOT imported `Locale` type — serialization)

**Code review learnings from 1.8:**
- Always use `t()` for aria-labels — don't hardcode strings even when it seems simpler
- The `site` property in `astro.config.mjs` is already set (`https://portfolio-chrisbp.web.app`) — no changes needed

**Deferred item from 1.8:**
- D-1: EN navigation links (404s) — by design, pages created in Epic 2. No action for 1.9.

### Git Intelligence

Recent commits show clean story-by-story progression:
- `b9390f3` docs: mark story 1.8 done
- `269d8b8` fix: use absolute URLs for hreflang
- `ccf6ae9` feat: implement story 1.8 — i18n foundation and LocaleToggle

**Current baseline:**
- Tests: 111 passing (8 test files)
- Type-check: 0 errors (43 files)
- Build: 2 pages generated (/ and /en/)
- Lint: 0 errors

**Expected after this story:**
- Tests: ~120+ (111 baseline + ~10 new theme tests)
- Type-check: 0 errors
- Build: 2 pages (unchanged)
- Lint: 0 errors

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Epic-1, Story 1.9, lines 400-416]
- [Source: _bmad-output/planning-artifacts/architecture.md#Theme, line 88]
- [Source: _bmad-output/planning-artifacts/architecture.md#Organización-del-proyecto, line 913]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#FABs-flotantes, lines 458-461]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#ThemeToggle, line 708]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Accessibility, lines 970-971]
- [Source: _bmad-output/planning-artifacts/prd.md#FR11-FR12, lines 335-336]
- [Source: _bmad-output/implementation-artifacts/1-8-i18n-foundation-y-localetoggle.md#LocaleToggle-Architecture]
- [Source: src/styles/global.css — existing theme tokens and dark mode variant]

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (1M context)

### Debug Log References

- Lint fix: ThemeScript.astro usaba `var` (ESLint `no-var`) → cambiado a `const`
- Lint fix: ThemeToggle.svelte usaba `$state` + `$effect` → refactorizado a `$state` + `onMount` para cumplir `svelte/prefer-writable-derived`
- Lint fix: ThemeToggle.svelte usaba globals sin prefijo (`setTimeout`, `localStorage`) → prefijados con `window.`

### Completion Notes List

- ✅ ThemeScript.astro: script inline síncrono en `<head>` previene FOUC. Lee localStorage → prefers-color-scheme → default dark
- ✅ ThemeToggle.svelte: FAB Svelte 5 con `client:load`, posicionado `bottom-20 right-6` encima de LocaleToggle
- ✅ Traducciones: 2 keys agregadas (`theme.toLight`, `theme.toDark`) con valores ES/EN
- ✅ CSS: `color-scheme` declaraciones + `.theme-transitioning` con transición temporal 200ms + `prefers-reduced-motion: reduce`
- ✅ BaseLayout: ThemeScript en `<head>` después de charset, ThemeToggle antes de LocaleToggle en body
- ✅ Tests: 128 pasando (17 nuevos), 0 regresiones. 3 archivos de test (theme-toggle, translations, theme-persistence)
- ✅ Build: 2 páginas, type-check 0 errores, lint 0 errores

### File List

**Creados:**
- `src/components/layout/ThemeScript.astro`
- `src/components/layout/ThemeToggle.svelte`
- `src/components/layout/__tests__/theme-toggle.test.ts`
- `src/lib/__tests__/theme-persistence.test.ts`

**Modificados:**
- `src/lib/i18n/translations.ts`
- `src/styles/global.css`
- `src/layouts/BaseLayout.astro`
- `src/lib/i18n/__tests__/translations.test.ts`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`

### Change Log

- 2026-03-18: Implementación completa de Story 1.9 — ThemeToggle y persistencia de tema (AC 1-9 satisfechos)
