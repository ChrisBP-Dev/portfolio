# Story 3.2: Admin Dashboard y Sidebar Navigation

Status: done

## Story

As Christopher (admin),
I want a clear dashboard and navigation sidebar,
So that I can see content overview and navigate to any section intuitively after months without using the admin.

## Acceptance Criteria (AC)

1. **Dashboard con contadores** — Al autenticarse y cargar `/admin`, el dashboard muestra section cards con contadores reales de Firestore: Projects (N), Technologies (N), Experiences (N), Blog (N).
2. **AdminSidebar desktop** — Sidebar de 250px fija a la izquierda, fondo `surface`, items con icono + label (Dashboard, Projects, Technologies, Experiences, Blog, Logout), sección activa highlighted con `primary/10%` background.
3. **AdminSidebar mobile** — Sidebar es un drawer retráctil con botón toggle (hamburger).
4. **AdminSidebar tablet** — Sidebar colapsa a icon-only, se expande al hover/click.
5. **Navegación funcional** — Click en section card o sidebar item navega a la página CRUD correspondiente (las páginas CRUD son placeholder por ahora — se implementan en stories 3.4–3.8).
6. **Breadcrumb** — Header del content area muestra breadcrumb (Admin > [Sección actual]).

**(UX-DR17, UX-DR31, UX-DR46)**

## BDD Scenarios

### Scenario 1: Dashboard carga con contadores
```gherkin
Given estoy autenticado en /admin
When la página carga completamente
Then veo 4 section cards: Projects, Technologies, Experiences, Blog
And cada card muestra un contador numérico obtenido de Firestore
And cada card tiene un icono representativo
```

### Scenario 2: Sidebar visible en desktop
```gherkin
Given estoy en /admin en desktop (>900px)
When la página carga
Then veo sidebar de 250px fija a la izquierda con fondo surface
And veo items: Dashboard, Projects, Technologies, Experiences, Blog, Logout
And cada item tiene icono + label
And "Dashboard" está highlighted como sección activa
```

### Scenario 3: Sidebar responsive en mobile
```gherkin
Given estoy en /admin en mobile (<450px)
When la página carga
Then la sidebar NO es visible por defecto
And veo un botón hamburger en el header
When hago click en el hamburger
Then la sidebar aparece como drawer overlay
And el foco queda atrapado dentro del drawer (focus trap)
When hago click fuera, en un item, o presiono Escape
Then la sidebar se cierra
And el foco regresa al botón hamburger
```

### Scenario 4: Sidebar responsive en tablet
```gherkin
Given estoy en /admin en tablet (450-900px)
When la página carga
Then veo sidebar colapsada (solo iconos, sin labels)
When hago hover o click en la sidebar
Then se expande mostrando iconos + labels
```

### Scenario 5: Navegación desde dashboard card
```gherkin
Given estoy en /admin (dashboard)
When hago click en la card "Projects"
Then navego a /admin/projects
And la sidebar marca "Projects" como activo
And el breadcrumb muestra "Admin > Projects"
```

### Scenario 6: Navegación desde sidebar
```gherkin
Given estoy en cualquier página /admin/*
When hago click en "Technologies" en la sidebar
Then navego a /admin/technologies
And "Technologies" se marca como activo en la sidebar
And el breadcrumb se actualiza a "Admin > Technologies"
```

### Scenario 7: Logout desde sidebar
```gherkin
Given estoy autenticado en cualquier página /admin/*
When hago click en "Logout" en la sidebar
Then mi sesión se cierra (signOut)
And soy redirigido a /admin/login
```

### Scenario 8: Breadcrumb en content area
```gherkin
Given estoy en /admin/projects
Then el header del content area muestra "Admin > Projects"
And "Admin" es un link clickable que navega a /admin
```

## Tasks / Subtasks

