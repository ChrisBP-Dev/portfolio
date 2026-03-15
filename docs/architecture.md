# Arquitectura del Proyecto - Portfolio ChrisBP

> Generado: 2026-03-15 | Escaneo Exhaustivo

## Resumen Ejecutivo

Aplicación Flutter multiplataforma que sigue **Clean Architecture** organizada por features, con Riverpod como gestión de estado, Firebase como backend (Auth, Firestore, Storage) y GoRouter para navegación declarativa. El proyecto prioriza la plataforma web pero soporta 6 plataformas desde un solo codebase.

## Patrón Arquitectónico

### Clean Architecture por Features

```
┌──────────────────────────────────────────────────────────┐
│                    PRESENTATION                          │
│  Pages → Components → Widgets → Controllers (Riverpod)  │
├──────────────────────────────────────────────────────────┤
│                      DOMAIN                              │
│   Entities (Freezed) → Abstract Repositories → Contracts │
├──────────────────────────────────────────────────────────┤
│                       DATA                               │
│  Firebase Implementations → Services → Fake Repositories │
└──────────────────────────────────────────────────────────┘
```

### Principios de Diseño

1. **Inversión de dependencias**: Domain define interfaces, Data las implementa
2. **Intercambiabilidad**: Firebase ↔ Fake repositories para testing/offline
3. **Separación por features**: Cada feature es un módulo autocontenido
4. **Código compartido en Core**: Widgets, utils y constantes comunes

## Gestión de Estado (Riverpod)

### Patrones Utilizados

| Patrón | Uso | Ejemplo |
|---|---|---|
| **StreamProvider** | Datos en tiempo real desde Firestore | `getProjectsStreamProvider`, `authStateChangesProvider` |
| **AsyncNotifierProvider** | Operaciones async con estado | `authControllerProvider`, `themeControllerProvider` |
| **FutureProvider** | Datos async one-shot | `getTechnologiesByIdProvider` |
| **Provider** | Dependencias singleton | `authRepositoryProvider`, `firebaseAuthProvider` |

### Flujo de Datos

```
Firestore Stream → Repository (Data) → StreamProvider → Controller → UI (ConsumerWidget)
                                                                        ↓
User Action → Controller Method → Repository Method → Firebase Service → Firestore/Storage
```

### Providers Clave (keepAlive: true)

- `authStateChangesProvider` - Estado de autenticación
- `getProjectsStreamProvider` - Stream de proyectos
- `getTechnologiesProvider` - Stream de tecnologías
- `getExperiencesStreamProvider` - Stream de experiencias

## Modelos de Datos (Domain)

### Entidades Freezed

| Modelo | Campos Principales | Colección Firestore |
|---|---|---|
| **Admin** | `uid`, `email` | N/A (Firebase Auth) |
| **Project** | `id`, `companyNameEs/En`, `shortDescriptionEs/En`, `mainImage`, `screenshots`, `technologies`, `featuresES/EN`, `websiteUrl`, `sourceCodeUrl` | `Projects` |
| **Technology** | `id`, `name`, `image`, `experienceTime` | `Technologies` |
| **Experience** | `id`, `date`, `companyName`, `jobNameEn/Es`, `responsabilitiesEn/Es` | `Experiences` |
| **ContactMessage** | `name`, `email`, `message`, `phoneNumber`, `sendThrough` | N/A (envío directo) |
| **ContactPhoneNumber** | `countryCode`, `phoneNumber` | N/A |
| **ImageAndPath** | `url`, `localImage`, `refPath` | Embebido en Project/Technology |
| **Settings** | `themeMode`, `locale` | N/A (local) |

### Modelo ImageAndPath

Gestiona estados duales de imágenes (local vs. red):

```
ImageAndPath
├── hasUrl        → Imagen subida a Firebase Storage
├── hasLocalImage → Imagen seleccionada localmente (Uint8List)
├── hasRefImage   → Tiene referencia de Storage
├── needsToUpdate → Local image + ref existente
├── needsToDelete → Sin local ni URL pero tiene ref
└── isEmpty       → Sin datos
```

## Servicios Firebase (Data Layer)

### FirestoreService\<T\> (Genérico)

Servicio genérico para operaciones CRUD en Firestore:
- `getCollectionStream()` - Stream en tiempo real
- `getCollectionFuture()` - Lectura one-shot
- `createDocument()` / `updateDocument()` / `deleteDocument()`
- Manejo de errores: `FirestoreException` con `FirestoreErrorType`

### StorageService

Gestión de archivos en Firebase Storage:
- `uploadImage(Uint8List, path)` → URL de descarga
- `deleteImage(path)` → Eliminación
- Manejo de errores: `StorageException` con `StorageErrorType`

