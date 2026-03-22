import { test, expect } from '@playwright/test';
import { ensureAdminLogin, fillVisible, clickListAction } from './admin-helpers';

test.describe('Admin Experiences CRUD', () => {
  test.beforeEach(async ({ page }) => {
    await ensureAdminLogin(page);
  });

  // E-009: Create experience with dates and bilingual fields, verify in list, cleanup
  test('E-009: create experience with bilingual fields and dates', async ({ page }) => {
    const companyName = `e2e-exp-${Date.now()}`;
    await page.goto('/admin/experiences');

    await page.locator('button', { hasText: /crear nueva/i }).click();
    await expect(page.locator('h1', { hasText: /crear experiencia/i })).toBeVisible({ timeout: 5_000 });

    // Fill company name
    await page.locator('#exp-companyName').fill(companyName);

    // Fill bilingual job name using stable IDs
    await fillVisible(page.locator('#exp-jobName-es'), 'Desarrollador E2E');
    await fillVisible(page.locator('#exp-jobName-en'), 'E2E Developer');

    // Fill responsibilities — on desktop, both ES and EN columns are visible side by side
    // Find the visible input in the ES column (first visible input in the fieldset)
    const respFieldset = page.locator('fieldset', { hasText: /responsabilidades/i });
    // Desktop layout: .lg:grid has two columns. First column = ES, second = EN
    const desktopGrid = respFieldset.locator('.lg\\:grid');
    const columns = desktopGrid.locator('> div');
    // ES responsibility (first column, first input)
    await columns.nth(0).locator('input[type="text"]').first().fill('Escribir tests');
    // EN responsibility (second column, first input)
    await columns.nth(1).locator('input[type="text"]').first().fill('Write tests');

    // Fill start date
    await page.locator('#exp-startDate').fill('2024-01-15');

    // Check "currently working"
    await page.locator('#exp-currentlyWorking').check();

    // Submit
    await page.locator('button[type="submit"]').click();
    await expect(page.locator('text=/guardada exitosamente/i')).toBeVisible({ timeout: 20_000 });

    // Verify in list
    await expect(page.locator(`text=${companyName}`).first()).toBeVisible({ timeout: 10_000 });

    // Cleanup: delete
    await clickListAction(page, companyName, 'delete');
    const dialog = page.locator('[role="alertdialog"]');
    await expect(dialog).toBeVisible();
    await dialog.locator('button', { hasText: /eliminar/i }).click();
    await expect(page.locator('text=/eliminad/i')).toBeVisible({ timeout: 15_000 });
  });
});
