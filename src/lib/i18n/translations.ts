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

  // Contact page
  'contact.heading': { es: 'Contacto', en: 'Contact' },
  'contact.description': {
    es: 'Elige tu canal preferido y envíame un mensaje. Estaré encantado de conversar contigo.',
    en: 'Choose your preferred channel and send me a message. I\'d love to hear from you.',
  },
  'contact.form.name': { es: 'Nombre', en: 'Name' },
  'contact.form.email': { es: 'Email', en: 'Email' },
  'contact.form.phone': { es: 'Teléfono', en: 'Phone' },
  'contact.form.message': { es: 'Mensaje', en: 'Message' },
  'contact.form.channel': { es: 'Canal de contacto', en: 'Contact channel' },
  'contact.form.channel.whatsapp': { es: 'WhatsApp', en: 'WhatsApp' },
  'contact.form.channel.email': { es: 'Email', en: 'Email' },
  'contact.form.submit': { es: 'Enviar Mensaje', en: 'Send Message' },
  'contact.form.countryCode': { es: 'Código de país', en: 'Country code' },
  'contact.form.namePlaceholder': { es: 'Tu nombre completo', en: 'Your full name' },
  'contact.form.emailPlaceholder': { es: 'tu@email.com', en: 'you@email.com' },
  'contact.form.phonePlaceholder': { es: '123 456 789', en: '123 456 789' },
  'contact.form.messagePlaceholder': {
    es: 'Cuéntame sobre tu proyecto o idea...',
    en: 'Tell me about your project or idea...',
  },
  'contact.validation.nameRequired': { es: 'Nombre es obligatorio', en: 'Name is required' },
  'contact.validation.emailRequired': { es: 'Email es obligatorio', en: 'Email is required' },
  'contact.validation.emailInvalid': { es: 'Email inválido', en: 'Invalid email' },
  'contact.validation.messageRequired': { es: 'Mensaje es obligatorio', en: 'Message is required' },
  'contact.validation.channelRequired': { es: 'Selecciona un canal', en: 'Select a channel' },
  'contact.validation.nameMin': { es: 'El nombre debe tener al menos 2 caracteres', en: 'Name must be at least 2 characters' },
  'contact.validation.nameMax': { es: 'El nombre no puede superar los 100 caracteres', en: 'Name cannot exceed 100 characters' },
  'contact.validation.messageMin': { es: 'El mensaje debe tener al menos 10 caracteres', en: 'Message must be at least 10 characters' },
  'contact.validation.messageMax': { es: 'El mensaje no puede superar los 2000 caracteres', en: 'Message cannot exceed 2000 characters' },
  'contact.form.popupBlocked': { es: 'Tu navegador bloque\u00f3 la ventana emergente. Haz clic abajo para abrir manualmente.', en: 'Your browser blocked the popup. Click below to open manually.' },
  'contact.form.openManually': { es: 'Abrir WhatsApp', en: 'Open WhatsApp' },
  'contact.meta.title': { es: 'Contacto — ChrisBP', en: 'Contact — ChrisBP' },
  'contact.meta.description': {
    es: 'Ponte en contacto conmigo por WhatsApp o Email.',
    en: 'Get in touch with me via WhatsApp or Email.',
  },
};

export function t(key: string, locale: Locale): string {
  return translations[key]?.[locale] ?? key;
}

export default translations;
