# Story 2.8: Responsive Polish y Contenido Bilingüe Completo

Status: ready-for-dev

## Story

As a visitor,
I want the entire public site to work flawlessly on any device in both languages,
So that my experience is professional regardless of how I access the portfolio.

## Acceptance Criteria (AC)

1. **Mobile Layout** — Todas las páginas públicas en viewport <450px muestran single-column layout, hamburger menu, full-width cards, tipografía escalada.
2. **Tablet Layout** — En viewport 450-900px se muestran 2-column project grids, menú compacto o hamburger.
3. **Desktop Layout** — En viewport >900px se muestran 3-column grids, menú horizontal completo, max-width 1200px.
4. **Locale Switching Completeness** — Cambiar locale vía LocaleToggle cambia TODO el contenido: nav labels, section titles, project names, descriptions, experience details, button texts.
5. **hreflang Tags** — Cada página pública incluye `<link rel="alternate" hreflang="es">` y `<link rel="alternate" hreflang="en">`.
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

- [ ] Task 1: View Transitions API — Implementar ClientRouter (AC: 7)
  - [ ] 1.1 Agregar `import { ClientRouter } from 'astro:transitions'` en `BaseLayout.astro`
  - [ ] 1.2 Renderizar `<ClientRouter />` en `<head>` (después de `<title>`)
  - [ ] 1.3 Agregar `transition:animate="fade"` en `<main>` para transición por defecto
  - [ ] 1.4 Agregar `transition:persist` en `<ThemeToggle client:load>` y `<LocaleToggle client:load>` para mantener estado entre navegaciones
  - [ ] 1.5 Verificar que `prefers-reduced-motion` desactiva animaciones automáticamente (Astro lo maneja nativo)
  - [ ] 1.6 Verificar que Svelte islands con `client:load` y `client:visible` se rehidratan correctamente tras navegación

- [ ] Task 2: Auditoría y polish responsive — Mobile (AC: 1, 8)
  - [ ] 2.1 Verificar en viewport 375px: Home, Projects, Project Detail, Contact — todo single-column
  - [ ] 2.2 Verificar hamburger menu funciona en mobile (ya implementado — MobileMenu.svelte)
  - [ ] 2.3 Verificar touch targets 44x44px en botones, links, y elementos interactivos
  - [ ] 2.4 Verificar tipografía escalada con `clamp()` es legible en mobile
  - [ ] 2.5 Corregir cualquier overflow horizontal o elementos cortados en mobile

- [ ] Task 3: Auditoría y polish responsive — Tablet (AC: 2)
  - [ ] 3.1 Verificar en viewport 768px: project grids muestran 2 columnas (sm:grid-cols-2)
  - [ ] 3.2 Verificar menú en tablet: hamburger o nav compacta
  - [ ] 3.3 Verificar Container padding responsive: px-4 → sm:px-6

- [ ] Task 4: Auditoría y polish responsive — Desktop (AC: 3)
  - [ ] 4.1 Verificar en viewport 1280px: project grids muestran 3 columnas (lg:grid-cols-3)
  - [ ] 4.2 Verificar nav horizontal completo visible en desktop (lg:flex)
  - [ ] 4.3 Verificar max-width 1200px del Container principal (max-w-[75rem])
  - [ ] 4.4 Verificar Container padding: lg:px-8

- [ ] Task 5: Auditoría i18n — Completitud de contenido bilingüe (AC: 4)
  - [ ] 5.1 Verificar LocaleToggle cambia TODAS las traducciones en Home (hero, knowledge of, projects, experience)
  - [ ] 5.2 Verificar datos de Firestore (projects, technologies, experiences) usan `field[locale]` correctamente
  - [ ] 5.3 Verificar todas las páginas: /, /projects, /projects/[slug], /contact tienen versión ES (/es/...)
  - [ ] 5.4 Verificar fechas formateadas con `Intl.DateTimeFormat` respetan el locale activo
  - [ ] 5.5 Identificar y corregir cualquier string hardcodeada en templates que no use `t()` o `field[locale]`

- [ ] Task 6: Verificar hreflang tags (AC: 5)
  - [ ] 6.1 Verificar que BaseLayout.astro genera hreflang correctamente (ya implementado — lines 42-43)
  - [ ] 6.2 Verificar URLs absolutas en hreflang (ya usa `new URL(..., Astro.url).href`)
  - [ ] 6.3 Verificar hreflang en todas las rutas: /, /projects, /projects/[slug], /contact

- [ ] Task 7: Auditoría lazy loading de imágenes (AC: 6)
  - [ ] 7.1 Verificar `loading="lazy"` en imágenes below-the-fold (gallery thumbnails, technology icons en secciones bajas)
  - [ ] 7.2 Verificar imagen principal de proyecto usa `fetchpriority="high"` (above-the-fold)
  - [ ] 7.3 Verificar `decoding="async"` en imágenes que lo soportan
  - [ ] 7.4 Verificar avatar/mascota en hero: NO debe ser lazy (es above-the-fold)

