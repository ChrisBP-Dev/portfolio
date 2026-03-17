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

| Script | Descripción |
|--------|-------------|
| `pnpm dev` | Servidor de desarrollo (Astro) |
| `pnpm build` | Build de producción |
| `pnpm preview` | Preview del build en localhost:4321 |
| `pnpm type-check` | Verificación de tipos TypeScript |
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

## CI/CD

GitHub Actions ejecuta el pipeline en cada push a `main` y via `workflow_dispatch` (rebuild manual).

### Pipeline

```
install → lint → type-check → test (con emuladores) → build → Lighthouse CI → deploy
```

Si cualquier step falla, el pipeline se detiene y el deploy no ocurre.

### Lighthouse CI

Lighthouse CI valida >95 en Performance, Accessibility, Best Practices y SEO. La configuración está en `lighthouserc.cjs`.

Verificar localmente:

```bash
pnpm build && pnpm exec lhci autorun
```

### GitHub Secrets requeridos

| Secret | Descripción |
|--------|-------------|
| `FIREBASE_SERVICE_ACCOUNT` | Service account JSON para deploy a Firebase Hosting |

**Setup:**

1. Firebase Console → proyecto `portfolio-chrisbp` → Project Settings → Service accounts
2. "Generate new private key" → descargar JSON
3. GitHub repo → Settings → Secrets and variables → Actions → New repository secret
4. Name: `FIREBASE_SERVICE_ACCOUNT`, Value: contenido del JSON
5. Eliminar el JSON del disco local

### Rebuild manual

Desde GitHub UI: Actions → "CI/CD Pipeline" → "Run workflow"

Desde CLI:

```bash
gh workflow run ci.yml
```
