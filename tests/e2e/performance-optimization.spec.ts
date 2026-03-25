import { test, expect } from '@playwright/test';

test.describe('Performance Optimization — Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('below-fold Firebase images have loading="lazy"', async ({ page }) => {
    const imgs = page.locator('main img[src*="firebasestorage"]');
    const count = await imgs.count();
    test.skip(count === 0, 'No Firebase images on home page — skipped');

    for (let i = 0; i < count; i++) {
      await expect(imgs.nth(i)).toHaveAttribute('loading', 'lazy');
    }
  });

  test('Firebase images have explicit width and height', async ({ page }) => {
    const imgs = page.locator('img[src*="firebasestorage"]');
    const count = await imgs.count();
    test.skip(count === 0, 'No Firebase images on home page — skipped');

    for (let i = 0; i < count; i++) {
      await expect(imgs.nth(i)).toHaveAttribute('width', /^\d+$/);
      await expect(imgs.nth(i)).toHaveAttribute('height', /^\d+$/);
    }
  });

  test('preconnect hint for Firebase Storage exists', async ({ page }) => {
    const preconnect = page.locator('link[rel="preconnect"][href*="firebasestorage"]');
    await expect(preconnect).toHaveCount(1);
  });
});

test.describe('Performance Optimization — Project Detail', () => {
  let hasProjects: boolean;

  test.beforeEach(async ({ page }) => {
    await page.goto('/projects');
    const firstProject = page.locator('main a[href^="/projects/"]').first();
    hasProjects = (await firstProject.count()) > 0;

    if (hasProjects) {
      await firstProject.click();
      await page.waitForURL(/\/projects\/[a-z0-9-]+$/);
    }
  });

  test('main image has width, height, and fetchpriority="high"', async ({ page }) => {
    test.skip(!hasProjects, 'No published projects available for testing');
    const mainImg = page.locator('main img[fetchpriority="high"]');
    await expect(mainImg).toBeVisible();
    await expect(mainImg).toHaveAttribute('width', /^\d+$/);
    await expect(mainImg).toHaveAttribute('height', /^\d+$/);
    await expect(mainImg).toHaveAttribute('fetchpriority', 'high');
  });

  test('tech icons have width and height', async ({ page }) => {
    test.skip(!hasProjects, 'No published projects available for testing');
    const techIcons = page.locator('main img[data-testid="tech-icon"]');
    const count = await techIcons.count();
    test.skip(count === 0, 'No tech icons on project detail page');

    for (let i = 0; i < count; i++) {
      await expect(techIcons.nth(i)).toHaveAttribute('width', /^\d+$/);
      await expect(techIcons.nth(i)).toHaveAttribute('height', /^\d+$/);
    }
  });
});

test.describe('Performance Optimization — Blog Article', () => {
  let hasArticles: boolean;
  let hasCover: boolean;

  test.beforeEach(async ({ page }) => {
    await page.goto('/blog');
    const articleLinks = page.locator('main a[href^="/blog/"]:not([href="/blog/"])');
    const count = await articleLinks.count();
    hasArticles = count > 0;

    if (hasArticles) {
      await articleLinks.first().click();
      await page.waitForURL(/\/blog\/[a-z0-9-]+$/);
      const coverImg = page.locator('article img[fetchpriority="high"]');
      hasCover = (await coverImg.count()) > 0;
    } else {
      hasCover = false;
    }
  });

  test('cover image has width, height, and fetchpriority="high"', async ({ page }) => {
    test.skip(!hasArticles, 'No published blog articles — skipped');
    test.skip(!hasCover, 'Blog article has no cover image — skipped');
    const coverImg = page.locator('article img[fetchpriority="high"]');
    await expect(coverImg).toBeVisible();
    await expect(coverImg).toHaveAttribute('width', /^\d+$/);
    await expect(coverImg).toHaveAttribute('height', /^\d+$/);
  });
});
