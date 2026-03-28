---
project_name: 'portfolio'
user_name: 'Christopher'
date: '2026-03-28'
sections_completed: ['technology_stack', 'language_rules', 'framework_rules', 'testing_rules', 'code_quality', 'workflow_rules', 'critical_rules']
status: 'complete'
rule_count: 213
lines: 528
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

### Rich Text & Drag-Drop
- **TipTap** 3.20.4 — Editor rich text (StarterKit + Image + Link extensions)
- **SortableJS** 1.15.7 — Drag-drop con soporte touch para reordering admin

### i18n
- Astro i18n nativo — `en` (default, sin prefijo) / `es` (prefijo `/es/`)
- Diccionario custom de traducciones + `localizedString` Zod schema

### SEO & Structured Data
- **@astrojs/sitemap** 3.7.1 — XML sitemap con filtro admin + i18n locales
- **JSON-LD** inline — Person (home), CreativeWork (projects), BlogPosting (blog)

### Testing
- **Vitest** 4.1.0 (unit) + **Playwright** 1.58.2 (e2e) + **axe-core/playwright** 4.11.1 (WCAG)
- **Lighthouse CI** 0.15.1 (performance/a11y/seo gates)

### Tooling
- pnpm, Node.js >= 22.12.0, ESLint 10 + Prettier 3.8.1
- Firebase Hosting con cache headers inmutables
- Scripts de mantenimiento: `cleanup:e2e`, `cleanup:images` (dry-run por defecto)
- Scripts de seed: `seed:experiences`, `seed:blog` (requieren `.env` + `--import tsx`)

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
- **`toDate()` polimórfico en parsers de Firestore**: Schemas que incluyen fechas deben manejar 4 formatos: `Date` nativo, Firestore `Timestamp` (con `.toDate()`), ISO string, y Unix timestamp (number). Helper `toDate()` centraliza la coerción — NUNCA asumir un solo formato
- **Interpolación de traducciones admin**: Placeholders `{key}` con `.replace()` para valores dinámicos en strings de traducción
- **Slug auto-generation desde EN (defaultLocale)**: Slugs aparecen en URLs sin prefijo de locale (`/blog/my-article`, `/projects/my-project`). Generar siempre desde el campo EN usando `slugify(titleEn)`. Nunca desde ES — el sitio es English-first (`defaultLocale = 'en'`). Cuando el campo EN queda vacío, el slug debe limpiarse (`slug = titleEn ? slugify(titleEn) : ''`)
- **`exactOptionalPropertyTypes` compliance**: Props opcionales con `?:` NO aceptan `undefined` implícitamente. Declarar explícito: `ogImage?: string | undefined`. Sin `| undefined` explícito, TypeScript rechaza valores que pueden ser `undefined` en runtime
- **TipTap JSON como string**: Contenido de blog almacenado como JSON stringificado en Firestore (`JSON.stringify(editor.getJSON())`). Parse con `JSON.parse()` al inicializar editor. NUNCA almacenar HTML — el render pipeline es: JSON → HTML → sanitize
- **`createSubscriber` para sistemas externos**: Svelte 5 bridge para TipTap u otros event systems. `createSubscriber()` de `svelte/reactivity` registra dependencia reactiva sin crear nueva por cada llamada — es idempotente
- **`untrack()` en `$effect` de editores**: Previene que el efecto se re-ejecute cuando cambian props como `content` u `onUpdate`. El efecto trackea SOLO el elemento DOM; props se capturan con `untrack()` en closures del primer run. Sin esto, el editor se destruye/recrea en cada keystroke
- **Plain `let` vs `$state` para cleanup trackers**: Variables de tracking de sesión (`savedSuccessfully`, `sessionInlineImages`) usan `let` simple, NO `$state`. Reactive state dispararía `$effect` en cada push/cambio — closures de JS son suficientes para cleanup en unmount
- **`escapeHtml` obligatorio en renderers custom**: Todo texto Y atributos (href, alt, src) deben escaparse con la secuencia correcta: `&` primero (evita double-escaping), luego `<`, `>`, `"`, `'`. Single-quote se escapa por defense-in-depth
- **TipTap empty detection**: `{ type: 'doc', content: [{ type: 'paragraph' }] }` es el estado inicial de TipTap — detectar como "vacío" para validación con `isTipTapContentEmpty()`
- **Image dedup en contenido bilingüe**: Extraer imágenes de ambos locales con `extractImagesFromContent()`, merge con `mergeUniqueImages()` deduplicando por `storagePath`. Guardar solo imágenes realmente referenciadas en `images[]`
- **JSON-LD XSS escape obligatorio**: Contenido de usuario (TipTap) embebido en `<script type="application/ld+json">` debe escapar secuencias `</` como `<\/` con `.replaceAll('</', '<\\/')`. Previene inyección de script tag dentro del JSON-LD inline
- **Slug uniqueness con `limit(2)`**: Queries de unicidad de slug usan `where('slug', '==', value), limit(2)` — no `limit(1)`. Detecta datos corruptos con slugs duplicados. Try-catch fail-closed para prevenir race conditions

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
- Props opcionales: `ogImage?: string | undefined`, `ogType?: string | undefined`, `ogDescription?: string | undefined`
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

