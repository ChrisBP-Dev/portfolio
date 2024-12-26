import 'package:flutter/foundation.dart';
import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:portfolio/src/features/projects/domain/image_and_path.dart';
part 'project.freezed.dart';
part 'project.g.dart';

typedef TechnologyID = String;

@freezed
class Project with _$Project {
  // ignore: invalid_annotation_target
  @JsonSerializable(explicitToJson: true)
  const factory Project({
    required String companyNameEs,
    required String companyNameEn,
    required String shortDescriptionEs,
    required String shortDescriptionEn,
    required ImageAndPath mainImage,
    @Default('') String id,
    @Default(<ImageAndPath>[]) List<ImageAndPath> screenshots,
    @Default(<TechnologyID>[]) List<TechnologyID> technologies,
    @Default(<String>[]) List<String> featuresES,
    @Default(<String>[]) List<String> featuresEN,
    String? websiteUrl,
    String? sourceCodeUrl,
  }) = _Project;
  const Project._();

  factory Project.fromJson(Map<String, dynamic> json) =>
      _$ProjectFromJson(json);

  // Uint8List? get mainImageCharCode => mainImage.localImageCharCode;
  // List<Uint8List> get screenshotsCharCodes =>
  //     screenshots.map((ss) => ss.localImageCharCode).toList();
}

extension ProjectX on Project {
  bool get hasWebsite => websiteUrl != null;
  bool get hasSourceCode => sourceCodeUrl != null;

  List<ImageAndPath> get localScreenshots =>
      screenshots.where((ss) => ss.hasLocalImage).toList();

  List<ImageAndPath> get refScreenshots =>
      screenshots.where((ss) => ss.refPath != null).toList();

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
