import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:portfolio/src/core/utils/string_extensions.dart';
part 'screenshot_image.freezed.dart';
part 'screenshot_image.g.dart';

@freezed
class ScreenshotImage with _$ScreenshotImage {
  const factory ScreenshotImage({
    required String url,
    String? refPath,
  }) = _ScreenshotImage;
  const ScreenshotImage._();

  factory ScreenshotImage.fromJson(Map<String, dynamic> json) =>
      _$ScreenshotImageFromJson(json);

  bool get isUrlValid => url.isValidUrl;
  bool get isRemoved => url.isEmpty && refPath != null;
  bool get isNew => !isUrlValid && refPath == null;
}
