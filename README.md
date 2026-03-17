# Portfolio — ChrisBP

Portfolio personal construido con Astro 6, Svelte 5, Tailwind CSS 4 y Firebase.

## Prerequisitos

- **Node.js** 22.12.0+
- **pnpm** 10+
- **Java JDK** 21+ (requerido por Firebase Emulator Suite)

## Setup

```bash
pnpm install
pnpm exec playwright install  # browsers para E2E
```

## Scripts

| Script | Descripcion |
|--------|-------------|
| `pnpm dev` | Servidor de desarrollo (Astro) |
| `pnpm build` | Build de produccion |
| `pnpm preview` | Preview del build en localhost:4321 |
| `pnpm type-check` | Verificacion de tipos TypeScript |
| `pnpm lint` | Linting con ESLint |
| `pnpm format` | Formateo con Prettier |
| `pnpm test` | Tests unitarios (Vitest) |
| `pnpm test:watch` | Tests en modo watch |
| `pnpm test:coverage` | Tests con reporte de cobertura |
| `pnpm test:e2e` | Tests end-to-end (Playwright) |
| `pnpm emulators` | Firebase Emulator Suite |

## Emuladores Firebase

Firebase Emulator Suite provee Auth, Firestore y Storage localmente para desarrollo y testing.

### Iniciar emuladores

```bash
pnpm emulators
```

### Puertos

| Servicio | Puerto |
|----------|--------|
| Auth | 127.0.0.1:9099 |
| Firestore | 127.0.0.1:8080 |
| Storage | 127.0.0.1:9199 |
| Emulator UI | 127.0.0.1:4000 |

> **Nota:** Los emuladores usan `127.0.0.1` explicitamente porque Node 22 resuelve `localhost` a IPv6 `::1`, lo que causa timeouts.

## Tests

### Tests unitarios

```bash
pnpm test              # ejecutar una vez
pnpm test:watch        # modo watch
pnpm test:coverage     # con cobertura
```

Los tests unitarios usan Vitest con `getViteConfig()` de Astro. Los archivos de test se ubican en `src/**/__tests__/` con sufijo `.test.ts`.

### Tests E2E

```bash
pnpm build && pnpm test:e2e
```

Los tests E2E usan Playwright y requieren un build previo. Se ubican en `tests/e2e/`.

### Test Data Factories

Factories disponibles en `src/test/factories/` para generar datos de test:

```typescript
import { createProject, createTechnology, createExperience, createBlogPost } from '../test/factories';

const project = createProject({ featured: true });
const tech = createTechnology({ name: 'Svelte' });
```

Cada factory acepta un objeto `overrides` parcial para personalizar campos.
