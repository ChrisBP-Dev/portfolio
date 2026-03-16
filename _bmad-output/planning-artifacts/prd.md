---
stepsCompleted: ['step-01-init', 'step-02-discovery', 'step-02b-vision', 'step-02c-executive-summary', 'step-03-success', 'step-04-journeys', 'step-05-domain-skipped', 'step-06-innovation-skipped', 'step-07-project-type', 'step-08-scoping', 'step-09-functional', 'step-10-nonfunctional', 'step-11-polish', 'step-12-complete']
status: complete
completedAt: '2026-03-15'
inputDocuments:
  - '_bmad-output/planning-artifacts/product-brief-portfolio-2026-03-15.md'
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
documentCounts:
  briefs: 1
  research: 1
  brainstorming: 0
  projectDocs: 8
  projectContext: 1
classification:
  projectType: 'web_app'
  domain: 'general'
  complexity: 'low'
  projectContext: 'brownfield'
workflowType: 'prd'
---

# Product Requirements Document - portfolio

**Author:** Christopher
**Date:** 2026-03-15

## Executive Summary

Portfolio ChrisBP es la migración de un portfolio profesional desde Flutter Web hacia Astro 5 + TypeScript + Tailwind CSS + Svelte 5 + Firebase. El proyecto actual funciona visualmente pero tiene limitaciones fundamentales: Flutter Web renderiza en canvas impidiendo SEO, el panel de administración tiene acceso oculto e inconsistencias en gestión de imágenes, y los datos profesionales están desactualizados.

La migración no es un cambio de framework — es una reconstrucción profesional donde el portfolio funciona como prueba viva de competencia técnica. Cada decisión arquitectónica, cada patrón implementado y cada línea de código demuestra que Christopher domina lo que dice saber. Cuando un líder técnico revisa el repositorio, encuentra código profesional con principios SOLID, arquitectura limpia, tests completos y cero compromisos en calidad.

El alcance incluye: sitio público con SEO nativo y HTML semántico, panel de administración con rutas protegidas y gestión robusta de assets, **sección de blog con CRUD desde el admin** (primer artículo: cómo el sitio fue construido con BMAD + IA), y repositorio open source listo para ser clonado. El stack objetivo reduce el JavaScript enviado al navegador en un 95% respecto a Flutter Web.

### What Makes This Special

1. **El portfolio es el proyecto y la prueba simultáneamente.** No es una vitrina genérica — es un sistema completo (sitio público + admin + blog + Firebase) construido con calidad profesional verificable en el código fuente. "Si quieres saber cómo trabajo, revisa cómo construí esta página."

2. **Limpio, no básico. Completo, no recargado.** Diseño visual equilibrado que evita los dos extremos que frustran: portfolios minimalistas vacíos y portfolios sobrecargados sin orden. La misma filosofía se aplica al código — organizado, legible, con propósito.

3. **Proceso documentado con BMAD + IA.** La migración completa sigue una metodología estructurada y reproducible, documentada en un blog integrado. No es un tutorial — es un caso de estudio real de migración en producción.

4. **Blog técnico integrado con admin.** Sistema de contenido completo gestionable desde el panel de administración, demostrando capacidad de construir features de contenido dinámico y aportando SEO orgánico a largo plazo.

### Visual Design Fidelity

**Sitio público:** El diseño visual del portfolio Flutter Web actual funciona bien y debe conservarse en la migración. La estructura de secciones, la composición de componentes, la disposición de elementos y la estética general del sitio público deben replicarse fielmente en Astro. Se permiten mejoras en animaciones, transiciones y micro-interacciones aprovechando capacidades nativas de HTML/CSS/JS, pero no se debe cambiar el "look & feel" del sitio que los visitantes ven. La especificación UX contiene una sección "Referencia Visual del Sitio Público Actual" con screenshots y descripciones detalladas que sirven como fuente de verdad visual.

