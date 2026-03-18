# Story 1.10: Firebase Client & Admin SDK Configuration

Status: ready-for-dev

## Story

As a developer,
I want Firebase SDKs properly initialized and typed,
So that admin features can use the client SDK and build scripts can query Firestore via Admin SDK.

## Acceptance Criteria

1. **AC-1: Client SDK initialization** — `src/lib/firebase/client.ts` imported in a Svelte island initializes Firebase app with `PUBLIC_FIREBASE_*` env vars and exports `auth`, `db`, `storage` instances
2. **AC-2: Admin SDK initialization** — `src/lib/firebase/admin.ts` imported in build script initializes Admin SDK with `FIREBASE_ADMIN_*` env vars, exports admin `db` and `storage`
3. **AC-3: Typed collection helpers** — `src/lib/firebase/collections.ts` provides typed collection helpers for Projects, Technologies, Experiences, BlogPosts with correct Firestore paths
4. **AC-4: Env validation** — Missing or incomplete `.env` produces clear error indicating which variables are missing
5. **AC-5: Public prefix** — Client SDK config uses `PUBLIC_` prefix variables (safe for browser)
6. **AC-6: Admin SDK isolation** — Admin SDK credentials never reach the browser (only build/CI context)
7. **AC-7: Emulator support** — Both SDKs connect to Firebase Emulators when `USE_EMULATORS=true` / `PUBLIC_USE_EMULATORS=true` is set

## Tasks / Subtasks

- [ ] **Task 1: Create `src/env.d.ts` — TypeScript env var declarations** (AC: 4, 5, 6)
  - [ ] 1.1 Create `src/env.d.ts` extending Astro's `ImportMetaEnv` interface with all `PUBLIC_FIREBASE_*` and `FIREBASE_ADMIN_*` variables
  - [ ] 1.2 Include `PUBLIC_USE_EMULATORS` and `USE_EMULATORS` boolean vars
  - [ ] 1.3 Include `PUBLIC_ADMIN_UID` string var

- [ ] **Task 2: Create `src/lib/firebase/client.ts` — Firebase Client SDK** (AC: 1, 4, 5, 7)
  - [ ] 2.1 Import modular API: `initializeApp`, `getApps` from `'firebase/app'`; `getAuth` from `'firebase/auth'`; `getFirestore` from `'firebase/firestore'`; `getStorage` from `'firebase/storage'`
  - [ ] 2.2 Build `firebaseConfig` object from `import.meta.env.PUBLIC_FIREBASE_*` vars (apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId)
  - [ ] 2.3 Validate all 6 config values are present — if any missing, throw descriptive error listing each missing var name
  - [ ] 2.4 Initialize with singleton pattern: `getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]`
  - [ ] 2.5 Export named: `auth`, `db`, `storage`, `app`
  - [ ] 2.6 Emulator connection: if `import.meta.env.PUBLIC_USE_EMULATORS === 'true'`, call `connectAuthEmulator(auth, 'http://127.0.0.1:9099')`, `connectFirestoreEmulator(db, '127.0.0.1', 8080)`, `connectStorageEmulator(storage, '127.0.0.1', 9199)` — ports match `firebase.json` emulator config
  - [ ] 2.7 Wrap emulator connections in a guard to prevent double-connection on HMR: use a module-level `let emulatorsConnected = false` flag

