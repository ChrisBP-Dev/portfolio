---
project_name: 'portfolio'
user_name: 'Christopher'
date: '2026-03-19'
sections_completed: ['technology_stack', 'language_rules', 'framework_rules', 'testing_rules', 'code_quality', 'workflow_rules', 'critical_rules']
status: 'complete'
rule_count: 68
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

#### View Transitions
- `transition:animate="fade"` en `<main>` para transiciones entre páginas
- Escuchar `astro:after-swap` para re-sincronizar estado después de navegación (locale, theme)
- Componentes con `transition:persist` mantienen estado — registrar cleanup de event listeners en `$effect`

#### Layouts
- `BaseLayout.astro` — estructura global: SkipNav → Banner → Header → main → Footer
- Props requeridos: `title`, `description`, `currentPage`
- SEO: hreflang links automáticos para ambos locales

#### Firebase Dual SDK Pattern
- **Build time (Admin SDK)**: `src/lib/firebase/firebase-admin.ts` — queries Firestore para generar HTML estático
- **Browser (Client SDK)**: `src/lib/firebase/client.ts` — singleton: Auth, Firestore, Storage para admin UI
- Emuladores: controlados por `PUBLIC_USE_EMULATORS` / `USE_EMULATORS`

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
├── lib/utils/               # Utilidades puras (formatDate, slugify)
├── lib/scripts/             # Scripts de build/seed (migrate, seed)
├── pages/                   # File-based routing
├── styles/                  # CSS global + Tailwind
├── test/factories/          # Test data factories
└── assets/                  # Imágenes estáticas
```

#### Accesibilidad
- WCAG 2.1 AA obligatorio — contraste 4.5:1, navegación teclado, skip nav
- HTML semántico nativo, ARIA landmarks, alt text en imágenes dinámicas
- `SkipNav` component incluido en BaseLayout

### Reglas de Workflow de Desarrollo

#### Git
- Branch principal: `main`
- Naming de branches: `tipo/descripcion` (ej: `feature/contact-form`, `fix/auth-bug`)
- Commits: prefijo semántico en inglés (`feat:`, `fix:`, `docs:`, `chore:`, `refactor:`)

#### CI/CD Pipeline (GitHub Actions)
- `push to main → pnpm install → lint → type-check → test → build → Lighthouse CI → firebase deploy`

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
- CI/CD: GitHub Secrets para `FIREBASE_ADMIN_*` keys
- `PUBLIC_*` = browser. Sin prefijo = solo build-time

### Reglas Críticas — No Olvidar

#### Anti-Patrones (PROHIBIDOS)
- NUNCA crear tipos/interfaces manuales para modelos de datos — siempre derivar de Zod schemas con `z.infer<>`
- NUNCA usar Svelte 4 syntax (`export let`, `$:`, stores) — siempre Svelte 5 runes
- NUNCA usar client SDK de Firebase en páginas públicas — datos públicos con Admin SDK en build time
- NUNCA hardcodear strings de UI — siempre en `translations.ts` con ambos idiomas
- NUNCA agregar campos bilingües con sufijos (`fieldEs`/`fieldEn`) — siempre nested objects `{ es, en }`
- NUNCA usar librerías de fecha externas — usar `Intl.DateTimeFormat` nativo
- NUNCA editar archivos en `_bmad/`, `_bmad-output/`, `.claude/`, `docs/` — archivos del framework, off-limits

#### Casos Especiales
- **Blog HTML sanitization**: HTML de TipTap almacenado en Firestore DEBE sanitizarse con `sanitize-html` en build time al renderizar con `set:html`
- **StoredImage vs ImageSlot**: `StoredImage` = modelo Firestore (url, path, alt). `ImageSlot` = estado UI (discriminated union: empty/existing/new). Nunca mezclar
- **Bilingüe obligatorio**: Todo contenido visible al usuario debe existir en EN y ES — campos Firestore Y strings de UI
- **transition:persist**: Componentes que sobreviven navegación — registrar cleanup de listeners en `$effect` return, escuchar `astro:after-swap` para re-sync
- **Firebase singleton**: Client SDK con `getApps().length === 0` check — nunca crear múltiples instancias

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
- Revisar periódicamente para eliminar reglas obsoletas

Última actualización: 2026-03-19