- [x] Task 1: Crear AdminSidebar.svelte (AC: 2, 3, 4, 7)
  - [x] 1.1 Crear `src/components/admin/AdminSidebar.svelte`
  - [x] 1.2 Props: `currentPath: string` (para determinar item activo)
  - [x] 1.3 Nav items array: Dashboard (`/admin`), Projects (`/admin/projects`), Technologies (`/admin/technologies`), Experiences (`/admin/experiences`), Blog (`/admin/blog`), Logout (acción)
  - [x] 1.4 Cada item: icono SVG inline + label de texto
  - [x] 1.5 Item activo: `bg-primary/10` (fondo con opacidad del primary)
  - [x] 1.6 Desktop (>900px / `lg:`): sidebar visible 250px, items con icono + label
  - [x] 1.7 Tablet (450-900px / `sm:` a `lg:`): sidebar colapsada ~64px (solo iconos), expand on hover con transición
  - [x] 1.8 Mobile (<450px): sidebar oculta por defecto, toggle button muestra drawer overlay con backdrop
  - [x] 1.9 Logout item: al click ejecuta `signOut(auth)` con try/catch y redirige a `/admin/login` (si signOut falla, redirigir de todas formas)
  - [x] 1.10 Accessibility: `<nav aria-label="Admin navigation">`, `aria-current="page"` en item activo, `aria-expanded` en mobile toggle
  - [x] 1.11 Mobile drawer: focus trap (atrapar Tab dentro del drawer), Escape cierra el drawer, al cerrar devolver foco al botón hamburger
  - [x] 1.12 Transiciones sidebar (hover expand tablet, drawer mobile): respetar `prefers-reduced-motion: reduce` — sin animaciones si el usuario lo prefiere

- [x] Task 2: Crear AdminDashboard.svelte (AC: 1, 5)
  - [x] 2.1 Crear `src/components/admin/AdminDashboard.svelte`
  - [x] 2.2 Al montar, obtener contadores de las 4 colecciones via `getCountFromServer` del client SDK
  - [x] 2.3 Mostrar 4 section cards en grid responsive (1 col mobile, 2 cols tablet, 2 o 4 cols desktop)
  - [x] 2.4 Cada card: icono, nombre de sección, contador numérico, clickable para navegar
  - [x] 2.5 Estado loading: skeleton cards (4 cards con pulso gris) mientras se cargan los contadores
  - [x] 2.6 Estado error: si falla la consulta, mostrar contador como "—" y no bloquear la UI
  - [x] 2.7 Navegación via `window.location.href` (full page load — no View Transitions en admin)

- [x] Task 3: Crear AdminBreadcrumb.astro (AC: 6)
  - [x] 3.1 Crear `src/components/admin/AdminBreadcrumb.astro` — componente Astro puro (zero JS al browser, no necesita interactividad)
  - [x] 3.2 Props: `currentPath: string`
  - [x] 3.3 Parsear `currentPath` para generar segmentos: "Admin" siempre primero (link a `/admin`), luego sección actual
  - [x] 3.4 Mapeo de paths a labels: `/admin` → "Dashboard", `/admin/projects` → "Projects", etc. Usar `t()` con locale `'es'` para labels
  - [x] 3.5 Accessibility: `<nav aria-label="Breadcrumb">`, `<ol>` semántico con `aria-current="page"` en último item
  - [x] 3.6 Separador visual entre segmentos (chevron `>` o `/`)
  - [x] 3.7 Exportar función de parseo `getBreadcrumbSegments(path)` para poder testearla unitariamente

