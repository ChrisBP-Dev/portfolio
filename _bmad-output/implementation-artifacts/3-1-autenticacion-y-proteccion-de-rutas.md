# Story 3.1: Autenticación y Protección de Rutas

Status: ready-for-dev

## Story

As Christopher (admin),
I want to log in securely and have all admin routes protected,
So that only I can access the administration panel.

## Acceptance Criteria (AC)

1. **Redirect sin auth** — Navegar a `/admin` sin autenticación redirige a `/admin/login`.
2. **Login exitoso** — Email y password válidos autentican via Firebase Auth y redirigen a `/admin` (dashboard).
3. **Login fallido** — Credenciales inválidas muestran error user-friendly bilingüe ("Contraseña incorrecta" / "Wrong password") — nunca stack traces ni `error.code`.
4. **Logout** — Click en Logout limpia sesión y redirige a `/admin/login`.
5. **Protección global** — Cualquier ruta `/admin/*` sin auth redirige a `/admin/login`.
6. **Persistencia de sesión** — Auth state persiste entre recargas de página (Firebase Auth persistence por defecto).
7. **Firestore Security Rules** — `allow read: if true; allow write: if request.auth.uid == 'ADMIN_UID'`.
8. **Storage Security Rules** — `allow read: if true; allow write: if request.auth.uid == 'ADMIN_UID'`.

**(FR15, FR16, FR17, FR18, NFR8, NFR10, NFR11)**

## BDD Scenarios

### Scenario 1: Redirect sin autenticación
```gherkin
Given no estoy autenticado
When navego a /admin
Then soy redirigido a /admin/login
And veo un formulario con campos Email y Password
```

### Scenario 2: Login exitoso
```gherkin
Given estoy en /admin/login
When ingreso email y password válidos
And hago click en "Iniciar sesión"
Then soy redirigido a /admin
And veo el dashboard (placeholder para story 3.2)
```

### Scenario 3: Login con credenciales inválidas
```gherkin
Given estoy en /admin/login
When ingreso email correcto y password incorrecto
And hago click en "Iniciar sesión"
Then veo mensaje de error "Contraseña incorrecta" (o equivalente en EN)
And el formulario no se limpia
And no soy redirigido
```

### Scenario 4: Login con email no registrado
```gherkin
Given estoy en /admin/login
When ingreso un email que no existe en Firebase Auth
And hago click en "Iniciar sesión"
Then veo mensaje de error "Credenciales inválidas" / "Invalid credentials"
And no se revela si el email existe o no (seguridad)
```

### Scenario 5: Logout
```gherkin
Given estoy autenticado en /admin
When hago click en el botón "Cerrar sesión"
Then mi sesión se cierra
And soy redirigido a /admin/login
```

### Scenario 6: Protección de rutas admin/*
```gherkin
Given no estoy autenticado
When navego directamente a /admin/projects
Then soy redirigido a /admin/login
And al autenticarme correctamente, regreso a /admin (dashboard)
```

### Scenario 7: Persistencia de sesión
```gherkin
Given estoy autenticado en /admin
When recargo la página (F5)
Then sigo autenticado
And veo el dashboard sin pasar por login
```

### Scenario 8: Security Rules protegen datos
```gherkin
Given las Firestore Security Rules están desplegadas
When un usuario no autenticado intenta escribir un documento
Then la operación es rechazada
And un usuario autenticado con UID == ADMIN_UID puede escribir
```

## Tasks / Subtasks

- [ ] Task 1: Crear páginas Astro para admin (AC: 1, 2, 5)
  - [ ] 1.1 Crear `src/pages/admin/login.astro` — página estática que monta `LoginForm.svelte` con `client:load`
  - [ ] 1.2 Crear `src/pages/admin/index.astro` — página dashboard que monta `AuthGuard.svelte` con `client:load`, contenido placeholder ("Dashboard — story 3.2")
  - [ ] 1.3 Ambas páginas usan `AdminLayout.astro` como layout