- [ ] **Task 3: Create `src/lib/firebase/admin.ts` — Firebase Admin SDK** (AC: 2, 4, 6, 7)
  - [ ] 3.1 Import modular API: `initializeApp`, `cert`, `getApps` from `'firebase-admin/app'`; `getFirestore` from `'firebase-admin/firestore'`; `getStorage` from `'firebase-admin/storage'`
  - [ ] 3.2 Read credentials from `import.meta.env`: `FIREBASE_ADMIN_PROJECT_ID`, `FIREBASE_ADMIN_CLIENT_EMAIL`, `FIREBASE_ADMIN_PRIVATE_KEY`
  - [ ] 3.3 Validate all 3 credentials are present — if any missing, throw descriptive error listing each missing var name
  - [ ] 3.4 Handle `FIREBASE_ADMIN_PRIVATE_KEY` newline escaping: `.replace(/\\n/g, '\n')` since env vars store `\n` as literal two-char sequence
  - [ ] 3.5 Initialize with singleton: `getApps().length === 0 ? initializeApp({ credential: cert({...}) }) : getApps()[0]`
  - [ ] 3.6 Export named: `adminDb` (from `getFirestore()`), `adminStorage` (from `getStorage()`)
  - [ ] 3.7 Emulator support: Admin SDK auto-detects `FIRESTORE_EMULATOR_HOST` and `FIREBASE_STORAGE_EMULATOR_HOST` env vars. For explicit `USE_EMULATORS=true`, set `process.env.FIRESTORE_EMULATOR_HOST = '127.0.0.1:8080'` and `process.env.FIREBASE_STORAGE_EMULATOR_HOST = '127.0.0.1:9199'` BEFORE calling `getFirestore()`/`getStorage()`
  - [ ] 3.8 Add file-top comment: `// BUILD TIME ONLY — never import in Svelte islands or client code`

- [ ] **Task 4: Create `src/lib/firebase/collections.ts` — Typed collection helpers** (AC: 3)
  - [ ] 4.1 Export `COLLECTION_PATHS` constant object: `{ projects: 'Projects', technologies: 'Technologies', experiences: 'Experiences', blogPosts: 'BlogPosts' } as const`
  - [ ] 4.2 Import Zod schemas: `projectSchema`, `technologySchema`, `experienceSchema`, `blogPostSchema` and their types
  - [ ] 4.3 Create Firestore Timestamp → JS Date converter helper (private): `function toDate(val: unknown): Date` — handles Firestore `Timestamp` objects (have `.toDate()` method), JS `Date` instances, ISO string dates, and numeric timestamps
  - [ ] 4.4 Create `parseProject(data: Record<string, unknown>, id: string): Project` — spread data, add id, convert date fields if any, validate with `projectSchema.parse()`
  - [ ] 4.5 Create `parseTechnology(data: Record<string, unknown>, id: string): Technology` — spread data, add id, validate with `technologySchema.parse()`
  - [ ] 4.6 Create `parseExperience(data: Record<string, unknown>, id: string): Experience` — spread data, add id, convert `startDate`/`endDate` with `toDate()`, validate with `experienceSchema.parse()`. Note: schema uses `.refine()` that enforces `endDate >= startDate` — invalid date ordering will throw
  - [ ] 4.7 Create `parseBlogPost(data: Record<string, unknown>, id: string): BlogPost` — spread data, add id, convert `createdAt`/`updatedAt` with `toDate()`, validate with `blogPostSchema.parse()`. Note: schema uses `.refine()` that enforces `updatedAt >= createdAt` — invalid date ordering will throw

- [ ] **Task 5: Update `.env.example`** (AC: 5, 7)
  - [ ] 5.1 Add new section at the end of the file following the existing comment format:
    ```
    # Emuladores (solo para desarrollo local)
    # Activar para conectar SDKs a Firebase Emulator Suite en vez de producción
    PUBLIC_USE_EMULATORS=false
    USE_EMULATORS=false
    ```
  - [ ] 5.2 Verify all existing 10 vars (7 PUBLIC_ + 3 FIREBASE_ADMIN_) are still present and documented

