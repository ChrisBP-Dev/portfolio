import { describe, test, expect } from 'vitest';

/**
 * Calcula relative luminance segun WCAG 2.1
 * https://www.w3.org/TR/WCAG21/#dfn-relative-luminance
 */
function relativeLuminance(hex: string): number {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const linearize = (c: number) =>
    c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;

  return 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b);
}

function contrastRatio(hex1: string, hex2: string): number {
  const l1 = relativeLuminance(hex1);
  const l2 = relativeLuminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

// Colores del design system
const colors = {
  dark: { bg: '#0F1419', surface: '#1A1F2E', textPrimary: '#E8ECF1', textSecondary: '#8B95A5' },
  light: { bg: '#FAFBFC', surface: '#FFFFFF', textPrimary: '#1A1F2E', textSecondary: '#5A6270' },
  brand: { primary: '#48A1CD', primaryDark: '#108385' },
};

describe('WCAG AA Contrast Ratios', () => {
  // text-primary sobre background: UX spec requiere >7:1
  test('dark: text-primary on background > 7:1', () => {
    expect(contrastRatio(colors.dark.textPrimary, colors.dark.bg)).toBeGreaterThan(7);
  });

  test('light: text-primary on background > 7:1', () => {
    expect(contrastRatio(colors.light.textPrimary, colors.light.bg)).toBeGreaterThan(7);
  });

  // text-secondary sobre background: WCAG AA >4.5:1
  test('dark: text-secondary on background > 4.5:1', () => {
    expect(contrastRatio(colors.dark.textSecondary, colors.dark.bg)).toBeGreaterThan(4.5);
  });

  test('light: text-secondary on background > 4.5:1', () => {
    expect(contrastRatio(colors.light.textSecondary, colors.light.bg)).toBeGreaterThan(4.5);
  });

  // primary-dark sobre surface: >3:1 (usado como color de texto/link accesible)
  test('dark: primary-dark on surface > 3:1', () => {
    expect(contrastRatio(colors.brand.primaryDark, colors.dark.surface)).toBeGreaterThan(3);
  });

  test('light: primary-dark on surface > 3:1', () => {
    expect(contrastRatio(colors.brand.primaryDark, colors.light.surface)).toBeGreaterThan(3);
  });
});
