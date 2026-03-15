---
stepsCompleted: [1, 2, 3, 4, 5, 6]
status: complete
inputDocuments:
  - '_bmad-output/project-context.md'
  - '_bmad-output/planning-artifacts/research/technical-migracion-flutter-web-research-2026-03-15.md'
  - 'docs/index.md'
  - 'docs/project-overview.md'
  - 'docs/architecture.md'
  - 'docs/component-inventory.md'
  - 'docs/data-models.md'
  - 'docs/deployment-guide.md'
  - 'docs/development-guide.md'
  - 'docs/source-tree-analysis.md'
date: 2026-03-15
author: Christopher
---

# Product Brief: portfolio

<!-- Content will be appended sequentially through collaborative workflow steps -->

## Resumen Ejecutivo

Portfolio ChrisBP es la migración profesional de un portfolio de desarrollador desde Flutter Web hacia Astro 5, ejecutada con metodología BMAD y asistencia de IA. El proyecto actual, aunque visualmente funcional, tiene limitaciones fundamentales: Flutter Web renderiza en canvas impidiendo SEO efectivo, el panel de administración fue construido de forma improvisada con patrones de seguridad y UX cuestionables, y los datos del portfolio están desactualizados.

La migración no es un simple cambio de framework — es una reconstrucción profesional que demuestra buenas prácticas de ingeniería de software: arquitectura limpia, principios SOLID, cobertura de tests completa, cero bugs, gestión correcta de assets y credenciales, y documentación del proceso completo. El resultado será un repositorio open source que sirve como carta de presentación profesional y como caso de estudio de migración asistida por IA con BMAD Method.

El stack objetivo — Astro 5 + TypeScript + Tailwind CSS + Svelte 5 (islands) + Firebase — reduce el JavaScript enviado al navegador en un 95%, habilita SEO nativo con HTML semántico, y mantiene la integración con Firebase para los servicios existentes.

---

## Visión Central

### Declaración del Problema

El portfolio actual de Christopher Bobadilla Plasencia está construido con Flutter Web, una tecnología diseñada para aplicaciones interactivas, no para sitios de contenido. Esto genera tres problemas críticos:

1. **SEO inexistente**: El renderizado basado en CanvasKit/WebGL impide que los motores de búsqueda indexen el contenido. Para un portfolio cuyo propósito es conseguir oportunidades laborales, esto es un problema fundamental.

2. **Panel de administración improvisado**: El acceso al admin está oculto detrás de toques invisibles en el footer, en lugar de tener una ruta protegida dedicada. La gestión de imágenes tiene inconsistencias — imágenes huérfanas en Storage, problemas al reemplazar o eliminar screenshots de proyectos, y falta de estrategias robustas para el ciclo de vida de assets.

3. **Datos desactualizados**: La información de proyectos, experiencia laboral y tecnologías no refleja el estado actual de Christopher como profesional.

### Impacto del Problema

- Un portfolio invisible a Google significa oportunidades laborales perdidas
- Un admin frágil genera fricción cada vez que Christopher necesita actualizar su contenido
- Datos desactualizados proyectan una imagen profesional que no corresponde con la realidad
- La calidad del código actual no refleja el nivel de buenas prácticas que Christopher domina y quiere demostrar

### Por Qué las Soluciones Existentes No Son Suficientes

Los templates de portfolio open source abundan en el ecosistema Astro/Next.js, pero adolecen de lo mismo: son cascarones visuales sin profundidad de ingeniería. No demuestran arquitectura limpia, no incluyen tests, no tienen paneles de administración robustos, y no documentan el proceso de toma de decisiones técnicas.

Este proyecto no compite con templates — compite con la percepción que un reclutador o líder técnico tiene al revisar el código fuente de un candidato.

### Solución Propuesta

Reconstruir el portfolio desde cero utilizando Astro 5 como framework principal, manteniendo todas las features existentes y mejorando las áreas problemáticas:

- **Sitio público**: Replicar la UI actual (que visualmente funciona bien) con mejor performance, animaciones fluidas, SEO nativo y HTML semántico
- **Panel de administración**: Rediseñar con rutas protegidas dedicadas, gestión de imágenes robusta con ciclo de vida completo en Storage (sin huérfanos), y UX pulida
- **Calidad de código**: Arquitectura limpia, principios SOLID, TypeScript strict, cobertura de tests completa, cero bugs
- **Open source ready**: Gestión segura de credenciales y configuración para que el repositorio sea público sin comprometer datos sensibles
- **Datos actualizados**: Aprovechar la migración para actualizar toda la información profesional
- **Proceso documentado**: El camino desde Flutter Web hasta el producto final queda registrado como caso de estudio de migración profesional con BMAD + IA