**Panel de administración:** Se rediseña completamente. El admin actual tiene un drawer oculto con acceso secreto y UX inconsistente. El nuevo admin usa sidebar explícita con navegación clara, formularios organizados y feedback visual profesional.

**Blog:** Feature nueva que no existe en el sitio actual. Se diseña desde cero pero visualmente consistente con la estética del sitio público existente (mismos colores, fuente, dark mode, estilo de cards).

## Project Classification

| Aspecto | Valor |
|---|---|
| **Tipo de Proyecto** | Web App (sitio estático con islands interactivas + panel admin + blog) |
| **Dominio** | Portfolio profesional de desarrollador |
| **Complejidad** | Baja (sin regulaciones ni compliance — la complejidad está en la calidad de ejecución) |
| **Contexto** | Brownfield — migración de sistema Flutter Web en producción con Firebase existente |
| **Stack Objetivo** | Astro 5 + TypeScript strict + Tailwind CSS 4 + Svelte 5 (islands) + Firebase |
| **Hosting Objetivo** | Cloudflare Pages (primario) o Vercel |
| **Timeline** | Lanzamiento objetivo: 2026-03-16 |

## Success Criteria

### User Success

| Usuario | Criterio de Éxito | Indicador |
|---|---|---|
| **Sarah (Reclutadora)** | Primera impresión profesional inmediata | Sitio carga en <1.5s, diseño limpio, contenido navegable en <3 clicks |
| **Sarah (Equipo técnico)** | Código que valida competencia | Repo con arquitectura limpia, tests, TypeScript strict, cero shortcuts |
| **Christopher (Admin)** | Actualización de contenido sin fricción | Sesión completa (proyectos, experiencia, tecnologías, blog) sin bugs ni inconsistencias |
| **Christopher (Admin)** | Publicar artículos de blog | CRUD funcional, vista de listado, URLs propias por artículo |
| **Diego (Dev)** | Clone → configure → deploy exitoso | Siguiendo solo el README, portfolio propio funcionando |

### Business Success

El objetivo de negocio es singular: **fortalecer la presencia profesional para oportunidades laborales**. El portfolio es destino desde LinkedIn y aplicaciones directas — no se esperan métricas de búsqueda orgánica al lanzamiento.

- Portfolio desplegado con datos actualizados y funcionando sin errores
- Repositorio público que demuestra calidad profesional al ser revisado
- Primer artículo de blog publicado (caso de estudio BMAD + IA)
- Christopher se siente orgulloso de mostrar tanto el sitio como el código

### Technical Success

| KPI | Target | Método |
|---|---|---|
| **Lighthouse Performance** | >95 | Lighthouse CI |
| **Lighthouse SEO** | >95 | Lighthouse CI |
| **Lighthouse Accessibility** | >95 | Lighthouse CI |
| **Lighthouse Best Practices** | >95 | Lighthouse CI |
| **Core Web Vitals — LCP** | <1.5s | PageSpeed Insights |
| **Core Web Vitals — INP** | <100ms | PageSpeed Insights |
| **Core Web Vitals — CLS** | <0.05 | PageSpeed Insights |
| **Cobertura de Tests** | >80% | Vitest coverage |
| **Bundle JS total** | <50KB | Build output |
| **Bugs al lanzamiento** | 0 | QA + tests automatizados |
| **Assets huérfanos en Storage** | 0 | Verificación post-operación |

### Measurable Outcomes

1. **Paridad funcional completa** — Todas las features del portfolio Flutter replicadas y funcionando
2. **Blog operativo** — CRUD desde admin, listado de artículos, páginas individuales con URLs limpias (`/blog/[slug]`)
3. **Admin robusto** — Ruta `/admin` protegida, CRUD de projects/technologies/experiences/blog sin errores
4. **Open source ready** — README completo, `.env.example`, cero credenciales expuestas, clonable
5. **Datos actualizados** — Información profesional de Christopher al día
6. **i18n completo** — Sitio bilingüe ES/EN con hreflang correcto

## User Journeys