#### TipTap Editor Integration (Epic 4)
- **Editor como controlled component**: `$effect` crea instancia TipTap keyed al elemento DOM. `onUpdate` callback emite `JSON.stringify(editor.getJSON())` al parent. Parent almacena JSON string en state
- **Toolbar pattern**: Todas las acciones siguen `getEditor()?.chain().focus().<action>().run()`. La API `.chain()` batchea actualizaciones DOM. Image insertion exportada como función pública para que `ImageUploadDialog` la invoque
- **Bilingual content tabs**: Ambos editores (ES/EN) siempre montados en DOM — visibilidad con `display:none`. Esto preserva el estado del editor al cambiar tabs. NUNCA desmontar/remontar editores por tab switch
- **Content rendering pipeline**: `TipTap JSON → renderTipTapToHtml() → sanitizeBlogHtml() → set:html`. Tres capas de seguridad: escapeHtml en renderer, sanitize-html whitelist, Astro `set:html`
- **Heading level fallback**: `Number(node.attrs?.level) || 2` — si level es NaN, fallback a h2. Clamp entre h1-h3 con `Math.min(Math.max(level, 1), 3)`

#### SortableJS Drag-Drop Pattern (Post-Epic 4)
- **DOM revert obligatorio en `onEnd`**: SortableJS manipula DOM directamente — DEBE revertirse manualmente antes de actualizar estado Svelte. Sin revert, Svelte haría double-update del DOM: `from.removeChild(item); from.insertBefore(item, from.children[oldIndex] ?? null)`
- **Instanciación en `$effect`**: Crear `Sortable.create(element)` cuando el elemento DOM existe. Retornar cleanup `() => sortableInstance?.destroy()`. Handle selector: `[data-drag-handle]`
- **Guard de reordering**: `$state` boolean `reordering` deshabilita Sortable durante persist con `sortableInstance?.option('disabled', reordering)`. En error, recargar datos del servidor
- **Persist con batch write**: `writeBatch(db)` para actualizar `order` field de todos los items en una operación atómica
- **Accessibility**: `aria-live="polite"` + `aria-atomic="true"` en elemento `sr-only` para anunciar movimientos a screen readers

#### Blog-Specific Patterns (Epic 4)
- **Triple schema pattern para blog**: `blogPostSchema` (runtime con id), `blogPostFirestoreSchema` (sin id, images default []), `blogPostFormSchema` (solo campos editables — excluye createdAt, updatedAt, images, coverImage)
- **Reading time**: Recursive text extraction de TipTap JSON → split whitespace → 200 WPM. Mínimo 1 minuto. Función `calculateReadingTime()` en `reading-time.ts`
- **OG description desde contenido**: Extraer texto plano de TipTap JSON, truncar a 157 chars con word boundary (`\s\S*$` regex para no cortar palabra), agregar `…`. Fallback a `post.title[locale]` si vacío
- **`ogType="article"`**: Blog articles pasan `ogType="article"` a BaseLayout para OpenGraph article-specific metadata. Cover image como og:image si existe
- **Status field (published/draft)**: Solo posts con `status: 'published'` aparecen en build-time queries. Admin puede toggle status
- **Slug regex**: `/^[a-z0-9]+(?:-[a-z0-9]+)*$/` — solo lowercase alphanumeric con hyphens, sin hyphens al inicio/final
- **`slugManuallyEdited` flag**: Auto-generation de slug se desactiva si el usuario editó manualmente. Se reactiva solo al limpiar el slug completo

