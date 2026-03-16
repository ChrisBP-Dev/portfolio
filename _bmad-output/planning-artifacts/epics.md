---
stepsCompleted: ['step-01-validate-prerequisites', 'step-02-design-epics', 'step-03-create-stories', 'step-04-final-validation']
status: complete
completedAt: '2026-03-15'
inputDocuments:
  - '_bmad-output/planning-artifacts/prd.md'
  - '_bmad-output/planning-artifacts/architecture.md'
  - '_bmad-output/planning-artifacts/ux-design-specification.md'
---

# portfolio - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for portfolio, decomposing the requirements from the PRD, UX Design if it exists, and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

- **FR1:** Visitantes pueden ver la página principal con secciones de About Me, Technologies, Projects destacados y Experience
- **FR2:** Visitantes pueden navegar al catálogo completo de proyectos con filtro por tecnología utilizada
- **FR3:** Visitantes pueden ver el detalle de cada proyecto con imágenes, descripción, tecnologías usadas y links externos
- **FR4:** Visitantes pueden ver screenshots de proyectos en un visor de imágenes ampliado
- **FR5:** Visitantes pueden ver la experiencia laboral en formato timeline
- **FR6:** Visitantes pueden ver el listado de artículos de blog publicados
- **FR7:** Visitantes pueden leer un artículo de blog individual con formato rico (headings, párrafos, listas, código, negritas, links, imágenes embebidas)
- **FR8:** Visitantes pueden enviar un mensaje de contacto seleccionando canal (WhatsApp o Email) y código de país
- **FR9:** Visitantes pueden navegar a perfiles de redes sociales (GitHub, LinkedIn, TikTok)
- **FR10:** Visitantes pueden cambiar el idioma del sitio entre Español e Inglés
- **FR11:** Visitantes pueden cambiar el tema visual entre Dark y Light mode
- **FR12:** El sistema persiste la preferencia de tema del visitante entre sesiones
- **FR13:** Todo el contenido público (páginas, proyectos, experiencias, blog) se muestra en el idioma seleccionado
- **FR14:** Cada página pública genera meta tags hreflang para ambos idiomas
- **FR15:** Christopher puede acceder al panel de administración navegando a una ruta dedicada `/admin`
- **FR16:** Christopher puede autenticarse con email y password
- **FR17:** Christopher puede cerrar sesión desde el panel de administración
- **FR18:** El sistema protege todas las rutas de administración — visitantes no autenticados son redirigidos al login
- **FR19:** Christopher puede crear un nuevo proyecto con nombre (ES/EN), descripción (ES/EN), features (ES/EN), imagen principal, screenshots, tecnologías asociadas y URLs externas
- **FR20:** Christopher puede editar cualquier campo de un proyecto existente
- **FR21:** Christopher puede eliminar un proyecto y todos sus assets asociados
- **FR22:** Christopher puede ver la lista completa de proyectos en el admin
- **FR23:** Christopher puede crear una nueva tecnología con nombre, icono/imagen y tiempo de experiencia
- **FR24:** Christopher puede editar cualquier campo de una tecnología existente
- **FR25:** Christopher puede eliminar una tecnología y su imagen asociada
- **FR26:** Christopher puede ver la lista completa de tecnologías en el admin
- **FR27:** Christopher puede crear una nueva experiencia laboral con fecha, empresa, cargo (ES/EN) y responsabilidades (ES/EN)
- **FR28:** Christopher puede editar cualquier campo de una experiencia existente
- **FR29:** Christopher puede eliminar una experiencia
- **FR30:** Christopher puede ver la lista completa de experiencias en el admin
- **FR31:** Christopher puede crear un nuevo artículo de blog con título (ES/EN), contenido con formato rico, slug personalizable, imagen de portada y estado (publicado/borrador)
- **FR32:** Christopher puede insertar imágenes dentro del contenido de un artículo
- **FR33:** Christopher puede editar cualquier campo de un artículo existente
- **FR34:** Christopher puede eliminar un artículo y todos sus assets asociados
- **FR35:** Christopher puede cambiar el estado de un artículo entre publicado y borrador
- **FR36:** Christopher puede ver la lista de todos los artículos (publicados y borradores) en el admin
- **FR37:** Solo los artículos marcados como publicados son visibles en el sitio público
- **FR38:** Christopher puede subir imágenes al crear o editar proyectos, tecnologías y artículos de blog
- **FR39:** Christopher puede reemplazar una imagen existente — el sistema elimina automáticamente la imagen anterior de Storage
- **FR40:** Al eliminar una entidad (proyecto, tecnología, artículo), el sistema elimina automáticamente todos sus assets de Storage
- **FR41:** El sistema no permite assets huérfanos en Storage bajo ninguna circunstancia
- **FR42:** Cada página pública genera meta tags (title, description, OpenGraph, Twitter Cards) apropiados
- **FR43:** Cada artículo de blog genera OpenGraph con título, descripción e imagen para compartir en redes sociales
- **FR44:** El sistema genera sitemap.xml automáticamente con todas las páginas públicas
- **FR45:** El sistema genera robots.txt bloqueando rutas de admin y permitiendo indexación pública
- **FR46:** Cada proyecto y artículo tiene una URL limpia basada en slug (`/projects/[slug]`, `/blog/[slug]`)
- **FR47:** Un desarrollador puede clonar el repositorio, configurar sus credenciales Firebase y ejecutar el proyecto localmente siguiendo el README
- **FR48:** El repositorio no contiene credenciales, secrets ni datos sensibles en el código fuente
- **FR49:** El repositorio incluye un `.env.example` documentado con todas las variables requeridas

### NonFunctional Requirements

- **NFR1:** Páginas públicas cargan rápido en primera visita — LCP < 1.5s en conexión 4G
- **NFR2:** Interacciones responden inmediatamente — INP < 100ms
- **NFR3:** Layout no salta durante la carga — CLS < 0.05
- **NFR4:** SSR responde rápido desde el servidor — TTFB < 200ms
- **NFR5:** JavaScript mínimo enviado al navegador — Bundle total < 50KB
- **NFR6:** Imágenes no bloquean la carga inicial — Lazy loading para imágenes below-the-fold
- **NFR7:** Operaciones CRUD del admin completan sin esperas largas — Tiempo de operación < 3s
- **NFR8:** Rutas de admin inaccesibles sin autenticación — Redirect a login en todo request no autenticado a `/admin/*`
- **NFR9:** Credenciales Firebase nunca expuestas en código — Variables de entorno para todas las keys, `.env` en `.gitignore`
- **NFR10:** Firestore Security Rules restringen escritura a admin autenticado — Solo el UID del admin puede crear/editar/eliminar documentos
- **NFR11:** Firebase Storage Rules restringen upload a admin autenticado — Solo el UID del admin puede subir/eliminar archivos
- **NFR12:** No hay endpoints de API públicos que permitan mutaciones sin auth — Todos los server endpoints que mutan datos verifican token de sesión
- **NFR13:** El repositorio público no contiene secrets — Auditoría pre-push: cero API keys, service accounts o tokens en el código
- **NFR14:** Cumplimiento WCAG 2.1 Nivel AA — Lighthouse Accessibility > 95
- **NFR15:** Navegación completa por teclado — Todos los elementos interactivos accesibles via Tab/Enter/Escape
- **NFR16:** Contraste suficiente en ambos temas — Ratio mínimo 4.5:1 para texto normal, 3:1 para texto grande
- **NFR17:** Imágenes con texto alternativo — Todas las imágenes de contenido tienen alt text descriptivo
- **NFR18:** Estructura semántica correcta — Jerarquía de headings (h1→h6) lógica, landmarks ARIA en layout
- **NFR19:** Skip navigation disponible — Link "Saltar al contenido" visible en focus para usuarios de teclado
- **NFR20:** Cobertura de tests mínima — > 80% líneas cubiertas (Vitest coverage report)
- **NFR21:** Tests E2E para flujos críticos — Happy paths de navegación pública y CRUD admin cubiertos (Playwright)
- **NFR22:** TypeScript strict sin errores — `strict: true` en tsconfig, cero errores de compilación
- **NFR23:** Linting sin warnings — ESLint + Prettier configurados, cero warnings en CI
- **NFR24:** Build exitoso en CI — GitHub Actions: build + test + lint pasan en cada push
- **NFR25:** Lighthouse CI como quality gate — Las 4 categorías > 95 verificadas automáticamente en cada deploy
- **NFR26:** Firebase Auth funcional y estable — Login/logout sin errores, sesión persistente entre recargas
- **NFR27:** Firestore queries eficientes — Queries indexadas, sin full collection scans innecesarios
- **NFR28:** Firebase Storage operaciones confiables — Upload/delete completan exitosamente con retry en caso de error de red
- **NFR29:** Hosting con SSR estable — Cloudflare Workers o Vercel Functions responden consistentemente

### Additional Requirements

**Starter Template (CRÍTICO para Epic 1, Story 1):**
- Proyecto greenfield usando Astro 6.0 minimal template: `npm create astro@latest portfolio -- --template minimal --yes`
- Node.js 22+ requerido (requisito de Astro 6)
- TypeScript strict mode (`strictest` en tsconfig)
- Output SSG puro: `output: 'static'` — sin adapters de servidor
- Integrations: `npx astro add svelte tailwind`
- Dependencias: `firebase`, `firebase-admin`, `sanitize-html`, `zod`, `vitest`, `playwright`

**Hosting e Infraestructura:**
- Firebase Hosting (proyecto existente `portfolio-chrisbp`) — costo $0 (Spark plan)
- Deploy: `firebase deploy --only hosting` desde `dist/`
- Archivos de configuración requeridos: `firebase.json`, `.firebaserc`, `firestore.rules`, `storage.rules`
- Dominio: `portfolio-chrisbp.web.app` (default), custom domain post-MVP
- SPA rewrite rules en `firebase.json` para `/admin/*`

**CI/CD Pipeline (GitHub Actions):**
- Trigger on push to main: lint → type-check → test → Lighthouse CI → firebase deploy
- Trigger manual: `workflow_dispatch` para rebuild post-content-update
- Quality gate: Lighthouse >95 en las 4 categorías bloquea deploy si falla
- Latencia de rebuild: ~2-3 min desde cambio de contenido a producción

**Migración de Datos (One-Time Script):**
- Script `src/lib/scripts/migrate-firestore-data.ts` para transformar schema Flutter → Professional
- Transformaciones: suffixed fields → nested i18n objects, strings → arrays, date strings → Timestamps, experience time → numeric
- Backup obligatorio antes de migrar: `firebase firestore:export`
- Idempotencia: detecta docs ya migrados y los salta
- Validación post-migración con Zod schemas

**Firebase Integration:**
- Firebase Client SDK: auth, firestore, storage (directo desde Svelte islands, protegido por Security Rules)
- Firebase Admin SDK: solo en build time (queries Firestore → genera HTML estático)
- Service account credentials: solo en GitHub Secrets, nunca en .env
- Colecciones Firestore: `Projects`, `Technologies`, `Experiences`, `BlogPosts` (PascalCase)
- Storage paths: `{entity}/{entityId}/{images|screenshots}/{uuid}.webp` (siempre .webp)

**Security Rules:**
- Firestore: public read, write solo para admin UID autenticado
- Storage: public read, upload/delete solo para admin UID
- `PUBLIC_` prefix para client config (committeable), secrets solo en GitHub Secrets
- `.env.example` con todas las variables públicas, `.env` en `.gitignore`

