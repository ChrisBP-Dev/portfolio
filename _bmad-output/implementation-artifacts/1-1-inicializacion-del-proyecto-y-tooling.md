# Story 1.1: Inicialización del Proyecto y Tooling

Status: done

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

- [x] Task 0: Archivar código Flutter y preparar repo (prerequisito)
  - [x] 0.1 Crear directorio `_flutter-archive/` en la raíz
  - [x] 0.2 Mover directorios Flutter: `lib/`, `test/`, `web/`, `android/`, `ios/`, `macos/`, `linux/`, `windows/`, `.dart_tool/`, `.idea/`, `build/`, `.firebase/`
  - [x] 0.3 Mover archivos Flutter: `pubspec.yaml`, `pubspec.lock`, `analysis_options.yaml`, `l10n.yaml`, `flutter_native_splash.yaml`, `portfolio.iml`, `flutter_*.log`, `.metadata`, `.flutter-plugins`, `.flutter-plugins-dependencies`
  - [x] 0.4 PRESERVAR en raíz: `.firebaserc`, `firebase.json`, `assets/logo/`, `docs/`, `design-artifacts/`, `_bmad-output/`, `_bmad/`, `.claude/`, `.gitignore`, `README.md`
  - [x] 0.5 Actualizar `firebase.json`: cambiar `hosting.public` de `"build/web/"` a `"dist/"` y eliminar la sección `flutter.platforms` (ya no aplica)
  - [x] 0.6 Verificar que `.firebaserc` sigue apuntando a `portfolio-chrisbp`
