# Story 1.2: Infraestructura de Testing Local

Status: done

## Story

As a developer,
I want Firebase emulators, test frameworks and data factories operational locally,
So that every feature I build from this point forward can be developed with tests from day one.

## Acceptance Criteria

1. **Given** Firebase Emulator Suite is configured **When** I run `pnpm emulators` **Then** Auth, Firestore and Storage emulators start on dedicated ports without errors
2. **And** `firebase.json` configures emulator ports for Auth (9099), Firestore (8080), Storage (9199) with UI en port 4000
3. **And** Vitest is configured — `pnpm test` executes with `getViteConfig()` from Astro and reports zero tests (no failures)
4. **And** Playwright is configured — `pnpm test:e2e` initializes against the preview server sin errores
5. **And** test data factory module exists in `src/test/factories/` — `createProject()`, `createTechnology()`, `createExperience()`, `createBlogPost()` each returns a valid typed object matching the data model
6. **And** `README.md` documents how to run emulators and tests locally

## Tasks / Subtasks

- [x] Task 1: Configurar Firebase Emulator Suite (AC: #1, #2)
  - [x] 1.1 Instalar `firebase-tools` como devDependency: `pnpm add -D firebase-tools`
  - [x] 1.2 Crear `firestore.rules` en la raíz con reglas permisivas para emuladores (ver Dev Notes)
  - [x] 1.3 Crear `storage.rules` en la raíz con reglas permisivas para emuladores (ver Dev Notes)
  - [x] 1.4 Agregar configuración de emuladores en `firebase.json` (ver Dev Notes para config exacta)
  - [x] 1.5 Agregar script `"emulators"` en `package.json`: `"firebase emulators:start --only auth,firestore,storage"` (Nota: los epics usan `test:emulators` pero se usa `emulators` porque no es un test — es infraestructura. `--only` excluye Hosting porque usamos `pnpm preview` de Astro para servir)
  - [x] 1.6 Verificar Java disponible: `java -version` debe reportar 11+ (prerequisito de Firebase Emulators — sin Java los emuladores fallan silenciosamente)
  - [x] 1.7 Verificar que `pnpm emulators` levanta los 3 emuladores (output esperado: `✔  All emulators ready!` con Auth en 127.0.0.1:9099, Firestore en 127.0.0.1:8080, Storage en 127.0.0.1:9199, UI en 127.0.0.1:4000)
  - [x] 1.8 Agregar `emulator-data/` a `.gitignore`

- [x] Task 2: Configurar Vitest con Astro (AC: #3)
  - [x] 2.1 Instalar `@vitest/coverage-v8` como devDependency: `pnpm add -D @vitest/coverage-v8` (Vitest 4 requiere el provider de coverage como paquete separado)
  - [x] 2.2 Crear `vitest.config.ts` usando `getViteConfig()` de Astro (ver Dev Notes para config exacta)
  - [x] 2.3 Agregar script `"test"` en `package.json`: `"vitest run"`
  - [x] 2.4 Agregar script `"test:watch"` en `package.json`: `"vitest"`
  - [x] 2.5 Agregar script `"test:coverage"` en `package.json`: `"vitest run --coverage"`
  - [x] 2.6 Verificar que `pnpm test` ejecuta sin errores y reporta zero tests (output esperado: `No test files found` o similar, exit code 0)

- [x] Task 3: Configurar Playwright (AC: #4)
  - [x] 3.1 Crear `playwright.config.ts` con webServer apuntando a `pnpm preview` en port 4321 (ver Dev Notes)
  - [x] 3.2 Instalar browsers de Playwright: `pnpm exec playwright install` (descarga binarios de Chromium, Firefox, WebKit — sin esto, test:e2e falla con "Executable doesn't exist")
  - [x] 3.3 Agregar script `"test:e2e"` en `package.json`: `"playwright test"`
  - [x] 3.4 Agregar `test-results/`, `playwright-report/` a `.gitignore`
  - [x] 3.5 Ejecutar `pnpm build && pnpm test:e2e` y verificar que inicializa sin errores (output esperado: `no tests found` o `0 passed`, exit code 0)

- [x] Task 4: Crear test data factories (AC: #5)
  - [x] 4.1 Crear directorio `src/test/factories/`
  - [x] 4.2 Crear `src/test/factories/index.ts` que re-exporte todas las factories
  - [x] 4.3 Crear `src/test/factories/project.ts` con `createProject(overrides?)` que retorna un objeto `Project` tipado
  - [x] 4.4 Crear `src/test/factories/technology.ts` con `createTechnology(overrides?)` que retorna un objeto `Technology` tipado
  - [x] 4.5 Crear `src/test/factories/experience.ts` con `createExperience(overrides?)` que retorna un objeto `Experience` tipado
  - [x] 4.6 Crear `src/test/factories/blog-post.ts` con `createBlogPost(overrides?)` que retorna un objeto `BlogPost` tipado
  - [x] 4.7 Crear `src/test/factories/__tests__/factories.test.ts` — un test básico que verifica que cada factory retorna un objeto con las propiedades esperadas
  - [x] 4.8 Verificar que `pnpm test` ejecuta el test de factories exitosamente (output esperado: `1 passed` o similar, exit code 0)

- [x] Task 5: Documentar en README (AC: #6)
  - [x] 5.1 Crear `README.md` en la raíz del proyecto con secciones: Setup, Scripts, Emuladores, Tests
  - [x] 5.2 Documentar prerequisitos (Node 22+, pnpm 10+, Java 11+ para emuladores)
  - [x] 5.3 Documentar cómo levantar emuladores y ejecutar tests

## Dev Notes

### Contexto Crítico

Esta story establece la **infraestructura de testing** que todas las stories subsiguientes usarán. Las dependencias core (`vitest`, `playwright`, `@playwright/test`) ya fueron instaladas en Story 1.1. Esta story crea las configuraciones, las rules files para emuladores, y las test data factories.

**Dependencia de Story 1.4 (Zod schemas):** Las factories en esta story usan **TypeScript interfaces** para definir la forma de los datos. Cuando Story 1.4 cree los Zod schemas reales, las factories serán actualizadas para importar y validar contra ellos. Por ahora, las interfaces definen el contrato de datos basado en el modelo de Firestore documentado en la arquitectura.

### Inteligencia de Story 1-1

Estado actual del proyecto tras Story 1-1 (confirmado por git y code review):
- **Versiones instaladas:** Vitest **4.1.0**, Playwright **1.58.2**, Firebase **12.10.0**, Firebase Admin **13.7.0** (en devDependencies), Astro **6.0.5**, Svelte **5.53.12**, Tailwind CSS **4.2.1**
- **Config de Astro:** archivo es `astro.config.ts` (TypeScript, NO `.mjs`)
- **`.prettierignore`** ya excluye `_flutter-archive`, `_bmad`, `.claude`, `docs` — no duplicar
- **`firebase.json` actual** solo tiene `hosting` config (sin emulators, sin rules refs)
- **`.gitignore` actual** no incluye `emulator-data/`, `test-results/`, ni `playwright-report/` — se deben agregar
- **`tests/e2e/.gitkeep`** ya existe de Story 1-1
- **Scripts existentes** en `package.json`: `dev`, `build`, `preview`, `type-check`, `lint`, `format` — NO modificar estos

### Prerequisito: Java JDK

Firebase Emulator Suite requiere **Java JDK 11+** instalado. Si no está disponible, los emuladores no levantarán. El README debe documentar esto como prerequisito.

### Configuración de `firebase.json` (Actualizada)

Agregar la sección `emulators` y las referencias a rules files al `firebase.json` existente:

```json
{
  "firestore": {
    "rules": "firestore.rules"
  },
  "storage": {
    "rules": "storage.rules"
  },
  "hosting": {
    "public": "dist/",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "headers": [
      {
        "source": "**/*.@(js|css|svg|png|jpg|webp|woff2)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=31536000, immutable"
          }
        ]
      }
    ]
  },
  "emulators": {
    "auth": {
      "port": 9099,
      "host": "127.0.0.1"
    },
    "firestore": {
      "port": 8080,
      "host": "127.0.0.1"
    },
    "storage": {
      "port": 9199,
      "host": "127.0.0.1"
    },
    "ui": {
      "enabled": true,
      "port": 4000
    },
    "singleProjectMode": true
  }
}
```

**IMPORTANTE:** Usar `"host": "127.0.0.1"` en cada emulador. Node 22 resuelve `localhost` a IPv6 `::1`, lo que causa errores de timeout con los emuladores.

### Rules Files para Emuladores

**`firestore.rules`** (raíz del proyecto):
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

**`storage.rules`** (raíz del proyecto):
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if true;
    }
  }
}
```

Estas son reglas permisivas para desarrollo local. Las security rules de producción se definirán en stories posteriores (Epic 3). El emulador de Storage **NO arranca** sin un archivo `storage.rules` referenciado en `firebase.json`.

### Configuración de `vitest.config.ts`

```typescript
/// <reference types="vitest/config" />
import { getViteConfig } from 'astro/config';

export default getViteConfig({
  test: {
    include: ['src/**/*.{test,spec}.{js,ts}'],
    exclude: [
      'node_modules',
      'dist',
      '_flutter-archive',
      '_bmad',
      '_bmad-output',
      '.claude',
      'tests/e2e',
    ],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,svelte}'],
      exclude: ['src/test/**', 'src/**/*.d.ts'],
    },
  },
});
```

**Notas sobre Vitest 4 con Astro 6:**
- `getViteConfig()` carga automáticamente el `astro.config.ts` y sus plugins de Vite (Svelte, Tailwind). **NO** agregar `@sveltejs/vite-plugin-svelte` manualmente — ya viene incluido
- Vitest 4 requiere Vite >= 6.0.0 — Astro 6 usa Vite 7.3.1, compatible
- Vitest 4 eliminó `poolOptions` — las opciones van directamente en `test:`
- Vitest 4 solo excluye `node_modules` y `.git` por defecto. Agregar exclusiones explícitas para `_flutter-archive`, `_bmad`, etc.
- Para tests futuros de componentes Svelte, se necesitará `@testing-library/svelte` y `jsdom` — se instalarán cuando se creen los primeros component tests (Story 1.6+)
- Para tests de componentes Astro (Container API), usar `// @vitest-environment node` en el archivo de test

