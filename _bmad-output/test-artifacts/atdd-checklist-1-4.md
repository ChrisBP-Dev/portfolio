---
stepsCompleted: ['step-01-preflight-and-context', 'step-02-generation-mode', 'step-03-test-strategy', 'step-04-generate-tests', 'step-04c-aggregate', 'step-05-validate-and-complete']
lastStep: 'step-05-validate-and-complete'
lastSaved: '2026-03-17'
inputDocuments:
  - _bmad-output/implementation-artifacts/1-4-zod-schemas-y-modelos-de-datos.md
  - _bmad/tea/config.yaml
  - _bmad/tea/testarch/knowledge/data-factories.md
  - _bmad/tea/testarch/knowledge/test-quality.md
  - _bmad/tea/testarch/knowledge/test-levels-framework.md
  - _bmad/tea/testarch/knowledge/test-healing-patterns.md
  - src/test/factories/__tests__/factories.test.ts
---

# ATDD Checklist — Story 1.4: Zod Schemas y Modelos de Datos

## Step 1: Preflight & Context

### Stack Detectado
- **Tipo**: `frontend` (Astro 6.0.5, Svelte 5, Firebase)
- **Test unitario**: Vitest 4.1.0 (`vitest.config.ts`)
- **Test E2E**: Playwright 1.58.2 (`playwright.config.ts`)
- **Node**: 22.12.0, ESM, pnpm

### Nivel de Test Seleccionado
**UNIT** — Story 1.4 es lógica pura de validación (schemas Zod, tipos derivados, factories). No hay UI ni journeys.

### Acceptance Criteria Extraídos
1. Shared schemas (`localizedString`, `storedImageSchema`, `localeSchema`) validan correctamente con autocompletion TypeScript
2. `projectSchema` valida: companyName, shortDescription, features (Localized), mainImage/screenshots (StoredImage[]), slug, technologies, urls opcional
3. `technologySchema` valida: name, image (StoredImage), experienceYears (number)
4. `experienceSchema` valida: companyName, jobName (Localized), responsibilities (Localized<string[]>), startDate, endDate nullable
5. `blogPostSchema` valida: title/content (Localized), slug, coverImage, images array, status 'published'|'draft', createdAt, updatedAt
6. Tipos TypeScript derivados via `z.infer<>` (Project, Technology, Experience, BlogPost, StoredImage, Locale)
7. Schemas viven en `src/lib/schemas/` con kebab-case naming

### Componentes Afectados
- `src/lib/schemas/shared-schemas.ts` (NUEVO)
- `src/lib/schemas/project-schema.ts` (NUEVO)
- `src/lib/schemas/technology-schema.ts` (NUEVO)
- `src/lib/schemas/experience-schema.ts` (NUEVO)
- `src/lib/schemas/blog-post-schema.ts` (NUEVO)
- `src/lib/schemas/image-slot.ts` (NUEVO — type puro, no Zod)
- `src/test/factories/*.ts` (MODIFICADOS — tipos de Zod)
- `src/test/factories/types.ts` (ELIMINADO)

### Patrones Existentes
- Factories con `createEntity(overrides?: Partial<T>): T`
- Tests con Vitest `describe/it/expect`
- 9 tests existentes que serán reescritos

## Step 2: Modo de Generación

**Modo**: Generación por IA
**Razón**: ACs claros, escenarios estándar de validación de datos, sin UI involucrada. Recording no aplica.

## Step 3: Test Strategy

### Matriz de Tests (32 tests)

| AC | Test ID | Escenario | Nivel | Prioridad |
|----|---------|-----------|-------|-----------|
| #1 | 1.4-UNIT-001 | localeSchema acepta 'es' y 'en' | Unit | P0 |
| #1 | 1.4-UNIT-002 | localeSchema rechaza strings inválidos | Unit | P1 |
| #1 | 1.4-UNIT-003 | localizedString acepta {es, en} con strings no vacíos | Unit | P0 |
| #1 | 1.4-UNIT-004 | localizedString rechaza strings vacíos (min(1)) | Unit | P1 |
| #1 | 1.4-UNIT-005 | localizedString rechaza claves faltantes | Unit | P1 |
| #1 | 1.4-UNIT-006 | localizedStringArray acepta arrays (incluso vacíos) | Unit | P0 |
| #1 | 1.4-UNIT-007 | storedImageSchema acepta {url válida, storagePath no vacío} | Unit | P0 |
| #1 | 1.4-UNIT-008 | storedImageSchema rechaza URL inválida | Unit | P1 |
| #1 | 1.4-UNIT-009 | storedImageSchema rechaza storagePath vacío | Unit | P1 |
| #2 | 1.4-UNIT-010 | projectSchema acepta datos válidos completos | Unit | P0 |
| #2 | 1.4-UNIT-011 | projectSchema — websiteUrl y sourceCodeUrl opcionales | Unit | P1 |
| #2 | 1.4-UNIT-012 | projectSchema rechaza slug vacío | Unit | P1 |
| #2 | 1.4-UNIT-013 | projectSchema rechaza campo requerido faltante | Unit | P1 |
| #3 | 1.4-UNIT-014 | technologySchema acepta datos válidos | Unit | P0 |
| #3 | 1.4-UNIT-015 | technologySchema rechaza experienceYears negativo | Unit | P1 |
| #3 | 1.4-UNIT-016 | technologySchema rechaza experienceYears decimal | Unit | P1 |
| #3 | 1.4-UNIT-017 | technologySchema rechaza name vacío | Unit | P1 |
| #4 | 1.4-UNIT-018 | experienceSchema acepta datos con endDate null | Unit | P0 |
| #4 | 1.4-UNIT-019 | experienceSchema acepta endDate como Date | Unit | P1 |
| #4 | 1.4-UNIT-020 | experienceSchema rechaza endDate undefined | Unit | P1 |
| #4 | 1.4-UNIT-021 | experienceSchema — startDate debe ser Date | Unit | P1 |
| #5 | 1.4-UNIT-022 | blogPostSchema acepta datos con status 'published' | Unit | P0 |
| #5 | 1.4-UNIT-023 | blogPostSchema acepta status 'draft' | Unit | P1 |
| #5 | 1.4-UNIT-024 | blogPostSchema rechaza status inválido | Unit | P1 |
| #5 | 1.4-UNIT-025 | blogPostSchema — images puede ser array vacío | Unit | P1 |
| #6 | 1.4-UNIT-026 | Tipos derivados z.infer<> compilan correctamente | Unit | P0 |
| — | 1.4-UNIT-027 | createProject() pasa projectSchema.parse() | Unit | P0 |
| — | 1.4-UNIT-028 | createTechnology() pasa technologySchema.parse() | Unit | P0 |
| — | 1.4-UNIT-029 | createExperience() pasa experienceSchema.parse() | Unit | P0 |
| — | 1.4-UNIT-030 | createBlogPost() pasa blogPostSchema.parse() | Unit | P0 |
| — | 1.4-UNIT-031 | Cada factory acepta overrides | Unit | P2 |
| — | 1.4-UNIT-032 | Cada factory genera IDs únicos | Unit | P2 |

