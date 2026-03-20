# Story 3.3: ImageService — Upload, Replace y Delete

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As Christopher (admin),
I want a centralized image management service that handles uploads, replacements and deletions,
So that Storage never has orphaned files regardless of what I do.

## Acceptance Criteria (AC)

1. **Upload** — `ImageService.upload(file, path)` sube archivo a Firebase Storage, retorna `StoredImage { url, storagePath }`.
2. **Replace (safe-first order)** — `ImageService.replace(oldImage, newFile, newPath)` sube nuevo primero, luego elimina viejo (upload new → delete old). Si falla upload → nada cambia. Si falla delete → huérfano viejo (limpiable), sitio muestra imagen correcta.
3. **Delete** — `ImageService.delete(image)` elimina archivo de Storage en `image.storagePath`.
4. **Delete by prefix (cascade)** — `ImageService.deleteByPrefix(pathPrefix)` elimina todos los archivos bajo ese prefijo (para borrado cascada de entidades completas).
5. **ImageSlot processing** — La función `processImageSlot` resuelve los 5 estados del discriminated union `ImageSlot`: `empty` (no-op), `existing` (no-op), `new` (upload), `replaced` (upload new + mark old for delete), `removed` (mark for delete). Retorna `StoredImage | null` + lista de paths a eliminar.
6. **Retry en error de red** — Todas las operaciones de Storage reintentan en error de red (máximo 2 retries con backoff).
7. **Ubicación** — ImageService vive en `src/lib/firebase/image-service.ts`.

**(FR38, FR39, FR40, FR41, NFR28)**

## BDD Scenarios

### Scenario 1: Upload exitoso
```gherkin
Given un archivo File válido y un path "projects/abc123/main.webp"
When llamo ImageService.upload(file, path)
Then el archivo se sube a Firebase Storage en ese path
And retorna StoredImage con url (download URL) y storagePath (el path dado)
```

### Scenario 2: Replace exitoso (safe-first order)
```gherkin
Given una StoredImage existente y un archivo nuevo
When llamo ImageService.replace(oldImage, newFile, newPath)
Then primero sube el archivo nuevo a newPath
And obtiene la download URL del nuevo archivo
And luego elimina el archivo viejo de oldImage.storagePath
And retorna la nueva StoredImage
```

### Scenario 3: Replace — falla upload
```gherkin
Given una StoredImage existente y un archivo nuevo
When llamo ImageService.replace(oldImage, newFile, newPath) y el upload falla
Then la imagen vieja sigue intacta en Storage
And se propaga el error al caller
```

### Scenario 4: Replace — falla delete del viejo
```gherkin
Given una StoredImage existente y un archivo nuevo
When llamo ImageService.replace(oldImage, newFile, newPath) y el upload pasa pero delete falla
Then la nueva imagen está en Storage y su StoredImage se retorna
And el archivo viejo queda como huérfano (mejor que perder la nueva)
And el error de delete se logea con console.warn pero no se propaga
```

### Scenario 5: Delete exitoso
```gherkin
Given una StoredImage con storagePath "projects/abc123/main.webp"
When llamo ImageService.delete(image)
Then el archivo se elimina de Storage
```

### Scenario 6: Delete by prefix (cascade)
```gherkin
Given archivos en Storage bajo "projects/abc123/"
When llamo ImageService.deleteByPrefix("projects/abc123/")
Then se listan todos los archivos bajo ese prefijo
And se elimina cada uno
```

### Scenario 7: ImageSlot processing — new
```gherkin
Given un ImageSlot de tipo 'new' con file y preview
When proceso el slot con processImageSlot(slot, basePath)
Then llama ImageService.upload(slot.file, basePath + uuid + extension)
And retorna { image: StoredImage, toDelete: [] }
```

### Scenario 8: ImageSlot processing — replaced
```gherkin
Given un ImageSlot de tipo 'replaced' con old StoredImage y nuevo file
When proceso el slot con processImageSlot(slot, basePath)
Then llama ImageService.upload(slot.file, basePath + uuid + extension)
And retorna { image: newStoredImage, toDelete: [old.storagePath] }
```

