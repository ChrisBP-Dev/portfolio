import 'package:freezed_annotation/freezed_annotation.dart';
part 'technology.freezed.dart';
part 'technology.g.dart';

@freezed
class Technology with _$Technology {
  const factory Technology({
    required String name,
    required String imageUrl,
    @Default('') String experienceTime,
  }) = _Technology;
  // required String description;
  // required double experienceTime;

  factory Technology.fromJson(Map<String, dynamic> json) =>
      _$TechnologyFromJson(json);
}