### Diferenciadores Clave

1. **Demostración de competencia real**: No es un proyecto tutorial — es una migración de producción con datos reales, Firebase real, y un admin funcional. El código habla por sí mismo ante reclutadores y líderes técnicos.

2. **Migración documentada con BMAD + IA**: El proceso completo — desde investigación técnica hasta implementación — sigue una metodología estructurada y reproducible, demostrando cómo se puede migrar un proyecto en producción sin improvisación.

3. **Cero compromiso en calidad**: Tests completos, Lighthouse scores óptimos, gestión de assets sin huérfanos, seguridad en rutas admin, manejo de credenciales para repo público. Cada aspecto está resuelto profesionalmente.

4. **Clonable y funcional**: Aunque no es el foco principal, cualquier desarrollador puede clonar el repo, configurar su Firebase y tener su propio portfolio profesional funcionando.

---

## Usuarios Objetivo

### Usuarios Primarios

#### 1. Reclutador / Hiring Manager Técnico — "Sarah"

**Contexto:** Sarah es Technical Recruiter en una empresa de tecnología. Recibe docenas de aplicaciones diarias y necesita evaluar candidatos rápidamente. Cuando un candidato incluye un link a su portfolio en la aplicación, ella lo abre para validar lo que dice el CV.

**Cómo experimenta el problema hoy:**
- Abre portfolios que cargan lento, se ven genéricos, o no muestran evidencia real de habilidades
- Rara vez revisa el código fuente — pero cuando un candidato destaca, su equipo técnico sí lo hace
- Necesita ver en segundos: qué hace el candidato, qué proyectos ha construido, y prueba visual de su capacidad

**Momento de éxito:** Sarah abre el portfolio de Christopher y en menos de 3 segundos ve un sitio rápido, profesional y bien diseñado. Navega los proyectos, ve screenshots de calidad, lee descripciones claras y piensa: "este candidato sabe lo que hace". Agenda una entrevista.

**Recorrido:**
1. **Descubrimiento**: Recibe aplicación de Christopher con link al portfolio (o lo encuentra en LinkedIn)
2. **Primera impresión**: Carga rápida, diseño profesional, contenido claro
3. **Exploración**: Revisa proyectos, tecnologías, experiencia laboral
4. **Validación**: Su equipo técnico revisa el repositorio open source — código limpio, tests, arquitectura sólida
5. **Acción**: Contacta a Christopher para entrevista

#### 2. Christopher (Admin) — "El Propio Christopher"

**Contexto:** Desarrollador que necesita mantener su portfolio actualizado entre oportunidades laborales, con una frecuencia aproximada de cada 6 meses a 1 año. Después de meses sin tocar el admin, necesita que la experiencia sea intuitiva e inmediata.

**Cómo experimenta el problema hoy:**
- El acceso al admin está oculto y poco intuitivo (toques invisibles en el footer)
- La gestión de imágenes es inconsistente — al reemplazar o eliminar screenshots quedan archivos huérfanos en Storage
- Actualizar contenido genera cambios en cadena (nuevo proyecto → nuevas tecnologías → nuevas imágenes → actualizar experiencia) y el admin actual no facilita ese flujo

**Momento de éxito:** Christopher vuelve al admin después de 8 meses, accede por una ruta dedicada con login claro, y en una sesión puede agregar proyectos nuevos, actualizar su experiencia, subir imágenes sin preocuparse por assets huérfanos, y ver los cambios reflejados inmediatamente. Todo funciona sin sorpresas.

**Recorrido:**
1. **Acceso**: Navega a `/admin`, login con credenciales
2. **Actualización**: Agrega/edita proyectos, experiencia, tecnologías — interfaz clara y consistente
3. **Gestión de assets**: Sube, reemplaza o elimina imágenes con ciclo de vida completo en Storage
4. **Verificación**: Ve los cambios en el sitio público inmediatamente
5. **Confianza**: Sale sabiendo que no dejó datos muertos ni inconsistencias

### Usuarios Secundarios

#### 3. Desarrollador que Clona el Repo — "Diego"

**Contexto:** Desarrollador junior o intermedio que busca un portfolio profesional. Encuentra el repositorio de Christopher en GitHub o a través de un post en LinkedIn. No es el foco principal del producto, pero es un beneficio natural del enfoque open source y la calidad del código.

**Cómo experimenta el problema hoy:**
- Los templates de portfolio disponibles son cascarones visuales sin profundidad técnica
- No sabe cómo estructurar un proyecto profesional con tests, arquitectura limpia y gestión de credenciales

