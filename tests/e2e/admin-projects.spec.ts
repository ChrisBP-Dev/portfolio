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

test.describe('Admin Projects — Featured & Ordering', () => {
  test.describe.configure({ mode: 'serial' });

  const projectNames: string[] = [];

  test.beforeEach(async ({ page }) => {
    await ensureAdminLogin(page);
  });

  // Helper: create a project and track its name
  async function createTestProject(page: import('@playwright/test').Page, suffix: string): Promise<string> {
    const name = `e2e-feat-${Date.now()}-${suffix}`;
    await page.goto('/admin/projects');
    await page.locator('button', { hasText: /crear nuevo/i }).click();
    await expect(page.locator('h1', { hasText: /crear proyecto/i })).toBeVisible({ timeout: 5_000 });

    await fillVisible(page.locator('#project-companyName-es'), name);
    await fillVisible(page.locator('#project-companyName-en'), `${name}-en`);
    await fillVisible(page.locator('#project-shortDescription-es'), 'Test desc ES');
    await fillVisible(page.locator('#project-shortDescription-en'), 'Test desc EN');

    await page.locator('input[type="file"][accept="image/*"]').first().setInputFiles(TEST_IMAGE);
    await page.waitForTimeout(1_000);

    await page.locator('button[type="submit"]').click();
    await expect(page.locator('text=/guardado exitosamente/i')).toBeVisible({ timeout: 20_000 });
    await page.waitForTimeout(2_000);

    return name;
  }

  // Setup: create 4 test projects for featured/ordering tests
  test('setup: create 4 projects for featured & ordering tests', async ({ page }) => {
    for (let i = 0; i < 4; i++) {
      const name = await createTestProject(page, String(i));
      projectNames.push(name);
    }
    expect(projectNames).toHaveLength(4);
  });

  // E-050: Featured star toggle works
  test('E-050: featured star toggle activates featured state', async ({ page }) => {
    test.skip(projectNames.length < 4, 'Depends on setup');
    await page.goto('/admin/projects');

    // Find the first project card and click its featured star
    const card = page.locator('.rounded-lg.border-border', { hasText: projectNames[0]! }).first();
    await expect(card).toBeVisible({ timeout: 10_000 });

    const starButton = card.locator('button[data-testid^="featured-toggle-"]');
    await starButton.click();

    // After clicking, the star should have the filled star (text-yellow-500 class)
    await expect(starButton).toHaveClass(/text-yellow-500/, { timeout: 5_000 });
  });

  // E-051: Drag reorder works
  test('E-051: drag reorder changes project position', async ({ page }) => {
    test.skip(projectNames.length < 4, 'Depends on setup');
    await page.goto('/admin/projects');

    // Wait for projects to load
    const firstCard = page.locator('.rounded-lg.border-border', { hasText: projectNames[0]! }).first();
    await expect(firstCard).toBeVisible({ timeout: 10_000 });

    const secondCard = page.locator('.rounded-lg.border-border', { hasText: projectNames[1]! }).first();
    await expect(secondCard).toBeVisible({ timeout: 10_000 });

    // Use Playwright dragTo to drag second project to first position
    const secondHandle = secondCard.locator('button[aria-label]').first();
    const firstHandle = firstCard.locator('button[aria-label]').first();
    await secondHandle.dragTo(firstHandle);

    // Wait for batch update to complete
    await page.waitForTimeout(2_000);

    // Reload and verify persisted order
    await page.goto('/admin/projects');
    await expect(page.locator('[role="listitem"]').first()).toBeVisible({ timeout: 10_000 });

    const cards = page.locator('[role="listitem"]');
    const allTexts = await cards.allTextContents();
    const idxFirst = allTexts.findIndex((t) => t.includes(projectNames[1]!));
    const idxSecond = allTexts.findIndex((t) => t.includes(projectNames[0]!));
    expect(idxFirst).toBeGreaterThanOrEqual(0);
    expect(idxSecond).toBeGreaterThanOrEqual(0);
    expect(idxFirst).toBeLessThan(idxSecond);
  });

  // E-052: Max 3 featured enforcement
  test('E-052: max 3 featured enforcement shows warning toast', async ({ page }) => {
    test.skip(projectNames.length < 4, 'Depends on setup');
    await page.goto('/admin/projects');

    // Feature first 3 projects (first may already be featured from E-050)
    for (let i = 0; i < 3; i++) {
      const card = page.locator('.rounded-lg.border-border', { hasText: projectNames[i]! }).first();
      await expect(card).toBeVisible({ timeout: 10_000 });

      const starButton = card.locator('button[data-testid^="featured-toggle-"]');
      // Only click if not already featured (check if it has yellow class)
      const isAlreadyFeatured = await starButton.evaluate(
        (el) => el.classList.contains('text-yellow-500'),
      );
      if (!isAlreadyFeatured) {
        await starButton.click();
        await page.waitForTimeout(500);
      }
    }

    // Try to feature the 4th project — should show warning
    const fourthCard = page.locator('.rounded-lg.border-border', { hasText: projectNames[3]! }).first();
    await expect(fourthCard).toBeVisible({ timeout: 10_000 });

    const fourthStar = fourthCard.locator('button[data-testid^="featured-toggle-"]');
    await fourthStar.click();

    // Verify warning toast appears
    await expect(page.locator('text=/máximo 3 proyectos destacados/i')).toBeVisible({ timeout: 5_000 });
  });

  // Cleanup: delete test projects
  test('cleanup: delete featured & ordering test projects', async ({ page }) => {
    test.skip(projectNames.length < 4, 'Depends on setup');
    await page.goto('/admin/projects');

    for (const name of projectNames) {
      try {
        const card = page.locator('.rounded-lg.border-border', { hasText: name }).first();
        const isVisible = await card.isVisible().catch(() => false);
        if (!isVisible) continue;

        await clickListAction(page, name, 'delete');
        const dialog = page.locator('[role="alertdialog"]');
        await expect(dialog).toBeVisible({ timeout: 5_000 });
        await dialog.locator('button', { hasText: /eliminar/i }).click();
        await expect(page.locator('text=/eliminado/i')).toBeVisible({ timeout: 15_000 });
        await page.waitForTimeout(1_000);
      } catch {
        // Best effort cleanup — skip if project already deleted
      }
    }
  });
});
