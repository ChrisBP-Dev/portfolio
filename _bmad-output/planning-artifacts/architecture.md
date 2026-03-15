---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
status: 'complete'
completedAt: '2026-03-15'
inputDocuments:
  - '_bmad-output/planning-artifacts/product-brief-portfolio-2026-03-15.md'
  - '_bmad-output/planning-artifacts/prd.md'
  - '_bmad-output/planning-artifacts/prd-validation-report.md'
  - '_bmad-output/planning-artifacts/ux-design-specification.md'
  - '_bmad-output/planning-artifacts/research/technical-migracion-flutter-web-research-2026-03-15.md'
  - '_bmad-output/project-context.md'
  - 'docs/index.md'
  - 'docs/project-overview.md'
  - 'docs/architecture.md'
  - 'docs/component-inventory.md'
  - 'docs/data-models.md'
  - 'docs/deployment-guide.md'
  - 'docs/development-guide.md'
  - 'docs/source-tree-analysis.md'
workflowType: 'architecture'
project_name: 'portfolio'
user_name: 'Christopher'
date: '2026-03-15'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements (49 FRs en 10 categorías):**

| Categoría | FRs | Implicación Arquitectónica |
|---|---|---|
| Visualización Pública | FR1-FR9 | Páginas SSG con datos de Firestore en build time, rutas dinámicas `/projects/[slug]`, `/blog/[slug]` |
| i18n y Personalización | FR10-FR14 | Sistema de i18n pervasivo con routing por locale, hreflang, campos bilingües en modelos |
| Auth y Control de Acceso | FR15-FR18 | Middleware de auth, ruta `/admin` protegida, sesión persistente |
| CRUD Projects (Admin) | FR19-FR22 | Formularios complejos con múltiples imágenes, relaciones con tecnologías, campos bilingües |
| CRUD Technologies (Admin) | FR23-FR26 | CRUD simple con imagen única |
| CRUD Experiences (Admin) | FR27-FR30 | CRUD sin imágenes, campos bilingües |
| CRUD Blog (Admin) | FR31-FR37 | Editor rico con imágenes embebidas, slugs, estado publicado/borrador |
| Gestión de Imágenes | FR38-FR41 | Servicio centralizado de lifecycle: upload, reemplazo con limpieza automática, eliminación en cascada |
| SEO y Compartibilidad | FR42-FR46 | Meta tags dinámicos por página, OpenGraph, sitemap, robots.txt, structured data |
| Open Source | FR47-FR49 | Variables de entorno, `.env.example`, cero secrets en código |

**Non-Functional Requirements (29 NFRs en 5 categorías):**

| Categoría | NFRs | Drivers Arquitectónicos |
|---|---|---|
| Performance (NFR1-7) | LCP <1.5s, INP <100ms, CLS <0.05, TTFB <200ms, Bundle <50KB | SSG con CDN, imágenes optimizadas (WebP/AVIF), lazy loading, zero JS por defecto (Astro) |
| Security (NFR8-13) | Auth en todas las rutas admin, Firestore/Storage Rules, cero secrets | Firebase Auth client-side, Firestore Security Rules, variables de entorno |
| Accessibility (NFR14-19) | WCAG 2.1 AA, navegación teclado, contraste 4.5:1, skip nav | HTML semántico nativo (Astro), ARIA landmarks, alt text en imágenes dinámicas |
| Code Quality (NFR20-25) | Tests >80%, TypeScript strict, Lighthouse CI | Vitest + Playwright, GitHub Actions pipeline, quality gates automáticos |
| Integration (NFR26-29) | Firebase Auth/Firestore/Storage estables, hosting estático | Client SDK para admin + Admin SDK para build, queries indexadas, retry en operaciones de Storage |

### Scale & Complexity

- **Dominio primario:** Web full-stack (SSG + SPA islands + Firebase BaaS)
- **Nivel de complejidad:** Baja-Media — sin regulaciones, single-tenant, un usuario admin, datos moderados
- **Componentes arquitectónicos estimados:** ~14 componentes principales
- **Usuarios concurrentes esperados:** Bajo (<100 simultáneos — portfolio personal)
- **Volumen de datos:** Bajo (~20-50 documentos en Firestore, <500MB en Storage)

### Technical Constraints & Dependencies

| Constraint | Origen | Impacto Arquitectónico |
|---|---|---|
| **Firebase como backend** | Proyecto existente en producción | No migrar backend — integrar Firestore, Auth y Storage con Astro SSR |
| **Astro 6 como framework** | Decisión de research técnico + evaluación de starter | Islands Architecture, zero JS default, SSG output, file-based routing |
| **Svelte 5 para islands** | Research + mínimo bundle | Componentes interactivos (admin forms, editor blog, theme toggle) |
| **TypeScript strict** | NFR22 | Type-safety completo, interfaces para modelos de datos |
| **Firebase Hosting** | Infraestructura existente, gratis (Spark plan) | Hosting estático con CDN, sin server runtime necesario |
| **Datos bilingües en Firestore** | Nested objects (`field: { es, en }`) — schema nuevo | Migración one-time desde patrón Flutter (`fieldEs`/`fieldEn`) al esquema profesional |
| **Poppins como fuente** | Diseño existente | Google Fonts con font-display swap y preload |
| **Breakpoints 450/600/900px** | UX spec + proyecto actual | Tailwind CSS con breakpoints custom |

### Cross-Cutting Concerns Identified

| Concern | Alcance | Componentes Afectados |
|---|---|---|
| **Internacionalización (i18n)** | Pervasivo | Todas las páginas, modelos de datos, routing, meta tags, structured data |
| **Autenticación** | Admin | Firebase Auth client-side, Firestore Security Rules, protección de rutas en Svelte islands |
| **Image Lifecycle Management** | CRUD entities | Projects, Technologies, Blog — upload, reemplazo con limpieza, eliminación en cascada |
| **SEO** | Todas las páginas públicas | Meta tags, OpenGraph, hreflang, sitemap, robots.txt, JSON-LD |
| **Theme (Dark/Light)** | Todo el UI | CSS variables, persistencia de preferencia, respeto a prefers-color-scheme |
| **Responsive Design** | Todos los componentes | Tailwind breakpoints, layouts adaptivos, imágenes responsive |
| **Error Handling** | Todo el sistema | Firebase errors, network errors, validation errors — UI consistente |
| **Caching** | Páginas estáticas | CDN de Firebase Hosting (automático para archivos estáticos) |

## Starter Template Evaluation

### Primary Technology Domain

Web full-stack (SSG + SPA islands) basado en el análisis de requisitos: sitio público estático generado en build time con panel de administración interactivo (Svelte islands) y backend Firebase existente.

### Starter Options Considered

