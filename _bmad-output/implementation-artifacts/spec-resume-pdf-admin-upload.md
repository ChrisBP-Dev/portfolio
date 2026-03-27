---
title: 'Resume PDF Admin Upload'
type: 'feature'
created: '2026-03-27'
status: 'done'
baseline_commit: '1c0a754'
context: ['docs/project-context.md']
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The resume PDF lives as a static file in `public/resume.pdf`, exposing personal data (phone, email, address) in a public open-source repository. There is no way to update it from the admin panel.

**Approach:** Store the resume PDF in Firebase Storage, manage upload/replace/preview from the admin panel (new `/admin/resume` page), and serve the download URL dynamically at build time via Firestore metadata. Remove `public/resume.pdf` from the repo.

## Boundaries & Constraints

**Always:**
- Follow existing admin patterns (Astro page + AuthGuard + Svelte `client:only`)
- Use `image-service.ts` upload pattern (progress tracking, cancellable)
- Store metadata in a `Settings` Firestore document (single doc, not a collection — portfolio has one resume)
- Validate PDF type (`application/pdf`) and max size (10 MB)
- Add i18n keys for all UI strings (ES/EN)
- Add the Resume nav item to AdminSidebar

**Ask First:**
- If Storage security rules need modification

**Never:**
- Do not version resumes — store only the current one (replace on upload, delete old)
- Do not create a full CRUD page pattern — this is a single-document manager, not a list
- Do not modify Firestore security rules (only Storage rules if needed)

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| No resume uploaded yet | Settings doc missing or no resume field | Show empty state with upload prompt | N/A |
| Upload valid PDF | File type=application/pdf, size<10MB | Upload to Storage, save metadata to Settings, show preview | N/A |
| Upload non-PDF file | File type=image/png | Reject with validation error before upload | Show inline error |
| Upload oversized PDF | File size>10MB | Reject with validation error before upload | Show inline error |
| Replace existing resume | New PDF when one already exists | Upload new, delete old from Storage, update Settings | If delete-old fails, log warning (non-blocking) |
| Preview current resume | Settings doc has resume URL | Render PDF in iframe or open in new tab | N/A |
| Download button (public site) | Build time — Settings doc has resume URL | HeroSection renders download link with Storage URL | If no resume in Settings, hide button |
| Upload network failure | Upload interrupted | Cancel upload, show error toast, no orphan in Storage | Toast error message |

</frozen-after-approval>

## Code Map

- `src/lib/schemas/resume-schema.ts` -- New schema for resume metadata (url, storagePath, fileName, uploadedAt)
- `src/lib/firebase/collections.ts` -- Add Settings collection path and getResumeUrl helper
- `src/pages/admin/resume.astro` -- New admin page (Astro + AuthGuard pattern)
- `src/components/admin/ResumeManager.svelte` -- Single-document manager: preview + upload + replace
- `src/components/admin/AdminSidebar.svelte` -- Add Resume nav item
- `src/lib/i18n/translations.ts` -- Add admin.resume.* and admin.sidebar.resume keys
- `src/components/home/HeroSection.astro` -- Replace static `/resume.pdf` with dynamic URL from Firestore
- `src/pages/index.astro` -- Pass resumeUrl prop to HeroSection
- `src/pages/es/index.astro` -- Pass resumeUrl prop to HeroSection (ES)

## Tasks & Acceptance

**Execution:**
- [x] `src/lib/schemas/resume-schema.ts` -- Create storedResumeSchema (url, storagePath, fileName, uploadedAt) with parse helper -- Type safety for resume metadata
- [x] `src/lib/firebase/collections.ts` -- Add `settings: 'Settings'` to COLLECTION_PATHS, add `getResumeUrl(db)` that reads `Settings/resume` doc and returns url or null -- Build-time data fetching for HeroSection
- [x] `src/lib/i18n/translations.ts` -- Add admin.resume.* keys (title, upload, replace, preview, empty, invalidType, fileTooLarge, uploadSuccess, uploadError, deleteConfirm) and admin.sidebar.resume -- i18n consistency
- [x] `src/components/admin/ResumeManager.svelte` -- Build single-doc manager: load current resume from Settings/resume, show preview (iframe or link), upload button with drag-drop, progress bar, replace flow with old-file cleanup -- Core feature
- [x] `src/pages/admin/resume.astro` -- Create admin page following experiences.astro pattern (AdminLayout + AuthGuard + ResumeManager) -- Routing
- [x] `src/components/admin/AdminSidebar.svelte` -- Add `{ path: '/admin/resume', labelKey: 'admin.sidebar.resume', icon: 'resume' }` to navItems with file/document SVG icon -- Navigation
- [x] `src/components/home/HeroSection.astro` -- Accept optional `resumeUrl` prop; if present use it for download href, if absent hide button -- Dynamic resume URL
- [x] `src/pages/index.astro` + `src/pages/es/index.astro` -- Fetch resume URL from Firestore at build time via `getResumeUrl(db)`, pass as prop to HeroSection -- Data plumbing
- [x] Remove `public/resume.pdf` from repo and add to `.gitignore` -- Security fix (the original motivation)

