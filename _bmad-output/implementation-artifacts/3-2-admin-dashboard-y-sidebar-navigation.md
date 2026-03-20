# Story 3.2: Admin Dashboard y Sidebar Navigation

Status: ready-for-dev

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
When hago click fuera o en un item
Then la sidebar se cierra
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

- [ ] Task 1: Crear AdminSidebar.svelte (AC: 2, 3, 4, 7)
  - [ ] 1.1 Crear `src/components/admin/AdminSidebar.svelte`
  - [ ] 1.2 Props: `currentPath: string` (para determinar item activo)
  - [ ] 1.3 Nav items array: Dashboard (`/admin`), Projects (`/admin/projects`), Technologies (`/admin/technologies`), Experiences (`/admin/experiences`), Blog (`/admin/blog`), Logout (acción)
  - [ ] 1.4 Cada item: icono SVG inline + label de texto
  - [ ] 1.5 Item activo: `bg-primary/10` (fondo con opacidad del primary)
  - [ ] 1.6 Desktop (>900px / `lg:`): sidebar visible 250px, items con icono + label
  - [ ] 1.7 Tablet (450-900px / `sm:` a `lg:`): sidebar colapsada ~64px (solo iconos), expand on hover con transición
  - [ ] 1.8 Mobile (<450px): sidebar oculta por defecto, toggle button muestra drawer overlay con backdrop
  - [ ] 1.9 Logout item: al click ejecuta `signOut(auth)` y redirige a `/admin/login`
  - [ ] 1.10 Accessibility: `<nav aria-label="Admin navigation">`, `aria-current="page"` en item activo, `aria-expanded` en mobile toggle

- [ ] Task 2: Crear AdminDashboard.svelte (AC: 1, 5)
  - [ ] 2.1 Crear `src/components/admin/AdminDashboard.svelte`
  - [ ] 2.2 Al montar, obtener contadores de las 4 colecciones via `getCountFromServer` del client SDK
  - [ ] 2.3 Mostrar 4 section cards en grid responsive (1 col mobile, 2 cols tablet, 2 o 4 cols desktop)
  - [ ] 2.4 Cada card: icono, nombre de sección, contador numérico, clickable para navegar
  - [ ] 2.5 Estado loading: skeleton cards (4 cards con pulso gris) mientras se cargan los contadores
  - [ ] 2.6 Estado error: si falla la consulta, mostrar contador como "—" y no bloquear la UI
  - [ ] 2.7 Navegación via `window.location.href` (full page load — no View Transitions en admin)

- [ ] Task 3: Crear AdminBreadcrumb.svelte (AC: 6)
  - [ ] 3.1 Crear `src/components/admin/AdminBreadcrumb.svelte`
  - [ ] 3.2 Props: `currentPath: string`
  - [ ] 3.3 Parsear `currentPath` para generar segmentos: "Admin" siempre primero (link a `/admin`), luego sección actual
  - [ ] 3.4 Mapeo de paths a labels: `/admin` → "Dashboard", `/admin/projects` → "Projects", etc.
  - [ ] 3.5 Accessibility: `<nav aria-label="Breadcrumb">`, `<ol>` semántico con `aria-current="page"` en último item
  - [ ] 3.6 Separador visual entre segmentos (chevron `>` o `/`)

- [ ] Task 4: Actualizar AdminLayout.astro (AC: 2, 3, 4, 6)
  - [ ] 4.1 Reemplazar el `<aside>` placeholder (`<!-- sidebar — story 3.2 -->`) con `AdminSidebar` real
  - [ ] 4.2 Agregar `AdminBreadcrumb` en el header del content area (dentro de `<main>`)
  - [ ] 4.3 Pasar `currentPath` desde Astro.url.pathname a los componentes Svelte via props
  - [ ] 4.4 AdminSidebar usa `client:only="svelte"` (requiere Firebase Auth para logout)
  - [ ] 4.5 AdminBreadcrumb puede ser `client:load` o un componente Astro estático si no necesita JS
  - [ ] 4.6 Mantener `showSidebar={false}` para login page (ya funciona)

- [ ] Task 5: Actualizar admin/index.astro (AC: 1)
  - [ ] 5.1 Reemplazar el contenido placeholder (título + logout button) con `AdminDashboard` component
  - [ ] 5.2 AdminDashboard montado dentro de AuthGuard con `client:only="svelte"`
  - [ ] 5.3 Remover el botón logout inline (ahora vive en AdminSidebar)
  - [ ] 5.4 Remover el `<script>` de logout (ahora vive en AdminSidebar)

