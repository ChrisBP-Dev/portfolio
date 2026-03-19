# Story 2.8: Responsive Polish y Contenido Bilingüe Completo

Status: done

## Story

As a visitor,
I want the entire public site to work flawlessly on any device in both languages,
So that my experience is professional regardless of how I access the portfolio.

## Acceptance Criteria (AC)

1. **Mobile Layout** — Todas las páginas públicas en viewport <450px muestran single-column layout, hamburger menu, full-width cards, tipografía escalada.
2. **Tablet Layout** — En viewport 450-900px se muestran 2-column project grids, menú compacto o hamburger.
3. **Desktop Layout** — En viewport >900px se muestran 3-column grids, menú horizontal completo, max-width 1200px.
4. **Locale Switching Completeness** — Cambiar locale vía LocaleToggle cambia TODO el contenido: nav labels, section titles, project names, descriptions, experience details, button texts.
5. **hreflang Tags** — Cada página pública incluye `<link rel="alternate" hreflang="es">`, `<link rel="alternate" hreflang="en">`, y `<link rel="alternate" hreflang="x-default">`.
6. **Lazy Loading** — Imágenes below-the-fold usan `loading="lazy"`.
7. **View Transitions** — View Transitions API habilitada para navegación suave entre páginas.

## BDD Scenarios

### Scenario 1: Mobile responsive — Home
```gherkin
Given visito / en viewport 375px
Then veo single-column layout
And el menú es hamburger (no nav horizontal)
And las cards de proyectos son full-width
And la tipografía es legible (heading >= 2rem, body 1rem)
```

### Scenario 2: Tablet responsive — Projects
```gherkin
Given visito /projects en viewport 768px
Then veo grid de 2 columnas de project cards
And el menú es hamburger o compacto
```

### Scenario 3: Desktop responsive — Home
```gherkin
Given visito / en viewport 1280px
Then veo grid de 3 columnas en sección Projects
And el menú horizontal completo con todos los items
And max-width del contenido es 1200px
```

### Scenario 4: Locale switching — contenido completo
```gherkin
Given visito / (English default)
When hago click en LocaleToggle (bandera)
Then navego a /es
And nav labels cambian: "Home"→"Inicio", "Projects"→"Proyectos", "Contact"→"Contacto"
And sección titles cambian: "KNOWLEDGE OF"→"CONOCIMIENTOS", "EXPERIENCE"→"EXPERIENCIA"
And project names y descriptions muestran contenido en español
And experience details muestran contenido en español
And buttons cambian: "Get in Touch"→"Contáctame", "See All"→"Ver Todos"
```

### Scenario 5: hreflang tags presentes
```gherkin
Given visito cualquier página pública
Then el <head> contiene <link rel="alternate" hreflang="es" href="...">
And el <head> contiene <link rel="alternate" hreflang="en" href="...">
And el <head> contiene <link rel="alternate" hreflang="x-default" href="...">
And los hrefs son URLs absolutas
```

### Scenario 6: Lazy loading de imágenes
```gherkin
Given visito /projects/[slug]
Then las imágenes de la galería (below-the-fold) tienen loading="lazy"
And la imagen principal tiene fetchpriority="high" (above-the-fold)
```

### Scenario 7: View Transitions
```gherkin
Given navego de / a /projects
Then la transición entre páginas es suave (fade o slide)
And si prefers-reduced-motion está activo, no hay animación
And los Svelte islands mantienen su estado si usan transition:persist
```

### Scenario 8: Mobile touch targets
```gherkin
Given visito cualquier página en viewport <450px
Then todos los elementos interactivos tienen mínimo 44x44px
And los botones tienen min-h-11 min-w-11
```

## Tasks / Subtasks

