import 'package:flutter/foundation.dart';
import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:portfolio/src/core/utils/string_extensions.dart';
part 'project.freezed.dart';
part 'project.g.dart';

typedef TechnologyID = String;

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
    @Default(<String>[]) List<String> screenshotsUrls,
    @Default(<String>[]) List<String> refScreenshotsUrls,
    @Default(<TechnologyID>[]) List<TechnologyID> technologies,
    @Default(<String>[]) List<String> featuresES,
    @Default(<String>[]) List<String> featuresEN,
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
        screenshotsUrls: [''],
      );

  const Project._();

  Uint8List get mainImageCharCode => mainImageUrl.charCode;
  List<Uint8List> get screenshotsCharCodes =>
      screenshotsUrls.map((url) => url.charCode).toList();
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
    return languageCode == 'en' ? featuresEN : featuresES;
  }
}