**Data Architecture:**
- Zod 4 schemas como fuente de verdad (tipos derivados via `z.infer<>`)
- No interfaces manuales de TypeScript para modelos de dominio
- Schemas compartidos entre build (Admin SDK) y runtime (client SDK)
- Validación en submit de formulario, no en keystroke

**i18n Implementation:**
- Astro i18n nativo: ES default en root, EN en `/en/`
- Campos bilingües en Firestore: `field: { es: "...", en: "..." }`
- Traducciones estáticas UI: `src/lib/i18n/translations.ts`
- Acceso: `item.field[locale]` (directo, type-safe)

**Image Management (Pattern Profesional):**
- `StoredImage { url, storagePath }` en Firestore
- `ImageSlot` discriminated union para estado UI (empty, existing, new, replaced, removed)
- `ImageService` centralizado: upload, replace, delete, deleteByPrefix
- Orden seguro de operaciones: upload nuevo → update Firestore → delete viejo

**Blog Editor:**
- TipTap con wrapper Svelte para editor rico
- Output HTML sanitizado con `sanitize-html` en build time
- Tags permitidos: p, h1-h3, ul, ol, li, a, img, code, pre, blockquote
- Stored en Firestore como HTML bilingüe: `content: { es, en }`

**Testing Framework:**
- Vitest: unit tests co-localizados en `__tests__/`, >80% coverage
- Playwright: E2E cross-browser (Chromium, Firefox, WebKit)
- Tests en `tests/e2e/` en raíz del proyecto

**Component Architecture (ENFORCED):**
- `.astro` para componentes estáticos (zero JS al browser): layouts, páginas, secciones, cards, nav, footer
- `.svelte` solo para interactividad: admin forms, toggles, editor, image viewer, contact form
- Hydration: `client:load` (inmediato) o `client:visible` (lazy)

**Naming Conventions (ENFORCED):**
- Colecciones Firestore: PascalCase plural
- Campos Firestore: camelCase
- Campos i18n: objeto anidado (NO sufijos)
- Storage paths: kebab-case con UUID
- TypeScript: camelCase variables, PascalCase tipos
- Zod: camelCase + suffix "Schema"
- Componentes: PascalCase (.astro y .svelte)
- Servicios: kebab-case (.ts)

**Error Handling:**
- Firebase error codes mapeados a mensajes user-friendly bilingües
- Archivo: `src/lib/utils/error-messages.ts`

### UX Design Requirements

