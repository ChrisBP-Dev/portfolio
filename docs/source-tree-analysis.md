# Análisis del Árbol de Código Fuente — Portfolio ChrisBP

> Generado: 2026-03-24 | Escaneo Exhaustivo | Astro 6 + Svelte 5 + Firebase

## Estructura del Proyecto

```
portfolio/
├── .auth/                        # Credenciales locales para E2E (admin auth state)
├── .github/
│   └── workflows/
│       └── ci.yml                # Pipeline CI/CD: lint → type-check → test → build → Lighthouse → deploy
├── .vscode/
│   ├── extensions.json           # Extensiones recomendadas
│   └── launch.json               # Configuración de depuración
├── assets/                       # Assets estáticos NO procesados por Astro
│   ├── icon/
│   │   └── chrisbp-icon.png      # Ícono de la aplicación
│   └── logo/
│       ├── background-chrisbp.png
│       ├── cbp-large-logo-dark.png
│       └── cbp-short-logo-dark.png
├── docs/                         # Documentación del proyecto (generada)
├── public/                       # Archivos estáticos servidos directamente
│   ├── favicon.ico
│   ├── favicon.svg
│   ├── resume.pdf                # CV descargable
│   └── robots.txt
├── src/                          # ★ Código fuente principal
│   ├── assets/                   # Assets procesados por Astro (optimización)
│   │   └── logo/
│   ├── components/               # ★ 51 componentes (17 Astro, 34 Svelte)
│   │   ├── admin/                # Panel de administración (29 archivos)
│   │   │   ├── __tests__/        # 16 tests unitarios
│   │   │   ├── AdminBreadcrumb.astro
│   │   │   ├── AdminDashboard.svelte
│   │   │   ├── AdminSidebar.svelte
│   │   │   ├── AuthGuard.svelte
│   │   │   ├── BilingualArrayField.svelte
│   │   │   ├── BilingualField.svelte
│   │   │   ├── BlogCrudPage.svelte
│   │   │   ├── BlogForm.svelte
│   │   │   ├── BlogList.svelte
│   │   │   ├── ConfirmDialog.svelte
│   │   │   ├── ExperienceForm.svelte
│   │   │   ├── ExperienceList.svelte
│   │   │   ├── ExperiencesCrudPage.svelte
│   │   │   ├── ImageUploadDialog.svelte
│   │   │   ├── ImageUploader.svelte
│   │   │   ├── LinkDialog.svelte
│   │   │   ├── LoginForm.svelte
│   │   │   ├── ProjectForm.svelte
│   │   │   ├── ProjectList.svelte
│   │   │   ├── ProjectsCrudPage.svelte
│   │   │   ├── RichTextEditor.svelte
│   │   │   ├── ScreenshotManager.svelte
│   │   │   ├── TechnologiesCrudPage.svelte
│   │   │   ├── TechnologyForm.svelte
│   │   │   ├── TechnologyList.svelte
│   │   │   ├── TechnologySelector.svelte
│   │   │   ├── Toast.svelte
│   │   │   └── breadcrumb-utils.ts
│   │   ├── blog/                 # Blog (2 Astro)
│   │   │   ├── BlogCard.astro
│   │   │   └── BlogContent.astro
│   │   ├── common/               # Compartidos (7 Astro)
│   │   │   ├── Badge.astro
│   │   │   ├── Button.astro
│   │   │   ├── Card.astro
│   │   │   ├── Container.astro
│   │   │   ├── Input.astro
│   │   │   ├── Section.astro
│   │   │   └── SkipNav.astro
│   │   ├── contact/
│   │   │   └── ContactForm.svelte
│   │   ├── home/                 # Secciones home (4 Astro)
│   │   │   ├── ExperienceSection.astro
│   │   │   ├── HeroSection.astro
│   │   │   ├── ProjectsSection.astro
│   │   │   └── TechnologiesSection.astro
│   │   ├── layout/               # Layout (4 Astro, 3 Svelte)
│   │   │   ├── Banner.astro
│   │   │   ├── Footer.astro
│   │   │   ├── Header.astro
│   │   │   ├── LocaleToggle.svelte
│   │   │   ├── MobileMenu.svelte
│   │   │   ├── ThemeScript.astro
│   │   │   └── ThemeToggle.svelte
│   │   └── projects/             # Proyectos (2 Svelte)
│   │       ├── ImageViewer.svelte
│   │       └── ProjectFilter.svelte
│   ├── data/
│   │   └── navigation.ts        # Items de navegación + localizeHref()
│   ├── layouts/
│   │   ├── AdminLayout.astro     # Admin: sidebar, noindex, español fijo
│   │   └── BaseLayout.astro      # Público: SEO, hreflang, ViewTransitions
│   ├── lib/                      # ★ Lógica de negocio (26 archivos)
│   │   ├── firebase/             # Capa Firebase (8 archivos)
│   │   │   ├── admin.ts          # Admin SDK (servidor)
│   │   │   ├── auth-errors.ts    # Errores auth → i18n
│   │   │   ├── client.ts         # Client SDK (navegador)
│   │   │   ├── collections.ts    # Queries + parsing Firestore
│   │   │   ├── image-service.ts  # Upload/delete con retry + cancel
│   │   │   ├── image-slot-processor.ts  # Máquina de estados de imagen
│   │   │   ├── orphan-cleanup.ts # Limpieza imágenes huérfanas
│   │   │   └── storage-errors.ts # Errores storage → i18n
│   │   ├── i18n/                 # Internacionalización (2 archivos)
│   │   │   ├── config.ts         # locales, defaultLocale, getLocaleFromUrl
│   │   │   └── translations.ts   # ~150+ claves ES/EN
│   │   ├── schemas/              # Validación Zod (6 archivos)
│   │   │   ├── blog-post-schema.ts
│   │   │   ├── experience-schema.ts
│   │   │   ├── image-slot.ts
│   │   │   ├── project-schema.ts
│   │   │   ├── shared-schemas.ts
│   │   │   └── technology-schema.ts
│   │   ├── scripts/              # Scripts migración/seed
│   │   │   ├── migrate-firestore-data.ts
│   │   │   └── seed-experiences.ts
│   │   └── utils/                # Utilidades (8 archivos)
│   │       ├── error-messages.ts
│   │       ├── format-date.ts
│   │       ├── reading-time.ts
│   │       ├── sanitize-blog-html.ts
│   │       ├── slugify.ts
│   │       ├── tiptap-helpers.ts
│   │       ├── tiptap-renderer.ts
│   │       └── toast-store.svelte.ts
│   ├── pages/                    # ★ File-based routing (18 rutas)
│   │   ├── admin/                # 6 páginas admin
│   │   │   ├── blog.astro
│   │   │   ├── experiences.astro
│   │   │   ├── index.astro
│   │   │   ├── login.astro
│   │   │   ├── projects.astro
│   │   │   └── technologies.astro
│   │   ├── blog/
│   │   │   ├── [slug].astro
│   │   │   └── index.astro
│   │   ├── contact.astro
│   │   ├── es/                   # Páginas español (prefijo /es/)
│   │   │   ├── blog/
│   │   │   ├── contact.astro
│   │   │   ├── index.astro
│   │   │   └── projects/
│   │   ├── index.astro           # ★ Punto de entrada principal
│   │   └── projects/
│   │       ├── [slug].astro
│   │       └── index.astro
│   ├── styles/
│   │   └── global.css            # Design system: tokens, tipografía, breakpoints
│   └── test/
│       └── factories/            # Factories para datos de test
├── tests/                        # Tests E2E (Playwright)
│   └── e2e/                      # 15 specs + helpers + fixtures
├── astro.config.mjs              # ★ Config: SSG, i18n, Svelte, Tailwind, fonts
├── eslint.config.js              # ESLint flat config
├── firebase.json                 # Hosting + Firestore + Storage + Emulators
├── firestore.rules               # Read público, write solo admin UID
├── lighthouserc.cjs              # CI: ≥0.95 todas las categorías
├── package.json                  # pnpm, Node ≥22.12.0
├── playwright.config.ts          # 2 proyectos: public, admin
├── storage.rules                 # Read público, write solo admin UID
├── svelte.config.js              # vitePreprocess
├── tsconfig.json                 # strictest (Astro base)
└── vitest.config.ts              # browser conditions, v8 coverage
```