### Distribución por Prioridad
- **P0**: 11 tests (validación positiva + factory→schema)
- **P1**: 17 tests (validación negativa)
- **P2**: 4 tests (overrides, unicidad)

### Red Phase
Todos fallarán antes de implementación — los módulos target no existen (solo .gitkeep).

## Step 4: Test Generation (TDD RED PHASE)

### Ejecución
- **Modo**: Sequential (unit tests, sin API/E2E)
- **Adaptación**: Story 1.4 es 100% unit — se generaron tests directamente sin subagents API/E2E

### Archivos Generados

| Archivo | Tests | Descripción |
|---------|-------|-------------|
| `src/lib/schemas/__tests__/schemas.test.ts` | 26 | Validación positiva/negativa de shared + entity schemas |
| `src/test/factories/__tests__/factories.test.ts` | 6 | Factory→Schema validation, overrides, IDs únicos |
| **Total** | **32** | Todos con `it.skip()` |

### TDD Red Phase Verification
```
pnpm test → 2 test files, 32 tests skipped, 0 passed, 0 failed
```

### Cobertura de Acceptance Criteria
- AC #1 (Shared schemas): 9 tests (UNIT-001 a UNIT-009)
- AC #2 (projectSchema): 4 tests (UNIT-010 a UNIT-013)
- AC #3 (technologySchema): 4 tests (UNIT-014 a UNIT-017)
- AC #4 (experienceSchema): 4 tests (UNIT-018 a UNIT-021)
- AC #5 (blogPostSchema): 4 tests (UNIT-022 a UNIT-025)
- AC #6 (Tipos z.infer<>): 1 test (UNIT-026)
- Factories: 6 tests (UNIT-027 a UNIT-032)

## Step 5: Validación y Completación

### Validación Final

| Criterio | Estado |
|----------|--------|
| Prerrequisitos satisfechos | OK — Vitest 4.1.0 configurado, story con 7 ACs |
| Archivos de test creados | OK — 2 archivos, 32 tests |
| Checklist cubre todos los ACs | OK — 7 ACs mapeados a 32 tests |
| Tests fallan antes de implementación | OK — 32 skipped, 0 passed |
| Artefactos en ubicación correcta | OK — `_bmad-output/test-artifacts/atdd-checklist-1-4.md` |

### Archivos Generados

```
src/lib/schemas/__tests__/schemas.test.ts    ← 26 tests (schemas)
src/test/factories/__tests__/factories.test.ts ← 6 tests (factories)
_bmad-output/test-artifacts/atdd-checklist-1-4.md ← este documento
```

### Riesgos y Supuestos

1. **Zod 4 `z.url()` comportamiento**: Task 1.3 de la story requiere verificar si `z.url()` infiere `string` o `URL`. Si infiere `URL`, los tests de `storedImageSchema` necesitarán ajustar expectations.
2. **`exactOptionalPropertyTypes`**: La config TypeScript strictest puede afectar cómo `.optional()` interactúa con `Partial<T>` en factories. Los tests de overrides (UNIT-031) validan esto.
3. **endDate nullable vs optional**: El test UNIT-020 valida que `endDate` omitido falla — confirma que `.nullable()` NO es `.optional()`.

### Next Steps (TDD Green Phase)

Después de implementar Story 1.4:

1. Descomentar los imports y assertions en cada test
2. Remover `it.skip()` → cambiar a `it()`
3. Ejecutar `pnpm test` → verificar que los 32 tests pasan (green phase)
4. Si algún test falla:
   - Bug en implementación → corregir schema/factory
   - Bug en test → corregir test
5. Ejecutar `pnpm lint && pnpm type-check` → 0 errores
6. Commit de tests pasando

### Workflow Recomendado

Usar `/bmad-dev-story` con `1-4-zod-schemas-y-modelos-de-datos.md` para implementar la story. Los tests ATDD guiarán la implementación.
