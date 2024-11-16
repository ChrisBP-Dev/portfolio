import 'package:flutter/foundation.dart';
import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:portfolio/src/core/utils/string_extensions.dart';
part 'technology.freezed.dart';
part 'technology.g.dart';

@freezed
class Technology with _$Technology {
  const factory Technology({
    required String name,
    required String imageUrl,
    String? refImage,
    @Default('') String id,
    @Default('') String experienceTime,
  }) = _Technology;

  const Technology._();

  factory Technology.fromJson(Map<String, dynamic> json) =>
      _$TechnologyFromJson(json);
  // required String description;
  // required double experienceTime;
  Uint8List get imageCharCode => imageUrl.charCode;

  bool get hasRefImage => refImage != null && refImage!.isNotEmpty;
  bool get isImageUrl => imageUrl.isValidUrl;
}