- [ ] Task 6: Crear páginas admin placeholder (AC: 5)
  - [ ] 6.1 Crear `src/pages/admin/projects.astro` — placeholder con AuthGuard + texto "Projects — próximamente"
  - [ ] 6.2 Crear `src/pages/admin/technologies.astro` — placeholder con AuthGuard + texto "Technologies — próximamente"
  - [ ] 6.3 Crear `src/pages/admin/experiences.astro` — placeholder con AuthGuard + texto "Experiences — próximamente"
  - [ ] 6.4 Crear `src/pages/admin/blog.astro` — placeholder con AuthGuard + texto "Blog — próximamente"
  - [ ] 6.5 Todas usan `AdminLayout` con `showSidebar={true}` (default)
  - [ ] 6.6 Todas incluyen AuthGuard con `client:only="svelte"`

- [ ] Task 7: Agregar translation keys (AC: 1, 2, 6)
  - [ ] 7.1 Agregar keys a `src/lib/i18n/translations.ts`:
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
  - [ ] 7.2 NOTA: Admin usa locale fijo `'es'` (Christopher es hispanohablante)

- [ ] Task 8: Tests unitarios (AC: 1, 6)
  - [ ] 8.1 Crear `src/components/admin/__tests__/admin-breadcrumb.test.ts` — test de lógica de parseo de breadcrumb paths
  - [ ] 8.2 Verificar que paths correctos producen labels correctos
  - [ ] 8.3 Verificar path edge cases: `/admin`, `/admin/projects`, paths inválidos

- [ ] Task 9: Validación pipeline (todos los ACs)
  - [ ] 9.1 `pnpm lint` — sin errores
  - [ ] 9.2 `pnpm type-check` — sin errores TypeScript
  - [ ] 9.3 `pnpm build` — build exitoso (nuevas páginas admin se generan correctamente)
  - [ ] 9.4 `pnpm test` — todos los tests pasan
  - [ ] 9.5 Verificar manualmente: sidebar visible, navegación funciona, contadores cargan, responsive correcto

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

Para obtener el count de documentos sin descargar todos los datos, usar `getCountFromServer` de Firebase Client SDK:

```typescript
import { collection, getCountFromServer } from 'firebase/firestore';
import { db } from '../../lib/firebase/client';

async function getCollectionCount(collectionName: string): Promise<number> {
  const coll = collection(db, collectionName);
  const snapshot = await getCountFromServer(coll);
  return snapshot.data().count;
}
```

**Nombres de colecciones** — Definidos en `src/lib/firebase/collections.ts`:
```typescript
export const COLLECTION_PATHS = {
  projects: 'Projects',
  technologies: 'Technologies',
  experiences: 'Experiences',
  blogPosts: 'BlogPosts',
} as const;
```

**NO re-definir** estos paths en el dashboard — importar `COLLECTION_PATHS` directamente. Pero NOTA: `collections.ts` importa de `firebase-admin/firestore` (build-time only). El dashboard necesita usar el client SDK. Importar solo la constante `COLLECTION_PATHS`, NO las funciones `getAll*`.

**SOLUCIÓN**: Extraer `COLLECTION_PATHS` a un archivo compartido o importar solo el export constante. Si el import causa problemas por side-effects del Admin SDK, duplicar las 4 strings directamente en AdminDashboard como constantes locales:

```typescript
// Si importar COLLECTION_PATHS causa side-effects del Admin SDK, usar constantes locales:
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
  <div class="fixed inset-0 z-50 sm:hidden">
    <div class="absolute inset-0 bg-black/50" onclick={() => mobileOpen = false}></div>
    <nav class="relative w-64 h-full bg-surface">
      <!-- Full sidebar content -->
    </nav>
  </div>
{/if}
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

Agregar breadcrumb al inicio del `<main>`:
```astro
<main class="flex-1">
  {showSidebar && (
    <AdminBreadcrumb client:only="svelte" currentPath={Astro.url.pathname} />
  )}
  <slot />
</main>
```

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
- Breadcrumb: `<nav aria-label="Breadcrumb">` con `<ol>` semántico
- Dashboard cards: pueden ser `<a>` links o `<button>` elements (links es más semántico)
- Skeleton loading: `aria-busy="true"` en el grid durante carga
- Foco visible: outline `ring-2 ring-primary` en todos los elementos interactivos
- Sidebar Logout: no es `<a>` (no navega), es `<button>` con icono

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
| `src/components/admin/AdminBreadcrumb.svelte` | Breadcrumb para content area header |
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

3. **`signOut` debe tener try/catch**: El logout de story 3.1 fue corregido en code review para usar try/catch en `signOut(auth)` — si falla, redirigir anyway.

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

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
