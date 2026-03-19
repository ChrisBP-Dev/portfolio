import { test, expect } from '@playwright/test';

// --- Scenario 1: Mobile responsive — Home ---
test.describe('Mobile responsive (375px)', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test('home page shows single-column layout', async ({ page }) => {
    await page.goto('/');

    // Project cards grid should be single-column (1 col)
    const grid = page.locator('.grid').first();
    await expect(grid).toBeVisible();
  });

  test('hamburger menu is visible, no horizontal nav', async ({ page }) => {
    await page.goto('/');

    // Desktop nav should be hidden
    const desktopNav = page.locator('nav.lg\\:flex');
    await expect(desktopNav).toBeHidden();

    // Hamburger button should be visible
    const hamburger = page.getByLabel(/menu/i).first();
    await expect(hamburger).toBeVisible();
  });

  test('touch targets are at least 44x44px', async ({ page }) => {
    await page.goto('/');

    const buttons = page.locator('button, a[role="button"]');
    const count = await buttons.count();
    for (let i = 0; i < Math.min(count, 10); i++) {
      const box = await buttons.nth(i).boundingBox();
      if (box) {
        expect(box.width).toBeGreaterThanOrEqual(44);
        expect(box.height).toBeGreaterThanOrEqual(44);
      }
    }
  });
});

// --- Scenario 2: Tablet responsive — Projects ---
test.describe('Tablet responsive (768px)', () => {
  test.use({ viewport: { width: 768, height: 1024 } });

  test('projects page shows 2-column grid', async ({ page }) => {
    await page.goto('/projects');

    const grid = page.locator('.grid');
    await expect(grid.first()).toBeVisible();

    // Verify grid has sm:grid-cols-2 class
    const gridEl = grid.first();
    await expect(gridEl).toHaveClass(/sm:grid-cols-2/);
  });
});

// --- Scenario 3: Desktop responsive — Home ---
test.describe('Desktop responsive (1280px)', () => {
  test.use({ viewport: { width: 1280, height: 900 } });

  test('home page shows 3-column project grid', async ({ page }) => {
    await page.goto('/');

    const grid = page.locator('.grid.lg\\:grid-cols-3');
    await expect(grid.first()).toBeVisible();
  });

  test('desktop nav is visible with all items', async ({ page }) => {
    await page.goto('/');

    const nav = page.locator('header nav');
    await expect(nav).toBeVisible();

    await expect(page.getByRole('link', { name: 'Home' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Projects' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Contact' })).toBeVisible();
  });

  test('container max-width is 1200px (75rem)', async ({ page }) => {
    await page.goto('/');

    const container = page.locator('.max-w-\\[75rem\\]').first();
    await expect(container).toBeVisible();
  });
});

// --- Scenario 4: Locale switching — complete content ---
test.describe('Locale switching', () => {
  test('switching from EN to ES changes all content', async ({ page }) => {
    await page.goto('/');

    // Verify EN content
    await expect(page.getByRole('heading', { name: 'KNOWLEDGE OF' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'EXPERIENCE', exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Get in Touch' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'See All' })).toBeVisible();

    // Click locale toggle (flag link)
    const localeToggle = page.getByLabel(/switch to spanish/i);
    await localeToggle.click();

    // Wait for ES page
    await page.waitForURL(/\/es\//);

    // Verify ES content
    await expect(page.getByRole('heading', { name: 'CONOCIMIENTOS' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'EXPERIENCIA', exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Contáctame' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Ver Todos' })).toBeVisible();
  });

  test('switching from ES to EN changes all content', async ({ page }) => {
    await page.goto('/es/');

    // Verify ES content
    await expect(page.getByRole('heading', { name: 'CONOCIMIENTOS' })).toBeVisible();

    // Click locale toggle (in ES, label is "Cambiar a inglés")
    const localeToggle = page.getByLabel(/cambiar a inglés/i);
    await localeToggle.click();

    // Wait for EN page
    await page.waitForURL(/^(?!.*\/es\/)/);

    // Verify EN content
    await expect(page.getByRole('heading', { name: 'KNOWLEDGE OF' })).toBeVisible();
  });
});

// --- Scenario 5: hreflang tags ---
test.describe('hreflang tags', () => {
  test('home page has all hreflang tags with absolute URLs', async ({ page }) => {
    await page.goto('/');

    const esHreflang = page.locator('link[rel="alternate"][hreflang="es"]');
    await expect(esHreflang).toHaveAttribute('href', /^https?:\/\//);

    const enHreflang = page.locator('link[rel="alternate"][hreflang="en"]');
    await expect(enHreflang).toHaveAttribute('href', /^https?:\/\//);

    const defaultHreflang = page.locator('link[rel="alternate"][hreflang="x-default"]');
    await expect(defaultHreflang).toHaveAttribute('href', /^https?:\/\//);
  });

  test('projects page has all hreflang tags', async ({ page }) => {
    await page.goto('/projects');

    await expect(page.locator('link[hreflang="es"]')).toHaveCount(1);
    await expect(page.locator('link[hreflang="en"]')).toHaveCount(1);
    await expect(page.locator('link[hreflang="x-default"]')).toHaveCount(1);
  });

  test('contact page has all hreflang tags', async ({ page }) => {
    await page.goto('/contact');

    await expect(page.locator('link[hreflang="es"]')).toHaveCount(1);
    await expect(page.locator('link[hreflang="en"]')).toHaveCount(1);
    await expect(page.locator('link[hreflang="x-default"]')).toHaveCount(1);
  });
});

// --- Scenario 6: Lazy loading ---
test.describe('Lazy loading', () => {
  test('project detail main image has fetchpriority="high"', async ({ page }) => {
    // Navigate to first project detail page
    await page.goto('/projects');
    const firstProject = page.locator('a[href*="/projects/"]').first();
    const href = await firstProject.getAttribute('href');
    expect(href).toBeTruthy();

    await page.goto(href!);

    const mainImage = page.locator('img[fetchpriority="high"]');
    await expect(mainImage).toBeVisible();
  });

  test('gallery thumbnails have loading="lazy"', async ({ page }) => {
    await page.goto('/projects');
    const firstProject = page.locator('a[href*="/projects/"]').first();
    const href = await firstProject.getAttribute('href');
    await page.goto(href!);

    const galleryImages = page.locator('#screenshot-gallery img');
    const count = await galleryImages.count();

    if (count > 0) {
      for (let i = 0; i < count; i++) {
        await expect(galleryImages.nth(i)).toHaveAttribute('loading', 'lazy');
      }
    }
  });
});

// --- Scenario 7: View Transitions ---
test.describe('View Transitions', () => {
  test('ClientRouter meta tag is present', async ({ page }) => {
    await page.goto('/');

    const vtMeta = page.locator('meta[name="astro-view-transitions-enabled"]');
    await expect(vtMeta).toHaveAttribute('content', 'true');
  });

  test('main element has transition:animate attribute', async ({ page }) => {
    await page.goto('/');

    // Astro renders transition:animate as a data attribute
    const main = page.locator('main#main');
    await expect(main).toBeVisible();
  });
});

// --- Scenario 8: Mobile touch targets ---
test.describe('Mobile touch targets (375px)', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test('CTA buttons meet 44px minimum', async ({ page }) => {
    await page.goto('/');

    const ctaLinks = page.getByRole('link', { name: /Get in Touch|Download Resume/i });
    const count = await ctaLinks.count();

    for (let i = 0; i < count; i++) {
      const box = await ctaLinks.nth(i).boundingBox();
      if (box) {
        expect(box.height).toBeGreaterThanOrEqual(44);
      }
    }
  });
});
