import { test, expect } from '@playwright/test';

test.describe('Home Page — EN (default locale)', () => {
  test('hero section is visible with heading, description and CTAs', async ({ page }) => {
    await page.goto('/');

    const hero = page.locator('section').first();
    await expect(hero).toBeVisible();

    await expect(page.getByRole('heading', { level: 1 })).toContainText('I build and create');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('experiences');

    await expect(page.getByRole('link', { name: 'Get in Touch' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Download Resume' })).toBeVisible();
  });

  test('knowledge of section is visible with title and at least 1 technology', async ({
    page,
  }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { name: 'KNOWLEDGE OF' })).toBeVisible();

    const techItems = page.locator('img[loading="lazy"]');
    await expect(techItems.first()).toBeVisible();
  });
});

test.describe('Home Page — EN: Projects section', () => {
  test('projects section is visible with gradient title, cards, and See All button', async ({
    page,
  }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { name: 'Projects' })).toBeVisible();

    const projectCards = page.locator('a[href*="/projects/"]');
    await expect(projectCards.first()).toBeVisible();

    const projectImages = projectCards.first().locator('img[loading="lazy"]');
    await expect(projectImages.first()).toBeVisible();

    await expect(page.getByRole('link', { name: 'See All' })).toBeVisible();
  });

  test('project cards link to correct href pattern', async ({ page }) => {
    await page.goto('/');

    const projectCard = page.locator('a[href*="/projects/"]').first();
    const href = await projectCard.getAttribute('href');
    expect(href).toMatch(/^\/projects\/[\w-]+$/);
  });
});

test.describe('Home Page — EN: Experience section', () => {
  test('experience section is visible with title', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { name: 'EXPERIENCE', exact: true })).toBeVisible();
  });
});

test.describe('Home Page — ES', () => {
  test('hero section displays Spanish translations', async ({ page }) => {
    await page.goto('/es/');

    await expect(page.getByRole('heading', { level: 1 })).toContainText('Yo construyo y creo');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('experiencias');

    await expect(page.getByRole('link', { name: 'Contáctame' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Descargar CV' })).toBeVisible();
  });

  test('knowledge of section displays Spanish title', async ({ page }) => {
    await page.goto('/es/');

    await expect(page.getByRole('heading', { name: 'CONOCIMIENTOS' })).toBeVisible();
  });

  test('projects section displays Spanish title and See All button', async ({ page }) => {
    await page.goto('/es/');

    await expect(page.getByRole('heading', { name: 'Proyectos' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Ver Todos' })).toBeVisible();

    const projectCard = page.locator('a[href*="/es/projects/"]').first();
    await expect(projectCard).toBeVisible();
    const href = await projectCard.getAttribute('href');
    expect(href).toMatch(/^\/es\/projects\/[\w-]+$/);
  });

  test('experience section displays Spanish title', async ({ page }) => {
    await page.goto('/es/');

    await expect(page.getByRole('heading', { name: 'EXPERIENCIA', exact: true })).toBeVisible();
  });
});

test.describe('Home Page — EN: OG and Twitter meta tags', () => {
  test('has all required OG meta tags', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', /.+/);
    await expect(page.locator('meta[property="og:description"]')).toHaveAttribute('content', /.+/);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /\/images\/og-default\.png$/);
    // Absolute URL check — built HTML uses https://portfolio-chrisbp.web.app; ClientRouter rewrites to browser URL in preview
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', /^https?:\/\//);
    await expect(page.locator('meta[property="og:type"]')).toHaveAttribute('content', 'website');
  });

  test('has all required Twitter meta tags', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image');
    await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute('content', /.+/);
    await expect(page.locator('meta[name="twitter:description"]')).toHaveAttribute('content', /.+/);
    await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute('content', /\/images\/og-default\.png$/);
  });
});

test.describe('Home Page — ES: OG and Twitter meta tags', () => {
  test('has all required OG meta tags in ES locale', async ({ page }) => {
    await page.goto('/es/');

    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', /.+/);
    await expect(page.locator('meta[property="og:description"]')).toHaveAttribute('content', /.+/);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /\/images\/og-default\.png$/);
    // Absolute URL check — built HTML uses https://portfolio-chrisbp.web.app; ClientRouter rewrites to browser URL in preview
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', /^https?:\/\//);
    await expect(page.locator('meta[property="og:type"]')).toHaveAttribute('content', 'website');
  });

  test('has all required Twitter meta tags in ES locale', async ({ page }) => {
    await page.goto('/es/');

    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image');
    await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute('content', /.+/);
    await expect(page.locator('meta[name="twitter:description"]')).toHaveAttribute('content', /.+/);
    await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute('content', /\/images\/og-default\.png$/);
  });
});

test.describe('Cross-page — meta description uniqueness', () => {
  test('each public page has a unique meta description', async ({ page }) => {
    const descriptions = new Map<string, string>();
    const pages = ['/', '/es/', '/projects', '/es/projects', '/blog', '/es/blog', '/contact', '/es/contact'];

    for (const url of pages) {
      await page.goto(url);
      const desc = await page.locator('meta[name="description"]').getAttribute('content');
      expect(desc, `meta description missing on ${url}`).toBeTruthy();
      descriptions.set(url, desc!);
    }

    // Group by locale and verify uniqueness within each locale
    const enDescs = [descriptions.get('/')!, descriptions.get('/projects')!, descriptions.get('/blog')!, descriptions.get('/contact')!];
    const esDescs = [descriptions.get('/es/')!, descriptions.get('/es/projects')!, descriptions.get('/es/blog')!, descriptions.get('/es/contact')!];

    expect(new Set(enDescs).size, 'EN descriptions should all be unique').toBe(enDescs.length);
    expect(new Set(esDescs).size, 'ES descriptions should all be unique').toBe(esDescs.length);
  });
});

test.describe('Cross-page — twitter:card on all public pages', () => {
  test('all public pages have twitter:card=summary_large_image', async ({ page }) => {
    const pages = ['/', '/es/', '/projects', '/es/projects', '/blog', '/es/blog', '/contact', '/es/contact'];

    for (const url of pages) {
      await page.goto(url);
      await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image');
    }
  });
});