- [x] Task 4: Actualizar AdminLayout.astro (AC: 2, 3, 4, 6)
  - [x] 4.1 Reemplazar el `<aside>` placeholder (`<!-- sidebar — story 3.2 -->`) con `AdminSidebar` real
  - [x] 4.2 Agregar `AdminBreadcrumb` (componente Astro) en el header del content area (dentro de `<main>`)
  - [x] 4.3 Pasar `currentPath` desde `Astro.url.pathname` a AdminSidebar (Svelte, `client:only`) y AdminBreadcrumb (Astro, sin directive)
  - [x] 4.4 AdminSidebar usa `client:only="svelte"` (requiere Firebase Auth para logout)
  - [x] 4.5 AdminBreadcrumb es componente Astro puro — NO necesita hydration directive (zero JS)
  - [x] 4.6 Mantener `showSidebar={false}` para login page (ya funciona)
  - [x] 4.7 El `<main>` necesita margin-left responsive para acomodar el sidebar: `sm:ml-16 lg:ml-64` (match sidebar widths). Sin margin en mobile (sidebar es overlay)

- [x] Task 5: Actualizar admin/index.astro (AC: 1)
  - [x] 5.1 Reemplazar el contenido placeholder (título + logout button) con `AdminDashboard` component
  - [x] 5.2 AdminDashboard montado dentro de AuthGuard con `client:only="svelte"`
  - [x] 5.3 Remover el botón logout inline (ahora vive en AdminSidebar)
  - [x] 5.4 Remover el `<script>` de logout (ahora vive en AdminSidebar)

- [x] Task 6: Crear páginas admin placeholder (AC: 5)
  - [x] 6.1 Crear `src/pages/admin/projects.astro` — placeholder con AuthGuard + texto "Projects — próximamente"
  - [x] 6.2 Crear `src/pages/admin/technologies.astro` — placeholder con AuthGuard + texto "Technologies — próximamente"
  - [x] 6.3 Crear `src/pages/admin/experiences.astro` — placeholder con AuthGuard + texto "Experiences — próximamente"
  - [x] 6.4 Crear `src/pages/admin/blog.astro` — placeholder con AuthGuard + texto "Blog — próximamente"
  - [x] 6.5 Todas usan `AdminLayout` con `showSidebar={true}` (default)
  - [x] 6.6 Todas incluyen AuthGuard con `client:only="svelte"`

- [x] Task 7: Agregar translation keys (AC: 1, 2, 6)
  - [x] 7.1 Agregar keys a `src/lib/i18n/translations.ts`:
    - `admin.sidebar.dashboard`: "Dashboard" / "Dashboard"
    - `admin.sidebar.projects`: "Proyectos" / "Projects"
    - `admin.sidebar.technologies`: "Tecnologías" / "Technologies"
    - `admin.sidebar.experiences`: "Experiencias" / "Experiences"
    - `admin.sidebar.blog`: "Blog" / "Blog"
    - `admin.sidebar.toggle`: "Abrir menú" / "Open menu"
    - `admin.dashboard.projects`: "Proyectos" / "Projects"
    - `admin.dashboard.technologies`: "Tecnologías" / "Technologies"
    - `admin.dashboard.experiences`: "Experiencias" / "Experiences"
    - `admin.dashboard.blog`: "Blog" / "Blog"
    - `admin.breadcrumb.admin`: "Admin" / "Admin"
    - `admin.placeholder.comingSoon`: "Próximamente" / "Coming soon"
  - [x] 7.2 NOTA: Admin usa locale fijo `'es'` (Christopher es hispanohablante)

- [x] Task 8: Tests unitarios (AC: 1, 6)
  - [x] 8.1 Crear `src/components/admin/__tests__/admin-breadcrumb.test.ts` — test de la función de parseo `getBreadcrumbSegments()` exportada desde AdminBreadcrumb.astro (o extraída a un util)
  - [x] 8.2 Verificar que paths correctos producen labels correctos
  - [x] 8.3 Verificar path edge cases: `/admin`, `/admin/projects`, `/admin/`, paths inválidos, trailing slashes

- [x] Task 9: Validación pipeline (todos los ACs)
  - [x] 9.1 `pnpm lint` — sin errores
  - [x] 9.2 `pnpm type-check` — sin errores TypeScript
  - [x] 9.3 `pnpm build` — build exitoso (nuevas páginas admin se generan correctamente)
  - [x] 9.4 `pnpm test` — todos los tests pasan
  - [x] 9.5 Verificar manualmente: sidebar visible, navegación funciona, contadores cargan, responsive correcto

