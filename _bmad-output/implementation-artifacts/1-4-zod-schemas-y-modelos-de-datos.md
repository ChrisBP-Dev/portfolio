# Story 1.4: Zod Schemas y Modelos de Datos

Status: ready-for-dev

## Story

As a developer,
I want type-safe data models validated by Zod schemas,
So that all data flowing through the app is validated consistently at build time and runtime.

## Acceptance Criteria

1. **Given** shared schemas exist **When** I import `localizedString`, `storedImageSchema`, `localeSchema` **Then** they validate correctly with TypeScript autocompletion
2. **And** `projectSchema` validates: companyName, shortDescription, features as Localized, mainImage/screenshots as StoredImage[], slug, technologies, urls optional
3. **And** `technologySchema` validates: name, image as StoredImage, experienceYears as number
4. **And** `experienceSchema` validates: companyName, jobName as Localized, responsibilities as Localized<string[]>, startDate, endDate nullable
5. **And** `blogPostSchema` validates: title/content as Localized, slug, coverImage, images array, status 'published'|'draft', createdAt, updatedAt
6. **And** TypeScript types derived via `z.infer<>` (Project, Technology, Experience, BlogPost, StoredImage, Locale)
7. **And** schemas live in `src/lib/schemas/` with kebab-case naming

## Tasks / Subtasks

- [ ] Task 1: Instalar Zod 4 (AC: todos)
  - [ ] 1.1 `pnpm add zod@^4.0.0` — versión estable actual: 4.3.6
  - [ ] 1.2 Verificar que `pnpm type-check` y `pnpm lint` pasan post-instalación
  - [ ] 1.3 Smoke test de `z.url()`: ejecutar `pnpm exec tsx -e "import { z } from 'zod'; const s = z.url(); type T = z.infer<typeof s>; const r: T = s.parse('https://a.com'); console.log(typeof r)"` — debe imprimir `string`. Si imprime `object` (tipo `URL`), usar `z.string().url()` en lugar de `z.url()` en todos los schemas

