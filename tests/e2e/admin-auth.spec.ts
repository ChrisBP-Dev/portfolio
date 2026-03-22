import { test, expect } from '@playwright/test';
import { ensureAdminLogin } from './admin-helpers';

test.describe('Admin Auth & Navigation', () => {
  // E-004: Login → dashboard → verify 4 sections navigable
  test('E-004: dashboard shows 4 navigable sections after login', async ({ page }) => {
    await ensureAdminLogin(page);

    // Verify all 4 section links are visible
    const sectionHrefs = ['/admin/projects', '/admin/technologies', '/admin/experiences', '/admin/blog'];
    for (const href of sectionHrefs) {
      await expect(page.locator(`a[href="${href}"]`).first()).toBeVisible({ timeout: 10_000 });
    }

    // Navigate to each section and verify it loads
    for (const href of sectionHrefs) {
      await page.locator(`a[href="${href}"]`).first().click();
      await expect(page).toHaveURL(href, { timeout: 10_000 });
      await page.goto('/admin');
      await page.waitForLoadState('domcontentloaded');
    }
  });

  // E-014: Route protection — unauthenticated access redirects to login
  test('E-014: unauthenticated access to /admin/projects redirects to login', async ({ browser }) => {
    // Fresh context — no auth state
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto('http://localhost:4321/admin/projects');

    // AuthGuard should redirect to /admin/login
    await expect(page).toHaveURL(/\/admin\/login/, { timeout: 15_000 });
    await expect(page.locator('#login-email')).toBeVisible();

    await context.close();
  });

  // E-010: Logout redirects to login
  test('E-010: logout button redirects to login page', async ({ page }) => {
    await ensureAdminLogin(page);

    // Ensure wide viewport so sidebar text is visible
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.waitForTimeout(500);

    // Click logout button
    const logoutButton = page.locator('button', { hasText: /cerrar sesión/i }).first();
    await logoutButton.click();

    // Should redirect to login
    await expect(page).toHaveURL(/\/admin\/login/, { timeout: 10_000 });
    await expect(page.locator('#login-email')).toBeVisible();
  });
});
