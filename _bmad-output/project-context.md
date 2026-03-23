---
project_name: 'portfolio'
user_name: 'Christopher'
date: '2026-03-22'
sections_completed: ['technology_stack', 'language_rules', 'framework_rules', 'testing_rules', 'code_quality', 'workflow_rules', 'critical_rules']
status: 'complete'
rule_count: 112
optimized_for_llm: true
---

# Project Context for AI Agents

_Este archivo contiene reglas y patrones críticos que los agentes de IA deben seguir al implementar código en este proyecto. Enfocado en detalles no obvios que los agentes podrían pasar por alto._

---

## Technology Stack & Versions

### Core
- **Astro** 6.0.5 — SSG estático, file-based routing, View Transitions
- **Svelte** 5.53.12 — Islands interactivos con runes (`$state`, `$effect`, `$derived`)
- **TypeScript** 5.9.3 — modo `strictest` (extends `astro/tsconfigs/strictest`)

### Styling
- **Tailwind CSS** 4.2.1 — via Vite plugin, `@theme inline` con CSS variables
- Fonts: Poppins (sans) + JetBrains Mono (code) via Astro Fonts API

### Backend
- **Firebase** 12.10.0 (client SDK — browser) + **firebase-admin** 13.7.0 (build-time data fetch)
- Firestore, Auth, Storage — Proyecto: `portfolio-chrisbp`

### Validación
- **Zod** 4.3.6 — schemas de runtime para datos de Firestore

### i18n
- Astro i18n nativo — `en` (default, sin prefijo) / `es` (prefijo `/es/`)
- Diccionario custom de traducciones + `localizedString` Zod schema

### Testing
- **Vitest** 4.1.0 (unit) + **Playwright** 1.58.2 (e2e)
- **Lighthouse CI** 0.15.1 (performance/a11y/seo gates)

### Tooling
- pnpm, Node.js >= 22.12.0, ESLint 10 + Prettier 3.8.1
- Firebase Hosting con cache headers inmutables

### Dependencias Adicionales
- sanitize-html 2.17.1, sharp 0.34.5, tsx 4.21.0

## Critical Implementation Rules

### Reglas Específicas de TypeScript

- **Strictest mode**: El proyecto usa `astro/tsconfigs/strictest` — nunca relajar reglas. Los tipos de Astro se auto-generan en `.astro/types.d.ts`
- **Imports relativos**: Sin path aliases configurados — usar `../../lib/i18n/translations`. Sin barrel exports — importar directamente desde el archivo fuente
- **Discriminated unions para Props**: Usar `never` para props exclusivas entre variantes (ej: `{ variant: 'technology'; value?: never } | { variant: 'status'; value: 'published' | 'draft' }`)
- **Zod como source of truth**: Todos los modelos de datos se definen como Zod schemas. Tipos derivados con `z.infer<typeof schema>` — NUNCA duplicar con interfaces manuales
- **Env variables tipadas**: `import.meta.env.PUBLIC_*` para browser, `import.meta.env.*` sin prefijo para build-time. Definidas en `src/env.d.ts`
- **Constantes**: `UPPER_SNAKE_CASE` para constantes globales (ej: `const ADMIN_UID = import.meta.env.PUBLIC_ADMIN_UID`)
- **Dates**: Siempre Firestore Timestamps nativos. Display con `Intl.DateTimeFormat` — no librerías de fecha externas
- **Validación en forms**: Zod `.safeParse()` para validación. Validación por campo en blur, validación completa en submit
- **safeParse obligatorio para datos externos**: Usar `schema.safeParse()` para datos de Firestore/usuario — skip invalid entries, nunca crashear la lista. `parse()` solo para datos confiables internos
- **Promise.allSettled para operaciones múltiples**: Multi-upload usa `Promise.allSettled` + reporte de éxito parcial al usuario, no `Promise.all` que falla con todo-o-nada
- **Guard de inicialización en forms**: Edit mode requiere flags (`initialized`, `initializedForId`) para prevenir loops infinitos en `$effect` al cargar datos iniciales
- **Constantes de colección duplicadas en client**: Admin components duplican nombres de colección localmente — NO importar de `collections.ts` (evita side-effects del Admin SDK en browser)
- **Dates con timezone local**: `new Date(value + 'T00:00:00')` para interpretar fechas como medianoche local, no UTC
- **Interpolación de traducciones admin**: Placeholders `{key}` con `.replace()` para valores dinámicos en strings de traducción