**Design Tokens & Sistema de Diseño (UX-DR1 — UX-DR6):**
- UX-DR1: Sistema de colores semánticos con Tailwind CSS 4: primary (#48A1CD), primary-dark (#108385), backgrounds, surfaces, text levels, borders, estados (success, warning, error) con contraste WCAG AA
- UX-DR2: Sistema tipográfico con Poppins: display (clamp responsive), heading-1/2/3, body, body-small, caption, code con pesos y tamaños específicos
- UX-DR3: Sistema de espaciado base 4px: space-1 (4px) a space-24 (96px) con aplicación consistente
- UX-DR4: Gradiente de marca: linear-gradient(135deg, #48A1CD, #108385) para acentos (botones, borders hover, header) — nunca como fondo dominante
- UX-DR5: Breakpoints responsivos: Mobile (<450px), Tablet (≥450px), Desktop (≥900px), Wide (≥1200px), max-width container 1200px
- UX-DR6: Dark mode como tema default con prefers-color-scheme: dark como base, light como alternativa

**Componentes Reutilizables (UX-DR7 — UX-DR24):**
- UX-DR7: Container con 3 variantes (default 1200px, narrow 720px para blog, wide full-width)
- UX-DR8: Section con variantes de espaciado (default, hero, compact) para ritmo vertical consistente
- UX-DR9: Card con variantes (project, blog, technology, experience) con hover elevation y gradient border
- UX-DR10: Button hierarchy: primary (gradient), secondary (outline), danger (error), ghost — mínimo 44x44px touch target
- UX-DR11: Badge con variantes: technology (primary), status (success/warning), language (ES blue/EN green)
- UX-DR12: Input variantes: text, textarea, select, file upload con estados de validación y disabled
- UX-DR13: Typography component exponiendo estilos como classnames semánticos
- UX-DR14: ThemeToggle (Svelte 5 island): dark/light switching instantáneo con persistencia y animación
- UX-DR15: LocaleToggle (Svelte 5 island): ES/EN switching con badge indicador y persistencia
- UX-DR16: ImageViewer (Svelte 5 island): fullscreen con nav prev/next, arrows, swipe touch, lazy loading, focus trap
- UX-DR17: ImageUploader (Svelte 5 island): estados empty/dragging/previewing/uploading/uploaded/replacing/error, drag & drop, max 5MB
- UX-DR18: BilingualField (Svelte 5 island): ES/EN side-by-side desktop, tabs mobile, badges de color, error sincronizado
- UX-DR19: RichTextEditor (Svelte 5 island): toolbar H1-H3, bold, italic, code, links, images, lists; preview live, draft toggle
- UX-DR20: ProjectFilter (Svelte 5 island): filtro "All" + por tecnología, resultados instant, estado "no results"
- UX-DR21: AdminSidebar (Svelte 5 island): 250px fijo desktop, drawer mobile, items con icono+label, active highlight
- UX-DR22: ConfirmDialog modal: mensaje + impacto + Danger/Cancel, focus trap, Enter/Escape
- UX-DR23: Toast notifications: success (4s), error (persist+retry), warning (6s), info (4s), stack max 3, aria-live
- UX-DR24: ContactForm (Svelte 5 island): name/email/message, estados idle/validating/sending/sent/error

**Layout & Estructura (UX-DR25 — UX-DR27):**
- UX-DR25: Header pinned en top con logo ChrisBP (mascota) a la izquierda + menú horizontal 3 items (Home, Projects, Contact) desktop / menú animado slide-down mobile con X close. ThemeToggle (sol/luna) y LocaleToggle (bandera) como FABs flotantes separados abajo-derecha, no integrados en el header. Blog se agrega como 4to item de menú en la migración.
- UX-DR26: Footer con nav links, social icons (LinkedIn, GitHub, email), copyright, grid responsivo
- UX-DR27: BackToTop button flotante visible >50vh scroll, smooth scroll to top

**Patrones de Formularios (UX-DR28 — UX-DR31):**
- UX-DR28: Agrupación de formularios admin con section headers y dividers
- UX-DR29: Validación inline on blur con mensajes bajo el campo, auto-scroll al primer error en submit
- UX-DR30: Indicadores de campo requerido: asterisco (*) + aria-required="true"
- UX-DR31: Layout de botones: Primary (Save) derecha, Secondary (Cancel) izquierda, confirmación de cambios sin guardar

**Responsive & Mobile (UX-DR32 — UX-DR36):**
- UX-DR32: Nav mobile: hamburger → overlay fullscreen con slide-down, Escape cierra
- UX-DR33: Admin sidebar mobile: drawer desde izquierda con overlay, Escape cierra
- UX-DR34: Bilingüe mobile: tabs ES/EN en vez de side-by-side
- UX-DR35: Grid proyectos: 1 col mobile, 2 tablet, 3 desktop, min 300px card
- UX-DR36: Touch targets mínimo 44x44px en todos los elementos interactivos

**Estados y Feedback (UX-DR37 — UX-DR47):**
- UX-DR37: Loading skeletons para sitio público imitando estructura de contenido
- UX-DR38: Loading skeletons admin con 3-5 filas pulsantes
- UX-DR39: Submit loading: button → spinner + disabled, previene doble-submit
- UX-DR40: Optimistic update: UI actualiza inmediatamente, revierte con error toast si falla
- UX-DR41: Offline detection: banner no intrusivo, desaparece al restaurar conexión
- UX-DR42: Error messages user-friendly, no técnicos, siempre con acción de retry
- UX-DR43: Empty states para todas las listas: ilustración + mensaje + CTA
- UX-DR44: Image state indicators en admin: badges de color (blue uploaded, green new, orange replacing, red deleting)
- UX-DR45: File upload error handling con mensajes legibles y opción retry
- UX-DR46: Form validation errors bajo campos específicos, red text + border, auto-scroll
- UX-DR47: Success feedback: toast + checkmark animation, 4s auto-dismiss

**Navegación (UX-DR48 — UX-DR51):**
- UX-DR48: Menú 5 items (Home, Projects, Experience, Blog, Contact) con active state gradient underline
- UX-DR49: Header permanece visible en scroll (pinned). No implementar patrón scroll-aware tipo Stripe (shrink/change) — mantener comportamiento actual del sitio Flutter.
- UX-DR50: Admin breadcrumb: Admin > Section > Action, clickable excepto current
- UX-DR51: Skip link "Saltar al contenido" como primer elemento focusable

**Keyboard & Screen Reader (UX-DR52 — UX-DR62):**
- UX-DR52: Tab order lógico: skip link → header nav → main → footer
- UX-DR53: Focus indicators: 2px solid outline primary color, visible en ambos temas
- UX-DR54: Keyboard shortcuts: Escape cierra modales, Enter/Space activa botones, Arrows en ImageViewer
- UX-DR55: Focus trap en modales: Tab cicla solo dentro del modal
- UX-DR56: Screen reader: aria-live para toasts, aria-label en icon-only buttons, aria-expanded en toggles, aria-current="page"
- UX-DR57: Form accessibility: labels (no placeholder-only), aria-describedby para errores, aria-required, fieldsets bilingües
- UX-DR58: Heading hierarchy y HTML semántico: header, main, section, article, aside, footer
- UX-DR59: Alt text: descriptivo para contenido, aria-label para decorativos
- UX-DR60: Color contrast: 7:1 primary text, 4.5:1 secondary, no info solo por color
- UX-DR61: prefers-reduced-motion: animaciones no esenciales deshabilitadas
- UX-DR62: High contrast mode support con forced-colors media query

**Sitio Público — Diseño Específico (UX-DR63 — UX-DR73):**
- UX-DR63: Hero: Banner gradiente "Welcome to my Portfolio" full-width en top, seguido de avatar/mascota ChrisBP circular centrado, heading "I code and create content" (palabra "content" en gradiente), descripción personal centrada, botones "Get in Touch" + "Download Resume". Mantener composición actual (ver screenshots). Above-the-fold renderizado en <1.5s.
- UX-DR64: About: descripción profesional breve con skills destacados
- UX-DR65: Knowledge Of: fila horizontal centrada de tecnologías (actualmente 4: Google Gemini, Flutter, Dart, Firebase), cada una con ícono/imagen + nombre debajo. Mantener layout horizontal actual, no cambiar a grid categorizado.
- UX-DR66: Projects: 3 featured en home + "See All", cards con thumbnail/title/desc/tags
- UX-DR67: Project detail: título, descripción, gallery screenshots con ImageViewer, tech tags, links externos, back button
- UX-DR68: Project filtering: botones por tecnología + "All", resultados real-time, count, estado "no results"
- UX-DR69: Experience: lista vertical de cards con empresa (bold, izquierda), rango de fechas (derecha), badge de rol en color teal/primario, lista de responsabilidades con bullets. Layout tipo lista de cards (patrón actual), no timeline con línea visual decorativa. Responsive mobile como single-column.
- UX-DR70: Blog listing: cards con título, fecha, read time, excerpt, cover image, tags
- UX-DR71: Blog post: título h1, metadata, cover image, rich text, related posts, share buttons (LinkedIn, Twitter, copy URL)
- UX-DR72: Contact: formulario + info de contacto (email, LinkedIn), tono profesional
- UX-DR73: OpenGraph metadata: og:title/description/image/url por página y artículo

**Admin — Diseño Específico (UX-DR74 — UX-DR84):**
- UX-DR74: Dashboard: contadores de entidades (Projects N, Technologies N, Experiences N, Blog N), nav cards, quick actions
- UX-DR75: Projects list: tabla con thumbnail/nombre/fechas, sort, Edit/Delete, Create button, delete confirmation con impacto
- UX-DR76: Technologies list: icon + name, reorder, Edit/Delete, Create button
- UX-DR77: Experiences list: empresa/cargo/fecha, sort por fecha, Edit/Delete, Create button
- UX-DR78: Blog list: título, status badge (Published/Draft), fecha, Edit/Delete/View, Create button
- UX-DR79: Project form: Basic Info ES/EN, Description ES/EN, Featured image, Gallery screenshots (multi, drag & drop, reorder), Technologies multi-select, External links, Save/Cancel
- UX-DR80: Technology form: Name, Icon upload, Category/Order, Save/Cancel
- UX-DR81: Experience form: Company ES/EN, Title ES/EN, Start/End date, Description ES/EN, Technologies, Save/Cancel
- UX-DR82: Blog form: Title ES/EN, Slug auto-generado editable, RichTextEditor con images/code, Cover image, Excerpt, Status toggle Draft/Published, Save/Cancel
- UX-DR83: Delete confirmation: entity name + count assets + Danger/Cancel, explicit action required
- UX-DR84: Image management workflow: current images con badges de estado, upload area, drag & drop reorder, delete individual, bulk replace

**Performance & Percepción (UX-DR85 — UX-DR89):**
- UX-DR85: LCP optimization: hero fully rendered <1.5s sin skeleton placeholders visibles
- UX-DR86: CLS <0.05: dimensiones fijas en imágenes, no height changes durante carga
- UX-DR87: Skeleton loaders matching estructura final, fade-to-content, max 300ms antes de mostrar
- UX-DR88: Image lazy loading: loading="lazy" below-the-fold, normal above-the-fold
- UX-DR89: Font loading: font-display swap para Poppins, evitar FOIT

**Interacción & Animación (UX-DR90 — UX-DR100):**
- UX-DR90: Hover elevation en cards: shadow sutil, transición 200ms
- UX-DR91: Page transitions: fade-in, scroll position correcto
- UX-DR92: Filter feedback: animated fade-out/in de cards
- UX-DR93: Smooth scrolling en anchor links
- UX-DR94: Theme toggle: transición suave colores 200-300ms
- UX-DR95: Language toggle: fade suave de texto
- UX-DR96: ImageViewer: transiciones slide/fade 300ms entre imágenes
- UX-DR97: Form submit animation: checkmark success, spinner loading
- UX-DR98: Toast animation: slide-in suave, auto-dismiss con fade-out
- UX-DR99: Modal animation: fade-in backdrop, scale-up dialog, focus trap
- UX-DR100: Disabled state: opacity 50-60%, cursor not-allowed, sin hover

**Content Display (UX-DR101 — UX-DR105):**
- UX-DR101: Screenshot carousel: featured image + thumbnails, nav prev/next, fullscreen view
- UX-DR102: Blog code blocks: syntax highlighting, copy-to-clipboard, scroll container, line numbers
- UX-DR103: Blog images inline: responsive width, lazy loading, caption opcional
- UX-DR104: Blog metadata: fecha, read time, tags, autor
- UX-DR105: Rich text display: heading hierarchy, line-height 1.6, code styling, blockquotes, lists

**Form-Specific UX (UX-DR106 — UX-DR112):**
- UX-DR106: Bilingüe visual: ES badge azul, EN badge verde, separación visual clara
- UX-DR107: Multi-select technologies: dropdown/chip input, add/remove, search
- UX-DR108: Date picker: HTML5 native, formato regional, validación rango lógico
- UX-DR109: Textarea: character count opcional, resize handle, min/max height
- UX-DR110: URL input: validación formato, placeholder con formato esperado
- UX-DR111: Status toggle blog: Published/Draft visual, confirmación al despublicar
- UX-DR112: Slug field: auto-generado del título, editable, validación URL chars

**Admin Interaction (UX-DR113 — UX-DR117):**
- UX-DR113: Image upload preview: thumbnail inmediato post-selección, progress bar
- UX-DR114: Multiple image upload: drag & drop múltiple, progress per image, error individual
- UX-DR115: Image reorder: drag & drop para reordenar gallery, feedback visual
- UX-DR116: Form auto-save: indicador unsaved changes, restore de draft
- UX-DR117: Field focus management: cursor en primer campo vacío requerido al abrir form

**Visual Polish (UX-DR118 — UX-DR125):**
- UX-DR118: Hover states consistentes: color/elevation/underline, transición 150-200ms
- UX-DR119: Active/pressed button states: deepening + slight scale reduction
- UX-DR120: Visited link styling: distinción sutil, contraste mantenido
- UX-DR121: Loading spinner de marca: primary color, rotación suave
- UX-DR122: Card design: border-radius 8-12px, shadow sutil, hover elevation
- UX-DR123: Tag/badge sizing: consistente, hierarchy visual, responsive
- UX-DR124: Gradient accent: solo en primary buttons, card borders hover, header accent, tech tags — nunca full backgrounds
- UX-DR125: Code monospace: JetBrains Mono o Fira Code, distinto de body text

**Testing & Validación (UX-DR126 — UX-DR135):**
- UX-DR126: Lighthouse CI: >95 Accessibility en cada deploy
- UX-DR127: axe-core en Playwright E2E para detección automática de violaciones
- UX-DR128: ESLint accessibility plugin para Astro/Svelte
- UX-DR129: Keyboard navigation testing manual: Tab completo, sin traps
- UX-DR130: Screen reader testing: VoiceOver macOS/iOS
- UX-DR131: Color contrast validation con WAVE/axe en ambos temas
- UX-DR132: Responsive device testing: iPhone SE, iPad, desktop 1920x1080
- UX-DR133: Daltonism simulation testing
- UX-DR134: Form validation testing: estados de error, triggers correctos
- UX-DR135: Image loading testing: lazy loading, skeleton, CLS

**Cross-Browser (UX-DR136 — UX-DR140):**
- UX-DR136: Font fallback: Poppins → Arial → sans-serif
- UX-DR137: CSS custom properties para theming: tokens como variables CSS
- UX-DR138: Progressive enhancement: funciona sin JS (páginas estáticas), JS mejora (admin, filtros)
- UX-DR139: Browser compatibility: Chrome, Firefox, Safari, Edge (últimas 2 versiones)
- UX-DR140: Mobile/desktop: touch-friendly mobile, pointer desktop, hover solo con hover support

### FR Coverage Map

| FR | Épica | Descripción |
|---|---|---|
| FR1 | Epic 2 | Home page con About, Technologies, Projects, Experience |
| FR2 | Epic 2 | Catálogo de proyectos con filtro por tecnología |
| FR3 | Epic 2 | Detalle de proyecto con imágenes, descripción, links |
| FR4 | Epic 2 | Visor de screenshots ampliado (ImageViewer) |
| FR5 | Epic 2 | Experiencia laboral en timeline |
| FR6 | Epic 4 | Listado de artículos de blog publicados |
| FR7 | Epic 4 | Artículo de blog individual con formato rico |
| FR8 | Epic 2 | Contacto seleccionando canal (WhatsApp/Email) |
| FR9 | Epic 2 | Links a redes sociales (GitHub, LinkedIn, TikTok) |
| FR10 | Epic 2 | Cambiar idioma ES/EN |
| FR11 | Epic 2 | Cambiar tema Dark/Light |
| FR12 | Epic 2 | Persistencia de preferencia de tema |
| FR13 | Epic 2 | Contenido en idioma seleccionado |
| FR14 | Epic 2 | Meta tags hreflang para ambos idiomas |
| FR15 | Epic 3 | Acceso a `/admin` |
| FR16 | Epic 3 | Autenticación email/password |
| FR17 | Epic 3 | Cerrar sesión |
| FR18 | Epic 3 | Protección de rutas admin |
| FR19 | Epic 3 | Crear proyecto con campos bilingües e imágenes |
| FR20 | Epic 3 | Editar proyecto |
| FR21 | Epic 3 | Eliminar proyecto con assets |
| FR22 | Epic 3 | Listar proyectos en admin |
| FR23 | Epic 3 | Crear tecnología con icono |
| FR24 | Epic 3 | Editar tecnología |
| FR25 | Epic 3 | Eliminar tecnología con imagen |
| FR26 | Epic 3 | Listar tecnologías en admin |
| FR27 | Epic 3 | Crear experiencia bilingüe |
| FR28 | Epic 3 | Editar experiencia |
| FR29 | Epic 3 | Eliminar experiencia |
| FR30 | Epic 3 | Listar experiencias en admin |
| FR31 | Epic 4 | Crear artículo con editor rico, slug, cover, status |
| FR32 | Epic 4 | Insertar imágenes en contenido de artículo |
| FR33 | Epic 4 | Editar artículo |
| FR34 | Epic 4 | Eliminar artículo con assets |
| FR35 | Epic 4 | Cambiar estado publicado/borrador |
| FR36 | Epic 4 | Listar artículos (publicados y borradores) en admin |
| FR37 | Epic 4 | Solo publicados visibles en sitio público |
| FR38 | Epic 3 | Subir imágenes en projects, technologies, blog |
| FR39 | Epic 3 | Reemplazar imagen con eliminación automática |
| FR40 | Epic 3 | Eliminación automática de assets al borrar entidad |
| FR41 | Epic 3 | Zero assets huérfanos en Storage |
| FR42 | Epic 2 | Meta tags (title, description, OG, Twitter Cards) por página |
| FR43 | Epic 4 | OpenGraph específico por artículo de blog |
| FR44 | Epic 2 | Sitemap.xml automático |
| FR45 | Epic 2 | robots.txt (public index, admin blocked) |
| FR46 | Epic 2 | URLs limpias `/projects/[slug]`, `/blog/[slug]` |
| FR47 | Epic 1 | Clone → configure → run siguiendo README |
| FR48 | Epic 1 | Zero secrets en código fuente |
| FR49 | Epic 1 | `.env.example` documentado |

**Cobertura: 49/49 FRs (100%)**

## Epic List

### Epic 1: Fundación del Proyecto y Experiencia de Desarrollo
Christopher y cualquier desarrollador pueden clonar, configurar y ejecutar el proyecto localmente con Firebase conectado, design system base implementado, datos migrados y toda la infraestructura de código lista para construir features.
**FRs cubiertos:** FR47, FR48, FR49

### Epic 2: Sitio Público del Portfolio
Visitantes pueden explorar un portfolio profesional, rápido, bilingüe y accesible — con Home, proyectos con filtro y detalle, experiencia en timeline, contacto, redes sociales, SEO completo y dark/light mode.
**FRs cubiertos:** FR1, FR2, FR3, FR4, FR5, FR8, FR9, FR10, FR11, FR12, FR13, FR14, FR42, FR44, FR45, FR46

### Epic 3: Panel de Administración y Gestión de Contenido
Christopher puede gestionar todo el contenido de su portfolio (proyectos, tecnologías, experiencias) desde un panel admin protegido con autenticación, gestión robusta de imágenes y cero assets huérfanos.
**FRs cubiertos:** FR15, FR16, FR17, FR18, FR19, FR20, FR21, FR22, FR23, FR24, FR25, FR26, FR27, FR28, FR29, FR30, FR38, FR39, FR40, FR41

### Epic 4: Sistema de Blog
Christopher puede escribir y publicar artículos técnicos con editor rico. Visitantes pueden leer artículos con formato profesional, código destacado, imágenes embebidas y compartirlos en redes sociales.
**FRs cubiertos:** FR6, FR7, FR31, FR32, FR33, FR34, FR35, FR36, FR37, FR43

### Epic 5: Calidad, Testing y Pipeline de Deployment
El repositorio mantiene calidad profesional verificable con tests automatizados, CI/CD pipeline completo, Lighthouse CI como quality gate, y deployment confiable a Firebase Hosting. El proyecto queda open source ready.
**FRs cubiertos:** NFRs primariamente (NFR20-NFR25, NFR29)

---

## Epic 1: Fundación del Proyecto y Experiencia de Desarrollo

Christopher y cualquier desarrollador pueden clonar, configurar y ejecutar el proyecto localmente con Firebase conectado, design system base implementado, datos migrados y toda la infraestructura de código lista para construir features.

### Story 1.1: Inicialización del Proyecto Astro 6.0 con Tooling Completo

As a developer,
I want to initialize an Astro 6.0 project with TypeScript strict, Tailwind CSS 4, and Svelte 5 configured,
So that I have a professional, modern foundation ready for building portfolio features.

**Acceptance Criteria:**

**Given** un directorio vacío del proyecto
**When** ejecuto `npm create astro@latest portfolio -- --template minimal --yes` y configuro las integraciones
**Then** el proyecto tiene Astro 6.0 con TypeScript strict (`strictest` en tsconfig), Tailwind CSS 4 y Svelte 5 instalados
**And** la estructura de carpetas existe: `src/pages/`, `src/components/`, `src/lib/`, `src/styles/`, `src/layouts/`

**Given** el proyecto inicializado
**When** reviso `astro.config.mjs`
**Then** tiene configurado `output: 'static'`, integración de Svelte y Tailwind, i18n con locales `es` (default) y `en`, y sitemap habilitado

**Given** el proyecto inicializado
**When** reviso los archivos de configuración del proyecto
**Then** existe `.env.example` con todas las variables `PUBLIC_FIREBASE_*` documentadas con comentarios
**And** existe `.gitignore` que excluye `.env`, `node_modules/`, `dist/`, `*.log`
**And** no hay credenciales, API keys ni tokens en ningún archivo del código fuente (FR48)

**Given** las dependencias instaladas
**When** ejecuto `pnpm dev`
**Then** el servidor de desarrollo levanta sin errores en localhost
**And** el output del build no incluye JavaScript innecesario (base para NFR5 <50KB)

### Story 1.2: Configuración Firebase y Schemas de Datos

As a developer,
I want Firebase client and admin SDKs configured with Zod 4 schemas for all data collections,
So that I have type-safe data access ready for both build-time rendering and runtime admin operations.

**Acceptance Criteria:**

**Given** el proyecto Astro inicializado con .env.example
**When** configuro el Firebase client SDK
**Then** existe `src/lib/firebase/client.ts` que inicializa Firebase App con variables `PUBLIC_FIREBASE_*` desde `import.meta.env`
**And** exporta instancias de Auth, Firestore y Storage

**Given** el client SDK configurado
**When** configuro el Firebase Admin SDK
**Then** existe `src/lib/firebase/admin.ts` que inicializa Admin SDK con service account credentials desde variables de entorno (solo build-time)
**And** las credenciales del Admin SDK NO están en `.env.example` ni en código fuente (FR48)
**And** exporta instancia de Admin Firestore para queries SSG

**Given** ambos SDKs configurados
**When** defino los schemas de datos
**Then** existen Zod 4 schemas en `src/lib/schemas/` para las 4 colecciones: `projectSchema`, `technologySchema`, `experienceSchema`, `blogPostSchema`
**And** cada schema usa campos bilingües como objetos anidados: `field: z.object({ es: z.string(), en: z.string() })`
**And** los tipos TypeScript se derivan via `z.infer<typeof schema>` — no hay interfaces manuales de dominio
**And** `StoredImage` schema incluye `url: z.string()` y `storagePath: z.string()`

**Given** schemas definidos
**When** reviso los archivos de configuración Firebase
**Then** existe `firebase.json` con hosting config (`public: "dist/"`, rewrites para SPA admin)
**And** existe `.firebaserc` con alias del proyecto `portfolio-chrisbp`
**And** existe `firestore.rules` con public read y write restringido a admin UID
**And** existe `storage.rules` con public read y write restringido a admin UID

### Story 1.3: Sistema de Internacionalización

As a visitor,
I want the site to support Spanish and English with proper routing and URL structure,
So that I can browse the portfolio in my preferred language with SEO-friendly URLs.

**Acceptance Criteria:**

**Given** el proyecto con Astro i18n configurado
**When** reviso la estructura de routing
**Then** las páginas en español se sirven desde la raíz (`/`, `/projects/`, `/blog/`)
**And** las páginas en inglés se sirven desde `/en/` (`/en/`, `/en/projects/`, `/en/blog/`)

**Given** el sistema de i18n
**When** reviso el archivo de traducciones
**Then** existe `src/lib/i18n/translations.ts` con todas las UI strings estáticas en ES y EN
**And** las traducciones están tipadas con TypeScript (acceso type-safe por key)

**Given** el sistema de i18n
**When** reviso las utilidades de localización
**Then** existe `getCurrentLocale()` que retorna `'es'` o `'en'` basado en la ruta actual
**And** existe `getLocalizedPath(path, locale)` que genera URLs correctas para cada idioma
**And** existe `useTranslation(locale)` que retorna un helper `t(key)` para acceder a traducciones

**Given** contenido dinámico de Firestore con campos bilingües
**When** accedo a un campo localizado
**Then** el patrón de acceso es `item.field[locale]` (directo, type-safe, sin helpers complejos)

### Story 1.4: Design System Base y Layout Principal

As a visitor,
I want a consistent, professional visual experience with proper typography, colors, and layout,
So that the portfolio feels polished and maintains visual coherence across all pages.

**Acceptance Criteria:**

**Given** Tailwind CSS 4 configurado
**When** reviso el design system
**Then** `src/styles/global.css` contiene tokens de diseño via `@theme`: colores semánticos (primary #48A1CD, primary-dark #108385, backgrounds, surfaces, text levels, borders, estados), tipografía Poppins (display, h1-h3, body, caption, code), espaciado base 4px (space-1 a space-24), gradiente de marca, breakpoints custom (450px, 600px, 900px, 1200px) (UX-DR1-DR5)

**Given** tokens de diseño implementados
**When** reviso la configuración de fuentes
**Then** Poppins se carga desde Google Fonts con `font-display: swap` y preload en el head
**And** existe font fallback stack: Poppins → Arial → sans-serif (UX-DR136)

**Given** tokens de diseño implementados
**When** reviso el tema visual
**Then** dark mode es el tema default (UX-DR6)
**And** los tokens usan CSS custom properties que se adaptan automáticamente entre dark y light
**And** el contraste cumple WCAG AA: 4.5:1 para texto normal, 3:1 para texto grande en ambos temas (NFR16)

**Given** el design system completo
**When** reviso el layout base
**Then** existe `src/layouts/BaseLayout.astro` con: estructura HTML semántica (`<html>`, `<head>`, `<body>`), slot para contenido, meta tags base (charset, viewport), preload de fonts, link a global.css
**And** existe componente `SkipNav.astro` con link "Saltar al contenido" visible solo en focus (NFR19, UX-DR51)
**And** el layout incluye landmarks ARIA correctos (NFR18)

### Story 1.5: Migración de Datos y Security Rules

As an admin (Christopher),
I want my existing portfolio data migrated from the Flutter schema to the new professional schema,
So that all my projects, technologies, and experiences are available in the new system without data loss.

**Acceptance Criteria:**

**Given** datos existentes en Firestore con schema Flutter (suffixed fields, strings, date formats)
**When** ejecuto el script de migración `src/lib/scripts/migrate-firestore-data.ts`
**Then** los campos suffixed se transforman a objetos anidados: `companyNameEs`/`companyNameEn` → `companyName: { es, en }`
**And** strings de responsabilidades se transforman a arrays: `responsabilitiesEs` → `responsibilities: { es: [...], en: [...] }`
**And** fechas string se transforman a Timestamps nativos: `date: "2023 - Present"` → `startDate: Timestamp, endDate: null`
**And** experienceTime se transforma a numérico: `"3 years"` → `experienceYears: 3`

**Given** el script de migración
**When** lo ejecuto sobre datos ya migrados
**Then** detecta documentos ya migrados (verifica existencia de `companyName.es`) y los salta (idempotencia)
**And** no produce errores ni duplicados

**Given** la migración completada
**When** valido los datos post-migración
**Then** cada documento pasa validación contra su Zod schema correspondiente
**And** el script reporta: documentos migrados, saltados, y errores (si hay)
**And** si algún documento no valida, el script aborta con mensaje claro

**Given** las Security Rules definidas
**When** las despliego a Firebase
**Then** Firestore permite read público en todas las colecciones
**And** Firestore restringe write/delete al UID del admin autenticado
**And** Storage permite read público de imágenes
**And** Storage restringe upload/delete al UID del admin autenticado

### Story 1.6: README y Documentación de Setup

As a developer (Diego),
I want comprehensive setup documentation,
So that I can clone the repository, configure my own Firebase project, and run the portfolio locally by following the README (FR47).

**Acceptance Criteria:**

**Given** el repositorio con todas las features de Epic 1 completadas
**When** leo el README.md
**Then** incluye: descripción del proyecto, stack tecnológico (Astro 6, TypeScript, Tailwind CSS 4, Svelte 5, Firebase), screenshot placeholder, badges de estado
**And** incluye sección de requisitos previos: Node.js 22+, pnpm, cuenta Firebase

**Given** el README
**When** sigo las instrucciones de setup
**Then** los pasos son claros y secuenciales: 1) Clone, 2) `pnpm install`, 3) Crear proyecto Firebase, 4) Copiar `.env.example` → `.env` y llenar credenciales, 5) Ejecutar migración (opcional), 6) `pnpm dev`
**And** cada paso tiene el comando exacto a ejecutar