### Journey 1: Sarah — La Reclutadora que Evalúa

**Persona:** Sarah, Technical Recruiter en una empresa de tecnología. Recibe docenas de aplicaciones diarias y necesita filtrar candidatos rápidamente.

**Opening Scene:** Sarah revisa aplicaciones en LinkedIn. Ve el perfil de Christopher — tiene un link a su portfolio y un artículo técnico compartido como post. Le llama la atención que no es el típico link a un template genérico.

**Rising Action:** Hace click al portfolio. El sitio carga instantáneamente — diseño limpio, profesional, sin sobrecarga visual. Navega a Projects y ve screenshots reales, descripciones claras, tecnologías usadas y links al código fuente. Todo en español e inglés. En 30 segundos tiene una imagen clara de qué sabe hacer Christopher.

**Climax:** Sarah comparte el link del portfolio con el Tech Lead de su equipo. Él abre el repositorio en GitHub — ve TypeScript strict, tests con >80% de cobertura, arquitectura organizada, commits semánticos. Le dice a Sarah: "Este candidato sabe lo que hace, agenda la entrevista."

**Resolution:** Christopher recibe la invitación a entrevista. El portfolio hizo su trabajo — no tuvo que explicar sus habilidades, el código habló por él.

**Capabilities reveladas:** Carga ultra-rápida, navegación intuitiva, SEO con meta tags y OpenGraph (para que el link se vea bien en LinkedIn), responsive, i18n, contenido profesional y actualizado.

---

### Journey 2: Christopher — El Admin que Actualiza Después de Meses

**Persona:** Christopher, el propio dueño del portfolio. Vuelve al admin después de 8 meses sin tocarlo.

**Opening Scene:** Christopher acaba de terminar un proyecto freelance importante y quiere agregarlo a su portfolio antes de postular a nuevas posiciones. No recuerda los detalles del admin.

**Rising Action:** Navega a `/admin` y ve el login claro. Ingresa sus credenciales. El dashboard le muestra las secciones disponibles: Projects, Technologies, Experiences, Blog. Todo es intuitivo — no necesita recordar nada.

**Climax:** Crea un nuevo proyecto: llena nombre (ES/EN), descripción, sube la imagen principal y 4 screenshots, selecciona tecnologías existentes, agrega features y URLs. Todo en un formulario limpio. Al guardar, las imágenes se suben a Storage correctamente. Luego decide actualizar un proyecto viejo — reemplaza una screenshot y el sistema elimina automáticamente la imagen anterior de Storage. Cero huérfanos.

**Resolution:** En 25 minutos actualizó 2 proyectos, agregó una tecnología nueva, editó su experiencia laboral, y publicó un artículo de blog sobre el proyecto freelance con imágenes. Sale del admin sabiendo que todo está limpio y consistente.

**Capabilities reveladas:** Ruta `/admin` protegida, CRUD completo con formularios claros (ES/EN), gestión de imágenes con ciclo de vida completo en Storage, editor de blog con soporte de imágenes, UX intuitiva que funciona sin memoria previa.

---

### Journey 3: Christopher — El Blogger que Comparte en LinkedIn

**Persona:** Christopher, ahora en su rol de creador de contenido técnico.

**Opening Scene:** Christopher quiere escribir sobre cómo construyó su portfolio con BMAD + IA. Tiene screenshots del proceso, fragmentos de código y una narrativa clara.

**Rising Action:** Entra al admin, va a la sección Blog, y crea un nuevo artículo. El editor le permite escribir con formato rico — títulos, párrafos, código, negritas. Sube imágenes que se integran en el contenido. Define un slug limpio (`construyendo-mi-portfolio-con-bmad`), selecciona idioma, y lo marca como publicado.

**Climax:** Copia la URL del artículo (`/blog/construyendo-mi-portfolio-con-bmad`) y la pega en un post de LinkedIn. El OpenGraph muestra título, descripción e imagen del artículo automáticamente — se ve profesional en el feed. El post genera interacción y visitas al portfolio.

