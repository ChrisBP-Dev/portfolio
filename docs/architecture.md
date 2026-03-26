# Arquitectura — Portfolio ChrisBP

> Generado: 2026-03-26 | Modo: Re-escaneo Exhaustivo | v3.0.0

---

## 1. Resumen Ejecutivo

Portfolio web bilingue (EN/ES) construido con **Astro 6** (SSG) + **Svelte 5** (islas interactivas) + **Tailwind CSS 4** + **Firebase** (Auth, Firestore, Storage). El output es 100 % estatico pre-renderizado, desplegado en **Firebase Hosting** con CDN global. Incluye un panel de administracion protegido por Firebase Auth con CRUD completo para gestionar proyectos, tecnologias, experiencias laborales y articulos de blog.

La arquitectura sigue el patron **Astro Islands**: las paginas se renderizan a HTML puro en tiempo de build, y solo los componentes que requieren interactividad (filtros, formularios, menu movil, panel admin) se hidratan como islas Svelte en el navegador. Esto resulta en paginas publicas con cero JavaScript por defecto y tiempos de carga ultra-rapidos.

---

## 2. Patron Arquitectonico: Astro Islands

### Concepto Central

Astro Islands es una arquitectura donde cada pagina es un documento HTML estatico por defecto, y las secciones interactivas se "hidratan" de forma independiente como islas de JavaScript. Cada isla se carga y ejecuta de forma aislada, sin afectar al resto de la pagina.

### Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────────────────┐
│                      Build Time (Astro SSG)                     │
│  ┌────────────────┐  ┌──────────────────┐  ┌────────────────┐  │
│  │ Pages (.astro)  │→│ Firebase Admin SDK│→│ HTML + CSS       │  │
│  │ getStaticPaths  │  │  (queries)       │  │ (pre-renderizado)│  │
│  └────────────────┘  └──────────────────┘  └────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ↓ deploy
┌─────────────────────────────────────────────────────────────────┐
│                     Runtime (Navegador)                          │
│  ┌────────────────┐  ┌──────────────────┐  ┌────────────────┐  │
│  │ HTML Estatico   │ +│ Islas Svelte 5   │→│ Firebase Client  │  │
│  │ (zero JS)       │  │ (client:*)       │  │ SDK (Auth/CRUD)  │  │
│  └────────────────┘  └──────────────────┘  └────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### Principios Clave

- **Paginas Astro como contenedores estaticos**: cada archivo `.astro` en `src/pages/` genera HTML puro en tiempo de build. Los datos se obtienen via Firebase Admin SDK en `getStaticPaths()` y funciones de fetch en el frontmatter.
- **Islas Svelte para interactividad**: los componentes Svelte 5 se hidratan selectivamente usando directivas `client:load` (inmediato) y `client:visible` (lazy al hacer scroll).
- **Panel admin — islas con `client:load`**: todas las paginas de administracion usan islas Svelte con hidratacion inmediata para formularios CRUD, drag-and-drop, editores de texto enriquecido y gestion de imagenes.
- **Paginas publicas — mayoria contenido estatico**: las paginas de cara al usuario son HTML pre-renderizado. Solo se hidratan islas para filtros de proyectos, toggles de tema, menu movil y formulario de contacto.
- **Zero JavaScript por defecto**: si un componente no tiene directiva `client:*`, Astro lo renderiza a HTML puro y no envia ningun JavaScript al navegador.

### Directivas de Hidratacion

| Directiva | Comportamiento | Uso en el proyecto |
|---|---|---|
| `client:load` | Hidrata inmediatamente al cargar la pagina | Formularios CRUD, AuthGuard, ContactForm, ProjectFilter |
| `client:visible` | Hidrata cuando el componente entra al viewport | Componentes con lazy loading |
| `client:only="svelte"` | Solo cliente, sin renderizado en servidor | Paginas admin que dependen de APIs del navegador |
| Sin directiva | HTML estatico, cero JavaScript | Todos los componentes Astro, headers, footers, cards |

### Dos Modos de Data Fetching

1. **Build-time (paginas publicas)**: Firebase Admin SDK consulta Firestore durante `astro build` → genera HTML estatico con todos los datos embebidos.
2. **Client-side (panel admin)**: Firebase Client SDK ejecuta queries en el navegador → Svelte 5 runes manejan el estado reactivo → CRUD en tiempo real contra Firestore y Storage.

