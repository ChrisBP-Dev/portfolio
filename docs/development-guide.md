# Guía de Desarrollo — Portfolio ChrisBP

> Generado: 2026-03-24 | Escaneo Exhaustivo | Astro 6 + Svelte 5 + Firebase

## Prerrequisitos

| Herramienta | Versión | Propósito |
|-------------|---------|-----------|
| Node.js | ≥22.12.0 | Runtime (ver `.nvmrc`) |
| pnpm | 10 | Package manager |
| Java | 21+ (Temurin) | Firebase Emulators |
| Firebase CLI | ^15.10.1 | Emuladores locales (incluido como devDependency) |

## Setup Inicial

```bash
# Clonar repositorio
git clone <repository-url>
cd portfolio

# Instalar dependencias
pnpm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con credenciales Firebase
```

### Variables de Entorno

**Firebase Admin SDK (servidor — build-time):**
- `FIREBASE_ADMIN_PROJECT_ID`
- `FIREBASE_ADMIN_CLIENT_EMAIL`
- `FIREBASE_ADMIN_PRIVATE_KEY`

**Firebase Client SDK (navegador — runtime):**
- `PUBLIC_FIREBASE_API_KEY`
- `PUBLIC_FIREBASE_AUTH_DOMAIN`
- `PUBLIC_FIREBASE_PROJECT_ID`
- `PUBLIC_FIREBASE_STORAGE_BUCKET`
- `PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `PUBLIC_FIREBASE_APP_ID`

**Configuración de la App:**
- `PUBLIC_ADMIN_UID` — UID del admin para auth
- `PUBLIC_CONTACT_EMAIL` — Email de contacto
- `PUBLIC_WHATSAPP_NUMBER` — Número WhatsApp

**Emuladores (desarrollo local):**
- `PUBLIC_USE_EMULATORS=true` — Conectar a emuladores locales
- `USE_EMULATORS=true` — Admin SDK contra emuladores

## Comandos de Desarrollo

| Comando | Descripción |
|---------|-------------|
| `pnpm dev` | Servidor de desarrollo Astro (localhost:4321) |
| `pnpm build` | Build de producción (output: `dist/`) |
| `pnpm preview` | Preview del build (localhost:4321) |
| `pnpm type-check` | Verificación de tipos TypeScript (`astro check`) |
| `pnpm lint` | Linting con ESLint |
| `pnpm format` | Formateo con Prettier |
| `pnpm test` | Tests unitarios (Vitest) |
| `pnpm test:watch` | Tests en modo watch |
| `pnpm test:coverage` | Tests con cobertura V8 |
| `pnpm test:e2e` | Tests E2E (Playwright) |
| `pnpm emulators` | Firebase emuladores (Auth, Firestore, Storage) |
| `pnpm migrate` | Migración Flutter → Web (one-time) |
| `pnpm seed:experiences` | Seed datos de experiencias (one-time) |

## Flujo de Desarrollo Local

```bash
# Terminal 1: Firebase Emuladores
pnpm emulators

# Terminal 2: Servidor de desarrollo
pnpm dev

# Terminal 3: Tests en watch mode (opcional)
pnpm test:watch
```

**Emuladores disponibles:**
- Auth: `http://127.0.0.1:9099`
- Firestore: `http://127.0.0.1:8080`
- Storage: `http://127.0.0.1:9199`
- Emulator UI: `http://127.0.0.1:4000`

## Convenciones del Proyecto

### Estructura de Archivos

```
src/components/{category}/ComponentName.svelte   # Svelte interactivo
src/components/{category}/ComponentName.astro     # Astro estático
src/components/{category}/__tests__/name.test.ts  # Tests colocados
src/lib/{module}/filename.ts                      # Lógica de negocio
src/lib/{module}/__tests__/filename.test.ts       # Tests colocados
src/pages/{route}.astro                           # Páginas (routing)
```

### Naming Conventions

- **Componentes:** PascalCase (`ProjectForm.svelte`, `HeroSection.astro`)
- **Archivos TS:** kebab-case (`image-service.ts`, `toast-store.svelte.ts`)
- **Tests:** `{filename}.test.ts` en carpeta `__tests__/`
- **E2E:** `{feature}.spec.ts` en `tests/e2e/`
- **Schemas:** `{entity}-schema.ts`
- **Slugs:** Siempre desde campo EN (via `slugify()`)

### TypeScript

- Config: `strictest` (base Astro)
- Validación runtime con Zod (no solo tipos)
- Triple schema pattern para cada entidad

### CSS / Estilos

- Tailwind CSS 4 via plugin Vite
- Design tokens CSS en `src/styles/global.css`
- Dark mode via clase `.dark` en `<html>`
- Tipografía responsive con `clamp()`
- Breakpoints: sm (28.125rem), lg (56.25rem), xl (75rem)

### i18n

- EN es default (sin prefijo URL)
- ES tiene prefijo `/es/`
- Páginas duplicadas en `src/pages/` y `src/pages/es/`
- Contenido bilingüe en Firestore como `{ es, en }`
- Traducciones estáticas en `src/lib/i18n/translations.ts`

## Testing

### Tests Unitarios (Vitest)

```bash
pnpm test              # Run once
pnpm test:watch        # Watch mode
pnpm test:coverage     # Con cobertura V8
```

- **Config:** `vitest.config.ts`
- **Include:** `src/**/*.{test,spec}.{js,ts}`
- **Exclude:** `node_modules, dist, _flutter-archive, _bmad, _bmad-output, tests/e2e`
- **Browser conditions:** Habilitado para Testing Library + Svelte 5

### Tests E2E (Playwright)

```bash
pnpm test:e2e          # Run all E2E
```

- **Config:** `playwright.config.ts`
- **Test dir:** `tests/e2e/`
- **Projects:** `public` (páginas públicas) + `admin` (panel admin)
- **WebServer:** Auto-start `pnpm preview` en localhost:4321
- **Auth setup:** `tests/e2e/auth.setup.ts` + `.auth/admin.json`

### Factories

Ubicadas en `src/test/factories/`:
- `createProject()` — Proyecto con datos bilingües y imágenes
- `createTechnology()` — Tecnología con nombre y experiencia
- `createExperience()` — Experiencia con fechas y responsabilidades
- `createBlogPost()` — Post con contenido TipTap y timestamps

## Quality Gates

| Gate | Herramienta | Threshold |
|------|------------|-----------|
| Linting | ESLint (flat config) | Sin errores |
| Type Safety | `astro check` (strictest) | Sin errores |
| Unit Tests | Vitest | Todos pasan |
| E2E Tests | Playwright | Todos pasan |
| Performance | Lighthouse CI | ≥0.95 |
| Accessibility | Lighthouse CI | ≥0.95 |
| Best Practices | Lighthouse CI | ≥0.95 |
| SEO | Lighthouse CI | ≥0.95 |
| Contrast | Tests de contraste | WCAG AA |
