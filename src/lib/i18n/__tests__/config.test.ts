import { describe, expect, it } from 'vitest';
import { getLocaleFromUrl, defaultLocale, locales } from '../config';

describe('i18n config', () => {
  describe('constants', () => {
    it('defaultLocale is "es"', () => {
      expect(defaultLocale).toBe('es');
    });

    it('locales contains es and en', () => {
      expect(locales).toEqual(['es', 'en']);
    });
  });

  describe('getLocaleFromUrl', () => {
    it('returns "es" for root path /', () => {
      expect(getLocaleFromUrl(new URL('https://example.com/'))).toBe('es');
    });

    it('returns "en" for /en/', () => {
      expect(getLocaleFromUrl(new URL('https://example.com/en/'))).toBe('en');
    });

    it('returns "es" for /projects (no locale prefix)', () => {
      expect(getLocaleFromUrl(new URL('https://example.com/projects'))).toBe('es');
    });

    it('returns "en" for /en/projects', () => {
      expect(getLocaleFromUrl(new URL('https://example.com/en/projects'))).toBe('en');
    });

    it('returns "es" for unknown locale prefix like /fr/', () => {
      expect(getLocaleFromUrl(new URL('https://example.com/fr/'))).toBe('es');
    });

    it('returns "es" for /en without trailing slash (en is a valid segment)', () => {
      expect(getLocaleFromUrl(new URL('https://example.com/en'))).toBe('en');
    });
  });
});
