import type { Locale } from '../lib/i18n/config';

export const navItems = [
  { key: 'home', href: '/', label: { es: 'Inicio', en: 'Home' } },
  { key: 'projects', href: '/projects', label: { es: 'Proyectos', en: 'Projects' } },
  { key: 'blog', href: '/blog', label: { es: 'Blog', en: 'Blog' } },
  { key: 'contact', href: '/contact', label: { es: 'Contacto', en: 'Contact' } },
] as const;

export type NavKey = (typeof navItems)[number]['key'];

/** Prefix href with /es for Spanish locale (non-default) */
export function localizeHref(href: string, locale: Locale): string {
  if (locale === 'es') return `/es${href}`;
  return href;
}
