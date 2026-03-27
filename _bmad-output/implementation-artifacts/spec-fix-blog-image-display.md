---
title: 'Fix blog cover image display — prevent extreme stretching and cropping'
type: 'bugfix'
created: '2026-03-26'
status: 'done'
baseline_commit: '2fd1cfc'
context: []
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Blog cover images in both the listing cards and the article banner use `object-cover` with a forced 16:9 aspect ratio (`aspect-video`), which crops images that don't match that proportion — producing an ugly zoomed/stretched appearance where key content is cut off.

**Approach:** Replace the rigid 16:9 crop with a contained image display that shows the full image within a bounded container, using `object-contain` and a subtle background fill for any empty space.

## Boundaries & Constraints

**Always:** Preserve `width`/`height` HTML attributes for CLS prevention. Keep `rounded` corners. Maintain responsive behavior across all 3 breakpoints. Keep `fetchpriority="high"` on article hero.

**Ask First:** If the approach causes visual regression on other card types (ProjectCard).

**Never:** Change the blog content inline images (`BlogContent.astro` global styles). Change image upload logic or Firestore schema.

</frozen-after-approval>

## Code Map

- `src/components/blog/BlogCard.astro` -- Card cover image in listing grid
- `src/pages/blog/[slug].astro` -- Article hero/banner cover image
- `src/pages/es/blog/[slug].astro` -- Spanish article hero (same pattern)

## Tasks & Acceptance

**Execution:**
- [x] `src/components/blog/BlogCard.astro` -- Replace `aspect-video object-cover` with `object-contain` inside a bounded container with `bg-surface` fill, max height constraint, and centered image
- [x] `src/pages/blog/[slug].astro` -- Replace `aspect-video object-cover max-h-96` with `object-contain` inside a bounded container with background fill
- [x] `src/pages/es/blog/[slug].astro` -- Apply identical fix as English article page

**Acceptance Criteria:**
- Given a cover image with non-16:9 proportions, when viewing the blog listing, then the full image is visible without cropping inside the card
- Given a cover image on the article page, when viewing the banner, then the image displays fully without stretching or excessive cropping
- Given any viewport width (mobile/tablet/desktop), when viewing blog cards, then images remain properly contained and the layout does not shift

## Verification

**Commands:**
- `pnpm build` -- expected: builds without errors, blog pages generated

**Manual checks:**
- Open `/blog` listing — cover images show fully, no cropping
- Open `/blog/beyond-vibe-coding` — banner image shows fully, no stretch
- Check on mobile viewport — images still look good at small widths

## Suggested Review Order

- Entry point: card image container — `h-52` for consistent grid, `bg-surface` for theme-aware fill, `object-contain` stops cropping
  [`BlogCard.astro:23`](../../src/components/blog/BlogCard.astro#L23)

- Article hero: same pattern at `max-h-96` with `min-h-32` floor for panoramic images
  [`[slug].astro:79`](../../src/pages/blog/[slug].astro#L79)

- Spanish variant: identical change for locale parity
  [`es/[slug].astro:79`](../../src/pages/es/blog/[slug].astro#L79)
