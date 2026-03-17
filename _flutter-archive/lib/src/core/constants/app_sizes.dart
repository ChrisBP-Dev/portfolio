import 'package:flutter/material.dart';

/// Constant sizes to be used in the app (paddings, gaps, rounded corners etc.)
class Sizes {
  static const p2 = 2.0;
  static const p4 = 4.0;
  static const p8 = 8.0;
  static const p14 = 14.0;
  static const globalPadding = 20.0;
  static const p39 = 39.0;
  static const p48 = 48.0;
  static const p64 = 64.0;
  static const p72 = 72.0;
}

/// Constant gap widths
const gapW20 = SizedBox(width: Sizes.globalPadding);
const gapW64 = SizedBox(width: Sizes.p64);

/// Constant gap heights
const gapH2 = SizedBox(height: Sizes.p2);
const gapH20 = SizedBox(height: Sizes.globalPadding);
const gapH14 = SizedBox(height: Sizes.p14);
const gapH39 = SizedBox(height: Sizes.p39);
const gapH48 = SizedBox(height: Sizes.p48);
const gapH72 = SizedBox(height: Sizes.p72);
