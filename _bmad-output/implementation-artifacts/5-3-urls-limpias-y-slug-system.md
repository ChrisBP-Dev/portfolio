# Story 5.3: URLs Limpias y Slug System

Status: ready-for-dev

## Story

As a visitor and search engine,
I want clean, readable URLs for all content,
So that URLs are meaningful, shareable and SEO-friendly.

## Acceptance Criteria

1. **Given** a project with slug "mi-portfolio" **When** URL is generated **Then** it's `/projects/mi-portfolio` (EN, default — no prefix) and `/es/projects/mi-portfolio` (ES)
2. **And** a blog post with slug "construyendo-con-bmad" generates `/blog/construyendo-con-bmad` (EN) and `/es/blog/construyendo-con-bmad` (ES)
3. **And** slugs are URL-friendly: lowercase, hyphens, no spaces, no special characters, no IDs or hashes
4. **And** duplicate slugs are prevented (validation at save time) for BOTH projects AND blog posts
5. **And** slugify utility in `src/lib/utils/` generates slugs from titles consistently

> **CORRECCIÓN AC vs Arquitectura:** El AC original dice `(ES)` sin prefijo y `(EN)` con `/en/`. Esto es INCORRECTO. La arquitectura establece `defaultLocale = 'en'` con `prefixDefaultLocale: false`, lo que significa: EN sin prefijo, ES con `/es/`. El AC #1 arriba está corregido para reflejar la implementación real. (FR46)

## Tasks / Subtasks