## Dev Notes

### PREREQUISITO: Leer Project Context

**ANTES de implementar**, leer `_bmad-output/project-context.md` — contiene las 68 reglas del proyecto (TypeScript strictest, Svelte 5 runes, imports relativos sin aliases, naming conventions, anti-patrones prohibidos, etc.). Todas las reglas aplican a esta story.

### Patrón Client-Only en Admin

Todos los componentes Svelte en admin usan `client:only="svelte"` (NO `client:load`). Razón: Firebase Auth imports no pueden ejecutarse en SSR/SSG. `client:only` skipea completamente el render en server y solo ejecuta en browser.

```astro
<!-- ✅ CORRECTO para admin -->
<AdminSidebar client:only="svelte" currentPath={Astro.url.pathname} />
<AuthGuard client:only="svelte">
  <AdminDashboard client:only="svelte" />
</AuthGuard>

<!-- ❌ INCORRECTO — causará error de import en SSR -->
<AdminSidebar client:load currentPath={Astro.url.pathname} />
```

**IMPORTANTE**: Cuando un componente Svelte usa `client:only`, los props se serializan como strings. Asegurarse de que los props sean serializables (strings, numbers, booleans — no funciones ni objetos complejos).

### Contadores del Dashboard — `getCountFromServer`

Usar `getCountFromServer` de Firebase Client SDK para obtener counts sin descargar documentos. Ver sección "AdminDashboard — Svelte 5 Component Structure" para el código completo.

**CRÍTICO — NO importar** desde `src/lib/firebase/collections.ts` — ese archivo tiene imports de `firebase-admin/firestore` que causan side-effects fatales en browser. Usar constantes locales:

```typescript
// Constantes locales — NO importar de collections.ts (tiene side-effects de Admin SDK)
const COLLECTIONS = {
  projects: 'Projects',
  technologies: 'Technologies',
  experiences: 'Experiences',
  blogPosts: 'BlogPosts',
} as const;
```

### AdminSidebar — Iconos SVG Inline

Usar SVGs inline simples para los iconos de la sidebar. NO agregar dependencias de icon libraries (lucide-react, heroicons, etc.). SVGs inline son zero-dependency y Svelte los renderiza eficientemente.

Iconos sugeridos (SVGs simples):
- **Dashboard**: grid/cuadrícula (4 cuadrados)
- **Projects**: folder/carpeta
- **Technologies**: code/código (`</>`)
- **Experiences**: briefcase/maletín
- **Blog**: document/documento con texto
- **Logout**: arrow-right-from-bracket / flecha saliendo

Ejemplo de icono inline:
```svelte
<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <rect x="3" y="3" width="7" height="7"></rect>
  <rect x="14" y="3" width="7" height="7"></rect>
  <rect x="3" y="14" width="7" height="7"></rect>
  <rect x="14" y="14" width="7" height="7"></rect>
</svg>
```

### AdminSidebar — Responsive Strategy

Usar clases Tailwind con breakpoints custom del proyecto (`sm: 450px`, `lg: 900px`):

