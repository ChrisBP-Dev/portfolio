# Guía de Despliegue

> Generado: 2026-03-15 | Escaneo Exhaustivo

## Infraestructura

| Servicio | Proveedor | Proyecto |
|---|---|---|
| **Hosting** | Firebase Hosting | portfolio-chrisbp |
| **Autenticación** | Firebase Auth | portfolio-chrisbp |
| **Base de datos** | Cloud Firestore | portfolio-chrisbp |
| **Almacenamiento** | Firebase Storage | portfolio-chrisbp |
| **Dominio** | Firebase Hosting (default) | portfolio-chrisbp.web.app |

## Configuración Firebase

### Proyecto

- **ID:** portfolio-chrisbp
- **Sender ID:** 267758672045
- **Storage Bucket:** portfolio-chrisbp.appspot.com
- **Auth Domain:** portfolio-chrisbp.firebaseapp.com

### Plataformas Configuradas

| Plataforma | App ID | Namespace/Bundle |
|---|---|---|
| **Web** | 1:267758672045:web:* | N/A |
| **Android** | 1:267758672045:android:* | com.chrisbp.portfolio |
| **iOS** | 1:267758672045:ios:* | com.chrisbp.portfolio |
| **macOS** | 1:267758672045:ios:* | com.chrisbp.portfolio |
| **Windows** | 1:267758672045:web:* | N/A |

## Proceso de Despliegue Web

### 1. Build

```bash
flutter build web --release
```

Genera output en `build/web/`.

### 2. Desplegar a Firebase Hosting

```bash
firebase deploy --only hosting
```

### 3. Verificar

El sitio estará disponible en:
- `https://portfolio-chrisbp.web.app`
- `https://portfolio-chrisbp.firebaseapp.com`

## Configuración de Hosting (`firebase.json`)

```json
{
  "hosting": {
    "public": "build/web",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

- **SPA Rewrite**: Todas las rutas redirigen a `index.html` (necesario para GoRouter path strategy)
- **Directorio público**: `build/web/` (output de `flutter build web`)

## SEO y Web

### index.html

- Meta tags configurados para SEO
- Theme color: `#bb86fc`
- Splash screen CSS personalizado
- Viewport responsive

### Meta SEO

El paquete `meta_seo` se inicializa en `main.dart`:
```dart
MetaSEO().config();
```

## Estructura de Firebase Storage

```
portfolio-chrisbp.appspot.com/
├── projects/
│   ├── {projectId}/
│   │   ├── main-image.webp
│   │   └── screenshots/
│   │       ├── 0-image.webp
│   │       ├── 1-image.webp
│   │       └── ...
└── technologies/
    └── {technologyId}/
        └── image.webp
```

## Colecciones Firestore

```
portfolio-chrisbp (database)
├── Projects/          # Documentos de proyectos
├── Technologies/      # Documentos de tecnologías
└── Experiences/       # Documentos de experiencias
```

## CI/CD

**Estado actual:** No configurado.

El directorio `.github/` existe pero está vacío. No hay workflows de GitHub Actions, ni configuración de Fastlane, ni pipelines de CI/CD.

### Recomendación

Para automatizar el despliegue, se podría agregar un workflow de GitHub Actions:

```yaml
# .github/workflows/deploy.yml (sugerido)
name: Deploy to Firebase Hosting
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: subosito/flutter-action@v2
        with:
          flutter-version: '3.27.1'
      - run: flutter pub get
      - run: flutter build web --release
      - uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          channelId: live
```

## Build Android

### Configuración Actual

- **App ID:** com.chrisbp.portfolio
- **Min SDK:** Flutter default
- **Signing:** Debug keys (release signing pendiente)

### Nota

El `build.gradle` tiene un TODO para configurar signing de release:
```
// TODO: Add a valid signing config for the release build
```

Para publicar en Play Store, necesitarás:
1. Generar keystore de release
2. Configurar `key.properties`
3. Actualizar `build.gradle` con signing config
