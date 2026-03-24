---
title: 'Technology Ordering — Admin Drag-Drop Reorder'
type: 'feature'
created: '2026-03-24'
status: 'done'
baseline_commit: 'a206db1'
context:
  - '_bmad-output/implementation-artifacts/tech-spec-project-ordering-and-featured.md'
---

# Technology Ordering — Admin Drag-Drop Reorder

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Technologies in the "Knowledge Of" section and admin list are ordered alphabetically by name. There is no way to control display order — new technologies always sort by name regardless of importance.

**Approach:** Add `order` field to technology schema. Replicate the drag-drop + keyboard reorder pattern from ProjectList into TechnologyList. Public query sorts by `order` with `name` tiebreaker for backward compatibility.

## Boundaries & Constraints

**Always:**
- Replicate exact ProjectList DnD pattern: grip handle, canDrag gate, keyboard ArrowUp/Down, aria-live, reordering guard, writeBatch persistence
- Sort client-side after fetch (no Firestore `orderBy('order')`) for backward compat with docs missing `order`
- Omit `order` from `technologyFormSchema` — managed by list only

**Ask First:**
- Adding `featured` to technologies (out of scope)

**Never:**
- Change existing technology fields (name, image, experienceYears)
- Touch Projects or Experiences ordering code
- Add new dependencies

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Drag reorder | Drag tech A above B | All techs get sequential `order` (0,1,2…), batch persist | Toast error + revert via reload |
| Keyboard reorder | ArrowDown on grip handle | Tech moves down one position, focus follows, aria-live announces | N/A |
| First load (no order fields) | Existing 6 docs, no `order` | All get `order: 0`, sorted by name tiebreaker | N/A |
| Create new tech | Admin creates technology | `order = max(existing) + 1` | N/A |
| Concurrent drag guard | Second drag during persist | Blocked by `reordering` flag | N/A |

</frozen-after-approval>

## Code Map

- `src/lib/schemas/technology-schema.ts` -- Add `order` field to all schemas
- `src/lib/firebase/collections.ts` -- Remove `orderBy('name')`, sort in JS by order then name
- `src/components/admin/TechnologyList.svelte` -- Add drag-drop + keyboard reorder (replicate ProjectList pattern)
- `src/components/admin/TechnologyForm.svelte` -- Set `order = max + 1` on create
- `src/lib/i18n/translations.ts` -- Add technology reorder translation keys
- `src/components/admin/__tests__/technology-list.test.ts` -- Update tests for reorder logic
- `tests/e2e/admin-technologies.spec.ts` -- E2E for drag reorder

## Tasks & Acceptance

**Execution:**
- [x] `src/lib/schemas/technology-schema.ts` -- Add `order: z.number().int().nonnegative().default(0)` to `technologySchema`; propagate to `technologyFirestoreSchema`; omit from `technologyFormSchema`
- [x] `src/lib/firebase/collections.ts` -- In `getAllTechnologies()`, remove `orderBy('name')`, sort in JS: `(a.order - b.order) || a.name.localeCompare(b.name)`
- [x] `src/lib/i18n/translations.ts` -- Add keys: `admin.technologies.reorderError`, `admin.technologies.dragHandle`
- [x] `src/components/admin/TechnologyList.svelte` -- Add full DnD pattern from ProjectList: draggedIndex, dropTargetIndex, reordering, canDrag, liveAnnouncement states; handleDragStart (gated by canDrag), handleDragOver, handleDragLeave, handleDrop, handleDragEnd, handleKeyboardReorder, persistOrder (writeBatch); grip handle button with onmousedown/onkeydown; draggable rows with visual feedback; `role="list"` on container; aria-live region
- [x] `src/components/admin/TechnologyForm.svelte` -- On create: query existing techs to compute `maxOrder + 1` with NaN-safe reduce; add `order` to addDoc payload
- [x] `src/components/admin/__tests__/technology-list.test.ts` -- Add tests: reorder assigns sequential order, batch persist called, keyboard reorder up/down, concurrent drag guard
- [x] `tests/e2e/admin-technologies.spec.ts` -- Add E2E: drag reorder with assertion on reload

**Acceptance Criteria:**
- Given the admin technologies list, when I drag a technology to a new position, then all technologies receive sequential `order` values and the new order persists on reload
- Given the admin technologies list, when I press ArrowDown on a grip handle, then the technology moves down one position and focus follows
- Given the home page "Knowledge Of" section, when technologies have custom order values, then they display in that order

## Verification

**Commands:**
- `pnpm test` -- expected: all existing + new tests pass
- `pnpm test:e2e` -- expected: admin technology E2E tests pass
- `pnpm lint` -- expected: zero warnings
- `pnpm type-check` -- expected: zero errors
