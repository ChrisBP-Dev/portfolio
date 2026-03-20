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

  // Admin — Login
  'admin.login.title': { es: 'Iniciar sesión', en: 'Sign in' },
  'admin.login.email': { es: 'Correo electrónico', en: 'Email' },
  'admin.login.password': { es: 'Contraseña', en: 'Password' },
  'admin.login.submit': { es: 'Iniciar sesión', en: 'Sign in' },
  'admin.login.loading': { es: 'Autenticando...', en: 'Authenticating...' },
  'admin.logout': { es: 'Cerrar sesión', en: 'Sign out' },
  'admin.dashboard.title': { es: 'Panel de Administración', en: 'Admin Panel' },
  'admin.dashboard.placeholder': { es: 'Dashboard — próximamente', en: 'Dashboard — coming soon' },

  // Admin — Sidebar
  'admin.sidebar.dashboard': { es: 'Dashboard', en: 'Dashboard' },
  'admin.sidebar.projects': { es: 'Proyectos', en: 'Projects' },
  'admin.sidebar.technologies': { es: 'Tecnologías', en: 'Technologies' },
  'admin.sidebar.experiences': { es: 'Experiencias', en: 'Experiences' },
  'admin.sidebar.blog': { es: 'Blog', en: 'Blog' },
  'admin.sidebar.toggle': { es: 'Abrir menú', en: 'Open menu' },

  // Admin — Dashboard cards
  'admin.dashboard.projects': { es: 'Proyectos', en: 'Projects' },
  'admin.dashboard.technologies': { es: 'Tecnologías', en: 'Technologies' },
  'admin.dashboard.experiences': { es: 'Experiencias', en: 'Experiences' },
  'admin.dashboard.blog': { es: 'Blog', en: 'Blog' },

  // Admin — Breadcrumb
  'admin.breadcrumb.admin': { es: 'Admin', en: 'Admin' },

  // Admin — Placeholders
  'admin.placeholder.comingSoon': { es: 'Próximamente', en: 'Coming soon' },

  // Admin — Projects
  'admin.projects.title': { es: 'Proyectos', en: 'Projects' },
  'admin.projects.createNew': { es: 'Crear nuevo', en: 'Create new' },
  'admin.projects.empty': { es: 'No hay proyectos aún.', en: 'No projects yet.' },
  'admin.projects.emptyCta': { es: 'Crear el primero →', en: 'Create the first one →' },
  'admin.projects.edit': { es: 'Editar', en: 'Edit' },
  'admin.projects.delete': { es: 'Eliminar', en: 'Delete' },
  'admin.projects.loading': { es: 'Cargando proyectos...', en: 'Loading projects...' },
  'admin.projects.errorLoading': { es: 'Error al cargar los proyectos', en: 'Error loading projects' },
  'admin.projects.createTitle': { es: 'Crear proyecto', en: 'Create project' },
  'admin.projects.editTitle': { es: 'Editar proyecto', en: 'Edit project' },

  // Admin — Project Form
  'admin.projects.form.sectionBasic': { es: 'Información Básica', en: 'Basic Information' },
  'admin.projects.form.sectionImages': { es: 'Imágenes', en: 'Images' },
  'admin.projects.form.sectionMetadata': { es: 'Metadata', en: 'Metadata' },
  'admin.projects.form.companyName': { es: 'Nombre del proyecto', en: 'Project name' },
  'admin.projects.form.shortDescription': { es: 'Descripción corta', en: 'Short description' },
  'admin.projects.form.features': { es: 'Características', en: 'Features' },
  'admin.projects.form.mainImage': { es: 'Imagen principal', en: 'Main image' },
  'admin.projects.form.screenshots': { es: 'Screenshots', en: 'Screenshots' },
  'admin.projects.form.technologies': { es: 'Tecnologías', en: 'Technologies' },
  'admin.projects.form.websiteUrl': { es: 'URL del sitio web', en: 'Website URL' },
  'admin.projects.form.sourceCodeUrl': { es: 'URL del código fuente', en: 'Source code URL' },
  'admin.projects.form.slug': { es: 'Slug', en: 'Slug' },
  'admin.projects.form.slugManual': { es: 'Editar slug manualmente', en: 'Edit slug manually' },
  'admin.projects.form.save': { es: 'Guardar', en: 'Save' },
  'admin.projects.form.saving': { es: 'Guardando...', en: 'Saving...' },
  'admin.projects.form.saveEdit': { es: 'Guardar cambios', en: 'Save changes' },
  'admin.projects.form.savingEdit': { es: 'Guardando cambios...', en: 'Saving changes...' },
  'admin.projects.form.cancel': { es: 'Cancelar', en: 'Cancel' },
  'admin.projects.form.discardChanges': { es: '¿Descartar cambios?', en: 'Discard changes?' },
  'admin.projects.form.addFeature': { es: 'Agregar', en: 'Add' },
  'admin.projects.form.removeFeature': { es: 'Eliminar característica', en: 'Remove feature' },
  'admin.projects.form.addScreenshot': { es: 'Agregar screenshot', en: 'Add screenshot' },
  'admin.projects.form.removeImage': { es: 'Eliminar imagen', en: 'Remove image' },
  'admin.projects.form.dragOrClick': { es: 'Arrastra o haz clic para subir', en: 'Drag or click to upload' },
  'admin.projects.form.imageFormats': { es: 'PNG, JPG, WebP — máx. 5MB', en: 'PNG, JPG, WebP — max 5MB' },
  'admin.projects.form.successToast': { es: 'Proyecto guardado exitosamente', en: 'Project saved successfully' },
  'admin.projects.form.errorToast': { es: 'Error al guardar el proyecto', en: 'Error saving project' },
  'admin.projects.deleteConfirmTitle': { es: 'Eliminar proyecto', en: 'Delete project' },
  'admin.projects.deleteConfirmMessage': { es: "¿Eliminar '{name}'? Se eliminarán también {count} imágenes de Storage.", en: "Delete '{name}'? {count} images will also be deleted from Storage." },
  'admin.projects.deleteConfirmButton': { es: 'Eliminar', en: 'Delete' },
  'admin.projects.deleteSuccessToast': { es: 'Proyecto eliminado exitosamente', en: 'Project deleted successfully' },
  'admin.projects.deleteErrorToast': { es: 'Error al eliminar el proyecto', en: 'Error deleting project' },
  'admin.projects.editSuccessToast': { es: 'Proyecto guardado exitosamente', en: 'Project saved successfully' },
  'admin.confirm.cancel': { es: 'Cancelar', en: 'Cancel' },
  'admin.confirm.deleting': { es: 'Eliminando...', en: 'Deleting...' },
  'admin.projects.form.noTechnologies': { es: 'No hay tecnologías disponibles', en: 'No technologies available' },

  // Admin — Validation
  'admin.validation.required': { es: 'Este campo es obligatorio', en: 'This field is required' },
  'admin.validation.urlInvalid': { es: 'Introduce una URL válida', en: 'Enter a valid URL' },
  'admin.validation.slugInvalid': { es: 'El slug solo puede contener letras minúsculas, números y guiones', en: 'Slug can only contain lowercase letters, numbers and hyphens' },
  'admin.validation.fileTooLarge': { es: 'Intenta con un archivo menor a 5MB', en: 'Try a file smaller than 5MB' },
  'admin.validation.imageRequired': { es: 'La imagen principal es obligatoria', en: 'Main image is required' },

  // Admin — Bilingual Field
  'admin.bilingual.es': { es: 'ES', en: 'ES' },
  'admin.bilingual.en': { es: 'EN', en: 'EN' },
};

export function t(key: string, locale: Locale): string {
  return translations[key]?.[locale] ?? key;
}

export default translations;
