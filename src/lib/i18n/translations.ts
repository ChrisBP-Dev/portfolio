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

  // Blog page
  'blog.meta.title': { es: 'Blog — ChrisBP', en: 'Blog — ChrisBP' },
  'blog.meta.description': {
    es: 'Artículos sobre desarrollo web, tecnología y proceso creativo',
    en: 'Articles about web development, technology and creative process',
  },
  'blog.heading': { es: 'Blog', en: 'Blog' },
  'blog.intro': {
    es: 'Artículos sobre desarrollo web, tecnología y mi proceso creativo como desarrollador.',
    en: 'Articles about web development, technology, and my creative process as a developer.',
  },
  'blog.noArticles': { es: 'No hay artículos publicados aún.', en: 'No published articles yet.' },
  'blog.readingTime': { es: '{minutes} min de lectura', en: '{minutes} min read' },

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
  'admin.projects.form.screenshotPartialWarning': { es: '{success} de {total} screenshots subidos, {failed} fallaron', en: '{success} of {total} screenshots uploaded, {failed} failed' },
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

  // Admin — Technologies
  'admin.technologies.title': { es: 'Tecnologías', en: 'Technologies' },
  'admin.technologies.createTitle': { es: 'Crear tecnología', en: 'Create technology' },
  'admin.technologies.editTitle': { es: 'Editar tecnología', en: 'Edit technology' },
  'admin.technologies.createNew': { es: 'Crear nueva', en: 'Create new' },
  'admin.technologies.empty': { es: 'No hay tecnologías aún', en: 'No technologies yet' },
  'admin.technologies.emptyCta': { es: 'Crear la primera', en: 'Create the first one' },
  'admin.technologies.loading': { es: 'Cargando tecnologías...', en: 'Loading technologies...' },
  'admin.technologies.errorLoading': { es: 'Error al cargar tecnologías', en: 'Error loading technologies' },
  'admin.technologies.edit': { es: 'Editar', en: 'Edit' },
  'admin.technologies.delete': { es: 'Eliminar', en: 'Delete' },
  'admin.technologies.form.name': { es: 'Nombre', en: 'Name' },
  'admin.technologies.form.experienceYears': { es: 'Años de experiencia', en: 'Years of experience' },
  'admin.technologies.form.image': { es: 'Icono / Imagen', en: 'Icon / Image' },
  'admin.technologies.form.save': { es: 'Guardar tecnología', en: 'Save technology' },
  'admin.technologies.form.saving': { es: 'Guardando...', en: 'Saving...' },
  'admin.technologies.form.saveEdit': { es: 'Guardar cambios', en: 'Save changes' },
  'admin.technologies.form.savingEdit': { es: 'Guardando cambios...', en: 'Saving changes...' },
  'admin.technologies.form.cancel': { es: 'Cancelar', en: 'Cancel' },
  'admin.technologies.form.discardChanges': { es: '¿Descartar los cambios sin guardar?', en: 'Discard unsaved changes?' },
  'admin.technologies.form.experienceYearsUnit': { es: 'años', en: 'years' },
  'admin.technologies.createSuccessToast': { es: 'Tecnología guardada exitosamente', en: 'Technology saved successfully' },
  'admin.technologies.editSuccessToast': { es: 'Tecnología guardada exitosamente', en: 'Technology saved successfully' },
  'admin.technologies.createErrorToast': { es: 'Error al guardar la tecnología', en: 'Error saving technology' },
  'admin.technologies.deleteConfirmTitle': { es: 'Eliminar tecnología', en: 'Delete technology' },
  'admin.technologies.deleteConfirmMessage': { es: "¿Eliminar '{name}'? Se eliminará también su imagen de Storage.", en: "Delete '{name}'? Its image will also be removed from Storage." },
  'admin.technologies.deleteConfirmButton': { es: 'Eliminar', en: 'Delete' },
  'admin.technologies.deleteSuccessToast': { es: 'Tecnología eliminada exitosamente', en: 'Technology deleted successfully' },
  'admin.technologies.deleteErrorToast': { es: 'Error al eliminar la tecnología', en: 'Error deleting technology' },

  // Admin — Experiences
  'admin.experiences.title': { es: 'Experiencias', en: 'Experiences' },
  'admin.experiences.createTitle': { es: 'Crear experiencia', en: 'Create experience' },
  'admin.experiences.editTitle': { es: 'Editar experiencia', en: 'Edit experience' },
  'admin.experiences.createNew': { es: 'Crear nueva', en: 'Create new' },
  'admin.experiences.empty': { es: 'No hay experiencias aún', en: 'No experiences yet' },
  'admin.experiences.emptyCta': { es: 'Crear la primera', en: 'Create the first one' },
  'admin.experiences.loading': { es: 'Cargando experiencias...', en: 'Loading experiences...' },
  'admin.experiences.errorLoading': { es: 'Error al cargar experiencias', en: 'Error loading experiences' },
  'admin.experiences.edit': { es: 'Editar', en: 'Edit' },
  'admin.experiences.delete': { es: 'Eliminar', en: 'Delete' },
  'admin.experiences.present': { es: 'Presente', en: 'Present' },
  'admin.experiences.form.companyName': { es: 'Empresa', en: 'Company' },
  'admin.experiences.form.jobName': { es: 'Puesto', en: 'Job title' },
  'admin.experiences.form.responsibilities': { es: 'Responsabilidades', en: 'Responsibilities' },
  'admin.experiences.form.startDate': { es: 'Fecha de inicio', en: 'Start date' },
  'admin.experiences.form.endDate': { es: 'Fecha de fin', en: 'End date' },
  'admin.experiences.form.currentlyWorking': { es: 'Actualmente trabajando', en: 'Currently working' },
  'admin.experiences.form.save': { es: 'Guardar experiencia', en: 'Save experience' },
  'admin.experiences.form.saving': { es: 'Guardando...', en: 'Saving...' },
  'admin.experiences.form.saveEdit': { es: 'Guardar cambios', en: 'Save changes' },
  'admin.experiences.form.savingEdit': { es: 'Guardando cambios...', en: 'Saving changes...' },
  'admin.experiences.form.cancel': { es: 'Cancelar', en: 'Cancel' },
  'admin.experiences.form.discardChanges': { es: '¿Descartar los cambios sin guardar?', en: 'Discard unsaved changes?' },
  'admin.experiences.form.dateRangeError': { es: 'La fecha de fin debe ser posterior a la de inicio', en: 'End date must be after start date' },
  'admin.experiences.createSuccessToast': { es: 'Experiencia guardada exitosamente', en: 'Experience saved successfully' },
  'admin.experiences.editSuccessToast': { es: 'Experiencia guardada exitosamente', en: 'Experience saved successfully' },
  'admin.experiences.deleteConfirmTitle': { es: 'Eliminar experiencia', en: 'Delete experience' },
  'admin.experiences.deleteConfirmMessage': { es: "¿Eliminar la experiencia en '{name}'?", en: "Delete the experience at '{name}'?" },
  'admin.experiences.deleteConfirmButton': { es: 'Eliminar', en: 'Delete' },
  'admin.experiences.deleteSuccessToast': { es: 'Experiencia eliminada exitosamente', en: 'Experience deleted successfully' },
  'admin.experiences.deleteErrorToast': { es: 'Error al eliminar la experiencia', en: 'Error deleting experience' },

  // Admin — Image Status Badges
  'admin.imageStatus.existing': { es: 'Subida', en: 'Uploaded' },
  'admin.imageStatus.new': { es: 'Nueva', en: 'New' },
  'admin.imageStatus.replaced': { es: 'Reemplazará', en: 'Will replace' },
  'admin.imageStatus.removed': { es: 'Se eliminará', en: 'Will delete' },
  'admin.imageStatus.undoRemove': { es: 'Deshacer eliminación', en: 'Undo removal' },

  // Admin — Firestore Errors
  'admin.error.permissionDenied': { es: 'Sin permisos para esta operación', en: 'No permission for this operation' },
  'admin.error.notFound': { es: 'El recurso no fue encontrado', en: 'Resource not found' },
  'admin.error.unavailable': { es: 'Servicio no disponible. Verifica tu conexión.', en: 'Service unavailable. Check your connection.' },
  'admin.error.unknown': { es: 'Error inesperado', en: 'Unexpected error' },
  'admin.error.unauthenticated': { es: 'Sesión expirada. Inicia sesión nuevamente.', en: 'Session expired. Please sign in again.' },
  'admin.error.resourceExhausted': { es: 'Límite de operaciones alcanzado. Intenta más tarde.', en: 'Operation limit reached. Try again later.' },
  'admin.error.deadlineExceeded': { es: 'La operación tardó demasiado. Intenta nuevamente.', en: 'Operation timed out. Please try again.' },
  'admin.error.alreadyExists': { es: 'El recurso ya existe', en: 'Resource already exists' },
  'admin.error.storageFull': { es: 'Almacenamiento lleno. Elimina archivos antes de subir más.', en: 'Storage full. Delete files before uploading more.' },
  'admin.error.uploadFailed': { es: 'No se pudo subir la imagen. Intenta nuevamente.', en: 'Image upload failed. Please try again.' },

  // Admin — Validation
  'admin.validation.required': { es: 'Este campo es obligatorio', en: 'This field is required' },
  'admin.validation.urlInvalid': { es: 'Introduce una URL válida', en: 'Enter a valid URL' },
  'admin.validation.slugInvalid': { es: 'El slug solo puede contener letras minúsculas, números y guiones', en: 'Slug can only contain lowercase letters, numbers and hyphens' },
  'admin.validation.fileTooLarge': { es: 'Intenta con un archivo menor a 5MB', en: 'Try a file smaller than 5MB' },
  'admin.validation.imageRequired': { es: 'La imagen principal es obligatoria', en: 'Main image is required' },
  'admin.validation.maxScreenshots': { es: 'Máximo 10 screenshots permitidos', en: 'Maximum 10 screenshots allowed' },
  'admin.validation.numberRequired': { es: 'Introduce un número válido', en: 'Enter a valid number' },
  'admin.validation.numberNonNegative': { es: 'El valor debe ser mayor o igual a 0', en: 'Value must be 0 or greater' },

  // Admin — Bilingual Field
  'admin.bilingual.es': { es: 'ES', en: 'ES' },
  'admin.bilingual.en': { es: 'EN', en: 'EN' },

  // Admin — Blog
  'admin.blog.title': { es: 'Blog', en: 'Blog' },
  'admin.blog.createNew': { es: 'Crear nuevo', en: 'Create new' },
  'admin.blog.editTitle': { es: 'Editar artículo', en: 'Edit article' },
  'admin.blog.createTitle': { es: 'Crear artículo', en: 'Create article' },
  'admin.blog.titleLabel': { es: 'Título', en: 'Title' },
  'admin.blog.slugLabel': { es: 'Slug', en: 'Slug' },
  'admin.blog.contentLabel': { es: 'Contenido', en: 'Content' },
  'admin.blog.coverImageLabel': { es: 'Imagen de portada', en: 'Cover image' },
  'admin.blog.statusLabel': { es: 'Estado', en: 'Status' },
  'admin.blog.statusPublished': { es: 'Publicado', en: 'Published' },
  'admin.blog.statusDraft': { es: 'Borrador', en: 'Draft' },
  'admin.blog.saveSuccessToast': { es: 'Artículo guardado exitosamente', en: 'Article saved successfully' },
  'admin.blog.coverImageFailedWarning': { es: 'Artículo guardado, pero la imagen de portada no se pudo procesar.', en: 'Article saved, but the cover image could not be processed.' },
  'admin.blog.deleteSuccessToast': { es: 'Artículo eliminado exitosamente', en: 'Article deleted successfully' },
  'admin.blog.emptyState': { es: 'No hay artículos de blog.', en: 'No blog articles yet.' },
  'admin.blog.emptyStateCta': { es: 'Escribir el primero →', en: 'Write the first one →' },
  'admin.blog.loading': { es: 'Cargando artículos...', en: 'Loading articles...' },
  'admin.blog.errorLoading': { es: 'Error al cargar los artículos', en: 'Error loading articles' },
  'admin.blog.deleteConfirmTitle': { es: 'Eliminar artículo', en: 'Delete article' },
  'admin.blog.deleteConfirmMessage': { es: "¿Eliminar '{name}'? Se eliminarán la portada y {imageCount} imágenes embebidas de Storage.", en: "Delete '{name}'? The cover image and {imageCount} embedded images will be deleted from Storage." },
  'admin.blog.deleteConfirmMessageSingular': { es: "¿Eliminar '{name}'? Se eliminarán la portada y 1 imagen embebida de Storage.", en: "Delete '{name}'? The cover image and 1 embedded image will be deleted from Storage." },
  'admin.blog.deleteConfirmMessageNoImages': { es: "¿Eliminar '{name}'? Se eliminará la portada de Storage.", en: "Delete '{name}'? The cover image will be deleted from Storage." },
  'admin.blog.deleteConfirmMessageNoCover': { es: "¿Eliminar '{name}'? Se eliminarán {imageCount} imágenes embebidas de Storage.", en: "Delete '{name}'? {imageCount} embedded images will be deleted from Storage." },
  'admin.blog.deleteConfirmMessageNoCoverSingular': { es: "¿Eliminar '{name}'? Se eliminará 1 imagen embebida de Storage.", en: "Delete '{name}'? 1 embedded image will be deleted from Storage." },
  'admin.blog.deleteConfirmMessageEmpty': { es: "¿Eliminar '{name}'?", en: "Delete '{name}'?" },
  'admin.blog.deleteConfirmButton': { es: 'Eliminar', en: 'Delete' },
  'admin.blog.slugInUse': { es: 'Este slug ya está en uso', en: 'This slug is already in use' },
  'admin.blog.slugInvalid': { es: 'El slug solo puede contener letras minúsculas, números y guiones', en: 'Slug can only contain lowercase letters, numbers and hyphens' },
  'admin.blog.contentRequired': { es: 'El contenido es obligatorio', en: 'Content is required' },
  'admin.blog.form.save': { es: 'Guardar artículo', en: 'Save article' },
  'admin.blog.form.saving': { es: 'Guardando...', en: 'Saving...' },
  'admin.blog.form.cancel': { es: 'Cancelar', en: 'Cancel' },
  'admin.blog.form.discardChanges': { es: '¿Descartar los cambios sin guardar?', en: 'Discard unsaved changes?' },
  'admin.blog.edit': { es: 'Editar', en: 'Edit' },
  'admin.blog.delete': { es: 'Eliminar', en: 'Delete' },
  'admin.blog.editorUnavailable': { es: 'Editor no disponible. Intente recargar la página.', en: 'Editor unavailable. Try reloading the page.' },
  'admin.blog.linkDialogTitle': { es: 'Insertar enlace', en: 'Insert link' },
  'admin.blog.linkDialogEditTitle': { es: 'Editar enlace', en: 'Edit link' },
  'admin.blog.linkDialogPlaceholder': { es: 'https://ejemplo.com', en: 'https://example.com' },
  'admin.blog.linkDialogApply': { es: 'Aplicar', en: 'Apply' },
  'admin.blog.linkDialogRemove': { es: 'Quitar enlace', en: 'Remove link' },
  'admin.blog.linkDialogCancel': { es: 'Cancelar', en: 'Cancel' },
  'admin.blog.linkDialogInvalidUrl': { es: 'Ingrese una URL válida (https://, http:// o mailto:)', en: 'Enter a valid URL (https://, http:// or mailto:)' },
  'admin.blog.retryLoad': { es: 'Reintentar', en: 'Retry' },
  'admin.blog.insertImage': { es: 'Insertar imagen', en: 'Insert image' },
  'admin.blog.insertImageTitle': { es: 'Insertar imagen en contenido', en: 'Insert image in content' },
  'admin.blog.uploading': { es: 'Subiendo imagen...', en: 'Uploading image...' },
  'admin.blog.insertButton': { es: 'Insertar', en: 'Insert' },
  'admin.blog.imageUploadError': { es: 'Error al subir la imagen. Intente de nuevo.', en: 'Failed to upload image. Please try again.' },
  'admin.blog.imageAltText': { es: 'Texto alternativo (opcional)', en: 'Alt text (optional)' },
};

export function t(key: string, locale: Locale): string {
  return translations[key]?.[locale] ?? key;
}

export default translations;
