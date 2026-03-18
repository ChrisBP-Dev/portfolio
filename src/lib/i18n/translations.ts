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

  // Theme toggle aria
  'theme.toLight': { es: 'Cambiar a modo claro', en: 'Switch to light mode' },
  'theme.toDark': { es: 'Cambiar a modo oscuro', en: 'Switch to dark mode' },

  // Meta
  'meta.description': { es: 'Portfolio de Christopher Bobadilla', en: "Christopher Bobadilla's Portfolio" },

  // Home — Hero
  'home.hero.heading': { es: 'Yo programo y creo', en: 'I code and create' },
  'home.hero.headingAccent': { es: 'contenido', en: 'content' },
  'home.hero.description': {
    es: 'Desarrollador apasionado por crear aplicaciones móviles, sitios web y contenido educativo sobre tecnología.',
    en: 'Developer passionate about creating mobile apps, websites, and educational content about technology.',
  },
  'home.hero.cta.contact': { es: 'Contáctame', en: 'Get in Touch' },
  'home.hero.cta.resume': { es: 'Descargar CV', en: 'Download Resume' },

  // Home — Knowledge Of
  'home.knowledgeOf.title': { es: 'CONOCIMIENTOS', en: 'KNOWLEDGE OF' },

  // Home — Meta
  'home.meta.title': { es: 'Portfolio — ChrisBP', en: 'Portfolio — ChrisBP' },
  'home.meta.description': {
    es: 'Portfolio de ChrisBP — Desarrollador de aplicaciones móviles, sitios web y creador de contenido educativo sobre tecnología.',
    en: "ChrisBP's Portfolio — Mobile app developer, web developer, and educational tech content creator.",
  },

  // Social aria
  'social.tiktok': { es: 'Visitar perfil de TikTok', en: 'Visit TikTok profile' },
  'social.github': { es: 'Visitar perfil de GitHub', en: 'Visit GitHub profile' },
  'social.linkedin': { es: 'Visitar perfil de LinkedIn', en: 'Visit LinkedIn profile' },
};

export function t(key: string, locale: Locale): string {
  return translations[key]?.[locale] ?? key;
}

export default translations;
