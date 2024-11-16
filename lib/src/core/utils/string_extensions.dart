import 'package:flutter/foundation.dart';

extension StringX on String {
  bool get isValidUrl {
    const urlPattern = r'^(http|https):\/\/';
    final urlRegex = RegExp(urlPattern);
    return urlRegex.hasMatch(this);
  }

  Uint8List get charCode => Uint8List.fromList(codeUnits);
}
