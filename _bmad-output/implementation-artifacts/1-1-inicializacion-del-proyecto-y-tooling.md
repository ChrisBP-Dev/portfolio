# Story 1.1: Inicialización del Proyecto y Tooling

Status: ready-for-dev

## Story

As a developer,
I want to clone the repo and run `pnpm dev` with all tooling configured,
So that I have a working development environment ready for feature implementation.

## Acceptance Criteria

1. **Given** a fresh clone of the repository **When** I run `pnpm install && pnpm dev` **Then** the Astro dev server starts without errors
2. **And** TypeScript strict mode is configured — `pnpm type-check` reports zero errors
3. **And** ESLint + Prettier are configured — `pnpm lint` reports zero warnings
4. **And** `firebase` and `firebase-admin` dependencies exist in `package.json`
5. **And** `.env.example` documents all required variables (`PUBLIC_FIREBASE_*`, `FIREBASE_ADMIN_*`)
6. **And** `.gitignore` excludes `.env`, `node_modules`, `dist/`, Firebase credentials
7. **And** project structure follows architecture: `src/pages/`, `src/components/` (by domain), `src/layouts/`, `src/lib/`, `src/styles/`
8. **And** `astro.config.mjs` configures `output: 'static'`, Svelte 5 integration, Tailwind CSS 4 integration

## Tasks / Subtasks

- [ ] Task 0: Archivar código Flutter y preparar repo (prerequisito)
  - [ ] 0.1 Crear directorio `_flutter-archive/` en la raíz
  - [ ] 0.2 Mover directorios Flutter: `lib/`, `test/`, `web/`, `android/`, `ios/`, `macos/`, `linux/`, `windows/`, `.dart_tool/`, `.idea/`, `build/`, `.firebase/`
  - [ ] 0.3 Mover archivos Flutter: `pubspec.yaml`, `pubspec.lock`, `analysis_options.yaml`, `l10n.yaml`, `flutter_native_splash.yaml`, `portfolio.iml`, `flutter_*.log`, `.metadata`, `.flutter-plugins`, `.flutter-plugins-dependencies`
  - [ ] 0.4 PRESERVAR en raíz: `.firebaserc`, `firebase.json`, `assets/logo/`, `docs/`, `design-artifacts/`, `_bmad-output/`, `_bmad/`, `.claude/`, `.gitignore`, `README.md`
  - [ ] 0.5 Actualizar `firebase.json`: cambiar `hosting.public` de `"build/web/"` a `"dist/"` y eliminar la sección `flutter.platforms` (ya no aplica)
  - [ ] 0.6 Verificar que `.firebaserc` sigue apuntando a `portfolio-chrisbp`