| Starter | Versión | Evaluación |
|---|---|---|
| **`npm create astro@latest` (minimal)** | Astro 6.0 (marzo 2026) | Último estable, Live Content Collections, Cloudflare Workers first-class, control total. Más setup manual pero sin opiniones innecesarias |
| **casoon/astro-v5-template** | Astro 5.15.4, Svelte 5.43.5, Tailwind 4.1.17 | Production-ready con monorepo y componentes, pero Astro 5 sin Live Content Collections. Requeriría upgrade eventual |
| **ntsd/astro-svelte-tailwind** | Astro + Svelte 5 + Tailwind + DaisyUI | Svelte + Tailwind preconfigurado pero incluye DaisyUI (innecesario) y posiblemente desactualizado |
| **mateothegreat/svelte5-astro-blog-starter** | Astro + Svelte 5 + Blog | Blog funcional incluido pero muy específico, sin Firebase ni admin |

### Selected Starter: `npm create astro@latest` (Astro 6.0 minimal)

**Rationale for Selection:**

1. **Astro 6.0** se lanzó el 10 de marzo de 2026 — última versión estable con dev server rediseñado
2. **Proyecto greenfield** — Sin código Astro existente que migrar, por lo que no hay riesgo de breaking changes
3. **SSG puro** — Output estático perfecto para Firebase Hosting, sin necesidad de adapters SSR
4. **Requisitos específicos** (Firebase, i18n bilingüe, admin SPA, blog con editor rico) que ningún template comunitario cubre completamente
5. **Control total** sobre la arquitectura sin opiniones de terceros que limpiar

**Initialization Command:**

```bash
npm create astro@latest portfolio -- --template minimal --yes
cd portfolio
npx astro add svelte tailwind
npm install -D vitest playwright @playwright/test
npm install firebase firebase-admin
```

**Architectural Decisions Provided by Starter:**

**Language & Runtime:**
- TypeScript strict mode (configurable en `tsconfig.json` — Astro ofrece templates `base`, `strict`, `strictest`)
- Node 22+ requerido por Astro 6
- Zod 4 para validación de schemas

**Styling Solution:**
- Tailwind CSS v4.1 via Vite plugin (configuración CSS-first, sin archivo `tailwind.config.js`)
- CSS-first configuration — tokens y customización definidos directamente en CSS con `@theme`

**Build Tooling:**
- Vite integrado en Astro con Environment API (paridad dev/prod)
- Builds optimizados automáticos con tree-shaking, minificación y code-splitting
- Experimental Rust compiler disponible para builds más rápidos

**Testing Framework:**
- Vitest para unit tests (configuración compartida con Vite via `getViteConfig()`)
- Playwright para E2E tests cross-browser

**Code Organization:**
- `src/pages/` — File-based routing (obligatorio en Astro)
- `src/components/` — Componentes .astro (estáticos) y .svelte (islands interactivas)
- `src/layouts/` — Layouts compartidos (BaseLayout, AdminLayout)
- `src/lib/` — Lógica de negocio, servicios Firebase, utilidades
- `src/content/` — Content Collections (si se usa para contenido estático)

**Development Experience:**
- Hot Module Replacement con paridad real dev/prod
- Dev server rediseñado con Vite Environment API

**Note:** La inicialización del proyecto usando este comando debería ser la primera story de implementación.

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (Block Implementation):**

1. Output mode: SSG (Static Site Generation) — HTML estático servido desde Firebase Hosting CDN
2. Hosting: Firebase Hosting (infraestructura existente, gratis Spark plan)
3. Data flow público: Admin SDK consulta Firestore en build time → HTML estático
4. Data flow admin: Svelte 5 islands → Firebase client SDK → Firestore directo
5. Auth: Firebase Auth client SDK + Firestore/Storage Security Rules (sin server-side)
6. Image management: StoredImage + ImageSlot (discriminated union) + ImageService centralizado
7. Blog editor: TipTap (editor rico en Svelte island)

**Important Decisions (Shape Architecture):**

8. i18n: Astro i18n nativo con campos bilingües en Firestore
9. SEO: Meta tags estáticos generados en build time (óptimo con SSG)
10. CI/CD: GitHub Actions → build → test → Lighthouse → firebase deploy
11. Screenshots: UUIDs en Storage paths, orden via array position en Firestore

**Deferred Decisions (Post-MVP):**

- Analytics dashboard (Phase 2)
- Formulario de contacto con envío real de email (Phase 2)
- PWA / modo offline (Phase 3)

### Data Architecture

| Decisión | Elección | Rationale |
|---|---|---|
| **Base de datos** | Firebase Firestore (existente) | Proyecto `portfolio-chrisbp` en producción con datos reales |
| **Colecciones** | `Projects`, `Technologies`, `Experiences`, `BlogPosts` | Mantener 3 existentes + 1 nueva para blog |
| **Modelado bilingüe** | Nested object por locale (`field: { es, en }`) | Profesional, escalable, acceso directo `field[locale]` con autocompletado TypeScript |
| **Validación** | Zod 4 schemas | Type-safe, compartidos entre build scripts y admin UI |
| **Data fetch (público)** | Admin SDK en build time (`astro build`) | Consulta Firestore y genera HTML estático para todas las páginas públicas |
| **Data fetch (admin)** | Firebase client SDK en Svelte islands | CRUD directo desde el browser, protegido por Security Rules |
| **Actualización de contenido** | Rebuild via GitHub Actions | Dispatch manual o webhook post-cambio. ~2-3 min para reflejar cambios |
| **Caching** | CDN de Firebase Hosting (automático) | HTML estático servido desde edge, sin configuración adicional |

**Modelos Firestore (schema profesional — nested localization, tipos correctos):**

```
Projects/{projectId}
├── companyName: { es: string, en: string }
├── shortDescription: { es: string, en: string }
├── features: { es: string[], en: string[] }
├── mainImage: StoredImage         # { url, storagePath }
├── screenshots: StoredImage[]     # Orden = posición en array, paths con UUID
├── websiteUrl: string?
├── sourceCodeUrl: string?
├── technologies: string[]         # Technology IDs
├── slug: string                   # Para URL /projects/[slug]

Technologies/{technologyId}
├── name: string                   # No bilingüe (nombres de tecnologías son universales)
├── image: StoredImage
├── experienceYears: number        # Numérico — la UI formatea "3 años" / "3 years"

Experiences/{experienceId}
├── companyName: string            # No bilingüe (nombres de empresas son universales)
├── jobName: { es: string, en: string }
├── responsibilities: { es: string[], en: string[] }  # Array, NO string
├── startDate: Timestamp
├── endDate: Timestamp | null      # null = actualmente trabajando

BlogPosts/{postId}
├── title: { es: string, en: string }
├── content: { es: string, en: string }   # HTML sanitizado del editor TipTap
├── slug: string                   # Único, URL-friendly
├── coverImage: StoredImage        # { url, storagePath }
├── images: StoredImage[]          # Imágenes embebidas en contenido
├── status: 'published' | 'draft'
├── createdAt: Timestamp
├── updatedAt: Timestamp
```

