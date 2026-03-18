import { describe, test, expect, beforeEach, vi } from 'vitest';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();

// Mock matchMedia
function createMatchMediaMock(prefersLight: boolean) {
  return (query: string) => ({
    matches: query === '(prefers-color-scheme: light)' ? prefersLight : false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  });
}

/**
 * Simulates the ThemeScript.astro inline logic:
 * 1. Read localStorage('theme')
 * 2. If stored, use it
 * 3. Else check prefers-color-scheme
 * 4. Default is dark
 */
function resolveTheme(storage: typeof localStorageMock, prefersLight: boolean): 'dark' | 'light' {
  const stored = storage.getItem('theme');
  const isLight = stored === 'light' || (!stored && prefersLight);
  return isLight ? 'light' : 'dark';
}

describe('Theme Persistence Logic', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  test('localStorage: setting "dark" → read returns "dark"', () => {
    localStorageMock.setItem('theme', 'dark');
    expect(localStorageMock.getItem('theme')).toBe('dark');
  });

  test('localStorage: setting "light" → read returns "light"', () => {
    localStorageMock.setItem('theme', 'light');
    expect(localStorageMock.getItem('theme')).toBe('light');
  });

  test('no stored value + no OS light preference → default is "dark"', () => {
    const theme = resolveTheme(localStorageMock, false);
    expect(theme).toBe('dark');
  });

  test('no stored value + prefers-color-scheme: light → theme is "light"', () => {
    const theme = resolveTheme(localStorageMock, true);
    expect(theme).toBe('light');
  });

  test('stored value overrides OS preference', () => {
    localStorageMock.setItem('theme', 'dark');
    const theme = resolveTheme(localStorageMock, true);
    expect(theme).toBe('dark');
  });

  test('stored "light" overrides OS dark preference', () => {
    localStorageMock.setItem('theme', 'light');
    const theme = resolveTheme(localStorageMock, false);
    expect(theme).toBe('light');
  });

  test('matchMedia mock returns correct values for light preference', () => {
    const matchMedia = createMatchMediaMock(true);
    expect(matchMedia('(prefers-color-scheme: light)').matches).toBe(true);
    expect(matchMedia('(prefers-color-scheme: dark)').matches).toBe(false);
  });

  test('matchMedia mock returns correct values for dark preference', () => {
    const matchMedia = createMatchMediaMock(false);
    expect(matchMedia('(prefers-color-scheme: light)').matches).toBe(false);
  });
});
