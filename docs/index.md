# Índice de Documentación del Proyecto - Portfolio ChrisBP

> Generado: 2026-03-15 | Modo: Escaneo Exhaustivo Inicial | v1.0.0+1

## Información del Proyecto

- **Tipo:** Monolito (Flutter multiplataforma)
- **Lenguaje Principal:** Dart (SDK ^3.5.4)
- **Framework:** Flutter 3.27.1+
- **Arquitectura:** Clean Architecture (Data/Domain/Presentation) por features
- **Estado:** Riverpod con generadores
- **Backend:** Firebase (Auth, Firestore, Storage)
- **Plataformas:** Web (principal), Android, iOS, macOS, Windows, Linux

## Referencia Rápida

- **Stack:** Flutter + Dart + Firebase + Riverpod + GoRouter + Freezed
- **Punto de entrada:** `lib/main.dart`
- **Patrón arquitectónico:** Clean Architecture por features con repositorios intercambiables
- **Idiomas UI:** Inglés, Español
- **Proyecto Firebase:** portfolio-chrisbp

## Documentación Generada

- [Visión General del Proyecto](./project-overview.md) — Resumen ejecutivo, stack tecnológico, módulos
- [Arquitectura](./architecture.md) — Patrones, estado, datos, navegación, temas, auth
- [Árbol de Código Fuente](./source-tree-analysis.md) — Estructura de directorios anotada
- [Inventario de Componentes](./component-inventory.md) — 73+ widgets y componentes categorizados
- [Modelos de Datos](./data-models.md) — Entidades Freezed, colecciones Firestore, repositorios
- [Guía de Desarrollo](./development-guide.md) — Setup, comandos, convenciones, estructura de features
- [Guía de Despliegue](./deployment-guide.md) — Firebase Hosting, Storage, configuración CI/CD

## Documentación Existente

- [README.md](../README.md) — Introducción al proyecto, features, tecnologías, setup básico, contacto

## Inicio Rápido

### Para desarrollo

```bash
git clone <repository-url>
cd portfolio
flutter pub get
dart run build_runner build --delete-conflicting-outputs
flutter run -d chrome
```

### Para despliegue web

```bash
flutter build web --release
firebase deploy --only hosting
```

## Módulos de Features

| Feature | Ruta | Descripción |
|---|---|---|
| **Home** | `/` | Página principal: About, Technologies, Projects, Experience |
| **Projects** | `/projects` | Catálogo con filtros, imágenes, tecnologías |
| **Contact** | `/contact` | Formulario WhatsApp/Email |
| **Experience** | `/experience` | Experiencia laboral |
| **Admin** | `/admin/*` | CRUD de Technologies, Projects, Experiences (auth requerida) |

## Uso con IA

Este índice es el punto de entrada principal para herramientas de IA. Para:

- **PRD Brownfield**: Proporcionar este `index.md` como contexto del proyecto existente
- **Features UI**: Consultar `architecture.md` + `component-inventory.md`
- **Features de datos**: Consultar `architecture.md` + `data-models.md`
- **Setup nuevo dev**: Consultar `development-guide.md`
- **Despliegue**: Consultar `deployment-guide.md`