**Given** el `.env.example`
**When** lo reviso
**Then** cada variable tiene un comentario explicativo de qué es y dónde obtenerla (FR49)
**And** las variables de Admin SDK están claramente marcadas como "Solo para CI/CD — no requerido para desarrollo local"

**Given** un desarrollador nuevo que sigue el README
**When** completa todos los pasos de setup
**Then** el proyecto levanta en `localhost` sin errores con `pnpm dev`
**And** no necesita conocimiento previo del proyecto para completar el setup

---

## Epic 2: Sitio Público del Portfolio

Visitantes pueden explorar un portfolio profesional, rápido, bilingüe y accesible — con Home, proyectos con filtro y detalle, experiencia, contacto, redes sociales, SEO completo y dark/light mode.

> **Fidelidad Visual:** Todas las stories de este epic deben replicar la estructura visual y el "look & feel" del sitio público Flutter actual. La sección "Referencia Visual del Sitio Público Actual" del UX Design Specification y los screenshots en `_bmad-output/planning-artifacts/visual-reference/` son la fuente de verdad visual. Se permiten mejoras en animaciones, transiciones y micro-interacciones CSS/HTML, pero no cambios en la estructura de secciones, composición de componentes ni disposición de elementos. Los UX-DRs referenciados en las stories de este epic describen el diseño actual, no una propuesta nueva. La página de detalle de proyecto `/projects/[slug]` es una mejora intencional (no existe en el sitio actual) para mejor SEO.