**Resolution:** Desarrolladores y reclutadores llegan al artículo, leen el contenido técnico, y navegan al resto del portfolio. Christopher gana visibilidad como profesional que no solo construye — documenta y comparte su proceso.

**Capabilities reveladas:** Editor de blog profesional con formato rico e imágenes, slugs personalizables, estado publicado/borrador, OpenGraph por artículo para compartir en redes, listado público de artículos en `/blog`, página individual por artículo.

---

### Journey 4: Diego — El Dev que Clona el Repo

**Persona:** Diego, desarrollador junior-intermedio que busca un portfolio profesional para él mismo.

**Opening Scene:** Diego ve el post de Christopher en LinkedIn sobre su portfolio. Le impresiona el diseño y la calidad. Hace click al link del repositorio en GitHub.

**Rising Action:** Lee el README — instrucciones claras de setup, `.env.example` documentado, arquitectura explicada. Clona el repo, crea su proyecto Firebase, copia el `.env.example` a `.env` y llena sus credenciales. Ejecuta `pnpm install && pnpm dev`.

**Climax:** El sitio levanta en local con datos de ejemplo. Diego empieza a personalizar: cambia sus datos, sube sus proyectos vía el admin, modifica colores con variables de Tailwind. En una tarde tiene su portfolio funcionando con su propia información.

**Resolution:** Diego despliega en Cloudflare Pages, tiene su portfolio profesional listo. Agradece a Christopher en LinkedIn y le da una estrella al repo.

**Capabilities reveladas:** README completo, `.env.example` documentado, setup reproducible, cero credenciales hardcodeadas, datos de ejemplo funcionales, personalización accesible.

---

### Journey Requirements Summary

| Capability | Journeys que la requieren | Prioridad |
|---|---|---|
| **Carga ultra-rápida (<1.5s LCP)** | Sarah | MVP |
| **SEO + OpenGraph por página y artículo** | Sarah, Christopher (blogger) | MVP |
| **Navegación intuitiva y responsive** | Sarah, Diego | MVP |
| **i18n ES/EN** | Sarah, Christopher (admin) | MVP |
| **Ruta `/admin` protegida con login** | Christopher (admin, blogger) | MVP |
| **CRUD Projects con imágenes y ciclo de vida Storage** | Christopher (admin) | MVP |
| **CRUD Technologies/Experiences** | Christopher (admin) | MVP |
| **CRUD Blog con editor rico e imágenes** | Christopher (blogger) | MVP |
| **Slugs personalizables para blog** | Christopher (blogger) | MVP |
| **Estado publicado/borrador en blog** | Christopher (blogger) | MVP |
| **Listado público de artículos `/blog`** | Sarah, Christopher (blogger) | MVP |
| **README + `.env.example` + setup docs** | Diego | MVP |
| **Dark/Light mode** | Todos | MVP |
| **Gestión de imágenes sin huérfanos** | Christopher (admin, blogger) | MVP |

## Web App Specific Requirements

### Project-Type Overview

Portfolio web profesional con arquitectura híbrida: sitio público server-rendered (SSR) para contenido dinámico desde Firebase + panel de administración como SPA interactiva con Svelte 5 islands. El contenido gestionado desde el admin se refleja inmediatamente en el sitio público sin necesidad de rebuild o redeploy.

### Technical Architecture Considerations

**Rendering Strategy:**
- **Sitio público — SSR híbrido**: Páginas que muestran datos de Firestore (Projects, Technologies, Experiences, Blog) se renderizan en servidor en cada request, consultando Firebase en tiempo real. Páginas puramente estáticas (Home shell, Contact) pueden ser SSG
- **Panel admin — SPA con Svelte 5**: Islands interactivas con hidratación completa para formularios CRUD, editor de blog, gestión de imágenes
- **Resultado**: Cambios en admin → guardados en Firestore → reflejados inmediatamente en la siguiente visita al sitio público. Cero deploys manuales para actualizar contenido

