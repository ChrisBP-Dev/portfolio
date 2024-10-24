import 'package:flutter/material.dart';
import 'package:portfolio/src/common_widgets/business_logo.dart';
import 'package:portfolio/src/utils/resize_extensions.dart';

class HeaderLogo extends StatelessWidget {
  const HeaderLogo({super.key});

  @override
  Widget build(BuildContext context) {
    final screenWidth = MediaQuery.sizeOf(context).width;
    return BusinessLogo(
      height: 100,
      width: 180.0.sizeScaled(screenWidth, minSize: 165),
    );
  }
}
