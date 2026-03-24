import { test, expect } from '@playwright/test';

test.describe('Blog Page — EN', () => {
  test('page loads at /blog with heading and intro text', async ({ page }) => {
    await page.goto('/blog');

    await expect(page.locator('p').filter({ hasText: 'Articles about web development' })).toBeVisible();
  });

  test('page title and meta description are set correctly', async ({ page }) => {
    await page.goto('/blog');

    await expect(page).toHaveTitle('Blog — ChrisBP');

    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveAttribute(
      'content',
      'Articles about web development, technology and creative process',
    );
  });

  test('if articles exist, cards show article elements with h2, time, and reading time', async ({
    page,
  }) => {
    await page.goto('/blog');

    const articles = page.locator('article');
    const count = await articles.count();

    if (count > 0) {
      const firstArticle = articles.first();
      await expect(firstArticle.locator('h2')).toBeVisible();
      await expect(firstArticle.locator('time')).toBeVisible();
      await expect(firstArticle.locator('text=min read')).toBeVisible();
    }
  });

  test('cards link to /blog/[slug] URL pattern', async ({ page }) => {
    await page.goto('/blog');

    const articleLinks = page.locator('a[href^="/blog/"]');
    const count = await articleLinks.count();

    if (count > 0) {
      const href = await articleLinks.first().getAttribute('href');
      expect(href).toMatch(/^\/blog\/[a-z0-9-]+$/);
    }
  });
});

test.describe('Blog Page — ES', () => {
  test('page loads at /es/blog with Spanish content', async ({ page }) => {
    await page.goto('/es/blog');

    await expect(
      page.locator('p').filter({ hasText: 'Artículos sobre desarrollo web' }),
    ).toBeVisible();
  });

  test('page title and meta description are set correctly for ES', async ({ page }) => {
    await page.goto('/es/blog');

    await expect(page).toHaveTitle('Blog — ChrisBP');

    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveAttribute(
      'content',
      'Artículos sobre desarrollo web, tecnología y proceso creativo',
    );
  });
});
