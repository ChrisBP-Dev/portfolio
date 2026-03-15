# Análisis del Árbol de Código Fuente

> Generado: 2026-03-15 | Escaneo Exhaustivo

## Estructura del Proyecto

```
portfolio/
├── lib/                              # Código fuente Dart principal
│   ├── main.dart                     # 🚀 Punto de entrada: Firebase init + ProviderScope
│   ├── firebase_options.dart         # Configuración Firebase por plataforma
│   └── src/
│       ├── app.dart                  # MaterialApp.router con tema y localización
│       ├── core/                     # Código compartido (widgets, utils, constantes)
│       │   ├── common_components/    # Componentes de layout reutilizables
│       │   │   ├── admin/            # Panel de administración
│       │   │   │   ├── admin_drawer.dart         # Sidebar admin con menú
│       │   │   │   ├── admin_wrap_list.dart       # Layout lista admin
│       │   │   │   └── widgets/
│       │   │   │       └── admin_menu_item.dart   # Item del menú admin
│       │   │   ├── footer/
│       │   │   │   └── footer_component.dart      # Footer con contacto y redes
│       │   │   ├── header/
│       │   │   │   ├── header_component.dart      # 🔗 Header principal con navegación
│       │   │   │   ├── header_logo.dart           # Logo responsive
│       │   │   │   ├── custom_menu_item.dart      # Item menú desktop
│       │   │   │   ├── mobile_menu_item.dart      # Item menú mobile
│       │   │   │   ├── animated_menu_container.dart # Menú mobile animado
│       │   │   │   └── header_menu_controller.dart # Estado menú mobile (Riverpod)
│       │   │   └── full_page_container.dart        # 🔗 Wrapper principal de páginas
│       │   ├── common_widgets/       # 20+ widgets reutilizables
│       │   │   ├── async_value_widget.dart        # Wrapper AsyncValue (Riverpod)
│       │   │   ├── responsive_center.dart         # Centrado responsive con max-width
│       │   │   ├── responsive_widget.dart         # Selector mobile/tablet/desktop
│       │   │   ├── wrapper_scroll.dart            # Layout scroll principal
│       │   │   ├── primary_button.dart            # Botón primario
│       │   │   ├── secondary_button.dart          # Botón secundario
│       │   │   ├── social_button.dart             # Botón redes sociales
│       │   │   ├── business_logo.dart             # Logo con navegación
│       │   │   ├── business_chip_text.dart        # Chip de tecnología/skill
│       │   │   ├── shader_text_effect.dart        # Texto con gradiente
│       │   │   ├── custom_text_form_field.dart    # Campo de formulario estilizado
│       │   │   ├── custom_title_on_component.dart # Título con gradiente temático
│       │   │   ├── wrap_network_image.dart        # Imagen de red con caché
│       │   │   ├── image_memory_picked.dart       # Selector/picker de imágenes
│       │   │   ├── admin_dialog.dart              # Diálogo CRUD admin
│       │   │   ├── alert_dialogs.dart             # Diálogos multiplataforma
│       │   │   ├── initial_banner.dart            # Banner de bienvenida
│       │   │   ├── technology_icon.dart           # Icono de tecnología
│       │   │   ├── error_message_widget.dart      # Mensaje de error
│       │   │   ├── empty_placeholder_widget.dart  # Placeholder vacío + Go Home
│       │   │   └── title_form_field.dart          # Título de sección de formulario
│       │   ├── constants/            # Constantes de la aplicación
│       │   │   ├── app_sizes.dart                 # Espaciado: gaps y paddings
│       │   │   ├── breakpoints.dart               # Breakpoints: 450/600/900
│       │   │   ├── assets.dart                    # Rutas de assets (logos)
│       │   │   ├── business_information.dart      # Datos de negocio (contacto, redes)
│       │   │   ├── experiences.dart               # Datos hardcoded de experiencias
│       │   │   ├── projects.dart                  # Datos hardcoded de proyectos
│       │   │   └── technologies.dart              # Datos hardcoded de tecnologías
│       │   └── utils/                # Utilidades
│       │       ├── async_value_ui.dart            # Extension AsyncValue para errores
│       │       ├── bool_extensions.dart           # Extension funcional para bool
│       │       ├── resize_extensions.dart         # Escalado responsive de tamaños
│       │       ├── string_extensions.dart         # Validación y conversión de strings
│       │       ├── unit8list_extension.dart        # Utilidades para bytes de imagen
│       │       └── theme/
│       │           ├── color_app.dart             # Paleta de colores (light/dark)
│       │           ├── text_theme.dart            # Tipografía responsive (Poppins)
│       │           ├── theme_app.dart             # ThemeData factory (Riverpod)
│       │           └── theme_extension.dart       # Extension BuildContext para tema
│       ├── features/                 # Módulos de features (Clean Architecture)
│       │   ├── auth/                 # 🔐 Autenticación
│       │   │   ├── data/             # Firebase Auth service + repository impl
│       │   │   ├── domain/           # Admin model (Freezed) + AuthRepository
│       │   │   └── presentation/     # SignIn/SignOut alerts + controller
│       │   ├── contact/              # 📧 Formulario de contacto
│       │   │   ├── data/             # ContactRepository (WhatsApp/Email)
│       │   │   ├── domain/           # ContactMessage + ContactPhoneNumber
│       │   │   └── presentation/     # ContactPage + form components
│       │   ├── experience/           # 💼 Experiencia laboral
│       │   │   ├── data/             # Firebase + Fake repository
│       │   │   ├── domain/           # Experience model + repository
│       │   │   └── presentation/     # ExperiencePage + admin
│       │   ├── home/                 # 🏠 Página principal
│       │   │   └── presentation/     # HomePage + componentes agregados
│       │   │       └── components/
│       │   │           ├── about_me/   # Avatar, texto, botones "about"
│       │   │           ├── experience/ # Lista de experiencias en home
│       │   │           ├── projects/   # Proyectos destacados en home
│       │   │           └── technologies/ # Tecnologías en home
│       │   ├── projects/             # 📁 Catálogo de proyectos
│       │   │   ├── data/             # Firebase repos + Firestore/Storage services
│       │   │   ├── domain/           # Project + ImageAndPath + repositories
│       │   │   └── presentation/     # ProjectsPage + admin CRUD + ImageViewer
│       │   ├── settings/             # ⚙️ Configuración
│       │   │   ├── data/             # SettingsRepository (stubs)
│       │   │   ├── domain/           # Settings model
│       │   │   └── presentation/     # Theme/Locale controllers + switch widgets
│       │   ├── social_launcher/      # 🔗 Redes sociales
│       │   │   ├── data/             # URL launcher implementations
│       │   │   ├── domain/           # SocialLauncher + UrlLauncher repositories
│       │   │   └── presentation/     # SocialButtons + controller
│       │   └── technologies/         # 🛠️ Tecnologías/Skills
│       │       ├── data/             # Firebase + Fake + admin repositories
│       │       ├── domain/           # Technology model + repositories
│       │       └── presentation/     # Admin CRUD pages + controllers
│       ├── localization/             # 🌐 Internacionalización
│       │   ├── arb/
│       │   │   ├── app_en.arb        # Traducciones inglés (template)
│       │   │   └── app_es.arb        # Traducciones español
│       │   ├── app_localization_provider.dart  # Provider de localización
│       │   ├── l10n.dart             # Extension BuildContext.l10n
│       │   └── string_hardcoded.dart # Extension para strings hardcoded
│       └── routing/                  # 🧭 Navegación
│           ├── app_router.dart       # 🔗 GoRouter config + ShellRoute
│           ├── app_route.dart        # Rutas públicas (home, projects, contact, etc.)
│           ├── admin_app_route.dart  # Rutas admin (technologies, projects, experiences)
│           ├── go_router_refresh_stream.dart # Auth state listener para router
│           └── not_found_page.dart   # Página 404
├── assets/                           # Assets estáticos
│   ├── icon/
│   │   └── chrisbp-icon.png          # Icono de la app
│   └── logo/
│       ├── background-chrisbp.png    # Fondo splash screen
│       ├── cbp-short-logo-dark.png   # Logo corto (dark)
│       └── cbp-large-logo-dark.png   # Logo largo (dark)
├── web/                              # Plataforma Web
│   └── index.html                    # Entry point web con splash CSS
├── android/                          # Plataforma Android (com.chrisbp.portfolio)
├── ios/                              # Plataforma iOS
├── macos/                            # Plataforma macOS
├── windows/                          # Plataforma Windows
├── linux/                            # Plataforma Linux
├── test/
│   └── widget_test.dart              # Test placeholder (necesita actualización)
├── pubspec.yaml                      # Dependencias y configuración Flutter
├── pubspec.lock                      # Versiones bloqueadas
├── firebase.json                     # Config Firebase Hosting (build/web/)
├── .firebaserc                       # Proyecto: portfolio-chrisbp
├── analysis_options.yaml             # Very Good Analysis + custom lint
├── l10n.yaml                         # Configuración de localización ARB
└── flutter_native_splash.yaml        # Splash screen (solo web)
```

## Directorios Críticos

| Directorio | Propósito | Archivos Dart |
|---|---|---|
| `lib/src/core/` | Código compartido entre features | ~45 |
| `lib/src/features/` | Módulos de negocio (Clean Architecture) | ~140 |
| `lib/src/routing/` | Configuración de navegación | 5 |
| `lib/src/localization/` | i18n (EN/ES) | 4 + 2 ARB |
| **Total lib/** | | **~206** |

## Puntos de Entrada

| Archivo | Rol |
|---|---|
| `lib/main.dart` | Inicialización Firebase + ProviderScope + runApp |
| `lib/src/app.dart` | MaterialApp.router con GoRouter, tema y localización |
| `web/index.html` | Entry point web con splash screen CSS |