#### Orphan Image Cleanup (Post-Epic 4)
- **Fire-and-forget pattern**: `cleanupOrphanedImages(images)` itera y llama `imageService.delete()` sin `await` — cada delete independiente con `.catch(console.warn)`. No bloquea operación del usuario
- **Session tracking en forms**: `savedSuccessfully`, `sessionInlineImages[]`, `sessionCoverImage` como plain `let` (no `$state`). Trackean imágenes subidas durante la sesión actual
- **Cleanup en unmount (abandonment)**: `$effect` cleanup cancela uploads activos + elimina TODAS las imágenes de sesión si `!savedSuccessfully`. Protege contra usuario que cierra form sin guardar
- **Cleanup en save failure retry**: Bloque `catch` limpia SOLO la cover image del intento fallido (inline images se mantienen para retry). Diferente de abandonment que limpia todo
- **Reset en edit re-initialization**: Cuando el form se reutiliza para otro item (sin remount), resetear todos los trackers para evitar deletes de imágenes del item anterior
- **BlogForm vs ProjectForm**: BlogForm trackea inline images separadamente (editor ya las muestra); ProjectForm solo trackea uploads durante submit. Diseños diferentes por flujo de UX diferente

#### Link & Image Dialogs (Blog Admin)
- **LinkDialog**: URL validation solo permite `http://`, `https://`, `mailto:`. Reusa dialog para crear y editar links. Botón remove solo en edit mode
- **ImageUploadDialog**: Estado como mini state machine — upload disabled hasta seleccionar archivo (`type === 'new'`). Path: `blog/{postId}/images/{uuid}.webp`. Alt text separado del slot state. Upload handle cancelable en unmount
- **`allowBase64: false`**: sanitize-html bloquea imágenes base64 en contenido — solo URLs de Firebase Storage permitidas

#### SEO & Structured Data (Epic 5)
- **JSON-LD por tipo de página**: Person schema en home, CreativeWork en project detail, BlogPosting en blog article. Listing pages (projects index, blog index, contact) NO llevan JSON-LD
- **OpenGraph siempre presente**: `resolveOgImage()` garantiza og:image en toda página — fallback a `/images/og-default.png`. Width/height solo en imagen default, omitidos en custom
- **`ogType` override**: Default `"website"` para páginas normales, `"article"` para blog posts. Pasar como prop a BaseLayout
- **Hreflang automático**: BaseLayout genera `<link rel="alternate" hreflang="en|es|x-default">` con URLs absolutas para ambos locales
- **Sitemap con filtro admin**: `@astrojs/sitemap` configurado con `filter: (page) => !page.includes('/admin')` + i18n locales
- **Preconnect obligatorio**: `<link rel="preconnect" href="https://firebasestorage.googleapis.com" />` en BaseLayout — SIN atributo `crossorigin` (viola fetch pool semantics para imágenes)

#### Performance Optimization (Epic 5)
- **Hydration directives selectivos**: `client:idle` para componentes no-críticos (ThemeToggle, LocaleToggle, ProjectFilter, MobileMenu). `client:load` solo para componentes que necesitan JS inmediatamente (AuthGuard). Reducción validada: 25.8KB JS en home
- **Imágenes con dimensiones explícitas**: TODAS las imágenes de Firebase Storage deben tener `width` y `height` HTML para prevenir CLS. Tech icons: `width="16" height="16"` en HTML, styling con `class="w-4 h-4"`
- **`fetchpriority="high"`**: Solo en imagen hero/principal de páginas detail (mainImage de projects, coverImage de blog). Resto usa `loading="lazy" decoding="async"`
- **Font preload via Astro Fonts API**: `display: 'swap'` obligatorio para prevenir FOIT. Pesos explícitos: Poppins 400/500/600/700, JetBrains Mono 400