### Scenario 9: ImageSlot processing — removed
```gherkin
Given un ImageSlot de tipo 'removed' con old StoredImage
When proceso el slot
Then retorna { image: null, toDelete: [old.storagePath] }
```

### Scenario 10: Retry en error de red
```gherkin
Given una operación de Storage que falla con error de red
When se ejecuta con retry
Then reintenta hasta 2 veces con backoff exponencial (300ms, 600ms)
And si todos fallan, propaga el error final
```

## Tasks / Subtasks

- [ ] Task 1: Crear `src/lib/firebase/image-service.ts` (AC: 1, 2, 3, 4, 6)
  - [ ] 1.1 Crear helper `withRetry<T>(fn: () => Promise<T>, maxRetries?: number): Promise<T>` — retry con backoff exponencial (300ms base) solo en errores de red (`storage/retry-limit-exceeded`, `storage/canceled`, TypeError network). Máximo 2 retries.
  - [ ] 1.2 Implementar `upload(file: File, path: string): Promise<StoredImage>` — usa `ref(storage, path)` + `uploadBytes(ref, file)` + `getDownloadURL(ref)`. Wrapped en `withRetry`.
  - [ ] 1.3 Implementar `replace(oldImage: StoredImage, file: File, newPath: string): Promise<StoredImage>` — safe-first: `upload(file, newPath)` primero, luego `deleteObject(ref(storage, oldImage.storagePath))` en try/catch (fallo en delete = `console.warn`, no propagar).
  - [ ] 1.4 Implementar `deleteSingle(image: StoredImage): Promise<void>` — `deleteObject(ref(storage, image.storagePath))`. Wrapped en `withRetry`.
  - [ ] 1.5 Implementar `deleteByPrefix(pathPrefix: string): Promise<void>` — `listAll(ref(storage, pathPrefix))` → `Promise.allSettled(items.map(item => deleteObject(item)))`. Log warnings para fallos individuales.
  - [ ] 1.6 Exportar como objeto singleton: `export const imageService = { upload, replace, delete: deleteSingle, deleteByPrefix }`. Usar nombre `deleteSingle` internamente porque `delete` es keyword reservada.

- [ ] Task 2: Crear `src/lib/firebase/image-slot-processor.ts` (AC: 5)
  - [ ] 2.1 Crear tipo `ProcessedSlot = { image: StoredImage | null; toDelete: string[] }`.
  - [ ] 2.2 Implementar `processImageSlot(slot: ImageSlot, basePath: string): Promise<ProcessedSlot>`:
    - `empty` → `{ image: null, toDelete: [] }`
    - `existing` → `{ image: slot.image, toDelete: [] }`
    - `new` → upload con `imageService.upload(slot.file, basePath + crypto.randomUUID() + '.webp')` → `{ image: result, toDelete: [] }`
    - `replaced` → upload nuevo → `{ image: result, toDelete: [slot.old.storagePath] }`
    - `removed` → `{ image: null, toDelete: [slot.old.storagePath] }`
  - [ ] 2.3 Implementar `cleanupDeletedImages(paths: string[]): Promise<void>` — para cada path, wrappear `deleteObject(ref(storage, path))` en `withRetry` (importar de `./image-service`), luego ejecutar todos con `Promise.allSettled`. Log warnings para fallos individuales, no propaga errores.
  - [ ] 2.4 Importar `ImageSlot` desde `../schemas/image-slot` (ya existe) y `StoredImage` desde `../schemas/shared-schemas`.