- [ ] Task 2: Actualizar AdminLayout.astro (AC: 4, 5)
  - [ ] 2.1 Agregar slot para auth state — el layout NO hace auth check, eso lo hace AuthGuard dentro de cada página protegida
  - [ ] 2.2 Agregar prop `showSidebar: boolean` (default `true`). Cuando `false`, NO renderizar el `<aside>`. login.astro pasa `showSidebar={false}`, index.astro lo omite (default `true`). El `<aside>` actual mantiene el comment placeholder ("sidebar — story 3.2")
  - [ ] 2.3 Importar `global.css`; no agregar `<ClientRouter>` (admin es SPA client-side, no usa View Transitions)
  - [ ] 2.4 Agregar `<meta name="robots" content="noindex, nofollow" />` en el `<head>` — las páginas admin NO deben ser indexadas por buscadores
  - [ ] 2.5 NOTA: AdminLayout usa `<slot />` de **Astro** (correcto). NO confundir con `<slot />` de Svelte 4 (prohibido). Son mecanismos diferentes: Astro slots son build-time, Svelte 5 usa `{@render children()}`

- [ ] Task 3: Crear AuthGuard.svelte (AC: 1, 5, 6)
  - [ ] 3.1 Crear `src/components/admin/AuthGuard.svelte`
  - [ ] 3.2 Usar `onAuthStateChanged(auth, callback)` de Firebase Auth **dentro de `$effect` con cleanup** para evitar memory leaks — el return de `$effect` debe llamar `unsubscribe()`
  - [ ] 3.3 Estados: `checking` (spinner), `authenticated` (render children via snippet), `unauthenticated` (redirect a `/admin/login`)
  - [ ] 3.4 Redirect con `window.location.href = '/admin/login'` (no View Transitions en admin)
  - [ ] 3.5 Usar Svelte 5 runes: `$state` para `user` y `checking`

- [ ] Task 4: Crear LoginForm.svelte (AC: 2, 3)
  - [ ] 4.1 Crear `src/components/admin/LoginForm.svelte`
  - [ ] 4.2 Campos: email (type="email", `autocomplete="email"`), password (type="password", `autocomplete="current-password"`), botón submit
  - [ ] 4.3 Usar `signInWithEmailAndPassword(auth, email, password)` de Firebase Auth
  - [ ] 4.4 On success: `window.location.href = '/admin'`
  - [ ] 4.5 On error: mapear Firebase error codes a mensajes bilingües con `getErrorMessage()`
  - [ ] 4.6 Estado loading en botón durante autenticación (disabled + spinner)
  - [ ] 4.7 Usar Svelte 5 runes: `$state` para email, password, error, loading
  - [ ] 4.8 Accesibilidad: labels visibles, aria-invalid en campos con error, aria-describedby para mensajes de error, aria-required

- [ ] Task 5: Crear utilidad getErrorMessage (AC: 3)
  - [ ] 5.1 Crear `src/lib/firebase/auth-errors.ts` — NOTA: La architecture doc menciona `src/lib/utils/error-messages.ts` como utilidad centralizada de errores Firebase. Esa se creará en Story 3.8 (Feedback Systems). Por ahora creamos solo los auth errors en `src/lib/firebase/` porque es lo único que necesitamos
  - [ ] 5.2 Mapeo de Firebase error codes a mensajes bilingües (ES/EN):
    - `auth/wrong-password` → "Contraseña incorrecta" / "Wrong password"
    - `auth/user-not-found` → "Credenciales inválidas" / "Invalid credentials"
    - `auth/invalid-credential` → "Credenciales inválidas" / "Invalid credentials"
    - `auth/invalid-email` → "Email inválido" / "Invalid email"
    - `auth/too-many-requests` → "Demasiados intentos. Intenta más tarde." / "Too many attempts. Try again later."
    - fallback → "Error inesperado" / "Unexpected error"
  - [ ] 5.3 Función `getErrorMessage(error: unknown, locale: Locale): string` que verifica `FirebaseError` instance
  - [ ] 5.4 NOTA: Combinar `user-not-found` e `invalid-credential` en el mismo mensaje genérico para no revelar si un email existe