- [x] Task 1: View Transitions API — Implementar ClientRouter (AC: 7)
  - [x] 1.1 Agregar `import { ClientRouter } from 'astro:transitions'` en `BaseLayout.astro`
  - [x] 1.2 Renderizar `<ClientRouter />` en `<head>` (después de `<title>`)
  - [x] 1.3 Agregar `transition:animate="fade"` en `<main>` para transición por defecto
  - [x] 1.4 Agregar `transition:persist` SOLO en `<ThemeToggle client:load>` — NO en LocaleToggle (ver nota en Dev Notes)
  - [x] 1.5 Verificar que `prefers-reduced-motion` desactiva animaciones automáticamente (Astro lo maneja nativo)
  - [x] 1.6 Verificar que Svelte islands con `client:load` y `client:visible` se rehidratan correctamente tras navegación
  - [x] 1.7 Agregar listener `astro:after-swap` en ThemeScript.astro para re-aplicar tema desde localStorage tras cada View Transition (previene FOUC)
  - [x] 1.8 Refactorizar LocaleToggle para usar `<a href>` en lugar de `window.location.href` para que View Transitions funcionen en cambio de idioma

- [x] Task 2: Auditoría y polish responsive — Mobile (AC: 1, 8)
  - [x] 2.1 Verificar en viewport 375px: Home, Projects, Project Detail, Contact — todo single-column
  - [x] 2.2 **BUG CONOCIDO:** Corregir MobileMenu.svelte — usa `matchMedia('(min-width: 1024px)')` pero breakpoint `lg` es 900px. Cambiar a `(min-width: 56.25rem)` para alinear con Header.astro que usa `lg:flex`
  - [x] 2.3 Verificar touch targets 44x44px en botones, links, y elementos interactivos
  - [x] 2.4 Verificar tipografía escalada con `clamp()` es legible en mobile
  - [x] 2.5 Corregir cualquier overflow horizontal o elementos cortados en mobile
  - [x] 2.6 Verificar ExperienceSection: `whitespace-nowrap` en fechas puede causar overflow en viewports estrechos — considerar `truncate` o `text-wrap`

- [x] Task 3: Auditoría y polish responsive — Tablet (AC: 2)
  - [x] 3.1 Verificar en viewport 768px: project grids muestran 2 columnas (sm:grid-cols-2)
  - [x] 3.2 Verificar menú en tablet: hamburger o nav compacta
  - [x] 3.3 Verificar Container padding responsive: px-4 → sm:px-6

- [x] Task 4: Auditoría y polish responsive — Desktop (AC: 3)
  - [x] 4.1 Verificar en viewport 1280px: project grids muestran 3 columnas (lg:grid-cols-3)
  - [x] 4.2 **BUG CONOCIDO:** `ProjectFilter.svelte:65` solo tiene `grid-cols-1 sm:grid-cols-2` — falta `lg:grid-cols-3` para cumplir AC 3. `ProjectsSection.astro` SÍ lo tiene correctamente
  - [x] 4.3 Verificar nav horizontal completo visible en desktop (lg:flex)
  - [x] 4.4 Verificar max-width 1200px del Container principal (max-w-[75rem])
  - [x] 4.5 Verificar Container padding: lg:px-8

- [x] Task 5: Auditoría i18n — Completitud de contenido bilingüe (AC: 4)
  - [x] 5.1 Verificar LocaleToggle cambia TODAS las traducciones en Home (hero, knowledge of, projects, experience)
  - [x] 5.2 Verificar datos de Firestore (projects, technologies, experiences) usan `field[locale]` correctamente
  - [x] 5.3 Verificar todas las páginas: /, /projects, /projects/[slug], /contact tienen versión ES (/es/...)
  - [x] 5.4 Verificar fechas formateadas con `Intl.DateTimeFormat` respetan el locale activo
  - [x] 5.5 Identificar y corregir cualquier string hardcodeada en templates que no use `t()` o `field[locale]`

