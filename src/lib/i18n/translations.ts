import type { Locale } from './config';

const translations: Record<string, Record<Locale, string>> = {
  // Navigation
  'nav.home': { es: 'Inicio', en: 'Home' },
  'nav.projects': { es: 'Proyectos', en: 'Projects' },
  'nav.experience': { es: 'Experiencia', en: 'Experience' },
  'nav.blog': { es: 'Blog', en: 'Blog' },
  'nav.contact': { es: 'Contacto', en: 'Contact' },

  // Layout
  'banner.welcome': { es: 'Bienvenido a mi Portfolio', en: 'Welcome to my Portfolio' },
  'footer.contact': { es: 'Contacto', en: 'Contact' },
  'skipnav.label': { es: 'Saltar al contenido', en: 'Skip to content' },

  // Aria labels
  'nav.aria': { es: 'Navegación principal', en: 'Main navigation' },
  'mobile.open': { es: 'Abrir menú', en: 'Open menu' },
  'mobile.close': { es: 'Cerrar menú', en: 'Close menu' },
  'locale.switch': { es: 'Cambiar a inglés', en: 'Switch to Spanish' },

  // Meta
  'meta.description': { es: 'Portfolio de Christopher Bobadilla', en: "Christopher Bobadilla's Portfolio" },

  // Social aria
  'social.tiktok': { es: 'Visitar perfil de TikTok', en: 'Visit TikTok profile' },
  'social.github': { es: 'Visitar perfil de GitHub', en: 'Visit GitHub profile' },
  'social.linkedin': { es: 'Visitar perfil de LinkedIn', en: 'Visit LinkedIn profile' },
};

export function t(key: string, locale: Locale): string {
  return translations[key]?.[locale] ?? key;
}

export default translations;