#### Accessibility WCAG 2.1 AA (Epic 5)
- **Contraste theme-aware**: CSS variables con valores diferentes por tema. Dark: `--theme-text-muted: #8090A0` (5.0:1 vs superficie). Light: `--theme-text-muted: #6B7585` (4.73:1 vs white). NUNCA un solo valor para ambos modos
- **Skip navigation**: Primer elemento focusable debe ser skip nav con `href="#main"`. `<main id="main">` obligatorio en layout
- **`aria-live` para filtros dinámicos**: ProjectFilter anuncia resultados con `aria-live="polite" aria-atomic="true"` en región sr-only
- **`prefers-reduced-motion`**: Respetar `@media (prefers-reduced-motion: reduce)` — deshabilitar View Transitions y animaciones CSS
- **Focus visible obligatorio**: Todos los elementos interactivos deben tener `outline-style` visible en `:focus-visible`

#### Settings Collection Pattern (Post-Epic 5)
- **Documentos individuales en `Settings`**: Cada setting es un doc con ID descriptivo (ej: `resume`). Query directa por ID, no collection scan
- **`getResumeUrl()` como helper**: Funciones tipadas en `collections.ts` para cada setting — retornan `null` si no existe. Páginas públicas consumen en build-time via Admin SDK
- **Resilient upload state machine**: Upload → get URL → write Firestore → cleanup old file. Si Firestore falla → rollback Storage. Cleanup de archivo anterior es fire-and-forget con `.catch(console.warn)`
- **Storage path fijo para singleton**: `resume/current.pdf` — siempre sobreescribe. No UUID-based paths para archivos que son uno solo
- **Upload progress con cancelación**: `uploadBytesResumable` + `$state` para progress bar. Upload task cancelable en unmount y por botón. Distinguir cancel de usuario (silencioso) vs error real (toast)
- **Resume URL no hardcodeada**: Fetch dinámico desde Firestore — `{...(resumeUrl ? { resumeUrl } : {})}` spread condicional para props opcionales

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
- **E2E coverage admin**: Dashboard navigation, CRUD completo (create/edit/delete) para projects/technologies/experiences/blog, auth protection, image upload/replace, logout

#### Proceso de Testing (Lecciones Epics 3-4)
- **E2E DEBE fluir de test-design a story tasks**: El SM verifica test-design al crear stories y traduce casos E2E en tareas explícitas. Gap entre "doc dice testear" y "story dice implementar" = tests que nunca se escriben
- **Dev no marca 'done' sin E2E**: Todo story con UI incluye tareas E2E de sus acceptance criteria
- **Browser verification es Definition of Done**: Admin = E2E con Playwright. Público = E2E + Lighthouse CI
- **Tests substantivos, no cosméticos**: Verificar comportamiento observable con funciones reales o decision tables — NUNCA testear que un mock fue llamado sin verificar el resultado. Code review Epic 4 encontró tests tautológicos que verificaban mocks en lugar de lógica
- **E2E obligatorio en cada story con UI (reafirmado Epic 4)**: Resultado: E2E encontró bugs reales (timing, selectores ambiguos, `__dirname` ESM)
- **E2E con emuladores en CI**: Pipeline corre `firebase emulators:exec` con auth, firestore y storage para E2E admin. Auth setup persiste `storageState` en `.auth/admin.json`
- **E2E blog coverage**: Create post con TipTap content → verify in list → edit → toggle status → delete. Image upload dialog flow. Bilingual content switching
- **TipTap testing**: Verificar contenido via `editor.getJSON()` o assertions en el DOM renderizado — no mockear internals de TipTap. `toBeVisible({ timeout: 10_000 })` para esperar hydration
- **SortableJS testing**: E2E verifica order persiste después de drag. Verificar `aria-live` announcements
- **Orphan cleanup testing**: Unit tests con spy en `imageService.delete` — verificar cleanup en unmount sin `savedSuccessfully` y NO cleanup cuando `savedSuccessfully = true`