```svelte
<!-- Desktop: sidebar visible completa -->
<!-- Tablet: sidebar icon-only (64px), expand on hover -->
<!-- Mobile: sidebar oculta, toggle button visible -->

<nav class="hidden sm:flex sm:w-16 lg:w-64 ...">
  <!-- Sidebar content -->
</nav>

<!-- Mobile hamburger button — solo visible < sm -->
<button class="sm:hidden ...">☰</button>

<!-- Mobile drawer overlay -->
{#if mobileOpen}
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div class="fixed inset-0 z-50 sm:hidden" onkeydown={handleKeydown}>
    <div class="absolute inset-0 bg-black/50" onclick={() => closeMobileDrawer()}></div>
    <nav class="relative w-64 h-full bg-surface" role="dialog" aria-modal="true" aria-label="Admin navigation">
      <!-- Full sidebar content -->
      <!-- Focus trap: first/last focusable elements cycle -->
    </nav>
  </div>
{/if}

<!-- Focus trap + Escape handler -->
<!-- function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') closeMobileDrawer();
  if (e.key === 'Tab') { /* trap focus within drawer */ }
} -->
<!-- function closeMobileDrawer() { mobileOpen = false; hamburgerButton.focus(); } -->
```

### AdminSidebar — Determinar Item Activo

Comparar `currentPath` con los paths de cada nav item:

```typescript
function isActive(itemPath: string, currentPath: string): boolean {
  if (itemPath === '/admin') return currentPath === '/admin' || currentPath === '/admin/';
  return currentPath.startsWith(itemPath);
}
```

### AdminLayout — Estructura Objetivo

```
┌─────────────────────────────────────────────┐
│  AdminSidebar  │  Breadcrumb: Admin > ...   │
│  (250px fixed) │                            │
│                │  Content Area               │
│  Dashboard     │  (AuthGuard + page content) │
│  Projects      │                            │
│  Technologies  │                            │
│  Experiences   │                            │
│  Blog          │                            │
│  ─────────     │                            │
│  Logout        │                            │
└─────────────────────────────────────────────┘
```

La sidebar está FUERA del AuthGuard — no necesita auth check (solo muestra nav links). Sin embargo, la acción de Logout SÍ necesita Firebase Auth para `signOut()`. Por eso la sidebar es `client:only="svelte"`.

### AdminLayout — Cambios Requeridos

El AdminLayout.astro actual tiene este placeholder:
```astro
{showSidebar && (
  <aside class="w-64 bg-surface border-r border-border min-h-screen">
    <!-- sidebar — story 3.2 -->
  </aside>
)}
```

Reemplazar el `<aside>` completo con:
```astro
{showSidebar && (
  <AdminSidebar client:only="svelte" currentPath={Astro.url.pathname} />
)}
```

El `<aside>` landmark ahora vive DENTRO de AdminSidebar.svelte (es el componente quien decide la estructura HTML semántica).

Agregar breadcrumb al inicio del `<main>` y margin-left responsive:
```astro
<main class={`flex-1 ${showSidebar ? 'sm:ml-16 lg:ml-64' : ''}`}>
  {showSidebar && (
    <AdminBreadcrumb currentPath={Astro.url.pathname} />
  )}
  <slot />
</main>
```

**NOTA**: AdminBreadcrumb es componente Astro puro — NO necesita `client:only` ni ningún hydration directive. Se renderiza en build time con zero JS.

### Páginas Admin Placeholder — Pattern Consistente

Todas las páginas CRUD placeholder siguen el mismo pattern:

```astro
---
import AdminLayout from '../../layouts/AdminLayout.astro';
import AuthGuard from '../../components/admin/AuthGuard.svelte';
import { t } from '../../lib/i18n/translations';

const locale = 'es';
---

<AdminLayout title="Projects — Admin ChrisBP">
  <AuthGuard client:only="svelte">
    <div class="p-8">
      <h1 class="text-2xl font-bold text-text-primary">
        {t('admin.sidebar.projects', locale)}
      </h1>
      <p class="mt-2 text-text-secondary">
        {t('admin.placeholder.comingSoon', locale)}
      </p>
    </div>
  </AuthGuard>
</AdminLayout>
```

### Dashboard Cards — Estilo Visual

Cards con:
- Fondo `surface`, borde `border`, `rounded-lg`, hover con `shadow` y `border-primary/30`
- Icono en la parte superior (color `text-secondary`, tamaño 24-32px)
- Nombre de sección en `heading-3` weight
- Contador grande en `heading-1` o `display` weight
- Cursor pointer, transición suave en hover
- Grid responsive: `grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6`