**Patrón de localización — nested object (NO sufijos):**

```typescript
// Tipo reutilizable para campos bilingües
type Localized<T> = { es: T; en: T };

// Uso en schemas y modelos
companyName: Localized<string>     // { es: "Mi Empresa", en: "My Company" }
features: Localized<string[]>      // { es: ["feat1"], en: ["feat1"] }
responsibilities: Localized<string[]>

// Acceso directo — sin helper, con autocompletado TypeScript
project.companyName[locale]        // ← simple, type-safe, escalable
```

### Data Migration Strategy

**Contexto:** Los datos existentes en Firestore (`portfolio-chrisbp`) usan el schema del proyecto Flutter (sufijos `fieldEs`/`fieldEn`, `ImageAndPath`, `responsabilities` como string, `date` como string, `experienceTime` como string). El nuevo schema es incompatible.

**Estrategia: Script de migración one-time ejecutado antes del primer deploy.**

```typescript
// src/lib/scripts/migrate-firestore-data.ts
// Ejecutar UNA VEZ: npx ts-node src/lib/scripts/migrate-firestore-data.ts

// 1. Leer todos los documentos con schema viejo
// 2. Transformar al schema nuevo:
//    - companyNameEs/En → companyName: { es, en }
//    - featuresES/EN → features: { es, en }
//    - responsabilitiesEs/En → responsibilities: { es: [split por items], en: [...] }
//    - date: "2023 - Present" → startDate: Timestamp, endDate: null
//    - experienceTime: "3 years" → experienceYears: 3
//    - ImageAndPath → StoredImage (mantener url y refPath→storagePath)
//    - screenshots index paths → mantener paths existentes (no renombrar en Storage)
// 3. Escribir documentos transformados (batch write)
// 4. Verificar integridad: contar docs migrados vs originales
```

**Safety guarantees:**

| Riesgo | Mitigación |
|---|---|
| **Pérdida de datos** | Script lee primero, transforma en memoria, escribe después. No elimina documentos originales hasta verificación |
| **Imágenes rotas** | Los Storage paths NO cambian — solo se renombra el campo (`refPath` → `storagePath`). Las URLs siguen funcionando |
| **Screenshots desordenados** | Los paths `screenshots/0-image.webp` se mantienen. Solo cambia la estructura del documento, no los archivos en Storage |
| **Rollback** | Exportar colecciones antes de migrar con `firebase firestore:export`. Restore posible en cualquier momento |
| **Validación** | Post-migración: leer cada documento y validar contra Zod schema nuevo. Si falla → abortar y reportar |
| **Idempotencia** | El script detecta si un documento ya tiene el schema nuevo (tiene `companyName.es`) y lo salta |

**Orden de ejecución:**

1. `firebase firestore:export gs://portfolio-chrisbp-backup` — Backup completo
2. `npx ts-node src/lib/scripts/migrate-firestore-data.ts` — Migrar
3. Verificar manualmente en Firebase Console que los datos se ven correctos
4. Build del sitio Astro → si compila y genera páginas correctas, migración exitosa
5. Deploy

**Image Management Architecture (diseño profesional — NO replicar patrón Flutter):**

**Principio:** Separar completamente lo que se persiste en Firestore de lo que maneja la UI.

**StoredImage — modelo Firestore (solo metadata persistente):**

```typescript
interface StoredImage {
  url: string;          // URL pública de descarga
  storagePath: string;  // Path completo en Storage (para eliminación)
}
```

**ImageSlot — estado de UI (discriminated union explícito):**

```typescript
type ImageSlot =
  | { type: 'empty' }
  | { type: 'existing'; image: StoredImage }
  | { type: 'new'; file: File; preview: string }
  | { type: 'replaced'; old: StoredImage; file: File; preview: string }
  | { type: 'removed'; old: StoredImage }
```

**ImageService — servicio centralizado con orden de operaciones seguro:**

```typescript
class ImageService {
  async upload(file: File, path: string): Promise<StoredImage>
  async replace(old: StoredImage, file: File, newPath: string): Promise<StoredImage>
  async delete(image: StoredImage): Promise<void>
  async deleteByPrefix(pathPrefix: string): Promise<void>
}
```

**Orden de operaciones al reemplazar (safe-first):**

1. Upload nuevo archivo → obtener URL
2. Actualizar documento Firestore con nueva StoredImage
3. Eliminar archivo viejo de Storage

Si falla paso 1 → nada cambió. Si falla paso 2 → huérfano nuevo (menor mal), viejo sigue funcionando. Si falla paso 3 → huérfano viejo (limpiable), sitio muestra imagen correcta.

**Screenshots con UUID — reordenamiento libre:**

- Storage paths: `projects/{projectId}/screenshots/{uuid}.webp` — nunca cambian
- Firestore: `screenshots: StoredImage[]` — el orden del array es el orden visual
- Reordenar = cambiar posiciones en el array. Zero operaciones en Storage
- Eliminar screenshot = quitar del array + eliminar de Storage

**Flujo completo de guardado (submit en admin):**

1. Procesar cada ImageSlot: `new` → upload, `replaced` → upload nuevo, `removed` → marcar, `existing` → sin cambios
2. Construir documento Firestore con StoredImages resultantes
3. Guardar documento en Firestore
4. Cleanup: eliminar imágenes viejas de slots `replaced` y `removed`

### Authentication & Security

| Decisión | Elección | Rationale |
|---|---|---|
| **Auth provider** | Firebase Auth (email/password) | Un solo admin, sin registro público |
| **Auth pattern** | Firebase client SDK directo | Sin session cookies ni server-side — Security Rules protegen los datos |
| **Protección de rutas admin** | Client-side auth check en Svelte islands | No autenticado → redirect a login. Admin es SPA client-side |
| **Firestore Rules** | Lectura pública, escritura solo para UID admin | Suficiente para single-admin portfolio |
| **Storage Rules** | Lectura pública, upload/delete solo para UID admin | Imágenes públicas, gestión restringida |
| **Secrets en código** | Zero — variables de entorno | Client config (public) en `.env` con `PUBLIC_` prefix, Admin SDK solo en CI/CD build |

**Firestore Security Rules:**

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

### API & Communication Patterns

