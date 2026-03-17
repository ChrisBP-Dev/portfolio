import 'package:freezed_annotation/freezed_annotation.dart';

part 'experience.freezed.dart';
part 'experience.g.dart';

@freezed
class Experience with _$Experience {
  const factory Experience({
    required String id,
    required String date,
    required String companyName,
    required String jobNameEn,
    required String jobNameEs,
    required List<String> responsabilitiesEn,
    required List<String> responsabilitiesEs,
  }) = _Experience;

  factory Experience.fromJson(Map<String, dynamic> json) =>
      _$ExperienceFromJson(json);
}

extension ExperienceX on Experience {
  String jobName(String languageCode) {
    return languageCode == 'en' ? jobNameEn : jobNameEs;
  }

  List<String> responsabilities(String languageCode) {
    return languageCode == 'en' ? responsabilitiesEn : responsabilitiesEs;
  }
}
