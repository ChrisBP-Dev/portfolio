import { describe, expect, it } from 'vitest';
import { getLocaleFromUrl, defaultLocale, locales } from '../config';

describe('i18n config', () => {
  describe('constants', () => {
    it('defaultLocale is "en"', () => {
      expect(defaultLocale).toBe('en');
    });

    it('locales contains es and en', () => {
      expect(locales).toEqual(['es', 'en']);
    });
  });

  describe('getLocaleFromUrl', () => {
    it('returns "en" for root path /', () => {
      expect(getLocaleFromUrl(new URL('https://example.com/'))).toBe('en');
    });

    it('returns "es" for /es/', () => {
      expect(getLocaleFromUrl(new URL('https://example.com/es/'))).toBe('es');
    });

    it('returns "en" for /projects (no locale prefix)', () => {
      expect(getLocaleFromUrl(new URL('https://example.com/projects'))).toBe('en');
    });

    it('returns "es" for /es/projects', () => {
      expect(getLocaleFromUrl(new URL('https://example.com/es/projects'))).toBe('es');
    });

    it('returns "en" for unknown locale prefix like /fr/', () => {
      expect(getLocaleFromUrl(new URL('https://example.com/fr/'))).toBe('en');
    });

    it('returns "es" for /es without trailing slash', () => {
      expect(getLocaleFromUrl(new URL('https://example.com/es'))).toBe('es');
    });
  });
});
