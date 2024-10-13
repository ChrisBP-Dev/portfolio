import 'package:portfolio/src/constants/knowledge.dart';
import 'package:portfolio/src/features/projects/domain/project.dart';

final kProjects = [
  Project(
    id: '1',
    companyNameEs: 'LA CABANITA - FASTFOOD',
    companyNameEn: 'LA CABANITA - COMIDA RAPIDA',
    websiteUrl: 'https://lacabanita-store.web.app/hamburguesas',
    shortDescriptionEs: '''
Negocio de comida rápida en la ciudad de Lima, Perú.
Se generó una aplicación móvil para la gestión de pedidos dentro del local y de los que se recibian desde el website creado tambien con flutter web.
''',
    shortDescriptionEn: '''
Business of fast food in Lima, Peru.
A mobile application was generated for order management within the premises and those received from the website also created with flutter web.
''',
    featuresEs: [
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
    featuresEn: [
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
    myContributionsEs: [
      'Todo fue desarrollado por mi',
      'Desarrollo de las aplicaciones móviles (Local - Manager)',
      'Desarrollo del website (flutter web app)',
      'Desarrollo del backend (firebase)',
      'Desarrollo de la base de datos (firestore)',
    ],
    myContributionsEn: [
      'Everything was developed by me',
      'Development of mobile applications (Local - Manager)',
      'Development of the website (flutter web app)',
      'Development of the backend (firebase)',
      'Development of the database (firestore)',
    ],
    tecnologies: [
      ...kKnowledge.tecnologies,
    ],
    mainImageUrl: 'assets/projects/cabanita-main-image.png',
    imagesUrls: [
      'assets/projects/cabanita-main-image.png',
      'assets/projects/cabanita-main-image.png',
      'assets/projects/cabanita-main-image.png',
      'assets/projects/cabanita-main-image.png',
    ],
  ),
  Project(
    id: '2',
    companyNameEs: 'QETO - STARTUP',
    companyNameEn: 'QETO - STARTUP',
    websiteUrl: 'https://www.qeto.app',
    shortDescriptionEs: '''
Qeto es una plataforma (app móvil) que reúne la mayor cantidad de información de los productos de los mercados de barrio, ayudando a los consumidores a ahorrar dinero y a los comerciantes a aumentar sus ventas, impulsando el desarrollo económico y mejorando la calidad de vida de las personas.
''',
    shortDescriptionEn: '''
Qeto is a platform (mobile app) that brings together the most information about products from neighborhood markets, helping consumers save money and merchants increase their sales, driving economic development and improving people's quality of life.
''',
    featuresEs: [
      'Descubre ofertas cercanas',
      'Compara precios',
      'Encuentra los mejores productos en tus tiendas locales',
      'Explora las últimas tendencias',
      'Busca productos esenciales',
      'Ahorra tiempo y dinero',
    ],
    featuresEn: [
      'Discover nearby offers',
      'Compare prices',
      'Find the best products in your local stores',
      'Explore the latest trends',
      'Search for essential products',
      'Save time and money',
    ],
    myContributionsEs: [],
    myContributionsEn: [],
    tecnologies: [
      ...kKnowledge.tecnologies,
    ],
    mainImageUrl: 'assets/projects/qeto-main-image.png',
    imagesUrls: [
      'assets/projects/qeto-main-image.png',
      'assets/projects/qeto-main-image.png',
      'assets/projects/qeto-main-image.png',
      'assets/projects/qeto-main-image.png',
    ],
  ),
  Project(
    id: '3',
    companyNameEs: 'GUARDOWL',
    companyNameEn: 'GUARDOWL',
    websiteUrl: 'https://guarowl.vercel.app',
    shortDescriptionEs: '''
GuardOwl es una app diseñada para ofrecer seguridad y tranquilidad a los viajeros. Utilizando inteligencia artificial, la app proporciona alertas de seguridad en tiempo real, acceso a contactos importantes como embajadas y policía y permite a los usuarios reportar fácilmente incidentes. GuardOwl actúa como un guardián personal en cada destino, ayudando a los viajeros a mantenerse informados y seguros durante sus aventuras.
''',
    shortDescriptionEn: '''
GuardOwl is an app designed to offer security and peace of mind to travellers. Using artificial intelligence, the app provides real-time security alerts, access to important contacts such as embassies and police and allows users to report such as embassies and police, and allows users to easily report incidents. GuardOwl acts as a personal guardian in each each destination, helping travellers stay informed and safe during their adventures.
''',
    featuresEs: [
      'Alertas de seguridad en tiempo real',
      'Acceso a contactos importantes',
      'Reporte de incidentes',
      'Guardián personal en cada destino',
      'Mantente informado y seguro durante tus aventuras',
    ],
    featuresEn: [
      'Real-time security alerts',
      'Access to important contacts',
      'Incident reporting',
      'Personal guardian in each destination',
      'Stay informed and safe during your adventures',
    ],
    myContributionsEs: [],
    myContributionsEn: [],
    tecnologies: [
      ...kKnowledge.tecnologies,
    ],
    mainImageUrl: 'assets/projects/guardowl-main-image.jpeg',
    imagesUrls: [
      'assets/projects/guardowl-main-image.jpeg',
      'assets/projects/qeto-main-image.png',
    ],
  ),
];
