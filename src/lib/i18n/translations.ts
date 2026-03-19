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

  // Home — Projects
  'home.projects.title': { es: 'Proyectos', en: 'Projects' },
  'home.projects.seeAll': { es: 'Ver Todos', en: 'See All' },

  // Home — Experience
  'home.experience.title': { es: 'EXPERIENCIA', en: 'EXPERIENCE' },
  'home.experience.present': { es: 'Presente', en: 'Present' },

  // Home — Meta
  'home.meta.title': { es: 'Portfolio — ChrisBP', en: 'Portfolio — ChrisBP' },
  'home.meta.description': {
    es: 'Portfolio de ChrisBP — Desarrollador de aplicaciones móviles, sitios web y creador de contenido educativo sobre tecnología.',
    en: "ChrisBP's Portfolio — Mobile app developer, web developer, and educational tech content creator.",
  },

  // Projects page
  'projects.heading': { es: 'Proyectos', en: 'Projects' },
  'projects.meta.title': { es: 'Proyectos — ChrisBP', en: 'Projects — ChrisBP' },
  'projects.meta.description': {
    es: 'Proyectos personales y profesionales de ChrisBP',
    en: "ChrisBP's personal and professional projects",
  },
  'projects.intro': {
    es: 'Como desarrollador, he tenido la oportunidad de trabajar en diferentes proyectos, tanto personales como profesionales. A continuación algunos de los proyectos en los que he trabajado:',
    en: "As a developer, I've had the opportunity to work on different projects, both personal and professional. Below are some of the projects I've worked on:",
  },
  'projects.filter.label': { es: 'Filtrar por:', en: 'Filter by:' },
  'projects.filter.all': { es: 'Todos los Proyectos', en: 'All Projects' },
  'projects.technologies': { es: 'Tecnologías', en: 'Technologies' },
  'projects.website': { es: 'Website', en: 'Website' },
  'projects.sourceCode': { es: 'Código Fuente', en: 'Source Code' },
  'projects.screenshots': { es: 'Screenshots', en: 'Screenshots' },
  'projects.noResults': {
    es: 'No se encontraron proyectos con esta tecnología',
    en: 'No projects found with this technology',
  },
  'projects.detail.features': { es: 'Características', en: 'Features' },
  'projects.detail.backToProjects': { es: '← Volver a Proyectos', en: '← Back to Projects' },
  'projects.detail.externalLink.newTab': { es: 'abre en nueva pestaña', en: 'opens in new tab' },

  // ImageViewer
  'imageViewer.close': { es: 'Cerrar', en: 'Close' },
  'imageViewer.previous': { es: 'Imagen anterior', en: 'Previous image' },
  'imageViewer.next': { es: 'Siguiente imagen', en: 'Next image' },
  'imageViewer.counter': { es: 'de', en: 'of' },

  // Social aria
  'social.tiktok': { es: 'Visitar perfil de TikTok', en: 'Visit TikTok profile' },
  'social.github': { es: 'Visitar perfil de GitHub', en: 'Visit GitHub profile' },
  'social.linkedin': { es: 'Visitar perfil de LinkedIn', en: 'Visit LinkedIn profile' },
};

export function t(key: string, locale: Locale): string {
  return translations[key]?.[locale] ?? key;
}

export default translations;