### Svelte 5 — Recordatorio de Syntax

```svelte
// ✅ Svelte 5 (CORRECTO)
let count = $state(0);
let doubled = $derived(count * 2);
let { children }: { children: Snippet } = $props();
{@render children()}
<button onclick={handleClick}>

// ❌ Svelte 4 (PROHIBIDO)
export let count = 0;
$: doubled = count * 2;
<slot />
<button on:click={handleClick}>
```

### AdminDashboard — Svelte 5 Component Structure

```svelte
<script lang="ts">
  import { collection, getCountFromServer } from 'firebase/firestore';
  import { db } from '../../lib/firebase/client';
  import { t } from '../../lib/i18n/translations';

  const locale = 'es';

  // Collection count state
  let projectCount = $state<number | null>(null);
  let technologyCount = $state<number | null>(null);
  let experienceCount = $state<number | null>(null);
  let blogCount = $state<number | null>(null);
  let loading = $state(true);

  $effect(() => {
    loadCounts();
  });

  async function loadCounts() {
    loading = true;
    try {
      const [projects, technologies, experiences, blog] = await Promise.all([
        getCountFromServer(collection(db, 'Projects')),
        getCountFromServer(collection(db, 'Technologies')),
        getCountFromServer(collection(db, 'Experiences')),
        getCountFromServer(collection(db, 'BlogPosts')),
      ]);
      projectCount = projects.data().count;
      technologyCount = technologies.data().count;
      experienceCount = experiences.data().count;
      blogCount = blog.data().count;
    } catch {
      // Leave counts as null — UI shows "—"
    } finally {
      loading = false;
    }
  }
</script>
```

### Accesibilidad

- AdminSidebar: `<nav aria-label="Admin navigation">`, items son `<a>` semánticos
- Item activo: `aria-current="page"`
- Mobile toggle: `aria-expanded`, `aria-controls="admin-sidebar-drawer"`
- Mobile drawer: **focus trap** obligatorio (Tab cicla dentro del drawer), **Escape** cierra el drawer, al cerrar devolver foco al botón hamburger
- Breadcrumb: `<nav aria-label="Breadcrumb">` con `<ol>` semántico
- Dashboard cards: `<a>` links (más semántico que buttons para navegación)
- Skeleton loading: `aria-busy="true"` en el grid durante carga
- Foco visible: usar `focus-visible:ring-2 focus-visible:ring-primary` (NO `focus:` — evita outline en clicks de mouse, solo muestra en navegación por teclado)
- Sidebar Logout: no es `<a>` (no navega), es `<button>` con icono
- Transiciones: respetar `prefers-reduced-motion: reduce` — envolver animaciones de sidebar (hover expand en tablet, slide del drawer mobile) con `@media (prefers-reduced-motion: reduce)` para desactivarlas

### Archivos Existentes — NO Modificar (excepto los listados en "Archivos a Modificar")

| Archivo | Por qué no tocar |
|---------|-----------------|
| `src/lib/firebase/client.ts` | Ya exporta `auth`, `db`, `storage` — listo para usar |
| `src/lib/firebase/collections.ts` | Admin SDK only — no importar funciones en client code |
| `src/components/admin/LoginForm.svelte` | Funcionalidad completa de story 3.1 |
| `src/components/admin/AuthGuard.svelte` | Funcionalidad completa de story 3.1 |
| `src/pages/admin/login.astro` | Ya usa `showSidebar={false}` — no necesita cambios |

### Archivos a Crear

