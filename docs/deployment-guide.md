# Guía de Despliegue — Portfolio ChrisBP

> Generado: 2026-03-24 | Escaneo Exhaustivo | Firebase Hosting + GitHub Actions

## Infraestructura

| Servicio | Proveedor | Propósito |
|----------|-----------|-----------|
| Hosting | Firebase Hosting | Sitio estático (dist/) |
| Base de Datos | Cloud Firestore | Datos de contenido |
| Storage | Firebase Storage | Imágenes (proyectos, tecnologías, blog) |
| Auth | Firebase Auth | Autenticación admin |
| CI/CD | GitHub Actions | Pipeline automatizado |
| Performance | Lighthouse CI | Auditoría de calidad |

**Proyecto Firebase:** `portfolio-chrisbp`
**URL producción:** `https://portfolio-chrisbp.web.app`

## Build de Producción

```bash
pnpm build
```

**Output:** `dist/` — sitio estático completo

**Variables requeridas en build:**
- Firebase Admin SDK: `FIREBASE_ADMIN_PROJECT_ID`, `FIREBASE_ADMIN_CLIENT_EMAIL`, `FIREBASE_ADMIN_PRIVATE_KEY`
- Firebase Client SDK: `PUBLIC_FIREBASE_*` (6 variables)
- App config: `PUBLIC_ADMIN_UID`, `PUBLIC_CONTACT_EMAIL`, `PUBLIC_WHATSAPP_NUMBER`

## Despliegue Manual

```bash
# Build
pnpm build

# Deploy solo hosting
firebase deploy --only hosting

# Deploy reglas Firestore
firebase deploy --only firestore:rules

# Deploy reglas Storage
firebase deploy --only storage

# Deploy todo
firebase deploy
```

## CI/CD Pipeline (GitHub Actions)

**Trigger:** Push a `main` o `workflow_dispatch`

### Etapas del Pipeline

```
1. Checkout + Setup (pnpm 10, Node via .nvmrc)
2. Install (pnpm install --frozen-lockfile)
3. Change Detection (smart skip si solo docs/config cambiaron)
4. Quality Gates (siempre)
   ├── Lint (pnpm lint)
   └── Type Check (pnpm type-check)
5. Tests con Firebase Emulators (siempre)
   ├── Setup Java 21 (Temurin)
   ├── Cache emuladores
   └── firebase emulators:exec "pnpm test"
6. Build (solo si hay cambios en código)
7. Lighthouse CI (solo si hay cambios en código)
   ├── Exclude admin pages
   └── Assert scores ≥0.95
8. Deploy a Firebase Hosting (solo si hay cambios en código)
```

### Smart Change Detection

El pipeline detecta si solo cambiaron archivos de docs/config:
- **Archivos monitoreados:** `src/**`, `public/**`, `tests/**`, `package.json`, `pnpm-lock.yaml`, configs de build, `.github/workflows/**`
- **Si solo cambian otros archivos:** Se ejecutan lint, type-check y tests, pero se saltan build, Lighthouse y deploy

### Secrets de GitHub

| Secret | Contenido |
|--------|-----------|
| `FIREBASE_SERVICE_ACCOUNT` | JSON completo del service account |
| `FIREBASE_CLIENT_CONFIG` | JSON con apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId, adminUid, contactEmail, whatsappNumber |

## Firebase Hosting Config

```json
{
  "hosting": {
    "public": "dist/",
    "cleanUrls": true,
    "headers": [
      {
        "source": "**/*.@(js|css|svg|png|jpg|webp|woff2)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=31536000, immutable"
          }
        ]
      }
    ]
  }
}
```

- **Clean URLs:** Habilitado (rutas sin `.html`)
- **Cache:** Assets inmutables con cache de 1 año
- **Ignore:** `firebase.json`, dotfiles, `node_modules`

## Reglas de Seguridad

### Firestore Rules
```
read: público (cualquier visitante)
write: solo auth.uid == 'G26dKlezR6cghnfv7NrBmQiXdUG3' (admin)
```

### Storage Rules
```
read: público
write: solo auth.uid == 'G26dKlezR6cghnfv7NrBmQiXdUG3' (admin)
```

## Lighthouse CI Config

```javascript
// Thresholds estrictos
performance: ≥0.95     // (≥0.70 para project detail pages con imágenes)
accessibility: ≥0.95
best-practices: ≥0.95
seo: ≥0.95
```

- **Excepción:** Pages de detalle de proyecto (`/projects/[slug]`) tienen threshold de performance en `warn` ≥0.70 (por carga de screenshots)
- **Admin pages** excluidas del escaneo Lighthouse

## Emuladores Locales

```json
{
  "auth": { "port": 9099 },
  "firestore": { "port": 8080 },
  "storage": { "port": 9199 },
  "ui": { "port": 4000 }
}
```

**Inicio:** `pnpm emulators`
**UI:** `http://127.0.0.1:4000`

Los emuladores se conectan automáticamente cuando `PUBLIC_USE_EMULATORS=true` y `USE_EMULATORS=true` están configurados en `.env`.
