# Visión General del Proyecto - Portfolio ChrisBP

> Generado: 2026-03-15 | Modo: Escaneo Exhaustivo | Versión: 1.0.0+1

## Resumen Ejecutivo

Portfolio profesional de Christopher Bobadilla Plasencia construido con Flutter, diseñado como una aplicación multiplataforma (Web como objetivo principal) que muestra proyectos, tecnologías, experiencia laboral e información de contacto. Incluye un panel de administración protegido por autenticación Firebase para gestión de contenido CRUD.

## Información del Proyecto

| Propiedad | Valor |
|---|---|
| **Nombre** | portfolio |
| **Versión** | 1.0.0+1 |
| **Tipo** | Aplicación móvil/web (Flutter) |
| **Repositorio** | Monolito |
| **Lenguaje** | Dart (SDK ^3.5.4) |
| **Framework** | Flutter 3.27.1+ |
| **Arquitectura** | Clean Architecture (Data/Domain/Presentation) |
| **Estado** | Riverpod con generadores |
| **Backend** | Firebase (Auth, Firestore, Storage) |
| **Plataformas** | Web (principal), Android, iOS, macOS, Windows, Linux |

## Stack Tecnológico

| Categoría | Tecnología | Versión | Justificación |
|---|---|---|---|
| **Framework** | Flutter | 3.27.1+ | Framework multiplataforma con un solo codebase |
| **Lenguaje** | Dart | ^3.5.4 | Lenguaje nativo de Flutter |
| **Estado** | Riverpod + Generadores | ^2.6.1 | Gestión de estado reactiva y type-safe |
| **Routing** | GoRouter | ^14.4.1 | Routing declarativo con soporte web (path strategy) |
| **Backend** | Firebase Core | ^3.7.0 | BaaS para auth, base de datos y almacenamiento |
| **Auth** | Firebase Auth | ^5.3.2 | Autenticación email/password para admin |
| **Base de datos** | Cloud Firestore | ^5.4.4 | Base de datos NoSQL en tiempo real |
| **Almacenamiento** | Firebase Storage | ^12.3.5 | Almacenamiento de imágenes de proyectos y tecnologías |
| **Serialización** | Freezed + JSON Serializable | ^2.5.7 / ^6.8.0 | Modelos inmutables con generación de código |
| **Generación** | Build Runner | ^2.4.13 | Motor de generación de código |
| **Tipografía** | Google Fonts (Poppins) | ^6.2.1 | Fuente principal del diseño |
| **Iconos** | Font Awesome | ^10.8.0 | Iconos para redes sociales y UI |
| **Imágenes** | Cached Network Image | ^3.4.1 | Carga eficiente de imágenes con caché |
| **SEO** | Meta SEO | ^3.0.9 | Optimización SEO para web |
| **URLs** | URL Launcher + Mailto + WhatsApp UniLink | ^6.3.1 | Lanzamiento de enlaces externos |
| **Localización** | Intl + Flutter Localizations | ^0.19.0 | Soporte i18n (EN/ES) |
| **Linting** | Very Good Analysis | ^6.0.0 | Reglas de análisis estrictas |
| **Testing** | Mocktail | ^1.0.4 | Mocking para tests unitarios |

## Patrón Arquitectónico

**Clean Architecture por features** con separación en tres capas:

- **Domain**: Entidades (Freezed), repositorios abstractos, contratos
- **Data**: Implementaciones Firebase/Fake, servicios (Firestore, Storage)
- **Presentation**: Controllers (Riverpod), páginas, componentes, widgets

Cada feature module sigue esta estructura, permitiendo intercambiar implementaciones (Firebase ↔ Fake) para testing y desarrollo offline.

## Módulos de Features

| Feature | Descripción | Capas |
|---|---|---|
| **auth** | Autenticación admin (Firebase Auth email/password) | Data + Domain + Presentation |
| **contact** | Formulario de contacto (WhatsApp/Email) | Data + Domain + Presentation |
| **experience** | Experiencia laboral (actualmente datos fake) | Data + Domain + Presentation |
| **home** | Página principal agregadora (About, Tech, Projects, Experience) | Presentation |
| **projects** | Catálogo de proyectos con filtros, imágenes, admin CRUD | Data + Domain + Presentation |
| **settings** | Tema y localización (dark/light, EN/ES) | Data + Domain + Presentation |
| **social_launcher** | Lanzamiento de redes sociales (TikTok, GitHub, LinkedIn) | Data + Domain + Presentation |
| **technologies** | Tecnologías/skills con admin CRUD | Data + Domain + Presentation |

## Datos de Negocio

| Dato | Valor |
|---|---|
| **Propietario** | Christopher Bobadilla Plasencia |
| **Email** | criszx17dev@icloud.com |
| **Ubicación** | Naples, Florida |
| **Redes** | GitHub, LinkedIn, TikTok |
| **Idiomas UI** | Inglés, Español |
| **Firebase Project** | portfolio-chrisbp |
