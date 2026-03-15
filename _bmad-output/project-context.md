---
project_name: 'portfolio'
user_name: 'Christopher'
date: '2026-03-15'
sections_completed: ['technology_stack', 'language_rules', 'framework_rules', 'testing_rules', 'code_quality', 'workflow_rules', 'critical_rules']
status: 'complete'
rule_count: 35
optimized_for_llm: true
---

# Project Context for AI Agents

_This file contains critical rules and patterns that AI agents must follow when implementing code in this project. Focus on unobvious details that agents might otherwise miss._

---

## Technology Stack & Versions

### Core
- **Flutter** 3.27.1+ / **Dart SDK** ^3.5.4
- Plataforma principal: Web (soporta Android, iOS, macOS, Windows, Linux)

### Backend
- Firebase Core ^3.7.0 | Auth ^5.3.2 | Firestore ^5.4.4 | Storage ^12.3.5
- Proyecto: `portfolio-chrisbp`

### State Management & Data
- Riverpod ^2.6.1 + Riverpod Generator ^2.6.2 (usar @riverpod annotations)
- Freezed ^2.5.7 + JSON Serializable ^6.8.0 (modelos inmutables con code gen)
- Build Runner ^2.4.13 (orquestador de generación de código)

### Navegación
- GoRouter ^14.4.1 (rutas declarativas basadas en URL, sin hash routing)

### UI
- Google Fonts ^6.2.1 (Poppins) | Font Awesome ^10.8.0
- Cached Network Image ^3.4.1 | Flutter Native Splash ^2.4.2
- Meta SEO ^3.0.9

### i18n
- Intl ^0.19.0 | Locales: en, es | ARB format con auto-generación

### Calidad & Testing
- Very Good Analysis ^6.0.0 (linting estricto)
- Custom Lint ^0.7.0
- Mocktail ^1.0.4

## Critical Implementation Rules

### Reglas Específicas de Dart

- **Code Generation**: Ejecutar `dart run build_runner build --delete-conflicting-outputs` después de modificar modelos Freezed o providers @riverpod. NUNCA editar archivos `.g.dart` o `.freezed.dart`
- **Linting**: Very Good Analysis ^6.0.0 como base. No se requieren docstrings públicos (`public_member_api_docs: false`)
- **Imports**: Relativos dentro del mismo feature, `package:` para cross-feature. Sin barrel exports
- **Null Safety**: Usar extensiones `isNullOrEmpty` / `isNotNullAndNotEmpty` de `StringX` en lugar de checks manuales
- **Async en Controllers**: Siempre `state = const AsyncLoading()` → `state = await AsyncValue.guard(() => ...)`. Nunca try/catch manual en controllers Riverpod
- **Tipos generados**: `flutter gen-l10n` o `flutter pub get` regenera localizaciones. `build_runner` regenera Freezed y Riverpod

### Reglas Específicas del Framework

#### Clean Architecture por Feature
- Estructura obligatoria: `features/{nombre}/domain/`, `data/`, `presentation/`
- Domain contiene: entidad Freezed, repositorio abstracto, providers Riverpod
- Data contiene: implementación Firebase + implementación Fake
- Presentation contiene: Controller (@riverpod class) + Pages + Components

#### Riverpod
- SIEMPRE usar `@riverpod` annotations (nunca crear providers manualmente)
- `@riverpod class extends _$Name` para AsyncNotifier con operaciones mutables
- `@riverpod` función para providers de solo lectura (streams, futures, singletons)
- `keepAlive: true` solo para: auth state, streams principales de datos
- Providers de repositorio se declaran en `domain/`, no en `data/`

#### Firebase
- `FirestoreService<T>` genérico para todas las operaciones CRUD de Firestore
- Admin CRUD: 3 controllers separados (Create, Update, Delete) — nunca un solo controller
- `ImageAndPath` para imágenes: gestiona estado local (File) vs remoto (URL de Storage)

#### UI & Responsive
- Breakpoints: 450px (mobile), 600px (tablet), 900px (desktop)
- Preferir `ConsumerWidget` sobre `ConsumerStatefulWidget`
- Usar `AsyncValueWidget` para renderizar estados de AsyncValue (loading/error/data)
- Usar `FullPageContainer` como wrapper de páginas principales
- Extensión `ResizeX.sizeScaled(screenWidth)` para valores responsivos

### Reglas de Testing