### Reglas Específicas del Framework

#### Astro — Cuándo y Cómo
- Output `static` — todo se genera en build time. Páginas públicas NO tienen JavaScript por defecto
- Datos de Firestore con **Admin SDK en build time** (frontmatter script), NO client SDK en páginas públicas
- Componentes `.astro` para contenido estático (layouts, páginas, secciones) — zero JS al browser
- `<ClientRouter />` en BaseLayout habilita View Transitions (navegación client-side)

#### Svelte 5 — Cuándo y Cómo
- Svelte islands SOLO para interactividad: forms admin, theme toggle, locale toggle, filtros
- SIEMPRE usar **Svelte 5 runes** (`$state`, `$effect`, `$derived`, `$props`) — NUNCA syntax Svelte 4
- `client:load` para componentes que necesitan JS inmediatamente
- `transition:persist` en componentes que deben sobrevivir navegación (ThemeToggle, LocaleToggle)

#### Svelte 5 Patterns Maduros (Epic 3)
- **Module-level `$state` para stores**: Patrón `toast-store.svelte.ts` — `$state` a nivel módulo, acceso via getter en objeto exportado
- **`$effect` cleanup obligatorio**: Auth listeners (`onAuthStateChanged`), upload handles (`.cancel()`), event listeners — siempre retornar función cleanup
- **`$derived.by()` para computed complejos**: Interpolación de strings, cálculos condicionales. Trackea dependencias automáticamente
- **Export functions para state exposure**: En vez de eventos, exportar funciones (`getHasChanges()`, `loadProjects()`) para comunicación parent→child via refs
- **Non-blocking image cleanup**: Cleanup de Storage envuelto en try-catch con `console.warn` — no falla la operación del usuario

#### View Transitions
- `transition:animate="fade"` en `<main>` para transiciones entre páginas
- Escuchar `astro:after-swap` para re-sincronizar estado después de navegación (locale, theme)
- Componentes con `transition:persist` mantienen estado — registrar cleanup de event listeners en `$effect`

#### Layouts
- `BaseLayout.astro` — estructura global: SkipNav → Banner → Header → main → Footer
- Props requeridos: `title`, `description`, `currentPage`
- SEO: hreflang links automáticos para ambos locales

#### Admin Architecture
- **AdminLayout separado de BaseLayout**: Dark mode hardcodeado, sin View Transitions (`<ClientRouter />`), `noindex/nofollow`. No usa navegación client-side
- **AuthGuard envuelve todas las páginas admin**: `client:only="svelte"` + `onAuthStateChanged` listener con redirección `window.location.href` (no client-side routing)
- **CRUD Page pattern**: Estado `viewMode: 'list' | 'create' | 'edit'` con mode switching. Component refs (`bind:this`) + `export function` para comunicación entre componentes
- **Unsaved changes guard**: Forms exponen `getHasChanges()` como función exportada. CRUD pages verifican antes de navegar con `confirm()`
- **Login pattern**: Auth check en mount redirige usuarios ya autenticados. Submit con try-catch, error inline con `aria-invalid`

#### Image Lifecycle (Safe-First)
- **ImageSlot discriminated union**: Estado de imagen como state machine: `empty | existing | new | replaced | removed`. Cada estado trackea qué pasó para habilitar cleanup correcto
- **ImageService con UploadHandle**: Retorna promise-like cancelable. `cancel()` en unmount via `$effect` cleanup. Backward compatible (PromiseLike → `await` funciona)
- **Operaciones safe-first**: Eliminar documento PRIMERO, luego cleanup de imágenes. Orphans en Storage son OK, referencias rotas en Firestore NO
- **Document-first create con rollback**: Crear doc → upload imagen → si falla upload, best-effort rollback del doc. Si rollback falla, log + orphan aceptable
- **Partial failure**: `Promise.allSettled` para multi-screenshot. Reportar éxito parcial al usuario, guardar solo los exitosos
- **Memory management**: `URL.revokeObjectURL()` obligatorio al reemplazar/eliminar previews. `MAX_SCREENSHOTS=10` con botón deshabilitado al límite
- **Retry con backoff**: `withRetry()` para operaciones de Storage. Solo errores retryable (network, quota). Backoff exponencial: 300ms × 2^attempt, máximo 2 retries

