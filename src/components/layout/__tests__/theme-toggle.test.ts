import { describe, test, expect } from 'vitest';

describe('ThemeToggle Component', () => {
  test('ThemeToggle module exists and is importable', async () => {
    const mod = await import('../ThemeToggle.svelte');
    expect(mod).toBeDefined();
  });

  test('ThemeToggle has a default export', async () => {
    const mod = await import('../ThemeToggle.svelte');
    expect(mod.default).toBeDefined();
  });

  test('ThemeScript module exists and is importable', async () => {
    const mod = await import('../ThemeScript.astro');
    expect(mod).toBeDefined();
  });
});
