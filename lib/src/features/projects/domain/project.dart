import 'package:portfolio/src/features/knowledge/domain/knowledge.dart';

class Project {
  Project({
    required this.companyNameEs,
    required this.companyNameEn,
    required this.shortDescriptionEs,
    required this.shortDescriptionEn,
    required this.featuresEs,
    required this.featuresEn,
    required this.myContributionsEs,
    required this.myContributionsEn,
    required this.tecnologies,
    required this.mainImageUrl,
    required this.imagesUrls,
    this.websiteUrl,
    this.sourceCodeUrl,
  });

  final String companyNameEs;
  final String companyNameEn;
  final String shortDescriptionEs;
  final String shortDescriptionEn;

  final List<Tecnology> tecnologies;
  final List<String> featuresEs;
  final List<String> featuresEn;
  final List<String> myContributionsEs;
  final List<String> myContributionsEn;
  final String mainImageUrl;
  final List<String> imagesUrls;
  final String? websiteUrl;
  final String? sourceCodeUrl;
}
