# Analisis del Arbol de Codigo Fuente — Portfolio ChrisBP

> Generado: 2026-03-26 | Modo: Re-escaneo Exhaustivo | v3.0.0

## Resumen

| Metrica | Valor |
|---|---|
| Archivos fuente (aprox.) | ~160 |
| Componentes | 18 Astro + 32 Svelte = 50 componentes |
| Rutas (pages) | 18 |
| Tests unitarios | 44 |
| Tests E2E | 20 |
| Esquemas Zod | 6 |
| Modulos Firebase | 8 |

## Directorios Criticos

| Directorio | Proposito | Archivos |
|---|---|---|
| `src/components/admin/` | CRUD admin completo | 28 Svelte + 1 Astro + 17 tests |
| `src/lib/firebase/` | Capa de datos | 8 modulos + 9 tests |
| `src/lib/schemas/` | Validacion | 6 esquemas + 1 test |
| `src/pages/` | Routing SSG bilingue | 18 paginas |
| `src/lib/i18n/` | Internacionalizacion | 2 modulos + 2 tests |
| `src/lib/utils/` | Utilidades generales | 9 utilidades + 10 tests |
| `tests/e2e/` | E2E completo | 20 specs |
| `.github/workflows/` | CI/CD | 1 pipeline |

## Arbol de Codigo Fuente Anotado

