import type { Page, Locator } from '@playwright/test';

/**
 * Ensure the page is authenticated as admin. If already on an admin page
 * and authenticated, this is a no-op. Otherwise, performs UI login.
 */
export async function ensureAdminLogin(page: Page): Promise<void> {
  const email = process.env.E2E_ADMIN_EMAIL;
  const password = process.env.E2E_ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error('E2E_ADMIN_EMAIL and E2E_ADMIN_PASSWORD must be set in .env');
  }

  await page.goto('/admin');

  // Give AuthGuard time to check auth state and potentially redirect
  try {
    await page.waitForURL(/\/admin\/login/, { timeout: 5_000 });
  } catch {
    // Didn't redirect to login — already authenticated
    return;
  }

  // Login via UI
  await page.locator('#login-email').fill(email);
  await page.locator('#login-password').fill(password);
  await page.locator('button[type="submit"]').click();
  await page.waitForURL(/\/admin(?!\/login)/, { timeout: 30_000 });
}

/**
 * Fill the first visible element matching a locator. Needed because
 * BilingualField renders duplicate inputs (mobile hidden + desktop visible).
 */
export async function fillVisible(locator: Locator, value: string): Promise<void> {
  const count = await locator.count();
  for (let i = 0; i < count; i++) {
    if (await locator.nth(i).isVisible()) {
      await locator.nth(i).fill(value);
      return;
    }
  }
  await locator.first().fill(value);
}

/**
 * Clear and fill the first visible element matching a locator.
 */
export async function clearAndFillVisible(locator: Locator, value: string): Promise<void> {
  const count = await locator.count();
  for (let i = 0; i < count; i++) {
    if (await locator.nth(i).isVisible()) {
      await locator.nth(i).clear();
      await locator.nth(i).fill(value);
      return;
    }
  }
  await locator.first().clear();
  await locator.first().fill(value);
}

/**
 * Find a list item card that contains the given text, then click
 * the edit or delete button inside it. List items use a specific
 * card pattern: div.rounded-lg.border.border-border containing
 * div.flex.gap-2 with action buttons.
 */
export async function clickListAction(
  page: Page,
  itemText: string,
  action: 'edit' | 'delete',
): Promise<void> {
  const pattern = action === 'edit' ? /editar/i : /eliminar|borrar/i;
  // Find the h3 containing the item text, then go up to the card wrapper
  const card = page.locator('.rounded-lg.border-border', { hasText: itemText }).first();
  await card.locator('.flex.gap-2 button', { hasText: pattern }).click();
}
