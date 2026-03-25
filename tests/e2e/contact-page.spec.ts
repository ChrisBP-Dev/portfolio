import { test, expect } from '@playwright/test';

/**
 * Helper: wait for the Svelte island to fully hydrate.
 * After Astro hydrates the island, Svelte's event handlers are attached.
 * We verify by filling and clearing a field — fill() waits for actionability
 * and the binding only works after hydration.
 */
async function waitForHydration(page: import('@playwright/test').Page) {
  await page.waitForLoadState('networkidle');
  // Fill a field to confirm Svelte bindings are active
  const nameInput = page.getByLabel(/Nombre|Name/);
  await nameInput.fill('hydration-check');
  await nameInput.fill('');
}

test.describe('Contact Page — EN (default locale)', () => {
  test('page loads with heading, description and form', async ({ page }) => {
    await page.goto('/contact');

    await expect(page.getByRole('heading', { level: 1, name: 'Contact' })).toBeVisible();
    await expect(page.getByText("I'd love to hear from you")).toBeVisible();

    // Form is a hydrated Svelte island
    await expect(page.locator('form')).toBeVisible();
  });

  test('form fields are visible with correct labels', async ({ page }) => {
    await page.goto('/contact');

    await expect(page.getByLabel(/Name/)).toBeVisible();
    await expect(page.getByLabel(/Email/)).toBeVisible();
    await expect(page.getByLabel(/Phone/)).toBeVisible();
    await expect(page.getByLabel(/Message/)).toBeVisible();
    await expect(page.getByLabel(/Contact channel/)).toBeVisible();
    await expect(page.getByRole('button', { name: 'Send Message' })).toBeVisible();
  });

  test('validation shows errors for empty required fields on submit', async ({ page }) => {
    await page.goto('/contact');
    await waitForHydration(page);

    await page.getByRole('button', { name: 'Send Message' }).click();

    await expect(page.getByText('Name is required')).toBeVisible();
    await expect(page.getByText('Email is required')).toBeVisible();
    await expect(page.getByText('Message is required')).toBeVisible();
    await expect(page.locator('#input-channel-error')).toContainText('Select a channel');
  });

  test('validation shows invalid email error on blur', async ({ page }) => {
    await page.goto('/contact');
    await waitForHydration(page);

    const emailInput = page.getByLabel(/Email/);
    await emailInput.fill('not-an-email');
    await emailInput.blur();

    await expect(page.getByText('Invalid email')).toBeVisible();
  });

  test('WhatsApp submission generates correct URL', async ({ page }) => {
    await page.goto('/contact');
    await waitForHydration(page);

    // Intercept window.open before filling the form
    await page.evaluate(() => {
      (window as unknown as Record<string, string>).__capturedOpenUrl = '';
      window.open = (url?: string | URL) => {
        (window as unknown as Record<string, string>).__capturedOpenUrl = String(url ?? '');
        return null;
      };
    });

    await page.getByLabel(/Name/).fill('Juan Perez');
    await page.getByLabel(/Email/).fill('juan@example.com');
    await page.getByLabel(/Phone/).fill('123456789');
    await page.getByLabel(/Message/).fill('I am interested in your portfolio');
    await page.getByLabel(/Contact channel/).selectOption('whatsapp');

    await page.getByRole('button', { name: 'Send Message' }).click();

    const openedUrl = await page.evaluate(
      () => (window as unknown as Record<string, string>).__capturedOpenUrl,
    );
    expect(openedUrl).toContain('wa.me');
    expect(openedUrl).toContain(encodeURIComponent('Juan Perez'));
  });

  test('Email submission passes validation with valid data', async ({ page }) => {
    await page.goto('/contact');
    await waitForHydration(page);

    await page.getByLabel(/Name/).fill('Sarah Chen');
    await page.getByLabel(/Email/).fill('sarah@example.com');
    await page.getByLabel(/Phone/).fill('5551234567');
    await page.getByLabel(/Message/).fill('Let us collaborate on a project');
    await page.getByLabel(/Contact channel/).selectOption('email');

    await page.getByRole('button', { name: 'Send Message' }).click();

    // No validation errors should appear — form submission was successful
    const errorAlerts = page.locator('[role="alert"]');
    await expect(errorAlerts).toHaveCount(0);
  });

  test('country code picker shows options and updates selection', async ({ page }) => {
    await page.goto('/contact');
    await waitForHydration(page);

    const countrySelect = page.getByLabel(/Country code/);
    await expect(countrySelect).toBeVisible();

    // Default should be USA (+1)
    await expect(countrySelect).toHaveValue('+1');

    // Change to Spain
    await countrySelect.selectOption('+34');
    await expect(countrySelect).toHaveValue('+34');
  });

  test('form is responsive on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/contact');

    const form = page.locator('form');
    await expect(form).toBeVisible();

    const submitButton = page.getByRole('button', { name: 'Send Message' });
    await expect(submitButton).toBeVisible();
  });
});

