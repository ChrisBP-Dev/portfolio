---
title: 'SortableJS Migration — Touch-Compatible Drag-Drop Reorder'
type: 'refactor'
created: '2026-03-24'
status: 'done'
baseline_commit: 'fd9e7b8'
context:
  - '_bmad-output/implementation-artifacts/tech-spec-project-ordering-and-featured.md'
  - '_bmad-output/implementation-artifacts/tech-spec-technology-ordering.md'
---

# SortableJS Migration — Touch-Compatible Drag-Drop Reorder

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** HTML5 Drag and Drop API does not support touch devices. Admin drag-drop reordering in ProjectList and TechnologyList is completely non-functional on mobile/tablet.

**Approach:** Replace HTML5 DnD with SortableJS (~10KB gzipped) in both components. Remove keyboard reorder (impractical). Keep persistOrder, aria-live, reordering guard, and featured toggle.

## Boundaries & Constraints

**Always:**
- Use SortableJS `handle` option pointing to grip handle — drag only from handle
- Use SortableJS `animation: 150` for smooth visual feedback
- Initialize Sortable in `$effect`, destroy on cleanup
- Keep `persistOrder`, `liveAnnouncement`, `reordering` guard, featured toggle
- Disable Sortable via `disabled` option when `reordering` is true

**Ask First:**
- Adding SortableJS to other components beyond ProjectList and TechnologyList

**Never:**
- Change persistOrder / writeBatch logic
- Touch featured toggle logic

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Mouse drag from handle | Mousedown on grip + drag | Item follows cursor with animation, reorders on drop | Toast error + revert on persist fail |
| Touch drag from handle | Touch on grip + drag | Item follows finger with animation, reorders on drop | Toast error + revert on persist fail |
| Drag from non-handle area | Click/touch on edit/delete/star | No drag initiated | N/A |
| Concurrent drag guard | Drag during persist | Blocked by Sortable `disabled: true` | N/A |

</frozen-after-approval>

## Code Map

- `package.json` -- Add `sortablejs` + `@types/sortablejs`
- `src/components/admin/ProjectList.svelte` -- Replace HTML5 DnD with SortableJS; remove keyboard reorder
- `src/components/admin/TechnologyList.svelte` -- Same migration
- `src/components/admin/__tests__/project-list.test.ts` -- Remove HTML5 DnD + keyboard tests; keep reorder logic, persistOrder, featured
- `src/components/admin/__tests__/technology-list.test.ts` -- Same cleanup
- `tests/e2e/admin-projects.spec.ts` -- Verify E2E drag still works

## Tasks & Acceptance

**Execution:**
- [x] `package.json` -- `pnpm add sortablejs && pnpm add -D @types/sortablejs`
- [x]`src/components/admin/ProjectList.svelte` -- Remove: `draggedIndex`, `dropTargetIndex`, `canDrag` states; `handleDragStart`, `handleDragOver`, `handleDragLeave`, `handleDrop`, `handleDragEnd`, `handleKeyboardReorder` functions; all `draggable`/`ondrag*`/`onmousedown`/`onkeydown` markup attrs; conditional drag classes. Add: import Sortable; `$effect` that creates `Sortable.create(listEl, { handle, animation, ghostClass, onEnd })` where `onEnd` reorders array + sets liveAnnouncement + calls persistOrder; bind `listEl` ref; toggle `sortableInstance.option('disabled', reordering)` reactively; destroy on cleanup
- [x]`src/components/admin/TechnologyList.svelte` -- Same SortableJS migration
- [x]`src/components/admin/__tests__/project-list.test.ts` -- Remove tests for: canDrag, draggedIndex, keyboard reorder. Keep: reorder array logic, persistOrder batch, featured toggle, max-3 enforcement, sorting
- [x]`src/components/admin/__tests__/technology-list.test.ts` -- Remove: keyboard reorder test, concurrent drag test (now handled by Sortable disabled). Keep: reorder logic, persistOrder batch
- [x]Verify all E2E tests pass with SortableJS

**Acceptance Criteria:**
- Given a mobile/touch device, when I touch-drag a grip handle, then the item reorders with animation and persists
- Given a desktop browser, when I mouse-drag a grip handle, then the item reorders with animation and persists
- Given the admin list during a persist operation, when I try to drag, then drag is blocked until persist completes

## Verification

**Commands:**
- `pnpm test` -- expected: all tests pass
- `pnpm lint` -- expected: zero warnings
- `pnpm type-check` -- expected: zero errors
- `pnpm build` -- expected: build succeeds
