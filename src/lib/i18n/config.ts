export type { Locale } from '../schemas/shared-schemas';
export { localeSchema } from '../schemas/shared-schemas';
import type { Locale } from '../schemas/shared-schemas';

export const defaultLocale: Locale = 'es';
export const locales: Locale[] = ['es', 'en'];

/** Extract locale from URL path. Returns defaultLocale if no locale prefix found. */
export function getLocaleFromUrl(url: URL): Locale {
  const [, lang] = url.pathname.split('/');
  if (lang && (locales as string[]).includes(lang)) return lang as Locale;
  return defaultLocale;
}