### Story 2.1: Header, Footer y Navegación Principal

As a visitor,
I want a professional navigation experience with header, footer, theme and language controls,
So that I can navigate the portfolio intuitively, switch between dark/light mode, and browse in my preferred language.

**Acceptance Criteria:**

**Given** cualquier página pública del portfolio
**When** la página carga
**Then** el Header se muestra con: logo a la izquierda, menú de navegación horizontal con 5 items (Home, Projects, Experience, Blog, Contact), ThemeToggle y LocaleToggle a la derecha
**And** el Header es pinned en top (visible siempre) replicando el comportamiento del sitio actual (UX-DR25)
**And** el item de navegación activo muestra underline con gradient color (UX-DR48)

**Given** el Header visible en viewport < 450px (mobile)
**When** hago click en el ícono hamburger
**Then** se despliega un overlay fullscreen con los items de menú centrados y animación slide-down (UX-DR32)
**And** presionar Escape cierra el menú
**And** el overlay previene scroll del background

**Given** el ThemeToggle visible
**When** hago click en el toggle
**Then** el tema cambia instantáneamente entre Dark y Light sin page reload (FR11, UX-DR14)
**And** la preferencia se persiste en localStorage y se restaura en la siguiente visita (FR12)
**And** la transición de colores es suave (200-300ms) (UX-DR94)
**And** dark mode es el tema default (UX-DR6)

**Given** el LocaleToggle visible
**When** hago click para cambiar idioma
**Then** la página navega a la versión en el otro idioma (ES ↔ EN) manteniendo la ruta actual (FR10)
**And** el badge indica claramente el idioma activo (ES azul, EN verde) (UX-DR15)

**Given** cualquier página pública
**When** hago scroll hacia abajo
**Then** el Footer se muestra con: links de navegación rápida (Home, Projects, Experience, Blog, Contact), iconos sociales (LinkedIn, GitHub, email), copyright (UX-DR26)
**And** aparece un botón BackToTop flotante cuando el scroll supera 50vh (UX-DR27)
**And** click en BackToTop hace smooth scroll al inicio de la página

**Given** cualquier elemento interactivo (links, botones, toggles)
**When** navego con teclado (Tab)
**Then** todos los elementos son accesibles en orden lógico: skip link → header nav → main → footer (UX-DR52)
**And** cada elemento muestra focus indicator de 2px solid en primary color (UX-DR53)
**And** el skip link "Saltar al contenido" aparece como primer elemento focusable (NFR19)

### Story 2.2: Home Page — Hero, About y Technologies

As a visitor (Sarah, recruiter),
I want to see Christopher's professional profile, skills, and technologies immediately on the home page,
So that I can evaluate his competence in seconds with a clear, professional first impression.

**Acceptance Criteria:**

**Given** un visitante accede a `/` (ES) o `/en/` (EN)
**When** la página carga
**Then** la sección Hero muestra: nombre en tamaño display, rol/subtítulo, avatar con gradient border (#48A1CD → #108385), y CTA button primario apuntando a Projects (UX-DR63)
**And** todo el contenido above-the-fold está fully rendered en < 1.5s LCP (NFR1, UX-DR85)
**And** no hay skeleton placeholders visibles en el render inicial del hero

**Given** la Home page cargada
**When** hago scroll a la sección About
**Then** se muestra una descripción profesional breve de Christopher con skills destacados (UX-DR64)
**And** el contenido se muestra en el idioma seleccionado (ES o EN) (FR13)

**Given** la Home page cargada
**When** hago scroll a la sección Technologies
**Then** se muestra la sección "Knowledge Of" con tecnologías en fila horizontal centrada, cada una con ícono/imagen + nombre debajo, replicando el layout del sitio actual (UX-DR65)
**And** los datos vienen de la colección Technologies de Firestore (build-time via Admin SDK)
**And** el grid es responsive: ajusta columnas según breakpoint (UX-DR5)

**Given** la Home page completa
**When** reviso el HTML generado
**Then** incluye meta tags: title, description, OpenGraph (og:title, og:description, og:image, og:url), Twitter Cards (FR42)
**And** incluye structured data JSON-LD para Person y WebSite (UX-DR73)
**And** incluye hreflang tags para ES y EN (FR14)
**And** la estructura HTML es semántica: `<header>`, `<main>` con `<section>` por bloque, heading hierarchy lógica h1 → h2 → h3 (NFR18, UX-DR58)

**Given** la Home page en modo dark y light
**When** verifico contraste de texto
**Then** el ratio es mínimo 4.5:1 para texto normal y 3:1 para texto grande en ambos temas (NFR16, UX-DR60)

### Story 2.3: Home Page — Projects Destacados, Experience y Contact

As a visitor (Sarah, recruiter),
I want to see featured projects, work experience, and contact options on the home page,
So that I can get a complete overview of Christopher's professional profile without navigating away.

**Acceptance Criteria:**

**Given** la Home page cargada
**When** hago scroll a la sección Projects Destacados
**Then** se muestran 3 project cards con: thumbnail, título, descripción breve, technology tags (UX-DR66)
**And** cada card tiene hover elevation con shadow sutil y transición 200ms (UX-DR90, UX-DR122)
**And** existe un link "Ver todos" / "See all" que navega a `/projects` (o `/en/projects`)
**And** el grid es responsive: 1 col mobile, 2 tablet, 3 desktop con min 300px por card (UX-DR35)

**Given** la Home page cargada
**When** hago scroll a la sección Experience
**Then** se muestra la experiencia laboral como lista vertical de cards con: empresa (bold), badge de rol en teal, rango de fechas, responsabilidades con bullets — replicando el layout del sitio actual (FR5, UX-DR69)
**And** en mobile se adapta a layout single-column
**And** los datos vienen de la colección Experiences de Firestore en el idioma seleccionado (FR13)

**Given** la Home page cargada
**When** hago scroll a la sección Contact
**Then** se muestra un formulario de contacto con: selector de canal (WhatsApp o Email), código de país, campo de mensaje (FR8, UX-DR72)
**And** el formulario tiene validación inline on blur con mensajes bajo el campo (UX-DR29)
**And** el submit muestra spinner → disabled durante envío → confirmación o error (UX-DR39, UX-DR24)

**Given** la Home page cargada
**When** busco links a redes sociales
**Then** están visibles iconos clickeables para GitHub, LinkedIn y TikTok que abren en nueva pestaña (FR9)

**Given** todas las imágenes de la Home page
**When** verifico el comportamiento de carga
**Then** las imágenes above-the-fold cargan normalmente, las below-the-fold usan `loading="lazy"` (NFR6, UX-DR88)
**And** las imágenes tienen dimensiones fijas para evitar layout shift (CLS < 0.05) (NFR3, UX-DR86)
**And** todas las imágenes de contenido tienen alt text descriptivo (NFR17, UX-DR59)

### Story 2.4: Catálogo de Proyectos con Filtro por Tecnología

As a visitor,
I want to browse all projects and filter them by technology,
So that I can find projects relevant to my interests and evaluate Christopher's experience with specific technologies.

**Acceptance Criteria:**

**Given** un visitante navega a `/projects` (ES) o `/en/projects` (EN)
**When** la página carga
**Then** se muestran todos los proyectos como cards con: thumbnail, título, descripción, technology tags (FR2)
**And** el grid es responsive: 1 col mobile, 2 tablet, 3 desktop (UX-DR35)
**And** el contenido se muestra en el idioma seleccionado (FR13)

**Given** la página de catálogo cargada
**When** hago click en el filtro "All"
**Then** se muestran todos los proyectos sin filtro (UX-DR20)

**Given** la página de catálogo cargada
**When** hago click en un filtro de tecnología específica (ej: "Flutter", "Firebase")
**Then** solo se muestran los proyectos que usan esa tecnología
**And** el filtrado es instantáneo sin page reload (UX-DR92)
**And** los cards no visibles hacen fade-out animado y los visibles fade-in (UX-DR92)

**Given** un filtro aplicado sin resultados
**When** ningún proyecto coincide
**Then** se muestra un estado "no results" con mensaje útil (UX-DR43)

**Given** la página de catálogo
**When** hago click en un project card
**Then** navego a la página de detalle del proyecto con URL limpia `/projects/[slug]` (FR46)

**Given** la página de catálogo
**When** reviso el HTML generado
**Then** incluye meta tags y OpenGraph apropiados para la página de catálogo (FR42)
**And** incluye hreflang tags para ES y EN (FR14)

### Story 2.5: Detalle de Proyecto con ImageViewer

As a visitor (Sarah, recruiter / tech lead reviewing portfolio),
I want to see full project details with an interactive image gallery,
So that I can understand the scope, technologies, and visual quality of Christopher's work.

**Acceptance Criteria:**

**Given** un visitante navega a `/projects/[slug]` (ES) o `/en/projects/[slug]` (EN)
**When** la página carga
**Then** se muestra: título del proyecto, descripción completa, features listados, tecnologías usadas como tags, imagen principal prominente (FR3)
**And** se muestran links externos donde aplique: demo en vivo, código fuente, documentación (FR3)
**And** existe un botón/link para volver al catálogo de proyectos (UX-DR67)
**And** el contenido se muestra en el idioma seleccionado (FR13)

**Given** la página de detalle con screenshots
**When** hago click en una imagen/screenshot
**Then** se abre el ImageViewer en modo fullscreen (FR4, UX-DR16)
**And** puedo navegar entre imágenes con botones prev/next
**And** puedo navegar con arrow keys del teclado (izquierda/derecha) (UX-DR54)
**And** puedo hacer swipe en dispositivos touch (UX-DR96)
**And** la transición entre imágenes es suave (fade/slide 300ms) (UX-DR96)

**Given** el ImageViewer abierto
**When** presiono Escape o click fuera del visor
**Then** el ImageViewer se cierra y el focus retorna al elemento que lo abrió (UX-DR54)
**And** mientras está abierto, el focus queda atrapado dentro del modal (focus trap) (UX-DR55)

**Given** el ImageViewer con imágenes
**When** las imágenes cargan
**Then** las imágenes no visibles usan lazy loading (UX-DR88)
**And** se muestra loading skeleton mientras carga cada imagen (UX-DR37)

**Given** la página de detalle de proyecto
**When** reviso el HTML generado
**Then** incluye meta tags y OpenGraph específicos del proyecto (título, descripción, imagen principal) (FR42)
**And** incluye hreflang tags para ES y EN (FR14)
**And** la URL es limpia basada en slug: `/projects/[slug]` (FR46)

### Story 2.6: SEO, Sitemap y robots.txt

As a visitor or search engine crawler,
I want the site to have complete SEO infrastructure,
So that the portfolio is discoverable, indexable, and looks professional when shared on social media.

**Acceptance Criteria:**

**Given** el sitio completo desplegado
**When** accedo a `/sitemap-index.xml`
**Then** el sitemap se genera automáticamente con todas las páginas públicas en ambos idiomas (ES y EN) (FR44)
**And** incluye: Home, Projects (listado + cada proyecto individual), Experience, Blog, Contact
**And** las URLs del sitemap son limpias y correctas

**Given** el sitio desplegado
**When** accedo a `/robots.txt`
**Then** permite indexación de todas las rutas públicas (FR45)
**And** bloquea `/admin` y `/admin/*` para crawlers
**And** incluye referencia al sitemap

**Given** cualquier página pública
**When** reviso los meta tags del `<head>`
**Then** cada página tiene: `<title>` único y descriptivo, `<meta name="description">` relevante, OpenGraph tags (og:title, og:description, og:image, og:url, og:type), Twitter Card tags (FR42)
**And** cada página tiene hreflang tags apuntando a la versión alternativa en el otro idioma (FR14)

**Given** la Home page
**When** reviso el structured data
**Then** incluye JSON-LD para: Person schema (nombre, rol, links sociales de Christopher), WebSite schema (UX-DR73)

**Given** cualquier proyecto con URL `/projects/[slug]`
**When** comparto el link en LinkedIn o redes sociales
**Then** el preview muestra: título del proyecto, descripción, imagen principal correctamente formateada (FR42)

**Given** todas las páginas públicas
**When** ejecuto Lighthouse SEO audit
**Then** el score es > 95 (NFR25)

---

## Epic 3: Panel de Administración y Gestión de Contenido

Christopher puede gestionar todo el contenido de su portfolio (proyectos, tecnologías, experiencias) desde un panel admin protegido con autenticación, gestión robusta de imágenes y cero assets huérfanos.

### Story 3.1: Autenticación y Protección de Rutas Admin

As an admin (Christopher),
I want to log in securely to the admin panel and have all admin routes protected,
So that only I can access and modify portfolio content.

**Acceptance Criteria:**

**Given** un visitante no autenticado
**When** navega a `/admin` o cualquier ruta `/admin/*`
**Then** es redirigido a la página de login (FR18)
**And** la página de login muestra campos de email y password con diseño limpio y profesional

**Given** la página de login
**When** Christopher ingresa email y password válidos y hace click en "Iniciar sesión"
**Then** Firebase Auth autentica con email/password (FR16)
**And** la sesión se establece y persiste entre recargas de página (NFR26)
**And** el usuario es redirigido al dashboard del admin

**Given** la página de login
**When** Christopher ingresa credenciales inválidas
**Then** se muestra un mensaje de error user-friendly en el idioma correspondiente (UX-DR42)
**And** los mensajes mapean Firebase error codes a texto legible (ej: `auth/wrong-password` → "Contraseña incorrecta")
**And** el campo de password se limpia pero el email se mantiene

**Given** Christopher autenticado en el admin
**When** hace click en "Cerrar sesión"
**Then** la sesión de Firebase Auth se cierra (FR17)
**And** el usuario es redirigido a la página de login
**And** las rutas admin ya no son accesibles hasta un nuevo login

**Given** las Firestore Security Rules desplegadas
**When** un usuario no autenticado intenta escribir directamente a Firestore o Storage
**Then** la operación es rechazada por las Security Rules (NFR10, NFR11)
**And** solo el UID del admin puede crear/editar/eliminar documentos y archivos

**Given** el formulario de login
**When** navego con teclado
**Then** Tab mueve el focus entre email → password → botón submit en orden lógico
**And** Enter en el campo password envía el formulario
**And** los campos tienen labels accesibles (no solo placeholders) (UX-DR57)

### Story 3.2: Layout Admin, Dashboard y Navegación

As an admin (Christopher),
I want an intuitive admin interface with clear navigation and feedback systems,
So that I can manage content efficiently even after months without using the panel.

**Acceptance Criteria:**

**Given** Christopher autenticado en el admin
**When** accede al panel
**Then** se muestra el AdminLayout con: sidebar de navegación a la izquierda (250px fijo en desktop), área de contenido principal a la derecha (UX-DR21)
**And** el sidebar muestra items con icono + label: Projects, Technologies, Experiences, Blog
**And** el item de la sección actual está highlighted con background color primary/10% (UX-DR21)
**And** el header del admin incluye botón de logout y breadcrumb navigation (UX-DR50)

**Given** el admin en viewport < 450px (mobile)
**When** el sidebar se muestra
**Then** funciona como drawer que slide desde la izquierda con overlay behind (UX-DR33)
**And** Escape cierra el drawer
**And** el overlay previene interacción con el contenido detrás

**Given** Christopher en el admin
**When** navega entre secciones
**Then** el breadcrumb se actualiza mostrando: Admin > Section > Action (ej: Admin > Projects > Editar "Mi App") (UX-DR50)
**And** cada parte del breadcrumb excepto la actual es clickable

**Given** Christopher en el dashboard (página principal del admin)
**When** la página carga
**Then** se muestran contadores de entidades: Projects (N), Technologies (N), Experiences (N), Blog (N) con datos reales de Firestore (UX-DR74)
**And** se muestran navigation cards a cada sección y quick action buttons ("Crear nuevo proyecto", "Escribir artículo") (UX-DR74)

**Given** cualquier operación CRUD exitosa en el admin
**When** la operación completa
**Then** se muestra un Toast de success (verde, checkmark, auto-dismiss 4s) (UX-DR23)

**Given** cualquier operación CRUD que falla
**When** ocurre un error
**Then** se muestra un Toast de error (rojo, X icon, persiste hasta dismiss) con mensaje user-friendly y botón retry opcional (UX-DR23, UX-DR42)
**And** múltiples toasts se apilan verticalmente (máximo 3 visibles) con aria-live para screen readers (UX-DR23, UX-DR56)

### Story 3.3: ImageService — Gestión Centralizada de Assets

As an admin (Christopher),
I want a reliable image management system that handles uploads, replacements, and deletions,
So that I never have orphaned files in Storage and image operations are consistent and predictable.

**Acceptance Criteria:**

**Given** el módulo ImageService en `src/lib/services/image-service.ts`
**When** reviso la API pública
**Then** expone los métodos: `upload(file, path): Promise<StoredImage>`, `replace(old, file, newPath): Promise<StoredImage>`, `delete(image): Promise<void>`, `deleteByPrefix(pathPrefix): Promise<void>`
**And** `StoredImage` tiene la estructura `{ url: string, storagePath: string }`

**Given** un archivo de imagen seleccionado
**When** llamo a `upload(file, path)`
**Then** el archivo se sube a Firebase Storage en la ruta especificada en formato .webp
**And** retorna un `StoredImage` con la URL pública de descarga y el storagePath para eliminación futura
**And** la operación completa en < 3s para archivos de hasta 5MB (NFR7)

**Given** una imagen existente (StoredImage) y un nuevo archivo
**When** llamo a `replace(oldImage, newFile, newPath)`
**Then** el orden de operaciones es: 1) upload nuevo → 2) actualización del caller (Firestore) → 3) delete viejo
**And** si el delete del viejo falla, el nuevo ya está guardado (pérdida menor aceptable vs corrupción)
**And** no quedan assets huérfanos en Storage (FR41)