- [ ] Task 6: Agregar botón Logout temporal (AC: 4)
  - [ ] 6.1 En la página `/admin/index.astro`, el AuthGuard wrappea contenido que incluye un botón "Cerrar sesión" / "Sign out"
  - [ ] 6.2 Usar `signOut(auth)` de Firebase Auth
  - [ ] 6.3 On success: `window.location.href = '/admin/login'`
  - [ ] 6.4 NOTA: En story 3.2 el logout se moverá a AdminSidebar — por ahora un botón simple en el dashboard placeholder es suficiente

- [ ] Task 7: Agregar translation keys para admin/auth (AC: 2, 3, 4)
  - [ ] 7.1 Agregar keys a `src/lib/i18n/translations.ts`:
    - `admin.login.title`: "Iniciar sesión" / "Sign in"
    - `admin.login.email`: "Correo electrónico" / "Email"
    - `admin.login.password`: "Contraseña" / "Password"
    - `admin.login.submit`: "Iniciar sesión" / "Sign in"
    - `admin.login.loading`: "Autenticando..." / "Authenticating..."
    - `admin.logout`: "Cerrar sesión" / "Sign out"
    - `admin.dashboard.title`: "Panel de Administración" / "Admin Panel"
    - `admin.dashboard.placeholder`: "Dashboard — próximamente" / "Dashboard — coming soon"
  - [ ] 7.2 NOTA: Admin UI usa locale fijo `'es'` por defecto (Christopher es hispanohablante) pero los mensajes de error soportan ambos idiomas

- [ ] Task 8: Actualizar Security Rules — REEMPLAZAR reglas inseguras (AC: 7, 8)
  - [ ] 8.1 **CRÍTICO**: Los archivos `firestore.rules` y `storage.rules` YA EXISTEN pero tienen reglas **inseguras** de desarrollo (`allow read, write: if true` — cualquiera puede escribir). DEBEN ser REEMPLAZADOS con las reglas seguras:
  - [ ] 8.2 Actualizar `firestore.rules` en raíz del proyecto:
    ```
    rules_version = '2';
    service cloud.firestore {
      match /databases/{database}/documents {
        match /{collection}/{docId} {
          allow read: if true;
          allow write: if request.auth != null && request.auth.uid == 'ADMIN_UID';
        }
      }
    }
    ```
  - [ ] 8.3 Actualizar `storage.rules` en raíz del proyecto:
    ```
    rules_version = '2';
    service firebase.storage {
      match /b/{bucket}/o {
        match /{allPaths=**} {
          allow read: if true;
          allow write: if request.auth != null && request.auth.uid == 'ADMIN_UID';
        }
      }
    }
    ```
  - [ ] 8.4 **ADMIN_UID — Instrucciones exactas**: Abrir el archivo `.env` local, copiar el valor de `PUBLIC_ADMIN_UID` (ej: `'abc123xyz456'`), y reemplazar el literal `'ADMIN_UID'` en AMBOS archivos de rules con ese valor real. Security Rules NO soportan variables de entorno — el UID DEBE estar hardcodeado como string literal. Si `PUBLIC_ADMIN_UID` no está en `.env`, obtenerlo de la consola Firebase > Authentication > Users > columna "User UID"
  - [ ] 8.5 Verificar que `firebase.json` referencia ambos archivos de rules (ya verificado: `"rules": "firestore.rules"` y `"rules": "storage.rules"` están configurados)

- [ ] Task 9: Tests unitarios (AC: 2, 3, 5)
  - [ ] 9.1 Crear `src/lib/firebase/__tests__/auth-errors.test.ts` — test de `getErrorMessage()` para cada error code y locale
  - [ ] 9.2 Verificar que error codes desconocidos retornan el fallback
  - [ ] 9.3 Verificar que errores que no son `FirebaseError` retornan fallback

