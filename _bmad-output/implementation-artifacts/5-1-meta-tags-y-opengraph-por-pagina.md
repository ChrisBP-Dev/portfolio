# Story 5.1: Meta Tags y OpenGraph por Página

Status: ready-for-dev

## Story

As a visitor sharing the portfolio link,
I want each page to have proper meta tags and OpenGraph data,
So that links look professional when shared on LinkedIn and social media.

## Acceptance Criteria

1. **Given** cualquier página pública **When** renderizada **Then** `<head>` incluye: `<title>`, `<meta name="description">`, `og:title`, `og:description`, `og:image`, `og:url`, `og:type`, `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`
2. **Given** Home page **When** compartida **Then** tiene OG a nivel portfolio (nombre de Christopher, rol, descripción del portfolio, imagen default del sitio)
3. **Given** Project detail page **When** compartida **Then** tiene OG específico del proyecto (nombre del proyecto, descripción, imagen principal del proyecto)
4. **Given** Blog post page **When** compartida **Then** tiene OG específico del artículo (título, excerpt, cover image) — YA IMPLEMENTADO en Epic 4
5. **Given** meta descriptions **When** verificadas **Then** son únicas por página, no genéricas — YA IMPLEMENTADO via translation keys
6. **Given** OG images **When** renderizadas **Then** tienen dimensiones apropiadas para preview de redes sociales (1200×630px recomendado)

**(FR42, FR43)**

## Tasks / Subtasks

- [ ] Task 1: Crear imagen OG default del sitio (AC: 1, 2, 6) — PASO MANUAL/HERRAMIENTA
  - [ ] 1.1 Crear imagen estática 1200×630px en `public/images/og-default.png` con branding del portfolio (nombre "ChrisBP", rol developer, fondo dark theme). **Approach:** Usar Canva MCP, Figma, o crear manualmente — el dev agent NO puede generar imágenes pixel-perfect. Assets de referencia: `src/assets/logo/cbp-large-logo-dark.png`, `cbp-short-logo-dark.png`
  - [ ] 1.2 Optimizar la imagen (PNG comprimido, <200KB) — verificar con `ls -la public/images/og-default.png`

- [ ] Task 2: Actualizar BaseLayout para fallback OG image (AC: 1, 2)
  - [ ] 2.1 En `BaseLayout.astro`, renderizar `og:image` SIEMPRE — si `ogImage` prop no existe, usar la imagen default (`/images/og-default.png` con URL absoluta via `Astro.site`)
  - [ ] 2.2 Renderizar `twitter:image` SIEMPRE con la misma lógica de fallback
  - [ ] 2.3 `twitter:card` debe ser `summary_large_image` siempre (ya que siempre habrá imagen)

- [ ] Task 3: Pasar ogImage en Project detail pages (AC: 3)
  - [ ] 3.1 En `src/pages/projects/[slug].astro` (línea 42-46), agregar `ogImage={project.mainImage.url}` al componente BaseLayout
  - [ ] 3.2 En `src/pages/es/projects/[slug].astro`, aplicar el mismo cambio

- [ ] Task 4: Verificar Blog post pages (AC: 4)
  - [ ] 4.1 Confirmar que `src/pages/blog/[slug].astro` ya pasa `ogImage={post.coverImage?.url}` y `ogType="article"` — solo verificar, no modificar
  - [ ] 4.2 Confirmar que `src/pages/es/blog/[slug].astro` tiene la misma implementación

- [ ] Task 5: Agregar traducciones OG faltantes si es necesario (AC: 2, 5)
  - [ ] 5.1 Verificar que todas las páginas tienen description traducida y única. Revisar: Home, Projects listing, Blog listing, Contact. Todas ya usan translation keys (`t('*.meta.description', locale)`)

- [ ] Task 6: Utility function + Unit test para lógica OG (AC: 1, 2, 3)
  - [ ] 6.1 Crear `src/lib/utils/seo.ts` con función `resolveOgImage(ogImage?: string, siteUrl?: URL): string` que encapsula la lógica de fallback (devuelve URL absoluta siempre)
  - [ ] 6.2 Unit test en `src/lib/utils/__tests__/seo.test.ts`: con ogImage prop → devuelve prop tal cual, sin prop → devuelve `https://portfolio-chrisbp.web.app/images/og-default.png`
  - [ ] 6.3 Usar `resolveOgImage()` en BaseLayout.astro en lugar de inline `ogImage ?? defaultOgImage`
  - NOTA: El proyecto NO tiene `@astrojs/test-utils` — no se pueden unit-testear componentes Astro. Por eso se extrae a función pura testeable con Vitest

