---
stepsCompleted: ['step-01-validate-prerequisites', 'step-02-design-epics', 'step-03-create-stories', 'step-04-final-validation']
status: complete
completedAt: '2026-03-16'
inputDocuments:
  - '_bmad-output/planning-artifacts/prd.md'
  - '_bmad-output/planning-artifacts/architecture.md'
  - '_bmad-output/planning-artifacts/ux-design-specification.md'
  - '_bmad-output/test-artifacts/test-design-architecture.md'
  - '_bmad-output/test-artifacts/test-design-qa.md'
---

# portfolio - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for portfolio, decomposing the requirements from the PRD, UX Design if it exists, and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

FR1: Visitantes pueden ver la página principal con secciones de About Me, Technologies, Projects destacados y Experience
FR2: Visitantes pueden navegar al catálogo completo de proyectos con filtro por tecnología utilizada
FR3: Visitantes pueden ver el detalle de cada proyecto con imágenes, descripción, tecnologías usadas y links externos
FR4: Visitantes pueden ver screenshots de proyectos en un visor de imágenes ampliado
FR5: Visitantes pueden ver la experiencia laboral en formato timeline
FR6: Visitantes pueden ver el listado de artículos de blog publicados
FR7: Visitantes pueden leer un artículo de blog individual con formato rico (headings, párrafos, listas, código, negritas, links, imágenes embebidas)
FR8: Visitantes pueden enviar un mensaje de contacto seleccionando canal (WhatsApp o Email) y código de país
FR9: Visitantes pueden navegar a perfiles de redes sociales (GitHub, LinkedIn, TikTok)
FR10: Visitantes pueden cambiar el idioma del sitio entre Español e Inglés
FR11: Visitantes pueden cambiar el tema visual entre Dark y Light mode
FR12: El sistema persiste la preferencia de tema del visitante entre sesiones
FR13: Todo el contenido público (páginas, proyectos, experiencias, blog) se muestra en el idioma seleccionado
FR14: Cada página pública genera meta tags hreflang para ambos idiomas
FR15: Christopher puede acceder al panel de administración navegando a una ruta dedicada `/admin`
FR16: Christopher puede autenticarse con email y password
FR17: Christopher puede cerrar sesión desde el panel de administración
FR18: El sistema protege todas las rutas de administración — visitantes no autenticados son redirigidos al login
FR19: Christopher puede crear un nuevo proyecto con nombre (ES/EN), descripción (ES/EN), features (ES/EN), imagen principal, screenshots, tecnologías asociadas y URLs externas
FR20: Christopher puede editar cualquier campo de un proyecto existente
FR21: Christopher puede eliminar un proyecto y todos sus assets asociados
FR22: Christopher puede ver la lista completa de proyectos en el admin
FR23: Christopher puede crear una nueva tecnología con nombre, icono/imagen y tiempo de experiencia
FR24: Christopher puede editar cualquier campo de una tecnología existente
FR25: Christopher puede eliminar una tecnología y su imagen asociada
FR26: Christopher puede ver la lista completa de tecnologías en el admin
FR27: Christopher puede crear una nueva experiencia laboral con fecha, empresa, cargo (ES/EN) y responsabilidades (ES/EN)
FR28: Christopher puede editar cualquier campo de una experiencia existente
FR29: Christopher puede eliminar una experiencia
FR30: Christopher puede ver la lista completa de experiencias en el admin
FR31: Christopher puede crear un nuevo artículo de blog con título (ES/EN), contenido con formato rico (headings, párrafos, listas, código, negritas, links, imágenes embebidas), slug personalizable, imagen de portada y estado (publicado/borrador)
FR32: Christopher puede insertar imágenes dentro del contenido de un artículo
FR33: Christopher puede editar cualquier campo de un artículo existente
FR34: Christopher puede eliminar un artículo y todos sus assets asociados
FR35: Christopher puede cambiar el estado de un artículo entre publicado y borrador
FR36: Christopher puede ver la lista de todos los artículos (publicados y borradores) en el admin
FR37: Solo los artículos marcados como publicados son visibles en el sitio público
FR38: Christopher puede subir imágenes al crear o editar proyectos, tecnologías y artículos de blog
FR39: Christopher puede reemplazar una imagen existente — el sistema elimina automáticamente la imagen anterior de Storage
FR40: Al eliminar una entidad (proyecto, tecnología, artículo), el sistema elimina automáticamente todos sus assets de Storage
FR41: El sistema no permite assets huérfanos en Storage bajo ninguna circunstancia
FR42: Cada página pública genera meta tags (title, description, OpenGraph, Twitter Cards) apropiados
FR43: Cada artículo de blog genera OpenGraph con título, descripción e imagen para compartir en redes sociales
FR44: El sistema genera sitemap.xml automáticamente con todas las páginas públicas
FR45: El sistema genera robots.txt bloqueando rutas de admin y permitiendo indexación pública
FR46: Cada proyecto y artículo tiene una URL limpia basada en slug (`/projects/[slug]`, `/blog/[slug]`)
FR47: Un desarrollador puede clonar el repositorio, configurar sus credenciales Firebase y ejecutar el proyecto localmente siguiendo el README
FR48: El repositorio no contiene credenciales, secrets ni datos sensibles en el código fuente
FR49: El repositorio incluye un `.env.example` documentado con todas las variables requeridas

### NonFunctional Requirements

NFR1: Páginas públicas cargan con LCP < 1.5s en conexión 4G
NFR2: Interacciones responden con INP < 100ms
NFR3: Layout no salta durante la carga — CLS < 0.05
NFR4: SSR responde con TTFB < 200ms
NFR5: JavaScript total enviado al navegador < 50KB
NFR6: Imágenes below-the-fold cargan diferido (lazy loading)
NFR7: Operaciones CRUD del admin completan en < 3s incluyendo upload de imágenes
NFR8: Rutas de admin inaccesibles sin autenticación — redirect a login en todo request no autenticado a `/admin/*`
NFR9: Credenciales Firebase nunca expuestas en código — variables de entorno para todas las keys
NFR10: Firestore Security Rules restringen escritura a admin autenticado (solo UID admin)
NFR11: Firebase Storage Rules restringen upload a admin autenticado (solo UID admin)
NFR12: No hay endpoints de API públicos que permitan mutaciones sin auth
NFR13: El repositorio público no contiene secrets — auditoría pre-push
NFR14: Cumplimiento WCAG 2.1 Nivel AA — Lighthouse Accessibility > 95
NFR15: Navegación completa por teclado — todos los elementos interactivos accesibles via Tab/Enter/Escape
NFR16: Contraste suficiente en ambos temas — ratio mínimo 4.5:1 texto normal, 3:1 texto grande
NFR17: Imágenes con texto alternativo descriptivo
NFR18: Estructura semántica correcta — jerarquía headings h1→h6, landmarks ARIA
NFR19: Skip navigation disponible — link "Saltar al contenido" visible en focus
NFR20: Cobertura de tests mínima > 80% líneas cubiertas (Vitest coverage)
NFR21: Tests E2E para flujos críticos — happy paths de navegación pública y CRUD admin (Playwright)
NFR22: TypeScript strict sin errores — `strict: true` en tsconfig
NFR23: Linting sin warnings — ESLint + Prettier configurados
NFR24: Build exitoso en CI — GitHub Actions: build + test + lint pasan en cada push
NFR25: Lighthouse CI como quality gate — 4 categorías > 95 verificadas automáticamente
NFR26: Firebase Auth funcional y estable — login/logout sin errores, sesión persistente
NFR27: Firestore queries eficientes — queries indexadas, sin full collection scans
NFR28: Firebase Storage operaciones confiables — upload/delete con retry en error de red
NFR29: Hosting SSG estable — Firebase Hosting CDN responde consistentemente

### Additional Requirements