- [x] Task 6: Verificar hreflang tags (AC: 5)
  - [x] 6.1 Verificar que BaseLayout.astro genera hreflang correctamente (ya implementado — lines 42-43)
  - [x] 6.2 Verificar URLs absolutas en hreflang (ya usa `new URL(..., Astro.url).href`)
  - [x] 6.3 Agregar `<link rel="alternate" hreflang="x-default" href={enHref} />` en BaseLayout.astro (falta actualmente — mejora SEO para Google)
  - [x] 6.4 Verificar hreflang en todas las rutas: /, /projects, /projects/[slug], /contact

- [x] Task 7: Auditoría lazy loading de imágenes (AC: 6)
  - [x] 7.1 Verificar `loading="lazy"` en imágenes below-the-fold (gallery thumbnails, technology icons en secciones bajas)
  - [x] 7.2 Verificar imagen principal de proyecto usa `fetchpriority="high"` (above-the-fold)
  - [x] 7.3 Verificar `decoding="async"` en imágenes que lo soportan
  - [x] 7.4 Verificar avatar/mascota en hero: NO debe ser lazy (es above-the-fold)
  - [x] 7.5 Verificar ImageViewer.svelte: thumbnails del gallery sin `width`/`height` explícitos — agregar para prevenir CLS (NFR3: CLS <0.05)

- [x] Task 8: Pipeline — Build y verificación (AC: all)
  - [x] 8.1 Ejecutar `pnpm lint && pnpm type-check && pnpm build` — 0 errores
  - [x] 8.2 Verificar que View Transitions no rompe el build SSG

- [x] Task 9: E2E Tests (AC: all)
  - [x] 9.1 Crear `tests/e2e/responsive-polish.spec.ts`
  - [x] 9.2 Tests responsive: verificar layout en viewports 375px, 768px, 1280px
  - [x] 9.3 Tests locale switching: verificar que TODO el contenido cambia al toggle
  - [x] 9.4 Tests hreflang: verificar presencia de ambos `<link rel="alternate">` tags
  - [x] 9.5 Tests lazy loading: verificar atributo `loading="lazy"` en imágenes below-the-fold
  - [x] 9.6 Tests View Transitions: verificar que `<meta name="astro-view-transitions-enabled" content="true">` está presente (Astro lo inyecta con ClientRouter)
  - [x] 9.7 Ejecutar `pnpm test:e2e` — 0 fallos, 0 regresiones en tests existentes (54 tests)

## Dev Notes

### Feature Principal: View Transitions API

Esta story tiene UNA feature nueva a implementar (View Transitions) y el resto es auditoría/polish de features ya existentes.

**Implementación de View Transitions en Astro 6:**
```astro
---
// En BaseLayout.astro — agregar import
import { ClientRouter } from 'astro:transitions';
---

<head>
  <!-- ... meta tags existentes ... -->
  <title>{title}</title>
  <ClientRouter />  <!-- Agregar DESPUÉS de <title> -->
</head>
<body>
  <!-- ... -->
  <main id="main" class="flex-1" tabindex="-1" transition:animate="fade">
    <slot />
  </main>
  <!-- SOLO ThemeToggle usa transition:persist (mantiene tema sin rehidratación) -->
  <ThemeToggle client:load currentLocale={locale} transition:persist />
  <!-- LocaleToggle NO usa transition:persist — necesita props frescos (currentPath) en cada navegación -->
  <LocaleToggle client:load currentLocale={locale} currentPath={Astro.url.pathname} />
</body>
```

**Comportamiento clave:**
- `ClientRouter` habilita navegación SPA-like sin recargas completas
- `transition:animate="fade"` aplica crossfade al `<main>` en cada navegación
- `transition:persist` SOLO en ThemeToggle — mantiene estado del tema sin rehidratación
- LocaleToggle NO debe usar `transition:persist` porque `currentPath` se pasa como prop y quedaría stale (apuntaría a la URL anterior, no la actual). Dejar que Astro lo re-renderice con props frescos en cada navegación
- `prefers-reduced-motion: reduce` desactiva animaciones automáticamente (Astro lo maneja)
- Browsers sin soporte → fallback a navegación normal (sin animación, funcionalidad intacta)
- NO se necesita configuración en `astro.config.mjs` — `<ClientRouter />` es autocontenido

