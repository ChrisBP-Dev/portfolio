import 'package:flutter/foundation.dart';
import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:portfolio/src/core/utils/string_extensions.dart';
part 'image_and_path.freezed.dart';
part 'image_and_path.g.dart';

@freezed
class ImageAndPath with _$ImageAndPath {
  const factory ImageAndPath({
    String? url,
    String? localImage,
    String? refPath,
  }) = _ImageAndPath;
  const ImageAndPath._();

  factory ImageAndPath.fromJson(Map<String, dynamic> json) =>
      _$ImageAndPathFromJson(json);
}

extension ImageAndPathX on ImageAndPath {
  bool get hasRefImage => refPath.isNotNullAndNotEmpty;

  bool get hasLocalImage => localImage.isNotNullAndNotEmpty;
  bool get hasUrl => url.isNotNullAndNotEmpty;
  bool get needsToDelete => !hasUrl && hasRefImage;
  bool get needsToUpdate => hasLocalImage && hasRefImage;
  bool get isEmpty => url.isNullOrEmpty && localImage.isNullOrEmpty;

  Uint8List? get localImageCharCode =>
      hasLocalImage ? localImage!.charCode : null;
}
