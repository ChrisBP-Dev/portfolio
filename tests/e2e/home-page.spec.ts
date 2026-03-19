import { test, expect } from '@playwright/test';

test.describe('Home Page — ES (default locale)', () => {
  test('hero section is visible with heading, description and CTAs', async ({ page }) => {
    await page.goto('/');

    const hero = page.locator('section').first();
    await expect(hero).toBeVisible();

    await expect(page.getByRole('heading', { level: 1 })).toContainText('Yo programo y creo');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('contenido');

    await expect(page.getByRole('link', { name: 'Contáctame' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Descargar CV' })).toBeVisible();
  });

  test('knowledge of section is visible with title and at least 1 technology', async ({
    page,
  }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { name: 'CONOCIMIENTOS' })).toBeVisible();

    const techItems = page.locator('img[loading="lazy"]');
    await expect(techItems.first()).toBeVisible();
  });
});

test.describe('Home Page — ES: Projects section', () => {
  test('projects section is visible with gradient title, cards, and See All button', async ({
    page,
  }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { name: 'Proyectos' })).toBeVisible();

    const projectCards = page.locator('a[href*="/projects/"]');
    await expect(projectCards.first()).toBeVisible();

    const projectImages = projectCards.first().locator('img[loading="lazy"]');
    await expect(projectImages.first()).toBeVisible();

    await expect(page.getByRole('link', { name: 'Ver Todos' })).toBeVisible();
  });

  test('project cards link to correct href pattern', async ({ page }) => {
    await page.goto('/');

    const projectCard = page.locator('a[href*="/projects/"]').first();
    const href = await projectCard.getAttribute('href');
    expect(href).toMatch(/^\/projects\/[\w-]+$/);
  });
});

test.describe('Home Page — ES: Experience section', () => {
  test('experience section is visible with title', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { name: 'EXPERIENCIA' })).toBeVisible();
  });
});

test.describe('Home Page — EN', () => {
  test('hero section displays English translations', async ({ page }) => {
    await page.goto('/en/');

    await expect(page.getByRole('heading', { level: 1 })).toContainText('I code and create');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('content');

    await expect(page.getByRole('link', { name: 'Get in Touch' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Download Resume' })).toBeVisible();
  });

  test('knowledge of section displays English title', async ({ page }) => {
    await page.goto('/en/');

    await expect(page.getByRole('heading', { name: 'KNOWLEDGE OF' })).toBeVisible();
  });

  test('projects section displays English title and See All button', async ({ page }) => {
    await page.goto('/en/');

    await expect(page.getByRole('heading', { name: 'Projects' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'See All' })).toBeVisible();

    const projectCard = page.locator('a[href*="/en/projects/"]').first();
    await expect(projectCard).toBeVisible();
    const href = await projectCard.getAttribute('href');
    expect(href).toMatch(/^\/en\/projects\/[\w-]+$/);
  });

  test('experience section displays English title', async ({ page }) => {
    await page.goto('/en/');

    await expect(page.getByRole('heading', { name: 'EXPERIENCE' })).toBeVisible();
  });
});