- [ ] Task 7: E2E tests de meta tags por tipo de página (AC: 1, 2, 3, 4, 5, 6)
  - [ ] 7.1 En `tests/e2e/home-page.spec.ts`: verificar los 11 meta tags del AC1 — `og:title`, `og:description`, `og:image` (contiene `/images/og-default.png`), `og:url` (URL absoluta), `og:type=website`, `twitter:card=summary_large_image`, `twitter:title`, `twitter:description`, `twitter:image`. Verificar AMBOS locales (EN `/` y ES `/es/`)
  - [ ] 7.2 En `tests/e2e/project-detail.spec.ts`: verificar `og:image` apunta a URL de Firebase Storage (no default), `og:url` es URL absoluta, `og:type=website`, `twitter:card=summary_large_image`, `twitter:title`, `twitter:description`
  - [ ] 7.3 En `tests/e2e/blog-article.spec.ts`: verificar que los tests OG existentes siguen pasando (ya tiene `og:title`, `og:type=article`, `twitter:card`) — agregar verificación de `og:image` apunta a `coverImage.url`, `twitter:image` presente
  - [ ] 7.4 En `tests/e2e/contact-page.spec.ts`: verificar `og:image` (contiene `/images/og-default.png`), `og:url`, description única, `twitter:card=summary_large_image`
  - [ ] 7.5 E2E cross-page: verificar que `meta[name="description"]` es única en cada página (no repetida entre Home, Projects, Blog, Contact)
  - [ ] 7.6 E2E cross-page: verificar `twitter:card=summary_large_image` en TODAS las páginas públicas

## Dev Notes

### Estado Actual y Cambios Requeridos

**BaseLayout.astro** (líneas 57-67) — tags siempre presentes: `og:title`, `og:description`, `og:url`, `og:locale`, `og:site_name`, `og:type`, hreflang `es`/`en`/`x-default`, canonical. **CAMBIAR:** `og:image` y `twitter:image` (actualmente condicionales con `{ogImage && ...}`) → siempre-presente con fallback a imagen default. `twitter:card` (actualmente dinámico) → siempre `summary_large_image`.

**Blog posts** (`blog/[slug].astro` líneas 42-48): **COMPLETO** — pasan `ogImage={post.coverImage?.url}`, `ogType="article"`, OG description con truncado TipTap a 157 chars. **NO MODIFICAR.**

**Project detail pages** (`projects/[slug].astro` líneas 42-46): **CAMBIAR** — agregar `ogImage={project.mainImage.url}` al BaseLayout (una línea por archivo, EN y ES).

**Home, Projects listing, Blog listing, Contact:** Tienen descriptions únicas via translation keys. **NO necesitan cambios** — el fallback de BaseLayout (Task 2) les dará automáticamente la imagen OG default. No pasar `ogImage` prop = usar default.

**Imagen default:** Crear `public/images/og-default.png` (1200×630px) — ver Task 1 para approach.

### Patrón de Implementación OG Image Fallback

```typescript
// src/lib/utils/seo.ts — función pura testeable con Vitest
export function resolveOgImage(ogImage?: string, siteUrl?: URL): string {
  if (ogImage) return ogImage;
  return new URL('/images/og-default.png', siteUrl).href;
}
```

```astro
---
// En BaseLayout.astro — importar y usar
import { resolveOgImage } from '../lib/utils/seo';
const resolvedOgImage = resolveOgImage(ogImage, Astro.site);
---
<!-- Siempre renderizar og:image -->
<meta property="og:image" content={resolvedOgImage} />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:image" content={resolvedOgImage} />
```

### Patrón Existente a Replicar (Blog → Projects)

```astro
<!-- blog/[slug].astro ya hace esto: -->
<BaseLayout
  title={post.title[locale] + ' — ChrisBP'}
  description={ogDesc}
  currentPage="blog"
  ogImage={post.coverImage?.url}
  ogType="article"
>

<!-- projects/[slug].astro debe hacer esto: -->
<BaseLayout
  title={project.companyName[locale] + ' — ChrisBP'}
  description={project.shortDescription[locale]}
  currentPage="projects"
  ogImage={project.mainImage.url}
>
```

### Imagen OG Default — Requisitos

- Dimensiones: 1200×630px (ratio 1.91:1 — estándar OpenGraph)
- Formato: PNG (máxima compatibilidad con crawlers sociales), <200KB
- Contenido: Nombre "ChrisBP", subtítulo con rol (developer), fondo dark theme del portfolio
- Ubicación: `public/images/og-default.png` — servido estáticamente, no procesado por Astro Image
- Assets de referencia: `src/assets/logo/cbp-large-logo-dark.png`, `cbp-short-logo-dark.png`
- **Approach:** Paso manual o via herramienta (Canva MCP, Figma). Debe existir ANTES de ejecutar Tasks 2-7

### Project Structure Notes

