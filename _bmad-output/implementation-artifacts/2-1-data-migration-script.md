# Story 2.1: Data Migration Script

Status: ready-for-dev

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

- [ ] Task 1: Script scaffold and Firebase Admin init (AC: #1, #11)
  - [ ] 1.1 Create `src/lib/scripts/migrate-firestore-data.ts` with standalone Admin SDK init (NO import from `admin.ts` — uses `dotenv` + `process.env`)
  - [ ] 1.2 Install `tsx` as devDependency for ESM TypeScript execution
  - [ ] 1.3 Add `"migrate"` npm script to package.json: `"tsx src/lib/scripts/migrate-firestore-data.ts"`
  - [ ] 1.4 Scaffold main function with collection iteration and dry-run mode support

- [ ] Task 2: Projects collection migration (AC: #2, #3, #4, #7)
  - [ ] 2.1 Implement `migrateProject()`: merge suffix fields into nested localized objects
  - [ ] 2.2 Transform `ImageAndPath` → `StoredImage` for mainImage and screenshots array
  - [ ] 2.3 Generate `slug` from `companyNameEn` using regex `/^[a-z0-9]+(?:-[a-z0-9]+)*$/`
  - [ ] 2.4 Preserve `technologies`, `websiteUrl`, `sourceCodeUrl` as-is

- [ ] Task 3: Technologies collection migration (AC: #2, #3, #6)
  - [ ] 3.1 Implement `migrateTechnology()`: transform `image: ImageAndPath` → `image: StoredImage`
  - [ ] 3.2 Parse `experienceTime` string to `experienceYears` integer (extract first number)

- [ ] Task 4: Experiences collection migration (AC: #2, #5)
  - [ ] 4.1 Implement `migrateExperience()`: merge `jobNameEs/En` → `jobName: { es, en }`
  - [ ] 4.2 Restructure `responsabilitiesEs/En` arrays → `responsibilities: { es: [...], en: [...] }`
  - [ ] 4.3 Parse `date` string (e.g., "Jan 2024 - Present") → `startDate` Date + `endDate` Date|null
  - [ ] 4.4 Preserve `companyName` as-is

- [ ] Task 5: Idempotency and validation (AC: #8, #9)
  - [ ] 5.1 Detect already-migrated documents by checking for nested field existence (e.g., `companyName.es`)
  - [ ] 5.2 Post-migration: validate each document using `projectSchema.safeParse()`, `technologySchema.safeParse()`, `experienceSchema.safeParse()`
  - [ ] 5.3 Log skipped documents, validation errors, and transformation summaries

- [ ] Task 6: Documentation and backup (AC: #10)
  - [ ] 6.1 Add JSDoc header to script with pre-migration backup instructions
  - [ ] 6.2 Console output: clear summary of migrated/skipped/failed per collection

- [ ] Task 7: Unit tests (AC: all)
  - [ ] 7.1 Create `src/lib/scripts/__tests__/migrate-firestore-data.test.ts`
  - [ ] 7.2 Test each transform function with real Flutter-shaped data → validates against Zod schema
  - [ ] 7.3 Test idempotency: already-migrated documents are skipped
  - [ ] 7.4 Test edge cases: missing optional fields, empty arrays, null endDate
  - [ ] 7.5 Test slug generation: special characters, accents, spaces → valid slug

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
- AC dice `npx ts-node` pero el equipo acordó usar `tsx` por compatibilidad ESM

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
  String experienceTime;  // "2+" o "3 years" → parsear a int
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

| Colección | Campo Viejo | Transformación | Campo Nuevo |
|-----------|------------|----------------|-------------|
| **Projects** | `companyNameEs` + `companyNameEn` | Merge → objeto | `companyName: { es, en }` |
| | `shortDescriptionEs` + `shortDescriptionEn` | Merge → objeto | `shortDescription: { es, en }` |
| | `featuresES` + `featuresEN` | Merge → objeto | `features: { es: [...], en: [...] }` |
| | `mainImage: ImageAndPath` | Drop `localImage`, rename `refPath` | `mainImage: StoredImage` |
| | `screenshots: ImageAndPath[]` | Misma transformación por item | `screenshots: StoredImage[]` |
| | (no existe) | Generar de `companyNameEn` | `slug` |
| | `technologies`, `websiteUrl`, `sourceCodeUrl` | Sin cambio | Igual |
| **Technologies** | `image: ImageAndPath` | Drop `localImage`, rename `refPath` | `image: StoredImage` |
| | `experienceTime: "2+"` | Parsear primer número | `experienceYears: 2` |
| **Experiences** | `jobNameEs` + `jobNameEn` | Merge → objeto | `jobName: { es, en }` |
| | `responsabilitiesEs` + `responsabilitiesEn` | Merge arrays → objeto | `responsibilities: { es: [...], en: [...] }` |
| | `date: "Jan 2024 - Present"` | Parsear a fechas | `startDate: Date, endDate: Date\|null` |
| | `companyName` | Sin cambio | `companyName` |

### Zod Schemas — Fuente de verdad

Los schemas ya están definidos y son estrictos. Referencia rápida de validaciones que afectan la migración:

- **`storedImageSchema`**: `url` debe pasar `z.url()`, `storagePath` debe ser `min(1)`. Si `url` o `refPath` son `null` en datos viejos, el documento fallará validación.
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

Lógica de parseo:
```typescript
function parseDateRange(dateStr: string): { startDate: Date; endDate: Date | null } {
  const parts = dateStr.split(' - ');
  const startDate = new Date(parts[0]); // "Jan 2024" → Date
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
- Usar factories existentes de `src/test/factories/` como referencia de datos válidos
- Coverage: todas las funciones de transformación, parseo, y detección de idempotencia

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

### Debug Log References

### Completion Notes List

### File List
