import 'package:flutter/material.dart';
import 'package:portfolio/src/core/utils/resize_extensions.dart';
import 'package:portfolio/src/core/utils/theme/theme_extension.dart';

class PrimaryButton extends StatelessWidget {
  const PrimaryButton({required this.title, this.onTap, super.key});
  final String title;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    final screenWidth = MediaQuery.sizeOf(context).width;

    return ElevatedButton(
      style: ElevatedButton.styleFrom(
        padding: EdgeInsets.symmetric(
          horizontal: 30.0.sizeScaled(screenWidth, minSize: 15),
          vertical: 18.0.sizeScaled(screenWidth, minSize: 12),
        ),
        backgroundColor: context.theme.colorScheme.primary,
      ),
      onPressed: onTap,
      child: Text(
        title,
        style: context.labelLarge?.copyWith(
          color: context.theme.scaffoldBackgroundColor,
        ),
      ),
    );
  }
}