#### UI Patterns (Admin)
- **ConfirmDialog WCAG**: `role="alertdialog"`, `aria-modal="true"`, `aria-labelledby`/`aria-describedby`. Focus trap, body scroll lock, Escape + backdrop close. Botones disabled durante confirmación
- **BilingualField responsive**: Tabs (mobile <900px) vs columnas side-by-side (desktop ≥900px). `idPrefix` prop para IDs únicos. Error states sincronizados
- **Toast por severidad**: Success auto-dismiss 4s, Warning 6s, Error manual. Máximo 3 toasts visibles (FIFO). Timeouts tracked en Map para cleanup
- **Skeleton loaders**: `aria-busy` + `animate-pulse` + `bg-border` durante carga async de datos admin

#### Firebase Dual SDK Pattern
- **Build time (Admin SDK)**: `src/lib/firebase/firebase-admin.ts` — queries Firestore para generar HTML estático
- **Browser (Client SDK)**: `src/lib/firebase/client.ts` — singleton: Auth, Firestore, Storage para admin UI
- Emuladores: controlados por `PUBLIC_USE_EMULATORS` / `USE_EMULATORS`

#### Firebase Hosting & CI
- **`cleanUrls: true` obligatorio**: Sin esto, Firebase Hosting no resuelve `/admin` → `/admin/index.html` para páginas client-routed
- **Client config en CI**: `fromJson(secrets.FIREBASE_CLIENT_CONFIG)` para extraer `PUBLIC_FIREBASE_*` vars. Son valores públicos pero almacenados en secrets para no hardcodear
- **Lighthouse no destruye artifacts**: Mover admin pages a `/tmp` durante scan, restaurar antes de deploy. NUNCA `rm -rf dist/admin` permanente

#### Responsive
- Breakpoints custom: `sm: 28.125rem` (450px), `lg: 56.25rem` (900px), `xl: 75rem` (1200px)
- Todo componente debe funcionar en los 3 breakpoints

#### Theming (Dark/Light)
- Class-based: `<html class="dark">` — dark es el default
- CSS variables en `:root` (light) y `.dark` (dark). Tailwind bridge: `@theme inline` con `var()`
- `.theme-transitioning` class para transiciones suaves al toggle

#### i18n Pattern
- UI strings: diccionario en `src/lib/i18n/translations.ts` — acceso via `t('key', locale)`
- Datos Firestore: campos bilingües como nested objects `{ es, en }` — acceso directo `field[locale]`
- `localizeHref()` helper para URLs con prefijo de locale. `getLocaleFromUrl()` extrae locale del pathname

### Reglas de Testing

#### Vitest (Unit Tests)
- Archivos de test: `src/**/*.{test,spec}.{js,ts}`
- Coverage: provider v8, incluye `src/**/*.{ts,svelte}`, excluye `src/test/**` y `*.d.ts`
- `passWithNoTests: true` — no bloquea pipeline sin tests
- Configuración via `getViteConfig` de Astro — comparte resolución de módulos con el build

#### Test Data Factories
- Directorio `src/test/factories/` — funciones factory que retornan objetos válidos según Zod schemas
- Usar factories en lugar de fixtures hardcodeados

#### Playwright (E2E)
- Directorio: `tests/e2e/`
- Base URL: `http://localhost:4321` contra `pnpm preview`
- CI: 1 worker, 2 retries. Local: paralelo, sin retries. Trace en primer retry

#### Playwright E2E (Admin)
- **Proyecto separado con auth global**: `admin` project depende de `setup` project. Auth state persistido en `.auth/admin.json` (gitignored)
- **Auth setup fixture**: Login via UI (`/admin/login`), esperar hydration de Svelte (`toBeVisible({ timeout: 10_000 })`), guardar `storageState` para reuso
- **Tests idempotentes**: Cada test crea y limpia sus propios datos. No acumular basura en Firestore
- **Helpers para UI responsive**: `fillVisible()` / `clearAndFillVisible()` manejan duplicados mobile/desktop. `clickListAction()` para acciones en list items por texto
- **E2E coverage admin**: Dashboard navigation, CRUD completo (create/edit/delete) para projects/technologies/experiences, auth protection, image upload/replace, logout