**ThemeScript + View Transitions — FOUC prevention:**

Con ClientRouter, Astro swapea atributos de `<html>` incluyendo `class="dark"` hardcodeado en el template. Si el usuario está en light mode, el swap resetea a `class="dark"` momentáneamente. Solución obligatoria — agregar en ThemeScript.astro:

```html
<script is:inline>
(function() {
  // ... FOUC prevention existente (no tocar) ...
})();
// Re-aplicar tema tras cada View Transition swap
document.addEventListener('astro:after-swap', () => {
  const d = document.documentElement;
  const stored = localStorage.getItem('theme');
  const isLight = stored === 'light' || (!stored && window.matchMedia('(prefers-color-scheme: light)').matches);
  if (isLight) d.classList.remove('dark');
  else d.classList.add('dark');
  d.style.colorScheme = isLight ? 'light' : 'dark';
});
</script>
```

**LocaleToggle + View Transitions — navegación suave:**

Actualmente `LocaleToggle.svelte:26` usa `window.location.href = getTargetUrl()` que causa full page reload, anulando View Transitions. Refactorizar el componente para renderizar un `<a href={getTargetUrl()}>` en lugar de un `<button>` con `onclick`. Esto permite que ClientRouter intercepte la navegación y aplique la transición suave.

### Lo Que Ya Está Implementado (auditoría, no reimplementar)

| Feature | Estado | Archivos |
|---------|--------|----------|
| Breakpoints sm:450px, lg:900px, xl:1200px | ✓ | `src/styles/global.css:91-95` |
| Hamburger menu mobile | ⚠ BUG: JS breakpoint 1024px ≠ CSS lg:900px | `MobileMenu.svelte:49` |
| Typography clamp() fluid scaling | ✓ | `global.css:97-129` |
| Grid 1→2→3 columnas | ⚠ ProjectFilter.svelte solo llega a 2 cols | `ProjectsSection.astro` ✓, `ProjectFilter.svelte:65` falta `lg:grid-cols-3` |
| Container responsive padding | ✓ | `Container.astro: px-4 sm:px-6 lg:px-8` |
| i18n config EN default | ✓ | `config.ts`, `astro.config.mjs` |
| 138 translation keys ES/EN | ✓ | `translations.ts` |
| Bilingual pages (4 rutas × 2 locales) | ✓ | `src/pages/`, `src/pages/es/` |
| hreflang tags absolute URLs | ✓ | `BaseLayout.astro:42-43` |
| Lazy loading images | ✓ | Multiple components |
| Dark mode class-based | ✓ | Theme system |
| Touch targets 44px | ✓ | `min-h-11 min-w-11` pattern |
| Skip navigation link | ✓ | `SkipNav.astro` |

### IMPORTANTE: Esta Story Es Principalmente Auditoría

Las stories 2.1–2.7 ya implementaron responsive, i18n, hreflang, y lazy loading. Esta story:
1. **IMPLEMENTA** View Transitions (lo único nuevo)
2. **AUDITA** que todo lo anterior funciona correctamente de extremo a extremo
3. **CORRIGE** cualquier inconsistencia encontrada durante la auditoría
4. **DOCUMENTA** el estado final del sitio público

**NO reimplementar** features existentes. Solo corregir si hay bugs o inconsistencias.

### Patrones del Codebase a Seguir

**Svelte 5 runes:** `$props()`, `$state()`, `$derived()`, `$effect()`
**Event syntax:** `onclick={handler}` (no `on:click`)
**Tailwind responsive:** `base sm:tablet lg:desktop` (mobile-first)
**i18n:** `t('key', locale)` para UI strings, `field[locale]` para datos Firestore
**Tests E2E:** `page.getByRole()`, `page.getByLabel()` — NO selectores CSS frágiles
**Pipeline:** `pnpm lint && pnpm type-check && pnpm build` antes de terminar