| Decisión | Elección | Rationale |
|---|---|---|
| **Server endpoints** | No necesarios | Admin usa Firebase client SDK directo, público es SSG |
| **CRUD operations** | Firebase client SDK en Svelte islands | `addDoc()`, `updateDoc()`, `deleteDoc()` directo desde browser |
| **Image upload** | Firebase Storage client SDK | `uploadBytes()` + `getDownloadURL()` desde Svelte |
| **Error handling** | Try/catch en operaciones Firebase → UI feedback | Errores mapeados a mensajes user-friendly en ES/EN |
| **Contact form** | Redirect directo a WhatsApp/mailto | Sin server-side processing |

### Frontend Architecture

| Decisión | Elección | Rationale |
|---|---|---|
| **Output mode** | `output: 'static'` (SSG puro) | HTML estático desde CDN, zero server runtime |
| **State management** | Svelte 5 Runes (`$state`, `$derived`, `$effect`) | Estado local por island, sin store global |
| **Components .astro** | Todo lo estático: layouts, páginas, sections, cards, nav, footer | Zero JS al browser |
| **Components .svelte** | Solo interactividad: admin forms, blog editor, theme/lang toggle, image viewer, contact form | Hidratación selectiva con `client:load` o `client:visible` |
| **Blog editor** | TipTap (Svelte wrapper) | Editor rico maduro, HTML limpio, extensiones para code blocks e imágenes |
| **Image optimization** | Astro `<Image />` para assets locales, `<img loading="lazy">` para Firebase Storage URLs | Build-time optimization + lazy loading |
| **Fonts** | Google Fonts (Poppins) con `font-display: swap` y preload | Performance óptima |

**Routing (Astro i18n nativo):**

```
src/pages/
├── index.astro                    # Home ES (default)
├── en/index.astro                 # Home EN
├── projects/index.astro           # Projects list ES
├── projects/[slug].astro          # Project detail ES
├── en/projects/index.astro        # Projects list EN
├── en/projects/[slug].astro       # Project detail EN
├── blog/index.astro               # Blog list ES
├── blog/[slug].astro              # Blog post ES
├── en/blog/index.astro            # Blog list EN
├── en/blog/[slug].astro           # Blog post EN
├── contact.astro                  # Contact ES
├── en/contact.astro               # Contact EN
├── admin/
│   ├── index.astro                # Dashboard (sin i18n)
│   ├── login.astro                # Login
│   ├── projects.astro             # CRUD Projects
│   ├── technologies.astro         # CRUD Technologies
│   ├── experiences.astro          # CRUD Experiences
│   └── blog.astro                 # CRUD Blog
```

### Infrastructure & Deployment

| Decisión | Elección | Rationale |
|---|---|---|
| **Hosting** | Firebase Hosting (`portfolio-chrisbp`) | Infraestructura existente, CDN incluido, gratis (Spark plan) |
| **CI/CD** | GitHub Actions | Build → lint → type-check → test → Lighthouse CI → firebase deploy |
| **Deploy** | `firebase deploy --only hosting` | Output `dist/` de Astro → Firebase Hosting |
| **Environment vars** | `.env` local + GitHub Secrets para CI | `PUBLIC_FIREBASE_*` (client config) + `FIREBASE_*` (Admin SDK para build) |
| **Rebuild trigger** | `gh workflow dispatch` manual | Christopher dispara rebuild después de actualizar contenido en admin |
| **Monitoring** | Firebase Analytics (opcional) | Gratis, integrado. No prioridad MVP |
| **Domain** | `portfolio-chrisbp.web.app` (default) | Custom domain configurable post-MVP |
| **Cost** | $0 — Firebase Spark plan (gratis, sin tarjeta) | Auth 50K MAU, Firestore 50K reads/día, Storage 5GB, Hosting 10GB/mes |

**GitHub Actions Pipeline:**

```
on push to main:
  → pnpm install
  → pnpm lint && pnpm type-check
  → pnpm test (Vitest)
  → pnpm build (Astro SSG — queries Firestore via Admin SDK)
  → Lighthouse CI (>95 en 4 categorías)
  → firebase deploy --only hosting

on workflow_dispatch:
  → Same pipeline (rebuilds manuales post-actualización de contenido)
```

### Decision Impact Analysis

**Implementation Sequence:**

1. Init proyecto Astro 6 + integraciones (Svelte, Tailwind)
2. Configurar Firebase SDKs (client + admin para build)
3. Definir Zod schemas (modelos con nested localization)
4. **Migrar datos Firestore** (script one-time: Flutter schema → schema profesional)
5. Configurar i18n y routing
6. Implementar layouts y componentes estáticos
7. Implementar páginas públicas con data de Firestore (build time)
8. Implementar admin (Svelte islands + Firebase client SDK)
9. Implementar Image Service (StoredImage + ImageSlot + ImageService)
10. Implementar blog (editor TipTap + CRUD)
11. SEO (meta tags, OpenGraph, sitemap, structured data)
12. Testing (Vitest + Playwright)
13. CI/CD (GitHub Actions + Firebase deploy)

**Cross-Component Dependencies:**

- Firebase client SDK → Admin UI, Auth
- Firebase Admin SDK → Build scripts (SSG data fetch)
- Zod schemas → Validación en admin + build scripts
- ImageService → Projects admin, Technologies admin, Blog admin
- i18n → Todas las páginas públicas, modelos de datos

## Implementation Patterns & Consistency Rules

### Puntos de Conflicto Identificados

12 áreas donde agentes de IA podrían decidir diferente si no se especifica.

### Naming Patterns

**Firestore Collections & Fields:**

```
Colecciones:  PascalCase plural    → Projects, Technologies, Experiences, BlogPosts
Campos:       camelCase            → companyName, shortDescription, slug
Campos i18n:  nested object        → companyName: { es: "...", en: "..." }
Campos lista: nested object        → features: { es: [...], en: [...] }
Numéricos:    camelCase            → experienceYears: 3
Fechas:       Timestamp nativo     → startDate, endDate, createdAt, updatedAt
IDs:          auto-generated       → Firestore auto-ID (no UUIDs manuales)
```

**Storage Paths:**

```
Imágenes:     kebab-case con UUID  → projects/{projectId}/screenshots/{uuid}.webp
Prefijos:     por entidad          → projects/, technologies/, blog/
Formato:      siempre .webp        → convertir antes de subir si es necesario
```

**Archivos TypeScript/Astro/Svelte:**

```
Páginas Astro:        kebab-case     → src/pages/projects/[slug].astro
Componentes Astro:    PascalCase     → src/components/ProjectCard.astro
Componentes Svelte:   PascalCase     → src/components/admin/ProjectForm.svelte
Layouts:              PascalCase     → src/layouts/BaseLayout.astro
Lib/Services:         kebab-case     → src/lib/firebase/image-service.ts
Types/Interfaces:     kebab-case     → src/lib/types/project.ts
Schemas Zod:          kebab-case     → src/lib/schemas/project-schema.ts
Tests:                mismo nombre   → src/lib/firebase/__tests__/image-service.test.ts
```

