import { test, expect } from '@playwright/test';

test.describe('Project Detail Page — ES', () => {
  let detailUrl: string;

  test.beforeEach(async ({ page }) => {
    await page.goto('/projects');
    const firstCardLink = page.locator('main a[href*="/projects/"]').first();
    await expect(firstCardLink).toBeVisible();
    detailUrl = (await firstCardLink.getAttribute('href'))!;
    await page.goto(detailUrl);
  });

  test('page loads with project name, description, and main image', async ({ page }) => {
    const h1 = page.locator('h1');
    await expect(h1).toBeVisible();
    const h1Text = await h1.textContent();
    expect(h1Text!.trim().length).toBeGreaterThan(0);

    await expect(page.locator('main img').first()).toBeVisible();

    await expect(page.locator('main p').first()).toBeVisible();
  });

  test('displays features list when project has features', async ({ page }) => {
    const featuresList = page.locator('ul.list-disc');
    const count = await featuresList.count();
    if (count > 0) {
      await expect(featuresList.first()).toBeVisible();
      const items = featuresList.locator('li');
      expect(await items.count()).toBeGreaterThan(0);
    }
  });

  test('displays technology chips with icons', async ({ page }) => {
    const techChips = page.locator('span.inline-flex img[loading="lazy"]');
    await expect(techChips.first()).toBeVisible();
  });

  test('displays external links with target=_blank when present', async ({ page }) => {
    const externalLinks = page.locator('a[target="_blank"][rel="noopener noreferrer"]');
    const count = await externalLinks.count();
    if (count > 0) {
      for (let i = 0; i < count; i++) {
        await expect(externalLinks.nth(i)).toHaveAttribute('target', '_blank');
        await expect(externalLinks.nth(i)).toHaveAttribute('rel', 'noopener noreferrer');
        const ariaLabel = await externalLinks.nth(i).getAttribute('aria-label');
        expect(ariaLabel).toBeTruthy();
      }
    }
  });

  test('displays screenshot gallery with data attributes', async ({ page }) => {
    const gallery = page.locator('#screenshot-gallery');
    const galleryCount = await gallery.count();
    if (galleryCount > 0) {
      await expect(gallery).toBeVisible();
      const buttons = gallery.locator('button[data-screenshot-index]');
      expect(await buttons.count()).toBeGreaterThan(0);
      await expect(buttons.first()).toHaveAttribute('data-screenshot-index', '0');
    }
  });

  test('back link navigates to projects listing', async ({ page }) => {
    const backLink = page.locator('a', { hasText: '← Volver a Proyectos' });
    await expect(backLink).toBeVisible();
    await backLink.click();
    await expect(page).toHaveURL(/\/projects$/);
  });

  test('page title includes project name and ChrisBP', async ({ page }) => {
    await expect(page).toHaveTitle(/.*— ChrisBP/);
  });
});

test.describe('Project Detail Page — EN', () => {
  let detailUrl: string;

  test.beforeEach(async ({ page }) => {
    await page.goto('/en/projects');
    const firstCardLink = page.locator('main a[href*="/projects/"]').first();
    await expect(firstCardLink).toBeVisible();
    detailUrl = (await firstCardLink.getAttribute('href'))!;
    await page.goto(detailUrl);
  });

  test('page loads with English content at /en/projects/[slug]', async ({ page }) => {
    await expect(page).toHaveURL(/\/en\/projects\/.+/);

    const h1 = page.locator('h1');
    await expect(h1).toBeVisible();

    await expect(page).toHaveTitle(/.*— ChrisBP/);
  });

  test('back link navigates to /en/projects', async ({ page }) => {
    const backLink = page.locator('a', { hasText: '← Back to Projects' });
    await expect(backLink).toBeVisible();
    await backLink.click();
    await expect(page).toHaveURL(/\/en\/projects$/);
  });
});
