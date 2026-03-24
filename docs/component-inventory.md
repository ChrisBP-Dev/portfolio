# Inventario de Componentes UI — Portfolio ChrisBP

> Generado: 2026-03-24 | Escaneo Exhaustivo | 51 componentes (17 Astro, 34 Svelte)

## Resumen

| Categoría | Astro | Svelte | Total |
|-----------|-------|--------|-------|
| Layout | 4 | 3 | 7 |
| Home | 4 | 0 | 4 |
| Common | 7 | 0 | 7 |
| Blog | 2 | 0 | 2 |
| Projects | 0 | 2 | 2 |
| Contact | 0 | 1 | 1 |
| Admin | 1 | 27 | 28 |
| **Total** | **17** | **34** | **51** |

## Layout (7)

| Componente | Tipo | Props | Descripción |
|------------|------|-------|-------------|
| `Header.astro` | Astro | `currentPage?, locale` | Navegación principal con logo y menú desktop |
| `Footer.astro` | Astro | `locale` | Footer con links sociales (TikTok, GitHub, LinkedIn) |
| `Banner.astro` | Astro | `locale` | Banner de bienvenida con gradiente |
| `ThemeScript.astro` | Astro | — | Script anti-FOUC para tema (sync en `<head>`) |
| `ThemeToggle.svelte` | Svelte | `currentLocale` | Toggle dark/light con persistencia localStorage |
| `LocaleToggle.svelte` | Svelte | `currentLocale, currentPath` | Toggle idioma EN/ES con manipulación de URL |
| `MobileMenu.svelte` | Svelte | `currentPage?, locale` | Menú hamburguesa responsive con focus trap |

## Home (4)

| Componente | Tipo | Props | Descripción |
|------------|------|-------|-------------|
| `HeroSection.astro` | Astro | `locale` | Hero con avatar, heading, CTA buttons |
| `TechnologiesSection.astro` | Astro | `technologies[], locale` | Grid de logos de tecnologías |
| `ProjectsSection.astro` | Astro | `projects[], locale` | Grid de 3 proyectos destacados |
| `ExperienceSection.astro` | Astro | `experiences[], locale` | Timeline de experiencia laboral |

## Common (7)

| Componente | Tipo | Props | Descripción |
|------------|------|-------|-------------|
| `Container.astro` | Astro | `variant?('default'\|'narrow'), class?` | Wrapper max-width (75rem / 45rem) |
| `Section.astro` | Astro | `variant?('default'\|'hero'\|'compact'), id?, class?` | Sección semántica con padding |
| `Button.astro` | Astro | `variant?, href?, type?, disabled?, download?` | Botón/enlace (primary, secondary, danger, ghost) |
| `Card.astro` | Astro | `as?('article'\|'div'), hoverable?, class?` | Tarjeta con bordes y hover opcional |
| `Badge.astro` | Astro | `variant('technology'\|'status'\|'language'), value?, class?` | Etiqueta inline (tech, estado, idioma) |
| `Input.astro` | Astro | `type?, name, label, required?, error?, placeholder?, value?` | Input con label y mensaje de error |
| `SkipNav.astro` | Astro | `locale` | Skip navigation para accesibilidad |

## Blog (2)

| Componente | Tipo | Props | Descripción |
|------------|------|-------|-------------|
| `BlogCard.astro` | Astro | `post, locale, readingTimeLabel` | Card preview de artículo (cover, título, fecha, tiempo lectura) |
| `BlogContent.astro` | Astro | `contentHtml` | Renderizado de HTML blog con estilos markdown |

## Projects (2)

| Componente | Tipo | Props | Descripción |
|------------|------|-------|-------------|
| `ProjectFilter.svelte` | Svelte | `projects[], technologies[], locale, *labels` | Filtro dropdown por tecnología con resultados reactivos |
| `ImageViewer.svelte` | Svelte | `screenshots[], locale` | Galería fullscreen con navegación por teclas |

## Contact (1)

| Componente | Tipo | Props | Descripción |
|------------|------|-------|-------------|
| `ContactForm.svelte` | Svelte | `locale` | Formulario con country picker → WhatsApp o Email |

## Admin — Layout y Navegación (3)

| Componente | Tipo | Props | Descripción |
|------------|------|-------|-------------|
| `AdminBreadcrumb.astro` | Astro | `currentPath` | Breadcrumb del admin |
| `AdminDashboard.svelte` | Svelte | — | Dashboard con conteos de colecciones Firestore |
| `AdminSidebar.svelte` | Svelte | `currentPath` | Sidebar responsive con logout |

## Admin — Autenticación (2)