- **Starter Template:** `npm create astro@latest` (Astro 6.0 minimal) como base del proyecto — impacta directamente la primera story de implementación
- **SSG puro:** `output: 'static'` — HTML estático servido desde Firebase Hosting CDN, zero server runtime
- **Firebase Hosting:** Infraestructura existente en proyecto `portfolio-chrisbp`, gratis (Spark plan)
- **Data Migration:** Script one-time para transformar datos Firestore de Flutter schema (sufijos `fieldEs`/`fieldEn`, `ImageAndPath`, `responsabilities` como string) al schema profesional (nested localization `field: { es, en }`, `StoredImage`, arrays tipados). Incluye backup, transformación, verificación con Zod schemas, e idempotencia
- **Zod 4 Schemas:** Source of truth para tipos TypeScript y validación — schemas compartidos entre build scripts y admin UI
- **ImageService centralizado:** Patrón `StoredImage` (Firestore) + `ImageSlot` (discriminated union UI) + `ImageService` (upload/replace/delete con orden de operaciones safe-first)
- **Svelte 5 Islands:** Islands interactivas con hidratación selectiva (`client:load` o `client:visible`) para formularios admin, editor blog, toggles, image viewer, contact form
- **TipTap como editor de blog:** Editor rico maduro con HTML limpio, extensiones para code blocks e imágenes
- **i18n nativo de Astro:** Routing por locale (`/en/projects/[slug]`), campos bilingües nested en Firestore, hreflang tags
- **GitHub Actions CI/CD:** Pipeline completo: pnpm install → lint → type-check → test (Vitest) → build (Astro SSG con Admin SDK) → Lighthouse CI → firebase deploy
- **Firebase SDKs:** Client SDK para admin (CRUD directo desde browser) + Admin SDK para build time queries (SSG data fetch)
- **Rebuild trigger:** `gh workflow dispatch` manual para actualizar contenido público después de cambios en admin
- **Firestore Security Rules:** Read público para todas las colecciones, write solo para `request.auth.uid == 'ADMIN_UID'`
- **Storage Security Rules:** Read público, upload/delete solo para UID admin
- **Estructura de proyecto:** Componentes organizados por dominio (`common/`, `home/`, `projects/`, `blog/`, `admin/`), tests co-locados en `__tests__/`, E2E en `tests/e2e/`
- **Naming conventions:** PascalCase colecciones Firestore, camelCase campos, kebab-case archivos TS, PascalCase componentes
- **Node 22+ requerido** por Astro 6
- **pnpm como package manager**
- **Firebase Emulator Suite:** Configurar emuladores de Auth, Firestore y Storage para tests locales y CI (pre-implementación blocker — ASR-1 de test-design-architecture)
- **Test Data Factories:** Factories que generen documentos válidos contra Zod schemas para seeding de tests con faker (pre-implementación blocker — ASR-2 de test-design-architecture)
- **Tests de Security Rules:** Tests específicos con `@firebase/rules-unit-testing` para validar read público, write sin auth denegado, write solo UID admin (4+ tests P0)
- **Extraer lógica CRUD a servicios testeables:** Replicar patrón de ImageService para que CRUD no sea solo testeable vía E2E
- **Test strategy:** ~57 tests totales — P0 (18 tests core), P1 (26 tests high), P2 (13 tests medium). P0 100% antes de lanzamiento

### UX Design Requirements

