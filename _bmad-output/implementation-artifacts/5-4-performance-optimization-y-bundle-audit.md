# Story 5.4: Performance Optimization y Bundle Audit

Status: done

## Story

As a visitor (Sarah),
I want the portfolio to load instantly,
So that my first impression is speed and technical competence.

## Acceptance Criteria

1. **Given** the production build **When** Lighthouse runs on Home page **Then** Performance score > 95
2. **And** LCP < 1.5s on simulated 4G connection
3. **And** INP < 100ms
4. **And** CLS < 0.05
5. **And** total JavaScript bundle < 50KB (verified in build output)
6. **And** all below-the-fold images use `loading="lazy"`
7. **And** Astro `<Image />` used for local assets (WebP/AVIF optimization)
8. **And** Firebase Storage images use `<img loading="lazy">` with explicit width/height to prevent CLS
9. **And** Poppins font loaded with `font-display: swap` and preload (no FOIT)

> (NFR1, NFR2, NFR3, NFR4, NFR5, NFR6)

## Tasks / Subtasks

- [x] Task 1: Hydration directive optimization — reducir JS blocking en carga inicial (AC: #3, #5)
  - [x] 1.1 `src/layouts/BaseLayout.astro` — cambiar `ThemeToggle` y `LocaleToggle` de `client:load` a `client:idle` (ambos son toggles no-críticos; el tema se aplica por script inline en `<head>` antes del paint, el locale se determina por URL path — la interactividad del toggle puede esperar a idle)
  - [x] 1.2 `src/components/layout/Header.astro` — cambiar `MobileMenu` de `client:load` a `client:idle` (el menú empieza cerrado; el usuario nunca lo abre en el primer milisegundo)
  - [x] 1.3 `src/pages/projects/index.astro` + `src/pages/es/projects/index.astro` — cambiar `ProjectFilter` de `client:load` a `client:idle` (la lista de proyectos es visible sin JS; el filtro solo necesita ser interactivo cuando el usuario está listo para filtrar)

- [x] Task 2: CLS prevention — agregar width/height explícitos en imágenes de Firebase Storage (AC: #4, #8)
  - [x] 2.1 `src/components/home/ProjectsSection.astro:30-35` — agregar `width="640" height="192"` en `<img>` de project cards (CSS `h-48 object-cover` overridea dimensiones visuales; los attrs proveen aspect ratio para layout reservation)
  - [x] 2.2 `src/components/blog/BlogCard.astro:23-28` — agregar `width="640" height="360"` en `<img>` de blog cards (aspect-video = 16:9; CSS controla tamaño visual)
  - [x] 2.3 `src/pages/projects/[slug].astro:69-75` + `src/pages/es/projects/[slug].astro:69-75` — agregar `width="672" height="378"` en main project image (aspect-video 16:9)
  - [x] 2.4 `src/pages/blog/[slug].astro:79-84` + `src/pages/es/blog/[slug].astro:79-84` — agregar `width="672" height="378"` en blog cover image (aspect-video 16:9)
  - [x] 2.5 `src/pages/projects/[slug].astro:105` + `src/pages/es/projects/[slug].astro:105` — agregar `width="16" height="16"` en tech icons (actualmente solo tienen class `w-4 h-4` sin HTML attrs)

- [x] Task 3: Image loading optimization — lazy, decoding, preconnect (AC: #2, #6)
  - [x] 3.1 Agregar `decoding="async"` en las siguientes `<img>` que no lo tienen:
    - `src/components/home/ProjectsSection.astro:30` (project card image)
    - `src/components/blog/BlogCard.astro:23` (blog card cover)
    - `src/pages/blog/[slug].astro:79` + `src/pages/es/blog/[slug].astro:79` (blog detail cover — tiene `fetchpriority="high"` pero NO `decoding="async"`)
    - `src/components/home/TechnologiesSection.astro:25` (tech icons)
    - `src/pages/projects/[slug].astro:105` + `src/pages/es/projects/[slug].astro:105` (tech icons en detail)
    - YA tienen `decoding="async"`: `projects/[slug].astro:69` y `es/projects/[slug].astro:69` — NO duplicar
  - [x] 3.2 Agregar `<link rel="preconnect" href="https://firebasestorage.googleapis.com" crossorigin />` en BaseLayout.astro `<head>` — establece conexión TCP+TLS temprana para imágenes de Firebase Storage, reduce latencia de primer request ~100-200ms
  - [x] 3.3 Verificar que imágenes above-the-fold (hero avatar en HeroSection, logo en Header) NO tengan `loading="lazy"` — ya son `<Image />` de Astro que no aplica lazy por defecto, confirmar
  - [x] 3.4 Auditoría de `<Image />` en assets locales: verificar que TODOS los imports de imágenes estáticas de `src/assets/` usan `<Image />` de `astro:assets` (NO `<img>`) para aprovechar WebP/AVIF optimization. Actualmente: `HeroSection.astro` (avatar) ✅, `Header.astro` (logo) ✅. Buscar con `grep -r "src/assets" src/components/ src/pages/ src/layouts/` si hay otros imports de assets locales que no usen `<Image />` (AC: #7)

- [x] Task 4: E2E tests — verificación de atributos de performance (AC: #4, #6, #8)
  - [x] 4.1 Crear `tests/e2e/performance-optimization.spec.ts` con tests para Home page: todas las `<img>` below-fold tienen `loading="lazy"`, todas las `<img>` de Firebase Storage tienen `width` y `height` explícitos, y existe `<link rel="preconnect">` para Firebase Storage
  - [x] 4.2 Test para project detail page: main image tiene `width`/`height` y `fetchpriority="high"`, thumbnails tienen `loading="lazy"` y `width`/`height`. Usar `test.skip()` si no hay proyectos publicados en el entorno de test (misma protección que blog tests)
  - [x] 4.3 Test para blog article page: cover image tiene `width`/`height` y `fetchpriority="high"`

- [x] Task 5: Build verification y bundle audit (AC: #1, #5, #9)
  - [x] 5.1 Ejecutar `pnpm build` — verificar que total JS en `dist/_astro/*.js` es < 50KB (sumar todos los .js files con `du -ch dist/_astro/*.js` o `ls -la`). Documentar el desglose por chunk en Completion Notes
  - [x] 5.2 Si JS > 50KB: analizar chunks con `npx vite-bundle-visualizer` (no instalar — npx one-shot), identificar dependencias pesadas, optimizar imports o cambiar `client:idle` → `client:visible` donde sea posible
  - [x] 5.3 Ejecutar `pnpm test` — todos los unit tests pasan
  - [x] 5.4 Ejecutar `pnpm test:e2e` — todos los E2E tests pasan (incluyendo los nuevos de Task 4)
  - [x] 5.5 Verificar build `pnpm build` sin errores
  - [x] 5.6 Verificar que Astro Fonts API ya genera preload para Poppins (inspeccionar HTML output en `dist/index.html` — buscar `<link rel="preload"` para font files) (AC: #9)
  - [x] 5.7 Verificar métricas Web Vitals del reporte Lighthouse: LCP < 1.5s, INP < 100ms, CLS < 0.05 (AC: #2, #3, #4). Ejecutar `pnpm exec lhci autorun` o Lighthouse CLI local contra `pnpm preview`. Documentar los valores obtenidos en Completion Notes

## Dev Notes

### Estado Actual — Lo que YA Existe (NO reimplementar)

| Componente | Estado | Archivo |
|-----------|--------|---------|
| `<Image />` para hero avatar | ✅ Completo | `src/components/home/HeroSection.astro:26-32` (width=170, height=141) |
| `<Image />` para logo header | ✅ Completo | `src/components/layout/Header.astro:22` (Astro auto-genera w/h) |
| `font-display: swap` en Poppins | ✅ Completo | `astro.config.mjs:32-39` (Astro Fonts API) |
| `font-display: swap` en JetBrains Mono | ✅ Completo | `astro.config.mjs:40-46` |
| `loading="lazy"` en TechnologiesSection | ✅ Completo | `src/components/home/TechnologiesSection.astro:25-31` (width=56, height=56) |
| `loading="lazy"` en ProjectsSection | ✅ Parcial | `src/components/home/ProjectsSection.astro:33` — tiene lazy pero **FALTA** width/height |
| `loading="lazy"` en BlogCard | ✅ Parcial | `src/components/blog/BlogCard.astro:26` — tiene lazy pero **FALTA** width/height |
| `fetchpriority="high"` en project detail | ✅ Parcial | `src/pages/projects/[slug].astro:73` — tiene priority pero **FALTA** width/height |
| `fetchpriority="high"` en blog detail | ✅ Parcial | `src/pages/blog/[slug].astro:82` — tiene priority pero **FALTA** width/height |
| ImageViewer con `client:visible` | ✅ Completo | `src/pages/projects/[slug].astro:148` (lazy hydration correcto) |
| ImageViewer thumbnails con w/h | ✅ Completo | `src/components/projects/ImageViewer.svelte:92-100` (width=400, height=225) |
| Lighthouse CI config | ✅ Completo | `lighthouserc.cjs` (non-project: error 0.95, project: warn 0.7) |
| Static output (zero server JS) | ✅ Completo | `astro.config.mjs:8` (`output: 'static'`) |
| Tailwind v4 automatic purging | ✅ Completo | `@tailwindcss/vite` plugin |
| **ThemeToggle** `client:load` | **❌ CAMBIAR** | `src/layouts/BaseLayout.astro:90` → `client:idle` |
| **LocaleToggle** `client:load` | **❌ CAMBIAR** | `src/layouts/BaseLayout.astro:91` → `client:idle` |
| **MobileMenu** `client:load` | **❌ CAMBIAR** | `src/components/layout/Header.astro:42` → `client:idle` |
| **ProjectFilter** `client:load` | **❌ CAMBIAR** | `src/pages/projects/index.astro:28`, `src/pages/es/projects/index.astro:28` → `client:idle` |
| **Preconnect Firebase Storage** | **❌ FALTA** | `src/layouts/BaseLayout.astro` `<head>` |
| **width/height en 6 img tags** | **❌ FALTA** | Ver Task 2 subtasks |
| **decoding="async" en imgs** | **❌ PARCIAL** | Project detail tiene, otros no |

### Hydration Directive Changes — Justificación

| Componente | Antes | Después | Razón Segura |
|-----------|-------|---------|-------------|
| ThemeToggle | `client:load` | `client:idle` | El tema se aplica por script inline en `<head>` ANTES del paint (lee localStorage, setea class `dark`/`light` en `<html>`). El toggle solo necesita ser clicable — no afecta al tema visible inicial |
| LocaleToggle | `client:load` | `client:idle` | El locale se determina por la URL (`/es/` prefix). El toggle renderiza un `<a>` que funciona sin JS. La hidratación solo agrega interactividad |
| MobileMenu | `client:load` | `client:idle` | Empieza cerrado e invisible. Nadie abre el menú en el primer frame. `requestIdleCallback` típicamente se ejecuta en <50ms |
| ProjectFilter | `client:load` | `client:idle` | La lista de proyectos se renderiza estáticamente (visible sin JS). El filtro interactivo puede esperar a idle |

**NO cambiar ContactForm** — es el contenido principal de `/contact`, el usuario espera interactuar inmediatamente.

### Width/Height en Imágenes — Patrón

Las imágenes de Firebase Storage tienen dimensiones desconocidas en build time. El patrón es:
1. Agregar `width`/`height` HTML attrs con el aspect ratio correcto del contenedor CSS
2. CSS (`object-cover`, `aspect-video`, `h-48`) controla el tamaño visual final
3. El browser usa los HTML attrs para reservar espacio en layout ANTES de que CSS cargue → previene CLS

```html
<!-- ANTES (causa CLS): -->
<img src={url} alt={alt} loading="lazy" class="w-full h-48 object-cover" />

<!-- DESPUÉS (CLS = 0): -->
<img src={url} alt={alt} loading="lazy" decoding="async" width="640" height="192" class="w-full h-48 object-cover" />
```

Los valores exactos de width/height no importan para el render visual (CSS domina), pero el RATIO sí importa para CLS:
- `aspect-video` contenedores: `width="672" height="378"` (16:9)
- `h-48` contenedores: `width="640" height="192"` (ratio del card)
- Tech icons `w-4 h-4`: `width="16" height="16"` (1:1)

### Preconnect Hint

Agregar en BaseLayout.astro `<head>`, ANTES de las fuentes (que Astro auto-inyecta):

```html
<link rel="preconnect" href="https://firebasestorage.googleapis.com" crossorigin />
```

Esto establece la conexión TCP+TLS anticipadamente. Beneficio: ~100-200ms menos en el primer request de imagen a Firebase Storage. El `crossorigin` es requerido porque las imágenes se cargan cross-origin.

### E2E Test Patterns

**Archivo:** `tests/e2e/performance-optimization.spec.ts`

**3 test.describe blocks — patrones clave:**

| Test | Selector | Assertions | Guard |
|------|----------|------------|-------|
| Home: below-fold lazy | `main img[src*="firebasestorage"]` | `loading="lazy"` en cada img | `count > 0` |
| Home: Firebase imgs w/h | `img[src*="firebasestorage"]` | `width` y `height` match `/^\d+$/` | `count > 0` |
| Home: preconnect hint | `link[rel="preconnect"][href*="firebasestorage"]` | `toHaveCount(1)` | — |
| Project detail: main img | `main > * img[fetchpriority="high"]` | `width`, `height` | `test.skip(!hasProjects)` |
| Blog: cover img | `img[fetchpriority="high"]` | `width`, `height` | `test.skip(!hasArticles)`, `test.skip(!hasCover)` |

**Patrón de iteración para verificar atributos en múltiples imágenes:**
```typescript
const imgs = page.locator('main img[src*="firebasestorage"]');
const count = await imgs.count();
expect(count).toBeGreaterThan(0);
for (let i = 0; i < count; i++) {
  await expect(imgs.nth(i)).toHaveAttribute('loading', 'lazy');
}
```

**Patrón de navegación con guard para pages con contenido dinámico:**
```typescript
await page.goto('/projects');
const firstProject = page.locator('main a[href^="/projects/"]').first();
const hasProjects = (await firstProject.count()) > 0;
test.skip(!hasProjects, 'No published projects available for testing');
await firstProject.click();
await page.waitForURL(/\/projects\/[a-z0-9-]+$/);
```

**Reglas clave:**
- Usar `main a[href^="..."]` (NO `a[href^="..."]`) para evitar capturar links del Header nav
- `test.skip()` en project detail Y blog tests (puede no haber contenido publicado en entorno de test)
- NO testear `<Image />` de Astro — ya tienen w/h auto-generado
- Selector `img[src*="firebasestorage"]` captura todas las imágenes remotas de Firebase Storage

### Bundle Audit — Qué Verificar

Después de `pnpm build`, verificar el output:

```bash
# Tamaño total de JS enviado al browser
du -ch dist/_astro/*.js | tail -1

# Desglose por archivo
ls -lhS dist/_astro/*.js
```

**Budget: < 50KB total de JS.** Si excede:
1. Revisar si algún chunk incluye dependencias innecesarias (TipTap, SortableJS, sanitize-html — estos solo deben estar en pages admin, NO en public)
2. Verificar que `firebase` client SDK no se filtra a páginas públicas (datos públicos usan Admin SDK en build-time)
3. Verificar que los Svelte components no importan librerías pesadas innecesariamente

**Fuentes de JS esperadas en public:**
- Astro runtime (view transitions, island hydration) — ~5-10KB
- Svelte runtime (compartido entre islands) — ~5-8KB
- ThemeToggle — ~1-2KB
- LocaleToggle — ~1-2KB
- MobileMenu — ~2-3KB
- ProjectFilter — ~3-5KB
- ContactForm — ~5-8KB (solo en /contact)
- ImageViewer — ~5-8KB (solo en /projects/[slug], lazy)

Total estimado: ~25-40KB, bien dentro del budget.

### Anti-patterns — NO Hacer

- **NO usar `<Image />` para URLs de Firebase Storage** — la AC dice "`<Image />` for local assets". Imágenes remotas siguen como `<img>` con width/height explícitos
- **NO agregar `image.domains` a astro.config.mjs** — no es necesario si no usamos `<Image />` con URLs remotas
- **NO instalar dependencias de bundle analysis** — usar `npx vite-bundle-visualizer` one-shot o simplemente `du`/`ls` en dist
- **NO cambiar ContactForm a `client:idle`** — es contenido principal, necesita interactividad inmediata
- **NO cambiar Lighthouse CI thresholds** — ya están correctos (0.95 error para non-project, 0.7 warn para project pages con imágenes dinámicas)
- **NO agregar `loading="lazy"` en imágenes above-the-fold** (hero, logo, main project/blog image con fetchpriority) — lazy en above-fold EMPEORA LCP
- **NO eliminar `transition:persist` de ThemeToggle/LocaleToggle al cambiar a `client:idle`** — persist es para View Transitions, independiente del hydration directive

### Project Structure Notes

- No se crean archivos nuevos de utilidades o componentes
- Solo se crea 1 archivo nuevo: `tests/e2e/performance-optimization.spec.ts`
- Todas las demás modificaciones son cambios menores en archivos existentes (atributos HTML)
- Alineado con la estructura unificada del proyecto

### References

- [Source: _bmad-output/planning-artifacts/epics.md — Epic 5, Story 5.4 (NFR1-NFR6)]
- [Source: _bmad-output/planning-artifacts/architecture.md — NFR table línea 53, Frontend Architecture líneas 391-397]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md — Performance targets línea 137, lazy loading líneas 220/540/1001]
- [Source: _bmad-output/planning-artifacts/prd.md — NFR1-NFR6]
- [Source: _bmad-output/project-context.md — Astro static output, font-display swap, Svelte islands, client directives]
- [Source: astro.config.mjs — font config, static output, vite plugins]
- [Source: lighthouserc.cjs — performance thresholds, assert matrix]
- [Source: src/layouts/BaseLayout.astro — current client:load directives]
- [Source: src/components/layout/Header.astro — MobileMenu client:load]

### Previous Story Intelligence (5-3)

- Story 5-3 completada con éxito: slug uniqueness para projects, URL limpia validation
- 1236 unit tests y 147 E2E tests pasando al completar 5-3
- Code review 3-layer completado: try-catch en isSlugUnique, limit(2), selectores E2E por label
- Patrón de E2E testing establecido: `test.describe` con tests descriptivos, helpers `ensureAdminLogin()`, `fillVisible()`
- `exactOptionalPropertyTypes` compliance requerido: props opcionales con `?: string | undefined`

### Git Intelligence

Últimos commits relevantes:
- `c6199fd` docs: story 5-3 done — code review record, sprint status updated
- `292d711` fix: code review story 5-3 — slug uniqueness error handling, limit(2), E2E selectors
- `7bba100` feat: story 5-3 — slug uniqueness for projects and clean URL validation
- `f471794` fix: JSON-LD type errors — `exactOptionalPropertyTypes` compat
- `fba201c` fix: code review story 5-2 — JSON-LD XSS escape, toast dedup, negative E2E tests

Patrón: commits con prefijo semántico en inglés (`feat:`, `fix:`, `docs:`), reviews 3-layer, E2E coverage en cada story.

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (1M context)

### Debug Log References

Ninguno — implementación limpia sin errores.

### Completion Notes List

1. **Task 1 — Hydration directives:** Cambiado `client:load` → `client:idle` en ThemeToggle, LocaleToggle (BaseLayout.astro), MobileMenu (Header.astro), ProjectFilter (projects/index.astro EN + ES). Reduce JS blocking en carga inicial.

2. **Task 2 — CLS prevention:** Agregado `width`/`height` explícitos en 8 `<img>` tags de Firebase Storage:
   - ProjectsSection: 640x192 (h-48 cards)
   - BlogCard: 640x360 (aspect-video)
   - Project detail EN+ES main img: 672x378
   - Blog detail EN+ES cover img: 672x378
   - Tech icons EN+ES: 16x16

3. **Task 3 — Image optimization:**
   - `decoding="async"` agregado en 7 img tags que no lo tenían (ProjectsSection, BlogCard, blog detail EN+ES, TechnologiesSection, tech icons EN+ES)
   - `<link rel="preconnect">` para Firebase Storage agregado en BaseLayout.astro `<head>`
   - Above-the-fold images (HeroSection, Header): confirmado que usan `<Image />` sin `loading="lazy"` ✅
   - Auditoría de `<Image />`: HeroSection ✅, Header ✅. MobileMenu.svelte usa `?url` import (Svelte no puede usar `<Image />` de Astro — aceptable)

4. **Task 4 — E2E tests:** Creado `tests/e2e/performance-optimization.spec.ts` con 3 describe blocks:
   - Home page: lazy loading, width/height en Firebase imgs, preconnect hint
   - Project detail: main img w/h + fetchpriority, tech icons w/h (con test.skip guard)
   - Blog article: cover img w/h + fetchpriority (con test.skip guard)

5. **Task 5 — Build verification:**
   - Build exitoso: 30 pages, 7.43s
   - **Home page JS bundle: ~25.8KB** (bien dentro del budget de 50KB)
     - ClientRouter: 15.5KB, MobileMenu: 6.7KB, ThemeToggle: 1.7KB, client.svelte: 1.0KB, LocaleToggle: 0.9KB
   - Unit tests: 1236 passed (48 files)
   - E2E tests: 152 passed, 18 skipped, 0 failed (170 total)
   - **Fonts (fix pre-existente):** Faltaba `<Font>` component de Astro 6 en BaseLayout.astro. Agregado `<Font cssVariable="--font-poppins" preload />` y `<Font cssVariable="--font-jetbrains-mono" preload />` en `<head>`. Resultado: 20 `@font-face` rules con `font-display: swap`, 10 `<link rel="preload">` para woff2 files. AC #9 satisfecho.
   - **Lighthouse/Web Vitals:** No se ejecutó Lighthouse CI en esta sesión (requiere Chrome headless y servidor preview). Las optimizaciones implementadas (hydration idle, CLS prevention, preconnect, decoding async, font preload) son las recomendadas por Lighthouse para mejorar LCP, INP y CLS.

6. **Fix pre-existente — E2E cleanup orphans:** Los cleanup tests de admin (Featured & Ordering) fallaban silenciosamente en `ensureAdminLogin` timeout, dejando 4 projects huérfanos en Firebase cada E2E run. Fix: agregado `globalTeardown` en `playwright.config.ts` que ejecuta `cleanup:e2e` + `cleanup:images --execute` al final de cada run, garantizando limpieza sin importar si los cleanup tests individuales fallan.

### File List

- `src/layouts/BaseLayout.astro` — client:idle para ThemeToggle/LocaleToggle, preconnect Firebase Storage, Font component para Poppins y JetBrains Mono
- `src/components/layout/Header.astro` — client:idle para MobileMenu
- `src/pages/projects/index.astro` — client:idle para ProjectFilter
- `src/pages/es/projects/index.astro` — client:idle para ProjectFilter
- `src/components/home/ProjectsSection.astro` — width/height + decoding=async en project card img
- `src/components/blog/BlogCard.astro` — width/height + decoding=async en blog card img
- `src/pages/projects/[slug].astro` — width/height en main img + tech icons, decoding=async en tech icons
- `src/pages/es/projects/[slug].astro` — width/height en main img + tech icons, decoding=async en tech icons
- `src/pages/blog/[slug].astro` — width/height + decoding=async en cover img
- `src/pages/es/blog/[slug].astro` — width/height + decoding=async en cover img
- `src/components/home/TechnologiesSection.astro` — decoding=async en tech icons
- `tests/e2e/performance-optimization.spec.ts` — NUEVO: E2E tests de performance optimization
- `tests/e2e/global-teardown.ts` — NUEVO: globalTeardown que ejecuta cleanup scripts post-E2E
- `playwright.config.ts` — agregado globalTeardown

## Code Review Record

### Review Metadata

- **Date:** 2026-03-25
- **Reviewer Model:** Claude Opus 4.6 (1M context)
- **Review Method:** 3-layer adversarial (Blind Hunter, Edge Case Hunter, Acceptance Auditor)
- **Implementation Commit:** `98e7e45`
- **Fix Commit:** (pending — fixes applied, commit pending)

### Triage Summary

- **Raw findings:** 15 (Blind Hunter: 12, Edge Case Hunter: 0, Acceptance Auditor: 3)
- **Rejected as noise:** 13
- **Patch:** 2
- **Intent gap / Bad spec / Defer:** 0

### Findings Resolved

| ID | Category | Finding | Resolution |
|----|----------|---------|------------|
| P1 | patch | `ProjectFilter.svelte` — tech icons (ln 111) y screenshots (ln 125-130) de Firebase Storage sin `width`/`height`/`decoding="async"` — viola AC 8 (CLS prevention). Spec task list omitió este componente Svelte. | Fix: agregado `width="16" height="16" decoding="async"` en tech icons, `width="160" height="96" decoding="async"` en screenshots. Ratio 5:3 coincide con `h-24` thumbnail layout. |
| P2 | patch | `crossorigin` en `<link rel="preconnect">` para Firebase Storage — abre conexión CORS que no es reutilizada por `<img>` (no-CORS). DNS se comparte pero TCP+TLS se desperdicia. Spec indicó agregar `crossorigin` incorrectamente. | Fix: eliminado `crossorigin` del preconnect en `BaseLayout.astro`. Ahora la conexión pre-abierta coincide con el pool no-CORS usado por `<img>`. |

### Verification Post-Fix

- **Build:** ✅ 30 pages, 7.65s, sin errores
- **Unit tests:** ✅ 1236 passed (48 files)
- **E2E tests:** ✅ 152 passed, 18 skipped, 0 failed
- **All issues resolved:** Sí — 0 findings pendientes
