# Guía de Despliegue — Portfolio ChrisBP

> Generado: 2026-03-26 | Modo: Re-escaneo Exhaustivo | v3.0.0

## Plataforma de Hosting

- **Servicio:** Firebase Hosting
- **Proyecto:** portfolio-chrisbp
- **URL:** https://portfolio-chrisbp.web.app
- **CDN:** Global (Firebase CDN)
- **Output:** HTML/CSS/JS estático pre-renderizado

## Configuración de Hosting (firebase.json)

```json
{
  "hosting": {
    "public": "dist/",
    "cleanUrls": true,
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
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

- **cleanUrls:** true — URLs sin extensión .html
- **Caching:** Assets estáticos con cache inmutable (1 año)
- **Formatos cacheados:** JS, CSS, SVG, PNG, JPG, WebP, WOFF2

## Pipeline CI/CD (GitHub Actions)

**Archivo:** `.github/workflows/ci.yml`
**Trigger:** Push a `main` + workflow_dispatch manual

### Pasos del Pipeline

```
1. Checkout (full history, fetch-depth: 0)
   ↓
2. Setup (pnpm 10 + Node desde .nvmrc + pnpm install --frozen-lockfile)
   ↓
3. Detección inteligente de cambios (git diff)
   • Archivos monitoreados: src/**, public/**, tests/**, package.json,
     pnpm-lock.yaml, astro.config.*, tsconfig.json, firebase.json,
     firestore.rules, storage.rules, lighthouserc.cjs, eslint.config.js,
     .github/workflows/**
   • Output: has_code_changes=true|false
   ↓
4. Quality Gates [SIEMPRE se ejecutan]
   • pnpm lint
   • pnpm type-check
   ↓
5. Tests con Firebase Emulators [SIEMPRE se ejecutan]
   • Setup Java 21
   • Cache emuladores: ~/.cache/firebase/emulators
   • firebase emulators:exec --only auth,firestore,storage "pnpm test"
   ↓
6. Build [CONDICIONAL: solo si has_code_changes]
   • pnpm build
   • Secrets inyectados desde GitHub Secrets
   ↓
7. Lighthouse CI [CONDICIONAL]
   • Mueve dist/admin a /tmp (excluye admin del audit)
   • lhci autorun
   • Umbrales: ≥0.95 en todos (perf ≥0.70 para /projects/[slug])
   • Restaura admin pages
   ↓
8. Deploy a Firebase Hosting [CONDICIONAL]
   • FirebaseExtended/action-hosting-deploy@v0
   • Channel: live
```

## GitHub Secrets Requeridos

| Secret | Formato | Uso |
|--------|---------|-----|
| `FIREBASE_SERVICE_ACCOUNT` | JSON completo | Deploy a Firebase Hosting + Admin SDK en build |
| `FIREBASE_CLIENT_CONFIG` | JSON con config pública | Variables PUBLIC_* + contacto + admin UID |

### Formato de FIREBASE_SERVICE_ACCOUNT
```json
{
  "project_id": "portfolio-chrisbp",
  "client_email": "...",
  "private_key": "..."
}
```

### Formato de FIREBASE_CLIENT_CONFIG
```json
{
  "apiKey": "...",
  "authDomain": "...",
  "projectId": "...",
  "storageBucket": "...",
  "messagingSenderId": "...",
  "appId": "...",
  "adminUid": "...",
  "contactEmail": "...",
  "whatsappNumber": "..."
}
```

## Lighthouse CI (lighthouserc.cjs)

| Categoría | Umbral General | Umbral /projects/[slug] |
|-----------|---------------|------------------------|
| Performance | ≥0.95 (error) | ≥0.70 (warn) |
| Accessibility | ≥0.95 (error) | ≥0.95 (error) |
| Best Practices | ≥0.95 (error) | ≥0.95 (error) |
| SEO | ≥0.95 (error) | ≥0.95 (error) |

- **Preset:** desktop
- **Runs:** 1 por URL
- **Upload:** temporary-public-storage

## Reglas de Seguridad

### Firestore
- Lectura: pública para todos los documentos
- Escritura: solo UID admin hardcodeado

### Storage
- Lectura: pública para todos los archivos
- Escritura: solo UID admin hardcodeado

## Build Local

```bash
# Requiere variables de entorno Admin SDK configuradas
pnpm build
pnpm preview  # http://localhost:4321
```

## Deploy Manual (no recomendado)

```bash
pnpm build
firebase deploy --only hosting
```

Se recomienda usar el pipeline CI/CD para deploys a producción.
