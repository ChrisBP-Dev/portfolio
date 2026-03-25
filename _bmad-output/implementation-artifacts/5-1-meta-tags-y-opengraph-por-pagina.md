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

- [ ] Task 1: Crear imagen OG default del sitio (AC: 1, 2, 6)
  - [ ] 1.1 Crear imagen estática 1200×630px en `public/images/og-default.png` con branding del portfolio (nombre, rol, fondo dark theme)
  - [ ] 1.2 Optimizar la imagen (WebP o PNG comprimido, <200KB)

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

- [ ] Task 6: Unit tests para lógica de meta tags (AC: 1, 2, 3)
  - [ ] 6.1 Test que verifica URL absoluta de OG default image se genera correctamente
  - [ ] 6.2 Test que verifica lógica de fallback: con ogImage prop → usa prop, sin prop → usa default

- [ ] Task 7: E2E tests de meta tags por tipo de página (AC: 1, 2, 3, 4, 5, 6)
  - [ ] 7.1 E2E Home page: verificar presencia de `og:title`, `og:description`, `og:image` (default), `og:type=website`, `twitter:card`, `twitter:image`
  - [ ] 7.2 E2E Project detail page: verificar `og:image` apunta a `project.mainImage.url`, `og:type=website`
  - [ ] 7.3 E2E Blog post page: verificar `og:image` apunta a `coverImage.url`, `og:type=article`
  - [ ] 7.4 E2E Contact page: verificar `og:image` (default), description única
  - [ ] 7.5 E2E verificar que `meta[name="description"]` es única en cada página (no repetida)
  - [ ] 7.6 E2E verificar `twitter:card=summary_large_image` en todas las páginas

## Dev Notes

### Estado Actual — Qué YA Existe

BaseLayout.astro (líneas 57-67) ya implementa:
- `og:title`, `og:description`, `og:url`, `og:locale`, `og:site_name`, `og:type` — siempre presentes
- `og:image`, `twitter:image` — condicionales (`{ogImage && ...}`)
- `twitter:card` — dinámico (`summary_large_image` si hay imagen, `summary` si no)
- hreflang `es`, `en`, `x-default` — completos con URLs absolutas
- `<link rel="canonical">` — correcto por locale

Blog posts (`blog/[slug].astro` líneas 42-48): **COMPLETAMENTE implementados** — pasan `ogImage={post.coverImage?.url}` y `ogType="article"`. Incluyen extracción inteligente de texto TipTap para OG description con truncado a 157 chars respetando word boundary.

Project detail pages (`projects/[slug].astro` líneas 42-46): **FALTA** `ogImage` — `project.mainImage.url` está disponible pero NO se pasa a BaseLayout.

Home, Projects listing, Blog listing, Contact: Tienen descriptions únicas via translation keys pero **NINGUNA** pasa `ogImage`.

### Cambios Mínimos Requeridos

1. **BaseLayout.astro**: Cambiar `og:image` y `twitter:image` de condicional a siempre-presente con fallback a imagen default. Cambiar `twitter:card` a siempre `summary_large_image`.

2. **projects/[slug].astro** y **es/projects/[slug].astro**: Agregar `ogImage={project.mainImage.url}` al componente BaseLayout (una línea por archivo).

3. **Imagen default**: Crear `public/images/og-default.png` (1200×630px) — imagen de branding del portfolio.

### Patrón de Implementación OG Image Fallback

```astro
---
// En BaseLayout.astro — construir URL absoluta del default
const defaultOgImage = new URL('/images/og-default.png', Astro.site).href;
const resolvedOgImage = ogImage ?? defaultOgImage;
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
- Formato: PNG (máxima compatibilidad con crawlers sociales)
- Contenido sugerido: Nombre "ChrisBP", subtítulo con rol (developer), fondo dark theme del portfolio, logo si aplica
- Ubicación: `public/images/og-default.png` — servido estáticamente, no procesado por Astro Image
- Assets disponibles para referenciar: `src/assets/logo/cbp-large-logo-dark.png`, `src/assets/logo/cbp-short-logo-dark.png`

### Project Structure Notes

- BaseLayout ya recibe props opcionales `ogImage`, `ogType`, `ogDescription` — no se necesitan cambios en la interfaz Props
- La URL del sitio está configurada en `astro.config.mjs`: `site: 'https://portfolio-chrisbp.web.app'`
- `Astro.site` disponible en BaseLayout para construir URLs absolutas de la imagen default
- Archivos a modificar: `src/layouts/BaseLayout.astro`, `src/pages/projects/[slug].astro`, `src/pages/es/projects/[slug].astro`
- Archivo a crear: `public/images/og-default.png`
- NO modificar: `src/pages/blog/[slug].astro` (ya completo), `src/pages/es/blog/[slug].astro` (ya completo)

### Testing Patterns

- E2E tests en `tests/e2e/` — usar `page.locator('meta[property="og:image"]').getAttribute('content')` para verificar meta tags
- E2E contra `pnpm preview` (build estático) — meta tags se generan en build time
- Lighthouse CI ya tiene gate SEO >= 0.95 — esta story debería mantener o mejorar ese score
- E2E debe verificar BOTH locales (EN sin prefijo, ES con `/es/`)
- Pattern para verificar meta: `await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', expectedTitle)`

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
- `6954fe8` docs: update project-context.md — 114→165 rules (Epic 4 + quick dev patterns)
- `e992154` docs: epic 4 retrospective — zero defers, E2E in every story, prep for Epic 5
- `5be498f` fix: cleanup orphaned images on edit-mode save failure retry

La retrospectiva de Epic 4 confirma que Blog OG está completo y que Epic 5 debe enfocarse en las páginas restantes (Home, Projects, Contact).

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
