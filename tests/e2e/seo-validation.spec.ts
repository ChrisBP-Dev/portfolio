import { test, expect } from '@playwright/test';

test.describe('Sitemap', () => {
  test('sitemap-index.xml is accessible and references sitemap-0.xml', async ({ page }) => {
    const response = await page.goto('/sitemap-index.xml');
    expect(response).not.toBeNull();
    expect(response!.status()).toBe(200);
    const text = await response!.text();
    expect(text).toContain('sitemap-0.xml');
  });

  test('sitemap-0.xml contains both locale URLs for public pages', async ({ page }) => {
    const response = await page.goto('/sitemap-0.xml');
    expect(response).not.toBeNull();
    expect(response!.status()).toBe(200);
    const text = await response!.text();

    // Home pages
    expect(text).toContain('https://portfolio-chrisbp.web.app/</loc>');
    expect(text).toContain('https://portfolio-chrisbp.web.app/es/</loc>');

    // Projects listing
    expect(text).toContain('https://portfolio-chrisbp.web.app/projects/</loc>');
    expect(text).toContain('https://portfolio-chrisbp.web.app/es/projects/</loc>');

    // Blog listing
    expect(text).toContain('https://portfolio-chrisbp.web.app/blog/</loc>');
    expect(text).toContain('https://portfolio-chrisbp.web.app/es/blog/</loc>');

    // Contact
    expect(text).toContain('https://portfolio-chrisbp.web.app/contact/</loc>');
    expect(text).toContain('https://portfolio-chrisbp.web.app/es/contact/</loc>');

    // hreflang alternate links present
    expect(text).toContain('hreflang="en"');
    expect(text).toContain('hreflang="es"');

    // Admin pages excluded
    expect(text).not.toContain('/admin');
  });
});

test.describe('robots.txt', () => {
  test('includes Sitemap directive and blocks /admin', async ({ page }) => {
    const response = await page.goto('/robots.txt');
    expect(response).not.toBeNull();
    expect(response!.status()).toBe(200);
    const text = await response!.text();

    expect(text).toContain('Sitemap: https://portfolio-chrisbp.web.app/sitemap-index.xml');
    expect(text).toContain('Disallow: /admin');
    expect(text).toContain('Allow: /');
  });
});

test.describe('JSON-LD — Home Page (Person)', () => {
  test('EN home has valid Person JSON-LD', async ({ page }) => {
    await page.goto('/');
    const ldScript = page.locator('script[type="application/ld+json"]');
    const text = await ldScript.textContent();
    expect(text).not.toBeNull();
    const data = JSON.parse(text!);
    expect(data['@context']).toBe('https://schema.org');
    expect(data['@type']).toBe('Person');
    expect(data.name).toBe('Christopher Bobadilla');
    expect(data.jobTitle).toBe('Mobile & Web Developer');
    expect(data.sameAs).toHaveLength(3);
    expect(data.url).toContain('https://portfolio-chrisbp.web.app');
  });

  test('ES home has valid Person JSON-LD', async ({ page }) => {
    await page.goto('/es/');
    const ldScript = page.locator('script[type="application/ld+json"]');
    const text = await ldScript.textContent();
    expect(text).not.toBeNull();
    const data = JSON.parse(text!);
    expect(data['@type']).toBe('Person');
    expect(data.name).toBe('Christopher Bobadilla');
  });
});

test.describe('JSON-LD — Listing Pages (no JSON-LD)', () => {
  test('projects listing does NOT have JSON-LD', async ({ page }) => {
    await page.goto('/projects');
    const ldScripts = page.locator('script[type="application/ld+json"]');
    await expect(ldScripts).toHaveCount(0);
  });

  test('blog listing does NOT have JSON-LD', async ({ page }) => {
    await page.goto('/blog');
    const ldScripts = page.locator('script[type="application/ld+json"]');
    await expect(ldScripts).toHaveCount(0);
  });

  test('contact page does NOT have JSON-LD', async ({ page }) => {
    await page.goto('/contact');
    const ldScripts = page.locator('script[type="application/ld+json"]');
    await expect(ldScripts).toHaveCount(0);
  });
});

test.describe('JSON-LD — Project Detail (CreativeWork)', () => {
  test('project detail page has valid CreativeWork JSON-LD', async ({ page }) => {
    // Navigate to projects listing to discover first project slug
    await page.goto('/projects');
    const firstLink = page.locator('main a[href*="/projects/"]').first();
    await expect(firstLink).toBeVisible();
    const href = await firstLink.getAttribute('href');
    await page.goto(href!);

    const ldScript = page.locator('script[type="application/ld+json"]');
    const text = await ldScript.textContent();
    expect(text).not.toBeNull();
    const data = JSON.parse(text!);
    expect(data['@context']).toBe('https://schema.org');
    expect(data['@type']).toBe('CreativeWork');
    expect(data.name).toBeTruthy();
    expect(data.description).toBeTruthy();
    expect(data.url).toBeTruthy();
    expect(data.author).toEqual({ '@type': 'Person', name: 'Christopher Bobadilla' });
  });
});

test.describe('JSON-LD — Blog Article (BlogPosting)', () => {
  let hasArticles: boolean;

  test.beforeEach(async ({ page }) => {
    await page.goto('/blog');
    const articleLinks = page.locator('main a[href^="/blog/"]:not([href="/blog/"])');
    const count = await articleLinks.count();
    hasArticles = count > 0;

    if (hasArticles) {
      await articleLinks.first().click();
      await page.waitForURL(/\/blog\/[a-z0-9-]+$/);
    }
  });

  test('blog article page has valid BlogPosting JSON-LD', async ({ page }) => {
    test.skip(!hasArticles, 'No published blog articles — skipped');

    const ldScript = page.locator('script[type="application/ld+json"]');
    const text = await ldScript.textContent();
    expect(text).not.toBeNull();
    const data = JSON.parse(text!);
    expect(data['@context']).toBe('https://schema.org');
    expect(data['@type']).toBe('BlogPosting');
    expect(data.headline).toBeTruthy();
    expect(data.datePublished).toBeTruthy();
    expect(data.dateModified).toBeTruthy();
    expect(data.author.name).toBe('Christopher Bobadilla');
    expect(data.author.url).toContain('https://portfolio-chrisbp.web.app');
    expect(data.url).toBeTruthy();
    expect(data.description).toBeTruthy();
  });
});
