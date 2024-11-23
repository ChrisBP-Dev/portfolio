import 'package:flutter/foundation.dart';
import 'package:portfolio/src/core/utils/string_extensions.dart';

extension Uint8ListX on Uint8List {
  String get codeUnitsString => String.fromCharCodes(this);
  bool get isvalidUrl => codeUnitsString.isValidUrl;
}
