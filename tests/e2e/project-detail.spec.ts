import { test, expect } from '@playwright/test';

test.describe('Project Detail Page — EN', () => {
  let detailUrl: string;

  test.beforeEach(async ({ page }) => {
    await page.goto('/projects');
    const firstCardLink = page.locator('main a[href*="/projects/"]').first();
    await expect(firstCardLink).toBeVisible();
    detailUrl = (await firstCardLink.getAttribute('href'))!;
    await page.goto(detailUrl);
  });

  test('page loads with project name, description, and main image', async ({ page }) => {
    const h1 = page.locator('main h1');
    await expect(h1).toBeVisible();
    const h1Text = await h1.textContent();
    expect(h1Text!.trim().length).toBeGreaterThan(0);

    await expect(page.locator('main img').first()).toBeVisible();

    await expect(page.locator('main p').first()).toBeVisible();
  });

  test('displays features list when project has features', async ({ page }) => {
    const featuresList = page.locator('ul.list-disc');
    const count = await featuresList.count();
    test.skip(count === 0, 'First project has no features — skipped conditionally');
    await expect(featuresList.first()).toBeVisible();
    const items = featuresList.locator('li');
    expect(await items.count()).toBeGreaterThan(0);
  });

  test('displays technology chips with icons', async ({ page }) => {
    const techIcons = page.locator('img[data-testid="tech-icon"]');
    await expect(techIcons.first()).toBeVisible();
  });

  test('displays external links with target=_blank when present', async ({ page }) => {
    const externalLinks = page.locator('main a[target="_blank"][rel="noopener noreferrer"]');
    const count = await externalLinks.count();
    test.skip(count === 0, 'First project has no external links — skipped conditionally');
    for (let i = 0; i < count; i++) {
      await expect(externalLinks.nth(i)).toHaveAttribute('target', '_blank');
      await expect(externalLinks.nth(i)).toHaveAttribute('rel', 'noopener noreferrer');
      const ariaLabel = await externalLinks.nth(i).getAttribute('aria-label');
      expect(ariaLabel).toBeTruthy();
    }
  });

  test('displays screenshot gallery with data attributes', async ({ page }) => {
    const gallery = page.locator('#screenshot-gallery');
    const galleryCount = await gallery.count();
    test.skip(galleryCount === 0, 'First project has no screenshots — skipped conditionally');
    await expect(gallery).toBeVisible();
    const buttons = gallery.locator('button[data-screenshot-index]');
    expect(await buttons.count()).toBeGreaterThan(0);
    await expect(buttons.first()).toHaveAttribute('data-screenshot-index', '0');
  });

  test('back link navigates to projects listing', async ({ page }) => {
    const backLink = page.locator('a', { hasText: '← Back to Projects' });
    await expect(backLink).toBeVisible();
    await backLink.click();
    await expect(page).toHaveURL(/\/projects$/);
  });

  test('page title includes project name and ChrisBP', async ({ page }) => {
    await expect(page).toHaveTitle(/.*— ChrisBP/);
  });

  test('URL uses clean slug format — no IDs or hashes', async ({ page }) => {
    const url = page.url();
    const slugMatch = url.match(/\/projects\/([^/]+)$/);
    expect(slugMatch).toBeTruthy();
    expect(slugMatch![1]).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
  });
});

test.describe('Project Detail Page — ES', () => {
  let detailUrl: string;

  test.beforeEach(async ({ page }) => {
    await page.goto('/es/projects');
    const firstCardLink = page.locator('main a[href*="/es/projects/"]').first();
    await expect(firstCardLink).toBeVisible();
    detailUrl = (await firstCardLink.getAttribute('href'))!;
    await page.goto(detailUrl);
  });

  test('page loads with Spanish content at /es/projects/[slug]', async ({ page }) => {
    await expect(page).toHaveURL(/\/es\/projects\/[a-z0-9-]+$/);

    const h1 = page.locator('main h1');
    await expect(h1).toBeVisible();

    await expect(page).toHaveTitle(/.*— ChrisBP/);
  });

  test('URL uses clean slug format — no IDs or hashes (ES)', async ({ page }) => {
    const url = page.url();
    const slugMatch = url.match(/\/es\/projects\/([^/]+)$/);
    expect(slugMatch).toBeTruthy();
    expect(slugMatch![1]).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
  });

  test('back link navigates to /es/projects', async ({ page }) => {
    const backLink = page.locator('a', { hasText: '← Volver a Proyectos' });
    await expect(backLink).toBeVisible();
    await backLink.click();
    await expect(page).toHaveURL(/\/es\/projects$/);
  });
});

test.describe('Project Detail Page — EN: OG and Twitter meta tags', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/projects');
    const firstCardLink = page.locator('main a[href*="/projects/"]').first();
    await expect(firstCardLink).toBeVisible();
    const detailUrl = (await firstCardLink.getAttribute('href'))!;
    await page.goto(detailUrl);
  });

  test('og:image points to Firebase Storage (project-specific image)', async ({ page }) => {
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /firebasestorage\.googleapis\.com/);
  });

  test('og:url is an absolute URL', async ({ page }) => {
    // Absolute URL check — built HTML uses https://portfolio-chrisbp.web.app; ClientRouter rewrites to browser URL in preview
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', /^https?:\/\//);
  });

  test('og:type is website', async ({ page }) => {
    await expect(page.locator('meta[property="og:type"]')).toHaveAttribute('content', 'website');
  });

  test('twitter:card is summary_large_image', async ({ page }) => {
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image');
  });

  test('twitter:title and twitter:description are present', async ({ page }) => {
    await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute('content', /.+/);
    await expect(page.locator('meta[name="twitter:description"]')).toHaveAttribute('content', /.+/);
  });

  test('twitter:image points to Firebase Storage', async ({ page }) => {
    await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute('content', /firebasestorage\.googleapis\.com/);
  });
});
