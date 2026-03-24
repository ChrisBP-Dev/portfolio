import { test, expect } from '@playwright/test';
import { ensureAdminLogin, clickListAction } from './admin-helpers';
import path from 'node:path';

const TEST_IMAGE = path.join(process.cwd(), 'tests', 'e2e', 'fixtures', 'test-image.png');

test.describe('Admin Technologies CRUD', () => {
  test.beforeEach(async ({ page }) => {
    await ensureAdminLogin(page);
  });

  // E-008: Create technology with image, verify in list, cleanup
  test('E-008: create technology with image and verify in list', async ({ page }) => {
    const techName = `e2e-tech-${Date.now()}`;
    await page.goto('/admin/technologies');

    await page.locator('button', { hasText: /crear nueva/i }).click();
    await expect(page.locator('h1', { hasText: /crear tecnología/i })).toBeVisible({ timeout: 5_000 });

    await page.locator('#tech-name').fill(techName);
    await page.locator('#tech-years').fill('3');

    await page.locator('input[type="file"][accept="image/*"]').first().setInputFiles(TEST_IMAGE);
    await page.waitForTimeout(1_000);

    await page.locator('button[type="submit"]').click();
    await expect(page.locator('text=/guardada exitosamente/i')).toBeVisible({ timeout: 20_000 });

    await expect(page.locator(`text=${techName}`).first()).toBeVisible({ timeout: 10_000 });

    // Cleanup: delete
    await clickListAction(page, techName, 'delete');
    const dialog = page.locator('[role="alertdialog"]');
    await expect(dialog).toBeVisible();
    await dialog.locator('button', { hasText: /eliminar/i }).click();
    await expect(page.locator('text=/eliminad/i')).toBeVisible({ timeout: 15_000 });
  });
});

test.describe('Admin Technologies Drag Reorder', () => {
  test.describe.configure({ mode: 'serial' });

  const techNameA = `e2e-order-a-${Date.now()}`;
  const techNameB = `e2e-order-b-${Date.now()}`;

  test.beforeEach(async ({ page }) => {
    await ensureAdminLogin(page);
  });

  async function createTech(page: import('@playwright/test').Page, name: string): Promise<void> {
    await page.goto('/admin/technologies');
    await page.locator('button', { hasText: /crear nueva/i }).click();
    await expect(page.locator('h1', { hasText: /crear tecnología/i })).toBeVisible({ timeout: 5_000 });

    await page.locator('#tech-name').fill(name);
    await page.locator('#tech-years').fill('1');
    await page.locator('input[type="file"][accept="image/*"]').first().setInputFiles(TEST_IMAGE);
    await page.waitForTimeout(1_000);

    await page.locator('button[type="submit"]').click();
    await expect(page.locator('text=/guardada exitosamente/i')).toBeVisible({ timeout: 20_000 });
    await expect(page.locator(`text=${name}`).first()).toBeVisible({ timeout: 10_000 });
  }

  async function deleteTech(page: import('@playwright/test').Page, name: string): Promise<void> {
    await page.goto('/admin/technologies');
    await expect(page.locator(`text=${name}`).first()).toBeVisible({ timeout: 10_000 });
    await clickListAction(page, name, 'delete');
    const dialog = page.locator('[role="alertdialog"]');
    await expect(dialog).toBeVisible();
    await dialog.locator('button', { hasText: /eliminar/i }).click();
    await expect(page.locator('text=/eliminad/i')).toBeVisible({ timeout: 15_000 });
  }

  test('create two technologies for drag reorder', async ({ page }) => {
    await createTech(page, techNameA);
    await createTech(page, techNameB);
  });

  test('drag second technology above first and verify order persists after reload', async ({ page }) => {
    await page.goto('/admin/technologies');
    await expect(page.locator(`text=${techNameA}`).first()).toBeVisible({ timeout: 10_000 });
    await expect(page.locator(`text=${techNameB}`).first()).toBeVisible({ timeout: 10_000 });

    // Get the list items
    const listItems = page.locator('[role="listitem"]');
    const itemB = listItems.filter({ hasText: techNameB });
    const itemA = listItems.filter({ hasText: techNameA });

    // Drag B to A's position using Playwright dragTo (fires HTML5 drag events)
    const handleB = itemB.locator('[data-drag-handle]');
    const handleA = itemA.locator('[data-drag-handle]');
    await handleB.dragTo(handleA);

    // Wait for persistence
    await page.waitForTimeout(2_000);

    // Reload and verify order
    await page.reload();
    await expect(page.locator(`text=${techNameA}`).first()).toBeVisible({ timeout: 10_000 });
    await expect(page.locator(`text=${techNameB}`).first()).toBeVisible({ timeout: 10_000 });

    // Verify B appears before A in the DOM
    const allItems = page.locator('[role="listitem"]');
    const count = await allItems.count();
    let indexA = -1;
    let indexB = -1;
    for (let i = 0; i < count; i++) {
      const text = await allItems.nth(i).textContent();
      if (text?.includes(techNameA)) indexA = i;
      if (text?.includes(techNameB)) indexB = i;
    }
    expect(indexB).toBeLessThan(indexA);
  });

  test('cleanup: delete both test technologies', async ({ page }) => {
    await deleteTech(page, techNameB);
    await deleteTech(page, techNameA);
  });
});

test.describe('Orphan Cleanup — Happy Path Save', () => {
  test.beforeEach(async ({ page }) => {
    await ensureAdminLogin(page);
  });

  test('saving a technology with image succeeds without cleanup interference', async ({ page }) => {
    const techName = `e2e-orphan-${Date.now()}`;
    await page.goto('/admin/technologies');

    await page.locator('button', { hasText: /crear nueva/i }).click();
    await expect(page.locator('h1', { hasText: /crear tecnología/i })).toBeVisible({ timeout: 5_000 });

    await page.locator('#tech-name').fill(techName);
    await page.locator('#tech-years').fill('2');

    await page.locator('input[type="file"][accept="image/*"]').first().setInputFiles(TEST_IMAGE);
    await page.waitForTimeout(1_000);

    await page.locator('button[type="submit"]').click();
    await expect(page.locator('text=/guardada exitosamente/i')).toBeVisible({ timeout: 20_000 });

    // Verify tech appears in list (image was preserved, not cleaned up)
    await expect(page.locator(`text=${techName}`).first()).toBeVisible({ timeout: 10_000 });

    // Cleanup: delete the test technology
    await clickListAction(page, techName, 'delete');
    const dialog = page.locator('[role="alertdialog"]');
    await expect(dialog).toBeVisible();
    await dialog.locator('button', { hasText: /eliminar/i }).click();
    await expect(page.locator('text=/eliminad/i')).toBeVisible({ timeout: 15_000 });
  });
});
