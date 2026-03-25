# Story 5.3: URLs Limpias y Slug System

Status: review

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

- [x] Task 1: Slug uniqueness en ProjectForm (AC: #4)
  - [x] 1.1 Agregar función `isSlugUnique()` en `ProjectForm.svelte` (replicar patrón de BlogForm: query Firestore `where('slug', '==', value)`, `limit(1)`, excluir ID actual en modo edit)
  - [x] 1.2 Agregar clave de traducción `admin.projects.slugInUse` en `translations.ts`
  - [x] 1.3 Integrar validación de unicidad en el flujo `validate()` de ProjectForm, después de la validación de formato Zod
  - [x] 1.4 Mostrar error `slugInUse` inline con `role="alert"` (mismo patrón de BlogForm)

- [x] Task 2: Unit tests para slug uniqueness de projects (AC: #4)
  - [x] 2.1 Crear `src/components/admin/__tests__/project-form.test.ts` replicando el patrón exacto de `blog-form.test.ts:137-180` — mockear `firebase/firestore` con `vi.hoisted()` + `vi.mock()`, NO montar el componente Svelte
  - [x] 2.2 Tests: query usa collection `Projects` y field `slug`, retorna `true` cuando vacío, retorna `false` cuando slug existe sin excludeId, retorna `true` cuando slug existe pero matches excludeId (edit mode)

- [x] Task 3: E2E — URLs limpias en sitio público (AC: #1, #2, #3)
  - [x] 3.1 En `tests/e2e/project-detail.spec.ts`, agregar test en bloque `'Project Detail Page — EN'` que extraiga el slug de `page.url()` y valide con regex `/^[a-z0-9]+(-[a-z0-9]+)*$/` — NO contiene IDs, hashes ni caracteres especiales
  - [x] 3.2 Blog: los tests de URL limpia YA EXISTEN en `blog-article.spec.ts` (líneas 15, 21, 99, 105 — `waitForURL(/\/blog\/[a-z0-9-]+$/)` y `toHaveURL`). Verificar que cubren el AC — NO crear tests duplicados
  - [x] 3.3 EN: agregar test en bloque `'Project Detail Page — EN'`. ES: actualizar regex en `project-detail.spec.ts:85` de `/\/es\/projects\/.+/` (demasiado permisiva) a `/\/es\/projects\/[a-z0-9-]+$/` + agregar test equivalente de slug extraction en bloque ES

- [x] Task 4: E2E — Slug uniqueness en admin projects (AC: #4)
  - [x] 4.1 En `tests/e2e/admin-projects.spec.ts`, agregar test en nuevo `test.describe` serial: crear proyecto con `UNIQUE()`, luego crear segundo proyecto, activar checkbox de slug manual (`input[type="checkbox"]` junto a label slug), pegar slug del primero, submit → esperar error `slugInUse` con `role="alert"`
  - [x] 4.2 Cleanup: eliminar ambos proyectos de test al finalizar (usar `clickListAction` + confirm dialog)

- [x] Task 5: Verificación completa del sistema (AC: #3, #5)
  - [x] 5.1 Ejecutar `pnpm test` — todos los unit tests deben pasar (esperado: ~1234+, 4 nuevos de slug uniqueness)
  - [x] 5.2 Ejecutar `pnpm test:e2e` — todos los E2E tests deben pasar (esperado: ~132+, 3-4 nuevos de URL limpia y slug uniqueness)
  - [x] 5.3 Verificar build `pnpm build` sin errores

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
| Auto-slug desde EN en ProjectForm | ✅ Completo | `src/components/admin/ProjectForm.svelte:95-100` (solo en CREATE mode, usa `manualSlug` flag) |
| Auto-slug desde EN en BlogForm | ✅ Completo | `src/components/admin/BlogForm.svelte` |
| `isSlugUnique()` para blog | ✅ Completo | `src/components/admin/BlogForm.svelte:141-146` |
| Traducción `admin.blog.slugInUse` | ✅ Completo | `src/lib/i18n/translations.ts` |
| `getStaticPaths()` con slugs | ✅ Completo | Todas las pages `[slug].astro` |
| **`isSlugUnique()` para projects** | **❌ FALTA** | `src/components/admin/ProjectForm.svelte` |
| **Traducción `admin.projects.slugInUse`** | **❌ FALTA** | `src/lib/i18n/translations.ts` |
| E2E de URL limpia para blog | ✅ Ya existe | `tests/e2e/blog-article.spec.ts:15,21,99,105` — `waitForURL(/\/blog\/[a-z0-9-]+$/)` |
| **E2E de URL limpia para projects** | **❌ FALTA** | `tests/e2e/project-detail.spec.ts` (EN no valida regex, ES usa `.+` demasiado permisiva) |
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

Integrar en `validateAll()` — actualmente es síncrona (línea 197: `function validateAll(): boolean`). Cambios requeridos:

**Paso A:** Convertir `validateAll()` a async (línea 197):
```typescript
// ANTES:  function validateAll(): boolean {
// DESPUÉS: async function validateAll(): Promise<boolean> {
```

**Paso B:** Agregar check de unicidad DESPUÉS de la validación de mainImage (línea 247) y ANTES de `errors = newErrors` (línea 249). Alinear con patrón de BlogForm (early return):
```typescript
// Insertar entre línea 247 (mainImage check) y línea 249 (errors = newErrors):
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

**Paso C:** Actualizar `handleSubmit()` para usar `await` (línea 421):
```typescript
// ANTES:  if (!validateAll()) {
// DESPUÉS: if (!(await validateAll())) {
```

El patrón es idéntico a `BlogForm.svelte:205-238` donde `validateAll()` ya es async.

**NOTA:** ProjectForm usa `manualSlug` (no `slugManuallyEdited` como BlogForm). Auto-slug solo se genera en CREATE mode (`if (!manualSlug && mode === 'create')`). En EDIT mode el slug siempre es manual.

### Imports necesarios en ProjectForm.svelte

Línea 3 — agregar `query`, `where`, `limit` al import existente:
```typescript
// ANTES:
import { collection, addDoc, updateDoc, deleteDoc, doc, deleteField, getDocs } from 'firebase/firestore';
// DESPUÉS:
import { collection, addDoc, updateDoc, deleteDoc, doc, deleteField, getDocs, query, where, limit } from 'firebase/firestore';
```

`PROJECTS_COLLECTION` ya existe en línea 26: `const PROJECTS_COLLECTION = 'Projects';` — NO duplicar.

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

**URL limpia — projects** (agregar DENTRO de `test.describe('Project Detail Page — EN')` en `project-detail.spec.ts`):
```typescript
test('URL uses clean slug format — no IDs or hashes', async ({ page }) => {
  const url = page.url();
  const slugMatch = url.match(/\/projects\/([^/]+)$/);
  expect(slugMatch).toBeTruthy();
  expect(slugMatch![1]).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
});
```

**URL limpia — projects ES** (actualizar regex existente en `test.describe('Project Detail Page — ES')` línea 85):
```typescript
// ANTES:  await expect(page).toHaveURL(/\/es\/projects\/.+/);
// DESPUÉS: await expect(page).toHaveURL(/\/es\/projects\/[a-z0-9-]+$/);
```
Y agregar test equivalente de slug extraction en el bloque ES.

**URL limpia — blog**: YA EXISTE. `blog-article.spec.ts` ya tiene `waitForURL(/\/blog\/[a-z0-9-]+$/)` en líneas 15, 21 (EN) y 99, 105 (ES). NO crear tests duplicados.

**Slug uniqueness E2E** (nuevo `test.describe` serial en `admin-projects.spec.ts`):
```typescript
test.describe('Admin Projects — Slug Uniqueness', () => {
  test.describe.configure({ mode: 'serial' });
  let firstName: string;

  test.beforeEach(async ({ page }) => {
    await ensureAdminLogin(page);
  });

  test('rejects duplicate slug on create', async ({ page }) => {
    firstName = UNIQUE();
    // 1. Crear primer proyecto con firstName
    await page.goto('/admin/projects');
    await page.locator('button', { hasText: /crear nuevo/i }).click();
    await fillVisible(page.locator('#project-companyName-es'), firstName);
    await fillVisible(page.locator('#project-companyName-en'), `${firstName}-en`);
    await fillVisible(page.locator('#project-shortDescription-es'), 'Desc ES');
    await fillVisible(page.locator('#project-shortDescription-en'), 'Desc EN');
    await page.locator('input[type="file"][accept="image/*"]').first().setInputFiles(TEST_IMAGE);
    await page.waitForTimeout(1_000);
    await page.locator('button[type="submit"]').click();
    await expect(page.locator('text=/guardado exitosamente/i')).toBeVisible({ timeout: 20_000 });

    // 2. Crear segundo proyecto, activar slug manual, pegar slug del primero
    await page.locator('button', { hasText: /crear nuevo/i }).click();
    await fillVisible(page.locator('#project-companyName-es'), UNIQUE());
    await fillVisible(page.locator('#project-companyName-en'), UNIQUE());
    await fillVisible(page.locator('#project-shortDescription-es'), 'Desc ES 2');
    await fillVisible(page.locator('#project-shortDescription-en'), 'Desc EN 2');
    // Activar checkbox de slug manual
    const slugCheckbox = page.locator('input[type="checkbox"]').filter({ hasText: /manual/i });
    // NOTA: si el checkbox no tiene texto visible, localizar por proximity al label de slug
    await slugCheckbox.check();
    await clearAndFillVisible(page.locator('#slug'), slugify(`${firstName}-en`));
    await page.locator('input[type="file"][accept="image/*"]').first().setInputFiles(TEST_IMAGE);
    await page.waitForTimeout(1_000);
    await page.locator('button[type="submit"]').click();

    // 3. Verificar error de unicidad
    await expect(page.locator('[role="alert"]').filter({ hasText: /ya está en uso|already in use/i })).toBeVisible({ timeout: 10_000 });

    // 4. Cleanup: navegar atrás y eliminar primer proyecto
  });
});
```

**Admin E2E helpers disponibles:** `ensureAdminLogin()`, `fillVisible()`, `clearAndFillVisible()`, `clickListAction()` — importar desde `./admin-helpers`.
**Constantes establecidas:** `UNIQUE = () => \`e2e-test-\${Date.now()}\``, `TEST_IMAGE = path.join(process.cwd(), 'tests', 'e2e', 'fixtures', 'test-image.png')`.

### Unit Test Pattern para Slug Uniqueness (Task 2)

Replicar patrón exacto de `blog-form.test.ts:137-180`. Crear `project-form.test.ts`:
```typescript
// Mock con vi.hoisted() — ANTES de vi.mock()
const { mockGetDocs, mockQuery, mockWhere, mockLimit, mockCollection } = vi.hoisted(() => ({
  mockGetDocs: vi.fn(() => Promise.resolve({ empty: true, docs: [] })),
  mockQuery: vi.fn((..._args: unknown[]) => ({ _query: true })),
  mockWhere: vi.fn((_f: string, _op: string, _v: unknown) => ({ _where: true })),
  mockLimit: vi.fn((_n: number) => ({ _limit: true })),
  mockCollection: vi.fn((_db: unknown, _col: string) => ({ _col })),
}));

vi.mock('firebase/firestore', () => ({
  getDocs: mockGetDocs, query: mockQuery, where: mockWhere,
  limit: mockLimit, collection: mockCollection,
  // ... otros mocks necesarios
}));

describe('ProjectForm — slug uniqueness', () => {
  it('query uses collection Projects and field slug', async () => { ... });
  it('returns true when no matching slug found', async () => { ... });
  it('returns false when slug exists and no excludeId', async () => { ... });
  it('returns true when slug exists but matches excludeId (edit mode)', async () => { ... });
});
```

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
Claude Opus 4.6 (1M context)

### Debug Log References
- Unit tests: 1236 passed (4 nuevos de slug uniqueness)
- Build: exitoso sin errores (30 páginas, 7.74s)
- E2E tests: 147 passed, 0 failed, 17 skipped (4 nuevos: 2 URL limpia + slug uniqueness + cleanup)
- Diagnóstico de fallos iniciales: cache de Vite obsoleto por servidor dev reutilizado en puerto 4321 — resuelto matando proceso y re-ejecutando con preview server fresco
- Limpieza de datos huérfanos: 4 proyectos `e2e-feat-*` de corrida fallida eliminados con `pnpm cleanup:e2e`

### Completion Notes List
- Task 1: Implementado `isSlugUnique()` en ProjectForm.svelte replicando patrón exacto de BlogForm. `validateAll()` convertido a async. Import de `query`, `where`, `limit` agregados. Traducción `admin.projects.slugInUse` agregada. Error inline con `role="alert"` ya existía en el template.
- Task 2: Creado `project-form.test.ts` con 4 tests de slug uniqueness usando `vi.hoisted()` + `vi.mock()` patrón idéntico a blog-form.test.ts. Tests: collection Projects, field slug, empty=true, exists=false, excludeId=true.
- Task 3: Agregados 2 tests de URL limpia en project-detail.spec.ts (EN y ES). Regex ES actualizada de `/\/es\/projects\/.+/` a `/\/es\/projects\/[a-z0-9-]+$/`. Blog URL tests verificados como existentes en `blog-article.spec.ts:15,21,99,105` — no duplicados.
- Task 4: Agregado `test.describe('Admin Projects — Slug Uniqueness')` con test serial de slug duplicado y cleanup. Verificado: 147/147 E2E pasando.
- Task 5: `pnpm test` ✅ 1236 passed, `pnpm build` ✅ exitoso, `pnpm test:e2e` ✅ 147 passed.

### File List
- `src/components/admin/ProjectForm.svelte` (modificado — imports query/where/limit, isSlugUnique(), async validateAll con check de unicidad, await en handleSubmit)
- `src/lib/i18n/translations.ts` (modificado — admin.projects.slugInUse en ES/EN)
- `src/components/admin/__tests__/project-form.test.ts` (nuevo — 4 unit tests de slug uniqueness)
- `tests/e2e/project-detail.spec.ts` (modificado — 2 nuevos tests URL limpia EN/ES, regex ES estricta)
- `tests/e2e/admin-projects.spec.ts` (modificado — nuevo describe Slug Uniqueness con test de rechazo y cleanup)
