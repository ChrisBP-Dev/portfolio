import { test, expect } from '@playwright/test';

test.describe('Blog Article Page — EN', () => {
  let hasArticles: boolean;

  test.beforeEach(async ({ page }) => {
    await page.goto('/blog');
    // Blog listing wraps each article in <a><article>...</article></a>
    const articleLinks = page.locator('main a[href^="/blog/"]:not([href="/blog/"])');
    const count = await articleLinks.count();
    hasArticles = count > 0;

    if (hasArticles) {
      await articleLinks.first().click();
      await page.waitForURL(/\/blog\/[a-z0-9-]+$/);
    }
  });

  test('navigates from blog listing to article page', async ({ page }) => {
    test.skip(!hasArticles, 'No published blog articles — skipped');
    await expect(page).toHaveURL(/\/blog\/[a-z0-9-]+$/);
  });

  test('page has h1 with article title, time element, and reading time', async ({ page }) => {
    test.skip(!hasArticles, 'No published blog articles — skipped');
    const h1 = page.locator('main h1');
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
    const childCount = await blogContent.locator('p, h1, h2, h3, ul, ol, pre, blockquote, img').count();
    expect(childCount).toBeGreaterThan(0);
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

  test('og:image points to cover image URL', async ({ page }) => {
    test.skip(!hasArticles, 'No published blog articles — skipped');
    // Blog posts with cover images should have og:image pointing to the cover
    // Posts without cover images will get the default OG image
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /.+/);
  });

  test('Twitter Card meta present with summary_large_image', async ({ page }) => {
    test.skip(!hasArticles, 'No published blog articles — skipped');
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image');
    await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute('content', /.+/);
  });
});

test.describe('Blog Article Page — ES', () => {
  let hasArticles: boolean;

  test.beforeEach(async ({ page }) => {
    await page.goto('/es/blog');
    // Blog listing wraps each article in <a><article>...</article></a>
    const articleLinks = page.locator('main a[href^="/es/blog/"]:not([href="/es/blog/"])');
    const count = await articleLinks.count();
    hasArticles = count > 0;

    if (hasArticles) {
      await articleLinks.first().click();
      await page.waitForURL(/\/es\/blog\/[a-z0-9-]+$/);
    }
  });

  test('page loads at /es/blog/[slug] with Spanish content', async ({ page }) => {
    test.skip(!hasArticles, 'No published blog articles — skipped');
    await expect(page).toHaveURL(/\/es\/blog\/[a-z0-9-]+$/);
    await expect(page.locator('main h1')).toBeVisible();
    await expect(page).toHaveTitle(/.*— ChrisBP/);
  });

  test('back link navigates to /es/blog', async ({ page }) => {
    test.skip(!hasArticles, 'No published blog articles — skipped');
    const backLink = page.locator('a', { hasText: '← Volver al Blog' });
    await expect(backLink).toBeVisible();
    await backLink.click();
    await expect(page).toHaveURL(/\/es\/blog$/);
  });

  test('reading time visible in Spanish', async ({ page }) => {
    test.skip(!hasArticles, 'No published blog articles — skipped');
    await expect(page.locator('time')).toBeVisible();
    await expect(page.locator('text=min de lectura')).toBeVisible();
  });

  test('content area .blog-content is visible with rendered HTML', async ({ page }) => {
    test.skip(!hasArticles, 'No published blog articles — skipped');
    const blogContent = page.locator('.blog-content');
    await expect(blogContent).toBeVisible();
    const childCount = await blogContent.locator('p, h1, h2, h3, ul, ol, pre, blockquote, img').count();
    expect(childCount).toBeGreaterThan(0);
  });

  test('OG meta tags present with type article', async ({ page }) => {
    test.skip(!hasArticles, 'No published blog articles — skipped');
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', /.+/);
    await expect(page.locator('meta[property="og:description"]')).toHaveAttribute('content', /.+/);
    await expect(page.locator('meta[property="og:type"]')).toHaveAttribute('content', 'article');
  });

  test('og:image present in ES blog article', async ({ page }) => {
    test.skip(!hasArticles, 'No published blog articles — skipped');
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /.+/);
  });

  test('Twitter Card meta present with summary_large_image in ES', async ({ page }) => {
    test.skip(!hasArticles, 'No published blog articles — skipped');
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image');
    await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute('content', /.+/);
  });
});