#### Proceso de Testing (Lecciones Epic 3)
- **E2E DEBE fluir de test-design a story tasks**: El SM verifica test-design al crear stories y traduce casos E2E en tareas explícitas. Gap entre "doc dice testear" y "story dice implementar" = tests que nunca se escriben
- **Dev no marca 'done' sin E2E**: Todo story con UI incluye tareas E2E de sus acceptance criteria
- **Browser verification es Definition of Done**: Admin = E2E con Playwright. Público = E2E + Lighthouse CI

#### Lighthouse CI
- 2 matrices: páginas de proyecto (performance >= 0.7 warn) y resto (>= 0.95 error)
- Accessibility, Best Practices, SEO: siempre >= 0.95 error. Preset desktop

#### Comandos
- `pnpm test` (unit), `pnpm test:watch`, `pnpm test:coverage`, `pnpm test:e2e` (Playwright)

### Reglas de Calidad de Código & Estilo

#### ESLint
- ESLint 10 flat config: `eslint-plugin-astro` + `eslint-plugin-svelte` + `typescript-eslint`
- Archivos `.svelte` usan `tseslint.parser`
- `@typescript-eslint/no-unused-vars` con `argsIgnorePattern: '^_'` — prefijo `_` para args ignorados
- Ignores: `dist/`, `_flutter-archive/`, `_bmad/`, `_bmad-output/`, `.astro/`

#### Prettier
- Semi: `true`, singleQuote: `true`, trailingComma: `all`, printWidth: `100`, tabWidth: `2`
- Plugins: `prettier-plugin-astro`, `prettier-plugin-svelte`
- `.prettierignore` excluye: `_flutter-archive/`, `_bmad/`, `_bmad-output/`, `.claude/`, `docs/`

#### Naming Conventions
- Archivos: **kebab-case** (`format-date.ts`, `firebase-admin.ts`)
- Componentes: **PascalCase** (`Badge.astro`, `ThemeToggle.svelte`)
- Variables/funciones: **camelCase** (`projectData`, `getLocaleFromUrl`)
- Constantes globales: **UPPER_SNAKE_CASE** (`ADMIN_UID`, `MAX_SCREENSHOTS`)
- Tipos/Interfaces: **PascalCase** (`Project`, `Locale`, `StoredImage`)

#### Organización de Archivos
```
src/
├── components/{feature}/    # Por feature: home, layout, contact, projects, blog, admin, common
├── data/                    # Helpers de datos (navigation)
├── layouts/                 # Wrappers de página (BaseLayout, AdminLayout)
├── lib/firebase/            # SDKs client + admin
├── lib/i18n/                # Traducciones y config
├── lib/schemas/             # Zod schemas (source of truth)
├── lib/types/               # Tipos derivados de schemas
├── lib/utils/               # Utilidades puras (formatDate, slugify, toast-store, error-messages)
├── lib/scripts/             # Scripts de build/seed (migrate, seed)
├── pages/                   # File-based routing
├── pages/admin/             # Admin pages (index, login, projects, technologies, experiences, blog)
├── styles/                  # CSS global + Tailwind
├── test/factories/          # Test data factories
└── assets/                  # Imágenes estáticas
```

#### Accesibilidad
- WCAG 2.1 AA obligatorio — contraste 4.5:1, navegación teclado, skip nav
- HTML semántico nativo, ARIA landmarks, alt text en imágenes dinámicas
- `SkipNav` component incluido en BaseLayout

#### Accesibilidad Admin (WCAG 2.1 AA)
- **Dialogs semánticos**: `role="alertdialog"`, `aria-modal="true"`, `aria-labelledby`, `aria-describedby` en ConfirmDialog
- **Drawers/sidebars**: `aria-expanded`, `aria-controls`, `aria-label` en AdminSidebar mobile
- **Focus management**: Focus trap en dialogs y drawers. `requestAnimationFrame()` para focus después de DOM update. Auto-focus en botón cancel al abrir dialog
- **Estados de carga**: `aria-busy` en contenedores async. Skeleton loaders visualmente descriptivos

#### Error Handling Centralizado
- **Firebase error → i18n key mapping**: `FIRESTORE_ERROR_MAP` y `STORAGE_ERROR_MAP` mapean `error.code` → clave de traducción. Auth errors mapean a objetos `{ es, en }` directamente
- **Duck-typing en error.code**: Todos los handlers verifican `error.code` sin import de tipos Firebase específicos — compatible con cualquier error shape
- **Patrón DRY**: Una sola utilidad `getFirestoreErrorMessage()` / `getStorageErrorMessage()` — NUNCA duplicar lógica de mapeo en componentes individuales