- [ ] Task 10: Validación pipeline (todos los ACs)
  - [ ] 10.1 `pnpm lint` — sin errores
  - [ ] 10.2 `pnpm type-check` — sin errores TypeScript
  - [ ] 10.3 `pnpm build` — build exitoso (admin pages se generan como HTML estático vacío que monta Svelte islands client-side)
  - [ ] 10.4 Verificar manualmente: navegar a `/admin` redirige a login, login funciona con credenciales válidas, logout funciona

## Dev Notes

### PREREQUISITO: Leer Project Context

**ANTES de implementar**, leer `_bmad-output/project-context.md` — contiene las 68 reglas del proyecto (TypeScript strictest, Svelte 5 runes, imports relativos sin aliases, naming conventions, anti-patrones prohibidos, etc.). Todas las reglas aplican a esta story.

### Patrón de Auth en Admin — Client-Side Only

El admin NO usa server-side auth ni session cookies. Todo es client-side:

1. **AdminLayout.astro** genera HTML estático mínimo (shell)
2. **AuthGuard.svelte** se monta con `client:load` y verifica auth state via `onAuthStateChanged`
3. Si no autenticado → redirect JS a `/admin/login`
4. Si autenticado → renderiza contenido (slot/children)

Esto es correcto para un portfolio single-admin. Firebase Security Rules protegen los datos a nivel de base de datos.

### Firebase Auth — Imports Necesarios

```typescript
// En LoginForm.svelte
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../../lib/firebase/client';

// En AuthGuard.svelte
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '../../lib/firebase/client';
```

**IMPORTANTE**: Importar `auth` desde `../../lib/firebase/client` (path relativo, sin aliases). El proyecto NO usa path aliases — ver `project-context.md`.

### Error Handling Pattern

```typescript
import { FirebaseError } from 'firebase/app';
import type { Locale } from '../../lib/i18n/config';

const firebaseAuthErrors: Record<string, Record<Locale, string>> = {
  'auth/wrong-password': { es: 'Contraseña incorrecta', en: 'Wrong password' },
  'auth/user-not-found': { es: 'Credenciales inválidas', en: 'Invalid credentials' },
  'auth/invalid-credential': { es: 'Credenciales inválidas', en: 'Invalid credentials' },
  'auth/invalid-email': { es: 'Email inválido', en: 'Invalid email' },
  'auth/too-many-requests': {
    es: 'Demasiados intentos. Intenta más tarde.',
    en: 'Too many attempts. Try again later.',
  },
};

export function getErrorMessage(error: unknown, locale: Locale): string {
  if (error instanceof FirebaseError) {
    return firebaseAuthErrors[error.code]?.[locale] ?? (locale === 'es' ? 'Error inesperado' : 'Unexpected error');
  }
  return locale === 'es' ? 'Error inesperado' : 'Unexpected error';
}
```

**NOTA**: Firebase Auth v9+ puede usar `auth/invalid-credential` como código genérico en lugar de `auth/wrong-password` o `auth/user-not-found`. Mapear ambos al mismo mensaje genérico.

### AuthGuard Pattern (Svelte 5 Runes)

```svelte
<script lang="ts">
  import { onAuthStateChanged, type User } from 'firebase/auth';
  import { auth } from '../../lib/firebase/client';
  import type { Snippet } from 'svelte';

  let { children }: { children: Snippet } = $props();

  let user = $state<User | null>(null);
  let checking = $state(true);

  // CRÍTICO: usar $effect con cleanup para unsubscribe y evitar memory leaks
  $effect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      user = u;
      checking = false;
      if (!u) window.location.href = '/admin/login';
    });
    return () => unsubscribe();
  });
</script>

{#if checking}
  <div class="flex items-center justify-center min-h-screen">
    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
{:else if user}
  {@render children()}
{/if}
```