**Given** una imagen existente o un prefix de Storage
**When** llamo a `delete(image)` o `deleteByPrefix(pathPrefix)`
**Then** los archivos se eliminan de Firebase Storage
**And** `deleteByPrefix` elimina todos los archivos bajo el prefijo (usado al eliminar entidades completas)

**Given** el ImageSlot como estado de UI
**When** reviso los tipos
**Then** es un discriminated union con variantes: `{ type: 'empty' }`, `{ type: 'existing', image: StoredImage }`, `{ type: 'new', file: File, preview: string }`, `{ type: 'replaced', old: StoredImage, file: File, preview: string }`, `{ type: 'removed', old: StoredImage }`
**And** los componentes de formulario usan ImageSlot para rastrear el estado de cada imagen

**Given** cualquier operación de imagen
**When** ocurre un error de red o permiso
**Then** el error se captura y se muestra mensaje user-friendly (UX-DR45)
**And** se ofrece opción de retry

### Story 3.4: CRUD de Tecnologías (Admin)

As an admin (Christopher),
I want to create, edit, delete, and list technologies,
So that I can keep my technology skills up to date in the portfolio.

**Acceptance Criteria:**

**Given** Christopher navega a la sección Technologies del admin
**When** la página carga
**Then** se muestra la lista completa de tecnologías con: icono/imagen + nombre por cada una (FR26, UX-DR76)
**And** cada item tiene botones de acción: Edit, Delete
**And** un botón "Crear nueva" siempre visible en la parte superior (UX-DR76)

**Given** la lista de tecnologías vacía
**When** no hay tecnologías registradas
**Then** se muestra un empty state con mensaje e ícono + CTA "Crear la primera tecnología" (UX-DR43)

**Given** Christopher hace click en "Crear nueva"
**When** se abre el formulario de creación
**Then** muestra campos: nombre, upload de icono/imagen (ImageUploader con drag & drop), años de experiencia (numérico) (FR23, UX-DR80)
**And** los campos requeridos muestran asterisco (*) y `aria-required="true"` (UX-DR30)
**And** la validación es inline on blur (UX-DR29)

**Given** Christopher llena el formulario correctamente y hace click en Guardar
**When** la operación se ejecuta
**Then** el botón muestra spinner + disabled durante la operación (previene doble-submit) (UX-DR39)
**And** la imagen se sube via ImageService a `technologies/{techId}/{uuid}.webp`
**And** el documento se crea en Firestore con el schema correcto (validado con Zod)
**And** se muestra toast de success y la lista se actualiza mostrando la nueva tecnología (UX-DR47)
**And** la operación completa en < 3s (NFR7)

**Given** Christopher hace click en Edit en una tecnología existente
**When** se abre el formulario de edición
**Then** los campos se pre-populan con los datos actuales incluyendo preview de la imagen existente (FR24)
**And** al reemplazar la imagen, el sistema usa ImageService.replace (sube nueva, actualiza Firestore, elimina vieja) (FR39)

**Given** Christopher hace click en Delete en una tecnología
**When** se muestra el diálogo de confirmación
**Then** el modal muestra: nombre de la tecnología, impacto ("Se eliminará 1 imagen de Storage"), botones Danger/Cancel (UX-DR22, UX-DR83)
**And** Enter confirma, Escape cancela (UX-DR54)
**And** el focus queda atrapado en el modal (UX-DR55)

**Given** Christopher confirma la eliminación
**When** la operación se ejecuta
**Then** el documento se elimina de Firestore Y la imagen asociada se elimina de Storage (FR25, FR40)
**And** cero assets huérfanos quedan en Storage (FR41)
**And** se muestra toast de success y la lista se actualiza

### Story 3.5: CRUD de Experiencias (Admin)

As an admin (Christopher),
I want to create, edit, delete, and list work experiences,
So that I can keep my professional timeline current and accurate in both languages.

**Acceptance Criteria:**

**Given** Christopher navega a la sección Experiences del admin
**When** la página carga
**Then** se muestra la lista de experiencias con: empresa, cargo, rango de fechas por cada una (FR30, UX-DR77)
**And** cada item tiene botones Edit y Delete
**And** botón "Crear nueva" visible en la parte superior

