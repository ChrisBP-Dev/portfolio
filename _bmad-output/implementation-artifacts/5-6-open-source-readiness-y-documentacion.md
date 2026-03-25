# Story 5.6: Open Source Readiness y Documentación

Status: ready-for-dev

## Story

As Diego (developer cloning the repo),
I want complete documentation and a clean repo,
So that I can set up my own portfolio following only the README.

## Acceptance Criteria

1. **Given** README.md **When** read **Then** includes: project description, tech stack, prerequisites (Node 22+, pnpm, Firebase project), setup steps (clone → install → configure .env → run emulators → run dev), deployment instructions, testing instructions (`pnpm test`, `pnpm test:e2e`), architecture overview, license
2. **And** `.env.example` documents every variable with descriptions and example values
3. **And** `git log` shows no committed `.env`, credentials, API keys or service accounts
4. **And** running `pnpm install && pnpm dev` with emulators works on a fresh clone with only `.env` configured
5. **And** sample/seed data script exists or is documented for first-time setup
6. **And** repo includes LICENSE file

> (FR47, FR48, FR49, NFR9, NFR13)

## Tasks / Subtasks

- [ ] Task 1: Crear LICENSE file (AC: #6)
  - [ ] 1.1 Crear `LICENSE` en la raíz del repo con licencia MIT **completa** (incluir AMBOS párrafos: la cláusula de condiciones Y el disclaimer "AS IS" de garantía). Año: 2025-2026. Titular: Christopher Bobadilla Plasencia. Usar el texto estándar completo de MIT License — NO truncar
  - [ ] 1.2 Verificar que `.gitignore` no excluye LICENSE (actualmente no lo excluye — OK)

- [ ] Task 2: Reescribir README.md con todas las secciones requeridas (AC: #1, #5)
  - [ ] 2.1 Crear README.md **nuevo en inglés** con las secciones definidas abajo. El README actual (español, ~132 líneas) sirve como referencia de contenido pero NO como base para traducción — reescribir desde cero en inglés (el repo es open source para audiencia internacional, `defaultLocale = 'en'`). Las secciones deben aparecer en el README **en el orden listado**:
    - **Header**: Título "Portfolio — ChrisBP", descripción breve, badges opcionales (Node version, license)
    - **Tech Stack**: Tabla con Astro 6, Svelte 5, Tailwind CSS 4, Firebase, TypeScript, Vitest, Playwright
    - **Architecture Overview**: Astro Islands pattern — SSG estático, Svelte islands para interactividad, Firebase para datos y auth. Mencionar: file-based routing, i18n (EN/ES), dark/light theme, WCAG 2.1 AA
    - **Prerequisites**: Node.js 22.12.0+ (usar `.nvmrc`), pnpm 10+, Java JDK 21+ (Firebase Emulators), Firebase project
    - **Getting Started**: Paso a paso: clone → `pnpm install` → `pnpm exec playwright install` (browsers para E2E) → copy `.env.example` to `.env` → configure variables → `pnpm emulators` → `pnpm dev` → open `localhost:4321`
    - **Firebase Setup**: Instrucciones para crear proyecto Firebase, habilitar Auth/Firestore/Storage, obtener config y service account
    - **Data Seeding**: Documentar `pnpm migrate` (migración Flutter → profesional, necesita datos Flutter previos, skip si setup limpio) y `pnpm seed:experiences` (poblar experiencias de ejemplo). Documentar `pnpm cleanup:e2e` y `pnpm cleanup:images`
    - **Available Scripts**: Tabla completa con TODOS los scripts de package.json (dev, build, preview, type-check, lint, format, test, test:watch, test:coverage, test:e2e, emulators, migrate, seed:experiences, cleanup:e2e, cleanup:images)
    - **Testing**: Unit tests (Vitest, `pnpm test`), E2E (Playwright, `pnpm build && pnpm test:e2e`), Lighthouse CI (`pnpm build && pnpm exec lhci autorun`)
    - **Deployment**: Firebase Hosting — `firebase deploy --only hosting`. CI/CD pipeline (GitHub Actions): lint → type-check → test → build → Lighthouse CI → deploy. Documentar AMBOS GitHub Secrets con su estructura JSON:
      - `FIREBASE_SERVICE_ACCOUNT` — JSON del service account (`{ "project_id", "client_email", "private_key" }`)
      - `FIREBASE_CLIENT_CONFIG` — JSON con config pública + app info (`{ "apiKey", "authDomain", "projectId", "storageBucket", "messagingSenderId", "appId", "adminUid", "contactEmail", "whatsappNumber" }`). La estructura ya está documentada al final de `.env.example` (líneas 37-43) — copiar esa documentación al README
    - **Project Structure**: Árbol simplificado del directorio `src/` con descripción de TODAS las carpetas de primer nivel: `assets/`, `components/` (subdirs: common, contact, home, layout, projects, blog, admin), `data/`, `layouts/`, `lib/` (subdirs: firebase, i18n, schemas, scripts, types, utils), `pages/` (root + es/ + admin/), `styles/`, `test/` (factories)
    - **Environment Variables**: Tabla con todas las variables de `.env.example`, divididas en: Firebase Client (PUBLIC_*), Firebase Admin, Contact, E2E, Emulators. Indicar cuáles son obligatorias
    - **License**: Sección con link al archivo LICENSE (MIT)
  - [ ] 2.2 Verificar que todos los comandos documentados funcionan: `pnpm install`, `pnpm dev`, `pnpm build`, `pnpm test`, `pnpm test:e2e`, `pnpm emulators`, `pnpm lint`, `pnpm type-check`

- [ ] Task 3: Auditoría de secrets en código fuente y git history (AC: #3)
  - [ ] 3.1 Ejecutar auditoría de git history para verificar que nunca se committeó un `.env`, `*.pem`, `*service-account*.json`, ni `*adminsdk*.json`:
    ```bash
    git log --all --diff-filter=A --name-only -- '*.env' '*.pem' '*service-account*' '*adminsdk*' '*credential*'
    ```
    Resultado esperado: vacío (ya verificado — clean)
  - [ ] 3.2 Escanear código fuente por patrones de secrets:
    ```bash
    grep -rn "AKIA\|sk_live\|sk_test\|BEGIN.*PRIVATE.*KEY\|firebase.*apiKey.*=.*\"AIza" src/ --include='*.ts' --include='*.js' --include='*.astro' --include='*.svelte'
    ```
    Resultado esperado: cero matches reales (las API keys deben estar solo en `.env` referenciadas via `import.meta.env`). **Excepción esperada:** `src/lib/firebase/__tests__/admin.test.ts` contiene un mock private key (`'-----BEGIN PRIVATE KEY-----\\ntest\\n...'`) — es un stub de test, NO un secret real. Ignorar ese match
  - [ ] 3.3 Verificar que `.gitignore` tiene protección completa de secrets:
    - `.env` y `.env.*` (excepto `.env.example`) ✓
    - `*.pem` ✓
    - `*-service-account*.json` ✓
    - `*-adminsdk-*.json` ✓
    - `.auth/` ✓
    Si falta algún patrón, agregarlo

- [ ] Task 4: Verificar `.env.example` está completo y documentado (AC: #2)
  - [ ] 4.1 Comparar variables en `.env.example` contra las que el código realmente usa. Buscar `import.meta.env` en `src/`:
    ```bash
    grep -rn 'import\.meta\.env\.' src/ --include='*.ts' --include='*.astro' --include='*.svelte' | grep -oE 'import\.meta\.env\.[A-Z_]+' | sed 's/import\.meta\.env\.//' | sort -u
    ```
    Verificar que CADA variable encontrada tiene entrada en `.env.example`. Estado actual: `.env.example` ya es comprehensivo (14 variables documentadas con comentarios) — probablemente no necesita cambios
  - [ ] 4.2 Si se encuentra alguna variable faltante, agregarla con descripción y valor de ejemplo

- [ ] Task 5: Verificar fresh clone workflow (AC: #4)
  - [ ] 5.1 El flujo documentado en README Task 2 debe funcionar:
    1. `git clone <repo>` (simulado — ya tenemos el repo)
    2. `pnpm install` — instala dependencias
    3. `pnpm exec playwright install` — instala browsers para E2E
    4. Copiar `.env.example` → `.env` y configurar valores
    5. `pnpm emulators` — inicia Firebase Emulator Suite
    6. `pnpm dev` — inicia servidor de desarrollo
    7. Verificar que `localhost:4321` sirve la página home
  - [ ] 5.2 Verificar que `pnpm build` funciona con las variables de entorno del Admin SDK. **Nota crítica:** El build SSG ejecuta queries Admin SDK en build time que requieren credenciales reales de un proyecto Firebase existente — los emulators NO soportan queries Admin SDK en build time. Para fresh clone sin proyecto Firebase real, el build fallará en las páginas SSG que fetchean datos. Documentar este requisito en README (sección Firebase Setup)
  - [ ] 5.3 Documentar en README si hay pasos adicionales necesarios (e.g., `pnpm exec playwright install` para E2E)

- [ ] Task 6: Verificación final — build, tests, y CI impact (AC: #1-#6)
  - [ ] 6.1 Ejecutar `pnpm build` — build exitoso
  - [ ] 6.2 Ejecutar `pnpm test` — todos los unit tests pasan (1246+ tests)
  - [ ] 6.3 Ejecutar `pnpm test:e2e` — todos los E2E tests pasan (160+ tests)
  - [ ] 6.4 Verificar que los cambios (README.md, LICENSE) NO disparan build/deploy en CI — el smart skip logic en `.github/workflows/ci.yml` excluye estos archivos de `has_code_changes` check. Los archivos monitoreados son: `src/`, `public/`, `tests/`, `package.json`, `pnpm-lock.yaml`, configs de build. README.md y LICENSE no están en la lista → CI skip correcto

## Anti-patterns — NO Hacer

- **NO crear CONTRIBUTING.md, CODE_OF_CONDUCT.md, CHANGELOG.md** — la story AC solo pide README y LICENSE. Los demás archivos son nice-to-have pero no están en scope (FR47-49)
- **NO modificar código fuente** — esta story es solo documentación y configuración
- **NO agregar badges de CI, coverage, etc.** al README a menos que sea trivial — mantener limpio y funcional
- **NO documentar la arquitectura interna en detalle en README** — el README es una guía de setup, no la arquitectura doc (esa ya existe en `docs/architecture.md`)
- **NO traducir `.env.example` completamente a inglés** — los comentarios pueden quedarse como están si son claros. Solo asegurar que las descripciones son entendibles
- **NO crear tests automatizados para contenido de README** — la verificación es manual/review. No es código testeable
- **NO tocar los archivos en `docs/`** — son documentación interna para agentes AI, off-limits per project rules

## Dev Notes

### Estado Actual — Lo que YA Existe (NO reimplementar)

| Componente | Estado | Archivo |
|-----------|--------|---------|
| README.md | ✅ Existe, pero incompleto | `README.md` — tiene prerequisites, setup, scripts, emulators, tests, CI/CD. Falta: tech stack, architecture overview, deployment, data seeding, env vars table, project structure, license |
| .env.example | ✅ Completo | `.env.example` — 14 variables con comentarios, separación client/admin/contact/E2E/emulators, docs de GitHub Secrets |
| .gitignore secrets | ✅ Completo | `.gitignore` — `.env`, `.env.*`, `!.env.example`, `*.pem`, `*-service-account*.json`, `*-adminsdk-*.json`, `.auth/` |
| Git history clean | ✅ Verificado | `git log --all --diff-filter=A` — cero archivos secrets committedos en 243 commits |
| Data scripts | ✅ Completo | `pnpm migrate`, `pnpm seed:experiences`, `pnpm cleanup:e2e`, `pnpm cleanup:images` — todos con dry-run mode |
| Firebase config | ✅ Completo | `firebase.json`, `.firebaserc`, `firestore.rules`, `storage.rules`, `firestore.indexes.json` |
| CI/CD pipeline | ✅ Completo | `.github/workflows/ci.yml` — lint → type-check → test → build → Lighthouse CI → deploy |
| docs/ folder | ✅ Completo (AI-internal) | 9 archivos de documentación para agentes AI — NO son documentación open source para Diego |
| LICENSE | **❌ FALTA** | No existe — Task 1 |
| README secciones | **❌ PARCIAL** | Faltan: tech stack, architecture, deployment, data seeding, env vars, project structure, license |

### Idioma del README — Migración a Inglés

El README actual está en **español**. DEBE migrar a **inglés**:
- `defaultLocale = 'en'`, audiencia open source internacional
- Convención estándar: README en inglés
- `.env.example` comments pueden quedarse como están (ya son legibles en contexto)

### LICENSE — MIT Recomendada

MIT es la licencia más apropiada para un portfolio personal open source:
- Permisiva — permite a otros clonar, modificar y usar como base
- Simple — una página, fácil de entender
- Estándar — reconocida universalmente en el ecosistema

Template completo (usar tal cual):
```
MIT License

Copyright (c) 2025-2026 Christopher Bobadilla Plasencia

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

### Data Scripts — Documentación para README

Los scripts de datos ya existen y tienen dry-run mode. Documentar en README:

| Script | Uso | Notas |
|--------|-----|-------|
| `pnpm migrate` | Migración datos Flutter → esquema profesional | Solo si se importa datos de versión Flutter. Soporta `--dry-run` |
| `pnpm seed:experiences` | Poblar colección Experiences con datos de ejemplo | 3 experiencias bilingües (ES/EN). Verifica si ya existen datos. `--dry-run` disponible |
| `pnpm cleanup:e2e` | Eliminar datos huérfanos de tests E2E | Limpia documentos `e2e-*` + imágenes asociadas |
| `pnpm cleanup:images` | Eliminar imágenes huérfanas de Storage | Compara Storage vs Firestore refs. `--execute` para borrar (default: dry-run) |

### Environment Variables — Categorización

Para la tabla en README:

| Variable | Tipo | Requerida | Contexto acceso | Descripción |
|----------|------|-----------|-----------------|-------------|
| `PUBLIC_FIREBASE_API_KEY` | Client | Sí | `import.meta.env` (Astro) | Firebase Web API key |
| `PUBLIC_FIREBASE_AUTH_DOMAIN` | Client | Sí | `import.meta.env` (Astro) | Firebase Auth domain |
| `PUBLIC_FIREBASE_PROJECT_ID` | Client | Sí | `import.meta.env` (Astro) | Firebase project ID |
| `PUBLIC_FIREBASE_STORAGE_BUCKET` | Client | Sí | `import.meta.env` (Astro) | Firebase Storage bucket |
| `PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Client | Sí | `import.meta.env` (Astro) | FCM sender ID |
| `PUBLIC_FIREBASE_APP_ID` | Client | Sí | `import.meta.env` (Astro) | Firebase app ID |
| `PUBLIC_ADMIN_UID` | Client | Sí | `import.meta.env` (Astro) | UID del admin user |
| `FIREBASE_ADMIN_PROJECT_ID` | Admin | Solo build | `import.meta.env` (Astro) | Project ID (Admin SDK) |
| `FIREBASE_ADMIN_CLIENT_EMAIL` | Admin | Solo build | `import.meta.env` (Astro) | Service account email |
| `FIREBASE_ADMIN_PRIVATE_KEY` | Admin | Solo build | `import.meta.env` (Astro) | Service account private key |
| `PUBLIC_CONTACT_EMAIL` | Contact | Sí | `import.meta.env` (Astro) | Email para contacto |
| `PUBLIC_WHATSAPP_NUMBER` | Contact | Sí | `import.meta.env` (Astro) | Número WhatsApp |
| `E2E_ADMIN_EMAIL` | Testing | Solo E2E | `process.env` (Node.js) | Email admin para tests |
| `E2E_ADMIN_PASSWORD` | Testing | Solo E2E | `process.env` (Node.js) | Password admin para tests |
| `PUBLIC_USE_EMULATORS` | Dev | No | `import.meta.env` (Astro) | Conectar client SDK a emuladores |
| `USE_EMULATORS` | Dev | No | `import.meta.env` (Astro) | Conectar Admin SDK a emuladores |

**Nota importante:** Variables `PUBLIC_*` y `FIREBASE_ADMIN_*` están tipadas en `src/env.d.ts` y se acceden via `import.meta.env` (contexto Astro). Variables `E2E_*` se acceden via `process.env` en `playwright.config.ts` (contexto Node.js, NO tipadas en env.d.ts — solo disponibles en Playwright runner). Documentar esta distinción en la tabla del README

### CI Impact — Doc-Only Changes

El CI workflow tiene smart skip logic. Archivos fuera de `src/`, `public/`, `tests/`, `package.json`, configs de build se skipean:
- `README.md` → skip build/Lighthouse/deploy ✅
- `LICENSE` → skip build/Lighthouse/deploy ✅

Solo se ejecuta: install → lint → type-check. Esto es correcto — doc changes no necesitan build ni deploy.

### Project Structure Notes

- Solo se crean/modifican archivos en la raíz del repo:
  - `LICENSE` — NUEVO
  - `README.md` — MODIFICADO (reescritura expandida)
- No se modifica `src/`, `tests/`, `package.json` ni ningún archivo de código
- No se agregan dependencias
- `.env.example` probablemente no necesita cambios (ya comprehensivo)

### References

- [Source: _bmad-output/planning-artifacts/epics.md — Epic 5, Story 5.6 (FR47, FR48, FR49)]
- [Source: _bmad-output/planning-artifacts/prd.md — FR47 repo clonable, FR48 zero secrets, FR49 .env.example, NFR9 credentials env vars, NFR13 public repo no secrets]
- [Source: _bmad-output/planning-artifacts/architecture.md — env strategy, Firebase dual SDK, security rules, file structure]
- [Source: _bmad-output/project-context.md — complete tech stack, testing rules, CI/CD pipeline, anti-patterns]
- [Source: README.md — current content (prerequisites, setup, scripts, emulators, tests, CI/CD)]
- [Source: .env.example — 14 variables, client/admin/contact/E2E/emulators sections]
- [Source: .gitignore — secrets protection patterns]
- [Source: .github/workflows/ci.yml — smart skip logic for doc-only changes]
- [Source: src/lib/scripts/ — migrate-firestore-data.ts, seed-experiences.ts, cleanup-e2e-data.ts, cleanup-orphan-images.ts]

### Previous Story Intelligence (5-5)

- Story 5-5 completada: accessibility audit y WCAG 2.1 AA compliance
- 1246 unit tests passing (48 files), 160 E2E tests passing (19 skipped), build 30 pages OK
- Code review 3-layer: 7 findings corregidos (dark text-muted contrast, variable shadowing, aria-live guard, unique aria-labels, focus test loop, keyboard menu test)
- @axe-core/playwright 4.11.1 instalado, 9 E2E accessibility tests creados
- prefers-reduced-motion global, Footer nav semantic, ProjectFilter live region
- Theme-aware color variables (light/dark primary y text-muted)
- Patrón: commits con prefijo semántico en inglés (`feat:`, `fix:`, `docs:`), reviews 3-layer

### Git Intelligence

Últimos commits relevantes:
- `f4b1ad0` fix: code review story 5-5 — dark text-muted contrast, variable shadowing, aria-live guard, unique aria-labels, focus test loop, keyboard menu test
- `6b97596` feat: story 5-5 — accessibility audit, WCAG 2.1 AA compliance, and axe-core E2E tests
- `da45437` docs: validate story 5-5 — i18n paths, ProjectFilter t() import, heading audit, fixtures fix
- `fac4b1c` docs: create story 5-5 accessibility audit y compliance
- `55ee59e` docs: story 5-4 done — code review record, sprint status updated

243 commits totales en el repo. Historia limpia — cero archivos de secrets committedos.

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