#### Calidad en Implementación
- **Calidad empieza en dev, no en review**: A11y, patrones de error, cleanup — deben ser parte de la implementación, no atrapados en code review. Code review debe encontrar problemas de arquitectura, no aria-labels faltantes
- **Código auto-documentado**: Funciones complejas, decisiones no obvias y patrones del proyecto tienen comentarios inline. Sin documentación externa obligatoria

### Reglas de Workflow de Desarrollo

#### Git
- Branch principal: `main`
- Naming de branches: `tipo/descripcion` (ej: `feature/contact-form`, `fix/auth-bug`)
- Commits: prefijo semántico en inglés (`feat:`, `fix:`, `docs:`, `chore:`, `refactor:`)

#### CI/CD Pipeline (GitHub Actions)
- `push to main → pnpm install → lint → type-check → test → build → Lighthouse CI → firebase deploy`
- **Lighthouse scan con protección de artifacts**: Admin pages movidas a `/tmp` durante scan, restauradas antes de deploy. NUNCA eliminar permanentemente del `dist/`
- **Firebase client config en CI**: Secret `FIREBASE_CLIENT_CONFIG` (JSON) parseado con `fromJson()` para inyectar `PUBLIC_FIREBASE_*` env vars en build step. Mismo patrón que `FIREBASE_SERVICE_ACCOUNT`
- **Smart skip logic**: Si solo cambian `docs/`, `_bmad/`, `.claude/`, etc. → skip build, Lighthouse y deploy. Compara rango completo del push (`github.event.before..HEAD`), no solo último commit

#### Build Pipeline Local
- `pnpm dev` — servidor desarrollo (localhost:4321)
- `pnpm build` — SSG build (queries Firestore via Admin SDK, genera `dist/`)
- `pnpm preview` — preview del build estático

#### Deploy
- `firebase deploy --only hosting` — `dist/` → Firebase Hosting
- Cache headers inmutables para assets estáticos (`max-age=31536000, immutable`)

#### Firebase Emuladores
- `pnpm emulators` — Auth (9099), Firestore (8080), Storage (9199), UI (4000)
- Controlados por `.env`: `PUBLIC_USE_EMULATORS=true` / `USE_EMULATORS=true`

#### Scripts de Datos
- `pnpm migrate` — migración one-time Firestore (Flutter schema → schema profesional)
- `pnpm seed:experiences` — seed de experiencias en emuladores

#### Environment Variables
- `.env` (local, no committed) + `.env.example` (template, committed)
- CI/CD: GitHub Secrets para `FIREBASE_ADMIN_*` keys + `FIREBASE_CLIENT_CONFIG`
- `PUBLIC_*` = browser. Sin prefijo = solo build-time

#### Proceso de Desarrollo (Lecciones Retros)
- **Verificar datos reales antes de escribir stories**: Arquitectura es un plan, no realidad. Siempre verificar Firestore/código actual contra spec antes de crear story spec
- **Decisiones estratégicas antes del epic, no durante**: Cambios como locale flip tocan 14+ archivos. Decidir en planning, no en implementación
- **Project context actualizado después de cada epic**: Antes de crear stories del siguiente epic. Context desactualizado bloquea a los agentes
- **Arquitectura pragmática**: JAMstack + Islands es correcto para portfolio. Clean Architecture sería sobre-ingeniería. Elegir mínima complejidad necesaria

#### Code Review (3 Capas)
- **Capa 1 — Implementación**: Story ACs cumplidos, funcionalidad correcta
- **Capa 2 — Arquitectura**: Consistencia con schemas, error handling, patrones del proyecto
- **Capa 3 — Seguridad de producción**: Atomicidad, cleanup, error cases, a11y, memory leaks

### Reglas Críticas — No Olvidar