- [ ] **Task 6: Unit tests** (AC: 1-7)
  - **Test naming convention:** Follow project standard `[P0] 1.10-UNIT-XXX: description` (see `src/lib/schemas/__tests__/schemas.test.ts` for reference)
  - **Test data:** Use existing factories from `src/test/factories/` (`createProject`, `createTechnology`, `createExperience`, `createBlogPost`) — they generate Zod-valid data. For Timestamp simulation, destructure factory output and replace Date fields with `{ toDate: () => originalDate }` mocks
  - **Emulators NOT needed:** All collections.test.ts tests use pure mock data — no Firebase Emulators required. Only future integration tests will need emulators
  - [ ] 6.1 Create `src/lib/firebase/__tests__/collections.test.ts`:
    - `[P0] 1.10-UNIT-001:` COLLECTION_PATHS has exactly 4 entries with correct Firestore collection names
    - `[P0] 1.10-UNIT-002:` parseProject() with valid factory data returns typed Project
    - `[P1] 1.10-UNIT-003:` parseProject() with missing required field throws ZodError
    - `[P0] 1.10-UNIT-004:` parseTechnology() with valid factory data returns typed Technology
    - `[P0] 1.10-UNIT-005:` parseExperience() with valid factory data (endDate null) returns typed Experience
    - `[P0] 1.10-UNIT-006:` parseExperience() with Firestore-like Timestamp mock (object with `.toDate()` method) converts correctly
    - `[P1] 1.10-UNIT-007:` parseExperience() with endDate < startDate throws (schema `.refine()` validation)
    - `[P0] 1.10-UNIT-008:` parseBlogPost() with valid factory data returns typed BlogPost
    - `[P0] 1.10-UNIT-009:` parseBlogPost() with Timestamp mocks for createdAt/updatedAt converts correctly
    - `[P1] 1.10-UNIT-010:` parseBlogPost() with updatedAt < createdAt throws (schema `.refine()` validation)
  - [ ] 6.2 Create `src/lib/firebase/__tests__/client.test.ts`:
    - Mock `import.meta.env` with valid `PUBLIC_FIREBASE_*` values using `vi.stubEnv()` or `vi.hoisted()` + `vi.mock()` BEFORE dynamic import
    - `[P0] 1.10-UNIT-011:` client.ts module exports `auth`, `db`, `storage`, `app` names
    - `[P1] 1.10-UNIT-012:` client.ts throws descriptive error when env vars are missing
  - [ ] 6.3 Create `src/lib/firebase/__tests__/admin.test.ts`:
    - Mock `import.meta.env` with valid `FIREBASE_ADMIN_*` values BEFORE dynamic import
    - `[P0] 1.10-UNIT-013:` admin.ts module exports `adminDb`, `adminStorage` names
    - `[P1] 1.10-UNIT-014:` admin.ts throws descriptive error when env vars are missing
  - [ ] 6.4 Run `pnpm test` and verify 0 regressions (baseline: 128 tests, 10 files)

- [ ] **Task 7: Build verification** (AC: 1-7)
  - [ ] 7.1 `pnpm type-check` — 0 errors
  - [ ] 7.2 `pnpm test` — all tests pass (baseline: 128, expected: ~140+), 0 regressions
  - [ ] 7.3 `pnpm build` — succeeds (Admin SDK import may need valid env or graceful skip if no env)
  - [ ] 7.4 `pnpm lint` — 0 errors
  - [ ] 7.5 Remove `.gitkeep` from `src/lib/firebase/` since it now has real files

## Dev Notes

### Architecture Constraints

- **Framework:** Astro 6.0.5 SSG (`output: 'static'`), Svelte 5.53.12 for islands, Tailwind CSS 4.2.1
- **Firebase Client SDK:** `firebase@^12.10.0` — modular tree-shakeable API (`firebase/app`, `firebase/auth`, `firebase/firestore`, `firebase/storage`)
- **Firebase Admin SDK:** `firebase-admin@^13.7.0` — modular API (`firebase-admin/app`, `firebase-admin/firestore`, `firebase-admin/storage`)
- **Zod:** `zod@^4.3.6` — schemas already defined in `src/lib/schemas/`

### SDK Boundary — CRITICAL

```
src/lib/firebase/
├── client.ts          ← SOLO browser (Svelte admin islands)
├── admin.ts           ← SOLO build time (astro build, scripts)
├── collections.ts     ← Dual: parse helpers work with data from either SDK
└── __tests__/
```

