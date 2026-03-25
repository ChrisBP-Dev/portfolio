import { test, expect } from './fixtures/axe-test';

// Helper: attach violations to Playwright report for debugging
async function attachViolations(
  testInfo: Parameters<Parameters<typeof test>[2]>[1],
  violations: unknown[]
) {
  if (violations.length > 0) {
    await testInfo.attach('a11y-violations', {
      body: JSON.stringify(violations, null, 2),
      contentType: 'application/json',
    });
  }
}

// ============================================================
// Task 4: axe-core WCAG 2.1 AA scan — all public pages
// ============================================================
test.describe('Accessibility — axe-core WCAG 2.1 AA', () => {
  test('Home page has no critical or serious violations', async ({
    page,
    makeAxeBuilder,
  }, testInfo) => {
    await page.goto('/');
    const results = await makeAxeBuilder().analyze();
    const criticalOrSerious = results.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious'
    );
    await attachViolations(testInfo, criticalOrSerious);
    expect(criticalOrSerious).toEqual([]);
  });

  test('Projects listing has no critical or serious violations', async ({
    page,
    makeAxeBuilder,
  }, testInfo) => {
    await page.goto('/projects');
    // Wait for Svelte island hydration
    await page.locator('#tech-filter').waitFor();
    const results = await makeAxeBuilder().analyze();
    const criticalOrSerious = results.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious'
    );
    await attachViolations(testInfo, criticalOrSerious);
    expect(criticalOrSerious).toEqual([]);
  });

  test('Blog listing has no critical or serious violations', async ({
    page,
    makeAxeBuilder,
  }, testInfo) => {
    await page.goto('/blog');
    const results = await makeAxeBuilder().analyze();
    const criticalOrSerious = results.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious'
    );
    await attachViolations(testInfo, criticalOrSerious);
    expect(criticalOrSerious).toEqual([]);
  });

  test('Contact page has no critical or serious violations', async ({
    page,
    makeAxeBuilder,
  }, testInfo) => {
    await page.goto('/contact');
    const results = await makeAxeBuilder().analyze();
    const criticalOrSerious = results.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious'
    );
    await attachViolations(testInfo, criticalOrSerious);
    expect(criticalOrSerious).toEqual([]);
  });

  test('Project detail page has no critical or serious violations', async ({
    page,
    makeAxeBuilder,
  }, testInfo) => {
    await page.goto('/projects');
    const firstProject = page.locator('main a[href^="/projects/"]').first();
    const hasProjects = (await firstProject.count()) > 0;
    test.skip(!hasProjects, 'No published projects available');
    await firstProject.click();
    await page.waitForURL(/\/projects\/[a-z0-9-]+$/);
    const results = await makeAxeBuilder().analyze();
    const criticalOrSerious = results.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious'
    );
    await attachViolations(testInfo, criticalOrSerious);
    expect(criticalOrSerious).toEqual([]);
  });

  test('Blog article page has no critical or serious violations', async ({
    page,
    makeAxeBuilder,
  }, testInfo) => {
    await page.goto('/blog');
    const firstArticle = page.locator('main a[href^="/blog/"]').first();
    const hasArticles = (await firstArticle.count()) > 0;
    test.skip(!hasArticles, 'No published articles available');
    await firstArticle.click();
    await page.waitForURL(/\/blog\/[a-z0-9-]+$/);
    const results = await makeAxeBuilder().analyze();
    const criticalOrSerious = results.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious'
    );
    await attachViolations(testInfo, criticalOrSerious);
    expect(criticalOrSerious).toEqual([]);
  });
});

// ============================================================
// Task 5: Keyboard navigation, skip nav, focus indicators
// ============================================================
test.describe('Keyboard Navigation & Focus', () => {
  test('skip nav is first focusable and navigates to main', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    const focused = page.locator(':focus');
    await expect(focused).toHaveAttribute('href', '#main');
    await page.keyboard.press('Enter');
    const main = page.locator('#main');
    await expect(main).toBeFocused();
  });

  test('interactive elements have visible focus indicators', async ({ page }) => {
    await page.goto('/');
    // Tab past skip nav to first interactive element
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    const focused = page.locator(':focus');
    const outlineStyle = await focused.evaluate(
      (el) => getComputedStyle(el).outlineStyle
    );
    expect(outlineStyle).not.toBe('none');
  });

  test('Escape closes mobile menu and restores focus', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    const hamburger = page.locator('button[aria-expanded]');
    // Use click() which waits for Svelte hydration (onclick handler attached)
    await hamburger.click();
    await expect(hamburger).toHaveAttribute('aria-expanded', 'true');
    await page.keyboard.press('Escape');
    await expect(hamburger).toHaveAttribute('aria-expanded', 'false');
    await expect(hamburger).toBeFocused();
  });
});
