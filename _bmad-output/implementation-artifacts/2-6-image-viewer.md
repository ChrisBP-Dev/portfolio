# Story 2.6: Image Viewer

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a visitor,
I want to view project screenshots in a fullscreen viewer with navigation,
So that I can see the details of Christopher's work clearly.

## Acceptance Criteria

1. **Given** I click a screenshot thumbnail **When** ImageViewer opens **Then** overlay fullscreen with dark semi-transparent background, image centered and scaled, "X Close" button top-right, arrows `<` `>` on sides
2. **And** clicking `>` arrow shows the next image, `<` shows the previous image (cyclic navigation — wraps around at ends)
3. **And** pressing Escape closes the viewer
4. **And** arrow keys (ArrowLeft / ArrowRight) navigate between images
5. **And** ImageViewer is a Svelte 5 island with `client:visible`
6. **And** focus is trapped inside the viewer while open (native `<dialog>` + `showModal()`)
7. **And** `aria-label` on close button and navigation arrows in the correct locale
8. **And** existing E2E tests from Story 2.5 continue passing — gallery retains `id="screenshot-gallery"` and `data-screenshot-index` attributes on buttons

**(FR4, UX-DR12)**

## Tasks / Subtasks

- [x] Task 1: i18n translations for ImageViewer (AC: #7)
  - [x] 1.1 Add translation keys to `src/lib/i18n/translations.ts`:
    - `imageViewer.close` — "Cerrar" / "Close"
    - `imageViewer.previous` — "Imagen anterior" / "Previous image"
    - `imageViewer.next` — "Siguiente imagen" / "Next image"
    - `imageViewer.counter` — "de" / "of" (for "3 de 5" / "3 of 5" counter)

- [x] Task 2: Create `src/components/projects/ImageViewer.svelte` (AC: #1, #2, #3, #4, #5, #6, #7)
  - [x] 2.1 Props interface:
    ```typescript
    interface Props {
      screenshots: { url: string; alt: string }[];
      locale: 'es' | 'en';
    }
    ```
    Screenshots passed as serializable objects (URL already converted to string by Astro page).
  - [x] 2.2 State management with Svelte 5 runes:
    ```typescript
    let { screenshots, locale }: Props = $props();
    let isOpen = $state(false);
    let currentIndex = $state(0);
    let dialogRef = $state<HTMLDialogElement | null>(null);
    let currentImage = $derived(screenshots[currentIndex]);
    ```
  - [x] 2.3 Navigation functions:
    - `open(index: number)` — sets `currentIndex`, calls `dialogRef.showModal()`, sets `isOpen = true`
    - `close()` — calls `dialogRef.close()`, sets `isOpen = false`
    - `next()` — `currentIndex = (currentIndex + 1) % screenshots.length`
    - `prev()` — `currentIndex = (currentIndex - 1 + screenshots.length) % screenshots.length`
  - [x] 2.4 Keyboard handling — use `<svelte:window>` for arrow keys:
    ```svelte
    <svelte:window onkeydown={handleKeydown} />
    ```
    Handler: if `!isOpen` return early. ArrowRight → `next()`, ArrowLeft → `prev()`. Escape is handled natively by `<dialog>` (`cancel` event).
  - [x] 2.5 Body scroll lock via `$effect`:
    ```typescript
    $effect(() => {
      if (!isOpen) return;
      const original = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = original; };
    });
    ```
  - [x] 2.6 `prefers-reduced-motion` support:
    ```typescript
    const reducedMotion = typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;
    ```
    Skip fade/transition animations when true.
  - [x] 2.7 Template structure — renders the **gallery thumbnails** (replacing Astro-rendered buttons) AND the dialog overlay:
    ```svelte
    <!-- Gallery grid (visible — enables client:visible hydration) -->
    <div id="screenshot-gallery" class="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {#each screenshots as ss, index (index)}
        <button
          type="button"
          data-screenshot-index={index}
          aria-label={`${ss.alt} ${index + 1}`}
          class="cursor-pointer rounded-lg overflow-hidden border border-border hover:border-primary transition-colors duration-200 focus:outline-2 focus:outline-primary focus:outline-offset-2"
          onclick={() => open(index)}
        >
          <img
            src={ss.url}
            alt={`${ss.alt} ${index + 1}`}
            loading="lazy"
            decoding="async"
            class="w-full h-auto object-cover"
          />
        </button>
      {/each}
    </div>

    <!-- Fullscreen overlay dialog -->
    <dialog
      bind:this={dialogRef}
      class="fixed inset-0 w-full h-full max-w-none max-h-none m-0 p-0 bg-transparent backdrop:bg-black/80"
      oncancel={close}
      onclick={handleBackdropClick}
      aria-label={`${currentImage?.alt ?? ''} — ${currentIndex + 1} ${t('imageViewer.counter', locale)} ${screenshots.length}`}
    >
      <!-- Close button -->
      <button
        class="absolute top-4 right-4 z-10 min-h-11 min-w-11 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors focus:outline-2 focus:outline-primary focus:outline-offset-2"
        aria-label={t('imageViewer.close', locale)}
        onclick={close}
      >
        <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <!-- Previous arrow -->
      {#if screenshots.length > 1}
        <button
          class="absolute left-4 top-1/2 -translate-y-1/2 z-10 min-h-11 min-w-11 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors focus:outline-2 focus:outline-primary focus:outline-offset-2"
          aria-label={t('imageViewer.previous', locale)}
          onclick={prev}
        >
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <!-- Next arrow -->
        <button
          class="absolute right-4 top-1/2 -translate-y-1/2 z-10 min-h-11 min-w-11 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors focus:outline-2 focus:outline-primary focus:outline-offset-2"
          aria-label={t('imageViewer.next', locale)}
          onclick={next}
        >
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      {/if}

      <!-- Centered image -->
      <div class="flex items-center justify-center w-full h-full p-8 sm:p-12">
        <img
          src={currentImage?.url}
          alt={`${currentImage?.alt ?? ''} ${currentIndex + 1}`}
          class="max-w-full max-h-full object-contain"
        />
      </div>

      <!-- Counter (e.g., "3 de 5") -->
      {#if screenshots.length > 1}
        <div class="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white text-body-sm px-3 py-1 rounded-full" aria-live="polite">
          {currentIndex + 1} {t('imageViewer.counter', locale)} {screenshots.length}
        </div>
      {/if}
    </dialog>
    ```
  - [x] 2.8 Backdrop click handler — close only when clicking the backdrop, not the image:
    ```typescript
    function handleBackdropClick(e: MouseEvent) {
      if (e.target === dialogRef) close();
    }
    ```
  - [x] 2.9 Styling notes:
    - Dialog uses `backdrop:bg-black/80` for dark semi-transparent overlay (Tailwind `::backdrop` pseudo-element)
    - Nav buttons: `bg-black/50` semi-transparent circles, `min-h-11 min-w-11` for 44px touch target
    - Focus indicators: `focus:outline-2 focus:outline-primary focus:outline-offset-2` (same as all project components)
    - Image: `object-contain` to scale without cropping, padded from edges

- [x] Task 3: Integrate ImageViewer in project detail pages (AC: #5, #8)
  - [x] 3.1 Modify `src/pages/projects/[slug].astro`:
    - Import ImageViewer: `import ImageViewer from '../../components/projects/ImageViewer.svelte';`
    - Replace the screenshot gallery section (lines 129–154) with:
      ```astro
      <!-- Screenshots gallery + ImageViewer -->
      {project.screenshots.length > 0 && (
        <div class="mb-8">
          <h2 class="text-heading-2 font-semibold mb-4">
            {t('projects.screenshots', locale)}
          </h2>
          <ImageViewer
            client:visible
            screenshots={project.screenshots.map((ss, i) => ({
              url: String(ss.url),
              alt: `${project.companyName[locale]} screenshot`,
            }))}
            locale={locale}
          />
        </div>
      )}
      ```
  - [x] 3.2 Modify `src/pages/en/projects/[slug].astro` — same replacement with adjusted import path (`../../../components/projects/ImageViewer.svelte`)
  - [x] 3.3 **SSR rendering note:** Before hydration, the Svelte component SSR-renders the gallery grid with thumbnail buttons. The gallery is visible immediately. The overlay functionality activates only after hydration. This is progressive enhancement.

- [x] Task 4: Pipeline verification (AC: all)
  - [x] 4.1 Run `pnpm lint && pnpm type-check && pnpm test && pnpm build`
  - [x] 4.2 Verify build generates HTML with screenshot gallery for each project in both locales
  - [x] 4.3 Verify existing E2E tests from Story 2.5 still pass (gallery attributes preserved)

- [x] Task 5: E2E tests (AC: #1, #2, #3, #4, #6, #7, #8)
  - [x] 5.1 Create `tests/e2e/image-viewer.spec.ts`:
    ```typescript
    test.describe('ImageViewer — ES', () => {
      test('opens fullscreen overlay when clicking a screenshot', async ({ page }) => {
        // Navigate to /projects, find first project with screenshots
        // Click screenshot button → verify dialog is open
        // Verify overlay has close button, image visible
      });
      test('navigates to next/previous image with arrow buttons', async ({ page }) => {
        // Open viewer → click next → verify image changes
        // Click prev → verify image returns
      });
      test('closes on Escape key', async ({ page }) => {
        // Open viewer → press Escape → verify dialog closed
      });
      test('closes on X button click', async ({ page }) => {
        // Open viewer → click close button → verify dialog closed
      });
      test('navigates with arrow keys', async ({ page }) => {
        // Open viewer → press ArrowRight → verify next image
        // Press ArrowLeft → verify previous image
      });
      test('displays image counter', async ({ page }) => {
        // Open viewer → verify counter text "1 de N" visible
      });
      test('has correct ARIA labels in Spanish', async ({ page }) => {
        // Verify close button aria-label, nav arrows aria-label
      });
    });

    test.describe('ImageViewer — EN', () => {
      test('has correct ARIA labels in English at /en/projects/[slug]', async ({ page }) => {
        // Same test at EN locale, verify English labels
      });
    });
    ```
  - [x] 5.2 Slug discovery strategy: navigate to `/projects`, find first project card link, extract `href`, navigate to detail page. Same as Story 2.5 E2E pattern.
  - [x] 5.3 Verify the `<dialog>` element is in the DOM but not open initially: `await expect(page.locator('dialog')).toBeHidden()`
  - [x] 5.4 Open by clicking `button[data-screenshot-index="0"]`, verify dialog becomes visible: `await expect(page.locator('dialog')).toBeVisible()`
  - [x] 5.5 Verify existing Story 2.5 tests pass: `id="screenshot-gallery"` and `data-screenshot-index` attributes still present
  - [x] 5.6 For projects with 0-1 screenshots, skip navigation tests (use `test.skip` with descriptive message)

## Dev Notes

### Native `<dialog>` for Focus Trap — No Library Needed

Use the HTML `<dialog>` element with `showModal()` method. This provides:
- **Free focus trapping** — browser handles Tab/Shift+Tab cycling
- **Free Escape key handling** — fires `cancel` event on Escape
- **Free backdrop** — `::backdrop` pseudo-element for dark overlay
- **Correct ARIA** — `aria-modal="true"` set implicitly
- **No z-index wars** — dialog renders in the top layer

This is the same approach recommended by CSS-Tricks and MDN for modal overlays. No focus trap libraries needed.

### Component Replaces Astro Gallery — Why

Story 2.5 rendered the screenshot gallery as Astro `<button>` elements with `data-screenshot-index` attributes, designed for Story 2.6 to "hook into." However, the cleanest architecture is for the ImageViewer Svelte component to render **both** the gallery thumbnails AND the overlay dialog. Reasons:

1. **`client:visible` works** — the gallery grid is the visible element that triggers IntersectionObserver hydration. An overlay-only component would never trigger `client:visible` because `<dialog>` has `display: none` when closed.
2. **No DOM querying across frameworks** — avoids fragile `document.querySelector` to find Astro-rendered elements from Svelte.
3. **Progressive enhancement** — SSR renders the gallery grid; clicking thumbnails only works after hydration. Acceptable UX since it's a non-critical enhancement.
4. **Backward compatibility** — the component renders the same `id="screenshot-gallery"` wrapper and `data-screenshot-index` buttons, so Story 2.5 E2E tests pass unchanged.

### Svelte 5 Patterns — Follow Existing Codebase

Use the exact patterns established in `MobileMenu.svelte` and `ThemeToggle.svelte`:
- `$props()` with TypeScript `interface Props`
- `$state()` for `isOpen`, `currentIndex`, `dialogRef`
- `$derived()` for computed values (current image data)
- `$effect()` for body scroll lock cleanup (same pattern as MobileMenu line 43-86)
- `<svelte:window onkeydown={handler} />` at top level for keyboard events
- `onclick={fn}` syntax (Svelte 5, not `on:click`)
- `bind:this={dialogRef}` for element reference

### `<svelte:window>` Must Be Top-Level

`<svelte:window>` cannot be inside an `{#if}` block. Place it at the component's top level and guard the handler with `if (!isOpen) return;` to avoid responding to keyboard events when the viewer is closed.

### URL Serialization — Strings Only

`StoredImage.url` is a Zod 4 `URL` object. Astro serializes it to a string when passing as prop. The Astro page explicitly converts with `String(ss.url)` in the `screenshots` prop mapping. The Svelte component receives plain `string` URLs.

### `<dialog>` Styling Caveats

- Default `<dialog>` has `max-width`, `max-height`, and padding. Override with: `max-w-none max-h-none m-0 p-0`
- For fullscreen: `fixed inset-0 w-full h-full`
- Background: `bg-transparent` on dialog, `backdrop:bg-black/80` for the backdrop layer
- Tailwind `backdrop:` prefix targets `::backdrop` pseudo-element

### Touch Target Size

All interactive buttons (close, prev, next) must have `min-h-11 min-w-11` (44x44px) per UX-DR42 and WCAG 2.5.8. Same constraint used in MobileMenu.svelte.

### `prefers-reduced-motion` Support

Check `window.matchMedia('(prefers-reduced-motion: reduce)').matches` (same pattern as MobileMenu). If true, skip CSS transitions on image changes. The component should work with or without animations.

### Responsive Behavior

| Breakpoint | Image padding | Arrow position | Counter |
|------------|--------------|----------------|---------|
| <450px (mobile) | `p-8` (32px) | Left/right edges | Bottom center |
| ≥450px (tablet+) | `p-12` (48px) | Left/right with more space | Bottom center |

Arrows and close button float over the image. Image uses `object-contain` to fit without cropping.

### Project Structure Notes

Files to create:
```
src/components/projects/ImageViewer.svelte    # Svelte 5 island component
tests/e2e/image-viewer.spec.ts               # E2E tests
```

Files to modify:
```
src/lib/i18n/translations.ts                 # Add imageViewer.* keys
src/pages/projects/[slug].astro              # Replace gallery with ImageViewer
src/pages/en/projects/[slug].astro           # Replace gallery with ImageViewer
```

### Existing Helpers

| Helper | Import From | Usage |
|--------|-------------|-------|
| `t(key, locale)` | `../../lib/i18n/translations` | i18n strings (close, prev, next, counter) |

### Anti-Patterns to Avoid

1. **DO NOT use a focus trap library** — `<dialog>` + `showModal()` handles focus trapping natively
2. **DO NOT use `on:click`** — Svelte 5 uses `onclick` (no colon)
3. **DO NOT query DOM for gallery buttons** — render both gallery and overlay in the same Svelte component
4. **DO NOT add `z-index`** — `<dialog>` with `showModal()` renders in the browser's top layer, above all z-index contexts
5. **DO NOT use `client:load`** — AC specifies `client:visible`. The gallery grid makes the component visible to IntersectionObserver
6. **DO NOT break Story 2.5 E2E tests** — preserve `id="screenshot-gallery"` and `data-screenshot-index` attributes exactly
7. **DO NOT forget `aria-label` on nav buttons** — use `t()` function with correct locale
8. **DO NOT use `event.preventDefault()` on Escape** — `<dialog>` handles Escape natively via `cancel` event
9. **DO NOT add `loading="lazy"` to the main overlay image** — it's the focused content, load eagerly. Thumbnails in the gallery DO use `loading="lazy"`

### Previous Story Intelligence

**De Story 2.5:**
- Screenshot gallery structure: `id="screenshot-gallery"` wrapper, `<button>` elements with `data-screenshot-index={index}`, `aria-label` descriptive text, `loading="lazy"` + `decoding="async"` on thumbnail images
- `Button.astro` Props interface was extended with `target` and `rel` — no modifications needed from ImageViewer
- E2E test 5.8 checks `id="screenshot-gallery"` and `data-screenshot-index` — MUST preserve these
- Code review patches: Lighthouse accessibility sensitivity means ARIA labels are critical

**De Story 2.4:**
- `ProjectFilter.svelte` pattern: complex props via `$props()`, `$state()` for reactive filtering, TypeScript strict
- Same `src/components/projects/` directory for project-related Svelte components

**De MobileMenu.svelte (closest pattern):**
- Body scroll lock in `$effect` with cleanup (line 43-86)
- `reducedMotion` media query check at component level (line 17-19)
- Focus trap via manual Tab key handling (lines 59-75) — NOT needed here since `<dialog>` handles it
- SVG icons for close/navigation buttons (inline SVG, not icon library)
- `min-h-11 min-w-11` for 44px touch targets

### Git Intelligence

Recent commits:
- `8e6f157` fix: code review patches for story 2.5 — i18n, build perf, E2E robustness
- `7d8687d` feat: implement story 2.5 — Project Detail Page
- `af17c90` fix: code review patches for story 2.4 — i18n, lazy loading, guard, E2E assertions

Pattern: semantic prefixes (`feat:`, `fix:`). Use `feat: implement story 2.6 — Image Viewer`.

### References

- [Source: _bmad-output/planning-artifacts/epics.md — Story 2.6]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md — UX-DR12 ImageViewer]
- [Source: _bmad-output/planning-artifacts/architecture.md — Svelte 5 islands, client:visible]
- [Source: _bmad-output/implementation-artifacts/2-5-project-detail-page.md — Screenshot gallery hooks]
- [Source: src/components/layout/MobileMenu.svelte — Body scroll lock, keyboard handling, reducedMotion]
- [Source: src/components/projects/ProjectFilter.svelte — Svelte 5 props/state patterns]
- [Source: src/pages/projects/[slug].astro — Current gallery structure to replace]

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (1M context)

### Debug Log References

- ESLint globals: `HTMLDialogElement`, `HTMLDivElement`, `MouseEvent` agregados para soporte de Svelte
- E2E hidratación: `client:visible` requiere scroll al viewport + `data-hydrated` signal para tests estables

### Completion Notes List

- Task 1: Agregadas 4 claves i18n para ImageViewer (`close`, `previous`, `next`, `counter`) en ES/EN
- Task 2: Componente ImageViewer.svelte creado con: `<dialog>` nativo + `showModal()` para focus trap, navegación cíclica, keyboard handling (ArrowLeft/Right), body scroll lock vía `$effect`, `prefers-reduced-motion` support, backdrop click handler, `data-hydrated` signal para E2E
- Task 3: Ambas páginas `[slug].astro` (ES/EN) actualizadas — gallery Astro reemplazada por `<ImageViewer client:visible />`
- Task 4: Pipeline verificado — lint 0 errores, type-check 0 errores, 255 unit tests pasan, build exitoso con 16 páginas
- Task 5: 9 E2E tests creados (8 ES + 1 EN): overlay, navegación por botones, Escape, X close, arrow keys, counter, ARIA labels. 33 tests E2E totales pasan (0 regresiones)
- UX fix: Project cards en listing — card completa clickeable via stretched link (`after:absolute after:inset-0`), hover con `border-primary`, `cursor-pointer`. Links externos mantienen `relative z-10` para funcionar independientemente. Mejora crítica para mobile donde no hay hover feedback.

### File List

Archivos creados:
- src/components/projects/ImageViewer.svelte
- tests/e2e/image-viewer.spec.ts

Archivos modificados:
- src/lib/i18n/translations.ts
- src/pages/projects/[slug].astro
- src/pages/en/projects/[slug].astro
- src/components/projects/ProjectFilter.svelte
- eslint.config.js
