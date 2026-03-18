# Story 2.1: Data Migration Script

Status: review

## Story

As a developer,
I want to migrate existing Firestore data from Flutter schema to the professional nested schema,
So that the public site can render real portfolio data from day one.

## Acceptance Criteria

1. **Given** the migration script in `src/lib/scripts/migrate-firestore-data.ts` **When** executed against Firestore **Then** it transforms all documents in Projects, Technologies, and Experiences collections
2. **And** localized fields transform: `companyNameEs/En` → `companyName: { es, en }`, `shortDescriptionEs/En` → `shortDescription: { es, en }`, `featuresES/EN` → `features: { es, en }`, `jobNameEs/En` → `jobName: { es, en }`, `responsabilitiesEs/En` → `responsibilities: { es: [...], en: [...] }`
3. **And** image fields transform: `ImageAndPath { url, localImage, refPath }` → `StoredImage { url, storagePath }` — drop `localImage`, rename `refPath` → `storagePath`
4. **And** Storage files are NOT renamed — only Firestore field names change
5. **And** `date` strings in Experiences are parsed to `startDate: Date` + `endDate: Date | null`
6. **And** `experienceTime` strings in Technologies are parsed to `experienceYears: number` (integer)
7. **And** `slug` is auto-generated for Projects from `companyNameEn` (lowercase, hyphenated)
8. **And** a document already in new schema is skipped (idempotent)
9. **And** after migration, each document passes its corresponding Zod schema validation
10. **And** backup command `firebase firestore:export` documented as pre-migration step
11. **And** script runs via `npx tsx src/lib/scripts/migrate-firestore-data.ts`

## Tasks / Subtasks

