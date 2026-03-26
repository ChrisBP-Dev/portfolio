# Guía de Desarrollo — Portfolio ChrisBP

> Generado: 2026-03-26 | Modo: Re-escaneo Exhaustivo | v3.0.0

## Requisitos Previos

| Requisito | Versión | Notas |
|-----------|---------|-------|
| Node.js | >=22.12.0 | Definido en .nvmrc |
| pnpm | 10 | Package manager del proyecto |
| Java | 21 | Para Firebase Emulators |
| Firebase CLI | 15.10+ | Para emuladores locales |

## Setup Inicial

```bash
# 1. Clonar repositorio
git clone <repository-url>
cd portfolio

# 2. Instalar dependencias
pnpm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con credenciales Firebase (ver .env.example para detalles)
```

### Variables de Entorno Requeridas

**Cliente Firebase (browser):**
- `PUBLIC_FIREBASE_API_KEY` — API key pública
- `PUBLIC_FIREBASE_AUTH_DOMAIN` — Dominio de auth
- `PUBLIC_FIREBASE_PROJECT_ID` — ID del proyecto
- `PUBLIC_FIREBASE_STORAGE_BUCKET` — Bucket de storage
- `PUBLIC_FIREBASE_MESSAGING_SENDER_ID` — Sender ID
- `PUBLIC_FIREBASE_APP_ID` — App ID
- `PUBLIC_ADMIN_UID` — UID del admin

**Admin SDK (build-time, opcional para dev):**
- `FIREBASE_ADMIN_PROJECT_ID`
- `FIREBASE_ADMIN_CLIENT_EMAIL`
- `FIREBASE_ADMIN_PRIVATE_KEY`

**Contacto:**
- `PUBLIC_CONTACT_EMAIL`
- `PUBLIC_WHATSAPP_NUMBER`

**E2E Tests:**
- `E2E_ADMIN_EMAIL` — Email del admin para tests
- `E2E_ADMIN_PASSWORD` — Password del admin para tests

**Emuladores:**
- `PUBLIC_USE_EMULATORS=false` — Activar/desactivar emuladores (browser)
- `USE_EMULATORS=false` — Activar/desactivar emuladores (server)

## Comandos Principales

| Comando | Descripción |
|---------|-------------|
| `pnpm dev` | Servidor de desarrollo Astro (hot reload) |
| `pnpm build` | Build estático de producción |
| `pnpm preview` | Preview del build local |
| `pnpm type-check` | Verificación de tipos TypeScript |
| `pnpm lint` | Linter ESLint |
| `pnpm format` | Formateo con Prettier |
| `pnpm test` | Tests unitarios (Vitest, single run) |
| `pnpm test:watch` | Tests unitarios en modo watch |
| `pnpm test:coverage` | Tests con reporte de cobertura |
| `pnpm test:e2e` | Tests E2E (Playwright) |
| `pnpm emulators` | Iniciar Firebase Emulators (auth, firestore, storage) |

## Flujo de Desarrollo Local

```bash
# Terminal 1: Emuladores Firebase
pnpm emulators

# Terminal 2: Servidor de desarrollo
pnpm dev
# Abre http://localhost:4321
```

Emuladores disponibles en:
- Firebase Emulator UI: http://127.0.0.1:4000
- Auth: 127.0.0.1:9099
- Firestore: 127.0.0.1:8080
- Storage: 127.0.0.1:9199

## Scripts de Mantenimiento

| Comando | Descripción |
|---------|-------------|
| `pnpm migrate` | Ejecutar migración de datos Firestore |
| `pnpm seed:experiences` | Seed de experiencias laborales |
| `pnpm cleanup:e2e` | Limpiar datos de E2E tests |
| `pnpm cleanup:images` | Limpiar imágenes huérfanas en Storage |

## Convenciones de Código

### Estructura de Archivos
- Componentes Astro: `PascalCase.astro`
- Componentes Svelte: `PascalCase.svelte`
- Módulos TypeScript: `kebab-case.ts`
- Tests: `__tests__/nombre-del-archivo.test.ts` (colocados junto al código fuente)
- Factories de test: `src/test/factories/`

### TypeScript
- Config: `strictest` (extends `astro/tsconfigs/strictest`)
- Todas las entidades validadas con esquemas Zod
- Tres variantes por entidad: schema (completo), firestore (sin id), form (campos editables)

### Estilos
- Tailwind CSS 4 via `@tailwindcss/vite` plugin
- No hay archivo de configuración Tailwind separado
- Estilos globales en `src/styles/global.css`
- Fuentes: Poppins (body), JetBrains Mono (code) via Google Fonts

### Linting y Formateo
- ESLint: TypeScript + Astro + Svelte plugins
- Prettier: semi, singleQuote, trailingComma: all, printWidth: 100
- Archivos ignorados: dist/, _flutter-archive/, _bmad/, _bmad-output/, .claude/, docs/

### i18n
- Idioma default: Inglés (sin prefijo URL)
- Español: prefijo `/es/`
- Slugs siempre generados del campo EN
- Traducciones en `src/lib/i18n/translations.ts` (200+ claves)

## Testing

### Tests Unitarios (Vitest)
```bash
pnpm test          # Single run
pnpm test:watch    # Watch mode
pnpm test:coverage # Con cobertura
```
- 44 archivos de test, ~500+ assertions
- Coverage provider: v8
- Include: `src/**/*.{test,spec}.{js,ts}`
- Framework: @testing-library/svelte para componentes
- Resolución: `conditions: ['browser']` para SSR vs client

### Tests E2E (Playwright)
```bash
pnpm test:e2e
```
- 20 spec files
- Dos proyectos: `public` (páginas públicas) y `admin` (panel admin)
- Webserver: `pnpm preview` en puerto 4321
- Auth setup: login admin guardado en `.auth/admin.json`
- Global teardown: limpieza de datos de test
- Tests incluyen: CRUD, accesibilidad (axe-core), performance, SEO, responsive