- [ ] Task 1: Scaffold Astro project (AC: #1, #8)
  - [ ] 1.1 Run `pnpm create astro@latest` with `--template minimal`
  - [ ] 1.2 Configure `astro.config.mjs` (ver sección Dev Notes para config exacta)
  - [ ] 1.3 Add Svelte 5 integration: `pnpm astro add svelte`
  - [ ] 1.4 Add Tailwind CSS 4 integration: `pnpm add -D tailwindcss @tailwindcss/vite` and configure in astro config
  - [ ] 1.5 Create `.nvmrc` with `22` to enforce Node.js version
  - [ ] 1.6 Verify `pnpm dev` starts without errors
- [ ] Task 2: Configure TypeScript strict mode (AC: #2)
  - [ ] 2.1 Set `tsconfig.json` to extend Astro's `strictest` template
  - [ ] 2.2 Install `@astrojs/check` and `typescript`: `pnpm add -D @astrojs/check typescript`
  - [ ] 2.3 Add `type-check` script to `package.json`: `"type-check": "astro check"`
  - [ ] 2.4 Verify `pnpm type-check` reports zero errors
- [ ] Task 3: Configure ESLint + Prettier (AC: #3)
  - [ ] 3.1 Install ESLint with Astro and Svelte plugins
  - [ ] 3.2 Install Prettier with Astro and Svelte plugins
  - [ ] 3.3 Create `eslint.config.js` (flat config — estándar 2026) with Astro + Svelte + TypeScript rules
  - [ ] 3.4 Create `.prettierrc` (ver sección Dev Notes para valores)
  - [ ] 3.5 Add scripts: `"lint": "eslint ."` y `"format": "prettier --write ."`
  - [ ] 3.6 Verify `pnpm lint` reports zero warnings
- [ ] Task 4: Install dependencies (AC: #4)
  - [ ] 4.1 Run `pnpm add firebase firebase-admin sanitize-html`
  - [ ] 4.2 Run `pnpm add -D vitest playwright @playwright/test` (solo instalar — config es Story 1.2)
  - [ ] 4.3 Verify all appear in `package.json`
- [ ] Task 5: Create environment variable documentation (AC: #5)
  - [ ] 5.1 Create `.env.example` with all required variables documented (ver sección Dev Notes)
  - [ ] 5.2 Include `PUBLIC_FIREBASE_API_KEY`, `PUBLIC_FIREBASE_AUTH_DOMAIN`, `PUBLIC_FIREBASE_PROJECT_ID`, `PUBLIC_FIREBASE_STORAGE_BUCKET`, `PUBLIC_FIREBASE_MESSAGING_SENDER_ID`, `PUBLIC_FIREBASE_APP_ID`, `PUBLIC_ADMIN_UID`
  - [ ] 5.3 Include `FIREBASE_ADMIN_*` variables (service account config for build time)
- [ ] Task 6: Configure `.gitignore` (AC: #6)
  - [ ] 6.1 Reescribir `.gitignore` para Astro: `.env`, `node_modules/`, `dist/`, `*.pem`, service account JSON files, `.DS_Store`
  - [ ] 6.2 Keep committed: `.env.example`, config files, lock file, `_flutter-archive/`
- [ ] Task 7: Create project directory structure (AC: #7)
  - [ ] 7.1 Create `src/pages/` (Astro generates this)
  - [ ] 7.2 Create `src/components/common/`, `src/components/layout/`, `src/components/home/`, `src/components/projects/`, `src/components/blog/`, `src/components/contact/`, `src/components/admin/`
  - [ ] 7.3 Create `src/layouts/`
  - [ ] 7.4 Create `src/lib/firebase/`, `src/lib/schemas/`, `src/lib/types/`, `src/lib/i18n/`, `src/lib/utils/`, `src/lib/scripts/`
  - [ ] 7.5 Create `src/styles/` with `global.css`
  - [ ] 7.6 Create `src/assets/logo/` and copy existing logos from `_flutter-archive/assets/logo/` (`cbp-short-logo-dark.png`, `cbp-large-logo-dark.png`)
  - [ ] 7.7 Create `public/` with placeholder `favicon.svg` and `robots.txt` (Allow all, Disallow /admin)
  - [ ] 7.8 Create `tests/e2e/`
  - [ ] 7.9 Add `.gitkeep` files to empty directories so structure is committed

## Dev Notes

### Contexto Crítico

Este proyecto es una **migración de Flutter Web a Astro 6**. El repo actual contiene el código Flutter existente en producción. Esta story archiva el código Flutter y crea la nueva base del proyecto web moderno. El código Flutter existente sirve como referencia pero NO se reutiliza — es una reconstrucción completa.

**IMPORTANTE:** El `project-context.md` existente documenta el stack Flutter actual (Dart, Riverpod, GoRouter, etc.). Esos patrones NO aplican al nuevo proyecto. El nuevo stack es Astro 6 + Svelte 5 + Tailwind CSS 4 + TypeScript + Firebase.

### Manejo del Repo Existente (Flutter)

El repositorio contiene código Flutter en producción. Instrucciones exactas:

**Mover a `_flutter-archive/`:**
- Directorios: `lib/`, `test/`, `web/`, `android/`, `ios/`, `macos/`, `linux/`, `windows/`, `.dart_tool/`, `.idea/`, `build/`, `.firebase/`
- Archivos: `pubspec.yaml`, `pubspec.lock`, `analysis_options.yaml`, `l10n.yaml`, `flutter_native_splash.yaml`, `portfolio.iml`, `flutter_*.log`, `.metadata`, `.flutter-plugins`, `.flutter-plugins-dependencies`

**PRESERVAR en raíz (NO mover):**
- `.firebaserc` — proyecto Firebase `portfolio-chrisbp`
- `firebase.json` — actualizar `hosting.public` de `"build/web/"` a `"dist/"`; eliminar sección `flutter.platforms`
- `assets/logo/` — logos del portfolio (luego copiar a `src/assets/logo/`)
- `docs/`, `design-artifacts/` — documentación brownfield de referencia
- `_bmad-output/`, `_bmad/`, `.claude/` — tooling BMad
- `.gitignore`, `README.md`

**NOTA:** No existen archivos `firestore.rules` ni `storage.rules` en el repo. Si se necesitan en el futuro, se crearán en la story correspondiente.

### `firebase.json` Actualizado

```json
{
  "hosting": {
    "public": "dist/",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

### Versiones Exactas de Tecnologías (Verificadas Marzo 2026)

| Tecnología | Versión | Acción en esta Story |
|---|---|---|
| **Node.js** | 22+ | Requerido por Astro 6. Crear `.nvmrc` con `22` |
| **pnpm** | 10.x | Package manager del proyecto |
| **Astro** | 6.0.x | Scaffold con `pnpm create astro@latest --template minimal` |
| **Svelte** | 5.53.x | Instalar via `pnpm astro add svelte` |
| **Tailwind CSS** | 4.2.x | CSS-first config — NO crear `tailwind.config.js` |
| **TypeScript** | Latest | Modo `strictest` de Astro. Instalar `@astrojs/check` |
| **Firebase SDK** | 12.x | Solo instalar (`pnpm add firebase`) |
| **Firebase Admin** | 13.x | Solo instalar (`pnpm add firebase-admin`) |
| **sanitize-html** | Latest | Solo instalar (`pnpm add sanitize-html`) |
| **Vitest** | 4.x | Solo instalar como devDep (config en Story 1.2) |
| **Playwright** | 1.58.x | Solo instalar como devDep (config en Story 1.2) |

### Configuración de `astro.config.mjs`

```js
import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  output: 'static',
  integrations: [svelte()],
  vite: {
    plugins: [tailwindcss()],
  },
});
```

### Configuración de Tailwind CSS 4 (CSS-First)

Tailwind v4 NO usa `tailwind.config.js`. Toda la configuración va en CSS:

```css
/* src/styles/global.css */
@import "tailwindcss";

@theme {
  /* Se configurarán design tokens completos en Story 1.5 */
  /* Por ahora, solo verificar que Tailwind funciona */
}
```

### Configuración de ESLint (Flat Config)

Usar `eslint.config.js` (flat config — estándar desde ESLint 9+). NO usar `.eslintrc.cjs` (formato legacy deprecado).

Paquetes necesarios:
- `eslint`
- `eslint-plugin-astro`
- `eslint-plugin-svelte`
- `typescript-eslint`

El flag `--ext` NO se usa con flat config. El script correcto es `"lint": "eslint ."`.

### Configuración de `.prettierrc`

```json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "tabWidth": 2,
  "plugins": ["prettier-plugin-astro", "prettier-plugin-svelte"],
  "overrides": [
    { "files": "*.astro", "options": { "parser": "astro" } },
    { "files": "*.svelte", "options": { "parser": "svelte" } }
  ]
}
```

### Scripts de `package.json`

```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "type-check": "astro check",
    "lint": "eslint .",
    "format": "prettier --write ."
  }
}
```

### Estructura de `.env.example`

```env
# Firebase Client Config (público — usado en browser)
PUBLIC_FIREBASE_API_KEY=your-api-key
PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
PUBLIC_FIREBASE_PROJECT_ID=your-project-id
PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
PUBLIC_FIREBASE_APP_ID=your-app-id
PUBLIC_ADMIN_UID=your-admin-uid

# Firebase Admin SDK (solo build time — NUNCA en browser)
# En CI/CD: configurar como GitHub Secrets
# En local: necesario solo si ejecutas `pnpm build` localmente
FIREBASE_ADMIN_PROJECT_ID=your-project-id
FIREBASE_ADMIN_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour-key\n-----END PRIVATE KEY-----"
```

### Qué NO Hacer en Esta Story

- **NO configurar Firebase client/admin init** — eso es Story 1.10
- **NO crear design tokens** en `global.css` — eso es Story 1.5
- **NO configurar Vitest/Playwright configs** — eso es Story 1.2 (solo instalar las dependencias)
- **NO crear componentes UI** — eso es Story 1.6+
- **NO configurar i18n** — eso es Story 1.8
- **NO configurar CI/CD** — eso es Story 1.3
- **NO instalar ni configurar Zod** — eso es Story 1.4
- Solo instalar dependencias base, archivar Flutter, y verificar que el proyecto levanta

### Project Structure Notes

- La estructura sigue exactamente lo definido en el Architecture Decision Document
- `src/components/` organizado por dominio (common, layout, home, projects, blog, contact, admin)
- `src/lib/` contiene lógica de negocio separada de componentes, incluyendo `types/` para TypeScript types
- Tests unitarios co-ubicados en `__tests__/` dentro de cada módulo de `src/lib/`
- Tests E2E en `tests/e2e/` en la raíz del proyecto
- Archivos `.astro` para contenido estático, `.svelte` para islands interactivas

### References

- [Source: _bmad-output/planning-artifacts/architecture.md — Project Structure, Tech Stack, Development Environment]
- [Source: _bmad-output/planning-artifacts/epics.md — Epic 1, Story 1.1 Acceptance Criteria]
- [Source: _bmad-output/planning-artifacts/prd.md — Technical Architecture Considerations, NFR20-NFR25]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md — Design Tokens (referencia para Story 1.5)]
- [Source: _bmad-output/project-context.md — Proyecto Flutter existente (NO reutilizar patrones)]

## Dev Agent Record

### Agent Model Used

(pending)

### Debug Log References

### Completion Notes List

### File List
