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

- [ ] Task 1: Scaffold Astro project (AC: #1, #8)
  - [ ] 1.1 Run `pnpm create astro@latest` with minimal template
  - [ ] 1.2 Configure `astro.config.mjs`: `output: 'static'`
  - [ ] 1.3 Add Svelte 5 integration: `pnpm astro add svelte`
  - [ ] 1.4 Add Tailwind CSS 4 integration: `pnpm add -D tailwindcss @tailwindcss/vite` and configure in astro config
  - [ ] 1.5 Verify `pnpm dev` starts without errors
- [ ] Task 2: Configure TypeScript strict mode (AC: #2)
  - [ ] 2.1 Set `tsconfig.json` to extend Astro's `strictest` template
  - [ ] 2.2 Add `type-check` script to `package.json`: `"type-check": "astro check"`
  - [ ] 2.3 Verify `pnpm type-check` reports zero errors
- [ ] Task 3: Configure ESLint + Prettier (AC: #3)
  - [ ] 3.1 Install ESLint with Astro and Svelte plugins
  - [ ] 3.2 Install Prettier with Astro and Svelte plugins
  - [ ] 3.3 Create `.eslintrc.cjs` (or `eslint.config.js` flat config) with Astro + Svelte + TypeScript rules
  - [ ] 3.4 Create `.prettierrc` with project conventions
  - [ ] 3.5 Add `lint` and `format` scripts to `package.json`
  - [ ] 3.6 Verify `pnpm lint` reports zero warnings
- [ ] Task 4: Install Firebase SDKs (AC: #4)
  - [ ] 4.1 Run `pnpm add firebase firebase-admin`
  - [ ] 4.2 Verify both appear in `package.json` dependencies
- [ ] Task 5: Create environment variable documentation (AC: #5)
  - [ ] 5.1 Create `.env.example` with all required variables documented
  - [ ] 5.2 Include `PUBLIC_FIREBASE_API_KEY`, `PUBLIC_FIREBASE_AUTH_DOMAIN`, `PUBLIC_FIREBASE_PROJECT_ID`, `PUBLIC_FIREBASE_STORAGE_BUCKET`, `PUBLIC_FIREBASE_MESSAGING_SENDER_ID`, `PUBLIC_FIREBASE_APP_ID`, `PUBLIC_ADMIN_UID`
  - [ ] 5.3 Include `FIREBASE_ADMIN_*` variables (service account config for build time)
- [ ] Task 6: Configure `.gitignore` (AC: #6)
  - [ ] 6.1 Ensure exclusions: `.env`, `node_modules/`, `dist/`, `*.pem`, service account JSON files
  - [ ] 6.2 Keep committed: `.env.example`, config files, lock file
- [ ] Task 7: Create project directory structure (AC: #7)
  - [ ] 7.1 Create `src/pages/` (Astro generates this)
  - [ ] 7.2 Create `src/components/common/`, `src/components/layout/`, `src/components/home/`, `src/components/projects/`, `src/components/blog/`, `src/components/contact/`, `src/components/admin/`
  - [ ] 7.3 Create `src/layouts/`
  - [ ] 7.4 Create `src/lib/firebase/`, `src/lib/schemas/`, `src/lib/i18n/`, `src/lib/utils/`, `src/lib/scripts/`
  - [ ] 7.5 Create `src/styles/` with `global.css`
  - [ ] 7.6 Create `src/assets/logo/`
  - [ ] 7.7 Create `tests/e2e/`
  - [ ] 7.8 Add `.gitkeep` files to empty directories so structure is committed

## Dev Notes

### Contexto Crítico

Este proyecto es una **migración de Flutter Web a Astro 5/6**. El repo actual contiene el código Flutter existente en producción. Esta story crea la nueva base del proyecto web moderno. El código Flutter existente sirve como referencia pero NO se reutiliza — es una reconstrucción completa.

**IMPORTANTE:** El `project-context.md` existente documenta el stack Flutter actual (Dart, Riverpod, GoRouter, etc.). Esos patrones NO aplican al nuevo proyecto. El nuevo stack es Astro + Svelte 5 + Tailwind CSS 4 + TypeScript + Firebase.

### Versiones Exactas de Tecnologías (Verificadas Marzo 2026)

| Tecnología | Versión | Nota |
|---|---|---|
| **Astro** | 6.0.x | Estable desde 10 marzo 2026. Usar `pnpm create astro@latest` |
| **Svelte** | 5.53.x | Estable. Se instala via `@astrojs/svelte` |
| **Tailwind CSS** | 4.2.x | CSS-first config — NO crear `tailwind.config.js`. Usar `@theme` en CSS |
| **Zod** | 4.x | Estable. Import via `import { z } from "zod/v4"` durante transición |
| **TypeScript** | Latest | Modo `strictest` de Astro |
| **Firebase SDK** | 12.x | Client SDK para browser |
| **Firebase Admin** | 13.x | Requiere Node.js 20+ (18 deprecated) |
| **Vitest** | 4.x | Para unit tests (se configura en Story 1.2, solo instalar aquí) |
| **Playwright** | 1.58.x | Para E2E tests (se configura en Story 1.2, solo instalar aquí) |
| **pnpm** | 10.x | Package manager del proyecto |
| **Node.js** | 22+ | Requerido por Astro 6 |

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

En `astro.config.mjs`, Tailwind se integra via Vite plugin:

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

### Configuración de Zod 4 (Import Path)

Zod 4 se importa con subpath durante el período de transición:

```typescript
import { z } from "zod/v4";
```

NO usar `import { z } from "zod"` (eso trae Zod 3 legacy).

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

### Scripts de `package.json`

Asegurar que existan estos scripts:

```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "type-check": "astro check",
    "lint": "eslint . --ext .ts,.astro,.svelte",
    "format": "prettier --write ."
  }
}
```

### Qué NO Hacer en Esta Story

- **NO configurar Firebase client/admin init** — eso es Story 1.10
- **NO crear design tokens** en `global.css` — eso es Story 1.5
- **NO configurar Vitest/Playwright configs** — eso es Story 1.2
- **NO crear componentes UI** — eso es Story 1.6+
- **NO configurar i18n** — eso es Story 1.8
- **NO configurar CI/CD** — eso es Story 1.3
- Solo instalar las dependencias base y verificar que el proyecto levanta

### Manejo del Repo Existente (Flutter)

El repositorio actual contiene código Flutter en producción. Decisión de cómo manejar esto:
- **Opción recomendada:** Crear el proyecto Astro en la raíz, moviendo o archivando el código Flutter. Los archivos de configuración de Firebase (`firebase.json`, `.firebaserc`, `firestore.rules`, `storage.rules`) se mantienen ya que el proyecto Firebase es el mismo.
- Los archivos `docs/` existentes son documentación brownfield del proyecto Flutter y sirven como referencia.

### Project Structure Notes

- La estructura sigue exactamente lo definido en el Architecture Decision Document
- `src/components/` organizado por dominio (common, layout, home, projects, blog, contact, admin)
- `src/lib/` contiene lógica de negocio separada de componentes
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