- **Fake Repositories**: Usar implementaciones Fake existentes (`FakeProjectsRepositoryImp`, etc.) para tests sin Firebase. NO crear mocks con mocktail cuando ya existe un Fake
- **Organización**: Tests en `test/` espejando la estructura de `lib/src/`. Archivos con sufijo `_test.dart`
- **Riverpod en Tests**: Usar `ProviderContainer` con overrides para inyectar Fake repos
- **Widget Tests**: Envolver widgets en `ProviderScope` con overrides necesarios. Usar `pumpWidget` + `pumpAndSettle`
- **Controllers**: Testear que `state` transiciona correctamente: `AsyncLoading` → `AsyncData` o `AsyncError`
- **Comandos**: `flutter test` (todos), `flutter test --coverage` (con cobertura), `flutter test test/path_test.dart` (individual)

### Reglas de Calidad de Código & Estilo

#### Naming
- Archivos: `snake_case.dart` | Clases: `PascalCase` | Variables: `camelCase`
- Sufijos obligatorios: `*Controller`, `*Repository`, `*RepositoryImp`, `*Service`, `*Page`, `*Widget`, `*Component`
- Constantes globales: prefijo `k` (ej: `kDefaultPadding`)
- Campos bilingües en modelos de datos: `fieldNameEn` / `fieldNameEs`

#### Estructura de Archivos
- `lib/src/core/` — compartido: common_components, common_widgets, constants, utils, theme
- `lib/src/features/{nombre}/` — domain/, data/, presentation/
- `lib/src/localization/arb/` — archivos ARB (app_en.arb, app_es.arb)
- `lib/src/routing/` — configuración GoRouter y rutas

#### Internacionalización
- Strings de UI: SIEMPRE en archivos ARB, acceder via `context.l10n.keyName`
- Datos de modelos: campos duplicados En/Es con extensión `.localized(languageCode)`
- Agregar strings en AMBOS archivos ARB (app_en.arb Y app_es.arb) simultáneamente
- Template base: `app_en.arb` — mantener las descripciones (@keyName) solo aquí

### Reglas de Workflow de Desarrollo

#### Git
- Branch principal: `main`
- Naming de branches: `tipo/descripcion` (ej: `feature/contact-form`, `fix/auth-bug`)
- Commits: prefijo semántico en inglés (`feat:`, `fix:`, `docs:`, `chore:`, `refactor:`)

#### Build Pipeline
- Code gen modelos/providers: `dart run build_runner build --delete-conflicting-outputs`
- Code gen localizaciones: `flutter pub get`
- Build web: `flutter build web`
- Deploy: `firebase deploy` (Hosting en `build/web/`, SPA rewrite activo)

#### Archivos Generados
- `.g.dart`, `.freezed.dart`, `firebase_options.dart` — se commitean al repo
- `app_localizations.dart` — auto-generado, no editar
- Regenerar SIEMPRE después de modificar fuentes (modelos, ARB, providers)

### Reglas Críticas — No Olvidar

#### Anti-Patrones
- NUNCA crear providers manualmente (`final myProvider = Provider(...)`) — siempre `@riverpod`
- NUNCA un solo controller para CRUD admin — siempre 3 separados (Create, Update, Delete)
- NUNCA hardcodear strings de UI en widgets — siempre en archivos ARB
- NUNCA editar archivos generados (`.g.dart`, `.freezed.dart`, `app_localizations.dart`)
- NUNCA usar `StatefulWidget` cuando `ConsumerWidget` o `ConsumerStatefulWidget` es suficiente
- NUNCA importar archivos de `data/` desde `domain/` — la dependencia es domain ← data, no al revés

#### Casos Especiales
- **Imágenes**: Siempre usar `ImageAndPath` para flujos de upload/update — gestiona File local vs URL remota
- **Bilingüe**: Todo contenido visible al usuario debe existir en En Y Es — campos de modelo Y strings ARB
- **Responsive**: Todo componente nuevo debe funcionar en los 3 breakpoints (450/600/900px)
- **SEO**: Páginas web deben usar `meta_seo` para meta tags — importante para visibilidad del portfolio
- **Auth**: Solo email/password, modelo `Admin` — no hay registro público, solo login admin

#### Seguridad
- API keys de Firebase están en `firebase_options.dart` (generado por FlutterFire CLI) — no agregar keys adicionales en código
- No exponer rutas admin sin verificación de auth state
- `GoRouterRefreshStream` escucha cambios de auth para proteger rutas admin

---

## Guías de Uso

**Para Agentes de IA:**
- Leer este archivo ANTES de implementar cualquier código
- Seguir TODAS las reglas exactamente como están documentadas
- Ante la duda, preferir la opción más restrictiva
- Actualizar este archivo si emergen nuevos patrones

**Para Humanos:**
- Mantener este archivo lean y enfocado en las necesidades de los agentes
- Actualizar cuando cambie el stack tecnológico
- Revisar periódicamente para eliminar reglas obsoletas
- Eliminar reglas que se vuelvan obvias con el tiempo

Última actualización: 2026-03-15