UX-DR1: Implementar design tokens en Tailwind CSS 4 — paleta semántica completa (primary #48A1CD, primary-dark #108385, background, surface, surface-elevated, text-primary/secondary/muted, border, success, warning, error) con valores específicos para Light Mode y Dark Mode, gradiente de marca `linear-gradient(135deg, #48A1CD, #108385)`, contraste WCAG AA verificado (>7:1 texto primary, >4.5:1 texto secondary)
UX-DR2: Sistema tipográfico completo con Poppins — 8 tokens (display, heading-1/2/3, body, body-small, caption, code), escalas responsive con `clamp()`, pesos 400-700, line-heights 1.1-1.6. Fuente monoespaciada (JetBrains Mono/Fira Code) para code blocks en blog. Google Fonts con `font-display: swap` y preload
UX-DR3: Sistema de espaciado base 4px — 9 tokens (space-1: 4px hasta space-24: 96px), componentes de layout Container (max-width 1200px, padding responsive 16/24/32px), Section (separación 48px mobile, 96px desktop), Grid (auto-responsive min 300px por card)
UX-DR4: Breakpoints custom en Tailwind — Mobile <450px (default), Tablet ≥450px (`sm:`), Desktop ≥900px (`lg:`), Wide ≥1200px (`xl:`). Approach mobile-first
UX-DR5: Dark mode como tema default — CSS custom properties por tema, persistencia en localStorage, respeto a `prefers-color-scheme`, transición suave entre temas
UX-DR6: Componente Button con 4 variantes — primary (gradiente marca, texto blanco, sombra), secondary (outline border primary), danger (background error), ghost (sin background). Regla: máximo 1 primary visible por viewport, touch target mínimo 44x44px
UX-DR7: Componente Card con 4 variantes — project (screenshots + nombre + descripción), blog (metadata + fecha + tiempo lectura), technology (ícono + nombre), experience (empresa + badge teal + fecha + responsabilidades). Hover elevation sutil
UX-DR8: Componente Badge con 3 variantes — technology (chip con borde gradiente), status (publicado verde / borrador naranja), language (ES azul / EN verde)
UX-DR9: Componente Input con variantes — text, textarea, select, file. Labels siempre visibles, validación inline al blur, mensajes error debajo del campo, campos obligatorios con asterisco
UX-DR10: Componente ThemeToggle — FAB flotante abajo-derecha, ícono sol/luna, animación de transición, persistencia localStorage
UX-DR11: Componente LocaleToggle — FAB flotante abajo-derecha, bandera del idioma activo (España/USA), switch ES/EN sin recarga de página
UX-DR12: Componente ImageViewer — overlay fullscreen fondo oscuro semi-transparente, imagen centrada y escalada, botón "X Close" arriba-derecha, flechas < > laterales para navegar screenshots, navegación por teclado (arrow keys, Escape para cerrar)
UX-DR13: Componente ImageUploader — drag & drop zone, preview inmediato de imagen seleccionada, barra de progreso durante upload, 7 estados (empty, dragging-over, previewing, uploading con %, uploaded, replacing, error). Props: accept image/*, maxSize 5MB, multiple boolean. Accesible con teclado
UX-DR14: Componente BilingualField — par de inputs ES/EN lado a lado en desktop, tabs ES/EN en mobile. Labels con badge de idioma coloreado (ES azul, EN verde). Estados: default, focused-es, focused-en, error, disabled. Accesibilidad: labels únicos, aria-describedby, fieldset/legend
UX-DR15: Componente RichTextEditor — wrapper TipTap para Svelte 5, toolbar visible compacta (H1-H3, Bold, Code, Link, Imagen, Lista), inserción de imágenes con upload a Storage, estados: editing, previewing, saving
UX-DR16: Componente ProjectFilter — dropdown select "Filter by:" con opción "All Projects" como default, filtrado instantáneo por tecnología
UX-DR17: Componente AdminSidebar — 250px fijo desktop, drawer retráctil mobile, fondo surface, iconos + labels, sección activa con background primary/10%, items: Dashboard, Projects, Technologies, Experiences, Blog, Logout
UX-DR18: Componente ConfirmDialog — modal de confirmación destructiva, información de impacto ("Se eliminarán también N imágenes de Storage"), botones Cancelar + Eliminar (danger)
UX-DR19: Componente Toast — 4 variantes (success verde 4s auto-dismiss, error rojo persist, warning naranja 6s, info), stack vertical max 3 visibles, `aria-live="polite"` para screen readers
UX-DR20: Componente ContactForm — campos nombre, email, teléfono con country picker + código de país, mensaje textarea, dropdown "Choose how to contact" (WhatsApp/Email), botón "Send Message". Genera URL WhatsApp/mailto sin server-side
UX-DR21: Header sitio público — pinned top, logo ChrisBP (mascota con gorra + código `</>`) izquierda, menú horizontal 5 items: Home, Projects, Experience, Blog, Contact. Active state: underline gradiente. Mobile: hamburger → menú slide-down animado con logo + X close + items centrados
UX-DR22: Footer — título "Contact" centrado, 3 íconos sociales centrados (TikTok, GitHub, LinkedIn), copyright "©2024 Christopher Bobadilla". Sin link oculto de admin
UX-DR23: Banner gradiente "Welcome to my Portfolio" — barra horizontal full-width con gradiente #48A1CD → #108385, texto blanco centrado, visible en todas las páginas públicas
UX-DR24: Sección About Me — avatar/mascota ChrisBP circular grande centrado con borde gradiente, heading "I code and create content" con palabra "content" en gradiente CSS (`background-clip: text`), párrafo descripción centrado, dos CTAs: "Get in Touch" (primary) + "Download Resume" (secondary)
UX-DR25: Sección Knowledge Of — título "KNOWLEDGE OF" bold centrado, 4 tecnologías destacadas en fila horizontal (ícono/imagen + nombre debajo), layout compacto NO grid categorizado
UX-DR26: Sección Projects destacados — título "Projects" en gradiente, 3 cards con screenshots de dispositivos + nombre + descripción, botón "See All" centrado, grid desktop / stack mobile
UX-DR27: Sección Experience — título "EXPERIENCE" bold centrado, lista vertical de cards (NO timeline con línea visual), cada card: empresa bold izquierda + fecha derecha + badge teal "Flutter Developer" + bullets responsabilidades, separadores entre cards
UX-DR28: Página detalle proyecto `/projects/[slug]` — screenshots con ImageViewer, descripción completa, tecnologías con chips, links externos (website, source code). Feature nueva (no existía en Flutter)
UX-DR29: Blog listing page `/blog` — cards con metadata (título, fecha, tiempo de lectura), visualmente consistente con estilo de project cards del sitio actual
UX-DR30: Blog post page `/blog/[slug]` — tipografía Poppins, max-width 720px para lectura óptima, formato rico renderizado (headings, párrafos, listas, code blocks con fuente mono, imágenes embebidas, links), OpenGraph por artículo
UX-DR31: Admin Dashboard — secciones con contadores (Projects N, Technologies N, Experiences N, Blog N), acceso directo a cada sección CRUD
UX-DR32: Patrón CRUD consistente en admin — Las 4 secciones siguen: Lista (con thumbnail/ícono) → Crear/Editar (formulario con secciones agrupadas) → Eliminar (con ConfirmDialog) → Feedback (Toast) → Regreso a lista
UX-DR33: Image states en admin — 5 estados visuales con badges coloreados: sin imagen (área punteada), existente (badge azul "Subida"), nueva (badge verde "Nueva"), reemplazará (badge naranja "Reemplazará"), se eliminará (badge rojo "Se eliminará")
UX-DR34: Empty states en admin — ilustración sutil + mensaje + CTA accionable ("No hay proyectos aún. [Crear el primero →]")
UX-DR35: Loading states — skeleton loaders imitando estructura de contenido real (sitio público), skeleton rows 3-5 filas pulsantes (admin listas), spinner en botón al guardar con disable para prevenir doble-submit
UX-DR36: Error states — banner no-intrusivo para errores de red, toast con retry para errores de servidor, validación inline con scroll al primer error
UX-DR37: Accesibilidad estructural — HTML semántico (header, main, nav, article, section, footer, aside), jerarquía headings h1→h6 lógica, landmarks ARIA
UX-DR38: Navegación por teclado — skip link "Saltar al contenido" como primer elemento focusable, tab order lógico, Escape cierra modales/menú, Enter/Space activa elementos, arrow keys dentro de componentes, focus trap en modales
UX-DR39: Screen reader support — aria-label en botones icon-only, aria-live="polite" en toasts, aria-expanded en menú/sidebar, aria-current="page" en nav activa, alt text descriptivo en imágenes, role="img" con aria-label en íconos decorativos
UX-DR40: Formularios accesibles — labels asociados (nunca solo placeholder), aria-describedby para errores, aria-required para obligatorios, fieldset/legend para campos bilingües
UX-DR41: Focus indicators — outline visible 2px solid primary en todos elementos interactivos, visible en ambos temas
UX-DR42: Touch targets — mínimo 44x44px para todos elementos clickeables en mobile
UX-DR43: Reducción de movimiento — `prefers-reduced-motion: reduce` desactiva animaciones no esenciales
UX-DR44: Micro-interacciones — hover elevation sutil en cards, View Transitions API entre páginas, lazy loading nativo de imágenes, micro-interacciones en botones y links
UX-DR45: Responsive sitio público — Mobile (<450px): single-column, hamburger menu, cards full-width, tipografía escalada. Tablet (450-900px): 2 columnas cards, menú compacto. Desktop (>900px): 3 columnas cards, menú horizontal completo, max-width 1200px
UX-DR46: Responsive admin — Mobile: sidebar drawer retráctil, formularios full-width, campos bilingües en tabs. Tablet: sidebar colapsable icon-only. Desktop: sidebar expandida 250px + content fluido, campos bilingües lado a lado

### FR Coverage Map

| FR | Epic | Descripción |
|---|---|---|
| FR1 | Epic 2 | Home page con secciones |
| FR2 | Epic 2 | Catálogo proyectos con filtro |
| FR3 | Epic 2 | Detalle proyecto |
| FR4 | Epic 2 | Visor de imágenes |
| FR5 | Epic 2 | Experiencia laboral |
| FR6 | Epic 4 | Listado blog público |
| FR7 | Epic 4 | Artículo blog individual |
| FR8 | Epic 2 | Formulario contacto |
| FR9 | Epic 2 | Links redes sociales |
| FR10 | Epic 1 | Toggle idioma ES/EN |
| FR11 | Epic 1 | Toggle tema Dark/Light |
| FR12 | Epic 1 | Persistencia tema |
| FR13 | Epic 2 | Contenido en idioma seleccionado |
| FR14 | Epic 2+5 | hreflang foundation (Epic 2), audit SEO (Epic 5) |
| FR15 | Epic 3 | Ruta `/admin` |
| FR16 | Epic 3 | Login email/password |
| FR17 | Epic 3 | Logout |
| FR18 | Epic 3 | Protección rutas admin |
| FR19 | Epic 3 | Crear proyecto |
| FR20 | Epic 3 | Editar proyecto |
| FR21 | Epic 3 | Eliminar proyecto + assets |
| FR22 | Epic 3 | Lista proyectos admin |
| FR23 | Epic 3 | Crear tecnología |
| FR24 | Epic 3 | Editar tecnología |
| FR25 | Epic 3 | Eliminar tecnología + imagen |
| FR26 | Epic 3 | Lista tecnologías admin |
| FR27 | Epic 3 | Crear experiencia |
| FR28 | Epic 3 | Editar experiencia |
| FR29 | Epic 3 | Eliminar experiencia |
| FR30 | Epic 3 | Lista experiencias admin |
| FR31 | Epic 4 | Crear artículo blog con editor rico |
| FR32 | Epic 4 | Insertar imágenes en artículo |
| FR33 | Epic 4 | Editar artículo |
| FR34 | Epic 4 | Eliminar artículo + assets |
| FR35 | Epic 4 | Cambiar estado pub/borrador |
| FR36 | Epic 4 | Lista artículos admin |
| FR37 | Epic 4 | Solo publicados visibles en público |
| FR38 | Epic 3 | Upload imágenes en CRUD |
| FR39 | Epic 3 | Reemplazo imagen con limpieza auto |
| FR40 | Epic 3 | Eliminación cascada assets |
| FR41 | Epic 3 | Zero assets huérfanos |
| FR42 | Epic 5 | Meta tags por página |
| FR43 | Epic 4+5 | OpenGraph blog (Epic 4 base, Epic 5 audit) |
| FR44 | Epic 5 | Sitemap.xml |
| FR45 | Epic 5 | robots.txt |
| FR46 | Epic 5 | URLs limpias con slug |
| FR47 | Epic 5 | Repo clonable y ejecutable |
| FR48 | Epic 5 | Zero secrets en código |
| FR49 | Epic 5 | `.env.example` documentado |

## Epic List

### Epic 1: Fundación — Proyecto, Design System, Infraestructura de Calidad
Un desarrollador puede clonar el repo, ejecutar `pnpm dev` y ver un esqueleto funcional con design system, toggle de tema (dark/light), toggle de idioma (ES/EN), layouts base, header, footer y banner trabajando correctamente. La infraestructura de testing (Firebase Emulator Suite, Vitest, Playwright, factories de datos) y el pipeline CI/CD (GitHub Actions con lint + type-check + test + build) están operativos desde el primer día, garantizando que cada feature subsiguiente se desarrolla con tests integrados.
**FRs covered:** FR10, FR11, FR12
**NFRs addressed:** NFR20 (cobertura >80% — gate cross-cutting), NFR21 (E2E flujos críticos — gate cross-cutting), NFR22 (TypeScript strict), NFR23 (linting), NFR24 (CI build), NFR25 (Lighthouse CI gate)
**Testing integrado:** Infraestructura de testing completa (emuladores, factories, CI pipeline), unit tests de schemas Zod, configuración Lighthouse CI

### Epic 2: Sitio Público — La Experiencia de Sarah
Sarah puede navegar el portfolio completo — Home con About, Technologies, Projects, Experience — ver detalle de proyectos con screenshots, filtrar por tecnología, usar el formulario de contacto, y todo funciona responsivamente en español e inglés con datos reales.
**FRs covered:** FR1, FR2, FR3, FR4, FR5, FR8, FR9, FR13, FR14
**Testing integrado:** Unit tests de utilidades (formatDate, slugify, meta tags), E2E del journey de Sarah (Home → Projects → detalle), E2E de cambio idioma ES→EN, E2E responsive (mobile/tablet/desktop), Lighthouse CI para Home y Project detail

### Epic 3: Admin — Autenticación y Gestión de Contenido
Christopher puede autenticarse en `/admin`, ver un dashboard profesional, y gestionar completamente proyectos, tecnologías y experiencias con formularios bilingües, upload de imágenes con preview, reemplazo automático y eliminación con limpieza de Storage — todo sin dejar assets huérfanos.
**FRs covered:** FR15, FR16, FR17, FR18, FR19, FR20, FR21, FR22, FR23, FR24, FR25, FR26, FR27, FR28, FR29, FR30, FR38, FR39, FR40, FR41
**NFRs addressed:** NFR8 (auth protection), NFR10-11 (Security Rules), NFR12 (no mutaciones sin auth), NFR26-28 (Firebase stability)
**Testing integrado:** Integration tests de Firestore/Storage Security Rules (read público, write solo admin), unit tests de ImageService (upload/replace/delete), E2E del journey admin (login → CRUD proyecto con imágenes → verificar limpieza Storage), E2E de protección de rutas

### Epic 4: Blog — Sistema de Publicación de Contenido
Christopher puede crear artículos de blog con editor rico (títulos, código, imágenes, listas), definir slugs y estado (publicado/borrador), y los visitantes pueden ver el listado de artículos y leer cada uno con formato profesional. Las URLs son compartibles en LinkedIn con OpenGraph correcto.
**FRs covered:** FR6, FR7, FR31, FR32, FR33, FR34, FR35, FR36, FR37
**Testing integrado:** Unit tests de serialización TipTap (HTML sanitizado), unit tests de OpenGraph por artículo, E2E del journey blogger (crear post → publicar → verificar en /blog), E2E de draft no visible en público

### Epic 5: SEO, Accesibilidad y Open Source Readiness
El portfolio es descubrible por buscadores (meta tags, sitemap, structured data), carga ultra-rápido (LCP <1.5s), es accesible (WCAG 2.1 AA, keyboard nav, screen readers), y el repositorio está listo para compartir públicamente con documentación completa.
**FRs covered:** FR42, FR43, FR44, FR45, FR46, FR47, FR48, FR49
**NFRs addressed:** NFR1-7 (performance), NFR9+NFR13 (security audit), NFR14-19 (accessibility), NFR29 (hosting SSG estable)
**Testing integrado:** Unit tests de sitemap/robots.txt generation, unit tests de JSON-LD structured data, E2E de links sociales y filtro de proyectos, Lighthouse CI audit completo (4 categorías >95 para Home, Project detail, Blog post), auditoría de accesibilidad con axe-core en E2E, verificación bundle <50KB

## Epic 1: Fundación — Proyecto, Design System, Infraestructura de Calidad

Un desarrollador puede clonar el repo, ejecutar `pnpm dev` y ver un esqueleto funcional con design system, toggle de tema (dark/light), toggle de idioma (ES/EN), layouts base, header, footer y banner trabajando correctamente. La infraestructura de testing y CI/CD están operativos desde el primer día.

### Story 1.1: Inicialización del Proyecto y Tooling

As a developer,
I want to clone the repo and run `pnpm dev` with all tooling configured,
So that I have a working development environment ready for feature implementation.

**Acceptance Criteria:**

**Given** a fresh clone of the repository **When** I run `pnpm install && pnpm dev` **Then** the Astro 6 dev server starts without errors
**And** TypeScript strict mode is configured — `pnpm type-check` reports zero errors
**And** ESLint + Prettier are configured — `pnpm lint` reports zero warnings
**And** `firebase` and `firebase-admin` dependencies exist in `package.json`
**And** `.env.example` documents all required variables (PUBLIC_FIREBASE_*, FIREBASE_ADMIN_*)
**And** `.gitignore` excludes `.env`, `node_modules`, `dist/`, Firebase credentials
**And** project structure follows architecture: `src/pages/`, `src/components/` (by domain), `src/layouts/`, `src/lib/`, `src/styles/`
**And** `astro.config.mjs` configures `output: 'static'`, Svelte 5 integration, Tailwind CSS 4 integration

### Story 1.2: Infraestructura de Testing y CI/CD Pipeline

As a developer,
I want Firebase emulators, test frameworks, data factories and a CI pipeline operational,
So that every feature I build from this point forward can be developed with tests from day one.

**Acceptance Criteria:**

**Given** Firebase Emulator Suite is configured **When** I run `pnpm test:emulators` **Then** Auth, Firestore and Storage emulators start on dedicated ports without errors
**And** Vitest is configured — `pnpm test` executes with `getViteConfig()` from Astro and reports zero tests (no failures)
**And** Playwright is configured — `pnpm test:e2e` initializes against the dev server without errors
**And** test data factory module exists in `src/test/factories/` — `createProject()`, `createTechnology()`, `createExperience()`, `createBlogPost()` each returns a valid object passing its Zod schema
**And** GitHub Actions workflow runs on push to main: `pnpm install` → `pnpm lint` → `pnpm type-check` → `pnpm test` → `pnpm build`
**And** Lighthouse CI is configured in the pipeline as quality gate (>95 in 4 categories)
**And** Firebase emulators are cached in CI for faster execution
**And** `firebase.json` configures emulator ports for Auth, Firestore, Storage
**And** README documents how to run emulators and tests locally

### Story 1.3: Zod Schemas y Modelos de Datos

As a developer,
I want type-safe data models validated by Zod schemas,
So that all data flowing through the app is validated consistently at build time and runtime.

**Acceptance Criteria:**

**Given** shared schemas exist **When** I import `localizedString`, `storedImageSchema`, `localeSchema` **Then** they validate correctly with TypeScript autocompletion
**And** `projectSchema` validates: companyName, shortDescription, features as Localized, mainImage/screenshots as StoredImage[], slug, technologies, urls optional
**And** `technologySchema` validates: name, image as StoredImage, experienceYears as number
**And** `experienceSchema` validates: companyName, jobName as Localized, responsibilities as Localized<string[]>, startDate, endDate nullable
**And** `blogPostSchema` validates: title/content as Localized, slug, coverImage, images array, status 'published'|'draft', createdAt, updatedAt
**And** TypeScript types derived via `z.infer<>` (Project, Technology, Experience, BlogPost, StoredImage, Locale)
**And** schemas live in `src/lib/schemas/` with kebab-case naming

### Story 1.4: Design Tokens y Sistema de Temas

As a visitor,
I want a visually consistent site with professional dark and light themes,
So that the portfolio looks polished and my theme preference is respected.

**Acceptance Criteria:**

**Given** Tailwind CSS 4 config with `@theme` in `src/styles/global.css` **When** I inspect CSS custom properties **Then** all semantic color tokens exist (primary, primary-dark, background, surface, surface-elevated, text-primary/secondary/muted, border, success, warning, error) with correct values for both themes
**And** brand gradient renders `linear-gradient(135deg, #48A1CD, #108385)`
**And** 8 typography tokens exist (display through code) with Poppins, correct clamp() sizes, weights 400-700, line-heights 1.1-1.6
**And** Poppins loaded from Google Fonts with `font-display: swap` and preload
**And** JetBrains Mono configured for code blocks
**And** spacing tokens space-1 through space-24 match 4px base scale (4, 8, 12, 16, 24, 32, 48, 64, 96)
**And** breakpoints: `sm:` = ≥450px, `lg:` = ≥900px, `xl:` = ≥1200px
**And** dark mode is default theme
**And** text/background contrast meets WCAG AA (>4.5:1 normal, >3:1 large)

### Story 1.5: Componentes UI Base

As a developer,
I want a set of reusable UI components following the design system,
So that all features are built with visual consistency from the start.

**Acceptance Criteria:**

**Given** Container component **When** used with default props **Then** centered max-width 1200px with responsive padding (16/24/32px) **And** narrow variant sets 720px
**And** Section component applies consistent vertical spacing (48px mobile, 96px desktop) with hero and compact variants
**And** Button component renders 4 variants: primary (gradient), secondary (outline), danger (error bg), ghost (no bg) — all min 44x44px touch target
**And** Card component shows surface background with border, hover elevation available
**And** Badge component renders 3 variants: technology (gradient border), status (green published / orange draft), language (blue ES / green EN)
**And** Input component has visible label, text/textarea/select/file variants, validation error below field on blur, required fields with asterisk
**And** all components have 2px solid primary focus indicators in both themes
**And** components use Astro (.astro) format — zero JS to browser

### Story 1.6: Layouts, Header, Footer y Banner

As a visitor,
I want professional navigation with consistent header, footer and brand banner,
So that I can navigate the portfolio intuitively on any device.

**Acceptance Criteria:**

**Given** BaseLayout **When** a public page uses it **Then** renders Banner + Header + `<main>` + Footer with semantic HTML (`<header>`, `<main>`, `<footer>`)
**And** AdminLayout renders sidebar placeholder + content area with `<aside>` and `<main>` landmarks
**And** Header on desktop shows logo ChrisBP left, 5 nav items right (Home, Projects, Experience, Blog, Contact), active item gradient underline, pinned top
**And** Header on mobile: hamburger → slide-down animated menu with logo + X close + centered items, Escape closes it
**And** Footer shows "Contact" centered, 3 social icons (TikTok, GitHub, LinkedIn), copyright
**And** Banner renders full-width gradient (#48A1CD → #108385) with "Welcome to my Portfolio" centered white on all public pages
**And** skip nav link "Saltar al contenido" visible on Tab, jumps to `<main>` on Enter
**And** responsive across 3 breakpoints
**And** `aria-current="page"` on active nav, `aria-expanded` + `aria-label` on hamburger
**(UX-DR21, UX-DR22, UX-DR23, UX-DR37, UX-DR38)**

### Story 1.7: i18n Foundation y LocaleToggle

As a visitor,
I want to switch the site language between Spanish and English,
So that I can read content in my preferred language.

**Acceptance Criteria:**

**Given** Astro i18n configured **When** I navigate to `/` **Then** Spanish (default) **And** `/en/` shows English
**And** static translations dictionary provides both ES and EN for UI strings (nav labels, buttons, section titles)
**And** LocaleToggle FAB renders floating bottom-right with active locale flag (Spain for ES, USA for EN)
**And** on Spanish page, clicking LocaleToggle navigates to English equivalent without full reload, flag changes
**And** locale routing works: `/en/projects` renders in English with correct URL
**And** Svelte 5 island with `client:load`
**And** `aria-label` ("Cambiar a inglés" / "Switch to Spanish")
**(FR10 fulfilled)**

### Story 1.8: ThemeToggle y Persistencia de Tema

As a visitor,
I want to toggle between dark and light themes with my preference remembered,
So that I can browse in my preferred visual mode across sessions.

**Acceptance Criteria:**

**Given** first visit **When** page loads **Then** dark theme active (default)
**And** ThemeToggle FAB renders bottom-right with sun icon (dark mode) / moon icon (light mode)
**And** clicking ThemeToggle in dark mode transitions smoothly to light, all color tokens update
**And** switching to light mode persists in localStorage — reopening browser keeps light mode
**And** user with `prefers-color-scheme: light` on first visit (no stored pref) gets light mode
**And** with `prefers-reduced-motion: reduce`, theme toggle completes without animation
**And** Svelte 5 island with `client:load`
**And** `aria-label` ("Cambiar a modo claro" / "Switch to light mode")
**(FR11, FR12 fulfilled)**

### Story 1.9: Firebase Client & Admin SDK Configuration

As a developer,
I want Firebase SDKs properly initialized and typed,
So that admin features can use the client SDK and build scripts can query Firestore via Admin SDK.

**Acceptance Criteria:**

**Given** `src/lib/firebase/client.ts` **When** imported in a Svelte island **Then** Firebase app initializes with `PUBLIC_FIREBASE_*` env vars and exports `auth`, `db`, `storage` instances
**And** `src/lib/firebase/admin.ts` imported in build script initializes Admin SDK with `FIREBASE_*` env vars, exports admin `db` and `storage`
**And** `src/lib/firebase/collections.ts` provides typed collection helpers for Projects, Technologies, Experiences, BlogPosts with correct Firestore paths
**And** missing or incomplete `.env` produces clear error indicating which variables are missing
**And** client SDK config uses `PUBLIC_` prefix variables (safe for browser)
**And** Admin SDK credentials never reach the browser (only build/CI context)
**And** both SDKs connect to Firebase Emulators when `USE_EMULATORS=true` is set

## Epic 2: Sitio Público — La Experiencia de Sarah

Sarah puede navegar el portfolio completo — Home con About, Technologies, Projects, Experience — ver detalle de proyectos con screenshots, filtrar por tecnología, usar el formulario de contacto, y todo funciona responsivamente en español e inglés con datos reales.

### Story 2.1: Data Migration Script

As a developer,
I want to migrate existing Firestore data from Flutter schema to the professional nested schema,
So that the public site can render real portfolio data from day one.

**Acceptance Criteria:**

**Given** the migration script in `src/lib/scripts/migrate-firestore-data.ts` **When** executed against Firestore **Then** it transforms all documents: `companyNameEs/En` → `companyName: { es, en }`, `featuresES/EN` → `features: { es, en }`, `responsabilitiesEs/En` → `responsibilities: { es: [...], en: [...] }`, `ImageAndPath` → `StoredImage`, `date` strings → Timestamps, `experienceTime` strings → `experienceYears` numbers
**And** Storage files are NOT renamed — only Firestore field names change (`refPath` → `storagePath`)
**And** a document already in new schema is skipped (idempotent)
**And** after migration, each document passes its corresponding Zod schema validation
**And** backup command `firebase firestore:export` documented as pre-migration step
**And** script runs via `npx ts-node src/lib/scripts/migrate-firestore-data.ts`

### Story 2.2: Home Page — About Me y Knowledge Of

As a visitor (Sarah),
I want to see Christopher's professional identity and technical skills immediately,
So that I can form a positive first impression within 3 seconds.

**Acceptance Criteria:**

**Given** I visit `/` **When** the page loads **Then** About Me section shows: avatar/mascota ChrisBP circular with gradient border, heading "I code and create content" with "content" in CSS gradient (`background-clip: text`), description paragraph centered, two CTAs: "Get in Touch" (primary) + "Download Resume" (secondary)
**And** Knowledge Of section shows: title "KNOWLEDGE OF" bold centered, 4 technologies in horizontal row (icon/image + name), compact layout NOT categorized grid
**And** technologies display real data from Firestore Technologies collection via Admin SDK at build time
**And** content displays in the selected locale (`field[locale]`)
**And** responsive: single column mobile, centered desktop
**(FR1 partial, FR13 partial, UX-DR24, UX-DR25)**

### Story 2.3: Home Page — Projects Destacados y Experience

As a visitor (Sarah),
I want to see highlighted projects and work experience on the home page,
So that I can quickly evaluate Christopher's professional background.

**Acceptance Criteria:**

**Given** Projects section **When** rendered **Then** title "Projects" in gradient, 3 project cards with screenshots + name + description, "See All" button centered. Grid desktop / stack mobile
**And** Experience section shows title "EXPERIENCE" bold centered, vertical list of cards (NOT timeline with visual line), each card: company bold left + date range right + teal badge job title + bullet responsibilities, separators between cards
**And** projects and experiences show real Firestore data in selected locale
**And** project cards link to `/projects/[slug]`
**And** experience dates formatted with `Intl.DateTimeFormat` respecting locale
**(FR1 partial, FR5, FR13 partial, UX-DR26, UX-DR27)**

### Story 2.4: Projects Listing y Filtro por Tecnología

As a visitor (Sarah),
I want to browse all projects and filter by technology,
So that I can find relevant work samples quickly.

**Acceptance Criteria:**

**Given** I navigate to `/projects` **When** page loads **Then** introductory text, filter dropdown "Filter by:" with "All Projects" default, project cards in grid (2 cols desktop, 1 col mobile)
**And** selecting a technology in ProjectFilter instantly shows only projects using that technology
**And** "All Projects" selected shows all projects
**And** each project card shows name, description, technology chips, screenshots thumbnail, link to detail
**And** ProjectFilter is a Svelte 5 island with `client:load`
**And** content in selected locale
**And** `/en/projects` shows English version
**(FR2, FR13 partial, UX-DR16)**

### Story 2.5: Project Detail Page

As a visitor (Sarah),
I want to see full details of a project with screenshots, technologies and links,
So that I can deeply evaluate Christopher's work quality.

**Acceptance Criteria:**

**Given** I navigate to `/projects/[slug]` **When** page loads **Then** full project: name, complete description, features list, technology chips, main image, screenshots gallery, external links (website, source code)
**And** clicking a screenshot opens ImageViewer (Story 2.6)
**And** `websiteUrl` or `sourceCodeUrl` display with appropriate labels when present
**And** `/en/projects/[slug]` shows English version
**And** page generated at build time via `getStaticPaths()` from Firestore data
**(FR3, FR46 partial, UX-DR28)**

### Story 2.6: Image Viewer

As a visitor,
I want to view project screenshots in a fullscreen viewer with navigation,
So that I can see the details of Christopher's work clearly.

**Acceptance Criteria:**

**Given** I click a screenshot **When** ImageViewer opens **Then** overlay fullscreen with dark semi-transparent background, image centered and scaled, "X Close" top-right, arrows < > on sides
**And** clicking > arrow shows next image, < shows previous
**And** pressing Escape closes the viewer
**And** arrow keys navigate between images
**And** Svelte 5 island with `client:visible`
**And** focus trapped inside viewer while open
**And** `aria-label` on close button and navigation arrows
**(FR4)**

### Story 2.7: Contact Page

As a visitor,
I want to send a message to Christopher choosing my preferred channel,
So that I can reach out about opportunities.

**Acceptance Criteria:**

**Given** I navigate to `/contact` **When** page loads **Then** title "Contact", description, form on elevated surface card: name, email, phone (with country picker + country code), message textarea, "Choose how to contact" dropdown (WhatsApp/Email), "Send Message" button
**And** selecting WhatsApp and clicking "Send Message" opens WhatsApp URL with pre-filled message
**And** selecting Email opens mailto link with subject and body pre-filled
**And** required fields empty on submit shows inline validation errors below each invalid field
**And** ContactForm is a Svelte 5 island with `client:load`
**And** `/en/contact` shows English version
**And** social links (TikTok, GitHub, LinkedIn) in footer navigate to correct profiles
**(FR8, FR9, UX-DR20)**

### Story 2.8: Responsive Polish y Contenido Bilingüe Completo

As a visitor,
I want the entire public site to work flawlessly on any device in both languages,
So that my experience is professional regardless of how I access the portfolio.

**Acceptance Criteria:**

**Given** all public pages **When** viewed on mobile (<450px) **Then** single-column layout, hamburger menu, full-width cards, scaled typography
**And** tablet (450-900px) shows 2-column project grids, compact menu or hamburger
**And** desktop (>900px) shows 3-column grids, full horizontal menu, max-width 1200px
**And** switching locale via LocaleToggle changes ALL content: nav labels, section titles, project names, descriptions, experience details, button texts
**And** each public page includes `<link rel="alternate" hreflang="es">` and `<link rel="alternate" hreflang="en">`
**And** images use `loading="lazy"` for below-the-fold content
**And** View Transitions API enabled for smooth page navigation
**(FR13, FR14, UX-DR44, UX-DR45)**

## Epic 3: Admin — Autenticación y Gestión de Contenido

Christopher puede autenticarse en `/admin`, ver un dashboard profesional, y gestionar completamente proyectos, tecnologías y experiencias con formularios bilingües, upload de imágenes con preview, reemplazo automático y eliminación con limpieza de Storage — todo sin dejar assets huérfanos.

### Story 3.1: Autenticación y Protección de Rutas

As Christopher (admin),
I want to log in securely and have all admin routes protected,
So that only I can access the administration panel.

**Acceptance Criteria:**

**Given** I navigate to `/admin` without auth **When** page loads **Then** redirected to `/admin/login`
**And** valid email/password authenticates via Firebase Auth and redirects to `/admin` dashboard
**And** invalid credentials show user-friendly error ("Contraseña incorrecta" / "Wrong password") — no stack traces
**And** clicking Logout clears session and redirects to `/admin/login`
**And** any `/admin/*` route without auth redirects to login
**And** auth state persists between page reloads (Firebase Auth persistence)
**And** Firestore Security Rules: `allow read: if true; allow write: if request.auth.uid == 'ADMIN_UID'`
**And** Storage Security Rules: `allow read: if true; allow write: if request.auth.uid == 'ADMIN_UID'`
**(FR15, FR16, FR17, FR18, NFR8, NFR10, NFR11)**

### Story 3.2: Admin Dashboard y Sidebar Navigation

As Christopher (admin),
I want a clear dashboard and navigation sidebar,
So that I can see content overview and navigate to any section intuitively after months without using the admin.

**Acceptance Criteria:**

**Given** I am authenticated and on `/admin` **When** page loads **Then** dashboard shows section cards with counters: Projects (N), Technologies (N), Experiences (N), Blog (N)
**And** AdminSidebar on desktop: 250px fixed left, surface background, items with icons + labels (Dashboard, Projects, Technologies, Experiences, Blog, Logout), active section highlighted with primary/10% background
**And** mobile: sidebar is retractable drawer with toggle button
**And** tablet: sidebar collapses to icon-only, expands on hover/click
**And** clicking section card or sidebar item navigates to corresponding CRUD page
**And** breadcrumb in content area header (Admin > Projects > Edit "Name")
**(UX-DR17, UX-DR31, UX-DR46)**

### Story 3.3: ImageService — Upload, Replace y Delete

As Christopher (admin),
I want a centralized image management service that handles uploads, replacements and deletions,
So that Storage never has orphaned files regardless of what I do.

**Acceptance Criteria:**

**Given** `ImageService.upload(file, path)` **When** called **Then** uploads to Firebase Storage, returns `StoredImage { url, storagePath }`
**And** `ImageService.replace(oldImage, newFile, newPath)` uploads new first, then deletes old (safe-first order: upload new → update Firestore → delete old)
**And** `ImageService.delete(image)` removes file from Storage at `image.storagePath`
**And** `ImageService.deleteByPrefix(pathPrefix)` deletes all files under that prefix (cascade delete)
**And** `ImageSlot` discriminated union handles 5 states on form submission: `empty` (no-op), `existing` (no-op), `new` (upload), `replaced` (upload new + mark old for delete), `removed` (mark for delete)
**And** all Storage operations have retry on network error
**And** ImageService lives in `src/lib/firebase/image-service.ts`
**(FR38, FR39, FR40, FR41, NFR28)**

### Story 3.4: CRUD Projects — List y Create

As Christopher (admin),
I want to see all my projects and create new ones with bilingual fields and images,
So that I can add new work to my portfolio.

**Acceptance Criteria:**

**Given** admin Projects page **When** loaded **Then** list shows all projects with thumbnail, name (current locale), action buttons (edit, delete)
**And** empty list shows empty state: illustration + "No hay proyectos aún. [Crear el primero →]"
**And** "Crear nuevo" opens form with sections: Información Básica (BilingualField for name, description, features), Imágenes (main image uploader + screenshots multi-uploader), Metadata (technology selector, URLs optional, slug auto-generated from title)
**And** BilingualField on desktop: ES/EN side by side with colored badges (ES blue, EN green). Mobile: tabs
**And** filling required fields + uploading images + clicking "Guardar" saves to Firestore, uploads images via ImageService, shows toast "Proyecto guardado exitosamente", returns to list
**And** slug auto-generated from ES title, editable manually
**And** validation inline on blur, required fields with asterisk
**(FR19, FR22, UX-DR14, UX-DR32, UX-DR34)**

### Story 3.5: CRUD Projects — Edit y Delete

As Christopher (admin),
I want to edit existing projects and delete them with full asset cleanup,
So that my portfolio stays current and Storage stays clean.

**Acceptance Criteria:**

**Given** I click edit on a project **When** form opens **Then** all fields pre-populated, images show as `existing` ImageSlot (blue "Subida" badge)
**And** replacing a screenshot shows orange "Reemplazará" badge. On save: new uploaded, Firestore updated, old deleted from Storage
**And** removing a screenshot shows red "Se eliminará" badge. On save: removed from array, deleted from Storage
**And** clicking delete shows ConfirmDialog: "¿Eliminar '[name]'? Se eliminarán también N imágenes de Storage." with Cancel + Delete (danger)
**And** confirming delete: all images deleted via `deleteByPrefix`, document deleted, toast confirmation, returns to list
**And** zero orphaned assets after any edit or delete operation
**(FR20, FR21, UX-DR13, UX-DR18, UX-DR33)**

### Story 3.6: CRUD Technologies

As Christopher (admin),
I want to manage my technology skills with icons,
So that visitors see an accurate representation of my technical expertise.

**Acceptance Criteria:**

**Given** admin Technologies page **When** loaded **Then** list shows all technologies with icon, name, experience years, action buttons
**And** empty list shows empty state with CTA "Crear la primera"
**And** create form: name (text), image (ImageUploader), experienceYears (number)
**And** saving stores to Firestore, uploads image, toast confirmation
**And** editing pre-populates form, image shows existing state
**And** deleting via ConfirmDialog removes technology + image from Storage, toast confirmation
**(FR23, FR24, FR25, FR26)**

### Story 3.7: CRUD Experiences

As Christopher (admin),
I want to manage my work experiences with bilingual details,
So that my professional history stays current.

**Acceptance Criteria:**

**Given** admin Experiences page **When** loaded **Then** list shows all experiences with company name, date range, job title, action buttons
**And** empty list shows empty state with CTA
**And** create form: companyName (text), jobName (BilingualField), responsibilities (BilingualField with array — add/remove items), startDate (date picker), endDate (date picker, nullable — checkbox "Actualmente trabajando")
**And** saving stores with Timestamps, toast confirmation
**And** editing pre-populates with current data
**And** deleting via ConfirmDialog removes experience, toast confirmation
**And** no images involved — simplest CRUD entity
**(FR27, FR28, FR29, FR30)**

### Story 3.8: Admin Feedback Systems — Toast, Loading, Error States

As Christopher (admin),
I want clear visual feedback for every action I take,
So that I always know the status of my operations and never feel uncertain.

**Acceptance Criteria:**

**Given** successful save **When** completed **Then** Toast: green checkmark, "Proyecto guardado exitosamente", auto-dismiss 4s
**And** failed operation shows Toast: red, user-friendly error (mapped from Firebase codes to ES/EN), persists until dismissed, retry if applicable
**And** image uploading shows progress bar with percentage inside ImageUploader
**And** list loading shows skeleton rows (3-5 pulsing gray rows)
**And** form submitting shows spinner + "Guardando..." on button, disabled (prevents double-submit)
**And** multiple toasts stack vertically, max 3 visible
**And** toasts use `aria-live="polite"` for screen reader announcement
**And** error messages mapped via `src/lib/utils/error-messages.ts`
**(UX-DR19, UX-DR35, UX-DR36)**

## Epic 4: Blog — Sistema de Publicación de Contenido

Christopher puede crear artículos de blog con editor rico (títulos, código, imágenes, listas), definir slugs y estado (publicado/borrador), y los visitantes pueden ver el listado de artículos y leer cada uno con formato profesional. Las URLs son compartibles en LinkedIn con OpenGraph correcto.

### Story 4.1: Blog CRUD — List, Create y Editor Rico

As Christopher (admin),
I want to create blog posts with a rich text editor, custom slugs and cover images,
So that I can publish technical articles about my work.

**Acceptance Criteria:**

**Given** admin Blog page **When** loaded **Then** list shows all articles (published and drafts) with title, status badge (green "Publicado" / orange "Borrador"), date, action buttons
**And** empty list shows empty state: "No hay artículos de blog. [Escribir el primero →]"
**And** "Crear nuevo" opens form: title (BilingualField), slug (auto-generated from ES title, editable), cover image (ImageUploader), status toggle (draft default / published), content editor (RichTextEditor)
**And** RichTextEditor (TipTap) has compact toolbar: H1-H3, Bold, Code block, Link, Image insert, List (ordered/unordered)
**And** saving stores to Firestore with `createdAt` timestamp, uploads cover image + embedded images via ImageService, toast confirmation
**And** slug is validated as URL-friendly (lowercase, hyphens, no spaces or special chars)
**(FR31, FR36, UX-DR15)**

### Story 4.2: Blog — Image Insertion in Content

As Christopher (admin),
I want to insert images directly into blog article content,
So that my technical articles include screenshots, diagrams and visual explanations.

**Acceptance Criteria:**

**Given** the RichTextEditor **When** I click the image button in toolbar **Then** an ImageUploader dialog opens
**And** after selecting/dropping an image, it uploads to Storage under `blog/{postId}/images/{uuid}.webp` via ImageService
**And** the uploaded image appears inline in the editor content at cursor position
**And** the image `StoredImage` reference is added to the BlogPost `images[]` array for lifecycle tracking
**And** images embedded in content render correctly in the editor preview
**(FR32)**

### Story 4.3: Blog CRUD — Edit, Delete y Status Toggle

As Christopher (admin),
I want to edit articles, toggle their publish status, and delete them with asset cleanup,
So that I have full control over my blog content lifecycle.

**Acceptance Criteria:**

**Given** I click edit on an article **When** form opens **Then** all fields pre-populated including rich text content in the TipTap editor
**And** I can change status between published and draft with a toggle — saving reflects immediately
**And** clicking delete shows ConfirmDialog: "¿Eliminar '[title]'? Se eliminarán la portada y N imágenes embebidas de Storage."
**And** confirming delete: cover image + all embedded images deleted from Storage via `deleteByPrefix('blog/{postId}/')`, document deleted, toast, returns to list
**And** replacing cover image follows ImageSlot replace flow (upload new, delete old)
**(FR33, FR34, FR35)**

### Story 4.4: Blog Public — Listing Page

As a visitor,
I want to see a list of published blog articles,
So that I can discover Christopher's technical writing.

**Acceptance Criteria:**

**Given** I navigate to `/blog` **When** page loads **Then** list of published articles as cards: title, date, estimated reading time, cover image thumbnail
**And** only articles with `status: 'published'` are visible — drafts are NOT shown
**And** cards are visually consistent with project cards style (same Card component, blog variant)
**And** clicking a card navigates to `/blog/[slug]`
**And** `/en/blog` shows English version with English titles
**And** page generated at build time from Firestore BlogPosts collection (only published)
**(FR6, FR37, UX-DR29)**

### Story 4.5: Blog Public — Article Page y OpenGraph

As a visitor,
I want to read a blog article with professional formatting and share it on LinkedIn,
So that I can evaluate Christopher's technical depth and share it with others.

**Acceptance Criteria:**

**Given** I navigate to `/blog/[slug]` **When** page loads **Then** article renders with: title, date, reading time, cover image, rich content (headings, paragraphs, lists, code blocks with monospace font, embedded images, links)
**And** content area max-width 720px for optimal reading
**And** code blocks use JetBrains Mono font with syntax-appropriate styling
**And** OpenGraph meta tags generated per article: `og:title`, `og:description`, `og:image` (cover image URL), `og:type: article`
**And** Twitter Card meta tags included
**And** pasting URL in LinkedIn shows professional preview with title, description and cover image
**And** `/en/blog/[slug]` shows English version
**And** page generated at build time via `getStaticPaths()`
**(FR7, FR43, FR46 partial, UX-DR30)**

## Epic 5: SEO, Accesibilidad y Open Source Readiness

El portfolio es descubrible por buscadores (meta tags, sitemap, structured data), carga ultra-rápido (LCP <1.5s), es accesible (WCAG 2.1 AA, keyboard nav, screen readers), y el repositorio está listo para compartir públicamente con documentación completa.

### Story 5.1: Meta Tags y OpenGraph por Página

As a visitor sharing the portfolio link,
I want each page to have proper meta tags and OpenGraph data,
So that links look professional when shared on LinkedIn and social media.

**Acceptance Criteria:**

**Given** any public page **When** rendered **Then** `<head>` includes: `<title>`, `<meta name="description">`, `og:title`, `og:description`, `og:image`, `og:url`, `og:type`, `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`
**And** Home page has portfolio-level OG (Christopher's name, role, portfolio description)
**And** Project detail pages have project-specific OG (project name, description, main image)
**And** Blog posts have article-specific OG (title, excerpt, cover image)
**And** meta descriptions are unique per page, not generic
**And** OG images have appropriate dimensions for social media preview
**(FR42, FR43)**

### Story 5.2: Sitemap, Robots.txt y Structured Data

As a search engine crawler,
I want properly structured sitemap, robots.txt and JSON-LD data,
So that the portfolio is correctly indexed and shows rich results.

**Acceptance Criteria:**

**Given** `@astrojs/sitemap` is configured **When** site builds **Then** `sitemap.xml` is generated with all public pages (Home, Projects listing, each project detail, Blog listing, each blog post, Contact) in both locales
**And** `robots.txt` allows indexation of all public pages and blocks `/admin/*`
**And** JSON-LD structured data on Home: `Person` schema (name, role, URL, social links)
**And** JSON-LD on project detail: `CreativeWork` or `SoftwareApplication` with name, description, technologies
**And** JSON-LD on blog posts: `BlogPosting` with title, date, author, description
**And** all structured data validates against Google's Rich Results Test
**(FR44, FR45)**

### Story 5.3: URLs Limpias y Slug System

As a visitor and search engine,
I want clean, readable URLs for all content,
So that URLs are meaningful, shareable and SEO-friendly.

**Acceptance Criteria:**

**Given** a project with slug "mi-portfolio" **When** URL is generated **Then** it's `/projects/mi-portfolio` (ES) and `/en/projects/mi-portfolio` (EN)
**And** a blog post with slug "construyendo-con-bmad" generates `/blog/construyendo-con-bmad`
**And** slugs are URL-friendly: lowercase, hyphens, no spaces, no special characters, no IDs or hashes
**And** duplicate slugs are prevented (validation at save time)
**And** slugify utility in `src/lib/utils/` generates slugs from titles consistently
**(FR46)**

### Story 5.4: Performance Optimization y Bundle Audit

As a visitor (Sarah),
I want the portfolio to load instantly,
So that my first impression is speed and technical competence.

**Acceptance Criteria:**

**Given** the production build **When** Lighthouse runs on Home page **Then** Performance score > 95
**And** LCP < 1.5s on simulated 4G connection
**And** INP < 100ms
**And** CLS < 0.05
**And** total JavaScript bundle < 50KB (verified in build output)
**And** all below-the-fold images use `loading="lazy"`
**And** Astro `<Image />` used for local assets (WebP/AVIF optimization)
**And** Firebase Storage images use `<img loading="lazy">` with explicit width/height to prevent CLS
**And** Poppins font loaded with `font-display: swap` and preload (no FOIT)
**(NFR1, NFR2, NFR3, NFR4, NFR5, NFR6)**

### Story 5.5: Accessibility Audit y Compliance

As a visitor using assistive technology,
I want the portfolio to be fully accessible,
So that I can navigate and consume all content regardless of my abilities.

**Acceptance Criteria:**

**Given** Lighthouse runs on any public page **When** auditing accessibility **Then** score > 95
**And** axe-core scan finds zero critical or serious violations
**And** all interactive elements are reachable via keyboard (Tab/Enter/Escape/Arrow keys)
**And** skip nav "Saltar al contenido" works as first focusable element
**And** all images have descriptive `alt` text
**And** focus indicators (2px solid primary) visible on all interactive elements in both themes
**And** color is never the sole means of conveying information (icons or text accompany color)
**And** `prefers-reduced-motion: reduce` disables non-essential animations
**And** heading hierarchy (h1→h6) is logical on every page
**And** all form inputs have associated `<label>` elements
**(NFR14, NFR15, NFR16, NFR17, NFR18, NFR19, UX-DR37, UX-DR38, UX-DR39, UX-DR40, UX-DR41, UX-DR42, UX-DR43)**

### Story 5.6: Open Source Readiness y Documentación

As Diego (developer cloning the repo),
I want complete documentation and a clean repo,
So that I can set up my own portfolio following only the README.

**Acceptance Criteria:**

**Given** README.md **When** read **Then** includes: project description, tech stack, prerequisites (Node 22+, pnpm, Firebase project), setup steps (clone → install → configure .env → run emulators → run dev), deployment instructions, testing instructions (`pnpm test`, `pnpm test:e2e`), architecture overview, license
**And** `.env.example` documents every variable with descriptions and example values
**And** `git log` shows no committed `.env`, credentials, API keys or service accounts
**And** running `pnpm install && pnpm dev` with emulators works on a fresh clone with only `.env` configured
**And** sample/seed data script exists or is documented for first-time setup
**And** repo includes LICENSE file
**(FR47, FR48, FR49, NFR9, NFR13)**