| Archivo | Propósito |
|---------|----------|
| `src/components/admin/AdminSidebar.svelte` | Sidebar con navegación, icons, responsive, logout |
| `src/components/admin/AdminDashboard.svelte` | Dashboard con section cards y contadores de Firestore |
| `src/components/admin/AdminBreadcrumb.astro` | Breadcrumb para content area header (Astro puro, zero JS) |
| `src/pages/admin/projects.astro` | Placeholder CRUD Projects |
| `src/pages/admin/technologies.astro` | Placeholder CRUD Technologies |
| `src/pages/admin/experiences.astro` | Placeholder CRUD Experiences |
| `src/pages/admin/blog.astro` | Placeholder CRUD Blog |
| `src/components/admin/__tests__/admin-breadcrumb.test.ts` | Tests de lógica breadcrumb |

### Archivos a Modificar

| Archivo | Cambio |
|---------|--------|
| `src/layouts/AdminLayout.astro` | Reemplazar sidebar placeholder con AdminSidebar, agregar AdminBreadcrumb en content area |
| `src/pages/admin/index.astro` | Reemplazar placeholder con AdminDashboard, remover logout button inline |
| `src/lib/i18n/translations.ts` | Agregar ~12 keys para sidebar, dashboard, breadcrumb, placeholders |

### Lighthouse CI — Nota sobre Admin Pages

Las páginas admin están excluidas del Lighthouse CI scan (ver `lighthouserc.cjs`). No preocuparse por los scores de Lighthouse para las nuevas páginas admin.

### Project Structure Notes

- Admin pages van en `src/pages/admin/` (sin i18n — no `/es/admin/`)
- Admin components van en `src/components/admin/`
- Tests co-locados en `__tests__/` junto al código que testean
- Naming: kebab-case para archivos, PascalCase para componentes Svelte

### Previous Story Intelligence (Story 3.1)

**Aprendizajes clave de story 3.1 que aplican aquí:**

1. **`client:only="svelte"` es OBLIGATORIO** para todo componente admin que importa Firebase. `client:load` causa error de SSR porque Firebase Auth necesita `window`. Story 3.1 descubrió esto y lo corrigió (commit `41a679c`).

2. **Event delegation para acciones en Astro pages**: Story 3.1 usó `document.addEventListener('click', ...)` con `target.closest('#logout-btn')` para manejar clicks en elementos dentro de Svelte islands desde scripts Astro. Sin embargo, para story 3.2 el logout se mueve a AdminSidebar.svelte donde se puede manejar directamente con `onclick` de Svelte.

3. **`signOut` debe tener try/catch**: El logout de story 3.1 fue corregido en code review para usar try/catch en `signOut(auth)`. **Comportamiento en error**: si `signOut` falla, redirigir a `/admin/login` de todas formas (no bloquear al usuario en una página admin sin sesión funcional).

4. **Traducción keys con `t()` siempre**: Story 3.1 code review corrigió strings hardcodeados en español por calls a `t()`. Aplicar consistentemente.

5. **`SubmitEvent` global en ESLint**: Story 3.1 agregó `SubmitEvent` a ESLint globals para archivos Svelte — si necesitas otros DOM globals, agregar ahí.

6. **Firestore Security Rules ya actualizadas**: Read público, write solo admin UID — los `getCountFromServer` del dashboard funcionarán sin auth (read público).

### Git Intelligence

Commits recientes relevantes:
- `aaa56ed` — Code review patches: seguridad, UX, consistencia
- `41a679c` — Fix: `client:only` para admin components (descubrimiento crítico SSR)
- `d7587af` — Implementación de story 3.1 completa

Patrón de commits: prefijo semántico en inglés (`feat:`, `fix:`, `docs:`).

### References

- [Source: _bmad-output/planning-artifacts/epics.md — Epic 3, Story 3.2]
- [Source: _bmad-output/planning-artifacts/architecture.md — Admin Panel Architecture, Component Strategy, Layout System]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md — Journey 2 Admin Flow, Sidebar Spec, Dashboard Counters, Responsive Breakpoints, Navigation Patterns, Accessibility]
- [Source: _bmad-output/planning-artifacts/prd.md — UX-DR17, UX-DR31, UX-DR46]
- [Source: _bmad-output/project-context.md — Firebase Dual SDK Pattern, Svelte 5 Runes, Breakpoints, Anti-Patrones]
- [Source: _bmad-output/implementation-artifacts/3-1-autenticacion-y-proteccion-de-rutas.md — Dev Notes, Code Review Patches, client:only discovery]

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (1M context)