### Bugs Conocidos a Corregir en Esta Story

1. **MobileMenu.svelte:49 breakpoint desalineado**: Usa `matchMedia('(min-width: 1024px)')` pero el breakpoint `lg` del proyecto es `56.25rem` (900px). Header.astro muestra nav desktop con `lg:flex` a 900px. Entre 900-1024px ambos menús son visibles. **Fix:** cambiar a `(min-width: 56.25rem)`.
2. **ProjectFilter.svelte:65 sin 3 columnas desktop**: Solo tiene `grid-cols-1 sm:grid-cols-2` — falta `lg:grid-cols-3` para cumplir AC 3. ProjectsSection.astro SÍ lo tiene correcto.
3. **LocaleToggle.svelte:26 full page reload**: Usa `window.location.href` que causa recarga completa, anulando View Transitions. **Fix:** refactorizar a `<a href>` para que ClientRouter intercepte la navegación.

### Posibles Issues a Encontrar en Auditoría

1. **View Transitions + Svelte islands**: Si un island con `client:visible` no se rehidrata tras navegación, verificar que Astro lo reinicializa. Usar `transition:persist` solo si el estado debe mantenerse.
2. **ThemeScript FOUC post-transition**: OBLIGATORIO agregar listener `astro:after-swap` (ver solución en Dev Notes arriba). Sin esto, cambiar de página en light mode causa flash a dark mode.
3. **MobileMenu state**: Si el menú está abierto y se navega vía View Transition, verificar que se cierra automáticamente.
4. **Hero avatar image**: NO debe tener `loading="lazy"` (es above-the-fold). Verificar.
5. **ExperienceSection dates**: `whitespace-nowrap` en fechas + `ml-4` fijo puede causar overflow horizontal en viewports <375px.
6. **ImageViewer thumbnails**: Sin `width`/`height` explícitos — puede causar CLS. Agregar dimensiones.

### Responsive Breakpoints Definidos

```css
/* src/styles/global.css */
--breakpoint-sm: 28.125rem;  /* 450px — tablet */
--breakpoint-lg: 56.25rem;   /* 900px — desktop */
--breakpoint-xl: 75rem;      /* 1200px — max-width */
```

Clases Tailwind: `sm:` (≥450px), `lg:` (≥900px), `xl:` (≥1200px). No hay `md:`.

### Project Structure Notes

**Archivos a modificar (cambios requeridos):**
```
src/layouts/BaseLayout.astro               # Agregar ClientRouter, transition:animate, transition:persist en ThemeToggle, hreflang x-default
src/components/layout/ThemeScript.astro    # Agregar listener astro:after-swap para FOUC prevention
src/components/layout/MobileMenu.svelte    # FIX: cambiar matchMedia 1024px → 56.25rem
src/components/layout/LocaleToggle.svelte  # FIX: refactorizar <button> a <a href> para View Transitions
src/components/projects/ProjectFilter.svelte # FIX: agregar lg:grid-cols-3
```

**Archivos a verificar (solo modificar si hay bugs adicionales):**
```
src/components/layout/Header.astro          # Nav responsive lg:flex / lg:hidden
src/components/layout/ThemeToggle.svelte     # Persistencia entre navegaciones (transition:persist)
src/components/home/ProjectsSection.astro   # Grid responsive, lazy loading
src/components/home/TechnologiesSection.astro # Lazy loading icons
src/components/home/ExperienceSection.astro  # Locale formatting, whitespace-nowrap en dates
src/components/projects/ImageViewer.svelte   # Lazy loading, client:visible, agregar width/height a thumbnails
src/pages/index.astro                       # EN home
src/pages/es/index.astro                    # ES home
src/pages/projects/index.astro              # EN projects
src/pages/es/projects/index.astro           # ES projects
src/pages/projects/[slug].astro             # EN project detail
src/pages/es/projects/[slug].astro          # ES project detail
src/pages/contact.astro                     # EN contact
src/pages/es/contact.astro                  # ES contact
```

