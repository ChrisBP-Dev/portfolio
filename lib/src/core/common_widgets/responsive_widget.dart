import 'package:flutter/material.dart';
import 'package:portfolio/src/core/constants/breakpoints.dart';

class ResponsiveWidget extends StatelessWidget {
  const ResponsiveWidget({
    required this.mobile,
    required this.desktop,
    this.tablet,
    super.key,
  });

  final Widget mobile;
  final Widget? tablet;
  final Widget desktop;

  @override
  Widget build(BuildContext context) {
    final width = MediaQuery.sizeOf(context).width;
    if (width < Breakpoint.mobile) return mobile;
    if (width < Breakpoint.tablet) return tablet ?? mobile;
    return desktop;
  }
}
