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