- [ ] Task 2: Crear shared schemas (AC: #1, #6)
  - [ ] 2.1 Crear `src/lib/schemas/shared-schemas.ts` con: `localeSchema`, `localizedString`, `localizedStringArray`, `storedImageSchema`
  - [ ] 2.2 Exportar tipos derivados: `Locale`, `LocalizedString`, `LocalizedStringArray`, `StoredImage`

- [ ] Task 3: Crear entity schemas (AC: #2, #3, #4, #5, #6)
  - [ ] 3.1 Crear `src/lib/schemas/project-schema.ts` con `projectSchema` y tipo `Project`
  - [ ] 3.2 Crear `src/lib/schemas/technology-schema.ts` con `technologySchema` y tipo `Technology`
  - [ ] 3.3 Crear `src/lib/schemas/experience-schema.ts` con `experienceSchema` y tipo `Experience`
  - [ ] 3.4 Crear `src/lib/schemas/blog-post-schema.ts` con `blogPostSchema` y tipo `BlogPost`

- [ ] Task 4: Crear ImageSlot type (AC: implícito — requerido por stories 3.3+)
  - [ ] 4.1 Crear `src/lib/schemas/image-slot.ts` con discriminated union `ImageSlot`

- [ ] Task 5: Actualizar test data factories (AC: implícito — factories deben validar contra schemas)
  - [ ] 5.1 Eliminar `src/test/factories/types.ts` — reemplazado por tipos derivados de Zod
  - [ ] 5.2 Actualizar `src/test/factories/index.ts` para importar tipos desde schemas
  - [ ] 5.3 Reescribir `src/test/factories/project.ts` con campos del architecture spec
  - [ ] 5.4 Reescribir `src/test/factories/technology.ts` con campos del architecture spec
  - [ ] 5.5 Reescribir `src/test/factories/experience.ts` con campos del architecture spec
  - [ ] 5.6 Reescribir `src/test/factories/blog-post.ts` con campos del architecture spec
  - [ ] 5.7 Actualizar `src/test/factories/__tests__/factories.test.ts` para validar con Zod schemas

- [ ] Task 6: Unit tests de schemas (AC: #1-#6)
  - [ ] 6.1 Crear `src/lib/schemas/__tests__/schemas.test.ts`
  - [ ] 6.2 Tests de `shared-schemas`: validación correcta e incorrecta de cada schema
  - [ ] 6.3 Tests de cada entity schema: datos válidos pasan, datos inválidos fallan con errores claros
  - [ ] 6.4 Tests de type inference: verificar que `z.infer<>` produce tipos correctos (compilación)

- [ ] Task 7: Validaciones finales
  - [ ] 7.1 `pnpm lint` — 0 errores
  - [ ] 7.2 `pnpm type-check` — 0 errores
  - [ ] 7.3 `pnpm test` — todos los tests pasan (schema tests + factory tests actualizados)

## Dev Notes

### Contexto Crítico

Esta story crea los **Zod schemas como source of truth** para todos los tipos de datos del proyecto. Es el fundamento de tipado que usarán TODAS las stories posteriores: build scripts (SSG), admin UI (CRUD), migration script, y Firebase services. Después de esta story, NUNCA se define `interface` o `type` manualmente para modelos de datos — todo se deriva de `z.infer<>`.

**Impacto directo:** Las test data factories creadas en Story 1.2 usan interfaces manuales (`src/test/factories/types.ts`) con campos que NO coinciden con los modelos de la arquitectura. Esta story las reemplaza con tipos derivados de Zod.

### Zod 4 — Información Técnica Crítica

**Versión:** `zod@4.3.6` (estable, production-ready). Zod 4 no existía cuando se creó el proyecto — se agrega ahora como dependencia.

**Import:**
```typescript
import { z } from 'zod';
```

**Cambios clave vs Zod 3 que afectan esta story:**
- `z.string().url()` → `z.url()` (top-level format validator en Zod 4)
- `z.string().email()` → `z.email()` (top-level)
- `z.string().uuid()` → `z.uuid()` (top-level, strict RFC 4122)
- `.flatten()` deprecated → usar `z.treeifyError()` si se necesita formatear errores
- `.merge()` deprecated → usar `.extend()` para extender schemas
- `z.record()` requiere ambos args (key schema y value schema)
- `Infinity` no pasa `z.number()`

**Lo que NO cambia:** `z.object()`, `z.array()`, `z.enum()`, `z.infer<>`, `.optional()`, `.nullable()` — API core idéntica.

**Verificación post-instalación (Task 1.3):** Confirmar que `z.url()` infiere como `string` y no como `URL`. Si infiere `URL`, usar `z.string().url()` como fallback en todos los schemas que usen `z.url()`.

### Shared Schemas — Implementación Exacta

```typescript
// src/lib/schemas/shared-schemas.ts
import { z } from 'zod';

export const localeSchema = z.enum(['es', 'en']);

export const localizedString = z.object({
  es: z.string().min(1),
  en: z.string().min(1),
});

export const localizedStringArray = z.object({
  es: z.array(z.string()),
  en: z.array(z.string()),
});

export const storedImageSchema = z.object({
  url: z.url(),
  storagePath: z.string().min(1),
});

// Tipos derivados — NUNCA definir manualmente
export type Locale = z.infer<typeof localeSchema>;
export type LocalizedString = z.infer<typeof localizedString>;
export type LocalizedStringArray = z.infer<typeof localizedStringArray>;
export type StoredImage = z.infer<typeof storedImageSchema>;
```

**Notas:**
- `z.url()` es top-level en Zod 4 (NO `z.string().url()`)
- `localizedString` exige `min(1)` — campos bilingües no pueden estar vacíos
- `localizedStringArray` permite arrays vacíos — features opcionales
- `storedImageSchema` tiene dos campos: `url` (pública) y `storagePath` (para eliminación)

### Entity Schemas — Implementación Exacta

**Project:**
```typescript
// src/lib/schemas/project-schema.ts
import { z } from 'zod';
import { localizedString, localizedStringArray, storedImageSchema } from './shared-schemas';

export const projectSchema = z.object({
  id: z.string(),                          // sin min(1) — Firestore auto-generated IDs
  companyName: localizedString,
  shortDescription: localizedString,
  features: localizedStringArray,
  mainImage: storedImageSchema,
  screenshots: z.array(storedImageSchema),
  websiteUrl: z.url().optional(),          // top-level z.url() de Zod 4
  sourceCodeUrl: z.url().optional(),
  technologies: z.array(z.string()),
  slug: z.string().min(1),
});

export type Project = z.infer<typeof projectSchema>;
```

**Technology:**
```typescript
// src/lib/schemas/technology-schema.ts
import { z } from 'zod';
import { storedImageSchema } from './shared-schemas';

export const technologySchema = z.object({
  id: z.string(),
  name: z.string().min(1),                 // no localizado — nombres de tecnologías son universales
  image: storedImageSchema,
  experienceYears: z.number().int().nonnegative(), // numérico, la UI formatea "3 años"/"3 years"
});

export type Technology = z.infer<typeof technologySchema>;
```

**Experience:**
```typescript
// src/lib/schemas/experience-schema.ts
import { z } from 'zod';
import { localizedString, localizedStringArray } from './shared-schemas';

export const experienceSchema = z.object({
  id: z.string(),
  companyName: z.string().min(1),          // no localizado — nombres de empresas son universales
  jobName: localizedString,
  responsibilities: localizedStringArray,  // array tipado, NO string — corrige patrón Flutter
  startDate: z.date(),                     // Firestore Timestamps convertidos a Date
  endDate: z.date().nullable(),            // null = empleo actual (NO undefined)
});

export type Experience = z.infer<typeof experienceSchema>;
```

**BlogPost:**
```typescript
// src/lib/schemas/blog-post-schema.ts
import { z } from 'zod';
import { localizedString, storedImageSchema } from './shared-schemas';

export const blogPostSchema = z.object({
  id: z.string(),
  title: localizedString,
  content: localizedString,
  slug: z.string().min(1),
  coverImage: storedImageSchema,
  images: z.array(storedImageSchema),
  status: z.enum(['published', 'draft']),  // NO boolean published — union literal
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type BlogPost = z.infer<typeof blogPostSchema>;
```

### ImageSlot — Discriminated Union (UI State)

```typescript
// src/lib/schemas/image-slot.ts
import type { StoredImage } from './shared-schemas';

export type ImageSlot =
  | { type: 'empty' }
  | { type: 'existing'; image: StoredImage }
  | { type: 'new'; file: File; preview: string }
  | { type: 'replaced'; old: StoredImage; file: File; preview: string }
  | { type: 'removed'; old: StoredImage };
```

**ImageSlot NO es un Zod schema** — es un TypeScript type puro porque contiene `File` (Web API). Se usa solo en la UI del admin para gestionar estados de imágenes en formularios. Los datos persistidos en Firestore usan `StoredImage` (definido en Zod).

### Inteligencia de Story 1-3

Estado actual post Story 1-3:
- **Vitest 4.1.0** con `passWithNoTests: true` — 9 tests de factories pasan
- **TypeScript strictest** con `exactOptionalPropertyTypes: true` — afecta cómo se tipan campos `.optional()`. En Zod, `.optional()` produce `T | undefined`. Con `exactOptionalPropertyTypes`, un campo `websiteUrl?: string` acepta `undefined` o la ausencia del campo, pero NO `string | undefined` como tipo de propiedad
- **ESLint** configurado con `eslint-plugin-astro` y `eslint-plugin-svelte`
- **CI pipeline** activo en push a main — lint → type-check → test → build → Lighthouse
- **package.json** `"type": "module"` — imports ESM, afecta cómo Zod se importa
- **Node 22.12.0** — soporte completo de ESM
- **`lighthouserc.cjs`** ya en ESLint ignores — no agregar más ignores

### Discrepancias Factory Types vs Architecture — MIGRACIÓN REQUERIDA

Las interfaces actuales en `src/test/factories/types.ts` NO coinciden con los modelos de la arquitectura:

| Modelo | Campo Factory (actual) | Campo Architecture (correcto) |
|--------|----------------------|------------------------------|
| StoredImage | `url, path, alt` | `url, storagePath` (sin alt) |
| Project | `title, description, imageSlots, links, featured, order` | `companyName, shortDescription, features, mainImage, screenshots, slug, websiteUrl?, sourceCodeUrl?` |
| Technology | `icon, category, order` | `image (StoredImage), experienceYears` |
| Experience | `company, position, description, technologies, order, current` | `companyName, jobName, responsibilities, startDate, endDate` |
| BlogPost | `excerpt, tags, published, publishedAt` | `coverImage, images, status, createdAt, updatedAt` |

**Acción:** Eliminar `types.ts` completo. Factories importan tipos de Zod schemas. Factories producen objetos que pasan `schema.parse()`.

### Factories Actualizadas — Implementación

Cada factory debe producir un objeto que pase `entitySchema.parse()`. Ejemplo para project:

```typescript
// src/test/factories/project.ts
import type { Project } from '../../lib/schemas/project-schema';

export function createProject(overrides?: Partial<Project>): Project {
  return {
    id: crypto.randomUUID(),
    companyName: { es: 'Empresa Demo', en: 'Demo Company' },
    shortDescription: { es: 'App web moderna', en: 'Modern web app' },
    features: { es: ['Feature principal'], en: ['Main feature'] },
    mainImage: {
      url: 'https://example.com/images/project-hero.webp',
      storagePath: 'projects/demo/main-image.webp',
    },
    screenshots: [],
    websiteUrl: undefined,
    sourceCodeUrl: undefined,
    technologies: ['astro', 'svelte'],
    slug: 'proyecto-demo',
    ...overrides,
  };
}
```

```typescript
// src/test/factories/technology.ts
import type { Technology } from '../../lib/schemas/technology-schema';

export function createTechnology(overrides?: Partial<Technology>): Technology {
  return {
    id: crypto.randomUUID(),
    name: 'Astro',
    image: {
      url: 'https://example.com/images/astro-logo.webp',
      storagePath: 'technologies/astro/logo.webp',
    },
    experienceYears: 3,
    ...overrides,
  };
}
```

```typescript
// src/test/factories/experience.ts
import type { Experience } from '../../lib/schemas/experience-schema';

export function createExperience(overrides?: Partial<Experience>): Experience {
  return {
    id: crypto.randomUUID(),
    companyName: 'Empresa Demo',
    jobName: { es: 'Desarrollador Full Stack', en: 'Full Stack Developer' },
    responsibilities: {
      es: ['Desarrollar features', 'Code review'],
      en: ['Develop features', 'Code review'],
    },
    startDate: new Date('2024-01-15'),
    endDate: null,                         // null = empleo actual (NO undefined)
    ...overrides,
  };
}
```

```typescript
// src/test/factories/blog-post.ts
import type { BlogPost } from '../../lib/schemas/blog-post-schema';

export function createBlogPost(overrides?: Partial<BlogPost>): BlogPost {
  return {
    id: crypto.randomUUID(),
    title: { es: 'Post de ejemplo', en: 'Example post' },
    content: { es: '<p>Contenido del blog</p>', en: '<p>Blog content</p>' },
    slug: 'post-de-ejemplo',
    coverImage: {
      url: 'https://example.com/images/blog-cover.webp',
      storagePath: 'blog/post-de-ejemplo/cover.webp',
    },
    images: [],
    status: 'published',
    createdAt: new Date('2026-03-10'),
    updatedAt: new Date('2026-03-14'),
    ...overrides,
  };
}
```

```typescript
// src/test/factories/index.ts
// Solo re-exporta factory functions — tipos se importan directamente desde schemas
export { createProject } from './project';
export { createTechnology } from './technology';
export { createExperience } from './experience';
export { createBlogPost } from './blog-post';
```

**Patrón de todas las factories:** importar tipo de schema, retornar objeto válido que pasa `schema.parse()`, aplicar overrides con spread. Notar: `endDate` usa `null` (`.nullable()`) y campos opcionales usan `undefined` (`.optional()`) — no confundir.

### Tests de Schemas — Qué Cubrir

```typescript
// src/lib/schemas/__tests__/schemas.test.ts
// Para cada schema:
// 1. Datos válidos → parse() retorna objeto tipado
// 2. Campo faltante → parse() lanza ZodError
// 3. Tipo incorrecto → parse() lanza ZodError
// 4. Campos opcionales → omitidos o undefined → parse() pasa
// 5. Campos nullable → null → parse() pasa
// 6. Edge cases: string vacía en min(1), URL inválida, número negativo
```

Mínimo ~25-30 test cases para cubrir todos los schemas con validación positiva y negativa.

### Tests de Factories Actualizados

```typescript
// src/test/factories/__tests__/factories.test.ts
// Para cada factory:
// 1. createEntity() retorna objeto con todos los campos requeridos
// 2. createEntity() pasa entitySchema.parse() sin error
// 3. createEntity(overrides) aplica overrides correctamente
// 4. createEntity() genera IDs únicos
```

La clave: cada test debe llamar `schema.parse(factory())` para verificar que las factories producen datos válidos contra los Zod schemas.

### Qué NO Hacer en Esta Story

- **NO definir `interface` o `type` manualmente para modelos de datos** — todo derivado de `z.infer<>`
- **NO usar `z.string().url()`** — Zod 4 usa `z.url()` como top-level
- **NO crear un barrel export `src/lib/schemas/index.ts`** — la arquitectura no lo define, importar cada schema directamente
- **NO agregar validación de Firestore Timestamps directamente** — los schemas usan `z.date()`, la conversión Timestamp→Date se hace en la capa de Firebase services (Story 2.1+)
- **NO modificar el CI pipeline** — ya funciona, los tests nuevos se ejecutan automáticamente con `pnpm test`
- **NO crear schemas para ContactMessage ni Settings** — no están en los Acceptance Criteria ni en el architecture spec de Zod schemas
- **NO intentar migrar datos** — la migración es Story 2.1

### Project Structure Notes

Archivos nuevos y modificados:

```
portfolio/
├── src/
│   ├── lib/
│   │   └── schemas/
│   │       ├── shared-schemas.ts       # NUEVO — localeSchema, localizedString, storedImageSchema
│   │       ├── project-schema.ts       # NUEVO — projectSchema + type Project
│   │       ├── technology-schema.ts    # NUEVO — technologySchema + type Technology
│   │       ├── experience-schema.ts    # NUEVO — experienceSchema + type Experience
│   │       ├── blog-post-schema.ts     # NUEVO — blogPostSchema + type BlogPost
│   │       ├── image-slot.ts           # NUEVO — ImageSlot discriminated union (type puro)
│   │       └── __tests__/
│   │           └── schemas.test.ts     # NUEVO — unit tests de todos los schemas
│   └── test/
│       └── factories/
│           ├── types.ts                # ELIMINADO — reemplazado por tipos de Zod schemas
│           ├── index.ts                # MODIFICADO — imports de tipos desde schemas
│           ├── project.ts              # MODIFICADO — campos actualizados al architecture spec
│           ├── technology.ts           # MODIFICADO — campos actualizados
│           ├── experience.ts           # MODIFICADO — campos actualizados
│           ├── blog-post.ts            # MODIFICADO — campos actualizados
│           └── __tests__/
│               └── factories.test.ts   # MODIFICADO — validación con Zod parse()
├── package.json                        # MODIFICADO — agregar zod@^4.0.0 en dependencies
└── pnpm-lock.yaml                      # MODIFICADO — actualizado con zod
```

- `.gitkeep` en `src/lib/schemas/` se elimina cuando se agregan archivos reales
- Tests co-locados en `__tests__/` junto al código (patrón del proyecto)

### References

- [Source: _bmad-output/planning-artifacts/epics.md — Epic 1, Story 1.4 Acceptance Criteria]
- [Source: _bmad-output/planning-artifacts/architecture.md — Data Architecture, Modelos Firestore, Format Patterns (Zod schemas como source of truth), Enforcement Guidelines]
- [Source: _bmad-output/planning-artifacts/architecture.md — Image Management Architecture (StoredImage, ImageSlot)]
- [Source: _bmad-output/planning-artifacts/architecture.md — Naming Patterns (Zod schemas: camelCase con sufijo Schema, archivos: kebab-case)]
- [Source: _bmad-output/planning-artifacts/architecture.md — Anti-Patterns PROHIBIDOS (tipo manual, sufijos bilingües, responsibilities como string)]
- [Source: _bmad-output/planning-artifacts/prd.md — NFR22 (TypeScript strict), modelos de datos bilingües]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md — Modelos de datos del portfolio]
- [Source: docs/data-models.md — Modelos Flutter actuales (ImageAndPath, sufijos Es/En, experienceTime como string)]
- [Source: _bmad-output/implementation-artifacts/1-3-ci-cd-pipeline-y-quality-gates.md — CI pipeline activo, TypeScript strictest, Vitest 4.1.0]
- [Source: Web research — Zod 4.3.6 stable, z.url() top-level, z.enum() acepta native enums, .flatten() deprecated]

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