- [ ] Task 1: Slug uniqueness en ProjectForm (AC: #4)
  - [ ] 1.1 Agregar función `isSlugUnique()` en `ProjectForm.svelte` (replicar patrón de BlogForm: query Firestore `where('slug', '==', value)`, `limit(1)`, excluir ID actual en modo edit)
  - [ ] 1.2 Agregar clave de traducción `admin.projects.slugInUse` en `translations.ts`
  - [ ] 1.3 Integrar validación de unicidad en el flujo `validate()` de ProjectForm, después de la validación de formato Zod
  - [ ] 1.4 Mostrar error `slugInUse` inline con `role="alert"` (mismo patrón de BlogForm)

- [ ] Task 2: Unit tests para slug uniqueness de projects (AC: #4)
  - [ ] 2.1 Agregar tests en `src/components/admin/__tests__/` que verifiquen que la validación de slug duplicado rechaza el submit con mensaje de error apropiado
  - [ ] 2.2 Verificar que modo edit excluye correctamente el ID propio del check de unicidad

- [ ] Task 3: E2E — URLs limpias en sitio público (AC: #1, #2, #3)
  - [ ] 3.1 En `tests/e2e/project-detail.spec.ts`, agregar test que verifique que URLs de detalle de proyecto NO contienen IDs, hashes ni caracteres especiales — solo el patrón `/projects/[a-z0-9-]+`
  - [ ] 3.2 En `tests/e2e/blog-article.spec.ts`, agregar test equivalente para blog: URL debe seguir `/blog/[a-z0-9-]+`
  - [ ] 3.3 Verificar URLs en ambos locales: EN sin prefijo, ES con `/es/`

- [ ] Task 4: E2E — Slug uniqueness en admin projects (AC: #4)
  - [ ] 4.1 En `tests/e2e/admin-projects.spec.ts`, agregar test que cree un proyecto, luego intente crear otro con el mismo slug y verifique el error de unicidad
  - [ ] 4.2 Cleanup: eliminar proyectos de test al finalizar

- [ ] Task 5: Verificación completa del sistema (AC: #3, #5)
  - [ ] 5.1 Ejecutar `pnpm test` — todos los unit tests deben pasar
  - [ ] 5.2 Ejecutar `pnpm test:e2e` — todos los E2E tests deben pasar (incluyendo los nuevos)
  - [ ] 5.3 Verificar build `pnpm build` sin errores

## Dev Notes

### Estado Actual — Lo que YA Existe (NO reimplementar)

El 90% del slug system ya está implementado. El dev DEBE verificar que existe antes de crear:

| Componente | Estado | Archivo |
|-----------|--------|---------|
| `slugify()` utility | ✅ Completo | `src/lib/utils/slugify.ts` |
| slugify unit tests (10) | ✅ Completo | `src/lib/utils/__tests__/slugify.test.ts` |
| Project schema con slug regex | ✅ Completo | `src/lib/schemas/project-schema.ts` |
| BlogPost schema con slug regex | ✅ Completo | `src/lib/schemas/blog-post-schema.ts` |
| Rutas `[slug].astro` para projects | ✅ Completo | `src/pages/projects/[slug].astro`, `src/pages/es/projects/[slug].astro` |
| Rutas `[slug].astro` para blog | ✅ Completo | `src/pages/blog/[slug].astro`, `src/pages/es/blog/[slug].astro` |
| Auto-slug desde EN en ProjectForm | ✅ Completo | `src/components/admin/ProjectForm.svelte:95-100` |
| Auto-slug desde EN en BlogForm | ✅ Completo | `src/components/admin/BlogForm.svelte` |
| `isSlugUnique()` para blog | ✅ Completo | `src/components/admin/BlogForm.svelte:141-146` |
| Traducción `admin.blog.slugInUse` | ✅ Completo | `src/lib/i18n/translations.ts` |
| `getStaticPaths()` con slugs | ✅ Completo | Todas las pages `[slug].astro` |
| **`isSlugUnique()` para projects** | **❌ FALTA** | `src/components/admin/ProjectForm.svelte` |
| **Traducción `admin.projects.slugInUse`** | **❌ FALTA** | `src/lib/i18n/translations.ts` |
| **E2E de URL limpia (regex en URL)** | **❌ FALTA** | `tests/e2e/project-detail.spec.ts`, `tests/e2e/blog-article.spec.ts` |
| **E2E de slug duplicado en projects** | **❌ FALTA** | `tests/e2e/admin-projects.spec.ts` |

### Implementación de isSlugUnique para Projects

Replicar exactamente el patrón de `BlogForm.svelte:141-146`:

```typescript
// En ProjectForm.svelte — DENTRO del componente (no importar de collections.ts, evita side-effects Admin SDK)
const PROJECTS_COLLECTION = 'Projects';

async function isSlugUnique(slugValue: string, excludeId?: string): Promise<boolean> {
  const q = query(collection(db, PROJECTS_COLLECTION), where('slug', '==', slugValue), limit(1));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return true;
  return excludeId ? snapshot.docs[0]!.id === excludeId : false;
}
```

Integrar en `validateAll()` — actualmente es síncrona (`function validateAll(): boolean`). Cambios requeridos:

**Paso A:** Convertir `validateAll()` a async:
```typescript
// ANTES:  function validateAll(): boolean {
// DESPUÉS: async function validateAll(): Promise<boolean> {
```

**Paso B:** Agregar check de unicidad DESPUÉS de la validación Zod (antes del `return`):
```typescript
// Justo antes de: return Object.keys(newErrors).length === 0;
// Agregar:
if (!newErrors.slug && slug.trim()) {
  const excludeId = mode === 'edit' && initialData ? initialData.id : undefined;
  const unique = await isSlugUnique(slug.trim(), excludeId);
  if (!unique) {
    newErrors.slug = t('admin.projects.slugInUse', locale);
  }
}

errors = newErrors;
return Object.keys(newErrors).length === 0;
```

**Paso C:** Actualizar `handleSubmit()` para usar `await`:
```typescript
// ANTES:  if (!validateAll()) {
// DESPUÉS: if (!(await validateAll())) {
```

El patrón es idéntico a `BlogForm.svelte:205-238` donde `validateAll()` ya es async.

### Imports necesarios en ProjectForm.svelte

Import actual (línea 3):
```typescript
import { collection, addDoc, updateDoc, deleteDoc, doc, deleteField, getDocs } from 'firebase/firestore';
```
Agregar `query`, `where`, `limit` al import existente:
```typescript
import { collection, addDoc, updateDoc, deleteDoc, doc, deleteField, getDocs, query, where, limit } from 'firebase/firestore';
```

### Traducción a agregar

En `src/lib/i18n/translations.ts`, agregar junto a las otras traducciones de admin projects:

```typescript
'admin.projects.slugInUse': { es: 'Este slug ya está en uso', en: 'This slug is already in use' },
```

### Patrón de URL Establecido

```
EN (default, sin prefijo):     /projects/{slug}     /blog/{slug}
ES (con prefijo /es/):         /es/projects/{slug}  /es/blog/{slug}
```

- `defaultLocale = 'en'`, `prefixDefaultLocale: false`
- Slug es el MISMO para ambos locales — el contenido localizado se resuelve por `getLocaleFromUrl()`
- Slugs SIEMPRE se generan desde el campo EN usando `slugify()`
- Regex de slug: `/^[a-z0-9]+(?:-[a-z0-9]+)*$/`

### E2E Test Patterns

**URL limpia validation pattern** (agregar a tests existentes):
```typescript
test('URL uses clean slug format — no IDs or hashes', async ({ page }) => {
  const url = page.url();
  const slugMatch = url.match(/\/projects\/([^/]+)$/);
  expect(slugMatch).toBeTruthy();
  expect(slugMatch![1]).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
});
```

**Slug uniqueness E2E** (agregar a admin-projects.spec.ts):
```typescript
test('rejects duplicate slug on create', async ({ page }) => {
  // 1. Crear proyecto con nombre único
  // 2. Intentar crear otro proyecto con el MISMO companyName EN (genera mismo slug)
  // 3. Activar "Edit slug manually" y poner el slug del primer proyecto
  // 4. Submit → esperar error "already in use"
  // 5. Cleanup: eliminar proyecto creado
});
```

**Admin E2E helpers disponibles:** `ensureAdminLogin()`, `fillVisible()`, `clearAndFillVisible()`, `clickListAction()` — importar desde `./admin-helpers`.

### Anti-patterns — NO Hacer

- **NO reimplementar `slugify()`** — ya existe y tiene 10 unit tests
- **NO modificar rutas `[slug].astro`** — el routing ya funciona correctamente
- **NO agregar validación server-side en Firestore rules** — es client-side best-effort (TOCTOU race aceptado, igual que blog)
- **NO cambiar prefijo de locale** — EN sin prefijo es la arquitectura establecida
- **NO importar de `collections.ts` en componentes admin** — usar constante local `const PROJECTS_COLLECTION = 'Projects'` para evitar side-effects del Admin SDK en browser
- **NO crear archivo nuevo para la utilidad de unicidad** — debe vivir DENTRO de ProjectForm.svelte como función privada (mismo patrón que BlogForm)

### Project Structure Notes

- Alineado con la estructura unificada del proyecto
- No se crean archivos nuevos de utilidades — solo modificaciones a archivos existentes
- Los tests E2E siguen los patrones establecidos en stories previas (5-1, 5-2)

### References

- [Source: _bmad-output/planning-artifacts/epics.md — Epic 5, Story 5.3 (FR46)]
- [Source: _bmad-output/planning-artifacts/architecture.md — Frontend Architecture, Routing]
- [Source: _bmad-output/planning-artifacts/architecture.md — Data Architecture, Gap Analysis #2 (blog slug uniqueness)]
- [Source: _bmad-output/planning-artifacts/prd.md — FR46, SEO Strategy]
- [Source: _bmad-output/project-context.md — Slug auto-generation desde EN, exactOptionalPropertyTypes]
- [Source: src/components/admin/BlogForm.svelte:141-146 — isSlugUnique pattern to replicate]
- [Source: src/components/admin/ProjectForm.svelte:95-100 — Auto-slug from EN existing implementation]

### Previous Story Intelligence (5-2)

- Story 5-2 completada con éxito: sitemap, robots.txt, JSON-LD structured data
- 1230 unit tests y 128 E2E tests pasando al completar 5-2
- Scripts de cleanup creados: `cleanup:e2e` y `cleanup:images`
- Fix de XSS escape en BaseLayout aplicado
- Toast deduplication fix aplicado
- Navigation tab "Experience" muerta eliminada
- Patrón de testing E2E establecido en `seo-validation.spec.ts` para referencia

### Git Intelligence

Últimos commits relevantes:
- `f471794` fix: JSON-LD type errors — `exactOptionalPropertyTypes` compat (respetar este patrón para props opcionales)
- `e1459cb` fix: remove dead Experience nav tab
- `fba201c` fix: code review story 5-2 — negative E2E tests pattern established
- `842f709` feat: story 5-2 — implementación principal

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
