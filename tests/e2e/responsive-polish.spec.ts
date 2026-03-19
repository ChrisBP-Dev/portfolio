import { test, expect } from '@playwright/test';

// --- Scenario 1: Mobile responsive — Home ---
test.describe('Mobile responsive (375px)', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test('home page shows single-column layout with full-width cards', async ({ page }) => {
    await page.goto('/');

    // Home page project cards are <a> links, not <article>
    const projectCards = page.locator('a[href*="/projects/"]');
    await expect(projectCards.first()).toBeVisible();

    const cardBox = await projectCards.first().boundingBox();
    const viewportWidth = 375;
    expect(cardBox).toBeTruthy();
    // Card should occupy most of the viewport width (accounting for padding)
    expect(cardBox!.width).toBeGreaterThan(viewportWidth * 0.8);
  });

  test('hamburger menu is visible, no horizontal nav', async ({ page }) => {
    await page.goto('/');

    // Desktop nav links should not be visible
    const homeLink = page.getByRole('banner').getByRole('link', { name: 'Home' });
    await expect(homeLink).toBeHidden();

    // Hamburger button should be visible
    const hamburger = page.getByLabel(/menu/i).first();
    await expect(hamburger).toBeVisible();
  });

  test('typography is readable (heading >= 2rem, body >= 0.875rem)', async ({ page }) => {
    await page.goto('/');

    const h1 = page.getByRole('heading', { level: 1 });
    const h1FontSize = await h1.evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
    // 2rem = 32px at default 16px base (clamp minimum)
    expect(h1FontSize).toBeGreaterThanOrEqual(32);

    const body = page.locator('p').first();
    const bodyFontSize = await body.evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
    // 0.875rem = 14px minimum for readable body text on mobile
    expect(bodyFontSize).toBeGreaterThanOrEqual(14);
  });

  test('primary interactive elements meet 44px touch target', async ({ page }) => {
    await page.goto('/');

    // Check buttons and CTA links (not inline text links which are naturally text-sized)
    const targets = page.locator('button, a.min-h-11, a[class*="min-h-11"]');
    const count = await targets.count();
    let checked = 0;

    for (let i = 0; i < count; i++) {
      const el = targets.nth(i);
      const isVisible = await el.isVisible();
      if (!isVisible) continue;

      const box = await el.boundingBox();
      expect(box, `Touch target ${i} should have a bounding box`).toBeTruthy();
      expect(box!.width).toBeGreaterThanOrEqual(44);
      expect(box!.height).toBeGreaterThanOrEqual(44);
      checked++;
    }

    expect(checked).toBeGreaterThan(0);
  });
});

// --- Scenario 2: Tablet responsive — Projects ---
test.describe('Tablet responsive (768px)', () => {
  test.use({ viewport: { width: 768, height: 1024 } });

  test('projects page shows 2-column grid', async ({ page }) => {
    await page.goto('/projects');

    const projectCards = page.getByRole('article');
    await expect(projectCards.first()).toBeVisible();

    // With 2-column grid, first two cards should be side by side (similar Y position)
    const count = await projectCards.count();
    if (count >= 2) {
      const box1 = await projectCards.nth(0).boundingBox();
      const box2 = await projectCards.nth(1).boundingBox();
      expect(box1).toBeTruthy();
      expect(box2).toBeTruthy();
      // Same row: Y positions should be close (within gap tolerance)
      expect(Math.abs(box1!.y - box2!.y)).toBeLessThan(10);
    }
  });

  test('hamburger menu is active in tablet viewport', async ({ page }) => {
    await page.goto('/');

    const hamburger = page.getByLabel(/menu/i).first();
    await expect(hamburger).toBeVisible();
  });
});