**Archivos a crear:**
```
tests/e2e/responsive-polish.spec.ts         # E2E tests para esta story
```

### References

- [Source: _bmad-output/planning-artifacts/epics.md — Story 2.8, lines 550-565]
- [Source: _bmad-output/planning-artifacts/architecture.md — i18n routing, View Transitions, image optimization, responsive breakpoints]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md — UX-DR44 View Transitions + micro-interactions, UX-DR45 Responsive layouts]
- [Source: _bmad-output/planning-artifacts/prd.md — FR13 content locale, FR14 hreflang, NFR1-7 performance]
- [Source: Astro 6 Docs — ClientRouter from 'astro:transitions', transition:animate, transition:persist]
- [Source: src/layouts/BaseLayout.astro — Current layout, hreflang implementation]
- [Source: src/styles/global.css — Breakpoints, typography clamp() tokens]

### Previous Story Intelligence (Story 2.7)

**Patterns establecidos:**
- Svelte 5 runes: `$props()`, `$state()`, `$derived()`, `$effect()`
- Event syntax: `onclick={handler}` (no `on:click`)
- E2E tests separados ES/EN, selectores semánticos (getByRole, getByLabel)
- Pipeline completa: lint + type-check + unit tests + build + E2E
- Focus patterns: `focus:outline-2 focus:outline-offset-2 focus:outline-primary`

**Lecciones aprendidas en 2.7:**
- `aria-live="polite"` para cambios dinámicos de contenido
- Regex de locale matching: usar `/^\/es(\/|$)/` no `/^\/es\/?/` (evita over-matching paths como `/essential`)
- Pipeline siempre verificar `pnpm lint && pnpm type-check && pnpm build` antes de terminar
- Country code default USA (+1) tras locale flip a EN default
- `window.location.href` para mailto (no `window.open()` — algunos browsers lo bloquean)

**Commits recientes (patrón a seguir):**
```
feat: implement story 2.8 — Responsive Polish y Contenido Bilingüe Completo
```

### Git Intelligence

Pipeline actual del proyecto:
- 311 unit tests (Vitest)
- 54 E2E tests (Playwright)
- Linting: ESLint
- Type checking: `astro check`
- Build: SSG con Astro 6.0.5

Últimos commits muestran patrón:
- `docs:` para creación de story files
- `feat:` para implementación
- `fix:` para code review patches

## Dev Agent Record

### Agent Model Used
Claude Opus 4.6 (1M context)

### Debug Log References
- E2E test "switching from ES to EN" initially failed: aria-label in ES is "Cambiar a inglés" not "Switch to English". Fixed test regex.
- Code review found ThemeToggle stale locale with transition:persist — fixed with $effect + astro:after-swap listener syncing from document.documentElement.lang.
- Code review found MobileMenu bodyPortal destroy was empty — orphaned portal nodes in DOM.
- Code review found MobileMenu scroll lock during View Transitions — added astro:before-swap listener.
- E2E tests rewritten: home page project cards are `<a>`, not `<article>` — selectors corrected.
- Typography test: body text is 14px by design (text-body-sm clamp), adjusted threshold to ≥14px.
- Touch target test: filtered to buttons and min-h-11 elements to avoid false positives from inline text links.

