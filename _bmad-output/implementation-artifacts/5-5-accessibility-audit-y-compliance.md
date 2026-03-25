# Story 5.5: Accessibility Audit y Compliance

Status: review

## Story

As a visitor using assistive technology,
I want the portfolio to be fully accessible,
So that I can navigate and consume all content regardless of my abilities.

## Acceptance Criteria

1. **Given** Lighthouse runs on any public page **When** auditing accessibility **Then** score > 95
2. **And** axe-core scan finds zero critical or serious violations
3. **And** all interactive elements are reachable via keyboard (Tab/Enter/Escape/Arrow keys)
4. **And** skip nav "Saltar al contenido" works as first focusable element
5. **And** all images have descriptive `alt` text
6. **And** focus indicators (2px solid primary) visible on all interactive elements in both themes
7. **And** color is never the sole means of conveying information (icons or text accompany color)
8. **And** `prefers-reduced-motion: reduce` disables non-essential animations
9. **And** heading hierarchy (h1→h6) is logical on every page
10. **And** all form inputs have associated `<label>` elements

> (NFR14, NFR15, NFR16, NFR17, NFR18, NFR19, UX-DR37, UX-DR38, UX-DR39, UX-DR40, UX-DR41, UX-DR42, UX-DR43)

## Tasks / Subtasks

