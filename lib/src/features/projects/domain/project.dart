import 'package:flutter/foundation.dart';
import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:portfolio/src/features/technologies/domain/technology.dart';

part 'project.freezed.dart';
part 'project.g.dart';

@freezed
class Project with _$Project {
  const factory Project({
    required String companyNameEs,
    required String companyNameEn,
    required String shortDescriptionEs,
    required String shortDescriptionEn,
    required String mainImageUrl,
    String? refMainImage,
    @Default('') String id,
    @Default(<String>[]) List<String> imagesUrls,
    @Default(<String>[]) List<String> refImagesUrls,
    // @JsonKey(name: Project.technologiesKey)
    @Default(<Technology>[]) List<Technology> technologies,
    @Default(<String>[]) List<String> featuresEs,
    @Default(<String>[]) List<String> featuresEn,
    String? websiteUrl,
    String? sourceCodeUrl,
  }) = _Project;

  factory Project.fromJson(Map<String, dynamic> json) =>
      _$ProjectFromJson(json);

  factory Project.initial() => const Project(
        companyNameEs: '',
        companyNameEn: '',
        shortDescriptionEs: '',
        shortDescriptionEn: '',
        mainImageUrl: '',
        imagesUrls: [''],
      );

  const Project._();

  Uint8List get mainImageCharCode => Uint8List.fromList(mainImageUrl.codeUnits);
  List<Uint8List> get imagesCharCodes =>
      imagesUrls.map((url) => Uint8List.fromList(url.codeUnits)).toList();

  static const String technologiesKey = 'technologies';

  // static Map<String, dynamic> toFirebase(Project project) {
  //   final projectX = project.toJson();

  //   if (project.technologies.isEmpty) return projectX;

  //   projectX['technologies'] =
  //       project.technologies.map((technology) => technology.toJson()).toList();

  //   return projectX;
  // }
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
}