#### Lighthouse CI
- 2 matrices: páginas de proyecto (performance >= 0.7 warn) y resto (>= 0.95 error)
- Accessibility, Best Practices, SEO: siempre >= 0.95 error. Preset desktop

#### axe-core E2E (WCAG 2.1 AA) — Epic 5
- **Fixture custom `axe-test.ts`**: Extiende base test de Playwright con `makeAxeBuilder` pre-configurado con tags `['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']`
- **Filtro por severidad**: Solo fallar en violations con impact `critical` o `serious` — ignorar minor/moderate
- **Attachment de resultados**: JSON de violations adjunto al reporte Playwright para debugging
- **Cobertura axe**: Todas las páginas públicas deben tener test axe (home, projects, blog, contact, detail pages)

#### E2E Data Management — Epic 5
- **Global teardown automático**: `globalTeardown` en Playwright config ejecuta cleanup post-E2E sin intervención manual
- **Script `cleanup:e2e`**: Elimina docs Firestore + imágenes Storage con patrón `e2e-*` en slug. Dry-run por defecto (`--execute` para borrar)
- **Script `cleanup:images`**: Compara archivos Storage vs referencias Firestore, identifica orphans. Dry-run por defecto (`--execute` para borrar)
- **Tests idempotentes obligatorio**: Cada test E2E crea y limpia sus datos. Patrón slug: `e2e-{feature}-{timestamp}` para identificación

#### SEO E2E Validation — Epic 5
- **Sitemap testing**: Validar accesibilidad y contenido de sitemap-index.xml, sitemap-0.xml, robots.txt
- **JSON-LD verification**: Parsear `script[type="application/ld+json"]` y validar estructura del schema por tipo de página
- **Exclusión admin**: Tests verifican que rutas `/admin` NO aparecen en sitemap

#### Proceso de Testing (Lecciones Epics 3-5)
- **Tests de schemas con mocks de Firestore Timestamp**: Testear parsers de fecha con `{ toDate: () => new Date(...) }` para simular Timestamps. Cubrir los 4 formatos: Date, Timestamp mock, ISO string, number
- **Accessibility desde Epic 1**: axe-core WCAG debe integrarse desde el primer epic — detección tardía multiplica rework (contraste de colores descubierto en Epic 5 requirió cambio sistémico de CSS variables)
- **E2E contra producción requiere cleanup**: Sin scripts automáticos, datos orphan se acumulan (~20 docs + ~37 imágenes por epic). `globalTeardown` es infraestructura esencial

#### Comandos
- `pnpm test` (unit), `pnpm test:watch`, `pnpm test:coverage`, `pnpm test:e2e` (Playwright)
- `pnpm cleanup:e2e` (preview E2E data), `pnpm cleanup:e2e --execute` (borrar)
- `pnpm cleanup:images` (preview orphans), `pnpm cleanup:images --execute` (borrar)

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
├── components/blog/         # BlogCard.astro, BlogContent.astro
├── components/admin/        # + RichTextEditor.svelte, BlogForm.svelte, BlogList.svelte,
│                            #   ImageUploadDialog.svelte, LinkDialog.svelte
├── data/                    # Helpers de datos (navigation)
├── layouts/                 # Wrappers de página (BaseLayout, AdminLayout)
├── lib/firebase/            # SDKs client + admin + orphan-cleanup.ts, image-slot-processor.ts
├── lib/i18n/                # Traducciones y config
├── lib/schemas/             # Zod schemas (source of truth) + blog-post-schema.ts, resume-schema.ts
├── lib/types/               # Tipos derivados de schemas
├── lib/utils/               # Utilidades puras (formatDate, slugify, toast-store, error-messages,
│                            #   tiptap-renderer.ts, tiptap-helpers.ts, reading-time.ts,
│                            #   sanitize-blog-html.ts, seo.ts)
├── lib/scripts/             # Scripts de build/seed (migrate, seed) + cleanup (e2e, orphans)
├── pages/                   # File-based routing + robots.txt.ts (dynamic route)
├── pages/admin/             # Admin pages (index, login, projects, technologies, experiences, blog, resume)
├── pages/blog/              # Blog pages (index.astro, [slug].astro)
├── pages/es/blog/           # Blog pages ES (index.astro, [slug].astro)
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
- **Defense-in-depth para HTML dinámico**: Tres capas siempre: (1) escapeHtml en renderer, (2) sanitize-html whitelist, (3) Astro `set:html` solo con output sanitizado. NUNCA confiar en una sola capa
- **Specs validados contra código real**: Antes de crear story specs, verificar Firestore/código actual contra arquitectura. La realidad del código manda sobre el doc
- **No replicar defectos conocidos**: Si un patrón existente tiene un bug, NO copiarlo en componentes nuevos — corregir primero, luego implementar
- **Proactive bug fixing**: Cada story incluye auditoría proactiva más allá del spec — bugs pre-existentes se corrigen en contexto, no se acumulan. Epic 5 corrigió 7+ bugs heredados (favicon placeholder, dead nav links, orphaned E2E data, contrast failures, toast duplicates)

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
- `pnpm seed:blog` — seed de blog posts (requiere `.env` con credenciales Firebase)