### FirebaseAuthService

Wrapper sobre FirebaseAuth:
- `signInWithEmailAndPassword()` → Admin
- `signOut()`
- `authStateChanges()` → Stream\<Admin?\>
- Manejo de errores: `FirebaseAuthException` con `FirebaseAuthErrorType`

## Navegación (GoRouter)

### Estructura de Rutas

```
ShellRoute (FullPageContainer - layout persistente)
├── /                          → HomePage
├── /projects                  → ProjectsPage
├── /projects/imageviewer/:id/:index → ImageViewer
├── /experience                → ExperiencePage
├── /contact                   → ContactPage
├── /admin/technologies        → AdminTechnologiesListPage
├── /admin/projects            → AdminProjectsListPage
└── /admin/experiences         → AdminExperiencesListPage
```

### Características de Routing

- **Path URL Strategy**: URLs limpias sin `#` para web
- **Shell Route**: Layout persistente (header, footer, admin drawer)
- **Auth Refresh**: GoRouterRefreshStream escucha cambios de auth
- **Fade Transitions**: Transiciones suaves entre rutas
- **404 Page**: NotFoundPage para rutas inválidas

## Diseño Responsive

### Breakpoints

| Breakpoint | Valor | Comportamiento |
|---|---|---|
| **Mobile** | < 450px | Menú hamburguesa, layout vertical |
| **Tablet** | 450-600px | Layout intermedio |
| **Desktop** | > 900px | Menú horizontal, admin sidebar |

### Estrategia

- `ResponsiveWidget`: Renderiza widget diferente por breakpoint
- `ResponsiveCenter`: Contenido centrado con max-width
- `sizeScaled()`: Interpolación de tamaños entre breakpoints
- Tema responsive: TextTheme escala con ancho de pantalla

## Localización (i18n)

### Configuración

- **Idiomas**: Inglés (en) - template, Español (es)
- **Formato**: ARB files (`lib/src/localization/arb/`)
- **Acceso**: `context.l10n.keyName`
- **Cambio**: `LocaleController.changeLocale()` (toggle EN ↔ ES)

### Estrategia de Contenido Bilingüe

Los modelos de datos contienen campos duplicados por idioma:
- `companyNameEn` / `companyNameEs`
- `shortDescriptionEn` / `shortDescriptionEs`
- `featuresEN` / `featuresES`

Extensions localizados seleccionan el campo correcto según locale activo.

## Sistema de Temas

### Modos

- **Dark** (por defecto): Colores primarios `#48A1CD` / `#108385`
- **Light**: Variantes claras de los mismos colores
- **Cambio**: `ThemeController.changeTheme()` (toggle)

### Implementación

- `ThemeApp` genera `ThemeData` completo con Riverpod providers
- `AppColor` define paleta centralizada (light + dark)
- `AppTextTheme` genera tipografía responsive con Google Fonts Poppins
- `ThemeExtension` en BuildContext para acceso rápido

## Autenticación y Seguridad

### Flujo de Auth

```
Footer double-tap → SignInAlert → Email/Password form
                                       ↓
                              AuthController.signIn()
                                       ↓
                              FirebaseAuth.signInWithEmailAndPassword()
                                       ↓
                              authStateChangesProvider actualiza
                                       ↓
                              GoRouter refresh → Admin routes disponibles
                                       ↓
                              FullPageContainer muestra AdminDrawer
```

### Roles

- **Visitante**: Acceso a home, projects, experience, contact
- **Admin** (autenticado): Acceso adicional a CRUD de technologies, projects, experiences

## Testing

### Estado Actual

- `test/widget_test.dart` - Test placeholder (counter smoke test, no refleja la app actual)
- **Cobertura**: Mínima - necesita tests unitarios, de widget e integración
- **Herramientas disponibles**: flutter_test, mocktail (^1.0.4)
- **Patrón ready**: Repositorios Fake permiten testing sin Firebase

## Diagrama de Dependencias entre Features

```
home ──→ projects (HomeProjectsList)
     ──→ technologies (TechnologiesList)
     ──→ experience (ExperiencesList)
     ──→ social_launcher (SocialButtons)
     ──→ settings (ThemeController)

projects ──→ technologies (getTechnologiesByIdProvider)
         ──→ social_launcher (launchAnyLink)

contact ──→ social_launcher (UrlLauncherRepository)

auth ←── core/common_components (FullPageContainer, FooterComponent)

settings ←── app.dart (ThemeController, LocaleController)
         ←── core/common_components (SwitchThemeWidget, SwitchLocaleWidget)
```
