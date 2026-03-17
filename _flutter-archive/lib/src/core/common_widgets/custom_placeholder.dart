import 'package:flutter/material.dart';
import 'package:portfolio/src/core/utils/theme/theme_extension.dart';

class CustomPlaceholder extends StatelessWidget {
  const CustomPlaceholder({
    required this.viewName,
    this.height,
    super.key,
    this.width,
  });
  final String viewName;
  final double? height;
  final double? width;

  @override
  Widget build(BuildContext context) {
    final color = context.theme.colorScheme.primary;
    return SizedBox(
      width: width,
      height: height,
      child: DecoratedBox(
        decoration: BoxDecoration(
          border: Border.all(color: color),
        ),
        child: Align(
          child: Text(
            viewName,
            style: TextStyle(
              color: color,
            ),
          ),
        ),
      ),
    );
  }
}
