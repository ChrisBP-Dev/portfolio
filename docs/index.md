# Índice de Documentación del Proyecto — Portfolio ChrisBP

> Generado: 2026-03-26 | Modo: Re-escaneo Exhaustivo | v3.0.0

## Información del Proyecto

- **Tipo:** Monolito (Web — SSG)
- **Lenguaje Principal:** TypeScript (^5.9.3)
- **Framework:** Astro 6 + Svelte 5
- **Estilos:** Tailwind CSS 4
- **Arquitectura:** Astro Islands (páginas estáticas + islas Svelte interactivas)
- **Backend:** Firebase (Auth, Firestore, Storage)
- **Output:** Static (pre-renderizado)
- **Plataforma:** Web

## Referencia Rápida

- **Stack:** Astro 6 + Svelte 5 + Tailwind CSS 4 + TypeScript + Firebase + Zod 4
- **Punto de entrada:** `src/pages/index.astro`
- **Patrón arquitectónico:** Astro Islands — SSG con islas de interactividad Svelte
- **Idiomas UI:** Inglés (default, sin prefijo), Español (prefijo `/es/`)
- **Proyecto Firebase:** portfolio-chrisbp
- **Node.js:** >=22.12.0 | **Package Manager:** pnpm 10

## Documentación Generada

- [Visión General del Proyecto](./project-overview.md) — Resumen ejecutivo, stack tecnológico, módulos funcionales
- [Arquitectura](./architecture.md) — Patrón Islands, capas, estado, datos, routing, auth, testing, CI/CD
- [Árbol de Código Fuente](./source-tree-analysis.md) — Estructura de directorios anotada (~160 archivos)
- [Inventario de Componentes](./component-inventory.md) — 52 componentes categorizados (18 Astro + 32 Svelte + 2 Layouts)
- [Modelos de Datos](./data-models.md) — Esquemas Zod, colecciones Firestore, relaciones, reglas de seguridad
- [Guía de Desarrollo](./development-guide.md) — Setup, comandos, convenciones, testing
- [Guía de Despliegue](./deployment-guide.md) — Firebase Hosting, CI/CD pipeline, Lighthouse CI, secrets

## Documentación Existente

- [README.md](../README.md) — Introducción al proyecto, features, setup básico

## Inicio Rápido

### Para desarrollo

```bash
git clone <repository-url>
cd portfolio
pnpm install
cp .env.example .env  # Configurar credenciales Firebase

# Terminal 1: Emuladores Firebase
pnpm emulators

# Terminal 2: Servidor de desarrollo
pnpm dev
```

### Para build y preview

```bash
pnpm build
pnpm preview
```

### Para testing

```bash
pnpm test              # Unit tests (Vitest)
pnpm test:e2e          # E2E tests (Playwright)
pnpm test:coverage     # Coverage report
```

## Módulos de Features

### Páginas Públicas (bilingües EN/ES)

| Feature | Ruta EN | Ruta ES | Descripción |
|---------|---------|---------|-------------|
| **Home** | `/` | `/es/` | Hero, tecnologías, proyectos destacados, experiencia |
| **Projects** | `/projects` | `/es/projects` | Catálogo con filtro por tecnología |
| **Project Detail** | `/projects/[slug]` | `/es/projects/[slug]` | Detalle con galería de screenshots |
| **Blog** | `/blog` | `/es/blog` | Lista de artículos publicados |
| **Blog Article** | `/blog/[slug]` | `/es/blog/[slug]` | Artículo con TipTap HTML renderizado |
| **Contact** | `/contact` | `/es/contact` | Formulario WhatsApp/Email |

### Panel de Administración (español, protegido)

| Feature | Ruta | Descripción |
|---------|------|-------------|
| **Login** | `/admin/login` | Autenticación Firebase |
| **Dashboard** | `/admin/` | Conteos de colecciones |
| **Projects** | `/admin/projects` | CRUD + drag-reorder + featured |
| **Technologies** | `/admin/technologies` | CRUD + drag-reorder |
| **Experiences** | `/admin/experiences` | CRUD con fechas |
| **Blog** | `/admin/blog` | CRUD con TipTap editor + imágenes inline |

## Uso con IA

Este índice es el punto de entrada principal para herramientas de IA. Para:

- **PRD Brownfield**: Proporcionar este `index.md` como contexto del proyecto existente
- **Features UI**: Consultar `architecture.md` + `component-inventory.md`
- **Features de datos**: Consultar `architecture.md` + `data-models.md`
- **Setup nuevo dev**: Consultar `development-guide.md`
- **Despliegue**: Consultar `deployment-guide.md`
- **Entender estructura**: Consultar `source-tree-analysis.md`
