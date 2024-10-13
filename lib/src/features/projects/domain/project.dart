import 'package:portfolio/src/features/knowledge/domain/knowledge.dart';

class Project {
  Project({
    required this.id,
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

  final String id;
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

  bool get hasWebsite => websiteUrl != null;
  bool get hasSourceCode => sourceCodeUrl != null;
}

extension ProjectX on Project {
  String companyName(String languageCode) {
    return languageCode == 'en' ? companyNameEn : companyNameEs;
  }

  String shortDescription(String languageCode) {
    return languageCode == 'en' ? shortDescriptionEn : shortDescriptionEs;
  }

  List<String> features(String languageCode) {
    return languageCode == 'en' ? featuresEn : featuresEs;
  }

  List<String> myContributions(String languageCode) {
    return languageCode == 'en' ? myContributionsEn : myContributionsEs;
  }
}