**TypeScript Code:**

```typescript
// Variables y funciones: camelCase
const projectData = await getProjects();
function formatDate(date: Date): string { ... }

// Tipos e interfaces: PascalCase
interface StoredImage { url: string; storagePath: string; }
type ImageSlot = { type: 'empty' } | { type: 'existing'; image: StoredImage };

// Constantes: UPPER_SNAKE_CASE
const ADMIN_UID = import.meta.env.PUBLIC_ADMIN_UID;
const MAX_SCREENSHOTS = 10;

// Zod schemas: camelCase con sufijo Schema
const projectSchema = z.object({ ... });
const blogPostSchema = z.object({ ... });

// Enums/union literals: camelCase valores
type PostStatus = 'published' | 'draft';
type SendThrough = 'email' | 'whatsapp';
```

### Structure Patterns

**Organización del proyecto:**

```
src/
├── pages/                    # Astro file-based routing (SOLO páginas)
│   ├── index.astro
│   ├── en/
│   ├── projects/
│   ├── blog/
│   ├── contact.astro
│   └── admin/
├── components/               # Organizados por dominio
│   ├── common/               # Reutilizables (Button, Card, etc.)
│   ├── home/                 # Específicos de home
│   ├── projects/             # Específicos de projects
│   ├── blog/                 # Específicos de blog
│   ├── contact/              # Específicos de contact
│   ├── layout/               # Header, Footer, Nav, SkipNav
│   └── admin/                # Todos los componentes admin (Svelte)
├── layouts/                  # Layouts Astro (BaseLayout, AdminLayout)
├── lib/                      # Lógica de negocio
│   ├── firebase/             # Firebase services
│   │   ├── client.ts         # Firebase client SDK init
│   │   ├── admin.ts          # Firebase Admin SDK init (solo build)
│   │   ├── image-service.ts  # ImageService centralizado
│   │   └── collections.ts    # Helpers tipados para cada colección
│   ├── schemas/              # Zod schemas (source of truth para tipos)
│   ├── types/                # TypeScript types derivados de schemas
│   ├── utils/                # Utilidades puras (formatDate, slugify, etc.)
│   └── i18n/                 # Traducciones estáticas y helpers
├── styles/                   # CSS global y Tailwind config
│   └── global.css            # @theme tokens, font imports
└── assets/                   # Imágenes estáticas optimizadas por Astro
```

**Regla: Componentes .astro vs .svelte:**

```
.astro → Estático. Zero JS. Para: layouts, secciones, cards, listas, SEO head.
         Recibe datos como props. No tiene estado ni eventos.

.svelte → Interactivo. JS enviado al browser. Para: formularios, toggles,
          editores, image viewers, cualquier cosa que responda a user input.
          Usa client:load (visible inmediato) o client:visible (lazy).
```

**Regla: Tests co-locados en `__tests__/`:**

```
src/lib/firebase/image-service.ts
src/lib/firebase/__tests__/image-service.test.ts

src/lib/utils/format-date.ts
src/lib/utils/__tests__/format-date.test.ts

tests/e2e/                    # Playwright E2E tests (raíz del proyecto)
├── public-navigation.spec.ts
├── admin-crud.spec.ts
└── blog-editor.spec.ts
```

### Format Patterns

**Zod schemas como source of truth:**

```typescript
// src/lib/schemas/shared-schemas.ts
import { z } from 'zod';

// Schemas reutilizables para localización
const localeSchema = z.enum(['es', 'en']);
const localizedString = z.object({ es: z.string().min(1), en: z.string().min(1) });
const localizedStringArray = z.object({ es: z.array(z.string()), en: z.array(z.string()) });

export const storedImageSchema = z.object({
  url: z.string().url(),
  storagePath: z.string().min(1),
});

export type Locale = z.infer<typeof localeSchema>;
export type StoredImage = z.infer<typeof storedImageSchema>;

// src/lib/schemas/project-schema.ts
export const projectSchema = z.object({
  id: z.string(),
  companyName: localizedString,
  shortDescription: localizedString,
  features: localizedStringArray,
  mainImage: storedImageSchema,
  screenshots: z.array(storedImageSchema),
  websiteUrl: z.string().url().optional(),
  sourceCodeUrl: z.string().url().optional(),
  technologies: z.array(z.string()),
  slug: z.string().min(1),
});

export type Project = z.infer<typeof projectSchema>;

// Acceso directo a campos bilingües — sin helper
// project.companyName[locale]  → string, con autocompletado
// project.features[locale]     → string[], con autocompletado
```

**Campos bilingües — acceso directo (sin helper):**

```typescript
// Con nested objects, el acceso es directo y type-safe:
project.companyName[locale]        // → string
project.features[locale]           // → string[]
experience.responsibilities[locale] // → string[]
blogPost.title[locale]             // → string

// No se necesita helper de localización — TypeScript valida todo
// El tipo Locale = 'es' | 'en' se define en shared-schemas.ts
```

**Dates — siempre Firestore Timestamps, display con Intl:**

```typescript
// Firestore: Timestamp nativo
createdAt: serverTimestamp();

// Display: Intl.DateTimeFormat (respeta locale)
function formatDate(timestamp: Timestamp, locale: Locale): string {
  return new Intl.DateTimeFormat(locale, { dateStyle: 'long' }).format(
    timestamp.toDate(),
  );
}
```

### Process Patterns

**Loading states en Svelte 5 — patrón consistente:**

```svelte
<script lang="ts">
  let loading = $state(false);
  let error = $state<string | null>(null);

  async function handleSubmit() {
    loading = true;
    error = null;
    try {
      await saveProject(formData);
    } catch (e) {
      error = e instanceof Error ? e.message : 'Error desconocido';
    } finally {
      loading = false;
    }
  }
</script>

{#if error}
  <ErrorMessage message={error} />
{/if}

<button disabled={loading} onclick={handleSubmit}>
  {loading ? 'Guardando...' : 'Guardar'}
</button>
```

**Error handling — mapeo Firebase a mensajes user-friendly:**

```typescript
// src/lib/utils/error-messages.ts
const firebaseErrors: Record<string, Record<Locale, string>> = {
  'auth/wrong-password': {
    es: 'Contraseña incorrecta',
    en: 'Wrong password',
  },
  'storage/unauthorized': {
    es: 'No tienes permiso para esta operación',
    en: 'You do not have permission for this operation',
  },
};

function getErrorMessage(error: unknown, locale: Locale): string {
  if (error instanceof FirebaseError) {
    return firebaseErrors[error.code]?.[locale] ?? error.message;
  }
  return locale === 'es' ? 'Error inesperado' : 'Unexpected error';
}
```

