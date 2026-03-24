# Arquitectura del Proyecto — Portfolio ChrisBP

> Generado: 2026-03-24 | Escaneo Exhaustivo | Astro 6 + Svelte 5 + Firebase

## Resumen Ejecutivo

Aplicación web estática (SSG) construida con el patrón **Astro Islands**: páginas pre-renderizadas en Astro con islas de interactividad en Svelte 5. Firebase como BaaS (Auth + Firestore + Storage). Tailwind CSS 4 para estilos. TypeScript strict en todo el codebase.

## Patrón Arquitectónico

### Astro Islands Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Build Time (Astro SSG)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐   │
│  │ Pages (.astro)│→│ Firebase Admin│→│ Static HTML + CSS  │   │
│  │ getStaticPaths│  │  SDK queries │  │  (pre-rendered)   │   │
│  └──────────────┘  └──────────────┘  └──────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              ↓ deploy
┌─────────────────────────────────────────────────────────────┐
│                   Runtime (Browser)                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐   │
│  │ Static HTML  │ +│ Svelte Islands│→│ Firebase Client   │   │
│  │ (zero JS)    │  │ (client:*)   │  │ SDK (Auth/CRUD)   │   │
│  └──────────────┘  └──────────────┘  └──────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

**Dos modos de data fetching:**
1. **Build-time** (páginas públicas): Firebase Admin SDK → `getStaticPaths()` → HTML estático
2. **Client-side** (admin): Firebase Client SDK → Svelte reactivo → CRUD en tiempo real

### Hydration Strategies

| Directiva | Uso | Ejemplo |
|-----------|-----|---------|
| `client:load` | Componentes interactivos inmediatos | ProjectFilter, ContactForm |
| `client:visible` | Lazy hydration al hacer scroll | ImageViewer |
| `client:only="svelte"` | Solo cliente, sin SSR | Admin pages (AuthGuard, CrudPages) |
| Sin directiva | Estático, zero JS | Todos los componentes Astro |

## Capas de la Aplicación

### 1. Capa de Presentación

```
src/pages/          → Routing (Astro file-based)
src/layouts/        → Layout wrappers (BaseLayout, AdminLayout)
src/components/     → UI components (Astro estáticos + Svelte interactivos)
src/styles/         → Design system (CSS tokens + Tailwind)
```

### 2. Capa de Datos / Lógica

```
src/lib/schemas/    → Validación Zod (runtime type safety)
src/lib/firebase/   → Acceso a datos (Firestore, Storage, Auth)
src/lib/utils/      → Utilidades puras (formateo, sanitización, rendering)
src/lib/i18n/       → Internacionalización
src/data/           → Datos estáticos de configuración
```

### 3. Capa de Infraestructura

```
firebase.json       → Hosting + Emulators config
firestore.rules     → Reglas de seguridad Firestore
storage.rules       → Reglas de seguridad Storage
.github/workflows/  → CI/CD pipeline
```

## Estado y Reactividad

### Svelte 5 Runes

El proyecto usa **Svelte 5** con el nuevo sistema de runes para reactividad:
- `$state()` — Estado reactivo local (formularios, UI state)
- `$derived()` — Valores computados
- `$effect()` — Side effects

### Stores Globales

| Store | Archivo | Propósito |
|-------|---------|-----------|
| Toast Store | `toast-store.svelte.ts` | Notificaciones con auto-dismiss (max 3, tiempos por tipo) |

### Patrón CRUD Container

Los 4 módulos admin siguen el mismo patrón:

```
CrudPage.svelte (container)
├── List.svelte         → Lista + acciones (edit, delete, reorder)
├── Form.svelte         → Crear/editar con validación Zod
├── ConfirmDialog.svelte → Confirmación de eliminación
└── Toast.svelte        → Feedback de operaciones
```

**Flujo de vista:** `list` → `create` | `edit` → `list` (con detección de cambios sin guardar)

## Modelo de Datos

### Esquemas Zod (Triple Schema Pattern)

Cada entidad tiene 3 esquemas:
1. **Full Schema** — Tipo completo con ID (para uso en la app)
2. **Firestore Schema** — Sin ID, para parsing de Firestore docs
3. **Form Schema** — Solo campos editables, para validación de formularios

### Colecciones Firestore

| Colección | Documentos | Campos Clave |
|-----------|------------|-------------|
| `Projects` | Proyectos del portfolio | companyName (L10n), slug, mainImage, screenshots[], technologies[], featured, order |
| `Technologies` | Stack tecnológico | name, image, experienceYears, order |
| `Experiences` | Experiencia laboral | companyName, jobName (L10n), responsibilities (L10n), startDate, endDate? |
| `BlogPosts` | Artículos del blog | title (L10n), content (L10n, TipTap JSON), slug, coverImage?, images[], status |

**L10n = LocalizedString** → `{ es: string, en: string }`

### Campos Compartidos (shared-schemas.ts)