**IMPORTANTE**: Usar `children: Snippet` + `{@render children()}` (Svelte 5 pattern), NO `<slot />` (Svelte 4 pattern).

### LoginForm — Estructura de Referencia

```svelte
<script lang="ts">
  import { signInWithEmailAndPassword } from 'firebase/auth';
  import { auth } from '../../lib/firebase/client';
  import { getErrorMessage } from '../../lib/firebase/auth-errors';

  let email = $state('');
  let password = $state('');
  let error = $state('');
  let loading = $state(false);

  // Locale fijo 'es' para admin — Christopher es hispanohablante
  const locale = 'es';

  async function handleSubmit(e: Event) {
    e.preventDefault();
    error = '';
    loading = true;
    try {
      await signInWithEmailAndPassword(auth, email, password);
      window.location.href = '/admin';
    } catch (err) {
      error = getErrorMessage(err, locale);
    } finally {
      loading = false;
    }
  }
</script>

<!-- IMPORTANTE: autocomplete attributes para UX y accesibilidad -->
<input type="email" autocomplete="email" ... />
<input type="password" autocomplete="current-password" ... />

<!-- NOTA: usar e.preventDefault() manual en handleSubmit, NO event modifiers
     de Svelte como onsubmit|preventDefault — no funcionan en Astro islands -->
```

### Locale en Admin

El admin usa locale fijo `'es'` (Christopher es hispanohablante). No se necesita LocaleToggle ni i18n routing en `/admin/*`. Sin embargo, `getErrorMessage()` acepta locale como parámetro para flexibilidad futura.

### AdminLayout — No Usa View Transitions

Admin NO incluye `<ClientRouter />`. Cada navegación en admin es un full page load. Esto es correcto porque:
- Admin es una SPA con Svelte islands — la navegación real es client-side dentro de cada island
- View Transitions son solo para el sitio público

### AdminLayout — Sidebar Condicional y Meta Tags

AdminLayout necesita un prop `showSidebar` (default `true`):
- `login.astro` pasa `showSidebar={false}` — login se centra en pantalla completa, sin sidebar
- `index.astro` omite el prop — sidebar visible con placeholder para story 3.2
- El `<aside>` actual del layout (líneas 22-24) solo se renderiza cuando `showSidebar` es `true`
- Agregar `<meta name="robots" content="noindex, nofollow" />` en `<head>` para excluir admin de buscadores
- NOTA: `<slot />` en AdminLayout.astro es **Astro slot** (build-time, correcto). No confundir con `<slot />` de Svelte 4 (prohibido). Son mecanismos completamente diferentes

### AdminLayout — Dark Mode

AdminLayout tiene `class="dark"` hardcodeado. Esto es intencional — el admin siempre usa dark mode. No implementar theme toggle en admin (story 3.2 puede revisitarlo si necesario).

### Mejoras Futuras (fuera de scope de esta story)

- **Redirect URL preservation**: Cuando AuthGuard redirige a login, no preserva la URL original (ej: `/admin/projects`). Tras login siempre va a `/admin`. Considerar `?returnTo=/admin/projects` en stories futuras
- **Password visibility toggle**: Patrón UX común (ojo para mostrar/ocultar password). No crítico para single-admin pero mejora usabilidad

### Archivos Existentes — NO Modificar

| Archivo | Por qué no tocar |
|---------|-----------------|
| `src/lib/firebase/client.ts` | Ya exporta `auth`, `db`, `storage` — listo para usar |
| `src/lib/firebase/admin.ts` | Solo build-time — irrelevante para admin UI |
| `src/env.d.ts` | `PUBLIC_ADMIN_UID` ya definido |
| `src/layouts/BaseLayout.astro` | Solo para sitio público |

### Archivos a Crear

