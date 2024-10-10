import 'package:flutter/material.dart';
import 'package:portfolio/src/utils/resize_extensions.dart';

class PrimaryButton extends StatelessWidget {
  const PrimaryButton({required this.text, this.onTap, super.key});
  final String text;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    final currentTheme = Theme.of(context);
    final screenWidth = MediaQuery.of(context).size.width;
    final labelLarge = currentTheme.textTheme.labelLarge;
    return ElevatedButton(
      style: ElevatedButton.styleFrom(
        padding: EdgeInsets.symmetric(
          horizontal: 30.0.sizeScaled(screenWidth, minSize: 10),
          vertical: 18.0.sizeScaled(screenWidth, minSize: 12),
        ),
        backgroundColor: currentTheme.colorScheme.primary,
      ),
      onPressed: onTap,
      child: Text(
        text,
        style: labelLarge?.copyWith(
          color: currentTheme.scaffoldBackgroundColor,
        ),
      ),
    );
  }
}