**Acceptance Criteria:**
- Given an authenticated admin, when navigating to /admin/resume, then the resume manager page loads with AuthGuard protection
- Given no resume uploaded, when the page loads, then an empty state with upload prompt is shown
- Given a valid PDF selected, when upload completes, then the file is in Firebase Storage and metadata is in Settings/resume
- Given a resume exists, when viewing the manager, then the current PDF can be previewed and the filename/date are shown
- Given a resume URL exists at build time, when the home page renders, then the download button uses the Storage URL
- Given no resume URL at build time, when the home page renders, then the download button is hidden

## Verification

**Commands:**
- `pnpm type-check` -- expected: no errors
- `pnpm lint` -- expected: no errors
- `pnpm test` -- expected: all tests pass
- `pnpm build` -- expected: build succeeds, home page renders correctly

## Suggested Review Order

**Schema & data layer**

- Zod schema + Firestore Timestamp-to-Date conversion for resume metadata
  [`resume-schema.ts:1`](../../src/lib/schemas/resume-schema.ts#L1)

- Settings collection path + build-time `getResumeUrl` helper
  [`collections.ts:105`](../../src/lib/firebase/collections.ts#L105)

**Core feature — ResumeManager**

- Entry point: state declarations, STORAGE_PATH constant, activeTask for cancellation
  [`ResumeManager.svelte:14`](../../src/components/admin/ResumeManager.svelte#L14)

- `loadResume` — uses `parseStoredResume` with try/catch for malformed data
  [`ResumeManager.svelte:27`](../../src/components/admin/ResumeManager.svelte#L27)

- `validateFile` — PDF-only + 10MB max enforcement
  [`ResumeManager.svelte:49`](../../src/components/admin/ResumeManager.svelte#L49)

- `uploadResume` — concurrent guard, progress tracking, Firestore rollback on failure
  [`ResumeManager.svelte:59`](../../src/components/admin/ResumeManager.svelte#L59)

- `cancelUpload` — user-cancellable via activeTask reference
  [`ResumeManager.svelte:136`](../../src/components/admin/ResumeManager.svelte#L136)

- `confirmDelete` — Firestore delete + non-blocking Storage cleanup
  [`ResumeManager.svelte:176`](../../src/components/admin/ResumeManager.svelte#L176)

**Public site integration**

- HeroSection accepts optional `resumeUrl` prop; button hidden when absent, `download` attribute preserved
  [`HeroSection.astro:13`](../../src/components/home/HeroSection.astro#L13)

- Build-time fetch and prop passing (EN)
  [`index.astro:21`](../../src/pages/index.astro#L21)

- Build-time fetch and prop passing (ES)
  [`es/index.astro:21`](../../src/pages/es/index.astro#L21)

**Admin navigation & routing**

- Resume nav item added to sidebar with document icon
  [`AdminSidebar.svelte:25`](../../src/components/admin/AdminSidebar.svelte#L25)

- Admin page — standard AuthGuard pattern
  [`resume.astro:1`](../../src/pages/admin/resume.astro#L1)

**Supporting changes**

- i18n: 22 admin.resume.* keys (ES/EN)
  [`translations.ts:387`](../../src/lib/i18n/translations.ts#L387)

- COLLECTION_PATHS test updated (4 → 5 entries)
  [`collections.test.ts:36`](../../src/lib/firebase/__tests__/collections.test.ts#L36)

- `.gitignore` + `public/resume.pdf` removed from tracking