| Archivo | Propósito |
|---------|----------|
| `src/pages/admin/login.astro` | Página de login (monta LoginForm) |
| `src/pages/admin/index.astro` | Dashboard placeholder (monta AuthGuard) |
| `src/components/admin/LoginForm.svelte` | Formulario de login |
| `src/components/admin/AuthGuard.svelte` | Guard de autenticación |
| `src/lib/firebase/auth-errors.ts` | Mapeo de errores Firebase → mensajes bilingües |
| `src/lib/firebase/__tests__/auth-errors.test.ts` | Tests unitarios para auth-errors |

### Archivos a Modificar

| Archivo | Cambio |
|---------|--------|
| `src/layouts/AdminLayout.astro` | Agregar prop `showSidebar`, meta noindex, sidebar condicional |
| `src/lib/i18n/translations.ts` | Agregar keys `admin.login.*`, `admin.logout`, `admin.dashboard.*` |
| `firestore.rules` | REEMPLAZAR reglas inseguras con restricción de escritura por ADMIN_UID |
| `storage.rules` | REEMPLAZAR reglas inseguras con restricción de escritura por ADMIN_UID |

### Estilo Visual del Login

Seguir dirección "Technical Craft" del UX spec:
- Centrado vertical y horizontal en la pantalla
- Card con fondo `bg-surface`, borde sutil, sombra
- Logo o título "Portfolio ChrisBP — Admin" arriba del formulario
- Campos con labels visibles (no placeholders que desaparecen)
- Botón primario con gradiente para submit
- Mensaje de error debajo del formulario con color rojo
- Responsive: formulario full-width en mobile, max-w-sm en desktop

### Accesibilidad

- `<form>` con `role="form"` y `aria-label`
- Labels con `for` apuntando a inputs
- `aria-invalid="true"` en campos con error
- `aria-describedby` apuntando al mensaje de error
- `aria-required="true"` en campos obligatorios
- `aria-busy="true"` en botón durante loading
- Focus trap: después de error, focus en el primer campo con error
- `autocomplete="email"` y `autocomplete="current-password"` en inputs

### Security Rules — Estado Actual y ADMIN_UID

**ESTADO ACTUAL INSEGURO**: Los archivos `firestore.rules` y `storage.rules` que existen en el proyecto tienen `allow read, write: if true` — permiten que CUALQUIER usuario lea Y escriba datos. Esto es una configuración de desarrollo abierta que DEBE ser reemplazada con las reglas seguras de esta story.

**Cómo obtener el ADMIN_UID real**:
1. Abrir el archivo `.env` en la raíz del proyecto
2. Copiar el valor de `PUBLIC_ADMIN_UID` (ej: `'abc123xyz456'`)
3. Reemplazar el literal `'ADMIN_UID'` en AMBOS archivos de rules con ese valor
4. Si `PUBLIC_ADMIN_UID` no está en `.env`, ir a Firebase Console > Authentication > Users > columna "User UID"

Las Security Rules NO soportan variables de entorno — el UID DEBE estar hardcodeado como string literal en los archivos de rules.

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

### Project Structure Notes

- Admin pages van en `src/pages/admin/` (sin i18n — no `/es/admin/`)
- Admin components van en `src/components/admin/`
- Auth utilities van en `src/lib/firebase/`
- Tests co-locados en `__tests__/` junto al código que testean
- Naming: kebab-case para archivos, PascalCase para componentes

### References

- [Source: _bmad-output/planning-artifacts/epics.md — Epic 3, Story 3.1]
- [Source: _bmad-output/planning-artifacts/architecture.md — Authentication & Security, Auth Guard Pattern, Error Handling]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md — Journey 2, Admin Navigation, Form Patterns, Feedback Patterns]
- [Source: _bmad-output/planning-artifacts/prd.md — FR15-FR18, NFR8-NFR13]
- [Source: _bmad-output/project-context.md — Firebase Dual SDK Pattern, Svelte 5 Runes, Anti-Patrones]

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