**Browser Support:**
- Navegadores modernos: Chrome, Firefox, Safari, Edge (últimas 2 versiones)
- No se requiere soporte para IE11 ni navegadores legacy
- Responsive: Mobile (< 450px), Tablet (450-900px), Desktop (> 900px)

### SEO Strategy

| Aspecto | Implementación |
|---|---|
| **HTML Semántico** | Tags nativos (header, main, nav, article, section, footer) |
| **Meta Tags** | Title, description, OpenGraph, Twitter Cards por página |
| **OpenGraph por artículo** | Título, descripción e imagen para cada blog post (compartir en LinkedIn) |
| **Sitemap** | Generado automáticamente con @astrojs/sitemap |
| **robots.txt** | Configurado para permitir indexación pública, bloquear /admin |
| **URLs limpias** | `/projects/[slug]`, `/blog/[slug]` — sin hashes ni IDs |
| **hreflang** | Tags para ES/EN en cada página bilingüe |
| **Structured Data** | JSON-LD para Person, Portfolio, BlogPosting |

### Performance & Accessibility

Targets de performance y criterios de accesibilidad completos en la sección **Non-Functional Requirements** (NFR1-NFR7 para performance, NFR14-NFR19 para accessibility). Estándar: Lighthouse >95 en las 4 categorías, WCAG 2.1 AA.

### Implementation Considerations

- **Hosting con SSR**: Cloudflare Pages con Workers o Vercel con Serverless Functions para soportar SSR
- **Firebase SDK**: Client-side para admin (CRUD), Server-side (Admin SDK) para queries SSR en el sitio público
- **Caching**: Cache en edge para páginas SSR con invalidación por tiempo (stale-while-revalidate) para balance entre frescura y performance
- **Imágenes**: Optimización automática con Astro Image (WebP/AVIF), lazy loading, srcset responsive
- **Fonts**: Google Fonts (Poppins) con font-display swap y preload

## Project Scoping & Phased Development

### MVP Strategy & Philosophy

**MVP Approach:** Migración completa con paridad funcional + blog. No es un MVP experimental — es una reconstrucción profesional de un producto en producción. El alcance está definido por las features existentes del portfolio Flutter más la adición del sistema de blog.

**Resource Requirements:** 1 desarrollador (Christopher) + agentes de IA (Claude Code con BMAD Method). Timeline: 1 día intensivo (2026-03-15 → 2026-03-16).

**Filosofía:** Cero compromisos. Todo lo definido en el MVP se entrega con calidad profesional o no se entrega. No hay "versión degradada" — el portfolio es la carta de presentación y debe reflejar el estándar completo desde el día 1.

### MVP Feature Set (Phase 1) — Innegociable

**Core User Journeys Soportados:**
- Journey 1: Sarah evalúa el portfolio (sitio público completo)
- Journey 2: Christopher actualiza contenido (admin CRUD completo)
- Journey 3: Christopher publica blog post (blog con editor rico)
- Journey 4: Diego clona el repo (open source ready)

**Must-Have Capabilities:**

| Área | Features | Criterio de Completitud |
|---|---|---|
| **Sitio Público** | Home, Projects, Experience, Contact, Blog | Todas las páginas renderizadas, responsive, i18n ES/EN |
| **SEO** | Meta tags, OpenGraph, sitemap, robots.txt, hreflang, structured data | Lighthouse SEO > 95 |
| **Admin** | Login `/admin`, CRUD Projects, Technologies, Experiences, Blog | Todas las operaciones sin errores |
| **Blog** | Editor rico con imágenes, slugs, publicado/borrador, listado, páginas individuales | CRUD funcional, URLs limpias |
| **Imágenes** | Upload, reemplazo, eliminación con ciclo de vida completo | 0 assets huérfanos en Storage |
| **Performance** | LCP <1.5s, INP <100ms, CLS <0.05, bundle <50KB | Lighthouse Performance > 95 |
| **Accessibility** | WCAG 2.1 AA, navegación por teclado, contraste, alt text | Lighthouse Accessibility > 95 |
| **Testing** | Vitest (unit) + Playwright (E2E) | Cobertura > 80% |
| **CI/CD** | GitHub Actions: build, test, Lighthouse CI, deploy | Pipeline funcional |
| **Open Source** | README, `.env.example`, cero secrets, datos de ejemplo | Clonable y deployable |
| **i18n** | ES/EN completo con toggle y hreflang | Todas las páginas bilingües |
| **Tema** | Dark/Light mode con persistencia | Ambos temas funcionales |