## Carpetas Críticas

| Carpeta | Propósito | Archivos |
|---------|-----------|----------|
| `src/pages/` | Enrutamiento file-based de Astro | 18 rutas |
| `src/components/admin/` | Panel CRUD completo | 29 archivos |
| `src/lib/firebase/` | Capa de acceso a datos Firebase | 8 archivos |
| `src/lib/schemas/` | Validación Zod de entidades | 6 esquemas |
| `src/lib/i18n/` | Internacionalización ES/EN | ~150+ claves |
| `src/lib/utils/` | Utilidades compartidas | 8 archivos |
| `src/components/common/` | Componentes UI reutilizables | 7 componentes |
| `src/styles/` | Design system (CSS tokens) | 1 archivo |
| `tests/e2e/` | Tests end-to-end Playwright | 15 specs |

## Puntos de Entrada

- **App principal:** `src/pages/index.astro`
- **Admin:** `src/pages/admin/login.astro` → Dashboard
- **Firebase Client:** `src/lib/firebase/client.ts`
- **Firebase Admin:** `src/lib/firebase/admin.ts`
- **Estilos:** `src/styles/global.css`
- **Navegación:** `src/data/navigation.ts`
- **Build:** `astro.config.mjs`

## Estadísticas

| Métrica | Valor |
|---------|-------|
| Archivos fuente en `src/` | 158 |
| Componentes totales | 51 (17 Astro + 34 Svelte) |
| Archivos de lógica (`lib/`) | 26 |
| Archivos de test | ~52 |
| Specs E2E | 15 |
| Factories de test | 5 |
| Rutas de página | 18 |
| Claves de traducción | ~150+ |