- `LocalizedString` → `{ es: string, en: string }` con min 1 char cada uno
- `LocalizedStringArray` → `{ es: string[], en: string[] }` con min 1 item
- `StoredImage` → `{ url: string (URL), storagePath: string }`
- `Locale` → `'es' | 'en'`

## Navegación y Routing

### Estructura de URLs

```
/ (EN)                    /es/ (ES)
/projects                 /es/projects
/projects/[slug]          /es/projects/[slug]
/blog                     /es/blog
/blog/[slug]              /es/blog/[slug]
/contact                  /es/contact
/admin/login              (sin i18n)
/admin/                   (sin i18n)
/admin/projects           (sin i18n)
/admin/technologies       (sin i18n)
/admin/experiences        (sin i18n)
/admin/blog               (sin i18n)
```

- **EN** es el `defaultLocale` → sin prefijo
- **ES** usa prefijo `/es/`
- **Admin** es solo español, sin prefijo de locale
- **Slugs** se generan desde el campo EN (via `slugify()`)
- **View Transitions** via Astro ClientRouter

## Autenticación y Seguridad

### Firebase Auth

- **Login:** Email + password (signInWithEmailAndPassword)
- **Guard:** `AuthGuard.svelte` wrapper en todas las páginas admin
- **Admin UID:** Hardcoded en Firestore/Storage rules (`G26dKlezR6cghnfv7NrBmQiXdUG3`)

### Reglas de Seguridad

```
Firestore: read = público, write = auth.uid == ADMIN_UID
Storage:   read = público, write = auth.uid == ADMIN_UID
```

### Protección XSS

- Blog HTML sanitizado con `sanitize-html` (allowlist estricto)
- TipTap renderer con HTML escaping en todos los atributos y texto
- Solo tags/atributos/protocolos en whitelist

## Gestión de Imágenes

### Image Slot State Machine

```
empty → new (file selected)
existing → replaced (new file) | removed
new → empty (cancelled)
replaced → existing (cancelled) | empty (both removed)
removed → existing (undo)
```

### Upload Pipeline

1. `ImageUploader.svelte` captura drag-drop o file input
2. `image-service.ts` sube con `uploadBytesResumable` + retry (exponential backoff)
3. `image-slot-processor.ts` procesa transiciones de estado
4. `orphan-cleanup.ts` limpia imágenes huérfanas si el save falla

## Internacionalización

- **Sistema:** Astro built-in i18n
- **Locales:** `en` (default), `es`
- **Routing:** `prefixDefaultLocale: false` → EN sin prefijo, ES con `/es/`
- **Traducciones:** `src/lib/i18n/translations.ts` (~150+ claves)
- **Contenido:** Campos bilingües en Firestore (`{ es, en }`)
- **Detección:** `getLocaleFromUrl(url)` extrae locale del path

## Tema (Dark/Light Mode)

- **Default:** Dark (`class="dark"` en `<html>`)
- **Persistencia:** `localStorage` → `matchMedia` fallback
- **Anti-FOUC:** `ThemeScript.astro` ejecuta sync en `<head>`
- **Transiciones:** 200ms con `prefers-reduced-motion` respetado
- **Tokens CSS:** Variables `--theme-*` para ambos modos

## Testing

### Estrategia

| Tipo | Framework | Ubicación | Alcance |
|------|-----------|-----------|---------|
| Unit | Vitest + Testing Library | `src/**/__tests__/` | Schemas, utils, Firebase, componentes |
| E2E | Playwright | `tests/e2e/` | Flujos completos (público + admin) |
| Factories | Custom | `src/test/factories/` | Generación de datos de test |
| Accesibilidad | Tests de contraste | `src/styles/__tests__/` | WCAG AA compliance |

### E2E Projects

- `public` — Páginas públicas (excluye `admin-*.spec.ts`)
- `admin` — Panel admin (match `admin-*.spec.ts`)
- WebServer: `pnpm preview` en `localhost:4321`

## CI/CD Pipeline

```
Push to main → GitHub Actions
  ├── Lint (ESLint)
  ├── Type Check (astro check)
  ├── Tests (Vitest con Firebase Emulators)
  ├── Build (si hay cambios en código)
  ├── Lighthouse CI (≥0.95 en 4 categorías)
  └── Deploy (Firebase Hosting, canal live)
```

**Smart Skip:** Si solo cambian docs/config, se saltan build + Lighthouse + deploy.

## Dependencias Clave

### Runtime
- `astro` — Framework SSG
- `svelte` — UI interactivo
- `firebase` — Client SDK (Auth, Firestore, Storage)
- `@tiptap/*` — Editor rich text
- `sortablejs` — Drag and drop
- `zod` — Validación de esquemas
- `sanitize-html` — Sanitización HTML
- `sharp` — Procesamiento de imágenes (build-time)

### Development
- `firebase-admin` — Server-side Firebase (build-time queries)
- `firebase-tools` — Emuladores locales
- `vitest` — Testing unitario
- `@playwright/test` — Testing E2E
- `@lhci/cli` — Lighthouse CI
- `tailwindcss` — CSS utility framework
- `typescript` — Type safety
- `eslint` + `prettier` — Code quality
