# Portfolio — ChrisBP

Personal portfolio built with Astro 6, Svelte 5, Tailwind CSS 4, and Firebase. Static site generation with interactive islands, bilingual content (EN/ES), dark/light theme, and WCAG 2.1 AA compliance.

## Tech Stack

| Technology | Version | Role |
|-----------|---------|------|
| Astro | 6.0.5 | Static site generator, file-based routing |
| Svelte | 5.53.12 | Interactive islands (admin, filters, toggles) |
| Tailwind CSS | 4.2.1 | Utility-first styling via Vite plugin |
| Firebase | 12.10.0 | Auth, Firestore, Storage (client SDK) |
| firebase-admin | 13.7.0 | Build-time data fetching (Admin SDK) |
| TypeScript | 5.9.3 | Strict mode (`astro/tsconfigs/strictest`) |
| Zod | 4.3.6 | Runtime data validation schemas |
| Vitest | 4.1.0 | Unit testing |
| Playwright | 1.58.2 | End-to-end testing |
| Lighthouse CI | 0.15.1 | Performance, a11y, SEO quality gates |

> Versions reflect the minimum from `package.json` (caret ranges). Actual installed versions may be higher.

## Architecture Overview

The site follows the **Astro Islands** pattern:

- **SSG (Static Site Generation)** — All public pages are pre-rendered at build time with zero JavaScript by default
- **Svelte Islands** — Interactive components (admin forms, theme toggle, locale toggle, project filters) hydrate client-side via `client:load`
- **Firebase dual SDK** — Admin SDK fetches data at build time (SSG); Client SDK handles auth and real-time operations in the browser
- **File-based routing** — Pages in `src/pages/` map directly to URLs
- **i18n** — English (default, no URL prefix) and Spanish (`/es/` prefix) with a custom translation dictionary
- **Theming** — Dark/light mode with CSS custom properties, persisted to localStorage
- **Accessibility** — WCAG 2.1 AA compliant, audited with axe-core

## Prerequisites