### Configuración de `playwright.config.ts`

```typescript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:4321',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'pnpm preview',
    url: 'http://localhost:4321',
    timeout: 120_000,
    reuseExistingServer: !process.env.CI,
  },
});
```

**Notas sobre Playwright con Astro:**
- El server de preview de Astro corre en port **4321** por defecto
- `webServer.command` usa `pnpm preview` (sirve el build de `dist/`). Requiere ejecutar `pnpm build` antes de `pnpm test:e2e`
- `reuseExistingServer: !process.env.CI` — en local reutiliza un server corriendo, en CI siempre arranca uno nuevo
- Los tests E2E van en `tests/e2e/` (ya existe el directorio con `.gitkeep` de Story 1.1)

### Scripts de `package.json` (Agregar)

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "playwright test",
    "emulators": "firebase emulators:start --only auth,firestore,storage"
  }
}
```

**NO modificar** los scripts existentes (`dev`, `build`, `preview`, `type-check`, `lint`, `format`).

### Modelo de Datos para Factories (TypeScript Interfaces)

Basado en el modelo de Firestore documentado en la arquitectura. Las factories usan estas interfaces hasta que Story 1.4 cree los Zod schemas formales.

```typescript
// src/test/factories/types.ts

interface LocalizedField {
  es: string;
  en: string;
}