- [x] Task 1: Script scaffold and Firebase Admin init (AC: #1, #11)
  - [x] 1.1 Create `src/lib/scripts/migrate-firestore-data.ts` with standalone Admin SDK init (NO import from `admin.ts` — uses `process.env` via Node 22+ `--env-file=.env`, NO instalar dotenv)
  - [x] 1.2 Install `tsx` as devDependency for ESM TypeScript execution
  - [x] 1.3 Add `"migrate"` npm script to package.json: `"tsx src/lib/scripts/migrate-firestore-data.ts"`
  - [x] 1.4 Scaffold main function with collection iteration and dry-run mode support

- [x] Task 2: Projects collection migration (AC: #2, #3, #4, #7)
  - [x] 2.1 Implement `migrateProject()`: merge suffix fields into nested localized objects
  - [x] 2.2 Transform `ImageAndPath` → `StoredImage` for mainImage and screenshots array
  - [x] 2.3 Generate `slug` from `companyNameEn` using regex `/^[a-z0-9]+(?:-[a-z0-9]+)*$/`
  - [x] 2.4 Preserve `technologies` as-is; sanitize `websiteUrl`/`sourceCodeUrl` — si el valor no es URL válida (ej: `'source-code'` literal), setear `undefined`

- [x] Task 3: Technologies collection migration (AC: #2, #3, #6)
  - [x] 3.1 Implement `migrateTechnology()`: transform `image: ImageAndPath` → `image: StoredImage`
  - [x] 3.2 Parse `experienceTime` string to `experienceYears` integer (extract first number)

- [x] Task 4: Experiences collection migration (AC: #2, #5)
  - [x] 4.1 Implement `migrateExperience()`: merge `jobNameEs/En` → `jobName: { es, en }`
  - [x] 4.2 Restructure `responsabilitiesEs/En` arrays → `responsibilities: { es: [...], en: [...] }`
  - [x] 4.3 Parse `date` string (e.g., "Jan 2024 - Present") → `startDate` Date + `endDate` Date|null
  - [x] 4.4 Preserve `companyName` as-is

- [x] Task 5: Idempotency and validation (AC: #8, #9)
  - [x] 5.1 Detect already-migrated documents by checking for nested field existence (e.g., `companyName.es`)
  - [x] 5.2 Post-migration: validate each document using `projectSchema.safeParse()`, `technologySchema.safeParse()`, `experienceSchema.safeParse()`
  - [x] 5.3 Log skipped documents, validation errors, and transformation summaries

- [x] Task 6: Documentation and backup (AC: #10)
  - [x] 6.1 Add JSDoc header to script with pre-migration backup instructions
  - [x] 6.2 Console output: clear summary of migrated/skipped/failed per collection

- [x] Task 7: Unit tests (AC: all)
  - [x] 7.1 Create `src/lib/scripts/__tests__/migrate-firestore-data.test.ts`
  - [x] 7.2 Test each transform function with real Flutter-shaped data → validates against Zod schema
  - [x] 7.3 Test idempotency: already-migrated documents are skipped
  - [x] 7.4 Test edge cases: missing optional fields, empty arrays, null endDate
  - [x] 7.5 Test slug generation: special characters, accents, spaces → valid slug

## Dev Notes

### CRITICAL: admin.ts NO es reutilizable para el script

`src/lib/firebase/admin.ts` usa `import.meta.env` que es exclusivo de Astro. El script de migración necesita su propia inicialización del Admin SDK usando `process.env` directamente. Patrón:

```typescript
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Leer .env manualmente o usar dotenv
// En Node 22+: node --env-file=.env (built-in)
const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.trim().replace(/\\n/g, '\n');

if (getApps().length === 0) {
  initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
}
const db = getFirestore();
```

**NO instalar dotenv.** Node 22+ soporta `--env-file=.env` nativamente. El script npm debe ser:
```json
"migrate": "node --env-file=.env --import tsx src/lib/scripts/migrate-firestore-data.ts"
```

### ESM: usar tsx, NO ts-node

El proyecto es `"type": "module"` (ESM). `ts-node` requiere configuración extra para ESM. Usar `tsx` que funciona nativamente con ESM:
- Instalar: `pnpm add -D tsx`
- AC #11 dice `npx tsx` pero el método real de ejecución es el npm script `"migrate"` que usa `node --env-file=.env --import tsx` (necesita cargar env vars). AC #11 es referencial.

### Modelo Flutter EXACTO (del _flutter-archive)

**ImageAndPath (OLD):**
```dart
class ImageAndPath {
  String? url;        // URL de descarga pública
  String? localImage; // Cache local Flutter (IGNORAR en migración)
  String? refPath;    // Path en Storage → renombrar a storagePath
}
```

**Project (OLD):**
```dart
class Project {
  String id;
  String companyNameEs, companyNameEn;
  String shortDescriptionEs, shortDescriptionEn;
  ImageAndPath mainImage;
  List<ImageAndPath> screenshots;  // Orden = posición visual
  List<TechnologyID> technologies;
  List<String> featuresES, featuresEN;
  String? websiteUrl, sourceCodeUrl;
  // NO tiene: slug, createdAt, updatedAt
}
```

**Technology (OLD):**
```dart
class Technology {
  String id;
  String name;
  ImageAndPath image;
  String experienceTime;  // "2+", "3 years", "over 2 years" → parsear a int
}
```

**Experience (OLD):**
```dart
class Experience {
  String id;
  String date;           // "Jan 2024 - Present" → parsear a startDate/endDate
  String companyName;
  String jobNameEn, jobNameEs;
  List<String> responsabilitiesEn;  // YA son arrays en Dart
  List<String> responsabilitiesEs;  // NO necesitan split por \n
}
```

### Transformaciones campo por campo

**Nota:** El campo `id` se preserva sin cambio en las 3 colecciones (ya existe en Flutter y en Zod schemas).

| Colección | Campo Viejo | Transformación | Campo Nuevo |
|-----------|------------|----------------|-------------|
| **Projects** | `id` | Sin cambio | `id` |
| | `companyNameEs` + `companyNameEn` | Merge → objeto | `companyName: { es, en }` |
| | `shortDescriptionEs` + `shortDescriptionEn` | Merge → objeto | `shortDescription: { es, en }` |
| | `featuresES` + `featuresEN` | Merge → objeto | `features: { es: [...], en: [...] }` |
| | `mainImage: ImageAndPath` | Drop `localImage`, rename `refPath` | `mainImage: StoredImage` |
| | `screenshots: ImageAndPath[]` | Misma transformación por item | `screenshots: StoredImage[]` |
| | (no existe) | Generar de `companyNameEn` | `slug` |
| | `technologies` | Sin cambio | `technologies` |
| | `websiteUrl`, `sourceCodeUrl` | Sanitizar: si no es URL válida → `undefined` | `websiteUrl?`, `sourceCodeUrl?` |
| **Technologies** | `id` | Sin cambio | `id` |
| | `name` | Sin cambio | `name` |
| | `image: ImageAndPath` | Drop `localImage`, rename `refPath` | `image: StoredImage` |
| | `experienceTime: "2+"`, `"over 2 years"` | Parsear primer número | `experienceYears: 2` |
| **Experiences** | `id` | Sin cambio | `id` |
| | `companyName` | Sin cambio | `companyName` |
| | `jobNameEs` + `jobNameEn` | Merge → objeto | `jobName: { es, en }` |
| | `responsabilitiesEs` + `responsabilitiesEn` | Merge arrays → objeto | `responsibilities: { es: [...], en: [...] }` |
| | `date: "Jan 2024 - Present"` | Parsear a fechas (normalizar em-dash) | `startDate: Date, endDate: Date\|null` |

### Zod Schemas — Fuente de verdad

Los schemas ya están definidos y son estrictos. Referencia rápida de validaciones que afectan la migración:

- **`storedImageSchema`**: `url` debe pasar `z.url()`, `storagePath` debe ser `min(1)`. Si `url` o `refPath` son `null` en datos viejos, el documento fallará validación.
- **`projectSchema.websiteUrl/sourceCodeUrl`**: `z.url().optional()` — datos Flutter pueden contener strings no-URL (ej: `'source-code'` literal). Validar con `try { new URL(value) }` antes de incluir; si falla, setear `undefined`.
- **`projectSchema.slug`**: Regex `/^[a-z0-9]+(?:-[a-z0-9]+)*$/` — solo minúsculas, números y guiones. La función de generación debe limpiar acentos, caracteres especiales.
- **`technologySchema.experienceYears`**: `z.number().int().nonnegative()` — debe ser entero >= 0. No decimales.
- **`experienceSchema`**: `.refine()` valida que `endDate === null || endDate >= startDate`. Parseo del `date` string debe respetar este orden.
- **`localizedString`**: `es` y `en` deben ser `string().min(1)` — no puede quedar vacío.
- **`localizedStringArray`**: Cada string dentro del array debe ser `min(1)` — filtrar strings vacíos.

Archivos de schemas:
- `src/lib/schemas/shared-schemas.ts` — `storedImageSchema`, `localizedString`, `localizedStringArray`
- `src/lib/schemas/project-schema.ts` — `projectSchema`
- `src/lib/schemas/technology-schema.ts` — `technologySchema`
- `src/lib/schemas/experience-schema.ts` — `experienceSchema`

### Parse helpers existentes — REUSAR para validación

`src/lib/firebase/collections.ts` exporta funciones que ya manejan Firestore Timestamps:

```typescript
parseProject(data, id): Project    // Zod parse directo
parseTechnology(data, id): Technology  // Zod parse directo
parseExperience(data, id): Experience  // Convierte startDate/endDate con toDate()
```

**IMPORTAR estos helpers para validación post-migración** — no reimplementar la conversión de tipos.

**CONFIRMADO:** `collections.ts` es 100% Node-compatible — NO usa `import.meta.env` ni dependencias de Astro. Importable directamente desde el script de migración con `tsx`.

**NOTA:** `collections.ts` usa imports de schemas que usan `z.url()` (Zod 4). Esto funciona con `tsx` sin problemas.

### Colecciones en Firestore

```typescript
// src/lib/firebase/collections.ts
export const COLLECTION_PATHS = {
  projects: 'Projects',       // PascalCase — case-sensitive
  technologies: 'Technologies',
  experiences: 'Experiences',
  blogPosts: 'BlogPosts',     // NO migrar — colección nueva
} as const;
```

**BlogPosts NO necesita migración** — es colección nueva sin datos legacy.

### Función slugify

Implementar una función simple de slugificación. NO instalar librerías externas:

```typescript
function slugify(text: string): string {
  return text
    .normalize('NFD')                   // Descomponer acentos
    .replace(/[\u0300-\u036f]/g, '')    // Remover diacríticos
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')        // Reemplazar no-alfanuméricos con -
    .replace(/^-|-$/g, '');             // Remover guiones al inicio/final
}
```

### Parseo de date string a startDate/endDate

El campo `date` en Experiences es un string de display como:
- `"Jan 2024 - Present"`
- `"Mar 2022 - Dec 2023"`
- `"2021 - 2023"`
- `"2022 – 2022"` (con em-dash U+2013 en vez de hyphen)

Lógica de parseo:
```typescript
function parseDateRange(dateStr: string): { startDate: Date; endDate: Date | null } {
  // Normalizar em-dash (U+2013) y en-dash (U+2014) a hyphen estándar
  const normalized = dateStr.replace(/[\u2013\u2014]/g, '-');
  const parts = normalized.split(' - ');
  const startDate = new Date(parts[0].trim()); // "Jan 2024" → Date
  const endPart = parts[1]?.trim();
  const endDate = (!endPart || endPart.toLowerCase() === 'present')
    ? null
    : new Date(endPart);
  return { startDate, endDate };
}
```

**Considerar:** Si el string no se puede parsear, logear advertencia pero no fallar — poner fechas dummy y marcar para revisión manual.

### Parseo de experienceTime a experienceYears

```typescript
function parseExperienceYears(timeStr: string): number {
  const match = timeStr.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}
```

### Detección de idempotencia

Verificar si un documento ya fue migrado antes de transformar:

```typescript
function isAlreadyMigrated(data: Record<string, unknown>, collection: string): boolean {
  switch (collection) {
    case 'Projects':
      return typeof data.companyName === 'object' && data.companyName !== null;
    case 'Technologies':
      return typeof data.experienceYears === 'number';
    case 'Experiences':
      return typeof data.jobName === 'object' && data.jobName !== null;
    default:
      return false;
  }
}
```

### Batch writes — Firestore limit

Usar `db.batch()` para agrupar las actualizaciones. Firestore limita a **500 operaciones por batch**. Para un portfolio pequeño esto no es problema, pero implementar el patrón correcto:

```typescript
const batch = db.batch();
let opCount = 0;

// Por cada documento transformado:
batch.update(docRef, updates);
opCount++;
if (opCount >= 499) {
  await batch.commit();
  batch = db.batch(); // Nuevo batch (re-asignar variable con let)
  opCount = 0;
}
// Commit final si quedan operaciones pendientes
if (opCount > 0) await batch.commit();
```

### Limpieza de campos viejos

Después de escribir los campos nuevos, **eliminar los campos viejos** del documento para mantener limpieza. Usar `FieldValue.delete()`:

```typescript
import { FieldValue } from 'firebase-admin/firestore';

// En la actualización del documento:
const updates = {
  // Campos nuevos
  companyName: { es: data.companyNameEs, en: data.companyNameEn },
  // Eliminar campos viejos
  companyNameEs: FieldValue.delete(),
  companyNameEn: FieldValue.delete(),
};
```

### Project Structure Notes

Archivos a crear:
```
src/lib/scripts/
└── migrate-firestore-data.ts          # Script principal
src/lib/scripts/__tests__/
└── migrate-firestore-data.test.ts     # Tests unitarios
```

Archivos a modificar:
```
package.json                           # Agregar "migrate" script y tsx dependency
```

`src/lib/scripts/` ya existe con `.gitkeep`. Crear subcarpeta `__tests__/` para los tests.

### Testing Standards

- Framework: Vitest
- Patrón: extraer funciones puras (transform, parse) y testearlas individualmente
- Las funciones que interactúan con Firestore se testean via mocks del Admin SDK
- Factories existentes (`src/test/factories/{project,technology,experience}.ts`) generan datos en **nuevo schema** (post-migración). Para tests del migration script, crear datos de prueba en **viejo schema Flutter** dentro del test file (no crear factories separadas).
- Coverage: todas las funciones de transformación, parseo, y detección de idempotencia
- Edge cases a cubrir en tests: em-dash en dates, `sourceCodeUrl: 'source-code'` (no-URL), `experienceTime: 'over 2 years'`

### Previous Story Intelligence

**De Story 1.10 (Firebase SDK):**
- Admin SDK usa singleton pattern con `getApps().length === 0` guard
- Env vars se validan al inicio con mensajes descriptivos
- `toDate()` en `collections.ts` maneja Firestore Timestamp, Date, string ISO, y number
- Code review capturó 5 patches incluyendo: whitespace-only env var validation, HMR guard, descriptive error messages

**De Epic 1 Retrospective:**
- Story 2-1 es el primer test real del Admin SDK en build-time — si falla, puede requerir rethink de la arquitectura SSG
- Zod como fuente única de verdad confirmado como patrón exitoso
- Code review es obligatorio — ejecutar `/bmad-code-review` al completar

### Git Intelligence

Commits recientes relevantes:
- `2a4f98e` feat: implement story 1.10 — Firebase Client & Admin SDK Configuration (11 archivos, +463 líneas) — estableció toda la infraestructura Firebase
- `ddcf2a4` fix: code review patches for story 1.10 — Firebase SDK robustness (+93 líneas) — mejoró `toDate()`, env var validation, emulator guards

### References

- [Source: _flutter-archive/lib/src/features/projects/domain/project.dart] — Modelo Flutter de Project
- [Source: _flutter-archive/lib/src/features/projects/domain/image_and_path.dart] — Modelo Flutter de ImageAndPath
- [Source: _flutter-archive/lib/src/features/technologies/domain/technology.dart] — Modelo Flutter de Technology
- [Source: _flutter-archive/lib/src/features/experience/domain/experience.dart] — Modelo Flutter de Experience
- [Source: src/lib/schemas/project-schema.ts] — Zod target schema para Projects
- [Source: src/lib/schemas/technology-schema.ts] — Zod target schema para Technologies
- [Source: src/lib/schemas/experience-schema.ts] — Zod target schema para Experiences
- [Source: src/lib/schemas/shared-schemas.ts] — Schemas compartidos (StoredImage, LocalizedString)
- [Source: src/lib/firebase/collections.ts] — Parse helpers con toDate() y COLLECTION_PATHS
- [Source: src/lib/firebase/admin.ts] — Admin SDK init pattern (NO reutilizable por import.meta.env)
- [Source: _bmad-output/planning-artifacts/architecture.md] — Arquitectura y estrategia de migración
- [Source: _bmad-output/planning-artifacts/epics.md#Story 2.1] — Acceptance criteria originales
- [Source: _bmad-output/implementation-artifacts/epic-1-retro-2026-03-18.md] — Lecciones Epic 1

## Dev Agent Record

### Agent Model Used
Claude Opus 4.6 (1M context)

### Debug Log References
- Timezone fix: `new Date("2022")` creates UTC date, causing `getFullYear()` to return 2021 in UTC-offset zones. Fixed with `parseToDate()` helper that creates dates in local time for "YYYY" and "Mon YYYY" formats.
- Firestore schema discovery: real data was in lowercase collections (`projects`, `technologies`) not PascalCase (`Projects`, `Technologies`). `Projects` PascalCase had 4 obsolete docs with a completely different format (`mainImageUrl` string, `imagesUrls` array, `featuresEs`/`featuresEn`). Also found `projectss` (typo, 1 doc). No `Experiences` collection exists.
- Script rewritten from in-place migration to cross-collection migration: reads from lowercase source → transforms → writes to PascalCase target with `set()` → cleans up all obsolete collections/docs.

### Completion Notes List
- Script scaffold with standalone Admin SDK init using `process.env` (not `import.meta.env`) — dynamic imports inside `runMigration()` to prevent side effects on test import
- Cross-collection migration: `projects` (6 docs) → `Projects`, `technologies` (4 docs) → `Technologies`
- `migrateProject()`: merges suffix fields into nested localized objects, transforms `ImageAndPath` → `StoredImage`, generates slug, sanitizes URLs (null → undefined for Firestore compatibility)
- `migrateTechnology()`: transforms image, parses `experienceTime` → `experienceYears` integer
- `migrateExperience()`: merges jobName/responsibilities into localized objects, parses date range with em-dash/en-dash normalization (kept for future use — no Experiences in Firestore yet)
- Idempotency detection via nested field type checks; post-migration Zod validation using `parseProject`/`parseTechnology` from `collections.ts`
- Phase 2 cleanup: deletes old-format `Projects` docs (4), `projectss` typo (1), source `projects` (6), source `technologies` (4) = 15 obsolete docs removed
- `stripUndefined()` helper for Firestore compatibility (rejects undefined values)
- Batch writes with 499-op limit; dry-run mode support
- JSDoc header with backup instructions; summary console output per collection per phase
- 41 unit tests covering all transform functions, Zod validation, idempotency, edge cases
- `tsx` installed as devDependency; `"migrate"` npm script added with `node --env-file=.env --import tsx`
- `.env` file created with Firebase Admin credentials; `.gitignore` updated to protect `*-adminsdk-*.json` files
- Migration executed successfully: 10 docs migrated, 15 obsolete docs deleted, 0 failures

### Migration Execution Log (2026-03-18)
```
Phase 1: projects (6 docs) -> Projects: 6 OK | technologies (4 docs) -> Technologies: 4 OK
Phase 2: Projects: 4 deleted | projectss: 1 deleted | projects: 6 deleted | technologies: 4 deleted
TOTAL: 10 migrated | 0 skipped | 0 failed | 15 obsolete deleted
```

### Firestore State After Migration
- `Projects`: 6 docs (new schema — companyName:{es,en}, slug, mainImage:StoredImage, etc.)
- `Technologies`: 4 docs (new schema — experienceYears:number, image:StoredImage)
- `Experiences`: does not exist (no legacy data to migrate)
- Obsolete collections removed: `projects`, `projectss`, `technologies`

### Change Log
- 2026-03-18: Initial implementation of story 2-1 — all 7 tasks completed
- 2026-03-18: Rewrote script for cross-collection migration after discovering real Firestore schema differs from story assumptions (lowercase collections, no ImageAndPath objects in PascalCase collection, no Experiences)
- 2026-03-18: Executed live migration — 10 docs migrated, 15 obsolete deleted, 0 failures

### File List
- `src/lib/scripts/migrate-firestore-data.ts` (new) — Migration script: pure transforms + cross-collection migration engine + cleanup
- `src/lib/scripts/__tests__/migrate-firestore-data.test.ts` (new) — 41 unit tests for all transform/parse/idempotency functions
- `package.json` (modified) — Added `tsx` devDependency and `"migrate"` npm script
- `pnpm-lock.yaml` (modified) — Lock file updated for tsx
- `.gitignore` (modified) — Added `*-adminsdk-*.json` pattern for Firebase service account files
- `.env` (new, gitignored) — Firebase Admin SDK credentials for local development
