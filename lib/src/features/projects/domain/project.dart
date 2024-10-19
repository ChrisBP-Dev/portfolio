import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:portfolio/src/features/knowledge/domain/technology.dart';

part 'project.freezed.dart';
part 'project.g.dart';

@freezed
class Project with _$Project {
  const factory Project({
    required String id,
    required String companyNameEs,
    required String companyNameEn,
    required String shortDescriptionEs,
    required String shortDescriptionEn,
    required List<Technology> technologies,
    required List<String> featuresEs,
    required List<String> featuresEn,
    required List<String> myContributionsEs,
    required List<String> myContributionsEn,
    required String mainImageUrl,
    required List<String> imagesUrls,
    String? websiteUrl,
    String? sourceCodeUrl,
  }) = _Project;

  const Project._();

  factory Project.fromJson(Map<String, dynamic> json) =>
      _$ProjectFromJson(json);

  static Map<String, dynamic> toFirebase(Project project) {
    final projectX = project.toJson();

    if (project.technologies.isEmpty) return projectX;

    projectX['technologies'] =
        project.technologies.map((technology) => technology.toJson()).toList();

    return projectX;
  }
}

extension ProjectX on Project {
  bool get hasWebsite => websiteUrl != null;
  bool get hasSourceCode => sourceCodeUrl != null;

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