- [ ] Task 3: Agregar error messages bilingües para Storage (AC: 6)
  - [ ] 3.1 Crear `src/lib/firebase/storage-errors.ts` — mismo patrón que `auth-errors.ts` (importar `type { Locale } from '../i18n/config'`, `hasCode()` type guard, record de error codes, función exportada con fallback genérico):
    - `storage/unauthorized`: "No tienes permiso para esta operación" / "You do not have permission for this operation"
    - `storage/canceled`: "Operación cancelada" / "Operation canceled"
    - `storage/unknown`: "Error inesperado en Storage" / "Unexpected Storage error"
    - `storage/object-not-found`: "Archivo no encontrado" / "File not found"
    - `storage/quota-exceeded`: "Cuota de almacenamiento excedida" / "Storage quota exceeded"
    - `storage/retry-limit-exceeded`: "Error de conexión. Intenta de nuevo." / "Connection error. Please try again."
    - `storage/invalid-argument`: "Archivo inválido" / "Invalid file"
  - [ ] 3.2 Exportar `getStorageErrorMessage(error: unknown, locale: Locale): string` — misma firma que `getErrorMessage` en `auth-errors.ts`.

- [ ] Task 4: Tests unitarios del ImageService (AC: 1, 2, 3, 4, 6)
  - [ ] 4.1 Crear `src/lib/firebase/__tests__/image-service.test.ts`
  - [ ] 4.2 Mock `firebase/storage` — `ref`, `uploadBytes`, `getDownloadURL`, `deleteObject`, `listAll` (mismo patrón que `client.test.ts`)
  - [ ] 4.3 Test upload exitoso: verifica `uploadBytes` llamado con ref y file, `getDownloadURL` llamado, retorna `StoredImage` correcta
  - [ ] 4.4 Test replace safe-first order: verifica upload llamado ANTES de delete, verifica retorno correcto
  - [ ] 4.5 Test replace — upload falla: verifica `deleteObject` NUNCA llamado, error propagado
  - [ ] 4.6 Test replace — delete falla: verifica retorno correcto (nueva image), `console.warn` llamado, error NO propagado
  - [ ] 4.7 Test delete exitoso: verifica `deleteObject` llamado con ref correcto
  - [ ] 4.8 Test deleteByPrefix: verifica `listAll` llamado, cada item eliminado
  - [ ] 4.9 Test deleteByPrefix con items vacíos: `listAll` retorna `{ items: [] }` → completa sin error, `deleteObject` nunca llamado
  - [ ] 4.10 Test `isRetryableError`: verifica retorna `true` para `storage/retry-limit-exceeded`, `storage/canceled`, TypeError con 'fetch'; retorna `false` para `storage/unauthorized`, `storage/object-not-found`, `storage/quota-exceeded`, Error genérico
  - [ ] 4.11 Test retry: mock que falla 1 vez y luego pasa → verifica función llamada 2 veces, retorno correcto
  - [ ] 4.12 Test retry agotado: mock que falla 3 veces → verifica error propagado

- [ ] Task 5: Tests unitarios del ImageSlot processor (AC: 5)
  - [ ] 5.1 Crear `src/lib/firebase/__tests__/image-slot-processor.test.ts`
  - [ ] 5.2 Test `processImageSlot` con tipo 'empty': retorna `{ image: null, toDelete: [] }`
  - [ ] 5.3 Test `processImageSlot` con tipo 'existing': retorna image sin modificar, toDelete vacío
  - [ ] 5.4 Test `processImageSlot` con tipo 'new': verifica upload llamado, retorna StoredImage
  - [ ] 5.5 Test `processImageSlot` con tipo 'replaced': verifica upload llamado, toDelete contiene old path
  - [ ] 5.6 Test `processImageSlot` con tipo 'removed': retorna null, toDelete contiene old path
  - [ ] 5.7 Test `cleanupDeletedImages`: verifica cada path eliminado, fallos individuales no propagan error

- [ ] Task 6: Tests de storage-errors (AC: 3)
  - [ ] 6.1 Crear `src/lib/firebase/__tests__/storage-errors.test.ts`
  - [ ] 6.2 Test cada error code mapea al mensaje correcto en ES y EN
  - [ ] 6.3 Test error desconocido retorna mensaje genérico

- [ ] Task 7: Validación pipeline (todos los ACs)
  - [ ] 7.1 `pnpm lint` — sin errores
  - [ ] 7.2 `pnpm type-check` — sin errores TypeScript
  - [ ] 7.3 `pnpm build` — build exitoso
  - [ ] 7.4 `pnpm test` — todos los tests pasan (existentes + nuevos)