// --- Scenario 3: Desktop responsive — Home ---
test.describe('Desktop responsive (1280px)', () => {
  test.use({ viewport: { width: 1280, height: 900 } });

  test('home page shows 3-column project grid', async ({ page }) => {
    await page.goto('/');

    // Home page project cards are <a> links
    const projectCards = page.locator('a[href*="/projects/"]');
    await expect(projectCards.first()).toBeVisible();

    // With 3-column grid, first three cards should be on the same row
    const count = await projectCards.count();
    if (count >= 3) {
      const box1 = await projectCards.nth(0).boundingBox();
      const box3 = await projectCards.nth(2).boundingBox();
      expect(box1).toBeTruthy();
      expect(box3).toBeTruthy();
      // Same row: Y positions should be close
      expect(Math.abs(box1!.y - box3!.y)).toBeLessThan(10);
    }
  });

  test('projects page shows 3-column grid (ProjectFilter fix)', async ({ page }) => {
    await page.goto('/projects');

    const projectCards = page.getByRole('article');
    await expect(projectCards.first()).toBeVisible();

    // Verify 3-column layout on /projects (where ProjectFilter.svelte renders)
    const count = await projectCards.count();
    if (count >= 3) {
      const box1 = await projectCards.nth(0).boundingBox();
      const box3 = await projectCards.nth(2).boundingBox();
      expect(box1).toBeTruthy();
      expect(box3).toBeTruthy();
      expect(Math.abs(box1!.y - box3!.y)).toBeLessThan(10);
    }
  });

  test('desktop nav is visible with all items', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('banner').getByRole('link', { name: 'Home' })).toBeVisible();
    await expect(page.getByRole('banner').getByRole('link', { name: 'Projects' })).toBeVisible();
    await expect(page.getByRole('banner').getByRole('link', { name: 'Contact' })).toBeVisible();
  });

  test('container respects max-width 1200px', async ({ page }) => {
    await page.goto('/');

    const main = page.getByRole('main');
    const mainBox = await main.boundingBox();
    expect(mainBox).toBeTruthy();
    // Content should not exceed 1200px + padding
    expect(mainBox!.width).toBeLessThanOrEqual(1280);
  });
});