**Momento de éxito:** Diego clona el repo, sigue las instrucciones del README, configura su Firebase y en poco tiempo tiene un portfolio profesional funcionando con la misma calidad de código.

**Recorrido:**
1. **Descubrimiento**: Ve el repo en GitHub o un post de Christopher en LinkedIn
2. **Evaluación**: Lee el README, revisa la estructura del código, ve que tiene tests y documentación
3. **Setup**: Clona, configura Firebase, personaliza contenido
4. **Personalización**: Cambia datos, imágenes, colores según su marca personal
5. **Deploy**: Despliega su propio portfolio profesional

### Mapa de Interacción

| Usuario | Frecuencia | Acción Principal | Métrica de Éxito |
|---|---|---|---|
| **Sarah (Reclutador)** | Única visita (~2-5 min) | Evaluar candidato visualmente | Contacta a Christopher |
| **Christopher (Admin)** | Cada 6-12 meses | Actualizar todo el contenido | Sesión fluida sin errores |
| **Diego (Dev)** | Única vez (setup) | Clonar y personalizar | Portfolio propio funcionando |

---

## Métricas de Éxito

### Éxito del Usuario

| Usuario | Métrica | Indicador de Éxito |
|---|---|---|
| **Sarah (Reclutador)** | Primera impresión positiva | Sitio carga en <1.5s, diseño profesional, contenido claro y navegable en <3 clicks |
| **Christopher (Admin)** | Actualización sin fricción | Sesión completa de actualización (proyectos, experiencia, tecnologías, imágenes) sin bugs ni inconsistencias |
| **Diego (Dev)** | Setup exitoso | Clone → configure → deploy funcional siguiendo solo el README |

### Objetivos de Negocio

El objetivo de negocio es singular y claro: **conseguir oportunidades laborales**. El portfolio es una herramienta estratégica dentro de un ecosistema más amplio (LinkedIn, GitHub, aplicaciones directas) para resaltar como candidato.

**Objetivos concretos:**

1. **Presencia profesional completa**: Portfolio desplegado, con datos actualizados, accesible desde CV, LinkedIn y aplicaciones de trabajo
2. **Código como carta de presentación**: Repositorio open source que demuestra buenas prácticas cuando un equipo técnico lo revisa
3. **GitHub fortalecido**: El repositorio open source con buena documentación, tests y arquitectura limpia mejora el perfil de GitHub como candidato

### Indicadores Clave de Rendimiento (KPIs)

#### Calidad Técnica (Medibles al finalizar la migración)

| KPI | Target | Método de Medición |
|---|---|---|
| **Lighthouse Performance** | >95 | Lighthouse CI en cada deploy |
| **Lighthouse SEO** | >95 | Lighthouse CI en cada deploy |
| **Lighthouse Accessibility** | >95 | Lighthouse CI en cada deploy |
| **Lighthouse Best Practices** | >95 | Lighthouse CI en cada deploy |
| **Core Web Vitals — LCP** | <1.5s | Google PageSpeed Insights |
| **Core Web Vitals — INP** | <100ms | Google PageSpeed Insights |
| **Core Web Vitals — CLS** | <0.05 | Google PageSpeed Insights |
| **Cobertura de Tests** | >80% | Vitest coverage report |
| **Bugs conocidos al lanzamiento** | 0 | QA manual + tests automatizados |
| **Bundle JS total** | <50KB | Build output analysis |

#### Funcionalidad del Admin (Medibles en QA)

| KPI | Target | Método de Medición |
|---|---|---|
| **CRUD completo sin errores** | 100% operaciones exitosas | Tests E2E con Playwright |
| **Gestión de imágenes** | 0 assets huérfanos en Storage | Verificación post-operación |
| **Tiempo de sesión de actualización** | <30 minutos para actualización completa | Prueba manual |

#### Impacto Profesional (Medibles post-lanzamiento)

| KPI | Target | Método de Medición |
|---|---|---|
| **Indexación en Google** | Páginas principales indexadas en <2 semanas | Google Search Console |
| **Repositorio público** | README completo, sin credenciales expuestas, clonable | Revisión manual |
| **GitHub engagement** | Stars y forks como indicador secundario | GitHub Insights |

---

## Alcance del MVP

### Features Principales

Este es un proyecto de migración — el alcance es replicar todas las features existentes con calidad profesional, más la adición de un blog técnico integrado con el admin como feature estratégica del MVP.

#### Sitio Público

