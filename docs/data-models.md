# Modelos de Datos

> Generado: 2026-03-15 | Escaneo Exhaustivo

## Resumen

El proyecto usa **Freezed** para modelos inmutables con generación automática de `copyWith`, `==`, `hashCode`, `toString` y serialización JSON. Los datos persisten en **Cloud Firestore** (colecciones) y **Firebase Storage** (imágenes).

## Colecciones Firestore

### Projects

**Colección:** `Projects`

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | String | UUID generado |
| `companyNameEs` | String | Nombre empresa (español) |
| `companyNameEn` | String | Nombre empresa (inglés) |
| `shortDescriptionEs` | String | Descripción corta (español) |
| `shortDescriptionEn` | String | Descripción corta (inglés) |
| `mainImage` | ImageAndPath | Imagen principal |
| `screenshots` | List\<ImageAndPath\> | Capturas de pantalla |
| `websiteUrl` | String? | URL del sitio web |
| `sourceCodeUrl` | String? | URL del código fuente |
| `featuresES` | List\<String\> | Características (español) |
| `featuresEN` | List\<String\> | Características (inglés) |
| `technologies` | List\<TechnologyID\> | IDs de tecnologías usadas |

**Storage paths:**
- Imagen principal: `projects/{projectId}/main-image.webp`
- Screenshots: `projects/{projectId}/screenshots/{index}-image.webp`

### Technologies

**Colección:** `Technologies`

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | String | UUID generado |
| `name` | String | Nombre de la tecnología |
| `image` | ImageAndPath | Icono/logo |
| `experienceTime` | String | Tiempo de experiencia |

**Storage path:** `technologies/{technologyId}/image.webp`

### Experiences

**Colección:** `Experiences`

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | String | UUID generado |
| `date` | String | Fecha/período |
| `companyName` | String | Nombre de empresa |
| `jobNameEn` | String | Cargo (inglés) |
| `jobNameEs` | String | Cargo (español) |
| `responsabilitiesEn` | String | Responsabilidades (inglés) |
| `responsabilitiesEs` | String | Responsabilidades (español) |

## Modelos Freezed

### Admin

```dart
@freezed
class Admin with _$Admin {
  const factory Admin({
    required String uid,
    required String email,
  }) = _Admin;
}
```

**Uso:** Representa al usuario autenticado. No persiste en Firestore (viene de Firebase Auth).

### Project

```dart
@freezed
class Project with _$Project {
  const factory Project({
    required String companyNameEs,
    required String companyNameEn,
    required String shortDescriptionEs,
    required String shortDescriptionEn,
    required ImageAndPath mainImage,
    @Default([]) List<ImageAndPath> screenshots,
    @Default('') String websiteUrl,
    @Default('') String sourceCodeUrl,
    @Default([]) List<String> featuresES,
    @Default([]) List<String> featuresEN,
    @Default([]) List<TechnologyID> technologies,
    required String id,
  }) = _Project;

  factory Project.fromJson(Map<String, dynamic> json) => _$ProjectFromJson(json);
}
```

**Extensions:**
- `companyName(Locale)` → Nombre localizado
- `shortDescription(Locale)` → Descripción localizada
- `features(Locale)` → Features localizados
- `screenshotsUrlFiltered` → Screenshots con URL válida
- `screenshotsLocalFiltered` → Screenshots con imagen local

### ImageAndPath

```dart
@freezed
class ImageAndPath with _$ImageAndPath {
  const factory ImageAndPath({
    @Default('') String url,
    Uint8List? localImage,
    @Default('') String refPath,
  }) = _ImageAndPath;

  factory ImageAndPath.fromJson(Map<String, dynamic> json) => _$ImageAndPathFromJson(json);
}
```

**Extensions de estado:**
- `hasUrl` → url.isNotEmpty
- `hasLocalImage` → localImage != null
- `hasRefImage` → refPath.isNotEmpty
- `isEmpty` → !hasUrl && !hasLocalImage && !hasRefImage
- `needsToUpdate` → hasLocalImage && hasRefImage
- `needsToDelete` → !hasLocalImage && !hasUrl && hasRefImage

### Technology

```dart
@freezed
class Technology with _$Technology {
  const factory Technology({
    required String name,
    required ImageAndPath image,
    required String id,
    required String experienceTime,
  }) = _Technology;

  factory Technology.fromJson(Map<String, dynamic> json) => _$TechnologyFromJson(json);
}
```

### Experience

```dart
@freezed
class Experience with _$Experience {
  const factory Experience({
    required String id,
    required String date,
    required String companyName,
    required String jobNameEn,
    required String jobNameEs,
    required String responsabilitiesEn,
    required String responsabilitiesEs,
  }) = _Experience;

  factory Experience.fromJson(Map<String, dynamic> json) => _$ExperienceFromJson(json);
}
```

**Extensions:**
- `jobName(Locale)` → Cargo localizado
- `responsabilities(Locale)` → Responsabilidades localizadas

### ContactMessage

```dart
@freezed
class ContactMessage with _$ContactMessage {
  const factory ContactMessage({
    required String name,
    required String email,
    required String message,
    required String phoneNumber,
    required SendThrough sendThrough,
  }) = _ContactMessage;
}
```

**Enum SendThrough:** `email`, `whatsapp`

**Extension:** `formattedMessage()` → Formatea mensaje con datos de negocio

### ContactPhoneNumber

```dart
@freezed
class ContactPhoneNumber with _$ContactPhoneNumber {
  const factory ContactPhoneNumber({
    required String countryCode,
    required String phoneNumber,
  }) = _ContactPhoneNumber;
}
```

### Settings

```dart
class Settings {
  final ThemeMode themeMode;
  final Locale locale;
}
```

**Nota:** Modelo simple sin Freezed. No persiste actualmente (stubs en repository).

## Repositorios

### Patrón

Cada feature define un repositorio abstracto en Domain e implementaciones en Data:

| Repositorio | Implementación Firebase | Implementación Fake |
|---|---|---|
| `AuthRepository` | `FirebaseAdminAuthRepositoryImp` | N/A |
| `ProjectsRepository` | `FirebaseProjectsRepositoryImp` | `FakeProjectsRepositoryImp` |
| `AdminProjectsRepository` | `FirebaseAdminProjectsRepositoryImp` | `FakeAdminProjectsRepositoryImp` |
| `TechnologyRepository` | `FirebaseTechnologyRepositoryImp` | `FakeTechnologyRepositoryImp` |
| `AdminTechnologyRepository` | `AdminFirebaseTechnologyRepositoryImp` | `AdminFakeTechnologyRepositoryImp` |
| `ExperienceRepository` | `FirebaseExperienceRepositoryImp` | `FakeExperienceRepositoryImp` |
| `ContactRepository` | `ContactRepositoryImp` | N/A |
| `SocialLauncherRepository` | `SocialLauncherRepositoryImp` | N/A |
| `UrlLauncherRepository` | `UrlLauncherRepositoryImp` | N/A |
| `SettingsRepository` | `SettingsRepository` (stubs) | N/A |

### Estado Actual de Datos

| Feature | Fuente Activa | Nota |
|---|---|---|
| **Projects** | Firebase | Firestore + Storage |
| **Technologies** | Firebase | Firestore + Storage |
| **Experiences** | Fake (constantes) | Firebase impl existe pero no está conectada |
| **Auth** | Firebase Auth | Email/password |
| **Contact** | Envío directo | WhatsApp UniLink / Mailto |
| **Settings** | Stubs | Retorna valores por defecto (dark, en) |
