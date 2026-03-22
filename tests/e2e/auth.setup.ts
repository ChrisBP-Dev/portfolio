import { test as setup, expect } from '@playwright/test';
import path from 'node:path';

const authFile = path.join(process.cwd(), '.auth', 'admin.json');

setup('authenticate as admin', async ({ page }) => {
  const email = process.env.E2E_ADMIN_EMAIL;
  const password = process.env.E2E_ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error('E2E_ADMIN_EMAIL and E2E_ADMIN_PASSWORD must be set in .env');
  }

  await page.goto('/admin/login');

  // Wait for Svelte hydration (client:only component)
  const emailInput = page.locator('#login-email');
  await expect(emailInput).toBeVisible({ timeout: 10_000 });

  // Fill login form
  await emailInput.fill(email);
  await page.locator('#login-password').fill(password);

  // Submit
  await page.locator('button[type="submit"]').click();

  // Wait for redirect to /admin dashboard (uses window.location.href)
  await page.waitForURL(/\/admin(?!\/login)/, { timeout: 30_000 });

  // Verify dashboard loaded (at least one card visible)
  await expect(page.locator('a[href="/admin/projects"]').first()).toBeVisible({ timeout: 10_000 });

  // Save auth state
  await page.context().storageState({ path: authFile });
});
