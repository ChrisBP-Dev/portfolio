import { test, expect } from '@playwright/test';

test.describe('Blog Article Page — EN', () => {
  let articleUrl: string;
  let hasArticles: boolean;

  test.beforeEach(async ({ page }) => {
    await page.goto('/blog');
    const articleLinks = page.locator('article a[href^="/blog/"]');
    const count = await articleLinks.count();
    hasArticles = count > 0;

    if (hasArticles) {
      articleUrl = (await articleLinks.first().getAttribute('href'))!;
      await page.goto(articleUrl);
    }
  });

  test('navigates from blog listing to article page', async ({ page }) => {
    test.skip(!hasArticles, 'No published blog articles — skipped');
    await expect(page).toHaveURL(/\/blog\/[a-z0-9-]+$/);
  });

  test('page has h1 with article title, time element, and reading time', async ({ page }) => {
    test.skip(!hasArticles, 'No published blog articles — skipped');
    const h1 = page.locator('h1');
    await expect(h1).toBeVisible();
    const h1Text = await h1.textContent();
    expect(h1Text!.trim().length).toBeGreaterThan(0);

    await expect(page.locator('time')).toBeVisible();
    await expect(page.locator('text=min read')).toBeVisible();
  });

  test('cover image has fetchpriority high when present', async ({ page }) => {
    test.skip(!hasArticles, 'No published blog articles — skipped');
    const coverImg = page.locator('article > img[fetchpriority="high"], article img[fetchpriority="high"]');
    const count = await coverImg.count();
    if (count > 0) {
      await expect(coverImg.first()).toBeVisible();
      await expect(coverImg.first()).toHaveAttribute('fetchpriority', 'high');
    }
  });

  test('content area .blog-content is visible with rendered HTML', async ({ page }) => {
    test.skip(!hasArticles, 'No published blog articles — skipped');
    const blogContent = page.locator('.blog-content');
    await expect(blogContent).toBeVisible();
  });

  test('back link navigates to /blog', async ({ page }) => {
    test.skip(!hasArticles, 'No published blog articles — skipped');
    const backLink = page.locator('a', { hasText: '← Back to Blog' });
    await expect(backLink).toBeVisible();
    await backLink.click();
    await expect(page).toHaveURL(/\/blog$/);
  });

  test('page title includes article title and ChrisBP', async ({ page }) => {
    test.skip(!hasArticles, 'No published blog articles — skipped');
    await expect(page).toHaveTitle(/.*— ChrisBP/);
  });

  test('OG meta tags present with type article', async ({ page }) => {
    test.skip(!hasArticles, 'No published blog articles — skipped');
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', /.+/);
    await expect(page.locator('meta[property="og:description"]')).toHaveAttribute('content', /.+/);
    await expect(page.locator('meta[property="og:type"]')).toHaveAttribute('content', 'article');
  });

  test('Twitter Card meta present', async ({ page }) => {
    test.skip(!hasArticles, 'No published blog articles — skipped');
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', /.+/);
  });
});

test.describe('Blog Article Page — ES', () => {
  let articleUrl: string;
  let hasArticles: boolean;

  test.beforeEach(async ({ page }) => {
    await page.goto('/es/blog');
    const articleLinks = page.locator('article a[href^="/es/blog/"]');
    const count = await articleLinks.count();
    hasArticles = count > 0;

    if (hasArticles) {
      articleUrl = (await articleLinks.first().getAttribute('href'))!;
      await page.goto(articleUrl);
    }
  });

  test('page loads at /es/blog/[slug] with Spanish content', async ({ page }) => {
    test.skip(!hasArticles, 'No published blog articles — skipped');
    await expect(page).toHaveURL(/\/es\/blog\/[a-z0-9-]+$/);
    await expect(page.locator('h1')).toBeVisible();
    await expect(page).toHaveTitle(/.*— ChrisBP/);
  });

  test('back link navigates to /es/blog', async ({ page }) => {
    test.skip(!hasArticles, 'No published blog articles — skipped');
    const backLink = page.locator('a', { hasText: '← Volver al Blog' });
    await expect(backLink).toBeVisible();
    await backLink.click();
    await expect(page).toHaveURL(/\/es\/blog$/);
  });
});