```
portfolio/
├── .github/
│   └── workflows/
│       └── ci.yml                    # Pipeline CI/CD: lint, type-check, tests, build, Lighthouse, deploy
├── assets/                           # Assets de diseno (no procesados por build)
├── design-artifacts/                 # Artefactos de diseno del proyecto (mockups, specs)
├── docs/                             # Documentacion generada del proyecto (este directorio)
├── public/                           # Assets estaticos servidos directamente (favicon, robots.txt, og-image)
├── scripts/                          # Scripts de utilidad del proyecto
├── tests/
│   └── e2e/                          # Tests E2E con Playwright
│       ├── auth.setup.ts             # Setup global: autenticacion admin
│       ├── global-teardown.ts        # Limpieza post-tests
│       ├── admin-helpers.ts          # Utilidades compartidas para tests admin
│       ├── admin-auth.spec.ts        # E2E: autenticacion y navegacion admin
│       ├── admin-blog.spec.ts        # E2E: CRUD de blog posts
│       ├── admin-projects.spec.ts    # E2E: CRUD de proyectos
│       ├── admin-experiences.spec.ts # E2E: CRUD de experiencias
│       ├── admin-technologies.spec.ts# E2E: CRUD de tecnologias
│       ├── blog-page.spec.ts         # E2E: listado de blog
│       ├── blog-article.spec.ts      # E2E: detalle de articulo
│       ├── projects-page.spec.ts     # E2E: listado de proyectos
│       ├── project-detail.spec.ts    # E2E: detalle de proyecto
│       ├── home-page.spec.ts         # E2E: pagina principal
│       ├── contact-page.spec.ts      # E2E: formulario de contacto
│       ├── image-viewer.spec.ts      # E2E: visor de imagenes
│       ├── accessibility.spec.ts     # E2E: accesibilidad WCAG
│       ├── performance-optimization.spec.ts # E2E: Core Web Vitals
│       ├── seo-validation.spec.ts    # E2E: meta tags y SEO
│       └── responsive-polish.spec.ts # E2E: diseno responsive
├── src/
│   ├── assets/
│   │   └── logo/                     # Logos del proyecto (PNG)
│   ├── components/
│   │   ├── admin/                    # 28 componentes Svelte + 1 Astro para panel admin
│   │   │   ├── AuthGuard.svelte      # Guardia de autenticacion (redirige si no auth)
│   │   │   ├── LoginForm.svelte      # Formulario de login Firebase Auth
│   │   │   ├── AdminDashboard.svelte # Dashboard con conteos de colecciones
│   │   │   ├── AdminSidebar.svelte   # Sidebar navegacion admin
│   │   │   ├── AdminBreadcrumb.astro # Breadcrumb dinamico
│   │   │   ├── Toast.svelte          # Sistema de notificaciones toast
│   │   │   ├── ConfirmDialog.svelte  # Dialogo de confirmacion para delete
│   │   │   ├── BilingualField.svelte # Input bilingue ES/EN con tabs
│   │   │   ├── BilingualArrayField.svelte # Array bilingue con add/remove
│   │   │   ├── ImageUploader.svelte  # Upload drag-drop con preview
│   │   │   ├── ImageUploadDialog.svelte # Dialogo de upload de imagen
│   │   │   ├── ScreenshotManager.svelte # Gestor de screenshots multiples
│   │   │   ├── TechnologySelector.svelte # Multi-select de tecnologias
│   │   │   ├── RichTextEditor.svelte # Editor TipTap para blog
│   │   │   ├── LinkDialog.svelte     # Dialogo insertar enlace en editor
│   │   │   ├── Blog{Form,List,CrudPage}.svelte # CRUD Blog
│   │   │   ├── Project{Form,List,CrudPage}.svelte # CRUD Proyectos
│   │   │   ├── Experience{Form,List,CrudPage}.svelte # CRUD Experiencias
│   │   │   ├── Technology{Form,List,CrudPage}.svelte # CRUD Tecnologias
│   │   │   ├── breadcrumb-utils.ts   # Utilidades de breadcrumb
│   │   │   └── __tests__/            # 17 archivos de test unitario
│   │   ├── blog/                     # Componentes publicos de blog
│   │   │   ├── BlogCard.astro        # Card de preview de articulo
│   │   │   └── BlogContent.astro     # Renderizado de HTML sanitizado
│   │   ├── common/                   # Componentes reutilizables base
│   │   │   ├── Badge.astro           # Badge con variantes (technology, status, language)
│   │   │   ├── Button.astro          # Boton/enlace universal con variantes
│   │   │   ├── Card.astro            # Wrapper de card con hover opcional
│   │   │   ├── Container.astro       # Contenedor con max-width responsive
│   │   │   ├── Input.astro           # Input generico (text, textarea, select, file)
│   │   │   ├── Section.astro         # Wrapper de seccion con padding responsive
│   │   │   ├── SkipNav.astro         # Skip-to-content para accesibilidad
│   │   │   └── __tests__/            # 1 archivo de test
│   │   ├── contact/
│   │   │   └── ContactForm.svelte    # Formulario de contacto con validacion Zod
│   │   ├── home/                     # Secciones de la pagina principal
│   │   │   ├── HeroSection.astro     # Hero con avatar, CTA
│   │   │   ├── ProjectsSection.astro # Grid de proyectos destacados
│   │   │   ├── TechnologiesSection.astro # Grid de tecnologias
│   │   │   └── ExperienceSection.astro # Timeline de experiencia
│   │   ├── layout/                   # Componentes de layout global
│   │   │   ├── Banner.astro          # Banner superior con mensaje
│   │   │   ├── Header.astro          # Header sticky con navegacion
│   │   │   ├── Footer.astro          # Footer con redes sociales
│   │   │   ├── ThemeScript.astro     # Script inline anti-FOUC para tema
│   │   │   ├── LocaleToggle.svelte   # Toggle de idioma (banderas)
│   │   │   ├── MobileMenu.svelte     # Menu hamburguesa responsive
│   │   │   ├── ThemeToggle.svelte    # Toggle dark/light mode
│   │   │   └── __tests__/            # 2 archivos de test
│   │   └── projects/                 # Componentes de detalle de proyecto
│   │       ├── ProjectFilter.svelte  # Filtro por tecnologia con ARIA
│   │       └── ImageViewer.svelte    # Galeria modal con navegacion
│   ├── data/
│   │   ├── navigation.ts            # Configuracion de navegacion bilingue
│   │   └── __tests__/
│   ├── layouts/
│   │   ├── BaseLayout.astro          # Layout publico: SEO, OG, JSON-LD, View Transitions
│   │   └── AdminLayout.astro         # Layout admin: sidebar, breadcrumb, dark mode
│   ├── lib/
│   │   ├── firebase/                 # Capa de datos Firebase
│   │   │   ├── client.ts             # SDK cliente (browser) con soporte emuladores
│   │   │   ├── admin.ts              # SDK admin (build-time) para SSG
│   │   │   ├── collections.ts        # CRUD Firestore: 4 colecciones, parsers, queries
│   │   │   ├── image-service.ts      # Servicio de imagenes: upload/delete con retry
│   │   │   ├── image-slot-processor.ts # Procesador de ImageSlot discriminated union
│   │   │   ├── orphan-cleanup.ts     # Limpieza de imagenes huerfanas
│   │   │   ├── auth-errors.ts        # Mapeo de errores Firebase Auth bilingue
│   │   │   ├── storage-errors.ts     # Mapeo de errores Firebase Storage bilingue
│   │   │   └── __tests__/            # 9 archivos de test
│   │   ├── i18n/                     # Internacionalizacion
│   │   │   ├── config.ts             # Configuracion de locales y utilidades URL
│   │   │   ├── translations.ts       # 200+ claves de traduccion ES/EN
│   │   │   └── __tests__/            # 2 archivos de test
│   │   ├── schemas/                  # Esquemas Zod de validacion
│   │   │   ├── shared-schemas.ts     # Tipos base: locale, localizedString, storedImage
│   │   │   ├── project-schema.ts     # Esquema Project + form + firestore
│   │   │   ├── technology-schema.ts  # Esquema Technology + form + firestore
│   │   │   ├── experience-schema.ts  # Esquema Experience + form + firestore
│   │   │   ├── blog-post-schema.ts   # Esquema BlogPost + form + firestore
│   │   │   ├── image-slot.ts         # Discriminated union ImageSlot
│   │   │   └── __tests__/            # 1 archivo de test (538 LOC)
│   │   ├── scripts/                  # Scripts de mantenimiento
│   │   │   ├── migrate-firestore-data.ts # Migracion de datos Firestore
│   │   │   ├── seed-experiences.ts   # Seed de experiencias laborales
│   │   │   ├── cleanup-e2e-data.ts   # Limpieza datos E2E
│   │   │   ├── cleanup-orphan-images.ts # Limpieza imagenes huerfanas
│   │   │   └── __tests__/
│   │   ├── types/                    # Tipos TypeScript adicionales
│   │   ├── utils/                    # Utilidades generales
│   │   │   ├── toast-store.svelte.ts # Store de toasts (Svelte 5 runes, max 3)
│   │   │   ├── slugify.ts           # Generacion de slugs URL-safe
│   │   │   ├── format-date.ts       # Formateo de fechas bilingue
│   │   │   ├── reading-time.ts      # Estimacion tiempo de lectura
│   │   │   ├── sanitize-blog-html.ts # Sanitizacion HTML de TipTap
│   │   │   ├── tiptap-helpers.ts    # Extraccion de imagenes de JSON TipTap
│   │   │   ├── tiptap-renderer.ts   # Conversion TipTap JSON a HTML
│   │   │   ├── error-messages.ts    # Mapeo de errores a mensajes usuario
│   │   │   ├── seo.ts              # JSON-LD y OG image helpers
│   │   │   └── __tests__/           # 10 archivos de test
│   │   └── __tests__/               # 2 tests adicionales (blog schema, theme)
│   ├── pages/                        # Rutas Astro (SSG)
│   │   ├── index.astro              # Home EN (/)
│   │   ├── contact.astro            # Contacto EN (/contact)
│   │   ├── blog/
│   │   │   ├── index.astro          # Blog listing EN (/blog)
│   │   │   └── [slug].astro         # Blog detalle EN (/blog/[slug])
│   │   ├── projects/
│   │   │   ├── index.astro          # Proyectos EN (/projects)
│   │   │   └── [slug].astro         # Proyecto detalle EN (/projects/[slug])
│   │   ├── es/                      # Rutas en espanol (prefijo /es/)
│   │   │   ├── index.astro          # Home ES (/es/)
│   │   │   ├── contact.astro        # Contacto ES (/es/contact)
│   │   │   ├── blog/
│   │   │   │   ├── index.astro      # Blog ES (/es/blog)
│   │   │   │   └── [slug].astro     # Blog detalle ES (/es/blog/[slug])
│   │   │   └── projects/
│   │   │       ├── index.astro      # Proyectos ES (/es/projects)
│   │   │       └── [slug].astro     # Proyecto detalle ES (/es/projects/[slug])
│   │   └── admin/                   # Panel de administracion
│   │       ├── login.astro          # Login (/admin/login)
│   │       ├── index.astro          # Dashboard (/admin/)
│   │       ├── blog.astro           # Blog CRUD (/admin/blog)
│   │       ├── projects.astro       # Proyectos CRUD (/admin/projects)
│   │       ├── technologies.astro   # Tecnologias CRUD (/admin/technologies)
│   │       └── experiences.astro    # Experiencias CRUD (/admin/experiences)
│   ├── styles/
│   │   ├── global.css               # Estilos globales + Tailwind CSS 4 imports
│   │   └── __tests__/
│   └── test/
│       └── factories/               # Factories para datos de test
│           ├── index.ts             # Barrel export
│           ├── blog-post.ts         # Factory BlogPost
│           ├── experience.ts        # Factory Experience
│           ├── project.ts           # Factory Project
│           ├── technology.ts        # Factory Technology
│           └── __tests__/
├── astro.config.mjs                  # Config Astro: SSG, i18n, Svelte, Sitemap, Fonts
├── eslint.config.js                  # ESLint: TypeScript, Astro, Svelte
├── firebase.json                     # Firebase: Hosting, Firestore, Storage, Emuladores
├── firestore.rules                   # Reglas Firestore: lectura publica, escritura admin
├── firestore.indexes.json            # Indices Firestore
├── storage.rules                     # Reglas Storage: lectura publica, escritura admin
├── lighthouserc.cjs                  # Lighthouse CI: umbrales >=0.95 (perf 0.70 para detalles)
├── package.json                      # Dependencias y scripts
├── playwright.config.ts              # Playwright: 2 proyectos (public, admin)
├── svelte.config.js                  # Svelte: vitePreprocess
├── tsconfig.json                     # TypeScript: extends astro/tsconfigs/strictest
└── vitest.config.ts                  # Vitest: browser conditions, coverage v8
```