## Dev Notes

### PREREQUISITO: Leer Project Context

**ANTES de implementar**, leer `_bmad-output/project-context.md` — contiene las 68 reglas del proyecto. Todas las reglas aplican a esta story.

### Esta Story es Pura Lógica — Zero UI

Esta story NO tiene componentes visuales. Crea servicios TypeScript puros que serán consumidos por las stories 3.4–3.8 (CRUD forms). Esto significa:
- **Sin componentes Svelte** — solo archivos `.ts` en `src/lib/firebase/`
- **Sin páginas Astro** — no modificar ninguna página
- **Sin Tailwind/CSS** — no hay UI
- **Sin translation keys** — los mensajes de error van en `storage-errors.ts`, no en `translations.ts`
- **100% testeable con mocks** — sin necesidad de Firebase emuladores

### Firebase Storage Client SDK — API Functions

Firebase v12.10.0. Todas las funciones se importan de `firebase/storage`:

```typescript
import {
  ref,           // Crear referencia a un path en Storage
  uploadBytes,   // Subir archivo (File/Blob/Uint8Array)
  getDownloadURL,// Obtener URL pública de descarga
  deleteObject,  // Eliminar un archivo
  listAll,       // Listar todos los archivos bajo un prefijo
} from 'firebase/storage';
import { storage } from './client'; // Singleton ya exportado
```

**Uso correcto:**
```typescript
const storageRef = ref(storage, 'projects/abc123/main.webp');
await uploadBytes(storageRef, file);
const url = await getDownloadURL(storageRef);
await deleteObject(storageRef);

// Para listar y eliminar por prefijo:
const prefixRef = ref(storage, 'projects/abc123/');
const result = await listAll(prefixRef);
await Promise.allSettled(result.items.map(item => deleteObject(item)));
```

### StoredImage y ImageSlot — Ya Existen

**NO crear estos tipos** — ya están definidos:

- `StoredImage` → `src/lib/schemas/shared-schemas.ts` (línea 15-18, Zod schema + type)
- `ImageSlot` → `src/lib/schemas/image-slot.ts` (discriminated union con 5 estados)

Importar directamente:
```typescript
import type { StoredImage } from '../schemas/shared-schemas';
import type { ImageSlot } from '../schemas/image-slot';
```

### CRÍTICO — No Importar de collections.ts

`src/lib/firebase/collections.ts` importa `firebase-admin/firestore` (Admin SDK). **NUNCA importar desde este archivo** en código que corre en browser — causa side-effects fatales. El ImageService corre en browser → solo importar de `./client.ts`.

### Storage Paths — Convención con UUID

- Formato: siempre `.webp` (convertir antes de subir si es necesario — pero la conversión NO es parte de esta story)
- UUID: usar `crypto.randomUUID()` (nativo en browsers modernos, Node 22+)
- Pattern: `{entity}/{entityId}/{purpose}/{uuid}.webp`
  - `projects/{projectId}/main/{uuid}.webp`
  - `projects/{projectId}/screenshots/{uuid}.webp`
  - `technologies/{techId}/{uuid}.webp`
  - `blog/{postId}/cover/{uuid}.webp`
  - `blog/{postId}/images/{uuid}.webp`

**IMPORTANTE**: Los paths concretos los genera el CALLER (story 3.4+), no el ImageService. El service recibe `path` como string y lo usa tal cual.

### Orden de Operaciones (Safe-First) — Critical

El patrón safe-first del `replace` es un requisito de arquitectura:

1. Upload nuevo archivo → obtener URL (si falla → nada cambió, imagen vieja sigue funcionando)
2. Retornar nueva StoredImage al caller (el caller actualiza Firestore)
3. Eliminar archivo viejo (si falla → huérfano viejo, limpiable, sitio muestra imagen correcta)

El paso 2 (actualizar Firestore) NO es responsabilidad del ImageService — eso lo hace el caller. El `replace` solo retorna la nueva StoredImage y hace best-effort delete del viejo.