### Post-MVP Features (Phase 2 — Growth)

- Analytics integrado (Vercel Analytics o Firebase Analytics)
- Formulario de contacto con envío real de email (Resend/SendGrid)
- Sección de certificaciones o testimonios
- SEO orgánico — optimización activa, Google Search Console
- Mejoras al editor de blog (preview en tiempo real, auto-save)

### Phase 3 — Vision (Futuro)

- Template mode configurable para otros desarrolladores
- Más artículos técnicos para posicionamiento
- PWA / modo offline
- Dashboard de métricas en el admin
- Comentarios en blog posts

### Risk Mitigation Strategy

**Technical Risks:**

| Riesgo | Probabilidad | Impacto | Mitigación |
|---|---|---|---|
| Timeline agresivo (1 día) | Alta | Alto | Agentes de IA paralelos, Christopher dedicado, scope cerrado sin ambigüedades |
| Firebase Admin SDK + Astro SSR | Media | Alto | Usar SDK JS estándar en server endpoints, no depender de adapters experimentales |
| Editor de blog rico | Media | Medio | Usar librería probada (TipTap, Milkdown, o Markdown con preview) en lugar de construir desde cero |
| Integración i18n con contenido dinámico de Firestore | Media | Medio | Campos bilingües en modelos (patrón ya validado en Flutter) |

**Resource Risks:**
- Si el timeline se extiende, el blog podría usar Markdown simple como editor temporal y migrar a editor rico en Phase 2
- CI/CD puede simplificarse a deploy manual inicialmente si GitHub Actions toma demasiado tiempo de configuración
- Tests E2E de Playwright pueden priorizarse para happy paths críticos primero

**Zero Compromise:**
- Bajo ninguna circunstancia se lanza con bugs conocidos, credenciales expuestas, o features incompletas
- Si algo no está listo, se retrasa el lanzamiento — no se degrada la calidad

## Functional Requirements

### Visualización de Contenido Público

- **FR1:** Visitantes pueden ver la página principal con secciones de About Me, Technologies, Projects destacados y Experience
- **FR2:** Visitantes pueden navegar al catálogo completo de proyectos con filtro por tecnología utilizada
- **FR3:** Visitantes pueden ver el detalle de cada proyecto con imágenes, descripción, tecnologías usadas y links externos
- **FR4:** Visitantes pueden ver screenshots de proyectos en un visor de imágenes ampliado
- **FR5:** Visitantes pueden ver la experiencia laboral en formato timeline
- **FR6:** Visitantes pueden ver el listado de artículos de blog publicados
- **FR7:** Visitantes pueden leer un artículo de blog individual con formato rico (headings, párrafos, listas, código, negritas, links, imágenes embebidas)
- **FR8:** Visitantes pueden enviar un mensaje de contacto seleccionando canal (WhatsApp o Email) y código de país
- **FR9:** Visitantes pueden navegar a perfiles de redes sociales (GitHub, LinkedIn, TikTok)

### Internacionalización y Personalización

- **FR10:** Visitantes pueden cambiar el idioma del sitio entre Español e Inglés
- **FR11:** Visitantes pueden cambiar el tema visual entre Dark y Light mode
- **FR12:** El sistema persiste la preferencia de tema del visitante entre sesiones
- **FR13:** Todo el contenido público (páginas, proyectos, experiencias, blog) se muestra en el idioma seleccionado
- **FR14:** Cada página pública genera meta tags hreflang para ambos idiomas