**Auth flow — patrón único en todo el admin:**

```svelte
<script lang="ts">
  import { auth } from '$lib/firebase/client';
  import { onAuthStateChanged } from 'firebase/auth';

  let user = $state<User | null>(null);
  let checking = $state(true);

  onAuthStateChanged(auth, (u) => {
    user = u;
    checking = false;
    if (!u) window.location.href = '/admin/login';
  });
</script>

{#if checking}
  <LoadingSpinner />
{:else if user}
  <slot />
{/if}
```

**Form validation — Zod en submit, no en cada keystroke:**

```typescript
function handleSubmit(formData: unknown) {
  const result = projectSchema.safeParse(formData);
  if (!result.success) {
    errors = result.error.flatten().fieldErrors;
    return;
  }
  await saveProject(result.data);
}
```

### Enforcement Guidelines

**Todo agente de IA DEBE:**

1. Derivar tipos de Zod schemas (`z.infer<>`) — NUNCA definir `interface` o `type` manualmente para modelos de datos
2. Usar `StoredImage` para imágenes en Firestore y `ImageSlot` para estado de UI — NUNCA mezclar
3. Usar componentes `.astro` para contenido estático y `.svelte` SOLO para interactividad
4. Poner tests en `__tests__/` co-locados junto al código que testean
5. Usar nested objects para campos bilingües (`field: { es, en }`) — NUNCA sufijos `fieldEs`/`fieldEn`
6. Acceder a campos bilingües con `item.field[locale]` — sin helpers de concatenación de strings
7. Mapear errores Firebase a mensajes bilingües via `getErrorMessage()` — NUNCA mostrar `error.code` al usuario
8. Validar con Zod al submit — NUNCA validar en cada keystroke
9. Usar UUID para paths de imágenes en Storage — NUNCA índices numéricos
10. NUNCA replicar patrones del proyecto Flutter sin validar que sean la mejor opción profesional

**Anti-Patterns (PROHIBIDOS):**

```typescript
// ❌ Tipo manual en vez de derivado de schema
interface Project { companyName: string; }

// ✅ Derivado de Zod schema
type Project = z.infer<typeof projectSchema>;

// ❌ Sufijos bilingües (patrón Flutter)
{ companyNameEs: "...", companyNameEn: "..." }
<h1>{project.companyNameEs}</h1>

// ✅ Nested object con acceso directo
{ companyName: { es: "...", en: "..." } }
<h1>{project.companyName[locale]}</h1>

// ❌ Responsibilities como string (patrón Flutter)
responsabilitiesEs: "Desarrollar features, Revisar código"

// ✅ Array tipado con localización nested
responsibilities: { es: ["Desarrollar features", "Revisar código"], en: [...] }

// ❌ Fechas como string (patrón Flutter)
date: "2023 - Present"

// ✅ Timestamps tipados
startDate: Timestamp, endDate: Timestamp | null

// ❌ Estado de imagen mezclando UI y Firestore (patrón Flutter)
{ url: string, localFile: File | null, storagePath: string }

// ✅ Separados: StoredImage (Firestore) + ImageSlot (UI)
```

## Project Structure & Boundaries

### Complete Project Directory Structure

```
portfolio/
├── README.md
├── package.json
├── pnpm-lock.yaml
├── astro.config.mjs                       # Astro 6: output static, integrations, i18n
├── tsconfig.json                          # TypeScript strictest
├── .env                                   # Variables locales (NO committed)
├── .env.example                           # Template documentado (committed)
├── .gitignore
├── firebase.json                          # Hosting: public dist/, SPA rewrite
├── .firebaserc                            # Proyecto: portfolio-chrisbp
├── firestore.rules                        # Security rules
├── storage.rules                          # Storage security rules
├── vitest.config.ts
├── playwright.config.ts
│
├── .github/
│   └── workflows/
│       ├── ci.yml                         # Push to main: lint → test → build → Lighthouse → deploy
│       └── rebuild.yml                    # workflow_dispatch: rebuild manual
│
├── public/
│   ├── favicon.svg
│   └── robots.txt                         # Allow all, Disallow /admin
│
├── src/
│   ├── assets/                            # Imágenes estáticas optimizadas por Astro
│   │   ├── logo/
│   │   │   ├── cbp-short-logo-dark.png
│   │   │   └── cbp-large-logo-dark.png
│   │   └── avatar.webp
│   │
│   ├── styles/
│   │   └── global.css                     # Tailwind @import, @theme tokens, fonts, breakpoints
│   │
│   ├── layouts/
│   │   ├── BaseLayout.astro               # HTML shell: <head> SEO + header + footer
│   │   └── AdminLayout.astro              # Admin: auth guard island + sidebar + content
│   │
│   ├── lib/
│   │   ├── firebase/
│   │   │   ├── client.ts                  # Firebase client SDK init (browser)
│   │   │   ├── admin.ts                   # Firebase Admin SDK init (build time only)
│   │   │   ├── image-service.ts           # ImageService: upload, replace, delete, deleteByPrefix
│   │   │   ├── collections.ts             # Typed helpers: getProjects(), getBlogPosts(), etc.
│   │   │   └── __tests__/
│   │   │       ├── image-service.test.ts
│   │   │       └── collections.test.ts
│   │   │
│   │   ├── schemas/
│   │   │   ├── project-schema.ts
│   │   │   ├── technology-schema.ts
│   │   │   ├── experience-schema.ts
│   │   │   ├── blog-post-schema.ts
│   │   │   ├── stored-image-schema.ts
│   │   │   ├── image-slot.ts              # ImageSlot discriminated union (UI state)
│   │   │   └── __tests__/
│   │   │       └── schemas.test.ts
│   │   │
│   │   ├── i18n/
│   │   │   ├── translations.ts            # UI strings { es: {...}, en: {...} }
│   │   │   └── config.ts                  # Locales disponibles, default locale, type Locale
│   │   │
│   │   ├── scripts/
│   │   │   └── migrate-firestore-data.ts  # One-time migration: Flutter schema → new schema
│   │   │
│   │   └── utils/
│   │       ├── format-date.ts
│   │       ├── slugify.ts
│   │       ├── error-messages.ts
│   │       ├── generate-uuid.ts
│   │       └── __tests__/
│   │           ├── format-date.test.ts
│   │           ├── slugify.test.ts
│   │           └── error-messages.test.ts
│   │
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.astro
│   │   │   ├── Card.astro
│   │   │   ├── SectionTitle.astro
│   │   │   ├── SkipNav.astro
│   │   │   ├── ErrorMessage.astro
│   │   │   ├── EmptyState.astro
│   │   │   └── TechnologyBadge.astro
│   │   │
│   │   ├── layout/
│   │   │   ├── Header.astro
│   │   │   ├── MobileMenu.svelte          # Island
│   │   │   ├── Footer.astro
│   │   │   ├── ThemeToggle.svelte         # Island
│   │   │   └── LanguageToggle.svelte      # Island
│   │   │
│   │   ├── home/
│   │   │   ├── HeroSection.astro
│   │   │   ├── TechnologiesSection.astro
│   │   │   ├── ProjectsPreview.astro
│   │   │   └── ExperienceTimeline.astro
│   │   │
│   │   ├── projects/
│   │   │   ├── ProjectCard.astro
│   │   │   ├── ProjectGrid.astro
│   │   │   ├── ProjectDetail.astro
│   │   │   ├── ScreenshotGallery.svelte   # Island
│   │   │   └── ProjectFilter.svelte       # Island
│   │   │
│   │   ├── blog/
│   │   │   ├── BlogCard.astro
│   │   │   ├── BlogGrid.astro
│   │   │   └── BlogContent.astro
│   │   │
│   │   ├── contact/
│   │   │   └── ContactForm.svelte         # Island
│   │   │
│   │   └── admin/                         # Todo Svelte (islands)
│   │       ├── AuthGuard.svelte
│   │       ├── AdminSidebar.svelte
│   │       ├── AdminDashboard.svelte
│   │       ├── ProjectForm.svelte
│   │       ├── TechnologyForm.svelte
│   │       ├── ExperienceForm.svelte
│   │       ├── BlogEditor.svelte          # TipTap editor
│   │       ├── ImageUploader.svelte
│   │       ├── ScreenshotManager.svelte   # Drag-and-drop reorder
│   │       ├── EntityList.svelte
│   │       └── LoginForm.svelte
│   │
│   └── pages/
│       ├── index.astro                    # Home ES
│       ├── projects/
│       │   ├── index.astro
│       │   └── [slug].astro
│       ├── blog/
│       │   ├── index.astro
│       │   └── [slug].astro
│       ├── contact.astro
│       ├── en/
│       │   ├── index.astro
│       │   ├── projects/
│       │   │   ├── index.astro
│       │   │   └── [slug].astro
│       │   ├── blog/
│       │   │   ├── index.astro
│       │   │   └── [slug].astro
│       │   └── contact.astro
│       ├── admin/
│       │   ├── index.astro
│       │   ├── login.astro
│       │   ├── projects.astro
│       │   ├── technologies.astro
│       │   ├── experiences.astro
│       │   └── blog.astro
│       └── 404.astro
│
├── tests/
│   └── e2e/
│       ├── public-navigation.spec.ts
│       ├── project-detail.spec.ts
│       ├── blog-navigation.spec.ts
│       ├── contact-form.spec.ts
│       ├── admin-auth.spec.ts
│       ├── admin-projects.spec.ts
│       ├── admin-technologies.spec.ts
│       ├── admin-experiences.spec.ts
│       ├── admin-blog.spec.ts
│       └── seo-validation.spec.ts
│
└── dist/                                  # Build output (gitignored) → Firebase Hosting
```