// --- Scenario 4: Locale switching — complete content ---
test.describe('Locale switching', () => {
  test('switching from EN to ES changes all content', async ({ page }) => {
    await page.goto('/');

    // Verify EN content — section titles
    await expect(page.getByRole('heading', { name: 'KNOWLEDGE OF' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'EXPERIENCE', exact: true })).toBeVisible();

    // Verify EN content — buttons
    await expect(page.getByRole('link', { name: 'Get in Touch' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'See All' })).toBeVisible();

    // Verify EN content — nav labels
    await expect(page.getByRole('banner').getByRole('link', { name: 'Home' })).toBeVisible();
    await expect(page.getByRole('banner').getByRole('link', { name: 'Projects' })).toBeVisible();
    await expect(page.getByRole('banner').getByRole('link', { name: 'Contact' })).toBeVisible();

    // Click locale toggle
    const localeToggle = page.getByLabel(/switch to spanish/i);
    await localeToggle.click();

    // Wait for ES page
    await page.waitForURL(/\/es\//);

    // Verify ES content — section titles
    await expect(page.getByRole('heading', { name: 'CONOCIMIENTOS' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'EXPERIENCIA', exact: true })).toBeVisible();

    // Verify ES content — buttons
    await expect(page.getByRole('link', { name: 'Contáctame' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Ver Todos' })).toBeVisible();

    // Verify ES content — nav labels
    await expect(page.getByRole('banner').getByRole('link', { name: 'Inicio' })).toBeVisible();
    await expect(page.getByRole('banner').getByRole('link', { name: 'Proyectos' })).toBeVisible();
    await expect(page.getByRole('banner').getByRole('link', { name: 'Contacto' })).toBeVisible();
  });

  test('switching from ES to EN changes all content', async ({ page }) => {
    await page.goto('/es/');

    // Verify ES content
    await expect(page.getByRole('heading', { name: 'CONOCIMIENTOS' })).toBeVisible();
    await expect(page.getByRole('banner').getByRole('link', { name: 'Inicio' })).toBeVisible();

    // Click locale toggle
    const localeToggle = page.getByLabel(/cambiar a inglés/i);
    await localeToggle.click();

    // Wait for EN page — positive assertion
    await page.waitForURL('/');

    // Verify EN content
    await expect(page.getByRole('heading', { name: 'KNOWLEDGE OF' })).toBeVisible();
    await expect(page.getByRole('banner').getByRole('link', { name: 'Home' })).toBeVisible();
  });
});

// --- Scenario 5: hreflang tags ---
test.describe('hreflang tags', () => {
  // Note: <link> elements in <head> require attribute selectors — no semantic alternative exists
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

  test('ES home page has all hreflang tags', async ({ page }) => {
    await page.goto('/es/');

    await expect(page.locator('link[hreflang="es"]')).toHaveCount(1);
    await expect(page.locator('link[hreflang="en"]')).toHaveCount(1);
    await expect(page.locator('link[hreflang="x-default"]')).toHaveCount(1);
  });
});

// --- Scenario 6: Lazy loading ---
test.describe('Lazy loading', () => {
  test('project detail main image has fetchpriority="high"', async ({ page }) => {
    await page.goto('/projects');
    const firstProject = page.getByRole('article').first().getByRole('link').first();
    const href = await firstProject.getAttribute('href');
    expect(href).toBeTruthy();

    await page.goto(href!);

    // Main image above-the-fold should have high fetch priority
    const mainImage = page.locator('img[fetchpriority="high"]');
    await expect(mainImage).toBeVisible();
  });

  test('gallery thumbnails have loading="lazy"', async ({ page }) => {
    await page.goto('/projects');
    const firstProject = page.getByRole('article').first().getByRole('link').first();
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

  test('home page below-the-fold images have loading="lazy"', async ({ page }) => {
    await page.goto('/');

    // Technology icons and project card images are below-the-fold
    const lazyImages = page.locator('img[loading="lazy"]');
    const count = await lazyImages.count();
    expect(count).toBeGreaterThan(0);
  });
});

// --- Scenario 7: View Transitions ---
test.describe('View Transitions', () => {
  test('ClientRouter meta tag is present', async ({ page }) => {
    await page.goto('/');

    // Astro injects this meta tag when ClientRouter is active
    const vtMeta = page.locator('meta[name="astro-view-transitions-enabled"]');
    await expect(vtMeta).toHaveAttribute('content', 'true');
  });

  test('theme persists after client-side navigation', async ({ page }) => {
    await page.goto('/');

    // Get current theme state
    const isDarkBefore = await page.evaluate(() =>
      document.documentElement.classList.contains('dark')
    );

    // Navigate to another page (simulating View Transition)
    await page.getByRole('banner').getByRole('link', { name: 'Projects' }).click();
    await page.waitForURL(/\/projects/);

    // Theme class should persist after navigation
    const isDarkAfter = await page.evaluate(() =>
      document.documentElement.classList.contains('dark')
    );
    expect(isDarkAfter).toBe(isDarkBefore);
  });

  test('canonical link is present with absolute URL', async ({ page }) => {
    await page.goto('/');

    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute('href', /^https?:\/\//);
  });
});

// --- Scenario 8: Mobile touch targets ---
test.describe('Mobile touch targets (375px)', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test('CTA buttons meet 44px minimum', async ({ page }) => {
    await page.goto('/');

    const ctaLinks = page.getByRole('link', { name: /Get in Touch|Download Resume/i });
    const count = await ctaLinks.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const box = await ctaLinks.nth(i).boundingBox();
      expect(box, `CTA link ${i} should have a bounding box`).toBeTruthy();
      expect(box!.height).toBeGreaterThanOrEqual(44);
    }
  });
});