**NEVER import `admin.ts` in Svelte components or client-side code.** The Admin SDK is a Node.js library — importing it in browser code would:
1. Expose service account credentials in the client bundle
2. Fail because Node.js APIs (`fs`, `crypto`, etc.) aren't available in browser
3. Massively bloat the client bundle

**NEVER import `client.ts` in Astro page frontmatter or build scripts.** The client SDK is designed for browser contexts.

[Source: architecture.md#Service-Boundaries, lines 1040-1045]

### Data Flow Architecture

```
Build time (público):
  astro build → admin.ts (Admin SDK) → Firestore → collections.ts (parse+validate) → HTML estático

Runtime (admin):
  /admin → Svelte island → client.ts (Client SDK) → Firestore → collections.ts (parse+validate) → UI
```

[Source: architecture.md#Data-Flow, lines 1062-1074]

### Environment Variables

Already documented in `.env.example`:

```
# Firebase Client Config (público — usado en browser)
PUBLIC_FIREBASE_API_KEY=your-api-key
PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
PUBLIC_FIREBASE_PROJECT_ID=your-project-id
PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
PUBLIC_FIREBASE_APP_ID=your-app-id
PUBLIC_ADMIN_UID=your-admin-uid

# Firebase Admin SDK (solo build time — NUNCA en browser)
FIREBASE_ADMIN_PROJECT_ID=your-project-id
FIREBASE_ADMIN_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour-key\n-----END PRIVATE KEY-----"
```

**`PUBLIC_` prefix:** Astro exposes these in `import.meta.env` for BOTH server and client code. Non-prefixed vars are only available in server/build context.

[Source: architecture.md#Environment-vars, line 431]

### Astro Env Vars Mechanism

In Astro SSG:
- `import.meta.env.PUBLIC_*` — available in ALL code (client + server). Replaced at build time by Vite.
- `import.meta.env.FIREBASE_ADMIN_*` — available ONLY in server context (Astro pages frontmatter, config, build scripts). NOT available in Svelte islands.
- Env vars are loaded from `.env` file in project root (Vite's dotenv loading)

### Client SDK Initialization Pattern

```typescript
// src/lib/firebase/client.ts — SOLO browser
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.PUBLIC_FIREBASE_API_KEY,
  authDomain: import.meta.env.PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.PUBLIC_FIREBASE_APP_ID,
};

// Validate — throw clear error if env vars missing
const missingVars = Object.entries(firebaseConfig)
  .filter(([, v]) => !v)
  .map(([k]) => k);
if (missingVars.length > 0) {
  throw new Error(
    `Firebase client config incomplete. Missing env vars: ${missingVars.join(', ')}. Check .env file.`
  );
}

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export { app };

// Emulator connection (dev only)
let emulatorsConnected = false;
if (import.meta.env.PUBLIC_USE_EMULATORS === 'true' && !emulatorsConnected) {
  connectAuthEmulator(auth, 'http://127.0.0.1:9099');
  connectFirestoreEmulator(db, '127.0.0.1', 8080);
  connectStorageEmulator(storage, '127.0.0.1', 9199);
  emulatorsConnected = true;
}
```

### Admin SDK Initialization Pattern

```typescript
// src/lib/firebase/admin.ts — BUILD TIME ONLY — never import in Svelte islands
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

// Emulator env vars — set BEFORE SDK initialization
if (import.meta.env.USE_EMULATORS === 'true') {
  process.env.FIRESTORE_EMULATOR_HOST = '127.0.0.1:8080';
  process.env.FIREBASE_STORAGE_EMULATOR_HOST = '127.0.0.1:9199';
}

const projectId = import.meta.env.FIREBASE_ADMIN_PROJECT_ID;
const clientEmail = import.meta.env.FIREBASE_ADMIN_CLIENT_EMAIL;
const privateKey = import.meta.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n');

const missingVars = [
  !projectId && 'FIREBASE_ADMIN_PROJECT_ID',
  !clientEmail && 'FIREBASE_ADMIN_CLIENT_EMAIL',
  !privateKey && 'FIREBASE_ADMIN_PRIVATE_KEY',
].filter(Boolean);

if (missingVars.length > 0) {
  throw new Error(
    `Firebase Admin SDK config incomplete. Missing env vars: ${missingVars.join(', ')}. Check .env file or CI secrets.`
  );
}

if (getApps().length === 0) {
  initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
  });
}

export const adminDb = getFirestore();
export const adminStorage = getStorage();
```

### Collections Helper Pattern

```typescript
// src/lib/firebase/collections.ts — Dual: works with data from either SDK
import { projectSchema } from '../schemas/project-schema';
import type { Project } from '../schemas/project-schema';
import { technologySchema } from '../schemas/technology-schema';
import type { Technology } from '../schemas/technology-schema';
import { experienceSchema } from '../schemas/experience-schema';
import type { Experience } from '../schemas/experience-schema';
import { blogPostSchema } from '../schemas/blog-post-schema';
import type { BlogPost } from '../schemas/blog-post-schema';

export const COLLECTION_PATHS = {
  projects: 'Projects',
  technologies: 'Technologies',
  experiences: 'Experiences',
  blogPosts: 'BlogPosts',
} as const;

// Firestore Timestamp → JS Date converter
function toDate(val: unknown): Date {
  if (val instanceof Date) return val;
  if (val != null && typeof val === 'object' && 'toDate' in val && typeof (val as { toDate: unknown }).toDate === 'function') {
    return (val as { toDate: () => Date }).toDate();
  }
  if (typeof val === 'string') return new Date(val);
  if (typeof val === 'number') return new Date(val);
  throw new Error(`Cannot convert to Date: ${String(val)}`);
}

export function parseProject(data: Record<string, unknown>, id: string): Project {
  return projectSchema.parse({ ...data, id });
}

export function parseTechnology(data: Record<string, unknown>, id: string): Technology {
  return technologySchema.parse({ ...data, id });
}

export function parseExperience(data: Record<string, unknown>, id: string): Experience {
  return experienceSchema.parse({
    ...data,
    id,
    startDate: toDate(data.startDate),
    endDate: data.endDate != null ? toDate(data.endDate) : null,
  });
}

export function parseBlogPost(data: Record<string, unknown>, id: string): BlogPost {
  return blogPostSchema.parse({
    ...data,
    id,
    createdAt: toDate(data.createdAt),
    updatedAt: toDate(data.updatedAt),
  });
}
```

### Firestore Collection Names & Fields

```
Projects/{projectId}         → projectSchema
Technologies/{technologyId}  → technologySchema
Experiences/{experienceId}   → experienceSchema
BlogPosts/{postId}           → blogPostSchema
```

Collection names are **PascalCase plural**. Field names are **camelCase**. Localized fields use nested objects `{ es, en }`. IDs are Firestore auto-generated.

[Source: architecture.md#Naming-Patterns, lines 488-506]

### Firestore Timestamp Handling — CRITICAL

Firestore returns `Timestamp` objects, NOT JS `Date`. The `toDate()` helper in `collections.ts` converts them:

```typescript
// Firestore document data looks like:
{ startDate: Timestamp { seconds: 1234567890, nanoseconds: 0 } }

// After toDate() conversion:
{ startDate: Date('2009-02-13T23:31:30.000Z') }
```

The Zod schemas use `z.date()` which expects JS `Date` instances. The parse helpers in `collections.ts` MUST convert Timestamps before passing data to Zod.

### Emulator Ports (from firebase.json)

| Service   | Port |
|-----------|------|
| Auth      | 9099 |
| Firestore | 8080 |
| Storage   | 9199 |
| UI        | 4000 |

All bound to `127.0.0.1` (localhost only).

[Source: firebase.json#emulators]

### env.d.ts TypeScript Declaration

```typescript
/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
  // Firebase Client Config (PUBLIC_ = available in browser)
  readonly PUBLIC_FIREBASE_API_KEY: string;
  readonly PUBLIC_FIREBASE_AUTH_DOMAIN: string;
  readonly PUBLIC_FIREBASE_PROJECT_ID: string;
  readonly PUBLIC_FIREBASE_STORAGE_BUCKET: string;
  readonly PUBLIC_FIREBASE_MESSAGING_SENDER_ID: string;
  readonly PUBLIC_FIREBASE_APP_ID: string;
  readonly PUBLIC_ADMIN_UID: string;

  // Firebase Admin SDK (server/build only — NEVER in browser)
  readonly FIREBASE_ADMIN_PROJECT_ID: string;
  readonly FIREBASE_ADMIN_CLIENT_EMAIL: string;
  readonly FIREBASE_ADMIN_PRIVATE_KEY: string;

  // Emulators
  readonly PUBLIC_USE_EMULATORS: string;
  readonly USE_EMULATORS: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

### Testing Strategy

**Firebase Emulators NOT required for these unit tests.** All tests use mock data or mocked env vars. Only future integration tests (Epic 2+) will need running emulators.

1. **collections.test.ts** — Test parse helpers with factory data from `src/test/factories/`. Mock Firestore `Timestamp` as `{ toDate: () => originalDate }`. Use factory output, destructure, and replace Date fields with Timestamp mocks. This is the most valuable test file.
2. **client.test.ts** — Mock `import.meta.env` then test module exports and validation errors.
3. **admin.test.ts** — Mock `import.meta.env` then test module exports and validation errors.

**Vitest `import.meta.env` mocking for client/admin tests:**

```typescript
// Option A: vi.stubEnv() — sets individual env vars before dynamic import
import { describe, it, expect, vi, beforeEach } from 'vitest';

beforeEach(() => {
  vi.stubEnv('PUBLIC_FIREBASE_API_KEY', 'test-key');
  vi.stubEnv('PUBLIC_FIREBASE_AUTH_DOMAIN', 'test.firebaseapp.com');
  // ... stub all required vars
});

// Option B: For testing missing vars, DON'T stub them — the module will throw
it('throws descriptive error when env vars missing', async () => {
  // Reset module registry to force re-evaluation
  vi.resetModules();
  await expect(() => import('../client')).rejects.toThrow('Missing env vars');
});
```

**Schema `.refine()` constraints to respect in test data:**
- `experienceSchema`: `endDate >= startDate` (or `endDate === null`)
- `blogPostSchema`: `updatedAt >= createdAt`
- Factory data from `src/test/factories/` already satisfies these constraints

### Build Impact

`admin.ts` is only imported in Astro page frontmatter (build time). Currently no pages import it yet (Epic 2 stories will). The build should still succeed because:
- No Astro page currently imports `admin.ts`
- `client.ts` will be imported in Svelte islands (Epic 3 stories will)
- If no code imports these files, they won't be processed during build

**If build fails due to missing env vars**, it means something is importing `admin.ts` at build time. Verify no Astro page imports it yet.

### Project Structure Notes

- Firebase modules live in `src/lib/firebase/` [Source: architecture.md#Organización-del-proyecto, lines 569-572]
- Tests co-located in `src/lib/firebase/__tests__/` [Source: architecture.md#Tests-co-locados, lines 593-606]
- Architecture names files exactly: `client.ts`, `admin.ts`, `collections.ts` [Source: architecture.md, lines 864-867]
- Remove `.gitkeep` from `src/lib/firebase/` once real files exist

### Critical Anti-Patterns to Avoid

- **NEVER** import `firebase-admin` in client code — it exposes credentials and uses Node.js APIs unavailable in browser
- **NEVER** import `firebase` client SDK in Astro frontmatter for data fetching — use Admin SDK for build-time queries
- **NEVER** hardcode Firebase config values — always use `import.meta.env`
- **NEVER** commit `.env` file — only `.env.example` with placeholder values
- **NEVER** use `firebase/firestore/lite` — use full `firebase/firestore` for offline persistence and real-time capabilities needed by admin
- **NEVER** create separate Firebase app instances per service — use singleton pattern with `getApps()` check
- **NEVER** call `connectFirestoreEmulator()` more than once — it throws on double-connection. Use the `emulatorsConnected` guard
- **NEVER** skip the `privateKey.replace(/\\n/g, '\n')` for Admin SDK — env vars store escaped newlines that must be unescaped

### Previous Story Intelligence (1.9)

**Patterns established to reuse:**
- Svelte 5 `$props()` pattern with `interface Props`
- `import { t } from '../../lib/i18n/translations'` for i18n
- FAB pattern for UI components
- `client:load` for immediate hydration
- Co-located `__tests__/` directories

**Code review learnings from 1.9:**
- D-1: No try/catch on localStorage — acceptable risk in modern browsers
- D-2: Flash of icon on SSG — inherent SSG limitation

**Test baseline after 1.9:** 128 tests, 10 files, type-check 0 errors, lint 0 errors, build succeeds.

### Git Intelligence

Recent commits show clean story-by-story progression:
- `c731f26` docs: mark story 1.9 done
- `51f7af7` feat: implement story 1.9 — ThemeToggle and theme persistence
- `ccf6ae9` feat: implement story 1.8 — i18n foundation and LocaleToggle

**Current baseline:**
- Tests: 128 passing (10 test files)
- Type-check: 0 errors
- Build: 2 pages (/ and /en/)
- Lint: 0 errors

**Expected after this story:**
- Tests: ~140+ (128 baseline + ~12 new Firebase tests)
- Type-check: 0 errors
- Build: 2 pages (unchanged)
- Lint: 0 errors

### Files to Create

| File | Purpose |
|------|---------|
| `src/env.d.ts` | TypeScript declarations for all Firebase env vars |
| `src/lib/firebase/client.ts` | Firebase Client SDK init (browser only) |
| `src/lib/firebase/admin.ts` | Firebase Admin SDK init (build time only) |
| `src/lib/firebase/collections.ts` | Collection paths + typed Zod parse helpers |
| `src/lib/firebase/__tests__/collections.test.ts` | Parse helpers unit tests |
| `src/lib/firebase/__tests__/client.test.ts` | Module structure tests |
| `src/lib/firebase/__tests__/admin.test.ts` | Module structure tests |

### Files to Modify

| File | Change |
|------|--------|
| `.env.example` | Add `PUBLIC_USE_EMULATORS` and `USE_EMULATORS` vars |

### Files to Delete

| File | Reason |
|------|--------|
| `src/lib/firebase/.gitkeep` | Replaced by real source files |

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Epic-1, Story 1.10, lines 418-432]
- [Source: _bmad-output/planning-artifacts/architecture.md#Data-Architecture, lines 188-236]
- [Source: _bmad-output/planning-artifacts/architecture.md#Authentication-Security, lines 352-375]
- [Source: _bmad-output/planning-artifacts/architecture.md#API-Communication-Patterns, lines 377-385]
- [Source: _bmad-output/planning-artifacts/architecture.md#Deployment-Infrastructure, lines 428-450]
- [Source: _bmad-output/planning-artifacts/architecture.md#Naming-Patterns, lines 488-506]
- [Source: _bmad-output/planning-artifacts/architecture.md#Organización-del-proyecto, lines 547-580]
- [Source: _bmad-output/planning-artifacts/architecture.md#Service-Boundaries, lines 1040-1045]
- [Source: _bmad-output/planning-artifacts/architecture.md#Data-Flow, lines 1062-1074]
- [Source: _bmad-output/planning-artifacts/prd.md#NFR8-NFR13, Security requirements]
- [Source: _bmad-output/planning-artifacts/prd.md#NFR26-NFR29, Integration requirements]
- [Source: firebase.json#emulators — port configuration]
- [Source: .env.example — existing env var documentation]
- [Source: package.json — firebase@^12.10.0, firebase-admin@^13.7.0]

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