- BaseLayout ya recibe props opcionales `ogImage`, `ogType`, `ogDescription` — no se necesitan cambios en la interfaz Props
- La URL del sitio está configurada en `astro.config.mjs`: `site: 'https://portfolio-chrisbp.web.app'`
- `Astro.site` disponible en BaseLayout para construir URLs absolutas de la imagen default
- Archivos a modificar: `src/layouts/BaseLayout.astro`, `src/pages/projects/[slug].astro`, `src/pages/es/projects/[slug].astro`
- Archivo a crear: `public/images/og-default.png`
- NO modificar: `src/pages/blog/[slug].astro` (ya completo), `src/pages/es/blog/[slug].astro` (ya completo)

### Testing Patterns

- E2E contra `pnpm preview` (build estático) — meta tags se generan en build time
- Lighthouse CI gate SEO >= 0.95 — esta story debe mantener o mejorar
- E2E debe verificar AMBOS locales (EN sin prefijo `/`, ES con `/es/`)
- Unit tests van en `src/lib/utils/__tests__/seo.test.ts` (Vitest)
- E2E tests van en archivos EXISTENTES — no crear archivo monolítico nuevo:
  - `tests/e2e/home-page.spec.ts` — tests OG para Home
  - `tests/e2e/project-detail.spec.ts` — tests OG para Project detail
  - `tests/e2e/blog-article.spec.ts` — ampliar tests OG existentes
  - `tests/e2e/contact-page.spec.ts` — tests OG para Contact

### Patrón E2E Existente (de `blog-article.spec.ts` — REPLICAR)

```typescript
// Este patrón ya funciona en blog-article.spec.ts — replicar en otros spec files
test('OG meta tags present with type article', async ({ page }) => {
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', /.+/);
  await expect(page.locator('meta[property="og:description"]')).toHaveAttribute('content', /.+/);
  await expect(page.locator('meta[property="og:type"]')).toHaveAttribute('content', 'article');
});

// Para Home/Contact — verificar imagen default:
await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /\/images\/og-default\.png$/);
// Para Project detail — verificar imagen de Firebase Storage:
await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /firebasestorage\.googleapis\.com/);
// Verificar URL absoluta en og:url:
await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', /^https:\/\//);
// Verificar twitter tags completos:
await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image');
await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute('content', /.+/);
await expect(page.locator('meta[name="twitter:description"]')).toHaveAttribute('content', /.+/);
await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute('content', /.+/);
```

### Anti-Patrones a Evitar

- NUNCA hacer og:image condicional — siempre debe existir (con fallback)
- NUNCA usar URLs relativas en og:image — los crawlers sociales requieren URLs absolutas
- NUNCA generar la imagen default con Astro Image (`<Image />`) — usar archivo estático en `public/` para garantizar URL predecible
- NUNCA hardcodear la URL del sitio — usar `Astro.site` para construir URLs absolutas
- NUNCA modificar la implementación existente de blog posts — ya funciona correctamente

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 5.1] — Acceptance criteria y user story
- [Source: _bmad-output/planning-artifacts/architecture.md#SEO] — Decision 9: Meta tags estáticos en build time
- [Source: _bmad-output/planning-artifacts/architecture.md#FR42-FR46] — Archivos de implementación: BaseLayout.astro, robots.txt, astro.config.mjs
- [Source: _bmad-output/planning-artifacts/prd.md#FR42-FR43] — Meta tags y OpenGraph por página
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Accessibility Strategy] — WCAG 2.1 AA, HTML semántico
- [Source: _bmad-output/project-context.md#Layouts] — BaseLayout props: title, description, currentPage, ogImage, ogType, ogDescription
- [Source: _bmad-output/implementation-artifacts/epic-4-retro-2026-03-24.md] — Blog OG ya implementado, slug-from-EN fix aplicado

### Git Intelligence

Commits recientes relevantes:
- `3ebbc8e` docs: create story 5-1 meta tags y OpenGraph por página
- `6954fe8` docs: update project-context.md — 114→165 rules (Epic 4 + quick dev patterns)
- `e992154` docs: epic 4 retrospective — zero defers, E2E in every story, prep for Epic 5
- `5be498f` fix: cleanup orphaned images on edit-mode save failure retry

**Epic 4 Retrospective — Acuerdos que aplican a esta story:**
- E2E obligatorio para toda story con UI — verificar meta tags en browser real
- Tests deben ser sustantivos (verificar comportamiento, no solo que mocks fueron llamados)
- Browser verification = Definition of Done
- Specs validados contra código real antes de crear stories
- Epic 4 completó 5/5 stories, 0 defers, 1163 unit + 116 E2E tests totales
- Blog OG completo, Epic 5 enfocado en páginas restantes (Home, Projects, Contact)

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