test.describe('Contact Page — ES', () => {
  test('page loads with Spanish translations', async ({ page }) => {
    await page.goto('/es/contact');

    await expect(page.getByRole('heading', { level: 1, name: 'Contacto' })).toBeVisible();
    await expect(page.getByText('Elige tu canal preferido')).toBeVisible();
  });

  test('form labels are in Spanish', async ({ page }) => {
    await page.goto('/es/contact');

    await expect(page.getByLabel(/Nombre/)).toBeVisible();
    await expect(page.getByLabel(/Email/)).toBeVisible();
    await expect(page.getByLabel(/Teléfono/)).toBeVisible();
    await expect(page.getByLabel(/Mensaje/)).toBeVisible();
    await expect(page.getByLabel(/Canal de contacto/)).toBeVisible();
    await expect(page.getByRole('button', { name: 'Enviar Mensaje' })).toBeVisible();
  });

  test('validation messages are in Spanish', async ({ page }) => {
    await page.goto('/es/contact');

    // Wait for hydration
    await page.waitForLoadState('networkidle');
    const nameInput = page.getByLabel(/Nombre/);
    await nameInput.fill('hydration-check');
    await nameInput.fill('');

    await page.getByRole('button', { name: 'Enviar Mensaje' }).click();

    await expect(page.getByText('Nombre es obligatorio')).toBeVisible();
    await expect(page.getByText('Email es obligatorio')).toBeVisible();
    await expect(page.getByText('Mensaje es obligatorio')).toBeVisible();
  });
});

test.describe('Contact Page — EN: OG and Twitter meta tags', () => {
  test('og:image uses default OG image', async ({ page }) => {
    await page.goto('/contact');
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /\/images\/og-default\.png$/);
  });

  test('og:url is an absolute URL', async ({ page }) => {
    await page.goto('/contact');
    // Absolute URL check — built HTML uses https://portfolio-chrisbp.web.app; ClientRouter rewrites to browser URL in preview
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', /^https?:\/\//);
  });

  test('has unique meta description', async ({ page }) => {
    await page.goto('/contact');
    const desc = await page.locator('meta[name="description"]').getAttribute('content');
    expect(desc).toBeTruthy();
    expect(desc!.length).toBeGreaterThan(10);
  });

  test('twitter:card is summary_large_image', async ({ page }) => {
    await page.goto('/contact');
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image');
  });

  test('twitter:image uses default OG image', async ({ page }) => {
    await page.goto('/contact');
    await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute('content', /\/images\/og-default\.png$/);
  });
});

test.describe('Contact Page — ES: OG and Twitter meta tags', () => {
  test('og:image uses default OG image in ES', async ({ page }) => {
    await page.goto('/es/contact');
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /\/images\/og-default\.png$/);
  });

  test('twitter:card is summary_large_image in ES', async ({ page }) => {
    await page.goto('/es/contact');
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image');
  });
});

test.describe('Contact Page — Footer Social Links', () => {
  test('footer has TikTok, GitHub, and LinkedIn links opening in new tab', async ({ page }) => {
    await page.goto('/contact');

    const footer = page.locator('footer');

    const tiktok = footer.getByLabel(/TikTok/);
    await expect(tiktok).toBeVisible();
    await expect(tiktok).toHaveAttribute('target', '_blank');
    await expect(tiktok).toHaveAttribute('rel', 'noopener noreferrer');

    const github = footer.getByLabel(/GitHub/);
    await expect(github).toBeVisible();
    await expect(github).toHaveAttribute('target', '_blank');
    await expect(github).toHaveAttribute('rel', 'noopener noreferrer');

    const linkedin = footer.getByLabel(/LinkedIn/);
    await expect(linkedin).toBeVisible();
    await expect(linkedin).toHaveAttribute('target', '_blank');
    await expect(linkedin).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
