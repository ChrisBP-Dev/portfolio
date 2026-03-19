import { test, expect } from '@playwright/test';

/** Scroll gallery into view to trigger client:visible hydration, then wait */
async function waitForHydration(page: import('@playwright/test').Page) {
  const gallery = page.locator('#screenshot-gallery');
  await gallery.scrollIntoViewIfNeeded();
  await page.locator('#screenshot-gallery[data-hydrated="true"]').waitFor({ timeout: 15_000 });
}

/**
 * D1: En lugar de asumir que el primer proyecto tiene screenshots, itera todos
 * los proyectos del listing hasta encontrar uno con #screenshot-gallery.
 * Devuelve la URL del proyecto o '' si ninguno tiene screenshots.
 */
async function findProjectWithScreenshots(
  page: import('@playwright/test').Page,
  baseHref: string,
  linkSelector: string,
): Promise<string> {
  await page.goto(baseHref);
  const cardLinks = page.locator(linkSelector);
  const count = await cardLinks.count();

  for (let i = 0; i < count; i++) {
    const href = (await cardLinks.nth(i).getAttribute('href'))!;
    await page.goto(href);
    if (await page.locator('#screenshot-gallery').count() > 0) {
      return href;
    }
  }
  return '';
}

test.describe('ImageViewer — ES', () => {
  let detailUrl: string;

  test.beforeEach(async ({ page }) => {
    // D1: busca el primer proyecto con screenshots, no asume el primero del listing
    detailUrl = await findProjectWithScreenshots(
      page,
      '/projects',
      'main a[href*="/projects/"]',
    );
  });

  test('dialog is in the DOM but hidden initially', async ({ page }) => {
    test.skip(!detailUrl, 'Ningún proyecto tiene screenshots — omitido');
    await page.goto(detailUrl);
    await expect(page.locator('dialog')).toBeHidden();
  });

  test('opens fullscreen overlay when clicking a screenshot', async ({ page }) => {
    test.skip(!detailUrl, 'Ningún proyecto tiene screenshots — omitido');
    await page.goto(detailUrl);
    await waitForHydration(page);

    const gallery = page.locator('#screenshot-gallery');
    const firstButton = gallery.locator('button[data-screenshot-index="0"]');
    await expect(firstButton).toBeVisible();
    await firstButton.click();

    const dialog = page.locator('dialog');
    await expect(dialog).toBeVisible();

    // Verify close button exists
    const closeButton = dialog.locator('button[aria-label="Cerrar visor de imágenes"]');
    await expect(closeButton).toBeVisible();

    // Verify image is visible inside dialog
    const dialogImage = dialog.locator('img');
    await expect(dialogImage).toBeVisible();
  });

  test('navigates to next/previous image with arrow buttons', async ({ page }) => {
    test.skip(!detailUrl, 'Ningún proyecto tiene screenshots — omitido');
    await page.goto(detailUrl);

    const gallery = page.locator('#screenshot-gallery');
    const buttons = gallery.locator('button[data-screenshot-index]');
    const buttonCount = await buttons.count();
    test.skip(buttonCount < 2, 'El proyecto tiene menos de 2 screenshots — omitido');
    await waitForHydration(page);

    await buttons.first().click();
    const dialog = page.locator('dialog');
    await expect(dialog).toBeVisible();

    // Get initial image src
    const dialogImage = dialog.locator('div > img');
    const initialSrc = await dialogImage.getAttribute('src');

    // Click next arrow
    const nextButton = dialog.locator('button[aria-label="Siguiente imagen"]');
    await nextButton.click();
    const nextSrc = await dialogImage.getAttribute('src');
    expect(nextSrc).not.toBe(initialSrc);

    // Click previous arrow
    const prevButton = dialog.locator('button[aria-label="Imagen anterior"]');
    await prevButton.click();
    const prevSrc = await dialogImage.getAttribute('src');
    expect(prevSrc).toBe(initialSrc);
  });

  test('closes on Escape key', async ({ page }) => {
    test.skip(!detailUrl, 'Ningún proyecto tiene screenshots — omitido');
    await page.goto(detailUrl);
    await waitForHydration(page);

    await page.locator('#screenshot-gallery button[data-screenshot-index="0"]').click();
    const dialog = page.locator('dialog');
    await expect(dialog).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
  });

  test('closes on X button click', async ({ page }) => {
    test.skip(!detailUrl, 'Ningún proyecto tiene screenshots — omitido');
    await page.goto(detailUrl);
    await waitForHydration(page);

    await page.locator('#screenshot-gallery button[data-screenshot-index="0"]').click();
    const dialog = page.locator('dialog');
    await expect(dialog).toBeVisible();

    // P9: label actualizado a "Cerrar visor de imágenes"
    const closeButton = dialog.locator('button[aria-label="Cerrar visor de imágenes"]');
    await closeButton.click();
    await expect(dialog).toBeHidden();
  });

  test('navigates with arrow keys', async ({ page }) => {
    test.skip(!detailUrl, 'Ningún proyecto tiene screenshots — omitido');
    await page.goto(detailUrl);

    const gallery = page.locator('#screenshot-gallery');
    const buttons = gallery.locator('button[data-screenshot-index]');
    const buttonCount = await buttons.count();
    test.skip(buttonCount < 2, 'El proyecto tiene menos de 2 screenshots — omitido');
    await waitForHydration(page);

    await buttons.first().click();
    const dialog = page.locator('dialog');
    await expect(dialog).toBeVisible();

    const dialogImage = dialog.locator('div > img');
    const initialSrc = await dialogImage.getAttribute('src');

    await page.keyboard.press('ArrowRight');
    const nextSrc = await dialogImage.getAttribute('src');
    expect(nextSrc).not.toBe(initialSrc);

    await page.keyboard.press('ArrowLeft');
    const backSrc = await dialogImage.getAttribute('src');
    expect(backSrc).toBe(initialSrc);
  });

  test('displays image counter', async ({ page }) => {
    test.skip(!detailUrl, 'Ningún proyecto tiene screenshots — omitido');
    await page.goto(detailUrl);

    const gallery = page.locator('#screenshot-gallery');
    const buttons = gallery.locator('button[data-screenshot-index]');
    const buttonCount = await buttons.count();
    test.skip(buttonCount < 2, 'El proyecto tiene menos de 2 screenshots — omitido');
    await waitForHydration(page);

    await buttons.first().click();
    const dialog = page.locator('dialog');
    await expect(dialog).toBeVisible();

    const counter = dialog.locator('[aria-live="polite"]');
    await expect(counter).toBeVisible();
    await expect(counter).toContainText(/1 de \d+/);
  });

  test('has correct ARIA labels in Spanish', async ({ page }) => {
    test.skip(!detailUrl, 'Ningún proyecto tiene screenshots — omitido');
    await page.goto(detailUrl);

    const gallery = page.locator('#screenshot-gallery');
    const buttons = gallery.locator('button[data-screenshot-index]');
    const buttonCount = await buttons.count();
    test.skip(buttonCount < 2, 'El proyecto tiene menos de 2 screenshots — omitido');
    await waitForHydration(page);

    await buttons.first().click();
    const dialog = page.locator('dialog');
    await expect(dialog).toBeVisible();

    // P9: label descriptivo con contexto
    await expect(dialog.locator('button[aria-label="Cerrar visor de imágenes"]')).toBeVisible();
    await expect(dialog.locator('button[aria-label="Imagen anterior"]')).toBeVisible();
    await expect(dialog.locator('button[aria-label="Siguiente imagen"]')).toBeVisible();
  });

  test('restores focus to thumbnail after closing', async ({ page }) => {
    test.skip(!detailUrl, 'Ningún proyecto tiene screenshots — omitido');
    await page.goto(detailUrl);
    await waitForHydration(page);

    const firstButton = page.locator('#screenshot-gallery button[data-screenshot-index="0"]');
    await firstButton.click();
    const dialog = page.locator('dialog');
    await expect(dialog).toBeVisible();

    // P1: al cerrar, el foco debe regresar al thumbnail original (WCAG 2.4.3)
    await dialog.locator('button[aria-label="Cerrar visor de imágenes"]').click();
    await expect(dialog).toBeHidden();
    await expect(firstButton).toBeFocused();
  });
});