- **Node.js** 22.12.0+ (use `.nvmrc` — run `nvm use` if available)
- **pnpm** 10+
- **Java JDK** 21+ (required by Firebase Emulator Suite)
- **Firebase project** (see [Firebase Setup](#firebase-setup))

## Getting Started

```bash
# 1. Clone the repository
git clone https://github.com/ChrisBP-Dev/portfolio.git
cd portfolio

# 2. Install dependencies
pnpm install

# 3. Install Playwright browsers (for E2E tests)
pnpm exec playwright install

# 4. Configure environment variables
cp .env.example .env
# Edit .env with your Firebase project values

# 5. Start Firebase emulators (separate terminal)
pnpm emulators

# 6. Start development server
pnpm dev

# 7. Open http://localhost:4321
```

## Firebase Setup

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable **Authentication** (Email/Password provider)
3. Enable **Cloud Firestore** (start in test mode or configure rules from `firestore.rules`)
4. Enable **Cloud Storage** (configure rules from `storage.rules`)
5. Go to **Project Settings → General** to get the web app config values (apiKey, authDomain, etc.)
6. Go to **Project Settings → Service accounts → Generate new private key** to get the Admin SDK credentials

Fill in your `.env` file with the values from steps 5 and 6.

> **Important:** The build process (`pnpm build`) runs Admin SDK queries at build time to fetch data from Firestore. This requires real Firebase credentials — emulators do not support Admin SDK queries during static site generation. For local development with `pnpm dev`, emulators work fine for client-side operations.

## Data Seeding

| Script | Command | Description |
|--------|---------|-------------|
| Migrate | `pnpm migrate` | Migrate data from Flutter schema to professional schema. Only needed if importing data from a previous Flutter version. Supports `--dry-run` |
| Seed Experiences | `pnpm seed:experiences` | Populate the Experiences collection with 3 bilingual sample entries (EN/ES). Checks for existing data before inserting. Supports `--dry-run` |
| Cleanup E2E | `pnpm cleanup:e2e` | Remove orphaned E2E test data (`e2e-*` documents and associated images) |
| Cleanup Images | `pnpm cleanup:images` | Remove orphaned images from Storage by comparing against Firestore references. Default is dry-run; use `--execute` to delete |

## Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| Dev | `pnpm dev` | Start Astro development server |
| Build | `pnpm build` | Production build (SSG) |
| Preview | `pnpm preview` | Preview production build at localhost:4321 |
| Type Check | `pnpm type-check` | TypeScript type verification |
| Lint | `pnpm lint` | Run ESLint |
| Format | `pnpm format` | Format code with Prettier |
| Test | `pnpm test` | Run unit tests (Vitest) |
| Test Watch | `pnpm test:watch` | Run unit tests in watch mode |
| Test Coverage | `pnpm test:coverage` | Run unit tests with coverage report |
| Test E2E | `pnpm test:e2e` | Run end-to-end tests (Playwright) |
| Emulators | `pnpm emulators` | Start Firebase Emulator Suite (Auth, Firestore, Storage) |
| Migrate | `pnpm migrate` | Run Firestore data migration script |
| Seed Experiences | `pnpm seed:experiences` | Seed sample experience entries |
| Cleanup E2E | `pnpm cleanup:e2e` | Clean up orphaned E2E test data |
| Cleanup Images | `pnpm cleanup:images` | Clean up orphaned Storage images |

## Testing

### Unit Tests

```bash
pnpm test              # run once
pnpm test:watch        # watch mode
pnpm test:coverage     # with coverage report
```

Unit tests use Vitest with Astro's `getViteConfig()`. Test files are co-located at `src/**/__tests__/*.test.ts`. Test data factories are available in `src/test/factories/`.

### End-to-End Tests

```bash
pnpm build && pnpm test:e2e
```

E2E tests use Playwright and require a production build first. Tests are located in `tests/e2e/`. Accessibility tests use `@axe-core/playwright` for automated WCAG 2.1 AA validation.

### Lighthouse CI

```bash
pnpm build && pnpm exec lhci autorun
```

Enforces scores >95 for Accessibility, Best Practices, and SEO on all pages. Performance >95 is enforced on most pages, with a relaxed threshold (>70, warn-only) for project detail pages due to dynamic image content. Configuration is in `lighthouserc.cjs`.

## Deployment

### Firebase Hosting

```bash
pnpm exec firebase deploy --only hosting
```

### CI/CD Pipeline (GitHub Actions)

The pipeline runs on every push to `main` and supports manual trigger via `workflow_dispatch`:

```
install → lint → type-check → unit tests (with emulators) → build → Lighthouse CI → deploy
```

If any step fails, the pipeline stops and deployment does not occur. E2E tests run locally only (`pnpm build && pnpm test:e2e`) and are not part of the CI pipeline.

Smart skip logic: documentation-only changes (README, LICENSE, etc.) skip the build, Lighthouse, and deploy steps. Lint, type-check, and unit tests always run.

Manual rebuild from CLI:

```bash
gh workflow run ci.yml
```

### GitHub Secrets

Two secrets are required for CI/CD:

**`FIREBASE_SERVICE_ACCOUNT`** — Firebase Admin SDK service account JSON. Use the full JSON file downloaded from Firebase Console (Project Settings → Service accounts → Generate new private key). Key fields used by CI:

```json
{
  "project_id": "...",
  "client_email": "...",
  "private_key": "..."
}
```

**`FIREBASE_CLIENT_CONFIG`** — Public Firebase client config + app info JSON:

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

Setup: GitHub repo → Settings → Secrets and variables → Actions → New repository secret.

## Project Structure

```
src/
├── assets/          # Static assets (images, fonts)
├── components/      # UI components
│   ├── admin/       # Admin panel components (CRUD, forms, editor)
│   ├── blog/        # Blog listing and article components
│   ├── common/      # Shared components (Badge, ImageViewer, SEO)
│   ├── contact/     # Contact page components
│   ├── home/        # Homepage sections (About, Projects, Experience)
│   ├── layout/      # Header, Footer, Sidebar, navigation
│   └── projects/    # Project listing and detail components
├── data/            # Navigation data and static constants
├── layouts/         # Page layouts (BaseLayout, AdminLayout)
├── lib/             # Core libraries and utilities
│   ├── firebase/    # Firebase client and admin SDK configuration
│   ├── i18n/        # Internationalization (translations, locale utils)
│   ├── schemas/     # Zod validation schemas (data models)
│   ├── scripts/     # CLI scripts (migrate, seed, cleanup)
│   ├── types/       # TypeScript type definitions
│   └── utils/       # Shared utilities (slug, date, sanitize)
├── pages/           # File-based routing
│   ├── admin/       # Admin panel pages (protected)
│   ├── blog/        # Blog pages (listing, [slug])
│   ├── es/          # Spanish locale pages
│   ├── projects/    # Project pages (listing, [slug])
│   ├── contact.astro
│   └── index.astro  # Homepage
├── styles/          # Global styles and Tailwind configuration
└── test/            # Test utilities and data factories
```

## Environment Variables

All variables are documented in `.env.example`. Copy it to `.env` and fill in your values.

### Firebase Client (required)

| Variable | Description | Access |
|----------|-------------|--------|
| `PUBLIC_FIREBASE_API_KEY` | Firebase Web API key | `import.meta.env` (browser) |
| `PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase Auth domain | `import.meta.env` (browser) |
| `PUBLIC_FIREBASE_PROJECT_ID` | Firebase project ID | `import.meta.env` (browser) |
| `PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase Storage bucket | `import.meta.env` (browser) |
| `PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | FCM sender ID | `import.meta.env` (browser) |
| `PUBLIC_FIREBASE_APP_ID` | Firebase app ID | `import.meta.env` (browser) |
| `PUBLIC_ADMIN_UID` | Admin user UID | `import.meta.env` (browser) |

### Firebase Admin (required for build)

| Variable | Description | Access |
|----------|-------------|--------|
| `FIREBASE_ADMIN_PROJECT_ID` | Project ID (Admin SDK) | `import.meta.env` (build-time) |
| `FIREBASE_ADMIN_CLIENT_EMAIL` | Service account email | `import.meta.env` (build-time) |
| `FIREBASE_ADMIN_PRIVATE_KEY` | Service account private key | `import.meta.env` (build-time) |

### Contact (required)

| Variable | Description | Access |
|----------|-------------|--------|
| `PUBLIC_CONTACT_EMAIL` | Contact email address | `import.meta.env` (browser) |
| `PUBLIC_WHATSAPP_NUMBER` | WhatsApp number | `import.meta.env` (browser) |

### E2E Testing (required for E2E tests only)

| Variable | Description | Access |
|----------|-------------|--------|
| `E2E_ADMIN_EMAIL` | Admin email for E2E tests | `process.env` (Node.js / Playwright) |
| `E2E_ADMIN_PASSWORD` | Admin password for E2E tests | `process.env` (Node.js / Playwright) |

### Emulators (optional)

| Variable | Description | Access |
|----------|-------------|--------|
| `PUBLIC_USE_EMULATORS` | Connect client SDK to emulators | `import.meta.env` (browser) |
| `USE_EMULATORS` | Connect Admin SDK to emulators | `import.meta.env` (build-time) |

> **Note:** `PUBLIC_*` and `FIREBASE_ADMIN_*` variables are typed in `src/env.d.ts` and accessed via `import.meta.env` (Astro context). `E2E_*` variables are accessed via `process.env` in `playwright.config.ts` (Node.js context) and are not typed in `env.d.ts`.

## Built With AI

This portfolio is a brownfield migration from a Flutter Web app. The entire lifecycle — product brief, PRD, architecture, UX design, epics, stories, implementation, code review, and retrospectives — was orchestrated using the [BMad Method](https://github.com/bmadcode/BMAD-METHOD) (an AI-assisted development framework) and [Claude Code CLI](https://docs.anthropic.com/en/docs/claude-code) by Anthropic. Specialized BMAD agents handled each phase, from strategic planning through production deployment.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