### Autenticación y Control de Acceso

- **FR15:** Christopher puede acceder al panel de administración navegando a una ruta dedicada `/admin`
- **FR16:** Christopher puede autenticarse con email y password
- **FR17:** Christopher puede cerrar sesión desde el panel de administración
- **FR18:** El sistema protege todas las rutas de administración — visitantes no autenticados son redirigidos al login

### Gestión de Proyectos (Admin)

- **FR19:** Christopher puede crear un nuevo proyecto con nombre (ES/EN), descripción (ES/EN), features (ES/EN), imagen principal, screenshots, tecnologías asociadas y URLs externas
- **FR20:** Christopher puede editar cualquier campo de un proyecto existente
- **FR21:** Christopher puede eliminar un proyecto y todos sus assets asociados
- **FR22:** Christopher puede ver la lista completa de proyectos en el admin

### Gestión de Tecnologías (Admin)

- **FR23:** Christopher puede crear una nueva tecnología con nombre, icono/imagen y tiempo de experiencia
- **FR24:** Christopher puede editar cualquier campo de una tecnología existente
- **FR25:** Christopher puede eliminar una tecnología y su imagen asociada
- **FR26:** Christopher puede ver la lista completa de tecnologías en el admin

### Gestión de Experiencias (Admin)

- **FR27:** Christopher puede crear una nueva experiencia laboral con fecha, empresa, cargo (ES/EN) y responsabilidades (ES/EN)
- **FR28:** Christopher puede editar cualquier campo de una experiencia existente
- **FR29:** Christopher puede eliminar una experiencia
- **FR30:** Christopher puede ver la lista completa de experiencias en el admin

### Gestión de Blog (Admin)

- **FR31:** Christopher puede crear un nuevo artículo de blog con título (ES/EN), contenido con formato rico (headings, párrafos, listas, código, negritas, links, imágenes embebidas), slug personalizable, imagen de portada y estado (publicado/borrador)
- **FR32:** Christopher puede insertar imágenes dentro del contenido de un artículo
- **FR33:** Christopher puede editar cualquier campo de un artículo existente
- **FR34:** Christopher puede eliminar un artículo y todos sus assets asociados
- **FR35:** Christopher puede cambiar el estado de un artículo entre publicado y borrador
- **FR36:** Christopher puede ver la lista de todos los artículos (publicados y borradores) en el admin
- **FR37:** Solo los artículos marcados como publicados son visibles en el sitio público

### Gestión de Imágenes y Assets

- **FR38:** Christopher puede subir imágenes al crear o editar proyectos, tecnologías y artículos de blog
- **FR39:** Christopher puede reemplazar una imagen existente — el sistema elimina automáticamente la imagen anterior de Storage
- **FR40:** Al eliminar una entidad (proyecto, tecnología, artículo), el sistema elimina automáticamente todos sus assets de Storage
- **FR41:** El sistema no permite assets huérfanos en Storage bajo ninguna circunstancia

### SEO y Compartibilidad

- **FR42:** Cada página pública genera meta tags (title, description, OpenGraph, Twitter Cards) apropiados
- **FR43:** Cada artículo de blog genera OpenGraph con título, descripción e imagen para compartir en redes sociales
- **FR44:** El sistema genera sitemap.xml automáticamente con todas las páginas públicas
- **FR45:** El sistema genera robots.txt bloqueando rutas de admin y permitiendo indexación pública
- **FR46:** Cada proyecto y artículo tiene una URL limpia basada en slug (`/projects/[slug]`, `/blog/[slug]`)

### Open Source y Replicabilidad

- **FR47:** Un desarrollador puede clonar el repositorio, configurar sus credenciales Firebase y ejecutar el proyecto localmente siguiendo el README
- **FR48:** El repositorio no contiene credenciales, secrets ni datos sensibles en el código fuente
- **FR49:** El repositorio incluye un `.env.example` documentado con todas las variables requeridas

