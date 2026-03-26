# Vision General del Proyecto — Portfolio ChrisBP

> Generado: 2026-03-26 | Modo: Re-escaneo Exhaustivo | v3.0.0

## Descripcion

Portfolio web profesional bilingue (Ingles/Espanol) para Christopher Bobadilla Plasencia. Sitio estatico pre-renderizado con panel de administracion para gestion de contenido. Migrado desde Flutter Web a Astro + Svelte como parte del proyecto open-source.

**URL Produccion:** https://portfolio-chrisbp.web.app
**Repositorio:** GitHub (open-source, licencia MIT)
**Proyecto Firebase:** portfolio-chrisbp

## Stack Tecnologico

| Categoria | Tecnologia | Version |
|-----------|-----------|---------|
| Framework SSG | Astro | ^6.0.5 |
| Componentes UI | Svelte | ^5.53.12 |
| Estilos | Tailwind CSS | ^4.2.1 |
| Lenguaje | TypeScript | ^5.9.3 |
| Validacion | Zod | ^4.3.6 |
| Backend | Firebase (Auth, Firestore, Storage) | ^12.10.0 |
| Rich Text | TipTap | ^3.20.4 |
| Drag & Drop | SortableJS | ^1.15.7 |
| Procesamiento Imagenes | Sharp | ^0.34.5 |
| Testing Unit | Vitest | ^4.1.0 |
| Testing E2E | Playwright | ^1.58.2 |
| Testing a11y | @axe-core/playwright | ^4.11.1 |
| Performance | Lighthouse CI | 0.15.1 |
| Lint | ESLint | ^10.0.3 |
| Formato | Prettier | ^3.8.1 |
| CI/CD | GitHub Actions | — |
| Hosting | Firebase Hosting | — |
| Package Manager | pnpm | 10 |
| Node.js | — | >=22.12.0 |

## Arquitectura

- **Tipo:** Monolito (SSG con islas de interactividad)
- **Patron:** Astro Islands — paginas estaticas + componentes Svelte hidratados
- **Output:** HTML/CSS/JS estatico pre-renderizado
- **i18n:** Ingles (default, sin prefijo URL) / Espanol (prefijo /es/)

## Modulos Funcionales

### Sitio Publico (bilingue EN/ES)
- **Home** — Hero, tecnologias, proyectos destacados, timeline de experiencia
- **Proyectos** — Catalogo con filtro por tecnologia, detalle con galeria
- **Blog** — Listado de articulos, detalle con contenido TipTap renderizado
- **Contacto** — Formulario con validacion Zod (WhatsApp/Email)

### Panel de Administracion (protegido)
- **Dashboard** — Conteos de colecciones Firestore
- **Proyectos** — CRUD completo + drag-reorder + featured + screenshots
- **Tecnologias** — CRUD + drag-reorder
- **Experiencias** — CRUD con fechas y validacion
- **Blog** — CRUD con editor TipTap + imagenes inline + status (published/draft)

### Infraestructura
- **CI/CD** — GitHub Actions con deteccion inteligente de cambios
- **Testing** — 44 unit tests + 20 E2E specs + Lighthouse CI
- **Deploy** — Firebase Hosting con CDN y caching inmutable

## Metricas del Proyecto

| Metrica | Valor |
|---------|-------|
| Archivos fuente | ~160 |
| Componentes Astro | 18 |
| Componentes Svelte | 32 |
| Paginas/Rutas | 18 |
| Colecciones Firestore | 4 |
| Esquemas Zod | 6 |
| Tests unitarios | 44 archivos |
| Tests E2E | 20 specs |
| Claves de traduccion | 200+ |
| Idiomas UI | 2 (EN, ES) |

## Enlaces a Documentacion Detallada

- [Arquitectura](./architecture.md) — Patron Islands, capas, estado, datos, routing, auth, testing
- [Arbol de Codigo Fuente](./source-tree-analysis.md) — Estructura de directorios anotada
- [Inventario de Componentes](./component-inventory.md) — 50 componentes categorizados
- [Modelos de Datos](./data-models.md) — Esquemas Zod, colecciones Firestore
- [Guia de Desarrollo](./development-guide.md) — Setup, comandos, convenciones, testing
- [Guia de Despliegue](./deployment-guide.md) — Firebase Hosting, CI/CD pipeline
