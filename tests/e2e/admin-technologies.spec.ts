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