### Architectural Boundaries

**Data Boundaries:**

```
┌─────────────────────────────────────────────────────────┐
│                    FIREBASE (Cloud)                       │
│  ┌──────────┐  ┌──────────────┐  ┌────────────────┐    │
│  │   Auth   │  │  Firestore   │  │    Storage     │    │
│  │(1 admin) │  │ 4 collections│  │ images/*.webp  │    │
│  └────┬─────┘  └──────┬───────┘  └───────┬────────┘    │
│       │               │                   │              │
│       │    Security Rules (read: public, write: admin)   │
└───────┼───────────────┼───────────────────┼──────────────┘
        │               │                   │
   ┌────┴───────────────┴───────────────────┴────┐
   │              Firebase Client SDK              │
   │         (browser — admin Svelte islands)      │
   └──────────────────────┬──────────────────────-─┘
                          │
   ┌──────────────────────┴──────────────────────-─┐
   │           Firebase Admin SDK                    │
   │      (build time — astro build only)           │
   └────────────────────────────────────────────────┘
```

**Component Boundaries:**

```
Astro Pages (src/pages/)
  │ Importa layouts y componentes, pasa datos como props
  │
  ├── BaseLayout.astro
  │     │ Genera: <head> con SEO, <body> con header/footer
  │     └── Componentes .astro (zero JS)
  │           Reciben datos via props, renderizan HTML puro
  │
  └── AdminLayout.astro
        │ Contiene: AuthGuard.svelte (client:load)
        └── Componentes .svelte (islands, con JS)
              Hidratados en browser, usan Firebase client SDK
              Estado local con Svelte 5 Runes
```

**Service Boundaries:**

```
src/lib/firebase/
├── client.ts          ← SOLO browser (admin islands)
├── admin.ts           ← SOLO build time (astro build)
├── image-service.ts   ← Browser (usa client SDK Storage)
└── collections.ts     ← Dual: build (Admin SDK) + browser (client SDK)
```

### Requirements to Structure Mapping

| FR Category | Primary Location |
|---|---|
| **FR1-FR9** Visualización Pública | `src/pages/*.astro`, `src/components/home/`, `projects/`, `blog/` |
| **FR10-FR14** i18n | `astro.config.mjs`, `src/pages/en/`, `src/lib/i18n/` |
| **FR15-FR18** Auth | `src/components/admin/AuthGuard.svelte`, `LoginForm.svelte`, `firestore.rules` |
| **FR19-FR22** CRUD Projects | `src/components/admin/ProjectForm.svelte`, `ImageUploader.svelte`, `ScreenshotManager.svelte` |
| **FR23-FR26** CRUD Technologies | `src/components/admin/TechnologyForm.svelte` |
| **FR27-FR30** CRUD Experiences | `src/components/admin/ExperienceForm.svelte` |
| **FR31-FR37** Blog | `src/components/admin/BlogEditor.svelte`, `src/components/blog/`, `src/pages/blog/` |
| **FR38-FR41** Image Management | `src/lib/firebase/image-service.ts`, `src/lib/schemas/image-slot.ts` |
| **FR42-FR46** SEO | `src/layouts/BaseLayout.astro`, `public/robots.txt`, `astro.config.mjs` (sitemap) |
| **FR47-FR49** Open Source | `README.md`, `.env.example`, `.gitignore` |

### Data Flow

**Build time (público):**

```
astro build → Admin SDK → Firestore → Zod validate → HTML estático → dist/ → Firebase Hosting
```

**Runtime (admin):**

```
/admin → AuthGuard → Svelte islands → Firebase client SDK → Firestore/Storage → rebuild manual
```

## Architecture Validation Results

### Coherence Validation ✅

