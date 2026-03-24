---
title: 'Project Ordering & Featured Selection'
type: 'feature'
created: '2026-03-24'
status: 'done'
baseline_commit: 'd1b4899'
context:
  - '_bmad-output/planning-artifacts/architecture.md'
  - '_bmad-output/planning-artifacts/prd.md'
---

# Project Ordering & Featured Selection

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Projects are ordered by slug (alphabetical), and home page shows the first 3 — making it impossible to control which projects appear as "featured" or in what order. New projects like TimeMoney (slug: "timemoney") can never appear on the home page.

**Approach:** Add `order` (int) and `featured` (boolean) fields to the project schema. Admin list gets drag-and-drop reordering and a featured toggle per row. Public pages sort by `order` (with slug tiebreaker for backward compatibility). Home page filters by `featured` flag, falling back to first 3 by order if fewer than 3 are marked.

## Boundaries & Constraints

**Always:**
- Sort client-side after fetch (no Firestore `orderBy('order')`) so existing docs without `order` field are included
- Batch-update all `order` values on drag-drop completion (one `updateDoc` per project)
- Enforce max 3 featured projects in admin UI with toast warning
- Use HTML5 Drag and Drop API — zero new dependencies
- Backward compatible: docs missing `order`/`featured` get defaults (0 / false)

**Ask First:**
- Changing the featured max from 3 to a configurable number
- Adding touch/mobile drag-drop support beyond HTML5 DnD

**Never:**
- Add drag-drop libraries (sortablejs, svelte-dnd-action, etc.)
- Touch technologies or experiences ordering (separate scope)
- Change existing project fields or slug behavior
- Create a Firestore composite index

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Drag reorder | Drag project A above B | All projects get sequential `order` (0,1,2…), Firestore batch update | Toast error + revert local array |
| Toggle featured (< 3 active) | Click star on unfeatured project | `featured = true`, single `updateDoc` | Toast error on Firestore failure |
| Toggle featured (3 already active) | Click star on 4th project | Toggle blocked, no write | Toast warning: max 3 |
| Unfeatured toggle | Click star on featured project | `featured = false`, single `updateDoc` | Toast error on Firestore failure |
| Home page (3 featured) | 3 projects marked featured | Shows exactly those 3, sorted by `order` | N/A |
| Home page (< 3 featured) | 1 featured project | Shows all projects by `order`, takes first 3 | N/A |
| First load (no order fields) | Existing 6 docs, no `order`/`featured` | All get `order: 0`, sorted by slug tiebreaker | N/A |
| Create new project | Admin creates project | `order = max(existing orders) + 1`, `featured = false` | N/A |

</frozen-after-approval>

## Code Map

- `src/lib/schemas/project-schema.ts` -- Add `order` + `featured` fields to all 3 schemas
- `src/lib/firebase/collections.ts` -- Remove `orderBy('slug')`, sort in JS by order then slug
- `src/components/admin/ProjectList.svelte` -- Drag-drop reorder + featured star toggle
- `src/components/admin/ProjectForm.svelte` -- Set `order` on create (max+1), preserve on edit
- `src/pages/index.astro` -- Filter featured projects for home preview
- `src/pages/es/index.astro` -- Same featured filter for Spanish
- `src/lib/i18n/translations.ts` -- Add featured/reorder translation keys
- `src/components/admin/__tests__/project-list.test.ts` -- Unit tests for reorder + featured logic
- `tests/e2e/admin-projects.spec.ts` -- E2E tests for drag-drop + featured toggle

## Tasks & Acceptance

**Execution:**
- [x] `src/lib/schemas/project-schema.ts` -- Add `order: z.number().int().nonneg().default(0)` and `featured: z.boolean().default(false)` to `projectSchema`; propagate to `projectFirestoreSchema` and `projectFormSchema` (exclude `order` from form schema — managed by list, not form)
- [x] `src/lib/firebase/collections.ts` -- In `getAllProjects()`, remove `orderBy('slug')`, fetch all docs, sort in JS: `(a.order - b.order) || a.slug.localeCompare(b.slug)`
- [x] `src/lib/i18n/translations.ts` -- Add keys: `admin.projects.featured`, `admin.projects.maxFeatured`, `admin.projects.reorderError`, `admin.projects.featuredToggleError`
- [x] `src/components/admin/ProjectList.svelte` -- Add HTML5 DnD (draggable rows, dragstart/dragover/drop handlers), featured star toggle per row, batch `updateDoc` on drop, max-3 enforcement on toggle, visual drag feedback (opacity + drop indicator)
- [x] `src/components/admin/ProjectForm.svelte` -- On create: compute `order = Math.max(...existingOrders) + 1` (query collection count or receive from parent); set `featured: false`. On edit: preserve existing `order` and `featured` values in `buildFormData()`
- [x] `src/pages/index.astro` + `src/pages/es/index.astro` -- Replace `projects.slice(0, 3)` with: `const featured = projects.filter(p => p.featured); const projectsPreview = featured.length >= 3 ? featured.slice(0, 3) : projects.slice(0, 3);`
- [x] `src/components/admin/__tests__/project-list.test.ts` -- Tests: reorder updates order fields sequentially, featured toggle writes to Firestore, max-3 enforcement shows warning, unfeatured toggle decrements count
- [x] `tests/e2e/admin-projects.spec.ts` -- E2E: drag project reorders list, featured toggle marks project, max-3 validation blocks 4th, home page renders featured projects

**Acceptance Criteria:**
- Given the admin projects list, when I drag a project to a new position, then all projects receive sequential `order` values (0,1,2…) and the new order persists on reload
- Given fewer than 3 featured projects, when I click the star toggle, then `featured` becomes true and persists in Firestore
- Given 3 projects already featured, when I click the star on a 4th project, then a warning toast appears and no write occurs
- Given 3 projects marked as featured, when the home page renders, then exactly those 3 projects appear in the "Featured Projects" section sorted by their `order`
- Given no projects marked as featured, when the home page renders, then the first 3 projects by `order` appear as fallback

## Verification

**Commands:**
- `pnpm test` -- expected: all existing + new unit tests pass
- `pnpm test:e2e` -- expected: admin project E2E tests pass including new drag/featured tests
- `pnpm lint` -- expected: zero warnings
- `pnpm type-check` -- expected: zero errors
- `pnpm build` -- expected: SSG build succeeds with new schema fields

## Spec Change Log

### Review 1 (2026-03-24)
**Trigger:** 3 reviewers flagged that marking 1-2 featured projects had no visible effect on homepage.
**Amendment:** Changed home page logic to `[...featured, ...nonFeatured].slice(0, 3)` — featured always appear first, padded with non-featured.
**Avoids:** Admin marks a project as featured with no visible result on home page.
**Patches applied:** NaN-safe maxOrder, drag restricted to handle only, `featured` omitted from formSchema, duplicate schema fields removed, `role="list"` added, reordering guard, E2E drag assertion.