---

## 3. Stack Tecnologico

| Categoria | Tecnologia | Version | Rol |
|---|---|---|---|
| Framework | Astro | ^6.0.5 | SSG + Islands Architecture |
| UI Interactiva | Svelte | ^5.53.12 | Componentes interactivos (islas) |
| Estilos | Tailwind CSS | ^4.2.1 | Framework de utilidades CSS (via @tailwindcss/vite) |
| Lenguaje | TypeScript | ^5.9.3 | Tipado estatico (modo strictest) |
| Validacion | Zod | ^4.3.6 | Esquemas de validacion + formularios |
| Autenticacion | Firebase Auth | ^12.10.0 | Login email/password (admin) |
| Base de datos | Firestore | ^12.10.0 | Base de datos NoSQL (colecciones de contenido) |
| Almacenamiento | Firebase Storage | ^12.10.0 | Almacenamiento de imagenes |
| Rich Text | TipTap | ^3.20.4 | Editor de texto enriquecido para blog |
| Drag & Drop | SortableJS | ^1.15.7 | Reordenamiento de elementos en admin |
| Imagenes | Sharp | ^0.34.5 | Procesamiento de imagenes en build-time |
| Sanitizacion | sanitize-html | ^2.17.1 | Limpieza de HTML para XSS prevention |
| Testing unitario | Vitest | ^4.1.0 | Tests unitarios + Testing Library |
| Testing E2E | Playwright | ^1.58.2 | Tests end-to-end (publico + admin) |
| Testing a11y | @axe-core/playwright | ^4.11.1 | Auditorias de accesibilidad automatizadas |
| Rendimiento | Lighthouse CI | 0.15.1 | Auditorias de rendimiento, SEO, a11y, best practices |
| Lint | ESLint | ^10.0.3 | Analisis estatico (plugins: TypeScript-ESLint, Astro, Svelte) |
| Formato | Prettier | ^3.8.1 | Formateo de codigo (plugins: Astro, Svelte) |
| CI/CD | GitHub Actions | — | Pipeline de integracion y despliegue continuo |
| Hosting | Firebase Hosting | — | CDN global para sitio estatico |
| Package Manager | pnpm | 10 | Gestor de dependencias |
| Runtime | Node.js | >=22.12.0 | Entorno de ejecucion |

---

## 4. Capas de la Aplicacion

### 4.1 Capa de Presentacion

**Ubicacion:** `src/components/`, `src/layouts/`, `src/pages/`, `src/styles/`

Esta capa maneja todo lo visual y la interaccion con el usuario.

- **Paginas Astro** (`src/pages/`): definen la estructura de cada ruta. En el frontmatter obtienen datos via Firebase Admin SDK en build-time usando `getStaticPaths()` para rutas dinamicas (`[slug].astro`).
- **Islas Svelte** (`src/components/`): componentes interactivos que se hidratan en el navegador. Usan Svelte 5 runes (`$state`, `$derived`, `$effect`) para reactividad.
- **Tailwind CSS 4** (`src/styles/`): sistema de estilos basado en utilidades. No requiere archivo de configuracion separado — se configura directamente via el plugin Vite `@tailwindcss/vite`. Los tokens de diseno (colores, espaciado, tipografia) se definen como variables CSS custom.
- **BaseLayout** (`src/layouts/BaseLayout.astro`): layout principal para paginas publicas. Proporciona metadatos SEO, Open Graph tags, JSON-LD estructurado, View Transitions de Astro, etiquetas `hreflang` para i18n, y el script anti-FOUC para temas.
- **AdminLayout** (`src/layouts/AdminLayout.astro`): layout para el panel admin. Incluye sidebar de navegacion, breadcrumb, tema oscuro forzado, y esta excluido del sitemap.

### 4.2 Capa de Datos

**Ubicacion:** `src/lib/firebase/`, `src/lib/schemas/`

Esta capa gestiona toda la persistencia y validacion de datos.

- **Dos SDKs de Firebase**:
  - **Firebase Admin SDK** (build-time): se usa en el frontmatter de las paginas Astro para consultar Firestore durante `astro build`. Requiere credenciales de servicio.
  - **Firebase Client SDK** (browser): se usa en islas Svelte del panel admin para operaciones CRUD en tiempo real contra Firestore, Storage y Auth.