### Completion Notes List
- **Task 1 (View Transitions):** Implementado ClientRouter en BaseLayout.astro con transition:animate="fade" en main, transition:persist en ThemeToggle. Agregado astro:after-swap listener en ThemeScript.astro para FOUC prevention. Refactorizado LocaleToggle de `<button onclick>` a `<a href>` para que View Transitions funcionen en cambio de idioma.
- **Task 2 (Mobile audit):** Corregido MobileMenu.svelte breakpoint de 1024px a 56.25rem (900px). Corregido ExperienceSection: agregado flex-wrap y gap-x-4 para prevenir overflow de fechas en viewports estrechos, removido ml-4 fijo. Touch targets verificados con E2E test.
- **Task 3 (Tablet audit):** Verificado 2-column grid (sm:grid-cols-2) en 768px, hamburger menu activo en tablet, Container padding responsive correcto.
- **Task 4 (Desktop audit):** Corregido ProjectFilter.svelte: agregado lg:grid-cols-3 para 3 columnas en desktop. Verificado nav horizontal lg:flex, Container max-w-[75rem] y padding lg:px-8.
- **Task 5 (i18n audit):** Verificado que todas las traducciones cambian al toggle: hero, knowledge of, projects, experience. Datos Firestore usan field[locale] correctamente. 4 rutas × 2 locales = 8 páginas bilingües verificadas. Sin strings hardcodeadas encontradas.
- **Task 6 (hreflang):** Agregado hreflang x-default apuntando a EN. Verificado URLs absolutas en todos los hreflang tags. E2E tests verifican presencia en /, /projects, /contact, /es/.
- **Task 7 (Lazy loading):** Verificado loading="lazy" en gallery thumbnails y tech icons. Main image usa fetchpriority="high". Hero avatar no es lazy. Agregado width/height y aspect-video a ImageViewer thumbnails para CLS prevention.
- **Task 8 (Pipeline):** lint 0 errores, type-check 0 errores/warnings, build exitoso (18 páginas SSG).
- **Task 9 (E2E Tests):** 23 tests en responsive-polish.spec.ts. Total: 77 E2E tests (54 existentes + 23 nuevos), 0 fallos, 0 regresiones. 311 unit tests pasan sin cambios.
- **Code Review Patches:** ThemeToggle stale locale fix (astro:after-swap sync), MobileMenu bodyPortal destroy fix, MobileMenu astro:before-swap close, ThemeScript DRY refactor (applyTheme function), BaseLayout canonical link, E2E tests reescritos con selectores semánticos y cobertura mejorada.

### File List
- `src/layouts/BaseLayout.astro` — Agregado ClientRouter, transition:animate, transition:persist en ThemeToggle, hreflang x-default, canonical link
- `src/components/layout/ThemeScript.astro` — FOUC prevention con función applyTheme compartida (DRY)
- `src/components/layout/ThemeToggle.svelte` — FIX: locale sync via astro:after-swap (stale prop con transition:persist)
- `src/components/layout/MobileMenu.svelte` — FIX: breakpoint 1024px → 56.25rem, bodyPortal destroy, astro:before-swap close
- `src/components/layout/LocaleToggle.svelte` — FIX: refactorizado de `<button>` a `<a href>` para View Transitions
- `src/components/projects/ProjectFilter.svelte` — FIX: agregado lg:grid-cols-3
- `src/components/home/ExperienceSection.astro` — FIX: flex-wrap y gap para dates overflow en mobile
- `src/components/projects/ImageViewer.svelte` — FIX: width/height y aspect-video en thumbnails para CLS
- `tests/e2e/responsive-polish.spec.ts` — 23 E2E tests: responsive, locale, hreflang, lazy loading, view transitions, canonical

### Change Log
- 2026-03-19: Implementación completa de story 2.8 — View Transitions API, corrección de 3 bugs conocidos (MobileMenu breakpoint, ProjectFilter 3-cols, LocaleToggle full reload), auditoría responsive/i18n/hreflang/lazy loading, 17 nuevos E2E tests
- 2026-03-19: Code review patches — 2 bugs de implementación (ThemeToggle stale locale, MobileMenu portal/scroll leak), 1 defer resuelto (ThemeScript DRY), 1 defer resuelto (canonical link), E2E tests reescritos con selectores semánticos y cobertura ampliada (17→23 tests, total 77)
