import 'package:flutter/material.dart';
import 'package:portfolio/src/core/utils/resize_extensions.dart';
import 'package:portfolio/src/core/utils/theme/theme_extension.dart';

class SecondaryButton extends StatelessWidget {
  const SecondaryButton({required this.title, super.key, this.onTap});
  final String title;
  final VoidCallback? onTap;
  @override
  Widget build(BuildContext context) {
    final screenWidth = MediaQuery.sizeOf(context).width;

    return OutlinedButton(
      style: OutlinedButton.styleFrom(
        padding: EdgeInsets.symmetric(
          horizontal: 30.0.sizeScaled(screenWidth, minSize: 15),
          vertical: 18.0.sizeScaled(screenWidth, minSize: 12),
        ),
      ),
      onPressed: onTap,
      child: Text(title, style: context.labelLarge),
    );
  }
}