- **4 colecciones Firestore**: `Projects`, `Technologies`, `Experiences`, `BlogPosts`. Cada coleccion tiene su modulo de acceso con funciones getAll, getById, create, update, delete, y reorder.

- **Esquemas Zod** (Triple Schema Pattern): cada entidad tiene 3 esquemas:
  - **Entity Schema**: tipo completo con ID, para uso interno en la aplicacion.
  - **Firestore Schema**: sin ID, para parsing de documentos Firestore.
  - **Form Schema**: solo campos editables, para validacion de formularios en el admin.

- **Servicio de imagenes** (`image-service.ts`): singleton que gestiona upload (con progreso y reintentos), replace y delete de imagenes en Firebase Storage. Incluye logica de retry con exponential backoff (base 300 ms, 2 reintentos).

- **ImageSlot** (discriminated union): sistema de tipos para gestionar el estado de imagenes de forma type-safe. Los estados posibles son: `empty`, `existing`, `new`, `replaced`, `removed`. Las transiciones entre estados estan estrictamente tipadas.

### 4.3 Capa de Logica

**Ubicacion:** `src/lib/utils/`, `src/data/`, `src/lib/i18n/`

Esta capa contiene la logica de negocio, utilidades y configuracion.

- **Toast store** (`toast-store.svelte.ts`): store global usando Svelte 5 runes. Maximo 3 toasts simultaneos, auto-dismiss con tiempos configurables por tipo (success, error, info), deduplicacion para evitar toasts repetidos.
- **Utilidades puras**: funciones de `slugify` (genera slugs desde el campo EN), formateo de fechas, calculo de tiempo de lectura, sanitizacion de HTML, helpers de TipTap para renderizado de contenido rich text.
- **Configuracion de navegacion** (`src/data/`): definicion de las rutas del sitio con generacion de `href` consciente del locale actual. Separacion entre navegacion publica y admin.
- **Utilidades SEO**: generadores de JSON-LD (Person, CreativeWork), resolucion de imagenes Open Graph, meta tags dinamicos por ruta y locale.
- **Mapeo de errores Firebase**: traduccion de codigos de error de Firebase Auth y Storage a mensajes bilingues (EN/ES) amigables para el usuario.

### 4.4 Capa de Infraestructura

**Ubicacion:** `.github/workflows/`, `firebase.json`, `firestore.rules`, `storage.rules`

Esta capa gestiona el despliegue, la seguridad y la integracion continua.

- **GitHub Actions CI/CD**: pipeline automatizado que ejecuta lint, type-check, tests (con emuladores Firebase), build, Lighthouse CI y deploy en cada push a `main`.
- **Deteccion inteligente de cambios**: analiza `git diff` para determinar si los archivos modificados son relevantes para el codigo. Si solo cambiaron archivos de documentacion o configuracion no critica, se saltan build, Lighthouse y deploy.
- **Firebase Hosting con cache CDN**: assets immutables con cache de 1 anio (`Cache-Control: public, max-age=31536000, immutable`). HTML con cache corto para actualizaciones rapidas tras redeploy.
- **Reglas de seguridad Firestore/Storage**: lectura publica para todos, escritura restringida al UID hardcoded del admin. Sin roles ni sistema de permisos complejos — un unico admin.

---

## 5. Modelo de Datos

### Diagrama de Colecciones y Relaciones