#### Scripts de Mantenimiento (Epic 5)
- `pnpm cleanup:e2e [--execute]` — elimina docs Firestore + imágenes Storage con slug `e2e-*`. Preview por defecto
- `pnpm cleanup:images [--execute]` — compara Storage vs Firestore, identifica/elimina orphans. Preview por defecto
- **Dry-run como default**: Ambos scripts muestran preview sin borrar nada — requieren flag explícito `--execute` para operar. Previene eliminación accidental

#### Environment Variables
- `.env` (local, no committed) + `.env.example` (template, committed)
- CI/CD: GitHub Secrets para `FIREBASE_ADMIN_*` keys + `FIREBASE_CLIENT_CONFIG`
- `PUBLIC_*` = browser. Sin prefijo = solo build-time

#### Proceso de Desarrollo (Lecciones Retros Epics 3-5)
- **Verificar datos reales antes de escribir stories**: Arquitectura es un plan, no realidad. Siempre verificar Firestore/código actual contra spec antes de crear story spec
- **Decisiones estratégicas antes del epic, no durante**: Cambios como locale flip tocan 14+ archivos. Decidir en planning, no en implementación
- **Project context actualizado al cierre de cada epic**: ANTES de crear stories del siguiente epic. Context desactualizado bloquea a los agentes. Epic 4 necesitó actualización post-cierre para TipTap, SortableJS, orphan cleanup, y anti-patrones de `$effect`
- **Arquitectura pragmática**: JAMstack + Islands es correcto para portfolio. Clean Architecture sería sobre-ingeniería. Elegir mínima complejidad necesaria
- **Defer solo con plan concreto (reafirmado Epic 4)**: Epic 3 tuvo 10 defers sin plan → Epic 4 redujo a 1 defer con quick-dev programado. Si no hay story futura que lo resuelva → corregir en story actual
- **Tests substantivos (acuerdo Epic 4)**: Code review encontró tests tautológicos que verificaban mocks en vez de comportamiento real. Tests verifican lógica observable, no llamadas a mocks
- **Quick devs para mejoras post-epic**: Mejoras de UX (SortableJS ordering, orphan cleanup) se implementan como quick-dev entre épicas. No requieren story spec completo pero sí code review y E2E
- **Color contrast desde día 1**: Colores del design system deben validarse contra WCAG AA (4.5:1) en AMBOS temas antes de implementar. Detección tardía (Epic 5) requirió cambio sistémico de CSS variables en 5+ archivos
- **Specs no son exhaustivos**: SM crea specs desde documentación pero puede omitir componentes o malinterpretar APIs. Pre-spec code audit (enumerar archivos afectados) y code review validando completitud son prácticas estándar — 2-3 patches por story es normal

#### Code Review (3 Capas)
- **Capa 1 — Implementación**: Story ACs cumplidos, funcionalidad correcta
- **Capa 2 — Arquitectura**: Consistencia con schemas, error handling, patrones del proyecto
- **Capa 3 — Seguridad de producción**: Atomicidad, cleanup, error cases, a11y, memory leaks