### Retry Strategy — Solo Errores de Red

No reintentar TODOS los errores. Solo reintentar cuando hay probabilidad de éxito en retry:
- `storage/retry-limit-exceeded` → sí, reintentar
- `storage/canceled` → sí, reintentar (podría ser timeout)
- `TypeError` con mensaje de network → sí, reintentar
- `storage/unauthorized` → NO reintentar (no se va a resolver solo)
- `storage/object-not-found` → NO reintentar
- `storage/quota-exceeded` → NO reintentar

```typescript
function isRetryableError(error: unknown): boolean {
  if (error instanceof TypeError && error.message.includes('fetch')) return true;
  if (typeof error === 'object' && error !== null && 'code' in error) {
    const code = (error as { code: string }).code;
    return code === 'storage/retry-limit-exceeded' || code === 'storage/canceled';
  }
  return false;
}
```

### Pattern de Tests — Seguir client.test.ts

Los tests deben mockear `firebase/storage` completo, igual que `client.test.ts` mockea `firebase/app`, `firebase/auth`, etc. No importar el módulo real de Firebase.

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock firebase/storage
vi.mock('firebase/storage', () => ({
  ref: vi.fn(() => ({ fullPath: 'mocked/path' })),
  uploadBytes: vi.fn(() => Promise.resolve()),
  getDownloadURL: vi.fn(() => Promise.resolve('https://storage.example.com/file.webp')),
  deleteObject: vi.fn(() => Promise.resolve()),
  listAll: vi.fn(() => Promise.resolve({ items: [], prefixes: [] })),
}));

