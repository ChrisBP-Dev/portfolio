import { describe, test, expect } from 'vitest';

describe('Layout Component Props Types', () => {
  test('Banner module exists and is importable', async () => {
    const mod = await import('../Banner.astro');
    expect(mod).toBeDefined();
  });

  test('Header module exists and is importable', async () => {
    const mod = await import('../Header.astro');
    expect(mod).toBeDefined();
  });

  test('Footer module exists and is importable', async () => {
    const mod = await import('../Footer.astro');
    expect(mod).toBeDefined();
  });

  test('MobileMenu module exists and is importable', async () => {
    const mod = await import('../MobileMenu.svelte');
    expect(mod).toBeDefined();
  });

  test('SkipNav module exists and is importable', async () => {
    const mod = await import('../../common/SkipNav.astro');
    expect(mod).toBeDefined();
  });
});