## Puntos de Entrada

| Archivo | Rol |
|---|---|
| `src/pages/index.astro` | Home EN — punto de entrada principal del sitio |
| `src/layouts/BaseLayout.astro` | Layout publico: SEO, Open Graph, JSON-LD, View Transitions |
| `src/layouts/AdminLayout.astro` | Layout admin: sidebar, breadcrumb, dark mode |
| `src/lib/firebase/client.ts` | Firebase browser SDK — inicializacion cliente con soporte emuladores |
| `src/lib/firebase/admin.ts` | Firebase Admin SDK — acceso build-time para SSG |
| `astro.config.mjs` | Configuracion principal: SSG, i18n, Svelte, Sitemap, Fonts |

## Patrones de Organizacion

- **Componentes por dominio**: los componentes se agrupan por area funcional (`admin/`, `blog/`, `common/`, `contact/`, `home/`, `layout/`, `projects/`), cada directorio encapsula la UI de su dominio.
- **Colocacion de tests**: cada modulo tiene su carpeta `__tests__/` adyacente al codigo fuente, facilitando la navegacion y el mantenimiento.
- **Esquemas separados de la capa Firebase**: los esquemas Zod (`src/lib/schemas/`) definen la validacion y los tipos independientemente de la capa de persistencia (`src/lib/firebase/`), permitiendo reutilizacion en formularios y en el servidor.
- **Utilidades como funciones puras**: `src/lib/utils/` contiene funciones sin estado ni efectos secundarios (slugify, format-date, reading-time, sanitize), lo que maximiza la testabilidad y reutilizacion.