interface StoredImage {
  url: string;
  path: string;
  alt: LocalizedField;
}

interface ImageSlot {
  current: StoredImage | null;
  slot: string;
}

interface Project {
  id: string;
  title: LocalizedField;
  description: LocalizedField;
  shortDescription: LocalizedField;
  technologies: string[];
  imageSlots: ImageSlot[];
  links: { github?: string; live?: string };
  featured: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

interface Technology {
  id: string;
  name: string;
  icon: string;
  category: string;
  order: number;
}

interface Experience {
  id: string;
  company: LocalizedField;
  position: LocalizedField;
  description: LocalizedField;
  startDate: Date;
  endDate: Date | null;
  current: boolean;
  technologies: string[];
  order: number;
}

interface BlogPost {
  id: string;
  title: LocalizedField;
  slug: string;
  content: LocalizedField;
  excerpt: LocalizedField;
  coverImage: StoredImage | null;
  tags: string[];
  published: boolean;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
```

Cada factory debe:
- Retornar un objeto completo con todos los campos requeridos y valores realistas por defecto
- Aceptar un parámetro `overrides` parcial para personalizar campos específicos: `createProject({ featured: true })`
- Generar IDs únicos con `crypto.randomUUID()`
- Usar fechas realistas (no fechas fijas — usar `new Date()` con variaciones)

### Entradas de `.gitignore` (Agregar)

```gitignore
# Firebase Emulators
emulator-data/

# Testing
test-results/
playwright-report/
coverage/
```

### Qué NO Hacer en Esta Story

- **NO configurar Firebase client/admin SDK init** — eso es Story 1.10
- **NO crear Zod schemas** — eso es Story 1.4. Las factories usan TypeScript interfaces por ahora
- **NO instalar `@testing-library/svelte` ni `jsdom`** — se instalarán cuando haya component tests (Story 1.6+)
- **NO crear tests E2E reales** — solo verificar que Playwright inicializa. Los tests E2E se escriben en cada feature story
- **NO configurar CI/CD pipeline** — eso es Story 1.3
- **NO escribir security rules de producción** — las rules permisivas son solo para emuladores. Las de producción van en stories de Epic 3
- **NO instalar `@faker-js/faker`** — las factories usan valores hardcodeados realistas, no datos aleatorios. Esto mantiene tests determinísticos

### Project Structure Notes

Archivos nuevos y su ubicación:

```
portfolio/
├── firestore.rules           # NUEVO — rules permisivas para emuladores
├── storage.rules              # NUEVO — rules permisivas para emuladores
├── vitest.config.ts           # NUEVO — config Vitest con getViteConfig()
├── playwright.config.ts       # NUEVO — config Playwright con webServer
├── README.md                  # NUEVO — documentación del proyecto
├── firebase.json              # MODIFICADO — agregar emulators + rules refs
├── package.json               # MODIFICADO — agregar scripts de test
├── .gitignore                 # MODIFICADO — agregar emulator-data, test artifacts
└── src/
    └── test/
        └── factories/
            ├── index.ts       # NUEVO — re-exports
            ├── types.ts       # NUEVO — interfaces TypeScript
            ├── project.ts     # NUEVO — createProject()
            ├── technology.ts  # NUEVO — createTechnology()
            ├── experience.ts  # NUEVO — createExperience()
            ├── blog-post.ts   # NUEVO — createBlogPost()
            └── __tests__/
                └── factories.test.ts  # NUEVO — tests de factories
```

- `src/test/` es un **nuevo directorio** para utilidades de test compartidas (factories, helpers). No aparece en la estructura de la arquitectura — es complementario al patrón `__tests__/` co-ubicado. La arquitectura define `__tests__/` dentro de cada módulo para tests unitarios específicos; `src/test/` es para utilidades compartidas entre múltiples tests
- Tests unitarios co-ubicados en `__tests__/` dentro de cada módulo (patrón de la arquitectura)
- Tests E2E en `tests/e2e/` en raíz (ya existe de Story 1.1)

### References

- [Source: _bmad-output/planning-artifacts/epics.md — Epic 1, Story 1.2 Acceptance Criteria]
- [Source: _bmad-output/planning-artifacts/architecture.md — Testing Framework, Test File Organization, Project Structure, CI/CD Pipeline]
- [Source: _bmad-output/planning-artifacts/prd.md — NFR20 (cobertura >80%), NFR21 (E2E flujos críticos)]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md — Automated Testing (Lighthouse CI, axe-core, ESLint accessibility)]
- [Source: _bmad-output/implementation-artifacts/1-1-inicializacion-del-proyecto-y-tooling.md — Dependencias instaladas, estructura creada, spec amendments]

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (1M context)

### Debug Log References

- firebase-tools 15.10.1 requiere Java 21+ (la story especificaba 11+). Se instaló Zulu JDK 21 via Homebrew.
- Vitest 4 sale con exit code 1 cuando no hay tests. Se agregó `passWithNoTests: true` a vitest.config.ts.
- Playwright sale con exit code 1 cuando no hay tests. Se agregó `--pass-with-no-tests` al script test:e2e.
- `playwright.config.ts`: tsconfig strictest de Astro tiene `exactOptionalPropertyTypes: true`, lo que causa error de tipos con `workers: process.env.CI ? 1 : undefined`. Se resolvió con spread condicional.

### Completion Notes List

- Task 1: Firebase Emulator Suite configurado — firebase-tools 15.10.1 instalado, firestore.rules y storage.rules creados con reglas permisivas, firebase.json actualizado con emuladores (Auth:9099, Firestore:8080, Storage:9199, UI:4000), emuladores verificados con `All emulators ready!`
- Task 2: Vitest configurado con getViteConfig() de Astro, coverage v8, passWithNoTests. 5 scripts de test agregados a package.json. `pnpm test` ejecuta con exit code 0.
- Task 3: Playwright configurado con webServer apuntando a pnpm preview:4321. Browsers instalados (Chromium, Firefox, WebKit). `pnpm build && pnpm test:e2e` ejecuta con exit code 0.
- Task 4: 4 factories creadas (createProject, createTechnology, createExperience, createBlogPost) con TypeScript interfaces, crypto.randomUUID(), overrides parciales. 9 tests pasan.
- Task 5: README.md actualizado con prerequisitos (Node 22+, pnpm 10+, Java 21+), tabla de scripts, documentación de emuladores y tests.
- Validaciones: `pnpm test` (9 passed), `pnpm lint` (0 errors), `pnpm type-check` (0 errors)

### Change Log

- 2026-03-17: Implementación completa de Story 1.2 — infraestructura de testing local
- 2026-03-17: Code review pasado (0 patch, 3 defer para stories futuras: security rules → Epic 3, .firebaserc → Story 1.10, firebase-admin placement → Story 1.10)

### File List

- firestore.rules (NUEVO)
- storage.rules (NUEVO)
- vitest.config.ts (NUEVO)
- playwright.config.ts (NUEVO)
- src/test/factories/types.ts (NUEVO)
- src/test/factories/project.ts (NUEVO)
- src/test/factories/technology.ts (NUEVO)
- src/test/factories/experience.ts (NUEVO)
- src/test/factories/blog-post.ts (NUEVO)
- src/test/factories/index.ts (NUEVO)
- src/test/factories/__tests__/factories.test.ts (NUEVO)
- firebase.json (MODIFICADO — agregado emulators + rules refs)
- package.json (MODIFICADO — agregados scripts test, test:watch, test:coverage, test:e2e, emulators + devDeps firebase-tools, @vitest/coverage-v8)
- .gitignore (MODIFICADO — agregado emulator-data/, test-results/, playwright-report/, coverage/, *-debug.log)
- README.md (MODIFICADO — reescrito para nuevo stack Astro)
