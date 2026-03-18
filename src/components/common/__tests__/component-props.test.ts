import { describe, test, expect } from 'vitest';

describe('Component Props Types', () => {
  test('Container module exists and is importable', async () => {
    const mod = await import('../Container.astro');
    expect(mod).toBeDefined();
  });

  test('Section module exists and is importable', async () => {
    const mod = await import('../Section.astro');
    expect(mod).toBeDefined();
  });

  test('Button module exists and is importable', async () => {
    const mod = await import('../Button.astro');
    expect(mod).toBeDefined();
  });

  test('Card module exists and is importable', async () => {
    const mod = await import('../Card.astro');
    expect(mod).toBeDefined();
  });

  test('Badge module exists and is importable', async () => {
    const mod = await import('../Badge.astro');
    expect(mod).toBeDefined();
  });

  test('Input module exists and is importable', async () => {
    const mod = await import('../Input.astro');
    expect(mod).toBeDefined();
  });
});
