import { describe, expect, it } from 'vitest';
import { navItems, localizeHref } from '../navigation';

describe('navigation', () => {
  describe('navItems', () => {
    it('has 4 navigation items', () => {
      expect(navItems).toHaveLength(4);
    });

    it('each item has bilingual labels', () => {
      for (const item of navItems) {
        expect(item.label.es).toBeTruthy();
        expect(item.label.en).toBeTruthy();
      }
    });
  });

  describe('localizeHref', () => {
    it('returns unchanged href for "en" locale (default)', () => {
      expect(localizeHref('/', 'en')).toBe('/');
      expect(localizeHref('/projects', 'en')).toBe('/projects');
    });

    it('prefixes /es for "es" locale', () => {
      expect(localizeHref('/projects', 'es')).toBe('/es/projects');
    });

    it('handles root / correctly for "es" locale', () => {
      expect(localizeHref('/', 'es')).toBe('/es/');
    });

    it('handles nested paths for "es" locale', () => {
      expect(localizeHref('/blog', 'es')).toBe('/es/blog');
      expect(localizeHref('/contact', 'es')).toBe('/es/contact');
    });
  });
});
