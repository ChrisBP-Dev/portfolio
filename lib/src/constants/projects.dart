import 'package:portfolio/src/constants/knowledge.dart';
import 'package:portfolio/src/features/projects/domain/project.dart';

final kProjects = [
  Project(
    companyNameEs: 'LA CABANITA - FASTFOOD',
    companyNameEn: 'LA CABANITA - COMIDA RAPIDA',
    shortDescriptionEs: '',
    shortDescriptionEn: '',
    featuresEs: [],
    featuresEn: [],
    myContributionsEs: [],
    myContributionsEn: [],
    tecnologies: [
      ...kKnowledge.tecnologies,
    ],
    mainImageUrl: 'assets/projects/cabanita-main-image.png',
    imagesUrls: [],
  ),
  Project(
    companyNameEs: 'QETO - STARTUP',
    companyNameEn: 'QETO - STARTUP',
    shortDescriptionEs: '',
    shortDescriptionEn: '',
    featuresEs: [],
    featuresEn: [],
    myContributionsEs: [],
    myContributionsEn: [],
    tecnologies: [
      ...kKnowledge.tecnologies,
    ],
    mainImageUrl: 'assets/projects/qeto-main-image.png',
    imagesUrls: [],
  ),
];