test.describe('ImageViewer — EN', () => {
  let detailUrl: string;

  test.beforeEach(async ({ page }) => {
    // D1: busca el primer proyecto con screenshots, no asume el primero del listing
    detailUrl = await findProjectWithScreenshots(
      page,
      '/en/projects',
      'main a[href*="/en/projects/"]',
    );
  });

  test('dialog is in the DOM but hidden initially', async ({ page }) => {
    test.skip(!detailUrl, 'No project has screenshots — skipped');
    await page.goto(detailUrl);
    await expect(page.locator('dialog')).toBeHidden();
  });

  test('opens fullscreen overlay when clicking a screenshot', async ({ page }) => {
    test.skip(!detailUrl, 'No project has screenshots — skipped');
    await page.goto(detailUrl);
    await waitForHydration(page);

    const gallery = page.locator('#screenshot-gallery');
    const firstButton = gallery.locator('button[data-screenshot-index="0"]');
    await expect(firstButton).toBeVisible();
    await firstButton.click();

    const dialog = page.locator('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog.locator('button[aria-label="Close image viewer"]')).toBeVisible();
    await expect(dialog.locator('img')).toBeVisible();
  });

  test('navigates to next/previous image with arrow buttons', async ({ page }) => {
    test.skip(!detailUrl, 'No project has screenshots — skipped');
    await page.goto(detailUrl);

    const gallery = page.locator('#screenshot-gallery');
    const buttons = gallery.locator('button[data-screenshot-index]');
    const buttonCount = await buttons.count();
    test.skip(buttonCount < 2, 'Project has fewer than 2 screenshots — skipped');
    await waitForHydration(page);

    await buttons.first().click();
    const dialog = page.locator('dialog');
    await expect(dialog).toBeVisible();

    const dialogImage = dialog.locator('div > img');
    const initialSrc = await dialogImage.getAttribute('src');

    await dialog.locator('button[aria-label="Next image"]').click();
    expect(await dialogImage.getAttribute('src')).not.toBe(initialSrc);

    await dialog.locator('button[aria-label="Previous image"]').click();
    expect(await dialogImage.getAttribute('src')).toBe(initialSrc);
  });

  test('closes on Escape key', async ({ page }) => {
    test.skip(!detailUrl, 'No project has screenshots — skipped');
    await page.goto(detailUrl);
    await waitForHydration(page);

    await page.locator('#screenshot-gallery button[data-screenshot-index="0"]').click();
    const dialog = page.locator('dialog');
    await expect(dialog).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
  });

  test('closes on X button click', async ({ page }) => {
    test.skip(!detailUrl, 'No project has screenshots — skipped');
    await page.goto(detailUrl);
    await waitForHydration(page);

    await page.locator('#screenshot-gallery button[data-screenshot-index="0"]').click();
    const dialog = page.locator('dialog');
    await expect(dialog).toBeVisible();

    await dialog.locator('button[aria-label="Close image viewer"]').click();
    await expect(dialog).toBeHidden();
  });

  test('navigates with arrow keys', async ({ page }) => {
    test.skip(!detailUrl, 'No project has screenshots — skipped');
    await page.goto(detailUrl);

    const gallery = page.locator('#screenshot-gallery');
    const buttons = gallery.locator('button[data-screenshot-index]');
    const buttonCount = await buttons.count();
    test.skip(buttonCount < 2, 'Project has fewer than 2 screenshots — skipped');
    await waitForHydration(page);

    await buttons.first().click();
    const dialog = page.locator('dialog');
    await expect(dialog).toBeVisible();

    const dialogImage = dialog.locator('div > img');
    const initialSrc = await dialogImage.getAttribute('src');

    await page.keyboard.press('ArrowRight');
    expect(await dialogImage.getAttribute('src')).not.toBe(initialSrc);

    await page.keyboard.press('ArrowLeft');
    expect(await dialogImage.getAttribute('src')).toBe(initialSrc);
  });

  test('displays image counter', async ({ page }) => {
    test.skip(!detailUrl, 'No project has screenshots — skipped');
    await page.goto(detailUrl);

    const gallery = page.locator('#screenshot-gallery');
    const buttons = gallery.locator('button[data-screenshot-index]');
    const buttonCount = await buttons.count();
    test.skip(buttonCount < 2, 'Project has fewer than 2 screenshots — skipped');
    await waitForHydration(page);

    await buttons.first().click();
    const dialog = page.locator('dialog');
    await expect(dialog).toBeVisible();

    const counter = dialog.locator('[aria-live="polite"]');
    await expect(counter).toBeVisible();
    await expect(counter).toContainText(/1 of \d+/);
  });

  test('has correct ARIA labels in English', async ({ page }) => {
    test.skip(!detailUrl, 'No project has screenshots — skipped');
    await page.goto(detailUrl);

    const gallery = page.locator('#screenshot-gallery');
    const buttons = gallery.locator('button[data-screenshot-index]');
    const buttonCount = await buttons.count();
    test.skip(buttonCount < 2, 'Project has fewer than 2 screenshots — skipped');
    await waitForHydration(page);

    await buttons.first().click();
    const dialog = page.locator('dialog');
    await expect(dialog).toBeVisible();

    // P9: label descriptivo con contexto
    await expect(dialog.locator('button[aria-label="Close image viewer"]')).toBeVisible();
    await expect(dialog.locator('button[aria-label="Previous image"]')).toBeVisible();
    await expect(dialog.locator('button[aria-label="Next image"]')).toBeVisible();
  });

  test('restores focus to thumbnail after closing', async ({ page }) => {
    test.skip(!detailUrl, 'No project has screenshots — skipped');
    await page.goto(detailUrl);
    await waitForHydration(page);

    const firstButton = page.locator('#screenshot-gallery button[data-screenshot-index="0"]');
    await firstButton.click();
    const dialog = page.locator('dialog');
    await expect(dialog).toBeVisible();

    await dialog.locator('button[aria-label="Close image viewer"]').click();
    await expect(dialog).toBeHidden();
    await expect(firstButton).toBeFocused();
  });
});