```
┌──────────────────────────────────┐
│          Technologies            │
│  ─────────────────────────────   │
│  id: string                      │
│  name: string (unico)            │
│  image: StoredImage              │
│  experienceYears: number         │
│  order: number                   │
│  createdAt: Timestamp            │
│  updatedAt: Timestamp            │
└──────────────────────────────────┘
              ▲
              │ referencia por nombre
              │
┌──────────────────────────────────┐
│           Projects               │
│  ─────────────────────────────   │
│  id: string                      │
│  companyName: LocalizedString    │
│  description: LocalizedString    │
│  slug: string (desde EN)         │
│  mainImage: StoredImage          │
│  screenshots: StoredImage[]      │
│  technologies: string[] (nombres)│───→ Technology.name
│  featured: boolean               │
│  order: number                   │
│  liveUrl?: string                │
│  repoUrl?: string                │
│  startDate: Timestamp            │
│  endDate?: Timestamp             │
│  createdAt: Timestamp            │
│  updatedAt: Timestamp            │
└──────────────────────────────────┘

┌──────────────────────────────────┐
│          Experiences             │
│  ─────────────────────────────   │
│  id: string                      │
│  companyName: string             │
│  jobName: LocalizedString        │
│  description: LocalizedString    │
│  responsibilities: Localized     │
│    StringArray                   │
│  startDate: Timestamp            │
│  endDate?: Timestamp (nullable)  │
│  createdAt: Timestamp            │
│  updatedAt: Timestamp            │
└──────────────────────────────────┘

┌──────────────────────────────────┐
│          BlogPosts               │
│  ─────────────────────────────   │
│  id: string                      │
│  title: LocalizedString          │
│  content: LocalizedString        │
│    (TipTap JSON)                 │
│  excerpt: LocalizedString        │
│  slug: string (desde EN)         │
│  coverImage?: StoredImage        │
│  images: StoredImage[]           │
│  status: 'published' | 'draft'   │
│  publishedAt?: Timestamp         │
│  createdAt: Timestamp            │
│  updatedAt: Timestamp            │
└──────────────────────────────────┘
```

### Relaciones

- **Project.technologies → Technology.name**: los proyectos referencian tecnologias por nombre (string), no por ID de documento. Esto simplifica la consulta y renderizado sin necesidad de joins.
- **StoredImage** (`{ url: string, storagePath: string }`): tipo compartido para todas las imagenes. `url` es la URL publica del CDN, `storagePath` es la ruta en Firebase Storage (necesaria para operaciones de delete/replace).
- **Esquemas compartidos** (`shared-schemas.ts`):
  - `localizedString`: `{ es: string, en: string }` con validacion de minimo 1 caracter por idioma.
  - `localizedStringArray`: `{ es: string[], en: string[] }` con minimo 1 elemento por idioma.
  - `storedImageSchema`: `{ url: z.url(), storagePath: z.string() }`.

---

## 6. Routing y Navegacion

### Tabla Completa de Rutas (18 rutas)

| Seccion | Ruta EN | Ruta ES | Pagina |
|---|---|---|---|
| Home | `/` | `/es/` | Landing page con seccion hero, proyectos destacados, tecnologias |
| Blog | `/blog` | `/es/blog` | Listado de articulos publicados |
| Blog detalle | `/blog/[slug]` | `/es/blog/[slug]` | Articulo individual con contenido rich text |
| Proyectos | `/projects` | `/es/projects` | Listado de proyectos con filtros |
| Proyecto detalle | `/projects/[slug]` | `/es/projects/[slug]` | Detalle del proyecto con screenshots y tecnologias |
| Contacto | `/contact` | `/es/contact` | Formulario de contacto |
| Admin login | `/admin/login` | — | Pagina de inicio de sesion |
| Admin dashboard | `/admin/` | — | Panel principal de administracion |
| Admin blog | `/admin/blog` | — | CRUD de articulos de blog |
| Admin proyectos | `/admin/projects` | — | CRUD de proyectos |
| Admin tecnologias | `/admin/technologies` | — | CRUD de tecnologias |
| Admin experiencias | `/admin/experiences` | — | CRUD de experiencias laborales |

### Estrategia i18n

- **defaultLocale**: `'en'` — sin prefijo en las URLs (e.g., `/blog`, `/projects`).
- **Locale secundario**: `'es'` — con prefijo `/es/` (e.g., `/es/blog`, `/es/projects`).
- **Configuracion Astro**: `prefixDefaultLocale: false` — el locale por defecto no lleva prefijo.
- **Generacion de slugs**: siempre desde el campo EN del titulo (`slugify(title.en)`), compartido entre ambos idiomas.
- **Deteccion de locale**: `getLocaleFromUrl(url)` extrae el locale del pathname actual.
- **Alternancia de idioma**: cada pagina publica incluye etiquetas `hreflang` y un toggle de idioma que redirige a la version equivalente.
- **Panel admin**: sin i18n, interfaz unica (no localizada).

---

## 7. Autenticacion y Seguridad

### Modelo de Autenticacion

- **Proveedor**: Firebase Auth con metodo email/password unicamente. No se usan proveedores OAuth ni login social.
- **Usuario unico**: un solo administrador. El UID esta hardcoded en las reglas de seguridad de Firestore y Storage.
- **Sin middleware servidor**: al ser un sitio SSG (estatico), no hay middleware del lado del servidor para verificar tokens. La autenticacion es 100 % del lado del cliente.

