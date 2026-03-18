import { describe, expect, it } from 'vitest';
import { navItems, localizeHref } from '../navigation';

describe('navigation', () => {
  describe('navItems', () => {
    it('has 5 navigation items', () => {
      expect(navItems).toHaveLength(5);
    });

    it('each item has bilingual labels', () => {
      for (const item of navItems) {
        expect(item.label.es).toBeTruthy();
        expect(item.label.en).toBeTruthy();
      }
    });
  });

  describe('localizeHref', () => {
    it('returns unchanged href for "es" locale', () => {
      expect(localizeHref('/', 'es')).toBe('/');
      expect(localizeHref('/projects', 'es')).toBe('/projects');
    });

    it('prefixes /en for "en" locale', () => {
      expect(localizeHref('/projects', 'en')).toBe('/en/projects');
    });

    it('handles root / correctly for "en" locale', () => {
      expect(localizeHref('/', 'en')).toBe('/en/');
    });

    it('handles nested paths for "en" locale', () => {
      expect(localizeHref('/experience', 'en')).toBe('/en/experience');
      expect(localizeHref('/blog', 'en')).toBe('/en/blog');
    });
  });
});
