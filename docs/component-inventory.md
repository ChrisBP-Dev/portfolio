# Inventario de Componentes — Portfolio ChrisBP

> Generado: 2026-03-26 | Modo: Re-escaneo Exhaustivo | v3.0.0

## Resumen

| Tipo | Cantidad | Ubicación |
|------|----------|-----------|
| Astro Components | 18 | src/components/**/*.astro |
| Svelte Components | 32 | src/components/**/*.svelte |
| Layouts | 2 | src/layouts/*.astro |
| **Total** | **52** | — |

## Componentes Comunes (src/components/common/)

| Componente | Tipo | Props | Descripción |
|-----------|------|-------|-------------|
| Badge.astro | Astro | variant ('technology' \| 'status' \| 'language'), value?, class? | Badge con 3 variantes visuales |
| Button.astro | Astro | variant ('primary' \| 'secondary' \| 'danger' \| 'ghost'), href?, type?, disabled?, download?, target?, rel? | Botón/enlace universal |
| Card.astro | Astro | as ('article' \| 'div'), hoverable?, class? | Wrapper de card con hover opcional |
| Container.astro | Astro | variant ('default' \| 'narrow'), class? | Contenedor con max-width responsive |
| Input.astro | Astro | type ('text' \| 'textarea' \| 'select' \| 'file'), name, label, required?, error?, placeholder?, value?, class? | Input genérico con manejo de errores |
| Section.astro | Astro | variant ('default' \| 'hero' \| 'compact'), id?, class? | Wrapper de sección con padding responsive |
| SkipNav.astro | Astro | locale | Skip-to-content para accesibilidad |

## Componentes de Blog (src/components/blog/)

| Componente | Tipo | Props | Descripción |
|-----------|------|-------|-------------|
| BlogCard.astro | Astro | post (BlogPost), locale, readingTimeLabel | Card de preview de artículo con cover image |
| BlogContent.astro | Astro | contentHtml | Renderizado de HTML sanitizado de TipTap |

## Componentes de Home (src/components/home/)

| Componente | Tipo | Props | Descripción |
|-----------|------|-------|-------------|
| HeroSection.astro | Astro | locale | Hero con avatar, heading, descripción, CTAs |
| ProjectsSection.astro | Astro | projects (Project[]), locale | Grid de 3 proyectos destacados |
| TechnologiesSection.astro | Astro | technologies (Technology[]), locale | Grid flexbox de logos de tecnología |
| ExperienceSection.astro | Astro | experiences (Experience[]), locale | Timeline de experiencia laboral |

## Componentes de Layout (src/components/layout/)

| Componente | Tipo | Props | Descripción |
|-----------|------|-------|-------------|
| Banner.astro | Astro | locale | Banner superior con mensaje de bienvenida |
| Header.astro | Astro | currentPage, locale | Header sticky con nav, toggles de tema/idioma |
| Footer.astro | Astro | locale | Footer con redes sociales (TikTok, GitHub, LinkedIn) |
| ThemeScript.astro | Astro | — | Script inline anti-FOUC para persistencia de tema |
| LocaleToggle.svelte | Svelte | currentLocale, currentPath | Toggle de idioma con banderas (posición fija) |
| MobileMenu.svelte | Svelte | currentPage, locale | Menú hamburguesa con animación slide-down |
| ThemeToggle.svelte | Svelte | currentLocale | Toggle dark/light mode (posición fija) |

## Componentes de Proyectos (src/components/projects/)

| Componente | Tipo | Props | Descripción |
|-----------|------|-------|-------------|
| ProjectFilter.svelte | Svelte | projects, technologies, locale, labels... | Filtro por tecnología con ARIA live region |
| ImageViewer.svelte | Svelte | screenshots ({url, alt}[]), locale | Galería modal con navegación prev/next |

## Componentes de Contacto (src/components/contact/)

| Componente | Tipo | Props | Descripción |
|-----------|------|-------|-------------|
| ContactForm.svelte | Svelte | locale | Formulario con validación Zod (nombre, email, teléfono, mensaje, canal) |

## Componentes Admin — Autenticación y Navegación (src/components/admin/)

| Componente | Tipo | Props | Descripción |
|-----------|------|-------|-------------|
| AuthGuard.svelte | Svelte | children (Snippet) | Guardia de ruta: redirige a login si no autenticado |
| LoginForm.svelte | Svelte | — | Login email/password con Firebase Auth |
| AdminDashboard.svelte | Svelte | — | Dashboard con conteos de colecciones Firestore |
| AdminSidebar.svelte | Svelte | currentPath | Sidebar con nav items, logout, drawer móvil con keyboard trap |
| AdminBreadcrumb.astro | Astro | currentPath | Breadcrumb dinámico para rutas admin |
| Toast.svelte | Svelte | — | Sistema de notificaciones toast (éxito/warning/error) |
| ConfirmDialog.svelte | Svelte | title, message, confirmLabel, cancelLabel, onConfirm, onCancel | Diálogo de confirmación para operaciones destructivas |

## Componentes Admin — Campos Compartidos

| Componente | Tipo | Props | Descripción |
|-----------|------|-------|-------------|
| BilingualField.svelte | Svelte | label, nameEs (bind), nameEn (bind), type, required?, idPrefix, errors | Input/textarea bilingüe con tabs ES/EN |
| BilingualArrayField.svelte | Svelte | label, arrayEs (bind), arrayEn (bind), required?, idPrefix, errors | Array bilingüe con add/remove |
| ImageUploader.svelte | Svelte | label, slot (ImageSlot, bind), required?, error?, uploadProgress?, onChange? | Upload drag-drop con preview (max 5MB) |
| ImageUploadDialog.svelte | Svelte | — | Diálogo para upload de imágenes |
| ScreenshotManager.svelte | Svelte | — | Gestor de screenshots múltiples con reordenamiento |
| TechnologySelector.svelte | Svelte | — | Multi-select para tecnologías de proyecto |
| RichTextEditor.svelte | Svelte | content (TipTap JSON), onUpdate, label, error?, onInsertImage? | Editor TipTap (StarterKit + Image + Link) |
| LinkDialog.svelte | Svelte | — | Diálogo para insertar enlaces en editor |

## Componentes Admin — CRUD por Entidad

### Blog
| Componente | Tipo | Props | Descripción |
|-----------|------|-------|-------------|
| BlogForm.svelte | Svelte | mode ('create' \| 'edit'), initialData?, onCancel, onSaved | Formulario blog: título, slug, contenido bilingual, cover image, status |
| BlogList.svelte | Svelte | — | Tabla de blog posts con acciones edit/delete |
| BlogCrudPage.svelte | Svelte | — | Orquestador: lista/formulario/diálogo de blog |

### Proyectos
| Componente | Tipo | Props | Descripción |
|-----------|------|-------|-------------|
| ProjectForm.svelte | Svelte | mode, initialData?, onCancel, onSaved | Formulario proyecto: nombre, descripción, features, imágenes, tecnologías, URLs |
| ProjectList.svelte | Svelte | — | Tabla de proyectos con drag-drop reordering |
| ProjectsCrudPage.svelte | Svelte | — | Orquestador: lista/formulario/diálogo de proyectos |

### Experiencias
| Componente | Tipo | Props | Descripción |
|-----------|------|-------|-------------|
| ExperienceForm.svelte | Svelte | mode, initialData?, onCancel, onSaved | Formulario experiencia: empresa, cargo bilingual, responsabilidades, fechas |
| ExperienceList.svelte | Svelte | — | Tabla de experiencias con acciones |
| ExperiencesCrudPage.svelte | Svelte | — | Orquestador: lista/formulario/diálogo de experiencias |

### Tecnologías
| Componente | Tipo | Props | Descripción |
|-----------|------|-------|-------------|
| TechnologyForm.svelte | Svelte | mode, initialData?, onCancel, onSaved | Formulario tecnología: nombre, imagen, años experiencia |
| TechnologyList.svelte | Svelte | — | Tabla de tecnologías con drag-drop reordering |
| TechnologiesCrudPage.svelte | Svelte | — | Orquestador: lista/formulario/diálogo de tecnologías |

## Layouts (src/layouts/)

| Layout | Props | Descripción |
|--------|-------|-------------|
| BaseLayout.astro | title, description, currentPage, ogImage?, ogType?, ogDescription?, jsonLd? | Layout público: SEO completo, OG, JSON-LD, View Transitions (ClientRouter), hreflang, Banner + Header + Footer + SkipNav |
| AdminLayout.astro | title, showSidebar? | Layout admin: sidebar responsive, breadcrumb, dark mode forzado |

## Patrones de Diseño

### Patrón CrudPage
Cada entidad admin sigue el mismo patrón:
- **CrudPage** orquesta vista lista/formulario y gestiona el flujo delete
- **List** muestra tabla con acciones (edit, delete, reorder)
- **Form** maneja create/edit con validación Zod
- **ConfirmDialog** confirma operaciones destructivas
- **Toast** notifica resultado de operaciones

### Patrón Astro Islands
- Componentes Astro para contenido estático (SEO-friendly, zero JS)
- Componentes Svelte con `client:load` para interactividad inmediata (admin, toggles)
- Componentes Svelte con `client:visible` para lazy-loading (filtros, formularios)

### Patrón BilingualField
- Tabs ES/EN en un solo componente
- Binding bidireccional para ambos idiomas
- Validación por separado para cada idioma
- Reutilizado en todos los formularios admin