### Flujo de Autenticacion

1. El usuario accede a cualquier ruta `/admin/*`.
2. `AuthGuard.svelte` (isla Svelte con `client:load`) verifica el estado de autenticacion via `onAuthStateChanged`.
3. Si no esta autenticado, redirige a `/admin/login`.
4. Si esta autenticado, renderiza el contenido protegido.
5. El estado de autenticacion persiste en la sesion del navegador (Firebase Auth persistence).

### Reglas de Seguridad

**Firestore** (`firestore.rules`):

```
match /{document=**} {
  allow read: if true;                           // Lectura publica
  allow write: if request.auth.uid == ADMIN_UID; // Solo admin puede escribir
}
```

**Storage** (`storage.rules`):

```
match /{allPaths=**} {
  allow read: if true;                           // Lectura publica (CDN)
  allow write: if request.auth.uid == ADMIN_UID; // Solo admin puede subir/eliminar
}
```

### Medidas de Seguridad Adicionales

- Las paginas admin estan excluidas del `sitemap.xml`.
- Sanitizacion de HTML con `sanitize-html` (whitelist estricto de tags, atributos y protocolos) para prevenir XSS en contenido de blog.
- TipTap renderer escapa HTML en todos los atributos y texto.
- Los tests E2E verifican que las redirecciones de autenticacion funcionan correctamente (acceso no autorizado redirige a login).

---

## 8. Gestion de Imagenes

### ImageSlot — Maquina de Estados

El sistema usa un **discriminated union** en TypeScript para gestionar el ciclo de vida de cada imagen de forma type-safe:

```
empty ──────→ new (archivo seleccionado)
                │
                └──→ empty (cancelado)

existing ───→ replaced (nuevo archivo) ──→ existing (cancelado)
   │                                    └──→ empty (ambos eliminados)
   └────────→ removed ──────────────────→ existing (deshacer)
```

**Estados**:

| Estado | Descripcion |
|---|---|
| `empty` | Sin imagen asignada |
| `existing` | Imagen ya almacenada en Storage (tiene URL y storagePath) |
| `new` | Archivo nuevo seleccionado, pendiente de subida |
| `replaced` | Imagen existente sera reemplazada por un archivo nuevo |
| `removed` | Imagen existente marcada para eliminacion |

### Servicio de Imagenes (`image-service.ts`)

Singleton que gestiona todas las operaciones con Firebase Storage:

- **Upload**: `uploadBytesResumable` con seguimiento de progreso. Incluye logica de reintentos (2 intentos con exponential backoff, base 300 ms).
- **Replace**: elimina la imagen anterior y sube la nueva en una sola operacion.
- **Delete**: elimina una imagen individual por su `storagePath`.
- **Delete by prefix**: elimina todas las imagenes bajo un prefijo (usado para limpiar todas las imagenes de una entidad).

### ScreenshotManager

Componente especializado para gestionar multiples imagenes por proyecto. Permite agregar, reordenar (drag-and-drop con SortableJS) y eliminar screenshots de forma interactiva.

### Limpieza de Imagenes Huerfanas

Script `orphan-cleanup.ts` que compara las imagenes en Storage con las referenciadas en Firestore. Las imagenes sin referencia (huerfanas) se eliminan para mantener el almacenamiento limpio.

### Procesamiento en Build-time

**Sharp** se usa durante `astro build` para optimizar imagenes: redimensionamiento, conversion de formato y compresion. Las imagenes procesadas se sirven como assets estaticos con cache inmutable.

---

## 9. Estrategia de Testing

### Tres Niveles de Testing

#### Nivel 1 — Tests Unitarios (Vitest)

- **44 archivos de test**, mas de **500 assertions**.
- **Ubicacion**: `src/**/__tests__/`
- **Alcance**:
  - Esquemas Zod: validacion de todos los campos, casos limite, tipos invalidos.
  - Capa Firebase: operaciones CRUD con emuladores, servicio de imagenes, manejo de errores.
  - Componentes Svelte: renderizado con Testing Library, interacciones de usuario, estados.
  - Utilidades: slugify, formateo de fechas, tiempo de lectura, sanitizacion HTML.
  - i18n: traducciones, deteccion de locale, generacion de rutas.
  - Factories: generacion de datos de test consistentes para cada entidad.

