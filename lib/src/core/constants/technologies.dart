import 'package:portfolio/src/features/projects/domain/screenshot_image.dart';
import 'package:portfolio/src/features/technologies/domain/technology.dart';

const kTechnologies = [
  Technology(
    id: '1',
    name: 'Flutter',
    experienceTime: 'over 2 years',
    image: ImageAndPath(
      url: 'https://www.vectorlogo.zone/logos/flutterio/flutterio-icon.svg',
    ),
  ),
  Technology(
    id: '2',
    name: 'Dart',
    experienceTime: 'over 2 years',
    image: ImageAndPath(
      url: 'https://www.vectorlogo.zone/logos/dartlang/dartlang-icon.svg',
    ),
  ),
  Technology(
    id: '3',
    name: 'Firebase',
    experienceTime: 'over 2 years',
    image: ImageAndPath(
      url: 'https://www.vectorlogo.zone/logos/firebase/firebase-icon.svg',
    ),
  ),
];
