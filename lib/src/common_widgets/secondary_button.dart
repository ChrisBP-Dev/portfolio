import 'package:flutter/material.dart';
import 'package:portfolio/src/utils/resize_extensions.dart';

class SecondaryButton extends StatelessWidget {
  const SecondaryButton({required this.title, super.key, this.onTap});
  final String title;
  final VoidCallback? onTap;
  @override
  Widget build(BuildContext context) {
    final currentTheme = Theme.of(context);
    final screenWidth = MediaQuery.of(context).size.width;
    final labelLarge = currentTheme.textTheme.labelLarge;
    return OutlinedButton(
      style: OutlinedButton.styleFrom(
        padding: EdgeInsets.symmetric(
          horizontal: 30.0.sizeScaled(screenWidth, minSize: 10),
          vertical: 18.0.sizeScaled(screenWidth, minSize: 12),
        ),
      ),
      onPressed: onTap,
      child: Text(title, style: labelLarge),
    );
  }
}
