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
  'home.hero.heading': { es: 'Yo construyo y creo', en: 'I build and create' },
  'home.hero.headingAccent': { es: 'experiencias', en: 'experiences' },
  'home.hero.description': {
    es: 'Desarrollador móvil con +4 años en Flutter, expandiendo al desarrollo web full-stack con Astro, SvelteKit, TypeScript, entre otras tecnologías modernas. Apasionado por el desarrollo aumentado con inteligencia artificial — aplico el BMAD Method para planificar, implementar y validar software con estándares profesionales. Tengo proyectos de código abierto, documentados y construidos para durar.',
    en: 'Mobile developer with 4+ years in Flutter, expanding into full-stack web development with Astro, SvelteKit, TypeScript, among other modern technologies. Passionate about AI-augmented development — I apply the BMAD Method to plan, implement, and validate software with professional standards. I have open-source projects, documented and built to last.',
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
    es: 'Portfolio de ChrisBP — Desarrollador móvil con +4 años en Flutter, expandiendo al web full-stack con tecnologías modernas y desarrollo aumentado con IA.',
    en: "ChrisBP's Portfolio — Mobile developer with 4+ years in Flutter, expanding into full-stack web with modern technologies and AI-augmented development.",
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
  'imageViewer.close': { es: 'Cerrar visor de imágenes', en: 'Close image viewer' },
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
