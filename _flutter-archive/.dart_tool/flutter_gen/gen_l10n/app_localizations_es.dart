import 'app_localizations.dart';

// ignore_for_file: type=lint

/// The translations for Spanish Castilian (`es`).
class AppLocalizationsEs extends AppLocalizations {
  AppLocalizationsEs([String locale = 'es']) : super(locale);

  @override
  String get initialBannerTitle => 'Bienvenido a mi';

  @override
  String get homeTitle => 'Inicio';

  @override
  String get goHome => 'Ir al inicio';

  @override
  String get aboutText => 'Yo programo y\ncreo ';

  @override
  String get aboutIt => 'contenido';

  @override
  String get aboutMeDescription => 'Hola, soy Christopher, un desarrollador multiplataforma especializado en Flutter. Con más de dos años de experiencia, he creado aplicaciones que resuelven problemas reales y me encanta integrar tecnologías como Firebase e IA, incluyendo Gemini. He trabajado con startups dinámicas y estoy listo para compartir lo que sé en TikTok y YouTube. ¡Gracias por acompañarme en este viaje!';

  @override
  String get getInTouch => 'Contáctame';

  @override
  String get downloadResume => 'Descargar Resumen';

  @override
  String get knowledgeOf => 'Conocimiento de';

  @override
  String get projectsTitle => 'Proyectos';

  @override
  String get project => 'Proyecto';

  @override
  String get projectDescription => 'Como desarrollador he tenido la oportunidad de trabajar en diferentes proyectos, tanto personales como profesionales. A continuación, algunos de los proyectos en los que he trabajado:';

  @override
  String get filterBy => 'Filtrar por';

  @override
  String get allProjects => 'Todos los Proyectos';

  @override
  String get noProjects => 'No se encontraron proyectos';

  @override
  String get mainImageTitle => 'Imagen Principal';

  @override
  String get companyName => 'Nombre de la Empresa';

  @override
  String get shortDescription => 'Descripción Corta';

  @override
  String get websiteTitle => 'Sitio Web';

  @override
  String get sourceCodeTitle => 'Código Fuente';

  @override
  String get screenshotsTitle => 'Capturas de Pantalla';

  @override
  String get featuresTitle => 'Características';

  @override
  String get seeAllButtonTitle => 'Ver Todos';

  @override
  String get technologiesTitle => 'Tecnologías';

  @override
  String get technology => 'Tecnología';

  @override
  String get experienceTitle => 'Experiencia';

  @override
  String get experienceTime => 'Tiempo de Experiencia';

  @override
  String get contactTitle => 'Contacto';

  @override
  String get contactDescription => 'Si tienes alguna pregunta o te gustaría trabajar conmigo, no dudes en contactarme utilizando el formulario a continuación. Me pondré en contacto contigo lo antes posible. ¡Gracias!';

  @override
  String get nameLabel => 'Nombre';

  @override
  String get emailLabel => 'Correo Electrónico';

  @override
  String get phoneNumberLabel => 'Número de Teléfono';

  @override
  String get messageLabel => 'Mensaje';

  @override
  String get chooseHowToContact => 'Elige cómo contactar';

  @override
  String get searchCountryHint => 'Buscar país';

  @override
  String get sendThrough => 'Enviar a través de';

  @override
  String get sendMessage => 'Enviar Mensaje';

  @override
  String messageTemplate(Object fieldName, Object fieldName2, Object fieldName3, Object fieldName4, Object fieldName5) {
    return 'Hola,\nMi nombre es *$fieldName*,\nVengo de tu sitio web $fieldName2\n*y me gustaría saber más sobre:*\n\n$fieldName3\n\nPuedes contactarme a través de:\n*Número de Teléfono:* $fieldName4\n*Correo Electrónico:* $fieldName5\n\n*¡Gracias!*';
  }

  @override
  String get pageNotFound404 => '404 - Página no encontrada!';

  @override
  String create(Object fieldName) {
    return 'Crear $fieldName';
  }

  @override
  String update(Object fieldName) {
    return 'Actualizar $fieldName';
  }

  @override
  String delete(Object fieldName) {
    return 'Eliminar $fieldName';
  }

  @override
  String get close => 'Cerrar';

  @override
  String whatsYour(Object fieldName) {
    return '¿Cuál es tu $fieldName?';
  }

  @override
  String errorMessage(Object fieldName) {
    return 'Por favor, introduce tu $fieldName';
  }

  @override
  String get error => 'Error';

  @override
  String get adminPanel => 'Panel de Administración';

  @override
  String get upload => 'Subir';

  @override
  String get image => 'Imagen';

  @override
  String get signIn => 'Iniciar Sesión';

  @override
  String get signOut => 'Cerrar Sesión';

  @override
  String get password => 'Contraseña';

  @override
  String areYouSure(Object fieldName) {
    return '¿Estás seguro de que quieres $fieldName ?';
  }

  @override
  String get cancel => 'Cancelar';
}
