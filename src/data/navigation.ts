import type { Locale } from '../lib/i18n/config';

export const navItems = [
  { key: 'home', href: '/', label: { es: 'Inicio', en: 'Home' } },
  { key: 'projects', href: '/projects', label: { es: 'Proyectos', en: 'Projects' } },
  { key: 'experience', href: '/experience', label: { es: 'Experiencia', en: 'Experience' } },
  { key: 'blog', href: '/blog', label: { es: 'Blog', en: 'Blog' } },
  { key: 'contact', href: '/contact', label: { es: 'Contacto', en: 'Contact' } },
] as const;

export type NavKey = (typeof navItems)[number]['key'];

/** Prefix href with /en for English locale */
export function localizeHref(href: string, locale: Locale): string {
  if (locale === 'en') return `/en${href}`;
  return href;
}