### Debug Log References

- Fixed breadcrumb bug: unknown paths caused `isCurrent: false` on Admin segment because initial value was based on path equality rather than being the default.
- Fixed ESLint errors: added `requestAnimationFrame` to Svelte globals, added keyed `{#each}` blocks.

### Completion Notes List

- AdminSidebar: Responsive sidebar with desktop (250px full), tablet (64px icon-only), mobile (drawer overlay with focus trap). Logout via signOut with try/catch. All accessibility attributes implemented.
- AdminDashboard: 4 section cards with Firestore `getCountFromServer` counters, skeleton loading, error resilience ("—" on failure), responsive grid.
- AdminBreadcrumb: Zero-JS Astro component with `<nav aria-label="Breadcrumb">`, semantic `<ol>`, `aria-current="page"`. Logic extracted to `breadcrumb-utils.ts` for testability.
- AdminLayout: Replaced sidebar placeholder with real AdminSidebar (`client:only="svelte"`), added AdminBreadcrumb (Astro pure), responsive margin-left on `<main>`.
- admin/index.astro: Replaced placeholder content with AdminDashboard, removed inline logout button and script.
- 4 admin placeholder pages created (projects, technologies, experiences, blog) with AuthGuard.
- 12 translation keys added for sidebar, dashboard, breadcrumb, and placeholders.
- 9 unit tests for `getBreadcrumbSegments()` covering all paths, trailing slashes, and edge cases.
- All validations pass: lint (0 errors), type-check (0 errors), test (383 passed), build (24 pages).

### Change Log

- 2026-03-20: Story 3.2 implementation complete — all 9 tasks done.
- 2026-03-20: Code review patches (5 fixes):
  - P1 [HIGH] Tablet sidebar expand on hover — added `group`, `sm:hover:w-64`, `group-hover:inline` for labels, `overflow-x-hidden` for clipping during transition (AC4 compliance)
  - P2 [MEDIUM] Removed `preventDefault` + `navigateTo` from `<a>` links — let native `<a href>` handle full-page navigation, preserves middle-click/right-click behavior
  - P3 [MEDIUM] Fixed `isActive` prefix overlap — changed `startsWith(path)` to `startsWith(path + '/')` to prevent false matches on paths like `/admin/blog-settings`
  - P4 [MEDIUM] Added body scroll lock on mobile drawer — `document.body.style.overflow = 'hidden'` via `$effect` cleanup pattern
  - P5 [LOW] Added `aria-hidden="true"` to all decorative SVG icons in AdminSidebar and AdminDashboard
  - P6 [DEFER→FIX] ESLint browser globals — replaced 10+ manual declarations with `...globals.browser` via `globals` package, preventing future stories from hitting the same issue
  - Deferred: D2 (breadcrumb deep sub-paths — future stories 3.4+ will add nested routes)
  - Rejected: 17 findings (noise/false positives/spec-compliant behavior)

### File List

**Created:**
- src/components/admin/AdminSidebar.svelte
- src/components/admin/AdminDashboard.svelte
- src/components/admin/AdminBreadcrumb.astro
- src/components/admin/breadcrumb-utils.ts
- src/components/admin/__tests__/admin-breadcrumb.test.ts
- src/pages/admin/projects.astro
- src/pages/admin/technologies.astro
- src/pages/admin/experiences.astro
- src/pages/admin/blog.astro

**Modified:**
- src/layouts/AdminLayout.astro
- src/pages/admin/index.astro
- src/lib/i18n/translations.ts
- eslint.config.js