- [x] Task 1: Scaffold Astro project (AC: #1, #8)
  - [x] 1.1 Run `pnpm create astro@latest` with `--template minimal`
  - [x] 1.2 Configure `astro.config.mjs` (ver sección Dev Notes para config exacta)
  - [x] 1.3 Add Svelte 5 integration: `pnpm astro add svelte`
  - [x] 1.4 Add Tailwind CSS 4 integration: `pnpm add -D tailwindcss @tailwindcss/vite` and configure in astro config
  - [x] 1.5 Create `.nvmrc` with `22` to enforce Node.js version
  - [x] 1.6 Verify `pnpm dev` starts without errors
- [x] Task 2: Configure TypeScript strict mode (AC: #2)
  - [x] 2.1 Set `tsconfig.json` to extend Astro's `strictest` template
  - [x] 2.2 Install `@astrojs/check` and `typescript`: `pnpm add -D @astrojs/check typescript`
  - [x] 2.3 Add `type-check` script to `package.json`: `"type-check": "astro check"`
  - [x] 2.4 Verify `pnpm type-check` reports zero errors
- [x] Task 3: Configure ESLint + Prettier (AC: #3)
  - [x] 3.1 Install ESLint with Astro and Svelte plugins
  - [x] 3.2 Install Prettier with Astro and Svelte plugins
  - [x] 3.3 Create `eslint.config.js` (flat config — estándar 2026) with Astro + Svelte + TypeScript rules
  - [x] 3.4 Create `.prettierrc` (ver sección Dev Notes para valores)
  - [x] 3.5 Add scripts: `"lint": "eslint ."` y `"format": "prettier --write ."`
  - [x] 3.6 Verify `pnpm lint` reports zero warnings
- [x] Task 4: Install dependencies (AC: #4)
  - [x] 4.1 Run `pnpm add firebase firebase-admin sanitize-html`
  - [x] 4.2 Run `pnpm add -D vitest playwright @playwright/test` (solo instalar — config es Story 1.2)
  - [x] 4.3 Verify all appear in `package.json`
- [x] Task 5: Create environment variable documentation (AC: #5)
  - [x] 5.1 Create `.env.example` with all required variables documented (ver sección Dev Notes)
  - [x] 5.2 Include `PUBLIC_FIREBASE_API_KEY`, `PUBLIC_FIREBASE_AUTH_DOMAIN`, `PUBLIC_FIREBASE_PROJECT_ID`, `PUBLIC_FIREBASE_STORAGE_BUCKET`, `PUBLIC_FIREBASE_MESSAGING_SENDER_ID`, `PUBLIC_FIREBASE_APP_ID`, `PUBLIC_ADMIN_UID`
  - [x] 5.3 Include `FIREBASE_ADMIN_*` variables (service account config for build time)
- [x] Task 6: Configure `.gitignore` (AC: #6)
  - [x] 6.1 Reescribir `.gitignore` para Astro: `.env`, `node_modules/`, `dist/`, `*.pem`, service account JSON files, `.DS_Store`
  - [x] 6.2 Keep committed: `.env.example`, config files, lock file, `_flutter-archive/`
- [x] Task 7: Create project directory structure (AC: #7)
  - [x] 7.1 Create `src/pages/` (Astro generates this)
  - [x] 7.2 Create `src/components/common/`, `src/components/layout/`, `src/components/home/`, `src/components/projects/`, `src/components/blog/`, `src/components/contact/`, `src/components/admin/`
  - [x] 7.3 Create `src/layouts/`
  - [x] 7.4 Create `src/lib/firebase/`, `src/lib/schemas/`, `src/lib/types/`, `src/lib/i18n/`, `src/lib/utils/`, `src/lib/scripts/`
  - [x] 7.5 Create `src/styles/` with `global.css`
  - [x] 7.6 Create `src/assets/logo/` and copy existing logos from `_flutter-archive/assets/logo/` (`cbp-short-logo-dark.png`, `cbp-large-logo-dark.png`)
  - [x] 7.7 Create `public/` with placeholder `favicon.svg` and `robots.txt` (Allow all, Disallow /admin)
  - [x] 7.8 Create `tests/e2e/`
  - [x] 7.9 Add `.gitkeep` files to empty directories so structure is committed

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

Claude Opus 4.6 (1M context)

### Debug Log References

- type-check fallaba con OOM al analizar `_flutter-archive/build/web/flutter.js` — resuelto excluyendo `_flutter-archive`, `_bmad`, `_bmad-output`, `node_modules` en tsconfig.json
- `pnpm create astro@latest ./` no funciona con directorio no vacío — resuelto scaffoldeando en `/tmp` y copiando archivos
- `@eslint/js` no venía como dependencia de `eslint` v10 — instalado explícitamente
- `tseslint.config()` firma deprecada en typescript-eslint v8 — migrado a array export directo

### Completion Notes List

- **Task 0:** Código Flutter archivado en `_flutter-archive/`. firebase.json actualizado con `public: "dist/"` y sección `flutter.platforms` eliminada. `.firebaserc` verificado apuntando a `portfolio-chrisbp`.
- **Task 1:** Proyecto Astro 6.0.5 scaffoldeado con template minimal. Config: `output: 'static'`, Svelte 5 (v5.53.12), Tailwind CSS 4 (v4.2.1 via @tailwindcss/vite). `.nvmrc` con Node 22. `pnpm dev` arranca correctamente.
- **Task 2:** TypeScript en modo `strictest` de Astro. `@astrojs/check` instalado. `pnpm type-check` reporta 0 errores.
- **Task 3:** ESLint 10 con flat config (`eslint.config.js`), plugins para Astro, Svelte y TypeScript. Prettier con plugins Astro y Svelte. `pnpm lint` reporta 0 warnings.
- **Task 4:** Dependencias instaladas — firebase 12.10.0, firebase-admin 13.7.0, sanitize-html 2.17.1, vitest 4.1.0, playwright 1.58.2.
- **Task 5:** `.env.example` creado con todas las variables PUBLIC_FIREBASE_* y FIREBASE_ADMIN_*.
- **Task 6:** `.gitignore` reescrito para Astro: excluye `.env`, `node_modules/`, `dist/`, `*.pem`, service accounts, `.DS_Store`.
- **Task 7:** Estructura de directorios creada siguiendo arquitectura: components por dominio, lib con subdirectorios, styles, assets, layouts, tests/e2e. `.gitkeep` en directorios vacíos. Logos copiados a `src/assets/logo/`.

### Change Log

- 2026-03-17: Implementación completa de Story 1.1 — archivado Flutter, scaffold Astro 6, tooling configurado
- 2026-03-17: Code review (3 capas: Blind Hunter, Edge Case Hunter, Acceptance Auditor). 8 ACs pasan. Correcciones aplicadas:
  - F1: Eliminado SPA rewrite de `firebase.json` (incompatible con `output: 'static'`), reemplazado con cache headers para assets estáticos
  - F2: Movido `firebase-admin` de dependencies a devDependencies (solo se usa en build time)
  - F3: Eliminado `pnpm-workspace.yaml` corrupto (contenía keys de un solo carácter por bug de serialización)
  - F4: Agregado `import '../styles/global.css'` en `index.astro` (Tailwind no tenía efecto sin este import)
  - F5: Creado `.prettierignore` para excluir `_flutter-archive/`, `_bmad/`, `_bmad-output/`, `.claude/`, `docs/`
  - F6: Movido `typescript` de dependencies a devDependencies (spec decía `pnpm add -D`)
  - F7: Cambiado `.nvmrc` de `22` a `22.12.0` para coincidir con `engines` de package.json
  - F8: Ejecutado `pnpm format` para normalizar formato en `svelte.config.js`, `eslint.config.js`, `global.css`

### Deferred Items (revisar en stories futuras)

- **PUBLIC_ADMIN_UID expuesto client-side** — El prefijo `PUBLIC_` en Astro lo incluye en bundles del browser. Firebase UIDs no son secretos per se (la seguridad real está en Firestore Rules), pero es un punto de defensa en profundidad. → **Revisar en Story 1.10** al configurar Firebase client/admin SDK.
- **Sin validación de variables de entorno** — 15 env vars documentadas en `.env.example` pero nada las valida en build/runtime. Un `PUBLIC_FIREBASE_API_KEY` faltante produce `undefined` silenciosamente. → **Revisar en Story 1.4** (Zod schemas) o **Story 1.10** (Firebase config).
- **Sin meta robots/canonical en index page** — No hay `<meta name="robots">` ni `<link rel="canonical">`. Potencial issue de SEO con contenido duplicado entre dominio Firebase y custom domain. → **Revisar en Story 5.1** (Meta tags y OpenGraph).
- **Directorio `assets/logo/` legacy en raíz** — Existe desde el Flutter original. Los logos ya fueron copiados a `src/assets/logo/`. No causa problemas pero es ruido. → **Limpiar en retrospectiva de Epic 1** o durante cualquier story.

### Spec Amendments (correcciones a la spec original)

- **`firebase.json`** — La spec proporcionaba SPA rewrite (`"source": "**", "destination": "/index.html"`) que es incompatible con `output: 'static'`. Se reemplazó con cache headers. Stories futuras que referencien firebase.json deben usar la versión corregida.
- **`firebase-admin` como dependency** — La spec decía `pnpm add firebase firebase-admin sanitize-html` sin `-D`. Para un sitio estático, firebase-admin solo se usa en build time y debe ser devDependency. Corregido en implementación.

### File List

**Nuevos:**
- `package.json` — configuración npm con scripts y dependencias
- `pnpm-lock.yaml` — lockfile
- `astro.config.mjs` — config Astro: static output, Svelte 5, Tailwind CSS 4
- `tsconfig.json` — TypeScript strictest mode
- `svelte.config.js` — config Svelte (generado por astro add svelte)
- `eslint.config.js` — ESLint flat config con plugins Astro/Svelte/TS
- `.prettierrc` — configuración Prettier
- `.prettierignore` — exclusiones para formatter (archive, bmad, claude, docs)
- `.nvmrc` — Node.js 22.12.0
- `.env.example` — documentación de variables de entorno
- `src/pages/index.astro` — página principal placeholder (importa global.css)
- `src/styles/global.css` — Tailwind CSS 4 import
- `src/assets/logo/cbp-short-logo-dark.png` — logo corto (copiado)
- `src/assets/logo/cbp-large-logo-dark.png` — logo largo (copiado)
- `public/favicon.svg` — placeholder favicon
- `public/favicon.ico` — placeholder favicon
- `public/robots.txt` — Allow all, Disallow /admin
- `tests/e2e/.gitkeep`
- `src/components/{common,layout,home,projects,blog,contact,admin}/.gitkeep`
- `src/layouts/.gitkeep`
- `src/lib/{firebase,schemas,types,i18n,utils,scripts}/.gitkeep`
- `_flutter-archive/` — código Flutter archivado (12 directorios, 11 archivos)

**Modificados:**
- `firebase.json` — hosting.public cambiado a "dist/", sección flutter.platforms eliminada, SPA rewrite removido, cache headers agregados
- `.gitignore` — reescrito para proyecto Astro

**Eliminados (post code review):**
- `pnpm-workspace.yaml` — contenido corrupto, innecesario para single-package project