**Given** la lista vacía
**When** no hay experiencias
**Then** se muestra empty state con CTA "Agregar primera experiencia" (UX-DR43)

**Given** Christopher hace click en "Crear nueva"
**When** se abre el formulario
**Then** muestra campos bilingües (BilingualField) para: empresa, cargo, responsabilidades — con badges ES (azul) y EN (verde) side-by-side en desktop, tabs en mobile (FR27, UX-DR18, UX-DR34, UX-DR106)
**And** muestra campos de fecha: fecha inicio y fecha fin (opcional, null = presente) con date picker HTML5 (UX-DR108)
**And** validación: fecha fin > fecha inicio si ambas están definidas
**And** campos requeridos con asterisco y aria-required (UX-DR30)
**And** los botones de acción: Guardar (derecha), Cancelar (izquierda) (UX-DR31)

**Given** Christopher llena el formulario y hace click en Guardar
**When** la validación pasa
**Then** el documento se crea en Firestore con campos bilingües como objetos anidados: `companyName: { es, en }`, `jobTitle: { es, en }`, `responsibilities: { es: [...], en: [...] }`, fechas como Timestamps
**And** se valida contra `experienceSchema` de Zod antes de guardar
**And** botón muestra spinner durante operación (UX-DR39)
**And** toast de success y lista actualizada (UX-DR47)

**Given** Christopher edita una experiencia
**When** modifica campos bilingües
**Then** ambos idiomas se actualizan independientemente (FR28)
**And** al guardar, solo los campos modificados se actualizan en Firestore

**Given** Christopher elimina una experiencia
**When** confirma en el diálogo de confirmación
**Then** el documento se elimina de Firestore (FR29)
**And** toast de success y lista actualizada
**And** no hay assets de Storage asociados a experiencias (no requiere limpieza de Storage)

### Story 3.6: CRUD de Proyectos (Admin)

As an admin (Christopher),
I want to create, edit, delete, and list projects with full bilingual content and image management,
So that I can showcase my work with professional descriptions, screenshots, and technology associations.

**Acceptance Criteria:**

**Given** Christopher navega a la sección Projects del admin
**When** la página carga
**Then** se muestra la lista de proyectos con: thumbnail, nombre, fecha de creación, fecha de actualización (FR22, UX-DR75)
**And** la lista es sortable por nombre o fecha
**And** cada item tiene botones Edit y Delete
**And** botón "Crear nuevo" visible en la parte superior

**Given** Christopher hace click en "Crear nuevo"
**When** se abre el formulario de creación
**Then** muestra secciones agrupadas con headers (UX-DR28, UX-DR79):
**And** Sección "Información Básica": nombre (BilingualField ES/EN), descripción (BilingualField textarea ES/EN), features (BilingualField lista ES/EN) (FR19)
**And** Sección "Imágenes": ImageUploader para imagen principal (single), ImageUploader para screenshots (múltiple, drag & drop, reorderable) — máximo 5MB por archivo (UX-DR17, UX-DR114, UX-DR115)
**And** Sección "Tecnologías": multi-select dropdown/chip input de tecnologías existentes con búsqueda (UX-DR107)
**And** Sección "Links": campos URL opcionales para GitHub, demo, documentación con validación de formato (UX-DR110)

**Given** Christopher sube screenshots al formulario
**When** arrastra archivos al drop zone o los selecciona via browse
**Then** cada imagen muestra preview inmediato antes del upload (UX-DR113)
**And** puede reordenar screenshots con drag & drop (UX-DR115)
**And** puede eliminar screenshots individuales con botón delete
**And** los estados de imagen muestran badges de color: azul "Subida", verde "Nueva", naranja "Reemplazando", rojo "Se eliminará" (UX-DR44)

**Given** Christopher llena el formulario completo y hace click en Guardar
**When** la operación se ejecuta
**Then** las imágenes se suben via ImageService a `projects/{projectId}/images/{uuid}.webp` y `projects/{projectId}/screenshots/{uuid}.webp`
**And** el documento se crea en Firestore con todos los campos bilingües como objetos anidados, screenshots como `StoredImage[]`, tecnologías como array de IDs
**And** se valida contra `projectSchema` de Zod antes de guardar
**And** la operación completa en < 3s (NFR7)
**And** toast de success y navegación a la lista de proyectos

**Given** Christopher edita un proyecto existente
**When** reemplaza la imagen principal
**Then** el sistema usa ImageService.replace: sube nueva → actualiza Firestore → elimina vieja de Storage (FR39)
**And** la imagen anterior no queda huérfana en Storage (FR41)

**Given** Christopher edita un proyecto y reordena screenshots
**When** hace drag & drop para cambiar el orden
**Then** solo cambia la posición en el array de Firestore (los paths de Storage son inmutables con UUIDs)
**And** el nuevo orden se refleja inmediatamente en la UI

**Given** Christopher hace click en Delete en un proyecto
**When** el diálogo de confirmación aparece
**Then** muestra: nombre del proyecto, impacto detallado ("Se eliminarán N imágenes de Storage"), botones Danger/Cancel (UX-DR83)

**Given** Christopher confirma la eliminación
**When** la operación se ejecuta
**Then** el documento se elimina de Firestore (FR21)
**And** TODAS las imágenes asociadas se eliminan de Storage via `deleteByPrefix('projects/{projectId}/')` (FR40)
**And** cero assets huérfanos (FR41)
**And** toast de success y lista actualizada

---

## Epic 4: Sistema de Blog

Christopher puede escribir y publicar artículos técnicos con editor rico. Visitantes pueden leer artículos con formato profesional, código destacado, imágenes embebidas y compartirlos en redes sociales.

> **Diseño del Blog:** Las stories públicas del blog (4.1 Blog Listing, 4.2 Blog Post) son features nuevas que no existen en el sitio actual. Se diseñan desde cero siguiendo la dirección "Technical Craft" del UX spec, pero deben ser visualmente consistentes con la estética del sitio público existente: mismos colores de marca, Poppins, dark mode como default, estilo de cards consistente con las cards de proyectos existentes. Las stories de admin del blog (4.3, 4.4) siguen el diseño del admin rediseñado (Epic 3).

### Story 4.1: Blog Listing — Página Pública de Artículos

As a visitor,
I want to browse published blog articles on the portfolio,
So that I can read Christopher's technical content and evaluate his knowledge and communication skills.

**Acceptance Criteria:**

**Given** un visitante navega a `/blog` (ES) o `/en/blog` (EN)
**When** la página carga
**Then** se muestran cards de artículos con: título, fecha de publicación, tiempo estimado de lectura, excerpt/resumen, cover image, tags (FR6, UX-DR70)
**And** los artículos están ordenados por fecha (más reciente primero)
**And** el contenido se muestra en el idioma seleccionado (FR13)

**Given** la página de blog listing
**When** reviso los artículos mostrados
**Then** solo los artículos con estado "published" son visibles (FR37)
**And** artículos en estado "draft" NO aparecen en la lista pública

**Given** la lista de blog sin artículos publicados
**When** la página carga
**Then** se muestra un empty state con mensaje amigable (ej: "Próximamente artículos técnicos") (UX-DR43)

**Given** un card de artículo
**When** hago click en él
**Then** navego a la página individual del artículo con URL limpia `/blog/[slug]` (FR46)

**Given** la página de blog listing
**When** reviso el HTML
**Then** incluye meta tags y OpenGraph apropiados para la página de listado (FR42)
**And** incluye hreflang tags para ES y EN (FR14)
**And** los cards tienen hover elevation sutil con transición 200ms (UX-DR90)

**Given** las imágenes de cover de los artículos
**When** la página carga
**Then** las imágenes usan lazy loading para below-the-fold (UX-DR88)
**And** tienen dimensiones fijas para evitar CLS (NFR3, UX-DR86)
**And** tienen alt text descriptivo (NFR17)

### Story 4.2: Blog Post — Página Individual de Artículo

As a visitor,
I want to read a full blog article with professional formatting, code highlighting, and embedded images,
So that I can learn from Christopher's technical content and share it on social media.

**Acceptance Criteria:**

**Given** un visitante navega a `/blog/[slug]` (ES) o `/en/blog/[slug]` (EN)
**When** la página carga
**Then** se muestra: título como h1, metadata (fecha de publicación, tiempo de lectura estimado calculado por word count), cover image prominente (FR7, UX-DR71, UX-DR104)
**And** el contenido rico se renderiza con formato completo: headings (h1-h3), párrafos con line-height 1.6, listas ordenadas y no ordenadas, blockquotes con distinción visual, negritas, itálicas, links (UX-DR105)

**Given** el contenido del artículo contiene code blocks
**When** se renderizan
**Then** muestran syntax highlighting para múltiples lenguajes (UX-DR102)
**And** cada code block tiene botón copy-to-clipboard (UX-DR102)
**And** code blocks largos tienen scroll container horizontal (UX-DR102)
**And** usan fuente monospace (JetBrains Mono o Fira Code) distinta del body text (UX-DR125)

**Given** el contenido del artículo contiene imágenes embebidas
**When** se renderizan
**Then** las imágenes son responsive (constrained a max-width legible) (UX-DR103)
**And** usan lazy loading (UX-DR88)
**And** tienen alt text descriptivo (NFR17)

**Given** el HTML generado del artículo
**When** reviso la seguridad del contenido
**Then** el HTML del contenido fue sanitizado en build time con `sanitize-html` (tags permitidos: p, h1-h3, ul, ol, li, a, img, code, pre, blockquote, strong, em)
**And** se usa `set:html` solo para contenido pre-sanitizado (prevención XSS)

**Given** la página del artículo
**When** reviso los meta tags
**Then** incluye OpenGraph específico: og:title con título del artículo, og:description con excerpt, og:image con cover image del artículo, og:url, og:type="article" (FR43, UX-DR73)
**And** incluye hreflang tags para ES y EN (FR14)
**And** cuando comparto el link en LinkedIn, el preview muestra título, descripción e imagen correctamente

**Given** la página del artículo
**When** reviso la estructura semántica
**Then** usa `<article>` como wrapper, heading hierarchy lógica, semántica correcta (UX-DR58)
**And** cumple Lighthouse Accessibility > 95 (NFR14)

### Story 4.3: CRUD Blog — Listado y Gestión en Admin

As an admin (Christopher),
I want to manage blog articles from the admin panel with status control,
So that I can create drafts, publish when ready, and remove articles with their associated images.

**Acceptance Criteria:**

**Given** Christopher navega a la sección Blog del admin
**When** la página carga
**Then** se muestra la lista de TODOS los artículos (publicados Y borradores) con: título, status badge (Published verde / Draft naranja), fecha de publicación (FR36, UX-DR78)
**And** cada item tiene botones: Edit, Delete, View (abre el artículo público en nueva pestaña, solo si published)
**And** botón "Crear nuevo" visible en la parte superior

**Given** la lista de blog vacía
**When** no hay artículos
**Then** se muestra empty state con CTA "Escribir el primer artículo →" (UX-DR43)

**Given** Christopher hace click en "Crear nuevo"
**When** se inicia la creación de un artículo
**Then** se genera un nuevo documento en Firestore con estado "draft" por defecto (FR31)
**And** se abre el formulario de edición del artículo (Story 4.4)

