import { test, expect } from '@playwright/test';

/** Scroll gallery into view to trigger client:visible hydration, then wait */
async function waitForHydration(page: import('@playwright/test').Page) {
  const gallery = page.locator('#screenshot-gallery');
  await gallery.scrollIntoViewIfNeeded();
  await page.locator('#screenshot-gallery[data-hydrated="true"]').waitFor({ timeout: 15_000 });
}

test.describe('ImageViewer — ES', () => {
  let detailUrl: string;

  test.beforeEach(async ({ page }) => {
    await page.goto('/projects');
    const firstCardLink = page.locator('main a[href*="/projects/"]').first();
    await expect(firstCardLink).toBeVisible();
    detailUrl = (await firstCardLink.getAttribute('href'))!;
    await page.goto(detailUrl);
  });

  test('dialog is in the DOM but hidden initially', async ({ page }) => {
    const gallery = page.locator('#screenshot-gallery');
    const galleryCount = await gallery.count();
    test.skip(galleryCount === 0, 'El primer proyecto no tiene screenshots — omitido');
    await expect(page.locator('dialog')).toBeHidden();
  });

  test('opens fullscreen overlay when clicking a screenshot', async ({ page }) => {
    const gallery = page.locator('#screenshot-gallery');
    const galleryCount = await gallery.count();
    test.skip(galleryCount === 0, 'El primer proyecto no tiene screenshots — omitido');
    await waitForHydration(page);

    const firstButton = gallery.locator('button[data-screenshot-index="0"]');
    await expect(firstButton).toBeVisible();
    await firstButton.click();

    const dialog = page.locator('dialog');
    await expect(dialog).toBeVisible();

    // Verify close button exists
    const closeButton = dialog.locator('button').first();
    await expect(closeButton).toBeVisible();

    // Verify image is visible inside dialog
    const dialogImage = dialog.locator('img');
    await expect(dialogImage).toBeVisible();
  });

  test('navigates to next/previous image with arrow buttons', async ({ page }) => {
    const gallery = page.locator('#screenshot-gallery');
    const galleryCount = await gallery.count();
    test.skip(galleryCount === 0, 'El primer proyecto no tiene screenshots — omitido');

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
    const gallery = page.locator('#screenshot-gallery');
    const galleryCount = await gallery.count();
    test.skip(galleryCount === 0, 'El primer proyecto no tiene screenshots — omitido');
    await waitForHydration(page);

    await gallery.locator('button[data-screenshot-index="0"]').click();
    const dialog = page.locator('dialog');
    await expect(dialog).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
  });

  test('closes on X button click', async ({ page }) => {
    const gallery = page.locator('#screenshot-gallery');
    const galleryCount = await gallery.count();
    test.skip(galleryCount === 0, 'El primer proyecto no tiene screenshots — omitido');
    await waitForHydration(page);

    await gallery.locator('button[data-screenshot-index="0"]').click();
    const dialog = page.locator('dialog');
    await expect(dialog).toBeVisible();

    const closeButton = dialog.locator('button[aria-label="Cerrar"]');
    await closeButton.click();
    await expect(dialog).toBeHidden();
  });

  test('navigates with arrow keys', async ({ page }) => {
    const gallery = page.locator('#screenshot-gallery');
    const galleryCount = await gallery.count();
    test.skip(galleryCount === 0, 'El primer proyecto no tiene screenshots — omitido');

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
    const gallery = page.locator('#screenshot-gallery');
    const galleryCount = await gallery.count();
    test.skip(galleryCount === 0, 'El primer proyecto no tiene screenshots — omitido');

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
    const gallery = page.locator('#screenshot-gallery');
    const galleryCount = await gallery.count();
    test.skip(galleryCount === 0, 'El primer proyecto no tiene screenshots — omitido');

    const buttons = gallery.locator('button[data-screenshot-index]');
    const buttonCount = await buttons.count();
    test.skip(buttonCount < 2, 'El proyecto tiene menos de 2 screenshots — omitido');
    await waitForHydration(page);

    await buttons.first().click();
    const dialog = page.locator('dialog');
    await expect(dialog).toBeVisible();

    // Close button aria-label
    await expect(dialog.locator('button[aria-label="Cerrar"]')).toBeVisible();
    // Nav arrows aria-labels
    await expect(dialog.locator('button[aria-label="Imagen anterior"]')).toBeVisible();
    await expect(dialog.locator('button[aria-label="Siguiente imagen"]')).toBeVisible();
  });
});

test.describe('ImageViewer — EN', () => {
  let detailUrl: string;

  test.beforeEach(async ({ page }) => {
    await page.goto('/en/projects');
    const firstCardLink = page.locator('main a[href*="/en/projects/"]').first();
    await expect(firstCardLink).toBeVisible();
    detailUrl = (await firstCardLink.getAttribute('href'))!;
    await page.goto(detailUrl);
  });

  test('has correct ARIA labels in English at /en/projects/[slug]', async ({ page }) => {
    const gallery = page.locator('#screenshot-gallery');
    const galleryCount = await gallery.count();
    test.skip(galleryCount === 0, 'First project has no screenshots — skipped');

    const buttons = gallery.locator('button[data-screenshot-index]');
    const buttonCount = await buttons.count();
    test.skip(buttonCount < 2, 'Project has fewer than 2 screenshots — skipped');
    await waitForHydration(page);

    await buttons.first().click();
    const dialog = page.locator('dialog');
    await expect(dialog).toBeVisible();

    // English ARIA labels
    await expect(dialog.locator('button[aria-label="Close"]')).toBeVisible();
    await expect(dialog.locator('button[aria-label="Previous image"]')).toBeVisible();
    await expect(dialog.locator('button[aria-label="Next image"]')).toBeVisible();

    // Counter in English
    const counter = dialog.locator('[aria-live="polite"]');
    await expect(counter).toContainText(/1 of \d+/);
  });
});
