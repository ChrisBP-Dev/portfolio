import 'package:flutter/foundation.dart';
import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:portfolio/src/features/projects/domain/image_and_path.dart';
part 'technology.freezed.dart';
part 'technology.g.dart';

@freezed
class Technology with _$Technology {
  // ignore: invalid_annotation_target
  @JsonSerializable(explicitToJson: true)
  const factory Technology({
    required String name,
    required ImageAndPath image,
    @Default('') String id,
    @Default('') String experienceTime,
  }) = _Technology;

  const Technology._();

  factory Technology.fromJson(Map<String, dynamic> json) =>
      _$TechnologyFromJson(json);
}
