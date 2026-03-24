# Visión General del Proyecto — Portfolio ChrisBP

> Generado: 2026-03-24 | Modo: Re-escaneo Exhaustivo | Stack: Astro 6 + Svelte 5

## Resumen Ejecutivo

Portfolio profesional de Christopher Bobadilla Plasencia, migrado de Flutter Web a un stack web moderno (Astro + Svelte + Firebase). Sitio estático bilingüe (EN/ES) con panel de administración completo para gestión de contenido (proyectos, tecnologías, experiencias laborales, blog).

## Stack Tecnológico

| Categoría | Tecnología | Versión |
|-----------|------------|---------|
| Framework SSG | Astro | ^6.0.5 |
| UI Interactivo | Svelte | ^5.53.12 |
| Lenguaje | TypeScript | ^5.9.3 |
| CSS Framework | Tailwind CSS | ^4.2.1 |
| Backend/BaaS | Firebase (Auth, Firestore, Storage) | ^12.10.0 |
| Admin SDK | firebase-admin | ^13.7.0 |
| Validación | Zod | ^4.3.6 |
| Rich Text Editor | TipTap | ^3.20.4 |
| Drag & Drop | SortableJS | ^1.15.7 |
| Sanitización HTML | sanitize-html | ^2.17.1 |
| Procesamiento Imágenes | Sharp | ^0.34.5 |
| Testing Unitario | Vitest + Testing Library | ^4.1.0 |
| Testing E2E | Playwright | ^1.58.2 |
| Performance CI | Lighthouse CI | 0.15.1 |
| Linting | ESLint + Prettier | ^10.0.3 |
| Package Manager | pnpm | 10 |
| Node.js | >=22.12.0 | |
| CI/CD | GitHub Actions → Firebase Hosting | |

## Tipo de Arquitectura

**Astro Islands** — Páginas estáticas pre-renderizadas (Astro) con "islas" de interactividad (Svelte 5). Los datos se obtienen de Firebase en build-time (Admin SDK) para las páginas públicas, y en client-side (Client SDK) para el panel admin.

- **Output:** Static (SSG) — todo pre-renderizado en build
- **Interactividad:** Svelte 5 con directivas `client:load`, `client:visible`, `client:only`
- **i18n:** Astro built-in — EN como default (sin prefijo), ES con prefijo `/es/`

## Estructura del Repositorio

- **Tipo:** Monolito
- **Partes:** 1 (web)
- **Archivos fuente:** 158

## Módulos Funcionales

### Páginas Públicas (bilingües EN/ES)

| Módulo | Ruta EN | Ruta ES | Descripción |
|--------|---------|---------|-------------|
| Home | `/` | `/es/` | Hero, tecnologías, proyectos destacados, experiencia |
| Proyectos | `/projects` | `/es/projects` | Catálogo con filtro por tecnología |
| Detalle Proyecto | `/projects/[slug]` | `/es/projects/[slug]` | Detalle con galería de screenshots |
| Blog | `/blog` | `/es/blog` | Lista de artículos publicados |
| Artículo Blog | `/blog/[slug]` | `/es/blog/[slug]` | Artículo completo con TipTap HTML |
| Contacto | `/contact` | `/es/contact` | Formulario WhatsApp/Email |

### Panel de Administración (español, protegido)

| Módulo | Ruta | Descripción |
|--------|------|-------------|
| Login | `/admin/login` | Autenticación Firebase |
| Dashboard | `/admin/` | Vista general con conteos |
| Proyectos | `/admin/projects` | CRUD + drag-reorder + featured |
| Tecnologías | `/admin/technologies` | CRUD + drag-reorder |
| Experiencias | `/admin/experiences` | CRUD con fechas |
| Blog | `/admin/blog` | CRUD con editor TipTap + imágenes inline |

## Datos en Firebase

| Colección | Campos Clave | Uso |
|-----------|-------------|-----|
| `Projects` | companyName (bilingüe), slug, mainImage, screenshots[], technologies[], featured, order | Proyectos del portfolio |
| `Technologies` | name, image, experienceYears, order | Stack tecnológico |
| `Experiences` | companyName, jobName (bilingüe), responsibilities (bilingüe), startDate, endDate | Experiencia laboral |
| `BlogPosts` | title (bilingüe), content (bilingüe TipTap JSON), slug, coverImage, status, images[] | Artículos de blog |

## Características Destacadas

- **Bilingüe completo:** Todas las páginas públicas en EN y ES con toggle de idioma
- **Tema dark/light:** Dark por defecto, toggle persistente, sin FOUC
- **SEO optimizado:** hreflang, OG tags, Lighthouse CI ≥0.95
- **Accesibilidad:** Skip navigation, focus traps, WCAG AA contraste
- **Image management:** Upload con retry/cancel, slot state machine, orphan cleanup
- **Testing integral:** ~500+ assertions (unit + E2E), factories para datos
- **CI/CD completo:** Lint → Type-check → Tests (con emuladores) → Build → Lighthouse → Deploy
- **Smart CI:** Detecta cambios solo en docs/config y salta build/deploy innecesarios