## Non-Functional Requirements

### Performance

| Requisito | Métrica | Criterio |
|---|---|---|
| **NFR1:** Páginas públicas cargan rápido en primera visita | LCP | < 1.5s en conexión 4G |
| **NFR2:** Interacciones responden inmediatamente | INP | < 100ms |
| **NFR3:** Layout no salta durante la carga | CLS | < 0.05 |
| **NFR4:** SSR responde rápido desde el servidor | TTFB | < 200ms |
| **NFR5:** JavaScript mínimo enviado al navegador | Bundle total | < 50KB |
| **NFR6:** Imágenes no bloquean la carga inicial | Lazy loading | Imágenes below-the-fold cargan diferido, verificado via auditoría Lighthouse (no images in initial network waterfall) |
| **NFR7:** Operaciones CRUD del admin completan sin esperas largas | Tiempo de operación | < 3s para crear/editar/eliminar incluyendo upload de imágenes |

### Security

| Requisito | Criterio |
|---|---|
| **NFR8:** Rutas de admin inaccesibles sin autenticación | Redirect a login en todo request no autenticado a `/admin/*` |
| **NFR9:** Credenciales Firebase nunca expuestas en código | Variables de entorno para todas las keys, `.env` en `.gitignore` |
| **NFR10:** Firestore Security Rules restringen escritura a admin autenticado | Solo el UID del admin puede crear/editar/eliminar documentos |
| **NFR11:** Firebase Storage Rules restringen upload a admin autenticado | Solo el UID del admin puede subir/eliminar archivos |
| **NFR12:** No hay endpoints de API públicos que permitan mutaciones sin auth | Todos los server endpoints que mutan datos verifican token de sesión |
| **NFR13:** El repositorio público no contiene secrets | Auditoría pre-push: cero API keys, service accounts o tokens en el código |

### Accessibility

| Requisito | Criterio |
|---|---|
| **NFR14:** Cumplimiento WCAG 2.1 Nivel AA | Lighthouse Accessibility > 95 |
| **NFR15:** Navegación completa por teclado | Todos los elementos interactivos accesibles via Tab/Enter/Escape |
| **NFR16:** Contraste suficiente en ambos temas | Ratio mínimo 4.5:1 para texto normal, 3:1 para texto grande (dark y light) |
| **NFR17:** Imágenes con texto alternativo | Todas las imágenes de contenido tienen alt text descriptivo |
| **NFR18:** Estructura semántica correcta | Jerarquía de headings (h1→h6) lógica, landmarks ARIA en layout |
| **NFR19:** Skip navigation disponible | Link "Saltar al contenido" visible en focus para usuarios de teclado |

### Code Quality

| Requisito | Criterio |
|---|---|
| **NFR20:** Cobertura de tests mínima | > 80% líneas cubiertas (Vitest coverage report) |
| **NFR21:** Tests E2E para flujos críticos | Happy paths de navegación pública y CRUD admin cubiertos (Playwright) |
| **NFR22:** TypeScript strict sin errores | `strict: true` en tsconfig, cero errores de compilación |
| **NFR23:** Linting sin warnings | ESLint + Prettier configurados, cero warnings en CI |
| **NFR24:** Build exitoso en CI | GitHub Actions: build + test + lint pasan en cada push |
| **NFR25:** Lighthouse CI como quality gate | Las 4 categorías > 95 verificadas automáticamente en cada deploy |

### Integration

| Requisito | Criterio |
|---|---|
| **NFR26:** Firebase Auth funcional y estable | Login/logout sin errores, sesión persistente entre recargas |
| **NFR27:** Firestore queries eficientes | Queries indexadas, sin full collection scans innecesarios |
| **NFR28:** Firebase Storage operaciones confiables | Upload/delete completan exitosamente con retry en caso de error de red |
| **NFR29:** Hosting con SSR estable | Cloudflare Workers o Vercel Functions responden consistentemente |
