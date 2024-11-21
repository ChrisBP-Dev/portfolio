import 'package:portfolio/src/features/projects/domain/project.dart';
import 'package:portfolio/src/features/projects/domain/screenshot_image.dart';

const kProjects = [
  Project(
    id: '1',
    companyNameEn: 'QETO - STARTUP',
    companyNameEs: 'QETO - STARTUP',
    websiteUrl: 'https://www.qeto.app',
    sourceCodeUrl: 'source-code',
    shortDescriptionEs: '''
Qeto es una plataforma (app móvil) que reúne la mayor cantidad de información de los productos de los mercados de barrio, ayudando a los consumidores a ahorrar dinero y a los comerciantes a aumentar sus ventas, impulsando el desarrollo económico y mejorando la calidad de vida de las personas.
''',
    shortDescriptionEn: '''
Qeto is a platform (mobile app) that brings together the most information about products from neighborhood markets, helping consumers save money and merchants increase their sales, driving economic development and improving people's quality of life.
''',
    featuresES: [
      'Descubre ofertas cercanas',
      'Compara precios',
      'Encuentra los mejores productos en tus tiendas locales',
      'Explora las últimas tendencias',
      'Busca productos esenciales',
      'Ahorra tiempo y dinero',
    ],
    featuresEN: [
      'Discover nearby offers',
      'Compare prices',
      'Find the best products in your local stores',
      'Explore the latest trends',
      'Search for essential products',
      'Save time and money',
    ],
    technologies: [
      '98ee623a-85a0-41f1-b9fb-4417654e20a8',
      'b2e9a40e-f83b-46af-ac01-f846361d6e68',
      'c4557f12-d382-4821-a4bb-d6522517b3bc',
    ],
    mainImage: ImageAndPath(
      url:
          'https://firebasestorage.googleapis.com/v0/b/portfolio-chrisbp.appspot.com/o/projects%2Fqeto%2Fqeto-main-image.png?alt=media&token=72bcbf1e-9a67-4f75-86b7-b9738953c25c',
    ),
  ),
  Project(
    id: '2',
    companyNameEn: 'LA CABANITA - FASTFOOD',
    companyNameEs: 'LA CABANITA - COMIDA RAPIDA',
    websiteUrl: 'https://lacabanita-store.web.app/hamburguesas',
    shortDescriptionEs: '''
Negocio de comida rápida en la ciudad de Lima, Perú. Se generó una aplicación móvil para la gestión de pedidos dentro del local y de los que se recibian desde el website creado tambien con flutter web.
''',
    shortDescriptionEn: '''
Business of fast food in Lima, Peru. A mobile application was generated for order management within the premises and those received from the website also created with flutter web.
''',
    featuresES: [
      'Generacion de comandas para cocina (impresión de comanda y recibos)',
      'Gestión de pedidos',
      'Gestión de productos',
      'Gestión de categorías',
      'Gestión de usuarios',
      'Gestión de pedidos en tiempo real',
      'Gestión de pedidos desde el website',
      'Clientes acumualaban puntos por cada compra',
      'Ruleta de premios para los clientes',
    ],
    featuresEN: [
      'Generation of orders for the kitchen (order and receipt printing)',
      'Order management',
      'Product management',
      'Category management',
      'User management',
      'Real-time order management',
      'Order management from the website',
      'Customers accumulated points for each purchase',
      'Prize wheel for customers',
    ],
    mainImage: ImageAndPath(
      url:
          'https://firebasestorage.googleapis.com/v0/b/portfolio-chrisbp.appspot.com/o/projects%2Fcabanita%2Fcabanita-main-image.png?alt=media&token=63d60b98-4b42-446e-ade6-211666721038',
    ),
  ),
  Project(
    id: '3',
    companyNameEn: 'GUARDOWL',
    companyNameEs: 'GUARDOWL',
    websiteUrl: 'https://guarowl.vercel.app',
    shortDescriptionEs: '''
GuardOwl es una app diseñada para ofrecer seguridad y tranquilidad a los viajeros. Utilizando inteligencia artificial, la app proporciona alertas de seguridad en tiempo real, acceso a contactos importantes como embajadas y policía y permite a los usuarios reportar fácilmente incidentes. GuardOwl actúa como un guardián personal en cada destino, ayudando a los viajeros a mantenerse informados y seguros durante sus aventuras.
''',
    shortDescriptionEn: '''
GuardOwl is an app designed to offer security and peace of mind to travellers. Using artificial intelligence, the app provides real-time security alerts, access to important contacts such as embassies and police and allows users to report such as embassies and police, and allows users to easily report incidents. GuardOwl acts as a personal guardian in each each destination, helping travellers stay informed and safe during their adventures.
''',
    featuresES: [
      'Alertas de seguridad en tiempo real',
      'Acceso a contactos importantes',
      'Reporte de incidentes',
      'Guardián personal en cada destino',
      'Mantente informado y seguro durante tus aventuras',
    ],
    featuresEN: [
      'Real-time security alerts',
      'Access to important contacts',
      'Incident reporting',
      'Personal guardian in each destination',
      'Stay informed and safe during your adventures',
    ],
    mainImage: ImageAndPath(
      url:
          'https://firebasestorage.googleapis.com/v0/b/portfolio-chrisbp.appspot.com/o/projects%2Fguardowl%2Fguardowl-main-image.png?alt=media&token=b591f044-7402-470f-aacc-af474642efea',
    ),
  ),
  Project(
    id: '4',
    shortDescriptionEn: '''
CNEL - FICHA is an open-source application created with the purpose of helping the Ecuadorian community to better plan for scheduled power outages. The application consumes the CNEL API to show updated information on the upcoming dates and times of power outages, allowing people to anticipate and take measures''',
    shortDescriptionEs: '''
CNEL - FICHA es una aplicación de código abierto creada con el propósito de ayudar a la comunidad de Ecuador a planificar mejor frente a los cortes de energía programados. La aplicación consume la API de CNEL para mostrar información actualizada sobre las próximas fechas y horarios de corte de luz, permitiendo que las personas puedan anticiparse y tomar medidas''',
    companyNameEn: 'CNEL - FICHA',
    companyNameEs: 'CNEL - FICHA',
    websiteUrl: 'https://cnel-ficha.vercel.app',
    mainImage: ImageAndPath(url: ''),
    featuresEN: [
      'Consult scheduled power outage times',
      'Updated information from CNEL’s API',
      'User-friendly interface for easy access to information',
      'Open-source development to contribute to the community',
      'Easily accessible and available to all users',
    ],
    featuresES: [
      'Consulta de horarios de cortes de energía programados',
      'Información actualizada de la API de CNEL',
      'Interfaz amigable para un fácil acceso a la información',
      'Desarrollo de código abierto para contribuir a la comunidad',
      'De fácil acceso y disponible para todos los usuarios',
    ],
  ),
];