#### Métricas de Calidad (Baseline Epics 4-5)
- Epic 4: Stories 5/5. Tests +323 (+284 unit, +39 E2E). Patches ~26. Defers 1. Bugs corregidos 3. Incidentes 0
- Epic 5: Stories 6/6. Tests +127 (+83 unit, +44 E2E). Patches ~26. Defers 1. Bugs corregidos 7+. Incidentes 0
- Totales acumulados: 1246 unit + 160 E2E tests. Bundle JS home: 25.8KB (budget <50KB)

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
- NUNCA generar slugs desde campos ES — el `defaultLocale` es `en`, las URLs públicas no tienen prefijo para inglés. Slugs siempre desde el campo EN
- NUNCA almacenar HTML de TipTap en Firestore — siempre JSON stringificado. El render es responsabilidad del frontend con pipeline seguro
- NUNCA renderizar TipTap JSON sin pasar por las 3 capas: escapeHtml → sanitize-html → `set:html`. Saltarse una capa = vector XSS
- NUNCA desmontar/remontar editores TipTap al cambiar tabs bilingües — usar `display:none` para preservar estado del editor
- NUNCA trackear con `$state` variables que solo se leen en cleanup de `$effect` — usar plain `let` para evitar re-ejecuciones reactivas innecesarias
- NUNCA dejar que SortableJS maneje el DOM sin revertir primero — Svelte debe ser el único que controla el DOM reactivo. Revertir con `removeChild` + `insertBefore` antes de actualizar state
- NUNCA usar `Promise.all` para batch deletes de imágenes orphan — fire-and-forget individual con `.catch(console.warn)` para no bloquear al usuario
- NUNCA confiar en que un spec refleja la realidad del código — verificar Firestore/codebase actual antes de implementar. Specs pueden tener bugs
- NUNCA copiar patrones de componentes existentes sin verificar que no tengan defectos conocidos — corregir primero, luego implementar
- NUNCA omitir `width` y `height` en imágenes de Firebase Storage — CLS penalty en Lighthouse y mala UX durante carga
- NUNCA agregar `crossorigin` a preconnect hints de Firebase Storage — viola fetch pool semantics para imágenes (no son CORS requests)
- NUNCA usar un solo valor de color para ambos temas (dark/light) — validar contraste WCAG AA (4.5:1) contra superficie de cada tema por separado
- NUNCA agregar JSON-LD a listing pages — solo en home (Person), project detail (CreativeWork) y blog article (BlogPosting)
- NUNCA ejecutar scripts de cleanup sin flag `--execute` — dry-run es el default por seguridad
- NUNCA usar `display="block"` en fonts — `display="swap"` obligatorio para prevenir FOIT
- NUNCA hardcodear URL de resume en componentes — siempre fetch dinámico desde Firestore Settings collection
- NUNCA usar UUID-based paths para archivos singleton en Storage — usar path fijo (`resume/current.pdf`) que sobreescribe

#### Defer Criteria (Post-Retros Epics 3-4)
- **Defer SOLO con plan concreto**: Si code review encuentra defecto y no hay story futura planeada → corregir en story actual. "Pre-existente" sin plan = se resuelve ahora
- **Riesgo de replicación**: Un defecto deferido se replicó a 4 archivos porque devs siguieron "el patrón existente". Deferir sin resolver = deuda técnica exponencial
- **No defect replication**: Si el patrón actual tiene un defecto conocido, NO replicarlo en nuevos componentes — corregir primero