| Componente | Tipo | Props | Descripción |
|------------|------|-------|-------------|
| `LoginForm.svelte` | Svelte | — | Login Firebase (email + password) |
| `AuthGuard.svelte` | Svelte | `children: Snippet` | Wrapper de autenticación (spinner → redirect) |

## Admin — CRUD Pages (4)

| Componente | Tipo | Props | Descripción |
|------------|------|-------|-------------|
| `ProjectsCrudPage.svelte` | Svelte | — | Container: list/create/edit + delete + image cleanup |
| `TechnologiesCrudPage.svelte` | Svelte | — | Container: list/create/edit + delete + image cleanup |
| `ExperiencesCrudPage.svelte` | Svelte | — | Container: list/create/edit + delete |
| `BlogCrudPage.svelte` | Svelte | — | Container: list/create/edit + delete + image cleanup |

## Admin — Listas (4)

| Componente | Tipo | Props | Descripción |
|------------|------|-------|-------------|
| `ProjectList.svelte` | Svelte | `onCreateNew, onEdit?, onDelete?` | Lista con drag-reorder (SortableJS) + featured |
| `TechnologyList.svelte` | Svelte | `onCreateNew, onEdit?, onDelete?` | Lista con drag-reorder (SortableJS) |
| `ExperienceList.svelte` | Svelte | `onCreateNew, onEdit?, onDelete?` | Lista con formato de fechas |
| `BlogList.svelte` | Svelte | `onCreateNew, onEdit?, onDelete?` | Lista ordenada por fecha creación |

## Admin — Formularios (4)

| Componente | Tipo | Props | Descripción |
|------------|------|-------|-------------|
| `ProjectForm.svelte` | Svelte | `mode?, initialData?, onCancel, onSaved` | Formulario completo: bilingüe, imágenes, techs, slug auto |
| `TechnologyForm.svelte` | Svelte | `mode?, initialData?, onCancel, onSaved` | Formulario: nombre, años experiencia, imagen |
| `ExperienceForm.svelte` | Svelte | `mode?, initialData?, onCancel, onSaved` | Formulario: bilingüe, fechas, "actualmente trabajando" |
| `BlogForm.svelte` | Svelte | `mode?, initialData?, onCancel, onSaved` | Formulario: TipTap editor bilingüe, cover, inline images |

## Admin — Helpers de Formulario (5)

| Componente | Tipo | Props | Descripción |
|------------|------|-------|-------------|
| `BilingualField.svelte` | Svelte | `label, nameEs, nameEn, type?, required?, errorEs?, errorEn?` | Input bilingüe: tabs mobile, side-by-side desktop |
| `BilingualArrayField.svelte` | Svelte | `label, itemsEs, itemsEn, required?` | Array bilingüe: add/remove items (max 10) |
| `ImageUploader.svelte` | Svelte | `label, slot, required?, error?, uploadProgress?` | Upload drag-drop con preview y progreso |
| `ScreenshotManager.svelte` | Svelte | `screenshots, onChange?` | Multi-imagen: upload, preview grid, undo remove (max 10) |
| `TechnologySelector.svelte` | Svelte | `selected, onChange?` | Checkbox group de tecnologías desde Firestore |

## Admin — Editores y Diálogos (5)

| Componente | Tipo | Props | Descripción |
|------------|------|-------|-------------|
| `RichTextEditor.svelte` | Svelte | `content, onUpdate, label, error?, onInsertImage?` | TipTap WYSIWYG: headings, bold, code, listas, links, imágenes |
| `ImageUploadDialog.svelte` | Svelte | `open, postId, onClose, onImageUploaded` | Modal upload de imagen inline para blog |
| `LinkDialog.svelte` | Svelte | `open, initialUrl?, onApply, onRemove, onCancel` | Modal para agregar/editar links en editor |
| `ConfirmDialog.svelte` | Svelte | `open, title, message, confirmLabel, cancelLabel, confirming?, onConfirm, onCancel` | Modal de confirmación reutilizable con focus trap |
| `Toast.svelte` | Svelte | — (usa toastStore) | Sistema de notificaciones toast (success/warning/error) |

## Patrones Arquitectónicos Clave

### Patrón CRUD Container
Cada módulo admin sigue: `CrudPage` → `List` + `Form` + `ConfirmDialog` + `Toast`

### Image Slot Pattern
Estados de imagen: `empty` → `new` → `existing` → `replaced` → `removed` con transiciones seguras

### Bilingual Field Pattern
Campos ES/EN con tabs en mobile y side-by-side en desktop, validación independiente por locale

### Orphan Cleanup
Imágenes subidas se rastrean; si el save falla, se limpian automáticamente
