# Story 1.3: CI/CD Pipeline y Quality Gates

Status: ready-for-dev

## Story

As a developer,
I want a CI pipeline with automated quality gates,
So that every push to main is validated for lint, types, tests and performance.

## Acceptance Criteria

1. **Given** GitHub Actions workflow exists **When** code is pushed to main **Then** pipeline runs: pnpm install → pnpm lint → pnpm type-check → pnpm test → pnpm build
2. **And** Lighthouse CI is configured in the pipeline as quality gate (>95 in 4 categories)
3. **And** Firebase emulators are cached in CI for faster execution
4. **And** pipeline failure blocks deployment

## Tasks / Subtasks

- [ ] Task 1: Crear GitHub Actions workflow (AC: #1, #3, #4)
  - [ ] 1.1 Crear directorio `.github/workflows/` si no existe
  - [ ] 1.2 Crear `.github/workflows/ci.yml` con pipeline completo (ver Dev Notes para YAML exacto)
  - [ ] 1.3 Triggers: `push` a `main` + `workflow_dispatch` (rebuild manual post-content update)
  - [ ] 1.4 Steps: checkout → pnpm setup → node setup (con cache) → install → lint → type-check → Java 21 → Firebase emulators cache → test con emuladores → build → Lighthouse CI → deploy Firebase Hosting
  - [ ] 1.5 Verificar sintaxis YAML del workflow (push y revisar Actions tab, o usar linter local)

- [ ] Task 2: Configurar Lighthouse CI (AC: #2)
  - [ ] 2.1 Instalar `@lhci/cli` como devDependency: `pnpm add -D @lhci/cli@0.15.1`
  - [ ] 2.2 Crear `lighthouserc.cjs` en raíz del proyecto (ver Dev Notes para config exacta). Extensión `.cjs` requerida porque `package.json` tiene `"type": "module"` (ESM) y LHCI usa `require()` internamente
  - [ ] 2.3 Agregar `.lighthouseci/` a `.gitignore`
  - [ ] 2.4 Verificar localmente: `pnpm build && pnpm exec lhci autorun` — las 4 categorías deben pasar >0.95. Si falla con error de ESM/CommonJS, confirmar que el archivo se llama `lighthouserc.cjs` (no `.js`)
  - [ ] 2.5 Si alguna categoría falla <0.95, corregir el HTML del skeleton (meta description, lang attribute, heading hierarchy, viewport — lo que falte)

- [ ] Task 3: Documentar CI/CD en README (AC: implícito)
  - [ ] 3.1 Agregar sección "CI/CD" al README existente con descripción del pipeline
  - [ ] 3.2 Documentar GitHub Secrets requeridos (`FIREBASE_SERVICE_ACCOUNT`)
  - [ ] 3.3 Documentar cómo disparar rebuild manual (`gh workflow run ci.yml` o GitHub UI → Actions → Run workflow)

## Dev Notes

### Contexto Crítico

Esta story crea el **pipeline de CI/CD** que valida la calidad del código en cada push a main y despliega automáticamente a Firebase Hosting. Depende de Story 1.1 (tooling) y Story 1.2 (testing infrastructure). Después de esta story, cada cambio de código pasa por quality gates automáticos antes de desplegarse.

**Dos propósitos del workflow:**
1. **CI en push a main:** Valida lint → types → tests → build → Lighthouse → deploy
2. **Rebuild manual (workflow_dispatch):** Christopher dispara rebuild cuando actualiza contenido en admin. Mismo pipeline para validar que el contenido nuevo no rompe nada

**Decisión arquitectónica:** La arquitectura sugiere dos archivos (`ci.yml` + `rebuild.yml`). Se usa **un solo archivo** con dos triggers (`push` + `workflow_dispatch`) para evitar duplicación. Misma funcionalidad, cero mantenimiento duplicado.

### Inteligencia de Story 1-2

Estado actual del proyecto tras Story 1-2:
- **firebase-tools 15.10.1** requiere **Java 21+** (no 11+) — el workflow DEBE usar Java 21
- **Vitest 4.1.0** con `passWithNoTests: true` — `pnpm test` pasa con exit code 0 (9 tests de factories)
- **Playwright 1.58.2** con `--pass-with-no-tests` — funcional pero sin tests E2E reales aún
- **TypeScript strictest** con `exactOptionalPropertyTypes: true`
- **Scripts disponibles:** `dev`, `build`, `preview`, `type-check`, `lint`, `format`, `test`, `test:watch`, `test:coverage`, `test:e2e`, `emulators`
- **`.gitignore`** ya incluye `emulator-data/`, `test-results/`, `playwright-report/`, `coverage/`
- **Node 22.12.0** (en `.nvmrc`)
- **`.firebaserc`** tiene `portfolio-chrisbp` como default project
- **`firebase.json`** tiene emuladores con `host: "127.0.0.1"` (requerido por Node 22 — IPv6 fix)

### Configuración de `.github/workflows/ci.yml`

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  pipeline:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v6

      - uses: pnpm/action-setup@v4
        with:
          version: 10

      - uses: actions/setup-node@v6
        with:
          node-version-file: '.nvmrc'
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      # Quality gates
      - name: Lint
        run: pnpm lint

      - name: Type check
        run: pnpm type-check

      # Tests with Firebase emulators
      - uses: actions/setup-java@v5
        with:
          distribution: 'temurin'
          java-version: '21'

      - name: Cache Firebase emulators
        uses: actions/cache@v5
        with:
          path: ~/.cache/firebase/emulators
          key: firebase-emulators-${{ runner.os }}

      - name: Run tests with emulators
        run: pnpm exec firebase emulators:exec --only auth,firestore,storage "pnpm test"

      # Build
      - name: Build
        run: pnpm build
        # env:
        #   # TODO Story 1.10: descomentar cuando Admin SDK esté configurado
        #   FIREBASE_ADMIN_PROJECT_ID: ${{ secrets.FIREBASE_ADMIN_PROJECT_ID }}
        #   FIREBASE_ADMIN_CLIENT_EMAIL: ${{ secrets.FIREBASE_ADMIN_CLIENT_EMAIL }}
        #   FIREBASE_ADMIN_PRIVATE_KEY: ${{ secrets.FIREBASE_ADMIN_PRIVATE_KEY }}

      # Lighthouse CI
      - name: Lighthouse CI
        run: pnpm exec lhci autorun

      # Deploy to Firebase Hosting
      - name: Deploy to Firebase Hosting
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: ${{ secrets.GITHUB_TOKEN }}
          firebaseServiceAccount: ${{ secrets.FIREBASE_SERVICE_ACCOUNT }}
          channelId: live
          projectId: portfolio-chrisbp
```

**Notas sobre el workflow:**
- **pnpm/action-setup ANTES de setup-node:** Requerido — `setup-node` necesita el binario `pnpm` para localizar el store y configurar cache
- **`node-version-file: '.nvmrc'`** en lugar de `node-version: 22` — usa la misma versión que desarrollo local (22.12.0)
- **`--frozen-lockfile`** — Falla si `pnpm-lock.yaml` está desactualizado, previene cambios accidentales en CI
- **`actions/setup-java@v5` con Java 21:** firebase-tools 15.10.1 requiere Java 21+ (aprendido en Story 1-2). v5 usa Node.js 24 runtime (v4 deprecado)
- **Firebase emulators cache (`actions/cache@v5`):** Los JARs se descargan a `~/.cache/firebase/emulators/` en el primer run. El cache action evita re-descargar en runs posteriores. v5 incluye parche de seguridad (Dependabot advisory #33)
- **`firebase emulators:exec`** arranca emuladores → ejecuta `pnpm test` → apaga emuladores automáticamente. Más limpio que start/stop manual
- **Env vars de Admin SDK comentadas:** Se descomentarán en Story 1.10 cuando el build necesite queries a Firestore
- **`channelId: live`** — Despliega a producción. Sin este param, crearía un preview channel
- **`FIREBASE_SERVICE_ACCOUNT`** — Secret con el JSON del service account (ver sección "GitHub Secrets")

### Configuración de `lighthouserc.cjs`

**Importante:** Extensión `.cjs` (no `.js`) porque `package.json` tiene `"type": "module"`. LHCI carga la config con `require()` (CommonJS). Un archivo `.js` con `module.exports` fallaría con `ReferenceError: module is not defined in ES module scope`.

```javascript
module.exports = {
  ci: {
    collect: {
      staticDistDir: './dist',
      numberOfRuns: 1,
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.95 }],
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'categories:best-practices': ['error', { minScore: 0.95 }],
        'categories:seo': ['error', { minScore: 0.95 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
```

**Notas sobre Lighthouse CI:**
- **`staticDistDir: './dist'`** — LHCI sirve los archivos estáticos de Astro localmente y audita. No necesita un server corriendo
- **`numberOfRuns: 1`** — Contenido es estático (SSG). Múltiples runs son redundantes
- **`minScore: 0.95`** — Lighthouse usa escala 0-1. 0.95 = >95 del AC
- **`'error'`** (no `'warn'`) — Falla el pipeline si no se cumple, implementando AC #4
- **`upload.target: 'temporary-public-storage'`** — Sube resultados a URL temporal para revisar. Gratis, sin config
- **Verificar localmente primero:** `pnpm build && pnpm exec lhci autorun` — corregir HTML si falla antes de pushear

### GitHub Secrets Requeridos

| Secret | Descripción | Cómo obtener |
|--------|-------------|--------------|
| `FIREBASE_SERVICE_ACCOUNT` | Service account JSON para Firebase Hosting deploy | Firebase Console → Project Settings → Service accounts → Generate new private key |

**Setup paso a paso:**
1. Firebase Console → proyecto `portfolio-chrisbp` → ⚙️ Project Settings → Service accounts
2. Click "Generate new private key" → descargar JSON
3. GitHub repo → Settings → Secrets and variables → Actions → New repository secret
4. Name: `FIREBASE_SERVICE_ACCOUNT`, Value: contenido completo del JSON descargado
5. Eliminar el archivo JSON descargado del disco local

**Alternativa rápida:** `firebase init hosting:github` en local — crea el service account y configura el GitHub Secret automáticamente via GitHub CLI.

### Verificación del Pipeline

Después de hacer push del workflow:
1. GitHub repo → Actions tab → verificar que aparece "CI/CD Pipeline"
2. El push que incluye el workflow dispara la primera ejecución
3. Verificar cada step: lint ✓ → type-check ✓ → test ✓ → build ✓ → Lighthouse ✓ → deploy ✓
4. Si deploy falla por falta de `FIREBASE_SERVICE_ACCOUNT` → es esperado, configurar el secret y re-ejecutar
5. Para rebuild manual: Actions tab → "CI/CD Pipeline" → "Run workflow" → "Run workflow"

### Lighthouse Score del Skeleton

El sitio skeleton de Astro debería lograr >95 en las 4 categorías sin problemas:
- **Performance:** ~100 (HTML estático, zero JS, sin imágenes pesadas)
- **Accessibility:** Verificar que `<html lang="en">`, headings, viewport estén correctos
- **Best Practices:** ~100 (sin bad practices en HTML estático)
- **SEO:** Puede requerir agregar `<meta name="description">` si no existe

Si alguna categoría falla, corregir el HTML en `src/pages/index.astro` (o layout) antes de commitear. Correcciones típicas: agregar meta description, verificar lang attribute, asegurar heading hierarchy.

### Qué NO Hacer en Esta Story

- **NO agregar `pnpm test:e2e` al pipeline** — No hay tests E2E reales aún. Se agregará cuando feature stories creen E2E tests (Epic 2+)
- **NO configurar env vars de Firebase Admin SDK** — Story 1.10. Los env vars están comentados como placeholder
- **NO configurar branch protection rules en GitHub** — Es configuración manual del repo, no código
- **NO agregar pre-commit hooks (husky/lint-staged)** — No está en el AC
- **NO crear `rebuild.yml` separado** — Un solo archivo con dual trigger es suficiente y evita duplicación
- **NO agregar `format:check` al pipeline** — `pnpm lint` (ESLint) cubre quality. Prettier format check no está en el AC

### Project Structure Notes

Archivos nuevos y su ubicación:

```
portfolio/
├── .github/
│   └── workflows/
│       └── ci.yml              # NUEVO — CI/CD pipeline (push + workflow_dispatch)
├── lighthouserc.cjs             # NUEVO — configuración Lighthouse CI assertions (.cjs por ESM)
├── .gitignore                   # MODIFICADO — agregar .lighthouseci/
├── package.json                 # MODIFICADO — agregar @lhci/cli en devDependencies
└── README.md                    # MODIFICADO — agregar sección CI/CD
```

- `.github/workflows/` es un **nuevo directorio** — GitHub Actions detecta workflows automáticamente
- `lighthouserc.cjs` en raíz del proyecto — LHCI busca config en raíz por defecto. Extensión `.cjs` porque el proyecto es ESM (`"type": "module"`)
- La arquitectura define `.github/workflows/ci.yml` y `.github/workflows/rebuild.yml` como archivos separados. Se consolida en uno solo con triggers duales para evitar duplicación

### References

- [Source: _bmad-output/planning-artifacts/epics.md — Epic 1, Story 1.3 Acceptance Criteria]
- [Source: _bmad-output/planning-artifacts/architecture.md — CI/CD Pipeline, Quality Gates, GitHub Actions Workflows, Firebase Hosting Deploy]
- [Source: _bmad-output/planning-artifacts/prd.md — NFR20 (cobertura >80%), NFR22 (TypeScript strict), NFR23 (ESLint zero warnings CI), NFR24 (CI build+test+lint), NFR25 (Lighthouse CI >95)]
- [Source: _bmad-output/planning-artifacts/prd.md — KPIs: Lighthouse Performance/SEO/Accessibility/Best Practices >95]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md — Automated Testing (Lighthouse CI, axe-core)]
- [Source: _bmad-output/implementation-artifacts/1-2-infraestructura-de-testing-local.md — firebase-tools requires Java 21+, Vitest passWithNoTests, scripts existentes]
- [Source: Web research — actions/checkout@v6, actions/setup-node@v6, pnpm/action-setup@v4, actions/setup-java@v5, actions/cache@v5, FirebaseExtended/action-hosting-deploy@v0, @lhci/cli@0.15.1]

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