#### Casos Especiales
- **Blog HTML sanitization**: HTML de TipTap almacenado en Firestore DEBE sanitizarse con `sanitize-html` en build time al renderizar con `set:html`
- **StoredImage vs ImageSlot**: `StoredImage` = modelo Firestore (url, storagePath). `ImageSlot` = estado UI (discriminated union: empty/existing/new/replaced/removed). Nunca mezclar
- **Bilingüe obligatorio**: Todo contenido visible al usuario debe existir en EN y ES — campos Firestore Y strings de UI
- **transition:persist**: Componentes que sobreviven navegación — registrar cleanup de listeners en `$effect` return, escuchar `astro:after-swap` para re-sync
- **Firebase singleton**: Client SDK con `getApps().length === 0` check — nunca crear múltiples instancias
- **Form init guard en edit mode**: `initialized` + `initializedForId` flags para prevenir loops infinitos de `$effect` al recibir `initialData` como prop
- **Dates timezone**: `new Date(value + 'T00:00:00')` para interpretar como medianoche local, no UTC
- **Rollback best-effort**: Si create doc OK pero upload falla → intentar `deleteDoc`. Si rollback falla → log + orphan aceptable. No silenciar, no crashear
- **MAX_SCREENSHOTS=10**: Validación en UI (botón disabled) + validación en schema. Ambas necesarias
- **BilingualField idPrefix**: Cada instancia necesita `idPrefix` único para IDs de input consistentes y accesibles
- **Blog content bilateral tracking**: `uploadedImages` (todas, incluye pre-existentes) vs `sessionInlineImages` (solo nuevas de esta sesión). Son listas diferentes con propósitos diferentes — no mezclar
- **Cleanup abandonment vs retry**: Abandonment (unmount) limpia TODAS las imágenes de sesión. Save failure retry limpia SOLO la cover image del intento fallido — inline images se mantienen porque el editor las referencia
- **Edit re-init reset**: Cuando form se reutiliza para otro item sin remount, resetear `savedSuccessfully`, `sessionInlineImages`, `sessionCoverImage` en el bloque `$effect.pre` de inicialización. Sin reset = cleanup borra imágenes del item anterior
- **TipTap `createSubscriber` bridge**: Idempotente — llamar `subscribe()` dentro de `getEditor()` registra dependencia reactiva sin duplicar. Es el patrón oficial Svelte 5 para integrar event systems externos
- **`$effect` vs `$effect.pre` en forms**: `$effect.pre` para inicialización de form data (corre antes del render). `$effect` regular para side effects como auto-slug. Orden importa para evitar flicker
- **OG description word boundary**: Truncar a 157 chars, luego `replace(/\s\S*$/, '')` para no cortar a mitad de palabra. Si regex deja string vacío (palabra única >157 chars), usar slice crudo. Fallback a título si no hay texto
- **SortableJS `ghostClass` y `chosenClass`**: Clases de Tailwind aplicadas por Sortable directamente — deben existir en el contexto CSS. `opacity-50` para ghost, `border-primary` para chosen
- **`allowBase64: false` en sanitize-html**: Bloquea imágenes base64 inline — solo URLs de Firebase Storage. Previene inyección de contenido pesado y bypasses de CSP
- **`resolveOgImage()` centralizado**: Toda página pasa por esta función para garantizar og:image. Default: `/images/og-default.png` con width/height. Custom: sin dimensiones (pueden variar)
- **JSON-LD escape en BaseLayout**: `.replaceAll('</', '<\\/')` antes de inyectar JSON-LD en `<script>` tag — defense-in-depth contra XSS de contenido CMS
- **Slug uniqueness query pattern**: `where('slug', '==', value), limit(2)` + try-catch fail-closed. `limit(2)` detecta duplicados corruptos; `limit(1)` los ignora silenciosamente
- **Settings como documentos individuales**: Collection `Settings` con doc ID como key (`resume`, etc.). No usar sub-collections ni un mega-documento. Cada setting tiene su propio schema Zod y parser
- **Rollback en upload multi-step**: Si upload a Storage OK pero Firestore falla → rollback con `deleteObject()`. Si rollback falla → log + orphan aceptable (mismo patrón que Image Lifecycle)
- **Cancel vs Error en uploads**: `storage/canceled` es acción del usuario → silenciar. Cualquier otro error → toast. Distinguir en el catch
- **axe-core solo critical/serious**: Fixture filtra violations por `impact` — `critical` y `serious` fallan el test, `minor` y `moderate` se ignoran para evitar false positives
- **Toast deduplication**: `toastStore` previene duplicados verificando mensaje existente antes de agregar. Sin esto, errores de red generan floods de toasts idénticos
- **E2E cleanup como infraestructura**: `globalTeardown` en Playwright ejecuta `cleanup:e2e` automáticamente. Sin esto, ~20 docs + ~37 imágenes orphan por epic en Firestore/Storage

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

Última actualización: 2026-03-28
