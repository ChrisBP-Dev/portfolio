import { describe, expect, it } from 'vitest';
import { t } from '../translations';
import translations from '../translations';
import { locales } from '../config';

describe('translations', () => {
  describe('t() helper', () => {
    it('returns Spanish string for es locale', () => {
      expect(t('nav.home', 'es')).toBe('Inicio');
    });

    it('returns English string for en locale', () => {
      expect(t('nav.home', 'en')).toBe('Home');
    });

    it('returns the key itself for unknown key', () => {
      expect(t('nonexistent.key', 'es')).toBe('nonexistent.key');
    });
  });

  describe('all keys have both locales', () => {
    const keys = Object.keys(translations);

    it('has at least one translation key', () => {
      expect(keys.length).toBeGreaterThan(0);
    });

    for (const key of Object.keys(translations)) {
      for (const locale of locales) {
        it(`key "${key}" has a non-empty "${locale}" translation`, () => {
          expect(translations[key]?.[locale]).toBeTruthy();
        });
      }
    }
  });

  describe('specific translations', () => {
    it('banner.welcome has correct values', () => {
      expect(t('banner.welcome', 'es')).toBe('Bienvenido a mi Portfolio');
      expect(t('banner.welcome', 'en')).toBe('Welcome to my Portfolio');
    });

    it('locale.switch has correct aria labels', () => {
      expect(t('locale.switch', 'es')).toBe('Cambiar a inglés');
      expect(t('locale.switch', 'en')).toBe('Switch to Spanish');
    });

    it('skipnav.label has correct values', () => {
      expect(t('skipnav.label', 'es')).toBe('Saltar al contenido');
      expect(t('skipnav.label', 'en')).toBe('Skip to content');
    });

    it('theme.toLight has correct values', () => {
      expect(t('theme.toLight', 'es')).toBe('Cambiar a modo claro');
      expect(t('theme.toLight', 'en')).toBe('Switch to light mode');
    });

    it('theme.toDark has correct values', () => {
      expect(t('theme.toDark', 'es')).toBe('Cambiar a modo oscuro');
      expect(t('theme.toDark', 'en')).toBe('Switch to dark mode');
    });
  });
});
