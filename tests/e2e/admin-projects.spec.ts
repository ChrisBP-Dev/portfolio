import { test, expect } from '@playwright/test';
import { ensureAdminLogin, fillVisible, clearAndFillVisible, clickListAction } from './admin-helpers';
import path from 'node:path';

const TEST_IMAGE = path.join(process.cwd(), 'tests', 'e2e', 'fixtures', 'test-image.png');
const UNIQUE = () => `e2e-test-${Date.now()}`;

test.describe('Admin Projects CRUD', () => {
  test.describe.configure({ mode: 'serial' });

  let projectName: string;

  test.beforeEach(async ({ page }) => {
    await ensureAdminLogin(page);
  });

  // E-005: Create project with image and bilingual fields
  test('E-005: create project with image and bilingual fields', async ({ page }) => {
    projectName = UNIQUE();
    await page.goto('/admin/projects');

    await page.locator('button', { hasText: /crear nuevo/i }).click();
    await expect(page.locator('h1', { hasText: /crear proyecto/i })).toBeVisible({ timeout: 5_000 });

    // Fill bilingual fields using stable IDs
    await fillVisible(page.locator('#project-companyName-es'), projectName);
    await fillVisible(page.locator('#project-companyName-en'), `${projectName}-en`);
    await fillVisible(page.locator('#project-shortDescription-es'), 'Test description ES');
    await fillVisible(page.locator('#project-shortDescription-en'), 'Test description EN');

    // Upload main image
    await page.locator('input[type="file"][accept="image/*"]').first().setInputFiles(TEST_IMAGE);
    await page.waitForTimeout(1_000);

    // Submit
    await page.locator('button[type="submit"]').click();
    await expect(page.locator('text=/guardado exitosamente/i')).toBeVisible({ timeout: 20_000 });
    await page.waitForTimeout(2_000);

    await expect(page.locator(`text=${projectName}`).first()).toBeVisible({ timeout: 10_000 });
  });

  // E-006: Edit project
  test('E-006: edit existing project field and verify change', async ({ page }) => {
    test.skip(!projectName, 'Depends on E-005');
    await page.goto('/admin/projects');
    await expect(page.locator(`text=${projectName}`).first()).toBeVisible({ timeout: 10_000 });

    await clickListAction(page, projectName, 'edit');
    await expect(page.locator('h1', { hasText: /editar proyecto/i })).toBeVisible({ timeout: 5_000 });

    await clearAndFillVisible(page.locator('#project-companyName-es'), `${projectName}-edited`);

    await page.locator('button[type="submit"]').click();
    await expect(page.locator('text=/guardado/i')).toBeVisible({ timeout: 20_000 });
    await page.waitForTimeout(2_000);

    await expect(page.locator(`text=${projectName}-edited`).first()).toBeVisible({ timeout: 10_000 });
    projectName = `${projectName}-edited`;
  });

  // E-017: Image replace
  test('E-017: replace project main image on edit', async ({ page }) => {
    test.skip(!projectName, 'Depends on E-005/E-006');
    await page.goto('/admin/projects');
    await expect(page.locator(`text=${projectName}`).first()).toBeVisible({ timeout: 10_000 });

    await clickListAction(page, projectName, 'edit');
    await expect(page.locator('h1', { hasText: /editar proyecto/i })).toBeVisible({ timeout: 5_000 });

    // Upload replacement image
    await page.locator('input[type="file"][accept="image/*"]').first().setInputFiles(TEST_IMAGE);
    await page.waitForTimeout(1_000);

    await page.locator('button[type="submit"]').click();
    await expect(page.locator('text=/guardado/i')).toBeVisible({ timeout: 20_000 });
  });

  // E-007: Delete project
  test('E-007: delete project and verify removed from list', async ({ page }) => {
    test.skip(!projectName, 'Depends on E-005/E-006');
    await page.goto('/admin/projects');
    await expect(page.locator(`text=${projectName}`).first()).toBeVisible({ timeout: 10_000 });

    await clickListAction(page, projectName, 'delete');

    const dialog = page.locator('[role="alertdialog"]');
    await expect(dialog).toBeVisible();
    await dialog.locator('button', { hasText: /eliminar/i }).click();

    await expect(page.locator('text=/eliminado/i')).toBeVisible({ timeout: 15_000 });
    await expect(page.locator(`text=${projectName}`)).toBeHidden({ timeout: 5_000 });
  });
});