#### Anti-Patrones (PROHIBIDOS)
- NUNCA crear tipos/interfaces manuales para modelos de datos — siempre derivar de Zod schemas con `z.infer<>`
- NUNCA usar Svelte 4 syntax (`export let`, `$:`, stores) — siempre Svelte 5 runes
- NUNCA usar client SDK de Firebase en páginas públicas — datos públicos con Admin SDK en build time
- NUNCA hardcodear strings de UI — siempre en `translations.ts` con ambos idiomas
- NUNCA agregar campos bilingües con sufijos (`fieldEs`/`fieldEn`) — siempre nested objects `{ es, en }`
- NUNCA usar librerías de fecha externas — usar `Intl.DateTimeFormat` nativo
- NUNCA editar archivos en `_bmad/`, `_bmad-output/`, `.claude/`, `docs/` — archivos del framework, off-limits
- NUNCA usar `Promise.all` para uploads múltiples — siempre `Promise.allSettled` con reporte de éxito parcial
- NUNCA eliminar imágenes de Storage ANTES del documento en Firestore — siempre document-first (orphans OK, refs rotas NO)
- NUNCA dejar `UploadHandle` sin cancel en unmount — siempre `$effect` cleanup que cancela uploads activos
- NUNCA dejar `URL.createObjectURL()` sin `revokeObjectURL()` — memory leak en browsers
- NUNCA usar `rm -rf` en artifacts de deploy durante CI — mover a temp, restaurar después
- NUNCA importar `collections.ts` en componentes client — duplicar constantes localmente para evitar side-effects del Admin SDK

#### Defer Criteria (Post-Retro Epic 3)
- **Defer SOLO con plan concreto**: Si code review encuentra defecto y no hay story futura planeada → corregir en story actual. "Pre-existente" sin plan = se resuelve ahora
- **Riesgo de replicación**: Un defecto deferido se replicó a 4 archivos porque devs siguieron "el patrón existente". Deferir sin resolver = deuda técnica exponencial
- **No defect replication**: Si el patrón actual tiene un defecto conocido, NO replicarlo en nuevos componentes — corregir primero

#### Casos Especiales
- **Blog HTML sanitization**: HTML de TipTap almacenado en Firestore DEBE sanitizarse con `sanitize-html` en build time al renderizar con `set:html`
- **StoredImage vs ImageSlot**: `StoredImage` = modelo Firestore (url, path, alt). `ImageSlot` = estado UI (discriminated union: empty/existing/new/replaced/removed). Nunca mezclar
- **Bilingüe obligatorio**: Todo contenido visible al usuario debe existir en EN y ES — campos Firestore Y strings de UI
- **transition:persist**: Componentes que sobreviven navegación — registrar cleanup de listeners en `$effect` return, escuchar `astro:after-swap` para re-sync
- **Firebase singleton**: Client SDK con `getApps().length === 0` check — nunca crear múltiples instancias
- **Form init guard en edit mode**: `initialized` + `initializedForId` flags para prevenir loops infinitos de `$effect` al recibir `initialData` como prop
- **Dates timezone**: `new Date(value + 'T00:00:00')` para interpretar como medianoche local, no UTC
- **Rollback best-effort**: Si create doc OK pero upload falla → intentar `deleteDoc`. Si rollback falla → log + orphan aceptable. No silenciar, no crashear
- **MAX_SCREENSHOTS=10**: Validación en UI (botón disabled) + validación en schema. Ambas necesarias
- **BilingualField idPrefix**: Cada instancia necesita `idPrefix` único para IDs de input consistentes y accesibles

#### Seguridad
- API keys de Firebase en `.env` — NUNCA en código fuente
- No exponer rutas admin sin verificación de auth state
- `sanitize-html` obligatorio para HTML dinámico renderizado con `set:html`
- Firestore Security Rules y Storage Rules protegen datos en producción

#### Performance
- Lighthouse CI gates: >= 0.95 en a11y, best-practices, SEO. Performance >= 0.95 (normal) / >= 0.7 (proyectos)
- Zero JS por defecto en páginas públicas — solo Svelte islands añaden JavaScript
- Imágenes procesadas con `sharp` para optimización

---

## Guías de Uso

**Para Agentes de IA:**
- Leer este archivo ANTES de implementar cualquier código
- Seguir TODAS las reglas exactamente como están documentadas
- Ante la duda, preferir la opción más restrictiva
- Actualizar este archivo si emergen nuevos patrones

**Para Humanos:**
- Mantener este archivo lean y enfocado en las necesidades de los agentes
- Actualizar cuando cambie el stack tecnológico
- Revisar después de cada epic para eliminar reglas obsoletas y agregar nuevas

Última actualización: 2026-03-22