#### Nivel 2 — Tests E2E (Playwright)

- **20 archivos spec**, organizados en dos proyectos.
- **Ubicacion**: `tests/e2e/`
- **Proyectos**:
  - `public`: paginas publicas — navegacion, blog, proyectos, contacto, responsive, SEO, a11y.
  - `admin`: panel admin — flujo de autenticacion, operaciones CRUD completas.
- **Incluye**:
  - Tests de accesibilidad con `@axe-core/playwright` (WCAG AA).
  - Tests de rendimiento.
  - Tests de SEO (meta tags, hreflang, sitemap).
  - Tests responsive (mobile, tablet, desktop).

#### Nivel 3 — Rendimiento (Lighthouse CI)

- **Umbrales**: >= 0.95 para las 4 categorias (Performance, Accessibility, Best Practices, SEO).
- **Excepcion**: Performance relajado a >= 0.70 para paginas de detalle dinamicas (`/projects/[slug]`, `/blog/[slug]`) debido a la carga de imagenes.
- **Exclusion**: las paginas admin no se auditan con Lighthouse.

### Datos de Test

- **Factory functions**: funciones generadoras para cada entidad (`createTestProject`, `createTestTechnology`, etc.) que producen datos validos y consistentes.
- **Emuladores Firebase**: tanto los tests unitarios como los de CI usan emuladores locales de Firebase (Auth, Firestore, Storage) para evitar dependencias externas.

---

## 10. CI/CD Pipeline

### Pipeline de GitHub Actions

El pipeline se ejecuta en cada push a la rama `main` y sigue estos pasos en orden:

```
Push a main
  │
  ├─ 1. Checkout (historial completo con fetch-depth: 0)
  │
  ├─ 2. Setup
  │     ├── pnpm 10 (via corepack)
  │     └── Node.js (version desde .nvmrc)
  │
  ├─ 3. Deteccion inteligente de cambios
  │     └── git diff para identificar archivos de codigo modificados
  │         (ignora *.md, docs/, _bmad/, etc.)
  │
  ├─ 4. Quality gates ─────────── SIEMPRE se ejecutan
  │     ├── ESLint (lint)
  │     └── astro check (type-check)
  │
  ├─ 5. Tests unitarios ────────── SIEMPRE se ejecutan
  │     ├── Vitest con Firebase Emulators
  │     └── Cobertura de esquemas, firebase, utils, componentes
  │
  ├─ 6. Build ──────────────────── CONDICIONAL (si hay cambios en codigo)
  │     ├── pnpm build con secretos de Firebase inyectados
  │     └── Output: dist/ con HTML estatico + assets
  │
  ├─ 7. Lighthouse CI ─────────── CONDICIONAL (si hay cambios en codigo)
  │     ├── Audita paginas publicas (excluye admin)
  │     └── Umbrales: >= 0.95 en 4 categorias
  │
  └─ 8. Deploy ─────────────────── CONDICIONAL (si hay cambios en codigo)
        ├── firebase deploy --only hosting
        └── Canal: live (produccion, CDN global)
```

### Deteccion Inteligente de Cambios

El paso 3 analiza los archivos modificados con `git diff` para determinar si el pipeline necesita ejecutar build, Lighthouse y deploy. Si solo se modificaron archivos que no afectan al codigo (documentacion, configuracion de BMad, archivos de retrospectiva, etc.), estos pasos costosos se saltan para ahorrar tiempo y recursos de CI.

### Secretos Requeridos

| Secreto | Uso |
|---|---|
| `FIREBASE_SERVICE_ACCOUNT` | Credenciales de servicio para build-time queries y deploy |
| `FIREBASE_API_KEY` | Configuracion del cliente Firebase |
| `FIREBASE_AUTH_DOMAIN` | Dominio de autenticacion |
| `FIREBASE_PROJECT_ID` | ID del proyecto Firebase |
| `FIREBASE_STORAGE_BUCKET` | Bucket de almacenamiento |
| `FIREBASE_MESSAGING_SENDER_ID` | ID del emisor de mensajes |
| `FIREBASE_APP_ID` | ID de la aplicacion Firebase |
| `LHCI_GITHUB_APP_TOKEN` | Token para Lighthouse CI (opcional) |