// Mock client.ts para obtener storage
vi.mock('../client', () => ({
  storage: { name: 'storage-mock' },
}));
```

### Exportación como Objeto vs Clase

La arquitectura define `class ImageService`, pero para este proyecto la implementación como objeto singleton es más idiomática en TypeScript/Svelte (no hay estado de instancia, no hay herencia). Exportar funciones agrupadas.

**NOTA**: Exportar también `withRetry` e `isRetryableError` — `image-slot-processor.ts` necesita `withRetry` para `cleanupDeletedImages`, y los tests necesitan `isRetryableError` para validación directa.

```typescript
export const imageService = {
  upload,
  replace,
  delete: deleteSingle,  // 'delete' es keyword reservada
  deleteByPrefix,
};
```

Las stories 3.4+ importarán: `import { imageService } from '../../lib/firebase/image-service';`

### deleteByPrefix — Cuidado con `listAll`

`listAll()` de Firebase client SDK lista **todos** los archivos bajo un prefijo. Para este portfolio el volumen es bajo (<50 archivos por entidad), así que es seguro. NO usar paginación (`list()`) — innecesario para el volumen esperado.

Si `listAll()` retorna items vacíos (no hay archivos bajo el prefijo), la función debe completar sin error.

### Storage Rules — Ya Configuradas

`storage.rules` ya tiene lectura pública y escritura solo para UID admin. No modificar. Las operaciones de upload/delete requieren que el usuario esté autenticado con el UID correcto — esto ya está garantizado por AuthGuard en las stories 3.4+.

### Archivos a Crear

| Archivo | Propósito |
|---------|----------|
| `src/lib/firebase/image-service.ts` | ImageService: upload, replace, delete, deleteByPrefix con retry |
| `src/lib/firebase/image-slot-processor.ts` | processImageSlot y cleanupDeletedImages |
| `src/lib/firebase/storage-errors.ts` | Mapeo de errores Storage a mensajes bilingües |
| `src/lib/firebase/__tests__/image-service.test.ts` | Tests unitarios ImageService |
| `src/lib/firebase/__tests__/image-slot-processor.test.ts` | Tests unitarios ImageSlot processor |
| `src/lib/firebase/__tests__/storage-errors.test.ts` | Tests de mapeo de errores |

### Archivos Existentes — NO Modificar

| Archivo | Por qué no tocar |
|---------|-----------------|
| `src/lib/firebase/client.ts` | Ya exporta `storage` — listo para usar |
| `src/lib/firebase/collections.ts` | Admin SDK only — no importar en browser code |
| `src/lib/schemas/shared-schemas.ts` | `StoredImage` ya definido — solo importar |
| `src/lib/schemas/image-slot.ts` | `ImageSlot` ya definido — solo importar |
| `storage.rules` | Ya configurado (read público, write admin UID) |

### Project Structure Notes

- Todos los archivos nuevos van en `src/lib/firebase/` (service layer)
- Tests co-locados en `src/lib/firebase/__tests__/`
- Naming: kebab-case para archivos (`image-service.ts`, `image-slot-processor.ts`)
- Imports relativos sin aliases: `import { storage } from './client'`, `import type { StoredImage } from '../schemas/shared-schemas'`

### Previous Story Intelligence (Story 3.2)

**Aprendizajes clave que aplican aquí:**

1. **`client:only="svelte"` para todo admin** — No aplica directamente (esta story no tiene componentes Svelte), pero los consumers futuros (stories 3.4+) lo necesitarán.

2. **Mock pattern de Firebase**: `client.test.ts` establece el patrón de mocking completo de módulos Firebase. Seguir exactamente ese patrón para Storage mocks.

3. **ESLint globals para browser APIs**: Story 3.2 ya configuró `...globals.browser` en ESLint. `crypto.randomUUID()` es una browser API — ya estará cubierta.

4. **Patrón de error handling con `auth-errors.ts`**: Seguir exactamente la misma estructura para `storage-errors.ts` — `import type { Locale } from '../i18n/config'` + `hasCode()` helper + record de error codes + fallback genérico. La arquitectura sugiere centralizar errores en `src/lib/utils/error-messages.ts`, pero el patrón establecido en el código real es separación por feature (`auth-errors.ts`, `storage-errors.ts`) — seguir el patrón establecido.

### Git Intelligence

Commits recientes relevantes:
- `1af990e` — Code review patches 3.2: ESLint globals con `...globals.browser` (habilita `crypto.randomUUID()`)
- `aaa56ed` — Code review patches 3.1: seguridad auth, `signOut` try/catch pattern
- `41a679c` — Fix: `client:only` para admin components

Patrón de commits: prefijo semántico en inglés (`feat:`, `fix:`, `docs:`).

### Quick Sanity Checklist (antes de marcar como completo)

- [ ] `pnpm lint` — sin errores
- [ ] `pnpm type-check` — sin errores TypeScript
- [ ] `pnpm test` — todos los tests pasan (existentes + nuevos)
- [ ] Ningún import referencia `collections.ts` ni Admin SDK
- [ ] `imageService` exportado como objeto singleton con `upload`, `replace`, `delete`, `deleteByPrefix`
- [ ] `withRetry` e `isRetryableError` exportados para uso en `image-slot-processor.ts` y tests

### References

- [Source: _bmad-output/planning-artifacts/epics.md — Epic 3, Story 3.3, líneas 605-620]
- [Source: _bmad-output/planning-artifacts/architecture.md — Image Management Architecture, líneas 295-350]
- [Source: _bmad-output/planning-artifacts/architecture.md — Storage Paths, Naming Patterns, líneas 500-518]
- [Source: _bmad-output/planning-artifacts/architecture.md — Service Boundaries, líneas 1037-1044]
- [Source: _bmad-output/planning-artifacts/architecture.md — Enforcement Guidelines, líneas 770-816]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md — ImageUploader spec, líneas 739-756]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md — Image States Admin, líneas 882-891]
- [Source: _bmad-output/planning-artifacts/prd.md — FR38-FR41 Image Management, líneas 380-383]
- [Source: _bmad-output/planning-artifacts/prd.md — NFR28 Storage reliability, línea 452]
- [Source: _bmad-output/project-context.md — Firebase Dual SDK Pattern, Anti-Patrones, UUID paths]
- [Source: _bmad-output/implementation-artifacts/3-2-admin-dashboard-y-sidebar-navigation.md — Dev Notes, ESLint globals, mock pattern]

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