- [ ] Task 8: Pipeline — Build y verificación (AC: all)
  - [ ] 8.1 Ejecutar `pnpm lint && pnpm type-check && pnpm build` — 0 errores
  - [ ] 8.2 Verificar que View Transitions no rompe el build SSG

- [ ] Task 9: E2E Tests (AC: all)
  - [ ] 9.1 Crear `tests/e2e/responsive-polish.spec.ts`
  - [ ] 9.2 Tests responsive: verificar layout en viewports 375px, 768px, 1280px
  - [ ] 9.3 Tests locale switching: verificar que TODO el contenido cambia al toggle
  - [ ] 9.4 Tests hreflang: verificar presencia de ambos `<link rel="alternate">` tags
  - [ ] 9.5 Tests lazy loading: verificar atributo `loading="lazy"` en imágenes below-the-fold
  - [ ] 9.6 Tests View Transitions: verificar que `<meta name="astro-view-transitions-enabled" content="true">` está presente (Astro lo inyecta con ClientRouter)
  - [ ] 9.7 Ejecutar `pnpm test:e2e` — 0 fallos, 0 regresiones en tests existentes (54 tests)

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
  <!-- Persistir estado de toggles entre navegaciones -->
  <ThemeToggle client:load currentLocale={locale} transition:persist />
  <LocaleToggle client:load currentLocale={locale} currentPath={Astro.url.pathname} transition:persist />
</body>
```

**Comportamiento clave:**
- `ClientRouter` habilita navegación SPA-like sin recargas completas
- `transition:animate="fade"` aplica crossfade al `<main>` en cada navegación
- `transition:persist` en ThemeToggle y LocaleToggle mantiene su estado (tema/locale) sin rehidratación
- `prefers-reduced-motion: reduce` desactiva animaciones automáticamente (Astro lo maneja)
- Browsers sin soporte → fallback a navegación normal (sin animación, funcionalidad intacta)
- NO se necesita configuración en `astro.config.mjs` — `<ClientRouter />` es autocontenido

### Lo Que Ya Está Implementado (auditoría, no reimplementar)

| Feature | Estado | Archivos |
|---------|--------|----------|
| Breakpoints sm:450px, lg:900px, xl:1200px | ✓ | `src/styles/global.css:91-95` |
| Hamburger menu mobile | ✓ | `MobileMenu.svelte` |
| Typography clamp() fluid scaling | ✓ | `global.css:97-129` |
| Grid 1→2→3 columnas | ✓ | `ProjectsSection.astro`, `ProjectFilter.svelte` |
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

### Posibles Issues a Encontrar en Auditoría

1. **View Transitions + Svelte islands**: Si un island con `client:visible` no se rehidrata tras navegación, verificar que Astro lo reinicializa. Usar `transition:persist` solo si el estado debe mantenerse.
2. **LocaleToggle + View Transitions**: `currentPath` se pasa como prop — verificar que se actualiza con la nueva URL tras View Transition (puede requerir `transition:persist` o escuchar `astro:page-load`).
3. **ThemeScript**: El script de tema que previene FOUC debe ejecutarse en cada navegación. Verificar con `astro:page-load` event si es necesario.
4. **MobileMenu state**: Si el menú está abierto y se navega vía View Transition, verificar que se cierra automáticamente.
5. **Hero avatar image**: NO debe tener `loading="lazy"` (es above-the-fold). Verificar.

### Responsive Breakpoints Definidos

```css
/* src/styles/global.css */
--breakpoint-sm: 28.125rem;  /* 450px — tablet */
--breakpoint-lg: 56.25rem;   /* 900px — desktop */
--breakpoint-xl: 75rem;      /* 1200px — max-width */
```

Clases Tailwind: `sm:` (≥450px), `lg:` (≥900px), `xl:` (≥1200px). No hay `md:`.

### Project Structure Notes

**Archivos a modificar:**
```
src/layouts/BaseLayout.astro   # Agregar ClientRouter + transition directives
```

**Archivos a verificar (solo modificar si hay bugs):**
```
src/components/layout/Header.astro          # Nav responsive lg:flex / lg:hidden
src/components/layout/MobileMenu.svelte     # Hamburger, aria-expanded
src/components/layout/ThemeToggle.svelte     # Persistencia entre navegaciones
src/components/layout/LocaleToggle.svelte   # Actualización de currentPath
src/components/layout/ThemeScript.astro      # FOUC prevention post-transition
src/components/home/ProjectsSection.astro   # Grid responsive, lazy loading
src/components/home/TechnologiesSection.astro # Lazy loading icons
src/components/home/ExperienceSection.astro  # Locale formatting
src/components/projects/ProjectFilter.svelte # Grid responsive
src/components/projects/ImageViewer.svelte   # Lazy loading, client:visible
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

### Debug Log References

### Completion Notes List

### File List
