import { test, expect } from '@playwright/test';

test.describe('Projects Page — EN', () => {
  test('page loads with intro text, filter dropdown, and project cards', async ({ page }) => {
    await page.goto('/projects');

    await expect(page.locator('p').filter({ hasText: 'As a developer' })).toBeVisible();

    await expect(page.locator('main select')).toBeVisible();

    const projectCards = page.locator('article');
    await expect(projectCards.first()).toBeVisible();
  });

  test('filter dropdown shows "All Projects" by default with technology options', async ({
    page,
  }) => {
    await page.goto('/projects');

    const select = page.locator('main select');
    await expect(select).toHaveValue('');

    const defaultOption = select.locator('option[value=""]');
    await expect(defaultOption).toHaveText('All Projects');

    const options = select.locator('option');
    const count = await options.count();
    expect(count).toBeGreaterThan(1);
  });

  test('selecting a technology filters project cards', async ({ page }) => {
    await page.goto('/projects');

    const allCards = page.locator('article');
    const initialCount = await allCards.count();

    const select = page.locator('main select');
    const options = select.locator('option:not([value=""])');
    const firstTechValue = await options.first().getAttribute('value');
    expect(firstTechValue).toBeTruthy();

    await select.selectOption(firstTechValue!);

    const filteredCards = page.locator('article');
    const filteredCount = await filteredCards.count();
    expect(filteredCount).toBeLessThanOrEqual(initialCount);
    expect(filteredCount).toBeGreaterThan(0);

    await select.selectOption('');

    const restoredCards = page.locator('article');
    const restoredCount = await restoredCards.count();
    expect(restoredCount).toBe(initialCount);
  });

  test('each project card shows name, description, technology chips, and screenshots', async ({
    page,
  }) => {
    await page.goto('/projects');

    const card = page.locator('article').first();
    await expect(card).toBeVisible();

    await expect(card.locator('h2')).toBeVisible();

    await expect(card.locator('p').first()).toBeVisible();

    const techChips = card.locator('span.inline-flex');
    await expect(techChips.first()).toBeVisible();

    const screenshots = card.locator('img[loading="lazy"]');
    await expect(screenshots.first()).toBeVisible();
  });
});

test.describe('Projects Page — ES', () => {
  test('page loads with Spanish content at /es/projects', async ({ page }) => {
    await page.goto('/es/projects');

    await expect(page.locator('p').filter({ hasText: 'Como desarrollador' })).toBeVisible();

    const select = page.locator('main select');
    const defaultOption = select.locator('option[value=""]');
    await expect(defaultOption).toHaveText('Todos los Proyectos');
  });

  test('filter works correctly in Spanish locale', async ({ page }) => {
    await page.goto('/es/projects');

    const allCards = page.locator('article');
    const initialCount = await allCards.count();
    expect(initialCount).toBeGreaterThan(0);

    const select = page.locator('main select');
    const options = select.locator('option:not([value=""])');
    const firstTechValue = await options.first().getAttribute('value');
    expect(firstTechValue).toBeTruthy();

    await select.selectOption(firstTechValue!);

    const filteredCards = page.locator('article');
    const filteredCount = await filteredCards.count();
    expect(filteredCount).toBeGreaterThan(0);
  });
});
