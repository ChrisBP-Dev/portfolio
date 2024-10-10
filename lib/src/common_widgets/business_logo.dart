import 'package:flutter/material.dart';
import 'package:portfolio/src/constants/assets.dart';

class BusinessLogo extends StatelessWidget {
  const BusinessLogo({
    this.height,
    this.width,
    this.large = true,
    super.key,
  });

  final double? height;
  final double? width;
  final bool large;

  @override
  Widget build(BuildContext context) {
    return Image.asset(
      large ? Assets.largeLogoDark : Assets.shortLogoDark,
      isAntiAlias: true,
      fit: BoxFit.contain,
      height: height,
      width: width,
    );
  }
}
