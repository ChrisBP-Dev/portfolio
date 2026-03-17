import 'package:flutter/foundation.dart';

extension StringX on String {
  String? get asNullIfEmpty => isEmpty ? null : this;
  bool get isValidUrl {
    const urlPattern = r'^(http|https):\/\/';
    final urlRegex = RegExp(urlPattern);
    return urlRegex.hasMatch(this);
  }

  Uint8List get charCode => Uint8List.fromList(codeUnits);
}

extension StringOrNull on String? {
  bool get isNotNullAndNotEmpty => this != null && this!.isNotEmpty;
  bool get isNullOrEmpty => this == null || this!.isEmpty;
}