**Decision Compatibility:**
- Astro 6 (SSG) + Svelte 5 (islands) + Tailwind CSS 4.1 + TypeScript strict → stack compatible, integraciones oficiales
- Firebase client SDK en browser + Admin SDK en build time → patrón estándar, sin conflictos
- Zod 4 requerido por Astro 6, usado como source of truth → alineación natural
- Node 22+ requerido por Astro 6, GitHub Actions Ubuntu latest soporta Node 22+ ✅

**Pattern Consistency:**
- Naming conventions alineadas con convenciones Astro/Svelte/TypeScript ✅
- StoredImage (Firestore) + ImageSlot (UI) → separación clara ✅
- Zod schemas → tipos derivados → consistente en todo el proyecto ✅
- localize() helper → acceso único a campos bilingües ✅

**Structure Alignment:**
- `src/pages/` con Astro i18n routing → estructura completa ES/EN ✅
- `src/components/` por dominio → alineado con FR categories ✅
- `src/lib/` sin UI → separación lógica/presentación ✅
- Tests co-locados + E2E separados → claro ✅

### Requirements Coverage ✅

**Functional Requirements: 49/49 cubiertos**

| FR Range | Status | Soporte Arquitectónico |
|---|---|---|
| FR1-FR9 Visualización | ✅ | SSG pages, Firestore data at build, components por dominio |
| FR10-FR14 i18n | ✅ | Astro i18n, `src/pages/en/`, localize helper, hreflang en BaseLayout |
| FR15-FR18 Auth | ✅ | AuthGuard.svelte, LoginForm.svelte, Security Rules |
| FR19-FR22 CRUD Projects | ✅ | ProjectForm.svelte, ImageUploader, ScreenshotManager, ImageService |
| FR23-FR26 CRUD Technologies | ✅ | TechnologyForm.svelte, ImageUploader |
| FR27-FR30 CRUD Experiences | ✅ | ExperienceForm.svelte |
| FR31-FR37 Blog | ✅ | BlogEditor.svelte (TipTap), blog pages, published/draft status |
| FR38-FR41 Image Management | ✅ | ImageService, StoredImage, ImageSlot, safe operation order, UUID paths |
| FR42-FR46 SEO | ✅ | BaseLayout.astro (meta, OG, hreflang), robots.txt, sitemap, JSON-LD |
| FR47-FR49 Open Source | ✅ | README.md, .env.example, .gitignore |

**Non-Functional Requirements: 29/29 cubiertos**

| NFR Range | Status | Soporte Arquitectónico |
|---|---|---|
| NFR1-7 Performance | ✅ | SSG zero server latency, zero JS default, Astro Image, lazy loading |
| NFR8-13 Security | ✅ | Firebase Security Rules, .env, zero secrets, auth client-side |
| NFR14-19 Accessibility | ✅ | HTML semántico, SkipNav.astro, ARIA landmarks, alt text |
| NFR20-25 Code Quality | ✅ | Vitest, Playwright, TypeScript strictest, GitHub Actions, Lighthouse CI |
| NFR26-29 Integration | ✅ | Firebase SDK dual pattern, collections helpers, ImageService |

### Gap Analysis

**Critical Gaps: 0**

**Important Gaps: 1 (resolved)**

1. **Blog HTML sanitization** — TipTap produce HTML almacenado en Firestore. Al renderizar con `set:html` en Astro, debe sanitizarse para prevenir XSS. **Resolución:** Usar `sanitize-html` en build time al generar páginas de blog. Patrón: `sanitizeHtml(content, { allowedTags: [...], allowedAttributes: {...} })`.

**Minor Gaps: 2 (resolved)**

1. **Structured Data JSON-LD** — Se genera en BaseLayout.astro como `<script type="application/ld+json">` con schemas Person, WebSite, BlogPosting.
2. **Blog slug uniqueness** — Verificar en BlogEditor.svelte al crear/editar que el slug no exista via query a Firestore.

### Architecture Completeness Checklist

**✅ Requirements Analysis**

- [x] Project context analyzed (49 FRs, 29 NFRs)
- [x] Scale and complexity assessed (low-medium)
- [x] Technical constraints identified (Firebase existing, Astro 6, SSG)
- [x] Cross-cutting concerns mapped (i18n, auth, images, SEO, theme, responsive)

**✅ Architectural Decisions**

- [x] Critical decisions documented with versions
- [x] Technology stack fully specified (Astro 6.0, Svelte 5, Tailwind 4.1, Firebase, Zod 4)
- [x] Output mode decided (SSG + Firebase Hosting)
- [x] Image management redesigned (StoredImage + ImageSlot + ImageService)
- [x] Auth pattern defined (client-side Firebase Auth + Security Rules)
- [x] Blog editor selected (TipTap)

**✅ Implementation Patterns**

- [x] Naming conventions established
- [x] Structure patterns defined (.astro vs .svelte rules)
- [x] Format patterns specified (Zod source of truth, localize helper)
- [x] Process patterns documented (loading, errors, auth, validation)
- [x] Anti-patterns explicitly listed

**✅ Project Structure**

- [x] Complete directory structure (~80 files)
- [x] Component boundaries (Astro static vs Svelte interactive)
- [x] Service boundaries (client SDK browser vs Admin SDK build)
- [x] Requirements to structure mapping (10 FR categories → files)
- [x] Data flow documented (build time + runtime)

### Architecture Readiness Assessment

**Overall Status:** READY FOR IMPLEMENTATION

**Confidence Level:** Alta

**Key Strengths:**

1. Simplicidad deliberada — SSG + Firebase Hosting, zero server runtime
2. Image management profesional — StoredImage/ImageSlot/ImageService resuelve problemas del proyecto Flutter
3. Separation of concerns — datos, interactividad y lógica claramente separados
4. Zero cost — todo dentro de tiers gratuitos
5. Patrones enforceable — reglas claras con ejemplos y anti-patterns

**Post-MVP Enhancement Areas:**

- Server endpoints para envío real de email (contact form)
- Analytics dashboard
- Cloud Functions para rebuild automático via Firestore triggers
- Image CDN/resize si el volumen crece

### Implementation Handoff

**AI Agent Guidelines:**

- Seguir todas las decisiones arquitectónicas exactamente como están documentadas
- Usar patrones de implementación consistentemente en todos los componentes
- Respetar estructura del proyecto y boundaries
- Referir a este documento para todas las preguntas arquitectónicas
- NUNCA replicar patrones del proyecto Flutter sin validar que sean la mejor opción

**First Implementation Priority:**

```bash
npm create astro@latest portfolio -- --template minimal --yes
cd portfolio
npx astro add svelte tailwind
npm install -D vitest playwright @playwright/test
npm install firebase firebase-admin sanitize-html
```