| Feature | Descripción | Mejora vs. Actual |
|---|---|---|
| **Home** | Página principal con secciones: About Me, Technologies, Projects destacados, Experience | Mejor performance, animaciones fluidas, HTML semántico |
| **Projects** | Catálogo de proyectos con filtros, imágenes, screenshots, tecnologías usadas, links | SEO por proyecto, rutas dinámicas `/projects/[slug]`, carga optimizada de imágenes |
| **Experience** | Experiencia laboral con timeline | Datos desde Firebase (actualmente hardcoded en fake) |
| **Contact** | Formulario de contacto con selector WhatsApp/Email y código de país | Progressive enhancement, funciona sin JS |
| **i18n** | Sitio bilingüe Español/Inglés con toggle | i18n nativo de Astro con routing por locale, SEO multilingüe (hreflang) |
| **Tema** | Toggle dark/light mode | Persistencia y respeto a preferencia del sistema |
| **SEO** | Meta tags, OpenGraph, Twitter Cards, sitemap, robots.txt | Mejora fundamental — de cero indexación a SEO completo |
| **Responsive** | Mobile, tablet, desktop | Mismos breakpoints, implementación con Tailwind CSS |
| **Blog** | Listado de artículos publicados, página individual por artículo con formato rico | Feature nueva — aporta SEO orgánico y demuestra capacidad de contenido dinámico |

#### Panel de Administración

| Feature | Descripción | Mejora vs. Actual |
|---|---|---|
| **Autenticación** | Login email/password con ruta dedicada `/admin` | Ruta protegida real en lugar de acceso oculto en footer |
| **CRUD Projects** | Crear, editar, eliminar proyectos con imágenes múltiples | Gestión de imágenes robusta — ciclo de vida completo en Storage, cero huérfanos |
| **CRUD Technologies** | Crear, editar, eliminar tecnologías con icono | Mismo patrón de gestión de assets |
| **CRUD Experiences** | Crear, editar, eliminar experiencias laborales | Conectado a Firebase (actualmente usa datos fake) |
| **Gestión de Imágenes** | Upload, reemplazo, eliminación de imágenes en Firebase Storage | Estrategia explícita: al reemplazar se elimina el anterior, al borrar entidad se limpian todos sus assets |
| **CRUD Blog** | Crear, editar, eliminar artículos con formato rico, imágenes, slugs y estado publicado/borrador | Feature nueva — editor de contenido integrado en admin |

#### Infraestructura y Calidad

| Aspecto | Descripción |
|---|---|
| **Stack** | Astro 5 + TypeScript strict + Tailwind CSS 4 + Svelte 5 (islands) |
| **Backend** | Firebase (Auth, Firestore, Storage) — mismo proyecto `portfolio-chrisbp` |
| **Tests** | Vitest (unit) + Playwright (E2E), cobertura >80% |
| **CI/CD** | GitHub Actions — build, test, Lighthouse CI, deploy automático |
| **Hosting** | Cloudflare Pages (primario) o Vercel |
| **Credenciales** | Variables de entorno, `.env.example` documentado, cero secrets en código |
| **Documentación** | README completo para setup, desarrollo y deploy |

### Fuera de Alcance del MVP

- CMS externo (Prismic, Sanity, etc.)
- Analytics dashboard o métricas de visitantes en el admin
- Registro de usuarios o roles adicionales
- Notificaciones push o email automáticos
- PWA / modo offline
- Migraciones de data automáticas desde el proyecto Flutter

### Criterios de Éxito del MVP

El MVP se considera exitoso cuando:

1. **Paridad funcional**: Todas las features del portfolio actual están replicadas y funcionando
2. **Calidad técnica**: Lighthouse >95 en las 4 categorías, Core Web Vitals aprobados, cobertura de tests >80%
3. **Admin funcional**: CRUD completo de projects, technologies, experiences y blog sin bugs, gestión de imágenes sin huérfanos
4. **Open source ready**: Repositorio público con README, `.env.example`, sin credenciales expuestas, clonable y deployable
5. **Datos actualizados**: Información profesional de Christopher al día
6. **Cero bugs conocidos**: Toda funcionalidad testeada y verificada

### Visión Futura

Aunque no está en el alcance del MVP, estas son posibles evoluciones post-lanzamiento:

- **Analytics integrado**: Dashboard básico en el admin con métricas de visitas (Vercel Analytics o Firebase Analytics)
- **Mejoras de contenido**: Sección de certificaciones, testimonios de colegas, o caso de estudios de proyectos
- **Template mode**: Documentación y configuración más granular para que otros devs personalicen el portfolio más fácilmente (temas, secciones configurables)
- **Formulario de contacto mejorado**: Envío real de email vía API (Resend/SendGrid) en lugar de redirección a WhatsApp/mailto