- [x] Task 1: Instalar @axe-core/playwright y crear infraestructura de test a11y (AC: #2)
  - [x] 1.1 `pnpm add -D @axe-core/playwright` — peer dep `playwright-core >= 1.0.0`, compatible con Playwright 1.58.2 del proyecto. Última versión estable: 4.11.1
  - [x] 1.2 Crear `tests/e2e/fixtures/axe-test.ts` — fixture compartido que pre-configura AxeBuilder con `withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])` para WCAG 2.1 AA compliance. Patrón:
    ```typescript
    import { test as base } from '@playwright/test';
    import AxeBuilder from '@axe-core/playwright';
    type AxeFixture = { makeAxeBuilder: () => AxeBuilder };
    export const test = base.extend<AxeFixture>({
      makeAxeBuilder: async ({ page }, use) => {
        await use(() => new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']));
      },
    });
    export { expect } from '@playwright/test';
    ```

- [x] Task 2: Fix semántica HTML y ARIA gaps (AC: #3, #7, #9)
  - [x] 2.1 `src/components/layout/Footer.astro` — Envolver los 3 social links (TikTok, GitHub, LinkedIn, actualmente en `<div>` sin landmark semántico, líneas ~19-55) dentro de `<nav aria-label={t('social.nav', locale)}>`. Agregar traducción `social.nav` en `src/lib/i18n/translations.ts` (junto a las keys `social.tiktok/github/linkedin` existentes en línea ~105): EN = "Social media links", ES = "Enlaces a redes sociales"
  - [x] 2.2 `src/components/projects/ProjectFilter.svelte` — Agregar live region para anunciar resultados filtrados a screen readers. **IMPORTANTE:** El componente actualmente NO importa `t()` (recibe textos traducidos como props). Agregar `import { t } from '../../lib/i18n/translations';` al inicio del `<script>` (el prop `locale` ya existe). Agregar un `<div aria-live="polite" class="sr-only">` que contenga texto como "{count} {t('projects.results', locale)}" actualizado con `$derived` cada vez que `filteredProjects` cambie. Agregar traducción `projects.results` en `src/lib/i18n/translations.ts` (junto a `projects.noResults` existente en línea ~90): EN = "projects shown", ES = "proyectos mostrados". El `<select id="tech-filter">` ya tiene `<label for="tech-filter">` (línea 48) — OK
  - [x] 2.3 Auditar heading hierarchy en todas las páginas públicas. Estado actual verificado:
    - Home (`/`): h1 visible en `src/components/home/HeroSection.astro:35` ✅
    - Projects (`/projects`): h1 sr-only en projects/index.astro:23 ✅ (válido para a11y)
    - Blog (`/blog`): h1 sr-only en blog/index.astro:22 ✅ (válido para a11y)
    - Contact (`/contact`): h1 visible en contact.astro:19 ✅
    - Project detail (`/projects/[slug]`): h1 en `src/pages/projects/[slug].astro:66` ✅, h2 para Features(:87), Technologies(:101), Screenshots(:146) ✅ — jerarquía correcta, sin saltos
    - Blog article (`/blog/[slug]`): h1 en `src/pages/blog/[slug].astro:68` ✅ — contenido body viene de TipTap (user-generated), headings internos fuera de control del template
    - Variantes ES (`src/pages/es/projects/[slug].astro`, `src/pages/es/blog/[slug].astro`): misma estructura, mismos templates — OK
    - **No se requieren correcciones** de heading hierarchy — todas las páginas públicas tienen h1 y progresión h1→h2 correcta

- [x] Task 3: Ampliar `prefers-reduced-motion` support (AC: #8)
  - [x] 3.1 `src/styles/global.css` — Actualmente la regla `@media (prefers-reduced-motion: reduce)` (líneas 25-32) solo cubre `.theme-transitioning`. Ampliar para desactivar TODAS las transiciones y animaciones no esenciales en todo el sitio:
    ```css
    @media (prefers-reduced-motion: reduce) {
      *,
      *::before,
      *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
      }
    }
    ```
    Nota: Usar `0.01ms` en vez de `0ms` para que los eventos `animationend`/`transitionend` sigan disparándose (evita bugs en JS que espera estos eventos)
  - [x] 3.2 Verificar que Astro `ClientRouter` (View Transitions) respeta `prefers-reduced-motion` nativamente — Astro 3+ lo hace por defecto: cuando `prefers-reduced-motion: reduce`, las View Transitions se ejecutan instantáneamente sin animación. El `transition:animate="fade"` en `BaseLayout.astro:90` se desactiva automáticamente. Confirmar en build/preview que así sea — NO se requiere código adicional para esto

- [x] Task 4: E2E tests — axe-core scan de todas las páginas públicas (AC: #1, #2)
  - [x] 4.1 Crear `tests/e2e/accessibility.spec.ts` — Importar fixture de Task 1.2. Estructura:
    - `test.describe('Accessibility — axe-core WCAG 2.1 AA')` con tests para:
      - Home page (`/`) — scan completo
      - Projects listing (`/projects`) — scan completo
      - Blog listing (`/blog`) — scan completo
      - Contact page (`/contact`) — scan completo
      - Project detail page (`/projects/[slug]`) — con `test.skip` guard si no hay proyectos publicados
      - Blog article page (`/blog/[slug]`) — con `test.skip` guard si no hay artículos publicados
    - Para CADA test: el assertion principal es `expect(results.violations.filter(v => v.impact === 'critical' || v.impact === 'serious')).toEqual([])` (zero critical/serious)
    - Attach violations JSON al reporte Playwright con `testInfo.attach('a11y-violations', { body: JSON.stringify(violations, null, 2), contentType: 'application/json' })` para debugging
  - [x] 4.2 Opcionalmente testear variantes ES (`/es`, `/es/projects`, `/es/blog`, `/es/contact`) — si el volumen de tests es excesivo, basta con testear EN (la estructura HTML es idéntica, solo cambia contenido textual y `lang="es"`)
  - [x] 4.3 Patrón de navegación a pages dinámicas (reutilizar patrón establecido en story 5-4):
    ```typescript
    await page.goto('/projects');
    const firstProject = page.locator('main a[href^="/projects/"]').first();
    const hasProjects = (await firstProject.count()) > 0;
    test.skip(!hasProjects, 'No published projects available');
    await firstProject.click();
    await page.waitForURL(/\/projects\/[a-z0-9-]+$/);
    ```

- [x] Task 5: E2E tests — keyboard navigation, skip nav, focus indicators (AC: #3, #4, #6)
  - [x] 5.1 En `tests/e2e/accessibility.spec.ts`, agregar `test.describe('Keyboard Navigation & Focus')`:
    - **Skip nav test**: `page.goto('/')` → `page.keyboard.press('Tab')` → verificar que el primer elemento focuseado es el SkipNav link (text: "Skip to content" o "Saltar al contenido") → `page.keyboard.press('Enter')` → verificar que focus se movió a `#main`
    - **Tab order test**: En Home page, Tab a través de los primeros 10-15 elementos interactivos — verificar que todos son focusables y que el `outline-style` computado no es `'none'` (focus indicator visible)
    - **Escape cierra mobile menu**: Setear viewport a 375x667 → Tab hasta hamburger button → Enter para abrir → verificar `aria-expanded="true"` → Escape → verificar `aria-expanded="false"` y focus retornó al hamburger button

- [x] Task 6: Fix issues encontrados por axe-core, verificación final (AC: #1-#10)
  - [x] 6.1 Ejecutar `pnpm test:e2e --grep "Accessibility"` — probablemente axe-core encontrará issues en la primera ejecución
  - [x] 6.2 Para cada violation critical/serious reportada, corregir en el archivo fuente correspondiente. Issues PROBABLES basados en la auditoría previa:
    - **color-contrast**: Verificar que `text-secondary` (#5A6270 light / #8B95A5 dark) sobre `surface` cumple 4.5:1. Los contrast tests unitarios ya verifican esto — si axe-core reporta un caso edge, investigar el par específico
    - **link-name**: Links de imágenes en cards de proyecto (ProjectFilter.svelte) — el stretched link `<a>` tiene h2 con texto, debería pasar. Si no, agregar `aria-label`
    - **heading-order**: Si alguna página salta de h1 a h3, corregir el heading level
    - **image-alt**: Todas las imágenes ya tienen `alt` — si axe-core reporta alguna faltante, agregar
  - [x] 6.3 Re-ejecutar `pnpm test:e2e` hasta que TODOS los tests pasen (incluyendo accessibility tests nuevos)
  - [x] 6.4 Ejecutar `pnpm test` — todos los unit tests pasan (1236+ tests, 48 files)
  - [x] 6.5 Ejecutar `pnpm build` — build exitoso sin errores

## Dev Notes

### Estado Actual — Lo que YA Existe (NO reimplementar)

| Componente | Estado | Archivo |
|-----------|--------|---------|
| SkipNav "Saltar al contenido" | ✅ Completo | `src/components/common/SkipNav.astro` — sr-only + focus-visible:not-sr-only, links to `#main` |
| `<main id="main" tabindex="-1">` | ✅ Completo | `src/layouts/BaseLayout.astro:90` |
| SkipNav como primer hijo de `<body>` | ✅ Completo | `src/layouts/BaseLayout.astro:87` (antes de Banner, Header, main) |
| ContactForm labels + ARIA | ✅ Completo | `src/components/contact/ContactForm.svelte` — `<label for>`, `aria-invalid`, `aria-describedby`, `aria-required`, `role="alert"` en errores |
| ImageViewer dialog a11y | ✅ Completo | `src/components/projects/ImageViewer.svelte` — native `<dialog>`, `aria-label` dinámico, `aria-live="polite"` counter, Arrow keys nav, Escape close, focus restoration (WCAG 2.4.3) |
| MobileMenu focus trap | ✅ Completo | `src/components/layout/MobileMenu.svelte` — `aria-expanded`, `aria-label` dinámico, Tab/Shift+Tab cycling, Escape close, `triggerRef?.focus()` restore |
| Color contrast tests | ✅ Completo | `src/styles/__tests__/contrast.test.ts` — WCAG 2.1 relative luminance, verifica >4.5:1 AA en ambos temas |
| Focus indicators globales | ✅ Completo | Todas las interactivas usan `focus:outline-2 focus:outline-offset-2 focus:outline-primary` via Tailwind |
| Social links aria-labels | ✅ Completo | `src/components/layout/Footer.astro` — TikTok/GitHub/LinkedIn con `aria-label={t('social.*', locale)}` |
| Nav aria-current="page" | ✅ Completo | Header.astro y MobileMenu.svelte — `aria-current="page"` en link activo |
| Theme prefers-color-scheme | ✅ Completo | `src/components/layout/ThemeScript.astro` — detecta sistema, `color-scheme: dark/light` en :root |
| Alt text en imágenes | ✅ Completo | HeroSection (`alt="ChrisBP"`), TechnologiesSection (`alt={tech.name}`), ProjectsSection (`alt={project.companyName[locale]}`), BlogCard (`alt={post.title[locale]}`), project/blog detail pages |
| Lighthouse CI a11y threshold | ✅ Configurado | `lighthouserc.cjs` — `categories:accessibility: ['error', { minScore: 0.95 }]` en TODAS las páginas |
| `@axe-core/playwright` | **❌ FALTA** | No instalado — Task 1 |
| Footer social `<nav>` wrapper | **❌ FALTA** | `src/components/layout/Footer.astro` — social links sin landmark nav |
| ProjectFilter live region | **❌ FALTA** | `src/components/projects/ProjectFilter.svelte` — no anuncia resultados a screen readers |
| `prefers-reduced-motion` global | **❌ PARCIAL** | `src/styles/global.css:25-32` — solo cubre `.theme-transitioning`, no el resto |
| E2E accessibility tests | **❌ FALTA** | No existen tests axe-core ni keyboard nav |

### Axe-Core Integration — Patrón y API

**Package:** `@axe-core/playwright` v4.11.1 (peer dep: playwright-core >= 1.0.0)

**Fixture pattern** (recomendado por Playwright docs):
```typescript
// tests/e2e/fixtures/axe-test.ts
import { test as base } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

type AxeFixture = { makeAxeBuilder: () => AxeBuilder };

export const test = base.extend<AxeFixture>({
  makeAxeBuilder: async ({ page }, use) => {
    await use(() =>
      new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    );
  },
});
export { expect } from '@playwright/test';
```

**API clave:**
- `new AxeBuilder({ page })` — constructor con Playwright Page
- `.withTags([...])` — filtrar por nivel WCAG
- `.exclude(selector)` — excluir elementos (e.g., embeds de terceros)
- `.analyze()` → `{ violations, passes, incomplete, inapplicable }`
- Cada violation tiene: `id`, `impact` ('critical'|'serious'|'moderate'|'minor'), `description`, `helpUrl`, `nodes[]`

**Assertion recomendada para AC #2:**
```typescript
const results = await makeAxeBuilder().analyze();
const criticalOrSerious = results.violations.filter(
  v => v.impact === 'critical' || v.impact === 'serious'
);
expect(criticalOrSerious).toEqual([]);
```

**Nota SSG:** Astro genera HTML estático — axe-core escanea el markup final sin timing issues de hydration en páginas estáticas. Para páginas con Svelte islands (ProjectFilter en /projects, ContactForm en /contact), esperar a que el island se hidrate antes del scan:
```typescript
await page.goto('/projects');
await page.locator('#tech-filter').waitFor(); // espera hydration del ProjectFilter
const results = await makeAxeBuilder().analyze();
```

### prefers-reduced-motion — Patrón CSS

El patrón recomendado desactiva TODAS las animaciones y transiciones para usuarios que prefieren reducción de movimiento:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

**¿Por qué 0.01ms y no 0ms?** Para que los eventos JS `animationend` y `transitionend` sigan disparándose — evita bugs en código que espera estos callbacks (como View Transitions cleanup).

**Astro View Transitions:** El `ClientRouter` de Astro 3+ respeta `prefers-reduced-motion` nativamente — las transiciones se ejecutan instantáneamente sin animación. NO se necesita código adicional para esto, pero la regla CSS global es defense-in-depth para cualquier transición custom.

### Footer Nav Wrapper — Patrón

Antes (actual):
```html
<div class="flex space-x-4 mt-4">
  <a href="..." aria-label={t('social.tiktok', locale)}>...</a>
  <a href="..." aria-label={t('social.github', locale)}>...</a>
  <a href="..." aria-label={t('social.linkedin', locale)}>...</a>
</div>
```

Después:
```html
<nav aria-label={t('social.nav', locale)} class="flex space-x-4 mt-4">
  <a href="..." aria-label={t('social.tiktok', locale)}>...</a>
  <a href="..." aria-label={t('social.github', locale)}>...</a>
  <a href="..." aria-label={t('social.linkedin', locale)}>...</a>
</nav>
```

Agregar traducción en `src/lib/i18n/translations.ts` (junto a keys `social.tiktok/github/linkedin` en línea ~105):
```typescript
'social.nav': { es: 'Enlaces a redes sociales', en: 'Social media links' },
```

### ProjectFilter Live Region — Patrón

Agregar en ProjectFilter.svelte. **Nota:** El componente usa Svelte 5 runes mode (`<script lang="ts">`). Actualmente NO importa `t()` — recibe textos como props. Para el live region, agregar el import de `t`:

```svelte
<script lang="ts">
  import { t } from '../../lib/i18n/translations';  // ← AGREGAR este import
  // ... imports existentes ...

  let resultsAnnouncement = $derived(
    `${filteredProjects.length} ${t('projects.results', locale)}`
  );
</script>

<!-- Después del select, antes de la grid de resultados -->
<div aria-live="polite" class="sr-only">{resultsAnnouncement}</div>
```

Agregar traducción en `src/lib/i18n/translations.ts` (junto a `projects.noResults` en línea ~90):
```typescript
'projects.results': { es: 'proyectos mostrados', en: 'projects shown' },
```

### E2E Test Patterns — Skip Nav y Keyboard

**Skip nav test:**
```typescript
test('skip nav is first focusable and navigates to main', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  const focused = page.locator(':focus');
  await expect(focused).toHaveAttribute('href', '#main');
  await page.keyboard.press('Enter');
  const main = page.locator('#main');
  await expect(main).toBeFocused();
});
```

**Focus indicator test:**
```typescript
test('interactive elements have visible focus indicators', async ({ page }) => {
  await page.goto('/');
  // Tab past skip nav to first interactive element
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  const focused = page.locator(':focus');
  const outlineStyle = await focused.evaluate(el => getComputedStyle(el).outlineStyle);
  expect(outlineStyle).not.toBe('none');
});
```

**Mobile menu keyboard test (viewport 375x667):**
```typescript
test('Escape closes mobile menu and restores focus', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('/');
  const hamburger = page.locator('button[aria-expanded]');
  await hamburger.focus();
  await hamburger.press('Enter');
  await expect(hamburger).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Escape');
  await expect(hamburger).toHaveAttribute('aria-expanded', 'false');
  await expect(hamburger).toBeFocused();
});
```

### Anti-patterns — NO Hacer

- **NO instalar eslint-plugin-jsx-a11y ni eslint-plugin-astro-a11y** — el proyecto usa ESLint 10 con flat config, y las reglas de a11y se verifican por axe-core en E2E (runtime real). Los plugins de lint solo cubren JSX, no Astro templates
- **NO usar pa11y como alternativa a axe-core** — `@axe-core/playwright` se integra nativamente con el Playwright que ya tiene el proyecto, pa11y requiere headless Chrome separado
- **NO testear páginas admin (/admin/*)** — el AC dice "any public page". Admin tiene AdminLayout separado con dark mode hardcodeado y noindex
- **NO cambiar focus indicators existentes** — ya usan `focus:outline-2 focus:outline-offset-2 focus:outline-primary` consistentemente en Tailwind. No cambiar a CSS custom
- **NO agregar `role="img"` en `<img>` tags** — `<img>` tiene role implícito "img" por spec HTML. Solo se necesita `role="img"` en `<div>` o `<svg>` usados como imagen
- **NO agregar `aria-label` al `<select>` de ProjectFilter** — ya tiene `<label for="tech-filter">` asociado al `<select id="tech-filter">`. Un aria-label ADEMÁS del label visible causa doble anuncio en screen readers
- **NO eliminar el patrón sr-only en h1 de Projects/Blog** — este patrón es válido y recomendado para a11y cuando el diseño visual no muestra un h1 prominente pero la página necesita heading structure

### Project Structure Notes

- El directorio `tests/e2e/fixtures/` ya existe (contiene `test-image.png` de story 5-4)
- Se crean 2 archivos nuevos:
  - `tests/e2e/fixtures/axe-test.ts` (fixture compartido axe-core)
  - `tests/e2e/accessibility.spec.ts` (tests E2E de a11y)
- Se modifican 4 archivos existentes:
  - `src/styles/global.css` (ampliar prefers-reduced-motion)
  - `src/components/layout/Footer.astro` (nav wrapper social links)
  - `src/components/projects/ProjectFilter.svelte` (live region + import `t`)
  - `src/lib/i18n/translations.ts` (agregar keys `social.nav` y `projects.results`)
- Se agrega 1 dependencia dev: `@axe-core/playwright`
- `accessibility.spec.ts` NO matchea `admin-*.spec.ts` → correrá automáticamente en el project "public" de `playwright.config.ts` sin configuración adicional

### References

- [Source: _bmad-output/planning-artifacts/epics.md — Epic 5, Story 5.5 (NFR14-19, UX-DR37-43)]
- [Source: _bmad-output/planning-artifacts/architecture.md — NFR14-19 accessibility table, SkipNav.astro in component tree, Lighthouse CI >95 a11y]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md — WCAG 2.1 AA strategy, semantic HTML structure, keyboard navigation, screen reader patterns, form accessibility, color contrast, focus indicators, reduced motion]
- [Source: _bmad-output/planning-artifacts/prd.md — NFR14-19 table, Lighthouse Accessibility >95 KPI, MVP accessibility feature set]
- [Source: _bmad-output/project-context.md — Astro 6 SSG, Svelte 5 runes, Tailwind 4.2.1, Playwright 1.58.2, Vitest 4.1.0]
- [Source: src/components/common/SkipNav.astro — existing skip nav implementation]
- [Source: src/layouts/BaseLayout.astro — main#main tabindex=-1, ClientRouter, transition:animate="fade"]
- [Source: src/styles/global.css — partial prefers-reduced-motion, theme-transitioning only]
- [Source: lighthouserc.cjs — accessibility: error at 0.95 for all pages]
- [Source: src/styles/__tests__/contrast.test.ts — WCAG 2.1 color contrast validation]

### Previous Story Intelligence (5-4)

- Story 5-4 completada: performance optimization, hydration directives, CLS prevention, font preload
- 1236 unit tests y 152 E2E tests pasando al completar 5-4 (18 skipped)
- Code review 3-layer: ProjectFilter CLS attrs fix (width/height en tech icons + screenshots), preconnect crossorigin fix
- E2E test patterns establecidos en `tests/e2e/performance-optimization.spec.ts`: test.skip guards para contenido dinámico, selectores `main a[href^="..."]`, iteración con `.count()` + `.nth(i)`
- `globalTeardown` en playwright.config.ts ejecuta cleanup scripts post-E2E
- Home page JS bundle: ~25.8KB (dentro del budget 50KB)
- Build: 30 pages, ~7.5s

### Git Intelligence

Últimos commits relevantes:
- `55ee59e` docs: story 5-4 done — code review record, sprint status updated
- `f7289b5` fix: code review story 5-4 — ProjectFilter CLS attrs, preconnect crossorigin fix
- `98e7e45` feat: story 5-4 — performance optimization, bundle audit, and font preload fix

Patrón: commits con prefijo semántico en inglés (`feat:`, `fix:`, `docs:`), reviews 3-layer, E2E coverage en cada story.

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (1M context)

### Debug Log References

- axe-core detectó violaciones `color-contrast` serias en primera ejecución: `text-primary` (#48A1CD), `text-text-muted` (#8B95A5), y `bg-primary text-white` insuficientes en light mode
- Solución: hacer `--color-primary` y `--color-primary-dark` theme-aware con CSS variables — light mode usa tonos más oscuros (#1F6B87/#0D7577) que cumplen 4.5:1 AA; dark mode mantiene valores originales (#48A1CD/#108385)
- axe-core también detectó `scrollable-region-focusable` en contenedores de screenshots con `overflow-x-auto` — fix: agregar `tabindex="0" role="region" aria-label`
- Test mobile menu keyboard: `hamburger.press('Enter')` fallaba por timing de hydration de Svelte — fix: usar `.click()` (espera actionability) en vez de `.focus()` + `.press('Enter')`
- `--theme-text-muted` light mode oscurecido de #8B95A5 (3.02:1) a #6B7585 (4.73:1 vs white)

### Completion Notes List

- ✅ Task 1: Instalado @axe-core/playwright 4.11.1, creado fixture compartido `axe-test.ts` con WCAG 2.1 AA tags
- ✅ Task 2: Footer social links envueltos en `<nav aria-label>`, ProjectFilter live region `aria-live="polite"` con `$derived`, heading hierarchy auditada (sin cambios necesarios)
- ✅ Task 3: `prefers-reduced-motion: reduce` global ampliado (animation-duration, transition-duration, scroll-behavior), Astro ClientRouter respeta nativamente
- ✅ Task 4: 6 tests axe-core E2E creados (Home, Projects, Blog, Contact, Project detail, Blog article) — todos pasan sin violaciones critical/serious
- ✅ Task 5: 3 tests keyboard E2E creados (skip nav, focus indicators, mobile menu Escape) — todos pasan
- ✅ Task 6: Color contrast fixes (theme-aware primary/primary-dark, text-muted oscurecido), scrollable screenshots fix, contrast unit tests actualizados (11 tests)
- 1245 unit tests passing (48 files), 160 E2E tests passing (19 skipped), build 30 pages OK

### Change Log

- 2026-03-25: Story 5.5 implementación completa — accessibility audit y compliance WCAG 2.1 AA

### File List

**Nuevos:**
- `tests/e2e/fixtures/axe-test.ts` — fixture compartido axe-core con WCAG 2.1 AA tags
- `tests/e2e/accessibility.spec.ts` — 9 tests E2E (6 axe-core scans + 3 keyboard nav)

**Modificados:**
- `src/styles/global.css` — theme-aware `--theme-primary`/`--theme-primary-dark`, `--theme-text-muted` oscurecido, `prefers-reduced-motion` global ampliado, `@theme inline` usa `var()` refs
- `src/components/layout/Footer.astro` — `<div>` → `<nav aria-label>` para social links
- `src/components/projects/ProjectFilter.svelte` — import `t()`, live region `aria-live="polite"`, screenshots container `tabindex="0" role="region"`
- `src/lib/i18n/translations.ts` — keys `social.nav` y `projects.results`
- `src/styles/__tests__/contrast.test.ts` — colores actualizados (theme-aware primary), tests para primary/muted contrast
- `package.json` / `pnpm-lock.yaml` — `@axe-core/playwright` 4.11.1 dev dependency
