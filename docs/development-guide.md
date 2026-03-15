# Guía de Desarrollo

> Generado: 2026-03-15 | Escaneo Exhaustivo

## Prerrequisitos

| Herramienta | Versión | Propósito |
|---|---|---|
| **Flutter SDK** | 3.27.1+ | Framework principal |
| **Dart SDK** | ^3.5.4 | Lenguaje de programación |
| **Firebase CLI** | Última | Despliegue y emuladores |
| **Git** | Última | Control de versiones |
| **IDE** | VS Code / Android Studio / IntelliJ | Desarrollo (con plugins Flutter/Dart) |

## Instalación y Setup

### 1. Clonar el repositorio

```bash
git clone <repository-url>
cd portfolio
```

### 2. Instalar dependencias

```bash
flutter pub get
```

### 3. Generar código (Freezed, Riverpod, JSON Serializable)

```bash
dart run build_runner build --delete-conflicting-outputs
```

### 4. Configurar Firebase (si es necesario)

El proyecto ya tiene `firebase_options.dart` configurado para el proyecto `portfolio-chrisbp`. Si necesitas tu propia instancia:

```bash
firebase login
flutterfire configure
```

## Comandos de Desarrollo

### Ejecutar la app

```bash
# Web (plataforma principal)
flutter run -d chrome

# Android
flutter run -d android

# iOS (requiere macOS + Xcode)
flutter run -d ios

# macOS
flutter run -d macos

# Windows
flutter run -d windows

# Linux
flutter run -d linux
```

### Generación de código

```bash
# Generar una vez
dart run build_runner build --delete-conflicting-outputs

# Watch mode (regenera automáticamente al guardar)
dart run build_runner watch --delete-conflicting-outputs
```

### Localización

Los archivos ARB se generan automáticamente gracias a `generate: true` en `pubspec.yaml`. Al modificar `lib/src/localization/arb/app_en.arb` o `app_es.arb`, Flutter regenera las clases de localización.

### Linting

```bash
# Análisis estático
flutter analyze

# Formato de código
dart format .
```

### Testing

```bash
# Ejecutar todos los tests
flutter test

# Test con cobertura
flutter test --coverage
```

### Assets

```bash
# Regenerar iconos de lanzamiento
dart run flutter_launcher_icons

# Regenerar splash screen
dart run flutter_native_splash:create
```

## Build para Producción

### Web (principal)

```bash
flutter build web --release
```

Output en `build/web/`

### Android

```bash
flutter build apk --release
# o
flutter build appbundle --release
```

### iOS

```bash
flutter build ios --release
```

## Despliegue (Firebase Hosting)

```bash
# Build web
flutter build web --release

# Desplegar
firebase deploy --only hosting
```

Firebase Hosting está configurado en `firebase.json`:
- Directorio público: `build/web/`
- SPA rewrite: todas las rutas → `/index.html`
- Proyecto: `portfolio-chrisbp`

## Estructura de Archivos por Feature

Al crear un nuevo feature, seguir esta estructura:

```
lib/src/features/nuevo_feature/
├── data/
│   ├── services/                    # Servicios Firebase (opcional)
│   │   └── firebase_xxx_service.dart
│   ├── firebase_xxx_repository_imp.dart  # Implementación Firebase
│   └── fake_xxx_repository_imp.dart      # Implementación Fake (testing)
├── domain/
│   ├── xxx.dart                     # Modelo Freezed
│   └── xxx_repository.dart          # Repositorio abstracto + Providers
└── presentation/
    ├── xxx_controller.dart          # Controller Riverpod
    ├── xxx_page.dart                # Página principal
    ├── components/                  # Componentes de la página
    │   └── xxx_component.dart
    ├── widgets/                     # Widgets específicos
    │   └── xxx_widget.dart
    └── admin/                       # CRUD admin (opcional)
        ├── admin_xxx_list_page.dart
        ├── admin_xxx_page.dart
        └── controllers/
            ├── admin_create_xxx_controller.dart
            ├── admin_update_xxx_controller.dart
            └── admin_delete_xxx_controller.dart
```

## Convenciones de Código

### Nombrado

- **Archivos**: `snake_case.dart`
- **Clases**: `PascalCase`
- **Variables/funciones**: `camelCase`
- **Constantes globales**: `kNombreConstante` (prefijo `k`)
- **Providers**: `nombreProvider` (sufijo `Provider`)
- **Controllers**: `NombreController` (sufijo `Controller`)

### Modelos

- Usar `@freezed` para modelos inmutables
- Campos bilingües: `fieldNameEn` / `fieldNameEs`
- Extensions para selección por locale: `model.localizedField(locale)`

### Estado

- Usar Riverpod generators (`@riverpod`) para providers
- `StreamProvider` para datos en tiempo real
- `AsyncNotifierProvider` para operaciones con estado
- `keepAlive: true` para datos que persisten en toda la app

### Widgets

- `ConsumerWidget` / `ConsumerStatefulWidget` para widgets con Riverpod
- `context.l10n.key` para strings localizados
- Usar `ResponsiveWidget` para layouts por breakpoint
- Usar `AsyncValueWidget` para manejar estados async

## Variables de Entorno

No se usa archivo `.env`. La configuración Firebase está embebida en `firebase_options.dart` (generado por FlutterFire CLI).

## Dependencias de Desarrollo Clave

| Paquete | Versión | Propósito |
|---|---|---|
| `build_runner` | ^2.4.13 | Motor de generación de código |
| `freezed` | ^2.5.7 | Generador de modelos inmutables |
| `json_serializable` | ^6.8.0 | Generador de serialización JSON |
| `riverpod_generator` | ^2.6.2 | Generador de providers Riverpod |
| `very_good_analysis` | ^6.0.0 | Reglas de linting estrictas |
| `custom_lint` | ^0.7.0 | Reglas de lint personalizadas |
| `mocktail` | ^1.0.4 | Mocking para tests |
| `flutter_launcher_icons` | ^0.14.1 | Generador de iconos |
| `flutter_native_splash` | ^2.4.2 | Generador de splash screen |