**Given** Christopher hace click en el status badge de un artículo
**When** cambia entre Published y Draft
**Then** el estado se actualiza en Firestore inmediatamente (FR35)
**And** si cambia de Published a Draft, se muestra confirmación: "El artículo dejará de ser visible en el sitio público" (UX-DR111)
**And** toast de success confirma el cambio

**Given** Christopher hace click en Delete en un artículo
**When** el diálogo de confirmación aparece
**Then** muestra: título del artículo, impacto ("Se eliminarán N imágenes de Storage"), botones Danger/Cancel (UX-DR83, UX-DR22)
**And** Enter confirma, Escape cancela, focus trap activo (UX-DR55)

**Given** Christopher confirma la eliminación
**When** la operación se ejecuta
**Then** el documento se elimina de Firestore (FR34)
**And** TODAS las imágenes asociadas (cover + embebidas en contenido) se eliminan de Storage via `deleteByPrefix('blog/{postId}/')` (FR40)
**And** cero assets huérfanos (FR41)
**And** toast de success y lista actualizada

### Story 4.4: Blog Editor Rico con TipTap

As an admin (Christopher),
I want a rich text editor for writing blog articles with images, code blocks, and full formatting,
So that I can create professional technical content with a comfortable editing experience.

**Acceptance Criteria:**

**Given** Christopher abre el formulario de creación/edición de un artículo
**When** el editor carga
**Then** muestra secciones agrupadas (UX-DR82):
**And** Sección "Título": BilingualField (ES/EN) para el título del artículo (UX-DR18)
**And** Sección "Slug": campo auto-generado del título (slugificado), editable manualmente, con validación de caracteres URL válidos y tooltip explicativo (UX-DR112)
**And** Sección "Cover Image": ImageUploader para imagen de portada (single, drag & drop) (UX-DR17)
**And** Sección "Contenido": RichTextEditor con tabs ES/EN para editar contenido en ambos idiomas (UX-DR19)
**And** Sección "Metadata": excerpt/resumen (BilingualField textarea), status toggle Published/Draft (UX-DR111)

**Given** el RichTextEditor (TipTap) cargado
**When** Christopher escribe contenido
**Then** la toolbar ofrece: H1, H2, H3, bold, italic, code inline, code block, link insertion, image upload, listas ordenadas y no ordenadas, blockquote (UX-DR19)
**And** el contenido se almacena como HTML en Firestore en campos bilingües: `content: { es: "<html>...", en: "<html>..." }`

**Given** Christopher hace click en el botón de imagen en la toolbar
**When** selecciona o arrastra una imagen
**Then** la imagen se sube via ImageService a `blog/{postId}/content/{uuid}.webp` (FR32)
**And** se inserta en el contenido del editor en la posición del cursor
**And** muestra preview inmediato con progress bar durante upload (UX-DR113)

**Given** Christopher edita un artículo existente
**When** el formulario carga
**Then** todos los campos se pre-populan: título ES/EN, slug, cover image preview, contenido rico ES/EN en el editor, excerpt, status actual (FR33)
**And** el slug muestra el valor actual (editable si necesario)

**Given** Christopher modifica el slug
**When** escribe en el campo slug
**Then** el sistema valida que solo contenga caracteres URL válidos (letras minúsculas, números, guiones) (UX-DR112)
**And** si el slug auto-generado coincide con uno existente, muestra warning

**Given** Christopher hace click en Guardar
**When** la validación pasa (título ES/EN requerido, contenido requerido, slug único)
**Then** el documento se actualiza en Firestore con todos los campos
**And** se valida contra `blogPostSchema` de Zod antes de guardar
**And** botón muestra spinner durante operación (UX-DR39)
**And** toast de success y navegación a la lista de blog (UX-DR47)
**And** la operación completa en < 3s (NFR7)

**Given** Christopher cierra el formulario sin guardar con cambios pendientes
**When** intenta navegar fuera
**Then** se muestra confirmación de cambios sin guardar (UX-DR31)

---

## Epic 5: Calidad, Testing y Pipeline de Deployment

El repositorio mantiene calidad profesional verificable con tests automatizados, CI/CD pipeline completo, Lighthouse CI como quality gate, y deployment confiable a Firebase Hosting. El proyecto queda open source ready.

### Story 5.1: Configuración de Testing — Vitest y Playwright

As a developer,
I want a comprehensive testing setup with unit and E2E tests covering critical paths,
So that the codebase maintains professional quality with >80% coverage and automated regression detection.

**Acceptance Criteria:**

**Given** el proyecto con todas las features implementadas (Epics 1-4)
**When** reviso la configuración de Vitest
**Then** `vitest.config.ts` está configurado compartiendo config con Vite via `getViteConfig()`
**And** los unit tests están co-localizados en directorios `__tests__/` junto al código fuente
**And** el coverage report está habilitado con threshold de 80% mínimo (NFR20)

**Given** Vitest configurado
**When** ejecuto `pnpm test`
**Then** se ejecutan unit tests para:
**And** Zod schemas: validación correcta de datos válidos e inválidos para las 4 colecciones
**And** ImageService: upload retorna StoredImage, replace ejecuta en orden correcto, delete elimina archivo
**And** i18n utils: getCurrentLocale retorna locale correcto, getLocalizedPath genera URLs correctas, useTranslation retorna traducciones
**And** Error messages: mapeo de Firebase error codes a mensajes user-friendly en ES y EN
**And** Todos los tests pasan y la cobertura es > 80% (NFR20)

**Given** el proyecto
**When** reviso la configuración de Playwright
**Then** `playwright.config.ts` está configurado con 3 browsers: Chromium, Firefox, WebKit (NFR21)
**And** los tests E2E están en `tests/e2e/` en la raíz del proyecto
**And** el base URL apunta a localhost para desarrollo

**Given** Playwright configurado
**When** ejecuto `pnpm test:e2e`
**Then** se ejecutan E2E tests para navegación pública:
**And** Home page carga correctamente con todas las secciones visibles
**And** Navegación entre páginas funciona (Home → Projects → Project Detail → Blog)
**And** Filtro de proyectos por tecnología muestra/oculta cards correctamente
**And** ImageViewer abre, navega entre imágenes, y cierra con Escape
**And** ThemeToggle cambia entre dark/light y persiste en reload
**And** LocaleToggle cambia idioma y la URL refleja el locale correcto
**And** Todas las páginas tienen meta tags y hreflang correctos

### Story 5.2: E2E Tests para Admin y Blog

As a developer,
I want E2E tests covering admin CRUD operations and blog workflows,
So that content management functionality is verified automatically and regressions are caught before deployment.

**Acceptance Criteria:**

**Given** Playwright configurado con fixtures de autenticación
**When** ejecuto los tests de protección de rutas
**Then** verifican que `/admin`, `/admin/projects`, `/admin/technologies`, `/admin/experiences`, `/admin/blog` redirigen a login cuando no hay sesión activa (NFR8)
**And** verifican que tras login exitoso, el dashboard del admin es accesible

**Given** tests de admin autenticados
**When** ejecuto tests de CRUD Technologies
**Then** verifican: crear tecnología con nombre e icono → aparece en la lista → editar nombre → cambio reflejado → eliminar → ya no aparece en lista → imagen eliminada de Storage

**Given** tests de admin autenticados
**When** ejecuto tests de CRUD Experiences
**Then** verifican: crear experiencia bilingüe con fechas → aparece en lista → editar cargo → cambio reflejado → eliminar → ya no aparece

**Given** tests de admin autenticados
**When** ejecuto tests de CRUD Projects
**Then** verifican: crear proyecto con nombre ES/EN, descripción, imagen principal, screenshots, tecnologías seleccionadas → aparece en lista con thumbnail → editar → reemplazar imagen (vieja eliminada) → eliminar → proyecto y todas las imágenes eliminados

**Given** tests de admin autenticados
**When** ejecuto tests de CRUD Blog
**Then** verifican: crear artículo draft con título ES/EN, contenido en editor rico, cover image, slug → aparece en lista admin con badge "Draft" → NO aparece en `/blog` público → cambiar status a Published → aparece en `/blog` público → eliminar → artículo e imágenes eliminados

**Given** tests de blog editor
**When** ejecuto tests del editor TipTap
**Then** verifican: insertar heading, bold, italic, code block, link, imagen embebida → contenido se guarda correctamente → al recargar, el contenido se muestra formateado en el editor

**Given** todos los E2E tests
**When** se ejecutan completos
**Then** cubren los happy paths de: navegación pública, autenticación, CRUD de las 4 entidades, blog workflow completo (NFR21)
**And** el tiempo total de ejecución es razonable (< 5 minutos)

### Story 5.3: CI/CD Pipeline y Deployment a Firebase

As a developer,
I want an automated CI/CD pipeline that enforces quality gates and deploys to Firebase Hosting,
So that every change is validated for code quality, test coverage, accessibility, and performance before reaching production.

**Acceptance Criteria:**

**Given** el repositorio con código completo
**When** reviso la configuración de linting
**Then** ESLint está configurado para TypeScript, Astro y Svelte con zero warnings (NFR23)
**And** Prettier está configurado como formatter opinionado
**And** `pnpm lint` ejecuta sin warnings ni errores
**And** `pnpm type-check` verifica TypeScript strict sin errores (NFR22)

**Given** el repositorio
**When** reviso `.github/workflows/ci.yml`
**Then** el workflow se triggerea en push a main
**And** ejecuta los steps en orden: `pnpm install` → `pnpm lint` → `pnpm type-check` → `pnpm test` (Vitest) → `pnpm build` (Astro SSG con Admin SDK queries) → Lighthouse CI → `firebase deploy --only hosting` (NFR24)
**And** si cualquier step falla, el pipeline se detiene y NO despliega

**Given** el pipeline de CI
**When** se ejecuta Lighthouse CI
**Then** verifica que las 4 categorías scoren > 95: Performance, Accessibility, Best Practices, SEO (NFR25)
**And** si alguna categoría está por debajo de 95, el pipeline falla y bloquea el deploy

**Given** el pipeline de CI
**When** el build de Astro ejecuta
**Then** las queries de Admin SDK obtienen datos de Firestore y generan HTML estático en `dist/`
**And** las credenciales del Admin SDK se obtienen de GitHub Secrets (`FIREBASE_SERVICE_ACCOUNT_JSON`)
**And** ningún secret aparece en los logs del build (NFR13)

**Given** el repositorio
**When** reviso `.github/workflows/rebuild.yml`
**Then** es un workflow manual (`workflow_dispatch`) que ejecuta el mismo pipeline (NFR24)
**And** sirve para rebuilds post-actualización de contenido desde el admin (~2-3 min latencia)

**Given** un push exitoso a main que pasa todos los quality gates
**When** el deploy a Firebase Hosting completa
**Then** el sitio está disponible en `portfolio-chrisbp.web.app` (NFR29)
**And** Firebase Hosting CDN sirve los archivos estáticos desde `dist/`
**And** las rewrite rules enrutan `/admin/*` correctamente

**Given** el README del proyecto
**When** reviso la documentación final
**Then** incluye badges de CI status (build passing/failing)
**And** la sección de arquitectura está completa: stack, estructura del proyecto, decisiones técnicas
**And** la sección de contribución describe: cómo correr tests, lint, y el pipeline de CI
**And** el proyecto es clonable y deployable por un desarrollador externo siguiendo solo el README (FR47)
